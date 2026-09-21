(function () {
  window.VS_APP.initPage("busca");

  const catSelect = document.getElementById("filter-category");
  window.VS_DATA.categories.forEach((c) => {
    catSelect.innerHTML += `<option value="${c.slug}">${VS_UTIL.escapeHtml(c.name)}</option>`;
  });

  const qParam = VS_UTIL.getParam("q") || "";
  const tagParam = VS_UTIL.getParam("tag");
  document.getElementById("search-input").value = tagParam ? tagParam : qParam;

  function runSearch() {
    const q = document.getElementById("search-input").value;
    const filters = {
      category: document.getElementById("filter-category").value,
      type: document.getElementById("filter-type").value,
      sort: document.getElementById("filter-sort").value
    };
    let results = tagParam && !q ? window.VS_DATA.getByTag(tagParam) : window.VS_DATA.search(q, filters);
    if (tagParam && q) results = window.VS_DATA.search(q, filters);
    if (filters.category && tagParam) results = results.filter((a) => a.category === filters.category);

    document.getElementById("results-count").textContent = q || tagParam
      ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para "${q || tagParam}"`
      : `${results.length} publicações no total`;

    document.getElementById("results-list").innerHTML = results.length
      ? results.map(VS_CARD.categoryListItem).join("")
      : `<div class="empty-state"><h3>Nenhum resultado encontrado</h3><p>Tente outras palavras-chave ou remova os filtros aplicados.</p></div>`;
  }

  document.getElementById("search-form").addEventListener("submit", (e) => { e.preventDefault(); runSearch(); });
  document.getElementById("filter-category").addEventListener("change", runSearch);
  document.getElementById("filter-type").addEventListener("change", runSearch);
  document.getElementById("filter-sort").addEventListener("change", runSearch);

  runSearch();
})();
