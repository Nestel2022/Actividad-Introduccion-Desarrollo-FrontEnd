# 🛒 Tienda Online - README

## 📌 Descripción General
Sistema de e-commerce para supermercado desarrollado con tecnologías web frontend. Permite a los usuarios:
- Explorar productos organizados por categorías
- Gestionar un carrito de compras
- Completar pedidos con pasarela de pago integrada
- Consultar historial de compras anteriores

## ✨ Características Principales

### 🛍️ Módulo de Productos
- Catálogo con filtros por categorías
- Destacados y nuevos productos
- Vista detallada de cada producto
- Sistema de ofertas y descuentos

### 🛒 Carrito de Compras
- Persistencia en LocalStorage
- Actualización en tiempo real
- Notificaciones al agregar productos
- Resumen antes de pagar

### 💳 Pasarela de Pago
- Formulario seguro de cliente
- Selección de método de pago
- Generación de factura automática
- Confirmación por correo electrónico

## 🚀 Cómo Empezar

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Edge)
- Editor de código (VS Code recomendado)

### Instalación
1. Clonar repositorio:
```bash
git clone https://github.com/Nestel2022/Actividad-Introduccion-Desarrollo-FrontEnd.git

cd Actividad-Introduccion-Desarrollo-FrontEnd
start index.html

├── assets/
│   ├── css/
│   │   └── styles.css       # Estilos personalizados
│   ├── img/                 # Imágenes del proyecto
│   └── js/
│       ├── main.js          # Lógica principal
│       ├── pay.js           # Pasarela de pago
│       └── historial.js     # Historial de ventas
├── modules/
│   ├── historial.html       # Historial de compras
│   ├── pay.html             # Checkout de pago
│   ├── terms.html           # Términos y condiciones
│   └── privacy.html         # Política de privacidad
└── index.html               # Página principal