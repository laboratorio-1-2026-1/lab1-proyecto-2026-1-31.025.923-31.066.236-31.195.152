const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/categorias-maquinas', categoriasController.getCategoriasMaquinas);

// POST -> crear categoría (solo admin)
router.post('/categorias-maquinas', verificarToken, esAdmin, categoriasController.createCategoria);

module.exports = router;