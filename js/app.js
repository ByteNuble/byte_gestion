// =========================================================
// app.js — Router interno + arranque
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  // 1. Protección de ruta
  if (typeof isLoggedIn === "function" && !isLoggedIn()) {
    window.location.href = "index.html";
    return;
  }

  // 2. Cargar seed si es la primera vez
  seedIfEmpty();

  // 3. Referencias
  const navItems  = document.querySelectorAll(".nav-item[data-view]");
  const views     = document.querySelectorAll(".view");
  const viewTitle = document.getElementById("view-title");
  const viewSub   = document.getElementById("view-subtitle");
  const sidebar   = document.getElementById("sidebar");
  const backdrop  = document.getElementById("sidebar-backdrop");
  const menuBtn   = document.getElementById("menu-btn");
  const logoutBtn = document.getElementById("btn-logout");

  const TITULOS = {
    dashboard:     ["Dashboard",     "Resumen general del negocio"],
    productos:     ["Productos",     "Gestión de productos y stock"],
    clientes:      ["Clientes",      "Gestión de clientes"],
    ventas:        ["Ventas",        "Historial y registro de ventas"],
    reportes:      ["Reportes",      "Business intelligence"],
    configuracion: ["Configuración", "Opciones de la demo"]
  };

  // 4. Cambiar de vista
  function cambiarVista(nombre) {
    navItems.forEach(btn => btn.classList.toggle("active", btn.dataset.view === nombre));
    views.forEach(v => v.classList.toggle("active", v.id === "view-" + nombre));

    const [titulo, subtitulo] = TITULOS[nombre] || ["", ""];
    viewTitle.textContent = titulo;
    viewSub.textContent = subtitulo;

    cerrarSidebar();
    localStorage.setItem("bg_view", nombre);

    // Renderizar según la vista
    if (nombre === "dashboard"     && typeof renderDashboard === "function") renderDashboard();
    if (nombre === "productos"     && typeof renderProductos === "function") renderProductos();
    if (nombre === "clientes"      && typeof renderClientes  === "function") renderClientes();
    if (nombre === "ventas"        && typeof renderVentas    === "function") renderVentas();
    if (nombre === "reportes"      && typeof renderReportes  === "function") renderReportes();
    if (nombre === "configuracion" && typeof renderConfig    === "function") renderConfig();
  }

  navItems.forEach(btn => {
    btn.addEventListener("click", () => cambiarVista(btn.dataset.view));
  });

  // 5. Sidebar móvil
  function abrirSidebar() {
    sidebar.classList.add("open");
    backdrop.classList.add("visible");
  }
  function cerrarSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("visible");
  }
  menuBtn.addEventListener("click", abrirSidebar);
  backdrop.addEventListener("click", cerrarSidebar);

  // 6. Logout
  logoutBtn.addEventListener("click", () => {
    if (confirm("¿Cerrar sesión de la demo?")) {
      logout();
      window.location.href = "index.html";
    }
  });

  // 7. Vista inicial
  const guardada = localStorage.getItem("bg_view");
  cambiarVista(guardada && TITULOS[guardada] ? guardada : "dashboard");
});