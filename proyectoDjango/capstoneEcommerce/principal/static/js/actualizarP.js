document.addEventListener("DOMContentLoaded", () => {
    const selected = new Set();

    // obtener elementos (fallbacks por si cambian ids en la plantilla)
    const categoriaSelect = document.getElementById("editCategoriaInput");
    const pillContainer = document.getElementById("editPill");
    const form = document.getElementById("editarproducto")
    const nombreInput = document.getElementById("editNombreInput");
    const precioInput = document.getElementById("editPrecioInput");
    const descriptionInput = document.getElementById("editDescription");
    const stockInput = document.getElementById("editStockInput");
    const imagenInput = document.getElementById("editImgInput");
    const cambiosDiv = document.getElementById("editCambios");

    // helper CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let c of cookies) {
                c = c.trim();
                if (c.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(c.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie("csrftoken");

     // obtener id del producto (desde URL)
    function getProductId() {
        const q = new URLSearchParams(window.location.search).get("id");
        if (q) return q;
        const parts = window.location.pathname.replace(/\/$/, "").split("/");
        const last = parts[parts.length - 1];
        return /^\d+$/.test(last) ? last : null;
    }

    // submit handler
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        let nombreProducto = document.getElementById("editNombreInput")?.value ?? "";
        let precioProducto = document.getElementById("editPrecioInput")?.value ?? "";
        let imagenProducto = document.getElementById("editImgInput")?.files[0];
        let descripcionProducto = document.getElementById("editDescription")?.value ?? "";
        let stockProducto = document.getElementById("editStockInput")?.value ?? "";
        let idProducto = getProductId();

        // construir FormData
        let formData = new FormData();
        formData.append("nombre", nombreProducto);
        formData.append("precio", precioProducto);
        formData.append("descripcion", descripcionProducto);
        formData.append("stock", stockProducto);

        if (imagenProducto) {
            formData.append("img", imagenProducto);
        }

        // añadir categorías seleccionadas
        selected.forEach(id => formData.append("categorias", id));

        fetch(`/api/productos/${encodeURIComponent(idProducto)}/`, {
            method: "PUT",
            body: formData,
            headers: { "X-CSRFToken": csrftoken },
        }).then(async (response) => {
            if (response.ok) {
                let data = await response.json();
                console.log("Producto actualizado:", data);
                window.location.href = "/panelControl/";
            } else {
                console.error("Error al actualizar. Status:", response.status);
                alert("Error al actualizar el producto");
            }
        }).catch((error) => {
            console.error("Error en la solicitud:", error);
            alert("Error de red");
        });
    });

// Cargar categorias en el select
fetch("/api/categorias/", {
    method: "GET",
})
.then(async (response) => {
    if (response.ok) {
        const data = await response.json();
        data.forEach((categoria) => {
            let option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            categoriaSelect.appendChild(option);
        });
    } else {
        console.error("No se pudieron cargar las categorías. Status:", response.status);
    }
})
.catch((error) => {
    console.error("Error en la solicitud de categorías:", error);
});

const selectedCategories = document.getElementById("editCategoriaInput");

// Crear pill visual con botón para eliminar
function createPill(id, name) {
    const colDiv = document.createElement("div");
    colDiv.className = "col-auto p-0 m-0";

    const pill = document.createElement("p");
    pill.className = "pill rounded-pill textoMinimoBlanco d-inline-flex align-items-center";
    pill.textContent = name;

    // Botón para eliminar la pill
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-close btn-close-white btn-sm ms-2";
    btn.setAttribute("aria-label", "Quitar");
    btn.addEventListener("click", () => {
        selected.delete(String(id));
        colDiv.remove();
    });

    pill.appendChild(btn);
    colDiv.appendChild(pill);
    return colDiv;
}

// Evento para crear pills al seleccionar una categoría
categoriaSelect.addEventListener("change", (event) => {
    const val = categoriaSelect.value;
    const name = categoriaSelect.options[categoriaSelect.selectedIndex]?.text || `Categoria ${val}`;
    if (!val || selected.has(String(val))) {
        categoriaSelect.selectedIndex = 0;
        return;
    }
    selected.add(String(val));
    pillContainer.appendChild(createPill(val, name));
    categoriaSelect.selectedIndex = 0;
});


});
