"use strict";

/*
 * Semana 5 - Desarrollo Frontend I
 * Actividad: Manipulación del DOM con JavaScript
 * El archivo implementa createElement, appendChild, eventos click/mouseover/submit
 * y Fetch API con manejo de errores.
 */

/**
 * Inicia todas las funcionalidades JavaScript una vez que el DOM está disponible.
 * Esto evita buscar elementos HTML antes de que el navegador los haya creado.
 */
function iniciarAplicacion() {
    configurarEventosDetalle();
    configurarEventosMouseover();
    configurarFormulario();
    configurarRecargaDeDatos();
    cargarRecomendaciones();
}

/**
 * Registra el evento click en cada botón "Ver detalles" de las tarjetas.
 * El detalle se crea y elimina dinámicamente utilizando métodos del DOM.
 */
function configurarEventosDetalle() {
    const botonesDetalle = document.querySelectorAll(".btn-detalle");

    botonesDetalle.forEach((boton) => {
        boton.addEventListener("click", function () {
            alternarDetalleProducto(this);
        });
    });
}

/**
 * Muestra u oculta un bloque de información dentro de la tarjeta seleccionada.
 * Utiliza createElement y appendChild para cumplir con la manipulación dinámica del DOM.
 * @param {HTMLButtonElement} boton Botón que originó el evento click.
 */
function alternarDetalleProducto(boton) {
    const cuerpoTarjeta = boton.closest(".card-body");
    const detalleExistente = cuerpoTarjeta.querySelector(".detalle-dinamico");

    if (detalleExistente) {
        detalleExistente.remove();
        boton.textContent = "Ver detalles";
        return;
    }

    const detalle = document.createElement("div");
    detalle.classList.add("detalle-dinamico");
    detalle.textContent = boton.dataset.detalle;

    cuerpoTarjeta.appendChild(detalle);
    boton.textContent = "Ocultar detalles";
}

/**
 * Agrega eventos mouseover y mouseout a las tarjetas de producto.
 * Al pasar el cursor, JavaScript cambia el estilo y actualiza un mensaje en pantalla.
 */
function configurarEventosMouseover() {
    const tarjetas = document.querySelectorAll(".producto-card");
    const mensajeHover = document.getElementById("mensajeHover");

    tarjetas.forEach((tarjeta) => {
        tarjeta.addEventListener("mouseover", function () {
            this.classList.add("destacada");
            mensajeHover.textContent = `Estás viendo: ${this.dataset.producto}`;
        });

        tarjeta.addEventListener("mouseout", function () {
            this.classList.remove("destacada");
            mensajeHover.textContent = "Pasa el mouse sobre una consola para destacarla.";
        });
    });
}

/**
 * Registra el evento click del botón de recarga.
 * Permite ejecutar nuevamente la función Fetch sin repetir código.
 */
function configurarRecargaDeDatos() {
    const botonRecargar = document.getElementById("btnRecargar");

    botonRecargar.addEventListener("click", cargarRecomendaciones);
}

/**
 * Obtiene las recomendaciones desde un archivo JSON mediante Fetch API.
 * Se verifica la respuesta HTTP, se procesan las promesas y se manejan errores con catch.
 */
function cargarRecomendaciones() {
    const contenedor = document.getElementById("contenedorRecomendaciones");
    const estadoCarga = document.getElementById("estadoCarga");

    contenedor.replaceChildren();
    actualizarEstadoCarga("Cargando recomendaciones...", "info");

    fetch("data/recomendaciones.json")
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then((datos) => {
            datos.forEach((producto) => {
                const tarjeta = crearTarjetaRecomendacion(producto);
                contenedor.appendChild(tarjeta);
            });

            estadoCarga.classList.add("d-none");
        })
        .catch((error) => {
            console.error("No fue posible cargar las recomendaciones:", error);
            actualizarEstadoCarga(
                "No fue posible cargar las recomendaciones. Intenta nuevamente.",
                "danger"
            );
        });
}

/**
 * Crea una tarjeta completa a partir de un objeto recibido desde el JSON.
 * Cada elemento se construye con createElement para demostrar manipulación del DOM.
 * @param {Object} producto Datos de la recomendación a mostrar.
 * @returns {HTMLDivElement} Columna Bootstrap que contiene la tarjeta creada.
 */
function crearTarjetaRecomendacion(producto) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6 col-lg-4";

    const tarjeta = document.createElement("article");
    tarjeta.className = "card tarjeta-recomendacion shadow-sm";

    const imagen = document.createElement("img");
    imagen.className = "card-img-top";
    imagen.src = producto.imagen;
    imagen.alt = producto.alt;

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const titulo = document.createElement("h3");
    titulo.className = "card-title h5";
    titulo.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = producto.descripcion;

    const categoria = document.createElement("span");
    categoria.className = "badge text-bg-dark align-self-start mt-auto";
    categoria.textContent = producto.categoria;

    cuerpo.appendChild(titulo);
    cuerpo.appendChild(descripcion);
    cuerpo.appendChild(categoria);

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
}

/**
 * Actualiza el mensaje utilizado para informar el estado de la carga Fetch.
 * Se reutiliza tanto al iniciar la carga como al mostrar un error.
 * @param {string} mensaje Texto que verá el usuario.
 * @param {string} tipo Tipo de alerta Bootstrap (info, danger, etc.).
 */
function actualizarEstadoCarga(mensaje, tipo) {
    const estadoCarga = document.getElementById("estadoCarga");

    estadoCarga.textContent = mensaje;
    estadoCarga.className = `alert alert-${tipo}`;
}

/**
 * Registra el evento submit del formulario de contacto.
 * La validación se realiza con JavaScript y evita enviar datos incompletos.
 */
function configurarFormulario() {
    const formulario = document.getElementById("formContacto");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        procesarFormulario(this);
    });
}

/**
 * Valida los campos del formulario y muestra un mensaje dinámico de resultado.
 * @param {HTMLFormElement} formulario Formulario que se está procesando.
 */
function procesarFormulario(formulario) {
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const consulta = document.getElementById("consulta");

    const nombreValido = nombre.value.trim().length >= 2;
    const correoValido = validarCorreo(correo.value.trim());
    const consultaValida = consulta.value.trim().length >= 10;

    actualizarValidacionCampo(nombre, nombreValido);
    actualizarValidacionCampo(correo, correoValido);
    actualizarValidacionCampo(consulta, consultaValida);

    if (!nombreValido || !correoValido || !consultaValida) {
        mostrarRespuestaFormulario("Revisa los campos marcados antes de enviar.", "danger");
        return;
    }

    const nombreUsuario = nombre.value.trim();
    mostrarRespuestaFormulario(
        `Gracias, ${nombreUsuario}. Tu consulta fue registrada correctamente.`,
        "success"
    );

    formulario.reset();
    [nombre, correo, consulta].forEach((campo) => {
        campo.classList.remove("is-valid", "is-invalid");
    });
}

/**
 * Comprueba que el correo tenga un formato básico válido.
 * @param {string} correo Correo ingresado por el usuario.
 * @returns {boolean} true cuando el formato es correcto.
 */
function validarCorreo(correo) {
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionCorreo.test(correo);
}

/**
 * Aplica clases visuales de Bootstrap según el resultado de la validación.
 * @param {HTMLElement} campo Campo que se está validando.
 * @param {boolean} esValido Resultado de la validación.
 */
function actualizarValidacionCampo(campo, esValido) {
    campo.classList.toggle("is-valid", esValido);
    campo.classList.toggle("is-invalid", !esValido);
}

/**
 * Crea el mensaje de respuesta del formulario usando createElement y appendChild.
 * @param {string} mensaje Mensaje que se mostrará.
 * @param {string} tipo Tipo de alerta Bootstrap.
 */
function mostrarRespuestaFormulario(mensaje, tipo) {
    const contenedor = document.getElementById("respuestaFormulario");
    contenedor.replaceChildren();

    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo} mb-0`;
    alerta.setAttribute("role", "alert");
    alerta.textContent = mensaje;

    contenedor.appendChild(alerta);
}

// Se inicia la aplicación cuando todo el HTML ha sido cargado.
document.addEventListener("DOMContentLoaded", iniciarAplicacion);
