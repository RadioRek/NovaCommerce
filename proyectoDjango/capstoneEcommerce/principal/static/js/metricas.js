function crearCartaProductoBajoStock(productoNombre, stock) {
    let template = document.createElement("template");
    template.innerHTML = `
    <div class="card cartaProductoBajoStock flex-grow-1 text-center">
        <p class="parrafo m-0">${productoNombre}</p>
        <p class="parrafoPequeño m-0">El producto tiene ${stock} en stock</p>
    </div>
    `.trim();

    return template.content.firstElementChild;
};

// ===========================================================================
// Función para poblar la tabla historial de ventas
function poblarTablaVentas() {
    let tablaHistorialVentasBody = document.getElementById("tablaHistorialVentasBody");
    let url = "/api/ventas/";

    fetch(url, {
        method: "GET",
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.error("Error en la respuesta del servidor:", response.status);
            // lanzar un error para que se capture en el catch
            throw new Error("Error en la respuesta del servidor");
        }
    }).then((data) => {
        // vaciar tabla antes de llenar
        tablaHistorialVentasBody.innerHTML = "";

        if (data.length === 0) {
            crearElementoToast("Sin resultados", "No se encontraron ventas pendientes", "info");
        } else {
            crearElementoToast("Exito", `Se encontraron ${data.length} ventas pendientes`, "success");
        }

        data.forEach((venta) => {
            let row = document.createElement("tr");
            let tdCodigo = document.createElement("td");
            let tdFechaHora = document.createElement("td");
            let tdUsuario = document.createElement("td");
            let tdEstado = document.createElement("td");
            let tdTotal = document.createElement("td");

            tdCodigo.className = "textoMinimo";
            tdFechaHora.className = "textoMinimo";
            tdUsuario.className = "textoMinimo";
            tdEstado.className = "textoMinimo";
            tdTotal.className = "textoMinimo";

            tdCodigo.textContent = venta.id;
            tdFechaHora.textContent = new Date(venta.fechaHora).toLocaleString();
            tdUsuario.textContent = venta.usuario.nombre + " " + venta.usuario.apellido;
            tdEstado.textContent = venta.estadoVenta;
            tdTotal.textContent = `$${venta.totalVenta.toFixed(2)}`;

            row.appendChild(tdCodigo);
            row.appendChild(tdFechaHora);
            row.appendChild(tdUsuario);
            row.appendChild(tdEstado);
            row.appendChild(tdTotal);

            tablaHistorialVentasBody.appendChild(row);
        });

    }).catch((error) => {
        crearElementoToast("Error", "Error al buscar ventas pendientes", "error");
        console.error("Error en la solicitud:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const rootStyles = getComputedStyle(document.documentElement);

    // escalas para charts.js
    const colorMarca1_1 = rootStyles.getPropertyValue("--colorMarca1-1").trim();
    const colorMarca1_2 = rootStyles.getPropertyValue("--colorMarca1-2").trim();
    const colorMarca1_3 = rootStyles.getPropertyValue("--colorMarca1-3").trim();
    const colorMarca1_4 = rootStyles.getPropertyValue("--colorMarca1-4").trim();
    const colorMarca1_5 = rootStyles.getPropertyValue("--colorMarca1-5").trim();

    const colorMarca2_1 = rootStyles.getPropertyValue("--colorMarca2-1").trim();
    const colorMarca2_2 = rootStyles.getPropertyValue("--colorMarca2-2").trim();
    const colorMarca2_3 = rootStyles.getPropertyValue("--colorMarca2-3").trim();
    const colorMarca2_4 = rootStyles.getPropertyValue("--colorMarca2-4").trim();
    const colorMarca2_5 = rootStyles.getPropertyValue("--colorMarca2-5").trim();


    const negro = rootStyles.getPropertyValue("--negro").trim();

    let setColor1 = [colorMarca1_1, colorMarca1_2, colorMarca1_3, colorMarca1_4, colorMarca1_5];
    let setColor2 = [colorMarca2_1, colorMarca2_2, colorMarca2_3, colorMarca2_4, colorMarca2_5];

    let totalVentasMes = 0;
    let totalVentasDia = 0;
    let cantidadVentasMes = 0;
    let cantidadVentasDia = 0;

    poblarTablaVentas();

    const chartAreaBorder = {
        id: 'chartAreaBorder',
        beforeDraw(chart, args, options) {
            const { ctx, chartArea: { left, top, width, height } } = chart;
            ctx.save();
            ctx.strokeStyle = options.borderColor;
            ctx.lineWidth = options.borderWidth;
            ctx.setLineDash(options.borderDash || []);
            ctx.lineDashOffset = options.borderDashOffset;
            ctx.strokeRect(left, top, width, height);
            ctx.restore();
        }
    };

    // Esperar que las fuentes se carguen antes de construir los graficos
    document.fonts.ready.then(() => {
        fetch("/api/ventas/metricas/").then(r => r.json()).then(data => {

            let contenedorProdBajoStock = document.querySelector(".contenedorProdBajoStock");

            data.productos_bajo_stock.forEach(prod => {
                const cartaProducto = crearCartaProductoBajoStock(prod.nombre, prod.stock);
                contenedorProdBajoStock.appendChild(cartaProducto);
            });

            // Grafico de productos mas vendidos
            let graficoProductosMasVendidos = document.getElementById("prodMasVendidos").getContext("2d");
            const productosChartInstance = new Chart(graficoProductosMasVendidos, {
                type: "bar",
                data: {
                    labels: data.top_productos.map(p => p.producto__nombre),
                    datasets: [{
                        data: data.top_productos.map(p => p.total_vendido),
                        backgroundColor: setColor1,
                        borderColor: negro,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,

                    plugins: {
                        title: {
                            display: true,
                            text: "Top 10 productos mas vendidos",
                            font: {
                                size: 22,
                                family: `serif`
                            },
                            color: negro
                        },
                        legend: {
                            display: false,
                        },
                        chartAreaBorder: {
                            borderWidth: 1,
                            borderDash: [5, 5],
                            borderDashOffset: 1,
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro
                            }
                        }
                    }
                },
                plugins: [chartAreaBorder]

            });

            //grafico productos menos vendidos
            let graficoProductosMenosVendidos = document.getElementById("prodMenosVendidos").getContext("2d");
            const productosMenosChartInstance = new Chart(graficoProductosMenosVendidos, {
                type: "bar",
                data: {
                    labels: data.flop_productos.map(p => p.producto__nombre),
                    datasets: [{
                        data: data.flop_productos.map(p => p.total_vendido),
                        backgroundColor: setColor2,
                        borderColor: negro,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,

                    plugins: {
                        title: {
                            display: true,
                            text: "Top 10 productos menos vendidos",
                            font: {
                                size: 22,
                                family: `serif`
                            },
                            color: negro
                        },
                        legend: {
                            display: false,
                        },
                        chartAreaBorder: {
                            borderWidth: 1,
                            borderDash: [5, 5],
                            borderDashOffset: 1,
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro
                            }
                        }
                    }
                },
                plugins: [chartAreaBorder]

            });

            // Grafico de categorias mas vendidas
            let graficoCategorias = document.getElementById("catMasVendidas").getContext("2d");
            const categoriasChartInstance = new Chart(graficoCategorias, {
                type: "pie",
                data: {
                    labels: data.top_categorias.map(c => c.producto__categoriaPrincipal__nombre),
                    datasets: [{
                        data: data.top_categorias.map(c => c.total_vendido),
                        backgroundColor: setColor1,
                        borderColor: negro,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Ventas por categoria",
                            font: {
                                size: 22,
                                family: `serif`
                            },
                            color: negro
                        },
                        legend: {
                            labels: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro
                            }
                        },

                    }
                },
            });

            // grafico categorias menos vendidas
            let graficoCategoriasMenosVendidas = document.getElementById("catMenosVendidas").getContext("2d");
            const categoriasMenosChartInstance = new Chart(graficoCategoriasMenosVendidas, {
                type: "pie",
                data: {
                    labels: data.flop_categorias.map(c => c.producto__categoriaPrincipal__nombre),
                    datasets: [{
                        data: data.flop_categorias.map(c => c.total_vendido),
                        backgroundColor: setColor2,
                        borderColor: negro,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Categorias menos vendidas",
                            font: {
                                size: 22,
                                family: `serif`
                            },
                            color: negro
                        },
                        legend: {
                            labels: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro
                            }
                        },

                    }
                },
            });

            // Ajustar el tamaño de los gráficos al cambiar el tamaño de la ventana

            window.addEventListener('resize', () => {
                productosChartInstance.resize();
                categoriasChartInstance.resize();
                productosMenosChartInstance.resize();
                categoriasMenosChartInstance.resize();
            });

            window.addEventListener('orientationchange', () => {
                productosChartInstance.resize();
                categoriasChartInstance.resize();
                productosMenosChartInstance.resize();
                categoriasMenosChartInstance.resize();
            });

            window.addEventListener('fullscreenchange', () => {
                productosChartInstance.resize();
                categoriasChartInstance.resize();
                productosMenosChartInstance.resize();
                categoriasMenosChartInstance.resize();
            });

            window.addEventListener('visibilitychange', () => {
                productosChartInstance.resize();
                categoriasChartInstance.resize();
                productosMenosChartInstance.resize();
                categoriasMenosChartInstance.resize();
            });

            window.addEventListener('pageshow', () => {
                productosChartInstance.resize();
                categoriasChartInstance.resize();
                productosMenosChartInstance.resize();
                categoriasMenosChartInstance.resize();
            });

            totalVentasMes = data.total_ventas_mes;
            totalVentasDia = data.total_ventas_dia;
            cantidadVentasMes = data.cantidad_ventas_mes;
            cantidadVentasDia = data.cantidad_ventas_dia;

            let totalMesP = document.getElementById("totalMes");
            let totalDiaP = document.getElementById("totalDia");
            let cantidadMesP = document.getElementById("cantidadMes");
            let cantidadDiaP = document.getElementById("cantidadDia");

            totalMesP.textContent = `$${totalVentasMes.toFixed(0)}`;
            totalDiaP.textContent = `$${totalVentasDia.toFixed(0)}`;
            cantidadMesP.textContent = `${cantidadVentasMes}`;
            cantidadDiaP.textContent = `${cantidadVentasDia}`;

        });
    }).catch(err => {
        console.error("Error loading fonts:", err);
    });
});
