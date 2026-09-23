// =========================================================
// config.js — Vista de configuración de la demo
// =========================================================

function renderConfig() {
  // Por ahora no hay nada dinámico que renderizar.
  // Los eventos se conectan una sola vez al cargar la página.
}

document.addEventListener("DOMContentLoaded", () => {
  const btnReset = document.getElementById("btn-reset-demo");

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (!confirm("¿Restaurar los datos demo originales? Se perderán los cambios.")) return;

      resetDemo();
      showToast("Datos demo restaurados.", "success");

      // Refrescar la vista actual
      const vista = localStorage.getItem("bg_view") || "dashboard";
      if (vista === "dashboard") renderDashboard();
      if (vista === "productos") renderProductos();
      if (vista === "clientes")  renderClientes();
      if (vista === "ventas")    renderVentas();
      if (vista === "reportes")  renderReportes();
    });
  }
});