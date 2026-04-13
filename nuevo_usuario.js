app.post('/API_MONGO/nuevo-usuario', async (req, res) => {
  const { username_nuevo, password_nuevo, rol_solicitante } = req.body;

  // VERIFICACIÓN DE SEGURIDAD EN EL SERVIDOR
  if (rol_solicitante !== "admin") {
    return res.status(403).json({ error: "¡Acceso denegado! Solo los administradores pueden hacer esto." });
  }

  // Si pasa la prueba, intentamos guardar (recordando que PC1 y PC2 deben estar prendidas)
  try {
      await db.collection('usuarios').insertOne({ 
          username: username_nuevo, 
          password: password_nuevo, 
          rol: "cliente" 
      }, { writeConcern: { w: 2, wtimeout: 2000 } }); // Nuestro candado de red

      res.json({ success: true, mensaje: "Usuario creado en ambas PCs" });
  } catch (error) {
      res.status(500).json({ error: "Error de Red: Falta encender una PC para respaldar el dato." });
  }
});