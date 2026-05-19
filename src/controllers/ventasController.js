const conexionBaseDatos = require('../config/db');

// Función auxiliar para el formato de error JSON (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

const regventa = async (req, res) => {
    const {id_producto, id_usuario, cantidad, precio_unitario} = req.body

    if(!id_producto || !id_usuario || !cantidad || !precio_unitario){
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Faltan datos obligatorios para registrar la venta."));
    } 

    try{
        const consultaUsuario = 'SELECT id_usuario FROM Usuarios WHERE id_usuario = ?';
        const [usuarioEncontrado] = await conexionBaseDatos.query(consultaUsuario, [id_usuario]);

        if (usuarioEncontrado.length === 0) {
            return res.status(404).json(generarError("ERR_USUARIO_NO_ENCONTRADO", "El usuario proporcionado no existe en el sistema."));
        }

        const consultaProducto = 'SELECT id_producto, stock FROM productostienda WHERE id_producto = ?';
        const [productoEncontrado] = await conexionBaseDatos.query(consultaProducto, [id_producto]);

        if (productoEncontrado.length === 0) {
            return res.status(404).json(generarError("ERR_PRODUCTO_NO_ENCONTRADO", "El producto proporcionado no existe en el sistema."));
        }

        const stockDisponible = productoEncontrado[0].stock;
        if (cantidad > stockDisponible) {
            return res.status(400).json(generarError("ERR_STOCK_INSUFICIENTE", `Stock insuficiente. Disponible: ${stockDisponible}, Solicitado: ${cantidad}.`));
        }

        // Iniciar la transacción para asegurar coherencia de datos
        await conexionBaseDatos.query('START TRANSACTION');

        const monto_total = cantidad * precio_unitario;
        const consultaventa = `INSERT INTO ventastienda (id_usuario, monto_total) VALUES (?, ?)`;
        const [resultadoventa] = await conexionBaseDatos.query(consultaventa, [id_usuario, monto_total]);
        
        const id_venta = resultadoventa.insertId;
        const consultadetalle = `INSERT INTO ventaproductos (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`;
        await conexionBaseDatos.query(consultadetalle, [id_venta, id_producto, cantidad, precio_unitario]);
        
        const nuevostock = stockDisponible - cantidad;
        const consultaupdatestock = `UPDATE productostienda SET stock = ? WHERE id_producto = ?`;
        await conexionBaseDatos.query(consultaupdatestock, [nuevostock, id_producto]);

        await conexionBaseDatos.query('COMMIT');
        
        res.status(201).json({
            mensaje: 'Venta registrada con éxito',
            id_venta: id_venta,
            total: monto_total
        });
        
    } catch(errorsv){
        await conexionBaseDatos.query('ROLLBACK');
        console.error("Error en la transacción de venta:", errorsv);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al procesar los datos."));
    }
}

const listarventas = async (req, res) => {
    try{
        const consultalista = `SELECT * FROM ventastienda`
        const [listaventas] = await conexionBaseDatos.query(consultalista)

        if (listaventas.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No se encontraron ventas."));
        }

        return res.status(200).json(listaventas);

    }catch(errorsv){
        console.error("Error en solicitud de la venta", errorsv);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al procesar los datos."));
    }
} 

const listarventaid = async (req, res) => {
    try{
        const idventa = req.params.id

        if(!idventa){
            return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "La ID de la venta es necesaria para listar."));
        }
        
        const consultalistaid = `SELECT * FROM ventastienda where id_venta = ?`
        const [listaventas] = await conexionBaseDatos.query(consultalistaid, [idventa])

        if (listaventas.length === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No se encontraron ventas con ese ID."));
        }

        return res.status(200).json(listaventas[0]);

    } catch(errorsv){
        console.error("Error en búsqueda por ID", errorsv);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al procesar los datos."));
    }
}

module.exports = {
    regventa,
    listarventas,
    listarventaid
}