const PORCENTAJE_IVA = 0.19;

// ===========================================================================
// Función para crear la carta de un producto en el carrito
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
                        <button type="button" class="col-2 botonGenerico m-0" onclick="actualizarCantidad(this)">-</button>
                        <div class="col-8 m-0 p-0">
                            <input type="number" class="form-control estiloInput parrafoPequeño m-0 campoCantidad" value="${cantidad}" min="1">
                        </div>
                        <button type="button" class="col-2 botonGenerico m-0" onclick="actualizarCantidad(this)">+</button>
                    </div>
                </form>
                <button class="botonDanger w-25 align-self-center botonQuitarProd">Eliminar</button>
            </div>

            <hr class="mt-4" />
        </div>
    `.trim();

    return template.content.firstElementChild;
}

function actualizarCantidad(button) {
    let inputCantidad = button.parentElement.querySelector(".campoCantidad");
    let currentValue = parseInt(inputCantidad.value);

    if (button.textContent === "+") {
        inputCantidad.value = currentValue + 1;
    } else if (button.textContent === "-") {
        if (currentValue > 1) {
            inputCantidad.value = currentValue - 1;
        }
    }

    inputCantidad.dispatchEvent(new Event("change", { bubbles: true }));
}

// ===========================================================================
// Función para actualizar el carrito
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

        if (data.length === 0) {
            // en caso de no tener productos en el carrito generamos una texto indicándolo y con un boton para ir a la tienda
            const templateVacio = document.createElement("template");
            templateVacio.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center my-5">
                    <h5 class="head5 mb-3">Tu carrito está vacío</h5>
                    <a href="/tienda/" class="btn botonGenerico">Ir a la tienda</a>
                </div>
            `.trim();
            contenedorCartas.appendChild(templateVacio.content.firstElementChild);
            return;
        }


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

// ===========================================================================
// Función para actualizar la cantidad de un producto en el carrito
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

// ===========================================================================
// Función para actualizar los totales del carrito
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


// ===========================================================================
// Función para quitar un producto del carrito
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

// ===========================================================================
// Función para obtener el valor de una cookie por su nombre
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
// Cuando el DOM esté cargado se ejecutan cositas
document.addEventListener("DOMContentLoaded", function () {

    const csrftoken = getCookie("csrftoken");

    actualizarCarrito(csrftoken);
    actualizarTotalesCarrito();

});
