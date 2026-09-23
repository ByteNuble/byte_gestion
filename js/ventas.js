// =========================================================
// ventas.js — Registro e historial de ventas
// =========================================================

// Carrito temporal para el formulario
let _carrito = [];

function renderVentas() {
  renderHistorialVentas();
  cargarSelectoresVenta();
  renderCarrito();
}

function renderHistorialVentas() {
  const cont = document.getElementById("ventas-tabla");
  if (!cont) return;

  const ventas = [...getSales()].sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (ventas.length === 0) {
    cont.innerHTML = `<tr><td colspan="6" class="empty">Aún no hay ventas registradas.</td></tr>`;
    return;
  }

  cont.innerHTML = ventas.map(v => {
    const c = getClientById(v.clienteId);
    const productos = v.items.map(it => {
      const p = getProductById(it.productoId);
      return `${p ? p.nombre : "—"} ×${it.cantidad}`;
    }).join(", ");

    const badge = v.estado === "Pagada"
      ? `<span class="badge badge-success">Pagada</span>`
      : `<span class="badge badge-warning">Pendiente</span>`;

    return `
      <tr>
        <td><code>${v.id.slice(-8)}</code></td>
        <td>${formatFecha(v.fecha)}</td>
        <td>${escapeHTML(c ? c.empresa : "—")}</td>
        <td>${escapeHTML(productos)}</td>
        <td>${formatCLP(v.total)}</td>
        <td>${badge}</td>
        <td class="acciones">
          <button class="btn-icon btn-danger" data-del="${v.id}" title="Eliminar">✕</button>
        </td>
      </tr>
    `;
  }).join("");

  cont.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => eliminarVenta(b.dataset.del));
  });
}

function cargarSelectoresVenta() {
  const selCliente = document.getElementById("venta-cliente");
  const selProducto = document.getElementById("venta-producto");

  if (selCliente) {
    selCliente.innerHTML = `<option value="">Seleccionar cliente…</option>` +
      getClients().map(c => `<option value="${c.id}">${escapeHTML(c.empresa)}</option>`).join("");
  }

  if (selProducto) {
    selProducto.innerHTML = `<option value="">Seleccionar producto…</option>` +
      getProducts().map(p => `
        <option value="${p.id}" data-precio="${p.precio}" data-stock="${p.stock}">
          ${escapeHTML(p.nombre)} — ${formatCLP(p.precio)} (stock: ${p.stock})
        </option>
      `).join("");
  }
}

function agregarAlCarrito() {
  const selProd = document.getElementById("venta-producto");
  const inputCant = document.getElementById("venta-cantidad");
  const prodId = selProd.value;
  const cant = Number(inputCant.value);

  if (!prodId) return showToast("Selecciona un producto.", "error");
  if (!cant || cant <= 0) return showToast("Ingresa una cantidad válida.", "error");

  const prod = getProductById(prodId);
  if (!prod) return;

  // Ya en carrito?
  const existente = _carrito.find(i => i.productoId === prodId);
  const cantTotal = (existente ? existente.cantidad : 0) + cant;

  if (cantTotal > prod.stock) {
    return showToast(`Stock insuficiente. Disponible: ${prod.stock}.`, "error");
  }

  if (existente) {
    existente.cantidad = cantTotal;
  } else {
    _carrito.push({
      productoId: prodId,
      nombre: prod.nombre,
      cantidad: cant,
      precioUnitario: prod.precio
    });
  }

  inputCant.value = 1;
  renderCarrito();
}

function renderCarrito() {
  const cont = document.getElementById("carrito-items");
  const totalEl = document.getElementById("carrito-total");
  if (!cont) return;

  if (_carrito.length === 0) {
    cont.innerHTML = `<p class="empty">Sin productos agregados.</p>`;
    if (totalEl) totalEl.textContent = formatCLP(0);
    return;
  }

  cont.innerHTML = _carrito.map(i => `
    <div class="carrito-item">
      <div>
        <p class="carrito-nombre">${escapeHTML(i.nombre)}</p>
        <p class="carrito-meta">${i.cantidad} × ${formatCLP(i.precioUnitario)}</p>
      </div>
      <div class="carrito-right">
        <span class="carrito-subtotal">${formatCLP(i.cantidad * i.precioUnitario)}</span>
        <button class="btn-icon btn-danger" data-quitar="${i.productoId}">✕</button>
      </div>
    </div>
  `).join("");

  cont.querySelectorAll("[data-quitar]").forEach(b => {
    b.addEventListener("click", () => {
      _carrito = _carrito.filter(i => i.productoId !== b.dataset.quitar);
      renderCarrito();
    });
  });

  const total = _carrito.reduce((s, i) => s + i.cantidad * i.precioUnitario, 0);
  if (totalEl) totalEl.textContent = formatCLP(total);
}

function registrarVenta() {
  const clienteId = document.getElementById("venta-cliente").value;
  const estado = document.getElementById("venta-estado").value;

  if (!clienteId) return showToast("Selecciona un cliente.", "error");
  if (_carrito.length === 0) return showToast("Agrega al menos un producto.", "error");

  try {
    addSale({
      clienteId,
      estado,
      items: _carrito.map(i => ({ productoId: i.productoId, cantidad: i.cantidad }))
    });

    _carrito = [];
    document.getElementById("venta-cliente").value = "";
    renderCarrito();
    cargarSelectoresVenta();
    renderHistorialVentas();

    showToast("Venta registrada correctamente.", "success");

    // Actualizar dashboard si está visible
    if (typeof renderDashboard === "function") renderDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
}

function eliminarVenta(id) {
  if (!confirm("¿Eliminar esta venta? El stock será devuelto a los productos.")) return;
  deleteSale(id);
  showToast("Venta eliminada.", "success");
  renderHistorialVentas();
  cargarSelectoresVenta();
  if (typeof renderDashboard === "function") renderDashboard();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnAgregar = document.getElementById("btn-agregar-carrito");
  if (btnAgregar) btnAgregar.addEventListener("click", agregarAlCarrito);

  const btnRegistrar = document.getElementById("btn-registrar-venta");
  if (btnRegistrar) btnRegistrar.addEventListener("click", registrarVenta);
});