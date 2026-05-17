const express = require('express');
const rutaPlanes = express.Router();
const controladorPlanes = require('../controllers/planController');
const {verificarToken, esAdminOFinanzas} = require('../middlewares/authMiddleware');

//GET /api/v1/planes
rutaPlanes.get('/', controladorPlanes.obtenerPlanes);

rutaPlanes.post('/', verificarToken, esAdminOFinanzas, controladorPlanes.registrarplan)

rutaPlanes.patch('/:id_plan', verificarToken, esAdminOFinanzas, controladorPlanes.actualizarplan)

rutaPlanes.delete('/:id_plan', verificarToken, esAdminOFinanzas, controladorPlanes.eliminarplan)

module.exports = rutaPlanes;
