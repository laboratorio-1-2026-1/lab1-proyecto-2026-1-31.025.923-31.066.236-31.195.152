const conexionBaseDatos = require('../config/db')

const regventa = async (req, res) => {
    const {id_producto, id_usuario, cantidad, precio_unitario} = req.body

    if(!id_producto || !id_usuario || !cantidad || !precio_unitario){
        const errorestandar = {
            error: true,
            codigo: '400_Datos_incompletos', 
            mensaje: 'ERR_DATOS_INCOMPLETOS',
            timestamp: new Date().toISOString()
        }
        return res.status(400).json(errorestandar)
    } 

    try{
        const consultaUsuario = 'SELECT id_usuario FROM Usuarios WHERE id_usuario = ?';
        const [usuarioEncontrado] = await conexionBaseDatos.query(consultaUsuario, [id_usuario]);

        if (usuarioEncontrado.length === 0) {
            return res.status(404).json({
                error: true,
                codigo: '404_Usuario_No_Encontrado',
                mensaje: 'El usuario proporcionado no existe en el sistema.'
            });
        }

        const consultaProducto = 'SELECT id_producto, stock FROM ProductosTienda WHERE id_producto = ?';
        const [productoEncontrado] = await conexionBaseDatos.query(consultaProducto, [id_producto]);

        if (productoEncontrado.length === 0) {
            return res.status(404).json({
                error: true,
                codigo: '404_Producto_No_Encontrado',
                mensaje: 'El producto proporcionado no existe en la tienda.'
            });
        }

        const stockActual = productoEncontrado[0].stock;
        if (stockActual < cantidad) {
            return res.status(409).json({
                error: true,
                codigo: '409_Stock_Insuficiente',
                mensaje: `No hay suficiente stock para la venta. Stock actual: ${stockActual}`
            });
        }

        const consultventastiend = `INSERT INTO ventastienda (id_usuario, monto_total) VALUES (?, ?)`
        const calcmonto = (cantidad * precio_unitario)
        const valoresinsertp = [id_usuario, calcmonto]
        const [resulventatiend] = await conexionBaseDatos.query(consultventastiend, valoresinsertp)

        const idventatiend = resulventatiend.insertId
        const consultventasprod = `INSERT INTO ventaproductos (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`
        const valoresinsertq = [idventatiend, id_producto, cantidad, precio_unitario]
        const [resulventaprod] = await conexionBaseDatos.query(consultventasprod, valoresinsertq)

        const consultadescuento = `UPDATE productostienda SET stock = stock - ? WHERE id_producto = ?`;
        await conexionBaseDatos.query(consultadescuento, [cantidad, id_producto]);

        res.status(201).json({
            mensaje: 'Venta registrada con éxito y stock descontado.',
            id_recibo: idventatiend
        });

    }catch(errorsv){
        console.error("Error en registro de la venta", errorsv);
        res.status(500).json({ error: 'Error interno al procesar los datos.' });
    }

}

const listarventas = async (req, res) => {
try{
    const consultalista = `SELECT * FROM ventastienda`
    const [listaventas] = await conexionBaseDatos.query(consultalista)

    if (listaventas.length === 0) {
        return res.status(404).json({mensaje : "No se encontraron ventas"})
    }

    return res.status(200).json({listaventas})

}catch(errorsv){
    console.error("Error en solicitud de la venta", errorsv);
        res.status(500).json({ error: 'Error interno al procesar los datos.' });
}
} 


const listarventaid = async (req, res) => {
try{
    const idventa = req.params.id

    if(!idventa){
        const errorestandar = {
            error: true,
            codigo: '400_Datos_incompletos', 
            mensaje: 'La ID de la venta es necesaria para listar',
            timestamp: new Date().toISOString()
        }
        return res.status(400).json(errorestandar)
    }
    
    const consultalistaid = `SELECT * FROM ventastienda where id_venta = ?`
    const [listaventas] = await conexionBaseDatos.query(consultalistaid, [idventa])

    if (listaventas.length === 0) {
        return res.status(404).json({mensaje : "No se encontraron ventas"})
    }

    return res.status(200).json(listaventas)

}catch(errorsv){
    console.error("Error en solicitud de la venta", errorsv);
        res.status(500).json({ error: 'Error interno al procesar los datos.' });
}
} 

module.exports = {
regventa,
listarventas,
listarventaid
};
