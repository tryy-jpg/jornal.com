(function () {
  let solution, puzzle;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
    }
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
      for (let c = bc; c < bc + 3; c++) {
        if (board[r][c] === num) return false;
      }
    }
    return true;
  }

  function fillBoard(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const n of nums) {
            if (isValid(board, r, c, n)) {
              board[r][c] = n;
              if (fillBoard(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function generateSolution() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
  }

  function makePuzzle(solved, difficulty) {
    const holes = { facil: 35, medio: 45, dificil: 54 }[difficulty] || 45;
    const puzzleBoard = solved.map((row) => row.slice());
    let removed = 0;
    const positions = shuffle(Array.from({ length: 81 }, (_, i) => i));
    for (const pos of positions) {
      if (removed >= holes) break;
      const r = Math.floor(pos / 9);
      const c = pos % 9;
      puzzleBoard[r][c] = 0;
      removed++;
    }
    return puzzleBoard;
  }

  function renderBoard() {
    const el = document.getElementById("sudoku-grid");
    el.innerHTML = "";
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement("div");
        cell.className = "sudoku-cell" + (r % 3 === 2 && r !== 8 ? " sudoku-row-thick" : "");
        const val = puzzle[r][c];
        if (val !== 0) {
          cell.classList.add("given");
          cell.textContent = val;
        } else {
          const input = document.createElement("input");
          input.type = "text";
          input.inputMode = "numeric";
          input.maxLength = 1;
          input.dataset.r = r;
          input.dataset.c = c;
          input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^1-9]/g, "").slice(0, 1);
            cell.classList.remove("err");
          });
          cell.appendChild(input);
        }
        el.appendChild(cell);
      }
    }
  }

  function checkAnswers() {
    let complete = true;
    let correct = true;
    document.querySelectorAll("#sudoku-grid input").forEach((input) => {
      const r = Number(input.dataset.r);
      const c = Number(input.dataset.c);
      const val = Number(input.value);
      input.parentElement.classList.remove("err");
      if (!val) { complete = false; return; }
      if (val !== solution[r][c]) {
        input.parentElement.classList.add("err");
        correct = false;
      }
    });
    const status = document.getElementById("sudoku-status");
    if (!complete) status.textContent = "Ainda faltam células para preencher.";
    else if (correct) status.textContent = "Parabéns! Sudoku resolvido corretamente.";
    else status.textContent = "Há números incorretos, destacados em vermelho.";
  }

  function newGame() {
    const difficulty = document.getElementById("sudoku-difficulty").value;
    solution = generateSolution();
    puzzle = makePuzzle(solution, difficulty);
    document.getElementById("sudoku-status").textContent = "";
    renderBoard();
  }

  document.getElementById("sudoku-check").addEventListener("click", checkAnswers);
  document.getElementById("sudoku-new").addEventListener("click", newGame);
  document.getElementById("sudoku-difficulty").addEventListener("change", newGame);
  newGame();
})();
