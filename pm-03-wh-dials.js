/* ---- Wh-question engine ---- */
const WH_SUBJECT = ["Who","What"];
const WH_ADJUNCT = ["Where","When","Why","How","How long","How often"];
/* v148: as interrogativas do motor de TEMPOS ganharam grupos novos. O motor de modais continua com a lista
   original (MODAL_WH), por isso WH_ADJUNCT não muda; as novas ficam nas listas abaixo. */
const WH_ADJ_MAIS = ["What time","How far","How fast","How well","How soon","Since when","Until when"];
const WH_OBJETO = ["What (objeto)","Who (objeto)","Whom","Which one"];
const WH_PREP_FIM = ["What … for","Who … with"];
const WH_ESPECIAIS = ["How come","Why don't","How old","How many … are there"];
const WH_QUANTITY = ["How much","How many times","How many hours","How much + substantivo","How many + substantivo"];
const WH_PT_SUBJECT = {Who:"Quem",What:"O que"};
const WH_PT_ADJUNCT = {Where:"Onde",When:"Quando",Why:"Por que",How:"Como","How long":"Por quanto tempo","How often":"Com que frequência",
  "What time":"A que horas","How far":"Até onde","How fast":"Com que rapidez","How well":"Quão bem","How soon":"Em quanto tempo",
  "Since when":"Desde quando","Until when":"Até quando","How much":"Quanto","How many times":"Quantas vezes","How many hours":"Quantas horas"};
/* Interrogativas com comportamento próprio. w = palavra que entra na frase (o rótulo do chip pode ser mais longo);
   tipo: obj (pergunta pelo objeto — o complemento some) · semInv (ordem afirmativa) · neg (pergunta negativa = sugestão)
   · idade (só com be) ; fim = preposição que fica no fim (stranding) ; so = categoria em que a pergunta existe. */
const WH_X = {
  "What (objeto)": { w:"What", pt:"O que", tipo:"obj", so:"fact" },
  "Who (objeto)":  { w:"Who", pt:"Quem", tipo:"obj", so:"fact" },
  "Whom":          { w:"Whom", pt:"Quem", tipo:"obj", so:"fact" },
  "Which one":     { w:"Which one", pt:"Qual", tipo:"obj", so:"fact" },
  "What … for":    { w:"What", pt:"Para que", fim:"for", so:"fact" },
  "Who … with":    { w:"Who", pt:"Com quem", fim:"with", so:"fact" },
  "How come":      { w:"How come", pt:"Como é que", tipo:"semInv" },
  "Why don't":     { w:"Why", pt:"Por que", tipo:"neg" },
  "How old":       { w:"How old", tipo:"idade", so:"state" },
  "How many … are there": { w:"How many", tipo:"existQ", so:"state" },   /* v150: só com There is / There are */
  "How far":{ so:"fact" }, "How fast":{ so:"fact" }, "How well":{ so:"fact" }, "How much":{ so:"fact" }, "How many times":{ so:"fact" }, "How many hours":{ so:"fact" }
};
const WH_STATIC = {
  "How much + substantivo": {en:"How much water do you need?", pt:"De quanta água você precisa?", structure:"How much + substantivo incontável (singular) — pergunta por quantidade não contável"},
  "How many + substantivo": {en:"How many books did you read?", pt:"Quantos livros você leu?", structure:"How many + substantivo contável (plural) — pergunta por quantidade contável"}
};
/* v148: uma nota para cada interrogativa — o que ela pergunta, a estrutura e a armadilha mais comum */
const WH_NOTA = {
  "Who":"<b>Who (sujeito)</b> pergunta pela pessoa que FAZ a ação. Como a interrogativa já é o sujeito, não há auxiliar nem inversão, e o verbo vai para a 3ª pessoa do singular: <i>Who works here?</i>",
  "What":"<b>What (sujeito)</b> pergunta pela coisa que faz a ação ou acontece. Sem auxiliar e sem inversão, verbo na 3ª pessoa do singular: <i>What happened?</i>",
  "Where":"<b>Where</b> pergunta pelo <b>lugar</b>. Estrutura: Where + auxiliar + sujeito + verbo. O encaixe de lugar fica vazio, porque é a resposta que o preenche.",
  "When":"<b>When</b> pergunta pelo <b>momento</b>. Para um ponto definido do passado use o passado simples (<i>When did you arrive?</i>), não o present perfect.",
  "Why":"<b>Why</b> pergunta pela <b>causa</b>; a resposta costuma começar com <i>because</i>. Não esvazia nenhum encaixe de advérbio.",
  "How":"<b>How</b> pergunta pelo <b>modo</b> (de que maneira). Com o verbo be, pergunta pelo estado: <i>How are you?</i>",
  "How long":"<b>How long</b> pergunta pela <b>duração</b>. Com o present perfect equivale a \"há quanto tempo\": <i>How long have you worked here?</i> A resposta usa <i>for</i> (período) ou <i>since</i> (início).",
  "How often":"<b>How often</b> pergunta pela <b>frequência</b>. Respostas típicas: <i>every day, once a week, never</i>.",
  "What time":"<b>What time</b> pergunta pela <b>hora exata</b> — é mais específico que <i>When</i>. A resposta leva <i>at</i>: <i>at 8 o'clock</i>.",
  "How far":"<b>How far</b> pergunta pela <b>distância</b> ou por até onde algo vai: <i>How far do you run?</i>",
  "How fast":"<b>How fast</b> pergunta pela <b>velocidade</b>. É o molde <b>How + advérbio/adjetivo</b>, que mede um grau (How big, How tall, How late…).",
  "How well":"<b>How well</b> pergunta pelo <b>grau de qualidade</b> com que algo é feito: <i>How well do you speak English?</i>",
  "How soon":"<b>How soon</b> pergunta <b>em quanto tempo</b> algo vai acontecer, contando a partir de agora; combina mais com o futuro.",
  "Since when":"<b>Since when</b> pergunta pelo <b>ponto de início</b> de algo que continua; por isso pede o present perfect: <i>Since when have you worked here?</i>",
  "Until when":"<b>Until when</b> pergunta pelo <b>limite final</b>: até que momento a ação vai.",
  "How much":"<b>How much</b> sem substantivo pergunta pela <b>quantidade ou intensidade</b> da ação (<i>How much do you work?</i>). Com substantivo incontável: <i>How much water…?</i> Para preço: <i>How much is it?</i>",
  "How many times":"<b>How many times</b> pergunta pelo <b>número de vezes</b>. <i>How many</i> sempre pede substantivo contável no plural. Respostas: <i>once, twice, three times</i>.",
  "How many hours":"<b>How many hours</b> pergunta pela duração contada em horas. O molde é <b>How many + substantivo contável no plural</b> (hours, days, people…).",
  "What (objeto)":"<b>What (objeto)</b> pergunta pela coisa que RECEBE a ação. Aqui o sujeito é outro, então entram auxiliar e inversão: <i>What do you eat?</i> Compare com <i>What happened?</i> (What é sujeito, sem auxiliar). O complemento do verbo some, porque é a resposta.",
  "Who (objeto)":"<b>Who (objeto)</b> pergunta pela pessoa que recebe a ação: <i>Who do you help?</i> Há auxiliar e inversão, ao contrário de <i>Who helps you?</i> (Who é sujeito). No registro formal, <i>Whom</i>.",
  "Whom":"<b>Whom</b> é a forma de objeto de <i>who</i>, usada no inglês formal e obrigatória logo depois de preposição (<i>To whom…?</i>). Na fala comum, <i>Who do you help?</i>",
  "Which one":"<b>Which</b> pergunta por uma <b>escolha entre opções limitadas</b> (qual deles); <i>What</i> pergunta em aberto. <i>Which one</i> substitui o substantivo já conhecido.",
  "What … for":"<b>What … for</b> pergunta pela <b>finalidade</b> (\"para que\"). A preposição fica no <b>fim</b> da pergunta, logo depois do verbo — é o padrão natural do inglês falado.",
  "Who … with":"<b>Who … with</b> pergunta pela <b>companhia</b> (\"com quem\"). A preposição fica no fim, depois do verbo; a versão formal leva a preposição para o início: <i>With whom…?</i>",
  "How come":"<b>How come</b> é um \"por que\" informal, que mostra surpresa. Atenção: a ordem é <b>afirmativa</b>, sem auxiliar e sem inversão: <i>How come you work on Sundays?</i>",
  "Why don't":"<b>Why don't…?</b> é uma pergunta negativa usada como <b>sugestão ou convite</b>, não como cobrança: <i>Why don't you rest?</i> = \"Por que você não descansa?\"",
  "How many … are there":"<b>How many + plural + are there?</b> pergunta <b>quantos existem</b>. O substantivo vai colado à interrogativa e o verbo fica no plural, mesmo que a resposta seja um só (<i>There is one</i>). Com substantivo <b>incontável</b> a pergunta muda para <b>How much + singular + is there?</b> (time, money, work).",
  "How old":"<b>How old</b> pergunta pela <b>idade</b>. O inglês usa <b>be</b> (<i>How old are you? — I am 30</i>), enquanto o português usa <b>ter</b>. Nunca <i>How many years do you have?</i>",
  "How much + substantivo":"Exemplo fixo. <b>How much + substantivo incontável</b> (water, money, time), sempre no singular. O substantivo vai colado à interrogativa, antes do auxiliar.",
  "How many + substantivo":"Exemplo fixo. <b>How many + substantivo contável no plural</b> (books, people, hours). O substantivo vai colado à interrogativa, antes do auxiliar."
};
/* Cada palavra interrogativa PERGUNTA por um encaixe: o encaixe fica vazio (a resposta é que o
   preenche), e os outros continuam livres. "Where" esvazia o lugar, "When" o tempo, "How" o modo,
   "How long" a duração, "How often" a periodicidade e a frequência. Why/Who/What não esvaziam
   nenhum encaixe de advérbio: Why pergunta pela causa; Who/What ocupam o lugar do sujeito. */
const WH_VAZIO = { Where:[4], When:[8], How:[2], "How long":[6], "How often":[5,13],
  "What time":[8], "How far":[4], "How fast":[2], "How well":[2], "How soon":[8], "Since when":[8], "Until when":[8],
  "How much":[1], "How many times":[5,13], "How many hours":[6] };
function whVazios(w){ return new Set(WH_VAZIO[w] || []); }
/* v148: o verbo aceita objeto direto? Teste mais estrito que o da 2ª oração: exige uma colocação que comece por
   determinante/pronome indefinido ("the car", "everyone") — "sleep eight hours" não conta — mais uma lista de
   transitivos comuns cujas colocações não trazem artigo ("eat healthy food"). */
const WH_TRANS_EXTRA = new Set(['eat','drink','teach','drive','speak','love','cook','study','trust','play','collect','recycle','increase','decrease','think','recruit','train','delegate']);
function whTransitivo(v){
  if(!v) return false;
  if(WH_TRANS_EXTRA.has(v.id)) return true;
  return (v.col || []).some(c => /^(the|a|an|my|your|his|her|our|their|some|everyone|everything|someone|something|people|money)\b/.test(c.en) && typeof o2ObjDef === 'function' && o2ObjDef(c));
}
/* v148: a interrogativa existe nesta combinação? (categoria, verbo transitivo para as de objeto, sujeito existencial) */
function whDisponivel(w, cat, verb, suj){
  const X = WH_X[w] || {};
  if(X.so && X.so !== cat) return false;
  if(X.tipo === 'obj' && !whTransitivo(verb)) return false;
  if(X.tipo === 'existQ') return !!(suj && suj.t === 'exist');
  if(suj && (suj.t === 'exist' || suj.t === 'imp')){
    /* "There is…" / "It is…": só as circunstâncias fazem sentido (Where is there a problem?) */
    if(WH_SUBJECT.includes(w) || X.tipo === 'idade' || w === 'How') return false;
  }
  return true;
}
/* "Primeiro, hoje, ele trabalha." → abre com os prefixos e devolve o resto sem pontuação final */
function ptSepararPrefixos(frase){
  const pre = []; let resto = frase.replace(/\.$/,'');
  let m; while((m = resto.match(/^([^,]+), (.*)$/))){ pre.push(m[1]); resto = m[2]; }
  return {pre, resto};
}
function ptComWh(afirm, whPt, subj){
  const {pre, resto} = ptSepararPrefixos(afirm);
  const corpo = subj ? resto.replace(/^[Ee]le\s+/,'') : lowerFirst(resto);
  const cab = pre.map((x,i)=> i ? lowerFirst(x) : x).join(', ');
  return (cab ? cab + ', ' + lowerFirst(whPt) : whPt) + ' ' + corpo + '?';
}
function whGenerate(cat,tempo,aspecto,pronoun,whWord,verb,opts){
  if(WH_STATIC[whWord]) return Object.assign({isStatic:true}, WH_STATIC[whWord]);
  opts = opts || {};
  { const mk = opts.molde ? whMoldeDe(whWord, opts.molde) : null;   /* v149: estrutura ligada à interrogativa */
    if(mk && (!mk.precisaVerbo || cat === 'fact')) return whMoldeGerar(mk, cat, tempo, aspecto, pronoun, whWord, verb, opts.col || null); }
  const X = WH_X[whWord] || {}, palavra = X.w || whWord;      /* v148: rótulo ≠ palavra ("What (objeto)" → What) */
  const vz = whVazios(whWord);
  const manter = l => (Array.isArray(l) ? l : []).filter(x => !vz.has(slotOf(x)));
  const mids = manter(opts.mids), ends = manter(opts.ends);
  const subj = WH_SUBJECT.includes(whWord);
  const resto = ends.filter(x => x.cls !== 'seqFam'), seq = ends.filter(x => x.cls === 'seqFam');
  const extra = (mids.length || ends.length) ? ' + palavras-sinal nos outros encaixes' : '';
  const fecha = raw => { if(seq.length) raw = seq.map(x=>C(cap(x.w), x.cls)).join(', ') + ', ' + lowerFirstMarked(raw); return raw + M('?'); };
  /* v148 — How old: só com be, sempre no aspecto simples; o predicado some (a idade é a resposta) */
  if(X.tipo === 'idade'){
    const g = generate('state', tempo, 'simples', 'pergunta', pronoun, null);
    const raw = fecha(M(palavra) + ' ' + lowerFirstMarked(g.text.replace(/ tired/, '')));
    const per = ptPerson(pronoun), ter = tempo === 'present' ? PT_TER.presente[per] : tempo === 'past' ? PT_TER.imperf[per] : PT_ESTAR.ir[per] + ' ter';
    return { en: stripMarks(raw), enMarked: raw, pt: 'Quantos anos ' + PT_PRONOUN[pronoun] + ' ' + ter + '?', structure: 'How old + be + sujeito — a idade usa BE em inglês (em português, TER)', isStatic:false };
  }
  /* v150 — How many/How much … there: o substantivo cola na interrogativa; contável → plural + are · incontável → singular + is */
  if(X.tipo === 'existQ'){
    const sj = sujAtivo(), q = sj && sj.t === 'exist' && sj.np.q; if(!q) return { en:'—', pt:'—', structure:'Escolha There is / There are no dial ①', isStatic:true };
    const asp2 = /perfeito/.test(aspecto) ? 'perfeito' : 'simples';
    const g = generate('state', tempo, asp2, 'pergunta', q.inc ? 'It' : 'They', null);
    const corpo = lowerFirstMarked(g.text.replace(/ tired/, '')).replace(/\b(it|they)\b/, 'there');
    const raw = M(q.inc ? 'How much' : 'How many') + ' ' + q.n + ' ' + corpo + M('?');
    const qPT = q.inc ? (q.g === 'm' ? 'Quanto' : 'Quanta') : (q.g === 'm' ? 'Quantos' : 'Quantas');
    return { en: stripMarks(raw), enMarked: raw, pt: qPT + ' ' + q.pt + ' ' + PT_3S.haver[tempo + '_' + asp2] + '?',
      structure: (q.inc ? 'How much + substantivo incontável + is there' : 'How many + substantivo no plural + are there') + ' — quantidade do que existe', isStatic:false, molde:true };
  }
  /* v148 — How come: ordem AFIRMATIVA depois da interrogativa */
  if(X.tipo === 'semInv'){
    const g = generate(cat,tempo,aspecto,'afirmativa', pronoun, verb);
    let raw = applySignal(g.text, mids.length ? mids : null, resto, null, null, 'afirmativa');
    raw = fecha(M(palavra) + ' ' + (pronoun === 'I' ? raw : lowerFirstMarked(raw)));
    const affPT = translate(cat,tempo,aspecto,'afirmativa', pronoun, mids.length ? mids : null, ends, verb && verb.id);
    return { en: stripMarks(raw), enMarked: raw, pt: ptComWh(affPT, X.pt, false), structure: `${palavra} + ordem afirmativa (sujeito + verbo) — sem auxiliar, sem inversão${extra}`, isStatic:false };
  }
  const fmtEN = X.tipo === 'neg' ? 'pergunta_negativa' : 'pergunta', fmtPT = X.tipo === 'neg' ? 'negativa' : 'afirmativa';
  const g = subj ? generate(cat,tempo,aspecto,'afirmativa', whWord, verb)
                 : generate(cat,tempo,aspecto,fmtEN, pronoun, verb);
  let base = g.text;
  /* v148: com be, How pergunta pelo próprio estado — o adjetivo é a resposta ("How are you?") */
  const semPred = cat === 'state' && whWord === 'How';
  if(semPred) base = base.replace(/ tired/, '');
  if(X.fim) base += ' ' + X.fim;                               /* preposição no fim: logo depois do verbo, antes dos adjuntos */
  let raw = applySignal(base, mids.length ? mids : null, resto, null, null, subj ? 'afirmativa' : fmtEN);
  if(!subj) raw = M(palavra) + ' ' + lowerFirstMarked(raw);
  raw = fecha(raw);
  let affPT = translate(cat,tempo,aspecto,fmtPT, subj ? 'He' : pronoun, mids.length ? mids : null, ends, verb && verb.id);
  if(semPred) affPT = affPT.replace(/ cansad[oa](\(a\))?/, '');
  const pt = ptComWh(affPT, subj ? WH_PT_SUBJECT[whWord] : (X.pt || WH_PT_ADJUNCT[whWord]), subj);
  const structure = subj ? `${whWord} (sujeito) + verbo — sem auxiliar, sem inversão${extra}`
    : X.tipo === 'obj' ? `${palavra} (objeto) + auxiliar + sujeito + verbo — o complemento é a resposta${extra}`
    : X.fim ? `${palavra} + auxiliar + sujeito + verbo + ${X.fim} (preposição no fim)${extra}`
    : X.tipo === 'neg' ? `Why + auxiliar negativo + sujeito + verbo — sugestão${extra}`
    : `${whWord} + estrutura de pergunta sim/não (auxiliar antes do sujeito)${extra}`;
  return {en: stripMarks(raw), enMarked: raw, pt, structure, isStatic:false};
}

const CATEGORIES = {
  fact: { label:"AÇÃO / FATO", icon:"🏃", accent:"#c9a34e", aspects:["simples","continuo","perfeito","perfeito_continuo"] },
  state: { label:"SER / ESTAR", icon:"🧍", accent:"#4fb6a6", aspects:["simples","perfeito"] }
};
const TENSES = ["past","present","future"];
const TENSE_LABEL = {past:"Passado", present:"Presente", future:"Futuro"};
const ASPECT_LABEL = {simples:"Simples", continuo:"Contínuo", perfeito:"Perfeito", perfeito_continuo:"Perf. Contínuo"};
const ASPECT_ICON = {simples:"▪️", continuo:"〰️", perfeito:"✅", perfeito_continuo:"⏳"};
const FORMATOS = ["afirmativa","negativa","pergunta","pergunta_negativa"];
const FORMATO_LABEL = {afirmativa:"Afirmativa", negativa:"Negativa", pergunta:"Pergunta", pergunta_negativa:"Pergunta negativa"};

const CLASS_INFO = {
  freqIndef: {label:"Frequência indefinida — meio da frase"},
  freqDef: {label:"Frequência definida/numérica — fim da frase"},
  perfectAdv: {label:"Advérbios de perfect — already/just/still/recently: meio · yet: fim"},
  timeMid: {label:"Advérbio de tempo — meio da frase"},
  timePoint: {label:"Ponto/expressão de tempo — fim da frase"},
  allFam: {label:"Família do \"all\" — fim da frase"},
  timeFam: {label:"Família do \"time\" — fim da frase"},
  wholeFam: {label:"Família do \"whole\" — fim da frase"},
  everFam: {label:"Família do \"ever/forever\" — fim da frase"},
  everyFam: {label:"Família do \"every\" — fim da frase"},
  againFam: {label:"Família do \"again\" — fim da frase"},
  asFam: {label:"Família do \"as\" — fim da frase"},
  fromFam: {label:"Família do \"from\" — fim da frase"},
  onFam: {label:"Família do \"on\" — fim da frase"},
  overFam: {label:"Família do \"over\" — fim da frase"},
  withFam: {label:"Família do \"with/without\" — fim da frase"},
  aroundFam: {label:"Família do \"around\" — fim da frase"},
  backFam: {label:"Família do \"back\" — fim da frase"},
  onceFam: {label:"Família do \"once\" — fim da frase"},
  aboutFam: {label:"Família do \"about\" — aproximação, fim da frase"},
  bitFam: {label:"Família do \"bit/little\" — grau e quantidade, fim da frase"},
  mannerFam: {label:"Modo — como se faz, fim da frase"},
  placeFam: {label:"Lugar — onde, fim da frase"},
  certaintyFam: {label:"Certeza — meio da frase (antes do \"not\" na negativa)"},
  focusMid: {label:"Foco — só, também, até: meio da frase"},
  degreeMid: {label:"Intensidade — realmente, completamente, quase: meio da frase"},
  durFam: {label:"Duração — por quanto tempo, fim da frase"},
  compareFam: {label:"Comparação — fim da frase"},
  seqFam: {label:"Sequência — ordem dos acontecimentos, fim da frase"},
  npiFam: {label:"Só em negativas e perguntas — at all, anymore, either…"},
  rightFam: {label:"Família do \"right\" — imediatez, fim da frase"},
  underFam: {label:"Família do \"under\" — fim da frase"},
  throughFam: {label:"Família do \"through/across/along\" — fim da frase"},
  withinFam: {label:"Família do \"within\" — prazo, fim da frase"},
  againstFam: {label:"Família do \"against\" — fim da frase"},
  aheadFam: {label:"Família do \"ahead/behind\" — fim da frase"},
  updownFam: {label:"Família do \"up/down\" — fim da frase"},
  toFam: {label:"Família do \"to\" — fim da frase"},
  ofFam: {label:"Família do \"of\" — fim da frase"},
  atFam: {label:"Família do \"at\" — fim da frase"},
  inFam: {label:"Família do \"in\" — fim da frase"},
  byFam: {label:"Família do \"by\" — fim da frase"},
  forFam: {label:"Família do \"for\" — fim da frase"},
  outFam: {label:"Família do \"out/off\" — fim da frase"},
  splitFam: {label:"Posição partida — uma parte no meio, outra no fim"},
  outrosFam: {label:"Diversos — expressões próprias desta função"}
};

/* Advérbios de posição partida: ocupam DOIS pontos da frase ao mesmo tempo
   ("I will never work again"). Guardam a forma alternativa para contextos negativos,
   porque "never" já carrega a negação — em frase negada o inglês troca por "ever"
   ("I won't ever work again"), nunca "won't never". */
const SPLIT_SIGNALS = {
  present_simples: [{w:"never ... again", mid:"never", end:"again", negMid:"ever", pt:"nunca mais", cls:"splitFam", pl:"split"}],
  past_simples: [{w:"never ... again", mid:"never", end:"again", negMid:"ever", pt:"nunca mais", cls:"splitFam", pl:"split"}],
  present_perfeito: [{w:"never ... again", mid:"never", end:"again", negMid:"ever", pt:"nunca mais", cls:"splitFam", pl:"split"}],
  future_simples: [
    {w:"never ... again", mid:"never", end:"again", negMid:"ever", pt:"nunca mais", cls:"splitFam", pl:"split"},
    {w:"always ... anyway", mid:"always", end:"anyway", negMid:"always", pt:"sempre", ptEnd:"de qualquer forma", cls:"splitFam", pl:"split"}
  ]
};
const SIGNAL_WORDS = {
  present_simples: [
    {w:"always",pl:"mid",cls:"freqIndef"},{w:"usually",pl:"mid",cls:"freqIndef"},{w:"often",pl:"mid",cls:"freqIndef"},{w:"sometimes",pl:"mid",cls:"freqIndef"},{w:"occasionally",pl:"mid",cls:"freqIndef"},{w:"rarely",pl:"mid",cls:"freqIndef"},{w:"hardly ever",pl:"mid",cls:"freqIndef"},{w:"never",pl:"mid",cls:"freqIndef"},{w:"seldom",pl:"mid",cls:"freqIndef"},{w:"frequently",pl:"mid",cls:"freqIndef"},{w:"generally",pl:"mid",cls:"freqIndef"},{w:"constantly",pl:"mid",cls:"freqIndef"},
    {w:"every day",pl:"end",cls:"freqDef"},{w:"every week",pl:"end",cls:"freqDef"},{w:"every month",pl:"end",cls:"freqDef"},{w:"twice a week",pl:"end",cls:"freqDef"},{w:"three times a day",pl:"end",cls:"freqDef"},{w:"once a month",pl:"end",cls:"freqDef"},{w:"every year",pl:"end",cls:"freqDef"},{w:"once a week",pl:"end",cls:"freqDef"},{w:"twice a day",pl:"end",cls:"freqDef"},{w:"every morning",pl:"end",cls:"freqDef"},{w:"every night",pl:"end",cls:"freqDef"},
    {w:"all the time",pl:"end",cls:"allFam"},{w:"all of them",pl:"end",cls:"allFam"},{w:"all of us",pl:"end",cls:"allFam"},
    {w:"from time to time",pl:"end",cls:"timeFam"},{w:"on time",pl:"end",cls:"timeFam"},{w:"every time",pl:"end",cls:"timeFam"},{w:"every single day",pl:"end",cls:"everyFam"},{w:"every other day",pl:"end",cls:"everyFam"},{w:"every now and then",pl:"end",cls:"everyFam"},{w:"every weekend",pl:"end",cls:"everyFam"},{w:"again and again",pl:"end",cls:"againFam"},{w:"over and over again",pl:"end",cls:"againFam"},
    {w:"as usual",pl:"end",cls:"asFam"},{w:"as always",pl:"end",cls:"asFam"},{w:"as a rule",pl:"end",cls:"asFam"},{w:"as much as possible",pl:"end",cls:"asFam"},
    {w:"at least",pl:"end",cls:"atFam"},{w:"at once",pl:"end",cls:"atFam"},{w:"at the same time",pl:"end",cls:"atFam"},{w:"at all times",pl:"end",cls:"atFam"},{w:"in general",pl:"end",cls:"inFam"},{w:"in advance",pl:"end",cls:"inFam"},{w:"in person",pl:"end",cls:"inFam"},{w:"in a hurry",pl:"end",cls:"inFam"},{w:"by heart",pl:"end",cls:"byFam"},{w:"by default",pl:"end",cls:"byFam"},{w:"by myself",pl:"end",cls:"byFam"},{w:"for sure",pl:"end",cls:"forFam"},{w:"for now",pl:"end",cls:"forFam"},{w:"for a living",pl:"end",cls:"forFam"},{w:"for fun",pl:"end",cls:"forFam"},{w:"out loud",pl:"end",cls:"outFam"},{w:"off and on",pl:"end",cls:"outFam"},
    {w:"from home",pl:"end",cls:"fromFam"},{w:"from experience",pl:"end",cls:"fromFam"},{w:"from scratch",pl:"end",cls:"fromFam"},{w:"on purpose",pl:"end",cls:"onFam"},{w:"on foot",pl:"end",cls:"onFam"},{w:"on my own",pl:"end",cls:"onFam"},{w:"on average",pl:"end",cls:"onFam"},
    {w:"over and over",pl:"end",cls:"overFam"},{w:"over the phone",pl:"end",cls:"overFam"},{w:"all over the place",pl:"end",cls:"overFam"},{w:"with pleasure",pl:"end",cls:"withFam"},{w:"with care",pl:"end",cls:"withFam"},{w:"without a doubt",pl:"end",cls:"withFam"},{w:"without fail",pl:"end",cls:"withFam"},{w:"around the clock",pl:"end",cls:"aroundFam"},{w:"around here",pl:"end",cls:"aroundFam"},{w:"once in a while",pl:"end",cls:"onceFam"},{w:"little by little",pl:"end",cls:"byFam"},{w:"step by step",pl:"end",cls:"byFam"},{w:"day by day",pl:"end",cls:"byFam"},
    {w:"about twice a week",pl:"end",cls:"aboutFam"},{w:"about three times a month",pl:"end",cls:"aboutFam"},{w:"about every day",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"anymore",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"any longer",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"either",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"in the least",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"right now",pl:"end",cls:"rightFam"},{w:"right away",pl:"end",cls:"rightFam"},{w:"right here",pl:"end",cls:"rightFam"},{w:"normally",pl:"mid",cls:"freqIndef"},{w:"typically",pl:"mid",cls:"freqIndef"},{w:"regularly",pl:"end",cls:"freqIndef"},{w:"hardly",pl:"mid",cls:"freqIndef", only:["afirmativa","pergunta"]},{w:"daily",pl:"end",cls:"freqDef"},{w:"weekly",pl:"end",cls:"freqDef"},{w:"monthly",pl:"end",cls:"freqDef"},{w:"twice a month",pl:"end",cls:"freqDef"},{w:"every other week",pl:"end",cls:"freqDef"},{w:"once in a blue moon",pl:"end",cls:"freqDef"},{w:"these days",pl:"end",cls:"timePoint"},{w:"on a daily basis",pl:"end",cls:"timePoint"},
    {w:"all day long",pl:"end",cls:"allFam"},{w:"all week long",pl:"end",cls:"allFam"},{w:"all morning long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"under the radar",pl:"end",cls:"underFam"},{w:"along the way",pl:"end",cls:"throughFam"},{w:"against the clock",pl:"end",cls:"againstFam"},{w:"against my will",pl:"end",cls:"againstFam"},{w:"up close",pl:"end",cls:"updownFam"},{w:"to some extent",pl:"end",cls:"toFam"},{w:"to the fullest",pl:"end",cls:"toFam"},{w:"of my own accord",pl:"end",cls:"ofFam"},{w:"straight away",pl:"end",cls:"rightFam"},
    {w:"a bit",pl:"end",cls:"bitFam"},{w:"a little",pl:"end",cls:"bitFam"},{w:"a little bit",pl:"end",cls:"bitFam"},{w:"quite a bit",pl:"end",cls:"bitFam"},{w:"very little",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"fast",pl:"end",cls:"mannerFam"},{w:"well",pl:"end",cls:"mannerFam"},{w:"quickly",pl:"end",cls:"mannerFam"},{w:"slowly",pl:"end",cls:"mannerFam"},{w:"carefully",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"everywhere",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"at work",pl:"end",cls:"placeFam"},{w:"online",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"nearby",pl:"end",cls:"placeFam"},{w:"outside",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"definitely",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"certainly",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"obviously",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than usual",pl:"end",cls:"compareFam"},{w:"less than usual",pl:"end",cls:"compareFam"},{w:"harder than ever",pl:"end",cls:"compareFam"},{w:"better than before",pl:"end",cls:"compareFam"},{w:"first",pl:"end",cls:"seqFam"},{w:"next",pl:"end",cls:"seqFam"},{w:"after that",pl:"end",cls:"seqFam"},{w:"from then on",pl:"end",cls:"seqFam"}
  ],
  present_continuo: [
    {w:"right now",pl:"end",cls:"timePoint"},{w:"at the moment",pl:"end",cls:"timePoint"},{w:"at present",pl:"end",cls:"timePoint"},{w:"nowadays",pl:"end",cls:"timePoint"},{w:"today",pl:"end",cls:"timePoint"},{w:"this week",pl:"end",cls:"timePoint"},{w:"this month",pl:"end",cls:"timePoint"},{w:"this year",pl:"end",cls:"timePoint"},{w:"these days",pl:"end",cls:"timePoint"},{w:"at this moment",pl:"end",cls:"timePoint"},
    {w:"currently",pl:"mid",cls:"timeMid"},{w:"still",pl:"mid",cls:"perfectAdv"},
    {w:"all day long",pl:"end",cls:"allFam"},{w:"all the time",pl:"end",cls:"allFam"},{w:"all of them",pl:"end",cls:"allFam"},
    {w:"as we speak",pl:"end",cls:"asFam"},{w:"as usual",pl:"end",cls:"asFam"},
    {w:"at least",pl:"end",cls:"atFam"},{w:"in a hurry",pl:"end",cls:"inFam"},{w:"in silence",pl:"end",cls:"inFam"},{w:"for now",pl:"end",cls:"forFam"},{w:"for a change",pl:"end",cls:"forFam"},
    {w:"from home",pl:"end",cls:"fromFam"},{w:"on the way",pl:"end",cls:"onFam"},{w:"on purpose",pl:"end",cls:"onFam"},
    {w:"over the phone",pl:"end",cls:"overFam"},{w:"over there",pl:"end",cls:"overFam"},{w:"with care",pl:"end",cls:"withFam"},{w:"without thinking",pl:"end",cls:"withFam"},{w:"around here",pl:"end",cls:"aroundFam"},
    {w:"about now",pl:"end",cls:"aboutFam"},{w:"about half the time",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"anymore",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"any longer",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"right this minute",pl:"end",cls:"rightFam"},{w:"this very moment",pl:"end",cls:"timePoint"},{w:"as of now",pl:"end",cls:"timePoint"},{w:"for the time being",pl:"end",cls:"timePoint"},{w:"this semester",pl:"end",cls:"timePoint"},
    {w:"all week long",pl:"end",cls:"allFam"},{w:"all afternoon long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"ahead of schedule",pl:"end",cls:"aheadFam"},{w:"behind schedule",pl:"end",cls:"aheadFam"},
    {w:"a bit",pl:"end",cls:"bitFam"},{w:"a little",pl:"end",cls:"bitFam"},{w:"a little bit",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"quickly",pl:"end",cls:"mannerFam"},{w:"carefully",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"online",pl:"end",cls:"placeFam"},{w:"outside",pl:"end",cls:"placeFam"},{w:"upstairs",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"definitely",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"apparently",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than usual",pl:"end",cls:"compareFam"},{w:"harder than ever",pl:"end",cls:"compareFam"},{w:"meanwhile",pl:"end",cls:"seqFam"}
  ],
  present_perfeito: [
    {w:"already",pl:"mid",cls:"perfectAdv"},{w:"just",pl:"mid",cls:"perfectAdv"},{w:"yet",pl:"end",cls:"perfectAdv", only:["negativa","pergunta","pergunta_negativa"]},
    {w:"ever",pl:"mid",cls:"freqIndef"},{w:"never",pl:"mid",cls:"freqIndef"},{w:"hardly ever",pl:"mid",cls:"freqIndef"},{w:"seldom",pl:"mid",cls:"freqIndef"},
    {w:"once",pl:"end",cls:"freqDef"},{w:"twice",pl:"end",cls:"freqDef"},{w:"three times",pl:"end",cls:"freqDef"},{w:"several times",pl:"end",cls:"freqDef"},{w:"many times",pl:"end",cls:"freqDef"},{w:"a few times",pl:"end",cls:"freqDef"},{w:"a lot",pl:"end",cls:"freqDef"},{w:"four times",pl:"end",cls:"freqDef"},{w:"five times",pl:"end",cls:"freqDef"},
    {w:"since 2020",pl:"end",cls:"timePoint"},{w:"since Monday",pl:"end",cls:"timePoint"},{w:"since last year",pl:"end",cls:"timePoint"},{w:"for three years",pl:"end",cls:"timePoint"},{w:"for a long time",pl:"end",cls:"timePoint"},{w:"so far",pl:"end",cls:"timePoint"},{w:"up to now",pl:"end",cls:"timePoint"},{w:"since I was a child",pl:"end",cls:"timePoint"},{w:"since 2015",pl:"end",cls:"timePoint"},{w:"for a week",pl:"end",cls:"timePoint"},{w:"for months",pl:"end",cls:"timePoint"},{w:"for ages",pl:"end",cls:"timePoint"},{w:"over the years",pl:"end",cls:"timePoint"},{w:"in the last few days",pl:"end",cls:"timePoint"},
    {w:"all my life",pl:"end",cls:"allFam"},{w:"all this time",pl:"end",cls:"allFam"},{w:"all of them",pl:"end",cls:"allFam"},
    {w:"for the first time",pl:"end",cls:"timeFam"},{w:"ever since",pl:"end",cls:"everFam"},{w:"never before",pl:"end",cls:"everFam"},{w:"my whole life",pl:"end",cls:"wholeFam"},{w:"this whole time",pl:"end",cls:"wholeFam"},{w:"yet again",pl:"end",cls:"againFam"},
    {w:"as far as I know",pl:"end",cls:"asFam"},{w:"as expected",pl:"end",cls:"asFam"},{w:"as never before",pl:"end",cls:"asFam"},
    {w:"at last",pl:"end",cls:"atFam"},{w:"at least",pl:"end",cls:"atFam"},{w:"at some point",pl:"end",cls:"atFam"},{w:"in my life",pl:"end",cls:"inFam"},{w:"in the meantime",pl:"end",cls:"inFam"},{w:"by now",pl:"end",cls:"byFam"},{w:"by far",pl:"end",cls:"byFam"},{w:"for sure",pl:"end",cls:"forFam"},{w:"for the most part",pl:"end",cls:"forFam"},{w:"out of nowhere",pl:"end",cls:"outFam"},
    {w:"from the start",pl:"end",cls:"fromFam"},{w:"from day one",pl:"end",cls:"fromFam"},{w:"on my own",pl:"end",cls:"onFam"},{w:"on several occasions",pl:"end",cls:"onFam"},
    {w:"over time",pl:"end",cls:"overFam"},{w:"over and over",pl:"end",cls:"overFam"},{w:"without a doubt",pl:"end",cls:"withFam"},{w:"without fail",pl:"end",cls:"withFam"},{w:"once in a lifetime",pl:"end",cls:"onceFam"},{w:"more than once",pl:"end",cls:"onceFam"},{w:"little by little",pl:"end",cls:"byFam"},{w:"one by one",pl:"end",cls:"byFam"},
    {w:"about ten times",pl:"end",cls:"aboutFam"},{w:"about twice",pl:"end",cls:"aboutFam"},{w:"about a hundred times",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"in years",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"in ages",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"any longer",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"finally",pl:"mid",cls:"perfectAdv"},{w:"time and again",pl:"end",cls:"freqDef"},{w:"countless times",pl:"end",cls:"freqDef"},{w:"until now",pl:"end",cls:"timePoint"},{w:"up until now",pl:"end",cls:"timePoint"},{w:"to this day",pl:"end",cls:"timePoint"},{w:"ever since then",pl:"end",cls:"timePoint"},{w:"in recent years",pl:"end",cls:"timePoint"},{w:"this whole year",pl:"end",cls:"timePoint"},
    {w:"through thick and thin",pl:"end",cls:"throughFam"},{w:"all the way through",pl:"end",cls:"throughFam"},{w:"within reason",pl:"end",cls:"withinFam"},{w:"within budget",pl:"end",cls:"withinFam"},{w:"against all odds",pl:"end",cls:"againstFam"},{w:"ahead of time",pl:"end",cls:"aheadFam"},{w:"behind the scenes",pl:"end",cls:"aheadFam"},{w:"to date",pl:"end",cls:"toFam"},{w:"to no avail",pl:"end",cls:"toFam"},{w:"to this point",pl:"end",cls:"toFam"},{w:"of late",pl:"end",cls:"ofFam"},
    {w:"quite a bit",pl:"end",cls:"bitFam"},{w:"a little",pl:"end",cls:"bitFam"},{w:"very little",pl:"end",cls:"bitFam"},{w:"a fair bit",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"well",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"successfully",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"everywhere",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"certainly",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"apparently",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"obviously",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than ever",pl:"end",cls:"compareFam"},{w:"better than ever",pl:"end",cls:"compareFam"},{w:"like never before",pl:"end",cls:"compareFam"},{w:"as much as ever",pl:"end",cls:"compareFam"},{w:"more than before",pl:"end",cls:"compareFam"},{w:"from then on",pl:"end",cls:"seqFam"},{w:"after that",pl:"end",cls:"seqFam"}
  ],
  present_perfeito_continuo: [
    {w:"since morning",pl:"end",cls:"timePoint"},{w:"since 9 a.m.",pl:"end",cls:"timePoint"},{w:"for two hours",pl:"end",cls:"timePoint"},{w:"for a while",pl:"end",cls:"timePoint"},{w:"lately",pl:"end",cls:"timePoint"},{w:"recently",pl:"end",cls:"timePoint"},{w:"all week",pl:"end",cls:"timePoint"},{w:"for hours",pl:"end",cls:"timePoint"},{w:"for days",pl:"end",cls:"timePoint"},{w:"since breakfast",pl:"end",cls:"timePoint"},{w:"since 8 a.m.",pl:"end",cls:"timePoint"},{w:"all day",pl:"end",cls:"timePoint"},{w:"all year",pl:"end",cls:"timePoint"},{w:"for months now",pl:"end",cls:"timePoint"},
    {w:"all day long",pl:"end",cls:"allFam"},{w:"all year long",pl:"end",cls:"allFam"},{w:"all this time",pl:"end",cls:"allFam"},
    {w:"the whole time",pl:"end",cls:"wholeFam"},{w:"the whole day",pl:"end",cls:"wholeFam"},
    {w:"as long as I can remember",pl:"end",cls:"asFam"},
    {w:"in the meantime",pl:"end",cls:"inFam"},{w:"for a change",pl:"end",cls:"forFam"},
    {w:"from the beginning",pl:"end",cls:"fromFam"},{w:"on and on",pl:"end",cls:"onFam"},
    {w:"over time",pl:"end",cls:"overFam"},{w:"around the clock",pl:"end",cls:"aroundFam"},{w:"step by step",pl:"end",cls:"byFam"},
    {w:"about an hour",pl:"end",cls:"aboutFam"},{w:"about two months",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"anymore",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"non-stop",pl:"end",cls:"timePoint"},{w:"since then",pl:"end",cls:"timePoint"},{w:"for quite a while",pl:"end",cls:"timePoint"},{w:"all this week",pl:"end",cls:"timePoint"},{w:"for the past few days",pl:"end",cls:"timePoint"},{w:"since last month",pl:"end",cls:"timePoint"},
    {w:"all week long",pl:"end",cls:"allFam"},{w:"all month long",pl:"end",cls:"allFam"},{w:"all morning long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"along the way",pl:"end",cls:"throughFam"},{w:"behind the scenes",pl:"end",cls:"aheadFam"},
    {w:"a bit",pl:"end",cls:"bitFam"},{w:"quite a bit",pl:"end",cls:"bitFam"},{w:"a bit longer",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"online",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"clearly",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than ever",pl:"end",cls:"compareFam"},{w:"harder than ever",pl:"end",cls:"compareFam"},{w:"from then on",pl:"end",cls:"seqFam"}
  ],
  past_simples: [
    {w:"always",pl:"mid",cls:"freqIndef"},{w:"usually",pl:"mid",cls:"freqIndef"},{w:"often",pl:"mid",cls:"freqIndef"},{w:"frequently",pl:"mid",cls:"freqIndef"},{w:"sometimes",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},{w:"rarely",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},{w:"seldom",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},{w:"never",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},
    {w:"yesterday",pl:"end",cls:"timePoint"},{w:"last week",pl:"end",cls:"timePoint"},{w:"last month",pl:"end",cls:"timePoint"},{w:"last year",pl:"end",cls:"timePoint"},{w:"two days ago",pl:"end",cls:"timePoint"},{w:"a week ago",pl:"end",cls:"timePoint"},{w:"in 2020",pl:"end",cls:"timePoint"},{w:"when I was young",pl:"end",cls:"timePoint"},{w:"back then",pl:"end",cls:"timePoint"},{w:"the day before yesterday",pl:"end",cls:"timePoint"},{w:"three years ago",pl:"end",cls:"timePoint"},{w:"a long time ago",pl:"end",cls:"timePoint"},{w:"in 1990",pl:"end",cls:"timePoint"},{w:"when I was a child",pl:"end",cls:"timePoint"},{w:"last night",pl:"end",cls:"timePoint"},{w:"earlier today",pl:"end",cls:"timePoint"},
    {w:"once",pl:"end",cls:"freqDef"},{w:"several times",pl:"end",cls:"freqDef"},{w:"twice",pl:"end",cls:"freqDef"},{w:"three times",pl:"end",cls:"freqDef"},{w:"many times",pl:"end",cls:"freqDef"},
    {w:"all day long",pl:"end",cls:"allFam"},{w:"all night long",pl:"end",cls:"allFam"},{w:"all of them",pl:"end",cls:"allFam"},{w:"all summer",pl:"end",cls:"allFam"},
    {w:"at the time",pl:"end",cls:"timeFam"},{w:"for the last time",pl:"end",cls:"timeFam"},{w:"just in time",pl:"end",cls:"timeFam"},{w:"the whole day",pl:"end",cls:"wholeFam"},{w:"the whole week",pl:"end",cls:"wholeFam"},{w:"again",pl:"end",cls:"againFam"},{w:"once again",pl:"end",cls:"againFam"},
    {w:"as usual",pl:"end",cls:"asFam"},{w:"as planned",pl:"end",cls:"asFam"},{w:"as expected",pl:"end",cls:"asFam"},{w:"as agreed",pl:"end",cls:"asFam"},
    {w:"at first",pl:"end",cls:"atFam"},{w:"at last",pl:"end",cls:"atFam"},{w:"at once",pl:"end",cls:"atFam"},{w:"at that point",pl:"end",cls:"atFam"},{w:"in the end",pl:"end",cls:"inFam"},{w:"in a rush",pl:"end",cls:"inFam"},{w:"in fact",pl:"end",cls:"inFam"},{w:"in the meantime",pl:"end",cls:"inFam"},{w:"by chance",pl:"end",cls:"byFam"},{w:"by mistake",pl:"end",cls:"byFam"},{w:"by accident",pl:"end",cls:"byFam"},{w:"by then",pl:"end",cls:"byFam"},{w:"for a while",pl:"end",cls:"forFam"},{w:"for once",pl:"end",cls:"forFam"},{w:"out of nowhere",pl:"end",cls:"outFam"},{w:"off the record",pl:"end",cls:"outFam"},
    {w:"from scratch",pl:"end",cls:"fromFam"},{w:"from memory",pl:"end",cls:"fromFam"},{w:"from the start",pl:"end",cls:"fromFam"},{w:"on purpose",pl:"end",cls:"onFam"},{w:"on foot",pl:"end",cls:"onFam"},{w:"on time",pl:"end",cls:"onFam"},{w:"on the spot",pl:"end",cls:"onFam"},
    {w:"over the weekend",pl:"end",cls:"overFam"},{w:"over the phone",pl:"end",cls:"overFam"},{w:"over there",pl:"end",cls:"overFam"},{w:"without warning",pl:"end",cls:"withFam"},{w:"without a doubt",pl:"end",cls:"withFam"},{w:"with pleasure",pl:"end",cls:"withFam"},{w:"around noon",pl:"end",cls:"aroundFam"},{w:"around the corner",pl:"end",cls:"aroundFam"},{w:"back home",pl:"end",cls:"backFam"},{w:"back in the day",pl:"end",cls:"backFam"},{w:"way back",pl:"end",cls:"backFam"},{w:"once and for all",pl:"end",cls:"onceFam"},{w:"just once",pl:"end",cls:"onceFam"},{w:"one by one",pl:"end",cls:"byFam"},{w:"side by side",pl:"end",cls:"byFam"},
    {w:"about an hour ago",pl:"end",cls:"aboutFam"},{w:"about a month ago",pl:"end",cls:"aboutFam"},{w:"about a year ago",pl:"end",cls:"aboutFam"},{w:"about twice",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"either",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"one bit",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"in the slightest",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"right away",pl:"end",cls:"rightFam"},{w:"right then",pl:"end",cls:"rightFam"},{w:"right after that",pl:"end",cls:"rightFam"},{w:"that day",pl:"end",cls:"timePoint"},{w:"that night",pl:"end",cls:"timePoint"},{w:"the other day",pl:"end",cls:"timePoint"},{w:"years ago",pl:"end",cls:"timePoint"},{w:"months ago",pl:"end",cls:"timePoint"},{w:"ages ago",pl:"end",cls:"timePoint"},{w:"last summer",pl:"end",cls:"timePoint"},{w:"this morning",pl:"end",cls:"timePoint"},{w:"only once",pl:"end",cls:"freqDef"},{w:"a couple of times",pl:"end",cls:"freqDef"},{w:"over and over",pl:"end",cls:"freqDef"},
    {w:"all week long",pl:"end",cls:"allFam"},{w:"all summer long",pl:"end",cls:"allFam"},{w:"all winter long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"under the table",pl:"end",cls:"underFam"},{w:"under those circumstances",pl:"end",cls:"underFam"},{w:"through the night",pl:"end",cls:"throughFam"},{w:"across the country",pl:"end",cls:"throughFam"},{w:"along the way",pl:"end",cls:"throughFam"},{w:"within minutes",pl:"end",cls:"withinFam"},{w:"within a week",pl:"end",cls:"withinFam"},{w:"within hours",pl:"end",cls:"withinFam"},{w:"against the odds",pl:"end",cls:"againstFam"},{w:"against my will",pl:"end",cls:"againstFam"},{w:"ahead of time",pl:"end",cls:"aheadFam"},{w:"behind schedule",pl:"end",cls:"aheadFam"},{w:"to no avail",pl:"end",cls:"toFam"},{w:"to some extent",pl:"end",cls:"toFam"},{w:"straight away",pl:"end",cls:"rightFam"},
    {w:"a bit",pl:"end",cls:"bitFam"},{w:"a little",pl:"end",cls:"bitFam"},{w:"a little bit",pl:"end",cls:"bitFam"},{w:"quite a bit",pl:"end",cls:"bitFam"},{w:"very little",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"fast",pl:"end",cls:"mannerFam"},{w:"well",pl:"end",cls:"mannerFam"},{w:"badly",pl:"end",cls:"mannerFam"},{w:"quickly",pl:"end",cls:"mannerFam"},{w:"slowly",pl:"end",cls:"mannerFam"},{w:"carefully",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"quietly",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"everywhere",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"at work",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"downtown",pl:"end",cls:"placeFam"},{w:"outside",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"definitely",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"certainly",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"obviously",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"apparently",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than usual",pl:"end",cls:"compareFam"},{w:"less than usual",pl:"end",cls:"compareFam"},{w:"better than before",pl:"end",cls:"compareFam"},{w:"harder than ever",pl:"end",cls:"compareFam"},{w:"like never before",pl:"end",cls:"compareFam"},{w:"first",pl:"end",cls:"seqFam"},{w:"then",pl:"end",cls:"seqFam"},{w:"next",pl:"end",cls:"seqFam"},{w:"after that",pl:"end",cls:"seqFam"},{w:"afterwards",pl:"end",cls:"seqFam"},{w:"before that",pl:"end",cls:"seqFam"},{w:"later on",pl:"end",cls:"seqFam"}
  ],
  past_continuo: [
    {w:"at that moment",pl:"end",cls:"timePoint"},{w:"at 5 p.m. yesterday",pl:"end",cls:"timePoint"},{w:"all day yesterday",pl:"end",cls:"timePoint"},{w:"at noon yesterday",pl:"end",cls:"timePoint"},{w:"while she was cooking",pl:"end",cls:"timePoint"},{w:"the whole afternoon",pl:"end",cls:"timePoint"},{w:"all night",pl:"end",cls:"timePoint"},
    {w:"all night long",pl:"end",cls:"allFam"},{w:"all day long",pl:"end",cls:"allFam"},{w:"all the time",pl:"end",cls:"allFam"},
    {w:"the whole time",pl:"end",cls:"wholeFam"},{w:"the whole night",pl:"end",cls:"wholeFam"},{w:"at the time",pl:"end",cls:"timeFam"},
    {w:"as usual",pl:"end",cls:"asFam"},{w:"as always",pl:"end",cls:"asFam"},
    {w:"at the same time",pl:"end",cls:"atFam"},{w:"in silence",pl:"end",cls:"inFam"},{w:"in a hurry",pl:"end",cls:"inFam"},
    {w:"from a distance",pl:"end",cls:"fromFam"},{w:"on the way",pl:"end",cls:"onFam"},{w:"on and on",pl:"end",cls:"onFam"},
    {w:"over the phone",pl:"end",cls:"overFam"},{w:"over there",pl:"end",cls:"overFam"},{w:"back and forth",pl:"end",cls:"backFam"},{w:"around the clock",pl:"end",cls:"aroundFam"},
    {w:"about an hour ago",pl:"end",cls:"aboutFam"},{w:"about that time",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"anymore",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"at that exact moment",pl:"end",cls:"timePoint"},{w:"the entire time",pl:"end",cls:"timePoint"},{w:"that afternoon",pl:"end",cls:"timePoint"},{w:"earlier that day",pl:"end",cls:"timePoint"},{w:"when it happened",pl:"end",cls:"timePoint"},
    {w:"all afternoon long",pl:"end",cls:"allFam"},{w:"all morning long",pl:"end",cls:"allFam"},{w:"all evening long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"through the night",pl:"end",cls:"throughFam"},{w:"along the river",pl:"end",cls:"throughFam"},{w:"behind schedule",pl:"end",cls:"aheadFam"},
    {w:"a bit",pl:"end",cls:"bitFam"},{w:"a little",pl:"end",cls:"bitFam"},
    {w:"quietly",pl:"end",cls:"mannerFam"},{w:"carefully",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"upstairs",pl:"end",cls:"placeFam"},{w:"outside",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"apparently",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than usual",pl:"end",cls:"compareFam"},{w:"meanwhile",pl:"end",cls:"seqFam"},{w:"at that point",pl:"end",cls:"seqFam"},{w:"in the meantime",pl:"end",cls:"seqFam"}
  ],
  past_perfeito: [
    {w:"already",pl:"mid",cls:"perfectAdv"},{w:"just",pl:"mid",cls:"perfectAdv"},{w:"recently",pl:"mid",cls:"perfectAdv"},{w:"never",pl:"mid",cls:"freqIndef"},
    {w:"before I left",pl:"end",cls:"timePoint"},{w:"by the time you arrived",pl:"end",cls:"timePoint"},{w:"by then",pl:"end",cls:"timePoint"},{w:"already by 2010",pl:"end",cls:"timePoint"},{w:"before the meeting started",pl:"end",cls:"timePoint"},{w:"by the time she called",pl:"end",cls:"timePoint"},{w:"by 2015",pl:"end",cls:"timePoint"},{w:"already by then",pl:"end",cls:"timePoint"},
    {w:"all along",pl:"end",cls:"allFam"},{w:"all that time",pl:"end",cls:"allFam"},
    {w:"as expected",pl:"end",cls:"asFam"},{w:"as promised",pl:"end",cls:"asFam"},
    {w:"by mistake",pl:"end",cls:"byFam"},{w:"by chance",pl:"end",cls:"byFam"},{w:"at that point",pl:"end",cls:"atFam"},{w:"in advance",pl:"end",cls:"inFam"},
    {w:"from the beginning",pl:"end",cls:"fromFam"},{w:"on my own",pl:"end",cls:"onFam"},
    {w:"over time",pl:"end",cls:"overFam"},{w:"without warning",pl:"end",cls:"withFam"},{w:"more than once",pl:"end",cls:"onceFam"},
    {w:"about a week before",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"finally",pl:"mid",cls:"perfectAdv"},{w:"never before",pl:"end",cls:"perfectAdv"},{w:"by that point",pl:"end",cls:"perfectAdv"},{w:"until that day",pl:"end",cls:"timePoint"},{w:"up to that point",pl:"end",cls:"timePoint"},{w:"the night before",pl:"end",cls:"timePoint"},{w:"long before that",pl:"end",cls:"timePoint"},
    {w:"within days",pl:"end",cls:"withinFam"},{w:"within a month",pl:"end",cls:"withinFam"},{w:"ahead of schedule",pl:"end",cls:"aheadFam"},{w:"behind schedule",pl:"end",cls:"aheadFam"},{w:"to that point",pl:"end",cls:"toFam"},{w:"to no avail",pl:"end",cls:"toFam"},
    {w:"quite a bit",pl:"end",cls:"bitFam"},{w:"very little",pl:"end",cls:"bitFam"},{w:"a little",pl:"end",cls:"bitFam"},
    {w:"well",pl:"end",cls:"mannerFam"},{w:"carefully",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"clearly",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"obviously",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than ever",pl:"end",cls:"compareFam"},{w:"better than before",pl:"end",cls:"compareFam"},{w:"before that",pl:"end",cls:"seqFam"},{w:"first",pl:"end",cls:"seqFam"}
  ],
  past_perfeito_continuo: [
    {w:"for two hours",pl:"end",cls:"timePoint"},{w:"since morning",pl:"end",cls:"timePoint"},{w:"all morning",pl:"end",cls:"timePoint"},{w:"for a while",pl:"end",cls:"timePoint"},{w:"for months",pl:"end",cls:"timePoint"},{w:"since the accident",pl:"end",cls:"timePoint"},{w:"all year",pl:"end",cls:"timePoint"},{w:"for a long time",pl:"end",cls:"timePoint"},
    {w:"all night long",pl:"end",cls:"allFam"},{w:"all year long",pl:"end",cls:"allFam"},{w:"all along",pl:"end",cls:"allFam"},
    {w:"the whole year",pl:"end",cls:"wholeFam"},
    {w:"in the meantime",pl:"end",cls:"inFam"},
    {w:"on and on",pl:"end",cls:"onFam"},
    {w:"over the years",pl:"end",cls:"overFam"},{w:"back and forth",pl:"end",cls:"backFam"},{w:"day by day",pl:"end",cls:"byFam"},
    {w:"about three hours",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"for quite some time",pl:"end",cls:"timePoint"},{w:"up until then",pl:"end",cls:"timePoint"},{w:"that entire week",pl:"end",cls:"timePoint"},{w:"since early morning",pl:"end",cls:"timePoint"},{w:"non-stop",pl:"end",cls:"timePoint"},
    {w:"all week long",pl:"end",cls:"allFam"},{w:"all day long",pl:"end",cls:"allFam"},{w:"all month long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"through the whole night",pl:"end",cls:"throughFam"},{w:"behind the scenes",pl:"end",cls:"aheadFam"},
    {w:"a bit",pl:"end",cls:"bitFam"},{w:"quite a bit",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"apparently",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than ever",pl:"end",cls:"compareFam"},{w:"harder than ever",pl:"end",cls:"compareFam"},{w:"up to then",pl:"end",cls:"seqFam"},{w:"before that",pl:"end",cls:"seqFam"}
  ],
  future_simples: [
    {w:"always",pl:"mid",cls:"freqIndef"},{w:"usually",pl:"mid",cls:"freqIndef"},{w:"often",pl:"mid",cls:"freqIndef"},{w:"frequently",pl:"mid",cls:"freqIndef"},{w:"sometimes",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},{w:"rarely",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},{w:"seldom",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},{w:"never",pl:"mid",cls:"freqIndef",only:["afirmativa","pergunta"]},
    {w:"tomorrow",pl:"end",cls:"timePoint"},{w:"next week",pl:"end",cls:"timePoint"},{w:"next month",pl:"end",cls:"timePoint"},{w:"next year",pl:"end",cls:"timePoint"},{w:"soon",pl:"end",cls:"timePoint"},{w:"in a few days",pl:"end",cls:"timePoint"},{w:"later",pl:"end",cls:"timePoint"},{w:"next weekend",pl:"end",cls:"timePoint"},{w:"in the future",pl:"end",cls:"timePoint"},{w:"eventually",pl:"end",cls:"timePoint"},{w:"someday",pl:"end",cls:"timePoint"},{w:"this evening",pl:"end",cls:"timePoint"},
    {w:"all of them",pl:"end",cls:"allFam"},{w:"all summer",pl:"end",cls:"allFam"},{w:"all weekend",pl:"end",cls:"allFam"},
    {w:"this time",pl:"end",cls:"timeFam"},{w:"next time",pl:"end",cls:"timeFam"},{w:"in time",pl:"end",cls:"timeFam"},{w:"forever",pl:"end",cls:"everFam"},{w:"for good",pl:"end",cls:"everFam"},{w:"again",pl:"end",cls:"againFam"},{w:"once again",pl:"end",cls:"againFam"},{w:"all over again",pl:"end",cls:"againFam"},
    {w:"as soon as possible",pl:"end",cls:"asFam"},{w:"as always",pl:"end",cls:"asFam"},{w:"as needed",pl:"end",cls:"asFam"},{w:"as usual",pl:"end",cls:"asFam"},{w:"at some point",pl:"end",cls:"atFam"},{w:"at least",pl:"end",cls:"atFam"},{w:"at once",pl:"end",cls:"atFam"},{w:"in advance",pl:"end",cls:"inFam"},{w:"in person",pl:"end",cls:"inFam"},{w:"in the end",pl:"end",cls:"inFam"},{w:"by then",pl:"end",cls:"byFam"},{w:"by all means",pl:"end",cls:"byFam"},{w:"for sure",pl:"end",cls:"forFam"},{w:"for now",pl:"end",cls:"forFam"},{w:"for a change",pl:"end",cls:"forFam"},{w:"out of habit",pl:"end",cls:"outFam"},{w:"from now on",pl:"end",cls:"fromFam"},{w:"from tomorrow",pl:"end",cls:"fromFam"},{w:"from scratch",pl:"end",cls:"fromFam"},{w:"on time",pl:"end",cls:"onFam"},{w:"on my own",pl:"end",cls:"onFam"},{w:"on purpose",pl:"end",cls:"onFam"},{w:"over the weekend",pl:"end",cls:"overFam"},{w:"over the phone",pl:"end",cls:"overFam"},{w:"with pleasure",pl:"end",cls:"withFam"},{w:"without fail",pl:"end",cls:"withFam"},{w:"without a doubt",pl:"end",cls:"withFam"},{w:"around noon",pl:"end",cls:"aroundFam"},{w:"around the corner",pl:"end",cls:"aroundFam"},{w:"back home",pl:"end",cls:"backFam"},{w:"once and for all",pl:"end",cls:"onceFam"},{w:"once in a lifetime",pl:"end",cls:"onceFam"},{w:"step by step",pl:"end",cls:"byFam"},{w:"about noon",pl:"end",cls:"aboutFam"},{w:"about this time",pl:"end",cls:"aboutFam"},{w:"in about an hour",pl:"end",cls:"aboutFam"},{w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"either",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"anymore",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"right away",pl:"end",cls:"rightFam"},{w:"right after work",pl:"end",cls:"rightFam"},{w:"right on time",pl:"end",cls:"rightFam"},{w:"first thing tomorrow",pl:"end",cls:"timePoint"},{w:"sooner or later",pl:"end",cls:"timePoint"},{w:"one of these days",pl:"end",cls:"timePoint"},{w:"before long",pl:"end",cls:"timePoint"},{w:"any minute now",pl:"end",cls:"timePoint"},{w:"the day after tomorrow",pl:"end",cls:"timePoint"},{w:"in a couple of days",pl:"end",cls:"timePoint"},
    {w:"all day long",pl:"end",cls:"allFam"},{w:"all week long",pl:"end",cls:"allFam"},
    {w:"along the way",pl:"end",cls:"throughFam"},{w:"within a week",pl:"end",cls:"withinFam"},{w:"within the hour",pl:"end",cls:"withinFam"},{w:"within budget",pl:"end",cls:"withinFam"},{w:"against all odds",pl:"end",cls:"againstFam"},{w:"ahead of schedule",pl:"end",cls:"aheadFam"},{w:"down the road",pl:"end",cls:"updownFam"},{w:"down the line",pl:"end",cls:"updownFam"},{w:"to the fullest",pl:"end",cls:"toFam"},{w:"to some extent",pl:"end",cls:"toFam"},
    {w:"a bit",pl:"end",cls:"bitFam"},{w:"a little",pl:"end",cls:"bitFam"},{w:"a bit longer",pl:"end",cls:"bitFam"},{w:"a little longer",pl:"end",cls:"bitFam"},{w:"quite a bit",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"fast",pl:"end",cls:"mannerFam"},{w:"well",pl:"end",cls:"mannerFam"},{w:"carefully",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"remotely",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"there",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"online",pl:"end",cls:"placeFam"},{w:"nearby",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"definitely",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"certainly",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"surely",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than usual",pl:"end",cls:"compareFam"},{w:"better than ever",pl:"end",cls:"compareFam"},{w:"harder than ever",pl:"end",cls:"compareFam"},{w:"first",pl:"end",cls:"seqFam"},{w:"next",pl:"end",cls:"seqFam"},{w:"after that",pl:"end",cls:"seqFam"},{w:"afterwards",pl:"end",cls:"seqFam"},{w:"later on",pl:"end",cls:"seqFam"}
  ],
  future_continuo: [
    {w:"at this time tomorrow",pl:"end",cls:"timePoint"},{w:"this time next week",pl:"end",cls:"timePoint"},{w:"at 8 p.m. tomorrow",pl:"end",cls:"timePoint"},{w:"at midnight tonight",pl:"end",cls:"timePoint"},{w:"at this time next month",pl:"end",cls:"timePoint"},{w:"this time tomorrow",pl:"end",cls:"timePoint"},
    {w:"all day long",pl:"end",cls:"allFam"},{w:"all night long",pl:"end",cls:"allFam"},{w:"all weekend",pl:"end",cls:"allFam"},
    {w:"as usual",pl:"end",cls:"asFam"},
    {w:"at the same time",pl:"end",cls:"atFam"},{w:"in person",pl:"end",cls:"inFam"},
    {w:"on the way",pl:"end",cls:"onFam"},
    {w:"over the weekend",pl:"end",cls:"overFam"},{w:"around here",pl:"end",cls:"aroundFam"},
    {w:"about this time tomorrow",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"all afternoon tomorrow",pl:"end",cls:"timePoint"},{w:"when you arrive",pl:"end",cls:"timePoint"},{w:"this time on Friday",pl:"end",cls:"timePoint"},{w:"during the meeting",pl:"end",cls:"timePoint"},
    {w:"all morning long",pl:"end",cls:"allFam"},{w:"all week long",pl:"end",cls:"allFam"},{w:"all evening long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"through the night",pl:"end",cls:"throughFam"},{w:"ahead of schedule",pl:"end",cls:"aheadFam"},
    {w:"a bit longer",pl:"end",cls:"bitFam"},{w:"a little longer",pl:"end",cls:"bitFam"},
    {w:"together",pl:"end",cls:"mannerFam"},{w:"alone",pl:"end",cls:"mannerFam"},{w:"remotely",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"at home",pl:"end",cls:"placeFam"},{w:"online",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"definitely",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than usual",pl:"end",cls:"compareFam"},{w:"meanwhile",pl:"end",cls:"seqFam"},{w:"in the meantime",pl:"end",cls:"seqFam"}
  ],
  future_perfeito: [
    {w:"by then",pl:"end",cls:"timePoint"},{w:"by next year",pl:"end",cls:"timePoint"},{w:"by the end of the month",pl:"end",cls:"timePoint"},{w:"by 2030",pl:"end",cls:"timePoint"},{w:"by tonight",pl:"end",cls:"timePoint"},{w:"by tomorrow",pl:"end",cls:"timePoint"},{w:"by the end of the year",pl:"end",cls:"timePoint"},{w:"by the time you arrive",pl:"end",cls:"timePoint"},
    {w:"all of them",pl:"end",cls:"allFam"},
    {w:"as planned",pl:"end",cls:"asFam"},
    {w:"by far",pl:"end",cls:"byFam"},{w:"at last",pl:"end",cls:"atFam"},
    {w:"from now on",pl:"end",cls:"fromFam"},{w:"on schedule",pl:"end",cls:"onFam"},
    {w:"over time",pl:"end",cls:"overFam"},{w:"once and for all",pl:"end",cls:"onceFam"},{w:"little by little",pl:"end",cls:"byFam"},
    {w:"about then",pl:"end",cls:"aboutFam"},
    {w:"at all",pl:"end",cls:"npiFam", only:["negativa","pergunta","pergunta_negativa"]},{w:"by the time we meet",pl:"end",cls:"timePoint"},{w:"by this time next year",pl:"end",cls:"timePoint"},{w:"before you know it",pl:"end",cls:"timePoint"},{w:"by the deadline",pl:"end",cls:"timePoint"},
    {w:"within a year",pl:"end",cls:"withinFam"},{w:"within budget",pl:"end",cls:"withinFam"},{w:"ahead of schedule",pl:"end",cls:"aheadFam"},{w:"to that point",pl:"end",cls:"toFam"},
    {w:"quite a bit",pl:"end",cls:"bitFam"},{w:"a fair bit",pl:"end",cls:"bitFam"},
    {w:"well",pl:"end",cls:"mannerFam"},{w:"successfully",pl:"end",cls:"mannerFam"},{w:"together",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},{w:"certainly",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than ever",pl:"end",cls:"compareFam"},{w:"better than before",pl:"end",cls:"compareFam"},{w:"first",pl:"end",cls:"seqFam"}
  ],
  future_perfeito_continuo: [
    {w:"by then",pl:"end",cls:"timePoint"},{w:"for five years",pl:"end",cls:"timePoint"},{w:"by next year",pl:"end",cls:"timePoint"},{w:"for over a decade",pl:"end",cls:"timePoint"},{w:"by next summer",pl:"end",cls:"timePoint"},{w:"by the end of the month",pl:"end",cls:"timePoint"},
    {w:"all year long",pl:"end",cls:"allFam"},{w:"all this time",pl:"end",cls:"allFam"},
    {w:"for good measure",pl:"end",cls:"forFam"},
    {w:"over the years",pl:"end",cls:"overFam"},{w:"day by day",pl:"end",cls:"byFam"},
    {w:"by this time next year",pl:"end",cls:"timePoint"},{w:"for quite some time",pl:"end",cls:"timePoint"},{w:"non-stop",pl:"end",cls:"timePoint"},
    {w:"all month long",pl:"end",cls:"allFam"},{w:"all winter long",pl:"end",cls:"allFam"},
    {w:"under pressure",pl:"end",cls:"underFam"},{w:"through it all",pl:"end",cls:"throughFam"},
    {w:"a bit longer",pl:"end",cls:"bitFam"},
    {w:"hard",pl:"end",cls:"mannerFam"},{w:"here",pl:"end",cls:"placeFam"},{w:"abroad",pl:"end",cls:"placeFam"},{w:"probably",pl:"mid",cls:"certaintyFam", only:["afirmativa","negativa"]},
    {w:"more than ever",pl:"end",cls:"compareFam"}
  ]
};

/* ================= v148: SUJEITOS ESTENDIDOS, PREDICADO E POSSESSIVO NO COMPLEMENTO =================
   O motor conjuga pelos 7 pronomes. Em vez de reescrever a conjugação, um sujeito estendido escolhe o pronome
   de CONCORDÂNCIA (My father → he · His parents → they · There is → it · There are → they) e, depois de a frase
   pronta, troca a 1ª ocorrência desse pronome pelo sujeito real — em inglês e em português. Assim todos os
   tempos, formatos, perguntas e a 2ª oração continuam valendo ("My father works because he needs…").
   state.suj: null | {t:'np', p:possessivo, n:substantivo} | {t:'one'} | {t:'exist', i} | {t:'imp', i}
   state.adj: índice do adjetivo em Ser/Estar · state.colPoss: null | 'suj' | 'my' | 'your' | … (determinante do complemento) */
const SUJ_POSS = [
  { k:'my', pt:['meu','minha','meus','minhas'] }, { k:'your', pt:['seu','sua','seus','suas'] },
  { k:'his', de:'dele' }, { k:'her', de:'dela' }, { k:'our', pt:['nosso','nossa','nossos','nossas'] },
  { k:'their', de:'deles' }, { k:"one's", de:'de cada um' } ];
/* ag = pronome de concordância; g/n = gênero e número em português */
const SUJ_NOMES = [
  { en:'father', ag:'He', pt:'pai', g:'m', n:'s' }, { en:'mother', ag:'She', pt:'mãe', g:'f', n:'s' },
  { en:'brother', ag:'He', pt:'irmão', g:'m', n:'s' }, { en:'sister', ag:'She', pt:'irmã', g:'f', n:'s' },
  { en:'son', ag:'He', pt:'filho', g:'m', n:'s' }, { en:'daughter', ag:'She', pt:'filha', g:'f', n:'s' },
  { en:'husband', ag:'He', pt:'marido', g:'m', n:'s' }, { en:'wife', ag:'She', pt:'esposa', g:'f', n:'s' },
  { en:'friend', ag:'He', pt:'amigo', g:'m', n:'s' }, { en:'boss', ag:'He', pt:'chefe', g:'m', n:'s' },
  { en:'parents', ag:'They', pt:'pais', g:'m', n:'p' }, { en:'children', ag:'They', pt:'filhos', g:'m', n:'p' },
  { en:'friends', ag:'They', pt:'amigos', g:'m', n:'p' }, { en:'colleagues', ag:'They', pt:'colegas', g:'m', n:'p' },
  { en:'team', ag:'It', pt:'equipe', g:'f', n:'s' }, { en:'company', ag:'It', pt:'empresa', g:'f', n:'s' },
  { en:'car', ag:'It', pt:'carro', g:'m', n:'s' }, { en:'dog', ag:'It', pt:'cachorro', g:'m', n:'s' } ];
/* q = substantivo para a pergunta de quantidade (How many + plural / How much + incontável) — v150 */
/* There is / There are: o que existe. pl = plural (→ are). ptAny = forma sem "algum" para negativa e pergunta (some → any) */
const SUJ_EXIST = [
  { en:'a problem', q:{ n:'problems', pt:'problemas', g:'m' }, pt:'um problema' }, { en:'a meeting', q:{ n:'meetings', pt:'reuniões', g:'f' }, pt:'uma reunião' }, { en:'a solution', q:{ n:'solutions', pt:'soluções', g:'f' }, pt:'uma solução' },
  { en:'a reason', q:{ n:'reasons', pt:'motivos', g:'m' }, pt:'um motivo' }, { en:'an opportunity', q:{ n:'opportunities', pt:'oportunidades', g:'f' }, pt:'uma oportunidade' }, { en:'a difference', q:{ n:'differences', pt:'diferenças', g:'f' }, pt:'uma diferença' },
  { en:'a lot of work', q:{ n:'work', pt:'trabalho', g:'m', inc:true }, pt:'muito trabalho' }, { en:'some time', q:{ n:'time', pt:'tempo', g:'m', inc:true }, pt:'algum tempo', ptAny:'tempo' }, { en:'enough money', q:{ n:'money', pt:'dinheiro', g:'m', inc:true }, pt:'dinheiro suficiente' },
  { en:'two options', q:{ n:'options', pt:'opções', g:'f' }, pt:'duas opções', pl:true }, { en:'many people', q:{ n:'people', pt:'pessoas', g:'f' }, pt:'muitas pessoas', pl:true },
  { en:'some questions', q:{ n:'questions', pt:'perguntas', g:'f' }, pt:'algumas perguntas', ptAny:'perguntas', pl:true }, { en:'several reasons', q:{ n:'reasons', pt:'motivos', g:'m' }, pt:'vários motivos', pl:true },
  { en:'a few problems', q:{ n:'problems', pt:'problemas', g:'m' }, pt:'alguns problemas', pl:true }, { en:'three meetings', q:{ n:'meetings', pt:'reuniões', g:'f' }, pt:'três reuniões', pl:true } ];
/* It impessoal: clima, hora, avaliação. v = verbo em português (ser/estar) */
const SUJ_IMP = [
  { en:'cold', pt:'frio', v:'estar' }, { en:'hot', pt:'quente', v:'estar' }, { en:'dark', pt:'escuro', v:'estar' },
  { en:'late', pt:'tarde', v:'ser' }, { en:'early', pt:'cedo', v:'ser' }, { en:'important', pt:'importante', v:'ser' },
  { en:'possible', pt:'possível', v:'ser' }, { en:'easy', pt:'fácil', v:'ser' }, { en:'difficult', pt:'difícil', v:'ser' }, { en:'true', pt:'verdade', v:'ser' } ];
/* adjetivos de Ser/Estar. O índice 0 (tired) é o comportamento histórico do motor. pt = [masc, fem, masc pl, fem pl] */
const ADJ_ESTADO = [
  { en:'tired', v:'estar', pt:['cansado','cansada','cansados','cansadas'] }, { en:'happy', v:'estar', pt:['feliz','feliz','felizes','felizes'] },
  { en:'busy', v:'estar', pt:['ocupado','ocupada','ocupados','ocupadas'] }, { en:'ready', v:'estar', pt:['pronto','pronta','prontos','prontas'] },
  { en:'late', v:'estar', pt:['atrasado','atrasada','atrasados','atrasadas'] }, { en:'sick', v:'estar', pt:['doente','doente','doentes','doentes'] },
  { en:'worried', v:'estar', pt:['preocupado','preocupada','preocupados','preocupadas'] },
  { en:'young', v:'ser', pt:['jovem','jovem','jovens','jovens'] }, { en:'old', v:'ser', pt:['velho','velha','velhos','velhas'] },
  { en:'tall', v:'ser', pt:['alto','alta','altos','altas'] }, { en:'smart', v:'ser', pt:['inteligente','inteligente','inteligentes','inteligentes'] },
  { en:'kind', v:'ser', pt:['gentil','gentil','gentis','gentis'] }, { en:'rich', v:'ser', pt:['rico','rica','ricos','ricas'] },
  { en:'famous', v:'ser', pt:['famoso','famosa','famosos','famosas'] } ];
/* verbo impessoal/de ligação em português, 3ª pessoa do singular, por tempo_aspecto */
const PT_3S = {
  haver:{ present_simples:'há', present_perfeito:'tem havido', past_simples:'havia', past_perfeito:'tinha havido', future_simples:'vai haver', future_perfeito:'vai ter havido' },
  ser:{ present_simples:'é', present_perfeito:'tem sido', past_simples:'era', past_perfeito:'tinha sido', future_simples:'vai ser', future_perfeito:'vai ter sido' },
  estar:{ present_simples:'está', present_perfeito:'tem estado', past_simples:'estava', past_perfeito:'tinha estado', future_simples:'vai estar', future_perfeito:'vai ter estado' } };
const PT_SER = { presente:{"1s":"sou","3s":"é","1p":"somos","3p":"são"}, imperf:{"1s":"era","3s":"era","1p":"éramos","3p":"eram"} };
/* núcleo "ser + adjetivo" espelhando ptStateParts (que usa estar) */
function ptSerCore(tempo, aspecto, per){
  if(tempo === 'present') return aspecto === 'simples' ? PT_SER.presente[per] : PT_TER.presente[per] + ' sido';
  if(tempo === 'past') return aspecto === 'simples' ? PT_SER.imperf[per] : PT_TER.imperf[per] + ' sido';
  return aspecto === 'simples' ? PT_ESTAR.ir[per] + ' ser' : PT_ESTAR.ir[per] + ' ter sido';
}
/* resolve state.suj num objeto pronto para uso (ou null). Estados antigos/inválidos caem em null. */
function sujAtivo(){
  const s = state.suj; if(!s || !s.t) return null;
  if(s.t === 'one') return { t:'one', rot:'One', en:'One', ag:'He', ptNP:'a pessoa', g:'f', n:'s', poss:"one's" };
  if(s.t === 'np'){
    const P = SUJ_POSS.find(x => x.k === s.p), N = SUJ_NOMES.find(x => x.en === s.n); if(!P || !N) return null;
    const i = (N.g === 'm' ? 0 : 1) + (N.n === 'p' ? 2 : 0), art = ['o','a','os','as'][i];
    const ptNP = P.pt ? P.pt[i] + ' ' + N.pt : art + ' ' + N.pt + ' ' + P.de;
    const en = cap(P.k) + ' ' + N.en;
    return { t:'np', rot:en, en, ag:N.ag, ptNP, g:N.g, n:N.n, poss:O2_POSS[N.ag] };
  }
  if(s.t === 'exist'){ const N = SUJ_EXIST[s.i]; return N ? { t:'exist', rot:N.pl ? 'There + be (plural)' : 'There + be (singular)', ag:N.pl ? 'They' : 'It', np:N } : null; }
  if(s.t === 'imp'){ const N = SUJ_IMP[s.i]; return N ? { t:'imp', rot:'It (impessoal)', ag:'It', pred:N } : null; }
  return null;
}
function adjAtivo(){ return ADJ_ESTADO[state.adj] || ADJ_ESTADO[0]; }
const SUJ_RE = { He:/\b[Hh]e\b/, She:/\b[Ss]he\b/, It:/\b[Ii]t\b/, They:/\b[Tt]hey\b/ };
const SUJ_RE_PT = { He:/\b[Ee]le\b/, She:/\b[Ee]la\b/, It:/\b[Ee]le\/ela\b/, They:/\b[Ee]les\/elas\b/ };
/* troca a 1ª ocorrência do pronome de concordância pelo sujeito real, respeitando a maiúscula inicial */
function sujTroca1(txt, re, novo){
  return txt.replace(re, m => /^[A-Z]/.test(m) ? cap(novo) : lowerFirst(novo));
}
/* INGLÊS: aplica sujeito estendido e predicado sobre a frase já montada (com marcas de cor) */
function sujEN(raw, formato, semSujeito){
  const suj = sujAtivo(), ehState = state.categoria === 'state';
  if(suj && !semSujeito){
    if(suj.t === 'np') raw = sujTroca1(raw, SUJ_RE[suj.ag], suj.en);
    else if(suj.t === 'one') raw = raw.replace(/\bHe\b/g, 'One').replace(/\bhe\b/g, 'one').replace(/\b[Hh]is\b/g, m => m[0] === 'H' ? "One's" : "one's").replace(/\bhimself\b/g, 'oneself').replace(/\bhim\b/g, 'one');
    else if(suj.t === 'exist') raw = sujTroca1(raw, SUJ_RE[suj.ag], 'there');
  }
  if(ehState){
    if(suj && suj.t === 'exist'){
      /* some → any em negativas e perguntas: "There aren't any questions" */
      const naoAf = formato !== 'afirmativa';
      raw = raw.replace(/\btired\b/, naoAf ? suj.np.en.replace(/^some /, 'any ') : suj.np.en);
    } else if(suj && suj.t === 'imp') raw = raw.replace(/\btired\b/, suj.pred.en);
    else if(state.adj) raw = raw.replace(/\btired\b/g, adjAtivo().en);
  }
  return raw;
}
/* PORTUGUÊS: mesmo ajuste sobre a tradução pronta. ctx = { tempo, aspecto, formato } */
function sujPT(pt, ctx, semSujeito){
  const suj = sujAtivo(), ehState = state.categoria === 'state', chave = ctx.tempo + '_' + ctx.aspecto;
  const limpa = t => { t = t.replace(/\s{2,}/g, ' ').replace(/^\s+/, ''); return t.replace(/(^|, )([a-zà-ú])/, (m, a, b) => a ? m : b.toUpperCase()).replace(/^([a-zà-ú])/, m => m.toUpperCase()); };
  if(ehState && suj && (suj.t === 'exist' || suj.t === 'imp')){
    /* sem sujeito em português: "Há um problema" · "Está frio" · "É importante" */
    const coreVelho = ptStateParts(ctx.tempo, ctx.aspecto, suj.ag).core;
    const naoAf = ctx.formato !== 'afirmativa';
    const novo = suj.t === 'exist' ? PT_3S.haver[chave] + ' ' + (naoAf && suj.np.ptAny ? suj.np.ptAny : suj.np.pt) : PT_3S[suj.pred.v][chave] + ' ' + suj.pred.pt;
    if(pt.includes(coreVelho)){ pt = pt.replace(coreVelho, novo).replace(SUJ_RE_PT[suj.ag], '').replace(/ ,/g, ','); return limpa(pt); }
    return pt;
  }
  /* adjetivo: concordância com o sujeito real (ou com o pronome) e ser × estar */
  if(ehState && (state.adj || (suj && !semSujeito))){
    const A = adjAtivo(), pr = ctx.pr || state.pronome, per = ptPerson(pr);
    let forma;
    if(suj && !semSujeito) forma = A.pt[(suj.g === 'm' ? 0 : 1) + (suj.n === 'p' ? 2 : 0)];
    else if(pr === 'He') forma = A.pt[0]; else if(pr === 'She') forma = A.pt[1];
    else { const pl = (pr === 'We' || pr === 'They'), m = A.pt[pl ? 2 : 0], f = A.pt[pl ? 3 : 1]; forma = m === f ? m : (pl ? m + '(as)' : m + '(a)'); }
    if(A.v === 'ser'){
      const coreVelho = ptStateParts(ctx.tempo, ctx.aspecto, pr).core.replace(/ cansad[oa](\(a\))?$/, '');
      if(pt.includes(coreVelho)) pt = pt.replace(coreVelho, ptSerCore(ctx.tempo, ctx.aspecto, per));
    }
    pt = pt.replace(/cansad[oa](\(a\))?/g, forma);
  }
  if(suj && !semSujeito){
    if(suj.t === 'np') pt = sujTroca1(pt, SUJ_RE_PT[suj.ag], suj.ptNP);
    else if(suj.t === 'one') pt = sujTroca1(pt, SUJ_RE_PT.He, 'a pessoa').replace(/\b[Ee]le\b/g, m => m[0] === 'E' ? 'Ela' : 'ela').replace(/\bdele\b/g, 'dela');
  }
  return pt;
}
/* ---- possessivo no complemento: "park the car" → "park his car" ---- */
const COL_DET = /\b(the|a|an|my|your|his|her|its|our|their)\b/;
function colPossDoSujeito(){
  const suj = sujAtivo();
  if(suj && (suj.t === 'np' || suj.t === 'one')) return suj.poss;
  return O2_POSS[state.pronome] || 'their';
}
/* v152: complemento atual do verbo principal — uma colocação cadastrada OU um complemento livre vindo da caixa
   "escrever em português" (state.colLivre = { en, pt, para:idDoVerbo }) */
function colAtual(verb){
  if(!verb) return null;
  if(state.colocacao !== null) return (verb.col || [])[state.colocacao] || null;
  return (state.colLivre && state.colLivre.para === verb.id) ? state.colLivre : null;
}
function colPodePoss(col){ return !!(col && col.en && COL_DET.test(col.en)); }
/* devolve uma cópia da colocação com o determinante trocado (ou a própria, se nada a trocar) */
function colComPoss(col){
  if(!col || !state.colPoss || !colPodePoss(col)) return col;
  const doSuj = colPossDoSujeito(), poss = state.colPoss === 'suj' ? doSuj : state.colPoss, mesmo = poss === doSuj;
  const en = col.en.replace(COL_DET, poss);
  /* português: acha o 1º determinante (artigo, possessivo ou contração) e descobre gênero/número por ele */
  const DET = { o:['','m','s'], a:['','f','s'], os:['','m','p'], as:['','f','p'], um:['','m','s'], uma:['','f','s'], uns:['','m','p'], umas:['','f','p'],
    meu:['','m','s'], minha:['','f','s'], meus:['','m','p'], minhas:['','f','p'], seu:['','m','s'], sua:['','f','s'], seus:['','m','p'], suas:['','f','p'],
    no:['em ','m','s'], na:['em ','f','s'], nos:['em ','m','p'], nas:['em ','f','p'], do:['de ','m','s'], da:['de ','f','s'], dos:['de ','m','p'], das:['de ','f','p'],
    pelo:['por ','m','s'], pela:['por ','f','s'], pelos:['por ','m','p'], pelas:['por ','f','p'], ao:['a ','m','s'], 'à':['a ','f','s'], aos:['a ','m','p'], 'às':['a ','f','p'],
    num:['em ','m','s'], numa:['em ','f','s'] };
  let pt = (col.pt || '').replace(/ (dele|dela|deles|delas)\b/, '');
  const pal = pt.split(' '), ix = pal.findIndex(w => DET[w.toLowerCase()]);
  if(ix >= 0){
    if(/^(meu|minha|meus|minhas|seu|sua|seus|suas|nosso|nossa|nossos|nossas)$/i.test(pal[ix + 1] || '')) pal.splice(ix + 1, 1);   /* "o meu melhor" → um só determinante */
    const d = DET[pal[ix].toLowerCase()], i = (d[1] === 'm' ? 0 : 1) + (d[2] === 'p' ? 2 : 0);
    const FORMAS = { my:['meu','minha','meus','minhas'], your:['seu','sua','seus','suas'], our:['nosso','nossa','nossos','nossas'] };
    const SEU = ['seu','sua','seus','suas'], ART = ['o','a','os','as'], DE = { his:'dele', her:'dela', its:'dele', their:'deles', "one's":'de cada um' };
    if(FORMAS[poss]) pal[ix] = d[0] + FORMAS[poss][i];
    else if(mesmo) pal[ix] = d[0] + SEU[i];                            /* dono = sujeito: "Meu pai estacionou seu carro" */
    else {                                                            /* dono é outra pessoa: "o carro dele" */
      const contr = { 'em ':['no','na','nos','nas'], 'de ':['do','da','dos','das'], 'por ':['pelo','pela','pelos','pelas'], 'a ':['ao','à','aos','às'] };
      pal[ix] = d[0] ? contr[d[0]][i] : ART[i];
      if(pal[ix + 1] !== undefined) pal[ix + 1] += ' ' + DE[poss];
    }
    pt = pal.join(' ');
  }
  return Object.assign({}, col, { en, pt });
}
/* ---- notas explicativas das estruturas novas ---- */
function sujNota(){
  const suj = sujAtivo(); if(!suj) return '';
  if(suj.t === 'exist') return '<b>There is / There are</b> indica que algo <b>existe</b>. "There" só ocupa o lugar do sujeito: quem manda na concordância é o substantivo que vem depois (<i>a problem</i> → is · <i>two options</i> → are). Em português não há sujeito: usa-se <b>há</b> (ou "tem"). Em negativas e perguntas, <i>some</i> vira <i>any</i>.';
  if(suj.t === 'imp') return '<b>It impessoal</b>: o inglês não aceita frase sem sujeito, então usa <b>it</b> como sujeito vazio para clima, hora, distância e avaliações (<i>It is cold · It is late · It is important</i>). Em português a frase fica sem sujeito: "Está frio", "É importante".';
  if(suj.t === 'one') return '<b>One</b> é o sujeito genérico formal ("a pessoa", "a gente"); concorda como <i>he</i> e o possessivo é <b>one\'s</b>. Nos dicionários, <i>one\'s</i> marca o lugar do possessivo: <i>do one\'s best</i> → <i>do my best / do his best</i>.';
  return 'Sujeito = <b>possessivo + substantivo</b>. O possessivo concorda com o <b>dono</b>, não com a coisa possuída: <i>his parents</i> (dono homem), <i>her parents</i> (dona mulher). O verbo concorda com o substantivo: <i>My father works</i> (he) · <i>His parents work</i> (they). Na 2ª menção o inglês retoma com o pronome.';
}
/* garante coerência antes de montar a frase */
function sujGuarda(){
  const suj = sujAtivo();
  if(state.suj && !suj) state.suj = null;
  if(suj){
    if((suj.t === 'exist' || suj.t === 'imp') && state.categoria !== 'state') state.suj = null;
    else if(state.pronome !== suj.ag) state.pronome = suj.ag;
  }
  if(!(state.adj >= 0 && ADJ_ESTADO[state.adj])) state.adj = 0;
  /* v152: o complemento livre vale só para o verbo em que foi digitado e some quando uma colocação é escolhida */
  if(state.colLivre && (typeof state.colLivre !== 'object' || !state.colLivre.en || state.colLivre.para !== state.verbo || state.colocacao !== null || state.categoria !== 'fact')) state.colLivre = null;
  const POSS_OK = ['suj','my','your','his','her','its','our','their'];
  if(state.colPoss && !POSS_OK.includes(state.colPoss)) state.colPoss = null;
  if(state.formato === 'pergunta' && state.whWord){
    const verb = state.categoria === 'fact' ? verbById(state.verbo) : null;
    const conhecida = WH_SUBJECT.concat(WH_ADJUNCT, WH_ADJ_MAIS, WH_OBJETO, WH_PREP_FIM, WH_ESPECIAIS, WH_QUANTITY).includes(state.whWord);
    if(!conhecida || !whDisponivel(state.whWord, state.categoria, verb, sujAtivo())) state.whWord = null;
  }
  /* v149: a moldura só vale para a interrogativa a que pertence (e, se usa verbo, só em Ação/Fato) */
  if(state.whMolde && !(state.formato === 'pergunta' && state.whWord && whMoldesDisponiveis(state.whWord, state.categoria).some(m => m.k === state.whMolde))) state.whMolde = null;
}
/* ---- dial ①: outros sujeitos ---- */
let sujAberto = null, sujMais = false;      /* 'np' | 'exist' | 'imp' — qual lista está aberta (não é persistido) */
function buildSuj(){
  const el = document.getElementById('sujRow'); if(!el) return;
  el.innerHTML = '';
  const suj = sujAtivo(), modo = suj ? (suj.t === 'one' ? 'one' : suj.t) : sujAberto;
  const linha = rot => { if(rot){ const l = document.createElement('div'); l.className = 'wh-group-label'; l.textContent = rot; el.appendChild(l); } const w = document.createElement('div'); w.className = 'signal-row-inner wrap-row'; el.appendChild(w); return w; };
  const chip = (wrap, txt, on, fn) => { const c = document.createElement('div'); c.className = 'signal-chip'; c.dataset.active = String(!!on); c.textContent = txt; c.onclick = fn; wrap.appendChild(c); return c; };
  const estado = () => { state.categoria = 'state'; if(!CATEGORIES.state.aspects.includes(state.aspecto)) state.aspecto = 'simples'; state.signalMids = []; state.signalEnds = []; state.signalSplit = null; };
  /* v156: sem sujeito estendido, a linha fica recolhida num chip só */
  if(!suj && !sujAberto && !sujMais){
    const w0 = linha(null);
    chip(w0, '＋ Outros sujeitos…', false, () => { sujMais = true; render(); }).title = 'my father, his parents · There is / There are · It is cold · One';
    return;
  }
  const topo = linha('Outros sujeitos');
  if(!suj) chip(topo, '− fechar', false, () => { sujMais = false; sujAberto = null; render(); });
  chip(topo, 'Possessivo + nome (my father…)', modo === 'np', () => { if(suj && suj.t === 'np'){ state.suj = null; sujAberto = null; } else { state.suj = { t:'np', p:'my', n:'father' }; sujAberto = 'np'; } render(); });
  chip(topo, 'There is / There are', modo === 'exist', () => { if(suj && suj.t === 'exist'){ state.suj = null; sujAberto = null; } else { estado(); state.suj = { t:'exist', i:0 }; sujAberto = 'exist'; } render(); });
  chip(topo, 'It impessoal (It is cold)', modo === 'imp', () => { if(suj && suj.t === 'imp'){ state.suj = null; sujAberto = null; } else { estado(); state.suj = { t:'imp', i:0 }; sujAberto = 'imp'; } render(); });
  chip(topo, 'One (genérico)', modo === 'one', () => { state.suj = (suj && suj.t === 'one') ? null : { t:'one' }; sujAberto = null; render(); });
  if(suj && suj.t === 'np'){
    const a = linha('Possessivo (concorda com o dono)');
    SUJ_POSS.forEach(P => chip(a, cap(P.k), state.suj.p === P.k, () => { state.suj = { t:'np', p:P.k, n:state.suj.n }; render(); }));
    const b = linha('Substantivo (manda no verbo)');
    SUJ_NOMES.forEach(N => chip(b, N.en, state.suj.n === N.en, () => { state.suj = { t:'np', p:state.suj.p, n:N.en }; render(); }));
  } else if(suj && suj.t === 'exist'){
    const a = linha('Singular → There is');
    SUJ_EXIST.forEach((N, i) => { if(!N.pl) chip(a, N.en, state.suj.i === i, () => { state.suj = { t:'exist', i }; render(); }); });
    const b = linha('Plural → There are');
    SUJ_EXIST.forEach((N, i) => { if(N.pl) chip(b, N.en, state.suj.i === i, () => { state.suj = { t:'exist', i }; render(); }); });
  } else if(suj && suj.t === 'imp'){
    const a = linha('Clima, hora e avaliação');
    SUJ_IMP.forEach((N, i) => chip(a, N.en, state.suj.i === i, () => { state.suj = { t:'imp', i }; render(); }));
  }
}
/* ---- dial ③ em Ser/Estar: o adjetivo ---- */
function buildAdj(){
  const g = document.getElementById('adjDialGroup'), el = document.getElementById('adjRow'); if(!g || !el) return;
  const suj = sujAtivo(), mostra = state.categoria === 'state' && !(suj && (suj.t === 'exist' || suj.t === 'imp'));
  g.style.display = mostra ? '' : 'none'; el.innerHTML = '';
  if(!mostra) return;
  ADJ_ESTADO.forEach((A, i) => { const c = document.createElement('div'); c.className = 'signal-chip'; c.dataset.active = String((state.adj || 0) === i); c.textContent = A.en; c.title = A.pt[0] + ' (' + A.v + ')'; c.onclick = () => { state.adj = i; render(); }; el.appendChild(c); });
}
/* ---- dial ④: determinante do complemento ---- */
function buildColPoss(){
  const el = document.getElementById('colPossRow'); if(!el) return;
  el.innerHTML = '';
  if(state.categoria !== 'fact' || o2Foco() === 2) return;
  const verb = verbById(state.verbo), col = colAtual(verb);
  if(state.colLivre && col === state.colLivre){   /* v152: complemento que veio da caixa "escrever em português" */
    const l0 = document.createElement('div'); l0.className = 'wh-group-label'; l0.textContent = 'Complemento digitado (fora das colocações do verbo)'; el.appendChild(l0);
    const w0 = document.createElement('div'); w0.className = 'signal-row-inner wrap-row'; el.appendChild(w0);
    const c0 = document.createElement('div'); c0.className = 'signal-chip'; c0.dataset.active = 'true'; c0.id = 'colLivreChip'; c0.textContent = col.en + ' ✕'; c0.title = 'Remover'; c0.onclick = () => { state.colLivre = null; render(); }; w0.appendChild(c0);
  }
  if(!colPodePoss(col)) return;
  const l = document.createElement('div'); l.className = 'wh-group-label'; l.textContent = 'Determinante do complemento (possessivo)'; el.appendChild(l);
  const w = document.createElement('div'); w.className = 'signal-row-inner wrap-row'; el.appendChild(w);
  const chip = (txt, k) => { const c = document.createElement('div'); c.className = 'signal-chip'; c.dataset.active = String((state.colPoss || null) === k); c.textContent = txt; c.onclick = () => { state.colPoss = k; render(); }; w.appendChild(c); };
  chip('como está', null);
  chip('↺ do sujeito (' + colPossDoSujeito() + ')', 'suj');
  ['my','your','his','her','its','our','their'].forEach(p => chip(p, p));
}
/* ================= v149: ESTRUTURAS LIGADAS À INTERROGATIVA (molduras) =================
   Algumas perguntas vêm com uma moldura própria: How long → "does it take… to", How much → "does it cost… to",
   What → "is it like to", How/What → "about + -ing". A moldura é conjugada no tempo e aspecto do motor (o sujeito
   é o IT impessoal); a pessoa escolhida no dial ① entra como objeto ("take YOU", "take MY FATHER") e o verbo do
   dial ③ entra no infinitivo ou no gerúndio. state.whMolde guarda a moldura (null = pergunta direta). */
const WH_OBJ_PRON = { I:'me', You:'you', He:'him', She:'her', It:'it', We:'us', They:'them' };
/* verbos de apoio das molduras em português (3ª pessoa do singular; ptFactParts cuida do tempo e do aspecto) */
PT_VERBS.__levar = { presente:{"1s":"leva","3s":"leva","1p":"leva","3p":"leva"}, pperf:{"1s":"levou","3s":"levou","1p":"levou","3p":"levou"}, ger:"levando", part:"levado", inf:"levar" };
PT_VERBS.__custar = { presente:{"1s":"custa","3s":"custa","1p":"custa","3p":"custa"}, pperf:{"1s":"custou","3s":"custou","1p":"custou","3p":"custou"}, ger:"custando", part:"custado", inf:"custar" };
const PT_3S_MOLDE = {
  ficar:{ present_simples:'fica', present_perfeito:'tem ficado', past_simples:'ficava', past_perfeito:'tinha ficado', future_simples:'vai ficar', future_perfeito:'vai ter ficado' },
  horas:{ present_simples:'são', present_perfeito:'têm sido', past_simples:'eram', past_perfeito:'tinham sido', future_simples:'vão ser', future_perfeito:'vão ter sido' },
  custar:{ present_simples:'custa', present_perfeito:'tem custado', past_simples:'custava', past_perfeito:'tinha custado', future_simples:'vai custar', future_perfeito:'vai ter custado' } };
/* k = chave · rot = rótulo do chip · precisaVerbo = usa o verbo do dial ③ (só em Ação/Fato) */
const WH_MOLDES = {
  "How long": [
    { k:'take', rot:'does it take … to + verbo', precisaVerbo:true, whPt:'Quanto tempo',
      nota:'<b>How long does it take (you) to…?</b> pergunta quanto tempo algo <b>leva</b>. O sujeito é o <b>it</b> impessoal, quem faz a ação entra como objeto (<i>take me / take him</i>) e o verbo vai para o infinitivo com <b>to</b>. Resposta: <i>It takes (me) two hours to…</i>' },
    { k:'since', rot:'has it been since …', precisaVerbo:true,
      nota:'<b>How long has it been since…?</b> pergunta há quanto tempo algo aconteceu pela última vez. A moldura é fixa (present perfect) e a oração depois de <b>since</b> vai no <b>passado simples</b>. Em português: "Quanto tempo faz desde que…?"' } ],
  "How many hours": [
    { k:'take', rot:'does it take … to + verbo', precisaVerbo:true, whPt:'Quantas horas',
      nota:'<b>How many hours does it take (you) to…?</b> é a mesma moldura de <i>How long does it take</i>, com a duração já medida em horas. Sujeito <b>it</b> impessoal + objeto + <b>to</b> + verbo.' } ],
  "How much": [
    { k:'cost', rot:'does it cost … to + verbo', precisaVerbo:true,
      nota:'<b>How much does it cost (you) to…?</b> pergunta o <b>custo</b> de fazer algo. Mesma arquitetura de <i>it takes</i>: <b>it</b> impessoal + objeto opcional + <b>to</b> + verbo.' },
    { k:'isit', rot:'is it? (preço)', tab:'custar', whPt:'Quanto',
      nota:'<b>How much is it?</b> pergunta o <b>preço</b>. O inglês usa <b>be</b>; o português usa "custar" ("Quanto custa?").' } ],
  "How far": [
    { k:'isit', rot:'is it? (distância)', tab:'ficar', whPt:'A que distância',
      nota:'<b>How far is it?</b> pergunta a <b>distância</b> até um lugar, com o <b>it</b> impessoal. Para completar: <i>How far is it from here / to the station?</i>' } ],
  "What time": [
    { k:'isit', rot:'is it? (hora)', tab:'horas', whPt:'Que horas',
      nota:'<b>What time is it?</b> pergunta as <b>horas</b>, com o <b>it</b> impessoal. Em português o verbo vai para o plural ("Que horas são?"); em inglês é sempre singular: <i>It is five o\'clock</i>.' } ],
  "How": [
    { k:'about', rot:'about + verbo-ing (sugestão)', precisaVerbo:true, ptIni:'Que tal',
      nota:'<b>How about + -ing?</b> faz uma <b>sugestão</b>. Não tem sujeito nem tempo verbal: depois da preposição <b>about</b> o verbo vai sempre para o <b>-ing</b>.' } ],
  "What": [
    { k:'like', rot:'is it like to + verbo', precisaVerbo:true,
      nota:'<b>What is it like to…?</b> pede uma <b>descrição da experiência</b> ("Como é…?"). Atenção: aqui <b>like</b> é preposição ("parecido com"), não o verbo gostar; por isso a pergunta começa com <i>What</i>, e não com <i>How</i>.' },
    { k:'takeO', rot:'does it take to + verbo', precisaVerbo:true,
      nota:'<b>What does it take to…?</b> pergunta o que é <b>necessário</b> para conseguir algo ("O que é preciso para…?"). É o mesmo <i>it takes</i> de duração, agora medindo esforço ou requisito.' },
    { k:'about', rot:'about + verbo-ing', precisaVerbo:true, ptIni:'E quanto a',
      nota:'<b>What about + -ing?</b> propõe uma alternativa ou devolve a pergunta ("E quanto a…?"). Depois de <b>about</b>, verbo em <b>-ing</b>; sem sujeito e sem tempo verbal.' } ],
  "Why": [
    { k:'not', rot:'not + verbo (sugestão)', precisaVerbo:true,
      nota:'<b>Why not + verbo na forma base?</b> é uma sugestão curta, sem sujeito e sem auxiliar: <i>Why not try?</i> Equivale a <i>Why don\'t you…?</i>' } ]
};
function whMoldeDe(w, k){ return (WH_MOLDES[w] || []).find(m => m.k === k) || null; }
function whMoldesDisponiveis(w, cat){ return (WH_MOLDES[w] || []).filter(m => !m.precisaVerbo || cat === 'fact'); }
/* infinitivo pessoal do português: "para nós trabalharmos", "para eles trabalharem" (flexiona só a 1ª palavra) */
function ptInfPessoal(inf, per){
  const suf = per === '1p' ? 'mos' : per === '3p' ? 'em' : '';
  if(!suf) return inf;
  const p = inf.split(' '); p[0] += suf; return p.join(' ');
}
function whMoldeGerar(m, cat, tempo, aspecto, pronoun, whWord, verb, col){
  const X = WH_X[whWord] || {}, palavra = X.w || whWord, suj = sujAtivo();
  const np = suj && (suj.t === 'np' || suj.t === 'one') ? suj : null;
  const v = verb || verbById('work'), baseV = v.base + (v.prt ? ' ' + v.prt : ''), ingV = v.ing + (v.prt ? ' ' + v.prt : '');
  const vpt = PT_VERBS[v.id] || PT_VERBS.work, per = np ? (np.n === 'p' ? '3p' : '3s') : ptPerson(pronoun);
  const objEN = np ? (np.t === 'one' ? 'one' : lowerFirst(np.en)) : WH_OBJ_PRON[pronoun];      /* quem faz a ação entra como objeto */
  const sujPTtxt = np ? np.ptNP : PT_PRONOUN[pronoun];
  const asp2 = /perfeito/.test(aspecto) ? 'perfeito' : 'simples', chave2 = tempo + '_' + asp2;      /* molduras com be: só simples/perfeito */
  const fecha = raw => raw + M('?');
  /* v150: o complemento do dial ④ acompanha o verbo da moldura ("…to park the car") */
  const cEN = col ? ' ' + REG_OPEN + col.en + REG_CLOSE : '', cPT = col ? ' ' + col.pt : '', cEst = col ? ' + complemento' : '';
  let raw, pt, structure;
  if(m.k === 'take' || m.k === 'cost'){
    const apoio = m.k === 'take' ? 'take' : 'cost', g = generate('fact', tempo, aspecto, 'pergunta', 'It', verbById(apoio));
    raw = fecha(M(palavra) + ' ' + lowerFirstMarked(g.text) + ' ' + objEN + ' to ' + baseV + cEN);
    const core = ptFactParts(tempo, aspecto, 'It', m.k === 'take' ? '__levar' : '__custar').core;
    pt = (m.k === 'take' ? m.whPt : 'Quanto') + ' ' + core + ' para ' + sujPTtxt + ' ' + ptInfPessoal(vpt.inf, per) + cPT + '?';
    structure = `${palavra} + auxiliar + it + ${apoio} + objeto + to + verbo — it impessoal`;
  } else if(m.k === 'takeO'){
    const g = generate('fact', tempo, aspecto, 'pergunta', 'It', verbById('take'));
    raw = fecha(M(palavra) + ' ' + lowerFirstMarked(g.text) + ' to ' + baseV + cEN);
    pt = 'O que ' + PT_3S.ser[chave2] + ' preciso para ' + vpt.inf + cPT + '?';
    structure = 'What + auxiliar + it + take + to + verbo — o que é necessário';
  } else if(m.k === 'since'){
    const cl = sujEN(applySignal(generate('fact', 'past', 'simples', 'afirmativa', pronoun, v).text, null, [], col || null, null, 'afirmativa'), 'afirmativa');
    raw = fecha(M(palavra) + ' ' + M('has') + ' it ' + M('been') + ' since ' + (pronoun === 'I' && !np ? cl : lowerFirstMarked(cl)));
    const clPT = sujPT(translate('fact', 'past', 'simples', 'afirmativa', pronoun, null, [], v.id, col || null), { tempo:'past', aspecto:'simples', formato:'afirmativa', pr:pronoun }).replace(/\.$/, '');
    pt = 'Quanto tempo faz desde que ' + lowerFirst(clPT) + '?';
    structure = 'How long + has it been + since + oração no passado simples — moldura de tempo fixo';
  } else if(m.k === 'isit'){
    const g = generate('state', tempo, asp2, 'pergunta', 'It', null);
    raw = fecha(M(palavra) + ' ' + lowerFirstMarked(g.text.replace(/ tired/, '')));
    pt = m.whPt + ' ' + PT_3S_MOLDE[m.tab][chave2] + '?';
    structure = `${palavra} + be + it — it impessoal`;
  } else if(m.k === 'like'){
    const g = generate('state', tempo, asp2, 'pergunta', 'It', null);
    raw = fecha(M(palavra) + ' ' + lowerFirstMarked(g.text.replace(/ tired/, '')) + ' like to ' + baseV + cEN);
    pt = 'Como ' + PT_3S.ser[chave2] + ' ' + vpt.inf + cPT + '?';
    structure = 'What + be + it + like + to + verbo — descrição de uma experiência';
  } else if(m.k === 'about'){
    raw = fecha(M(palavra + ' about') + ' ' + ingV + cEN);
    pt = m.ptIni + ' ' + vpt.inf + cPT + '?';
    structure = `${palavra} about + verbo-ing — sem sujeito e sem tempo verbal`;
  } else {   /* not */
    raw = fecha(M(palavra + ' not') + ' ' + baseV + cEN);
    pt = 'Por que não ' + vpt.inf + cPT + '?';
    structure = 'Why not + verbo na forma base — sugestão, sem sujeito e sem auxiliar';
  }
  if(m.precisaVerbo) structure += cEst;
  return { en: stripMarks(raw), enMarked: raw, pt, structure, isStatic:false, molde:true, nota:m.nota };
}
/* ================= v151: ESCREVER EM PORTUGUÊS → MOTOR =================
   Caixa de texto: o usuário escreve em português e o app lê a frase (sujeito, negação, pergunta, interrogativa,
   tempo/aspecto pelo verbo e auxiliares, complemento, palavras-sinal) e a converte num ESTADO do motor. O inglês
   mostrado é o que o próprio motor gera para esse estado — por isso "Adicionar ao motor" é só aplicar o estado.
   Funciona offline e só entende o que o motor sabe montar (verbos, complementos e sinais cadastrados); o que
   não for reconhecido é listado, nunca inventado. */
const ptxN = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
const PTX_ESTAR = { estou:['pres','1s'], esta:['pres','3s'], estamos:['pres','1p'], estao:['pres','3p'], estava:['imperf','3s'], estavamos:['imperf','1p'], estavam:['imperf','3p'], estive:['pperf','1s'], esteve:['pperf','3s'], estivemos:['pperf','1p'], estiveram:['pperf','3p'] };
const PTX_SER = { sou:['pres','1s'], e:['pres','3s'], somos:['pres','1p'], sao:['pres','3p'], era:['imperf','3s'], eramos:['imperf','1p'], eram:['imperf','3p'], fui:['pperf','1s'], foi:['pperf','3s'], fomos:['pperf','1p'], foram:['pperf','3p'] };
const PTX_IR = { vou:'1s', vai:'3s', vamos:'1p', vao:'3p' };
const PTX_TER = { tenho:['pres','1s'], tem:['pres','3s'], temos:['pres','1p'], tinha:['imperf','3s'], tinhamos:['imperf','1p'], tinham:['imperf','3p'] };
const PTX_PRON = { eu:['I','1s'], voce:['You','3s'], tu:['You','3s'], ele:['He','3s'], ela:['She','3s'], nos:['We','1p'], eles:['They','3p'], elas:['They','3p'], voces:['You','3p'] };
/* interrogativas em português (mais longas primeiro) → chave do motor */
const PTX_WH = [
  ['por quanto tempo','How long'], ['ha quanto tempo','How long'], ['quanto tempo','How long'], ['com que frequencia','How often'], ['a que distancia','How far'],
  ['a que horas','What time'], ['que horas','What time'], ['quantas vezes','How many times'], ['quantas horas','How many hours'], ['quantos anos','How old'],
  ['desde quando','Since when'], ['ate quando','Until when'], ['ate onde','How far'], ['com quem','Who … with'], ['para que','What … for'], ['pra que','What … for'],
  ['como e que','How come'], ['por que','Why'], ['porque','Why'], ['o que','What'], ['onde','Where'], ['quando','When'], ['como','How'], ['quanto','How much'], ['quem','Who'], ['qual','Which one'] ];
let _ptxIdx = null;
/* índice reverso: 1ª palavra da forma portuguesa → [{ seq, id, kind, per }] */
function ptxIndice(){
  if(_ptxIdx) return _ptxIdx;
  const F = {}, ordem = {}; VERBS.forEach((v, i) => { ordem[v.id] = i; });
  const add = (forma, id, kind, per) => { const seq = ptxN(forma).split(' '); if(!seq[0]) return; (F[seq[0]] = F[seq[0]] || []).push({ seq, id, kind, per }); };
  Object.keys(PT_VERBS).forEach(id => {
    const v = PT_VERBS[id], apoio = id.indexOf('__') === 0; if(!apoio && !(id in ordem)) return;
    ['1s','3s','1p','3p'].forEach(p => { add(v.presente[p], id, 'pres', p); add(v.pperf[p], id, 'pperf', p); if(!apoio){ const im = ptImperf(id, p); if(im) add(im, id, 'imperf', p); } });
    add(v.ger, id, 'ger'); add(v.part, id, 'part'); add(v.inf, id, 'inf');
    const p0 = v.inf.split(' '), cauda = p0.slice(1).join(' '), j = h => cauda ? h + ' ' + cauda : h;
    add(j(p0[0] + 'ei'), id, 'fut', '1s'); add(j(p0[0] + 'á'), id, 'fut', '3s'); add(j(p0[0] + 'emos'), id, 'fut', '1p'); add(j(p0[0] + 'ão'), id, 'fut', '3p');
    add(j(p0[0] + 'mos'), id, 'inf'); add(j(p0[0] + 'em'), id, 'inf');            /* infinitivo pessoal: trabalharmos, trabalharem */
    if(apoio) add(id === '__levar' ? 'levava' : 'custava', id, 'imperf', '3s');
  });
  if('live' in ordem){ [['mora','pres','3s'], ['moram','pres','3p'], ['moro','pres','1s'], ['moramos','pres','1p'], ['morava','imperf','3s'], ['morou','pperf','3s']].forEach(x => add(x[0], 'live', x[1], x[2])); }   /* v161: "onde ela mora" */
  const adj = {}; ADJ_ESTADO.forEach((A, i) => A.pt.forEach(f => { if(!(ptxN(f) in adj)) adj[ptxN(f)] = i; }));
  const imp = {}; SUJ_IMP.forEach((A, i) => { imp[ptxN(A.pt)] = i; });
  /* sujeitos com possessivo: "meu pai", "o pai dele", "os pais de cada um" */
  const np = [];
  SUJ_POSS.forEach(P => SUJ_NOMES.forEach(N => {
    const i = (N.g === 'm' ? 0 : 1) + (N.n === 'p' ? 2 : 0), art = ['o','a','os','as'][i];
    const txt = P.pt ? P.pt[i] + ' ' + N.pt : art + ' ' + N.pt + ' ' + P.de;
    np.push({ seq: ptxN(txt).split(' '), suj:{ t:'np', p:P.k, n:N.en }, per: N.n === 'p' ? '3p' : '3s' });
    if(P.pt) np.push({ seq: ptxN(art + ' ' + txt).split(' '), suj:{ t:'np', p:P.k, n:N.en }, per: N.n === 'p' ? '3p' : '3s' });   /* "o meu pai" */
  }));
  np.sort((a, b) => b.seq.length - a.seq.length);
  /* v152: léxico de complementos — tudo o que já aparece como colocação de ALGUM verbo pode ser digitado com outro.
     lex: frase inteira → { en, pt } · nomes: substantivo solto (de "o carro" ↔ "the car") → inglês */
  const lex = {}, nomes = {};
  VERBS.forEach(v => (v.col || []).forEach(col => {
    if(!col.pt || !col.en || !o2ObjDef(col)) return;
    const k = ptxN(col.pt); if(k && !lex[k]) lex[k] = { en:col.en, pt:col.pt };
    const mp = k.match(/^(o|a|os|as|um|uma|uns|umas) ([a-z-]+)$/), me = col.en.match(/^(the|a|an) ([a-z-]+)$/i);
    if(mp && me && !nomes[mp[2]]) nomes[mp[2]] = { en:me[2], pt:col.pt.split(' ').slice(1).join(' ') };
    else if(/^[a-z-]+$/.test(k) && /^[a-z-]+$/i.test(col.en) && !nomes[k]) nomes[k] = { en:col.en, pt:col.pt };
  }));
  _ptxIdx = { F, ordem, adj, imp, np, lex, nomes };
  return _ptxIdx;
}
function ptxCasa(tk, i, seq){ for(let k = 0; k < seq.length; k++) if(tk[i + k] !== seq[k]) return false; return true; }
function ptxVerbos(tk, i, kinds){
  const I = ptxIndice();
  return (I.F[tk[i]] || []).filter(x => kinds.includes(x.kind) && ptxCasa(tk, i, x.seq));
}
/* tenta ler um grupo verbal a partir do token i. Devolve null ou { len, cat, tempo, aspecto, per, m:[formas], adj, imp, just } */
function ptxGrupo(tk, i, semSujeito){
  const I = ptxIndice(), w = tk[i];
  const maior = l => l.reduce((a, x) => Math.max(a, x.seq.length), 0);
  const fato = (tempo, aspecto, per, m, antes, extra) => m.length ? Object.assign({ len: antes + maior(m), cat:'fact', tempo, aspecto, per, m, antes }, extra || {}) : null;
  const estado = (tempo, aspecto, per, j, antes) => {
    if(tk[j] in I.adj) return { len: antes + 1, cat:'state', tempo, aspecto, per, adj: I.adj[tk[j]] };
    if(semSujeito && tk[j] in I.imp) return { len: antes + 1, cat:'state', tempo, aspecto, per, imp: I.imp[tk[j]] };
    return null;
  };
  let r = null;
  if(PTX_IR[w]){
    const per = PTX_IR[w];
    if(tk[i + 1] === 'ter'){
      if(tk[i + 2] === 'estado') r = fato('future', 'perfeito_continuo', per, ptxVerbos(tk, i + 3, ['ger']), 3) || estado('future', 'perfeito', per, i + 3, 3);
      else if(tk[i + 2] === 'sido') r = estado('future', 'perfeito', per, i + 3, 3);
      r = r || fato('future', 'perfeito', per, ptxVerbos(tk, i + 2, ['part']), 2);
    } else if(tk[i + 1] === 'estar') r = fato('future', 'continuo', per, ptxVerbos(tk, i + 2, ['ger']), 2) || estado('future', 'simples', per, i + 2, 2);
    else if(tk[i + 1] === 'ser') r = estado('future', 'simples', per, i + 2, 2);
    r = r || fato('future', 'simples', per, ptxVerbos(tk, i + 1, ['inf']), 1);
    if(r) return r;
  }
  if(PTX_TER[w]){
    const [k, per] = PTX_TER[w], tempo = k === 'pres' ? 'present' : 'past';
    if(tk[i + 1] === 'estado') r = fato(tempo, 'perfeito_continuo', per, ptxVerbos(tk, i + 2, ['ger']), 2) || estado(tempo, 'perfeito', per, i + 2, 2);
    else if(tk[i + 1] === 'sido') r = estado(tempo, 'perfeito', per, i + 2, 2);
    r = r || fato(tempo, 'perfeito', per, ptxVerbos(tk, i + 1, ['part']), 1);
    if(r) return r;
  }
  if(PTX_ESTAR[w]){
    const [k, per] = PTX_ESTAR[w], tempo = k === 'pres' ? 'present' : 'past';
    r = fato(tempo, 'continuo', per, ptxVerbos(tk, i + 1, ['ger']), 1) || estado(tempo, 'simples', per, i + 1, 1);
    if(r) return r;
  }
  if(PTX_SER[w]){
    const [k, per] = PTX_SER[w];
    r = estado(k === 'pres' ? 'present' : 'past', 'simples', per, i + 1, 1);
    if(r) return r;
  }
  if(/^acab(ei|ou|amos|aram)$/.test(w) && tk[i + 1] === 'de'){
    const per = { ei:'1s', ou:'3s', amos:'1p', aram:'3p' }[w.replace(/^acab/, '')];
    r = fato('present', 'perfeito', per, ptxVerbos(tk, i + 2, ['inf']), 2, { just:true });
    if(r) return r;
  }
  const m = ptxVerbos(tk, i, ['pres', 'pperf', 'imperf', 'fut']);
  if(m.length) return { len: maior(m), cat:'fact', finito:true, m, antes:0 };
  return null;
}
/* executa fn com o estado candidato no lugar do estado global (o motor lê `state`) */
function ptxCom(cand, fn){ const bak = state; state = cand; try { return fn(); } finally { state = bak; } }
/* monta inglês + português do estado candidato (mesma receita do render, sem 2ª oração) */
function ptxFrase(cand){
  return ptxCom(cand, () => {
    sujGuarda();
    const verb = state.categoria === 'fact' ? verbById(state.verbo) : null;
    const col = colComPoss(colAtual(verb));
    if(state.formato === 'pergunta' && state.whWord){
      const w = whGenerate(state.categoria, state.tempo, state.aspecto, state.pronome, state.whWord, verb, { mids: midList(), ends: endList(), molde: state.whMolde, col });
      if(!w.isStatic && !w.molde){
        const semS = WH_SUBJECT.includes(state.whWord);
        w.enMarked = sujEN(w.enMarked, 'pergunta', semS); w.en = stripMarks(w.enMarked);
        w.pt = sujPT(w.pt, { tempo:state.tempo, aspecto:(WH_X[state.whWord] || {}).tipo === 'idade' ? 'simples' : state.aspecto, formato:'pergunta', pr: semS ? 'He' : state.pronome }, semS);
      }
      return { en: w.en, pt: w.pt };
    }
    const g = generate(state.categoria, state.tempo, state.aspecto, state.formato, state.pronome, verb);
    /* v152: mesma composição do render, incluindo a 2ª oração */
    const withSignal = applySignal(g.text, midList().length ? midList() : null, endList(), col, null, state.formato);
    const o2 = o2Compor(), baseEN = (o2 && o2.mainEN) ? o2.mainEN(withSignal) : withSignal, fim = g.isQuestion ? '?' : '.';
    let raw = (o2 && o2.composeEN) ? o2.composeEN(baseEN) + fim : (o2 && o2.ini) ? upperFirstMarked(o2.enCl) + ', ' + lowerFirstMarked(baseEN) + fim : baseEN + (o2 ? o2.en : '') + fim;
    raw = sujEN(raw, state.formato);
    let pt;
    ptCondModo = o2 ? (o2.ptModo || null) : null;
    try { pt = translate(state.categoria, state.tempo, state.aspecto, state.formato, state.pronome, midList().length ? midList() : null, endList(), state.verbo, col, null); } finally { ptCondModo = null; }
    if(o2){
      if(o2.composePT) pt = o2.composePT(pt);
      else if(o2.ini){ const m = pt.match(/[.?!]\s*$/), f2 = m ? m[0].trim() : '.', corpo = pt.replace(/[.?!]\s*$/, ''); pt = o2.ptCl.charAt(0).toUpperCase() + o2.ptCl.slice(1) + ', ' + corpo.charAt(0).toLowerCase() + corpo.slice(1) + f2; }
      else pt = o2.ptJuntar(pt);
    }
    pt = sujPT(pt, { tempo:state.tempo, aspecto:state.aspecto, formato:state.formato, pr:state.pronome });
    return { en: stripMarks(raw), pt };
  });
}
/* lê a frase. forcar = id de verbo escolhido pelo usuário entre os candidatos. semWh = 2ª tentativa sem interrogativa */
/* v152: frase com 2ª oração — "Eu trabalho porque preciso de dinheiro". Procura uma conjunção no MEIO da frase,
   lê a esquerda como oração principal e a direita como 2ª oração (mesmo sujeito; o tempo dela é o motor que decide). */
const PTX_O2_TIPOS = ['oq', 'caus', 'cons', 'temp', 'cond', 'adv', 'adit', 'alt', 'expl', 'final'];
let _ptxConj = null;
function ptxConjs(){
  if(_ptxConj) return _ptxConj;
  const l = [];
  O2_TIPOS.forEach(t => { if(!PTX_O2_TIPOS.includes(t.k)) return; t.conjs.forEach((cj, i) => { if(cj.ini) return; const seq = ptxN(cj.pt).split(' '); if(seq[0] && !l.some(x => x.k === t.k && x.seq.join(' ') === seq.join(' '))) l.push({ seq, k:t.k, i }); }); });   /* v161: dedupe por tipo ("quando" existe em temp e em oq) */
  [['por isso', 'cons'], ['pra', 'final'], ['porem', 'adv']].forEach(x => { const t = O2_TIPOS.find(y => y.k === x[1]); if(t && !l.some(y => y.seq.join(' ') === x[0])) l.push({ seq:x[0].split(' '), k:x[1], i: x[1] === 'final' ? Math.max(0, t.conjs.findIndex(cj => cj.en === 'to')) : 0 }); });
  { const f = l.find(x => x.k === 'final' && x.seq.join(' ') === 'para'), t = O2_TIPOS.find(y => y.k === 'final'); if(f && t) f.i = Math.max(0, t.conjs.findIndex(cj => cj.en === 'to')); }
  { const t = O2_TIPOS.find(y => y.k === 'oq'); if(t){ const i = t.conjs.findIndex(cj => cj.en === 'why'); if(i >= 0) l.push({ seq:['porque'], k:'oq', i }); } }   /* v161: "não sei porque ela saiu" */
  l.sort((a, b) => b.seq.length - a.seq.length);
  return (_ptxConj = l);
}
function ptxDuas(texto, forcar){
  const I = ptxIndice(), bruto = String(texto || '').trim(), palavras = bruto.replace(/[?.!]+\s*$/, '').split(/\s+/), tk = palavras.map(ptxN);
  if(tk.length < 3 || tk.some(x => !x)) return null;
  const fimQ = /\?\s*$/.test(bruto) ? '?' : '';
  for(let pos = 1; pos < tk.length - 1; pos++){
    const cands = ptxConjs().filter(cj => ptxCasa(tk, pos, cj.seq)).sort((a, b) => (b.k === 'oq') - (a.k === 'oq'));   /* v161: com verbo de saber, a pergunta indireta vence */
    for(const cj of cands){
      let dir = tk.slice(pos + cj.seq.length); if(!dir.length) continue;
      const r1 = ptxParse1(palavras.slice(0, pos).join(' ') + fimQ, forcar, false);
      if(!r1 || !r1.ok || r1.c.categoria !== 'fact' || r1.c.whWord) continue;
      if(cj.k === 'oq' && !O2_OQ_V().includes(r1.c.verbo)) continue;
      /* 2ª oração: [não] [sujeito] verbo [complemento] */
      let neg2 = false, outroSuj = false, sj2 = null;
      if(dir[0] === 'nao'){ neg2 = true; dir = dir.slice(1); }
      const n = I.np.find(x => ptxCasa(dir, 0, x.seq));
      if(ptxCasa(dir, 0, ['a', 'gente'])){ outroSuj = r1.c.pronome !== 'We'; dir = dir.slice(2); }
      else if(n){ outroSuj = !(r1.c.suj && r1.c.suj.t === 'np' && r1.c.suj.p === n.suj.p && r1.c.suj.n === n.suj.n); dir = dir.slice(n.seq.length); }
      else if(PTX_PRON[dir[0]]){ outroSuj = !!r1.c.suj || PTX_PRON[dir[0]][0] !== r1.c.pronome; if(cj.k === 'oq'){ sj2 = PTX_PRON[dir[0]][0]; outroSuj = false; } dir = dir.slice(1); }
      if(dir[0] === 'nao'){ neg2 = true; dir = dir.slice(1); }
      let m = cj.k === 'final' ? ptxVerbos(dir, 0, ['inf']) : null, usado = 0;
      if(cj.k !== 'final'){
        const g = ptxGrupo(dir, 0, false);
        if(g && g.cat === 'fact'){ m = g.m; usado = g.antes || 0; } else m = ptxVerbos(dir, 0, ['pres', 'pperf', 'imperf', 'fut', 'inf']);
      }
      const ids = []; (m || []).forEach(x => { if(x.id.indexOf('__') && !ids.includes(x.id)) ids.push(x.id); });
      if(cj.k === 'oq' && !ids.length && ['leva', 'demora', 'levou', 'demorou'].includes(dir[0])){ m = [{ id:'take', seq:[dir[0]], kind:'pres' }]; ids.push('take'); sj2 = 'It'; }   /* v161: "quanto tempo leva" (sujeito oculto = it) */
      if(!ids.length) continue;
      ids.sort((a, b) => (verbById(a).phrasal ? 1 : 0) - (verbById(b).phrasal ? 1 : 0) || I.ordem[a] - I.ordem[b]);
      /* complemento da 2ª oração: só entre as colocações do verbo 2 (é assim que o motor guarda) */
      let esc = null;
      ids.forEach(id => { const f = m.find(x => x.id === id), dep = dir.slice(usado + f.seq.length); let best = null;
        (verbById(id).col || []).forEach((col, i) => { const seq = ptxN(col.pt).split(' '); if(seq[0] && ptxCasa(dep, 0, seq) && (!best || seq.length > best.n)) best = { i, n:seq.length }; });
        if(!esc || (best && (!esc.best || best.n > esc.best.n))) esc = esc && !best ? esc : { id, best, dep }; });
      const c = r1.c;
      const tp2 = cj.k === 'oq' ? ({ pperf:'past', imperf:'past', fut:'future', pres:'present' }[(m.find(x => x.id === esc.id) || {}).kind] || null) : null;   /* v162: "ela saiu" → left */
      c.o2 = Object.assign({}, c.o2 || {}, { tipo:cj.k, opt:0, conj:cj.i, neg:neg2, custom:esc.id, para:c.verbo, sj2:sj2, tp2:tp2, c2: esc.best ? esc.best.i : 'none', cnd:null, tr:null, q:null, foco:1, sl2:{ signalMids:[], signalEnds:[] } });
      const viavel = ptxCom(c, () => { sujGuarda(); const o = o2Compor(); return !!o && state.o2.custom === esc.id; });
      if(!viavel){ c.o2.tipo = null; c.o2.custom = null; continue; }
      const avisos = r1.avisos.slice(), sobras = r1.sobras.concat(esc.dep.slice(esc.best ? esc.best.n : 0));
      if(outroSuj) avisos.push('No motor a 2ª oração repete o sujeito da principal; o outro sujeito ficou de fora.');
      avisos.push('O tempo da 2ª oração é escolhido pelo motor a partir da principal.');
      return { ok:true, c, avisos, sobras, alts:r1.alts };
    }
  }
  return null;
}
function ptxParse(texto, forcar){ return ptxDuas(texto, forcar) || ptxParse1(texto, forcar, false); }
function ptxParse1(texto, forcar, semWh){
  const I = ptxIndice(), bruto = String(texto || '').trim();
  let tk = ptxN(bruto).split(' ').filter(Boolean);
  if(!tk.length) return null;
  const avisos = [];
  let pergunta = /\?\s*$/.test(bruto), neg = false, wh = null, molde = null;
  const c = JSON.parse(JSON.stringify(state));
  Object.assign(c, { categoria:'fact', tempo:'present', aspecto:'simples', formato:'afirmativa', colocacao:null, colPoss:null, colLivre:null, suj:null, adj:0, whWord:null, whMolde:null, signalMids:[], signalEnds:[], signalSplit:null });
  if(c.o2) c.o2.tipo = null;
  const falha = motivo => (!semWh && wh) ? ptxParse1(texto, forcar, true) : { ok:false, motivo };
  /* --- sugestões sem sujeito: "Que tal…", "E quanto a…", "Por que não + infinitivo" --- */
  const sug = [['que tal', 'How', 'about'], ['e quanto a', 'What', 'about'], ['por que nao', 'Why', 'not']].find(x => ptxCasa(tk, 0, x[0].split(' ')));
  if(sug && !semWh){
    const j = sug[0].split(' ').length, inf = ptxVerbos(tk, j, ['inf']);
    if(inf.length){ wh = sug[1]; molde = sug[2]; pergunta = true; tk = tk.slice(j); var soInf = true; }
  }
  /* --- "Quantos problemas há?" --- */
  if(!wh && !semWh && /^quant[oa]s?$/.test(tk[0])){
    const ix = SUJ_EXIST.findIndex(N => N.q && ptxCasa(tk, 1, ptxN(N.q.pt).split(' ')));
    if(ix >= 0){
      const resto = tk.slice(1 + ptxN(SUJ_EXIST[ix].q.pt).split(' ').length).join(' ');
      const T = { 'ha':['present','simples'], 'tem':['present','simples'], 'havia':['past','simples'], 'tinha':['past','simples'], 'houve':['past','simples'], 'vai haver':['future','simples'], 'tem havido':['present','perfeito'], 'tinha havido':['past','perfeito'], 'vai ter havido':['future','perfeito'] }[resto];
      if(T){ Object.assign(c, { categoria:'state', tempo:T[0], aspecto:T[1], formato:'pergunta', suj:{ t:'exist', i:ix }, whWord:'How many … are there' }); return { ok:true, c, avisos, sobras:[], alts:[] }; }
    }
  }
  /* --- interrogativa no início --- */
  if(!wh && !semWh){
    const h = PTX_WH.find(x => ptxCasa(tk, 0, x[0].split(' ')));
    if(h){ wh = h[1]; pergunta = true; tk = tk.slice(h[0].split(' ').length); var haQuanto = h[0] === 'ha quanto tempo'; }
  }
  /* --- molduras fixas com be / "é preciso" --- */
  if(wh === 'What time' && /^(sao|e|eram|era|vao ser|vai ser)$/.test(tk.join(' '))){
    Object.assign(c, { formato:'pergunta', whWord:'What time', whMolde:'isit', tempo: /^(eram|era)$/.test(tk[0]) ? 'past' : /^va/.test(tk[0]) ? 'future' : 'present' }); return { ok:true, c, avisos, sobras:[], alts:[] };
  }
  if(wh === 'How far' && /^(fica|ficava|vai ficar|e|era)$/.test(tk.join(' '))){
    Object.assign(c, { formato:'pergunta', whWord:'How far', whMolde:'isit', tempo: /^(ficava|era)$/.test(tk[0]) ? 'past' : tk[0] === 'vai' ? 'future' : 'present' }); return { ok:true, c, avisos, sobras:[], alts:[] };
  }
  if(wh === 'How' && /^(e|era|vai ser|tem sido)$/.test(tk.slice(0, tk[0] === 'vai' || tk[0] === 'tem' ? 2 : 1).join(' '))){
    const n = (tk[0] === 'vai' || tk[0] === 'tem') ? 2 : 1, inf = ptxVerbos(tk, n, ['inf']);
    if(inf.length){ molde = 'like'; wh = 'What'; soInf = true; c.tempo = tk[0] === 'era' ? 'past' : tk[0] === 'vai' ? 'future' : 'present'; c.aspecto = tk[0] === 'tem' ? 'perfeito' : 'simples'; tk = tk.slice(n); }
  }
  if(wh === 'What' && /^(e|era|vai ser) preciso (para|pra)$/.test(tk.slice(0, tk[0] === 'vai' ? 4 : 3).join(' '))){
    const n = tk[0] === 'vai' ? 4 : 3; molde = 'takeO'; soInf = true; c.tempo = tk[0] === 'era' ? 'past' : tk[0] === 'vai' ? 'future' : 'present'; tk = tk.slice(n);
  }
  if(wh === 'How long' && ptxCasa(tk, 0, ['faz', 'desde', 'que'])){ molde = 'since'; tk = tk.slice(3); }
  /* --- "Quanto tempo leva para…", "Quanto custa (para…)" --- */
  let apoio = null;
  if(['How long', 'How many hours', 'How much'].includes(wh) && !molde){
    const g = ptxGrupo(tk, 0, true), idA = wh === 'How much' ? '__custar' : '__levar';
    if(g && g.cat === 'fact' && g.m.some(x => x.id === idA)){
      const x = g.m.find(y => y.id === idA);
      apoio = g.finito ? { tempo: x.kind === 'pres' ? 'present' : x.kind === 'fut' ? 'future' : 'past', aspecto:'simples' } : { tempo:g.tempo, aspecto:g.aspecto };
      tk = tk.slice(g.len);
      if(tk[0] === 'para' || tk[0] === 'pra'){ molde = wh === 'How much' ? 'cost' : 'take'; tk = tk.slice(1); }
      else if(wh === 'How much' && !tk.length){ Object.assign(c, { formato:'pergunta', whWord:'How much', whMolde:'isit', tempo:apoio.tempo, aspecto:/perfeito/.test(apoio.aspecto) ? 'perfeito' : 'simples' }); return { ok:true, c, avisos, sobras:[], alts:[] }; }
      else return falha('Depois de "leva/custa" esperava "para + quem + verbo".');
    }
  }
  /* --- existencial: "Há um problema", "Não havia tempo", "Vai haver duas opções" --- */
  { let j = 0, n0 = false; if(tk[0] === 'nao'){ n0 = true; j = 1; }
    const T = [['vai ter havido','future','perfeito'], ['tinha havido','past','perfeito'], ['tem havido','present','perfeito'], ['vai haver','future','simples'], ['havia','past','simples'], ['houve','past','simples'], ['ha','present','simples'], ['tem','present','simples'], ['tinha','past','simples']]
      .find(x => ptxCasa(tk, j, x[0].split(' ')));
    if(T && !molde){
      const k = j + T[0].split(' ').length, resto = tk.slice(k);
      const ix = SUJ_EXIST.findIndex(N => ptxCasa(resto, 0, ptxN(N.pt).split(' ')) || (N.ptAny && ptxCasa(resto, 0, ptxN(N.ptAny).split(' '))));
      if(ix >= 0){
        const N = SUJ_EXIST[ix], usado = ptxCasa(resto, 0, ptxN(N.pt).split(' ')) ? ptxN(N.pt).split(' ').length : ptxN(N.ptAny).split(' ').length;
        Object.assign(c, { categoria:'state', tempo:T[1], aspecto:T[2], suj:{ t:'exist', i:ix }, pronome: N.pl ? 'They' : 'It' });
        neg = n0; tk = resto.slice(usado);
        return ptxFim(c, { tk, antes:[], neg, pergunta, wh, molde:null, avisos, alts:[] });
      }
    }
  }
  /* --- sujeito --- */
  let per = null, sujeito = false;
  const leSujeito = () => {
    if(ptxCasa(tk, 0, ['a', 'gente'])){ c.pronome = 'We'; per = '3s'; tk = tk.slice(2); return true; }
    if(ptxCasa(tk, 0, ['a', 'pessoa'])){ c.suj = { t:'one' }; c.pronome = 'He'; per = '3s'; tk = tk.slice(2); return true; }
    const n = I.np.find(x => ptxCasa(tk, 0, x.seq));
    if(n){ c.suj = n.suj; per = n.per; tk = tk.slice(n.seq.length); return true; }
    if(PTX_PRON[tk[0]]){ c.pronome = PTX_PRON[tk[0]][0]; per = PTX_PRON[tk[0]][1]; tk = tk.slice(1); return true; }
    return false;
  };
  if(!soInf) sujeito = leSujeito();
  /* "Quantos anos você tem?" → How old (inglês usa be) · "Como você está?" → How + be, sem adjetivo */
  if(wh === 'How old' && !molde){
    const T = { tem:'present', tenho:'present', temos:'present', tinha:'past', tinham:'past', 'vai ter':'future', 'vou ter':'future', 'vamos ter':'future', 'vao ter':'future' }[tk.join(' ')];
    if(T){ Object.assign(c, { categoria:'state', tempo:T, aspecto:'simples' }); return ptxFim(c, { tk:[], antes:[], neg:false, pergunta:true, wh, molde:null, avisos, alts:[] }); }
  }
  if(wh === 'How' && !molde && sujeito){
    const j = tk.join(' '), k = PTX_ESTAR[j] || PTX_SER[j], fut = /^(vou|vai|vamos|vao) (estar|ser)$/.test(j);
    if(k || fut){ Object.assign(c, { categoria:'state', tempo: fut ? 'future' : (k[0] === 'pres' ? 'present' : 'past'), aspecto:'simples' }); return ptxFim(c, { tk:[], antes:[], neg:false, pergunta:true, wh, molde:null, avisos, alts:[] }); }
  }
  /* --- procura o grupo verbal (pode haver advérbio antes: "Eu sempre trabalho") --- */
  let g = null, pos = -1;
  if(soInf){
    const inf = ptxVerbos(tk, 0, ['inf']); if(!inf.length) return falha('Não achei o verbo no infinitivo.');
    g = { len: inf.reduce((a, x) => Math.max(a, x.seq.length), 0), cat:'fact', m:inf, so:true }; pos = 0;
  } else if(molde === 'take' || molde === 'cost'){
    const inf = ptxVerbos(tk, 0, ['inf']); if(!inf.length) return falha('Depois de "para + quem" esperava um verbo no infinitivo.');
    g = { len: inf.reduce((a, x) => Math.max(a, x.seq.length), 0), cat:'fact', m:inf, so:true }; pos = 0;
  } else {
    for(let i = 0; i < tk.length && !g; i++){
      if(tk[i] === 'nao' && !neg){ continue; }
      const x = ptxGrupo(tk, i, !sujeito); if(x){ g = x; pos = i; }
    }
    if(!g) return falha('Não reconheci o verbo. O motor só entende os verbos cadastrados (' + VERBS.length + ').');
  }
  let antes = tk.slice(0, pos); const depois = tk.slice(pos + g.len);
  if(antes.includes('nao')){ neg = true; antes = antes.filter(x => x !== 'nao'); }
  const alts = [];
  if(g.cat === 'state'){
    c.categoria = 'state'; c.tempo = g.tempo; c.aspecto = g.aspecto; per = per || g.per;
    if(g.imp !== undefined){ c.suj = { t:'imp', i:g.imp }; c.pronome = 'It'; }
    else { c.adj = g.adj; if(!sujeito){ c.pronome = { '1s':'I', '3s': pergunta ? 'You' : 'He', '1p':'We', '3p':'They' }[g.per]; if(g.per === '3s') avisos.push('Sujeito oculto na 3ª pessoa: assumi "' + c.pronome + '". Escreva o sujeito para trocar.'); } }
    return ptxFim(c, { tk:depois, antes, neg, pergunta, wh, molde, avisos, alts });
  }
  /* --- qual verbo? prioridade: escolha do usuário › complemento que casa › não frasal › ordem do banco --- */
  const ids = []; g.m.forEach(x => { if(x.id.indexOf('__') && !ids.includes(x.id)) ids.push(x.id); });
  if(!ids.length) return falha('Não reconheci o verbo.');
  ids.sort((a, b) => (verbById(a).phrasal ? 1 : 0) - (verbById(b).phrasal ? 1 : 0) || I.ordem[a] - I.ordem[b]);
  /* o complemento ajuda a decidir: testa as colocações (e as versões com possessivo) de cada candidato */
  const casaCol = id => {
    const v = verbById(id), forma = g.m.find(x => x.id === id), dep = tk.slice(pos + forma.seq.length + (g.antes || 0));
    let melhor = null;
    (v.col || []).forEach((col, i) => {
      [null, 'suj', 'my', 'your', 'his', 'her', 'its', 'our', 'their'].forEach(op => {
        if(op && !colPodePoss(col)) return;
        const pt = ptxCom(Object.assign({}, c, { colPoss:op, verbo:id, colocacao:i }), () => { sujGuarda(); return colComPoss(col).pt; });
        const seq = ptxN(pt).split(' ');
        if(seq[0] && ptxCasa(dep, 0, seq) && (!melhor || seq.length > melhor.n)) melhor = { i, op, n:seq.length };
      });
    });
    /* v152: nenhuma colocação do verbo casou → procura no léxico geral (frase inteira; depois determinante + substantivo) */
    let livre = null;
    if(!melhor){
      for(let n = Math.min(dep.length, 6); n >= 1 && !livre; n--){ const L = I.lex[dep.slice(0, n).join(' ')]; if(L) livre = { en:L.en, pt:L.pt, n }; }
      if(!livre){
        const DETS = { o:'the', a:'the', os:'the', as:'the', um:'a', uma:'a', uns:'some', umas:'some', meu:'my', minha:'my', meus:'my', minhas:'my', nosso:'our', nossa:'our', nossos:'our', nossas:'our' };
        const d = DETS[dep[0]], N = I.nomes[dep[d ? 1 : 0]];
        if(N){ const art = d === 'a' && /^[aeiou]/i.test(N.en) ? 'an' : d; livre = { en:(art ? art + ' ' : '') + N.en, pt:(d ? bruto.split(/\s+/).find(w => ptxN(w) === dep[0]) + ' ' : '') + N.pt, n: d ? 2 : 1 }; }
      }
    }
    return { id, melhor, dep, livre };
  };
  const testes = ids.map(casaCol);
  let esc = (forcar && testes.find(t => t.id === forcar)) || testes.slice().sort((a, b) => ((b.melhor ? b.melhor.n : 0) - (a.melhor ? a.melhor.n : 0)))[0];
  if(!(forcar && esc.id === forcar) && !esc.melhor) esc = testes.find(t => t.livre && o2Transitivo(verbById(t.id))) || testes[0];
  ids.forEach(id => { if(id !== esc.id) alts.push(id); });
  const forma = g.m.find(x => x.id === esc.id), v = verbById(esc.id);
  c.verbo = esc.id; c.verboLetter = verbGroupOf(v); c.verboTema = verbCats(v)[0];
  if(g.finito){
    /* mesma grafia pode ser presente e passado (trabalhamos): fica o presente */
    const formas = g.m.filter(x => x.id === esc.id), f = formas.find(x => x.kind === 'pres') || formas[0];
    c.tempo = f.kind === 'pres' ? 'present' : f.kind === 'fut' ? 'future' : 'past'; c.aspecto = 'simples'; g.per = f.per;
    if(f.kind === 'imperf') avisos.push('Pretérito imperfeito ("' + bruto.split(/\s+/).find(w => ptxN(w) === f.seq[0]) + '") entrou como passado simples; para hábito no passado o inglês também usa "used to".');
    if(formas.some(x => x.kind === 'pres') && formas.some(x => x.kind === 'pperf')) avisos.push('Esta forma serve para presente e passado; fiquei com o presente. Ajuste o tempo no dial ⑤ se for passado.');
  } else if(!g.so){ c.tempo = g.tempo; c.aspecto = g.aspecto; }
  if(apoio){ c.tempo = apoio.tempo; c.aspecto = apoio.aspecto; }
  if(molde === 'since'){ c.tempo = 'present'; c.aspecto = 'simples'; }
  if(haQuanto && c.tempo === 'present' && c.aspecto === 'simples'){ c.aspecto = 'perfeito'; avisos.push('"Há quanto tempo" + presente em português pede o present perfect em inglês (How long have you…).'); }
  if(esc.melhor){ c.colocacao = esc.melhor.i; c.colPoss = esc.melhor.op; }
  c.colLivre = (!esc.melhor && esc.livre) ? { en:esc.livre.en, pt:esc.livre.pt, para:esc.id } : null;
  const resto = esc.dep.slice(esc.melhor ? esc.melhor.n : (esc.livre ? esc.livre.n : 0));
  if(!sujeito && !g.so && !(wh === 'Who' || wh === 'What')){
    c.pronome = { '1s':'I', '3s': pergunta ? 'You' : 'He', '1p':'We', '3p':'They' }[g.per] || 'I';
    if(g.per === '3s') avisos.push('Sujeito oculto na 3ª pessoa: assumi "' + c.pronome + '". Escreva o sujeito para trocar.');
  }
  /* Who/What: com sujeito explícito viram pergunta pelo OBJETO */
  if(wh === 'What' && !molde) wh = sujeito ? 'What (objeto)' : 'What';
  if(wh === 'Who' && !molde) wh = sujeito ? 'Who (objeto)' : 'Who';
  const mids0 = [];
  return ptxFim(c, { tk:resto, antes, neg, pergunta, wh, molde, avisos, alts, just:g.just });
}
/* fecha a leitura: formato, interrogativa, palavras-sinal e sobras */
function ptxFim(c, o){
  let { tk, antes, neg, pergunta, wh, molde, avisos, alts } = o;
  if(wh === 'Why' && neg && !molde){ wh = "Why don't"; neg = false; }
  if(wh){
    c.formato = 'pergunta'; c.whWord = wh; c.whMolde = molde || null;
    if(neg){ avisos.push('O motor não combina negação com esta interrogativa; a negação ficou de fora.'); neg = false; }
  } else c.formato = pergunta ? (neg ? 'pergunta_negativa' : 'pergunta') : (neg ? 'negativa' : 'afirmativa');
  const sobras = [];
  if(c.whMolde){ antes.concat(tk).forEach(w => sobras.push(w)); return { ok:true, c, avisos, sobras, alts }; }
  /* palavras-sinal válidas para este tempo e formato, das mais longas para as mais curtas */
  const vz = wh ? whVazios(wh) : new Set();
  const lista = (SIGNAL_WORDS[c.tempo + '_' + c.aspecto] || []).filter(sw => signalAllowed(sw, c.formato) && !vz.has(slotOf(sw)))
    .map(sw => ({ sw, seq: ptxN(SIGNAL_PT[sw.w] || sw.w).split(' ') })).filter(x => x.seq[0]).sort((a, b) => b.seq.length - a.seq.length);
  const poe = sw => { const campo = sw.pl === 'end' ? 'signalEnds' : 'signalMids'; if(c[campo].some(x => slotOf(x) === slotOf(sw))) return false; c[campo] = c[campo].concat([sw]); return true; };
  if(o.just){ const j = lista.find(x => x.sw.w === 'just'); if(j) poe(j.sw); }
  [antes, tk].forEach(seg => {
    for(let i = 0; i < seg.length;){
      const m = lista.find(x => ptxCasa(seg, i, x.seq));
      if(m && poe(m.sw)) i += m.seq.length; else { sobras.push(seg[i]); i++; }
    }
  });
  return { ok:true, c, avisos, sobras, alts };
}
/* ---- interface ---- */
let ptxAtual = null, ptxForca = null, ptxTimer = null;
function ptxAtualiza(){
  const inp = document.getElementById('ptxIn'), out = document.getElementById('ptxOut'), bt = document.getElementById('ptxAdd'); if(!inp || !out) return;
  const txt = inp.value;
  ptxAtual = null; bt.disabled = true;
  if(!txt.trim()){ out.innerHTML = '<p class="ptx-dica">Escreva uma frase em português. O motor reconhece sujeito, negação, pergunta, interrogativa, tempo verbal, complemento e palavras-sinal — sempre com os verbos e peças cadastrados.</p>'; return; }
  let r; try { r = ptxParse(txt, ptxForca); } catch(e){ r = { ok:false, motivo:'Não consegui ler esta frase.' }; }
  if(!r || !r.ok){ out.innerHTML = '<p class="ptx-erro">' + escapeHTML((r && r.motivo) || 'Não entendi.') + '</p>'; return; }
  let f; try { f = ptxFrase(r.c); } catch(e){ out.innerHTML = '<p class="ptx-erro">O motor não conseguiu montar esta combinação.</p>'; return; }
  ptxAtual = r; bt.disabled = false;
  const alt = r.alts.length ? '<div class="ptx-alt">Outro verbo possível: ' + r.alts.slice(0, 6).map(id => '<button type="button" class="ptx-chip" data-ptx-verbo="' + id + '">' + escapeHTML(verbById(id).base + (verbById(id).prt ? ' ' + verbById(id).prt : '')) + '</button>').join('') + '</div>' : '';
  const sob = r.sobras.length ? '<p class="ptx-aviso">Não encaixei: <b>' + escapeHTML(r.sobras.join(' ')) + '</b> (fora das peças do motor).</p>' : '';
  out.innerHTML = '<div class="ptx-en"><span>' + escapeHTML(f.en) + '</span><button type="button" class="audio-btn sm" data-text="' + escapeHTML(f.en) + '" aria-label="Ouvir">🔊</button></div>' +
    '<p class="ptx-pt">Motor entendeu: <i>' + escapeHTML(f.pt) + '</i></p>' + sob + r.avisos.map(a => '<p class="ptx-aviso">' + escapeHTML(a) + '</p>').join('') + alt;
}
function ptxAdicionar(){
  if(!ptxAtual) return;
  Object.assign(state, JSON.parse(JSON.stringify(ptxAtual.c)));
  sujAberto = null; render();
  const r = document.querySelector('#console-tempos .readout'); if(r && r.scrollIntoView) r.scrollIntoView({ behavior:'smooth', block:'start' });
}
window.addEventListener('load', () => ptxAtualiza());
document.addEventListener('input', e => { if(e.target && e.target.id === 'ptxIn'){ ptxForca = null; clearTimeout(ptxTimer); ptxTimer = setTimeout(ptxAtualiza, 180); } });
document.addEventListener('click', e => {
  const t = e.target; if(!t.closest) return;
  const v = t.closest('[data-ptx-verbo]'); if(v){ ptxForca = v.dataset.ptxVerbo; ptxAtualiza(); return; }
  if(t.closest('#ptxAdd')){ ptxAdicionar(); return; }
  if(t.closest('#ptxLimpar')){ const i = document.getElementById('ptxIn'); i.value = ''; ptxForca = null; ptxAtualiza(); i.focus(); }
});
let state = { pronome:"I", categoria:"fact", verbo:"work", verboLetter:"W", verboModo:"tema", verboTema:"trab", verboOrigem:null, verboBusca:"", colocacao:null, tempo:"present", aspecto:"simples", formato:"afirmativa", signalMids:[], signalEnds:[], signalSplit:null, signalSlot:null, signalFam:null, signalBusca:'', signalMais:false, whWord:null, whMolde:null, suj:null, adj:0, colPoss:null, colLivre:null, o2:{ tipo:null, opt:0, conj:0, neg:false, custom:null, para:null, c2:null, foco:1, sl2:{ signalMids:[], signalEnds:[] } } };

function buildPronome(){
  const el = document.getElementById('pronomeRow'); el.innerHTML="";
  PRONOUNS.forEach(p=>{
    const btn=document.createElement('div'); btn.className='pronome-pill';
    btn.dataset.active=(state.pronome===p && !state.suj); btn.textContent=p;   /* v148: com sujeito estendido, nenhuma pílula fica acesa */
    btn.onclick=()=>{ state.pronome=p; state.suj=null; sujAberto=null; render(); };
    el.appendChild(btn);
  });
}
function verbLetters(){
  const letters = [...new Set(VERBS.filter(v=>!v.phrasal).map(v=>v.base[0].toUpperCase()))].sort();
  /* frasais ganham aba própria: agrupá-los pela inicial os esconderia no meio dos simples
     (give up ficaria misturado com give), e eles são uma categoria de estudo à parte */
  return VERBS.some(v=>v.phrasal) ? letters.concat(['⚡']) : letters;
}
function verbGroupOf(v){ return v.phrasal ? '⚡' : v.base[0].toUpperCase(); }
/* ---- Dial ③: o verbo, por tema ou por letra ----
   Com mais de trezentos verbos, a letra inicial sozinha não ajuda a estudar: "buy" e "sell" estão
   longe no alfabeto e perto no pensamento. O filtro por tema agrupa por campo semântico; a visão
   A–Z continua para quem já sabe a palavra, e a busca aceita inglês ou português. */
let verboGradeAberta = false;
/* v125: a lista de verbos nasce recolhida (12 + o verbo atual); antes eram até 133 pílulas entre o passo ③ e o ④ */
let verboListaAberta = false;
const VERBO_LISTA_MAX = 12;

/* ---- Etimologia dos verbos ----
   Cada verbo carrega a família de línguas de onde veio. O inglês tem camadas: o núcleo do dia a dia
   é germânico (inglês antigo) com um verniz nórdico (vikings, séc. VIII–XI); a conquista normanda
   (1066) trouxe o francês — de raiz latina — para o vocabulário de poder, lei e mesa; o latim
   erudito entrou depois pela igreja, ciência e escola. Saber a camada ajuda a prever o registro:
   verbo germânico = curto, informal, forte; verbo latino/francês = formal, abstrato. */
const ETIM_ORIGENS = [
  { k:'G', icon:'🌾', nome:'Germânico (inglês antigo)', curto:'Germânico', dica:'O núcleo do inglês: verbos curtos, básicos e informais (eat, go, make, think). São os que mais aparecem na fala.' },
  { k:'N', icon:'⚔️', nome:'Nórdico antigo (vikings)', curto:'Nórdico', dica:'Herança das invasões vikings (séc. VIII–XI). Parecem nativos, mas vieram do nórdico: take, get, want, die, happen, seem.' },
  { k:'F', icon:'🥖', nome:'Francês (anglo-normando)', curto:'Francês', dica:'Chegou com a conquista normanda (1066), em raiz latina. Costuma soar mais formal que o par germânico (begin / commence; ask / inquire).' },
  { k:'L', icon:'🏛️', nome:'Latim', curto:'Latim', dica:'Entrou pela igreja, escola e ciência. Verbos formais e abstratos (conclude, interpret, negotiate) — comuns em textos, provas e trabalho.' },
  { k:'R', icon:'🏺', nome:'Grego', curto:'Grego', dica:'Vocabulário técnico, científico e artístico (analyze, diagnose, criticize), geralmente via latim e francês.' },
  { k:'H', icon:'🌷', nome:'Holandês / baixo-alemão', curto:'Holandês', dica:'Do comércio e da navegação com os Países Baixos (pack, skate, slip, drill).' },
  { k:'O', icon:'🌍', nome:'Outras línguas', curto:'Outras', dica:'Empréstimos de italiano, árabe, persa, alemão e outras (manage, check, attack).' },
  { k:'I', icon:'❓', nome:'Origem incerta ou imitativa', curto:'Incerta', dica:'Etimologia não esclarecida ou imitativa — palavras que imitam sons (click, cough, hum) ou surgiram sem registro claro.' }
];
const ETIM = {};
(function(){
  ETIM_BASE_TXT.split('\n').forEach(l=>{ const [id, k, nota] = l.split('|'); if(id && k) ETIM[id] = { k, nota: nota || '' }; });
  Object.keys(VERB_ETIM_INLINE).forEach(id=>{ const m = VERB_ETIM_INLINE[id].match(/^([A-Z]):(.*)$/); if(m) ETIM[id] = { k:m[1], nota:m[2] }; });
})();
/* Verbo frasal sem nota própria herda a origem do verbo-base (give up → give). */
function etimDe(v){ return ETIM[v.id] || (v.phrasal ? ETIM[v.base] : null) || null; }
function etimMeta(k){ return ETIM_ORIGENS.find(o => o.k === k); }
function verbosPorOrigem(lista, k){ return k ? lista.filter(v => { const e = etimDe(v); return e && e.k === k; }) : lista; }
function contaOrigem(lista, k){ return verbosPorOrigem(lista, k).length; }
/* Linha de filtros reutilizada no dial ③ e na prática. */
function linhaOrigens(el, atual, lista, aoEscolher){
  const cab = document.createElement('div'); cab.className = 'pronome-row verbo-origens';
  [{ k:null, icon:'🌐', curto:'Todas' }].concat(ETIM_ORIGENS).forEach(o=>{
    const n = o.k ? contaOrigem(lista, o.k) : lista.length;
    const b = document.createElement('div'); b.className = 'pronome-pill'; b.dataset.active = String((atual || null) === o.k);
    b.innerHTML = `${o.icon} ${o.curto} <small style="opacity:.6">${n}</small>`;
    if(o.k && !n) b.style.opacity = .4;
    b.onclick = () => aoEscolher(o.k);
    cab.appendChild(b);
  });
  el.appendChild(cab);
}
