(function () {
  const R = window.VS_UTIL.rootPath();
  const CATS = window.VS_DATA.categories;

  function catUrl(slug) {
    return `${R}pages/categoria/index.html?cat=${slug}`;
  }

  function navLink(label, href, key, activeKey) {
    const active = key === activeKey ? " active" : "";
    return `<a href="${href}" class="${active.trim()}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
  }

  function renderBreaking() {
    const el = document.getElementById("breaking-bar");
    if (!el) return;
    const breaking = (window.VS_DATA.getBreaking) ? window.VS_DATA.getBreaking() : null;
    if (!breaking) { el.style.display = "none"; return; }
    el.innerHTML = `
      <div class="container">
        <span class="breaking-label">Última hora</span>
        <a href="${R}pages/noticia/index.html?slug=${breaking.slug}">${window.VS_UTIL.escapeHtml(breaking.title)}</a>
      </div>`;
  }

  function renderHeader(activeKey) {
    const el = document.getElementById("site-header");
    if (!el) return;
    const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

    el.innerHTML = `
      <div class="container header-top">
        <a href="${R}index.html" class="masthead" aria-label="Voz e Sociedade — página inicial">
          <span class="voz">VOZ</span><span class="e">e</span><span class="voz">SOCIEDADE</span>
        </a>
        <div class="header-date">${today.charAt(0).toUpperCase() + today.slice(1)}</div>
        <div class="header-actions">
          <button class="icon-btn" id="btn-search" aria-label="Abrir busca" aria-expanded="false">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button class="icon-btn" id="btn-theme" aria-label="Alternar modo escuro">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
          <a class="icon-btn" href="${R}pages/salvos/index.html" aria-label="Artigos salvos">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </a>
          <button class="icon-btn mobile-menu-btn" id="btn-mobile-menu" aria-label="Abrir menu">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div class="main-nav-wrap">
        <nav class="container main-nav" aria-label="Navegação principal">
          ${navLink("Início", R + "index.html", "inicio", activeKey)}
          ${navLink("Últimas", catUrl("ultimas"), "ultimas", activeKey)}
          ${navLink("Feminicídio", catUrl("feminicidio"), "feminicidio", activeKey)}
          ${navLink("Racismo", catUrl("racismo"), "racismo", activeKey)}
          ${navLink("Sociedade", catUrl("sociedade"), "sociedade", activeKey)}
          ${navLink("Política", catUrl("politica"), "politica", activeKey)}
          ${navLink("Opinião", R + "pages/opiniao/index.html", "opiniao", activeKey)}
          <div class="nav-dropdown">
            <button class="nav-dropdown-btn${["misoginia", "cultura", "analises", "entrevistas", "cartuns", "dados"].includes(activeKey) ? " active" : ""}" id="btn-editorias" aria-haspopup="true" aria-expanded="false">
              Editorias
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="nav-dropdown-panel" id="editorias-panel">
              ${navLink("Misoginia", catUrl("misoginia"), "misoginia", activeKey)}
              ${navLink("Entrevistas", R + "pages/entrevista/index.html", "entrevistas", activeKey)}
              ${navLink("Análises", R + "pages/analises/index.html", "analises", activeKey)}
              ${navLink("Cultura", catUrl("cultura"), "cultura", activeKey)}
              ${navLink("Dados", catUrl("dados"), "dados", activeKey)}
              ${navLink("Cartuns & charges", R + "pages/cartuns/index.html", "cartuns", activeKey)}
            </div>
          </div>
          ${navLink("Jogos", R + "pages/jogos/index.html", "jogos", activeKey)}
          ${navLink("Mais", R + "pages/institucional/mais.html", "mais", activeKey)}
        </nav>
      </div>
      <div class="search-panel" id="search-panel">
        <form action="${R}pages/busca/index.html" method="get" role="search">
          <input type="search" name="q" placeholder="Buscar notícias, autores, temas…" aria-label="Buscar no Voz e Sociedade" autocomplete="off">
          <button class="btn btn-primary" type="submit">Buscar</button>
          <button type="button" class="icon-btn search-panel-close" id="btn-close-search" aria-label="Fechar busca">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </form>
      </div>
      <div class="mobile-menu-overlay" id="mobile-menu-overlay">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="masthead" style="font-size:1.3rem;"><span class="voz">VOZ</span><span class="e">e</span><span class="voz">SOCIEDADE</span></span>
          <button class="icon-btn close-btn" id="btn-close-mobile" aria-label="Fechar menu">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <nav aria-label="Navegação móvel">
          ${navLink("Início", R + "index.html", "inicio", activeKey)}
          ${navLink("Últimas", catUrl("ultimas"), "ultimas", activeKey)}
          ${navLink("Feminicídio", catUrl("feminicidio"), "feminicidio", activeKey)}
          ${navLink("Racismo", catUrl("racismo"), "racismo", activeKey)}
          ${navLink("Sociedade", catUrl("sociedade"), "sociedade", activeKey)}
          ${navLink("Política", catUrl("politica"), "politica", activeKey)}
          ${navLink("Opinião", R + "pages/opiniao/index.html", "opiniao", activeKey)}
          ${navLink("Jogos", R + "pages/jogos/index.html", "jogos", activeKey)}
        </nav>
        <p class="mobile-menu-subhead">Mais editorias</p>
        <nav aria-label="Editorias secundárias">
          ${navLink("Misoginia", catUrl("misoginia"), "misoginia", activeKey)}
          ${navLink("Entrevistas", R + "pages/entrevista/index.html", "entrevistas", activeKey)}
          ${navLink("Análises", R + "pages/analises/index.html", "analises", activeKey)}
          ${navLink("Cultura", catUrl("cultura"), "cultura", activeKey)}
          ${navLink("Dados", catUrl("dados"), "dados", activeKey)}
          ${navLink("Cartuns & charges", R + "pages/cartuns/index.html", "cartuns", activeKey)}
        </nav>
        <p class="mobile-menu-subhead">Institucional</p>
        <nav aria-label="Institucional">
          ${navLink("Artigos salvos", R + "pages/salvos/index.html", "salvos", activeKey)}
          ${navLink("Lidos recentemente", R + "pages/lidos/index.html", "lidos", activeKey)}
          ${navLink("Mais", R + "pages/institucional/mais.html", "mais", activeKey)}
          ${navLink("Busca", R + "pages/busca/index.html", "busca", activeKey)}
        </nav>
      </div>`;

    document.getElementById("btn-search").addEventListener("click", () => {
      const panel = document.getElementById("search-panel");
      const open = panel.classList.toggle("open");
      document.getElementById("btn-search").setAttribute("aria-expanded", String(open));
      if (open) panel.querySelector("input").focus();
    });
    document.getElementById("btn-close-search").addEventListener("click", () => {
      document.getElementById("search-panel").classList.remove("open");
      document.getElementById("btn-search").setAttribute("aria-expanded", "false");
    });
    document.getElementById("btn-mobile-menu").addEventListener("click", () => {
      document.getElementById("mobile-menu-overlay").classList.add("open");
      document.body.style.overflow = "hidden";
    });
    document.getElementById("btn-close-mobile").addEventListener("click", () => {
      document.getElementById("mobile-menu-overlay").classList.remove("open");
      document.body.style.overflow = "";
    });
    document.getElementById("btn-theme").addEventListener("click", window.VS_UTIL.cycleTheme);

    const editoriasBtn = document.getElementById("btn-editorias");
    const editoriasPanel = document.getElementById("editorias-panel");
    function positionEditoriasPanel() {
      const rect = editoriasBtn.getBoundingClientRect();
      editoriasPanel.style.position = "fixed";
      editoriasPanel.style.top = `${rect.bottom}px`;
      editoriasPanel.style.left = `${rect.left}px`;
    }
    editoriasBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = editoriasPanel.classList.toggle("open");
      if (open) positionEditoriasPanel();
      editoriasBtn.setAttribute("aria-expanded", String(open));
    });
    window.addEventListener("scroll", () => editoriasPanel.classList.remove("open"), { passive: true });
    window.addEventListener("resize", () => editoriasPanel.classList.remove("open"));
    document.addEventListener("click", (e) => {
      if (!editoriasPanel.contains(e.target) && e.target !== editoriasBtn) {
        editoriasPanel.classList.remove("open");
        editoriasBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `
      <div class="container footer-grid">
        <div class="footer-brand">
          <span class="masthead"><span class="voz">VOZ</span><span class="e">e</span><span class="voz">SOCIEDADE</span></span>
          <p>Informação, sociedade e direitos. Jornalismo dedicado à cobertura de feminicídio, racismo, misoginia, direitos humanos e desigualdade social.</p>
          <div class="footer-social">
            <a class="icon-btn" href="#" aria-label="Instagram">IG</a>
            <a class="icon-btn" href="#" aria-label="YouTube">YT</a>
            <a class="icon-btn" href="#" aria-label="X (Twitter)">X</a>
            <a class="icon-btn" href="#" aria-label="Facebook">FB</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Institucional</h4>
          <ul>
            <li><a href="${R}pages/institucional/sobre.html">Sobre nós</a></li>
            <li><a href="${R}pages/institucional/expediente.html">Expediente</a></li>
            <li><a href="${R}pages/institucional/contato.html">Contato</a></li>
            <li><a href="${R}pages/institucional/anuncie.html">Anuncie</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Padrões editoriais</h4>
          <ul>
            <li><a href="${R}pages/institucional/politica-editorial.html">Política editorial</a></li>
            <li><a href="${R}pages/institucional/correcoes.html">Correções</a></li>
            <li><a href="${R}pages/institucional/fontes.html">Fontes</a></li>
            <li><a href="${R}pages/institucional/direitos-autorais.html">Direitos autorais</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Leitor</h4>
          <ul>
            <li><a href="${R}pages/institucional/privacidade.html">Política de privacidade</a></li>
            <li><a href="${R}pages/institucional/termos.html">Termos de uso</a></li>
            <li><a href="${R}index.html#newsletter">Newsletter</a></li>
            <li><a href="${R}pages/busca/index.html">Busca</a></li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© ${new Date().getFullYear()} Voz e Sociedade. Projeto de demonstração — conteúdo fictício.</span>
        <span>Feito para leitura responsável.</span>
      </div>`;
  }

  function initBackToTop() {
    const btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Voltar ao topo");
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`;
    document.body.appendChild(btn);
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 600);
    });
  }

  window.VS_UTIL.cycleTheme = function () {
    const current = document.documentElement.getAttribute("data-theme") || "auto";
    const next = current === "dark" ? "light" : current === "light" ? "auto" : "dark";
    if (next === "auto") {
      document.documentElement.removeAttribute("data-theme");
      window.VS_UTIL.setTheme(null);
      window.VS_UTIL.toast("Modo automático (segue o sistema)");
    } else {
      document.documentElement.setAttribute("data-theme", next);
      window.VS_UTIL.setTheme(next);
      window.VS_UTIL.toast(next === "dark" ? "Modo escuro ativado" : "Modo claro ativado");
    }
  };

  window.VS_CHROME = { renderHeader, renderFooter, renderBreaking, initBackToTop };
})();
