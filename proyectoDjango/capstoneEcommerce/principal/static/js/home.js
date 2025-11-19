function poblarCategoriasDestacadas() {
    let contenedorCategoriasDestacadas = document.getElementById('catContainer');

    fetch('/api/categorias/categorias-destacadas/', {
        method: 'GET',
    }).then(async (response) => {
        let data = await response.json();

        contenedorCategoriasDestacadas.innerHTML = '';
        
        data.forEach(categoria => {
            let columnaCategoria = document.createElement('div');
            columnaCategoria.classList.add('flex-grow-1');
            columnaCategoria.style.flexBasis = '200px';

            let enlaceCategoria = document.createElement('a');
            enlaceCategoria.classList.add('text-decoration-none');
            // solo enviar a la tienda sin filtro por ahora
            enlaceCategoria.href = `/tienda/`;


            let tarjetaCategoria = document.createElement('div');
            tarjetaCategoria.classList.add('card', 'p-4', 'text-center', 'cat-card');

            let nombreCategoria = document.createElement('h5');
            nombreCategoria.classList.add('p-0', 'm-0', 'head5');
            nombreCategoria.textContent = categoria.nombre;

            tarjetaCategoria.appendChild(nombreCategoria);
            enlaceCategoria.appendChild(tarjetaCategoria);
            columnaCategoria.appendChild(enlaceCategoria);
            contenedorCategoriasDestacadas.appendChild(columnaCategoria);
        });

    }).catch((error) => {
        console.error('Error al obtener las categorías destacadas.');
    });
}


function poblarProductosDestacados() {
    let contenedorProductosDestacados = document.getElementById('contenedorProductosDestacados');

    function crearCartaProducto(producto) {
        let template = document.createElement("template");
        template.innerHTML = `
        <div class="flex-prod flex-grow-1">
            <div class="cartita card">
                <img src="${producto.img}" class="cartitaImg" alt="${producto.nombre}">
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

    fetch('/api/productos/productos-destacados/', {
        method: 'GET',
    }).then(async (response) => {

        let data = await response.json();

        data.forEach(producto => {
            let cartaProducto = crearCartaProducto(producto);
            contenedorProductosDestacados.appendChild(cartaProducto);

        });

    }).catch((error) => {
        console.error('Error al obtener los productos destacados.');
    });
}


document.addEventListener('DOMContentLoaded', function () {

        poblarCategoriasDestacadas();
        poblarProductosDestacados();

    });