const express = require('express');
const router = express.Router();
const maquinaController = require('../controllers/maquinaController');

router.get('/', maquinaController.getMaquinas);

module.exports = router;