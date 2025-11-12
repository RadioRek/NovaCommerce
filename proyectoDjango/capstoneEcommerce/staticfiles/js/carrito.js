const PORCENTAJE_IVA = 0.19;

function crearCartaProducto(producto, cantidad) {
    const template = document.createElement("template");
    template.innerHTML = `
        <div class="row d-flex">
            <div class="col-12 col-sm-6 d-flex flex-column justify-content-center mb-4 mb-sm-0">
                <div class="card">
                    <div class="row g-0">
                        <div class="col-4 d-flex justify-content-center align-items-center">
                            <img src="${producto.img}" class="imgCheck" alt="...">
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                                <h6 class="head6 mb-0">${producto.nombre}</h6>
                                <p class="textoMinimo mb-0">${producto.descripcion}</p>
                                <p class="parrafoPequeño mb-0">$${producto.precio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-6 d-flex flex-column justify-content-center">
                <form action="" class="mb-4">
                    <div class="row m-0 p-0">
                        <button class="col-2 botonGenerico m-0">-</button>
                        <div class="col-8 m-0 p-0">
                            <input type="number" class="form-control estiloInput parrafoPequeño m-0 campoCantidad" value="${cantidad}" min="1">
                        </div>
                        <button class="col-2 botonGenerico m-0">+</button>
                    </div>
                </form>
                <button class="botonGenerico w-25 align-self-center botonQuitarProd">Eliminar</button>
            </div>

            <hr class="mt-4" />
        </div>
    `.trim();

    return template.content.firstElementChild;
}

function actualizarCarrito(csrftoken) {
    fetch("/api/detalle-carritos/", {
        method: "GET",
    }).then((response) => {
        if (response.ok) {
            let data = response.json();
            return data;

        } else {
            throw new Error("Error en la respuesta de la API");
        }

    }).then((data) => {
        let contenedorCartas = document.getElementById("contenedorCartasCarrito");
        contenedorCartas.innerHTML = "";

        data.forEach(detalleCarrito => {
            let cartaProducto = crearCartaProducto(detalleCarrito.producto, detalleCarrito.cantidad);

            let inputCantidad = cartaProducto.querySelector(".campoCantidad");
            inputCantidad.addEventListener("change", function (event) {
                let nuevaCantidad = parseInt(event.target.value);
                if (nuevaCantidad > 0) {
                    actualizarCantidadProducto(detalleCarrito.id, nuevaCantidad, csrftoken);
                } else {
                    crearElementoToast("Error", "La cantidad debe ser mayor a 0", "error");
                    event.target.value = detalleCarrito.cantidad;
                }
            });

            let botonQuitar = cartaProducto.querySelector(".botonQuitarProd");
            botonQuitar.addEventListener("click", function () {
                quitarProductoCarrito(detalleCarrito.id, csrftoken);
            });

            contenedorCartas.appendChild(cartaProducto);
        });

    }).catch((error) => {
        console.error("Error al cargar:", error);
    });
}

function actualizarCantidadProducto(idDetalleCarrito, nuevaCantidad, csrftoken) {
    fetch(`/api/detalle-carritos/${idDetalleCarrito}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
    }).then(response => {
        if (!response.ok) {

        }
        return response.json();
    }).then(data => {

    }).then(() => {
        actualizarTotalesCarrito();
    }).catch(error => {
        console.error("Error:", error);
    });
}

function actualizarTotalesCarrito() {
    fetch("/api/detalle-carritos/", {
        method: "GET",
    }).then((response) => {
        if (response.ok) {
            let data = response.json();
            return data;

        } else {
            throw new Error("Error en la respuesta de la API");
        }

    }).then(async (data) => {
        let subtotal = 0;
        let iva = 0;
        let total = 0;
        let elementoSubtotal = document.getElementById("valorSubtotal")
        let elementoIVA = document.getElementById("valorIVA")
        let elementoTotal = document.getElementById("valorTotal")

        await data.forEach(detalleCarrito => {
            total = total + (detalleCarrito.producto.precio * detalleCarrito.cantidad);
        })

        iva = total * PORCENTAJE_IVA;
        subtotal = total - iva;

        elementoSubtotal.textContent = `$${subtotal.toFixed(0)}`;
        elementoIVA.textContent = `$${iva.toFixed(0)}`;
        elementoTotal.textContent = `$${total.toFixed(0)}`;

    }).catch((error) => {
        console.error("Error al cargar:", error);
    });


}

function quitarProductoCarrito(idDetalleCarrito, csrftoken) {
    fetch(`/api/detalle-carritos/${idDetalleCarrito}/`, {
        method: "DELETE",
        headers: {
            "X-CSRFToken": csrftoken
        },
    }).then(response => {
        if (response.ok) {
            actualizarCarrito(csrftoken);
            actualizarTotalesCarrito();
            actualizarBadgeCarrito();

        } else {
            crearElementoToast("Error", "No se pudo eliminar el producto del carrito", "error");
        }
    }).catch(error => {
        console.error("Error:", error);
    });
}

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

    actualizarCarrito(csrftoken);
    actualizarTotalesCarrito();

});
