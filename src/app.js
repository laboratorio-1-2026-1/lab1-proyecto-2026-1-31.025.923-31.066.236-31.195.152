const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const maquinaRoutes = require('./routes/maquinaRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const gestionDeportivaRoutes = require('./routes/gestionDeportivaRoutes'); // AÑADIDO POR CALO CALITO CALO
const accesoRoutes = require('./routes/accesoRoutes'); // AÑADIDO POR CALO CALITO CALO
const planRoutes = require('./routes/planRoutes'); // - Nelson
const membresiasRoutes = require('./routes/membresiasRoutes');
const pagosRoutes = require('./routes/pagosRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/maquinas', maquinaRoutes);
app.use('/api/v1', usuariosRoutes);
app.use('/api/v1', categoriasRoutes);
app.use('/api/v1', ticketRoutes);
app.use('/api/v1', gestionDeportivaRoutes); // AÑADIDO POR CALO CALITO CALO
app.use('/api/v1', accesoRoutes); // AÑADIDO POR CALO CALITO CALO
app.use('/api/v1/planes', planRoutes) // - Nelson
app.use('/api/v1', membresiasRoutes);
app.use('/api/v1', pagosRoutes);

app.get('/', (req, res) => {
    res.send('Servidor SmartGym V1 corriendo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});