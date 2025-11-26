// ===========================================================================
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

// ===========================================================================
// Función para poblar la tabla de ventas pendientes
function poblarTablaVentasPendientes(idVentaBuscar = null, csrfToken = null) {
	let tablaVentasPendientesBody = document.getElementById("tablaVentasPendientesBody");
	let url = "/api/ventas/ventas-pendientes/";

	if (idVentaBuscar) {
		url = url + `?idBuscar=${encodeURIComponent(idVentaBuscar)}`;
	}

	fetch(url, {
		method: "GET",
	}).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			console.error("Error en la respuesta del servidor:", response.status);
			// lanzar un error para que se capture en el catch
			throw new Error("Error en la respuesta del servidor");
		}
	}).then((data) => {
		// vaciar tabla antes de llenar
		tablaVentasPendientesBody.innerHTML = "";

		if (data.length === 0) {
			crearElementoToast("Sin resultados", "No se encontraron ventas pendientes", "info");
		} else {
			crearElementoToast("Exito", `Se encontraron ${data.length} ventas pendientes`, "success");
		}

		data.forEach((venta) => {
			let row = document.createElement("tr");
			let tdCodigo = document.createElement("td");
			let tdFechaHora = document.createElement("td");
			let tdUsuario = document.createElement("td");
			let tdEstado = document.createElement("td");
			let tdVinculoConfirmar = document.createElement("td");

			let vinculoConfirmar = document.createElement("a");
			vinculoConfirmar.href = "";
			vinculoConfirmar.className = "textoMinimo";
			vinculoConfirmar.textContent = "Confirmar venta ✓";
			vinculoConfirmar.onclick = function (event) {
				event.preventDefault();
				confirmarVenta(venta.id, csrfToken);
			}

			tdCodigo.className = "textoMinimo";
			tdFechaHora.className = "textoMinimo";
			tdUsuario.className = "textoMinimo";
			tdEstado.className = "textoMinimo";
			tdVinculoConfirmar.className = "textoMinimo";

			tdCodigo.textContent = venta.id;
			tdFechaHora.textContent = new Date(venta.fechaHora).toLocaleString();
			tdUsuario.textContent = venta.usuario.nombre + " " + venta.usuario.apellido;
			tdEstado.textContent = venta.estadoVenta;
			tdVinculoConfirmar.appendChild(vinculoConfirmar);

			row.appendChild(tdCodigo);
			row.appendChild(tdFechaHora);
			row.appendChild(tdUsuario);
			row.appendChild(tdEstado);
			row.appendChild(tdVinculoConfirmar);

			tablaVentasPendientesBody.appendChild(row);
		});

	}).catch((error) => {
		crearElementoToast("Error", "Error al buscar ventas pendientes", "error");
		console.error("Error en la solicitud:", error);
	});
}

// ===========================================================================
// Funcion para poblar la tabla de usuarios
function poblarTablaUsuarios(idUsuarioBuscar = null, nombreUsuarioBuscar = null, csrfToken = null) {
	let tablaUsuariosBody = document.getElementById("tablaUsuariosBody");

	if (!idUsuarioBuscar) {
		idUsuarioBuscar = "";
	}
	if (!nombreUsuarioBuscar) {
		nombreUsuarioBuscar = "";
	}

	let url = `/api/users/?username=${encodeURIComponent(nombreUsuarioBuscar)}&id=${encodeURIComponent(idUsuarioBuscar)}`

	fetch(url, {
		method: "GET",
	}).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			console.error("Error en la respuesta del servidor:", response.status);
			// lanzar un error para que se capture en el catch
			throw new Error("Error en la respuesta del servidor");
		}
	}).then((data) => {
		// vaciar tabla antes de llenar
		tablaUsuariosBody.innerHTML = "";

		if (data.length === 0) {
			crearElementoToast("Sin resultados", "No se encontraron usuarios", "info");
		} else {
			crearElementoToast("Exito", `Se encontraron ${data.length} usuarios`, "success");
		}

		data.forEach((usuario) => {
			let row = document.createElement("tr");
			let tdUsername = document.createElement("td");
			let tdNombre = document.createElement("td");
			let tdApellido = document.createElement("td");
			let tdDireccion = document.createElement("td");
			let tdTelefono = document.createElement("td");
			let tdEmail = document.createElement("td");
			let tdTipo = document.createElement("td");
			let tdActualizar = document.createElement("td");
			let tdEliminar = document.createElement("td");

			let vinculoActualizar = document.createElement("a");

			vinculoActualizar.href = `/actualizarUsuario/${usuario.id}/`;
			vinculoActualizar.className = "textoMinimo";
			vinculoActualizar.textContent = "Modificar usuario ➔";
			tdActualizar.appendChild(vinculoActualizar);

			let vinculoEliminar = document.createElement("a");
			vinculoEliminar.href = "";
			vinculoEliminar.className = "textoMinimo";
			vinculoEliminar.textContent = "Eliminar usuario X";
			vinculoEliminar.onclick = function (event) {
				event.preventDefault();
				eliminarUsuario(usuario.id, csrfToken);
			}
			tdEliminar.appendChild(vinculoEliminar);

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
			row.appendChild(tdActualizar);
			row.appendChild(tdEliminar);

			tablaUsuariosBody.appendChild(row);
		});

	}).catch((error) => {
		crearElementoToast("Error", "Error al buscar usuarios", "error");
		console.error("Error en la solicitud:", error);
	});

}

// ===========================================================================
// Funcion para poblar la tabla de productos
function poblarTablaProductos(idProductoBuscar = null, nombreProductoBuscar = null, csrfToken = null) {
	let tablaProductosBody = document.getElementById("tablaProductosBody");

	let url = `/api/productos/?page_size=999999`;

	if (idProductoBuscar) {
		url += `&id=${encodeURIComponent(idProductoBuscar)}`;
	}
	if (nombreProductoBuscar) {
		url += `&nombre=${encodeURIComponent(nombreProductoBuscar)}`;
	}

	fetch(url, {
		method: "GET",
	}).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			console.error("Error en la respuesta del servidor:", response.status);
			// lanzar un error para que se capture en el catch
			throw new Error("Error en la respuesta del servidor");
		}
	}).then((data) => {
		// vaciar tabla antes de llenar
		tablaProductosBody.innerHTML = "";

		if (data.results.length === 0) {
			crearElementoToast("Sin resultados", "No se encontraron productos", "info");
		} else {
			crearElementoToast("Exito", `Se encontraron ${data.results.length} productos`, "success");
		}

		data.results.forEach((producto) => {
			let row = document.createElement("tr");
			let tdNombre = document.createElement("td");
			let tdPrecio = document.createElement("td");
			let tdStock = document.createElement("td");
			let tdActualizar = document.createElement("td");
			let tdEliminar = document.createElement("td");

			let vinculoActualizar = document.createElement("a");

			vinculoActualizar.href = `/actualizarProducto/${producto.id}/`;
			vinculoActualizar.className = "textoMinimo";
			vinculoActualizar.textContent = "Modificar produto ➔";

			tdActualizar.appendChild(vinculoActualizar);

			let vinculoEliminar = document.createElement("a");
			vinculoEliminar.href = "";
			vinculoEliminar.className = "textoMinimo";
			vinculoEliminar.textContent = "Eliminar produto X";
			vinculoEliminar.onclick = function (event) {
				event.preventDefault();
				eliminarProducto(producto.id, csrfToken);
			}
			tdEliminar.appendChild(vinculoEliminar);

			tdNombre.className = "textoMinimo";
			tdPrecio.className = "textoMinimo";
			tdStock.className = "textoMinimo";
			tdActualizar.className = "textoMinimo";
			tdEliminar.className = "textoMinimo";

			tdNombre.textContent = producto.nombre;
			tdPrecio.textContent = producto.precio;
			tdStock.textContent = producto.stock;

			row.appendChild(tdNombre);
			row.appendChild(tdPrecio);
			row.appendChild(tdStock);
			row.appendChild(tdActualizar);
			row.appendChild(tdEliminar);

			tablaProductosBody.appendChild(row);
		});

	}).catch((error) => {
		crearElementoToast("Error", "Error al buscar productos", "error");
		console.error("Error en la solicitud:", error);
	});
}

//===========================================================================
// funcion para eliminar un producto asignado a cada producto de la tabla
function eliminarProducto(productoId, csrfToken = null) {

	// función que realizará el DELETE cuando el usuario confirme
	async function funcionParaModal(id, tokenParaModal = null) {
		fetch(`/api/productos/${id}/`, {
			method: "DELETE",
			headers: { "X-CSRFToken": tokenParaModal, },
		}).then(async (response) => {
			if (response.ok) {
				crearElementoToast("Exito", "Producto eliminado con exito", "info");
				// recargar la tabla de productos
				poblarTablaProductos();
			} else {
				crearElementoToast("Error", "Error al eliminar el producto", "error");
			}
		}).catch((error) => {
			console.error("Error en la solicitud:", error);
			crearElementoToast("Error", "Error al eliminar el producto", "error");
		});
	}

	crearElementoModal(
		"Confirmacion requerida",
		"¿Está seguro de que desea eliminar el producto?",
		() => funcionParaModal(productoId, csrfToken),
		"confirmacion"
	);
}

//===========================================================================
// Función para eliminar un usuario asignado a cada usuario de la tabla
async function eliminarUsuario(usuarioId, csrfToken = null) {
	// función que realizará el DELETE cuando el usuario confirme
	async function funcionParaModal(id, tokenParaModal = null) {
		fetch(`/api/users/${id}/`, {
			method: "DELETE",
			headers: { "X-CSRFToken": tokenParaModal },
		}).then(async (response) => {
			if (response.ok) {
				crearElementoToast("Exito", "Usuario eliminado con exito", "info");
				poblarTablaUsuarios();
			} else {
				console.error("Error en la respuesta del servidor:", response.status);
				throw new Error("Error en la respuesta del servidor");
			}
		}).catch((error) => {
			console.error("Error en la solicitud:", error);
			crearElementoToast("Error", "Error al eliminar el usuario", "error");
		});
	}

	crearElementoModal(
		"Confirmacion requerida",
		"¿Está seguro de que desea eliminar el usuario?",
		() => funcionParaModal(usuarioId, csrfToken),
		"confirmacion"
	);
}

// ===========================================================================
// Función para confirmar una venta
function confirmarVenta(ventaId, csrfToken = null) {
	// patch para cambiar el estado de la venta a 'Confirmada'
	fetch(`/api/ventas/${ventaId}/`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": csrfToken,
		},
		body: JSON.stringify({ estadoVenta: "Confirmada" }),
	}).then(async (response) => {
		if (response.ok) {
			crearElementoToast("Exito", "Venta confirmada con exito", "success");
			// recargar la tabla de ventas pendientes
			let tablaVentasPendientesBody = document.getElementById("tablaVentasPendientesBody");
			tablaVentasPendientesBody.innerHTML = "";
			poblarTablaVentasPendientes();
		} else {
			console.error("Error en la respuesta del servidor:", response.status);
			throw new Error("Error en la respuesta del servidor");
		}
	}).catch((error) => {
		console.error("Error en la solicitud:", error);
		crearElementoToast("Error", "Error al confirmar la venta", "error");
	});
}

// ===========================================================================
// Funcion para cargar las categorias en el select de categorias
function cargarCategoriasEnSelect(selectElement) {

	fetch("/api/categorias/", {
		method: "GET",
	}).then((response) => {
		if (response.ok) {
			return response.json();
		}
	}).then((data) => {

		data.forEach((categoria) => {
			let option = document.createElement("option");
			option.value = categoria.id;
			option.textContent = categoria.nombre;
			selectElement.appendChild(option);
		});

	}).catch((error) => {
		console.error("Error en la solicitud:", error);
	});
}


// ===========================================================================
// Código principal al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {

	// ===========================================================================
	// Variables y elementos del DOM
	let categorias = [];
	let contenedorPills = document.getElementById("pillContainer");
	let categoriaSelect = document.getElementById("categoriaSelect");
	let categoriaPrincipalSelect = document.getElementById("categoriaPrincipalSelect");
	let formularioProducto = document.getElementById("formularioProducto");
	let formularioCategoria = document.getElementById("formularioCategoria");
	let buscarProductoFormulario = document.getElementById("buscarProductoForm");
	let formularioBuscarVentaPendiente = document.getElementById("buscarVentaForm");
	let buscarUsuarioFormulario = document.getElementById("buscarUsuarioForm");
	const csrftoken = getCookie("csrftoken");


	document.getElementById("imgInput").addEventListener("change", function () {
		const fileNameSpan = document.getElementById("imgFileName");
		fileNameSpan.textContent = this.files.length > 0 ? this.files[0].name : "Ningún archivo";
	});

	// ===========================================================================
	// ejecutar funciones
	poblarTablaVentasPendientes(null, csrftoken);
	poblarTablaUsuarios(null, null, csrftoken);
	poblarTablaProductos(null, null, csrftoken);
	cargarCategoriasEnSelect(categoriaSelect);
	cargarCategoriasEnSelect(categoriaPrincipalSelect);

	//===========================================================================
	// Manejar envío del formulario de búsqueda de venta pendiente
	formularioBuscarVentaPendiente.addEventListener("submit", function (event) {
		event.preventDefault();
		let idVentaBuscada = document.getElementById("buscarIdVentaInput").value.trim();
		poblarTablaVentasPendientes(idVentaBuscada, csrftoken);
	});

	// ===========================================================================
	// Manejar envío del formulario de búsqueda de usuario
	buscarUsuarioFormulario.addEventListener("submit", function (event) {
		event.preventDefault();
		let idUsuarioBuscado = document.getElementById("buscarIdUsuarioInput").value.trim();
		let nombreUsuarioBuscado = document.getElementById("buscarUsernameUsuarioInput").value.trim();
		poblarTablaUsuarios(idUsuarioBuscado, nombreUsuarioBuscado, csrftoken);
	});

	// ===========================================================================
	// Manejar envío del formulario de búsqueda de producto
	buscarProductoFormulario.addEventListener("submit", function (event) {
		event.preventDefault();
		let idProductoBuscado = document.getElementById("buscarIdProductoInput").value.trim();
		let nombreProductoBuscado = document.getElementById("buscarNombreProductoInput").value.trim();
		poblarTablaProductos(idProductoBuscado, nombreProductoBuscado, csrftoken);
	});

	//===========================================================================
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

	//===========================================================================
	// Manejar envío del formulario de producto

	formularioProducto.addEventListener("submit", async function (event) {
		event.preventDefault();

		// mostrar alerta de procesamiento
		crearElementoToast("Procesando solicitud...", "Creando producto, por favor espere", "loading");

		// deshabilitar boton submit
		let botonSubmit = document.getElementById("crearProductoButton");
		botonSubmit.disabled = true;

		let nombreProducto = document.getElementById("nombreInput").value;
		let precioProducto = document.getElementById("precioInput").value;
		let imagenProducto = document.getElementById("imgInput").files[0];
		let descripcionProducto = document.getElementById("descripcionInput").value;
		let stockProducto = document.getElementById("stockInput").value;
		let categoriaPrincipalProducto = categoriaPrincipalSelect.value;

		let formData = new FormData();
		formData.append("nombre", nombreProducto);
		formData.append("precio", precioProducto);
		formData.append("descripcion", descripcionProducto);
		formData.append("stock", stockProducto);
		formData.append("categoriaPrincipal", categoriaPrincipalProducto);
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
				eliminarUltimoToast();
				crearElementoToast("Exito", "Producto creado con exito", "success");
				let data = response.json();
				return data;
			}
			if (!response.ok) {
				categorias = [];
				// vaciar contenedor de pills
				contenedorPills.innerHTML = "";
				// resetear el input file name
				document.getElementById("imgFileName").textContent = "Ningún archivo";
				// resetear formulario
				formularioProducto.reset();
				// eliminar alerta de procesamiento
				eliminarUltimoToast();
				crearElementoToast("Error", "Error al crear el producto", "error");
				throw new Error("Error en la respuesta del servidor");
			}
		}).then((data) => {

			for (let categoriaId of categorias) {
				let formDataCategoriaProducto = new FormData();
				categoriaId = parseInt(categoriaId);
				formDataCategoriaProducto.append("producto", data.id);
				formDataCategoriaProducto.append("categoria", categoriaId);

				fetch("/api/categoria-productos/", {
					method: "POST",
					body: formDataCategoriaProducto,
					headers: { "X-CSRFToken": csrftoken },
				}).then(async (response) => {
					if (response.ok) {
						// categoría-producto creada con éxito
					} else {
						// error al crear categoría-producto
					}
				}).then((dataCategoriaProducto) => {
					// categoría-producto creada con éxito, data de la respuesta

				}).catch((error) => {
					console.error("Error en la solicitud:", error);
				});
			}
			// resetear formulario
			formularioProducto.reset();
			// limpiar array de categorias
			categorias = [];
			// vaciar contenedor de pills
			contenedorPills.innerHTML = "";
			// resetear el input file name
			document.getElementById("imgFileName").textContent = "Ningún archivo";


		}).catch((error) => {
			// resetear formulario
			formularioProducto.reset();
			// limpiar array de categorias
			categorias = [];
			// vaciar contenedor de pills
			contenedorPills.innerHTML = "";
			// resetear el input file name
			document.getElementById("imgFileName").textContent = "Ningún archivo";

			console.error("Error en la solicitud:", error);
			eliminarUltimoToast();
			crearElementoToast("Error", "Error al crear el producto", "error");
		});

		// habilitar boton submit
		botonSubmit.disabled = false;

	});

	//===========================================================================
	// Manejar envío del formulario de categoria
	formularioCategoria.addEventListener("submit", async function (event) {
		event.preventDefault();
		// deshabilitar boton submit
		let botonSubmit = document.getElementById("registrarCategoriaButton");
		botonSubmit.disabled = true;

		// mostrar alerta de procesamiento
		crearElementoToast("Procesando solicitud...", "Creando categoria, por favor espere", "loading");

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
				formularioCategoria.reset();
				eliminarUltimoToast();
				crearElementoToast("Exito", "Categoria creada con exito", "success");
			}
			if (!response.ok) {
				let data = await response.json().catch(() => ({}));
				formularioCategoria.reset();
				eliminarUltimoToast();
				crearElementoToast("Error", "Error al crear la categoria", "error");
			};
		}).catch((error) => {
			console.error("Error en la solicitud:", error);
			eliminarUltimoToast();
			crearElementoToast("Error", "Error al crear la categoria", "error");
		});

		// habilitar boton submit
		botonSubmit.disabled = false;
	});
});





