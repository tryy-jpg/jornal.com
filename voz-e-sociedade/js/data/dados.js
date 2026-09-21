window.VS_DATA = window.VS_DATA || {};

/* IMPORTANTE: todos os números abaixo são FICTÍCIOS, criados apenas para
   demonstrar o funcionamento dos componentes de dados/infográfico.
   Nenhum deve ser citado como estatística real. Para dados reais, o
   jornal utilizaria fontes públicas como o Fórum Brasileiro de
   Segurança Pública, IBGE, IPEA e DataSUS, sempre com link e período
   indicados. */
window.VS_DATA.dataStats = [
  {
    id: 1,
    label: "Exemplo ilustrativo de indicador (dado fictício)",
    value: "—",
    note: "Valor fictício de demonstração — não representa um dado real",
    source: "Dado fictício de demonstração",
    period: "—"
  },
  {
    id: 2,
    label: "Exemplo ilustrativo de variação (dado fictício)",
    value: "—",
    note: "Valor fictício de demonstração — não representa um dado real",
    source: "Dado fictício de demonstração",
    period: "—"
  },
  {
    id: 3,
    label: "Exemplo ilustrativo de proporção (dado fictício)",
    value: "—",
    note: "Valor fictício de demonstração — não representa um dado real",
    source: "Dado fictício de demonstração",
    period: "—"
  },
  {
    id: 4,
    label: "Exemplo ilustrativo de contagem (dado fictício)",
    value: "—",
    note: "Valor fictício de demonstração — não representa um dado real",
    source: "Dado fictício de demonstração",
    period: "—"
  }
];

window.VS_DATA.dataArticles = [
  {
    slug: "dados-fictício-feminicidio-2025",
    title: "Como o jornal apresentaria dados sobre feminicídio (modelo de demonstração)",
    category: "dados",
    intro: "Este conteúdo mostra apenas o formato que uma matéria de dados assumiria no Voz e Sociedade — com fonte, período e metodologia sempre visíveis. Nenhum número aqui é real.",
    methodology: "Em uma publicação real, esta seção explicaria a metodologia da fonte original (ex.: como os casos são classificados e contabilizados).",
    sources: [{ label: "Fontes reais recomendadas", detail: "Fórum Brasileiro de Segurança Pública, DataSUS, Sistemas estaduais de segurança pública" }]
  },
  {
    slug: "dados-fictício-desigualdade-racial",
    title: "Como o jornal apresentaria dados sobre desigualdade racial (modelo de demonstração)",
    category: "dados",
    intro: "Modelo de demonstração para matérias de dados sobre desigualdade racial no mercado de trabalho, educação e renda.",
    methodology: "Em uma publicação real, esta seção detalharia a metodologia da pesquisa citada (amostra, período, instituição responsável).",
    sources: [{ label: "Fontes reais recomendadas", detail: "IBGE (PNAD Contínua), IPEA" }]
  }
];
