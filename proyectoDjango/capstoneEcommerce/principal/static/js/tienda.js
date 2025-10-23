document.addEventListener("DOMContentLoaded", function () {

	let API_URL = "/api/productos/";

	let paginaActual = 1;

	let grid = document.getElementById("productosGrid");
	let paginationEl = document.getElementById("pagination");

	let currency = new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		maximumFractionDigits: 0,
	});


	async function fetchProducts(page) {

		setLoading(true);

		fetch(API_URL + `?page=${encodeURIComponent(page)}`, {
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
			const precio = typeof p.precio === "number" ? currency.format(p.precio) : "";
			const detalleUrl = `/producto/${p.id}/`;

			items += `
				<div class="col-6 col-sm-3 mb-2">
					<div class="card h-100">
					<img src="${img}" class="card-img-top" alt="${escapeHtml(nombre)}">
					<div class="card-body d-flex flex-column">
						<h5 class="card-title mb-3">${escapeHtml(nombre)}</h5>
						<div class="mt-auto">
						<p class="fw-bold mb-2">${precio}</p>
						<a href="${detalleUrl}" class="botonGenerico w-100">Ver detalle</a>
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
});