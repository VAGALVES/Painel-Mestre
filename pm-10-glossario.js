/* ---- Glossário por encaixe ----
   O banco inteiro reorganizado pela pergunta que cada expressão responde, e não pelo
   tempo verbal em que aparece. É a visão que faltava: quero preencher o encaixe "modo",
   quais peças tenho? Junta todas as combinações, sem repetir. */
/* Nenhum encaixe aberto de início: com centenas de expressões só em "tempo", abrir algo por
   padrão empurraria o resto do guia para fora da tela. O glossário começa recolhido e
   expande sob demanda. */
let glossSlot = null;
function glossPorEncaixe(){
  const mapa = {};
  Object.keys(SIGNAL_WORDS).forEach(k=>{
    SIGNAL_WORDS[k].forEach(s=>{
      const r = slotOf(s);
      (mapa[r] = mapa[r] || new Map()).set(s.w, s);
    });
  });
  return mapa;
}
const SLOT_PERGUNTA = {
  1:'quanto?', 2:'como?', 3:'comparado a quê?', 4:'onde?', 5:'a cada quando? quantas vezes?',
  6:'por quanto tempo?', 7:'aproximadamente quando?', 8:'quando?', 9:'em que ordem?',
  10:'nega o quê? (só em negativas e perguntas)',
  11:'com que certeza?', 12:'só? também? até? (foco)', 13:'com que frequência? (vaga)',
  14:'em que fase da ação? (já, ainda)', 15:'em que medida? (realmente, quase)'
};
function buildGlossario(){
  const box = document.getElementById('glossarioWrap');
  if(!box) return;
  const mapa = glossPorEncaixe();
  /* v173: o objeto (determinante, substantivo e os 8 adjetivos, ids 30–39) entra na ordem real da frase:
     depois dos encaixes do meio e antes dos de fim. Suas peças vêm das tabelas de data-adjetivos.js,
     não do SIGNAL_WORDS, por isso têm um ramo próprio abaixo. */
  const iFim = SLOT_ORDEM.findIndex(r => SLOT_ZONA(r) === 'fim');
  const ordem = SLOT_ORDEM.slice(0, iFim).concat(NP_IDS, SLOT_ORDEM.slice(iFim));
  const slots = ordem.filter(r => npEhId(r) || mapa[r]);
  if(glossSlot !== null && !slots.includes(glossSlot)) glossSlot = null;
  const npRot = r => r >= 32 ? `${r - 31}. ${NP_NOME[r]}` : NP_NOME[r];

  const abas = slots.map(r=>{
    if(npEhId(r)){
      const kn = r >= 32 ? 'adj_' + NP_ADJ_DO_ID[r] : 'regencia';
      return `<div class="signal-chip fam-chip" data-gloss="${r}" data-active="${glossSlot===r}"
        style="--cat:${npCorId(r)}" data-cat="${kn}">${npRot(r)}<span class="fam-count">${npOpcoesId(r).length}</span></div>`;
    }
    const s0 = mapa[r].values().next().value;
    const k = adjKind(s0.cls, s0.w);
    return `<div class="signal-chip fam-chip" data-gloss="${r}" data-active="${glossSlot===r}"
      style="--cat:${ADJ_COLOR[k]}" data-cat="${k}">${END_SLOT_NOME[r]}<span class="fam-count">${mapa[r].size}</span></div>`;
  }).join('');

  let corpo = `<div class="gloss-head">Toque em um encaixe acima para ver as expressões que o preenchem.</div>`;
  if(glossSlot !== null && npEhId(glossSlot)){
    /* encaixes do objeto: lista alfabética das opções, com filtro (opinião e origem passam de 40) */
    const ops = npOpcoesId(glossSlot).slice().sort((a,b)=> a.w.localeCompare(b.w));
    const cor = npCorId(glossSlot);
    /* v177: todos os encaixes do objeto agrupados pelas subcategorias, na ordem em que foram escritas */
    const lista = npOpcoesId(glossSlot);
    const itens = npItensHTML(lista, o => `<div class="gloss-item" style="--cat:${cor}" data-sub="${escapeHTML(o.sub || '')}" data-w="${escapeHTML(o.w.toLowerCase())}">
        <span class="gloss-en">${escapeHTML(o.w)}</span>
        <span class="gloss-right">
          <span class="gloss-pt">${escapeHTML(o.pt)}</span>
          <button class="audio-btn sm" data-text="${escapeHTML(o.w)}" title="Ouvir">🔊</button>
        </span></div>`);
    corpo = `<div class="gloss-head">
        <b style="color:${cor}">${npRot(glossSlot)}</b>
        — responde <i>${NP_PERGUNTA[glossSlot]}</i> · ${ops.length} opções${glossSlot >= 32 ? ' · ordem fixa antes do substantivo' : ''}
        <button class="gloss-fechar" data-gloss-close="1">recolher ✕</button>
      </div>
      <div class="np-wrap" style="--cat:${cor}">
        <input type="search" class="mont-busca" id="glossBusca" placeholder="filtrar opções…" autocomplete="off">
        ${npChipsHTML(glossSlot)}
      </div>
      <div class="gloss-grid">${itens}</div>`;
  } else if(glossSlot !== null){
    /* v177: agrupado pelas subcategorias do encaixe (o que cada grupo significa aparece no título) */
    const lista = subOrdena(glossSlot, [...mapa[glossSlot].values()]);
    const itens = npItensHTML(lista, s=>{
        const k = adjKind(s.cls, s.w);
        const pos = s.pl === 'split' ? ' · partido' : '';
        /* o partido guarda as duas metades; fala a forma unida, que é como se ouve */
        const falar = s.pl === 'split' ? `${s.mid} ${s.end}` : s.w;
        return `<div class="gloss-item" style="--cat:${ADJ_COLOR[k]}" data-sub="${escapeHTML(s.sub || '')}">
          <span class="gloss-en">${escapeHTML(s.w)}</span>
          <span class="gloss-right">
            <span class="gloss-pt">${escapeHTML(SIGNAL_PT[s.w] || '—')}${pos}</span>
            <button class="audio-btn sm" data-text="${escapeHTML(falar)}" title="Ouvir">🔊</button>
          </span></div>`;
      });
    const s0 = mapa[glossSlot].values().next().value;
    const k0 = adjKind(s0.cls, s0.w);
    corpo = `<div class="gloss-head">
        <b style="color:${ADJ_COLOR[k0]}">${slotNum(glossSlot)}. ${END_SLOT_NOME[glossSlot]}</b>
        — responde <i>${SLOT_PERGUNTA[glossSlot] || ''}</i> · ${mapa[glossSlot].size} expressões
        <button class="gloss-fechar" data-gloss-close="1">recolher ✕</button>
      </div>
      <div class="np-wrap" style="--cat:${ADJ_COLOR[k0]}">
        ${lista.length > 16 ? '<input type="search" class="mont-busca" id="glossBusca" placeholder="filtrar opções…" autocomplete="off">' : ''}
        ${chipsDeLista(lista)}
      </div>
      <div class="gloss-grid">${itens}</div>`;
  }

  box.innerHTML = `<div class="signal-row-inner fam-row" id="glossAbas">${abas}</div>${corpo}`;
  npFiltroLiga(box, '.gloss-item');                               /* busca + chips de subcategoria */
  const fechar = box.querySelector('[data-gloss-close]');
  if(fechar) fechar.onclick = ()=>{ glossSlot = null; buildGlossario(); updateScrollShadows(); };

  box.querySelectorAll('[data-gloss]').forEach(b=>{
    b.onclick = ()=>{ const r = +b.dataset.gloss; glossSlot = (glossSlot === r) ? null : r; buildGlossario(); updateScrollShadows(); };
  });
}

/* Carrega uma combinação do guia NO MONTADOR da própria anatomia — o console de tempos
   fica intocado. Assim o exemplo vira ponto de partida para desmontar e recombinar ali
   mesmo, sem perder o que estiver montado no motor principal. */
function aplicarNoMontador(cfg){
  if(!cfg) return;
  const pool = SIGNAL_WORDS[`${cfg.t}_${cfg.a}`] || [];
  MONT_COMBO.t = cfg.t; MONT_COMBO.a = cfg.a; MONT_COMBO.v = verbById(cfg.v).id; MONT_COMBO.f = cfg.f;
  montOn = new Set(); montEscolha = {}; montAberto = null;
  MONT_COMBO.vAuto = false; delete MONT_COMBO.vAntes;          /* v173: o verbo do card manda */
  if(cfg.np){                                                    /* sintagma nominal do card → soquetes 30–39 */
    if(cfg.np.det){ montOn.add(30); montEscolha[30] = cfg.np.det; }
    montOn.add(31); montEscolha[31] = cfg.np.noun;
    ADJ7.forEach((t, i) => { if(cfg.np.adj && cfg.np.adj[t.k]){ montOn.add(32 + i); montEscolha[32 + i] = cfg.np.adj[t.k]; } });
  }

  [].concat(cfg.mid || [], cfg.ends || []).forEach(x=>{
    const s = pool.find(y=>y.w === x);
    if(!s) return;
    const r = slotOf(s);
    montOn.add(r); montEscolha[r] = s.w;
  });

  buildMontador();
  const alvo = document.getElementById('montadorWrap');
  if(alvo && alvo.scrollIntoView) alvo.scrollIntoView({behavior:'smooth', block:'center'});
  const cx = document.querySelector('.montador');
  if(cx){ cx.classList.remove('flash'); void cx.offsetWidth; cx.classList.add('flash'); }
}

function buildAnatomia(){
  const wrap = document.getElementById('anatomiaWrap');
  if(!wrap) return;

  /* 1. tabela dos encaixes, com um exemplo real tirado do banco */
  const exemploDoSlot = (r)=>{
    for(const k in SIGNAL_WORDS){ const s = SIGNAL_WORDS[k].find(x=>slotOf(x)===r); if(s) return s; }
    return null;
  };
  /* Tetos por cor calculados do próprio banco: nada de número escrito à mão. */
  const teto = {como:[], onde:[], quando:[]};
  SLOT_ORDEM.forEach(r=>{
    const s = exemploDoSlot(r); if(s) teto[adjKind(s.cls, s.w)].push(END_SLOT_NOME[r]);
  });
  const nMeio = SLOT_ORDEM.filter(r=>SLOT_ZONA(r) === 'meio').length;
  const ZONA_TXT = {
    'início':'abre a frase, seguido de vírgula',
    'meio':'entre o auxiliar e o verbo principal — nesta ordem, e cada um com uma única função',
    'fim':'depois do verbo e do objeto'
  };
  let linhas = '', zonaAtual = '', npLinhas = false;
  SLOT_ORDEM.forEach(r=>{
    const s = exemploDoSlot(r); if(!s) return;
    const z = SLOT_ZONA(r);
    if(z !== zonaAtual){
      zonaAtual = z;
      if(z === 'fim' && !npLinhas){
        npLinhas = true;
        linhas += `<tr><td colspan="4" style="border-top:1px solid var(--line); padding-top:9px; font-size:9.5px; letter-spacing:.07em; text-transform:uppercase; color:var(--brass-dim);">
          objeto <span style="text-transform:none; letter-spacing:0; opacity:.85;">— o substantivo e seus 8 adjetivos: logo depois do verbo, antes dos encaixes de fim</span></td></tr>`;
        linhas += `<tr><td class="slot-n">·</td><td class="slot-nome" style="color:${ADJ_COLOR.regencia}">determinante</td><td class="slot-ex">qual? de quem?</td><td class="slot-ex">a / the / my</td></tr>`;
        ADJ7.forEach(t => {
          linhas += `<tr><td class="slot-n">${t.ord}º</td><td class="slot-nome" style="color:${ADJ_COLOR['adj_' + t.k]}">${t.n}</td><td class="slot-ex">${t.q}</td><td class="slot-ex">${t.ex} <span style="opacity:.6">· ${t.ops.length}</span></td></tr>`;
        });
        linhas += `<tr><td class="slot-n">·</td><td class="slot-nome" style="color:${ADJ_COLOR.regencia}">substantivo</td><td class="slot-ex">o quê?</td><td class="slot-ex">table</td></tr>`;
      }
      linhas += `<tr><td colspan="4" style="border-top:1px solid var(--line); padding-top:9px; font-size:9.5px; letter-spacing:.07em; text-transform:uppercase; color:var(--brass-dim);">
        ${z} <span style="text-transform:none; letter-spacing:0; opacity:.85;">— ${ZONA_TXT[z]}</span></td></tr>`;
    }
    const k = adjKind(s.cls, s.w);
    linhas += `<tr>
      <td class="slot-n">${slotNum(r)}</td>
      <td class="slot-nome" style="color:${ADJ_COLOR[k]}">${END_SLOT_NOME[r]}</td>
      <td class="slot-ex">${SLOT_PERGUNTA[r] || ''}</td>
      <td class="slot-ex">${escapeHTML(s.w)}</td></tr>`;
  });
  const nomesMeio = SLOT_ORDEM.filter(r=>SLOT_ZONA(r) === 'meio').map(r=>END_SLOT_NOME[r]).join(' → ');

  /* 2. os exemplos que valem a pena */
  let cards = '', grupoAtual = '';
  ANAT_EXEMPLOS.forEach((cfg, i)=>{
    const r = anatFrase(cfg);
    if(cfg.g && cfg.g !== grupoAtual){ grupoAtual = cfg.g; cards += `<div class="ref-class-label" style="margin-top:14px;">${cfg.g}</div>`; }
    cards += `<div class="anat-card" data-ex="${i}" role="button" tabindex="0" title="Tocar para carregar esta combinação no montador">
      <h4>${cfg.titulo}<span class="anat-usar">montar ↑</span></h4>
      <div class="anat-frase-row">
        <div class="anat-frase">${r.en}</div>
        <button class="audio-btn sm" data-text="${escapeHTML(r.texto)}" title="Ouvir">🔊</button>
      </div>
      <div class="anat-pt">${escapeHTML(r.pt)}</div>
      <div class="why">${r.slots}<br>${cfg.why}</div>
    </div>`;
  });

  /* 2b. os atalhos mentais, cada um com a sua frase viva */
  let atalhosHTML = '';
  ATALHOS.forEach((at, i)=>{
    const r = anatFrase(at.cfg);
    atalhosHTML += `<div class="anat-card" data-at="${i}" role="button" tabindex="0" title="Tocar para carregar esta combinação no montador">
      <h4>${i + 1}. ${at.nome}<span class="anat-usar">montar ↑</span></h4>
      <div class="atalho-mn">${at.mn}</div>
      <div class="why">${at.regra}</div>
      <div class="anat-frase-row" style="margin-top:8px;">
        <div class="anat-frase">${r.en}</div>
        <button class="audio-btn sm" data-text="${escapeHTML(r.texto)}" title="Ouvir">🔊</button>
      </div>
      <div class="anat-pt">${escapeHTML(r.pt)}</div>
    </div>`;
  });

  /* 3. o extremo, gerado de fato — serve de limite, não de modelo. Fica em afirmativa:
     a polaridade ("at all") só existe em frase negada e não convive com "already" ou "never",
     então o 15º encaixe nunca cabe junto dos outros 14. */
  const maxCfg = { t:"past", a:"simples", f:"afirmativa", v:"work",
    mid:["probably","also","always","already","really"],
    ends:["a bit","quickly","better than before","at home","twice","all day long","about an hour ago","yesterday","afterwards"] };
  const mx = anatFrase(maxCfg);
  const mxN = maxCfg.mid.length + maxCfg.ends.length;
  if(mxN !== SLOT_N - 1) console.warn('[anatomia] a frase-limite ocupa', mxN, 'de', SLOT_N - 1, 'encaixes possíveis');

  wrap.innerHTML = `
    <div class="anat-atalho">
      <b style="color:var(--brass)">O atalho mental:</b> depois do verbo (e do objeto), a frase inglesa
      pergunta sempre na mesma ordem —
      <b style="color:${ADJ_COLOR.como}">como</b> →
      <b style="color:${ADJ_COLOR.onde}">onde</b> →
      <b style="color:${ADJ_COLOR.quando}">quando</b>.
      Se lembrar só disso, acerta a esmagadora maioria das frases. Antes do verbo vale outra
      ordem, a do meio: ${nomesMeio}. E o objeto tem a sua própria fila, de oito adjetivos:
      ${ADJ7.map(t => `<b style="color:${ADJ_COLOR['adj_' + t.k]}">${t.n}</b>`).join(' → ')}.
    </div>

    <div class="ref-class-label">Seis atalhos mentais</div>
    <div class="anat-grid">${atalhosHTML}</div>

    <div class="ref-class-label">Combinações dos 8 adjetivos — duplas, trios e quartetos</div>
    <div id="combosWrap"></div>

    <div class="ref-class-label">O teto por cor</div>
    <div class="cor-resumo">
      <div class="cor-card"><div class="bolha" style="background:${ADJ_COLOR.como}"></div>
        <div class="n" style="color:${ADJ_COLOR.como}">${teto.como.length}</div><div class="rot">como</div>
        <div class="quais">${teto.como.join(' · ')}</div></div>
      <div class="cor-card"><div class="bolha" style="background:${ADJ_COLOR.onde}"></div>
        <div class="n" style="color:${ADJ_COLOR.onde}">${teto.onde.length}</div><div class="rot">onde</div>
        <div class="quais">${teto.onde.join(' · ')}</div></div>
      <div class="cor-card"><div class="bolha" style="background:${ADJ_COLOR.quando}"></div>
        <div class="n" style="color:${ADJ_COLOR.quando}">${teto.quando.length}</div><div class="rot">quando</div>
        <div class="quais">${teto.quando.join(' · ')}</div></div>
    </div>
    <div class="why" style="font-size:11px; color:var(--paper-dim); margin-bottom:4px;">
      Toque nos encaixes para montar e desmontar a frase — a tabela abaixo deixa de ser
      afirmação e vira algo que você confere.
    </div>
    <div id="montadorWrap"></div>
    <div class="dial-group" id="o2MontGroup" style="margin:10px 0 4px;">
      <div class="dial-group-title"><button type="button" class="o2-toggle" id="o2MontToggle" aria-expanded="false"></button></div>
      <div id="o2MontBody" hidden></div>
    </div>

    <div class="ref-class-label">Os ${SLOT_N} encaixes, na ordem em que aparecem na frase</div>
    <table class="slot-table">
      <thead><tr><th>#</th><th>encaixe</th><th>responde</th><th>exemplo</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    <div class="why" style="font-size:11px; color:var(--paper-dim); margin-bottom:6px;">
      Cada encaixe tem <b>uma</b> função e <b>uma</b> cor, e aceita <b>um</b> ocupante. Dois do
      mesmo encaixe competem ("everywhere <i>there</i>"); de encaixes diferentes, somam — mesmo
      sendo da mesma cor, como <span style="color:${ADJ_COLOR.como}">grau</span> +
      <span style="color:${ADJ_COLOR.como}">modo</span>. Por isso cabem até
      <b>${teto.como.length}</b> <span style="color:${ADJ_COLOR.como}">laranjas</span>,
      <b>${teto.onde.length}</b> <span style="color:${ADJ_COLOR.onde}">verde</span> e
      <b>${teto.quando.length}</b> <span style="color:${ADJ_COLOR.quando}">violetas</span>
      na mesma frase, sendo ${nMeio} delas antes do verbo.
    </div>

    <div class="ref-class-label">Glossário por encaixe</div>
    <div class="why" style="font-size:11px; color:var(--paper-dim); margin-bottom:2px;">
      O banco inteiro reorganizado pela pergunta que cada expressão responde — útil quando
      você sabe qual encaixe quer preencher e precisa da peça. Inclui o objeto: determinantes, substantivos e as opções de cada um dos 8 adjetivos, na ordem da frase.
    </div>
    <div id="glossarioWrap"></div>

    <div class="ref-class-label">Combinações que valem a pena — por situação</div>
    <div class="anat-grid">${cards}</div>

    <div class="ref-class-label">O limite — e por que não usá-lo</div>
    <div class="anat-frase-row">
      <div class="anat-frase">${mx.en}</div>
      <button class="mont-btn" data-usar-max="1">montar ↑</button>
      <button class="audio-btn sm" data-text="${escapeHTML(mx.texto)}" title="Ouvir">🔊</button>
    </div>
    <div class="anat-pt">${escapeHTML(mx.pt)}</div>
    <div class="anat-aviso">
      Esta frase é <b>gramaticalmente correta</b>: ${mxN} de ${SLOT_N} encaixes ocupados, todos na ordem certa.
      O que falta é a <b>polaridade</b> ("at all"): ela só existe em frase negada, e a negação
      não aceita peças como "already" e "also". Mas ninguém fala assim — e ela ainda se contradiz
      ("há cerca de uma hora" × "ontem", "duas vezes" × "o dia inteiro"). O motor garante a
      <b>estrutura</b>; a <b>coerência</b> é sua. Na prática, o ponto ideal fica entre <b>2 e 4</b> encaixes.
    </div>`;
  wrap.querySelectorAll('.anat-card[data-ex]').forEach(card=>{
    const usar = (e)=>{
      if(e.target.closest('.audio-btn')) return;   /* ouvir não aplica */
      aplicarNoMontador(ANAT_EXEMPLOS[+card.dataset.ex]);
    };
    card.onclick = usar;
    card.onkeydown = (e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); usar(e); } };
  });
  wrap.querySelectorAll('.anat-card[data-at]').forEach(card=>{
    const usar = (e)=>{
      if(e.target.closest('.audio-btn')) return;
      aplicarNoMontador(ATALHOS[+card.dataset.at].cfg);
    };
    card.onclick = usar;
    card.onkeydown = (e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); usar(e); } };
  });
  const btnMax = wrap.querySelector('[data-usar-max]');
  if(btnMax) btnMax.onclick = ()=> aplicarNoMontador(maxCfg);

  buildMontador();
  buildGlossario();
  buildCombos();
}

/* ================================================================================
   v176 · COMBINAÇÕES DOS 8 ADJETIVOS — duplas, trios e quartetos como atalho de estudo
   Escolher 2, 3 ou 4 dos 8 tipos dá C(8,2)=28, C(8,3)=56 e C(8,4)=70 combinações. A ORDEM de dentro de cada
   uma é sempre a fixa (opinião → … → propósito), então o aluno treina "quais tipos costumam andar juntos"
   sem nunca decorar posição. Cada cartão tem uma frase pronta (toque → carrega no montador).
   Estado: combN (2/3/4, ou 0 = "as mais úteis"), combFiltro (tipos que a combinação precisa conter) e
   combSem (0 = palavras-modelo fixas; >0 = sorteio reproduzível com as ~1.090 opções). */
let combN = 0, combFiltro = new Set(), combSem = 0, combAtual = [];
const COMB_NOMES = ['table', 'car', 'bag', 'lamp', 'jacket', 'vase', 'watch', 'chair', 'dress', 'box', 'bottle', 'hat'];
/* palavras-modelo: as mais frequentes de cada tipo (as que o aluno de fato vai usar) */
const COMB_BASE = {
  opiniao:['lovely', 'nice', 'beautiful', 'strange', 'comfortable', 'famous', 'cheap', 'useful'],
  tamanho:['big', 'small', 'tall', 'long', 'huge', 'tiny', 'wide', 'heavy'],
  idade:['old', 'new', 'modern', 'antique', 'vintage', 'young', 'classic', 'used'],
  forma:['round', 'square', 'flat', 'curved', 'rectangular', 'oval', 'pointed', 'straight'],
  cor:['red', 'blue', 'black', 'green', 'white', 'brown', 'grey', 'yellow'],
  origem:['Italian', 'French', 'Japanese', 'Chinese', 'German', 'Brazilian', 'Swiss', 'English'],
  material:['wooden', 'leather', 'metal', 'silk', 'glass', 'plastic', 'cotton', 'stone'],
  proposito:['dining', 'sleeping', 'running', 'travel', 'cooking', 'writing', 'shopping', 'party']
};
/* as combinações que mais aparecem no inglês de verdade, com a razão de cada uma */
const COMB_TOP = [
  { tipos:['opiniao', 'cor'], n:{ det:'a', noun:'dress', adj:{ opiniao:'lovely', cor:'red' } }, why:'A dupla mais natural para descrever um objeto: o que acho + a cor.' },
  { tipos:['tamanho', 'cor'], n:{ det:'a', noun:'car', adj:{ tamanho:'big', cor:'blue' } }, why:'Tamanho vem antes da cor: “a big blue car”, nunca “a blue big car”.' },
  { tipos:['idade', 'cor'], n:{ det:'a', noun:'umbrella', adj:{ idade:'old', cor:'black' } }, why:'Idade antes da cor. Repare em “an old”: a/an segue o som da palavra seguinte.' },
  { tipos:['cor', 'material'], n:{ det:'a', noun:'bag', adj:{ cor:'brown', material:'leather' } }, why:'Cor + material, o par clássico de loja e catálogo.' },
  { tipos:['origem', 'material'], n:{ det:'a', noun:'jacket', adj:{ origem:'Italian', material:'leather' } }, why:'Quanto mais “classificatório”, mais perto do substantivo: origem → material.' },
  { tipos:['material', 'proposito'], n:{ det:'a', noun:'table', adj:{ material:'wooden', proposito:'dining' } }, why:'O propósito fica colado ao substantivo: “a wooden dining table”.' },
  { tipos:['forma', 'cor'], n:{ det:'a', noun:'box', adj:{ forma:'square', cor:'green' } }, why:'A forma antecede a cor: “a square green box”.' },
  { tipos:['opiniao', 'tamanho', 'cor'], n:{ det:'a', noun:'lamp', adj:{ opiniao:'beautiful', tamanho:'small', cor:'white' } }, why:'O trio mais frequente: opino, meço, pinto.' },
  { tipos:['tamanho', 'idade', 'cor'], n:{ det:'a', noun:'chair', adj:{ tamanho:'big', idade:'old', cor:'brown' } }, why:'Três fatos objetivos em fila: tamanho → idade → cor.' },
  { tipos:['idade', 'cor', 'material'], n:{ det:'a', noun:'sofa', adj:{ idade:'old', cor:'brown', material:'leather' } }, why:'Idade → cor → material: a descrição de qualquer peça de brechó.' },
  { tipos:['opiniao', 'idade', 'origem'], n:{ det:'a', noun:'vase', adj:{ opiniao:'lovely', idade:'antique', origem:'Chinese' } }, why:'Uma opinião abrindo e a origem fechando perto do substantivo.' },
  { tipos:['opiniao', 'tamanho', 'idade', 'cor'], n:{ det:'a', noun:'house', adj:{ opiniao:'lovely', tamanho:'small', idade:'old', cor:'white' } }, why:'Quarteto de apresentação de imóvel: “a lovely small old white house”.' },
  { tipos:['tamanho', 'cor', 'origem', 'material'], n:{ det:'a', noun:'bag', adj:{ tamanho:'small', cor:'red', origem:'Italian', material:'leather' } }, why:'Quarteto de vitrine: tamanho → cor → origem → material.' },
  { tipos:['opiniao', 'idade', 'material', 'proposito'], n:{ det:'a', noun:'table', adj:{ opiniao:'lovely', idade:'old', material:'wooden', proposito:'dining' } }, why:'Quarteto de leilão: opinião, idade, material e finalidade.' }
];
const COMB_TIPOS = ADJ7_CHAVES;                                    /* índice 0–7 → chave do tipo, já na ordem fixa */
function combLista(n){                                             /* todas as combinações de n tipos (índices crescentes) */
  const out = [];
  (function rec(ini, acc){
    if(acc.length === n){ out.push(acc.slice()); return; }
    for(let i = ini; i < 8; i++){ acc.push(i); rec(i + 1, acc); acc.pop(); }
  })(0, []);
  return out;
}
/* sorteio reproduzível (sem Math.random): a mesma "semente" sempre gera o mesmo conjunto de palavras */
function combPr(a, b){ let x = (Math.imul(a + 7, 374761393) + Math.imul(b + 13, 668265263)) >>> 0; x = Math.imul(x ^ (x >>> 13), 1274126177) >>> 0; return (x ^ (x >>> 16)) >>> 0; }
function combMontaCfg(tipos, idx){
  let noun, adj = {};
  if(combSem === 0){
    noun = COMB_NOMES[idx % COMB_NOMES.length];
    tipos.forEach(i => { adj[COMB_TIPOS[i]] = COMB_BASE[COMB_TIPOS[i]][(idx + i) % 8]; });
  } else {
    noun = NP_SUBS[combPr(combSem, idx) % NP_SUBS.length].en;
    tipos.forEach(i => { const ops = ADJ7[i].ops; adj[COMB_TIPOS[i]] = ops[combPr(combSem * 1000 + idx, i) % ops.length].en; });
  }
  return { t:'past', a:'simples', f:'afirmativa', v:npSub(noun).v, np:{ det:'a', noun, adj } };
}
function combBuild(){
  const lista = combN === 0
    ? COMB_TOP.map(c => ({ tipos:c.tipos.map(k => COMB_TIPOS.indexOf(k)), cfg:{ t:'past', a:'simples', f:'afirmativa', v:npSub(c.n.noun).v, np:c.n }, why:c.why }))
    : combLista(combN).map((tipos, idx) => ({ tipos, cfg:combMontaCfg(tipos, idx), why:'' }));
  return lista.filter(c => [...combFiltro].every(i => c.tipos.includes(i)));
}
const combRot = i => `<b style="color:${ADJ_COLOR['adj_' + COMB_TIPOS[i]]}">${ADJ7[i].n}</b>`;
function buildCombos(){
  const box = document.getElementById('combosWrap'); if(!box) return;
  combAtual = combBuild();
  const tab = (n, rot, q) => `<button type="button" class="np-sub" data-comb-n="${n}" data-on="${combN === n}">${rot} <i>${q}</i></button>`;
  const tipos = COMB_TIPOS.map((k, i) => `<button type="button" class="np-sub" data-comb-tipo="${i}" data-on="${combFiltro.has(i)}" style="--cat:${ADJ_COLOR['adj_' + k]}">${ADJ7[i].n}</button>`).join('');
  const cards = combAtual.map((c, i) => {
    const r = anatFrase(c.cfg);
    return `<div class="anat-card comb-card" data-comb="${i}" role="button" tabindex="0" title="Tocar para carregar esta combinação no montador">
      <h4>${c.tipos.map(combRot).join(' + ')}<span class="anat-usar">montar ↑</span></h4>
      <div class="anat-frase-row"><div class="anat-frase">${r.en}</div>
        <button class="audio-btn sm" data-text="${escapeHTML(r.texto)}" title="Ouvir">🔊</button></div>
      <div class="anat-pt">${escapeHTML(r.pt)}</div>
      ${c.why ? `<div class="why">${c.why}</div>` : ''}</div>`;
  }).join('');
  box.innerHTML = `
    <div class="why" style="font-size:11px; color:var(--paper-dim); margin-bottom:6px;">
      Em inglês a ordem se chama <b>OSASCOMP</b> — <i>Opinion, Size, Age, Shape, Colour, Origin, Material, Purpose</i>.
      Dentro de qualquer combinação a fila é sempre esta; o que você treina aqui é <b>quais tipos andam juntos</b>.
      Toque em um cartão para montar a frase e trocar as palavras.
    </div>
    <div class="np-subs" style="--cat:var(--brass); padding-left:0; padding-right:0;">
      ${tab(0, 'as mais úteis', COMB_TOP.length)}${tab(2, 'duplas', 28)}${tab(3, 'trios', 56)}${tab(4, 'quartetos', 70)}
    </div>
    <div class="np-subs" style="padding-left:0; padding-right:0;" aria-label="Só combinações que contenham…">
      <span class="comb-leg">contém:</span>${tipos}
      <button type="button" class="np-sub" data-comb-limpa="1" style="--cat:var(--brass)">limpar</button>
    </div>
    <div class="np-subs" style="--cat:var(--brass); padding-left:0; padding-right:0;">
      <button type="button" class="np-sub" data-comb-sorteia="1" data-on="${combSem > 0}">🎲 outras palavras</button>
      <button type="button" class="np-sub" data-comb-modelo="1" data-on="${combSem === 0}">↺ palavras-modelo</button>
      <span class="comb-leg">${combAtual.length} combinação(ões)</span>
    </div>
    <div class="anat-grid">${cards || '<div class="why">Nenhuma combinação contém todos os tipos marcados — desmarque algum.</div>'}</div>`;
  box.querySelectorAll('[data-comb-n]').forEach(b => { b.onclick = () => { combN = +b.dataset.combN; buildCombos(); }; });
  box.querySelectorAll('[data-comb-tipo]').forEach(b => { b.onclick = () => { const i = +b.dataset.combTipo; combFiltro.has(i) ? combFiltro.delete(i) : combFiltro.add(i); buildCombos(); }; });
  const limpa = box.querySelector('[data-comb-limpa]'); if(limpa) limpa.onclick = () => { combFiltro.clear(); buildCombos(); };
  const sorteia = box.querySelector('[data-comb-sorteia]'); if(sorteia) sorteia.onclick = () => { combSem++; buildCombos(); };
  const modelo = box.querySelector('[data-comb-modelo]'); if(modelo) modelo.onclick = () => { combSem = 0; buildCombos(); };
  box.querySelectorAll('.comb-card').forEach(card => {
    const usar = e => { if(e.target.closest('.audio-btn')) return; aplicarNoMontador(combAtual[+card.dataset.comb].cfg); };
    card.onclick = usar;
    card.onkeydown = e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); usar(e); } };
  });
}

/* ================================================================================
   v123 · PARÁGRAFOS — repositório de inteligência e consulta
   Três frentes combinadas: TEMPO VERBAL + ENCAIXES (palavras-sinal e colocações) + ORAÇÕES ligadas por conjunção.
   Nada aqui é texto fixo em inglês: cada frase é uma CONFIGURAÇÃO que o motor monta (mesmas cores, tradução e áudio
   do console). O que é escrito à mão é só a explicação: por que aquelas peças e conjunções foram escolhidas.
   Formato de cada frase: { p pronome, t tempo, a aspecto, f formato?, v verbo, col colocação (texto EN), mid[], ends[],
     o2:{ k tipo, cj conjunção (EN), op opção pelo texto | v verbo 2 (+vneg), neg, c2, cnd, tr, mid[], ends[] }, why }
   ================================================================================ */
const PAR_CTX = { id:'par', rotulo:'', ids:{ body:'parNada', toggle:'parNada' }, ui:{ a:false, c:null, b:'', f:null, g:0 }, cur:null,
  get: () => PAR_CTX.cur, salva: () => {}, render: () => {} };
/* monta UMA frase a partir da configuração; grita no console se alguma peça não existir (em vez de cair no padrão em silêncio) */
function parFrase(c, onde){
  const av = m => console.warn('[paragrafos] ' + m + ' → ' + onde);
  const verb = verbById(c.v); if(verb.id !== c.v) av('verbo inexistente: ' + c.v);
  const f = c.f || 'afirmativa', pool = SIGNAL_WORDS[c.t + '_' + c.a] || [];
  const achar = x => { const s = pool.find(y => y.w === x); if(!s) av('sinal ausente em ' + c.t + '_' + c.a + ': ' + x); else if(!signalAllowed(s, f)) av('sinal não vale no formato: ' + x); return s; };
  const mids = (c.mid || []).map(achar).filter(Boolean), ends = (c.ends || []).map(achar).filter(Boolean);
  let ci = null; if(c.col){ ci = (verb.col || []).findIndex(x => x.en === c.col); if(ci < 0){ av('colocação ausente: ' + c.v + ' ' + c.col); ci = null; } }
  let o2s = null;
  if(c.o2){ const T = O2_TIPOS.find(t => t.k === c.o2.k);
    if(!T) av('tipo de oração inexistente: ' + c.o2.k);
    else { let cj = T.conjs.findIndex(x => x.en === c.o2.cj); if(cj < 0){ av('conjunção ausente: ' + c.o2.cj); cj = 0; }
      if(c.o2.q && !O2_Q[c.o2.q]) av('sujeito concreto inexistente: ' + c.o2.q);
      o2s = { tipo:T.k, conj:cj, opt:0, neg:!!c.o2.neg, q:c.o2.q || null, custom:null, para:null, c2:c.o2.c2 === undefined ? null : c.o2.c2,
              cnd:c.o2.cnd === undefined ? null : c.o2.cnd, tr:c.o2.tr || null, sj2:c.o2.sj2 || null, tp2:c.o2.tp2 || null, as2:c.o2.as2 || null, foco:1, sl2:{ signalMids:[], signalEnds:[] } }; } }
  PAR_CTX.cur = { tempo:c.t, aspecto:c.a, pronome:c.p, formato:f, verbo:c.v, colocacao:ci, o2:o2s, signalMids:mids, signalEnds:ends };
  return o2Em(PAR_CTX, () => {
    let o2 = null, T = null, cjo = null;
    if(o2s){
      o2Norm(); T = O2_TIPOS.find(t => t.k === o2s.tipo); cjo = T.conjs[state.o2.conj];
      if(c.o2.op !== undefined || c.o2.v !== undefined || c.o2.wh !== undefined){                 /* a opção é achada pelo TEXTO, não pelo índice (resiste a reordenações do banco) */
        const ops = o2Opcoes(T.k, verb, state.o2.conj) || [];
        const i = ops.findIndex(op => c.o2.wh !== undefined ? !!(op.wh && op.wh.n === c.o2.wh) : c.o2.op !== undefined ? op.en === c.o2.op : (op.v === c.o2.v && !!op.neg === !!c.o2.vneg));
        if(i < 0) av('opção de 2ª oração ausente: ' + JSON.stringify(c.o2) + ' · há: ' + ops.map(op => op.en || op.v).join(' | ')); else state.o2.opt = i;
      }
      if(c.o2.mid || c.o2.ends){ const l2 = o2PalavrasSinal2(o2Ctx2()), a2 = x => { const s = l2.find(y => y.w === x); if(!s) av('sinal da 2ª oração ausente: ' + x); return s; };
        state.o2.sl2 = { signalMids:(c.o2.mid || []).map(a2).filter(Boolean), signalEnds:(c.o2.ends || []).map(a2).filter(Boolean) }; }
      o2 = o2Compor(); if(!o2) av('2ª oração não montou: ' + JSON.stringify(c.o2));
    }
    const col = ci !== null ? verb.col[ci] : null;
    const g = generate('fact', c.t, c.a, f, c.p, verb);
    const withSignal = applySignal(g.text, mids.length ? mids : null, ends, col, null, f), fim = g.isQuestion ? M('?') : '.';
    let pt; ptCondModo = o2 ? (o2.ptModo || null) : null;
    try { pt = translate('fact', c.t, c.a, f, c.p, mids.length ? mids : null, ends, c.v, col, null); } finally { ptCondModo = null; }
    let raw = withSignal + fim;
    if(o2){ const j = o2Junta(o2, withSignal, pt, fim); raw = j.raw; pt = j.pt; }
    const leg = l => sortSlots(l).map(s => ({ w:s.w, nome:END_SLOT_NOME[slotOf(s)], kind:adjKind(s.cls, s.w) }));
    return { html:markedToHTML(raw, markColorVar(f)), texto:stripMarks(raw), pt:pt.trim(), slots:leg(mids.concat(ends)),
      sl2:o2 ? leg(state.o2.sl2.signalMids.concat(state.o2.sl2.signalEnds)) : [], col, verb, tipo:o2 ? T : null, conj:o2 ? cjo.en : null, trLabel:o2 ? (o2.trLabel || null) : null,
      /* estado pronto para "abrir no console" (cópia: o contexto é descartado ao sair) */
      st:{ pronome:c.p, tempo:c.t, aspecto:c.a, formato:f, verbo:c.v, colocacao:ci, signalMids:mids.slice(), signalEnds:ends.slice(), o2:o2 ? JSON.parse(JSON.stringify(state.o2)) : null } };
  });
}
const PAR_NIVEL = { 1:'Base', 2:'Intermediário', 3:'Avançado' };
const PAR_TEMA_IC = { estudo:'📘', trabalho:'💼', 'saúde':'🏃', 'finanças':'💰', tecnologia:'💻', viagem:'🧳', vida:'🌱', casa:'🏠', carreira:'🧭', 'comunicação':'💬', 'negócios':'📈' };
const PARAGRAFOS = [
 { id:'est1', r:'objetivo', tema:'estudo', nivel:1, titulo:'A rotina que constrói o resultado',
   ideia:'Um hábito de estudo, um esforço pontual e o plano que vem a seguir.',
   n:{ v:'<i>Study</i> e <i>practice</i> são do mesmo campo (aprender fazendo), então o texto troca de verbo sem trocar de assunto. Os dois aceitam <i>English</i> como objeto, o que mantém o fio do parágrafo.',
       t:'Presente simples para o <b>hábito</b>, passado simples para um <b>dia específico</b> e futuro para o <b>plano</b>. Tudo no aspecto simples: são fatos inteiros, não processos em andamento.',
       e:'O hábito recebe três peças que se completam (<i>usually</i> = com que frequência, <i>at home</i> = onde, <i>every evening</i> = de quanto em quanto). O fato recebe só a data (<i>yesterday</i>) e o plano só o marco (<i>tomorrow</i>): cada tempo chama a sua peça.',
       c:'<b>Finalidade + concessão + tempo</b> formam o esqueleto de um relato de progresso: para que eu faço, o que enfrento e o que vem a seguir. É a combinação mais útil para falar de metas, em entrevista, aula ou trabalho.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'study', col:'English', mid:['usually'], ends:['at home','every evening'], o2:{ k:'final', cj:'in order to', op:'get a better job' }, why:'Hábito pede presente simples. <i>Usually</i> vai antes do verbo; lugar vem antes de periodicidade (onde → quando). <i>In order to</i> + infinitivo dá o objetivo, com o mesmo sujeito.' },
    { p:'She', t:'past', a:'simples', v:'study', col:'hard', ends:['yesterday'], o2:{ k:'conc', cj:'although', op:'tiring' }, why:'<i>Yesterday</i> fecha o tempo no passado simples. <i>Although</i> abre a frase com o obstáculo e a vírgula separa as orações: o esforço aconteceu <b>apesar</b> do cansaço.' },
    { p:'She', t:'future', a:'simples', v:'practice', col:'English', ends:['tomorrow'], o2:{ k:'temp', cj:'as soon as', op:'the lesson' }, why:'A principal vai para <i>will</i>, mas depois de <i>as soon as</i> o inglês usa <b>presente simples</b> (finishes), nunca will. Em português vira futuro do subjuntivo (terminar).' }
   ] },
 { id:'est2', r:'sequencia', tema:'estudo', nivel:2, titulo:'Da leitura à prática diária',
   ideia:'Uma sequência no passado que explica o hábito de agora e uma previsão.',
   n:{ v:'<i>Read → write → practice → study</i>: os verbos seguem a ordem natural do aprendizado (receber, produzir, repetir, aprofundar). A escolha dos verbos já conta a história antes das conjunções.',
       t:'Dois passados simples em cadeia, depois presente simples e futuro. O aspecto fica simples porque o interesse é a <b>ordem</b> dos fatos, não a duração de cada um.',
       e:'<i>Slowly last night</i> (como → quando) descreve a leitura; <i>after that</i> costura a segunda ação à primeira; <i>now</i> vira a página para o presente; <i>probably</i> e <i>next week</i> dão certeza e data ao futuro.',
       c:'<b>Tempo (before) + finalidade + causa + condição</b>: a ordem dos fatos, o objetivo, o motivo e o que depende de quê. Juntas, essas quatro ligações cobrem quase tudo o que se pergunta sobre uma ação: quando, para quê, por quê e em que caso.' },
   s:[
    { p:'He', t:'past', a:'simples', v:'read', col:'the book', ends:['slowly','last night'], o2:{ k:'temp', cj:'before', op:'the notes' }, why:'Modo antes de tempo (como → quando): <i>slowly last night</i>. <i>Before</i> liga duas ações do passado e mostra qual veio primeiro.' },
    { p:'He', t:'past', a:'simples', v:'write', col:'in English', ends:['after that'], o2:{ k:'final', cj:'in order to', op:'share {p} ideas' }, why:'<i>After that</i> é peça de <b>sequência</b>: abre a frase com vírgula e amarra esta frase à anterior. A finalidade explica para que ele escreveu.' },
    { p:'He', t:'present', a:'simples', v:'practice', col:'English', mid:['now'], ends:['every day'], o2:{ k:'caus', cj:'because', op:'to learn more' }, why:'<i>Now</i> marca a virada para o presente; <i>every day</i> confirma o hábito. <i>Because</i> traz o motivo, com sujeito e verbo próprios.' },
    { p:'He', t:'future', a:'simples', v:'study', mid:['probably'], ends:['next week'], o2:{ k:'cond', cj:'if', op:'a good grade' }, why:'<i>Probably</i> fica entre <i>will</i> e o verbo. Condicional real (tipo 1): <i>will</i> na principal, <b>presente</b> depois de <i>if</i>.' }
   ] },
 { id:'est3', r:'proporcao', tema:'estudo', nivel:3, titulo:'Quanto mais prática, mais resultado',
   ideia:'Proporção, hábito antigo, hipótese e resultado: quatro formas de ligar esforço e consequência.',
   n:{ v:'<i>Practice</i> e <i>study</i> se alternam, e <i>learn</i> aparece só como resultado. Assim o texto separa o esforço (praticar, estudar) do ganho (aprender).',
       t:'Presente simples para a regra geral, passado simples para o hábito antigo, <i>would</i> para a hipótese e present perfect para o que vem acontecendo. Quatro tempos, porque cada lógica pede o seu.',
       e:'Quase não há peças: a proporção e a condicional já ocupam a frase com a própria estrutura. Só o present perfect ganha <i>lately</i>, que é justamente a peça que o justifica.',
       c:'<b>Proporção + hábito no passado + hipótese + consequência</b>: quatro maneiras de ligar esforço e resultado. Saber alternar entre elas evita repetir <i>because</i> e <i>so</i> o tempo todo, que é o que deixa um texto com cara de iniciante.' },
   s:[
    { p:'They', t:'present', a:'simples', v:'practice', col:'English', o2:{ k:'prop', cj:'the more … the more', v:'learn' }, why:'Estrutura fixa: <i>the more</i> + sujeito + verbo, vírgula, <i>the more</i> + sujeito + verbo. Sem encaixes: a própria estrutura já ocupa a frase.' },
    { p:'They', t:'past', a:'simples', v:'study', col:'for the exam', o2:{ k:'temp', cj:'whenever', op:'the chapter' }, why:'<i>Whenever</i> no passado é repetição. O inglês usa passado simples nas duas orações; o português troca para o <b>imperfeito</b> (estudavam… liam).' },
    { p:'They', t:'future', a:'simples', v:'study', col:'hard', o2:{ k:'cond', cj:'if', op:'a good grade', cnd:2 }, why:'Condicional hipotética (tipo 2): <i>would</i> na principal e <b>passado</b> depois de <i>if</i>. Em português: futuro do pretérito + imperfeito do subjuntivo.' },
    { p:'They', t:'present', a:'perfeito', v:'practice', ends:['lately'], o2:{ k:'cons', cj:'so', op:'confident' }, why:'<i>Lately</i> pede present perfect: algo que começou antes e chega até agora. <i>So</i> vem depois de vírgula e apresenta a consequência.' }
   ] },
 { id:'prop1', r:'proporcao', tema:'estudo', nivel:2, titulo:'Ler mais, aprender mais',
   ideia:'Uma regra de proporção, a intensidade do esforço e uma comparação.',
   n:{ v:'<i>Read</i> e <i>study</i> nomeiam o esforço e <i>learn</i> nomeia o ganho. Separar os dois em verbos diferentes é o que permite medir um pelo outro.',
       t:'Tudo no presente simples: são regras gerais e comparações permanentes.',
       e:'Nenhuma palavra-sinal: as três estruturas já ocupam os lugares da frase. O modo vem embutido na própria comparação (<i>seriously</i>, <i>carefully</i>).',
       c:'<b>Proporção + consequência intensiva + comparação de igualdade</b>: três formas de medir. A primeira liga duas quantidades, a segunda mede pelo resultado (<i>so… that</i>) e a terceira mede contra outra pessoa (<i>as… as</i>). Juntas, ensinam a graduar o que se diz.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'read', o2:{ k:'prop', cj:'the more … the more', v:'learn' }, why:'<i>The more</i> + oração, vírgula, <i>the more</i> + oração.' },
    { p:'I', t:'present', a:'simples', v:'study', o2:{ k:'csq', cj:'so … that', op:'more' }, why:'<i>So</i> + advérbio + <i>that</i>: a intensidade produz o resultado.' },
    { p:'I', t:'present', a:'simples', v:'read', col:'the book', o2:{ k:'cmp', cj:'as … as', op:'carefully' }, why:'<i>As</i> + advérbio + <i>as</i> + sujeito + auxiliar (<i>you do</i>): o auxiliar substitui o verbo repetido.' }
   ] },
 { id:'arg2', r:'argumento', tema:'estudo', nivel:3, titulo:'Uma tese com fundamento',
   ideia:'Uma afirmação apresentada como evidente, a sua base e a verdade que se conclui.',
   n:{ v:'<i>Study, practice, improve</i>: estudar e praticar são o que se faz; <i>improve</i> é o que se comprova. A tese usa o verbo do esforço e o fecho usa o verbo do resultado.',
       t:'Presente simples para a tese e a base; present perfect para o que se comprova no fim.',
       e:'<i>Hard</i> e <i>every day</i> sustentam a tese; <i>really… lately</i> dá força e recência à conclusão.',
       c:'<b>Subjetiva + explicativa + predicativa</b>: afirmo (<i>It is obvious that</i>), fundamento (<i>for</i>) e declaro a verdade (<i>The truth is that</i>). É o esqueleto de um parágrafo argumentativo de redação: tese, argumento e fecho.' },
   s:[
    { p:'They', t:'present', a:'simples', v:'study', col:'hard', o2:{ k:'subj', cj:'It is … that', op:'obvious' }, why:'A tese entra como algo óbvio: quem lê já começa concordando, e o resto do parágrafo só precisa sustentar.' },
    { p:'They', t:'present', a:'simples', v:'practice', col:'English', ends:['every day'], o2:{ k:'expl', cj:'for', op:'to learn more' }, why:'O fundamento vem com <i>for</i> depois de vírgula: mais formal que <i>because</i>, apresenta o motivo como justificativa de quem escreve.' },
    { p:'They', t:'present', a:'perfeito', v:'improve', mid:['really'], ends:['lately'], o2:{ k:'pred', cj:'… is that', op:'truth' }, why:'O fecho: uma verdade no present perfect, porque vale até agora.' }
   ] },
 { id:'exp1', r:'explicar', tema:'estudo', nivel:2, titulo:'Explicar e concluir',
   ideia:'Um hábito com o seu fundamento, o resultado que se conclui dele e o próximo passo.',
   n:{ v:'<i>Study</i> e <i>practice</i>: o esforço é dito com dois verbos próximos, para que a explicação e a conclusão falem do mesmo assunto sem repetir a palavra.',
       t:'Presente simples (hábito), present perfect (o que vem acontecendo) e futuro (previsão). O perfect é essencial na conclusão: o resultado nasce do passado recente e vale agora.',
       e:'<i>Hard</i> e <i>every day</i> descrevem o hábito; <i>really</i> intensifica; <i>lately</i> justifica o present perfect; <i>probably… tomorrow</i> fecha.',
       c:'<b>Explicação (for) + conclusão (so)</b> é o par do raciocínio: primeiro o fundamento, depois o que se conclui dele. <i>For</i> explica uma afirmação já feita (por isso vem depois de vírgula), e <i>so</i> tira a consequência. Quem domina o par consegue argumentar, não só relatar.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'study', col:'hard', ends:['every day'], o2:{ k:'expl', cj:'for', op:'a good grade' }, why:'<i>For</i> explicativo vem depois de vírgula e justifica a afirmação anterior. É mais formal que <i>because</i> e nunca abre a frase.' },
    { p:'She', t:'present', a:'perfeito', v:'practice', mid:['really'], ends:['lately'], o2:{ k:'cons', cj:'so', op:'confident' }, why:'<i>Lately</i> pede present perfect nas duas orações. <i>So</i>, depois de vírgula, apresenta o que se conclui do esforço.' },
    { p:'She', t:'future', a:'simples', v:'practice', col:'English', mid:['probably'], ends:['tomorrow'], o2:{ k:'final', cj:'to', op:'reach fluency' }, why:'O fecho olha para a frente: previsão moderada (<i>probably</i>), data e objetivo.' }
   ] },
 { id:'exp4', r:'explicar', tema:'viagem', nivel:1, titulo:'Sair cedo tem motivo',
   ideia:'Um hábito, a razão por trás dele e a prova de que funciona.',
   n:{ v:'<i>Leave, drive, arrive</i>: sair, ir e chegar. Os três verbos cobrem o trajeto inteiro, então a explicação e a conclusão falam da mesma viagem.',
       t:'Dois presentes simples para o hábito e um passado simples para o dia que serve de prova (<i>yesterday</i>).',
       e:'<i>Always</i> e <i>every day</i> marcam a regra; <i>early</i> aparece no hábito e no resultado, ligando as duas pontas; <i>yesterday</i> data o exemplo.',
       c:'<b>Explicação (for) + causa (because) + conclusão (so)</b>: duas razões e um resultado. <i>For</i> justifica a afirmação, <i>because</i> aponta o motivo concreto e <i>so</i> mostra o efeito. É a estrutura mínima de um argumento: digo, justifico e comprovo.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'leave', col:'early', mid:['always'], o2:{ k:'expl', cj:'for', op:'to save time' }, why:'A afirmação vem primeiro; <i>for</i>, depois de vírgula, traz o fundamento. Nunca abre a frase.' },
    { p:'She', t:'present', a:'simples', v:'drive', col:'to work', ends:['every day'], o2:{ k:'caus', cj:'because', op:'heavy traffic' }, why:'<i>Because</i> dá o motivo concreto, sem vírgula. Destino antes de periodicidade.' },
    { p:'She', t:'past', a:'simples', v:'arrive', col:'early', ends:['yesterday'], o2:{ k:'cons', cj:'so', op:'time' }, why:'O caso de ontem funciona como prova: <i>so</i> mostra o ganho.' }
   ] },
 { id:'exp5', r:'explicar', tema:'casa', nivel:2, titulo:'A casa pronta para receber',
   ideia:'O que está sendo feito e por quê, o que já rendeu e o que se espera.',
   n:{ v:'<i>Clean, fix, cook</i>: limpar, consertar, cozinhar. Três tarefas de quem prepara a casa, cada uma num momento.',
       t:'Presente <b>contínuo</b> (está acontecendo hoje), passado simples (já foi feito) e futuro (vai acontecer à noite).',
       e:'<i>Today</i>, <i>yesterday</i> e <i>tonight</i>: uma peça de tempo por frase, cada uma combinando com o seu tempo verbal.',
       c:'<b>Explicação + conclusão + conclusão</b>: uma razão (<i>for they expect guests</i>) organiza tudo, e dois resultados fecham, um já colhido (<i>so</i>) e um esperado (<i>and so</i>). Mostra que a conclusão acompanha o tempo da principal: passado com passado, futuro com futuro.' },
   s:[
    { p:'They', t:'present', a:'continuo', v:'clean', col:'the house', ends:['today'], o2:{ k:'expl', cj:'for', op:'guests' }, why:'Ação em curso + explicação. A oração com <i>for</i> fica no presente simples: o motivo vale agora.' },
    { p:'They', t:'past', a:'simples', v:'fix', col:'the sink', ends:['yesterday'], o2:{ k:'cons', cj:'so', op:'time' }, why:'Fato e consequência ficam no mesmo tempo (passado): <i>so</i> mostra que o ganho de tempo saiu diretamente do conserto.' },
    { p:'They', t:'future', a:'simples', v:'cook', col:'dinner', ends:['tonight'], o2:{ k:'cons', cj:'and so', op:'the meal' }, why:'<i>And so</i> soma e conclui. Com <i>will</i> na principal, a conclusão também leva <i>will</i>.' }
   ] },
 { id:'exp6', r:'explicar', tema:'comunicação', nivel:3, titulo:'Perguntar para ter clareza',
   ideia:'Uma atitude justificada, o seu efeito e a ideia central.',
   n:{ v:'<i>Ask, call, listen</i>: perguntar, ligar, escutar. Todos são verbos de buscar informação.',
       t:'Presente simples (atitude), passado simples (um caso) e presente simples de novo (a conclusão geral).',
       e:'Só <i>always</i>, <i>yesterday</i> e o modo <i>carefully</i>. O peso está nas ligações, não nas peças.',
       c:'<b>Explicação + conclusão + predicativa</b>: depois de justificar e concluir, <i>The point is that…</i> resume o parágrafo numa tese. Fechar um raciocínio nomeando o ponto central é recurso de quem escreve bem.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'ask', col:'the teacher', mid:['always'], o2:{ k:'expl', cj:'for', op:'to be clear' }, why:'A atitude (perguntar sempre) vem primeiro; o fundamento com <i>for</i> mostra que não é insegurança, é busca de clareza.' },
    { p:'He', t:'past', a:'simples', v:'call', col:'the office', ends:['yesterday'], o2:{ k:'cons', cj:'so', op:'the plan' }, why:'Um exemplo concreto, com data, e o que resultou dele: a ligação de ontem é a prova do hábito descrito antes.' },
    { p:'He', t:'present', a:'simples', v:'listen', col:'carefully', o2:{ k:'pred', cj:'… is that', op:'point' }, why:'<i>The point is that</i> + frase completa: a oração inteira funciona como o "ponto".' }
   ] },
 { id:'trab1', r:'objetivo', tema:'trabalho', nivel:1, titulo:'A semana da apresentação',
   ideia:'O que está em andamento, o que foi preparado e o que vem depois.',
   n:{ v:'<i>Work → prepare → present → rest</i>: o ciclo de uma entrega, do esforço ao descanso. São verbos de ação com objeto claro (<i>a presentation</i>, <i>the results</i>), o que deixa cada frase concreta.',
       t:'Presente <b>contínuo</b> para o que está em curso agora, passado simples para o que já foi feito e futuro para o que falta. O contínuo aparece só na primeira frase porque só ela descreve algo em andamento.',
       e:'<i>Currently</i> reforça o "agora" do contínuo; <i>carefully yesterday</i> segue como → quando; <i>at the office tomorrow</i> segue onde → quando; <i>after that</i> fecha a sequência.',
       c:'<b>Causa + finalidade + concessão + finalidade</b>: cada ação vem com a sua razão. É o padrão de um bom relato profissional: não basta dizer o que se faz, é preciso dizer por quê e para quê, e admitir o que é difícil.' },
   s:[
    { p:'He', t:'present', a:'continuo', v:'work', col:'on a project', mid:['currently'], o2:{ k:'caus', cj:'because', op:'a better career' }, why:'Ação em andamento pede presente contínuo, e <i>currently</i> (entre <i>is</i> e o verbo) reforça esse "agora". A causal explica a motivação.' },
    { p:'He', t:'past', a:'simples', v:'prepare', col:'a presentation', ends:['carefully','yesterday'], o2:{ k:'final', cj:'in order to', op:'avoid mistakes' }, why:'Objeto, depois modo, depois tempo: <i>a presentation carefully yesterday</i>. A finalidade combina com o modo: preparou com cuidado <b>para</b> evitar erros.' },
    { p:'He', t:'future', a:'simples', v:'present', col:'the results', ends:['at the office','tomorrow'], o2:{ k:'conc', cj:'even though', op:'stressful' }, why:'Lugar antes de tempo (onde → quando). <i>Even though</i> é uma concessão mais forte que <i>although</i> e abre a frase.' },
    { p:'He', t:'future', a:'simples', v:'rest', ends:['after that'], o2:{ k:'final', cj:'to', op:'recover energy' }, why:'<i>After that</i> fecha a sequência. <i>To</i> + infinitivo é a forma mais curta de dizer finalidade.' }
   ] },
 { id:'trab2', r:'causa', tema:'trabalho', nivel:2, titulo:'Prazo cumprido, cliente informado',
   ideia:'Uma ação concluída antes de outra, um envio recente, o resultado e o próximo passo.',
   n:{ v:'<i>Finish → send → deliver → start</i>: verbos de conclusão e entrega, seguidos de um recomeço. Todos falam de etapas de um trabalho, por isso a sequência soa natural.',
       t:'Três "passados" diferentes: past perfect (pronto <b>antes</b> de outro fato), present perfect (<b>acabou</b> de acontecer) e passado simples (fato <b>datado</b>). É o aspecto que diz qual é qual.',
       e:'As peças são as que justificam cada tempo: <i>already</i> pede o perfect, <i>just</i> pede o present perfect, <i>last week</i> pede o passado simples. <i>Probably</i> e <i>next week</i> fecham no futuro.',
       c:'<b>Tempo (when) + finalidade + consequência + finalidade</b>: quando ficou pronto, para que foi enviado e no que deu. É a combinação para prestar contas: fato, propósito e resultado.' },
   s:[
    { p:'She', t:'past', a:'perfeito', v:'finish', col:'the report', mid:['already'], o2:{ k:'temp', cj:'when', op:'the payment' }, why:'Past perfect (<i>had finished</i>) para o que veio primeiro; passado simples depois de <i>when</i> para o que veio depois. <i>Already</i> fica entre <i>had</i> e o particípio.' },
    { p:'She', t:'present', a:'perfeito', v:'send', col:'the report', mid:['just'], o2:{ k:'final', cj:'in order to', op:'inform the client' }, why:'<i>Just</i> + present perfect = ação recentíssima (em português, "acabou de"). A finalidade diz por que o envio importa.' },
    { p:'She', t:'past', a:'simples', v:'deliver', col:'on time', ends:['last week'], o2:{ k:'cons', cj:'which is why', op:'a good deal' }, why:'<i>Which is why</i> retoma a oração inteira e apresenta o resultado: é um <i>so</i> mais enfático, sempre depois de vírgula.' },
    { p:'She', t:'future', a:'simples', v:'start', mid:['probably'], ends:['next week'], o2:{ k:'final', cj:'to', op:'make progress' }, why:'O plano fecha o parágrafo: <i>probably</i> suaviza a previsão e <i>next week</i> dá a data.' }
   ] },
 { id:'trab3', r:'contraste', tema:'trabalho', nivel:3, titulo:'A negociação que quase não fechou',
   ideia:'Um impasse, uma revisão cuidadosa e a previsão de desfecho.',
   n:{ v:'<i>Negotiate</i> abre e volta na terceira frase, com outro objeto: a repetição mostra que o processo continua. <i>Review</i> e <i>sign</i> são as etapas que cercam a negociação.',
       t:'Dois passados simples para o que já aconteceu e dois futuros para o que se espera. Aspecto simples em tudo: são etapas completas de um processo.',
       e:'<i>At the office yesterday</i> (onde → quando), <i>carefully</i> depois do objeto, e as peças de sequência <i>after that</i> e <i>in the end</i> como dobradiças entre as frases. <i>Probably</i> marca a incerteza do desfecho.',
       c:'<b>Contraste + finalidade + finalidade</b>, com sequência por fora: o impasse (<i>but</i>), a reação e a nova tentativa. É o desenho de qualquer relato de problema e solução.' },
   s:[
    { p:'They', t:'past', a:'simples', v:'negotiate', col:'the price', ends:['at the office','yesterday'], o2:{ k:'adv', cj:'but', v:'accept', vneg:true }, why:'<i>But</i> coordena duas orações de mesmo peso e quebra a expectativa. Onde → quando no fim da primeira oração.' },
    { p:'They', t:'past', a:'simples', v:'review', col:'the contract', ends:['carefully','after that'], o2:{ k:'final', cj:'in order to', op:'check the details' }, why:'A sequência abre a frase; o modo fica depois do objeto. Modo e finalidade se reforçam: com cuidado, para conferir os detalhes.' },
    { p:'They', t:'future', a:'simples', v:'negotiate', col:'a better deal', ends:['next week'], o2:{ k:'final', cj:'in order to', op:'reach an agreement' }, why:'O mesmo verbo volta, agora no futuro e com outro objeto: a repetição mostra que a negociação continua.' },
    { p:'They', t:'future', a:'simples', v:'sign', col:'a contract', mid:['probably'], ends:['in the end'], why:'Frase curta de fecho, sem 2ª oração: <i>probably</i> dá a incerteza e <i>in the end</i> encerra a história.' }
   ] },
 { id:'cau1', r:'causa', tema:'trabalho', nivel:2, titulo:'Trabalho que rende',
   ideia:'Motivos e resultados alternados: por que ele faz e no que dá.',
   n:{ v:'<i>Finish, prepare, manage, improve</i>: cumprir, preparar, liderar, melhorar. A sequência mostra uma carreira subindo.',
       t:'Presente simples (hábito), passado simples (um caso), presente simples (situação atual) e present perfect (melhora recente).',
       e:'<i>Always… on time</i> descreve a constância; <i>carefully last week</i> segue como → quando; <i>now</i> marca a nova posição; <i>lately</i> pede o perfect.',
       c:'<b>Causa + consequência + causa + consequência</b>: motivo e resultado se alternam, cada par numa frase. <i>Since</i> na frente trata o motivo como já sabido, e <i>which is why</i> dá ênfase ao efeito. Variar as conjunções de causa e de efeito é o que impede o texto de soar repetitivo.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'finish', col:'the report', mid:['always'], ends:['on time'], o2:{ k:'caus', cj:'because', op:'a better career' }, why:'Hábito e motivo na mesma frase. <i>Because</i> no fim não leva vírgula: o motivo é a informação nova.' },
    { p:'He', t:'past', a:'simples', v:'prepare', col:'a presentation', ends:['carefully','last week'], o2:{ k:'cons', cj:'so', op:'more money' }, why:'Um caso e o seu resultado: vírgula antes de <i>so</i>.' },
    { p:'He', t:'present', a:'simples', v:'manage', col:'a team', mid:['now'], o2:{ k:'caus', cj:'since', op:'the job' }, why:'<i>Since</i> causal abre a frase com um motivo que o leitor já aceita.' },
    { p:'He', t:'present', a:'perfeito', v:'improve', col:'the process', ends:['lately'], o2:{ k:'cons', cj:'which is why', op:'more' }, why:'<i>Which is why</i> retoma a oração inteira e destaca o efeito.' }
   ] },
 { id:'con3', r:'contraste', tema:'trabalho', nivel:2, titulo:'Trabalhar sem parar',
   ideia:'Um desequilíbrio descrito de três jeitos e a decisão de corrigi-lo.',
   n:{ v:'<i>Work</i> e <i>rest</i> são opostos e se enfrentam em duas frases; <i>manage</i> explica o peso; <i>rest</i> volta no fim como solução.',
       t:'Presente simples (regra), present perfect continuous (o que vem acontecendo) e futuro (a decisão).',
       e:'<i>Always</i> generaliza; <i>lately</i> acompanha o perfect continuous; <i>this weekend</i> data a mudança.',
       c:'<b>Contraste (but) + concessão + contraste (yet) + finalidade</b>: o mesmo conflito aparece como oposição simples, como "apesar de" e como surpresa. Só depois de bem estabelecido o problema é que a finalidade apresenta a saída.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'work', mid:['always'], o2:{ k:'adv', cj:'but', v:'rest', vneg:true }, why:'Oposição direta entre dois verbos contrários (trabalhar e descansar): o <i>but</i> já anuncia o problema do parágrafo.' },
    { p:'He', t:'present', a:'simples', v:'manage', col:'a team', o2:{ k:'conc', cj:'although', op:'stressful' }, why:'A concessão mostra o peso do cargo: mesmo sendo estressante, ele continua gerindo a equipe, e é por isso que o descanso falta.' },
    { p:'He', t:'present', a:'perfeito_continuo', v:'work', col:'from home', ends:['lately'], o2:{ k:'adv', cj:'yet', v:'rest', vneg:true }, why:'As duas orações no perfect continuous: o trabalho e a falta de descanso vêm juntos até agora.' },
    { p:'He', t:'future', a:'simples', v:'rest', ends:['this weekend'], o2:{ k:'final', cj:'to', op:'recover energy' }, why:'Só agora aparece a saída: depois de três frases de problema, a finalidade dá data e objetivo ao descanso.' }
   ] },
 { id:'arg3', r:'argumento', tema:'trabalho', nivel:2, titulo:'Como combinado',
   ideia:'Duas entregas conforme o acordo e o ponto que elas provam.',
   n:{ v:'<i>Finish</i> e <i>deliver</i> são verbos de compromisso cumprido. <i>Deliver</i> se repete de propósito: primeiro como fato, depois como regra.',
       t:'Passado simples para os fatos e presente simples para a regra que eles provam.',
       e:'<i>Last week</i> e <i>on time</i> dão data e pontualidade aos fatos; <i>always</i> transforma o segundo fato em regra. A mesma peça de pontualidade aparece no fato e na regra, ligando os dois.',
       c:'<b>Conformativa + conformativa + predicativa</b>: <i>as we planned</i> e <i>just as we agreed</i> amarram os fatos ao combinado, e <i>The point is that…</i> tira a lição. É a combinação para mostrar confiabilidade: fiz o que disse, e isso é o que importa.' },
   s:[
    { p:'We', t:'past', a:'simples', v:'finish', col:'the report', ends:['last week'], o2:{ k:'conf', cj:'as', op:'the plan' }, why:'O primeiro fato já vem amarrado ao plano: não basta ter terminado, terminou <b>como planejado</b>.' },
    { p:'We', t:'past', a:'simples', v:'deliver', col:'on time', o2:{ k:'conf', cj:'just as', op:'the agreement' }, why:'<i>Just as</i> é mais forte que <i>as</i>: a entrega foi <b>exatamente</b> como combinado, o que fecha a prova do argumento.' },
    { p:'We', t:'present', a:'simples', v:'deliver', col:'on time', mid:['always'], o2:{ k:'pred', cj:'… is that', op:'point' }, why:'Dos fatos para a regra: o mesmo verbo passa ao presente com <i>always</i>.' }
   ] },
 { id:'sau1', r:'contraste', tema:'saúde', nivel:1, titulo:'De cansado a disposto',
   ideia:'Um antes e um depois: o passado ruim, os hábitos novos e os seus motivos.',
   n:{ v:'<i>Sleep, train, eat, run</i>: os quatro pilares de uma rotina de saúde. Verbos simples, do dia a dia, para que a atenção fique nas peças e nas ligações.',
       t:'Um passado simples contra três presentes simples: o "antes" é um fato encerrado, o "depois" é hábito.',
       e:'<i>Never… last year</i> pinta o passado; <i>now</i> marca a virada; <i>at the gym three times a week</i> segue onde → quando; <i>also</i> soma um hábito ao outro; <i>every morning</i> fecha.',
       c:'<b>Finalidade + causa + concessão</b>: três razões diferentes para três hábitos (objetivo, motivo e "apesar de"). Mostra que hábito bom não se explica só com <i>because</i>.' },
   s:[
    { p:'I', t:'past', a:'simples', v:'sleep', col:'well', mid:['never'], ends:['last year'], why:'Frase simples para abrir. <i>Never</i> antes do verbo já nega a frase (não use <i>didn\'t</i> junto).' },
    { p:'I', t:'present', a:'simples', v:'train', mid:['now'], ends:['at the gym','three times a week'], o2:{ k:'final', cj:'in order to', op:'stay in shape' }, why:'<i>Now</i> marca a mudança. Lugar antes de periodicidade: <i>at the gym three times a week</i>.' },
    { p:'I', t:'present', a:'simples', v:'eat', col:'healthy food', mid:['also'], o2:{ k:'caus', cj:'because', op:'more energy' }, why:'<i>Also</i> (antes do verbo) soma este hábito ao anterior. A causal dá o motivo.' },
    { p:'I', t:'present', a:'simples', v:'run', col:'in the park', ends:['every morning'], o2:{ k:'conc', cj:'although', op:'tiring' }, why:'A concessão mostra que o hábito se mantém apesar do custo. Com <i>although</i> na frente, a vírgula é obrigatória.' }
   ] },
 { id:'sau2', r:'condicao', tema:'saúde', nivel:2, titulo:'O plano da maratona',
   ideia:'Um treino em andamento, um hábito, uma meta com condição e a intensidade do esforço.',
   n:{ v:'<i>Train</i> e <i>run</i> se revezam: o treino é o meio, a corrida é o fim. A meta (<i>run a marathon</i>) usa o mesmo verbo do hábito (<i>runs in the park</i>), ligando rotina e objetivo.',
       t:'Present perfect <b>continuous</b> para o esforço que vem acontecendo, presente simples para a rotina, futuro para a meta. O contínuo destaca a duração do treino, não o resultado.',
       e:'<i>Lately</i> acompanha o perfect continuous; <i>usually… in the park every morning</i> enche a frase de hábito com três encaixes; <i>next year</i> data a meta.',
       c:'<b>Causa + finalidade + condição + consequência intensiva</b>: por que treina, para que corre, do que a meta depende e quão forte é o esforço. <i>So… that</i> é o recurso para dizer "tanto que", raro em iniciantes e muito expressivo.' },
   s:[
    { p:'She', t:'present', a:'perfeito_continuo', v:'train', col:'hard', ends:['lately'], o2:{ k:'caus', cj:'because', op:'more practice' }, why:'<i>Has been training</i> + <i>lately</i>: atividade recente que continua. A causal fica no presente simples porque o motivo vale agora.' },
    { p:'She', t:'present', a:'simples', v:'run', mid:['usually'], ends:['in the park','every morning'], o2:{ k:'final', cj:'to', op:'clear {p} mind' }, why:'Três encaixes numa frase só: frequência antes do verbo, depois lugar e periodicidade no fim.' },
    { p:'She', t:'future', a:'simples', v:'run', col:'a marathon', ends:['next year'], o2:{ k:'cond', cj:'if', op:'to win' }, why:'Meta com data (<i>next year</i>) e condição real: <i>will</i> na principal, presente depois de <i>if</i>.' },
    { p:'She', t:'present', a:'simples', v:'train', o2:{ k:'csq', cj:'so … that', op:'stronger' }, why:'<i>So</i> + advérbio + <i>that</i>: a intensidade é tanta que produz o resultado. Sem vírgula antes de <i>that</i>.' }
   ] },
 { id:'sau3', r:'objetivo', tema:'saúde', nivel:2, titulo:'Energia para o dia',
   ideia:'Três hábitos com as suas finalidades e um resultado que já aparece.',
   n:{ v:'<i>Wake, rest, train, sleep</i>: um dia inteiro, da manhã à noite. A ordem dos verbos é a ordem do dia.',
       t:'Presente simples nas rotinas e present perfect continuous no fecho, porque o bom sono é um <b>efeito que vem se acumulando</b>.',
       e:'As marcas de hábito se revezam para não repetir: <i>every day</i>, <i>usually</i>, <i>twice a week</i>. <i>Lately</i> aparece só com o perfect continuous.',
       c:'<b>Finalidade + finalidade + concessão</b> e um fecho sem 2ª oração: dois objetivos, um custo admitido e o resultado. Terminar com uma frase curta dá ritmo ao parágrafo.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'wake', col:'early', ends:['every day'], o2:{ k:'final', cj:'in order to', op:'exercise before work' }, why:'Periodicidade no fim da oração; a finalidade vem depois dela.' },
    { p:'I', t:'present', a:'simples', v:'rest', col:'after lunch', mid:['usually'], o2:{ k:'final', cj:'to', op:'recover energy' }, why:'Aqui o hábito é marcado no meio (<i>usually</i>), não no fim: mesma ideia, outro encaixe.' },
    { p:'I', t:'present', a:'simples', v:'train', ends:['at the gym','twice a week'], o2:{ k:'conc', cj:'even though', op:'tiring' }, why:'Lugar antes de periodicidade. A concessão admite o custo sem desfazer o hábito.' },
    { p:'I', t:'present', a:'perfeito_continuo', v:'sleep', col:'well', ends:['lately'], why:'Fecho curto, sem 2ª oração. <i>Lately</i> + present perfect continuous: o resultado vem se repetindo até agora.' }
   ] },
 { id:'exp3', r:'explicar', tema:'saúde', nivel:1, titulo:'Motivo e efeito',
   ideia:'Um hábito explicado, outro com o seu efeito e o resultado geral.',
   n:{ v:'<i>Eat, train, sleep</i> cobrem alimentação, exercício e descanso: três hábitos diferentes para a explicação e a conclusão não repetirem o mesmo verbo.',
       t:'Presente simples nos hábitos e present perfect continuous no efeito que vem se acumulando.',
       e:'<i>Every day</i> marca o primeiro hábito; <i>also</i> soma o segundo; <i>at the gym three times a week</i> segue onde → quando; <i>lately</i> acompanha o perfect continuous do fecho.',
       c:'<b>Explicação + conclusão</b> em escala pequena: um hábito com o seu fundamento (<i>for</i>) e outro com o seu efeito (<i>so</i>). Bom primeiro contato com o par antes de usá-lo em argumentos maiores.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'eat', col:'healthy food', ends:['every day'], o2:{ k:'expl', cj:'for', op:'more energy' }, why:'Hábito + explicação: a vírgula antes de <i>for</i> é obrigatória.' },
    { p:'I', t:'present', a:'simples', v:'train', mid:['also'], ends:['at the gym','three times a week'], o2:{ k:'cons', cj:'so', op:'stronger' }, why:'<i>Also</i> soma o segundo hábito; <i>so</i> mostra o efeito. Lugar antes de periodicidade.' },
    { p:'I', t:'present', a:'perfeito_continuo', v:'sleep', col:'well', ends:['lately'], why:'Fecho curto: o efeito geral, que vem se repetindo até agora.' }
   ] },
 { id:'cau2', r:'causa', tema:'saúde', nivel:1, titulo:'Por que eu me cuido',
   ideia:'Dois hábitos com os seus motivos e um efeito.',
   n:{ v:'<i>Listen, cook, eat</i>: descanso e alimentação, as duas bases do autocuidado.',
       t:'Tudo no presente simples: são hábitos e os seus efeitos permanentes.',
       e:'<i>Every evening</i> e <i>usually… at home</i> dão a frequência e o lugar; a última frase fica sem peças para o efeito aparecer limpo.',
       c:'<b>Causa + causa + consequência</b>: dois motivos ditos de formas diferentes (<i>because</i> no fim, <i>since</i> no começo) levam a um efeito. A posição do motivo muda a ênfase: no fim ele é a novidade, no começo é o ponto de partida.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'listen', col:'to music', ends:['every evening'], o2:{ k:'caus', cj:'because', op:'more rest' }, why:'O motivo vem no fim da frase, como informação nova: primeiro o hábito, depois a necessidade que o explica.' },
    { p:'I', t:'present', a:'simples', v:'cook', col:'dinner', mid:['usually'], ends:['at home'], o2:{ k:'caus', cj:'since', op:'a healthy life' }, why:'Motivo na frente, com vírgula: ele prepara a frase principal.' },
    { p:'I', t:'present', a:'simples', v:'eat', col:'healthy food', o2:{ k:'cons', cj:'which is why', op:'healthier' }, why:'O efeito fecha o parágrafo: os dois motivos anteriores desembocam aqui, e <i>which is why</i> dá peso a essa chegada.' }
   ] },
 { id:'prop3', r:'proporcao', tema:'saúde', nivel:1, titulo:'Treino e medida',
   ideia:'Uma proporção simples e duas comparações.',
   n:{ v:'<i>Train</i> e <i>run</i> nomeiam o esforço e <i>improve</i> o ganho. São verbos de ação repetível, os únicos que fazem sentido numa proporção ("quanto mais…").',
       t:'Presente simples em tudo, porque proporção e comparação são regras: valem sempre, não num dia específico. O aspecto simples mostra o hábito inteiro, sem olhar para a duração.',
       e:'Só o lugar <i>in the park</i>. As comparações já trazem o modo e a frequência.',
       c:'<b>Proporção + igualdade + superioridade</b>: primeiro a regra (quanto mais, mais), depois dois jeitos de se comparar com alguém. É o primeiro degrau para falar de desempenho.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'train', o2:{ k:'prop', cj:'the more … the more', v:'improve' }, why:'A regra geral abre o parágrafo e serve de régua para as duas comparações que vêm depois.' },
    { p:'I', t:'present', a:'simples', v:'train', o2:{ k:'cmp', cj:'as … as', op:'seriously' }, why:'Igualdade (<i>as… as</i>): o treino dos dois tem a mesma seriedade. O auxiliar <i>do</i> evita repetir o verbo.' },
    { p:'I', t:'present', a:'simples', v:'run', col:'in the park', o2:{ k:'cmp', cj:'than', op:'often' }, why:'Superioridade (<i>more often than</i>): depois da igualdade da frase 2, aqui aparece a diferença entre os dois.' }
   ] },
 { id:'arg1', r:'argumento', tema:'saúde', nivel:2, titulo:'O problema e a saída',
   ideia:'Nomear o problema, afirmar o que é evidente e apontar o plano.',
   n:{ v:'<i>Sleep, need, rest</i> formam sintoma, necessidade e remédio. A escolha segue a lógica de um diagnóstico: o que acontece, o que falta e o que fazer.',
       t:'Presente simples para o diagnóstico, porque o problema é atual e constante; futuro para o plano, porque a solução ainda vai acontecer. A troca de tempo marca a passagem do problema à saída.',
       e:'<i>Never</i> dá a gravidade (não é "às vezes", é nunca) e <i>this weekend</i> põe prazo na solução. Uma peça por papel: uma mede o problema, a outra data a resposta.',
       c:'<b>Predicativa + subjetiva + conformativa</b>: <i>The problem is that…</i> nomeia o problema, <i>It is clear that…</i> afirma algo como evidente e <i>as we planned</i> liga a ação a um acordo. São as estruturas de quem apresenta um caso: diagnóstico, evidência e encaminhamento.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'sleep', col:'well', mid:['never'], o2:{ k:'pred', cj:'… is that', op:'problem' }, why:'A oração inteira ocupa o lugar do predicativo: ela diz <b>qual é</b> o problema, e o parágrafo parte daí.' },
    { p:'She', t:'present', a:'simples', v:'need', col:'more time', o2:{ k:'subj', cj:'It is … that', op:'clear' }, why:'<i>It is clear that</i> + frase: o <i>it</i> só guarda o lugar do sujeito, que é a oração.' },
    { p:'She', t:'future', a:'simples', v:'rest', ends:['this weekend'], o2:{ k:'conf', cj:'as', op:'the plan' }, why:'<i>As we planned</i> = conforme planejamos. Sem vírgula.' }
   ] },
 { id:'fin1', r:'objetivo', tema:'finanças', nivel:1, titulo:'Contas em dia',
   ideia:'Um hábito financeiro, um segundo hábito com ressalva e o plano que eles permitem.',
   n:{ v:'<i>Pay</i> e <i>invest</i>: primeiro cumprir obrigações, depois fazer o dinheiro render. <i>Invest</i> se repete no futuro para mostrar o hábito virando plano.',
       t:'Dois presentes simples (hábitos) e um futuro (plano). Aspecto simples: regras de conduta, não processos.',
       e:'<i>Always</i> (frequência) e <i>also</i> (foco) ocupam encaixes diferentes do meio, por isso convivem no mesmo texto. <i>On time</i> e <i>next year</i> respondem "quando".',
       c:'<b>Finalidade + concessão + finalidade</b>: faço X para evitar um problema, faço Y embora haja risco, farei Z para garantir o futuro. É o raciocínio de quem justifica decisões.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'pay', col:'the bill', mid:['always'], ends:['on time'], o2:{ k:'final', cj:'in order to', op:'avoid debt' }, why:'<i>Always</i> antes do verbo, <i>on time</i> depois do objeto. A finalidade justifica o hábito.' },
    { p:'We', t:'present', a:'simples', v:'invest', col:'wisely', mid:['also'], o2:{ k:'conc', cj:'although', op:'risky' }, why:'<i>Also</i> liga esta frase à anterior. A concessão reconhece o risco e o modo (<i>wisely</i>) responde a ele.' },
    { p:'We', t:'future', a:'simples', v:'invest', col:'money', ends:['next year'], o2:{ k:'final', cj:'to', op:'secure the future' }, why:'O mesmo verbo passa do presente para o futuro: o hábito vira plano, com data.' }
   ] },
 { id:'fin2', r:'contraste', tema:'finanças', nivel:2, titulo:'O erro do ano passado',
   ideia:'Um contraste no passado e a mudança de comportamento que veio dele.',
   n:{ v:'<i>Spend</i> e <i>save</i> são opostos e abrem o texto em conflito; <i>plan, buy, pay</i> mostram o novo comportamento em ações concretas.',
       t:'Passado simples (<i>last year</i>, período encerrado), presente simples (rotina nova) e present perfect (<i>this year</i>, período que <b>ainda não acabou</b>).',
       e:'<i>Last year</i> contra <i>now</i> faz o "antes e depois". <i>Every month</i> confirma a rotina, <i>online</i> ocupa o lugar e <i>always… this year</i> fecha.',
       c:'<b>Contraste + finalidade + finalidade</b>: o erro vem com <i>but</i>, a correção vem com objetivos. Contraste seguido de finalidade é a fórmula para contar uma mudança de atitude.' },
   s:[
    { p:'They', t:'past', a:'simples', v:'spend', col:'a fortune', ends:['last year'], o2:{ k:'adv', cj:'but', v:'save', vneg:true, c2:'none' }, why:'<i>Spend</i> e <i>save</i> são opostos: <i>but</i> + negação deixa o contraste explícito.' },
    { p:'They', t:'present', a:'simples', v:'plan', col:'the budget', mid:['now'], ends:['every month'], o2:{ k:'final', cj:'in order to', op:'avoid problems' }, why:'<i>Now</i> marca a virada; <i>every month</i> mostra que virou rotina.' },
    { p:'They', t:'present', a:'simples', v:'buy', col:'groceries', ends:['online'], o2:{ k:'final', cj:'to', op:'save money' }, why:'Um exemplo concreto do novo comportamento. <i>Online</i> ocupa o encaixe de lugar.' },
    { p:'They', t:'present', a:'perfeito', v:'pay', col:'the rent', mid:['always'], ends:['this year'], why:'<i>This year</i> ainda está em curso, então pede present perfect. <i>Always</i> fica entre <i>have</i> e o particípio.' }
   ] },
 { id:'fin3', r:'causa', tema:'finanças', nivel:3, titulo:'Gastar bem, investir sempre',
   ideia:'Critério de gasto, ordem de pagamentos, investimento com risco e uma previsão.',
   n:{ v:'<i>Spend, pay, invest</i>: gastar, quitar, aplicar. <i>Invest</i> aparece duas vezes, como hábito e como plano.',
       t:'Presente simples (critério atual), past perfect (o que já estava pago <b>antes</b>), presente simples (hábito) e futuro (previsão).',
       e:'<i>Now</i> e <i>already</i> ficam no meio; <i>every month</i> marca o hábito; <i>probably… next year</i> gradua e data a previsão.',
       c:'<b>Causa + tempo + concessão + finalidade</b>: aqui se vê a conjunção escolhendo o tempo verbal. <i>When</i> depois de past perfect pede passado simples; <i>although</i> com hábito fica no presente.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'spend', col:'wisely', mid:['now'], o2:{ k:'caus', cj:'because', op:'good quality' }, why:'<i>Now</i> antes do verbo, modo depois dele. A causal dá o critério da escolha.' },
    { p:'We', t:'past', a:'perfeito', v:'pay', col:'the bill', mid:['already'], o2:{ k:'temp', cj:'when', op:'the payment' }, why:'Duas ações passadas: a mais antiga em past perfect (<i>had paid</i>), a mais recente em passado simples depois de <i>when</i>.' },
    { p:'We', t:'present', a:'simples', v:'invest', col:'in stocks', ends:['every month'], o2:{ k:'conc', cj:'although', op:'risky' }, why:'A periodicidade confirma o hábito, e a concessão mostra que ele resiste ao risco.' },
    { p:'We', t:'future', a:'simples', v:'invest', col:'money', mid:['probably'], ends:['next year'], o2:{ k:'final', cj:'to', op:'build wealth' }, why:'Previsão com certeza moderada (<i>probably</i>), data e objetivo: três informações em encaixes diferentes.' }
   ] },
 { id:'con1', r:'contraste', tema:'finanças', nivel:2, titulo:'Caro, mas resolvido',
   ideia:'Uma compra apesar do preço, uma contradição e o ajuste.',
   n:{ v:'<i>Buy, spend, pay</i> são três momentos do mesmo gesto com dinheiro. Usar verbos vizinhos deixa o contraste nas conjunções, não no vocabulário.',
       t:'Passado simples para o episódio e presente simples para a situação e a regra nova.',
       e:'<i>Yesterday</i> data a compra; <i>rarely</i> e <i>now… on time</i> descrevem o comportamento.',
       c:'<b>Concessão + contraste (yet) + consequência</b>: <i>although</i> admite um obstáculo, <i>yet</i> aponta uma contradição inesperada e <i>so</i> mostra a saída. <i>Yet</i> é mais forte que <i>but</i>: diz que o segundo fato surpreende.' },
   s:[
    { p:'We', t:'past', a:'simples', v:'buy', col:'a gift', ends:['yesterday'], o2:{ k:'conc', cj:'although', op:'expensive' }, why:'A concessão abre a frase: o preço não impediu a compra.' },
    { p:'We', t:'present', a:'simples', v:'spend', col:'money', mid:['rarely'], o2:{ k:'adv', cj:'yet', v:'save', vneg:true }, why:'<i>Yet</i>, depois de vírgula, marca o que não bate com o esperado.' },
    { p:'We', t:'present', a:'simples', v:'pay', col:'the bill', mid:['now'], ends:['on time'], o2:{ k:'cons', cj:'so', op:'a good deal' }, why:'O ajuste de comportamento (<i>now… on time</i>) e o ganho que ele traz: a virada depois da contradição.' }
   ] },
 { id:'prop2', r:'proporcao', tema:'finanças', nivel:3, titulo:'Menos gasto, mais sobra',
   ideia:'Proporção inversa, intensidade e comparação de superioridade.',
   n:{ v:'<i>Spend</i> contra <i>save</i>, <i>work</i> ligado a <i>earn</i>, e <i>invest</i> como hábito.',
       t:'Presente simples em tudo: são regras pessoais, que valem como princípio. Proporção e comparação não combinam com tempos pontuais.',
       e:'Só o modo <i>wisely</i>. As quantidades (<i>the less</i>, <i>so much</i>, <i>more often</i>) fazem o papel das peças.',
       c:'<b>Proporção inversa + consequência intensiva + comparação (than)</b>: <i>the less… the more</i> liga duas coisas que andam em sentidos opostos. <i>So much that</i> intensifica o verbo, e não um advérbio. E <i>more often than</i> compara frequência.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'spend', o2:{ k:'prop', cj:'the less … the more', v:'save' }, why:'Proporção inversa: menos de um lado, mais do outro.' },
    { p:'I', t:'present', a:'simples', v:'work', o2:{ k:'csq', cj:'so much that', op:'more money' }, why:'<i>So much that</i> mede a intensidade do trabalho pelo que ela produz: a consequência serve de régua.' },
    { p:'I', t:'present', a:'simples', v:'invest', col:'wisely', o2:{ k:'cmp', cj:'than', op:'often' }, why:'A comparação de frequência (<i>more often than you do</i>) fecha o raciocínio colocando o hábito ao lado do de outra pessoa.' }
   ] },
 { id:'tec1', r:'sequencia', tema:'tecnologia', nivel:1, titulo:'Antes de lançar',
   ideia:'A ordem certa das etapas: testar, atualizar, conferir.',
   n:{ v:'<i>Test → update → check</i>: as etapas de um procedimento seguro, na ordem em que acontecem.',
       t:'Tudo no presente simples, porque procedimento é regra: vale sempre, não num dia específico.',
       e:'A ordem vem das peças de sequência (<i>first</i>, <i>after that</i>), que abrem a frase com vírgula. <i>Always</i> diz que é regra, <i>also</i> acrescenta a etapa final e <i>twice</i> diz quantas vezes.',
       c:'<b>Finalidade + finalidade + causa</b>: cada etapa traz o seu porquê. Alternar <i>in order to</i>, <i>to</i> e <i>because</i> evita a repetição e é a base de qualquer instrução bem escrita.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'test', col:'the code', mid:['always'], ends:['first'], o2:{ k:'final', cj:'in order to', op:'find the errors' }, why:'<i>First</i> abre a sequência; <i>always</i> mostra que é regra, não exceção.' },
    { p:'We', t:'present', a:'simples', v:'update', col:'the software', ends:['after that'], o2:{ k:'final', cj:'to', op:'fix the bugs' }, why:'<i>After that</i> liga esta etapa à anterior. Finalidade curta com <i>to</i>.' },
    { p:'We', t:'present', a:'simples', v:'check', col:'the results', mid:['also'], ends:['twice'], o2:{ k:'caus', cj:'because', op:'to save time' }, why:'<i>Also</i> soma a etapa; <i>twice</i> diz quantas vezes; a causal justifica o cuidado.' }
   ] },
 { id:'tec2', r:'sequencia', tema:'tecnologia', nivel:2, titulo:'A atualização de ontem',
   ideia:'O que foi feito apesar do risco, o que foi verificado e o que ainda falta.',
   n:{ v:'<i>Install → test → check → update</i>: o ciclo de uma mudança em sistema, do risco à verificação.',
       t:'Três passados simples em ordem cronológica e um futuro. O simples basta porque cada ação é um fato concluído.',
       e:'A cronologia inteira está nas peças: <i>last night</i>, <i>after that</i>, <i>this morning</i>, <i>tomorrow</i>. <i>Carefully</i> e <i>twice</i> descrevem o cuidado.',
       c:'<b>Concessão + finalidade + consequência + tempo</b>: fez apesar do risco, testou para garantir, ganhou tempo, e o próximo passo depende de outro. É o formato de um relato técnico completo.' },
   s:[
    { p:'She', t:'past', a:'simples', v:'install', col:'an update', ends:['last night'], o2:{ k:'conc', cj:'even though', op:'risky' }, why:'A concessão abre a frase e já avisa do risco antes do fato.' },
    { p:'She', t:'past', a:'simples', v:'test', col:'the system', ends:['carefully','after that'], o2:{ k:'final', cj:'in order to', op:'make sure it works' }, why:'Sequência na frente, modo depois do objeto. A finalidade responde ao risco da frase anterior.' },
    { p:'She', t:'past', a:'simples', v:'check', col:'the results', ends:['twice','this morning'], o2:{ k:'cons', cj:'so', op:'time' }, why:'Quantas vezes antes de quando: <i>twice this morning</i>. <i>So</i> mostra o que se ganhou com isso.' },
    { p:'She', t:'future', a:'simples', v:'update', col:'the data', ends:['tomorrow'], o2:{ k:'temp', cj:'as soon as', op:'the bug' }, why:'Futuro na principal, presente depois de <i>as soon as</i> (nunca <i>will</i> na oração de tempo).' }
   ] },
 { id:'tec3', r:'condicao', tema:'tecnologia', nivel:3, titulo:'O sistema novo',
   ideia:'Anterioridade, hábito com motivo, hipótese e proporção.',
   n:{ v:'<i>Test, use, update, test</i>: o parágrafo abre e fecha com <i>test</i>, primeiro como fato e depois como princípio.',
       t:'Past perfect, presente simples, <i>would</i> e presente simples: anterioridade, hábito, hipótese e regra geral.',
       e:'Só <i>already</i> e <i>every day</i>. Nas estruturas avançadas (hipótese, proporção) a própria construção já carrega a informação de tempo.',
       c:'<b>Tempo + causa + condição hipotética + proporção</b>: quatro ligações de níveis diferentes no mesmo assunto. Serve de mapa: da ordem dos fatos até a regra abstrata.' },
   s:[
    { p:'We', t:'past', a:'perfeito', v:'test', col:'the code', mid:['already'], o2:{ k:'temp', cj:'when', op:'the update' }, why:'<i>Had already tested</i> = pronto antes; passado simples depois de <i>when</i> = o que veio em seguida.' },
    { p:'We', t:'present', a:'simples', v:'use', col:'the app', ends:['every day'], o2:{ k:'caus', cj:'because', op:'to finish early' }, why:'Hábito + motivo. A periodicidade fica antes da conjunção.' },
    { p:'We', t:'future', a:'simples', v:'update', col:'the software', o2:{ k:'cond', cj:'if', op:'a faster system', cnd:2 }, why:'Hipótese (tipo 2): <i>would update</i> + <i>if</i> + passado (<i>needed</i>). Não é um plano, é uma suposição.' },
    { p:'We', t:'present', a:'simples', v:'test', col:'the system', o2:{ k:'prop', cj:'the more … the more', v:'learn' }, why:'Proporção no presente simples: vale como regra geral, sem data.' }
   ] },
 { id:'exp2', r:'explicar', tema:'tecnologia', nivel:2, titulo:'A razão e o resultado',
   ideia:'Uma regra de trabalho com a sua justificativa e duas consequências.',
   n:{ v:'<i>Test, check, update</i>: verificar, conferir e só depois agir. A ordem dos verbos já é o argumento: a ação vem depois da certeza.',
       t:'Presente simples (regra), passado simples (o que foi feito) e futuro (o que será resolvido).',
       e:'<i>Always… twice</i> mostra a regra; <i>carefully yesterday</i> segue como → quando; <i>tomorrow</i> data a solução.',
       c:'<b>Explicação + conclusão + conclusão</b>: uma razão sustenta duas consequências, uma já colhida (<i>and so</i>) e outra esperada (<i>so</i>). É o formato de uma justificativa técnica: fazemos assim por isto, e por isso ganhamos aquilo.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'test', col:'the code', mid:['always'], ends:['twice'], o2:{ k:'expl', cj:'for', op:'fewer errors' }, why:'A regra (<i>always… twice</i>) vem primeiro e a explicação com <i>for</i> vem depois da vírgula.' },
    { p:'We', t:'past', a:'simples', v:'check', col:'the results', ends:['carefully','yesterday'], o2:{ k:'cons', cj:'and so', op:'time' }, why:'<i>And so</i> é um <i>so</i> com mais peso: liga o cuidado de ontem ao ganho que veio dele.' },
    { p:'We', t:'future', a:'simples', v:'update', col:'the software', ends:['tomorrow'], o2:{ k:'cons', cj:'so', op:'the issue' }, why:'Com a principal no futuro, a conclusão também vai para <i>will</i>: é um resultado esperado, não um fato.' }
   ] },
 { id:'cau3', r:'causa', tema:'tecnologia', nivel:3, titulo:'A atualização que resolveu',
   ideia:'A necessidade, a ação que ela provocou e as consequências de hoje.',
   n:{ v:'<i>Install, send, check</i>: a ação que resolve e as rotinas que mudaram por causa dela.',
       t:'Passado simples para a necessidade e a ação; presente simples para o que mudou no dia a dia.',
       e:'<i>Now</i> e <i>every day</i> marcam a rotina nova; <i>rarely</i> mostra o que deixou de ser necessário.',
       c:'<b>Causa virada em consequência + consequência + causa (now that)</b>: a primeira frase põe a causa na frente e a ação depois de <i>so</i>, o inverso de "…because". É a mesma informação com outra ênfase. <i>Now that</i> junta causa e tempo: "agora que".' },
   s:[
    { p:'We', t:'past', a:'simples', v:'install', col:'an update', o2:{ k:'caus', cj:'because', op:'a faster system', tr:'caus>cons' }, why:'Transformação: em vez de "instalamos porque precisávamos", "precisávamos, então instalamos". A causa ganha a primeira posição.' },
    { p:'We', t:'present', a:'simples', v:'send', col:'the report', mid:['now'], ends:['every day'], o2:{ k:'cons', cj:'so', op:'time' }, why:'O efeito atual: <i>now</i> marca a mudança de rotina e <i>so</i> mostra o que ela rende, todos os dias.' },
    { p:'We', t:'present', a:'simples', v:'check', col:'the results', mid:['rarely'], o2:{ k:'caus', cj:'now that', op:'fewer errors' }, why:'<i>Now that</i> abre a frase: causa que começou a valer agora.' }
   ] },
 { id:'via1', r:'sequencia', tema:'viagem', nivel:1, titulo:'A viagem bem planejada',
   ideia:'Um costume, o planejamento feito e os dois próximos passos.',
   n:{ v:'<i>Travel, plan, leave, arrive</i>: a viagem em quatro verbos, do costume à chegada.',
       t:'Presente simples (costume), passado simples (planejamento feito) e dois futuros (execução).',
       e:'<i>Usually</i> marca o costume; <i>last month</i> data o plano; <i>early tomorrow</i> ordena a saída; <i>probably… in the end</i> fecha com previsão.',
       c:'<b>Causa + finalidade + finalidade</b> e um fecho simples: por que viajamos assim, para que planejamos, para que saímos cedo. Motivo primeiro, objetivos depois.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'travel', col:'by train', mid:['usually'], o2:{ k:'caus', cj:'because', op:'to save time' }, why:'Costume no presente simples; <i>usually</i> antes do verbo. A causal dá a razão da escolha.' },
    { p:'We', t:'past', a:'simples', v:'plan', col:'the trip', ends:['last month'], o2:{ k:'final', cj:'in order to', op:'avoid problems' }, why:'<i>Last month</i> data o planejamento; a finalidade diz para que ele serviu.' },
    { p:'We', t:'future', a:'simples', v:'leave', col:'early', ends:['tomorrow'], o2:{ k:'final', cj:'to', op:'avoid traffic' }, why:'Modo/hora (<i>early</i>) antes de tempo (<i>tomorrow</i>), e a finalidade no fim.' },
    { p:'We', t:'future', a:'simples', v:'arrive', col:'on time', mid:['probably'], ends:['in the end'], why:'Fecho: previsão moderada por <i>probably</i> e encerrada por <i>in the end</i>.' }
   ] },
 { id:'via2', r:'contraste', tema:'viagem', nivel:2, titulo:'O dia em que tudo atrasou',
   ideia:'Um contratempo, a cena do momento e a decisão para o futuro.',
   n:{ v:'<i>Leave</i> e <i>arrive</i> são opostos (sair e chegar); <i>drive</i> preenche o meio do caminho. <i>Leave</i> volta no fim como decisão.',
       t:'Passado simples para o fato, passado <b>contínuo</b> para a cena em andamento e futuro para a decisão.',
       e:'<i>Yesterday</i> data o episódio; <i>from now on</i> transforma o episódio em regra para o futuro.',
       c:'<b>Contraste + tempo + finalidade</b>: o que deu errado, a cena, e a mudança. O par passado contínuo + <i>when</i> + passado simples é o jeito clássico de narrar.' },
   s:[
    { p:'She', t:'past', a:'simples', v:'leave', col:'home', ends:['yesterday'], o2:{ k:'adv', cj:'but', v:'arrive', vneg:true, c2:1 }, why:'<i>Leave</i> e <i>arrive</i> são opostos; <i>but</i> + negação mostra que o esperado não aconteceu.' },
    { p:'She', t:'past', a:'continuo', v:'drive', col:'to work', o2:{ k:'temp', cj:'when', op:'the bridge' }, why:'Passado contínuo para a ação longa (<i>was driving</i>) e passado simples depois de <i>when</i> para o ponto no tempo.' },
    { p:'She', t:'future', a:'simples', v:'leave', col:'early', ends:['from now on'], o2:{ k:'final', cj:'in order to', op:'avoid traffic' }, why:'<i>From now on</i> projeta a decisão para todas as vezes seguintes; a finalidade explica a mudança.' }
   ] },
 { id:'cond1', r:'condicao', tema:'viagem', nivel:2, titulo:'Tudo depende do trânsito',
   ideia:'Quatro planos, cada um preso a uma condição diferente.',
   n:{ v:'<i>Leave, arrive, travel, drive</i>: quatro verbos de deslocamento para quatro planos alternativos.',
       t:'Sempre futuro na principal e <b>presente</b> na condição: é a condicional real, de coisas que podem acontecer.',
       e:'Só <i>early tomorrow</i> na primeira frase. Nas outras, a condição já ocupa o lugar das circunstâncias.',
       c:'<b>Quatro condições</b>: <i>if</i> (se), <i>unless</i> (a não ser que), <i>as long as</i> (desde que) e <i>in case</i> (caso). Cada uma muda o sentido: <i>unless</i> já é negativa, <i>as long as</i> impõe uma exigência e <i>in case</i> é precaução. Saber escolher entre elas dá precisão ao que se promete.' },
   s:[
    { p:'We', t:'future', a:'simples', v:'leave', col:'early', ends:['tomorrow'], o2:{ k:'cond', cj:'if', op:'heavy traffic' }, why:'Condição real (tipo 1): <i>will</i> na principal e presente depois de <i>if</i>, mesmo falando de amanhã.' },
    { p:'We', t:'future', a:'simples', v:'arrive', col:'on time', o2:{ k:'cond', cj:'unless', op:'heavy traffic' }, why:'<i>Unless</i> = "if not": a oração fica afirmativa, mas o sentido é negativo.' },
    { p:'We', t:'future', a:'simples', v:'travel', col:'by train', o2:{ k:'cond', cj:'as long as', op:'to save time' }, why:'<i>As long as</i> põe uma exigência: só vale enquanto a condição valer.' },
    { p:'We', t:'future', a:'simples', v:'drive', col:'to work', o2:{ k:'cond', cj:'in case', op:'to arrive early' }, why:'<i>In case</i> é precaução: fazemos isso para o caso de precisar.' }
   ] },
 { id:'vida1', r:'proporcao', tema:'vida', nivel:3, titulo:'Trabalhar mais ou mudar o plano',
   ideia:'Uma situação recente, o seu custo, a regra por trás dela e uma decisão.',
   n:{ v:'<i>Work</i> domina três frases e <i>change</i> aparece só na última: a repetição do verbo reforça a rotina que o parágrafo quer quebrar.',
       t:'Present perfect continuous (situação recente em curso), presente simples (hábito e regra) e futuro (decisão).',
       e:'Poucas peças: <i>lately</i>, <i>every day</i>, <i>next year</i>. Quando a estrutura já é rica, encaixar menos deixa a frase mais limpa.',
       c:'<b>Causa + concessão + proporção + finalidade</b>: do diagnóstico à decisão. Motivo, custo, a regra que mantém a situação e o objetivo da mudança.' },
   s:[
    { p:'I', t:'present', a:'perfeito_continuo', v:'work', col:'from home', ends:['lately'], o2:{ k:'caus', cj:'because', op:'the money' }, why:'<i>Have been working</i> + <i>lately</i>: situação recente e ainda em curso. O motivo vem no presente simples.' },
    { p:'I', t:'present', a:'simples', v:'work', col:'on a project', ends:['every day'], o2:{ k:'conc', cj:'although', op:'tiring' }, why:'A concessão abre a frase; <i>every day</i> mostra que o esforço é constante.' },
    { p:'I', t:'present', a:'simples', v:'work', o2:{ k:'prop', cj:'the more … the more', v:'earn' }, why:'A proporção dá a lógica que sustenta o hábito: mais trabalho, mais ganho.' },
    { p:'I', t:'future', a:'simples', v:'change', col:'the plan', ends:['next year'], o2:{ k:'final', cj:'in order to', op:'try something new' }, why:'A decisão vem com data e objetivo: <i>will</i> + <i>next year</i> + <i>in order to</i>.' }
   ] },
 { id:'casa1', r:'objetivo', tema:'casa', nivel:1, titulo:'O jantar de domingo',
   ideia:'Uma rotina de casa em duas etapas e um episódio recente.',
   n:{ v:'<i>Cook</i> e <i>clean</i>: as duas tarefas de receber alguém. <i>Cook</i> volta no passado para contar um episódio.',
       t:'Presente simples para a rotina e passado simples para o episódio de <i>last night</i>.',
       e:'<i>Usually</i> + <i>on Sundays</i> marcam a rotina por dois encaixes diferentes; <i>after that</i> liga as etapas; <i>last night</i> tira a frase da rotina.',
       c:'<b>Finalidade + finalidade + concessão</b>: duas ações com propósito e um detalhe humano. A concessão no fim dá cor a um texto que seria só uma lista.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'cook', col:'dinner', mid:['usually'], ends:['on Sundays'], o2:{ k:'final', cj:'to', op:'feed {p} family' }, why:'<i>Usually</i> antes do verbo e <i>on Sundays</i> no fim: frequência e periodicidade se completam.' },
    { p:'He', t:'present', a:'simples', v:'clean', col:'the kitchen', ends:['after that'], o2:{ k:'final', cj:'in order to', op:'welcome {p} guests' }, why:'A sequência amarra a segunda etapa à primeira.' },
    { p:'He', t:'past', a:'simples', v:'cook', col:'for the family', ends:['last night'], o2:{ k:'conc', cj:'although', op:'messy' }, why:'Do hábito para o fato: <i>last night</i> exige passado simples. A concessão acrescenta o detalhe humano.' }
   ] },
 { id:'casa2', r:'sequencia', tema:'casa', nivel:2, titulo:'Preparando a casa',
   ideia:'Uma tarefa que vem sendo feita, uma tarefa concluída e o descanso planejado.',
   n:{ v:'<i>Clean, pack, stay</i>: preparar, organizar e descansar. Cada verbo pede um aspecto diferente (em curso, concluído, planejado), e é isso que o parágrafo quer mostrar.',
       t:'Present perfect continuous (<b>vem acontecendo</b>), passado simples (<b>aconteceu</b>) e futuro (<b>vai acontecer</b>).',
       e:'Cada aspecto com a sua peça: <i>lately</i>, <i>yesterday</i>, <i>this weekend</i>. <i>Carefully</i> combina com a finalidade de proteger.',
       c:'<b>Causa + finalidade + finalidade</b>: por que a pressa e para que cada ação. Um motivo no início sustenta os objetivos que vêm depois.' },
   s:[
    { p:'They', t:'present', a:'perfeito_continuo', v:'clean', col:'the house', ends:['lately'], o2:{ k:'caus', cj:'because', op:'guests' }, why:'Atividade repetida nos últimos dias: <i>have been cleaning</i> + <i>lately</i>. A causal explica a pressa.' },
    { p:'They', t:'past', a:'simples', v:'pack', col:'the boxes', ends:['carefully','yesterday'], o2:{ k:'final', cj:'in order to', op:'protect the items' }, why:'Modo antes de tempo. O modo (<i>carefully</i>) combina com a finalidade (proteger).' },
    { p:'They', t:'future', a:'simples', v:'stay', col:'at home', ends:['this weekend'], o2:{ k:'final', cj:'to', op:'rest' }, why:'Plano próximo: lugar, depois tempo, depois o objetivo.' }
   ] },
 { id:'car1', r:'objetivo', tema:'carreira', nivel:2, titulo:'A nova carreira',
   ideia:'Um aprendizado em curso, o esforço diário e a escolha que vem depois.',
   n:{ v:'<i>Learn, study, choose</i>: aprender, insistir, decidir. Três momentos de uma transição de carreira.',
       t:'Present perfect continuous (processo), presente simples (rotina) e futuro (previsão).',
       e:'<i>Lately</i> e <i>every evening</i> marcam o esforço; <i>probably</i> e <i>next year</i> graduam e datam a escolha.',
       c:'<b>Finalidade + concessão + tempo</b>: objetivo, custo e o momento da decisão. É o mesmo esqueleto do relato de progresso, agora com um processo em curso.' },
   s:[
    { p:'She', t:'present', a:'perfeito_continuo', v:'learn', col:'a new skill', ends:['lately'], o2:{ k:'final', cj:'in order to', op:'get a better job' }, why:'O Present Perfect Continuous mostra um processo ainda em andamento, e <i>in order to</i> declara para onde ele vai.' },
    { p:'She', t:'present', a:'simples', v:'study', ends:['every evening'], o2:{ k:'conc', cj:'even though', op:'tiring' }, why:'A concessão forte (<i>even though</i>) valoriza a constância marcada por <i>every evening</i>.' },
    { p:'She', t:'future', a:'simples', v:'choose', col:'a career', mid:['probably'], ends:['next year'], o2:{ k:'temp', cj:'as soon as', op:'the next step' }, why:'<i>Will</i> na principal e presente depois de <i>as soon as</i>. <i>Probably</i> fica entre <i>will</i> e o verbo.' }
   ] },
 { id:'car2', r:'condicao', tema:'carreira', nivel:3, titulo:'Decidir sob pressão',
   ideia:'Reflexão, constatação, hipótese e decisão.',
   n:{ v:'<i>Think, know, decide</i>: verbos de mente, não de ação. Por isso a 2ª oração muda de natureza: o que ele sabe é uma oração inteira.',
       t:'Passado simples (reflexão feita), presente simples (constatação), <i>would</i> (hipótese) e <i>will</i> (plano).',
       e:'<i>Carefully yesterday</i> na reflexão e <i>tomorrow</i> na decisão. As frases do meio dispensam peças.',
       c:'<b>Finalidade + oração objeto + condição hipotética + finalidade</b>: a oração com <i>that</i> não é um extra, é o próprio objeto de <i>know</i>. E o contraste <i>would decide</i> / <i>will decide</i> separa o imaginado do planejado.' },
   s:[
    { p:'He', t:'past', a:'simples', v:'think', col:'carefully', ends:['yesterday'], o2:{ k:'final', cj:'in order to', op:'make a good decision' }, why:'Modo antes de tempo; o modo combina com a finalidade.' },
    { p:'He', t:'present', a:'simples', v:'know', o2:{ q:'decision', k:'obj', cj:'that', op:'difficult' }, why:'Verbos de pensar e saber pedem uma oração como objeto: <i>know that</i> + frase completa. Sem vírgula.' },
    { p:'He', t:'future', a:'simples', v:'decide', col:'quickly', o2:{ k:'cond', cj:'if', op:'a clear answer', cnd:2 }, why:'Hipótese: <i>would</i> + <i>if</i> + passado. A situação é imaginada, por isso não é <i>will</i>.' },
    { p:'He', t:'future', a:'simples', v:'decide', col:'everything', ends:['tomorrow'], o2:{ k:'final', cj:'in order to', op:'move forward' }, why:'Agora sim um plano real: <i>will</i> + <i>tomorrow</i>. O mesmo verbo, outro modo de ver o futuro.' }
   ] },
 { id:'cond2', r:'condicao', tema:'carreira', nivel:3, titulo:'E se fosse diferente',
   ideia:'Uma hipótese sobre o presente, outra sobre o passado e o que continua real.',
   n:{ v:'<i>Start</i> e <i>accept</i> são verbos de decisão, bons para hipóteses; <i>work</i> é o verbo da continuidade, que ancora o texto no real.',
       t:'<i>Would</i> + verbo (hipótese de agora), <i>would have</i> + particípio (o que não aconteceu) e presente simples (o real).',
       e:'Apenas <i>still</i>, na última frase: é ele que traz o texto de volta à realidade.',
       c:'<b>Condição hipotética + condição do passado irreal + concessão (even if)</b>: do imaginável ao impossível e de volta ao real. <i>Even if</i> fecha dizendo que o fato se mantém em qualquer hipótese. É a combinação para pesar escolhas.' },
   s:[
    { p:'I', t:'future', a:'simples', v:'start', col:'a business', o2:{ k:'cond', cj:'if', op:'the money', cnd:2 }, why:'Tipo 2: <i>would</i> + <i>if</i> + passado. Hipótese sobre agora.' },
    { p:'I', t:'future', a:'perfeito', v:'accept', col:'the offer', o2:{ k:'cond', cj:'if', op:'a fair price', cnd:3 }, why:'Tipo 3: <i>would have</i> + <i>if</i> + <i>had</i>. Fala do que não aconteceu.' },
    { p:'I', t:'present', a:'simples', v:'work', col:'on a project', mid:['still'], o2:{ k:'conc', cj:'even if', op:'tiring' }, why:'<i>Even if</i> = "mesmo que": o fato resiste à hipótese. <i>Still</i> reforça a continuidade.' }
   ] },
 { id:'com1', r:'objetivo', tema:'comunicação', nivel:1, titulo:'Falar para ser entendido',
   ideia:'Três atitudes de quem aprende, cada uma com a sua razão.',
   n:{ v:'<i>Speak, listen, ask</i> são os três gestos de uma conversa: emitir, receber e buscar. Um verbo por atitude, para cada um ganhar a sua razão.',
       t:'Tudo no presente simples, porque são atitudes permanentes: o parágrafo descreve um jeito de ser, não um episódio.',
       e:'Dois modos depois do verbo (<i>slowly</i>, <i>carefully</i>) e duas peças do meio antes dele (<i>always</i>, <i>also</i>).',
       c:'<b>Finalidade + finalidade + causa</b>: modo e finalidade trabalham juntos (falo devagar <b>para</b> ser entendido). É a combinação para explicar o próprio método.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'speak', col:'slowly', mid:['always'], o2:{ k:'final', cj:'in order to', op:'be understood' }, why:'Frequência antes do verbo, modo depois. A finalidade explica o modo.' },
    { p:'I', t:'present', a:'simples', v:'listen', col:'carefully', mid:['also'], o2:{ k:'final', cj:'to', op:'understand the problem' }, why:'<i>Also</i> soma a segunda atitude. Mesma lógica, com <i>to</i> no lugar de <i>in order to</i>.' },
    { p:'I', t:'present', a:'simples', v:'ask', col:'the teacher', o2:{ k:'caus', cj:'because', op:'an answer' }, why:'A terceira frase troca finalidade por causa, para variar a ligação.' }
   ] },
 { id:'com2', r:'objetivo', tema:'comunicação', nivel:2, titulo:'A ligação que resolveu',
   ideia:'Uma ação com objetivo, uma atitude difícil e o encontro marcado.',
   n:{ v:'<i>Call, tell, meet</i>: contato, franqueza e encontro. São verbos de interação com outra pessoa, na ordem em que uma conversa difícil acontece.',
       t:'Dois passados simples e um futuro: o que foi feito leva ao que está marcado.',
       e:'Só as datas (<i>yesterday</i>, <i>tomorrow</i>): elas bastam para segurar a cronologia.',
       c:'<b>Finalidade + concessão + finalidade</b>: a concessão vem na frente para preparar o leitor antes do fato difícil. Útil para dar uma notícia delicada.' },
   s:[
    { p:'She', t:'past', a:'simples', v:'call', col:'the office', ends:['yesterday'], o2:{ k:'final', cj:'in order to', op:'confirm the meeting' }, why:'O primeiro gesto da história: uma ligação com data e com propósito claro.' },
    { p:'She', t:'past', a:'simples', v:'tell', col:'the truth', o2:{ k:'conc', cj:'although', op:'awkward' }, why:'A concessão abre a frase e a vírgula separa: o difícil vem antes, o fato depois.' },
    { p:'She', t:'future', a:'simples', v:'meet', col:'the team', ends:['tomorrow'], o2:{ k:'final', cj:'to', op:'discuss the plan' }, why:'O resultado das duas ações: um encontro com data e objetivo.' }
   ] },
 { id:'neg1', r:'causa', tema:'negócios', nivel:2, titulo:'Do time ao site',
   ideia:'A origem de um negócio, a operação atual, um resultado recente e o próximo investimento.',
   n:{ v:'<i>Build, sell, improve, build</i>: construir, vender, melhorar e construir de novo. O verbo que abre também fecha.',
       t:'Passado simples, presente simples, present perfect e futuro: a linha do tempo completa de um negócio.',
       e:'Uma peça de tempo por frase, cada uma do seu tempo verbal: <i>last year</i>, <i>now</i>, <i>lately</i>, <i>next year</i>.',
       c:'<b>Finalidade + finalidade + consequência + finalidade</b>: é a consequência (<i>so</i>) no meio que prova que os objetivos deram resultado. Sem ela, o texto seria só intenção.' },
   s:[
    { p:'We', t:'past', a:'simples', v:'build', col:'a team', ends:['last year'], o2:{ k:'final', cj:'to', op:'grow the business' }, why:'O ponto de partida vem datado (<i>last year</i>) e já com objetivo: a equipe foi montada para crescer.' },
    { p:'We', t:'present', a:'simples', v:'sell', col:'products online', mid:['now'], o2:{ k:'final', cj:'in order to', op:'reach new customers' }, why:'<i>Now</i> traz o leitor do passado para o presente: a mesma estratégia, agora em outro canal, com novo objetivo.' },
    { p:'We', t:'present', a:'perfeito', v:'improve', col:'the quality', ends:['lately'], o2:{ k:'cons', cj:'so', op:'more money' }, why:'Present perfect nas duas orações: a melhora e o ganho vêm do passado recente até agora.' },
    { p:'We', t:'future', a:'simples', v:'build', col:'a website', ends:['next year'], o2:{ k:'final', cj:'to', op:'serve {p} customers' }, why:'O verbo da primeira frase volta no futuro: o negócio continua sendo construído.' }
   ] },
 { id:'neg2', r:'condicao', tema:'negócios', nivel:3, titulo:'Vender ou manter',
   ideia:'Uma decisão arriscada, o que poderia ter sido diferente e o que foi feito depois.',
   n:{ v:'<i>Sell</i> aparece como fato e como hipótese; <i>invest</i> mostra o que foi feito depois.',
       t:'Passado simples para o real e <i>would have</i> + particípio para o que <b>não</b> aconteceu.',
       e:'<i>Last year</i> e <i>after that</i> seguram a linha dos fatos; a hipótese fica sem peças, fora do tempo real.',
       c:'<b>Concessão + condição do passado irreal + finalidade</b>: o contraste entre o que aconteceu e o que poderia ter acontecido. É a combinação para avaliar decisões passadas.' },
   s:[
    { p:'They', t:'past', a:'simples', v:'sell', col:'the house', ends:['last year'], o2:{ k:'conc', cj:'although', op:'risky' }, why:'Um fato real e datado, com a ressalva na frente: o leitor já sabe do risco antes de saber da venda.' },
    { p:'They', t:'future', a:'perfeito', v:'sell', col:'everything', o2:{ k:'cond', cj:'if', op:'a better price', cnd:3 }, why:'Passado irreal: <i>would have sold</i> + <i>if</i> + <i>had wanted</i>. Em português: "teriam vendido… se tivessem querido".' },
    { p:'They', t:'past', a:'simples', v:'invest', col:'money', ends:['after that'], o2:{ k:'final', cj:'in order to', op:'grow {p} money' }, why:'De volta ao real: <i>after that</i> retoma a linha dos fatos.' }
   ] },
 { id:'m1', r:'descricao', tema:'trabalho', nivel:2, titulo:'O time certo',
   ideia:'Quem foi contratado, o que se usa, como se trabalha e por quê.',
   n:{ v:'<i>Hire, use, test, send</i>: montar o time, escolher a ferramenta, verificar e entregar. Verbos concretos de rotina de equipe.',
       t:'Um passado simples para a contratação (fato encerrado) e presente simples para tudo o que virou rotina.',
       e:'<i>Always</i> e <i>every day</i> marcam a rotina. As duas primeiras frases não levam peças: a oração relativa já ocupa o lugar depois do substantivo.',
       c:'<b>Adjetiva + adjetiva + coordenada aditiva + adverbial causal</b>. As relativas <b>especificam</b> (qual desenvolvedor? qual ferramenta?), a aditiva <b>soma</b> ações e a causal <b>justifica</b>. Estilo descritivo: primeiro defino as coisas com precisão, depois digo o que faço com elas e por quê.' },
   s:[
    { p:'We', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'rel', cj:'who', v:'need' }, why:'<i>Who</i> para pessoa: a oração diz <b>qual</b> desenvolvedor. Sem vírgula, porque a informação é essencial.' },
    { p:'We', t:'present', a:'simples', v:'use', col:'a tool', o2:{ k:'rel', cj:'that', v:'need' }, why:'<i>That</i> para coisa. Mesma função: restringir o substantivo.' },
    { p:'We', t:'present', a:'simples', v:'test', col:'the code', mid:['always'], o2:{ k:'adit', cj:'and', v:'check' }, why:'<i>And</i> coordena duas ações de mesmo peso; o objeto se repete na segunda.' },
    { p:'We', t:'present', a:'simples', v:'send', col:'the report', ends:['every day'], o2:{ k:'caus', cj:'because', op:'to save time' }, why:'A causal fecha o parágrafo com o motivo da rotina: tudo o que veio antes existe para economizar tempo.' }
   ] },
 { id:'m2', r:'condicao', tema:'negócios', nivel:3, titulo:'A oferta na mesa',
   ideia:'Um fato aceito, a escolha que se abre, a condição e o resultado da conversa.',
   n:{ v:'<i>Accept</i> aparece três vezes com papéis diferentes (aceitar um fato, aceitar ou recusar, aceitar sob condição); <i>negotiate</i> fecha com o que já foi conquistado.',
       t:'Presente simples (o que se reconhece), futuro (a decisão e a condição) e passado simples (o que já rendeu).',
       e:'<i>Tomorrow</i> data a decisão e <i>yesterday</i> data a negociação: o parágrafo fica entre ontem e amanhã.',
       c:'<b>Completiva nominal + coordenada alternativa + adverbial condicional + coordenada conclusiva</b>. A completiva dá conteúdo a um substantivo abstrato (<i>the fact that…</i>), a alternativa abre duas saídas, a condicional escolhe entre elas e a conclusiva mostra o ganho. É o estilo de quem delibera em voz alta.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'accept', o2:{ q:'offer', k:'cn', cj:'that', op:'fact' }, why:'<i>The fact that</i> + oração: a oração completa o substantivo <i>fact</i>.' },
    { p:'We', t:'future', a:'simples', v:'accept', col:'the offer', ends:['tomorrow'], o2:{ k:'alt', cj:'or', v:'reject' }, why:'<i>Or</i> liga duas possibilidades que se excluem; os verbos são opostos.' },
    { p:'We', t:'future', a:'simples', v:'accept', col:'the offer', o2:{ k:'cond', cj:'as long as', op:'a fair price' }, why:'<i>As long as</i> = desde que: a condição que decide a alternativa.' },
    { p:'We', t:'past', a:'simples', v:'negotiate', col:'the price', ends:['yesterday'], o2:{ k:'cons', cj:'so', op:'more money' }, why:'O resultado já obtido (<i>yesterday… so</i>) sustenta a posição: não é promessa, é ganho registrado.' }
   ] },
 { id:'m3', r:'argumento', tema:'estudo', nivel:2, titulo:'Difícil, mas possível',
   ideia:'Reconhecer a dificuldade, insistir apesar dela e mostrar o resultado.',
   n:{ v:'<i>Know</i> abre com a consciência do problema; <i>study, improve, practice</i> mostram a resposta a ele.',
       t:'Presente simples para o que ela sabe e faz; present perfect para a melhora que chega até agora.',
       e:'<i>Hard… every day</i> descreve o esforço e <i>really… lately</i> dá força e recência ao resultado.',
       c:'<b>Substantiva objetiva + adverbial concessiva + substantiva predicativa + coordenada conclusiva</b>. Duas substantivas emolduram o texto (o que ela sabe / qual é a verdade); entre elas, a concessiva admite o custo e a conclusiva entrega o efeito. Estilo de quem argumenta com honestidade: admite, persiste e prova.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'know', o2:{ q:'test', k:'obj', cj:'that', op:'difficult' }, why:'A oração com <i>that</i> é o objeto de <i>know</i>: o que ela sabe.' },
    { p:'She', t:'present', a:'simples', v:'study', col:'hard', ends:['every day'], o2:{ k:'conc', cj:'although', op:'tiring' }, why:'A concessão vem na frente: o cansaço não impede o estudo.' },
    { p:'She', t:'present', a:'perfeito', v:'improve', mid:['really'], ends:['lately'], o2:{ k:'pred', cj:'… is that', op:'truth' }, why:'<i>The truth is that…</i>: a oração é o predicativo, diz qual é a verdade.' },
    { p:'She', t:'present', a:'simples', v:'practice', col:'English', o2:{ k:'cons', cj:'so', op:'confident' }, why:'A consequência fecha o argumento: saber da dificuldade e insistir levou à confiança.' }
   ] },
 { id:'m4', r:'sequencia', tema:'estudo', nivel:2, titulo:'Um método de estudo',
   ideia:'Onde está o foco, a ordem das ações, a medida do esforço e o próximo passo.',
   n:{ v:'<i>Focus, read, study, practice</i>: concentrar, receber, aprofundar, usar. É a ordem de um método.',
       t:'Presente simples para o método e futuro para o próximo passo.',
       e:'<i>Usually… at home</i> situa a leitura (frequência e lugar) e <i>tomorrow</i> data a prática. As frases do meio ficam sem peças porque a comparação já traz o modo.',
       c:'<b>Objetiva indireta + coordenada aditiva + adverbial comparativa + adverbial final</b>. A objetiva indireta vem depois de preposição (<i>focus on</i> + <i>-ing</i>), a aditiva com <i>and then</i> põe as ações em ordem, a comparativa mede o empenho e a final aponta o objetivo. Estilo de quem descreve um procedimento com critério.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'focus', o2:{ k:'oi', cj:'-ing', op:'the problem' }, why:'Depois de preposição (<i>on</i>) o verbo vai para <i>-ing</i>: <i>focuses on understanding</i>.' },
    { p:'He', t:'present', a:'simples', v:'read', col:'the book', mid:['usually'], ends:['at home'], o2:{ k:'adit', cj:'and then', v:'study' }, why:'<i>And then</i> soma e ordena: primeiro lê, depois estuda.' },
    { p:'He', t:'present', a:'simples', v:'study', col:'for the exam', o2:{ k:'cmp', cj:'as … as', op:'seriously' }, why:'Comparação de igualdade com auxiliar no fim (<i>she does</i>).' },
    { p:'He', t:'future', a:'simples', v:'practice', col:'English', ends:['tomorrow'], o2:{ k:'final', cj:'in order to', op:'reach fluency' }, why:'O objetivo vem por último e dá sentido às três etapas do método.' }
   ] },
 { id:'m5', r:'descricao', tema:'negócios', nivel:3, titulo:'Aprender com quem sabe',
   ideia:'Uma meta declarada, uma contratação comentada e a regra que as une.',
   n:{ v:'<i>Share, hire, learn</i>: declarar a meta, trazer alguém e aprender.',
       t:'Presente simples para a meta e a regra; passado simples para a contratação.',
       e:'Nenhuma palavra-sinal: aposto, relativa e proporção já preenchem as frases.',
       c:'<b>Apositiva + adjetiva explicativa + adverbial proporcional</b>. A apositiva anuncia e revela (<i>one goal: to…</i>), a relativa entre vírgulas acrescenta um comentário (<i>, whose company…</i>) e a proporcional generaliza. Estilo elegante de apresentação: anuncio, detalho de passagem e concluo com uma regra.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'share', o2:{ k:'ap', cj:': to', op:'goal' }, why:'Os dois-pontos anunciam; o infinitivo diz qual é a meta.' },
    { p:'We', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'relx', cj:'whose', wh:'company' }, why:'Com vírgula, a relativa não restringe: só acrescenta uma informação. <i>Whose</i> = cuja.' },
    { p:'We', t:'present', a:'simples', v:'learn', o2:{ k:'prop', cj:'the more … the more', v:'understand' }, why:'A regra geral dá sentido às duas frases anteriores.' }
   ] },
 { id:'m6', r:'descricao', tema:'finanças', nivel:2, titulo:'O presente caro',
   ideia:'Uma compra descrita, como foi paga e a regra que fica.',
   n:{ v:'<i>Buy, pay, plan</i>: comprar, pagar e planejar. O parágrafo vai do gesto pontual ao hábito e do hábito ao princípio, e os verbos acompanham essa subida.',
       t:'Passado simples para a compra e presente simples para o hábito e a recomendação.',
       e:'Só os complementos (<i>in cash</i>, <i>the bill</i>, <i>the budget</i>). As orações fazem o resto.',
       c:'<b>Adjetiva (whose) + adverbial concessiva + adverbial conformativa + substantiva subjetiva</b>. Descrevo o objeto (<i>whose price was high</i>), admito o custo, mostro que sigo o combinado e termino com um princípio (<i>It is important to…</i>). Do caso particular à regra geral.' },
   s:[
    { p:'I', t:'past', a:'simples', v:'buy', col:'a gift', o2:{ k:'rel', cj:'whose', wh:'price' }, why:'<i>Whose</i> indica posse: o preço do presente. A oração acompanha o passado da principal.' },
    { p:'I', t:'past', a:'simples', v:'pay', col:'in cash', o2:{ k:'conc', cj:'although', op:'expensive' }, why:'A ressalva na frente prepara o leitor: o preço era alto e, ainda assim, o pagamento foi à vista.' },
    { p:'I', t:'present', a:'simples', v:'pay', col:'the bill', o2:{ k:'conf', cj:'as', op:'the agreement' }, why:'Do episódio para o hábito: no presente, a mesma pessoa paga <b>conforme o combinado</b>.' },
    { p:'I', t:'present', a:'simples', v:'plan', col:'the budget', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'<i>It is important to</i> + verbo: o infinitivo é o verdadeiro sujeito.' }
   ] },
 { id:'m7', r:'contraste', tema:'saúde', nivel:1, titulo:'Dormir é prioridade',
   ideia:'Um princípio, a realidade que o contradiz, a regra e a decisão.',
   n:{ v:'<i>Sleep</i> e <i>rest</i> contra <i>work</i>; <i>train</i> entra como o que melhora quando há equilíbrio.',
       t:'Presente simples para princípio, realidade e regra; futuro para a decisão.',
       e:'<i>Often</i> gradua o problema (não é sempre, mas é muito) e <i>this weekend</i> põe prazo na solução.',
       c:'<b>Substantiva subjetiva + coordenada adversativa + adverbial proporcional + adverbial final</b>. O princípio vem impessoal (<i>It is important to…</i>), o <i>but</i> mostra que a prática não o segue, a proporção lembra o que está em jogo e a final resolve. Estilo de quem se corrige.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'sleep', col:'eight hours', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'O parágrafo abre com um princípio sem dono (<i>It is important to…</i>), que vale para qualquer pessoa.' },
    { p:'I', t:'present', a:'simples', v:'work', mid:['often'], o2:{ k:'adv', cj:'but', v:'rest', vneg:true }, why:'A realidade contradiz o princípio: é este <i>but</i> que cria a tensão do texto.' },
    { p:'I', t:'present', a:'simples', v:'train', o2:{ k:'prop', cj:'the more … the more', v:'improve' }, why:'A regra lembra o que está em jogo: quem melhora é quem treina, e para treinar é preciso estar descansado.' },
    { p:'I', t:'future', a:'simples', v:'rest', ends:['this weekend'], o2:{ k:'final', cj:'to', op:'recover energy' }, why:'A tensão se resolve numa decisão concreta, com data (<i>this weekend</i>) e objetivo.' }
   ] },
 { id:'m8', r:'sequencia', tema:'tecnologia', nivel:2, titulo:'Tudo conforme o plano',
   ideia:'O que foi feito segundo o plano, em que ordem, com que efeito e o princípio que fica.',
   n:{ v:'<i>Test, install, save</i>: testar, instalar e salvar. <i>Test</i> volta no fim como princípio, fechando o texto com o verbo que o abriu.',
       t:'Passado simples para as etapas e presente simples para a rotina e o princípio.',
       e:'<i>Last week</i> e <i>every day</i>: uma data para o projeto, uma periodicidade para a rotina.',
       c:'<b>Adverbial conformativa + adverbial temporal + coordenada conclusiva + substantiva subjetiva</b>. Conformidade (<i>as we planned</i>), ordem (<i>after</i>), efeito (<i>so</i>) e princípio (<i>It is important to</i>). Estilo de relatório bem fechado.' },
   s:[
    { p:'We', t:'past', a:'simples', v:'test', col:'the system', ends:['last week'], o2:{ k:'conf', cj:'as', op:'the plan' }, why:'O relatório começa pela conformidade: o teste aconteceu quando e como estava previsto.' },
    { p:'We', t:'past', a:'simples', v:'install', col:'an update', o2:{ k:'temp', cj:'after', op:'the bug' }, why:'<i>After</i> põe as duas ações passadas em ordem: primeiro o conserto, depois a atualização, sem pular etapas.' },
    { p:'We', t:'present', a:'simples', v:'save', col:'the file', ends:['every day'], o2:{ k:'cons', cj:'so', op:'the system' }, why:'Da ação pontual para a rotina, e da rotina para o seu efeito: a confiança no sistema.' },
    { p:'We', t:'present', a:'simples', v:'test', col:'the code', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'O princípio final transforma o relato num ensinamento: o que foi feito vira regra.' }
   ] },
 { id:'m9', r:'condicao', tema:'carreira', nivel:3, titulo:'Pensar antes de mudar',
   ideia:'Uma dúvida, uma hipótese, o que continua igual e a decisão marcada.',
   n:{ v:'<i>Think, start, work, decide</i>: refletir, imaginar um começo, seguir e decidir.',
       t:'Presente simples (dúvida e realidade), <i>would</i> (hipótese) e <i>will</i> (decisão).',
       e:'<i>Still</i> mostra que nada mudou ainda e <i>tomorrow</i> marca o dia da decisão. As duas primeiras frases ficam sem peças: dúvida e hipótese estão fora do calendário.',
       c:'<b>Objetiva indireta + condicional hipotética + concessiva + final</b>. A dúvida vem como oração depois de preposição (<i>about whether…</i>), a hipótese explora uma saída, a concessiva mantém o real e a final decide. Estilo reflexivo: pondera antes de agir.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'think', o2:{ q:'change', k:'oi', cj:'whether', op:'difficult' }, why:'<i>About whether</i> + oração: a dúvida é o complemento da preposição.' },
    { p:'He', t:'future', a:'simples', v:'start', col:'a business', o2:{ k:'cond', cj:'if', op:'the money', cnd:2 }, why:'A hipótese explora uma saída sem se comprometer com ela: é imaginação, não plano.' },
    { p:'He', t:'present', a:'simples', v:'work', col:'on a project', mid:['still'], o2:{ k:'conc', cj:'even if', op:'tiring' }, why:'<i>Even if</i> é mais forte que <i>although</i>: o trabalho no projeto continua em qualquer caso, canse ou não.' },
    { p:'He', t:'future', a:'simples', v:'decide', col:'everything', ends:['tomorrow'], o2:{ k:'final', cj:'in order to', op:'move forward' }, why:'O contraste com a frase 2 é o ponto: lá era <i>would</i> (suposição), aqui é <i>will</i> (decisão tomada).' }
   ] },
 { id:'m10', r:'argumento', tema:'trabalho', nivel:3, titulo:'A crença e a prova',
   ideia:'Uma convicção, a intensidade do esforço, a entrega e o ponto central.',
   n:{ v:'<i>Share, work, deliver</i>: acreditar junto, trabalhar e entregar.',
       t:'Presente simples para convicção e regra; passado simples para a entrega que prova.',
       e:'Só <i>always</i>, na regra final. As estruturas carregam o sentido.',
       c:'<b>Completiva nominal + consecutiva intensiva + conformativa + predicativa</b>. Uma crença (<i>the belief that…</i>), um esforço medido pelo efeito (<i>so much that</i>), um fato conforme o acordo e a tese (<i>The point is that</i>). Estilo de defesa: convicção, evidência e conclusão.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'share', o2:{ q:'deadline', k:'cn', cj:'that', op:'belief' }, why:'A oração completa o substantivo <i>belief</i>: diz <b>qual</b> crença é essa, e abre o retrato pelo que ela pensa.' },
    { p:'She', t:'present', a:'simples', v:'work', o2:{ k:'csq', cj:'so much that', op:'more money' }, why:'A intensidade do trabalho é medida pela consequência: depois da crença, vem o esforço e o que ele rende.' },
    { p:'She', t:'past', a:'simples', v:'deliver', col:'on time', o2:{ k:'conf', cj:'just as', op:'the agreement' }, why:'<i>Just as we agreed</i>: a entrega seguiu exatamente o combinado, o episódio que comprova a dedicação.' },
    { p:'She', t:'present', a:'simples', v:'deliver', col:'on time', mid:['always'], o2:{ k:'pred', cj:'… is that', op:'point' }, why:'A tese final, no presente com <i>always</i>: do episódio isolado para o traço permanente da pessoa.' }
   ] },
 { id:'m11', r:'condicao', tema:'viagem', nivel:2, titulo:'Ficar ou sair',
   ideia:'Duas opções, a condição, o costume com a sua razão e um princípio.',
   n:{ v:'<i>Stay</i> e <i>leave</i> são opostos; <i>travel</i> e <i>plan</i> completam o assunto.',
       t:'Futuro para as opções e a condição; presente simples para o costume e o princípio.',
       e:'<i>Tonight</i> e <i>tomorrow</i> datam as duas decisões; <i>usually</i> marca o costume.',
       c:'<b>Coordenada alternativa + adverbial condicional + coordenada explicativa + substantiva subjetiva</b>. Abro opções (<i>or</i>), condiciono (<i>if</i>), explico um costume (<i>for</i>) e fecho com um princípio. Três famílias de oração num texto curto.' },
   s:[
    { p:'We', t:'future', a:'simples', v:'stay', col:'at home', ends:['tonight'], o2:{ k:'alt', cj:'or', v:'leave' }, why:'O texto abre com duas saídas possíveis para hoje à noite.' },
    { p:'We', t:'future', a:'simples', v:'leave', col:'early', ends:['tomorrow'], o2:{ k:'cond', cj:'if', op:'heavy traffic' }, why:'A condição decide o amanhã: sair cedo depende do trânsito esperado.' },
    { p:'We', t:'present', a:'simples', v:'travel', col:'by train', mid:['usually'], o2:{ k:'expl', cj:'for', op:'to save time' }, why:'<i>For</i>, depois de vírgula, justifica o costume: viajar de trem é uma escolha pensada, e não um acaso.' },
    { p:'We', t:'present', a:'simples', v:'plan', col:'the trip', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'O princípio amarra tudo: opções e condições só existem porque planejar importa.' }
   ] },
 { id:'m12', r:'argumento', tema:'comunicação', nivel:2, titulo:'Dizer o que é difícil',
   ideia:'O que ela afirma, sobre o que fala, como fala e o que já enfrentou.',
   n:{ v:'<i>Say, talk, speak, tell</i>: os quatro verbos de "dizer", cada um com a sua construção.',
       t:'Presente simples para o hábito de fala; passado simples para um episódio.',
       e:'<i>Always</i> marca o hábito e o modo <i>slowly</i> conversa com a finalidade: fala devagar justamente para ser entendida.',
       c:'<b>Objetiva direta + objetiva indireta + adverbial final + adverbial concessiva</b>. <i>Say that…</i> (sem preposição) e <i>talk about how…</i> (com preposição) mostram os dois jeitos de encaixar uma oração como complemento. Depois vêm o objetivo e a ressalva.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'say', o2:{ q:'plan', k:'obj', cj:'that', op:'risky' }, why:'<i>Say that</i> + oração: a oração inteira é o que ela diz. O retrato começa pela franqueza.' },
    { p:'She', t:'present', a:'simples', v:'talk', o2:{ q:'truth', k:'oi', cj:'how', op:'risky' }, why:'<i>Talk about how</i> + adjetivo + sujeito + verbo: ordem de afirmação, não de pergunta.' },
    { p:'She', t:'present', a:'simples', v:'speak', col:'slowly', mid:['always'], o2:{ k:'final', cj:'in order to', op:'be understood' }, why:'O modo (<i>slowly</i>) é escolhido por causa do objetivo: falar devagar é um meio de ser entendida.' },
    { p:'She', t:'past', a:'simples', v:'tell', col:'the truth', o2:{ k:'conc', cj:'although', op:'awkward' }, why:'Um episódio passado comprova a atitude: mesmo sendo constrangedor, ela disse a verdade.' }
   ] },
 { id:'m13', r:'argumento', tema:'comunicação', nivel:3, titulo:'Uma dúvida honesta',
   ideia:'A pergunta, a razão de perguntar, o que já se sabe e o ponto central.',
   n:{ v:'<i>Ask, know, listen</i>: perguntar, saber e escutar. São verbos que pedem uma oração como complemento, por isso o parágrafo é rico em substantivas.',
       t:'Presente simples em tudo: é um retrato de atitude, sem linha do tempo. O interesse está nas estruturas, não na cronologia.',
       e:'Só o modo <i>carefully</i>. Quando o complemento do verbo é uma oração inteira, quase não sobra lugar para palavras-sinal.',
       c:'<b>Objetiva direta (whether) + coordenada explicativa + apositiva + predicativa</b>. A pergunta indireta com <i>whether</i>, o fundamento com <i>for</i>, o fato anunciado por dois-pontos e a tese. Três substantivas diferentes no mesmo parágrafo.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'ask', o2:{ q:'test', k:'obj', cj:'whether', op:'difficult' }, why:'Pergunta indireta: <i>whether</i> + ordem de afirmação.' },
    { p:'She', t:'present', a:'simples', v:'ask', col:'the teacher', o2:{ k:'expl', cj:'for', op:'to be clear' }, why:'A razão da pergunta: ela não duvida por duvidar, quer clareza.' },
    { p:'She', t:'present', a:'simples', v:'know', o2:{ q:'lesson', k:'ap', cj:': that', op:'fact' }, why:'O que já está resolvido aparece como um fato único, anunciado e depois revelado.' },
    { p:'She', t:'present', a:'simples', v:'listen', col:'carefully', o2:{ k:'pred', cj:'… is that', op:'point' }, why:'A tese resume o retrato: mais do que perguntar ou saber, o essencial é escutar.' }
   ] },
 { id:'m14', r:'contraste', tema:'negócios', nivel:3, titulo:'Contratar ou demitir',
   ideia:'A decisão em aberto, o que se admite, o que já foi feito e o custo de liderar.',
   n:{ v:'<i>Hire</i> e <i>fire</i> são opostos; <i>accept</i> e <i>manage</i> mostram a postura de quem decide.',
       t:'Futuro para a decisão, presente simples para o que se admite e passado simples para o fato.',
       e:'<i>Next month</i> dá o prazo da decisão. As outras frases ficam sem peças para que as quatro estruturas apareçam limpas.',
       c:'<b>Coordenada alternativa + apositiva + adjetiva restritiva + adverbial concessiva</b>: as <b>quatro famílias</b> num só parágrafo. Opções, um fato admitido, uma pessoa especificada e uma ressalva.' },
   s:[
    { p:'They', t:'future', a:'simples', v:'hire', col:'a developer', ends:['next month'], o2:{ k:'alt', cj:'or', v:'fire' }, why:'A decisão abre o texto como um dilema entre dois verbos opostos.' },
    { p:'They', t:'present', a:'simples', v:'accept', o2:{ q:'plan', k:'ap', cj:': that', op:'possibility' }, why:'O que se admite de antemão: uma possibilidade desconfortável, dita com clareza.' },
    { p:'They', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'rel', cj:'who', v:'need' }, why:'A relativa sem vírgula identifica <b>qual</b> desenvolvedor: aquele de que precisavam. A decisão já teve um primeiro resultado.' },
    { p:'They', t:'present', a:'simples', v:'manage', col:'a team', o2:{ k:'conc', cj:'although', op:'stressful' }, why:'A ressalva final humaniza: liderar a equipe continua, apesar do desgaste.' }
   ] },
 { id:'m15', r:'causa', tema:'casa', nivel:1, titulo:'Cozinhar todo dia',
   ideia:'O que se faz, por que e o princípio.',
   n:{ v:'<i>Cook</i> aparece em três construções diferentes, e <i>fry</i> entra como ação somada. Manter o verbo deixa visível o que muda: só a ligação entre as orações.',
       t:'Presente simples em tudo: hábito na primeira e na segunda frase, princípio geral na terceira.',
       e:'<i>Usually… at home</i> situa o hábito com frequência e lugar. As outras frases ficam sem peças.',
       c:'<b>Coordenada aditiva + adverbial causal + substantiva subjetiva</b>. Somo ações, dou o motivo e enuncio o princípio. Combinação simples que já usa três famílias.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'cook', col:'rice', o2:{ k:'adit', cj:'and', v:'fry' }, why:'Duas ações de cozinha somadas mostram que é rotina, não evento.' },
    { p:'I', t:'present', a:'simples', v:'cook', col:'dinner', mid:['usually'], ends:['at home'], o2:{ k:'caus', cj:'since', op:'a healthy life' }, why:'O motivo vem na frente porque é o ponto de partida: é por querer saúde que ele cozinha em casa.' },
    { p:'I', t:'present', a:'simples', v:'cook', col:'for the family', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'O princípio fecha, tirando do hábito pessoal uma regra que vale para todos.' }
   ] },
 { id:'m16', r:'proporcao', tema:'estudo', nivel:3, titulo:'Do jeito que o professor ensinou',
   ideia:'O modelo seguido, a intensidade, a regra e o que todos veem.',
   n:{ v:'<i>Study, read, practice</i>: seguir o modelo, ler e repetir. São verbos de aprendizado, e cada um recebe uma medida diferente.',
       t:'Presente simples em tudo: o parágrafo descreve um jeito constante de estudar, não um episódio.',
       e:'Nenhuma palavra-sinal: conformidade, intensidade e proporção já dizem "como" e "quanto".',
       c:'<b>Conformativa + consecutiva intensiva + proporcional + subjetiva</b>. Três adverbiais de modo e medida seguidas de uma substantiva que apresenta o resultado como evidente (<i>It is obvious that</i>). Estilo de elogio fundamentado.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'study', col:'English', o2:{ k:'conf', cj:'as', op:'the teacher' }, why:'<i>As the teacher explained</i>: o estudo segue um método recebido, e é esse método que as frases seguintes põem à prova.' },
    { p:'She', t:'present', a:'simples', v:'read', col:'the book', o2:{ k:'csq', cj:'so … that', op:'more' }, why:'A intensidade da leitura é medida pelo que ela produz: aprender mais.' },
    { p:'She', t:'present', a:'simples', v:'practice', o2:{ k:'prop', cj:'the more … the more', v:'learn' }, why:'A proporção generaliza o caso: não é só este livro, é a prática em geral.' },
    { p:'She', t:'present', a:'simples', v:'study', col:'hard', o2:{ k:'subj', cj:'It is … that', op:'obvious' }, why:'O fecho apresenta o esforço como evidente, depois de três frases que o demonstraram.' }
   ] },
 { id:'m17', r:'argumento', tema:'finanças', nivel:3, titulo:'Investir com critério',
   ideia:'Um fato afirmado, a ressalva, a regra e o resultado.',
   n:{ v:'<i>Invest, spend, save, pay</i> formam o ciclo do dinheiro. <i>Invest</i> se repete na afirmação e na ressalva, para as duas falarem da mesma coisa.',
       t:'Presente simples em tudo: são fatos e regras permanentes, o tempo natural de um argumento.',
       e:'<i>Wisely</i> responde à ressalva do risco, e <i>always… on time</i> descreve a disciplina que leva ao resultado.',
       c:'<b>Subjetiva + concessiva + proporcional + conclusiva</b>. Afirmo (<i>It is true that</i>), concedo (<i>although</i>), dou a regra (<i>the less… the more</i>) e concluo (<i>so</i>). É um argumento completo em quatro frases.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'invest', col:'in stocks', o2:{ k:'subj', cj:'It is … that', op:'true' }, why:'<i>It is true that…</i> apresenta o investimento como fato admitido, preparando a ressalva que vem logo depois.' },
    { p:'I', t:'present', a:'simples', v:'invest', col:'wisely', o2:{ k:'conc', cj:'although', op:'risky' }, why:'A ressalva responde a uma objeção antes que ela apareça: sim, há risco, e por isso o investimento é criterioso.' },
    { p:'I', t:'present', a:'simples', v:'spend', o2:{ k:'prop', cj:'the less … the more', v:'save' }, why:'A regra de proporção inversa dá a lógica do método: gastar menos é o que permite guardar.' },
    { p:'I', t:'present', a:'simples', v:'pay', col:'the bill', mid:['always'], ends:['on time'], o2:{ k:'cons', cj:'so', op:'a good deal' }, why:'O resultado concreto encerra o argumento com uma prova.' }
   ] },
 { id:'m18', r:'causa', tema:'tecnologia', nivel:3, titulo:'Confiar no sistema',
   ideia:'O que se reconhece, o motivo da rotina, o efeito e a prática.',
   n:{ v:'<i>Know, update, save, test</i>: saber do problema e manter três rotinas contra ele. Os três últimos são verbos de manutenção, repetíveis por natureza.',
       t:'Presente simples em tudo: rotina de manutenção é hábito, e hábito pede o aspecto simples.',
       e:'<i>Every month</i>, <i>every day</i> e <i>always</i>: três ritmos diferentes para três rotinas. Variar a peça de frequência evita a repetição.',
       c:'<b>Completiva nominal + adverbial causal + coordenada conclusiva + coordenada aditiva</b>. Um fato nomeado (<i>the fact that</i>), um motivo dado como premissa (<i>given that</i>), um efeito e uma soma de práticas.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'know', o2:{ q:'problem', k:'cn', cj:'that', op:'fact' }, why:'O parágrafo parte de um fato reconhecido: há uma dificuldade, e ninguém a nega.' },
    { p:'We', t:'present', a:'simples', v:'update', col:'the software', ends:['every month'], o2:{ k:'caus', cj:'given that', op:'fewer errors' }, why:'<i>Given that</i> põe a causa na frente como premissa: como esperamos menos erros, atualizamos todo mês.' },
    { p:'We', t:'present', a:'simples', v:'save', col:'the file', ends:['every day'], o2:{ k:'cons', cj:'so', op:'the system' }, why:'O efeito da rotina de salvar todo dia é poder confiar no sistema.' },
    { p:'We', t:'present', a:'simples', v:'test', col:'the code', mid:['always'], o2:{ k:'adit', cj:'and', v:'check' }, why:'Duas práticas somadas fecham o retrato: a confiança vem de testar <b>e</b> conferir.' }
   ] },
 { id:'m19', r:'descricao', tema:'trabalho', nivel:2, titulo:'A solução que faltava',
   ideia:'O que foi encontrado, comentado de passagem, e o que se escolheu.',
   n:{ v:'<i>Find, choose, finish</i>: achar, escolher e concluir. São três fatos pontuais, na ordem em que um problema é resolvido.',
       t:'Passado simples nos três fatos: são ações concluídas, em sequência. A oração relativa acompanha o passado da principal.',
       e:'Só <i>last week</i>, na conclusão: as relativas não deixam espaço para peças no fim da frase.',
       c:'<b>Adjetiva explicativa + adjetiva restritiva + coordenada conclusiva</b>. O contraste entre as duas relativas é o ensino: com vírgula (<i>, which</i>) é comentário; sem vírgula (<i>that</i>) é identificação. A conclusiva fecha.' },
   s:[
    { p:'She', t:'past', a:'simples', v:'find', col:'a solution', o2:{ k:'relx', cj:'which', v:'need' }, why:'Com vírgula: informação extra sobre a solução.' },
    { p:'She', t:'past', a:'simples', v:'choose', col:'the best option', o2:{ k:'rel', cj:'that', v:'want' }, why:'A segunda relativa não tem vírgula, e é esse o contraste com a frase 1: aqui ela diz <b>qual</b> opção foi escolhida.' },
    { p:'She', t:'past', a:'simples', v:'finish', col:'the report', ends:['last week'], o2:{ k:'cons', cj:'so', op:'more money' }, why:'O resultado das duas ações: encontrar e escolher levaram a concluir e a ganhar.' }
   ] },
 { id:'k1', r:'retrato', tema:'estudo', nivel:2, titulo:'A semana da prova',
   ideia:'O que ela sabe, a rotina, a persistência e o desfecho em aberto.',
   n:{ v:'<i>Know, study, start, pass</i>: saber da dificuldade, estudar, começar sem parar e encarar o resultado. Cada verbo é uma etapa da semana.',
       t:'O tempo conta a semana em ordem: presente simples para o que ela sabe e para a rotina (frases 1 e 2), passado simples para o dia em que começou cedo (frase 3) e <i>will</i> para a prova que ainda vem (frase 4). Três tempos, três momentos: o que é, o que foi, o que será.',
       e:'<i>Every evening</i> transforma o estudo em rotina; <i>early</i> e <i>yesterday</i> dão hora e dia ao esforço; <i>next week</i> põe a prova no calendário. A frase 1 não leva peça: saber da dificuldade não tem data.',
       c:'Uma substantiva abre com o que se sabe; depois vêm <b>três coordenadas diferentes</b>: soma (<i>and</i>), contraste (<i>but</i>) e alternativa (<i>or</i>). O texto anda em linha reta, sem subordinar uma ideia à outra: é o estilo direto, de quem enumera fatos de mesmo peso.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'know', o2:{ q:'test', k:'obj', cj:'that', op:'difficult' }, why:'A oração com <i>that</i> é o objeto de <i>know</i>: abre o texto com a consciência do desafio.' },
    { p:'She', t:'present', a:'simples', v:'study', col:'English', ends:['every evening'], o2:{ k:'adit', cj:'and', v:'review' }, why:'<i>And</i> soma duas ações da rotina; o objeto se repete.' },
    { p:'She', t:'past', a:'simples', v:'start', col:'early', ends:['yesterday'], o2:{ k:'adv', cj:'but', v:'stop', vneg:true }, why:'<i>But</i> + negação: começou cedo e, contra o esperado, não parou.' },
    { p:'She', t:'future', a:'simples', v:'pass', col:'the test', ends:['next week'], o2:{ k:'alt', cj:'or', v:'fail' }, why:'<i>Or</i> entre dois opostos deixa o desfecho em aberto: depois de tanto preparo, só a semana que vem dirá.' }
   ] },
 { id:'k2', r:'retrato', tema:'carreira', nivel:3, titulo:'A proposta difícil',
   ideia:'Um fato aceito, uma dúvida, a razão de continuar e a recusa.',
   n:{ v:'<i>Accept, think, work, negotiate</i>: aceitar a realidade, pesar, seguir trabalhando e negociar. São verbos de quem decide sob pressão.',
       t:'Três frases no presente simples descrevem o estado atual dele: o que admite, o que pondera e o que continua fazendo. O passado simples só entra na frase 4, para o único fato consumado, a negociação de ontem. O contraste é entre uma situação que dura e um episódio que já aconteceu.',
       e:'<i>Still</i> é a peça-chave: diz que o trabalho <b>continua</b> apesar das dúvidas das frases 1 e 2. <i>Yesterday</i> data a negociação. As duas primeiras frases ficam sem peças porque a oração substantiva já ocupa o lugar do complemento.',
       c:'Duas substantivas com substantivo ou preposição no meio (<i>the belief that…</i>, <i>thinks about learning</i>) dão o lado mental; a explicativa justifica o esforço e a adversativa mostra a persistência. Estilo de quem explica a própria atitude.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'accept', o2:{ q:'offer', k:'cn', cj:'that', op:'fact' }, why:'<i>The fact that…</i>: a oração dá conteúdo ao substantivo <i>fact</i>.' },
    { p:'He', t:'present', a:'simples', v:'think', o2:{ q:'change', k:'oi', cj:'whether', op:'difficult' }, why:'<i>About whether</i> + oração: a dúvida vem depois da preposição.' },
    { p:'He', t:'present', a:'simples', v:'work', col:'on a project', mid:['still'], o2:{ k:'expl', cj:'for', op:'the money' }, why:'<i>Still</i> mostra que ele continua; <i>for</i> explica por quê.' },
    { p:'He', t:'past', a:'simples', v:'negotiate', col:'a better deal', ends:['yesterday'], o2:{ k:'adv', cj:'but', v:'accept', vneg:true }, why:'O fato que fecha o retrato: negociou um bom acordo e, ainda assim, não aceitou. O <i>but</i> guarda a surpresa.' }
   ] },
 { id:'k3', r:'retrato', tema:'finanças', nivel:3, titulo:'O presente caro demais',
   ideia:'O problema, o exemplo, a contradição e o que mudaria.',
   n:{ v:'<i>Spend, buy, pay</i>: gastar, comprar e pagar. <i>Spend</i> aparece no problema e na contradição, para as duas frases falarem da mesma coisa.',
       t:'O presente simples enquadra o problema e o padrão (frases 1 e 3); o passado simples traz o caso concreto, o presente comprado (frase 2); e a frase 4 sai da realidade com <i>would</i> + passado depois de <i>if</i>. O percurso é diagnóstico, exemplo, hábito e, por fim, o que seria diferente.',
       e:'Só <i>every month</i> aparece, e de propósito: é ele que mostra que o gasto é recorrente, e não um deslize isolado. As outras frases não levam peças, porque o complemento ou a circunstância já é uma oração inteira.',
       c:'Predicativa, relativa, adversativa e condicional hipotética: afirmo a tese, especifico uma pessoa, marco um limite e abro uma hipótese. As <b>quatro famílias</b> aparecem, uma por frase.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'spend', col:'a fortune', o2:{ k:'pred', cj:'… is that', op:'problem' }, why:'<i>The problem is that…</i> nomeia o problema logo de saída.' },
    { p:'I', t:'past', a:'simples', v:'buy', col:'a gift', o2:{ k:'rel', cj:'whose', wh:'price' }, why:'<i>Whose</i> liga o presente ao seu preço: o exemplo concreto do problema.' },
    { p:'I', t:'present', a:'simples', v:'spend', col:'money', ends:['every month'], o2:{ k:'adv', cj:'yet', v:'save', vneg:true }, why:'<i>Yet</i> marca a contradição: gasto sempre e não guardo.' },
    { p:'I', t:'future', a:'simples', v:'pay', col:'in cash', o2:{ k:'cond', cj:'if', op:'a better price', cnd:2 }, why:'Hipótese com <i>would</i>: o que eu faria em outra situação.' }
   ] },
 { id:'k4', r:'retrato', tema:'saúde', nivel:2, titulo:'A corredora sabe o que enfrenta',
   ideia:'O fato que ela conhece, o motivo do treino, a medida do esforço e o que falta.',
   n:{ v:'<i>Know, train</i>: conhecer a dificuldade e treinar. <i>Train</i> se repete em três frases porque o parágrafo é sobre um único hábito visto de três jeitos.',
       t:'O presente simples sustenta o retrato (o que ela sabe, como treina, o que falta). A frase 2 troca para o Present Perfect Continuous porque fala de uma fase: o treino pesado vem se repetindo <b>até agora</b>, e isso o presente simples sozinho não diria.',
       e:'<i>Hard</i> diz como ela treina e <i>lately</i> delimita a fase recente, a dupla típica do Perfect Continuous. <i>Often</i>, na frase 4, mede a frequência e prepara o contraste: treina com frequência, mas não descansa.',
       c:'A apositiva anuncia a meta com dois-pontos; a causal dá o motivo; a comparativa mede o cuidado; a adversativa admite o custo. Do ideal ao real em quatro passos.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'know', o2:{ q:'race', k:'ap', cj:': that', op:'fact' }, why:'<i>One fact: that…</i>: os dois-pontos anunciam e a oração revela o fato.' },
    { p:'She', t:'present', a:'perfeito_continuo', v:'train', col:'hard', ends:['lately'], o2:{ k:'caus', cj:'because', op:'more practice' }, why:'Present perfect continuous + <i>lately</i> para o que vem acontecendo; a causal dá o motivo.' },
    { p:'She', t:'present', a:'simples', v:'train', o2:{ k:'cmp', cj:'as … as', op:'seriously' }, why:'Comparação de igualdade, com o auxiliar no fim (<i>he does</i>).' },
    { p:'She', t:'present', a:'simples', v:'train', mid:['often'], o2:{ k:'adv', cj:'but', v:'rest', vneg:true }, why:'A adversativa aponta o que falta no plano: treino há bastante, descanso não.' }
   ] },
 { id:'k5', r:'retrato', tema:'estudo', nivel:2, titulo:'O livro que faltava',
   ideia:'Uma leitura comentada, o hábito de perguntar, o próximo passo e a rotina.',
   n:{ v:'<i>Read, ask, practice</i>: ler, perguntar e praticar. <i>Read</i> abre e fecha o texto, primeiro como fato e depois como rotina.',
       t:'O texto abre com um fato passado (o livro lido), passa aos hábitos no presente simples (frases 2 e 4) e, no meio, olha para amanhã com <i>will</i>. Depois de <i>as soon as</i> o verbo fica no presente (<i>finishes</i>), mesmo falando do futuro.',
       e:'<i>Always</i> e <i>every morning</i> são as marcas do hábito; <i>tomorrow</i> marca o plano. A frase 1 não leva peça de tempo: o que importa ali não é quando ele leu, e sim que o livro era necessário.',
       c:'A relativa entre vírgulas comenta a escolha; a explicativa justifica o hábito; a temporal ordena o futuro; a aditiva com <i>and then</i> ordena a rotina. Duas formas diferentes de pôr ações em sequência no mesmo texto.' },
   s:[
    { p:'He', t:'past', a:'simples', v:'read', col:'the book', o2:{ k:'relx', cj:'which', v:'need' }, why:'Com vírgula, a relativa só comenta: o livro já estava identificado.' },
    { p:'He', t:'present', a:'simples', v:'ask', col:'the teacher', mid:['always'], o2:{ k:'expl', cj:'for', op:'to be clear' }, why:'<i>For</i>, depois de vírgula, justifica o hábito de perguntar: ele quer ter clareza, não chamar atenção.' },
    { p:'He', t:'future', a:'simples', v:'practice', col:'English', ends:['tomorrow'], o2:{ k:'temp', cj:'as soon as', op:'the lesson' }, why:'<i>Will</i> na principal, presente depois de <i>as soon as</i>.' },
    { p:'He', t:'present', a:'simples', v:'read', col:'the news', ends:['every morning'], o2:{ k:'adit', cj:'and then', v:'study' }, why:'A rotina fecha o retrato: ler primeiro e estudar depois, todos os dias.' }
   ] },
 { id:'k6', r:'retrato', tema:'negócios', nivel:3, titulo:'Um acordo com exigência',
   ideia:'O que eles admitem, o que cumpriram, a rotina e a condição.',
   n:{ v:'<i>Accept, deliver, test</i>: admitir, entregar e testar. <i>Accept</i> volta no fim, agora preso a uma condição.',
       t:'O presente simples mostra o que eles admitem e o que fazem sempre (frases 1 e 3); o passado simples registra a entrega já cumprida (frase 2); <i>will</i> projeta a decisão (frase 4). Depois de <i>as long as</i> o verbo fica no presente, como em toda oração condicional de futuro.',
       e:'Só <i>on time</i> aparece, na entrega: é o detalhe que prova a confiabilidade. As demais frases não levam peças. Quando o complemento ou a condição já é uma oração inteira, a frase fica completa sem advérbios.',
       c:'Apositiva, conformativa, aditiva e condicional: um fato anunciado, um compromisso cumprido, uma rotina somada e uma exigência. Estilo de quem negocia com clareza.' },
   s:[
    { p:'They', t:'present', a:'simples', v:'accept', o2:{ q:'service', k:'ap', cj:': that', op:'possibility' }, why:'Aposto com dois-pontos: anuncia a possibilidade e depois a revela.' },
    { p:'They', t:'past', a:'simples', v:'deliver', col:'on time', o2:{ k:'conf', cj:'just as', op:'the agreement' }, why:'<i>Just as we agreed</i>: a entrega seguiu exatamente o combinado, e isso sustenta a confiança no fornecedor.' },
    { p:'They', t:'present', a:'simples', v:'test', col:'the system', o2:{ k:'adit', cj:'and', v:'check' }, why:'A rotina de qualidade sustenta a exigência que vem na frase seguinte.' },
    { p:'They', t:'future', a:'simples', v:'accept', col:'the offer', o2:{ k:'cond', cj:'as long as', op:'a fair price' }, why:'A exigência final: o acordo só vale enquanto o preço for justo.' }
   ] },
 { id:'k7', r:'retrato', tema:'trabalho', nivel:2, titulo:'Precisamos de ajuda',
   ideia:'A verdade, a conversa, a contratação e a decisão seguinte.',
   n:{ v:'<i>Need, talk, hire, accept</i>: precisar, conversar, contratar e decidir. A ordem é a de um time que reconhece um limite e age.',
       t:'Presente simples para a situação e para as conversas (frases 1 e 2), passado simples para a medida já tomada, a contratação (frase 3), e <i>will</i> para a decisão de amanhã (frase 4). O texto vai do diagnóstico à ação e da ação à escolha.',
       e:'<i>Tomorrow</i> é a única peça e cai na última frase, dando prazo à decisão. As três primeiras não levam peças porque a oração substantiva ou a relativa já preenche a frase.',
       c:'Predicativa e objetiva indireta formulam o problema e o foco; a relativa explicativa comenta a solução; a alternativa deixa a decisão aberta. Um caso apresentado do diagnóstico à encruzilhada.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'need', col:'help', o2:{ k:'pred', cj:'… is that', op:'truth' }, why:'<i>The truth is that…</i>: a tese vem primeiro e sem rodeios, e o resto do parágrafo decide o que fazer com ela.' },
    { p:'We', t:'present', a:'simples', v:'talk', o2:{ q:'problem', k:'oi', cj:'how', op:'difficult' }, why:'<i>About how complex the problem is</i>: ordem de afirmação, não de pergunta.' },
    { p:'We', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'relx', cj:'whose', wh:'company' }, why:'A relativa entre vírgulas acrescenta um dado sobre a pessoa contratada.' },
    { p:'We', t:'future', a:'simples', v:'accept', col:'the offer', ends:['tomorrow'], o2:{ k:'alt', cj:'or', v:'reject' }, why:'A decisão de amanhã fica em aberto: <i>or</i> entre aceitar e recusar mostra que nada está resolvido.' }
   ] },
 { id:'k8', r:'retrato', tema:'estudo', nivel:2, titulo:'Foco que dá resultado',
   ideia:'A meta, o foco, a intensidade e a confiança que veio.',
   n:{ v:'<i>Share, focus, study, practice</i>: ter uma meta, concentrar, estudar e praticar.',
       t:'Três frases no presente simples descrevem o método dela (meta, foco, intensidade). A frase 4 troca para o Present Perfect nas duas orações: a prática recente e a confiança são resultados que chegam <b>até agora</b>, e por isso o texto fecha com o que mudou.',
       e:'<i>Really</i> intensifica a prática e <i>lately</i> a situa no período recente, o par natural do Present Perfect. As três primeiras frases dispensam peças: a própria oração (aposto, <i>-ing</i>, consequência) já carrega o detalhe.',
       c:'A apositiva e a objetiva indireta expõem o fato e o foco; a consecutiva intensiva (<i>so… that</i>) e a conclusiva (<i>so</i>) mostram dois tipos de resultado. Atenção ao contraste: <i>so… that</i> mede a intensidade; <i>, so</i> apenas conclui.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'share', o2:{ k:'ap', cj:': to', op:'goal' }, why:'A meta abre o texto e dá a direção de tudo o que vem depois.' },
    { p:'She', t:'present', a:'simples', v:'focus', o2:{ k:'oi', cj:'-ing', op:'the answer' }, why:'Depois de preposição (<i>on</i>), o verbo vai para <i>-ing</i>: o foco dela é <b>saber</b> a resposta.' },
    { p:'She', t:'present', a:'simples', v:'study', o2:{ k:'csq', cj:'so … that', op:'more' }, why:'<i>So seriously that</i>: a intensidade produz o resultado.' },
    { p:'She', t:'present', a:'perfeito', v:'practice', mid:['really'], ends:['lately'], o2:{ k:'cons', cj:'so', op:'confident' }, why:'<i>, so</i> conclui: é diferente do <i>so… that</i> da frase anterior.' }
   ] },
 { id:'k9', r:'retrato', tema:'finanças', nivel:3, titulo:'Orçamento sem ilusão',
   ideia:'Um princípio, uma opinião, uma possibilidade admitida e uma compra.',
   n:{ v:'<i>Spend, believe, accept, buy</i>: gastar com critério, acreditar, admitir e comprar.',
       t:'Três frases no presente simples, porque são princípio, opinião e admissão, coisas que valem sempre. O passado simples só entra na frase 4, com a compra real: é ali que o discurso sobre gastar bem encontra um fato.',
       e:'Nenhuma peça de tempo ou frequência. <i>Wisely</i>, na frase 1, é o complemento de modo do verbo (gastar <b>com sabedoria</b>), e nas outras a oração substantiva ou a relativa ocupa todo o espaço depois do verbo.',
       c:'<b>Três substantivas seguidas</b> (subjetiva, objetiva direta, completiva nominal) e uma relativa explicativa. É o registro da reflexão: quase tudo são ideias encaixadas como sujeito, objeto ou complemento.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'spend', col:'wisely', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'<i>It is important to</i> + verbo: o princípio, sem sujeito pessoal.' },
    { p:'I', t:'present', a:'simples', v:'believe', o2:{ q:'budget', k:'obj', cj:'that', op:'difficult' }, why:'A opinião entra como objeto de <i>believe</i>: é uma avaliação pessoal, e não um fato, o que dá o tom do retrato.' },
    { p:'I', t:'present', a:'simples', v:'accept', o2:{ q:'gift', k:'cn', cj:'that', op:'possibility' }, why:'<i>The possibility that…</i>: a oração completa o substantivo.' },
    { p:'I', t:'past', a:'simples', v:'buy', col:'a gift', o2:{ k:'relx', cj:'which', v:'need' }, why:'O caso concreto, com um comentário entre vírgulas.' }
   ] },
 { id:'k10', r:'retrato', tema:'tecnologia', nivel:2, titulo:'Antes da atualização',
   ideia:'O alerta, a escolha, a ordem do que foi feito e o padrão de cuidado.',
   n:{ v:'<i>Say, choose, test, check</i>: avisar, escolher, testar e conferir.',
       t:'O texto vai e volta: presente simples para o que ela diz (frase 1), passado simples para o episódio da atualização (frases 2 e 3) e presente simples de novo para o hábito que ficou (frase 4). O passado serve de prova; o presente, de retrato.',
       e:'<i>Carefully</i> é a peça central: aparece como modo na frase 3 e volta dentro da comparação na frase 4 (<i>more carefully than</i>). A repetição é intencional, pois o cuidado é o traço que define a pessoa.',
       c:'Objetiva direta, relativa restritiva, temporal e comparativa: digo o que afirmo, especifico o instrumento, ordeno os fatos e meço o desempenho.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'say', o2:{ q:'update', k:'obj', cj:'that', op:'risky' }, why:'<i>Say that</i> + oração: o conteúdo do aviso. O retrato começa pela cautela dela.' },
    { p:'She', t:'past', a:'simples', v:'choose', col:'the best option', o2:{ k:'rel', cj:'that', v:'want' }, why:'Sem vírgula, a relativa diz <b>qual</b> opção: a que ela queria. A cautela não a impediu de escolher.' },
    { p:'She', t:'past', a:'simples', v:'test', col:'the system', ends:['carefully'], o2:{ k:'temp', cj:'before', op:'the update' }, why:'<i>Before</i> põe o teste antes da instalação: a ordem das ações é a própria prova do cuidado.' },
    { p:'She', t:'present', a:'simples', v:'check', col:'the results', o2:{ k:'cmp', cj:'than', op:'carefully' }, why:'A comparação fecha o retrato: o cuidado dela é medido contra o de um colega (<i>than he does</i>).' }
   ] },
 { id:'k11', r:'retrato', tema:'comunicação', nivel:2, titulo:'A carta, a ligação e o atraso',
   ideia:'O que ela escreveu, o que cumpriu, o que deu errado e o encontro marcado.',
   n:{ v:'<i>Write, call, leave, meet</i>: escrever, ligar, sair e encontrar. Três tentativas de contato e um contratempo no meio.',
       t:'Três passados simples em sequência contam o que aconteceu, na ordem: a carta, a ligação, a saída de casa. O <i>will</i> da frase 4 vira a página: depois do atraso, o que importa é o encontro de amanhã.',
       e:'<i>Yesterday</i> data a ligação, <i>on time</i> aparece na oração negativa (ela <b>não</b> chegou na hora) e <i>tomorrow</i> marca o encontro. A carta, na frase 1, fica sem data, porque o comentário da relativa já diz o que interessa.',
       c:'Relativa explicativa, conformativa, adversativa e final. O comentário entre vírgulas, o "conforme", o "mas" e o "para": quatro maneiras diferentes de acrescentar informação a uma ação simples.' },
   s:[
    { p:'She', t:'past', a:'simples', v:'write', col:'a letter', o2:{ k:'relx', cj:'which', v:'want' }, why:'O comentário entre vírgulas diz que a carta era desejada.' },
    { p:'She', t:'past', a:'simples', v:'call', col:'the office', ends:['yesterday'], o2:{ k:'conf', cj:'as', op:'the agreement' }, why:'A ligação aconteceu como combinado: o segundo gesto de contato, cumprido.' },
    { p:'She', t:'past', a:'simples', v:'leave', col:'home', o2:{ k:'adv', cj:'but', v:'arrive', vneg:true, c2:1 }, why:'<i>But</i> + negação: saiu de casa e, mesmo assim, não chegou na hora.' },
    { p:'She', t:'future', a:'simples', v:'meet', col:'the team', ends:['tomorrow'], o2:{ k:'final', cj:'to', op:'discuss the plan' }, why:'Apesar do atraso, o encontro está marcado, e a finalidade diz para quê.' }
   ] },
 { id:'k12', r:'retrato', tema:'casa', nivel:2, titulo:'O cozinheiro de domingo',
   ideia:'O gosto, as ações, o efeito e o episódio bagunçado.',
   n:{ v:'<i>Cook</i> em todas as frases, com <i>fry</i> somado: o assunto é um só e o que muda é a ligação entre as orações.',
       t:'O presente simples domina porque o assunto é hábito: quando ele cozinha, o que faz e o que isso produz. O passado simples da frase 4 traz um episódio específico, o jantar de ontem, que serve de exemplo vivo da rotina.',
       e:'<i>Usually</i> e <i>on Sundays</i> definem o hábito logo na primeira frase (frequência antes do verbo, dia no fim). <i>Last night</i> ancora o episódio. Na frase 3 a frequência não é peça: ela está dentro da própria estrutura (<i>so often that</i>).',
       c:'Explicativa, aditiva, consecutiva intensiva e concessiva. O mesmo hábito recebe um porquê, uma sequência, uma medida e uma ressalva. Bom modelo para ver como a ligação muda o sentido sem mudar o assunto.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'cook', col:'dinner', mid:['usually'], ends:['on Sundays'], o2:{ k:'expl', cj:'for', op:'good food' }, why:'<i>For</i> explica o hábito: ele gosta de boa comida.' },
    { p:'He', t:'present', a:'simples', v:'cook', col:'rice', o2:{ k:'adit', cj:'and', v:'fry' }, why:'Duas ações somadas com o mesmo objeto mostram variedade na cozinha: ele não faz só um prato.' },
    { p:'He', t:'present', a:'simples', v:'cook', o2:{ k:'csq', cj:'so … that', op:'healthier' }, why:'<i>So often that</i>: é a frequência, e não um prato especial, que produz o efeito sobre a saúde.' },
    { p:'He', t:'past', a:'simples', v:'cook', col:'for the family', ends:['last night'], o2:{ k:'conc', cj:'although', op:'messy' }, why:'Um episódio de ontem à noite, com a ressalva na frente: deu trabalho, mas ele cozinhou para a família.' }
   ] },
 { id:'k13', r:'retrato', tema:'viagem', nivel:2, titulo:'De trem, como combinado',
   ideia:'O costume e a sua razão, o plano cumprido, a comparação e a escolha de hoje.',
   n:{ v:'<i>Travel, plan, stay</i>: viajar, planejar e ficar. <i>Travel</i> aparece no costume e na comparação.',
       t:'Presente simples para o costume e para a comparação (frases 1 e 3), passado simples para o planejamento já feito (frase 2) e <i>will</i> para a dúvida de hoje à noite (frase 4). O hábito é estável; a noite de hoje, não.',
       e:'<i>Usually</i> marca o costume, <i>last month</i> data o planejamento e <i>tonight</i> traz a decisão para perto. <i>By train</i> se repete nas frases 1 e 3 como complemento do verbo: é o fio que liga o costume à comparação.',
       c:'Explicativa, conformativa, comparativa e alternativa: justifico, mostro conformidade, comparo e abro opções.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'travel', col:'by train', mid:['usually'], o2:{ k:'expl', cj:'for', op:'to save time' }, why:'O costume de viajar de trem abre o texto já com a sua justificativa.' },
    { p:'We', t:'past', a:'simples', v:'plan', col:'the trip', ends:['last month'], o2:{ k:'conf', cj:'as', op:'the agreement' }, why:'O planejamento seguiu o combinado (<i>as we agreed</i>): o costume da frase 1 tem método por trás.' },
    { p:'We', t:'present', a:'simples', v:'travel', col:'by train', o2:{ k:'cmp', cj:'than', op:'often' }, why:'<i>More often than they do</i>: comparação de frequência.' },
    { p:'We', t:'future', a:'simples', v:'stay', col:'at home', ends:['tonight'], o2:{ k:'alt', cj:'or', v:'leave' }, why:'Para hoje, porém, a questão é outra: ficar ou sair.' }
   ] },
 { id:'k14', r:'retrato', tema:'estudo', nivel:2, titulo:'Aprender é insistir',
   ideia:'A insistência, o livro certo, o motivo e a regra.',
   n:{ v:'<i>Insist, read, practice</i>: insistir, ler e praticar. <i>Read</i> volta na regra final.',
       t:'Um só tempo no parágrafo inteiro, o presente simples, e isso é o recado: nada aqui é episódio, tudo é método. Como o tempo não muda, a atenção vai toda para as ligações entre as orações.',
       e:'<i>Every day</i> é a única peça, e basta: transforma a prática em disciplina diária. As outras frases dispensam peças porque a estrutura já diz tudo (<i>insist on</i> + <i>-ing</i>, a relativa, <i>the more… the more</i>).',
       c:'Objetiva indireta, relativa restritiva, explicativa e proporcional. Termina com uma regra geral (<i>the more… the more</i>), que dá sentido às três atitudes anteriores.' },
   s:[
    { p:'They', t:'present', a:'simples', v:'insist', o2:{ k:'oi', cj:'-ing', op:'the idea' }, why:'A atitude de base do grupo: não aceitar uma ideia sem entendê-la.' },
    { p:'They', t:'present', a:'simples', v:'read', col:'the book', o2:{ k:'rel', cj:'that', v:'need' }, why:'O instrumento certo: não qualquer livro, mas o de que precisam.' },
    { p:'They', t:'present', a:'simples', v:'practice', col:'English', ends:['every day'], o2:{ k:'expl', cj:'for', op:'to learn more' }, why:'O motivo da prática diária, dito como explicação e não como causa: é uma justificativa.' },
    { p:'They', t:'present', a:'simples', v:'read', o2:{ k:'prop', cj:'the more … the more', v:'learn' }, why:'A regra geral que dá sentido às três atitudes.' }
   ] },
 { id:'k15', r:'retrato', tema:'comunicação', nivel:2, titulo:'Antes da reunião',
   ideia:'O que ele sente, sobre o que fala, por que ligou e o que está marcado.',
   n:{ v:'<i>Feel, talk, call, meet</i>: sentir, falar, ligar e encontrar.',
       t:'Presente simples para o que ele sente e comenta (frases 1 e 2), passado simples para a atitude de ontem (frase 3) e <i>will</i> para o encontro de amanhã (frase 4). O texto atravessa os três tempos na ordem natural: estado, ação, compromisso.',
       e:'<i>Yesterday</i> e <i>tomorrow</i> formam um par: a ligação já feita e a reunião que vem. As duas primeiras frases não levam peças, porque falam de um sentimento, e ele não tem data.',
       c:'Objetiva direta e objetiva indireta lado a lado (<i>know that…</i> / <i>talk about how…</i>) mostram a diferença entre complemento sem e com preposição. Causal e conformativa fecham com motivo e compromisso.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'feel', o2:{ q:'task', k:'obj', cj:'that', op:'hard' }, why:'<i>Feel that</i> + oração: a dificuldade aparece como sensação dele, e não como fato objetivo.' },
    { p:'He', t:'present', a:'simples', v:'talk', o2:{ q:'deadline', k:'oi', cj:'how', op:'awkward' }, why:'<i>Talk about how…</i>: depois da preposição vem uma oração com <i>how</i> + adjetivo, que mede o aperto do prazo.' },
    { p:'He', t:'past', a:'simples', v:'call', col:'the office', ends:['yesterday'], o2:{ k:'caus', cj:'because', op:'an answer' }, why:'O que ele fez a respeito: ligou porque precisava de uma resposta.' },
    { p:'He', t:'future', a:'simples', v:'meet', col:'the team', ends:['tomorrow'], o2:{ k:'conf', cj:'as', op:'the plan' }, why:'<i>As we planned</i>: depois da hesitação, o encontro segue o plano, e o retrato termina em ação.' }
   ] },
 { id:'k16', r:'retrato', tema:'negócios', nivel:3, titulo:'A solução e o time',
   ideia:'O fato reconhecido, a meta, a solução encontrada e o objetivo.',
   n:{ v:'<i>Know, share, find, build</i>: reconhecer, alinhar, achar e construir.',
       t:'Presente simples para o que o time sabe e compartilha (frases 1 e 2), passado simples para a solução já encontrada (frase 3) e <i>will</i> para o plano do ano que vem (frase 4). Consciência, conquista e projeto: um tempo para cada coisa.',
       e:'<i>Next year</i> é a única peça e dá horizonte ao plano final. As três primeiras frases não levam peças: a oração colada ao substantivo, o aposto e a relativa já completam a ideia.',
       c:'Completiva nominal e apositiva usam o mesmo tipo de substantivo abstrato (<i>fact</i>, <i>goal</i>) de dois jeitos: colado (<i>the fact that</i>) e anunciado (<i>one goal: to</i>). A relativa especifica e a final dá o propósito.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'know', o2:{ q:'problem', k:'cn', cj:'that', op:'fact' }, why:'<i>The fact that…</i> cola a oração ao substantivo: a dificuldade é tratada como fato conhecido por todos.' },
    { p:'We', t:'present', a:'simples', v:'share', o2:{ k:'ap', cj:': to', op:'goal' }, why:'Os dois-pontos anunciam e a oração revela: <i>one goal</i> cria a expectativa, <i>to understand</i> a resolve.' },
    { p:'We', t:'past', a:'simples', v:'find', col:'a solution', o2:{ k:'rel', cj:'that', v:'need' }, why:'A solução encontrada é identificada pela relativa: a que o time precisava.' },
    { p:'We', t:'future', a:'simples', v:'build', col:'a team', ends:['next year'], o2:{ k:'final', cj:'to', op:'grow the business' }, why:'O objetivo de longo prazo fecha o retrato do time.' }
   ] },
 { id:'k17', r:'retrato', tema:'finanças', nivel:3, titulo:'Caro, mas pago',
   ideia:'A possibilidade admitida, a compra comentada, o critério e como foi paga.',
   n:{ v:'<i>Accept, buy, spend, pay</i>: admitir, comprar, gastar com critério e pagar.',
       t:'Os tempos se alternam: presente simples para a atitude e para o padrão de gastos (frases 1 e 3), passado simples para a compra e para o pagamento (frases 2 e 4). O presente diz como ela é; o passado mostra o que fez naquele dia.',
       e:'Nenhuma peça de tempo. <i>Money</i> e <i>in cash</i> são complementos dos verbos (gastar dinheiro, pagar à vista), e não circunstâncias. O episódio fica sem data porque serve de exemplo, e não de registro.',
       c:'Completiva nominal, relativa explicativa, comparativa e concessiva. Quatro tipos pouco comuns juntos: é um parágrafo de registro mais formal.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'accept', o2:{ q:'gift', k:'cn', cj:'that', op:'possibility' }, why:'A oração completa <i>possibility</i>: ela já admite de saída que pode ser caro, e o resto do texto mostra o que faz com isso.' },
    { p:'She', t:'past', a:'simples', v:'buy', col:'a gift', o2:{ k:'relx', cj:'whose', wh:'price' }, why:'<i>, whose price was high</i>: comentário entre vírgulas.' },
    { p:'She', t:'present', a:'simples', v:'spend', col:'money', o2:{ k:'cmp', cj:'than', op:'wisely' }, why:'A comparação mostra que o gasto alto foi exceção: no geral, ela gasta com mais critério.' },
    { p:'She', t:'past', a:'simples', v:'pay', col:'in cash', o2:{ k:'conc', cj:'although', op:'expensive' }, why:'A ressalva volta ao episódio: era caro e, mesmo assim, foi pago à vista.' }
   ] },
 { id:'k18', r:'retrato', tema:'trabalho', nivel:3, titulo:'Fim de expediente',
   ideia:'O que já estava pronto, a intensidade, o que falta e a escolha do fim de semana.',
   n:{ v:'<i>Finish, work, stay</i>: concluir, trabalhar e ficar. <i>Work</i> aparece duas vezes para pesar o excesso.',
       t:'O Past Perfect abre o texto para mostrar ordem: o relatório <b>já estava</b> pronto quando o pagamento chegou. Depois, presente simples para o ritmo de sempre (frases 2 e 3) e <i>will</i> para o fim de semana em aberto (frase 4).',
       e:'<i>Already</i> reforça a anterioridade do Past Perfect, entre <i>had</i> e o particípio. <i>Often</i> mede a frequência do trabalho e <i>this weekend</i> delimita a escolha final. Na frase 2 a intensidade está na estrutura (<i>so much that</i>), e não numa peça.',
       c:'Temporal com past perfect, consecutiva intensiva, adversativa e alternativa: ordem, medida, contraste e opção.' },
   s:[
    { p:'He', t:'past', a:'perfeito', v:'finish', col:'the report', mid:['already'], o2:{ k:'temp', cj:'when', op:'the payment' }, why:'Past perfect para o que veio antes; passado simples depois de <i>when</i>.' },
    { p:'He', t:'present', a:'simples', v:'work', o2:{ k:'csq', cj:'so much that', op:'more money' }, why:'A intensidade do trabalho medida pelo resultado: ele trabalha tanto que ganha mais.' },
    { p:'He', t:'present', a:'simples', v:'work', mid:['often'], o2:{ k:'adv', cj:'but', v:'rest', vneg:true }, why:'O outro lado da intensidade: trabalha muito e não descansa.' },
    { p:'He', t:'future', a:'simples', v:'stay', col:'at home', ends:['this weekend'], o2:{ k:'alt', cj:'or', v:'leave' }, why:'O fim de semana fica em aberto, entre duas opções.' }
   ] },
 { id:'k19', r:'retrato', tema:'tecnologia', nivel:2, titulo:'Testar é a regra',
   ideia:'A tese, a prática, a regra de aprendizado e o veredito.',
   n:{ v:'<i>Test, learn, pass</i>: testar, aprender e passar.',
       t:'Três frases no presente simples enunciam regra, prática e princípio. Só a frase 4 muda, para <i>will</i>, porque o resultado de amanhã é a única coisa que ainda não se sabe.',
       e:'<i>Always</i> está dentro da oração predicativa (<i>we always test</i>): é ele que transforma o teste em regra. <i>Tomorrow</i> dá data ao veredito. As frases 2 e 3 não levam peças porque enunciam práticas gerais.',
       c:'Predicativa, aditiva, proporcional e alternativa. A tese vem primeiro (<i>The point is that</i>) e as três frases seguintes a sustentam com prática, regra e próxima decisão.' },
   s:[
    { p:'We', t:'present', a:'simples', v:'test', col:'the code', mid:['always'], o2:{ k:'pred', cj:'… is that', op:'point' }, why:'A tese vem na frente: para este time, testar não é opcional.' },
    { p:'We', t:'present', a:'simples', v:'test', col:'the system', o2:{ k:'adit', cj:'and', v:'check' }, why:'A prática que sustenta a tese, em duas ações somadas: testar e conferir.' },
    { p:'We', t:'present', a:'simples', v:'learn', o2:{ k:'prop', cj:'the more … the more', v:'understand' }, why:'A regra geral explica por que vale a pena: aprender leva a entender.' },
    { p:'We', t:'future', a:'simples', v:'pass', col:'the test', ends:['tomorrow'], o2:{ k:'alt', cj:'or', v:'fail' }, why:'O veredito de amanhã, com as duas possibilidades na mesa.' }
   ] },
 { id:'k20', r:'retrato', tema:'finanças', nivel:2, titulo:'Tempo de decidir',
   ideia:'A verdade, o hábito e o motivo, a decisão e o objetivo.',
   n:{ v:'<i>Need, invest, accept</i>: precisar, investir e decidir. <i>Invest</i> aparece no hábito e no objetivo.',
       t:'Metade presente, metade futuro: presente simples para a verdade e para o hábito (frases 1 e 2), <i>will</i> para a decisão e para o plano (frases 3 e 4). O texto parte do que é para o que será decidido.',
       e:'As peças constroem uma escala de prazos: <i>every month</i> (o hábito), <i>next week</i> (a decisão) e <i>next year</i> (o plano). Do curto ao longo prazo, cada frase olha um pouco mais longe.',
       c:'Predicativa, causal, alternativa e final. A alternativa (<i>pass or fail</i>) cria suspense no meio de um texto de progresso.' },
   s:[
    { p:'They', t:'present', a:'simples', v:'need', col:'more time', o2:{ k:'pred', cj:'… is that', op:'truth' }, why:'A verdade abre o texto: falta tempo, e isso condiciona tudo.' },
    { p:'They', t:'present', a:'simples', v:'invest', col:'in stocks', ends:['every month'], o2:{ k:'caus', cj:'because', op:'a better price' }, why:'O hábito de investir todo mês e o motivo que o sustenta: buscar um preço melhor.' },
    { p:'They', t:'future', a:'simples', v:'accept', col:'the offer', ends:['next week'], o2:{ k:'alt', cj:'or', v:'reject' }, why:'A decisão da semana que vem, ainda entre aceitar e recusar.' },
    { p:'They', t:'future', a:'simples', v:'invest', col:'money', ends:['next year'], o2:{ k:'final', cj:'to', op:'secure the future' }, why:'O objetivo de longo prazo dá sentido à decisão: investir para garantir o futuro.' }
   ] },
 { id:'k21', r:'retrato', tema:'finanças', nivel:3, titulo:'Dinheiro com método',
   ideia:'O princípio, o fato, o assunto da conversa e a ordem dos pagamentos.',
   n:{ v:'<i>Pay, accept, talk</i>: pagar, admitir e conversar. <i>Pay</i> abre como princípio e fecha como fato.',
       t:'Três frases no presente simples (princípio, admissão, conversa) e uma virada para o Past Perfect na frase 4: a conta <b>já tinha sido</b> paga quando o dinheiro entrou. O tempo composto é a prova de que o princípio é praticado.',
       e:'<i>Already</i> é a única peça e faz o trabalho decisivo: sublinha que o pagamento veio <b>antes</b> do recebimento. As três primeiras frases não levam peças porque a oração substantiva já ocupa o lugar do complemento.',
       c:'Subjetiva, apositiva, objetiva indireta e temporal: três substantivas diferentes e uma adverbial que traz um fato concreto para ancorar as ideias.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'pay', col:'the bill', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'O princípio abre o texto, sem sujeito pessoal: pagar as contas importa.' },
    { p:'I', t:'present', a:'simples', v:'accept', o2:{ q:'budget', k:'ap', cj:': that', op:'fact' }, why:'O fato é anunciado por dois-pontos e só depois revelado: a pausa dá peso à admissão.' },
    { p:'I', t:'present', a:'simples', v:'talk', o2:{ q:'market', k:'oi', cj:'how', op:'risky' }, why:'<i>Talk about how uncertain…</i>: o assunto das conversas é o <b>tamanho</b> da incerteza do mercado, e não só a sua existência.' },
    { p:'I', t:'past', a:'perfeito', v:'pay', col:'the bill', mid:['already'], o2:{ k:'temp', cj:'when', op:'the payment' }, why:'O Past Perfect mostra a ordem: a conta já estava paga quando o pagamento chegou. O princípio da frase 1, na prática.' }
   ] },
 { id:'k22', r:'retrato', tema:'saúde', nivel:2, titulo:'Dormir e treinar',
   ideia:'O princípio, o problema, a comparação e o resultado.',
   n:{ v:'<i>Sleep</i> e <i>train</i>: o descanso e o esforço.',
       t:'Tudo no presente simples: o princípio, o problema e os dois hábitos de treino. Sem mudança de tempo, o contraste fica por conta do conteúdo: o que deveria acontecer (dormir) contra o que de fato acontece (treinar).',
       e:'A frase 4 é a mais equipada do parágrafo: <i>also</i> soma, <i>at the gym</i> diz onde e <i>three times a week</i> diz a frequência, nessa ordem (lugar antes de tempo). <i>Never</i>, na frase 2, é a peça que cria o problema: nunca dorme bem.',
       c:'Subjetiva e predicativa abrem com princípio e problema; comparativa e conclusiva fecham com medida e resultado.' },
   s:[
    { p:'I', t:'present', a:'simples', v:'sleep', col:'eight hours', o2:{ k:'subj', cj:'It is … to', op:'important' }, why:'O princípio vem primeiro, como referência contra a qual o problema da frase 2 será medido.' },
    { p:'I', t:'present', a:'simples', v:'sleep', col:'well', mid:['never'], o2:{ k:'pred', cj:'… is that', op:'problem' }, why:'O problema entra como predicativo: a prática (dormir mal) não acompanha o princípio da frase 1.' },
    { p:'I', t:'present', a:'simples', v:'train', o2:{ k:'cmp', cj:'as … as', op:'seriously' }, why:'A comparação mostra que o esforço existe: o que falta é o descanso.' },
    { p:'I', t:'present', a:'simples', v:'train', mid:['also'], ends:['at the gym','three times a week'], o2:{ k:'cons', cj:'so', op:'stronger' }, why:'O outro hábito, o treino, já dá resultado: o que falta mesmo é o sono.' }
   ] },
 { id:'k23', r:'retrato', tema:'estudo', nivel:3, titulo:'O que fica da leitura',
   ideia:'O que ela lembra, o que acredita, a ordem do estudo e a regra.',
   n:{ v:'<i>Remember, share, read</i>: lembrar, acreditar e ler.',
       t:'Presente simples para a lembrança, a crença e a regra final (frases 1, 2 e 4); passado simples para a noite de leitura (frase 3). O episódio fica cercado por frases gerais: é o caso concreto dentro de uma convicção.',
       e:'<i>Slowly</i> e <i>last night</i> aparecem juntos e na ordem padrão, modo antes de tempo. São as únicas peças do texto e concentram todo o detalhe no único episódio narrado.',
       c:'Objetiva direta e completiva nominal dizem quase a mesma coisa de dois jeitos (<i>understands that…</i> / <i>the belief that…</i>): verbo + oração contra substantivo + oração. Temporal e proporcional completam.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'remember', o2:{ q:'book', k:'obj', cj:'that', op:'confusing' }, why:'Verbo + oração: a oração é o conteúdo da lembrança. O retrato começa pela dificuldade que ela não esqueceu.' },
    { p:'She', t:'present', a:'simples', v:'share', o2:{ q:'test', k:'cn', cj:'that', op:'belief' }, why:'Substantivo + oração: o conteúdo da crença. Da lembrança pessoal para uma convicção compartilhada.' },
    { p:'She', t:'past', a:'simples', v:'read', col:'the book', ends:['slowly','last night'], o2:{ k:'temp', cj:'before', op:'the notes' }, why:'Um episódio concreto de estudo, com as duas ações em ordem.' },
    { p:'She', t:'present', a:'simples', v:'read', o2:{ k:'prop', cj:'the more … the more', v:'learn' }, why:'A regra que ela tira da experiência: ler mais é aprender mais.' }
   ] },
 { id:'k24', r:'retrato', tema:'negócios', nivel:2, titulo:'O amigo empresário',
   ideia:'A opinião, o amigo, a contratação e o ritmo de trabalho.',
   n:{ v:'<i>Believe, meet, hire, work</i>: acreditar, conhecer, contratar e trabalhar.',
       t:'Presente simples nas pontas (o que ele acredita, quanto trabalha) e passado simples no meio (o encontro e a contratação). A opinião e o ritmo são permanentes; os dois fatos do meio são o que aconteceu no caminho.',
       e:'Nenhuma peça: as relativas (<i>whose</i>, <i>who</i>) ocupam o lugar depois do substantivo e a consequência (<i>so much that</i>) já traz a intensidade. É um bom exemplo de frase que fica completa só com orações.',
       c:'As <b>duas relativas lado a lado</b>: sem vírgula ela identifica (<i>a tool that we need</i>); com vírgula ela comenta (<i>, whose company…</i>). Objetiva e consecutiva emolduram.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'believe', o2:{ q:'market', k:'obj', cj:'that', op:'difficult' }, why:'A opinião dele abre o retrato e dá o tom: o mercado não oferece garantias.' },
    { p:'He', t:'past', a:'simples', v:'meet', col:'a friend', o2:{ k:'rel', cj:'whose', wh:'company' }, why:'<i>Whose</i> liga o amigo à empresa dele. Sem vírgula, a relativa identifica de qual amigo se trata.' },
    { p:'He', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'relx', cj:'who', v:'need' }, why:'Com vírgula, a relativa só comenta: o desenvolvedor já está identificado, e a oração acrescenta que ele era necessário.' },
    { p:'He', t:'present', a:'simples', v:'work', o2:{ k:'csq', cj:'so much that', op:'more money' }, why:'O ritmo de trabalho fecha, medido pelo que ele rende.' }
   ] },
 { id:'k25', r:'retrato', tema:'tecnologia', nivel:3, titulo:'A solução do erro',
   ideia:'A solução comentada, o motivo dos testes, o padrão e a hipótese.',
   n:{ v:'<i>Find, test, check, update</i>: achar, testar, conferir e atualizar.',
       t:'Passado simples para a solução encontrada (frase 1), presente simples para o método (frases 2 e 3) e, na frase 4, a hipótese: <i>would</i> na principal e passado depois de <i>if</i>. O passado de <i>needed</i> não indica tempo, indica irrealidade.',
       e:'<i>Always</i> é a única peça e sustenta o método: testar sempre. As demais frases dispensam peças, e na comparação o modo já está dentro da estrutura (<i>as efficiently as</i>).',
       c:'Relativa explicativa, causal, comparativa e condicional hipotética: comentário, motivo, medida e suposição.' },
   s:[
    { p:'She', t:'past', a:'simples', v:'find', col:'a solution', o2:{ k:'relx', cj:'which', v:'need' }, why:'A solução é apresentada com um comentário de passagem: era o que ela precisava.' },
    { p:'She', t:'present', a:'simples', v:'test', col:'the code', mid:['always'], o2:{ k:'caus', cj:'because', op:'fewer errors' }, why:'O motivo dos testes constantes: ela espera menos erros, e por isso testa sempre.' },
    { p:'She', t:'present', a:'simples', v:'check', col:'the results', o2:{ k:'cmp', cj:'as … as', op:'efficiently' }, why:'O padrão de eficiência, medido contra o de um colega.' },
    { p:'She', t:'future', a:'simples', v:'update', col:'the software', o2:{ k:'cond', cj:'if', op:'a faster system', cnd:2 }, why:'A hipótese final mostra o limite: só atualizaria se houvesse necessidade real.' }
   ] },
 { id:'k26', r:'retrato', tema:'comunicação', nivel:1, titulo:'Escutar primeiro',
   ideia:'A tese, o próximo encontro e o equilíbrio entre falar e ouvir.',
   n:{ v:'<i>Listen, meet, speak</i>: escutar, encontrar e falar.',
       t:'O presente simples define a pessoa (frases 1 e 3) e o <i>will</i> da frase 2 mostra essa pessoa em ação amanhã. Depois de <i>as soon as</i> o verbo fica no presente (<i>finishes</i>), embora se refira ao futuro.',
       e:'<i>Carefully</i> e <i>slowly</i> são peças de modo e carregam o retrato: escuta com atenção, fala devagar. <i>Tomorrow</i> é a única peça de tempo e situa a reunião.',
       c:'Predicativa, temporal e adversativa: um parágrafo curto que afirma, agenda e reforça.' },
   s:[
    { p:'He', t:'present', a:'simples', v:'listen', col:'carefully', o2:{ k:'pred', cj:'… is that', op:'point' }, why:'A tese do retrato: o que define essa pessoa é escutar com atenção.' },
    { p:'He', t:'future', a:'simples', v:'meet', col:'the team', ends:['tomorrow'], o2:{ k:'temp', cj:'as soon as', op:'the work' }, why:'Futuro na principal e presente depois de <i>as soon as</i>: a reunião depende só de terminar o trabalho.' },
    { p:'He', t:'present', a:'simples', v:'speak', col:'slowly', o2:{ k:'adv', cj:'but', v:'listen' }, why:'<i>But</i> equilibra falar e ouvir: falar devagar não basta, e o que distingue a pessoa é que ela também escuta.' }
   ] },
 /* ---- v135: ORAÇÕES REDUZIDAS (enxugar a frase) ---- */
 { id:'red1', r:'enxugar', tema:'estudo', nivel:2, titulo:'Aprender sem perder tempo',
   ideia:'Três jeitos de dizer a mesma coisa com menos palavras: pelo meio, pela ordem e pelo plano.',
   n:{ v:'<i>Learn</i>, <i>send</i> e <i>plan</i> contam uma pequena rotina de estudo e trabalho: aprender, entregar e planejar. Cada verbo traz um complemento do mesmo assunto (erros, problema, meta), e é ele que vira o <b>-ing</b> ou o <b>infinitivo</b> da reduzida.',
       t:'Presente simples para o hábito, passado simples para o fato já concluído e presente simples para o plano. A reduzida <b>não tem tempo próprio</b>: ela herda o da principal, por isso nunca aparece <i>-ed</i> ou <i>will</i> dentro dela.',
       e:'Quase não há peças soltas, porque a própria reduzida já ocupa o lugar do advérbio: <i>by</i> responde “como?”, <i>after</i> responde “quando?”.',
       c:'<b>Reduzida de gerúndio (meio) + reduzida de gerúndio (tempo) + objetiva reduzida de infinitivo</b>. Em nenhuma das três aparece um sujeito novo: o sujeito da principal trabalha nas duas ações. É isso que permite reduzir, e é o que torna a frase curta e natural.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'learn', o2:{ k:'rger', cj:'by', op:'avoid mistakes' }, why:'<i>By</i> + <b>-ing</b> diz o <b>meio</b>: como ela aprende? Evitando erros. Não há sujeito na reduzida: quem aprende e quem evita é a mesma pessoa. Em português: gerúndio (“aprende evitando erros”).' },
    { p:'He', t:'past', a:'simples', v:'send', col:'the report', o2:{ k:'rger', cj:'after', op:'solve the problem' }, why:'<i>After</i> + <b>-ing</b> marca a <b>ordem</b>: primeiro resolveu, depois enviou. Abre a frase e vira vírgula. Depois de preposição o inglês só aceita <i>-ing</i>; o português usa infinitivo (“depois de resolver”).' },
    { p:'They', t:'present', a:'simples', v:'plan', o2:{ k:'rinf', cj:'to', op:'meet the deadline' }, why:'<i>Plan</i> pede <b>to + verbo</b>. É a oração reduzida mais comum do inglês: quem planeja e quem cumpre o prazo é o mesmo grupo, então a segunda oração não repete o sujeito.' }
   ] },
 { id:'red2', r:'enxugar', tema:'trabalho', nivel:2, titulo:'Se precisar, é só pedir',
   ideia:'Condição, tempo e ordem ditos com particípio e gerúndio, como num aviso de trabalho.',
   n:{ v:'<i>Call</i>, <i>send</i> e <i>prepare</i> são verbos de rotina de escritório, e os três aceitam um objeto claro (o escritório, o relatório). O particípio da reduzida descreve quem sofre a ação, por isso o sujeito é sempre quem é solicitado ou chamado.',
       t:'Presente simples para o procedimento, passado simples para o fato e presente simples para o hábito. O particípio da reduzida é <b>passivo</b> e não carrega tempo próprio.',
       e:'A reduzida de particípio abre a frase e termina em vírgula; a de gerúndio vai depois da principal e mostra a ordem das ações.',
       c:'<b>Reduzida de particípio (condição) + reduzida de particípio (tempo) + reduzida de gerúndio (ordem)</b>. É a linguagem de avisos, e-mails e regras: <i>If needed</i>, <i>When asked</i>, <i>Before leaving</i>. Frases curtas que a pessoa já reconhece de ver no trabalho.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'call', col:'the office', o2:{ k:'rpart', cj:'if', op:'needed' }, why:'<i>If needed</i> = <i>if it is needed</i>: some o sujeito e o <i>be</i>. É uma expressão fixa de aviso. Em português: “se necessário”, invariável.' },
    { p:'He', t:'past', a:'simples', v:'send', col:'the report', o2:{ k:'rpart', cj:'when', op:'asked' }, why:'<i>When asked</i> = <i>when he was asked</i>. O particípio é passivo: ele foi solicitado. Em português concorda com o sujeito (“quando solicitado”).' },
    { p:'She', t:'present', a:'simples', v:'prepare', col:'a presentation', o2:{ k:'rger', cj:'before', op:'meet the deadline' }, why:'<i>Before</i> + <b>-ing</b>: ordem das ações com o mesmo sujeito. Em português: antes de + infinitivo (“antes de cumprir o prazo”).' }
   ] },
 { id:'red3', r:'enxugar', tema:'casa', nivel:1, titulo:'Cozinhar com gosto',
   ideia:'O que se gosta de fazer, o que se faz ao mesmo tempo e a ressalva que não impede.',
   n:{ v:'<i>Enjoy</i> e <i>cook</i> pertencem ao mesmo campo (prazer e rotina de casa). O verbo da reduzida nasce do mesmo tema, e o <i>-ing</i> mantém a cena viva.',
       t:'Presente simples para o gosto e o hábito. A reduzida herda o tempo da principal.',
       e:'<i>Dinner</i> é a colocação que dá o objeto da cena; a reduzida de particípio abre a frase.',
       c:'<b>Objetiva reduzida (-ing) + reduzida de gerúndio (simultâneo) + reduzida de particípio (concessão)</b>. Três formas nominais do verbo na mesma cena: <i>enjoys showing</i>, <i>while enjoying</i>, <i>although tired</i>.' },
   s:[
    { p:'She', t:'present', a:'simples', v:'enjoy', o2:{ k:'rinf', cj:'-ing', op:'show {p} feelings' }, why:'<i>Enjoy</i> pede <b>-ing</b> (nunca <i>to</i>). Em português a mesma ideia vira infinitivo: “gosta de demonstrar”.' },
    { p:'She', t:'present', a:'simples', v:'cook', o2:{ k:'rger', cj:'while', op:'enjoy the meal' }, why:'<i>While</i> + <b>-ing</b>: duas ações ao mesmo tempo, com o mesmo sujeito. Em português basta o gerúndio (“cozinha curtindo a refeição”).' },
    { p:'She', t:'present', a:'simples', v:'cook', col:'dinner', o2:{ k:'rpart', cj:'although', op:'tired' }, why:'<i>Although tired</i> = <i>although she is tired</i>. A concessão fica só com o adjetivo-particípio. Em português: “embora cansada”.' }
   ] },
 { id:'red4', r:'enxugar', tema:'negócios', nivel:3, titulo:'O time em que se pode confiar',
   ideia:'Descrever pessoas com uma palavra só depois do substantivo, e fechar com o que se aprende.',
   n:{ v:'<i>Hire</i> e <i>meet</i> trazem pessoas como objeto, o que abre espaço para a relativa reduzida. <i>Learn</i> fecha o texto com o que se espera da equipe.',
       t:'Passado simples para a contratação e presente simples para o resto: o particípio de <i>trained</i> é passivo e o <i>-ing</i> é ativo, mas nenhum dos dois tem tempo próprio.',
       e:'Nenhuma peça solta: o detalhe vai todo dentro do substantivo.',
       c:'<b>Relativa reduzida em três formas (-ed, -ing, to) + objetiva reduzida</b>: <i>trained by experts</i> (sofreu), <i>working here</i> (faz), <i>to rely on</i> (serve para). É o jeito mais compacto de descrever pessoas e coisas, e a forma mais comum em textos profissionais.' },
   s:[
    { p:'We', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'rrel', cj:'-ed', op:'trained by experts' }, why:'<i>a developer trained by experts</i> = <i>a developer who was trained by experts</i>: o pronome e o auxiliar foram cortados. Particípio = passivo. Em português também funciona (“treinado por especialistas”).' },
    { p:'She', t:'present', a:'simples', v:'meet', col:'the team', o2:{ k:'rrel', cj:'-ing', op:'working here' }, why:'<i>the team working here</i> = <i>the team that works here</i>. O <i>-ing</i> é ativo: o substantivo faz a ação. Em português costuma-se manter o pronome (“que trabalha aqui”).' },
    { p:'We', t:'present', a:'simples', v:'hire', col:'a developer', o2:{ k:'rrel', cj:'to', op:'to rely on' }, why:'<i>a developer to rely on</i> = <i>a developer we can rely on</i>. O <i>to</i> + verbo diz para que serve ou o que se pode fazer com o substantivo. A preposição fica no fim: é a lacuna do relativo.' },
    { p:'They', t:'present', a:'simples', v:'learn', o2:{ k:'rinf', cj:'to', op:'avoid mistakes' }, why:'<i>Learn</i> pede <b>to + verbo</b>: o que o time aprende é a evitar erros. Sem sujeito novo, a oração fica reduzida.' }
   ] }
];
/* v136: parágrafos de COBERTURA das reduzidas. Cada um combina 2 reduzidas com 3 outros tipos (fecha 6 pares).
   Formato compacto: s = frases na ordem do texto; notas e explicações são geradas por parRedExtra(). */
const PAR_RED_X = (() => {
  /* biblioteca de frases (cada uma já validada no motor) — chave = tipo + nº */
  const L = {
    adit1:{ p:'We', t:'present', a:'simples', v:'test', col:'the code', mid:['always'], o2:{ k:'adit', cj:'and', v:'check' } },
    adit2:{ p:'He', t:'present', a:'simples', v:'read', col:'the book', mid:['usually'], ends:['at home'], o2:{ k:'adit', cj:'and then', v:'study' } },
    adv1:{ p:'He', t:'present', a:'simples', v:'work', mid:['always'], o2:{ k:'adv', cj:'but', v:'rest', vneg:true } },
    adv2:{ p:'They', t:'past', a:'simples', v:'negotiate', col:'the price', ends:['at the office', 'yesterday'], o2:{ k:'adv', cj:'but', v:'accept', vneg:true } },
    cons1:{ p:'They', t:'present', a:'perfeito', v:'practice', ends:['lately'], o2:{ k:'cons', cj:'so', op:'confident' } },
    alt1:{ p:'We', t:'future', a:'simples', v:'accept', col:'the offer', ends:['tomorrow'], o2:{ k:'alt', cj:'or', v:'reject' } },
    alt2:{ p:'We', t:'future', a:'simples', v:'stay', col:'at home', ends:['tonight'], o2:{ k:'alt', cj:'or', v:'leave' } },
    expl1:{ p:'She', t:'present', a:'simples', v:'study', col:'hard', ends:['every day'], o2:{ k:'expl', cj:'for', op:'a good grade' } },
    expl2:{ p:'They', t:'present', a:'simples', v:'practice', col:'English', ends:['every day'], o2:{ k:'expl', cj:'for', op:'to learn more' } },
    final1:{ p:'She', t:'present', a:'simples', v:'study', col:'English', mid:['usually'], ends:['at home', 'every evening'], o2:{ k:'final', cj:'in order to', op:'get a better job' } },
    final2:{ p:'He', t:'past', a:'simples', v:'write', col:'in English', ends:['after that'], o2:{ k:'final', cj:'in order to', op:'share {p} ideas' } },
    caus1:{ p:'He', t:'present', a:'simples', v:'practice', col:'English', mid:['now'], ends:['every day'], o2:{ k:'caus', cj:'because', op:'to learn more' } },
    caus2:{ p:'She', t:'present', a:'simples', v:'drive', col:'to work', ends:['every day'], o2:{ k:'caus', cj:'because', op:'heavy traffic' } },
    temp1:{ p:'She', t:'future', a:'simples', v:'practice', col:'English', ends:['tomorrow'], o2:{ k:'temp', cj:'as soon as', op:'the lesson' } },
    temp2:{ p:'He', t:'past', a:'simples', v:'read', col:'the book', ends:['slowly', 'last night'], o2:{ k:'temp', cj:'before', op:'the notes' } },
    cond1:{ p:'He', t:'future', a:'simples', v:'study', mid:['probably'], ends:['next week'], o2:{ k:'cond', cj:'if', op:'a good grade' } },
    conc1:{ p:'She', t:'past', a:'simples', v:'study', col:'hard', ends:['yesterday'], o2:{ k:'conc', cj:'although', op:'tiring' } },
    conc2:{ p:'He', t:'future', a:'simples', v:'present', col:'the results', ends:['at the office', 'tomorrow'], o2:{ k:'conc', cj:'even though', op:'stressful' } },
    cmp1:{ p:'I', t:'present', a:'simples', v:'read', col:'the book', o2:{ k:'cmp', cj:'as … as', op:'carefully' } },
    cmp2:{ p:'I', t:'present', a:'simples', v:'train', o2:{ k:'cmp', cj:'as … as', op:'seriously' } },
    conf1:{ p:'We', t:'past', a:'simples', v:'finish', col:'the report', ends:['last week'], o2:{ k:'conf', cj:'as', op:'the plan' } },
    conf2:{ p:'We', t:'past', a:'simples', v:'deliver', col:'on time', o2:{ k:'conf', cj:'just as', op:'the agreement' } },
    prop1:{ p:'They', t:'present', a:'simples', v:'practice', col:'English', o2:{ k:'prop', cj:'the more … the more', v:'learn' } },
    csq1:{ p:'I', t:'present', a:'simples', v:'study', o2:{ k:'csq', cj:'so … that', op:'more' } },
    csq2:{ p:'She', t:'present', a:'simples', v:'train', o2:{ k:'csq', cj:'so … that', op:'stronger' } },
    rel1:{ p:'We', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'rel', cj:'who', v:'need' } },
    rel2:{ p:'We', t:'present', a:'simples', v:'use', col:'a tool', o2:{ k:'rel', cj:'that', v:'need' } },
    relx1:{ p:'We', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'relx', cj:'whose', wh:'company' } },
    relx2:{ p:'She', t:'past', a:'simples', v:'find', col:'a solution', o2:{ k:'relx', cj:'which', v:'need' } },
    obj1:{ p:'She', t:'present', a:'simples', v:'know', o2:{ q:'test', k:'obj', cj:'that', op:'difficult' } },
    obj2:{ p:'He', t:'present', a:'simples', v:'know', o2:{ q:'decision', k:'obj', cj:'that', op:'difficult' } },
    oi1:{ p:'He', t:'present', a:'simples', v:'focus', o2:{ k:'oi', cj:'-ing', op:'the problem' } },
    oi2:{ p:'He', t:'present', a:'simples', v:'think', o2:{ q:'change', k:'oi', cj:'whether', op:'difficult' } },
    subj1:{ p:'They', t:'present', a:'simples', v:'study', col:'hard', o2:{ k:'subj', cj:'It is … that', op:'obvious' } },
    subj2:{ p:'She', t:'present', a:'simples', v:'need', col:'more time', o2:{ k:'subj', cj:'It is … that', op:'clear' } },
    pred1:{ p:'They', t:'present', a:'perfeito', v:'improve', mid:['really'], ends:['lately'], o2:{ k:'pred', cj:'… is that', op:'truth' } },
    pred2:{ p:'He', t:'present', a:'simples', v:'listen', col:'carefully', o2:{ k:'pred', cj:'… is that', op:'point' } },
    cn1:{ p:'We', t:'present', a:'simples', v:'accept', o2:{ q:'offer', k:'cn', cj:'that', op:'fact' } },
    cn2:{ p:'She', t:'present', a:'simples', v:'share', o2:{ q:'deadline', k:'cn', cj:'that', op:'belief' } },
    ap1:{ p:'We', t:'present', a:'simples', v:'share', o2:{ k:'ap', cj:': to', op:'goal' } },
    ap2:{ p:'She', t:'present', a:'simples', v:'know', o2:{ q:'lesson', k:'ap', cj:': that', op:'fact' } },
    /* variantes com outro sujeito (mesma estrutura validada) para não repetir a frase entre parágrafos */
    cond1b:{ p:'They', t:'future', a:'simples', v:'study', mid:['probably'], ends:['next week'], o2:{ k:'cond', cj:'if', op:'a good grade' } },
    caus2b:{ p:'We', t:'present', a:'simples', v:'drive', col:'to work', ends:['every day'], o2:{ k:'caus', cj:'because', op:'heavy traffic' } },
    obj1b:{ p:'We', t:'present', a:'simples', v:'know', o2:{ q:'test', k:'obj', cj:'that', op:'difficult' } },
    obj2b:{ p:'She', t:'present', a:'simples', v:'know', o2:{ q:'decision', k:'obj', cj:'that', op:'difficult' } },
    subj1b:{ p:'She', t:'present', a:'simples', v:'study', col:'hard', o2:{ k:'subj', cj:'It is … that', op:'obvious' } },
    subj2b:{ p:'They', t:'present', a:'simples', v:'need', col:'more time', o2:{ k:'subj', cj:'It is … that', op:'clear' } },
    conc1b:{ p:'He', t:'past', a:'simples', v:'study', col:'hard', ends:['yesterday'], o2:{ k:'conc', cj:'although', op:'tiring' } },
    prop1b:{ p:'We', t:'present', a:'simples', v:'practice', col:'English', o2:{ k:'prop', cj:'the more … the more', v:'learn' } },
    cons1b:{ p:'We', t:'present', a:'perfeito', v:'practice', ends:['lately'], o2:{ k:'cons', cj:'so', op:'confident' } },
    rel1b:{ p:'They', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'rel', cj:'who', v:'need' } }
  };
  /* reduzidas: g = gerúndio, p = particípio, i = infinitivo/-ing objeto, r = adjetiva reduzida */
  const R = {
    g1:{ p:'She', t:'past', a:'simples', v:'send', col:'an email', o2:{ k:'rger', cj:'after', op:'solve the problem' } },
    g2:{ p:'He', t:'present', a:'simples', v:'read', col:'the book', o2:{ k:'rger', cj:'while', op:'learn something new' } },
    g3:{ p:'They', t:'present', a:'simples', v:'practice', col:'English', o2:{ k:'rger', cj:'while', op:'learn something new' } },
    g4:{ p:'We', t:'present', a:'simples', v:'drive', col:'to work', o2:{ k:'rger', cj:'by', op:'avoid the traffic' } },
    g5:{ p:'She', t:'present', a:'simples', v:'train', o2:{ k:'rger', cj:'while', op:'improve {p} performance' } },
    g6:{ p:'He', t:'past', a:'simples', v:'sell', col:'the house', o2:{ k:'rger', cj:'after', op:'get a better price' } },
    g7:{ p:'They', t:'past', a:'simples', v:'accept', col:'the offer', o2:{ k:'rger', cj:'after', op:'reach an agreement' } },
    g8:{ p:'We', t:'present', a:'simples', v:'build', col:'a website', o2:{ k:'rger', cj:'by', op:'solve the problem' } },
    g9:{ p:'He', t:'present', a:'simples', v:'listen', col:'to music', o2:{ k:'rger', cj:'while', op:'recover {p} energy' } },
    g10:{ p:'They', t:'present', a:'simples', v:'sell', col:'products online', o2:{ k:'rger', cj:'by', op:'get a better price' } },
    p1:{ p:'She', t:'present', a:'simples', v:'present', col:'the results', o2:{ k:'rpart', cj:'once', op:'prepared' } },
    p2:{ p:'She', t:'present', a:'simples', v:'study', col:'hard', o2:{ k:'rpart', cj:'although', op:'tired' } },
    p3:{ p:'He', t:'future', a:'simples', v:'accept', col:'the offer', o2:{ k:'rpart', cj:'once', op:'approved' } },
    p4:{ p:'We', t:'past', a:'simples', v:'finish', col:'the report', o2:{ k:'rpart', cj:'when', op:'asked' } },
    p5:{ p:'They', t:'present', a:'simples', v:'pay', col:'the bill', o2:{ k:'rpart', cj:'if', op:'asked' } },
    p6:{ p:'She', t:'present', a:'simples', v:'cook', col:'dinner', o2:{ k:'rpart', cj:'although', op:'worried' } },
    p7:{ p:'He', t:'present', a:'simples', v:'send', col:'an email', o2:{ k:'rpart', cj:'if', op:'needed' } },
    p8:{ p:'They', t:'past', a:'simples', v:'call', col:'a friend', o2:{ k:'rpart', cj:'when', op:'invited' } },
    p9:{ p:'She', t:'present', a:'simples', v:'pay', col:'the bill', o2:{ k:'rpart', cj:'if', op:'needed' } },
    i1:{ p:'They', t:'present', a:'simples', v:'need', o2:{ k:'rinf', cj:'to', op:'save money' } },
    i2:{ p:'She', t:'present', a:'simples', v:'decide', o2:{ k:'rinf', cj:'to', op:'make better decisions' } },
    i3:{ p:'He', t:'present', a:'simples', v:'hope', o2:{ k:'rinf', cj:'to', op:'build trust' } },
    i4:{ p:'We', t:'present', a:'simples', v:'prefer', o2:{ k:'rinf', cj:'to', op:'be fair' } },
    i5:{ p:'They', t:'present', a:'simples', v:'continue', o2:{ k:'rinf', cj:'-ing', op:'improve the situation' } },
    i6:{ p:'She', t:'present', a:'simples', v:'start', o2:{ k:'rinf', cj:'-ing', op:'improve the results' } },
    i7:{ p:'They', t:'present', a:'simples', v:'promise', o2:{ k:'rinf', cj:'to', op:'share {p} ideas' } },
    i8:{ p:'He', t:'present', a:'simples', v:'recommend', o2:{ k:'rinf', cj:'-ing', op:'protect the team' } },
    r1:{ p:'We', t:'past', a:'simples', v:'hire', col:'new staff', o2:{ k:'rrel', cj:'-ing', op:'living nearby' } },
    r2:{ p:'She', t:'present', a:'simples', v:'buy', col:'a gift', o2:{ k:'rrel', cj:'-ed', op:'made in Brazil' } },
    r3:{ p:'They', t:'present', a:'simples', v:'read', col:'the book', o2:{ k:'rrel', cj:'-ed', op:'written in English' } },
    r4:{ p:'She', t:'past', a:'simples', v:'write', col:'a report', o2:{ k:'rrel', cj:'-ed', op:'needed for work' } },
    r5:{ p:'We', t:'present', a:'simples', v:'use', col:'a tool', o2:{ k:'rrel', cj:'-ing', op:'working perfectly' } },
    r6:{ p:'He', t:'past', a:'simples', v:'sell', col:'the house', o2:{ k:'rrel', cj:'-ed', op:'located downtown' } },
    r7:{ p:'We', t:'past', a:'simples', v:'visit', col:'a museum', o2:{ k:'rrel', cj:'-ed', op:'built in 2010' } },
    r8:{ p:'She', t:'present', a:'simples', v:'meet', col:'a friend', o2:{ k:'rrel', cj:'-ing', op:'waiting outside' } },
    r9:{ p:'We', t:'past', a:'simples', v:'hire', col:'a developer', o2:{ k:'rrel', cj:'to', op:'to learn from' } }
  };
  /* parágrafos: [id, tema, nível, título, ideia, [chaves das frases]] — cada um fecha 6 pares (2 reduzidas × 3 tipos) */
  const P = [
    ['rx1', 'trabalho', 2, 'Fazer, contrastar e concluir', 'Gerúndio e particípio ao lado de uma soma, um contraste e uma conclusão.', ['g1', 'adit1', 'p1', 'adv1', 'cons1']],
    ['rx2', 'estudo', 1, 'Estudar com opções e motivos', 'Gerúndio e particípio ao lado de uma opção, uma explicação e uma finalidade.', ['g2', 'alt2', 'p2', 'expl2', 'final1']],
    ['rx3', 'estudo', 2, 'Quando, por quê e se', 'Gerúndio e particípio ao lado de um motivo, um momento e uma condição.', ['g3', 'caus1', 'p3', 'temp1', 'cond1']],
    ['rx4', 'trabalho', 2, 'Apesar de, como e conforme', 'Gerúndio e particípio ao lado de uma concessão, uma comparação e um combinado.', ['g4', 'conc2', 'p4', 'cmp1', 'conf1']],
    ['rx5', 'saúde', 2, 'Treinar mais, render mais', 'Gerúndio e particípio ao lado de uma proporção, uma intensidade e uma relativa.', ['g5', 'prop1', 'p5', 'csq2', 'rel1']],
    ['rx6', 'negócios', 3, 'Vender, saber e pensar', 'Gerúndio e particípio ao lado de uma relativa explicativa, um objeto e um objeto indireto.', ['g6', 'relx1', 'p6', 'obj1', 'oi1']],
    ['rx7', 'negócios', 3, 'Teses sobre o que se aceitou', 'Gerúndio e particípio ao lado de um sujeito, um predicativo e um complemento nominal.', ['g7', 'subj1', 'p7', 'pred1', 'cn1']],
    ['rx8', 'tecnologia', 3, 'Um site, uma meta e uma dúvida', 'Gerúndio e particípio ao lado de um aposto, um objeto e um sujeito.', ['g8', 'ap1', 'p8', 'obj2', 'subj2']],
    ['rx9', 'negócios', 2, 'Planos de equipe', 'Infinitivo e relativa reduzida ao lado de uma soma, um contraste e uma conclusão.', ['i1', 'adit2', 'r1', 'adv2', 'cons1b']],
    ['rx10', 'casa', 1, 'Decidir sem pressa', 'Infinitivo e relativa reduzida ao lado de uma opção, uma explicação e uma finalidade.', ['i2', 'alt1', 'r2', 'expl1', 'final2']],
    ['rx11', 'estudo', 2, 'Esperar, ler e explicar', 'Infinitivo e relativa reduzida ao lado de um motivo, um momento e uma condição.', ['i3', 'caus2b', 'r3', 'temp2', 'cond1b']],
    ['rx12', 'trabalho', 3, 'O relatório que ninguém pediu', 'Infinitivo e relativa reduzida ao lado de uma concessão, uma comparação e um combinado.', ['i4', 'conc1b', 'r4', 'cmp2', 'conf2']],
    ['rx13', 'tecnologia', 2, 'A ferramenta que funciona', 'Infinitivo e relativa reduzida ao lado de uma proporção, uma intensidade e uma relativa.', ['i5', 'prop1b', 'r5', 'csq1', 'rel1b']],
    ['rx14', 'finanças', 3, 'Vender a casa', 'Infinitivo e relativa reduzida ao lado de uma relativa explicativa, um objeto e um objeto indireto.', ['i6', 'relx2', 'r6', 'obj2b', 'oi2']],
    ['rx15', 'viagem', 2, 'O museu e a lição', 'Infinitivo e relativa reduzida ao lado de um sujeito, um predicativo e um complemento nominal.', ['i7', 'subj2b', 'r7', 'pred2', 'cn2']],
    ['rx16', 'comunicação', 3, 'Proteger o time', 'Infinitivo e relativa reduzida ao lado de um aposto, um objeto e um sujeito.', ['i8', 'ap2', 'r8', 'obj1b', 'subj1b']],
    ['rx17', 'negócios', 3, 'As três reduzidas juntas', 'Gerúndio, particípio e relativa reduzida na mesma cena, com um motivo e uma concessão.', ['r9', 'g10', 'p9', 'caus2', 'conc1']]
  ];
  return { L, R, P };
})();

