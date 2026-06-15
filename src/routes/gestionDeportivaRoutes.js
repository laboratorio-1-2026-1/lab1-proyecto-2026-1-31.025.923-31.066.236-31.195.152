const express = require('express');
const router = express.Router();
const gestionDeportivaController = require('../controllers/gestionDeportivaController');
const { verificarToken, esEntrenadorOAdmin, esClienteOAdmin, esAdmin } = require('../middlewares/authMiddleware');

// Disciplinas
router.get('/disciplinas', verificarToken, gestionDeportivaController.getDisciplinas);
router.post('/disciplinas', verificarToken, esAdmin, gestionDeportivaController.createDisciplina)

// Sesiones
router.get('/sesiones', verificarToken, gestionDeportivaController.getSesiones);
router.post('/sesiones', verificarToken, esEntrenadorOAdmin, gestionDeportivaController.createSesion);

// Reservas
router.get('/reservas', verificarToken, esClienteOAdmin, gestionDeportivaController.getReservas);
router.post('/reservas', verificarToken, esClienteOAdmin, gestionDeportivaController.createReserva);
router.delete('/reservas/:id', verificarToken, esClienteOAdmin, gestionDeportivaController.deleteReserva);

module.exports = router;