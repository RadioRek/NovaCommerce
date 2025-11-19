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

    let form = document.getElementById('formPerfil');

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
        const idUsuario = document.getElementById('usuarioId').value;

        // para validar que los campos sean obligatorios
        if (!username || !email) {
            crearElementoToast('Error', 'Por favor complete los campos obligatorios', 'error');
            return;
        }

        // valida si las contraseñas coinciden y que hagas contraseñas ultra pajeras
        if (password || passwordConf) {
            if (password !== passwordConf) {
                crearElementoToast('Error', 'Las contraseñas no coinciden', 'error');
                return;
            }
            if (password.length < 6) {
                crearElementoToast('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (!specialCharRegex.test(password)) {
                crearElementoToast('Error', 'La contraseña debe contener al menos un carácter especial', 'error');
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

        fetch(`/api/users/${idUsuario}/`, {
            method: "PATCH",
            body: JSON.stringify(datos),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
        }).then(async (response) => {
            if (response.ok) {
                crearElementoToast("Éxito", "Perfil actualizado correctamente", "success");
                // recarga la página después de 1.5 segundos para mostrar actualizados
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                let result = await response.json();
                crearElementoToast("Error", "Ocurrio un error al actualizar el perfil", "error");
            }
        }).catch((error) => {
            console.error("Error en la solicitud:", error);
            crearElementoToast("Error", "Ocurrio un error inesperado", "error")
        });
    });

    
});
