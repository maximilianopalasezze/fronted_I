"use strict";



let productos = [];
let carrito = [];
let categoriaActiva = "todos";
let terminoBusqueda = "";

/**
 * Inicia la aplicación una vez cargado el DOM.
 * Centraliza la configuración de eventos y la carga de productos.
 */
function iniciarAplicacion() {
    configurarEventosProductos();
    configurarFormularioBusqueda();
    configurarCategorias();
    configurarCarrito();
    cargarProductos();
}

/**
 * Carga los productos desde un archivo JSON local mediante Fetch API.
 * valída response.ok y muestra un mensaje amigable cuando ocurre un error.
 */
function cargarProductos() {
    actualizarEstadoCarga("Cargando productos...", "info", false);

    fetch("assets/js/productos.json")
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error(`Error HTTP ${respuesta.status}`);
            }
            return respuesta.json();
        })
        .then((datos) => {
            if (!Array.isArray(datos) || datos.length === 0) {
                throw new Error("El archivo de productos no contiene datos válidos.");
            }

            productos = datos;
            actualizarEstadoCarga("", "info", true);
            aplicarFiltros();
        })
        .catch((error) => {
            console.error("No fue posible cargar los productos:", error);
            actualizarEstadoCarga(
                "No pudimos cargar los productos en este momento. Intenta nuevamente más tarde.",
                "danger",
                false
            );
        });
}

/**
 * Actualiza el bloque informativo utilizado durante la carga Fetch.
 * @param {string} mensaje Texto visible para el usuario.
 * @param {string} tipo Clase de alerta Bootstrap.
 * @param {boolean} ocultar Define si el bloque debe ocultarse.
 */
function actualizarEstadoCarga(mensaje, tipo, ocultar) {
    const estado = document.getElementById("estadoCarga");
    estado.textContent = mensaje;
    estado.className = `alert alert-${tipo}`;
    estado.classList.toggle("d-none", ocultar);
}

/**
 * Filtra el catálogo según la categoría y el término de búsqueda actuales.
 * Luego envía el resultado a la función de renderizado.
 */
function aplicarFiltros() {
    const termino = terminoBusqueda.trim().toLowerCase();

    const filtrados = productos.filter((producto) => {
        const coincideCategoria = categoriaActiva === "todos" || producto.categoria === categoriaActiva;
        const coincideBusqueda = termino === "" ||
            producto.nombre.toLowerCase().includes(termino) ||
            producto.descripcion.toLowerCase().includes(termino);

        return coincideCategoria && coincideBusqueda;
    });

    renderizarProductos(filtrados);
    actualizarTextoFiltro(filtrados.length);
}

/**
 * Construye dinámicamente todas las tarjetas del catálogo usando createElement.
 * @param {Array} lista Productos que se mostrarán en pantalla.
 */
function renderizarProductos(lista) {
    const contenedor = document.getElementById("contenedorProductos");
    contenedor.replaceChildren();

    if (lista.length === 0) {
        const columna = document.createElement("div");
        columna.className = "col-12";

        const alerta = document.createElement("div");
        alerta.className = "alert alert-warning mb-0";
        alerta.setAttribute("role", "status");
        alerta.textContent = "No encontramos productos que coincidan con tu búsqueda.";

        columna.appendChild(alerta);
        contenedor.appendChild(columna);
        return;
    }

    lista.forEach((producto) => {
        contenedor.appendChild(crearTarjetaProducto(producto));
    });
}

/**
 * Crea una tarjeta Bootstrap completa para un producto.
 * @param {Object} producto Producto proveniente del JSON.
 * @returns {HTMLDivElement} Columna que contiene la tarjeta terminada.
 */
function crearTarjetaProducto(producto) {
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6";

    const tarjeta = document.createElement("article");
    tarjeta.className = "card producto-card border-0 shadow-sm";

    const imagen = document.createElement("img");
    imagen.className = "card-img-top";
    imagen.src = producto.imagen;
    imagen.alt = producto.alt;
    imagen.loading = "lazy";

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body d-flex flex-column";

    const categoria = document.createElement("span");
    categoria.className = "badge text-bg-secondary align-self-start categoria-etiqueta mb-2";
    categoria.textContent = producto.categoria;

    const titulo = document.createElement("h3");
    titulo.className = "card-title h5 fw-bold";
    titulo.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text text-secondary";
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement("p");
    precio.className = "fs-5 fw-bold mt-auto mb-3";
    precio.textContent = formatearPrecio(producto.precio);

    const boton = document.createElement("button");
    boton.className = "btn btn-primary btn-agregar";
    boton.type = "button";
    boton.dataset.id = String(producto.id);
    boton.textContent = "Agregar al carrito";

    cuerpo.appendChild(categoria);
    cuerpo.appendChild(titulo);
    cuerpo.appendChild(descripcion);
    cuerpo.appendChild(precio);
    cuerpo.appendChild(boton);

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);

    return columna;
}

/**
 * Registra el evento click del catálogo mediante delegación de eventos.
 * Al presionar “Agregar al carrito”, identifica el producto por su id.
 */
function configurarEventosProductos() {
    const contenedor = document.getElementById("contenedorProductos");

    contenedor.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".btn-agregar");
        if (!boton) return;

        agregarAlCarrito(Number(boton.dataset.id));
    });
}

/**
 * Agrega un producto al carrito o aumenta su cantidad si ya existe.
 * @param {number} idProducto Identificador del producto seleccionado.
 */
function agregarAlCarrito(idProducto) {
    const producto = productos.find((item) => item.id === idProducto);
    if (!producto) return;

    const existente = carrito.find((item) => item.id === idProducto);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    renderizarCarrito();
}

/**
 * Dibuja el resumen del carrito y actualiza cantidades y total.
 * La interfaz se reconstruye con createElement y appendChild.
 */
function renderizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const mensajeVacio = document.getElementById("carritoVacio");
    const resumen = document.getElementById("resumenCompra");
    const contadorNavbar = document.getElementById("contadorCarrito");
    const contadorResumen = document.getElementById("contadorCarritoResumen");
    const totalElemento = document.getElementById("totalCarrito");

    lista.replaceChildren();

    const cantidadTotal = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
    const total = carrito.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);

    contadorNavbar.textContent = String(cantidadTotal);
    contadorResumen.textContent = String(cantidadTotal);
    totalElemento.textContent = formatearPrecio(total);

    const estaVacio = carrito.length === 0;
    mensajeVacio.classList.toggle("d-none", !estaVacio);
    resumen.classList.toggle("d-none", estaVacio);

    carrito.forEach((item) => {
        const bloque = document.createElement("div");
        bloque.className = "item-carrito";

        const cabecera = document.createElement("div");
        cabecera.className = "d-flex justify-content-between gap-2";

        const nombre = document.createElement("span");
        nombre.className = "fw-semibold";
        nombre.textContent = item.nombre;

        const subtotal = document.createElement("span");
        subtotal.className = "fw-bold text-nowrap";
        subtotal.textContent = formatearPrecio(item.precio * item.cantidad);

        const detalle = document.createElement("div");
        detalle.className = "d-flex justify-content-between align-items-center mt-2";

        const cantidad = document.createElement("small");
        cantidad.className = "text-secondary";
        cantidad.textContent = `Cantidad: ${item.cantidad}`;

        const eliminar = document.createElement("button");
        eliminar.className = "btn btn-sm btn-link text-danger p-0 btn-eliminar";
        eliminar.type = "button";
        eliminar.dataset.id = String(item.id);
        eliminar.textContent = "Eliminar";

        cabecera.appendChild(nombre);
        cabecera.appendChild(subtotal);
        detalle.appendChild(cantidad);
        detalle.appendChild(eliminar);
        bloque.appendChild(cabecera);
        bloque.appendChild(detalle);
        lista.appendChild(bloque);
    });
}

/**
 * Configura los botones del resumen del carrito: eliminar y vaciar.
 */
function configurarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const botonVaciar = document.getElementById("btnVaciarCarrito");

    lista.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".btn-eliminar");
        if (!boton) return;

        eliminarDelCarrito(Number(boton.dataset.id));
    });

    botonVaciar.addEventListener("click", () => {
        carrito = [];
        renderizarCarrito();
    });
}

/**
 * Elimina por completo un producto del carrito.
 * @param {number} idProducto Identificador del producto que se eliminará.
 */
function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter((item) => item.id !== idProducto);
    renderizarCarrito();
}

/**
 * Registra el evento submit del formulario de búsqueda.
 * Evita la recarga de la página y aplica el filtro usando JavaScript.
 */
function configurarFormularioBusqueda() {
    const formulario = document.getElementById("formBusqueda");
    const campoBusqueda = document.getElementById("busqueda");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        terminoBusqueda = campoBusqueda.value;
        aplicarFiltros();
        document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
    });
}

/**
 * Configura las categorías de la barra de navegación y el botón “Mostrar todos”.
 * Los enlaces funcionan con click y modifican el catálogo sin recargar la página.
 */
function configurarCategorias() {
    const enlaces = document.querySelectorAll(".categoria-link");
    const botonTodos = document.getElementById("btnMostrarTodos");
    const campoBusqueda = document.getElementById("busqueda");

    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", () => {
            categoriaActiva = enlace.dataset.categoria;
            terminoBusqueda = "";
            campoBusqueda.value = "";

            enlaces.forEach((item) => item.classList.remove("active"));
            enlace.classList.add("active");
            aplicarFiltros();
        });
    });

    botonTodos.addEventListener("click", () => {
        categoriaActiva = "todos";
        terminoBusqueda = "";
        campoBusqueda.value = "";

        enlaces.forEach((item) => {
            item.classList.toggle("active", item.dataset.categoria === "todos");
        });

        aplicarFiltros();
    });
}

/**
 * Actualiza el texto que informa cuántos productos coinciden con los filtros.
 * @param {number} cantidad Cantidad de productos visibles.
 */
function actualizarTextoFiltro(cantidad) {
    const texto = document.getElementById("textoFiltro");
    const categoria = categoriaActiva === "todos" ? "todas las categorías" : categoriaActiva;

    if (terminoBusqueda.trim() !== "") {
        texto.textContent = `${cantidad} resultado(s) para “${terminoBusqueda.trim()}” en ${categoria}.`;
    } else {
        texto.textContent = `${cantidad} producto(s) en ${categoria}.`;
    }
}

/**
 * Formatea valores numéricos como precios en pesos chilenos.
 * @param {number} valor Precio a formatear.
 * @returns {string} Valor formateado en CLP.
 */
function formatearPrecio(valor) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(valor);
}

// La aplicación se inicia cuando el documento HTML está completamente disponible.
document.addEventListener("DOMContentLoaded", iniciarAplicacion);
