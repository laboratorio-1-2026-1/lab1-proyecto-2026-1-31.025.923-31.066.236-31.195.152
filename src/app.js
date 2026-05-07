const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORTAR LAS RUTAS AQUÍ (Este era el paso que faltaba)
const maquinaRoutes = require('./routes/maquinaRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de SmartGym funcionando correctamente');
});

// 2. USAR LAS RUTAS
app.use('/api/maquinas', maquinaRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});