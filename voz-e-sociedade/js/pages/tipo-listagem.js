(function () {
  const R = "../../";
  const type = window.VS_LISTING_TYPE;
  const labels = {
    opiniao: { title: "Opinião", desc: "Textos assinados que representam a visão de seus autores, não a posição editorial do Voz e Sociedade.", color: "var(--cat-opiniao)" },
    analise: { title: "Análises", desc: "Interpretação jornalística baseada em fatos, dados e contexto — sempre separada de opinião pessoal.", color: "var(--cat-analise)" },
    entrevista: { title: "Entrevistas", desc: "Conversas com especialistas, pesquisadoras, juristas, ativistas e autoridades.", color: "var(--cat-entrevista)" }
  };
  const info = labels[type];

  window.VS_APP.initPage(type === "opiniao" ? "opiniao" : type === "analise" ? "analises" : "entrevistas");

  document.title = `${info.title} — Voz e Sociedade`;
  document.getElementById("meta-description").setAttribute("content", info.desc);
  document.getElementById("breadcrumbs").innerHTML = `<a href="${R}index.html">Início</a><span class="sep">/</span><span>${info.title}</span>`;
  document.getElementById("category-hero").style.setProperty("--cat-color", info.color);
  document.getElementById("category-hero").innerHTML = `
    <span class="eyebrow" style="--cat-color:${info.color}">Editoria</span>
    <h1>${info.title}</h1>
    <p>${info.desc}</p>`;

  const items = window.VS_DATA.getArticlesByType(type);

  document.getElementById("category-body").innerHTML = `
    <div>
      <p class="meta" style="margin-bottom:1rem;">${items.length} ${items.length === 1 ? "publicação" : "publicações"}</p>
      <div class="category-list">${items.map(VS_CARD.categoryListItem).join("")}</div>
    </div>
    <aside>
      <div class="sidebar-widget">
        <h4>Autores</h4>
        ${[...new Set(items.map((i) => i.authorSlug))].map((slug) => {
          const a = window.VS_DATA.getAuthor(slug);
          return a ? `<div class="sidebar-related-item"><h5><a href="${R}pages/autor/index.html?nome=${slug}">${VS_UTIL.escapeHtml(a.name)}</a></h5><p class="meta">${VS_UTIL.escapeHtml(a.role)}</p></div>` : "";
        }).join("")}
      </div>
    </aside>`;
})();
