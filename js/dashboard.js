// =========================================================
// dashboard.js — KPIs + gráficos principales
// =========================================================

let _chartVentasMes = null;
let _chartTopProductos = null;

function renderDashboard() {
  const productos = getProducts();
  const clientes  = getClients();
  const ventas    = getSales();

  // ---- KPIs ----
  const ventasTotales = ventas.reduce((s, v) => s + v.total, 0);
  const totalPedidos  = ventas.length;
  const totalClientes = clientes.length;
  const totalProductos = productos.length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= p.stockMinimo).length;

  setText("kpi-ventas", formatCLP(ventasTotales));
  setText("kpi-pedidos", totalPedidos);
  setText("kpi-clientes", totalClientes);
  setText("kpi-productos", totalProductos);
  setText("kpi-stock-bajo", stockBajo);

  // ---- Gráfico: ventas por mes ----
  const porMes = {};
  ventas.forEach(v => {
    const mes = v.fecha.slice(0, 7);
    porMes[mes] = (porMes[mes] || 0) + v.total;
  });
  const meses = Object.keys(porMes).sort();
  const labelsMes = meses.map(nombreMes);
  const dataMes = meses.map(m => porMes[m]);

  const ctx1 = document.getElementById("chart-ventas-mes");
  if (ctx1) {
    if (_chartVentasMes) _chartVentasMes.destroy();
    _chartVentasMes = new Chart(ctx1, {
      type: "line",
      data: {
        labels: labelsMes,
        datasets: [{
          label: "Ventas (CLP)",
          data: dataMes,
          borderColor: "#D62828",
          backgroundColor: "rgba(214,40,40,.08)",
          tension: .35,
          fill: true,
          pointBackgroundColor: "#D62828",
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { callback: v => "$" + (v/1000) + "k" }, grid: { color: "#EEE" } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ---- Gráfico: top 5 productos más vendidos ----
  const unidadesPorProducto = {};
  ventas.forEach(v => {
    v.items.forEach(it => {
      unidadesPorProducto[it.productoId] = (unidadesPorProducto[it.productoId] || 0) + it.cantidad;
    });
  });
  const top = Object.entries(unidadesPorProducto)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, cant]) => {
      const p = getProductById(id);
      return { nombre: p ? p.nombre : "—", cantidad: cant };
    });

  const ctx2 = document.getElementById("chart-top-productos");
  if (ctx2) {
    if (_chartTopProductos) _chartTopProductos.destroy();
    _chartTopProductos = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: top.map(t => t.nombre.length > 18 ? t.nombre.slice(0,18) + "…" : t.nombre),
        datasets: [{
          label: "Unidades vendidas",
          data: top.map(t => t.cantidad),
          backgroundColor: "#D62828",
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "#EEE" } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // ---- Actividad reciente (últimas 5 ventas) ----
  const recientes = [...ventas].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);
  const cont = document.getElementById("actividad-reciente");
  if (cont) {
    if (recientes.length === 0) {
      cont.innerHTML = `<p class="empty">Sin actividad reciente.</p>`;
    } else {
      cont.innerHTML = recientes.map(v => {
        const c = getClientById(v.clienteId);
        return `
          <div class="activity-item">
            <div class="activity-dot"></div>
            <div class="activity-body">
              <p class="activity-title">Venta a ${escapeHTML(c ? c.empresa : "—")}</p>
              <p class="activity-meta">${formatFecha(v.fecha)} · ${formatCLP(v.total)}</p>
            </div>
          </div>
        `;
      }).join("");
    }
  }
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}