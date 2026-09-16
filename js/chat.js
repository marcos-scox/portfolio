/* ============================================================
   CHAT IA — widget flutuante

   A chave do Grok fica somente no servidor, na variável GROK_API_KEY.
   O navegador chama a rota /api/chat e nunca recebe a chave.
   ============================================================ */

const CHAT_CONFIG = {
  endpoint: "/api/chat",
  greeting:
    "Oi! Eu sou o assistente virtual do Marcos. Posso te ajudar a entender os projetos, tirar dúvidas sobre automação com IA ou te colocar em contato direto com ele. Como posso ajudar?",
};

(function () {
  const fab = document.getElementById("chatFab");
  const panel = document.getElementById("chatPanel");
  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");

  if (!fab || !panel || !body || !form || !input || !sendBtn) return;

  let opened = false;
  let sending = false;
  const history = [];

  function addMessage(text, role) {
    const el = document.createElement("div");
    el.className = "chat-msg " + role;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function showTyping() {
    const el = document.createElement("div");
    el.className = "chat-typing";
    el.id = "chatTyping";
    el.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById("chatTyping");
    if (el) el.remove();
  }

  function setSending(state) {
    sending = state;
    sendBtn.disabled = state || input.value.trim().length === 0;
    input.disabled = state;
  }

  function openPanel() {
    opened = true;
    fab.classList.add("open");
    panel.classList.add("open");
    fab.setAttribute("aria-expanded", "true");
    if (body.childElementCount === 0) addMessage(CHAT_CONFIG.greeting, "bot");
    setTimeout(() => input.focus(), 250);
  }

  function closePanel() {
    opened = false;
    fab.classList.remove("open");
    panel.classList.remove("open");
    fab.setAttribute("aria-expanded", "false");
  }

  fab.addEventListener("click", () => (opened ? closePanel() : openPanel()));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && opened) closePanel();
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 96) + "px";
    sendBtn.disabled = sending || input.value.trim().length === 0;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    if (!text || sending) return;

    addMessage(text, "user");
    input.value = "";
    input.style.height = "auto";
    setSending(true);
    showTyping();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45000);

      const resp = await fetch(CHAT_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });

      clearTimeout(timer);
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || "HTTP " + resp.status);

      const reply = data.reply || "";
      if (!reply) throw new Error("resposta vazia");

      history.push({ role: "user", content: text }, { role: "assistant", content: reply });
      hideTyping();
      addMessage(reply, "bot");
    } catch (err) {
      hideTyping();
      addMessage(
        err.name === "AbortError"
          ? "A resposta demorou demais. Tente de novo."
          : "Não consegui falar com o assistente agora. Tente de novo em instantes.",
        "error"
      );
    } finally {
      setSending(false);
      input.focus();
    }
  });
})();
