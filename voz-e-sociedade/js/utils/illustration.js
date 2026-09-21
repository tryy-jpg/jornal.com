/* Gera ilustrações SVG editoriais como substituto de fotografia real.
   Usadas no lugar de fotos de banco (evita apresentar imagem fictícia
   como registro real de um acontecimento — ver política de direitos
   autorais). O tratamento é duotone + trama de meio-tom + uma faixa
   diagonal na cor da editoria, para criar um elemento de assinatura
   visual reconhecível mesmo sem o logo, em vez de um gradiente
   abstrato genérico. */
window.VS_UTIL = window.VS_UTIL || {};

/* Cada categoria recebe um par duotone (sombra + luz) e a cor de
   assinatura usada na faixa diagonal. */
const VS_ILLO_DUOTONE = {
  feminicidio: { a: "#2a0d12", b: "#7a1f2b", accent: "#c76a5f" },
  misoginia: { a: "#171126", b: "#4b3b6b", accent: "#b6a3e6" },
  racismo: { a: "#241505", b: "#8c5a2b", accent: "#e0ac6a" },
  sociedade: { a: "#0d1a26", b: "#2b4c6b", accent: "#8fbede" },
  politica: { a: "#161d0e", b: "#4f5d3a", accent: "#a9c47f" },
  cultura: { a: "#1f1105", b: "#6b4423", accent: "#d69a5c" },
  dados: { a: "#0a1a24", b: "#29506b", accent: "#7fc0e0" },
  opiniao: { a: "#17150f", b: "#5a5648", accent: "#c9c2a8" },
  editorial: { a: "#000000", b: "#26242a", accent: "#ece9e1" },
  entrevistas: { a: "#0c1a13", b: "#3a5a4a", accent: "#8fd6b4" },
  analises: { a: "#0d1420", b: "#3d4f6b", accent: "#8ea8d6" },
  cartuns: { a: "#1f0d16", b: "#6b3a4f", accent: "#dd9ab8" }
};

function vsHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Ilustração editorial determinística (mesma seed = mesma imagem):
 * fundo duotone diagonal, silhueta geométrica abstrata sugerindo
 * profundidade documental, trama de pontos (meio-tom) sutil e uma
 * faixa diagonal de assinatura na cor da editoria.
 */
window.VS_UTIL.illustration = function (seed, category, w, h) {
  w = w || 800;
  h = h || 600;
  const tone = VS_ILLO_DUOTONE[category] || VS_ILLO_DUOTONE.sociedade;
  const n = vsHash(seed || "voz-e-sociedade");
  const uid = "i" + (n % 100000);

  // Silhuetas abstratas (sugerem figuras/formas documentais sem
  // representar pessoas reais) — polígonos suaves em camadas.
  const shapes = [];
  const layers = 3 + (n % 2);
  for (let i = 0; i < layers; i++) {
    const cx = w * (0.25 + ((n * (i + 3)) % 60) / 100);
    const cy = h * (0.35 + ((n * (i + 5)) % 55) / 100);
    const r = Math.min(w, h) * (0.22 + ((n * (i + 7)) % 18) / 100);
    const skew = ((n * (i + 2)) % 40) - 20;
    const opacity = (0.10 + i * 0.05).toFixed(2);
    shapes.push(
      `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.35}" fill="#000000" opacity="${opacity}" transform="rotate(${skew} ${cx} ${cy})"/>`
    );
  }

  // Trama de meio-tom (halftone) sutil, característica de impressão
  // jornalística — reforça a linguagem editorial em vez de "placeholder digital".
  const dotSpacing = 14;
  let dots = "";
  for (let y = dotSpacing / 2; y < h; y += dotSpacing) {
    for (let x = dotSpacing / 2; x < w; x += dotSpacing) {
      if ((Math.floor(x / dotSpacing) + Math.floor(y / dotSpacing)) % 2 === 0) continue;
      const localN = (n + x * 7 + y * 13) % 100;
      const rad = 0.6 + (localN % 20) / 40;
      dots += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#ffffff" opacity="0.05"/>`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="grad-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${tone.a}"/>
        <stop offset="100%" stop-color="${tone.b}"/>
      </linearGradient>
      <radialGradient id="vig-${uid}" cx="50%" cy="45%" r="75%">
        <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.35"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#grad-${uid})"/>
    ${shapes.join("")}
    <g>${dots}</g>
    <rect width="${w}" height="${h}" fill="url(#vig-${uid})"/>
    <polygon points="${w * 0.68},0 ${w},0 ${w},${h} ${w * 0.82},${h}" fill="${tone.accent}" opacity="0.9"/>
    <polygon points="${w * 0.68},0 ${w * 0.74},0 ${w * 0.88},${h} ${w * 0.82},${h}" fill="${tone.a}" opacity="0.35"/>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
};
