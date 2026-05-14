const db = require('../config/db');

const getCategoriasMaquinas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categoriasmaquinas');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener el catálogo de categorías de máquinas."));
    }
};

module.exports = { getCategoriasMaquinas };