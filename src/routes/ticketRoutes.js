const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.post('/tickets', verificarToken, esAdmin, ticketController.createTicket);

module.exports = router;
