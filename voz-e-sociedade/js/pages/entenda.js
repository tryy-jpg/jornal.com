(function () {
  const R = "../../";
  const slug = window.VS_UTIL.getParam("slug");
  const item = slug ? window.VS_DATA.getExplainerBySlug(slug) : null;
  window.VS_APP.initPage(item ? item.category : null);

  if (!item) {
    document.getElementById("entenda-root").innerHTML = `<div class="empty-state"><h3>Conteúdo não encontrado</h3><a class="btn btn-primary" href="${R}index.html">Voltar ao início</a></div>`;
    return;
  }

  document.title = `${item.title} — Voz e Sociedade`;
  document.getElementById("meta-description").setAttribute("content", item.definition);
  const cat = window.VS_DATA.getCategory(item.category);
  document.getElementById("breadcrumbs").innerHTML = `
    <a href="${R}index.html">Início</a><span class="sep">/</span>
    <a href="${R}pages/categoria/index.html?cat=${item.category}">${VS_UTIL.escapeHtml(cat ? cat.name : item.category)}</a><span class="sep">/</span>
    <span>${VS_UTIL.escapeHtml(item.title)}</span>`;

  document.getElementById("entenda-root").innerHTML = `
    <h1 style="font-family:var(--font-headline);font-size:var(--fs-h1);margin-block:1rem;">${VS_UTIL.escapeHtml(item.title)}</h1>
    <div class="info-box"><h4>Definição</h4><p>${VS_UTIL.escapeHtml(item.definition)}</p></div>
    <h2>Legislação</h2>
    <p>${VS_UTIL.escapeHtml(item.legislation)}</p>
    <h2>Contexto</h2>
    <p>${VS_UTIL.escapeHtml(item.context)}</p>
    <h2>Perguntas frequentes</h2>
    ${item.faqs.map((f) => `
      <details class="faq-item">
        <summary>${VS_UTIL.escapeHtml(f.q)}</summary>
        <p>${VS_UTIL.escapeHtml(f.a)}</p>
      </details>`).join("")}
    <div class="sources-block" style="margin-top:2rem;">
      <h4>Fontes</h4>
      <dl>${item.sources.map((s) => `<dt>${VS_UTIL.escapeHtml(s.label)}</dt><dd>${VS_UTIL.escapeHtml(s.detail)}</dd>`).join("")}</dl>
    </div>`;
})();
