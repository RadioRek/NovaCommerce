document.addEventListener("DOMContentLoaded", function () {

	let API_URL = "/api/productos/";

	let grid = document.getElementById("productosGrid");
	let paginationEl = document.getElementById("pagination");

	let currency = new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		maximumFractionDigits: 0,
	});


	async function fetchProducts(page, query = "") {
		setLoading(true);
		let url = API_URL + `?page=${encodeURIComponent(page)}`;
		if (query) {
			url += "&" + query;
		}

		fetch(url, {
			method: "GET",
			credentials: "same-origin",
		}).then(async (response) => {
			if (response.ok) {
				let data = await response.json();

				if (data && data.results) {
					renderProducts(data.results);
					renderPagination(data.count, page, 8);
				} else {
					renderProducts([]);
					renderPagination(0, page, 8);
				}

			} else {
				console.error("Error al obtener productos");
			}
		}).catch((error) => {
			console.error("Error en la solicitud:", error);
		});

		setLoading(false);
		paginaActual = page;
	}

	function renderPagination(totalCount, page, pageSize) {

		let totalPages = Math.ceil(totalCount / pageSize);

		function pageItem(label, targetPage, disabled = false, active = false) {


			const li = document.createElement("li");
			li.className = "page-item";

			if (disabled) {
				li.classList.add("disabled");
			}

			if (active) {
				li.classList.add("active");
			}

			const a = document.createElement("a");
			a.className = "page-link";
			a.href = "#";
			a.textContent = label;

			if (!disabled && !active) {
				a.addEventListener("click", function (e) {
					e.preventDefault();
					fetchProducts(targetPage);
				});
			}

			li.appendChild(a);
			return li;
		}

		paginationEl.innerHTML = "";

		paginationEl.appendChild(pageItem("«", page - 1, page <= 1));

		// botones del paginado
		let botonesMaximos = 5;

		let half = Math.floor(botonesMaximos / 2);

		let start;

		if (page - half < 1) {
			start = 1;
		} else {
			start = page - half;
		}

		let end;

		if (start + botonesMaximos - 1 > totalPages) {
			end = totalPages;
		} else {
			end = start + botonesMaximos - 1;
		}


		if (end - start + 1 < botonesMaximos) {
			if (end - botonesMaximos + 1 < 1) {
				start = 1;
			} else {
				start = end - botonesMaximos + 1;
			}
		} else {
			// no se necesita hacer nada, start queda igual
		}


		for (let pageNumber = start; pageNumber <= end; pageNumber = pageNumber + 1) {
			paginationEl.appendChild(pageItem(String(pageNumber), pageNumber, false, pageNumber === page));
		}


		paginationEl.appendChild(pageItem("»", page + 1, page >= totalPages));
	}

	function setLoading(isLoading) {
		if (!grid) return;
		if (isLoading) {
			grid.innerHTML = `<div class="col-12 text-center py-4">Cargando productos...</div>`;
		}
	}

	function renderProducts(products) {
		if (!products.length) {
			grid.innerHTML = `<div class="col-12 text-center py-4">No hay productos disponibles.</div>`;
			return;
		}

		let items = "";

		products.forEach((p) => {
			const img = p.img;
			const nombre = p.nombre || "Producto";
			let precio;

			if (typeof p.precio === "number") {
				precio = currency.format(p.precio);
			} else {
				precio = "";
			}
			const detalleUrl = `/producto/${p.id}/`;

			items += `
				<div class="col">
					<div class="cartita card">
						<img src="${img}" class="cartitaImg" alt="${escapeHtml(nombre)}">
						<div class="card-body d-flex flex-column p-2">
							<h6 class="head6 m-0">${escapeHtml(nombre)}</h6>
							<parrafo class="parrafoPequeño">${precio}</parrafo>
							<div class="mt-auto d-flex m-0 p-0 flex-wrap gap-2">
								<button class="botonSuccess flex-shrink-0" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
								<a href="${detalleUrl}" class="text-decoration-none flex-shrink-0 botonGenerico">Ver detalle</a>
							</div>
						</div>
					</div>
				</div>
			`;
		});

		grid.innerHTML = items;
	}

	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	if (grid) fetchProducts(1);


	// Cargar categorias en el select
	let categorias = [];
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
			pill.className = "pill rounded-pill textoMinimoBlanco d-flex align-items-center";
			pill.textContent = nombreCategoria;

			// Crear botón de eliminar
			let closeBtn = document.createElement("span");
			closeBtn.textContent = "×"; // símbolo de X
			closeBtn.style.cursor = "pointer";
			closeBtn.style.marginLeft = "8px";
			closeBtn.addEventListener("click", () => {
				// Eliminar del array
				const index = categorias.indexOf(valorSeleccionado);
				if (index > -1) categorias.splice(index, 1);

				// Eliminar del DOM
				colDiv.remove();
			});

			pill.appendChild(closeBtn);
			colDiv.appendChild(pill);
			contenedorPills.appendChild(colDiv);
		}
	});


	let formularioBuscar = document.getElementById("buscarProductosCategorias");

	formularioBuscar.addEventListener("submit", function (e) {
		e.preventDefault();

		let query = "";

		categorias.forEach((id, index) => {
			if (index > 0) query += "&";
			query += "categorias=" + encodeURIComponent(id);
		});


		fetchProducts(1, query);
	});

});

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

async function agregarAlCarrito(productId) {

	fetch("/api/detalle-carritos/", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		},
		body: JSON.stringify({
			producto_id: productId,
			cantidad: 1
		})
	}).then(async (response) => {
		let data = await response.json();

		if (response.ok) {
			crearElementoToast("Éxito", "Producto agregado al carrito", "success");
			actualizarBadgeCarrito();
		} else {
			if (response.status === 401) {
				crearElementoToast("Error", "Debe iniciar sesión para agregar productos al carrito. Redirigiendo...", "error");
				setTimeout(() => {
					window.location.href = "/sitioLogin/";
				}, 2000);
			} else {
				crearElementoToast("Error", data.error || "No se pudo agregar el producto al carrito", "error");
			}
		}
	}).catch((error) => {
		console.error("Error en la solicitud:", error);
	});
}






















