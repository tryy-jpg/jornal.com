window.VS_DATA = window.VS_DATA || {};

window.VS_DATA.tags = [
  "Feminicídio",
  "Violência contra a mulher",
  "Racismo",
  "Racismo estrutural",
  "Misoginia",
  "Direitos humanos",
  "Justiça",
  "Segurança pública",
  "Política",
  "Mulheres",
  "População negra",
  "Legislação",
  "Dados públicos",
  "Educação"
];

window.VS_DATA.slugifyTag = function (tag) {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
};
