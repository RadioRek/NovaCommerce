function actualizarBadgeCarrito() {
	let carritoIcon = document.getElementById('carritoIcon');

	// crear elemento badge
	let badge = document.createElement('span');
	badge.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
	badge.id = 'carritoBadge';
	carritoIcon.appendChild(badge);

	fetch(`/api/detalle-carritos/`, {
		method: "GET",
	}).then(async (response) => {
		if (response.ok) {
			let data = await response.json();
			let cantidadItems = data.length;
			if (cantidadItems > 0) {
				badge.textContent = cantidadItems;
			} else {
				badge.style.display = 'none';
			}
		} else {
			let cantidadItems = 0;
			badge.style.display = 'none';
		}
	}).catch((error) => {
		console.error("Error:", error);
	});
}

document.addEventListener('DOMContentLoaded', function() {

	actualizarBadgeCarrito();
});