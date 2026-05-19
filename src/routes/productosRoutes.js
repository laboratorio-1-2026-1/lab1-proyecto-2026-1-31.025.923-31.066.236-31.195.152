const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const {verificarToken, esAdminOFinanzas, esAdmin} = require('../middlewares/authMiddleware');

router.get('/productos', productosController.listarproductos);
router.post('/productos', verificarToken, esAdminOFinanzas, productosController.registrarproducto);
router.get('/productos/:id_producto', productosController.listaporid);
router.delete('/productos/:id_producto', verificarToken, esAdmin, productosController.elimprod);
router.patch('/productos/:id_producto', verificarToken, esAdminOFinanzas, productosController.actprod);



module.exports = router;