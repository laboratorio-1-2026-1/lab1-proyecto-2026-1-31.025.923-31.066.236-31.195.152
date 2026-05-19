const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const {verificarToken, esAdminOFinanzas} = require('../middlewares/authMiddleware');

router.post('/ventas', verificarToken, esAdminOFinanzas, ventasController.regventa);
router.get('/ventas', verificarToken, esAdminOFinanzas, ventasController.listarventas);
router.get('/ventas/:id', verificarToken, esAdminOFinanzas, ventasController.listarventaid);


module.exports = router;