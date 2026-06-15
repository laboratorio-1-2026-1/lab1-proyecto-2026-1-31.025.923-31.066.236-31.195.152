const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verificarToken, esAdmin, esAdminOFinanzas } = require('../middlewares/authMiddleware');

router.get('/tickets', verificarToken, esAdminOFinanzas, ticketController.getTickets);
router.post('/tickets', verificarToken, esAdmin, ticketController.createTicket);
router.patch('/tickets/:id/resolver', verificarToken, esAdminOFinanzas, ticketController.resolveTicket);

module.exports = router;
