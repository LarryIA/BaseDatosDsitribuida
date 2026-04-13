// --- 1. LÓGICA DE LOGIN (Esta estaba bien) ---
async function iniciarSesion() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    try {
        const respuesta = await fetch('https://caddie-monday-smite.ngrok-free.dev/api/login', {
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

// --- 3. CARGAR DATOS REALES (CORREGIDO) ---
async function cargarDatos() {
    try {
        // AQUÍ ESTABA EL ERROR: Tenías /api/login
        const respuesta = await fetch('https://caddie-monday-smite.ngrok-free.dev/api/productos');
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

// --- 4. GUARDAR NUEVO EQUIPO (CORREGIDO) ---
async function agregarEquipo() {
    const nombre = document.getElementById('nuevo-producto').value;
    const estado = document.getElementById('nuevo-estado').value;

    if (!nombre) return alert("Por favor, escribe el nombre del equipo.");

    const nuevoDato = {
        producto: nombre,
        estado: estado,
        nodo_origen: "PC David (PRIMARY)"
    };

    try {
        // AQUÍ TAMBIÉN ESTABA EL ERROR: Tenías /api/login
        const respuesta = await fetch('https://caddie-monday-smite.ngrok-free.dev/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoDato)
        });

        const resultado = await respuesta.json();
        if (resultado.success) {
            alert("✅ Guardado exitosamente en el Replica Set");
            document.getElementById('nuevo-producto').value = ''; 
            cargarDatos(); 
        }
    } catch (error) {
        console.error("Error al conectar:", error);
    }
}

function cerrarSesion() {
    location.reload();
}