/* ---- v163: RELATIVA × PERGUNTA INDIRETA ----
   As duas usam as mesmas palavras (which, who, where, when…), mas fazem coisas diferentes. Todas as frases vêm do motor:
   aqui só se escolhem os verbos (ids do banco) e as colocações que já existem. */
const GRAM_CTR = [
  { pal:'which', rel:{ v:'buy', col:'a gift', o2:{ k:'rel', cj:'which', v:'want' } }, oq:{ o2:{ k:'oq', cj:'which one', v:'want', sj2:'I' } },
    dica:'Na relativa, <i>which</i> vem <b>depois de um substantivo</b> (<i>gift</i>) e o descreve. Na indireta, <i>which one</i> <b>substitui</b> o substantivo: é a própria dúvida.' },
  { pal:'who', rel:{ v:'bring', col:'a friend', o2:{ k:'rel', cj:'who', v:'need' } }, oq:{ o2:{ k:'oq', cj:'who', v:'meet' } },
    dica:'<i>Who</i> relativo qualifica uma pessoa já citada; <i>who</i> indireto é a pergunta "quem?" guardada dentro da frase.' },
  { pal:'where', rel:{ v:'sell', col:'the house', o2:{ k:'rel', cj:'where', v:'live' } }, oq:{ o2:{ k:'oq', cj:'where', v:'live' } },
    dica:'Em português as duas ficam iguais ("a casa <i>onde</i> ela mora" / "<i>onde</i> ela mora"). No inglês, só a relativa tem o substantivo (<i>the house</i>) antes.' },
  { pal:'when', rel:{ v:'enjoy', col:'the moment', o2:{ k:'rel', cj:'when', v:'arrive' } }, oq:{ o2:{ k:'oq', cj:'when', v:'arrive' } },
    dica:'<i>The moment when</i> descreve o momento; <i>know when</i> pergunta qual é o momento.' },
  { pal:'that × what', rel:{ v:'use', col:'a tool', o2:{ k:'rel', cj:'that', v:'need' } }, oq:{ o2:{ k:'oq', cj:'what', v:'need' } },
    dica:'<i>That</i> só funciona como relativa; <i>what</i> só abre pergunta indireta. Dizer <i>the tool what I need</i> é erro típico de quem traduz o "que" do português.' },
  { pal:'whose', rel:{ v:'buy', col:'a gift', o2:{ k:'rel', cj:'whose', wh:'price' } }, oq:null,
    dica:'<i>Whose</i> indica posse e só aparece na relativa. Na indireta, o equivalente seria <i>whose gift</i> inteiro, mais raro.' },
  { pal:'if × whether', rel:null, oq:{ o2:{ k:'oq', cj:'if', v:'work' } },
    dica:'Pergunta de sim ou não só existe na indireta: <i>if / whether</i> = "se". A relativa nunca usa essas palavras.' }
];
const gramCtrFrase = c => { const r = parFrase(Object.assign({ p:'I', t:'present', a:'simples', f:'afirmativa' }, c.o2.k === 'oq' ? { v:'know' } : {}, c), 'contraste');
  return { r, html:`<div class="gr-ex"><div class="gr-ex-row"><div class="gr-en">${r.html}</div>${btnAud(r.texto)}</div><div class="gr-pt">${escapeHTML(r.pt)}</div></div>` }; };
function gramCtrHTML(){
  const lin = GRAM_CTR.map(x => `<div class="gr-red-r"><div class="gr-red-t">${x.pal}</div>
    <div class="gr-red-f"><span class="gr-red-lab">relativa</span><span>${x.rel ? 'descreve um substantivo' : '<i>não existe</i>'}</span></div>${x.rel ? gramCtrFrase(x.rel).html : ''}
    <div class="gr-red-f"><span class="gr-red-lab">indireta</span><span>${x.oq ? 'é a pergunta, dentro da frase' : '<i>não existe</i>'}</span></div>${x.oq ? gramCtrFrase(x.oq).html : ''}
    <p class="gr-p" style="margin-top:6px">${x.dica}</p></div>`).join('');
  return `<section class="gr-sec" id="gr-sctr"><h3 class="gr-h"><span>⚖️</span>Relativa × pergunta indireta</h3>
    <p class="gr-p">As duas aparecem com <i>which, who, where, when</i> e têm a mesma ordem (sujeito + verbo, sem <i>do/does</i>). A diferença é a <b>função</b>: a <b>relativa</b> é <b>adjetiva</b> (descreve um substantivo que já está na frase); a <b>pergunta indireta</b> é <b>substantiva</b> (é o objeto de um verbo de saber, perguntar ou explicar). É um dos tropeços mais comuns de quem pensa em português, onde as duas usam a mesma palavra.</p>
    <div class="gr-ref-t">Dois testes rápidos</div>
    <ol class="gr-passos">
      <li><b>Teste do "isso".</b> Troque a oração por <i>isso</i>: "Eu sei <i>isso</i>" funciona? Então é pergunta indireta. "Eu vendo a casa <i>isso</i>" não funciona: é relativa.</li>
      <li><b>Teste do substantivo.</b> Há um substantivo imediatamente antes da palavra? Então ela o descreve (relativa). Se o verbo antes é de saber, perguntar ou explicar (<i>know, ask, tell, wonder</i>…), é indireta.</li>
      <li><b>Teste da omissão.</b> A relativa de objeto pode perder o pronome (<i>a gift I want</i>); a indireta nunca perde a palavra interrogativa.</li>
    </ol>
    <div class="gr-ref-t">Lado a lado (frases do motor)</div>
    <div class="gr-red-tab">${lin}</div>
    <div class="gr-ref-t">Treino: relativa ou pergunta indireta?</div>
    <div id="gramCtrQuiz"></div><div class="gr-acts" id="gramCtrIni"><button type="button" class="signal-chip" id="gramCtrIniciar">▶️ Treinar a diferença</button></div></section>`;
}
const gramCtr = { cur:null, certas:0, feitas:0 };
function gramCtrNova(){
  const el = document.getElementById('gramCtrQuiz'); if(!el) return;
  const pool = []; GRAM_CTR.forEach(x => { if(x.rel) pool.push({ x, k:'rel' }); if(x.oq) pool.push({ x, k:'oq' }); });
  const sel = pool[Math.floor(Math.random() * pool.length)]; gramCtr.cur = { sel, f:gramCtrFrase(sel.k === 'rel' ? sel.x.rel : sel.x.oq), resp:null }; gramCtrDesenha();
}
function gramCtrDesenha(){
  const el = document.getElementById('gramCtrQuiz'), q = gramCtr.cur; if(!el || !q) return;
  let h = `<div class="gr-q-placar">Acertos: <b>${gramCtr.certas}</b> de ${gramCtr.feitas}</div><div class="gr-q-enun">Esta oração <b>descreve um substantivo</b> ou <b>guarda uma pergunta</b>?</div>${q.f.html}
    <div class="gr-q-ops">${[['rel', 'Relativa'], ['oq', 'Pergunta indireta']].map(([k, n]) => { const est = q.resp === null ? '' : k === q.sel.k ? 'ok' : k === q.resp ? 'no' : 'dim';
      return `<button type="button" class="gr-q-op" data-ctr="${k}" data-st="${est}"${q.resp !== null ? ' disabled' : ''}><b>${n}</b></button>`; }).join('')}</div>`;
  if(q.resp !== null){ const ok = q.resp === q.sel.k;
    h += `<div class="gr-q-fb" data-ok="${ok}"><b>${ok ? '✅ Certo.' : '❌ Quase.'}</b> É uma <b>${q.sel.k === 'rel' ? 'relativa' : 'pergunta indireta'}</b>. ${q.sel.x.dica}</div><div class="gr-acts"><button type="button" class="signal-chip" id="gramCtrProx">➡️ Próxima frase</button></div>`; }
  el.innerHTML = h;
}
function buildGramatica(){
  const wrap = document.getElementById('gramaticaWrap'); if(!wrap) return;
  const redKs = GRAM_ORDEM.filter(k => GRAM_TIPOS[k].red);
  const folhas = f => GRAM_ORDEM.filter(k => parFam(k) === f).map(k => `<button type="button" class="gr-leaf" data-k="${k}"><span>${GRAM_TIPOS[k].ic}</span>${GRAM_TIPOS[k].nome}${GRAM_TIPOS[k].red ? ' <span class="gr-red-tag">✂️</span>' : ''}</button>`).join('');
  const base = (spec, leg) => { const r = parFrase(spec, 'gramática'); return `<div class="gr-ex"><div class="gr-ex-row"><div class="gr-en">${r.html}</div>${btnAud(r.texto)}</div><div class="gr-pt">${escapeHTML(r.pt)}</div><div class="gr-leg">${leg}</div></div>`; };
  const SPEC1 = { p:'She', t:'present', a:'simples', v:'study', col:'English' };
  const cont = ref => { const x = gramFraseRef(ref); return `<div class="gr-ex"><div class="gr-ex-row"><div class="gr-en">${x.r.html}</div>${btnAud(x.r.texto)}</div><div class="gr-pt">${escapeHTML(x.r.pt)}</div>`; };
  const h = [];
  /* índice */
  h.push(`<div class="gr-hero"><b>Para que serve esta seção.</b> Aqui você entende <b>o que cada oração faz</b>, imagina <b>onde usá-la</b> e treina a reconhecê-la. Os detalhes técnicos (fórmulas, restrições, verbos) ficam em <button type="button" class="cross-link" data-goto="block-oracoes">🔗 Orações compostas</button>; os textos prontos, em <button type="button" class="cross-link" data-goto="block-paragrafos">📚 Parágrafos</button>.</div>
    <nav class="gr-idx" aria-label="Partes desta seção">${[['gr-s1', '1 · Frase, oração, período'], ['gr-s2', '2 · Coordenar × subordinar'], ['gr-s3', '3 · O mapa'], ['gr-s4', '4 · Intenções'], ['gr-s5', `5 · Os ${GRAM_ORDEM.length} tipos`], ['gr-sred', '6 · ✂️ Reduzidas'], ['gr-sctr', '⚖️ Relativa × indireta'], ['gr-s6', '7 · Situações'], ['gr-s7', '8 · Estilo'], ['gr-s8', '9 · Laboratório'], ['gr-s9', '10 · Treino']].map(a => `<button type="button" class="gr-idx-b" data-gr-ir="${a[0]}">${a[1]}</button>`).join('')}</nav>`);
  /* 1 · frase, oração e período (v135: o período entrou na revisão dos conceitos) */
  const exR = (r, leg) => `<div class="gr-ex"><div class="gr-ex-row"><div class="gr-en">${r.html}</div>${btnAud(r.texto)}</div><div class="gr-pt">${escapeHTML(r.pt)}</div><div class="gr-leg">${leg}</div></div>`;
  h.push(`<section class="gr-sec" id="gr-s1"><h3 class="gr-h"><span>1</span>Frase, oração e período</h3>
    <p class="gr-p">Três palavras que se misturam, do menor conceito ao maior. Separá-las é o que permite <b>contar e classificar</b> o que você diz.</p>
    <div class="gr-trio3">
      <div class="gr-box" style="--gf:var(--teal)"><b>💬 Frase</b><p>Qualquer enunciado com <b>sentido completo</b>, com ou sem verbo: "Bom dia!", "Que pena!", "Socorro!". É a unidade da comunicação.</p></div>
      <div class="gr-box" style="--gf:var(--blue)"><b>🧱 Oração</b><p>Um trecho organizado em torno de <b>um verbo</b> (ou de uma locução verbal, como "vai estudar", que conta como um só). Um verbo ou locução, uma oração.</p></div>
      <div class="gr-box" style="--gf:var(--orange)"><b>📏 Período</b><p>A frase <b>que tem verbo</b>, da letra maiúscula ao ponto final. Com uma oração é <b>simples</b>; com duas ou mais é <b>composto</b>.</p></div>
    </div>
    <div class="gr-ref-t">Os quatro períodos, com exemplos do motor</div>
    <div class="gr-duo">
      ${exR(parFrase({ p:'She', t:'present', a:'simples', v:'study', col:'English' }, 'gramática'), '<b>Período simples</b>: 1 verbo → 1 oração.')}
      ${exR(gramFraseRef('k1#3').r, '<b>Composto por coordenação</b>: 2 verbos, 2 orações independentes, de mesmo peso. Cada uma poderia ser uma frase.')}
      ${exR(gramFraseRef('k1#1').r, '<b>Composto por subordinação</b>: 2 verbos, e a segunda oração <b>depende</b> da primeira e exerce uma função nela.')}
      ${exR(gramPeriodoMisto(0), '<b>Período misto</b> (coordenação e subordinação na mesma frase): 3 verbos. Uma oração depende de outra e, além disso, há uma ligação entre orações independentes.')}
    </div>
    <div class="gr-ref-t">Como contar, passo a passo</div>
    <ol class="gr-passos">
      <li>Marque cada <b>verbo ou locução verbal</b>: cada um é uma oração.</li>
      <li><b>Um só</b> → período simples. <b>Mais de um</b> → período composto.</li>
      <li>No composto, faça o <b>teste do ponto final</b>: troque a conjunção por um ponto. Se as metades continuam sendo frases, é <b>coordenação</b>; se uma depende da outra, é <b>subordinação</b>.</li>
      <li>Apareceram <b>as duas relações</b> na mesma frase? Então é <b>período misto</b>.</li>
    </ol>
    <p class="gr-p gr-dim">As coordenadas sem conjunção (só vírgula) chamam-se <b>assindéticas</b>; com conjunção, <b>sindéticas</b>. O motor trabalha com as sindéticas, porque a conjunção é a peça central.</p>
    ${exR(gramFraseRef('red1#2').r, '<b>Atenção às reduzidas:</b> o verbo em <i>-ing</i> é uma oração <b>reduzida</b>. Mesmo sem conjugação e sem sujeito próprio, ela conta: são 2 orações, um período composto por subordinação. Veja a parte 6.')}
    <div class="gr-ref-t">Treino rápido: que período é este?</div>
    <div id="gramPerQuiz"></div><div class="gr-acts" id="gramPerIni"><button type="button" class="signal-chip" id="gramPerIniciar">▶️ Começar</button></div></section>`);
  /* 2 */
  h.push(`<section class="gr-sec" id="gr-s2"><h3 class="gr-h"><span>2</span>Dois jeitos de ligar ideias</h3>
    <div class="gr-duo">
      <div class="gr-box" style="--gf:var(--teal)"><b>🔗 Coordenar</b><p>As orações são <b>independentes</b>. Nenhuma manda na outra, e cada uma poderia ser uma frase.</p><p class="gr-dim">${GRAM_FAM.coord.teste}</p><p><b>${gramN('coord')} tipos:</b> aditiva, adversativa, alternativa, explicativa, conclusiva.</p></div>
      <div class="gr-box" style="--gf:var(--orange)"><b>🧱 Subordinar</b><p>Uma oração <b>depende</b> da outra e cumpre uma <b>função</b> dentro dela: faz o papel de substantivo, adjetivo ou advérbio.</p><p class="gr-dim">Ela não vive sozinha: <i>Although it is hard</i> não é uma frase completa.</p><p><b>${GRAM_ORDEM.length - gramN('coord')} tipos</b> em três famílias, pela função que exercem (as <b>reduzidas</b> ✂️ estão entre elas).</p></div>
    </div>
    <div class="gr-ref-t">Como descobrir a família de uma subordinada</div>
    <div class="gr-trio3">
      <div class="gr-box" style="--gf:var(--blue)"><b>${GRAM_FAM.subst.ic} Substantiva</b><p>${GRAM_FAM.subst.teste}</p></div>
      <div class="gr-box" style="--gf:var(--lime)"><b>${GRAM_FAM.adj.ic} Adjetiva</b><p>${GRAM_FAM.adj.teste}</p></div>
      <div class="gr-box" style="--gf:var(--orange)"><b>${GRAM_FAM.adv.ic} Adverbial</b><p>${GRAM_FAM.adv.teste}</p></div>
    </div></section>`);
  /* 3 */
  h.push(`<section class="gr-sec" id="gr-s3"><h3 class="gr-h"><span>3</span>O mapa completo</h3>
    <p class="gr-p">Toque em qualquer tipo para abrir a explicação. O símbolo ✂️ marca as <b>orações reduzidas</b>: elas fazem a mesma função da família em que aparecem, só que sem conjunção e sem verbo conjugado.</p>
    <div class="gr-tree">
      <div class="gr-root">Oração composta <small>duas ou mais orações na mesma frase</small></div>
      <div class="gr-branches">
        <div class="gr-br" style="--gf:var(--teal)"><div class="gr-tn">🔗 Coordenadas <small>${gramN('coord')} · independentes</small></div><div class="gr-leaves">${folhas('coord')}</div></div>
        <div class="gr-br gr-sub"><div class="gr-tn gr-tn-sub">🧱 Subordinadas <small>${GRAM_ORDEM.length - gramN('coord')} · dependem de uma principal</small></div>
          <div class="gr-subs">
            <div class="gr-br" style="--gf:var(--blue)"><div class="gr-tn">${GRAM_FAM.subst.ic} Substantivas <small>${gramN('subst')} · fazem papel de substantivo</small></div><div class="gr-leaves">${folhas('subst')}</div></div>
            <div class="gr-br" style="--gf:var(--lime)"><div class="gr-tn">${GRAM_FAM.adj.ic} Adjetivas <small>${gramN('adj')} · fazem papel de adjetivo</small></div><div class="gr-leaves">${folhas('adj')}</div></div>
            <div class="gr-br" style="--gf:var(--orange)"><div class="gr-tn">${GRAM_FAM.adv.ic} Adverbiais <small>${gramN('adv')} · fazem papel de advérbio</small></div><div class="gr-leaves">${folhas('adv')}</div></div>
          </div></div>
      </div></div></section>`);
  /* 4 */
  h.push(`<section class="gr-sec" id="gr-s4"><h3 class="gr-h"><span>4</span>Mapa de intenções</h3>
    <p class="gr-p">Em vez de perguntar "que oração é esta?", pergunte <b>"o que eu quero fazer com a segunda ideia?"</b>. É assim que se escolhe na hora de falar.</p>
    <div class="gr-ints">${GRAM_INTENTS.map(([ic, txt, ks]) => `<div class="gr-int"><div class="gr-int-t"><span>${ic}</span>${txt}</div><div class="gr-int-l">${ks.map(k => `<button type="button" class="gr-leaf" data-k="${k}" style="--gf:${gramFamCor(parFam(k))}"><span>${GRAM_TIPOS[k].ic}</span>${GRAM_TIPOS[k].nome}</button>`).join('')}</div></div>`).join('')}</div></section>`);
  /* 5 */
  h.push(`<section class="gr-sec" id="gr-s5"><h3 class="gr-h"><span>5</span>Os ${GRAM_ORDEM.length} tipos, um a um</h3>
    <p class="gr-p">Cada cartão explica <b>o que é</b>, <b>quando usar</b>, <b>como se forma</b>, <b>onde aparece</b>, a <b>armadilha</b> e traz <b>exemplos do motor</b> para você montar no console. Os pontos <span class="gr-dots">●●●</span> estimam o quanto o tipo aparece no dia a dia (estimativa didática, não contagem).</p>
    <div class="gr-tools"><div class="pronome-row gr-filtros">${[['todas', 'Todos ' + GRAM_ORDEM.length], ['coord', '🔗 Coordenadas ' + gramN('coord')], ['subst', '🧱 Substantivas ' + gramN('subst')], ['adj', '🏷️ Adjetivas ' + gramN('adj')], ['adv', '🧭 Adverbiais ' + gramN('adv')], ['red', '✂️ Reduzidas ' + gramNRed()]].map(a => `<button type="button" class="pronome-pill gr-fil" data-f="${a[0]}" data-active="${a[0] === 'todas'}">${a[1]}</button>`).join('')}</div>
      <div class="gr-acts"><button type="button" class="cross-link" data-gr-todos="1">▾ Abrir todos</button><button type="button" class="cross-link" data-gr-todos="0">▴ Recolher todos</button></div></div>
    <div class="gr-fam-box" id="gr-fam-box" hidden></div>
    ${['coord', 'subst', 'adj', 'adv'].map(f => `<div class="gr-grp" data-f="${f}"><div class="gr-grp-t" style="--gf:${gramFamCor(f)}">${GRAM_FAM[f].ic} ${GRAM_FAM[f].nome}<small>${GRAM_FAM[f].lema}</small></div><div class="gr-lista">${GRAM_ORDEM.filter(k => parFam(k) === f).map(gramCardHTML).join('')}</div></div>`).join('')}
  </section>`);
  /* 6 · orações reduzidas (v135) */
  const RED_TAB = [
    ['rger', 'Adverbial · gerúndio (tempo)', 'conjunção + sujeito + verbo conjugado', 'conjunção + verbo-<i>ing</i>', 'red1#2'],
    ['rger', 'Adverbial · gerúndio (modo)', 'o modo ("fazendo", "sem fazer")', '<i>by</i> / <i>without</i> + verbo-<i>ing</i>', 'red1#1'],
    ['rpart', 'Adverbial · particípio', 'conjunção + sujeito + <i>be</i> + particípio', 'conjunção + particípio', 'red2#1'],
    ['rinf', 'Substantiva · objeto', 'verbo principal + oração conjugada (mesmo sujeito)', 'verbo principal + <i>to</i> + verbo, ou + verbo-<i>ing</i> (o verbo principal decide)', 'red1#3'],
    ['rrel', 'Adjetiva · particípio', 'pronome relativo + <i>be</i> + particípio', 'substantivo + particípio', 'red4#1'],
    ['rrel', 'Adjetiva · -ing', 'pronome relativo + verbo', 'substantivo + verbo-<i>ing</i>', 'red4#2'],
    ['rrel', 'Adjetiva · to', '(que) + sujeito + <i>can / should</i> + verbo', 'substantivo + <i>to</i> + verbo', 'red4#3']
  ];
  h.push(`<section class="gr-sec" id="gr-sred"><h3 class="gr-h"><span>6</span>✂️ Orações reduzidas: o mesmo sentido, menos palavras</h3>
    <p class="gr-p">Uma oração <b>reduzida</b> tem o verbo numa <b>forma nominal</b> (<i>-ing</i>, particípio ou <i>to</i> + verbo) e, em geral, <b>não tem sujeito próprio nem conjugação</b>. Continua sendo oração e continua tendo função: faz papel de advérbio, de substantivo ou de adjetivo. É o recurso que deixa o inglês enxuto, e por isso aparece o tempo todo.</p>
    <div class="gr-fam-box" style="--gf:var(--brass)"><b>${GRAM_FAM.red.ic} ${GRAM_FAM.red.nome}</b> — ${GRAM_FAM.red.lema}.<p>${GRAM_FAM.red.teste}</p><p><b>Quando usar:</b> ${GRAM_FAM.red.quando}</p></div>
    <div class="gr-ref-t">As cinco regras</div>
    <ol class="gr-passos">
      <li><b>Mesmo sujeito.</b> A reduzida herda o sujeito da principal (ou, na adjetiva, descreve o substantivo ao lado). Se o sujeito mudar, volte à forma desenvolvida.</li>
      <li><b>A forma diz a função.</b> <i>-ing</i> vem depois de preposição e de certos verbos; o <b>particípio</b> carrega sentido passivo ou de estado; <i>to</i> + verbo dá finalidade, objetivo ou "o que fazer".</li>
      <li><b>Depois de preposição, sempre <i>-ing</i>.</b> O português diz "depois <i>de resolver</i>"; o inglês não aceita o infinitivo ali.</li>
      <li><b>Negação:</b> o <i>not</i> vem imediatamente antes da forma nominal.</li>
      <li><b>Na dúvida, desenrole.</b> A forma desenvolvida está sempre certa; a reduzida é uma escolha de estilo que só vale quando o sentido fica claro.</li>
    </ol>
    <div class="gr-ref-t">Desenvolvida ⇄ reduzida</div>
    <div class="gr-red-tab">${RED_TAB.map(([k, tit, de, para, ref]) => `<div class="gr-red-r"><div class="gr-red-t">${GRAM_TIPOS[k].ic} ${tit}</div>
      <div class="gr-red-f"><span class="gr-red-lab">desenvolvida</span><span>${de}</span></div>
      <div class="gr-red-f"><span class="gr-red-lab">reduzida</span><span><b>${para}</b></span></div>${gramExHTML(ref)}</div>`).join('')}</div>
    <div class="gr-ref-t">Forma × função</div>
    <div class="gr-trio3">
      <div class="gr-box" style="--gf:var(--orange)"><b>-ing (gerúndio)</b><p>🧭 <b>Adverbial:</b> <i>after, before, while, by, without, upon</i> + <i>-ing</i>.</p><p>🧱 <b>Substantiva:</b> objeto de <i>enjoy, avoid, finish, stop…</i></p><p>🏷️ <b>Adjetiva:</b> substantivo + <i>-ing</i> (ação em curso ou hábito).</p></div>
      <div class="gr-box" style="--gf:var(--orange)"><b>-ed (particípio)</b><p>🧭 <b>Adverbial:</b> <i>if, when, once, although</i> + particípio.</p><p>🧱 <b>Substantiva:</b> não se usa.</p><p>🏷️ <b>Adjetiva:</b> substantivo + particípio (sentido passivo).</p></div>
      <div class="gr-box" style="--gf:var(--orange)"><b>to + verbo (infinitivo)</b><p>🧭 <b>Adverbial:</b> finalidade. É o tipo <b>Final</b> do mapa, a reduzida mais comum do inglês.</p><p>🧱 <b>Substantiva:</b> objeto de <i>want, plan, decide, learn…</i></p><p>🏷️ <b>Adjetiva:</b> substantivo + <i>to</i> + verbo (necessidade, possibilidade).</p></div>
    </div>
    <div class="gr-ref-t">Português × inglês</div>
    <div class="gr-duo">
      <div class="gr-box" style="--gf:var(--teal)"><b>🇧🇷 Em português</b><p>Existem as três formas: gerúndio ("Chegando em casa, jantou"), particípio ("Terminado o trabalho, saiu") e infinitivo ("É bom estudar"). Mas o português usa mais a oração desenvolvida.</p></div>
      <div class="gr-box" style="--gf:var(--brass)"><b>🇺🇸 Em inglês</b><p>A reduzida é a escolha <b>comum</b>, não a literária. Três diferenças que pegam: (1) depois de preposição, <i>-ing</i> e nunca infinitivo; (2) a preposição do português some em <i>enjoy showing</i> ("gostar <i>de</i> mostrar"); (3) o particípio solto com conjunção (<i>if needed</i>) é frequente em e-mails e instruções.</p></div>
    </div>
    <div class="gr-ref-t">Abrir cada tipo</div>
    <div class="gr-leaves">${redKs.map(k => `<button type="button" class="gr-leaf" data-k="${k}" style="--gf:${gramFamCor(parFam(k))}"><span>${GRAM_TIPOS[k].ic}</span>${GRAM_TIPOS[k].nome}</button>`).join('')}</div>
    <div class="gr-ref-t">Treino: que reduzida é esta?</div>
    <div id="gramQuizRed"></div><div class="gr-acts" id="gramQuizRedIni"><button type="button" class="signal-chip" id="gramQuizRedIniciar">▶️ Treinar só as reduzidas</button></div></section>`);
  h.push(gramCtrHTML());   /* v163 */
  /* 6 */
  h.push(`<section class="gr-sec" id="gr-s6"><h3 class="gr-h"><span>7</span>Onde usar: kits por situação</h3>
    <p class="gr-p">Cada situação pede um <b>arsenal</b> diferente. Abra uma e veja que orações mais rendem ali.</p>
    ${GRAM_KITS.map(K => `<details class="gr-kit"><summary><span>${K.ic}</span><span class="gr-kit-m"><b>${K.nome}</b><small>${K.d}</small></span></summary><ul>${K.it.map(([k, d]) => `<li><button type="button" class="gr-leaf" data-k="${k}" style="--gf:${gramFamCor(parFam(k))}"><span>${GRAM_TIPOS[k].ic}</span>${GRAM_TIPOS[k].nome}</button> ${d}</li>`).join('')}</ul></details>`).join('')}</section>`);
  /* 7 */
  const todos = parMontados(), fams = ['coord', 'subst', 'adj', 'adv'];
  const pares = Object.keys(PAR_ESTILO).map(pf => { const n = todos.filter(x => parFamilias(x).join('+') === pf).length; return { pf, n }; });
  h.push(`<section class="gr-sec" id="gr-s7"><h3 class="gr-h"><span>8</span>Estilo: o que cada combinação de famílias produz</h3>
    <p class="gr-p">Falar bem não é só escolher uma oração certa: é <b>combinar famílias</b>. Cada par dá um estilo diferente.</p>
    <div class="gr-estilos">${pares.map(({ pf, n }) => `<div class="gr-estilo"><div class="gr-estilo-t">${pf.split('+').map(f => `<span style="color:${gramFamCor(f)}">${gramCap(PAR_FAMS[f].nome)}</span>`).join(' + ')}</div><p>${PAR_ESTILO[pf]}</p>${n ? `<button type="button" class="cross-link" data-gr-fam="${pf}">📚 ${n} parágrafo${n === 1 ? '' : 's'} com esta combinação</button>` : ''}</div>`).join('')}</div></section>`);
  /* 8 */
  h.push(`<section class="gr-sec" id="gr-s8"><h3 class="gr-h"><span>9</span>Laboratório: uma ideia, quatro famílias</h3>
    <p class="gr-p">Os parágrafos abaixo falam de <b>uma só ideia</b> usando as <b>quatro famílias</b>. Repare no que cada frase faz com o mesmo assunto.</p>
    ${GRAM_LAB.map(id => { const i = PARAGRAFOS.findIndex(p => p.id === id), m = parMontados()[i];
      return `<div class="gr-lab-card"><div class="gr-lab-t">${PAR_TEMA_IC[PARAGRAFOS[i].tema] || ''} ${escapeHTML(PARAGRAFOS[i].titulo)}</div>${m.fr.map((r, j) => { const f = r.tipo ? parFam(r.tipo.k) : null;
        return `<div class="gr-lab-s"${f ? ` style="--gf:${gramFamCor(f)}"` : ''}>${f ? `<div class="gr-lab-f">${GRAM_FAM[f].ic} ${PAR_FAMS[f].nome} · ${GRAM_TIPOS[r.tipo.k].nome}: <span>${PAR_PAPEL[r.tipo.k]}</span></div>` : ''}<div class="gr-ex-row"><div class="gr-en">${r.html}</div>${btnAud(r.texto)}</div><div class="gr-pt">${escapeHTML(r.pt)}</div></div>`; }).join('')}</div>`; }).join('')}</section>`);
  /* 9 */
  h.push(`<section class="gr-sec" id="gr-s9"><h3 class="gr-h"><span>10</span>Treino: que oração é esta?</h3>
    <p class="gr-p">O app mostra uma frase do acervo e você diz o tipo da segunda oração. Errou? A explicação aparece na hora.</p>
    <div id="gramQuiz"></div><div class="gr-acts" id="gramQuizIni"><button type="button" class="signal-chip" id="gramQuizIniciar">▶️ Começar o treino</button></div></section>`);
  wrap.innerHTML = h.join('');
  /* ---- eventos (delegados na raiz) ---- */
  wrap.addEventListener('click', e => {
    const t = e.target;
    const leaf = t.closest('.gr-leaf'); if(leaf){ gramAbrir(leaf.dataset.k); return; }
    const ir = t.closest('[data-gr-ir]'); if(ir){ const s = document.getElementById(ir.dataset.grIr); if(s) window.scrollTo({ top:s.getBoundingClientRect().top + window.scrollY - ((parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 56) + 8), behavior:'smooth' }); return; }
    const fil = t.closest('.gr-fil'); if(fil){ gramFiltra(fil.dataset.f); return; }
    const todosB = t.closest('[data-gr-todos]'); if(todosB){ wrap.querySelectorAll('.gr-t:not([hidden])').forEach(d => { d.open = todosB.dataset.grTodos === '1'; }); return; }
    const ab = t.closest('.gr-abrir'); if(ab){ parAbrir(+ab.dataset.i, +ab.dataset.j); return; }
    const mo = t.closest('[data-gr-motor]'); if(mo){ o2UsarNoMotor(mo.dataset.grMotor); return; }
    const pa = t.closest('[data-gr-par]'); if(pa){ gramParagrafos('o', pa.dataset.grPar); return; }
    const ca = t.closest('[data-gr-cat]'); if(ca){ gramCatalogo(ca.dataset.grCat); return; }
    const fm = t.closest('[data-gr-fam]'); if(fm){ gramParagrafos('f', fm.dataset.grFam); return; }
    if(t.closest('#gramQuizIniciar')){ document.getElementById('gramQuizIni').hidden = true; gramQuizNova(gramQuiz); return; }
    if(t.closest('#gramQuizRedIniciar')){ document.getElementById('gramQuizRedIni').hidden = true; gramQuizNova(gramQuizRed); return; }
    if(t.closest('#gramCtrIniciar')){ document.getElementById('gramCtrIni').hidden = true; gramCtrNova(); return; }
    const cq = t.closest('[data-ctr]'); if(cq && gramCtr.cur && gramCtr.cur.resp === null){ gramCtr.cur.resp = cq.dataset.ctr; gramCtr.feitas++; if(cq.dataset.ctr === gramCtr.cur.sel.k) gramCtr.certas++; gramCtrDesenha(); return; }
    if(t.closest('#gramCtrProx')){ gramCtrNova(); return; }
    if(t.closest('#gramPerIniciar')){ document.getElementById('gramPerIni').hidden = true; gramPerNova(); return; }
  });
}
/* leva ao acervo de parágrafos já filtrado */
function gramParagrafos(dim, val){
  parFiltro.dim = dim; parFiltro.val = val; parFiltro.val2 = null; parFiltro.nivel = null; buildParagrafos();
  const b = document.getElementById('block-paragrafos'); if(b.dataset.open !== 'true') toggleBlock('block-paragrafos');
  b.scrollIntoView({ behavior:'smooth', block:'start' });
}
/* leva ao catálogo técnico, abrindo o cartão do tipo (a ordem do catálogo é a de ORACOES) */
function gramCatalogo(k){
  const b = document.getElementById('block-oracoes'); if(b.dataset.open !== 'true') toggleBlock('block-oracoes');
  let alvo = null; ORACOES.forEach((gr, gi) => gr.itens.forEach((it, ii) => { if(it.motor === k) alvo = { gi, ii }; }));
  const cards = [...document.querySelectorAll('#oracoesWrap .orac-card')];
  let n = 0, card = null; ORACOES.forEach((gr, gi) => gr.itens.forEach((it, ii) => { if(alvo && gi === alvo.gi && ii === alvo.ii) card = cards[n]; n++; }));
  if(card){ if(card.dataset.open !== 'true') card.querySelector('.o2-card-head').click(); setTimeout(() => card.scrollIntoView({ behavior:'smooth', block:'center' }), 360); }
  else b.scrollIntoView({ behavior:'smooth', block:'start' });
}

buildAnatomia();
buildAdverbsList();
buildErros();
buildOracoes();
buildParagrafos();
buildGramatica();
