const db = require('../config/db');

// Función auxiliar para generar el formato de error exigido
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

// DISCIPLINAS
// DISCIPLINAS
const getDisciplinas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Disciplinas');

        if (rows.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No hay disciplinas registradas."));
        }

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener disciplinas."));
    }
};

const createDisciplina = async (req, res) => {
    const { nombre_disciplina, descripcion } = req.body;

    // Validación de entrada (400)
    if (!nombre_disciplina) {
        return res.status(400).json(generarErrorEstructurado("Bad Request", "ERR_DATOS_INCOMPLETOS", "El nombre de la disciplina es obligatorio."));
    }

    try {
        const [existente] = await db.query('SELECT id_disciplina FROM Disciplinas WHERE nombre_disciplina = ? LIMIT 1', [nombre_disciplina]);
        
        if (existente.length > 0) {
            return res.status(409).json(generarErrorEstructurado("Conflict", "ERR_DUPLICADO", `La disciplina '${nombre_disciplina}' ya se encuentra registrada en el sistema.`));
        }

        const [result] = await db.query(
            'INSERT INTO Disciplinas (nombre_disciplina, descripcion) VALUES (?, ?)',
            [nombre_disciplina, descripcion || null]
        );

        res.status(201).json({ 
            message: 'Disciplina registrada con éxito', 
            id_disciplina: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno al registrar la disciplina." });
    }
};

// SESIONES PROGRAMADAS
const getSesiones = async (req, res) => {
    try {
        const { fecha, id_disciplina } = req.query;
        let query = `
            SELECT s.id_sesion, d.nombre_disciplina, e.especialidad, u.nombre AS nombre_entrenador, 
                   s.fecha, s.hora_inicio, s.hora_cierre, s.cupos_maximos
            FROM SesionesProgramadas s
            JOIN Disciplinas d ON s.id_disciplina = d.id_disciplina
            JOIN Entrenadores e ON s.id_entrenador = e.id_entrenador
            JOIN Usuarios u ON e.id_usuario = u.id_usuario
            WHERE 1=1
        `;
        const params = [];

        if (fecha) {
            query += ' AND s.fecha = ?';
            params.push(fecha);
        }
        if (id_disciplina) {
            query += ' AND s.id_disciplina = ?';
            params.push(id_disciplina);
        }

        query += ' ORDER BY s.fecha ASC, s.hora_inicio ASC';
        
        const [rows] = await db.query(query, params);

        //Para sesiones con fecha o disciplina inválida

        if (rows.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No se encontraron sesiones programadas bajo la fecha o disciplina especificadas."))
        }

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener sesiones."));
    }
};

const createSesion = async (req, res) => {
    const { id_disciplina, id_entrenador, fecha, hora_inicio, hora_cierre, cupos_maximos } = req.body;

    if (!id_disciplina || !id_entrenador || !fecha || !hora_inicio || !hora_cierre || !cupos_maximos) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Todos los campos son obligatorios."));
    }

    try {
        // Regla de Negocio: No Duplicidad de Entrenador (Solapamiento)
        // La fórmula lógica es: (A.inicio < B.cierre) AND (A.cierre > B.inicio)
        const [overlap] = await db.query(
            `SELECT id_sesion FROM SesionesProgramadas 
             WHERE id_entrenador = ? AND fecha = ? 
             AND (hora_inicio < ? AND hora_cierre > ?) LIMIT 1`,
            [id_entrenador, fecha, hora_cierre, hora_inicio]
        );

        if (overlap.length > 0) {
            return res.status(409).json(generarError(
                "ERR_SOLAPAMIENTO_ENTRENADOR", 
                "El entrenador ya tiene una clase asignada que choca con este horario."
            ));
        }

        const [result] = await db.query(
            'INSERT INTO SesionesProgramadas (id_disciplina, id_entrenador, fecha, hora_inicio, hora_cierre, cupos_maximos) VALUES (?, ?, ?, ?, ?, ?)',
            [id_disciplina, id_entrenador, fecha, hora_inicio, hora_cierre, cupos_maximos]
        );

        res.status(201).json({ message: 'Sesión programada con éxito', id_sesion: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al programar sesión. Verifique los datos ingresados."));
    }
};

// RESERVAS E INSCRIPCIONES
const getReservas = async (req, res) => {
    try {
        let query = `
            SELECT r.id_reservas, r.fecha_reserva, s.fecha, s.hora_inicio, d.nombre_disciplina 
            FROM Reservas r
            JOIN SesionesProgramadas s ON r.id_sesion = s.id_sesion
            JOIN Disciplinas d ON s.id_disciplina = d.id_disciplina
        `;
        const params = [];

        // Si es Cliente, solo ve las suyas. Si es Admin, puede enviar un id_cliente por query o ver todas
        if (req.user.id_rol === 4) { 
            // Necesitamos buscar el id_cliente asociado al id_usuario del token
            const [cliente] = await db.query('SELECT id_cliente FROM Clientes WHERE id_usuario = ?', [req.user.id_usuario]);
            if (!cliente.length) return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Perfil de cliente no encontrado"));

            query += ' WHERE r.id_cliente = ?';
            params.push(cliente[0].id_cliente);
        } else if (req.query.id_cliente) {
            query += ' WHERE r.id_cliente = ?';
            params.push(req.query.id_cliente);
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener reservas."));
    }
};

const createReserva = async (req, res) => {
    const { id_sesion } = req.body;

    if (!id_sesion) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Se requiere el id_sesion."));
    }

    try {
        // Obtenemos datos del cliente actual usando el Token
        let id_cliente = req.body.id_cliente; // Por si el admin quiere reservar por alguien
        if (req.user.id_rol === 4) {
            const [clienteRows] = await db.query('SELECT id_cliente FROM Clientes WHERE id_usuario = ?', [req.user.id_usuario]);
            if (!clienteRows.length) return res.status(403).json({ error: 'No es un cliente válido.' });
            id_cliente = clienteRows[0].id_cliente;
        }

        // 2. Obtener detalles de la sesión deseada
        const [sesionRows] = await db.query('SELECT fecha, hora_inicio, hora_cierre, cupos_maximos FROM SesionesProgramadas WHERE id_sesion = ?', [id_sesion]);
        if (!sesionRows.length) return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "La sesión no existe."));
        const sesionObj = sesionRows[0];

        // Regla Crítica 1: Límite de Capacidad
        const [ocupadosRows] = await db.query('SELECT COUNT(*) as ocupados FROM Reservas WHERE id_sesion = ?', [id_sesion]);
        if (ocupadosRows[0].ocupados >= sesionObj.cupos_maximos) {
            return res.status(409).json(generarError("ERR_CUPO_LLENO", "La sesión ha alcanzado su capacidad máxima."));
        }

        // Regla Crítica 2: Solapamiento del Cliente
        const [overlapCliente] = await db.query(
            `SELECT r.id_reservas FROM Reservas r
             JOIN SesionesProgramadas s ON r.id_sesion = s.id_sesion
             WHERE r.id_cliente = ? AND s.fecha = ? 
             AND (s.hora_inicio < ? AND s.hora_cierre > ?) LIMIT 1`,
            [id_cliente, sesionObj.fecha, sesionObj.hora_cierre, sesionObj.hora_inicio]
        );

        if (overlapCliente.length > 0) {
            return res.status(409).json(generarError("ERR_SOLAPAMIENTO_CLIENTE", "Ya tienes una reserva que choca con este horario."));
        }

        // Insertar Reserva
        const [result] = await db.query(
            'INSERT INTO Reservas (id_cliente, id_sesion) VALUES (?, ?)',
            [id_cliente, id_sesion]
        );

        res.status(201).json({ message: 'Reserva confirmada con éxito', id_reserva: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al procesar la reserva."));
    }
};

const deleteReserva = async (req, res) => {
    const id_reserva = req.params.id;

    try {
        // Obtener la reserva para validar propiedad si es cliente
        const [reservaRows] = await db.query('SELECT id_cliente FROM Reservas WHERE id_reservas = ?', [id_reserva]);
        if (!reservaRows.length) return res.status(404).json({ error: 'Reserva no encontrada.' });

        if (req.user.id_rol === 4) {
            const [clienteRows] = await db.query('SELECT id_cliente FROM Clientes WHERE id_usuario = ?', [req.user.id_usuario]);
            if (clienteRows[0].id_cliente !== reservaRows[0].id_cliente) {
                return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva.' });
            }
        }

        await db.query('DELETE FROM Reservas WHERE id_reservas = ?', [id_reserva]);
        res.json({ message: 'Reserva cancelada correctamente. Cupo liberado.' });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al cancelar la reserva."));
    }
};

module.exports = {
    getDisciplinas,
    createDisciplina,
    getSesiones,
    createSesion,
    getReservas,
    createReserva,
    deleteReserva
};