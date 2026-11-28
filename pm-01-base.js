
/* Velocidade da fala: 4 degraus; "1×" é o ritmo anterior do app (0.92). Persistida. */
const SPEEDS = [ {l:'0.6×', r:0.55}, {l:'0.8×', r:0.75}, {l:'1×', r:0.92}, {l:'1.2×', r:1.1} ];
let speedIdx = 2;
function toggleSpeed(){
  speedIdx = (speedIdx + 1) % SPEEDS.length;
  const b = document.getElementById('speedToggle');
  if(b){ b.textContent = SPEEDS[speedIdx].l; b.title = 'Velocidade do áudio: ' + SPEEDS[speedIdx].l; }
  /* prévia curta para o ouvido calibrar a nova velocidade */
  speak(speedIdx === 0 ? 'Slow and clear.' : (speedIdx === 3 ? 'A bit faster now.' : 'This is the speed.'));
  saveState();
}
/* ================= v154: ÁUDIO ROBUSTO + MODO TV =================
   ÁUDIO: muitas TVs Android (e navegadores baseados em WebView) não têm a API de voz do navegador ou não têm voz
   instalada — o app ficava mudo sem avisar. Agora: escolhe a voz explicitamente, vigia se a fala começou e, se o
   aparelho não fala, AVISA e oferece um áudio online opcional (o texto da frase é enviado ao serviço de voz do
   Google Tradutor; só liga se o usuário aceitar, e a escolha fica salva). */
const TTS_ONLINE_KEY = 'pm_tts_online';
let ttsNativoOk = null, ttsFalhas = 0, ttsVigia = null, ttsUltimo = null, ttsAudio = null, ttsAvisoVisto = false;
function ttsOnlineLigado(){ try { return localStorage.getItem(TTS_ONLINE_KEY) === '1'; } catch(e){ return false; } }
function ttsTemNativo(){ return ('speechSynthesis' in window) && typeof SpeechSynthesisUtterance !== 'undefined'; }
function ttsVoz(L){
  let vs = []; try { vs = window.speechSynthesis.getVoices() || []; } catch(e){}
  const n = x => String(x.lang || '').replace('_', '-').toLowerCase(), l = L.toLowerCase();
  return vs.find(x => n(x) === l) || vs.find(x => n(x).slice(0, 2) === l.slice(0, 2)) || null;
}
function speak(text, lang, rate){
  if(!text) return;
  const L = lang || ENG_LANG[ENG], R = rate || SPEEDS[speedIdx].r;   /* 'rate' opcional (botão 🐢 do painel de pronúncia) */
  ttsUltimo = { text, L, R };
  if(ttsAudio){ try { ttsAudio.pause(); } catch(e){} ttsAudio = null; }
  if(!ttsTemNativo() || ttsNativoOk === false){ ttsSemVoz(); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = L; u.rate = R;
  const v = ttsVoz(L); if(v) u.voice = v;                            /* alguns Android só falam com a voz definida */
  let comecou = false;
  u.onstart = () => { comecou = true; ttsNativoOk = true; ttsFalhas = 0; };
  u.onerror = e => { if(e && (e.error === 'interrupted' || e.error === 'canceled')) return; ttsContaFalha(); };
  try { window.speechSynthesis.cancel(); window.speechSynthesis.resume(); window.speechSynthesis.speak(u); } catch(e){ ttsContaFalha(); return; }
  /* vigia: se em 2,5 s nada começou, não há fila e o aparelho não lista nenhuma voz, a fala nativa não existe aqui */
  clearTimeout(ttsVigia);
  ttsVigia = setTimeout(() => {
    let sem = true; try { sem = !window.speechSynthesis.speaking && !window.speechSynthesis.pending && !(window.speechSynthesis.getVoices() || []).length; } catch(e){}
    if(!comecou && sem && ttsNativoOk !== true) ttsContaFalha();
  }, 2500);
}
function ttsContaFalha(){
  if(ttsNativoOk === true) return;
  if(++ttsFalhas >= 2){ ttsNativoOk = false; ttsSemVoz(); }
}
function ttsSemVoz(){
  if(ttsOnlineLigado()){ if(ttsUltimo) ttsOnline(ttsUltimo.text, ttsUltimo.L, ttsUltimo.R); return; }
  ttsAviso('sem');
}
/* áudio online: frases longas vão em pedaços de até ~180 caracteres, tocados em sequência */
function ttsOnline(text, L, R){
  const partes = []; let resto = String(text).trim();
  while(resto.length > 180){ let c = resto.lastIndexOf(' ', 180); if(c < 60) c = 180; partes.push(resto.slice(0, c)); resto = resto.slice(c).trim(); }
  if(resto) partes.push(resto);
  let i = 0;
  const toca = () => {
    if(i >= partes.length){ ttsAudio = null; return; }
    const a = new Audio('https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + encodeURIComponent(L) + '&q=' + encodeURIComponent(partes[i++]));
    try { a.playbackRate = Math.max(0.5, Math.min(1.5, R / 0.92)); } catch(e){}
    a.onended = toca; a.onerror = () => { ttsAudio = null; ttsAviso('online'); };
    ttsAudio = a; const p = a.play(); if(p && p.catch) p.catch(() => { ttsAudio = null; ttsAviso('online'); });
  };
  toca();
}
function ttsAviso(tipo){
  if(tipo === 'sem' && ttsAvisoVisto) return;
  let el = document.getElementById('ttsAviso');
  if(!el){ el = document.createElement('div'); el.id = 'ttsAviso'; el.setAttribute('role', 'alert'); document.body.appendChild(el); }
  if(tipo === 'sem'){
    el.innerHTML = '<b>🔇 Este aparelho não tem voz de leitura.</b> É comum em TVs e em navegadores sem o mecanismo de voz. ' +
      'Duas saídas: instalar "Serviços de Fala do Google" (Speech Services by Google) na loja de apps do aparelho, ou ligar o áudio online — o texto da frase é enviado ao serviço de voz do Google Tradutor e precisa de internet.' +
      '<div class="tts-bts"><button type="button" id="ttsLigar">Ligar áudio online</button><button type="button" id="ttsFechar">Agora não</button></div>';
  } else {
    el.innerHTML = '<b>🔇 O áudio online não respondeu.</b> Verifique a internet; o serviço também pode estar indisponível neste aparelho.' +
      '<div class="tts-bts"><button type="button" id="ttsDesligar">Desligar áudio online</button><button type="button" id="ttsFechar">Fechar</button></div>';
  }
  el.hidden = false;
  const b = el.querySelector('button'); if(b && tvModo) b.focus();
}
document.addEventListener('click', e => {
  const t = e.target; if(!t || !t.id) return;
  const el = document.getElementById('ttsAviso'); if(!el) return;
  if(t.id === 'ttsLigar'){ try { localStorage.setItem(TTS_ONLINE_KEY, '1'); } catch(x){} el.hidden = true; if(ttsUltimo) ttsOnline(ttsUltimo.text, ttsUltimo.L, ttsUltimo.R); }
  else if(t.id === 'ttsDesligar'){ try { localStorage.removeItem(TTS_ONLINE_KEY); } catch(x){} el.hidden = true; }
  else if(t.id === 'ttsFechar'){ el.hidden = true; ttsAvisoVisto = true; }
});
if(ttsTemNativo()){ try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => {}; } catch(e){} }   /* dispara o carregamento das vozes */

/* ---- MODO TV: tela grande vista de longe e controle remoto (setas + OK) ----
   1) Escala: a página é desenhada com 960 px de largura (o "canvas" clássico de TV) e ampliada até encher a tela —
      pela meta viewport onde ela é respeitada (Android) ou por zoom onde não é. Assim um chip de 13 px fica com
      ~1,3 cm numa TV de 42".
   2) Foco: tudo o que é clicável vira focalizável; as setas levam o foco ao vizinho mais próximo naquela direção;
      OK/Enter aciona. Como os dials são redesenhados a cada escolha, o foco é devolvido ao mesmo lugar.
   3) Layout: frase fixa à esquerda, controles à direita; barra do topo numa linha só. */
const TV_KEY = 'pm_tv', TV_LARGURA = 960;
let tvModo = false, tvTeclado = false, tvUltimo = null;
function tvDetecta(){
  let s = null; try { s = localStorage.getItem(TV_KEY); } catch(e){}
  if(s === '1') return true; if(s === '0') return false;
  const ua = navigator.userAgent || '';
  if(/Android TV|GoogleTV|Google TV|SMART-TV|SmartTV|BRAVIA|AFT[A-Z]|; TV\b|Tizen|Web0S|WebOS|CrKey|MiTV|MIBOX|SHIELD Android TV|Philips|HbbTV/i.test(ua)) return true;
  /* Android sem toque e com tela larga: quase sempre TV ou TV box */
  return /Android/i.test(ua) && (navigator.maxTouchPoints || 0) === 0 && Math.max(screen.width || 0, window.innerWidth) >= 900;
}
function tvAplica(){
  const html = document.documentElement, meta = document.querySelector('meta[name="viewport"]'), bt = document.getElementById('tvToggle');
  if(bt){ bt.dataset.on = String(tvModo); bt.title = tvModo ? 'Modo TV ligado (toque para voltar ao normal)' : 'Modo TV: tela grande e controle remoto'; }
  if(!tvModo){
    delete html.dataset.tv; html.style.zoom = ''; html.style.removeProperty('--tv-vh');
    if(meta) meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover');
    if(typeof updateNavHeight === 'function') updateNavHeight();
    return;
  }
  html.dataset.tv = 'true';
  if(meta) meta.setAttribute('content', 'width=' + TV_LARGURA);
  /* a meta foi respeitada? se a largura não virou ~960, cai no zoom */
  const ajusta = () => {
    if(!tvModo) return;
    html.style.zoom = '';
    const w = window.innerWidth, z = Math.abs(w - TV_LARGURA) <= 40 ? 1 : Math.max(1, Math.min(3, w / TV_LARGURA));
    html.style.zoom = z === 1 ? '' : String(z);
    html.style.setProperty('--tv-vh', (window.innerHeight / z) + 'px');
    if(typeof updateNavHeight === 'function') updateNavHeight();
  };
  requestAnimationFrame(() => requestAnimationFrame(ajusta));
  window.removeEventListener('resize', tvAplica._r || (() => {})); tvAplica._r = () => { clearTimeout(tvAplica._t); tvAplica._t = setTimeout(ajusta, 150); }; window.addEventListener('resize', tvAplica._r);
}
function toggleTV(){ tvModo = !tvModo; try { localStorage.setItem(TV_KEY, tvModo ? '1' : '0'); } catch(e){} tvAplica(); }
/* torna focalizável o que é clicável mas não é botão (os chips são <div> com onclick) */
function tvFocalizaveis(raizes){
  const marca = el => {
    if(el.dataset.tvk || !/^(DIV|SPAN|LI|TD|SUMMARY)$/.test(el.tagName)) return;
    if(el.onclick || el.hasAttribute('onclick')){ el.dataset.tvk = '1'; if(!el.hasAttribute('tabindex')) el.tabIndex = 0; if(!el.hasAttribute('role') && el.tagName !== 'SUMMARY') el.setAttribute('role', 'button'); }
  };
  /* só o que acabou de entrar na página é examinado (a varredura completa acontece uma vez, na abertura) */
  (raizes || [document.body]).forEach(r => { if(!r.isConnected) return; marca(r); r.querySelectorAll('div,span,li,td,summary').forEach(marca); });
}
const TV_SEL = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';
function tvVisiveis(raiz){
  return [...(raiz || document).querySelectorAll(TV_SEL)].filter(el => { if(el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; });
}
function tvDescreve(el){
  let raiz = el.parentElement; while(raiz && !raiz.id) raiz = raiz.parentElement;
  if(!raiz) return null;
  return { raiz: raiz.id, i: tvVisiveis(raiz).indexOf(el), txt: (el.textContent || '').trim().slice(0, 40) };
}
function tvRestaura(){
  if(!tvUltimo || !(tvModo || tvTeclado)) return;
  const a = document.activeElement; if(a && a !== document.body && a.isConnected) return;
  const raiz = document.getElementById(tvUltimo.raiz); if(!raiz) return;
  const l = tvVisiveis(raiz); if(!l.length) return;
  const el = l.find((x, i) => i === tvUltimo.i && (x.textContent || '').trim().slice(0, 40) === tvUltimo.txt) || l.find(x => (x.textContent || '').trim().slice(0, 40) === tvUltimo.txt) || l[Math.min(Math.max(tvUltimo.i, 0), l.length - 1)];
  if(el) try { el.focus({ preventScroll:true }); } catch(e){}
}
/* navegação espacial: o candidato mais próximo na direção da seta (quem está alinhado com o atual ganha) */
function tvMove(dir){
  const atual = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
  const todos = tvVisiveis();
  if(!atual){ const vh = window.innerHeight, p = todos.find(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= vh; }) || todos[0]; if(p) p.focus(); return !!p; }
  const c = atual.getBoundingClientRect(), cx = c.left + c.width / 2, cy = c.top + c.height / 2;
  let melhor = null, nota = Infinity;
  todos.forEach(el => {
    if(el === atual) return;
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    let prim, orto;
    /* v156: "mesma linha/coluna" só conta com sobreposição real (30% do menor) — encostar a borda não basta */
    const ovV = Math.min(r.bottom, c.bottom) - Math.max(r.top, c.top) > Math.min(r.height, c.height) * 0.3;
    const ovH = Math.min(r.right, c.right) - Math.max(r.left, c.left) > Math.min(r.width, c.width) * 0.3;
    if(dir === 'right'){ if(r.left < c.right - 2 && x <= cx + 2) return; prim = Math.max(0, r.left - c.right); orto = ovV ? 0 : Math.abs(y - cy); if(x <= cx) return; }
    else if(dir === 'left'){ if(x >= cx) return; prim = Math.max(0, c.left - r.right); orto = ovV ? 0 : Math.abs(y - cy); }
    else if(dir === 'down'){ if(y <= cy || r.top < c.bottom - 2) return; prim = Math.max(0, r.top - c.bottom); orto = ovH ? 0 : Math.abs(x - cx); }
    else { if(y >= cy || r.bottom > c.top + 2) return; prim = Math.max(0, c.top - r.bottom); orto = ovH ? 0 : Math.abs(x - cx); }
    const n = prim + orto * ((dir === 'left' || dir === 'right') ? 4 : 2) + (orto ? 30 : 0);
    if(n < nota){ nota = n; melhor = el; }
  });
  if(!melhor) return false;
  melhor.focus({ preventScroll:true });
  try { melhor.scrollIntoView({ block:'nearest', inline:'nearest' }); } catch(e){}
  return true;
}
document.addEventListener('pointerdown', () => { tvTeclado = false; }, true);
document.addEventListener('focusin', e => { if(e.target && e.target !== document.body){ const d = tvDescreve(e.target); if(d) tvUltimo = d; } });
document.addEventListener('keydown', e => {
  const k = e.key, t = e.target, tag = t && t.tagName;
  if(k === 'Tab' || k.indexOf('Arrow') === 0 || k === 'Enter') tvTeclado = true;
  /* OK/Enter ou espaço num chip (div com role=button) = clique */
  if((k === 'Enter' || k === ' ') && t && t.dataset && t.dataset.tvk && tag !== 'SUMMARY'){ e.preventDefault(); t.click(); return; }
  if(!tvModo) return;
  if(k === 'Escape' || k === 'GoBack' || k === 'BrowserBack' || (k === 'Backspace' && tag !== 'INPUT' && tag !== 'TEXTAREA')){
    const ps = document.getElementById('pronSheet'), av = document.getElementById('ttsAviso'), rm = document.getElementById('refMenu');
    if(av && !av.hidden){ av.hidden = true; e.preventDefault(); }
    else if(ps && !ps.hidden){ pronFechar(); e.preventDefault(); }
    else if(rm && !rm.hidden){ rm.hidden = true; e.preventDefault(); }
    return;
  }
  const dir = { ArrowRight:'right', ArrowLeft:'left', ArrowDown:'down', ArrowUp:'up' }[k]; if(!dir) return;
  if(tag === 'SELECT') return;
  if(tag === 'INPUT' || tag === 'TEXTAREA'){
    /* dentro de um campo de texto, ← → movem o cursor; ↑ ↓ saem do campo */
    if(dir === 'left' || dir === 'right') return;
  }
  if(tvMove(dir)) e.preventDefault();
});
/* depois de cada redesenho: novos chips viram focalizáveis e o foco perdido volta ao lugar */
{ let t = null, novos = new Set();
  const obs = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => { if(n.nodeType === 1) novos.add(n); }));
    clearTimeout(t); t = setTimeout(() => { const l = [...novos]; novos = new Set(); tvFocalizaveis(l); tvRestaura(); }, 60);
  });
  window.addEventListener('load', () => { tvFocalizaveis(); obs.observe(document.body, { childList:true, subtree:true }); tvModo = tvDetecta(); tvAplica(); }); }
document.addEventListener('click', function(e){
  const btn = e.target.closest('.audio-btn');
  if(btn && btn.dataset.text) speak(btn.dataset.text, btn.dataset.lang || ENG_LANG[ENG]);
});
/* ---- v124: TOQUE PARA OUVIR ----
   (1) Nas frases dos motores, tocar numa palavra fala só aquela palavra. Não mexe no HTML da frase (as peças coloridas
       continuam abrindo o significado): a palavra é achada pela posição do toque e destacada por um instante.
   (2) Nas listas de vocabulário (expressões por tempo, nomes de conjunção, exemplos, linhas da tabela), tocar no item fala o item. */
const FALA_FRASES = '#sentence, #modalSentence, .mont-frase, .par-en, .gr-en, .par-item .anat-frase, #practiceEN';
const FALA_ITENS = '.ref-tag, .gr-cj, .conj-card .ex:not(.no), .orac-conj-c, .ct-conj, table.matrix .cell-lines div';
function palavraNoPonto(x, y){
  let node = null, off = 0;
  if(document.caretRangeFromPoint){ const r = document.caretRangeFromPoint(x, y); if(r){ node = r.startContainer; off = r.startOffset; } }
  else if(document.caretPositionFromPoint){ const c = document.caretPositionFromPoint(x, y); if(c){ node = c.offsetNode; off = c.offset; } }
  if(!node || node.nodeType !== 3) return null;
  const t = node.nodeValue, eh = ch => /[A-Za-z'’-]/.test(ch || '');
  let a = Math.min(off, t.length), b = a;
  if(!eh(t[a]) && eh(t[a - 1])) a--;                       /* toque no fim da palavra */
  if(!eh(t[a])) return null;
  while(a > 0 && eh(t[a - 1])) a--;
  b = a; while(b < t.length && eh(t[b])) b++;
  const w = t.slice(a, b).replace(/^['’-]+|['’-]+$/g, '');
  return w && /[A-Za-z]/.test(w) ? { node, a, b, w } : null;
}
function piscaPalavra(p){
  try {
    const r = document.createRange(); r.setStart(p.node, p.a); r.setEnd(p.node, p.b);
    const sp = document.createElement('span'); sp.className = 'w-on'; r.surroundContents(sp);
    setTimeout(() => { if(sp.parentNode){ const pai = sp.parentNode; sp.replaceWith(document.createTextNode(sp.textContent)); pai.normalize(); } }, 650);
  } catch(err){ /* destaque é só cosmético: se o DOM mudou no meio, segue sem ele */ }
}
document.addEventListener('click', function(e){
  if(!e.target.closest || e.target.closest('.audio-btn, button, input, a')) return;
  const fr = e.target.closest(FALA_FRASES);
  if(fr){
    if(fr.closest('.anat-card[data-ex], .anat-card[data-at], .anat-card[data-comb]')) return;          /* cards que carregam o montador: o toque é deles */
    const p = palavraNoPonto(e.clientX, e.clientY);
    if(p && fr.contains(p.node)){ speak(p.w); piscaPalavra(p); pronAbrir([p.w]); }
    return;
  }
  const it = e.target.closest(FALA_ITENS);
  if(it){
    const c = it.cloneNode(true); c.querySelectorAll('i, small, button').forEach(x => x.remove());      /* tira a nota em português da etiqueta */
    const txt = c.textContent.replace(/[✓✗]/g, '').replace(/\s*…\s*/g, ', ').replace(/\s*·\s*/g, '. ').replace(/^[\s:,.]+/, '').trim();
    if(txt && /[A-Za-z]/.test(txt)){ speak(txt); it.classList.add('say-on'); setTimeout(() => it.classList.remove('say-on'), 600); pronAbrir((txt.match(/[A-Za-z][A-Za-z'’-]*/g) || []).filter((w, i, a) => a.indexOf(w) === i)); }
  }
});
/* ---- v144: PRONÚNCIA POR TOQUE ----
   Ao tocar numa palavra (além do áudio), abre um painel com o IPA e dicas de como pronunciar com naturalidade:
   letras mudas, -ed/-s, sílaba tônica, sons que o brasileiro costuma errar (th, r, æ, ɪ, t sopradas, consoante final).
   IPA: ipa.js (CMU Pronouncing Dictionary, só as palavras do app; carregado sob demanda e guardado pelo service worker).
   As dicas são DERIVADAS do par grafia + IPA por regras; palavras de pronúncia traiçoeira têm dica própria (PRON_DICA). */
let pronCarga = 'nao';                                  /* nao | carregando | pronto | ausente */
function pronCarregar(cb){
  /* dois dicionários: ipa.js (americano) e ipa-uk.js (britânico). Cada um é opcional: se faltar, o painel mostra o que houver. */
  if(pronCarga === 'pronto'){ if(cb) cb(); return; }
  if(pronCarga === 'carregando'){ if(cb) setTimeout(() => pronCarregar(cb), 150); return; }
  pronCarga = 'carregando';
  let falta = 2;
  const fim = () => { if(--falta === 0){ pronCarga = 'pronto'; if(cb) cb(); if(typeof edRender === 'function') edRender(); if(typeof fonRender === 'function') fonRender(); } };
  ['ipa.js', 'ipa-uk.js'].forEach(src => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = fim; s.onerror = fim;
    document.head.appendChild(s);
  });
}
/* pré-carrega em segundo plano logo depois da abertura (o service worker guarda os arquivos) */
window.addEventListener('load', () => setTimeout(() => pronCarregar(), 2500));
/* dicas próprias (palavras em que a grafia engana). A chave é a palavra em minúsculas. */
const PRON_DICA = {
  comfortable:'Na fala natural são 3 sílabas: KUMF-ter-bul. O "or" do meio some.',
  wednesday:'O primeiro "d" é mudo: WENZ-dei.',
  february:'Costuma-se dizer FEB-yu-eri; o primeiro "r" some na fala rápida.',
  business:'BIZ-nis: o "i" do meio não é pronunciado (2 sílabas).',
  different:'Na fala natural: DIF-rent (2 sílabas); o "e" do meio some.',
  interesting:'Na fala natural: IN-tres-ting (3 sílabas); o "e" é engolido.',
  vegetable:'VEJ-ta-bul (3 sílabas); o "e" do meio não soa.',
  every:'EV-ri (2 sílabas), não "e-ve-ri".',
  family:'Na fala natural: FAM-li (2 sílabas).',
  chocolate:'Na fala natural: CHOK-let (2 sílabas).',
  camera:'KAM-ra (2 sílabas); o "e" não soa.',
  restaurant:'RES-tront ou RES-ter-ant: o "au" não soa como "ó".',
  often:'OF-en; o "t" pode soar ou não, as duas formas são corretas.',
  choir:'KUAI-er: "ch" soa como K.',
  colonel:'Pronuncia-se KER-nel: a grafia nada tem a ver com o som.',
  queue:'Só o Q soa: "kiu". As letras seguintes são apenas o "u" longo.',
  island:'AI-lend: o "s" é mudo.',
  sure:'"su" soa como SH: "shur".', sugar:'"su" soa como SH: SHU-ger.',
  schedule:'EUA: SKÉ-jul · UK: SHÉ-diul.',
  through:'"ough" aqui soa como "u" longo: thru.', though:'"ough" soa como "ou": dhou.', although:'"ough" soa como "ou": ol-DHOU.',
  thought:'"ough" soa como "ó": thót. O "gh" é mudo.', tough:'"ough" soa como "af": taf.', enough:'"ough" soa como "af": i-NAF.',
  cough:'"ough" soa como "óf": kóf.', thorough:'THÂ-rou (EUA); o "ough" final soa como "ou".', bough:'"ough" soa como "au": bau.',
  read:'Mesma grafia, dois sons: "rid" (presente) e "red" (passado e particípio).',
  lead:'"lid" = liderar; "led" = o metal chumbo. O passado de lead é "led".',
  live:'Verbo: "liv" (viver). Adjetivo/advérbio: "laiv" (ao vivo).',
  wind:'Substantivo: "uind" (vento). Verbo: "uaind" (enrolar).',
  tear:'"tir" = lágrima; "ter" = rasgar.', wound:'"uund" = ferida; "uaund" = enrolou (passado de wind).',
  bow:'"bou" = arco/laço; "bau" = reverência.', close:'Verbo: "clouz" (fechar). Adjetivo: "clous" (próximo).',
  use:'Verbo: "iuz"; substantivo: "ius" (o final sonoro/surdo muda a classe).',
  recipe:'RÉ-si-pi: o "e" final soa, ao contrário da regra comum.',
  length:'Soa o "g": lêng-th, e o "th" fica no fim.',
  library:'LAI-brér-i: o primeiro "r" não some (não é "laibéri").',
  draw:'Em "drawer" (gaveta), a pronúncia é "dror" (1 sílaba).',
  clothes:'Muitos falantes dizem "clouz", sem o "th".',
  iron:'AI-ern: o "r" vem antes do "o".',
  salmon:'SA-men: o "l" é mudo.', almond:'Ó-mend (EUA) / A-mend: o "l" é mudo.',
  hour:'O "h" é mudo: "auer".', honest:'O "h" é mudo: "ó-nist".', honor:'O "h" é mudo: "ó-ner".', heir:'O "h" é mudo: "er".',
  vehicle:'VI-i-kul: o "h" é mudo.',
  usually:'IU-jua-li: o "s" soa como "j" de "janela".',
  sandwich:'SÃN-uich ou SÃM-uich: o "d" some e o "w" quase não soa.',
  clothing:'CLOU-dhing.',
  determine:'di-TÂR-min: a sílaba tônica é a segunda.',
  entrepreneur:'on-tre-pre-NER: de origem francesa; tônica no final.',
  focus:'FOU-cus: o "o" vira ditongo "ou".',
  specific:'spi-SI-fic: a tônica está na segunda sílaba.',
  development:'di-VÉ-lop-ment: o "e" inicial é fraco e o "p" é leve.',
  process:'EUA: PRÓ-sess. O "o" é aberto, sem ditongo.',
  analysis:'a-NÁ-li-sis: tônica na segunda sílaba.',
  analyze:'Á-na-laiz: tônica na primeira sílaba.',
  data:'DEI-ta (mais comum) ou DA-ta.',
  pronunciation:'pro-NAN-si-EI-shen: não há "o" (de "pronounce") na raiz.',
  pronounce:'pro-NAUNS: tônica na segunda sílaba.',
  wednesdays:'O primeiro "d" é mudo: WENZ-deiz.'
};
/* mapeamento ARPAbet já vem pronto em ipa.js; abaixo, só utilidades de leitura do IPA */
const PRON_VOGAL = /aɪ|aʊ|eɪ|oʊ|əʊ|ɔɪ|ɪə|eə|ʊə|[ɑæʌɔɛɝɪiʊuəɚɐɒɜ]/g;
const PRON_SEM_MARCA = s => s.replace(/[ˈˌ]/g, '');
/* IPA de uma palavra em UMA variante ('us' | 'uk'): verbo curado do app → dicionário da variante → composição por sufixo (≈)
   → (só UK) conversão aproximada do americano (~). Devolve { ipa, estimado, aprox } ou null. */
function pronIpa(w, vr){
  vr = vr || ENG;
  const k = w.toLowerCase().replace(/’/g, "'");
  const db = vr === 'uk' ? (typeof IPA_UK !== 'undefined' ? IPA_UK : null) : (typeof IPA_DB !== 'undefined' ? IPA_DB : null);
  /* IPA curado dos verbos do app (inclui US~UK) */
  const ve = (typeof VERB_EXTRA !== 'undefined') ? VERB_EXTRA[k] : null;
  if(ve && ve.ipa){
    const partes = ve.ipa.split(',')[0].trim().split('~');
    if(vr === 'us') return { ipa: partes[0].replace(/ː/g, ''), estimado: false, aprox: false };
    if(partes[1]) return { ipa: partes[1], estimado: false, aprox: false };
  }
  if(db && db[k]) return { ipa: db[k], estimado: false, aprox: false };
  if(db){
    /* composição: base + sufixo regular */
    const tenta = (base, suf) => {
      if(!base || base.length < 2 || !db[base]) return null;
      const b = db[base], f = (typeof ipaFlexao === 'function') ? ipaFlexao(b) : { ed:'d', s:'z' };
      return suf === 's' ? b + f.s : suf === 'ed' ? b + f.ed : suf === 'ing' ? b + 'ɪŋ' : suf === 'ly' ? b + 'li' : suf === 'er' ? b + (vr === 'uk' ? 'ɐ' : 'ɚ') : suf === 'est' ? b + 'ɪst' : null;
    };
    const dup = b => b.length > 2 && b[b.length - 1] === b[b.length - 2] ? b.slice(0, -1) : null;
    const cand = [];
    if(/ies$/.test(k)) cand.push([k.slice(0, -3) + 'y', 's']);
    if(/es$/.test(k)) cand.push([k.slice(0, -2), 's']);
    if(/s$/.test(k)) cand.push([k.slice(0, -1), 's']);
    if(/ied$/.test(k)) cand.push([k.slice(0, -3) + 'y', 'ed']);
    if(/ed$/.test(k)){ cand.push([k.slice(0, -2), 'ed'], [k.slice(0, -1), 'ed']); const d1 = dup(k.slice(0, -2)); if(d1) cand.push([d1, 'ed']); }
    if(/ing$/.test(k)){ cand.push([k.slice(0, -3), 'ing'], [k.slice(0, -3) + 'e', 'ing']); const d2 = dup(k.slice(0, -3)); if(d2) cand.push([d2, 'ing']); }
    if(/ly$/.test(k)) cand.push([k.slice(0, -2), 'ly']);
    if(/er$/.test(k)) cand.push([k.slice(0, -2), 'er'], [k.slice(0, -1), 'er']);
    if(/est$/.test(k)) cand.push([k.slice(0, -3), 'est'], [k.slice(0, -2), 'est']);
    for(const [b, s] of cand){ const r = tenta(b, s); if(r) return { ipa: r, estimado: true, aprox: false }; }
  }
  /* UK sem dado próprio: converte o IPA americano (aproximação) */
  if(vr === 'uk'){
    const us = pronIpa(w, 'us');
    if(us && typeof ipaUK === 'function') return { ipa: ipaUK(us.ipa), estimado: us.estimado, aprox: true };
  }
  return null;
}
/* classifica a palavra como forma regular -ed / -s (sem ser outra palavra comum) */
function pronBaseDe(k, db){
  if(!db) return null;
  const dup = b => b.length > 2 && b[b.length - 1] === b[b.length - 2] ? b.slice(0, -1) : null;
  if(/ied$/.test(k) && db[k.slice(0, -3) + 'y']) return { tipo:'ed', base:k.slice(0, -3) + 'y' };
  if(/ed$/.test(k) && k.length > 3){ for(const b of [k.slice(0, -2), k.slice(0, -1), dup(k.slice(0, -2))]) if(b && b.length > 2 && db[b]) return { tipo:'ed', base:b }; }
  if(/ies$/.test(k) && db[k.slice(0, -3) + 'y']) return { tipo:'s', base:k.slice(0, -3) + 'y' };
  if(/es$/.test(k) && k.length > 4 && db[k.slice(0, -2)]) return { tipo:'s', base:k.slice(0, -2) };
  if(/s$/.test(k) && !/ss$/.test(k) && k.length > 3 && db[k.slice(0, -1)]) return { tipo:'s', base:k.slice(0, -1) };
  return null;
}
/* dicas derivadas da grafia + IPA (máx. ~5, mais úteis primeiro) */
function pronDicas(w, ipa, vr){
  vr = vr || ENG;
  const k = w.toLowerCase().replace(/’/g, "'").replace(/[^a-z']/g, ''), sem = PRON_SEM_MARCA(ipa), out = [];
  const db = (typeof IPA_DB !== 'undefined') ? IPA_DB : null;
  if(PRON_DICA[k]) out.push(PRON_DICA[k]);
  /* letras mudas — comparação grafia × IPA */
  const mudas = [];
  if(/^kn/.test(k) && !/k/.test(sem)) mudas.push('o K de "kn-" não soa (começa direto no N)');
  if(/^wr/.test(k) && !/w/.test(sem)) mudas.push('o W de "wr-" não soa (começa direto no R)');
  if(/^gn/.test(k)) mudas.push('o G de "gn-" não soa');
  if(/^ps/.test(k) && !/p/.test(sem)) mudas.push('o P de "ps-" não soa');
  if(/^pn/.test(k)) mudas.push('o P de "pn-" não soa');
  if(/^wh[o]/.test(k)) mudas.push('o W de "who-" não soa (soa como H)');
  if(/mb$/.test(k) && !/b/.test(sem)) mudas.push('o B final depois de M não soa');
  if(/mn$/.test(k)) mudas.push('o N final depois de M não soa');
  if(/st(le|en|mas)$|ften$/.test(k) && !PRON_DICA[k] && !/t(əl|ən|m)/.test(sem)) mudas.push('o T de "' + k.match(/st(le|en|mas)$|ften$/)[0] + '" não soa');
  if(/igh|ight/.test(k) && !/ɡ|f/.test(sem)) mudas.push('o "gh" não soa; só o ditongo "ai" aparece');
  else if(/[a-z]gh/.test(k) && !/ɡ|f/.test(sem) && !/ough/.test(k)) mudas.push('o "gh" não soa');
  if(/sign|reign|foreign|campaign|design|resign|assign|align/.test(k) && !/ɡ/.test(sem)) mudas.push('o G antes de N não soa');
  if(/bt/.test(k) && !/b/.test(sem)) mudas.push('o B de "bt" não soa');
  if(/^h(our|onest|onor|eir)/.test(k)) mudas.push('o H inicial não soa');
  if(/receipt|cupboard|raspberry/.test(k)) mudas.push('o P não soa');
  if(/l/.test(k) && !/l/.test(sem)) mudas.push('o L não soa nesta palavra (como em talk, walk, could)');
  if(!mudas.length || !PRON_DICA[k]) mudas.slice(0, 2).forEach(m => out.push('Letra muda: ' + m + '.'));
  /* -e final mudo */
  if(/[^aeiou]e$/.test(k) && k.length > 3 && !/le$/.test(k) && /[^aeiouəɚiɪʊ]$/.test(sem))
    out.push('O "e" final é mudo (muitas vezes só indica que a vogal anterior é longa ou ditongo).');
  /* -ed e -s regulares */
  const b = pronBaseDe(k, db);
  if(b && b.tipo === 'ed' && !PRON_DICA[k]){
    if(/ɪd$/.test(sem)) out.push('-ed soa como uma sílaba extra "id", porque o verbo termina em T ou D.');
    else if(/t$/.test(sem)) out.push('-ed soa só como um "t" curto, sem sílaba extra.');
    else if(/d$/.test(sem)) out.push('-ed soa só como um "d" curto, sem sílaba extra.');
  }
  if(b && b.tipo === 's' && !PRON_DICA[k]){
    if(/ɪz$/.test(sem)) out.push('-s/-es vira uma sílaba extra "iz", porque a palavra termina em som de chiado.');
    else if(/z$/.test(sem)) out.push('-s soa como "z" (depois de som sonoro).');
    else if(/s$/.test(sem)) out.push('-s soa como "s" (depois de som surdo).');
  }
  /* sílaba tônica */
  const nVog = (sem.match(PRON_VOGAL) || []).length;
  if(nVog >= 2 && /ˈ/.test(ipa)){
    const antes = (ipa.slice(0, ipa.indexOf('ˈ')).replace(/ˌ/g, '').match(PRON_VOGAL) || []).length;
    out.push('Sílaba tônica: a ' + (antes + 1) + 'ª de ' + nVog + ' (marcada por ˈ). Faça-a mais forte e mais longa; as outras ficam curtas.');
  }
  if(/[əɚɐ]/.test(sem) && nVog >= 2 && !PRON_DICA[k]) out.push('ə/ɚ/ɐ é a vogal fraca ("uh"): nas sílabas sem força, a vogal se reduz e quase some.');
  /* sons difíceis para o falante de português */
  if(/θ/.test(sem)) out.push('θ (th surdo): ponta da língua entre os dentes, só soprando — não é "f", "s" nem "t".');
  if(/ð/.test(sem)) out.push('ð (th sonoro): mesma posição do th, mas com a voz ligada — não é "d" nem "z".');
  if(vr === 'us' && /[ɝɚ]|r/.test(sem)) out.push('r americano: língua recuada, sem tocar o céu da boca e sem vibrar — nada do "rr" do português.');
  if(vr === 'uk' && /r/.test(k)){
    if(/r/.test(sem)) out.push('r britânico: só aparece antes de vogal; a língua não toca o céu da boca e não vibra.');
    else out.push('Sotaque britânico (RP): o "r" escrito não soa no fim da palavra nem antes de consoante; ele só alonga ou colore a vogal.');
  }
  if(vr === 'uk' && /ɒ/.test(sem)) out.push('ɒ: "ó" curto, com a boca arredondada (hot, not) — o inglês americano usa "a" aberto aqui.');
  if(vr === 'uk' && /ɜː/.test(sem)) out.push('ɜː: vogal longa e central, sem "r" (como um "é" abafado esticado).');
  if(vr === 'uk' && /ɑː/.test(sem)) out.push('ɑː: "a" longo e aberto, bem no fundo da boca (bath, calm).');
  if(/æ/.test(sem)) out.push('æ: boca bem aberta, entre "a" e "é" (como em cat) — não é "é" puro.');
  const mono = sem.replace(/aɪ|aʊ|eɪ|oʊ|əʊ|ɔɪ|ɪə|eə|ʊə/g, '');          /* só vogais simples (ditongos já saíram) */
  if(/ɪ/.test(mono) && !/ɪŋ|ɪd$|ɪz$/.test(mono)) out.push('ɪ: "i" curto e relaxado, mais perto do "e" fechado (ship ≠ sheep).');
  if(/ʊ/.test(mono)) out.push('ʊ: "u" curto e relaxado, sem arredondar muito os lábios (book, could).');
  if(/ŋ$/.test(sem) || /ŋ/.test(sem)) out.push('ŋ: som nasal no fundo da boca; não soa um "g" depois dele.');
  if(/ʒ|dʒ|tʃ|ʃ/.test(sem) && out.length < 6) out.push('ʃ/ʒ/tʃ/dʒ: lábios levemente projetados; "ch" inglês é tʃ (como "tch"), "j" é dʒ.');
  if(/ɪŋ$/.test(sem)) out.push('-ing: "i" curto + ŋ; não pronuncie "ín-gui".');
  if(/(^|ˈ)[ptk](?=[a-zɑæʌɔɛɝɪiʊuəɚ])/.test(ipa) && out.length < 7) out.push('p/t/k no início da sílaba tônica saem com um sopro de ar (aspirados).');
  if(/[ɑæʌɔɛɝɪiʊuəɚɐɒ]t(?=[əɚɐiɪ])/.test(ipa.replace(/ˈt/g, '')) && vr === 'us') out.push('EUA: o "t" entre vogais (depois da tônica) soa como um "d" rápido (water ≈ "uóder").');
  if(/[bdɡptk]$/.test(sem) && !(b && b.tipo === 'ed') && out.length < 7) out.push('Termine seco em "' + sem.slice(-1) + '": sem soltar um "i" ou "e" depois do som final (comum em quem fala português).');
  if(/l$/.test(sem) && out.length < 7) out.push('l final é "escuro", próximo de um "u" (como em "mal" do português).');
  return out.slice(0, 6);
}
/* painel: mostra US e UK lado a lado; as dicas seguem a variante ativa (botão US/UK do topo) */
let pronEl = null, pronUlt = [];
function pronGarantePainel(){
  if(pronEl) return pronEl;
  pronEl = document.createElement('div');
  pronEl.id = 'pronSheet'; pronEl.setAttribute('role', 'dialog'); pronEl.setAttribute('aria-label', 'Pronúncia');
  pronEl.hidden = true;
  pronEl.addEventListener('click', e => {
    if(e.target.closest('.pron-x')){ pronFechar(); return; }
    const a = e.target.closest('[data-pron-fala]');
    if(a) speak(a.dataset.pronFala, a.dataset.pronLang || undefined, a.dataset.pronLento ? 0.45 : undefined);
  });
  document.body.appendChild(pronEl);
  return pronEl;
}
function pronFechar(){ if(pronEl) pronEl.hidden = true; }
document.addEventListener('keydown', e => { if(e.key === 'Escape') pronFechar(); });
function pronEsc(s){ return String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c])); }
/* uma linha de IPA de uma variante, com seu botão de áudio */
function pronLinhaVar(w, vr){
  const r = pronIpa(w, vr), lang = ENG_LANG[vr], at = vr === ENG;
  const marca = r ? (r.aprox ? '<small title="Sem dado britânico para esta palavra: convertido do americano"> ~</small>' : (r.estimado ? '<small title="Montado a partir da palavra-base"> ≈</small>' : '')) : '';
  return '<span class="pron-var' + (at ? ' pron-at' : '') + '"><em>' + vr.toUpperCase() + '</em>' +
    (r ? '<span class="pron-ipa">/' + pronEsc(r.ipa) + '/' + marca + '</span>' : '<span class="pron-ipa pron-sem">sem IPA</span>') +
    '<button type="button" class="pron-ou" data-pron-fala="' + pronEsc(w) + '" data-pron-lang="' + lang + '" aria-label="Ouvir em ' + vr.toUpperCase() + '">🔊</button></span>';
}
/* abre o painel para uma ou mais palavras */
function pronAbrir(palavras){
  pronUlt = palavras;
  pronCarregar(() => {
    const el = pronGarantePainel(), uma = palavras.length === 1;
    const linhas = palavras.slice(0, 8).map(w => {
      const r = pronIpa(w, ENG), dicas = r ? pronDicas(w, r.ipa, ENG) : [];
      const cab = '<div class="pron-cab"><b class="pron-w">' + pronEsc(w) + '</b>' + pronLinhaVar(w, 'us') + pronLinhaVar(w, 'uk') +
        '<button type="button" class="pron-ou" data-pron-fala="' + pronEsc(w) + '" data-pron-lang="' + ENG_LANG[ENG] + '" data-pron-lento="1" aria-label="Ouvir devagar" title="Devagar">🐢</button></div>';
      const lista = (uma ? dicas : dicas.slice(0, 2)).map(d => '<li>' + pronEsc(d) + '</li>').join('');
      return '<div class="pron-it">' + cab + (lista ? '<ul class="pron-dicas">' + lista + '</ul>' : (r ? '' : '<p class="pron-nota">Esta palavra não está no dicionário de pronúncia do app; use o áudio.</p>')) + '</div>';
    }).join('');
    el.innerHTML = '<div class="pron-topo"><span>Pronúncia</span><button type="button" class="pron-x" aria-label="Fechar">×</button></div>' + linhas +
      '<div class="pron-rodape">Dicas conforme a variante ativa (' + ENG.toUpperCase() + '). US: CMU · UK: ipa-dict (RP). ~ = convertido do americano; ≈ = montado da palavra-base.</div>';
    el.hidden = false;
  });
}
/* ---- v145: PRONÚNCIA DO -ED ----
   Regra: o som do -ed depende do ÚLTIMO SOM do verbo (não da letra):
   surdo (p k f s ʃ tʃ θ) → /t/ · sonoro (demais consoantes e vogais) → /d/ · t ou d → /ɪd/ (sílaba extra).
   A lista é calculada dos verbos regulares do app + IPA (US e UK); nada aqui é digitado verbo a verbo. */
const ED_SURDOS = ['p', 'k', 'f', 's', 'ʃ', 'tʃ', 'θ'];
const ED_EXEMPLOS = { t:['work', 'stop', 'help', 'watch', 'wash', 'laugh'], d:['play', 'move', 'call', 'clean', 'live', 'judge'], id:['want', 'need', 'decide', 'start', 'visit', 'wait'] };
const ED_ARMADILHAS = ['laugh', 'watch', 'dance', 'judge', 'use', 'miss', 'push', 'save'];
const ED_EXCECOES = ['naked', 'wicked', 'crooked', 'rugged', 'ragged', 'wretched', 'beloved', 'learned', 'aged', 'blessed'];
let edFiltro = 'todos', edBusca = '', edLimite = 30, edQuiz = { ok:0, n:0, v:null, resp:'' };
let _edIdx = null, _edIdxVar = '';
function edUltimoSom(ipa){ const s = ipa.replace(/[ˈˌː]/g, ''), m = s.match(/(tʃ|dʒ)$/); return m ? m[1] : s.slice(-1); }
function edClasseDe(ipaPassado){
  /* ɪd/əd final = sílaba extra (mas "eɪd/aɪd/ɔɪd" são ditongos + d, não sílaba extra) */
  const x = ipaPassado.replace(/[ˈˌː]/g, '').replace(/[aeɔ]ɪ/g, 'X');
  return /[ɪəɐ]d$/.test(x) ? 'id' : (/t$/.test(x) ? 't' : 'd');
}
/* índice dos verbos regulares com passado em -ed (variante ativa) */
function edIndice(){
  if(_edIdx && _edIdxVar === ENG + pronCarga) return _edIdx;
  _edIdx = [];
  VERBS.forEach(v => {
    if(v.phrasal || !/regular/.test(v.label || '')) return;
    const f = ENG === 'uk' ? v.uk : v.us, past = (f && f.past) || v.past;
    if(!past || !/ed$/.test(past) || past !== (f && f.pp || v.pp)) return;
    const bu = pronIpa(v.base, 'us'), pu = pronIpa(past, 'us');
    if(!bu || !pu) return;
    const pk = pronIpa(past, 'uk');
    _edIdx.push({ v, base:v.base, past, bipa:bu.ipa, us:pu.ipa, uk:pk ? pk.ipa : '', cls:edClasseDe(pu.ipa) });
  });
  _edIdxVar = ENG + pronCarga;
  return _edIdx;
}
const ED_NOME = { t:'/t/', d:'/d/', id:'/ɪd/' };
function edExplica(x){
  const u = edUltimoSom(x.bipa), mudaUltima = u.length ? '/' + u + '/' : '';
  if(x.cls === 'id') return x.base + ' termina em ' + mudaUltima + ': o -ed precisa de uma sílaba extra (/ɪd/) para separar sons parecidos.';
  if(x.cls === 't') return x.base + ' termina no som ' + mudaUltima + ' (surdo, sem vibrar a garganta) → o -ed vira /t/.';
  return x.base + ' termina em ' + (/^[aeiouɑæʌɔɛɝɪʊəɚɐɒɜ]/.test(u) || /[aeiouɑæʌɔɛɝɪʊəɚɐɒɜ]$/.test(u) ? 'vogal' : 'som ' + mudaUltima) + ' (sonoro, a garganta vibra) → o -ed vira /d/.';
}
function edLinhaIpa(x){ return '<span class="ed-ipa"><em>US</em> /' + pronEsc(x.us) + '/ <em>UK</em> /' + pronEsc(x.uk || '—') + '/</span>'; }
function edLinha(x){
  return '<div class="ed-row"><div class="ed-l1"><b>' + pronEsc(x.base) + '</b> <span class="ed-seta">→</span> <b class="ed-past">' + pronEsc(x.past) + '</b>' +
    '<span class="ed-tag ed-' + x.cls + '">' + ED_NOME[x.cls] + '</span>' +
    '<button type="button" class="audio-btn sm" data-text="' + pronEsc(x.past) + '" data-lang="en-US" aria-label="Ouvir em US" title="US">🔊</button>' +
    '<button type="button" class="audio-btn sm ed-uk" data-text="' + pronEsc(x.past) + '" data-lang="en-GB" aria-label="Ouvir em UK" title="UK">UK</button></div>' + edLinhaIpa(x) + '</div>';
}
function edRenderLista(){
  const box = document.getElementById('edLista'); if(!box) return;
  const q = edBusca.trim().toLowerCase();
  const tudo = edIndice().filter(x => (edFiltro === 'todos' || x.cls === edFiltro) && (!q || x.base.includes(q) || x.past.includes(q)));
  const ver = tudo.slice(0, edLimite);
  box.innerHTML = ver.map(edLinha).join('') || '<p class="ed-nota">Nenhum verbo encontrado.</p>';
  const mais = document.getElementById('edMais');
  if(mais){ mais.hidden = tudo.length <= edLimite; mais.textContent = '+ ' + Math.min(30, tudo.length - edLimite) + ' verbos (' + (tudo.length - edLimite) + ' restantes)'; }
  const n = document.getElementById('edContagem'); if(n) n.textContent = tudo.length + ' verbos';
}
function edNovoQuiz(){
  const lista = edIndice(); if(!lista.length) return;
  let x; do { x = lista[Math.floor(Math.random() * lista.length)]; } while(lista.length > 1 && edQuiz.v && x === edQuiz.v);
  edQuiz.v = x; edQuiz.resp = '';
  edRenderQuiz();
}
function edRenderQuiz(){
  const box = document.getElementById('edQuiz'); if(!box) return;
  const x = edQuiz.v;
  if(!x){ box.innerHTML = '<p class="ed-nota">Carregando os dicionários de pronúncia…</p>'; return; }
  const resp = edQuiz.resp, acertou = resp === x.cls;
  box.innerHTML = '<div class="ed-q-palavra"><b>' + pronEsc(x.past) + '</b>' +
    '<button type="button" class="audio-btn" data-text="' + pronEsc(x.past) + '" data-lang="' + ENG_LANG[ENG] + '" aria-label="Ouvir">🔊</button></div>' +
    '<div class="ed-q-opc">' + ['t', 'd', 'id'].map(c => '<button type="button" class="ed-q-btn' + (resp ? (c === x.cls ? ' ok' : (c === resp ? ' erro' : '')) : '') + '" data-ed-resp="' + c + '"' + (resp ? ' disabled' : '') + '>' + ED_NOME[c] + '</button>').join('') + '</div>' +
    (resp ? '<div class="ed-q-res ' + (acertou ? 'ok' : 'erro') + '">' + (acertou ? 'Certo. ' : 'Não: é ' + ED_NOME[x.cls] + '. ') + pronEsc(edExplica(x)) + edLinhaIpa(x) + '<button type="button" class="ed-prox" data-ed-prox="1">Próxima →</button></div>' : '<p class="ed-nota">Qual é o som final de <b>' + pronEsc(x.past) + '</b>? Pense no último som de <b>' + pronEsc(x.base) + '</b>.</p>') +
    '<div class="ed-placar">Acertos: ' + edQuiz.ok + ' / ' + edQuiz.n + '</div>';
}
function edRender(){
  const el = document.getElementById('edBloco'); if(!el) return;
  if(pronCarga === 'nao'){ pronCarregar(); }
  const idx = edIndice();
  const ex = c => ED_EXEMPLOS[c].map(id => idx.find(x => x.base === id)).filter(Boolean).slice(0, 5)
    .map(x => '<li><b>' + pronEsc(x.past) + '</b> <span class="ed-ipa">/' + pronEsc(ENG === 'uk' && x.uk ? x.uk : x.us) + '/</span><button type="button" class="audio-btn sm" data-text="' + pronEsc(x.past) + '" data-lang="' + ENG_LANG[ENG] + '" aria-label="Ouvir">🔊</button></li>').join('');
  const arm = ED_ARMADILHAS.map(id => idx.find(x => x.base === id)).filter(Boolean)
    .map(x => '<li><b>' + pronEsc(x.past) + '</b> <span class="ed-tag ed-' + x.cls + '">' + ED_NOME[x.cls] + '</span> ' + pronEsc(edExplica(x)) + '</li>').join('');
  const exc = ED_EXCECOES.map(w => '<button type="button" class="ed-exc audio-btn-txt" data-text="' + w + '" data-lang="' + ENG_LANG[ENG] + '">' + w + ' 🔊</button>').join('');
  el.innerHTML =
    '<p class="ed-nota"><b>Regra de ouro:</b> o som do -ed depende do <b>último SOM</b> do verbo, não da letra final. Coloque a mão na garganta: se vibra, é sonoro; se não vibra, é surdo.</p>' +
    '<div class="ed-cards">' +
      '<div class="ed-card ed-t"><h4>/t/</h4><p>Depois de som <b>surdo</b>: /p k f s ʃ tʃ θ/.</p><ul>' + ex('t') + '</ul></div>' +
      '<div class="ed-card ed-d"><h4>/d/</h4><p>Depois de som <b>sonoro</b>: vogais e consoantes como /b ɡ v z ʒ dʒ ð m n ŋ l r/.</p><ul>' + ex('d') + '</ul></div>' +
      '<div class="ed-card ed-id"><h4>/ɪd/</h4><p>Depois de <b>/t/ ou /d/</b>: ganha uma sílaba extra.</p><ul>' + ex('id') + '</ul></div>' +
    '</div>' +
    '<div class="ed-sub">Armadilhas: a letra engana</div><ul class="ed-arm">' + (arm || '<li class="ed-nota">Carregando…</li>') + '</ul>' +
    '<div class="ed-sub">Exceções: adjetivos com sílaba extra</div><p class="ed-nota">Como adjetivos, estas palavras mantêm a sílaba extra /ɪd/, mesmo sem t/d no fim da base.</p><div class="ed-excs">' + exc + '</div>' +
    '<div class="ed-sub">Treino: qual é o som?</div><div id="edQuiz" class="ed-quiz"></div>' +
    '<div class="ed-sub">Todos os verbos regulares do app <span class="ed-n" id="edContagem"></span></div>' +
    '<div class="ed-filtros">' + [['todos', 'Todos'], ['t', '/t/'], ['d', '/d/'], ['id', '/ɪd/']].map(f => '<button type="button" class="ed-chip' + (edFiltro === f[0] ? ' on' : '') + '" data-ed-filtro="' + f[0] + '">' + f[1] + '</button>').join('') + '</div>' +
    '<input type="search" id="edBusca" class="ed-busca" placeholder="buscar verbo…" value="' + pronEsc(edBusca) + '" autocomplete="off">' +
    '<div id="edLista" class="ed-lista"></div><button type="button" class="ed-chip ed-mais" id="edMais" data-ed-mais="1" hidden></button>';
  edRenderLista();
  if(!edQuiz.v && idx.length) edNovoQuiz(); else edRenderQuiz();
}
document.addEventListener('click', e => {
  const t = e.target; if(!t.closest || !t.closest('#edBloco')) return;
  const f = t.closest('[data-ed-filtro]');
  if(f){ edFiltro = f.dataset.edFiltro; edLimite = 30; document.querySelectorAll('#edBloco .ed-chip[data-ed-filtro]').forEach(b => b.classList.toggle('on', b.dataset.edFiltro === edFiltro)); edRenderLista(); return; }
  if(t.closest('[data-ed-mais]')){ edLimite += 30; edRenderLista(); return; }
  const r = t.closest('[data-ed-resp]');
  if(r && !edQuiz.resp){ edQuiz.resp = r.dataset.edResp; edQuiz.n++; if(edQuiz.resp === edQuiz.v.cls) edQuiz.ok++; edRenderQuiz(); speak(edQuiz.v.past); return; }
  if(t.closest('[data-ed-prox]')){ edNovoQuiz(); return; }
  const ex = t.closest('.ed-exc'); if(ex) speak(ex.dataset.text, ex.dataset.lang);
});
document.addEventListener('input', e => { if(e.target && e.target.id === 'edBusca'){ edBusca = e.target.value; edLimite = 30; edRenderLista(); } });
/* ---- v146: REGRAS FONÉTICAS ----
   Seção de regras de grafia → som, com dados reais: cada regra é TESTADA contra o vocabulário inglês do app
   (palavras do app + ~9 mil palavras mais comuns do inglês, com IPA) e mostra quantas palavras a seguem, quais são as exceções e o IPA US/UK.
   Abas: -s/-es · som final · e mudo · C e G · -tion · letras mudas · TH · OUGH · ea/oo/ou/ow. */
let _fonV = null;
function fonVocab(){
  if(_fonV && _fonV.n === pronCarga) return _fonV.l;
  const S = new Set(), V = new Set(), add = (t, ehVerbo) => { (String(t || '').toLowerCase().match(/[a-z][a-z'-]*/g) || []).forEach(w => { S.add(w); if(ehVerbo) V.add(w); }); };
  VERBS.forEach(v => { ['base', 's3', 'ing', 'past', 'pp'].forEach(k => add(v[k], true)); (v.col || []).forEach(c => add(c.en)); });
  if(typeof VERB_EXTRA !== 'undefined') Object.values(VERB_EXTRA).forEach(x => { (x.syn || []).forEach(t => add(t)); (x.ant || []).forEach(t => add(t)); (x.pat || []).forEach(p => add(p.w)); (x.adv || []).forEach(a => add(a.w)); });
  if(typeof IPA_COMUM !== 'undefined') IPA_COMUM.forEach(w => S.add(w));   /* v147: + ~9 mil palavras mais comuns do inglês */
  const l = [];
  S.forEach(w => { if(w.length < 3 || /[-']/.test(w)) return; const r = pronIpa(w, 'us'); if(r && !r.estimado) l.push({ w, ipa:r.ipa, verbo:V.has(w) }); });
  _fonV = { n:pronCarga, l };
  return l;
}
const FON_VOGAL = /aɪ|aʊ|eɪ|oʊ|ɔɪ|[ɑæʌɔɛɝɪiʊuəɚ]/;
const fonSem = i => i.replace(/[ˈˌː]/g, '');
const fonNucleo = i => { const m = fonSem(i).match(FON_VOGAL); return m ? m[0] : ''; };
/* escolhe exemplos variados: verbos do app primeiro, palavras curtas antes */
function fonPick(arr, n){
  return arr.slice().sort((a, b) => (b.verbo - a.verbo) || (a.w.length - b.w.length) || (a.w < b.w ? -1 : 1)).slice(0, n);
}
function fonRow(x){
  const u = pronIpa(x.w, 'us'), k = pronIpa(x.w, 'uk');
  return '<li class="fon-w"><b>' + pronEsc(x.w) + '</b><span class="ed-ipa"><em>US</em> /' + pronEsc(u ? u.ipa : '—') + '/ <em>UK</em> /' + pronEsc(k ? k.ipa : '—') + '/</span>' +
    '<button type="button" class="audio-btn sm" data-text="' + pronEsc(x.w) + '" data-lang="en-US" aria-label="Ouvir em US">🔊</button>' +
    '<button type="button" class="audio-btn sm ed-uk" data-text="' + pronEsc(x.w) + '" data-lang="en-GB" aria-label="Ouvir em UK">UK</button></li>';
}
/* ---------- regras testáveis (pega = quais palavras a regra cobre; ok = se o som confere) ---------- */
const FON_C = 'bcdfghjklmnpqrstvwxz';
const FON_GRUPOS = {
  e:[ { t:'E final mudo', txt:'O -e no fim da palavra quase nunca soa. Ele é um sinal: a vogal anterior fica longa ou vira ditongo (mat → mate, rid → ride) e a palavra termina em consoante.',
        pega:w => new RegExp('[' + FON_C + ']e$').test(w) && w.length > 3 && !/le$/.test(w), ok:(w, i) => /[ɚɝ]$|[^aeiouɑæʌɔɛɪʊəɐɒɜ]$/.test(fonSem(i)) } ],
  cg:[ { t:'C antes de e, i, y = /s/', txt:'Antes de e, i ou y o C soa /s/ (city, face, cycle). Em "ci" antes de vogal pode virar /ʃ/ (special).',
         pega:w => /(^|[^c])c[eiy]/.test(w), ok:(w, i) => /[sʃ]/.test(i) },
       { t:'C nos demais casos = /k/', txt:'Antes de a, o, u ou consoante o C soa /k/ (can, cost, cut, class).',
         pega:w => /c(?![eiyhk])/.test(w) && !/cc/.test(w), ok:(w, i) => /k/.test(i) },
       { t:'G antes de e, i, y = /dʒ/ (só tendência)', txt:'Antes de e, i, y o G costuma soar /dʒ/ (age, giant, gym), mas há muitas exceções (get, give, begin, girl). Trate como tendência, não como regra.',
         pega:w => /g[eiy]/.test(w) && !/gg/.test(w), ok:(w, i) => /dʒ/.test(i) },
       { t:'G nos demais casos = /ɡ/', txt:'Antes de a, o, u ou consoante o G soa /ɡ/ (game, go, gun, green).',
         pega:w => /(^|[^n])g(?![eiyhn])/.test(w) && !/gg/.test(w), ok:(w, i) => /ɡ/.test(i) } ],
  tion:[ { t:'-tion / -sion / -cian = /ʃən/', txt:'Estas terminações soam /ʃən/ (action, station) — ou /ʒən/ depois de vogal em -sion (decision). A sílaba anterior é a tônica.',
           pega:w => /(tion|sion|cian)s?$/.test(w), ok:(w, i) => /[ʃʒ](ə?n)[sz]?$|tʃən$/.test(fonSem(i)) } ],
  mudas:[ { t:'kn- : o K é mudo', txt:'Começa direto no N (know, knee, knife).', pega:w => /^kn/.test(w), ok:(w, i) => /^n/.test(fonSem(i)) },
          { t:'wr- : o W é mudo', txt:'Começa direto no R (write, wrong, wrap).', pega:w => /^wr/.test(w), ok:(w, i) => /^r/.test(fonSem(i)) },
          { t:'gn- / -gn : o G é mudo', txt:'O G antes do N não soa (sign, design, foreign).', pega:w => /^gn|[^n]gn(ed|s|ing)?$/.test(w), ok:(w, i) => !/ɡ/.test(i) },
          { t:'-mb : o B final é mudo', txt:'Depois de M, o B final não soa (climb, comb, thumb).', pega:w => /mb(s|ed|ing)?$/.test(w), ok:(w, i) => !/b/.test(i) },
          { t:'-lk e -alm : o L é mudo', txt:'Em talk, walk, chalk, calm, palm o L não soa — mas milk e help mantêm o L.', pega:w => /(alk|olk|alm)s?$/.test(w), ok:(w, i) => !/l/.test(i) },
          { t:'-ght : GH é mudo', txt:'O "gh" some e a vogal alonga (night, light, thought).', pega:w => /ght/.test(w), ok:(w, i) => !/ɡ/.test(i) } ]
};
function fonTesta(r){
  const v = fonVocab(), ok = [], falha = [];
  v.forEach(x => { if(r.pega(x.w)) (r.ok(x.w, x.ipa) ? ok : falha).push(x); });
  return { ok, falha };
}
function fonRenderRegra(r){
  const t = fonTesta(r), n = t.ok.length + t.falha.length, pct = n ? Math.round(100 * t.ok.length / n) : 0;
  return '<div class="fon-regra"><h4>' + pronEsc(r.t) + '</h4><p>' + pronEsc(r.txt) + '</p>' +
    '<div class="fon-stat"><span class="fon-barra"><i style="width:' + pct + '%"></i></span> vale em <b>' + t.ok.length + ' de ' + n + '</b> palavras do app (' + pct + '%)</div>' +
    '<ul class="fon-lista">' + fonPick(t.ok, 4).map(fonRow).join('') + '</ul>' +
    (t.falha.length ? '<div class="fon-sub2">Exceções (' + t.falha.length + ')</div><ul class="fon-lista">' + fonPick(t.falha, 4).map(fonRow).join('') + '</ul>' : '') + '</div>';
}
/* ---------- TH ---------- */
function fonRenderTh(){
  const v = fonVocab().filter(x => /th/.test(x.w)), vz = v.filter(x => /ð/.test(x.ipa)), vs = v.filter(x => /θ/.test(x.ipa));
  return '<div class="fon-regra"><h4>TH: dois sons</h4><p>/θ/ (surdo, sem voz) aparece em palavras de conteúdo, no início ou no fim (think, three, month, truth). /ð/ (sonoro, com voz) aparece em palavras gramaticais (the, this, that, they, there, with) e entre vogais (mother, other, rather). Ponta da língua entre os dentes nos dois casos; só muda a voz.</p>' +
    '<div class="fon-sub2">/θ/ (' + vs.length + ' palavras)</div><ul class="fon-lista">' + fonPick(vs, 6).map(fonRow).join('') + '</ul>' +
    '<div class="fon-sub2">/ð/ (' + vz.length + ' palavras)</div><ul class="fon-lista">' + fonPick(vz, 6).map(fonRow).join('') + '</ul></div>';
}
/* ---------- grupos por som: CH e X ---------- */
function fonRenderGrupoSom(titulo, txt, pega, classe, nomes){
  const g = {}; fonVocab().filter(x => pega(x.w)).forEach(x => { const k = classe(x.ipa, x.w); if(k) (g[k] = g[k] || []).push(x); });
  const ks = Object.keys(g).sort((a, b) => g[b].length - g[a].length), tot = ks.reduce((a, k) => a + g[k].length, 0);
  return '<div class="fon-regra"><h4>' + pronEsc(titulo) + ' <span class="ed-n">(' + tot + ' palavras)</span></h4><p>' + pronEsc(txt) + '</p>' +
    ks.map(k => '<div class="fon-sub2">' + pronEsc(nomes[k] || k) + ' · ' + g[k].length + ' (' + Math.round(100 * g[k].length / tot) + '%)</div><ul class="fon-lista">' + fonPick(g[k], 4).map(fonRow).join('') + '</ul>').join('') + '</div>';
}
function fonRenderCh(){
  return fonRenderGrupoSom('CH: três sons', 'O "ch" soa /tʃ/ na maioria das palavras (church, teach). Em palavras de origem grega soa /k/ (school, chemistry, technical) e, nas de origem francesa, /ʃ/ (machine, chef, brochure). A classificação usa o IPA da palavra (aproximação).',
    w => /ch/.test(w) && !/sch|tch/.test(w), (i, w) => /tʃ/.test(i) ? 'tʃ' : (/ʃ/.test(i) ? 'ʃ' : (/k/.test(i) ? 'k' : '')), { tʃ:'/tʃ/ (church)', k:'/k/ (origem grega)', ʃ:'/ʃ/ (origem francesa)' });
}
function fonRenderX(){
  return fonRenderGrupoSom('X: ks, ɡz ou z', 'O X costuma soar /ks/ (box, fix, next). Depois de "e" átono e antes de vogal tônica soa /ɡz/ (exam, example, exist). No início da palavra soa /z/ (xylophone, xenon).',
    w => /x/.test(w), (i, w) => /^z/.test(fonSem(i)) && /^x/.test(w) ? 'z' : (/ɡz/.test(i) ? 'ɡz' : (/ks|kʃ/.test(i) ? 'ks' : '')), { ks:'/ks/ (box, next)', ɡz:'/ɡz/ (exam, exist)', z:'/z/ (início)' });
}
/* ---------- OUGH ---------- */
function fonRenderOugh(){
  const v = fonVocab().filter(x => /ough/.test(x.w)).sort((a, b) => fonSem(a.ipa).slice(-3) < fonSem(b.ipa).slice(-3) ? -1 : 1);
  return '<div class="fon-regra"><h4>OUGH: sete sons para a mesma grafia</h4><p>Não existe regra: "ough" pode ser /uː/ (through), /oʊ/ (though), /ɔ/ (thought), /ʌf/ (tough), /ɔf/ (cough), /aʊ/ (bough), /ʌ/ (thorough). Decore cada palavra com o IPA.</p>' +
    '<ul class="fon-lista">' + v.slice(0, 14).map(fonRow).join('') + '</ul></div>';
}
/* ---------- grupos vocálicos: a grafia não decide o som ---------- */
function fonRenderVog(){
  const out = ['ea', 'oo', 'ou', 'ow', 'ie', 'ai'].map(dg => {
    const re = new RegExp('^[^aeiouy]*' + dg + '[^aeiouy]*e?$'), v = fonVocab().filter(x => re.test(x.w) && x.w.length > 2), g = {};
    v.forEach(x => { const n = fonNucleo(x.ipa) || '?'; (g[n] = g[n] || []).push(x); });
    const ks = Object.keys(g).sort((a, b) => g[b].length - g[a].length).slice(0, 4);
    return '<div class="fon-regra"><h4>"' + dg + '" em palavras de uma sílaba <span class="ed-n">(' + v.length + ')</span></h4>' +
      ks.map(k => '<div class="fon-sub2">/' + pronEsc(k) + '/ · ' + g[k].length + ' (' + Math.round(100 * g[k].length / v.length) + '%)</div><ul class="fon-lista">' + fonPick(g[k], 3).map(fonRow).join('') + '</ul>').join('') + '</div>';
  }).join('');
  return '<p class="ed-nota">A mesma grafia tem vários sons, mostrados abaixo por frequência. Quando a grafia não decide, o IPA decide.</p>' + out;
}
/* ---------- som final ≠ letra final ---------- */
function fonRenderFinal(){
  const fins = [['se', 'use, close, house'], ['ce', 'dance, place'], ['ge', 'judge, change'], ['ve', 'live, move'], ['the', 'bathe, breathe'], ['x', 'fix, relax'], ['ch', 'watch, teach'], ['sh', 'wash, push'], ['ng', 'sing, bring'], ['gh', 'laugh, though'], ['que', 'unique, technique']];
  const v = fonVocab();
  const linhas = fins.map(f => {
    const l = v.filter(x => x.w.length > 3 && x.w.endsWith(f[0])), g = {};
    l.forEach(x => { const s = edUltimoSom(x.ipa) || '∅'; (g[s] = g[s] || []).push(x); });
    const ks = Object.keys(g).sort((a, b) => g[b].length - g[a].length).slice(0, 3);
    return '<div class="fon-fin"><b class="fon-fin-t">-' + f[0] + '</b>' + ks.map(k => '<span class="fon-fin-s"><span class="ed-tag ed-' + (k === 's' || k === 'ʃ' || k === 'tʃ' || k === 'f' || k === 'k' || k === 'θ' ? 't' : 'd') + '">/' + pronEsc(k) + '/</span> ' + g[k].length + ' · ' + fonPick(g[k], 3).map(x => '<i>' + pronEsc(x.w) + '</i>').join(', ') + '</span>').join('') + '</div>';
  }).join('');
  return '<div class="fon-regra"><h4>A letra final não é o som final</h4><p>Para decidir o -ed e o -s, olhe o <b>último som</b>, não a última letra. Em <b>use</b> o "se" soa /z/ (verbo); em <b>dance</b> o "ce" soa /s/; em <b>judge</b> o "ge" soa /dʒ/; em <b>laugh</b> o "gh" soa /f/. As colunas mostram quais sons cada terminação costuma ter no vocabulário do app. Por isso: use → used /d/, uses /ɪz/; dance → danced /t/, dances /ɪz/.</p>' + linhas + '</div>';
}
/* ---------- -s / -es (3ª pessoa e plural) ---------- */
const S_SIBILANTES = ['s', 'z', 'ʃ', 'ʒ', 'tʃ', 'dʒ'], S_SURDOS = ['p', 't', 'k', 'f', 'θ'];
const S_EXEMPLOS = { s:['work', 'stop', 'help', 'eat', 'laugh', 'ask'], z:['play', 'call', 'move', 'go', 'give', 'clean'], iz:['use', 'dance', 'watch', 'wash', 'judge', 'miss'] };
const S_ARMADILHAS = ['use', 'dance', 'watch', 'judge', 'wash', 'live', 'laugh', 'stop'];
const S_IRREGULARES = ['does', 'says', 'has', 'is', 'was'];
const S_NOME = { s:'/s/', z:'/z/', iz:'/ɪz/' };
let sFiltro = 'todos', sBusca = '', sLimite = 30, sQuiz = { ok:0, n:0, v:null, resp:'' }, _sIdx = null, _sIdxK = '';
function sClasseDe(ipa){
  const x = ipa.replace(/[ˈˌː]/g, '').replace(/[aeɔ]ɪ/g, 'X');
  return /[ɪəɐ]z$/.test(x) ? 'iz' : (/s$/.test(x) ? 's' : 'z');
}
function sIndice(){
  if(_sIdx && _sIdxK === ENG + pronCarga) return _sIdx;
  _sIdx = [];
  VERBS.forEach(v => {
    if(v.phrasal) return;
    const f = ENG === 'uk' ? v.uk : v.us, base = (f && f.base) || v.base, s3 = (f && f.s3) || v.s3;
    if(!s3 || !(s3 === base + 's' || s3 === base + 'es' || (/y$/.test(base) && s3 === base.slice(0, -1) + 'ies'))) return;
    const bu = pronIpa(base, 'us'), su = pronIpa(s3, 'us'); if(!bu || !su) return;
    const sk = pronIpa(s3, 'uk');
    _sIdx.push({ base, past:s3, bipa:bu.ipa, us:su.ipa, uk:sk ? sk.ipa : '', cls:sClasseDe(su.ipa) });
  });
  _sIdxK = ENG + pronCarga;
  return _sIdx;
}
function sExplica(x){
  const u = edUltimoSom(x.bipa), m = '/' + u + '/';
  if(x.cls === 'iz') return x.base + ' termina no som ' + m + ' (chiado): o -s vira uma sílaba extra /ɪz/.';
  if(x.cls === 's') return x.base + ' termina no som ' + m + ' (surdo, sem vibrar a garganta) → o -s vira /s/.';
  return x.base + ' termina em ' + (/[aeiouɑæʌɔɛɝɪʊəɚɐɒɜ]$/.test(u) ? 'vogal' : 'som ' + m) + ' (sonoro, a garganta vibra) → o -s vira /z/.';
}
function sLinha(x){
  return '<div class="ed-row"><div class="ed-l1"><b>' + pronEsc(x.base) + '</b> <span class="ed-seta">→</span> <b class="ed-past">' + pronEsc(x.past) + '</b><span class="ed-tag ed-' + (x.cls === 's' ? 't' : x.cls === 'z' ? 'd' : 'id') + '">' + S_NOME[x.cls] + '</span>' +
    '<button type="button" class="audio-btn sm" data-text="' + pronEsc(x.past) + '" data-lang="en-US" aria-label="Ouvir em US">🔊</button><button type="button" class="audio-btn sm ed-uk" data-text="' + pronEsc(x.past) + '" data-lang="en-GB" aria-label="Ouvir em UK">UK</button></div>' + edLinhaIpa(x) + '</div>';
}
function sRenderLista(){
  const box = document.getElementById('sLista'); if(!box) return;
  const q = sBusca.trim().toLowerCase();
  const tudo = sIndice().filter(x => (sFiltro === 'todos' || x.cls === sFiltro) && (!q || x.base.includes(q) || x.past.includes(q)));
  box.innerHTML = tudo.slice(0, sLimite).map(sLinha).join('') || '<p class="ed-nota">Nenhum verbo encontrado.</p>';
  const mais = document.getElementById('sMais');
  if(mais){ mais.hidden = tudo.length <= sLimite; mais.textContent = '+ ' + Math.min(30, tudo.length - sLimite) + ' verbos (' + (tudo.length - sLimite) + ' restantes)'; }
  const n = document.getElementById('sContagem'); if(n) n.textContent = tudo.length + ' verbos';
}
function sNovoQuiz(){
  const l = sIndice(); if(!l.length) return;
  let x; do { x = l[Math.floor(Math.random() * l.length)]; } while(l.length > 1 && sQuiz.v && x === sQuiz.v);
  sQuiz.v = x; sQuiz.resp = ''; sRenderQuiz();
}
function sRenderQuiz(){
  const box = document.getElementById('sQuiz'); if(!box) return;
  const x = sQuiz.v; if(!x){ box.innerHTML = '<p class="ed-nota">Carregando os dicionários de pronúncia…</p>'; return; }
  const r = sQuiz.resp;
  box.innerHTML = '<div class="ed-q-palavra"><b>' + pronEsc(x.past) + '</b><button type="button" class="audio-btn" data-text="' + pronEsc(x.past) + '" data-lang="' + ENG_LANG[ENG] + '" aria-label="Ouvir">🔊</button></div>' +
    '<div class="ed-q-opc">' + ['s', 'z', 'iz'].map(c => '<button type="button" class="ed-q-btn' + (r ? (c === x.cls ? ' ok' : (c === r ? ' erro' : '')) : '') + '" data-s-resp="' + c + '"' + (r ? ' disabled' : '') + '>' + S_NOME[c] + '</button>').join('') + '</div>' +
    (r ? '<div class="ed-q-res ' + (r === x.cls ? 'ok' : 'erro') + '">' + (r === x.cls ? 'Certo. ' : 'Não: é ' + S_NOME[x.cls] + '. ') + pronEsc(sExplica(x)) + edLinhaIpa(x) + '<button type="button" class="ed-prox" data-s-prox="1">Próxima →</button></div>' : '<p class="ed-nota">Qual é o som final de <b>' + pronEsc(x.past) + '</b>? Pense no último som de <b>' + pronEsc(x.base) + '</b>.</p>') +
    '<div class="ed-placar">Acertos: ' + sQuiz.ok + ' / ' + sQuiz.n + '</div>';
}
function fonRenderS(){
  const idx = sIndice(), ex = c => S_EXEMPLOS[c].map(id => idx.find(x => x.base === id)).filter(Boolean).slice(0, 5)
    .map(x => '<li><b>' + pronEsc(x.past) + '</b> <span class="ed-ipa">/' + pronEsc(ENG === 'uk' && x.uk ? x.uk : x.us) + '/</span><button type="button" class="audio-btn sm" data-text="' + pronEsc(x.past) + '" data-lang="' + ENG_LANG[ENG] + '" aria-label="Ouvir">🔊</button></li>').join('');
  const arm = S_ARMADILHAS.map(id => idx.find(x => x.base === id)).filter(Boolean).map(x => '<li><b>' + pronEsc(x.past) + '</b> <span class="ed-tag ed-' + (x.cls === 's' ? 't' : x.cls === 'z' ? 'd' : 'id') + '">' + S_NOME[x.cls] + '</span> ' + pronEsc(sExplica(x)) + '</li>').join('');
  const irr = S_IRREGULARES.map(w => ({ w, verbo:true })).filter(x => pronIpa(x.w, 'us')).map(fonRow).join('');
  return '<p class="ed-nota"><b>-s / -es</b> na 3ª pessoa do presente (works), no plural dos substantivos (books) e no possessivo (Tom\'s). A regra é a mesma, e também vale pelo <b>último som</b>, não pela letra.</p>' +
    '<div class="ed-cards">' +
      '<div class="ed-card ed-t"><h4>/s/</h4><p>Depois de som <b>surdo</b>: /p t k f θ/.</p><ul>' + ex('s') + '</ul></div>' +
      '<div class="ed-card ed-d"><h4>/z/</h4><p>Depois de <b>vogal</b> ou de consoante sonora: /b d ɡ v ð m n ŋ l r/.</p><ul>' + ex('z') + '</ul></div>' +
      '<div class="ed-card ed-id"><h4>/ɪz/</h4><p>Depois de <b>chiado</b>: /s z ʃ ʒ tʃ dʒ/. Ganha sílaba extra.</p><ul>' + ex('iz') + '</ul></div></div>' +
    '<div class="ed-sub">Armadilhas: a letra engana</div><ul class="ed-arm">' + (arm || '<li class="ed-nota">Carregando…</li>') + '</ul>' +
    '<div class="ed-sub">Irregulares: a vogal muda</div><p class="ed-nota">Em does e says o -s soa /z/, mas a vogal também muda; has e is seguem /z/ com vogal própria.</p><ul class="fon-lista">' + irr + '</ul>' +
    '<div class="ed-sub">Treino: qual é o som?</div><div id="sQuiz" class="ed-quiz"></div>' +
    '<div class="ed-sub">Todos os verbos do app <span class="ed-n" id="sContagem"></span></div>' +
    '<div class="ed-filtros">' + [['todos', 'Todos'], ['s', '/s/'], ['z', '/z/'], ['iz', '/ɪz/']].map(f => '<button type="button" class="ed-chip' + (sFiltro === f[0] ? ' on' : '') + '" data-s-filtro="' + f[0] + '">' + f[1] + '</button>').join('') + '</div>' +
    '<input type="search" id="sBusca" class="ed-busca" placeholder="buscar verbo…" value="' + pronEsc(sBusca) + '" autocomplete="off">' +
    '<div id="sLista" class="ed-lista"></div><button type="button" class="ed-chip ed-mais" id="sMais" data-s-mais="1" hidden></button>';
}
/* ---- v147: SUFIXOS e SÍLABA TÔNICA (mesma ideia das outras abas: regra testada contra o vocabulário do app) ---- */
function fonSil(ipa){   /* { n: nº de sílabas, ini: índice da tônica a partir do início (0-based), fim: posição a partir do fim (1 = última) } */
  const s = ipa.replace(/[ˌː]/g, ''), p = s.lastIndexOf('ˈ'),   /* últimas ˈ: o dicionário às vezes marca duas tônicas; vale a última */ n = (s.replace(/ˈ/g, '').match(new RegExp(FON_VOGAL.source, 'g')) || []).length;
  if(p < 0 || n < 2) return null;
  const antes = (s.slice(0, p).match(new RegExp(FON_VOGAL.source, 'g')) || []).length;
  return { n, ini:antes, fim:n - antes };
}
const fonOrd = k => k + 'ª';
/* regras de SOM de sufixo: pega = palavras cobertas; ok = o IPA termina/contém o som esperado */
const FON_SUF = [
  { t:'-sion depois de vogal = /ʒən/', txt:'Depois de vogal, -sion soa /ʒən/ (vision, decision, television).', pega:w => /[aeiou]sions?$/.test(w), ok:(w, i) => /ʒə?n[sz]?$/.test(fonSem(i)) },
  { t:'-rsion = /ʒən/ (americano)', txt:'Depois de R, o -sion soa /ʒən/ no inglês americano: version = "vârjân", conversion, immersion. O britânico costuma usar /ʃən/.', pega:w => /rsions?$/.test(w), ok:(w, i) => /ʒə?n[sz]?$/.test(fonSem(i)) },
  { t:'-nsion / -lsion / -ssion = /ʃən/', txt:'Depois de N, L ou S, o -sion soa /ʃən/ (tension, expulsion, mission, passion).', pega:w => /([nl]sion|ssion)s?$/.test(w), ok:(w, i) => /ʃə?n[sz]?$/.test(fonSem(i)) },
  { t:'-ism = /ɪzəm/', txt:'O -ism soa /ɪzəm/: o S vira Z e a vogal final é fraca (capitalism = "capitalizâm").', pega:w => /isms?$/.test(w) && w.length > 4, ok:(w, i) => /ɪzə?m[sz]?$/.test(fonSem(i)) },
  { t:'-ist = /ɪst/', txt:'O -ist soa /ɪst/ (artist, specialist).', pega:w => /ists?$/.test(w) && w.length > 4, ok:(w, i) => /[ɪə]sts?$/.test(fonSem(i)) },
  { t:'-ture = /tʃɚ/', txt:'O -ture soa /tʃɚ/: "tchâr" (future, picture, culture).', pega:w => /tures?$/.test(w) && w.length > 5, ok:(w, i) => /tʃɚz?$/.test(fonSem(i)) },
  { t:'-sure = /ʒɚ/ (e -sure depois de vogal)', txt:'Depois de vogal, -sure soa /ʒɚ/ (measure, pleasure, treasure).', pega:w => /[aeiou]sures?$/.test(w), ok:(w, i) => /ʒɚz?$/.test(fonSem(i)) },
  { t:'-cial / -tial = /ʃəl/', txt:'Soa /ʃəl/ (special, social, essential).', pega:w => /(ci|ti)al(ly)?$/.test(w), ok:(w, i) => /ʃə?l(i)?$/.test(fonSem(i)) },
  { t:'-cious / -tious = /ʃəs/', txt:'Soa /ʃəs/ (delicious, conscious, ambitious).', pega:w => /(ci|ti)ous(ly)?$/.test(w), ok:(w, i) => /ʃəs(li)?$/.test(fonSem(i)) },
  { t:'-ious / -eous = /iəs/', txt:'Soa /iəs/ (serious, various, curious).', pega:w => /([^ct]i|e)ous$/.test(w), ok:(w, i) => /(i|j)əs$|dʒəs$/.test(fonSem(i)) },
  { t:'-ous = /əs/', txt:'Soa /əs/, sem acento (famous, nervous, dangerous).', pega:w => /[bcdfghjklmnpqrstvwxz]ous$/.test(w) && !/(ci|ti)ous$/.test(w) && w.length > 4, ok:(w, i) => /əs$/.test(fonSem(i)) },
  { t:'-age = /ɪdʒ/', txt:'Em palavras de 2+ sílabas, -age soa /ɪdʒ/ (message, village, language). Exceções vêm do francês (garage, massage).', pega:w => /age$/.test(w) && w.length > 4, ok:(w, i) => /[ɪə]dʒ$/.test(fonSem(i)) },
  { t:'-ive = /ɪv/', txt:'Soa /ɪv/, sem acento (active, positive, creative).', pega:w => /ive$/.test(w) && w.length > 5, ok:(w, i) => /[ɪə]v$/.test(fonSem(i)) },
  { t:'-able / -ible = /əbəl/', txt:'Soa /əbəl/, sem acento (possible, available, comfortable).', pega:w => /[ai]ble$/.test(w) && w.length > 5, ok:(w, i) => /bə?l$/.test(fonSem(i)) },
  { t:'-ment = /mənt/', txt:'Soa /mənt/ (movement, agreement, environment).', pega:w => /ments?$/.test(w) && w.length > 6, ok:(w, i) => /m[əɛ]nts?$/.test(fonSem(i)) },
  { t:'-ness = /nəs/', txt:'Soa /nəs/ (happiness, business, awareness).', pega:w => /nesses?$/.test(w) || (/ness$/.test(w) && w.length > 5), ok:(w, i) => /n[əɪ]s([əɪ]z)?$/.test(fonSem(i)) },
  { t:'-less = /ləs/ · -ful = /fəl/', txt:'Sufixos fracos, sem acento (useless, careless, helpful, useful).', pega:w => (/less$/.test(w) && w.length > 5) || (/ful$/.test(w) && w.length > 5), ok:(w, i) => /l[əɪ]s$|f[əʊ]l$/.test(fonSem(i)) },
  { t:'-ity = /əti/', txt:'Soa /əti/ e puxa a tônica para a sílaba anterior (ability, quality, security). No americano, o T entre vogais soa como "d" rápido.', pega:w => /ity$/.test(w), ok:(w, i) => /[əɪ]ti$/.test(fonSem(i)) },
  { t:'-ic / -ical = /ɪk/ · /ɪkəl/', txt:'Soa /ɪk/ ou /ɪkəl/ (economic, basic, practical).', pega:w => /(ic|ical)$/.test(w) && w.length > 4, ok:(w, i) => /[ɪə]k(ə?l)?$/.test(fonSem(i)) },
  { t:'-ize / -ise = /aɪz/', txt:'Soa /aɪz/, com ditongo (organize, realize, recognise). O ditongo não leva a tônica principal em palavras longas.', pega:w => /(ize|ise)$/.test(w) && w.length > 5, ok:(w, i) => /aɪz$/.test(fonSem(i)) },
  { t:'-ify = /ɪfaɪ/', txt:'Soa /ɪfaɪ/ (identify, simplify, verify).', pega:w => /ify$/.test(w), ok:(w, i) => /[ɪə]faɪ$/.test(fonSem(i)) },
  { t:'-ology = /ɑlədʒi/', txt:'Soa /ɑlədʒi/ (technology, biology, psychology); a tônica fica no "ol".', pega:w => /ology$/.test(w), ok:(w, i) => /ɑlədʒi$/.test(fonSem(i)) },
  { t:'-tain = /tən/', txt:'Em certain e mountain soa /tən/; em contain, obtain, maintain a vogal é /eɪn/ (verbos).', pega:w => /tain$/.test(w), ok:(w, i) => /tə?n$/.test(fonSem(i)) },
  { t:'-ey final = /i/', txt:'Soa /i/ (money, journey, key).', pega:w => /ey$/.test(w) && w.length > 3, ok:(w, i) => /i$/.test(fonSem(i)) },
  { t:'-er / -or final = /ɚ/ (americano)', txt:'No americano, soa /ɚ/ (teacher, doctor, worker). No britânico, /ə/.', pega:w => /(er|or)$/.test(w) && w.length > 4, ok:(w, i) => /ɚ$/.test(fonSem(i)) },
  { t:'-ate: verbo /eɪt/, resto /ət/ (só tendência)', txt:'Verbos soam /eɪt/ (communicate, estimate); substantivos e adjetivos soam /ət/ (private, accurate). O app não separa a classe da palavra, por isso a % mistura os dois.', pega:w => /ate$/.test(w) && w.length > 5, ok:(w, i) => /eɪt$/.test(fonSem(i)) }
];
/* regras de TÔNICA: esp = posição esperada a partir do fim (1 = última, 2 = penúltima, 3 = antepenúltima) */
const FON_TON = [
  { t:'-tion / -sion / -cian: tônica na penúltima', txt:'A sílaba imediatamente antes do sufixo leva a força (inforMAtion, deCIsion, muSIcian).', pega:w => /(tion|sion|cian)s?$/.test(w), esp:2 },
  { t:'-ic: tônica na penúltima', txt:'Palavras em -ic têm a força na sílaba antes do sufixo (ecoNOMic, specIFic).', pega:w => /ic$/.test(w) && w.length > 4, esp:2 },
  { t:'-ical: tônica na antepenúltima', txt:'Em -ical a força cai uma sílaba antes de -ic (PRACtical, ecoNOMical).', pega:w => /ical$/.test(w), esp:3 },
  { t:'-ity: tônica na antepenúltima', txt:'Em -ity a força cai na sílaba antes de "i" (aBIlity, quAlity, seCUrity).', pega:w => /ity$/.test(w) && w.length > 5, esp:3 },
  { t:'-ify / -ize: tônica na antepenúltima', txt:'Em verbos -ify/-ize de 3 sílabas a força cai antes do sufixo (IDentify, ORganize), não no ditongo final. Em palavras mais longas (capitalize) aparece uma segunda força.', pega:w => /(ify|ize)$/.test(w) && w.length > 5, esp:3 },
  { t:'-logy / -graphy: tônica na antepenúltima', txt:'Em -logy e -graphy a força cai antes do sufixo (techNOlogy, geOGraphy).', pega:w => /(logy|graphy)$/.test(w), esp:3 },
  { t:'-tial / -cial: tônica na penúltima', txt:'Com som /ʃəl/, a força cai na sílaba antes do sufixo (esSENtial, SOcial, speCIal).', pega:w => /(ti|ci)al$/.test(w), esp:2 },
  { t:'-ial / -ian / -ious (com "i" soando): tônica antes do "i"', txt:'Quando o "i" soa como sílaba (iə), a força cai na sílaba antes dele (MAterial, SErious, VAriable). No IPA o "i" e a vogal seguinte contam como duas sílabas.', pega:(w, i) => /([^ct]ial|ian|ious)$/.test(w) && w.length > 5 && /iə[lns]$/.test(fonSem(i)), esp:3 },
  { t:'-ee / -eer / -ese / -ique: tônica na última', txt:'Estas terminações carregam a força elas mesmas (employEE, engiNEER, ChiNESE, techNIQUE).', pega:w => /(ee|eer|ese|ique)$/.test(w) && w.length > 4, esp:1 }
];
function fonTestaTon(r){
  const ok = [], falha = [];
  fonVocab().forEach(x => { if(!r.pega(x.w, x.ipa)) return; const s = fonSil(x.ipa); if(!s) return; x.sil = s; (s.fim === r.esp ? ok : falha).push(x); });
  return { ok, falha };
}
function fonRowT(x){
  const s = fonSil(x.ipa), base = fonRow(x);
  return s ? base.replace('</li>', '<span class="fon-tn" title="Sílaba com a força principal">tônica: ' + fonOrd(s.ini + 1) + ' de ' + s.n + '</span></li>') : base;
}
function fonRenderSufixo(r){
  const t = fonTesta(r), n = t.ok.length + t.falha.length; if(!n) return '';
  const pct = Math.round(100 * t.ok.length / n);
  return '<details class="fon-suf"><summary><b>' + pronEsc(r.t) + '</b><span class="fon-pct ' + (pct >= 90 ? 'alto' : pct >= 65 ? 'medio' : 'baixo') + '">' + pct + '%</span></summary>' +
    '<p>' + pronEsc(r.txt) + '</p><div class="fon-stat">vale em <b>' + t.ok.length + ' de ' + n + '</b> palavras do app</div>' +
    '<ul class="fon-lista">' + fonPick(t.ok, 4).map(fonRow).join('') + '</ul>' +
    (t.falha.length ? '<div class="fon-sub2">Exceções (' + t.falha.length + ')</div><ul class="fon-lista">' + fonPick(t.falha, 4).map(fonRow).join('') + '</ul>' : '') + '</details>';
}
function fonRenderSuf(){
  return '<p class="ed-nota">Sufixos têm sons fixos e quase sempre <b>sem acento</b>. Toque numa regra para ver exemplos e exceções. A % mostra quanto a regra vale no vocabulário do app: acima de 90% é regra; abaixo de 65% é só tendência.</p>' +
    FON_SUF.map(fonRenderSufixo).join('');
}
function fonRenderTonRegra(r){
  const t = fonTestaTon(r), n = t.ok.length + t.falha.length; if(!n) return '';
  const pct = Math.round(100 * t.ok.length / n);
  return '<details class="fon-suf"><summary><b>' + pronEsc(r.t) + '</b><span class="fon-pct ' + (pct >= 90 ? 'alto' : pct >= 65 ? 'medio' : 'baixo') + '">' + pct + '%</span></summary>' +
    '<p>' + pronEsc(r.txt) + '</p><div class="fon-stat">vale em <b>' + t.ok.length + ' de ' + n + '</b> palavras do app</div>' +
    '<ul class="fon-lista">' + fonPick(t.ok, 4).map(fonRowT).join('') + '</ul>' +
    (t.falha.length ? '<div class="fon-sub2">Exceções (' + t.falha.length + ')</div><ul class="fon-lista">' + fonPick(t.falha, 4).map(fonRowT).join('') + '</ul>' : '') + '</details>';
}
/* a tônica de palavras de 2, 3 e 4 sílabas no vocabulário do app (padrão geral) */
function fonRenderTonGeral(){
  const g = {};
  fonVocab().forEach(x => { const s = fonSil(x.ipa); if(!s || s.n > 4) return; const k = s.n; (g[k] = g[k] || {}); (g[k][s.fim] = g[k][s.fim] || []).push(x); });
  return [2, 3, 4].map(n => {
    const tot = Object.values(g[n] || {}).reduce((a, l) => a + l.length, 0); if(!tot) return '';
    const pos = Object.keys(g[n]).map(Number).sort((a, b) => (g[n][b].length - g[n][a].length));
    return '<div class="fon-fin"><b class="fon-fin-t">' + n + ' sílabas</b>' + pos.map(f => '<span class="fon-fin-s"><span class="ed-tag ed-id">' + (f === 1 ? 'última' : f === 2 ? 'penúltima' : f === 3 ? 'antepenúltima' : 'quarta do fim') + '</span> ' + Math.round(100 * g[n][f].length / tot) + '% · ' + fonPick(g[n][f], 3).map(x => '<i>' + pronEsc(x.w) + '</i>').join(', ') + '</span>').join('') + '</div>';
  }).join('');
}
/* pares substantivo/verbo cuja tônica muda com a classe da palavra (lista curada; o áudio usa "the X" e "to X") */
const FON_PARES = ['record', 'present', 'permit', 'produce', 'object', 'project', 'increase', 'decrease', 'import', 'export', 'contract', 'conduct', 'conflict', 'contrast', 'rebel', 'subject', 'transport', 'insult', 'progress', 'refund', 'desert'];
function fonRenderPares(){
  const bt = w => { const m = w.charAt(0).toUpperCase() + w.slice(1); return m; };
  const forma = (w, forte) => {   /* forte = índice da sílaba tônica (0 = 1ª, 1 = 2ª) → escreve a sílaba forte em maiúsculas */
    const cortes = { record:3, present:3, permit:3, produce:3, object:2, project:3, increase:2, decrease:2, import:2, export:2, contract:3, conduct:3, conflict:3, contrast:3, rebel:3, subject:3, transport:5, insult:2, progress:3, refund:2, desert:3 };
    const c = cortes[w] || Math.ceil(w.length / 2), a = w.slice(0, c), b = w.slice(c);
    return forte === 0 ? a.toUpperCase() + '-' + b : a + '-' + b.toUpperCase();
  };
  return '<div class="fon-regra"><h4>Mesma palavra, tônica diferente</h4><p>Em muitos pares de 2 sílabas, o <b>substantivo</b> tem a força na 1ª sílaba e o <b>verbo</b> na 2ª. Toque em 🔊 para ouvir cada leitura (o app lê "the …" e "to …" para orientar a voz).</p>' +
    FON_PARES.map(w => '<div class="fon-par"><b>' + pronEsc(w) + '</b>' +
      '<span class="fon-par-c"><em>subst.</em> ' + pronEsc(forma(w, 0)) + '<button type="button" class="audio-btn sm" data-text="the ' + pronEsc(w) + '" data-lang="' + ENG_LANG[ENG] + '" aria-label="Ouvir substantivo">🔊</button></span>' +
      '<span class="fon-par-c"><em>verbo</em> ' + pronEsc(forma(w, 1)) + '<button type="button" class="audio-btn sm" data-text="to ' + pronEsc(w) + '" data-lang="' + ENG_LANG[ENG] + '" aria-label="Ouvir verbo">🔊</button></span></div>').join('') + '</div>';
}
/* sufixos neutros (não mexem na tônica) e sufixos que deslocam a tônica — pares base → derivada achados no vocabulário */
function fonDerivada(d, suf){
  const L = suf.length, st = d.slice(0, -L), c = [st, st + 'e', st + 'y', st.replace(/i$/, 'y')];
  if(st.length > 2 && st[st.length - 1] === st[st.length - 2]) c.push(st.slice(0, -1));
  return c;
}
function fonPares(suf){
  const v = fonVocab(), mapa = {}; v.forEach(x => { mapa[x.w] = x; });
  const out = [];
  v.forEach(d => {
    if(!d.w.endsWith(suf) || d.w.length <= suf.length + 2) return;
    for(const b of fonDerivada(d.w, suf)){
      const x = mapa[b]; if(!x || x.w === d.w) continue;
      const sa = fonSil(x.ipa), sb = fonSil(d.ipa); if(!sa || !sb) continue;
      out.push({ b:x, d, mesma:sa.ini === sb.ini }); break;
    }
  });
  return out;
}
function fonRenderMuda(){
  const neutros = ['ing', 'ment', 'ness', 'ful', 'less', 'ly', 'er', 'able', 'ship'], desloca = ['ic', 'ical', 'ity', 'ion', 'ian', 'ial', 'ious'];
  const li = x => '<li class="fon-w"><b>' + pronEsc(x.b.w) + '</b><span class="ed-ipa">/' + pronEsc(x.b.ipa) + '/</span><span class="ed-seta">→</span><b>' + pronEsc(x.d.w) + '</b><span class="ed-ipa">/' + pronEsc(x.d.ipa) + '/</span><button type="button" class="audio-btn sm" data-text="' + pronEsc(x.d.w) + '" data-lang="en-US" aria-label="Ouvir">🔊</button></li>';
  const n = neutros.map(s => { const p = fonPares(s), ok = p.filter(x => x.mesma); if(p.length < 4) return ''; const pct = Math.round(100 * ok.length / p.length);
    return '<details class="fon-suf"><summary><b>-' + s + '</b> não muda a tônica<span class="fon-pct ' + (pct >= 90 ? 'alto' : pct >= 65 ? 'medio' : 'baixo') + '">' + pct + '%</span></summary><div class="fon-stat">a tônica ficou no mesmo lugar em <b>' + ok.length + ' de ' + p.length + '</b> pares do app</div><ul class="fon-lista">' + fonPick(ok.map(x => ({ w:x.d.w, x, verbo:x.d.verbo })), 3).map(y => li(y.x)).join('') + '</ul></details>'; }).join('');
  const d = desloca.map(s => { const p = fonPares(s), mv = p.filter(x => !x.mesma); if(p.length < 3) return ''; const pct = Math.round(100 * mv.length / p.length);
    return '<details class="fon-suf"><summary><b>-' + s + '</b> desloca a tônica<span class="fon-pct ' + (pct >= 90 ? 'alto' : pct >= 65 ? 'medio' : 'baixo') + '">' + pct + '%</span></summary><div class="fon-stat">a tônica mudou de sílaba em <b>' + mv.length + ' de ' + p.length + '</b> pares do app</div><ul class="fon-lista">' + fonPick(mv.map(x => ({ w:x.d.w, x, verbo:x.d.verbo })), 4).map(y => li(y.x)).join('') + '</ul></details>'; }).join('');
  return '<div class="fon-regra"><h4>Sufixos neutros</h4><p>Estes sufixos se juntam à palavra sem mudar a sílaba tônica (HAPpy → HAPpiness).</p></div>' + n +
    '<div class="fon-regra"><h4>Sufixos que deslocam a tônica</h4><p>Estes puxam a força para perto deles (PHOtograph → phoTOgraphy, ECOnomy → econOMic).</p></div>' + d;
}
function fonRenderTon(){
  return '<p class="ed-nota">A <b>sílaba tônica</b> é a que soa mais forte, mais longa e mais aguda. Errar a tônica atrapalha a compreensão mais do que errar uma vogal. O IPA marca a tônica com <b>ˈ</b> antes da sílaba. Toque numa regra para ver exemplos e exceções.</p>' +
    '<div class="fon-regra"><h4>Padrão geral no vocabulário do app</h4>' + fonRenderTonGeral() + '</div>' +
    FON_TON.map(fonRenderTonRegra).join('');
}
/* ---------- bloco ---------- */
const FON_ABAS = [['s', '-s / -es'], ['final', 'Som final'], ['suf', 'Sufixos'], ['ton', 'Tônica'], ['pares', 'Tônica: pares'], ['muda', 'Tônica: sufixos'], ['e', 'E mudo'], ['cg', 'C e G'], ['tion', '-tion'], ['mudas', 'Letras mudas'], ['th', 'TH'], ['ch', 'CH'], ['x', 'X'], ['ough', 'OUGH'], ['vog', 'ea · oo · ou']];
let fonAba = 's';
function fonRender(){
  const el = document.getElementById('fonBloco'); if(!el) return;
  if(pronCarga === 'nao') pronCarregar();
  let corpo;
  if(pronCarga !== 'pronto') corpo = '<p class="ed-nota">Carregando os dicionários de pronúncia…</p>';
  else if(fonAba === 's') corpo = fonRenderS();
  else if(fonAba === 'final') corpo = fonRenderFinal();
  else if(fonAba === 'suf') corpo = fonRenderSuf();
  else if(fonAba === 'ton') corpo = fonRenderTon();
  else if(fonAba === 'pares') corpo = fonRenderPares();
  else if(fonAba === 'muda') corpo = fonRenderMuda();
  else if(fonAba === 'ch') corpo = fonRenderCh();
  else if(fonAba === 'x') corpo = fonRenderX();
  else if(fonAba === 'th') corpo = fonRenderTh();
  else if(fonAba === 'ough') corpo = fonRenderOugh();
  else if(fonAba === 'vog') corpo = fonRenderVog();
  else corpo = FON_GRUPOS[fonAba].map(fonRenderRegra).join('');
  el.innerHTML = '<p class="ed-nota">Regras de grafia → som, testadas contra o vocabulário do app: cada regra mostra em quantas palavras vale e quais são as exceções. O teste confere se o som esperado aparece no IPA da palavra (aproximação, não análise sílaba a sílaba).</p>' +
    '<div class="fon-abas">' + FON_ABAS.map(a => '<button type="button" class="ed-chip' + (fonAba === a[0] ? ' on' : '') + '" data-fon-aba="' + a[0] + '">' + a[1] + '</button>').join('') + '</div>' + corpo;
  if(pronCarga === 'pronto' && fonAba === 's'){ sRenderLista(); if(!sQuiz.v && sIndice().length) sNovoQuiz(); else sRenderQuiz(); }
}
document.addEventListener('click', e => {
  const t = e.target; if(!t.closest || !t.closest('#fonBloco')) return;
  const a = t.closest('[data-fon-aba]');
  if(a){ fonAba = a.dataset.fonAba; fonRender(); return; }
  const f = t.closest('[data-s-filtro]');
  if(f){ sFiltro = f.dataset.sFiltro; sLimite = 30; document.querySelectorAll('#fonBloco .ed-chip[data-s-filtro]').forEach(b => b.classList.toggle('on', b.dataset.sFiltro === sFiltro)); sRenderLista(); return; }
  if(t.closest('[data-s-mais]')){ sLimite += 30; sRenderLista(); return; }
  const r = t.closest('[data-s-resp]');
  if(r && !sQuiz.resp){ sQuiz.resp = r.dataset.sResp; sQuiz.n++; if(sQuiz.resp === sQuiz.v.cls) sQuiz.ok++; sRenderQuiz(); speak(sQuiz.v.past); return; }
  if(t.closest('[data-s-prox]')) sNovoQuiz();
});
document.addEventListener('input', e => { if(e.target && e.target.id === 'sBusca'){ sBusca = e.target.value; sLimite = 30; sRenderLista(); } });
/* ---- Persistência local ----
   Guarda no dispositivo o que o usuário construiu ao longo do estudo: tema, configuração
   dos consoles, placar da prática e — o mais importante — a fila de erros a revisar.
   Tudo é opcional: se o armazenamento estiver indisponível (modo privado, permissão
   negada), o app funciona igual, só sem lembrar entre sessões. */
const APP_VERSION = '4.11';   /* fonte única: rodapé e diagnósticos */
const STORE_KEY = 'painel-mestre-ingles';
function storeAvailable(){
  try{ const k='__t'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; }catch(e){ return false; }
}
const CAN_STORE = storeAvailable();

/* ---- Variante do inglês: americano (US) ⇄ britânico (UK) ----
   Um único interruptor (ENG) decide a grafia dos verbos, o vocabulário das regências e os
   encaixes que só existem numa das variantes. A troca é feita NOS DADOS (cada verbo guarda
   as duas formas: v.us e v.uk; cada regência guarda c.us e c.uk), de modo que dial, busca,
   ficha, motores e prática leem o mesmo campo de sempre — nenhum gerador precisa saber da
   variante. Para o corretor da prática vale o contrário: tudo é reduzido a uma forma
   canônica, então "organise" e "organize" contam como a mesma resposta. */
let ENG = 'us';
const ENG_LANG = { us:'en-US', uk:'en-GB' };
/* Pares lexicais das regências [US, UK]. Frases inteiras vêm antes das palavras soltas. */
const VAR_PAIRS = [
  ['an apartment','a flat'], ['a movie','a film'], ['a check','a cheque'], ['the check','the cheque'],
  ['a color','a colour'], ['the colors','the colours'], ['in color','in colour'],
  ['a neighbor','a neighbour'], ['the neighbors','the neighbours'],
  ['the catalog','the catalogue'], ['cookies','biscuits'], ['soccer','football'],
  ['in line','in the queue'], ['in the fall','in autumn'], ['on weekends','at weekends'],
  ['a raise','a pay rise'], ['corn','maize'], ['the movie','the film'], ['a cookie','a biscuit'],
  ['the license','the licence'], ['the behavior','the behaviour'], ['colors','colours'], ['color','colour']
];
/* Encaixes (sinais) que só valem numa variante, e o par equivalente na outra. */
const SIGNAL_VAR  = { 'on weekends':'us', 'on the weekend':'us', 'at the store':'us', 'downtown':'us',
                      'at weekends':'uk', 'at the weekend':'uk', 'at the shops':'uk', 'in the city centre':'uk' };
const SIGNAL_SWAP = { 'on weekends':'at weekends', 'at weekends':'on weekends',
                      'on the weekend':'at the weekend', 'at the weekend':'on the weekend',
                      'at the store':'at the shops', 'at the shops':'at the store',
                      'downtown':'in the city centre', 'in the city centre':'downtown' };
function variantOk(w){ return !SIGNAL_VAR[w] || SIGNAL_VAR[w] === ENG; }
const VAR_CANON = new Map();     /* forma britânica/alternativa → forma canônica (para o corretor) */
const VAR_PHRASE_CANON = [];     /* [regex, canônico] das frases britânicas */
function _varRe(list){ return new RegExp('\\b(' + list.slice().sort((a,b)=>b.length-a.length)
  .map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|') + ')\\b','gi'); }
let _ukRe = null, _ukMap = null;
function ukText(txt){
  if(!_ukRe){ _ukMap = {}; VAR_PAIRS.forEach(p=>{ _ukMap[p[0]] = p[1]; }); _ukRe = _varRe(VAR_PAIRS.map(p=>p[0])); }
  return txt.replace(_ukRe, m => _ukMap[m.toLowerCase()] || m);
}
/* Os dados nasceram com duas regências já britânicas ("football", "in autumn"): normaliza para US. */
function usText(txt){ return txt.replace(/\bfootball\b/g,'soccer').replace(/\bin autumn\b/g,'in the fall'); }
/* Formas UK de um verbo — só as que mudam; devolve null se for igual ao US. */
const UK_RESPELL = { color:'colour', honor:'honour', favor:'favour', labor:'labour', center:'centre', mold:'mould', enroll:'enrol', fulfill:'fulfil' };
const UK_L = ['travel','cancel','total','label','model','level','signal','fuel','quarrel','channel','counsel','tunnel'];
const UK_T = ['learn','dream','burn','spell','smell','spill','spoil','lean','leap'];
function ukVerbForms(v, us){
  const b = v.base;
  if(v.phrasal) return (v.base === 'get') ? { pp:'got' } : null;
  if(UK_RESPELL[b]){
    const nb = UK_RESPELL[b];
    if(b === 'enroll' || b === 'fulfill') return { base:nb, s3:nb+'s', ing:nb+'ling', past:nb+'led', pp:nb+'led' };
    if(/e$/.test(nb)) return { base:nb, s3:nb+'s', ing:nb.slice(0,-1)+'ing', past:nb+'d', pp:nb+'d' };
    return { base:nb, s3:nb+'s', ing:nb+'ing', past:nb+'ed', pp:nb+'ed' };
  }
  if(/(ize|yze)$/.test(b) || b === 'practice'){
    const nb = b === 'practice' ? 'practise' : b.replace(/ize$/,'ise').replace(/yze$/,'yse');
    return { base:nb, s3:nb+'s', ing:nb.slice(0,-1)+'ing', past:nb+'d', pp:nb+'d' };
  }
  if(UK_L.includes(b)) return { past:b+'led', pp:b+'led', ing:b+'ling' };   /* consoante final dobra: travelled */
  if(UK_T.includes(b)) return { past:b+'t', pp:b+'t' };                      /* -t em vez de -ed: learnt, dreamt */
  if(v.id === 'get') return { pp:'got' };                                    /* UK "has got"; US "has gotten" */
  return null;
}
function initVariantes(){
  VERBS.forEach(v=>{
    const us = { base:v.base, s3:v.s3, ing:v.ing, past:v.past, pp:v.pp, label:v.label };
    if(v.id === 'get' || v.id === 'get-up') us.pp = 'gotten';
    if(v.phrasal && v.base === 'get') us.pp = 'gotten';
    const dif = ukVerbForms(v, us);
    const uk = Object.assign({}, us, dif || {});
    if(dif){
      uk.label = (us.label || '').split(us.base).join(uk.base);
      ['base','s3','ing','past','pp'].forEach(f=>{
        if(uk[f] !== us[f] && !(f === 'pp' && v.base === 'get')) VAR_CANON.set(uk[f], us[f]);
      });
    }
    v.us = us; v.uk = uk; v.vdiff = !!dif;
    (v.col || []).forEach(c=>{ c.us = usText(c.en); c.uk = ukText(c.us); });
  });
  VAR_CANON.set('gotten','got');
  VAR_PAIRS.concat([['on the weekend','at the weekend'],['at the store','at the shops'],['downtown','in the city centre']])
    .forEach(p=>VAR_PHRASE_CANON.push([new RegExp('\\b'+p[1]+'\\b','gi'), p[0]]));
  applyVariant();
}
function applyVariant(){
  VERBS.forEach(v=>{ Object.assign(v, ENG === 'uk' ? v.uk : v.us); (v.col || []).forEach(c=>{ c.en = c[ENG]; }); });
}
/* Reduz um texto à forma canônica (US) — usado só para comparar respostas. */
function canonVar(txt){
  VAR_PHRASE_CANON.forEach(([re, us])=>{ txt = txt.replace(re, us); });
  return txt.split(' ').map(w => VAR_CANON.get(w) || w).join(' ');
}
function saveState(){
  if(!CAN_STORE) return;
  try{
    localStorage.setItem(STORE_KEY, JSON.stringify({
      v: 1,
      theme: document.documentElement.getAttribute('data-theme') || 'dark',
      eng: ENG,
      speed: speedIdx,
      state: state,
      modal: modalState,
      practice: { level: practiceState.level, source: practiceState.source, tema: practiceState.tema, origem: practiceState.origem, hits: practiceState.hits,
                  misses: practiceState.misses, seen: practiceState.seen,
                  missQueue: practiceState.missQueue },
      db: { type: dbState.type, family: dbState.family, group: dbState.group },
      matrixFollow: matrixFollow
    }));
  }catch(e){}
}
function loadState(){
  if(!CAN_STORE) return null;
  try{ return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); }catch(e){ return null; }
}
/* ---- Acessibilidade por teclado ----
   As pastilhas e chips são <div> com clique (escolha de estilo, feita lá no início).
   Em vez de reescrever todos os construtores, esta passagem única marca cada um como
   botão focável depois de cada render. Enter e Espaço disparam o mesmo clique, que é
   o que um <button> faria nativamente. */
/* Marca as faixas roláveis com sombra nas bordas quando há conteúdo fora da vista.
   Roda após cada render e a cada rolagem da própria faixa; usa só leitura de scrollLeft,
   sem observar o documento inteiro. */
/* A barra pode ter uma ou duas linhas conforme a largura; os elementos fixos (readouts,
   card de prática) precisam do valor real para não ficarem por baixo dela. */
function updateNavHeight(){
  const nav = document.querySelector('.topnav');
  if(!nav) return;
  /* v154: offsetHeight (px de layout) em vez de getBoundingClientRect — com o zoom do modo TV as duas medidas divergem */
  document.documentElement.style.setProperty('--nav-h', Math.round(nav.offsetHeight) + 'px');
}
window.addEventListener('resize', ()=>{ updateNavHeight(); updateScrollShadows(); }, {passive:true});
function updateScrollShadows(){
  document.querySelectorAll('.fam-row, .letter-row, .nav-pills, #dbGroupRow, #dbFamilyRow, .signal-row-inner:not(.wrap-row)')
    .forEach(row=>{
      if(row.offsetParent === null) return;
      const rolavel = row.scrollWidth > row.clientWidth + 2;
      row.classList.toggle('scroll-shadow', rolavel);
      if(!rolavel){ row.removeAttribute('data-more-left'); row.removeAttribute('data-more-right'); return; }
      const atualizar = ()=>{
        row.setAttribute('data-more-left', String(row.scrollLeft > 4));
        row.setAttribute('data-more-right', String(row.scrollLeft + row.clientWidth < row.scrollWidth - 4));
      };
      atualizar();
      if(!row.dataset.shadowBound){
        row.dataset.shadowBound = '1';
        row.addEventListener('scroll', atualizar, {passive:true});
      }
    });
}
function applyA11y(){
  document.querySelectorAll('.pronome-pill, .signal-chip, .opt-btn, .formato-switch, .letter-pill')
    .forEach(el=>{
      if(el.getAttribute('role') === 'button') return;
      el.setAttribute('role','button');
      el.setAttribute('tabindex','0');
    });
}
/* atalhos entre blocos que se complementam: abre o destino e leva até ele */
document.addEventListener('click', e=>{
  const b = e.target.closest('.cross-link');
  if(!b) return;
  const alvo = document.getElementById(b.dataset.goto);
  if(!alvo) return;
  if(alvo.dataset.open !== 'true') toggleBlock(b.dataset.goto);
  if(alvo.scrollIntoView) alvo.scrollIntoView({behavior:'smooth', block:'start'});
});
document.addEventListener('keydown', e=>{
  const el = e.target;
  if(!el || !el.getAttribute || el.getAttribute('role') !== 'button') return;
  if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
    e.preventDefault();
    el.click();
  }
});
/* ---- Orientação em documento longo ----
   O app tem ~7 telas no celular. Um observador marca na barra a seção que está em
   vista e mostra o botão de voltar ao topo depois da primeira tela. Usa
   IntersectionObserver (nada de listener de scroll disparando a cada pixel) e
   degrada em silêncio onde a API não existir. */
function setupNavSpy(){
  const pills = [...document.querySelectorAll('.nav-pill[data-section]')];
  const alvos = pills.map(p=>document.getElementById(p.dataset.section)).filter(Boolean);
  /* seções de referência (block-*) não têm botão próprio: todas acendem "Referência", cujo alvo é block-matrix */
  const marcar = (id)=>{ const alvo = /^block-/.test(id) ? 'block-matrix' : id;
    pills.forEach(p=> p.setAttribute('data-current', String(p.dataset.section === alvo))); };

  if('IntersectionObserver' in window && alvos.length){
    const visiveis = new Map();
    const io = new IntersectionObserver(entradas=>{
      entradas.forEach(e=> visiveis.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let melhor = null, maior = 0;
      visiveis.forEach((r,id)=>{ if(r > maior){ maior = r; melhor = id; } });
      if(melhor) marcar(melhor);
    }, { rootMargin: '-64px 0px -55% 0px', threshold: [0, .15, .4, .75] });
    alvos.forEach(a=>io.observe(a));
    document.querySelectorAll('section.block').forEach(a=>io.observe(a));     /* v132: seções de referência também */
  }

  const btn = document.getElementById('toTop');
  if(btn){
    btn.onclick = ()=> window.scrollTo({top:0, behavior:'smooth'});
    let pendente = false;
    const atualizar = ()=>{
      btn.setAttribute('data-show', String(window.scrollY > window.innerHeight * 0.8));
      pendente = false;
    };
    window.addEventListener('scroll', ()=>{
      if(pendente) return;
      pendente = true;
      requestAnimationFrame(atualizar);
    }, {passive:true});
    atualizar();
  }
}

/* Troca US ⇄ UK: reaplica os dados, converte os encaixes escolhidos para o par da outra
   variante (on weekends → at weekends) e redesenha tudo. */
function setEng(v, semSalvar){
  ENG = v === 'uk' ? 'uk' : 'us';
  applyVariant();
  if(typeof numRender === 'function') numRender();   /* v164 */
  if(typeof estRender === 'function') estRender();   /* v169: IPA e formas acompanham US/UK */
  const b = document.getElementById('engToggle');
  if(b){ b.textContent = ENG.toUpperCase(); b.dataset.eng = ENG; b.title = ENG === 'uk' ? 'Inglês britânico (UK) — toque para voltar ao americano' : 'Inglês americano (US) — toque para o britânico'; }
  const trocar = s => (SIGNAL_SWAP[s.w] && !variantOk(s.w)) ? Object.assign({}, s, { w: SIGNAL_SWAP[s.w] }) : s;
  state.signalMids = (state.signalMids || []).map(trocar);
  state.signalEnds = (state.signalEnds || []).map(trocar);
  if(state.o2 && state.o2.sl2){ state.o2.sl2.signalMids = (state.o2.sl2.signalMids || []).map(trocar); state.o2.sl2.signalEnds = (state.o2.sl2.signalEnds || []).map(trocar); }   /* v108 */
  if(Array.isArray(modalState.signals)) modalState.signals = modalState.signals.map(trocar);
  if(!semSalvar){
    render(); renderModal();
    if(typeof fonRender === 'function') fonRender();   /* v146 */
    if(typeof edRender === 'function') edRender();   /* v145: a lista do -ed segue a variante */
    if(typeof nextChallenge === 'function' && practiceState.challenge){ nextChallenge(); }
    saveState();
  }
}
function toggleEng(){ setEng(ENG === 'uk' ? 'us' : 'uk'); }
function toggleTheme(){
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  const btn = document.getElementById('themeToggle');
  if(isLight){ html.removeAttribute('data-theme'); btn.textContent = '🌙'; }
  else { html.setAttribute('data-theme','light'); btn.textContent = '☀️'; }
  saveState();
}

const PRONOUNS = ["I","You","He","She","It","We","They"];
const IS_3SG = p => ["He","She","It","Who","What"].includes(p);
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function lowerFirst(s){ return s.charAt(0).toLowerCase()+s.slice(1); }
function subjLower(p){ return p==="I" ? "I" : p.toLowerCase(); }
function bePres(p){ return IS_3SG(p) ? "is" : (p==="I" ? "am" : "are"); }
function bePast(p){ return (IS_3SG(p)||p==="I") ? "was" : "were"; }
function doPres(p){ return IS_3SG(p) ? "does" : "do"; }
function doPresNeg(p){ return IS_3SG(p) ? "doesn't" : "don't"; }
function havePres(p){ return IS_3SG(p) ? "has" : "have"; }
function havePresNeg(p){ return IS_3SG(p) ? "hasn't" : "haven't"; }
/* Negação do "be", separada em sujeito (neutro) + marcador (colorido) — ex.:
   negBe('I','present') → {subj:"I", marker:"'m not"} → "I" + "'m not" = "I'm not" */
function negBe(p, when){
  if(when==='present'){ if(p==='I') return {subj:"I", marker:"'m not"}; if(IS_3SG(p)) return {subj:p, marker:" isn't"}; return {subj:p, marker:" aren't"}; }
  else { if(IS_3SG(p)||p==='I') return {subj:p, marker:" wasn't"}; return {subj:p, marker:" weren't"}; }
}
/* Mesma ideia, já na ordem de pergunta (marcador vem antes do sujeito) — ex.:
   negBeQ('I','present') → {marker:"Aren't", subj:"I"} → "Aren't" + " " + "I" = "Aren't I".
   "Aren't I" é a exceção idiomática do inglês: a forma logicamente regular seria
   "Amn't I" / "Am I not", mas a fala e escrita naturais usam "aren't" nesse caso único. */
function negBeQ(p, when){
  if(when==='present'){ if(p==='I') return {marker:"Aren't", subj:"I"}; if(IS_3SG(p)) return {marker:"Isn't", subj:subjLower(p)}; return {marker:"Aren't", subj:subjLower(p)}; }
  else { if(IS_3SG(p)||p==='I') return {marker:"Wasn't", subj:subjLower(p)}; return {marker:"Weren't", subj:subjLower(p)}; }
}

/* ---- Marcação de cor por morfema (auxiliar/terminação vs. sujeito/raiz vs. complemento) ----
   Cada frase gerada carrega, embutidos no texto, delimitadores invisíveis ao redor de dois tipos
   de trecho:
   - "formato" (MARK_OPEN/MARK_CLOSE): tudo que muda com o tempo/formato — auxiliares (am/is/are/
     was/were/have/has/had/will/do/does/did, incluindo "be"/"been" quando fazem parte da cadeia
     auxiliar), a negação ("n't"/"not") e as terminações (-ed/-ing/-s, ou a forma irregular
     inteira quando o verbo não segue o padrão regular). Colorido conforme markColorVar(formato).
   - "complemento" (COMP_OPEN/COMP_CLOSE): advérbios e expressões de tempo (palavras-sinal),
     tanto no meio quanto no fim da frase. Sempre roxo/violeta, independente do formato.
   Sujeito e raiz do verbo nunca são marcados. markedToHTML()/drawMarkedLine() leem essa
   marcação para colorir na tela e no canvas. */
const MARK_OPEN = '\u0001', MARK_CLOSE = '\u0002', COMP_OPEN = '\u0003', COMP_CLOSE = '\u0004', REG_OPEN = '\u0005', REG_CLOSE = '\u0006', CONJ_OPEN = '\u000E', CONJ_CLOSE = '\u000F';   /* v100: conjunções têm marca e cor próprias (magenta) */
/* Encaixes 2 (como/quanto) e 3 (onde) ganham delimitadores próprios: cada posição da
   ordem canônica recebe uma cor, de modo que a frase mostra visualmente a montagem —
   quanto → como → onde → quando. */
const COMO_OPEN = '\u0007', COMO_CLOSE = '\u0008', ONDE_OPEN = '\u000B', ONDE_CLOSE = '\u000C';
/* v173: os 8 adjetivos em ordem (opinião → tamanho → idade → forma → cor → origem → material → propósito) ganham um par de
   delimitadores cada, nos códigos livres \u0010–\u001F (abre = par, fecha = ímpar). A tabela abaixo é a fonte única:
   chave do encaixe → [abre, fecha]. */
const ADJ7_CHAVES = ['opiniao', 'tamanho', 'idade', 'forma', 'cor', 'origem', 'material', 'proposito'];
const ADJ7_MARCA = {}; ADJ7_CHAVES.forEach((k, i) => { ADJ7_MARCA[k] = [String.fromCharCode(0x10 + 2 * i), String.fromCharCode(0x11 + 2 * i)]; });
const ADJ7_KIND = i => 'adj_' + ADJ7_CHAVES[i];
function A7(k, s){ return ADJ7_MARCA[k][0] + s + ADJ7_MARCA[k][1]; }   /* adjetivo do tipo k */
/* v94: o inverso de lowerFirstMarked — a 2ª oração passa a abrir a frase */
function upperFirstMarked(s){
  const i = s.search(/[A-Za-z]/);
  return i < 0 ? s : s.slice(0,i) + s[i].toUpperCase() + s.slice(i+1);
}
function M(s){ return MARK_OPEN + s + MARK_CLOSE; }
/* categoria visual do adjunto — segue os mesmos grupos que definem a ordem na frase */
const ADJ_COMO_FAM = new Set(['bitFam','mannerFam','compareFam','certaintyFam','focusMid','degreeMid']);
const ADJ_ONDE_FAM = new Set(['placeFam']);
/* As famílias preposicionais são heterogêneas: "by heart" é modo e "by then" é tempo,
   mesma família. Por isso a categoria é propriedade da EXPRESSÃO, não da família —
   estas listas cobrem os casos em que a família não decide. */
const ADJ_COMO_W = new Set(["by heart", "by default", "by myself", "little by little", "step by step", "day by day", "one by one", "by chance", "by mistake", "by accident", "side by side", "by all means", "by far", "from home", "from experience", "from scratch", "from memory", "from a distance", "with pleasure", "with care", "without a doubt", "without fail", "without thinking", "without warning", "in general", "in person", "in a hurry", "in silence", "in a rush", "in fact", "on purpose", "on foot", "on my own", "on average", "on the spot", "out loud", "off the record", "out of nowhere", "out of habit", "under pressure", "under the radar", "under the table", "under those circumstances", "against the clock", "against my will", "against all odds", "against the odds", "to some extent", "to the fullest", "to no avail", "of my own accord", "as usual", "as always", "as a rule", "as much as possible", "as far as I know", "as expected", "as planned", "as agreed", "as promised", "as needed", "as never before", "through thick and thin", "through it all", "within reason", "within budget", "more than usual", "less than usual", "harder than ever", "better than before", "more than ever", "better than ever", "like never before", "as much as ever", "more than before", "about half the time", "at least", "at once", "over the phone", "up close"]);
const ADJ_ONDE_W = new Set(["at home", "at work", "around here", "around the corner", "over there", "all over the place", "back home", "across the country", "along the river", "along the way", "here", "there", "everywhere", "nearby", "outside", "abroad", "online", "downtown", "in the city centre", "upstairs", "remotely", "in this building", "on the way"]);
function adjKind(cls, w){
  if(w){
    if(ADJ_COMO_W.has(w)) return 'como';
    if(ADJ_ONDE_W.has(w)) return 'onde';
  }
  return ADJ_COMO_FAM.has(cls) ? 'como' : (ADJ_ONDE_FAM.has(cls) ? 'onde' : 'quando');
}
function C(s, cls){
  const k = adjKind(cls, s);
  if(k === 'como') return COMO_OPEN + s + COMO_CLOSE;
  if(k === 'onde') return ONDE_OPEN + s + ONDE_CLOSE;
  return COMP_OPEN + s + COMP_CLOSE;
}
function R(s){ return REG_OPEN + s + REG_CLOSE; } /* regência / collocation — azul */
function J(s){ return CONJ_OPEN + s + CONJ_CLOSE; } /* v100: conjunção — magenta (cor que nenhum outro papel usa) */
function stripMarks(s){ return s.replace(/[\u0001-\u0008\u000B\u000C\u000E\u000F\u0010-\u001F]/g, ''); }
function markedToSegments(s){
  const segments = [];
  const re = /\u0001([^\u0002]*)\u0002|\u0003([^\u0004]*)\u0004|\u0005([^\u0006]*)\u0006|\u0007([^\u0008]*)\u0008|\u000B([^\u000C]*)\u000C|\u000E([^\u000F]*)\u000F|([\u0010\u0012\u0014\u0016\u0018\u001A\u001C\u001E])([^\u0011\u0013\u0015\u0017\u0019\u001B\u001D\u001F]*)[\u0011\u0013\u0015\u0017\u0019\u001B\u001D\u001F]/g;
  let last = 0, m;
  while((m = re.exec(s))){
    if(m.index > last) segments.push({t: s.slice(last, m.index), kind:'neutral'});
    if(m[1] !== undefined) segments.push({t: m[1], kind:'formato'});
    else if(m[2] !== undefined) segments.push({t: m[2], kind:'quando'});
    else if(m[3] !== undefined) segments.push({t: m[3], kind:'regencia'});
    else if(m[4] !== undefined) segments.push({t: m[4], kind:'como'});
    else if(m[5] !== undefined) segments.push({t: m[5], kind:'onde'});
    else if(m[6] !== undefined) segments.push({t: m[6], kind:'conj'});
    else segments.push({t: m[8], kind: ADJ7_KIND((m[7].charCodeAt(0) - 0x10) / 2)});   /* v173: adjetivos */
    last = re.lastIndex;
  }
  if(last < s.length) segments.push({t: s.slice(last), kind:'neutral'});
  return segments;
}
function escapeHTML(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
/* ---- PALETA ÚNICA DOS ENCAIXES ----
   Fonte única de verdade das cores de complemento: usada no HTML, nos chips do dial,
   nas etiquetas de ativos e no canvas do PNG. Mudar aqui muda tudo.
   O verde saiu: era próximo demais do teal das terminações verbais (-ed, -ing). */
const ADJ_COLOR = { quando:'var(--violet)', como:'var(--orange)', onde:'var(--lime)', regencia:'var(--blue)', conj:'var(--conj)' };
ADJ7_CHAVES.forEach(k => { ADJ_COLOR['adj_' + k] = 'var(--ad-' + k + ')'; });   /* v173: 8 cores novas, em pm.css */
function markedToHTML(s, formatoColorVar){
  return markedToSegments(s).map(seg => {
    if(seg.kind==='neutral') return escapeHTML(seg.t);
    const color = seg.kind==='formato' ? formatoColorVar : ADJ_COLOR[seg.kind];
    return `<span class="seg" data-kind="${seg.kind}" tabindex="0" style="color:${color}">${escapeHTML(seg.t)}</span>`;
  }).join('');
}
/* Cor do marcador por formato — cada um dos 4 tem cor própria:
   afirmativa=teal, negativa=vermelho, pergunta=amarelo queimado, pergunta negativa=rosa. */
function markColorVar(formato){
  if(formato==='afirmativa') return 'var(--teal)';
  if(formato==='negativa') return 'var(--red)';
  if(formato==='pergunta') return 'var(--burnt-yellow)';
  return 'var(--rose)'; // pergunta_negativa
}

/* Compara a raiz do verbo com uma forma flexionada e marca só o trecho que realmente muda —
   funciona tanto pra verbos regulares (work→worked: raiz "work" + marcado "ed") quanto
   irregulares, onde o prefixo comum pode ser parcial (go→went: "g"+"ent") ou inexistente
   (eat→ate: marca a palavra inteira), já que verbos irregulares não têm uma terminação fixa. */
/* lowerFirst em texto marcado: a primeira letra pode estar depois de um delimitador
   invisível de cor, então rebaixar text[0] cegamente não funciona — é preciso achar
   o primeiro caractere alfabético de verdade. */
function lowerFirstMarked(s){
  const i = s.search(/[A-Za-z]/);
  if(i < 0) return s;
  /* "I" é sempre maiúsculo em inglês, mesmo no meio da frase — rebaixá-lo depois de um
     marcador de sequência ("First, I worked") produziria erro clássico de iniciante. */
  const resto = s.slice(i);
  if(/^I\b/.test(resto) || /^I['’]/.test(resto)) return s;
  return s.slice(0,i) + s[i].toLowerCase() + s.slice(i+1);
}
function markedForm(base, inflected){
  let i=0;
  while(i<base.length && i<inflected.length && base[i]===inflected[i]) i++;
  return inflected.slice(0,i) + M(inflected.slice(i));
}

