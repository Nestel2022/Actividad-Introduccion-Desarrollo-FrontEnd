document.addEventListener("DOMContentLoaded", function () {
  // Cargar carrito desde localStorage o usar un carrito de ejemplo
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  console.log("Carrito cargado:", cartItems);
  // Función para actualizar el contador del carrito
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;

  // Variables del formulario
  let customerData = {};
  let paymentMethod = null;

  // Elementos del DOM
  const customerForm = document.getElementById("customer-form");
  const step1Content = document.getElementById("step1-content");
  const step2Content = document.getElementById("step2-content");
  const step3Content = document.getElementById("step3-content");
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const orderSummary = document.getElementById("order-summary");
  const invoiceContainer = document.getElementById("invoice-container");
  const invoiceContent = document.getElementById("invoice-content");

  // Inicializar carrito
  function loadCart() {
    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.precio * item.quantity;
      subtotal += itemTotal;

      const itemElement = document.createElement("div");
      itemElement.className = "d-flex justify-content-between mb-3";
      itemElement.innerHTML = `
                <div>
                    <h6 class="mb-0">${item.nombre}</h6>
                    <small class="text-muted">${
                      item.quantity
                    } x $${item.precio.toFixed(2)}</small>
                </div>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
      cartItemsContainer.appendChild(itemElement);
    });

    const shipping = 5.0;
    const total = subtotal + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Manejar selección de método de pago
  document.querySelectorAll(".card-payment").forEach((card) => {
    card.addEventListener("click", function () {
      document.querySelectorAll(".card-payment").forEach((c) => {
        c.classList.remove("payment-selected");
      });
      this.classList.add("payment-selected");
      paymentMethod = this.getAttribute("data-payment");

      // Mostrar formulario de tarjeta si es necesario
      const creditCardForm = document.getElementById("credit-card-form");
      if (paymentMethod === "tarjeta") {
        creditCardForm.classList.remove("d-none");
      } else {
        creditCardForm.classList.add("d-none");
      }
    });
  });

  // Paso 1: Enviar información del cliente
  customerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    customerData = {
      nombre: document.getElementById("nombre").value,
      telefono: document.getElementById("telefono").value,
      email: document.getElementById("email").value,
      direccion: document.getElementById("direccion").value,
      notas: document.getElementById("notas").value,
    };

    // Ir al paso 2
    step1Content.classList.add("d-none");
    step2Content.classList.remove("d-none");
    document.getElementById("step1-tab").classList.remove("active");
    document.getElementById("step2-tab").classList.add("active");
  });

  // Botón regresar al paso 1
  document
    .getElementById("back-to-info")
    .addEventListener("click", function () {
      step2Content.classList.add("d-none");
      step1Content.classList.remove("d-none");
      document.getElementById("step2-tab").classList.remove("active");
      document.getElementById("step1-tab").classList.add("active");
    });

  // Continuar al paso 3
  document
    .getElementById("continue-to-confirm")
    .addEventListener("click", function () {
      if (!paymentMethod) {
        alert("Por favor selecciona un método de pago");
        return;
      }

      if (paymentMethod === "tarjeta") {
        const cardNumber = document.getElementById("card-number").value;
        const cardName = document.getElementById("card-name").value;
        const cardExpiry = document.getElementById("card-expiry").value;
        const cardCvv = document.getElementById("card-cvv").value;

        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
          alert("Por favor completa todos los campos de la tarjeta");
          return;
        }
      }

      // Generar resumen del pedido
      generateOrderSummary();

      // Ir al paso 3
      step2Content.classList.add("d-none");
      step3Content.classList.remove("d-none");
      document.getElementById("step2-tab").classList.remove("active");
      document.getElementById("step3-tab").classList.add("active");
    });

  // Botón regresar al paso 2
  document
    .getElementById("back-to-payment")
    .addEventListener("click", function () {
      step3Content.classList.add("d-none");
      step2Content.classList.remove("d-none");
      document.getElementById("step3-tab").classList.remove("active");
      document.getElementById("step2-tab").classList.add("active");
    });

  // Generar resumen del pedido
  function generateOrderSummary() {
    const shipping = 5.0;
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.precio * item.quantity,
      0
    );
    const total = subtotal + shipping;

    let paymentDetails = "";
    if (paymentMethod === "tarjeta") {
      const cardNumber = document.getElementById("card-number").value;
      paymentDetails = `Tarjeta terminada en ${cardNumber.slice(-4)}`;
    } else {
      paymentDetails = "Efectivo al recibir";
    }

    orderSummary.innerHTML = `
            <div class="mb-4">
                <h6>Información del cliente</h6>
                <p class="mb-1">${customerData.nombre}</p>
                <p class="mb-1">${customerData.telefono}</p>
                <p class="mb-1">${customerData.email}</p>
                <p class="mb-0">${customerData.direccion}</p>
            </div>
            
            <div class="mb-4">
                <h6>Método de pago</h6>
                <p>${paymentDetails}</p>
            </div>
            
            <div class="mb-4">
                <h6>Resumen de productos</h6>
                ${cartItems
                  .map(
                    (item) => `
                    <div class="d-flex justify-content-between mb-2">
                        <span>${item.nombre} (${item.quantity})</span>
                        <span>$${(item.precio * item.quantity).toFixed(
                          2
                        )}</span>
                    </div>
                `
                  )
                  .join("")}
                
                <hr>
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Envío:</span>
                    <span>$${shipping.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
            
            ${
              customerData.notas
                ? `
            <div class="alert alert-info">
                <h6>Notas adicionales</h6>
                <p class="mb-0">${customerData.notas}</p>
            </div>
            `
                : ""
            }
        `;
  }

  // Confirmar compra y generar factura
  document
    .getElementById("confirm-purchase")
    .addEventListener("click", function () {
      if (!document.getElementById("terms-check").checked) {
        alert("Debes aceptar los términos y condiciones");
        return;
      }

      generateInvoice();
      step3Content.classList.add("d-none");
      invoiceContainer.style.display = "block";
      
      // Función para guardar compra en el storage
      savePurchaseData(customerData, paymentMethod, cartItems);

      // Limpiar carrito (en un caso real)
      localStorage.removeItem('cart');
    });

  function savePurchaseData(customerData, paymentMethod, cartItems) {
    try {
      // 1. Obtener datos existentes o inicializar array vacío
      const existingData = JSON.parse(localStorage.getItem("shopping")) || [];
           
      // 2. Crear nuevo objeto de compra con timestamp
      const newPurchase = {
        id: Date.now(), // ID único basado en timestamp
        date: new Date().toISOString(),
        customer: customerData,
        payment: paymentMethod,
        items: cartItems      
      };

      // 3. Agregar la nueva compra al array existente
      const updatedData = [...existingData, newPurchase];

      // 4. Guardar en localStorage (máximo 50 compras)
      const finalData = updatedData.slice(-50); // Mantener solo las 50 más recientes
      localStorage.setItem("shopping", JSON.stringify(finalData));

      // 5. Devolver el ID de la compra para referencia
      return newPurchase.id;
    } catch (error) {
      console.error("Error al guardar datos de compra:", error);
      // En caso de error, intentar guardar solo la nueva compra
      localStorage.setItem(
        "shopping",
        JSON.stringify([
          {
            id: Date.now(),
            date: new Date().toISOString(),
            customer: customerData,
            payment: paymentMethod,
            items: cartItems           
          },
        ])
      );
      return null;
    }
  }

 

  // Generar factura
  function generateInvoice() {
    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      Math.random() * 10000
    )}`;

    const shipping = 5.0;
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.precio * item.quantity,
      0
    );
    const total = subtotal + shipping;

    let paymentDetails = "";
    if (paymentMethod === "tarjeta") {
      const cardNumber = document.getElementById("card-number").value;
      paymentDetails = `Tarjeta terminada en ${cardNumber.slice(-4)}`;
    } else {
      paymentDetails = "Efectivo al recibir";
    }

    invoiceContent.innerHTML = `
            <div class="text-center mb-4">
                <img src="/assets/img/logo.png" alt="Tienda" height="60" class="mb-3">
                <h4>Tienda Online</h4>
                <p class="text-muted mb-0">Centro Bogotá</p>
                <p class="text-muted">NIT: 123456789-0</p>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <h6>Factura a:</h6>
                    <p class="mb-1"><strong>${customerData.nombre}</strong></p>
                    <p class="mb-1">${customerData.direccion}</p>
                    <p class="mb-1">Tel: ${customerData.telefono}</p>
                    <p class="mb-0">Email: ${customerData.email}</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <h6>Detalles de factura:</h6>
                    <p class="mb-1"><strong>Factura #:</strong> ${invoiceNumber}</p>
                    <p class="mb-1"><strong>Fecha:</strong> ${now.toLocaleDateString()}</p>
                    <p class="mb-1"><strong>Método de pago:</strong> ${paymentDetails}</p>
                </div>
            </div>
            
            <div class="table-responsive mb-4">
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th>Producto</th>
                            <th class="text-end">Precio Unitario</th>
                            <th class="text-end">Cantidad</th>
                            <th class="text-end">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cartItems
                          .map(
                            (item) => `
                            <tr>
                                <td>${item.nombre}</td>
                                <td class="text-end">$${item.precio.toFixed(
                                  2
                                )}</td>
                                <td class="text-end">${item.quantity}</td>
                                <td class="text-end">$${(
                                  item.precio * item.quantity
                                ).toFixed(2)}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <th colspan="3" class="text-end">Subtotal:</th>
                            <th class="text-end">$${subtotal.toFixed(2)}</th>
                        </tr>
                        <tr>
                            <th colspan="3" class="text-end">Envío:</th>
                            <th class="text-end">$${shipping.toFixed(2)}</th>
                        </tr>
                        <tr>
                            <th colspan="3" class="text-end">Total:</th>
                            <th class="text-end">$${total.toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            
            ${
              customerData.notas
                ? `
            <div class="mb-4">
                <h6>Notas:</h6>
                <p>${customerData.notas}</p>
            </div>
            `
                : ""
            }
            
            <div class="alert alert-success">
                <i class="fas fa-check-circle me-2"></i> ¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.
            </div>
        `;
  }

  // Imprimir factura
  document
    .getElementById("print-invoice")
    .addEventListener("click", function () {
      window.print();
    });

  // Inicializar
  loadCart();
});
