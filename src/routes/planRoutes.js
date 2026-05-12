const express = require('express');
const rutaPlanes = express.Router();
const controladorPlanes = require('../controllers/planController');
const {verificarToken, esAdminofinanzas} = require('../middlewares/authMiddleware');

//GET /api/v1/planes
rutaPlanes.get('/', controladorPlanes.obtenerPlanes);

rutaPlanes.post('/', verificarToken, esAdminofinanzas, controladorPlanes.registrarplan)

rutaPlanes.patch('/:id_plan', verificarToken, esAdminofinanzas, controladorPlanes.actualizarplan)

rutaPlanes.delete('/:id_plan', verificarToken, esAdminofinanzas, controladorPlanes.eliminarplan)

module.exports = rutaPlanes;
