const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');
const { verificarToken, esAdmin, esEntrenadorOAdmin } = require('../middlewares/authMiddleware');

// GET global (Administración)
router.get('/evaluaciones', verificarToken, esAdmin, evaluacionController.getEvaluacionesGlobales);

// POST (Solo Entrenadores)
router.post('/evaluaciones', verificarToken, evaluacionController.createEvaluacion);

// GET detalle (Admin, Entrenadores, Clientes)
router.get('/evaluaciones/:id', verificarToken, evaluacionController.getEvaluacionById);

// PATCH (Solo Entrenadores)
router.patch('/evaluaciones/:id', verificarToken, evaluacionController.updateEvaluacion);

// DELETE (Entrenadores, Administración)
router.delete('/evaluaciones/:id', verificarToken, esEntrenadorOAdmin, evaluacionController.deleteEvaluacion);

// GET historial de un cliente en específico (Entrenadores, Clientes)
router.get('/clientes/:id/evaluaciones', verificarToken, evaluacionController.getEvaluacionesPorCliente);

module.exports = router;