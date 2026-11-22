/* ================================================================================
   v178 · ARGUMENTAR COM ADJETIVOS — camada semântica sobre os 8 tipos de adjetivo
   --------------------------------------------------------------------------------
   Os 8 encaixes do objeto (opinião → propósito) ensinam a ORDEM. Este arquivo ensina a FUNÇÃO: quando o adjetivo
   deixa de enfeitar o substantivo e passa a sustentar um argumento — justificar, explicar, contrastar, conceder,
   concluir, comparar, condicionar, acumular.

   O modelo tem três camadas:
     1. ARG_SUB  — cada SUBCATEGORIA tem uma polaridade típica (＋ a favor · − contra · ± depende · 0 só descreve)
                   e um papel. É o mapa que o Glossário mostra; cobre os ~66 grupos dos 8 tipos (testado).
     2. ARG_LEX  — um léxico curado, no nível da PALAVRA (~75 adjetivos que de fato argumentam), com polaridade,
                   dimensão avaliada (preço, conforto, aparência…), comparativo, e a consequência de "so … that".
                   Toda palavra tem de existir em ADJ7 (o teste confere), então o vocabulário é um só.
     3. ARG_INT  — as 8 intenções: teoria, conectivos e variantes. Cada variante é uma função pura que monta a
                   frase inglesa (com as cores do app), a tradução e a lista de adjetivos válidos.

   Por que curadoria e não regra livre: argumento exige coerência (a polaridade da razão tem de casar com a da
   decisão); uma frase gramatical mas absurda ensinaria o contrário do que se quer. A coerência é garantida por
   construção — as funções só combinam adjetivos que respeitam a regra da intenção — e o teste v178 prova isso
   para os 68 substantivos × 2 tons × todas as variantes.

   Limites assumidos: só singular, só passado simples ("was"), um substantivo de cada vez. Usa os helpers de
   pm-01-base.js (A7, J, R) e de data-adjetivos.js (ADJ7, NP_SUBS, npSub, npAn).
   ================================================================================ */

/* ---------- 1. Polaridade e papel por SUBCATEGORIA ----------
   [polaridade, papel]. Subcategorias que não aparecem aqui (forma, cor, origem, material, propósito) herdam
   ARG_DESCRITIVO: classificam, não avaliam. */
const ARG_DESCRITIVO = ['0', 'Só classifica: diz o que a coisa é, não se é boa ou ruim.'];
const ARG_TIPOS_DESCRITIVOS = new Set(['forma', 'cor', 'origem', 'material', 'proposito']);
const ARG_SUB = {
  'Elogio geral':                 ['+', 'Razão geral a favor: motivo para aprovar, comprar, recomendar.'],
  'Crítica geral':                ['-', 'Razão geral contra: motivo para recusar, devolver, reclamar.'],
  'Beleza e aparência':           ['+', 'Avalia o visual a favor. É gosto, mas funciona como razão de escolha.'],
  'Feiura e mau gosto':           ['-', 'Avalia o visual contra: razão típica para não levar.'],
  'Sabor e cheiro':               ['±', 'Avalia pelos sentidos: delicioso é ＋, insosso é −; o resto depende do prato.'],
  'Conforto e sensação':          ['±', 'Mistura os dois lados: confortável é ＋, desconfortável é −.'],
  'Utilidade e qualidade':        ['±', 'O núcleo do argumento prático: útil e durável são ＋; frágil e inútil são −.'],
  'Valor, preço e fama':          ['±', 'Barato é ＋ para quem compra, caro é −; fama costuma ser ＋.'],
  'Curiosidade e emoção':         ['±', 'O que provoca em quem vê: fascinante é ＋, enfadonho é −.'],
  'Limpeza, ordem e ambiente':    ['±', 'Estado do lugar: limpo e silencioso são ＋; sujo e barulhento são −.'],
  'Personalidade':                ['±', 'Caráter de pessoas e bichos: gentil é ＋, grosseiro é −.'],
  'Grande':                       ['±', 'Contextual: grande é virtude numa casa e defeito numa mochila.'],
  'Pequeno':                      ['±', 'Contextual: pequeno é virtude num celular e defeito num quarto.'],
  'Médio e padrão':               ['0', 'Neutro: indica normalidade, quase nunca argumenta.'],
  'Altura e comprimento':         ['±', 'Contextual: alto é bom numa torre, ruim numa porta.'],
  'Largura e espessura':          ['±', 'Contextual: fino é elogio num celular, defeito num casaco de inverno.'],
  'Peso e profundidade':          ['±', 'Contextual: leve é ＋ para carregar; pesado é − para carregar e ＋ para firmeza.'],
  'Velho e antigo':               ['±', 'Pesa contra num eletrônico e a favor num vinho ou num móvel de época.'],
  'Novo e moderno':               ['+', 'Tende a favorecer, salvo quando se valoriza o antigo.'],
  'Fase da vida':                 ['0', 'Informa a idade de pessoas e bichos; só argumenta por contexto.'],
  'Uso e desgaste':               ['-', 'O que o uso fez: quase sempre pesa contra (gasto, enferrujado), exceto restaurado.'],
  'Época e estilo':               ['0', 'Classifica o período; vira elogio ou crítica só por gosto.']
};
function argSubInfo(sub, tipo){
  if(ARG_SUB[sub]) return ARG_SUB[sub];
  return ARG_TIPOS_DESCRITIVOS.has(tipo) ? ARG_DESCRITIVO : null;
}
const ARG_POL_ROT = { '+':'＋ a favor', '-':'− contra', '±':'± depende', '0':'0 só descreve' };
const ARG_POL_PT = { '+':'a favor', '-':'contra', '±':'contextual', '0':'neutro' };
const ARG_DIM = { preco:'preço', aparencia:'aparência', conforto:'conforto', qualidade:'qualidade', tamanho:'tamanho',
  peso:'peso', idade:'idade', fama:'fama', ambiente:'ambiente', carater:'caráter' };

/* ---------- 2. Léxico argumentativo (nível da palavra) ----------
   en | polaridade | dimensão | comparativo | comparativo PT ("=" = invariável, vem antes do substantivo) |
   consequência EN ("so … that …") | consequência PT | aplica a (o objeto · l lugar · a animal · c só com
   conforto · n não veículo) | consequência vale para (padrão: as mesmas classes, sem c/n) */
const ARG_LEX_TXT = `
cheap|+|preco|cheaper||I couldn't believe the price|não acreditei no preço|ol|
affordable|+|preco|more affordable||||ol|
expensive|-|preco|more expensive||I couldn't afford it|não pude pagar|ol|
overpriced|-|preco|||I walked away|fui embora|ol|
valuable|+|preco|more valuable||I kept it in a safe|guardei no cofre|o|
beautiful|+|aparencia|more beautiful||everyone stopped to look at it|todo mundo parou para olhar|ola|
pretty|+|aparencia|prettier||I kept looking at it|fiquei olhando|ola|
cute|+|aparencia|cuter||I couldn't stop smiling|não parei de sorrir|ola|
elegant|+|aparencia|more elegant||everyone noticed it|todo mundo reparou|ol|
stylish|+|aparencia|more stylish||everyone asked where I got it|todo mundo perguntou onde eu comprei|o|
gorgeous|+|aparencia|more gorgeous||I couldn't take my eyes off it|não consegui tirar os olhos|ola|
ugly|-|aparencia|uglier||I couldn't look at it|não consegui olhar|ola|
plain|-|aparencia|plainer||||o|
tacky|-|aparencia|tackier||I hid it in the closet|escondi no armário|o|
shabby|-|aparencia|shabbier||I felt embarrassed|fiquei com vergonha|ol|
comfortable|+|conforto|more comfortable||I forgot about everything else|esqueci todo o resto|olc|
cosy|+|conforto|cosier||it felt like home|parecia a minha casa|olc|
soft|+|conforto|softer||it felt like a cloud|parecia uma nuvem|oc|
uncomfortable|-|conforto|more uncomfortable||I couldn't sit still|não consegui ficar parado|olc|
useful|+|qualidade|more useful||I used it every day|usei todos os dias|o|
practical|+|qualidade|more practical||I used it for everything|usei para tudo|o|
durable|+|qualidade|more durable||it lasted for years|durou anos|ol|
sturdy|+|qualidade|sturdier||it lasted for years|durou anos|ol|
reliable|+|qualidade|more reliable||I never worried about it|nunca me preocupei|ol|
versatile|+|qualidade|more versatile||I used it for everything|usei para tudo|o|
simple|+|qualidade|simpler||anyone could use it|qualquer um conseguia usar|o|
useless|-|qualidade|more useless||I never used it|nunca usei|o|
flimsy|-|qualidade|flimsier||it broke within a week|quebrou em uma semana|o|
fragile|-|qualidade|more fragile||I was afraid to touch it|tive medo de tocar|ol|
weak|-|qualidade|weaker||it bent under my hands|dobrou nas minhas mãos|o|
complicated|-|qualidade|more complicated||I gave up|desisti|o|
big|±|tamanho|bigger|=maior|it didn't fit through the door|não passou pela porta|ona|on
small|±|tamanho|smaller|=menor|it fitted in the corner|coube no canto|ona|on
huge|±|tamanho|||it took up the whole room|ocupou o cômodo inteiro|o|
tiny|±|tamanho|||I almost didn't see it|quase não vi|ol|
tall|±|tamanho|taller||I couldn't see the top|não consegui ver o topo|l|
bulky|-|tamanho|bulkier||it took up half the room|ocupou metade do cômodo|o|
compact|+|tamanho|more compact||it took up almost no space|quase não ocupou espaço|o|
spacious|+|tamanho|more spacious||everyone fitted inside|coube todo mundo|ol|
cramped|-|tamanho|more cramped||nobody could move|ninguém conseguia se mexer|ol|
heavy|-|peso|heavier||I couldn't lift it|não consegui levantar|on|
light|+|peso|lighter||I could carry it with one hand|consegui carregar com uma mão só|on|
old|±|idade|older||it was falling apart|estava caindo aos pedaços|ola|ol
new|+|idade|newer||it still smelled of the shop|ainda tinha cheiro de loja|o|
brand-new|+|idade|||it still had the label on|ainda estava com a etiqueta|o|
modern|+|idade|more modern||it looked like it came from the future|parecia ter vindo do futuro|ol|
outdated|-|idade|more outdated||it looked like it came from another era|parecia de outra época|ol|
old-fashioned|±|idade|more old-fashioned||||ol|
worn|-|idade|more worn||it was falling apart|estava caindo aos pedaços|o|
used|±|idade||||||o|
young|±|idade|younger||||a|
famous|+|fama|more famous||everybody knew it|todo mundo conhecia|ol|
popular|+|fama|more popular||there was always a queue|sempre tinha fila|ol|
rare|+|fama|rarer||I'd never seen another one|nunca tinha visto igual|o|
unique|+|fama|||I'd never seen anything like it|nunca tinha visto nada igual|ol|
quiet|+|ambiente|quieter||I could hear a pin drop|dava para ouvir um alfinete cair|la|
noisy|-|ambiente|noisier||I couldn't sleep|não consegui dormir|la|
crowded|-|ambiente|more crowded||I couldn't move|não consegui me mexer|l|
sunny|+|ambiente|sunnier||I needed sunglasses|precisei de óculos escuros|l|
clean|+|ambiente|cleaner||you could see your face in it|dava para ver o rosto refletido|ol|
dirty|-|ambiente|dirtier||I didn't want to touch it|não quis encostar|ol|
friendly|+|carater|friendlier||everybody loved it|todo mundo gostou|a|
calm|+|carater|calmer||it slept all day|dormiu o dia todo|a|
clever|+|carater|more clever||it learned every trick|aprendeu todos os truques|a|
gentle|+|carater|gentler||children could play with it|as crianças podiam brincar|a|
loyal|+|carater|more loyal||it followed me everywhere|me seguia por toda parte|a|
lazy|-|carater|lazier||it never left the sofa|nunca saía do sofá|a|
shy|±|carater|shyer||it hid under the bed|se escondeu embaixo da cama|a|
stubborn|-|carater|more stubborn||it refused to move|se recusou a andar|a|
`;
const ARG_LEX = ARG_LEX_TXT.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
  const [en, pol, dim, cmp, cmpPT, deg, degPT, fl, dg] = l.split('|');
  const t = ADJ7.find(x => x.ops.some(o => o.en === en));
  const op = t ? t.ops.find(o => o.en === en) : null;
  return { en, pol, dim, cmp:cmp || '', cmpPT:cmpPT || '', deg:deg || '', degPT:degPT || '', fl,
    dg: dg || fl.replace(/[cn]/g, ''), tipo:t ? t.k : null, sub:op ? op.sub : '', pm:op ? op.pm : en, pf:op ? op.pf : en };
});
const argLex = en => ARG_LEX.find(l => l.en === en) || null;

/* pares de opostos na MESMA dimensão: só se contrastam em objetos diferentes ("whereas") */
const ARG_ANT = [['cheap', 'expensive'], ['big', 'small'], ['old', 'new'], ['heavy', 'light'], ['noisy', 'quiet'],
  ['comfortable', 'uncomfortable'], ['modern', 'outdated'], ['clean', 'dirty'], ['beautiful', 'ugly'],
  ['useful', 'useless'], ['sturdy', 'flimsy'], ['spacious', 'cramped'], ['simple', 'complicated'],
  ['elegant', 'tacky'], ['friendly', 'shy'], ['calm', 'lazy']];

/* ---------- classes de substantivo e o verbo da decisão ---------- */
const ARG_LUGAR = ['house', 'castle', 'church', 'tower', 'building', 'garden', 'bridge'];
const ARG_ANIMAL = ['cat', 'dog', 'horse', 'bird'];
const ARG_VEIC = ['car', 'bike', 'boat', 'truck', 'bus', 'motorcycle'];
const ARG_CONF = ['sofa', 'chair', 'bed', 'blanket', 'pillow', 'carpet', 'jacket', 'coat', 'sweater', 'hat', 'scarf',
  'shirt', 'dress', 'skirt', 'car', 'bus', 'house', 'bike', 'motorcycle', 'bag'];
const ARG_V = {
  buy:   { pa:'bought',  b:'buy',   pt:'comprei',   ptb:'comprar'  },
  wear:  { pa:'wore',    b:'wear',  pt:'usei',      ptb:'usar'     },
  carry: { pa:'carried', b:'carry', pt:'carreguei', ptb:'carregar' },
  keep:  { pa:'kept',    b:'keep',  pt:'guardei',   ptb:'guardar'  },
  take:  { pa:'took',    b:'take',  pt:'peguei',    ptb:'pegar'    },
  visit: { pa:'visited', b:'visit', pt:'visitei',   ptb:'visitar'  },
  adopt: { pa:'adopted', b:'adopt', pt:'adotei',    ptb:'adotar'   }
};
const ARG_CENA = { o:['in the shop', 'da loja'], l:['in the city', 'da cidade'], a:['in the village', 'da vila'] };
function argClasse(noun){
  const n = npSub(noun); if(!n) return null;
  const k = ARG_ANIMAL.includes(noun) ? 'a' : (ARG_LUGAR.includes(noun) ? 'l' : 'o');
  let v;
  if(k === 'a') v = 'adopt';
  else if(k === 'l' && noun !== 'house') v = 'visit';
  else if(['door', 'window', 'statue', 'flag', 'house', 'truck'].includes(noun)) v = 'buy';
  else v = ({ buy:'buy', sell:'buy', wear:'wear', carry:'carry', find:'keep', have:'keep', take:'take', see:'buy' })[n.v] || 'buy';
  return { k, v, conf:ARG_CONF.includes(noun), veic:ARG_VEIC.includes(noun), cena:ARG_CENA[k] };
}

/* ---------- contexto e helpers de montagem ---------- */
/* cap(s): maiúscula inicial — já definida em pm-01-base.js */
function argCtx(noun, tom, seed, pick){
  const n = npSub(noun), cl = argClasse(noun), f = n.g === 'f';
  return { n, noun, cl, tom, seed:seed || 0, pick:pick || null, pos:tom === '+',
    art:f ? 'a' : 'o', um:f ? 'uma' : 'um', ele:f ? 'ela' : 'ele', o:f ? 'a' : 'o', outro:f ? 'outra' : 'outro',
    V:ARG_V[cl.v] };
}
function argPool(cx, f, noun){
  const cl = noun ? argClasse(noun) : cx.cl;
  return ARG_LEX.filter(l => l.fl.includes(cl.k) && (!l.fl.includes('c') || cl.conf) && (!l.fl.includes('n') || !cl.veic) && (!f || f(l)));
}
const argPT = (l, cx) => cx.n.g === 'f' ? l.pf : l.pm;
const argPTn = (l, g) => g === 'f' ? l.pf : l.pm;
const argA = l => A7(l.tipo, l.en);
/* ± serve aos dois lados; + e − só ao seu */
const argLado = (l, p) => l.pol === p || l.pol === '±';
const argEstrito = (l, p) => l.pol === p;
/* escolhe um item: o preferido do usuário (se válido) ou o da semente */
function argPrim(lista, cx){
  if(!lista.length) return null;
  if(cx.pick){ const e = lista.find(l => l.en === cx.pick); if(e) return e; }
  return lista[cx.seed % lista.length];
}
function argSec(lista, cx, excl, salto){
  const l = lista.filter(x => x !== excl);
  return l.length ? l[(cx.seed * 3 + (salto || 1)) % l.length] : null;
}
/* decisão: "I bought the sofa" / "I didn't buy the sofa" · com pronome ("it") para a 2ª menção */
const argDecEN = (cx, pos, obj) => pos ? `I ${cx.V.pa} ${obj}` : `I didn't ${cx.V.b} ${obj}`;
const argObjEN = cx => R('the ' + cx.noun);
const argObjPT = cx => `${cx.art} ${cx.n.pt}`;
const argDecPT = (cx, pos) => `eu ${pos ? '' : 'não '}${cx.V.pt} ${argObjPT(cx)}`;
const argDecPTo = (cx, pos) => `eu ${pos ? '' : 'não '}${cx.o} ${cx.V.pt}`;             /* "eu o comprei" */
const argFutEN = (cx, pos) => pos ? `I will ${cx.V.b} it` : `I won't ${cx.V.b} it`;
const argFutPT = (cx, pos) => `eu ${pos ? '' : 'não '}vou ${cx.V.ptb.slice(0, -2)}á-l${cx.o}`; /* "eu vou comprá-lo" */
const argSup = c => /^more /.test(c) ? 'most ' + c.slice(5) : c.replace(/er$/, 'est');
const argCmpPT = (l, cx) => l.cmpPT ? l.cmpPT.replace('=', '') : 'mais ' + argPT(l, cx);
const argFim = '.';

/* cada variante devolve { raw (marcado), pt, adjs:[léxico], pool:[léxico escolhíveis], nota } ou null */
function argRes(raw, pt, adjs, pool, nota){ return { raw, pt:cap(pt), adjs, pool, nota:nota || '' }; }

/* ===== JUSTIFICAR · causa → decisão ===== */
function argJust0(cx){
  const pool = argPool(cx, l => argLado(l, cx.tom)); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`${argDecEN(cx, cx.pos, argObjEN(cx))} ${J('because')} it was ${argA(A)}${argFim}`,
    `${argDecPT(cx, cx.pos)} porque ${cx.ele} era ${argPT(A, cx)}.`, [A], pool);
}
function argJust1(cx){
  const pool = argPool(cx, l => argEstrito(l, cx.tom)); const A = argPrim(pool, cx); if(!A) return null;
  const B = argSec(pool.filter(l => l.dim !== A.dim), cx, A); if(!B) return null;
  return argRes(`${argDecEN(cx, cx.pos, argObjEN(cx))} ${J('because')} it was ${argA(A)} ${J('and')} ${argA(B)}${argFim}`,
    `${argDecPT(cx, cx.pos)} porque ${cx.ele} era ${argPT(A, cx)} e ${argPT(B, cx)}.`, [A, B], pool);
}
/* ===== EXPLICAR · razão conhecida → decisão ===== */
function argExp(conj, ptc){
  return cx => {
    const pool = argPool(cx, l => argLado(l, cx.tom)); const A = argPrim(pool, cx); if(!A) return null;
    return argRes(`${J(conj)} it was ${argA(A)}, ${argDecEN(cx, cx.pos, argObjEN(cx))}${argFim}`,
      `${ptc} ${cx.ele} era ${argPT(A, cx)}, ${argDecPT(cx, cx.pos)}.`, [A], pool);
  };
}
function argExp2(cx){
  const pool = argPool(cx, l => argLado(l, cx.tom)); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`The reason ${argDecEN(cx, cx.pos, argObjEN(cx))} ${J('was that')} it was ${argA(A)}${argFim}`,
    `O motivo pelo qual ${argDecPT(cx, cx.pos)} era que ${cx.ele} era ${argPT(A, cx)}.`, [A], pool);
}
/* ===== CONTRASTAR · expectativa × realidade ===== */
/* par (fraco, forte) de dimensões diferentes: o lado que fecha a frase é o que pesa (tom a favor → ＋ por último) */
function argParContraste(cx){
  const pool = argPool(cx, l => l.pol === '+' || l.pol === '-' || l.pol === '±');
  const negs = pool.filter(l => l.pol === '-' || l.pol === '±'), poss = pool.filter(l => l.pol === '+');
  const N = argPrim(cx.pick && negs.find(l => l.en === cx.pick) ? negs : (cx.pick && poss.find(l => l.en === cx.pick) ? poss : negs), cx);
  if(!N) return null;
  const P = N.pol === '+' ? argSec(negs.filter(l => l.dim !== N.dim), cx, N) : argSec(poss.filter(l => l.dim !== N.dim), cx, N);
  if(!P) return null;
  const neg = N.pol === '+' ? P : N, pos = N.pol === '+' ? N : P;
  return { neg, pos, pool:negs.concat(poss) };
}
function argContr(modo){
  return cx => {
    const par = argParContraste(cx); if(!par) return null;
    const fi = cx.pos ? [par.neg, par.pos] : [par.pos, par.neg];       /* a favor: o defeito abre e a qualidade fecha */
    const [X, Y] = fi, N = `${cx.art} ${cx.n.pt}`;
    let raw, pt;
    if(modo === 'but'){ raw = `The ${cx.noun} was ${argA(X)}, ${J('but')} it was ${argA(Y)}${argFim}`; pt = `${N} era ${argPT(X, cx)}, mas ${cx.ele} era ${argPT(Y, cx)}.`; }
    else if(modo === 'yet'){ raw = `The ${cx.noun} was ${argA(X)}, ${J('yet')} ${argA(Y)}${argFim}`; pt = `${N} era ${argPT(X, cx)}, porém ${argPT(Y, cx)}.`; }
    else { raw = `The ${cx.noun} was ${argA(X)}; ${J('however')}, it was ${argA(Y)}${argFim}`; pt = `${N} era ${argPT(X, cx)}; no entanto, ${cx.ele} era ${argPT(Y, cx)}.`; }
    return argRes(raw, pt, [X, Y], par.pool, 'A ordem decide o peso: o que vem depois da conjunção é o que pesa.');
  };
}
function argContrWhereas(cx){
  const irmaos = NP_SUBS.filter(s => s.en !== cx.noun && argClasse(s.en).k === cx.cl.k);
  if(!irmaos.length) return null;
  const o2 = irmaos[cx.seed % irmaos.length], c2 = argClasse(o2.en), f2 = o2.g;
  const cand = ARG_ANT.map(([p, q]) => [argLex(p), argLex(q)]).filter(([p, q]) =>
    argPool(cx, null).includes(p) && argPool(cx, null).includes(q) && argPool(null, null, o2.en).includes(p) && argPool(null, null, o2.en).includes(q));
  if(!cand.length) return null;
  const par = cand[cx.seed % cand.length], [fav, contra] = par;
  const [X, Y] = cx.pos ? [fav, contra] : [contra, fav];               /* o primeiro objeto leva o lado do tom */
  const pool = cand.map(p => p[0]).concat(cand.map(p => p[1]));
  const art2 = f2 === 'f' ? 'a' : 'o';
  return argRes(`The ${cx.noun} was ${argA(X)}, ${J('whereas')} the ${o2.en} was ${argA(Y)}${argFim}`,
    `${cx.art} ${cx.n.pt} era ${argPT(X, cx)}, enquanto ${art2} ${o2.pt} era ${argPTn(Y, f2)}.`, [X, Y], pool,
    'Aqui o par é da MESMA dimensão — por isso são dois objetos.');
}
/* ===== CONCEDER · obstáculo que não impediu ===== */
function argConc(modo){
  return cx => {
    const pool = argPool(cx, l => argEstrito(l, cx.pos ? '-' : '+')); const A = argPrim(pool, cx); if(!A) return null;
    const dec = argDecEN(cx, cx.pos, argObjEN(cx)), decPT = argDecPT(cx, cx.pos), a = argA(A), ap = argPT(A, cx);
    const R4 = {
      although:  [`${J('Although')} it was ${a}, ${dec}${argFim}`, `Embora ${cx.ele} fosse ${ap}, ${decPT}.`],
      even:      [`${J('Even though')} it was ${a}, ${dec}${argFim}`, `Mesmo sendo ${ap}, ${decPT}.`],
      despite:   [`${J('Despite being')} ${a}, ${dec}${argFim}`, `Apesar de ser ${ap}, ${decPT}.`],
      fim:       [`${dec} ${J('although')} it was ${a}${argFim}`, `${decPT} embora ${cx.ele} fosse ${ap}.`]
    }[modo];
    return argRes(R4[0], R4[1], [A], pool);
  };
}
/* ===== CONCLUIR · grau extremo → consequência ===== */
const argPoolDeg = cx => argPool(cx, l => l.deg && l.dg.includes(cx.cl.k) && argLado(l, cx.tom));
function argConcl0(cx){
  const pool = argPoolDeg(cx); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`The ${cx.noun} was ${J('so')} ${argA(A)} ${J('that')} ${A.deg}${argFim}`,
    `${cx.art} ${cx.n.pt} era tão ${argPT(A, cx)} que ${A.degPT}.`, [A], pool);
}
function argConcl1(cx){
  const pool = argPoolDeg(cx); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`It was ${J('such')} ${npAn(A.en)} ${argA(A)} ${cx.noun} ${J('that')} ${A.deg}${argFim}`,
    `Era ${cx.um} ${cx.n.pt} tão ${argPT(A, cx)} que ${A.degPT}.`, [A], pool);
}
function argConcl2(cx){
  const pool = argPool(cx, l => argLado(l, cx.tom)); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`The ${cx.noun} was ${argA(A)}, ${J('so')} ${argDecEN(cx, cx.pos, 'it')}${argFim}`,
    `${cx.art} ${cx.n.pt} era ${argPT(A, cx)}, então ${argDecPTo(cx, cx.pos)}.`, [A], pool);
}
/* ===== COMPARAR · mesma dimensão, dois objetos ===== */
const argPoolCmp = cx => argPool(cx, l => l.cmp && argLado(l, cx.tom));
function argComp0(cx){
  const pool = argPoolCmp(cx); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`The ${cx.noun} was ${A7(A.tipo, A.cmp)} ${J('than')} the other one${argFim}`,
    `${cx.art} ${cx.n.pt} era ${argCmpPT(A, cx)} do que ${cx.art === 'a' ? 'a' : 'o'} ${cx.outro}.`, [A], pool);
}
function argComp1(cx){
  const pool = argPool(cx, l => argLado(l, cx.tom) && l.cmp); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`The ${cx.noun} was ${J('as')} ${argA(A)} ${J('as')} the other one${argFim}`,
    `${cx.art} ${cx.n.pt} era tão ${argPT(A, cx)} quanto ${cx.art === 'a' ? 'a' : 'o'} ${cx.outro}.`, [A], pool);
}
function argComp2(cx){
  const pool = argPoolCmp(cx); const A = argPrim(pool, cx); if(!A) return null;
  const sup = argSup(A.cmp), ptSup = A.cmpPT.startsWith('=')
    ? `${cx.art} ${A.cmpPT.slice(1)} ${cx.n.pt}` : `${cx.art} ${cx.n.pt} ${argCmpPT(A, cx)}`;
  return argRes(`It was the ${A7(A.tipo, sup)} ${cx.noun} ${J('in')} ${cx.cl.cena[0].slice(3)}${argFim}`,
    `Era ${ptSup} ${cx.cl.cena[1]}.`, [A], pool);
}
function argComp3(cx){
  const pool = argPoolCmp(cx).filter(l => l.pol !== '±'); const A = argPrim(pool, cx); if(!A) return null;
  const mm = cx.pos ? ['more', 'mais'] : ['less', 'menos'];
  return argRes(`${J('The')} ${A7(A.tipo, A.cmp)} it was, ${J('the')} ${mm[0]} I wanted it${argFim}`,
    `Quanto ${argCmpPT(A, cx)} ${cx.ele} era, ${mm[1]} eu ${cx.o} queria.`, [A], pool, 'Aqui só entram adjetivos de lado claro: ＋ aumenta o desejo, − o reduz.');
}
/* ===== CONDICIONAR · o adjetivo como gatilho ===== */
function argCond0(cx){
  const pool = argPool(cx, l => argLado(l, cx.tom)); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`${J('If')} the ${cx.noun} is ${argA(A)}, ${argFutEN(cx, cx.pos)}${argFim}`,
    `Se ${cx.art} ${cx.n.pt} for ${argPT(A, cx)}, ${argFutPT(cx, cx.pos)}.`, [A], pool);
}
function argCond1(cx){
  const pool = argPool(cx, l => argEstrito(l, '+')); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`I won't ${cx.V.b} the ${cx.noun} ${J('unless')} it is ${argA(A)}${argFim}`,
    `Eu não vou ${cx.V.ptb} ${argObjPT(cx)} a menos que ${cx.ele} seja ${argPT(A, cx)}.`, [A], pool,
    'Unless só aceita condição ＋: equivale a “if … not”.');
}
function argCond2(cx){
  const pool = argPool(cx, l => l.pol === '-' || l.pol === '±'); const A = argPrim(pool, cx); if(!A) return null;
  return argRes(`${J('If')} the ${cx.noun} is ${J('too')} ${argA(A)}, I won't ${cx.V.b} it${argFim}`,
    `Se ${cx.art} ${cx.n.pt} for ${argPT(A, cx)} demais, eu não vou ${cx.V.ptb.slice(0, -2)}á-l${cx.o}.`, [A], pool,
    'Too marca o limite do tolerável: só adjetivos − ou ± entram.');
}
/* ===== ACUMULAR · soma do mesmo lado ===== */
function argAcum(modo){
  return cx => {
    const pool = argPool(cx, l => argEstrito(l, cx.tom)); const A = argPrim(pool, cx); if(!A) return null;
    const B = argSec(pool.filter(l => l.dim !== A.dim), cx, A); if(!B) return null;
    const a = argA(A), b = argA(B), ap = argPT(A, cx), bp = argPT(B, cx), N = `${cx.art} ${cx.n.pt}`;
    const R3 = {
      and:  [`The ${cx.noun} was ${a} ${J('and')} ${b}${argFim}`, `${N} era ${ap} e ${bp}.`],
      only: [`The ${cx.noun} was ${J('not only')} ${a} ${J('but also')} ${b}${argFim}`, `${N} não era só ${ap}, mas também ${bp}.`],
      besi: [`${J('Besides being')} ${a}, the ${cx.noun} was ${b}${argFim}`, `Além de ser ${ap}, ${cx.art} ${cx.n.pt} era ${bp}.`]
    }[modo];
    return argRes(R3[0], R3[1], [A, B], pool);
  };
}

/* ---------- 3. As intenções: teoria, conectivos e variantes ---------- */
const ARG_INT = [
  { id:'justificar', nome:'Justificar', rel:'causa → decisão', q:'por quê?',
    resumo:'A razão sustenta a decisão: os dois no mesmo lado.',
    regra:'Razão ＋ sustenta decisão ＋; razão − sustenta decisão −. Cruzar os lados pede uma história por trás.',
    conj:[['because', 'porque', 'a razão vem depois da decisão; é a conjunção padrão'],
          ['because of', 'por causa de', 'só com substantivo: because of the price'],
          ['for', 'pois', 'literário; evite na fala']],
    teoria:[
      'Justificar é ligar uma decisão a uma razão avaliativa. O adjetivo é a razão mais econômica que existe: uma palavra só (<i>cheap</i>) já carrega o motivo inteiro, e o ouvinte reconstrói a lógica sozinho.',
      'A regra de coerência é o <b>alinhamento de polaridade</b>. Razão ＋ sustenta decisão ＋ (<i>I bought it because it was cheap</i>); razão − sustenta decisão − (<i>I didn’t buy it because it was expensive</i>). Quando você cruza os lados (<i>I bought it because it was expensive</i>), o ouvinte entende que há uma história escondida: vira ironia ou exige explicação. Os adjetivos ± aceitam os dois lados porque dependem do objetivo de quem fala.',
      'Em inglês, <i>because</i> abre uma oração completa (sujeito + verbo): <i>because it was cheap</i>, nunca <i>because cheap</i>. Em português o imperfeito “era” descreve a qualidade; o “foi” soaria como um evento (“porque foi caro” = o preço aconteceu). Em inglês basta <i>was</i>.'],
    cuidado:['<i>Because of</i> pede substantivo: <i>because of the price</i> ✓ · <i>because of it was expensive</i> ✗.',
             'Na escrita formal, abrir a frase com <i>Because</i> ainda é visto como informal: prefira <i>Since</i> ou <i>As</i> (veja Explicar).'],
    vars:[{ n:'uma razão', fn:argJust0 }, { n:'duas razões', fn:argJust1 }] },

  { id:'explicar', nome:'Explicar', rel:'razão já conhecida → decisão', q:'o que explica?',
    resumo:'A razão vem primeiro, como pano de fundo; a novidade é a decisão.',
    regra:'Mesma coerência de Justificar; muda o foco: a razão abre a frase, e a decisão fecha.',
    conj:[['since', 'já que', 'a razão já é sabida pelo ouvinte'],
          ['as', 'como', 'neutra, um pouco mais formal'],
          ['the reason … was that', 'o motivo … era que', 'didática: a razão vira o sujeito da frase']],
    teoria:[
      'Explicar e justificar usam as mesmas peças; muda o foco. Em <i>I bought it because…</i> a novidade é a razão, e ela fica no fim da frase, onde o inglês coloca o que é novo. Em <i>Since it was cheap, I bought it</i> a razão vem primeiro porque é algo que o ouvinte já aceita; a novidade passa a ser a decisão.',
      '<i>Since</i> e <i>as</i>, quando abrem a frase, pedem vírgula antes da decisão. Atenção: <i>as</i> também significa “enquanto” (<i>as I walked</i>) e <i>since</i> também significa “desde” (<i>since 2020</i>); é o adjetivo avaliativo que desfaz a ambiguidade em favor da causa.',
      '<i>The reason … was that</i> é a forma de quem vai analisar: transforma a razão num substantivo-sujeito. Soa de relatório e de entrevista (<i>The reason I left was that it was too noisy</i>).'],
    cuidado:['Depois de <i>the reason</i> use <i>that</i>: <i>The reason is because…</i> é comum na fala, mas marcado como erro em provas e textos formais.',
             'Não duplique a conjunção: <i>Since because…</i> ✗.'],
    vars:[{ n:'since', fn:argExp('Since', 'Já que') }, { n:'as', fn:argExp('As', 'Como') }, { n:'the reason… was that', fn:argExp2 }] },

  { id:'contrastar', nome:'Contrastar', rel:'expectativa × realidade', q:'mas…?',
    resumo:'Duas avaliações de lados opostos, em dimensões diferentes.',
    regra:'Lados opostos e dimensões diferentes (idade × conforto). Na mesma dimensão só com dois objetos: whereas.',
    conj:[['but', 'mas', 'neutra, serve em qualquer registro'],
          ['yet', 'porém, contudo', 'formal; admite cortar o “it was” repetido'],
          ['however', 'no entanto', 'advérbio: precisa de ponto e vírgula antes e vírgula depois'],
          ['whereas / while', 'enquanto, ao passo que', 'compara dois objetos na mesma dimensão']],
    teoria:[
      'Contrastar é opor duas avaliações. Para o contraste fazer sentido, as duas precisam estar em <b>dimensões diferentes</b> (idade × conforto, preço × aparência). Na mesma dimensão (<i>cheap but expensive</i>) o que há é contradição; só existe contraste quando os dois adjetivos descrevem objetos diferentes, e é aí que entra <i>whereas</i>.',
      'A <b>ordem manda na conclusão</b>. O inglês, como o português, faz o peso cair sobre o que vem depois do <i>but</i>: <i>old but comfortable</i> defende o sofá; <i>comfortable but old</i> o ataca. O seletor “a favor / contra” do topo da seção inverte justamente isso: a favor, o defeito vem primeiro e a qualidade fecha; contra, o contrário.',
      '<i>But</i> é neutra. <i>Yet</i> é mais literária e admite cortar o sujeito e o verbo repetidos (<i>old, yet comfortable</i>). <i>However</i> é advérbio, não conjunção: precisa de ponto e vírgula (ou ponto) antes e vírgula depois. Trocar o ponto e vírgula por vírgula é o erro clássico de <i>comma splice</i>.'],
    cuidado:['<i>…was old, however it was…</i> ✗ → <i>…was old; however, it was…</i> ✓.',
             'Não empilhe conectivos de contraste: <i>but … however</i> ✗.'],
    vars:[{ n:'but', fn:argContr('but') }, { n:'yet', fn:argContr('yet') }, { n:'however', fn:argContr('however') }, { n:'whereas', fn:argContrWhereas }] },

  { id:'conceder', nome:'Conceder', rel:'obstáculo que não impediu', q:'apesar de quê?',
    resumo:'O adjetivo empurra para um lado; a decisão vai para o outro.',
    regra:'Adjetivo e decisão em lados opostos: − com decisão ＋ (“although it was expensive, I bought it”) ou ＋ com decisão −.',
    conj:[['although', 'embora (+ subjuntivo)', 'a mais usada; abre oração completa'],
          ['even though', 'mesmo sendo', 'enfática e factual: o obstáculo é real'],
          ['despite / in spite of', 'apesar de (+ infinitivo)', 'pede substantivo ou -ing, nunca oração'],
          ['though', 'embora', 'informal; pode ir no fim da frase']],
    teoria:[
      'Conceder é admitir um obstáculo e agir contra ele. Estruturalmente é o espelho da justificativa: lá a razão empurra a decisão; aqui o adjetivo empurra para um lado e a decisão vai para o outro. Por isso a regra de polaridade se inverte: adjetivo − com decisão ＋ (<i>Although it was expensive, I bought it</i>) ou adjetivo ＋ com decisão − (<i>Although it was beautiful, I didn’t buy it</i>).',
      '<i>Although</i> e <i>even though</i> abrem uma oração completa; <i>even though</i> é a versão enfática e factual (não confunda com <i>even if</i>, que é hipotético). <i>Despite</i> e <i>in spite of</i> pedem substantivo ou verbo-ing: <i>despite being expensive</i>, <i>despite the price</i>, nunca <i>despite it was</i>. Em português, <i>embora</i> pede subjuntivo (“embora fosse caro”), enquanto <i>apesar de</i> pede infinitivo (“apesar de ser caro”).',
      'A concessiva pode abrir ou fechar a frase. Abrindo, leva vírgula; fechando, não leva (<i>I bought the sofa although it was expensive</i>). Fechando, soa menos formal e mais como uma confissão — útil na fala.'],
    cuidado:['<i>Although … but</i> ✗: a conjunção concessiva já faz o trabalho do <i>but</i>.',
             '<i>Despite of</i> ✗ → <i>despite</i> (ou <i>in spite of</i>).'],
    vars:[{ n:'although', fn:argConc('although') }, { n:'even though', fn:argConc('even') }, { n:'despite being', fn:argConc('despite') }, { n:'although no fim', fn:argConc('fim') }] },

  { id:'concluir', nome:'Concluir', rel:'grau extremo → consequência', q:'e daí?',
    resumo:'A qualidade levada ao extremo produz um resultado.',
    regra:'Só adjetivos graduáveis entram em “so … that”; já o “so” solto liga qualidade e decisão do mesmo lado.',
    conj:[['so … that', 'tão … que', 'adjetivo (ou advérbio) em grau extremo'],
          ['such a … that', 'um … tão … que', 'adjetivo + substantivo'],
          ['so', 'então, por isso', 'conclusão simples, sem exagero']],
    teoria:[
      'Concluir é mostrar a consequência de uma qualidade levada ao extremo. O adjetivo é o motor: quanto maior o grau, mais forte a consequência — e por isso só adjetivos <b>graduáveis</b> entram em <i>so … that</i> (<i>so heavy</i>, <i>so cheap</i>). <i>So wooden</i> ou <i>so Italian</i> não fazem sentido, o que reforça a divisão entre adjetivos que avaliam e adjetivos que descrevem.',
      'A regra é uma só: <i>so</i> + adjetivo; <i>such</i> + (a/an) + adjetivo + substantivo. <i>The sofa was so heavy that…</i> equivale a <i>It was such a heavy sofa that…</i>. O <i>that</i> pode cair na fala (<i>so heavy I couldn’t lift it</i>), mas na escrita mantenha-o.',
      '<i>So</i> solto, entre duas orações, é a conclusão sem exagero: <i>The sofa was cheap, so I bought it</i>. Aqui a polaridade volta a valer: qualidade e decisão apontam para o mesmo lado. Não confunda <i>so</i> (conclusão) com <i>so … that</i> (grau) nem com <i>so as to</i> (finalidade).'],
    cuidado:['<i>so</i> + substantivo ✗: <i>so a heavy sofa</i> → <i>such a heavy sofa</i>.',
             '<i>so … that</i> pede a consequência real (<i>that I couldn’t lift it</i>), não uma opinião (<i>that it was bad</i>).'],
    vars:[{ n:'so … that', fn:argConcl0 }, { n:'such a … that', fn:argConcl1 }, { n:'so (conclusão)', fn:argConcl2 }] },

  { id:'comparar', nome:'Comparar', rel:'mesma dimensão, dois objetos', q:'comparado a quê?',
    resumo:'O adjetivo dá o eixo; o grau dá a posição no eixo.',
    regra:'Mesma dimensão dos dois lados (preço com preço). Comparativo pede than; igualdade pede as … as.',
    conj:[['-er / more … than', 'mais … (do) que', 'adjetivo curto em -er, longo com more'],
          ['as … as', 'tão … quanto', 'igualdade; o adjetivo fica no grau normal'],
          ['the -est / the most … in', 'o mais … de/da', 'superlativo: pede the e um grupo'],
          ['the …er …, the more …', 'quanto mais …, mais …', 'proporcional: um grau sobe e o outro acompanha']],
    teoria:[
      'Comparar exige a mesma <b>dimensão</b> nos dois lados: preço com preço, tamanho com tamanho. O adjetivo fornece o eixo; o grau fornece a posição no eixo. Em inglês o grau se marca de duas formas: <i>-er/-est</i> nos adjetivos curtos (<i>cheap → cheaper → the cheapest</i>) e <i>more/most</i> nos longos (<i>expensive → more expensive → the most expensive</i>). Os terminados em <i>-y</i> trocam o y por i (<i>pretty → prettier</i>).',
      '<i>As … as</i> expressa igualdade; o negativo (<i>not as … as</i>) é uma superioridade disfarçada: <i>not as comfortable as</i> = <i>less comfortable than</i>. <i>Than</i> só entra com comparativo; <i>as … as</i> só com o adjetivo no grau normal — misturar (<i>as cheaper as</i>) é erro comum.',
      'A proporcional (<i>the cheaper…, the more…</i>) liga dois graus: quando um sobe, o outro acompanha. Leva <i>the</i> nas duas metades e é a forma mais argumentativa de todas, porque fala de causa e efeito em gradiente. Em português: “quanto mais…, mais…”.'],
    cuidado:['<i>more cheaper</i> ✗ — ou <i>-er</i> ou <i>more</i>, nunca os dois.',
             'Superlativo com lugar pede <i>in</i> (<i>in the shop</i>); com conjunto pede <i>of</i> (<i>of all</i>).'],
    vars:[{ n:'comparativo', fn:argComp0 }, { n:'igualdade', fn:argComp1 }, { n:'superlativo', fn:argComp2 }, { n:'proporcional', fn:argComp3 }] },

  { id:'condicionar', nome:'Condicionar', rel:'o adjetivo como gatilho', q:'e se…?',
    resumo:'Se a qualidade aparecer, a decisão acontece.',
    regra:'Adjetivo ＋ abre a porta; − a fecha. “Too” marca o limite; “unless” só aceita condição ＋.',
    conj:[['if', 'se (+ subjuntivo)', 'condição aberta: presente no if, will na decisão'],
          ['unless', 'a menos que', 'equivale a “if … not”'],
          ['too + adjetivo', 'adjetivo + demais', 'passou do limite tolerável']],
    teoria:[
      'Condicionar faz do adjetivo um interruptor: se a qualidade aparecer, a decisão acontece. Adjetivo ＋ abre a porta (<i>If it’s cheap, I’ll buy it</i>); adjetivo − a fecha (<i>If it’s too expensive, I won’t buy it</i>). É a estrutura da negociação, da compra e do planejamento.',
      'Em inglês, a condição de futuro leva <b>presente</b> no <i>if</i> e <i>will</i> na decisão: <i>If it is cheap, I will buy it</i> — nunca <i>If it will be</i>. O português usa o futuro do subjuntivo na condição (“se for barato”). <i>Unless</i> equivale a <i>if … not</i>: <i>I won’t buy it unless it is cheap</i> = <i>if it isn’t cheap, I won’t buy it</i>. Use <i>unless</i> só com condição positiva; o duplo negativo (<i>unless … not</i>) é erro.',
      '<i>Too</i> marca o limite aceitável: <i>too expensive</i> não é só “caro”, é “caro além do tolerável”. Por isso combina com adjetivos − ou ±, e com resultado negativo; com adjetivo ＋ ele vira ironia. Compare <i>enough</i> (<i>cheap enough</i> = barato o bastante), que mede o mínimo exigido.'],
    cuidado:['<i>If it will be cheap</i> ✗ → <i>If it is cheap</i> ✓.',
             '<i>unless … not</i> ✗ (<i>I won’t buy it unless it isn’t…</i>).'],
    vars:[{ n:'if', fn:argCond0 }, { n:'unless', fn:argCond1 }, { n:'if … too', fn:argCond2 }] },

  { id:'acumular', nome:'Acumular', rel:'soma do mesmo lado', q:'e ainda por cima?',
    resumo:'Razões empilhadas do mesmo lado: o que as torna fortes é a dimensão.',
    regra:'Mesmo lado, dimensões diferentes. Duas da mesma dimensão são redundância, não argumento.',
    conj:[['and', 'e', 'soma neutra'],
          ['not only … but also', 'não só … mas também', 'a segunda qualidade é a surpresa'],
          ['besides being', 'além de ser', 'a primeira vira pano de fundo; o sujeito seguinte é o mesmo']],
    teoria:[
      'Acumular é empilhar razões do mesmo lado. O que torna o empilhamento forte é a <b>dimensão</b>: dois adjetivos da mesma dimensão (<i>cheap and affordable</i>) são redundância; de dimensões diferentes (<i>cheap and comfortable</i>) são dois argumentos.',
      '<i>And</i> é a soma neutra. <i>Not only … but also</i> inverte a ênfase: a primeira qualidade vira ponto de partida e a segunda é a surpresa. <i>Besides being</i> tira a primeira qualidade do centro e a deixa como pano de fundo; o sujeito da oração seguinte precisa ser o mesmo de <i>being</i>: <i>Besides being cheap, the sofa was comfortable</i> ✓ — <i>Besides being cheap, I loved it</i> ✗ (quem é barato?).',
      'Quando os adjetivos vêm antes do substantivo e são do mesmo tipo (duas opiniões), separam-se por vírgula ou <i>and</i> (<i>a cheap, comfortable sofa</i>); de tipos diferentes, ficam na ordem fixa, sem vírgula (<i>a comfortable old sofa</i>). Depois do verbo, o <i>and</i> é obrigatório antes do último.'],
    cuidado:['<i>Not only … but also</i> pede estrutura paralela: adjetivo com adjetivo, nunca adjetivo com verbo.',
             'Em listas de três ou mais: <i>cheap, comfortable and sturdy</i>.'],
    vars:[{ n:'and', fn:argAcum('and') }, { n:'not only … but also', fn:argAcum('only') }, { n:'besides being', fn:argAcum('besi') }] }
];

/* estado da seção: substantivo, tom (+ a favor · - contra), semente / variante / adjetivo escolhido por intenção */
const ARG = { noun:'sofa', tom:'+', seed:{}, vari:{}, pick:{} };
ARG_INT.forEach(i => { ARG.seed[i.id] = 0; ARG.vari[i.id] = 0; ARG.pick[i.id] = null; });
/* gera a frase de uma intenção no estado atual (ou num estado dado, para o teste) */
function argGera(id, est){
  const e = est || ARG, it = ARG_INT.find(x => x.id === id); if(!it) return null;
  const v = it.vars[(e.vari[id] || 0) % it.vars.length];
  const cx = argCtx(e.noun, e.tom, e.seed[id] || 0, e.pick[id] || null);
  const r = v.fn(cx);
  return r ? Object.assign(r, { cx, texto:stripMarks(r.raw) }) : null;
}

/* ---------- 4. Teoria geral (seção) e do OSASCOMP (combinações) ---------- */
const ARG_TEORIA_GERAL = [
  'Um adjetivo faz duas coisas bem diferentes. Forma, cor, origem, material e propósito <b>descrevem</b>: dizem o que a coisa é e nada mais (<i>red</i> não é elogio nem crítica). Já a opinião, boa parte do tamanho e do peso e a idade/estado <b>avaliam</b>: <i>comfortable</i>, <i>heavy</i>, <i>outdated</i> dizem se a coisa serve. É nessa segunda família que mora o argumento, porque só quem avalia pode justificar uma decisão ou contrariar uma expectativa.',
  'Toda avaliação tem <b>polaridade</b>: a favor (＋), contra (−) ou contextual (±). <i>Cheap</i> é ＋ para quem compra e − para quem vende; <i>big</i> é ＋ numa casa e − numa mochila. Por isso o app marca os ± à parte: eles assumem o lado que a frase pede. As subcategorias do Glossário trazem essa marca, e a tabela abaixo mostra como cada intenção a usa.',
  'Além da polaridade, cada adjetivo avalia uma <b>dimensão</b>: preço, aparência, conforto, qualidade, tamanho, peso, idade, fama, ambiente ou caráter. A dimensão é o que separa um contraste de uma contradição: <i>old but comfortable</i> opõe duas dimensões (idade × conforto) e faz sentido; <i>cheap but expensive</i> tenta dizer o oposto na mesma e só funciona com dois objetos (<i>whereas</i>).',
  'Antes do substantivo (<i>a comfortable sofa</i>) o adjetivo <b>identifica</b>; depois do verbo (<i>the sofa was comfortable</i>) ele <b>afirma</b>. Argumentar quase sempre exige a posição predicativa; por isso os exemplos usam <i>it was …</i>. O botão <b>montar ↑</b> leva o mesmo adjetivo para o outro papel, dentro dos 8 encaixes do objeto. Em português, a qualidade pede o imperfeito (“era barato”); o “foi” soaria como um acontecimento.'
];
const ARG_TABELA = [
  ['Justificar', 'razão e decisão do mesmo lado', '＋/＋ ou −/−', 'because'],
  ['Explicar', 'igual, mas a razão abre a frase', '＋/＋ ou −/−', 'since · as'],
  ['Contrastar', 'lados opostos, dimensões diferentes', '− … ＋', 'but · yet · however · whereas'],
  ['Conceder', 'adjetivo contra a decisão', '− … ＋ (ou o inverso)', 'although · even though · despite'],
  ['Concluir', 'qualidade extrema → resultado', 'adjetivo graduável', 'so … that · such … that · so'],
  ['Comparar', 'mesma dimensão, dois objetos', 'mesmo lado', '-er than · as … as · the -est'],
  ['Condicionar', 'o adjetivo liga ou desliga a decisão', '＋ abre · − fecha', 'if · unless · too'],
  ['Acumular', 'razões somadas', 'mesmo lado, dimensões diferentes', 'and · not only … but also · besides']
];
const ARG_TEORIA_OSASCOMP = [
  'Por que existe uma ordem? A explicação mais aceita é a da <b>inerência</b>: quanto mais um adjetivo faz parte da identidade do objeto, mais perto do substantivo ele fica. A opinião é a mais subjetiva (varia de quem fala) e vai mais longe; o propósito é o mais definidor (<i>dining table</i> é um tipo de mesa) e fica colado. No meio, os fatos objetivos vão do que muda mais fácil (tamanho, idade) ao que muda menos (cor, origem, material).',
  'Na fala real quase ninguém passa de <b>três</b> adjetivos seguidos: a fila completa de oito existe como teoria e como treino. Escolha dois ou três tipos e coloque-os na ordem; as combinações abaixo mostram quais pares costumam andar juntos.',
  'Sobre vírgulas: adjetivos de <b>tipos diferentes</b> não levam vírgula (<i>a lovely small old white house</i>); dois do <b>mesmo tipo</b> levam vírgula ou <i>and</i> (<i>a lovely, comfortable house</i>). Quanto ao artigo, <i>a/an</i> segue o som da próxima palavra: <i>an old</i>, <i>a unique</i>, <i>an hour</i>.',
  'Em português o adjetivo costuma vir depois do substantivo e não há uma fila rígida; por isso o app traduz mantendo só o que o português pede (opinião antes: “um belo carro”; propósito e material colados: “uma mesa de jantar de madeira”). É essa diferença que faz o brasileiro errar: copiar a posição do português (<i>a car big</i>).'
];
const ARG_TEORIA_O2 = [
  'Uma segunda oração existe para dizer <b>por que</b>, <b>apesar de quê</b>, <b>o que acontece se</b> ou <b>para quê</b>. A conjunção escolhe a relação; o conteúdo vem do verbo e dos adjetivos. Por isso a mesma frase principal muda de sentido só com a troca do conectivo: <i>I bought it because it was cheap</i> × <i>although it was cheap</i>.',
  'Há dois mecanismos. Na <b>coordenação</b> (<i>and, but, so, or</i>) as orações são independentes e mantêm a ordem. Na <b>subordinação</b> (<i>because, although, if, when, that…</i>) a segunda depende da principal e pode abrir a frase; nesse caso, vírgula antes da principal. Os conectivos de uma mesma relação não são intercambiáveis: variam em registro (<i>but</i> × <i>yet</i>), em posição (<i>however</i> exige ponto e vírgula) e em estrutura (<i>despite</i> pede -ing ou substantivo, <i>although</i> pede oração).',
  'Com adjetivos, a coerência é de <b>polaridade</b>: justificar e concluir alinham os lados; contrastar e conceder os opõem; comparar mantém a mesma dimensão. A seção <i>Argumentar com adjetivos</i>, na Anatomia da frase, treina exatamente isso, com cartões por intenção.'
];
const ARG_REL = [
  ['causa', 'por quê?', 'because · since · as'], ['consequência', 'e daí?', 'so · so … that'], ['oposição', 'mas?', 'but · yet · however · whereas'],
  ['concessão', 'apesar de?', 'although · even though · despite'], ['condição', 'e se?', 'if · unless'], ['finalidade', 'para quê?', 'to · so that · in order to'],
  ['tempo', 'quando?', 'when · while · after · before'], ['comparação', 'como?', 'than · as … as · the more … the more'], ['adição', 'e mais?', 'and · also · besides']
];

/* ================================================================================
   v179 · O MESMO MODELO NA 2ª ORAÇÃO DO CONSOLE (e do montador)
   --------------------------------------------------------------------------------
   Em vez de reescrever o motor da 2ª oração, o app ganha um PREDICADO ADJETIVAL: a 2ª oração vira
   "it was + adjetivo", retomando o objeto da 1ª ("I bought the sofa because it was cheap"). Só entram
   adjetivos coerentes com a polaridade da principal, pela regra da relação:
     alinhado  (a) → razão do mesmo lado da decisão: because · since · as · for · and · if · as long as …
     oposto    (o) → adjetivo do lado contrário: but · yet · although · even though · despite · unless
   A polaridade da principal vem do verbo (buy = ＋; sell = −, pois vender é o lado contrário de ficar) e do
   formato (afirmativa mantém, negativa inverte). O objeto vem do montador (soquete do substantivo) ou de uma
   colocação concreta do console ("a gift", "the bus", "a car"…). Funções puras; o encaixe no motor está em pm-06.
   ================================================================================ */
const ARG_O2_VERBOS = { buy:1, purchase:1, rent:1, take:1, ride:1, borrow:1, 'try-on':1, 'put-on':1, wear:1, carry:1,
  keep:1, visit:1, like:1, recommend:1, see:1, sell:-1 };
const ARG_O2_REGRA = {
  caus:{ because:'a', since:'a', as:'a', 'given that':'a' },
  expl:{ for:'a' },
  adit:{ and:'a', 'and also':'a', plus:'a' },
  adv: { but:'o', yet:'o' },
  conc:{ although:'o', though:'o', 'even though':'o', 'even if':'o', despite:'o', 'in spite of':'o' },
  cond:{ if:'a', unless:'o', 'as long as':'a', 'provided that':'a', 'so long as':'a' }
};
const argO2Regra = (k, conjEn) => (ARG_O2_REGRA[k] || {})[conjEn] || null;
/* ＋ ou − : a polaridade da DECISÃO da principal */
const argO2Tom = (verbId, formato) => ((formato === 'afirmativa' ? 1 : -1) * (ARG_O2_VERBOS[verbId] || 1)) > 0 ? '+' : '-';
/* "a new phone" → { noun:'phone', excl:['new'] } (só objeto concreto singular que o app conhece) */
function argNomeDeColocacao(en){
  const w = (en || '').toLowerCase().replace(/[^a-z\s-]/g, '').trim().split(/\s+/);
  if(w.length < 2 || !/^(a|an|the|this|that|my|your)$/.test(w[0])) return null;
  const n = npSub(w[w.length - 1]);
  return n ? { noun:n.en, excl:w.slice(1, -1) } : null;
}
/* adjetivos válidos para o objeto, na regra pedida, já intercalados por dimensão (as 4 primeiras opções variam) */
function argAdjOpcoes(noun, regra, tom, excl){
  const lado = regra === 'a' ? tom : (tom === '+' ? '-' : '+');
  const pool = argPool(null, l => argEstrito(l, lado) && !(excl || []).includes(l.en), noun);
  const por = {}; pool.forEach(l => { (por[l.dim] = por[l.dim] || []).push(l); });
  const dims = Object.keys(por), out = [];
  for(let i = 0; out.length < pool.length; i++) dims.forEach(d => { if(por[d][i]) out.push(por[d][i]); });
  return out.slice(0, 30);
}
/* a 2ª oração em si: { en (marcado), pt }. past = tempo da principal é passado (senão presente) */
function argO2Cl(k, cEn, cPt, A, g, past){
  const be = past ? 'was' : 'is', ele = g === 'f' ? 'ela' : 'ele', adjPT = g === 'f' ? A.pf : A.pm, a = A7(A.tipo, A.en);
  if(k === 'conc' && (cEn === 'despite' || cEn === 'in spite of')) return { en:J(cEn) + ' being ' + a, pt:cPt + ' de ser ' + adjPT };
  const sujEN = 'it ' + M(be) + ' ' + a;
  if(k === 'conc') return { en:J(cEn) + ' ' + sujEN, pt:cPt + ' ' + ele + ' ' + (past ? 'fosse' : 'seja') + ' ' + adjPT };
  if(k === 'cond') return { en:J(cEn) + ' it ' + M('is') + ' ' + a, pt:cPt + ' ' + ele + ' ' + (cEn === 'if' ? 'for' : 'seja') + ' ' + adjPT };
  return { en:J(cEn) + ' ' + sujEN, pt:cPt + ' ' + ele + ' ' + (past ? 'era' : 'é') + ' ' + adjPT };
}
