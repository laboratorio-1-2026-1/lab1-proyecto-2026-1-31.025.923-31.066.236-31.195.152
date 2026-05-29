const conexionBaseDatos = require('../config/db');

// Función auxiliar para el formato de error JSON 
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

//GET
const listarproductos = async (req, res) => {
    try {
        const consultaproductos = 'SELECT * FROM productostienda';
        const [listaproductos] = await conexionBaseDatos.query(consultaproductos);

        if (listaproductos.length === 0){
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No se encontraron productos registrados en la tienda."));
        }

        res.status(200).json(listaproductos)
    }catch(errorsv){
        console.error(errorsv)
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al consultar productos."));
    }
}

//POST
const registrarproducto = async (req, res) => {
    const {id_producto, nombre_producto, descripcion, precio, stock} = req.body;

    if (!id_producto || !nombre_producto || !descripcion || !precio || !stock){
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Faltan uno o más datos para registrar producto."));
    }
    try{
        const valoresIngresar = [id_producto, nombre_producto, descripcion, precio, stock]
        const consultareg = `INSERT INTO productostienda (id_producto, nombre_producto, descripcion, precio, stock) 
        VALUES (?, ?, ?, ?, ?)`

        const [resultadoreg] = await conexionBaseDatos.query(consultareg, valoresIngresar);

        res.status(201).json({
            mensaje: 'Producto registrado de manera exitosa',
            Identificadorproducto: resultadoreg.insertId
        })
    } catch(errorsv){
        console.error("Error en la insercion del producto:", errorsv);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al procesar los datos."));
    }
}

const listaporid = async (req, res) => {
    const idprod = req.params.id_producto;

    if(!idprod){
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Falta ingresar el ID del producto."));
    }

    try{
        const consulid = `SELECT * FROM productostienda WHERE id_producto = ?`
        const [resid] = await conexionBaseDatos.query(consulid, [idprod])
        
        if(resid.length === 0){
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No se encontro el producto solicitado."));
        }
        
        res.status(200).json(resid)
    }catch(errorsv){
        console.error("Error en la busqueda:", errorsv);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al procesar los datos."));
    }
}

const elimprod = async (req, res) => {
    const idprod = req.params.id_producto;

    if(!idprod){
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "El ID es necesario."));
    }
    try {
        const consulelim = `DELETE FROM productostienda WHERE id_producto = ?`
        const [reselelim] = await conexionBaseDatos.query(consulelim, [idprod])
        
        if(reselelim.affectedRows === 0){
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "Producto no encontrado en el sistema."));
        }

        res.status(200).json({mensaje : "Producto eliminado exitosamente"})
    }catch(errorsv){
        console.error("Error en la solicitud:", errorsv);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al procesar la solicitud."));
    }
}

const actprod = async (req, res) => {
    const idprod = req.params.id_producto;
    const {nombre_producto, descripcion, precio, stock} = req.body;

    if(!idprod){
        return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "Se necesita el ID del producto para actualizar."));
    }

    if (!nombre_producto && !descripcion && !precio && !stock){
        return res.status(400).json(generarError("ERR_SIN_CAMBIOS", "Debe proporcionar al menos un campo para actualizar."));
    }

    try {
        let consultaact = 'UPDATE productostienda SET ';
        const valoract = [];
        const camposmod = [];
        
        if(nombre_producto) {
            camposmod.push('nombre_producto = ?');
            valoract.push(nombre_producto);
        }
        if(descripcion) {
            camposmod.push('descripcion = ?');
            valoract.push(descripcion);
        }
        if(precio) {
            camposmod.push('precio = ?');
            valoract.push(precio);
        }
        if(stock){
            camposmod.push('stock = ?');
            valoract.push(stock);
        }

        consultaact += camposmod.join(', '); 
        consultaact += ' WHERE id_producto = ?'; 
        valoract.push(idprod);

        const [resact] = await conexionBaseDatos.query(consultaact, valoract);
                
        if (resact.affectedRows === 0) {
            return res.status(404).json(generarError("ERR_NO_ENCONTRADO", "No se encontró el producto."));
        }
                
        res.status(200).json({mensaje: 'Detalles del producto actualizados correctamente.'});

    } catch(errorsv){
        console.error("Error en la actualización del producto:", errorsv);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error interno al procesar la solicitud."));
    }
}

module.exports = {
    listarproductos,
    registrarproducto,
    listaporid,
    elimprod,
    actprod
}