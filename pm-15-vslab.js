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
const VSL = { aba:'significa', busca:'', cartao:false, pend:false, ok:{} };
try { VSL.ok = JSON.parse(localStorage.getItem('pm_vslab_ok') || '{}') || {}; VSL.cartao = localStorage.getItem('pm_vslab_card') === '1'; } catch(e){ VSL.ok = {}; }
const vslSalva = () => { try { localStorage.setItem('pm_vslab_ok', JSON.stringify(VSL.ok)); localStorage.setItem('pm_vslab_card', VSL.cartao ? '1' : '0'); } catch(e){} };
const vslId = (aba, t) => aba + ':' + t;
/* texto sem acento e minúsculo — busca em PT e EN */
const vslNorm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function vslCard(aba, it){
  const id = vslId(aba, it.t), feito = !!VSL.ok[id];
  const sent = it.s.map(s => `<div class="vl-sent"><div class="vl-k">${escapeHTML(s.k)}</div><p class="vl-e">${escapeHTML(s.e)}</p>` +
    s.x.map(x => `<div class="vl-ex"><div class="vl-en"><button type="button" class="audio-btn sm" data-text="${escapeHTML(x[0])}" data-lang="${ENG_LANG[ENG]}" aria-label="Ouvir">🔊</button><span>${escapeHTML(x[0])}</span></div><div class="vl-pt">${escapeHTML(x[1])}</div></div>`).join('') + `</div>`).join('');
  const rel = (it.v || []).map(v => `<span class="vl-rel">${escapeHTML(v)}</span>`).join('');
  return `<details class="vl-card" data-id="${escapeHTML(id)}"${feito ? ' data-ok="1"' : ''}>
    <summary><span class="vl-t">${escapeHTML(it.t)}</span><span class="vl-p">${escapeHTML(it.p)}</span><span class="vl-v" aria-hidden="true">${feito ? '✓' : ''}</span></summary>
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
  const vis = lista.filter(i => (!VSL.pend || !VSL.ok[vslId(sec[0], i.t)]) && (!q || vslNorm([i.t, i.p, i.r, ...(i.s || []).flatMap(s => [s.k, s.e, ...s.x.flat()])].join(' ')).includes(q)));
  w.innerHTML = `<div class="vl-tabs">${tabs}</div>
    <div class="vl-desc">${sec[3]} <span class="vl-cnt">${vis.length} de ${lista.length}</span></div>
    <div class="vl-tools"><input type="search" id="vslBusca" class="vl-busca" placeholder="buscar (inglês ou português)…" value="${escapeHTML(VSL.busca)}" autocomplete="off" autocapitalize="none" spellcheck="false">
      <button type="button" class="chip${VSL.cartao ? ' on' : ''}" id="vslCartao" aria-pressed="${VSL.cartao}" title="Esconde a tradução dos exemplos até você tocar">modo cartão</button>
      <button type="button" class="chip${VSL.pend ? ' on' : ''}" id="vslPend" aria-pressed="${VSL.pend}" title="Mostra só o que ainda não foi marcado como estudado">só pendentes</button></div>
    <div class="vl-list${VSL.cartao ? ' vl-cartao' : ''}">${vis.map(i => vslCard(sec[0], i)).join('') || '<div class="vl-vazio">Nada encontrado.</div>'}</div>
    <div class="vl-rod">Cobertura: ${VSL_SECOES.map(x => x[2] + ' ' + (D[x[0]] || []).length + '/' + VSL_TOTAL[x[0]]).join(' · ')}. Textos e exemplos próprios; o link leva ao post original.</div>`;
  w.querySelectorAll('.vl-tab').forEach(b => { b.onclick = () => { VSL.aba = b.dataset.aba; vslRender(); }; });
  const bu = document.getElementById('vslBusca');
  bu.oninput = () => { VSL.busca = bu.value; const pos = bu.selectionStart; vslRender(); const nb = document.getElementById('vslBusca'); nb.focus(); try { nb.setSelectionRange(pos, pos); } catch(e){} };
  document.getElementById('vslCartao').onclick = () => { VSL.cartao = !VSL.cartao; vslSalva(); vslRender(); };
  document.getElementById('vslPend').onclick = () => { VSL.pend = !VSL.pend; vslRender(); };
  w.querySelectorAll('.vl-done').forEach(b => { b.onclick = e => { e.stopPropagation(); const id = b.dataset.id; if(VSL.ok[id]) delete VSL.ok[id]; else VSL.ok[id] = 1; vslSalva();
    const d = b.closest('details'), aberto = d && d.open; vslRender(); if(aberto){ const n = w.querySelector('details[data-id="' + id.replace(/"/g, '\\"') + '"]'); if(n) n.open = true; } }; });
  /* modo cartão: a tradução aparece ao tocar na linha do exemplo */
  w.querySelectorAll('.vl-ex').forEach(x => { x.onclick = e => { if(e.target.closest('.audio-btn')) return; x.classList.toggle('vl-mostra'); }; });
}
