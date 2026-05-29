const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Función auxiliar para el formato de error JSON 
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});
const getRoleIdByName = async (roleName) => {
    const [rows] = await db.query('SELECT id_rol FROM Roles WHERE nombre_rol = ? LIMIT 1', [roleName]);
    return rows.length ? rows[0].id_rol : null;
};

const userExists = async (cedula, email) => {
    const [rows] = await db.query('SELECT id_usuario FROM Usuarios WHERE cedula = ? OR email = ? LIMIT 1', [cedula, email]);
    return rows.length > 0;
};

const registerCliente = async (req, res) => {
    const { cedula, nombre, apellido, email, password, telefono } = req.body;

    if (!cedula || !nombre || !apellido || !email || !password || !telefono) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Todos los campos son obligatorios..."));
    }

    try {
        if (await userExists(cedula, email)) {
            return res.status(409).json(generarError("ERR_DUPLICADO", "El email o la cédula ya están registrados."));
        }

        const roleId = await getRoleIdByName('Cliente') || 4;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [usuarioResult] = await db.query(
            'INSERT INTO Usuarios (id_rol, cedula, nombre, apellido, email, password, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [roleId, cedula, nombre, apellido, email, hashedPassword, telefono]
        );

        const idUsuario = usuarioResult.insertId;
        const [clienteResult] = await db.query(
            'INSERT INTO Clientes (id_usuario) VALUES (?)',
            [idUsuario]
        );

        res.status(201).json({
            message: 'Cliente registrado con éxito',
            id_usuario: idUsuario,
            id_cliente: clienteResult.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al registrar cliente."));
    }
};

const createEntrenador = async (req, res) => {
    const { cedula, nombre, apellido, email, password, telefono, especialidad } = req.body;

    if (!cedula || !nombre || !apellido || !email || !password || !telefono || !especialidad) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Todos los campos son obligatorios para crear un entrenador."));
    }

    try {
        if (await userExists(cedula, email)) {
            return res.status(409).json(generarError("ERR_DUPLICADO", "El email o la cédula ya están registrados."));
        }

        const roleId = await getRoleIdByName('Entrenador') || 3;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [usuarioResult] = await db.query(
            'INSERT INTO Usuarios (id_rol, cedula, nombre, apellido, email, password, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [roleId, cedula, nombre, apellido, email, hashedPassword, telefono]
        );

        const idUsuario = usuarioResult.insertId;
        const [entrenadorResult] = await db.query(
            'INSERT INTO Entrenadores (id_usuario, especialidad) VALUES (?, ?)',
            [idUsuario, especialidad]
        );

        res.status(201).json({
            message: 'Entrenador creado con éxito',
            id_usuario: idUsuario,
            id_entrenador: entrenadorResult.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al crear entrenador."));
    }
};

const createStaff = async (req, res) => {
    const { id_rol, cedula, nombre, apellido, email, password, telefono } = req.body;

    if (!id_rol || !cedula || !nombre || !apellido || !email || !password || !telefono) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Todos los campos son obligatorios para crear un staff."));
    }

    try {
        if (await userExists(cedula, email)) {
            return res.status(409).json(generarError("ERR_DUPLICADO", "El email o la cédula ya están registrados."));
        }

        const [roleRows] = await db.query('SELECT nombre_rol FROM Roles WHERE id_rol = ? LIMIT 1', [id_rol]);
        const roleName = roleRows.length ? roleRows[0].nombre_rol : null;
        const allowedRoles = ['Administración', 'Admin', 'Finanzas', 'Finanzas'];

        if (!roleName && id_rol !== 1 && id_rol !== 4) {
            return res.status(400).json(generarError("ERR_ROL_NO_PERMITIDO", "Solo se pueden crear cuentas de Administración o Finanzas."));
        }

        if (roleName && !allowedRoles.includes(roleName)) {
            return res.status(400).json(generarError("ERR_ROL_NO_PERMITIDO", "Solo se pueden crear cuentas de Administración o Finanzas."));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [usuarioResult] = await db.query(
            'INSERT INTO Usuarios (id_rol, cedula, nombre, apellido, email, password, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_rol, cedula, nombre, apellido, email, hashedPassword, telefono]
        );

        res.status(201).json({ message: 'Cuenta de staff creada con éxito', id_usuario: usuarioResult.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al crear cuenta de staff."));
    }
};

const listUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT u.id_usuario, u.cedula, u.nombre, u.apellido, u.email, u.telefono, r.nombre_rol AS rol FROM Usuarios u LEFT JOIN Roles r ON u.id_rol = r.id_rol'
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al listar usuarios."));
    }
};

const listRoles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id_rol, nombre_rol FROM Roles');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al listar roles."));
    }
};

module.exports = {
    registerCliente,
    createEntrenador,
    createStaff,
    listUsuarios,
    listRoles
};
