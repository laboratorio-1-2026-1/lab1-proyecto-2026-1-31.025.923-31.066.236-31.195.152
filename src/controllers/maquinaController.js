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

module.exports = { getMaquinas };