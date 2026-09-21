window.VS_APP = window.VS_APP || {};

window.VS_APP.initPage = function (activeKey) {
  window.VS_CHROME.renderBreaking();
  window.VS_CHROME.renderHeader(activeKey);
  window.VS_CHROME.renderFooter();
  window.VS_CHROME.initBackToTop();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlay = document.getElementById("mobile-menu-overlay");
      if (overlay && overlay.classList.contains("open")) {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }
      const panel = document.getElementById("search-panel");
      if (panel) panel.classList.remove("open");
    }
  });
};
