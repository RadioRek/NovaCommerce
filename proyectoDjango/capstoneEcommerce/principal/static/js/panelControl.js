document.addEventListener("DOMContentLoaded", function () {

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



	let crearProductoButton = document.getElementById("crearProductoButton");
    
	crearProductoButton.addEventListener("click", function (event) {
		event.preventDefault();


		let inputNombre = document.getElementById("nombreInput").value;
		let inputPrecio = document.getElementById("precioInput").value;

		let inputImagen = document.getElementById("imgInput").files[0];
		let inputDescripcion = document.getElementById("descripcionInput").value;
		let inputStock = document.getElementById("stockInput").value;



		let formData = new FormData();
		formData.append("nombre", inputNombre);
		formData.append("precio", inputPrecio);
		formData.append("descripcion", inputDescripcion);
		formData.append("stock", inputStock);

		if (inputImagen) {
			formData.append("img", inputImagen);
		}
        
		fetch("http://127.0.0.1:8000/api/productos/", {
			method: "POST",
			body: formData,
		}).then((response) => {
            if (response.ok) {
                let botonLimpiarFormularioProd = document.getElementById("botonLimpiarFormularioProd");
                botonLimpiarFormularioProd.click();

                let tituloxd = document.getElementById("tituloxd");
                tituloxd.textContent = "WOOOOOW creaste un producto";
            }
            if (response.status === 400) { 
                console.log("Error Pedazo de troll");
                
            }
		}).catch((error) => {
				console.error("Error en la solicitud:", error);
	    });

	});




	let formularioCategoria = document.getElementById("formularioCategoria");

	formularioCategoria.addEventListener("submit", function(event) {

		event.preventDefault();

		let inputNombre = document.getElementById("nombreCategoriaInput").value;
		let formData = new FormData();
		formData.append("nombre", inputNombre);

		let alertaToast = document.getElementById("alertaToast");
		let alertaHeader = document.getElementById("alertaHeader");
		let alertaBody = document.getElementById("alertaBody");
		let alertaSpinner = document.getElementById("alertaSpinner");

		alertaHeader.textContent = "Procesando solicitud...";
		alertaBody.textContent = "Creando categoria, por favor espere";
		let toast = new bootstrap.Toast(alertaToast, { autohide: false })
		toast.show();

		fetch("http://127.0.0.1:8000/api/categorias/", {
			method: "POST",
			body: formData,
			headers: {
				"X-CSRFToken": csrftoken,
			},
		}).then(async (response) => {
			if (response.ok) {
				formularioCategoria.reset();
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Exito";
				alertaBody.textContent = "Categoria creada con exito";
			}
			if (!response.ok) {
				let data = await response.json().catch(() => ({}));
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Error";
				if (data.nombre) {
					alertaBody.textContent = data.nombre;
				}

				formularioCategoria.reset();
			}
		}).catch((error) => {
			console.error("Error en la solicitud:", error);
		});
	});



});




