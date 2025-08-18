// Sistema de gestión de amigos secretos
let amigos = [];
let amigoEditando = null;
let resultadoSorteo = null;

// Validación que solo permite letras (sin números ni símbolos)
function validarSoloLetras(texto) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    return regex.test(texto) && texto.trim().length > 0;
}

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('apellido1').value = '';
    document.getElementById('apellido2').value = '';
    document.getElementById('nombre1').value = '';
    document.getElementById('nombre2').value = '';
}

// Función para mostrar/ocultar botones de edición
function mostrarBotonesEdicion(mostrar) {
    const btnEditar = document.getElementById('btnEditar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnAgregar = document.querySelector('.button-add');
    
    if (mostrar) {
        btnEditar.style.display = 'inline-block';
        btnCancelar.style.display = 'inline-block';
        btnAgregar.style.display = 'none';
    } else {
        btnEditar.style.display = 'none';
        btnCancelar.style.display = 'none';
        btnAgregar.style.display = 'inline-block';
    }
}

// Función para agregar un amigo
function agregarAmigo() {
    const apellido1 = document.getElementById('apellido1').value.trim();
    const apellido2 = document.getElementById('apellido2').value.trim();
    const nombre1 = document.getElementById('nombre1').value.trim();
    const nombre2 = document.getElementById('nombre2').value.trim();

    // Validar que todos los campos estén llenos
    if (!apellido1 || !apellido2 || !nombre1 || !nombre2) {
        alert('Por favor, complete todos los campos (Apellido1, Apellido2, Nombre1, Nombre2)');
        return;
    }

    // Validar que solo contengan letras
    if (!validarSoloLetras(apellido1)) {
        alert('El primer apellido solo debe contener letras');
        return;
    }
    if (!validarSoloLetras(apellido2)) {
        alert('El segundo apellido solo debe contener letras');
        return;
    }
    if (!validarSoloLetras(nombre1)) {
        alert('El primer nombre solo debe contener letras');
        return;
    }
    if (!validarSoloLetras(nombre2)) {
        alert('El segundo nombre solo debe contener letras');
        return;
    }

    // Crear objeto amigo
    const nuevoAmigo = {
        id: Date.now(),
        apellido1: apellido1,
        apellido2: apellido2,
        nombre1: nombre1,
        nombre2: nombre2,
        nombreCompleto: `${apellido1} ${apellido2}, ${nombre1} ${nombre2}`
    };

    // Verificar que no exista un amigo con el mismo nombre completo
    const existeAmigo = amigos.some(amigo => 
        amigo.nombreCompleto.toLowerCase() === nuevoAmigo.nombreCompleto.toLowerCase()
    );

    if (existeAmigo) {
        alert('Ya existe un amigo con ese nombre completo');
        return;
    }

    // Agregar amigo a la lista
    amigos.push(nuevoAmigo);
    
    // Limpiar formulario
    limpiarFormulario();
    
    // Actualizar lista visual
    mostrarListaAmigos();
    
    // Limpiar resultado anterior si existe
    limpiarResultado();
    
    alert('Amigo agregado exitosamente');
}

// Función para mostrar la lista de amigos
function mostrarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';

    if (amigos.length === 0) {
        lista.innerHTML = '<li style="text-align: center; color: #666;">No hay amigos registrados</li>';
        return;
    }

    amigos.forEach(amigo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${amigo.nombreCompleto}</span>
            <div class="friend-actions">
                <button class="btn-small btn-edit" onclick="prepararEdicion(${amigo.id})">Editar</button>
                <button class="btn-small btn-delete" onclick="eliminarAmigo(${amigo.id})">Eliminar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

// Función para preparar la edición de un amigo
function prepararEdicion(id) {
    const amigo = amigos.find(a => a.id === id);
    if (!amigo) return;

    amigoEditando = id;
    
    // Llenar formulario con datos del amigo
    document.getElementById('apellido1').value = amigo.apellido1;
    document.getElementById('apellido2').value = amigo.apellido2;
    document.getElementById('nombre1').value = amigo.nombre1;
    document.getElementById('nombre2').value = amigo.nombre2;
    
    // Mostrar botones de edición
    mostrarBotonesEdicion(true);
}

// Función para editar un amigo
function editarAmigo() {
    if (!amigoEditando) return;

    const apellido1 = document.getElementById('apellido1').value.trim();
    const apellido2 = document.getElementById('apellido2').value.trim();
    const nombre1 = document.getElementById('nombre1').value.trim();
    const nombre2 = document.getElementById('nombre2').value.trim();

    // Validar que todos los campos estén llenos
    if (!apellido1 || !apellido2 || !nombre1 || !nombre2) {
        alert('Por favor, complete todos los campos');
        return;
    }

    // Validar que solo contengan letras
    if (!validarSoloLetras(apellido1) || !validarSoloLetras(apellido2) || 
        !validarSoloLetras(nombre1) || !validarSoloLetras(nombre2)) {
        alert('Todos los campos solo deben contener letras');
        return;
    }

    // Crear nombre completo para verificar duplicados
    const nombreCompleto = `${apellido1} ${apellido2}, ${nombre1} ${nombre2}`;
    
    // Verificar que no exista otro amigo con el mismo nombre completo
    const existeOtroAmigo = amigos.some(amigo => 
        amigo.id !== amigoEditando && 
        amigo.nombreCompleto.toLowerCase() === nombreCompleto.toLowerCase()
    );

    if (existeOtroAmigo) {
        alert('Ya existe otro amigo con ese nombre completo');
        return;
    }

    // Actualizar el amigo
    const indice = amigos.findIndex(a => a.id === amigoEditando);
    if (indice !== -1) {
        amigos[indice] = {
            ...amigos[indice],
            apellido1,
            apellido2,
            nombre1,
            nombre2,
            nombreCompleto
        };
    }

    // Limpiar estado de edición
    cancelarEdicion();
    
    // Actualizar lista
    mostrarListaAmigos();
    
    // Limpiar resultado anterior si existe
    limpiarResultado();
    
    alert('Amigo actualizado exitosamente');
}

// Función para cancelar la edición
function cancelarEdicion() {
    amigoEditando = null;
    limpiarFormulario();
    mostrarBotonesEdicion(false);
}

// Función para eliminar un amigo
function eliminarAmigo(id) {
    if (confirm('¿Está seguro de que desea eliminar este amigo?')) {
        amigos = amigos.filter(a => a.id !== id);
        mostrarListaAmigos();
        limpiarResultado();
        alert('Amigo eliminado exitosamente');
    }
}

// Función para sortear amigo secreto
function sortearAmigo() {
    if (amigos.length === 0) {
        alert('No hay amigos registrados para sortear');
        return;
    }

    if (amigos.length < 2) {
        alert('Se necesitan al menos 2 amigos para realizar el sorteo');
        return;
    }

    // Realizar sorteo aleatorio
    const indiceAleatorio = Math.floor(Math.random() * amigos.length);
    const amigoGanador = amigos[indiceAleatorio];
    
    resultadoSorteo = amigoGanador;
    
    // Mostrar resultado
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = `
        <li>🎉 ¡El amigo secreto es: ${amigoGanador.nombreCompleto}! 🎉</li>
    `;
    
    // Mostrar botón de PDF
    document.getElementById('btnPDF').style.display = 'inline-block';
}

// Función para limpiar resultado
function limpiarResultado() {
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('btnPDF').style.display = 'none';
    resultadoSorteo = null;
}

// Función para generar PDF
function generarPDF() {
    if (!resultadoSorteo) {
        alert('No hay resultado de sorteo para imprimir');
        return;
    }

    // Crear contenido HTML para el PDF
    const contenidoPDF = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Resultado Amigo Secreto</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f8f9fa;
                }
                .header {
                    color: #4B69FD;
                    font-size: 36px;
                    margin-bottom: 30px;
                    font-weight: bold;
                }
                .winner {
                    background-color: white;
                    border: 3px solid #4B69FD;
                    border-radius: 20px;
                    padding: 30px;
                    margin: 30px auto;
                    max-width: 500px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .winner-text {
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 20px;
                }
                .winner-name {
                    font-size: 32px;
                    color: #fe652b;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .date {
                    color: #666;
                    font-size: 16px;
                    margin-top: 30px;
                }
                .emoji {
                    font-size: 48px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <h1 class="header">🎁 AMIGO SECRETO 🎁</h1>
            <div class="winner">
                <div class="emoji">🎉</div>
                <div class="winner-text">El amigo secreto sorteado es:</div>
                <div class="winner-name">${resultadoSorteo.nombreCompleto}</div>
                <div class="emoji">🎊</div>
            </div>
            <div class="date">Fecha del sorteo: ${new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</div>
        </body>
        </html>
    `;

    // Crear ventana nueva para imprimir
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(contenidoPDF);
    ventanaImpresion.document.close();
    
    // Esperar a que se cargue y abrir el diálogo de impresión
    ventanaImpresion.onload = function() {
        ventanaImpresion.print();
    };
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    mostrarListaAmigos();
    
    // Agregar event listeners para validación en tiempo real
    const campos = ['apellido1', 'apellido2', 'nombre1', 'nombre2'];
    
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        elemento.addEventListener('input', function(e) {
            const valor = e.target.value;
            
            // Filtrar caracteres no válidos en tiempo real
            const valorFiltrado = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
            
            if (valor !== valorFiltrado) {
                e.target.value = valorFiltrado;
            }
        });
    });
});