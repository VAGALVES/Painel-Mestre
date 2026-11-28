/* ================================================================================
   v181 · VS LAB — glossário de expressões com explicação conceitual e exemplos aplicados
   --------------------------------------------------------------------------------
   Cinco seções, cada uma num arquivo de dados próprio (data-vslab-*.js → window.VSLAB_D):
     significa (expressões idiomáticas) · phrasal (phrasal verbs) · comodiz (como se diz) · diferenca (pares confundíveis) · estruturas.
   Os itens são conteúdo ORIGINAL; "l" aponta para o post de origem da lista (índice de títulos mantido fora do repositório).
   Interface: abas por seção, busca, "modo cartão" (esconde a tradução até tocar) e marca de "estudado" (localStorage).
   ================================================================================ */
const VSL_SECOES = [
  ['significa', '💬', 'O que significa', 'Expressões idiomáticas: o que querem dizer e quando usar.'],
  ['phrasal', '🔀', 'Phrasal verbs', 'Verbo + partícula: sentidos, separabilidade e registro.'],
  ['comodiz', '🗣️', 'Como se diz', 'Do português para o inglês: a(s) forma(s) natural(is) de dizer.'],
  ['diferenca', '⚖️', 'Qual a diferença', 'Pares e trios que se confundem: como escolher.'],
  ['estruturas', '🧱', 'Estruturas', 'Padrões de frase: a fórmula, o uso e as armadilhas.']
];
/* total de posts de cada seção no site de origem (índices coletados à parte, fora do repositório) — alimenta o rodapé de progresso */
const VSL_TOTAL = { significa:1297, phrasal:1055, comodiz:758, diferenca:327, estruturas:98 };
const VSL = { aba:'significa', busca:'', cartao:false, pend:false, ok:{}, cat:{}, lim:60, intro:{} };
const VSL_PAG = 60;   /* cartões por vez: 1.297 <details> de uma só vez pesam no celular e na TV */
try { VSL.ok = JSON.parse(localStorage.getItem('pm_vslab_ok') || '{}') || {}; VSL.cartao = localStorage.getItem('pm_vslab_card') === '1'; VSL.intro = JSON.parse(localStorage.getItem('pm_vslab_intro') || '{}') || {}; } catch(e){ VSL.ok = {}; VSL.intro = {}; }
const vslSalva = () => { try { localStorage.setItem('pm_vslab_ok', JSON.stringify(VSL.ok)); localStorage.setItem('pm_vslab_card', VSL.cartao ? '1' : '0'); localStorage.setItem('pm_vslab_intro', JSON.stringify(VSL.intro)); } catch(e){} };
const vslId = (aba, t) => aba + ':' + t;
/* texto sem acento e minúsculo — busca em PT e EN */
const vslNorm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
/* ---- v201: SUBCATEGORIAS (cada item entra em UM grupo; regras por palavra-chave, sem editar os dados) ----
   Significa e Como se diz compartilham 11 temas; Phrasal verbs agrupam pela partícula; Qual a diferença pelo tipo de confusão;
   Estruturas pela área da gramática. Cada grupo: [id, emoji, nome, cor, o que reúne, regra]. Ganha o primeiro grupo cuja regra casar;
   o último é sempre "Outros". As regras olham o texto sem acento. */
const VSL_RE = s => new RegExp('(^|[^a-z])(' + s + ')', 'i');
/* palavras inteiras (com fim de palavra) + radicais (início de palavra) */
const VSL_RE2 = (inteiras, radicais) => new RegExp('(^|[^a-z])((' + inteiras + ')(?![a-z])|(' + radicais + '))', 'i');
const VSL_TEMAS = [
  ['emo', '🙂', 'Emoções e humor', 'var(--rose)', 'Alegria, tristeza, raiva, medo, ânimo e estado de espírito.',
    VSL_RE('feliz|felicidade|alegr|trist|raiva|irrit|furios|medo|ansios|nervos|anim|desanim|chatea|decepc|saudade|orgulh|vergonha|constrang|surpres|choc|susto|calm|estress|aflit|angusti|desesper|sofr|chor|rir|riso|gargalh|empolg|entusias|amar|odi|adorar|paix|sentir-se|sentimento|humor|nas nuvens|de saco cheio|farto|cansad|exaust')],
  ['trab', '💼', 'Trabalho e dinheiro', 'var(--brass)', 'Emprego, negócios, dinheiro, preço, gasto e lucro.',
    VSL_RE('trabalh|emprego|chefe|carreira|salario|dinheiro|caro|barato|pagar|pagamento|conta|gast|lucr|negocio|empresa|falenc|investi|compra|vend|preco|custo|orcament|economi|riqueza|rico|pobre|fortuna|expediente|demiss|contrat|reuniao|escritorio|cliente|mercado|financ')],
  ['rel', '🤝', 'Relações e pessoas', 'var(--blue)', 'Amizade, amor, família, confiança, conflito e convivência.',
    VSL_RE('amig|amizade|amor|namor|casar|casamento|famil|pai |mae|filho|irmao|confian|confiar|trair|traicao|briga|brigar|discuti|paz|perdoar|rancor|apoi|ajudar|ajuda|favor|convid|visita|encontro|conhecer|sintonia|afinidade|inimig|rival|colega|vizinh|companhia|solidao|sozinho|conversa|bater papo|conquistar|paquera|cantada')],
  ['tempo', '⏱️', 'Tempo e urgência', 'var(--amber)', 'Pressa, prazo, momento certo, frequência e duração.',
    VSL_RE2('cedo|tarde|agora|nunca|sempre|logo|dia|dias|noite|hora|horas|semana|ano|anos|mes|meses|vez|vezes|antes|depois|durante|enquanto|desde|momento|futuro|passado|hoje|ontem|amanha','tempo|rapid|pressa|apress|imediat|prazo|antigamente|ultimamente|recente|madrug|de repente|em breve|por enquanto|adiar|demor|a qualquer momento|ultima hora|as vezes|de vez em')],
  ['exito', '🎯', 'Sucesso, esforço e fracasso', 'var(--teal)', 'Tentar, conseguir, vencer, desistir, facilidade e dificuldade.',
    VSL_RE('sucesso|fracass|desist|esforc|vencer|vitoria|derrot|conseguir|tentar|tentativa|facil|dificil|moleza|acertar|errar|erro|falhar|falha|dar certo|dar errado|superar|alcancar|cumprir|realizar|empenh|dedic|resist|aguentar|persist|insistir|melhorar|piorar|evoluir|progres|perder|ganhar|lucrar|prosperar')],
  ['com', '🗣️', 'Comunicação e opinião', 'var(--conj)', 'Falar, contar, opinar, concordar, criticar, elogiar e mentir.',
    VSL_RE('fal|dizer|diz |contar|conta |opini|segredo|concord|discord|elogi|critic|reclam|explic|mentir|mentira|boato|fofoca|palavra|conversa|perguntar|pergunta|responder|resposta|avis|alert|sugerir|propor|dica|recado|indireta|piada|brincad|zoar|provoc|xing|gritar|sussurr|cochich|comentar|sincer|franc|rodeio|ponto de vista|na minha opiniao')],
  ['risco', '⚠️', 'Risco, sorte e problemas', 'var(--red)', 'Perigo, azar, encrenca, crise e situações difíceis.',
    VSL_RE('risc|sorte|azar|perig|problema|encrenca|aperto|apuro|crise|ruim|pior|desastre|catastrofe|enrasc|maus lencois|sem saida|beco|ameac|ferrad|frito|arruin|estrag|quebr|acident|doente|doenca|morrer|morte|matar|punic|castig|culpa|vulner|exposto|inevitavel|pagar o pato|furada')],
  ['saber', '🧠', 'Conhecimento e atenção', 'var(--violet)', 'Saber, aprender, lembrar, esquecer, notar e prestar atenção.',
    VSL_RE('saber|sabe|aprender|aprend|lembrar|lembranca|esquecer|memoria|atencao|atento|notar|perceber|reparar|ignorar|descobrir|cuidado|pensar|pensamento|ideia|entender|compreend|enganar|engano|confus|duvid|certeza|evidente|obvio|claro|inteligente|esperto|burro|ingenuo|consciente|ciente|cabeca|mente|raciocin|decidir|decisao|escolher|escolha|planejar|plano')],
  ['acao', '🏃', 'Ação e movimento', 'var(--lime)', 'Ir, vir, sair, começar, parar, voltar e mudar de rumo.',
    VSL_RE('ir |ir$|vir|partir|sair|chegar|correr|mover|mudar|mudanca|comecar|iniciar|parar|terminar|encerrar|voltar|retornar|seguir|caminh|andar|viajar|entrar|dormir|acordar|levantar|sentar|cair|subir|descer|pular|fugir|escapar|aproximar|afastar|passar|atravessar|empurrar|puxar|pegar|soltar|jogar|dar uma volta|passeio|estrada|virar')],
  ['carat', '🧍', 'Caráter e comportamento', 'var(--orange)', 'Jeito de ser: teimoso, honesto, preguiçoso, mandão, gentil…',
    VSL_RE('teimos|humilde|orgulhos|honest|esperto|preguic|gentil|mandao|covarde|corajos|ousad|vaidos|convencid|arrogan|egoista|generos|sovina|pao-duro|ingenu|astuto|sabichao|fanfarr|exibid|metido|chato|safado|cara de pau|atrevid|comportament|atitude|postura|jeito|personalidade|educad|grosseir|rude|simpatic|antipatic|lealdade|leal|sincero|falso|hipocrit|serio|brincalhao|reservado|extrovertid|timid|tranquil|sensato|prudente|imprudent|criativ|original|tradicion|conservador|inquiet|persistente|paciente|impaciente')],
  ['grau', '📏', 'Grau, quantidade e estado', 'var(--burnt-yellow)', 'Muito, pouco, exato, em geral, quase, completo, aproximado.',
    VSL_RE2('muito|pouco|demais|exato|geral|quase|total|inteiro|todo|tudo|nada|alguns|varios|cada|metade|nenhum|qualquer|mesmo|igual|diferente|novo|velho|antigo|cheio|vazio|grande|pequeno|longe|perto|fundo|raso|alto|baixo|zero|limite|maximo|minimo','bastante|exatamente|maioria|aproximad|estimativa|cerca de|em torno|extrem|absolut|completamente|totalmente|completo|perfeit|impecavel|otimo|excelente|excess|exager|parecid|semelhan')],
  ['outros', '🧩', 'Outros', 'var(--paper-dim)', 'Expressões que não se encaixam bem em um tema.', null]
];
/* Phrasal verbs: grupo = primeira partícula depois do verbo */
const VSL_PART = {
  up:['⬆️','UP','var(--teal)','Subir, aumentar, completar, aproximar.'], down:['⬇️','DOWN','var(--blue)','Descer, reduzir, parar, anotar.'],
  out:['↗️','OUT','var(--amber)','Sair, distribuir, esgotar, resolver.'], off:['⏏️','OFF','var(--red)','Desligar, partir, cancelar, afastar.'],
  on:['🔛','ON','var(--lime)','Continuar, ligar, vestir, depender.'], in:['⤵️','IN','var(--violet)','Entrar, incluir, ceder, participar.'],
  over:['🔁','OVER','var(--rose)','Passar por cima, repetir, terminar, transferir.'], away:['🚶','AWAY','var(--orange)','Afastar, fugir, guardar, eliminar.'],
  back:['↩️','BACK','var(--brass)','Voltar, devolver, retribuir, recuar.'], around:['🔄','AROUND / ABOUT','var(--conj)','Em volta, sem rumo, por aí, circular.'],
  through:['🕳️','THROUGH','var(--burnt-yellow)','Atravessar, completar, examinar a fundo.'], with:['🤝','WITH / FOR / TO','var(--teal)','Companhia, finalidade, direção, lidar com.']
};
const VSL_PART_MAP = { about:'around', round:'around', for:'with', to:'with', at:'with', into:'in', onto:'on', by:'with', across:'through', along:'with', apart:'away', ahead:'up', aside:'away', forward:'up', behind:'back', after:'with', from:'off', against:'with', under:'down', together:'in', alongside:'with', beyond:'over', toward:'with', towards:'with' };
/* Qual a diferença: tipo de confusão */
const VSL_DIF = [
  ['graf', '🔤', 'Grafia e som parecidos', 'var(--violet)', 'Palavras quase iguais na escrita ou no som: weather/whether, feel/fell.'],
  ['gram', '🔗', 'Palavras gramaticais', 'var(--blue)', 'Preposições, conectores, artigos, pronomes e advérbios de função.'],
  ['verb', '🏃', 'Verbos', 'var(--teal)', 'Verbos que se confundem: bring/take, wait/expect/hope.'],
  ['voc', '🏷️', 'Vocabulário geral', 'var(--brass)', 'Substantivos, adjetivos e advérbios: professor/teacher, sensible/sensitive.']
];
const VSL_FUNC = /^(a|an|the|in|on|at|by|for|from|of|off|to|up|with|since|during|while|until|till|as|so|too|also|either|neither|both|each|every|all|some|any|much|many|few|little|less|more|most|other|another|else|if|unless|than|then|that|this|these|those|who|whom|whose|which|what|when|where|why|how|whether|although|though|however|but|and|or|nor|yet|still|already|just|ever|never|ago|before|after|about|above|below|over|under|between|among|through|across|into|onto|within|without|beside|besides|except|instead|rather|quite|enough|very|really|almost|nearly|hardly|barely|none|no|not|its|it's|their|there|they're|your|you're|whose|who's)$/i;
/* Estruturas: área da gramática */
const VSL_EST = [
  ['modal', '🎛️', 'Modais e padrões verbais', 'var(--amber)', 'May, might, must, would rather, can\'t seem to, stand to…',
    VSL_RE('modal|may|might|must|should|would|could|can\'?t|cannot|shall|ought|had better|rather|seem to|stand to|used to|be able|have to|need to|supposed|going to|about to|bound to')],
  ['tempo', '🕰️', 'Tempos e aspectos', 'var(--teal)', 'Presente, passado, futuro, perfeito e contínuo.',
    VSL_RE('present|past|future|perfeit|continu|simples|tempo|pretérito|preterito|will|going|already|yet|just|since|for \\+')],
  ['perg', '❓', 'Perguntas e negação', 'var(--conj)', 'Do/does/did, question words, tags e respostas curtas.',
    VSL_RE('pergunt|question|do e does|do/does|did|why|what|where|when|who|how|negativ|nao|not|tag|resposta|short answer')],
  ['conec', '🔗', 'Conectores e orações', 'var(--blue)', 'Conjunções, relativas, condicionais e discurso indireto.',
    VSL_RE('conjun|conector|oracao|clause|relativ|condicional|conditional|if|unless|wish|because|since|although|though|while|whereas|so that|in order|indireto|reported|passiv')],
  ['det', '📦', 'Substantivos, determinantes e pronomes', 'var(--rose)', 'Artigos, quantificadores, possessivos, plural e pronomes.',
    VSL_RE('artigo|article|pronom|pronoun|possessiv|quantific|some|any|much|many|few|little|plural|contavel|incontavel|determin|demonstrativ|this|that|these|those|substantiv|noun')],
  ['adj', '📐', 'Adjetivos, advérbios e comparações', 'var(--lime)', 'Graus, ordem, posição e intensidade.',
    VSL_RE('adjetiv|adverb|compar|superlativ|than|as \\+|too|enough|very|ordem|posicao|intens|grau|quite|rather')],
  ['prep', '🧭', 'Preposições e expressões fixas', 'var(--brass)', 'In, on, at, e frases feitas de uso comum.',
    VSL_RE('prepos|preposition|in \\(|on \\(|at \\(| in | on | at |estacao|mes |dia |semana|hora|data|numero|horario')],
  ['outros', '🧩', 'Outros padrões', 'var(--paper-dim)', 'Padrões que não se encaixam bem em uma área.', null]
];
/* devolve [id, emoji, nome, cor, descrição] do grupo de um item */
function vslClasse(aba, it){
  if(aba === 'significa' || aba === 'comodiz'){
    /* 1ª passada só no título curto em português (mais preciso); 2ª com a resposta rápida e o rótulo do 1º sentido */
    const curto = vslNorm(aba === 'comodiz' ? it.t : it.p), longo = vslNorm((aba === 'comodiz' ? it.t : it.p) + ' ' + it.r + ' ' + (it.s && it.s[0] ? it.s[0].k : ''));
    for(const txt of [curto, longo]) for(const g of VSL_TEMAS){ if(g[5] && g[5].test(txt)) return g; }
    return VSL_TEMAS[VSL_TEMAS.length - 1];
  }
  if(aba === 'phrasal'){
    const ws = it.t.toLowerCase().split(/\s+/).slice(1);
    let part = null;
    for(const w of ws){ const k = VSL_PART_MAP[w] || w; if(VSL_PART[k]){ part = k; break; } }
    if(!part) return ['outras', '🧩', 'Outras formas', 'var(--paper-dim)', 'Verbos com outra estrutura (ex.: com objeto fixo).'];
    const p = VSL_PART[part]; return [part, p[0], p[1], p[2], p[3]];
  }
  if(aba === 'diferenca'){
    const alts = it.t.split('/').map(s => s.trim().toLowerCase()).filter(Boolean);
    const lev = (a, b) => { const m = a.length, n = b.length, d = Array.from({ length:m + 1 }, (_, i) => [i]); for(let j = 1; j <= n; j++) d[0][j] = j;
      for(let i = 1; i <= m; i++) for(let j = 1; j <= n; j++) d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)); return d[m][n]; };
    const palavras = alts.map(a => a.replace(/\s+/g, ''));
    let perto = false; for(let i = 0; i < palavras.length; i++) for(let j = i + 1; j < palavras.length; j++) if(lev(palavras[i], palavras[j]) <= 2 && Math.min(palavras[i].length, palavras[j].length) >= 3) perto = true;
    if(perto) return VSL_DIF[0];
    if(alts.some(a => a.split(/\s+/).some(w => VSL_FUNC.test(w)))) return VSL_DIF[1];
    const pt = vslNorm((it.p || '').split(/[×;]/)[0]).trim();
    if(/^[a-z-]+(ar|er|ir|or)(-se)?( [a-z]+)?$/.test(pt) && !/\s(de|do|da|o|a)\s/.test(pt)) return VSL_DIF[2];
    return VSL_DIF[3];
  }
  const txt = vslNorm(it.t + ' ' + it.p + ' ' + (it.f || ''));
  for(const g of VSL_EST){ if(!g[5] || g[5].test(txt)) return g; }
  return VSL_EST[VSL_EST.length - 1];
}
/* a classificação é calculada uma vez por item */
const VSL_CACHE = {};
const vslCls = (aba, it) => { const k = aba + '|' + it.t; return VSL_CACHE[k] || (VSL_CACHE[k] = vslClasse(aba, it)); };
/* explicação recolhida de cada seção (o app lembra se você a abriu) */
const VSL_INTRO = {
  significa: ['Uma expressão idiomática tem sentido que não sai da soma das palavras: <i>kick the bucket</i> não fala de balde. Cada cartão traz a <b>resposta rápida</b>, os sentidos com exemplos e o registro (formal, informal, gíria).',
    ['Abra um cartão por vez: leia a resposta rápida, depois ouça os exemplos no 🔊.', 'Use o <b>modo cartão</b> para esconder a tradução e tentar entender o inglês antes de tocar.', 'Filtre por <b>tema</b> para estudar por assunto (emoções, trabalho, tempo…); marque <b>estudado</b> para acompanhar o progresso.']],
  phrasal: ['Phrasal verbs combinam verbo + partícula e quase sempre mudam o sentido do verbo. Aqui eles estão agrupados pela <b>partícula</b> (up, out, off…), que carrega uma ideia recorrente: <i>up</i> = completar ou aumentar; <i>off</i> = separar ou encerrar.',
    ['Estude uma partícula por vez: você começa a prever o sentido de verbos novos.', 'Em cada cartão, veja se o verbo é <b>separável</b> (<i>pick it up</i>) ou inseparável e o registro.', 'Marque <b>estudado</b> e use "só pendentes" para ver o que falta em cada grupo.']],
  comodiz: ['O caminho aqui é do português para o inglês: você parte de uma ideia ("tirar o chapéu para alguém") e vê a(s) forma(s) natural(is) de dizer, sem tradução palavra por palavra.',
    ['Leia o título em português e tente dizer em inglês antes de abrir o cartão.', 'Veja quando cada opção é a mais natural (cotidiano, formal, gíria).', 'Filtre por <b>tema</b> para treinar por situação.']],
  diferenca: ['Pares e trios que se confundem — por grafia, som, sentido ou uso. Cada cartão traz a regra de escolha ("como escolher") e exemplos que mostram a diferença.',
    ['Comece por <b>grafia e som parecidos</b>: são os erros de escrita mais comuns.', 'Leia o "como escolher" e confira nos exemplos antes de marcar estudado.', 'Use a busca em inglês ou português para achar o par que está te confundindo.']],
  estruturas: ['Padrões de frase: a <b>fórmula</b>, quando usar e as armadilhas. São poucos itens, mas cada um destrava muitas frases.',
    ['Leia a fórmula primeiro e só depois os exemplos.', 'Repare no "cuidado": são os erros típicos de quem pensa em português.', 'Os grupos seguem a gramática do app: modais, tempos, perguntas, conectores, determinantes, adjetivos e preposições.']]
};
const VSL_AVISO = 'Os temas são agrupados automaticamente por palavras-chave: cada item cai em um só tema, e alguns podem ficar num grupo discutível.';
function vslCard(aba, it){
  const id = vslId(aba, it.t), feito = !!VSL.ok[id];
  const sent = it.s.map(s => `<div class="vl-sent"><div class="vl-k">${escapeHTML(s.k)}</div><p class="vl-e">${escapeHTML(s.e)}</p>` +
    s.x.map(x => `<div class="vl-ex"><div class="vl-en"><button type="button" class="audio-btn sm" data-text="${escapeHTML(x[0])}" data-lang="${ENG_LANG[ENG]}" aria-label="Ouvir">🔊</button><span>${escapeHTML(x[0])}</span></div><div class="vl-pt">${escapeHTML(x[1])}</div></div>`).join('') + `</div>`).join('');
  const rel = (it.v || []).map(v => `<span class="vl-rel">${escapeHTML(v)}</span>`).join('');
  const g = vslCls(aba, it);
  return `<details class="vl-card" data-id="${escapeHTML(id)}" style="--vc:${g[3]}"${feito ? ' data-ok="1"' : ''}>
    <summary><span class="vl-t"><span class="vl-tag" title="${escapeHTML(g[2])}">${g[1]}</span>${escapeHTML(it.t)}</span><span class="vl-p">${escapeHTML(it.p)}</span><span class="vl-v" aria-hidden="true">${feito ? '✓' : ''}</span></summary>
    <div class="vl-body">
      <div class="vl-rapida"><b>Resposta rápida</b> ${escapeHTML(it.r)}</div>
      ${it.f ? `<div class="vl-forma"><b>Estrutura</b> <code>${escapeHTML(it.f)}</code></div>` : ''}
      ${sent}
      ${it.cmp ? `<div class="vl-nota"><b>Como escolher</b> ${escapeHTML(it.cmp)}</div>` : ''}
      ${it.u ? `<div class="vl-nota"><b>Uso e registro</b> ${escapeHTML(it.u)}</div>` : ''}
      ${it.c ? `<div class="vl-cuid"><b>Cuidado</b> ${escapeHTML(it.c)}</div>` : ''}
      ${rel ? `<div class="vl-relw"><b>Relacionadas</b> ${rel}</div>` : ''}
      <div class="vl-foot"><button type="button" class="chip vl-done" data-id="${escapeHTML(id)}">${feito ? '✓ estudado' : 'marcar como estudado'}</button>${it.l ? ` <a class="vl-src" href="${escapeHTML(it.l)}" target="_blank" rel="noopener noreferrer">post de origem ↗</a>` : ''}</div>
    </div></details>`;
}
function vslRender(){
  const w = document.getElementById('vslabWrap'); if(!w) return;
  const D = window.VSLAB_D || {}, q = vslNorm(VSL.busca).trim();
  const tabs = VSL_SECOES.map(s => { const n = (D[s[0]] || []).length, f = (D[s[0]] || []).filter(i => VSL.ok[vslId(s[0], i.t)]).length;
    return `<button type="button" class="chip vl-tab${VSL.aba === s[0] ? ' on' : ''}" data-aba="${s[0]}">${s[1]} ${s[2]} <i>${f}/${n}</i></button>`; }).join('');
  const sec = VSL_SECOES.find(s => s[0] === VSL.aba) || VSL_SECOES[0], lista = D[sec[0]] || [];
  /* grupos da seção, na ordem de aparição das regras, com total e estudados */
  const grupos = new Map();
  lista.forEach(i => { const g = vslCls(sec[0], i); const e = grupos.get(g[0]) || { g, n:0, f:0 }; e.n++; if(VSL.ok[vslId(sec[0], i.t)]) e.f++; grupos.set(g[0], e); });
  const ordem = [...grupos.values()].sort((x, y) => (x.g[0] === 'outros' || x.g[0] === 'outras') - (y.g[0] === 'outros' || y.g[0] === 'outras') || y.n - x.n);
  const catSel = VSL.cat[sec[0]] && grupos.has(VSL.cat[sec[0]]) ? VSL.cat[sec[0]] : null;
  const totF = lista.filter(i => VSL.ok[vslId(sec[0], i.t)]).length;
  const chips = `<button type="button" class="chip vl-cat${catSel ? '' : ' on'}" data-cat="" style="--vc:var(--brass)">Todos <i>${totF}/${lista.length}</i></button>` +
    ordem.map(e => `<button type="button" class="chip vl-cat${catSel === e.g[0] ? ' on' : ''}" data-cat="${e.g[0]}" style="--vc:${e.g[3]}" title="${escapeHTML(e.g[4])}"><span class="vl-dot"></span>${e.g[1]} ${escapeHTML(e.g[2])} <i>${e.f}/${e.n}</i></button>`).join('');
  const gsel = catSel ? grupos.get(catSel).g : null;
  const vis = lista.filter(i => (!catSel || vslCls(sec[0], i)[0] === catSel) && (!VSL.pend || !VSL.ok[vslId(sec[0], i.t)]) && (!q || vslNorm([i.t, i.p, i.r, ...(i.s || []).flatMap(s => [s.k, s.e, ...s.x.flat()])].join(' ')).includes(q)));
  const mostra = vis.slice(0, VSL.lim);
  const intro = VSL_INTRO[sec[0]], aberta = VSL.intro[sec[0]] === true;
  w.innerHTML = `<div class="vl-tabs">${tabs}</div>
    <details class="vl-intro"${aberta ? ' open' : ''} data-aba="${sec[0]}"><summary><span class="si-o">ℹ️ ${sec[3]}</span><span class="si-k">como usar</span></summary>
      <div class="si-c"><p>${intro[0]}</p><ul>${intro[1].map(x => `<li>${x}</li>`).join('')}</ul><p class="vl-aviso">${VSL_AVISO}</p></div></details>
    <div class="vl-cats" role="group" aria-label="Subcategorias">${chips}</div>
    ${gsel ? `<div class="vl-gdesc" style="--vc:${gsel[3]}"><b>${gsel[1]} ${escapeHTML(gsel[2])}</b> — ${escapeHTML(gsel[4])}</div>` : ''}
    <div class="vl-tools"><input type="search" id="vslBusca" class="vl-busca" placeholder="buscar (inglês ou português)…" value="${escapeHTML(VSL.busca)}" autocomplete="off" autocapitalize="none" spellcheck="false">
      <button type="button" class="chip${VSL.cartao ? ' on' : ''}" id="vslCartao" aria-pressed="${VSL.cartao}" title="Esconde a tradução dos exemplos até você tocar">modo cartão</button>
      <button type="button" class="chip${VSL.pend ? ' on' : ''}" id="vslPend" aria-pressed="${VSL.pend}" title="Mostra só o que ainda não foi marcado como estudado">só pendentes</button>
      <span class="vl-cnt">${mostra.length} de ${vis.length}${vis.length !== lista.length ? ' (total ' + lista.length + ')' : ''}</span></div>
    <div class="vl-list${VSL.cartao ? ' vl-cartao' : ''}">${mostra.map(i => vslCard(sec[0], i)).join('') || '<div class="vl-vazio">Nada encontrado.</div>'}</div>
    ${vis.length > mostra.length ? `<button type="button" class="chip vl-mais" id="vslMais">mostrar mais ${Math.min(VSL_PAG, vis.length - mostra.length)} <i>(faltam ${vis.length - mostra.length})</i></button>` : ''}
    <div class="vl-rod">Cobertura: ${VSL_SECOES.map(x => x[2] + ' ' + (D[x[0]] || []).length + '/' + VSL_TOTAL[x[0]]).join(' · ')}. Textos e exemplos próprios; o link leva ao post original.</div>`;
  w.querySelectorAll('.vl-tab').forEach(b => { b.onclick = () => { VSL.aba = b.dataset.aba; VSL.lim = VSL_PAG; vslRender(); }; });
  w.querySelectorAll('.vl-cat').forEach(b => { b.onclick = () => { VSL.cat[sec[0]] = b.dataset.cat || null; VSL.lim = VSL_PAG; vslRender(); }; });
  /* o chip escolhido fica visível na fileira que rola */
  const on = w.querySelector('.vl-cat.on'); if(on && on.parentNode) on.parentNode.scrollLeft = Math.max(0, on.offsetLeft - 12);
  const di = w.querySelector('.vl-intro'); if(di) di.addEventListener('toggle', () => { VSL.intro[di.dataset.aba] = di.open; vslSalva(); });
  const mais = document.getElementById('vslMais'); if(mais) mais.onclick = () => { VSL.lim += VSL_PAG; vslRender(); };
  const bu = document.getElementById('vslBusca');
  bu.oninput = () => { VSL.busca = bu.value; VSL.lim = VSL_PAG; const pos = bu.selectionStart; vslRender(); const nb = document.getElementById('vslBusca'); nb.focus(); try { nb.setSelectionRange(pos, pos); } catch(e){} };
  document.getElementById('vslCartao').onclick = () => { VSL.cartao = !VSL.cartao; vslSalva(); vslRender(); };
  document.getElementById('vslPend').onclick = () => { VSL.pend = !VSL.pend; VSL.lim = VSL_PAG; vslRender(); };
  w.querySelectorAll('.vl-done').forEach(b => { b.onclick = e => { e.stopPropagation(); const id = b.dataset.id; if(VSL.ok[id]) delete VSL.ok[id]; else VSL.ok[id] = 1; vslSalva();
    const d = b.closest('details'), aberto = d && d.open; vslRender(); if(aberto){ const n = w.querySelector('details.vl-card[data-id="' + id.replace(/"/g, '\\"') + '"]'); if(n) n.open = true; } }; });
  /* modo cartão: a tradução aparece ao tocar na linha do exemplo */
  w.querySelectorAll('.vl-ex').forEach(x => { x.onclick = e => { if(e.target.closest('.audio-btn')) return; x.classList.toggle('vl-mostra'); }; });
}
