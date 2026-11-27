/* ---- v169: IPA SOB DEMANDA nos blocos de números e estruturas ----
   Chip "IPA" liga/desliga a transcrição (US/UK conforme o botão do topo) sob cada leitura em inglês.
   O estado fica em localStorage; o dicionário é o mesmo da Pronúncia (pronIpa), carregado sob demanda. */
let NUM_IPA = false; try { NUM_IPA = localStorage.getItem('pm_numipa') === '1'; } catch(e){}
/* IPA de números: ordinais, dezenas e -teen estão em ipa.js / ipa-uk.js (v169); aqui só as siglas a.m./p.m. */
const NM_IPA = { am_:'eɪ ɛm', pm_:'pi ɛm' };   /* a.m./p.m. viram tokens; o restante agora vem de ipa.js e ipa-uk.js */
function ipaFraseTxt(t){
  t = t.replace(/\ba\.m\./gi, 'am_').replace(/\bp\.m\./gi, 'pm_');
  /* números escritos em dígitos viram palavras antes da transcrição: 18th → eighteenth, 2026 → twenty twenty-six */
  t = t.replace(/\b(\d+)(st|nd|rd|th)\b/g, (m, n) => nmOrdEn(+n, ENG === 'uk')).replace(/\b\d{1,12}\b/g, n => (n.length === 4 && +n >= 1100 && +n <= 2999) ? nmAnoEn(+n, ENG === 'uk') : nmEn(+n, ENG === 'uk'));
  return (t.match(/[A-Za-z'_]+/g) || []).map(w => {
    const k = w.toLowerCase();
    if(NM_IPA[k]) return NM_IPA[k];
    let r = null; try { r = pronIpa(w); } catch(e){} return r && r.ipa ? r.ipa.replace(/^\/|\/$/g, '') : w; }).join(' ');   /* sem IPA no dicionário: mostra a própria palavra */
}
function ipaAnota(raiz){
  if(!raiz) return;
  const chip = raiz.querySelector('.ipa-chip'); if(chip){ chip.classList.toggle('on', NUM_IPA); chip.setAttribute('aria-pressed', String(NUM_IPA)); }
  raiz.querySelectorAll('.num-ipa').forEach(e => e.remove());
  if(!NUM_IPA) return;
  raiz.querySelectorAll('.num-en, .tr-en').forEach(e => {
    const b = e.querySelector('.audio-btn'), t = b ? b.dataset.text : '';
    if(!t) return;   /* só linhas em inglês (as que têm áudio) */ const d = document.createElement('div'); d.className = 'num-ipa'; d.textContent = '/' + ipaFraseTxt(t) + '/';
    e.appendChild(d);
  });
}
function ipaChipHTML(){ return `<button type="button" class="chip ipa-chip${NUM_IPA ? ' on' : ''}" aria-pressed="${NUM_IPA}" title="Mostrar a transcrição fonética sob cada leitura">IPA</button>`; }
document.addEventListener('click', e => {
  if(!(e.target.closest && e.target.closest('.ipa-chip'))) return;
  NUM_IPA = !NUM_IPA; try { localStorage.setItem('pm_numipa', NUM_IPA ? '1' : '0'); } catch(x){}
  if(NUM_IPA && typeof pronCarregar === 'function') pronCarregar(() => { ipaAnota(document.getElementById('numWrap')); ipaAnota(document.getElementById('estWrap')); ipaAnota(document.getElementById('trilhaWrap')); });
  ipaAnota(document.getElementById('numWrap')); ipaAnota(document.getElementById('estWrap')); ipaAnota(document.getElementById('trilhaWrap'));
});

/* ---- v124: INTRODUÇÃO DE CADA SEÇÃO ----
   O que a seção faz (o) e como tirar o melhor dela (u). Fica num <details> aberto por padrão; se o aluno recolher,
   o app lembra (por seção) e não abre de novo. Texto em um só lugar para ser fácil de revisar. */
const SEC_INTRO = {
  'console-tempos': { o:'Monta frases em inglês peça por peça: você escolhe quem fala, o verbo, o tempo, o aspecto e o formato, e o motor mostra a frase, a tradução e a estrutura.',
    u:['Mude <b>uma peça de cada vez</b> e observe o que muda na frase: é assim que a regra aparece.', 'Toque em <b>qualquer palavra</b> da frase para ouvir só ela; nas palavras coloridas, o toque também mostra a função.', 'Depois de dominar a frase simples, acrescente encaixes (palavras-sinal, complemento) e, por fim, a 2ª oração.'] },
  'console-modais': { o:'Monta frases com verbos modais (can, must, should, might…) a partir da <b>função</b> que você quer expressar: habilidade, obrigação, conselho, possibilidade.',
    u:['Comece pela função, não pelo modal: pergunte "o que eu quero dizer?" e veja qual modal o motor escolhe.', 'Troque o tempo para ver como cada modal se comporta no passado e no futuro.', 'Toque nas palavras da frase para ouvir a pronúncia de cada uma.'] },
  'console-pratica': { o:'Treino ativo: o app mostra uma frase em português e você escreve em inglês. O que você erra entra numa fila de revisão.',
    u:['Tente responder <b>antes</b> de pedir a resposta: errar e corrigir fixa mais do que só ler.', 'Volte à fila de erros até ela zerar.', 'Use depois de explorar um tempo no motor, para testar se a regra ficou.'] },
  'console-expressoes': { o:'Banco de consulta com as expressões do app (palavras-sinal, conectivos e famílias), com tradução, busca e áudio.',
    u:['Use a busca em inglês ou em português quando souber o que quer dizer, mas não a expressão.', 'Navegue por família para aprender expressões parecidas juntas.', 'Ouça cada expressão: muitas mudam de ritmo quando ditas inteiras.'] },
  'block-matrix': { o:'A tabela-mestra: os 12 tempos do inglês lado a lado (passado, presente e futuro × 4 aspectos), nos quatro formatos.',
    u:['Leia na <b>horizontal</b> para comparar tempos e na <b>vertical</b> para comparar aspectos.', 'Toque numa linha da tabela para ouvir a frase.', 'Troque o verbo de origem para ver a mesma estrutura com outro verbo e baixe a tabela em PNG para revisar.'] },
  'block-posicao': { o:'Guia rápido de onde cada advérbio fica <b>no meio</b> da frase e de como montar perguntas com palavras interrogativas.',
    u:['Consulte quando ficar em dúvida entre "I always work" e "I work always".', 'Compare sempre o exemplo certo com o errado: o erro mostrado é o que o português induz.', 'Toque nos exemplos para ouvir.'] },
  'block-anatomia': { o:'Mostra os <b>encaixes</b> da frase: quantas peças cabem, em que ordem entram (como → onde → quando) e quais combinações valem a pena.',
    u:['Decore primeiro o atalho <b>como → onde → quando</b>: ele resolve a maioria das frases.', 'Toque num exemplo para carregá-lo no montador e depois tire e ponha peças.', 'Use o glossário por encaixe para descobrir que expressões cabem em cada posição.'] },
  'block-adverbs-tempo': { o:'Lista completa das palavras-sinal e conjunções, organizada por tempo verbal e aspecto: o caminho de "qual tempo?" para "quais expressões combinam?".',
    u:['Procure o tempo que você está estudando e veja as expressões que o acompanham.', '<b>Toque em qualquer expressão para ouvir.</b>', 'As cores são as mesmas dos encaixes: laranja = como, verde = onde, violeta = quando.'] },
  'block-conj': { o:'Regras das conjunções de tempo (when, as soon as, before, since, for…) e a armadilha clássica: depois delas o inglês não usa <i>will</i>.',
    u:['Leia antes de montar frases no futuro com <i>when</i> ou <i>as soon as</i>.', 'Toque nos exemplos para ouvir.', 'Depois, teste a regra no motor ligando uma 2ª oração temporal.'] },
  'block-gramatica': { o:'Explica, com testes simples e exemplos do dia a dia, <b>o que é uma oração</b>, como ligar ideias (<b>coordenar</b> ou <b>subordinar</b>) e <b>quando usar cada um dos ' + GRAM_ORDEM.length + ' tipos</b> (incluindo as <b>orações reduzidas</b>), além de separar <b>frase, oração e período</b>.',
    u:['Comece pelos <b>testes</b> (ponto final, "isso", adjetivo, circunstância): eles dizem a família de qualquer oração.', 'Use o <b>mapa de intenções</b> quando souber o que quer dizer, mas não souber a oração.', 'Em cada cartão, toque em <b>montar no console</b> para mexer na frase, e faça a tarefa <b>Experimente hoje</b> na vida real.', 'Feche com o <b>treino</b> no fim da seção: reconhecer o tipo é o que faz você escolher bem ao falar.'] },
  'block-oracoes': { o:'Catálogo dos tipos de oração composta: como cada um se forma, as conjunções que usa, exemplos e restrições, além do treino de conjunções.',
    u:['Abra um tipo de cada vez e leia a formação antes dos exemplos.', 'Toque no <b>nome da conjunção</b> para ouvir; cada exemplo tem o seu botão de áudio.', 'Use o botão que leva ao motor para montar a sua própria frase com aquele tipo, e feche a sessão com o treino.'] },
  'block-paragrafos': { o:'Repositório de parágrafos prontos em que as três frentes do app trabalham juntas: <b>tempo verbal</b>, <b>encaixes</b> e <b>orações ligadas por conjunção</b>. Todas as frases são montadas pelo motor.',
    u:['Percorra por <b>raciocínio</b> (explicar e concluir, causa e efeito, condição…): é assim que se aprende a encadear ideias. O acervo cobre as ' + (O2_TIPOS.length * (O2_TIPOS.length - 1) / 2) + ' combinações possíveis de dois tipos de oração, reduzidas incluídas.', 'Em <b>Combinação</b>, veja como as quatro famílias de oração (coordenadas, substantivas, adjetivas, adverbiais) se misturam; em <b>Tipo de oração</b>, escolha um tipo e depois <b>combine com</b> outro.', 'Leia o parágrafo inteiro primeiro e tente adivinhar por que cada peça está ali.', 'Abra <b>Ver explicação</b>: ela diz por que aqueles verbos, aquele aspecto, aqueles encaixes e por que aquela combinação de orações importa.', 'Leve uma frase ao console e troque uma peça para ver o que muda. Toque nas palavras para ouvir.'] },
  'block-ed': { o:'Como pronunciar o -ed dos verbos regulares: /t/, /d/ ou /ɪd/, conforme o último som do verbo, com IPA americano e britânico.',
    u:['Ache o <b>último som</b> do verbo (não a letra) e decida: surdo → /t/, sonoro → /d/, t/d → /ɪd/.', 'Faça o treino até acertar sem pensar na regra.', 'Toque em 🔊 (US) ou UK para comparar o som das duas variantes.'] },
  'block-fon': { o:'Regras de grafia → som testadas contra o vocabulário do app: -s/-es, som final, e mudo, C e G, -tion, letras mudas, TH, OUGH e grupos vocálicos.',
    u:['Comece por <b>-s / -es</b>: é a mesma lógica do -ed, vale pelo último SOM.', 'Veja a barra de cada regra: quando vale em quase todas as palavras é regra; quando falha muito, é só tendência.', 'Toque em 🔊 (US) ou UK para comparar o som das duas variantes.'] },
  'block-erros': { o:'Os erros mais comuns de quem fala português, cada um com a forma correta e a explicação.',
    u:['Leia a forma errada em voz alta e depois a correta: o contraste ajuda a fixar.', 'Ouça a forma correta no botão de áudio.', 'Volte aqui quando o modo Praticar apontar um erro repetido.'] },
  'block-trilha': { o:'O sumário de um livro de gramática do A1 ao C2: cada assunto com título em português e inglês, uma nota que abre e fecha e as ligações para onde ele é tratado no app. O que falta aparece marcado, com a sugestão de onde encaixar.',
    u:['Filtre por <b>nível</b> ou <b>situação</b>, ou busque em português ou inglês.', 'Abra um assunto para ler a nota e tocar nas ligações: elas levam ao motor, à Gramática, aos modais ou à seção certa.', 'Veja o <b>Plano</b> para saber o que ainda falta e em qual frente cada lacuna entraria; marque o que já estudou.'] },
  'block-numeros': { o:'Como se lê e se diz número, ano, data e hora em inglês (US e UK) e em português, calculado por regra a partir do que você digitar.',
    u:['Digite um número, um ano, uma data ou uma hora e veja a leitura nas duas línguas, com áudio.', 'Troque US/UK no topo: a data e o “and” mudam.', 'Treino: leia o item em português e escreva por extenso em inglês.'] },
  'block-estruturas': { o:'Estruturas que faltavam: formas de futuro, imperativo, there is/are, artigos e quantificadores, graus do adjetivo e preposições. As frases vêm do motor; as regras, de algoritmo.',
    u:['Escolha o verbo e o pronome: o futuro mostra will, going to, presente contínuo e presente simples lado a lado.', 'There is/are: troque o substantivo e veja a concordância.', 'Preposições: abra cada preposição para ver os verbos que a pedem, tirados do banco de expressões.'] },
  'block-gatilhos': { o:'Cada palavra interrogativa vira um reflexo: o que a resposta pede, quais verbos puxam a pergunta e treino contra o relógio.',
    u:['Mapa: toque nos verbos para ver a pergunta montada pelo motor; “abrir no motor” leva a frase para os dials.', 'Reflexo: leia a pergunta em português e acerte o gatilho em até 8 segundos.', 'Bateria 5W2H: escolha um verbo e veja todas as perguntas possíveis com ele.'] },
  'block-caderno': { o:'Suas frases salvas, com todos os ajustes do motor, para rever e treinar a fala.',
    u:['Toque em ☆ ao lado da frase do motor para guardar; toque de novo para remover.', '↺ devolve o motor ao ponto exato da frase; 🎤 (onde houver microfone) dá uma nota de pronúncia.', 'Use “esconder inglês” para treinar: leia o português, diga em inglês e toque na linha para conferir.'] },
  'block-algo': { o:'O roteiro mental para montar qualquer frase: as perguntas a fazer, na ordem certa.',
    u:['Use como lista de conferência enquanto ainda monta as frases devagar.', 'Com a prática, as etapas ficam automáticas e você deixa de precisar dele.'] }
};
/* ---- v125: MENU DA REFERÊNCIA ----
   Antes o botão só rolava até a primeira seção; as outras oito ficavam escondidas no fim de uma página longa. */
/* v169: menu em grupos, na ordem de estudo (esqueleto → palavras → tempo → frases compostas → som → treino).
   Linhas ['#', '', título] são cabeçalhos de grupo (não são botões). */
const REF_MENU = [
  ['#', '', 'Comece aqui'], ['block-trilha', '📖', 'Trilha do conhecimento', true],
  ['#', '', 'Esqueleto da frase'], ['block-anatomia', '🧩', 'Anatomia da frase'], ['block-matrix', '📊', 'Tabela de tempos'], ['block-algo', '🧭', 'Algoritmo mental'], ['block-posicao', '🎯', 'Guia de posição'],
  ['#', '', 'Palavras, números e estruturas'], ['block-estruturas', '🧱', 'Estruturas essenciais', true], ['block-numeros', '🔢', 'Números, datas e horas', true],
  ['#', '', 'Tempo na frase'], ['block-adverbs-tempo', '🗂️', 'Expressões por tempo'], ['block-conj', '⏳', 'Conjunções de tempo'],
  ['#', '', 'Frases compostas'], ['block-oracoes', '🔗', 'Orações compostas'], ['block-gramatica', '🌳', 'Gramática das orações', true], ['block-paragrafos', '📚', 'Parágrafos', true],
  ['#', '', 'Som'], ['block-fon', '🔤', 'Regras fonéticas'], ['block-ed', '🔔', 'Pronúncia do -ed'],
  ['#', '', 'VS Lab'], ['block-vslab', '🧪', 'Expressões e estruturas', true],
  ['#', '', 'Treino e revisão'], ['block-gatilhos', '⚡', 'Gatilhos de resposta', true], ['block-erros', '⚠️', 'Erros comuns'], ['block-caderno', '📓', 'Meu caderno']
];
function refMenuFecha(){ const m = document.getElementById('refMenu'); if(m) m.hidden = true; const b = document.getElementById('navRef'); if(b) b.setAttribute('aria-expanded', 'false'); }
function refMenuToggle(e){
  if(e) e.stopPropagation();
  let m = document.getElementById('refMenu');
  if(!m){
    m = document.createElement('div'); m.id = 'refMenu'; m.hidden = true; m.setAttribute('role', 'menu');
    m.innerHTML = REF_MENU.map(x => x[0] === '#' ? `<div class="rm-g" role="presentation">${x[2]}</div>` : `<button type="button" role="menuitem" data-ref="${x[0]}"${x[3] ? ' class="dest"' : ''}><b>${x[1]}</b>${x[2]}</button>`).join('');
    document.body.appendChild(m);
    m.querySelectorAll('button').forEach(b => { b.onclick = () => {
      refMenuFecha();
      const sec = document.getElementById(b.dataset.ref); if(!sec) return;
      if(sec.dataset.open !== 'true') toggleBlock(sec.id);
      setTimeout(() => sec.scrollIntoView({ behavior:'smooth', block:'start' }), 60);
    }; });
  }
  const abrir = m.hidden;
  if(abrir){ const nav = document.querySelector('.topnav'); const top = (nav ? nav.getBoundingClientRect().bottom : 56) + 6; m.style.top = top + 'px'; m.style.maxHeight = Math.max(160, (window.innerHeight || document.documentElement.clientHeight) - top - 10) + 'px'; }   /* v169: nunca passa da tela; rola por dentro */
  m.hidden = !abrir; document.getElementById('navRef').setAttribute('aria-expanded', String(abrir));
}
document.addEventListener('click', e => { if(!(e.target.closest && e.target.closest('#refMenu, #navRef'))) refMenuFecha(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') refMenuFecha(); });
const INTRO_KEY = 'pm_intro_v2';
(function buildIntros(){
  let fechadas = {}; try { fechadas = JSON.parse(localStorage.getItem(INTRO_KEY) || '{}') || {}; } catch(e){ fechadas = {}; }
  Object.keys(SEC_INTRO).forEach(id => {
    const sec = document.getElementById(id); if(!sec || sec.querySelector(':scope .sec-intro')) return;
    /* v125: o propósito fica sempre à vista (1–2 linhas); as dicas de uso abrem ao toque e o app lembra a escolha */
    const I = SEC_INTRO[id], d = document.createElement('details'); d.className = 'sec-intro'; d.open = fechadas[id] === false;
    d.innerHTML = `<summary><span class="si-o">ℹ️ ${I.o}</span><span class="si-k">como usar</span></summary><div class="si-c"><ul>${I.u.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
    d.addEventListener('toggle', () => { fechadas[id] = !d.open; try { localStorage.setItem(INTRO_KEY, JSON.stringify(fechadas)); } catch(e){} });
    const corpo = sec.querySelector('.block-body-inner'), rot = sec.querySelector('.console-label');
    if(corpo) corpo.insertBefore(d, corpo.firstChild); else if(rot) rot.insertAdjacentElement('afterend', d); else sec.insertBefore(d, sec.firstChild);
  });
})();
/* Restaura a sessão anterior antes do primeiro render. Cada bloco é validado: um estado
   salvo por uma versão antiga (verbo que não existe mais, tempo removido) é descartado
   em silêncio em vez de quebrar a abertura. */
(function restoreState(){
  const saved = loadState();
  if(!saved) return;
  try{
    if(saved.eng === 'uk') setEng('uk', true);
    if(Number.isInteger(saved.speed) && SPEEDS[saved.speed]){ speedIdx = saved.speed; const sb = document.getElementById('speedToggle'); if(sb){ sb.textContent = SPEEDS[speedIdx].l; sb.title = 'Velocidade do áudio: ' + SPEEDS[speedIdx].l; } }
    if(saved.theme === 'light'){
      document.documentElement.setAttribute('data-theme','light');
      const b = document.getElementById('themeToggle'); if(b) b.textContent = '☀️';
    }
    const s = saved.state;
    if(s && CATEGORIES[s.categoria] && TENSE_LABEL[s.tempo] && verbById(s.verbo).id === s.verbo){
      Object.assign(state, s);
      if(!CATEGORIES[state.categoria].aspects.includes(state.aspecto)) state.aspecto = CATEGORIES[state.categoria].aspects[0];
      if(!FORMATOS.includes(state.formato)) state.formato = 'afirmativa';
      const v = verbById(state.verbo);
      if(state.colocacao !== null && !(v.col || [])[state.colocacao]) state.colocacao = null;
      /* estado salvo por versões que guardavam um único sinal de fim */
      if(!Array.isArray(state.signalEnds)) state.signalEnds = s.signalEnd ? [s.signalEnd] : [];
      /* versões anteriores guardavam um único advérbio de meio */
      if(!Array.isArray(s.signalMids)) state.signalMids = s.signalMid ? [s.signalMid] : [];
      delete state.signalMid;
      if(state.suj && typeof state.suj !== 'object') state.suj = null;   /* v148 */
      state.signalSlot = null; state.signalFam = null; state.signalBusca = ''; state.signalMais = false;
      state.verboBusca = '';
      /* estado salvo antes do filtro por tema: abre no tema do verbo que já estava escolhido */
      if(!s.verboTema || (s.verboTema !== VERB_TEMA_FRASAIS && !VERB_TEMAS.some(t => t.k === s.verboTema))) state.verboTema = verbCats(verbById(state.verbo))[0];
    }
    const m = saved.modal;
    if(m && MODAL_ENGINE[m.funcao] && MODAL_ENGINE[m.funcao].tempos.some(t=>t.key===m.tempo) && FORMATOS.includes(m.formato)){
      Object.assign(modalState, m);
      /* versões anteriores guardavam um único sinal (texto), sempre de fim de frase */
      if(!Array.isArray(m.signals)) modalState.signals = (typeof m.signal === 'string' && m.signal) ? [{ w:m.signal, cls:modalSignalFam(m.signal), pl:'end' }] : [];
      delete modalState.signal;
      modalState.signalSlot = null; modalState.signalFam = null; modalState.signalBusca = ''; modalState.signalMais = false;
    }
    const p = saved.practice;
    if(p && PRACTICE_LEVELS.some(l=>l.key===p.level)){
      practiceState.level = p.level;
      if(PRACTICE_SOURCES.some(s=>s.key===p.source)) practiceState.source = p.source;
      if(p.tema === VERB_TEMA_FRASAIS || VERB_TEMAS.some(t=>t.k===p.tema)) practiceState.tema = p.tema;
      if(etimMeta(p.origem)) practiceState.origem = p.origem;
      practiceState.hits = p.hits|0; practiceState.misses = p.misses|0; practiceState.seen = p.seen|0;
      practiceState.missQueue = Array.isArray(p.missQueue) ? p.missQueue.filter(c=>c && c.pt && c.raw) : [];
    }
    if(typeof saved.matrixFollow === 'boolean') matrixFollow = saved.matrixFollow;
    if(saved.db && DB_TYPES.includes(saved.db.type)){
      dbState.type = saved.db.type; dbState.family = saved.db.family; dbState.group = saved.db.group;
    }
  }catch(e){ /* estado corrompido: segue com os padrões */ }
})();

render();
nextChallenge();
renderDb();
loadExprDb();
setupNavSpy();
updateNavHeight();
updateScrollShadows();
setTimeout(()=>{
  document.querySelectorAll('.block[data-open="true"] .block-body').forEach(b=>{ b.style.maxHeight='none'; });
},50);
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}

