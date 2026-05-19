const conexionBaseDatos = require('../config/db')


//GET
const listarproductos = async (req, res) => {
    try {
        const consultaproductos = 'SELECT * FROM productostienda';
        const [listaproductos] = await conexionBaseDatos.query(consultaproductos);

        if (listaproductos.length === 0){
            return res.status(404).json({
                error: true,
                mensaje: 'No se encontraron productos registrados en la tienda.'
            });
        }

        res.status(200).json(listaproductos)
    }catch(errorsv){
        console.error(errorsv)
        res.status(500).json({error : 'Error interno al consultar.'})
    }
}

//POST
const registrarproducto = async (req, res) => {
    const {id_producto, nombre_producto, descripcion, precio, stock} = req.body;

    if (!id_producto || !nombre_producto || !descripcion || !precio || !stock){
        const errorestandar = {
            error: true,
            codigo: '400_Datos_incompletos',
            mensaje: 'Faltan uno o más datos para registrar producto.',
            timestamp: new Date().toISOString()
        }
        return res.status(400).json(errorestandar)
    }
    try{
        const valoresIngresar = [id_producto, nombre_producto, descripcion, precio, stock]
        const consultareg = `INSERT INTO productostienda (id_producto, nombre_producto, descripcion, precio, stock) 
        VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE stock = stock + VALUES(stock)`
        const [resingresar] = await conexionBaseDatos.query(consultareg, valoresIngresar)

        if(resingresar.affectedRows === 1) {
          res.status(201).json({mensaje: 'Producto nuevo registrado exitosamente.'}) 
        } else if (resingresar.affectedRows === 2) {
            res.status(200).json({mensaje: 'El producto ya existía. El stock ha sido sumado exitosamente.'})
        } else {
            res.status(200).json({mensaje: 'Operación realizada (Sin cambios detectados).'})
        }

    } catch(errorsv) {
        console.error("Error en registro/upsert de producto:", errorsv);
        res.status(500).json({ error: 'Error interno al procesar el producto.' });
    } 
}

//GET
const listaporid = async (req, res) => {
    const idprod = req.params.id_producto;
    if(!idprod){
        const errorestandar = {
            error: true,
            codigo: '400_Datos_incompletos', 
            mensaje: 'La ID del producto es necesaria para listar',
            timestamp: new Date().toISOString()
        }
        return res.status(400).json(errorestandar)
    }
    try {
        const consultaid = 'SELECT * FROM productostienda WHERE id_producto = ?'
        const [listaporid] = await conexionBaseDatos.query(consultaid, [idprod])

        if (listaporid.length === 0) {
            return res.status(404).json({error: 'Producto no encontrado.'})
        }
        return res.status(200).json(listaporid[0])
    } catch(errorsv){
        console.error("Error en la consulta del producto por ID:", errorsv)
        res.status(500).json({error: 'Error interno al procesar la solicitud.'})
    }
}

//DELETE
const elimprod = async (req, res) => {
    const idprod = req.params.id_producto;
    if(!idprod){
        const errorestandar = {
            error: true,
            codigo: '400_Datos_incompletos',
            mensaje: 'La ID del producto es necesaria para eliminar',
            timestamp: new Date().toISOString()
        }
        return res.status(400).json(errorestandar)
    }
    try{
        const consultaelim = 'DELETE FROM productostienda WHERE id_producto = ?'
        const [reselim] = await conexionBaseDatos.query(consultaelim, [idprod])

        if (reselim.affectedRows === 0) {
            return res.status(404).json({error: 'El producto no existe.'})
        }
        
        res.status(200).json({mensaje: 'Producto eliminado exitosamente.'})
    }catch(errorsv){
        console.error("Error en la consulta del producto:", errorsv)
        res.status(500).json({error: 'Error interno al procesar la solicitud.'})
    }
}

//PATCH
const actprod = async (req, res) => {
    const idprod = req.params.id_producto;
    const {nombre_producto, descripcion, precio, stock} = req.body;
    
    if(!idprod){
        const errorestandar = {
            error: true,
            codigo: '400_Datos_incompletos',
            mensaje: 'La ID del producto es necesaria para actualizar',
            timestamp: new Date().toISOString()
        };
        return res.status(400).json(errorestandar);
    }

    if (!nombre_producto && !descripcion && !precio && !stock) {
        return res.status(400).json({
            error: true,
            codigo: "400_Datos_incompletos",
            mensaje: "Debe proporcionar al menos un campo para actualizar.",
            timestamp: new Date().toISOString()
        });
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
            return res.status(404).json({ error: 'No se encontró el producto'});
        }
                
        res.status(200).json({mensaje: 'Detalles del producto actualizados correctamente.'});

    } catch(errorsv){
        console.error("Error en la actualización del producto:", errorsv);
        res.status(500).json({error: 'Error interno al procesar la solicitud.'});
    }
}

module.exports = {
    listarproductos,
    registrarproducto,
    listaporid,
    elimprod,
    actprod
}