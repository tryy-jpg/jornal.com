(function () {
  window.VS_APP.initPage("cartuns");
  const select = document.getElementById("filter-cat");
  const cats = [...new Set(window.VS_DATA.cartuns.map((c) => c.category))];
  select.innerHTML = `<option value="">Todos os temas</option>` + cats.map((c) => {
    const cat = window.VS_DATA.getCategory(c);
    return `<option value="${c}">${VS_UTIL.escapeHtml(cat ? cat.name : c)}</option>`;
  }).join("");

  function render(filter) {
    const items = filter ? window.VS_DATA.cartuns.filter((c) => c.category === filter) : window.VS_DATA.cartuns;
    document.getElementById("cartum-grid").innerHTML = items.map((c) => `
      <figure class="cartum-card">
        <img src="${VS_UTIL.illustration(c.imageSeed, c.category, 480, 360)}" alt="Cartum fictício: ${VS_UTIL.escapeHtml(c.title)}" loading="lazy">
        <figcaption>
          <strong>${VS_UTIL.escapeHtml(c.title)}</strong><br>
          ${VS_UTIL.escapeHtml(c.caption)}<br>
          <span class="meta">${VS_UTIL.escapeHtml(c.artist)} · ${VS_UTIL.formatDate(c.date)}</span><br>
          <span class="meta">${VS_UTIL.escapeHtml(c.license)}</span>
        </figcaption>
      </figure>`).join("") || `<div class="empty-state"><h3>Nenhum cartum encontrado</h3></div>`;
  }
  select.addEventListener("change", (e) => render(e.target.value));
  render("");
})();
