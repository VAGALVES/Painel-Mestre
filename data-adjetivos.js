/* ================= v173 · OS 8 ADJETIVOS EM ORDEM =================
   A ordem natural dos adjetivos antes do substantivo (OSASCOMP) vira 8 encaixes independentes:
     1 opinião → 2 tamanho → 3 idade → 4 forma → 5 cor → 6 origem → 7 material → 8 propósito
   Cada encaixe tem muitas opções e todos podem ser combinados na mesma frase (mesmo os que não fazem
   sentido juntos — o objetivo é treinar a ORDEM). Aqui ficam os dados e o construtor do sintagma
   nominal "determinante + adjetivos + substantivo" nas duas línguas.

   Formato das linhas:  inglês | português | opções
     português: "masculino/feminino" (ou uma só forma, se invariável: "grande", "de madeira")
     opções:    p = em português pode vir ANTES do substantivo ("um belo carro")
   Substantivos:  inglês | português | gênero (m/f) | verbo transitivo padrão
   Este arquivo só tem dados e funções puras; as marcas de cor (M, R, A7…) vêm de pm-01-base.js. */

const ADJ7_META = [
  { k:'opiniao',  n:'opinião',  q:'o que acho?',          ex:'lovely'  },
  { k:'tamanho',  n:'tamanho',  q:'qual o tamanho?',      ex:'big'     },
  { k:'idade',    n:'idade',    q:'que idade tem?',       ex:'old'     },
  { k:'forma',    n:'forma',    q:'que formato tem?',     ex:'round'   },
  { k:'cor',      n:'cor',      q:'de que cor é?',        ex:'red'     },
  { k:'origem',   n:'origem',   q:'de onde vem?',         ex:'Italian' },
  { k:'material', n:'material', q:'de que é feito?',      ex:'wooden'  },
  { k:'proposito', n:'propósito', q:'para que serve?',      ex:'sleeping' }
];

const ADJ7_TXT = {
opiniao: `lovely|encantador/encantadora|p
beautiful|lindo/linda|p
pretty|bonito/bonita|p
gorgeous|deslumbrante
nice|agradável
wonderful|maravilhoso/maravilhosa|p
great|ótimo/ótima|p
good|bom/boa|p
excellent|excelente|p
amazing|incrível
fantastic|fantástico/fantástica|p
magnificent|magnífico/magnífica|p
splendid|esplêndido/esplêndida|p
perfect|perfeito/perfeita
brilliant|brilhante
impressive|impressionante
remarkable|notável
special|especial
favorite|favorito/favorita
charming|charmoso/charmosa
elegant|elegante
stylish|estiloso/estilosa
fashionable|da moda
fancy|chique
luxurious|luxuoso/luxuosa
exquisite|requintado/requintada
cute|fofo/fofa
adorable|adorável
cheerful|alegre
cosy|aconchegante
comfortable|confortável
practical|prático/prática
useful|útil
reliable|confiável
powerful|potente
sturdy|robusto/robusta
simple|simples
delicate|delicado/delicada
fragile|frágil
expensive|caro/cara
cheap|barato/barata
valuable|valioso/valiosa
precious|precioso/preciosa
famous|famoso/famosa
popular|popular
rare|raro/rara
unusual|incomum
strange|estranho/estranha
weird|esquisito/esquisita
mysterious|misterioso/misteriosa
interesting|interessante
funny|engraçado/engraçada
silly|bobo/boba
boring|chato/chata
ordinary|comum
bad|ruim|
awful|péssimo/péssima|p
terrible|terrível|p
horrible|horrível|p
ridiculous|ridículo/ridícula
disgusting|nojento/nojenta
ugly|feio/feia
dirty|sujo/suja
messy|bagunçado/bagunçada
clean|limpo/limpa
tidy|arrumado/arrumada
noisy|barulhento/barulhenta
quiet|silencioso/silenciosa
gloomy|sombrio/sombria
shiny|reluzente`,
tamanho: `big|grande
large|amplo/ampla
small|pequeno/pequena
little|pequenino/pequenina
huge|enorme
enormous|imenso/imensa
gigantic|gigantesco/gigantesca
giant|gigante
massive|colossal
vast|vasto/vasta
tiny|minúsculo/minúscula
miniature|em miniatura
petite|diminuto/diminuta
tall|alto/alta
short|baixo/baixa
long|comprido/comprida
wide|largo/larga
narrow|estreito/estreita
thick|grosso/grossa
thin|fino/fina
slim|esguio/esguia
fat|gordo/gorda
heavy|pesado/pesada
light|leve
deep|fundo/funda
shallow|raso/rasa
high|elevado/elevada
low|baixo/baixa
compact|compacto/compacta
bulky|volumoso/volumosa
spacious|espaçoso/espaçosa
medium|médio/média
mid-sized|de tamanho médio
oversized|superdimensionado/superdimensionada
extra-large|extragrande`,
idade: `old|velho/velha
new|novo/nova
young|jovem
ancient|antigo/antiga
antique|de antiquário
vintage|vintage
modern|moderno/moderna
contemporary|contemporâneo/contemporânea
recent|recente
current|atual
brand-new|novinho/novinha em folha
newborn|recém-nascido/recém-nascida
used|usado/usada
second-hand|de segunda mão
worn|gasto/gasta
aged|envelhecido/envelhecida
elderly|idoso/idosa
mature|maduro/madura
fresh|fresco/fresca
youthful|juvenil
old-fashioned|antiquado/antiquada
traditional|tradicional
classic|clássico/clássica
retro|retrô
historic|histórico/histórica
medieval|medieval`,
forma: `round|redondo/redonda
square|quadrado/quadrada
rectangular|retangular
oval|oval
circular|circular
triangular|triangular
hexagonal|hexagonal
octagonal|octogonal
oblong|oblongo/oblonga
cylindrical|cilíndrico/cilíndrica
spherical|esférico/esférica
conical|cônico/cônica
flat|plano/plana
curved|curvo/curva
straight|reto/reta
crooked|torto/torta
bent|dobrado/dobrada
twisted|retorcido/retorcida
wavy|ondulado/ondulada
pointed|pontudo/pontuda
rounded|arredondado/arredondada
angular|anguloso/angulosa
domed|abobadado/abobadada
sloping|inclinado/inclinada
hollow|oco/oca
jagged|serrilhado/serrilhada
spiral|em espiral
heart-shaped|em forma de coração
star-shaped|em forma de estrela
pyramid-shaped|em forma de pirâmide`,
cor: `red|vermelho/vermelha
blue|azul
green|verde
yellow|amarelo/amarela
black|preto/preta
white|branco/branca
grey|cinza
brown|marrom
orange|laranja
pink|rosa
purple|roxo/roxa
violet|violeta
golden|dourado/dourada
silver|prateado/prateada
beige|bege
turquoise|turquesa
navy|azul-marinho
crimson|carmesim
scarlet|escarlate
ivory|marfim
cream|creme
maroon|bordô
olive|verde-oliva
teal|verde-azulado/verde-azulada
lilac|lilás
bronze|cor de bronze
copper|acobreado/acobreada
dark|escuro/escura
pale|pálido/pálida
bright|vivo/viva
light blue|azul-claro
dark green|verde-escuro
sky-blue|azul-celeste
bright red|vermelho-vivo/vermelha-viva
transparent|transparente
striped|listrado/listrada
spotted|manchado/manchada
checkered|xadrez`,
origem: `Italian|italiano/italiana
French|francês/francesa
German|alemão/alemã
Spanish|espanhol/espanhola
Portuguese|português/portuguesa
Brazilian|brasileiro/brasileira
American|americano/americana
British|britânico/britânica
English|inglês/inglesa
Irish|irlandês/irlandesa
Scottish|escocês/escocesa
Swiss|suíço/suíça
Dutch|holandês/holandesa
Danish|dinamarquês/dinamarquesa
Swedish|sueco/sueca
Norwegian|norueguês/norueguesa
Finnish|finlandês/finlandesa
Polish|polonês/polonesa
Russian|russo/russa
Greek|grego/grega
Turkish|turco/turca
Egyptian|egípcio/egípcia
Moroccan|marroquino/marroquina
Nigerian|nigeriano/nigeriana
African|africano/africana
Arabic|árabe
Persian|persa
Indian|indiano/indiana
Chinese|chinês/chinesa
Japanese|japonês/japonesa
Korean|coreano/coreana
Thai|tailandês/tailandesa
Vietnamese|vietnamita
Indonesian|indonésio/indonésia
Asian|asiático/asiática
European|europeu/europeia
Canadian|canadense
Mexican|mexicano/mexicana
Cuban|cubano/cubana
Argentine|argentino/argentina
Chilean|chileno/chilena
Peruvian|peruano/peruana
Colombian|colombiano/colombiana
Australian|australiano/australiana
Nordic|nórdico/nórdica
Roman|romano/romana
Victorian|vitoriano/vitoriana`,
material: `wooden|de madeira
metal|de metal
plastic|de plástico
leather|de couro
cotton|de algodão
silk|de seda
woolen|de lã
linen|de linho
denim|de jeans
velvet|de veludo
nylon|de náilon
fur|de pele
steel|de aço
iron|de ferro
copper|de cobre
brass|de latão
tin|de lata
aluminum|de alumínio
titanium|de titânio
gold|de ouro
silver|de prata
glass|de vidro
crystal|de cristal
ceramic|de cerâmica
porcelain|de porcelana
clay|de barro
stone|de pedra
marble|de mármore
granite|de granito
brick|de tijolo
concrete|de concreto
plaster|de gesso
paper|de papel
cardboard|de papelão
rubber|de borracha
foam|de espuma
wax|de cera
bamboo|de bambu
wicker|de vime
straw|de palha
canvas|de lona`,
proposito: `sleeping|de dormir
running|de corrida
walking|de caminhada
hiking|de trilha
swimming|de natação
cycling|de ciclismo
riding|de montaria
driving|de direção
writing|de escrever
reading|de leitura
washing|de lavar
cooking|de cozinhar
baking|de assar
dining|de jantar
serving|de servir
shopping|de compras
drinking|de beber
mixing|de misturar
cutting|de cortar
storage|de armazenamento
travel|de viagem
camping|de acampamento
fishing|de pesca
gardening|de jardinagem
training|de treino
gym|de academia
kitchen|de cozinha
office|de escritório
bath|de banho
party|de festa
wedding|de casamento
birthday|de aniversário
school|de escola
work|de trabalho
coffee|de café
tea|de chá
wine|de vinho
tennis|de tênis
football|de futebol
sports|esportivo/esportiva
evening|de noite
beach|de praia
winter|de inverno
summer|de verão
baby|de bebê`
};

/* substantivos: inglês | português | gênero | verbo padrão (transitivo que combina) */
const NP_SUBS_TXT = `table|mesa|f|buy
chair|cadeira|f|buy
sofa|sofá|m|buy
bed|cama|f|buy
desk|escrivaninha|f|buy
shelf|prateleira|f|buy
lamp|abajur|m|buy
mirror|espelho|m|buy
carpet|tapete|m|buy
vase|vaso|m|buy
clock|relógio|m|buy
door|porta|f|find
window|janela|f|see
house|casa|f|buy
car|carro|m|buy
bike|bicicleta|f|buy
boat|barco|m|buy
truck|caminhão|m|sell
bus|ônibus|m|take
motorcycle|moto|f|buy
dress|vestido|m|wear
shirt|camisa|f|wear
jacket|jaqueta|f|wear
coat|casaco|m|wear
sweater|suéter|m|wear
skirt|saia|f|wear
hat|chapéu|m|wear
scarf|cachecol|m|wear
belt|cinto|m|wear
ring|anel|m|wear
necklace|colar|m|wear
watch|relógio|m|wear
bag|bolsa|f|carry
box|caixa|f|carry
bottle|garrafa|f|carry
basket|cesta|f|carry
umbrella|guarda-chuva|m|carry
book|livro|m|find
letter|carta|f|find
key|chave|f|find
cup|xícara|f|have
plate|prato|m|have
bowl|tigela|f|have
knife|faca|f|have
pen|caneta|f|buy
phone|telefone|m|buy
laptop|notebook|m|buy
camera|câmera|f|buy
guitar|guitarra|f|buy
toy|brinquedo|m|buy
ball|bola|f|buy
gift|presente|m|buy
candle|vela|f|buy
blanket|cobertor|m|buy
pillow|travesseiro|m|buy
painting|pintura|f|see
statue|estátua|f|see
flag|bandeira|f|see
bridge|ponte|f|see
church|igreja|f|see
castle|castelo|m|see
tower|torre|f|see
building|prédio|m|see
garden|jardim|m|have
cat|gato|m|have
dog|cachorro|m|have
horse|cavalo|m|see
bird|pássaro|m|see`;

/* determinantes: inglês | masculino/feminino | posposto em PT (dono = "dele/dela/deles") */
const NP_DET_TXT = `a|um/uma|
the|o/a|
my|meu/minha|
your|seu/sua|
his|o/a|dele
her|o/a|dela
our|nosso/nossa|
their|o/a|deles
this|este/esta|
that|aquele/aquela|
another|outro/outra|
every|cada|`;

/* ---- leitura das tabelas (uma vez, ao carregar) ---- */
const _par = s => { const [a, b] = s.split('/'); return [a, b === undefined ? a : b]; };
const ADJ7 = ADJ7_META.map((m, i) => Object.assign({ i, ord:i + 1 }, m, {
  ops: ADJ7_TXT[m.k].split('\n').map(l => {
    const [en, pt, fl] = l.split('|'), [pm, pf] = _par(pt);
    return { en, pm, pf, pre:fl === 'p' };
  })
}));
const NP_SUBS = NP_SUBS_TXT.split('\n').map(l => { const [en, pt, g, v] = l.split('|'); return { en, pt, g, v }; });
const NP_DET = NP_DET_TXT.split('\n').map(l => { const [en, pt, pos] = l.split('|'), [pm, pf] = _par(pt); return { en, pm, pf, pos:pos || '' }; });
const NP_PADRAO = { det:'a', noun:'table', adj:{ opiniao:'lovely', tamanho:'big', idade:'old', forma:'round', cor:'red', origem:'Italian', material:'wooden', proposito:'dining' } };

/* ---- a / an pelo SOM da palavra seguinte (e não pela letra) ---- */
function npAn(palavra){
  const w = (palavra || '').toLowerCase();
  if(/^(hour|honest|honor|heir)/.test(w)) return 'an';
  if(/^(uni|use|usu|uti|eu|one|once|ubi|ura|uro)/.test(w)) return 'a';
  return /^[aeiou]/.test(w) ? 'an' : 'a';
}
const adj7Op = (k, en) => { const t = ADJ7.find(x => x.k === k); return t ? t.ops.find(o => o.en === en) || null : null; };
const npSub = en => NP_SUBS.find(s => s.en === en) || null;
const npDet = en => NP_DET.find(d => d.en === en) || null;

/* Monta o sintagma nominal. sel = { det, noun, adj:{ opiniao:'lovely', … } } (qualquer subconjunto de adj).
   Devolve { raw (com marcas de cor), plain, pt, verbo } ou null se não houver substantivo.
   Inglês: determinante + adjetivos NA ORDEM DOS 7 ENCAIXES + substantivo (a/an conforme a 1ª palavra seguinte).
   Português: o inglês põe os adjetivos antes; o português costuma pôr DEPOIS do substantivo, concordando em
   gênero com ele. Só o 1º adjetivo de opinião marcado "p" (lindo, ótimo, belo…) vai antes. Os pós-nominais
   se ligam por vírgulas e "e"; o material ("de madeira") fecha o sintagma sem "e"; o propósito ("de dormir") fica colado ao substantivo. */
function npMonta(sel){
  const n = npSub(sel && sel.noun); if(!n) return null;
  const fem = n.g === 'f', d = sel.det ? npDet(sel.det) : null;
  const itens = [];                                           /* { k, op } na ordem dos encaixes */
  ADJ7.forEach(t => { const op = sel.adj && sel.adj[t.k] ? adj7Op(t.k, sel.adj[t.k]) : null; if(op) itens.push({ k:t.k, op }); });
  /* --- inglês --- */
  const primeira = itens.length ? itens[0].op.en : n.en;
  const detEn = d ? (d.en === 'a' ? npAn(primeira) : d.en) : '';
  const rawP = [], plainP = [];
  if(detEn){ rawP.push(R(detEn)); plainP.push(detEn); }
  itens.forEach(it => { rawP.push(A7(it.k, it.op.en)); plainP.push(it.op.en); });
  rawP.push(R(n.en)); plainP.push(n.en);
  /* --- português --- */
  const forma = op => fem ? op.pf : op.pm;
  let pre = '', pos = [], mat = '', prop = '';
  itens.forEach(it => {
    if(it.k === 'material') mat = forma(it.op);
    else if(it.k === 'proposito') prop = forma(it.op);   /* "saco de dormir": colado ao substantivo */
    else if(it.k === 'opiniao' && it.op.pre && !pre) pre = forma(it.op);
    else pos.push(forma(it.op));
  });
  const junta = l => l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' e ' + l[l.length - 1];
  const art = d ? (fem ? d.pf : d.pm) : '';
  const miolo = [pre, n.pt, prop, junta(pos), mat].filter(Boolean).join(' ');
  const pt = [art, miolo, d ? d.pos : ''].filter(Boolean).join(' ');
  return { raw:rawP.join(' '), plain:plainP.join(' '), pt, verbo:n.v, n:itens.length };
}
