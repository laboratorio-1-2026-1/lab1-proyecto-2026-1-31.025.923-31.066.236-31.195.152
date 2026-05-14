const db = require('../config/db');

// Función auxiliar para el formato de error JSON (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

// Obtener inventario físico de máquinas
const getMaquinas = async (req, res) => {
    const { estado, categoria } = req.query;

    try {
        const whereClauses = [];
        const params = [];

        if (estado) {
            whereClauses.push('m.estado = ?');
            params.push(estado);
        }

        if (categoria) {
            if (/^\d+$/.test(categoria)) {
                whereClauses.push('m.id_categoria = ?');
                params.push(Number(categoria));
            } else {
                whereClauses.push('c.nombre_categoria = ?');
                params.push(categoria);
            }
        }

        const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const sql = `
            SELECT m.*, c.nombre_categoria AS categoria_nombre
            FROM Maquinas m
            LEFT JOIN categoriasmaquinas c ON m.id_categoria = c.id_categoria
            ${whereSql}
        `;

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener el inventario físico de máquinas."));
    }
};

// Crear una nueva máquina
const createMaquina = async (req, res) => {
    const { id_categoria, nombre_maquina, descripcion_tecnica, estado } = req.body;

    if (!id_categoria || !nombre_maquina || !descripcion_tecnica || !estado) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Los campos id_categoria, nombre_maquina, descripcion_tecnica y estado son obligatorios."));
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Maquinas (id_categoria, nombre_maquina, descripcion_tecnica, estado) VALUES (?, ?, ?, ?)',
            [id_categoria, nombre_maquina, descripcion_tecnica, estado]
        );

        res.status(201).json({
            message: 'Máquina registrada con éxito',
            id_maquina: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al registrar máquina."));
    }
};

// Actualizar estado de una máquina
const updateMaquinaEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "El campo estado es obligatorio."));
    }

    try {
        // Verificar si la máquina existe
        const [existing] = await db.query('SELECT id_maquinas FROM Maquinas WHERE id_maquinas = ? LIMIT 1', [id]);
        if (existing.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Máquina no encontrada."));
        }

        // Actualizar el estado
        await db.query('UPDATE Maquinas SET estado = ? WHERE id_maquinas = ?', [estado, id]);

        res.json({ message: 'Estado de la máquina actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al actualizar el estado de la máquina."));
    }
};

module.exports = { getMaquinas, createMaquina, updateMaquinaEstado };