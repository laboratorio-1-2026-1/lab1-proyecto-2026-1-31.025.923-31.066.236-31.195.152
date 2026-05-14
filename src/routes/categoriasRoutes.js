const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');

router.get('/categorias-maquinas', categoriasController.getCategoriasMaquinas);

module.exports = router;