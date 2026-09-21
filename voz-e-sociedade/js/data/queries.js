window.VS_DATA = window.VS_DATA || {};

window.VS_DATA.getArticleBySlug = function (slug) {
  return window.VS_DATA.articles.find((a) => a.slug === slug);
};

window.VS_DATA.getExplainerBySlug = function (slug) {
  return (window.VS_DATA.explainers || []).find((e) => e.slug === slug);
};

window.VS_DATA.getArticlesByCategory = function (categorySlug, opts) {
  opts = opts || {};
  let list = window.VS_DATA.articles.filter((a) => a.category === categorySlug);
  if (opts.type) list = list.filter((a) => a.type === opts.type);
  if (opts.excludeSlug) list = list.filter((a) => a.slug !== opts.excludeSlug);
  return list.sort((a, b) => new Date(b.date) - new Date(a.date));
};

window.VS_DATA.getArticlesByType = function (type) {
  return window.VS_DATA.articles
    .filter((a) => a.type === type)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

window.VS_DATA.getLatest = function (n) {
  return [...window.VS_DATA.articles]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, n || 8);
};

window.VS_DATA.getBreaking = function () {
  return window.VS_DATA.articles.find((a) => a.breaking);
};

window.VS_DATA.getByTag = function (tag) {
  return window.VS_DATA.articles
    .filter((a) => (a.tags || []).includes(tag))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

window.VS_DATA.getByAuthor = function (authorSlug) {
  return window.VS_DATA.articles
    .filter((a) => a.authorSlug === authorSlug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

window.VS_DATA.getRelated = function (article, n) {
  n = n || 3;
  let related = [];
  if (article.relatedSlugs && article.relatedSlugs.length) {
    related = article.relatedSlugs
      .map((s) => window.VS_DATA.getArticleBySlug(s))
      .filter(Boolean);
  }
  if (related.length < n) {
    const more = window.VS_DATA.articles
      .filter((a) => a.slug !== article.slug && a.category === article.category && !related.includes(a))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    related = related.concat(more).slice(0, n);
  }
  return related.slice(0, n);
};

window.VS_DATA.search = function (query, filters) {
  filters = filters || {};
  const q = (query || "").toLowerCase().trim();
  let results = window.VS_DATA.articles.slice();

  if (q) {
    results = results.filter((a) => {
      const haystack = [a.title, a.subtitle, a.excerpt, (a.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }
  if (filters.category) results = results.filter((a) => a.category === filters.category);
  if (filters.type) results = results.filter((a) => a.type === filters.type);
  if (filters.author) results = results.filter((a) => a.authorSlug === filters.author);

  if (filters.sort === "oldest") {
    results.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return results;
};

window.VS_DATA.typeLabel = function (type) {
  const map = {
    noticia: "Notícia",
    reportagem: "Reportagem",
    analise: "Análise",
    opiniao: "Opinião",
    editorial: "Editorial",
    entrevista: "Entrevista",
    cartum: "Cartum"
  };
  return map[type] || type;
};
