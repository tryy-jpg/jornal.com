(function () {
  window.VS_APP.initPage(null);
  function render() {
    const saved = window.VS_UTIL.getSaved();
    const items = saved.map((s) => window.VS_DATA.getArticleBySlug(s)).filter(Boolean);
    document.getElementById("list-wrap").innerHTML = items.length
      ? `<p class="meta" style="margin-bottom:1rem;">Modo demonstração — artigos salvos apenas neste navegador.</p><div class="category-list">${items.map(VS_CARD.categoryListItem).join("")}</div>`
      : `<div class="empty-state">
          <h3>Você ainda não salvou nenhum artigo</h3>
          <p>Toque em "Salvar" em qualquer matéria para encontrá-la aqui depois. Os artigos salvos ficam guardados apenas neste navegador.</p>
          <a class="btn btn-primary" href="../../index.html">Explorar notícias</a>
        </div>`;
  }
  render();
})();
