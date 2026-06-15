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
    const { rol } = req.query;

    try {
        let sql = 'SELECT u.id_usuario, u.cedula, u.nombre, u.apellido, u.email, u.telefono, r.nombre_rol AS rol FROM Usuarios u LEFT JOIN Roles r ON u.id_rol = r.id_rol';
        const params = [];

        if (rol) {
            sql += ' WHERE r.nombre_rol = ?';
            params.push(rol);
        }

        const [rows] = await db.query(sql, params);
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

// DELETE /api/v1/usuarios/:id
const deleteUsuario = async (req, res) => {
    const idUsuarioParam = req.params.id;

    if (!idUsuarioParam) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Se requiere id_usuario para eliminar el usuario."));
    }

    const idUsuario = Number(idUsuarioParam);

    if (req.user && req.user.id_usuario === idUsuario) {
        return res.status(403).json(generarError("ERR_AUTOELIMINACION", "No puedes eliminar tu propia cuenta."));
    }

    try {
        const [userRows] = await db.query('SELECT id_rol FROM Usuarios WHERE id_usuario = ? LIMIT 1', [idUsuario]);
        if (userRows.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Usuario no encontrado."));
        }

        const userRole = userRows[0].id_rol;

        await db.query('START TRANSACTION');

        if (userRole === 4) { // Cliente
            await db.query('DELETE FROM Clientes WHERE id_usuario = ?', [idUsuario]);
        } else if (userRole === 3) { // Entrenador
            await db.query('DELETE FROM Entrenadores WHERE id_usuario = ?', [idUsuario]);
        }

        const [delRes] = await db.query('DELETE FROM Usuarios WHERE id_usuario = ?', [idUsuario]);

        if (delRes.affectedRows === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Usuario no encontrado al intentar eliminar."));
        }

        await db.query('COMMIT');

        res.status(200).json({ mensaje: 'Usuario eliminado correctamente', id_usuario: idUsuario });
    } catch (error) {
        console.error(error);
        try { await db.query('ROLLBACK'); } catch (e) {}
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al eliminar el usuario."));
    }
};

module.exports = {
    registerCliente,
    createEntrenador,
    createStaff,
    listUsuarios,
    listRoles
    ,deleteUsuario
};
