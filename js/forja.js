/* ============================================================
   MODAL DE APRESENTAÇÃO — FORJA
   ============================================================
   Monta o conteúdo só na primeira abertura (não pesa o
   carregamento da home) e cuida de acessibilidade: trava o
   scroll de trás, prende o foco dentro do modal, fecha no ESC
   e devolve o foco pro card ao sair.

   O scroll acontece DENTRO do modal (ele é position:fixed com
   overflow-y:auto), então todo cálculo usa modal.scrollTop —
   window.scrollY aqui é sempre 0.

   Efeitos ligados ao scroll, todos desligados em
   prefers-reduced-motion:
     · barra de progresso no topo
     · hero preso com zoom/rotação no aparelho
     · parallax nos celulares de cada bloco
     · cascata do texto (essa parte é CSS + IntersectionObserver)
   ============================================================ */
(function(){

  const TELAS = "img/forja/";

  const BLOCOS = [
    { n:"01", tag:"Treinos",
      h:"Seu treino. Sua evolução.",
      p:"Organize suas sessões e acompanhe seu progresso.",
      layout:"um", imgs:[["treinos","Tela de treinos do Forja, com resumo e agenda de corridas"]] },

    { n:"02", tag:"Cardio",
      h:"Cada quilômetro conta.",
      p:"Acompanhe corrida, caminhada e ciclismo com GPS em tempo real.",
      layout:"destaque", imgs:[["cardio","Tela de cardio do Forja, com mapa e GPS em tempo real"]] },

    { n:"03", tag:"Histórico",
      h:"Toda evolução deixa rastros.",
      p:"Visualize sessões, distância e tempo acumulados.",
      layout:"pilha", imgs:[
        ["treinos","Resumo de treinos"],
        ["historico","Tela de histórico do Forja, com sessões acumuladas"],
        ["cardio","Tela de cardio"]] },

    { n:"04", tag:"IA Coach",
      h:"Um coach disponível a qualquer momento.",
      p:"Receba orientações para corrida, caminhada, mobilidade e treino.",
      layout:"um", imgs:[["coach","Tela do IA Coach do Forja respondendo sobre treino"]] },

    { n:"05", tag:"Configurações",
      h:"Inteligência do seu jeito.",
      p:"Configure o provedor e os recursos de IA da forma que preferir.",
      layout:"pilha2", imgs:[
        ["ajustes","Tela de ajustes do Forja, com escolha de provedor de IA"],
        ["coach","Tela do IA Coach"]] },
  ];

  const REPO = "https://github.com/marcos-scox/forja-app";

  function figura(nome, alt, ansioso){
    return `<img src="${TELAS}${nome}-sm.webp"
      srcset="${TELAS}${nome}-sm.webp 340w, ${TELAS}${nome}.webp 620w"
      sizes="(max-width:959px) 60vw, 26vw"
      alt="${alt}" loading="${ansioso?"eager":"lazy"}" decoding="async">`;
  }

  function palco(b){
    if(b.layout === "pilha" || b.layout === "pilha2"){
      return `<div class="f-palco f-pilha f-anim">${
        b.imgs.map(([n,a])=>figura(n,a)).join("")}</div>`;
    }
    const extra = b.layout === "destaque" ? " f-destaque" : " f-um";
    return `<div class="f-palco${extra} f-anim">${figura(b.imgs[0][0], b.imgs[0][1])}</div>`;
  }

  function html(){
    return `
    <div class="f-progresso" aria-hidden="true"><i></i></div>

    <button class="f-fechar" type="button" aria-label="Fechar apresentação">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
        <path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="f-hero-trilho">
      <section class="f-wrap f-hero">
        <div class="f-hero-texto">
          <span class="f-eyebrow f-anim">Forja Mobile</span>
          <h2 class="f-titulo f-anim d1" id="forjaTitulo">Treino, cardio e evolução em um só lugar.</h2>
          <p class="f-desc f-anim d2">Organize seus treinos, acompanhe corridas com GPS, visualize
          sua evolução e tenha um IA Coach sempre disponível.</p>
          <div class="f-acoes f-anim d3">
            <a class="f-btn f-btn-cheio" href="${REPO}" target="_blank" rel="noopener">Conhecer o aplicativo</a>
            <button class="f-btn f-btn-vazio" type="button" data-ir="forjaFuncs">Ver funcionalidades ↓</button>
          </div>
        </div>
        <div class="f-hero-arte f-anim d2">
          <div class="f-hero-zoom">
            ${figura("cardio","Forja rodando no celular: tela de cardio com mapa e GPS", true)}
          </div>
        </div>
      </section>
    </div>

    <div id="forjaFuncs">
    ${BLOCOS.map(b=>`
      <section class="f-bloco">
        <div class="f-wrap f-bloco-grid">
          <div class="f-bloco-texto">
            <span class="f-num f-anim"><b>${b.n}</b> — ${b.tag}</span>
            <h3 class="f-anim d1">${b.h}</h3>
            <p class="f-anim d2">${b.p}</p>
          </div>
          ${palco(b)}
        </div>
      </section>`).join("")}
    </div>

    <section class="f-bloco f-fim">
      <div class="f-wrap">
        <span class="f-selo f-anim">Versão 2.4.0 · APK disponível</span>
        <h3 class="f-anim d1">Feito para quem treina de verdade.</h3>
        <p class="f-anim d2">Dados guardados no próprio aparelho, sem servidor obrigatório.
        Código aberto no GitHub.</p>
        <div class="f-acoes f-anim d3">
          <a class="f-btn f-btn-cheio" href="${REPO}" target="_blank" rel="noopener">Ver no GitHub ↗</a>
          <a class="f-btn f-btn-vazio" href="#contato" data-fechar-e-ir>Falar com o Marcos</a>
        </div>
      </div>
    </section>`;
  }

  /* ---------------------------------------------------------- */
  const modal = document.getElementById("forjaModal");
  if(!modal) return;

  /* ?movimento=1 força as animações mesmo com movimento reduzido no
     sistema. Serve só para pré-visualizar (o Windows com "Efeitos de
     animação" desligado suprime tudo); nenhum visitante chega com
     esse parâmetro, então a preferência segue respeitada. */
  const FORCADO = new URLSearchParams(location.search).has("movimento");
  if(FORCADO) document.documentElement.classList.add("forca-movimento");

  /* MediaQueryList criada uma vez: chamar matchMedia() dentro do loop
     de scroll aloca um objeto novo a cada frame, à toa. */
  const mqReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduzido = ()=>!FORCADO && mqReduzido.matches;

  let montado = false, abridor = null, io = null;

  /* elementos que o loop de scroll toca — guardados uma vez só */
  let barra = null, trilho = null, heroSec = null, heroZoom = null, heroTexto = null;
  let camadas = [];        // {el, fator, centro} de cada aparelho com parallax
  let agendado = false, heroPreso = false;

  /* Quanto cada aparelho se desloca, em px, ao atravessar a tela.
     Negativo = sobe enquanto a página desce (parece mais distante).
     Nas pilhas cada um anda diferente: é isso que abre profundidade
     entre as três telas sobrepostas. */
  const VEL_UM = -58, VEL_DESTAQUE = -74, VEL_PILHA = [-104, -32, -146];

  function mapearCamadas(){
    camadas = [];
    modal.querySelectorAll(".f-palco").forEach(p=>{
      const pilha = p.classList.contains("f-pilha");
      const base  = p.classList.contains("f-destaque") ? VEL_DESTAQUE : VEL_UM;
      [...p.querySelectorAll("img")].forEach((img,i)=>{
        camadas.push({ el:img, fator: pilha ? (VEL_PILHA[i] ?? -60) : base, centro:0 });
      });
    });
  }

  /* Mede, DE UMA VEZ, onde fica o centro de cada aparelho dentro do
     conteúdo rolável. Com isso o loop de scroll vira aritmética pura:
     antes ele fazia 8 getBoundingClientRect por frame, o que força o
     navegador a recalcular layout no meio da rolagem.
     Zera --py antes de medir, senão a medição herda o deslocamento
     do frame anterior e o parallax vai acumulando erro. */
  function medirCamadas(){
    if(!camadas.length) return;
    for(const c of camadas) c.el.style.setProperty("--py","0px");
    const topoModal = modal.getBoundingClientRect().top;
    const y = modal.scrollTop;
    for(const c of camadas){
      const r = c.el.getBoundingClientRect();
      c.centro = (r.top - topoModal) + y + r.height/2;
    }
    // o hero só gruda no desktop; guarda o estado para não consultar
    // getComputedStyle a cada frame
    heroPreso = !!(heroSec && getComputedStyle(heroSec).position === "sticky");
  }

  function efeitosDeScroll(){
    const alturaVista = modal.clientHeight;
    const percurso    = modal.scrollHeight - alturaVista;
    const y           = modal.scrollTop;

    // barra de progresso: escala em vez de width, para não relayoutar
    if(barra) barra.style.transform = `scaleX(${percurso > 0 ? (y/percurso).toFixed(4) : 0})`;

    if(reduzido()) return;

    // parallax: distância do centro do aparelho até o centro da tela,
    // normalizada em -1 .. 1 e multiplicada pela velocidade da camada.
    // Sem leitura de layout — só contas sobre o que foi medido antes.
    const meio = alturaVista/2, limite = alturaVista + 260;
    for(const c of camadas){
      const d = c.centro - y - meio;
      if(d < -limite || d > limite) continue;      // longe da tela, nem escreve
      c.el.style.setProperty("--py", (d/alturaVista*c.fator).toFixed(1) + "px");
    }

    // hero preso: enquanto o trilho passa, o aparelho cresce e gira de
    // leve e o texto sai de cena. Só existe onde o CSS realmente pina.
    if(heroZoom && trilho){
      const sobra = trilho.offsetHeight - alturaVista;
      if(heroPreso && sobra > 40){
        const p = Math.min(Math.max(y / sobra, 0), 1);
        heroZoom.style.transform =
          `scale(${(1 + p*.17).toFixed(3)}) rotate(${(p*-5).toFixed(2)}deg) translateY(${(p*-26).toFixed(1)}px)`;
        if(heroTexto){
          heroTexto.style.opacity   = (1 - p*.9).toFixed(3);
          heroTexto.style.transform = `translateY(${(p*-46).toFixed(1)}px)`;
        }
      } else {
        // no celular (ou com o modal redimensionado) some com o inline
        heroZoom.style.transform = "";
        if(heroTexto){ heroTexto.style.opacity = ""; heroTexto.style.transform = ""; }
      }
    }
  }

  /* um cálculo por frame, no máximo */
  function aoRolar(){
    if(agendado) return;
    agendado = true;
    requestAnimationFrame(()=>{ agendado = false; efeitosDeScroll(); });
  }

  /* remedir é caro: só depois que o usuário parou de redimensionar */
  let esperaResize = 0;
  function aoRedimensionar(){
    clearTimeout(esperaResize);
    esperaResize = setTimeout(()=>{ medirCamadas(); efeitosDeScroll(); }, 150);
  }

  function montar(){
    if(montado) return;
    modal.innerHTML = html();
    montado = true;

    barra     = modal.querySelector(".f-progresso i");
    trilho    = modal.querySelector(".f-hero-trilho");
    heroSec   = modal.querySelector(".f-hero");
    heroZoom  = modal.querySelector(".f-hero-zoom");
    heroTexto = modal.querySelector(".f-hero-texto");
    mapearCamadas();

    modal.querySelector(".f-fechar").addEventListener("click", fechar);

    // "Ver funcionalidades ↓" rola dentro do modal
    const irPara = modal.querySelector("[data-ir]");
    if(irPara) irPara.addEventListener("click", ()=>{
      const alvo = modal.querySelector("#" + irPara.dataset.ir);
      if(alvo) alvo.scrollIntoView({behavior: reduzido() ? "auto" : "smooth", block:"start"});
    });

    // link de contato: fecha o modal e vai pra seção do site
    const contato = modal.querySelector("[data-fechar-e-ir]");
    if(contato) contato.addEventListener("click", e=>{
      e.preventDefault(); fechar();
      setTimeout(()=>document.querySelector("#contato")?.scrollIntoView({behavior:"smooth"}), 340);
    });

    // entrada dos elementos ao rolar
    if("IntersectionObserver" in window){
      io = new IntersectionObserver(es=>{
        es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("dentro"); io.unobserve(e.target); } });
      },{root:modal, rootMargin:"-40px", threshold:.12});
      modal.querySelectorAll(".f-anim").forEach(el=>io.observe(el));
    } else {
      modal.querySelectorAll(".f-anim").forEach(el=>el.classList.add("dentro"));
    }

    modal.addEventListener("scroll", aoRolar, {passive:true});
    window.addEventListener("resize", aoRedimensionar);
    // se a pessoa mudar a preferência de movimento com o modal aberto,
    // limpa o que ficou aplicado e recalcula
    mqReduzido.addEventListener?.("change", ()=>{ medirCamadas(); efeitosDeScroll(); });
    // as imagens dos blocos são lazy: quando carregam, a altura do
    // conteúdo muda e as posições medidas saem do lugar
    modal.querySelectorAll("img").forEach(img=>{
      if(!img.complete) img.addEventListener("load", aoRedimensionar, {once:true});
    });
  }

  function abrir(origem){
    abridor = origem || null;
    montar();
    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("forja-travado");
    modal.scrollTop = 0;
    // o que já está na tela aparece sem esperar scroll
    requestAnimationFrame(()=>{
      modal.querySelectorAll(".f-hero .f-anim").forEach(el=>el.classList.add("dentro"));
      // só dá para medir depois que o modal está visível: enquanto ele
      // tem visibility:hidden, altura e posição saem zeradas
      medirCamadas();
      efeitosDeScroll();
    });
    setTimeout(()=>modal.querySelector(".f-fechar")?.focus(), 90);
  }

  function fechar(){
    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("forja-travado");
    if(abridor) setTimeout(()=>abridor.focus(), 60);
  }

  // ESC fecha; Tab fica preso dentro do modal enquanto aberto
  document.addEventListener("keydown", e=>{
    if(!modal.classList.contains("aberto")) return;
    if(e.key === "Escape"){ fechar(); return; }
    if(e.key !== "Tab") return;
    const focaveis = modal.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
    if(!focaveis.length) return;
    const primeiro = focaveis[0], ultimo = focaveis[focaveis.length-1];
    if(e.shiftKey && document.activeElement === primeiro){ e.preventDefault(); ultimo.focus(); }
    else if(!e.shiftKey && document.activeElement === ultimo){ e.preventDefault(); primeiro.focus(); }
  });

  // qualquer elemento com data-abre-forja abre a apresentação
  document.addEventListener("click", e=>{
    const gatilho = e.target.closest("[data-abre-forja]");
    if(!gatilho) return;
    e.preventDefault();
    abrir(gatilho);
  });

  window.abrirForja = abrir;   // útil para testar no console
})();
