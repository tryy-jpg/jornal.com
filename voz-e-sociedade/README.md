# Voz e Sociedade

Jornal digital de demonstração dedicado à cobertura de feminicídio, violência
contra a mulher, misoginia, racismo, racismo estrutural, direitos humanos e
desigualdade social.

> **Importante:** todo o conteúdo editorial deste projeto (notícias,
> reportagens, análises, opiniões, entrevistas, dados e cartuns) é
> **fictício** e foi criado apenas para demonstrar a arquitetura e o
> funcionamento do portal. Nenhum nome, caso, número ou declaração aqui
> corresponde a uma pessoa ou acontecimento real. Isso está identificado ao
> longo do site com a etiqueta "Demonstração" e avisos explícitos no próprio
> texto.

## Stack

Este projeto é um **site estático em HTML, CSS e JavaScript puro** — sem
framework (não é React, Vue ou Next.js) e sem bundler (não é Vite, Webpack
etc.). Todas as páginas são arquivos `.html` reais; o conteúdo editorial é
montado no navegador a partir de dados em `js/data/*.js`.

Essa escolha é intencional: o projeto não usa nenhum recurso que exigisse um
framework, e mantê-lo estático significa zero dependências de runtime, zero
tempo de build real e compatibilidade nativa com qualquer hospedagem
estática — incluindo a Vercel, que serve HTML/CSS/JS puro sem nenhuma
configuração especial.

O único uso de `package.json`/`node_modules` neste projeto é para
**ferramentas de desenvolvimento local** (servidor local e um script de
verificação). Nada disso é necessário para o site funcionar em produção.

## Pré-requisitos

- Node.js 18 ou superior (apenas para os comandos `npm` abaixo — o site em
  si não depende de Node em produção).

## Instalação

```bash
npm install
```

Isso instala apenas uma dependência de desenvolvimento: o pacote `serve`
(mantido pela própria Vercel), usado para servir os arquivos localmente.

## Desenvolvimento

```bash
npm run dev
```

Sobe um servidor local em `http://localhost:3000` servindo os arquivos
estáticos do projeto tal como estão — não há hot-reload de build porque não
há nada para compilar; edite os arquivos e recarregue a página.

## Build

```bash
npm run build
```

Como não existe bundler, "build" aqui roda `scripts/validate.js`: um
verificador que confere, antes de qualquer deploy, que (1) os dados
editoriais em `js/data/` são internamente consistentes (categorias, autores
e `relatedSlugs` referenciados realmente existem), (2) todo arquivo `.js` do
projeto tem sintaxe válida, (3) todo `src`/`href` local usado nos HTMLs
aponta para um arquivo que realmente existe no repositório (isso também
funciona como auditoria de maiúsculas/minúsculas, já que roda em Node sobre
um sistema de arquivos sensível a case), e (4) não há resíduos de ambiente
local (`localhost`, `file://`, caminhos absolutos do tipo `C:\` ou
`/home/usuario/`). O comando termina com código de saída diferente de zero
se algo estiver errado — pense nele como o "build" que garante que o projeto
está pronto para produção, mesmo sem haver nada para compilar.

## Preview (produção local)

```bash
npm run preview
```

Serve os mesmos arquivos em `http://localhost:4173` — equivalente ao que a
Vercel entrega em produção, já que não há etapa de compilação que mude o
resultado entre "dev" e "produção" neste projeto.

**Fluxo testado e confirmado antes da entrega:** `npm install` → `npm run
build` (passou, 0 erros) → `npm run preview` → todas as páginas abertas
diretamente por URL (incluindo com `?slug=`, `?cat=`, `?nome=`, `?q=`) e
recarregadas retornaram HTTP 200, sem redirecionamentos que descartassem a
query string, sem erros de link e sem sintaxe JS quebrada.

> **Nota técnica sobre `serve.json`:** por padrão, o pacote `serve` remove a
> extensão `.html` das URLs através de um redirecionamento 301 — e esse
> redirecionamento **descarta a query string** no processo. Como este
> projeto usa `?slug=`, `?cat=`, `?nome=` e `?q=` para roteamento (ver seção
> "Como o roteamento funciona" abaixo), isso quebraria todo artigo, página de
> categoria, autor e busca. O arquivo `serve.json` na raiz desativa esse
> comportamento (`"cleanUrls": false`) — não remova esse arquivo.

## Deploy na Vercel

### Passo a passo (GitHub → Vercel)

1. Crie um repositório novo no GitHub.
2. Envie todo o conteúdo desta pasta (`voz-e-sociedade/`) para a raiz do
   repositório — `index.html` e `package.json` devem ficar direto na raiz,
   não dentro de uma subpasta.
3. Na Vercel, clique em **Add New → Project** e importe esse repositório.
4. Nas configurações do projeto, confirme:

| Campo | Valor |
|---|---|
| **Framework Preset** | `Other` |
| **Root Directory** | `.` (raiz do repositório) |
| **Build Command** | deixe em branco (opcional: `npm run build`, só roda uma checagem, não gera arquivo nenhum) |
| **Output Directory** | deixe em branco (a Vercel serve a raiz do repositório, onde está o `index.html`) |
| **Install Command** | deixe em branco (o site não precisa de `node_modules` em produção) |

5. Clique em **Deploy**.

> ⚠️ **Se você já tinha criado esse projeto antes na Vercel e ele mostrou
> "404 NOT_FOUND"**, é muito provável que o campo **Output Directory** do
> projeto tenha ficado configurado para algo como `public` ou `dist` de uma
> tentativa anterior — e como este projeto não tem (nem precisa de) uma
> pasta com esse nome, a Vercel não encontra nada para servir e mostra 404
> em **todas** as rotas, incluindo a home. A correção: Project Settings →
> Build & Development Settings → **Output Directory** → apague o valor e
> deixe em branco → **Save** → depois vá em Deployments e faça um
> **Redeploy** (mudar a configuração sozinha não republica o site). Se
> preferir não arriscar isso, o caminho mais simples é **excluir o projeto
> na Vercel e importar o repositório de novo do zero** — um projeto novo
> não carrega configurações antigas.

### O que o `vercel.json` faz (e por que só tem duas linhas)

```json
{
  "cleanUrls": false,
  "trailingSlash": false
}
```

Sem `outputDirectory` nem `buildCommand`: como o `index.html` está na raiz e
não há nada para compilar, a configuração padrão da Vercel (servir a raiz
do repositório) já é exatamente o que se quer — adicionar mais chaves aqui
seria configuração desnecessária.

As duas chaves que existem resolvem um problema real: por padrão, a Vercel
pode remover a extensão `.html` das URLs através de um redirecionamento que
**descarta a query string** no processo. Como este site roteia artigos,
categorias, autor e busca via `?slug=`, `?cat=`, `?nome=`, `?q=` (ver
próxima seção), esse redirecionamento quebraria essas páginas mesmo com a
home funcionando. O mesmo problema existe localmente com o pacote `serve`
— por isso `serve.json` (na raiz) tem a mesma configuração para os comandos
`npm run dev`/`npm run preview`.

## Como o roteamento funciona (não é SPA)

Este site **não** usa client-side routing (não é uma SPA com React Router ou
equivalente) — cada "página" é um arquivo `.html` real no repositório. Por
isso, **abrir uma URL interna diretamente ou recarregá-la nunca dá erro
404 por causa de roteamento**: não existem rotas virtuais para reescrever, e
não é necessário nenhum `rewrite`/`fallback` no `vercel.json` para isso. As
únicas "rotas" que dependem de query string são os templates compartilhados:

- `pages/noticia/index.html?slug=<slug>` — artigo (qualquer tipo)
- `pages/categoria/index.html?cat=<slug>` — listagem por editoria
- `pages/autor/index.html?nome=<slug>` — perfil de autor
- `pages/entenda/index.html?slug=<slug>` — conteúdo explicativo
- `pages/busca/index.html?q=<termo>&tag=<tag>` — busca

Esses parâmetros são lidos pelo JavaScript da própria página (`js/pages/*.js`)
depois que o HTML carrega — por isso a única coisa que pode quebrá-los é uma
camada de proxy/servidor que remova a query string, o que já está coberto
pela configuração `cleanUrls: false` acima.

## Variáveis de ambiente

Nenhuma. O projeto não faz chamadas a API, não tem backend e não usa
`process.env` em lugar nenhum — por isso não há `.env.example`. Tudo que
parece "dinâmico" (artigos salvos, histórico, tema, mural de recados) usa
`localStorage` do próprio navegador do visitante.

## Estrutura de pastas

```text
voz-e-sociedade/
├── package.json / package-lock.json  → apenas para tooling de dev (serve)
├── vercel.json                       → cleanUrls/trailingSlash desativados
├── serve.json                        → mesma config, para `npm run dev`/`preview`
├── .gitignore / .vercelignore
├── scripts/validate.js               → "build": checagem de dados e links
│
├── index.html              → Homepage
├── 404.html                → Página de erro editorial
├── robots.txt / sitemap.xml
├── css/                    → variables, reset, global, layout, components, responsive
├── js/
│   ├── app.js               → bootstrap comum de cada página
│   ├── utils/                → helpers (datas, localStorage, ilustrações SVG)
│   ├── data/                  → "banco de dados" do jornal (ver abaixo)
│   ├── components/            → header/footer (chrome.js) e cards (card.js)
│   ├── pages/                 → lógica de cada tipo de página
│   └── games/                  → caça-palavras, sudoku, quiz, mural
├── pages/
│   ├── noticia/              → template único de artigo (todos os tipos)
│   ├── categoria/            → listagem por editoria (?cat=slug)
│   ├── opiniao/ analises/ entrevista/ cartuns/  → listagens por tipo
│   ├── entenda/               → conteúdo explicativo (?slug=)
│   ├── autor/                 → perfil de autor (?nome=slug)
│   ├── busca/                 → busca global
│   ├── salvos/ lidos/          → localStorage do leitor
│   ├── jogos/                  → hub de jogos + 4 jogos
│   └── institucional/           → sobre, fontes, contato, expediente, etc.
└── assets/                  → pasta reservada para imagens reais futuras
```

## Como o conteúdo funciona

Todo o conteúdo editorial fica em `js/data/`, como objetos JavaScript — não
há HTML de artigo escrito à mão. As páginas leem esses dados e montam o HTML
dinamicamente.

- `js/data/categories.js` — as editorias do jornal (nome, cor, descrição).
- `js/data/authors.js` — perfis dos jornalistas (fictícios).
- `js/data/tags.js` — lista de tags usadas no site.
- `js/data/articles.js` — **o arquivo principal**: cada notícia, reportagem,
  análise, opinião, editorial ou entrevista é um objeto neste array.
- `js/data/explicativos.js` — conteúdo do formato "Entenda".
- `js/data/cartuns.js` — galeria de cartuns/charges.
- `js/data/dados.js` — estatísticas e matérias de dados (todas com valores
  fictícios claramente identificados).
- `js/data/queries.js` — funções de busca/filtro reaproveitadas pelas páginas.

### Como adicionar uma notícia

Abra `js/data/articles.js` e adicione um novo objeto ao array `articles`,
seguindo o modelo dos existentes:

```javascript
{
  id: 30,
  slug: "titulo-da-nova-noticia",       // usado na URL: ?slug=titulo-da-nova-noticia
  type: "noticia",                        // noticia | reportagem | analise | opiniao | editorial | entrevista
  category: "sociedade",                  // precisa existir em categories.js
  title: "Título da notícia",
  subtitle: "Linha fina explicando a notícia.",
  excerpt: "Resumo curto usado nos cards.",
  authorSlug: "mariana-teles",            // precisa existir em authors.js
  date: "2026-09-19T10:00:00-03:00",
  updatedAt: null,
  readingTime: 4,
  imageSeed: "noticia-30",                // qualquer texto único, define a ilustração gerada
  imageType: "ILUSTRAÇÃO",
  imageCredit: "Ilustração / Voz e Sociedade",
  originalSource: null,
  originalUrl: null,
  tags: ["Sociedade"],
  breaking: false,
  isDemo: true,
  content: [
    { type: "p", text: "Parágrafo de abertura." },
    { type: "h2", text: "Subtítulo" },
    { type: "p", text: "Mais um parágrafo." }
  ],
  sources: [{ label: "Nota", detail: "Conteúdo fictício de demonstração" }],
  relatedSlugs: []
}
```

Tipos de bloco aceitos em `content`: `p`, `h2`, `h3`, `quote`, `list`
(`items: [...]`), `infobox` (`title` + `text`) e `timeline`
(`items: [{ year, text }]`).

Para uma **entrevista**, use `type: "entrevista"` e adicione `interviewee`
(`name`, `role`, `bio`) e `qa` (`[{ q, a }]`) — o corpo (`content`) pode ficar
vazio, pois a página renderiza o formato de pergunta e resposta
automaticamente.

### Como adicionar um autor

Edite `js/data/authors.js` e adicione um objeto com `slug`, `name`, `role` e
`bio`. O `slug` é o valor usado na URL `pages/autor/index.html?nome=slug`.

### Como adicionar uma categoria

Edite `js/data/categories.js`. Cada categoria tem `slug`, `name`, `color`
(uma variável CSS, ex. `var(--cat-sociedade)` — defina uma nova em
`css/variables.css` se quiser uma cor própria) e `description`.

### Como adicionar uma imagem real

Hoje todas as imagens do site são ilustrações SVG geradas por código (ver
`js/utils/illustration.js`), para evitar usar fotografias de banco sem
licença verificada — e para nunca apresentar uma imagem fictícia como se
fosse o registro de um acontecimento real. Para usar uma imagem real e
licenciada:

1. Salve o arquivo em `assets/images/` (ou `illustrations/`).
2. No objeto do artigo, troque a chamada de `VS_UTIL.illustration(...)` pelo
   caminho da imagem — ou adicione um campo `featuredImageUrl` ao artigo e
   ajuste `js/pages/noticia.js` para usá-lo quando presente.
3. Preencha sempre `imageCredit`, `imageSource` e `imageLicense` com os dados
   reais do fotógrafo/agência e da licença.

### Como adicionar uma fonte

Cada artigo tem um array `sources` (`[{ label, detail }]`) exibido no bloco
"Fontes" da página. Se o conteúdo tiver origem em outro veículo, preencha
também `originalUrl` para que o link "Leia a reportagem original" apareça.

### Como adicionar um jogo

Os jogos ficam em `js/games/` (um arquivo por jogo) e cada um tem sua própria
página em `pages/jogos/`. Para adicionar um novo, copie a estrutura de um
jogo existente (por exemplo `quiz.html` + `js/games/quiz.js`) e inclua um
novo card em `pages/jogos/index.html` e na seção "Jogos" da homepage.

### Como modificar cores e tipografia

Tudo fica centralizado em `css/variables.css`:

- Cores de cada editoria: variáveis `--cat-*` (têm uma versão para modo claro
  e outra para modo escuro).
- Cor de destaque geral (links, breaking news): `--signal`.
- Fontes: `--font-headline` (títulos), `--font-body` (corpo do texto,
  otimizado para leitura longa) e `--font-ui` (interface).
- Escala tipográfica: variáveis `--fs-*`.

## Checklist de deploy (testado antes da entrega)

- [x] **`index.html` na raiz do projeto** (sem pasta `public/`, sem subpasta
      aninhada) — confirmado por testes de HTTP reais, não apenas inspeção
      de código
- [x] `npm install` roda sem erros (0 vulnerabilidades)
- [x] `npm run build` passa (dados, sintaxe JS, links locais e ausência de
      resíduos de ambiente local — tudo verificado por `scripts/validate.js`)
- [x] `npm run preview` sobe um servidor de produção local a partir da raiz
- [x] **51 URLs testadas por HTTP real** (não `file://`), cada uma aberta
      diretamente E recarregada: homepage, todas as 9 editorias, as 4
      listagens por tipo, busca (por termo e por tag), autor, conteúdo
      "Entenda", hub de jogos e os 4 jogos, salvos, lidos, as 10 páginas
      institucionais, 404, robots.txt, sitemap.xml, as 6 folhas de CSS e 8
      arquivos JS — **todas retornaram HTTP 200, sem 404, sem
      redirecionamento que descarte query string**
- [x] CSS, JS e favicon (inline, sem arquivo externo) carregam corretamente
- [x] Nenhuma chamada a `/api/...` inexistente — o projeto não depende de
      backend algum
- [x] `localStorage` (salvos, histórico, tema, mural) funciona igual em
      produção, pois roda inteiramente no navegador do visitante
- [x] Nenhum caminho absoluto do tipo `C:\`, `/home/usuario/` ou
      `file://` em qualquer arquivo do projeto
- [x] Nenhuma referência a `localhost`/`127.0.0.1` fora dos scripts de
      desenvolvimento local (`dev`/`preview`)
- [x] Auditoria de case-sensitivity: `scripts/validate.js` roda em Node/fs
      sobre um sistema de arquivos Linux (sensível a maiúsculas/minúsculas)
      — todos os `src`/`href` batem exatamente com o nome real do arquivo
- [x] `.gitignore` cobre `node_modules`, `.env*`, `.DS_Store`, `.vercel`
- [x] `package-lock.json` presente e gerado por uma instalação real
- [x] Nenhum `console.log` de depuração deixado no código
- [x] Nenhum conteúdo removido — os 29 artigos, 4 explicativos, 6 cartuns,
      13 categorias e os 4 jogos continuam completos

## Funcionalidades incluídas


- Homepage com múltiplos blocos editoriais (destaque, últimas, por editoria,
  investigações, análises, opinião, entrevistas, cartuns, dados, jogos,
  newsletter).
- Template único de artigo que se adapta a notícia, reportagem, análise,
  opinião, editorial e entrevista — com sumário (TOC) sticky, avisos de
  conteúdo sensível, créditos de imagem, linha do tempo, bloco de fontes,
  compartilhamento e "Leia também".
- Páginas de categoria com filtros, ordenação, paginação e sidebar.
- Busca global com filtros por editoria, tipo e ordenação, incluindo busca
  por tag.
- Perfis de autor com lista de publicações.
- Conteúdo "Entenda" (explicativo) para os principais conceitos do jornal.
- Artigos salvos e histórico de leitura (via `localStorage`, só neste
  navegador).
- Quatro jogos: caça-palavras, sudoku (três dificuldades), quiz e mural de
  recados (também via `localStorage`).
- Modo escuro/claro com preferência salva.
- Controles de leitura confortável (aumentar/diminuir texto, modo leitura).
- Acessibilidade: skip-link, foco visível, `aria-label`s, `prefers-reduced-
  motion`, estrutura semântica e navegação por teclado.
- Responsividade completa (mobile, tablet, desktop).
- Página 404 editorial e estados vazios em busca, salvos, histórico e
  jogos/mural.

## Sobre este projeto

Este é um projeto de demonstração técnica. Ele mostra como um portal de
notícias real poderia ser estruturado — incluindo boas práticas de
responsabilidade jornalística, como distinguir claramente notícia de
opinião, sempre atribuir fontes, nunca fabricar declarações ou dados, e usar
ilustrações identificadas em vez de fotografias não verificadas. Para
publicar conteúdo jornalístico real, seria necessário substituir os dados de
demonstração por apuração, fontes e imagens verdadeiras, seguindo os mesmos
padrões estruturais aqui implementados.
