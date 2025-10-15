document.addEventListener("DOMContentLoaded", function () {
	let crearProductoButton = document.getElementById("crearProductoButton");
    
	crearProductoButton.addEventListener("click", function (event) {
		event.preventDefault();


		let inputNombre = document.getElementById("nombreInput").value;
		let inputPrecio = document.getElementById("precioInput").value;

		let inputImagen = document.getElementById("imgInput").files[0];
		let inputDescripcion = document.getElementById("descripcionInput").value;
		let inputStock = document.getElementById("stockInput").value;

		let formData = new FormData();
		formData.append("nombre", inputNombre);
		formData.append("precio", inputPrecio);
		formData.append("descripcion", inputDescripcion);
		formData.append("stock", inputStock);

		if (inputImagen) {
			formData.append("img", inputImagen);
		}
        
		fetch("http://127.0.0.1:8000/api/productos/", {
			method: "POST",
			body: formData,
		}).then((response) => {
            if (response.ok) {
                let botonLimpiarFormularioProd = document.getElementById("botonLimpiarFormularioProd");
                botonLimpiarFormularioProd.click();

                let tituloxd = document.getElementById("tituloxd");
                tituloxd.textContent = "WOOOOOW creaste un producto";
            }
            if (response.status === 400) { 
                console.log("Error Pedazo de troll");
                
            }
		}).catch((error) => {
				console.error("Error en la solicitud:", error);
	    });

 

	});


});

