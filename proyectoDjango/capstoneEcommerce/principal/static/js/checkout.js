const PORCENTAJE_IVA = 0.19;

function crearCartaProducto(producto, cantidad) {
    const template = document.createElement("template");
    template.innerHTML = `

        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-4 d-flex justify-content-center align-items-center">
                    <img src="${producto.img}" class="imgCheck" alt="...">
                </div>

                <div class="col-8">
                    <div class="card-body">
                        <h6 class="head6 mb-0">${producto.nombre}</h6>
                        <p class="parrafoPequeño mb-0">${producto.precio}</p>
                        <p class="textoMinimo mb-0">Cantidad: ${cantidad}</p>
                    </div>
                </div>
            </div>

        </div>
    `.trim();

    return template.content.firstElementChild;
}

function actualizarCheckout() {
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
        let contenedorCartas = document.getElementById("contProductosCheckout");
        contenedorCartas.innerHTML = "";

        let totalArticulos = 0;
        let subtotal = 0;
        let total = 0;
        let pCantidadArticulos = document.getElementById("cantidadArticulos");
        let pSubtotal = document.getElementById("pSubtotal");
        let h6Total = document.getElementById("h6Total");

        data.forEach(detalleCarrito => {
            let cartaProducto = crearCartaProducto(detalleCarrito.producto, detalleCarrito.cantidad);
            contenedorCartas.appendChild(cartaProducto);
            totalArticulos = totalArticulos + detalleCarrito.cantidad;
            total = total + (detalleCarrito.producto.precio * detalleCarrito.cantidad);
        });
        subtotal = total - (total * PORCENTAJE_IVA);

        pCantidadArticulos.textContent = `Artículos: ${totalArticulos}`;
        pSubtotal.textContent = `Subtotal: $${subtotal.toFixed(0)}`;
        h6Total.textContent = `Total: $${total.toFixed(0)}`;


    }).catch((error) => {
        console.error("Error al cargar:", error);
    });
}

function registrarVenta(csrftoken, datosVenta) {
    fetch("/api/ventas/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(datosVenta),
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error en la respuesta de la API");
        }
    }).then((data) => {
        console.log("Venta registrada con éxito:", data);

        window.location.href = `/confirmacionOrden/${data.id}/`;

    }).catch((error) => {
        console.error("Error al registrar la venta:", error);
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

    actualizarCheckout();

    let formularioCheckout = document.getElementById("formularioCheckout");

    formularioCheckout.addEventListener("submit", function (event) {
        event.preventDefault();

        let datosVenta = {
            nombre: document.getElementById("nombreInput").value,
            apellido: document.getElementById("apellidoInput").value,
            region: document.getElementById("regionInput").value,
            comuna: document.getElementById("comunaInput").value,
            direccion: document.getElementById("direccionInput").value,
            telefono: document.getElementById("telefonoInput").value,
        };

        registrarVenta(csrftoken, datosVenta);
    });


});