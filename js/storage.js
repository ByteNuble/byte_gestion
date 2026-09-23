// =========================================================
// storage.js — Capa única de acceso a datos (localStorage)
// =========================================================
// Todos los módulos deben leer y escribir a través de aquí.
// No guardar datos directamente desde otros archivos.
// =========================================================


// ---------------------------------------------------------
// 1. CLAVES DE ALMACENAMIENTO
// ---------------------------------------------------------
const KEYS = {
  products: "bg_products",
  clients:  "bg_clients",
  sales:    "bg_sales",
  config:   "bg_config"
};

const SCHEMA_VERSION = 1;


// ---------------------------------------------------------
// 2. UTILIDADES INTERNAS
// ---------------------------------------------------------

function _read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("[storage] Error leyendo", key, e);
    return null;
  }
}

function _write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn("[storage] Error escribiendo", key, e);
    return false;
  }
}

/**
 * Genera un ID único simple y ordenable.
 * Ej: "p_1727000000000_4821"
 */
function generateId(prefijo) {
  const tiempo = Date.now();
  const azar = Math.floor(Math.random() * 9000) + 1000;
  return `${prefijo}_${tiempo}_${azar}`;
}


// ---------------------------------------------------------
// 3. INICIALIZACIÓN Y RESET
// ---------------------------------------------------------

/**
 * Si localStorage está vacío, carga los datos del seed.
 * Se llama una vez al arrancar la app.
 */
function seedIfEmpty() {
  const config = _read(KEYS.config);

  // Si ya está inicializado con la versión actual, no hacer nada
  if (config && config.initialized && config.version === SCHEMA_VERSION) {
    return;
  }

  // Cargar datos demo
  _write(KEYS.products, SEED_DATA.products);
  _write(KEYS.clients,  SEED_DATA.clients);
  _write(KEYS.sales,    SEED_DATA.sales);
  _write(KEYS.config, {
    initialized: true,
    version: SCHEMA_VERSION,
    seededAt: Date.now()
  });
}

/**
 * Restaura los datos demo originales.
 * Borra todo y vuelve a cargar el seed.
 */
function resetDemo() {
  localStorage.removeItem(KEYS.products);
  localStorage.removeItem(KEYS.clients);
  localStorage.removeItem(KEYS.sales);
  localStorage.removeItem(KEYS.config);
  seedIfEmpty();
}

/**
 * Borra TODOS los datos de la demo (productos, clientes, ventas, config).
 * No borra la sesión.
 */
function clearAll() {
  localStorage.removeItem(KEYS.products);
  localStorage.removeItem(KEYS.clients);
  localStorage.removeItem(KEYS.sales);
  localStorage.removeItem(KEYS.config);
}


// ---------------------------------------------------------
// 4. PRODUCTOS
// ---------------------------------------------------------

function getProducts() {
  return _read(KEYS.products) || [];
}

function saveProducts(lista) {
  return _write(KEYS.products, lista);
}

function addProduct(producto) {
  const lista = getProducts();
  const nuevo = {
    id: generateId("p"),
    nombre: producto.nombre.trim(),
    categoria: producto.categoria,
    precio: Number(producto.precio),
    stock: Number(producto.stock),
    stockMinimo: Number(producto.stockMinimo)
  };
  lista.push(nuevo);
  saveProducts(lista);
  return nuevo;
}

function updateProduct(id, cambios) {
  const lista = getProducts();
  const i = lista.findIndex(p => p.id === id);
  if (i === -1) return null;

  lista[i] = {
    ...lista[i],
    ...cambios,
    precio: cambios.precio !== undefined ? Number(cambios.precio) : lista[i].precio,
    stock: cambios.stock !== undefined ? Number(cambios.stock) : lista[i].stock,
    stockMinimo: cambios.stockMinimo !== undefined ? Number(cambios.stockMinimo) : lista[i].stockMinimo
  };
  saveProducts(lista);
  return lista[i];
}

function deleteProduct(id) {
  const lista = getProducts().filter(p => p.id !== id);
  saveProducts(lista);
}

function getProductById(id) {
  return getProducts().find(p => p.id === id) || null;
}


// ---------------------------------------------------------
// 5. CLIENTES
// ---------------------------------------------------------

function getClients() {
  return _read(KEYS.clients) || [];
}

function saveClients(lista) {
  return _write(KEYS.clients, lista);
}

function addClient(cliente) {
  const lista = getClients();
  const nuevo = {
    id: generateId("c"),
    nombre: cliente.nombre.trim(),
    empresa: cliente.empresa.trim(),
    email: cliente.email.trim(),
    telefono: cliente.telefono.trim()
  };
  lista.push(nuevo);
  saveClients(lista);
  return nuevo;
}

function updateClient(id, cambios) {
  const lista = getClients();
  const i = lista.findIndex(c => c.id === id);
  if (i === -1) return null;

  lista[i] = { ...lista[i], ...cambios };
  saveClients(lista);
  return lista[i];
}

function deleteClient(id) {
  const lista = getClients().filter(c => c.id !== id);
  saveClients(lista);
}

function getClientById(id) {
  return getClients().find(c => c.id === id) || null;
}


// ---------------------------------------------------------
// 6. VENTAS
// ---------------------------------------------------------

function getSales() {
  return _read(KEYS.sales) || [];
}

function saveSales(lista) {
  return _write(KEYS.sales, lista);
}

/**
 * Registra una venta y descuenta stock.
 * Estructura esperada de `venta`:
 * {
 *   clienteId: "c01",
 *   estado: "Pagada" | "Pendiente",
 *   items: [{ productoId, cantidad }, ...]
 * }
 *
 * Lanza errores si:
 *   - no hay items
 *   - el cliente no existe
 *   - un producto no existe
 *   - no hay stock suficiente
 */
function addSale(venta) {
  if (!venta || !Array.isArray(venta.items) || venta.items.length === 0) {
    throw new Error("La venta debe tener al menos un producto.");
  }

  const cliente = getClientById(venta.clienteId);
  if (!cliente) throw new Error("Cliente no encontrado.");

  const productos = getProducts();
  const itemsFinales = [];
  let total = 0;

  // Validar stock y preparar items con precio unitario "congelado"
  for (const item of venta.items) {
    const prod = productos.find(p => p.id === item.productoId);
    if (!prod) throw new Error("Producto no encontrado.");
    if (item.cantidad <= 0) throw new Error("Cantidad inválida.");
    if (prod.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para "${prod.nombre}". Disponible: ${prod.stock}.`);
    }

    itemsFinales.push({
      productoId: prod.id,
      cantidad: Number(item.cantidad),
      precioUnitario: prod.precio
    });
    total += prod.precio * item.cantidad;
  }

  // Descontar stock
  for (const item of itemsFinales) {
    const prod = productos.find(p => p.id === item.productoId);
    prod.stock -= item.cantidad;
  }
  saveProducts(productos);

  // Crear venta
  const nueva = {
    id: generateId("v"),
    fecha: venta.fecha || new Date().toISOString().slice(0, 10),
    clienteId: cliente.id,
    estado: venta.estado || "Pagada",
    items: itemsFinales,
    total: total
  };

  const ventas = getSales();
  ventas.push(nueva);
  saveSales(ventas);

  return nueva;
}

/**
 * Elimina una venta.
 * Devuelve el stock de los productos involucrados.
 */
function deleteSale(id) {
  const ventas = getSales();
  const venta = ventas.find(v => v.id === id);
  if (!venta) return;

  // Devolver stock
  const productos = getProducts();
  for (const item of venta.items) {
    const prod = productos.find(p => p.id === item.productoId);
    if (prod) prod.stock += item.cantidad;
  }
  saveProducts(productos);

  // Quitar venta
  saveSales(ventas.filter(v => v.id !== id));
}

function getSaleById(id) {
  return getSales().find(v => v.id === id) || null;
}


// ---------------------------------------------------------
// 7. CONFIGURACIÓN
// ---------------------------------------------------------

function getConfig() {
  return _read(KEYS.config) || {};
}

function saveConfig(cfg) {
  return _write(KEYS.config, cfg);
}


// ---------------------------------------------------------
// 8. EXPORTAR
// ---------------------------------------------------------

/**
 * Exporta todos los datos como un objeto (útil para respaldo).
 */
function exportAll() {
  return {
    products: getProducts(),
    clients: getClients(),
    sales: getSales(),
    config: getConfig(),
    exportedAt: new Date().toISOString()
  };
}