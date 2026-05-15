const conexionBaseDatos = require('../config/db')


const registrarmem = async (req, res) => {
    const {id_cliente, id_plan} = req.body;

    if (!id_cliente || !id_plan){
        const errorestandar = {
            error: true,
            codigo: "400_Datos_Incompletos",
            mensaje: "Es requerida la ID del cliente y la ID del plan para registrar.",
            timestamp: new Date().toISOString()
        };
        return res.status(400).json(errorestandar);
    }

    try {
        const fechainicio = new Date().toISOString.split('T')[0];
        const consultareg = `
        INSERT INTO membresiascliente (id_cliente, id_plan, fecha_inicio, estado)
        VALUES (?, ?, ?, ?)
        `
        const valoresreg = [id_cliente, id_plan, fechainicio, 'Activa'];
        const [resulreg] = await conexionBaseDatos.query(consultareg, valoresreg);

        res.status(201).json({
            mensaje: "Membresía registrada y activada con éxito.",
            id_membresia: resulreg.insertId,
            fecha_inicio: fechainicio
        });
    }catch (errorsv){
       if (errorsv.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ 
                error: true,
                codigoInterno: "400_Referencia_Invalida",
                mensaje: "El cliente o el plan especificado no existen en la base de datos.",
                timestamp: new Date().toISOString()
            });
        }

        res.status(500).json({ error: 'Error interno al intentar registrar la membresía.' }); 
    }

}


const memglobales = async (req,res) =>{
    const filtroestado = req.query.estado;

    try{
        const consultaglobal = `
        SELECT 
            mc.id_membresias
            mc.fecha_inicio,
            p.nombre AS nombre_plan,
            p.duracion_dias,
            u.nombre AS nombre_cliente,
            u apellido AS apellido_cliente
            u.cedula
        FROM membresiascliente mc
        INNER JOIN planessuscripcion p ON mc.id_plan = p.id_plan
        INNER JOIN clientes c ON mc.id_cliente = c.id_cliente
        INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
        ORDER BY mc.fecha_inicio DESC
        `;

        const [listamem] = await conexionBaseDatos.query(consultaglobal);


    }catch{}
}

module.exports = {
    registrarmem
}