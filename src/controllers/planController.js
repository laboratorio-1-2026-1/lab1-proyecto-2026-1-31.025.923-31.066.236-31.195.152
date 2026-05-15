const conexionBaseDatos = require('../config/db');

const obtenerPlanes = async (req, res) => {
    try {
        const consultaObtenerPlanes = 'SELECT * FROM planesSuscripcion';
        const [filasDePlanesEncontrados] = await conexionBaseDatos.query(consultaObtenerPlanes);
        res.status(200).json(filasDePlanesEncontrados);
    } catch (errorDelServidor){
        res.status(500).json({error: 'Error interno al consultar.'});
    }
}

const registrarplan = async (req, res) => {
    const {nombre, costo, descripcion, duracion_dias} = req.body;
    
    if (!nombre || !costo || !duracion_dias){
        const objetoErrorEstandarizado = {
            error: true,
            codigoInterno: "400_Datos_Incompletos",
            mensaje: "El nombre, costo y duración del plan son obligatorios.",
            timestamp: new Date().toISOString()
        };
        return res.status(400).json(objetoErrorEstandarizado); 
    }
    
    try {
        const consultaInsertarNuevoPlan = `INSERT INTO planesSuscripcion (nombre, costo, descripcion, duracion_dias) VALUES (?, ?, ?, ?)`;
        const valoresParaInsertar = [nombre, costo, descripcion, duracion_dias];
        
        const [resultadoInsercionBaseDatos] = await conexionBaseDatos.query(consultaInsertarNuevoPlan, valoresParaInsertar);

        res.status(201).json({
            mensaje: 'Plan de suscripción registrado con éxito',
            idplan: resultadoInsercionBaseDatos.insertId
        });

    } catch (errorDelServidor){
        console.error(errorDelServidor); // Esto te ayudará a ver en la terminal si hay otro error de MySQL
        res.status(500).json({error: 'Error interno al registrar plan.'});
    }
};

const actualizarplan = async (req, res) => {
    const identificadorDelPlanAActualizar = req.params.id_plan;
    const {costo, descripcion, duracion_dias} = req.body;

    if (!costo && !descripcion && !duracion_dias){ 
        const objetoErrorEstandarizado = {
            error: true,
            codigoInterno: "400_Sin_Cambios",
            mensaje: "Debe proporcionar al menos un campo para actualizar.",
            timestamp: new Date().toISOString()
        };
        return res.status(400).json(objetoErrorEstandarizado); 
    }
    
    try {
        let consultaActualizacionParcial = 'UPDATE planesSuscripcion SET ';
        const valoresParaActualizar = [];
        const camposModificados = [];

        if(costo){
            camposModificados.push('costo = ?');
            valoresParaActualizar.push(costo);
        }
        if(descripcion){
            camposModificados.push('descripcion = ?'); 
            valoresParaActualizar.push(descripcion);
        }
        if(duracion_dias){
            camposModificados.push('duracion_dias = ?');
            valoresParaActualizar.push(duracion_dias);
        }
        
        consultaActualizacionParcial += camposModificados.join(', '); 
        consultaActualizacionParcial += ' WHERE id_plan = ?'; 
        valoresParaActualizar.push(identificadorDelPlanAActualizar);

        const [resultadoActualizacionBaseDatos] = await conexionBaseDatos.query(consultaActualizacionParcial, valoresParaActualizar);
        
        if (resultadoActualizacionBaseDatos.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró el plan'});
        }
        
        res.status(200).json({mensaje: 'Detalles del plan actualizados correctamente.'});
    } catch (errorDelServidor) {
        console.error(errorDelServidor);
        res.status(500).json({error: 'Error interno al actualizar.'});
    }
}; 

const eliminarplan = async (req, res) => {
   const idelim = req.params.id_plan;

    try {
       const consultelim = 'DELETE from planessuscripcion WHERE id_plan = ?'
       const [resulelim] = await conexionBaseDatos.query(consultelim, idelim)

        if(resulelim.affectedRows === 0){
            return res.status(500).json({error: 'Plan no encontrado.'})
        }

    res.status(200).json({mensaje: 'Plan eliminado con éxito.'})
    }
    catch (errorsv){
        res.status(500).json({error: 'Error interno al eliminar.'})
    }


}

module.exports = {
    obtenerPlanes,
    registrarplan,
    actualizarplan,
    eliminarplan
};