(function () {
  const R = window.VS_UTIL.rootPath();

  function catColor(catSlug) {
    const cat = window.VS_DATA.getCategory(catSlug);
    return cat ? cat.color : "var(--ink)";
  }

  function catName(catSlug) {
    const cat = window.VS_DATA.getCategory(catSlug);
    return cat ? cat.name : catSlug;
  }

  function articleUrl(article) {
    return `${R}pages/noticia/index.html?slug=${article.slug}`;
  }

  function authorName(slug) {
    const a = window.VS_DATA.getAuthor(slug);
    return a ? a.name : "Redação";
  }

  function eyebrow(article) {
    const label = article.type === "noticia" ? catName(article.category) : window.VS_DATA.typeLabel(article.type) + " · " + catName(article.category);
    return `<span class="eyebrow type-marker is-${article.type}" style="--cat-color:${catColor(article.category)}">${window.VS_UTIL.escapeHtml(label)}</span>`;
  }

  function demoFlag(article) {
    return article.isDemo ? `<span class="demo-flag">Demonstração</span>` : "";
  }

  function articleCard(article) {
    return `
      <article class="article-card">
        <a href="${articleUrl(article)}">
          <img src="${window.VS_UTIL.illustration(article.imageSeed, article.category, 480, 360)}" alt="${window.VS_UTIL.escapeHtml(article.imageType || "Ilustração")}: ${window.VS_UTIL.escapeHtml(article.title)}" loading="lazy">
          ${eyebrow(article)} ${demoFlag(article)}
          <h3>${window.VS_UTIL.escapeHtml(article.title)}</h3>
          <p>${window.VS_UTIL.escapeHtml(article.excerpt)}</p>
        </a>
      </article>`;
  }

  function latestItem(article) {
    return `
      <div class="latest-item">
        <time datetime="${article.date}">${window.VS_UTIL.hourLabel(article.date)}</time>
        <div>
          ${eyebrow(article)}
          <h3><a href="${articleUrl(article)}">${window.VS_UTIL.escapeHtml(article.title)}</a></h3>
          <p>${window.VS_UTIL.escapeHtml(article.excerpt)}</p>
        </div>
      </div>`;
  }

  function categoryListItem(article) {
    return `
      <div class="category-list-item">
        <a href="${articleUrl(article)}"><img src="${window.VS_UTIL.illustration(article.imageSeed, article.category, 400, 300)}" alt="${window.VS_UTIL.escapeHtml(article.imageType || "Ilustração")}" loading="lazy"></a>
        <div>
          ${eyebrow(article)} ${demoFlag(article)}
          <h3><a href="${articleUrl(article)}">${window.VS_UTIL.escapeHtml(article.title)}</a></h3>
          <p>${window.VS_UTIL.escapeHtml(article.excerpt)}</p>
          <p class="meta">${window.VS_UTIL.formatDate(article.date)} · ${window.VS_UTIL.escapeHtml(authorName(article.authorSlug))}</p>
        </div>
      </div>`;
  }

  function opinionCard(article) {
    const author = window.VS_DATA.getAuthor(article.authorSlug);
    return `
      <div class="opinion-card">
        <img class="avatar" src="${window.VS_UTIL.illustration("avatar-" + article.authorSlug, "opiniao", 120, 120)}" alt="Ilustração de perfil de ${window.VS_UTIL.escapeHtml(author ? author.name : "")}">
        <div>
          <p class="author-name">${window.VS_UTIL.escapeHtml(author ? author.name : "")}</p>
          <h3><a href="${articleUrl(article)}">${window.VS_UTIL.escapeHtml(article.title)}</a></h3>
          <p class="meta">${window.VS_UTIL.formatDate(article.date)}</p>
        </div>
      </div>`;
  }

  function sidebarRelatedItem(article) {
    return `
      <div class="sidebar-related-item">
        ${eyebrow(article)}
        <h5><a href="${articleUrl(article)}">${window.VS_UTIL.escapeHtml(article.title)}</a></h5>
      </div>`;
  }

  function tagPill(tag) {
    return `<a class="tag-pill" href="${R}pages/busca/index.html?tag=${encodeURIComponent(tag)}">#${window.VS_UTIL.escapeHtml(tag.replace(/\s+/g, ""))}</a>`;
  }

  function shareRow(title, url) {
    const encTitle = encodeURIComponent(title);
    const encUrl = encodeURIComponent(url);
    return `
      <div class="share-row">
        <a class="btn btn-outline btn-small" target="_blank" rel="noopener" href="https://wa.me/?text=${encTitle}%20${encUrl}">WhatsApp</a>
        <a class="btn btn-outline btn-small" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encUrl}">Facebook</a>
        <a class="btn btn-outline btn-small" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}">X</a>
        <a class="btn btn-outline btn-small" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}">LinkedIn</a>
        <a class="btn btn-outline btn-small" href="mailto:?subject=${encTitle}&body=${encUrl}">E-mail</a>
        <button class="btn btn-outline btn-small" id="btn-copy-link">Copiar link</button>
      </div>`;
  }

  function bindShareRow() {
    const btn = document.getElementById("btn-copy-link");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        window.VS_UTIL.toast("Link copiado.");
      } catch (e) {
        window.VS_UTIL.toast("Não foi possível copiar o link.");
      }
    });
  }

  function rankedItem(article, index) {
    return `
      <div class="ranked-item">
        <span class="rank-num">${index}</span>
        <div>
          ${eyebrow(article)}
          <h5><a href="${articleUrl(article)}">${window.VS_UTIL.escapeHtml(article.title)}</a></h5>
        </div>
      </div>`;
  }

  function focusTag(tag, count) {
    return `<a class="focus-tag" href="${R}pages/busca/index.html?tag=${encodeURIComponent(tag)}">#${window.VS_UTIL.escapeHtml(tag.replace(/\s+/g, ""))} <span class="count">${count}</span></a>`;
  }

  function hcard(article) {
    return `
      <article class="hcard">
        <a href="${articleUrl(article)}"><img src="${window.VS_UTIL.illustration(article.imageSeed, article.category, 480, 360)}" alt="${window.VS_UTIL.escapeHtml(article.imageType || "Ilustração")}" loading="lazy"></a>
        <div>
          ${eyebrow(article)} ${demoFlag(article)}
          <h3><a href="${articleUrl(article)}">${window.VS_UTIL.escapeHtml(article.title)}</a></h3>
          <p>${window.VS_UTIL.escapeHtml(article.excerpt)}</p>
          <p class="meta">${window.VS_UTIL.formatDate(article.date)} · ${window.VS_UTIL.escapeHtml(authorName(article.authorSlug))}</p>
        </div>
      </article>`;
  }

  window.VS_CARD = {
    catColor, catName, articleUrl, authorName, eyebrow, demoFlag,
    articleCard, latestItem, categoryListItem, opinionCard,
    sidebarRelatedItem, tagPill, shareRow, bindShareRow,
    rankedItem, focusTag, hcard
  };
})();
