# Marcos — IA & Automação

Portfólio de projetos em **IA aplicada, automação, sistemas web e aplicativos mobile**.

## Portfólio online

Acesse o site publicado no GitHub Pages:

**[marcos-scox.github.io/portfolio](https://marcos-scox.github.io/portfolio/)**

## Chat com Grok

O chat do portfólio usa a rota `/api/chat`, que encaminha as mensagens para a API do Grok. A chave fica somente como variável de ambiente no servidor e nunca é enviada ao navegador.

O projeto não usa mais o n8n para executar a função de IA. O prompt do assistente está incorporado na função serverless e segue as instruções definidas no Notion.

### Publicação

O GitHub Pages hospeda apenas arquivos estáticos e não executa `/api/chat`. Para ativar o chat, publique este repositório em uma plataforma que suporte funções serverless, como Vercel, e configure:

| Variável | Valor |
|---|---|
| `GROK_API_KEY` | Sua chave privada da API xAI/Grok |
| `GROK_MODEL` | `grok-4.6` ou outro modelo ativo na sua conta |

Não coloque a chave em `js/chat.js`, HTML, GitHub ou qualquer arquivo público. Como a chave foi compartilhada em texto nesta solicitação, revogue-a no painel da xAI e gere outra antes da publicação.

## Projetos em destaque

### Finance+

Aplicativo financeiro para organizar contas, acompanhar investimentos, criar reservas e conversar com um assistente financeiro.

- [Ver projeto no GitHub](https://github.com/marcos-scox/financas-app)
- [Ver no portfólio](https://marcos-scox.github.io/portfolio/)

### Currículo Fácil

Aplicação web para escolher modelos, preencher experiências e visualizar um currículo pronto para compartilhar.

- [Ver projeto no GitHub](https://github.com/marcos-scox/curriculo-facil)
- [Ver no portfólio](https://marcos-scox.github.io/portfolio/)

### Forja

Aplicativo mobile para treinos, cardio com GPS, histórico de sessões e coach de IA.

- [Ver projeto no GitHub](https://github.com/marcos-scox/forja-app)
- [Ver no portfólio](https://marcos-scox.github.io/portfolio/)

### TRENNIX

Aplicativo mobile com treinos para casa e academia, agenda semanal e treinador de IA.

- [Ver projeto no GitHub](https://github.com/marcos-scox/trennix-app)
- [Ver no portfólio](https://marcos-scox.github.io/portfolio/)

## Tecnologias

- HTML, CSS e JavaScript
- React Native e Expo
- Integrações com inteligência artificial
- Automação de processos
- GitHub Pages

## Contato

- [WhatsApp](https://wa.me/5598984808565)
- [E-mail](mailto:marcos.scox@gmail.com)
- [Portfólio](https://marcos-scox.github.io/portfolio/)

---

Feito por Marcos, em São Luís, MA.
