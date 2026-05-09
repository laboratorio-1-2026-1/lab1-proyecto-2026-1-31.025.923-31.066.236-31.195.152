const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

// POST /api/v1/auth/login (Público)
router.post('/login', authController.login);

// POST /api/v1/auth/register (Protegido: Token + Rol Admin)
router.post('/register', verificarToken, esAdmin, authController.register);

module.exports = router;