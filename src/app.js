const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');//YOGE
const swaggerSpec = require('./swagger');//YOGE
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const maquinaRoutes = require('./routes/maquinaRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const gestionDeportivaRoutes = require('./routes/gestionDeportivaRoutes'); // AÑADIDO POR CALO CALITO CALO
const accesoRoutes = require('./routes/accesoRoutes'); // AÑADIDO POR CALO CALITO CALO

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));//YOGE

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/maquinas', maquinaRoutes);
app.use('/api/v1', usuariosRoutes);
app.use('/api/v1', gestionDeportivaRoutes); // AÑADIDO POR CALO CALITO CALO
app.use('/api/v1', accesoRoutes); // AÑADIDO POR CALO CALITO CALO
app.get('/', (req, res) => {
    res.send('Servidor SmartGym V1 corriendo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});