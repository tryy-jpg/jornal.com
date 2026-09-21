(function () {
  const R = "../../";
  const catSlug = window.VS_UTIL.getParam("cat") || "sociedade";
  const isUltimas = catSlug === "ultimas";
  const isDados = catSlug === "dados";
  const PAGE_SIZE = 6;
  let page = 1;

  window.VS_APP.initPage(catSlug);

  const cat = isUltimas
    ? { name: "Últimas notícias", color: "var(--signal)", description: "Todas as publicações do Voz e Sociedade, da mais recente à mais antiga." }
    : window.VS_DATA.getCategory(catSlug);

  if (!cat) {
    document.getElementById("category-hero").innerHTML = `<div class="empty-state"><h3>Categoria não encontrada</h3><a class="btn btn-primary" href="${R}index.html">Voltar ao início</a></div>`;
    return;
  }

  document.title = `${cat.name} — Voz e Sociedade`;
  document.getElementById("meta-description").setAttribute("content", cat.description || "");

  document.getElementById("breadcrumbs").innerHTML = `
    <a href="${R}index.html">Início</a><span class="sep">/</span><span>${VS_UTIL.escapeHtml(cat.name)}</span>`;

  document.getElementById("category-hero").style.setProperty("--cat-color", cat.color);
  document.getElementById("category-hero").innerHTML = `
    <span class="eyebrow" style="--cat-color:${cat.color}">Editoria</span>
    <h1>${VS_UTIL.escapeHtml(cat.name)}</h1>
    <p>${VS_UTIL.escapeHtml(cat.description || "")}</p>`;

  if (isDados) {
    renderDadosView();
    return;
  }

  const allItems = isUltimas
    ? window.VS_DATA.search("", { sort: "newest" })
    : window.VS_DATA.getArticlesByCategory(catSlug);

  let currentType = "";
  let currentSort = "newest";

  function getFiltered() {
    let items = allItems;
    if (currentType) items = items.filter((a) => a.type === currentType);
    if (currentSort === "oldest") items = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
    else items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    return items;
  }

  function renderToolbar() {
    document.getElementById("category-toolbar").innerHTML = `
      <span class="meta" id="results-count"></span>
      <div style="display:flex;gap:0.75rem;">
        <select id="filter-type" aria-label="Filtrar por tipo de conteúdo">
          <option value="">Todos os tipos</option>
          <option value="noticia">Notícia</option>
          <option value="reportagem">Reportagem</option>
          <option value="analise">Análise</option>
          <option value="opiniao">Opinião</option>
          <option value="entrevista">Entrevista</option>
          <option value="editorial">Editorial</option>
        </select>
        <select id="filter-sort" aria-label="Ordenar">
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
        </select>
      </div>`;
    document.getElementById("filter-type").addEventListener("change", (e) => { currentType = e.target.value; page = 1; renderList(); });
    document.getElementById("filter-sort").addEventListener("change", (e) => { currentSort = e.target.value; page = 1; renderList(); });
  }

  function renderSidebar() {
    const tags = window.VS_DATA.tags.slice(0, 10);
    const recentAll = window.VS_DATA.getLatest(4);
    const explainer = (window.VS_DATA.explainers || []).find((e) => e.category === catSlug);
    return `
      <aside>
        ${explainer ? `
        <div class="sidebar-widget">
          <h4>Entenda</h4>
          <div class="sidebar-related-item">
            <h5><a href="${R}pages/entenda/index.html?slug=${explainer.slug}">${VS_UTIL.escapeHtml(explainer.title)}</a></h5>
            <p style="font-size:var(--fs-small);color:var(--ink-soft);margin-top:0.35rem;">${VS_UTIL.escapeHtml(explainer.definition)}</p>
          </div>
        </div>` : ""}
        <div class="sidebar-widget">
          <h4>Mais lidas</h4>
          ${recentAll.map(VS_CARD.sidebarRelatedItem).join("")}
        </div>
        <div class="sidebar-widget">
          <h4>Tags</h4>
          <div class="sidebar-tags">${tags.map(VS_CARD.tagPill).join("")}</div>
        </div>
        <div class="sidebar-widget">
          <h4>Sobre esta editoria</h4>
          <p style="font-size:var(--fs-small);color:var(--ink-soft);">${VS_UTIL.escapeHtml(cat.description || "")}</p>
        </div>
      </aside>`;
  }

  function renderList() {
    const filtered = getFiltered();
    document.getElementById("results-count").textContent = `${filtered.length} ${filtered.length === 1 ? "resultado" : "resultados"}`;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    page = Math.min(page, totalPages);
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const listHtml = pageItems.length
      ? `<div class="category-list">${pageItems.map(VS_CARD.categoryListItem).join("")}</div>`
      : `<div class="empty-state"><h3>Nenhum conteúdo encontrado</h3><p>Tente remover os filtros aplicados ou volte para conferir outras editorias.</p></div>`;

    let pagination = "";
    if (totalPages > 1) {
      pagination = `<div class="pagination">${Array.from({ length: totalPages }, (_, i) => i + 1)
        .map((p) => `<button data-page="${p}" class="${p === page ? "active" : ""}">${p}</button>`).join("")}</div>`;
    }

    document.getElementById("list-container").innerHTML = listHtml + pagination;
    document.querySelectorAll(".pagination button").forEach((btn) => {
      btn.addEventListener("click", () => { page = Number(btn.dataset.page); renderList(); window.scrollTo({ top: document.getElementById("list-container").offsetTop - 100, behavior: "smooth" }); });
    });
  }

  document.getElementById("category-body").innerHTML = `<div id="list-container"></div>${renderSidebar()}`;
  renderToolbar();
  renderList();

  function renderDadosView() {
    document.getElementById("category-toolbar").remove?.();
    const stats = window.VS_DATA.dataStats;
    const dataArticles = window.VS_DATA.dataArticles;
    document.getElementById("category-body").innerHTML = `
      <div>
        <div class="data-grid" style="margin-bottom:2.5rem;">
          ${stats.map((s) => `
            <div class="data-stat">
              <div class="num">${VS_UTIL.escapeHtml(s.value)}</div>
              <div class="label">${VS_UTIL.escapeHtml(s.label)}</div>
              <div class="src">${VS_UTIL.escapeHtml(s.note)}</div>
            </div>`).join("")}
        </div>
        <div class="category-list">
          ${dataArticles.map((d) => `
            <div class="category-list-item" style="grid-template-columns:1fr;">
              <div>
                <span class="eyebrow" style="--cat-color:${cat.color}">Dados</span>
                <h3>${VS_UTIL.escapeHtml(d.title)}</h3>
                <p>${VS_UTIL.escapeHtml(d.intro)}</p>
                <div class="sources-block" style="margin-top:1rem;">
                  <h4>Metodologia</h4>
                  <p style="font-size:var(--fs-small);">${VS_UTIL.escapeHtml(d.methodology)}</p>
                  <dl style="margin-top:0.75rem;">${d.sources.map((s) => `<dt>${VS_UTIL.escapeHtml(s.label)}</dt><dd>${VS_UTIL.escapeHtml(s.detail)}</dd>`).join("")}</dl>
                </div>
              </div>
            </div>`).join("")}
        </div>
      </div>
      ${renderSidebar()}`;
  }
})();
