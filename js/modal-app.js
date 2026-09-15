/* ============================================================
   MODAL DE APRESENTAÇÃO DE APLICATIVO — mecânica
   ============================================================
   Serve qualquer app definido em js/apps.js. Um card abre o seu
   com data-abre-app="forja" (ou "trennix"); o conteúdo é montado
   na primeira abertura de cada app e fica em cache, então trocar
   de app não remonta o que já foi visto.

   Acessibilidade: trava o scroll de trás, prende o foco dentro do
   modal, fecha no ESC e devolve o foco pro card ao sair.

   O scroll acontece DENTRO do modal (position:fixed com
   overflow-y:auto), então todo cálculo usa modal.scrollTop —
   window.scrollY aqui é sempre 0.

   Efeitos ligados ao scroll, desligados em prefers-reduced-motion:
     · barra de progresso no topo
     · hero preso com zoom/rotação no aparelho
     · parallax nos celulares de cada bloco
     · cascata do texto (CSS + IntersectionObserver)
   ============================================================ */
(function(){

  const modal = document.getElementById("appModal");
  if(!modal || !window.APPS) return;

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

  /* ---------- montagem do HTML ---------- */

  function figura(pasta, nome, alt, ansioso){
    return `<img src="${pasta}${nome}-sm.webp"
      srcset="${pasta}${nome}-sm.webp 340w, ${pasta}${nome}.webp 620w"
      sizes="(max-width:959px) 60vw, 26vw"
      alt="${alt}" loading="${ansioso?"eager":"lazy"}" decoding="async">`;
  }

  function palco(app, b){
    if(b.layout === "pilha"){
      return `<div class="f-palco f-pilha f-anim">${
        b.imgs.map(([n,a])=>figura(app.pasta,n,a)).join("")}</div>`;
    }
    const extra = b.layout === "destaque" ? " f-destaque" : " f-um";
    return `<div class="f-palco${extra} f-anim">${
      figura(app.pasta, b.imgs[0][0], b.imgs[0][1])}</div>`;
  }

  function html(app){
    return `
    <div class="f-progresso" aria-hidden="true"><i></i></div>

    <button class="f-fechar" type="button" aria-label="Fechar apresentação">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
        <path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>

    <div class="f-hero-trilho">
      <section class="f-wrap f-hero">
        <div class="f-hero-texto">
          <span class="f-eyebrow f-anim">${app.eyebrow}</span>
          <h2 class="f-titulo f-anim d1" id="appModalTitulo">${app.titulo}</h2>
          <p class="f-desc f-anim d2">${app.desc}</p>
          <div class="f-acoes f-anim d3">
            <a class="f-btn f-btn-cheio" href="${app.repo}" target="_blank" rel="noopener">Conhecer o aplicativo</a>
            <button class="f-btn f-btn-vazio" type="button" data-ir="appFuncs">Ver funcionalidades ↓</button>
          </div>
        </div>
        <div class="f-hero-arte f-anim d2">
          <div class="f-hero-zoom">
            ${figura(app.pasta, app.heroImg[0], app.heroImg[1], true)}
          </div>
        </div>
      </section>
    </div>

    <div id="appFuncs">
    ${app.blocos.map(b=>`
      <section class="f-bloco">
        <div class="f-wrap f-bloco-grid">
          <div class="f-bloco-texto">
            <span class="f-num f-anim"><b>${b.n}</b> — ${b.tag}</span>
            <h3 class="f-anim d1">${b.h}</h3>
            <p class="f-anim d2">${b.p}</p>
          </div>
          ${palco(app,b)}
        </div>
      </section>`).join("")}
    </div>

    <section class="f-bloco f-fim">
      <div class="f-wrap">
        <span class="f-selo f-anim">${app.selo}</span>
        <h3 class="f-anim d1">${app.fimTitulo}</h3>
        <p class="f-anim d2">${app.fimDesc}</p>
        <div class="f-acoes f-anim d3">
          <a class="f-btn f-btn-cheio" href="${app.repo}" target="_blank" rel="noopener">Ver no GitHub ↗</a>
          <a class="f-btn f-btn-vazio" href="#contato" data-fechar-e-ir>Falar com o Marcos</a>
        </div>
      </div>
    </section>`;
  }

  /* ---------- estado ---------- */

  let abridor = null, atual = null;
  const telas = {};        // chave do app -> {no, io} já montado

  // elementos do app em exibição, usados pelo loop de scroll
  let barra = null, trilho = null, heroSec = null, heroZoom = null, heroTexto = null;
  let camadas = [], agendado = false, heroPreso = false;

  /* Quanto cada aparelho se desloca, em px, ao atravessar a tela.
     Negativo = sobe enquanto a página desce (parece mais distante).
     Nas pilhas cada um anda diferente: é isso que abre profundidade
     entre as telas sobrepostas. */
  const VEL_UM = -58, VEL_DESTAQUE = -74, VEL_PILHA = [-104, -32, -146];

  function mapearCamadas(raiz){
    camadas = [];
    raiz.querySelectorAll(".f-palco").forEach(p=>{
      const pilha = p.classList.contains("f-pilha");
      const base  = p.classList.contains("f-destaque") ? VEL_DESTAQUE : VEL_UM;
      [...p.querySelectorAll("img")].forEach((img,i)=>{
        camadas.push({ el:img, fator: pilha ? (VEL_PILHA[i] ?? -60) : base, centro:0 });
      });
    });
  }

  /* Mede, DE UMA VEZ, onde fica o centro de cada aparelho dentro do
     conteúdo rolável. Com isso o loop de scroll vira aritmética pura:
     antes ele fazia um getBoundingClientRect por imagem por frame, o
     que força o navegador a recalcular layout no meio da rolagem.
     Zera --py antes de medir, senão a medição herda o deslocamento do
     frame anterior e o parallax vai acumulando erro. */
  function medirCamadas(){
    if(!camadas.length) return;
    for(const c of camadas) c.el.style.setProperty("--py","0px");
    const topoModal = modal.getBoundingClientRect().top;
    const y = modal.scrollTop;
    for(const c of camadas){
      const r = c.el.getBoundingClientRect();
      c.centro = (r.top - topoModal) + y + r.height/2;
    }
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
    // normalizada em -1 .. 1 e multiplicada pela velocidade da camada
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

  /* ---------- montagem e troca de app ---------- */

  function montar(chave){
    if(telas[chave]) return telas[chave];

    const app = window.APPS[chave];
    const no = document.createElement("div");
    no.className = "f-tela";
    no.dataset.app = chave;
    no.innerHTML = html(app);
    modal.appendChild(no);

    no.querySelector(".f-fechar").addEventListener("click", fechar);

    // "Ver funcionalidades ↓" rola dentro do modal
    const irPara = no.querySelector("[data-ir]");
    if(irPara) irPara.addEventListener("click", ()=>{
      const alvo = no.querySelector("#appFuncs");
      if(alvo) alvo.scrollIntoView({behavior: reduzido() ? "auto" : "smooth", block:"start"});
    });

    // link de contato: fecha o modal e vai pra seção do site
    const contato = no.querySelector("[data-fechar-e-ir]");
    if(contato) contato.addEventListener("click", e=>{
      e.preventDefault(); fechar();
      setTimeout(()=>document.querySelector("#contato")?.scrollIntoView({behavior:"smooth"}), 340);
    });

    // entrada dos elementos ao rolar
    let io = null;
    if("IntersectionObserver" in window){
      io = new IntersectionObserver(es=>{
        es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("dentro"); io.unobserve(e.target); } });
      },{root:modal, rootMargin:"-40px", threshold:.12});
      no.querySelectorAll(".f-anim").forEach(el=>io.observe(el));
    } else {
      no.querySelectorAll(".f-anim").forEach(el=>el.classList.add("dentro"));
    }

    // as imagens dos blocos são lazy: quando carregam, a altura do
    // conteúdo muda e as posições medidas saem do lugar
    no.querySelectorAll("img").forEach(img=>{
      if(!img.complete) img.addEventListener("load", aoRedimensionar, {once:true});
    });

    telas[chave] = {no, io};
    return telas[chave];
  }

  function mostrar(chave){
    const {no} = montar(chave);
    // esconde as outras telas já montadas
    for(const k in telas) telas[k].no.hidden = (k !== chave);
    atual = chave;

    barra     = no.querySelector(".f-progresso i");
    trilho    = no.querySelector(".f-hero-trilho");
    heroSec   = no.querySelector(".f-hero");
    heroZoom  = no.querySelector(".f-hero-zoom");
    heroTexto = no.querySelector(".f-hero-texto");
    mapearCamadas(no);
    return no;
  }

  function abrir(chave, origem){
    if(!window.APPS[chave]) return;
    abridor = origem || null;
    const no = mostrar(chave);

    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("forja-travado");
    modal.scrollTop = 0;

    requestAnimationFrame(()=>{
      // o que já está na tela aparece sem esperar scroll
      no.querySelectorAll(".f-hero .f-anim").forEach(el=>el.classList.add("dentro"));
      // De novo, e só agora: ao TROCAR de app o scrollTop acima é aplicado
      // enquanto a tela anterior ainda ocupa altura, então o navegador
      // preserva parte da rolagem. Aqui o [hidden] já valeu e o zero pega.
      modal.scrollTop = 0;
      // só dá para medir depois que o modal está visível: enquanto ele
      // tem visibility:hidden, altura e posição saem zeradas
      medirCamadas();
      efeitosDeScroll();
    });
    setTimeout(()=>no.querySelector(".f-fechar")?.focus(), 90);
  }

  function fechar(){
    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("forja-travado");
    if(abridor) setTimeout(()=>abridor.focus(), 60);
  }

  /* ---------- eventos globais ---------- */

  modal.addEventListener("scroll", aoRolar, {passive:true});
  window.addEventListener("resize", aoRedimensionar);
  mqReduzido.addEventListener?.("change", ()=>{ medirCamadas(); efeitosDeScroll(); });

  // ESC fecha; Tab fica preso dentro da tela visível enquanto aberto
  document.addEventListener("keydown", e=>{
    if(!modal.classList.contains("aberto")) return;
    if(e.key === "Escape"){ fechar(); return; }
    if(e.key !== "Tab" || !atual) return;
    const focaveis = telas[atual].no.querySelectorAll(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])');
    if(!focaveis.length) return;
    const primeiro = focaveis[0], ultimo = focaveis[focaveis.length-1];
    if(e.shiftKey && document.activeElement === primeiro){ e.preventDefault(); ultimo.focus(); }
    else if(!e.shiftKey && document.activeElement === ultimo){ e.preventDefault(); primeiro.focus(); }
  });

  // qualquer elemento com data-abre-app="<chave>" abre a apresentação
  document.addEventListener("click", e=>{
    const gatilho = e.target.closest("[data-abre-app]");
    if(!gatilho) return;
    e.preventDefault();
    abrir(gatilho.dataset.abreApp, gatilho);
  });

  window.abrirApp = abrir;      // útil para testar no console
})();
