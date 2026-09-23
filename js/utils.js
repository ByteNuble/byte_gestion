// =========================================================
// utils.js — Funciones utilitarias compartidas
// =========================================================

/**
 * Formatea un número como pesos chilenos.
 * Ej: 1250000 -> "$1.250.000"
 */
function formatCLP(valor) {
  const n = Number(valor) || 0;
  return "$" + n.toLocaleString("es-CL", { maximumFractionDigits: 0 });
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) como DD-MM-YYYY.
 */
function formatFecha(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

/**
 * Devuelve el nombre del mes en español a partir de "YYYY-MM".
 */
function nombreMes(yyyymm) {
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const [y, m] = yyyymm.split("-");
  return meses[Number(m) - 1] + " " + y.slice(2);
}

/**
 * Escapa texto para insertarlo seguro en HTML.
 */
function escapeHTML(txt) {
  return String(txt ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Muestra un toast simple (notificación flotante).
 * tipo: "success" | "error" | "info"
 */
function showToast(mensaje, tipo = "success") {
  let cont = document.getElementById("toast-container");
  if (!cont) {
    cont = document.createElement("div");
    cont.id = "toast-container";
    cont.className = "toast-container";
    document.body.appendChild(cont);
  }

  const t = document.createElement("div");
  t.className = "toast toast-" + tipo;
  t.textContent = mensaje;
  cont.appendChild(t);

  // Forzar reflow para animación
  requestAnimationFrame(() => t.classList.add("visible"));

  setTimeout(() => {
    t.classList.remove("visible");
    setTimeout(() => t.remove(), 250);
  }, 2800);
}

/**
 * Calcula el estado de un producto a partir de su stock.
 * Devuelve { label, clase }.
 */
function estadoProducto(prod) {
  if (prod.stock <= 0) return { label: "Agotado",     clase: "badge-danger" };
  if (prod.stock <= prod.stockMinimo) return { label: "Stock bajo", clase: "badge-warning" };
  return { label: "Disponible", clase: "badge-success" };
}