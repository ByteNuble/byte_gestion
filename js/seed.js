// =========================================================
// seed.js — Datos de demostración
// =========================================================
// Datos ficticios realistas para una PyME chilena.
// Se cargan una sola vez (o al pulsar "Restaurar datos demo").
// Nada de información real.
// =========================================================

const SEED_DATA = {

  // -------------------------------------------------------
  // PRODUCTOS (~18)
  // -------------------------------------------------------
  products: [
    { id: "p01", nombre: "Laptop Lenovo ThinkPad E14",  categoria: "Tecnología",    precio: 850000, stock: 12, stockMinimo: 3 },
    { id: "p02", nombre: "Laptop HP Pavilion 15",        categoria: "Tecnología",    precio: 780000, stock: 7,  stockMinimo: 3 },
    { id: "p03", nombre: "Monitor LG 24\" Full HD",      categoria: "Tecnología",    precio: 180000, stock: 9,  stockMinimo: 3 },
    { id: "p04", nombre: "Monitor Samsung 27\" QHD",     categoria: "Tecnología",    precio: 320000, stock: 4,  stockMinimo: 2 },
    { id: "p05", nombre: "Mouse Logitech M170",          categoria: "Accesorios",    precio: 15000,  stock: 3,  stockMinimo: 5 },
    { id: "p06", nombre: "Mouse Inalámbrico Microsoft",  categoria: "Accesorios",    precio: 22000,  stock: 18, stockMinimo: 5 },
    { id: "p07", nombre: "Teclado Mecánico Redragon",    categoria: "Accesorios",    precio: 45000,  stock: 0,  stockMinimo: 4 },
    { id: "p08", nombre: "Teclado Logitech K120",        categoria: "Accesorios",    precio: 12000,  stock: 25, stockMinimo: 6 },
    { id: "p09", nombre: "Audífonos Sony WH-CH520",      categoria: "Accesorios",    precio: 65000,  stock: 11, stockMinimo: 4 },
    { id: "p10", nombre: "Webcam Logitech C270",         categoria: "Accesorios",    precio: 38000,  stock: 6,  stockMinimo: 3 },
    { id: "p11", nombre: "Disco SSD Kingston 480GB",     categoria: "Almacenamiento",precio: 55000,  stock: 14, stockMinimo: 5 },
    { id: "p12", nombre: "Disco Duro Seagate 1TB",       categoria: "Almacenamiento",precio: 62000,  stock: 2,  stockMinimo: 4 },
    { id: "p13", nombre: "Pendrive Kingston 64GB",       categoria: "Almacenamiento",precio: 9500,   stock: 40, stockMinimo: 10 },
    { id: "p14", nombre: "Router TP-Link Archer C6",     categoria: "Redes",         precio: 48000,  stock: 8,  stockMinimo: 3 },
    { id: "p15", nombre: "Switch TP-Link 8 puertos",     categoria: "Redes",         precio: 35000,  stock: 5,  stockMinimo: 3 },
    { id: "p16", nombre: "Cable HDMI 2m",                categoria: "Redes",         precio: 6500,   stock: 60, stockMinimo: 15 },
    { id: "p17", nombre: "Silla Ergonómica Oficina",     categoria: "Oficina",       precio: 145000, stock: 6,  stockMinimo: 2 },
    { id: "p18", nombre: "Escritorio Melamina 1.2m",     categoria: "Oficina",       precio: 98000,  stock: 3,  stockMinimo: 2 }
  ],

  // -------------------------------------------------------
  // CLIENTES (~12)
  // -------------------------------------------------------
  clients: [
    { id: "c01", nombre: "Rodrigo Fuentes",     empresa: "Constructora Los Andes SpA",  email: "rfuentes@losandes.cl",   telefono: "+56 9 8123 4567" },
    { id: "c02", nombre: "Carolina Muñoz",      empresa: "Panadería Doña Rosa",         email: "contacto@donarosa.cl",   telefono: "+56 9 7234 5678" },
    { id: "c03", nombre: "Andrés Silva",        empresa: "Clínica Dental Ñuble",        email: "asilva@dentalnuble.cl",  telefono: "+56 9 6345 6789" },
    { id: "c04", nombre: "Valentina Rojas",     empresa: "Estudio Contable VR",         email: "valentina@contablevr.cl",telefono: "+56 9 5456 7890" },
    { id: "c05", nombre: "Matías Herrera",      empresa: "Transportes Herrera Ltda.",   email: "mherrera@therrera.cl",   telefono: "+56 9 4567 8901" },
    { id: "c06", nombre: "Javiera Contreras",   empresa: "Cafetería Aroma",             email: "javiera@aroma.cl",       telefono: "+56 9 3678 9012" },
    { id: "c07", nombre: "Felipe Sepúlveda",    empresa: "Agrícola San Ramón",          email: "fsepulveda@sanramon.cl", telefono: "+56 9 2789 0123" },
    { id: "c08", nombre: "Daniela Vega",        empresa: "Boutique Luna",               email: "daniela@boutiqueluna.cl",telefono: "+56 9 1890 1234" },
    { id: "c09", nombre: "Cristián Paredes",    empresa: "Ferretería El Tornillo",      email: "cparedes@eltornillo.cl", telefono: "+56 9 9012 3456" },
    { id: "c10", nombre: "Paulina Soto",        empresa: "Jardín Infantil Semillita",   email: "psoto@semillita.cl",     telefono: "+56 9 8123 9087" },
    { id: "c11", nombre: "Ignacio Navarro",     empresa: "Servicios Eléctricos IN",     email: "inavarro@electricoin.cl",telefono: "+56 9 7234 8091" },
    { id: "c12", nombre: "Francisca Leal",      empresa: "Veterinaria Patitas",         email: "fleal@patitas.cl",       telefono: "+56 9 6345 7092" }
  ],

  // -------------------------------------------------------
  // VENTAS (~28)
  // -------------------------------------------------------
  // Distribuidas entre los últimos 9 meses para que los
  // gráficos mensuales tengan información.
  // -------------------------------------------------------
  sales: [
    { id: "v01", fecha: "2025-01-12", clienteId: "c01", estado: "Pagada",     items: [{ productoId: "p01", cantidad: 2, precioUnitario: 850000 }] },
    { id: "v02", fecha: "2025-01-25", clienteId: "c03", estado: "Pagada",     items: [{ productoId: "p03", cantidad: 3, precioUnitario: 180000 }] },
    { id: "v03", fecha: "2025-02-04", clienteId: "c02", estado: "Pagada",     items: [{ productoId: "p06", cantidad: 2, precioUnitario: 22000 }, { productoId: "p08", cantidad: 2, precioUnitario: 12000 }] },
    { id: "v04", fecha: "2025-02-18", clienteId: "c05", estado: "Pagada",     items: [{ productoId: "p11", cantidad: 5, precioUnitario: 55000 }] },
    { id: "v05", fecha: "2025-02-27", clienteId: "c04", estado: "Pendiente",  items: [{ productoId: "p14", cantidad: 1, precioUnitario: 48000 }] },
    { id: "v06", fecha: "2025-03-06", clienteId: "c07", estado: "Pagada",     items: [{ productoId: "p02", cantidad: 1, precioUnitario: 780000 }] },
    { id: "v07", fecha: "2025-03-15", clienteId: "c06", estado: "Pagada",     items: [{ productoId: "p18", cantidad: 2, precioUnitario: 98000 }] },
    { id: "v08", fecha: "2025-03-28", clienteId: "c09", estado: "Pagada",     items: [{ productoId: "p16", cantidad: 10, precioUnitario: 6500 }] },
    { id: "v09", fecha: "2025-04-08", clienteId: "c08", estado: "Pagada",     items: [{ productoId: "p09", cantidad: 2, precioUnitario: 65000 }] },
    { id: "v10", fecha: "2025-04-19", clienteId: "c10", estado: "Pagada",     items: [{ productoId: "p17", cantidad: 3, precioUnitario: 145000 }] },
    { id: "v11", fecha: "2025-04-29", clienteId: "c01", estado: "Pagada",     items: [{ productoId: "p04", cantidad: 2, precioUnitario: 320000 }] },
    { id: "v12", fecha: "2025-05-07", clienteId: "c11", estado: "Pagada",     items: [{ productoId: "p15", cantidad: 2, precioUnitario: 35000 }] },
    { id: "v13", fecha: "2025-05-16", clienteId: "c02", estado: "Pagada",     items: [{ productoId: "p13", cantidad: 8, precioUnitario: 9500 }] },
    { id: "v14", fecha: "2025-05-27", clienteId: "c12", estado: "Pagada",     items: [{ productoId: "p10", cantidad: 2, precioUnitario: 38000 }] },
    { id: "v15", fecha: "2025-06-05", clienteId: "c03", estado: "Pagada",     items: [{ productoId: "p11", cantidad: 3, precioUnitario: 55000 }] },
    { id: "v16", fecha: "2025-06-14", clienteId: "c05", estado: "Pagada",     items: [{ productoId: "p01", cantidad: 1, precioUnitario: 850000 }] },
    { id: "v17", fecha: "2025-06-23", clienteId: "c06", estado: "Pendiente",  items: [{ productoId: "p06", cantidad: 3, precioUnitario: 22000 }] },
    { id: "v18", fecha: "2025-07-03", clienteId: "c07", estado: "Pagada",     items: [{ productoId: "p03", cantidad: 2, precioUnitario: 180000 }] },
    { id: "v19", fecha: "2025-07-12", clienteId: "c04", estado: "Pagada",     items: [{ productoId: "p18", cantidad: 1, precioUnitario: 98000 }] },
    { id: "v20", fecha: "2025-07-24", clienteId: "c08", estado: "Pagada",     items: [{ productoId: "p09", cantidad: 1, precioUnitario: 65000 }] },
    { id: "v21", fecha: "2025-08-06", clienteId: "c09", estado: "Pagada",     items: [{ productoId: "p02", cantidad: 1, precioUnitario: 780000 }] },
    { id: "v22", fecha: "2025-08-17", clienteId: "c10", estado: "Pagada",     items: [{ productoId: "p17", cantidad: 2, precioUnitario: 145000 }] },
    { id: "v23", fecha: "2025-08-29", clienteId: "c01", estado: "Pagada",     items: [{ productoId: "p14", cantidad: 2, precioUnitario: 48000 }] },
    { id: "v24", fecha: "2025-09-09", clienteId: "c02", estado: "Pagada",     items: [{ productoId: "p13", cantidad: 12, precioUnitario: 9500 }] },
    { id: "v25", fecha: "2025-09-18", clienteId: "c11", estado: "Pagada",     items: [{ productoId: "p15", cantidad: 3, precioUnitario: 35000 }] },
    { id: "v26", fecha: "2025-09-27", clienteId: "c03", estado: "Pagada",     items: [{ productoId: "p04", cantidad: 1, precioUnitario: 320000 }] },
    { id: "v27", fecha: "2025-10-04", clienteId: "c12", estado: "Pagada",     items: [{ productoId: "p10", cantidad: 1, precioUnitario: 38000 }] },
    { id: "v28", fecha: "2025-10-15", clienteId: "c06", estado: "Pendiente",  items: [{ productoId: "p06", cantidad: 4, precioUnitario: 22000 }] }
  ]

};