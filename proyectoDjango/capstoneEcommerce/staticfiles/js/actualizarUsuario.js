document.addEventListener("DOMContentLoaded", function () {

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


    let usuarioId = document.getElementById("usuarioId").value;

    let formularioActualizar = document.getElementById("editarUsuario");

    formularioActualizar.addEventListener("submit", function (event) {
        event.preventDefault();

        let nombre = document.getElementById("nombreInput").value;
        let apellido = document.getElementById("apellidoInput").value;
        let username = document.getElementById("usernameInput").value;
        let email = document.getElementById("emailInput").value;
        let direccion = document.getElementById("direccionInput").value;
        let telefono = document.getElementById("telefonoInput").value;
        let password = document.getElementById("passwordInput").value;

        let datosActualizar = {};

        if (password.trim() !== "") {
            datosActualizar = {
                nombre: nombre,
                apellido: apellido,
                username: username,
                email: email,
                direccion: direccion,
                telefono: telefono,
                password: password
            };

        } else {
            datosActualizar = {
                nombre: nombre,
                apellido: apellido,
                username: username,
                email: email,
                direccion: direccion,
                telefono: telefono,
            };
        }

        fetch(`/api/users/${usuarioId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(datosActualizar)
        }).then(async (response) => {
            if (response.ok) {
                crearElementoToast("Exito", "Usuario actualizado correctamente.", "success");
            } else {
                const errorData = await response.json();
                crearElementoToast("Error", "No se pudo actualizar el usuario.", "error");
            }
        }).catch((error) => {
            createElementoToast("Error", "No se pudo actualizar el usuario.", "error");
            console.error("Error:", error);
        });


    });

});
