const conexionBaseDatos = require('../config/db');

// Función auxiliar para el formato de error JSON (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

const obtenerPlanes = async (req, res) => {
    try {
        const consultaObtenerPlanes = 'SELECT * FROM planessuscripcion';
        const [filasDePlanesEncontrados] = await conexionBaseDatos.query(consultaObtenerPlanes);
        res.status(200).json(filasDePlanesEncontrados);
    } catch (errorDelServidor){
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al consultar los planes."));
    }
}

const registrarplan = async (req, res) => {
    const {nombre, costo, descripcion, duracion_dias} = req.body;
    
    if (!nombre || !costo || !duracion_dias){
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "El nombre, costo y duración del plan son obligatorios.")); 
    }
    
    try {
        const consultaInsertarNuevoPlan = `INSERT INTO planessuscripcion (nombre_plan, costo_plan, descripcion_plan, duracion_plan) VALUES (?, ?, ?, ?)`;
        const valoresParaInsertar = [nombre, costo, descripcion, duracion_dias];
        
        const [resultadoInsercionBaseDatos] = await conexionBaseDatos.query(consultaInsertarNuevoPlan, valoresParaInsertar);

        res.status(201).json({
            mensaje: 'Plan registrado con éxito.',
            identificadorNuevoPlan: resultadoInsercionBaseDatos.insertId
        });

    } catch (errorDelServidor){
        console.error(errorDelServidor);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al registrar el plan."));
    }
};

const actualizarplan = async (req, res) => {
    const identificadorDelPlanAActualizar = req.params.id_plan;
    const {nombre, costo, descripcion, duracion_dias} = req.body;

    if (!nombre && !costo && !descripcion && !duracion_dias){
        return res.status(400).json(generarError("ERR_SIN_CAMBIOS", "Debe proporcionar al menos un campo para actualizar."));
    }

    try {
        let consultaActualizacionParcial = 'UPDATE planessuscripcion SET ';
        const valoresParaActualizar = [];
        const camposModificados = [];
        
        if (nombre) {
            camposModificados.push('nombre_plan = ?');
            valoresParaActualizar.push(nombre);
        }
        if (costo) {
            camposModificados.push('costo_plan = ?');
            valoresParaActualizar.push(costo);
        }
        if (descripcion) {
            camposModificados.push('descripcion_plan = ?');
            valoresParaActualizar.push(descripcion);
        }
        if (duracion_dias) {
            camposModificados.push('duracion_plan = ?');
            valoresParaActualizar.push(duracion_dias);
        }
        
        consultaActualizacionParcial += camposModificados.join(', '); 
        consultaActualizacionParcial += ' WHERE id_plan = ?'; 
        valoresParaActualizar.push(identificadorDelPlanAActualizar);

        const [resultadoActualizacionBaseDatos] = await conexionBaseDatos.query(consultaActualizacionParcial, valoresParaActualizar);
        
        if (resultadoActualizacionBaseDatos.affectedRows === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No se encontró el plan."));
        }
        
        res.status(200).json({mensaje: 'Detalles del plan actualizados correctamente.'});
    } catch (errorDelServidor) {
        console.error(errorDelServidor);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al actualizar."));
    }
}; 

const eliminarplan = async (req, res) => {
   const idelim = req.params.id_plan;

    try {
       const consultelim = 'DELETE from planessuscripcion WHERE id_plan = ?'
       const [resulelim] = await conexionBaseDatos.query(consultelim, idelim)

        if(resulelim.affectedRows === 0){
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Plan no encontrado."));
        }

        res.status(200).json({mensaje: 'Plan eliminado con éxito.'})
    }
    catch (errorsv){
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al eliminar el plan."));
    }
}

module.exports = {
    obtenerPlanes,
    registrarplan,
    actualizarplan,
    eliminarplan
};