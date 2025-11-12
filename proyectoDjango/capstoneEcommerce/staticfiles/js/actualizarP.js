document.addEventListener("DOMContentLoaded", () => {

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

    let productoId = document.getElementById("productoId").value;

    let categoriaPrincipalId = document.getElementById("categoriaPrincipalId").value;

    let imgPreview = document.getElementById("imgPreview");

    let editImgInput = document.getElementById("editImgInput");

    // si se sube una nueva imagen cambiar el preview
    editImgInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    let contenedorPills = document.getElementById("editPill");

    let categorias = [];

    // cargar categorias del producto
    fetch(`/api/categoria-productos/?producto_id=${encodeURIComponent(productoId)}`, {
        method: "GET",
    }).then(async (response) => {
        if (response.ok) {
            let data = await response.json();

            data.forEach((catProd) => {
                categorias.push(String(catProd.categoria.id));

                let colDiv = document.createElement("div");
                colDiv.className = "col-auto p-0 m-0";

                let pill = document.createElement("p");
                pill.className = "pill rounded-pill textoMinimoBlanco";
                pill.textContent = catProd.categoria.nombre;


                // Crear botón de eliminar
                let closeBtn = document.createElement("span");
                closeBtn.textContent = "×"; // símbolo de X
                closeBtn.style.cursor = "pointer";
                closeBtn.style.marginLeft = "8px";
                closeBtn.addEventListener("click", () => {
                    // Eliminar del array
                    const index = categorias.indexOf(String(catProd.categoria.id));
                    if (index > -1) categorias.splice(index, 1);

                    // Eliminar del DOM
                    colDiv.remove();
                });

                pill.appendChild(closeBtn);
                colDiv.appendChild(pill);
                contenedorPills.appendChild(colDiv);

            });
        } else {
            console.error("No se pudieron cargar las categorías del producto. Status:", response.status);
        }
    }).catch((error) => {
        console.error("Error en la solicitud de categorias del producto:", error);
    });

    let categoriaPrincipalInput = document.getElementById("categoriaPrincipalInput");
    let categoriasInput = document.getElementById("editCategoriaInput");

    // Cargar categorias en el select
    fetch("/api/categorias/", {
        method: "GET",
    }).then(async (response) => {
        if (response.ok) {
            const data = await response.json();
            data.forEach((categoria) => {
                let option = document.createElement("option");
                option.value = categoria.id;
                option.textContent = categoria.nombre;
                if (String(categoria.id) === String(categoriaPrincipalId)) {
                    option.selected = true;
                }
                categoriaPrincipalInput.appendChild(option);

                let opcion2 = document.createElement("option");
                opcion2.value = categoria.id;
                opcion2.textContent = categoria.nombre;
                categoriasInput.appendChild(opcion2);
            });

        } else {
            console.error("No se pudieron cargar las categorías. Status:", response.status);
        }
    }).catch((error) => {
        console.error("Error en la solicitud de categorías:", error);
    });

    // Manejar selección de categoría
    categoriasInput.addEventListener("change", (event) => {
        let valorSeleccionado = event.target.value;
        let nombreCategoria = categoriasInput.options[categoriasInput.selectedIndex].text;

        if (valorSeleccionado && !categorias.includes(valorSeleccionado)) {
            categorias.push(valorSeleccionado);

            let colDiv = document.createElement("div");
            colDiv.className = "col-auto p-0 m-0";

            let pill = document.createElement("p");
            pill.className = "pill rounded-pill textoMinimoBlanco";
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

    // manejar el submit del formulario
    let formularioEditar = document.getElementById("editarproducto");

    formularioEditar.addEventListener("submit", function (e) {
        e.preventDefault();

        let nombre = document.getElementById("editNombreInput").value;
        let precio = document.getElementById("editPrecioInput").value;
        let descripcion = document.getElementById("editDescripcion").value;
        let stock = document.getElementById("editStockInput").value;
        let categoriaPrincipal = categoriaPrincipalInput.value;

        let formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("precio", precio);
        formData.append("descripcion", descripcion);
        formData.append("stock", stock);
        formData.append("categoriaPrincipal", categoriaPrincipal);
        categorias.forEach((catId) => {
            formData.append("categorias", catId);
        });

        // si se selecciono una nueva imagen, agregarla al formdata
        if (editImgInput.files.length > 0) {
            formData.append("img", editImgInput.files[0]);
        }

        fetch(`/api/productos/${encodeURIComponent(productoId)}/`, {
            method: "PATCH",
            body: formData,
            headers: { "X-CSRFToken": csrftoken, },
        }).then(async (response) => {
            if (response.ok) {
                let data = await response.json();
                crearElementoToast("Exito", "Producto actualizado correctamente.", "success");
            } else {
                let errorData = await response.json();
                crearElementoToast("Error", "No se pudo actualizar el producto.", "error");
            }
        }).catch((error) => {
            crearElementoToast("Error", "No se pudo actualizar el producto.", "error");
            console.error("Error en la solicitud de actualización:", error);
        });
    });
});


