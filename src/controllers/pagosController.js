const db = require('../config/db');

// Formato estándar de error (RNF03)
const generarError = (codigo, mensaje) => ({
    error: true,
    codigoInterno: codigo,
    mensaje,
    timestamp: new Date().toISOString()
});

const crearPago = async (req, res) => {
    try {
        const { id_membresia, monto } = req.body;

        if (!id_membresia || monto == null) {
            return res.status(400).json(generarError("ERR_DATOS_INCOMPLETOS", "id_membresia y monto son obligatorios."));
        }

        const fechaPago = new Date().toISOString().split('T')[0];

        const [membresiaRows] = await db.query(
            'SELECT id_membresias FROM MembresiasCliente WHERE id_membresias = ? LIMIT 1',
            [id_membresia]
        );

        if (membresiaRows.length === 0) {
            return res.status(404).json(generarError("ERR_MEMBRESIA_NO_ENCONTRADA", "No se encontró la membresía especificada."));
        }

        const [result] = await db.query(
            'INSERT INTO pagos (id_membresia, monto, fecha_pago) VALUES (?, ?, ?)',
            [id_membresia, monto, fechaPago]
        );

        await db.query(
            'UPDATE MembresiasCliente SET estado = ?, fecha_inicio = ? WHERE id_membresias = ?',
            ['Activa', fechaPago, id_membresia]
        );

        res.status(201).json({
            message: 'Pago registrado y membresía activada.',
            id_pagos: result.insertId,
            id_membresia: Number(id_membresia),
            monto,
            fecha_pago: fechaPago
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al registrar el pago de la membresía."));
    }
};

const getPagos = async (req, res) => {
    try {
        const { fecha_desde, fecha_hasta, id_cliente } = req.query;

        let query = `
            SELECT p.id_pagos, p.id_membresia, p.monto, p.fecha_pago, mc.id_cliente
            FROM pagos p
            JOIN MembresiasCliente mc ON p.id_membresia = mc.id_membresias
            WHERE 1=1
        `;
        const params = [];

        if (fecha_desde) {
            query += ' AND p.fecha_pago >= ?';
            params.push(fecha_desde);
        }

        if (fecha_hasta) {
            query += ' AND p.fecha_pago <= ?';
            params.push(fecha_hasta);
        }

        if (id_cliente) {
            query += ' AND mc.id_cliente = ?';
            params.push(id_cliente);
        }

        query += ' ORDER BY p.fecha_pago DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(generarError("ERR_SERVIDOR", "Error al obtener el historial de pagos."));
    }
};

module.exports = { crearPago, getPagos };