const db = require('../config/db');

// Formato estándar de error (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

const getMembresias = async (req, res) => {
    try {
        const { estado } = req.query;

        let query = `
            SELECT id_membresias, id_cliente, id_plan, fecha_inicio, estado
            FROM MembresiasCliente
        `;

        const params = [];
        if (estado) {
            query += ' WHERE estado = ?';
            params.push(estado);
        }

        query += ' ORDER BY fecha_inicio DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener las membresías."));
    }
};

const getMembresiaCliente = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Se requiere el id del cliente."));
        }

        if (req.user.id_rol === 4) {
            const [clienteRows] = await db.query(
                'SELECT id_cliente FROM Clientes WHERE id_usuario = ? LIMIT 1',
                [req.user.id_usuario]
            );

            if (clienteRows.length === 0 || clienteRows[0].id_cliente.toString() !== id.toString()) {
                return res.status(403).json(generarError("ERR_PERMISO", "No tienes permiso para consultar la membresía de otro cliente."));
            }
        }

        const [rows] = await db.query(
            'SELECT id_membresias, id_cliente, id_plan, fecha_inicio, estado FROM MembresiasCliente WHERE id_cliente = ? ORDER BY fecha_inicio DESC LIMIT 1',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json(generarError("ERR_MEMBRESIA_NO_ENCONTRADA", "No se encontró la membresía del cliente especificado."));
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener la membresía del cliente."));
    }
};

const updateMembresiaEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "El campo estado es obligatorio."));
        }

        const [result] = await db.query(
            'UPDATE MembresiasCliente SET estado = ? WHERE id_membresias = ? LIMIT 1',
            [estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json(generarError("ERR_MEMBRESIA_NO_ENCONTRADA", "No se encontró la membresía especificada."));
        }

        res.json({
            message: 'Estado de membresía actualizado con éxito.',
            id_membresias: Number(id),
            estado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al actualizar el estado de la membresía."));
    }
};

const createMembresia = async (req, res) => {
    try {
        const { id_cliente, id_plan } = req.body;

        if (!id_cliente || !id_plan) {
            return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "id_cliente e id_plan son obligatorios."));
        }

        // Verificar existencia del cliente
        const [clienteRows] = await db.query('SELECT id_cliente FROM Clientes WHERE id_cliente = ? LIMIT 1', [id_cliente]);
        if (clienteRows.length === 0) {
            return res.status(404).json(generarError("ERR_CLIENTE_NO_ENCONTRADO", "Cliente no encontrado."));
        }

        // Verificar existencia del plan
        const [planRows] = await db.query('SELECT id_plan FROM planesSuscripcion WHERE id_plan = ? LIMIT 1', [id_plan]);
        if (planRows.length === 0) {
            return res.status(404).json(generarError("ERR_PLAN_NO_ENCONTRADO", "Plan no encontrado."));
        }

        // Insertar membresía sin fecha_inicio ni estado (se manejarán por procesos aparte)
        const [result] = await db.query(
            'INSERT INTO MembresiasCliente (id_cliente, id_plan) VALUES (?, ?)',
            [id_cliente, id_plan]
        );

        res.status(201).json({
            message: 'Membresía registrada',
            id_membresias: result.insertId,
            id_cliente: Number(id_cliente),
            id_plan: Number(id_plan)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al registrar la membresía."));
    }
};

module.exports = { getMembresias, getMembresiaCliente, updateMembresiaEstado, createMembresia };
