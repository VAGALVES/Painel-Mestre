/* ---- Banco de expressões (English Overdrive Word Families) ----
   Camada de consulta: navega o banco por tipo → família → grupo semântico, ou busca em
   inglês e português ao mesmo tempo. Os dados vêm de expressoes.js e não são alterados —
   a curadoria, os grupos e a rastreabilidade até a página do material original são preservados. */
/* O banco de expressões vem de expressoes.js, um arquivo à parte, OPCIONAL e carregado
   DEPOIS que o app já está na tela: são ~300 KB, e carregá-lo junto atrasava a abertura
   no celular. Enquanto não chega (ou se não existir no deploy), a aba mostra o estado e
   todo o resto do app funciona normalmente. */
let dbStatus = 'carregando'; // carregando | pronto | ausente
function hasDb(){ return typeof EXPR_DB !== 'undefined' && EXPR_DB && Object.keys(EXPR_DB).length > 0; }
function loadExprDb(){
  const s = document.createElement('script');
  s.src = 'expressoes.js';
  s.async = true;
  s.onload = ()=>{
    dbStatus = hasDb() ? 'pronto' : 'ausente';
    if(dbStatus === 'pronto' && (!dbState.family || !EXPR_DB[dbState.family])) dbState.family = dbFamiliesOfType(dbState.type === DB_PHRASES ? 'Verbos' : dbState.type)[0];
    renderDb();
    buildVerbBank(); buildSignalBank(); buildWhBank(); // os painéis passam a existir assim que o banco chega
    renderPractice(); // habilita as origens que dependem do banco
    if(typeof estRender === 'function') estRender();   /* v164 */
  };
  s.onerror = ()=>{ dbStatus = 'ausente'; renderDb(); };
  document.body.appendChild(s);
}
const DB_TYPES = ["Verbos","Conceituais","Estruturais","Frases prontas"];
/* Frases prontas: unidades fechadas ("Take care!", "Let's go!") que não entram em nenhum
   motor — se aprendem inteiras. Identificadas por começarem com maiúscula no banco. */
const DB_PHRASES = "Frases prontas";
function dbIsPhrase(it){ return /^[A-Z]/.test(it.expression); }
function dbAllPhrases(){
  const out = [];
  Object.keys(EXPR_DB).forEach(fam=> EXPR_DB[fam].items.forEach(it=>{ if(dbIsPhrase(it)) out.push({fam, it}); }));
  return out;
}
let dbState = { type:"Verbos", family:null, group:null, query:"", limit:60 };
const DB_PAGE = 60;

function dbFamiliesOfType(t){ return Object.keys(EXPR_DB).filter(k => EXPR_DB[k].type === t); }
function dbNorm(s){ return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

/* Busca varre as 1.668 expressões nos dois idiomas; fora da busca, mostra a família aberta. */
function dbResults(){
  const q = dbNorm(dbState.query.trim());
  if(q){
    const out = [];
    Object.keys(EXPR_DB).forEach(fam=>{
      EXPR_DB[fam].items.forEach(it=>{
        if(dbNorm(it.expression).includes(q) || dbNorm(it.translation).includes(q)) out.push({fam, it});
      });
    });
    return out;
  }
  if(dbState.type === DB_PHRASES){
    return dbAllPhrases().filter(r => !dbState.group || r.fam === dbState.group);
  }
  const fam = dbState.family;
  if(!fam || !EXPR_DB[fam]) return [];
  return EXPR_DB[fam].items
    .filter(it => !dbState.group || it.group === dbState.group)
    .map(it => ({fam, it}));
}

function buildDbTypes(){
  const el = document.getElementById('dbTypeRow'); el.innerHTML="";
  DB_TYPES.forEach(t=>{
    const n = (t===DB_PHRASES) ? dbAllPhrases().length : dbFamiliesOfType(t).length;
    const b = document.createElement('div'); b.className='pronome-pill';
    b.dataset.active = (dbState.type===t && !dbState.query);
    b.textContent = `${t} (${n})`;
    b.onclick = ()=>{ dbState.type=t; dbState.family = (t===DB_PHRASES) ? null : dbFamiliesOfType(t)[0];
      dbState.group=null; dbState.query=""; document.getElementById('dbSearch').value=""; dbState.limit=DB_PAGE; renderDb(); };
    el.appendChild(b);
  });
}
function buildDbFamilies(){
  const el = document.getElementById('dbFamilyRow'); el.innerHTML="";
  const wrap = document.getElementById('dbFamilyGroup');
  wrap.style.display = (dbState.type === DB_PHRASES) ? 'none' : '';
  if(dbState.type === DB_PHRASES) return;
  dbFamiliesOfType(dbState.type).forEach(fam=>{
    const b = document.createElement('div'); b.className='signal-chip fam-chip';
    b.dataset.active = (dbState.family===fam && !dbState.query);
    b.innerHTML = `${fam}<span class="fam-count">${EXPR_DB[fam].items.length}</span>`;
    b.onclick = ()=>{ dbState.family=fam; dbState.group=null; dbState.query="";
      document.getElementById('dbSearch').value=""; dbState.limit=DB_PAGE; renderDb(); };
    el.appendChild(b);
  });
  scrollChipIntoRow(el, el.querySelector('[data-active="true"]'));
}
function buildDbGroups(){
  const wrap = document.getElementById('dbGroupWrap');
  const el = document.getElementById('dbGroupRow'); el.innerHTML="";
  if(dbState.type === DB_PHRASES && !dbState.query){
    /* nas frases prontas, o filtro é por família de origem */
    wrap.style.display = '';
    const all = dbAllPhrases();
    const fams = [...new Set(all.map(r=>r.fam))];
    const b0 = document.createElement('div'); b0.className='signal-chip';
    b0.dataset.active = (dbState.group===null); b0.textContent = `todas (${all.length})`;
    b0.onclick = ()=>{ dbState.group=null; dbState.limit=DB_PAGE; renderDb(); };
    el.appendChild(b0);
    fams.forEach(f=>{
      const n = all.filter(r=>r.fam===f).length;
      const c = document.createElement('div'); c.className='signal-chip';
      c.dataset.active = (dbState.group===f); c.textContent = `${f} (${n})`;
      c.onclick = ()=>{ dbState.group = (dbState.group===f) ? null : f; dbState.limit=DB_PAGE; renderDb(); };
      el.appendChild(c);
    });
    return;
  }
  const fam = EXPR_DB[dbState.family];
  if(dbState.query || !fam){ wrap.style.display='none'; return; }
  const groups = [...new Set(fam.items.map(i=>i.group))];
  wrap.style.display = groups.length > 1 ? '' : 'none';
  if(groups.length <= 1) return;
  const all = document.createElement('div'); all.className='signal-chip';
  all.dataset.active = (dbState.group===null); all.textContent = `todos (${fam.items.length})`;
  all.onclick = ()=>{ dbState.group=null; dbState.limit=DB_PAGE; renderDb(); };
  el.appendChild(all);
  groups.forEach(g=>{
    const n = fam.items.filter(i=>i.group===g).length;
    const c = document.createElement('div'); c.className='signal-chip';
    c.dataset.active = (dbState.group===g); c.textContent = `${g} (${n})`;
    c.onclick = ()=>{ dbState.group = (dbState.group===g) ? null : g; dbState.limit=DB_PAGE; renderDb(); };
    el.appendChild(c);
  });
}
function buildDbHead(){
  const box = document.getElementById('dbFamilyHead');
  const fam = EXPR_DB[dbState.family];
  if(dbState.query || dbState.type === DB_PHRASES || !fam){ box.innerHTML=""; return; }
  box.innerHTML = `<div class="db-fam-head">
    <div class="db-fam-name">${dbState.family}</div>
    <div class="db-fam-core">${escapeHTML(fam.core)}</div>
    <div class="db-fam-pages">${escapeHTML(fam.pages)}</div>
    <div class="db-maps">${fam.maps.map(m=>`<div class="db-map"><b>${escapeHTML(m[0])}</b><span>${escapeHTML(m[1])}</span></div>`).join('')}</div>
  </div>`;
}
function renderDb(){
  const sec = document.getElementById('console-expressoes');
  const pill = document.getElementById('navExpressoes');
  if(!hasDb()){
    /* ausente: esconde a aba. carregando: mantém visível com aviso, para o usuário
       saber que o banco está a caminho em vez de achar que sumiu. */
    if(dbStatus === 'ausente'){
      if(sec) sec.style.display = 'none';
      if(pill) pill.style.display = 'none';
    } else {
      if(sec) sec.style.display = '';
      if(pill) pill.style.display = '';
      const list = document.getElementById('dbList');
      if(list) list.innerHTML = '<div class="db-empty">Carregando o banco de expressões…</div>';
      const st = document.getElementById('dbStats');
      if(st) st.textContent = '';
    }
    return;
  }
  if(sec) sec.style.display = '';
  if(pill) pill.style.display = '';
  buildDbTypes(); buildDbFamilies(); buildDbHead(); buildDbGroups();
  saveState(); applyA11y(); updateScrollShadows();
  const res = dbResults();
  const list = document.getElementById('dbList');
  const total = Object.values(EXPR_DB).reduce((a,v)=>a+v.items.length,0);
  document.getElementById('dbStats').textContent = dbState.query
    ? `${res.length} resultado(s) para "${dbState.query}" · ${total} expressões no banco`
    : `${res.length} expressão(ões) nesta seleção · ${total} no banco · ${Object.keys(EXPR_DB).length} famílias`;

  if(!res.length){ list.innerHTML = `<div class="db-empty">Nada encontrado. Tente outra palavra, em inglês ou português.</div>`; return; }
  const slice = res.slice(0, dbState.limit);
  list.innerHTML = slice.map(({fam,it})=>`
    <div class="db-item">
      ${(dbState.query || dbState.type === DB_PHRASES) ? `<div class="db-hit">${fam}</div>` : ``}
      <div class="db-expr-row">
        <div class="db-expr">${escapeHTML(it.expression)}</div>
        <button class="audio-btn sm" data-text="${escapeHTML(it.expression.replace(/^to /,''))}" title="Ouvir">🔊</button>
      </div>
      <div class="db-trans">${escapeHTML(it.translation)}</div>
      <div class="db-meta">
        <span class="db-tag">${escapeHTML(it.group)}</span>
        <span class="db-tag src">${escapeHTML(it.source)} p.${escapeHTML(it.page)}</span>
        ${it.note ? `<span class="db-note">${escapeHTML(it.note)}</span>` : ``}
      </div>
    </div>`).join('');
  if(res.length > slice.length){
    const btn = document.createElement('button'); btn.className='db-more';
    btn.textContent = `Mostrar mais (${res.length - slice.length} restantes)`;
    btn.onclick = ()=>{ dbState.limit += DB_PAGE; renderDb(); };
    list.appendChild(btn);
  }
}
const dbSearchEl = document.getElementById('dbSearch');
if(dbSearchEl) dbSearchEl.addEventListener('input', e=>{
  dbState.query = e.target.value; dbState.limit = DB_PAGE; renderDb();
});


/* selo do rodapé a partir da constante única, para não haver versão escrita à mão */
(function selo(){ const el = document.getElementById('appVersion');
  if(el) el.textContent = 'Painel Mestre do Inglês · v' + APP_VERSION; })();
buildMatrixSource();

/* ---- Anatomia da frase: guia dos encaixes ----
   Tudo é gerado pelo motor a partir de combinações declaradas aqui, e não escrito à mão:
   se um sinal mudar de encaixe ou de tradução, este guia acompanha sozinho. */
const ANAT_EXEMPLOS = [
  /* ================= Duplas: duas perguntas bastam ================= */
  { g:"Duplas — duas perguntas bastam",
    titulo:"Como + quando",
    t:"past", a:"simples", f:"afirmativa", v:"work", ends:["hard","yesterday"],
    why:"A dupla que sustenta a maioria dos relatos: como foi feito e quando. Duas peças já fecham uma frase completa e natural." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Quantas vezes + quando",
    t:"past", a:"simples", f:"afirmativa", v:"go", ends:["twice","last week"],
    why:"Contagem e momento. Ambos violeta, mas de encaixes diferentes — por isso somam em vez de competir." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Como + onde",
    t:"present", a:"continuo", f:"afirmativa", v:"work", ends:["alone","at home"],
    why:"Descreve uma cena em curso: de que jeito e em que lugar." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Quanto + como",
    t:"present", a:"simples", f:"afirmativa", v:"speak", ends:["a bit","slowly"],
    why:"O grau modula o modo (“um pouco devagar”). Ordem fixa: quem mede vem antes de quem descreve." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Onde + por quanto tempo",
    t:"past", a:"continuo", f:"afirmativa", v:"work", ends:["at home","all day long"],
    why:"Lugar e duração: o par típico do passado contínuo, que pinta um período inteiro em andamento." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Quanto + em relação a quê",
    t:"present", a:"simples", f:"afirmativa", v:"work", ends:["a bit","more than usual"],
    why:"“Um pouco mais do que o normal”: o grau mede, a comparação dá a régua. Nuance que sem as duas peças exigiria uma oração inteira." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Onde + quando — marcar um compromisso",
    t:"future", a:"simples", f:"afirmativa", v:"wait", ends:["here","tomorrow"],
    why:"Combinar um encontro é dizer onde e quando; o resto o interlocutor já sabe. A frase mais prática do idioma." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Onde + quantas vezes — a rotina",
    t:"present", a:"simples", f:"afirmativa", v:"work", ends:["at home","every day"],
    why:"Rotina em duas peças. Repare na ordem: o palco (lugar) vem antes do relógio (periodicidade)." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Quantas vezes + por quanto tempo",
    t:"present", a:"simples", f:"afirmativa", v:"run", ends:["every day","for an hour"],
    why:"Treino em uma linha: com que frequência e por quanto tempo. A periodicidade antecede a duração." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Por quanto tempo + quando",
    t:"past", a:"continuo", f:"afirmativa", v:"work", ends:["all day long","yesterday"],
    why:"A duração vem primeiro, o dia depois: “o dia inteiro, ontem”. Dois violetas de encaixes vizinhos." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Comparação + marco temporal",
    t:"present", a:"perfeito", f:"afirmativa", v:"sleep", ends:["better than ever","this week"],
    why:"A comparação introduz progresso, e o marco (“esta semana”) delimita a janela em que ele vale." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Contagem + recorte “até agora”",
    t:"present", a:"perfeito", f:"afirmativa", v:"visit", ends:["twice","so far"],
    why:"Combinação típica do present perfect. Em português a contagem pede o pretérito simples (“visitei duas vezes”); o “tenho visitado” soaria como hábito." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Onde + aproximação de tempo",
    t:"past", a:"simples", f:"afirmativa", v:"come", ends:["here","about an hour ago"],
    why:"Quando a hora exata não importa, “about” aproxima. A aproximação é encaixe próprio, distinto do tempo definido." },
  { g:"Duplas — duas perguntas bastam",
    titulo:"Aproximação + frequência numa peça só",
    t:"present", a:"simples", f:"afirmativa", v:"call", ends:["about twice a week"],
    why:"Uma única peça que responde “quantas vezes?” já com a margem de aproximação embutida." },

  /* ================= Trios e quartetos ================= */
  { g:"Trios e quartetos",
    titulo:"Como + onde + quando — o trio clássico",
    t:"future", a:"simples", f:"afirmativa", v:"work", ends:["hard","at home","tomorrow"],
    why:"É o que os manuais chamam de MPT (manner, place, time). Se lembrar de uma regra só, que seja esta." },
  { g:"Trios e quartetos",
    titulo:"O trio no presente contínuo",
    t:"present", a:"continuo", f:"afirmativa", v:"work", ends:["hard","at home","right now"],
    why:"A mesma fórmula vale em qualquer tempo — aqui com o “agora” explícito fechando a frase." },
  { g:"Trios e quartetos",
    titulo:"Como + quantas vezes + quando",
    t:"past", a:"simples", f:"afirmativa", v:"run", ends:["fast","twice","last week"],
    why:"Trio sem lugar: quando o cenário é óbvio, a frase ganha precisão sem ganhar peso." },
  { g:"Trios e quartetos",
    titulo:"Quanto + como + onde",
    t:"present", a:"continuo", f:"afirmativa", v:"work", ends:["a bit","slowly","at home"],
    why:"Dois laranjas de encaixes distintos seguidos do verde: mede, descreve, situa." },
  { g:"Trios e quartetos",
    titulo:"Como + duração no perfect contínuo",
    t:"present", a:"perfeito_continuo", f:"afirmativa", v:"work", ends:["hard","for two hours"],
    why:"O perfect contínuo já carrega a ideia de duração; o adjunto a torna exata." },
  { g:"Trios e quartetos",
    titulo:"Como + onde + quantas vezes + quando",
    t:"past", a:"simples", f:"afirmativa", v:"work", ends:["hard","at home","twice","last month"],
    why:"Quatro peças ainda soam naturais porque seguem a ordem das cores. Daqui para cima, a frase começa a pesar." },
  { g:"Trios e quartetos",
    titulo:"Sequência abre a frase",
    t:"past", a:"simples", f:"afirmativa", v:"eat", ends:["first","at home"],
    why:"Sequência é o único adjunto que o inglês prefere no INÍCIO, seguido de vírgula. Os demais continuam no fim." },
  { g:"Trios e quartetos",
    titulo:"Narrar: sequência + modo + tempo",
    t:"past", a:"simples", f:"afirmativa", v:"leave", ends:["afterwards","quietly","last night"],
    why:"A estrutura de quem conta uma história: marca a ordem, descreve como e situa no tempo." },

  /* ================= O corredor do meio ================= */
  { g:"O corredor do meio — antes do verbo",
    titulo:"Frequência: “Sempre?”",
    t:"present", a:"simples", f:"afirmativa", v:"work", mid:"usually", ends:["at home"],
    why:"Frequência indefinida mora no MEIO (“I usually work”). O lugar segue no fim: posições diferentes, nada disputa." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Meio + como + onde",
    t:"present", a:"simples", f:"afirmativa", v:"eat", mid:"always", ends:["slowly","at home"],
    why:"O advérbio do meio responde “com que frequência”; os dois de fim descrevem o jeito e o lugar." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"O mesmo meio no passado",
    t:"past", a:"simples", f:"afirmativa", v:"work", mid:"often", ends:["hard","last year"],
    why:"“I often worked hard last year”: a posição não muda com o tempo verbal. Frequência no meio, tempo no fim." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Foco: “Só?”",
    t:"present", a:"simples", f:"afirmativa", v:"work", mid:"only", ends:["at home"],
    why:"O foco (only, also, even) delimita o que a frase afirma: trabalho em casa e em nenhum outro lugar." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Foco + frequência",
    t:"present", a:"simples", f:"afirmativa", v:"work", mid:["also","usually"], ends:["at home"],
    why:"Dois encaixes do meio empilhados, sempre nesta ordem: foco antes de frequência." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Fase: “Já?” e “ainda?”",
    t:"present", a:"continuo", f:"afirmativa", v:"work", mid:"still", ends:["at home"],
    why:"A fase diz em que ponto a ação está: “already” (já feita), “still” (em curso), “finally” (enfim feita)." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Fase no perfect: o recorte do “já”",
    t:"present", a:"perfeito", f:"afirmativa", v:"call", mid:"already", ends:["twice","today"],
    why:"“Already” é o advérbio de meio por excelência do perfect: a ação aconteceu antes do esperado. Entra depois de “have”." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Certeza + fase",
    t:"present", a:"perfeito", f:"afirmativa", v:"call", mid:["probably","already"], ends:["twice"],
    why:"“Probably already”: a certeza vem antes da fase. A ordem inversa soa estranha em inglês." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Intensidade: o “mal” e o “quase”",
    t:"past", a:"simples", f:"afirmativa", v:"sleep", mid:"barely", ends:["last night"],
    why:"Intensidade é o último encaixe antes do verbo: “barely slept” (mal dormi). Aqui o português também põe antes." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Intensidade que troca de lado em português",
    t:"past", a:"simples", f:"afirmativa", v:"forget", mid:"completely",
    why:"No inglês “completely” fica antes do verbo; em português costuma ir depois: “esqueci completamente”. O motor faz a troca." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"“Currently” abre a frase em português",
    t:"present", a:"continuo", f:"afirmativa", v:"work", mid:"currently", ends:["at home"],
    why:"No inglês mora no meio (“I am currently working”); em português soa melhor no início: “Atualmente, estou trabalhando”." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Meio + o trio clássico",
    t:"future", a:"simples", f:"afirmativa", v:"work", mid:"definitely", ends:["hard","at home","tomorrow"],
    why:"Quatro encaixes: o meio se soma ao trio sem tirar o lugar de ninguém." },
  { g:"O corredor do meio — antes do verbo",
    titulo:"Três do corredor: certeza + foco + fase",
    t:"present", a:"continuo", f:"afirmativa", v:"work", mid:["probably","also","still"], ends:["at home"],
    why:"Três encaixes do meio na ordem do corredor: “será, só, já”. Dá para dizer, mas pesa — o normal é usar um ou dois." },

  /* ================= Negar ================= */
  { g:"Negar — o que muda de lugar",
    titulo:"Polaridade fecha a negativa",
    t:"past", a:"simples", f:"negativa", v:"sleep", ends:["well","at all"],
    why:"“At all” só existe em frase negada (ou pergunta) e vai por último, reforçando a negação de tudo que veio antes." },
  { g:"Negar — o que muda de lugar",
    titulo:"Há quanto tempo não…",
    t:"present", a:"perfeito", f:"negativa", v:"sleep", ends:["well","in ages"],
    why:"“In ages” só existe em negativa e mede há quanto tempo algo não acontece. Em português: “faz séculos que não durmo bem”." },
  { g:"Negar — o que muda de lugar",
    titulo:"A certeza fura a fila",
    t:"future", a:"simples", f:"negativa", v:"go", mid:"probably", ends:["there","tomorrow"],
    why:"Certeza vai ANTES do auxiliar negado (“I probably won't go”); a frequência, ao contrário, fica depois (“I don't often go”)." },
  { g:"Negar — o que muda de lugar",
    titulo:"Certeza + frequência na negativa",
    t:"present", a:"simples", f:"negativa", v:"work", mid:["probably","always"], ends:["at home"],
    why:"A certeza passa à frente do “don't”; a frequência entra depois dele: “I probably don't always work at home”. Em português, “nem sempre”." },
  { g:"Negar — o que muda de lugar",
    titulo:"“Still” também fura a fila",
    t:"present", a:"continuo", f:"negativa", v:"work", mid:"still", ends:["at home"],
    why:"“I'm still not working”, nunca “I'm not still working”. Em português o par é o mesmo: “ainda não”." },
];

/* ---- Atalhos mentais: formas de decorar a anatomia sem decorar a tabela ----
   Cada atalho tem uma frase viva gerada pelo motor (nunca escrita à mão), então o que o card
   mostra é, por construção, o que o motor produz. */
const ATALHOS = [
  { nome:"Como → Onde → Quando", mn:"o trio clássico",
    regra:"Depois do verbo, a frase inglesa responde sempre nesta ordem: como se faz, onde, quando. Só isso já acerta a esmagadora maioria das frases do dia a dia.",
    cfg:{ t:"future", a:"simples", f:"afirmativa", v:"work", ends:["hard","at home","tomorrow"] } },
  { nome:"Ação → Palco → Relógio", mn:"laranja · verde · violeta",
    regra:"O trio generalizado para as 9 peças de fim. Primeiro o que descreve a ação (grau, modo, comparação — laranja); depois o palco (lugar — verde); por fim o relógio (periodicidade, duração, aproximação, tempo — violeta), e a polaridade, quando existe, fecha tudo. Não precisa decorar encaixe por encaixe: olhe as cores. Se estiverem na ordem laranja → verde → violeta, a frase está em ordem.",
    cfg:{ t:"past", a:"simples", f:"afirmativa", v:"work", ends:["hard","at home","twice","last month"] } },
  { nome:"O corredor do verbo", mn:"Será · Só · Sempre · Já · Muito",
    regra:"Antes do verbo há uma fila de cinco encaixes, e a ordem é a de cinco perguntas curtas: Será? (certeza: probably) · Só? (foco: only, also) · Sempre? (frequência: always) · Já? (fase: already, still) · Muito? (intensidade: really). Cada palavra do mnemônico é o protótipo do seu encaixe. A fila começa logo depois do primeiro auxiliar: “I have probably already called”.",
    cfg:{ t:"present", a:"continuo", f:"afirmativa", v:"work", mid:["probably","also","still"], ends:["at home"] } },
  { nome:"O que passa na frente do “not”", mn:"certeza e still · na frente",
    regra:"Na negativa, duas peças do corredor furam a fila e ficam antes do auxiliar: a certeza (“I probably don't”) e o still (“I still don't”). As demais entram depois do “not”: “I don't usually”, “I don't really”. Um cuidado: “I really don't” e “I don't really” têm sentidos diferentes (ênfase × atenuação).",
    cfg:{ t:"present", a:"simples", f:"negativa", v:"work", mid:["probably","always"], ends:["at home"] } },
  { nome:"Espelho português ↔ inglês", mn:"traduza o encaixe, não a posição",
    regra:"O português manda para depois do verbo muito do que o inglês põe antes (“completamente”, “totalmente”) e leva para o início o que o inglês põe no meio (“atualmente”, “inicialmente”). Quem traduz a posição fala inglês com sotaque de português; quem traduz o encaixe acerta o lugar sozinho.",
    cfg:{ t:"past", a:"simples", f:"afirmativa", v:"forget", mid:"completely" } },
  { nome:"A régua do 2-3-4", mn:"fala 2 · relato 3 · limite 4",
    regra:"Heurística de uso, não regra gramatical. Antes de falar, imagine as perguntas que o ouvinte faria e preencha só essas. Duas peças de fim sustentam uma conversa; três, um relato; quatro, uma narrativa cuidadosa. Passou disso, é exercício de montagem, não fala.",
    cfg:{ t:"past", a:"simples", f:"afirmativa", v:"work", ends:["hard","yesterday"] } },
];

/* v173: o objeto — o substantivo e seus 8 adjetivos. Os cards carregam o sintagma em cfg.np e vão para o montador. */
const ANAT_NP = "O objeto — o substantivo e seus 8 adjetivos";
ANAT_EXEMPLOS.push(
  { g:ANAT_NP, titulo:"Os oito, na ordem",
    t:"past", a:"simples", f:"afirmativa", v:"buy",
    np:{ det:"a", noun:"table", adj:{ opiniao:"lovely", tamanho:"big", idade:"old", forma:"round", cor:"red", origem:"Italian", material:"wooden", proposito:"dining" } },
    why:"Opinião → tamanho → idade → forma → cor → origem → material → propósito. É raro passar de três, mas a fila é sempre esta: a opinião (quem fala) abre e o propósito (para que serve) fica colado ao substantivo, como em “dining table”." },
  { g:ANAT_NP, titulo:"Propósito: o 8º, colado ao substantivo",
    t:"past", a:"simples", f:"afirmativa", v:"buy",
    np:{ det:"a", noun:"bag", adj:{ tamanho:"big", cor:"blue", proposito:"sleeping" } },
    why:"O propósito (para que serve) vem por último, junto do substantivo: “a big blue sleeping bag”. Em português ele vira “de …” logo depois do substantivo: “um saco de dormir grande e azul”." },
  { g:ANAT_NP, titulo:"Opinião + tamanho + cor",
    t:"past", a:"simples", f:"afirmativa", v:"buy",
    np:{ det:"a", noun:"car", adj:{ opiniao:"beautiful", tamanho:"small", cor:"red" } },
    why:"O trio mais frequente. Quem opina vem primeiro; o tamanho antes da cor. Trocar de lugar (“a red small car”) soa estranho a qualquer nativo." },
  { g:ANAT_NP, titulo:"Idade antes de cor",
    t:"past", a:"simples", f:"afirmativa", v:"buy",
    np:{ det:"an", noun:"bag", adj:{ idade:"old", cor:"brown", material:"leather" } },
    why:"Idade → cor → material. Repare em “an”: a/an acompanha o SOM da primeira palavra depois dele (“an old”, mas “a brown”)." },
  { g:ANAT_NP, titulo:"Origem e material colados ao substantivo",
    t:"past", a:"simples", f:"afirmativa", v:"find",
    np:{ det:"a", noun:"vase", adj:{ forma:"round", origem:"Chinese", material:"ceramic" } },
    why:"Quanto mais “classificatório” o adjetivo (de onde é, do que é feito), mais perto do substantivo ele fica. Em português a lista vai depois do substantivo: “um vaso redondo chinês de cerâmica”." },
  { g:ANAT_NP, titulo:"O objeto antes dos encaixes de fim",
    t:"past", a:"simples", f:"afirmativa", v:"buy", ends:["quickly","at home","yesterday"],
    np:{ det:"a", noun:"lamp", adj:{ opiniao:"lovely", idade:"old", origem:"French" } },
    why:"A frase inteira: verbo → objeto (com seus adjetivos) → como → onde → quando. O sintagma nominal nunca é cortado pelos advérbios." },
  { g:ANAT_NP, titulo:"Nada muda na negativa",
    t:"past", a:"simples", f:"negativa", v:"buy",
    np:{ det:"a", noun:"sofa", adj:{ tamanho:"huge", cor:"yellow", material:"velvet" } },
    why:"Negar o verbo (didn’t buy) não mexe na ordem dos adjetivos: eles continuam em fila dentro do objeto." }
);

function anatFrase(cfg){
  /* Guarda de integridade: se um verbo ou sinal do exemplo não existir no banco (ou não valer
     naquele formato), o motor cairia no padrão em silêncio e o card mostraria outra frase.
     Melhor gritar. */
  if(verbById(cfg.v).id !== cfg.v) console.warn('[anatomia] verbo inexistente:', cfg.v, '→', cfg.titulo);
  const key = `${cfg.t}_${cfg.a}`;
  const pool = SIGNAL_WORDS[key] || [];
  const achar = x => pool.find(s => s.w === x);
  const nomesMeio = [].concat(cfg.mid || []);
  [].concat(nomesMeio, cfg.ends || []).forEach(x=>{
    const s = achar(x);
    if(!s) console.warn('[anatomia] sinal ausente em', key, ':', x, '→', cfg.titulo);
    else if(!signalAllowed(s, cfg.f)) console.warn('[anatomia] sinal não vale em', cfg.f, ':', x, '→', cfg.titulo);
  });
  const verb = verbById(cfg.v);
  const mids = nomesMeio.map(achar).filter(Boolean);
  const ends = (cfg.ends || []).map(achar).filter(Boolean);
  const g = generate('fact', cfg.t, cfg.a, cfg.f, 'I', verb);
  /* v173: sintagma nominal opcional (determinante + adjetivos + substantivo) logo depois do verbo */
  const np = cfg.np ? npMonta(cfg.np) : null, colNP = np ? { raw:np.raw, pt:np.pt, en:np.plain } : null;
  const raw = applySignal(g.text, mids.length ? mids : null, ends, colNP, null, cfg.f) + (g.isQuestion ? M('?') : '.');
  const pt = translate('fact', cfg.t, cfg.a, cfg.f, 'I', mids.length ? mids : null, ends, cfg.v, colNP, null);
  /* a legenda segue a ordem real da frase: início → meio → objeto (adjetivos) → fim */
  const etq = s=>{ const k = adjKind(s.cls, s.w); return `<b style="color:${ADJ_COLOR[k]}">${END_SLOT_NOME[slotOf(s)]}</b>`; };
  const ord = sortSlots(mids.concat(ends));
  const legNP = np ? ADJ7.filter(t => cfg.np.adj && cfg.np.adj[t.k]).map(t => `<b style="color:${ADJ_COLOR['adj_' + t.k]}">${t.n}</b>`) : [];
  const slots = ord.filter(s => SLOT_ZONA(slotOf(s)) !== 'fim').map(etq).concat(legNP, ord.filter(s => SLOT_ZONA(slotOf(s)) === 'fim').map(etq));
  return { en: markedToHTML(raw, markColorVar(cfg.f)), pt, slots: slots.join(' → '), texto: stripMarks(raw) };
}

/* ---- Montador: a tabela vira algo que se desmonta ----
   Cada encaixe é um soquete clicável. Encaixar e desencaixar mostra na prática o que a
   tabela afirma: peças de cores iguais convivem desde que ocupem encaixes diferentes. As
   peças saem do banco real, então o exemplo é sempre uma frase válida. */
const MONT_COMBO = { t:'past', a:'simples', v:'work', f:'afirmativa' };
let montOn = new Set([2, 4, 8]);   /* começa no trio clássico: modo + lugar + tempo */
let montEscolha = {};              /* encaixe → expressão escolhida pelo usuário */
let montAberto = null;             /* encaixe com o seletor aberto */
/* peça inicial de cada encaixe: a mais ensinável, e não a primeira em ordem alfabética */
const MONT_PREF = { 1:'a bit', 2:'quickly', 3:'more than usual', 4:'at home', 5:'twice', 6:'all day long',
  7:'about an hour ago', 8:'yesterday', 9:'first', 10:'at all', 11:'probably', 12:'also', 13:'often',
  14:'already', 15:'really' };

/* ---- v173: o substantivo e os 8 adjetivos em ordem, como encaixes do montador ----
   Ids próprios (30–39) para não mexer na numeração dos 15 encaixes adverbiais:
     30 determinante · 31 substantivo · 32–39 = opinião, tamanho, idade, forma, cor, origem, material, propósito.
   Os dados e o construtor npMonta() estão em data-adjetivos.js. Regra: adjetivo ou determinante ligados puxam o
   substantivo junto (sem ele não há o que modificar); desligar o substantivo desliga o resto. Mesmo combinações
   sem sentido podem ser encaixadas — o que se treina aqui é a ORDEM. */
const NP_IDS = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
const NP_ADJ_DO_ID = {}; ADJ7_CHAVES.forEach((k, i) => { NP_ADJ_DO_ID[32 + i] = k; });
const NP_NOME = { 30:'determinante', 31:'substantivo' }; ADJ7.forEach((t, i) => { NP_NOME[32 + i] = t.n; });
const NP_PERGUNTA = { 30:'qual? de quem?', 31:'o quê?' }; ADJ7.forEach((t, i) => { NP_PERGUNTA[32 + i] = t.q; });
/* verbos que aceitam objeto e já combinam com os substantivos; se o verbo atual for outro (work, go…), o montador
   usa o verbo padrão do substantivo e devolve o anterior quando o substantivo sai */
const NP_VERBOS_OK = new Set(['buy', 'have', 'find', 'see', 'take', 'wear', 'carry', 'sell', 'need', 'like', 'make']);
const npEhId = r => r >= 30 && r <= 39;
const npCorId = r => r >= 32 ? ADJ_COLOR['adj_' + NP_ADJ_DO_ID[r]] : ADJ_COLOR.regencia;
function npOpcoesId(r){
  if(r === 30) return NP_DET.map(d => ({ w:d.en, pt:(d.pm === d.pf ? d.pm : d.pm + '/' + d.pf) + (d.pos ? ' … ' + d.pos : '') }));
  if(r === 31) return NP_SUBS.map(n => ({ w:n.en, pt:n.pt + ' (' + n.g + ')' }));
  return ADJ7.find(t => t.k === NP_ADJ_DO_ID[r]).ops.map(o => ({ w:o.en, pt:o.pm === o.pf ? o.pm : o.pm + '/' + o.pf, sub:o.sub }));
}
/* ---- subcategorias dos adjetivos (v175): chips + títulos de grupo + filtro, no seletor e no Glossário ---- */
function npSubs(r){ const s = []; npOpcoesId(r).forEach(o => { if(o.sub && !s.includes(o.sub)) s.push(o.sub); }); return s; }
/* chips: "todas" + uma por subcategoria, com a contagem; só aparecem quando há 2 ou mais */
function npChipsHTML(r){
  const s = npSubs(r); if(s.length < 2) return '';
  const ops = npOpcoesId(r);
  return `<div class="np-subs" role="group" aria-label="Subcategorias"><button type="button" class="np-sub" data-sub="" data-on="true">todas <i>${ops.length}</i></button>` +
    s.map(n => `<button type="button" class="np-sub" data-sub="${escapeHTML(n)}" data-on="false">${escapeHTML(n)} <i>${ops.filter(o => o.sub === n).length}</i></button>`).join('') + '</div>';
}
/* itens com um título de grupo antes de cada subcategoria (itemFn desenha cada opção) */
function npItensHTML(lista, itemFn){
  let ant = null, h = '';
  lista.forEach(o => {
    if(o.sub && o.sub !== ant){ h += `<div class="np-subh">${escapeHTML(o.sub)}</div>`; }
    ant = o.sub; h += itemFn(o);
  });
  return h;
}
/* liga chips + campo de busca de uma caixa: esconde itens (itemSel) e os títulos que ficaram sem itens.
   Não reconstrói nada, então o foco do teclado e a rolagem ficam como estão. */
function npFiltroLiga(box, itemSel){
  if(!box) return;
  let sub = '', q = '';
  const busca = box.querySelector('input[type=search]');
  const aplica = () => {
    box.querySelectorAll(itemSel).forEach(it => {
      it.hidden = !!((sub && it.dataset.sub !== sub) || (q && !it.textContent.toLowerCase().includes(q)));
    });
    box.querySelectorAll('.np-subh').forEach(h => {                /* título some se nenhum item do grupo aparece */
      let n = h.nextElementSibling, vis = false;
      while(n && !n.classList.contains('np-subh')){ if(!n.hidden) vis = true; n = n.nextElementSibling; }
      h.hidden = !vis;
    });
  };
  if(busca) busca.oninput = () => { q = busca.value.trim().toLowerCase(); aplica(); };
  box.querySelectorAll('.np-sub').forEach(c => {
    c.onclick = () => {
      sub = c.dataset.sub;
      box.querySelectorAll('.np-sub').forEach(x => { x.dataset.on = String(x === c); });
      aplica();
      try{ c.scrollIntoView({ inline:'center', block:'nearest', behavior:'smooth' }); }catch(e){}   /* o chip ativo não fica escondido no carrossel */
    };
  });
}
function npEscolhaId(r){
  const ops = npOpcoesId(r), e = montEscolha[r];
  if(e && ops.some(o => o.w === e)) return e;
  return r === 30 ? NP_PADRAO.det : (r === 31 ? NP_PADRAO.noun : NP_PADRAO.adj[NP_ADJ_DO_ID[r]]);
}
function npSelAtual(){
  const sel = { det: montOn.has(30) ? npEscolhaId(30) : null, noun: montOn.has(31) ? npEscolhaId(31) : null, adj:{} };
  for(let r = 32; r <= 39; r++) if(montOn.has(r)) sel.adj[NP_ADJ_DO_ID[r]] = npEscolhaId(r);
  return sel;
}
function npNormaliza(){ if(NP_IDS.some(r => r !== 31 && montOn.has(r))) montOn.add(31); }
function npDesliga(r){ montOn.delete(r); if(r === 31) NP_IDS.forEach(x => montOn.delete(x)); }
function npVerboAuto(){                                    /* o verbo acompanha o substantivo enquanto ele estiver encaixado */
  if(montOn.has(31)){
    const n = npSub(npEscolhaId(31));
    if(MONT_COMBO.vAuto || !NP_VERBOS_OK.has(MONT_COMBO.v)){
      if(!MONT_COMBO.vAuto) MONT_COMBO.vAntes = MONT_COMBO.v;
      MONT_COMBO.v = n.v; MONT_COMBO.vAuto = true;
    }
  } else if(MONT_COMBO.vAuto){ MONT_COMBO.v = MONT_COMBO.vAntes || 'work'; delete MONT_COMBO.vAntes; MONT_COMBO.vAuto = false; }
}
Object.assign(SEG_INFO, (() => { const o = {};
  ADJ7.forEach(t => { o['adj_' + t.k] = { k:'Adjetivo de ' + t.n + ' (' + t.ord + 'º dos 8)', t:'Pergunta: <i>' + t.q + '</i> Ordem antes do substantivo: opinião → tamanho → idade → forma → cor → origem → material → propósito. Podem faltar encaixes, mas os que vierem seguem sempre essa fila.' }; });
  return o; })());

function montOpcoes(){
  const key = `${MONT_COMBO.t}_${MONT_COMBO.a}`;
  const por = {};
  (SIGNAL_WORDS[key] || []).forEach(s=>{
    if(s.pl === 'split') return;                    /* partidos ficam fora do montador */
    const r = slotOf(s);
    (por[r] = por[r] || []).push(s);
  });
  Object.keys(por).forEach(r=> por[r].sort((a,b)=>a.w.localeCompare(b.w)));
  return por;
}
function montPecas(){
  const opts = montOpcoes();
  const escolhidos = {};
  Object.keys(opts).forEach(r=>{
    const lista = opts[r];
    const fmt = MONT_COMBO.f || 'afirmativa';
    escolhidos[r] = (montEscolha[r] && lista.find(s=>s.w === montEscolha[r]))
      || lista.find(s=>s.w === MONT_PREF[r] && signalAllowed(s, fmt))
      || lista.find(s=>signalAllowed(s, fmt))
      || lista.find(s=>s.w === MONT_PREF[r])
      || lista[0];
  });
  return escolhidos;
}
/* soquetes do objeto: determinante, substantivo e os 8 adjetivos, cada um com a cor do seu tipo */
function npSocketsHTML(){
  let h = `<div class="mont-zona" style="flex-basis:100%; font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:var(--brass-dim); margin-top:4px;">objeto · o substantivo e seus 8 adjetivos, nesta ordem</div>`;
  NP_IDS.forEach(r => {
    const on = montOn.has(r), esc = npEscolhaId(r), n = npOpcoesId(r).length;
    const rot = r >= 32 ? `${r - 31}. ${NP_NOME[r]}` : NP_NOME[r];
    const cab = on
      ? `<b data-toggle="${r}">${rot}<button class="socket-x" data-off="${r}" title="Desencaixar">✕</button></b>`
      : `<b data-toggle="${r}">${rot} · ${n}</b>`;
    const escolha = on
      ? `<button class="socket-peca" data-pick="${r}" aria-expanded="${montAberto === r}">${escapeHTML(esc)}<i>${montAberto === r ? '▴' : '▾'}</i></button>`
      : `<span>${escapeHTML(esc)}</span>`;
    h += `<div class="socket" data-slot="${r}" data-on="${on}" data-np="1" style="--cat:${npCorId(r)}">${cab}${escolha}</div>`;
  });
  return h;
}
function buildMontador(){
  const box = document.getElementById('montadorWrap');
  if(!box) return;
  npNormaliza(); npVerboAuto();                      /* v173: substantivo/adjetivos e o verbo que os acompanha */
  const pecas = montPecas();
  const ordem = SLOT_ORDEM.filter(r=>pecas[r]);
  const usados = ordem.filter(r=>montOn.has(r));
  /* polaridade só existe em frase negada: encaixá-la troca o formato — e isso é a lição */
  const formato = usados.includes(10) ? 'negativa' : (MONT_COMBO.f || 'afirmativa');
  const vale = s => signalAllowed(s, formato);
  const mids = usados.filter(r=>SLOT_ZONA(r) === 'meio').map(r=>pecas[r]).filter(vale);
  const ends = usados.filter(r=>SLOT_ZONA(r) !== 'meio').map(r=>pecas[r]).filter(vale);
  const verb = verbById(MONT_COMBO.v);
  const g = generate('fact', MONT_COMBO.t, MONT_COMBO.a, formato, 'I', verb);
  const np = montOn.has(31) ? npMonta(npSelAtual()) : null, colNP = np ? { raw:np.raw, pt:np.pt, en:np.plain } : null;
  const rawBase = applySignal(g.text, mids.length ? mids : null, ends, colNP, null, formato), fimM = g.isQuestion ? M('?') : '.';
  /* v110: 2ª oração também no montador */
  MONT_O2.fmt = formato;
  const o2mt = (MONT_O2.o2 && MONT_O2.o2.tipo) ? o2Em(O2_CTX_MONT, () => o2Compor()) : null;
  let ptBase;
  ptCondModo = o2mt ? (o2mt.ptModo || null) : null;                /* v120: principal no imperfeito (hábito no passado) */
  try { ptBase = translate('fact', MONT_COMBO.t, MONT_COMBO.a, formato, 'I', mids.length ? mids : null, ends, MONT_COMBO.v, colNP, null); }
  finally { ptCondModo = null; }
  const jn = o2mt ? o2Junta(o2mt, rawBase, ptBase, fimM) : null;
  const foco2m = !!o2mt && o2Em(O2_CTX_MONT, () => o2Foco()) === 2;      /* v114: foco na 2ª oração */
  const raw = jn ? jn.raw : rawBase + fimM, pt = jn ? jn.pt : ptBase;

  const porCor = {como:0, onde:0, quando:0};
  ends.concat(mids).forEach(s=> porCor[adjKind(s.cls, s.w)]++);

  const opts = montOpcoes();
  let sockets = '', zonaAtual = '', npFeito = false;
  const ROTULO_ZONA = { 'início':'abre a frase', 'meio':'entre o auxiliar e o verbo', 'fim':'depois do verbo' };
  ordem.forEach(r=>{
    const s = pecas[r];
    const z = SLOT_ZONA(r);
    if(z !== zonaAtual){
      zonaAtual = z;
      if(z === 'fim' && !npFeito){ sockets += npSocketsHTML(); npFeito = true; }      /* v173: o objeto vem entre o meio e o fim */
      sockets += `<div class="mont-zona" style="flex-basis:100%; font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:var(--brass-dim); margin-top:4px;">${z} · ${ROTULO_ZONA[z]}</div>`;
    }
    const k = adjKind(s.cls, s.w);
    const on = montOn.has(r);
    const bloq = on && !vale(s);
    /* ligado, o soquete vira um seletor: dá para trocar a peça daquele encaixe e ver o
       efeito na frase. Seletor próprio em vez de <select>: o menu nativo é desenhado pelo
       sistema e ignora o tema do app; aqui a lista herda a cor do encaixe. */
    const escolha = on
      ? `<button class="socket-peca" data-pick="${r}" aria-expanded="${montAberto===r}">
           ${escapeHTML(s.w)}<i>${montAberto===r ? '▴' : '▾'}</i></button>`
      : `<span>${escapeHTML(s.w)}</span>`;
    const n = slotNum(r);
    const cabecalho = on
      ? `<b data-toggle="${r}">${n}. ${END_SLOT_NOME[r]}<button class="socket-x" data-off="${r}" title="Desencaixar">✕</button></b>`
      : `<b data-toggle="${r}">${n}. ${END_SLOT_NOME[r]}${opts[r].length > 1 ? ` · ${opts[r].length}` : ''}</b>`;
    sockets += `<div class="socket" data-slot="${r}" data-on="${on}" style="--cat:${ADJ_COLOR[k]};${bloq ? 'opacity:.45;' : ''}"
      ${bloq ? 'title="Esta peça não vale em frase negada"' : ''}>${cabecalho}${escolha}</div>`;
  });

  box.innerHTML = `<div class="montador">
    <div class="anat-frase-row">
      <div class="mont-frase">${markedToHTML(raw, markColorVar(formato))}</div>
      <button class="audio-btn sm" data-text="${escapeHTML(stripMarks(raw))}" title="Ouvir">🔊</button>
    </div>
    <div class="mont-pt">${escapeHTML(pt)}</div>
    ${o2mt ? `<div class="why" style="font-size:10.5px; margin:2px 0 6px;">🔗 ${escapeHTML(o2mt.tipo.nome)}: ${escapeHTML(o2mt.estrutura)}</div>` : ''}
    <div class="dial-group foco-bar" id="montFocoBar" hidden></div>
    ${foco2m ? '<div class="signal-row" id="montO2Sinais"></div><div class="signal-hint" id="montO2Hint"></div>' : `<div class="mont-slots">${sockets}</div>`}
    ${!foco2m && montAberto !== null && npEhId(montAberto) ? (()=>{
      const lista = npOpcoesId(montAberto), atual = npEscolhaId(montAberto), cor = npCorId(montAberto);
      return `<div class="mont-picker" style="--cat:${cor}">
        <div class="mont-picker-head">${montAberto >= 32 ? (montAberto - 31) + '. ' : ''}${NP_NOME[montAberto]} — ${NP_PERGUNTA[montAberto]}
          <span>${lista.length} opções</span></div>
        ${lista.length > 16 ? '<input type="search" class="mont-busca" placeholder="filtrar opções…" aria-label="Filtrar opções" autocomplete="off">' : ''}
        ${npChipsHTML(montAberto)}
        <div class="mont-picker-list">
          ${npItensHTML(lista, o=>`<button class="mont-op" data-op="${escapeHTML(o.w)}" data-sub="${escapeHTML(o.sub || '')}" data-sel="${o.w===atual}">
            <span class="op-en">${escapeHTML(o.w)}</span>
            <span class="op-pt">${escapeHTML(o.pt)}</span></button>`)}
        </div></div>`;
    })() : (!foco2m && montAberto !== null && pecas[montAberto] ? (()=>{
      const s0 = pecas[montAberto], kk = adjKind(s0.cls, s0.w);
      const lista = opts[montAberto].filter(vale);
      return `<div class="mont-picker" style="--cat:${ADJ_COLOR[kk]}">
        <div class="mont-picker-head">${slotNum(montAberto)}. ${END_SLOT_NOME[montAberto]}
          <span>${lista.length} opções</span></div>
        <div class="mont-picker-list">
          ${lista.map(o=>`<button class="mont-op" data-op="${escapeHTML(o.w)}" data-sel="${o.w===s0.w}">
            <span class="op-en">${escapeHTML(o.w)}</span>
            <span class="op-pt">${escapeHTML(SIGNAL_PT[o.w] || '—')}</span></button>`).join('')}
        </div></div>`;
    })() : '')}
    <div class="mont-acoes"${foco2m ? ' hidden' : ''}>
      <button class="mont-btn" data-act="todos">encaixar todos</button>
      <button class="mont-btn" data-act="limpar">desmontar</button>
      <button class="mont-btn" data-act="trio">só o trio clássico</button>
      <button class="mont-btn" data-act="sete">os 8 adjetivos</button>
      <span class="mont-conta">${TENSE_LABEL[MONT_COMBO.t]} · ${ASPECT_LABEL[MONT_COMBO.a]} · ${verb.base} ·
        ${ends.length + mids.length + (np ? np.n : 0)} encaixe(s) ·
        <span style="color:${ADJ_COLOR.como}">${porCor.como} como</span> ·
        <span style="color:${ADJ_COLOR.onde}">${porCor.onde} onde</span> ·
        <span style="color:${ADJ_COLOR.quando}">${porCor.quando} quando</span>${np ? ` · <span style="color:${ADJ_COLOR.regencia}">${np.n} adjetivo(s)</span>` : ''}</span>
    </div>
  </div>`;

  box.querySelectorAll('.socket').forEach(el=>{
    el.onclick = (e)=>{
      if(e.target.tagName === 'SELECT') return;      /* trocar a peça não desencaixa */
      const r = +el.dataset.slot;
      if(montOn.has(r)){ npEhId(r) ? npDesliga(r) : montOn.delete(r); } else montOn.add(r);
      if(montAberto !== null && npEhId(montAberto) && !montOn.has(montAberto)) montAberto = null;
      buildMontador();
    };
  });
  box.querySelectorAll('.socket-x').forEach(b=>{
    b.onclick = (e)=>{ e.stopPropagation(); const r=+b.dataset.off; npEhId(r) ? npDesliga(r) : montOn.delete(r); if(montAberto!==null && !montOn.has(montAberto)) montAberto=null; buildMontador(); };
  });
  box.querySelectorAll('.socket-peca').forEach(b=>{
    b.onclick = (e)=>{
      e.stopPropagation();                      /* abrir a lista não desencaixa */
      const r = +b.dataset.pick;
      montAberto = (montAberto === r) ? null : r;
      buildMontador();
    };
  });
  box.querySelectorAll('.mont-op').forEach(b=>{
    b.onclick = ()=>{ montEscolha[montAberto] = b.dataset.op; montAberto = null; buildMontador(); };
  });
  npFiltroLiga(box.querySelector('.mont-picker'), '.mont-op');     /* v173/v175: busca + subcategorias (não reconstrói) */
  box.querySelectorAll('.mont-btn').forEach(b=>{
    b.onclick = ()=>{
      const act = b.dataset.act;
      if(act === 'todos') montOn = new Set(Object.keys(pecas).map(Number).concat(NP_IDS));
      else if(act === 'limpar') montOn = new Set();
      else if(act === 'sete'){ NP_IDS.forEach(r => montOn.add(r)); }             /* v173: determinante + substantivo + os 8 */
      else montOn = new Set([2, 4, 8]);
      montAberto = null;
      buildMontador();
    };
  });
  o2MontaDial(O2_CTX_MONT);                               /* v110: dial da 2ª oração do montador */
  /* v114: barra Oração 1 | Oração 2 e, no foco 2, o seletor de peças da 2ª oração no lugar dos soquetes */
  const fbT = document.getElementById('montFocoBar');
  o2Em(O2_CTX_MONT, () => buildFocoBar(fbT, { d1:'Os soquetes editam a oração principal.', dF:'O seletor de peças edita a 2ª oração, valendo para o tempo dela.', dE:'A 2ª oração aceita só peças de fim; advérbios de meio não cabem nela.', volta:'Volte para a Oração 1 para encaixar peças na principal.' }, ends.length + mids.length));
  if(fbT) o2Envolve(fbT, O2_CTX_MONT);
  if(foco2m){
    const sr2 = document.getElementById('montO2Sinais'), h2 = document.getElementById('montO2Hint');
    o2Em(O2_CTX_MONT, () => o2SinaisPicker(sr2, h2, MONT_O2_PICK)); o2Envolve(sr2, O2_CTX_MONT);
  }
}

