const express = require('express');
const rutaMembresias = express.Router();
const controladorMembresias = require('../controllers/membresiasController')
const {verificartoken, esAdminoFinanzas} = require('../middlewares/authMiddleware')

rutaMembresias.post('/', controladorMembresias.registrarmem)

module.exports = rutaMembresias;