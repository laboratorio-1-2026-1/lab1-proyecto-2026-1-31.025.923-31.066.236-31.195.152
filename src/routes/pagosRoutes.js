const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { verificarToken, esAdminOFinanzas } = require('../middlewares/authMiddleware');

router.get('/pagos', verificarToken, esAdminOFinanzas, pagosController.getPagos);
router.post('/pagos', verificarToken, esAdminOFinanzas, pagosController.crearPago);

module.exports = router;
