const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.post('/clientes', usuariosController.registerCliente);
router.post('/entrenadores', verificarToken, esAdmin, usuariosController.createEntrenador);
router.get('/clientes', verificarToken, esAdmin, usuariosController.getClientes);
router.get('/entrenadores', verificarToken, esAdmin, usuariosController.getEntrenadores);
router.post('/usuarios/staff', verificarToken, esAdmin, usuariosController.createStaff);
router.get('/usuarios', verificarToken, esAdmin, usuariosController.listUsuarios);
router.get('/roles', verificarToken, esAdmin, usuariosController.listRoles);

// DELETE por ID en la ruta
router.delete('/usuarios/:id', verificarToken, esAdmin, usuariosController.deleteUsuario);

module.exports = router;
