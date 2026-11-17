/* ---- Caderno de frases ----
   ⭐ guarda a frase do motor COM os dials (state). Carregar devolve o motor àquele ponto; não é só texto. */
const CAD_KEY = 'pm_caderno', CAD_MAX = 200;
let cadItens = []; try { cadItens = JSON.parse(localStorage.getItem(CAD_KEY) || '[]') || []; if(!Array.isArray(cadItens)) cadItens = []; } catch(e){ cadItens = []; }
function cadGrava(){ try { localStorage.setItem(CAD_KEY, JSON.stringify(cadItens)); } catch(e){} }
function cadSalva(){
  const en = ((document.getElementById('sentence') || {}).textContent || '').trim(), pt = ((document.getElementById('translation') || {}).textContent || '').trim();
  if(!en || en === '—') return;
  const i = cadItens.findIndex(x => x.en === en && x.pt === pt);
  if(i >= 0){ cadItens.splice(i, 1); algoAviso('Removida do caderno.'); }                        /* tocar de novo desfaz */
  else {
    cadItens.unshift({ en, pt, t:Date.now(), eng:ENG, st:JSON.parse(JSON.stringify(state)) });
    if(cadItens.length > CAD_MAX) cadItens.length = CAD_MAX;
    algoAviso('Salva no caderno ⭐'); tato(18);
  }
  cadGrava(); cadMarca(); cadRender();
}
function cadMarca(){
  const b = document.getElementById('saveMain'); if(!b) return;
  const en = ((document.getElementById('sentence') || {}).textContent || '').trim(), pt = ((document.getElementById('translation') || {}).textContent || '').trim();
  const sim = cadItens.some(x => x.en === en && x.pt === pt);
  b.textContent = sim ? '★' : '☆'; b.dataset.on = String(sim); b.title = sim ? 'No caderno (toque para remover)' : 'Salvar no caderno';
  if(sim && b.animate && !REDUZ() && b.dataset.pop === '1'){ b.animate([{ transform:'scale(1)' }, { transform:'scale(1.45) rotate(-12deg)' }, { transform:'scale(1)' }], { duration:380, easing:'cubic-bezier(.3,1.6,.5,1)' }); }
  b.dataset.pop = '0';
}
function cadCarrega(i){
  const it = cadItens[i]; if(!it || !it.st) return;
  const s = it.st;
  if(!(CATEGORIES[s.categoria] && TENSE_LABEL[s.tempo] && verbById(s.verbo).id === s.verbo)){ algoAviso('Essa frase usa um ajuste que não existe mais.'); return; }
  if(it.eng && it.eng !== ENG && typeof setEng === 'function') setEng(it.eng, true);
  Object.assign(state, JSON.parse(JSON.stringify(s)));
  state.signalSlot = null; state.signalFam = null; state.signalBusca = ''; state.signalMais = false; state.verboBusca = '';
  render();
  const t = document.getElementById('console-tempos'); if(t) t.scrollIntoView({ behavior: REDUZ() ? 'auto' : 'smooth', block:'start' });
  algoAviso('Frase carregada no motor.');
}
function cadApaga(i){ cadItens.splice(i, 1); cadGrava(); cadMarca(); cadRender(); }
function cadRender(){
  const box = document.getElementById('cadLista'); if(!box) return;
  const n = document.getElementById('cadN'); if(n) n.textContent = cadItens.length ? String(cadItens.length) : '';
  const esc = document.getElementById('cadEsconde') && document.getElementById('cadEsconde').dataset.on === 'true';
  if(!cadItens.length){ box.innerHTML = '<p class="ed-nota">Nada salvo ainda. No motor, toque em ☆ ao lado da frase para guardá-la aqui com todos os ajustes.</p>'; return; }
  box.innerHTML = cadItens.map((x, i) => `<div class="cad-it" data-i="${i}" data-esc="${esc}"><div class="cad-tx"><span class="cad-en" tabindex="0" role="button" aria-label="Mostrar o inglês">${escapeHTML(x.en)}</span><span class="cad-pt">${escapeHTML(x.pt)}</span></div>
    <div class="cad-bt"><button type="button" class="audio-btn" data-a="ouvir" title="Ouvir">🔊</button>${FALA_OK ? '<button type="button" class="audio-btn" data-a="falar" title="Repita e receba nota">🎤</button>' : ''}<button type="button" class="audio-btn" data-a="carregar" title="Carregar no motor">↺</button><button type="button" class="audio-btn" data-a="apagar" title="Apagar">🗑️</button></div><div class="fala-res" aria-live="polite"></div></div>`).join('');
  if(typeof applyA11y === 'function') applyA11y();
}
function cadEscondeToggle(){ const b = document.getElementById('cadEsconde'); b.dataset.on = String(b.dataset.on !== 'true'); b.textContent = b.dataset.on === 'true' ? '👁 mostrar inglês' : '🙈 esconder inglês'; cadRender(); }
function cadCopiaTudo(){ const t = cadItens.map(x => x.en + '\n' + x.pt).join('\n\n'); if(!t) return;
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => algoAviso('Caderno copiado.')).catch(() => fallbackCopy(t, () => algoAviso('Caderno copiado.'))); else fallbackCopy(t, () => algoAviso('Caderno copiado.')); }
/* exporta .txt pelo Blob (baixa no Android e no desktop; na TV pode não haver downloads — por isso há também "copiar") */
function cadExporta(){ if(!cadItens.length) return; const blob = new Blob([cadItens.map(x => x.en + '\t' + x.pt).join('\n')], { type:'text/plain;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'caderno-painel-mestre.txt'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
function cadLimpa(){ if(!cadItens.length) return; if(!confirm('Apagar todas as ' + cadItens.length + ' frases do caderno?')) return; cadItens = []; cadGrava(); cadMarca(); cadRender(); }
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('#saveMain'); if(b){ b.dataset.pop = '1'; cadSalva(); return; }
  const sh = e.target.closest && e.target.closest('#shareMain'); if(sh){ const t = (sh.dataset.text || ''); if(t && navigator.share) navigator.share({ text:t }).catch(() => {}); return; }
  const mic = e.target.closest && e.target.closest('#micMain'); if(mic){ falaOuve(((document.getElementById('sentence') || {}).textContent || '').trim(), document.getElementById('micRes')); return; }
  const c = e.target.closest && e.target.closest('.cad-it [data-a]'); if(c){
    const it = c.closest('.cad-it'), i = +it.dataset.i, x = cadItens[i]; if(!x) return;
    if(c.dataset.a === 'ouvir') speak(x.en); else if(c.dataset.a === 'carregar') cadCarrega(i); else if(c.dataset.a === 'apagar') cadApaga(i);
    else if(c.dataset.a === 'falar') falaOuve(x.en, it.querySelector('.fala-res'));
    return; }
  const en = e.target.closest && e.target.closest('.cad-en'); if(en){ en.closest('.cad-it').dataset.esc = 'false'; }
});

/* ---- Treino de fala (shadowing) ----
   Reconhecimento de voz do navegador (Chrome/Android; precisa de internet e de microfone). O app compara o que ouviu com a frase
   por sequência comum de palavras (LCS) e mostra nota, o que faltou e o que foi ouvido a mais. É um espelho, não um professor:
   o reconhecedor “corrige” sotaque, então nota alta ≠ pronúncia perfeita. */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition, FALA_OK = !!SR;
let falaRec = null;
function falaNorm(s){ return s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean); }
function falaCompara(alvo, ouvido){
  const A = falaNorm(alvo), B = falaNorm(ouvido), n = A.length, m = B.length;
  const L = Array.from({ length:n + 1 }, () => new Array(m + 1).fill(0));
  for(let i = 1; i <= n; i++) for(let j = 1; j <= m; j++) L[i][j] = A[i-1] === B[j-1] ? L[i-1][j-1] + 1 : Math.max(L[i-1][j], L[i][j-1]);
  const ok = new Set(); let i = n, j = m;                                   /* volta pela tabela marcando as palavras acertadas */
  while(i > 0 && j > 0){ if(A[i-1] === B[j-1]){ ok.add(i-1); i--; j--; } else if(L[i-1][j] >= L[i][j-1]) i--; else j--; }
  return { nota: n ? Math.round(100 * L[n][m] / Math.max(n, m)) : 0, A, ok };
}
function falaOuve(alvo, saida){
  if(!SR || !saida || !alvo) return;
  if(falaRec){ try { falaRec.abort(); } catch(e){} falaRec = null; saida.textContent = ''; return; }          /* 2º toque cancela */
  const r = new SR(); falaRec = r; r.lang = ENG === 'uk' ? 'en-GB' : 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
  saida.className = 'fala-res on'; saida.textContent = '🎤 fale agora…';
  r.onresult = ev => {
    const ouvido = ev.results[0][0].transcript, c = falaCompara(alvo, ouvido);
    const pal = c.A.map((w, k) => `<span class="${c.ok.has(k) ? 'fala-ok' : 'fala-no'}">${escapeHTML(w)}</span>`).join(' ');
    saida.innerHTML = `<b class="fala-n" data-q="${c.nota >= 85 ? 'a' : c.nota >= 60 ? 'm' : 'b'}">${c.nota}%</b> ${pal}<span class="fala-ou">ouvi: “${escapeHTML(ouvido)}”</span>`;
    if(c.nota >= 85) tato([12, 40, 12]);
  };
  r.onerror = ev => { saida.textContent = ev.error === 'not-allowed' ? 'Permita o microfone para treinar.' : ev.error === 'no-speech' ? 'Não ouvi nada. Tente de novo.' : 'Não consegui ouvir (' + ev.error + ').'; };
  r.onend = () => { falaRec = null; };
  try { r.start(); } catch(e){ falaRec = null; saida.textContent = 'Microfone indisponível agora.'; }
}

/* ---- botões extras no cartão da frase (aparecem só onde a API existe) ---- */
(function extras(){
  const bx = document.querySelector('#console-tempos .readout-btns'); if(!bx) return;
  const mk = (id, txt, tt) => { const b = document.createElement('button'); b.className = 'audio-btn'; b.id = id; b.type = 'button'; b.textContent = txt; b.title = tt; return b; };
  bx.insertBefore(mk('saveMain', '☆', 'Salvar no caderno'), bx.firstChild);
  if(FALA_OK) bx.insertBefore(mk('micMain', '🎤', 'Repita a frase e receba nota'), bx.firstChild);
  if(navigator.share) bx.insertBefore(mk('shareMain', '📤', 'Compartilhar'), bx.firstChild);
  const ro = document.querySelector('#console-tempos .readout'), res = document.createElement('div'); res.id = 'micRes'; res.className = 'fala-res'; res.setAttribute('aria-live', 'polite');
  const tr = ro && ro.querySelector('.readout-translation'); if(tr) tr.insertAdjacentElement('afterend', res);
})();
/* cada render muda a frase: atualiza a estrela, o texto de compartilhar e limpa a nota de fala antiga */
(function observaFrase(){
  const se = document.getElementById('sentence'); if(!se) return;
  let ult = '';
  new MutationObserver(() => {
    const t = se.textContent; if(t === ult) return; ult = t;
    cadMarca(); const sh = document.getElementById('shareMain'); if(sh) sh.dataset.text = t + '\n' + ((document.getElementById('translation') || {}).textContent || '');
    const mr = document.getElementById('micRes'); if(mr && !falaRec){ mr.className = 'fala-res'; mr.textContent = ''; }
    /* palavras coloridas entram em cascata (Web Animations API; ~30 ms entre elas, nunca bloqueia o clique) */
    if(!REDUZ() && se.animate){ se.querySelectorAll('.seg').forEach((s, k) => { s.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }], { duration:260, delay:Math.min(k, 8) * 35, easing:'ease-out', fill:'backwards' }); }); }
  }).observe(se, { childList:true, characterData:true, subtree:true });
})();

/* ---- Tela ligada na TV (Screen Wake Lock) ----
   Sem isso a TV apaga ou entra em protetor de tela no meio do estudo. Só com o modo TV ligado; é liberado ao sair. */
let wakeLock = null;
async function wakeLigaDesliga(){
  try {
    if(tvModo && 'wakeLock' in navigator && !wakeLock && document.visibilityState === 'visible'){
      wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if(!tvModo && wakeLock){ await wakeLock.release(); wakeLock = null; }
  } catch(e){ wakeLock = null; }
}
document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') wakeLigaDesliga(); });

/* ---- Instalar o app (PWA) ---- */
let instalaEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); instalaEvt = e; const b = document.getElementById('instalaBtn'); if(b) b.hidden = false; });
window.addEventListener('appinstalled', () => { instalaEvt = null; const b = document.getElementById('instalaBtn'); if(b) b.hidden = true; algoAviso('App instalado.'); });
function instalaApp(){ if(!instalaEvt) return; instalaEvt.prompt(); instalaEvt.userChoice.finally(() => { instalaEvt = null; const b = document.getElementById('instalaBtn'); if(b) b.hidden = true; }); }
/* aviso de conexão: o app funciona offline, mas o treino de fala e o áudio online precisam de rede */
window.addEventListener('offline', () => algoAviso('Sem internet: o app segue funcionando; fala e áudio online ficam indisponíveis.'));
window.addEventListener('online', () => algoAviso('Conexão de volta.'));

/* ---- Troca de tema com View Transitions (círculo que cresce a partir do botão) ---- */
(function temaAnimado(){
  const orig = window.toggleTheme; if(typeof orig !== 'function' || !document.startViewTransition) return;
  window.toggleTheme = function(){
    if(REDUZ()){ orig(); return; }
    const b = document.getElementById('themeToggle'), r = b ? b.getBoundingClientRect() : { left:innerWidth - 30, top:30, width:0, height:0 };
    const x = r.left + r.width / 2, y = r.top + r.height / 2, raio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(() => orig());
    vt.ready.then(() => document.documentElement.animate({ clipPath:[`circle(0px at ${x}px ${y}px)`, `circle(${raio}px at ${x}px ${y}px)`] }, { duration:520, easing:'ease-in-out', pseudoElement:'::view-transition-new(root)' })).catch(() => {});
  };
})();

wakeLigaDesliga();   /* modo TV já ligado na abertura */
(function(){ const _tv = tvAplica; tvAplica = function(){ _tv.apply(this, arguments); wakeLigaDesliga(); }; })();

/* ================= v159: GATILHOS DE RESPOSTA =================
   Ideia: transformar cada palavra interrogativa num REFLEXO de duas mãos — ouvir/ler a pergunta → saber a forma da resposta,
   e querer perguntar algo → saber quais verbos puxam essa palavra. Três modos:
   · Mapa     — o 5W2H ampliado: por gatilho, o que a resposta pede, a forma dela, a armadilha, os verbos que combinam
                (cada verbo gera a pergunta AO VIVO no motor, com áudio e PT) e as estruturas ligadas (how long … it takes).
   · Reflexo  — rodada cronometrada: lê a pergunta em português e acerta a palavra interrogativa em segundos.
   · Bateria  — escolha verbo+sujeito+tempo e veja TODAS as perguntas possíveis; é o “5W2H do verbo”.
   As frases saem de whGenerate (o mesmo motor do console): nenhuma frase inglesa é digitada à mão. */
const GAT_GRUPOS = [
  { k:'quem',   ic:'👤', nome:'Quem — pessoas' },
  { k:'oque',   ic:'🎯', nome:'O que — coisas e escolhas' },
  { k:'onde',   ic:'📍', nome:'Onde — lugar' },
  { k:'quando', ic:'⏰', nome:'Quando — tempo' },
  { k:'porque', ic:'❓', nome:'Por que — motivo' },
  { k:'como',   ic:'🛠️', nome:'Como — modo e qualidade' },
  { k:'quanto', ic:'📏', nome:'Quanto — duração, preço, frequência, distância' }
];
/* k = chave do motor (WH_X / listas WH_*), cue = a pergunta que você faz na cabeça, r = o que a resposta traz,
   f = forma da resposta (notação, não frase), a = armadilha, v = verbos que combinam (só entram os aceitos pelo motor) */
const GAT = [
  { g:'quem', k:'Who', cue:'Quem faz?', r:'uma pessoa que FAZ a ação (o sujeito).', f:'pessoa + does / did', a:'Sem auxiliar e sem inversão: “who does work?” está errado; o verbo vai na 3ª pessoa.', v:['call','help','know','win','teach','decide','live','work'] },
  { g:'quem', k:'Who (objeto)', cue:'Quem é o alvo?', r:'uma pessoa que RECEBE a ação (o objeto).', f:'sujeito + verbo + pessoa', a:'Aqui há inversão com auxiliar. Em registro formal: whom.', v:['meet','call','invite','ask','see','help'] },
  { g:'quem', k:'Who … with', cue:'Com quem?', r:'a companhia.', f:'with + pessoa', a:'A preposição fica no fim; “with who” soa formal demais.', v:['work','travel','live','study','meet','go'] },
  { g:'oque', k:'What', cue:'O que acontece?', r:'a coisa que faz a ação ou o que ocorre.', f:'coisa + verbo', a:'Mesma regra de “who”: sem auxiliar quando é sujeito.', v:['happen','help','change','matter'] },
  { g:'oque', k:'What (objeto)', cue:'O que é o alvo?', r:'a coisa que RECEBE a ação.', f:'sujeito + verbo + coisa', a:'O complemento some da pergunta: ele É a resposta.', v:['do','need','want','buy','eat','say','think','make','plan'] },
  { g:'oque', k:'What … for', cue:'Para quê?', r:'a finalidade.', f:'for + finalidade · to + verbo', a:'A preposição for fica no fim da pergunta.', v:['work','study','save','wait','live','pay'] },
  { g:'oque', k:'Which one', cue:'Qual dentre as opções?', r:'uma escolha dentro de um conjunto conhecido.', f:'the + opção · this/that one', a:'“What” é aberto; “which” supõe opções já na mesa.', v:['prefer','choose','want','buy'] },
  { g:'onde', k:'Where', cue:'Em que lugar?', r:'um lugar.', f:'in / at / on / to + lugar', a:'Com verbo de movimento a resposta usa to; com estado, in/at.', v:['live','work','go','stay','park','sleep','study','come','meet'] },
  { g:'quando', k:'When', cue:'Em que momento?', r:'um ponto no tempo.', f:'at / on / in + momento', a:'Ponto definido do passado pede passado simples, não present perfect.', v:['arrive','leave','start','finish','call','travel'] },
  { g:'quando', k:'What time', cue:'A que horas?', r:'um horário no relógio.', f:'at + hora', a:'Não diga “which hour”: o gatilho é what time.', v:['start','open','close','leave','arrive','finish'] },
  { g:'quando', k:'Since when', cue:'Desde quando?', r:'o início de algo que continua.', f:'since + ponto · for + período', a:'Combina com present perfect (contínuo).', v:['live','work','study','wait'], asp:'perfeito' },
  { g:'quando', k:'Until when', cue:'Até quando?', r:'o limite no tempo.', f:'until / by + ponto', a:'Until = continua até lá; by = pronto até lá.', v:['stay','work','wait','study'], tp:'future' },
  { g:'quando', k:'How soon', cue:'Daqui a quanto?', r:'um prazo a partir de agora.', f:'in + período', a:'A resposta usa in (“em dois dias”), não after.', v:['arrive','finish','start','call','leave'], tp:'future' },
  { g:'porque', k:'Why', cue:'Por que motivo?', r:'a causa ou a razão.', f:'because + oração · to + verbo', a:'Para finalidade curta use to; para causa, because + oração.', v:['leave','choose','cancel','stay','quit'] },
  { g:'porque', k:'Why don\'t', cue:'Por que não? (sugestão)', r:'uma sugestão ou a razão de não fazer.', f:'sugestão com base + verbo', a:'“Why don’t you…?” é convite; “why don’t they…?” pergunta o motivo.', v:['go','try','call','ask','join'] },
  { g:'porque', k:'How come', cue:'Como assim, por quê? (informal)', r:'a razão, com espanto.', f:'because + oração', a:'Sem inversão: “how come she works?”, não “how come does she work?”.', v:['leave','quit','stay','cancel','work'] },
  { g:'como', k:'How', cue:'De que jeito?', r:'o modo.', f:'by + -ing · advérbio de modo', a:'Não é “how” de qualidade (essa é how well).', v:['work','travel','live','study','learn','sleep'] },
  { g:'como', k:'How well', cue:'Quão bem?', r:'o nível de qualidade.', f:'advérbio: well · very well · not well', a:'A resposta não é “good”: é well.', v:['speak','play','work','understand','sleep','drive'] },
  { g:'como', k:'How fast', cue:'Com que velocidade?', r:'o ritmo.', f:'advérbio · número + medida', a:'Fast é advérbio e adjetivo; “fastly” não existe.', v:['work','drive','run','learn','walk'] },
  { g:'quanto', k:'How long', cue:'Por quanto tempo?', r:'uma duração.', f:'for + período · it takes + período', a:'for = duração; since = ponto de partida. Veja as estruturas ligadas: how long does it take…', v:['wait','stay','last','study','work','take'] },
  { g:'quanto', k:'How much', cue:'Quanto? (valor, intensidade)', r:'um valor ou quantidade não contável.', f:'número + moeda · a lot · a little', a:'Contável pede how many; “how much” é para preço e massa.', v:['cost','pay','spend','earn','charge','need'] },
  { g:'quanto', k:'How many times', cue:'Quantas vezes?', r:'uma contagem de ocorrências.', f:'número + times · once · twice', a:'“How many” + times: nunca “how much times”.', v:['call','visit','practice','travel','check'] },
  { g:'quanto', k:'How many hours', cue:'Quantas horas?', r:'uma quantidade de horas.', f:'número + hours', a:'Pergunta duração em unidade; para duração livre use how long.', v:['work','study','sleep','practice'] },
  { g:'quanto', k:'How often', cue:'Com que frequência?', r:'a frequência.', f:'advérbio de frequência · every + período', a:'Resposta no meio da frase (always, usually) ou no fim (every day).', v:['go','call','travel','exercise','work','study'] },
  { g:'quanto', k:'How far', cue:'A que distância?', r:'uma distância.', f:'número + medida · it is + distância', a:'Distância usa far; duração usa long.', v:['walk','drive','run','travel'] },
  { g:'quanto', k:'How old', cue:'Que idade?', r:'a idade.', f:'sujeito + be + número (+ years old)', a:'Em inglês a idade usa be, não have.', v:[] }
];
const GAT_PR = ['I','You','He','She','We','They'];
const GAT_TEMPO = { present:'presente', past:'passado', future:'futuro' };
/* sujeito natural por verbo: cost/last/take falam de coisas */
const GAT_IT = new Set(['cost','last','take','happen','matter','change']);
function gatPrV(vid, pr){ return GAT_IT.has(vid) ? 'It' : pr; }
function gatT(k){ return GAT.find(t => t.k === k); }
/* verbos de um gatilho que o motor aceita (existem e passam em whDisponivel) */
function gatVerbos(t){
  if((WH_X[t.k] || {}).so === 'state') return [];
  const seen = new Set();
  return t.v.filter(id => { if(seen.has(id) || !VERBS.some(v => v.id === id)) return false; seen.add(id);
    try { return whDisponivel(t.k, 'fact', verbById(id), null); } catch(e){ return false; } });
}
/* uma pergunta do motor; devolve null se algo sair estranho (nunca mostra "undefined") */
function gatGera(k, vid, pr, tempo, asp){
  try {
    const st = (WH_X[k] || {}).so === 'state', v = st ? null : verbById(vid);
    const T = gatT(k) || {};
    const w = whGenerate(st ? 'state' : 'fact', tempo || T.tp || 'present', asp || T.asp || 'simples', gatPrV(vid, pr || 'She'), k, v, { mids:[], ends:[], molde:null, col:null });
    if(!w || !w.en || /undefined/.test(w.en + (w.pt || ''))) return null;
    return { en: stripMarks(w.en), html: w.enMarked ? markedToHTML(w.enMarked, markColorVar('pergunta')) : escapeHTML(w.en), pt: w.pt || '' };
  } catch(e){ return null; }
}
let gatAba = 'mapa', gatQ = null, gatTimer = null, gatSt = { best:0, n:0, ok:0, ms:0 };
try { const s = JSON.parse(localStorage.getItem('pm_gat') || 'null'); if(s && typeof s.n === 'number') gatSt = s; } catch(e){}
function gatGrava(){ try { localStorage.setItem('pm_gat', JSON.stringify(gatSt)); } catch(e){} }
function gatRender(){
  const w = document.getElementById('gatWrap'); if(!w) return;
  const abas = [['mapa','🗺️ Mapa'], ['reflexo','⚡ Reflexo'], ['fala','🎤 Dizer'], ['bateria','🔋 Bateria 5W2H'], ['curtas','🔁 Respostas curtas']].filter(a => a[0] !== 'fala' || FALA_OK);
  w.innerHTML = `<div class="gat-abas" role="tablist">${abas.map(a => `<button type="button" role="tab" class="gat-aba" data-aba="${a[0]}" aria-selected="${gatAba === a[0]}">${a[1]}</button>`).join('')}</div><div id="gatPane"></div>`;
  gatPane();
}
function gatPane(){
  const p = document.getElementById('gatPane'); if(!p) return;
  clearInterval(gatTimer);
  if(gatAba === 'mapa') p.innerHTML = gatMapa();
  else if(gatAba === 'reflexo'){ p.innerHTML = '<div id="gatQuiz"></div>'; gatNovo(); }
  else if(gatAba === 'fala'){ p.innerHTML = '<div id="gatQuiz"></div>'; gatNovo(true); }
  else if(gatAba === 'curtas') p.innerHTML = gatCurtasHTML();   /* v164 */
  else p.innerHTML = gatBateria();
  if(gatAba === 'mapa') p.querySelectorAll('.gat-t').forEach(c => { const t = gatT(c.dataset.k), vs = gatVerbos(t); if(!vs.length || t.k === 'Who' || t.k === 'What') gatMostra(c, vs[0] || ''); else gatMostra(c, vs[0]); });
  if(typeof applyA11y === 'function') applyA11y();
  if(!REDUZ() && p.animate) p.animate([{ opacity:0, transform:'translateY(8px)' }, { opacity:1, transform:'none' }], { duration:240, easing:'ease-out' });
}
/* ---- Mapa ---- */
function gatMapa(){
  return GAT_GRUPOS.map(g => {
    const ts = GAT.filter(t => t.g === g.k);
    return `<details class="gat-g" ${g.k === 'onde' ? 'open' : ''}><summary><span>${g.ic}</span><b>${g.nome}</b><i>${ts.map(t => t.k).join(' · ')}</i></summary>${ts.map(gatCard).join('')}</details>`;
  }).join('');
}
function gatCard(t){
  const vs = gatVerbos(t), nota = WH_NOTA[t.k.replace(' (objeto)', '')] || '', mol = whMoldesDisponiveis(t.k, 'fact');
  return `<div class="gat-t" data-k="${escapeHTML(t.k)}">
    <div class="gat-h"><b>${escapeHTML(t.k)}</b><span class="gat-cue">${t.cue}</span></div>
    <div class="gat-r"><b>A resposta traz</b> ${t.r} <code>${escapeHTML(t.f)}</code></div>
    ${vs.length ? `<div class="gat-v"><b>Verbos que puxam</b>${vs.map((v, i) => `<button type="button" class="gat-vb" data-v="${v}" aria-pressed="${i === 0}">${v}</button>`).join('')}</div>` : '<div class="gat-v"><b>Verbo</b><span class="gat-sub">usa o próprio “be” (estado)</span></div>'}
    <div class="gat-ex" data-v="${vs[0] || ''}"></div><div class="gat-respbox"></div>
    <div class="gat-a"><b>Armadilha</b> ${t.a}</div>
    ${mol.length ? `<div class="gat-m"><b>Estruturas ligadas</b>${mol.map(m => `<button type="button" class="gat-vb gat-mb" data-m="${m.k}">${m.rot}</button>`).join('')}</div>` : ''}
    ${nota ? `<details class="gat-n"><summary>por dentro da regra</summary><div>${nota}</div></details>` : ''}
    <div class="gat-bt"><button type="button" class="algo-go" data-ir="1">↗ abrir no motor</button></div>
  </div>`;
}
/* mostra a pergunta de um verbo dentro do cartão do gatilho */
function gatMostra(card, vid){
  const t = gatT(card.dataset.k), ex = card.querySelector('.gat-ex'); if(!t || !ex) return;
  const pr = (t.k === 'Who' || t.k === 'What') ? 'She' : 'She', g = gatGera(t.k, vid, pr);
  card.querySelectorAll('.gat-vb[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === vid)));
  ex.dataset.v = vid;
  const rb = card.querySelector('.gat-respbox'); if(rb) rb.innerHTML = gatRespHTML(gatRespostas(t.k, vid, pr, undefined));
  if(!g){ ex.innerHTML = ''; return; }
  ex.dataset.en = g.en;
  ex.innerHTML = `<span class="gat-en">${g.html}</span><span class="gat-pt">${escapeHTML(g.pt)}</span><span class="gat-ab"><button type="button" class="audio-btn" data-s="1" title="Ouvir">🔊</button></span>`;
  if(!REDUZ() && ex.animate) ex.animate([{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { duration:200 });
}
function gatAbrirNoMotor(k, vid, molde){
  state.whWord = k; state.formato = 'pergunta'; state.whMolde = molde || null;
  if((WH_X[k] || {}).so === 'state'){ state.categoria = 'state'; if(!CATEGORIES.state.aspects.includes(state.aspecto)) state.aspecto = 'simples'; }
  else { state.categoria = 'fact'; if(vid && VERBS.some(v => v.id === vid)) state.verbo = vid; }
  render();
  const r = document.querySelector('#console-tempos .readout'); const top = (r ? r.getBoundingClientRect().top + window.scrollY : 0) - 70;
  window.scrollTo({ top: Math.max(0, top - 70), behavior: REDUZ() ? 'auto' : 'smooth' });
  algoAviso('Aberto no motor: ' + k);
}
/* ---- Reflexo (cronometrado) / Dizer (autoavaliação) ---- */
const GAT_CORE = ['Who','Who (objeto)','What (objeto)','Which one','Where','When','What time','Why','How','How long','How much','How many times','How often','How far','What … for','Who … with','How well'];
function gatSorteia(){
  for(let i = 0; i < 40; i++){
    const t = gatT(GAT_CORE[Math.floor(Math.random() * GAT_CORE.length)]); if(!t) continue;
    const vs = gatVerbos(t); if(!vs.length) continue;
    const vid = vs[Math.floor(Math.random() * vs.length)], pr = GAT_PR[Math.floor(Math.random() * GAT_PR.length)];
    const tempo = ['present','present','past','future'][Math.floor(Math.random() * 4)];
    const g = gatGera(t.k, vid, pr, t.tp ? undefined : tempo); if(g) return { t, vid, pr, tempo, g };
  }
  return null;
}
function gatNovo(fala){
  const q = document.getElementById('gatQuiz'); if(!q) return;
  clearInterval(gatTimer);
  const s = gatSorteia(); if(!s){ q.textContent = 'Não consegui montar a pergunta.'; return; }
  gatQ = { s, ini:performance.now(), resp:false, fala:!!fala };
  const stat = `<div class="gat-stat">sequência <b id="gatSeq">${gatSeqN}</b> · recorde <b>${gatSt.best}</b> · acertos <b>${gatSt.n ? Math.round(100 * gatSt.ok / gatSt.n) : 0}%</b>${gatSt.ok ? ' · média <b>' + (gatSt.ms / gatSt.ok / 1000).toFixed(1) + 's</b>' : ''}</div>`;
  if(fala){
    q.innerHTML = `${stat}<div class="gat-pergunta">${escapeHTML(s.g.pt)}</div><div class="gat-dica">${GAT_TEMPO[s.tempo]} · diga a pergunta em inglês, depois confira</div>
      <div class="gat-bt"><button type="button" class="algo-go" data-f="mic">🎤 falar</button><button type="button" class="algo-go" data-f="ver">👁 ver resposta</button><button type="button" class="algo-go" data-f="prox">próxima ▶</button></div><div id="gatRes" class="fala-res"></div><div id="gatRev"></div>`;
    return;
  }
  const lab = s.t.k, pool = GAT_CORE.filter(k => k !== lab).sort(() => Math.random() - .5).slice(0, 3);
  const ops = pool.concat(lab).sort(() => Math.random() - .5);
  q.innerHTML = `${stat}<div class="gat-barra"><i id="gatBarra"></i></div><div class="gat-pergunta">${escapeHTML(s.g.pt)}</div><div class="gat-dica">qual é o gatilho?</div>
    <div class="gat-ops">${ops.map(o => `<button type="button" class="gat-op" data-o="${escapeHTML(o)}">${escapeHTML(o)}</button>`).join('')}</div><div id="gatRev" aria-live="polite"></div>`;
  const bar = document.getElementById('gatBarra'), total = 8000;
  if(bar && bar.animate && !REDUZ()) bar.animate([{ transform:'scaleX(1)' }, { transform:'scaleX(0)' }], { duration:total, easing:'linear', fill:'forwards' });
  gatTimer = setInterval(() => { if(performance.now() - gatQ.ini > total){ clearInterval(gatTimer); gatResp(null); } }, 120);
}
function gatRevela(){
  const s = gatQ.s, rev = document.getElementById('gatRev'); if(!rev) return;
  rev.innerHTML = `<div class="gat-ex"><span class="gat-en">${s.g.html}</span><span class="gat-pt">${escapeHTML(s.g.pt)}</span><span class="gat-ab"><button type="button" class="audio-btn" data-sq="1" title="Ouvir">🔊</button></span></div>
    <div class="gat-r"><b>${escapeHTML(s.t.k)}</b> → ${s.t.r} <code>${escapeHTML(s.t.f)}</code></div>${gatRespHTML(gatRespostas(s.t.k, s.vid, s.pr, s.tempo))}<div class="gat-bt"><button type="button" class="algo-go" data-f="prox">próxima ▶</button></div>`;
}
function gatResp(op){
  if(!gatQ || gatQ.resp) return; gatQ.resp = true; clearInterval(gatTimer);
  const ok = op === gatQ.s.t.k, ms = performance.now() - gatQ.ini, bar = document.getElementById('gatBarra');
  if(bar && bar.getAnimations) bar.getAnimations().forEach(a => a.pause());
  gatSt.n++; if(ok){ gatSt.ok++; gatSt.ms += ms; gatSeqN = (typeof gatSeqN === 'number' ? gatSeqN : 0) + 1; gatSt.best = Math.max(gatSt.best, gatSeqN); tato(14); } else { gatSeqN = 0; tato([30, 40, 30]); }
  gatGrava();
  document.querySelectorAll('#gatQuiz .gat-op').forEach(b => { b.disabled = true; if(b.dataset.o === gatQ.s.t.k) b.dataset.res = 'ok'; else if(b.dataset.o === op) b.dataset.res = 'no'; });
  const sq = document.getElementById('gatSeq'); if(sq) sq.textContent = String(gatSeqN);
  gatRevela();
  speak(gatQ.s.g.en);
}
let gatSeqN = 0;
/* ---- Bateria 5W2H do verbo ---- */
let gatBat = { v:'work', pr:'She', tempo:'present', resp:false };
function gatBateria(){
  const ids = VERBS.map(v => v.id).sort();
  return `<div class="gat-ctl"><label>verbo <select id="gatV">${ids.map(i => `<option ${i === gatBat.v ? 'selected' : ''}>${i}</option>`).join('')}</select></label>
    <label>sujeito <select id="gatP">${GAT_PR.map(p => `<option ${p === gatBat.pr ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
    <label>tempo <select id="gatTm">${Object.keys(GAT_TEMPO).map(t => `<option value="${t}" ${t === gatBat.tempo ? 'selected' : ''}>${GAT_TEMPO[t]}</option>`).join('')}</select></label><label>respostas <select id="gatR"><option value="0" ${gatBat.resp ? '' : 'selected'}>ocultas</option><option value="1" ${gatBat.resp ? 'selected' : ''}>3 por pergunta</option></select></label></div><div id="gatBatLista">${gatBatLista()}</div>`;
}
function gatBatLista(){
  const v = verbById(gatBat.v), linhas = [];
  GAT.forEach(t => {
    if((WH_X[t.k] || {}).so === 'state') return;
    let ok = false; try { ok = whDisponivel(t.k, 'fact', v, null); } catch(e){}
    if(!ok) return;
    const g = gatGera(t.k, v.id, gatBat.pr, gatBat.tempo); if(g) linhas.push({ t, g });
  });
  if(!linhas.length) return '<p class="ed-nota">Esse verbo não forma perguntas com as palavras mapeadas.</p>';
  return `<div class="gat-bat">${GAT_GRUPOS.map(gr => { const L = linhas.filter(x => x.t.g === gr.k); return L.length ? `<div class="gat-bg"><b>${gr.ic} ${gr.nome.split(' — ')[0]}</b>${L.map(x => `<div class="gat-ex" data-en="${escapeHTML(x.g.en)}"><span class="gat-en">${x.g.html}</span><span class="gat-pt">${escapeHTML(x.g.pt)}</span><span class="gat-ab"><button type="button" class="audio-btn" data-s="1" title="Ouvir">🔊</button></span>${gatBat.resp ? '<div class="gat-rwrap">' + gatRespHTML(gatRespostas(x.t.k, v.id, gatBat.pr, gatBat.tempo)) + '</div>' : ''}</div>`).join('')}</div>` : ''; }).join('')}</div>
    <p class="ed-nota">Nem toda pergunta é natural com todo verbo: o motor monta a gramática, o seu ouvido decide o sentido.</p>`;
}
document.addEventListener('click', e => {
  const T = e.target.closest ? e.target : null; if(!T) return;
  const ab = T.closest('.gat-aba'); if(ab){ gatAba = ab.dataset.aba; gatRender(); return; }
  const vb = T.closest('#gatWrap .gat-vb[data-v]'); if(vb){ gatMostra(vb.closest('.gat-t'), vb.dataset.v); return; }
  const mb = T.closest('#gatWrap .gat-mb'); if(mb){ const c = mb.closest('.gat-t'), t = gatT(c.dataset.k); gatAbrirNoMotor(t.k, (gatVerbos(t)[0]), mb.dataset.m); return; }
  const ir = T.closest('#gatWrap [data-ir]'); if(ir){ const c = ir.closest('.gat-t'), t = gatT(c.dataset.k); gatAbrirNoMotor(t.k, c.querySelector('.gat-ex').dataset.v || gatVerbos(t)[0]); return; }
  const au = T.closest('#gatWrap [data-s]'); if(au){ const ex = au.closest('.gat-ex'); if(ex && ex.dataset.en) speak(ex.dataset.en); return; }
  const rs = T.closest('#gatWrap [data-rs]'); if(rs){ speak(rs.closest('.gat-rl').dataset.en); return; }
  const rm = T.closest('#gatWrap [data-rm]'); if(rm){ const l = rm.closest('.gat-rl'); falaOuve(l.dataset.en, l.querySelector('.fala-res')); return; }
  const aq = T.closest('#gatWrap [data-sq]'); if(aq && gatQ){ speak(gatQ.s.g.en); return; }
  const op = T.closest('#gatWrap .gat-op'); if(op){ gatResp(op.dataset.o); return; }
  const f = T.closest('#gatWrap [data-f]'); if(f){
    if(f.dataset.f === 'prox') gatNovo(gatQ && gatQ.fala);
    else if(f.dataset.f === 'ver'){ gatRevela(); speak(gatQ.s.g.en); }
    else if(f.dataset.f === 'mic') falaOuve(gatQ.s.g.en, document.getElementById('gatRes'));
  }
});
document.addEventListener('change', e => {
  const id = e.target && e.target.id; if(!/^gat(V|P|Tm|R)$/.test(id || '')) return;
  if(id === 'gatR') gatBat.resp = e.target.value === '1'; else if(id === 'gatV') gatBat.v = e.target.value; else if(id === 'gatP') gatBat.pr = e.target.value; else gatBat.tempo = e.target.value;
  document.getElementById('gatBatLista').innerHTML = gatBatLista();
});

/* ================= v160: RESPOSTAS PRÉ-PROGRAMADAS (3 por pergunta) =================
   Pergunta → resposta é o par que vira velocidade. Para cada gatilho (e, quando preciso, cada verbo) há 3 complementos prontos
   no formato "inglês|português". A frase completa é MONTADA pelo motor (mesmo sujeito, verbo e tempo da pergunta) + o complemento;
   a resposta curta (o que se diz de fato numa conversa) sai do próprio complemento. Complementos são neutros quanto ao tempo
   ("for personal reasons", não "because she is tired") para valerem no passado, presente e futuro. */
const GAT_R = {
  'Who':   { _:['My boss|Meu chefe','My sister|Minha irmã','The manager|O gerente','My parents|Meus pais|pl'], tipo:'suj' },
  'What':  { _:['Nothing|Nada','Something important|Algo importante','The new policy|A nova política'], tipo:'curta' },
  'Who (objeto)': { _:['my boss|meu chefe','my sister|minha irmã','the client|o cliente'] },
  'Who … with':   { _:['with her boss|com o chefe','with a friend|com uma amiga','with her family|com a família'] },
  'What (objeto)': { _:['something|algo'],
    do:['her homework|a lição de casa','the dishes|a louça','the report|o relatório'], need:['a new laptop|um notebook novo','more time|mais tempo','some help|ajuda'],
    want:['a coffee|um café','a vacation|férias','a new job|um novo emprego'], buy:['a new phone|um celular novo','some groceries|compras de mercado','a gift|um presente'],
    eat:['pasta|macarrão','a salad|uma salada','a sandwich|um sanduíche'], say:['hello|olá','the truth|a verdade','a few words|poucas palavras'], think:['so|que sim','the same|o mesmo','differently|diferente'],
    make:['dinner|o jantar','a plan|um plano','a decision|uma decisão'], plan:['a trip|uma viagem','the meeting|a reunião','her week|a semana'] },
  'What … for': { _:['for money|por dinheiro','for her family|pela família','for a better future|por um futuro melhor'],
    wait:['for the bus|pelo ônibus','for a call|por uma ligação','for her turn|pela vez dela'], pay:['for the rent|pelo aluguel','for the tickets|pelas passagens','for the food|pela comida'],
    save:['for a trip|para uma viagem','for a house|para uma casa','for the future|para o futuro'], study:['for the exam|para a prova','for a promotion|para uma promoção','for her future|pelo futuro'],
    live:['for her family|pela família','for music|pela música','for the moment|pelo momento'] },
  'Which one': { _:['the red one|a vermelha','the cheaper one|a mais barata','the first one|a primeira'] },
  'Where': { _:['in São Paulo|em São Paulo','at home|em casa','downtown|no centro'],
    go:['to the gym|para a academia','to the office|para o escritório','home|para casa'], come:['from Brazil|do Brasil','from the office|do escritório','from home|de casa'],
    park:['downtown|no centro','in the garage|na garagem','near the office|perto do escritório'], sleep:['at home|em casa','at a hotel|num hotel','in the living room|na sala'],
    meet:['at the cafe|no café','downtown|no centro','at the office|no escritório'] },
  'When': { _:['at nine|às nove','on Monday|na segunda','in the morning|de manhã'] },
  'What time': { _:['at eight thirty|às oito e meia','at noon|ao meio-dia','at a quarter past nine|às nove e quinze'] },
  'Since when': { _:['since 2020|desde 2020','since last year|desde o ano passado','since Monday|desde segunda'] },
  'Until when': { _:['until Friday|até sexta','until noon|até o meio-dia','until the end of the month|até o fim do mês'] },
  'How soon': { _:['in two days|em dois dias','in an hour|em uma hora','in a few minutes|em poucos minutos'] },
  'Why': { _:['for personal reasons|por motivos pessoais','to save money|para economizar','because of the cost|por causa do custo'] },
  'Why don\'t': { _:['Good idea.|Boa ideia.','Maybe later.|Talvez mais tarde.','Sure, why not?|Claro, por que não?'], tipo:'curta' },
  'How come': { _:['Long story.|É uma longa história.','Personal reasons.|Motivos pessoais.','The cost.|O custo.'], tipo:'curta' },
  'How': { _:['with a team|em equipe','carefully|com cuidado','step by step|passo a passo'],
    work:['remotely|remotamente','with a team|em equipe','hard|duro'], travel:['by plane|de avião','by train|de trem','by bus|de ônibus'],
    live:['alone|sozinha','comfortably|confortavelmente','in a small flat|num apartamento pequeno'], study:['with flashcards|com cartões','online|online','with a tutor|com um tutor'],
    learn:['by practicing|praticando','from videos|com vídeos','with a tutor|com um tutor'], sleep:['well|bem','badly|mal','like a baby|como um bebê'] },
  'How well': { _:['very well|muito bem','pretty well|bem','quite badly|bem mal'] },
  'How fast': { _:['very fast|muito rápido','quite slowly|bem devagar','as fast as possible|o mais rápido possível'] },
  'How long': { _:['for two hours|por duas horas','for a week|por uma semana','for a long time|por muito tempo'],
    take:['two hours|duas horas','about ten minutes|uns dez minutos','all day|o dia todo'] },
  'How much': { _:['ten dollars|dez dólares','a hundred dollars|cem dólares','a lot of money|muito dinheiro'] },
  'How many times': { _:['once|uma vez','twice|duas vezes','three times a day|três vezes ao dia'] },
  'How many hours': { _:['two hours|duas horas','eight hours|oito horas','about six hours|umas seis horas'] },
  'How often': { _:['every day|todo dia','once a week|uma vez por semana','twice a month|duas vezes por mês'] },
  'How far': { _:['two miles|duas milhas','ten kilometers|dez quilômetros','a long way|um longo caminho'] },
  'How old': { _:['Twenty-five years old.|Vinte e cinco anos.','Thirty years old.|Trinta anos.','Forty-one years old.|Quarenta e um anos.'], tipo:'curta' }
};
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
/* devolve até 3 respostas: { en: frase completa, curta: o que se diz, pt, aux } */
function gatRespostas(k, vid, pr, tempo){
  const D = GAT_R[k], T = gatT(k) || {}; if(!D) return [];
  const lista = (vid && D[vid]) || D._, tp = tempo || T.tp || 'present', asp = T.asp || 'simples';
  const out = [];
  lista.slice(0, 3).forEach(raw => {
    const [en, pt, fl] = raw.split('|');
    if(D.tipo === 'curta'){ const t = cap1(en); const f = /[.?!]$/.test(t) ? t : t + '.'; out.push({ en:f, curta:f, pt:pt }); return; }
    if(D.tipo === 'suj'){
      const aux = tp === 'past' ? 'did' : tp === 'future' ? 'will' : (fl === 'pl' ? 'do' : 'does');
      out.push({ en:en + ' ' + aux + '.', curta:en + '.', pt:pt + '.' }); return;
    }
    try {
      const st = (WH_X[k] || {}).so === 'state'; if(st) return;
      const v = verbById(vid), p = gatPrV(vid, pr || 'She');
      const base = stripMarks(generate('fact', tp, asp, 'afirmativa', p, v).text);
      let ptb = ''; try { ptb = translate('fact', tp, asp, 'afirmativa', p, null, [], v.id, null, null).replace(/[.?!]\s*$/, ''); } catch(e){}
      if(p === 'It' && ptb){ ptb = ptb.replace(/^Ele\/ela\s+/, ''); ptb = ptb.charAt(0).toUpperCase() + ptb.slice(1); }   /* "Dura…", "Leva…" (sem pronome) */
      if(v.id === 'take') ptb = ptb.replace(/^Pega/, 'Leva').replace(/^Pegou/, 'Levou').replace(/^Vai pegar/, 'Vai levar');
      if(v.id === 'need') ptb = ptb.replace(/(precis\w+)$/, '$1 de');   /* "precisa de dez dólares" */
      out.push({ en: base + ' ' + en + '.', curta: cap1(en) + '.', pt: ptb ? ptb + ' ' + pt + '.' : pt });
    } catch(e){}
  });
  return out;
}
/* bloco HTML com as respostas: frase completa (🔊/🎤) + a forma curta de conversa */
function gatRespHTML(rs){
  if(!rs.length) return '';
  return `<div class="gat-resp"><b>3 respostas prontas</b>${rs.map(r => `<div class="gat-rl" data-en="${escapeHTML(r.en)}"><span class="gat-rn"><span class="gat-ren">${escapeHTML(r.en)}</span><span class="gat-rpt">${escapeHTML(r.pt)}</span>${r.curta !== r.en ? `<span class="gat-rc">curta: <i>${escapeHTML(r.curta)}</i></span>` : ''}</span><span class="gat-ab"><button type="button" class="audio-btn" data-rs="1" title="Ouvir">🔊</button>${FALA_OK ? '<button type="button" class="audio-btn" data-rm="1" title="Repita">🎤</button>' : ''}</span><span class="fala-res"></span></div>`).join('')}</div>`;
}

/* ================= v161: PERGUNTA INDIRETA + RESPOSTAS COMO PEÇAS DO MOTOR =================
   (1) "I don't know which one she prefers": a pergunta vira OBJETO do verbo (know, ask, wonder…). Ordem de afirmativa, sem do/does.
       Os verbos de cada palavra interrogativa vêm dos Gatilhos de resposta (mesma fonte, nada duplicado).
   (2) Os complementos das respostas (GAT_R) entram nas colocações dos verbos e as expressões de tempo/frequência/duração/modo/valor
       entram nas palavras-sinal: aparecem nos dials do motor e o leitor de português passa a entendê-los. Só se ACRESCENTA no fim das
       listas, então os índices salvos (colocação escolhida) continuam apontando para o mesmo item. */
const O2_OQ_IDS = ['know','ask','tell','explain','understand','remember','forget','decide','learn','wonder','see','show','check','discover','realize','guess','imagine','find out'];
function O2_OQ_V(){ return O2_OQ_IDS.filter(id => VERBS.some(v => v.id === id)); }
function o2OqEstado(){
  const verb = verbById(state.verbo), ids = O2_OQ_V();
  if(state.categoria !== 'fact' || !ids.includes(verb.id)) return { ok:false, msg:'A pergunta indireta parte de um verbo de <b>saber, perguntar, explicar ou decidir</b> (know, ask, wonder, explain, decide…): a pergunta vira o objeto dele. Escolha um destes.', sug:ids.slice(0, 6) };
  if(state.colocacao !== null) return { ok:false, msg:'A pergunta indireta <b>é</b> o objeto do verbo, então não combina com uma colocação do dial. Tire a colocação.', semSug:true };
  return { ok:true };
}
function o2OqOpcoes(v, cj){
  const t = O2_TIPOS.find(x => x.k === 'oq'), cjo = t.conjs[cj] || t.conjs[0], gt = gatT(cjo.g);
  let ids = gt ? gatVerbos(gt) : []; ids = ids.filter(id => id !== v.id);
  if(!ids.length) ids = ['work', 'go', 'call'].filter(id => id !== v.id);
  return ids.map(id => ({ v:id, en:'', pt:'', neg:false, src:'✓' }));
}
function o2ComporOq(tipo, o, c, op, pr){
  const st = o2OqEstado(); if(!st.ok) return null;
  const v2 = op.v ? verbById(op.v) : null; if(!v2) return null;
  const sj = ['I','You','He','She','It','We','They'].includes(o.sj2) ? o.sj2 : (pr === 'She' ? 'He' : 'She');       /* sujeito da pergunta: ela/ele ≠ quem fala */
  const p2 = gatPrV(v2.id, sj), tp2 = ['past', 'present', 'future'].includes(o.tp2) ? o.tp2 : (state.tempo === 'past' ? 'past' : 'present'), fmt = o.neg ? 'negativa' : 'afirmativa';   /* v162: tempo próprio ("I know why she left") */
  const as2 = ['simples', 'continuo', 'perfeito'].includes(o.as2) ? o.as2 : 'simples';   /* v163: aspecto próprio ("I know why she has left") */
  const g2 = generate('fact', tp2, as2, fmt, p2, v2);
  let pt2 = ''; try { pt2 = translate('fact', tp2, as2, fmt, p2, null, [], v2.id, null, null).replace(/[.?!]\s*$/, ''); } catch(e){}
  pt2 = pt2.charAt(0).toLowerCase() + pt2.slice(1);
  if(p2 === 'It'){ pt2 = pt2.replace(/^ele\/ela\s+/i, ''); if(v2.id === 'take') pt2 = pt2.replace(/^pega/, 'leva').replace(/^pegou/, 'levou'); }
  const enCl = J(c.en) + ' ' + lowerFirstMarked(g2.text), ptCl = c.pt + ' ' + pt2;
  const nota = '<b>Pergunta indireta</b> — a pergunta (<i>' + c.en + '</i>) vira o <b>objeto</b> de <i>' + nomeV(verbById(state.verbo)) + '</i>. Dentro dela a ordem é de <b>afirmativa</b>: sujeito + verbo, <b>sem do/does/did</b> e sem ponto de interrogação ("I don\'t know where <i>she lives</i>", nunca "where does she live"). ' +
    'No passado o verbo da pergunta acompanha (<i>didn\'t know where she lived</i>). Se a frase inteira é pergunta, só a principal inverte: <i>Do you know where she lives?</i>' + (sj !== pr && o.sj2 ? '' : '<br>O sujeito da pergunta é <b>' + sj.toLowerCase() + '</b> (alguém diferente de quem fala).');
  return { tipo, op, en:' ' + enCl, enCl, ptCl, ini:false,
    ptJuntar: pt1 => pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + o2FimPT(pt1),
    estrutura:'+ ' + c.en + ' + sujeito + verbo (ordem de afirmativa)', nota };
}
/* ---- respostas viram colocações dos verbos e palavras-sinal ---- */
(function gatNasPecas(){
  const jaTem = (lista, en) => lista.some(c => String(c.en).toLowerCase() === en.toLowerCase());
  const entra = (v, raw) => { const [en, pt] = raw.split('|'); if(!en || !pt || /[.?!]$/.test(en) || /\b(her|his)\b/i.test(en)) return;
    if(!v.col) v.col = []; if(!jaTem(v.col, en)) v.col.push({ en, pt, us:en, uk:en }); };
  Object.keys(GAT_R).forEach(k => { const D = GAT_R[k]; if(D.tipo) return;
    Object.keys(D).forEach(vk => {
      if(vk === 'tipo') return;
      if(vk === '_'){ const t = gatT(k); if(!t) return; t.v.forEach(id => { const v = VERBS.find(x => x.id === id); if(v && !D[id]) D._.forEach(raw => entra(v, raw)); }); return; }
      const v = VERBS.find(x => x.id === vk); if(v) D[vk].forEach(raw => entra(v, raw));
    }); });
  /* sinais: tempo, frequência, duração, modo e valor entram em TODOS os tempos (o aluno decide se combina) */
  const SIG = { 'When':'timePoint', 'What time':'atFam', 'Until when':'timePoint', 'How soon':'inFam', 'Why':'forFam', 'How well':'mannerFam', 'How fast':'mannerFam',
    'How much':'bitFam', 'How many hours':'bitFam', 'How far':'bitFam', 'Where':'placeFam', 'How long':'forFam', 'How many times':'freqDef', 'How often':'freqDef' };
  const cls = (k, en) => /^at /i.test(en) ? 'atFam' : /^in (a|an|the|two|\d)/i.test(en) && k === 'How soon' ? 'inFam' : /^for /i.test(en) ? 'forFam' : /^to /i.test(en) ? 'toFam' : SIG[k];
  Object.keys(SIGNAL_WORDS).forEach(chave => { const lista = SIGNAL_WORDS[chave];
    Object.keys(SIG).forEach(k => { const D = GAT_R[k]; if(!D || D.tipo) return;
      D._.forEach(raw => { const en = raw.split('|')[0]; if(!lista.some(x => x.w.toLowerCase() === en.toLowerCase())) lista.push({ w:en, pl:'end', cls:cls(k, en) });
        if(!SIGNAL_PT[en]) SIGNAL_PT[en] = raw.split('|')[1]; }); }); });
})();

buildMatrix();

/* ---- Exportação da tabela-resumo como PNG (canvas nativo, sem dependências externas) ---- */
function buildMatrixExportData(){
  return Object.keys(CATEGORIES).map(catKey=>{
    const cat = CATEGORIES[catKey];
    const rows = cat.aspects.map(asp=>{
      const v = matrixVerb(), pr = matrixPronoun();
      const cells = ["past","present","future"].map(t=>({
        aff: generate(catKey,t,asp,'afirmativa',pr,v).text + ".",
        neg: generate(catKey,t,asp,'negativa',pr,v).text + ".",
        per: generate(catKey,t,asp,'pergunta',pr,v).text + M("?"),
        perneg: generate(catKey,t,asp,'pergunta_negativa',pr,v).text + M("?")
      }));
      return { label: ASPECT_LABEL[asp], cells };
    });
    return { icon: cat.icon, label: cat.label, rows };
  });
}

/* Desenha uma linha com marcação de cor por morfema no canvas — cada trecho marcado
   usa markColor, o resto usa neutralColor — avançando o cursor x conforme a largura real. */
function drawMarkedLine(ctx, text, x, y, neutralColor, markColor, cores){
  let cx = x;
  const paleta = cores || {};
  markedToSegments(text).forEach(seg=>{
    ctx.fillStyle = seg.kind==='neutral' ? neutralColor
                  : (seg.kind==='formato' ? markColor : (paleta[seg.kind] || markColor));
    ctx.fillText(seg.t, cx, y);
    cx += ctx.measureText(seg.t).width;
  });
}
function downloadMatrixPNG(){
  const btn = document.getElementById('downloadMatrixBtn');
  const btnLabel = btn ? btn.textContent : null;
  if(btn){ btn.setAttribute('disabled',''); btn.textContent = '⏳ Gerando...'; }

  const data = buildMatrixExportData();
  /* O PNG acompanha o tema ativo: exportar uma imagem escura enquanto a tela está clara
     (ou o contrário) quebra a expectativa de "baixar o que estou vendo". As cores saem
     das mesmas variáveis CSS que pintam a tabela na tela, então tema e arquivo nunca
     divergem — se a paleta mudar um dia, o export muda junto. */
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  /* a tabela não usa adjuntos hoje, mas a paleta acompanha caso passe a usar */
  const ADJ_PNG = { conj: isLight ? '#9b2fc4' : '#d072f2', quando: isLight ? '#5f57ad' : '#8f8fd6', como: isLight ? '#b3601a' : '#e09a5f',
                    onde: isLight ? '#5c6b18' : '#b9cf5c', regencia: isLight ? '#2f5f9e' : '#6b9fd8' };
  const cssVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  };
  const BG = isLight ? cssVar('--bg-top', '#fbf7ee') : '#10151c';
  const LINE = isLight ? 'rgba(33,28,20,0.18)' : 'rgba(237,230,214,0.16)';
  const PAPER = cssVar('--paper', isLight ? '#211c14' : '#ede6d6');
  const PAPER_DIM = cssVar('--paper-dim', isLight ? '#6e6656' : '#a9a294');
  const BRASS = cssVar('--brass', isLight ? '#a8762c' : '#c9a34e');
  const TEAL = cssVar('--teal', isLight ? '#227b6b' : '#4fb6a6');
  const RED = cssVar('--red', isLight ? '#a83527' : '#c1483d');
  const BURNT = cssVar('--burnt-yellow', isLight ? '#96650f' : '#c9972c');
  const ROSE = cssVar('--rose', isLight ? '#a03a6e' : '#c76d9e');
  const headers = ["Passado","Presente","Futuro"];
  const pad=26, colGap=14, rowPad=10, lineH=17, headH=30, capH=30, tableGap=26, titleH=50, colLabelMin=110;
  const mono = size => `${size}px 'JetBrains Mono', ui-monospace, 'SF Mono', SFMono-Regular, Menlo, 'Roboto Mono', monospace`;
  const head = size => `700 ${size}px 'Space Grotesk', 'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif`;

  const meas = document.createElement('canvas').getContext('2d');
  meas.font = mono(12.5);
  let colW = [0,0,0];
  headers.forEach((h,i)=>{ colW[i] = Math.max(colW[i], meas.measureText(h.toUpperCase()).width); });
  data.forEach(cat=> cat.rows.forEach(r=> r.cells.forEach((c,i)=>{
    [c.aff,c.neg,c.per,c.perneg].forEach(line=>{ colW[i] = Math.max(colW[i], meas.measureText(stripMarks(line)).width); });
  })));
  colW = colW.map(w=>w+22);

  meas.font = "700 13px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  let labelW = colLabelMin;
  data.forEach(cat=> cat.rows.forEach(r=>{ labelW = Math.max(labelW, meas.measureText(r.label).width+16); }));

  const tableW = labelW + colW.reduce((a,b)=>a+b,0) + colGap*3;
  const totalW = tableW + pad*2;
  const legendH = 26;
  let totalH = pad + titleH;
  data.forEach(cat=>{
    totalH += capH + headH;
    cat.rows.forEach(()=>{ totalH += rowPad*2 + lineH*4; });
    totalH += tableGap;
  });
  totalH += legendH + pad;

  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(totalW*scale); canvas.height = Math.ceil(totalH*scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale,scale);
  ctx.fillStyle = BG; ctx.fillRect(0,0,totalW,totalH);

  let y = pad;
  ctx.fillStyle = BRASS; ctx.font = head(19);
  ctx.fillText("Painel Mestre do Inglês", pad, y+20);
  ctx.fillStyle = PAPER_DIM; ctx.font = "12px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(`Tabela-resumo — tempos e aspectos (verbo: ${matrixVerb().base}${matrixVerb().prt ? " " + matrixVerb().prt : ""} · pronome: ${matrixPronoun()})`, pad, y+38);
  y += titleH;

  data.forEach(cat=>{
    ctx.fillStyle = PAPER; ctx.font = head(15);
    ctx.fillText(`${cat.icon}  ${cat.label}`, pad, y+18);
    y += capH;

    ctx.font = `700 10.5px 'JetBrains Mono', ui-monospace, 'SF Mono', SFMono-Regular, Menlo, 'Roboto Mono', monospace`; ctx.fillStyle = BRASS;
    let x = pad + labelW;
    headers.forEach((h,i)=>{ ctx.fillText(h.toUpperCase(), x+8, y+18); x += colW[i]+colGap; });
    y += headH;
    ctx.strokeStyle = LINE; ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(pad+tableW,y); ctx.stroke();

    cat.rows.forEach(r=>{
      const rowH = rowPad*2 + lineH*4;
      ctx.fillStyle = PAPER; ctx.font = "700 13px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(r.label, pad, y+rowPad+13);

      let x2 = pad + labelW;
      r.cells.forEach((c,i)=>{
        ctx.font = mono(12.5);
        [[c.aff,TEAL],[c.neg,RED],[c.per,BURNT],[c.perneg,ROSE]].forEach(([t,markColor],li)=>{
          drawMarkedLine(ctx, t, x2+8, y+rowPad+12+li*lineH, PAPER, markColor, ADJ_PNG);
        });
        x2 += colW[i]+colGap;
      });
      y += rowH;
      ctx.strokeStyle = LINE; ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(pad+tableW,y); ctx.stroke();
    });
    y += tableGap;
  });

  // legenda de cores no rodapé do PNG
  const legend = [["sujeito + raiz", PAPER],["afirmativa", TEAL],["negativa", RED],["pergunta", BURNT],["pergunta negativa", ROSE]];
  ctx.font = "10.5px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  let lx = pad;
  legend.forEach(([label,color])=>{
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(lx+4, y+8, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = PAPER_DIM; ctx.fillText(label, lx+13, y+12);
    lx += 13 + ctx.measureText(label).width + 18;
  });

  canvas.toBlob(blob=>{
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'painel-mestre-ingles-tabela.png';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=>URL.revokeObjectURL(url), 4000);
    if(btn){ btn.removeAttribute('disabled'); btn.textContent = btnLabel; }
  }, 'image/png');
}
/* ---- Modo prática: sorteia uma combinação, mostra o português e cobra o inglês.
   Não tem banco próprio de frases — chama os mesmos geradores dos dois consoles,
   então tudo que for adicionado a eles (verbos, sinais, regências) entra aqui de graça. ---- */
const PRACTICE_LEVELS = [
  { key:"basico", label:"Básico", tempos:["present","past"], aspectos:["simples"], formatos:["afirmativa","negativa"], signal:false, col:false, modal:false },
  { key:"medio", label:"Médio", tempos:["present","past","future"], aspectos:["simples","continuo","perfeito"], formatos:["afirmativa","negativa","pergunta"], signal:true, col:true, modal:false },
  { key:"avancado", label:"Avançado", tempos:["present","past","future"], aspectos:["simples","continuo","perfeito","perfeito_continuo"], formatos:FORMATOS, signal:true, col:true, modal:true }
];
/* Origem dos desafios: os motores (gerados), o banco de expressões (curados por você)
   ou a mistura dos dois. O banco só entra quando expressoes.js já carregou. */
const PRACTICE_SOURCES = [
  { key:"misto", label:"Misto" },
  { key:"motores", label:"Motores" },
  { key:"expressoes", label:"Expressões" },
  { key:"registro", label:"🎩 Registro" }   /* v84: contraste cotidiano × formal — não depende do banco */
];
let practiceState = { level:"medio", source:"misto", tema:null, origem:null, challenge:null, revealed:false, checked:null, typed:'', seen:0, hits:0, misses:0, missQueue:[] };
const pick = arr => arr[Math.floor(Math.random()*arr.length)];

/* Desafio vindo do banco: a expressão inteira é a resposta — não passa por nenhum motor,
   porque essas unidades se aprendem fechadas. No nível Básico ficam só as frases prontas
   ("Take care!"), que são as mais curtas e diretas. */
function newExprChallenge(){
  if(!hasDb()) return null;
  const lv = practiceState.level;
  let pool = [];
  Object.keys(EXPR_DB).forEach(fam=>{
    EXPR_DB[fam].items.forEach(it=>{
      if(lv === 'basico' && !dbIsPhrase(it)) return;
      pool.push({fam, it});
    });
  });
  if(!pool.length) return null;
  const {fam, it} = pick(pool);
  const specs = ["Banco", fam, it.group];
  if(dbIsPhrase(it)) specs.push("frase pronta");
  return {
    pt: it.translation,
    raw: R(it.expression),          /* azul: unidade lexical vinda do banco */
    formato: 'afirmativa',
    structure: it.note ? `${it.note} · ${EXPR_DB[fam].core}` : EXPR_DB[fam].core,
    specs, isExpr: true
  };
}

/* Verbos sorteáveis: todos, ou só os do tema escolhido (ex.: treinar só "compras").
   Um tema sem verbos nunca esvazia o sorteio — cai de volta no banco inteiro. */
function verbosDoTreino(){
  const t = practiceState.tema;
  const base = t ? verbosDoTema(t) : VERBS;
  const f = verbosPorOrigem(base, practiceState.origem);
  return f.length ? f : (base.length ? base : VERBS);   /* interseção vazia: relaxa a origem, nunca esvazia o sorteio */
}
/* Desafio de registro: o mesmo sentido em dois verbos (cotidiano × formal). Mostra uma situação
   ("e-mail a um cliente", "mensagem a um amigo") e a frase em português; o aluno escolhe, entre duas
   frases em inglês idênticas exceto pelo verbo, a que combina com a situação. O complemento do par
   serve aos dois verbos, então a gramática nunca denuncia a resposta — só o registro. */
function newRegChallenge(){
  const lv = PRACTICE_LEVELS.find(l=>l.key===practiceState.level) || PRACTICE_LEVELS[1];
  const pares = REG_PARES.filter(p => verbById(p[0]) && verbById(p[1]));
  const par = pick(pares), [, , en, ptc, nuance] = par;
  const vI = verbById(par[0]), vF = verbById(par[1]);
  const lado = Math.random() < 0.5 ? 'for' : 'inf';            /* qual registro a situação pede */
  const ctx = pick(REG_CTX[lado]);
  const pronome = pick(PRONOUNS), formato = pick(lv.formatos), tempo = pick(lv.tempos), aspecto = pick(lv.aspectos);
  const col = { en, pt: ptc };
  const monta = v => {
    const g = generate('fact', tempo, aspecto, formato, pronome, v);
    return { raw: applySignal(g.text, null, null, col, null, formato) + (g.isQuestion ? M("?") : "."), structure: g.structure };
  };
  const fI = monta(vI), fF = monta(vF);
  const certo = lado === 'for' ? fF : fI, errado = lado === 'for' ? fI : fF;
  const opts = [{ t: stripMarks(certo.raw), ok:true }, { t: stripMarks(errado.raw), ok:false }];
  if(Math.random() < 0.5) opts.reverse();
  const origem = v => { const e = etimDe(v), m = e && etimMeta(e.k); return m ? `${nomeVerbo(v)} (${m.curto.toLowerCase()})` : nomeVerbo(v); };
  return {
    pt: translate('fact', tempo, aspecto, formato, pronome, null, null, vI.id, col, null),
    raw: certo.raw, formato,
    structure: `${lado === 'for' ? '🎩 Situação formal → ' + nomeVerbo(vF) : '🗣️ Situação cotidiana → ' + nomeVerbo(vI)}. ${nuance} · ${origem(vI)} ↔ ${origem(vF)}`,
    specs: ["Registro", TENSE_LABEL[tempo], ASPECT_LABEL[aspecto], FORMATO_LABEL[formato]],
    isReg: true, ctx: { icon: ctx[0], label: ctx[1], reg: lado }, opts
  };
}
/* Resposta por toque no modo Registro: usa o mesmo placar e a mesma fila de revisão da digitação. */
function escolherRegistro(i){
  const c = practiceState.challenge;
  if(!c || !c.isReg || practiceState.revealed || !c.opts[i]) return;
  const op = c.opts[i];
  practiceState.revealed = true; practiceState.typed = op.t;
  practiceState.checked = op.ok ? 'ok' : 'no';
  if(op.ok) practiceState.hits++;
  else { practiceState.misses++; if(practiceState.missQueue.length < 12) practiceState.missQueue.push(c); }
  renderPractice(); saveState();
}
function newChallenge(){
  /* Misto tenta o banco em ~35% dos sorteios; se o banco não estiver disponível,
     cai nos motores sem avisar — o estudo não pode parar por causa de um arquivo. */
  const src = practiceState.source;
  if(src === 'registro') return newRegChallenge();
  if(src === 'expressoes' || (src === 'misto' && Math.random() < 0.35)){
    const c = newExprChallenge();
    if(c) return c;
  }
  const lv = PRACTICE_LEVELS.find(l=>l.key===practiceState.level) || PRACTICE_LEVELS[1];
  const pronome = pick(PRONOUNS), verb = pick(verbosDoTreino()), formato = pick(lv.formatos);
  const useModal = lv.modal && Math.random() < 0.3;

  if(useModal){
    const fk = pick(Object.keys(MODAL_ENGINE)), fdef = MODAL_ENGINE[fk], tdef = pick(fdef.tempos);
    const col = (lv.col && verb.col && Math.random()<0.5) ? pick(verb.col) : null;
    const signal = Math.random()<0.4 ? pick(MODAL_SIGNALS[fk].filter(variantOk)) : null;
    const g = tdef.gen(pronome, verb, formato);
    const isQ = formato==='pergunta' || formato==='pergunta_negativa';
    let raw = g.text;
    if(col) raw += ' ' + R(col.en);
    if(signal) raw += ' ' + C(signal, modalSignalFam(signal));
    raw += isQ ? M('?') : '.';
    const per = ptPerson(pronome), pron = PT_PRONOUN[pronome], vpt = PT_VERBS[verb.id] || PT_VERBS.work;
    const neg = formato==='negativa' || formato==='pergunta_negativa';
    let ptBody = tdef.pt(per, vpt);
    if(col) ptBody += ' ' + col.pt;
    if(signal) ptBody += ' ' + (SIGNAL_PT[signal] || signal);
    return { pt:`${cap(pron)}${neg?' não':''} ${ptBody}` + (isQ?'?':'.'), raw, formato,
      structure:tdef.structure, specs:["Modais", fdef.label, tdef.label, FORMATO_LABEL[formato]].concat((practiceState.tema && verbTemaMeta(practiceState.tema)) ? [`${verbTemaMeta(practiceState.tema).icon} ${verbTemaMeta(practiceState.tema).curto}`] : []) };
  }

  /* com tema escolhido, só frases com verbo de ação (os estados com "be" não têm tema) */
  const categoria = (practiceState.tema || practiceState.origem || Math.random()<0.8) ? 'fact' : 'state';
  const aspectos = categoria==='fact' ? lv.aspectos : lv.aspectos.filter(a=>a==='simples'||a==='perfeito');
  const tempo = pick(lv.tempos), aspecto = pick(aspectos.length?aspectos:['simples']);
  const v = categoria==='fact' ? verb : null;
  const col = (lv.col && v && v.col && Math.random()<0.5) ? pick(v.col) : null;
  const key = `${tempo}_${aspecto}`;
  const pool = (SIGNAL_WORDS[key] || []).filter(x => variantOk(x.w));
  const sig = (lv.signal && pool.length && Math.random()<0.55) ? pick(pool) : null;
  const signalMid = sig && sig.pl==='mid' ? sig : null, signalEnd = sig && sig.pl==='end' ? sig : null;

  const g = generate(categoria, tempo, aspecto, formato, pronome, v);
  const raw = applySignal(g.text, signalMid, signalEnd, col, null, formato) + (g.isQuestion ? M("?") : ".");
  const pt = translate(categoria, tempo, aspecto, formato, pronome, signalMid, signalEnd, v ? v.id : null, col, null);
  const specs = [CATEGORIES[categoria].label, TENSE_LABEL[tempo], ASPECT_LABEL[aspecto], FORMATO_LABEL[formato]];
  if(col) specs.push("com regência");
  if(sig) specs.push("com sinal");
  if(practiceState.tema && v){ const tm = verbTemaMeta(practiceState.tema); if(tm) specs.push(`${tm.icon} ${tm.curto}`); }
  if(practiceState.origem && v){ const om = etimMeta(practiceState.origem); if(om) specs.push(`${om.icon} ${om.curto}`); }
  return { pt, raw, formato, structure:g.structure, specs };
}

/* ---- Verificação da resposta digitada ----
   A comparação é tolerante ao que não é erro de inglês: maiúsculas, acentos, pontuação
   final, espaços repetidos e contrações (don't = do not). O "to" inicial das expressões
   do banco é opcional, porque é notação de dicionário, não parte da frase. Quando o banco
   traz variantes separadas por ";", qualquer uma delas vale. */
function normAnswer(s){
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[’´`]/g, "'")
    .replace(/\bdo not\b/g,"don't").replace(/\bdoes not\b/g,"doesn't").replace(/\bdid not\b/g,"didn't")
    .replace(/\bis not\b/g,"isn't").replace(/\bare not\b/g,"aren't").replace(/\bwas not\b/g,"wasn't")
    .replace(/\bwere not\b/g,"weren't").replace(/\bhave not\b/g,"haven't").replace(/\bhas not\b/g,"hasn't")
    .replace(/\bhad not\b/g,"hadn't").replace(/\bwill not\b/g,"won't").replace(/\bcannot\b/g,"can't")
    .replace(/\bcan not\b/g,"can't").replace(/\bcould not\b/g,"couldn't").replace(/\bshould not\b/g,"shouldn't")
    .replace(/\bi am\b/g,"i'm").replace(/\bmight not\b/g,"might not")
    .replace(/[.,;:!?"]/g,'')
    .replace(/\s+/g,' ').trim();
}
function expectedAnswers(c){
  const base = stripMarks(c.raw);
  const out = [base];
  if(c.isExpr && /^to /i.test(base)) out.push(base.replace(/^to /i,''));
  return out.map(x => canonVar(normAnswer(x)));
}
/* Distância de edição só para distinguir "quase certo" de "errado" — um erro de digitação
   não deveria dar a mesma resposta que uma frase completamente diferente. */
function editDistance(a,b){
  const m=a.length, n=b.length;
  if(!m||!n) return Math.max(m,n);
  let prev=Array.from({length:n+1},(_,j)=>j), cur=new Array(n+1);
  for(let i=1;i<=m;i++){
    cur[0]=i;
    for(let j=1;j<=n;j++){
      cur[j] = Math.min(prev[j]+1, cur[j-1]+1, prev[j-1] + (a[i-1]===b[j-1]?0:1));
    }
    [prev,cur]=[cur,prev];
  }
  return prev[n];
}
function checkAnswer(){
  const c = practiceState.challenge;
  const input = document.getElementById('practiceInput');
  const typed = (input.value || '').trim();
  if(!c || !typed) return;
  const norm = canonVar(normAnswer(typed));
  const exp = expectedAnswers(c);
  const exact = exp.includes(norm);
  const dist = Math.min(...exp.map(e=>editDistance(norm, e)));
  const near = !exact && dist <= Math.max(2, Math.round(exp[0].length * 0.12));

  practiceState.revealed = true;
  practiceState.checked = exact ? 'ok' : (near ? 'almost' : 'no');
  practiceState.typed = typed;
  if(exact){ practiceState.hits++; }
  else if(!near){
    practiceState.misses++;
    if(practiceState.missQueue.length < 12) practiceState.missQueue.push(c);
  }
  renderPractice(); saveState();
}

function renderPractice(){
  const srow = document.getElementById('practiceSourceRow'); srow.innerHTML="";
  PRACTICE_SOURCES.forEach(s=>{
    const disabled = (s.key === 'expressoes' || s.key === 'misto') && !hasDb();   /* motores e registro não dependem do banco */
    const b=document.createElement('div'); b.className='pronome-pill';
    b.dataset.active=(practiceState.source===s.key); b.textContent=s.label;
    b.style.opacity = disabled ? .4 : 1;
    b.onclick=()=>{ if(disabled) return; practiceState.source=s.key; nextChallenge(); saveState(); };
    srow.appendChild(b);
  });
  document.getElementById('practiceHint').textContent = practiceState.source === 'registro'
    ? `Leia a situação e escolha o verbo à altura dela: o mesmo sentido, dois registros (${REG_PARES.length} pares cotidiano × formal).`
    : practiceState.source === 'expressoes'
    ? 'Expressões do seu banco — a resposta é a unidade inteira, sem conjugação.'
    : (practiceState.source === 'misto'
        ? 'Mistura frases geradas pelos motores com expressões do seu banco.'
        : 'Os desafios são gerados pelos mesmos motores — nada é fixo.');
  /* Tema dos verbos: só vale para os desafios dos motores; o banco de expressões não tem tema. */
  const trow = document.getElementById('practiceTemaRow'); trow.innerHTML = "";
  const soExpr = practiceState.source === 'expressoes' || practiceState.source === 'registro';   /* sem tema/origem nesses modos */
  const opcoes = [{ k:null, label:'Todos' }]
    .concat(VERB_TEMAS.map(t => ({ k:t.k, label:`${t.icon} ${t.curto}` })))
    .concat([{ k:VERB_TEMA_FRASAIS, label:'⚡ Frasais' }]);
  opcoes.forEach(o=>{
    const b = document.createElement('div'); b.className = 'pronome-pill';
    b.dataset.active = ((practiceState.tema || null) === o.k); b.textContent = o.label;
    b.style.opacity = soExpr ? .4 : 1;
    b.onclick = ()=>{ if(soExpr) return; practiceState.tema = o.k; nextChallenge(); saveState(); };
    trow.appendChild(b);
  });
  const orow = document.getElementById('practiceOrigemRow'); orow.innerHTML = "";
  linhaOrigens(orow, practiceState.origem, practiceState.tema ? verbosDoTema(practiceState.tema) : VERBS, k => { if(soExpr) return; practiceState.origem = k; nextChallenge(); saveState(); });
  const th = document.getElementById('practiceTemaHint');
  if(soExpr) th.textContent = practiceState.source === 'registro'
    ? 'Tema e origem não se aplicam ao modo Registro — os pares vêm da tabela de contraste cotidiano × formal.'
    : 'O tema vale para os motores — em "Expressões" as unidades vêm do seu banco.';
  else if(practiceState.tema || practiceState.origem){
    const meta = practiceState.tema ? verbTemaMeta(practiceState.tema) : null, om = practiceState.origem ? etimMeta(practiceState.origem) : null;
    const vazia = meta && om && !verbosPorOrigem(verbosDoTema(practiceState.tema), practiceState.origem).length;
    if(vazia) th.textContent = `Nenhum verbo de ${meta.nome} com origem ${om.curto.toLowerCase()} — sorteando o tema inteiro (${verbosDoTreino().length} verbos).`;
    else th.textContent = `Só verbos ${meta ? 'de ' + meta.nome : ''}${meta && om ? ' · ' : ''}${om ? 'de origem ' + om.curto.toLowerCase() : ''} · ${verbosDoTreino().length} verbos no sorteio.`;
  } else th.textContent = `Sorteio entre os ${VERBS.length} verbos do banco. Escolha um tema para treinar um campo de cada vez.`;
  const row = document.getElementById('practiceLevelRow'); row.innerHTML="";
  PRACTICE_LEVELS.forEach(l=>{
    const b=document.createElement('div'); b.className='pronome-pill';
    b.dataset.active=(practiceState.level===l.key); b.textContent=l.label;
    b.onclick=()=>{ practiceState.level=l.key; practiceState.challenge=null;
      practiceState.hits=0; practiceState.misses=0; practiceState.missQueue=[]; practiceState.seen=0;
      nextChallenge(); };
    row.appendChild(b);
  });
  const c = practiceState.challenge;
  if(!c) return;
  document.getElementById('practicePT').textContent = c.pt;
  document.getElementById('practiceSpecs').innerHTML = c.specs.map(s=>`<span>${s}</span>`).join('');
  /* modo Registro: situação + duas frases para escolher (sem campo de digitação) */
  const ctxEl = document.getElementById('practiceCtx'), chEl = document.getElementById('practiceChoices');
  ctxEl.hidden = !c.isReg; chEl.hidden = !c.isReg;
  document.getElementById('practiceReveal').hidden = !!c.isReg;
  if(c.isReg){
    ctxEl.innerHTML = `${c.ctx.icon} <b>Situação:</b> ${escapeHTML(c.ctx.label)} — qual verbo combina?`;
    chEl.innerHTML = '';
    c.opts.forEach((o, i)=>{
      const b = document.createElement('button'); b.type = 'button'; b.className = 'practice-choice'; b.textContent = o.t;
      b.disabled = practiceState.revealed;
      if(practiceState.revealed) b.dataset.state = o.ok ? 'ok' : (practiceState.typed === o.t ? 'no' : '');
      b.onclick = () => escolherRegistro(i);
      chEl.appendChild(b);
    });
  }
  const ans = document.getElementById('practiceAnswer'), audio = document.getElementById('practiceAudio');
  ans.hidden = !practiceState.revealed; audio.hidden = !practiceState.revealed;
  if(practiceState.revealed){
    document.getElementById('practiceEN').innerHTML = markedToHTML(c.raw, markColorVar(c.formato));
    document.getElementById('practiceStructure').textContent = c.structure;
    audio.dataset.text = stripMarks(c.raw);
    const cp = document.getElementById('copyPractice');
    cp.hidden = false; cp.dataset.text = stripMarks(c.raw) + "\n" + c.pt;
  } else { document.getElementById('copyPractice').hidden = true; }
  /* Três estados: respondendo (campo + conferir), conferido (veredito + próxima) e
     revelado sem conferir (autoavaliação, para quem preferiu só ver a resposta). */
  const checked = practiceState.checked;
  document.getElementById('practiceInputRow').hidden = practiceState.revealed || !!c.isReg;
  document.getElementById('practiceActionsReveal').hidden = practiceState.revealed;
  document.getElementById('practiceActionsScore').hidden = !(practiceState.revealed && !checked);
  document.getElementById('practiceActionsNext').hidden = !(practiceState.revealed && checked);

  const vd = document.getElementById('practiceVerdict');
  vd.hidden = !checked;
  if(checked){
    vd.className = 'practice-verdict ' + (checked === 'ok' ? 'ok' : (checked === 'almost' ? 'almost' : 'no'));
    if(checked === 'ok'){
      vd.innerHTML = '✅ Certo!';
    } else if(checked === 'almost'){
      vd.innerHTML = '🟡 Quase — diferença mínima, provavelmente digitação.<span class="yours">você escreveu: ' + escapeHTML(practiceState.typed) + '</span>' +
        '<button class="practice-accept" id="practiceAcceptHit">contar como acerto</button> · <button class="practice-accept" id="practiceAcceptMiss">contar como erro</button>';
    } else {
      vd.innerHTML = '❌ Não foi dessa vez.<span class="yours">' + (c.isReg ? 'você escolheu: ' : 'você escreveu: ') + escapeHTML(practiceState.typed) + '</span>';
    }
  }

  const respondidos = practiceState.hits + practiceState.misses;
  const bar = document.getElementById('practiceBar');
  bar.hidden = !respondidos;
  if(respondidos){
    const pct = Math.round(practiceState.hits / respondidos * 100);
    bar.firstElementChild.style.width = pct + '%';
    const fila = practiceState.missQueue.length ? ` · ${practiceState.missQueue.length} p/ revisar` : '';
    document.getElementById('practiceScore').textContent = `${practiceState.hits}/${respondidos} corretas (${pct}%)${fila}`;
  } else {
    document.getElementById('practiceScore').textContent = practiceState.seen ? 'Responda para começar o placar.' : '';
  }
  const acceptHit = document.getElementById('practiceAcceptHit');
  if(acceptHit) acceptHit.onclick = ()=>{ practiceState.hits++; practiceState.checked='ok'; renderPractice(); saveState(); };
  const acceptMiss = document.getElementById('practiceAcceptMiss');
  if(acceptMiss) acceptMiss.onclick = ()=>{
    practiceState.misses++; practiceState.checked='no';
    if(practiceState.challenge && practiceState.missQueue.length < 12) practiceState.missQueue.push(practiceState.challenge);
    renderPractice(); saveState();
  };
  const a2 = document.getElementById('practiceAudio2');
  if(a2 && practiceState.challenge) a2.dataset.text = stripMarks(practiceState.challenge.raw);

  applyA11y();
  const reset = document.getElementById('practiceReset');
  reset.hidden = !respondidos;
  reset.onclick = ()=>{
    practiceState.hits = 0; practiceState.misses = 0; practiceState.seen = 0; practiceState.missQueue = [];
    nextChallenge(); saveState();
  };
}
function nextChallenge(){
  practiceState.checked = null; practiceState.typed = '';
  const inp = document.getElementById('practiceInput');
  if(inp) inp.value = '';
  /* o que o usuário errou volta a aparecer (1 em cada 3 sorteios), em vez de sumir para sempre */
  if(practiceState.missQueue.length && Math.random() < 0.34){
    practiceState.challenge = practiceState.missQueue.shift();
  } else {
    practiceState.challenge = newChallenge();
  }
  practiceState.revealed = false;
  practiceState.seen++;
  renderPractice();
  saveState();
}
document.getElementById('practiceReveal').onclick = ()=>{ practiceState.revealed = true; renderPractice(); };
document.getElementById('practiceNext').onclick = nextChallenge;
document.getElementById('practiceCheck').onclick = checkAnswer;
document.getElementById('practiceContinue').onclick = nextChallenge;
document.getElementById('practiceInput').addEventListener('keydown', e=>{ if(e.key === 'Enter') checkAnswer(); });
document.getElementById('practiceHit').onclick = ()=>{ practiceState.hits++; nextChallenge(); saveState(); };
document.getElementById('practiceMiss').onclick = ()=>{
  practiceState.misses++;
  if(practiceState.challenge && practiceState.missQueue.length < 12) practiceState.missQueue.push(practiceState.challenge);
  nextChallenge(); saveState();
};

