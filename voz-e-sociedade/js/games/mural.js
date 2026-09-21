(function () {
  function getMessages() {
    return window.VS_UTIL.lsGet("mural", []);
  }
  function setMessages(msgs) {
    window.VS_UTIL.lsSet("mural", msgs);
  }

  function render() {
    const msgs = getMessages();
    const el = document.getElementById("mural-list");
    el.innerHTML = msgs.length
      ? msgs.map((m) => `
        <div class="mural-msg">
          <div class="mural-msg-head">
            <strong>${VS_UTIL.escapeHtml(m.name)}</strong>
            <span class="meta">${VS_UTIL.escapeHtml(m.date)}</span>
          </div>
          <p>${VS_UTIL.escapeHtml(m.message)}</p>
          <button class="btn btn-outline btn-small" style="margin-top:0.75rem;" data-id="${m.id}">Excluir minha mensagem</button>
        </div>`).join("")
      : `<div class="empty-state"><h3>Nenhum recado ainda</h3><p>Seja a primeira pessoa a deixar uma mensagem neste navegador.</p></div>`;

    el.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        setMessages(getMessages().filter((m) => String(m.id) !== id));
        render();
        window.VS_UTIL.toast("Mensagem excluída.");
      });
    });
  }

  document.getElementById("mural-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("mural-name").value.trim();
    const message = document.getElementById("mural-message").value.trim();
    if (!name || !message) return;
    const msgs = getMessages();
    msgs.unshift({
      id: Date.now(),
      name,
      message,
      date: new Date().toLocaleString("pt-BR")
    });
    setMessages(msgs);
    document.getElementById("mural-form").reset();
    render();
    window.VS_UTIL.toast("Recado publicado (modo demonstração).");
  });

  render();
})();
