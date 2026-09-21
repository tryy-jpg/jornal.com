window.VS_DATA = window.VS_DATA || {};

window.VS_DATA.categories = [
  {
    slug: "feminicidio",
    name: "Feminicídio",
    color: "var(--cat-feminicidio)",
    description: "Cobertura de casos, dados, legislação e políticas públicas relacionadas ao feminicídio no Brasil e no mundo."
  },
  {
    slug: "misoginia",
    name: "Misoginia",
    color: "var(--cat-misoginia)",
    description: "Reportagens e análises sobre discurso de ódio, discriminação e violência de gênero contra mulheres."
  },
  {
    slug: "racismo",
    name: "Racismo",
    color: "var(--cat-racismo)",
    description: "Racismo estrutural, discriminação racial, direitos da população negra e políticas de reparação."
  },
  {
    slug: "sociedade",
    name: "Sociedade",
    color: "var(--cat-sociedade)",
    description: "Desigualdade social, direitos humanos, segurança pública e o cotidiano das comunidades."
  },
  {
    slug: "politica",
    name: "Política",
    color: "var(--cat-politica)",
    description: "Decisões governamentais, legislação e o debate público sobre os temas centrais do jornal."
  },
  {
    slug: "entrevistas",
    name: "Entrevistas",
    color: "var(--cat-entrevista)",
    description: "Conversas com especialistas, pesquisadoras, juristas, ativistas e autoridades."
  },
  {
    slug: "analises",
    name: "Análises",
    color: "var(--cat-analise)",
    description: "Interpretação jornalística baseada em fatos, dados e contexto."
  },
  {
    slug: "opiniao",
    name: "Opinião",
    color: "var(--cat-opiniao)",
    description: "Textos assinados que representam a visão de seus autores, não a posição editorial do jornal."
  },
  {
    slug: "cultura",
    name: "Cultura",
    color: "var(--cat-cultura)",
    description: "Cultura e comportamento em diálogo com os temas sociais cobertos pelo jornal."
  },
  {
    slug: "dados",
    name: "Dados",
    color: "var(--cat-dados)",
    description: "Infográficos e números — sempre com fonte, período e metodologia indicados."
  },
  {
    slug: "cartuns",
    name: "Cartuns & Charges",
    color: "var(--cat-cartum)",
    description: "Conteúdo artístico e opinativo produzido por ilustradores colaboradores."
  },
  {
    slug: "editorial",
    name: "Editorial",
    color: "var(--cat-editorial)",
    description: "Posicionamento institucional da redação do Voz e Sociedade."
  },
  {
    slug: "jogos",
    name: "Jogos",
    color: "var(--ink)",
    description: "Caça-palavras, sudoku e quiz sobre os temas do jornal."
  }
];

window.VS_DATA.getCategory = function (slug) {
  return window.VS_DATA.categories.find((c) => c.slug === slug);
};
