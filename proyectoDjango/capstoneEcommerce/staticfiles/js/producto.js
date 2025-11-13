function crearCartaProducto(producto) {
    let template = document.createElement("template");
    template.innerHTML = `
        <div class="flex-prod flex-grow-1">
            <div class="cartita card">
                <img src="${producto.img}" class="imgProd" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column p-2">
                    <h6 class="head6 m-0">${producto.nombre}</h6>
                    <parrafo class="parrafoPequeño">${producto.precio}</parrafo>
                    <div class="mt-auto d-flex m-0 p-0 flex-wrap gap-2">
                        <a href="/producto/${producto.id}/" class="text-decoration-none flex-shrink-0 botonGenerico">Ver detalle</a>
                    </div>
                </div>
            </div>
        </div>
        `.trim();
    return template.content.firstElementChild;
}

function cargarProductosRelacionados(productoId) {
    let contenedorProductosRelacionados = document.getElementById('contProdRelacionados');
    let id = productoId;

    fetch(`/api/productos/productos-relacionados/?producto_id=${id}`, {
        method: 'GET',
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al obtener los productos relacionados.');
        }
    }).then((data) => {

        data.forEach(producto => {
            let cartaProducto = crearCartaProducto(producto);
            contenedorProductosRelacionados.appendChild(cartaProducto);
        });
    }).catch((error) => {
        console.error(error);
    });
}

function agregarAlCarrito(productoId) {
    const csrftoken = getCookie("csrftoken");
    fetch("/api/detalle-carritos/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            producto_id: productoId,
            cantidad: 1
        })
    }).then((response) => {
        if (response.ok) {
            let data = response.json();
        } else {
            throw new Error('Error al agregar el producto al carrito.');
        }
    }).then((data) => {
        crearElementoToast("Éxito", "Producto agregado al carrito.", "success");
        actualizarBadgeCarrito();

    }).catch((error) => {
        crearElementoToast("Error", "Error desconocido al agregar el producto al carrito.", "error");
    });
}

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

document.addEventListener("DOMContentLoaded", function () {
    let productoId = document.getElementById('productoId').value;

    cargarProductosRelacionados(productoId);

});