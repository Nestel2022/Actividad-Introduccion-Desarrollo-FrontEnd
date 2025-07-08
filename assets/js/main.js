// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Arroz tradicional",
        precio: 25.000,
        precioOriginal: 30.000,
        imagen: "assets/img/arroz.jpg",
        categoria: "cereales",
        descripcion: "Arroz sin conservantes.",
        stock: 50
    },
    {
        id: 2,
        nombre: "Botella de Leche",
        precio: 4.000,
        imagen: "assets/img/leche.jpg",
        categoria: "lacteos",
        descripcion: "Leche entera fresca, ideal para el desayuno.",
        stock: 30
    },
    {
        id: 3,
        nombre: "Jamón",
        precio: 950.000,
        precioOriginal: 990.000,
        imagen: "assets/img/jamon.jpg",
        categoria: "carnes",
        descripcion: "Jamón de cerdo curado, sabor intenso y textura suave.",
        stock: 20
    },
    {
        id: 4,
        nombre: "Cerveza Artesanal",
        precio: 12.000,
        imagen: "assets/img/cerveza.jpg",
        categoria: "bebidas",
        descripcion: "Cerveza artesanal de alta calidad, sabor único.",
        stock: 40
    }
];

// Frutas
const productosNuevos = [
    {
        id: 5,
        nombre: "Manzana Verde",
        precio: 2.500,
        precioOriginal: 2.600,
        imagen: "assets/img/manzana-verde.jpg",
        categoria: "frutas",
        descripcion: "Manzana verde fresca, crujiente y jugosa.",
        stock: 50
    },
    {
        id: 6,
        nombre: "Ciruela",
         precio: 1.500,
        precioOriginal: 1.550,
        imagen: "assets/img/ciruela.jpg",
        categoria: "frutas",
        descripcion: "Ciruela amarilla dulce y jugosa, ideal para postres.",
        stock: 30
    },
    {
        id: 7,
        nombre: "Piña",
        precio: 4.500,
        precioOriginal: 5.500,
        imagen: "assets/img/piña.jpg",
        categoria: "frutas",
        descripcion: "Piña fresca, dulce y jugosa, perfecta para batidos.",
        stock: 20
    },
    {
        id: 8,
        nombre: "Limon",
        precio: 2.000,
        imagen: "assets/img/limon.jpg",
        categoria: "frutas",
        descripcion: "Limón fresco, ideal para bebidas y aderezos.",
        stock: 40
    }
];
// Cargar carrito desde localStorage o inicializar si no existe
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para guardar el carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para añadir producto al carrito 
function addToCart(productId, isNewProduct = false) {
    // Buscar en ambos arrays de productos
    const product = productos.find(p => p.id === productId) || 
                   productosNuevos.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('No hay suficiente stock disponible');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            imagen: product.imagen,
            quantity: 1
        });
    }
    
    saveCartToStorage(); // Guardar en localStorage
    updateCartCount();
    showToast(product.nombre);
}

// Función para mostrar notificación
function showToast(productName) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Producto añadido</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${productName} ha sido añadido al carrito.
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Cargar productos destacados
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos normales
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        productos.slice(0, 4).forEach(producto => {
            featuredContainer.appendChild(createProductCard(producto));
        });
    }
    
    // Cargar productos nuevos
    const newProductsContainer = document.getElementById('featured-products-new');
    if (newProductsContainer) {
        productosNuevos.slice(0, 4).forEach(producto => {
            newProductsContainer.appendChild(createProductCard(producto, true));
        });
    }
    
    // Actualizar contador al cargar la página
    updateCartCount();
    
    // Asignar event listeners a todos los botones
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const isNewProduct = this.getAttribute('data-is-new') === 'true';
            addToCart(productId, isNewProduct);
        });
    });
});

// Función para crear tarjetas de producto
function createProductCard(producto, isNewProduct = false) {
    const col = document.createElement('div');
    col.className = 'col-md-3 mb-4';
    
    const discountBadge = producto.precioOriginal ? 
        `<span class="discount-badge">${Math.round((1 - producto.precio/producto.precioOriginal)*100)}% OFF</span>` : '';
    
    const originalPrice = producto.precioOriginal ? 
        `<small class="original-price ms-2">$${producto.precioOriginal.toFixed(2)}</small>` : '';
    
    col.innerHTML = `
        <div class="card product-card h-100">
            ${discountBadge}
            <img src="${producto.imagen}" class="card-img-top product-img" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text text-truncate">${producto.descripcion}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="product-price">$${producto.precio.toFixed(2)}</span>
                        ${originalPrice}
                    </div>
                    <button class="btn btn-success btn-sm add-to-cart" 
                            data-id="${producto.id}" 
                            data-is-new="${isNewProduct}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}