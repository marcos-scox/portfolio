/* ============================================================
   CONTEÚDO — edite daqui
   ============================================================ */
const ROLES = ["Automação","IA aplicada","Sistemas","Sites"];

/* Os mockups em SVG foram substituídos pelos prints reais em img/.
   O mapa de imagens fica em SHOTS, mais abaixo. */

/* pronto:true  -> mostra o print de img/ (chave em SHOTS)
   pronto:false -> card fica neutro com selo "Em construção"
   link         -> opcional; se existir, o card vira link para o projeto
   Quando o sistema estiver no ar, troque pronto para true. */
const PROJECTS = [
  // slides -> vira um slider dentro do card, trocando sozinho
  // abreApp -> clicar abre a apresentação completa em modal
  //            (a chave precisa existir em APPS, no js/apps.js)
  { t:"Forja", cat:"App mobile · React Native", span:7, pronto:true, abreApp:"forja",
    desc:"Treinos e cardio com GPS em tempo real, histórico local e coach de IA.",
    // o slide 0 é a capa da apresentação; os demais são as telas do app
    slides:[
      { img:"forja-0", alt:"Forja — capa da apresentação do aplicativo", capa:true },
      { img:"forja-1", alt:"Forja — tela de treinos com agenda de corridas" },
      { img:"forja-2", alt:"Forja — cardio com mapa e GPS em tempo real" },
      { img:"forja-3", alt:"Forja — coach de IA respondendo sobre treino" },
      { img:"forja-4", alt:"Forja — histórico de sessões" },
      { img:"forja-5", alt:"Forja — ajustes e provedor de IA" }
    ] },
  { t:"TRENNIX", cat:"App mobile · Expo / React Native", span:5, pronto:true, abreApp:"trennix",
    desc:"Doze treinos prontos, agenda semanal e treinador de IA — tudo salvo no aparelho.",
    slides:[
      // capa recortada para o card estreito (span 5 ≈ 1.12 de proporção),
      // por isso as larguras diferem das telas do app
      { img:"trennix-0", alt:"TRENNIX — capa da apresentação do aplicativo",
        capa:true, largura:900, larguraSm:520 },
      { img:"trennix-1", alt:"TRENNIX — perfil e preferências" },
      { img:"trennix-2", alt:"TRENNIX — biblioteca de treinos em casa" },
      { img:"trennix-3", alt:"TRENNIX — agenda semanal de treinos" },
      { img:"trennix-4", alt:"TRENNIX — chat com o treinador de IA" },
      { img:"trennix-5", alt:"TRENNIX — escolha do provedor de IA" }
    ] },
  { t:"Painel financeiro", cat:"Sistema web · Finanças", span:5, mock:"dashboard", pronto:true,
    link:"https://github.com/marcos-scox/financas-app",
    desc:"Indicadores financeiros, visão de resultados e dados organizados para decisões mais seguras." },
  { t:"Currículo online", cat:"Site pessoal · Web", span:7, mock:"siteInstitucional", pronto:true,
    link:"https://github.com/marcos-scox/curriculo-facil",
    desc:"Uma apresentação profissional clara, responsiva e pensada para transformar experiência em oportunidade." }
];

const NOTES = [
  { t:"Automatizar processo ruim só faz ele falhar mais rápido",
    d:"Antes de montar o fluxo, vale desenhar o processo como ele é hoje — inclusive as gambiarras que ninguém admite em reunião.",
    read:"4 min", date:"Ago 2026" },
  { t:"Sistema bom é o que a equipe usa sem manual",
    d:"Se precisa de treinamento de duas horas para cadastrar um cliente, o problema não é a equipe.",
    read:"3 min", date:"Jul 2026" },
  { t:"Permissão é no banco, não no navegador",
    d:"Esconder o botão não é controle de acesso. A regra tem que viver onde o dado mora, senão é só decoração.",
    read:"5 min", date:"Jul 2026" },
  { t:"Planilha compartilhada não é sistema",
    d:"Funciona até a terceira pessoa editar ao mesmo tempo. Depois disso, alguém sempre perde trabalho.",
    read:"4 min", date:"Jun 2026" }
];

/* Laboratório: sites e sistemas de gestão */
const EXPERIMENTS = [
  { t:"Sistema de gestão de clientes", tag:"CRM",        mock:"gestaoTabela" },
  { t:"Site institucional",            tag:"Web",        mock:"siteInstitucional" },
  { t:"Quadro de pendências",          tag:"Operação",   mock:"kanban" },
  { t:"Agenda e escala de equipe",     tag:"Gestão",     mock:"agenda" },
  { t:"Ficha de cadastro",             tag:"Formulário", mock:"formulario" },
  { t:"Relatório mensal",              tag:"Relatórios", mock:"relatorio" },
  { t:"Painel de indicadores",         tag:"Dados",      mock:"dashboard" },
  { t:"Portal de acesso",              tag:"Login",      mock:"login" }
];

const STATS = [
  ["40+","Fluxos em produção","rodando diariamente sem supervisão"],
  ["12","Sistemas entregues","do protótipo ao ar"],
  ["6","Integrações ativas","conversando entre si em tempo real"]
];

/* ?movimento=1 força as animações mesmo com movimento reduzido no sistema
   (Windows com "Efeitos de animação" desligado suprime tudo). É só para
   pré-visualizar: nenhum visitante chega com esse parâmetro, então a
   preferência de acessibilidade continua valendo. O mesmo atalho existe
   em js/modal-app.js — os dois precisam concordar, senão o site anima e
   o modal não, ou vice-versa. */
const FORCA_MOVIMENTO = new URLSearchParams(location.search).has("movimento");
const REDUCED = !FORCA_MOVIMENTO
  && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   IMAGENS DAS TELAS
   ============================================================
   Cada chave de mock aponta para o arquivo em img/.
   Existem dois tamanhos: -sm (640px, para as miniaturas do
   Laboratório) e o normal (1168px, para cards e lightbox).
   O srcset deixa o navegador baixar só o que precisa. */
const SHOTS = {
  forja:             "forja",
  gestaoTabela:      "gestao-clientes",
  siteInstitucional: "site-institucional",
  dashboard:         "dashboard",
  agenda:            "agenda",
  formulario:        "formulario",
  kanban:            "kanban",
  relatorio:         "relatorio",
  login:             "login"
};

/* tamanhos: quanto o navegador deve reservar para a imagem em cada layout */
function shot(chave, alt, tamanhos, prioridade){
  const n = SHOTS[chave];
  if(!n) return "";
  return `<img class="shot" src="img/${n}-sm.webp"
    srcset="img/${n}-sm.webp 640w, img/${n}.webp 1168w"
    sizes="${tamanhos}" alt="${alt}"
    loading="${prioridade ? "eager" : "lazy"}" decoding="async">`;
}

/* ============================================================
   MONTAGEM
   ============================================================ */
/* --i alimenta o transition-delay no CSS: entrada em cascata, sem timer em JS */
/* Cards de Trabalhos ainda sem tela real.
   Para publicar um projeto: adicione a chave dele em SHOTS (imagem em img/)
   e troque `pronto:false` por `pronto:true` na lista PROJECTS.
   O card passa a mostrar o print automaticamente, sem mexer em mais nada. */
document.getElementById("bento").innerHTML = PROJECTS.map((p,i)=>{
  // duas coisas diferentes: ter o print pronto, e o projeto estar no ar.
  // Um projeto pode estar no ar sem eu ter subido a imagem ainda.
  const temSlides = !!(p.slides && p.slides.length);
  const temTela = temSlides || !!(p.pronto && SHOTS[p.mock] && p.temImagem !== false);
  // com link o card vira <a> de verdade (teclado e clique-do-meio funcionam);
  // com abreApp vira botão que abre a apresentação em modal
  const tag  = p.abreApp ? "button" : (p.link ? "a" : "article");
  const attr = p.abreApp
    ? ` type="button" data-abre-app="${p.abreApp}" aria-label="Abrir apresentação do ${p.t}"`
    : p.link
      ? ` href="${p.link}" target="_blank" rel="noopener"`
      : (temTela ? ' tabindex="0"' : "");

  return `
  <${tag} class="card c${p.span} inview rise-card${temTela ? "" : " card-soon"}${(p.link||p.abreApp) ? " card-link" : ""}" style="--i:${i}"${attr}>
    <div class="frame">
      ${temSlides
        ? `<div class="slider" data-slider>
             ${p.slides.map((s,n)=>`
               <img class="shot slide${n===0?" ativo":""}${s.capa?" slide-capa":""}"
                 src="img/${s.img}-sm.webp"
                 srcset="img/${s.img}-sm.webp ${s.larguraSm||640}w, img/${s.img}.webp ${s.largura||1168}w"
                 sizes="(max-width:767px) 92vw, ${p.span===7?"58vw":"42vw"}"
                 alt="${s.alt}" loading="${n===0?"eager":"lazy"}" decoding="async">`).join("")}
             <div class="slider-pontos">
               ${p.slides.map((_,n)=>`<i class="${n===0?"ativo":""}"></i>`).join("")}
             </div>
           </div>`
        : temTela
          ? shot(p.mock, "Tela do projeto: "+p.t, `(max-width:767px) 92vw, ${p.span===7?"58vw":"42vw"}`)
          : `<div class="soon" aria-hidden="true"></div>`}
      <div class="halftone"></div>
      <div class="base">
        <span class="eyebrow">${p.cat}</span>
        <h3>${p.t}</h3>
        ${p.desc ? `<p class="card-desc">${p.desc}</p>` : ""}
        ${p.pronto ? "" : `<span class="soon-badge">Em construção</span>`}
      </div>
      ${temTela ? `
      <div class="veil">
        <span class="viewpill">
          <span class="ring grad-anim"></span>
          <span class="face">${p.abreApp ? "Ver apresentação →" : p.link ? "Ver no GitHub ↗" : `Ver — <em class="serif">${p.t}</em>`}</span>
        </span>
      </div>` : ""}
    </div>
  </${tag}>`;
}).join("");

document.getElementById("journal").innerHTML = NOTES.map((n,i)=>`
  <a href="#" class="jrow inview rise-row" style="--i:${i}">
    <span class="jnum">${String(i+1).padStart(2,"0")}</span>
    <div class="txt"><h3>${n.t}</h3><p>${n.d}</p></div>
    <div class="meta"><span>${n.read} de leitura</span><span>${n.date}</span></div>
    <span class="arrow">↗</span>
  </a>`).join("");

const half = Math.ceil(EXPERIMENTS.length/2);
const rot = [-2.5,1.8,-1.2,2.2,-1.8,1.4];
const item = (e,i)=>`
  <figure class="par-item" style="transform:rotate(${rot[i%rot.length]}deg)" data-mock="${e.mock}" data-title="${e.t}" tabindex="0">
    ${shot(e.mock, "Tela: "+e.t, "(max-width:767px) 45vw, 320px")}
    <figcaption class="cap"><b>${e.t}</b><i>${e.tag}</i></figcaption>
  </figure>`;
document.getElementById("parA").innerHTML = EXPERIMENTS.slice(0,half).map(item).join("");
document.getElementById("parB").innerHTML = EXPERIMENTS.slice(half).map((e,i)=>item(e,i+half)).join("");

document.getElementById("stats").innerHTML = STATS.map(([v,l,n],i)=>`
  <div class="inview rise-stat" style="--i:${i}"><p class="val" data-target="${v}">0</p><p class="lab">${l}</p><p class="note">${n}</p></div>`).join("");

document.getElementById("marqueeTrack").innerHTML =
  Array.from({length:10},()=>`<span>IA · AUTOMAÇÃO · SITES · SISTEMAS • </span>`).join("");

document.getElementById("year").textContent = new Date().getFullYear();

/* ============================================================
   VÍDEO DE FUNDO (HLS)
   ============================================================ */
function mountVideo(el){
  const src = el.dataset.src;
  if(!src) return;
  if(src.endsWith(".m3u8")){
    if(window.Hls && Hls.isSupported()){
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(el);
      hls.on(Hls.Events.MANIFEST_PARSED, ()=>el.play().catch(()=>{}));
    } else if(el.canPlayType("application/vnd.apple.mpegurl")){
      el.src = src;                       // Safari toca HLS nativo
      el.play().catch(()=>{});
    }
  } else {
    el.src = src;                         // mp4/webm comum
    el.play().catch(()=>{});
  }
}
/* PERFORMANCE — dois vídeos decodificando ao mesmo tempo pesa muito.
   Só toca o que está na tela; o de fora pausa e libera a CPU/GPU.
   O do rodapé nem carrega até chegar perto dele. */
(function(){
  const hero = document.getElementById("heroVideo");
  const foot = document.getElementById("footVideo");
  const videos = [hero,foot].filter(Boolean);
  if(!videos.length) return;

  function montar(v){
    if(v.dataset.mounted) return;
    v.dataset.mounted = "1";
    mountVideo(v);
  }

  // O vídeo do topo sempre carrega e toca — é o fundo da primeira tela.
  // Não depende de observer nenhum para aparecer.
  if(hero) montar(hero);

  if(!("IntersectionObserver" in window)){ if(foot) montar(foot); return; }

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      const v = e.target;
      if(e.isIntersecting){
        montar(v);                       // rodapé só carrega ao chegar perto
        v.play().catch(()=>{});
      } else if(v.dataset.mounted){
        v.pause();                       // fora da tela: libera CPU/GPU
      }
    });
  },{rootMargin:"200px"});

  videos.forEach(v=>io.observe(v));

  // Aba em segundo plano: pausa tudo.
  document.addEventListener("visibilitychange",()=>{
    videos.forEach(v=>{
      if(!v.dataset.mounted) return;
      if(document.hidden) v.pause();
      else if(v.getBoundingClientRect().top < window.innerHeight && v.getBoundingClientRect().bottom > 0) v.play().catch(()=>{});
    });
  });
})();

/* ============================================================
   PERFORMANCE — pausa gradientes animados fora da tela
   ============================================================
   Animar background-position força repaint a cada frame. Os rings
   que ficam sempre visíveis (logo, retrato) continuam animando,
   mas só enquanto estão realmente na tela. */
(function(){
  // Todo elemento com animação infinita: gradientes, marquee do rodapé,
  // seta de scroll e o ponto de status. Fora da tela, nada disso precisa rodar.
  const alvos = document.querySelectorAll(
    ".grad-anim, .marquee .track, .scrollhint .track span, .status .dot"
  );
  if(!alvos.length || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>e.target.classList.toggle("anim-off", !e.isIntersecting));
  },{rootMargin:"100px"});

  alvos.forEach(el=>{ el.classList.add("anim-off"); io.observe(el); });

  // Aba em segundo plano: pausa tudo.
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden) alvos.forEach(el=>el.classList.add("anim-off"));
  });
})();

/* ============================================================
   SLIDER DOS CARDS
   ============================================================
   Troca as telas sozinho. Só roda enquanto o card está na tela
   (mesma lógica das outras animações) e para quando a aba sai
   de foco ou o usuário passa o mouse por cima. */
(function(){
  const INTERVALO = 3200;
  const sliders = document.querySelectorAll("[data-slider]");
  if(!sliders.length) return;

  sliders.forEach(sl=>{
    const slides = [...sl.querySelectorAll(".slide")];
    const pontos = [...sl.querySelectorAll(".slider-pontos i")];
    if(slides.length < 2) return;

    let atual = 0, timer = null, visivel = false, pausado = false;
    // usado tanto para pausar no hover quanto para marcar a capa
    const card = sl.closest(".card") || sl;

    /* A capa da apresentação já traz título e texto desenhados. Marcar o
       card enquanto ela está no ar deixa o CSS escurecer mais a base, para
       o texto do site continuar legível sem competir com a arte. */
    function marcarCapa(){
      if(card) card.classList.toggle("com-capa", slides[atual].classList.contains("slide-capa"));
    }
    marcarCapa();

    function mostrar(n){
      slides[atual].classList.remove("ativo");
      if(pontos[atual]) pontos[atual].classList.remove("ativo");
      atual = (n + slides.length) % slides.length;
      slides[atual].classList.add("ativo");
      if(pontos[atual]) pontos[atual].classList.add("ativo");
      marcarCapa();
    }

    function tocar(){
      if(timer || !visivel || pausado || REDUCED) return;
      timer = setInterval(()=>mostrar(atual+1), INTERVALO);
    }
    function parar(){ clearInterval(timer); timer = null; }

    // só anima enquanto o card está na tela
    if("IntersectionObserver" in window){
      new IntersectionObserver(es=>{
        visivel = es[0].isIntersecting;
        visivel ? tocar() : parar();
      },{threshold:.25}).observe(sl);
    } else { visivel = true; tocar(); }

    // parar no hover deixa a pessoa olhar a tela com calma
    card.addEventListener("mouseenter", ()=>{ pausado = true;  parar(); });
    card.addEventListener("mouseleave", ()=>{ pausado = false; tocar(); });

    document.addEventListener("visibilitychange", ()=>{
      document.hidden ? parar() : tocar();
    });

    // clicar num ponto vai direto para aquela tela
    pontos.forEach((pt,n)=>{
      pt.addEventListener("click", e=>{
        e.preventDefault(); e.stopPropagation();   // não dispara o link do card
        mostrar(n); parar(); tocar();
      });
    });
  });
})();

/* ============================================================
   BARRA DE PROGRESSO — fallback
   ============================================================
   Chrome/Edge modernos animam a barra fora da thread principal
   pelo CSS (animation-timeline). Só entra JS onde isso não existe. */
(function(){
  const bar = document.getElementById("scrollBar");
  if(!bar) return;
  if(CSS.supports("animation-timeline","scroll(root)")) return;  // CSS já cuida
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;
  function atualizar(){
    const alcance = document.documentElement.scrollHeight - window.innerHeight;
    const p = alcance > 0 ? window.scrollY / alcance : 0;
    bar.style.transform = "scaleX(" + Math.min(Math.max(p,0),1) + ")";
    ticking = false;
  }
  window.addEventListener("scroll",()=>{
    if(!ticking){ requestAnimationFrame(atualizar); ticking = true; }
  },{passive:true});
  window.addEventListener("resize",atualizar,{passive:true});
  atualizar();
})();

/* ============================================================
   ENTRADA
   ============================================================ */
document.body.classList.add("ready");

/* ============================================================
   PAPÉIS ROTATIVOS
   ============================================================ */
(function(){
  const el=document.getElementById("role"); let i=0;
  setInterval(()=>{
    i=(i+1)%ROLES.length; el.textContent=ROLES[i];
    el.style.animation="none"; void el.offsetWidth; el.style.animation="rolefade .4s ease-out";
  },2000);
})();

/* ============================================================
   NAVBAR
   ============================================================ */
(function(){
  const pill=document.getElementById("navPill");
  const links=[...document.querySelectorAll('nav.pill ul a')];
  const onScroll=()=>pill.classList.toggle("scrolled", window.scrollY>100);
  onScroll(); window.addEventListener("scroll",onScroll,{passive:true});

  const secs=links.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const io=new IntersectionObserver(es=>{
    const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!v) return;
    links.forEach(a=>a.classList.toggle("active", a.getAttribute("href")==="#"+v.target.id));
  },{rootMargin:"-40% 0px -55% 0px",threshold:[0,.25,.5,1]});
  secs.forEach(s=>io.observe(s));
})();

/* ============================================================
   ENTRADA AO ROLAR + CONTADOR
   ============================================================ */
(function(){
  const io=new IntersectionObserver(es=>{
    // A cascata vale só entre os que entram na tela JUNTOS.
    // Quem entra sozinho (rolagem lenta) aparece na hora, sem atraso —
    // senão o último item de uma lista pareceria travado.
    const entrando = es.filter(e=>e.isIntersecting);
    if(!entrando.length) return;

    // ordena por posição na tela: de cima para baixo, da esquerda para a direita
    entrando.sort((a,b)=>{
      const ra=a.boundingClientRect, rb=b.boundingClientRect;
      return (ra.top - rb.top) || (ra.left - rb.left);
    });

    entrando.forEach((e,idx)=>{
      e.target.style.setProperty("--i", idx);
      e.target.classList.add("on");
      const v=e.target.querySelector(".val");
      if(v && !v.dataset.done) countUp(v);
      io.unobserve(e.target);
    });
  },{rootMargin:"-60px",threshold:.15});
  document.querySelectorAll(".inview").forEach(el=>io.observe(el));

  function countUp(el){
    el.dataset.done="1";
    const raw=el.dataset.target;
    const target=parseInt(raw.replace(/\D/g,""),10)||0;
    const sfx=raw.replace(/[\d]/g,"");
    if(REDUCED){ el.textContent=raw; return; }
    const s=performance.now(), d=1400;
    (function t(now){
      const p=Math.min((now-s)/d,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(e*target)+sfx;
      if(p<1) requestAnimationFrame(t);
    })(performance.now());
  }
})();

/* ============================================================
   PARALLAX DAS COLUNAS
   ============================================================ */
(function(){
  if(REDUCED) return;
  const stage=document.getElementById("parStage");
  const cols=[...document.querySelectorAll(".par-col")];
  let ticking=false;

  function update(){
    const r=stage.getBoundingClientRect();
    const total=r.height+window.innerHeight;
    const p=Math.min(Math.max((window.innerHeight-r.top)/total,0),1); // 0→1 ao atravessar
    cols.forEach(c=>{
      const speed=parseFloat(c.dataset.speed)||0;
      c.style.transform=`translate3d(0,${(p-0.5)*speed*stage.offsetHeight}px,0)`;
    });
    ticking=false;
  }
  window.addEventListener("scroll",()=>{
    if(!ticking){ requestAnimationFrame(update); ticking=true; }
  },{passive:true});
  window.addEventListener("resize",update);
  update();
})();

/* ============================================================
   LIGHTBOX
   ============================================================ */
(function(){
  const box=document.getElementById("lightbox"), img=document.getElementById("lightboxImg");
  document.querySelectorAll(".par-item").forEach(f=>{
    const open=()=>{
      const n = SHOTS[f.dataset.mock];
      if(!n) return;
      // aqui usa a versão grande e inteira — quem ampliou quer ver a tela toda
      img.innerHTML = `<img src="img/${n}.webp" alt="Tela: ${f.dataset.title}" decoding="async">`;
      box.classList.add("open");
    };
    f.addEventListener("click",open);
    f.addEventListener("keydown",e=>{ if(e.key==="Enter") open(); });
  });
  const close=()=>box.classList.remove("open");
  box.addEventListener("click",close);
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") close(); });
})();
