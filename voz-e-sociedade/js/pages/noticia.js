(function () {
  const R = "../../";
  const slug = window.VS_UTIL.getParam("slug");
  const article = slug ? window.VS_DATA.getArticleBySlug(slug) : null;

  window.VS_APP.initPage(article ? article.category : null);

  if (!article) {
    document.getElementById("not-found").style.display = "block";
    document.getElementById("breadcrumbs").innerHTML = "";
    return;
  }

  window.VS_UTIL.addToHistory(article.slug);

  const cat = window.VS_DATA.getCategory(article.category) || { name: article.category, color: "var(--ink)" };
  const author = window.VS_DATA.getAuthor(article.authorSlug);
  const url = window.location.href;

  // ---- SEO ----
  document.title = `${article.title} — Voz e Sociedade`;
  document.getElementById("meta-description").setAttribute("content", article.excerpt || article.subtitle || "");
  document.getElementById("canonical").setAttribute("href", url);
  document.getElementById("og-title").setAttribute("content", article.title);
  document.getElementById("og-description").setAttribute("content", article.excerpt || "");
  document.getElementById("ld-json").textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.date,
    "dateModified": article.updatedAt || article.date,
    "author": { "@type": "Person", "name": author ? author.name : "Redação" }
  });

  // ---- Breadcrumbs ----
  document.getElementById("breadcrumbs").innerHTML = `
    <a href="${R}index.html">Início</a><span class="sep">/</span>
    <a href="${R}pages/categoria/index.html?cat=${article.category}">${VS_UTIL.escapeHtml(cat.name)}</a><span class="sep">/</span>
    <span>${VS_UTIL.escapeHtml(article.title)}</span>`;

  // ---- Build TOC from h2 blocks ----
  let h2count = 0;
  const tocItems = [];
  const bodyBlocks = (article.content || []).map((block) => {
    if (block.type === "h2") {
      h2count++;
      const id = `sec-${h2count}`;
      tocItems.push({ id, text: block.text });
      return `<h2 id="${id}">${VS_UTIL.escapeHtml(block.text)}</h2>`;
    }
    if (block.type === "h3") return `<h3>${VS_UTIL.escapeHtml(block.text)}</h3>`;
    if (block.type === "p") return `<p>${VS_UTIL.escapeHtml(block.text)}</p>`;
    if (block.type === "quote") return `<blockquote>${VS_UTIL.escapeHtml(block.text)}</blockquote>`;
    if (block.type === "list") return `<ul>${block.items.map((i) => `<li>${VS_UTIL.escapeHtml(i)}</li>`).join("")}</ul>`;
    if (block.type === "infobox") return `<div class="info-box"><h4>${VS_UTIL.escapeHtml(block.title)}</h4><p>${VS_UTIL.escapeHtml(block.text)}</p></div>`;
    if (block.type === "timeline") {
      return `<div class="timeline">${block.items.map((t) => `
        <div class="timeline-item"><div class="year">${VS_UTIL.escapeHtml(t.year)}</div><p>${VS_UTIL.escapeHtml(t.text)}</p></div>`).join("")}</div>`;
    }
    return "";
  }).join("");

  // ---- Sources block ----
  const sourcesHtml = (article.sources && article.sources.length)
    ? `<div class="sources-block">
        <h4>Fontes</h4>
        <dl>${article.sources.map((s) => `<dt>${VS_UTIL.escapeHtml(s.label)}</dt><dd>${VS_UTIL.escapeHtml(s.detail)}</dd>`).join("")}</dl>
        ${article.originalUrl ? `<p style="margin-top:0.75rem;"><a class="link-underline" href="${article.originalUrl}" target="_blank" rel="noopener">Leia a reportagem original →</a></p>` : ""}
      </div>`
    : "";

  // ---- Entrevista Q&A ----
  const qaHtml = article.type === "entrevista" && article.qa
    ? `<dl class="entrevista-qa">${article.qa.map((qa) => `<dt>${VS_UTIL.escapeHtml(qa.q)}</dt><dd>${VS_UTIL.escapeHtml(qa.a)}</dd>`).join("")}</dl>`
    : "";

  const intervieweeBox = article.type === "entrevista" && article.interviewee
    ? `<div class="info-box">
        <h4>${VS_UTIL.escapeHtml(article.interviewee.name)}</h4>
        <p><strong>${VS_UTIL.escapeHtml(article.interviewee.role)}</strong></p>
        <p>${VS_UTIL.escapeHtml(article.interviewee.bio)}</p>
      </div>`
    : "";

  const opinionDisclaimer = article.type === "opiniao"
    ? `<p class="opinion-disclaimer">Este texto representa a opinião de seu autor e não necessariamente a posição editorial do Voz e Sociedade.</p>`
    : "";

  const editorialDisclaimer = article.type === "editorial"
    ? `<p class="editorial-disclaimer">Editorial — posicionamento institucional da redação do Voz e Sociedade.</p>`
    : "";

  const contentWarningHtml = article.contentWarning
    ? `<div class="content-warning"><strong>Aviso de conteúdo</strong>${VS_UTIL.escapeHtml(article.contentWarning)}</div>`
    : "";

  // ---- Author box ----
  const authorBoxHtml = author ? `
    <div class="author-box">
      <img src="${VS_UTIL.illustration('avatar-' + author.slug, 'opiniao', 128, 128)}" alt="Ilustração de perfil de ${VS_UTIL.escapeHtml(author.name)}">
      <div>
        <p style="font-family:var(--font-headline);font-size:1.1rem;">${VS_UTIL.escapeHtml(author.name)}</p>
        <p class="meta">${VS_UTIL.escapeHtml(author.role)}</p>
        <p style="margin-top:0.5rem;font-size:var(--fs-small);color:var(--ink-soft);">${VS_UTIL.escapeHtml(author.bio)}</p>
        <a class="link-underline meta" href="${R}pages/autor/index.html?nome=${author.slug}">Ver todos os artigos →</a>
      </div>
    </div>` : "";

  // ---- Related ----
  const related = window.VS_DATA.getRelated(article, 3);
  const relatedExplainers = (article.relatedSlugs || [])
    .map((s) => window.VS_DATA.getExplainerBySlug(s))
    .filter(Boolean);
  const explainerLinksHtml = relatedExplainers.length ? `
    <div class="info-box">
      <h4>Entenda mais</h4>
      <ul style="padding-left:1.2rem;list-style:disc;">
        ${relatedExplainers.map((e) => `<li><a class="link-underline" href="${R}pages/entenda/index.html?slug=${e.slug}">${VS_UTIL.escapeHtml(e.title)}</a></li>`).join("")}
      </ul>
    </div>` : "";
  const relatedHtml = related.length ? `
    <section class="container" aria-label="Leia também">
      <div class="section-title" style="--cat-color:${cat.color}"><span>Leia também</span></div>
      <div class="related-grid">${related.map(VS_CARD.articleCard).join("")}</div>
    </section>` : "";

  const eyebrowLabel = article.type === "noticia" ? cat.name : `${window.VS_DATA.typeLabel(article.type)} · ${cat.name}`;

  document.getElementById("article-root").innerHTML = `
    <header class="article-header container" style="--cat-color:${cat.color}">
      <span class="eyebrow" style="--cat-color:${cat.color};font-size:1rem;">${VS_UTIL.escapeHtml(eyebrowLabel)}</span>
      ${VS_CARD.demoFlag(article)}
      <h1>${VS_UTIL.escapeHtml(article.title)}</h1>
      <p class="subtitle">${VS_UTIL.escapeHtml(article.subtitle)}</p>
      <div class="article-byline-row">
        <span class="byline">Por <a href="${R}pages/autor/index.html?nome=${article.authorSlug}">${VS_UTIL.escapeHtml(author ? author.name : "Redação")}</a></span>
        <span class="meta">Publicado em ${VS_UTIL.formatDate(article.date, true)}</span>
        ${article.updatedAt ? `<span class="meta">Atualizado em ${VS_UTIL.formatDate(article.updatedAt, true)}</span>` : ""}
        <span class="meta">${article.readingTime} min de leitura</span>
        <button class="save-btn" id="btn-save" data-slug="${article.slug}">☆ Salvar</button>
      </div>
    </header>

    <div class="container">
      ${contentWarningHtml}
      <figure class="article-figure illustration-figure">
        <span class="badge-illustration">${VS_UTIL.escapeHtml(article.imageType || "Ilustração")}</span>
        <img src="${VS_UTIL.illustration(article.imageSeed, article.category, 1200, 640)}" alt="${VS_UTIL.escapeHtml(article.imageType)}: ${VS_UTIL.escapeHtml(article.title)}">
        <figcaption>
          <span class="image-credit">${VS_UTIL.escapeHtml(article.imageCredit || "Ilustração / Voz e Sociedade")}</span>
          <span class="image-credit">${article.imageLicense ? VS_UTIL.escapeHtml(article.imageLicense) : "Uso interno — conteúdo de demonstração"}</span>
        </figcaption>
      </figure>

      <div class="article-layout">
        <aside class="toc-widget" aria-label="Sumário da reportagem">
          ${tocItems.length ? `
            <h4>Nesta reportagem</h4>
            <ul>${tocItems.map((t) => `<li><a href="#${t.id}">${VS_UTIL.escapeHtml(t.text)}</a></li>`).join("")}</ul>
          ` : ""}
          <div class="reading-controls" style="margin-top:1.5rem;" aria-label="Controles de leitura">
            <button id="font-dec" aria-label="Diminuir texto">A-</button>
            <button id="font-inc" aria-label="Aumentar texto">A+</button>
            <button id="reading-mode" aria-label="Alternar modo leitura">Leitura</button>
          </div>
        </aside>

        <div>
          <div class="article-body" id="article-body">
            ${intervieweeBox}
            ${bodyBlocks}
            ${qaHtml}
          </div>
          ${opinionDisclaimer}
          ${editorialDisclaimer}
          ${explainerLinksHtml}
          ${sourcesHtml}
          ${VS_CARD.shareRow(article.title, url)}
          ${article.tags && article.tags.length ? `<div class="sidebar-tags">${article.tags.map(VS_CARD.tagPill).join("")}</div>` : ""}
          ${authorBoxHtml}
        </div>
      </div>
    </div>

    ${relatedHtml}
  `;

  VS_CARD.bindShareRow();

  // ---- Save button ----
  const saveBtn = document.getElementById("btn-save");
  function refreshSaveBtn() {
    const saved = window.VS_UTIL.isSaved(article.slug);
    saveBtn.classList.toggle("saved", saved);
    saveBtn.textContent = saved ? "★ Salvo" : "☆ Salvar";
  }
  refreshSaveBtn();
  saveBtn.addEventListener("click", () => {
    window.VS_UTIL.toggleSaved(article.slug);
    refreshSaveBtn();
    window.VS_UTIL.toast(window.VS_UTIL.isSaved(article.slug) ? "Artigo salvo." : "Removido dos salvos.");
  });

  // ---- Reading controls ----
  let step = window.VS_UTIL.getFontStep();
  const body = document.getElementById("article-body");
  function applyFontStep() {
    body.style.fontSize = `calc(var(--fs-body) + ${step * 0.1}rem)`;
  }
  applyFontStep();
  document.getElementById("font-inc").addEventListener("click", () => {
    step = Math.min(step + 1, 4);
    window.VS_UTIL.setFontStep(step);
    applyFontStep();
  });
  document.getElementById("font-dec").addEventListener("click", () => {
    step = Math.max(step - 1, -2);
    window.VS_UTIL.setFontStep(step);
    applyFontStep();
  });
  document.getElementById("reading-mode").addEventListener("click", () => {
    body.style.maxWidth = body.style.maxWidth === "56ch" ? "" : "56ch";
  });

  // ---- TOC scroll-spy ----
  const tocLinks = document.querySelectorAll(".toc-widget a");
  if (tocLinks.length) {
    window.addEventListener("scroll", () => {
      let current = null;
      tocItems.forEach((t) => {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < 140) current = t.id;
      });
      tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
    });
  }
})();
