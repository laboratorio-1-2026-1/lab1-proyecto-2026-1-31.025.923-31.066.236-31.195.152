const db = require('../config/db');

// Obtener todas las máquinas
const getMaquinas = async (req, res) => {
    try {
        // Hacemos una consulta a la tabla que ya tienes creada
        const [rows] = await db.query('SELECT * FROM Maquinas');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener máquinas' });
    }
};

// Crear una nueva máquina
const createMaquina = async (req, res) => {
    const { id_categoria, nombre_maquina, descripcion_tecnica, estado } = req.body;

    if (!id_categoria || !nombre_maquina || !descripcion_tecnica || !estado) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: id_categoria, nombre, descripcion_tecnica, estado.' });
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
        res.status(500).json({ error: 'Error al registrar máquina.' });
    }
};

// Actualizar estado de una máquina
const updateMaquinaEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ error: 'El campo estado es obligatorio.' });
    }

    try {
        // Verificar si la máquina existe
        const [existing] = await db.query('SELECT id_maquinas FROM Maquinas WHERE id_maquinas = ? LIMIT 1', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Máquina no encontrada.' });
        }

        // Actualizar el estado
        await db.query('UPDATE Maquinas SET estado = ? WHERE id_maquinas = ?', [estado, id]);

        res.json({ message: 'Estado de la máquina actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado de la máquina.' });
    }
};

module.exports = { getMaquinas, createMaquina, updateMaquinaEstado };