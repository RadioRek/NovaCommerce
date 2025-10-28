document.addEventListener('DOMContentLoaded', function () {
    // Función para obtener la cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie("csrftoken");

    const form = document.getElementById('formPerfil');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // para obtener los valores del formulario
        const username = document.getElementById('usernameInput').value.trim();
        const nombre = document.getElementById('nombreInput').value.trim();
        const apellido = document.getElementById('ApellidoInput').value.trim();
        const direccion = document.getElementById('DireccionInput').value.trim();
        const telefono = document.getElementById('TelefonoInput').value.trim();
        const email = document.getElementById('EmailInput').value.trim();
        const password = document.getElementById('passwordInput').value;
        const passwordConf = document.getElementById('passwordConfInput').value;

        // para validar que los campos sean obligatorios
        if (!username || !email) {
            mostrarMensaje('El username y el email son obligatorios', 'error');
            return;
        }

        // valida si las contraseñas coinciden y que hagas contraseñas ultra pajeras
        if (password || passwordConf) {
            if (password !== passwordConf) {
                mostrarMensaje('Las contraseñas no coinciden', 'error');
                return;
            }
            if (password.length < 6) {
                mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (!specialCharRegex.test(password)) {
                mostrarMensaje('La contraseña debe tener al menos un caracter especial', 'error');
                return;
            }
        }

        // los datos a enviar
        const datos = {
            username: username,
            nombre: nombre,
            apellido: apellido,
            direccion: direccion,
            email: email
        };

        // valida el telefono
        if (telefono) {
            datos.telefono = parseInt(telefono);
        }

        // solo si hay contraseña
        if (password) {
            datos.password = password;
        }

        fetch("/api/users/", {
            method: "PUT",
            body: JSON.stringify(datos),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            credentials: "same-origin",
        }).then(async (response) => {

            if (response.ok) {
                mostrarMensaje("Perfil actualizado exitosamente", "success");

                // recarga la página después de 1.5 segundos para mostrar actualizados
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } else {

                let result = await response.json();

                // muestra los errores
                let errorMsg = "Error al actualizar el perfil";

                mostrarMensaje(errorMsg, "error");
            }

        }).catch((error) => {
            console.error("Error en la solicitud:", error);
            mostrarMensaje("Error de conexión. Por favor, intenta de nuevo.", "error");
        });
    });
});

// para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo) {
    // para eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-alerta');

    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }

    // crea el elemento del mensaje
    const div = document.createElement('div');

    if (tipo === 'success') {
        div.className = 'mensaje-alerta alert alert-success alert-dismissible fade show';
    } else {
        div.className = 'mensaje-alerta alert alert-danger alert-dismissible fade show';
    }


    div.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';


    div.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(div);

    // auto-elimina después de 5 segundos
    setTimeout(() => {
        div.remove();
    }, 5000);
}
