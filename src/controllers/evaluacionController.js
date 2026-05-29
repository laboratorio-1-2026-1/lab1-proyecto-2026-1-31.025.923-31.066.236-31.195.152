const db = require('../config/db');

const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

// 1. GET /api/v1/evaluaciones (Solo Administración)
const getEvaluacionesGlobales = async (req, res) => {
    try {
        const query = `
            SELECT e.id_evaluacion, e.peso, e.altura, e.porcentaje_grasa, e.fecha_evaluacion,
                   c.id_cliente, uc.nombre AS nombre_cliente, uc.apellido AS apellido_cliente,
                   en.id_entrenador, ue.nombre AS nombre_entrenador
            FROM evaluacionbiometrica e
            JOIN clientes c ON e.id_cliente = c.id_cliente
            JOIN usuarios uc ON c.id_usuario = uc.id_usuario
            JOIN entrenadores en ON e.id_entrenador = en.id_entrenador
            JOIN usuarios ue ON en.id_usuario = ue.id_usuario
            ORDER BY e.fecha_evaluacion DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError('ERR_SERVIDOR', 'Error al obtener evaluaciones globales.'));
    }
};

// 2. GET /api/v1/evaluaciones/:id (Administración, Entrenadores, Clientes)
const getEvaluacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM evaluacionbiometrica WHERE id_evaluacion = ? LIMIT 1', [id]);
        if (rows.length === 0) return res.status(404).json(generarError('ERR_NO_ENCONTRADO', 'Evaluación no encontrada.'));

        const evaluacion = rows[0];

        // Seguridad: Si es cliente, verificar que la evaluación sea suya
        if (req.user.id_rol === 4) {
            const [clienteRows] = await db.query('SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1', [req.user.id_usuario]);
            if (clienteRows.length === 0 || clienteRows[0].id_cliente !== evaluacion.id_cliente) {
                return res.status(403).json(generarError('ERR_ACCESO_DENEGADO', 'No tienes permiso para ver esta evaluación.'));
            }
        }
        res.json(evaluacion);
    } catch (error) {
        res.status(500).json(generarError('ERR_SERVIDOR', 'Error al obtener el detalle de la evaluación.'));
    }
};

// 3. GET /api/v1/clientes/:id/evaluaciones (Entrenadores, Clientes)
const getEvaluacionesPorCliente = async (req, res) => {
    const id_cliente_param = parseInt(req.params.id);

    try {
        if (req.user.id_rol === 1) return res.status(403).json(generarError('ERR_ACCESO_DENEGADO', 'Ruta reservada para Entrenadores y Clientes.'));

        // Seguridad: Si es cliente, verificar que coincida su ID
        if (req.user.id_rol === 4) {
            const [clienteRows] = await db.query('SELECT id_cliente FROM clientes WHERE id_usuario = ? LIMIT 1', [req.user.id_usuario]);
            if (clienteRows.length === 0 || clienteRows[0].id_cliente !== id_cliente_param) {
                return res.status(403).json(generarError('ERR_ACCESO_DENEGADO', 'No tienes permiso para ver el historial de otro cliente.'));
            }
        }

        const [rows] = await db.query('SELECT * FROM evaluacionbiometrica WHERE id_cliente = ? ORDER BY fecha_evaluacion DESC', [id_cliente_param]);
        res.json(rows);
    } catch (error) {
        res.status(500).json(generarError('ERR_SERVIDOR', 'Error al obtener historial del cliente.'));
    }
};

// 4. POST /api/v1/evaluaciones (Solo Entrenador)
const createEvaluacion = async (req, res) => {
    if (req.user.id_rol !== 3) return res.status(403).json(generarError('ERR_ACCESO_DENEGADO', 'Solo los entrenadores pueden registrar evaluaciones.'));

    const { id_cliente, peso, altura, porcentaje_grasa, observaciones } = req.body;
    if (!id_cliente || !peso || !altura) return res.status(400).json(generarError('ERR_DATOS_INCOMPLETOS', 'id_cliente, peso y altura son obligatorios.'));

    try {
        // Obtener el id_entrenador del token de quien hace la petición
        const [entrenadorRows] = await db.query('SELECT id_entrenador FROM entrenadores WHERE id_usuario = ? LIMIT 1', [req.user.id_usuario]);
        if (entrenadorRows.length === 0) return res.status(404).json(generarError('ERR_NO_ENCONTRADO', 'Perfil de entrenador no válido.'));
        
        const id_entrenador = entrenadorRows[0].id_entrenador;
        const fechaActual = new Date().toISOString().split('T')[0];

        const [result] = await db.query(
            'INSERT INTO evaluacionbiometrica (id_cliente, id_entrenador, peso, altura, porcentaje_grasa, observaciones, fecha_evaluacion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_cliente, id_entrenador, peso, altura, porcentaje_grasa || null, observaciones || null, fechaActual]
        );

        res.status(201).json({ message: 'Evaluación registrada', id_evaluacion: result.insertId });
    } catch (error) {
        res.status(500).json(generarError('ERR_SERVIDOR', 'Error al registrar evaluación.'));
    }
};

// 5. PATCH /api/v1/evaluaciones/:id (Solo Entrenadores)
const updateEvaluacion = async (req, res) => {
    if (req.user.id_rol !== 3) return res.status(403).json(generarError('ERR_ACCESO_DENEGADO', 'Solo los entrenadores pueden actualizar evaluaciones.'));

    const { id } = req.params;
    const { peso, altura, porcentaje_grasa, observaciones } = req.body;

    if (!peso && !altura && !porcentaje_grasa && !observaciones) {
        return res.status(400).json(generarError('ERR_SIN_CAMBIOS', 'Debe enviar al menos un campo para actualizar.'));
    }

    try {
        const campos = [];
        const valores = [];

        if (peso) { campos.push('peso = ?'); valores.push(peso); }
        if (altura) { campos.push('altura = ?'); valores.push(altura); }
        if (porcentaje_grasa !== undefined) { campos.push('porcentaje_grasa = ?'); valores.push(porcentaje_grasa); }
        if (observaciones !== undefined) { campos.push('observaciones = ?'); valores.push(observaciones); }

        valores.push(id);
        const query = `UPDATE evaluacionbiometrica SET ${campos.join(', ')} WHERE id_evaluacion = ?`;

        const [result] = await db.query(query, valores);
        if (result.affectedRows === 0) return res.status(404).json(generarError('ERR_NO_ENCONTRADO', 'Evaluación no encontrada.'));

        res.json({ message: 'Evaluación actualizada correctamente.' });
    } catch (error) {
        res.status(500).json(generarError('ERR_SERVIDOR', 'Error al actualizar evaluación.'));
    }
};

// 6. DELETE /api/v1/evaluaciones/:id (Entrenadores, Administración)
const deleteEvaluacion = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM evaluacionbiometrica WHERE id_evaluacion = ?', [id]);
        
        if (result.affectedRows === 0) return res.status(404).json(generarError('ERR_NO_ENCONTRADO', 'Evaluación no encontrada.'));
        
        res.json({ message: 'Registro de evaluación eliminado con éxito.' });
    } catch (error) {
        res.status(500).json(generarError('ERR_SERVIDOR', 'Error al eliminar evaluación.'));
    }
};

module.exports = { 
    getEvaluacionesGlobales, 
    getEvaluacionById, 
    getEvaluacionesPorCliente, 
    createEvaluacion, 
    updateEvaluacion, 
    deleteEvaluacion 
};