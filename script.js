// Catálogo inspirado en los productos de Renzo Costa
const productos = [
    {
        id: 1,
        nombre: "CARTERA DE CUERO NEW TULIP",
        categoria: "mujer",
        precio: 650.00,
        colores: ["#e8dfd5", "#1c1c1c", "#7c1d1d"],
        imagen: "https://unsplash.com"
    },
    {
        id: 2,
        nombre: "BILLETERA DE CUERO MINI GOLDEN CHIC",
        categoria: "billeteras",
        precio: 229.00,
        colores: ["#c5a880", "#8c8c8c", "#1d4ed8"],
        imagen: "https://unsplash.com"
    },
    {
        id: 3,
        nombre: "MINIBAG DE CUERO GOLDEN CHIC DIVA",
        categoria: "mujer",
        precio: 390.00,
        colores: ["#1e3a8a", "#111111"],
        imagen: "https://unsplash.com"
    },
    {
        id: 4,
        nombre: "BILLETERA DE CUERO CLÁSICA CABALLERO",
        categoria: "hombre",
        precio: 259.00,
        colores: ["#3e2723", "#111111", "#8d5524"],
        imagen: "https://unsplash.com"
    },
    {
        id: 5,
        nombre: "MORRAL DE CUERO ICONA",
        categoria: "mujer",
        precio: 490.00,
        colores: ["#7f9eb2", "#d4a373"],
        imagen: "https://unsplash.com"
    }
];

let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos(productos);
});

function renderizarProductos(lista) {
    const contenedor = document.getElementById("contenedorProductos");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 30px; font-size: 13px;">No se encontraron artículos con ese criterio.</p>`;
        return;
    }

    lista.forEach(prod => {
        const swatchesHTML = prod.colores.map((hex, i) =>
            `<span class="swatch ${i === 0 ? 'activo' : ''}" style="background-color: ${hex};" onclick="seleccionarColor(this)"></span>`
        ).join("");

        const card = document.createElement("div");
        card.className = "producto-card";
        card.innerHTML = `
            <div class="producto-img-box">
                <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
                <button class="btn-comprar-hover" onclick="agregarAlCarrito(${prod.id})">COMPRAR</button>
            </div>
            <div class="producto-meta">
                <h3>${prod.nombre}</h3>
                <span class="precio">S/ ${prod.precio.toFixed(2)}</span>
                <div class="colores-swatches">
                    ${swatchesHTML}
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Efecto visual al elegir bolita de color
function seleccionarColor(elemento) {
    const padre = elemento.parentElement;
    padre.querySelectorAll(".swatch").forEach(s => s.classList.remove("activo"));
    elemento.classList.add("activo");
}

// Filtrar por categoría desde el menú
function filtrarPorCategoria(cat) {
    if (cat === "todos") {
        renderizarProductos(productos);
    } else if (cat === "billeteras") {
        const filtrados = productos.filter(p => p.categoria === "billeteras" || p.categoria === "hombre");
        renderizarProductos(filtrados);
    } else {
        const filtrados = productos.filter(p => p.categoria === cat);
        renderizarProductos(filtrados);
    }
}

// Buscador superior en tiempo real
function buscarProductos() {
    const texto = document.getElementById("inputBuscador").value.trim().toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    renderizarProductos(filtrados);
}

// Rotación visual de tarjetas con flechas
function desplazarCarrusel(direccion) {
    if (direccion === 1) {
        const primero = productos.shift();
        productos.push(primero);
    } else {
        const ultimo = productos.pop();
        productos.unshift(ultimo);
    }
    renderizarProductos(productos);
}

// Carrito de compras
function agregarAlCarrito(id) {
    const prod = productos.find(p => p.id === id);
    carrito.push(prod);
    actualizarCarritoUI();
    mostrarToast(`Agregado: ${prod.nombre}`);
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const lista = document.getElementById("listaCarrito");
    const contador = document.getElementById("contadorCarrito");
    const totalEl = document.getElementById("totalCarrito");

    contador.textContent = carrito.length;

    if (carrito.length === 0) {
        lista.innerHTML = `<p class="carrito-vacio">Tu bolsa está vacía.</p>`;
        totalEl.textContent = "S/ 0.00";
        return;
    }

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((item, idx) => {
        total += item.precio;
        const div = document.createElement("div");
        div.className = "item-carrito";
        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                <span>S/ ${item.precio.toFixed(2)}</span>
            </div>
            <button onclick="eliminarDelCarrito(${idx})" style="background:none;border:none;color:#a61c1c;cursor:pointer;">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        lista.appendChild(div);
    });

    totalEl.textContent = `S/ ${total.toFixed(2)}`;
}

function toggleCarrito() {
    const panel = document.getElementById("panelCarrito");
    const overlay = document.getElementById("overlayCarrito");
    const abierto = panel.classList.contains("abierto");

    panel.classList.toggle("abierto");
    overlay.style.display = abierto ? "none" : "block";
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Tu bolsa está vacía.");
        return;
    }
    alert("¡Pedido confirmado! Gracias por comprar en Valeria Costa.");
    carrito = [];
    actualizarCarritoUI();
    toggleCarrito();
}

// Menú móvil
function toggleMenuMovil() {
    document.getElementById("menuMovil").classList.toggle("activo");
}

// Widget Flotante de Información
function toggleInfoFlotante() {
    document.getElementById("ventanaInfo").classList.toggle("activa");
}

function abrirInfoFlotante(tema) {
    document.getElementById("ventanaInfo").classList.add("activa");
    if (tema) mostrarDetalleInfo(tema);
}

function mostrarDetalleInfo(tema) {
    const caja = document.getElementById("cajaDetalleInfo");
    const mensajes = {
        envios: "<strong>Entregas rápidas:</strong> Envío gratis por compras mayores a S/ 199. Entrega en 24 horas en Lima Metropolitana.",
        recojo: "<strong>Compra Online y Recoge:</strong> Retira sin costo en nuestras boutiques de Jockey Plaza, Larcomar y Real Plaza Salaverry.",
        seguridad: "<strong>Compra Segura:</strong> Todas nuestras carteras y billeteras son 100% cuero legítimo certificado con 2 años de garantía.",
        whatsapp: "<strong>Asesoría Directa:</strong> Escríbenos al +51 987 654 321 para ver fotos reales y personalizar tu regalo."
    };
    caja.innerHTML = mensajes[tema];
    caja.style.display = "block";
}

// Modal de Suscripción
function abrirModalSuscripcion() {
    document.getElementById("modalSuscripcion").style.display = "flex";
}

function cerrarModalSuscripcion() {
    document.getElementById("modalSuscripcion").style.display = "none";
}

function procesarSuscripcion() {
    const correo = document.getElementById("correoSuscripcion").value.trim();
    if (!correo || !correo.includes("@")) {
        alert("Por favor, ingresa un correo válido.");
        return;
    }
    alert("¡Gracias por suscribirte! Usa el código CUERO10 en tu compra.");
    document.getElementById("correoSuscripcion").value = "";
    cerrarModalSuscripcion();
}

function mostrarToast(texto) {
    const toast = document.getElementById("toast");
    toast.textContent = texto;
    toast.classList.add("mostrar");
    setTimeout(() => toast.classList.remove("mostrar"), 2400);
}