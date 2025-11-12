

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
			elementoAlerta.style.display = "block";
			elementoAlerta.innerText = "Las contraseñas no coinciden.";
			return;
		}
		// si la contraseña no tiene 1 simbolo
		if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			elementoAlerta.style.display = "block";
			elementoAlerta.innerText = "La contraseña debe contener al menos un símbolo.";
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
				// le quitamos la clase alert-danger al elemento de alerta
				elementoAlerta.style.display = "block";
				elementoAlerta.classList.remove("alert-danger");
				// le agregamos la clase alert-success al elemento de alerta}
				elementoAlerta.classList.add("alert-success");
				elementoAlerta.innerText = "Usuario creado exitosamente. Redirigiendo al inicio de sesión...";
				// redirigir al usuario al login despues de 2 segundos
				setTimeout(() => {
					// aqui despues hay que cambiar al dominio real
					window.location.href = "/sitioLogin/";
				}, 2000);
				return;
			}
			if (!response.ok) {
				const errorData = await response.json();
				console.error(errorData);
				if (errorData.username) {
					elementoAlerta.style.display = "block";
					elementoAlerta.innerText = "El nombre de usuario ya existe.";
				}
				else if (errorData.email) {
					elementoAlerta.style.display = "block";
					elementoAlerta.innerText = "El correo electrónico ya está en uso.";
				}
				else if (errorData.password) {
					elementoAlerta.style.display = "block";
					elementoAlerta.innerText = "La contraseña es demasiado débil.";
				}
				else {
					elementoAlerta.style.display = "block";
					elementoAlerta.innerText = "Error desconocido. Inténtalo de nuevo mas tarde.";
				}
			}
		}).catch((error) => {
			console.error("Error en la solicitud:", error);
		});

	});
	
});
