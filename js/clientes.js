// =========================================================
// clientes.js — CRUD de clientes
// =========================================================

let _filtroCliente = { texto: "" };

function renderClientes() {
  const cont = document.getElementById("clientes-tabla");
  if (!cont) return;

  const ventas = getSales();
  const clientes = getClients().filter(c => {
    const t = _filtroCliente.texto.toLowerCase();
    return !t
      || c.nombre.toLowerCase().includes(t)
      || c.empresa.toLowerCase().includes(t)
      || c.email.toLowerCase().includes(t);
  });

  if (clientes.length === 0) {
    cont.innerHTML = `<tr><td colspan="7" class="empty">No hay clientes que coincidan.</td></tr>`;
    return;
  }

  cont.innerHTML = clientes.map(c => {
    // Calcular total comprado y última compra
    const ventasCliente = ventas.filter(v => v.clienteId === c.id);
    const total = ventasCliente.reduce((s, v) => s + v.total, 0);
    const ultima = ventasCliente.length
      ? ventasCliente.map(v => v.fecha).sort().reverse()[0]
      : null;

    return `
      <tr>
        <td>${escapeHTML(c.nombre)}</td>
        <td>${escapeHTML(c.empresa)}</td>
        <td>${escapeHTML(c.email)}</td>
        <td>${escapeHTML(c.telefono)}</td>
        <td>${formatCLP(total)}</td>
        <td>${ultima ? formatFecha(ultima) : "—"}</td>
        <td class="acciones">
          <button class="btn-icon" data-edit="${c.id}" title="Editar">✎</button>
          <button class="btn-icon btn-danger" data-del="${c.id}" title="Eliminar">✕</button>
        </td>
      </tr>
    `;
  }).join("");

  cont.querySelectorAll("[data-edit]").forEach(b => {
    b.addEventListener("click", () => abrirModalCliente(b.dataset.edit));
  });
  cont.querySelectorAll("[data-del]").forEach(b => {
    b.addEventListener("click", () => eliminarCliente(b.dataset.del));
  });
}

function abrirModalCliente(id = null) {
  const modal = document.getElementById("modal-cliente");
  const form  = document.getElementById("form-cliente");
  const titulo = document.getElementById("modal-cliente-titulo");

  form.reset();
  document.getElementById("cli-id").value = "";

  if (id) {
    const c = getClientById(id);
    if (!c) return;
    titulo.textContent = "Editar cliente";
    document.getElementById("cli-id").value = c.id;
    document.getElementById("cli-nombre").value = c.nombre;
    document.getElementById("cli-empresa").value = c.empresa;
    document.getElementById("cli-email").value = c.email;
    document.getElementById("cli-telefono").value = c.telefono;
  } else {
    titulo.textContent = "Nuevo cliente";
  }

  modal.classList.add("open");
}

function cerrarModalCliente() {
  document.getElementById("modal-cliente").classList.remove("open");
}

function guardarCliente(e) {
  e.preventDefault();
  const id = document.getElementById("cli-id").value;
  const data = {
    nombre: document.getElementById("cli-nombre").value.trim(),
    empresa: document.getElementById("cli-empresa").value.trim(),
    email: document.getElementById("cli-email").value.trim(),
    telefono: document.getElementById("cli-telefono").value.trim()
  };

  if (!data.nombre || !data.empresa || !data.email) {
    showToast("Nombre, empresa y email son obligatorios.", "error");
    return;
  }

  if (id) {
    updateClient(id, data);
    showToast("Cliente actualizado correctamente.", "success");
  } else {
    addClient(data);
    showToast("Cliente agregado correctamente.", "success");
  }

  cerrarModalCliente();
  renderClientes();
}

function eliminarCliente(id) {
  const c = getClientById(id);
  if (!c) return;

  const ventas = getSales().filter(v => v.clienteId === id);
  if (ventas.length > 0) {
    showToast("No se puede eliminar: el cliente tiene ventas registradas.", "error");
    return;
  }

  if (!confirm(`¿Eliminar a "${c.nombre}"?`)) return;
  deleteClient(id);
  showToast("Cliente eliminado.", "success");
  renderClientes();
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-nuevo-cliente");
  if (btn) btn.addEventListener("click", () => abrirModalCliente());

  const form = document.getElementById("form-cliente");
  if (form) form.addEventListener("submit", guardarCliente);

  const btnCancel = document.getElementById("btn-cancelar-cliente");
  if (btnCancel) btnCancel.addEventListener("click", cerrarModalCliente);

  const buscador = document.getElementById("buscar-cliente");
  if (buscador) buscador.addEventListener("input", (e) => {
    _filtroCliente.texto = e.target.value;
    renderClientes();
  });
});