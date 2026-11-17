/* ---- v136: COBERTURA das orações reduzidas ----
   17 parágrafos de 5 frases, cada um com 2 reduzidas + 3 outros tipos: fecham os 90 pares "reduzida × outro tipo" que faltavam.
   Os dados (frases) ficam em PAR_RED_X; as notas e as explicações são montadas aqui, a partir do tipo de cada frase. */
const PAR_RED_WHY = {
  adit:c => `<i>${c.cj}</i> <b>soma</b> uma ação à outra, com o mesmo peso: no teste do ponto final, cada metade ainda é uma frase.`,
  adv:c => `<i>${c.cj}</i> faz o <b>contraste</b>: a segunda oração quebra a expectativa criada pela primeira.`,
  alt:c => `<i>${c.cj}</i> abre <b>duas saídas</b>: só uma delas vai acontecer.`,
  expl:c => `<i>${c.cj}</i> <b>explica</b> o que acabou de ser dito. Vem depois da vírgula e nunca abre a frase.`,
  cons:c => `<i>${c.cj}</i> tira a <b>conclusão</b>: o resultado vem do que a primeira oração disse.`,
  final:c => `<i>${c.cj}</i> diz <b>para quê</b>: a finalidade da ação principal, com o mesmo sujeito.`,
  caus:c => `<i>${c.cj}</i> dá o <b>motivo</b>: responde "por quê?" e vem depois da principal.`,
  temp:c => `<i>${c.cj}</i> situa a ação no <b>tempo</b>: ordem ou momento em relação à principal.`,
  cond:c => `<i>${c.cj}</i> impõe uma <b>condição</b>: a principal só se realiza se ela valer.`,
  conc:c => `<i>${c.cj}</i> <b>admite o obstáculo</b> e segue em frente: a principal vale apesar dele.`,
  cmp:c => `<i>${c.cj}</i> <b>compara</b> dois modos ou graus: a segunda metade é o termo de comparação.`,
  conf:c => `<i>${c.cj}</i> mostra que a ação <b>segue um combinado</b> ou um plano: "conforme".`,
  prop:c => `<i>${c.cj}</i> liga duas coisas que <b>crescem juntas</b>: a proporção entre elas.`,
  csq:c => `<i>${c.cj}</i> mede a <b>intensidade pelo resultado</b>: a ação é tão forte que produz um efeito.`,
  rel:c => `<i>${c.cj}</i> abre uma <b>relativa restritiva</b>: identifica de qual pessoa ou coisa se fala, sem vírgula.`,
  relx:c => `<i>${c.cj}</i> abre uma <b>relativa explicativa</b>: acrescenta um comentário, entre vírgulas.`,
  oq:c => `<i>${c.cj}</i> abre uma <b>pergunta indireta</b>: a pergunta vira o objeto de um verbo de saber, perguntar ou explicar, com ordem de afirmativa.`,
  obj:c => `<i>${c.cj}</i> introduz o <b>objeto direto</b>: o conteúdo do que se sabe, diz ou pensa.`,
  oi:c => `A oração faz o papel de <b>objeto indireto</b>: vem depois de uma preposição que o verbo principal pede.`,
  subj:c => `<i>${c.cj}</i> faz a oração de <b>sujeito</b>: o <i>it</i> segura o lugar e a ideia vem depois.`,
  pred:c => `<i>${c.cj}</i> define o sujeito: a oração é o <b>predicativo</b> ("o ponto é…", "a verdade é…").`,
  cn:c => `A oração <b>dá conteúdo a um substantivo</b> abstrato (fato, ideia, crença): é o complemento nominal.`,
  ap:c => `A oração funciona como <b>aposto</b>: depois dos dois-pontos, detalha o que o substantivo anterior anunciou.`,
  rger:c => `<i>${c.cj}</i> + <b>-ing</b> é a <b>reduzida de gerúndio</b>: sem sujeito próprio (é o da principal) e sem verbo conjugado. Depois de preposição, o inglês pede sempre <i>-ing</i>.`,
  rpart:c => `<i>${c.cj}</i> + <b>particípio</b> é a <b>reduzida de particípio</b>: somem o sujeito e o <i>be</i>, e o sentido é passivo ou de estado.`,
  rinf:c => `O verbo principal pede <b>${c.cj === '-ing' ? 'verbo-<i>ing</i>' : '<i>to</i> + verbo'}</b> como objeto: reduzida substantiva, sem <i>that</i> e sem sujeito novo.`,
  rrel:c => `A relativa perdeu o pronome e o <i>be</i>: <b>${c.cj === 'to' ? '<i>to</i> + verbo' : c.cj === '-ed' ? 'o particípio' : 'o <i>-ing</i>'}</b> descreve o substantivo ao lado, como um adjetivo comprido.`
};
function parRedExtra(){
  const { L, R, P } = PAR_RED_X;
  const nomeT = k => (O2_TIPOS.find(t => t.k === k) || { nome:k }).nome;
  const tempoPt = c => ({ present:'presente', past:'passado', future:'futuro' }[c.t]) + (c.a === 'perfeito' ? ' perfeito' : ' simples');
  const uniq = a => [...new Set(a)];
  return P.map(([id, tema, nivel, titulo, ideia, ks]) => {
    const cs = ks.map(k => L[k] || R[k]);
    const s = cs.map(c => Object.assign({}, c, { why:PAR_RED_WHY[c.o2.k](c.o2) }));
    const reds = uniq(cs.map(c => c.o2.k).filter(k => /^r(ger|part|inf|rel)$/.test(k))), outros = cs.map(c => c.o2.k).filter(k => !reds.includes(k));
    const pecas = uniq([].concat(...cs.map(c => [c.col].concat(c.mid || [], c.ends || []))).filter(Boolean));
    return { id, r:'enxugar', tema, nivel, titulo, ideia,
      n:{ v:`${uniq(cs.map(c => c.v)).map(v => '<i>' + v + '</i>').join(', ')}: cada frase usa um verbo diferente do mesmo assunto (${tema}), para ver os cinco tipos de oração em contextos variados.`,
          t:`Tempos usados: ${uniq(cs.map(tempoPt)).join(', ')}. A reduzida <b>não tem tempo próprio</b>: herda o da principal. O particípio dela é passivo, não é passado.`,
          e:pecas.length ? `Peças soltas desta cena: <i>${pecas.join('</i>, <i>')}</i>. A oração reduzida já carrega o detalhe, por isso sobra pouco encaixe.` : `Quase nenhuma peça solta: as próprias orações carregam o detalhe.`,
          c:`<b>${ks.map(k => nomeT((L[k] || R[k]).o2.k)).join(' + ')}</b>. As duas reduzidas (<b>${reds.map(nomeT).join(' e ')}</b>) dizem o mesmo com menos palavras; as outras três (${outros.map(nomeT).join(', ')}) mostram o contraste com orações conjugadas.` },
      s };
  });
}
PARAGRAFOS.push(...parRedExtra());
/* v125: LINHAS DE RACIOCÍNIO — o eixo principal da seção. Cada parágrafo encadeia ideias de um jeito; é isso que se aprende aqui. */
const PAR_RAC = {
  indireta:  { ic:'🔍', nome:'Pergunta indireta',     d:'Saber, perguntar ou explicar <i>o quê, onde, quando, por quê</i>: a pergunta vira objeto de outro verbo e perde o <i>do/does</i>.' },
  explicar:  { ic:'💡', nome:'Explicar e concluir',   d:'Afirmo, dou o fundamento (<i>for</i>) e tiro a conclusão (<i>so</i>). É a base de qualquer argumento.' },
  causa:     { ic:'🎯', nome:'Causa e efeito',        d:'Motivo (<i>because, since, now that</i>) e resultado (<i>so, which is why</i>), em ordens e ênfases diferentes.' },
  objetivo:  { ic:'🧗', nome:'Objetivo e obstáculo',  d:'Para que faço (<i>to, in order to</i>) e apesar de quê (<i>although, even though</i>): o relato de quem persegue uma meta.' },
  contraste: { ic:'⚖️', nome:'Contraste e virada',    d:'O que era contra o que é (<i>but, yet</i>), e a mudança que nasce desse choque.' },
  condicao:  { ic:'🔀', nome:'Condição e hipótese',   d:'O que depende de quê: condições reais (<i>if, unless</i>), hipóteses (<i>would</i>) e o passado que não aconteceu (<i>would have</i>).' },
  sequencia: { ic:'🪜', nome:'Sequência e processo',  d:'Uma coisa depois da outra (<i>first, after that, as soon as, before</i>): como narrar etapas na ordem certa.' },
  proporcao: { ic:'📈', nome:'Proporção e medida',    d:'Quanto mais, mais (<i>the more… the more</i>), tanto que (<i>so… that</i>) e comparações: como graduar o que se diz.' },
  enxugar:   { ic:'✂️', nome:'Enxugar a frase',       d:'Dizer a mesma coisa com menos palavras: o sujeito e o tempo da segunda oração somem e o verbo vira <i>-ing</i>, <i>-ed</i> ou <i>to</i>. É a marca do inglês natural e profissional.' },
  descricao: { ic:'🔍', nome:'Descrever e especificar', d:'Dizer de qual pessoa ou coisa se fala (<i>who, that, whose</i>) e acrescentar um comentário entre vírgulas (<i>, which</i>).' },
  retrato:   { ic:'🖼️', nome:'Retrato em várias faces', d:'O mesmo assunto visto por ângulos diferentes: o que se sabe, o que se faz, o que contrasta e o que se decide. Cada frase usa um tipo de oração distinto, e é aqui que estão as combinações mais raras.' },
  argumento: { ic:'🗣️', nome:'Afirmar e sustentar',   d:'Nomear o problema (<i>The problem is that</i>), afirmar o evidente (<i>It is clear that</i>) e amarrar ao combinado (<i>as we planned</i>).' }
};
/* dimensões de filtro: o aluno escolhe COMO quer percorrer o acervo */
const PAR_DIMS = [ { k:'r', nome:'🧠 Raciocínio' }, { k:'f', nome:'🧬 Combinação' }, { k:'o', nome:'🔗 Tipo de oração' }, { k:'t', nome:'⏱ Tempo verbal' }, { k:'tema', nome:'🗂 Tema' } ];
/* v126: AS QUATRO FAMÍLIAS de oração (5 coordenadas · substantivas · adjetivas · adverbiais; em v135, +4 reduzidas) e o papel de ESTILO de cada tipo.
   A família sai do próprio cadastro do tipo (campo fam), então nunca fica desalinhada com o motor. */
const PAR_FAMS = { coord:{ nome:'Coordenada', cor:'var(--teal)' }, subst:{ nome:'Substantiva', cor:'var(--blue)' }, adj:{ nome:'Adjetiva', cor:'var(--lime)' }, adv:{ nome:'Adverbial', cor:'var(--orange)' } };
const parFam = k => { const f = (O2_TIPOS.find(t => t.k === k) || {}).fam || ''; return /^Coordenada/.test(f) ? 'coord' : /substantiva/.test(f) ? 'subst' : /adjetiva/.test(f) ? 'adj' : 'adv'; };
const PAR_PAPEL = {
  adit:'soma uma ideia de mesmo peso', adv:'contrapõe e quebra a expectativa', alt:'abre duas possibilidades', expl:'justifica o que acabou de ser dito', cons:'tira a conclusão',
  subj:'apresenta a ideia como fato ou princípio, sem sujeito pessoal', pred:'nomeia o problema, a verdade ou o ponto', obj:'diz o conteúdo do que se pensa, sabe ou afirma', oq:'transforma uma pergunta em objeto de saber, perguntar ou explicar', oi:'encaixa uma oração depois de preposição',
  cn:'dá conteúdo a um substantivo abstrato (fato, ideia, crença)', ap:'anuncia e revela, com dois-pontos',
  rel:'especifica de quem ou de que se fala', relx:'acrescenta um comentário de passagem, entre vírgulas',
  caus:'dá o motivo', temp:'situa no tempo e ordena as ações', cond:'põe uma condição', conc:'admite um obstáculo sem ceder', final:'declara o objetivo',
  cmp:'mede por comparação', conf:'amarra ao que foi combinado ou dito', prop:'liga duas grandezas que variam juntas', csq:'mede a intensidade pelo resultado',
  rger:'enxuga uma ação de tempo, meio ou causa (mesmo sujeito)', rpart:'enxuga uma condição ou estado em poucas palavras', rinf:'diz o que se quer, decide ou evita fazer', rrel:'descreve o substantivo sem pronome relativo' };
/* v128: COMO SE FORMA cada tipo, em uma linha ({c} = a conjunção usada na frase). Aparece em toda frase do "frase por frase",
   para que papel (para que serve), estrutura (como se monta) e comentário (por que aqui) andem sempre juntos. */
const PAR_FORMA = {
  adit:'oração + <i>{c}</i> + oração: as duas têm sujeito e verbo próprios, no mesmo tempo.',
  adv:'oração, vírgula, <i>{c}</i> + oração: o segundo fato contraria o que o primeiro faz esperar.',
  alt:'oração + <i>{c}</i> + oração: só uma das duas vai acontecer.',
  expl:'afirmação, vírgula, <i>{c}</i> + oração: a explicação vem sempre depois, nunca abre a frase.',
  cons:'oração, vírgula, <i>{c}</i> + oração: a consequência acompanha o tempo da principal.',
  subj:'<i>It is</i> + adjetivo + <i>that</i> + oração (ou <i>to</i> + verbo): o <i>it</i> só guarda o lugar; o sujeito de verdade é a oração.',
  pred:'<i>The problem / truth / point is that</i> + oração completa: a oração diz o que o substantivo é.',
  obj:'verbo de dizer, pensar ou saber + <i>{c}</i> + oração: a oração é o objeto do verbo. Sem vírgula.',
  oq:'verbo de saber/perguntar + palavra interrogativa (<i>{c}</i>…) + sujeito + verbo: ordem de afirmativa, sem <i>do/does</i>.',
  oi:'verbo + preposição + oração (<i>how…</i>, <i>whether…</i> ou <i>-ing</i>): depois de preposição não se usa <i>that</i>.',
  cn:'substantivo abstrato + <i>that</i> + oração: a oração diz qual é o fato, a ideia ou a crença.',
  ap:'substantivo + dois-pontos + oração: primeiro se anuncia, depois se revela.',
  rel:'substantivo + <i>{c}</i> + oração, sem vírgula: a oração identifica de quem ou de que se fala.',
  relx:'substantivo, vírgula, <i>{c}</i> + oração: a informação é extra; sem ela, a frase continua completa.',
  caus:'<i>{c}</i> + oração com sujeito e verbo. No fim da frase, sem vírgula; no começo, com vírgula.',
  temp:'<i>{c}</i> + oração. Falando do futuro, a oração de tempo fica no presente (nunca <i>will</i>).',
  cond:'<i>{c}</i> + oração: presente para condição real; passado para hipótese (com <i>would</i> na principal).',
  conc:'<i>{c}</i> + oração, geralmente na frente e com vírgula: admite o obstáculo, e a principal se mantém.',
  final:'<i>{c}</i> + verbo no infinitivo, com o mesmo sujeito da principal.',
  cmp:'advérbio comparado + sujeito + auxiliar (<i>he does</i>, <i>they do</i>): o auxiliar evita repetir o verbo.',
  conf:'<i>{c}</i> + sujeito + verbo (<i>as we planned</i>): "conforme". Sem vírgula.',
  prop:'<i>the more / the less</i> + oração, vírgula, <i>the more</i> + oração: as duas partes variam juntas.',
  csq:'<i>so</i> + advérbio (ou <i>so much</i>) + <i>that</i> + oração: a intensidade leva ao resultado. Sem vírgula.',
  rger:'<i>{c}</i> + verbo no <i>-ing</i>, sem sujeito: o sujeito é o da principal. Depois de preposição, sempre <i>-ing</i>.',
  rpart:'<i>{c}</i> + particípio, vírgula, principal: ficou só o que sobra de <i>sujeito + be</i>. Sentido passivo ou de estado.',
  rinf:'verbo da principal + <i>to</i> + verbo (ou verbo-<i>ing</i>): a oração é o objeto e não repete o sujeito.',
  rrel:'substantivo + <i>-ing</i> / particípio / <i>to</i> + verbo: a relativa perdeu o pronome e o auxiliar.' };
/* o que cada PAR de famílias produz como estilo (10 pares possíveis) */
const PAR_ESTILO = {
  'coord+coord':'Encadeamento em linha reta: ideias de mesmo peso, uma depois da outra. Ritmo direto, bom para relatar e argumentar passo a passo.',
  'coord+subst':'Tese e movimento: a substantiva enuncia o que se pensa ou afirma; a coordenada soma, opõe ou conclui a partir disso.',
  'adj+coord':'Precisão e ritmo: a adjetiva define de quem ou de que se fala; a coordenada faz o texto andar.',
  'adv+coord':'Circunstância e conclusão: a adverbial dá a moldura (motivo, tempo, condição) e a coordenada tira a consequência ou marca o contraste.',
  'subst+subst':'Texto de ideias: várias orações funcionando como sujeito, objeto ou aposto. É o registro da opinião e da análise.',
  'adj+subst':'Definir e afirmar: a adjetiva delimita o assunto e a substantiva diz o que se pensa sobre ele.',
  'adv+subst':'Afirmação situada: a substantiva traz a tese e a adverbial diz em que condições, por que ou apesar de quê ela vale.',
  'adj+adj':'Descrição em camadas: uma relativa identifica, a outra comenta. A vírgula muda o sentido.',
  'adj+adv':'Descrição com contexto: digo qual é a coisa e em que circunstância ela importa.',
  'adv+adv':'Raciocínio circunstanciado: motivo, objetivo, condição e ressalva se combinam. É o tecido de qualquer explicação bem feita.' };
function parFamilias(x){ return [...new Set(x.fr.filter(r => r.tipo).map(r => parFam(r.tipo.k)))].sort(); }
function parParesFam(fams){ const o = []; fams.forEach((a, i) => fams.slice(i).forEach(b => { if(a !== b || fams.length === 1) o.push([a, b].sort().join('+')); })); return o; }
/* pares de famílias REALMENTE presentes: saem dos pares de tipos distintos (dois tipos da mesma família contam como "adj+adj", "subst+subst"…) */
function parParesDe(fr){
  const tipos = [...new Set(fr.filter(r => r.tipo).map(r => r.tipo.k))], o = new Set();
  tipos.forEach((a, i) => tipos.slice(i + 1).forEach(b => o.add([parFam(a), parFam(b)].sort().join('+'))));
  if(tipos.length === 1) o.add(parFam(tipos[0]) + '+' + parFam(tipos[0]));
  return [...o].sort();
}
/* v162: parágrafos que combinam a PERGUNTA INDIRETA (oq) com cada um dos outros tipos de oração (cobre os 26 pares).
   Nada de inglês digitado à mão: verbos, conjunções e opções vêm dos motores; só as notas em português são escritas aqui.
   Cada candidato é conferido ao montar (a frase precisa compor sem aviso); o que não compõe com um verbo passa para o próximo. */
function parOqExtra(){
  const T = k => O2_TIPOS.find(t => t.k === k), outros = O2_TIPOS.filter(t => t.k !== 'oq').map(t => t.k);
  const verbosOut = ['work', 'study', 'need', 'call', 'buy', 'leave', 'plan', 'help'], pron = ['I', 'We', 'She', 'They'];
  const temas = ['trabalho', 'estudo', 'carreira', 'tecnologia', 'viagem', 'finanças', 'casa'];
  const quieto = fn => { const w = console.warn; let n = 0; console.warn = () => { n++; }; try { fn(); } catch(e){ n++; } finally { console.warn = w; } return n; };
  const ok = c => { let r = null; return quieto(() => { r = parFrase(c, 'oq'); if(c.o2 && !r.tipo) throw 0; }) === 0; };
  const nomeT = k => T(k).nome.replace(/\s*\(.*\)$/, '').toLowerCase();
  /* verbos que abrem cada tipo (ids do banco, não frases): o resto usa a lista geral */
  const pref = { obj:['think', 'say', 'hope'], oi:['talk', 'think'], cn:['accept'], ap:['have'], rel:['write', 'buy', 'take'], relx:['write', 'buy', 'take'], rrel:['write', 'see'] };
  const fraseOut = (k, i) => { const vs = (pref[k] || []).concat(verbosOut.slice(i % verbosOut.length), verbosOut.slice(0, i % verbosOut.length));
    for(const v of vs){ const verb = verbById(v); if(verb.id !== v) continue;
      const base = { p:pron[i % pron.length], t:'present', a:'simples', v:v, f:'afirmativa', o2:{ k:k, cj:T(k).conjs[0].en } };
      for(const cl of (verb.col || []).slice(0, 5)){ const c = Object.assign({}, base, { col:cl.en }); if(ok(c)) return c; }     /* com colocação a frase fica mais natural */
      if(ok(base)) return base; } return null; };
  const mains = [{ p:'I', v:'know', f:'negativa' }, { p:'You', v:'know', f:'pergunta' }, { p:'We', v:'know', f:'afirmativa' }, { p:'He', v:'ask', f:'afirmativa' }, { p:'She', v:'explain', f:'afirmativa' }];
  const ci = T('oq').conjs.length, lista = [];
  for(let g = 0; g * 2 < outros.length; g++){
    const ks = outros.slice(g * 2, g * 2 + 2), s = [];
    let c0 = null;
    for(let d = 0; d < ci * mains.length && !c0; d++){ const m = mains[(g + d) % mains.length], cj = T('oq').conjs[(g * 3 + d) % ci].en;
      const c = { p:m.p, t:'present', a:'simples', v:m.v, f:m.f, o2:{ k:'oq', cj:cj } }; if(ok(c)) c0 = c; }
    if(!c0) continue; s.push(c0);
    ks.forEach((k, j) => { const c = fraseOut(k, g * 2 + j); if(c) s.push(c); });
    if(s.length < 2) continue;
    const ns = s.slice(1).map(c => nomeT(c.o2.k));
    s.forEach((c, j) => { const k = c.o2.k; c.why = k === 'oq'
      ? `A pergunta vira <b>objeto</b> de <i>${c.v}</i>: ordem de afirmativa (sujeito + verbo), sem <i>do/does</i>. ${c.f === 'pergunta' ? 'Quando a frase toda é pergunta, só a principal inverte.' : ''}`
      : `<b>${nomeT(k)}</b>: ${PAR_PAPEL[k]}.`; });
    lista.push({ id:'oq' + (g + 1), r:'indireta', tema:temas[g % temas.length], nivel:3, titulo:'Perguntar sem inverter · ' + ns.join(' e '),
      ideia:'Uma pergunta indireta ao lado de ' + ns.join(' e ') + ', na mesma cena.',
      n:{ v:'<i>' + [...new Set(s.map(c => c.v))].join('</i>, <i>') + '</i>: o verbo de saber ou perguntar abre espaço para a pergunta indireta; os outros verbos mostram a mesma cena em outras ligações.',
          c:'<b>Pergunta indireta + ' + ns.join(' + ') + '</b>. A indireta guarda uma dúvida dentro da frase; as outras ligações dizem por quê, quando, para quê ou em que condição. Juntas, mostram que a ordem da pergunta direta só muda na pergunta indireta.' },
      s });
  }
  return lista;
}
PARAGRAFOS.push(...parOqExtra());
let parFiltro = { dim:'r', val:null, val2:null, nivel:null }, parAbertos = new Set(), parCache = null;
/* valores que um parágrafo tem em cada dimensão (tipo de oração e tempo saem das frases já montadas) */
function parValores(x, dim){
  if(dim === 'r') return [x.P.r];
  if(dim === 'tema') return [x.P.tema];
  if(dim === 'o') return [...new Set(x.fr.filter(r => r.tipo).map(r => r.tipo.k))];
  if(dim === 'f') return [parFamilias(x).join('+')];
  return [...new Set(x.P.s.map(c => c.t + '_' + c.a))];
}
function parRotulo(dim, v){
  if(dim === 'r') return PAR_RAC[v].ic + ' ' + PAR_RAC[v].nome;
  if(dim === 'tema') return (PAR_TEMA_IC[v] || '') + ' ' + v;
  if(dim === 'o'){ const T = O2_TIPOS.find(t => t.k === v); return T.ic + ' ' + T.nome.replace(/\s*\(.*\)$/, ''); }
  if(dim === 'f') return v.split('+').map(f => PAR_FAMS[f].nome).join(' + ');
  const [t, a] = [v.slice(0, v.indexOf('_')), v.slice(v.indexOf('_') + 1)]; return TENSE_LABEL[t] + ' · ' + ASPECT_LABEL[a];
}
/* monta todas as frases UMA vez (o banco não muda durante a sessão) */
function parMontados(){
  if(!parCache) parCache = PARAGRAFOS.map(P => ({ P, fr:P.s.map((c, j) => parFrase(c, P.titulo + ' #' + (j + 1))) }));
  return parCache;
}
/* etiquetas coloridas da frase: tempo · encaixes na ordem real · colocação · conjunção */
function parEtiquetas(c, r){
  const tag = (txt, cor) => `<span class="par-tag"${cor ? ` style="color:${cor}; border-color:${cor}"` : ''}>${txt}</span>`;
  let h = tag('⏱ ' + TENSE_LABEL[c.t] + ' · ' + ASPECT_LABEL[c.a] + ((c.f && c.f !== 'afirmativa') ? ' · ' + FORMATO_LABEL[c.f] : ''));
  r.slots.forEach(s => { h += tag(escapeHTML(s.nome) + ': <b>' + escapeHTML(s.w) + '</b>', ADJ_COLOR[s.kind]); });
  if(r.col) h += tag('colocação: <b>' + escapeHTML(r.verb.base + ' ' + r.col.en) + '</b>', ADJ_COLOR.regencia);
  if(r.tipo) h += tag(r.tipo.ic + ' ' + escapeHTML(r.tipo.nome.replace(/\s*\(.*\)$/, '')) + ': <b>' + escapeHTML(r.trLabel || r.conj) + '</b>', ADJ_COLOR.conj);
  r.sl2.forEach(s => { h += tag('2ª oração · ' + escapeHTML(s.nome) + ': <b>' + escapeHTML(s.w) + '</b>', ADJ_COLOR[s.kind]); });
  return h;
}
/* assinatura do parágrafo: os tipos de oração na ordem em que aparecem (em magenta, a cor das conjunções) */
function parAssinatura(fr, curta){
  if(curta) return fr.map(r => r.tipo ? escapeHTML(r.trLabel || r.conj) : '—').join(' → ');
  const l = fr.map(r => r.tipo ? `<b style="color:${ADJ_COLOR.conj}">${escapeHTML(r.tipo.nome.replace(/\s*\(.*\)$/, ''))}</b> <i>${escapeHTML(r.trLabel || r.conj)}</i>` : '<span>frase simples</span>');
  return l.join(' → ');
}
/* v127: quando o parágrafo não traz nota própria de tempo ou de encaixes, a nota é MONTADA a partir da própria frase
   (o tempo de cada uma e as peças que ela tem), com a razão de cada tempo e de cada encaixe. */
const PAR_TEMPO_PQ = { present_simples:'hábito, regra ou fato permanente', present_continuo:'ação em andamento agora', present_perfeito:'algo que vem do passado e chega até agora',
  present_perfeito_continuo:'atividade que vem se repetindo até agora', past_simples:'fato concluído', past_continuo:'cena em andamento no passado', past_perfeito:'o que já estava pronto antes de outro fato passado',
  past_perfeito_continuo:'atividade que vinha acontecendo antes de outro fato', future_simples:'plano, previsão ou decisão', future_continuo:'ação em andamento num momento futuro', future_perfeito:'algo concluído antes de um ponto no futuro', future_perfeito_continuo:'duração até um ponto no futuro' };
const PAR_SLOT_PQ = { 'frequência':'diz com que frequência', 'grau':'intensifica', 'foco':'soma ou destaca', 'certeza':'gradua a certeza', 'completude':'marca se já aconteceu', 'modo':'diz como', 'lugar':'diz onde', 'duração':'diz por quanto tempo',
  'periodicidade':'diz de quanto em quanto tempo', 'tempo':'diz quando', 'sequência':'liga esta frase à anterior', 'fase':'marca em que fase a ação está (já, ainda, acabou de)', 'intensidade':'intensifica' };
function parAutoT(P, fr){
  const grupos = [];
  P.s.forEach((c, j) => { const hip = c.o2 && c.o2.cnd >= 2; const k = c.t + '_' + c.a + (hip ? '_h' + c.o2.cnd : '');
    let g = grupos.find(x => x.k === k); if(!g){ g = { k, c, hip:hip ? c.o2.cnd : 0, n:[] }; grupos.push(g); } g.n.push(j + 1); });
  const fra = n => (n.length > 1 ? 'frases ' + n.slice(0, -1).join(', ') + ' e ' + n[n.length - 1] : 'frase ' + n[0]);
  const txt = grupos.map(g => { const rot = '<b>' + (g.hip === 2 ? 'Condicional (would)' : g.hip === 3 ? 'Condicional perfeito (would have)' : TENSE_LABEL[g.c.t] + ' · ' + ASPECT_LABEL[g.c.a]) + '</b>';
    const pq = g.hip === 2 ? 'hipótese: <i>would</i> na principal e passado depois de <i>if</i>' : g.hip === 3 ? 'passado irreal: <i>would have</i> na principal e <i>had</i> + particípio depois de <i>if</i>' : PAR_TEMPO_PQ[g.c.t + '_' + g.c.a];
    return rot + ' (' + fra(g.n) + '): ' + pq; }).join('; ') + '.';
  return txt + (grupos.length === 1 ? ' Um só tempo no parágrafo inteiro: o que varia, e o que se quer observar, é a ligação entre as orações.' : ' A troca de tempo acompanha a troca de papel de cada frase.');
}
function parAutoE(P, fr){
  const itens = [];
  fr.forEach((r, j) => r.slots.forEach(s => itens.push('<i>' + escapeHTML(s.w) + '</i> (frase ' + (j + 1) + ') ' + (PAR_SLOT_PQ[s.nome] || 'ocupa o encaixe de ' + escapeHTML(s.nome)))));
  const semPeca = fr.filter(r => !r.slots.length).length;
  if(!itens.length) return 'Nenhuma palavra-sinal: as orações já ocupam os lugares da frase. Quando o complemento ou a circunstância é uma oração inteira, quase não sobra espaço para encaixes.';
  return itens.join('; ') + '.' + (semPeca ? ' ' + (semPeca === 1 ? 'Uma frase fica' : semPeca + ' frases ficam') + ' sem peças: nelas a própria oração faz o papel de complemento ou de circunstância.' : '');
}
/* famílias presentes no parágrafo e o estilo que cada par de famílias produz */
function parEstiloHTML(fams, pares){
  const nomes = fams.map(f => `<b style="color:${PAR_FAMS[f].cor}">${PAR_FAMS[f].nome}</b>`).join(' + ');
  return `<div class="par-fams-t">Famílias: ${nomes}${fams.length === 4 ? ' — as quatro juntas' : ''}</div>` + pares.map(pf => `<div class="par-fams-i"><i>${pf.split('+').map(f => PAR_FAMS[f].nome).join(' + ')}:</i> ${PAR_ESTILO[pf]}</div>`).join('');
}
function buildParagrafos(){
  const wrap = document.getElementById('paragrafosWrap'); if(!wrap) return;
  const todos = parMontados(), dim = parFiltro.dim;
  /* valores da dimensão, na ordem natural de cada uma */
  let vals = [];
  if(dim === 'r') vals = Object.keys(PAR_RAC);
  else if(dim === 'o') vals = ['coord', 'subst', 'adj', 'adv'].flatMap(f => O2_TIPOS.filter(t => parFam(t.k) === f).map(t => t.k));     /* agrupado por família */
  else if(dim === 'f'){ todos.forEach(x => { const v = parFamilias(x).join('+'); if(!vals.includes(v)) vals.push(v); }); vals.sort((a, b) => a.split('+').length - b.split('+').length || a.localeCompare(b)); }
  else if(dim === 't') ['past', 'present', 'future'].forEach(t => ['simples', 'continuo', 'perfeito', 'perfeito_continuo'].forEach(a => vals.push(t + '_' + a)));
  else todos.forEach(x => { if(!vals.includes(x.P.tema)) vals.push(x.P.tema); });
  const conta = v => todos.filter(x => parValores(x, dim).includes(v)).length;
  vals = vals.filter(v => conta(v) > 0);
  if(parFiltro.val !== null && !vals.includes(parFiltro.val)) parFiltro.val = null;
  if(dim !== 'o' || parFiltro.val === null) parFiltro.val2 = null;
  /* v126: no modo "Tipo de oração", um segundo tipo pode ser somado: mostra só os parágrafos que COMBINAM os dois */
  const com2 = dim === 'o' && parFiltro.val !== null ? vals.filter(v => v !== parFiltro.val).map(v => ({ v, n:todos.filter(x => { const l = parValores(x, 'o'); return l.includes(parFiltro.val) && l.includes(v); }).length })) : [];
  if(parFiltro.val2 && !com2.some(c => c.v === parFiltro.val2 && c.n)) parFiltro.val2 = null;
  const vis = todos.filter(x => (parFiltro.val === null || parValores(x, dim).includes(parFiltro.val)) && (!parFiltro.val2 || parValores(x, 'o').includes(parFiltro.val2)) && (!parFiltro.nivel || x.P.nivel === parFiltro.nivel));
  /* cobertura: quantos pares de tipos (do total possível) e de famílias (de 10) já têm parágrafo */
  const paresT = new Set(), paresF = new Set();
  todos.forEach(x => { const l = parValores(x, 'o').slice().sort(); l.forEach((a, i) => l.slice(i + 1).forEach(b => paresT.add(a + '+' + b))); parParesDe(x.fr).forEach(pf => paresF.add(pf)); });
  const corFam = k => PAR_FAMS[parFam(k)].cor;
  const pill = (txt, on, attr) => `<button type="button" class="pronome-pill par-f" data-active="${on}" ${attr}>${txt}</button>`;
  let h = `<div class="par-legenda">Cores: <b style="color:${ADJ_COLOR.quando}">quando</b> · <b style="color:${ADJ_COLOR.como}">como</b> · <b style="color:${ADJ_COLOR.onde}">onde</b> · <b style="color:${ADJ_COLOR.regencia}">colocação</b> · <b style="color:${ADJ_COLOR.conj}">conjunção</b></div>
    <div class="ref-class-label">Percorrer por</div>
    <div class="pronome-row par-filtros">${PAR_DIMS.map(d => pill(d.nome, dim === d.k, `data-dim="${d.k}"`)).join('')}</div>
    <div class="pronome-row par-filtros par-vals">${pill('Todos ' + todos.length, parFiltro.val === null, 'data-val=""')}${vals.map(v => pill(escapeHTML(parRotulo(dim, v)) + ' ' + conta(v), parFiltro.val === v, `data-val="${v}"` + (dim === 'o' ? ` style="border-left:3px solid ${corFam(v)}"` : ''))).join('')}</div>
    ${dim === 'r' && parFiltro.val ? `<div class="par-rac-d">${PAR_RAC[parFiltro.val].d}</div>` : ''}
    ${dim === 'o' ? `<div class="par-legenda">Famílias: ${Object.keys(PAR_FAMS).map(f => `<b style="color:${PAR_FAMS[f].cor}">${PAR_FAMS[f].nome}</b>`).join(' · ')}</div>` : ''}
    ${dim === 'o' && parFiltro.val ? `<div class="par-rac-d"><b>${escapeHTML(parRotulo('o', parFiltro.val))}</b>: ${PAR_PAPEL[parFiltro.val]}.</div>
      <div class="ref-class-label">Combinar com</div>
      <div class="pronome-row par-filtros">${pill('qualquer', !parFiltro.val2, 'data-val2=""')}${com2.map(c => `<button type="button" class="pronome-pill par-f" data-active="${parFiltro.val2 === c.v}" data-val2="${c.v}" style="border-left:3px solid ${corFam(c.v)}"${c.n ? '' : ' disabled'}>${escapeHTML(parRotulo('o', c.v))} ${c.n}</button>`).join('')}</div>` : ''}
    ${dim === 'f' && parFiltro.val ? `<div class="par-rac-d">${parParesFam(parFiltro.val.split('+')).map(pf => PAR_ESTILO[pf]).join(' ')}</div>` : ''}
    ${dim === 'f' || dim === 'o' ? `<div class="par-cob">Cobertura do acervo: <b>${paresT.size}</b> de ${O2_TIPOS.length * (O2_TIPOS.length - 1) / 2} combinações de dois tipos · <b>${paresF.size}</b> de 10 combinações de famílias</div>` : ''}
    <div class="ref-class-label">Nível</div>
    <div class="pronome-row par-filtros">${pill('Todos', !parFiltro.nivel, 'data-nivel=""')}${[1, 2, 3].map(n => pill(PAR_NIVEL[n], parFiltro.nivel === n, `data-nivel="${n}"`)).join('')}</div>
    <div class="par-conta">${vis.length} parágrafo${vis.length === 1 ? '' : 's'}</div>`;
  if(!vis.length) h += '<div class="matrix-note">Nenhum parágrafo com esses filtros. Troque o tema ou o nível.</div>';
  /* sem valor escolhido na dimensão Raciocínio: agrupa por linha de raciocínio, cada grupo com a sua descrição */
  const ordem = (dim === 'r' && parFiltro.val === null) ? vis.slice().sort((a, b) => Object.keys(PAR_RAC).indexOf(a.P.r) - Object.keys(PAR_RAC).indexOf(b.P.r)) : vis;
  let grupo = null;
  ordem.forEach(({ P, fr }) => {
    if(dim === 'r' && parFiltro.val === null && P.r !== grupo){ grupo = P.r; h += `<div class="par-grupo"><b>${PAR_RAC[grupo].ic} ${PAR_RAC[grupo].nome}</b><span>${PAR_RAC[grupo].d}</span></div>`; }
    const i = PARAGRAFOS.indexOf(P), aberto = parAbertos.has(P.id);
    const en = fr.map((r, j) => `<span class="par-s" data-n="${j + 1}">${r.html}</span>`).join(' ');
    const texto = fr.map(r => r.texto).join(' '), pt = fr.map(r => r.pt).join(' ');
    h += `<div class="anat-card par-card" data-par="${i}">
      <h4>${PAR_TEMA_IC[P.tema] || ''} ${escapeHTML(P.titulo)}<span class="anat-usar">${PAR_NIVEL[P.nivel]}</span></h4>
      <div class="par-ideia">${escapeHTML(P.ideia)}</div>
      <div class="par-rac-tag">${PAR_RAC[P.r].ic} ${PAR_RAC[P.r].nome} · <span>${parAssinatura(fr, true)}</span></div>
      <div class="anat-frase-row">
        <div class="anat-frase par-en">${en}</div>
        <button class="audio-btn sm" data-text="${escapeHTML(texto)}" title="Ouvir o parágrafo">🔊</button>
      </div>
      <div class="anat-pt par-pt">${escapeHTML(pt)}</div>
      <button type="button" class="par-ver" data-par="${i}" aria-expanded="${aberto}">${aberto ? '▴ Ocultar explicação' : '🔎 Ver explicação'}</button>
      ${aberto ? `<div class="par-nota">
        <div class="par-eixos">
          <div class="par-eixo"><b>🔤 Por que estes verbos</b><span>${P.n.v}</span></div>
          <div class="par-eixo"><b>⏱ Por que este tempo e aspecto</b><span>${P.n.t || parAutoT(P, fr)}</span></div>
          <div class="par-eixo"><b>🧩 Por que estes encaixes</b><span>${P.n.e || parAutoE(P, fr)}</span></div>
          <div class="par-eixo dest"><b>🔗 Por que esta combinação de orações</b><div class="par-assin">${parAssinatura(fr)}</div><span>${P.n.c}</span>
            <div class="par-fams">${parEstiloHTML(parFamilias({ fr }), parParesDe(fr))}</div></div>
        </div>
        <div class="ref-class-label" style="margin:2px 0 8px;">Frase por frase</div>
        ${fr.map((r, j) => `<div class="par-item">
          <div class="par-item-n">${j + 1}</div>
          <div class="par-item-c">
            <div class="anat-frase-row"><div class="anat-frase">${r.html}</div><button class="audio-btn sm" data-text="${escapeHTML(r.texto)}" title="Ouvir a frase">🔊</button></div>
            <div class="anat-pt" style="margin-bottom:6px;">${escapeHTML(r.pt)}</div>
            <div class="par-tags">${parEtiquetas(P.s[j], r)}</div>
            ${r.tipo ? `<div class="par-papel"><b style="color:${PAR_FAMS[parFam(r.tipo.k)].cor}">${PAR_FAMS[parFam(r.tipo.k)].nome}</b> · ${escapeHTML(r.tipo.nome.replace(/\s*\(.*\)$/, '').toLowerCase())}: ${PAR_PAPEL[r.tipo.k]}.<br><span class="par-forma">Estrutura: ${PAR_FORMA[r.tipo.k].replace('{c}', escapeHTML(r.trLabel || r.conj))}</span></div>` : ''}
            <div class="why">${P.s[j].why || ''}</div>
            <button type="button" class="cross-link par-abrir" data-par="${i}" data-s="${j}">⚙️ abrir esta frase no console ↑</button>
          </div></div>`).join('')}
      </div>` : ''}
    </div>`;
  });
  wrap.innerHTML = h;
  wrap.querySelectorAll('.par-f').forEach(b => { b.onclick = () => {
    if('dim' in b.dataset){ parFiltro.dim = b.dataset.dim; parFiltro.val = null; }
    else if('val2' in b.dataset) parFiltro.val2 = b.dataset.val2 || null;
    else if('val' in b.dataset){ parFiltro.val = b.dataset.val || null; parFiltro.val2 = null; }
    else parFiltro.nivel = b.dataset.nivel ? +b.dataset.nivel : null;
    buildParagrafos(); }; });
  wrap.querySelectorAll('.par-ver').forEach(b => { b.onclick = () => {
    const id = PARAGRAFOS[+b.dataset.par].id; if(parAbertos.has(id)) parAbertos.delete(id); else parAbertos.add(id);
    buildParagrafos(); }; });
  wrap.querySelectorAll('.par-abrir').forEach(b => { b.onclick = () => parAbrir(+b.dataset.par, +b.dataset.s); });
}
/* leva a frase ao console de tempos: o aluno pode mexer nas peças e ver o que muda */
function parAbrir(pi, si){
  const r = parMontados()[pi].fr[si]; if(!r) return;
  Object.assign(state, { categoria:'fact', whWord:null, signalSplit:null }, r.st, { o2:r.st.o2 ? JSON.parse(JSON.stringify(r.st.o2)) : state.o2 });
  if(!r.st.o2 && state.o2) state.o2.tipo = null;         /* frase sem 2ª oração: desliga a que estiver no console */
  const v = verbById(state.verbo); state.verboLetter = verbGroupOf(v);
  render();
  const alvo = document.getElementById('console-tempos'); if(alvo) alvo.scrollIntoView({ behavior:'smooth' });
}

/* ================= v134: GRAMÁTICA DAS ORAÇÕES =================
   Seção conceitual: o que é uma oração, como ligar ideias (coordenar × subordinar), a árvore dos tipos (incluindo as reduzidas), para que serve
   cada um, onde aparece no dia a dia e como combinar. Complementa o catálogo técnico de "Orações compostas" (fórmulas,
   restrições, verbos) e o acervo de "Parágrafos": aqui o foco é entender, imaginar usos e treinar o reconhecimento.
   Regra do app mantida: NENHUMA frase em inglês é digitada à mão. Todos os exemplos vêm do motor, por referência
   "id#n" a uma frase do acervo de Parágrafos (assim ficam sempre iguais ao que o console gera). Só os textos de
   explicação, em português, são autorais. */
const GRAM_FAM = {
  coord:{ ic:'🔗', nome:'Orações coordenadas', lema:'ideias de mesmo peso, lado a lado',
    o:`Ligam orações <b>independentes</b>: cada uma tem sentido sozinha e nenhuma manda na outra. A conjunção é só o fio entre elas.`,
    teste:`<b>Teste do ponto final.</b> Troque a conjunção por um ponto. Se as duas metades continuam sendo frases completas, é coordenação.`,
    quando:`Quando as ideias têm o mesmo peso e você quer ritmo, sequência ou contraste direto.`,
    estilo:`Estilo direto: frases em linha reta, fáceis de seguir. É o jeito natural de falar e de relatar.` },
  subst:{ ic:'🧱', nome:'Orações subordinadas substantivas', lema:'a ideia inteira no lugar de um substantivo',
    o:`A oração <b>ocupa o lugar de um substantivo</b>: faz papel de sujeito, objeto, predicativo ou complemento de outra palavra. É a ideia inteira que se pensa, sabe, diz ou afirma.`,
    teste:`<b>Teste do "isso".</b> Troque a oração por <i>it / this / that</i>. Se a frase continua funcionando ("She knows <i>it</i>"), é substantiva.`,
    quando:`Quando o conteúdo de uma opinião, de uma dúvida, de um fato ou de uma tese é uma oração inteira.`,
    estilo:`Estilo de ideias: opiniões, análises e relatos de pensamento. Dá profundidade e é a base do texto argumentativo.` },
  adj:{ ic:'🏷️', nome:'Orações subordinadas adjetivas (relativas)', lema:'descrevem ou identificam um substantivo',
    o:`A oração <b>descreve ou identifica um substantivo</b>, como um adjetivo faria: responde "qual?" ou "que tipo de?". Entra por um pronome relativo (<i>who, which, that, whose, where, when</i>).`,
    teste:`<b>Teste do adjetivo.</b> Dá para trocar a oração por um adjetivo? ("the developer we needed" ≈ "the needed developer").`,
    quando:`Quando você quer especificar ou acrescentar informação sobre uma pessoa ou coisa sem abrir outra frase.`,
    estilo:`Estilo de precisão: frases compactas, com o detalhe carregado dentro do substantivo.` },
  adv:{ ic:'🧭', nome:'Orações subordinadas adverbiais', lema:'dão a circunstância da ação principal',
    o:`A oração <b>faz papel de advérbio</b>: dá a circunstância da ação principal (por quê, quando, para quê, em que condição, apesar de quê, comparado a quê). É o maior grupo.`,
    teste:`<b>Teste da circunstância.</b> Ela responde <i>por quê? quando? para quê? se? apesar de quê?</i> e pode mudar para o começo da frase.`,
    quando:`Quando você quer dar contexto ao que diz: justificar, situar no tempo, impor condição, admitir um obstáculo.`,
    estilo:`Estilo circunstanciado: motivo, tempo, condição e ressalva tornam o texto explicativo e elegante.` },
  /* v135: as reduzidas não são uma quinta família (cada uma faz papel de substantivo, adjetivo ou advérbio): é um FILTRO transversal */
  red:{ ic:'✂️', nome:'Orações reduzidas', lema:'o mesmo sentido com menos palavras',
    o:`Têm o verbo numa <b>forma nominal</b> (<i>-ing</i>, particípio ou <i>to</i> + verbo) e, em geral, <b>não têm sujeito próprio nem conjugação</b>. Continuam sendo orações e continuam tendo função: adverbial, substantiva ou adjetiva.`,
    teste:`<b>Teste da expansão.</b> Dá para "desenrolar" a oração, devolvendo um sujeito e um verbo conjugado, sem mudar o sentido? Então ela é reduzida.`,
    quando:`Quando o sujeito é o mesmo da principal (ou o substantivo descrito já está na frase) e você quer a ideia mais curta e natural.`,
    estilo:`Estilo enxuto: frases curtas e fluidas, típicas do inglês escrito e falado do dia a dia.` }
};
/* ordem de exibição (por família) */
const GRAM_ORDEM = ['adit', 'adv', 'alt', 'expl', 'cons', 'subj', 'pred', 'obj', 'oq', 'oi', 'cn', 'ap', 'rinf', 'rel', 'relx', 'rrel', 'caus', 'temp', 'cond', 'conc', 'final', 'cmp', 'conf', 'prop', 'csq', 'rger', 'rpart'];
/* v135: contagens calculadas (nada de número fixo no texto) */
const gramN = f => GRAM_ORDEM.filter(k => parFam(k) === f).length;
const gramNRed = () => GRAM_ORDEM.filter(k => GRAM_TIPOS[k].red).length;
/* freq: 1–3 = quanto aparece na fala e na escrita comuns (estimativa didática, não contagem de corpus)
   reg: registro típico · onde: situações em que mais aparece · ex: frases do acervo (id#n) */
const GRAM_TIPOS = {
  adit:{ ic:'➕', nome:'Aditiva', freq:3, reg:'neutro', onde:['🗣️ conversa', '📖 narrativa', '💼 relato de rotina'],
    o:`Soma duas ideias de mesmo peso: uma não depende da outra, e cada uma tem o seu sujeito e o seu verbo.`,
    q:`Use para acumular informações, narrar uma sequência (<i>and then</i>) ou mostrar que duas coisas valem juntas.`,
    pense:`Faça o teste do ponto final: troque o <i>and</i> por um ponto e as duas metades continuam frases completas. Quando o sujeito é o mesmo, dá para cortar o segundo (<i>She studies and reviews</i>).`,
    atencao:`Em orações curtas dispensa vírgula; em orações longas a vírgula ajuda. Mantenha os tempos paralelos: <i>She studied and works</i> soa errado.`,
    hoje:`Conte a sua manhã em três ações ligadas por <i>and</i> e <i>and then</i>: acordar, treinar, começar a trabalhar.`,
    ex:['k5#4', 'k1#2', 'm1#3'] },
  adv:{ ic:'↔️', nome:'Adversativa', freq:3, reg:'neutro', onde:['🗣️ conversa', '💼 feedback', '🧭 argumentação'],
    o:`Contrapõe duas ideias: a segunda quebra a expectativa criada pela primeira.`,
    q:`Use para marcar um contraste, uma ressalva ou uma surpresa: "faz X, mas não faz Y".`,
    pense:`<i>But</i> é o contraste do dia a dia. <i>Yet</i> acrescenta surpresa ("e ainda assim"). <i>Whereas</i> e <i>while</i> comparam dois fatos lado a lado, sem surpresa.`,
    atencao:`<i>However</i> não liga duas orações só com vírgula: ponha ponto final ou ponto e vírgula antes (<i>…; however, …</i>). E nunca use <i>but</i> junto com <i>although</i> (<i>Although… but…</i> ✗).`,
    hoje:`Dê um feedback equilibrado a três pessoas do seu dia: "gostei do X, mas faltou Y".`,
    ex:['con3#1', 'fin2#1', 'via2#1'] },
  alt:{ ic:'🔀', nome:'Alternativa', freq:2, reg:'neutro', onde:['🗣️ planos', '🤝 negociação', '📅 agenda'],
    o:`Apresenta alternativas: só uma das ideias vai acontecer, ou escolher uma exclui a outra.`,
    q:`Use para propor opções, deixar uma decisão em aberto ou avisar de uma consequência ("ou… ou").`,
    pense:`<i>Or</i> abre opções. <i>Either… or</i> reforça que são só duas. <i>Neither… nor</i> nega as duas. <i>Otherwise</i> funciona como "senão": a segunda oração é o preço de não fazer a primeira.`,
    atencao:`Em <i>either… or</i> e <i>neither… nor</i>, o verbo concorda com o sujeito mais próximo (<i>Neither he nor I know</i>).`,
    hoje:`Ofereça duas opções a alguém ("almoçamos agora ou esperamos a reunião") e dê o aviso com <i>otherwise</i>.`,
    ex:['m11#1', 'k1#4', 'm2#2'] },
  expl:{ ic:'📝', nome:'Explicativa', freq:1, reg:'formal', onde:['📰 texto escrito', '🎓 acadêmico', '✍️ narração'],
    o:`Dá a justificativa do que acabou de ser dito. É coordenada porque a explicação vem depois, solta, sem se encaixar na principal.`,
    q:`Use para justificar uma afirmação sem fazer da razão o centro da frase. Soa cuidado e escrito.`,
    pense:`No dia a dia, <i>because</i> faz o mesmo trabalho e é muito mais comum. <i>For</i> como conjunção é de escrita cuidada e vem sempre depois de vírgula.`,
    atencao:`<i>For</i> só explica depois: nunca abre a frase (<i>For he wants to learn, she studies</i> ✗). Na fala, prefira <i>because</i>.`,
    hoje:`Reescreva três frases suas com <i>because</i> e depois com <i>, for</i>, e sinta a diferença de registro.`,
    ex:['exp1#1', 'exp4#1', 'exp3#1'] },
  cons:{ ic:'➡️', nome:'Conclusiva', freq:3, reg:'neutro', onde:['🗣️ conversa', '📊 relatório', '💼 e-mail'],
    o:`Tira a consequência ou a conclusão da ideia anterior.`,
    q:`Use quando o segundo fato é resultado do primeiro: "fez X, então Y".`,
    pense:`<i>So</i> é o "então" da conversa. <i>Therefore</i>, <i>thus</i> e <i>hence</i> são formais. <i>Which is why</i> põe o resultado em destaque ("e é por isso que").`,
    atencao:`Na escrita formal, <i>therefore</i> vem depois de ponto ou ponto e vírgula (<i>…; therefore, …</i>). O <i>so</i> liga com vírgula, mas é informal para texto acadêmico.`,
    hoje:`Termine o relato do seu dia com <i>so</i>: o que aconteceu e o que você fez por causa disso.`,
    ex:['exp4#3', 'exp3#2', 'trab2#3'] },
  subj:{ ic:'🔎', nome:'Subjetiva', freq:2, reg:'neutro', onde:['💼 reuniões', '📊 relatórios', '🧭 argumentação'],
    o:`A oração faz o papel de sujeito. Em inglês quase sempre entra por <i>It is + adjetivo + that / to</i>: o <i>it</i> segura o lugar e a ideia vem depois.`,
    q:`Use para apresentar uma ideia como fato, princípio ou avaliação, sem dizer quem pensa isso: "é importante que…".`,
    pense:`Troque a oração por "isso": <i>It is important to plan</i> = "planejar é importante". O <i>it</i> é só um lugar reservado; o assunto de verdade vem no fim.`,
    atencao:`O <i>it</i> é obrigatório: <i>Is important to plan</i> ✗. Em português o sujeito pode sumir; em inglês, não.`,
    hoje:`Dê uma opinião sobre algo do seu trabalho começando com <i>It is important / clear / true…</i>.`,
    ex:['m7#1', 'm17#1', 'm8#4'] },
  pred:{ ic:'📌', nome:'Predicativa', freq:2, reg:'neutro', onde:['💼 reuniões', '🗣️ conversa', '📊 diagnóstico'],
    o:`A oração é o predicativo: depois de <i>be</i>, ela diz o que o sujeito (um substantivo como <i>the problem, the truth, the point</i>) é.`,
    q:`Use para nomear o problema, a verdade ou o ponto central antes de explicar: "o problema é que…".`,
    pense:`Fórmula de três peças: <i>The (problem / truth / point / reason) is that</i> + oração completa. Ela anuncia e depois revela.`,
    atencao:`A oração depois de <i>is that</i> precisa de sujeito próprio: <i>The problem is never sleeps</i> ✗. Na fala o <i>that</i> pode cair.`,
    hoje:`Apresente o próximo problema do seu dia com <i>The problem is that…</i> e a solução com <i>The point is that…</i>.`,
    ex:['arg1#1', 'k7#1', 'k3#1'] },
  obj:{ ic:'💭', nome:'Objetiva direta', freq:3, reg:'neutro', onde:['🗣️ conversa', '📰 notícias', '💼 relatos'],
    o:`A oração é o objeto direto de verbos de pensar, saber, dizer e sentir: ela diz o <b>conteúdo</b> do que se pensa ou se afirma.`,
    q:`Use para relatar opinião, informação ou dúvida: <i>I think…, She says…, He asks whether…</i>.`,
    pense:`Troque a oração por "isso": <i>She knows that…</i> = "ela sabe isso". Para sim ou não use <i>if / whether</i>; para "quem, quando, como" use a palavra interrogativa, mas com ordem de frase afirmativa.`,
    atencao:`A pergunta indireta mantém a ordem de afirmação e não leva interrogação: <i>She asks whether the test is difficult</i>. Na fala o <i>that</i> some: <i>I think it is risky</i>.`,
    hoje:`Relate algo que alguém disse hoje com <i>She said (that)…</i> e algo que você ainda não sabe com <i>I wonder whether…</i>.`,
    ex:['m12#1', 'k9#2', 'm13#1'] },
  oq:{ ic:'🔍', nome:'Pergunta indireta', freq:3, reg:'neutro', onde:['🗣️ conversa', '💼 reuniões', '📞 atendimento'],
    o:`A pergunta passa a ser o objeto de um verbo de saber, perguntar ou explicar: <i>I don't know where she lives</i>, <i>Do you know which one she prefers?</i>`,
    q:`Use para pedir ou dar informação com educação, ou para dizer o que você não sabe: "não sei qual ela prefere".`,
    pense:`Dentro da pergunta a ordem é de afirmativa: <i>where she lives</i>. Não entram <i>do / does / did</i>.`,
    atencao:`Nunca <i>where does she live</i> depois de <i>I don't know</i> ✗. Só a principal inverte quando é pergunta: <i>Do you know where she lives?</i>`,
    hoje:`Troque cinco perguntas diretas por indiretas: <i>Where does she live?</i> → <i>Do you know where she lives?</i>`,
    ex:['oq1#1', 'oq2#1', 'oq3#1'] },
  oi:{ ic:'🧷', nome:'Objetiva indireta', freq:2, reg:'neutro', onde:['🗣️ conversa', '💼 reuniões', '🎓 debate'],
    o:`A oração vem depois de verbo + preposição (<i>talk about, depend on, insist on, think about</i>). Funciona como objeto preposicionado.`,
    q:`Use para falar sobre um assunto que é uma ideia inteira: "falamos sobre como é difícil".`,
    pense:`Depois de preposição não entra <i>that</i>. Use <i>how / whether / what / why</i> ou o verbo em <i>-ing</i>: <i>insist on understanding</i>, <i>talk about how tight it is</i>.`,
    atencao:`Nunca use <i>that</i> depois de preposição (<i>We talk about that it is hard</i> ✗). Troque por <i>how</i>, <i>whether</i> ou <i>-ing</i>.`,
    hoje:`Descreva uma conversa recente com <i>We talked about how / whether…</i>.`,
    ex:['m4#1', 'm12#2', 'm9#1'] },
  cn:{ ic:'🗞️', nome:'Completiva nominal', freq:1, reg:'formal', onde:['🎓 escrita', '📰 notícias', '🧭 argumentação'],
    o:`A oração completa um substantivo abstrato (<i>fact, idea, belief, possibility, news, rumor</i>): diz <b>qual</b> é o fato, a ideia, a crença.`,
    q:`Use para dar conteúdo a conceitos: "o fato de que…", "a possibilidade de que…", "a crença de que…".`,
    pense:`O português pede preposição depois do substantivo ("a ideia <b>de</b> que"). O inglês não: <i>the idea that</i>. O erro mais comum é <i>the idea of that</i>.`,
    atencao:`Não confunda com relativa: em <i>the fact that it is hard</i> a oração é completa e o <i>that</i> não some. Em <i>the book (that) she needs</i> falta o objeto, e o <i>that</i> pode sumir.`,
    hoje:`Abra uma opinião com <i>the fact that…</i> ou <i>the possibility that…</i> para falar de algo que incomoda.`,
    ex:['m10#1', 'm2#1', 'k17#1'] },
  ap:{ ic:'✒️', nome:'Apositiva', freq:1, reg:'formal', onde:['✍️ escrita', '🎤 apresentações', '🧭 discursos'],
    o:`A oração explica o substantivo que vem antes dela e entra depois de dois-pontos.`,
    q:`Use para anunciar e revelar: "uma meta: aprender", "um fato: ele saiu". Dá ritmo e ênfase.`,
    pense:`Dois tempos: primeiro o substantivo (<i>one goal, one fact</i>), uma pausa (os dois-pontos) e depois a revelação. Metas e intenções pedem <i>to</i> + verbo; fatos e ideias pedem <i>that</i> + oração.`,
    atencao:`Não misture: <i>one goal: that she…</i> soa estranho; meta pede <i>to</i> (<i>one goal: to earn more</i>), fato pede <i>that</i>.`,
    hoje:`Apresente a sua meta da semana: <i>I have one goal: to…</i>.`,
    ex:['m5#1', 'm13#3', 'k4#1'] },
  rel:{ ic:'🏷️', nome:'Adjetiva restritiva', freq:3, reg:'neutro', onde:['🗣️ conversa', '💼 trabalho', '📖 qualquer texto'],
    o:`A oração descreve um substantivo e o <b>identifica</b>: responde "qual?". Sem ela, a frase perde o sentido.`,
    q:`Use para especificar de quem ou de que você fala: "o desenvolvedor <i>de que precisávamos</i>".`,
    pense:`Sem vírgula, sempre. <i>Who</i> para pessoas, <i>which / that</i> para coisas, <i>whose</i> para posse. Quando o pronome é objeto da oração, ele pode sumir: <i>the developer we needed</i>.`,
    atencao:`Não repita o objeto: <i>the book that she needs it</i> ✗. O pronome relativo já ocupa o lugar do objeto.`,
    hoje:`Descreva três coisas do seu dia com <i>the … (that) I …</i>: o café que bebi, o livro que li, o cliente de quem falei.`,
    ex:['m1#1', 'k3#2', 'k14#2'] },
  relx:{ ic:'💬', nome:'Adjetiva explicativa', freq:2, reg:'formal', onde:['📰 notícias', '✍️ escrita', '🎓 acadêmico'],
    o:`A oração acrescenta uma informação <b>extra</b> sobre algo que já está identificado. Vem entre vírgulas e poderia ser apagada.`,
    q:`Use para comentar de passagem: dar um dado, uma opinião ou um detalhe sem restringir de quem você fala.`,
    pense:`Vírgulas são parênteses. Apague a oração: se a frase continua identificando o mesmo substantivo, ela é explicativa. Aqui nunca entra <i>that</i>: só <i>who, which, whose, where</i>.`,
    atencao:`A vírgula muda o sentido: <i>My brother who lives in Rome</i> (tenho outros irmãos) ≠ <i>My brother, who lives in Rome</i> (só tenho este).`,
    hoje:`Apresente alguém com um comentário extra: <i>My manager, who…</i>.`,
    ex:['k5#1', 'm5#2', 'k11#1'] },
  caus:{ ic:'❓', nome:'Causal', freq:3, reg:'neutro', onde:['🗣️ conversa', '💼 e-mails', '🤝 negociação'],
    o:`Dá o motivo da ação principal: responde "por quê?".`,
    q:`Use para justificar uma decisão, explicar um atraso ou dar crédito a quem merece.`,
    pense:`<i>Because</i> põe o motivo em destaque (resposta a "why?"), geralmente no fim. <i>Since</i> e <i>as</i> apresentam um motivo já conhecido, normalmente no começo e com vírgula. <i>Because of</i> pede substantivo.`,
    atencao:`<i>Because of</i> + substantivo (<i>because of the traffic</i>); <i>because</i> + oração (<i>because there was traffic</i>). Como frase sozinha, <i>Because…</i> só vale em resposta a um "why?".`,
    hoje:`Justifique a sua próxima decisão com <i>because</i> e a seguinte com <i>since</i>; note onde cada um cai bem.`,
    ex:['via1#1', 'k15#3', 'cau1#3'] },
  temp:{ ic:'⏳', nome:'Temporal', freq:3, reg:'neutro', onde:['💼 prazos', '🗣️ planos', '📖 narrativas'],
    o:`Situa a ação no tempo: diz <b>quando</b>, em que ordem ou por quanto tempo.`,
    q:`Use para narrar, combinar prazos e encadear tarefas: "quando chegar, ligo", "assim que terminar, envio".`,
    pense:`Se a ação é futura, a oração de tempo fica no <b>presente</b>: <i>I will call you when I arrive</i>. O <i>will</i> fica só na principal. <i>Before</i> e <i>after</i> ordenam; <i>while</i> mostra ações simultâneas; <i>until</i> marca o limite.`,
    pt:`Em português o verbo vai para o futuro do subjuntivo ("quando eu chegar"); em inglês é presente simples (<i>when I arrive</i>).`,
    atencao:`A armadilha clássica: <i>when I will arrive</i> ✗. E <i>while</i> pede ação em andamento (<i>while she was driving</i>).`,
    hoje:`Combine um prazo de hoje com <i>as soon as</i> e outro com <i>by the time</i>.`,
    ex:['trab2#1', 'est1#3', 'via2#2'] },
  cond:{ ic:'🚦', nome:'Condicional', freq:3, reg:'neutro', onde:['🤝 negociação', '💼 prazos', '🗣️ planos', '🧭 hipóteses'],
    o:`Põe uma condição: a principal só vale se a oração com <i>if</i> (ou equivalente) se cumprir.`,
    q:`Use para prometer, negociar, avisar e imaginar: "se chover, ficamos", "se eu tivesse tempo, faria".`,
    pense:`Quatro graus. (0) fatos: <i>if</i> + presente, presente. (1) realista: <i>if</i> + presente, <i>will</i>. (2) hipotético: <i>if</i> + passado, <i>would</i>. (3) impossível, no passado: <i>if</i> + <i>had</i> + particípio, <i>would have</i>. <i>Unless</i> = "if not"; <i>as long as</i> = "contanto que"; <i>in case</i> = "caso", como precaução.`,
    pt:`O português usa o subjuntivo ("se eu tivesse", "se chover"); o inglês usa tempos do indicativo (<i>if I had</i>, <i>if it rains</i>).`,
    atencao:`Não use <i>will</i> logo depois de <i>if</i> (<i>if it will rain</i> ✗). E <i>in case</i> não é <i>if</i>: <i>Take an umbrella in case it rains</i> = leve por precaução, não "se chover".`,
    hoje:`Faça uma proposta com <i>if</i>, uma ressalva com <i>unless</i> e uma precaução com <i>in case</i>.`,
    ex:['cond1#1', 'cond2#1', 'cond1#2'] },
  conc:{ ic:'🚧', nome:'Concessiva', freq:2, reg:'neutro', onde:['🧭 argumentação', '💼 negociação', '✍️ escrita', '🗣️ conversa'],
    o:`Admite um obstáculo ou um fato contrário, mas mostra que a principal continua valendo: "apesar de ser difícil, ela fez".`,
    q:`Use para reconhecer o ponto contrário antes de rebater, mantendo a sua posição. É o movimento de quem argumenta com elegância.`,
    pense:`<i>Although / though / even though</i> + oração completa. <i>Despite / in spite of</i> + substantivo ou <i>-ing</i>. <i>Even though</i> reforça um fato real; <i>even if</i> imagina uma hipótese. <i>While</i> também pode conceder ("embora").`,
    pt:`O português usa <i>embora</i> + subjuntivo ("embora seja difícil"); o inglês usa o indicativo normal (<i>although it is hard</i>).`,
    atencao:`Não repita a ideia de contraste: <i>Although it is hard, but she studies</i> ✗. E <i>despite of</i> não existe: use <i>despite</i> ou <i>in spite of</i>.`,
    hoje:`Antes de discordar de alguém hoje, reconheça o ponto dele com <i>Although…</i> e só depois dê o seu.`,
    ex:['sau1#4', 'fin1#2', 'con3#2'] },
  final:{ ic:'🎯', nome:'Final', freq:3, reg:'neutro', onde:['💼 e-mails', '🗣️ conversa', '📋 planos'],
    o:`Diz o objetivo da ação principal: responde "para quê?".`,
    q:`Use para explicar intenções, planos e propósitos: "treino para ficar forte".`,
    pense:`Mesmo sujeito: <i>to / in order to / so as to</i> + verbo base. Sujeitos diferentes ou propósito mais formal: <i>so that</i> + oração (geralmente com <i>can, will, could, would</i>). Para negar: <i>in order not to</i> / <i>so as not to</i>.`,
    pt:`O português usa "para" + infinitivo (mesmo sujeito) e "para que" + subjuntivo (sujeitos diferentes).`,
    atencao:`Não use <i>for</i> + verbo para dizer objetivo: <i>I study for pass</i> ✗. Use <i>to pass</i>.`,
    hoje:`Explique três coisas que você faz hoje terminando cada uma com <i>to</i> ou <i>in order to</i>.`,
    ex:['sau2#2', 'com2#1', 'fin2#3'] },
  cmp:{ ic:'⚖️', nome:'Comparativa', freq:2, reg:'neutro', onde:['🗣️ conversa', '💼 avaliação', '📊 análise'],
    o:`Compara duas ações, qualidades ou quantidades: uma mede a outra.`,
    q:`Use para igualar (<i>as… as</i>), superar (<i>more… than</i>) ou ficar abaixo (<i>less… than</i>).`,
    pense:`A segunda parte é uma oração reduzida pelo auxiliar: <i>than he does</i>, <i>as you do</i>. O auxiliar evita repetir o verbo da primeira.`,
    atencao:`<i>As… as</i> pede <i>as</i> nos dois lados (<i>as hard as</i>; <i>as hard than</i> ✗), e <i>than</i> só com comparativo (<i>more… than</i>).`,
    hoje:`Compare o seu ritmo com o de um colega: <i>I work as … as</i> ou <i>more … than</i>.`,
    ex:['prop3#3', 'k10#4', 'k13#3'] },
  conf:{ ic:'📐', nome:'Conformativa', freq:1, reg:'formal', onde:['💼 e-mails', '📋 relatórios', '🤝 contratos'],
    o:`Diz que a ação segue um combinado, um plano ou algo que foi dito: "conforme combinamos".`,
    q:`Use para registrar que algo está de acordo com o planejado e dar segurança a quem lê: "conforme discutimos", "como planejado".`,
    pense:`<i>As</i> + sujeito + verbo (<i>as we agreed</i>). <i>Just as</i> reforça a fidelidade ("exatamente como"). <i>According to</i> pede substantivo (<i>according to the plan</i>).`,
    atencao:`Aqui <i>as</i> não é comparação nem causa: é "conforme". Em texto profissional, prefira <i>as</i> a <i>like</i> + oração, que é informal.`,
    hoje:`Comece o seu próximo e-mail de acompanhamento com <i>As we agreed…</i>.`,
    ex:['arg3#2', 'k13#2', 'm16#1'] },
  prop:{ ic:'📈', nome:'Proporcional', freq:1, reg:'neutro', onde:['🗣️ máximas', '🎓 estudo', '📊 análise'],
    o:`Liga duas ideias que crescem ou diminuem juntas: "quanto mais X, mais Y".`,
    q:`Use para formular regras de proporção, ganhos de esforço e tendências.`,
    pense:`Molde fixo: <i>The more + oração, the more + oração</i>. As duas partes são comparativos; para o inverso, <i>the less</i>.`,
    atencao:`Os dois lados começam com <i>the</i>. O verbo segue o tempo normal: <i>The more I read, the more I learn</i>.`,
    hoje:`Formule a sua regra de vida: <i>The more I…, the more I…</i>.`,
    ex:['prop2#1', 'prop1#1', 'prop3#1'] },
  csq:{ ic:'🎚️', nome:'Consecutiva', freq:2, reg:'neutro', onde:['🗣️ conversa', '📖 narrativa', '🧭 ênfase'],
    o:`Mede a intensidade pelo resultado: a ação é tão forte que produz um efeito.`,
    q:`Use para mostrar causa e efeito com ênfase: "trabalha tanto que…".`,
    pense:`<i>So</i> + adjetivo ou advérbio + <i>that</i> + oração. Com substantivo: <i>such a</i> (+ adjetivo) + substantivo + <i>that</i>.`,
    atencao:`Não é o <i>so</i> conclusivo: lá ele liga duas orações (<i>…, so she…</i>); aqui vem antes do adjetivo ou advérbio. O <i>that</i> pode sumir na fala.`,
    hoje:`Exagere de propósito: <i>I was so tired that…</i>.`,
    ex:['sau2#4', 'prop2#2', 'k12#3'] },
  rger:{ ic:'🏃', nome:'Reduzida de gerúndio', red:true, freq:3, reg:'neutro', onde:['🗣️ conversa', '💼 e-mails', '📖 narrativa'],
    o:`Adverbial <b>sem sujeito próprio e sem verbo conjugado</b>: o verbo vira <i>-ing</i> e herda o sujeito da principal. Diz quando, como ou de que jeito a ação principal acontece.`,
    q:`Use para encurtar "depois que eu resolvi", "enquanto ela trabalha", "sem que ele perceba", desde que o sujeito seja o mesmo nas duas partes.`,
    pense:`Mantenha a palavra de ligação (<i>after, before, while, by, without, upon</i>) e troque "sujeito + verbo conjugado" por verbo + <i>-ing</i>. Depois de preposição, o inglês pede sempre <i>-ing</i>, nunca o infinitivo.`,
    pt:`Em português é o gerúndio ("resolvendo") ou o infinitivo com preposição ("depois de resolver", "sem perguntar"). O inglês não usa o infinitivo depois dessas palavras.`,
    atencao:`O sujeito oculto é o da principal. Se a ação for de outro sujeito, a frase fica torta (o "dangling modifier": "Andando para casa, a chuva começou"). Nesse caso volte à forma desenvolvida. Para negar, ponha <i>not</i> antes do <i>-ing</i>.`,
    hoje:`Pegue três frases suas do tipo "depois que eu… eu…" e reescreva com <i>After</i> + <i>-ing</i>.`,
    ex:['red1#1', 'red1#2', 'red2#3'] },
  rpart:{ ic:'✅', nome:'Reduzida de particípio', red:true, freq:2, reg:'neutro', onde:['💼 e-mails', '📋 instruções', '🎓 escrita'],
    o:`Adverbial que perde o sujeito e o verbo <i>be</i> e fica só com o <b>particípio</b> (ou adjetivo) depois da conjunção. Tem sentido passivo ou de estado.`,
    q:`Use para encurtar condição, momento e concessão em textos de trabalho e instruções: "se necessário", "quando solicitado", "embora cansada".`,
    pense:`Desenvolvida: conjunção + sujeito + <i>be</i> + particípio. Reduzida: conjunção + particípio. Corte o sujeito e o <i>be</i> juntos, e mantenha a conjunção.`,
    pt:`Equivale a "se necessário", "quando solicitado", "embora cansada": o português também omite o verbo de ligação.`,
    atencao:`Quem é o "solicitado"? O sujeito da principal. Se o sujeito oculto não for o mesmo, a frase quebra. E sem a conjunção o particípio solto vira outra estrutura.`,
    hoje:`Reescreva "if it is necessary", "when it is asked" e "although I am tired" sem o sujeito e sem o <i>be</i>.`,
    ex:['red2#1', 'red2#2', 'red3#3'] },
  rinf:{ ic:'🎯', nome:'Reduzida de infinitivo / -ing (objeto)', red:true, freq:3, reg:'neutro', onde:['🗣️ conversa', '💼 metas e planos', '🎓 estudo'],
    o:`Substantiva objetiva direta sem <i>that</i> e sem sujeito próprio: a ideia desejada, planejada, evitada ou apreciada vem como <b>to + verbo</b> ou <b>verbo-<i>ing</i></b>, no papel de objeto do verbo principal.`,
    q:`Use para dizer o que se quer, decide, planeja, evita, termina ou aprende a fazer. Com o mesmo sujeito, é a forma natural do inglês.`,
    pense:`O verbo principal escolhe a forma. Grupo do <i>to</i>: want, need, decide, plan, hope, learn, agree. Grupo do <i>-ing</i>: enjoy, avoid, finish, stop, consider, suggest. Aceitam os dois: like, love, start, begin, continue.`,
    pt:`Em português costuma ser o infinitivo, muitas vezes com preposição: "planejam cumprir", "gostam <i>de</i> mostrar", "aprendem <i>a</i> evitar". A preposição some em inglês.`,
    atencao:`A escolha entre <i>to</i> e <i>-ing</i> não é livre: depende do verbo principal e, em alguns, muda o sentido. Se o sujeito da ação for outro, não dá para reduzir assim; volte a <i>that</i> ou use objeto + <i>to</i>.`,
    hoje:`Diga três coisas que você quer fazer (verbos do grupo <i>to</i>) e três de que gosta ou que evita (grupo <i>-ing</i>).`,
    ex:['red1#3', 'red3#1', 'red4#4'] },
  rrel:{ ic:'🧩', nome:'Adjetiva reduzida', red:true, freq:2, reg:'neutro', onde:['📋 relatórios', '📰 notícias', '💼 descrições de perfil'],
    o:`Relativa sem pronome relativo (e sem <i>be</i>): descreve o substantivo e vem logo depois dele, como um adjetivo comprido.`,
    q:`Use para dar a informação sem abrir outra oração: <b>-ing</b> para ação em curso ou hábito, <b>-ed</b> para sentido passivo, <b>to</b> para finalidade, necessidade ou "o que fazer".`,
    pense:`Se o relativo era o sujeito da relativa, tire o pronome e o <i>be</i>: ativo vira <i>-ing</i>, passivo vira particípio. <i>To</i> + verbo substitui "que se deve / em quem se pode…".`,
    pt:`O português faz igual com o particípio ("um profissional treinado por especialistas"); no ativo, costuma manter o "que trabalha". Em inglês, o <i>-ing</i> é muito mais usado do que a relativa longa.`,
    atencao:`Só reduz quando o relativo é sujeito. O relativo que é objeto (<i>the report that she wrote</i>) não vira <i>-ing</i>. Com <i>to</i>, não esqueça a preposição solta: <i>a person to talk to</i>.`,
    hoje:`Descreva três pessoas ou coisas do seu dia com particípio ou <i>-ing</i> em vez de "who is / which was".`,
    ex:['red4#1', 'red4#2', 'red4#3'] }
};
/* mapa de intenções: o que eu quero fazer com a segunda ideia → quais orações servem */
const GRAM_INTENTS = [
  ['➕', 'Somar mais uma ideia', ['adit']],
  ['🪜', 'Sequenciar ações (primeiro… depois)', ['adit', 'temp']],
  ['↔️', 'Contrastar ou fazer uma ressalva', ['adv', 'conc']],
  ['🧱', 'Admitir o obstáculo e seguir em frente', ['conc']],
  ['🔀', 'Oferecer opções ou avisar de uma consequência', ['alt']],
  ['❓', 'Dar o motivo', ['caus', 'expl']],
  ['➡️', 'Concluir ou mostrar o efeito', ['cons', 'csq']],
  ['🎯', 'Dizer para quê', ['final']],
  ['🚦', 'Impor ou imaginar uma condição', ['cond']],
  ['⏳', 'Dizer quando ou em que ordem', ['temp']],
  ['⚖️', 'Comparar', ['cmp', 'prop']],
  ['📐', 'Mostrar que segue o combinado', ['conf']],
  ['💭', 'Contar o que alguém pensa, sabe ou disse', ['obj', 'oq', 'oi']],
  ['📌', 'Enunciar a tese ("o problema é…")', ['pred', 'subj']],
  ['🗞️', 'Dar conteúdo a um conceito (fato, ideia, crença)', ['cn', 'ap']],
  ['🏷️', 'Identificar de quem ou de que falo', ['rel']],
  ['💬', 'Acrescentar um comentário de passagem', ['relx']],
  ['🎚️', 'Dar ênfase à intensidade', ['csq']],
  ['✂️', 'Dizer o mesmo com menos palavras', ['rger', 'rpart', 'rinf', 'rrel', 'final']],
  ['🎯', 'Dizer o que se quer, planeja ou evita fazer', ['rinf', 'obj']],
  ['🧩', 'Descrever uma pessoa ou coisa em poucas palavras', ['rrel', 'rel']]
];
/* kits por situação: que orações mais rendem em cada contexto, e como */
const GRAM_KITS = [
  { ic:'🗣️', nome:'Conversa do dia a dia', d:'Frases curtas, ritmo de fala, justificativas na hora.', it:[
    ['adit', 'narra a rotina em linha reta: <i>and</i>, <i>and then</i>.'], ['adv', 'dá o "mas" que torna a conversa honesta.'],
    ['caus', '<i>because</i> responde ao "por quê?" na hora.'], ['temp', '<i>when / after / before</i> combinam horários.'],
    ['cond', '<i>if</i> faz convites e planos: "se der, a gente vai".'], ['rel', 'identifica pessoas e coisas ("o cara que…").'],
    ['obj', '<i>I think / she said (that)</i> relata opiniões.'], ['rinf', '<i>I want to…</i>, <i>I enjoy…-ing</i>: o que se quer e do que se gosta.']] },
  { ic:'💼', nome:'Reunião e e-mail profissional', d:'Precisão, polidez e registro do que foi combinado.', it:[
    ['final', 'explica o objetivo: <i>to align</i>, <i>in order to confirm</i>.'], ['conf', '<i>as we agreed</i> registra o combinado.'],
    ['temp', '<i>as soon as / by the time</i> fixam prazos.'], ['cond', '<i>as long as / unless</i> impõem condições com educação.'],
    ['caus', '<i>since / given that</i> justificam sem soar defensivo.'], ['conc', '<i>although</i> reconhece o risco e mantém a proposta.'], ['rpart', '<i>if needed</i>, <i>when asked</i> enxugam o e-mail sem perder a polidez.']] },
  { ic:'🤝', nome:'Negociação', d:'Propostas firmes, limites claros e trocas.', it:[
    ['cond', 'tipo 1 para propostas firmes, tipo 2 para hipóteses; <i>provided that</i> reforça.'], ['conc', '<i>even if</i> sinaliza até onde você vai.'],
    ['alt', '<i>either… or</i> oferece duas saídas controladas; <i>otherwise</i> mostra o preço de recusar.'],
    ['prop', '<i>the more… the less</i> mostra a troca entre as partes.'], ['cons', '<i>so</i> e <i>which is why</i> amarram a conclusão.']] },
  { ic:'📊', nome:'Relatório, análise e diagnóstico', d:'Nomear o achado, tratá-lo como premissa e concluir.', it:[
    ['pred', '<i>The problem is that…</i> nomeia o achado.'], ['cn', '<i>the fact that…</i> trata um dado como premissa.'],
    ['subj', '<i>It is clear that…</i> apresenta a conclusão sem dono.'], ['cmp', 'compara resultados e períodos.'],
    ['relx', 'acrescenta um dado extra entre vírgulas.'], ['cons', '<i>therefore</i> encerra a análise.']] },
  { ic:'🎓', nome:'Estudo e escrita acadêmica', d:'Objeções reconhecidas, conceitos nomeados, relações formuladas.', it:[
    ['conc', 'reconhece a objeção antes da tese.'], ['cn', 'dá nome ao conceito: <i>the idea that…</i>.'],
    ['ap', 'anuncia a tese com dois-pontos: <i>one claim: that…</i>.'], ['relx', 'define termos com comentário extra.'],
    ['prop', 'formula relações: <i>the more… the more…</i>.'], ['expl', '<i>for</i>, em texto formal, justifica depois da afirmação.']] },
  { ic:'🧭', nome:'Argumentar e convencer', d:'Admitir, justificar, imaginar e intensificar.', it:[
    ['conc', 'admite o ponto contrário e rebate.'], ['caus', 'dá a razão da posição.'], ['cond', 'testa a posição com uma hipótese.'],
    ['csq', 'intensifica: "tão grave que…".'], ['pred', 'enuncia o ponto central: <i>The point is that…</i>.'], ['alt', 'monta um dilema: "ou… ou".']] },
  { ic:'📖', nome:'Contar uma história', d:'Ordem dos fatos, viradas e consequências.', it:[
    ['temp', '<i>when / while / before / after</i> ordenam e dão simultaneidade.'], ['adit', '<i>and then</i> encadeia as ações.'],
    ['adv', '<i>but</i> traz a virada.'], ['cons', '<i>so</i> mostra a consequência.'], ['csq', '<i>so… that</i> dramatiza.'],
    ['relx', 'comentário de narrador entre vírgulas.'], ['rger', '<i>while</i> + <i>-ing</i> dá simultaneidade em poucas palavras.']] },
  { ic:'✂️', nome:'Enxugar o que você diz', d:'Orações reduzidas: a mesma ideia, menos palavras.', it:[
    ['rger', '<i>after / before / by / without</i> + <i>-ing</i> encurtam "depois que eu…", "fazendo…", "sem…".'],
    ['rpart', '<i>if needed</i>, <i>when asked</i>, <i>although tired</i>: instruções e e-mails mais enxutos.'],
    ['rinf', 'verbos como <i>want, plan, enjoy, avoid</i> pedem <i>to</i> ou <i>-ing</i> em vez de <i>that</i>.'],
    ['rrel', 'particípio ou <i>-ing</i> no lugar de "who is / which was": descrições curtas.'],
    ['final', '<i>to</i> + verbo (finalidade) também é uma reduzida, e a mais comum do inglês.']] }
];
/* laboratório: parágrafos do acervo em que as 4 famílias aparecem sobre a mesma ideia */
const GRAM_LAB = ['k3', 'k14'];
/* ---- estado e utilitários ---- */
let gramFiltro = 'todas';
/* dois treinos de tipo: o geral e o das reduzidas (v135); cada um com o seu estado e o seu contêiner */
let gramQuiz = { cur:null, feitas:0, certas:0, ultima:null, el:'gramQuiz', red:false };
let gramQuizRed = { cur:null, feitas:0, certas:0, ultima:null, el:'gramQuizRed', red:true };
/* v135: treino "que período é este?" (simples, coordenação, subordinação, misto) */
let gramPer = { cur:null, feitas:0, certas:0, ultima:null };
const GRAM_PER_NOME = { simples:'Período simples', coord:'Composto por coordenação', sub:'Composto por subordinação', misto:'Período misto' };
/* período misto montado pelo motor: uma subordinada (do acervo) + uma coordenada simples, ligadas por ", and" */
function gramPeriodoMisto(v){
  const a = v === 1 ? gramFraseRef('est2#3').r : gramFraseRef('k1#1').r;
  const b = parFrase({ p:v === 1 ? 'We' : 'She', t:'present', a:'simples', v:'study', col:'English' }, 'gramática');
  const semPonto = x => x.replace(/[.]\s*$/, ''), minus = x => x.charAt(0).toLowerCase() + x.slice(1);
  const texto = semPonto(a.texto) + ', and ' + minus(b.texto);
  return { texto, pt:semPonto(a.pt) + ', e ' + minus(b.pt), html:escapeHTML(texto) };
}
function gramPerItens(){
  const sp = (p, t) => parFrase({ p, t, a:'simples', v:'study', col:'English' }, 'gramática'), f = ref => gramFraseRef(ref).r;
  return [ { r:sp('She', 'present'), k:'simples' }, { r:sp('They', 'past'), k:'simples' },
    { r:f('k1#3'), k:'coord' }, { r:f('k5#4'), k:'coord' }, { r:f('con3#1'), k:'coord' },
    { r:f('k1#1'), k:'sub' }, { r:f('est2#3'), k:'sub' }, { r:f('red1#2'), k:'sub', red:true }, { r:f('red4#1'), k:'sub', red:true },
    { r:gramPeriodoMisto(0), k:'misto' }, { r:gramPeriodoMisto(1), k:'misto' } ];
}
function gramPerNova(){
  const pool = gramPerItens(); let x; do { x = pool[Math.floor(Math.random() * pool.length)]; } while(gramPer.ultima && x.r.texto === gramPer.ultima && pool.length > 1);
  gramPer.ultima = x.r.texto; gramPer.cur = { ...x, resp:null }; gramPerDesenha();
}
function gramPerDesenha(){
  const el = document.getElementById('gramPerQuiz'); if(!el) return;
  const q = gramPer.cur; if(!q){ el.innerHTML = ''; return; }
  const expl = { simples:'Há <b>um só verbo</b>: uma oração, um período simples.',
    coord:'Há <b>dois verbos</b> em orações <b>independentes</b>: troque a conjunção por ponto e as duas metades continuam frases. É coordenação.',
    sub:'Há <b>dois verbos</b> e a segunda oração <b>depende</b> da primeira: não vive sozinha. É subordinação.' + (q.red ? ' Repare: o segundo verbo está numa forma nominal (<i>-ing</i>, <i>-ed</i>), mas continua sendo uma oração, <b>reduzida</b>.' : ''),
    misto:'Há <b>três verbos</b>: uma oração depende de outra (subordinação) e há ainda uma ligação entre orações independentes (coordenação). As duas relações na mesma frase: período misto.' }[q.k];
  let h = `<div class="gr-q-placar">Acertos: <b>${gramPer.certas}</b> de ${gramPer.feitas}</div><div class="gr-q-enun">Que <b>período</b> é este?</div>
    <div class="gr-ex"><div class="gr-ex-row"><div class="gr-en">${q.r.html}</div>${btnAud(q.r.texto)}</div><div class="gr-pt">${escapeHTML(q.r.pt)}</div></div>
    <div class="gr-q-ops">${Object.keys(GRAM_PER_NOME).map(k => { const est = q.resp === null ? '' : k === q.k ? 'ok' : k === q.resp ? 'no' : 'dim';
      return `<button type="button" class="gr-q-op" data-k="${k}" data-st="${est}"${q.resp !== null ? ' disabled' : ''}><b>${GRAM_PER_NOME[k]}</b></button>`; }).join('')}</div>`;
  if(q.resp !== null){ const ok = q.resp === q.k;
    h += `<div class="gr-q-fb" data-ok="${ok}"><b>${ok ? '✅ Certo.' : '❌ Quase.'}</b> É um <b>${GRAM_PER_NOME[q.k].toLowerCase()}</b>. ${expl}</div>
      <div class="gr-acts"><button type="button" class="signal-chip" id="gramPerProx">➡️ Próxima frase</button></div>`; }
  el.innerHTML = h;
  el.querySelectorAll('.gr-q-op').forEach(b => b.onclick = () => { if(gramPer.cur.resp !== null) return;
    gramPer.cur.resp = b.dataset.k; gramPer.feitas++; if(b.dataset.k === gramPer.cur.k) gramPer.certas++; gramPerDesenha(); });
  const prox = document.getElementById('gramPerProx'); if(prox) prox.onclick = gramPerNova;
}
const gramNomeCurto = k => GRAM_TIPOS[k].nome;
const gramFamCor = f => (PAR_FAMS[f] || { cor:'var(--brass)' }).cor;
const gramCap = s => s.charAt(0).toUpperCase() + s.slice(1);
const gramPontos = n => '●'.repeat(n) + '○'.repeat(3 - n);
/* frase do acervo por referência "id#n" → { i, j, r (frase montada), P } */
function gramFraseRef(ref){
  const [id, n] = ref.split('#'), i = PARAGRAFOS.findIndex(p => p.id === id), j = +n - 1;
  const m = parMontados()[i]; if(!m || !m.fr[j]){ console.warn('[gramática] frase ausente: ' + ref); return null; }
  return { i, j, r:m.fr[j], P:PARAGRAFOS[i] };
}
function gramExHTML(ref){
  const x = gramFraseRef(ref); if(!x) return '';
  const tema = x.P.tema;
  return `<div class="gr-ex"><div class="gr-ex-ctx">${PAR_TEMA_IC[tema] || ''} ${gramCap(tema)}</div>
    <div class="gr-ex-row"><div class="gr-en">${x.r.html}</div>${btnAud(x.r.texto)}</div>
    <div class="gr-pt">${escapeHTML(x.r.pt)}</div>
    <button type="button" class="cross-link gr-abrir" data-i="${x.i}" data-j="${x.j}">⚙️ montar no console</button></div>`;
}
/* cartão de um tipo (details recolhido) */
function gramCardHTML(k){
  const G = GRAM_TIPOS[k], T = O2_TIPOS.find(t => t.k === k), f = parFam(k), F = GRAM_FAM[f];
  const conjs = T.conjs.map(c => `<span class="gr-cj"><b>${escapeHTML(c.en)}</b><i>${escapeHTML(c.pt)}</i></span>`).join('');
  const forma = PAR_FORMA[k].replace(/\{c\}/g, T.conjs[0].en);
  const reg = { informal:'🗣️ informal', neutro:'⚖️ neutro', formal:'🎩 formal' }[G.reg];
  const linha = (rot, txt) => `<div class="gr-row"><div class="gr-lab">${rot}</div><div class="gr-val">${txt}</div></div>`;
  return `<details class="gr-t" id="gr-t-${k}" data-k="${k}" data-f="${f}"${G.red ? ' data-red="1"' : ''} style="--gf:${gramFamCor(f)}">
    <summary><span class="gr-t-ic">${G.ic}</span><span class="gr-t-main"><b>${G.nome}${G.red ? ' <span class="gr-red-tag" title="oração reduzida">✂️ reduzida</span>' : ''}</b><small>${PAR_PAPEL[k]}</small></span>
      <span class="gr-t-meta"><span class="gr-dots" title="uso no dia a dia (estimativa didática)">${gramPontos(G.freq)}</span><span class="gr-reg">${reg}</span></span></summary>
    <div class="gr-t-body">
      <div class="gr-fam-tag">${F.ic} ${F.nome}</div>
      ${linha('O que é', G.o)}
      ${linha('Use quando', G.q)}
      ${linha('Como se forma', forma)}
      ${linha('Conjunções', `<div class="gr-cjs">${conjs}</div>`)}
      ${linha('Pense assim', G.pense)}
      ${G.pt ? linha('Em português', G.pt) : ''}
      ${linha('Onde aparece', G.onde.map(o => `<span class="gr-onde">${o}</span>`).join(''))}
      ${linha('Armadilha', `<span class="gr-warn">${G.atencao}</span>`)}
      <div class="gr-exs"><div class="gr-lab">No dia a dia (gerado pelo motor)</div>${G.ex.map(gramExHTML).join('')}</div>
      <div class="gr-hoje"><b>🧪 Experimente hoje:</b> ${G.hoje}</div>
      <div class="gr-acts">
        <button type="button" class="signal-chip" data-gr-motor="${k}">⚙️ Usar no motor</button>
        <button type="button" class="signal-chip" data-gr-par="${k}">📚 Ver parágrafos com este tipo</button>
        <button type="button" class="signal-chip" data-gr-cat="${k}">🔗 Ver no catálogo técnico</button>
      </div>
    </div></details>`;
}
/* abre um cartão e leva até ele (mostra todos se o filtro o escondia) */
function gramAbrir(k){
  const card = document.getElementById('gr-t-' + k); if(!card) return;
  if(card.hidden) gramFiltra('todas');
  card.open = true;
  const ajuste = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 56) + 10;
  const y = card.getBoundingClientRect().top + window.scrollY - ajuste;
  window.scrollTo({ top:y, behavior:'smooth' });
}
function gramFiltra(f){
  gramFiltro = f;
  const raiz = document.getElementById('gramaticaWrap'); if(!raiz) return;
  raiz.querySelectorAll('.gr-fil').forEach(b => b.setAttribute('data-active', String(b.dataset.f === f)));
  /* v135: 'red' é um filtro transversal (só os cartões marcados como reduzidos, de qualquer família) */
  raiz.querySelectorAll('.gr-t').forEach(c => { c.hidden = f === 'red' ? !c.dataset.red : f !== 'todas' && c.dataset.f !== f; });
  raiz.querySelectorAll('.gr-grp').forEach(g => { g.hidden = f === 'red' ? !g.querySelector('.gr-t[data-red]') : f !== 'todas' && g.dataset.f !== f; });
  const caixa = document.getElementById('gr-fam-box');
  if(caixa){
    if(f === 'todas'){ caixa.hidden = true; caixa.innerHTML = ''; }
    else { const F = GRAM_FAM[f]; caixa.hidden = false; caixa.style.setProperty('--gf', gramFamCor(f));
      caixa.innerHTML = `<b>${F.ic} ${F.nome}</b> — ${F.lema}.<p>${F.o}</p><p>${F.teste}</p><p><b>Quando usar:</b> ${F.quando}</p><p><b>Estilo que dá:</b> ${F.estilo}</p>`; }
  }
}
/* ---- treino: qual é o tipo da oração? (geral e só reduzidas) ---- */
function gramQuizNova(S){
  S = S || gramQuiz;
  const pool = [];
  parMontados().forEach((m, i) => m.fr.forEach((r, j) => { if(r.tipo && GRAM_TIPOS[r.tipo.k] && (!S.red || GRAM_TIPOS[r.tipo.k].red)) pool.push({ i, j, r, k:r.tipo.k }); }));
  let x; do { x = pool[Math.floor(Math.random() * pool.length)]; } while(S.ultima && x.r.texto === S.ultima && pool.length > 1);
  S.ultima = x.r.texto;
  const f = parFam(x.k), mesma = GRAM_ORDEM.filter(k => k !== x.k && parFam(k) === f), outras = GRAM_ORDEM.filter(k => parFam(k) !== f);
  const sorteia = (l, n) => l.slice().sort(() => Math.random() - 0.5).slice(0, n);
  /* treino das reduzidas: as quatro opções são sempre os 4 tipos reduzidos */
  const opcoes = S.red ? GRAM_ORDEM.filter(k => GRAM_TIPOS[k].red).sort(() => Math.random() - 0.5)
    : [x.k].concat(sorteia(mesma, 1), sorteia(outras, 3 - Math.min(1, mesma.length))).slice(0, 4).sort(() => Math.random() - 0.5);
  S.cur = { ...x, opcoes, resp:null };
  gramQuizDesenha(S);
}
function gramQuizDesenha(S){
  S = S || gramQuiz;
  const el = document.getElementById(S.el); if(!el) return;
  const q = S.cur; if(!q){ el.innerHTML = ''; return; }
  const placar = `<div class="gr-q-placar">Acertos: <b>${S.certas}</b> de ${S.feitas}</div>`;
  let h = `${placar}<div class="gr-q-enun">${S.red ? 'Que tipo de <b>oração reduzida</b> é esta? (procure a forma <i>-ing</i>, <i>-ed</i> ou <i>to</i> + verbo)' : 'Que tipo de oração é a <b>segunda oração</b> desta frase?'}</div>
    <div class="gr-ex"><div class="gr-ex-row"><div class="gr-en">${q.r.html}</div>${btnAud(q.r.texto)}</div><div class="gr-pt">${escapeHTML(q.r.pt)}</div></div>
    <div class="gr-q-ops">${q.opcoes.map(k => {
      const G = GRAM_TIPOS[k], F = GRAM_FAM[parFam(k)];
      const est = q.resp === null ? '' : k === q.k ? 'ok' : k === q.resp ? 'no' : 'dim';
      return `<button type="button" class="gr-q-op" data-k="${k}" data-st="${est}"${q.resp !== null ? ' disabled' : ''}><b>${G.ic} ${G.nome}</b><small>${F.nome.replace('Orações ', '').replace('subordinadas ', '')}</small></button>`; }).join('')}</div>`;
  if(q.resp !== null){
    const G = GRAM_TIPOS[q.k], F = GRAM_FAM[parFam(q.k)], ok = q.resp === q.k;
    h += `<div class="gr-q-fb" data-ok="${ok}"><b>${ok ? '✅ Certo.' : '❌ Quase.'}</b> É uma oração <b>${G.nome.toLowerCase()}</b> (${F.nome.replace('Orações ', '')}): ${PAR_PAPEL[q.k]}.<br>
      <span class="gr-q-forma">${PAR_FORMA[q.k].replace(/\{c\}/g, escapeHTML(q.r.conj || ''))}</span></div>
      <div class="gr-acts"><button type="button" class="signal-chip" id="${S.red ? 'gramQuizRedProx' : 'gramQuizProx'}">➡️ Próxima frase</button>
      <button type="button" class="signal-chip" data-gr-abre="${q.k}">📖 Ver este tipo</button></div>`;
  }
  el.innerHTML = h;
  el.querySelectorAll('.gr-q-op').forEach(b => b.onclick = () => { if(S.cur.resp !== null) return;
    S.cur.resp = b.dataset.k; S.feitas++; if(b.dataset.k === S.cur.k) S.certas++; gramQuizDesenha(S); });
  const prox = document.getElementById(S.red ? 'gramQuizRedProx' : 'gramQuizProx'); if(prox) prox.onclick = () => gramQuizNova(S);
  el.querySelectorAll('[data-gr-abre]').forEach(b => b.onclick = () => gramAbrir(b.dataset.grAbre));
}
/* ---- montagem da seção ---- */
