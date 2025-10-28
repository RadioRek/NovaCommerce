document.addEventListener("DOMContentLoaded", function () {
    const rootStyles = getComputedStyle(document.documentElement);
    const cafeMain = rootStyles.getPropertyValue("--cafeMain").trim();
    const cafeCrema = rootStyles.getPropertyValue("--cafeCrema").trim();
    const negro75 = rootStyles.getPropertyValue("--negro75").trim();

    let totalVentasMes = 0;
    let totalVentasDia = 0;
    let cantidadVentasMes = 0;
    let cantidadVentasDia = 0;

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

            let graficoProductos = document.getElementById("productosChart").getContext("2d");
            const productosChartInstance = new Chart(graficoProductos, {
                type: "bar",
                data: {
                    labels: data.top_productos.map(p => p.producto__nombre),
                    datasets: [{
                        data: data.top_productos.map(p => p.total_vendido),
                        backgroundColor: [cafeMain, cafeCrema],
                        borderColor: negro75,
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
                            color: negro75
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
                                color: negro75
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro75
                            }
                        }
                    }
                },
                plugins: [chartAreaBorder]

            });

            let graficoUsuarios = document.getElementById("usuariosChart").getContext("2d");
            const usuariosChartInstance = new Chart(graficoUsuarios, {
                type: "bar",
                data: {
                    labels: data.top_usuarios.map(p => p.usuario__username),
                    datasets: [{
                        data: data.top_usuarios.map(p => p.total_compras),
                        backgroundColor: [cafeMain, cafeCrema],
                        borderColor: negro75,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,

                    plugins: {
                        title: {
                            display: true,
                            text: "Top 10 usuarios con mas compras",
                            font: {
                                size: 22,
                                family: `serif`
                            },
                            color: negro75
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
                                color: negro75
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro75
                            }
                        }
                    }
                },
                plugins: [chartAreaBorder]
            });

            let graficoCategorias = document.getElementById("categoriasChart").getContext("2d");
            const categoriasChartInstance = new Chart(graficoCategorias, {
                type: "pie",
                data: {
                    labels: data.top_categorias.map(c => c.producto__categoriaPrincipal__nombre),
                    datasets: [{
                        data: data.top_categorias.map(c => c.total_vendido),
                        backgroundColor: [cafeMain, cafeCrema],
                        borderColor: negro75,
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
                            color: negro75
                        },
                        legend: {
                            labels: {
                                font: {
                                    size: 13,
                                    family: `serif`
                                },
                                color: negro75
                            }
                        },

                    }
                },
            });

            window.addEventListener('resize', () => {
                productosChartInstance.resize();
                usuariosChartInstance.resize();
                categoriasChartInstance.resize();
            });

            window.addEventListener('orientationchange', () => {
                productosChartInstance.resize();
                usuariosChartInstance.resize();
                categoriasChartInstance.resize();
            });

            window.addEventListener('fullscreenchange', () => {
                productosChartInstance.resize();
                usuariosChartInstance.resize();
                categoriasChartInstance.resize();
            });

            window.addEventListener('visibilitychange', () => {
                productosChartInstance.resize();
                usuariosChartInstance.resize();
                categoriasChartInstance.resize();
            });

            window.addEventListener('pageshow', () => {
                productosChartInstance.resize();
                usuariosChartInstance.resize();
                categoriasChartInstance.resize();
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
