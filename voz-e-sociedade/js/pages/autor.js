(function () {
  const R = "../../";
  const slug = window.VS_UTIL.getParam("nome");
  const author = slug ? window.VS_DATA.getAuthor(slug) : null;
  window.VS_APP.initPage(null);

  if (!author) {
    document.getElementById("author-root").innerHTML = `<div class="container"><div class="empty-state"><h3>Autor não encontrado</h3><a class="btn btn-primary" href="${R}index.html">Voltar ao início</a></div></div>`;
    return;
  }

  document.title = `${author.name} — Voz e Sociedade`;
  document.getElementById("breadcrumbs").innerHTML = `<a href="${R}index.html">Início</a><span class="sep">/</span><span>${VS_UTIL.escapeHtml(author.name)}</span>`;

  const items = window.VS_DATA.getByAuthor(author.slug);

  document.getElementById("author-root").innerHTML = `
    <div class="container author-header">
      <img src="${VS_UTIL.illustration('avatar-' + author.slug, 'opiniao', 240, 240)}" alt="Ilustração de perfil de ${VS_UTIL.escapeHtml(author.name)}">
      <div>
        <h1 style="font-family:var(--font-headline);font-size:var(--fs-h1);">${VS_UTIL.escapeHtml(author.name)}</h1>
        <p class="meta" style="font-size:1rem;margin:0.5rem 0;">${VS_UTIL.escapeHtml(author.role)}</p>
        <p style="max-width:60ch;color:var(--ink-soft);">${VS_UTIL.escapeHtml(author.bio)}</p>
      </div>
    </div>
    <div class="container" style="padding-block:2rem;">
      <div class="section-title"><span>Publicações (${items.length})</span></div>
      <div class="category-list">${items.map(VS_CARD.categoryListItem).join("") || "<p>Nenhuma publicação encontrada.</p>"}</div>
    </div>`;
})();
