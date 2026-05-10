const db = require('../config/db');

const createTicket = async (req, res) => {
    const { id_maquina, id_usuario, fecha_falla, descripcion_falla, fecha_resolucion, costo_reparacion, estado} = req.body;

    if (!id_maquina || !id_usuario || !descripcion_falla) {
        return res.status(400).json({ error: 'id_maquina, id_usuario y descripcion_falla son obligatorios.' });
    }

    const allowedMachineStates = ['En mantenimiento', 'Fuera de Servicio'];
    const newMachineState = allowedMachineStates.includes(estado)
        ? estado
        : 'En mantenimiento';

    try {
        const [machineRows] = await db.query('SELECT id_maquinas FROM Maquinas WHERE id_maquinas = ? LIMIT 1', [id_maquina]);
        if (machineRows.length === 0) {
            return res.status(404).json({ error: 'Máquina no encontrada.' });
        }

        const ticketDate = fecha_falla || new Date().toISOString().slice(0, 10);

        const [result] = await db.query(
            'INSERT INTO ticketsmantenimiento (id_maquina, id_usuario, fecha_falla, descripcion_falla, fecha_resolucion, costo_reparacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_maquina, id_usuario, ticketDate, descripcion_falla, fecha_resolucion, costo_reparacion, estado]
        );

        await db.query('UPDATE Maquinas SET estado = ? WHERE id_maquinas = ?', [newMachineState, id_maquina]);

        res.status(201).json({
            message: 'Ticket de falla creado y estado de máquina actualizado.',
            id_ticket: result.insertId,
            estado_maquina: newMachineState
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear ticket de falla.' });
    }
};

module.exports = { createTicket };