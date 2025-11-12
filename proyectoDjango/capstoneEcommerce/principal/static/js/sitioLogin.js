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

	let login = document.getElementById("loginForm");

	loginForm.addEventListener("submit", function (event) {
		event.preventDefault();

		let usernameInput = document.getElementById("usernameInput").value;
		let passwordInput = document.getElementById("passwordInput").value;

		let datosJSON = JSON.stringify({
			username: usernameInput,
			password: passwordInput,
		});

		fetch("/api/login/", {
			method: "POST",
			headers: { "content-type": "application/json", "X-CSRFToken": csrftoken },
			body: datosJSON,
			credentials: "include",
		}).then(async (response) => {
			if (response.ok) {
				window.location.href = "/";
			} else {
				let errorData = await response.json();
				crearElementoToast("Error", String(errorData.error), "error");
			}
		}).catch((error) => {
			crearElementoToast("Error", "Error desconocido, intente mas tarde o contacte a soporte", "error");
			console.error("Error en la solicitud:", error);
		});
	});
});
