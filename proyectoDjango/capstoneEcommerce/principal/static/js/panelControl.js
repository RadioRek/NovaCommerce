document.addEventListener("DOMContentLoaded", function () {
	// variables
	let categorias = [];

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

	// Cargar categorias en el select
	let contenedorPills = document.getElementById("pillContainer");

	let categoriaSelect = document.getElementById("categoriaSelect");
	fetch("/api/categorias/", {
		method: "GET",
	}).then(async (response) => {
		if (response.ok) {
			const data = await response.json();
			data.forEach((categoria) => {
				let option = document.createElement("option");
				option.value = categoria.id;
				option.textContent = categoria.nombre;
				categoriaSelect.appendChild(option);
			});
		} else {

		}
	}).catch((error) => {
		console.error("Error en la solicitud:", error);
	});

	// Manejar selección de categoría
	categoriaSelect.addEventListener("change", (event) => {
		let valorSeleccionado = event.target.value;
		let nombreCategoria = categoriaSelect.options[categoriaSelect.selectedIndex].text;
		if (valorSeleccionado && !categorias.includes(valorSeleccionado)) {
			categorias.push(valorSeleccionado);

			let colDiv = document.createElement("div");
			colDiv.className = "col-auto p-0 m-0";

			let pill = document.createElement("p");
			pill.className = "pill rounded-pill textoMinimoBlanco";
			pill.textContent = nombreCategoria;

			colDiv.appendChild(pill);
			contenedorPills.appendChild(colDiv);
		}
	});

	// Manejar envío del formulario de producto
	let formularioProducto = document.getElementById("formularioProducto");
	formularioProducto.addEventListener("submit", async function (event) {
		event.preventDefault();

		// deshabilitar boton submit
		let botonSubmit = document.getElementById("crearProductoButton");
		botonSubmit.disabled = true;


		// mostrar alerta de procesamiento
		let alertaToast = document.getElementById("alertaToast");
		let alertaHeader = document.getElementById("alertaHeader");
		let alertaBody = document.getElementById("alertaBody");
		let alertaSpinner = document.getElementById("alertaSpinner");
		alertaHeader.textContent = "Procesando solicitud...";
		alertaBody.textContent = "Creando producto, por favor espere";
		alertaSpinner.classList.remove("d-none");
		alertaHeader.classList.remove("colorRojo3");
		alertaBody.classList.remove("colorRojo2");

		// mostrar alerta de procesamiento
		let toast = new bootstrap.Toast(alertaToast, { autohide: false });
		toast.show();

		let nombreProducto = document.getElementById("nombreInput").value;
		let precioProducto = document.getElementById("precioInput").value;
		let imagenProducto = document.getElementById("imgInput").files[0];
		let descripcionProducto = document.getElementById("descripcionInput").value;
		let stockProducto = document.getElementById("stockInput").value;

		let formData = new FormData();
		formData.append("nombre", nombreProducto);
		formData.append("precio", precioProducto);
		formData.append("descripcion", descripcionProducto);
		formData.append("stock", stockProducto);
		if (imagenProducto) {
			formData.append("img", imagenProducto);
		}

		// pausar la funcion 0.5 segundos para que se vea la alerta de procesamiento
		await new Promise(resolve => setTimeout(resolve, 500));

		fetch("/api/productos/", {
			method: "POST",
			body: formData,
			headers: { "X-CSRFToken": csrftoken, },
		}).then(async (response) => {
			if (response.ok) {
				formularioProducto.reset();
				alertaHeader.classList.remove("colorRojo3");
				alertaBody.classList.remove("colorRojo2");
				contenedorPills.innerHTML = "";
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Exito";
				alertaBody.textContent = "Producto creado con exito";

				let data = await response.json();

				for (let categoriaId of categorias) {
					let formDataCategoriaProducto = new FormData();
					formDataCategoriaProducto.append("producto", data.id);
					formDataCategoriaProducto.append("categoria", categoriaId);

					fetch("/api/categoria-productos/", {
						method: "POST",
						body: formDataCategoriaProducto,
						headers: { "X-CSRFToken": csrftoken, },
					}).then(async (response) => {
						if (response.ok) {
							let dataCategoriaProducto = await response.json();
						} else {
							let errorData = await response.json().catch(() => ({}));
						}
					}).catch((error) => {
						console.error("Error en la solicitud:", error);"/api/productos/";
					});
				}
				categorias = [];
			}
			if (!response.ok) {
				alertaHeader.classList.add("colorRojo3");
				alertaBody.classList.add("colorRojo2");
				let data = await response.json().catch(() => ({}));
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Error";
				alertaBody.textContent = "Error al crear el producto. ";
			}
		}).catch((error) => {
			alertaSpinner.classList.add("d-none");
			alertaHeader.classList.add("colorRojo3");
			alertaBody.classList.add("colorRojo2");
			alertaHeader.textContent = "Error";
			alertaBody.textContent = "Error al crear el producto";
			console.error("Error en la solicitud:", error);
		});

		// habilitar boton submit
		botonSubmit.disabled = false;

	});

	// Manejar envío del formulario de categoria
	let formularioCategoria = document.getElementById("formularioCategoria");

	formularioCategoria.addEventListener("submit", async function (event) {

		event.preventDefault();
		// deshabilitar boton submit
		let botonSubmit = document.getElementById("registrarCategoriaButton");
		botonSubmit.disabled = true;

		let alertaToast = document.getElementById("alertaToast");
		let alertaHeader = document.getElementById("alertaHeader");
		let alertaBody = document.getElementById("alertaBody");
		let alertaSpinner = document.getElementById("alertaSpinner");
		alertaHeader.textContent = "Procesando solicitud...";
		alertaBody.textContent = "Creando categoria, por favor espere";
		alertaSpinner.classList.remove("d-none");
		alertaHeader.classList.remove("colorRojo3");
		alertaBody.classList.remove("colorRojo2");

		// mostrar alerta de procesamiento
		let toast = new bootstrap.Toast(alertaToast, { autohide: false });
		toast.show();

		let inputNombre = document.getElementById("nombreCategoriaInput").value;

		let formData = new FormData();
		formData.append("nombre", inputNombre);

		// pausar la funcion 0.5 segundos para que se vea la alerta de procesamiento
		await new Promise(resolve => setTimeout(resolve, 500));

		fetch("/api/categorias/", {
			method: "POST",
			body: formData,
			headers: { "X-CSRFToken": csrftoken, },
		}).then(async (response) => {
			if (response.ok) {

				alertaHeader.classList.remove("colorRojo3");
				alertaBody.classList.remove("colorRojo2");

				formularioCategoria.reset();
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Exito";
				alertaBody.textContent = "Categoria creada con exito";
			}
			if (!response.ok) {
				alertaHeader.classList.add("colorRojo3");
				alertaBody.classList.add("colorRojo2");

				let data = await response.json().catch(() => ({}));
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Error";
				if (data.nombre) {
					alertaBody.textContent = data.nombre;
				} else {
					alertaBody.textContent = "Error al crear la categoria";
				}
				//  resetear el formulario
				formularioCategoria.reset();
			}
		}).catch((error) => {
			alertaSpinner.classList.add("d-none");
			alertaHeader.classList.add("colorRojo3");
			alertaBody.classList.add("colorRojo2");
			alertaHeader.textContent = "Error";
			alertaBody.textContent = "Error al crear la categoria";
			console.error("Error en la solicitud:", error);
		});

		// habilitar boton submit
		botonSubmit.disabled = false;
	});

	// poblar tabla de productos
	let tablaProductosBody = document.getElementById("tablaProductosBody");

	fetch("/api/productos/?page_size=999999", {
		method: "GET",
	}).then(async (response) => {
		if (response.ok) {
			let data = await response.json();
			data = data.results;

			data.forEach((producto) => {
				let row = document.createElement("tr");
				let tdNombre = document.createElement("td");
				let tdPrecio = document.createElement("td");
				let tdStock = document.createElement("td");

				tdNombre.className = "textoMinimo";
				tdPrecio.className = "textoMinimo";
				tdStock.className = "textoMinimo";

				tdNombre.textContent = producto.nombre;
				tdPrecio.textContent = producto.precio;
				tdStock.textContent = producto.stock;

				row.appendChild(tdNombre);
				row.appendChild(tdPrecio);
				row.appendChild(tdStock);

				tablaProductosBody.appendChild(row);
			});

		} else {

		}
	}).catch((error) => {
		console.error("Error en la solicitud:", error);
	});

	// poblar la tabla de usuarios
	let tablaUsuariosBody = document.getElementById("tablaUsuariosBody");

	fetch("/api/users/", {
		method: "GET",
	}).then(async (response) => {
		if (response.ok) {
			let data = await response.json();

			data.forEach((usuario) => {
				let row = document.createElement("tr");
				let tdUsername = document.createElement("td");
				let tdNombre = document.createElement("td");
				let tdApellido = document.createElement("td");
				let tdDireccion = document.createElement("td");
				let tdTelefono = document.createElement("td");
				let tdEmail = document.createElement("td");
				let tdTipo = document.createElement("td");

				tdUsername.className = "textoMinimo";
				tdNombre.className = "textoMinimo";
				tdApellido.className = "textoMinimo";
				tdDireccion.className = "textoMinimo";
				tdTelefono.className = "textoMinimo";
				tdEmail.className = "textoMinimo";
				tdTipo.className = "textoMinimo";


				tdUsername.textContent = usuario.username;
				tdNombre.textContent = usuario.nombre;
				tdApellido.textContent = usuario.apellido;
				tdDireccion.textContent = usuario.direccion;
				tdTelefono.textContent = usuario.telefono;
				tdEmail.textContent = usuario.email;
				if (usuario.tipoUsuario === 1) {
					tdTipo.textContent = "Administrador";
				}
				if (usuario.tipoUsuario === 2) {
					tdTipo.textContent = "Cliente";
				}

				row.appendChild(tdUsername);
				row.appendChild(tdNombre);
				row.appendChild(tdApellido);
				row.appendChild(tdDireccion);
				row.appendChild(tdTelefono);
				row.appendChild(tdEmail);
				row.appendChild(tdTipo);

				tablaUsuariosBody.appendChild(row);
			});
		}
	}).catch((error) => {
		console.error("Error en la solicitud:", error);
	});


	// poblar tabla de productos buscando
	let buscarProductoFormulario = document.getElementById("buscarProductoForm");

	buscarProductoFormulario.addEventListener("submit", function (event) {
		event.preventDefault();

		let nombreBuscado = document.getElementById("buscarNombreProductoInput").value.trim();
		let idBuscado = document.getElementById("buscarIdProductoInput").value.trim();

		let alertaToast = document.getElementById("alertaToast");
		let alertaHeader = document.getElementById("alertaHeader");
		let alertaBody = document.getElementById("alertaBody");
		let alertaSpinner = document.getElementById("alertaSpinner");
		alertaHeader.textContent = "Procesando solicitud...";
		alertaBody.textContent = "Buscando productos, por favor espere";
		alertaSpinner.classList.remove("d-none");
		let toast = new bootstrap.Toast(alertaToast, { autohide: false });
		toast.show();


		fetch(`/api/productos/?page_size=999999&nombre=${encodeURIComponent(nombreBuscado)}&id=${encodeURIComponent(idBuscado)}`, {
			method: "GET",
		}).then(async (response) => {
			if (response.ok) {
				let data = await response.json();
				data = data.results;

				// limpiar tabla antes de llenar
				tablaProductosBody.innerHTML = "";

				if (data.length === 0) {
					alertaSpinner.classList.add("d-none");
					alertaHeader.textContent = "Sin resultados";
					alertaBody.textContent = "No se encontraron productos";
				} else {
					alertaSpinner.classList.add("d-none");
					alertaHeader.textContent = "Exito";
					alertaBody.textContent = `Se encontraron ${data.length} productos`;

					data.forEach((producto) => {
						let row = document.createElement("tr");
						let tdNombre = document.createElement("td");
						let tdPrecio = document.createElement("td");
						let tdStock = document.createElement("td");

						tdNombre.className = "textoMinimo";
						tdPrecio.className = "textoMinimo";
						tdStock.className = "textoMinimo";

						tdNombre.textContent = producto.nombre;
						tdPrecio.textContent = producto.precio;
						tdStock.textContent = producto.stock;

						row.appendChild(tdNombre);
						row.appendChild(tdPrecio);
						row.appendChild(tdStock);

						tablaProductosBody.appendChild(row);
					});

				}
			} else {
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Error";
				alertaBody.textContent = "Error al buscar productos";
				console.error("Error en la respuesta del servidor:", response.status);
			}
		}).catch((error) => {
			alertaSpinner.classList.add("d-none");
			alertaHeader.textContent = "Error";
			alertaBody.textContent = "Error al buscar productos";
			console.error("Error en la solicitud:", error);
		});
	});

	// poblar tabla de usuarios buscando
	let buscarUsuarioFormulario = document.getElementById("buscarUsuarioForm");

	buscarUsuarioFormulario.addEventListener("submit", function (event) {
		event.preventDefault();

		let nombreBuscado = document.getElementById("buscarUsernameUsuarioInput").value.trim();
		let idBuscado = document.getElementById("buscarIdUsuarioInput").value.trim();

		let alertaToast = document.getElementById("alertaToast");
		let alertaHeader = document.getElementById("alertaHeader");
		let alertaBody = document.getElementById("alertaBody");
		let alertaSpinner = document.getElementById("alertaSpinner");
		alertaHeader.textContent = "Procesando solicitud...";
		alertaBody.textContent = "Buscando usuarios, por favor espere";
		alertaSpinner.classList.remove("d-none");
		let toast = new bootstrap.Toast(alertaToast, { autohide: false });
		toast.show();

		fetch(`/api/users/?username=${encodeURIComponent(nombreBuscado)}&id=${encodeURIComponent(idBuscado)}`, {
			method: "GET",
		}).then(async (response) => {
			if (response.ok) {
				let data = await response.json();

				// limpiar tabla antes de llenar
				tablaUsuariosBody.innerHTML = "";

				if (data.length === 0) {
					alertaSpinner.classList.add("d-none");
					alertaHeader.textContent = "Sin resultados";
					alertaBody.textContent = "No se encontraron usuarios";
				} else {
					alertaSpinner.classList.add("d-none");
					alertaHeader.textContent = "Exito";
					alertaBody.textContent = `Se encontraron ${data.length} usuarios`;

					data.forEach((usuario) => {
						let row = document.createElement("tr");
						let tdUsername = document.createElement("td");
						let tdNombre = document.createElement("td");
						let tdApellido = document.createElement("td");
						let tdDireccion = document.createElement("td");
						let tdTelefono = document.createElement("td");
						let tdEmail = document.createElement("td");
						let tdTipo = document.createElement("td");

						tdUsername.className = "textoMinimo";
						tdNombre.className = "textoMinimo";
						tdApellido.className = "textoMinimo";
						tdDireccion.className = "textoMinimo";
						tdTelefono.className = "textoMinimo";
						tdEmail.className = "textoMinimo";
						tdTipo.className = "textoMinimo";
						tdUsername.textContent = usuario.username;
						tdNombre.textContent = usuario.nombre;
						tdApellido.textContent = usuario.apellido;
						tdDireccion.textContent = usuario.direccion;
						tdTelefono.textContent = usuario.telefono;
						tdEmail.textContent = usuario.email;
						if (usuario.tipoUsuario === 1) {
							tdTipo.textContent = "Administrador";
						}
						if (usuario.tipoUsuario === 2) {
							tdTipo.textContent = "Cliente";
						}

						row.appendChild(tdUsername);
						row.appendChild(tdNombre);
						row.appendChild(tdApellido);
						row.appendChild(tdDireccion);
						row.appendChild(tdTelefono);
						row.appendChild(tdEmail);
						row.appendChild(tdTipo);

						tablaUsuariosBody.appendChild(row);
					});
				}
			} else {
				alertaSpinner.classList.add("d-none");
				alertaHeader.textContent = "Error";
				alertaBody.textContent = "Error al buscar usuarios";
				console.error("Error en la respuesta del servidor:", response.status);
			}
		}).catch((error) => {
			alertaSpinner.classList.add("d-none");
			alertaHeader.textContent = "Error";
			alertaBody.textContent = "Error al buscar usuarios";
			console.error("Error en la solicitud:", error);
		});

	});

});

/*

*/



