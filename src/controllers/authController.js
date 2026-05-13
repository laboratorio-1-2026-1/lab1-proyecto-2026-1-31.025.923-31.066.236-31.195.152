const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { id_rol, cedula, nombre, apellido, email, password, telefono, especialidad } = req.body;

    if (!id_rol || !cedula || !nombre || !apellido || !email || !password || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios: id_rol, cedula, nombre, apellido, email, password y telefono.' });
    }

    if (id_rol === 3 && !especialidad) {
        return res.status(400).json({ error: 'La especialidad es obligatoria para entrenadores.' });
    }

    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar en la tabla Usuarios
        const [result] = await db.query(
            'INSERT INTO Usuarios (id_rol, cedula, nombre, apellido, email, password, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_rol, cedula, nombre, apellido, email, hashedPassword, telefono]
        );

        const idUsuario = result.insertId;

        if (id_rol === 4) {
            await db.query('INSERT INTO Clientes (id_usuario) VALUES (?)', [idUsuario]);
        } else if (id_rol === 3) {
            await db.query('INSERT INTO Entrenadores (id_usuario, especialidad) VALUES (?, ?)', [idUsuario, especialidad]);
        }

        res.status(201).json({ message: 'Usuario registrado con éxito', id_usuario: idUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario. Verifique si el email o cédula ya existen.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por email
        const [rows] = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = rows[0];

        // Comparar contraseña encriptada
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Crear Token JWT
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Bienvenido',
            token,
            user: {
                nombre: usuario.nombre,
                rol: usuario.id_rol
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
};

module.exports = { register, login };