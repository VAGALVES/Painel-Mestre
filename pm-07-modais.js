/* ---- Motor de modais v2: gerador real (função × pronome × tempo × formato × sinal),
   com a mesma marcação de cor por morfema do console principal. O trecho modal
   (can/might/have to/should/used to...) é o marcador colorido por formato; sujeito e
   raiz do verbo ficam neutros; a palavra-sinal da função entra em roxo no fim. ---- */
const PT_PODER = { presente:{"1s":"posso","3s":"pode","1p":"podemos","3p":"podem"}, imperf:{"1s":"podia","3s":"podia","1p":"podíamos","3p":"podiam"} };
const PT_CONSEGUIR = { presente:{"1s":"consigo","3s":"consegue","1p":"conseguimos","3p":"conseguem"}, imperf:{"1s":"conseguia","3s":"conseguia","1p":"conseguíamos","3p":"conseguiam"} };
const PT_TER_PRET = {"1s":"tive","3s":"teve","1p":"tivemos","3p":"tiveram"};
const PT_DEVER_COND = {"1s":"deveria","3s":"deveria","1p":"deveríamos","3p":"deveriam"};
const PT_COSTUMAR_IMPERF = {"1s":"costumava","3s":"costumava","1p":"costumávamos","3p":"costumavam"};

const MODAL_SIGNALS = {
  capacidade: ["easily","without help","by myself","all by myself","with practice","if necessary","all the time","as always","by heart","out loud","from memory","on my own","without a doubt","little by little","about half the time","a bit","quite a bit"],
  possibilidade: ["tomorrow","tonight","at any moment","all of a sudden","in theory","this weekend","once again","by chance","out of nowhere","at some point","without warning","over the phone","about now","about twice"],
  obrigacao: ["by law","before Friday","no matter what","right away","every day","all week long","on time","every single day","as agreed","in advance","at once","from now on","on schedule"],
  permissao: ["here","after class","on weekends","at weekends","all weekend","in this building","during the break","this time","as needed","in person","at any time","over the weekend","around here"],
  conselho: ["more often","as soon as possible","before it gets worse","at least once","all year round","from time to time","as usual","in advance","for sure","at least","step by step","once and for all","a little","a bit longer"],
  habito: ["when I was young","every summer","all summer long","back then","as a child","in those days","all the time","every single day","for fun","out of habit","off and on","on my own","back in the day","once in a while"]
};

/* Função de cada sinal modal — o encaixe a que ele pertence na anatomia. A classe lexical
   ("with", "by", "in"…) não diz a função: "without help" é modo, "by law" é modo, "in advance"
   é tempo. O número é o do encaixe interno (1 grau · 2 modo · 4 lugar · 5 periodicidade ·
   6 duração · 7 aproximação · 8 tempo). Nada é inferido: o que não estiver aqui avisa no console. */
const MODAL_SLOT_MAP = {
  "easily":2,"without help":2,"by myself":2,"all by myself":2,"with practice":2,"if necessary":2,"all the time":6,"as always":2,"by heart":2,"out loud":2,"from memory":2,"on my own":2,"without a doubt":2,"little by little":2,"about half the time":5,"a bit":1,"quite a bit":1,
  "tomorrow":8,"tonight":8,"at any moment":8,"all of a sudden":2,"in theory":2,"this weekend":8,"once again":8,"by chance":2,"out of nowhere":2,"at some point":7,"without warning":2,"over the phone":2,"about now":7,"about twice":7,
  "by law":2,"before Friday":8,"no matter what":2,"right away":8,"every day":5,"all week long":6,"on time":8,"every single day":5,"as agreed":2,"in advance":8,"at once":2,"from now on":8,"on schedule":8,
  "here":4,"after class":8,"on weekends":5,"at weekends":5,"all weekend":6,"in this building":4,"during the break":8,"this time":8,"as needed":2,"in person":2,"at any time":8,"over the weekend":8,"around here":4,
  "more often":5,"as soon as possible":8,"before it gets worse":8,"at least once":5,"all year round":6,"from time to time":5,"as usual":2,"for sure":2,"at least":1,"step by step":2,"once and for all":2,"a little":1,"a bit longer":1,
  "when I was young":8,"every summer":5,"all summer long":6,"back then":8,"as a child":8,"in those days":8,"for fun":2,"out of habit":2,"off and on":5,"back in the day":8,"once in a while":5
};
const MODAL_SLOT_CLS = { 1:'bitFam', 2:'mannerFam', 3:'compareFam', 4:'placeFam', 5:'freqDef', 6:'durFam', 7:'aboutFam', 8:'timePoint', 9:'seqFam' };
Object.values(MODAL_SIGNALS).forEach(l => l.forEach(w => { if(!MODAL_SLOT_MAP[w]) console.warn('[modais] sinal sem encaixe definido:', w); }));

/* Corredor do meio nos modais: os advérbios que cabem antes do verbo, por função. A lista é
   curada — "I might probably" ou "I can just have to" não se dizem —, e cada peça vem do
   mesmo banco do console (classe, encaixe e restrição de polaridade já definidos lá). */
const MODAL_MID = {
  capacidade:  ["probably","definitely","certainly","only","also","even","always","usually","often","sometimes","never","still","already","really","completely","barely","hardly","simply"],
  possibilidade:["actually","also","even","only","still","already","sometimes","often","never","really","simply"],
  obrigacao:   ["probably","definitely","certainly","actually","always","usually","often","sometimes","never","still","already","only","also","even","really","simply"],
  permissao:   ["probably","definitely","certainly","always","usually","often","sometimes","never","still","already","only","also","even","really","simply"],
  conselho:    ["probably","definitely","certainly","really","always","usually","never","only","also","even","still","already","simply","completely"],
  habito:      ["probably","definitely","certainly","actually","always","usually","often","sometimes","never","only","also","even","really","simply"]
};
let _midBank = null;
function midBank(){
  if(_midBank) return _midBank;
  _midBank = new Map();
  Object.values(SIGNAL_WORDS).flat().filter(x => x.pl === 'mid').forEach(x=>{
    const a = _midBank.get(x.w) || [];
    if(!a.some(y => y.cls === x.cls && y.only === x.only)) a.push(x);
    _midBank.set(x.w, a);
  });
  return _midBank;
}
/* todas as peças oferecidas na função atual: meio (curado) + fim (MODAL_SIGNALS) */
function modalItens(){
  const f = modalState.funcao, fmt = modalState.formato;
  const fim = MODAL_SIGNALS[f].filter(variantOk).map(w => ({ w, cls: modalSignalFam(w), pl:'end' }));
  const meio = (MODAL_MID[f] || []).map(w => (midBank().get(w) || []).find(e => signalAllowed(e, fmt))).filter(Boolean);
  return meio.concat(fim);
}
function modalSigs(){ return Array.isArray(modalState.signals) ? modalState.signals : []; }
function modalVazios(){
  return (modalState.formato === 'pergunta' && modalState.whWord) ? whVazios(modalState.whWord) : new Set();
}
/* Onde o advérbio de meio entra no modal:
   · afirmativa/negativa: logo depois do 1º auxiliar ("I can always work", "I will often have to work");
   · diante de have to / has to / had to / used to, que se comportam como verbo pleno, ele vem antes
     ("I often have to work", "I never used to work");
   · "might not": depois do not ("I might not always have worked");
   · pergunta: depois do sujeito ("Can you always work?");
   · negativa: certeza e "still" passam à frente do auxiliar ("I probably can't work"). */
const MODAL_CABECA = new Set(['have','has','had','used']);
function modalInserirMeio(text, mids, formato){
  if(!mids.length) return text;
  const isQ = formato === 'pergunta' || formato === 'pergunta_negativa';
  const neg = formato === 'negativa' || formato === 'pergunta_negativa';
  const w = text.split(' ');
  const lista = sortSlots(mids);
  const frente = (neg && !isQ) ? lista.filter(m => m.cls === 'certaintyFam' || m.w === 'still') : [];
  const resto = lista.filter(m => !frente.includes(m));
  frente.forEach((m,i)=> w.splice(1 + i, 0, C(m.w, m.cls)));
  let ponto = isQ ? 2 : (MODAL_CABECA.has(stripMarks(w[1 + frente.length] || '')) ? 1 : 2);
  ponto += frente.length;
  if(neg && !isQ && stripMarks(w[ponto] || '') === 'not') ponto++;
  resto.forEach(m=>{ w.splice(ponto, 0, C(m.w, m.cls)); ponto++; });
  return w.join(' ');
}

function bePastNeg(p){ return (IS_3SG(p)||p==='I') ? "wasn't" : "weren't"; }
function haveToPres(p){ return IS_3SG(p) ? "has to" : "have to"; }

const MODAL_ENGINE = {
  capacidade: { label:"Capacidade", icon:"💪", tempos:[
    { key:"present", label:"Presente",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('can')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("can't")} ${b}`};
        if(f==='pergunta') return {text:`${M('Can')} ${s} ${b}`};
        return {text:`${M("Can't")} ${s} ${b}`};
      }, structure:"Sujeito + can + verbo (forma base)", note:"Capacidade real, no presente.",
      pt:(per,vpt)=>`${PT_CONSEGUIR.presente[per]} ${vpt.inf}` },
    { key:"past", label:"Passado",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('could')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("couldn't")} ${b}`};
        if(f==='pergunta') return {text:`${M('Could')} ${s} ${b}`};
        return {text:`${M("Couldn't")} ${s} ${b}`};
      }, structure:"Sujeito + could + verbo (forma base)", note:"\"Could\" = capacidade geral e contínua no passado. Para uma ocasião específica, o inglês prefere <b>\"was/were able to\"</b>.",
      pt:(per,vpt)=>`${PT_CONSEGUIR.imperf[per]} ${vpt.inf}` },
    { key:"future", label:"Futuro",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('will')} ${M('be able to')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("won't")} ${M('be able to')} ${b}`};
        if(f==='pergunta') return {text:`${M('Will')} ${s} ${M('be able to')} ${b}`};
        return {text:`${M("Won't")} ${s} ${M('be able to')} ${b}`};
      }, structure:"Sujeito + will be able to + verbo", note:"\"Can\" não tem forma de futuro própria — o inglês empresta \"be able to\".",
      pt:(per,vpt)=>`${PT_ESTAR.ir[per]} conseguir ${vpt.inf}` }
  ]},
  possibilidade: { label:"Possibilidade", icon:"🌫️", tempos:[
    { key:"present", label:"Presente / Futuro",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('might')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M('might not')} ${b}`};
        if(f==='pergunta') return {text:`${M('Could')} ${s} ${b}`, extraNote:"Pergunta de possibilidade normalmente usa <b>could</b> — \"Might I...?\" existe, mas é raro e formalíssimo."};
        return {text:`${M("Couldn't")} ${s} ${b}`, extraNote:"Pergunta de possibilidade normalmente usa <b>could</b> — \"Might I...?\" existe, mas é raro e formalíssimo."};
      }, structure:"Sujeito + may/might + verbo (forma base)", note:"\"May\" soa levemente mais provável que \"might\". Em português, a ideia costuma sair como \"pode ser que\" / \"talvez\".",
      pt:(per,vpt)=>`${PT_PODER.presente[per]} ${vpt.inf}` },
    { key:"pastSpec", label:"Passado (especulação)",
      gen:(p,v,f)=>{ const s=subjLower(p), ppM=markedForm(v.base, v.pp)+(v.prt?' '+v.prt:'');
        if(f==='afirmativa') return {text:`${p} ${M('might have')} ${ppM}`};
        if(f==='negativa') return {text:`${p} ${M('might not have')} ${ppM}`};
        if(f==='pergunta') return {text:`${M('Could')} ${s} ${M('have')} ${ppM}`};
        return {text:`${M("Couldn't")} ${s} ${M('have')} ${ppM}`};
      }, structure:"Sujeito + might have + particípio", note:"Modal perfeito — dúvida sobre algo que já aconteceu.",
      pt:(per,vpt)=>`${PT_PODER.presente[per]} ter ${vpt.part}` }
  ]},
  obrigacao: { label:"Obrigação", icon:"📌", alerta:"<b>\"Must not\"</b> = proibição (\"You must not smoke\"). <b>\"Don't have to\"</b> = ausência de obrigação (\"You don't have to come\"). São opostos, não sinônimos.", tempos:[
    { key:"present", label:"Presente",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M(haveToPres(p))} ${b}`, extraNote:"\"Must\" também serve na afirmativa — \"must\" = obrigação que parte do próprio falante; \"have to\" = imposta por regra externa."};
        if(f==='negativa') return {text:`${p} ${M(doPresNeg(p))} ${M('have to')} ${b}`};
        if(f==='pergunta') return {text:`${M(cap(doPres(p)))} ${s} ${M('have to')} ${b}`};
        return {text:`${M(cap(doPresNeg(p)))} ${s} ${M('have to')} ${b}`};
      }, structure:"Sujeito + have/has to + verbo (do-support na negação/pergunta)", note:"",
      pt:(per,vpt)=>`${PT_TER.presente[per]} que ${vpt.inf}` },
    { key:"past", label:"Passado",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('had to')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("didn't")} ${M('have to')} ${b}`};
        if(f==='pergunta') return {text:`${M('Did')} ${s} ${M('have to')} ${b}`};
        return {text:`${M("Didn't")} ${s} ${M('have to')} ${b}`};
      }, structure:"Sujeito + had to + verbo", note:"\"Must\" não tem passado — usa-se sempre \"had to\".",
      pt:(per,vpt)=>`${PT_TER_PRET[per]} que ${vpt.inf}` },
    { key:"future", label:"Futuro",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('will')} ${M('have to')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("won't")} ${M('have to')} ${b}`};
        if(f==='pergunta') return {text:`${M('Will')} ${s} ${M('have to')} ${b}`};
        return {text:`${M("Won't")} ${s} ${M('have to')} ${b}`};
      }, structure:"Sujeito + will have to + verbo", note:"",
      pt:(per,vpt)=>`${PT_ESTAR.ir[per]} ter que ${vpt.inf}` }
  ]},
  permissao: { label:"Permissão", icon:"🔓", tempos:[
    { key:"present", label:"Presente",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('can')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("can't")} ${b}`};
        if(f==='pergunta') return {text:`${M('Can')} ${s} ${b}`, extraNote:"\"<b>May</b> I...?\" é a versão educada/formal; \"<b>Could</b> I...?\" soa mais gentil que \"can\", mesmo falando do presente."};
        return {text:`${M("Can't")} ${s} ${b}`};
      }, structure:"Sujeito + can + verbo (forma base)", note:"\"Can\" para permissão é o uso informal do dia a dia.",
      pt:(per,vpt)=>`${PT_PODER.presente[per]} ${vpt.inf}` },
    { key:"past", label:"Passado",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M(bePast(p))} ${M('allowed to')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M(bePastNeg(p))} ${M('allowed to')} ${b}`};
        if(f==='pergunta') return {text:`${M(cap(bePast(p)))} ${s} ${M('allowed to')} ${b}`};
        return {text:`${M(cap(bePastNeg(p)))} ${s} ${M('allowed to')} ${b}`};
      }, structure:"Sujeito + was/were allowed to + verbo", note:"Permissão concedida (ou não) no passado.",
      pt:(per,vpt)=>`${PT_PODER.imperf[per]} ${vpt.inf}` },
    { key:"future", label:"Futuro",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('will')} ${M('be allowed to')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("won't")} ${M('be allowed to')} ${b}`};
        if(f==='pergunta') return {text:`${M('Will')} ${s} ${M('be allowed to')} ${b}`};
        return {text:`${M("Won't")} ${s} ${M('be allowed to')} ${b}`};
      }, structure:"Sujeito + will be allowed to + verbo", note:"",
      pt:(per,vpt)=>`${PT_ESTAR.ir[per]} poder ${vpt.inf}` }
  ]},
  conselho: { label:"Conselho", icon:"💡", tempos:[
    { key:"present", label:"Presente",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('should')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("shouldn't")} ${b}`};
        if(f==='pergunta') return {text:`${M('Should')} ${s} ${b}`};
        return {text:`${M("Shouldn't")} ${s} ${b}`};
      }, structure:"Sujeito + should + verbo (forma base)", note:"\"Ought to\" é sinônimo mais formal e menos comum na fala.",
      pt:(per,vpt)=>`${PT_DEVER_COND[per]} ${vpt.inf}` },
    { key:"pastCrit", label:"Passado (crítica)",
      gen:(p,v,f)=>{ const s=subjLower(p), ppM=markedForm(v.base, v.pp)+(v.prt?' '+v.prt:'');
        if(f==='afirmativa') return {text:`${p} ${M('should have')} ${ppM}`};
        if(f==='negativa') return {text:`${p} ${M("shouldn't have")} ${ppM}`};
        if(f==='pergunta') return {text:`${M('Should')} ${s} ${M('have')} ${ppM}`};
        return {text:`${M("Shouldn't")} ${s} ${M('have')} ${ppM}`};
      }, structure:"Sujeito + should have + particípio", note:"Conselho tardio — expressa arrependimento ou repreensão sobre algo que já passou.",
      pt:(per,vpt)=>`${PT_DEVER_COND[per]} ter ${vpt.part}` }
  ]},
  habito: { label:"Hábito passado", icon:"🕰️", alerta:"Negativa e pergunta de <b>\"used to\"</b> perdem o \"d\": \"didn't <b>use</b> to\", \"Did you <b>use</b> to...?\" — nunca \"usedn't\".", tempos:[
    { key:"past", label:"Passado",
      gen:(p,v,f)=>{ const b=v.base+(v.prt?' '+v.prt:''), s=subjLower(p);
        if(f==='afirmativa') return {text:`${p} ${M('used to')} ${b}`};
        if(f==='negativa') return {text:`${p} ${M("didn't")} ${M('use to')} ${b}`};
        if(f==='pergunta') return {text:`${M('Did')} ${s} ${M('use to')} ${b}`};
        return {text:`${M("Didn't")} ${s} ${M('use to')} ${b}`};
      }, structure:"Sujeito + used to + verbo (forma base)", note:"Hábito ou estado que não existe mais. \"<b>Would</b>\" também marca hábito passado (\"I would often work late\"), mas só para ações repetidas — nunca para estados.",
      pt:(per,vpt)=>`${PT_COSTUMAR_IMPERF[per]} ${vpt.inf}` }
  ]}
};

let modalState = { funcao:"capacidade", tempo:"present", formato:"afirmativa", pronome:"I", signals:[], signalSlot:null, signalFam:null, signalBusca:'', signalMais:false, whWord:null, o2:null };
/* WH nos modais: as de adjunto (Where/When/Why/How...) usam a pergunta pronta e só
   ganham a palavra na frente — "Should I go?" → "Where should I go?". As de sujeito
   (Who/What) NÃO invertem: o WH ocupa o lugar do sujeito, com o verbo na 3ª pessoa
   ("Who should go?"). How much/How many ficam de fora: dependem do substantivo, não
   do modal. */
const MODAL_WH = WH_ADJUNCT.concat(WH_SUBJECT);   /* v148: só as 8 originais — as novas interrogativas são do motor de tempos */

/* Classificação dos sinais modais por família.
   Em vez de rotular os 77 à mão (e ter que lembrar de atualizar quando um novo entrar),
   a família sai do próprio banco de palavras-sinal: se a expressão já existe lá, herda a
   classe dela; senão, é inferida pela palavra-âncora. O que não se encaixa cai em
   "diversos" — honesto, e evita forçar uma família que não descreve o item. */
const MODAL_FAM_CACHE = {};
const ANCORA_FAM = { bit:'bitFam', little:'bitFam', under:'underFam', through:'throughFam', across:'throughFam', along:'throughFam', within:'withinFam', against:'againstFam', ahead:'aheadFam', behind:'aheadFam', up:'updownFam', down:'updownFam', to:'toFam', of:'ofFam', about:'aboutFam', all:'allFam', at:'atFam', by:'byFam', for:'forFam', from:'fromFam', in:'inFam',
  on:'onFam', over:'overFam', with:'withFam', without:'withFam', around:'aroundFam', back:'backFam',
  once:'onceFam', as:'asFam', every:'everyFam', time:'timeFam', out:'outFam', off:'outFam', whole:'wholeFam' };
function modalSignalFam(w){
  if(MODAL_SLOT_MAP[w]) return MODAL_SLOT_CLS[MODAL_SLOT_MAP[w]];
  if(MODAL_FAM_CACHE[w]) return MODAL_FAM_CACHE[w];
  let cls = null;
  for(const k in SIGNAL_WORDS){
    const hit = SIGNAL_WORDS[k].find(s=>s.w === w);
    if(hit){ cls = hit.cls; break; }
  }
  if(!cls){
    const primeira = w.toLowerCase().split(' ')[0];
    cls = ANCORA_FAM[primeira] || 'outrosFam';
  }
  MODAL_FAM_CACHE[w] = cls;
  return cls;
}
function modalTempoDef(){
  const d = MODAL_ENGINE[modalState.funcao];
  return d.tempos.find(t=>t.key===modalState.tempo) || d.tempos[0];
}
function buildModalGrid(){
  const el = document.getElementById('modalGrid'); el.innerHTML="";
  Object.keys(MODAL_ENGINE).forEach(key=>{
    const d = MODAL_ENGINE[key];
    const btn = document.createElement('div'); btn.className='opt-btn';
    btn.style.setProperty('--accent', 'var(--amber)');
    btn.dataset.active = (modalState.funcao===key);
    btn.innerHTML = `<span class="ic">${d.icon}</span><span>${d.label}</span>`;
    btn.onclick = ()=>{ modalState.funcao=key; if(!MODAL_ENGINE[key].tempos.some(t=>t.key===modalState.tempo)) modalState.tempo = MODAL_ENGINE[key].tempos[0].key; modalState.signals=[]; modalState.signalSlot=null; modalState.signalFam=null; renderModal(); };
    el.appendChild(btn);
  });
}
function buildModalDials(){
  const pr = document.getElementById('modalPronomeRow'); pr.innerHTML="";
  PRONOUNS.forEach(p=>{
    const btn=document.createElement('div'); btn.className='pronome-pill';
    btn.dataset.active=(modalState.pronome===p); btn.textContent=p;
    btn.onclick=()=>{ modalState.pronome=p; renderModal(); };
    pr.appendChild(btn);
  });
  const tr = document.getElementById('modalTempoRow'); tr.innerHTML="";
  MODAL_ENGINE[modalState.funcao].tempos.forEach(t=>{
    const btn=document.createElement('div'); btn.className='pronome-pill';
    btn.dataset.active=(modalState.tempo===t.key); btn.textContent=t.label;
    btn.onclick=()=>{ modalState.tempo=t.key; renderModal(); };
    tr.appendChild(btn);
  });
  const fr = document.getElementById('modalFormatoRow'); fr.innerHTML="";
  FORMATOS.forEach(f=>{
    const s = document.createElement('div'); s.className='formato-switch';
    s.dataset.kind=f; s.dataset.active=(modalState.formato===f);
    s.innerHTML = `<div class="lamp"></div><div class="lbl">${FORMATO_LABEL[f]}</div>`;
    s.onclick = ()=>{ modalState.formato=f; if(f!=='pergunta') modalState.whWord=null; renderModal(); };
    fr.appendChild(s);
  });
  const wr = document.getElementById('modalWhRow'); wr.innerHTML="";
  const whNone = document.createElement('div'); whNone.className='pronome-pill';
  whNone.dataset.active = (modalState.whWord===null); whNone.textContent = "sem WH";
  whNone.onclick = ()=>{ modalState.whWord=null; renderModal(); };
  wr.appendChild(whNone);
  MODAL_WH.forEach(w=>{
    const b = document.createElement('div'); b.className='pronome-pill';
    b.dataset.active = (modalState.whWord===w); b.textContent = w;
    b.onclick = ()=>{ modalState.whWord = (modalState.whWord===w) ? null : w; renderModal(); };
    wr.appendChild(b);
  });

  /* o mesmo seletor por encaixe do motor de tempos; meio e fim somam, um ocupante por encaixe */
  const sr = document.getElementById('modalSignalRow'); sr.innerHTML="";
  const mTit = document.getElementById('modalSigTitle'), mHint = document.getElementById('modalSigHint');
  if(!mHint.dataset.pad) mHint.dataset.pad = mHint.textContent;
  mTit.textContent = 'Ⓕ Palavras-sinal da função, por encaixe (opcional)'; mHint.textContent = mHint.dataset.pad;
  /* v114: foco na 2ª oração → o mesmo seletor edita as peças dela */
  if(modalState.o2 && modalState.o2.tipo && o2Em(O2_CTX_MODAL, () => o2Foco()) === 2){
    mTit.textContent = 'Ⓕ Palavras-sinal — 2ª oração (' + O2_TIPOS.find(t => t.k === modalState.o2.tipo).nome + ')';
    o2Em(O2_CTX_MODAL, () => o2SinaisPicker(sr, mHint, MODAL_O2_PICK));
    o2Envolve(sr, O2_CTX_MODAL);
    return;
  }
  const itens = modalItens(), vz = modalVazios();
  const ids = new Set(itens.map(x => x.pl + '|' + x.w)), vistos = new Set();
  modalState.signals = modalSigs().filter(x => ids.has(x.pl + '|' + x.w) && !vz.has(slotOf(x))
                                               && !vistos.has(slotOf(x)) && (vistos.add(slotOf(x)), true));
  const mesma = (a, b) => a.pl === b.pl && a.w === b.w;
  renderSlotPicker(sr, {
    st: modalState, itens, ativos: sortSlots(modalSigs()), desativado: false,
    vazios: vz, vazioPor: modalState.whWord,
    limparAtivo: !modalSigs().length, rotuloLimpar: 'sem sinal',
    ativo: sw => modalSigs().some(x => mesma(x, sw)),
    rival: sw => modalSigs().find(x => slotOf(x) === slotOf(sw) && !mesma(x, sw)) || null,
    limpar: ()=>{ modalState.signals = []; renderModal(); },
    pick: (sw, isActive)=>{
      const atual = modalSigs();
      modalState.signals = isActive ? atual.filter(x => !mesma(x, sw))
                                    : atual.filter(x => slotOf(x) !== slotOf(sw)).concat([sw]);
      renderModal();
    },
    refresh: ()=> renderModal()
  });
}
function renderModal(){
  buildModalGrid(); buildModalDials();
  const tempoDef = modalTempoDef();
  const verb = verbById(state.verbo);
  const col = (state.colocacao!==null) ? (verb.col || [])[state.colocacao] : null;
  const isQ = modalState.formato==='pergunta' || modalState.formato==='pergunta_negativa';
  const wh = (modalState.formato==='pergunta') ? modalState.whWord : null;
  document.getElementById('modalWhGroup').style.display = (modalState.formato==='pergunta') ? '' : 'none';

  const isSubjWh = wh && WH_SUBJECT.includes(wh);
  /* WH de sujeito não inverte: gera a afirmativa com o WH no lugar do sujeito. */
  const g = isSubjWh ? tempoDef.gen(wh, verb, 'afirmativa') : tempoDef.gen(modalState.pronome, verb, modalState.formato);
  const vzM = modalVazios();
  const sigs = modalSigs().filter(x => !vzM.has(slotOf(x)));
  const mids = sigs.filter(x => x.pl === 'mid'), ends = sigs.filter(x => x.pl === 'end');
  let raw = modalInserirMeio(g.text, mids, isSubjWh ? 'afirmativa' : modalState.formato);
  if(col) raw += ' ' + R(col.en);                 /* regência colada ao verbo, antes do sinal */
  sortEnds(ends).forEach(x => { raw += ' ' + C(x.w, x.cls); });
  if(wh && !isSubjWh) raw = M(wh) + ' ' + lowerFirstMarked(raw);
  const fimM = (isQ || wh) ? M('?') : '.';
  /* v110: 2ª oração do motor de modais (contexto próprio; desligada com palavra interrogativa) */
  const o2m = (modalState.o2 && modalState.o2.tipo) ? o2Em(O2_CTX_MODAL, () => o2Compor()) : null;
  const rawBase = raw;                                    /* sem pontuação final */
  raw = o2m ? o2Junta(o2m, rawBase, '', fimM).raw : rawBase + fimM;
  document.getElementById('modalSentence').innerHTML = markedToHTML(raw, markColorVar(modalState.formato));
  document.getElementById('modalAudio').dataset.text = stripMarks(raw);
  const per = ptPerson(modalState.pronome);
  const vpt = PT_VERBS[state.verbo] || PT_VERBS.work;
  const pt = (pronKey, pessoa, fmt)=> buildPTSentence({ pron: PT_PRONOUN[pronKey], core: tempoDef.pt(pessoa, vpt) },
                                                       fmt, mids.length ? mids : null, ends, col || null, null);
  let ptFrase;
  if(isSubjWh)  ptFrase = ptComWh(pt('He', '3s', 'afirmativa'), WH_PT_SUBJECT[wh], true);
  else if(wh)   ptFrase = ptComWh(pt(modalState.pronome, per, 'afirmativa'), WH_PT_ADJUNCT[wh], false);
  else          ptFrase = pt(modalState.pronome, per, modalState.formato);
  if(o2m) ptFrase = o2Junta(o2m, rawBase, ptFrase, fimM).pt;
  document.getElementById('modalTranslation').textContent = ' ' + ptFrase;
  document.getElementById('modalStructure').textContent = tempoDef.structure + (o2m ? ' ' + o2m.estrutura : '')
    + (wh ? (isSubjWh ? ` + ${wh} como sujeito (sem inversão)` : ` + ${wh} antes do modal`) : '')
    + (sigs.length ? ' + palavras-sinal' : '');
  document.getElementById('copyModal').dataset.text = stripMarks(raw) + "\n" + ptFrase;

  const whNote = isSubjWh
    ? `Com <b>${wh}</b> como sujeito não há inversão: o modal fica logo depois do WH, igual a uma afirmativa — "${stripMarks(raw).replace(/\?$/,'')}?"`
    : (wh ? `A palavra interrogativa entra <b>antes do modal</b>; o resto da pergunta continua igual.` : null);
  const meioNote = mids.length
    ? `O advérbio do meio entra <b>depois do primeiro auxiliar</b> ("can <i>always</i> work"); diante de <b>have to / used to</b> ele vem antes ("<i>always</i> have to work"). Na negativa, certeza e "still" passam à frente do auxiliar ("<i>probably</i> can't work").`
    : null;
  const noteBits = [tempoDef.note, g.extraNote, whNote, meioNote, o2m ? '🔗 ' + o2m.nota : null].filter(Boolean);
  o2MontaDial(O2_CTX_MODAL);                              /* v110: dial da 2ª oração */
  /* v114: barra de foco Oração 1 | Oração 2 do modal */
  const fbM = document.getElementById('modalFocoBar');
  o2Em(O2_CTX_MODAL, () => buildFocoBar(fbM, { d1:'O seletor de palavras-sinal (Ⓕ) edita a oração principal.', dF:'O seletor de palavras-sinal (Ⓕ) edita a 2ª oração, valendo para o tempo dela.', dE:'A 2ª oração aceita só palavras-sinal de fim; advérbios de meio não cabem nela.', volta:'Volte para a Oração 1 para encaixar peças na principal.' },
    modalSigs().filter(x => !vzM.has(slotOf(x))).length + (state.colocacao !== null ? 1 : 0)));
  if(fbM) o2Envolve(fbM, O2_CTX_MODAL);
  const noteBox = document.getElementById('modalNote');
  if(noteBits.length){ noteBox.innerHTML = "💡 " + noteBits.join('<br>💡 '); noteBox.classList.add('show'); }
  else { noteBox.classList.remove('show'); noteBox.innerHTML=""; }
  notaMonta(noteBox);   /* v157 */

  applyA11y(); updateScrollShadows();
  const d = MODAL_ENGINE[modalState.funcao];
  document.getElementById('modalAlerta').innerHTML = d.alerta ? `<div class="modal-alerta">⚠️ ${d.alerta}</div>` : "";
}

function toggleBlock(id){
  const block = document.getElementById(id);
  if(id === 'block-trilha') trilhaRender();   /* v163 */
  if(id === 'block-numeros') numRender();   /* v164 */
  if(id === 'block-estruturas') estRender();   /* v164 */
  if(id === 'block-vslab' && typeof vslRender === 'function') vslRender();   /* v181 */
  if(id === 'block-gatilhos') gatRender();   /* v159 */
  if(id === 'block-caderno') cadRender();   /* v158 */
  if(id === 'block-algo') algoRender();   /* v158: exemplos refletem o verbo do motor */
  if(id === 'block-fon' && typeof fonRender === 'function') fonRender();   /* v146 */
  if(id === 'block-ed' && typeof edRender === 'function') edRender();   /* v145: monta o bloco do -ed ao abrir */
  const isOpen = block.dataset.open === "true";
  const body = block.querySelector('.block-body');
  if(isOpen){
    body.style.maxHeight = body.scrollHeight+'px';
    requestAnimationFrame(()=>{ body.style.maxHeight = '0px'; });
    block.dataset.open = "false";
  } else {
    block.dataset.open = "true";
    body.style.maxHeight = body.scrollHeight+'px';
    setTimeout(()=>{ if(block.dataset.open==="true") body.style.maxHeight='none'; }, 320);
  }
}

/* ================= v158: ALGORITMO MENTAL EXPLICADO ETAPA POR ETAPA =================
   Cada etapa é um <details> (teclado, leitor de tela e controle remoto da TV funcionam sem código extra).
   Dentro: por quê · como · armadilha · exemplos AO VIVO (gerados pelo próprio motor, nada de frase inglesa digitada à mão)
   e o botão "ir ao dial", que rola até o controle certo, abre o dial se estiver recolhido e o destaca.
   Os exemplos usam o verbo escolhido no motor (se for de ação); sempre com "she" para a 3ª pessoa aparecer. */
const ALGO_ASP = { simples:'simples', continuo:'contínuo', perfeito:'perfeito', perfeito_continuo:'perfeito contínuo' };
const ALGO_FMT = { afirmativa:'afirmativa', negativa:'negativa', pergunta:'pergunta', pergunta_negativa:'pergunta negativa' };
function algoVerbo(){ const v = state.categoria === 'fact' ? verbById(state.verbo) : null; return v || verbById('work'); }
/* uma linha de exemplo: rótulo curto + frase colorida pelo motor + tradução */
function algoLinha(rot, cat, t, asp, fmt, pr, verbo, ext){
  ext = ext || {};
  const v = cat === 'fact' ? (verbo || algoVerbo()) : null;
  const g = generate(cat, t, asp, fmt, pr, v);
  const txt = (ext.mid || ext.end || ext.col) ? applySignal(g.text, ext.mid || null, ext.end || [], ext.col || null, null, fmt) : g.text;
  let pt = ''; try { pt = translate(cat, t, asp, fmt, pr, ext.mid || null, ext.end || [], v ? v.id : 'work', ext.col || null, null); } catch(e){}
  return { rot, html: markedToHTML(txt, markColorVar(fmt)) + (g.isQuestion ? '?' : '.'), pt };
}
const ALGO_PASSOS = [
  { t:'Quem fala?', r:'pronome ou sujeito', alvo:'#pronomeRow',
    por:'O sujeito é obrigatório em inglês (o português costuma omiti-lo) e é ele que decide a concordância: o verbo ganha -s na 3ª pessoa do singular, “be” vira am/is/are/was/were e “have” vira has.',
    como:'Escolha o pronome. Para nomes, possessivos e grupos (“my father”, “the students”), use “Outros sujeitos…”: o motor troca pelo pronome de concordância e mantém a conjugação certa.',
    arm:'Dizer “works” com I/you/we/they, ou esquecer o -s com he/she/it. Sem sujeito, a frase está incompleta (exceto no imperativo).',
    ex:() => ['I','She','They'].map(p => algoLinha(p.toLowerCase(), 'fact','present','simples','afirmativa', p)) },
  { t:'Ação ou estado?', r:'categoria do verbo', alvo:'#categoriaGrid',
    por:'A categoria escolhe o esqueleto da frase. Ação/fato usa auxiliares (do/does/did/will…) nas negativas e perguntas; ser/estar usa o próprio “be”, que já faz a inversão sozinho.',
    como:'Teste: dá para trocar por “fazer algo”? Então é ação. Se descreve como alguém ou algo está ou é (cansado, médico, em casa), é ser/estar.',
    arm:'“Estou trabalhando” é AÇÃO em andamento (aspecto contínuo), não estado. E ser/estar não aceita “do”: “she doesn’t tired” está errado.',
    ex:() => [ algoLinha('ação','fact','present','simples','negativa','She'), algoLinha('estado','state','present','simples','negativa','She') ] },
  { t:'Qual verbo ou adjetivo?', r:'o significado da frase', alvo:'#verboDialGroup',
    por:'O verbo carrega o sentido. Regulares fazem passado e particípio com -ed; os irregulares têm formas próprias e precisam ser decorados em bloco (por tema, no dial).',
    como:'Procure por tema ou A–Z. Em ser/estar, o dial vira “Adjetivo”: o estado ou a característica. O exemplo ao lado usa o verbo que está no motor.',
    arm:'Aplicar -ed em irregular (“goed”) ou esquecer que o -ed tem três sons — veja o bloco “Pronúncia do -ed”.',
    ex:() => [ algoLinha('presente','fact','present','simples','afirmativa','She'), algoLinha('passado','fact','past','simples','afirmativa','She'), algoLinha('particípio','fact','present','perfeito','afirmativa','She') ] },
  { t:'Complemento?', r:'regência, collocation e possessivo (opcional)', alvo:'#colDialGroup',
    por:'Muitos verbos pedem uma estrutura própria: preposição fixa, objeto típico, collocation. Aprender o par verbo+complemento vale mais do que o verbo solto, e o possessivo (my, his, her…) evita “the” em contextos de posse.',
    como:'Abra o dial de regência, escolha o complemento do verbo ou escreva um complemento livre. Com o chip do possessivo, o “the” vira o pronome do sujeito.',
    arm:'Traduzir a preposição do português (“pensar EM” ≠ think IN). Aprenda o bloco inteiro.',
    ex:() => { const v = (algoVerbo().col || []).length ? algoVerbo() : verbById('park'), c = (v.col || [])[0]; if(!c) return [];
      return [ algoLinha('sem', 'fact','past','simples','afirmativa','She', v), algoLinha('com complemento', 'fact','past','simples','afirmativa','She', v, { col:c }) ]; } },
  { t:'Quando?', r:'tempo: passado, presente ou futuro', alvo:'.tempo-track',
    por:'O tempo localiza a ação na linha do tempo e decide o auxiliar: did / do-does / will. É só uma das duas coordenadas — o aspecto (próxima etapa) completa a informação.',
    como:'Arraste o marcador (ou toque) entre passado, presente e futuro. Os rótulos mostram o auxiliar que entra.',
    arm:'“Will” não é o único futuro: planos e horários usam outras formas; no dial de palavras-sinal veja os marcadores de cada caso.',
    ex:() => ['past','present','future'].map(t => algoLinha({past:'passado',present:'presente',future:'futuro'}[t],'fact',t,'simples','afirmativa','She')) },
  { t:'Como a ação se desenrola?', r:'aspecto: simples · contínuo · perfeito · perfeito contínuo', alvo:'#aspectoGrid',
    por:'O aspecto diz a “forma” do tempo: fato ou hábito (simples), em andamento (contínuo), ligado a um ponto de referência ou resultado (perfeito), duração até um ponto (perfeito contínuo).',
    como:'Pergunte: é rotina? está acontecendo? importa o resultado ou a ligação com agora? importa por quanto tempo? Cada resposta aponta um aspecto.',
    arm:'Perfeito ≠ passado simples. “I have worked” fala do agora (experiência, resultado); “I worked” fecha o passado.',
    ex:() => Object.keys(ALGO_ASP).map(a => algoLinha(ALGO_ASP[a],'fact','present',a,'afirmativa','She')) },
  { t:'Qual formato?', r:'afirmativa · negativa · pergunta · pergunta negativa', alvo:'#formatoRow',
    por:'Quem carrega a negação e a inversão é o AUXILIAR; o verbo principal volta para a forma base. É a regra que mais corrige erro de iniciante.',
    como:'Afirmativa: sujeito + verbo. Negativa: auxiliar + not. Pergunta: auxiliar antes do sujeito. Pergunta negativa junta as duas.',
    arm:'Dupla marcação: “does she works?”, “she didn’t worked”. Se o auxiliar já marcou, o verbo fica na base.',
    ex:() => Object.keys(ALGO_FMT).map(f => algoLinha(ALGO_FMT[f],'fact','present','simples',f,'She')) },
  { t:'Pergunta com palavra interrogativa?', r:'what · where · when · why · how… e as molduras ligadas', alvo:'#whDialGroup', so:'pergunta',
    por:'A palavra interrogativa vai ao início e o auxiliar vem logo depois (inversão). Quando a pergunta é sobre o próprio sujeito (“who works?”), não há inversão nem auxiliar. Cada palavra também liga estruturas próprias (how long it takes, how many are there…).',
    como:'Escolha “Pergunta” no formato; o dial ⑧ aparece. Palavras com moldura (how long, how much…) oferecem as estruturas que costumam acompanhá-las.',
    arm:'“Where you work?” (falta o auxiliar) e “Who does work?” (inversão indevida na pergunta de sujeito).',
    ex:() => { const v = algoVerbo(); const w = whGenerate('fact','present','simples','She','where', v, { mids:[], ends:[], molde:null, col:null });
      return [ { rot:'where', html: markedToHTML(w.enMarked || w.en, markColorVar('pergunta')), pt:'' } ]; } },
  { t:'Palavra-sinal?', r:'reforça o tempo — respeite a posição (meio ou fim)', alvo:'#signalDialGroup',
    por:'Advérbios e expressões (always, every day, already, since…) confirmam o tempo escolhido e dão naturalidade. Cada uma tem lugar fixo: no MEIO (antes do verbo principal, depois do auxiliar) ou no FIM.',
    como:'Abra o dial ⑨: as sugestões já vêm filtradas pelo tempo e aspecto atuais; as cores indicam a família. Ele some nas perguntas com moldura própria.',
    arm:'“She works always” (frequência no meio, não no fim) e esquecer que na negativa o advérbio de certeza vem antes do auxiliar.',
    ex:() => { const sl = SIGNAL_WORDS.present_simples; const m = sl.find(x => x.pl === 'mid'), e = sl.find(x => x.pl === 'end');
      return [ algoLinha('meio','fact','present','simples','afirmativa','She', null, { mid:[m] }), algoLinha('fim','fact','present','simples','afirmativa','She', null, { end:[e] }) ]; } },
  { t:'Abrir a frase com uma moldura?', r:'Ⓐ Abertura da frase (opcional)', alvo:'#abDialGroup', abre:'#abToggle', aberto:'#abBody',
    por:'Algumas ideias começam com uma moldura que enquadra o resto (“é importante que…”, “eu acho que…”). Em inglês a moldura abre a frase e a oração principal vem depois, ligada por “that” ou por outro encaixe.',
    como:'Abra o dial Ⓐ, escolha a família e a moldura. O motor reorganiza a frase e traduz.',
    arm:'Copiar a ordem do português: o inglês não aceita sujeito oculto depois da moldura. Atenção também ao verbo que vem depois (base, -ing ou to).' },
  { t:'Juntar uma 2ª oração?', r:'período composto: coordenação × subordinação', alvo:'#o2DialGroup', abre:'#o2Toggle', aberto:'#o2Body',
    por:'Ideias relacionadas viram um período: coordenadas (and, but, so…) são independentes; subordinadas (because, if, when, that, who…) dependem da principal. Podem ser substantivas, adjetivas ou adverbiais, desenvolvidas (com verbo conjugado) ou reduzidas.',
    como:'Abra o dial da 2ª oração, siga as operações (Juntar · Circunstância · Completar · Detalhar) e a 2ª oração ganha dials próprios de tempo, formato e sinais.',
    arm:'Usar “will” depois de if/when em condição futura; esquecer a vírgula quando a subordinada abre a frase.',
    ex:() => { const n = (typeof O2_TIPOS !== 'undefined' ? O2_TIPOS : []).slice(0, 8).map(t => t.ic + ' ' + t.nome).join(' · ');
      return n ? [ { rot:'tipos', html:n, pt:'' } ] : []; } },
  { t:'Escrever em português?', r:'atalho: digite e o motor monta', alvo:'#ptxGroup',
    por:'Quando você já tem a ideia pronta em português, digitar é mais rápido do que girar dial por dial. O leitor entende sujeito, verbo, tempo e complemento, e preenche o motor.',
    como:'Escreva a frase, confira o que o app entendeu e toque em “Adicionar ao motor”. Os dials ficam ajustáveis depois.',
    arm:'Frases fora do vocabulário cadastrado entram parcialmente: sempre revise o resultado e o complemento.' },
  { t:'Pronto.', r:'ouça, compare com o português e teste o som', alvo:'.readout', fim:true,
    por:'Fechar o ciclo é parte do método: ouvir fixa o ritmo, comparar com o português revela o padrão e a pronúncia mostra os sons que o texto esconde.',
    como:'Toque no alto-falante, alterne a velocidade, toque nas palavras coloridas para ver o papel de cada uma e abra a pronúncia (IPA americano ou britânico).',
    arm:'Parar na frase certa sem repeti-la em voz alta. Fale junto com o áudio.' }
];
function algoRender(){
  const box = document.getElementById('algoFlow'); if(!box) return;
  const abertos = new Set([...box.querySelectorAll('details[open]')].map(d => d.dataset.i));
  box.innerHTML = '';
  ALGO_PASSOS.forEach((p, i) => {
    let exs = []; try { exs = p.ex ? (p.ex() || []) : []; } catch(e){ exs = []; }
    const d = document.createElement('details'); d.className = 'algo-step'; d.dataset.i = String(i);
    if(abertos.has(String(i))) d.open = true;
    const sec = (rot, txt) => txt ? `<div class="algo-sec"><b>${rot}</b><p>${txt}</p></div>` : '';
    const exH = exs.length ? `<div class="algo-ex">${exs.map(x => `<div class="algo-ex-l"><span class="algo-ex-r">${x.rot}</span><span class="algo-ex-t">${x.html}</span>${x.pt ? `<span class="algo-ex-pt">${escapeHTML(x.pt)}</span>` : ''}</div>`).join('')}</div>` : '';
    d.innerHTML = `<summary><span class="n">${p.fim ? '✓' : i + 1}</span><span class="t"><b>${p.t}</b><span>${p.r}</span></span><span class="algo-seta" aria-hidden="true">▾</span></summary>
      <div class="algo-body">${sec('Por quê', p.por)}${sec('Como', p.como)}${exH}${sec('Armadilha', p.arm)}<button type="button" class="algo-go" data-i="${i}">↗ ir ao dial</button></div>`;
    box.appendChild(d);
    if(i < ALGO_PASSOS.length - 1){ const c = document.createElement('div'); c.className = 'algo-connector'; box.appendChild(c); }
  });
  box.querySelectorAll('.algo-go').forEach(b => { b.onclick = () => algoIr(ALGO_PASSOS[+b.dataset.i]); });
  if(typeof applyA11y === 'function') applyA11y();
}
/* aviso curto e discreto (o app não tinha toast): some sozinho */
function algoAviso(msg){
  let t = document.getElementById('algoAviso');
  if(!t){ t = document.createElement('div'); t.id = 'algoAviso'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.dataset.on = 'true'; clearTimeout(algoAviso.h); algoAviso.h = setTimeout(() => { t.dataset.on = 'false'; }, 3200);
}
/* rola até o dial da etapa, abre se estiver recolhido e o destaca (Web Animations API; sem movimento se o sistema pediu menos) */
function algoIr(p){
  const alvo = document.querySelector(p.alvo); if(!alvo) return;
  const g = alvo.closest('.dial-group, .readout') || alvo;
  if(getComputedStyle(g).display === 'none'){
    algoAviso(p.so === 'pergunta' ? 'Esse dial aparece quando o formato é “pergunta”.' : 'Esse dial não aparece com as escolhas atuais (por exemplo, o verbo só existe em ação/fato).');
    const t = document.getElementById('console-tempos'); if(t) t.scrollIntoView({ behavior:'smooth', block:'start' });
    return;
  }
  if(g.id && DIAL_COLAPSA[g.id] && !dialEstaAberto(g.id)) dialAlterna(g.id);
  if(p.abre){ const corpo = document.querySelector(p.aberto), bt = document.querySelector(p.abre); if(corpo && bt && corpo.hidden) bt.click(); }
  const reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.querySelector('.topnav'), topo = (nav ? nav.getBoundingClientRect().height : 56) + 150;   /* deixa a frase fixa visível */
  window.scrollTo({ top: Math.max(0, g.getBoundingClientRect().top + window.scrollY - topo), behavior: reduz ? 'auto' : 'smooth' });
  if(!reduz && g.animate) g.animate([ { boxShadow:'0 0 0 0 var(--brass)' }, { boxShadow:'0 0 0 6px color-mix(in srgb, var(--brass) 35%, transparent)' }, { boxShadow:'0 0 0 0 transparent' } ], { duration:1100, easing:'ease-out' });
}
/* "Percorrer": abre uma etapa por vez com pausa (como um guia), para quem quer ver o raciocínio completo */
let algoTour = null;
function algoPercorre(){
  const box = document.getElementById('algoFlow'), bt = document.getElementById('algoTourBtn'); if(!box) return;
  if(algoTour){ clearTimeout(algoTour); algoTour = null; if(bt) bt.textContent = '▶ percorrer'; return; }
  const itens = [...box.querySelectorAll('details.algo-step')]; let i = 0;
  if(bt) bt.textContent = '⏹ parar';
  const passo = () => {
    itens.forEach((d, k) => { d.open = k === i; d.dataset.atual = String(k === i); });
    itens[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
    i++;
    if(i < itens.length) algoTour = setTimeout(passo, 4200); else { algoTour = null; if(bt) bt.textContent = '▶ percorrer'; }
  };
  passo();
}
function algoTodos(abrir){ document.querySelectorAll('#algoFlow details.algo-step').forEach(d => { d.open = abrir; }); }

/* ================= v158: CADERNO · FALA · RECURSOS MODERNOS =================
   Tudo com detecção de recurso: onde a API não existe (TV sem microfone, navegador antigo) o botão simplesmente não aparece.
   Movimento respeita prefers-reduced-motion. Nada daqui roda no caminho quente do render (só observadores e eventos). */
const REDUZ = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
/* tato curto (Android): confirma salvar/acertar sem olhar para a tela */
function tato(ms){ try { if(!REDUZ() && navigator.vibrate) navigator.vibrate(ms || 12); } catch(e){} }

