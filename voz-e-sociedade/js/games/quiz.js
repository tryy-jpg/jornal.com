(function () {
  const QUESTIONS = [
    {
      q: "O que a Lei Maria da Penha (Lei nº 11.340/2006) criou para proteger mulheres em risco?",
      options: ["Medida protetiva de urgência", "Imposto sobre grandes fortunas", "Regulamentação do trânsito", "Nenhuma das anteriores"],
      correct: 0
    },
    {
      q: "O que caracteriza o racismo estrutural, segundo as ciências sociais?",
      options: [
        "Apenas atos individuais isolados",
        "Padrões históricos e institucionais que produzem desigualdade racial",
        "Uma lei específica de 1988",
        "Um tipo de crime eleitoral"
      ],
      correct: 1
    },
    {
      q: "O que diferencia uma reportagem de um artigo de opinião no jornalismo?",
      options: [
        "Não há diferença",
        "A opinião é sempre mais longa",
        "A reportagem é factual e investigativa; a opinião representa a visão do autor",
        "A reportagem nunca usa fontes"
      ],
      correct: 2
    },
    {
      q: "Em qual ano a lei que tipifica o feminicídio no Brasil foi sancionada?",
      options: ["2006", "2015", "1988", "2020"],
      correct: 1
    },
    {
      q: "O que é justiça restaurativa?",
      options: [
        "Uma abordagem que busca reparar danos e restaurar relações",
        "Um tipo de pena de multa",
        "Um imposto sobre heranças",
        "Um sistema de votação"
      ],
      correct: 0
    },
    {
      q: "Por que veículos de imprensa costumam usar avisos de conteúdo sensível?",
      options: [
        "Para aumentar o número de cliques",
        "Para alertar leitores sobre temas potencialmente perturbadores, com responsabilidade",
        "Não é uma prática jornalística",
        "Apenas por exigência legal em todos os países"
      ],
      correct: 1
    }
  ];

  let current = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    answered = false;
    const q = QUESTIONS[current];
    const root = document.getElementById("quiz-root");
    root.innerHTML = `
      <p class="meta">Pergunta ${current + 1} de ${QUESTIONS.length} · Pontuação: ${score}</p>
      <h2 style="font-family:var(--font-headline);font-size:1.4rem;margin-block:1rem;">${q.q}</h2>
      <div id="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-option" data-i="${i}">${opt}</button>`).join("")}
      </div>
      <p id="quiz-feedback" class="meta" style="margin-top:1rem;"></p>
      <button class="btn btn-primary" id="quiz-next" style="margin-top:1rem;display:none;">${current === QUESTIONS.length - 1 ? "Ver resultado" : "Próxima pergunta"}</button>
    `;
    document.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => selectAnswer(Number(btn.dataset.i)));
    });
    document.getElementById("quiz-next").addEventListener("click", () => {
      current++;
      if (current >= QUESTIONS.length) renderResult();
      else renderQuestion();
    });
  }

  function selectAnswer(i) {
    if (answered) return;
    answered = true;
    const q = QUESTIONS[current];
    const buttons = document.querySelectorAll(".quiz-option");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) btn.classList.add("correct");
      else if (idx === i) btn.classList.add("incorrect");
    });
    const feedback = document.getElementById("quiz-feedback");
    if (i === q.correct) {
      score++;
      feedback.textContent = "Resposta correta!";
    } else {
      feedback.textContent = "Não foi dessa vez.";
    }
    document.getElementById("quiz-next").style.display = "inline-flex";
  }

  function renderResult() {
    const root = document.getElementById("quiz-root");
    root.innerHTML = `
      <h2 style="font-family:var(--font-headline);font-size:1.6rem;">Resultado</h2>
      <p style="margin-block:1rem;font-size:1.1rem;">Você acertou ${score} de ${QUESTIONS.length} perguntas.</p>
      <button class="btn btn-primary" id="quiz-restart">Jogar novamente</button>`;
    document.getElementById("quiz-restart").addEventListener("click", () => {
      current = 0;
      score = 0;
      renderQuestion();
    });
  }

  renderQuestion();
})();
