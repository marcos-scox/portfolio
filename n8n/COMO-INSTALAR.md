# Chat IA do portfólio — instalação

O botão de chat do site não fala direto com o Groq. Ele chama um webhook do n8n,
que roda um **AI Agent** (com memória de conversa, calculadora e data/hora como
ferramentas) conectado a um modelo via Groq. A chave da API fica só dentro do n8n.

```
Navegador  →  Webhook n8n  →  AI Agent  →  Groq (Qwen)
(público)     (recebe)         (raciocina,   (responde)
                                usa ferramentas,
                                lembra da conversa)
```

O motivo de não colocar a chave no site: qualquer arquivo `.js` é baixado pelo
navegador do visitante. Se a chave estivesse lá, bastaria abrir o "Inspecionar"
para copiá-la e usar seu crédito. No n8n ela fica no servidor, onde ninguém de
fora enxerga.

---

## 1. Importar o workflow

No n8n: **Workflows → ⋯ (canto superior direito) → Import from File**
e selecione `workflow-chat-ia.json`.

Vão aparecer 8 nós: Webhook, AI Agent, Groq Chat Model, Simple Memory,
Calculator, Date & Time, "resposta ia" e Responder ao site.

## 2. Cadastrar a chave do Groq

Abra o nó **Groq Chat Model** (o retangular, embaixo do AI Agent). No campo de
credencial, clique em **Create new credential** e cole só a chave da API, sem
escrever `Bearer` nem mais nada — esse nó é feito sob medida para o Groq e monta
o header sozinho.

| Campo | Valor |
|---|---|
| **API Key** | `gsk_SUA_CHAVE_AQUI` |

Salve. O n8n volta pro node com a credencial já selecionada.

⚠️ Qualquer chave que já tenha sido colada em texto simples em algum lugar (chat,
print, mensagem) deve ser tratada como comprometida — revogue e gere uma nova no
painel do Groq antes de usar em produção.

## 3. Conferir o modelo

O nó **Groq Chat Model** já vem com `qwen/qwen3.6-27b` selecionado. Como esse
campo é um dropdown que o n8n preenche consultando a API do Groq na hora, o mais
provável é que já esteja certo — mas o catálogo de modelos hospedados no Groq
muda com frequência (modelos saem do ar, outros entram). Se a chamada der erro
de modelo indisponível, abra esse nó, clique no campo **Model** e escolha outro
da lista (só aparece o que está ativo).

## 4. Ativar e pegar a URL

Ative o workflow no botão **Active** (canto superior direito).

Abra o nó **Webhook** e copie a **Production URL**. Vai ser algo como:

```
https://seu-n8n.com.br/webhook/chat-ia
```

> Use a *Production URL*, não a *Test URL* — a de teste só funciona enquanto você
> está com o editor aberto clicando em "Listen for test event".

## 5. Colar a URL no site

Abra `js/chat.js` e cole na primeira linha de configuração:

```js
const CHAT_CONFIG = {
  endpoint: "https://seu-n8n.com.br/webhook/chat-ia",
```

Pronto. Recarregue o site e teste o botão.

---

## Como testar sem confundir o resultado

O erro mais comum ao testar é usar **"Execute workflow"** ou **"Listen for test
event"** direto no editor do n8n sem mandar dado nenhum. Nesse caso o Webhook não
recebe nenhuma requisição de verdade — não existe `chatInput` nem `sessionId` —
e o AI Agent ou o Simple Memory vão reclamar de campo vazio. Isso não é bug do
workflow, é só teste sem entrada.

Para testar de verdade, existem duas formas:
1. **Pelo site** — ative o workflow, cole a Production URL em `js/chat.js`
   (passo 5 acima), abra o `index.html` e mande uma mensagem pelo botão de chat.
2. **Por linha de comando**, sem precisar do site:
   ```bash
   curl -X POST https://seu-n8n.com.br/webhook/chat-ia \
     -H "Content-Type: application/json" \
     -d '{"chatInput": "quais serviços vocês oferecem?", "sessionId": "teste-123"}'
   ```
   Troque a URL pela Production URL do seu Webhook. A resposta deve vir como
   `{"reply": "..."}`.

## Como funciona a memória da conversa

Quem lembra da conversa é o nó **Simple Memory**. Para isso funcionar, cada
visitante precisa de um identificador de sessão fixo enquanto a conversa dura.
O `js/chat.js` já gera esse `sessionId` sozinho (guardado em `sessionStorage`,
ou seja, dura enquanto a aba do navegador estiver aberta) e envia junto de cada
mensagem. O nó Simple Memory está configurado para usar exatamente esse valor
(`Key` = `{{ $('Webhook').first().json.body.sessionId }}`), então cada visitante
tem sua própria memória, sem misturar conversas.

**Não altere** o campo "Session ID" do Simple Memory para "Connected Chat Trigger
Node" nem para um valor fixo — isso faz todo mundo cair na mesma conversa.

`contextWindowLength: 20` no Simple Memory guarda as últimas 20 trocas de mensagem.
Aumente se quiser conversas mais longas com contexto (custa mais tokens por chamada).

---

## Ajustes comuns

**Mudar a personalidade do assistente** — abra o nó **AI Agent** → aba
*Parameters* → *Options* → **System Message**. É ali que está escrito quem ele é,
o que pode responder, e quando indicar seu WhatsApp/e-mail. Já vem preenchido —
edite o texto livremente.

**Adicionar mais ferramentas** — o AI Agent já vem com Calculadora e Data/Hora.
Para adicionar outra (ex.: buscar na web, consultar uma planilha), arraste o nó
de ferramenta desejado e conecte na entrada *Tool* do AI Agent, igual aos outros
dois já conectados.

**Restringir quem pode chamar o webhook** — hoje o CORS está em `*` (qualquer
origem). Depois de publicar o site, troque em dois lugares pelo seu domínio:
- nó *Webhook* → Options → *Allowed Origins (CORS)*
- nó *Responder ao site* → Options → Response Headers → `Access-Control-Allow-Origin`

Isso impede que outros sites usem seu webhook (e seu crédito no Groq).

---

## Se der erro

| Sintoma | Causa provável |
|---|---|
| "Não consegui falar com o assistente" | Workflow não está **Active**, ou a URL colada é a de teste |
| "No prompt specified... chatInput" no AI Agent | Confira se o campo **Prompt** do AI Agent está em "Define below" (não "Take from previous node automatically") — ou você testou sem mandar dado real (veja "Como testar sem confundir o resultado") |
| "Key parameter is empty" no Simple Memory | Mesma causa acima: teste sem requisição real. Teste pelo site ou com o curl de exemplo |
| Erro 401 no n8n | Chave incorreta ou revogada na credencial do nó Groq Chat Model |
| Erro de CORS no console do navegador | *Allowed Origins* do nó Webhook não inclui o domínio do site |
| Responde vazio | O nó "resposta ia" já trata isso com uma mensagem padrão — se aparecer, confira as *Executions* no n8n para ver o que o AI Agent retornou |
| Erro de modelo indisponível | O modelo saiu do catálogo do Groq — troque no nó Groq Chat Model (veja "Conferir o modelo" acima) |
| Cada visitante parece "lembrar" da conversa de outro | Confira se o Simple Memory está com Session ID = `customKey` apontando pro `sessionId` do webhook, não fixo |

Para ver o que aconteceu: n8n → **Executions**, clique na execução com falha e veja
qual nó ficou vermelho. No AI Agent dá pra abrir cada sub-execução e ver o
raciocínio passo a passo (o que ele pensou, se usou alguma ferramenta, etc.).

**Dica**: se o workflow tiver "pinData" (dados de teste fixados em algum nó — costuma
aparecer um ícone de alfinete no canto do nó), remova antes de testar de verdade.
Dado fixado força o n8n a reusar sempre a mesma execução antiga, mesmo quando uma
requisição nova chega — foi isso que causou os erros de campo vazio no teste anterior.
