document.addEventListener('DOMContentLoaded', function() {
    // cargar storage de compras
    const historialCompras = JSON.parse(localStorage.getItem("shopping")) || [];   

    // Crear contenedor principal
    const mainContainer = document.createElement('main');
    mainContainer.className = 'container my-5';
    document.querySelector('body').insertBefore(mainContainer, document.querySelector('footer'));

    // Mostrar mensaje si no hay compras
    if (historialCompras.length === 0) {
        mainContainer.innerHTML = `
            <div class="card">
                <div class="card-body text-center py-5">
                    <i class="fas fa-history fa-4x mb-3 text-muted"></i>
                    <h3>No hay compras registradas</h3>
                    <p class="text-muted">Tu historial de compras aparecerá aquí</p>
                    <a href="/index.html" class="btn btn-success">Ir a comprar</a>
                </div>
            </div>
        `;
        return;
    }

    // Ordenar compras por fecha
    historialCompras.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Crear estructura del historial
    mainContainer.innerHTML = `
        <h2 class="mb-4">Historial de Compras</h2>
        <div class="mb-3">
            <div class="input-group">
                <input type="text" class="form-control" id="search-input" placeholder="Buscar compras...">
                <button class="btn btn-success" id="search-btn">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
        <div id="purchases-list"></div>
    `;

    const purchasesList = document.getElementById('purchases-list');

   

    // Función para formatear fecha
    function formatearFecha(fechaISO) {
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(fechaISO).toLocaleDateString('es-CO', opciones);
    }

    // Función para renderizar las compras
    function renderPurchases(purchases) {
        purchasesList.innerHTML = purchases.map(purchase => {           
            return `
            <div class="card mb-4 purchase-card">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-0">Compra #${purchase.id}</h5>
                        <small class="text-muted">${formatearFecha(purchase.date)}</small>
                    </div>
                   
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Cliente:</h6>
                            <p class="mb-1"><strong>${purchase.customer.nombre}</strong></p>
                            <p class="mb-1">${purchase.customer.email}</p>
                            <p class="mb-1">Tel: ${purchase.customer.telefono}</p>
                            <p class="mb-0">${purchase.customer.direccion}</p>
                        </div>
                        <div class="col-md-6">
                            <h6>Método de pago:</h6>
                            <p>
                                ${purchase.payment === 'tarjeta' ? 
                                    '<i class="fas fa-credit-card me-2"></i> Tarjeta' : 
                                    '<i class="fas fa-money-bill-wave me-2"></i> Efectivo'}
                            </p>
                            ${purchase.customer.notas ? `
                                <h6>Notas:</h6>
                                <p>${purchase.customer.notas}</p>
                            ` : ''}
                        </div>
                    </div>
                    
                    <hr>
                    
                    <h6>Productos:</h6>
                    ${purchase.items && purchase.items.length > 0 ? `
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th class="text-end">Precio Unitario</th>
                                    <th class="text-end">Cantidad</th>
                                    <th class="text-end">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${purchase.items.map(item => `
                                    <tr>
                                        <td>
                                            <img src="/${item.imagen}" alt="/${item.nombre}" width="40" class="me-2">
                                            ${item.nombre}
                                        </td>
                                        <td class="text-end">$${item.precio.toLocaleString('es-CO')}</td>
                                        <td class="text-end">${item.quantity}</td>
                                        <td class="text-end">$${(item.precio * item.quantity).toLocaleString('es-CO')}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : '<p class="text-muted">No hay productos en esta compra</p>'}
                </div>
            </div>
            `;
        }).join('');
    }

    // Renderizar todas las compras inicialmente
    renderPurchases(historialCompras);

    // Funcionalidad de búsqueda
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const filtered = historialCompras.filter(purchase => 
            purchase.customer.nombre.toLowerCase().includes(searchTerm) ||
            purchase.id.toString().includes(searchTerm) ||
            (purchase.items && purchase.items.some(item => 
                item.nombre.toLowerCase().includes(searchTerm))
        ));
        renderPurchases(filtered);
    });

    
});

