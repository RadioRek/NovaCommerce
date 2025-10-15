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



    let formularioLogin = document.getElementById("formularioLogin");

    formularioLogin.addEventListener("submit", function (event) {

        event.preventDefault();

        let usernameInput = document.getElementById("usernameInput").value;
        let passwordInput = document.getElementById("passwordInput").value;

        let datosJSON = JSON.stringify({
            username: usernameInput,
            password: passwordInput
        });

        fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
            body: datosJSON,
            credentials: 'include'
        }).then(async (response) => {
            if (response.ok) {
                console.log("Inicio de sesión exitoso");
            } else {
                let errorData = await response.json();
                console.error("Error en el inicio de sesión:", errorData);
            }
        }).catch((error) => {
            console.error("Error en la solicitud:", error);
        });

    });

});


/*

        fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: datosJSON
        }).then(response => response.json()).then(data => {
            if (data.access) {
                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);
                // redirigir o cargar perfil
            } else {

            }
        }).catch((error) => {
                console.error("Error en la solicitud:", error);
        });
    });
*/