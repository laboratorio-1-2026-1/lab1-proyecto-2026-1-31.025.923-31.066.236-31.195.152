const express = require('express');
const router = express.Router();
const gestionDeportivaController = require('../controllers/gestionDeportivaController');
const { verificarToken, esEntrenadorOAdmin, esClienteOAdmin } = require('../middlewares/authMiddleware');

// Disciplinas
router.get('/disciplinas', verificarToken, gestionDeportivaController.getDisciplinas);

// Sesiones
router.get('/sesiones', verificarToken, gestionDeportivaController.getSesiones);
router.post('/sesiones', verificarToken, esEntrenadorOAdmin, gestionDeportivaController.createSesion);

// Reservas
router.get('/reservas', verificarToken, esClienteOAdmin, gestionDeportivaController.getReservas);
router.post('/reservas', verificarToken, esClienteOAdmin, gestionDeportivaController.createReserva);
router.delete('/reservas/:id', verificarToken, esClienteOAdmin, gestionDeportivaController.deleteReserva);

module.exports = router;