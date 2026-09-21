(function () {
  const SIZE = window.innerWidth < 480 ? 9 : 12;
  const WORDS = ["JUSTICA", "IGUALDADE", "DIREITOS", "RESPEITO", "DIGNIDADE", "CIDADANIA", "DIVERSIDADE", "LIBERDADE"]
    .filter((w) => w.length <= SIZE);
  const DIRECTIONS = [
    [0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]
  ];
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let grid, placements, found, startCell, timerInterval, seconds;

  function emptyGrid() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
  }

  function tryPlace(word) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);
      const endRow = row + dir[0] * (word.length - 1);
      const endCol = col + dir[1] * (word.length - 1);
      if (endRow < 0 || endRow >= SIZE || endCol < 0 || endCol >= SIZE) continue;

      let fits = true;
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i;
        const c = col + dir[1] * i;
        const existing = grid[r][c];
        if (existing && existing !== word[i]) { fits = false; break; }
        cells.push([r, c]);
      }
      if (!fits) continue;

      cells.forEach(([r, c], i) => { grid[r][c] = word[i]; });
      return cells;
    }
    return null;
  }

  function buildGrid() {
    grid = emptyGrid();
    placements = {};
    WORDS.forEach((word) => {
      const cells = tryPlace(word);
      if (cells) placements[word] = cells;
    });
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!grid[r][c]) grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  function cellKey(r, c) { return `${r}-${c}`; }

  function renderGrid() {
    const el = document.getElementById("ws-grid");
    el.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
    el.innerHTML = "";
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const div = document.createElement("div");
        div.className = "wordsearch-cell";
        div.textContent = grid[r][c];
        div.dataset.r = r;
        div.dataset.c = c;
        div.tabIndex = 0;
        div.setAttribute("role", "button");
        div.setAttribute("aria-label", `Letra ${grid[r][c]}, linha ${r + 1}, coluna ${c + 1}`);
        div.addEventListener("click", () => onCellClick(r, c));
        el.appendChild(div);
      }
    }
  }

  function renderWordlist() {
    document.getElementById("ws-wordlist").innerHTML = WORDS.map((w) =>
      `<span data-word="${w}" class="${found.has(w) ? "found" : ""}">${w}</span>`
    ).join("");
  }

  function lineCells(r1, c1, r2, c2) {
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    const len = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1)) + 1;
    if (dr !== 0 && dc !== 0 && Math.abs(r2 - r1) !== Math.abs(c2 - c1)) return null;
    if (dr === 0 && dc === 0) return null;
    const cells = [];
    for (let i = 0; i < len; i++) cells.push([r1 + dr * i, c1 + dc * i]);
    return cells;
  }

  function onCellClick(r, c) {
    if (!startCell) {
      startCell = [r, c];
      document.querySelector(`.wordsearch-cell[data-r="${r}"][data-c="${c}"]`).classList.add("selected");
      return;
    }
    const cells = lineCells(startCell[0], startCell[1], r, c);
    document.querySelectorAll(".wordsearch-cell.selected").forEach((el) => el.classList.remove("selected"));

    if (cells) {
      const letters = cells.map(([rr, cc]) => grid[rr][cc]).join("");
      const reversed = letters.split("").reverse().join("");
      const match = WORDS.find((w) => (w === letters || w === reversed) && !found.has(w));
      if (match) {
        found.add(match);
        cells.forEach(([rr, cc]) => {
          document.querySelector(`.wordsearch-cell[data-r="${rr}"][data-c="${cc}"]`).classList.add("found");
        });
        renderWordlist();
        document.getElementById("ws-status").textContent = `Você encontrou: ${match}`;
        if (found.size === WORDS.length) {
          clearInterval(timerInterval);
          document.getElementById("ws-status").textContent = `Parabéns! Você encontrou todas as palavras em ${seconds}s.`;
        }
      }
    }
    startCell = null;
  }

  function startTimer() {
    seconds = 0;
    document.getElementById("ws-timer").textContent = "Tempo: 0s";
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      seconds++;
      document.getElementById("ws-timer").textContent = `Tempo: ${seconds}s`;
    }, 1000);
  }

  function newGame() {
    found = new Set();
    startCell = null;
    document.getElementById("ws-status").textContent = "";
    buildGrid();
    renderGrid();
    renderWordlist();
    startTimer();
  }

  document.getElementById("ws-restart").addEventListener("click", newGame);
  newGame();
})();
