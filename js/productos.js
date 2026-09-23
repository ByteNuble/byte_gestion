// =========================================================
// productos.js — CRUD de productos
// =========================================================

let _filtroProducto = { texto: "", categoria: "", estado: "" };

function renderProductos() {
  const cont = document.getElementById("productos-tabla");
  if (!cont) return;

  // Llenar filtro de categorías (solo una vez)
  const selCat = document.getElementById("filtro-categoria");
  if (selCat && selCat.options.length <= 1) {
    const cats = [...new Set(getProducts().map(p => p.categoria))].sort();
    cats.forEach(c => {
      const o = document.createElement("option");
      o.value = c; o.textContent = c;
      selCat.appendChild(o);
    });
  }

  const productos = getProducts().filter(p => {
    const t = _filtroProducto.texto.toLowerCase();
    const matchTexto = !t || p.nombre.toLowerCase().includes(t) || p.categoria.toLowerCase().includes(t);
    const matchCat = !_filtroProducto.categoria || p.categoria === _filtroProducto.categoria;
    const est = estadoProducto(p).label;
    const matchEst = !_filtroProducto.estado || est === _filtroProducto.estado;
    return matchTexto && matchCat && matchEst;
  });

  if (productos.length === 0) {
    cont.innerHTML = `<tr><td colspan="6" class="empty">No hay productos que coincidan.</td></tr>`;
    return;
  }

  cont.innerHTML = productos.map(p => {
    const est = estadoProducto(p);
    return `
      <tr>
        <td>${escapeHTML(p.nombre)}</td>
        <td>${escapeHTML(p.categoria)}</td>
        <td>${formatCLP(p.precio)}</td>
        <td>${p.stock}</td>
        <td><span class="badge ${est.clase}">${est.label}</span></td>
        <td class="acciones">
          <button class="btn-icon" data-edit="${p.id}" title="Editar">✎</button>
          <button class="btn-icon btn-danger" data-del="${p.id}" title="Eliminar">✕</button>
        </td>
      </tr>
    `;
  }).join("");

  // Eventos de acciones
  cont.querySelectorAll("[data-edit]").forEach(b => {
    b.addEventListener("click", () => abrirModalProducto(b.dataset.edit));
  });
  cont.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => eliminarProducto(b.dataset.del));
  });
}

function abrirModalProducto(id = null) {
  const modal = document.getElementById("modal-producto");
  const form  = document.getElementById("form-producto");
  const titulo = document.getElementById("modal-producto-titulo");

  form.reset();
  document.getElementById("prod-id").value = "";

  if (id) {
    const p = getProductById(id);
    if (!p) return;
    titulo.textContent = "Editar producto";
    document.getElementById("prod-id").value = p.id;
    document.getElementById("prod-nombre").value = p.nombre;
    document.getElementById("prod-categoria").value = p.categoria;
    document.getElementById("prod-precio").value = p.precio;
    document.getElementById("prod-stock").value = p.stock;
    document.getElementById("prod-stock-min").value = p.stockMinimo;
  } else {
    titulo.textContent = "Nuevo producto";
    document.getElementById("prod-stock-min").value = 3;
  }

  modal.classList.add("open");
}

function cerrarModalProducto() {
  document.getElementById("modal-producto").classList.remove("open");
}

function guardarProducto(e) {
  e.preventDefault();
  const id = document.getElementById("prod-id").value;
  const data = {
    nombre: document.getElementById("prod-nombre").value.trim(),
    categoria: document.getElementById("prod-categoria").value.trim(),
    precio: Number(document.getElementById("prod-precio").value),
    stock: Number(document.getElementById("prod-stock").value),
    stockMinimo: Number(document.getElementById("prod-stock-min").value)
  };

  if (!data.nombre || !data.categoria || data.precio < 0 || data.stock < 0) {
    showToast("Completa todos los campos correctamente.", "error");
    return;
  }

  if (id) {
    updateProduct(id, data);
    showToast("Producto actualizado correctamente.", "success");
  } else {
    addProduct(data);
    showToast("Producto agregado correctamente.", "success");
  }

  cerrarModalProducto();
  renderProductos();
}

function eliminarProducto(id) {
  const p = getProductById(id);
  if (!p) return;
  if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;

  deleteProduct(id);
  showToast("Producto eliminado.", "success");
  renderProductos();
}

// Conectar eventos una sola vez
document.addEventListener("DOMContentLoaded", () => {
  const btnNuevo = document.getElementById("btn-nuevo-producto");
  if (btnNuevo) btnNuevo.addEventListener("click", () => abrirModalProducto());

  const form = document.getElementById("form-producto");
  if (form) form.addEventListener("submit", guardarProducto);

  const btnCancel = document.getElementById("btn-cancelar-producto");
  if (btnCancel) btnCancel.addEventListener("click", cerrarModalProducto);

  const buscador = document.getElementById("buscar-producto");
  if (buscador) buscador.addEventListener("input", (e) => {
    _filtroProducto.texto = e.target.value;
    renderProductos();
  });

  const selCat = document.getElementById("filtro-categoria");
  if (selCat) selCat.addEventListener("change", (e) => {
    _filtroProducto.categoria = e.target.value;
    renderProductos();
  });

  const selEst = document.getElementById("filtro-estado");
  if (selEst) selEst.addEventListener("change", (e) => {
    _filtroProducto.estado = e.target.value;
    renderProductos();
  });
});