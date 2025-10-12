document.addEventListener("DOMContentLoaded", function () {
	let loginButton = document.getElementById("botonLogin");

	loginButton.addEventListener("click", function (event) {
		event.preventDefault();

		let usernameInput = document.getElementById("usernameInput").value;
		let passwordInput = document.getElementById("passwordInput").value;

        fetch("http://127.0.0.1:8000/api/token/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
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
});
