/* ============================================================
   CHAT IA — widget flutuante
   ============================================================

   COMO CONECTAR (leia o arquivo n8n/COMO-INSTALAR.md):

   1. Importe o workflow n8n/workflow-chat-ia.json no seu n8n.
   2. No nó "NVIDIA Nemotron Chat Model", cadastre a credencial
      nativa da NVIDIA (a chave nunca fica em código).
   3. Ative o workflow, copie a URL de produção do Webhook.
   4. Cole essa URL abaixo em CHAT_CONFIG.endpoint.

   ATENÇÃO — NÃO coloque a chave da NVIDIA neste arquivo.
   Este arquivo é baixado pelo navegador de todo visitante do site,
   então qualquer texto escrito aqui é público (basta abrir o
   "Inspecionar" do navegador para ler). A chave fica guardada
   apenas dentro do n8n; o site só conhece a URL do webhook.

   MEMÓRIA DA CONVERSA:
   Quem lembra o histórico agora é o próprio n8n (nó Simple Memory),
   por isso cada visitante precisa de um "sessionId" fixo enquanto
   dura a conversa — é o que a IIFE abaixo gera e guarda em
   sessionStorage (dura só enquanto a aba do navegador está aberta).
   ============================================================ */

const CHAT_CONFIG = {
  // URL de produção do Webhook do n8n.
  // Ex.: "https://seu-n8n.com.br/webhook/chat-ia"
  endpoint: "https://samedmedseg.app.n8n.cloud/webhook/chat-ia",

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

  // Um sessionId por aba/visita — o n8n usa isso para saber que
  // mensagens pertencem à mesma conversa (memória fica no n8n).
  function getSessionId() {
    const KEY = "chatSessionId";
    try {
      let id = sessionStorage.getItem(KEY);
      if (!id) {
        id = "web-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(KEY, id);
      }
      return id;
    } catch (e) {
      // Navegador privado ou sessionStorage bloqueado: usa um id só desta execução.
      return "web-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
    }
  }

  const sessionId = getSessionId();

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

  // Enter envia, Shift+Enter quebra linha
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

    if (!CHAT_CONFIG.endpoint) {
      showTyping();
      setTimeout(() => {
        hideTyping();
        addMessage(
          "O chat ainda não está conectado. Importe o workflow do n8n (pasta n8n/), ative-o e cole a URL do webhook em CHAT_CONFIG.endpoint, no arquivo js/chat.js.",
          "error"
        );
        setSending(false);
      }, 500);
      return;
    }

    showTyping();

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 45000);

      const resp = await fetch(CHAT_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: text,
          sessionId: sessionId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!resp.ok) throw new Error("HTTP " + resp.status);

      const data = await resp.json();
      const reply = data.reply || data.message || "";

      hideTyping();

      if (!reply) throw new Error("resposta vazia");

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
