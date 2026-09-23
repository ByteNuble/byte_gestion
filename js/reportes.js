// =========================================================
// reportes.js — Business Intelligence
// =========================================================

let _chartCat = null;
let _chartEvolucion = null;
let _chartStock = null;

function renderReportes() {
  const ventas = getSales();
  const productos = getProducts();

  // KPIs
  const totalVentas = ventas.reduce((s, v) => s + v.total, 0);
  const ticket = ventas.length ? totalVentas / ventas.length : 0;
  const unidadesVendidas = ventas.reduce((s, v) => s + v.items.reduce((a, it) => a + it.cantidad, 0), 0);

  setText("rep-ventas-total", formatCLP(totalVentas));
  setText("rep-ticket-promedio", formatCLP(ticket));
  setText("rep-unidades", unidadesVendidas);
  setText("rep-ventas-cantidad", ventas.length);

  // ---- Ventas por categoría ----
  const porCat = {};
  ventas.forEach(v => {
    v.items.forEach(it => {
      const p = getProductById(it.productoId);
      if (!p) return;
      const cat = p.categoria;
      porCat[cat] = (porCat[cat] || 0) + it.cantidad * it.precioUnitario;
    });
  });

  const ctxCat = document.getElementById("chart-categoria");
  if (ctxCat) {
    if (_chartCat) _chartCat.destroy();
    _chartCat = new Chart(ctxCat, {
      type: "doughnut",
      data: {
        labels: Object.keys(porCat),
        datasets: [{
          data: Object.values(porCat),
          backgroundColor: ["#D62828", "#1A1A1A", "#8A8A8A", "#E5A0A0", "#B71F1F", "#4A4A4A"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } }
        }
      }
    });
  }

  // ---- Evolución de ventas (últimos 12 meses) ----
  const porMes = {};
  ventas.forEach(v => {
    const mes = v.fecha.slice(0, 7);
    porMes[mes] = (porMes[mes] || 0) + v.total;
  });
  const meses = Object.keys(porMes).sort();

  const ctxEv = document.getElementById("chart-evolucion");
  if (ctxEv) {
    if (_chartEvolucion) _chartEvolucion.destroy();
    _chartEvolucion = new Chart(ctxEv, {
      type: "line",
      data: {
        labels: meses.map(nombreMes),
        datasets: [{
          label: "Ventas (CLP)",
          data: meses.map(m => porMes[m]),
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

  // ---- Stock por categoría (unidades disponibles) ----
  const stockPorCat = {};
  productos.forEach(p => {
    stockPorCat[p.categoria] = (stockPorCat[p.categoria] || 0) + p.stock;
  });

  const ctxSt = document.getElementById("chart-stock");
  if (ctxSt) {
    if (_chartStock) _chartStock.destroy();
    _chartStock = new Chart(ctxSt, {
      type: "bar",
      data: {
        labels: Object.keys(stockPorCat),
        datasets: [{
          label: "Unidades en stock",
          data: Object.values(stockPorCat),
          backgroundColor: "#1A1A1A",
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "#EEE" } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ---- Top 5 clientes ----
  const porCliente = {};
  ventas.forEach(v => {
    porCliente[v.clienteId] = (porCliente[v.clienteId] || 0) + v.total;
  });
  const topClientes = Object.entries(porCliente)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const contTop = document.getElementById("top-clientes");
  if (contTop) {
    contTop.innerHTML = topClientes.map(([id, total], i) => {
      const c = getClientById(id);
      return `
        <div class="rank-item">
          <span class="rank-num">${i + 1}</span>
          <div class="rank-body">
            <p class="rank-title">${escapeHTML(c ? c.empresa : "—")}</p>
            <p class="rank-meta">${escapeHTML(c ? c.nombre : "")}</p>
          </div>
          <span class="rank-value">${formatCLP(total)}</span>
        </div>
      `;
    }).join("") || `<p class="empty">Sin datos.</p>`;
  }
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}