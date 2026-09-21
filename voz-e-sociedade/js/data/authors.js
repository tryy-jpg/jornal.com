window.VS_DATA = window.VS_DATA || {};

window.VS_DATA.authors = [
  {
    slug: "mariana-teles",
    name: "Mariana Teles",
    role: "Repórter especial — Feminicídio e Justiça",
    bio: "Cobre há oito anos casos de violência de gênero e o funcionamento do sistema de justiça. Demonstração — perfil fictício criado para este projeto.",
    social: { instagram: "#", x: "#" }
  },
  {
    slug: "joao-pedro-alencar",
    name: "João Pedro Alencar",
    role: "Editor de Sociedade",
    bio: "Responsável pela pauta de sociedade e direitos humanos. Antes de integrar a redação, trabalhou com jornalismo de dados. Perfil fictício de demonstração.",
    social: { instagram: "#", x: "#" }
  },
  {
    slug: "carla-nascimento",
    name: "Carla Nascimento",
    role: "Repórter — Racismo e Igualdade Racial",
    bio: "Escreve sobre racismo estrutural, políticas de ação afirmativa e movimentos sociais negros. Perfil fictício de demonstração.",
    social: { instagram: "#", x: "#" }
  },
  {
    slug: "renato-vieira",
    name: "Renato Vieira",
    role: "Analista político",
    bio: "Assina a coluna de análise política do jornal, com foco em legislação e políticas públicas ligadas aos temas sociais. Perfil fictício de demonstração.",
    social: { instagram: "#", x: "#" }
  },
  {
    slug: "beatriz-lemos",
    name: "Beatriz Lemos",
    role: "Editora-chefe",
    bio: "Jornalista com passagem por veículos regionais e nacionais, à frente da linha editorial do Voz e Sociedade. Perfil fictício de demonstração.",
    social: { instagram: "#", x: "#" }
  },
  {
    slug: "diego-farias",
    name: "Diego Farias",
    role: "Repórter de Dados",
    bio: "Produz infográficos e reportagens baseadas em dados públicos e pesquisas acadêmicas. Perfil fictício de demonstração.",
    social: { instagram: "#", x: "#" }
  }
];

window.VS_DATA.getAuthor = function (slug) {
  return window.VS_DATA.authors.find((a) => a.slug === slug);
};
