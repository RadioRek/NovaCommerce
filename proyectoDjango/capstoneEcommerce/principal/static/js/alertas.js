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

    let elementoAlerta = template.content.firstElementChild;

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
            <strong class="parrafo me-auto">${textoHeader}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="parrafoPequeño toast-body">
            ${textoBody}
        </div>
    </div>
    `.trim();


    // seleccionamos el header
    let header = template.content.querySelector(".parrafo");
    // seleccionamos el body
    let body = template.content.querySelector(".toast-body");
    // seleccionamos el toast completo
    let toast = template.content.querySelector(".toast");
    // seleccionamos el spinner
    let spinner = template.content.querySelector("#alertaSpinner");
    spinner.classList.add("d-none");



    if (tipoToast === "loading") {
        spinner.classList.remove("d-none");
    } else if (tipoToast === "error") {
        header.classList.add("textoColorDanger");
        body.classList.add("textoColorDanger");
        toast.classList.add("bordeError");
    } else if (tipoToast === "success") {
        header.classList.add("textoColorSuccess");
        body.classList.add("textoColorSuccess");
        toast.classList.add("bordeSuccess");
    } else if (tipoToast === "info") {
        header.classList.add("textoColorInfo");
        body.classList.add("textoColorInfo");
        toast.classList.add("bordeInfo");
    }

    let elementoToast = template.content.firstElementChild;

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





