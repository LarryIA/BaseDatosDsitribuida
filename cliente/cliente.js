// --- 1. LÓGICA DE LOGIN ---
async function iniciarSesion() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    try {
        const respuesta = await fetch('http://172.16.1.250:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const datos = await respuesta.json();

        if (datos.success) {
            mostrarPanel(user, datos.rol);
        } else {
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Credenciales incorrectas.";
        }
    } catch (error) {
        console.error("Error en login:", error);
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Error: El servidor Node.js no está corriendo.";
    }
}

// --- 2. CAMBIO DE PANTALLAS ---
function mostrarPanel(usuario, rol) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    
    document.getElementById('display-user').innerText = usuario;
    document.getElementById('display-rol').innerText = rol.toUpperCase();

    const adminPanel = document.getElementById('admin-panel');
    if (rol === 'admin') {
        adminPanel.classList.remove('hidden'); // Solo el admin ve el formulario de registro
    } else {
        adminPanel.classList.add('hidden');
    }

    cargarDatos(); // Cargamos los datos de Mongo al entrar
}

// --- 3. CARGAR DATOS REALES DESDE MONGO ---
async function cargarDatos() {
    try {
        const respuesta = await fetch('http://172.16.1.250:3000/api/login');
        const productosReales = await respuesta.json();

        const tbody = document.getElementById('tabla-body');
        tbody.innerHTML = ''; 

        productosReales.forEach(dato => {
            // Manejamos los nombres de campos de tus imágenes anteriores
            const fila = `
                <tr>
                    <td><strong>${dato.producto || 'N/A'}</strong></td>
                    <td><span class="badge ${(dato.estado || 'stock').toLowerCase()}">${dato.estado || 'Stock'}</span></td>
                    <td>${dato.nodo_origen || 'Nodo Local'}</td>
                    <td>${dato.fecha ? new Date(dato.fecha).toLocaleDateString() : 'Sin fecha'}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
    } catch (error) {
        console.error("Error cargando datos de Mongo:", error);
    }
}

// --- 4. GUARDAR NUEVO EQUIPO EN MONGODB ---
async function agregarEquipo() {
    const nombre = document.getElementById('nuevo-producto').value;
    const estado = document.getElementById('nuevo-estado').value;

    if (!nombre) {
        alert("Por favor, escribe el nombre del equipo.");
        return;
    }

    const nuevoDato = {
        producto: nombre,
        estado: estado,
        nodo_origen: "PC David (PRIMARY)" // Marcamos que salió de tu nodo
    };

    try {
        const respuesta = await fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoDato)
        });

        const resultado = await respuesta.json();

        if (resultado.success) {
            alert(" Guardado exitosamente en el Replica Set");
            document.getElementById('nuevo-producto').value = ''; // Limpiar campo
            cargarDatos(); // Refrescar la tabla automáticamente
        } else {
            alert(" Error al guardar: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Error: No se pudo conectar con el servidor Node.js");
    }
}

// --- 5. CERRAR SESIÓN ---
function cerrarSesion() {
    location.reload(); // Recarga la página para limpiar estados
}