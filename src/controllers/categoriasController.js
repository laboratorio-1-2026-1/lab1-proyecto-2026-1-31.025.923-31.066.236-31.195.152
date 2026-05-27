const db = require('../config/db');

// Formato estándar de error (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

const getCategoriasMaquinas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categoriasmaquinas');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener el catálogo de categorías de máquinas."));
    }
};

// POST /api/v1/categorias-maquinas (Solo Admin)
const createCategoria = async (req, res) => {
    const { nombre_categoria } = req.body;

    if (!nombre_categoria) {
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "El nombre de la categoría es obligatorio."));
    }

    try {
        const [existing] = await db.query('SELECT id_categoria FROM categoriasmaquinas WHERE nombre_categoria = ? LIMIT 1', [nombre_categoria]);
        if (existing.length > 0) {
            return res.status(409).json(generarError("ERR_DUPLICADO", "La categoría ya existe."));
        }

        const [result] = await db.query('INSERT INTO categoriasmaquinas (nombre_categoria) VALUES (?)', [nombre_categoria]);

        res.status(201).json({ id_categoria: result.insertId, nombre_categoria });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al crear la categoría de máquinas."));
    }
};

module.exports = { getCategoriasMaquinas, createCategoria };