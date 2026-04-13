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
        adminPanel.classList.remove('hidden');
    } else {
        adminPanel.classList.add('hidden');
    }

    cargarDatos(); 
}

// --- 3. CARGAR DATOS REALES ---
async function cargarDatos() {
    try {
        // CORREGIDO: Antes decía /api/login, ahora dice /api/productos
        const respuesta = await fetch('http://172.16.1.250:3000/api/productos');
        const productosReales = await respuesta.json();

        const tbody = document.getElementById('tabla-body');
        tbody.innerHTML = ''; 

        productosReales.forEach(dato => {
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

// --- 4. GUARDAR NUEVO EQUIPO ---
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
        nodo_origen: "PC David (PRIMARY)"
    };

    try {
        // CORREGIDO: Cambiado 'localhost' por tu IP real '172.16.1.250'
        const respuesta = await fetch('http://172.16.1.250:3000/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoDato)
        });

        const resultado = await respuesta.json();

        if (resultado.success) {
            alert("Guardado exitosamente en el Replica Set");
            document.getElementById('nuevo-producto').value = ''; 
            cargarDatos(); 
        }
    } catch (error) {
        console.error("Error al conectar:", error);
        alert("Error: No se pudo conectar con el servidor.");
    }
}

function cerrarSesion() {
    location.reload();
}