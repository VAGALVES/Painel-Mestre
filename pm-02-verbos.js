/* ---- Banco de verbos — "work" é o padrão regular; os demais mostram os principais
   padrões de irregularidade (ABC, ABA, ABB, AAA) para o motor interativo. ---- */
const VERBS = [
  { id:"work",  label:"work · regular",       base:"work",  s3:"works",  ing:"working",  past:"worked", pp:"worked", col:[{en:"on a project", pt:"em um projeto"},{en:"from home", pt:"de casa"},{en:"as a team", pt:"em equipe"}] },
  { id:"go",    label:"go → went → gone",     base:"go",    s3:"goes",   ing:"going",    past:"went",   pp:"gone", col:[{en:"home", pt:"para casa"},{en:"to school", pt:"para a escola"},{en:"by car", pt:"de carro"}] },
  { id:"eat",   label:"eat → ate → eaten",    base:"eat",   s3:"eats",   ing:"eating",   past:"ate",    pp:"eaten", col:[{en:"out", pt:"fora"},{en:"healthy food", pt:"comida saudável"},{en:"too much", pt:"demais"}] },
  { id:"write", label:"write → wrote → written", base:"write", s3:"writes", ing:"writing", past:"wrote", pp:"written", col:[{en:"a letter", pt:"uma carta"},{en:"a report", pt:"um relatório"},{en:"in English", pt:"em inglês"}] },
  { id:"see",   label:"see → saw → seen",     base:"see",   s3:"sees",   ing:"seeing",   past:"saw",    pp:"seen", col:[{en:"a doctor", pt:"um médico"},{en:"the results", pt:"os resultados"},{en:"a movie", pt:"um filme"}] },
  { id:"take",  label:"take → took → taken",  base:"take",  s3:"takes",  ing:"taking",   past:"took",   pp:"taken", col:[{en:"the bus", pt:"o ônibus"},{en:"a taxi", pt:"um táxi"},{en:"the keys", pt:"as chaves"}] },
  { id:"come",  label:"come → came → come",   base:"come",  s3:"comes",  ing:"coming",   past:"came",   pp:"come", col:[{en:"home", pt:"para casa"},{en:"to the party", pt:"para a festa"},{en:"by train", pt:"de trem"}] },
  { id:"run",   label:"run → ran → run",      base:"run",   s3:"runs",   ing:"running",  past:"ran",    pp:"run", col:[{en:"in the park", pt:"no parque"},{en:"a marathon", pt:"uma maratona"},{en:"fast", pt:"rápido"}] },
  { id:"buy",   label:"buy → bought → bought", base:"buy",  s3:"buys",   ing:"buying",   past:"bought", pp:"bought", col:[{en:"a gift", pt:"um presente"},{en:"groceries", pt:"mantimentos"},{en:"online", pt:"pela internet"}] },
  { id:"think", label:"think → thought → thought", base:"think", s3:"thinks", ing:"thinking", past:"thought", pp:"thought", col:[{en:"about the future", pt:"sobre o futuro"},{en:"about it", pt:"sobre isso"},{en:"carefully", pt:"com cuidado"}] },
  { id:"put",   label:"put → put → put",      base:"put",   s3:"puts",   ing:"putting",  past:"put",    pp:"put", col:[{en:"it on the table", pt:"isso na mesa"},{en:"everything in place", pt:"tudo no lugar"},{en:"the keys in the drawer", pt:"as chaves na gaveta"}] },
  { id:"speak", label:"speak → spoke → spoken", base:"speak", s3:"speaks", ing:"speaking", past:"spoke", pp:"spoken", col:[{en:"English", pt:"inglês"},{en:"in public", pt:"em público"},{en:"slowly", pt:"devagar"}] },
  { id:"say",     label:"say → said → said",         base:"say",     s3:"says",     ing:"saying",     past:"said",     pp:"said", col:[{en:"the truth", pt:"a verdade"},{en:"something important", pt:"algo importante"},{en:"goodbye", pt:"tchau"}] },
  { id:"get",     label:"get → got → got",           base:"get",     s3:"gets",     ing:"getting",    past:"got",      pp:"got", col:[{en:"a job", pt:"um emprego"},{en:"a discount", pt:"um desconto"},{en:"good results", pt:"bons resultados"}] },
  { id:"make",    label:"make → made → made",        base:"make",    s3:"makes",    ing:"making",     past:"made",     pp:"made", col:[{en:"progress", pt:"progresso"},{en:"plans", pt:"planos"},{en:"a cake", pt:"um bolo"}] },
  { id:"know",    label:"know → knew → known",       base:"know",    s3:"knows",    ing:"knowing",    past:"knew",     pp:"known", col:[{en:"the answer", pt:"a resposta"},{en:"the truth", pt:"a verdade"},{en:"the way", pt:"o caminho"}] },
  { id:"give",    label:"give → gave → given",       base:"give",    s3:"gives",    ing:"giving",     past:"gave",     pp:"given", col:[{en:"a present", pt:"um presente"},{en:"an example", pt:"um exemplo"},{en:"advice", pt:"um conselho"}] },
  { id:"find",    label:"find → found → found",      base:"find",    s3:"finds",    ing:"finding",    past:"found",    pp:"found", col:[{en:"a solution", pt:"uma solução"},{en:"the keys", pt:"as chaves"},{en:"a good price", pt:"um bom preço"}] },
  { id:"tell",    label:"tell → told → told",        base:"tell",    s3:"tells",    ing:"telling",    past:"told",     pp:"told", col:[{en:"a story", pt:"uma história"},{en:"the truth", pt:"a verdade"},{en:"a secret", pt:"um segredo"}] },
  { id:"become",  label:"become → became → become",  base:"become",  s3:"becomes",  ing:"becoming",   past:"became",   pp:"become", col:[{en:"famous", pt:"famoso(a)"},{en:"rich", pt:"rico(a)"},{en:"stronger", pt:"mais forte"}] },
  { id:"leave",   label:"leave → left → left",       base:"leave",   s3:"leaves",   ing:"leaving",    past:"left",     pp:"left", col:[{en:"early", pt:"cedo"},{en:"home", pt:"de casa"},{en:"the room", pt:"da sala"}] },
  { id:"feel",    label:"feel → felt → felt",        base:"feel",    s3:"feels",    ing:"feeling",    past:"felt",     pp:"felt", col:[{en:"the difference", pt:"a diferença"},{en:"pain", pt:"dor"},{en:"the pressure", pt:"a pressão"}] },
  { id:"bring",   label:"bring → brought → brought", base:"bring",   s3:"brings",   ing:"bringing",   past:"brought",  pp:"brought", col:[{en:"good news", pt:"boas notícias"},{en:"the documents", pt:"os documentos"},{en:"a friend", pt:"um amigo"}] },
  { id:"begin",   label:"begin → began → begun",     base:"begin",   s3:"begins",   ing:"beginning",  past:"began",    pp:"begun", col:[{en:"a new project", pt:"um projeto novo"},{en:"again", pt:"de novo"},{en:"at nine", pt:"às nove"}] },
  { id:"keep",    label:"keep → kept → kept",        base:"keep",    s3:"keeps",    ing:"keeping",    past:"kept",     pp:"kept", col:[{en:"the focus", pt:"o foco"},{en:"a routine", pt:"uma rotina"},{en:"the promise", pt:"a promessa"}] },
  { id:"hold",    label:"hold → held → held",        base:"hold",    s3:"holds",    ing:"holding",    past:"held",     pp:"held", col:[{en:"my hand", pt:"minha mão"},{en:"the door", pt:"a porta"},{en:"the phone", pt:"o telefone"}] },
  { id:"meet",    label:"meet → met → met",          base:"meet",    s3:"meets",    ing:"meeting",    past:"met",      pp:"met", col:[{en:"a friend", pt:"um amigo"},{en:"the team", pt:"a equipe"},{en:"new people", pt:"pessoas novas"}] },
  { id:"win",     label:"win → won → won",           base:"win",     s3:"wins",     ing:"winning",    past:"won",      pp:"won", col:[{en:"the game", pt:"o jogo"},{en:"a prize", pt:"um prêmio"},{en:"the election", pt:"a eleição"}] },
  { id:"teach",   label:"teach → taught → taught",   base:"teach",   s3:"teaches",  ing:"teaching",   past:"taught",   pp:"taught", col:[{en:"English", pt:"inglês"},{en:"children", pt:"crianças"},{en:"online", pt:"online"}] },
  { id:"sell",    label:"sell → sold → sold",        base:"sell",    s3:"sells",    ing:"selling",    past:"sold",     pp:"sold", col:[{en:"the house", pt:"a casa"},{en:"products online", pt:"produtos online"},{en:"everything", pt:"tudo"}] },
  { id:"send",    label:"send → sent → sent",        base:"send",    s3:"sends",    ing:"sending",    past:"sent",     pp:"sent", col:[{en:"an email", pt:"um e-mail"},{en:"a message", pt:"uma mensagem"},{en:"the report", pt:"o relatório"}] },
  { id:"break",   label:"break → broke → broken",    base:"break",   s3:"breaks",   ing:"breaking",   past:"broke",    pp:"broken", col:[{en:"the rules", pt:"as regras"},{en:"a record", pt:"um recorde"},{en:"the silence", pt:"o silêncio"}] },
  { id:"drive",   label:"drive → drove → driven",    base:"drive",   s3:"drives",   ing:"driving",    past:"drove",    pp:"driven", col:[{en:"to work", pt:"até o trabalho"},{en:"carefully", pt:"com cuidado"},{en:"at night", pt:"à noite"}] },
  { id:"choose",  label:"choose → chose → chosen",   base:"choose",  s3:"chooses",  ing:"choosing",   past:"chose",    pp:"chosen", col:[{en:"the best option", pt:"a melhor opção"},{en:"a career", pt:"uma carreira"},{en:"wisely", pt:"com sabedoria"}] },
  { id:"wear",    label:"wear → wore → worn",        base:"wear",    s3:"wears",    ing:"wearing",    past:"wore",     pp:"worn", col:[{en:"a suit", pt:"um terno"},{en:"something comfortable", pt:"algo confortável"},{en:"black", pt:"preto"}] },
  { id:"fall",    label:"fall → fell → fallen",      base:"fall",    s3:"falls",    ing:"falling",    past:"fell",     pp:"fallen", col:[{en:"on the floor", pt:"no chão"},{en:"from the stairs", pt:"da escada"},{en:"into the trap", pt:"na armadilha"}] },
  { id:"forget",  label:"forget → forgot → forgotten", base:"forget", s3:"forgets", ing:"forgetting", past:"forgot",   pp:"forgotten", col:[{en:"the password", pt:"a senha"},{en:"my keys", pt:"minhas chaves"},{en:"the appointment", pt:"o compromisso"}] },
  { id:"grow",    label:"grow → grew → grown",       base:"grow",    s3:"grows",    ing:"growing",    past:"grew",     pp:"grown", col:[{en:"fast", pt:"rápido"},{en:"professionally", pt:"profissionalmente"},{en:"a lot", pt:"muito"}] },
  { id:"catch",   label:"catch → caught → caught",   base:"catch",   s3:"catches",  ing:"catching",   past:"caught",   pp:"caught", col:[{en:"the ball", pt:"a bola"},{en:"the thief", pt:"o ladrão"},{en:"the rope", pt:"a corda"}] },
  { id:"sleep",   label:"sleep → slept → slept",     base:"sleep",   s3:"sleeps",   ing:"sleeping",   past:"slept",    pp:"slept", col:[{en:"eight hours", pt:"oito horas"},{en:"well", pt:"bem"},{en:"on the couch", pt:"no sofá"}] },
  { id:"arise",       label:"arise → arose → arisen",         base:"arise",       s3:"arises",       ing:"arising",       past:"arose",     pp:"arisen", col:[{en:"from the data", pt:"dos dados"},{en:"unexpectedly", pt:"inesperadamente"},{en:"naturally", pt:"naturalmente"}] },
  { id:"imagine",     label:"imagine · regular",              base:"imagine",     s3:"imagines",     ing:"imagining",     past:"imagined",  pp:"imagined", col:[{en:"the future", pt:"o futuro"},{en:"a better world", pt:"um mundo melhor"},{en:"the scene", pt:"a cena"}] },
  { id:"join",        label:"join · regular",                 base:"join",        s3:"joins",        ing:"joining",       past:"joined",    pp:"joined", col:[{en:"the pieces", pt:"as peças"},{en:"the two parts", pt:"as duas partes"},{en:"forces", pt:"forças"}] },
  { id:"need",        label:"need · regular",                 base:"need",        s3:"needs",        ing:"needing",       past:"needed",    pp:"needed", col:[{en:"help", pt:"de ajuda"},{en:"more time", pt:"de mais tempo"},{en:"a break", pt:"de uma pausa"}] },
  { id:"overcome",    label:"overcome → overcame → overcome", base:"overcome",    s3:"overcomes",    ing:"overcoming",    past:"overcame",  pp:"overcome", col:[{en:"the fear", pt:"o medo"},{en:"obstacles", pt:"obstáculos"},{en:"the crisis", pt:"a crise"}] },
  { id:"quit",        label:"quit → quit → quit",             base:"quit",        s3:"quits",        ing:"quitting",      past:"quit",      pp:"quit", col:[{en:"the job", pt:"do emprego"},{en:"the game", pt:"do jogo"},{en:"the course", pt:"do curso"}] },
  { id:"understand",  label:"understand → understood → understood", base:"understand", s3:"understands", ing:"understanding", past:"understood", pp:"understood", col:[{en:"the problem", pt:"o problema"},{en:"the rules", pt:"as regras"},{en:"the lesson", pt:"a lição"}] },
  { id:"visit",       label:"visit · regular",                base:"visit",       s3:"visits",       ing:"visiting",      past:"visited",   pp:"visited", col:[{en:"my family", pt:"minha família"},{en:"a museum", pt:"um museu"},{en:"the client", pt:"o cliente"}] },
  { id:"x-ray",       label:"x-ray · regular",                base:"x-ray",       s3:"x-rays",       ing:"x-raying",      past:"x-rayed",   pp:"x-rayed", col:[{en:"the chest", pt:"o tórax"},{en:"the luggage", pt:"a bagagem"},{en:"the hand", pt:"a mão"}] },
  { id:"yell",        label:"yell · regular",                 base:"yell",        s3:"yells",        ing:"yelling",       past:"yelled",    pp:"yelled", col:[{en:"at the TV", pt:"com a TV"},{en:"loudly", pt:"alto"},{en:"for help", pt:"por socorro"}] },
  { id:"zoom",        label:"zoom · regular",                 base:"zoom",        s3:"zooms",        ing:"zooming",       past:"zoomed",    pp:"zoomed", col:[{en:"out the door", pt:"porta afora"},{en:"down the street", pt:"pela rua"},{en:"ahead", pt:"na frente"}] },
  { id:"give-up", label:"give up → gave up → given up", base:"give", s3:"gives", ing:"giving", past:"gave", pp:"given", prt:"up", phrasal:true, col:[{en:"smoking", pt:"de fumar"},{en:"the idea", pt:"da ideia"},{en:"too easily", pt:"fácil demais"}] },
  { id:"find-out", label:"find out → found out → found out", base:"find", s3:"finds", ing:"finding", past:"found", pp:"found", prt:"out", phrasal:true, col:[{en:"the truth", pt:"a verdade"},{en:"the answer", pt:"a resposta"},{en:"later", pt:"depois"}] },
  { id:"look-after", label:"look after → looked after → looked after", base:"look", s3:"looks", ing:"looking", past:"looked", pp:"looked", prt:"after", phrasal:true, col:[{en:"the children", pt:"das crianças"},{en:"my parents", pt:"dos meus pais"},{en:"the house", pt:"da casa"}] },
  { id:"look-for", label:"look for → looked for → looked for", base:"look", s3:"looks", ing:"looking", past:"looked", pp:"looked", prt:"for", phrasal:true, col:[{en:"a job", pt:"um emprego"},{en:"the keys", pt:"as chaves"},{en:"an apartment", pt:"um apartamento"}] },
  { id:"put-off", label:"put off → put off → put off", base:"put", s3:"puts", ing:"putting", past:"put", pp:"put", prt:"off", phrasal:true, col:[{en:"the meeting", pt:"a reunião"},{en:"the decision", pt:"a decisão"},{en:"the trip", pt:"a viagem"}] },
  { id:"get-up", label:"get up → got up → got up", base:"get", s3:"gets", ing:"getting", past:"got", pp:"got", prt:"up", phrasal:true, col:[{en:"early", pt:"cedo"},{en:"late", pt:"tarde"},{en:"at six", pt:"às seis"}] },
  { id:"come-back", label:"come back → came back → come back", base:"come", s3:"comes", ing:"coming", past:"came", pp:"come", prt:"back", phrasal:true, col:[{en:"home", pt:"para casa"},{en:"later", pt:"depois"},{en:"next week", pt:"semana que vem"}] },
  { id:"turn-on", label:"turn on → turned on → turned on", base:"turn", s3:"turns", ing:"turning", past:"turned", pp:"turned", prt:"on", phrasal:true, col:[{en:"the light", pt:"a luz"},{en:"the computer", pt:"o computador"},{en:"the radio", pt:"o rádio"}] },
  { id:"run-out", label:"run out → ran out → run out", base:"run", s3:"runs", ing:"running", past:"ran", pp:"run", prt:"out", phrasal:true, col:[{en:"of time", pt:"de tempo"},{en:"of money", pt:"de dinheiro"},{en:"of patience", pt:"de paciência"}] },
  { id:"take-off", label:"take off → took off → taken off", base:"take", s3:"takes", ing:"taking", past:"took", pp:"taken", prt:"off", phrasal:true, col:[{en:"your shoes", pt:"os sapatos"},{en:"the jacket", pt:"a jaqueta"},{en:"the mask", pt:"a máscara"}] },
  { id:"carry-on", label:"carry on → carried on → carried on", base:"carry", s3:"carries", ing:"carrying", past:"carried", pp:"carried", prt:"on", phrasal:true, col:[{en:"with the plan", pt:"com o plano"},{en:"as usual", pt:"normalmente"},{en:"without me", pt:"sem mim"}] },
  { id:"work-out", label:"work out → worked out → worked out", base:"work", s3:"works", ing:"working", past:"worked", pp:"worked", prt:"out", phrasal:true, col:[{en:"at the gym", pt:"na academia"},{en:"every morning", pt:"toda manhã"},{en:"twice a week", pt:"duas vezes por semana"}] },
  { id:"agree", label:"agree · regular", base:"agree", s3:"agrees", ing:"agreeing", past:"agreed", pp:"agreed", col:[{en:"with the plan", pt:"com o plano"},{en:"on the price", pt:"com o preço"},{en:"completely", pt:"completamente"}] },
  { id:"call", label:"call · regular", base:"call", s3:"calls", ing:"calling", past:"called", pp:"called", col:[{en:"the office", pt:"para o escritório"},{en:"a friend", pt:"para um amigo"},{en:"later", pt:"mais tarde"}] },
  { id:"carry", label:"carry · regular", base:"carry", s3:"carries", ing:"carrying", past:"carried", pp:"carried", col:[{en:"the bags", pt:"as sacolas"},{en:"the weight", pt:"o peso"},{en:"everything", pt:"tudo"}] },
  { id:"check", label:"check · regular", base:"check", s3:"checks", ing:"checking", past:"checked", pp:"checked", col:[{en:"the results", pt:"os resultados"},{en:"the email", pt:"o e-mail"},{en:"twice", pt:"duas vezes"}] },
  { id:"clean", label:"clean · regular", base:"clean", s3:"cleans", ing:"cleaning", past:"cleaned", pp:"cleaned", col:[{en:"the house", pt:"a casa"},{en:"the kitchen", pt:"a cozinha"},{en:"everything", pt:"tudo"}] },
  { id:"close", label:"close · regular", base:"close", s3:"closes", ing:"closing", past:"closed", pp:"closed", col:[{en:"the door", pt:"a porta"},{en:"the deal", pt:"o negócio"},{en:"the account", pt:"a conta"}] },
  { id:"count", label:"count · regular", base:"count", s3:"counts", ing:"counting", past:"counted", pp:"counted", col:[{en:"on you", pt:"com você"},{en:"the money", pt:"o dinheiro"},{en:"the votes", pt:"os votos"}] },
  { id:"cross", label:"cross · regular", base:"cross", s3:"crosses", ing:"crossing", past:"crossed", pp:"crossed", col:[{en:"the street", pt:"a rua"},{en:"the border", pt:"a fronteira"},{en:"the bridge", pt:"a ponte"}] },
  { id:"cut", label:"cut → cut → cut", base:"cut", s3:"cuts", ing:"cutting", past:"cut", pp:"cut", col:[{en:"the costs", pt:"os custos"},{en:"the paper", pt:"o papel"},{en:"my hair", pt:"meu cabelo"}] },
  { id:"deal", label:"deal → dealt → dealt", base:"deal", s3:"deals", ing:"dealing", past:"dealt", pp:"dealt", col:[{en:"with the problem", pt:"com o problema"},{en:"with clients", pt:"com clientes"},{en:"with pressure", pt:"com pressão"}] },
  { id:"decide", label:"decide · regular", base:"decide", s3:"decides", ing:"deciding", past:"decided", pp:"decided", col:[{en:"the date", pt:"a data"},{en:"everything", pt:"tudo"},{en:"quickly", pt:"rápido"}] },
  { id:"do", label:"do → did → done", base:"do", s3:"does", ing:"doing", past:"did", pp:"done", col:[{en:"the work", pt:"o trabalho"},{en:"my best", pt:"o meu melhor"},{en:"the dishes", pt:"a louça"}] },
  { id:"draw", label:"draw → drew → drawn", base:"draw", s3:"draws", ing:"drawing", past:"drew", pp:"drawn", col:[{en:"a picture", pt:"uma figura"},{en:"a map", pt:"um mapa"},{en:"a line", pt:"uma linha"}] },
  { id:"dream", label:"dream · regular", base:"dream", s3:"dreams", ing:"dreaming", past:"dreamed", pp:"dreamed", col:[{en:"about the future", pt:"com o futuro"},{en:"of a better life", pt:"com uma vida melhor"},{en:"every night", pt:"toda noite"}] },
  { id:"drink", label:"drink → drank → drunk", base:"drink", s3:"drinks", ing:"drinking", past:"drank", pp:"drunk", col:[{en:"water", pt:"água"},{en:"coffee", pt:"café"},{en:"too much", pt:"demais"}] },
  { id:"drop", label:"drop · regular", base:"drop", s3:"drops", ing:"dropping", past:"dropped", pp:"dropped", col:[{en:"the glass", pt:"o copo"},{en:"the keys", pt:"as chaves"},{en:"everything", pt:"tudo"}] },
  { id:"face", label:"face · regular", base:"face", s3:"faces", ing:"facing", past:"faced", pp:"faced", col:[{en:"the problem", pt:"o problema"},{en:"the truth", pt:"a verdade"},{en:"the consequences", pt:"as consequências"}] },
  { id:"fight", label:"fight → fought → fought", base:"fight", s3:"fights", ing:"fighting", past:"fought", pp:"fought", col:[{en:"for my rights", pt:"pelos meus direitos"},{en:"against injustice", pt:"contra a injustiça"},{en:"hard", pt:"muito"}] },
  { id:"figure", label:"figure · regular", base:"figure", s3:"figures", ing:"figuring", past:"figured", pp:"figured", col:[{en:"that it works", pt:"que funciona"},{en:"that he knows", pt:"que ele sabe"},{en:"that it is possible", pt:"que é possível"}] },
  { id:"fill", label:"fill · regular", base:"fill", s3:"fills", ing:"filling", past:"filled", pp:"filled", col:[{en:"the form", pt:"o formulário"},{en:"the gap", pt:"a lacuna"},{en:"the glass", pt:"o copo"}] },
  { id:"follow", label:"follow · regular", base:"follow", s3:"follows", ing:"following", past:"followed", pp:"followed", col:[{en:"the rules", pt:"as regras"},{en:"the instructions", pt:"as instruções"},{en:"the news", pt:"as notícias"}] },
  { id:"have", label:"have → had → had", base:"have", s3:"has", ing:"having", past:"had", pp:"had", col:[{en:"time", pt:"tempo"},{en:"a meeting", pt:"uma reunião"},{en:"an idea", pt:"uma ideia"}] },
  { id:"lay", label:"lay → laid → laid", base:"lay", s3:"lays", ing:"laying", past:"laid", pp:"laid", col:[{en:"the table", pt:"a mesa"},{en:"the foundation", pt:"a base"},{en:"the blame on me", pt:"a culpa em mim"}] },
  { id:"let", label:"let → let → let", base:"let", s3:"lets", ing:"letting", past:"let", pp:"let", col:[{en:"it go", pt:"pra lá"},{en:"her talk", pt:"ela falar"},{en:"them decide", pt:"eles decidirem"}] },
  { id:"like", label:"like · regular", base:"like", s3:"likes", ing:"liking", past:"liked", pp:"liked", col:[{en:"the idea", pt:"da ideia"},{en:"this place", pt:"deste lugar"},{en:"the music", pt:"da música"}] },
  { id:"live", label:"live · regular", base:"live", s3:"lives", ing:"living", past:"lived", pp:"lived", col:[{en:"in peace", pt:"em paz"},{en:"abroad", pt:"no exterior"},{en:"alone", pt:"sozinho(a)"}] },
  { id:"look", label:"look · regular", base:"look", s3:"looks", ing:"looking", past:"looked", pp:"looked", col:[{en:"at the screen", pt:"para a tela"},{en:"in the mirror", pt:"no espelho"},{en:"carefully", pt:"com atenção"}] },
  { id:"lose", label:"lose → lost → lost", base:"lose", s3:"loses", ing:"losing", past:"lost", pp:"lost", col:[{en:"the keys", pt:"as chaves"},{en:"the game", pt:"o jogo"},{en:"my patience", pt:"a paciência"}] },
  { id:"pass", label:"pass · regular", base:"pass", s3:"passes", ing:"passing", past:"passed", pp:"passed", col:[{en:"the test", pt:"na prova"},{en:"the salt", pt:"o sal"},{en:"the ball", pt:"a bola"}] },
  { id:"pay", label:"pay → paid → paid", base:"pay", s3:"pays", ing:"paying", past:"paid", pp:"paid", col:[{en:"the bill", pt:"a conta"},{en:"the rent", pt:"o aluguel"},{en:"in cash", pt:"à vista"}] },
  { id:"pick", label:"pick · regular", base:"pick", s3:"picks", ing:"picking", past:"picked", pp:"picked", col:[{en:"the best one", pt:"o melhor"},{en:"a color", pt:"uma cor"},{en:"a team", pt:"um time"}] },
  { id:"play", label:"play · regular", base:"play", s3:"plays", ing:"playing", past:"played", pp:"played", col:[{en:"football", pt:"futebol"},{en:"chess", pt:"xadrez"},{en:"with friends", pt:"com os amigos"}] },
  { id:"pull", label:"pull · regular", base:"pull", s3:"pulls", ing:"pulling", past:"pulled", pp:"pulled", col:[{en:"the rope", pt:"a corda"},{en:"the door", pt:"a porta"},{en:"hard", pt:"com força"}] },
  { id:"push", label:"push · regular", base:"push", s3:"pushes", ing:"pushing", past:"pushed", pp:"pushed", col:[{en:"the button", pt:"o botão"},{en:"the car", pt:"o carro"},{en:"too hard", pt:"forte demais"}] },
  { id:"raise", label:"raise · regular", base:"raise", s3:"raises", ing:"raising", past:"raised", pp:"raised", col:[{en:"my hand", pt:"a mão"},{en:"the flag", pt:"a bandeira"},{en:"the bar", pt:"o nível"}] },
  { id:"read", label:"read → read → read", base:"read", s3:"reads", ing:"reading", past:"read", pp:"read", col:[{en:"the book", pt:"o livro"},{en:"the news", pt:"as notícias"},{en:"out loud", pt:"em voz alta"}] },
  { id:"return", label:"return · regular", base:"return", s3:"returns", ing:"returning", past:"returned", pp:"returned", col:[{en:"home", pt:"para casa"},{en:"to work", pt:"ao trabalho"},{en:"next week", pt:"semana que vem"}] },
  { id:"ride", label:"ride → rode → ridden", base:"ride", s3:"rides", ing:"riding", past:"rode", pp:"ridden", col:[{en:"a bike", pt:"de bicicleta"},{en:"a horse", pt:"a cavalo"},{en:"to school", pt:"até a escola"}] },
  { id:"save", label:"save · regular", base:"save", s3:"saves", ing:"saving", past:"saved", pp:"saved", col:[{en:"the file", pt:"o arquivo"},{en:"a life", pt:"uma vida"},{en:"the project", pt:"o projeto"}] },
  { id:"set", label:"set → set → set", base:"set", s3:"sets", ing:"setting", past:"set", pp:"set", col:[{en:"the rules", pt:"as regras"},{en:"a goal", pt:"uma meta"},{en:"the date", pt:"a data"}] },
  { id:"show", label:"show → showed → shown", base:"show", s3:"shows", ing:"showing", past:"showed", pp:"shown", col:[{en:"the results", pt:"os resultados"},{en:"the way", pt:"o caminho"},{en:"the photos", pt:"as fotos"}] },
  { id:"stand", label:"stand → stood → stood", base:"stand", s3:"stands", ing:"standing", past:"stood", pp:"stood", col:[{en:"the pressure", pt:"a pressão"},{en:"the noise", pt:"o barulho"},{en:"the pain", pt:"a dor"}] },
  { id:"stay", label:"stay · regular", base:"stay", s3:"stays", ing:"staying", past:"stayed", pp:"stayed", col:[{en:"at home", pt:"em casa"},{en:"in a hotel", pt:"em um hotel"},{en:"calm", pt:"calmo(a)"}] },
  { id:"step", label:"step · regular", base:"step", s3:"steps", ing:"stepping", past:"stepped", pp:"stepped", col:[{en:"on the brake", pt:"no freio"},{en:"carefully", pt:"com cuidado"},{en:"forward", pt:"à frente"}] },
  { id:"stop", label:"stop · regular", base:"stop", s3:"stops", ing:"stopping", past:"stopped", pp:"stopped", col:[{en:"the car", pt:"o carro"},{en:"the noise", pt:"o barulho"},{en:"immediately", pt:"imediatamente"}] },
  { id:"talk", label:"talk · regular", base:"talk", s3:"talks", ing:"talking", past:"talked", pp:"talked", col:[{en:"about work", pt:"sobre trabalho"},{en:"with the team", pt:"com a equipe"},{en:"openly", pt:"abertamente"}] },
  { id:"throw", label:"throw → threw → thrown", base:"throw", s3:"throws", ing:"throwing", past:"threw", pp:"thrown", col:[{en:"the ball", pt:"a bola"},{en:"the dice", pt:"os dados"},{en:"the rope", pt:"a corda"}] },
  { id:"turn", label:"turn · regular", base:"turn", s3:"turns", ing:"turning", past:"turned", pp:"turned", col:[{en:"the page", pt:"a página"},{en:"left", pt:"à esquerda"},{en:"the key", pt:"a chave"}] },
  { id:"wait", label:"wait · regular", base:"wait", s3:"waits", ing:"waiting", past:"waited", pp:"waited", col:[{en:"for the bus", pt:"o ônibus"},{en:"for an answer", pt:"uma resposta"},{en:"in line", pt:"na fila"}] },
  { id:"walk", label:"walk · regular", base:"walk", s3:"walks", ing:"walking", past:"walked", pp:"walked", col:[{en:"to work", pt:"até o trabalho"},{en:"in the park", pt:"no parque"},{en:"every morning", pt:"toda manhã"}] },
  { id:"wash", label:"wash · regular", base:"wash", s3:"washes", ing:"washing", past:"washed", pp:"washed", col:[{en:"the car", pt:"o carro"},{en:"the dishes", pt:"a louça"},{en:"my hands", pt:"as mãos"}] }
];
function verbById(id){ return VERBS.find(v=>v.id===id) || VERBS[0]; }

function genFact(tempo,aspecto,formato,p,verb){
  const v = verb || verbById('work');
  /* Verbos frasais carregam uma partícula (give **up**, look **after**) que não flexiona:
     ela fica neutra e sempre depois da forma conjugada — só o núcleo verbal recebe a marcação. */
  const prt = v.prt ? ' ' + v.prt : '';
  const base = v.base + prt;
  const ingM = markedForm(v.base, v.ing) + prt, pastM = markedForm(v.base, v.past) + prt,
        ppM = markedForm(v.base, v.pp) + prt, s3M = markedForm(v.base, v.s3) + prt;
  let text, structure; const q = formato==='pergunta' || formato==='pergunta_negativa';
  if(tempo==='present'){
    if(aspecto==='simples'){
      if(formato==='afirmativa') text = `${p} ${IS_3SG(p)?s3M:base}`;
      else if(formato==='negativa') text = `${p} ${M(doPresNeg(p))} ${base}`;
      else if(formato==='pergunta') text = `${M(cap(doPres(p)))} ${subjLower(p)} ${base}`;
      else text = `${M(cap(doPresNeg(p)))} ${subjLower(p)} ${base}`;
      structure = "Sujeito + verbo (forma base) / do-support";
    } else if(aspecto==='continuo'){
      const be=bePres(p);
      if(formato==='afirmativa') text = `${p} ${M(be)} ${ingM}`;
      else if(formato==='negativa'){ const nb=negBe(p,'present'); text = `${nb.subj}${M(nb.marker)} ${ingM}`; }
      else if(formato==='pergunta') text = `${M(cap(be))} ${subjLower(p)} ${ingM}`;
      else { const nq=negBeQ(p,'present'); text = `${M(nq.marker)} ${nq.subj} ${ingM}`; }
      structure = "Sujeito + am/is/are + V-ing";
    } else if(aspecto==='perfeito'){
      const h=havePres(p), hn=havePresNeg(p);
      if(formato==='afirmativa') text = `${p} ${M(h)} ${ppM}`;
      else if(formato==='negativa') text = `${p} ${M(hn)} ${ppM}`;
      else if(formato==='pergunta') text = `${M(cap(h))} ${subjLower(p)} ${ppM}`;
      else text = `${M(cap(hn))} ${subjLower(p)} ${ppM}`;
      structure = "Sujeito + have/has + particípio";
    } else {
      const h=havePres(p), hn=havePresNeg(p);
      if(formato==='afirmativa') text = `${p} ${M(h)} ${M('been')} ${ingM}`;
      else if(formato==='negativa') text = `${p} ${M(hn)} ${M('been')} ${ingM}`;
      else if(formato==='pergunta') text = `${M(cap(h))} ${subjLower(p)} ${M('been')} ${ingM}`;
      else text = `${M(cap(hn))} ${subjLower(p)} ${M('been')} ${ingM}`;
      structure = "Sujeito + have/has been + V-ing";
    }
  } else if(tempo==='past'){
    if(aspecto==='simples'){
      if(formato==='afirmativa') text = `${p} ${pastM}`;
      else if(formato==='negativa') text = `${p} ${M("didn't")} ${base}`;
      else if(formato==='pergunta') text = `${M('Did')} ${subjLower(p)} ${base}`;
      else text = `${M("Didn't")} ${subjLower(p)} ${base}`;
      structure = "Sujeito + verbo+ed (ou irregular) / did";
    } else if(aspecto==='continuo'){
      const be=bePast(p);
      if(formato==='afirmativa') text = `${p} ${M(be)} ${ingM}`;
      else if(formato==='negativa'){ const nb=negBe(p,'past'); text = `${nb.subj}${M(nb.marker)} ${ingM}`; }
      else if(formato==='pergunta') text = `${M(cap(be))} ${subjLower(p)} ${ingM}`;
      else { const nq=negBeQ(p,'past'); text = `${M(nq.marker)} ${nq.subj} ${ingM}`; }
      structure = "Sujeito + was/were + V-ing";
    } else if(aspecto==='perfeito'){
      if(formato==='afirmativa') text = `${p} ${M('had')} ${ppM}`;
      else if(formato==='negativa') text = `${p} ${M("hadn't")} ${ppM}`;
      else if(formato==='pergunta') text = `${M('Had')} ${subjLower(p)} ${ppM}`;
      else text = `${M("Hadn't")} ${subjLower(p)} ${ppM}`;
      structure = "Sujeito + had + particípio";
    } else {
      if(formato==='afirmativa') text = `${p} ${M('had')} ${M('been')} ${ingM}`;
      else if(formato==='negativa') text = `${p} ${M("hadn't")} ${M('been')} ${ingM}`;
      else if(formato==='pergunta') text = `${M('Had')} ${subjLower(p)} ${M('been')} ${ingM}`;
      else text = `${M("Hadn't")} ${subjLower(p)} ${M('been')} ${ingM}`;
      structure = "Sujeito + had been + V-ing";
    }
  } else {
    if(aspecto==='simples'){
      if(formato==='afirmativa') text = `${p} ${M('will')} ${base}`;
      else if(formato==='negativa') text = `${p} ${M("won't")} ${base}`;
      else if(formato==='pergunta') text = `${M('Will')} ${subjLower(p)} ${base}`;
      else text = `${M("Won't")} ${subjLower(p)} ${base}`;
      structure = "Sujeito + will + verbo";
    } else if(aspecto==='continuo'){
      if(formato==='afirmativa') text = `${p} ${M('will')} ${M('be')} ${ingM}`;
      else if(formato==='negativa') text = `${p} ${M("won't")} ${M('be')} ${ingM}`;
      else if(formato==='pergunta') text = `${M('Will')} ${subjLower(p)} ${M('be')} ${ingM}`;
      else text = `${M("Won't")} ${subjLower(p)} ${M('be')} ${ingM}`;
      structure = "Sujeito + will be + V-ing";
    } else if(aspecto==='perfeito'){
      if(formato==='afirmativa') text = `${p} ${M('will')} ${M('have')} ${ppM}`;
      else if(formato==='negativa') text = `${p} ${M("won't")} ${M('have')} ${ppM}`;
      else if(formato==='pergunta') text = `${M('Will')} ${subjLower(p)} ${M('have')} ${ppM}`;
      else text = `${M("Won't")} ${subjLower(p)} ${M('have')} ${ppM}`;
      structure = "Sujeito + will have + particípio";
    } else {
      if(formato==='afirmativa') text = `${p} ${M('will')} ${M('have been')} ${ingM}`;
      else if(formato==='negativa') text = `${p} ${M("won't")} ${M('have been')} ${ingM}`;
      else if(formato==='pergunta') text = `${M('Will')} ${subjLower(p)} ${M('have been')} ${ingM}`;
      else text = `${M("Won't")} ${subjLower(p)} ${M('have been')} ${ingM}`;
      structure = "Sujeito + will have been + V-ing";
    }
  }
  return {text, isQuestion:q, structure};
}

function genState(tempo,aspecto,formato,p){
  const adj="tired";
  let text, structure; const q = formato==='pergunta' || formato==='pergunta_negativa';
  if(tempo==='present'){
    if(aspecto==='simples'){
      const be=bePres(p);
      if(formato==='afirmativa') text = `${p} ${M(be)} ${adj}`;
      else if(formato==='negativa'){ const nb=negBe(p,'present'); text = `${nb.subj}${M(nb.marker)} ${adj}`; }
      else if(formato==='pergunta') text = `${M(cap(be))} ${subjLower(p)} ${adj}`;
      else { const nq=negBeQ(p,'present'); text = `${M(nq.marker)} ${nq.subj} ${adj}`; }
      structure = "Sujeito + am/is/are";
    } else {
      const h=havePres(p), hn=havePresNeg(p);
      if(formato==='afirmativa') text = `${p} ${M(h)} ${M('been')} ${adj}`;
      else if(formato==='negativa') text = `${p} ${M(hn)} ${M('been')} ${adj}`;
      else if(formato==='pergunta') text = `${M(cap(h))} ${subjLower(p)} ${M('been')} ${adj}`;
      else text = `${M(cap(hn))} ${subjLower(p)} ${M('been')} ${adj}`;
      structure = "Sujeito + have/has been + adjetivo";
    }
  } else if(tempo==='past'){
    if(aspecto==='simples'){
      const be=bePast(p);
      if(formato==='afirmativa') text = `${p} ${M(be)} ${adj}`;
      else if(formato==='negativa'){ const nb=negBe(p,'past'); text = `${nb.subj}${M(nb.marker)} ${adj}`; }
      else if(formato==='pergunta') text = `${M(cap(be))} ${subjLower(p)} ${adj}`;
      else { const nq=negBeQ(p,'past'); text = `${M(nq.marker)} ${nq.subj} ${adj}`; }
      structure = "Sujeito + was/were";
    } else {
      if(formato==='afirmativa') text = `${p} ${M('had')} ${M('been')} ${adj}`;
      else if(formato==='negativa') text = `${p} ${M("hadn't")} ${M('been')} ${adj}`;
      else if(formato==='pergunta') text = `${M('Had')} ${subjLower(p)} ${M('been')} ${adj}`;
      else text = `${M("Hadn't")} ${subjLower(p)} ${M('been')} ${adj}`;
      structure = "Sujeito + had been + adjetivo";
    }
  } else {
    if(aspecto==='simples'){
      if(formato==='afirmativa') text = `${p} ${M('will')} ${M('be')} ${adj}`;
      else if(formato==='negativa') text = `${p} ${M("won't")} ${M('be')} ${adj}`;
      else if(formato==='pergunta') text = `${M('Will')} ${subjLower(p)} ${M('be')} ${adj}`;
      else text = `${M("Won't")} ${subjLower(p)} ${M('be')} ${adj}`;
      structure = "Sujeito + will be";
    } else {
      if(formato==='afirmativa') text = `${p} ${M('will')} ${M('have been')} ${adj}`;
      else if(formato==='negativa') text = `${p} ${M("won't")} ${M('have been')} ${adj}`;
      else if(formato==='pergunta') text = `${M('Will')} ${subjLower(p)} ${M('have been')} ${adj}`;
      else text = `${M("Won't")} ${subjLower(p)} ${M('have been')} ${adj}`;
      structure = "Sujeito + will have been + adjetivo";
    }
  }
  return {text, isQuestion:q, structure};
}
function generate(categoria,tempo,aspecto,formato,pronoun,verb){
  return categoria==='fact' ? genFact(tempo,aspecto,formato,pronoun,verb) : genState(tempo,aspecto,formato,pronoun);
}

/* ---- PT translation engine ---- */
const PT_PRONOUN = {I:"eu",You:"você",He:"ele",She:"ela",It:"ele/ela",We:"nós",They:"eles/elas"};
function ptPerson(p){ if(p==="I") return "1s"; if(p==="We") return "1p"; if(p==="They") return "3p"; return "3s"; }
/* Conjugação PT (presente + pretérito perfeito, pessoas 1s/3s/1p/3p) + gerúndio/particípio/
   infinitivo de cada verbo do banco VERBS — "you/he/she/it" colapsam em "3s" (registro
   "você"), mesma simplificação já usada no resto do motor de tradução. */
const PT_VERBS = {
  work:  { presente:{"1s":"trabalho","3s":"trabalha","1p":"trabalhamos","3p":"trabalham"}, pperf:{"1s":"trabalhei","3s":"trabalhou","1p":"trabalhamos","3p":"trabalharam"}, ger:"trabalhando", part:"trabalhado", inf:"trabalhar" },
  go:    { presente:{"1s":"vou","3s":"vai","1p":"vamos","3p":"vão"}, pperf:{"1s":"fui","3s":"foi","1p":"fomos","3p":"foram"}, ger:"indo", part:"ido", inf:"ir" },
  eat:   { presente:{"1s":"como","3s":"come","1p":"comemos","3p":"comem"}, pperf:{"1s":"comi","3s":"comeu","1p":"comemos","3p":"comeram"}, ger:"comendo", part:"comido", inf:"comer" },
  write: { presente:{"1s":"escrevo","3s":"escreve","1p":"escrevemos","3p":"escrevem"}, pperf:{"1s":"escrevi","3s":"escreveu","1p":"escrevemos","3p":"escreveram"}, ger:"escrevendo", part:"escrito", inf:"escrever" },
  see:   { presente:{"1s":"vejo","3s":"vê","1p":"vemos","3p":"veem"}, pperf:{"1s":"vi","3s":"viu","1p":"vimos","3p":"viram"}, ger:"vendo", part:"visto", inf:"ver" },
  take:  { presente:{"1s":"pego","3s":"pega","1p":"pegamos","3p":"pegam"}, pperf:{"1s":"peguei","3s":"pegou","1p":"pegamos","3p":"pegaram"}, ger:"pegando", part:"pegado", inf:"pegar" },
  come:  { presente:{"1s":"venho","3s":"vem","1p":"vimos","3p":"vêm"}, pperf:{"1s":"vim","3s":"veio","1p":"viemos","3p":"vieram"}, ger:"vindo", part:"vindo", inf:"vir" },
  run:   { presente:{"1s":"corro","3s":"corre","1p":"corremos","3p":"correm"}, pperf:{"1s":"corri","3s":"correu","1p":"corremos","3p":"correram"}, ger:"correndo", part:"corrido", inf:"correr" },
  buy:   { presente:{"1s":"compro","3s":"compra","1p":"compramos","3p":"compram"}, pperf:{"1s":"comprei","3s":"comprou","1p":"compramos","3p":"compraram"}, ger:"comprando", part:"comprado", inf:"comprar" },
  think: { presente:{"1s":"penso","3s":"pensa","1p":"pensamos","3p":"pensam"}, pperf:{"1s":"pensei","3s":"pensou","1p":"pensamos","3p":"pensaram"}, ger:"pensando", part:"pensado", inf:"pensar" },
  put:   { presente:{"1s":"coloco","3s":"coloca","1p":"colocamos","3p":"colocam"}, pperf:{"1s":"coloquei","3s":"colocou","1p":"colocamos","3p":"colocaram"}, ger:"colocando", part:"colocado", inf:"colocar" },
  speak: { presente:{"1s":"falo","3s":"fala","1p":"falamos","3p":"falam"}, pperf:{"1s":"falei","3s":"falou","1p":"falamos","3p":"falaram"}, ger:"falando", part:"falado", inf:"falar" },
  say:    { presente:{"1s":"digo","3s":"diz","1p":"dizemos","3p":"dizem"}, pperf:{"1s":"disse","3s":"disse","1p":"dissemos","3p":"disseram"}, ger:"dizendo", part:"dito", inf:"dizer" },
  get:    { presente:{"1s":"consigo","3s":"consegue","1p":"conseguimos","3p":"conseguem"}, pperf:{"1s":"consegui","3s":"conseguiu","1p":"conseguimos","3p":"conseguiram"}, ger:"conseguindo", part:"conseguido", inf:"conseguir" },
  make:   { presente:{"1s":"faço","3s":"faz","1p":"fazemos","3p":"fazem"}, pperf:{"1s":"fiz","3s":"fez","1p":"fizemos","3p":"fizeram"}, ger:"fazendo", part:"feito", inf:"fazer" },
  know:   { presente:{"1s":"sei","3s":"sabe","1p":"sabemos","3p":"sabem"}, pperf:{"1s":"soube","3s":"soube","1p":"soubemos","3p":"souberam"}, ger:"sabendo", part:"sabido", inf:"saber" },
  give:   { presente:{"1s":"dou","3s":"dá","1p":"damos","3p":"dão"}, pperf:{"1s":"dei","3s":"deu","1p":"demos","3p":"deram"}, ger:"dando", part:"dado", inf:"dar" },
  find:   { presente:{"1s":"encontro","3s":"encontra","1p":"encontramos","3p":"encontram"}, pperf:{"1s":"encontrei","3s":"encontrou","1p":"encontramos","3p":"encontraram"}, ger:"encontrando", part:"encontrado", inf:"encontrar" },
  tell:   { presente:{"1s":"conto","3s":"conta","1p":"contamos","3p":"contam"}, pperf:{"1s":"contei","3s":"contou","1p":"contamos","3p":"contaram"}, ger:"contando", part:"contado", inf:"contar" },
  become: { presente:{"1s":"fico","3s":"fica","1p":"ficamos","3p":"ficam"}, pperf:{"1s":"fiquei","3s":"ficou","1p":"ficamos","3p":"ficaram"}, ger:"ficando", part:"ficado", inf:"ficar" },
  leave:  { presente:{"1s":"saio","3s":"sai","1p":"saímos","3p":"saem"}, pperf:{"1s":"saí","3s":"saiu","1p":"saímos","3p":"saíram"}, ger:"saindo", part:"saído", inf:"sair" },
  feel:   { presente:{"1s":"sinto","3s":"sente","1p":"sentimos","3p":"sentem"}, pperf:{"1s":"senti","3s":"sentiu","1p":"sentimos","3p":"sentiram"}, ger:"sentindo", part:"sentido", inf:"sentir" },
  bring:  { presente:{"1s":"trago","3s":"traz","1p":"trazemos","3p":"trazem"}, pperf:{"1s":"trouxe","3s":"trouxe","1p":"trouxemos","3p":"trouxeram"}, ger:"trazendo", part:"trazido", inf:"trazer" },
  begin:  { presente:{"1s":"começo","3s":"começa","1p":"começamos","3p":"começam"}, pperf:{"1s":"comecei","3s":"começou","1p":"começamos","3p":"começaram"}, ger:"começando", part:"começado", inf:"começar" },
  keep:   { presente:{"1s":"mantenho","3s":"mantém","1p":"mantemos","3p":"mantêm"}, pperf:{"1s":"mantive","3s":"manteve","1p":"mantivemos","3p":"mantiveram"}, ger:"mantendo", part:"mantido", inf:"manter" },
  hold:   { presente:{"1s":"seguro","3s":"segura","1p":"seguramos","3p":"seguram"}, pperf:{"1s":"segurei","3s":"segurou","1p":"seguramos","3p":"seguraram"}, ger:"segurando", part:"segurado", inf:"segurar" },
  meet:   { presente:{"1s":"encontro","3s":"encontra","1p":"encontramos","3p":"encontram"}, pperf:{"1s":"encontrei","3s":"encontrou","1p":"encontramos","3p":"encontraram"}, ger:"encontrando", part:"encontrado", inf:"encontrar" },
  win:    { presente:{"1s":"ganho","3s":"ganha","1p":"ganhamos","3p":"ganham"}, pperf:{"1s":"ganhei","3s":"ganhou","1p":"ganhamos","3p":"ganharam"}, ger:"ganhando", part:"ganho", inf:"ganhar" },
  teach:  { presente:{"1s":"ensino","3s":"ensina","1p":"ensinamos","3p":"ensinam"}, pperf:{"1s":"ensinei","3s":"ensinou","1p":"ensinamos","3p":"ensinaram"}, ger:"ensinando", part:"ensinado", inf:"ensinar" },
  sell:   { presente:{"1s":"vendo","3s":"vende","1p":"vendemos","3p":"vendem"}, pperf:{"1s":"vendi","3s":"vendeu","1p":"vendemos","3p":"venderam"}, ger:"vendendo", part:"vendido", inf:"vender" },
  send:   { presente:{"1s":"envio","3s":"envia","1p":"enviamos","3p":"enviam"}, pperf:{"1s":"enviei","3s":"enviou","1p":"enviamos","3p":"enviaram"}, ger:"enviando", part:"enviado", inf:"enviar" },
  break:  { presente:{"1s":"quebro","3s":"quebra","1p":"quebramos","3p":"quebram"}, pperf:{"1s":"quebrei","3s":"quebrou","1p":"quebramos","3p":"quebraram"}, ger:"quebrando", part:"quebrado", inf:"quebrar" },
  drive:  { presente:{"1s":"dirijo","3s":"dirige","1p":"dirigimos","3p":"dirigem"}, pperf:{"1s":"dirigi","3s":"dirigiu","1p":"dirigimos","3p":"dirigiram"}, ger:"dirigindo", part:"dirigido", inf:"dirigir" },
  choose: { presente:{"1s":"escolho","3s":"escolhe","1p":"escolhemos","3p":"escolhem"}, pperf:{"1s":"escolhi","3s":"escolheu","1p":"escolhemos","3p":"escolheram"}, ger:"escolhendo", part:"escolhido", inf:"escolher" },
  wear:   { presente:{"1s":"visto","3s":"veste","1p":"vestimos","3p":"vestem"}, pperf:{"1s":"vesti","3s":"vestiu","1p":"vestimos","3p":"vestiram"}, ger:"vestindo", part:"vestido", inf:"vestir" },
  fall:   { presente:{"1s":"caio","3s":"cai","1p":"caímos","3p":"caem"}, pperf:{"1s":"caí","3s":"caiu","1p":"caímos","3p":"caíram"}, ger:"caindo", part:"caído", inf:"cair" },
  forget: { presente:{"1s":"esqueço","3s":"esquece","1p":"esquecemos","3p":"esquecem"}, pperf:{"1s":"esqueci","3s":"esqueceu","1p":"esquecemos","3p":"esqueceram"}, ger:"esquecendo", part:"esquecido", inf:"esquecer" },
  grow:   { presente:{"1s":"cresço","3s":"cresce","1p":"crescemos","3p":"crescem"}, pperf:{"1s":"cresci","3s":"cresceu","1p":"crescemos","3p":"cresceram"}, ger:"crescendo", part:"crescido", inf:"crescer" },
  catch:  { presente:{"1s":"agarro","3s":"agarra","1p":"agarramos","3p":"agarram"}, pperf:{"1s":"agarrei","3s":"agarrou","1p":"agarramos","3p":"agarraram"}, ger:"agarrando", part:"agarrado", inf:"agarrar" },
  sleep:  { presente:{"1s":"durmo","3s":"dorme","1p":"dormimos","3p":"dormem"}, pperf:{"1s":"dormi","3s":"dormiu","1p":"dormimos","3p":"dormiram"}, ger:"dormindo", part:"dormido", inf:"dormir" },
  arise:      { presente:{"1s":"surjo","3s":"surge","1p":"surgimos","3p":"surgem"}, pperf:{"1s":"surgi","3s":"surgiu","1p":"surgimos","3p":"surgiram"}, ger:"surgindo", part:"surgido", inf:"surgir" },
  imagine:    { presente:{"1s":"imagino","3s":"imagina","1p":"imaginamos","3p":"imaginam"}, pperf:{"1s":"imaginei","3s":"imaginou","1p":"imaginamos","3p":"imaginaram"}, ger:"imaginando", part:"imaginado", inf:"imaginar" },
  join:       { presente:{"1s":"junto","3s":"junta","1p":"juntamos","3p":"juntam"}, pperf:{"1s":"juntei","3s":"juntou","1p":"juntamos","3p":"juntaram"}, ger:"juntando", part:"juntado", inf:"juntar" },
  need:       { presente:{"1s":"preciso","3s":"precisa","1p":"precisamos","3p":"precisam"}, pperf:{"1s":"precisei","3s":"precisou","1p":"precisamos","3p":"precisaram"}, ger:"precisando", part:"precisado", inf:"precisar" },
  overcome:   { presente:{"1s":"supero","3s":"supera","1p":"superamos","3p":"superam"}, pperf:{"1s":"superei","3s":"superou","1p":"superamos","3p":"superaram"}, ger:"superando", part:"superado", inf:"superar" },
  quit:       { presente:{"1s":"desisto","3s":"desiste","1p":"desistimos","3p":"desistem"}, pperf:{"1s":"desisti","3s":"desistiu","1p":"desistimos","3p":"desistiram"}, ger:"desistindo", part:"desistido", inf:"desistir" },
  understand: { presente:{"1s":"entendo","3s":"entende","1p":"entendemos","3p":"entendem"}, pperf:{"1s":"entendi","3s":"entendeu","1p":"entendemos","3p":"entenderam"}, ger:"entendendo", part:"entendido", inf:"entender" },
  visit:      { presente:{"1s":"visito","3s":"visita","1p":"visitamos","3p":"visitam"}, pperf:{"1s":"visitei","3s":"visitou","1p":"visitamos","3p":"visitaram"}, ger:"visitando", part:"visitado", inf:"visitar" },
  "x-ray":    { presente:{"1s":"radiografo","3s":"radiografa","1p":"radiografamos","3p":"radiografam"}, pperf:{"1s":"radiografei","3s":"radiografou","1p":"radiografamos","3p":"radiografaram"}, ger:"radiografando", part:"radiografado", inf:"radiografar" },
  yell:       { presente:{"1s":"grito","3s":"grita","1p":"gritamos","3p":"gritam"}, pperf:{"1s":"gritei","3s":"gritou","1p":"gritamos","3p":"gritaram"}, ger:"gritando", part:"gritado", inf:"gritar" },
  zoom:       { presente:{"1s":"disparo","3s":"dispara","1p":"disparamos","3p":"disparam"}, pperf:{"1s":"disparei","3s":"disparou","1p":"disparamos","3p":"dispararam"}, ger:"disparando", part:"disparado", inf:"disparar" },
  "give-up": { presente:{"1s":"desisto","3s":"desiste","1p":"desistimos","3p":"desistem"}, pperf:{"1s":"desisti","3s":"desistiu","1p":"desistimos","3p":"desistiram"}, ger:"desistindo", part:"desistido", inf:"desistir" },
  "find-out": { presente:{"1s":"descubro","3s":"descobre","1p":"descobrimos","3p":"descobrem"}, pperf:{"1s":"descobri","3s":"descobriu","1p":"descobrimos","3p":"descobriram"}, ger:"descobrindo", part:"descoberto", inf:"descobrir" },
  "look-after": { presente:{"1s":"cuido","3s":"cuida","1p":"cuidamos","3p":"cuidam"}, pperf:{"1s":"cuidei","3s":"cuidou","1p":"cuidamos","3p":"cuidaram"}, ger:"cuidando", part:"cuidado", inf:"cuidar" },
  "look-for": { presente:{"1s":"procuro","3s":"procura","1p":"procuramos","3p":"procuram"}, pperf:{"1s":"procurei","3s":"procurou","1p":"procuramos","3p":"procuraram"}, ger:"procurando", part:"procurado", inf:"procurar" },
  "put-off": { presente:{"1s":"adio","3s":"adia","1p":"adiamos","3p":"adiam"}, pperf:{"1s":"adiei","3s":"adiou","1p":"adiamos","3p":"adiaram"}, ger:"adiando", part:"adiado", inf:"adiar" },
  "get-up": { presente:{"1s":"levanto","3s":"levanta","1p":"levantamos","3p":"levantam"}, pperf:{"1s":"levantei","3s":"levantou","1p":"levantamos","3p":"levantaram"}, ger:"levantando", part:"levantado", inf:"levantar" },
  "come-back": { presente:{"1s":"volto","3s":"volta","1p":"voltamos","3p":"voltam"}, pperf:{"1s":"voltei","3s":"voltou","1p":"voltamos","3p":"voltaram"}, ger:"voltando", part:"voltado", inf:"voltar" },
  "turn-on": { presente:{"1s":"ligo","3s":"liga","1p":"ligamos","3p":"ligam"}, pperf:{"1s":"liguei","3s":"ligou","1p":"ligamos","3p":"ligaram"}, ger:"ligando", part:"ligado", inf:"ligar" },
  "run-out": { presente:{"1s":"fico sem","3s":"fica sem","1p":"ficamos sem","3p":"ficam sem"}, pperf:{"1s":"fiquei sem","3s":"ficou sem","1p":"ficamos sem","3p":"ficaram sem"}, ger:"ficando sem", part:"ficado sem", inf:"ficar sem" },
  "take-off": { presente:{"1s":"tiro","3s":"tira","1p":"tiramos","3p":"tiram"}, pperf:{"1s":"tirei","3s":"tirou","1p":"tiramos","3p":"tiraram"}, ger:"tirando", part:"tirado", inf:"tirar" },
  "carry-on": { presente:{"1s":"continuo","3s":"continua","1p":"continuamos","3p":"continuam"}, pperf:{"1s":"continuei","3s":"continuou","1p":"continuamos","3p":"continuaram"}, ger:"continuando", part:"continuado", inf:"continuar" },
  "work-out": { presente:{"1s":"malho","3s":"malha","1p":"malhamos","3p":"malham"}, pperf:{"1s":"malhei","3s":"malhou","1p":"malhamos","3p":"malharam"}, ger:"malhando", part:"malhado", inf:"malhar" },
  "agree": { presente:{"1s":"concordo","3s":"concorda","1p":"concordamos","3p":"concordam"}, pperf:{"1s":"concordei","3s":"concordou","1p":"concordamos","3p":"concordaram"}, ger:"concordando", part:"concordado", inf:"concordar" },
  "call": { presente:{"1s":"ligo","3s":"liga","1p":"ligamos","3p":"ligam"}, pperf:{"1s":"liguei","3s":"ligou","1p":"ligamos","3p":"ligaram"}, ger:"ligando", part:"ligado", inf:"ligar" },
  "carry": { presente:{"1s":"carrego","3s":"carrega","1p":"carregamos","3p":"carregam"}, pperf:{"1s":"carreguei","3s":"carregou","1p":"carregamos","3p":"carregaram"}, ger:"carregando", part:"carregado", inf:"carregar" },
  "check": { presente:{"1s":"verifico","3s":"verifica","1p":"verificamos","3p":"verificam"}, pperf:{"1s":"verifiquei","3s":"verificou","1p":"verificamos","3p":"verificaram"}, ger:"verificando", part:"verificado", inf:"verificar" },
  "clean": { presente:{"1s":"limpo","3s":"limpa","1p":"limpamos","3p":"limpam"}, pperf:{"1s":"limpei","3s":"limpou","1p":"limpamos","3p":"limparam"}, ger:"limpando", part:"limpado", inf:"limpar" },
  "close": { presente:{"1s":"fecho","3s":"fecha","1p":"fechamos","3p":"fecham"}, pperf:{"1s":"fechei","3s":"fechou","1p":"fechamos","3p":"fecharam"}, ger:"fechando", part:"fechado", inf:"fechar" },
  "count": { presente:{"1s":"conto","3s":"conta","1p":"contamos","3p":"contam"}, pperf:{"1s":"contei","3s":"contou","1p":"contamos","3p":"contaram"}, ger:"contando", part:"contado", inf:"contar" },
  "cross": { presente:{"1s":"atravesso","3s":"atravessa","1p":"atravessamos","3p":"atravessam"}, pperf:{"1s":"atravessei","3s":"atravessou","1p":"atravessamos","3p":"atravessaram"}, ger:"atravessando", part:"atravessado", inf:"atravessar" },
  "cut": { presente:{"1s":"corto","3s":"corta","1p":"cortamos","3p":"cortam"}, pperf:{"1s":"cortei","3s":"cortou","1p":"cortamos","3p":"cortaram"}, ger:"cortando", part:"cortado", inf:"cortar" },
  "deal": { presente:{"1s":"lido","3s":"lida","1p":"lidamos","3p":"lidam"}, pperf:{"1s":"lidei","3s":"lidou","1p":"lidamos","3p":"lidaram"}, ger:"lidando", part:"lidado", inf:"lidar" },
  "decide": { presente:{"1s":"decido","3s":"decide","1p":"decidimos","3p":"decidem"}, pperf:{"1s":"decidi","3s":"decidiu","1p":"decidimos","3p":"decidiram"}, ger:"decidindo", part:"decidido", inf:"decidir" },
  "do": { presente:{"1s":"faço","3s":"faz","1p":"fazemos","3p":"fazem"}, pperf:{"1s":"fiz","3s":"fez","1p":"fizemos","3p":"fizeram"}, ger:"fazendo", part:"feito", inf:"fazer" },
  "draw": { presente:{"1s":"desenho","3s":"desenha","1p":"desenhamos","3p":"desenham"}, pperf:{"1s":"desenhei","3s":"desenhou","1p":"desenhamos","3p":"desenharam"}, ger:"desenhando", part:"desenhado", inf:"desenhar" },
  "dream": { presente:{"1s":"sonho","3s":"sonha","1p":"sonhamos","3p":"sonham"}, pperf:{"1s":"sonhei","3s":"sonhou","1p":"sonhamos","3p":"sonharam"}, ger:"sonhando", part:"sonhado", inf:"sonhar" },
  "drink": { presente:{"1s":"bebo","3s":"bebe","1p":"bebemos","3p":"bebem"}, pperf:{"1s":"bebi","3s":"bebeu","1p":"bebemos","3p":"beberam"}, ger:"bebendo", part:"bebido", inf:"beber" },
  "drop": { presente:{"1s":"derrubo","3s":"derruba","1p":"derrubamos","3p":"derrubam"}, pperf:{"1s":"derrubei","3s":"derrubou","1p":"derrubamos","3p":"derrubaram"}, ger:"derrubando", part:"derrubado", inf:"derrubar" },
  "face": { presente:{"1s":"enfrento","3s":"enfrenta","1p":"enfrentamos","3p":"enfrentam"}, pperf:{"1s":"enfrentei","3s":"enfrentou","1p":"enfrentamos","3p":"enfrentaram"}, ger:"enfrentando", part:"enfrentado", inf:"enfrentar" },
  "fight": { presente:{"1s":"luto","3s":"luta","1p":"lutamos","3p":"lutam"}, pperf:{"1s":"lutei","3s":"lutou","1p":"lutamos","3p":"lutaram"}, ger:"lutando", part:"lutado", inf:"lutar" },
  "figure": { presente:{"1s":"deduzo","3s":"deduz","1p":"deduzimos","3p":"deduzem"}, pperf:{"1s":"deduzi","3s":"deduziu","1p":"deduzimos","3p":"deduziram"}, ger:"deduzindo", part:"deduzido", inf:"deduzir" },
  "fill": { presente:{"1s":"preencho","3s":"preenche","1p":"preenchemos","3p":"preenchem"}, pperf:{"1s":"preenchi","3s":"preencheu","1p":"preenchemos","3p":"preencheram"}, ger:"preenchendo", part:"preenchido", inf:"preencher" },
  "follow": { presente:{"1s":"sigo","3s":"segue","1p":"seguimos","3p":"seguem"}, pperf:{"1s":"segui","3s":"seguiu","1p":"seguimos","3p":"seguiram"}, ger:"seguindo", part:"seguido", inf:"seguir" },
  "have": { presente:{"1s":"tenho","3s":"tem","1p":"temos","3p":"têm"}, pperf:{"1s":"tive","3s":"teve","1p":"tivemos","3p":"tiveram"}, ger:"tendo", part:"tido", inf:"ter" },
  "lay": { presente:{"1s":"ponho","3s":"põe","1p":"pomos","3p":"põem"}, pperf:{"1s":"pus","3s":"pôs","1p":"pusemos","3p":"puseram"}, ger:"pondo", part:"posto", inf:"pôr" },
  "let": { presente:{"1s":"deixo","3s":"deixa","1p":"deixamos","3p":"deixam"}, pperf:{"1s":"deixei","3s":"deixou","1p":"deixamos","3p":"deixaram"}, ger:"deixando", part:"deixado", inf:"deixar" },
  "like": { presente:{"1s":"gosto","3s":"gosta","1p":"gostamos","3p":"gostam"}, pperf:{"1s":"gostei","3s":"gostou","1p":"gostamos","3p":"gostaram"}, ger:"gostando", part:"gostado", inf:"gostar" },
  "live": { presente:{"1s":"vivo","3s":"vive","1p":"vivemos","3p":"vivem"}, pperf:{"1s":"vivi","3s":"viveu","1p":"vivemos","3p":"viveram"}, ger:"vivendo", part:"vivido", inf:"viver" },
  "look": { presente:{"1s":"olho","3s":"olha","1p":"olhamos","3p":"olham"}, pperf:{"1s":"olhei","3s":"olhou","1p":"olhamos","3p":"olharam"}, ger:"olhando", part:"olhado", inf:"olhar" },
  "lose": { presente:{"1s":"perco","3s":"perde","1p":"perdemos","3p":"perdem"}, pperf:{"1s":"perdi","3s":"perdeu","1p":"perdemos","3p":"perderam"}, ger:"perdendo", part:"perdido", inf:"perder" },
  "pass": { presente:{"1s":"passo","3s":"passa","1p":"passamos","3p":"passam"}, pperf:{"1s":"passei","3s":"passou","1p":"passamos","3p":"passaram"}, ger:"passando", part:"passado", inf:"passar" },
  "pay": { presente:{"1s":"pago","3s":"paga","1p":"pagamos","3p":"pagam"}, pperf:{"1s":"paguei","3s":"pagou","1p":"pagamos","3p":"pagaram"}, ger:"pagando", part:"pago", inf:"pagar" },
  "pick": { presente:{"1s":"seleciono","3s":"seleciona","1p":"selecionamos","3p":"selecionam"}, pperf:{"1s":"selecionei","3s":"selecionou","1p":"selecionamos","3p":"selecionaram"}, ger:"selecionando", part:"selecionado", inf:"selecionar" },
  "play": { presente:{"1s":"jogo","3s":"joga","1p":"jogamos","3p":"jogam"}, pperf:{"1s":"joguei","3s":"jogou","1p":"jogamos","3p":"jogaram"}, ger:"jogando", part:"jogado", inf:"jogar" },
  "pull": { presente:{"1s":"puxo","3s":"puxa","1p":"puxamos","3p":"puxam"}, pperf:{"1s":"puxei","3s":"puxou","1p":"puxamos","3p":"puxaram"}, ger:"puxando", part:"puxado", inf:"puxar" },
  "push": { presente:{"1s":"empurro","3s":"empurra","1p":"empurramos","3p":"empurram"}, pperf:{"1s":"empurrei","3s":"empurrou","1p":"empurramos","3p":"empurraram"}, ger:"empurrando", part:"empurrado", inf:"empurrar" },
  "raise": { presente:{"1s":"ergo","3s":"ergue","1p":"erguemos","3p":"erguem"}, pperf:{"1s":"ergui","3s":"ergueu","1p":"erguemos","3p":"ergueram"}, ger:"erguendo", part:"erguido", inf:"erguer" },
  "read": { presente:{"1s":"leio","3s":"lê","1p":"lemos","3p":"leem"}, pperf:{"1s":"li","3s":"leu","1p":"lemos","3p":"leram"}, ger:"lendo", part:"lido", inf:"ler" },
  "return": { presente:{"1s":"retorno","3s":"retorna","1p":"retornamos","3p":"retornam"}, pperf:{"1s":"retornei","3s":"retornou","1p":"retornamos","3p":"retornaram"}, ger:"retornando", part:"retornado", inf:"retornar" },
  "ride": { presente:{"1s":"ando","3s":"anda","1p":"andamos","3p":"andam"}, pperf:{"1s":"andei","3s":"andou","1p":"andamos","3p":"andaram"}, ger:"andando", part:"andado", inf:"andar" },
  "save": { presente:{"1s":"salvo","3s":"salva","1p":"salvamos","3p":"salvam"}, pperf:{"1s":"salvei","3s":"salvou","1p":"salvamos","3p":"salvaram"}, ger:"salvando", part:"salvado", inf:"salvar" },
  "set": { presente:{"1s":"defino","3s":"define","1p":"definimos","3p":"definem"}, pperf:{"1s":"defini","3s":"definiu","1p":"definimos","3p":"definiram"}, ger:"definindo", part:"definido", inf:"definir" },
  "show": { presente:{"1s":"mostro","3s":"mostra","1p":"mostramos","3p":"mostram"}, pperf:{"1s":"mostrei","3s":"mostrou","1p":"mostramos","3p":"mostraram"}, ger:"mostrando", part:"mostrado", inf:"mostrar" },
  "stand": { presente:{"1s":"suporto","3s":"suporta","1p":"suportamos","3p":"suportam"}, pperf:{"1s":"suportei","3s":"suportou","1p":"suportamos","3p":"suportaram"}, ger:"suportando", part:"suportado", inf:"suportar" },
  "stay": { presente:{"1s":"fico","3s":"fica","1p":"ficamos","3p":"ficam"}, pperf:{"1s":"fiquei","3s":"ficou","1p":"ficamos","3p":"ficaram"}, ger:"ficando", part:"ficado", inf:"ficar" },
  "step": { presente:{"1s":"piso","3s":"pisa","1p":"pisamos","3p":"pisam"}, pperf:{"1s":"pisei","3s":"pisou","1p":"pisamos","3p":"pisaram"}, ger:"pisando", part:"pisado", inf:"pisar" },
  "stop": { presente:{"1s":"paro","3s":"para","1p":"paramos","3p":"param"}, pperf:{"1s":"parei","3s":"parou","1p":"paramos","3p":"pararam"}, ger:"parando", part:"parado", inf:"parar" },
  "talk": { presente:{"1s":"converso","3s":"conversa","1p":"conversamos","3p":"conversam"}, pperf:{"1s":"conversei","3s":"conversou","1p":"conversamos","3p":"conversaram"}, ger:"conversando", part:"conversado", inf:"conversar" },
  "throw": { presente:{"1s":"lanço","3s":"lança","1p":"lançamos","3p":"lançam"}, pperf:{"1s":"lancei","3s":"lançou","1p":"lançamos","3p":"lançaram"}, ger:"lançando", part:"lançado", inf:"lançar" },
  "turn": { presente:{"1s":"viro","3s":"vira","1p":"viramos","3p":"viram"}, pperf:{"1s":"virei","3s":"virou","1p":"viramos","3p":"viraram"}, ger:"virando", part:"virado", inf:"virar" },
  "wait": { presente:{"1s":"espero","3s":"espera","1p":"esperamos","3p":"esperam"}, pperf:{"1s":"esperei","3s":"esperou","1p":"esperamos","3p":"esperaram"}, ger:"esperando", part:"esperado", inf:"esperar" },
  "walk": { presente:{"1s":"caminho","3s":"caminha","1p":"caminhamos","3p":"caminham"}, pperf:{"1s":"caminhei","3s":"caminhou","1p":"caminhamos","3p":"caminharam"}, ger:"caminhando", part:"caminhado", inf:"caminhar" },
  "wash": { presente:{"1s":"lavo","3s":"lava","1p":"lavamos","3p":"lavam"}, pperf:{"1s":"lavei","3s":"lavou","1p":"lavamos","3p":"lavaram"}, ger:"lavando", part:"lavado", inf:"lavar" }
};
/* =====================================================================================
   BANCO DE VERBOS POR TEMA
   Cada verbo pertence a um TEMA principal (e, se fizer sentido, a outros): o filtro do dial ③
   deixa o estudo andar por campo semântico — julgamento, esporte, matemática, compras… — em vez
   de depender só da letra inicial. Os verbos novos nascem de uma linha compacta; as formas
   inglesas e portuguesas são geradas por regra, e só as exceções (irregulares) são escritas.
   ===================================================================================== */
const VERB_TEMAS = [
  { k:'mente',   icon:'🧠', nome:'Mente e conhecimento', curto:'Mente',        dica:'O que acontece só na cabeça. Vários são verbos de estado (know, believe, understand) e raramente aparecem no contínuo.' },
  { k:'juiz',    icon:'⚖️', nome:'Julgamento e opinião', curto:'Julgamento',   dica:'Dar valor e opinião. Pedem objeto e, muitas vezes, preposição fixa: blame … for, accuse … of, approve of, praise … for.' },
  { k:'fala',    icon:'💬', nome:'Comunicação',          curto:'Comunicação',  dica:'Dizer e responder. Say, tell, speak e talk não são intercambiáveis: tell pede destinatário, say pede o conteúdo, speak e talk descrevem o ato.' },
  { k:'afeto',   icon:'❤️', nome:'Emoção e relações',    curto:'Emoções',      dica:'Sentimentos e vínculos. Love, hate, like e want são verbos de estado — no contínuo só em usos marcados ("I\'m loving it").' },
  { k:'move',    icon:'🚶', nome:'Movimento e viagem',   curto:'Movimento',    dica:'Sair de A para B. Quase todos aceitam um complemento de lugar: to, into, from, across, through.' },
  { k:'esporte', icon:'⚽', nome:'Esporte e exercício',  curto:'Esporte',      dica:'Ação física: verbos dinâmicos, ótimos no contínuo ("He is kicking", "She\'s training").' },
  { k:'mat',     icon:'➗', nome:'Matemática e números', curto:'Matemática',   dica:'Operações e medidas. A preposição muda tudo: add … TO, divide … BY, multiply … BY, subtract … FROM.' },
  { k:'compra',  icon:'🛒', nome:'Compras e dinheiro',   curto:'Compras',      dica:'Dinheiro e troca: pay FOR, spend … ON, charge … FOR, owe … TO. Cost é irregular e não muda (cost – cost – cost).' },
  { k:'trab',    icon:'💼', nome:'Trabalho e negócios',  curto:'Trabalho',     dica:'Rotina profissional: verbos transitivos que pedem objeto concreto (manage a team, schedule a meeting, negotiate a contract).' },
  { k:'tech',    icon:'💻', nome:'Tecnologia e dados',   curto:'Tecnologia',   dica:'Ações digitais. Muitos nasceram como substantivo (click, download, post) e são regulares.' },
  { k:'comida',  icon:'🍳', nome:'Comida e cozinha',     curto:'Cozinha',      dica:'Preparo e consumo, quase sempre na ordem de uma receita: chop, mix, cook, serve.' },
  { k:'casa',    icon:'🏠', nome:'Casa e rotina',        curto:'Casa',         dica:'Rotina doméstica. Vários são irregulares (wake, hang, sweep, light).' },
  { k:'fazer',   icon:'🔧', nome:'Criar, consertar e manusear', curto:'Criar e fazer', dica:'Mãos na massa: make cria, do executa, fix conserta. Atenção às irregulares (build, dig, tear, shake).' },
  { k:'estudo',  icon:'📚', nome:'Estudo e linguagem',   curto:'Estudo',       dica:'Aprender e ensinar: learn é de quem aprende, teach de quem ensina; study é o ato de se dedicar.' },
  { k:'corpo',   icon:'🩺', nome:'Corpo e saúde',        curto:'Corpo',        dica:'Corpo e sentidos. See e hear são involuntários; watch e listen são intencionais.' },
  { k:'natureza',icon:'🌿', nome:'Natureza e ambiente',  curto:'Natureza',     dica:'Mundo natural. Muitos são intransitivos — não pedem objeto (grow, bloom, shine, survive).' },
  { k:'arte',    icon:'🎭', nome:'Arte, mídia e lazer',  curto:'Arte e lazer', dica:'Criar e curtir. Sing, dance e perform aceitam complemento de modo; celebrate e enjoy pedem objeto.' },
  { k:'lei',     icon:'🏛️', nome:'Regras, lei e política', curto:'Lei e regras', dica:'Regras e poder. Allow, forbid e require seguem o molde "verbo + pessoa + to + verbo".' },
  { k:'muda',    icon:'🔄', nome:'Mudança e processo',   curto:'Mudança',      dica:'Começar, continuar, acabar, virar. Muitos não pedem objeto: "Prices increase", "The meeting ends".' },
  { k:'troca',   icon:'🤲', nome:'Posse e troca',        curto:'Posse e troca',dica:'Quem dá e quem recebe. Vários aceitam dois objetos (give, offer, lend … someone something).' }
];
const VERB_TEMA_FRASAIS = '__frasais';
/* Temas dos 114 verbos que já existiam (o primeiro é o tema principal) */
const VERB_TEMAS_ANTIGOS = {
  work:'trab', go:'move', eat:'comida', write:'estudo+arte', see:'corpo+mente', take:'troca+move', come:'move', run:'esporte+move',
  buy:'compra', think:'mente', put:'fazer+casa', speak:'fala', say:'fala', get:'troca', make:'fazer', know:'mente', give:'troca',
  find:'troca+mente', tell:'fala', become:'muda', leave:'move', feel:'afeto+corpo', bring:'troca+move', begin:'muda+trab', keep:'troca',
  hold:'fazer+esporte', meet:'trab+afeto', win:'esporte', teach:'estudo', sell:'compra+trab', send:'tech+fala', break:'fazer+muda',
  drive:'move', choose:'mente+juiz', wear:'casa', fall:'muda+esporte', forget:'mente', grow:'natureza+muda', catch:'esporte',
  sleep:'casa+corpo', arise:'muda', imagine:'mente+arte', join:'trab+afeto', need:'troca+trab', overcome:'muda+esporte',
  quit:'trab+muda', understand:'mente', visit:'move+afeto', 'x-ray':'corpo+tech', yell:'fala+esporte', zoom:'tech+move',
  agree:'fala+juiz', call:'fala+tech', carry:'fazer+move', check:'tech+trab', clean:'casa', close:'casa+trab', count:'mat',
  cross:'move', cut:'fazer+comida', deal:'trab+juiz', decide:'mente+juiz', do:'fazer+trab', draw:'arte', dream:'mente+arte',
  drink:'comida', drop:'fazer+esporte', face:'mente+afeto', fight:'esporte+afeto', figure:'mat+mente', fill:'fazer+comida',
  follow:'move+lei', have:'troca', lay:'fazer', let:'lei', like:'afeto', live:'casa+natureza', look:'corpo+mente',
  lose:'esporte+troca', pass:'esporte+estudo', pay:'compra', pick:'mente+compra', play:'esporte+arte', pull:'fazer+esporte',
  push:'fazer+esporte', raise:'muda+fazer', read:'estudo', return:'move+compra', ride:'move+esporte', save:'tech+compra',
  set:'fazer+trab', show:'arte+trab', stand:'corpo+juiz', stay:'casa+move', step:'move+esporte', stop:'muda', talk:'fala',
  throw:'esporte', turn:'muda+move', wait:'move+afeto', walk:'move+esporte', wash:'casa',
  'give-up':'muda+afeto', 'find-out':'mente+estudo', 'look-after':'afeto+casa', 'look-for':'troca+mente', 'put-off':'trab',
  'get-up':'casa', 'come-back':'move', 'turn-on':'tech+casa', 'run-out':'muda+compra', 'take-off':'move+casa',
  'carry-on':'muda+trab', 'work-out':'esporte+corpo'
};
/* Formato: "verbo[*][~passado,particípio][+tema…]|infinitivo PT|inglês=português;inglês=português;inglês=português"
   "*" dobra a consoante final (plan → planning/planned). O tema da seção é o principal. */
const VERBOS_NOVOS = {
 mente: [
  "learn|aprender|a new skill=uma nova habilidade;a language=um idioma;from mistakes=com os erros",
  "remember|lembrar|the details=dos detalhes;the password=da senha;the name=do nome",
  "believe|acreditar|in teamwork=no trabalho em equipe;the story=na história;in miracles=em milagres",
  "realize|perceber|the mistake=o erro;the risk=o risco;the truth=a verdade",
  "notice|notar|a change=uma mudança;the difference=a diferença;a smell=um cheiro",
  "guess|adivinhar|the answer=a resposta;the price=o preço;correctly=corretamente",
  "presume|presumir|the worst=o pior;innocence=a inocência;too much=demais",
  "doubt|duvidar|the result=do resultado;the evidence=das evidências;the facts=dos fatos",
  "recognize|reconhecer|a face=um rosto;the problem=o problema;the value=o valor",
  "consider|considerar|the options=as opções;a change=uma mudança;every detail=cada detalhe",
  "focus|focar|on the goal=no objetivo;on the details=nos detalhes;on one thing=em uma coisa",
  "memorize|memorizar|a list=uma lista;the words=as palavras;the formula=a fórmula",
  "analyze|analisar|the data=os dados;the problem=o problema;every option=cada opção",
  "solve+mat|resolver|the problem=o problema;a puzzle=um quebra-cabeça;the equation=a equação",
  "mean~meant,meant|significar|something=algo;a lot=muito;more=mais",
  "expect|aguardar|good results=bons resultados;a reply=uma resposta;the worst=o pior",
  "predict+tech|prever|the future=o futuro;the weather=o tempo;the outcome=o resultado",
  "compare+juiz|comparar|prices=preços;the two options=as duas opções;the results=os resultados"
 ],
 juiz: [
  "judge|julgar|a book by its cover=um livro pela capa;the contest=o concurso;fairly=com justiça",
  "blame|culpar|the weather=o clima;the team=a equipe;the system=o sistema",
  "praise|elogiar|the effort=o esforço;the team=a equipe;his work=o trabalho dele",
  "criticize|criticar|the plan=o plano;the decision=a decisão;harshly=duramente",
  "approve|aprovar|the budget=o orçamento;the plan=o plano;the proposal=a proposta",
  "reject|rejeitar|the offer=a oferta;the idea=a ideia;the proposal=a proposta",
  "accuse|acusar|the company=a empresa;a colleague=um colega;a neighbor=um vizinho",
  "admire|admirar|her courage=a coragem dela;his work=o trabalho dele;the view=a vista",
  "respect|respeitar|the rules=as regras;other opinions=outras opiniões;the elders=os mais velhos",
  "deserve|merecer|a raise=um aumento;respect=respeito;better=algo melhor",
  "evaluate|avaliar|the results=os resultados;the risk=o risco;each option=cada opção",
  "recommend|recomendar|a book=um livro;this place=este lugar;the product=o produto",
  "support|apoiar|the team=a equipe;the idea=a ideia;a good cause=uma boa causa",
  "defend|defender|a position=uma posição;the team=a equipe;the rights of others=os direitos dos outros",
  "trust+afeto|confiar|in the process=no processo;in the team=na equipe;in the system=no sistema",
  "forgive~forgave,forgiven+afeto|perdoar|a mistake=um erro;a friend=um amigo;easily=facilmente",
  "suspect|suspeitar|the worst=do pior;a problem=de um problema;fraud=de fraude",
  "prefer*+afeto|preferir|tea=chá;the red one=o vermelho;silence=o silêncio",
  "disagree+fala|discordar|with the decision=da decisão;strongly=totalmente;politely=educadamente"
 ],
 fala: [
  "ask|perguntar|the teacher=ao professor;the price=o preço;why=por quê",
  "answer|responder|the phone=ao telefone;the question=à pergunta;quickly=rápido",
  "explain|explicar|the rules=as regras;the process=o processo;clearly=claramente",
  "discuss|debater|the plan=o plano;the problem=o problema;openly=abertamente",
  "mention|mencionar|the price=o preço;his name=o nome dele;it briefly=isso rapidamente",
  "announce|anunciar|the results=os resultados;a decision=uma decisão;the winner=o vencedor",
  "argue|discutir|with a colleague=com um colega;about money=por dinheiro;loudly=em voz alta",
  "suggest|sugerir|a solution=uma solução;an idea=uma ideia;a different approach=outra abordagem",
  "report|relatar|the problem=o problema;the results=os resultados;a bug=um erro",
  "whisper|sussurrar|a secret=um segredo;softly=baixinho;to the child=para a criança",
  "shout|gritar|loudly=alto;at the referee=com o juiz;for help=por socorro",
  "promise|prometer|loyalty=lealdade;help=ajuda;a better future=um futuro melhor",
  "warn|avisar|the team=a equipe;everyone=todo mundo;in advance=com antecedência",
  "complain|reclamar|about the noise=do barulho;to the manager=ao gerente;constantly=o tempo todo",
  "describe|descrever|the problem=o problema;the scene=a cena;every detail=cada detalhe",
  "express|expressar|an opinion=uma opinião;gratitude=gratidão;doubts=dúvidas",
  "greet|cumprimentar|the guests=os convidados;everyone=todo mundo;warmly=calorosamente",
  "thank|agradecer|the team=à equipe;the staff=aos funcionários;everyone=a todos",
  "interrupt|interromper|the speaker=o orador;the meeting=a reunião;rudely=de forma rude",
  "interview|entrevistar|a candidate=um candidato;the author=o autor;the winner=o vencedor",
  "communicate|comunicar|clearly=com clareza;with clients=com clientes;by email=por e-mail",
  "share+troca+tech|compartilhar|ideas=ideias;a meal=uma refeição;the cost=o custo"
 ],
 afeto: [
  "love|amar|music=música;life=a vida;children=crianças",
  "hate|odiar|waiting=esperar;the noise=o barulho;mornings=as manhãs",
  "enjoy|aproveitar|the trip=a viagem;the moment=o momento;every minute=cada minuto",
  "want|querer|a break=uma pausa;more time=mais tempo;the best=o melhor",
  "fear|temer|failure=o fracasso;the worst=o pior;the dark=o escuro",
  "miss|perder|the bus=o ônibus;the train=o trem;a chance=uma chance",
  "care|cuidar|for the elderly=dos idosos;about quality=da qualidade;deeply=profundamente",
  "hug*|abraçar|a friend=um amigo;the child=a criança;tightly=com força",
  "kiss|beijar|the bride=a noiva;the baby=o bebê;gently=com carinho",
  "marry|casar|the right person=com a pessoa certa;a doctor=com um médico;young=cedo",
  "comfort|consolar|a friend=um amigo;the child=a criança;gently=com carinho",
  "laugh|rir|out loud=alto;at the joke=da piada;a lot=muito",
  "cry|chorar|a lot=muito;with joy=de alegria;in silence=em silêncio",
  "smile|sorrir|at the camera=para a câmera;softly=suavemente;in the photo=na foto",
  "hope|esperar|for the best=o melhor;for a miracle=um milagre;for good news=boas notícias",
  "welcome|acolher|the guests=os convidados;new members=novos membros;everyone=todo mundo",
  "inspire|inspirar|others=os outros;the team=a equipe;young people=os jovens",
  "surprise|surpreender|the guests=os convidados;everyone=todo mundo;the neighbors=os vizinhos"
 ],
 move: [
  "arrive|chegar|early=cedo;on time=na hora;at the airport=ao aeroporto",
  "travel+arte|viajar|abroad=para o exterior;by train=de trem;alone=sozinho(a)",
  "enter|entrar|the room=na sala;the building=no prédio;quietly=em silêncio",
  "climb|escalar|a mountain=uma montanha;the stairs=a escada;a tree=uma árvore",
  "jump+esporte|pular|high=alto;over the fence=a cerca;into the pool=na piscina",
  "fly~flew,flown|voar|to Tokyo=para Tóquio;a drone=um drone;business class=de classe executiva",
  "swim*~swam,swum+esporte|nadar|in the sea=no mar;every morning=toda manhã;fast=rápido",
  "move|mover|the chair=a cadeira;slowly=devagar;forward=para a frente",
  "depart|partir|at noon=ao meio-dia;from gate five=do portão cinco;early=cedo",
  "escape|escapar|from prison=da prisão;the traffic=do trânsito;danger=do perigo",
  "park|estacionar|the car=o carro;nearby=perto;illegally=ilegalmente",
  "board|embarcar|the plane=no avião;the train=no trem;early=cedo",
  "land|pousar|safely=com segurança;at six=às seis;on time=no horário",
  "reach|alcançar|the top=o topo;the goal=a meta;the station=a estação",
  "chase+esporte|perseguir|the ball=a bola;a thief=um ladrão;a dream=um sonho",
  "explore|explorar|the city=a cidade;new places=novos lugares;the forest=a floresta",
  "guide|guiar|the tourists=os turistas;the team=a equipe;the way=o caminho"
 ],
 esporte: [
  "kick|chutar|the ball=a bola;the door=a porta;hard=forte",
  "score|marcar|a goal=um gol;two points=dois pontos;first=primeiro",
  "train|treinar|every day=todo dia;hard=duro;with a coach=com um técnico",
  "compete|competir|for gold=pelo ouro;against the best=contra os melhores;internationally=internacionalmente",
  "lift|levantar|weights=pesos;the trophy=o troféu;heavy boxes=caixas pesadas",
  "stretch|alongar|before training=antes do treino;the muscles=os músculos;slowly=devagar",
  "shoot~shot,shot|arremessar|a free throw=um lance livre;the ball=a bola;from a distance=de longe",
  "hit*~hit,hit|bater|the ball=na bola;the target=no alvo;the wall=na parede",
  "dribble|driblar|the defender=o zagueiro;past two players=dois jogadores;skillfully=com habilidade",
  "beat~beat,beaten|derrotar|the champion=o campeão;the record=o recorde;the best team=o melhor time",
  "cheer|torcer|for the team=pelo time;loudly=alto;from the stands=da arquibancada",
  "surf|surfar|big waves=ondas grandes;every weekend=todo fim de semana;in Hawaii=no Havaí",
  "dive|mergulhar|into the pool=na piscina;deep=fundo;from the board=do trampolim",
  "referee|apitar|the match=a partida;a final=uma final;fairly=com justiça"
 ],
 mat: [
  "add|somar|two numbers=dois números;the totals=os totais;a column=uma coluna",
  "subtract|subtrair|ten=dez;the cost=o custo;the discount=o desconto",
  "multiply|multiplicar|the values=os valores;by two=por dois;quickly=rápido",
  "divide|dividir|by four=por quatro;the bill=a conta;in half=ao meio",
  "calculate|calcular|the average=a média;the cost=o custo;the risk=o risco",
  "measure|medir|the length=o comprimento;the angle=o ângulo;twice=duas vezes",
  "estimate|estimar|the cost=o custo;the time=o tempo;roughly=aproximadamente",
  "round|arredondar|the number=o número;up=para cima;down=para baixo",
  "weigh|pesar|the box=a caixa;the options=as opções;ten kilos=dez quilos",
  "total|totalizar|ten points=dez pontos;the sales=as vendas;a hundred=cem",
  "demonstrate|demonstrar|a theorem=um teorema;the theory=a teoria;a point=um argumento",
  "plot*|traçar|a graph=um gráfico;the curve=a curva;the points=os pontos",
  "rank|classificar|the results=os resultados;the teams=as equipes;first=em primeiro",
  "convert+tech|converter|currency=moeda;units=unidades;a file=um arquivo"
 ],
 compra: [
  "spend~spent,spent|gastar|money=dinheiro;a fortune=uma fortuna;wisely=com sabedoria",
  "cost~cost,cost|custar|a lot=muito;ten dollars=dez dólares;little=pouco",
  "order|pedir|a pizza=uma pizza;two coffees=dois cafés;online=pela internet",
  "charge|cobrar|a fee=uma taxa;too much=demais;interest=juros",
  "owe|dever|money=dinheiro;a favor=um favor;ten dollars=dez dólares",
  "lend~lent,lent|emprestar|money=dinheiro;a book=um livro;a car=um carro",
  "earn|ganhar|money=dinheiro;a living=a vida;a good salary=um bom salário",
  "invest+trab|investir|in stocks=em ações;money=dinheiro;wisely=com sabedoria",
  "bargain|pechinchar|with the seller=com o vendedor;hard=bastante;for a discount=por um desconto",
  "refund|reembolsar|the customer=o cliente;the money=o dinheiro;in full=integralmente",
  "deliver+trab|entregar|the package=o pacote;on time=no prazo;to your door=na sua porta",
  "rent|alugar|an apartment=um apartamento;a car=um carro;a room=um quarto",
  "donate|doar|money=dinheiro;clothes=roupas;blood=sangue",
  "withdraw~withdrew,withdrawn|sacar|money=dinheiro;cash=dinheiro vivo;from the ATM=no caixa eletrônico",
  "deposit|depositar|a check=um cheque;money=dinheiro;ten dollars=dez dólares",
  "waste|desperdiçar|time=tempo;money=dinheiro;food=comida"
 ],
 trab: [
  "manage|gerenciar|a team=uma equipe;the budget=o orçamento;a project=um projeto",
  "hire|contratar|a developer=um desenvolvedor;new staff=novos funcionários;locally=localmente",
  "fire|demitir|an employee=um funcionário;the manager=o gerente;without notice=sem aviso",
  "lead~led,led|liderar|the team=a equipe;the meeting=a reunião;by example=pelo exemplo",
  "negotiate|negociar|a contract=um contrato;the price=o preço;a better deal=um acordo melhor",
  "schedule|agendar|a meeting=uma reunião;a call=uma ligação;an appointment=uma consulta",
  "plan*|planejar|the trip=a viagem;the budget=o orçamento;ahead=com antecedência",
  "organize|organizar|the files=os arquivos;an event=um evento;the schedule=a agenda",
  "apply|aplicar|a rule=uma regra;pressure=pressão;the method=o método",
  "resign|renunciar|from the board=ao conselho;immediately=imediatamente;from the post=ao cargo",
  "promote|promover|an employee=um funcionário;a product=um produto;the brand=a marca",
  "attend|comparecer|the meeting=à reunião;the conference=à conferência;class=à aula",
  "present|apresentar|the results=os resultados;a proposal=uma proposta;to the board=ao conselho",
  "produce|produzir|results=resultados;a report=um relatório;goods=mercadorias",
  "delegate|delegar|tasks=tarefas;authority=autoridade;to the team=à equipe",
  "launch|lançar|a product=um produto;a campaign=uma campanha;a startup=uma startup",
  "supervise|supervisionar|the staff=os funcionários;the project=o projeto;closely=de perto",
  "collaborate|colaborar|with the team=com a equipe;closely=de perto;on a report=em um relatório",
  "complete|concluir|the task=a tarefa;the project=o projeto;the course=o curso",
  "finish|terminar|the report=o relatório;on time=no prazo;first=primeiro",
  "start+muda|começar|a business=um negócio;early=cedo;over=de novo",
  "improve+muda|melhorar|the process=o processo;the quality=a qualidade;quickly=rápido",
  "develop+muda|desenvolver|a product=um produto;new skills=novas habilidades;a strategy=uma estratégia",
  "achieve|atingir|a goal=uma meta;success=o sucesso;great results=ótimos resultados",
  "operate|operar|a machine=uma máquina;a business=um negócio;legally=legalmente",
  "cancel|cancelar|a meeting=uma reunião;the order=o pedido;the trip=a viagem",
  "submit*|submeter|a report=um relatório;an application=uma inscrição;a proposal=uma proposta",
  "review+estudo|revisar|the contract=o contrato;the numbers=os números;carefully=com cuidado",
  "prepare+comida|preparar|a presentation=uma apresentação;the meeting=a reunião;dinner=o jantar",
  "recruit|recrutar|new members=novos membros;talent=talentos;students=estudantes"
 ],
 tech: [
  "click|clicar|on the button=no botão;on the link=no link;twice=duas vezes",
  "type|digitar|a message=uma mensagem;the password=a senha;fast=rápido",
  "download|baixar|a file=um arquivo;the app=o aplicativo;the report=o relatório",
  "upload|subir|a photo=uma foto;the file=o arquivo;a video=um vídeo",
  "install|instalar|the app=o aplicativo;an update=uma atualização;the software=o programa",
  "delete|apagar|the file=o arquivo;the message=a mensagem;the history=o histórico",
  "search|pesquisar|online=na internet;for a file=um arquivo;the database=no banco de dados",
  "print|imprimir|a document=um documento;the ticket=a passagem;in color=em cores",
  "scan*|escanear|a document=um documento;the code=o código;for viruses=em busca de vírus",
  "code|programar|in Python=em Python;an app=um aplicativo;every day=todo dia",
  "test|testar|the code=o código;a theory=uma teoria;the system=o sistema",
  "update|atualizar|the software=o programa;the data=os dados;the status=o status",
  "connect|conectar|to Wi-Fi=ao Wi-Fi;two devices=dois dispositivos;remotely=remotamente",
  "browse|navegar|the web=na internet;the catalog=pelo catálogo;online=online",
  "record|gravar|a video=um vídeo;a song=uma música;the meeting=a reunião",
  "copy|copiar|a file=um arquivo;the text=o texto;the link=o link",
  "paste|colar|the text=o texto;the link=o link;a screenshot=um print",
  "stream|transmitir|a movie=um filme;live=ao vivo;music=música",
  "encrypt|criptografar|data=dados;a file=um arquivo;messages=mensagens",
  "filter|filtrar|the data=os dados;spam=spam;the results=os resultados",
  "sort|ordenar|the list=a lista;the files=os arquivos;by date=por data",
  "debug*|depurar|the code=o código;a program=um programa;an error=um erro",
  "automate|automatizar|a process=um processo;tasks=tarefas;reports=relatórios",
  "process|processar|data=dados;payments=pagamentos;an order=um pedido",
  "open+casa|abrir|a file=um arquivo;the door=a porta;an account=uma conta",
  "post|postar|a photo=uma foto;a comment=um comentário;online=online",
  "monitor|monitorar|the system=o sistema;the progress=o progresso;prices=os preços",
  "press+fazer|apertar|the button=o botão;the key=a tecla;hard=com força"
 ],
 comida: [
  "cook|cozinhar|dinner=o jantar;rice=arroz;for the family=para a família",
  "bake|assar|a cake=um bolo;bread=pão;cookies=biscoitos",
  "boil|ferver|water=água;the eggs=os ovos;potatoes=batatas",
  "fry|fritar|an egg=um ovo;the fish=o peixe;in oil=em óleo",
  "chop*|picar|onions=cebolas;the herbs=as ervas;finely=bem fino",
  "slice|fatiar|the bread=o pão;a tomato=um tomate;thinly=bem fino",
  "peel|descascar|the potatoes=as batatas;an apple=uma maçã;the garlic=o alho",
  "pour|despejar|the milk=o leite;the sauce=o molho;water=água",
  "mix|misturar|the ingredients=os ingredientes;the colors=as cores;well=bem",
  "stir*|mexer|the soup=a sopa;the sauce=o molho;slowly=devagar",
  "taste|provar|the soup=a sopa;the wine=o vinho;a little=um pouco",
  "serve|servir|dinner=o jantar;coffee=café;the guests=os convidados",
  "grill|grelhar|the meat=a carne;vegetables=legumes;fish=peixe",
  "season|temperar|the meat=a carne;the salad=a salada;generously=generosamente",
  "feed~fed,fed|alimentar|the baby=o bebê;the dog=o cachorro;the family=a família",
  "chew|mastigar|slowly=devagar;the food=a comida;gum=chiclete",
  "swallow|engolir|the pill=o comprimido;water=água;slowly=devagar",
  "bite~bit,bitten|morder|an apple=uma maçã;the cake=o bolo;the sandwich=o sanduíche",
  "melt|derreter|butter=manteiga;chocolate=chocolate;the cheese=o queijo",
  "squeeze|espremer|a lemon=um limão;the orange=a laranja;gently=com delicadeza",
  "spread~spread,spread|espalhar|butter=manteiga;the jam=a geleia;rumors=boatos"
 ],
 casa: [
  "wake~woke,woken|acordar|early=cedo;the baby=o bebê;at seven=às sete",
  "dress|vestir|the child=a criança;the baby=o bebê;in black=de preto",
  "brush|escovar|the dog=o cachorro;the carpet=o tapete;gently=com delicadeza",
  "bathe|banhar|the baby=o bebê;the dog=o cachorro;daily=diariamente",
  "fix+fazer|consertar|the sink=a pia;the roof=o telhado;a bike=uma bicicleta",
  "repair+fazer|reparar|the car=o carro;the damage=o dano;a phone=um celular",
  "lock|trancar|the door=a porta;the car=o carro;the gate=o portão",
  "sweep~swept,swept|varrer|the floor=o chão;the porch=a varanda;every day=todo dia",
  "tidy|arrumar|the room=o quarto;the desk=a mesa;the garage=a garagem",
  "rest+corpo|descansar|for an hour=por uma hora;after lunch=depois do almoço;well=bem",
  "fold|dobrar|the clothes=as roupas;the towel=a toalha;the paper=o papel",
  "hang~hung,hung|pendurar|a picture=um quadro;the clothes=a roupa;the coat=o casaco",
  "decorate|decorar|the house=a casa;the tree=a árvore;the room=a sala",
  "water|regar|the plants=as plantas;the garden=o jardim;daily=diariamente",
  "light~lit,lit|acender|a candle=uma vela;the fire=o fogo;the lamp=a luminária",
  "pack|embalar|the boxes=as caixas;the gifts=os presentes;carefully=com cuidado",
  "wipe|enxugar|the table=a mesa;the floor=o chão;the glass=o vidro"
 ],
 fazer: [
  "build~built,built|construir|a house=uma casa;a team=uma equipe;a website=um site",
  "create+arte|criar|a plan=um plano;an account=uma conta;a new world=um novo mundo",
  "design+arte|projetar|a logo=um logotipo;a building=um prédio;a system=um sistema",
  "paint+arte|pintar|the wall=a parede;a portrait=um retrato;the door=a porta",
  "assemble|montar|a table=uma mesa;the parts=as peças;a team=uma equipe",
  "sew~sewed,sewn|costurar|a button=um botão;a dress=um vestido;by hand=à mão",
  "shape|moldar|clay=barro;the future=o futuro;an idea=uma ideia",
  "tie|amarrar|a knot=um nó;the shoes=os sapatos;the boat=o barco",
  "stick~stuck,stuck|grudar|a label=uma etiqueta;a note=um bilhete;the poster=o cartaz",
  "dig*~dug,dug|cavar|a hole=um buraco;the garden=o jardim;deep=fundo",
  "tear~tore,torn|rasgar|the paper=o papel;a page=uma página;the fabric=o tecido",
  "bend~bent,bent|curvar|the metal=o metal;the wire=o arame;the rules=as regras",
  "shake~shook,shaken|sacudir|the bottle=a garrafa;the tree=a árvore;the box=a caixa",
  "use+tech|usar|a tool=uma ferramenta;the app=o aplicativo;common sense=bom senso",
  "try|tentar|again=de novo;a new way=um novo jeito;hard=muito",
  "help+troca|ajudar|a friend=um amigo;the team=a equipe;others=os outros"
 ],
 estudo: [
  "study|estudar|English=inglês;for the exam=para a prova;hard=muito",
  "practice|praticar|every day=todo dia;English=inglês;the piano=o piano",
  "translate|traduzir|a text=um texto;the contract=o contrato;into English=para o inglês",
  "pronounce|pronunciar|a word=uma palavra;clearly=claramente;correctly=corretamente",
  "spell|soletrar|the name=o nome;the word=a palavra;correctly=corretamente",
  "quote|citar|a source=uma fonte;the author=o autor;a poem=um poema",
  "research|investigar|the topic=o tema;the market=o mercado;a cause=uma causa",
  "examine|examinar|the patient=o paciente;the evidence=as evidências;closely=de perto",
  "summarize|resumir|a text=um texto;the report=o relatório;the main points=os pontos principais",
  "highlight|destacar|the key points=os pontos-chave;a text=um texto;the risks=os riscos",
  "edit|editar|a text=um texto;a video=um vídeo;carefully=com cuidado",
  "draft|redigir|a letter=uma carta;a contract=um contrato;an email=um e-mail",
  "correct|corrigir|a mistake=um erro;the tests=as provas;the accent=o sotaque",
  "publish+tech|publicar|a book=um livro;an article=um artigo;a paper=um artigo científico"
 ],
 corpo: [
  "breathe|respirar|deeply=fundo;slowly=devagar;fresh air=ar fresco",
  "cough|tossir|a lot=muito;at night=à noite;loudly=alto",
  "hurt~hurt,hurt|machucar|the animal=o animal;a friend=um amigo;badly=muito",
  "bleed~bled,bled|sangrar|a lot=muito;from the nose=pelo nariz;badly=bastante",
  "heal|curar|quickly=rápido;the wound=a ferida;a friend=um amigo",
  "sweat|suar|a lot=muito;at night=à noite;in the gym=na academia",
  "sneeze|espirrar|loudly=alto;twice=duas vezes;all day=o dia todo",
  "touch|tocar|the screen=a tela;the wall=a parede;the surface=a superfície",
  "hear~heard,heard|ouvir|a noise=um barulho;the news=a notícia;clearly=claramente",
  "listen+arte|escutar|to music=música;carefully=com atenção;to the radio=o rádio",
  "watch+arte|assistir|a movie=um filme;TV=TV;the game=o jogo",
  "treat|tratar|a patient=um paciente;an infection=uma infecção;everyone equally=todos igualmente",
  "recover|recuperar|data=dados;the money=o dinheiro;the files=os arquivos",
  "diagnose|diagnosticar|a patient=um paciente;a disease=uma doença;the problem=o problema",
  "die|morrer|young=jovem;of laughter=de rir;peacefully=em paz"
 ],
 natureza: [
  "plant|plantar|a tree=uma árvore;seeds=sementes;flowers=flores",
  "harvest|colher|corn=milho;the fruit=as frutas;in autumn=no outono",
  "protect|proteger|the environment=o meio ambiente;nature=a natureza;children=as crianças",
  "recycle|reciclar|plastic=plástico;paper=papel;glass=vidro",
  "pollute|poluir|the river=o rio;the air=o ar;the ocean=o oceano",
  "burn|queimar|wood=madeira;calories=calorias;the paper=o papel",
  "freeze~froze,frozen|congelar|food=a comida;the account=a conta;the water=a água",
  "shine~shone,shone|brilhar|brightly=muito;in the dark=no escuro;like a star=como uma estrela",
  "fish|pescar|in the river=no rio;with a net=com rede;every Sunday=todo domingo",
  "camp|acampar|near the lake=perto do lago;in the forest=na floresta;in summer=no verão",
  "bloom|florescer|in spring=na primavera;early=cedo;beautifully=lindamente",
  "survive|sobreviver|the winter=ao inverno;the crash=ao acidente;on little=com pouco",
  "sink~sank,sunk|afundar|quickly=rápido;to the bottom=até o fundo;slowly=devagar"
 ],
 arte: [
  "sing~sang,sung|cantar|a song=uma música;in the choir=no coral;out of tune=desafinado",
  "dance|dançar|salsa=salsa;all night=a noite toda;with a partner=com um parceiro",
  "act|atuar|in a play=em uma peça;in films=em filmes;naturally=naturalmente",
  "perform|executar|a song=uma música;a test=um teste;well=bem",
  "film|filmar|a scene=uma cena;a documentary=um documentário;with a phone=com o celular",
  "photograph|fotografar|the landscape=a paisagem;a wedding=um casamento;animals=animais",
  "entertain|animar|the guests=os convidados;the crowd=o público;children=as crianças",
  "celebrate|comemorar|a birthday=um aniversário;the victory=a vitória;with friends=com amigos",
  "relax|relaxar|at home=em casa;on weekends=nos fins de semana;completely=completamente",
  "invite|convidar|friends=amigos;the whole team=a equipe toda;the neighbors to dinner=os vizinhos para jantar",
  "collect|colecionar|stamps=selos;coins=moedas;memories=lembranças",
  "gather|juntar|friends=amigos;information=informações;the family=a família"
 ],
 lei: [
  "obey|obedecer|the rules=às regras;the law=à lei;orders=às ordens",
  "forbid*~forbade,forbidden|proibir|smoking=fumar;entry=a entrada;the use of phones=o uso de celulares",
  "allow|permitir|access=o acesso;the use=o uso;children=as crianças",
  "require|exigir|a password=uma senha;patience=paciência;proof=prova",
  "sue|acionar|the company=a empresa;the city=a prefeitura;for damages=por danos",
  "arrest|prender|a suspect=um suspeito;the thief=o ladrão;a driver=um motorista",
  "vote|votar|for change=por mudança;online=online;in the election=na eleição",
  "elect|eleger|a president=um presidente;a leader=um líder;a mayor=um prefeito",
  "ban*|banir|a product=um produto;smoking=o fumo;the app=o aplicativo",
  "sign|assinar|a contract=um contrato;the document=o documento;the check=o cheque",
  "govern|governar|a country=um país;the state=o estado;wisely=com sabedoria",
  "punish|punir|the crime=o crime;harshly=duramente;the guilty=os culpados",
  "testify|testemunhar|in court=no tribunal;against the defendant=contra o réu;under oath=sob juramento",
  "declare|declarar|war=guerra;the winner=o vencedor;income=a renda",
  "comply|cumprir|with the rules=as regras;with the law=a lei;with the deadline=o prazo"
 ],
 muda: [
  "change|mudar|the date=a data;the plan=o plano;completely=completamente",
  "increase|aumentar|prices=os preços;quickly=rápido;slowly=lentamente",
  "decrease|diminuir|costs=os custos;gradually=gradualmente;sharply=bruscamente",
  "continue|continuar|working=trabalhando;as planned=como planejado;the work=o trabalho",
  "end|encerrar|the meeting=a reunião;the contract=o contrato;the call=a ligação",
  "remain|permanecer|calm=calmo(a);silent=em silêncio;open=aberto",
  "happen|acontecer|often=com frequência;suddenly=de repente;again=de novo",
  "seem|parecer|tired=cansado(a);happy=feliz;sure=certo(a)",
  "appear|aparecer|suddenly=de repente;on the screen=na tela;late=tarde",
  "disappear|desaparecer|quickly=rápido;overnight=da noite para o dia;without a trace=sem deixar rastros",
  "exist|existir|only online=só online;for real=de verdade;in theory=na teoria",
  "reduce|reduzir|costs=os custos;waste=o desperdício;the risk=o risco",
  "replace|substituir|the old one=o antigo;a part=uma peça;a worker=um funcionário",
  "adapt|adaptar|to change=à mudança;quickly=rápido;the plan=o plano",
  "adjust|ajustar|the settings=as configurações;the plan=o plano;slightly=levemente",
  "expand|expandir|the business=o negócio;abroad=no exterior;quickly=rápido",
  "last|durar|an hour=uma hora;a long time=muito tempo;forever=para sempre"
 ],
 troca: [
  "offer|oferecer|help=ajuda;a discount=um desconto;a job=um emprego",
  "accept|aceitar|the offer=a oferta;responsibility=a responsabilidade;the result=o resultado",
  "refuse|recusar|the deal=o acordo;help=ajuda;politely=educadamente",
  "receive|receber|a message=uma mensagem;a gift=um presente;feedback=um feedback",
  "own|possuir|a house=uma casa;a car=um carro;a business=um negócio",
  "gain|adquirir|experience=experiência;skills=habilidades;an advantage=uma vantagem",
  "provide|fornecer|information=informações;support=apoio;a service=um serviço",
  "exchange|trocar|gifts=presentes;money=dinheiro;ideas=ideias",
  "steal~stole,stolen+lei|roubar|a wallet=uma carteira;a car=um carro;the show=a cena",
  "hide~hid,hidden|esconder|the truth=a verdade;the keys=as chaves;a secret=um segredo",
  "seek~sought,sought|buscar|help=ajuda;the truth=a verdade;a solution=uma solução"
 ]
};

/* Exceções do português (o que a regra regular não cobre). Só as formas listadas mudam. */
/* ---- Banco ampliado (v83): mais verbos, verbos frasais (^) e etimologia inline (último campo) ---- */
const VERBOS_NOVOS_B = {
 mente: [
  "assume|assumir|responsibility=a responsabilidade;control=o controle;the role=o papel|L:lat. assumere (tomar para si)",
  "ignore|ignorar|the warning=o aviso;the problem=o problema;a call=uma ligação|L:lat. ignorare (desconhecer)",
  "interpret|interpretar|the data=os dados;a dream=um sonho;the results=os resultados|L:lat. interpretari",
  "discover|descobrir|a cure=uma cura;the truth=a verdade;a new planet=um novo planeta|F:francês antigo descovrir",
  "reflect|refletir|on the past=sobre o passado;carefully=com cuidado;on the results=sobre os resultados|L:lat. reflectere (voltar atrás)",
  "wish|desejar|good luck=boa sorte;the best=o melhor;success=sucesso|G:ing. ant. wȳscan",
  "regret*|lamentar|the decision=a decisão;the loss=a perda;the mistake=o erro|F:francês regreter",
  "reconsider|reconsiderar|the offer=a oferta;the decision=a decisão;the plan=o plano|L:re- + lat. considerare",
  "recall|recordar|the details=os detalhes;the name=o nome;a memory=uma lembrança|N:re- + call (nórdico antigo kalla)",
  "conclude|concluir|the meeting=a reunião;the study=o estudo;a deal=um acordo|L:lat. concludere (fechar)",
  "infer*|inferir|a meaning=um significado;the cause=a causa;a conclusion=uma conclusão|L:lat. inferre (trazer para dentro)",
  "hesitate|hesitar|for a moment=por um momento;before answering=antes de responder;briefly=por um instante|L:lat. haesitare (ficar preso)",
  "concentrate|concentrar|on the task=na tarefa;hard=muito;on the road=na estrada|L:lat. con- + centrum",
  "ponder|ponderar|the question=a questão;the options=as opções;for a while=por um tempo|F:francês ponderer, do lat. ponderare (pesar)",
  "deduce|deduzir|the cause=a causa;a rule=uma regra;the answer=a resposta|L:lat. deducere (conduzir de)",
  "identify|identificar|the problem=o problema;a suspect=um suspeito;the cause=a causa|L:lat. medieval identificare (idem + facere)",
  "distinguish|distinguir|the two=os dois;right from wrong=o certo do errado;the colors=as cores|F:francês distinguer, do lat. distinguere",
  "determine|determinar|the cause=a causa;the price=o preço;the outcome=o resultado|F:francês determiner, do lat. determinare",
  "verify|verificar|the data=os dados;the identity=a identidade;the facts=os fatos|F:francês verifier, do lat. verus (verdadeiro)",
  "confirm|confirmar|the booking=a reserva;the date=a data;the news=a notícia|F:francês confirmer, do lat. confirmare",
  "deny|negar|the accusation=a acusação;the rumor=o boato;everything=tudo|F:francês denier, do lat. denegare",
  "admit*|admitir|a mistake=um erro;the truth=a verdade;defeat=a derrota|L:lat. admittere",
  "define|definir|the term=o termo;the goal=o objetivo;the problem=o problema|F:francês definir, do lat. definire (delimitar)",
  "prove~proved,proven|provar|a point=um argumento;the theory=a teoria;the case=o caso|F:francês prover, do lat. probare",
  "intend|pretender|to leave early=sair cedo;to win=ganhar;to stay=ficar|F:francês entendre, do lat. intendere (dirigir)",
  "aim|visar|high=alto;at the target=ao alvo;for the best=ao melhor|F:francês aesmer, do lat. aestimare",
  "suppose|supor|so=que sim;the worst=o pior;that it works=que funciona|F:francês supposer, do lat. supponere",
  "pretend|fingir|to sleep=dormir;to be sick=estar doente;to care=se importar|L:lat. praetendere (estender diante)",
  "depend|depender|on the weather=do clima;on the price=do preço;on the team=da equipe|F:francês dependre, do lat. dependere"
 ],
 juiz: [
  "condemn|condenar|the violence=a violência;the decision=a decisão;the attack=o ataque|F:francês condemner, do lat. condemnare",
  "applaud|aplaudir|the performance=a apresentação;the team=a equipe;loudly=bastante|L:lat. applaudere (bater palmas)",
  "appreciate|valorizar|the help=a ajuda;the effort=o esforço;good food=a boa comida|L:lat. appretiare (dar valor)",
  "underestimate|subestimar|the risk=o risco;the problem=o problema;the opponent=o adversário|L:ing. under- + lat. aestimare",
  "overestimate|superestimar|the benefits=os benefícios;the cost=o custo;a result=um resultado|L:ing. over- + lat. aestimare",
  "rate|avaliar|the service=o serviço;the movie=o filme;the product=o produto|F:francês rater, do lat. reri (calcular)",
  "mock|zombar|the idea=da ideia;a colleague=de um colega;the accent=do sotaque|F:francês antigo mocquer",
  "insult|insultar|a colleague=um colega;the referee=o juiz;the guests=os convidados|L:lat. insultare (saltar sobre)",
  "offend|ofender|the guests=os convidados;a colleague=um colega;the customer=o cliente|L:lat. offendere (tropeçar em)",
  "endorse|endossar|a product=um produto;the plan=o plano;a candidate=um candidato|F:francês endosser, do lat. in dorsum (nas costas)"
 ],
 fala: [
  "reply|responder|to the email=ao e-mail;quickly=rápido;politely=educadamente|F:francês replier, do lat. replicare (dobrar de volta)",
  "respond|responder|to the question=à pergunta;to a message=a uma mensagem;immediately=imediatamente|L:lat. respondere",
  "insist|insistir|on the truth=na verdade;on paying=em pagar;strongly=com firmeza|L:lat. insistere (apoiar-se em)",
  "claim|reivindicar|a prize=um prêmio;the reward=a recompensa;the credit=o crédito|F:francês clamer, do lat. clamare (gritar)",
  "confess|confessar|the crime=o crime;the truth=a verdade;everything=tudo|L:lat. confiteri",
  "advise|aconselhar|the client=o cliente;caution=cautela;the team=a equipe|F:francês aviser, do lat. ad + visum",
  "convince|convencer|the client=o cliente;the board=o conselho;everyone=todos|L:lat. convincere (vencer completamente)",
  "persuade|persuadir|the customer=o cliente;the committee=o comitê;a friend=um amigo|L:lat. persuadere",
  "encourage|encorajar|the team=a equipe;students=os alunos;creativity=a criatividade|F:francês encorager (en- + cuer, coração)",
  "discourage|desencorajar|the team=a equipe;smoking=o fumo;students=os alunos|F:francês descourager",
  "apologize|pedir desculpas|for the delay=pelo atraso;to the client=ao cliente;sincerely=sinceramente|R:grego apologia (defesa)",
  "congratulate|parabenizar|the winner=o vencedor;the team=a equipe;a friend=um amigo|L:lat. congratulari",
  "chat*|bater papo|online=online;with a friend=com um amigo;for hours=por horas|G:de chatter (imitativo)",
  "gossip|fofocar|about a colleague=sobre um colega;all day=o dia todo;online=online|G:ing. ant. godsibb (padrinho, parente espiritual)",
  "murmur|murmurar|a prayer=uma oração;softly=baixinho;to the child=para a criança|L:lat. murmurare (imitativo)",
  "mumble|resmungar|something=algo;an apology=um pedido de desculpas;quietly=baixinho|G:médio inglês momelen (imitativo)",
  "scream|berrar|in fear=de medo;with joy=de alegria;for help=por socorro|N:provável nórdico (cf. islandês skræma)",
  "sigh|suspirar|with relief=de alívio;deeply=fundo;loudly=alto|G:ing. ant. sīcan",
  "tease|provocar|a friend=um amigo;the dog=o cachorro;gently=de leve|G:ing. ant. tǣsan (puxar fios)",
  "joke|brincar|about it=sobre isso;with friends=com os amigos;constantly=o tempo todo|L:lat. iocus (brincadeira)",
  "lie|mentir|about the price=sobre o preço;to a friend=para um amigo;constantly=o tempo todo|G:ing. ant. lēogan",
  "swear~swore,sworn|jurar|an oath=um juramento;loudly=alto;on the book=sobre o livro|G:ing. ant. swerian",
  "curse|xingar|the referee=o juiz;the weather=o clima;quietly=baixinho|I:ing. ant. curs (origem incerta)",
  "narrate|narrar|a story=uma história;the events=os eventos;a documentary=um documentário|L:lat. narrare",
  "inform|informar|the client=o cliente;the team=a equipe;everyone=todos|F:francês informer, do lat. informare",
  "notify|notificar|the team=a equipe;the customer=o cliente;by email=por e-mail|F:francês notifier, do lat. notificare",
  "remind|lembrar|the team=a equipe;a friend=um amigo;everyone=todos|G:re- + ing. ant. gemynd (memória)",
  "request|solicitar|a refund=um reembolso;help=ajuda;a meeting=uma reunião|F:francês requeste, do lat. requisita",
  "demand|exigir|an answer=uma resposta;respect=respeito;a refund=um reembolso|F:francês demander, do lat. demandare",
  "refer*|referir|to the report=ao relatório;to a source=a uma fonte;briefly=brevemente|L:lat. referre (trazer de volta)",
  "address|abordar|the issue=a questão;the audience=o público;the problem=o problema|F:francês adresser, do lat. directus",
  "clarify|esclarecer|the point=o ponto;the rules=as regras;the doubt=a dúvida|L:lat. clarificare (tornar claro)",
  "emphasize|enfatizar|the point=o ponto;the importance=a importância;the risks=os riscos|R:grego emphasis (aparência, ênfase)",
  "stutter|gaguejar|when nervous=quando nervoso;a little=um pouco;badly=muito|G:frequentativo de stut (gaguejar), de origem germânica"
 ],
 afeto: [
  "adore|adorar|music=música;the view=a vista;children=as crianças|F:francês adorer, do lat. adorare",
  "cherish|valorizar|a memory=uma lembrança;a friend=um amigo;every moment=cada momento|F:francês chérir (caro), do lat. carus",
  "envy|invejar|a friend=um amigo;the success=o sucesso;the freedom=a liberdade|F:francês envier, do lat. invidia",
  "embrace|abraçar|change=a mudança;the idea=a ideia;a friend=um amigo|F:francês embracer (em + brace, braços)",
  "flirt|flertar|with a stranger=com um estranho;openly=abertamente;at the party=na festa|I:origem incerta (séc. XVI, imitativa)",
  "date|namorar|a colleague=um colega;someone=alguém;for a year=por um ano|L:lat. data (dada)",
  "grieve|sofrer|for a friend=por um amigo;deeply=profundamente;in silence=em silêncio|F:francês grever, do lat. gravare (pesar)",
  "worry|preocupar|about money=com dinheiro;a lot=muito;constantly=o tempo todo|G:ing. ant. wyrgan (estrangular)",
  "blush|corar|easily=facilmente;with embarrassment=de vergonha;slightly=levemente|G:ing. ant. blyscan (ficar vermelho)",
  "shiver|tremer|with cold=de frio;in the cold=no frio;slightly=levemente|I:médio inglês chiveren (origem incerta)",
  "annoy|irritar|the teacher=o professor;everyone=todos;the neighbors=os vizinhos|F:francês enuier, do lat. in odio (em ódio)",
  "bore|entediar|the audience=o público;the students=os alunos;everyone=todos|I:origem incerta (séc. XVIII)",
  "amuse|divertir|the children=as crianças;the guests=os convidados;everyone=todos|F:francês amuser (fazer olhar tolamente)",
  "delight|encantar|the audience=o público;the children=as crianças;everyone=todos|F:francês delitier, do lat. delectare",
  "impress|impressionar|the client=o cliente;the boss=o chefe;everyone=todos|L:lat. imprimere (pressionar sobre)",
  "disappoint|decepcionar|the team=a equipe;the fans=os fãs;a friend=um amigo|F:francês desappointer",
  "frighten|assustar|the child=a criança;the dog=o cachorro;everyone=todos|G:ing. ant. fyrhtan (temer)",
  "shock|chocar|the audience=o público;everyone=todos;the market=o mercado|F:francês choquer (de origem germânica)",
  "upset*~upset,upset|chatear|a friend=um amigo;the child=a criança;everyone=todos|G:up + set (compostos ingleses)",
  "calm|acalmar|the child=a criança;the crowd=a multidão;the nerves=os nervos|F:francês calmer, do gr. kauma (calor do meio-dia)",
  "please|agradar|the customer=o cliente;the audience=o público;everyone=todos|F:francês plaisir, do lat. placere"
 ],
 move: [
  "wander|vagar|around the city=pela cidade;in the forest=pela floresta;aimlessly=sem rumo|G:ing. ant. wandrian",
  "march|marchar|forward=em frente;in the street=na rua;to the square=até a praça|F:francês marcher (de origem germânica)",
  "crawl|engatinhar|on the floor=no chão;slowly=devagar;under the table=sob a mesa|N:nórdico antigo krafla",
  "slide~slid,slid|deslizar|down the hill=morro abaixo;across the floor=pelo chão;slowly=devagar|G:ing. ant. slīdan",
  "slip*|escorregar|on the ice=no gelo;on the stairs=na escada;easily=com facilidade|H:baixo-alemão/holandês slippen",
  "roll|rolar|down the hill=morro abaixo;the dice=os dados;the ball=a bola|F:francês roler, do lat. rotulus (roda pequena)",
  "rush|correr|to the airport=até o aeroporto;home=para casa;to the hospital=ao hospital|F:anglo-francês russher (afastar), do lat. recusare",
  "hike|trilhar|in the mountains=nas montanhas;a long trail=uma longa trilha;every weekend=todo fim de semana|I:origem incerta (dialetal)",
  "stroll|passear|along the beach=pela praia;in the park=no parque;slowly=devagar|I:origem incerta (talvez alemão strollen)",
  "approach|chegar perto|the door=da porta;the building=do prédio;slowly=devagar|F:francês aprochier, do lat. appropiare",
  "avoid|evitar|the traffic=o trânsito;the problem=o problema;conflict=o conflito|F:francês esvuidier (esvaziar)",
  "jog*|correr leve|in the park=no parque;every morning=toda manhã;slowly=devagar|I:origem incerta (séc. XVI)",
  "skate|patinar|on the ice=no gelo;in the park=no parque;every weekend=todo fim de semana|H:holandês schaats (pé de ferro), via francês",
  "ski|esquiar|in the mountains=nas montanhas;down the slope=pela encosta;every winter=todo inverno|N:nórdico antigo skíð (tábua)",
  "sail|navegar|across the sea=pelo mar;around the world=pelo mundo;alone=sozinho(a)|G:ing. ant. segl (vela)",
  "row|remar|across the lake=pelo lago;a boat=um barco;hard=com força|G:ing. ant. rōwan",
  "steer|conduzir|the boat=o barco;the car=o carro;the team=a equipe|G:ing. ant. stēran (guiar)",
  "stumble|tropeçar|on the stairs=na escada;over a stone=numa pedra;badly=feio|N:provável nórdico (cf. norueguês stumla)",
  "lean|inclinar|forward=para a frente;on the wall=na parede;back=para trás|G:ing. ant. hleonian",
  "kneel~knelt,knelt|ajoelhar|on the floor=no chão;before the king=diante do rei;to pray=para rezar|G:ing. ant. cnēowlian",
  "crouch|agachar|behind the car=atrás do carro;in fear=de medo;slowly=devagar|F:francês croucher (curvar), de origem germânica",
  "sit*~sat,sat|sentar|on the sofa=no sofá;at the table=à mesa;in silence=em silêncio|G:ing. ant. sittan",
  "rise~rose,risen+muda|subir|quickly=rápido;slowly=devagar;early=cedo|G:ing. ant. rīsan",
  "bounce|quicar|on the floor=no chão;the ball=a bola;back=de volta|I:médio inglês bounsen (imitativo)",
  "swing~swung,swung|balançar|on the swing=no balanço;the bat=o taco;back and forth=de um lado a outro|G:ing. ant. swingan (açoitar)",
  "spin*~spun,spun|girar|the wheel=a roda;the globe=o globo;fast=rápido|G:ing. ant. spinnan (fiar)",
  "migrate|migrar|to the city=para a cidade;every year=todo ano;south=para o sul|L:lat. migrare",
  "flee~fled,fled|fugir|the country=do país;quickly=rápido;from danger=do perigo|G:ing. ant. flēon",
  "retreat|recuar|slowly=devagar;from the border=da fronteira;quickly=rápido|F:francês retraite, do lat. retrahere",
  "advance|avançar|slowly=devagar;to the next round=para a próxima fase;quickly=rápido|F:francês avancer, do lat. abante",
  "cycle|pedalar|to work=até o trabalho;in the park=no parque;every day=todo dia|R:grego kyklos (círculo)"
 ],
 esporte: [
  "box|boxear|every day=todo dia;with a coach=com um técnico;in the ring=no ringue|I:origem incerta (médio inglês box, golpe)",
  "punch|socar|the bag=o saco;the wall=a parede;hard=forte|F:francês poinçon (pontaria), do lat. pungere",
  "coach|orientar|the team=a equipe;young players=jovens jogadores;a student=um aluno|O:húngaro kocsi (carruagem de Kocs), via francês",
  "exercise|exercitar|every day=todo dia;daily=diariamente;regularly=com regularidade|L:lat. exercere (manter ocupado)",
  "skip*|pular|a class=uma aula;a meal=uma refeição;the line=a fila|N:provável nórdico (cf. sueco skuppa)",
  "bat*|rebater|the ball=a bola;first=primeiro;well=bem|F:francês battre, do lat. battuere (bater)"
 ],
 mat: [
  "compute|computar|the result=o resultado;the average=a média;a sum=uma soma|L:lat. computare",
  "exceed|exceder|the limit=o limite;expectations=as expectativas;the budget=o orçamento|L:lat. excedere (ir além)",
  "balance|equilibrar|the budget=o orçamento;the books=as contas;the scale=a balança|F:francês balancer, do lat. bilanx (duas bandejas)",
  "integrate|integrar|the data=os dados;a function=uma função;the team=a equipe|L:lat. integrare (tornar inteiro)",
  "approximate|aproximar|the value=o valor;a result=um resultado;the cost=o custo|L:lat. approximare",
  "tally|contar|the votes=os votos;the points=os pontos;the score=o placar|L:lat. talea (vara entalhada)",
  "simplify|simplificar|the equation=a equação;the process=o processo;the fraction=a fração|L:lat. simplificare",
  "double|dobrar|the amount=a quantia;the price=o preço;the speed=a velocidade|F:francês doubler, do lat. duplus",
  "triple|triplicar|the profit=o lucro;the sales=as vendas;the size=o tamanho|F:francês tripler, do lat. triplus"
 ],
 compra: [
  "shop*|comprar|for clothes=roupas;online=online;every weekend=todo fim de semana|G:ing. ant. sceoppa (barraca)",
  "borrow|pegar emprestado|money=dinheiro;a book=um livro;a car=um carro|G:ing. ant. borgian",
  "budget|orçar|for the trip=para a viagem;carefully=com cuidado;monthly=mensalmente|F:francês bougette (bolsinha), do lat. bulga",
  "import|importar|goods=mercadorias;oil=petróleo;from China=da China|L:lat. importare (trazer para dentro)",
  "export|exportar|goods=mercadorias;software=software;to Europe=para a Europa|L:lat. exportare (levar para fora)",
  "auction|leiloar|a painting=um quadro;the house=a casa;online=online|L:lat. auctio (aumento)",
  "sponsor|patrocinar|the event=o evento;a team=um time;a student=um estudante|L:lat. sponsor (fiador)",
  "finance|financiar|a project=um projeto;a house=uma casa;the trip=a viagem|F:francês finance, do lat. medieval finare (pagar)",
  "profit|lucrar|from the sale=com a venda;greatly=muito;from the deal=com o negócio|F:francês profit, do lat. profectus",
  "price|precificar|a product=um produto;the service=o serviço;competitively=de forma competitiva|F:francês pris, do lat. pretium",
  "discount|descontar|the price=o preço;a fee=uma taxa;heavily=bastante|F:francês descompter (des- + compter)",
  "tax|tributar|income=a renda;goods=as mercadorias;luxury items=itens de luxo|L:lat. taxare (avaliar)",
  "insure|segurar|the car=o carro;the house=a casa;the goods=a mercadoria|F:francês enseurer (en- + seur, seguro)",
  "cash|descontar|a check=um cheque;the voucher=o vale;a payment=um pagamento|F:francês caisse (cofre), do lat. capsa",
  "bill|faturar|the client=o cliente;monthly=mensalmente;the services=os serviços|L:lat. bulla (selo, documento)"
 ],
 trab: [
  "employ|empregar|a worker=um trabalhador;new staff=novos funcionários;locals=pessoas da região|F:francês employer, do lat. implicare",
  "coordinate|coordenar|the team=a equipe;the project=o projeto;the event=o evento|L:lat. coordinare (co- + ordinare)",
  "consult|consultar|a lawyer=um advogado;the manual=o manual;an expert=um especialista|L:lat. consultare",
  "assign|atribuir|a task=uma tarefa;the roles=os papéis;a project=um projeto|F:francês assigner, do lat. assignare",
  "assist|auxiliar|the client=o cliente;the doctor=o médico;the team=a equipe|F:francês assister, do lat. assistere (ficar ao lado)",
  "represent|representar|the company=a empresa;the client=o cliente;the country=o país|F:francês representer, do lat. repraesentare",
  "merge|fundir|two companies=duas empresas;the files=os arquivos;the teams=as equipes|L:lat. mergere (mergulhar)",
  "file|arquivar|the documents=os documentos;a complaint=uma reclamação;a report=um relatório|F:francês filer, do lat. filum (fio)",
  "appoint|nomear|a manager=um gerente;a committee=um comitê;a new director=um novo diretor|F:francês apointer (a + point)",
  "accomplish|realizar|a goal=uma meta;the task=a tarefa;a lot=muito|F:francês accomplir, do lat. complere",
  "audit|auditar|the accounts=as contas;the company=a empresa;the process=o processo|L:lat. auditus (ouvir, audição)",
  "reconcile|conciliar|the accounts=as contas;the balance=o saldo;the statements=os extratos|L:lat. reconciliare",
  "depreciate|depreciar|an asset=um ativo;the equipment=o equipamento;over five years=ao longo de cinco anos|L:lat. depretiare (diminuir o preço)",
  "amortize|amortizar|a loan=um empréstimo;the debt=a dívida;an asset=um ativo|F:francês amortir, do lat. ad mortem (levar à morte)",
  "accrue|acumular|interest=juros;revenue=a receita;costs=custos|F:francês acreu, do lat. accrescere",
  "forecast~forecast,forecast|projetar|sales=as vendas;demand=a demanda;revenue=a receita|N:fore- (ing. ant.) + cast (nórdico antigo kasta)",
  "allocate|alocar|funds=recursos;the budget=o orçamento;time=tempo|L:lat. allocare (colocar em)",
  "capitalize|capitalizar|a cost=um custo;the company=a empresa;on an opportunity=uma oportunidade|L:lat. capitalis (principal, de caput)",
  "outsource|terceirizar|the service=o serviço;the work=o trabalho;production=a produção|G:composto inglês: out + source (lat. surgere)",
  "diversify|diversificar|the portfolio=a carteira;the business=o negócio;investments=os investimentos|L:lat. diversificare",
  "liquidate|liquidar|the assets=os ativos;a company=uma empresa;the stock=o estoque|L:lat. liquidare (tornar líquido)",
  "streamline|simplificar|the process=o processo;operations=as operações;the workflow=o fluxo|G:composto inglês: stream + line",
  "leverage|alavancar|data=dados;the brand=a marca;experience=a experiência|F:francês levier (alavanca), do lat. levare",
  "prioritize|priorizar|tasks=as tarefas;the customer=o cliente;the budget=o orçamento|F:francês prioritaire, do lat. prior",
  "onboard|integrar|new hires=novos contratados;the client=o cliente;the team=a equipe|G:composto inglês: on + board (ing. ant. bord)",
  "involve|envolver|the team=a equipe;a risk=um risco;everyone=todos|F:francês involver, do lat. involvere (enrolar)",
  "handle|manusear|the equipment=o equipamento;the situation=a situação;the package=o pacote|G:ing. ant. handlian (tocar com a mão)",
  "succeed|vencer|in life=na vida;in business=nos negócios;at last=por fim|L:lat. succedere (vir depois)",
  "set^up*~set,set|montar|a business=um negócio;a meeting=uma reunião;the equipment=o equipamento|G:ing. ant. settan + up",
  "break^down~broke,broken|pifar|suddenly=de repente;on the road=na estrada;often=com frequência|G:ing. ant. brecan + dūne",
  "show^up~showed,shown|aparecer|on time=na hora;late=tarde;unexpectedly=de repente|G:ing. ant. scēawian + up",
  "pick^up|buscar|the kids=as crianças;the package=o pacote;a friend=um amigo|I:pick (incerto) + up",
  "give^back~gave,given|devolver|the money=o dinheiro;the keys=as chaves;the book=o livro|G:ing. ant. giefan + bæc",
  "turn^off|desligar|the light=a luz;the computer=o computador;the TV=a TV|L:lat. tornare + off",
  "go^on~went,gone|continuar|for hours=por horas;with the plan=com o plano;without a break=sem pausa|G:ing. ant. gān + on",
  "make^up~made,made|inventar|a story=uma história;an excuse=uma desculpa;a name=um nome|G:ing. ant. macian + up",
  "look^up|pesquisar|a word=uma palavra;the address=o endereço;the number=o número|G:ing. ant. lōcian + up",
  "sit^down*~sat,sat|sentar|at the table=à mesa;on the sofa=no sofá;quietly=em silêncio|G:ing. ant. sittan + dūne",
  "stand^up~stood,stood|levantar|quickly=rápido;slowly=devagar;for the anthem=para o hino|G:ing. ant. standan + up",
  "throw^away~threw,thrown|jogar fora|the trash=o lixo;old clothes=as roupas velhas;the packaging=a embalagem|G:ing. ant. thrāwan + āweg",
  "call^off|suspender|the meeting=a reunião;the strike=a greve;the search=a busca|N:nórdico antigo kalla + off",
  "figure^out|descobrir|the answer=a resposta;the problem=o problema;the solution=a solução|L:lat. figura + out",
  "hand^in|entregar|the homework=a lição;the report=o relatório;the form=o formulário|G:ing. ant. hand + in",
  "hold^on~held,held|aguardar|a moment=um momento;a second=um segundo;for a minute=por um minuto|G:ing. ant. healdan + on",
  "let^down*~let,let|decepcionar|a friend=um amigo;the team=a equipe;the fans=os fãs|G:ing. ant. lǣtan + dūne",
  "log^in*|entrar|to the system=no sistema;to the app=no aplicativo;with a password=com uma senha|G:log (médio inglês logge) + in",
  "pay^back~paid,paid|ressarcir|the loan=o empréstimo;the debt=a dívida;a friend=um amigo|F:francês payer + ing. back",
  "point^out|apontar|the mistake=o erro;the problem=o problema;the difference=a diferença|F:francês pointer + out",
  "set^off*~set,set|partir|early=cedo;at dawn=ao amanhecer;for Paris=para Paris|G:ing. ant. settan + of",
  "take^over~took,taken|assumir|the company=a empresa;the project=o projeto;the lead=a liderança|N:nórdico antigo taka + ofer",
  "try^on|experimentar|a jacket=uma jaqueta;the shoes=os sapatos;a dress=um vestido|F:francês trier + on",
  "cut^down*~cut,cut|cortar|a tree=uma árvore;the costs=os custos;on sugar=o açúcar|I:cut (incerto) + dūne",
  "drop^off*|deixar|the kids=as crianças;the package=o pacote;the car=o carro|G:ing. ant. dropian + of",
  "get^over~got,got|superar|a cold=um resfriado;the loss=a perda;the shock=o choque|N:nórdico antigo geta + ofer",
  "give^in~gave,given|ceder|to pressure=à pressão;easily=facilmente;at last=por fim|G:ing. ant. giefan + in",
  "go^out~went,gone|sair|tonight=hoje à noite;with friends=com amigos;often=com frequência|G:ing. ant. gān + ūt",
  "keep^up~kept,kept|acompanhar|the pace=o ritmo;the work=o trabalho;the payments=os pagamentos|G:ing. ant. cēpan + up",
  "pass^away|falecer|peacefully=em paz;at home=em casa;at ninety=aos noventa|F:francês passer + ing. āweg",
  "put^on*~put,put|colocar|a jacket=uma jaqueta;the glasses=os óculos;the music=a música|I:ing. ant. putian + on",
  "run^into*~ran,run|esbarrar|an old friend=em um velho amigo;a problem=em um problema;a stranger=em um estranho|G:ing. ant. rinnan + into",
  "clean^up|limpar|the mess=a bagunça;the room=a sala;the garden=o jardim|G:ing. ant. clǣne + up",
  "cheer^up|animar|a friend=um amigo;the team=a equipe;the children=as crianças|F:francês chiere + up",
  "mix^up|confundir|the names=os nomes;the dates=as datas;the orders=os pedidos|L:lat. mixtus + up",
  "speed^up~sped,sped|acelerar|the process=o processo;the work=o trabalho;the delivery=a entrega|G:ing. ant. spēd (sucesso) + up",
  "slow^down|desacelerar|the car=o carro;the pace=o ritmo;the process=o processo|G:ing. ant. slāw + dūne",
  "shut^down*~shut,shut|desligar|the system=o sistema;the factory=a fábrica;the server=o servidor|G:ing. ant. scyttan + dūne",
  "warm^up|aquecer|the engine=o motor;the food=a comida;the muscles=os músculos|G:ing. ant. wearm + up",
  "cool^down|esfriar|quickly=rápido;the engine=o motor;the water=a água|G:ing. ant. cōl + dūne",
  "hang^up~hung,hung|desligar|the phone=o telefone;the call=a ligação;quickly=rápido|G:ing. ant. hangian + up",
  "call^back|retornar|the customer=ao cliente;a friend=a um amigo;later=mais tarde|N:nórdico antigo kalla + bæc",
  "rely|contar com|on you=com você;on the team=com a equipe;on the system=com o sistema|F:francês relier, do lat. religare",
  "end^up|acabar|in jail=na prisão;as a leader=como líder;in Paris=em Paris|G:ing. ant. endian + up",
  "fall^apart~fell,fallen|desmoronar|quickly=rápido;completely=completamente;suddenly=de repente|G:ing. ant. feallan + apart (lat. a parte)",
  "carry^out|executar|a plan=um plano;the order=a ordem;an experiment=um experimento|F:francês carier + out",
  "bring^up~brought,brought|levantar|a topic=um assunto;the issue=a questão;a concern=uma preocupação|G:ing. ant. bringan + up",
  "come^across~came,come|encontrar por acaso|a book=um livro;an old photo=uma foto antiga;a problem=um problema|G:ing. ant. cuman + across",
  "look^into|investigar|the case=o caso;the problem=o problema;a complaint=uma reclamação|G:ing. ant. lōcian + into",
  "tear^down~tore,torn|demolir|a wall=um muro;the building=o prédio;the old house=a casa velha|G:ing. ant. teran + dūne"
 ],
 tech: [
  "hack|invadir|a system=um sistema;the server=o servidor;an account=uma conta|G:ing. ant. haccian (cortar)",
  "compile|compilar|the code=o código;a program=um programa;the project=o projeto|L:lat. compilare (juntar, saquear)",
  "deploy|implantar|the app=o aplicativo;the update=a atualização;to production=em produção|F:francês déployer (desdobrar), do lat. displicare",
  "log*|registrar|the event=o evento;the error=o erro;every action=cada ação|G:médio inglês logge (tronco de madeira)",
  "scroll|rolar|down=para baixo;the page=a página;up=para cima|F:francês antigo escroue (rolo)",
  "tap*|tocar|the icon=o ícone;the button=o botão;the screen=a tela|G:médio inglês tappen (imitativo)",
  "text|mandar mensagem|to a friend=a um amigo;every day=todo dia;quickly=rápido|L:lat. textus (tecido, texto)",
  "restore|restaurar|the data=os dados;the system=o sistema;the file=o arquivo|F:francês restorer, do lat. restaurare",
  "format*|formatar|the disk=o disco;the text=o texto;the document=o documento|L:lat. formatus (formado)",
  "reboot|reiniciar|the server=o servidor;the system=o sistema;the phone=o celular|G:re- + boot (de bootstrap, composto inglês)",
  "refresh|atualizar|the page=a página;the screen=a tela;the data=os dados|F:francês refreschir (re- + fresh)",
  "sync|sincronizar|the files=os arquivos;the data=os dados;the devices=os dispositivos|R:grego synchronos (ao mesmo tempo)",
  "store|armazenar|the data=os dados;the files=os arquivos;the password=a senha|F:francês estorer, do lat. instaurare",
  "crash|travar|suddenly=de repente;often=com frequência;the server=o servidor|I:imitativo (séc. XIV)",
  "load|carregar|the page=a página;the file=o arquivo;slowly=devagar|G:ing. ant. lād (caminho, carga)",
  "render|renderizar|the page=a página;an image=uma imagem;the video=o vídeo|F:francês rendre, do lat. reddere",
  "scrape|coletar|data=dados;a website=um site;the prices=os preços|N:nórdico antigo skrapa (raspar)",
  "forward|encaminhar|the email=o e-mail;the message=a mensagem;the file=o arquivo|G:ing. ant. foreweard (para a frente)",
  "subscribe|assinar|to a channel=a um canal;to the newsletter=à newsletter;online=online|L:lat. subscribere (escrever embaixo)",
  "unsubscribe|cancelar a assinatura|from the list=da lista;from the channel=do canal;from the newsletter=da newsletter|L:un- + lat. subscribere",
  "tag*|marcar|a friend=um amigo;the photo=a foto;the post=a publicação|N:provável nórdico (cf. sueco tagg)",
  "authenticate|autenticar|the user=o usuário;the request=a solicitação;the login=o login|R:grego authentikos (genuíno)",
  "configure|configurar|the system=o sistema;the router=o roteador;the settings=as configurações|L:lat. configurare (dar forma)",
  "optimize|otimizar|the code=o código;the process=o processo;performance=o desempenho|L:lat. optimus (o melhor)",
  "customize|personalizar|the app=o aplicativo;the report=o relatório;the layout=o layout|F:custom, do francês costume, do lat. consuetudo",
  "visualize|visualizar|the data=os dados;the result=o resultado;a scenario=um cenário|L:lat. visualis (da visão)",
  "classify|classificar|the data=os dados;the images=as imagens;the emails=os e-mails|L:lat. classis (classe)",
  "enable|habilitar|a feature=um recurso;the option=a opção;access=o acesso|F:en- + able (francês, do lat. habilis)",
  "remove|remover|the file=o arquivo;a stain=uma mancha;the cover=a capa|F:francês removeir, do lat. removere",
  "insert|inserir|a coin=uma moeda;the card=o cartão;a page=uma página|L:lat. inserere",
  "attach|anexar|a file=um arquivo;the document=o documento;a photo=uma foto|F:francês atachier (fixar)",
  "track|rastrear|the package=o pacote;the progress=o progresso;the data=os dados|F:francês trac (rastro)",
  "detect|detectar|an error=um erro;a leak=um vazamento;the signal=o sinal|L:lat. detegere (descobrir)"
 ],
 comida: [
  "roast|assar|a chicken=um frango;the vegetables=os legumes;the coffee=o café|F:francês antigo rostir (de origem germânica)",
  "steam|cozinhar|vegetables=legumes no vapor;fish=peixe no vapor;rice=arroz no vapor|G:ing. ant. stēam",
  "simmer|cozinhar|the sauce=o molho em fogo baixo;the soup=a sopa em fogo baixo;slowly=em fogo baixo|I:imitativo (séc. XV)",
  "whisk|bater|the eggs=os ovos;the cream=o creme;the sauce=o molho|N:nórdico antigo visk (escova de bater)",
  "knead|sovar|the dough=a massa;the bread=o pão;by hand=à mão|G:ing. ant. cnedan",
  "grate|ralar|cheese=queijo;a carrot=uma cenoura;the lemon peel=a casca do limão|F:francês grater, de origem germânica",
  "marinate|marinar|the meat=a carne;the chicken=o frango;overnight=durante a noite|L:lat. marinus (do mar), via italiano",
  "dice|cortar|the onion=a cebola em cubos;the potatoes=as batatas em cubos;the meat=a carne em cubos|F:francês antigo de (dado), do lat. datum",
  "mash|amassar|the potatoes=as batatas;the banana=a banana;the avocado=o abacate|G:ing. ant. māsc (mistura)",
  "toast|torrar|the bread=o pão;the nuts=as nozes;the seeds=as sementes|F:francês toster, do lat. tostare",
  "sprinkle|polvilhar|sugar=açúcar;the cheese=o queijo;salt=sal|H:provável holandês médio sprenkelen",
  "stuff|rechear|the turkey=o peru;the peppers=os pimentões;the pasta=a massa|F:francês antigo estoffer (de origem germânica)",
  "brew|preparar|coffee=café;tea=chá;beer=cerveja|G:ing. ant. brēowan",
  "sip*|tomar um gole|of coffee=de café;of tea=de chá;slowly=devagar|G:provável baixo-alemão sippen",
  "devour|devorar|the food=a comida;the book=o livro;the meal=a refeição|F:francês devorer, do lat. devorare",
  "nibble|mordiscar|a cookie=um biscoito;snacks=petiscos;the bread=o pão|H:provável baixo-alemão nibbelen",
  "snack|petiscar|on fruit=frutas;all day=o dia todo;on nuts=nozes|H:holandês médio snacken (morder)",
  "starve|passar fome|for days=por dias;in winter=no inverno;in the city=na cidade|G:ing. ant. steorfan (morrer)",
  "dine|jantar|out=fora;with friends=com amigos;at a restaurant=em um restaurante|F:francês antigo disner (quebrar o jejum)",
  "lick|lamber|the plate=o prato;the spoon=a colher;an ice cream=um sorvete|G:ing. ant. liccian",
  "thaw|descongelar|the meat=a carne;the chicken=o frango;the fish=o peixe|G:ing. ant. thawian",
  "ferment|fermentar|the dough=a massa;the wine=o vinho;the tea=o chá|L:lat. fermentare",
  "drain|escorrer|the pasta=a massa;the water=a água;the rice=o arroz|G:ing. ant. drēahnian (secar)",
  "garnish|decorar|the dish=o prato;the salad=a salada;the dessert=a sobremesa|F:francês garnir (de origem germânica)"
 ],
 casa: [
  "iron|passar|the shirts=as camisas;the clothes=a roupa;a dress=um vestido|G:ing. ant. īsern",
  "dust|tirar o pó|the shelves=das prateleiras;the furniture=dos móveis;the desk=da mesa|G:ing. ant. dūst",
  "vacuum|aspirar|the carpet=o tapete;the floor=o chão;the car=o carro|L:lat. vacuus (vazio)",
  "mop*|esfregar|the floor=o chão;the kitchen=a cozinha;the tiles=os azulejos|F:provável francês antigo mappe (toalha), do lat. mappa",
  "scrub*|esfregar|the pan=a panela;the floor=o chão;the stain=a mancha|H:holandês médio schrobben",
  "rinse|enxaguar|the dishes=a louça;the vegetables=os legumes;the glass=o copo|F:francês antigo rincier",
  "dry|secar|the clothes=a roupa;the dishes=a louça;the hair=o cabelo|G:ing. ant. drȳge",
  "empty|esvaziar|the bin=a lixeira;the glass=o copo;the room=a sala|G:ing. ant. ǣmettig (livre, desocupado)",
  "switch|trocar|channels=de canal;sides=de lado;seats=de lugar|H:provável baixo-alemão swutsen",
  "cover|cobrir|the table=a mesa;the food=a comida;the pot=a panela|F:francês covrir, do lat. cooperire",
  "furnish|mobiliar|the house=a casa;the room=o quarto;the office=o escritório|F:francês fornir (de origem germânica)",
  "knock|bater|on the door=à porta;twice=duas vezes;loudly=alto|G:ing. ant. cnocian",
  "ring~rang,rung|tocar|the bell=a campainha;loudly=alto;twice=duas vezes|G:ing. ant. hringan",
  "unlock|destrancar|the door=a porta;the phone=o celular;the car=o carro|G:un- + lock (ing. ant. loc)",
  "stack|empilhar|the boxes=as caixas;the plates=os pratos;the chairs=as cadeiras|N:nórdico antigo stakkr (pilha)",
  "leak|vazar|water=água;oil=óleo;information=informações|N:nórdico antigo leka (pingar)",
  "drip*|pingar|water=água;slowly=devagar;from the roof=do telhado|G:ing. ant. dryppan"
 ],
 fazer: [
  "invent|inventar|a machine=uma máquina;a story=uma história;a tool=uma ferramenta|L:lat. invenire (encontrar)",
  "craft|fabricar|by hand=à mão;a table=uma mesa;a tool=uma ferramenta|G:ing. ant. cræft (força, habilidade)",
  "carve+comida|esculpir|wood=madeira;a statue=uma estátua;a pumpkin=uma abóbora|G:ing. ant. ceorfan",
  "knit*|tricotar|a sweater=um suéter;a scarf=um cachecol;socks=meias|G:ing. ant. cnyttan (atar)",
  "weave~wove,woven|tecer|a basket=uma cesta;a carpet=um tapete;cloth=tecido|G:ing. ant. wefan",
  "glue|colar|the pieces=as peças;the paper=o papel;the label=a etiqueta|F:francês antigo glu, do lat. gluten",
  "nail|pregar|the board=a tábua;a sign=uma placa;the roof=o telhado|G:ing. ant. nægel",
  "drill|furar|a hole=um buraco;the wall=a parede;the wood=a madeira|H:holandês médio drillen",
  "saw~sawed,sawn|serrar|the wood=a madeira;a board=uma tábua;the branch=o galho|G:ing. ant. sagu",
  "hammer|martelar|the nail=o prego;the metal=o metal;the board=a tábua|G:ing. ant. hamor",
  "screw|parafusar|the lid=a tampa;the shelf=a prateleira;the plate=a placa|F:francês escroue (porca), do lat. scrofa",
  "polish|lustrar|the shoes=os sapatos;the floor=o chão;the silver=a prata|F:francês polir, do lat. polire",
  "manufacture|fabricar|cars=carros;parts=peças;goods=mercadorias|L:lat. manu (mão) + factura (feitura)",
  "forge|forjar|a sword=uma espada;a signature=uma assinatura;a bond=um vínculo|F:francês forger, do lat. fabricare",
  "mend|remendar|a shirt=uma camisa;the net=a rede;a fence=uma cerca|F:aférese de amend (lat. emendare)",
  "sharpen|afiar|the knife=a faca;the pencil=o lápis;the blade=a lâmina|G:ing. sharp (ing. ant. scearp)",
  "grind~ground,ground|triturar|coffee=café;the meat=a carne;the spices=as especiarias|G:ing. ant. grindan",
  "mold|moldar|plastic=plástico;the clay=o barro;the dough=a massa|F:francês antigo molde, do lat. modulus"
 ],
 estudo: [
  "revise|revisar|for the exam=para a prova;the notes=as anotações;the text=o texto|L:lat. revisere (olhar de novo)",
  "enroll|matricular|in a course=em um curso;in college=na faculdade;online=online|F:francês enroller (en- + rolle)",
  "lecture|lecionar|at the university=na universidade;on history=sobre história;to students=para alunos|L:lat. lectura (leitura)",
  "cheat|trapacear|on a test=em uma prova;at cards=nas cartas;on the exam=na prova|F:aférese de escheat (lat. excadere)",
  "underline|sublinhar|the key words=as palavras-chave;the text=o texto;the title=o título|G:composto inglês: under + line",
  "annotate|anotar|the text=o texto;the document=o documento;the book=o livro|L:lat. annotare",
  "cite|citar|a source=uma fonte;an example=um exemplo;the law=a lei|F:francês citer, do lat. citare",
  "paraphrase|parafrasear|a text=um texto;the author=o autor;the idea=a ideia|R:grego paraphrasis",
  "rehearse|ensaiar|the speech=o discurso;a song=uma música;the scene=a cena|F:francês antigo rehercier (arar de novo)",
  "conjugate|conjugar|a verb=um verbo;the tenses=os tempos;correctly=corretamente|L:lat. coniugare (unir sob o mesmo jugo)",
  "fail|reprovar|the exam=na prova;the test=no teste;the course=no curso|F:francês faillir, do lat. fallere (enganar)",
  "debate|debater|a topic=um tema;the law=a lei;openly=abertamente|F:francês debatre, do lat. battuere",
  "investigate|investigar|a crime=um crime;the cause=a causa;the case=o caso|L:lat. investigare (seguir o rastro)",
  "observe|observar|the sky=o céu;the behavior=o comportamento;carefully=com atenção|L:lat. observare",
  "experiment|experimentar|with new ideas=com novas ideias;on animals=em animais;with colors=com cores|L:lat. experimentum"
 ],
 corpo: [
  "yawn|bocejar|loudly=alto;in class=na aula;all day=o dia todo|G:ing. ant. geonian",
  "blink|piscar|twice=duas vezes;slowly=devagar;quickly=rápido|G:médio inglês blinken",
  "nod*|acenar com a cabeça|in agreement=em concordância;slowly=devagar;twice=duas vezes|I:médio inglês nodden (origem incerta)",
  "frown|franzir a testa|in confusion=em confusão;slightly=levemente;at the screen=para a tela|F:francês antigo froigner",
  "stare|olhar fixamente|at the wall=para a parede;at the screen=para a tela;in silence=em silêncio|G:ing. ant. starian",
  "glance|olhar de relance|at the clock=para o relógio;at the phone=para o celular;quickly=rapidamente|I:origem incerta (talvez francês glacier)",
  "gaze|contemplar|at the stars=as estrelas;at the sea=o mar;at the horizon=o horizonte|N:provável nórdico (cf. sueco gapa)",
  "peek|espiar|inside=dentro;through the window=pela janela;quickly=rapidamente|I:médio inglês piken (origem incerta)",
  "smell|cheirar|the flowers=as flores;the food=a comida;smoke=fumaça|G:médio inglês smellen",
  "sniff|farejar|the air=o ar;the flowers=as flores;the food=a comida|I:imitativo (séc. XIV)",
  "faint|desmaiar|suddenly=de repente;from the heat=de calor;at the sight=ao ver|F:francês antigo feint (fingido, mole)",
  "vomit|vomitar|after dinner=depois do jantar;twice=duas vezes;blood=sangue|L:lat. vomere",
  "swell~swelled,swollen|inchar|quickly=rápido;slightly=levemente;badly=muito|G:ing. ant. swellan",
  "scratch|coçar|the arm=o braço;the head=a cabeça;the itch=a coceira|I:origem incerta (fusão de scrat + cratch)",
  "rub*|esfregar|the eyes=os olhos;the table=a mesa;gently=com delicadeza|I:médio inglês rubben (origem incerta)",
  "pinch|beliscar|the arm=o braço;the cheek=a bochecha;gently=de leve|F:francês antigo pincier",
  "limp|mancar|badly=muito;slightly=levemente;after the accident=após o acidente|G:provável nórdico antigo (cf. limpa, enfraquecer)",
  "hum*|cantarolar|a song=uma música;softly=baixinho;a melody=uma melodia|I:imitativo (médio inglês hummen)",
  "whistle|assobiar|a tune=uma melodia;loudly=alto;to the dog=para o cachorro|G:ing. ant. hwistlian",
  "snore|roncar|loudly=alto;all night=a noite toda;a lot=muito|I:imitativo",
  "nap*|cochilar|after lunch=depois do almoço;on the sofa=no sofá;for an hour=por uma hora|G:ing. ant. hnappian",
  "suffer|sofrer|from pain=de dor;a loss=uma perda;in silence=em silêncio|F:francês soffrir, do lat. sufferre",
  "cure|curar|a disease=uma doença;the patient=o paciente;the infection=a infecção|F:francês curer, do lat. curare (cuidar)",
  "inject|injetar|the medicine=o remédio;a vaccine=uma vacina;the patient=o paciente|L:lat. iniicere (lançar dentro)",
  "vaccinate|vacinar|the children=as crianças;the dog=o cachorro;the patients=os pacientes|L:lat. vacca (vaca)",
  "prescribe|prescrever|a medicine=um remédio;a treatment=um tratamento;antibiotics=antibióticos|L:lat. praescribere"
 ],
 natureza: [
  "blow~blew,blown|soprar|hard=forte;on the soup=na sopa;the whistle=o apito|G:ing. ant. blāwan",
  "flood|inundar|the street=a rua;the city=a cidade;the market=o mercado|G:ing. ant. flōd",
  "flow|fluir|smoothly=suavemente;to the sea=para o mar;freely=livremente|G:ing. ant. flōwan",
  "splash|respingar|water=água;the floor=o chão;loudly=alto|I:imitativo (séc. XVIII)",
  "spray|borrifar|water=água;the plants=as plantas;the room=o quarto|H:holandês médio sprayen",
  "wither|murchar|slowly=devagar;in the heat=no calor;quickly=rápido|G:variante de weather (ing. ant. weder)",
  "sprout|brotar|quickly=rápido;in spring=na primavera;from the ground=do chão|G:ing. ant. sprūtan",
  "hunt|caçar|deer=veados;in the forest=na floresta;at night=à noite|G:ing. ant. huntian",
  "graze|pastar|in the field=no campo;all day=o dia todo;on grass=na grama|G:ing. ant. grasian (de grass)",
  "hatch|chocar|the eggs=os ovos;soon=em breve;in spring=na primavera|G:médio inglês hacchen",
  "float|flutuar|on the water=na água;in the air=no ar;easily=com facilidade|G:ing. ant. flotian",
  "erode|erodir|the soil=o solo;the coast=a costa;the rock=a rocha|L:lat. erodere (roer)",
  "evaporate|evaporar|quickly=rápido;in the sun=ao sol;completely=completamente|L:lat. evaporare",
  "ripen|amadurecer|quickly=rápido;in the sun=ao sol;slowly=devagar|G:ing. ripe (ing. ant. rīpe)",
  "sparkle|cintilar|brightly=muito;in the sun=ao sol;like diamonds=como diamantes|G:diminutivo de spark (ing. ant. spearca)",
  "decay|apodrecer|slowly=devagar;in the soil=no solo;quickly=rápido|F:francês antigo decair, do lat. decadere",
  "soar|planar|high=alto;over the city=sobre a cidade;gracefully=com graça|F:francês essorer, do lat. ex aura (para o ar)"
 ],
 arte: [
  "sculpt|esculpir|a statue=uma estátua;marble=mármore;clay=barro|L:lat. sculpere",
  "sketch|esboçar|a plan=um plano;a portrait=um retrato;quickly=rapidamente|H:holandês schets, do italiano schizzo",
  "illustrate|ilustrar|a book=um livro;the idea=a ideia;the point=o ponto|L:lat. illustrare (iluminar)",
  "direct|dirigir|a movie=um filme;a play=uma peça;the traffic=o trânsito|L:lat. dirigere",
  "strum*|dedilhar|the guitar=o violão;a chord=um acorde;softly=suavemente|I:imitativo (séc. XVIII)",
  "tune|afinar|the guitar=o violão;the piano=o piano;the radio=o rádio|F:variante de tone (francês ton, do gr. tonos)",
  "conduct|reger|the orchestra=a orquestra;the choir=o coral;a symphony=uma sinfonia|L:lat. conducere (conduzir)",
  "improvise|improvisar|a solo=um solo;a speech=um discurso;on stage=no palco|L:lat. improvisus (imprevisto)",
  "frame|emoldurar|a photo=uma foto;a picture=um quadro;the painting=a pintura|G:ing. ant. framian (ser útil)",
  "exhibit|exibir|a painting=um quadro;the work=a obra;in a gallery=em uma galeria|L:lat. exhibere",
  "rhyme|rimar|with love=com amor;easily=com facilidade;in verse=em verso|R:grego rhythmos (ritmo), via francês",
  "recite|recitar|a poem=um poema;the lines=as falas;by heart=de cor|L:lat. recitare",
  "dub*|dublar|a movie=um filme;the voice=a voz;a series=uma série|G:ing. ant. dubbian (armar cavaleiro)",
  "animate|animar|a character=um personagem;a movie=um filme;the scene=a cena|L:lat. animare (dar vida)"
 ],
 lei: [
  "sentence|sentenciar|the defendant=o réu;the criminal=o criminoso;to prison=à prisão|L:lat. sententia (opinião, decisão)",
  "convict|condenar|the defendant=o réu;the suspect=o suspeito;the criminal=o criminoso|L:lat. convincere",
  "acquit*|absolver|the defendant=o réu;the suspect=o suspeito;the accused=o acusado|F:francês aquiter, do lat. quietus",
  "prosecute|processar|the company=a empresa;the suspect=o suspeito;a crime=um crime|L:lat. prosequi (perseguir)",
  "enforce|aplicar|the law=a lei;the rule=a regra;a ban=uma proibição|F:francês enforcer (forçar)",
  "regulate|regular|the market=o mercado;prices=os preços;the industry=a indústria|L:lat. regulare (de regula, régua)",
  "legislate|legislar|on taxes=sobre impostos;against fraud=contra a fraude;at the national level=no nível nacional|L:lat. lex (lei) + latio (proposta)",
  "authorize|autorizar|the payment=o pagamento;the transfer=a transferência;the use=o uso|F:francês autoriser, do lat. auctor",
  "license|licenciar|the software=o software;a product=um produto;a driver=um motorista|L:lat. licentia (permissão)",
  "prohibit|proibir|smoking=fumar;entry=a entrada;the use=o uso|L:lat. prohibere",
  "violate|violar|the law=a lei;the rules=as regras;a contract=um contrato|L:lat. violare",
  "oblige|obrigar|the company=a empresa;the citizens=os cidadãos;the parties=as partes|F:francês obliger, do lat. obligare",
  "appeal|recorrer|to the court=ao tribunal;against the decision=da decisão;to the public=ao público|F:francês apeler, do lat. appellare",
  "ratify|ratificar|the treaty=o tratado;the law=a lei;the agreement=o acordo|L:lat. medieval ratificare",
  "repeal|revogar|the law=a lei;the rule=a regra;the ban=a proibição|F:francês antigo rapeler (chamar de volta)",
  "enact|promulgar|a law=uma lei;the rule=a regra;a reform=uma reforma|F:en- + act (lat. actus)",
  "inherit|herdar|a house=uma casa;a fortune=uma fortuna;the business=o negócio|F:francês enheriter, do lat. hereditare",
  "release|soltar|the prisoner=o preso;the suspect=o suspeito;the hostage=o refém|F:francês relaissier, do lat. relaxare",
  "confiscate|confiscar|the goods=as mercadorias;the car=o carro;the weapon=a arma|L:lat. confiscare (guardar no tesouro)",
  "threaten|ameaçar|the company=a empresa;a colleague=um colega;the peace=a paz|G:ing. ant. thrēatian",
  "attack|atacar|the enemy=o inimigo;the problem=o problema;from behind=por trás|O:italiano attaccare (unir, atacar)",
  "destroy|destruir|the evidence=a evidência;the city=a cidade;the plan=o plano|L:lat. destruere",
  "damage|danificar|the car=o carro;the roof=o telhado;the file=o arquivo|F:francês damage, do lat. damnum",
  "kill|matar|time=o tempo;the engine=o motor;a bug=um bug|I:origem incerta (médio inglês cullen)",
  "rescue|resgatar|a child=uma criança;the dog=o cachorro;the hostages=os reféns|F:francês rescourre",
  "explode|explodir|suddenly=de repente;loudly=alto;in the air=no ar|L:lat. explodere (expulsar batendo palmas)"
 ],
 muda: [
  "worsen|piorar|quickly=rápido;slowly=devagar;suddenly=de repente|G:ing. worse (ing. ant. wyrsa)",
  "evolve|evoluir|quickly=rápido;over time=com o tempo;naturally=naturalmente|L:lat. evolvere (desenrolar)",
  "transform|transformar|the city=a cidade;the process=o processo;the company=a empresa|L:lat. transformare",
  "vary|variar|widely=muito;by region=por região;slightly=levemente|F:francês varier, do lat. variare",
  "fade|desbotar|quickly=rápido;slowly=devagar;in the sun=ao sol|F:francês fader, do lat. vapidus (insípido)",
  "vanish|sumir|suddenly=de repente;without a trace=sem deixar rastros;quickly=rápido|F:francês esvanir, do lat. evanescere",
  "shift|deslocar|the focus=o foco;the weight=o peso;the schedule=o horário|G:ing. ant. sciftan (dividir, mudar)",
  "shrink~shrank,shrunk|encolher|quickly=rápido;in the wash=na lavagem;slowly=devagar|G:ing. ant. scrincan",
  "widen|alargar|the road=a estrada;the gap=a lacuna;the scope=o escopo|G:ing. wide (ing. ant. wīd)",
  "strengthen|fortalecer|the team=a equipe;the bond=o vínculo;the economy=a economia|G:ing. strength (ing. ant. strengthu)",
  "weaken|enfraquecer|the team=a equipe;the economy=a economia;the signal=o sinal|N:nórdico antigo veikr (fraco)",
  "soften|amolecer|the butter=a manteiga;the tone=o tom;the blow=o impacto|G:ing. soft (ing. ant. sōfte)",
  "boost|impulsionar|sales=as vendas;the economy=a economia;the morale=o moral|I:origem incerta (americanismo do séc. XIX)",
  "accelerate|acelerar|the process=o processo;the growth=o crescimento;suddenly=de repente|L:lat. accelerare",
  "stabilize|estabilizar|the economy=a economia;the prices=os preços;the patient=o paciente|L:lat. stabilis (firme)",
  "renew|renovar|the contract=o contrato;the license=a licença;the lease=o aluguel|L:re- + lat. novus (novo)",
  "reform|reformar|the system=o sistema;the law=a lei;the company=a empresa|L:lat. reformare",
  "mature|amadurecer|quickly=rápido;with age=com a idade;slowly=devagar|L:lat. maturus (maduro)",
  "affect|afetar|the result=o resultado;the economy=a economia;everyone=todos|L:lat. afficere (agir sobre)",
  "cause|causar|a problem=um problema;damage=danos;a delay=um atraso|L:lat. causa"
 ],
 troca: [
  "swap*|trocar|places=de lugar;ideas=ideias;gifts=presentes|I:médio inglês swappen (golpear, bater a mão em acordo)",
  "transfer*|transferir|money=dinheiro;the files=os arquivos;the call=a ligação|L:lat. transferre (carregar através)",
  "hand|entregar|the keys=as chaves;the papers=os documentos;the report=o relatório|G:ing. ant. hand",
  "distribute|distribuir|the food=a comida;the tasks=as tarefas;the flyers=os folhetos|L:lat. distribuere",
  "substitute|substituir|the player=o jogador;the ingredient=o ingrediente;a worker=um funcionário|L:lat. substituere (pôr no lugar)",
  "mail|postar|a letter=uma carta;a package=um pacote;the invoice=a fatura|F:francês antigo male (bolsa), de origem germânica",
  "ship*|despachar|the goods=as mercadorias;the order=o pedido;the package=o pacote|G:ing. ant. scip (navio)",
  "belong|pertencer|to the club=ao clube;to the team=à equipe;here=aqui|G:médio inglês belongen (be- + longen)"
 ],
};
/* v84 — verbos formais (latino/francês) que faltavam para o contraste de registro cotidiano × formal.
   Mesma sintaxe do bloco anterior; ver REG_PARES para os pares. */
const VERBOS_NOVOS_C = {
 fala: [
  "inquire|indagar|about the price=sobre o preço;about the schedule=sobre o horário;about a vacancy=sobre uma vaga|L:lat. inquirere (perguntar, investigar), via francês enquerre",
  "conceal|ocultar|the truth=a verdade;the evidence=as provas;the facts=os fatos|F:francês conceler, do lat. concelare (esconder)",
  "state|afirmar|your name=seu nome;the facts=os fatos;the reason=o motivo|L:lat. status (estar de pé), via o substantivo state",
  "indicate|indicar|the direction=a direção;the error=o erro;a preference=uma preferência|L:lat. indicare (apontar)",
  "ask^for|pedir|help=ajuda;a refund=um reembolso;advice=conselhos"
 ],
 trab: [
  "terminate|encerrar|the contract=o contrato;the agreement=o acordo;the service=o serviço|L:lat. terminare (delimitar)",
  "attempt|tentar|a new approach=uma nova abordagem;a repair=um conserto;the climb=a escalada|F:francês attempter, do lat. attemptare (tentar)",
  "utilize+tech|utilizar|the software=o software;the resources=os recursos;new methods=novos métodos|F:francês utiliser, do italiano utilizzare (lat. utilis)",
  "dispatch|despachar|the package=o pacote;the order=o pedido;a team=uma equipe|O:italiano dispacciare / espanhol despachar",
  "postpone|adiar|the meeting=a reunião;the trip=a viagem;the decision=a decisão|L:lat. postponere (pôr depois)",
  "establish|estabelecer|a company=uma empresa;the rules=as regras;a connection=uma conexão|F:francês establir, do lat. stabilire",
  "take^part~took,taken|participar|in the meeting=da reunião;in the discussion=da discussão;in the race=da corrida"
 ],
 troca: [
  "obtain|obter|a permit=uma licença;the information=a informação;a visa=um visto|F:francês obtenir, do lat. obtinere (conseguir)",
  "retain+trab|reter|the receipts=os recibos;the staff=os funcionários;the documents=os documentos|F:francês retenir, do lat. retinere (segurar)"
 ],
 compra: [
  "purchase|adquirir|a new laptop=um notebook novo;a license=uma licença;new equipment=novos equipamentos|F:francês purchacier (perseguir), de pur- + chacier",
  "reimburse|reembolsar|the customer=o cliente;the expenses=as despesas;the costs=os custos|L:re- + im- + lat. bursa (bolsa), via francês"
 ],
 juiz: [
  "select|selecionar|a candidate=um candidato;the best option=a melhor opção;a date=uma data|L:lat. seligere (escolher)",
  "turn^down|recusar|the offer=a oferta;the invitation=o convite;a job=um emprego"
 ],
 muda: [
  "commence|iniciar|the meeting=a reunião;the trial=o julgamento;the course=o curso|F:francês commencer, do lat. cominitiare",
  "modify|modificar|the plan=o plano;the settings=as configurações;the design=o projeto|F:francês modifier, do lat. modificare",
  "abandon|abandonar|the plan=o plano;the project=o projeto;the idea=a ideia|F:francês abandoner (a + bandon, poder), de raiz germânica",
  "cease|cessar|production=a produção;operations=as operações;payments=os pagamentos|F:francês cesser, do lat. cessare",
  "proceed|prosseguir|with the plan=com o plano;with caution=com cautela;to the next step=para a próxima etapa|F:francês proceder, do lat. procedere (avançar)"
 ],
 fazer: [
  "construct|construir|a bridge=uma ponte;a model=um modelo;a sentence=uma frase|L:lat. construere (empilhar)"
 ],
 estudo: [
  "instruct|instruir|the staff=os funcionários;the students=os alunos;the team=a equipe|L:lat. instruere (preparar, ensinar)"
 ],
 move: [
  "encounter|encontrar|a problem=um problema;resistance=resistência;difficulties=dificuldades|F:francês encontrer, do lat. in + contra"
 ],
 corpo: [
  "look^at|olhar para|the map=o mapa;the report=o relatório;the data=os dados"
 ]
};
const ETIM_BASE_TXT = "work|G|ing. ant. weorc\ngo|G|ing. ant. gān\neat|G|ing. ant. etan\nwrite|G|ing. ant. wrītan (riscar, entalhar)\nsee|G|ing. ant. sēon\ntake|N|nórdico antigo taka\ncome|G|ing. ant. cuman\nrun|G|ing. ant. rinnan / irnan\nbuy|G|ing. ant. bycgan\nthink|G|ing. ant. þencan\nput|I|ing. ant. putian (origem incerta)\nspeak|G|ing. ant. sprecan\nsay|G|ing. ant. secgan\nget|N|nórdico antigo geta\nmake|G|ing. ant. macian\nknow|G|ing. ant. cnāwan\ngive|G|ing. ant. giefan (o g duro vem do nórdico)\nfind|G|ing. ant. findan\ntell|G|ing. ant. tellan\nbecome|G|ing. ant. becuman\nleave|G|ing. ant. lǣfan (deixar)\nfeel|G|ing. ant. fēlan\nbring|G|ing. ant. bringan\nbegin|G|ing. ant. beginnan\nkeep|G|ing. ant. cēpan\nhold|G|ing. ant. healdan\nmeet|G|ing. ant. mētan\nwin|G|ing. ant. winnan (lutar)\nteach|G|ing. ant. tǣcan (mostrar)\nsell|G|ing. ant. sellan (entregar)\nsend|G|ing. ant. sendan\nbreak|G|ing. ant. brecan\ndrive|G|ing. ant. drīfan\nchoose|G|ing. ant. cēosan\nwear|G|ing. ant. werian\nfall|G|ing. ant. feallan\nforget|G|ing. ant. forgietan\ngrow|G|ing. ant. grōwan\ncatch|F|francês (picardo) cachier, do lat. captare\nsleep|G|ing. ant. slǣpan\narise|G|ing. ant. ārīsan\nimagine|F|francês imaginer, do lat. imaginari\njoin|F|francês joindre, do lat. iungere\nneed|G|ing. ant. nēodian\novercome|G|ing. ant. ofercuman\nquit|F|francês quiter, do lat. quietus\nunderstand|G|ing. ant. understandan\nvisit|F|francês visiter, do lat. visitare\nx-ray|O|alemão X-Strahlen (Röntgen, 1895)\nyell|G|ing. ant. gellan\nzoom|I|imitativo (zumbido)\nagree|F|francês agreer, do lat. gratum\ncall|N|nórdico antigo kalla\ncarry|F|anglo-normando carier, do lat. carrus (carro)\ncheck|O|do persa shāh (rei), via árabe e francês: xeque\nclean|G|ing. ant. clǣne\nclose|F|francês clos, do lat. clausus\ncount|F|francês conter, do lat. computare\ncross|L|lat. crux (cruz), via irlandês e nórdico\ncut|I|origem incerta (médio inglês cutten)\ndeal|G|ing. ant. dǣlan (dividir)\ndecide|F|francês decider, do lat. decidere\ndo|G|ing. ant. dōn\ndraw|G|ing. ant. dragan (puxar)\ndream|G|ing. ant. drēam (alegria)\ndrink|G|ing. ant. drincan\ndrop|G|ing. ant. dropian\nface|F|francês face, do lat. facies\nfight|G|ing. ant. feohtan\nfigure|F|francês figure, do lat. figura\nfill|G|ing. ant. fyllan\nfollow|G|ing. ant. folgian\nhave|G|ing. ant. habban\nlay|G|ing. ant. lecgan\nlet|G|ing. ant. lǣtan\nlike|G|ing. ant. līcian (agradar)\nlive|G|ing. ant. libban\nlook|G|ing. ant. lōcian\nlose|G|ing. ant. losian (perder-se)\npass|F|francês passer, do lat. passus\npay|F|francês payer, do lat. pacare (pacificar)\npick|I|origem incerta (talvez germânica/nórdica)\nplay|G|ing. ant. plegian\npull|G|ing. ant. pullian\npush|F|francês pousser, do lat. pulsare\nraise|N|nórdico antigo reisa\nread|G|ing. ant. rǣdan (aconselhar)\nreturn|F|francês retourner (re- + tourner)\nride|G|ing. ant. rīdan\nsave|F|francês sauver, do lat. salvare\nset|G|ing. ant. settan\nshow|G|ing. ant. scēawian (olhar)\nstand|G|ing. ant. standan\nstay|F|francês antigo estaier, do lat. stare\nstep|G|ing. ant. stæpe\nstop|L|ing. ant. stoppian, do lat. stuppare (tapar com estopa)\ntalk|G|médio inglês talken (de origem germânica)\nthrow|G|ing. ant. thrāwan (torcer)\nturn|L|lat. tornare, via ing. ant. e francês\nwait|F|anglo-normando waitier (de origem germânica)\nwalk|G|ing. ant. wealcan (rolar)\nwash|G|ing. ant. wascan\nlearn|G|ing. ant. leornian\nremember|F|francês remembrer, do lat. rememorari\nbelieve|G|ing. ant. belīefan\nrealize|F|francês réaliser, do lat. realis\nnotice|F|francês notice, do lat. notitia\nguess|I|médio inglês gessen (provável origem holandesa/nórdica)\npresume|F|francês presumer, do lat. praesumere\ndoubt|F|francês douter, do lat. dubitare\nrecognize|F|francês reconoistre, do lat. recognoscere\nconsider|F|francês considérer, do lat. considerare\nfocus|L|lat. focus (lareira)\nmemorize|F|francês memorie, do lat. memoria\nanalyze|R|grego analysis (soltar, desfazer)\nsolve|L|lat. solvere (soltar)\nmean|G|ing. ant. mǣnan\nexpect|L|lat. exspectare\npredict|L|lat. praedicere\ncompare|F|francês comparer, do lat. comparare\njudge|F|francês juger, do lat. iudicare\nblame|F|francês blâmer, do lat. blasphemare (do gr.)\npraise|F|francês preisier, do lat. pretiare (dar valor)\ncriticize|R|grego kritikos (que julga)\napprove|F|francês aprover, do lat. approbare\nreject|L|lat. reicere\naccuse|F|francês acuser, do lat. accusare\nadmire|F|francês admirer, do lat. admirari\nrespect|L|lat. respectus\ndeserve|F|francês deservir, do lat. deservire\nevaluate|F|francês évaluer, do lat. valere\nrecommend|L|lat. medieval recommendare\nsupport|F|francês supporter, do lat. supportare\ndefend|F|francês defendre, do lat. defendere\ntrust|N|nórdico antigo traust (confiança)\nforgive|G|ing. ant. forgiefan\nsuspect|L|lat. suspectare / suspicere\nprefer|F|francês preferer, do lat. praeferre\ndisagree|F|francês desagréer (dis- + agréer)\nask|G|ing. ant. āscian\nanswer|G|ing. ant. andswarian\nexplain|L|lat. explanare (aplanar)\ndiscuss|L|lat. discutere (agitar, dispersar)\nmention|F|francês mention, do lat. mentio\nannounce|F|francês annoncer, do lat. annuntiare\nargue|F|francês arguer, do lat. arguere\nsuggest|L|lat. suggerere\nreport|F|francês reporter, do lat. reportare\nwhisper|G|ing. ant. hwisprian\nshout|I|médio inglês shouten (talvez nórdico)\npromise|L|lat. promittere\nwarn|G|ing. ant. warnian\ncomplain|F|francês complaindre, do lat. complangere\ndescribe|L|lat. describere\nexpress|F|francês expresser, do lat. exprimere\ngreet|G|ing. ant. grētan\nthank|G|ing. ant. thancian\ninterrupt|L|lat. interrumpere\ninterview|F|francês entrevue (entrevoir)\ncommunicate|L|lat. communicare\nshare|G|ing. ant. scearu (parte, corte)\nlove|G|ing. ant. lufian\nhate|G|ing. ant. hatian\nenjoy|F|francês enjoir, do lat. gaudere\nwant|N|nórdico antigo vanta (faltar)\nfear|G|ing. ant. fǣr (perigo súbito)\nmiss|G|ing. ant. missan\ncare|G|ing. ant. cearu (preocupação)\nhug|I|origem incerta (provável nórdica)\nkiss|G|ing. ant. cyssan\nmarry|F|francês marier, do lat. maritare\ncomfort|F|francês conforter, do lat. confortare\nlaugh|G|ing. ant. hliehhan\ncry|F|francês crier, do lat. quiritare\nsmile|N|provável nórdico (cf. sueco smila)\nhope|G|ing. ant. hopian\nwelcome|G|ing. ant. wilcuma (bem-vindo)\ninspire|F|francês inspirer, do lat. inspirare\nsurprise|F|francês surprendre\narrive|F|francês arriver, do lat. ad ripam (à margem)\ntravel|F|francês travailler (trabalhar duro), do lat. tripalium\nenter|F|francês entrer, do lat. intrare\nclimb|G|ing. ant. climban\njump|I|origem incerta (séc. XVI)\nfly|G|ing. ant. flēogan\nswim|G|ing. ant. swimman\nmove|F|francês movoir, do lat. movere\ndepart|F|francês departir, do lat. partire\nescape|F|francês eschaper, do lat. ex cappa (sair da capa)\npark|F|francês parc, de origem germânica\nboard|G|ing. ant. bord (tábua; lado do navio)\nland|G|ing. ant. land\nreach|G|ing. ant. rǣcan\nchase|F|francês chacier, do lat. captiare (caçar)\nexplore|L|lat. explorare\nguide|F|francês guider\nkick|I|médio inglês kiken (origem incerta)\nscore|N|nórdico antigo skor (entalhe)\ntrain|F|francês trahiner, do lat. trahere (puxar)\ncompete|L|lat. competere\nlift|N|nórdico antigo lypta\nstretch|G|ing. ant. streccan\nshoot|G|ing. ant. scēotan\nhit|N|nórdico antigo hitta (encontrar)\ndribble|I|origem incerta (frequentativo de drib)\nbeat|G|ing. ant. bēatan\ncheer|F|francês chiere (rosto, ânimo)\nsurf|I|origem incerta (séc. XVII)\ndive|G|ing. ant. dȳfan / dūfan\nreferee|L|refer (lat. referre) + -ee\nadd|L|lat. addere\nsubtract|L|lat. subtrahere\nmultiply|F|francês multiplier, do lat. multiplicare\ndivide|L|lat. dividere\ncalculate|L|lat. calculare (de calculus, pedrinha)\nmeasure|F|francês mesurer, do lat. mensurare\nestimate|L|lat. aestimare\nround|F|francês rond, do lat. rotundus\nweigh|G|ing. ant. wegan\ntotal|L|lat. medieval totalis\ndemonstrate|L|lat. demonstrare\nplot|G|ing. ant. plot (pedaço de terra)\nrank|F|francês antigo renc (fileira)\nconvert|F|francês convertir, do lat. convertere\nspend|L|ing. ant. spendan, do lat. dispendere\ncost|F|francês coster, do lat. constare\norder|F|francês ordre, do lat. ordo\ncharge|F|francês charger, do lat. carricare (carregar)\nowe|G|ing. ant. āgan (possuir)\nlend|G|ing. ant. lǣnan\nearn|G|ing. ant. earnian (merecer)\ninvest|L|lat. investire (vestir)\nbargain|F|francês bargaigner\nrefund|L|lat. refundere (derramar de volta)\ndeliver|F|francês délivrer, do lat. liberare\nrent|F|francês rente, do lat. rendita\ndonate|L|lat. donare\nwithdraw|G|with- (de volta) + draw (ing. ant. dragan)\ndeposit|L|lat. depositum\nwaste|L|lat. vastus (vazio), via anglo-normando\nmanage|O|italiano maneggiare (manejar cavalos), de mano\nhire|G|ing. ant. hȳr (aluguel)\nfire|G|ing. ant. fȳr\nlead|G|ing. ant. lǣdan\nnegotiate|L|lat. negotiari (nec + otium)\nschedule|F|francês antigo cedule, do lat. schedula\nplan|F|francês plan, do lat. planus\norganize|F|francês organiser, do gr. organon (instrumento)\napply|F|francês aplier, do lat. applicare\nresign|F|francês resigner, do lat. resignare\npromote|L|lat. promovere\nattend|F|francês atendre, do lat. attendere\npresent|F|francês presenter, do lat. praesentare\nproduce|L|lat. producere\ndelegate|L|lat. delegare\nlaunch|F|anglo-normando lancher, do lat. lanceare\nsupervise|L|lat. supervidere\ncollaborate|L|lat. collaborare\ncomplete|L|lat. completus\nfinish|F|francês finir, do lat. finire\nstart|G|ing. ant. styrtan (saltar)\nimprove|F|anglo-francês emprouwer (lucrar)\ndevelop|F|francês desveloper\nachieve|F|francês achever (a chef, chegar ao fim)\noperate|L|lat. operari\ncancel|F|francês canceler, do lat. cancellare (riscar em grade)\nsubmit|L|lat. submittere\nreview|F|francês reveue (revista)\nprepare|L|lat. praeparare\nrecruit|F|francês recroître (crescer de novo)\nclick|I|imitativo (séc. XVII)\ntype|R|grego typos (golpe, marca)\ndownload|G|composto inglês: down + load\nupload|G|composto inglês: up + load\ninstall|F|francês installer, do lat. medieval installare\ndelete|L|lat. delere (apagar)\nsearch|F|francês cerchier, do lat. circare (percorrer em círculo)\nprint|F|francês preinte, do lat. premere (pressionar)\nscan|L|lat. scandere (subir; escandir versos)\ncode|F|francês code, do lat. codex\ntest|F|francês test (vaso de ensaio), do lat. testum\nupdate|G|composto inglês: up + date\nconnect|L|lat. connectere\nbrowse|F|francês antigo broster (brotar, roer)\nrecord|F|francês recorder, do lat. recordari (lembrar)\ncopy|F|francês copier, do lat. copia (abundância)\npaste|F|francês paste (massa), do gr. pastē\nstream|G|ing. ant. strēam\nencrypt|R|grego kryptos (oculto)\nfilter|F|francês filtrer, do lat. medieval filtrum (feltro)\nsort|F|francês sorte, do lat. sors (sorte, categoria)\ndebug|I|de- + bug (inseto, origem incerta)\nautomate|R|grego automatos (que age por si)\nprocess|F|francês proces, do lat. processus\nopen|G|ing. ant. openian\npost|F|francês poste, do lat. positus\nmonitor|L|lat. monitor (conselheiro)\npress|F|francês presser, do lat. pressare\ncook|L|ing. ant. cōc, do lat. coquus\nbake|G|ing. ant. bacan\nboil|F|francês boillir, do lat. bullire\nfry|F|francês frire, do lat. frigere\nchop|I|origem incerta (variante de chap)\nslice|F|francês esclice (lasca)\npeel|L|ing. ant. pilian, do lat. pilare\npour|I|médio inglês pouren (origem incerta)\nmix|L|lat. mixtus\nstir|G|ing. ant. styrian\ntaste|F|francês antigo taster (tocar, provar)\nserve|F|francês servir, do lat. servire\ngrill|F|francês gril, do lat. craticula (grelha)\nseason|F|francês assaisonner, do lat. satio (plantio)\nfeed|G|ing. ant. fēdan\nchew|G|ing. ant. cēowan\nswallow|G|ing. ant. swelgan\nbite|G|ing. ant. bītan\nmelt|G|ing. ant. meltan\nsqueeze|G|ing. ant. cwysan\nspread|G|médio inglês spreden (de origem germânica)\nwake|G|ing. ant. wacian\ndress|F|francês dresser, do lat. directus\nbrush|F|francês brosse (feixe, vassoura)\nbathe|G|ing. ant. bathian\nfix|L|lat. fixus\nrepair|F|francês reparer, do lat. reparare\nlock|G|ing. ant. loc\nsweep|G|ing. ant. swāpan\ntidy|G|de tide (ing. ant. tīd, tempo oportuno)\nrest|G|ing. ant. rest\nfold|G|ing. ant. fealdan\nhang|G|ing. ant. hangian (com influência nórdica)\ndecorate|L|lat. decorare\nwater|G|ing. ant. wæter\nlight|G|ing. ant. līhtan (iluminar)\npack|H|holandês médio pakken\nwipe|G|ing. ant. wīpian\nbuild|G|médio inglês bilden (de ing. ant. bold, casa)\ncreate|L|lat. creare\ndesign|F|francês designer, do lat. designare\npaint|F|francês peindre, do lat. pingere\nassemble|F|francês assembler, do lat. assimulare\nsew|G|ing. ant. sīwian\nshape|G|ing. ant. scieppan\ntie|G|ing. ant. tīgan\nstick|G|ing. ant. stician\ndig|I|origem incerta (médio inglês diggen)\ntear|G|ing. ant. teran\nbend|G|ing. ant. bendan\nshake|G|ing. ant. sceacan\nuse|F|francês user, do lat. usare\ntry|F|francês trier (selecionar, testar)\nhelp|G|ing. ant. helpan\nstudy|F|francês estudier, do lat. studium\npractice|R|grego praktikos (prático), via latim e francês\ntranslate|L|lat. translatus (levado através)\npronounce|F|francês prononcer, do lat. pronuntiare\nspell|F|francês espeller, de origem germânica\nquote|F|francês antigo coter (numerar), do lat. quotare\nresearch|F|francês recerche\nexamine|F|francês examiner, do lat. examinare\nsummarize|L|lat. summa (soma)\nhighlight|G|composto inglês: high + light\nedit|L|lat. edere (publicar)\ndraft|G|variante de draught (ing. ant. dragan)\ncorrect|L|lat. corrigere\npublish|F|francês publier, do lat. publicare\nbreathe|G|ing. ant. brǣth (vapor)\ncough|I|imitativo\nhurt|F|francês antigo hurter (golpear)\nbleed|G|ing. ant. blēdan\nheal|G|ing. ant. hǣlan\nsweat|G|ing. ant. swǣtan\nsneeze|G|ing. ant. fnēosan\ntouch|F|francês touchier\nhear|G|ing. ant. hīeran\nlisten|G|ing. ant. hlysnan\nwatch|G|ing. ant. wæccan (estar acordado)\ntreat|F|francês traiter, do lat. tractare\nrecover|F|francês recovrer, do lat. recuperare\ndiagnose|R|grego diagnōsis (distinguir)\ndie|N|nórdico antigo deyja\nplant|L|ing. ant. plante, do lat. planta\nharvest|G|ing. ant. hærfest (outono)\nprotect|L|lat. protegere\nrecycle|R|re- + cycle (grego kyklos, círculo)\npollute|L|lat. polluere\nburn|G|ing. ant. byrnan / beornan\nfreeze|G|ing. ant. frēosan\nshine|G|ing. ant. scīnan\nfish|G|ing. ant. fiscian\ncamp|L|lat. campus (campo), via francês\nbloom|N|nórdico antigo blóm\nsurvive|F|francês survivre, do lat. supervivere\nsink|G|ing. ant. sincan\nsing|G|ing. ant. singan\ndance|F|francês danser\nact|L|lat. actus / agere\nperform|F|anglo-francês performer (parfournir)\nfilm|G|ing. ant. filmen (membrana)\nphotograph|R|grego phōs (luz) + graphē (escrita)\nentertain|F|francês entretenir, do lat. inter + tenere\ncelebrate|L|lat. celebrare\nrelax|L|lat. relaxare\ninvite|F|francês inviter, do lat. invitare\ncollect|L|lat. colligere\ngather|G|ing. ant. gadrian\nobey|F|francês obéir, do lat. oboedire\nforbid|G|ing. ant. forbēodan\nallow|F|francês alouer, do lat. allaudare\nrequire|L|lat. requirere\nsue|F|francês suir, do lat. sequi\narrest|F|francês arester, do lat. arrestare\nvote|L|lat. votum (promessa)\nelect|L|lat. eligere\nban|G|ing. ant. bannan (convocar, proibir)\nsign|F|francês signer, do lat. signare\ngovern|F|francês governer, do lat. gubernare (do gr. kybernan)\npunish|F|francês punir, do lat. punire\ntestify|L|lat. testificari\ndeclare|L|lat. declarare\ncomply|O|italiano/espanhol, do lat. complere\nchange|F|francês changer, do lat. cambire\nincrease|F|francês encreiss, do lat. increscere\ndecrease|F|francês decreiss, do lat. decrescere\ncontinue|F|francês continuer, do lat. continuare\nend|G|ing. ant. endian\nremain|F|francês remanoir, do lat. remanere\nhappen|N|de hap (nórdico antigo happ, sorte)\nseem|N|nórdico antigo sœma (convir)\nappear|F|francês aparoir, do lat. apparere\ndisappear|F|dis- + appear (francês aparoir)\nexist|L|lat. existere\nreduce|L|lat. reducere\nreplace|F|francês remplacer\nadapt|L|lat. adaptare\nadjust|F|francês ajoster, do lat. adiuxtare\nexpand|L|lat. expandere\nlast|G|ing. ant. lǣstan (seguir, durar)\noffer|L|lat. offerre, via ing. ant. offrian\naccept|L|lat. acceptare\nrefuse|F|francês refuser, do lat. refundere\nreceive|F|anglo-francês receivre, do lat. recipere\nown|G|ing. ant. āgen\ngain|F|francês gaaignier (de origem germânica)\nprovide|L|lat. providere\nexchange|F|anglo-francês eschaunge, do lat. excambiare\nsteal|G|ing. ant. stelan\nhide|G|ing. ant. hȳdan\nseek|G|ing. ant. sēcan";
const PT_EXCECOES = {
  querer:    { presente:{"1s":"quero","3s":"quer","1p":"queremos","3p":"querem"}, pperf:{"1s":"quis","3s":"quis","1p":"quisemos","3p":"quiseram"}, ger:"querendo", part:"querido" },
  odiar:     { presente:{"1s":"odeio","3s":"odeia","3p":"odeiam"} },
  rir:       { presente:{"1s":"rio","3s":"ri","1p":"rimos","3p":"riem"}, pperf:{"1s":"ri","3s":"riu","1p":"rimos","3p":"riram"}, ger:"rindo", part:"rido" },
  sorrir:    { presente:{"1s":"sorrio","3s":"sorri","1p":"sorrimos","3p":"sorriem"}, pperf:{"1s":"sorri","3s":"sorriu","1p":"sorrimos","3p":"sorriram"}, ger:"sorrindo", part:"sorrido" },
  ouvir:     { presente:{"1s":"ouço"} },
  perder:    { presente:{"1s":"perco"} },
  sugerir:   { presente:{"1s":"sugiro"} },
  preferir:  { presente:{"1s":"prefiro"} },
  servir:    { presente:{"1s":"sirvo"} },
  vestir:    { presente:{"1s":"visto"} },
  pedir:     { presente:{"1s":"peço"} },
  medir:     { presente:{"1s":"meço"} },
  competir:  { presente:{"1s":"compito"} },
  tossir:    { presente:{"1s":"tusso"} },
  engolir:   { presente:{"1s":"engulo"} },
  perseguir: { presente:{"1s":"persigo"} },
  banir:     { presente:{"1s":"banho"} },
  proibir:   { presente:{"1s":"proíbo","3s":"proíbe","3p":"proíbem"} },
  traduzir:  { presente:{"3s":"traduz"} },
  reduzir:   { presente:{"3s":"reduz"} },
  subir:     { presente:{"3s":"sobe","3p":"sobem"} },
  abrir:     { part:"aberto" },
  construir: { presente:{"3s":"constrói","3p":"constroem"} },
  destruir: { presente:{"3s":"destrói","3p":"destroem"} },
  subtrair:  { presente:{"1s":"subtraio","3s":"subtrai","1p":"subtraímos","3p":"subtraem"}, pperf:{"1s":"subtraí","3s":"subtraiu","1p":"subtraímos","3p":"subtraíram"}, ger:"subtraindo", part:"subtraído" },
  prever:    { presente:{"1s":"prevejo","3s":"prevê","1p":"prevemos","3p":"preveem"}, pperf:{"1s":"previ","3s":"previu","1p":"previmos","3p":"previram"}, ger:"prevendo", part:"previsto" },
  morrer:    { part:"morrido" },
  descrever: { part:"descrito" },
  sacudir:   { presente:{"3s":"sacode","3p":"sacodem"} },
  produzir:  { presente:{"3s":"produz"} },
  sair:      { presente:{"1s":"saio","3s":"sai","1p":"saímos","3p":"saem"}, pperf:{"1s":"saí","3s":"saiu","1p":"saímos","3p":"saíram"}, ger:"saindo", part:"saído" },
  sentir:    { presente:{"1s":"sinto"} },
  mentir:    { presente:{"1s":"minto"} },
  dormir:    { presente:{"1s":"durmo"} },
  cobrir:    { presente:{"1s":"cubro"}, part:"coberto" },
  descobrir: { presente:{"1s":"descubro"}, part:"descoberto" },
  divertir:  { presente:{"1s":"divirto"} },
  repetir:   { presente:{"1s":"repito"} },
  referir:   { presente:{"1s":"refiro"} },
  inferir:   { presente:{"1s":"infiro"} },
  inserir:   { presente:{"1s":"insiro"} },
  transferir:{ presente:{"1s":"transfiro"} },
  seguir:    { presente:{"1s":"sigo"} },
  distinguir:{ presente:{"1s":"distingo"} },
  deduzir:   { presente:{"3s":"deduz"} },
  conduzir:  { presente:{"3s":"conduz"} },
  sumir:     { presente:{"3s":"some","3p":"somem"} },
  fugir:     { presente:{"3s":"foge","3p":"fogem"} },
  supor:     { presente:{"1s":"suponho","3s":"supõe","1p":"supomos","3p":"supõem"}, pperf:{"1s":"supus","3s":"supôs","1p":"supusemos","3p":"supuseram"}, ger:"supondo", part:"suposto" },
  polir:     { presente:{"1s":"pulo","3s":"pule","3p":"pulem"} },
  imprimir:  { part:"impresso" },
  entregar:  { part:"entregue" },
  aceitar:   { part:"aceito" },
  /* derivados de "ter": obtenho / obtém / obtêm · obtive / obteve */
  obter:     { presente:{"1s":"obtenho","3s":"obtém","3p":"obtêm"}, pperf:{"1s":"obtive","3s":"obteve","1p":"obtivemos","3p":"obtiveram"} },
  reter:     { presente:{"1s":"retenho","3s":"retém","3p":"retêm"}, pperf:{"1s":"retive","3s":"reteve","1p":"retivemos","3p":"retiveram"} },
  prosseguir:{ presente:{"1s":"prossigo"} }
};
/* Conjugação regular do português: presente (1s 3s 1p 3p), pretérito, gerúndio, particípio.
   Cobre -ar/-er/-ir, as trocas ortográficas (c→qu, g→gu, ç→c, g→j, c→ç) e os verbos em -uir. */
const VERB_ETIM_INLINE = {};   /* id → "C:nota" vindo das linhas do banco ampliado */
function ptConjugar(inf){
  const fim = inf.slice(-2), st = inf.slice(0, -2);
  const ar = fim === 'ar', er = fim === 'er';
  let o;
  if(/ear$/.test(inf)){                      /* passear → passeio, passeia · passeei (o -e- vira -ei-) */
    const r = inf.slice(0, -2);
    o = { presente:{"1s":r+'io',"3s":r+'ia',"1p":r+'amos',"3p":r+'iam'},
          pperf:{"1s":r+'ei',"3s":r+'ou',"1p":r+'amos',"3p":r+'aram'}, ger:r+'ando', part:r+'ado' };
  } else if(/[^gq]uir$/.test(inf)){
    const r = inf.slice(0, -2);               /* inclu-ir → inclu */
    o = { presente:{"1s":r+'o',"3s":r+'i',"1p":r+'ímos',"3p":r+'em'},
          pperf:{"1s":r+'í',"3s":r+'iu',"1p":r+'ímos',"3p":r+'íram'}, ger:r+'indo', part:r+'ído' };
  } else {
    let p1 = st + 'o', r1 = st + 'i';
    if(ar){
      if(/c$/.test(st)) r1 = st.slice(0, -1) + 'quei';
      else if(/g$/.test(st)) r1 = st + 'uei';
      else if(/ç$/.test(st)) r1 = st.slice(0, -1) + 'cei';
      else r1 = st + 'ei';
    } else {
      if(/g$/.test(st)) p1 = st.slice(0, -1) + 'jo';          /* proteger → protejo */
      else if(!ar && /c$/.test(st)) p1 = st.slice(0, -1) + 'ço'; /* parecer → pareço · ressarcir → ressarço */
    }
    const [a3, a3p, vp, v3, v3p] = ar ? ['a','am','amos','ou','aram'] : er ? ['e','em','emos','eu','eram'] : ['e','em','imos','iu','iram'];
    o = { presente:{"1s":p1,"3s":st+a3,"1p":st+vp,"3p":st+a3p},
          pperf:{"1s":r1,"3s":st+v3,"1p":st+vp,"3p":st+v3p},
          ger: st + (ar ? 'ando' : er ? 'endo' : 'indo'), part: st + (ar ? 'ado' : 'ido') };
  }
  o.inf = inf;
  const ex = PT_EXCECOES[inf];
  if(ex){
    ['presente','pperf'].forEach(k=>{ if(ex[k]) Object.assign(o[k], ex[k]); });
    if(ex.ger) o.ger = ex.ger;
    if(ex.part) o.part = ex.part;
  }
  return o;
}
/* Formas inglesas regulares; "dbl" dobra a consoante final (plan → planning/planned) */
function enFormas(b, dbl, irr){
  const s3 = /(s|x|z|ch|sh|o)$/.test(b) ? b + 'es' : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + 'ies' : b + 's';
  const ing = /ie$/.test(b) ? b.slice(0, -2) + 'ying'
            : dbl ? b + b.slice(-1) + 'ing'
            : /(ee|oe|ye)$/.test(b) ? b + 'ing'
            : /e$/.test(b) ? b.slice(0, -1) + 'ing' : b + 'ing';
  const reg = /e$/.test(b) ? b + 'd' : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + 'ied' : dbl ? b + b.slice(-1) + 'ed' : b + 'ed';
  return { s3, ing, past: irr ? irr[0] : reg, pp: irr ? irr[1] : reg, regular: !irr };
}
(function registrarVerbosNovos(){
  const existentes = new Set(VERBS.map(v => v.id));
  /* Dois blocos de dados com a mesma sintaxe: o original (v80) e o ampliado (v83).
     Linha: "base[^partícula][*][~passado,particípio][+tema…]|infinitivo PT|en=pt;en=pt;en=pt[|E:origem]".
     "^" marca verbo frasal (set^up → id set-up); infinitivo PT com mais de uma palavra
     ("pedir desculpas") conjuga só a 1ª e carrega o resto em todas as formas. */
  [VERBOS_NOVOS, typeof VERBOS_NOVOS_B !== 'undefined' ? VERBOS_NOVOS_B : {}, typeof VERBOS_NOVOS_C !== 'undefined' ? VERBOS_NOVOS_C : {}].forEach(bloco=>{
  Object.keys(bloco).forEach(tema=>{
    bloco[tema].forEach(linha=>{
      const [esp, inf, cols, et] = linha.split('|');
      const m = esp.match(/^([a-z]+(?:-[a-z]+)?)(?:\^([a-z]+))?(\*)?(?:~([a-z]+),([a-z]+))?((?:\+[a-z]+)*)$/);
      if(!m){ console.warn('[verbos] linha inválida:', linha); return; }
      const base = m[1], prt = m[2] || '', f = enFormas(base, !!m[3], m[4] ? [m[4], m[5]] : null);
      const id = prt ? base + '-' + prt : base;
      if(existentes.has(id)){ console.warn('[verbos] já existe:', id); return; }
      existentes.add(id);
      const extras = m[6] ? m[6].split('+').filter(Boolean) : [];
      const col = cols.split(';').map(x=>{ const [en, pt] = x.split('='); return { en, pt }; });
      const nome = prt ? base + ' ' + prt : base;
      const lab = f.regular ? `${nome} · regular` : (f.past === base && f.pp === base ? `${nome} → ${nome} → ${nome}` : (prt ? `${nome} → ${f.past} ${prt} → ${f.pp} ${prt}` : `${nome} → ${f.past} → ${f.pp}`));
      const v = { id, label: lab, base, s3:f.s3, ing:f.ing, past:f.past, pp:f.pp, col, cats:[tema].concat(extras) };
      if(prt){ v.prt = prt; v.phrasal = true; }
      VERBS.push(v);
      const palavras = inf.split(' ');
      const conj = ptConjugar(palavras[0]);
      if(palavras.length > 1){
        const resto = ' ' + palavras.slice(1).join(' ');
        ['presente','pperf'].forEach(k=>{ Object.keys(conj[k]).forEach(p=>{ conj[k][p] += resto; }); });
        conj.ger += resto; conj.part += resto; conj.inf = inf;
      }
      PT_VERBS[id] = conj;
      if(et && /^[A-Z]:/.test(et)) VERB_ETIM_INLINE[id] = et;
    });
  });
  });
  /* temas dos verbos antigos */
  VERBS.forEach(v=>{ if(!v.cats && VERB_TEMAS_ANTIGOS[v.id]) v.cats = VERB_TEMAS_ANTIGOS[v.id].split('+'); });
  VERBS.forEach(v=>{ if(!v.cats) { console.warn('[verbos] sem tema:', v.id); v.cats = ['trab']; } });
})();

initVariantes();
const PT_ESTAR = { presente:{"1s":"estou","3s":"está","1p":"estamos","3p":"estão"}, imperf:{"1s":"estava","3s":"estava","1p":"estávamos","3p":"estavam"}, ir:{"1s":"vou","3s":"vai","1p":"vamos","3p":"vão"} };
const PT_TER = { presente:{"1s":"tenho","3s":"tem","1p":"temos","3p":"têm"}, imperf:{"1s":"tinha","3s":"tinha","1p":"tínhamos","3p":"tinham"} };

const SIGNAL_PT = {
  "always":"sempre","usually":"normalmente","often":"frequentemente","sometimes":"às vezes","occasionally":"ocasionalmente","rarely":"raramente","hardly ever":"quase nunca","never":"nunca",
  "seldom":"raramente","frequently":"frequentemente","generally":"geralmente","constantly":"constantemente",
  "every day":"todo dia","every week":"toda semana","every month":"todo mês","twice a week":"duas vezes por semana","three times a day":"três vezes por dia","once a month":"uma vez por mês",
  "every year":"todo ano","once a week":"uma vez por semana","twice a day":"duas vezes por dia","every morning":"toda manhã","every night":"toda noite",
  "right now":"agora mesmo","at the moment":"no momento","at present":"no presente","nowadays":"hoje em dia","today":"hoje","currently":"atualmente","still":"ainda",
  "this week":"esta semana","this month":"este mês","this year":"este ano","these days":"hoje em dia","at this moment":"neste momento",
  "already":"já","just":"agora","yet":"ainda","ever":"já",
  "once":"uma vez","twice":"duas vezes","three times":"três vezes","several times":"várias vezes","many times":"muitas vezes",
  "a few times":"algumas vezes","a lot":"muito","four times":"quatro vezes","five times":"cinco vezes",
  "since 2020":"desde 2020","since Monday":"desde segunda-feira","since last year":"desde o ano passado","for three years":"há três anos","for a long time":"por muito tempo","so far":"até agora","up to now":"até agora",
  "since I was a child":"desde que eu era criança","since 2015":"desde 2015","for a week":"há uma semana","for months":"há meses","for ages":"há muito tempo","over the years":"ao longo dos anos","in the last few days":"nos últimos dias",
  "since morning":"desde a manhã","since 9 a.m.":"desde as 9h","for two hours":"há duas horas","for a while":"por um tempo","lately":"ultimamente","recently":"recentemente","all week":"a semana toda",
  "for hours":"há horas","for days":"há dias","since breakfast":"desde o café da manhã","since 8 a.m.":"desde as 8h","all day":"o dia todo","all year":"o ano todo","for months now":"há meses","since the accident":"desde o acidente",
  "yesterday":"ontem","last week":"semana passada","last month":"mês passado","last year":"ano passado","two days ago":"dois dias atrás","a week ago":"uma semana atrás","in 2020":"em 2020","when I was young":"quando eu era jovem","back then":"naquela época",
  "the day before yesterday":"anteontem","three years ago":"três anos atrás","a long time ago":"muito tempo atrás","in 1990":"em 1990","when I was a child":"quando eu era criança","last night":"ontem à noite","earlier today":"mais cedo hoje",
  "at that moment":"naquele momento","at 5 p.m. yesterday":"às 17h de ontem","all day yesterday":"o dia todo ontem",
  "at noon yesterday":"ao meio-dia de ontem","while she was cooking":"enquanto ela cozinhava","the whole afternoon":"a tarde toda","all night":"a noite toda",
  "before I left":"antes de eu sair","by the time you arrived":"quando você chegou","already by 2010":"já em 2010","all morning":"a manhã toda",
  "before the meeting started":"antes de a reunião começar","by the time she called":"quando ela ligou","by 2015":"até 2015","already by then":"já naquela época",
  "tomorrow":"amanhã","next week":"semana que vem","next month":"mês que vem","next year":"ano que vem","soon":"em breve","in a few days":"em alguns dias","later":"mais tarde",
  "next weekend":"no próximo fim de semana","in the future":"no futuro","eventually":"eventualmente","someday":"algum dia","this evening":"hoje à noite",
  "at this time tomorrow":"a esta hora amanhã","this time next week":"a esta hora semana que vem","at 8 p.m. tomorrow":"às 20h de amanhã",
  "at midnight tonight":"à meia-noite de hoje","at this time next month":"a esta hora no próximo mês","this time tomorrow":"a esta hora amanhã",
  "by then":"até lá","by next year":"até o ano que vem","by the end of the month":"até o fim do mês","by 2030":"até 2030","for five years":"há cinco anos",
  "by tonight":"até hoje à noite","by tomorrow":"até amanhã","by the end of the year":"até o fim do ano","by the time you arrive":"até você chegar","for over a decade":"há mais de uma década","by next summer":"até o próximo verão",
  "easily":"facilmente","without help":"sem ajuda","by myself":"sozinho(a)","with practice":"com prática","if necessary":"se necessário",
  "tonight":"hoje à noite","at any moment":"a qualquer momento","in theory":"em teoria","this weekend":"neste fim de semana",
  "by law":"por lei","before Friday":"antes de sexta","no matter what":"de qualquer jeito","right away":"imediatamente",
  "here":"aqui","after class":"depois da aula","on weekends":"nos fins de semana","in this building":"neste prédio","during the break":"durante o intervalo",
  "more often":"com mais frequência","as soon as possible":"o quanto antes","before it gets worse":"antes que piore","at least once":"pelo menos uma vez",
  "every summer":"todo verão","as a child":"quando criança","in those days":"naquele tempo",
  "all day long":"o dia inteiro","all year long":"o ano inteiro","all night long":"a noite inteira","all week long":"a semana inteira","all the time":"o tempo todo",
  "all of them":"todos eles","all of us":"todos nós","all my life":"a vida toda","all this time":"todo esse tempo","all summer":"o verão todo","all weekend":"o fim de semana todo",
  "all along":"desde o início","all that time":"todo aquele tempo","all by myself":"totalmente sozinho(a)","all of a sudden":"de repente","all year round":"o ano inteiro","all summer long":"o verão inteiro",
  "from time to time":"de vez em quando","on time":"na hora","every time":"toda vez","for the first time":"pela primeira vez","at the time":"na época","for the last time":"pela última vez","just in time":"bem a tempo","this time":"desta vez","next time":"da próxima vez","in time":"a tempo",
  "my whole life":"minha vida inteira","this whole time":"esse tempo inteiro","the whole time":"o tempo inteiro","the whole day":"o dia inteiro","the whole week":"a semana inteira","the whole night":"a noite inteira","the whole year":"o ano inteiro",
  "ever since":"desde então","never before":"nunca antes","forever":"para sempre","for good":"de vez",
  "every single day":"todo santo dia","every other day":"dia sim, dia não","every now and then":"de vez em quando","every weekend":"todo fim de semana",
  "again":"de novo","once again":"mais uma vez","again and again":"repetidamente","over and over again":"sem parar","all over again":"tudo de novo","yet again":"outra vez",
  "as usual":"como sempre","as always":"como sempre","as a rule":"via de regra","as much as possible":"o máximo possível","as we speak":"neste exato momento",
  "as far as I know":"até onde eu sei","as expected":"como esperado","as never before":"como nunca antes","as long as I can remember":"desde que me lembro",
  "as planned":"conforme planejado","as agreed":"conforme combinado","as promised":"como prometido","as needed":"conforme necessário",
  "at least":"pelo menos","at once":"de uma vez","at the same time":"ao mesmo tempo","at all times":"o tempo todo","at last":"finalmente","at some point":"em algum momento","at first":"a princípio","at that point":"naquele ponto",
  "in general":"em geral","in advance":"com antecedência","in person":"pessoalmente","in a hurry":"com pressa","in silence":"em silêncio","in my life":"na minha vida","in the meantime":"enquanto isso","in the end":"no fim","in a rush":"às pressas","in fact":"na verdade",
  "by heart":"de cor","by default":"por padrão","by myself":"sozinho(a)","by now":"a esta altura","by far":"de longe","by chance":"por acaso","by mistake":"por engano","by accident":"sem querer","by all means":"com certeza",
  "for sure":"com certeza","for now":"por enquanto","for a living":"para viver","for fun":"por diversão","for a change":"para variar","for the most part":"na maior parte","for once":"pelo menos uma vez","for good measure":"por garantia",
  "from home":"de casa","from experience":"por experiência","from scratch":"do zero","from the start":"desde o início","from day one":"desde o primeiro dia","from the beginning":"desde o começo","from memory":"de memória","from a distance":"de longe","from now on":"de agora em diante","from tomorrow":"a partir de amanhã",
  "over and over":"repetidas vezes","over time":"com o tempo","over the phone":"por telefone","over there":"lá","all over the place":"por toda parte","over the weekend":"no fim de semana",
  "with pleasure":"com prazer","with care":"com cuidado","without a doubt":"sem dúvida","without fail":"sem falta","without warning":"sem aviso","without thinking":"sem pensar",
  "around the clock":"24 horas por dia","around here":"por aqui","around noon":"por volta do meio-dia","around the corner":"logo ali",
  "back and forth":"de um lado para o outro","back home":"de volta para casa","back in the day":"naquela época","way back":"lá atrás",
  "once in a while":"de vez em quando","once and for all":"de uma vez por todas","once in a lifetime":"uma vez na vida","more than once":"mais de uma vez","just once":"só uma vez",
  "little by little":"pouco a pouco","step by step":"passo a passo","day by day":"dia após dia","one by one":"um por um","side by side":"lado a lado",
  "about twice a week":"umas duas vezes por semana","about three times a month":"umas três vezes por mês","about every day":"quase todo dia",
  "about now":"mais ou menos agora","about half the time":"quase metade do tempo","about ten times":"umas dez vezes","about twice":"umas duas vezes","about a hundred times":"umas cem vezes",
  "about an hour":"há cerca de uma hora","about two months":"há uns dois meses","about an hour ago":"há mais ou menos uma hora","about a month ago":"há cerca de um mês","about a year ago":"há mais ou menos um ano",
  "about that time":"por volta daquela hora","about a week before":"cerca de uma semana antes","about three hours":"há umas três horas",
  "about noon":"por volta do meio-dia","about this time":"por volta desta hora","in about an hour":"daqui a mais ou menos uma hora","about this time tomorrow":"por volta desta hora amanhã","about then":"por volta de então",
  "at all":"de jeito nenhum",
  "anymore":"mais",
  "any longer":"mais",
  "either":"tampouco",
  "in the least":"nem um pouco",
  "one bit":"nem um pouco",
  "in the slightest":"nem de longe",
  "in years":"há anos",
  "in ages":"há séculos",
  "right now":"agora mesmo",
  "right away":"imediatamente",
  "right here":"bem aqui",
  "right this minute":"neste exato minuto",
  "right then":"naquele instante",
  "right after that":"logo depois disso",
  "right after work":"logo depois do trabalho",
  "right on time":"na hora certa",
  "normally":"normalmente",
  "typically":"tipicamente",
  "regularly":"regularmente",
  "hardly":"quase não",
  "daily":"diariamente",
  "weekly":"semanalmente",
  "monthly":"mensalmente",
  "twice a month":"duas vezes por mês",
  "every other week":"a cada duas semanas",
  "once in a blue moon":"uma vez na vida",
  "on a daily basis":"diariamente",
  "this very moment":"neste exato momento",
  "as of now":"a partir de agora",
  "for the time being":"por ora",
  "this semester":"neste semestre",
  "finally":"finalmente",
  "by now":"a esta altura",
  "time and again":"vez após vez",
  "countless times":"inúmeras vezes",
  "until now":"até agora",
  "up until now":"até o momento",
  "to this day":"até hoje",
  "ever since then":"desde então",
  "in recent years":"nos últimos anos",
  "this whole year":"este ano inteiro",
  "non-stop":"sem parar",
  "since then":"desde então",
  "for quite a while":"por um bom tempo",
  "all this week":"esta semana toda",
  "for the past few days":"nos últimos dias",
  "since last month":"desde o mês passado",
  "that day":"naquele dia",
  "that night":"naquela noite",
  "the other day":"outro dia",
  "years ago":"anos atrás",
  "months ago":"meses atrás",
  "ages ago":"há muito tempo",
  "last summer":"no verão passado",
  "this morning":"hoje de manhã",
  "only once":"só uma vez",
  "a couple of times":"algumas vezes",
  "at that exact moment":"naquele exato momento",
  "the entire time":"o tempo todo",
  "that afternoon":"naquela tarde",
  "earlier that day":"mais cedo naquele dia",
  "when it happened":"quando aconteceu",
  "never before":"nunca antes",
  "by that point":"àquela altura",
  "until that day":"até aquele dia",
  "up to that point":"até aquele ponto",
  "the night before":"na noite anterior",
  "long before that":"muito antes disso",
  "for quite some time":"por um bom tempo",
  "up until then":"até então",
  "that entire week":"aquela semana inteira",
  "since early morning":"desde cedo",
  "first thing tomorrow":"logo cedo amanhã",
  "sooner or later":"mais cedo ou mais tarde",
  "one of these days":"um dia desses",
  "before long":"em pouco tempo",
  "any minute now":"a qualquer momento",
  "the day after tomorrow":"depois de amanhã",
  "in a couple of days":"em alguns dias",
  "all afternoon tomorrow":"a tarde toda amanhã",
  "when you arrive":"quando você chegar",
  "this time on Friday":"a esta hora na sexta",
  "during the meeting":"durante a reunião",
  "by the time we meet":"quando nos encontrarmos",
  "by this time next year":"a esta altura no ano que vem",
  "before you know it":"num piscar de olhos",
  "by the deadline":"até o prazo",
  "all month long":"o mês inteiro",
  "all morning long":"a manhã inteira",
  "all afternoon long":"a tarde inteira",
  "all evening long":"a noite inteira",
  "all winter long":"o inverno inteiro",
  "under pressure":"sob pressão",
  "under control":"sob controle",
  "under the radar":"despercebido",
  "under construction":"em construção",
  "under the table":"por baixo dos panos",
  "under those circumstances":"naquelas circunstâncias",
  "under the weather":"indisposto(a)",
  "under any circumstances":"em qualquer circunstância",
  "across the board":"em todos os âmbitos",
  "along the way":"pelo caminho",
  "through thick and thin":"nos bons e maus momentos",
  "all the way through":"do começo ao fim",
  "through the night":"a noite toda",
  "across the country":"pelo país todo",
  "along the river":"ao longo do rio",
  "through the whole night":"a noite inteira",
  "through it all":"apesar de tudo",
  "within reason":"dentro do razoável",
  "within budget":"dentro do orçamento",
  "within minutes":"em minutos",
  "within a week":"em uma semana",
  "within hours":"em poucas horas",
  "within days":"em poucos dias",
  "within a month":"em um mês",
  "within the hour":"dentro de uma hora",
  "within a year":"em um ano",
  "against the clock":"contra o relógio",
  "against my will":"contra a minha vontade",
  "against all odds":"contra todas as probabilidades",
  "against the odds":"contra as probabilidades",
  "ahead of schedule":"adiantado",
  "behind schedule":"atrasado",
  "ahead of time":"com antecedência",
  "behind the scenes":"nos bastidores",
  "behind my back":"pelas minhas costas",
  "ahead of the curve":"à frente do seu tempo",
  "up front":"de antemão",
  "up close":"de perto",
  "down the line":"lá na frente",
  "up and down":"de cima para baixo",
  "upside down":"de cabeça para baixo",
  "down the road":"no futuro",
  "to some extent":"até certo ponto",
  "to the fullest":"ao máximo",
  "to the point":"direto ao ponto",
  "to date":"até o momento",
  "to no avail":"sem sucesso",
  "to this point":"até este ponto",
  "to death":"até a morte",
  "to that point":"até aquele ponto",
  "of course":"claro",
  "of my own accord":"por vontade própria",
  "of late":"recentemente",
  "of all people":"logo eu",
  "into detail":"em detalhes",
  "into position":"em posição",
  "into pieces":"em pedaços",
  "into consideration":"em consideração",
  "into account":"em conta",
  "per day":"por dia",
  "per week":"por semana",
  "per hour":"por hora",
  "per month":"por mês",
  "straight away":"imediatamente",
  "straight to the point":"direto ao ponto",
  "a bit":"um pouco",
  "a little":"um pouco",
  "a little bit":"um pouquinho",
  "quite a bit":"bastante",
  "very little":"muito pouco",
  "a fair bit":"bastante",
  "a bit longer":"um pouco mais",
  "a little longer":"mais um pouco",
  "hard":"duro",
  "fast":"rápido",
  "well":"bem",
  "badly":"mal",
  "quickly":"rapidamente",
  "slowly":"devagar",
  "carefully":"com cuidado",
  "together":"juntos",
  "alone":"sozinho(a)",
  "quietly":"em silêncio",
  "successfully":"com sucesso",
  "there":"lá",
  "everywhere":"em todo lugar",
  "at home":"em casa",
  "at work":"no trabalho",
  "online":"online",
  "abroad":"no exterior",
  "nearby":"por perto",
  "outside":"lá fora",
  "downtown":"no centro",
  "upstairs":"lá em cima",
  "remotely":"remotamente",
  "probably":"provavelmente",
  "definitely":"com certeza",
  "certainly":"certamente",
  "obviously":"obviamente",
  "apparently":"aparentemente",
  "clearly":"claramente",
  "surely":"seguramente",
  "more than usual":"mais que o normal",
  "less than usual":"menos que o normal",
  "harder than ever":"mais duro do que nunca",
  "better than before":"melhor do que antes",
  "more than ever":"mais do que nunca",
  "better than ever":"melhor do que nunca",
  "like never before":"como nunca antes",
  "as much as ever":"tanto quanto sempre",
  "more than before":"mais do que antes",
  "first":"primeiro",
  "then":"depois",
  "next":"em seguida",
  "after that":"depois disso",
  "afterwards":"depois",
  "before that":"antes disso",
  "later on":"mais tarde",
  "from then on":"daí em diante",
  "meanwhile":"enquanto isso",
  
  "up to then":"até então",
  "on purpose":"de propósito","on foot":"a pé","on my own":"por conta própria","on average":"em média","on the way":"a caminho","on several occasions":"em várias ocasiões","on and on":"sem parar","on the spot":"na hora","on schedule":"dentro do prazo",
  "out loud":"em voz alta","off and on":"de vez em quando","out of nowhere":"do nada","off the record":"em off","out of habit":"por hábito","at any time":"a qualquer hora"
};
function ptFactParts(tempo,aspecto,pEN,verbId){
  const vpt = PT_VERBS[verbId] || PT_VERBS.work;
  const person = ptPerson(pEN), pron = PT_PRONOUN[pEN];
  let core;
  if(ptCondModo && tempo==='future' && ((ptCondModo==='c2' && aspecto==='simples') || (ptCondModo==='c3' && aspecto==='perfeito'))){
    /* v92: condicional tipo 2/3 — "would work" → "trabalharia" · "would have worked" → "teria trabalhado" */
    core = ptCondModo==='c2' ? ptCond(verbId in PT_VERBS ? verbId : 'work', person) : `${PT_COND_TER[person]} ${vpt.part}`;
  } else if(ptCondModo === 'ipf' && tempo === 'past' && aspecto === 'simples' && ptImperf(verbId in PT_VERBS ? verbId : 'work', person)){
    core = ptImperf(verbId in PT_VERBS ? verbId : 'work', person);       /* v120: principal no imperfeito (hábito no passado) */
  } else if(tempo==='present'){
    if(aspecto==='simples') core = vpt.presente[person];
    else if(aspecto==='continuo') core = `${PT_ESTAR.presente[person]} ${vpt.ger}`;
    else core = `${PT_TER.presente[person]} ${vpt.part}`;
  } else if(tempo==='past'){
    if(aspecto==='simples') core = vpt.pperf[person];
    else if(aspecto==='continuo') core = `${PT_ESTAR.imperf[person]} ${vpt.ger}`;
    else if(aspecto==='perfeito') core = `${PT_TER.imperf[person]} ${vpt.part}`;
    else core = `${PT_ESTAR.imperf[person]} ${vpt.ger}`;
  } else {
    /* "vou ir" é pleonasmo: com o verbo ir, o futuro perifrástico se reduz ao próprio "vou" */
    if(aspecto==='simples') core = vpt.inf === 'ir' ? PT_ESTAR.ir[person] : `${PT_ESTAR.ir[person]} ${vpt.inf}`;
    else if(aspecto==='continuo') core = `${PT_ESTAR.ir[person]} estar ${vpt.ger}`;
    else if(aspecto==='perfeito') core = `${PT_ESTAR.ir[person]} ter ${vpt.part}`;
    else core = `${PT_ESTAR.ir[person]} ter estado ${vpt.ger}`;
  }
  return {pron, core};
}
function ptStateAdj(pEN){ return pEN==="She" ? "cansada" : pEN==="He" ? "cansado" : "cansado(a)"; }
function ptStateParts(tempo,aspecto,pEN){
  const person = ptPerson(pEN), pron = PT_PRONOUN[pEN];
  const adj = ptStateAdj(pEN);
  let core;
  if(tempo==='present'){
    core = aspecto==='simples' ? `${PT_ESTAR.presente[person]} ${adj}` : `${PT_TER.presente[person]} estado ${adj}`;
  } else if(tempo==='past'){
    core = aspecto==='simples' ? `${PT_ESTAR.imperf[person]} ${adj}` : `${PT_TER.imperf[person]} estado ${adj}`;
  } else {
    core = aspecto==='simples' ? `${PT_ESTAR.ir[person]} estar ${adj}` : `${PT_ESTAR.ir[person]} ter estado ${adj}`;
  }
  return {pron, core};
}
/* Advérbios cuja tradução PT não aceita a posição média do inglês: "Eu recentemente
   tinha ido" soa errado, o natural é "Recentemente, eu tinha ido". Vale pela palavra em
   português, não pela classe do sinal em inglês — "recently" é advérbio de perfect lá,
   mas advérbio de tempo aqui. */
const PT_ADV_INICIO = new Set(["atualmente","recentemente","ultimamente","hoje em dia"]);
function buildPTSentence(parts, formato, signalMid, signalEnd, col, signalSplit){
  const isQ = formato==='pergunta' || formato==='pergunta_negativa';
  const neg = (formato==='negativa' || formato==='pergunta_negativa');
  const mids = sortSlots(Array.isArray(signalMid) ? signalMid : (signalMid ? [signalMid] : []));
  let body = parts.core, pre = '', prefixo = '';
  if(signalSplit){
    /* "Nunca mais" é uma peça única em português. Na afirmativa vem antes do verbo
       ("Eu nunca mais vou trabalhar"); com a negação explícita, vai para o fim
       ("Eu não vou trabalhar nunca mais") para não empilhar duas negativas no meio. */
    if(signalSplit.ptEnd){ body = `${signalSplit.pt} ${body} ${signalSplit.ptEnd}`; pre = neg ? ' não' : ''; }
    else if(neg){ pre = ' não'; body = `${body} ${signalSplit.pt}`; }
    else { body = `${signalSplit.pt} ${body}`; }
  } else if(mids.length){
    /* Cada advérbio de meio tem o seu lugar em português: certeza antes da negação, "já/ainda/
       sempre/até" fundem-se a ela ("já não", "nem sempre", "nem"), advérbios de tempo abrem a
       frase, e os de modo e intensidade em -mente ("completamente") vão depois do verbo. */
    let certPre = '', negPre = neg ? ' não' : '';
    const antes = [], depois = [];
    mids.forEach(m=>{
      const mp = SIGNAL_PT[m.w] || m.w;
      if(neg && (mp==='já' || mp==='ainda')) negPre = ` ${mp} não`;
      else if(neg && mp==='sempre') negPre = ' nem sempre';
      else if(neg && mp==='até') negPre = ' nem';
      else if(m.cls === 'certaintyFam') certPre += ` ${mp}`;
      /* "normalmente/geralmente… não" é a ordem natural do português: "Eu normalmente não trabalho" */
      else if(neg && PT_HABITUAL.has(mp)) certPre += ` ${mp}`;
      else if(m.cls==='timeMid' || PT_ADV_INICIO.has(mp)) prefixo = cap(mp) + ', ';
      else if(m.ptPos === 'depois') depois.push(mp);
      else antes.push(mp);
    });
    pre = certPre + negPre;
    if(antes.length) body = `${antes.join(' ')} ${body}`;
    if(depois.length) body = `${body} ${depois.join(' ')}`;
  } else { pre = neg ? ' não' : ''; }
  if(col) body = `${body} ${col.pt}`;
  let cabeca = '';
  if(!signalSplit){
    const ends = Array.isArray(signalEnd) ? signalEnd : (signalEnd ? [signalEnd] : []);
    /* o português também abre a frase com o marcador de sequência: "Primeiro, eu..." */
    const seq = sortEnds(ends).filter(s=>s.cls === 'seqFam');
    sortEnds(ends).filter(s=>s.cls !== 'seqFam').forEach(s=>{ body = `${body} ${SIGNAL_PT[s.w] || s.w}`; });
    if(seq.length) cabeca = seq.map(s=>cap(SIGNAL_PT[s.w] || s.w)).join(', ') + ', ';
  }
  let frase = `${cap(parts.pron)}${pre} ${body}` + (isQ ? "?" : ".");
  if(cabeca) frase = cabeca + lowerFirst(frase);
  return prefixo ? prefixo + lowerFirst(frase) : frase;
}
/* "Just" com aspecto perfeito é idiomático em português: vira "acabar de + infinitivo"
   (present perfect → "acabei de trabalhar"; past perfect → "tinha acabado de trabalhar"),
   nunca a tradução literal "agora". O sinal é absorvido na própria construção verbal,
   então não é reinserido como palavra avulsa. "Just" só existe nas listas de
   present_perfeito e past_perfeito, então esses dois ramos cobrem todas as ocorrências. */
const PT_ACABAR_PPERF = {"1s":"acabei","3s":"acabou","1p":"acabamos","3p":"acabaram"};
const PT_HABITUAL = new Set(['normalmente','geralmente','tipicamente','habitualmente','usualmente','costumeiramente']);
function translate(categoria,tempo,aspecto,formato,pronoun,signalMid,signalEnd,verbId,col,signalSplit){
  const midLista = Array.isArray(signalMid) ? signalMid : (signalMid ? [signalMid] : []);
  const justSw = midLista.find(m => m.w === 'just');
  const justIdiom = justSw && aspecto==='perfeito' && (tempo==='present' || tempo==='past');
  if(justIdiom){
    const person = ptPerson(pronoun), pron = PT_PRONOUN[pronoun];
    const alvo = categoria==='fact' ? (PT_VERBS[verbId] || PT_VERBS.work).inf : `estar ${ptStateAdj(pronoun)}`;
    const core = tempo==='present' ? `${PT_ACABAR_PPERF[person]} de ${alvo}` : `${PT_TER.imperf[person]} acabado de ${alvo}`;
    const resto = midLista.filter(m => m !== justSw);
    return buildPTSentence({pron, core}, formato, resto.length ? resto : null, signalEnd || null, col || null, null);
  }
  const parts = categoria==='fact' ? ptFactParts(tempo,aspecto,pronoun,verbId) : ptStateParts(tempo,aspecto,pronoun);
  /* Contagem fecha o fato: "I have visited twice" → "Visitei duas vezes". O "tenho visitado" do
     português é iterativo (algo que vem se repetindo), e não combina com um número exato. */
  if(categoria==='fact' && tempo==='present' && aspecto==='perfeito'){
    const fins = [].concat(signalEnd || []);
    if(fins.some(s => s && /\b(once|twice|times)\b/.test(s.w) && !/\b(a|per|every|each)\s+(day|week|month|year)\b/.test(s.w))){
      parts.core = (PT_VERBS[verbId] || PT_VERBS.work).pperf[ptPerson(pronoun)];
    }
  }
  return buildPTSentence(parts, formato, signalMid || null, signalEnd || null, col || null, signalSplit || null);
}

/* Copiar (EN + PT) com feedback visual e fallback pra contextos sem Clipboard API */
function fallbackCopy(text, done){
  const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  document.body.removeChild(ta); done();
}
function copyFromBtn(btn){
  const text = btn.dataset.text || '';
  if(!text) return;
  const done = ()=>{ btn.textContent='✓'; setTimeout(()=>{ btn.textContent='📋'; }, 1200); };
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text, done)); }
  else fallbackCopy(text, done);
}
document.addEventListener('click', function(e){
  const btn = e.target.closest('#copyMain, #copyModal, #copyPractice');
  if(btn) copyFromBtn(btn);
});

