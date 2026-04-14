const express = require('express');
const mongoose = require('mongoose'); // <--- ¡Asegúrate de que esta línea esté aquí!
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


// 1. CONFIGURACIÓN DE LA CONEXIÓN
const mongoURI = "mongodb://172.16.1.250:27017,172.16.0.64:27017/proyectoMongoDB?replicaSet=rs-distribuida";

mongoose.connect(mongoURI)
  .then(() => console.log(' Conectado exitosamente a MongoDB Distribuido'))
  .catch(err => console.error(' Error de conexión:', err));

// 2. RUTA DE LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const usuario = await mongoose.connection.db.collection('usuarios').findOne({ 
        username: username, 
        password: password 
    });

    if (usuario) {
      res.json({ success: true, mensaje: "Bienvenido", rol: usuario.rol });
    } else {
      res.status(401).json({ success: false, mensaje: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ success: false, mensaje: "Error interno" });
  }
});

// 3. RUTA PARA OBTENER PRODUCTOS (GET)
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await mongoose.connection.db.collection('inventario').find().toArray();
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error al obtener productos");
    }
});

// 4. RUTA PARA AGREGAR PRODUCTOS (POST)
app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = {
            producto: req.body.producto,
            estado: req.body.estado,
            nodo_origen: req.body.nodo_origen || "PC David (PRIMARY)",
            fecha: new Date() // El servidor asigna la fecha real de inserción
        };
        
        await mongoose.connection.db.collection('inventario').insertOne(nuevoProducto);
        res.json({ success: true, mensaje: "Producto guardado en MongoDB" });
    } catch (error) {
        console.error("Error al guardar producto:", error);
        res.status(500).json({ success: false, mensaje: "Error al guardar" });
    }
});

// 5. ARRANCAR SERVIDOR
app.listen(3000, "0.0.0.0",() => {
    console.log(' Servidor abierto en la red en el puerto 3000');
});