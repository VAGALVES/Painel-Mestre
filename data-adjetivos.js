/* ================= v173 · OS 8 ADJETIVOS EM ORDEM =================
   A ordem natural dos adjetivos antes do substantivo (OSASCOMP) vira 8 encaixes independentes:
     1 opinião → 2 tamanho → 3 idade → 4 forma → 5 cor → 6 origem → 7 material → 8 propósito
   Cada encaixe tem muitas opções e todos podem ser combinados na mesma frase (mesmo os que não fazem
   sentido juntos — o objetivo é treinar a ORDEM). Aqui ficam os dados e o construtor do sintagma
   nominal "determinante + adjetivos + substantivo" nas duas línguas.

   Formato das linhas:  inglês | português | opções
     "# Nome"  abre uma subcategoria (o seletor e o Glossário agrupam por ela)
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
opiniao: `# Elogio geral
lovely|encantador/encantadora|p
nice|agradável
good|bom/boa|p
great|ótimo/ótima|p
wonderful|maravilhoso/maravilhosa|p
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
superb|soberbo/soberba|p
outstanding|excepcional
marvelous|maravilhoso/maravilhosa
terrific|sensacional
fabulous|fabuloso/fabulosa
awesome|demais
incredible|inacreditável
ideal|ideal
flawless|impecável
fine|ótimo/ótima
decent|decente
cool|legal
neat|bacana
first-class|de primeira classe
top-notch|de primeira linha
# Crítica geral
bad|ruim
awful|péssimo/péssima|p
terrible|terrível|p
horrible|horrível|p
ridiculous|ridículo/ridícula
dreadful|medonho/medonha
appalling|chocante
lousy|vagabundo/vagabunda
poor|fraco/fraca
mediocre|medíocre
dismal|desanimador/desanimadora
pathetic|patético/patética
useless|inútil
worthless|sem valor
nasty|desagradável
inferior|inferior
disappointing|decepcionante
unpleasant|desagradável
annoying|irritante
mean|mesquinho/mesquinha
rotten|podre
cheesy|brega
overrated|superestimado/superestimada
# Beleza e aparência
beautiful|lindo/linda|p
pretty|bonito/bonita|p
gorgeous|deslumbrante
cute|fofo/fofa
adorable|adorável
charming|charmoso/charmosa
elegant|elegante
stylish|estiloso/estilosa
fashionable|da moda
fancy|chique
luxurious|luxuoso/luxuosa
exquisite|requintado/requintada
graceful|gracioso/graciosa
stunning|de tirar o fôlego
handsome|belo/bela
attractive|atraente
glamorous|glamoroso/glamorosa
chic|chique
sleek|de linhas elegantes
dazzling|ofuscante
radiant|radiante
picturesque|pitoresco/pitoresca
shiny|reluzente
sparkling|cintilante
# Feiura e mau gosto
ugly|feio/feia
plain|sem graça
tacky|cafona
gaudy|espalhafatoso/espalhafatosa
hideous|hediondo/hedionda
unattractive|pouco atraente
scruffy|desleixado/desleixada
shabby|surrado/surrada
drab|monótono/monótona
tasteless|de mau gosto
# Sabor e cheiro
delicious|delicioso/deliciosa
tasty|saboroso/saborosa
yummy|gostoso/gostosa
sweet|doce
sour|azedo/azeda
bitter|amargo/amarga
salty|salgado/salgada
spicy|picante
bland|insosso/insossa
juicy|suculento/suculenta
crunchy|crocante
creamy|cremoso/cremosa
fragrant|perfumado/perfumada
aromatic|aromático/aromática
smelly|fedorento/fedorenta
stinky|fedido/fedida
savory|apetitoso/apetitosa
rich|rico/rica
mild|suave
greasy|gorduroso/gordurosa
stale|passado/passada
sugary|açucarado/açucarada
tangy|ácido/ácida
# Conforto e sensação
comfortable|confortável
cosy|aconchegante
soft|macio/macia
warm|quentinho/quentinha
snug|justinho e aconchegante
relaxing|relaxante
peaceful|tranquilo/tranquila
uncomfortable|desconfortável
stuffy|abafado/abafada
chilly|gelado/gelada
refreshing|refrescante
soothing|calmante
airy|arejado/arejada
# Utilidade e qualidade
practical|prático/prática
useful|útil
reliable|confiável
powerful|potente
sturdy|robusto/robusta
simple|simples
durable|durável
efficient|eficiente
handy|manejável
versatile|versátil
convenient|conveniente
functional|funcional
flexible|flexível
solid|sólido/sólida
strong|forte
weak|fraco/fraca
flimsy|frágil e mal feito
clumsy|desajeitado/desajeitada
awkward|incômodo/incômoda
complicated|complicado/complicada
complex|complexo/complexa
tricky|traiçoeiro/traiçoeira
easy|fácil
difficult|difícil
hard-wearing|resistente ao uso
high-quality|de alta qualidade
well-made|bem-feito/bem-feita
delicate|delicado/delicada
fragile|frágil
# Valor, preço e fama
expensive|caro/cara
cheap|barato/barata
valuable|valioso/valiosa
precious|precioso/preciosa
priceless|inestimável
costly|custoso/custosa
affordable|acessível
pricey|salgado/salgada
inexpensive|econômico/econômica
overpriced|superfaturado/superfaturada
famous|famoso/famosa
popular|popular
rare|raro/rara
unique|único/única
legendary|lendário/lendária
notorious|notório/notória
celebrated|celebrado/celebrada
well-known|bem conhecido/bem conhecida
trendy|descolado/descolada
exclusive|exclusivo/exclusiva
fashion-forward|de vanguarda
# Curiosidade e emoção
interesting|interessante
funny|engraçado/engraçada
silly|bobo/boba
boring|chato/chata
mysterious|misterioso/misteriosa
strange|estranho/estranha
weird|esquisito/esquisita
unusual|incomum
ordinary|comum
odd|esquisito/esquisita
peculiar|peculiar
curious|curioso/curiosa
fascinating|fascinante
exciting|empolgante
thrilling|emocionante
entertaining|divertido/divertida
amusing|engraçado/engraçada
hilarious|hilário/hilária
dull|enfadonho/enfadonha
tedious|tedioso/tediosa
shocking|chocante
surprising|surpreendente
scary|assustador/assustadora
frightening|aterrorizante
creepy|arrepiante
spooky|assombrado/assombrada
touching|comovente
moving|tocante
inspiring|inspirador/inspiradora
romantic|romântico/romântica
dramatic|dramático/dramática
# Limpeza, ordem e ambiente
clean|limpo/limpa
dirty|sujo/suja
messy|bagunçado/bagunçada
tidy|arrumado/arrumada
noisy|barulhento/barulhenta
quiet|silencioso/silenciosa
gloomy|sombrio/sombria
dusty|empoeirado/empoeirada
crowded|lotado/lotada
cluttered|atulhado/atulhada
spotless|imaculado/imaculada
cheerful|alegre
tranquil|sereno/serena
lively|animado/animada
dim|mal iluminado/mal iluminada
sunny|ensolarado/ensolarada
# Personalidade
kind|gentil
friendly|simpático/simpática
generous|generoso/generosa
polite|educado/educada
rude|rude
clever|esperto/esperta
smart|inteligente
intelligent|inteligente
wise|sábio/sábia
lazy|preguiçoso/preguiçosa
brave|corajoso/corajosa
honest|honesto/honesta
patient|paciente
selfish|egoísta
shy|tímido/tímida
stubborn|teimoso/teimosa
calm|calmo/calma
nervous|nervoso/nervosa
careful|cuidadoso/cuidadosa
creative|criativo/criativa
talented|talentoso/talentosa
loyal|leal
gentle|delicado/delicada
cruel|cruel
proud|orgulhoso/orgulhosa
humble|humilde`,
tamanho: `# Grande
big|grande
large|amplo/ampla
huge|enorme
enormous|imenso/imensa
gigantic|gigantesco/gigantesca
giant|gigante
massive|colossal
vast|vasto/vasta
immense|imensurável
colossal|colossal
mammoth|descomunal
sizable|considerável
hefty|avantajado/avantajada
jumbo|jumbo
king-size|king-size
oversized|superdimensionado/superdimensionada
extra-large|extragrande
bulky|volumoso/volumosa
spacious|espaçoso/espaçosa
roomy|folgado/folgada
generous-sized|de bom tamanho
# Pequeno
small|pequeno/pequena
little|pequenino/pequenina
tiny|minúsculo/minúscula
miniature|em miniatura
petite|diminuto/diminuta
minute|ínfimo/ínfima
compact|compacto/compacta
mini|mini
pocket-sized|de bolso
bite-sized|do tamanho de uma mordida
undersized|subdimensionado/subdimensionada
cramped|apertado/apertada
dainty|delicado e pequeno
wee|bem pequenininho
# Médio e padrão
medium|médio/média
mid-sized|de tamanho médio
average|de tamanho comum
moderate|moderado/moderada
standard|padrão
regular|regular
full-sized|de tamanho real
life-sized|em tamanho natural
# Altura e comprimento
tall|alto/alta
short|baixo/baixa
long|comprido/comprida
lanky|esguio e desengonçado
towering|altíssimo/altíssima
lofty|elevado/elevada
high|elevado/elevada
low|baixo/baixa
elevated|erguido/erguida
knee-high|na altura do joelho
waist-high|na altura da cintura
shoulder-high|na altura do ombro
sky-high|nas alturas
endless|interminável
# Largura e espessura
wide|largo/larga
narrow|estreito/estreita
broad|amplo/ampla
thick|grosso/grossa
thin|fino/fina
slim|esguio/esguia
slender|delgado/delgada
skinny|magrinho/magrinha
chunky|robusto e grosso
stout|corpulento/corpulenta
fat|gordo/gorda
plump|rechonchudo/rechonchuda
chubby|gordinho/gordinha
lean|magro/magra
stocky|atarracado/atarracada
paper-thin|fino como papel
wafer-thin|finíssimo/finíssima
# Peso e profundidade
heavy|pesado/pesada
light|leve
lightweight|levíssimo/levíssima
weightless|sem peso
featherlight|leve como pluma
deep|fundo/funda
shallow|raso/rasa
bottomless|sem fundo
dense|denso/densa`,
idade: `# Velho e antigo
old|velho/velha
ancient|antigo/antiga
antique|de antiquário
aged|envelhecido/envelhecida
prehistoric|pré-histórico/pré-histórica
archaic|arcaico/arcaica
obsolete|obsoleto/obsoleta
outdated|ultrapassado/ultrapassada
old-fashioned|antiquado/antiquada
dated|datado/datada
timeworn|desgastado pelo tempo
centuries-old|centenário/centenária
age-old|milenar
ageless|atemporal
long-standing|de longa data
primeval|primitivo/primitiva
# Novo e moderno
new|novo/nova
brand-new|novinho/novinha em folha
modern|moderno/moderna
contemporary|contemporâneo/contemporânea
recent|recente
current|atual
latest|mais recente
up-to-date|atualizado/atualizada
state-of-the-art|de última geração
cutting-edge|de ponta
futuristic|futurista
fresh|fresco/fresca
unused|sem uso
mint-condition|em estado de novo
newly-built|recém-construído/recém-construída
next-generation|de nova geração
# Fase da vida
young|jovem
newborn|recém-nascido/recém-nascida
elderly|idoso/idosa
mature|maduro/madura
youthful|juvenil
teenage|adolescente
adult|adulto/adulta
juvenile|juvenil
middle-aged|de meia-idade
infant|de bebê
baby|bebê
senior|sênior
grown-up|crescido/crescida
# Uso e desgaste
used|usado/usada
second-hand|de segunda mão
worn|gasto/gasta
worn-out|desgastado/desgastada
tattered|esfarrapado/esfarrapada
battered|surrado/surrada
faded|desbotado/desbotada
rusty|enferrujado/enferrujada
weathered|castigado/castigada pelo tempo
pre-owned|seminovo/seminova
refurbished|reformado/reformada
restored|restaurado/restaurada
crumbling|em ruínas
cracked|rachado/rachada
well-used|bem usado/bem usada
moth-eaten|roído/roída por traças
# Época e estilo
vintage|vintage
retro|retrô
classic|clássico/clássica
traditional|tradicional
historic|histórico/histórica
medieval|medieval
Gothic|gótico/gótica
Baroque|barroco/barroca
Renaissance|renascentista
Georgian|georgiano/georgiana
Edwardian|eduardiano/eduardiana
colonial|colonial
Art Deco|art déco
mid-century|de meados do século
nineteenth-century|do século XIX
eighteenth-century|do século XVIII
Stone Age|da Idade da Pedra`,
forma: `# Formas planas
round|redondo/redonda
square|quadrado/quadrada
rectangular|retangular
oval|oval
circular|circular
triangular|triangular
hexagonal|hexagonal
octagonal|octogonal
pentagonal|pentagonal
diamond-shaped|em forma de losango
crescent|em forma de lua crescente
semicircular|semicircular
heart-shaped|em forma de coração
star-shaped|em forma de estrela
L-shaped|em forma de L
U-shaped|em forma de U
T-shaped|em forma de T
cross-shaped|em forma de cruz
oblong|oblongo/oblonga
elliptical|elíptico/elíptica
# Formas sólidas
cylindrical|cilíndrico/cilíndrica
spherical|esférico/esférica
conical|cônico/cônica
cubic|cúbico/cúbica
pyramid-shaped|em forma de pirâmide
tubular|tubular
egg-shaped|em forma de ovo
pear-shaped|em forma de pera
bell-shaped|em forma de sino
barrel-shaped|em forma de barril
funnel-shaped|em forma de funil
domed|abobadado/abobadada
bowl-shaped|em forma de tigela
boat-shaped|em forma de barco
ball-shaped|em forma de bola
# Curvas e linhas
curved|curvo/curva
straight|reto/reta
crooked|torto/torta
bent|dobrado/dobrada
twisted|retorcido/retorcida
wavy|ondulado/ondulada
rounded|arredondado/arredondada
spiral|em espiral
winding|sinuoso/sinuosa
zigzag|em zigue-zague
arched|arqueado/arqueada
looped|em laço
curly|encaracolado/encaracolada
coiled|enrolado/enrolada
slanted|oblíquo/oblíqua
sloping|inclinado/inclinada
tilted|inclinado/inclinada
parallel|paralelo/paralela
symmetrical|simétrico/simétrica
lopsided|torto e assimétrico
# Pontas e arestas
pointed|pontudo/pontuda
angular|anguloso/angulosa
jagged|serrilhado/serrilhada
sharp|afiado/afiada
blunt|rombudo/rombuda
spiky|espinhoso/espinhosa
tapered|afunilado/afunilada
pronged|com pontas
notched|entalhado/entalhada
serrated|dentado/dentada
edged|com bordas
square-cornered|de cantos retos
round-edged|de bordas arredondadas
# Superfície e textura
flat|plano/plana
smooth|liso/lisa
rough|áspero/áspera
bumpy|cheio/cheia de calombos
glossy|brilhante
matte|fosco/fosca
rugged|acidentado/acidentada
silky|sedoso/sedosa
grainy|granulado/granulada
ribbed|canelado/canelada
fluffy|fofo e peludo
fuzzy|felpudo/felpuda
slippery|escorregadio/escorregadia
sticky|pegajoso/pegajosa
prickly|espinhento/espinhenta
hollow|oco/oca
perforated|perfurado/perfurada
dented|amassado/amassada
wrinkled|enrugado/enrugada
shaggy|peludo/peluda
polished|polido/polida
embossed|em relevo
carved|entalhado/entalhada
quilted|acolchoado/acolchoada
padded|almofadado/almofadada
textured|texturizado/texturizada`,
cor: `# Cores básicas
red|vermelho/vermelha
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
# Vermelhos e rosas
crimson|carmesim
scarlet|escarlate
maroon|bordô
burgundy|vinho
ruby|rubi
cherry|cereja
coral|coral
salmon|salmão
magenta|magenta
fuchsia|fúcsia
rose|rosado/rosada
blush|rosa-claro
wine-red|vermelho-vinho
brick-red|vermelho-tijolo
bright red|vermelho-vivo/vermelha-viva
hot pink|rosa-choque
baby pink|rosa-bebê
# Azuis e verdes
navy|azul-marinho
turquoise|turquesa
teal|verde-azulado/verde-azulada
olive|verde-oliva
sky-blue|azul-celeste
light blue|azul-claro
dark green|verde-escuro
aqua|água
cyan|ciano
emerald|esmeralda
jade|jade
lime|verde-limão
mint|verde-menta
sage|verde-sálvia
forest-green|verde-floresta
royal blue|azul-royal
cobalt|azul-cobalto
indigo|índigo
azure|azul-anil
sea-green|verde-mar
bottle-green|verde-garrafa
powder-blue|azul-bebê
# Amarelos, laranjas e marrons
golden|dourado/dourada
mustard|mostarda
lemon|amarelo-limão
amber|âmbar
apricot|damasco
peach|pêssego
tan|bronzeado/bronzeada
chestnut|castanho/castanha
caramel|caramelo
chocolate|achocolatado/achocolatada
rust|ferrugem
khaki|cáqui
hazel|avelã
auburn|ruivo-acastanhado
sandy|areia
honey|cor de mel
ginger|ruivo/ruiva
saffron|açafrão
burnt orange|laranja-queimado
coffee|cor de café
# Roxos e lilases
lilac|lilás
lavender|lavanda
plum|ameixa
mauve|malva
orchid|orquídea
amethyst|ametista
eggplant|berinjela
grape|uva
# Neutros e metálicos
beige|bege
cream|creme
ivory|marfim
silver|prateado/prateada
bronze|cor de bronze
copper|acobreado/acobreada
charcoal|cor de carvão
slate|ardósia
pearl|perolado/perolada
metallic|metálico/metálica
off-white|branco-gelo
taupe|cinza-acastanhado
gunmetal|cinza-chumbo
champagne|champanhe
# Tom e brilho
dark|escuro/escura
pale|pálido/pálida
bright|vivo/viva
light|claro/clara
deep|profundo/profunda
vivid|vívido/vívida
pastel|pastel
neon|neon
dull|opaco/opaca
fluorescent|fluorescente
transparent|transparente
translucent|translúcido/translúcida
colorful|colorido/colorida
multicolored|multicolorido/multicolorida
colorless|incolor
shimmering|cintilante
rainbow|arco-íris
two-tone|bicolor
# Padrões
striped|listrado/listrada
spotted|manchado/manchada
checkered|xadrez
polka-dot|de bolinhas
plaid|xadrez escocês
floral|floral
paisley|paisley
patterned|estampado/estampada
tie-dyed|tingido/tingida
camouflage|camuflado/camuflada
tartan|tartã
speckled|salpicado/salpicada
dotted|pontilhado/pontilhada
zebra-striped|zebrado/zebrada
leopard-print|de oncinha
houndstooth|pied-de-poule
herringbone|em espinha de peixe
chevron|em chevron`,
origem: `# Américas
American|americano/americana
Brazilian|brasileiro/brasileira
Canadian|canadense
Mexican|mexicano/mexicana
Cuban|cubano/cubana
Argentine|argentino/argentina
Chilean|chileno/chilena
Peruvian|peruano/peruana
Colombian|colombiano/colombiana
Venezuelan|venezuelano/venezuelana
Uruguayan|uruguaio/uruguaia
Bolivian|boliviano/boliviana
Ecuadorian|equatoriano/equatoriana
Paraguayan|paraguaio/paraguaia
Jamaican|jamaicano/jamaicana
Haitian|haitiano/haitiana
Costa Rican|costarriquenho/costarriquenha
Panamanian|panamenho/panamenha
Guatemalan|guatemalteco/guatemalteca
Dominican|dominicano/dominicana
Puerto Rican|porto-riquenho/porto-riquenha
# Europa ocidental e sul
British|britânico/britânica
English|inglês/inglesa
Irish|irlandês/irlandesa
Scottish|escocês/escocesa
Welsh|galês/galesa
French|francês/francesa
German|alemão/alemã
Dutch|holandês/holandesa
Belgian|belga
Swiss|suíço/suíça
Austrian|austríaco/austríaca
Spanish|espanhol/espanhola
Portuguese|português/portuguesa
Italian|italiano/italiana
Maltese|maltês/maltesa
Luxembourgish|luxemburguês/luxemburguesa
Monegasque|monegasco/monegasca
# Europa norte e leste
Danish|dinamarquês/dinamarquesa
Swedish|sueco/sueca
Norwegian|norueguês/norueguesa
Finnish|finlandês/finlandesa
Icelandic|islandês/islandesa
Polish|polonês/polonesa
Russian|russo/russa
Ukrainian|ucraniano/ucraniana
Czech|tcheco/tcheca
Hungarian|húngaro/húngara
Romanian|romeno/romena
Bulgarian|búlgaro/búlgara
Serbian|sérvio/sérvia
Croatian|croata
Greek|grego/grega
Slovak|eslovaco/eslovaca
Estonian|estoniano/estoniana
Latvian|letão/letã
Lithuanian|lituano/lituana
# Ásia
Indian|indiano/indiana
Chinese|chinês/chinesa
Japanese|japonês/japonesa
Korean|coreano/coreana
Thai|tailandês/tailandesa
Vietnamese|vietnamita
Indonesian|indonésio/indonésia
Filipino|filipino/filipina
Malaysian|malaio/malaia
Pakistani|paquistanês/paquistanesa
Bangladeshi|bengalês/bengalesa
Nepalese|nepalês/nepalesa
Mongolian|mongol
Singaporean|singapuriano/singapuriana
Taiwanese|taiwanês/taiwanesa
Sri Lankan|cingalês/cingalesa
Cambodian|cambojano/cambojana
Burmese|birmanês/birmanesa
Kazakh|cazaque
Tibetan|tibetano/tibetana
# Oriente Médio e Norte da África
Arabic|árabe
Persian|persa
Turkish|turco/turca
Egyptian|egípcio/egípcia
Moroccan|marroquino/marroquina
Israeli|israelense
Lebanese|libanês/libanesa
Iraqi|iraquiano/iraquiana
Iranian|iraniano/iraniana
Saudi|saudita
Syrian|sírio/síria
Tunisian|tunisiano/tunisiana
Algerian|argelino/argelina
Jordanian|jordaniano/jordaniana
Emirati|emiradense
Qatari|catariano/catariana
Libyan|líbio/líbia
Palestinian|palestino/palestina
# África subsaariana
African|africano/africana
Nigerian|nigeriano/nigeriana
Kenyan|queniano/queniana
Ethiopian|etíope
Ghanaian|ganês/ganesa
South African|sul-africano/sul-africana
Senegalese|senegalês/senegalesa
Tanzanian|tanzaniano/tanzaniana
Ugandan|ugandense
Angolan|angolano/angolana
Mozambican|moçambicano/moçambicana
Congolese|congolês/congolesa
Zimbabwean|zimbabuano/zimbabuana
Cape Verdean|cabo-verdiano/cabo-verdiana
# Oceania
Australian|australiano/australiana
New Zealand|neozelandês/neozelandesa
Polynesian|polinésio/polinésia
Hawaiian|havaiano/havaiana
Fijian|fijiano/fijiana
Samoan|samoano/samoana
Tahitian|taitiano/taitiana
Maori|maori
Aboriginal|aborígene
# Continentes e regiões
Asian|asiático/asiática
European|europeu/europeia
Latin American|latino-americano/latino-americana
Nordic|nórdico/nórdica
Mediterranean|mediterrâneo/mediterrânea
Scandinavian|escandinavo/escandinava
Caribbean|caribenho/caribenha
Middle Eastern|do Oriente Médio
Western|ocidental
Eastern|oriental
Slavic|eslavo/eslava
Celtic|celta
Baltic|báltico/báltica
Alpine|alpino/alpina
Balkan|balcânico/balcânica
Oriental|oriental
Central American|centro-americano/centro-americana
South American|sul-americano/sul-americana
North American|norte-americano/norte-americana
# Cidades e regiões
Parisian|parisiense
Texan|texano/texana
Californian|californiano/californiana
Bavarian|bávaro/bávara
Venetian|veneziano/veneziana
Tuscan|toscano/toscana
Neapolitan|napolitano/napolitana
Sicilian|siciliano/siciliana
Viennese|vienense
Andalusian|andaluz/andaluza
Catalan|catalão/catalã
Basque|basco/basca
Siberian|siberiano/siberiana
New Yorker|nova-iorquino/nova-iorquina
Roman|romano/romana
Florentine|florentino/florentina
Milanese|milanês/milanesa
Amazonian|amazônico/amazônica
Bahian|baiano/baiana
Carioca|carioca
Paulista|paulista
Gaucho|gaúcho/gaúcha
Mineiro|mineiro/mineira
# Povos antigos e épocas
Victorian|vitoriano/vitoriana
Viking|viking
Aztec|asteca
Mayan|maia
Incan|inca
Ottoman|otomano/otomana
Byzantine|bizantino/bizantina
Elizabethan|elizabetano/elizabetana
Napoleonic|napoleônico/napoleônica
Mughal|mogol
Inuit|inuíte
Native American|indígena norte-americano/indígena norte-americana
Indigenous|indígena
Phoenician|fenício/fenícia
Mesopotamian|mesopotâmico/mesopotâmica
Etruscan|etrusco/etrusca`,
material: `# Madeira e fibras vegetais
wooden|de madeira
bamboo|de bambu
wicker|de vime
straw|de palha
cork|de cortiça
rattan|de rattan
oak|de carvalho
pine|de pinho
cedar|de cedro
mahogany|de mogno
teak|de teca
walnut|de nogueira
birch|de bétula
maple|de bordo
cherry-wood|de cerejeira
plywood|de compensado
hemp|de cânhamo
jute|de juta
cane|de cana
sisal|de sisal
balsa|de balsa
ebony|de ébano
sandalwood|de sândalo
driftwood|de madeira de naufrágio
# Metais
metal|de metal
steel|de aço
iron|de ferro
copper|de cobre
brass|de latão
tin|de lata
aluminum|de alumínio
titanium|de titânio
gold|de ouro
silver|de prata
bronze|de bronze
chrome|de cromo
nickel|de níquel
zinc|de zinco
lead|de chumbo
platinum|de platina
stainless-steel|de aço inoxidável
cast-iron|de ferro fundido
wrought-iron|de ferro forjado
galvanized|galvanizado/galvanizada
# Tecidos
cotton|de algodão
silk|de seda
woolen|de lã
linen|de linho
denim|de jeans
velvet|de veludo
nylon|de náilon
polyester|de poliéster
satin|de cetim
lace|de renda
cashmere|de caxemira
tweed|de tweed
corduroy|de veludo cotelê
flannel|de flanela
fleece|de lã sintética
canvas|de lona
felt|de feltro
mesh|de tela
knitted|de tricô
chiffon|de chiffon
terry|de toalha
wool-blend|de lã mista
organza|de organza
# Couro e peles
leather|de couro
fur|de pele
suede|de camurça
sheepskin|de pele de carneiro
snakeskin|de pele de cobra
faux-leather|de couro sintético
rawhide|de couro cru
crocodile|de couro de crocodilo
patent-leather|de couro envernizado
faux-fur|de pele sintética
# Pedra e minerais
stone|de pedra
marble|de mármore
granite|de granito
brick|de tijolo
concrete|de concreto
plaster|de gesso
slate|de ardósia
sandstone|de arenito
limestone|de calcário
cement|de cimento
quartz|de quartzo
diamond|de diamante
pearl|de pérola
coal|de carvão
sand|de areia
adobe|de adobe
obsidian|de obsidiana
# Vidro e cerâmica
glass|de vidro
crystal|de cristal
ceramic|de cerâmica
porcelain|de porcelana
clay|de barro
terracotta|de terracota
enamel|de esmalte
earthenware|de louça de barro
stoneware|de grés
mirrored|espelhado/espelhada
tempered-glass|de vidro temperado
stained-glass|de vitral
# Plásticos e sintéticos
plastic|de plástico
rubber|de borracha
foam|de espuma
vinyl|de vinil
acrylic|de acrílico
fiberglass|de fibra de vidro
resin|de resina
silicone|de silicone
latex|de látex
carbon-fiber|de fibra de carbono
synthetic|sintético/sintética
polystyrene|de isopor
neoprene|de neoprene
PVC|de PVC
# Papel e derivados
paper|de papel
cardboard|de papelão
wax|de cera
parchment|de pergaminho
tissue|de papel de seda
papier-mâché|de papel machê
rice-paper|de papel de arroz
recycled-paper|de papel reciclado
cellophane|de celofane
newspaper|de jornal
# Alimentos e outros
chocolate|de chocolate
sugar|de açúcar
cheese|de queijo
ice|de gelo
snow|de neve
dough|de massa
candy|de doce
salt|de sal
feather|de pena
bone|de osso
shell|de concha`,
proposito: `# Esporte e exercício
running|de corrida
walking|de caminhada
hiking|de trilha
swimming|de natação
cycling|de ciclismo
riding|de montaria
training|de treino
gym|de academia
sports|esportivo/esportiva
tennis|de tênis
football|de futebol
basketball|de basquete
volleyball|de vôlei
golf|de golfe
boxing|de boxe
skiing|de esqui
surfing|de surfe
climbing|de escalada
diving|de mergulho
skating|de patinação
rowing|de remo
yoga|de ioga
fitness|de ginástica
dancing|de dança
hunting|de caça
jogging|de corrida leve
wrestling|de luta
# Cozinha e refeição
cooking|de cozinhar
baking|de assar
dining|de jantar
serving|de servir
drinking|de beber
mixing|de misturar
cutting|de cortar
coffee|de café
tea|de chá
wine|de vinho
kitchen|de cozinha
frying|de fritar
roasting|de assar na brasa
grilling|de grelhar
salad|de salada
soup|de sopa
dinner|de jantar
breakfast|de café da manhã
lunch|de almoço
steak|de bife
cocktail|de coquetel
picnic|de piquenique
carving|de trinchar
measuring|de medir
cake|de bolo
bread|de pão
pasta|de macarrão
barbecue|de churrasco
beer|de cerveja
# Casa e limpeza
washing|de lavar
storage|de armazenamento
bath|de banho
bedroom|de quarto
cleaning|de limpeza
ironing|de passar roupa
sewing|de costura
laundry|de lavanderia
shower|de chuveiro
sleeping|de dormir
dressing|de vestir
shaving|de barbear
folding|de dobrar
gardening|de jardinagem
hanging|de pendurar
# Viagem e transporte
travel|de viagem
camping|de acampamento
driving|de direção
flying|de voo
sailing|de vela
racing|de corrida de velocidade
parking|de estacionamento
shipping|de remessa
delivery|de entrega
cargo|de carga
passenger|de passageiros
touring|de turismo
commuting|de deslocamento diário
cruising|de cruzeiro
trekking|de caminhada longa
packing|de embalagem
luggage|de bagagem
# Trabalho e estudo
office|de escritório
work|de trabalho
school|de escola
writing|de escrever
reading|de leitura
drawing|de desenho
painting|de pintura
typing|de digitação
meeting|de reunião
conference|de conferência
study|de estudo
learning|de aprendizagem
teaching|de ensino
business|de negócios
safety|de segurança
security|de segurança
research|de pesquisa
construction|de construção
repair|de reparo
# Eventos e ocasiões
party|de festa
wedding|de casamento
birthday|de aniversário
evening|de noite
beach|de praia
winter|de inverno
summer|de verão
holiday|de feriado
Christmas|de Natal
Halloween|de Halloween
graduation|de formatura
festival|de festival
carnival|de carnaval
anniversary|de aniversário de casamento
formal|de gala
casual|casual
spring|de primavera
autumn|de outono
funeral|de funeral
# Lazer, arte e cuidados
shopping|de compras
fishing|de pesca
baby|de bebê
music|de música
singing|de canto
playing|de brincar
gaming|de jogos
photography|de fotografia
concert|de show
theater|de teatro
cinema|de cinema
bird-watching|de observação de aves
pet|de animal de estimação
makeup|de maquiagem
hair|de cabelo
sun|de sol
rain|de chuva
medical|médico/médica`
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
/* linhas que começam com "#" abrem uma SUBCATEGORIA; as opções seguintes pertencem a ela (op.sub) */
const ADJ7 = ADJ7_META.map((m, i) => {
  let sub = ''; const ops = [];
  ADJ7_TXT[m.k].split('\n').forEach(l => {
    l = l.trim(); if(!l) return;
    if(l[0] === '#'){ sub = l.slice(1).trim(); return; }
    const [en, pt, fl] = l.split('|'), [pm, pf] = _par(pt);
    ops.push({ en, pm, pf, pre:fl === 'p', sub });
  });
  return Object.assign({ i, ord:i + 1 }, m, { ops, subs:[...new Set(ops.map(o => o.sub))] });
});
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
