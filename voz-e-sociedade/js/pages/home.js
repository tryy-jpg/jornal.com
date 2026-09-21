(function () {
  window.VS_APP.initPage("inicio");
  const R = window.VS_UTIL.rootPath();

  function renderTicker() {
    const el = document.getElementById("home-ticker");
    const items = window.VS_DATA.getLatest(5);
    el.innerHTML = `
      <div class="container">
        <span class="ticker-label">Agora na redação</span>
        ${items.map((a, i) => `
          ${i > 0 ? '<span class="ticker-sep">·</span>' : ""}
          <span class="ticker-item">
            <time>${VS_UTIL.hourLabel(a.date)}</time>
            <a href="${VS_CARD.articleUrl(a)}">${VS_UTIL.escapeHtml(a.title)}</a>
          </span>`).join("")}
      </div>`;
  }

  function renderHero() {
    const el = document.getElementById("home-hero");
    const main = window.VS_DATA.getLatest(1)[0];
    const side = window.VS_DATA.getLatest(4).slice(1, 4);
    el.innerHTML = `
      <div class="container hero-grid">
        <div class="hero-main">
          <a href="${VS_CARD.articleUrl(main)}">
            <img src="${VS_UTIL.illustration(main.imageSeed, main.category, 900, 500)}" alt="${VS_UTIL.escapeHtml(main.imageType)}: ${VS_UTIL.escapeHtml(main.title)}">
          </a>
          ${VS_CARD.eyebrow(main)} ${VS_CARD.demoFlag(main)}
          <h1><a href="${VS_CARD.articleUrl(main)}">${VS_UTIL.escapeHtml(main.title)}</a></h1>
          <p class="lede">${VS_UTIL.escapeHtml(main.subtitle)}</p>
          <p class="meta">${VS_UTIL.formatDate(main.date)} · Por <a class="link-underline" href="${R}pages/autor/index.html?nome=${main.authorSlug}">${VS_UTIL.escapeHtml(VS_CARD.authorName(main.authorSlug))}</a></p>
        </div>
        <div class="hero-side">
          ${side.map((a) => `
            <div class="hero-side-item">
              ${VS_CARD.eyebrow(a)}
              <h3><a href="${VS_CARD.articleUrl(a)}">${VS_UTIL.escapeHtml(a.title)}</a></h3>
              <p class="meta">${VS_UTIL.formatDate(a.date)}</p>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function renderMaisLidas() {
    const el = document.getElementById("home-mais-lidas");
    // Sem analytics real neste projeto de demonstração: usamos uma seleção
    // editorial fixa (reportagens e análises) para ilustrar o componente.
    const items = [
      ...window.VS_DATA.getArticlesByType("reportagem"),
      ...window.VS_DATA.getArticlesByType("analise")
    ].slice(0, 5);
    el.innerHTML = items.map((a, i) => VS_CARD.rankedItem(a, i + 1)).join("");
  }

  function renderLatest() {
    const el = document.getElementById("home-latest");
    const items = window.VS_DATA.getLatest(6);
    el.innerHTML = items.map(VS_CARD.latestItem).join("");
  }

  function renderTopic(catSlug, containerId) {
    const el = document.getElementById(containerId);
    const cat = window.VS_DATA.getCategory(catSlug);
    const items = window.VS_DATA.getArticlesByCategory(catSlug).slice(0, 4);
    if (!items.length) { el.style.display = "none"; return; }
    const [feature, ...rest] = items;
    el.innerHTML = `
      <div class="section-title" style="--cat-color:${cat.color}">
        <span>${cat.name}</span>
        <a class="ver-tudo link-underline" href="${R}pages/categoria/index.html?cat=${catSlug}">Ver tudo</a>
      </div>
      <div class="topic-grid">
        <div class="topic-feature">
          <a href="${VS_CARD.articleUrl(feature)}"><img src="${VS_UTIL.illustration(feature.imageSeed, feature.category, 700, 500)}" alt="${VS_UTIL.escapeHtml(feature.imageType)}"></a>
          ${VS_CARD.eyebrow(feature)} ${VS_CARD.demoFlag(feature)}
          <h3><a href="${VS_CARD.articleUrl(feature)}">${VS_UTIL.escapeHtml(feature.title)}</a></h3>
          <p class="meta">${VS_UTIL.formatDate(feature.date)}</p>
        </div>
        <div class="topic-side-list">
          ${rest.map((a) => `
            <div class="topic-side-item">
              ${VS_CARD.eyebrow(a)}
              <h4><a href="${VS_CARD.articleUrl(a)}">${VS_UTIL.escapeHtml(a.title)}</a></h4>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function renderInvestigacoes() {
    const el = document.getElementById("home-investigacoes");
    const items = window.VS_DATA.getArticlesByType("reportagem").slice(0, 3);
    el.innerHTML = items.map((a) => `
      <div class="investig-card">
        <a href="${VS_CARD.articleUrl(a)}"><img src="${VS_UTIL.illustration(a.imageSeed, a.category, 500, 340)}" alt="${VS_UTIL.escapeHtml(a.imageType)}"></a>
        ${VS_CARD.eyebrow(a)}
        <h3><a href="${VS_CARD.articleUrl(a)}" style="color:inherit;">${VS_UTIL.escapeHtml(a.title)}</a></h3>
        <p>${VS_UTIL.escapeHtml(a.excerpt)}</p>
      </div>`).join("");
  }

  function renderAnalises() {
    document.getElementById("home-analises").innerHTML =
      window.VS_DATA.getArticlesByType("analise").slice(0, 3).map(VS_CARD.hcard).join("");
  }

  function renderOpiniao() {
    document.getElementById("home-opiniao").innerHTML =
      window.VS_DATA.getArticlesByType("opiniao").slice(0, 3).map(VS_CARD.opinionCard).join("");
  }

  function renderEntrevistas() {
    document.getElementById("home-entrevistas").innerHTML =
      window.VS_DATA.getArticlesByType("entrevista").slice(0, 3).map(VS_CARD.articleCard).join("");
  }

  function renderCartuns() {
    const el = document.getElementById("home-cartuns");
    const items = window.VS_DATA.cartuns.slice(0, 3);
    el.innerHTML = items.map((c) => `
      <figure class="cartum-card">
        <img src="${VS_UTIL.illustration(c.imageSeed, c.category, 480, 360)}" alt="Cartum fictício: ${VS_UTIL.escapeHtml(c.title)}" loading="lazy">
        <figcaption><strong>${VS_UTIL.escapeHtml(c.title)}</strong><br>${VS_UTIL.escapeHtml(c.caption)}</figcaption>
      </figure>`).join("");
  }

  function renderDados() {
    const el = document.getElementById("home-dados");
    el.innerHTML = window.VS_DATA.dataStats.map((s) => `
      <div class="data-stat">
        <div class="num">${VS_UTIL.escapeHtml(s.value)}</div>
        <div class="label">${VS_UTIL.escapeHtml(s.label)}</div>
        <div class="src">${VS_UTIL.escapeHtml(s.source)} — ${VS_UTIL.escapeHtml(s.period)}</div>
      </div>`).join("");
  }

  function renderFocusTags() {
    const el = document.getElementById("home-focus");
    const counts = {};
    window.VS_DATA.articles.forEach((a) => (a.tags || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    el.innerHTML = top.map(([tag, count]) => VS_CARD.focusTag(tag, count)).join("");
  }

  renderTicker();
  renderHero();
  renderMaisLidas();
  renderLatest();
  renderTopic("feminicidio", "topic-feminicidio");
  renderTopic("racismo", "topic-racismo");
  renderTopic("misoginia", "topic-misoginia");
  renderTopic("sociedade", "topic-sociedade");
  renderTopic("politica", "topic-politica");
  renderInvestigacoes();
  renderAnalises();
  renderOpiniao();
  renderEntrevistas();
  renderFocusTags();
  renderCartuns();
  renderDados();

  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.VS_UTIL.toast("Inscrição simulada com sucesso (modo de demonstração).");
      newsletterForm.reset();
    });
  }
})();
