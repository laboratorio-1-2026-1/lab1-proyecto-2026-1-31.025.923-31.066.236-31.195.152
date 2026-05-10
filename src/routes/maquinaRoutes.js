const express = require('express');
const router = express.Router();
const maquinaController = require('../controllers/maquinaController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', maquinaController.getMaquinas);
router.post('/', verificarToken, esAdmin, maquinaController.createMaquina);
router.patch('/:id/estado', verificarToken, esAdmin, maquinaController.updateMaquinaEstado);

module.exports = router;