document.addEventListener("DOMContentLoaded", () => {


});

async function crearElementoModal(textoHeader, textoBody, funcionParaContinuar, tipoModal) {
    let template = document.createElement("template");
    template.innerHTML = `
    <div class="alertaModal">
        <div class="superModal">
            <div class="modalHeader d-flex justify-content-center">
                <h6 class="head6 m-0 p-0">${textoHeader}</h6>
            </div>
            <div class="modalBody d-flex justify-content-center">
                <p class="parrafoPequeño m-0 p-0 text-center">${textoBody}</p>
            </div>
            <div class="modalFooter d-flex justify-content-between">
                <button class="btnCerrarModal botonGenerico">Cerrar</button>
                <button class="btnContinuar botonDanger">Continuar</button>
            </div>
        </div>
    </div>
    `.trim();

    const elementoAlerta = template.content.firstElementChild;

    // Agregar funcionalidad a los botones
    const btnCerrar = elementoAlerta.querySelector(".btnCerrarModal");
    const btnContinuar = elementoAlerta.querySelector(".btnContinuar");

    btnCerrar.addEventListener("click", () => {
        document.body.removeChild(elementoAlerta);
    });

    btnContinuar.addEventListener("click", () => {
        if (typeof funcionParaContinuar === "function") {
            funcionParaContinuar();
        }
        document.body.removeChild(elementoAlerta);
    });

    document.body.appendChild(elementoAlerta);
}

async function crearElementoToast(textoHeader, textoBody, tipoToast) {
    // tipos 'error' 'success' 'info' 'loading' 'danger'
    let template = document.createElement("template");

    template.innerHTML = `
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <div class="spinner-border spinner-border-sm me-2" role="status" id="alertaSpinner">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <strong class="me-auto">${textoHeader}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${textoBody}
        </div>
    </div>
    `.trim();

    if (tipoToast === "loading") {
        template.content.querySelector("#alertaSpinner").classList.remove("d-none");
    } else {
        template.content.querySelector("#alertaSpinner").classList.add("d-none");
    }

    const elementoToast = template.content.firstElementChild;

    const toastBootstrap = new bootstrap.Toast(elementoToast, {
        autohide: true,
        delay: 5000,
    });

    document.querySelector(".toast-container").appendChild(elementoToast);
    toastBootstrap.show();
}

async function eliminarUltimoToast() {
    const toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) return;

    const ultimoToast = toastContainer.lastElementChild;
    if (!ultimoToast) return;

    const toastInstance = bootstrap.Toast.getInstance(ultimoToast);
    if (toastInstance) toastInstance.hide();

    toastContainer.removeChild(ultimoToast);
}

