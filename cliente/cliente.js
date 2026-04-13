// --- 1. LÓGICA DE LOGIN CONECTADA AL BACKEND ---
async function iniciarSesion() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    try {
        // Hacemos la petición a tu servidor Node.js
        const respuesta = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const datos = await respuesta.json();

        if (datos.success) {
            // Si el servidor dice que sí, entramos
            mostrarPanel(user, datos.rol);
        } else {
            // Si dice que no, mostramos el error
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Credenciales incorrectas. Intenta de nuevo.";
        }
    } catch (error) {
        console.error("El servidor está apagado:", error);
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Error: El servidor Node.js no está corriendo.";
    }
}

// (Deja aquí abajo las otras funciones que ya tenías: mostrarPanel, cerrarSesion, cargarDatos)

// --- 2. CAMBIO DE PANTALLAS ---
function mostrarPanel(usuario, rol) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
    document.getElementById('login-error').style.display = 'none';

    document.getElementById('display-user').innerText = usuario;
    document.getElementById('display-rol').innerText = rol.toUpperCase();

    // LÓGICA DE SEGURIDAD VISUAL
    const adminPanel = document.getElementById('admin-panel');
    if (rol === 'admin') {
        adminPanel.classList.remove('hidden');
    } else {
        adminPanel.classList.add('hidden');
    }

    cargarDatos();
}

function cerrarSesion() {
    document.getElementById('dashboard-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// --- 3. CARGAR DATOS A LA TABLA ---
function cargarDatos() {
    // AQUÍ EN EL FUTURO: Harás un fetch() a tu base de datos real.
    const datosSimulados = [
        { producto: "Servidor de Prueba", estado: "Activo", nodo: "PC David (PRIMARY)", fecha: "2026-03-02" },
        { producto: "Router Cisco v3", estado: "Stock", nodo: "PC Juanp", fecha: "2026-03-02" },
        { producto: "Switch TP-Link", estado: "Dañado", nodo: "PC David (PRIMARY)", fecha: "2026-03-01" },
        { producto: "Laptop Dell XPS", estado: "Activo", nodo: "PC Juanp", fecha: "2026-02-28" }
    ];

    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = ''; 

    datosSimulados.forEach(dato => {
        let claseEstado = dato.estado.toLowerCase();
        const fila = `
            <tr>
                <td><strong>${dato.producto}</strong></td>
                <td><span class="badge ${claseEstado}">${dato.estado}</span></td>
                <td>${dato.nodo}</td>
                <td>${dato.fecha}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}