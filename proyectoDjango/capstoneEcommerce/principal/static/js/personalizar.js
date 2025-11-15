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



document.addEventListener('DOMContentLoaded', function () {

    // seleccionar todos los contenedores de input de color
    const containers = document.querySelectorAll('.input-container-color');
    let cookieToken = getCookie('csrftoken');


    // para cada contenedor aplicar los escuchadores de eventos a los inputs
    containers.forEach(container => {

        // obtener referencias a los elementos relevantes
        const colorInput = container.querySelector('.input-color-real');
        const colorDisplay = container.querySelector('.color-display');
        const textInput = container.querySelector('input[type="text"]');

        // inicializar valores
        const valorInicialColor = colorInput.value;
        colorDisplay.style.backgroundColor = valorInicialColor;
        textInput.value = valorInicialColor;

        // cambia el texto y el color del wrapper al cambiar el input de color
        colorInput.addEventListener('input', () => {
            const valorColor = colorInput.value;
            colorDisplay.style.backgroundColor = valorColor;
            textInput.value = valorColor;
        });

        // cambia el input de color y el display al cambiar el texto
        textInput.addEventListener('input', () => {
            const valorTexto = textInput.value.trim();
            if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(valorTexto)) {
                colorInput.value = valorTexto;
                colorDisplay.style.backgroundColor = valorTexto;
            } else {
                crearElementoToast('Error', 'Formato de color inválido. Use #RRGGBB o #RGB.', 'error');
            }
        });
    });

    const updateName = (inputId, nameId) => {
        const input = document.getElementById(inputId);
        const nameSpan = document.getElementById(nameId);

        input.addEventListener('change', () => {
            nameSpan.textContent = input.files.length > 0 ? input.files[0].name : "Ningún archivo";
        });
    };

    updateName("fuentePrincipalArchivo", "fuentePrincipalArchivoName");
    updateName("fuenteSecundariaArchivo", "fuenteSecundariaArchivoName");


    function cargarEstilosPersonalizados() {
        fetch('/api/personalizacion-tienda/1', {
            method: 'GET',
        }).then((response) => {
            if (!response.ok) {
                crearElementoToast('Error', 'No se pudieron cargar los estilos personalizados.', 'error');
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();

        }).then(data => {
            const estilos = data;

            let colorMarca1 = estilos.colorMarca1;
            let colorMarca2 = estilos.colorMarca2;
            let colorDanger = estilos.colorDanger;
            let colorSuccess = estilos.colorSuccess;
            let negro = estilos.negro;
            let negroSuave = estilos.negroSuave;
            let gris = estilos.gris;
            let blanco = estilos.blanco;
            let masBlanco = estilos.masBlanco;

            // cambiamos los colores y textos
            document.getElementById('colorMarca1').value = colorMarca1;
            document.getElementById('colorMarca1Text').value = colorMarca1;
            document.querySelector('#colorMarca1 + .color-display, #colorMarca1').parentNode.querySelector('.color-display').style.backgroundColor = colorMarca1;

            document.getElementById('colorMarca2').value = colorMarca2;
            document.getElementById('colorMarca2Text').value = colorMarca2;
            document.querySelector('#colorMarca2 + .color-display, #colorMarca2').parentNode.querySelector('.color-display').style.backgroundColor = colorMarca2;

            document.getElementById('colorDanger').value = colorDanger;
            document.getElementById('colorDangerText').value = colorDanger;
            document.querySelector('#colorDanger').parentNode.querySelector('.color-display').style.backgroundColor = colorDanger;

            document.getElementById('colorSuccess').value = colorSuccess;
            document.getElementById('colorSuccessText').value = colorSuccess;
            document.querySelector('#colorSuccess').parentNode.querySelector('.color-display').style.backgroundColor = colorSuccess;

            document.getElementById('colorNegro').value = negro;
            document.getElementById('colorNegroText').value = negro;
            document.querySelector('#colorNegro').parentNode.querySelector('.color-display').style.backgroundColor = negro;

            document.getElementById('colorNegroSuave').value = negroSuave;
            document.getElementById('colorNegroSuaveText').value = negroSuave;
            document.querySelector('#colorNegroSuave').parentNode.querySelector('.color-display').style.backgroundColor = negroSuave;

            document.getElementById('colorGris').value = gris;
            document.getElementById('colorGrisText').value = gris;
            document.querySelector('#colorGris').parentNode.querySelector('.color-display').style.backgroundColor = gris;

            document.getElementById('colorBlanco').value = blanco;
            document.getElementById('colorBlancoText').value = blanco;
            document.querySelector('#colorBlanco').parentNode.querySelector('.color-display').style.backgroundColor = blanco;

            document.getElementById('colorMasBlanco').value = masBlanco;
            document.getElementById('colorMasBlancoText').value = masBlanco;
            document.querySelector('#colorMasBlanco').parentNode.querySelector('.color-display').style.backgroundColor = masBlanco;
        }).catch(error => {
            console.error('Error al cargar los estilos personalizados:', error);
        });
    }

    cargarEstilosPersonalizados();


    let formularioPer = document.getElementById('formPersonalizacion');

    formularioPer.addEventListener('submit', function (event) {
        event.preventDefault();

        let colorMarca1 = document.getElementById('colorMarca1').value;
        let colorMarca2 = document.getElementById('colorMarca2').value;
        let colorDanger = document.getElementById('colorDanger').value;
        let colorSuccess = document.getElementById('colorSuccess').value;
        let colorNegro = document.getElementById('colorNegro').value;
        let colorNegroSuave = document.getElementById('colorNegroSuave').value;
        let colorGris = document.getElementById('colorGris').value;
        let colorBlanco = document.getElementById('colorBlanco').value;
        let colorMasBlanco = document.getElementById('colorMasBlanco').value;

        let fuentePrincipal = document.getElementById("fuentePrincipalArchivo").files[0];
        let fuenteSecundaria = document.getElementById("fuenteSecundariaArchivo").files[0];

        let formData = new FormData();
        formData.append('colorMarca1', colorMarca1);
        formData.append('colorMarca2', colorMarca2);
        formData.append('colorDanger', colorDanger);
        formData.append('colorSuccess', colorSuccess);
        formData.append('negro', colorNegro);
        formData.append('negroSuave', colorNegroSuave);
        formData.append('gris', colorGris);
        formData.append('blanco', colorBlanco);
        formData.append('masBlanco', colorMasBlanco);

        if (fuentePrincipal) {
            formData.append("fuentePrincipalArchivo", fuentePrincipal);
        }
        if (fuenteSecundaria) {
            formData.append("fuenteSecundariaArchivo", fuenteSecundaria);
        }

        // comprobar si existen los estilos
        let banderaEstilos = 'POST'
        fetch('/api/personalizacion-tienda/1/', {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                banderaEstilos = 'PATCH';
            } else {
                banderaEstilos = 'POST';
            }
        }).then(() => {

            let url = ""
            if (banderaEstilos === 'POST') {
                url = '/api/personalizacion-tienda/';
            }
            if (banderaEstilos === 'PATCH') {
                url = '/api/personalizacion-tienda/1/';
            }

            fetch(url, {
                method: banderaEstilos,
                body: formData,
                headers: {
                    'X-CSRFToken': cookieToken
                }
            }).then((response) => {
                if (response.ok) {
                    let data = response.json();

                } else {
                    console.log(response)
                }

            }).then((data) => {
                crearElementoToast("Exito", "Los estilos personalizados se han guardado correctamente.", "success");
                // recargar sitio
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            }).catch(error => {
                console.error('Error al enviar los estilos personalizados:', error);
            });

        }).catch(error => {
            console.error('Error al comprobar los estilos personalizados:', error);
        });
    });


    let botonReset = document.getElementById('botonResetEstilos');
    botonReset.addEventListener('click', function () {
        fetch('/api/personalizacion-tienda/reset/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': cookieToken
            }
        }).then((response) => {
            if (response.ok) {
                crearElementoToast("Exito", "Los estilos personalizados se han restablecido correctamente.", "success");
                // recargar sitio
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                crearElementoToast('Error', 'No se pudieron restablecer los estilos personalizados.', 'error');
            }
        }).catch(error => {
            console.error('Error al restablecer los estilos personalizados:', error);
        });
    });

});
