/* ---- v101: comparativa ---- */
const O2_CMP_PAR = { I:'You', You:'I', He:'She', She:'He', It:'They', We:'They', They:'We' };
/* auxiliar que sobra na elipse: "…as he DOES / IS / HAS / WILL" */
function o2Aux(tp, asp, p){
  const t3 = p === 'He' || p === 'She' || p === 'It', pl = p === 'You' || p === 'We' || p === 'They';
  if(tp === 'future') return 'will';
  if(asp === 'perfeito' || asp === 'perfeito_continuo') return tp === 'past' ? 'had' : (t3 ? 'has' : 'have');
  if(asp === 'continuo') return tp === 'past' ? (pl ? 'were' : 'was') : (p === 'I' ? 'am' : pl ? 'are' : 'is');
  return tp === 'past' ? 'did' : (t3 ? 'does' : 'do');
}
const o2FimPT = pt1 => { const m = pt1.match(/[.?!]\s*$/); return m ? m[0].trim() : '.'; };
function o2ComporCmp(tipo, o, c, op, pr){
  const p2 = O2_CMP_PAR[pr] || 'They', sub = p2 === 'I' ? 'I' : p2.toLowerCase(), tail = ' ' + sub + ' ' + M(o2Aux(state.tempo, state.aspecto, p2));
  const g = o.conj;
  /* v113: 'the same way as' (+ sujeito + auxiliar) e 'like' (+ pronome objeto, informal) */
  const OBJ = { I:'me', You:'you', He:'him', She:'her', It:'it', We:'us', They:'them' };
  const enCl = g === 3 ? J('the same way as') + tail : g === 4 ? J('like') + ' ' + OBJ[p2]
    : g === 0 ? J('as') + ' ' + op.en + ' ' + J('as') + tail : (g === 1 ? 'more ' : 'less ') + op.en + ' ' + J('than') + tail;
  const ptCl = g === 3 ? 'do mesmo jeito que ' + PT_PRONOUN[p2].split('/')[0] : g === 4 ? 'como ' + PT_PRONOUN[p2].split('/')[0]
    : o2CmpPT(op, g === 0 ? 'eq' : g === 1 ? 'sup' : 'inf') + ' ' + (g === 0 ? 'quanto' : 'do que') + ' ' + PT_PRONOUN[p2].split('/')[0];
  return {
    tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
    ptJuntar: pt1 => pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + o2FimPT(pt1),
    estrutura: g === 3 ? '+ the same way as + sujeito + auxiliar' : g === 4 ? '+ like + pronome objeto (him, her, them…)' : g === 0 ? '+ as + advérbio + as + sujeito + auxiliar' : '+ ' + (g === 1 ? 'more' : 'less') + ' + advérbio + than + sujeito + auxiliar',
    nota: tipo.nota + (g === 4 ? '<br>Aqui a comparação é com <b>' + OBJ[p2] + '</b>.' : '<br>Aqui o 2º sujeito é <b>' + sub + '</b> e o auxiliar é <b>' + o2Aux(state.tempo, state.aspecto, p2) + '</b>, o mesmo tempo da principal.') +
      (g === 3 ? '<br><b>The same way as</b> compara o <b>modo</b> inteiro da ação (sem advérbio): depois de as vem sujeito + auxiliar, como em “She works the same way as he does”.' : g === 4 ? '<br><b>Like</b> é preposição: vem seguido de <b>pronome objeto</b> (him, her, them), não de oração — “She works like <i>him</i>”. “Like he does” existe só na fala informal; na escrita formal prefira <i>as</i>.' : g === 0 ? '<br><b>As … as</b> expressa <b>igualdade</b>; na negativa ("She doesn\'t work as … as") expressa que a primeira é inferior.' : g === 1 ? '<br><b>More … than</b> expressa <b>superioridade</b>. Depois de than usa-se o sujeito (he does); em fala informal ouve-se "than him".' : '<br><b>Less … than</b> expressa <b>inferioridade</b> (= not as … as).')
  };
}
/* ---- v101: conformativa ---- */
function o2ComporConf(tipo, o, c, op){
  const cl = o.conj <= 1, ini = o2IniEf(tipo, c);
  const enCl = J(c.en) + ' ' + (cl ? op.cl : op.en), ptCl = c.pt + ' ' + (cl ? op.clpt : op.pt);
  return {
    tipo, op, en: ' ' + enCl, enCl, ptCl, ini,
    ptJuntar: pt1 => pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + o2FimPT(pt1),
    estrutura: cl ? '+ ' + c.en + ' + oração (sujeito + verbo)' : '+ ' + c.en + ' + substantivo',
    nota: tipo.nota + (cl ? '<br><b>' + o2Cap(c.en) + '</b> é seguido de <b>oração</b> completa; o verbo dela fica no tempo do que foi dito ou combinado (aqui, “' + op.cl + '”), não no da principal.' + (c.en === 'just as' ? ' <b>Just as</b> reforça: “exatamente como”.' : '')
      : '<br><b>' + o2Cap(c.en) + '</b> é preposição: vem antes de <b>substantivo</b> (“' + op.en + '”), nunca de oração.' + (c.en === 'as per' ? ' É formal e comum em contratos e e-mails de trabalho.' : '')) + (ini ? O2_INI_NOTA(c) : '')
  };
}
/* ---- v101: proporcional ---- */
function o2PropEstado(){
  if(state.formato !== 'afirmativa') return { ok:false, msg:'Proporcional pede a principal <b>afirmativa</b> (“The more she works…”).' };
  if(state.tempo === 'future' || state.aspecto !== 'simples') return { ok:false, msg:'Proporcional pede <b>presente ou passado simples</b>: no futuro o inglês usa o presente na 1ª parte (“The more she works, the more she <i>will</i> earn”) — o motor ainda não monta essa combinação.' };
  if(midList().length) return { ok:false, msg:'Palavras-sinal de frequência (always, often…) não cabem depois de “the more”. Tire-as do passo ⑥ ou escolha outro tipo.' };
  return { ok:true };
}
function o2ComporProp(tipo, o, c, op, pr){
  if(!o2PropEstado().ok) return null;
  const tp = state.tempo, k = o.conj;
  const [m1, m2] = [['more', 'more'], ['less', 'less'], ['more', 'less'], ['less', 'more']][k] || ['more', 'more'];
  const cl2 = lowerFirstMarked(generate('fact', tp, 'simples', 'afirmativa', pr, verbById(op.v)).text);
  let pt2 = translate('fact', tp, 'simples', 'afirmativa', pr, null, [], op.v, null, null).replace(/[.?!]\s*$/, '');
  pt2 = pt2.charAt(0).toLowerCase() + pt2.slice(1);
  if(op.v === 'save') pt2 = pt2.replace(/\b(salv|Salv)/, m => m[0] === 'S' ? 'Economiz' : 'economiz');
  const lowP = t => t.charAt(0).toLowerCase() + t.slice(1), q = op.q ? op.q + ' ' : '', ptq = op.ptq ? op.ptq + ' ' : '';
  const out = {
    tipo, op, enCl: cl2, ptCl: pt2, ini: false, en: '',
    ptJuntar: pt1 => pt1,
    estrutura: k <= 3 ? 'The ' + m1 + ' + oração, the ' + m2 + ' + oração' : 'As + oração, oração + more',
    nota: tipo.nota
  };
  if(k <= 3){
    out.composeEN = main => upperFirstMarked(J('the ' + m1) + ' ' + lowerFirstMarked(main)) + ', ' + J('the ' + m2) + ' ' + q + cl2;
    out.composePT = pt1 => { const f = o2FimPT(pt1), b = pt1.replace(/[.?!]\s*$/, ''); return 'Quanto ' + (m1 === 'more' ? 'mais' : 'menos') + ' ' + lowP(b) + ', ' + (m2 === 'more' ? 'mais' : 'menos') + ' ' + ptq + pt2 + f; };
    out.nota += '<br>Repita o <b>the</b> nas duas partes e mantenha a ordem sujeito + verbo (sem inversão). A quantidade vem logo depois de <i>the ' + m2 + '</i>' + (op.q ? ': “the ' + m2 + ' <b>' + op.q + '</b> ' + lowerFirstMarked(stripMarks(cl2)) + '”' : '') + '. Misturar more/less é normal: “the less I sleep, the more I worry”.';
  } else {
    out.composeEN = main => upperFirstMarked(J('as') + ' ' + lowerFirstMarked(main)) + ', ' + cl2 + ' ' + J('more') + (op.q ? ' ' + op.q : '');
    out.composePT = pt1 => { const f = o2FimPT(pt1), b = pt1.replace(/[.?!]\s*$/, ''); return 'À medida que ' + lowP(b) + ', ' + pt2 + ' mais' + (op.ptq ? ' ' + op.ptq : '') + f; };
    out.nota += '<br><b>As</b> progressivo (“à medida que”): a mudança é simultânea e gradual; aqui não se repete o <i>the</i>, e o “more” vem no fim da 2ª oração. Não confunda com <i>as</i> causal ou temporal.';
  }
  return out;
}
/* ---- v103: consecutiva intensiva ---- */
function o2ComporCsq(tipo, o, c, op, cpl, pr){
  const adv = o2TemaTab(O2_CMP, verbById(state.verbo))[o.opt] || o2TemaTab(O2_CMP, verbById(state.verbo))[0];
  const r = o2Clausula(op, cpl, pr, state.tempo, 'simples', o.neg, 'ind');
  const enCl = c.en === 'so … that' ? J('so') + ' ' + adv.en + ' ' + J('that') + ' ' + r.en : J(c.en) + ' ' + r.en;
  const ptCl = (c.en === 'so … that' ? o2CmpPT(adv, 'eq') + ' que' : c.pt) + ' ' + r.pt;
  return {
    tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
    ptJuntar: pt1 => pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + o2FimPT(pt1),
    estrutura: c.en === 'so … that' ? '+ so + advérbio + that + sujeito + verbo' : '+ ' + c.en + ' + sujeito + verbo',
    nota: tipo.nota + (c.en === 'so … that' ? '<br>O advérbio (<b>' + adv.en + '</b>) vem do tema do verbo.' : '')
  };
}
/* ---- v107: apositiva ---- */
/* ================= v131: SUJEITO CONCRETO das orações substantivas =================
   Antes, toda substantiva dizia "it is + adjetivo" ("She knows that it is difficult"), com um "it" sem referente.
   Agora o aluno pode trocar o "it" por um assunto concreto, que vem em PAR com o adjetivo que combina com ele
   ("the test is difficult", "the price is high"): o par é indivisível para nunca gerar "the price is tiring".
   state.o2.q = chave do par (null = "it" genérico, o comportamento de sempre). Vale para: objetiva direta,
   objetiva indireta (how / whether), completiva nominal e apositiva (: that).
   Linha: chave|sujeito EN|sujeito PT|adjetivo EN|adjetivo PT (já concordando)|temas em que aparece no console ("*" = todos) */
const O2_Q_TXT = `test|the test|a prova|difficult|difícil|estudo mente
lesson|the lesson|a lição|long|longa|estudo
book|the book|o livro|confusing|confuso|estudo mente
idea|the idea|a ideia|confusing|confusa|mente arte
answer|the answer|a resposta|unclear|incerta|mente fala
problem|the problem|o problema|complex|complexo|mat tech mente
price|the price|o preço|high|alto|compra troca
deal|the deal|o acordo|risky|arriscado|troca juiz
cost|the cost|o custo|uncertain|incerto|compra lei casa
market|the market|o mercado|uncertain|incerto|troca compra
job|the job|o trabalho|stressful|estressante|trab
deadline|the deadline|o prazo|tight|apertado|trab fazer
project|the project|o projeto|hard|difícil|fazer arte trab
system|the system|o sistema|slow|lento|tech
update|the update|a atualização|risky|arriscada|tech
conversation|the conversation|a conversa|awkward|constrangedora|fala afeto
truth|the truth|a verdade|painful|dolorosa|afeto fala
trip|the trip|a viagem|tiring|cansativa|move natureza
training|the training|o treino|tough|duro|esporte corpo
race|the race|a corrida|tough|dura|esporte
routine|the routine|a rotina|tiring|cansativa|corpo casa comida
decision|the decision|a decisão|complicated|complicada|juiz lei muda
change|the change|a mudança|risky|arriscada|muda
recipe|the recipe|a receita|slow|demorada|comida
gift|the gift|o presente|expensive|caro|compra
offer|the offer|a oferta|complicated|complicada|troca
service|the service|o serviço|expensive|caro|trab compra
budget|the budget|o orçamento|tight|apertado|compra casa
plan|the plan|o plano|risky|arriscado|*
task|the task|a tarefa|hard|difícil|*`;
const O2_Q = {};
O2_Q_TXT.split('\n').forEach(l => { const [k, s, sp, a, ap, tm] = l.split('|'); O2_Q[k] = { k, s, sp, a, ap, tm: tm.split(' ') }; });
/* pares oferecidos no console para o verbo atual: os do tema do verbo primeiro, depois os gerais ("*"); no máximo 4 */
function o2QLista(v){
  const cats = verbCats(v), todos = Object.values(O2_Q);
  const doTema = todos.filter(q => q.tm.some(t => cats.includes(t))), gerais = todos.filter(q => q.tm.includes('*'));
  return doTema.concat(gerais).slice(0, 4);
}
/* a conjunção efetiva aceita sujeito concreto? (apositiva só com ": that"; indireta só com how / whether) */
function o2QCabe(k, e){ return k === 'obj' || k === 'cn' || (k === 'ap' && e === ': that') || (k === 'oi' && (e === 'how' || e === 'whether')); }
/* miolo "sujeito + be + adjetivo" nas duas línguas: com par escolhido usa o par; sem par, o "it" + adjetivo de sempre */
function o2Miolo(o, adj, be, ptBe, neg){
  const q = o.q ? O2_Q[o.q] : null;
  return q ? { q, en: q.s + ' ' + M(be) + ' ' + q.a, pt: q.sp + ' ' + (neg ? 'não ' : '') + ptBe + ' ' + q.ap, suj: q.s }
           : { q: null, en: 'it ' + M(be) + ' ' + adj.en, pt: (neg ? 'não ' : '') + ptBe + ' ' + adj.pt, suj: 'it' };
}
function o2ComporAp(tipo, o, c, op, pr){
  const st = o2ApEstado(); if(!st.ok) return null;
  const verb = verbById(state.verbo), e = st.d.c.includes(c.en) ? c.en : st.d.c[0], past = state.tempo === 'past', neg = o.neg;
  const np = R('one ' + op.en);
  let enCl, ptCl, extra = '';
  if(e === ': that'){
    const adjs = o2TemaDe(verb, 'A'), adj = adjs[o.opt % adjs.length]; if(!adj) return null;
    const subjPT = ['possibility', 'hope', 'concern'].includes(op.en), ptBe = subjPT ? (past ? 'fosse' : 'seja') : (past ? 'era' : 'é');
    const be = neg ? (past ? "wasn't" : "isn't") : (past ? 'was' : 'is');
    const mi = o2Miolo(o, adj, be, ptBe, neg);            /* v131: sujeito concreto opcional */
    enCl = np + ': ' + J('that') + ' ' + mi.en;
    ptCl = op.pt + ': que ' + mi.pt;
    if(subjPT) extra = ' Em português este substantivo pede <b>subjuntivo</b> (“que ' + ptBe + '”).';
  } else {
    const ss = o2TemaDe(verb, 'S').filter(x => x.v !== verb.id), sv = ss[o.opt % (ss.length || 1)]; if(!sv) return null;
    const v2 = verbById(sv.v), pv = PT_VERBS[sv.v]; if(!pv || !pv.inf) return null;
    enCl = np + ': ' + (neg ? 'not ' : '') + J('to') + ' ' + nomeV(v2) + (sv.en ? ' ' + sv.en : '');
    ptCl = op.pt + ': ' + (neg ? 'não ' : '') + (sv.v === 'save' ? 'economizar' : pv.inf) + (sv.pt ? ' ' + sv.pt : '');   /* save + dinheiro/tempo = economizar */
  }
  return {
    tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
    ptJuntar: pt1 => pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + o2FimPT(pt1),
    estrutura: e === ': that' ? '+ one + ' + op.en + ' : that + ' + (o.q && O2_Q[o.q] ? 'sujeito' : 'it') + ' + be + adjetivo' : '+ one + ' + op.en + ' : to + verbo',
    nota: tipo.nota + '<br>Com <b>' + nomeV(verb) + '</b> o substantivo natural é <b>' + op.en + '</b>' + (e !== c.en ? ' — o motor trocou <b>' + c.en + '</b> por <b>' + e + '</b>, que é o que este verbo aceita' : '') + '.' + extra
  };
}
/* ---- v105: completiva nominal ---- */
function o2ComporCn(tipo, o, c, op, pr){
  const st = o2CnEstado(); if(!st.ok) return null;
  const adjs = o2TemaDe(verbById(state.verbo), 'A'), adj = adjs[o.opt % adjs.length];
  if(!adj) return null;
  const past = state.tempo === 'past', neg = o.neg;
  const be = neg ? (past ? "wasn't" : "isn't") : (past ? 'was' : 'is'), subjPT = ['possibility', 'hope', 'concern'].includes(op.en), ptBe = subjPT ? (past ? 'fosse' : 'seja') : (past ? 'era' : 'é');   /* esperança/possibilidade/preocupação pedem subjuntivo */
  const mi = o2Miolo(o, adj, be, ptBe, neg);              /* v131: sujeito concreto opcional */
  const enCl = R('the ' + op.en) + ' ' + J('that') + ' ' + mi.en;
  const ptCl = op.pt + ' de que ' + mi.pt;
  return {
    tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
    ptJuntar: pt1 => pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + o2FimPT(pt1),
    estrutura: '+ the ' + op.en + ' + that + ' + (mi.q ? 'sujeito' : 'it') + ' + be + adjetivo',
    nota: tipo.nota + '<br>Com <b>' + nomeV(verbById(state.verbo)) + '</b> o substantivo natural é <b>' + op.en + '</b>; a oração depois do <i>that</i> traz o conteúdo (“that ' + stripMarks(mi.en) + '”).' + (subjPT ? ' Em português este substantivo pede <b>subjuntivo</b> (“de que ' + ptBe + '”).' : '')
  };
}
/* ---- v104: objetiva indireta ---- */
function o2ComporOi(tipo, o, c, op, pr){
  const st = o2OiEstado(); if(!st.ok) return null;
  const e = st.d.c.includes(c.en) ? c.en : st.d.c[0], past = state.tempo === 'past', neg = o.neg && e !== 'how';
  const be = neg ? (past ? "wasn't" : "isn't") : (past ? 'was' : 'is'), ptBe = past ? 'era' : 'é', pre = R(st.d.p);
  let enCl, ptCl;
  const qq = o.q ? O2_Q[o.q] : null;                       /* v131: sujeito concreto opcional ("how difficult the test is") */
  if(e === 'how'){ enCl = pre + ' ' + J('how') + ' ' + (qq ? qq.a + ' ' + qq.s : op.en + ' it') + ' ' + M(be); ptCl = st.d.pp + ' como ' + (qq ? qq.sp + ' ' + ptBe + ' ' + qq.ap : ptBe + ' ' + op.pt); }
  else if(e === 'whether'){ const mi = o2Miolo(o, op, be, ptBe, neg); enCl = pre + ' ' + J('whether') + ' ' + mi.en; ptCl = st.d.pp + ' se ' + mi.pt; }
  else {
    const v2 = verbById(op.v), pv = PT_VERBS[op.v]; if(!pv || !pv.inf) return null;
    enCl = pre + ' ' + (neg ? 'not ' : '') + J(v2.ing) + (op.en ? ' ' + op.en : '');
    ptCl = st.d.pp + ' ' + (neg ? 'não ' : '') + (op.v === 'save' ? 'economizar' : pv.inf) + (op.pt ? ' ' + op.pt : '');
  }
  return {
    tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
    ptJuntar: pt1 => pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + o2FimPT(pt1),
    estrutura: e === '-ing' ? '+ ' + st.d.p + ' + verbo-ing' : '+ ' + st.d.p + ' + ' + e + ' + ' + (qq ? 'sujeito' : 'it') + ' + be + adjetivo',
    nota: tipo.nota + '<br>Com <b>' + nomeV(verbById(state.verbo)) + '</b> a preposição é <b>' + st.d.p + '</b> (em português, “' + st.d.pp + '”).' + (e !== c.en ? '<br>O motor trocou <b>' + c.en + '</b> por <b>' + e + '</b>: este verbo só aceita ' + st.d.c.join(' / ') + '.' : '') + (e === 'how' ? '<br>Com <b>how</b> a oração fica afirmativa (a polaridade não se aplica).' : '')
  };
}
/* ---- v103: substantivas subjetiva e predicativa ---- */
function o2BeForma(){ return state.tempo === 'past' ? { en:'was', pt:'Era' } : state.tempo === 'future' ? { en:'will be', pt:'Será' } : { en:'is', pt:'É' }; }
function o2ComporSubj(tipo, o, c, op, verb){
  const be = o2BeForma(), lowP = t => t.charAt(0).toLowerCase() + t.slice(1);
  if(o.conj === 0){
    return {
      tipo, op, enCl: '', ptCl: '', en: '', ini: false, ptJuntar: pt1 => pt1,
      composeEN: main => 'It ' + be.en + ' ' + op.en + ' ' + J('that') + ' ' + lowerFirstMarked(main),
      composePT: pt1 => { const f = o2FimPT(pt1); return be.pt + ' ' + op.pt + ' que ' + lowP(pt1.replace(/[.?!]\s*$/, '')) + f; },
      estrutura: 'It + be + adjetivo + that + oração', nota: tipo.nota + '<br>Adjetivos de <b>certeza</b> (true, clear, obvious) levam verbo no <b>indicativo</b> também em português: “é claro que ela trabalha”.'
    };
  }
  /* to + verbo: usa só o verbo e a colocação (a frase vira geral — sem pronome/tempo próprios) */
  const col = state.colocacao !== null ? (verb.col || [])[state.colocacao] : null, pv = PT_VERBS[verb.id];
  if(!pv || !pv.inf) return null;
  const enVP = nomeV(verb) + (col ? ' ' + col.en : ''), ptVP = pv.inf + (col && col.pt ? ' ' + col.pt : '');
  return {
    tipo, op, enCl: '', ptCl: '', en: '', ini: false, ptJuntar: pt1 => pt1,
    composeEN: () => 'It ' + be.en + ' ' + op.en + ' ' + J('to') + ' ' + enVP,
    composePT: () => be.pt + ' ' + op.pt + ' ' + ptVP + '.',
    estrutura: 'It + be + adjetivo + to + verbo',
    nota: tipo.nota + '<br>Com <b>to</b> a frase fica <b>geral</b>: pronome, aspecto e negação da principal não entram (“it is important to work” vale para qualquer pessoa).'
  };
}
function o2ComporPred(tipo, o, c, op){
  const be = o2BeForma(), lowP = t => t.charAt(0).toLowerCase() + t.slice(1);
  return {
    tipo, op, enCl: '', ptCl: '', en: '', ini: false, ptJuntar: pt1 => pt1,
    composeEN: main => 'The ' + op.en + ' ' + be.en + ' ' + J('that') + ' ' + lowerFirstMarked(main),
    composePT: pt1 => { const f = o2FimPT(pt1); return o2Cap(op.pt) + ' ' + be.pt.toLowerCase() + ' que ' + lowP(pt1.replace(/[.?!]\s*$/, '')) + f; },
    estrutura: 'The + substantivo + be + that + oração', nota: tipo.nota
  };
}
/* ---- v135: composição das reduzidas (forma 'V') ---- */
function o2ComporRed(tipo, o, c, op, pr){
  const neg = o.neg, k = tipo.k, past = state.tempo === 'past';
  const fimPT = pt1 => { const m = pt1.match(/[.?!]\s*$/); return m ? m[0].trim() : '.'; };
  const semFim = pt1 => pt1.replace(/[.?!]\s*$/, '');
  if(k === 'rger'){
    const s = o2RedSplit(op, pr), e = c.en, sem = e === 'without', n = neg && !sem;
    const ing = o2EnIng(s.w), nt = n ? 'not ' : '', pn = n ? 'não ' : '';
    let enCl, ptCl, est, extra = '';
    if(e === '(só -ing)'){ enCl = nt + J(ing) + s.rest; ptCl = pn + o2PtGer(s.pw) + s.prest; est = '+ verbo-ing, + oração principal (mesmo sujeito)'; extra = '<br>Sem conjunção, o -ing abre a frase e dá o <b>modo</b> ou a <b>causa</b> ("Working hard, she improves"). Em português é o gerúndio: "Trabalhando muito, ela melhora".'; }
    else if(e === 'having'){ enCl = (n ? 'not ' : '') + J('having') + ' ' + o2EnPP(s.w) + s.rest; ptCl = pn + 'tendo ' + o2PtPart(s.pw) + s.prest; est = '+ having + particípio, + oração principal'; extra = '<br><b>Having + particípio</b> mostra que a ação reduzida aconteceu <b>antes</b> da principal ("Having saved money, she buys a car"). Em português: <b>tendo</b> + particípio.'; }
    else {
      enCl = J(e) + ' ' + nt + ing + s.rest;
      const preps = { while:'', after:'depois de ', before:'antes de ', upon:'ao ', by:'', without:'sem ' };
      const gerPT = (e === 'while' || e === 'by');
      ptCl = (preps[e] || '') + pn + (gerPT ? o2PtGer(s.pw) : s.pw) + s.prest;
      est = '+ ' + e + ' + verbo-ing';
      if(e === 'while') extra = '<br><b>While</b> + -ing = duas ações <b>ao mesmo tempo</b>, com o mesmo sujeito ("She works while listening to music"). Em português basta o gerúndio: "trabalha ouvindo música".';
      else if(e === 'after' || e === 'before') extra = '<br><b>' + o2Cap(e) + '</b> + -ing marca a <b>ordem</b> das ações com o mesmo sujeito. Em português usa-se <b>' + (e === 'after' ? 'depois de' : 'antes de') + '</b> + infinitivo.' + (e === 'after' ? ' Abre bem a frase: "After finishing, she rests."' : '');
      else if(e === 'upon') extra = '<br><b>Upon</b> + -ing (ou <i>on</i> + -ing) = “assim que”, mais formal: "Upon arriving, she calls". Em português: <b>ao</b> + infinitivo ("ao chegar").';
      else if(e === 'by') extra = '<br><b>By</b> + -ing diz o <b>meio</b> ("como?"): "She learns by reading". Em português: gerúndio ("aprende lendo").';
      else if(e === 'without') extra = '<br><b>Without</b> + -ing já é negativo ("sem fazer"): não se acrescenta <i>not</i>.' + (neg ? ' A polaridade negativa não se aplica aqui.' : '');
      if(neg && !sem) extra += '<br>Para negar a reduzida, o <b>not</b> vem antes do -ing: <i>' + e + ' not ' + ing + '</i>.';
      if(e === 'while' || e === 'after' || e === 'before'){
        const dev = o2RedDev(s.w, s.rest, pr, n); if(dev) extra += '<br>🔄 Forma desenvolvida: <i>' + e + ' ' + dev + '</i>' + (past || state.tempo === 'present' ? '' : ' (o futuro vira presente)') + '.';
      }
    }
    return {
      tipo, op, en: ' ' + enCl, enCl, ptCl, ini: o2IniEf(tipo, c),
      ptJuntar: pt1 => semFim(pt1) + ' ' + ptCl + fimPT(pt1),
      estrutura: est, nota: tipo.nota + extra + (o2IniEf(tipo, c) ? O2_INI_NOTA(c) : '')
    };
  }
  if(k === 'rpart'){
    const sem = c.en === '(só -ed)', nt = neg ? 'not ' : '';
    const form = o2PtPartConc(op, pr);
    const enCl = sem ? nt + J(op.en) : J(c.en) + ' ' + nt + op.en;
    const ptCl = (op.inv && neg) ? c.pt + ' não for necessário' : (sem ? '' : c.pt + ' ') + (neg ? 'não ' : '') + form;   /* “se não for necessário” */
    const be = pr === 'I' ? (past ? 'was' : 'am') : ((pr === 'We' || pr === 'They' || pr === 'You') ? (past ? 'were' : 'are') : (past ? 'was' : 'is'));
    const sub = pr === 'I' ? 'I' : pr.toLowerCase();
    const dev = (sem ? 'because ' : c.en + ' ') + sub + ' ' + be + ' ' + nt + op.en;
    return {
      tipo, op, en: ' ' + enCl, enCl, ptCl, ini: o2IniEf(tipo, c),
      ptJuntar: pt1 => semFim(pt1) + ', ' + ptCl + fimPT(pt1),
      estrutura: sem ? '+ particípio, + oração principal' : '+ ' + c.en + ' + particípio, + oração principal',
      nota: tipo.nota + '<br>🔄 Forma desenvolvida: <i>' + dev + '</i> — corte <b>' + sub + ' ' + be + '</b> e sobra o particípio.' + (op.inv ? '<br>“Se necessário” é invariável em português; os demais particípios concordam com o sujeito.' : '') + (o2IniEf(tipo, c) ? O2_INI_NOTA(c) : '')
    };
  }
  if(k === 'rinf'){
    const st = o2RinfEstado(); if(!st.ok) return null;
    const e = st.d.c.includes(c.en) ? c.en : st.d.c[0], s = o2RedSplit(op, pr), nt = neg ? 'not ' : '';
    const enCl = e === 'to' ? nt + J('to') + ' ' + s.w + s.rest : nt + J(o2EnIng(s.w)) + s.rest;
    const ptCl = (st.d.prep ? st.d.prep + ' ' : '') + (neg ? 'não ' : '') + s.pw + s.prest;
    const nome = nomeV(verbById(state.verbo));
    const nota = tipo.nota + '<br><b>' + nome + '</b> pede <b>' + (st.d.c.length === 2 ? 'to + verbo ou verbo-ing' : e === 'to' ? 'to + verbo' : 'verbo-ing') + '</b>.' +
      (e !== c.en ? '<br>O motor trocou <b>' + c.en + '</b> por <b>' + e + '</b>: este verbo só aceita ' + st.d.c.join(' / ') + '.' : '') +
      (neg ? '<br>Para negar a reduzida o <b>not</b> vem antes do <b>' + (e === 'to' ? 'to' : '-ing') + '</b>: “decide <i>not to</i> save”.' : '') +
      '<br>🔄 Forma desenvolvida: <i>' + nome + ' that ' + (pr === 'I' ? 'I' : pr.toLowerCase()) + ' …</i> — só funciona quando o sujeito muda; com o <b>mesmo sujeito</b> o inglês reduz.';
    return {
      tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
      ptJuntar: pt1 => { const p = st.d.sub ? pt1.split(st.d.sub[0]).join(st.d.sub[1]) : pt1; return semFim(p) + ' ' + ptCl + fimPT(p); },   /* enjoy: o PT do verbo é "gostar de" */
      estrutura: e === 'to' ? '+ ' + nome + ' + to + verbo base' : '+ ' + nome + ' + verbo-ing', nota
    };
  }
  /* rrel */
  const st = o2RelEstado(true); if(!st.ok) return null;
  const verb = verbById(state.verbo), c1 = (verb.col || [])[state.colocacao], def = o2ObjDef(c1) || o2RelPrepPessoa(c1) || {};
  /* gênero e número do substantivo em PORTUGUÊS: pelo artigo; sem artigo ("pessoas novas", "mantimentos"), pelo final da 1ª palavra */
  const art = ((def.pt || '').trim().toLowerCase().split(' ')[0]), temArt = /^(o|a|os|as|um|uma|uns|umas)$/.test(art);
  const fem = temArt ? /^(a|as|uma|umas)$/.test(art) : /(a|as|ão|ões|ade|ades)$/.test(art) && !/(o|os)$/.test(art);
  const plu = temArt ? /^(os|as|uns|umas)$/.test(art) : /s$/.test(art);
  const e = c.en, sub = pr === 'I' ? 'I' : pr.toLowerCase();
  const i = op.en.indexOf(' '), w1 = i < 0 ? op.en : op.en.slice(0, i), r1 = i < 0 ? '' : op.en.slice(i);
  const enCl = J(w1) + r1;
  let ptCl;
  if(e === '-ed'){ const b = fem ? op.pf : op.pm; ptCl = (plu && !/[ãõ]o$/.test(b) ? b + 's' : b) + op.rest; }
  else ptCl = (plu && op.ptp) ? op.ptp : op.pt;
  const nota = tipo.nota + '<br>🔄 Forma desenvolvida: <i>' + (def.en || 'the noun') + ' ' + op.full.replace('{s}', sub) + '</i>.' +
    (e === '-ed' ? '<br>O particípio concorda com o substantivo em português (“' + (fem ? 'feita' : 'feito') + '…”).' : '') +
    (e === '-ing' ? '<br>Em português o gerúndio adjetivo soa estranho; use “que + verbo”.' : '');
  return {
    tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
    ptJuntar: pt1 => semFim(pt1) + ' ' + ptCl + fimPT(pt1),
    estrutura: tipo.est, nota
  };
}
function o2Compor(){
  o2Norm();
  const o = state.o2, tipo = O2_TIPOS.find(t => t.k === o.tipo);
  if(!tipo) return null;
  const bl = o2Bloqueio();
  if(bl.off || (bl.soFinal && tipo.k !== 'final' && tipo.k !== 'oq')) return null;   /* v161: "Do you know where she lives?" */
  const verb = verbById(state.verbo);
  const ops = o2Opcoes(tipo.k, verb, o.conj);
  let op = (o.custom && !['conc', 'rel', 'relx', 'obj', 'cmp', 'conf', 'prop', 'subj', 'pred', 'oi', 'cn', 'ap', 'rger', 'rpart', 'rinf', 'rrel'].includes(tipo.k)) ? (tipo.k === 'final' ? { en: nomeV(verbById(o.custom)), pt: ((PT_VERBS[o.custom] || {}).inf || '…'), src:'livre' } : { v:o.custom, neg:false, en:'', pt:'', src:'livre' }) : (ops[o.opt] || ops[0]);
  if(!op) return null;
  const c = tipo.conjs[o.conj] || tipo.conjs[0], pr = state.pronome;
  /* v89.1: complemento vindo das colocações do próprio verbo 2 (só quando a opção não traz objeto pronto) */
  const v2id = o.custom || op.v || null;
  let cpl = null;
  /* v121: c2 null = AUTOMÁTICO: antônimo/sinônimo/aditiva (but, or, and) herdam o OBJETO da principal quando o verbo 2 é transitivo E há
     afinidade (✓ curada ou o próprio verbo 2 tem esse objeto nas colocações): "buys a car, but sells the car". Sem afinidade ou sem objeto na
     principal nada é inventado (evita "informs the story"). 'none' = "sem complemento" escolhido. */
  let selC2 = o.c2;
  if(o2PrecisaCpl(tipo.k, op) && v2id && selC2 === null){
    const c1a = state.colocacao !== null ? (verb.col || [])[state.colocacao] : null;
    selC2 = (c1a && (tipo.k === 'adv' || tipo.k === 'adit' || tipo.k === 'alt') && o2ObjDef(c1a) && o2Transitivo(verbById(v2id)) && o2Afin(verb, verbById(v2id))) ? 'same' : 'none';
  }
  if(o2PrecisaCpl(tipo.k, op) && v2id && selC2 !== null && selC2 !== 'none'){
    if(selC2 === 'same'){
      const cm = (tipo.k === 'adv' || tipo.k === 'adit' || tipo.k === 'alt') && state.colocacao !== null ? o2ObjDef((verb.col || [])[state.colocacao]) : null;
      const v2 = verbById(v2id), c1 = (verb.col || [])[state.colocacao];
      /* afinidade ✓: o verbo 2 tem, entre as próprias colocações, o mesmo objeto → usa a PT dele (regência certa) */
      const aff = cm && (v2.col || []).find(c => o2ObjDef(c) && o2Head(c.en) === o2Head(c1.en));
      cpl = aff ? o2ObjDef(aff) : (cm && o2Transitivo(v2) ? { en: cm.en, pt: o2PtAdapt(cm.pt, v2) } : null);
    } else cpl = (verbById(v2id).col || [])[selC2] || null;
  }
  if(tipo.forma === 'G') return o2ComporOq(tipo, o, c, op, pr);       /* v161: pergunta indireta */
  if(tipo.forma === 'V') return o2ComporRed(tipo, o, c, op, pr);       /* v135: reduzidas */
  if(tipo.forma === 'X') return o2ComporAp(tipo, o, c, op, pr);       /* v107 */
  if(tipo.forma === 'W') return o2ComporCn(tipo, o, c, op, pr);       /* v105 */
  if(tipo.forma === 'I') return o2ComporOi(tipo, o, c, op, pr);       /* v104 */
  if(tipo.forma === 'U') return o2ComporSubj(tipo, o, c, op, verb);   /* v103 */
  if(tipo.forma === 'Y') return o2ComporPred(tipo, o, c, op);
  if(tipo.forma === 'Z') return o2ComporCsq(tipo, o, c, op, cpl, pr);   /* v103 */
  if(tipo.forma === 'D') return o2ComporCmp(tipo, o, c, op, pr);       /* v101 */
  if(tipo.forma === 'N') return o2ComporConf(tipo, o, c, op);
  if(tipo.forma === 'P') return o2ComporProp(tipo, o, c, op, pr);
  if(tipo.forma === 'S'){                                   /* v98: objetiva direta */
    const st = o2SubstEstado(); if(!st.ok) return null;
    const e = st.d.c.includes(c.en) ? c.en : st.d.c[0];
    const past = state.tempo === 'past', neg = o.neg, subj = !!(st.d.subj && st.d.subj.includes(e));
    const be = neg ? (past ? "wasn't" : "isn't") : (past ? 'was' : 'is');
    const ptV = subj ? (past ? 'fosse' : 'seja') : (past ? 'era' : 'é');
    const mi = o2Miolo(o, op, be, ptV, neg);              /* v131: sujeito concreto opcional */
    const enCl = J(e) + ' ' + mi.en, ptCl = (e === 'that' ? 'que' : 'se') + ' ' + mi.pt;
    const nota = '<b>Objetiva direta</b> — a oração inteira é o <b>objeto</b> do verbo (<i>' + nomeV(verbById(state.verbo)) + '</i>). ' +
      (e === 'that' ? 'Depois de verbos de pensar/dizer usa-se <b>that</b>, que pode ser <b>omitido</b> na fala ("She thinks it is expensive").' : '<b>If / whether</b> formam <b>pergunta indireta</b>: a oração mantém a ordem de afirmativa (it is — nunca "is it") e não leva ponto de interrogação.') +
      ' O verbo da oração mantém o tempo da frase (no passado, “backshift”: said that it <i>was</i>).' +
      (e !== c.en ? '<br>O motor trocou <b>' + c.en + '</b> por <b>' + e + '</b>: este verbo só aceita ' + st.d.c.join(' / ') + '.' : '') +
      (subj ? '<br>Em português este verbo pede <b>subjuntivo</b> ("' + ptV + '").' : '');
    return {
      tipo, op, en: ' ' + enCl, enCl, ptCl, ini: false,
      ptJuntar: pt1 => { const m = pt1.match(/[.?!]\s*$/), fim = m ? m[0].trim() : '.'; return pt1.replace(/[.?!]\s*$/, '') + ' ' + ptCl + fim; },
      estrutura: '+ ' + e + ' + ' + (mi.q ? 'sujeito' : 'it') + ' + be + adjetivo', nota
    };
  }
  if(tipo.forma === 'R'){                                   /* v97: relativa sobre o objeto da colocação */
    const st = o2RelEstado(); if(!st.ok) return null;
    const rv = O2_REL.find(x => x.v === op.v) || { prep:'' };
    const e = o2RelEf(c.en, st.tipo);                        /* who só pessoa · which só não-pessoa · where só lugar · when só tempo */
    const fmt = o.neg ? 'negativa' : 'afirmativa';
    let enCl, ptCl, ptPron = 'que';
    if(e === 'whose'){                                       /* v113: whose + substantivo possuído + be + adjetivo */
      const w = op.wh, tp = state.tempo, neg = o.neg;
      const be = neg ? (tp === 'past' ? "wasn't" : tp === 'future' ? "won't be" : "isn't") : (tp === 'past' ? 'was' : tp === 'future' ? 'will be' : 'is');
      const ser = (neg ? 'não ' : '') + (tp === 'past' ? 'era' : tp === 'future' ? 'será' : 'é');
      enCl = J('whose') + ' ' + w.n + ' ' + M(be) + ' ' + w.adj;
      ptPron = 'cuj' + (w.g === 'f' ? 'a' : 'o');
      ptCl = ptPron + ' ' + w.pt + ' ' + ser + ' ' + (w.g === 'f' ? w.f : w.m);
    } else {
      const g2 = generate('fact', state.tempo, 'simples', fmt, pr, verbById(op.v));
      let pt2 = translate('fact', state.tempo, 'simples', fmt, pr, null, [], op.v, null, null).replace(/[.?!]\s*$/, ''); pt2 = pt2.charAt(0).toLowerCase() + pt2.slice(1);
      ptPron = e === 'where' ? 'onde' : e === 'when' ? 'em que' : (rv.prep ? (st.pessoa ? 'de quem' : 'de que') : 'que');
      enCl = J(e) + ' ' + lowerFirstMarked(g2.text); ptCl = ptPron + ' ' + pt2;
    }
    const restr = tipo.k === 'rel';
    const nota = (restr
      ? '<b>Relativa restritiva</b> — o pronome relativo (<b>that / which / who</b>) diz <b>qual</b> substantivo: sem vírgula, e não pode ser retirada. Ele já faz o papel do objeto: "a laptop that she needs" (nunca "…that she needs it"). Pessoas: <b>who</b> ou that; coisas: <b>which</b> ou that. Como objeto, o pronome pode até sumir ("a laptop she needs").'
      : '<b>Relativa explicativa</b> — entre vírgula, acrescenta informação <b>extra</b> sobre um substantivo que já se sabe qual é; aqui <b>that</b> não se usa, só <b>which</b> (coisas) ou <b>who</b> (pessoas).')
      + (e === 'whose' ? '<br><b>Whose</b> indica POSSE e vem seguido do substantivo possuído ("a client <i>whose company</i> is successful"); vale para pessoas e coisas. Em português: <b>cujo/cuja</b>, que concorda com o possuído ("cuja empresa").' : '')
      + (e === 'where' ? '<br><b>Where</b> substitui <i>in/at which</i> e só vale para <b>lugares</b> ("the city where she works"): o verbo da relativa já traz o lugar, por isso não leva objeto nem preposição.' : '')
      + (e === 'when' ? '<br><b>When</b> só vale para <b>tempo</b> ("the day when she arrives") e equivale a <i>on/in which</i>; também pode ser omitido ou trocado por <i>that</i>. Português: "o dia <b>em que</b> ela chega".' : '')
      + (e !== c.en ? '<br>O motor trocou <b>' + c.en + '</b> por <b>' + e + '</b> porque o substantivo é ' + ({ pessoa:'uma pessoa', lugar:'um lugar', tempo:'um tempo', coisa:'uma coisa' })[st.tipo] + '.' : '')
      + (e !== 'whose' && e !== 'where' && e !== 'when' && rv.prep ? '<br>Em português o verbo ' + (op.v === 'need' ? '"precisar"' : '"gostar"') + ' pede preposição, que viaja com o pronome: <b>' + ptPron + '</b>.' : '');
    return {
      tipo, op, en: (c.vg ? ',' : '') + ' ' + enCl, enCl, ptCl, ini: false,
      ptJuntar: pt1 => { const m = pt1.match(/[.?!]\s*$/), fim = m ? m[0].trim() : '.'; return pt1.replace(/[.?!]\s*$/, '') + (c.vg ? ',' : '') + ' ' + ptCl + fim; },
      estrutura: tipo.est, nota
    };
  }
  if(tipo.forma === 'T' || tipo.forma === 'K' || tipo.forma === 'Q'){
    const r = o2ComporFinita(tipo, o, c, op, cpl, pr);
    if(!r) return null;                                   /* condicional incompatível com a principal: buildO2 mostra o aviso */
    return o2AplicaTr({
      tipo, op, en: ' ' + r.enCl, enCl: r.enCl, ptCl: r.ptCl, ini: o2IniEf(tipo, c),
      enBody: r.enCl.slice(J(c.en).length + 1), ptBody: r.ptCl.slice(c.pt.length + 1), ptInd: r.ptInd,
      ptJuntar: pt1 => { const m = pt1.match(/[.?!]\s*$/), fim = m ? m[0].trim() : '.'; return pt1.replace(/[.?!]\s*$/, '') + ' ' + r.ptCl + fim; },
      estrutura: r.est, nota: r.nota + (o2IniEf(tipo, c) ? O2_INI_NOTA(c) : ''), mainEN: r.mainEN, ptModo: r.ptModo
    }, tipo, c, o, pr, op, cpl);
  }
  let enConj = c.en, ptConj = c.pt, enCl, ptCl, notaX = '', estX = tipo.est;
  if(tipo.forma === 'A' && (c.en === 'so that' || c.en === 'in order that')){          /* v92: so that + sujeito próprio ("people can/could") */
    const pas = state.tempo === 'past';
    const md = o.neg ? (pas ? "couldn't" : "can't") : (pas ? 'could' : 'can');
    const sl = o2Sl2();
    enCl = J(c.en) + ' people ' + M(md) + ' ' + o2Sub(op.en, 'They') + (cpl ? ' ' + cpl.en : '') + o2EndsEN(sl);
    ptCl = (c.en === 'so that' ? 'para que' : 'a fim de que') + ' as pessoas ' + (o.neg ? 'não ' : '') + (pas ? 'pudessem' : 'possam') + ' ' + o2Sub(op.pt, 'They', true) + (cpl ? ' ' + cpl.pt : '') + o2EndsPT(sl);
    estX = '+ ' + c.en + ' + sujeito + can/could + verbo base';
    notaX = '<br><b>So that</b> pede <b>sujeito próprio</b> e um modal (<b>can</b>; <b>could</b> se a principal está no passado): "…so that people can save money". <b>In order that</b> é a versão formal (“a fim de que”). Aqui o sujeito é "people"; para o mesmo sujeito da principal prefira in order to. Português: <b>para que</b> + subjuntivo ("possam").';
  } else if(tipo.forma === 'A'){
    if(o.neg){ enConj = c.en === 'to' ? 'in order not to' : c.en.replace(/ to$/, ' not to'); ptConj = 'para não'; }
    const sl = o2Sl2();
    enCl = J(enConj) + ' ' + o2Sub(op.en, pr) + (cpl ? ' ' + cpl.en : '') + o2EndsEN(sl);
    ptCl = ptConj + ' ' + o2Sub(op.pt, pr, true) + (cpl ? ' ' + cpl.pt : '') + o2EndsPT(sl);
  } else {
    const neg = (tipo.k === 'adv' && !o.custom) ? !!op.neg : o.neg;   /* v152: verbo livre na adversativa → negação de o.neg */
    const fmt = neg ? 'negativa' : 'afirmativa';
    const asp = ((tipo.k === 'caus' || tipo.k === 'cons' || tipo.k === 'expl') && (state.aspecto === 'continuo' || state.aspecto === 'perfeito_continuo')) ? 'simples' : state.aspecto;
    const v2 = verbById(op.v);
    const g2 = generate('fact', state.tempo, asp, fmt, pr, v2);
    const sl = o2Sl2();                                  /* v108: encaixes escolhidos para a 2ª oração */
    /* meio entra no verbo (applySignal); fim vai depois do complemento */
    const g2t = sl.signalMids.length ? applySignal(g2.text, sl.signalMids, [], null, null, fmt) : g2.text;
    enCl = J(enConj) + ' ' + lowerFirstMarked(g2t) + (op.en ? ' ' + o2Sub(op.en, pr) : '') + (cpl ? ' ' + cpl.en : '') + o2EndsEN(sl);
    let pt2 = translate('fact', state.tempo, asp, fmt, pr, sl.signalMids.length ? sl.signalMids : null, [], op.v, null, null).replace(/[.?!]\s*$/, '');
    if(op.v === 'save') pt2 = pt2.replace(/\b(salv|Salv)/, m => m[0] === 'S' ? 'Economiz' : 'economiz').replace(/economizar|economiza|economizam|economizou/, x => x);
    pt2 = pt2.charAt(0).toLowerCase() + pt2.slice(1) + (op.pt ? ' ' + o2Sub(op.pt, pr, true) : '') + (cpl ? ' ' + cpl.pt : '') + o2EndsPT(sl);
    ptCl = ptConj + ' ' + pt2;
  }
  return o2AplicaTr({
    tipo, op, enCl, ptCl, ini: o2IniEf(tipo, c),
    enBody: enCl.slice(J(enConj).length + 1), ptBody: ptCl.slice(ptConj.length + 1),
    en: (c.vg ? ',' : '') + ' ' + enCl,
    ptJuntar: pt1 => { const m = pt1.match(/[.?!]\s*$/), fim = m ? m[0].trim() : '.'; return pt1.replace(/[.?!]\s*$/, '') + (c.vg ? ',' : '') + ' ' + ptCl + fim; },
    estrutura: estX, nota: tipo.nota + notaX + (o2IniEf(tipo, c) ? O2_INI_NOTA(c) : '')
  }, tipo, c, o, pr, op, cpl);
}
/* ---- dial ⑩ (recolhível, com caixas por família de oração) ---- */
let o2Aberto = false, o2Card = null, o2Busca = '', o2Fam = null, o2Gr = 0;
/* v89.1: caminho hierárquico igual ao da seção didática — Coordenada | Subordinada → (Substantiva | Adjetiva | Adverbial) → tipo.
   Fonte única: ORACOES. Tipos sem motor ainda aparecem, desativados, com a fase em que entram. */
/* v156: o dial passa a ser organizado pela OPERAÇÃO que a nova oração faz, não pela nomenclatura gramatical
   (que continua no subtítulo de cada tipo). As molduras que ABREM a frase (It is … that, The truth is that…) saíram
   daqui para o dial Ⓐ "Abertura da frase", no começo do console — nelas a frase montada vira o conteúdo da moldura. */
let o2Modo = 'periodo';                              /* 'periodo' = dial ⑩ · 'abertura' = dial Ⓐ */
const O2_ABERTURA = ['subj', 'pred'];
/* v157: a classificação GRAMATICAL manda (coordenação × subordinação; substantivas, adjetivas, adverbiais), e a
   operação entra como glosa ("o que ela faz"). Ordem tradicional: coordenadas → substantivas → adjetivas → adverbiais.
   gram = nome gramatical · nome = operação · eixo = coordenação/subordinação · dica = definição da família */
const O2_OPER = [
  { k:'juntar', eixo:'coord', gram:'Coordenadas', nome:'Juntar', ic:'🔗',
    dica:'Orações coordenadas: independentes entre si, ligadas por conjunção coordenativa — nenhuma faz parte da outra. Tipos: aditiva, adversativa, alternativa, conclusiva e explicativa.',
    subs:[{ rot:'Coordenadas sindéticas (com conjunção)', ks:['adit', 'adv', 'alt', 'cons', 'expl'] }] },
  { k:'completar', eixo:'sub', gram:'Substantivas', nome:'Completar', ic:'📦',
    dica:'Subordinadas substantivas: fazem o papel de um substantivo dentro da principal — objeto direto, objeto indireto, complemento nominal ou aposto. As que fazem papel de sujeito (subjetiva) e de predicativo ficam no dial Ⓐ, porque abrem a frase.',
    subs:[{ rot:'Desenvolvidas — conjunção integrante + verbo conjugado', ks:['obj', 'oq', 'oi', 'cn', 'ap'] }, { rot:'Reduzida — sem conjunção, verbo em to / -ing', ks:['rinf'] }] },
  { k:'detalhar', eixo:'sub', gram:'Adjetivas', nome:'Detalhar', ic:'🧷',
    dica:'Subordinadas adjetivas: fazem o papel de um adjetivo, coladas a um substantivo da principal. Restritiva (sem vírgula, diz qual) × explicativa (entre vírgulas, informação extra).',
    subs:[{ rot:'Desenvolvidas — pronome relativo + verbo conjugado', ks:['rel', 'relx'] }, { rot:'Reduzida — sem relativo, verbo em -ing / -ed / to', ks:['rrel'] }] },
  { k:'circ', eixo:'sub', gram:'Adverbiais', nome:'Circunstância', ic:'🧭',
    dica:'Subordinadas adverbiais: fazem o papel de um advérbio — dão a circunstância da principal. Tipos: causal, temporal, condicional, final, concessiva, consecutiva, comparativa, conformativa e proporcional.',
    subs:[{ rot:'Desenvolvidas — conjunção subordinativa + verbo conjugado', ks:['caus', 'temp', 'cond', 'final', 'conc', 'csq', 'cmp', 'conf', 'prop'] }, { rot:'Reduzidas — sem conjunção, verbo em -ing / -ed', ks:['rger', 'rpart'] }] } ];
const O2_OPER_MOLD = { k:'moldura', eixo:'sub', gram:'Substantivas que abrem a frase', nome:'Abrir com moldura', ic:'🖼',
  dica:'Subordinadas substantivas subjetiva (It is … that / to) e predicativa (The truth is that…): a moldura vem antes e a frase montada vira o sujeito ou o predicativo.',
  subs:[{ rot:'Subjetiva e predicativa', ks:O2_ABERTURA }] };
const O2_EIXOS = [['coord', 'Coordenação — orações independentes'], ['sub', 'Subordinação — uma oração faz parte da outra']];
/* nos outros motores (modais, montador) não há dial Ⓐ: lá as molduras continuam dentro do dial da 2ª oração */
function o2Familias(){ return o2Modo === 'abertura' ? [O2_OPER_MOLD] : (O2C ? O2_OPER.concat([O2_OPER_MOLD]) : O2_OPER); }
const o2KsDoModo = () => o2Familias().flatMap(f => f.subs.flatMap(s => s.ks));
function o2Deriva(){
  const fams = o2Familias();
  if(o2Fam !== null && fams.some(f => f.k === o2Fam)) return;
  o2Fam = o2Modo === 'abertura' ? 'moldura' : null;
  if(!state.o2.tipo) return;
  const f = fams.find(x => x.subs.some(s => s.ks.includes(state.o2.tipo))); if(f) o2Fam = f.k;
}
function o2Ativar(k, extra){
  o2Norm();
  const o = state.o2, mudou = o.tipo !== k;
  o.tipo = k;
  if(mudou){ o.conj = 0; o.opt = 0; o.neg = false; o.custom = null; o.c2 = null; o.cnd = null; o.tr = null; o.q = null; o.sj2 = null; o.tp2 = null; o.as2 = null; o.sl2 = { signalMids:[], signalEnds:[] }; }
  if(extra){ if('opt' in extra || 'custom' in extra || 'conj' in extra) o.c2 = null; Object.assign(o, extra); }
  o2Norm();
}
/* v100: sorteia tipo + conjunção + verbo, mas só aceita combinações que o motor consegue montar agora */
function o2Sorteia(){
  const bl = o2Bloqueio(); if(bl.off) return;
  const ks = o2KsDoModo(), pool = O2_TIPOS.filter(t => ks.includes(t.k) && !(bl.soFinal && t.k !== 'final' && t.k !== 'oq')), rnd = n => Math.floor(Math.random() * n), antes = JSON.stringify(state.o2);
  for(let i = 0; i < 80; i++){
    const t = pool[rnd(pool.length)];
    state.o2 = { tipo:t.k, opt:rnd(3), conj:rnd(t.conjs.length), neg:Math.random() < 0.2, custom:null, para:null, c2:null, cnd:null, tr:null, foco:1, sl2:{ signalMids:[], signalEnds:[] } };
    o2Norm();
    if(o2Compor()){
      /* v109: também sorteia 0–2 encaixes da 2ª oração, só entre as peças que valem para ela (tempo/aspecto próprios) */
      const pecas = o2PalavrasSinal2(o2Ctx2()), usados = new Set();
      for(let q = rnd(3); q > 0 && pecas.length; q--){
        const sw = pecas[rnd(pecas.length)], r = slotOf(sw);
        if(usados.has(r)) continue; usados.add(r);
        state.o2.sl2[sw.pl === 'end' ? 'signalEnds' : 'signalMids'].push(sw);
      }
      if(!o2Compor()) state.o2.sl2 = { signalMids:[], signalEnds:[] };
      o2Card = t.k; o2Fam = null; render(); return;
    }
  }
  state.o2 = JSON.parse(antes); render();
}
/* ================= v110: DIAL ⑩ EM QUALQUER MOTOR =================
   O dial da 2ª oração (buildO2/o2Compor/o2Sorteia…) lê e escreve `state` e chama render(). Em vez de duplicá-lo,
   cada motor (modais, montador da anatomia) é um CONTEXTO: um adaptador que diz qual é o tempo, aspecto, pronome,
   formato, verbo e onde mora a configuração da 2ª oração (o2) daquele motor. o2Em(ctx, fn) troca esses campos de
   `state` só durante fn, aponta render()/ids/estado visual do dial para o motor e restaura tudo no final — a
   configuração volta para o dono (ctx.salva). Os handlers do dial voltam a entrar no contexto (o2Envolve). */
let O2C = null, o2Ids = { body:'o2Body', toggle:'o2Toggle' };
const O2_SWAP = ['categoria', 'tempo', 'aspecto', 'pronome', 'formato', 'verbo', 'colocacao', 'whWord', 'o2', 'signalMids', 'signalEnds', 'signalSplit'];
function o2Em(C, fn){
  const prev = O2C, salvo = {}, rd = render, ids = o2Ids;
  const ui = { a:o2Aberto, c:o2Card, b:o2Busca, f:o2Fam, g:o2Gr };
  O2_SWAP.forEach(k => { salvo[k] = state[k]; });
  Object.assign(state, { categoria:'fact', whWord:null, signalMids:[], signalEnds:[], signalSplit:null }, C.get());
  o2Aberto = C.ui.a; o2Card = C.ui.c; o2Busca = C.ui.b; o2Fam = C.ui.f; o2Gr = C.ui.g;
  o2Ids = C.ids; render = C.render; O2C = C;
  try { return fn(); }
  finally {
    C.salva(state.o2);
    C.ui = { a:o2Aberto, c:o2Card, b:o2Busca, f:o2Fam, g:o2Gr };
    O2_SWAP.forEach(k => { state[k] = salvo[k]; });
    o2Aberto = ui.a; o2Card = ui.c; o2Busca = ui.b; o2Fam = ui.f; o2Gr = ui.g;
    o2Ids = ids; render = rd; O2C = prev;
  }
}
const o2Dentro = (C, fn) => C ? o2Em(C, fn) : fn();
/* handlers criados dentro do dial rodam depois, fora do contexto: cada um reentra nele */
function o2Envolve(box, C){
  box.querySelectorAll('*').forEach(el => {
    ['onclick', 'onkeydown'].forEach(ev => {
      const f = el[ev];
      if(typeof f === 'function' && !f.__o2){ const w = function(e){ return o2Em(C, () => f.call(el, e)); }; w.__o2 = 1; el[ev] = w; }
    });
  });
}
function buildO2(){
  buildO2Core();
  if(o2Modo === 'abertura'){ const box = document.getElementById(o2Ids.body); if(box) abEnvolve(box); return; }   /* v156 */
  if(O2C){
    const box = document.getElementById(o2Ids.body); if(box) o2Envolve(box, O2C);
  }
}
/* ================= v156: DIALS OPCIONAIS RECOLHÍVEIS =================
   Os dials obrigatórios (sujeito, categoria, verbo, tempo, aspecto, formato) ficam sempre abertos. Os opcionais
   viram uma linha só, com o que está escolhido ("④ Regência … · the car"), e abrem ao toque. O título continua
   sendo o mesmo elemento (alguns builds reescrevem o texto dele), então o resumo e a seta são reanexados a cada render. */
const DIAL_COLAPSA = {
  ptxGroup:{ padrao:true, resumo:() => { const v = ((document.getElementById('ptxIn') || {}).value || '').trim(); return v ? '“' + v.slice(0, 26) + (v.length > 26 ? '…' : '') + '”' : 'toque para escrever'; } },
  colDialGroup:{ padrao:false, resumo:() => {
    if(typeof o2Foco === 'function' && o2Foco() === 2) return '2ª oração';
    const c = colComPoss(colAtual(verbById(state.verbo))); return c ? c.en : 'nenhuma'; } },
  signalDialGroup:{ padrao:false, resumo:() => { const l = midList().concat(endList()); return l.length ? l.map(x => x.w).join(' · ') : 'nenhuma'; } }
};
let dialAberto = {}; try { dialAberto = JSON.parse(localStorage.getItem('pm_dials') || '{}') || {}; } catch(e){ dialAberto = {}; }
function dialEstaAberto(id){ return Object.prototype.hasOwnProperty.call(dialAberto, id) ? !!dialAberto[id] : DIAL_COLAPSA[id].padrao; }
function dialAlterna(id){ dialAberto[id] = !dialEstaAberto(id); try { localStorage.setItem('pm_dials', JSON.stringify(dialAberto)); } catch(e){} dialResumos(); }
function dialResumos(){
  Object.keys(DIAL_COLAPSA).forEach(id => {
    const g = document.getElementById(id); if(!g) return;
    const t = g.querySelector(':scope > .dial-group-title'); if(!t) return;
    const ab = dialEstaAberto(id);
    g.dataset.colapsa = '1'; g.dataset.fechado = String(!ab);
    t.classList.add('dial-toggle'); t.setAttribute('role', 'button'); t.tabIndex = 0; t.setAttribute('aria-expanded', String(ab));
    t.onclick = () => dialAlterna(id);
    t.onkeydown = e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); dialAlterna(id); } };
    let r = ''; try { r = DIAL_COLAPSA[id].resumo(); } catch(e){}
    let rs = t.querySelector('.dial-resumo'); if(!rs){ rs = document.createElement('span'); rs.className = 'o2-estado dial-resumo'; t.appendChild(rs); }
    let st = t.querySelector('.dial-seta'); if(!st){ st = document.createElement('span'); st.className = 'o2-seta dial-seta'; t.appendChild(st); }
    rs.textContent = ab ? '' : r; rs.dataset.on = String(!/^(nenhuma|toque)/.test(r)); st.textContent = ab ? '▾' : '▸';
  });
}
/* ---- v157: nota do motor recolhível ----
   No celular o cartão da frase fica fixo no topo; uma nota longa ocupava a tela e escondia a rolagem. Agora a nota
   mostra 2 linhas e abre ao toque (botão ou a própria nota). Em telas largas, onde há coluna própria, começa aberta.
   A escolha do usuário fica salva e vale para os dois motores (tempos e modais). */
let notaAberta = null; try { const v = localStorage.getItem('pm_nota'); if(v === '1' || v === '0') notaAberta = v === '1'; } catch(e){}
function notaEstaAberta(){ return notaAberta === null ? window.innerWidth >= 1000 : notaAberta; }
function notaAlterna(){ notaAberta = !notaEstaAberta(); try { localStorage.setItem('pm_nota', notaAberta ? '1' : '0'); } catch(e){} ['noteBox', 'modalNote'].forEach(id => notaMonta(document.getElementById(id))); if(typeof updateNavHeight === 'function') updateNavHeight(); }
function notaMonta(box){
  if(!box) return;
  const velho = box.querySelector('.nota-tg'); if(velho) velho.remove();
  if(!box.classList.contains('show')){ delete box.dataset.aberta; delete box.dataset.longa; box.onclick = null; return; }
  const ab = notaEstaAberta();
  box.dataset.aberta = String(ab); box.dataset.longa = 'false';
  /* só vira recolhível se o texto passar de ~2 linhas */
  const cheio = box.scrollHeight;
  box.dataset.aberta = 'false'; const curto = box.clientHeight; box.dataset.aberta = String(ab);
  if(cheio <= curto + 4){ box.dataset.aberta = 'true'; box.onclick = null; return; }
  box.dataset.longa = 'true';
  const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'nota-tg'; bt.setAttribute('aria-expanded', String(ab));
  bt.textContent = ab ? 'recolher ▴' : 'ver nota ▾';
  bt.onclick = e => { e.stopPropagation(); notaAlterna(); };
  box.appendChild(bt);
  box.onclick = ab ? null : () => notaAlterna();        /* recolhida: tocar em qualquer ponto abre */
}
/* ---- v156: dial Ⓐ "Abertura da frase" — mesmo dial da 2ª oração, filtrado para as molduras, com estado de tela próprio ---- */
const AB_UI = { a:false, c:null, b:'', f:'moldura', g:0 };
function abEm(fn){
  const ui = { a:o2Aberto, c:o2Card, b:o2Busca, f:o2Fam, g:o2Gr }, ids = o2Ids, modo = o2Modo, rd = render;
  let pediuRender = false;
  o2Aberto = AB_UI.a; o2Card = AB_UI.c; o2Busca = AB_UI.b; o2Fam = AB_UI.f; o2Gr = AB_UI.g;
  o2Ids = { body:'abBody', toggle:'abToggle' }; o2Modo = 'abertura';
  render = () => { pediuRender = true; };           /* o render de verdade roda depois, já fora do modo Ⓐ */
  try { return fn(); }
  finally {
    Object.assign(AB_UI, { a:o2Aberto, c:o2Card, b:o2Busca, f:o2Fam, g:o2Gr });
    o2Aberto = ui.a; o2Card = ui.c; o2Busca = ui.b; o2Fam = ui.f; o2Gr = ui.g; o2Ids = ids; o2Modo = modo; render = rd;
    if(pediuRender) render();
  }
}
function abEnvolve(box){
  box.querySelectorAll('*').forEach(el => {
    ['onclick', 'onkeydown'].forEach(ev => {
      const f = el[ev];
      if(typeof f === 'function' && !f.__ab){ const w = function(e){ return abEm(() => f.call(el, e)); }; w.__ab = 1; el[ev] = w; }
    });
  });
}
function buildAbertura(){ if(document.getElementById('abBody')) abEm(() => buildO2()); }
function abToggle(){ abEm(() => { o2Aberto = !o2Aberto; buildO2(); }); }
/* monta a frase final com a 2ª oração (mesma lógica do render principal, sem condicional 2/3) */
function o2Junta(o2, en, pt, fim){
  const baseEN = o2.mainEN ? o2.mainEN(en) : en;
  const raw = o2.composeEN ? o2.composeEN(baseEN) + fim : o2.ini ? upperFirstMarked(o2.enCl) + ', ' + lowerFirstMarked(baseEN) + fim : baseEN + o2.en + fim;
  let p2 = pt;
  if(o2.composePT) p2 = o2.composePT(pt);
  else if(o2.ini){
    const m = pt.match(/[.?!]\s*$/), f = m ? m[0].trim() : '.', corpo = pt.replace(/[.?!]\s*$/, '');
    p2 = o2.ptCl.charAt(0).toUpperCase() + o2.ptCl.slice(1) + ', ' + corpo.charAt(0).toLowerCase() + corpo.slice(1) + f;
  } else p2 = o2.ptJuntar(pt);
  return { raw, pt:p2 };
}
/* contexto do motor de MODAIS: o tempo modal vira tempo/aspecto do motor geral (a 2ª oração herda o tempo) */
const o2ModalTempo = k => k === 'future' ? 'future' : (k === 'present' ? 'present' : 'past');
/* v114: navegação própria do seletor de peças da 2ª oração (não mistura com a da principal) */
const MODAL_O2_PICK = { signalSlot:null, signalFam:null, signalBusca:'', signalMais:false }, MONT_O2_PICK = { signalSlot:null, signalFam:null, signalBusca:'', signalMais:false };
const O2_CTX_MODAL = {
  id:'modal', rotulo:'Ⓖ', ids:{ body:'o2ModalBody', toggle:'o2ModalToggle' }, ui:{ a:false, c:null, b:'', f:null, g:0 },
  get: () => ({ tempo:o2ModalTempo(modalState.tempo), aspecto:'simples', pronome:modalState.pronome, formato:modalState.formato, whWord:modalState.whWord, o2:modalState.o2 }),
  salva: o2 => { modalState.o2 = o2; }, render: () => renderModal()
};
/* contexto do MONTADOR da anatomia (pronome I; formato = o do montador) */
const MONT_O2 = { o2:null, fmt:'afirmativa' };
const O2_CTX_MONT = {
  id:'mont', rotulo:'➕', ids:{ body:'o2MontBody', toggle:'o2MontToggle' }, ui:{ a:false, c:null, b:'', f:null, g:0 },
  get: () => ({ tempo:MONT_COMBO.t, aspecto:MONT_COMBO.a, pronome:'I', formato:MONT_O2.fmt, verbo:MONT_COMBO.v, colocacao:null, o2:MONT_O2.o2 }),
  salva: o2 => { MONT_O2.o2 = o2; }, render: () => buildMontador()
};
/* liga o dial no contêiner do motor (botão-título + corpo) e o redesenha */
function o2MontaDial(C){
  const tg = document.getElementById(C.ids.toggle); if(!tg) return;
  tg.onclick = () => o2Em(C, () => { o2Aberto = !o2Aberto; buildO2(); });
  o2Em(C, () => buildO2());
}
function buildO2Core(){
  const box = document.getElementById(o2Ids.body), tg = document.getElementById(o2Ids.toggle);
  if(!box || !tg) return;
  o2Norm();
  const o = state.o2, ativo = O2_TIPOS.find(t => t.k === o.tipo), ab = o2Modo === 'abertura';
  /* v156: o tipo ativo pertence a ESTE dial? (as duas entradas dividem a mesma 2ª oração do motor) */
  const aqui = ativo && o2KsDoModo().includes(ativo.k), outro = ativo && !aqui;
  const rot = ab ? 'Ⓐ Abertura da frase (opcional)' : ((O2C && O2C.rotulo) || '⑩') + ' Período composto (opcional)';
  const est = aqui ? ativo.ic + ' ' + (ativo.fam || ativo.nome) : outro ? (ab ? 'livre · a 2ª oração está no ⑩' : 'livre · em uso pela Abertura Ⓐ') : (ab ? 'sem abertura' : 'desligado');
  tg.innerHTML = `<span>${rot}</span><span class="o2-estado" data-on="${!!aqui}">${est}</span><span class="o2-seta">${o2Aberto ? '▾' : '▸'}</span>`;
  tg.setAttribute('aria-expanded', String(o2Aberto));
  box.hidden = !o2Aberto;
  if(!o2Aberto){ box.innerHTML = ''; return; }
  box.innerHTML = '';
  const bl = o2Bloqueio(), verb = verbById(state.verbo);
  const topo = document.createElement('div'); topo.className = 'signal-hint';
  topo.innerHTML = bl.msg || 'Escolha o <b>tipo de oração</b>: o app sugere até 3 verbos que fazem sentido com <b>' + escapeHTML(nomeV(verb)) + '</b>. Rótulos: <b>✓</b> curada à mão · <b>≈</b> por tema · <b>auto</b> derivada de antônimos/sinônimos.';
  if(ab && !bl.msg) topo.innerHTML = 'Subordinadas substantivas <b>subjetiva</b> (<i>It is … that / to</i>) e <b>predicativa</b> (<i>The truth is that…</i>). A moldura vem antes, e a frase que você montou vira o <b>sujeito</b> ou o <b>predicativo</b> dela.';
  if(outro && !bl.msg) topo.innerHTML += '<br>⚠️ ' + (ab ? 'A 2ª oração do dial ⑩ (' + ativo.nome + ') está em uso; escolher uma abertura a substitui.' : 'A Abertura Ⓐ (' + ativo.nome + ') está em uso; escolher um tipo aqui a substitui.');
  box.appendChild(topo);
  if(bl.off) return;
  o2Deriva();
  box.appendChild((() => { const b = document.createElement('button'); b.type = 'button'; b.className = 'signal-chip o2-chip o2-sorteio'; b.textContent = ab ? '🎲 Sortear abertura' : '🎲 Sortear 2ª oração'; b.title = 'Escolhe ao acaso um tipo, uma conjunção e um verbo que funcionem com o motor atual'; b.onclick = o2Sorteia; return b; })());
  const chip = (txt, on, fn, extra) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'signal-chip o2-chip'; b.dataset.active = String(!!on);
    b.innerHTML = txt; b.onclick = fn; if(extra) b.title = extra; return b;
  };
  if(aqui) box.appendChild(chip(ab ? '✕ sem abertura' : '✕ sem 2ª oração', false, () => { state.o2.tipo = null; state.o2.custom = null; render(); }));
  /* v156: linha única de famílias por operação (no dial Ⓐ há uma só: as molduras) */
  const fams = o2Familias();
  if(!ab){
    /* v157: dois eixos gramaticais, cada um com suas famílias; o chip traz o nome gramatical e, menor, a operação */
    O2_EIXOS.forEach(([ek, erot]) => {
      const dele = fams.filter(f => f.eixo === ek); if(!dele.length) return;
      const lb = document.createElement('div'); lb.className = 'wh-group-label o2-eixo'; lb.textContent = erot; box.appendChild(lb);
      const fr = document.createElement('div'); fr.className = 'signal-row-inner wrap-row o2-via';
      dele.forEach(f => fr.appendChild(chip(f.ic + ' ' + f.gram + ' <small class="o2-glosa">' + f.nome + '</small>', o2Fam === f.k, () => { o2Fam = f.k; o2Card = null; buildO2(); }, f.dica)));
      box.appendChild(fr);
    });
  }
  const fam = fams.find(f => f.k === o2Fam);
  if(!fam){ const d = document.createElement('div'); d.className = 'signal-hint'; d.innerHTML = 'Comece pela relação entre as orações: <b>coordenação</b> (duas orações independentes) ou <b>subordinação</b> (uma faz papel de substantivo, adjetivo ou advérbio dentro da outra).'; box.appendChild(d); return; }
  { const d = document.createElement('div'); d.className = 'signal-hint o2-fam-dica'; d.textContent = fam.dica; box.appendChild(d); }
  /* nas substantivas do dial principal: atalho para as duas que moram no Ⓐ */
  if(!ab && !O2C && fam.k === 'completar' && document.getElementById('abDialGroup')){
    const at = chip('↑ Subjetiva e predicativa: dial Ⓐ Abertura', false, () => { AB_UI.a = true; buildAbertura(); const g = document.getElementById('abDialGroup'); if(g) g.scrollIntoView({ behavior:'smooth', block:'center' }); });
    at.classList.add('o2-atalho'); box.appendChild(at);
  }
  /* cada família lista seus tipos (com o nome gramatical como subtítulo), separados em desenvolvidas / reduzidas */
  const itemDe = k => { for(const g of ORACOES){ const it = g.itens.find(x => x.motor === k); if(it) return it; } return { motor:k, nome:k, conj:'' }; };
  const lista = [];
  fam.subs.forEach(sb => { lista.push({ lab:sb.rot }); sb.ks.forEach(k => lista.push(itemDe(k))); });
  lista.forEach(it => {
    if(it.lab){ const l = document.createElement('div'); l.className = 'wh-group-label o2-sublab'; l.textContent = it.lab; box.appendChild(l); return; }
    const t = O2_TIPOS.find(x => x.k === it.motor);
    if(!t){
      const ph = document.createElement('div'); ph.className = 'o2-card'; ph.dataset.on = 'false';
      ph.innerHTML = `<button type="button" class="o2-card-head" disabled><span class="o2-nome">${it.nome}<small>${escapeHTML(it.conj)}</small></span><span class="orac-tag">${it.fase || 'em breve'}</span></button>`;
      box.appendChild(ph); return;
    }
    const bloq = bl.soFinal && t.k !== 'final' && t.k !== 'oq', aberto = o2Card === t.k;
    const card = document.createElement('div'); card.className = 'o2-card'; card.dataset.open = String(aberto); card.dataset.on = String(o.tipo === t.k); card.dataset.k = t.k;
    const hd = document.createElement('button'); hd.type = 'button'; hd.className = 'o2-card-head'; hd.disabled = bloq;
    hd.setAttribute('aria-expanded', String(aberto));
    hd.innerHTML = `<span class="o2-ic">${t.ic}</span><span class="o2-nome">${t.nome}<small>${t.fam}</small></span><span class="o2-seta">${aberto ? '▾' : '▸'}</span>`;
    hd.onclick = () => { o2Card = aberto ? null : t.k; buildO2(); };
    card.appendChild(hd);
    if(aberto && !bloq){
      const bd = document.createElement('div'); bd.className = 'o2-card-body';
      const sel = o.tipo === t.k;
      const l1 = document.createElement('div'); l1.className = 'signal-group-label'; l1.textContent = 'Conectivo'; l1.classList.add('o2-conj-lab'); bd.appendChild(l1);
      const r1 = document.createElement('div'); r1.className = 'signal-row-inner wrap-row';
      /* v98.1: o chip aceso é a conjunção que o motor REALMENTE usa; as que não servem ao substantivo/verbo ficam desativadas */
      const cjv = o2ConjValidas(t);
      t.conjs.forEach((cj, i) => { const bt = chip(cj.en, sel && (cjv ? cjv.ef === cj.en : o.conj === i), () => { o2Ativar(t.k, { conj:i }); if(t.k === 'cond' && state.o2.cnd !== null){ const st = o2CondEstado(); if(!st.ok) o2CondMotor(st.cnd); } render(); }, cj.pt);
        if(cjv && cjv.invalida.has(cj.en)){ bt.disabled = true; bt.title = cjv.motivo; }
        r1.appendChild(bt); });   /* unless/as long as só têm tipos 0–1: leva o motor junto */
      bd.appendChild(r1);
      /* v92: tipo da condicional (0–3) — ajusta o motor ao escolher */
      if(t.k === 'cond'){
        const est = o2CondEstado(), l0 = document.createElement('div'); l0.className = 'signal-group-label'; l0.textContent = 'Tipo de condicional'; bd.appendChild(l0);
        const r0 = document.createElement('div'); r0.className = 'signal-row-inner wrap-row';
        ['0 · fato geral', '1 · real (futuro)', '2 · hipótese', '3 · irreal (passado)'].slice(0, (sel ? o.conj : 0) === 0 ? 4 : 2).forEach((lb, i) =>
          r0.appendChild(chip(lb, sel && est.cnd === i, () => { o2Ativar('cond', { cnd:i }); o2CondMotor(i); render(); }, 'Ajusta tempo/aspecto da principal para este tipo')));
        bd.appendChild(r0);
        if(sel && !est.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + est.msg + ' ';
          const bt = chip('Ajustar o motor', false, () => { o2CondMotor(est.cnd); render(); }); av.appendChild(bt); bd.appendChild(av);
        }
      }
      if(t.forma === 'S'){
        const st = o2SubstEstado();
        if(!st.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          if(!st.semSug) O2_SUBJ_SUG.forEach(id => { const vv = verbById(id); if(vv) av.appendChild(chip(escapeHTML(nomeV(vv)), false, () => { state.verbo = id; state.colocacao = null; render(); })); });
          bd.appendChild(av);
        } else {
          const ok = document.createElement('div'); ok.className = 'signal-hint'; ok.innerHTML = 'Conjunções que <b>' + escapeHTML(nomeV(verb)) + '</b> aceita: <b>' + st.d.c.join(' · ') + '</b>.'; bd.appendChild(ok);
        }
      }
      if(t.forma === 'G'){                                 /* v161: pergunta indireta */
        const st = o2OqEstado();
        if(!st.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          if(!st.semSug) (st.sug || []).forEach(id => { const vv = verbById(id); if(vv) av.appendChild(chip(escapeHTML(nomeV(vv)), false, () => { state.verbo = id; state.colocacao = null; state.categoria = 'fact'; render(); })); });
          else av.appendChild(chip('Tirar a colocação', false, () => { state.colocacao = null; render(); }));
          bd.appendChild(av);
        } else { const ok = document.createElement('div'); ok.className = 'signal-hint'; ok.innerHTML = 'Escolha a <b>palavra interrogativa</b> e o <b>verbo da pergunta</b>: ordem de afirmativa, sem do/does.'; bd.appendChild(ok);
          /* v162: sujeito e tempo PRÓPRIOS da pergunta (antes seguiam a principal) */
          const lS = document.createElement('div'); lS.className = 'signal-group-label'; lS.textContent = 'Sujeito da pergunta'; bd.appendChild(lS);
          const rS = document.createElement('div'); rS.className = 'signal-row-inner wrap-row';
          rS.appendChild(chip('automático', sel && !o.sj2, () => { o2Ativar('oq', { sj2:null }); render(); }, 'ela/ele, diferente de quem fala'));
          [['I', 'eu'], ['You', 'você'], ['He', 'ele'], ['She', 'ela'], ['It', 'isso'], ['We', 'nós'], ['They', 'eles']].forEach(x => rS.appendChild(chip(x[0].toLowerCase(), sel && o.sj2 === x[0], () => { o2Ativar('oq', { sj2:x[0] }); render(); }, x[1])));
          bd.appendChild(rS);
          const lT = document.createElement('div'); lT.className = 'signal-group-label'; lT.textContent = 'Tempo da pergunta'; bd.appendChild(lT);
          const rT = document.createElement('div'); rT.className = 'signal-row-inner wrap-row';
          rT.appendChild(chip('acompanha a principal', sel && !o.tp2, () => { o2Ativar('oq', { tp2:null }); render(); }, 'passado → passado; senão presente'));
          [['present', 'presente'], ['past', 'passado'], ['future', 'futuro']].forEach(x => rT.appendChild(chip(x[1], sel && o.tp2 === x[0], () => { o2Ativar('oq', { tp2:x[0] }); render(); }, 'Tempo do verbo dentro da pergunta')));
          bd.appendChild(rT);
          const lA = document.createElement('div'); lA.className = 'signal-group-label'; lA.textContent = 'Aspecto da pergunta'; bd.appendChild(lA);
          const rA = document.createElement('div'); rA.className = 'signal-row-inner wrap-row';
          [[null, 'simples', 'fato, hábito'], ['continuo', 'contínuo', 'em andamento (is doing)'], ['perfeito', 'perfeito', 'ligação com o presente (has done)']].forEach(x => rA.appendChild(chip(x[1], sel && (o.as2 || null) === x[0], () => { o2Ativar('oq', { as2:x[0] }); render(); }, x[2])));
          bd.appendChild(rA); }
      }
      if(t.forma === 'X'){                                 /* v107 */
        const st = o2ApEstado();
        if(!st.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          if(!st.semSug) O2_AP_SUG.forEach(id => { const vv = verbById(id); if(vv) av.appendChild(chip(escapeHTML(nomeV(vv)), false, () => { state.verbo = id; state.colocacao = null; render(); })); });
          else av.appendChild(chip('Tirar a colocação', false, () => { state.colocacao = null; render(); }));
          bd.appendChild(av);
        } else { const ok = document.createElement('div'); ok.className = 'signal-hint'; ok.innerHTML = '<b>' + escapeHTML(nomeV(verb)) + '</b> aceita: <b>' + st.d.c.join(' · ') + '</b>.'; bd.appendChild(ok); }
      }
      if(t.forma === 'W'){                                 /* v105 */
        const st = o2CnEstado();
        if(!st.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          if(!st.semSug) O2_CN_SUG.forEach(id => { const vv = verbById(id); if(vv) av.appendChild(chip(escapeHTML(nomeV(vv)), false, () => { state.verbo = id; state.colocacao = null; render(); })); });
          else av.appendChild(chip('Tirar a colocação', false, () => { state.colocacao = null; render(); }));
          bd.appendChild(av);
        }
      }
      if(t.forma === 'I'){                                 /* v104 */
        const st = o2OiEstado();
        if(!st.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          if(!st.semSug) O2_OI_SUG.forEach(id => { const vv = verbById(id); if(vv) av.appendChild(chip(escapeHTML(nomeV(vv)), false, () => { state.verbo = id; state.colocacao = null; render(); })); });
          else av.appendChild(chip('Tirar a colocação', false, () => { state.colocacao = null; render(); }));
          bd.appendChild(av);
        } else { const ok = document.createElement('div'); ok.className = 'signal-hint'; ok.innerHTML = '<b>' + escapeHTML(nomeV(verb)) + ' ' + st.d.p + '</b> aceita: <b>' + st.d.c.join(' · ') + '</b>.'; bd.appendChild(ok); }
      }
      if(t.forma === 'P'){                                 /* v101: proporcional só monta com a principal simples e afirmativa */
        const st = o2PropEstado();
        if(!st.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          av.appendChild(chip('Ajustar o motor', false, () => { if(state.formato !== 'afirmativa') state.formato = 'afirmativa'; if(state.tempo === 'future') state.tempo = 'present'; state.aspecto = 'simples'; if(Array.isArray(state.signalMids)) state.signalMids = []; render(); }));
          bd.appendChild(av);
        }
      }
      if(t.k === 'rinf'){                                  /* v135 */
        const st = o2RinfEstado();
        if(!st.ok){
          const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          av.appendChild(chip('Ajustar o motor', false, () => { o2AjustaReduzida('rinf'); render(); }, 'Escolhe um verbo compatível e tira a colocação'));   /* v136 */
          if(!st.semSug) O2_RI_SUG.forEach(id => { const vv = verbById(id); if(vv) av.appendChild(chip(escapeHTML(nomeV(vv)), false, () => { state.verbo = id; state.colocacao = null; render(); })); });
          else av.appendChild(chip('Tirar a colocação', false, () => { state.colocacao = null; render(); }));
          bd.appendChild(av);
        } else { const ok = document.createElement('div'); ok.className = 'signal-hint'; ok.innerHTML = '<b>' + escapeHTML(nomeV(verb)) + '</b> aceita: <b>' + st.d.c.join(' · ') + '</b>.'; bd.appendChild(ok); }
      }
      if(t.forma === 'R' || t.k === 'rrel'){
        const st = o2RelEstado(t.k === 'rrel');
        if(!st.ok){ const av = document.createElement('div'); av.className = 'signal-hint o2-aviso'; av.innerHTML = '⚠️ ' + st.msg + ' ';
          if(t.k === 'rrel' || t.forma === 'R') av.appendChild(chip('Ajustar o motor', false, () => { o2AjustaReduzida('rrel'); render(); }, 'Escolhe uma colocação-objeto e tira as palavras-sinal de fim'));   /* v136 */
          bd.appendChild(av); }
      }
      /* v96: transformações de sentido (substitui a antiga alternância manual de ordem) */
      {
        const cT = t.conjs[sel ? o.conj : 0], opsT = sel ? o2Opcoes(t.k, verb, o.conj) : [], chaves = sel ? o2TrChaves(t, cT, o.custom ? null : opsT[o.opt]) : [];
        const extras = [];            /* unless ⇄ if…not: só troca de conectivo e polaridade */
        if(sel && t.k === 'cond'){
          const est = o2CondEstado();
          if(cT.en === 'unless') extras.push({ rot:'→ if … not', fn: () => o2Ativar('cond', { conj:0, neg:true }) });
          else if(cT.en === 'if' && o.neg && est.cnd <= 1) extras.push({ rot:'→ unless (sem negação)', fn: () => o2Ativar('cond', { conj:1, neg:false }) });
        }
        if(chaves.length || extras.length){
          const lt = document.createElement('div'); lt.className = 'signal-group-label'; lt.textContent = 'Transformar (mesmo sentido, outra estrutura)'; bd.appendChild(lt);
          const rt = document.createElement('div'); rt.className = 'signal-row-inner wrap-row';
          chaves.forEach(k2 => rt.appendChild(chip('⇄ ' + O2_TR[k2].rot, o.tr === k2, () => { o2Ativar(t.k, { tr: o.tr === k2 ? null : k2 }); render(); }, 'Reescreve a frase com outra conjunção, trocando as orações de lugar')));
          extras.forEach(x => rt.appendChild(chip('⇄ ' + x.rot, false, () => { x.fn(); render(); }, 'Mesmo sentido com outro conectivo')));
          bd.appendChild(rt);
        }
      }
      if(t.k !== 'adv' && t.forma !== 'D' && t.forma !== 'N' && t.forma !== 'P' && t.forma !== 'U' && t.forma !== 'Y' && !(t.forma === 'I' && sel && cjv && cjv.ef === 'how') && !(t.k === 'cond' && sel && o.conj === 1) && !(t.k === 'conc' && sel && o2ConcNome(o.conj))){
        const l2 = document.createElement('div'); l2.className = 'signal-group-label'; l2.textContent = 'Polaridade da 2ª oração'; bd.appendChild(l2);
        const r2 = document.createElement('div'); r2.className = 'signal-row-inner wrap-row';
        r2.appendChild(chip('afirmativa', sel && !o.neg, () => { o2Ativar(t.k, { neg:false }); render(); }));
        r2.appendChild(chip('negativa', sel && o.neg, () => { o2Ativar(t.k, { neg:true }); render(); }));
        bd.appendChild(r2);
      }
      const l3 = document.createElement('div'); l3.className = 'signal-group-label'; l3.textContent = t.k === 'rger' ? 'Verbo da reduzida — vira -ing (mesmo sujeito da principal)' : t.k === 'rpart' ? 'Particípio — como o sujeito está ou é tratado' : t.k === 'rinf' ? 'Verbo do objeto — o que se quer / evita / gosta de fazer' : t.k === 'rrel' ? 'Complemento do substantivo — a relativa reduzida' : t.k === 'obj' ? 'Adjetivo — o que a oração afirma (“it is…”)' : (t.k === 'rel' || t.k === 'relx') ? 'Verbo da relativa — o objeto é o substantivo da colocação' : t.k === 'cmp' ? 'Advérbio — modo/grau que se compara' : t.k === 'ap' ? 'Substantivo — o que será explicado depois dos dois-pontos' : t.k === 'cn' ? 'Substantivo abstrato — o que a oração completa' : t.k === 'oi' ? (cjv && cjv.ef === '-ing' ? 'Verbo no gerúndio — o que se fala/pensa' : 'Adjetivo — “how difficult it is”') : t.k === 'subj' ? 'Adjetivo — como a ideia é avaliada' : t.k === 'pred' ? 'Substantivo — “The … is that”' : t.k === 'conf' ? ((sel && o.conj >= 2) ? 'Substantivo — o que é seguido (“according to…”)' : 'Oração — o que foi combinado/dito (“as …”)') : t.k === 'prop' ? 'Verbo do 2º termo — o que cresce/diminui junto' : t.k === 'conc' ? ((sel && o.conj >= 3) ? 'Substantivo — o que “apesar de” enfrenta' : 'Adjetivo — como é a situação (“it is…”)') : 'Verbo da 2ª oração — sugestões que combinam com ' + nomeV(verb); bd.appendChild(l3);
      const ops = o2Opcoes(t.k, verb, sel ? o.conj : 0), r3 = document.createElement('div'); r3.className = 'signal-row-inner wrap-row';
      /* v143: listas longas (rger/rinf/rpart têm até 13 opções) mostram as 4 primeiras e um chip "+N"; a opção escolhida nunca fica escondida */
      const LIM = 4, aberta = !!o2MaisOpc[t.k] || ops.length <= LIM + 1 || (sel && !o.custom && o.opt >= LIM), vis = aberta ? ops : ops.slice(0, LIM);
      vis.forEach((op, i) => r3.appendChild(chip(`${escapeHTML(o2Rotulo(t.k, op))} <i class="o2-src">${op.src}</i>`, sel && !o.custom && o.opt === i, () => { o2Ativar(t.k, { opt:i, custom:null }); render(); })));
      if(!aberta) r3.appendChild(chip('+' + (ops.length - LIM) + ' opções', false, () => { o2MaisOpc[t.k] = true; render(); }, 'Mostra todas as opções deste tipo'));
      else if(ops.length > LIM + 1 && o2MaisOpc[t.k]) r3.appendChild(chip('menos', false, () => { o2MaisOpc[t.k] = false; render(); }, 'Recolhe a lista'));
      if(!ops.length){ const s = document.createElement('div'); s.className = 'signal-hint'; s.textContent = 'Este verbo não tem ' + (t.k === 'adv' ? 'antônimo' : t.k === 'alt' ? 'antônimo nem sinônimo' : 'sinônimo') + ' no app — use “outro verbo” abaixo.'; r3.appendChild(s); }
      bd.appendChild(r3);
      /* v131: sujeito concreto da substantiva — troca o "it" genérico por um assunto (o par já traz o adjetivo que combina) */
      if(sel && o2QCabe(t.k, cjv ? cjv.ef : t.conjs[o.conj].en)){
        const lq = document.createElement('div'); lq.className = 'signal-group-label'; lq.textContent = 'Sujeito da oração — de quem se fala (no lugar do “it”)'; bd.appendChild(lq);
        const rq = document.createElement('div'); rq.className = 'signal-row-inner wrap-row o2-q';
        rq.appendChild(chip('it (genérico)', !o.q, () => { state.o2.q = null; render(); }, 'A oração fala de “isso”, sem dizer o quê'));
        const lista = o2QLista(verb); if(o.q && !lista.some(q => q.k === o.q)) lista.push(O2_Q[o.q]);   /* par vindo de um parágrafo continua visível */
        lista.forEach(q => rq.appendChild(chip(escapeHTML(q.s) + ' <i class="o2-src">' + escapeHTML(q.a) + '</i>', o.q === q.k, () => { state.o2.q = (state.o2.q === q.k) ? null : q.k; render(); }, q.sp + ' · ' + q.ap)));
        bd.appendChild(rq);
        if(o.q && (t.k === 'obj' || t.k === 'oi')){ const hq = document.createElement('div'); hq.className = 'signal-hint'; hq.innerHTML = 'Com sujeito concreto, o <b>adjetivo vem junto com ele</b> (o par é fixo para a frase fazer sentido). Volte para <b>it</b> para escolher o adjetivo à parte.'; bd.appendChild(hq); }
      }
      /* v89.1: colocações do verbo 2 como complemento (quando a opção não traz objeto) */
      const opSel = o.custom ? { src:'livre' } : ops[o.opt], v2 = sel ? (o.custom || (opSel && opSel.v)) : null;
      if(sel && v2 && o2PrecisaCpl(t.k, opSel) && (verbById(v2).col || []).length){
        const l4 = document.createElement('div'); l4.className = 'signal-group-label'; l4.textContent = 'Complemento — colocações de ' + nomeV(verbById(v2)); bd.appendChild(l4);
        const r4 = document.createElement('div'); r4.className = 'signal-row-inner wrap-row';
        r4.appendChild(chip('✨ automático (mesmo objeto)', o.c2 === null, () => { state.o2.c2 = null; render(); }, 'Se a principal tem objeto (passo ④), o verbo 2 herda o mesmo objeto; sem objeto na principal, nada é acrescentado'));
        r4.appendChild(chip('sem complemento', o.c2 === 'none', () => { state.o2.c2 = 'none'; render(); }));
        const cm = (t.k === 'adv' || t.k === 'adit' || t.k === 'alt') && state.colocacao !== null ? o2ObjDef((verb.col || [])[state.colocacao]) : null;
        if(cm && o2Transitivo(verbById(v2))) r4.appendChild(chip('↺ mesmo objeto: ' + escapeHTML(cm.en) + (o2Afin(verb, verbById(v2)) ? ' <i class="o2-src">✓</i>' : ' <i class="o2-src">≈</i>'), o.c2 === 'same', () => { state.o2.c2 = (state.o2.c2 === 'same') ? null : 'same'; render(); }, 'Reaproveita o complemento da 1ª oração. ✓ = o verbo 2 também tem esse objeto nas colocações; ≈ = confira se o sentido combina'));
        verbById(v2).col.slice(0, 3).forEach((cc, i) => r4.appendChild(chip(escapeHTML(cc.en), o.c2 === i, () => { state.o2.c2 = (state.o2.c2 === i) ? null : i; render(); })));
        bd.appendChild(r4);
      }
      /* outro verbo (livre): você decide a coerência — não se aplica à concessiva (adjetivo/substantivo) */
      if(t.k !== 'conc' && t.forma !== 'V' && t.forma !== 'R' && t.forma !== 'S' && t.forma !== 'D' && t.forma !== 'N' && t.forma !== 'P' && t.forma !== 'U' && t.forma !== 'Y' && t.forma !== 'I' && t.forma !== 'W' && t.forma !== 'X'){
      const bus = document.createElement('input'); bus.type = 'text'; bus.className = 'pick-busca o2-busca'; bus.placeholder = 'outro verbo (inglês ou português)…';
      bus.value = o2Busca; bus.setAttribute('autocomplete', 'off'); bus.setAttribute('autocapitalize', 'none'); bus.spellcheck = false;
      const res = document.createElement('div'); res.className = 'signal-row-inner wrap-row o2-res';
      const pinta = () => {
        res.innerHTML = '';
        const q = semAcento(o2Busca).trim();
        if(o.custom && sel){ res.appendChild(chip('livre: ' + escapeHTML(nomeV(verbById(o.custom))) + ' ✕', true, () => { state.o2.custom = null; render(); })); }
        if(!q){ if(O2C) o2Envolve(res, O2C); return; }
        VERBS.filter(x => verbBuscaOk(x, q)).slice(0, 10).forEach(x => res.appendChild(chip(escapeHTML(nomeV(x)), false, () => { o2Ativar(t.k, { custom:x.id, para:state.verbo }); state.o2.para = state.verbo; o2Busca = ''; render(); })));
        if(O2C) o2Envolve(res, O2C);
      };
      const C0 = O2C;   /* v110: o evento dispara fora do contexto — reentra nele */
      bus.addEventListener('input', () => o2Dentro(C0, () => { o2Busca = bus.value; pinta(); }));
      bd.appendChild(bus); bd.appendChild(res); pinta();
      }
      const nt = document.createElement('div'); nt.className = 'lex-nota'; nt.innerHTML = (t.k === 'cond' && sel) ? o2CondNota(o2CondEstado().cnd, t.conjs[o.conj].en) : t.nota; bd.appendChild(nt);
      const ln = document.createElement('button'); ln.type = 'button'; ln.className = 'cross-link'; ln.dataset.goto = 'block-oracoes'; ln.textContent = '📚 Ver todos os tipos de oração'; bd.appendChild(ln);
      card.appendChild(bd);
    }
    box.appendChild(card);
  });
  if(typeof applyA11y === 'function') applyA11y();
}

/* ================= v89: seção didática — orações compostas =================
   motor: tipo já disponível no dial ⑩; senão, fase em que entra. */
const ORACOES = [
 { g:'Coordenadas', ic:'🔗', itens:[
  { nome:'Aditiva', conj:'and · as well as · not only… but also · both… and', motor:'adit',
    regra:'Soma ideias de mesmo valor. Com o mesmo sujeito, o 2º pode ser omitido: "He opened the door and walked in." Tempos paralelos.',
    ex:[['She studies hard and works part-time.','Ela estuda muito e trabalha meio período.'],['Not only did he win, but he also broke the record.','Ele não só venceu como também quebrou o recorde.']],
    erro:['Not only he won… ✗','Depois de "not only" no início, inverte-se: Not only DID he win.'] },
  { nome:'Adversativa', conj:'but · yet · however · still · whereas · while', motor:'adv',
    regra:'Contraste. "But" liga duas orações com vírgula antes; "however" é advérbio de ligação (; however,). Antônimos servem bem de 2º verbo.',
    ex:[['I like tea, but I prefer coffee.','Gosto de chá, mas prefiro café.'],['He works a lot; however, he rarely gets tired.','Ele trabalha muito; no entanto, raramente se cansa.']],
    erro:['I like tea, however I prefer coffee ✗','"However" não une duas orações só com vírgula: use ponto e vírgula ou ponto.'] },
  { nome:'Alternativa', conj:'or · either… or · neither… nor · otherwise', motor:'alt',
    regra:'Escolha ou exclusão. Em either…or / neither…nor, o verbo concorda com o sujeito mais próximo.',
    ex:[['Either we leave now, or we miss the train.','Ou saímos agora, ou perdemos o trem.'],['Neither he nor I know the answer.','Nem ele nem eu sabemos a resposta.']],
    erro:['Neither he nor I knows ✗','Concorda com o mais próximo ("I") → know.'] },
  { nome:'Conclusiva', conj:'so · therefore · thus · hence · consequently', motor:'cons',
    regra:'Introduz o resultado. "So" é o mais comum e coloquial, com vírgula antes; "therefore/thus" são mais formais.',
    ex:[['It was raining, so we stayed home.','Estava chovendo, então ficamos em casa.'],['The test failed; therefore, we changed the plan.','O teste falhou; portanto, mudamos o plano.']],
    erro:['It was raining, so that we stayed home ✗','"So that" é finalidade (para que), não resultado.'] },
  { nome:'Explicativa', conj:'for (formal) · because (informal)', motor:'expl',
    regra:'"For" como conjunção explica a oração anterior e é formal/literária; no dia a dia usa-se because.',
    ex:[['We stayed home, for it was raining.','Ficamos em casa, pois estava chovendo.']],
    erro:['For it was raining, we stayed ✗','Como conjunção, "for" nunca abre a frase.'] }
 ]},
 { g:'Subordinadas substantivas', ic:'📦', itens:[
  { nome:'Subjetiva (faz o papel de sujeito)', conj:'It + be + adj + that / to · What… · That…', motor:'subj',
    regra:'A oração é o sujeito do verbo. Em inglês a forma natural é com "it": It is important that he come / to come.',
    ex:[['It is important that everyone arrives on time.','É importante que todos cheguem na hora.'],['What he said surprised me.','O que ele disse me surpreendeu.']],
    erro:['That he left surprised me (formal demais)','Prefira: It surprised me that he left.'] },
  { nome:'Objetiva direta (objeto direto)', conj:'that · if / whether · wh-words · to + V · -ing', motor:'obj',
    regra:'A oração completa o verbo principal. "That" costuma ser omitido; if/whether para perguntas indiretas — sem inversão.',
    ex:[['I think (that) he is right.','Acho que ele tem razão.'],['I don\'t know whether she left.','Não sei se ela saiu.']],
    erro:['I don\'t know where is he ✗','Pergunta indireta não inverte: where he is.'] },
  { nome:'Pergunta indireta (objeto interrogativo)', conj:'what · who · which one · where · when · why · how (long / often / much…)', motor:'oq',
    regra:'A pergunta vira objeto de um verbo de saber, perguntar ou explicar. Dentro dela a ordem é de afirmativa e não há do/does/did.',
    ex:[['I don\'t know where she lives.','Não sei onde ela mora.'],['Do you know which one she prefers?','Você sabe qual ela prefere?']],
    erro:['I don\'t know where does she live ✗','Pergunta indireta não inverte: where she lives.'] },
  { nome:'Objetiva indireta (objeto preposicionado)', conj:'verbo + preposição + wh-/whether/-ing', motor:'oi',
    regra:'O verbo exige preposição antes da oração. Depois de preposição, o verbo vai para o -ing ou vem uma oração com wh-/whether.',
    ex:[['It depends on whether it rains.','Depende de chover ou não.'],['She insisted on paying.','Ela insistiu em pagar.']],
    erro:['It depends if it rains (coloquial)','Formalmente: depends on whether / depends on if é informal.'] },
  { nome:'Completiva nominal', conj:'noun + that / to · the fact that · the idea that', motor:'cn',
    regra:'Completa o sentido de um substantivo abstrato (dúvida, medo, fato, ideia).',
    ex:[['I have no doubt that he is honest.','Não tenho dúvida de que ele é honesto.'],['The fact that she left worried us.','O fato de ela ter saído nos preocupou.']],
    erro:['I have no doubt of that he… ✗','Em inglês não há preposição antes de that.'] },
  { nome:'Predicativa', conj:'be + that / to · be + wh-', motor:'pred',
    regra:'A oração é o predicativo do sujeito (depois de be).',
    ex:[['The problem is that we are late.','O problema é que estamos atrasados.'],['My goal is to learn English.','Meu objetivo é aprender inglês.']],
    erro:['The problem is because we are late ✗','Após "is", use that — não because.'] },
  { nome:'Apositiva', conj:'noun + : that / to', motor:'ap',
    regra:'Explica um substantivo em aposição, normalmente após dois-pontos ou vírgula.',
    ex:[['I have one wish: that you be happy.','Tenho um desejo: que você seja feliz.'],['He gave me one piece of advice: to wait.','Ele me deu um conselho: esperar.']],
    erro:['—','Estrutura mais formal/literária; no dia a dia, prefira duas frases.'] }
 ]},
 { g:'Subordinadas adjetivas', ic:'🧷', itens:[
  { nome:'Restritiva', conj:'who · which · that · whose · where · when', motor:'rel',
    regra:'Delimita o substantivo e NÃO leva vírgula. "That" substitui who/which; pode ser omitido quando é objeto.',
    ex:[['The man who lives here is a doctor.','O homem que mora aqui é médico.'],['The book (that) I read was great.','O livro que li era ótimo.']],
    erro:['The book who I read ✗','Coisa = which/that; pessoa = who/that.'] },
  { nome:'Explicativa', conj:'who · which · whose · where (com vírgulas)', motor:'relx',
    regra:'Só acrescenta informação, entre vírgulas. Aqui "that" NÃO é permitido.',
    ex:[['My brother, who lives in Paris, is a doctor.','Meu irmão, que mora em Paris, é médico.']],
    erro:['My brother, that lives in Paris ✗','Com vírgulas, use who/which.'] }
 ]},
 { g:'Subordinadas adverbiais', ic:'🧭', itens:[
  { nome:'Final (finalidade)', conj:'in order to · so as to · to · so that', motor:'final',
    regra:'Responde "para quê?". Infinitiva (in order to + V) quando o sujeito é o mesmo; com sujeito diferente usa-se so that + oração.',
    ex:[['We will create a new plan in order to improve society.','Vamos criar um novo plano para melhorar a sociedade.'],['He works so that his kids can study.','Ele trabalha para que os filhos possam estudar.']],
    erro:['I work for to earn money ✗','"For to" não existe: in order to / to.'] },
  { nome:'Causal (causa)', conj:'because · since · as · because of + noun', motor:'caus',
    regra:'Responde "por quê?". Because + oração; because of + substantivo.',
    ex:[['I work because I need money.','Trabalho porque preciso de dinheiro.'],['We stayed home because of the rain.','Ficamos em casa por causa da chuva.']],
    erro:['because of I need money ✗','Because of + substantivo; because + sujeito + verbo.'] },
  { nome:'Consecutiva (consequência)', conj:'so… that · such… that', motor:'csq',
    regra:'Intensidade que gera consequência: so + adj/adv + that; such + (a) + adj + noun + that.',
    ex:[['It was so cold that the lake froze.','Estava tão frio que o lago congelou.'],['She is such a good teacher that everyone loves her.','Ela é uma professora tão boa que todos a adoram.']],
    erro:['so a good teacher ✗','Com substantivo, use such a.'] },
  { nome:'Condicional', conj:'if · unless · as long as · provided that · in case', motor:'cond',
    regra:'Quatro estruturas: 0) If + presente → presente; 1) If + presente → will; 2) If + passado → would; 3) If + past perfect → would have + particípio. Nunca "will" depois de if (tipo 1).',
    ex:[['If it rains, we will stay home.','Se chover, ficaremos em casa.'],['If I had more time, I would travel more.','Se eu tivesse mais tempo, viajaria mais.'],['If she had studied, she would have passed.','Se ela tivesse estudado, teria passado.']],
    erro:['If it will rain, we stay ✗','Tipo 1: If + presente simples.'] },
  { nome:'Concessiva', conj:'although · though · even though · despite / in spite of · while', motor:'conc',
    regra:'Contraste inesperado. Although + oração; despite/in spite of + substantivo ou -ing. Nunca "although… but" na mesma frase.',
    ex:[['Although it was late, we kept working.','Embora fosse tarde, continuamos trabalhando.'],['Despite the rain, they played.','Apesar da chuva, eles jogaram.']],
    erro:['Although it was late, but we kept working ✗','Use só um conectivo de contraste.'] },
  { nome:'Temporal', conj:'when · while · before · after · until · as soon as · by the time · since', motor:'temp',
    regra:'Situa no tempo. No futuro, a oração temporal vai para o PRESENTE: When I arrive, I will call. (ver bloco ⏳)',
    ex:[['When I arrive, I will call you.','Quando eu chegar, ligarei para você.'],['While she cooked, he cleaned.','Enquanto ela cozinhava, ele limpava.']],
    erro:['When I will arrive… ✗','Conjunção de tempo + futuro → presente.'] },
  { nome:'Comparativa', conj:'as… as · than · the same way as · like', motor:'cmp',
    regra:'Compara. As + adj + as (igualdade); adj-er / more + adj + than (superioridade).',
    ex:[['She is as tall as her brother.','Ela é tão alta quanto o irmão.'],['This is more difficult than I expected.','Isto é mais difícil do que eu esperava.']],
    erro:['more tall than ✗','Adjetivo curto: taller than.'] },
  { nome:'Conformativa', conj:'as · just as · according to', motor:'conf',
    regra:'Indica conformidade com algo dito ou combinado.',
    ex:[['Do it as I told you.','Faça como eu lhe disse.'],['According to the plan, we start on Monday.','Conforme o plano, começamos na segunda.']],
    erro:['According with the plan ✗','Sempre "according to".'] },
  { nome:'Proporcional', conj:'the more… the more · as… (cada vez mais)', motor:'prop',
    regra:'Duas variações que crescem juntas: The + comparativo, the + comparativo.',
    ex:[['The more you practice, the better you get.','Quanto mais você pratica, melhor fica.']],
    erro:['The more you practice, more you improve ✗','Repita "the" nas duas partes.'] }
 ]},
 { g:'Orações reduzidas', ic:'✂️', itens:[
  { nome:'Reduzida de gerúndio (-ing)', conj:'while · after · before · by · without · upon · having + -ed · (só -ing)', motor:'rger',
    regra:'A oração perde sujeito e tempo: sobra só o verbo em -ing, com o MESMO sujeito da principal. Depois de preposição o inglês só aceita -ing. É adverbial: tempo, modo/meio, causa.',
    ex:[['After finishing the report, she called the client.','Depois de terminar o relatório, ela ligou para o cliente.'],['He learns English by watching series.','Ele aprende inglês assistindo a séries.'],['She left without saying goodbye.','Ela saiu sem se despedir.']],
    erro:['After to finish the report ✗','Depois de preposição vem -ing, nunca infinitivo: after finishing.'] },
  { nome:'Reduzida de particípio (-ed)', conj:'once · when · if · although · (só -ed)', motor:'rpart',
    regra:'Some o sujeito + be: "If (it is) needed" → "If needed". O particípio tem sentido passivo ou de estado, e o sujeito é o mesmo da principal. Costuma abrir a frase.',
    ex:[['If needed, I can help you.','Se necessário, posso ajudar você.'],['Although tired, she kept working.','Embora cansada, ela continuou trabalhando.'],['Once approved, the plan starts.','Uma vez aprovado, o plano começa.']],
    erro:['If needing, I can help ✗','Sentido passivo pede particípio: if needed.'] },
  { nome:'Objetiva reduzida de infinitivo (to / -ing)', conj:'want to · decide to · enjoy -ing · avoid -ing · like to / -ing', motor:'rinf',
    regra:'O verbo principal pede um objeto que é outro verbo, no MESMO sujeito: want to save, enjoy cooking. Cada verbo escolhe to + verbo ou -ing (alguns aceitam os dois).',
    ex:[['She wants to save money.','Ela quer economizar dinheiro.'],['He enjoys cooking on Sundays.','Ele gosta de cozinhar aos domingos.'],['They decided not to wait.','Eles decidiram não esperar.']],
    erro:['She enjoys to cook ✗','Enjoy pede -ing: enjoys cooking.'] },
  { nome:'Relativa reduzida (-ing / -ed / to)', conj:'-ing · -ed · to + verbo', motor:'rrel',
    regra:'Corta o pronome relativo e o auxiliar: "a book that was written in 1990" → "a book written in 1990". -ing = faz; -ed = sofre; to = serve para.',
    ex:[['The man standing at the door is my boss.','O homem parado à porta é meu chefe.'],['This is a book written in 1990.','Este é um livro escrito em 1990.'],['She was the first to arrive.','Ela foi a primeira a chegar.']],
    erro:['a book writing in 1990 ✗','Sentido passivo pede particípio: a book written.'] }
 ]}
];
/* v95: conjunções de cada tipo de oração — "conj|exemplo EN|exemplo PT|nota". Chave @grupo.item (índices de ORACOES). */
const ORAC_CONJ_TXT = `@0.0
and|She studies hard and works part-time.|Ela estuda muito e trabalha meio período.|A mais comum; sem vírgula em orações curtas e com vírgula em listas ou orações longas.
as well as|He speaks French as well as German.|Ele fala francês e também alemão.|Soma com ênfase no segundo item; se vier verbo depois, ele fica em -ing: "as well as working".
not only… but also|Not only did he win, but he also broke the record.|Ele não só venceu como também quebrou o recorde.|No início da frase, "not only" inverte sujeito e auxiliar (Not only DID he win).
both… and|Both the manager and the team agreed.|Tanto o gerente quanto a equipe concordaram.|Os dois elementos devem ter a mesma forma gramatical; o verbo fica no plural.
besides|She is smart; besides, she works hard.|Ela é inteligente; além disso, trabalha duro.|Advérbio de ligação: vem depois de ponto e vírgula ou de ponto, seguido de vírgula.
moreover|The plan is cheap. Moreover, it is fast.|O plano é barato. Além disso, é rápido.|Formal, típico de texto escrito.
as well|She sings, and she dances as well.|Ela canta e também dança.|"As well" fecha a frase; é informal. Não abre oração: "As well, she dances" soa estranho.
in addition|The job pays well. In addition, it offers training.|O emprego paga bem. Além disso, oferece treinamento.|Advérbio de ligação formal: ponto antes, vírgula depois. "In addition to" pede substantivo ou -ing.
furthermore|The plan is cheap. Furthermore, it is safe.|O plano é barato. Além do mais, é seguro.|Muito formal, texto escrito; acrescenta um argumento mais forte.
plus|She works, plus she studies at night.|Ela trabalha e, além disso, estuda à noite.|Informal; na escrita formal prefira "in addition" ou "moreover".
and then|She finished the report, and then she left.|Ela terminou o relatório e depois saiu.|Soma com ideia de sequência: a ordem das ações importa.
what is more|The trip was cheap; what is more, it was fun.|A viagem foi barata; e o que é mais, foi divertida.|Expressão fixa para acrescentar um argumento forte; vírgula depois.
along with|He sent the letter along with a gift.|Ele enviou a carta junto com um presente.|Preposição, não conjunção: depois dela vem substantivo, e o verbo concorda com o sujeito principal.
@0.1
but|I like tea, but I prefer coffee.|Gosto de chá, mas prefiro café.|Vírgula antes quando liga duas orações completas.
yet|He is rich, yet he lives simply.|Ele é rico, porém vive de forma simples.|Mais formal que "but"; sugere contraste inesperado.
however|He works a lot; however, he rarely gets tired.|Ele trabalha muito; no entanto, raramente se cansa.|Advérbio de ligação, não conjunção: ponto e vírgula (ou ponto) antes e vírgula depois.
still|It was raining. Still, we went out.|Estava chovendo. Mesmo assim, saímos.|Como ligação, abre a frase seguinte.
whereas|She loves cities, whereas he prefers the countryside.|Ela adora cidades, ao passo que ele prefere o campo.|Contrasta dois sujeitos; formal, com vírgula antes.
while|I cook, while my brother cleans.|Eu cozinho, enquanto meu irmão limpa.|Com sentido de contraste (não de tempo); vírgula antes.
nevertheless|It was risky. Nevertheless, they invested.|Era arriscado. Mesmo assim, eles investiram.|Formal; vírgula depois.
on the other hand|Living here is cheap. On the other hand, the job market is small.|Morar aqui é barato. Por outro lado, o mercado de trabalho é pequeno.|Costuma responder a "on the one hand"; vírgula depois.
in contrast|Sales rose in May. In contrast, they fell in June.|As vendas subiram em maio. Em contraste, caíram em junho.|Compara dois fatos opostos; formal.
even so|It was cold. Even so, they swam.|Estava frio. Mesmo assim, eles nadaram.|Mesmo sentido de "nevertheless", mais comum na fala.
all the same|He was tired; all the same, he kept running.|Ele estava cansado; mesmo assim, continuou correndo.|Expressão fixa, informal; ponto e vírgula ou ponto antes.
on the contrary|It isn't easy. On the contrary, it is very hard.|Não é fácil. Pelo contrário, é muito difícil.|Nega a ideia anterior e a reforça; não é igual a "on the other hand".
instead|I didn't call. Instead, I wrote an email.|Eu não liguei. Em vez disso, escrevi um e-mail.|Troca uma ação por outra; "instead of" pede substantivo ou -ing.
though|He is rich. He is not happy, though.|Ele é rico. Não é feliz, porém.|No FIM da frase, "though" funciona como "porém" (informal); no início é conjunção concessiva.
@0.2
or|Do you want tea or coffee?|Você quer chá ou café?|Liga as opções; em listas, só o último item leva "or".
either… or|You can either call me or send an email.|Você pode ou ligar para mim ou mandar um e-mail.|Mantenha o paralelismo: a mesma estrutura depois de "either" e de "or".
neither… nor|Neither Ana nor Paulo came.|Nem Ana nem Paulo vieram.|Já é negativo: não acrescente outra negação. O verbo concorda com o sujeito mais próximo.
otherwise|Hurry up; otherwise, we will miss the bus.|Ande logo; senão, perderemos o ônibus.|Indica o que acontece se a primeira ação não ocorrer.
or else|Pay now, or else you will pay more.|Pague agora, senão pagará mais.|Informal e mais enfático que "otherwise".
alternatively|We can take the bus. Alternatively, we can walk.|Podemos pegar o ônibus. Alternativamente, podemos ir a pé.|Apresenta outra opção; vírgula depois.
or rather|He is my friend, or rather, my mentor.|Ele é meu amigo, ou melhor, meu mentor.|Corrige ou precisa o que acabou de ser dito.
whether… or|Whether you stay or go, call me.|Quer você fique, quer vá, me ligue.|Mostra que as duas opções levam ao mesmo resultado.
if not|Call me today, if not tomorrow.|Ligue-me hoje, se não amanhã.|Cuidado: não é a mesma coisa que "otherwise"; "if not" completa a primeira ideia.
@0.3
so|It was late, so we left.|Estava tarde, então fomos embora.|Informal; vírgula antes.
therefore|The sales fell; therefore, we cut costs.|As vendas caíram; portanto, cortamos custos.|Formal; advérbio de ligação.
thus|The test failed; thus, we changed the design.|O teste falhou; assim, mudamos o projeto.|Formal ou técnico.
hence|Costs rose; hence the new price.|Os custos subiram; daí o novo preço.|Muito formal; costuma vir seguido de substantivo.
consequently|He missed the deadline; consequently, he lost the client.|Ele perdeu o prazo; consequentemente, perdeu o cliente.|Formal; enfatiza causa e efeito.
as a result|The road closed. As a result, traffic grew.|A estrada fechou. Como resultado, o trânsito aumentou.|Aceita ponto antes e vírgula depois.
accordingly|The rules changed. Accordingly, we updated the manual.|As regras mudaram. Por isso, atualizamos o manual.|Formal; indica ação adequada à situação.
for this reason|The road was closed. For this reason, we turned back.|A estrada estava fechada. Por essa razão, voltamos.|Retoma a causa já citada; vírgula depois.
which is why|She speaks three languages, which is why she got the job.|Ela fala três idiomas, e é por isso que conseguiu o emprego.|Vem depois de vírgula e retoma a oração inteira; muito natural no dia a dia.
that's why|It was late. That's why we left.|Era tarde. É por isso que saímos.|Informal e muito comum; forma uma frase nova, sem vírgula antes.
then|If you are ready, then we can start.|Se você está pronto, então podemos começar.|Como conclusão lógica ("então"); não confunda com "than" (comparação).
@0.4
for|He was tired, for he had worked all night.|Ele estava cansado, pois trabalhara a noite toda.|Formal ou literário; sempre com vírgula e nunca abre a frase.
because|He was tired because he had worked all night.|Ele estava cansado porque trabalhara a noite toda.|Uso comum; pode abrir a frase (então, com vírgula).
since|Since you asked, I will explain.|Já que você perguntou, eu explico.|Causa já conhecida; costuma abrir a frase.
as|She stayed home, as she was ill.|Ela ficou em casa, pois estava doente.|Causal quando o motivo já é conhecido; também pode ser temporal ("enquanto"), então o contexto decide.
seeing that|Seeing that it's late, let's go.|Visto que está tarde, vamos embora.|Formal/neutro; apresenta o motivo como evidente.
given that|Given that she was ill, she stayed home.|Dado que ela estava doente, ficou em casa.|Formal; motivo aceito como fato.
@1.0
It + be + adj + that|It is clear that prices will rise.|É claro que os preços vão subir.|O "it" vazio na frente evita um sujeito longo.
It + be + adj + to|It is important to sleep well.|É importante dormir bem.|Infinitivo quando o sujeito é geral.
What…|What matters is your effort.|O que importa é o seu esforço.|"What" = "the thing that"; o verbo seguinte fica no singular.
That…|That he lied surprised everyone.|Que ele mentiu surpreendeu a todos.|Formal; no dia a dia prefira "It surprised everyone that he lied".
Whether…|Whether we win is not important.|Se vencemos não é importante.|Use "whether" (não "if") para abrir oração-sujeito.
whoever…|Whoever arrives first gets the seat.|Quem chegar primeiro fica com o lugar.|Sujeito indefinido ("qualquer pessoa que"); verbo no singular.
how…|How she did it is a mystery.|Como ela fez isso é um mistério.|Oração com "how" como sujeito; verbo no singular.
@1.1
that|She said that she was tired.|Ela disse que estava cansada.|O "that" pode ser omitido na fala: She said she was tired.
if / whether|I don't know if he will come.|Não sei se ele virá.|Pergunta sim/não indireta: sem inversão e sem auxiliar "do".
wh-words|Tell me where you live.|Diga-me onde você mora.|Ordem de afirmativa: "where you live", nunca "where do you live".
to + V|She wants to travel.|Ela quer viajar.|Depende do verbo: want, decide e hope pedem "to".
-ing|He enjoys cooking.|Ele gosta de cozinhar.|Depende do verbo: enjoy, avoid e finish pedem -ing.
that + base form|I suggest that he go home.|Sugiro que ele vá para casa.|Depois de suggest, insist e demand, o verbo fica na forma base.
whatever|She eats whatever he cooks.|Ela come o que quer que ele cozinhe.|"Whatever" = "tudo que"; também whoever e whichever.
how|He explained how it works.|Ele explicou como funciona.|Pergunta indireta: ordem de afirmativa (it works), nunca "does it work".
@1.2
verb + prep + -ing|She insists on paying.|Ela insiste em pagar.|A preposição pede -ing, nunca infinitivo.
verb + prep + wh-|We talked about what to do.|Conversamos sobre o que fazer.|A preposição vem antes do wh-.
verb + prep + whether|It depends on whether it rains.|Depende de chover ou não.|Depois de preposição use "whether", não "if".
prep + the fact that|He complained about the fact that it was late.|Ele reclamou do fato de ser tarde.|Depois de preposição, "that" sozinho não funciona: use "the fact that".
@1.3
noun + that|There is a rumor that he quit.|Há um boato de que ele saiu.|Complementa substantivos como idea, fact, belief e rumor.
noun + to|She has the ability to learn fast.|Ela tem a capacidade de aprender rápido.|Comum com ability, plan, decision e chance.
the fact that|The fact that she left surprised us.|O fato de ela ter saído nos surpreendeu.|Transforma uma oração inteira em substantivo.
the idea that|I like the idea that we meet weekly.|Gosto da ideia de nos reunirmos toda semana.|Explica o conteúdo da ideia.
the belief that|There is a belief that money brings happiness.|Há a crença de que dinheiro traz felicidade.|Substantivo abstrato + that; o "that" não pode ser omitido aqui.
the hope that|She clung to the hope that he would return.|Ela se agarrou à esperança de que ele voltasse.|Em português, "de que" + subjuntivo.
the possibility that|There is a possibility that it will rain.|Há a possibilidade de que chova.|Usa "there is/was" na frente.
the news that|The news that he resigned surprised us.|A notícia de que ele renunciou nos surpreendeu.|A oração completa o sentido do substantivo "news".
@1.4
be + that|The problem is that we have no time.|O problema é que não temos tempo.|Depois de "be", mostra o que o sujeito é.
be + to|My goal is to improve my English.|Meu objetivo é melhorar meu inglês.|Para objetivo, plano e missão.
be + wh-|That is why she left.|É por isso que ela saiu.|Frequente: that's why, what, where e how.
the reason is that|The reason is that prices rose.|A razão é que os preços subiram.|No inglês formal evite "the reason is because".
the problem is that|The problem is that nobody knows.|O problema é que ninguém sabe.|Estrutura muito frequente; mesmo formato para "the point/truth/fact is that".
the point is that|The point is that we need time.|A questão é que precisamos de tempo.|Introduz a ideia central do argumento.
the truth is that|The truth is that I am afraid.|A verdade é que tenho medo.|O "that" costuma ser omitido na fala.
the idea is to|The idea is to save money.|A ideia é economizar dinheiro.|Infinitivo quando o sujeito é o mesmo; com sujeito diferente: "the idea is that we…".
@1.5
noun + : that|He had one fear: that he would fail.|Ele tinha um medo: o de fracassar.|Os dois-pontos explicam o substantivo anterior.
noun + : to|We have one goal: to win.|Temos um objetivo: vencer.|Aposto em infinitivo.
noun + that-clause|The news that she won made us happy.|A notícia de que ela venceu nos deixou felizes.|Sem vírgula; aqui "that" não é pronome relativo e não pode ser omitido.
one goal: to|My goal: to learn English.|Meu objetivo: aprender inglês.|Os dois-pontos esclarecem o substantivo que veio antes; infinitivo quando é uma meta.
one reason: that|She had one reason: that he needed her.|Ela tinha um motivo: que ele precisava dela.|Formal; o "that" é obrigatório.
@2.0
who|The woman who called is my boss.|A mulher que ligou é minha chefe.|Para pessoas; pode ser trocado por "that".
which|The laptop which I bought is fast.|O laptop que comprei é rápido.|Para coisas; mais formal que "that".
that|The book that I read was long.|O livro que li era longo.|Pessoas ou coisas; some quando é objeto (The book I read).
whose|I know a man whose son is a pilot.|Conheço um homem cujo filho é piloto.|Posse; o substantivo vem logo depois de "whose".
where|This is the town where I was born.|Esta é a cidade onde nasci.|Lugar; equivale a "in which".
when|I remember the day when we met.|Lembro do dia em que nos conhecemos.|Tempo; pode ser omitido ou trocado por "that".
whom|The person whom I met was kind.|A pessoa que eu conheci era gentil.|Objeto de pessoa; formal. No dia a dia usa-se "who" ou "that", ou nada.
why|I know the reason why she left.|Sei o motivo pelo qual ela saiu.|Só depois de "reason"; pode ser omitido.
prep + which|The room in which we met is closed.|A sala na qual nos encontramos está fechada.|Muito formal; na fala a preposição vai para o fim: "the room we met in".
that (omitido)|The book I bought is great.|O livro que comprei é ótimo.|Quando o pronome é objeto, ele pode sumir. Quando é sujeito, nunca.
whereby|It is a system whereby everyone benefits.|É um sistema pelo qual todos se beneficiam.|Formal, jurídico; "pelo qual".
@2.1
who (com vírgulas)|My brother, who lives in Paris, is a chef.|Meu irmão, que mora em Paris, é cozinheiro.|Informação extra: pode ser retirada sem mudar quem é identificado. Aqui não se usa "that".
which|The report, which was late, was approved.|O relatório, que estava atrasado, foi aprovado.|Também pode comentar a frase inteira: He passed, which surprised us.
whose|Ana, whose car was stolen, called the police.|Ana, cujo carro foi roubado, chamou a polícia.|Posse, entre vírgulas.
where|Rio, where I grew up, is beautiful.|O Rio, onde cresci, é lindo.|Lugar já identificado.
when|In July, when it is hot, we go to the beach.|Em julho, quando faz calor, vamos à praia.|Tempo já identificado.
whom|My teacher, whom I admire, retired.|Meu professor, a quem admiro, se aposentou.|Objeto de pessoa; formal e sempre entre vírgulas.
of which|The house, the roof of which leaks, is old.|A casa, cujo telhado vaza, é velha.|Alternativa formal a "whose" para coisas.
which (oração inteira)|He passed, which surprised everyone.|Ele passou, o que surpreendeu a todos.|"Which" retoma a oração inteira; nunca "that" nem "what".
@3.0
in order to|She works in order to save money.|Ela trabalha para economizar dinheiro.|Mesmo sujeito; neutro ou formal. Negativo: in order not to.
so as to|He left early so as to avoid traffic.|Ele saiu cedo de modo a evitar o trânsito.|Formal. Negativo: so as not to.
to|I called to ask for help.|Liguei para pedir ajuda.|A forma mais comum e informal.
so that|He works so that his kids can study.|Ele trabalha para que os filhos possam estudar.|Sujeito diferente; pede modal (can, could, will, would).
in case|Take an umbrella in case it rains.|Leve um guarda-chuva caso chova.|Prevenção; não use "will" depois de "in case".
lest|He spoke quietly lest anyone hear.|Ele falou baixo para que ninguém ouvisse.|Muito formal ou literário; verbo na forma base.
in order that|The rules exist in order that everyone is safe.|As regras existem a fim de que todos fiquem seguros.|Formal, com sujeito próprio na 2ª oração; no dia a dia use "so that".
with the aim of|She moved with the aim of finding a job.|Ela se mudou com o objetivo de encontrar um emprego.|Depois de "of" vem -ing, nunca infinitivo.
for fear that|He hid the keys for fear that she might find them.|Ele escondeu as chaves com receio de que ela as encontrasse.|Finalidade negativa (evitar algo); muito formal, com "might/should".
@3.1
because|I work because I need money.|Trabalho porque preciso de dinheiro.|Responde a "why"; pede oração completa.
since|Since it was late, we left.|Como era tarde, fomos embora.|Causa já conhecida; costuma abrir a frase.
as|As it was raining, we stayed home.|Como estava chovendo, ficamos em casa.|Mais formal; pode confundir com sentido de tempo.
because of|We stayed home because of the rain.|Ficamos em casa por causa da chuva.|Pede substantivo, não oração.
due to|The delay was due to a strike.|O atraso foi devido a uma greve.|Formal; costuma vir depois de "be".
thanks to|Thanks to you, we won.|Graças a você, vencemos.|Causa positiva.
now that|Now that you are here, we can start.|Agora que você chegou, podemos começar.|Causa que acabou de se tornar verdadeira.
given that|Given that it is late, we should go.|Dado que é tarde, devemos ir.|Formal; o motivo é tratado como fato aceito.
seeing that|Seeing that nobody came, she left.|Visto que ninguém veio, ela saiu.|Neutro; pode abrir ou fechar a frase.
inasmuch as|The plan works inasmuch as it is simple.|O plano funciona na medida em que é simples.|Muito formal; mistura causa e limite ("na medida em que").
owing to|Owing to the rain, the match was cancelled.|Devido à chuva, a partida foi cancelada.|Preposição: pede substantivo (ou "the fact that"). Formal.
on account of|He retired on account of his health.|Ele se aposentou por causa da saúde.|Preposição; mesmo uso de "because of", em registro mais formal.
@3.2
so… that|It was so cold that the lake froze.|Estava tão frio que o lago congelou.|"So" + adjetivo ou advérbio.
such… that|She is such a good teacher that everyone loves her.|Ela é uma professora tão boa que todos a adoram.|"Such" + (a) + (adjetivo) + substantivo.
so much / many… that|He ate so much that he felt sick.|Ele comeu tanto que passou mal.|Quantidade: much (incontável) e many (contável).
so… as to|He was so kind as to help us.|Ele foi gentil a ponto de nos ajudar.|Formal.
to such an extent that|He worked to such an extent that he got ill.|Ele trabalhou a tal ponto que adoeceu.|Formal; mede a intensidade da ação.
with the result that|The bridge closed, with the result that traffic stopped.|A ponte fechou, de modo que o trânsito parou.|Resultado de um fato; vírgula antes.
so… as|It is not so hard as I thought.|Não é tão difícil quanto pensei.|Em negativas, "not so… as" equivale a "not as… as" (comparação, não consequência).
@3.3
if|If it rains, we will stay home.|Se chover, ficaremos em casa.|Nunca "will" depois de "if" no tipo 1.
unless|Unless you hurry, you will be late.|A menos que você se apresse, vai se atrasar.|Equivale a "if not": a oração fica afirmativa.
as long as|You can go as long as you finish.|Você pode ir desde que termine.|Condição necessária; sem "will".
provided that|I will lend it provided that you return it.|Emprestarei desde que você devolva.|Formal; também "providing that".
in case|Take a coat in case it gets cold.|Leve um casaco caso esfrie.|Precaução; não é o mesmo que "if".
even if|I will go even if it rains.|Irei mesmo que chova.|A condição não muda o resultado.
supposing|Supposing he refuses, what then?|E se ele recusar, o que fazemos?|Hipótese.
on condition that|You may go on condition that you finish.|Você pode ir com a condição de que termine.|Formal; presente no inglês e subjuntivo no português.
so long as|You can stay so long as you are quiet.|Você pode ficar desde que fique quieto.|Sinônimo de "as long as", mais informal; presente simples, nunca will.
assuming (that)|Assuming that she agrees, we can start.|Supondo que ela concorde, podemos começar.|Hipótese de trabalho; o "that" pode ser omitido.
only if|We will go only if it stops raining.|Só iremos se parar de chover.|Condição única; depois de "only if" no início da frase, inverte-se a ordem: "Only if it stops will we go".
in the event that|In the event that it rains, the party moves inside.|Caso chova, a festa passa para dentro.|Formal, para algo possível mas pouco provável.
if not|Come early, if not we'll miss it.|Venha cedo; se não, perderemos.|Atalho informal para "if you don't"; "otherwise" é mais usual.
@3.4
although|Although it was late, we kept working.|Embora fosse tarde, continuamos trabalhando.|Pede oração completa; nunca use "but" junto.
though|He came, though he was tired.|Ele veio, embora estivesse cansado.|Mais informal; pode ir no fim da frase.
even though|Even though it was expensive, she bought it.|Mesmo sendo caro, ela comprou.|Mais forte que "although"; o fato é real.
despite / in spite of|Despite the rain, they played.|Apesar da chuva, eles jogaram.|Seguidos de substantivo ou -ing; nunca "despite of".
while|While I like him, I disagree.|Embora eu goste dele, discordo.|Sentido concessivo no início da frase.
however + adj|However hard he tried, he failed.|Por mais que tentasse, fracassou.|"However" + adjetivo + sujeito + verbo.
no matter how|No matter how hard it is, I will try.|Não importa o quão difícil seja, tentarei.|Equivale a "however".
whereas|He saves money, whereas she spends it.|Ele economiza, ao passo que ela gasta.|Contraste entre dois fatos; formal, vírgula antes.
albeit|It was a good, albeit short, trip.|Foi uma boa viagem, ainda que curta.|Muito formal; liga adjetivos ou expressões, quase nunca uma oração completa.
much as|Much as I like her, I disagree.|Por mais que eu goste dela, discordo.|Estrutura de abertura; indica sentimento forte apesar do contraste.
regardless of|They played regardless of the weather.|Eles jogaram independentemente do clima.|Preposição: substantivo ou -ing.
whatever|Whatever you say, I will go.|Diga o que disser, eu irei.|Concessiva de totalidade ("qualquer coisa que"); também existem whoever, wherever, whenever.
notwithstanding|Notwithstanding the cost, they bought it.|Não obstante o custo, eles compraram.|Muito formal, jurídico; vem antes ou depois do substantivo.
even if|Even if it rains, we will go.|Mesmo que chova, nós iremos.|Hipótese ("mesmo que talvez"), enquanto "even though" é um fato real.
@3.5
when|When I arrive, I will call.|Quando eu chegar, ligarei.|Para o futuro, presente depois de "when".
while|While she cooked, he cleaned.|Enquanto ela cozinhava, ele limpava.|Ações simultâneas, em geral contínuas.
before|Wash your hands before you eat.|Lave as mãos antes de comer.|Presente com valor de futuro.
after|After he left, it rained.|Depois que ele saiu, choveu.|Mesma regra de tempo.
until|Wait until I call.|Espere até eu ligar.|Sem "will".
as soon as|I will call as soon as I arrive.|Ligo assim que chegar.|O futuro vira presente.
by the time|By the time we arrived, the show had started.|Quando chegamos, o show já tinha começado.|Pede past perfect na principal.
since|I have lived here since I was born.|Moro aqui desde que nasci.|Marca o início; a principal fica no present perfect.
once|Once you finish, call me.|Assim que terminar, me ligue.|Parecido com "as soon as".
whenever|Whenever I travel, I read.|Sempre que viajo, leio.|Toda vez que. No passado é hábito: 'Whenever she needed money, she worked' = 'Sempre que precisava de dinheiro, ela trabalhava' (imperfeito, não perfeito).
as|She called as I was leaving.|Ela ligou quando eu estava saindo.|Duas ações ao mesmo tempo ("enquanto/quando"); cuidado com "as" causal.
the moment|The moment she arrived, it began to rain.|No momento em que ela chegou, começou a chover.|Como "as soon as"; não leva "that" e vem antes do sujeito.
every time|Every time he calls, I answer.|Toda vez que ele liga, eu atendo.|Habitual; presente simples (nunca will) mesmo falando de futuro. No passado o português usa o imperfeito (toda vez que ligava, eu atendia).
each time|Each time she tries, she improves.|Cada vez que ela tenta, melhora.|Igual a "every time", com foco em cada ocorrência (no passado, imperfeito: cada vez que tentava, melhorava).
the first time|The first time I met him, I was nervous.|A primeira vez que o conheci, fiquei nervoso.|Funciona como conjunção; também: the last time, the next time.
till|Wait till she calls.|Espere até que ela ligue.|Informal para "until"; no início da frase prefira "until".
whilst|Whilst she cooked, he read.|Enquanto ela cozinhava, ele lia.|Variante britânica e formal de "while".
@3.6
as… as|She is as tall as her sister.|Ela é tão alta quanto a irmã.|Igualdade; na negativa: not as (so)… as.
than|He runs faster than I do.|Ele corre mais rápido do que eu.|Comparativo + "than".
the same as|My bag is the same as yours.|Minha bolsa é igual à sua.|Idêntico.
the same way as|She works the same way as he does.|Ela trabalha do mesmo jeito que ele.|Compara o modo da ação; depois vem sujeito + auxiliar. Sem 'the same way', use 'the same as' + substantivo.
like|He swims like a fish.|Ele nada como um peixe.|Preposição: vem antes de substantivo ou pronome objeto (like him). 'Like he does' é informal.
as if|She acts as if she knew everything.|Ela age como se soubesse tudo.|Comparação hipotética: verbo no passado.
as though|It looks as though it will rain.|Parece que vai chover.|Igual a "as if".
as much as|He eats as much as I do.|Ele come tanto quanto eu.|Igualdade com verbo; o auxiliar final repete o tempo ("do").
not so… as|She is not so tall as her brother.|Ela não é tão alta quanto o irmão.|Mesmo sentido de "not as… as"; formal e antigo.
different from|This plan is different from the old one.|Este plano é diferente do antigo.|No inglês americano também se ouve "different than"; "from" é a forma mais segura.
similar to|His style is similar to hers.|O estilo dele é parecido com o dela.|Preposição "to", nunca "with".
rather than|She chose tea rather than coffee.|Ela escolheu chá em vez de café.|Preferência; vem seguido de verbo base ou -ing quando liga verbos.
than if|He spoke more softly than if he were angry.|Ele falou mais baixo do que se estivesse com raiva.|Compara com situação hipotética; usa passado (were).
@3.7
as|Do it as I told you.|Faça como eu disse.|Conforme.
just as|Just as I expected, he failed.|Exatamente como eu esperava, ele fracassou.|Dá ênfase.
according to|According to the report, sales rose.|De acordo com o relatório, as vendas subiram.|Preposição: vem antes de substantivo; nunca "according to me".
as per|As per our contract, payment is due.|Conforme nosso contrato, o pagamento é devido.|Formal e comercial.
in accordance with|Act in accordance with the rules.|Aja de acordo com as regras.|Muito formal.
the way|Do it the way I showed you.|Faça do jeito que eu mostrei.|"The way" funciona como conjunção; não precisa de "that" ou "in which".
just like|She talks just like her mother.|Ela fala exatamente como a mãe.|Informal; seguido de substantivo ("like") ou de oração em inglês coloquial.
in line with|The results are in line with the plan.|Os resultados estão de acordo com o plano.|Preposição formal; substantivo depois.
exactly as|Cook it exactly as the recipe says.|Cozinhe exatamente como a receita diz.|Reforça a fidelidade à fonte.
@3.8
the more… the more|The more you practice, the more you improve.|Quanto mais você pratica, mais melhora.|Repita "the" nas duas partes.
as (progressivo)|As he grew older, he became wiser.|À medida que envelhecia, ficou mais sábio.|Mudança simultânea e gradual.
the + comparative…|The sooner, the better.|Quanto antes, melhor.|Forma curta, sem verbo.
the less… the more|The less I sleep, the more I worry.|Quanto menos durmo, mais me preocupo.|Pode misturar "less" e "more".
the sooner… the better|The sooner you start, the better.|Quanto antes você começar, melhor.|Estrutura reduzida muito usada; o verbo "be" some.
the longer… the more|The longer we wait, the more it costs.|Quanto mais esperamos, mais custa.|Repita "the" nas duas partes; comparativo logo depois.
more and more|The city gets more and more crowded.|A cidade fica cada vez mais cheia.|Aumento progressivo; com adjetivos curtos usa-se "-er and -er" (louder and louder).
as… so|As the days passed, so her fear grew.|À medida que os dias passavam, assim crescia o medo dela.|Literário; o "so" inverte a ordem.
@4.0
while|She works while listening to music.|Ela trabalha ouvindo música.|Duas ações ao mesmo tempo, mesmo sujeito. Em português basta o gerúndio.
after|After finishing, she rests.|Depois de terminar, ela descansa.|Marca a ordem. Abre bem a frase; em português: depois de + infinitivo.
before|Before leaving, check the lights.|Antes de sair, confira as luzes.|Antes de + -ing; em português, antes de + infinitivo.
by|You learn by practicing.|Aprende-se praticando.|Diz o meio (“como?”). Em português: gerúndio.
without|He left without saying goodbye.|Ele saiu sem se despedir.|Já é negativo: nunca “without not”.
upon|Upon arriving, call me.|Ao chegar, ligue para mim.|Formal (“assim que”). On + -ing também existe: “On hearing the news…”.
having|Having studied all night, she passed.|Tendo estudado a noite toda, ela passou.|Having + particípio = ação anterior à da principal.
(só -ing)|Working hard, she improves.|Trabalhando muito, ela melhora.|Sem conjunção: dá o modo ou a causa. O sujeito do -ing é o da principal.
@4.1
once|Once approved, the plan starts.|Uma vez aprovado, o plano começa.|= once it is approved; sujeito + be omitidos.
when|When asked, she explains.|Quando solicitada, ela explica.|= when she is asked; o particípio concorda em português.
if|If needed, call me.|Se necessário, me ligue.|= if it is needed; “se necessário” é expressão fixa.
although|Although tired, he went on.|Embora cansado, ele seguiu.|= although he was tired; admite um obstáculo.
unless|Unless told otherwise, we start at nine.|A menos que se diga o contrário, começamos às nove.|Condição negativa reduzida; muito usada em regras e avisos.
(só -ed)|Tired after work, she studied.|Cansada depois do trabalho, ela estudou.|Sem conjunção: dá a causa ou o estado.
@4.2
to|She decided to move.|Ela decidiu se mudar.|Want, need, decide, hope, learn, plan, try, promise pedem to + verbo.
-ing|He avoids driving at night.|Ele evita dirigir à noite.|Enjoy, avoid, finish, suggest, practice, consider pedem -ing.
like / love / prefer|I like to swim. / I like swimming.|Gosto de nadar.|Aceitam as duas formas, com diferença sutil: to = escolha pontual; -ing = gosto em geral.
stop|She stopped working. / She stopped to work.|Ela parou de trabalhar. / Ela parou para trabalhar.|Atenção: stop + -ing = parar a ação; stop + to = parar para fazer outra coisa.
@4.3
-ing|The girl sitting there is my sister.|A menina sentada ali é minha irmã.|Equivale a “who is sitting”. Em português costuma ser “que está sentada”.
-ed|The report sent yesterday is wrong.|O relatório enviado ontem está errado.|Equivale a “that was sent”. Passivo.
to|He is the only one to know.|Ele é o único a saber.|Depois de the first / the last / the only: to + verbo. Também: something to eat.
`;
const ORAC_CONJ = {};
(function(){
  let k = null;
  ORAC_CONJ_TXT.split('\n').forEach(l => {
    if(l[0] === '@'){ k = l.slice(1); ORAC_CONJ[k] = []; return; }
    const p = l.split('|'); if(k && p.length === 4) ORAC_CONJ[k].push({ c:p[0], en:p[1], pt:p[2], nota:p[3] });
  });
})();
/* ================= v106: FORMAÇÃO · RESTRIÇÕES · PERFIL DE VERBOS =================
   Cada oração do motor ganha: natureza (função sintática), fórmula, passo a passo, restrições e a lista de verbos que
   se aplicam. As listas saem das MESMAS tabelas que o motor usa (O2_SUBJ, O2_OBJI, O2_CN…), então nunca divergem. */
const O2_FORM = {
  adit:{ n:'Coordenada sindética aditiva — soma uma ideia da mesma natureza.', f:'Oração 1 + and + oração 2 (mesmo tempo e aspecto)',
    p:['Escolha a principal (sujeito, tempo, aspecto, verbo).', 'O motor sugere como verbo 2 um <b>sinônimo</b> do verbo 1 (a ideia se soma, não se opõe).', 'Tempo e aspecto da 2ª oração são os da 1ª; o sujeito se repete (com o mesmo sujeito a elipse é possível: “She studies and works”).', 'Vírgula só em orações longas ou em listas; <b>and also</b> reforça a soma.'],
    r:['Só aparecem verbos 2 quando o verbo 1 tem <b>sinônimos</b> cadastrados.', 'Em perguntas só a finalidade é permitida.', 'Depois de <i>as well as</i> o verbo vai para -ing (“as well as working”).'] },
  adv:{ n:'Coordenada sindética adversativa — contrapõe duas ideias.', f:'Oração 1 , but / yet + oração 2 (antônimo)',
    p:['Escolha a principal.', 'O verbo 2 vem dos <b>antônimos</b> do verbo 1, afirmativo ou negado (“likes… but doesn’t buy”).', 'A 2ª oração herda tempo e aspecto da 1ª.', '<b>Vírgula obrigatória</b> antes de but / yet.'],
    r:['Só há sugestão quando o verbo 1 tem <b>antônimo</b> cadastrado.', '<i>However</i> não une duas orações só com vírgula: pede ponto e vírgula ou ponto.', 'Nunca “although… but” na mesma frase.'] },
  alt:{ n:'Coordenada sindética alternativa — apresenta outra possibilidade.', f:'Oração 1 + or / , otherwise + oração 2',
    p:['Escolha a principal.', 'Verbo 2: antônimos primeiro (a outra via), depois sinônimo.', '<b>Or</b> sem vírgula quando curta; <b>otherwise</b> (= se não) vem depois de vírgula.', 'Tempo e aspecto da 1ª oração.'],
    r:['Precisa de antônimo ou sinônimo cadastrado.', 'Either… or / neither… nor: o verbo concorda com o sujeito mais próximo.'] },
  cons:{ n:'Coordenada sindética conclusiva — introduz o resultado.', f:'Oração 1 , so + sujeito + verbo',
    p:['Escolha a principal (a causa).', 'O verbo 2 é o resultado, sugerido pelo tema do verbo 1.', 'Contínuos viram <b>simples</b>: resultados pedem o simples.', '<b>Vírgula antes</b> de so.'],
    r:['<i>So</i> ≠ <i>so that</i> (finalidade).', 'Therefore / thus / hence são formais e pedem ponto e vírgula.'] },
  expl:{ n:'Coordenada sindética explicativa — justifica a afirmação anterior.', f:'Oração 1 , for + sujeito + verbo',
    p:['Escolha a principal (a afirmação).', 'O verbo 2 traz a justificativa.', 'Contínuos viram simples; <b>vírgula antes</b> de for.'],
    r:['<i>For</i> conjunção é formal/literário e <b>nunca abre a frase</b>.', 'No dia a dia use because.'] },
  final:{ n:'Subordinada adverbial final — adjunto de finalidade (“para quê?”).', f:'Principal + in order to / so as to / to + verbo base  ·  so that + sujeito + can/could + verbo base',
    p:['Escolha a principal.', 'Mesmo sujeito → <b>infinitivo</b>: in order to / so as to / to + verbo base (sem sujeito nem tempo próprios).', 'Sujeito diferente → <b>so that</b> + sujeito + can (presente) / could (passado) + verbo base.', 'Negativa: <b>in order not to</b> / <b>so as not to</b> (“to not” é ambíguo).'],
    r:['“For to” não existe.', 'Único tipo permitido em perguntas.', 'Verbos 2 curados (✓) para parte dos verbos; os demais usam sugestões por tema (≈).', '<i>So that</i> não abre a frase.'] },
  caus:{ n:'Subordinada adverbial causal — adjunto de causa (“por quê?”).', f:'Principal + because + sujeito + verbo  ·  Since + oração, principal',
    p:['Escolha a principal (o efeito).', 'Because + <b>oração completa</b> (sujeito + verbo).', 'Tempo da principal; aspectos contínuos viram simples.', '<b>Since</b> causal costuma abrir a frase, com vírgula (ordem automática).'],
    r:['Nunca “because to…”.', '<i>Because of</i> pede substantivo (não coberto como oração).', '<i>Since</i> causal ≠ <i>since</i> temporal (“desde”).'] },
  csq:{ n:'Subordinada adverbial consecutiva (intensiva) — a intensidade gera uma consequência.', f:'Principal + so + advérbio + that + oração  ·  so much that  ·  in such a way that',
    p:['Escolha a principal (a ação).', 'O motor escolhe um advérbio de grau do <b>tema</b> do verbo (seriously, often, carefully…).', 'So + advérbio + <b>that</b> + oração completa.', 'A consequência vem no tempo da principal, em aspecto simples.'],
    r:['<i>So</i> + advérbio/adjetivo; <i>such</i> + (a) + adjetivo + substantivo.', 'Não confundir com <i>so that</i> (finalidade).', 'A consequência pode ser negada (“…that she doesn’t…”).'] },
  temp:{ n:'Subordinada adverbial temporal — situa a ação no tempo.', f:'when / as soon as / after / while / before / until + sujeito + verbo',
    p:['Escolha a principal.', 'Escolha a conjunção temporal.', 'Se a principal for futura, a temporal vai para o <b>presente simples</b> (“I will call when she arrives”).', 'Em português: futuro do subjuntivo (“quando ela chegar”); <i>before/until</i> pedem subjuntivo.'],
    r:['<b>Nunca will</b> depois de when, as soon as, after, while, before, until.', '<i>While</i> no passado → contínuo.', 'Ordem pode inverter (temporal na frente) com vírgula.'] },
  cond:{ n:'Subordinada adverbial condicional — condição para a principal.', f:'0: if + presente → presente · 1: if + presente → will · 2: if + passado → would · 3: if + past perfect → would have + particípio',
    p:['Escolha o tipo (0–3): o motor ajusta o tempo da principal.', 'Oração do <i>if</i> no tempo do tipo (nunca will/would nela).', 'No tipo 2/3 a principal troca <i>will</i> por <i>would</i> / <i>would have</i>.', '<b>Unless</b> = if… not (oração afirmativa); <b>as long as</b> = desde que.'],
    r:['<i>Unless</i> e <i>as long as</i> só existem nos tipos 0–1.', 'Português: subjuntivo (“se chover”, “se eu tivesse”).', 'A condicional pode abrir a frase (vírgula).'] },
  conc:{ n:'Subordinada adverbial concessiva — contraste inesperado.', f:'although / though / even though + oração  ·  despite / in spite of + substantivo',
    p:['Escolha a principal.', 'Although/though/even though + <b>oração</b> (“it is hard”).', 'Despite / in spite of + <b>substantivo</b> ou -ing.', 'Although, even though, despite e in spite of abrem a frase com vírgula.'],
    r:['Nunca “despite of”.', 'Nunca “although… but”.', 'Em português a concessiva pede subjuntivo (“embora seja”).'] },
  cmp:{ n:'Subordinada adverbial comparativa — compara modo/grau com outra pessoa.', f:'as + advérbio + as  ·  more/less + advérbio + than  +  sujeito 2 + auxiliar',
    p:['Escolha a principal.', 'O motor escolhe um advérbio do tema do verbo e um 2º sujeito (She↔he, I↔you…).', 'Igualdade: <b>as … as</b>; superioridade: <b>more … than</b>; inferioridade: <b>less … than</b>.', 'Depois de as/than fica <b>só o auxiliar</b> (do/does/did, is/are, has/have, will) — o verbo não se repete.'],
    r:['Auxiliar acompanha tempo e aspecto da principal.', 'Em português o verbo some (“…quanto ele”).', 'Advérbios regulares (-ly, often); irregulares (well/better) ainda não.'] },
  conf:{ n:'Subordinada adverbial conformativa — conformidade com o que foi dito ou combinado.', f:'as / just as + oração  ·  according to / as per + substantivo',
    p:['Escolha a principal.', '<b>As / just as</b> + oração (“as we planned”).', '<b>According to / as per</b> + substantivo (“according to the plan”).', '<i>According to</i> abre a frase com vírgula (ordem automática).'],
    r:['Sempre “according <b>to</b>” (nunca with).', 'According to + substantivo, nunca + oração.', '<i>As per</i> é formal/comercial.'] },
  prop:{ n:'Subordinada adverbial proporcional — duas variações que crescem juntas.', f:'The more/less + oração 1 , the more/less + oração 2  ·  As + oração 1 , oração 2 + more',
    p:['Escolha a principal (1º termo).', 'Escolha o verbo do 2º termo (o que cresce ou diminui junto).', 'Repita <b>the</b> nas duas partes; ordem sujeito + verbo (sem inversão).', 'A quantidade vem depois de “the more”: “the more <i>money</i> she earns”.'],
    r:['Principal afirmativa, presente ou passado simples, sem palavra de frequência.', 'No futuro o inglês usa presente na 1ª parte (ainda não coberto).', 'Misturar more/less é normal.'] },
  subj:{ n:'Subordinada substantiva subjetiva — faz o papel de sujeito.', f:'It + be + adjetivo + that + oração  ·  It + be + adjetivo + to + verbo',
    p:['Escolha o adjetivo de avaliação.', 'Com <b>that</b>: a principal inteira vira a oração (mantém pronome, tempo e negação).', 'Com <b>to</b>: só verbo + colocação no infinitivo (frase geral).', 'O verbo <i>be</i> segue o tempo (is / was / will be).'],
    r:['That: adjetivos de <b>certeza</b> (true, clear, obvious) → indicativo em português.', 'Adjetivos de opinião (important, necessary) pedem subjuntivo em PT — por isso, com that, o motor usa só certeza.', 'To: pronome/aspecto da principal não entram.'] },
  obj:{ n:'Subordinada substantiva objetiva direta — é o objeto do verbo.', f:'verbo + that / if / whether + it (ou sujeito) + be + adjetivo',
    p:['Escolha um verbo de pensar, dizer, saber ou perguntar.', 'O motor oferece <b>só</b> as conjunções que ele aceita.', '<b>That</b> (pode ser omitido), <b>if / whether</b> (pergunta indireta: ordem de afirmativa).', 'No passado, backshift: “said that it <i>was</i>”.'],
    r:['That → verbos de pensar/dizer; if/whether → verbos de saber/perguntar.', '<i>Hope</i> e <i>doubt</i> pedem subjuntivo em PT.', 'Não combina com colocação (o objeto é a oração).'] },
  oq:{ n:'Subordinada substantiva objetiva direta interrogativa — a pergunta como objeto do verbo.', f:'verbo de saber/perguntar + palavra interrogativa + sujeito + verbo (ordem de afirmativa)',
    p:['Escolha um verbo de <b>saber, perguntar, explicar ou decidir</b> (know, ask, wonder, explain, decide…).', 'Escolha a palavra interrogativa (what, where, which one, how long…).', 'O motor oferece os verbos que combinam com ela, os mesmos dos Gatilhos de resposta.', 'Ordem de afirmativa: “where <b>she lives</b>”, sem do/does.'],
    r:['Nunca inverta dentro da pergunta indireta: “I don\'t know where does she live” ✗.', 'Sem ponto de interrogação, a menos que a principal seja pergunta (“Do you know where she lives?”).', 'Não combina com colocação (o objeto é a pergunta).'] },
  oi:{ n:'Subordinada substantiva objetiva indireta — objeto de verbo com preposição.', f:'verbo + preposição + how / whether + it (ou sujeito) + be + adjetivo  ·  verbo + preposição + verbo-ing',
    p:['Escolha um verbo que pede preposição.', 'O motor usa a preposição própria dele (talk <b>about</b>, depend <b>on</b>…).', 'Depois dela: how/whether + oração, ou verbo em <b>-ing</b>.', 'Na oração, ordem de afirmativa (“how difficult it is”).'],
    r:['Depois de preposição: nunca <i>that</i> nem <i>if</i> (“depend on whether”).', 'Cada verbo aceita só alguns complementos (veja a lista).', 'Não combina com colocação.'] },
  cn:{ n:'Subordinada substantiva completiva nominal — completa um substantivo.', f:'verbo + the + substantivo abstrato + that + it (ou sujeito) + be + adjetivo',
    p:['Escolha um verbo que aceita substantivo abstrato.', 'O substantivo (idea, fact, rumor…) é o objeto do verbo.', '<b>That</b> + oração completa explica o conteúdo do substantivo.', 'Português: “a ideia <b>de que</b>…”.'],
    r:['Cada verbo aceita alguns substantivos (veja a lista).', 'Possibility, hope, concern → subjuntivo em PT.', 'Diferença da relativa: aqui a oração é <b>completa</b>.'] },
  ap:{ n:'Subordinada substantiva apositiva — explica um substantivo depois de dois-pontos.', f:'verbo + one + substantivo : that + it (ou sujeito) + be + adjetivo  ·  verbo + one + substantivo : to + verbo',
    p:['Escolha um verbo que aceita o substantivo (has <b>one goal</b>, accepts <b>one idea</b>).', 'O substantivo vem com <b>one</b> e é seguido de <b>dois-pontos</b>.', 'Com <b>that</b>: oração completa (conteúdo de ideia, fato, crença). Com <b>to</b>: infinitivo (objetivo, plano, sonho, desejo).', 'Português: “um objetivo: ganhar mais dinheiro”; “uma ideia: que é arriscado”.'],
    r:['Substantivos de conteúdo (idea, fact, belief…) levam <b>that</b>; substantivos de intenção (goal, plan, dream, wish) levam <b>to</b>.', 'Cada verbo aceita alguns substantivos (veja a lista).', 'Possibility, hope, concern → subjuntivo em PT.', 'Não combina com colocação (o objeto é o substantivo).', 'Diferente da completiva nominal: aqui há pausa (dois-pontos) e o substantivo é novidade, não dado conhecido.'] },
  pred:{ n:'Subordinada substantiva predicativa — completa o verbo be.', f:'The + substantivo + be + that + oração',
    p:['Escolha o substantivo (truth, problem, point).', 'O verbo <i>be</i> segue o tempo da principal.', 'A principal inteira vira a oração depois de that.', 'Português: “A verdade <b>é que</b>…”.'],
    r:['Use <i>that</i>, não “is because”.', 'Ordem sujeito + verbo na oração.'] },
  rel:{ n:'Subordinada adjetiva restritiva — diz qual substantivo.', f:'substantivo (colocação) + that / which / who / where / when + sujeito + verbo (sem objeto)  ·  whose + substantivo + be + adjetivo',
    p:['Escolha, no dial ⑨, uma colocação com objeto (a laptop) ou pessoa (with clients).', 'O pronome relativo substitui o objeto: <b>who</b> para pessoas, <b>which/that</b> para coisas, <b>where</b> para lugares, <b>when</b> para tempo.', '<b>Whose</b> (cujo/cuja) marca posse e é seguido do substantivo possuído: “a client whose company is successful”.', 'O verbo da relativa é sugerido (need, use, want, like…) e fica <b>sem objeto</b>.', 'Sem vírgula; não pode ser retirada.'],
    r:['Nunca “that she needs <i>it</i>”.', '<b>Where</b> só com lugar (house, city, office…) e <b>when</b> só com tempo (day, time, year…): com outro substantivo o motor troca o pronome e avisa.', 'Não combina com palavras-sinal de fim.', 'Português: “de que / de quem” quando o verbo pede preposição (precisar de).'] },
  rger:{ n:'Subordinada adverbial reduzida de gerúndio — tempo, meio, causa ou modo, sem sujeito próprio.', f:'while / after / before / by / without / upon + verbo-ing  ·  having + particípio  ·  verbo-ing sozinho',
    p:['Escolha a principal: o <b>sujeito dela</b> será o da reduzida.', 'Escolha o verbo da reduzida (sugestões por tema): ele vira <b>-ing</b>.', 'Escolha a preposição: while (junto), after / before (ordem), by (meio), without (falta), upon (assim que).', 'Sem conjunção, o -ing abre a frase e vira vírgula: <i>Working hard, she improves.</i>'],
    r:['O sujeito tem de ser <b>o mesmo</b> da principal.', 'Depois de preposição: sempre -ing, nunca infinitivo.', 'Para negar: <i>not</i> antes do -ing (menos em <i>without</i>).', 'Em português a preposição pede infinitivo; o gerúndio fica para modo e simultaneidade.'] },
  rpart:{ n:'Subordinada adverbial reduzida de particípio — condição, tempo, concessão ou causa, com sentido passivo/de estado.', f:'once / when / if / although + particípio  ·  particípio sozinho',
    p:['Escolha a principal (quem é solicitado, convidado, está cansado…).', 'Escolha a conjunção e o particípio.', 'A reduzida <b>abre a frase</b>, com vírgula.', 'Teste: devolva o <i>sujeito + be</i> (“if <b>it is</b> needed”): se a frase continuar certa, a redução é válida.'],
    r:['Sentido passivo ou de estado (asked, tired, needed).', 'O sujeito é o mesmo da principal.', 'Em português o particípio concorda em gênero e número (exceto “se necessário”).'] },
  rinf:{ n:'Subordinada substantiva objetiva direta reduzida de infinitivo — o verbo principal pede outro verbo como objeto.', f:'verbo (want, decide…) + to + verbo base  ·  verbo (enjoy, avoid…) + verbo-ing',
    p:['Escolha o verbo principal na lista (dial ③): ele define a forma.', 'Escolha o verbo do objeto (sugestões por tema).', '<b>to</b> ou <b>-ing</b>: o motor só libera as que o verbo aceita.', 'Para negar: <i>not</i> antes do to / do -ing.'],
    r:['Mesmo sujeito: com sujeitos diferentes o inglês volta à forma desenvolvida (<i>want him to…</i>, <i>say that he…</i>).', 'Não combina com colocação do dial ⑨: o objeto <b>é</b> a reduzida.', 'Em português as duas formas viram infinitivo.'] },
  rrel:{ n:'Subordinada adjetiva reduzida — relativa sem pronome e sem auxiliar.', f:'substantivo + verbo-ing / particípio / to + verbo',
    p:['Escolha, no dial ⑨, uma colocação com objeto (a laptop) ou pessoa (with clients).', 'Escolha a forma: <b>-ing</b> (faz), <b>-ed</b> (sofre), <b>to</b> (serve para).', 'O motor sugere complementos que combinam com o <b>tipo do substantivo</b> (pessoa, coisa, lugar, tempo).', 'Teste: devolva o <i>that is / who is</i> — a frase deve continuar certa.'],
    r:['Sem palavras-sinal de fim na principal.', 'Particípio = passivo; -ing = ativo e em andamento.', 'Em português o particípio adjetivo é natural; o gerúndio adjetivo é raro (“que trabalha aqui”).'] },
  relx:{ n:'Subordinada adjetiva explicativa — informação extra.', f:'substantivo , which / who / where / when / whose + oração',
    p:['Escolha uma colocação com objeto ou pessoa.', 'Pronome: <b>which</b> (coisas), <b>who</b> (pessoas), <b>where</b> (lugares), <b>when</b> (tempo) ou <b>whose</b> (posse).', 'Entre vírgulas; pode ser retirada sem mudar a identificação.'],
    r:['Aqui <b>that</b> não se usa.', 'Não combina com palavras-sinal de fim.'] }
};
/* verbos → chips agrupados; cada grupo { t, n, ids:[{id,label}] } ou { t, n, txt } */
const _vOk = id => VERBS.some(v => v.id === id);
const _vc = (ids, f) => ids.filter(_vOk).map(id => ({ id, label: f ? f(id) : null }));
function o2Perfil(m){
  const g = [];
  if(m === 'obj'){
    const gr = {};
    Object.keys(O2_SUBJ).forEach(id => { const d = O2_SUBJ[id], k = d.c.join(' / '); (gr[k] = gr[k] || []).push(id); });
    const T = { 'that':'Só <b>that</b> — pensar, dizer, declarar', 'that / if / whether':'<b>that</b>, <b>if</b> ou <b>whether</b> — saber', 'if / whether':'Só <b>if / whether</b> — perguntar, verificar' };
    Object.keys(gr).forEach(k => g.push({ t:T[k] || k, ids:_vc(gr[k].sort()) }));
    g.push({ t:'Pedem subjuntivo em português', n:'“Espero que seja”, “duvido que seja”.', ids:_vc(Object.keys(O2_SUBJ).filter(id => O2_SUBJ[id].subj)) });
  } else if(m === 'ap'){
    g.push({ t:'Com <b>: that</b> (conteúdo)', ids:_vc(Object.keys(O2_CN).filter(id => o2ApCand(id).th.length), id => id + ' → ' + o2ApCand(id).th.join(' / ')) });
    g.push({ t:'Com <b>: to</b> (intenção)', ids:_vc(Object.keys(O2_AP_TO), id => id + ' → ' + O2_AP_TO[id].join(' / ')) });
  } else if(m === 'oq'){
    g.push({ t:'Verbos principais', n:'Verbos de saber, perguntar ou explicar:', ids:_vc(O2_OQ_V()) });
  } else if(m === 'oi'){
    const gr = {};
    Object.keys(O2_OBJI).forEach(id => { const k = O2_OBJI[id].c.join(' · '); (gr[k] = gr[k] || []).push(id); });
    Object.keys(gr).forEach(k => g.push({ t:'Aceitam: <b>' + k + '</b>', ids:_vc(gr[k], id => id + ' ' + O2_OBJI[id].p) }));
  } else if(m === 'cn'){
    g.push({ t:'Verbo → substantivos que aceita', ids:_vc(Object.keys(O2_CN), id => id + ' → ' + O2_CN[id].join(' / ')) });
  } else if(m === 'rel' || m === 'relx'){
    g.push({ t:'Verbo da relativa', txt:'Pessoa (<b>who</b>): ' + O2_REL_PESSOA.join(' · ') + '<br>Coisa (<b>which / that</b>): ' + O2_REL_COISA.join(' · ') + '<br>Lugar (<b>where</b>): ' + O2_REL_WHERE.join(' · ') + '<br>Tempo (<b>when</b>): ' + O2_REL_WHEN.join(' · ') + '<br>Posse (<b>whose</b>): ' + O2_WHOSE.pessoa.concat(O2_WHOSE.coisa).map(w => w.n + ' + ' + w.adj).join(' · ') });
    g.push({ t:'Verbo principal', n:'Qualquer verbo que tenha, no dial ⑨, uma colocação com objeto (sem preposição) ou de pessoa (com preposição). Toque para usar:',
      ids: VERBS.filter(v => (v.col || []).some(c => o2ObjDef(c) || o2RelPrepPessoa(c))).sort((a, b) => a.base.localeCompare(b.base)).map(v => ({ id:v.id, label:null })) });
  } else if(m === 'final'){
    g.push({ t:'Verbos com finalidade curada (✓)', n:'Os demais verbos recebem sugestões por tema (≈).', ids:_vc(Object.keys(O2_FIN)) });
  } else if(m === 'adv' || m === 'adit' || m === 'alt'){
    const ok = x => { const e = VERB_EXTRA[x.id]; if(!e) return false; const has = ws => ws.some(w => { const y = verbPorNome(w); return y && y.id !== x.id; });
      return m === 'adv' ? has(e.ant) : m === 'adit' ? has(e.syn) : (has(e.ant) || has(e.syn)); };
    g.push({ t: m === 'adv' ? 'Verbos com antônimo cadastrado' : m === 'adit' ? 'Verbos com sinônimo cadastrado' : 'Verbos com antônimo ou sinônimo', ids: VERBS.filter(ok).sort((a, b) => a.base.localeCompare(b.base)).map(v => ({ id:v.id, label:null })) });
  } else if(m === 'caus' || m === 'expl' || m === 'cons' || m === 'cond' || m === 'temp' || m === 'csq' || m === 'prop'){
    const tab = (m === 'temp') ? O2_TEMA.T : (m === 'caus' || m === 'expl' || m === 'cond') ? O2_TEMA.C : (m === 'prop') ? null : O2_TEMA.S;
    if(m === 'prop') g.push({ t:'Verbos do 2º termo', ids:_vc([...new Set(Object.values(O2_PROP).flat().map(o => o.v))].sort()) });
    else { const ids = new Set(); Object.values(tab).forEach(l => l.forEach(o => ids.add(o.v))); g.push({ t: m === 'temp' ? 'Verbos de evento sugeridos' : 'Verbos de resultado/motivo sugeridos', n:'Sugestões por tema; “outro verbo” aceita qualquer um.', ids:_vc([...ids].sort()) }); }
  } else if(m === 'cmp'){
    g.push({ t:'Advérbios por tema do verbo', txt: Object.keys(O2_CMP).map(k => { const mt = verbTemaMeta(k); return (mt ? mt.icon + ' ' + mt.nome : k) + ': <b>' + O2_CMP[k].map(a => a.en).join(' · ') + '</b>'; }).join('<br>') });
  } else if(m === 'conf'){
    g.push({ t:'Fontes de conformidade', txt:'Sempre: <b>the plan</b> (we planned) · <b>the agreement</b> (we agreed)<br>Por tema: ' + Object.keys(O2_CONF_3).filter(k => k !== 'def').map(k => { const mt = verbTemaMeta(k); return (mt ? mt.icon : '') + ' ' + O2_CONF_3[k].en; }).join(' · ') + '<br>Demais temas: <b>the instructions</b>' });
  } else if(m === 'subj'){
    g.push({ t:'Adjetivos', txt:'<b>It is … that</b>: true · clear · obvious<br><b>It is … to</b>: important · difficult · easy' });
  } else if(m === 'pred'){
    g.push({ t:'Substantivos', txt:'truth · problem · point' });
  } else if(m === 'rinf'){
    const gr = { to:[], ing:[], ambos:[] };
    Object.keys(O2_RI).forEach(id => { const c = O2_RI[id].c; (c.length === 2 ? gr.ambos : c[0] === 'to' ? gr.to : gr.ing).push(id); });
    g.push({ t:'Pedem <b>to + verbo</b>', ids:_vc(gr.to.sort()) }); g.push({ t:'Pedem <b>verbo-ing</b>', ids:_vc(gr.ing.sort()) }); g.push({ t:'Aceitam <b>as duas</b>', ids:_vc(gr.ambos.sort()) });
  } else if(m === 'rger' || m === 'rpart'){
    g.push({ t:'Verbo da reduzida', txt: m === 'rger' ? 'Sugestões por tema do verbo principal (as mesmas da finalidade): <i>save money, understand the problem, make better decisions…</i> O verbo vira <b>-ing</b>.' : 'Particípios curados por conjunção: <b>once</b> prepared · trained · approved · <b>when</b> asked · invited · called · <b>if</b> needed · asked · paid · <b>although</b> tired · warned · worried.' });
  } else if(m === 'rrel'){
    g.push({ t:'Verbo principal', n:'Qualquer verbo que tenha, no dial ⑨, uma colocação com objeto (sem preposição) ou de pessoa (com preposição). Toque para usar:',
      ids: VERBS.filter(v => (v.col || []).some(c => o2ObjDef(c) || o2RelPrepPessoa(c))).sort((a, b) => a.base.localeCompare(b.base)).map(v => ({ id:v.id, label:null })) });
  } else if(m === 'conc'){
    g.push({ t:'Complemento', txt:'Adjetivos (although) e substantivos (despite) vêm do <b>tema</b> do verbo; qualquer verbo de ação serve como principal.' });
  }
  return g;
}
function o2PerfilHTML(m){
  const g = o2Perfil(m);
  return g.map((x, gi) => `<div class="orac-vg"><div class="orac-vg-t">${x.t}</div>${x.n ? `<div class="orac-vg-n">${x.n}</div>` : ''}` +
    (x.txt ? `<div class="orac-vtxt">${x.txt}</div>` : `<div class="orac-vrow">${o2VchipsHTML(m, x.ids.slice(0, O2_VCAP))}${x.ids.length > O2_VCAP ? `<button type="button" class="signal-chip o2-vmais" data-m="${m}" data-g="${gi}">+ ${x.ids.length - O2_VCAP} verbos…</button>` : ''}</div>`) + '</div>').join('');
}
const O2_VCAP = 60;   /* listas enormes mostram os primeiros e um botão "mais" */
const o2VchipsHTML = (m, ids) => ids.map(it => `<button type="button" class="signal-chip o2-vchip" data-m="${m}" data-v="${it.id}" title="Usar no motor">${escapeHTML(it.label || nomeV(verbById(it.id)))}</button>`).join('');
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.o2-vmais'); if(!b) return;
  const row = b.parentElement, g = o2Perfil(b.dataset.m)[+b.dataset.g];
  row.innerHTML = o2VchipsHTML(b.dataset.m, g.ids);
});
function o2PerfilN(m){ return o2Perfil(m).reduce((n, x) => n + (x.ids ? x.ids.length : 0), 0); }
/* chip de verbo: leva o aluno ao motor com este verbo e o tipo ativo */
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.o2-vchip'); if(!b) return;
  state.verbo = b.dataset.v; state.colocacao = null; o2UsarNoMotor(b.dataset.m);
});

/* ================= v111: TREINO DE CONJUNÇÕES — significado + categoria =================
   Cada questão sorteia uma conjunção da seção (com a frase de exemplo dela) e pede duas respostas:
   1) o SIGNIFICADO (equivalente em português) e 2) a CATEGORIA da oração que ela introduz.
   Palavras que existem em mais de uma categoria (while, since, as, in case…) aceitam todas as categorias dela,
   e o comentário mostra as demais. Fonte única: ORAC_CONJ (exemplos/notas) + CONJ_GLOSS_TXT (significados). */
const CONJ_GLOSS_TXT = `0.0|and|e
0.0|as well as|assim como · e também
0.0|not only… but also|não só… mas também
0.0|both… and|tanto… quanto
0.0|besides|além disso
0.0|moreover|além do mais
0.0|as well|também (no fim da frase)
0.0|in addition|além disso
0.0|furthermore|ademais · além do mais
0.0|plus|além disso (informal)
0.0|and then|e depois
0.0|what is more|e o que é mais
0.0|along with|junto com
0.1|but|mas
0.1|yet|porém · contudo
0.1|however|no entanto
0.1|still|mesmo assim
0.1|whereas|ao passo que
0.1|while|enquanto (contraste)
0.1|nevertheless|contudo · apesar disso
0.1|on the other hand|por outro lado
0.1|in contrast|em contraste
0.1|even so|mesmo assim
0.1|all the same|mesmo assim
0.1|on the contrary|pelo contrário
0.1|instead|em vez disso
0.1|though|porém (no fim da frase)
0.2|or|ou
0.2|either… or|ou… ou
0.2|neither… nor|nem… nem
0.2|otherwise|senão · caso contrário
0.2|or else|ou então
0.2|alternatively|alternativamente
0.2|or rather|ou melhor
0.2|whether… or|quer… quer
0.3|so|então
0.3|therefore|portanto
0.3|thus|assim · portanto
0.3|hence|daí · por isso
0.3|consequently|consequentemente
0.3|as a result|como resultado
0.3|accordingly|por conseguinte
0.3|for this reason|por essa razão
0.3|which is why|e é por isso que
0.3|that's why|é por isso que
0.3|then|então
0.4|for|pois
0.4|because|porque
0.4|since|já que
0.4|as|pois · como
0.4|seeing that|visto que
0.4|given that|dado que
3.0|in order to|a fim de · para
3.0|so as to|de modo a
3.0|to|para
3.0|in case|para o caso de (precaução)
3.0|so that|para que
3.0|lest|para que não · por receio de que
3.0|in order that|a fim de que
3.0|with the aim of|com o objetivo de
3.0|for fear that|com receio de que
3.1|because|porque
3.1|since|já que
3.1|as|como · já que
3.1|because of|por causa de
3.1|due to|devido a
3.1|thanks to|graças a
3.1|now that|agora que
3.1|given that|dado que
3.1|seeing that|visto que
3.1|inasmuch as|na medida em que
3.1|owing to|devido a
3.1|on account of|por causa de
3.2|so… that|tão… que
3.2|such… that|tal… que
3.2|so much / many… that|tanto… que
3.2|so… as to|a ponto de
3.2|to such an extent that|a tal ponto que
3.2|with the result that|de modo que
3.3|if|se
3.3|unless|a menos que
3.3|as long as|desde que
3.3|provided that|contanto que
3.3|in case|caso
3.3|even if|mesmo que (hipótese)
3.3|supposing|supondo que
3.3|on condition that|com a condição de que
3.3|so long as|desde que
3.3|assuming (that)|supondo que
3.3|only if|somente se
3.3|in the event that|na eventualidade de
3.3|if not|se não
3.4|although|embora
3.4|though|embora
3.4|even though|mesmo que (fato real)
3.4|despite / in spite of|apesar de
3.4|while|embora · ao passo que
3.4|however + adj|por mais… que
3.4|even if|mesmo que (hipótese)
3.4|no matter how|por mais que
3.4|whereas|ao passo que
3.4|albeit|ainda que
3.4|much as|por mais que
3.4|regardless of|independentemente de
3.4|whatever|qualquer que seja
3.4|notwithstanding|não obstante
3.5|when|quando
3.5|while|enquanto
3.5|before|antes que
3.5|after|depois que
3.5|until|até que
3.5|as soon as|assim que
3.5|by the time|quando (até a hora que)
3.5|since|desde que
3.5|once|uma vez que · assim que
3.5|whenever|sempre que
3.5|as|enquanto · quando
3.5|the moment|no momento em que
3.5|every time|toda vez que
3.5|each time|cada vez que
3.5|the first time|a primeira vez que
3.5|till|até
3.5|whilst|enquanto
3.6|as… as|tão… quanto
3.6|than|do que
3.6|the same as|o mesmo que
3.6|the same way as|do mesmo jeito que
3.6|like|como · igual a
3.6|as if|como se
3.6|as though|como se
3.6|as much as|tanto quanto
3.6|not so… as|não tão… quanto
3.6|different from|diferente de
3.6|similar to|parecido com
3.6|rather than|em vez de
3.6|than if|do que se
3.7|as|conforme · como
3.7|just as|assim como · exatamente como
3.7|according to|de acordo com
3.7|as per|conforme (formal)
3.7|in accordance with|de acordo com
3.7|the way|do jeito que
3.7|just like|exatamente como
3.7|in line with|em linha com · de acordo com
3.7|exactly as|exatamente como
3.8|the more… the more|quanto mais… mais
3.8|the less… the more|quanto menos… mais
3.8|the sooner… the better|quanto antes… melhor
3.8|the longer… the more|quanto mais tempo… mais
3.8|more and more|cada vez mais
3.8|as (progressivo)|à medida que
3.8|the + comparative…|quanto + comparativo
3.8|as… so|à medida que… assim
1.0|It + be + adj + that|É + adjetivo + que (it vazio)
1.0|It + be + adj + to|É + adjetivo + infinitivo
1.0|What…|o que (como sujeito)
1.0|That…|que (formal, abre a frase)
1.0|Whether…|se (abre a frase)
1.0|whoever…|quem quer que
1.0|how…|como (como sujeito)
1.1|that|que
1.1|if / whether|se
1.1|wh-words|palavras interrogativas (onde, quando, por que…)
1.1|to + V|infinitivo (querer viajar)
1.1|-ing|gerúndio / infinitivo (gostar de cozinhar)
1.1|that + base form|que + subjuntivo (sugerir que ele vá)
1.1|whatever|o que quer que
1.1|how|como
1.2|verb + prep + -ing|verbo + preposição + -ing (insistir em pagar)
1.2|verb + prep + wh-|verbo + preposição + palavra interrogativa
1.2|verb + prep + whether|verbo + preposição + se (depende de… ou não)
1.2|prep + the fact that|preposição + o fato de que
1.3|noun + that|substantivo + de que
1.3|noun + to|substantivo + de + infinitivo
1.3|the fact that|o fato de que
1.3|the idea that|a ideia de que
1.3|the belief that|a crença de que
1.3|the hope that|a esperança de que
1.3|the possibility that|a possibilidade de que
1.3|the news that|a notícia de que
1.4|be + that|é que
1.4|be + to|é + infinitivo
1.4|be + wh-|é + palavra interrogativa
1.4|the reason is that|a razão é que
1.4|the problem is that|o problema é que
1.4|the point is that|a questão é que
1.4|the truth is that|a verdade é que
1.4|the idea is to|a ideia é + infinitivo
1.5|noun + : that|substantivo + dois-pontos + que
1.5|noun + : to|substantivo + dois-pontos + infinitivo
1.5|one goal: to|um objetivo: + infinitivo
1.5|one reason: that|um motivo: + que + oração
2.0|who|que · quem (pessoa)
2.0|which|que · o qual (coisa)
2.0|that|que (pessoa ou coisa)
2.0|whose|cujo(a)
2.0|where|onde
2.0|when|quando · em que
2.0|whom|a quem · que (objeto, formal)
2.0|why|pelo qual (motivo)
2.0|prep + which|preposição + o qual
2.0|that (omitido)|pronome omitido (objeto)
2.0|whereby|pelo qual
2.1|who (com vírgulas)|que · quem (informação extra)
2.1|which|que · o qual (informação extra)
2.1|whose|cujo(a)
2.1|where|onde
2.1|when|quando · em que
2.1|whom|a quem
2.1|of which|cujo (coisa)
2.1|which (oração inteira)|o que (retoma a oração toda)`;
const CONJ_CATS = {
  adit:{ n:'Aditiva', d:'soma ideias' }, adv:{ n:'Adversativa', d:'contraste' }, alt:{ n:'Alternativa', d:'escolha entre opções' },
  concl:{ n:'Conclusiva', d:'resultado / conclusão' }, expl:{ n:'Explicativa', d:'justifica o que foi dito (pois)' },
  final:{ n:'Final', d:'finalidade (para quê?)' }, caus:{ n:'Causal', d:'causa (por quê?)' }, cons:{ n:'Consecutiva', d:'consequência de intensidade' },
  cond:{ n:'Condicional', d:'condição (se…)' }, conc:{ n:'Concessiva', d:'concessão (apesar de…)' }, temp:{ n:'Temporal', d:'tempo (quando?)' },
  comp:{ n:'Comparativa', d:'comparação' }, conf:{ n:'Conformativa', d:'conformidade (conforme…)' }, prop:{ n:'Proporcional', d:'proporção (quanto mais… mais)' },
  subj:{ n:'Subjetiva', d:'faz o papel de sujeito' }, objd:{ n:'Objetiva direta', d:'faz de objeto direto' }, obji:{ n:'Objetiva indireta', d:'objeto com preposição' },
  cn:{ n:'Completiva nominal', d:'completa um substantivo abstrato' }, pred:{ n:'Predicativa', d:'depois de “be”, diz o que o sujeito é' }, ap:{ n:'Apositiva', d:'explica um substantivo (dois-pontos)' },
  rest:{ n:'Adjetiva restritiva', d:'diz QUAL substantivo (sem vírgula)' }, relx:{ n:'Adjetiva explicativa', d:'informação extra (entre vírgulas)' }
};
const CONJ_GRUPO_CAT = { '0.0':'adit', '0.1':'adv', '0.2':'alt', '0.3':'concl', '0.4':'expl', '3.0':'final', '3.1':'caus', '3.2':'cons', '3.3':'cond', '3.4':'conc', '3.5':'temp', '3.6':'comp', '3.7':'conf', '3.8':'prop', '1.0':'subj', '1.1':'objd', '1.2':'obji', '1.3':'cn', '1.4':'pred', '1.5':'ap', '2.0':'rest', '2.1':'relx' };
const CONJ_BANCO = [];
(function(){
  CONJ_GLOSS_TXT.split('\n').forEach(l => {
    const p = l.split('|'); if(p.length !== 3) return;
    const e = (ORAC_CONJ[p[0]] || []).find(x => x.c === p[1]);
    if(e && CONJ_GRUPO_CAT[p[0]]) CONJ_BANCO.push({ g:p[0], c:p[1], sig:p[2], cat:CONJ_GRUPO_CAT[p[0]], en:e.en, pt:e.pt, nota:e.nota });
  });
})();
const ct = { filtro:'todas', fila:[], q:null, passo:1, sig:null, cat:null, pts:0, tot:0, seq:0, melhor:0, erradas:[] };
const ctEmbaralha = a => { const r = a.slice(); for(let i = r.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const CT_FILTROS = { coord:'0', subst:'1', adj:'2', sub:'3' };       /* grupo (índice de ORACOES) de cada filtro */
const ctPool = () => CONJ_BANCO.filter(x => ct.filtro === 'todas' || x.g[0] === CT_FILTROS[ct.filtro]);
/* v112: histórico guardado no aparelho — por conjunção [tentativas, acertos de significado, acertos de categoria] e por categoria [tentativas, acertos] */
const CT_KEY = 'pm_ct_hist_v1';
let ctHist = { i:{}, c:{} };
try { if(CAN_STORE){ const h = JSON.parse(localStorage.getItem(CT_KEY) || 'null'); if(h && h.i && h.c) ctHist = h; } } catch(e){}
const ctSalva = () => { try { if(CAN_STORE) localStorage.setItem(CT_KEY, JSON.stringify(ctHist)); } catch(e){} };
const ctChave = q => q.g + '|' + q.c;
const ctPrecisao = q => { const h = ctHist.i[ctChave(q)]; return h && h[0] ? (h[1] + h[2]) / (2 * h[0]) : null; };
const ctFraca = q => { const a = ctPrecisao(q); return a !== null && a < 0.75; };
/* todas as categorias / significados válidos da MESMA palavra (while, since, as…) */
const ctIrmas = q => CONJ_BANCO.filter(x => x.c === q.c);
function ctProxima(){
  /* as conjunções que você mais erra abrem a fila (repetição espaçada simples) */
  if(!ct.fila.length){ const pool = ctPool(); ct.fila = [...new Set(ctEmbaralha(pool.filter(ctFraca)).slice(0, 8).concat(ctEmbaralha(pool)))]; }
  /* uma conjunção errada volta depois de ~4 questões */
  if(ct.erradas.length && ct.tot % 4 === 3){ ct.q = ct.erradas.shift(); }
  else ct.q = ct.fila.shift();
  const q = ct.q, irm = ctIrmas(q);
  const catsOk = new Set(irm.map(x => x.cat)), sigOk = new Set(irm.map(x => x.sig));
  /* significado: 1 certo + 3 de outras palavras (um deles da mesma categoria, mais difícil) */
  const mesma = ctEmbaralha(CONJ_BANCO.filter(x => x.cat === q.cat && !sigOk.has(x.sig))).slice(0, 1);
  const outras = ctEmbaralha(CONJ_BANCO.filter(x => !catsOk.has(x.cat) && !sigOk.has(x.sig)));
  const ds = []; mesma.concat(outras).forEach(x => { if(ds.length < 3 && !ds.some(y => y.sig === x.sig)) ds.push(x); });
  q.opSig = ctEmbaralha([{ t:q.sig, ok:true }].concat(ds.map(x => ({ t:x.sig, ok:false }))));
  /* categoria: a certa + 3 que a palavra NÃO pode ser */
  const cs = ctEmbaralha(Object.keys(CONJ_CATS).filter(k => !catsOk.has(k))).slice(0, 3);
  q.opCat = ctEmbaralha([{ k:q.cat, ok:true }].concat(cs.map(k => ({ k, ok:false }))));
  q.catsOk = catsOk;
  ct.passo = 1; ct.sig = null; ct.cat = null;
}
function ctResponde(passo, i){
  const q = ct.q;
  if(passo === 1){ if(ct.sig !== null) return; ct.sig = i; }
  else { if(ct.sig === null || ct.cat !== null) return; ct.cat = i; ct.tot++;
    const acertos = (q.opSig[ct.sig].ok ? 1 : 0) + (q.opCat[ct.cat].ok ? 1 : 0);
    ct.pts += acertos;
    const k = ctChave(q), h = ctHist.i[k] || (ctHist.i[k] = [0, 0, 0]), hc = ctHist.c[q.cat] || (ctHist.c[q.cat] = [0, 0]);
    h[0]++; if(q.opSig[ct.sig].ok) h[1]++; if(q.opCat[ct.cat].ok) h[2]++;
    hc[0]++; if(q.opCat[ct.cat].ok) hc[1]++;
    ctSalva();
    if(acertos === 2){ ct.seq++; ct.melhor = Math.max(ct.melhor, ct.seq); } else { ct.seq = 0; if(!ct.erradas.includes(q)) ct.erradas.push(q); }
  }
  buildConjTreino();
}
function ctHistHTML(){
  const cats = Object.keys(ctHist.c).filter(k => CONJ_CATS[k] && ctHist.c[k][0]);
  if(!cats.length) return '<div class="ct-nota" style="margin-top:10px">📊 Seu histórico aparece aqui depois da primeira resposta (fica salvo neste aparelho).</div>';
  const barras = cats.sort((a, b) => ctHist.c[a][1] / ctHist.c[a][0] - ctHist.c[b][1] / ctHist.c[b][0]).map(k => {
    const [t, ok] = ctHist.c[k], pc = Math.round(100 * ok / t);
    return `<div class="ct-bar"><span>${CONJ_CATS[k].n}</span><i style="--w:${pc}%"></i><em>${pc}% · ${t}</em></div>`; }).join('');
  const fracas = CONJ_BANCO.filter(ctFraca).sort((a, b) => ctPrecisao(a) - ctPrecisao(b)).slice(0, 6).map(q => `<b>${escapeHTML(q.c)}</b>`).join(' · ');
  return `<details class="ct-hist"><summary>📊 Meu histórico</summary><div class="ct-bars">${barras}</div>
    ${fracas ? `<div class="ct-nota">🎯 Para reforçar (voltam primeiro na fila): ${fracas}</div>` : '<div class="ct-nota">Nenhuma conjunção fraca por enquanto.</div>'}
    <button type="button" class="signal-chip ct-zera">zerar histórico</button></details>`;
}
function buildConjTreino(){
  const box = document.getElementById('conjTreino'); if(!box) return;
  if(!CONJ_BANCO.length){ box.innerHTML = ''; return; }
  if(!ct.q) ctProxima();
  const q = ct.q, fin = ct.cat !== null;
  const mh = /^[A-Za-z' ]+$/.test(q.c) ? q.en.match(new RegExp("\\b" + q.c.replace(/ /g, '\\s+') + "\\b", 'i')) : null;
  const hl = mh ? escapeHTML(q.en.slice(0, mh.index)) + '<mark>' + escapeHTML(mh[0]) + '</mark>' + escapeHTML(q.en.slice(mh.index + mh[0].length)) : escapeHTML(q.en);
  const filtros = [['todas', 'Todas'], ['coord', 'Coordenadas'], ['subst', 'Substantivas'], ['adj', 'Adjetivas'], ['sub', 'Adverbiais']].map(([k, n]) => `<button type="button" class="signal-chip ct-f" data-f="${k}" data-active="${ct.filtro === k}">${n}</button>`).join('');
  const optSig = q.opSig.map((o, i) => `<button type="button" class="ct-op" data-p="1" data-i="${i}"${ct.sig !== null ? ' disabled' : ''} data-st="${ct.sig === null ? '' : (o.ok ? 'ok' : (ct.sig === i ? 'no' : ''))}">${escapeHTML(o.t)}</button>`).join('');
  const optCat = ct.sig === null ? '' : q.opCat.map((o, i) => `<button type="button" class="ct-op" data-p="2" data-i="${i}"${ct.cat !== null ? ' disabled' : ''} data-st="${ct.cat === null ? '' : (o.ok ? 'ok' : (ct.cat === i ? 'no' : ''))}"><b>${CONJ_CATS[o.k].n}</b><small>${CONJ_CATS[o.k].d}</small></button>`).join('');
  const outras = [...q.catsOk].filter(k => k !== q.cat).map(k => CONJ_CATS[k].n);
  const outrosSig = ctIrmas(q).filter(x => x.sig !== q.sig).map(x => x.sig);
  let fb = '';
  if(fin){
    const a1 = q.opSig[ct.sig].ok, a2 = q.opCat[ct.cat].ok;
    fb = `<div class="ct-fb" data-ok="${a1 && a2}"><b>${a1 && a2 ? '✔ Certo nos dois!' : a1 ? '◐ Significado certo, categoria errada.' : a2 ? '◐ Categoria certa, significado errado.' : '✘ Vamos rever.'}</b>
      <div><b>${escapeHTML(q.c)}</b> = ${escapeHTML(q.sig)} · <b>${CONJ_CATS[q.cat].n}</b> (${CONJ_CATS[q.cat].d})</div>
      <div class="ct-pt">${escapeHTML(q.pt)}</div>
      ${q.nota ? `<div class="ct-nota">💡 ${escapeHTML(q.nota)}</div>` : ''}
      ${outras.length ? `<div class="ct-nota">↔️ Esta palavra também aparece como: <b>${outras.join(', ')}</b>${outrosSig.length ? ' (' + outrosSig.map(escapeHTML).join('; ') + ')' : ''}. O contexto decide.</div>` : ''}
      <button type="button" class="signal-chip ct-next">Próxima →</button></div>`;
  }
  box.innerHTML = `<div class="ct-card">
    <div class="ct-head"><span class="orac-conjs-tit" style="margin:0">🎯 Treino de conjunções</span>
      <span class="ct-placar">${ct.pts}/${ct.tot * 2} pts · 🔥 ${ct.seq}${ct.melhor ? ' (melhor ' + ct.melhor + ')' : ''}</span></div>
    <div class="ct-filtros">${filtros}</div>
    <div class="ct-conj">${escapeHTML(q.c)}</div>
    <div class="ct-ex">${hl} ${btnAud(q.en)}</div>
    <div class="ct-q">1) O que significa?</div><div class="ct-ops">${optSig}</div>
    ${ct.sig !== null ? '<div class="ct-q">2) De que categoria é a oração que ela introduz?</div><div class="ct-ops ct-cats">' + optCat + '</div>' : ''}
    ${fb}
    ${ctHistHTML()}
  </div>`;
  box.querySelectorAll('.ct-op').forEach(b => { b.onclick = () => ctResponde(+b.dataset.p, +b.dataset.i); });
  box.querySelectorAll('.ct-f').forEach(b => { b.onclick = () => { ct.filtro = b.dataset.f; ct.fila = []; ct.erradas = []; ct.q = null; buildConjTreino(); }; });
  const zr = box.querySelector('.ct-zera'); if(zr) zr.onclick = () => { ctHist = { i:{}, c:{} }; ctSalva(); buildConjTreino(); };
  const nx = box.querySelector('.ct-next'); if(nx) nx.onclick = () => { ctProxima(); buildConjTreino(); };
  if(typeof applyA11y === 'function') applyA11y();
}
function buildOracoes(){
  const wrap = document.getElementById('oracoesWrap');
  if(!wrap) return;
  wrap.innerHTML = '<div id="conjTreino"></div>';
  buildConjTreino();                                     /* v111 */
  ORACOES.forEach((gr, gi) => {
    const sec = document.createElement('div'); sec.className = 'orac-grupo';
    sec.innerHTML = `<div class="orac-grupo-tit">${gr.ic} ${gr.g}</div>`;
    gr.itens.forEach((it, ii) => {
      const card = document.createElement('div'); card.className = 'o2-card orac-card'; card.dataset.open = 'false';
      const hd = document.createElement('button'); hd.type = 'button'; hd.className = 'o2-card-head'; hd.setAttribute('aria-expanded', 'false');
      hd.innerHTML = `<span class="o2-nome">${it.nome}<small>${escapeHTML(it.conj)}</small></span>` +
        (it.motor ? '<span class="orac-tag on">no motor</span>' : `<span class="orac-tag">${it.fase || 'em breve'}</span>`) + '<span class="o2-seta">▸</span>';
      const bd = document.createElement('div'); bd.className = 'o2-card-body'; bd.hidden = true;
      bd.innerHTML = `<p class="orac-regra">${escapeHTML(it.regra)}</p>` +
        it.ex.map(e => `<div class="orac-ex"><div class="orac-en">${escapeHTML(e[0])}${btnAud(e[0])}</div><div class="orac-pt">${escapeHTML(e[1])}</div></div>`).join('') +
        (it.erro && it.erro[0] !== '—' ? `<div class="orac-erro"><b>⚠️ Armadilha:</b> <span class="orac-no">${escapeHTML(it.erro[0])}</span> — ${escapeHTML(it.erro[1])}</div>` : (it.erro ? `<div class="orac-erro"><b>💡</b> ${escapeHTML(it.erro[1])}</div>` : ''));
      /* v106: natureza · fórmula · passo a passo · restrições · verbos */
      if(it.motor && O2_FORM[it.motor]){
        const F = O2_FORM[it.motor];
        bd.insertAdjacentHTML('beforeend', `<div class="orac-form"><div class="orac-conjs-tit">🧱 Formação</div><div class="orac-nat">${F.n}</div><div class="orac-formula">${F.f}</div><ol>${F.p.map(x => `<li>${x}</li>`).join('')}</ol></div>` +
          `<div class="orac-restr"><div class="orac-conjs-tit">🚦 Restrições</div><ul>${F.r.map(x => `<li>${x}</li>`).join('')}</ul></div>`);
        const det = document.createElement('details'); det.className = 'orac-verbos';
        const nv = o2PerfilN(it.motor);
        det.innerHTML = `<summary>✅ ${nv ? 'Verbos que se aplicam (' + nv + ')' : 'Quais palavras se aplicam'}</summary><div class="orac-vbody"></div>`;
        let feito = false;
        det.addEventListener('toggle', () => { if(det.open && !feito){ feito = true; det.querySelector('.orac-vbody').innerHTML = o2PerfilHTML(it.motor); if(typeof applyA11y === 'function') applyA11y(); } });
        bd.appendChild(det);
      }
      /* v95: cada conjunção com exemplo e nota de uso */
      const lc = ORAC_CONJ[gi + '.' + ii];
      if(lc && lc.length){
        bd.insertAdjacentHTML('beforeend', '<div class="orac-conjs"><div class="orac-conjs-tit">📖 Conjunções e exemplos</div>' + lc.map(x =>
          `<div class="orac-conj"><div class="orac-conj-c">${escapeHTML(x.c)}</div><div class="orac-en">${escapeHTML(x.en)}${btnAud(x.en)}</div><div class="orac-pt">${escapeHTML(x.pt)}</div>${x.nota ? `<div class="orac-conj-nota">💡 ${escapeHTML(x.nota)}</div>` : ''}</div>`).join('') + '</div>');
      }
      if(it.motor){
        const u = document.createElement('button'); u.type = 'button'; u.className = 'signal-chip o2-usar'; u.textContent = '⚙️ Usar no motor';
        u.onclick = () => o2UsarNoMotor(it.motor);
        bd.appendChild(u);
      }
      hd.onclick = () => {
        const abre = card.dataset.open !== 'true';
        card.dataset.open = String(abre); hd.setAttribute('aria-expanded', String(abre)); bd.hidden = !abre;
        hd.querySelector('.o2-seta').textContent = abre ? '▾' : '▸';
      };
      card.appendChild(hd); card.appendChild(bd); sec.appendChild(card);
    });
    wrap.appendChild(sec);
  });
}
const btnAud = t => `<button type="button" class="audio-btn sm" data-text="${escapeHTML(t)}" title="Ouvir" aria-label="Ouvir">🔊</button>`;
/* leva o aluno da explicação para o motor, já com o tipo escolhido */
function o2UsarNoMotor(k){
  state.categoria = 'fact';
  if(!CATEGORIES.fact.aspects.includes(state.aspecto)) state.aspecto = CATEGORIES.fact.aspects[0];
  if(state.formato === 'pergunta' && state.whWord) state.whWord = null;
  if((state.formato === 'pergunta' || state.formato === 'pergunta_negativa') && k !== 'final') state.formato = 'afirmativa';
  if(O2_ABERTURA.includes(k)){ AB_UI.a = true; AB_UI.c = k; } else { o2Aberto = true; o2Card = k; o2Fam = null; }   /* v156 */
  o2Ativar(k);
  if(k === 'rinf' || k === 'rrel') o2AjustaReduzida(k);   /* v136 */
  if(O2_TIPOS.find(t => t.k === k).forma === 'R') o2AjustaReduzida('rrel');   /* v136: relativas também precisam de um substantivo */
  if(k === 'cond'){ const st = o2CondEstado(); if(!st.ok) o2CondMotor(st.cnd); }   /* v92: "Usar no motor" leva a principal ao tempo que a condicional pede */
  render();
  const alvo = document.getElementById('console-tempos') || document.getElementById('o2DialGroup');
  const g = document.getElementById(O2_ABERTURA.includes(k) ? 'abDialGroup' : 'o2DialGroup'); if(g) g.scrollIntoView({ behavior:'smooth', block:'center' });
}


/* ================= v100: clique numa palavra colorida → o que ela é ================= */
const SEG_INFO = {
  formato:{ k:'Marca de tempo / forma', t:'Auxiliar, terminação ou negação. É o que muda com o tempo e o formato (afirmativa, negativa, pergunta). A cor depende do formato escolhido.' },
  quando:{ k:'Palavra-sinal: quando', t:'Adjunto de tempo/frequência/duração. Ocupa o fim da frase (ou o início, no caso de sequência).' },
  como:{ k:'Palavra-sinal: como / quanto', t:'Adjunto de modo, grau ou intensidade — fica perto do verbo.' },
  onde:{ k:'Palavra-sinal: onde', t:'Adjunto de lugar — vem antes dos de tempo.' },
  regencia:{ k:'Regência / collocation', t:'A palavra ou expressão que o verbo pede junto dele (objeto, preposição…).' },
  conj:{ k:'Conjunção', t:'Liga as duas orações e dá a relação entre elas (causa, contraste, tempo, condição…). Veja a nota abaixo da frase.' }
};
function segConjPT(txt){
  const q = txt.trim().toLowerCase();
  for(const t of O2_TIPOS){ const c = t.conjs.find(x => x.en.toLowerCase() === q); if(c) return { pt:c.pt, tipo:t.nome }; }
  const extra = { so:'então', because:'porque', but:'mas', to:'para', who:'que (pessoa)', which:'que (coisa)', that:'que', if:'se', whether:'se' };
  return extra[q] ? { pt:extra[q], tipo:'' } : null;
}
function segPopHide(){ const p = document.getElementById('segPop'); if(p) p.remove(); }
function segPopShow(el){
  segPopHide();
  const info = SEG_INFO[el.dataset.kind]; if(!info) return;
  const txt = el.textContent, p = document.createElement('div'); p.id = 'segPop'; p.setAttribute('role', 'dialog');
  const cj = el.dataset.kind === 'conj' ? segConjPT(txt) : null;
  const ouvir = /[A-Za-z]/.test(txt) ? `<button type="button" class="audio-btn sm" data-text="${escapeHTML(txt)}" title="Ouvir a expressão inteira" aria-label="Ouvir ${escapeHTML(txt)}">🔊</button>` : '';
  p.innerHTML = `<button class="x" type="button" aria-label="Fechar">✕</button><span class="k" style="color:${ADJ_COLOR[el.dataset.kind] || 'inherit'}">${escapeHTML(txt)} — ${info.k}${ouvir}</span>` +
    (cj ? `<div>= <b>${escapeHTML(cj.pt)}</b>${cj.tipo ? ' · ' + escapeHTML(cj.tipo) : ''}</div>` : '') + `<div>${info.t}</div>`;
  document.body.appendChild(p);
  const r = el.getBoundingClientRect(), pr = p.getBoundingClientRect();
  p.style.left = Math.max(8, Math.min(window.innerWidth - pr.width - 8, r.left)) + 'px';
  p.style.top = (r.bottom + pr.height + 12 < window.innerHeight ? r.bottom + 8 : Math.max(8, r.top - pr.height - 8)) + 'px';
  p.querySelector('.x').onclick = segPopHide;
}
document.addEventListener('click', e => { const sg = e.target.closest && e.target.closest('#sentence .seg, #modalSentence .seg, .mont-frase .seg, .par-card .seg, .gr-en .seg'); if(sg){ segPopShow(sg); } else if(!(e.target.closest && e.target.closest('#segPop'))) segPopHide(); });
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') segPopHide();
  else if((e.key === 'Enter' || e.key === ' ') && document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('seg')){ e.preventDefault(); segPopShow(document.activeElement); }
});
window.addEventListener('scroll', segPopHide, { passive:true });

/* v135: PERÍODO — cada frase montada é um período; o rótulo sai do tipo da 2ª oração (nenhuma → simples) */
function periodoDe(tipo){
  if(!tipo) return { ic:'📏', nome:'Período simples', det:'1 oração' };
  if(/^Coordenada/.test(tipo.fam)) return { ic:'📏', nome:'Período composto por coordenação', det:'2 orações independentes' };
  if(tipo.forma === 'V') return { ic:'📏', nome:'Período composto por subordinação', det:'2 orações (1 reduzida)' };
  return { ic:'📏', nome:'Período composto por subordinação', det:'2 orações (1 principal + 1 subordinada)' };
}
function render(){
  sujGuarda();   /* v148: sujeito estendido, adjetivo e interrogativa coerentes antes de montar */
  buildPronome(); buildSuj(); buildAdj(); buildVerbo(); buildO2(); buildAbertura(); buildFoco(); buildColocacao(); buildColPoss(); buildVerbBank(); buildWhBank(); buildCategoria(); buildTempo(); buildAspecto(); buildSignal(); buildFormato(); buildWh(); updateTempoTrack();
  dialResumos();   /* v156: resumo dos dials recolhidos */

  document.getElementById('whDialGroup').style.display = state.formato==='pergunta' ? '' : 'none';
  document.getElementById('signalDialGroup').style.display = (state.formato==='pergunta' && state.whWord && (WH_STATIC[state.whWord] || state.whMolde || (WH_X[state.whWord] || {}).tipo === 'existQ')) ? 'none' : '';   /* v149: a moldura não recebe palavras-sinal */
  document.getElementById('verboDialGroup').style.display = state.categoria==='fact' ? '' : 'none';
  { const mCol = (state.formato==='pergunta' && state.whWord && state.whMolde) ? whMoldeDe(state.whWord, state.whMolde) : null;   /* v150: moldura com verbo aceita o complemento */
    document.getElementById('colDialGroup').style.display = (state.categoria==='fact' && (!(state.formato==='pergunta' && state.whWord) || (mCol && mCol.precisaVerbo))) ? '' : 'none'; }

  const verb = state.categoria==='fact' ? verbById(state.verbo) : null;
  const col = colComPoss(colAtual(verb));   /* v148: possessivo no complemento · v152: ou complemento livre */
  let sentenceHTML, audioText, ptText, structureText, formulaExtra="";
  let o2Nota = null, periodo = periodoDe(null);
  if(state.formato==='pergunta' && state.whWord){
    const w = whGenerate(state.categoria, state.tempo, state.aspecto, state.pronome, state.whWord, verb, {mids: midList(), ends: endList(), molde: state.whMolde, col: col});
    if(!w.isStatic && !w.molde){   /* v148: sujeito estendido / predicado também nas perguntas com interrogativa */
      const semS = WH_SUBJECT.includes(state.whWord);
      w.enMarked = sujEN(w.enMarked, 'pergunta', semS); w.en = stripMarks(w.enMarked);
      w.pt = sujPT(w.pt, { tempo:state.tempo, aspecto:(WH_X[state.whWord] || {}).tipo === 'idade' ? 'simples' : state.aspecto, formato:'pergunta', pr: semS ? 'He' : state.pronome }, semS);
    }
    sentenceHTML = w.enMarked ? markedToHTML(w.enMarked, markColorVar('pergunta')) : escapeHTML(w.en); audioText = w.en; ptText = w.pt; structureText = w.structure;
    formulaExtra = ` × <span>❓ ${state.whWord}</span>`;
  } else {
    const g = generate(state.categoria, state.tempo, state.aspecto, state.formato, state.pronome, verb);
    const withSignal = applySignal(g.text, midList().length ? midList() : null, endList(), col, state.signalSplit, state.formato);
    const o2 = o2Compor();   /* v89: 2ª oração (null = desligada) */
    const baseEN = (o2 && o2.mainEN) ? o2.mainEN(withSignal) : withSignal;   /* v92: condicional 2/3 → would / would have na principal */
    const fim = g.isQuestion ? M("?") : ".";
    let finalRaw = (o2 && o2.composeEN) ? o2.composeEN(baseEN) + fim : (o2 && o2.ini) ? upperFirstMarked(o2.enCl) + ', ' + lowerFirstMarked(baseEN) + fim : baseEN + (o2 ? o2.en : '') + fim;
    finalRaw = sujEN(finalRaw, state.formato);   /* v148 */
    sentenceHTML = markedToHTML(finalRaw, markColorVar(state.formato));
    audioText = stripMarks(finalRaw);
    ptCondModo = o2 ? (o2.ptModo || null) : null;      /* v92: principal em condicional (c2/c3) só durante esta tradução */
    try { ptText = translate(state.categoria, state.tempo, state.aspecto, state.formato, state.pronome, midList().length ? midList() : null, endList(), state.verbo, col, state.signalSplit); }
    finally { ptCondModo = null; }
    if(o2){
      if(o2.composePT) ptText = o2.composePT(ptText);
      else if(o2.ini){                                       /* v94: 2ª oração abre a frase: "Embora seja caro, ela compra." */
        const m = ptText.match(/[.?!]\s*$/), fim = m ? m[0].trim() : '.', corpo = ptText.replace(/[.?!]\s*$/, '');
        ptText = o2.ptCl.charAt(0).toUpperCase() + o2.ptCl.slice(1) + ', ' + corpo.charAt(0).toLowerCase() + corpo.slice(1) + fim;
      } else ptText = o2.ptJuntar(ptText);
    }
    ptText = sujPT(ptText, { tempo:state.tempo, aspecto:state.aspecto, formato:state.formato, pr:state.pronome });   /* v148 */
    const signalNote = state.signalSplit ? state.signalSplit.w : sortSlots(midList().concat(endList())).map(s=>s.w).join(" + ");
    structureText = g.structure + (signalNote ? ` + palavra-sinal (${signalNote})` : "") + (col ? ` + regência/collocation` : "");
    if(o2){ if(o2Sl2N()) structureText += ' · 2ª oração: palavra-sinal (' + sortSlots(o2Sl2().signalMids.concat(o2Sl2().signalEnds)).map(x => x.w).join(' + ') + ')';
      structureText += ' ' + o2.estrutura + (o2.ini ? ' (ordem invertida: 2ª oração + vírgula + principal)' : ''); formulaExtra += ` × <span>${o2.tipo.ic} ${o2.tipo.nome}</span>` + (o2.trLabel ? ` <span>⇄ ${o2.trLabel}</span>` : ''); o2Nota = o2.nota; periodo = periodoDe(o2.tipo); }
  }
  { const se = document.getElementById('sentence');
    se.innerHTML = sentenceHTML;
    if(se.dataset.last !== sentenceHTML){ se.dataset.last = sentenceHTML; se.classList.remove('flash'); void se.offsetWidth; se.classList.add('flash'); }   /* v100: pulso curto quando a frase muda */
  }
  document.getElementById('translation').textContent = " " + ptText;
  document.getElementById('structure').textContent = structureText;
  const verboExtra = verb ? ` × <span>${verb.base}</span>` : "";
  document.getElementById('formula').innerHTML = `<span>${(sujAtivo() || {}).rot || state.pronome}</span> × <span>${CATEGORIES[state.categoria].label}</span>${verboExtra} × <span>${TENSE_LABEL[state.tempo]}</span> × <span>${ASPECT_LABEL[state.aspecto]}</span> × <span>${FORMATO_LABEL[state.formato]}</span>${formulaExtra} × <span class="periodo" title="${periodo.det}">${periodo.ic} ${periodo.nome}</span>`;
  document.getElementById('audioMain').dataset.text = audioText;
  document.getElementById('copyMain').dataset.text = audioText + "\n" + ptText;

  const isStaticWh = state.formato==='pergunta' && state.whWord && WH_STATIC[state.whWord];
  let note = isStaticWh ? "Exemplo fixo — How much/How many dependem do substantivo (contável/incontável), não do tempo verbal do motor." : getNote(state);
  /* v148: nota da interrogativa e do sujeito estendido vêm primeiro — explicam a estrutura que o usuário acabou de escolher */
  { const mN = (state.formato==='pergunta' && state.whWord && state.whMolde) ? whMoldeDe(state.whWord, state.whMolde) : null;
    const whN = mN ? mN.nota : ((state.formato==='pergunta' && state.whWord) ? WH_NOTA[state.whWord] : ''), sN = mN ? '' : sujNota();
    const possN = (col && state.colPoss && state.categoria==='fact' && !(state.formato==='pergunta' && state.whWord)) ? 'O possessivo do complemento concorda com o <b>dono</b> (' + (state.colPoss === 'suj' ? 'aqui, o próprio sujeito' : state.colPoss) + '), não com a coisa possuída: <i>his car</i> = o carro <b>dele</b>, seja qual for o gênero de "carro".' : '';
    const extras = [whN, sN, possN].filter(Boolean);
    if(extras.length) note = extras.join('<br><br>') + (note && !isStaticWh ? '<br><br>' + note : ''); }
  if(o2Nota) note = (note ? note + '<br><br>' : '') + '🔗 ' + o2Nota;
  const noteBox = document.getElementById('noteBox');
  if(note){ noteBox.innerHTML = "💡 " + note; noteBox.classList.add('show'); } else { noteBox.classList.remove('show'); noteBox.innerHTML=""; }
  notaMonta(noteBox);   /* v157 */
  renderModal(); // mantém o motor de modais em sincronia com o verbo escolhido no dial ③
  if(matrixFollow){ buildMatrix(); buildMatrixSource(); }
  applyA11y(); updateScrollShadows();
  saveState();
}

function getNote(s){
  /* o console aceita um advérbio por encaixe do meio; as notas abaixo tratam o primeiro deles */
  const mList = sortSlots(Array.isArray(s.signalMids) ? s.signalMids : []);
  s = Object.assign({}, s, { signalMid: mList[0] || null });
  const ends = Array.isArray(s.signalEnds) ? s.signalEnds : [];
  if(ends.length > 1){
    const ordenados = sortEnds(ends);
    const NOME_CAT = { como:'como', onde:'onde', quando:'quando' };
    /* cada nome de categoria sai na cor do seu encaixe, então a nota funciona também
       como legenda: o leitor liga o rótulo à cor que acabou de ver na frase */
    const pinta = (txt, kind)=> `<b style="color:${ADJ_COLOR[kind]}">${txt}</b>`;
    const KIND_DE_NOME = { grau:'como', modo:'como', comparação:'como', como:'como',
      lugar:'onde', onde:'onde',
      frequência:'quando', periodicidade:'quando', duração:'quando', tempo:'quando', quando:'quando',
      prazo:'quando', repetição:'quando', aproximação:'quando', sequência:'quando', polaridade:'quando' };
    const regra = ['grau','modo','lugar','periodicidade','duração','tempo']
      .map(n=> pinta(n, KIND_DE_NOME[n])).join(' → ');
    /* o rótulo é o ENCAIXE (grau, modo, lugar, frequência...), que é a unidade da regra —
       dizer "como → como" para grau + modo esconderia justamente por que eles se somam */
    const cats = ordenados.map(x=>{
      const nome = END_SLOT_NOME[endRank(x)] || adjKind(x.cls, x.w);
      return pinta(nome, KIND_DE_NOME[nome] || adjKind(x.cls, x.w));
    });
    const iguais = ordenados.map(x=>x.w).join(' + ') === ends.map(x=>x.w).join(' + ');
    return `Vários adjuntos convivem no fim da frase, mas em <b>ordem fixa</b>: ${regra}. Aqui a ordem é ${cats.join(' → ')}, então sai "${ordenados.map(x=>x.w).join(' ')}"` +
           (iguais ? '.' : ' — o motor reordenou o que você escolheu.') +
           ' Cada encaixe aceita um ocupante: escolher outro do mesmo encaixe substitui, mas encaixes diferentes se somam.';
  }
  if(mList.length > 1){
    const neg = s.formato==='negativa' || s.formato==='pergunta_negativa';
    return `Os advérbios do meio empilham na ordem do corredor — <b>Será · Só · Sempre · Já · Muito</b> (certeza → foco → frequência → fase → intensidade) — logo depois do primeiro auxiliar: "${mList.map(m=>m.w).join(' ')}". Aqui sai nessa ordem mesmo que você tenha escolhido em outra.` +
      (neg ? ' Na negativa, só a certeza e o "still" ficam antes do auxiliar.' : '');
  }
  if(s.signalMid && s.signalMid.cls === 'certaintyFam'){
    const neg = s.formato==='negativa' || s.formato==='pergunta_negativa';
    return neg
      ? `Advérbios de certeza como <b>"${s.signalMid.w}"</b> ficam <b>antes</b> do auxiliar negativo: "I ${s.signalMid.w} won't work" — nunca "I won't ${s.signalMid.w} work". Compare com os de frequência, que vão depois ("I don't always work").`
      : `<b>"${s.signalMid.w}"</b> ocupa a mesma posição média dos advérbios de frequência: depois do auxiliar, antes do verbo principal.`;
  }
  const npi = [s.signalMid, s.signalEnd].find(x=>x && x.cls==='npiFam');
  if(npi) return `<b>"${npi.w}"</b> é um advérbio de polaridade negativa: só aparece em frases negativas e interrogativas. "I don't work ${npi.w}" ✓ · "I work ${npi.w}" ✗ — por isso ele some do dial quando você volta para a afirmativa.`;
  if(s.signalSplit && s.signalSplit.negMid !== s.signalSplit.mid && (s.formato==='negativa' || s.formato==='pergunta_negativa')) return `Repare na troca: <b>"${s.signalSplit.mid}"</b> já é negativo, então em frase negada o inglês usa <b>"${s.signalSplit.negMid} ... ${s.signalSplit.end}"</b> — \"won't <b>ever</b> work again\", nunca \"won't never\". Duas negativas não se somam em inglês padrão.`;
  if(s.signalSplit) return `Advérbio de <b>posição partida</b>: \"${s.signalSplit.mid}\" fica antes do verbo principal e \"${s.signalSplit.end}\" no fim da frase — as duas partes formam uma única ideia.`;
  if(s.formato==='pergunta_negativa' && s.pronome==='I' && s.tempo==='present' && ((s.categoria==='fact' && s.aspecto==='continuo') || (s.categoria==='state' && s.aspecto==='simples'))) return "<b>\"Aren't I\"</b> é a exceção idiomática do inglês: a forma logicamente regular seria \"Amn't I\" / \"Am I not\", mas a fala e a escrita naturais usam \"aren't\" nesse caso único da 1ª pessoa.";
  if(s.signalMid && s.signalMid.w==='just') return "\"Just\" (recém-feito) idiomaticamente vira <b>\"acabar de\" + infinitivo</b> em português — por isso a tradução mostra \"acabei de\" (present perfect) ou \"tinha acabado de\" (past perfect), e não uma versão palavra por palavra.";
  if(s.signalMid && s.signalEnd) return "Meio + fim não competem entre si — cada palavra-sinal responde uma pergunta diferente (<b>com que frequência</b> vs. <b>quando/quantas vezes exatamente</b>), por isso podem conviver na mesma frase.";
  if(s.aspecto==='perfeito_continuo') return "O português normalmente não distingue Present/Past Perfect <b>Continuous</b> do Perfect simples na tradução — ambos tendem a virar \"tenho/tinha trabalhado\". A diferença (duração vs. simples completude) existe só no inglês.";
  if(s.tempo==='future' && s.aspecto==='simples') return "\"Vou trabalhar\" (futuro perifrástico, mais comum na fala) e \"trabalharei\" (futuro sintético, mais formal/escrito) traduzem o mesmo \"will work\".";
  if(s.tempo==='past' && s.aspecto==='perfeito') return "Past Perfect marca uma ação anterior a outra ação já passada — em português, \"tinha trabalhado\" cumpre esse mesmo papel de \"passado do passado\".";
  if(s.categoria==='state') return "O adjetivo concorda em gênero com o sujeito em português (cansado/cansada) — o inglês \"tired\" não muda.";
  if(s.aspecto==='continuo' && s.categoria==='fact') return "Verbos de estado (know, like, want, believe) normalmente não vão para o contínuo em inglês, mesmo quando o português aceitaria \"estou sabendo\".";
  return null;
}

const TENSE_ICON = {present:"📍", past:"⏮️", future:"⏭️"};
const CONJ_BY_TEMPO = {
  present: { list:[{c:"when",note:"quando"},{c:"while",note:"enquanto"},{c:"before",note:"antes de"},{c:"after",note:"depois de"},{c:"as soon as",note:"assim que"},{c:"by the time",note:"até que/quando"},{c:"until",note:"até que"},{c:"unless",note:"a menos que"}], note:"Em orações subordinadas de tempo, essas conjunções pedem presente mesmo quando a ideia principal é futura." },
  past: { list:[{c:"when",note:"quando"},{c:"while",note:"enquanto"},{c:"before",note:"antes de"},{c:"after",note:"depois de"},{c:"as soon as",note:"assim que"},{c:"until",note:"até que"}], note:"Mesmas conjunções, numa narrativa no passado — costumam disparar Past Perfect quando marcam uma ação anterior a outra já passada." },
  future: { list:[], note:"As conjunções de tempo não entram no futuro — elas empurram a oração subordinada para o presente. O \"will\" fica só na oração principal (ver bloco ⏳ Conjunções de tempo)." }
};
function buildAdverbsList(){
  const wrap = document.getElementById('adverbsListWrap');
  const aspectOrder = ["simples","continuo","perfeito","perfeito_continuo"];
  /* Ordem cronológica em toda a referência: o eixo do app é passado → presente →
     futuro, igual ao dial ⑤. Manter "presente" primeiro aqui contradizia a linha do tempo. */
  const tenseOrder = ["past","present","future"];
  let html = `<div class="ref-legend">
    <span><i style="background:${ADJ_COLOR.como}"></i>como / quanto</span>
    <span><i style="background:${ADJ_COLOR.onde}"></i>onde</span>
    <span><i style="background:${ADJ_COLOR.quando}"></i>quando</span>
  </div>
  <div class="ref-asp-tools"><button type="button" class="cross-link" data-asp-all="1">▾ Abrir todos</button><button type="button" class="cross-link" data-asp-all="0">▴ Recolher todos</button></div>`;
  tenseOrder.forEach(t=>{
    html += `<div class="ref-tense-block"><div class="ref-tense-title">${TENSE_ICON[t]} ${TENSE_LABEL[t]}</div>`;
    aspectOrder.forEach(asp=>{
      const key = `${t}_${asp}`; const words = SIGNAL_WORDS[key];
      if(!words || !words.length) return;
      const todas = words.concat(SPLIT_SIGNALS[key] || []);
      /* v133: o bloco tinha ~37 mil px de altura em tela larga. Cada aspecto agora é um <details>
         recolhido: o aluno vê o mapa (tempo → aspecto → quantas expressões) e abre só o que procura. */
      html += `<details class="ref-asp"><summary class="ref-subhead">${ASPECT_ICON[asp]} ${ASPECT_LABEL[asp]}<span class="ref-n">${todas.length} expressões</span></summary>`;
      const groups = {};
      todas.forEach(w=>{ (groups[w.cls]=groups[w.cls]||[]).push(w); });
      Object.keys(CLASS_INFO).forEach(cls=>{
        if(!groups[cls]) return;
        html += `<div class="ref-class-label">${CLASS_INFO[cls].label}</div><div>`;
        /* mesma cor de encaixe do console: a lista deixa de ser uma parede cinza e passa
           a mostrar, de relance, que categoria cada expressão ocupa na frase */
        groups[cls].forEach(w=>{
          const k = adjKind(w.cls, w.w);
          html += `<span class="ref-tag" data-cat="${k}" style="--cat:${ADJ_COLOR[k]}">${escapeHTML(w.w)}</span>`;
        });
        html += `</div>`;
      });
      html += `</details>`;
    });
    const cj = CONJ_BY_TEMPO[t];
    if(cj.list.length){
      html += `<div class="ref-subhead">🔗 Conjunções típicas</div><div>`;
      cj.list.forEach(c=>{ html += `<span class="ref-tag">${c.c} <i>— ${c.note}</i></span>`; });
      html += `</div>`;
    }
    if(cj.note) html += `<div class="ref-conj-note">💡 ${cj.note}</div>`;
    html += `</div>`;
  });
  html += `<div class="ref-tense-block"><div class="ref-tense-title">✅ Since / For — aspecto perfeito (qualquer tempo)</div><div>
    <span class="ref-tag">since 2020</span><span class="ref-tag">since Monday</span><span class="ref-tag">for three years</span><span class="ref-tag">for two hours</span>
  </div><div class="ref-conj-note">💡 "Since" marca o ponto de partida (desde X); "for" marca a duração (por/há X). Combinam com o perfeito em qualquer tempo — presente, passado ou futuro.</div></div>`;
  wrap.innerHTML = html;
  wrap.querySelectorAll('[data-asp-all]').forEach(b=>{ b.onclick = ()=> wrap.querySelectorAll('details.ref-asp').forEach(d=>{ d.open = b.dataset.aspAll === '1'; }); });
}
/* A tabela nasceu como referência fixa (work / I) — um ponto de comparação estável.
   Com 114 verbos no banco, faz sentido poder vê-la com o verbo e o pronome do console:
   ver a matriz inteira de um irregular é justamente onde ela ensina mais. A escolha fica
   guardada, e o PNG exportado acompanha. */
let matrixFollow = false;
function matrixVerb(){ return matrixFollow ? verbById(state.verbo) : verbById('work'); }
function matrixPronoun(){ return matrixFollow ? state.pronome : 'I'; }
function buildMatrixSource(){
  const row = document.getElementById('matrixSourceRow');
  const note = document.getElementById('matrixNote');
  if(!row) return;
  row.innerHTML = "";
  [[false,'Padrão: work · I'],[true,'Seguir o console']].forEach(([val,label])=>{
    const b = document.createElement('div'); b.className='pronome-pill';
    b.dataset.active = (matrixFollow === val); b.textContent = label;
    b.onclick = ()=>{ matrixFollow = val; buildMatrix(); buildMatrixSource(); applyA11y(); saveState(); };
    row.appendChild(b);
  });
  const v = matrixVerb();
  note.innerHTML = matrixFollow
    ? `Mostrando <b style="color:var(--brass)">${escapeHTML(v.label.split(' ')[0])}${v.prt ? ' ' + v.prt : ''}</b> com o pronome <b style="color:var(--brass)">${matrixPronoun()}</b>, conforme os dials ① e ③.`
    : `Referência fixa: verbo <b style="color:var(--brass)">work</b> com o pronome <b style="color:var(--brass)">I</b>.`;
}
function buildMatrix(){
  const wrap = document.getElementById('matrixWrap'); let html = "";
  Object.keys(CATEGORIES).forEach(catKey=>{
    const cat = CATEGORIES[catKey];
    html += `<table class="matrix"><caption>${cat.icon} ${cat.label}</caption><thead><tr><th>Aspecto \\ Tempo</th><th>Passado</th><th>Presente</th><th>Futuro</th></tr></thead><tbody>`;
    cat.aspects.forEach(asp=>{
      html += `<tr><td class="cat">${ASPECT_LABEL[asp]}</td>`;
      ["past","present","future"].forEach(t=>{
        const v = matrixVerb(), pr = matrixPronoun();
        const affHTML = markedToHTML(generate(catKey,t,asp,'afirmativa',pr,v).text + ".", markColorVar('afirmativa'));
        const negHTML = markedToHTML(generate(catKey,t,asp,'negativa',pr,v).text + ".", markColorVar('negativa'));
        const perHTML = markedToHTML(generate(catKey,t,asp,'pergunta',pr,v).text + M("?"), markColorVar('pergunta'));
        const perNegHTML = markedToHTML(generate(catKey,t,asp,'pergunta_negativa',pr,v).text + M("?"), markColorVar('pergunta_negativa'));
        html += `<td class="cell-lines"><div>${affHTML}</div><div>${negHTML}</div><div>${perHTML}</div><div>${perNegHTML}</div></td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
  });
  wrap.innerHTML = html;
}

const ERROS = [
  {no:"Did you worked?", yes:"Did you work?", why:"Depois de did/do/does o verbo fica sempre na forma base — quem carrega o passado é o auxiliar."},
  {no:"I are working.", yes:"I am working.", why:"O verbo to be concorda com o sujeito (am/is/are) — não existe forma única para todos."},
  {no:"I will can do it.", yes:"I will be able to do it.", why:"Modais não se empilham. Can não tem futuro próprio — usa-se will be able to."},
  {no:"I have work here since 2020.", yes:"I have worked here since 2020.", why:"O present perfect exige particípio (worked), não a forma base."},
  {no:"He don't work.", yes:"He doesn't work.", why:"3ª pessoa do singular (he/she/it) exige doesn't, não don't."},
  {no:"You must not come if you don't want.", yes:"You don't have to come if you don't want.", why:"\"Must not\" = proibição. \"Don't have to\" = ausência de obrigação. Não são intercambiáveis."},
  {no:"I usedn't to work here.", yes:"I didn't use to work here.", why:"A negativa de used to é formada com didn't + use to (sem -d)."},
  {no:"When I will arrive, I will call you.", yes:"When I arrive, I will call you.", why:"Depois de when/while/before/after/as soon as com sentido futuro, usa-se presente — nunca will."},
  {no:"Where you work?", yes:"Where do you work?", why:"Perguntas com wh-word de circunstância continuam precisando do auxiliar (do/does/did/is/have...) — só muda o que vem antes dele."},
  {no:"What means this?", yes:"What does this mean?", why:"\"What\" aqui não é sujeito — é objeto de \"mean\". Como não é pergunta de sujeito, precisa do do-support: does + this + mean."}
];
function buildErros(){
  const el = document.getElementById('errosGrid');
  el.innerHTML = ERROS.map(e=>`
    <div class="erro-card">
      <span class="no">✗ ${e.no}</span>
      <div class="yes-row"><span class="yes">✓ ${e.yes}</span><button class="audio-btn sm" data-text="${e.yes}" title="Ouvir">🔊</button></div>
      <div class="why">${e.why}</div>
    </div>
  `).join("");
}

