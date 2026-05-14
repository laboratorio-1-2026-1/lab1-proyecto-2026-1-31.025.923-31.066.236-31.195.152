const express = require('express');
const router = express.Router();
const accesoController = require('../controllers/accesoController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/accesos', verificarToken, esAdmin, accesoController.getAccesos);
router.post('/accesos/entrada', verificarToken, esAdmin, accesoController.registrarEntrada);

module.exports = router;