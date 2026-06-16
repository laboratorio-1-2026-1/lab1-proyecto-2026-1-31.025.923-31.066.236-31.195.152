const db = require('../config/db');

// Función auxiliar para el formato de error JSON (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

const getAccesos = async (req, res) => {
    try {
        const { fecha, id_cliente } = req.query;
        // Hacemos un JOIN para que la administración vea el nombre y cédula, no solo un ID
        let query = `
            SELECT ca.id_acceso, u.cedula, u.nombre, u.apellido, ca.fecha_entrada, ca.hora_entrada
            FROM ControlAccesos ca
            JOIN Clientes c ON ca.id_cliente = c.id_cliente
            JOIN Usuarios u ON c.id_usuario = u.id_usuario
            WHERE 1=1
        `;
        const params = [];

        if (fecha) {
            query += ' AND ca.fecha_entrada = ?';
            params.push(fecha);
        }
        if (id_cliente) {
            query += ' AND ca.id_cliente = ?';
            params.push(id_cliente);
        }

        query += ' ORDER BY ca.fecha_entrada DESC, ca.hora_entrada DESC';

        const [rows] = await db.query(query, params);
        
        if (rows.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No existen accesos registrados."));
        }
        
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener los registros de acceso."));
    }
};

const registrarEntrada = async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Se requiere la cédula del cliente."));
    }

    try {
        // 1. Buscar al cliente por su cédula
        const [userRows] = await db.query(
            `SELECT c.id_cliente 
             FROM Usuarios u 
             JOIN Clientes c ON u.id_usuario = c.id_usuario 
             WHERE u.cedula = ? AND u.id_rol = 4 LIMIT 1`,
            [cedula]
        );

        if (userRows.length === 0) {
            return res.status(404).json(generarError("ERR_CLIENTE_NO_ENCONTRADO", "No existe un cliente registrado con esa cédula."));
        }

        const id_cliente = userRows[0].id_cliente;

        // 2. Regla de Negocio Crítica: Validar Membresía Activa
        const [membresiaRows] = await db.query(
            `SELECT id_membresias FROM MembresiasCliente 
             WHERE id_cliente = ? AND estado = 'Activa' LIMIT 1`,
            [id_cliente]
        );

        if (membresiaRows.length === 0) {
            // Se rechaza el acceso porque no hay membresía activa
            return res.status(409).json(generarError("ERR_MEMBRESIA_INACTIVA", "Acceso denegado: El cliente no posee una membresía vigente."));
        }

        // 3. Registrar el acceso capturando la hora exacta del servidor
        // Usamos variables de JS para extraer fecha y hora en formato MySQL
        const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const horaActual = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

        const [result] = await db.query(
            'INSERT INTO ControlAccesos (id_cliente, fecha_entrada, hora_entrada) VALUES (?, ?, ?)',
            [id_cliente, fechaActual, horaActual]
        );

        res.status(201).json({ 
            message: 'Acceso autorizado. Torniquete abierto.', 
            id_acceso: result.insertId,
            fecha: fechaActual,
            hora: horaActual
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al procesar el control de acceso."));
    }
};

module.exports = { getAccesos, registrarEntrada };