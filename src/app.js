const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const maquinaRoutes = require('./routes/maquinaRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/maquinas', maquinaRoutes);
app.use('/api/v1', usuariosRoutes);
app.use('/api/v1', categoriasRoutes);
app.use('/api/v1', ticketRoutes);

app.get('/', (req, res) => {
    res.send('Servidor SmartGym V1 corriendo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});