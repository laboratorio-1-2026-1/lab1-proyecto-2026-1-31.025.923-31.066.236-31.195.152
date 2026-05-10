const express = require('express');
const router = express.Router();
const maquinaController = require('../controllers/maquinaController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', maquinaController.getMaquinas);
router.post('/', verificarToken, esAdmin, maquinaController.createMaquina);

module.exports = router;