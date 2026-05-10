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

module.exports = { getMaquinas, createMaquina };