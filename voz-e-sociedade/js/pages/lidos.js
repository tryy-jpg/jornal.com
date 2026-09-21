(function () {
  window.VS_APP.initPage(null);
  function render() {
    const history = window.VS_UTIL.getHistory();
    const items = history.map((s) => window.VS_DATA.getArticleBySlug(s)).filter(Boolean);
    document.getElementById("list-wrap").innerHTML = items.length
      ? `<p class="meta" style="margin-bottom:1rem;">Modo demonstração — histórico guardado apenas neste navegador.</p><div class="category-list">${items.map(VS_CARD.categoryListItem).join("")}</div>`
      : `<div class="empty-state">
          <h3>Nenhum artigo lido recentemente</h3>
          <p>As matérias que você abrir aparecerão aqui para facilitar sua volta a elas depois.</p>
          <a class="btn btn-primary" href="../../index.html">Explorar notícias</a>
        </div>`;
  }
  render();
})();
