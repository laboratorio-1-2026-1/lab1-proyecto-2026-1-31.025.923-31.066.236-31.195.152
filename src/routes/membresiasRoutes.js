
const express = require('express');
const router = express.Router();
const membresiasController = require('../controllers/membresiasController');
const { verificarToken, esAdmin, esAdminOFinanzas, esAdminFinanzasOCliente } = require('../middlewares/authMiddleware');

// GET /api/v1/membresias?estado=Activa
router.get('/membresias', verificarToken, esAdminOFinanzas, membresiasController.getMembresias);

// GET /api/v1/membresias/cliente/:id
router.get('/membresias/cliente/:id', verificarToken, esAdminFinanzasOCliente, membresiasController.getMembresiaCliente);

// PATCH /api/v1/membresias/:id/estado
router.patch('/membresias/:id/estado', verificarToken, esAdmin, membresiasController.updateMembresiaEstado);

// POST /api/v1/membresias
router.post('/membresias', verificarToken, esAdmin, membresiasController.createMembresia);
module.exports = router;
