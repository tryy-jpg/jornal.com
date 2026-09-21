window.VS_UTIL = window.VS_UTIL || {};

window.VS_UTIL.getParam = function (name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

window.VS_UTIL.formatDate = function (iso, withTime) {
  if (!iso) return "";
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  if (!withTime) return dateStr;
  const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dateStr} às ${timeStr}`;
};

window.VS_UTIL.timeAgo = function (iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `há ${Math.max(mins, 1)} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days}d`;
  return window.VS_UTIL.formatDate(iso);
};

window.VS_UTIL.hourLabel = function (iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

window.VS_UTIL.escapeHtml = function (str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

/* ---- localStorage helpers (namespaced) ---- */
const VS_LS_PREFIX = "vozesociedade:";

window.VS_UTIL.lsGet = function (key, fallback) {
  try {
    const raw = localStorage.getItem(VS_LS_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

window.VS_UTIL.lsSet = function (key, value) {
  try {
    localStorage.setItem(VS_LS_PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
};

/* ---- Saved articles ---- */
window.VS_UTIL.getSaved = function () {
  return window.VS_UTIL.lsGet("saved", []);
};
window.VS_UTIL.isSaved = function (slug) {
  return window.VS_UTIL.getSaved().includes(slug);
};
window.VS_UTIL.toggleSaved = function (slug) {
  let saved = window.VS_UTIL.getSaved();
  if (saved.includes(slug)) {
    saved = saved.filter((s) => s !== slug);
  } else {
    saved.push(slug);
  }
  window.VS_UTIL.lsSet("saved", saved);
  return saved.includes(slug);
};

/* ---- Reading history ---- */
window.VS_UTIL.addToHistory = function (slug) {
  let history = window.VS_UTIL.lsGet("history", []);
  history = history.filter((s) => s !== slug);
  history.unshift(slug);
  history = history.slice(0, 30);
  window.VS_UTIL.lsSet("history", history);
};
window.VS_UTIL.getHistory = function () {
  return window.VS_UTIL.lsGet("history", []);
};

/* ---- Theme ---- */
window.VS_UTIL.getTheme = function () {
  return window.VS_UTIL.lsGet("theme", null);
};
window.VS_UTIL.setTheme = function (theme) {
  window.VS_UTIL.lsSet("theme", theme);
};

/* ---- Font size (leitura confortável) ---- */
window.VS_UTIL.getFontStep = function () {
  return window.VS_UTIL.lsGet("fontStep", 0);
};
window.VS_UTIL.setFontStep = function (step) {
  window.VS_UTIL.lsSet("fontStep", step);
};

/* ---- Toast ---- */
window.VS_UTIL.toast = function (message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(window._vsToastTimer);
  window._vsToastTimer = setTimeout(() => el.classList.remove("visible"), 2200);
};

/* ---- Path prefix helper: pages live at different depths ---- */
window.VS_UTIL.rootPath = function () {
  const path = window.location.pathname;
  const depth = (path.match(/\/pages\/[^/]+\/[^/]+$/) || path.match(/\/pages\/[^/]+\/$/)) ? 2 : 0;
  return depth === 2 ? "../../" : "./";
};
