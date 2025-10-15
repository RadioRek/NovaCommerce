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
    const csrftoken = getCookie("csrftoken")


    // Manejar envío del formulario de categoria
    let formularioCategoria = document.getElementById("formularioCategoria");
    formularioCategoria.addEventListener("submit", function (event) {

        event.preventDefault();
        let alertaToast = document.getElementById("alertaToast");
        let alertaHeader = document.getElementById("alertaHeader");
        let alertaBody = document.getElementById("alertaBody");
        let alertaSpinner = document.getElementById("alertaSpinner");
        alertaHeader.textContent = "Procesando solicitud...";
        alertaBody.textContent = "Creando categoria, por favor espere";
        let toast = new bootstrap.Toast(alertaToast, { autohide: false });
        toast.show();

        let inputNombre = document.getElementById("nombreCategoriaInput").value;
        let formData = new FormData();
        formData.append("nombre", inputNombre);


        fetch("http://127.0.0.1:8000/api/categorias/", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": csrftoken,
            },
        }).then(async (response) => {
            if (response.ok) {
                alertaHeader.classList.remove("colorRojo3");
                alertaBody.classList.remove("colorRojo2");

                
                formularioCategoria.reset();
                alertaSpinner.classList.add("d-none");
                alertaHeader.textContent = "Exito";
                alertaBody.textContent = "Categoria creada con exito";
            }
            if (!response.ok) {
                alertaHeader.classList.add("colorRojo3");
                alertaBody.classList.add("colorRojo2");

                let data = await response.json().catch(() => ({}));
                alertaSpinner.classList.add("d-none");
                alertaHeader.textContent = "Error";
                if (data.nombre) {
                    alertaBody.textContent = data.nombre;
                }
                formularioCategoria.reset();
            }
        }).catch((error) => {
            console.error("Error en la solicitud:", error);
        });
    });

});

/*

*/



