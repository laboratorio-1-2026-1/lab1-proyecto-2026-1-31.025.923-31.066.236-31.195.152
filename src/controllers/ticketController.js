const db = require('../config/db');

// Función auxiliar para el formato de error JSON (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

const createTicket = async (req, res) => {
    const { id_maquina, id_usuario, fecha_falla, descripcion_falla, estado} = req.body;

    if (!id_maquina || !id_usuario || !descripcion_falla) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "id_maquina, id_usuario y descripcion_falla son obligatorios."));
    }

    const allowedMachineStates = ['En mantenimiento', 'Fuera de Servicio'];
    const newMachineState = allowedMachineStates.includes(estado)
        ? estado
        : 'En mantenimiento';

    try {
        const [machineRows] = await db.query('SELECT id_maquinas FROM Maquinas WHERE id_maquinas = ? LIMIT 1', [id_maquina]);
        if (machineRows.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Máquina no encontrada."));
        }

        const ticketDate = fecha_falla || new Date().toISOString().slice(0, 10);
        const ticketState = 'Abierto';

        const [result] = await db.query(
            'INSERT INTO ticketsmantenimiento (id_maquina, id_usuario, fecha_falla, descripcion_falla, fecha_resolucion, costo_reparacion, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_maquina, id_usuario, ticketDate, descripcion_falla, null, null, ticketState]
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

const resolveTicket = async (req, res) => {
    const { id } = req.params;
    const { fecha_resolucion, costo_reparacion } = req.body;

    if (!fecha_resolucion || costo_reparacion == null) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "fecha_resolucion y costo_reparacion son obligatorios para resolver el ticket."));
    }

    try {
        const [ticketRows] = await db.query(
            'SELECT id_maquina FROM ticketsmantenimiento WHERE id_ticket = ? LIMIT 1',
            [id]
        );

        if (ticketRows.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Ticket no encontrado."));
        }

        const ticket = ticketRows[0];
        const ticketState = 'Cerrado';

        await db.query(
            'UPDATE ticketsmantenimiento SET fecha_resolucion = ?, costo_reparacion = ?, estado = ? WHERE id_ticket = ?',
            [fecha_resolucion, costo_reparacion, ticketState, id]
        );

        const [machineResult] = await db.query(
            'UPDATE Maquinas SET estado = ? WHERE id_maquinas = ?',
            ['Activa', ticket.id_maquina]
        );

        if (machineResult.affectedRows === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Máquina asociada no encontrada."));
        }

        res.json({
            message: 'Ticket resuelto y estado de la máquina revertido a Activa.',
            id_ticket: Number(id),
            estado_ticket: ticketState,
            estado_maquina: 'Activa'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al resolver el ticket.' });
    }
};

module.exports = { createTicket, resolveTicket };