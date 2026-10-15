/* ============================================================
   APRESENTAÇÕES DE APLICATIVO — conteúdo
   ============================================================
   Só dados. A mecânica do modal (montagem, acessibilidade,
   animações de scroll) vive em js/modal-app.js e é a mesma para
   todos os apps — para publicar um app novo basta acrescentar
   uma entrada aqui e um data-abre-app="<chave>" no card.

   Campos de cada bloco:
     n       número mostrado antes do rótulo
     tag     rótulo curto da funcionalidade
     h / p   título e parágrafo
     layout  "um" | "destaque" | "pilha"  (pilha = 2 ou 3 telas
             sobrepostas; a do meio fica na frente)
     imgs    [nome-do-arquivo, texto alternativo]
   ============================================================ */
window.APPS = {

  /* ---------------------------------------------------------- */
  forja: {
    pasta: "img/forja/",
    repo: "https://github.com/marcos-scox/forja-app",
    eyebrow: "Forja Mobile",
    titulo: "Treino, cardio e evolução em um só lugar.",
    desc: "Organize seus treinos, acompanhe corridas com GPS, visualize sua evolução e tenha um IA Coach sempre disponível.",
    heroImg: ["cardio", "Forja rodando no celular: tela de cardio com mapa e GPS"],
    selo: "Versão 2.4.0 · APK disponível",
    fimTitulo: "Feito para quem treina de verdade.",
    fimDesc: "Dados guardados no próprio aparelho, sem servidor obrigatório. Código aberto no GitHub.",
    blocos: [
      { n:"01", tag:"Treinos", h:"Seu treino. Sua evolução.",
        p:"Organize suas sessões e acompanhe seu progresso.",
        layout:"um", imgs:[["treinos","Tela de treinos do Forja, com resumo e agenda de corridas"]] },

      { n:"02", tag:"Cardio", h:"Cada quilômetro conta.",
        p:"Acompanhe corrida, caminhada e ciclismo com GPS em tempo real.",
        layout:"destaque", imgs:[["cardio","Tela de cardio do Forja, com mapa e GPS em tempo real"]] },

      { n:"03", tag:"Histórico", h:"Toda evolução deixa rastros.",
        p:"Visualize sessões, distância e tempo acumulados.",
        layout:"pilha", imgs:[
          ["treinos","Resumo de treinos"],
          ["historico","Tela de histórico do Forja, com sessões acumuladas"],
          ["cardio","Tela de cardio"]] },

      { n:"04", tag:"IA Coach", h:"Um coach disponível a qualquer momento.",
        p:"Receba orientações para corrida, caminhada, mobilidade e treino.",
        layout:"um", imgs:[["coach","Tela do IA Coach do Forja respondendo sobre treino"]] },

      { n:"05", tag:"Configurações", h:"Inteligência do seu jeito.",
        p:"Configure o provedor e os recursos de IA da forma que preferir.",
        layout:"pilha", imgs:[
          ["ajustes","Tela de ajustes do Forja, com escolha de provedor de IA"],
          ["coach","Tela do IA Coach"]] },
    ]
  },

  /* ----------------------------------------------------------
     TRENNIX — os números e recursos abaixo vieram do README do
     repositório (12 treinos, 6 provedores, versão 1.3.0, stack
     Expo SDK 54). Se o app mudar, atualize aqui e no repo juntos.
     ---------------------------------------------------------- */
  trennix: {
    pasta: "img/trennix/",
    repo: "https://github.com/marcos-scox/trennix-app",
    eyebrow: "TRENNIX Mobile",
    titulo: "Monte o treino do seu jeito.",
    desc: "Escolha entre treinos prontos para casa ou academia, organize sua semana e tire dúvidas com um treinador de IA — tudo guardado no próprio aparelho.",
    heroImg: ["biblioteca", "TRENNIX rodando no celular: biblioteca de treinos em casa"],
    selo: "Versão 1.3.0 · Expo SDK 54",
    fimTitulo: "Sem cadastro, sem servidor, sem assinatura.",
    fimDesc: "Perfil, agenda e conversas ficam em arquivo local no aparelho. O app só acessa a internet quando você configura uma chave de IA. Código aberto no GitHub.",
    blocos: [
      { n:"01", tag:"Biblioteca", h:"Doze treinos prontos para começar.",
        p:"Seis para fazer em casa sem equipamento e seis para academia, com duração e número de exercícios em cada um.",
        layout:"pilha", imgs:[
          ["academia","Biblioteca do TRENNIX com os treinos de academia"],
          ["biblioteca","Biblioteca do TRENNIX com os treinos em casa"],
          ["academia","Treinos de academia"]] },

      { n:"02", tag:"Agenda", h:"Sua semana, do seu jeito.",
        p:"Toque em qualquer dia para ver o treino planejado e monte a rotina puxando exercícios da biblioteca.",
        layout:"destaque", imgs:[["agenda","Agenda semanal do TRENNIX, com os dias e o treino do dia"]] },

      { n:"03", tag:"Treinador IA", h:"Pergunte sobre seus exercícios.",
        p:"Um chat que responde sobre execução e rotina — deixando claro que não substitui orientação profissional.",
        layout:"um", imgs:[["chat","Chat IA do TRENNIX, com a mensagem de boas-vindas do treinador"]] },

      { n:"04", tag:"Provedores", h:"Você escolhe a inteligência.",
        p:"ChatGPT, Groq, Manus IA, Gemini, Claude IA ou DeepSeek. A chave é sua e fica guardada só neste aparelho.",
        layout:"um", imgs:[["provedor","Tela de escolha do provedor de IA e do modelo no TRENNIX"]] },

      { n:"05", tag:"Perfil", h:"Ajustado a quem treina.",
        p:"Nome, idade, altura, peso e foto, além de unidades, idioma e lembretes de treino.",
        layout:"pilha", imgs:[
          ["provedor","Preferências do TRENNIX"],
          ["perfil","Tela de perfil e preferências do TRENNIX"],
          ["agenda","Agenda do TRENNIX"]] },
    ]
  },

  finance: {
    pasta: "img/finance-curriculo/",
    repo: "https://github.com/marcos-scox/financas-app",
    eyebrow: "Finance+ Mobile",
    titulo: "Tudo sob controle, no seu ritmo.",
    desc: "Organize contas, acompanhe investimentos, crie reservas e converse com um assistente financeiro em uma experiência real de aplicativo.",
    heroImg: ["finance-inicio", "Finance+ — visão geral do aplicativo"],
    selo: "Finance+ · Aplicativo financeiro",
    fimTitulo: "Clareza para decidir melhor.",
    fimDesc: "Uma experiência financeira completa, com contas, patrimônio, reservas e orientação em um só lugar.",
    blocos: [
      { n:"01", tag:"Contas", h:"Veja os vencimentos sem perder o controle.",
        p:"Calendário, pagamentos e próximos vencimentos reunidos em uma tela simples de acompanhar.",
        layout:"destaque", imgs:[["finance-contas","Finance+ — tela de contas com calendário de vencimentos"]] },
      { n:"02", tag:"Investimentos", h:"Acompanhe onde seu dinheiro está.",
        p:"Registre sua carteira e conecte uma fonte de cotação para acompanhar preços em tempo real.",
        layout:"um", imgs:[["finance-investimentos","Finance+ — tela de investimentos e carteira"]] },
      { n:"03", tag:"Reservas", h:"Dê nome aos seus objetivos.",
        p:"Crie cofrinhos, acompanhe quanto já guardou e transforme planos em metas visíveis.",
        layout:"pilha", imgs:[["finance-inicio","Finance+ — visão geral"],["finance-cofrinho","Finance+ — tela de cofrinho e reserva"]] },
      { n:"04", tag:"Assistente", h:"Uma conversa para organizar o próximo passo.",
        p:"O assistente financeiro ajuda a refletir sobre contas, investimentos e objetivos, sempre com caráter educativo.",
        layout:"um", imgs:[["finance-assistente","Finance+ — assistente financeiro com IA"]] }
    ]
  },

  pipyscox: {
    landing: true,
    landingImage: "landing-page-reference",
    pasta: "img/pipyscox/",
    repo: "https://github.com/marcos-scox/pipyscox",
    eyebrow: "Pipyscox · Web + APK",
    titulo: "Fluxos organizados para equipes que precisam avançar.",
    desc: "Sistema de gestão de fluxos no estilo kanban, com quadro de trabalho, cards, fases, relatórios e uma experiência responsiva que funciona na web e no Android.",
    heroImg: ["dashboard", "Pipyscox — dashboard do sistema de gestão"],
    selo: "Pipyscox · Web responsiva + APK Android",
    fimTitulo: "Seu processo, do quadro ao resultado.",
    fimDesc: "O Pipyscox reúne operação, dados e acompanhamento em um só lugar — acessível pelo navegador ou pelo APK para Android.",
    landingBlocos: [
      { tag:"Fluxo inteligente", h:"Veja o fluxo inteiro de uma vez.",
        p:"Pare com a troca de abas e o caos de informações. Tenha uma visão completa de tudo o que importa para o seu time, em um só lugar.",
        bullets:["Projetos e tarefas organizados","Acompanhe o progresso em tempo real","Visualização em quadro, lista ou calendário"], img:"dashboard", alt:"Pipyscox — quadro de fluxos e tarefas" },
      { tag:"Organização sem esforço", h:"Tudo que a equipe precisa em cada card.",
        p:"Cada tarefa pode reunir responsáveis, prazos, tags, arquivos, comentários e histórico — sem perder o contexto do trabalho.",
        bullets:["Responsáveis e prazos","Anexos e comentários","Histórico de atividades"], img:"clientes", alt:"Pipyscox — detalhes de um card" },
      { tag:"Sempre com você", h:"Adapte o sistema ao seu processo.",
        p:"Com um app moderno e intuitivo, você acessa tudo de onde estiver. Mantenha sua equipe produtiva, mesmo fora do escritório.",
        bullets:["Funciona no navegador e no Android","Notificações em tempo real","Sincronização entre dispositivos"], img:"mobile-1", alt:"Pipyscox — versão mobile para Android" },
      { tag:"Planos e integrações", h:"Web no computador. APK no celular.",
        p:"Use diretamente no navegador ou instale o APK para Android. A mesma experiência, em qualquer lugar.",
        bullets:["Versão Web responsiva","APK para Android","Dados e fluxos sempre organizados"], img:"mobile-3", alt:"Pipyscox — versão Web e mobile" }
    ],
    blocos: [
      { n:"01", tag:"Quadro", h:"Veja o fluxo inteiro de uma vez.",
        p:"Pipys com fases, cores, ordem e cards arrastáveis para acompanhar cada etapa do trabalho com clareza.",
        layout:"destaque", imgs:[["dashboard","Pipyscox — dashboard com visão geral dos fluxos"]] },
      { n:"02", tag:"Dados", h:"Tudo que a equipe precisa em cada card.",
        p:"Cadastre clientes e processos com campos personalizados, tags, responsáveis, arquivos, comentários e histórico de atividades.",
        layout:"um", imgs:[["clientes","Pipyscox — gestão de clientes e cards"]] },
      { n:"03", tag:"Configurações", h:"Adapte o sistema ao seu processo.",
        p:"Configure fases, automações, preferências e o modo de trabalho de cada equipe sem perder a simplicidade da operação.",
        layout:"pilha", imgs:[["configuracoes","Pipyscox — configurações do sistema"],["mobile-1","Pipyscox — versão mobile no Android"],["mobile-2","Pipyscox — telas do sistema no celular"]] },
      { n:"04", tag:"Controle", h:"Acompanhe, exporte e mantenha tudo organizado.",
        p:"Relatórios em PDF, backup automático, exportação em ZIP e lixeira de 30 dias ajudam a preservar o histórico e os dados da operação.",
        layout:"um", imgs:[["lixeira","Pipyscox — lixeira e controle de dados"]] },
      { n:"05", tag:"Plataformas", h:"Web no computador. APK no celular.",
        p:"Use diretamente no navegador ou instale o APK para Android. A interface responsiva se adapta ao celular e ao tablet para acompanhar o trabalho de onde estiver.",
        layout:"pilha", imgs:[["mobile-3","Pipyscox — sistema aberto no celular"],["mobile-4","Pipyscox — navegação mobile"],["dashboard","Pipyscox — versão web do sistema"]] }
    ]
  }

};
