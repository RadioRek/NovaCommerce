

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


	let formularioRegistro = document.getElementById("formularioRegistro");


	// prevenir el default del formulario
	formularioRegistro.addEventListener("submit", function (event) {
		event.preventDefault();

		let username = document.getElementById("usernameInput").value;
		let nombreUsurio = document.getElementById("nombreInput").value;
		let apellidoUsuario = document.getElementById("apellidoInput").value;
		let direccionUsuario = document.getElementById("direccionInput").value;
		let telefonoUsuario = document.getElementById("telefonoInput").value;
		let emailUsuario = document.getElementById("emailInput").value;
		let password = document.getElementById("passwordInput").value;
		let confPassword = document.getElementById("confPasswordInput").value;

		let elementoAlerta = document.getElementById("textoAlerta");

		// validar que las contraseñas coincidan
		if (password !== confPassword) {
			crearElementoToast("Error", "Las contraseñas no coinciden.", "error");
			return;
		}
		// si la contraseña no tiene 1 simbolo
		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			crearElementoToast("Error", "La contraseña debe contener al menos un símbolo.", "error");
			return;
		}

		let formData = new FormData();
		formData.append("username", username);
		formData.append("nombre", nombreUsurio);
		formData.append("apellido", apellidoUsuario);
		formData.append("direccion", direccionUsuario);
		formData.append("telefono", telefonoUsuario);
		formData.append("email", emailUsuario);
		formData.append("password", password);


		fetch("/api/users/", {
			method: "POST",
			body: formData,
			headers: {
				"X-CSRFToken": csrftoken,
			},
		}).then(async (response) => {
			if (response.ok) {
				crearElementoToast("Éxito", "Registro exitoso. Redirigiendo al inicio de sesión...", "success");
				setTimeout(() => {
					// aqui despues hay que cambiar al dominio real
					window.location.href = "/sitioLogin/";
				}, 2000);
				return;
			}
			if (!response.ok) {
				const errorData = await response.json();
				if (errorData.username) {
					crearElementoToast("Error", "El nombre de usuario ya está en uso.", "error");
				}
				else if (errorData.email) {
					crearElementoToast("Error", "El correo electrónico ya está en uso.", "error");
				}
				else if (errorData.password) {
					crearElementoToast("Error", "La contraseña no cumple con los requisitos.", "error");
				}
				else {
					crearElementoToast("Error", "Error en el registro. Por favor, inténtelo de nuevo.", "error");
				}
			}
		}).catch((error) => {
			console.error("Error en la solicitud:", error);
		});

	});

});
