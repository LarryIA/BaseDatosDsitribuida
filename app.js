const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. CONFIGURACIÓN DE LA CONEXIÓN (IMPORTANTE)
// Aquí usamos las IPs que ya verificamos que funcionan
const mongoURI = "mongodb://172.16.1.250:27017,172.16.0.64:27017/proyectoMongoDB?replicaSet=rs-distribuida";

mongoose.connect(mongoURI)
  .then(() => console.log(' Conectado exitosamente a MongoDB Distribuido'))
  .catch(err => console.error(' Error de conexión:', err));

// 2. RUTA DE LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Usamos mongoose.connection.db para acceder a la base de datos directamente
    const usuario = await mongoose.connection.db.collection('usuarios').findOne({ 
        username: username, 
        password: password 
    });

    if (usuario) {
      res.json({ 
          success: true, 
          mensaje: "Bienvenido", 
          rol: usuario.rol 
      });
    } else {
      res.status(401).json({ success: false, mensaje: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
  }
});

// 3. ARRANCAR EL SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});