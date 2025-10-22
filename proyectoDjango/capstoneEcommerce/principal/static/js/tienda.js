(() => {
	const API_URL = "/api/productos/";
	const PAGE_SIZE = 8; // coincide con la paginación del backend

	const grid = document.getElementById("productosGrid");
	const paginationEl = document.getElementById("pagination");

	const currency = new Intl.NumberFormat("es-CL", {
		style: "currency",
		currency: "CLP",
		maximumFractionDigits: 0,
	});

	let currentPage = 1;

	async function fetchProducts(page = 1) {
		try {
			setLoading(true);
			const url = new URL(API_URL, window.location.origin);
			url.searchParams.set("page", String(page));
			url.searchParams.set("page_size", String(PAGE_SIZE));

			const res = await fetch(url, { credentials: "same-origin" });
			if (!res.ok) throw new Error("Error al obtener productos");
			const data = await res.json();

			renderProducts(data.results || []);
			renderPagination(data.count || 0, page, PAGE_SIZE);
			currentPage = page;
		} catch (err) {
			showError(err.message || "Error cargando productos");
		} finally {
			setLoading(false);
		}
	}

	function setLoading(isLoading) {
		if (!grid) return;
		if (isLoading) {
			grid.innerHTML = `<div class="col-12 text-center py-4">Cargando productos...</div>`;
		}
	}

	function showError(message) {
		if (!grid) return;
		grid.innerHTML = `<div class="col-12 text-center text-danger py-4">${message}</div>`;
		if (paginationEl) paginationEl.innerHTML = "";
	}

	function renderProducts(products) {
		if (!grid) return;
		if (!products.length) {
			grid.innerHTML = `<div class="col-12 text-center py-4">No hay productos disponibles.</div>`;
			return;
		}


		const items = products
			.map((p) => {
				const img = p.img || placeholder;
				const nombre = p.nombre || "Producto";
				const precio = typeof p.precio === "number" ? currency.format(p.precio) : "";
				const detalleUrl = `/producto/${p.id}/`;
				return `
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
          </div>`;
			})
			.join("");

		grid.innerHTML = items;
	}

	function renderPagination(totalCount, page, pageSize) {
		if (!paginationEl) return;
		const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

		const pageItem = (label, targetPage, disabled = false, active = false) => {
			const li = document.createElement("li");
			li.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`;
			const a = document.createElement("a");
			a.className = "page-link";
			a.href = "#";
			a.textContent = label;
			if (!disabled && !active) {
				a.addEventListener("click", (e) => {
					e.preventDefault();
					fetchProducts(targetPage);
				});
			}
			li.appendChild(a);
			return li;
		};

		paginationEl.innerHTML = "";
		// Prev
		paginationEl.appendChild(pageItem("«", page - 1, page <= 1));

		// paginado
		const maxToShow = 5;
		const half = Math.floor(maxToShow / 2);
		let start = Math.max(1, page - half);
		let end = Math.min(totalPages, start + maxToShow - 1);
		if (end - start + 1 < maxToShow) start = Math.max(1, end - maxToShow + 1);

		for (let p = start; p <= end; p++) {
			paginationEl.appendChild(pageItem(String(p), p, false, p === page));
		}

		paginationEl.appendChild(pageItem("»", page + 1, page >= totalPages));
	}

	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	document.addEventListener("DOMContentLoaded", () => {
		if (grid) fetchProducts(1);
	});
})();

