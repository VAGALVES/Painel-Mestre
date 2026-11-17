/* ---- Geografia da frase ----
   Um encaixe = uma função = uma cor. O MEIO deixou de ser "um encaixe" (misturava certeza,
   frequência, fase...) e virou uma ZONA com cinco encaixes próprios, na ordem em que o inglês
   os empilha antes do verbo: certeza → foco → frequência → fase → intensidade
   ("I probably also often already really like it"). A numeração segue a frase, da esquerda
   para a direita: sequência abre (com vírgula), o meio vem antes do verbo, o fim depois. */
const MID_SLOT = { certaintyFam:11, focusMid:12, freqIndef:13, perfectAdv:14, timeMid:14, degreeMid:15 };
const SLOT_ORDEM = [9, 11, 12, 13, 14, 15, 1, 2, 3, 4, 5, 6, 7, 8, 10];
const SLOT_N = SLOT_ORDEM.length;
if(Object.keys(END_SLOT_NOME).length !== SLOT_N) console.warn('[anatomia] nomes e ordem dos encaixes divergem');
function slotOf(sw){ return sw.pl === 'mid' ? (MID_SLOT[sw.cls] || 13) : endRank(sw); }
function slotNum(r){ return SLOT_ORDEM.indexOf(r) + 1; }
function SLOT_ZONA(r){ return r === 9 ? 'início' : (r >= 11 ? 'meio' : 'fim'); }
function sortSlots(list){ return list.slice().sort((x,y)=> SLOT_ORDEM.indexOf(slotOf(x)) - SLOT_ORDEM.indexOf(slotOf(y))); }

/* ================================================================================
   EXPANSÃO DOS ENCAIXES
   O banco original nasceu por combinação de tempo e ficou irregular: o grau tinha 1 peça
   em alguns tempos, a periodicidade zero em outros. Aqui cada encaixe é povoado por UMA
   lista-mestra e distribuído às combinações onde faz sentido. Regras:
   • encaixe atemporal (grau, modo, comparação, lugar, periodicidade, duração): todas as 12
     combinações recebem a união de tudo o que já existia + as peças novas;
   • encaixe preso ao tempo (aproximação, polaridade, fase): só entra onde a gramática aceita;
   • cada linha é "palavra|tradução|marcas" — A = só afirmativa/pergunta, N = só negativa e
     pergunta, C = afirmativa/negativa, d = em português vai DEPOIS do verbo ("esqueci
     completamente"), não antes. O motor de tradução lê a marca, e nada é escrito à mão
     por combinação.
   ================================================================================ */
(function expandirEncaixes(){
  const AFF = ['afirmativa','pergunta'], NEGQ = ['negativa','pergunta','pergunta_negativa'], AN = ['afirmativa','negativa'];
  const COMBOS = Object.keys(SIGNAL_WORDS);
  const sel = re => COMBOS.filter(k => re.test(k));
  const ALL = COMBOS, PERF = sel(/perfeito/), SC = sel(/_(simples|continuo)$/);

  function add(cls, pl, rows, combos){
    rows.forEach(linha=>{
      const [w, pt, f = ''] = linha.split('|');
      if(!SIGNAL_PT[w]) SIGNAL_PT[w] = pt;
      combos.forEach(k=>{
        const lista = SIGNAL_WORDS[k];
        if(lista.some(s => s.w === w)) return;          /* já existe aqui: não duplica */
        const o = { w, pl, cls };
        if(f.includes('A')) o.only = AFF.slice();
        else if(f.includes('N')) o.only = NEGQ.slice();
        else if(f.includes('C')) o.only = AN.slice();
        if(f.includes('d')) o.ptPos = 'depois';
        lista.push(o);
      });
    });
  }
  /* União de um encaixe atemporal: tudo o que existe em alguma combinação passa a existir em todas */
  function unificar(slot, excluirCls = []){
    const uniao = new Map();
    COMBOS.forEach(k => SIGNAL_WORDS[k].forEach(s=>{
      if(slotOf(s) === slot && !excluirCls.includes(s.cls) && !uniao.has(s.w)) uniao.set(s.w, s);
    }));
    COMBOS.forEach(k=>{
      const tem = new Set(SIGNAL_WORDS[k].map(s => s.w));
      uniao.forEach((s, w)=>{ if(!tem.has(w)) SIGNAL_WORDS[k].push(Object.assign({}, s)); });
    });
  }

  /* ---------- 1 · grau: quanto ---------- */
  add('bitFam','end',[
    'a lot|muito','a great deal|bastante','a good deal|bastante','a whole lot|muitíssimo','very much|muito',
    'so much|tanto','too much|demais','too little|pouco demais','so little|tão pouco','enough|o suficiente',
    'more|mais','less|menos','a bit more|um pouco mais','a little more|um pouco mais','a lot more|muito mais',
    'a lot less|muito menos','much more|bem mais','much less|bem menos','even more|ainda mais','even less|ainda menos',
    'considerably|consideravelmente','significantly|significativamente','greatly|enormemente','enormously|imensamente',
    'substantially|substancialmente','marginally|marginalmente','dramatically|drasticamente',
    'to a large extent|em grande parte','to a great extent|em grande medida','much|muito|N','that much|tanto assim|N'
  ], ALL);

  /* ---------- 2 · modo: como (advérbios em -ly; as locuções já existiam) ---------- */
  add('mannerFam','end',[
    'efficiently|com eficiência','effectively|com eficácia','easily|facilmente','smoothly|sem problemas',
    'gladly|de bom grado','happily|com alegria','calmly|com calma','patiently|com paciência','loudly|em voz alta',
    'gently|com delicadeza','politely|educadamente','seriously|a sério','honestly|honestamente',
    'properly|adequadamente','correctly|corretamente','perfectly|perfeitamente','beautifully|lindamente',
    'professionally|profissionalmente','independently|de forma independente','voluntarily|voluntariamente',
    'secretly|em segredo','openly|abertamente','publicly|publicamente','privately|em particular',
    'reluctantly|a contragosto','eagerly|com entusiasmo','nervously|nervosamente','confidently|com confiança',
    'creatively|de forma criativa','intensely|intensamente','steadily|de forma constante','gradually|gradualmente',
    'suddenly|de repente','fluently|fluentemente','accurately|com precisão','precisely|com exatidão',
    'freely|livremente','deliberately|deliberadamente','intentionally|intencionalmente','automatically|automaticamente',
    'manually|manualmente','thoroughly|a fundo'
  ], ALL);

  /* ---------- 3 · comparação: comparado a quê ---------- */
  add('compareFam','end',[
    'better than usual|melhor que o normal','worse than usual|pior que o normal','worse than before|pior do que antes',
    'worse than ever|pior do que nunca','faster than usual|mais rápido que o normal','slower than usual|mais devagar que o normal',
    'harder than usual|mais duro que o normal','longer than usual|por mais tempo que o normal',
    'earlier than usual|mais cedo que o normal','later than usual|mais tarde que o normal','less than before|menos do que antes',
    'more than expected|mais do que o esperado','less than expected|menos do que o esperado',
    'better than expected|melhor do que o esperado','worse than expected|pior do que o esperado',
    'as well as ever|tão bem quanto sempre','as hard as ever|tão duro quanto sempre','as well as before|tão bem quanto antes',
    'as much as before|tanto quanto antes','more than I thought|mais do que eu pensava',
    'more than I used to|mais do que eu costumava','less than I used to|menos do que eu costumava',
    'more than anyone else|mais do que qualquer outra pessoa','better than anyone|melhor do que qualquer um',
    'better than anyone else|melhor do que qualquer outra pessoa','the most|mais do que todos','the least|menos do que todos'
  ], ALL);

  /* ---------- 4 · lugar: onde ---------- */
  add('placeFam','end',[
    'at the office|no escritório','at school|na escola','at the gym|na academia','at the airport|no aeroporto',
    'at the station|na estação','at the table|à mesa','at a café|em um café','at a restaurant|em um restaurante',
    'at the library|na biblioteca','at the hospital|no hospital','at the store|na loja','at the shops|nas lojas','in the city centre|no centro','at the market|no mercado',
    'at the university|na universidade','at the beach|na praia','at the party|na festa','in the city|na cidade',
    'in the countryside|no interior','in the garden|no jardim','in the kitchen|na cozinha','in the living room|na sala',
    'in the car|no carro','in the park|no parque','on the street|na rua','on the train|no trem','on the bus|no ônibus',
    'on the plane|no avião','on campus|no campus','on site|no local','in public|em público','in private|em particular',
    'indoors|em ambientes fechados','outdoors|ao ar livre','inside|lá dentro','downstairs|lá embaixo','overseas|no estrangeiro',
    'locally|localmente','elsewhere|em outro lugar','somewhere|em algum lugar|A','anywhere|em lugar algum|N',
    'far away|longe','up there|lá em cima','down there|lá embaixo','back there|lá atrás',
    'in the middle of nowhere|no meio do nada','by the sea|à beira-mar','by the river|à beira do rio',
    'in the mountains|nas montanhas','on the road|na estrada','on the way home|a caminho de casa',
    'at the front|na frente','at the back|nos fundos'
  ], ALL);

  /* ---------- 5 · periodicidade: a cada quando / quantas vezes ---------- */
  add('freqDef','end',[
    'daily|diariamente','weekly|semanalmente','monthly|mensalmente','yearly|anualmente','annually|anualmente',
    'hourly|a cada hora','nightly|toda noite','every week|toda semana','every month|todo mês','every year|todo ano',
    'every morning|toda manhã','every afternoon|toda tarde','every evening|toda noite','every night|toda noite',
    'every weekend|todo fim de semana','every Monday|toda segunda-feira','every few days|a cada poucos dias',
    'every couple of days|a cada dois ou três dias','every now and then|de vez em quando','every so often|de vez em quando',
    'now and then|de vez em quando','now and again|de vez em quando','once a day|uma vez por dia',
    'twice a day|duas vezes por dia','three times a day|três vezes por dia','once a week|uma vez por semana',
    'twice a week|duas vezes por semana','three times a week|três vezes por semana','once a month|uma vez por mês',
    'twice a month|duas vezes por mês','once a year|uma vez por ano','twice a year|duas vezes por ano',
    'four times a year|quatro vezes por ano','on weekdays|nos dias úteis','on weekends|nos fins de semana',
    'at weekends|aos fins de semana','on Mondays|às segundas-feiras','on Sundays|aos domingos',
    'in the mornings|de manhã','in the evenings|à noite','on a regular basis|regularmente','on a weekly basis|semanalmente',
    'on a monthly basis|mensalmente','time and again|vez após vez','over and over|repetidamente',
    'as often as possible|com a maior frequência possível','as often as I can|sempre que posso','once|uma vez',
    'three times|três vezes','several times|várias vezes','many times|muitas vezes','a few times|algumas vezes',
    'a couple of times|duas ou três vezes','countless times|inúmeras vezes','ten times|dez vezes'
  ], ALL);

  /* ---------- 6 · duração: por quanto tempo ---------- */
  add('durFam','end',[
    'throughout the day|ao longo do dia','throughout the week|ao longo da semana','throughout the month|ao longo do mês',
    'throughout the year|ao longo do ano','throughout the night|durante a noite toda','throughout the summer|ao longo do verão',
    'throughout the winter|ao longo do inverno','throughout the morning|durante toda a manhã','the entire time|o tempo todo',
    'day and night|dia e noite','round the clock|24 horas por dia','nonstop|sem parar','without a break|sem pausa',
    'from morning till night|de manhã até a noite','from dawn till dusk|do amanhecer ao anoitecer',
    'from start to finish|do início ao fim','day after day|dia após dia','week after week|semana após semana',
    'month after month|mês após mês','year after year|ano após ano','hour after hour|hora após hora',
    'for hours|por horas','for days|por dias','for weeks|por semanas','for months|por meses','for years|por anos',
    'for hours on end|por horas a fio','for days on end|por dias a fio','for weeks on end|por semanas a fio',
    'for months on end|por meses a fio','for years on end|por anos a fio','for a while|por um tempo',
    'for a short time|por pouco tempo','for a long while|por bastante tempo','for a few minutes|por alguns minutos',
    'for a few hours|por algumas horas','for a few days|por alguns dias','for a few weeks|por algumas semanas',
    'for a few months|por alguns meses','for a few years|por alguns anos','for a couple of hours|por umas duas horas',
    'for a couple of days|por uns dois dias','for half an hour|por meia hora','for an hour|por uma hora',
    'for a minute|por um minuto','during the day|durante o dia','during the night|durante a noite',
    'overnight|durante a noite','all the way|o caminho todo','all the while|o tempo todo'
  ], ALL);

  /* ---------- 7 · aproximação: mais ou menos quando / quanto ---------- */
  add('aboutFam','end',[                                   /* ritmo e duração: valem em qualquer tempo */
    'about once a day|cerca de uma vez por dia','about once a week|cerca de uma vez por semana',
    'about once a month|cerca de uma vez por mês','about once a year|cerca de uma vez por ano',
    'about three times a week|umas três vezes por semana','about four times a day|umas quatro vezes por dia',
    'roughly twice a month|aproximadamente duas vezes por mês','around five times a week|umas cinco vezes por semana',
    'approximately every week|aproximadamente toda semana','more or less every day|mais ou menos todo dia',
    'about three times|umas três vezes','about a dozen times|umas doze vezes','roughly ten times|aproximadamente dez vezes',
    'around twenty times|umas vinte vezes','for about an hour|por cerca de uma hora','for about two hours|por cerca de duas horas',
    'for about ten minutes|por cerca de dez minutos','for about half an hour|por cerca de meia hora',
    'for about a week|por cerca de uma semana','for about a month|por cerca de um mês',
    'for roughly three days|por aproximadamente três dias','for approximately a year|por aproximadamente um ano',
    'for around two weeks|por umas duas semanas','at some point|em algum momento'
  ], ALL);
  add('aboutFam','end',[                                   /* hora do dia: simples e contínuo */
    'around noon|por volta do meio-dia','around midnight|por volta da meia-noite','around three|por volta das três',
    'around ten|por volta das dez','at about nine|por volta das nove','at around five|por volta das cinco',
    'at roughly eight|por volta das oito','around that time|por volta dessa hora','around sunset|por volta do pôr do sol',
    'around dawn|por volta do amanhecer','roughly then|mais ou menos nessa hora'
  ], SC);
  add('aboutFam','end',[                                   /* "há cerca de…": só o passado */
    'about ten minutes ago|há cerca de dez minutos','about two hours ago|há cerca de duas horas',
    'about three days ago|há cerca de três dias','about two weeks ago|há cerca de duas semanas',
    'about six months ago|há cerca de seis meses','about ten years ago|há cerca de dez anos',
    'around a week ago|há cerca de uma semana','roughly a decade ago|há cerca de uma década',
    'approximately two years ago|há aproximadamente dois anos'
  ], ['past_simples','past_continuo']);
  add('aboutFam','end',[                                   /* "daqui a cerca de…": o futuro */
    'in about ten minutes|daqui a uns dez minutos','in about two hours|daqui a umas duas horas',
    'in about a week|daqui a mais ou menos uma semana','in about two weeks|daqui a umas duas semanas',
    'in roughly a month|daqui a aproximadamente um mês','in around a year|daqui a cerca de um ano',
    'sometime next week|em algum momento da semana que vem','sometime tomorrow|em algum momento amanhã',
    'sometime soon|em breve','any time now|a qualquer momento','about this time next week|por volta desta hora na semana que vem',
    'around this time next year|por volta desta época no ano que vem','roughly next month|mais ou menos no mês que vem'
  ], ['future_simples','future_continuo','present_continuo']);

  /* ---------- 9 · sequência: em que ordem ---------- */
  add('seqFam','end',[
    'firstly|primeiramente','first of all|antes de tudo','to begin with|para começar','at first|a princípio',
    'in the first place|em primeiro lugar','secondly|em segundo lugar','thirdly|em terceiro lugar',
    'after a while|depois de um tempo','shortly after|logo depois','soon after|pouco depois','right after|logo em seguida',
    'immediately afterwards|imediatamente depois','subsequently|posteriormente','previously|anteriormente',
    'beforehand|antes','in the end|no fim','lastly|por último','at last|finalmente','eventually|por fim',
    'after all|afinal','once that was done|feito isso','in turn|por sua vez','simultaneously|simultaneamente',
    'from that moment on|a partir daquele momento','after this|depois disto','following that|em seguida a isso',
    'prior to that|antes disso'
  ], ALL);
  add('seqFam','end',['from now on|a partir de agora'], ['present_simples','present_continuo','future_simples','future_continuo']);

  /* ---------- 10 · polaridade: só em negativas e perguntas ---------- */
  add('npiFam','end',[
    'whatsoever|de forma alguma|N','in any way|de forma alguma|N','by any means|de modo algum|N',
    'under any circumstances|em nenhuma circunstância|N','at any point|em momento algum|N','at any time|em nenhum momento|N',
    'for a moment|nem por um momento|N','for a second|nem por um segundo|N','any further|mais longe|N',
    'any better|nem um pouco melhor|N','any more|mais|N'
  ], ALL);
  add('npiFam','end',[                                      /* "há anos": só o perfect */
    'in years|há anos|N','in ages|há séculos|N','in a long time|há muito tempo|N','in months|há meses|N',
    'in weeks|há semanas|N','in decades|há décadas|N','in a while|há algum tempo|N'
  ], PERF);
  add('npiFam','end',['any time soon|tão cedo|N'], ['future_simples','future_continuo','present_continuo']);

  /* ---------- 11 · certeza: com que segurança (meio, antes do auxiliar negado) ---------- */
  add('certaintyFam','mid',[
    'probably|provavelmente|C','possibly|possivelmente|C','definitely|com certeza|C','certainly|certamente|C',
    'surely|seguramente|C','clearly|claramente|C','obviously|obviamente|C','evidently|evidentemente|C',
    'apparently|aparentemente|C','seemingly|aparentemente|C','presumably|presumivelmente|C','supposedly|supostamente|C',
    'allegedly|supostamente|C','undoubtedly|sem dúvida|C','unquestionably|inquestionavelmente|C',
    'most likely|muito provavelmente|C','inevitably|inevitavelmente|C','actually|na verdade|C'
  ], ALL);

  /* ---------- 12 · foco: só / também / até ---------- */
  add('focusMid','mid',[
    'also|também|A','even|até','only|só|A','merely|meramente|A','mainly|principalmente|Ad','mostly|sobretudo|Ad',
    'primarily|primordialmente|Ad','especially|especialmente|d','particularly|particularmente|d',
    'specifically|especificamente|d','exclusively|exclusivamente|Ad','solely|unicamente|Ad'
  ], ALL);

  /* ---------- 13 · frequência: com que frequência (vaga) ---------- */
  add('freqIndef','mid',[
    'always|sempre','usually|normalmente','often|frequentemente','frequently|frequentemente','generally|geralmente',
    'constantly|constantemente','continually|continuamente','invariably|invariavelmente','habitually|habitualmente',
    'repeatedly|repetidamente','periodically|periodicamente','intermittently|intermitentemente',
    'almost always|quase sempre','nearly always|quase sempre','sometimes|às vezes|A','occasionally|ocasionalmente|A',
    'rarely|raramente|A','seldom|raramente|A','never|nunca|A','hardly ever|quase nunca|A','scarcely ever|quase nunca|A',
    'rarely ever|raramente|A','almost never|quase nunca|A'
  ], ALL);

  /* ---------- 14 · fase: em que ponto da ação ---------- */
  add('perfectAdv','mid',['already|já|A','finally|finalmente|A'], ALL);
  add('perfectAdv','mid',['still|ainda|A'], SC);
  add('perfectAdv','mid',['initially|inicialmente|A','originally|originalmente|A','ultimately|por fim|A'], ALL);
  add('perfectAdv','mid',['recently|recentemente|A'], PERF.filter(k=>/^(present|past)/.test(k)).concat(['past_simples']));
  add('timeMid','mid',['currently|atualmente'], ['present_simples','present_continuo']);
  add('timeMid','mid',['now|agora|A'], ['present_simples','present_continuo','present_perfeito','future_simples','future_continuo']);

  /* ---------- 15 · intensidade: em que medida (meio, antes do verbo) ---------- */
  add('degreeMid','mid',[
    'really|realmente','truly|verdadeiramente|A','completely|completamente|d','totally|totalmente|d',
    'entirely|inteiramente|d','fully|plenamente|d','absolutely|absolutamente|Ad','utterly|totalmente|Ad','almost|quase|A',
    'nearly|quase|A','barely|mal|A','scarcely|mal|A','simply|simplesmente','literally|literalmente|A',
    'partly|em parte|d','partially|parcialmente|d','slightly|levemente|Ad','deeply|profundamente|d','strongly|fortemente|d',
    'quite|bastante|Ad','rather|bastante|Ad','somewhat|um tanto|Ad','genuinely|genuinamente'
  ], ALL);

  /* ---------- 8 · tempo: quando — as lacunas que o fio condutor deixou ----------
     O tempo é o encaixe mais pedido e o mais irregular: o passado simples tinha 55 peças, o
     perfect contínuo 28 e o passado contínuo 19. Cada tempo verbal aceita uma família própria
     de marcadores, e é essa família que é completada aqui:
       passado → período JÁ ENCERRADO (yesterday, last week, two days ago)
       perfect → período AINDA ABERTO (today, this week, lately, in the past year)
       presente → o recorte em que vale (today, at the moment, nowadays)
       futuro → à frente (tonight, in a week, by Friday)  */
  const P_FIM = ['past_simples','past_continuo'];
  add('timePoint','end',[
    'yesterday morning|ontem de manhã','yesterday afternoon|ontem à tarde','yesterday evening|ontem à noite',
    'last weekend|no fim de semana passado','last Monday|segunda-feira passada','last Friday|sexta-feira passada',
    'last spring|na primavera passada','last winter|no inverno passado','last Christmas|no Natal passado',
    'a month ago|há um mês','a year ago|há um ano','a few days ago|há alguns dias','a few weeks ago|há algumas semanas',
    'a couple of weeks ago|há umas duas semanas','on Monday|na segunda-feira','on Friday night|na sexta à noite',
    'in the nineties|nos anos noventa','at the weekend|no fim de semana','on the weekend|no fim de semana','this time last week|a esta hora semana passada',
    'this time yesterday|a esta hora ontem','this time last year|nesta época do ano passado'
  ], P_FIM);
  add('timePoint','end',[
    'yesterday|ontem','last night|ontem à noite','last week|semana passada','last month|mês passado','last year|ano passado',
    'two days ago|há dois dias','a week ago|há uma semana','earlier today|mais cedo hoje','this morning|hoje de manhã',
    'at midnight|à meia-noite','at noon|ao meio-dia','at lunchtime|na hora do almoço','at that time|naquela hora',
    'when you called|quando você ligou','when you arrived|quando você chegou','a moment ago|há um instante'
  ], ['past_continuo']);
  add('timePoint','end',[
    'the day before|no dia anterior','the night before|na noite anterior','the week before|na semana anterior',
    'the month before|no mês anterior','the year before|no ano anterior','the previous day|no dia anterior',
    'the previous week|na semana anterior','the previous year|no ano anterior','two days earlier|dois dias antes',
    'a week earlier|uma semana antes','a year earlier|um ano antes','years earlier|anos antes','earlier that day|mais cedo naquele dia',
    'until then|até então','by that time|até aquela hora','by noon|até o meio-dia','by the end of the day|até o fim do dia',
    'by Monday|até segunda','before breakfast|antes do café da manhã','by 5 p.m.|até as 17h'
  ], ['past_perfeito','past_perfeito_continuo']);
  add('timePoint','end',[
    'today|hoje','tonight|hoje à noite','this morning|hoje de manhã','this afternoon|hoje à tarde','this evening|hoje à noite',
    'this week|esta semana','this month|este mês','this year|este ano','this weekend|neste fim de semana',
    'this semester|neste semestre','nowadays|hoje em dia','at the moment|no momento','for the time being|por enquanto',
    'at present|atualmente','tomorrow|amanhã','next week|semana que vem','next month|mês que vem',
    'on Monday|na segunda-feira','on Friday|na sexta-feira'
  ], ['present_simples','present_continuo']);
  add('timePoint','end',[
    'today|hoje','this morning|esta manhã','this afternoon|esta tarde','this week|esta semana','this month|este mês',
    'this year|este ano','this weekend|neste fim de semana','this summer|neste verão','this semester|neste semestre',
    'lately|ultimamente','so far today|até agora hoje','so far this week|até agora esta semana',
    'so far this month|até agora este mês','so far this year|até agora este ano','in the past week|na última semana',
    'in the past month|no último mês','in the past year|no último ano','in the past few weeks|nas últimas semanas',
    'in the past few months|nos últimos meses','over the past week|ao longo da última semana',
    'over the past year|ao longo do último ano','over the past decade|ao longo da última década',
    'over the last few years|ao longo dos últimos anos','in recent weeks|nas últimas semanas',
    'in recent months|nos últimos meses','in recent days|nos últimos dias','since this morning|desde esta manhã',
    'since yesterday|desde ontem','since last week|desde a semana passada','since last month|desde o mês passado',
    'since January|desde janeiro','since then|desde então','for the past week|durante a última semana',
    'for the past few days|durante os últimos dias','for the last two weeks|durante as últimas duas semanas'
  ], ['present_perfeito','present_perfeito_continuo']);
  add('timePoint','end',[
    'today|hoje','tonight|hoje à noite','this morning|hoje de manhã','this afternoon|hoje à tarde','this week|esta semana',
    'this month|este mês','this year|este ano','this weekend|neste fim de semana','tomorrow morning|amanhã de manhã',
    'tomorrow afternoon|amanhã à tarde','tomorrow night|amanhã à noite','next Monday|segunda-feira que vem',
    'next summer|no verão que vem','on Monday|na segunda-feira','on Friday|na sexta-feira','in a week|daqui a uma semana',
    'in a month|daqui a um mês','in a year|daqui a um ano','in ten minutes|daqui a dez minutos','in an hour|daqui a uma hora',
    'in two days|daqui a dois dias','in two weeks|daqui a duas semanas','later today|mais tarde hoje',
    'this time tomorrow|a esta hora amanhã','this time next week|a esta hora na semana que vem'
  ], ['future_simples','future_continuo']);
  add('timePoint','end',[
    'tomorrow|amanhã','tonight|hoje à noite','next week|na semana que vem','next month|no mês que vem','next year|no ano que vem',
    'this weekend|neste fim de semana','this evening|esta noite','tomorrow morning|amanhã de manhã','tomorrow night|amanhã à noite',
    'next Monday|segunda-feira que vem','at noon tomorrow|amanhã ao meio-dia','at this time tomorrow|a esta hora amanhã'
  ], ['future_continuo']);
  add('timePoint','end',[
    'by Friday|até sexta','by Monday|até segunda','by next week|até a semana que vem','by next month|até o mês que vem',
    'by the end of the week|até o fim da semana','by noon|até o meio-dia','by tomorrow morning|até amanhã de manhã',
    'by this time tomorrow|até esta hora amanhã','by this time next week|até esta hora na semana que vem',
    'by the end of the day|até o fim do dia','by the end of the decade|até o fim da década','by next summer|até o verão que vem',
    'by the weekend|até o fim de semana','by January|até janeiro','by 5 p.m.|até as 17h','by midnight|até a meia-noite'
  ], ['future_perfeito','future_perfeito_continuo']);

  /* ---------- atemporais: tudo o que existe em alguma combinação passa a existir em todas ---------- */
  [1, 2, 3, 4, 6].forEach(r => unificar(r));
  unificar(5, ['freqIndef']);          /* "normally/typically" ficam onde estavam: aceitam mal a negação */
})();

function endList(){ return Array.isArray(state.signalEnds) ? state.signalEnds : []; }
function midList(){ return Array.isArray(state.signalMids) ? state.signalMids : []; }

/* Pinta um elemento (chip, etiqueta) com a cor do encaixe do sinal. As famílias
   continuam neutras: elas são navegação, não conteúdo. */
function paintCat(el, sw){
  if(!el || !sw) return;
  const k = adjKind(sw.cls, sw.w);
  el.dataset.cat = k;
  el.style.setProperty('--cat', ADJ_COLOR[k]);
}
function signalAllowed(sw, formato){
  return variantOk(sw.w) && (!sw.only || sw.only.includes(formato));
}
function applySignal(text, signalMid, signalEnd, col, signalSplit, formato){
  let words = text.split(" ");
  const neg = formato==='negativa' || formato==='pergunta_negativa';
  /* O sinal partido ocupa os dois pontos: a 1ª parte entra antes do verbo principal
     (trocada por "ever" em contexto negado) e a 2ª vai para o fim, depois da regência. */
  if(signalSplit) words.splice(words.length-1, 0, C(neg ? signalSplit.negMid : signalSplit.mid, signalSplit.cls));
  else if(signalMid){
    /* Advérbios de certeza mudam de lugar conforme a polaridade: na afirmativa ficam
       depois do auxiliar ("I will probably work"), mas na negativa vêm ANTES dele
       ("I probably won't work" — nunca "I won't probably work"). Os de frequência não
       fazem isso ("I don't always work" é natural), por isso a regra é só desta família. */
    /* Vários advérbios de meio empilham na ordem dos encaixes (certeza → foco → frequência →
       fase → intensidade). O ponto de inserção é logo depois do 1º auxiliar ("I have probably
       been working", e não "I have been probably working"); sem auxiliar, antes do verbo. */
    const listaMid = sortSlots(Array.isArray(signalMid) ? signalMid : [signalMid]);
    /* certeza em frase negada vem ANTES do auxiliar ("I probably won't work") */
    const base = Math.min(words.length-1, 2);          /* logo após o 1º auxiliar, medido antes de inserir */
    /* Na negativa, duas peças passam à frente do auxiliar: a certeza ("I probably don't") e o
       "still" ("I still don't know" — nunca "I don't still know"). Entram na ordem dos encaixes. */
    const furaFila = m => neg && (m.cls === 'certaintyFam' || m.w === 'still');
    const certNeg = listaMid.filter(furaFila);
    certNeg.forEach((m, i) => words.splice(1 + i, 0, C(m.w, m.cls)));
    /* os demais empilham um depois do outro a partir desse ponto */
    let ponto = base + certNeg.length;
    listaMid.filter(m => !furaFila(m)).forEach(m => { words.splice(ponto, 0, C(m.w, m.cls)); ponto++; });
  }
  let t = words.join(" ");
  if(col) t += ' ' + R(col.en);           /* regência/collocation cola no verbo, antes dos sinais de fim */
  if(signalSplit) t += ' ' + C(signalSplit.end, signalSplit.cls);
  else {
    const ends = Array.isArray(signalEnd) ? signalEnd : (signalEnd ? [signalEnd] : []);
    /* Sequência é o único adjunto que o inglês prefere no INÍCIO: "First, I worked...".
       No fim ele soa deslocado, então sai da fila dos encaixes finais e vira prefixo. */
    const seq = sortEnds(ends).filter(s=>s.cls === 'seqFam');
    sortEnds(ends).filter(s=>s.cls !== 'seqFam').forEach(s=>{ t += ' ' + C(s.w, s.cls); });
    if(seq.length){
      const cab = seq.map(s=>C(cap(s.w), s.cls)).join(', ');
      t = cab + ', ' + lowerFirstMarked(t);
    }
  }
  return t;
}


/* ================= v89: 2ª ORAÇÃO (dial ⑩) =================
   A oração 2 é gerada pelo PRÓPRIO motor (generate/translate) — conjugação, negação e tradução
   são reaproveitadas. O tipo de oração decide só a FORMA da oração 2:
     A) infinitiva  (final: in order to + V)      — sem sujeito nem tempo, herda os da principal
     B) coordenada  (but / and)                   — mesmo sujeito; tempo e aspecto herdados
     C) finita com regra de tempo (because / so)  — mesmo sujeito; contínuos viram simples
   Coerência semântica: finalidade curada à mão (~150 verbos) + fallback por tema; contraste e adição
   derivados dos antônimos e sinônimos (v88); motivo e resultado por tema.
   Tokens: {p} = possessivo de acordo com o sujeito (my/his…); {M} {F} {MP} {FP} = possessivos PT. */
const O2_FIN_TXT = `work|earn a living=ganhar a vida; support {p} family=sustentar {F} família; build a career=construir uma carreira
go|see {p} parents=ver {MP} pais; find a job=encontrar um emprego; take a break=dar uma pausa
eat|stay healthy=manter a saúde; gain energy=ganhar energia; lose weight=perder peso
write|share {p} ideas=compartilhar {FP} ideias; publish a book=publicar um livro; record the results=registrar os resultados
see|understand the problem=entender o problema; learn more=aprender mais; check the results=conferir os resultados
take|save time=economizar tempo; reach the goal=alcançar a meta; avoid delays=evitar atrasos
come|meet the team=conhecer a equipe; help with the project=ajudar no projeto; say goodbye=se despedir
run|stay in shape=manter a forma; clear {p} mind=clarear a mente; win the race=vencer a corrida
buy|save money=economizar dinheiro; improve the house=melhorar a casa; give a gift=dar um presente
think|find a solution=encontrar uma solução; avoid mistakes=evitar erros; make a good decision=tomar uma boa decisão
put|keep things organized=manter as coisas organizadas; save space=economizar espaço; avoid losing it=evitar perdê-lo
speak|explain the idea=explicar a ideia; persuade the team=convencer a equipe; be understood=ser entendido
say|clarify the point=esclarecer o ponto; avoid confusion=evitar confusão; show respect=demonstrar respeito
get|reach the goal=alcançar a meta; improve {p} life=melhorar {F} vida; finish on time=terminar no prazo
make|solve the problem=resolver o problema; save time=economizar tempo; improve the result=melhorar o resultado
know|make better decisions=tomar melhores decisões; help others=ajudar os outros; avoid mistakes=evitar erros
give|support the team=apoiar a equipe; show gratitude=demonstrar gratidão; help the community=ajudar a comunidade
find|solve the problem=resolver o problema; save time=economizar tempo; learn the truth=descobrir a verdade
tell|warn the team=avisar a equipe; avoid misunderstandings=evitar mal-entendidos; share the news=compartilhar a notícia
become|reach {p} full potential=alcançar {M} potencial; help others=ajudar os outros; build a better future=construir um futuro melhor
leave|avoid traffic=evitar o trânsito; arrive early=chegar cedo; catch the train=pegar o trem
feel|understand {p} emotions=entender {FP} emoções; connect with people=conectar-me com as pessoas; grow as a person=crescer como pessoa
bring|help the team=ajudar a equipe; show the results=mostrar os resultados; share the idea=compartilhar a ideia
begin|reach the goal=alcançar a meta; finish on time=terminar no prazo; make progress=fazer progresso
keep|protect the data=proteger os dados; avoid losing it=evitar perdê-lo; stay organized=manter-se organizado
hold|keep it safe=mantê-lo seguro; discuss the plan=discutir o plano; decide together=decidir em conjunto
meet|discuss the plan=discutir o plano; solve the problem=resolver o problema; build a partnership=construir uma parceria
win|earn the prize=conquistar o prêmio; prove {p} skills=provar {FP} habilidades; inspire the team=inspirar a equipe
teach|share knowledge=compartilhar conhecimento; prepare the students=preparar os alunos; inspire young people=inspirar os jovens
sell|earn more money=ganhar mais dinheiro; grow the business=fazer o negócio crescer; reach new customers=alcançar novos clientes
send|inform the client=informar o cliente; meet the deadline=cumprir o prazo; share the results=compartilhar os resultados
break|reduce the risk=reduzir o risco; see how it works=ver como funciona; start again=recomeçar
drive|get to work=chegar ao trabalho; save time=economizar tempo; visit {p} family=visitar {F} família
choose|find the best option=encontrar a melhor opção; avoid regret=evitar arrependimento; save money=economizar dinheiro
wear|look professional=ter aparência profissional; stay warm=manter-se aquecido; make a good impression=causar uma boa impressão
fall|rest for a while=descansar um pouco; learn from the mistake=aprender com o erro; start over=recomeçar
forget|move on=seguir em frente; reduce stress=reduzir o estresse; focus on the future=focar no futuro
grow|reach a bigger market=alcançar um mercado maior; increase the profits=aumentar os lucros; become stronger=ficar mais forte
catch|arrive on time=chegar a tempo; avoid delays=evitar atrasos; see the show=ver o espetáculo
sleep|recover {p} energy=recuperar a energia; stay healthy=manter a saúde; focus better=focar melhor
imagine|find new ideas=encontrar novas ideias; solve the problem=resolver o problema; design the future=projetar o futuro
join|meet new people=conhecer novas pessoas; learn new skills=aprender novas habilidades; support the cause=apoiar a causa
need|reach the goal=alcançar a meta; improve {p} life=melhorar {F} vida; make progress=fazer progresso
overcome|reach {p} goals=alcançar {FP} metas; grow stronger=ficar mais forte; inspire others=inspirar os outros
quit|focus on {p} health=focar na {F} saúde; start a new project=começar um novo projeto; reduce stress=reduzir o estresse
understand|solve the problem=resolver o problema; help the team=ajudar a equipe; make better decisions=tomar melhores decisões
visit|see {p} family=ver {F} família; know the city=conhecer a cidade; discuss the project=discutir o projeto
agree|close the deal=fechar o negócio; avoid conflict=evitar conflito; move forward=seguir em frente
call|ask for help=pedir ajuda; confirm the meeting=confirmar a reunião; share the news=compartilhar a notícia
carry|help {p} friend=ajudar {M} amigo; deliver the box=entregar a caixa; save time=economizar tempo
check|avoid mistakes=evitar erros; make sure it works=garantir que funciona; save time later=economizar tempo depois
clean|remove the dust=tirar a poeira; stay healthy=manter a saúde; welcome {p} guests=receber {MP} convidados
close|protect the data=proteger os dados; save energy=economizar energia; finish the day=encerrar o dia
count|know the total=saber o total; avoid mistakes=evitar erros; check the budget=conferir o orçamento
cross|reach the other side=chegar ao outro lado; save time=economizar tempo; avoid the traffic=evitar o trânsito
cut|save money=economizar dinheiro; reduce the risk=reduzir o risco; improve the result=melhorar o resultado
deal|solve the problem=resolver o problema; keep the peace=manter a paz; protect the team=proteger a equipe
decide|move forward=seguir em frente; avoid delays=evitar atrasos; solve the problem=resolver o problema
do|reach the goal=alcançar a meta; help the team=ajudar a equipe; improve the result=melhorar o resultado
draw|explain the idea=explicar a ideia; relax=relaxar; design the plan=projetar o plano
dream|find motivation=encontrar motivação; imagine a better future=imaginar um futuro melhor; set bigger goals=definir metas maiores
drink|stay hydrated=manter-se hidratado; relax=relaxar; wake up=despertar
drop|reduce the weight=reduzir o peso; save time=economizar tempo; leave it with a friend=deixá-lo com um amigo
face|solve the problem=resolver o problema; grow stronger=ficar mais forte; stop avoiding it=parar de evitá-lo
fight|protect {p} rights=proteger {MP} direitos; defend the team=defender a equipe; win the case=ganhar a causa
fill|complete the form=preencher o formulário; finish the task=concluir a tarefa; avoid empty spaces=evitar espaços vazios
follow|learn from experts=aprender com especialistas; stay on track=manter-se no caminho; avoid mistakes=evitar erros
have|stay organized=manter-se organizado; save time=economizar tempo; feel safe=sentir-se seguro
let|give them freedom=dar liberdade a eles; build trust=construir confiança; avoid conflict=evitar conflito
like|show {p} support=demonstrar {M} apoio; stay connected=manter-me conectado; share the moment=compartilhar o momento
live|raise a family=criar uma família; be close to work=ficar perto do trabalho; enjoy the city=aproveitar a cidade
look|find a solution=encontrar uma solução; check the details=conferir os detalhes; understand the problem=entender o problema
lose|learn from the experience=aprender com a experiência; lower the risk=reduzir o risco; start fresh=recomeçar
pass|reach the next level=chegar ao próximo nível; get a good job=conseguir um bom emprego; make {p} family proud=deixar {F} família orgulhosa
pay|avoid debt=evitar dívidas; keep a good record=manter um bom histórico; support the team=apoiar a equipe
pick|choose the best one=escolher o melhor; save time=economizar tempo; help the team=ajudar a equipe
play|relax=relaxar; have fun with friends=se divertir com os amigos; win the game=ganhar o jogo
pull|move it forward=movê-lo para a frente; save effort=economizar esforço; open the way=abrir caminho
push|move it forward=movê-lo para a frente; reach the goal=alcançar a meta; inspire the team=inspirar a equipe
raise|increase the quality=aumentar a qualidade; support the cause=apoiar a causa; improve the results=melhorar os resultados
read|learn something new=aprender algo novo; relax=relaxar; improve {p} vocabulary=melhorar {M} vocabulário
return|fix the problem=resolver o problema; see {p} family=ver {F} família; start again=recomeçar
ride|get to work=chegar ao trabalho; save money=economizar dinheiro; enjoy the view=aproveitar a vista
save|buy a house=comprar uma casa; protect {p} future=proteger {M} futuro; avoid debt=evitar dívidas
set|reach the goal=alcançar a meta; keep the focus=manter o foco; organize the plan=organizar o plano
show|prove {p} point=provar {M} ponto de vista; help them understand=ajudá-los a entender; share the results=compartilhar os resultados
stand|show {p} support=demonstrar {M} apoio; see better=ver melhor; defend {p} opinion=defender {F} opinião
stay|save money=economizar dinheiro; finish the work=terminar o trabalho; rest=descansar
stop|rest=descansar; avoid the danger=evitar o perigo; think again=pensar de novo
talk|solve the problem=resolver o problema; share {p} ideas=compartilhar {FP} ideias; build trust=construir confiança
throw|get rid of waste=livrar-se do lixo; win the game=vencer o jogo; make space=abrir espaço
turn|find the way=encontrar o caminho; change direction=mudar de direção; avoid the traffic=evitar o trânsito
wait|meet the team=encontrar a equipe; get a better price=conseguir um preço melhor; avoid mistakes=evitar erros
walk|stay in shape=manter a forma; clear {p} mind=clarear a mente; save money=economizar dinheiro
wash|remove the dirt=tirar a sujeira; stay healthy=manter a saúde; look clean=ficar limpo
learn|get a better job=conseguir um emprego melhor; help others=ajudar os outros; grow as a person=crescer como pessoa
remember|avoid mistakes=evitar erros; honor the past=honrar o passado; learn from it=aprender com isso
believe|stay motivated=manter-me motivado; keep going=seguir em frente; inspire others=inspirar os outros
realize|understand the situation=entender a situação; avoid the same mistake=evitar o mesmo erro; act in time=agir a tempo
notice|avoid problems=evitar problemas; improve the process=melhorar o processo; react quickly=reagir depressa
guess|save time=economizar tempo; test the idea=testar a ideia; find the answer=encontrar a resposta
doubt|avoid mistakes=evitar erros; check the facts=conferir os fatos; make sure it's true=garantir que é verdade
recognize|give credit=dar crédito; avoid confusion=evitar confusão; show respect=demonstrar respeito
consider|make the right choice=fazer a escolha certa; avoid risks=evitar riscos; understand the options=entender as opções
focus|finish the task=concluir a tarefa; avoid mistakes=evitar erros; reach the goal=alcançar a meta
memorize|pass the exam=passar na prova; save time=economizar tempo; speak with confidence=falar com confiança
analyze|find the cause=encontrar a causa; reduce the risk=reduzir o risco; make better decisions=tomar melhores decisões
solve|move forward=seguir em frente; save the project=salvar o projeto; help the client=ajudar o cliente
mean|show respect=demonstrar respeito; clarify the point=esclarecer o ponto; avoid confusion=evitar confusão
expect|prepare better=preparar-se melhor; avoid surprises=evitar surpresas; plan ahead=planejar com antecedência
predict|prepare for the future=preparar-se para o futuro; reduce the risk=reduzir o risco; plan the budget=planejar o orçamento
compare|choose the best option=escolher a melhor opção; save money=economizar dinheiro; see the difference=ver a diferença
judge|be fair=ser justo; make the right call=tomar a decisão certa; protect the team=proteger a equipe
blame|avoid responsibility=fugir da responsabilidade; explain the failure=explicar a falha; protect {p} image=proteger {F} imagem
praise|motivate the team=motivar a equipe; show appreciation=demonstrar apreço; encourage the effort=incentivar o esforço
criticize|improve the work=melhorar o trabalho; raise awareness=aumentar a conscientização; push for change=pressionar por mudança
approve|speed up the process=acelerar o processo; support the plan=apoiar o plano; start the project=começar o projeto
reject|avoid the risk=evitar o risco; protect the company=proteger a empresa; keep the standards=manter os padrões
support|help the team=ajudar a equipe; build trust=construir confiança; reach the goal=alcançar a meta
defend|protect the team=proteger a equipe; win the case=ganhar a causa; show the truth=mostrar a verdade
trust|build a strong team=formar uma equipe forte; avoid conflict=evitar conflito; feel safe=sentir-se seguro
forgive|move on=seguir em frente; keep the peace=manter a paz; heal the relationship=curar o relacionamento
prefer|save time=economizar tempo; avoid stress=evitar estresse; stay comfortable=manter-se confortável
disagree|protect {p} opinion=proteger {F} opinião; improve the plan=melhorar o plano; avoid a mistake=evitar um erro
ask|get help=obter ajuda; understand the problem=entender o problema; learn more=aprender mais
answer|solve the doubt=tirar a dúvida; help the client=ajudar o cliente; keep the conversation going=manter a conversa
explain|help them understand=ajudá-los a entender; avoid confusion=evitar confusão; share knowledge=compartilhar conhecimento
discuss|find a solution=encontrar uma solução; share opinions=compartilhar opiniões; make a decision=tomar uma decisão
create|improve society=melhorar a sociedade; minimize risks=minimizar riscos; innovate {p} products=inovar {MP} produtos
build|create a better future=criar um futuro melhor; serve {p} customers=atender {MP} clientes; grow the business=fazer o negócio crescer
design|solve a real problem=resolver um problema real; improve the experience=melhorar a experiência; attract more users=atrair mais usuários
plan|reach the goal=alcançar a meta; avoid problems=evitar problemas; save time=economizar tempo
organize|save time=economizar tempo; avoid confusion=evitar confusão; reach the goal=alcançar a meta
improve|reach better results=alcançar melhores resultados; satisfy {p} customers=satisfazer {MP} clientes; stay competitive=manter-se competitivo
develop|grow the business=fazer o negócio crescer; solve the problem=resolver o problema; create value=criar valor
manage|reach the goal=alcançar a meta; reduce the costs=reduzir os custos; lead the team=liderar a equipe
lead|inspire the team=inspirar a equipe; reach the goal=alcançar a meta; build trust=construir confiança
hire|grow the team=aumentar a equipe; improve the service=melhorar o serviço; fill the position=preencher a vaga
invest|grow {p} money=fazer o dinheiro crescer; secure the future=garantir o futuro; build wealth=construir patrimônio
study|pass the exam=passar na prova; get a better job=conseguir um emprego melhor; learn something new=aprender algo novo
practice|improve {p} skills=melhorar {FP} habilidades; speak with confidence=falar com confiança; reach fluency=alcançar fluência
test|find the errors=encontrar os erros; make sure it works=garantir que funciona; reduce the risk=reduzir o risco
update|fix the bugs=corrigir os erros; add new features=adicionar novos recursos; stay secure=manter-se seguro
open|let some air in=deixar o ar entrar; start the day=começar o dia; welcome the guests=receber os convidados
cook|feed {p} family=alimentar {F} família; save money=economizar dinheiro; try a new recipe=experimentar uma nova receita
fix|save money=economizar dinheiro; solve the problem=resolver o problema; make it work again=fazê-lo funcionar de novo
repair|save money=economizar dinheiro; make it work again=fazê-lo funcionar de novo; avoid waste=evitar desperdício
protect|keep them safe=mantê-los seguros; reduce the risk=reduzir o risco; preserve nature=preservar a natureza
help|support the team=apoiar a equipe; solve the problem=resolver o problema; make a difference=fazer a diferença
use|save time=economizar tempo; solve the problem=resolver o problema; improve the result=melhorar o resultado
try|find a better way=encontrar um jeito melhor; learn something new=aprender algo novo; reach the goal=alcançar a meta
start|reach the goal=alcançar a meta; make progress=fazer progresso; finish on time=terminar no prazo
finish|start the next project=começar o próximo projeto; relax=relaxar; meet the deadline=cumprir o prazo
complete|meet the deadline=cumprir o prazo; deliver the project=entregar o projeto; move on=seguir em frente
/* v115: lote 1 — finalidades curadas (96 verbos) */
arrive|meet the team=conhecer a equipe; start the meeting=começar a reunião; avoid delays=evitar atrasos
travel|visit {p} family=visitar {F} família; discover new places=descobrir novos lugares; close the deal=fechar o negócio
enter|join the team=integrar a equipe; see the exhibition=ver a exposição; start {p} career=começar {F} carreira
climb|enjoy the view=aproveitar a vista; reach the top=chegar ao topo; challenge {p} limits=desafiar {MP} limites
jump|catch the ball=pegar a bola; cross the gap=atravessar o vão; stay in shape=manter a forma
swim|stay in shape=manter a forma; relax {p} body=relaxar {M} corpo; cross the lake=atravessar o lago
move|find a better job=encontrar um emprego melhor; live near the family=morar perto da família; start a new life=começar uma nova vida
escape|avoid danger=evitar o perigo; clear {p} mind=clarear {F} mente; find some peace=encontrar um pouco de paz
park|avoid the traffic=evitar o trânsito; save time=economizar tempo; enter the building=entrar no prédio
reach|finish the project=terminar o projeto; get the results=obter os resultados; help the team=ajudar a equipe
explore|learn new things=aprender coisas novas; find better options=encontrar opções melhores; understand the market=entender o mercado
guide|help the team=ajudar a equipe; avoid mistakes=evitar erros; show the way=mostrar o caminho
train|improve {p} skills=melhorar {FP} habilidades; win the match=vencer a partida; stay in shape=manter a forma
compete|win the prize=ganhar o prêmio; prove {p} skills=provar {FP} habilidades; reach the final=chegar à final
lift|build strength=ganhar força; move the box=mover a caixa; improve {p} health=melhorar {F} saúde
calculate|check the results=conferir os resultados; avoid mistakes=evitar erros; plan the budget=planejar o orçamento
measure|check the size=conferir o tamanho; avoid mistakes=evitar erros; track the progress=acompanhar o progresso
estimate|plan the budget=planejar o orçamento; avoid surprises=evitar surpresas; set a deadline=definir um prazo
spend|enjoy the trip=aproveitar a viagem; support the family=sustentar a família; invest in the future=investir no futuro
order|try the new dish=experimentar o prato novo; save time=economizar tempo; feed the team=alimentar a equipe
lend|help a friend=ajudar um amigo; support the project=apoiar o projeto; solve the problem=resolver o problema
deliver|meet the deadline=cumprir o prazo; satisfy the client=satisfazer o cliente; show the results=mostrar os resultados
rent|save money=economizar dinheiro; live near the office=morar perto do escritório; test the area=testar a região
donate|help the community=ajudar a comunidade; support the cause=apoiar a causa; make a difference=fazer a diferença
negotiate|close the deal=fechar o negócio; reduce the price=reduzir o preço; reach an agreement=chegar a um acordo
schedule|avoid conflicts=evitar conflitos; organize the week=organizar a semana; meet the deadline=cumprir o prazo
apply|get the job=conseguir o emprego; join the program=entrar no programa; improve {p} future=melhorar {M} futuro
present|show the results=mostrar os resultados; convince the client=convencer o cliente; share the plan=compartilhar o plano
produce|meet the demand=atender à demanda; reduce costs=reduzir custos; increase the profit=aumentar o lucro
launch|reach new clients=alcançar novos clientes; grow the business=expandir o negócio; test the market=testar o mercado
prepare|avoid mistakes=evitar erros; meet the deadline=cumprir o prazo; gain confidence=ganhar confiança
review|find mistakes=encontrar erros; improve the quality=melhorar a qualidade; check the details=conferir os detalhes
recruit|build a strong team=formar uma equipe forte; fill the position=preencher a vaga; grow the company=expandir a empresa
install|fix the problem=resolver o problema; update the system=atualizar o sistema; improve the speed=melhorar a velocidade
delete|free up space=liberar espaço; remove old data=remover dados antigos; avoid confusion=evitar confusão
search|find the answer=encontrar a resposta; save time=economizar tempo; learn more=aprender mais
print|share the document=compartilhar o documento; keep a copy=guardar uma cópia; study offline=estudar offline
record|keep the memory=guardar a lembrança; review it later=revisá-lo depois; share the moment=compartilhar o momento
copy|keep a backup=guardar um backup; save time=economizar tempo; share the file=compartilhar o arquivo
filter|find the data=encontrar os dados; remove the noise=remover o ruído; save time=economizar tempo
sort|find things faster=encontrar as coisas mais rápido; organize the data=organizar os dados; save time=economizar tempo
automate|save time=economizar tempo; reduce errors=reduzir erros; cut costs=cortar custos
process|get the results=obter os resultados; clean the data=limpar os dados; speed up the work=acelerar o trabalho
monitor|track the progress=acompanhar o progresso; detect problems=detectar problemas; avoid risks=evitar riscos
bake|surprise the family=surpreender a família; sell at the market=vender na feira; celebrate the day=comemorar o dia
boil|cook the pasta=cozinhar o macarrão; kill the germs=eliminar os germes; prepare the soup=preparar a sopa
mix|create a new flavor=criar um novo sabor; prepare the sauce=preparar o molho; combine the colors=combinar as cores
serve|please the guests=agradar aos convidados; feed the family=alimentar a família; start the dinner=começar o jantar
feed|keep the baby healthy=manter o bebê saudável; help the animals=ajudar os animais; give energy=dar energia
wake|start the day early=começar o dia cedo; catch the train=pegar o trem; exercise before work=treinar antes do trabalho
dress|look professional=parecer profissional; protect the body=proteger o corpo; make a good impression=causar uma boa impressão
brush|keep the teeth healthy=manter os dentes saudáveis; remove the dust=remover a poeira; look neat=ficar bem arrumado
pack|travel light=viajar leve; avoid forgetting things=evitar esquecer as coisas; protect the items=proteger os itens
paint|decorate the room=decorar o quarto; express {p} ideas=expressar {FP} ideias; renew the house=renovar a casa
assemble|finish the furniture=terminar o móvel; build the model=montar o modelo; save money=economizar dinheiro
translate|help the client=ajudar o cliente; share the idea=compartilhar a ideia; reach more people=alcançar mais pessoas
edit|improve the text=melhorar o texto; fix the mistakes=corrigir os erros; make it clearer=torná-lo mais claro
correct|fix the mistakes=consertar os erros; improve the result=melhorar o resultado; avoid confusion=evitar confusão
publish|share {p} ideas=compartilhar {FP} ideias; reach more readers=alcançar mais leitores; build {p} name=construir {M} nome
listen|understand the problem=entender o problema; learn something new=aprender algo novo; help a friend=ajudar um amigo
watch|learn from the experts=aprender com os especialistas; relax after work=relaxar depois do trabalho; follow the news=acompanhar as notícias
treat|cure the disease=curar a doença; relieve the pain=aliviar a dor; help the patient=ajudar o paciente
recover|return to normal=voltar ao normal; return to work=voltar ao trabalho; heal the injury=curar a lesão
plant|grow food=cultivar alimentos; help the environment=ajudar o meio ambiente; beautify the garden=embelezar o jardim
recycle|protect the environment=proteger o meio ambiente; reduce waste=reduzir o desperdício; save resources=economizar recursos
invite|meet new people=conhecer novas pessoas; celebrate the day=comemorar o dia; thank the team=agradecer à equipe
celebrate|thank the team=agradecer à equipe; mark the achievement=marcar a conquista; enjoy the moment=aproveitar o momento
relax|reduce stress=reduzir o estresse; recover energy=recuperar a energia; clear {p} mind=clarear {F} mente
sign|close the deal=fechar o negócio; confirm the agreement=confirmar o acordo; start the contract=iniciar o contrato
vote|choose a leader=escolher um líder; change the system=mudar o sistema; defend {p} opinion=defender {F} opinião
change|improve the result=melhorar o resultado; fix the problem=resolver o problema; try something new=tentar algo novo
increase|reach the goal=alcançar a meta; improve the profit=melhorar o lucro; grow the business=expandir o negócio
reduce|save money=economizar dinheiro; avoid waste=evitar o desperdício; lower the risk=diminuir o risco
replace|fix the problem=resolver o problema; improve the system=melhorar o sistema; avoid delays=evitar atrasos
adapt|survive the change=sobreviver à mudança; meet the new demand=atender à nova demanda; solve the problem=resolver o problema
offer|help the client=ajudar o cliente; close the deal=fechar o negócio; show interest=demonstrar interesse
accept|join the team=integrar a equipe; close the deal=fechar o negócio; move forward=seguir em frente
receive|collect the package=retirar o pacote; learn the news=saber da notícia; start the process=iniciar o processo
provide|help the team=ajudar a equipe; meet the need=atender à necessidade; support the project=apoiar o projeto
exchange|get a better size=conseguir um tamanho melhor; share ideas=compartilhar ideias; learn the language=aprender o idioma
hide|avoid danger=evitar o perigo; keep it secret=mantê-lo em segredo; surprise the family=surpreender a família
seek|find a solution=encontrar uma solução; get advice=obter conselhos; improve {p} life=melhorar {F} vida
ignore|avoid conflict=evitar conflito; stay focused=manter o foco; save energy=economizar energia
discover|know the truth=saber a verdade; find a solution=encontrar uma solução; open new doors=abrir novas portas
confirm|avoid doubts=evitar dúvidas; check the details=conferir os detalhes; close the deal=fechar o negócio
apologize|fix the relationship=consertar o relacionamento; show respect=demonstrar respeito; avoid conflict=evitar conflito
convince|win the client=conquistar o cliente; change the decision=mudar a decisão; get support=obter apoio
encourage|motivate the team=motivar a equipe; help a friend=ajudar um amigo; build confidence=construir confiança
inform|keep the team updated=manter a equipe atualizada; avoid surprises=evitar surpresas; share the news=compartilhar a notícia
remind|avoid forgetting=evitar o esquecimento; keep the plan=manter o plano; meet the deadline=cumprir o prazo
request|get approval=obter aprovação; solve the problem=resolver o problema; start the process=iniciar o processo
clarify|avoid confusion=evitar confusão; help the team=ajudar a equipe; explain the point=explicar o ponto
avoid|reduce the risk=reduzir o risco; save time=economizar tempo; keep the peace=manter a paz
remove|fix the problem=resolver o problema; free up space=liberar espaço; clean the data=limpar os dados
optimize|save time=economizar tempo; improve the performance=melhorar o desempenho; cut costs=cortar custos
configure|fix the problem=resolver o problema; improve the speed=melhorar a velocidade; protect the data=proteger os dados
/* v116: lote 2 — finalidades curadas (114 verbos) */
yell|get attention=chamar a atenção; warn the others=avisar os outros; be heard=ser ouvido
shout|get attention=chamar a atenção; cheer the team=torcer pela equipe; warn the others=avisar os outros
warn|avoid accidents=evitar acidentes; protect the team=proteger a equipe; prevent mistakes=prevenir erros
complain|improve the service=melhorar o serviço; solve the problem=resolver o problema; get a refund=obter um reembolso
describe|help others understand=ajudar os outros a entender; share the experience=compartilhar a experiência; avoid confusion=evitar confusão
express|share {p} feelings=compartilhar {FP} emoções; be understood=ser compreendido; build trust=construir confiança
greet|show respect=demonstrar respeito; make a good impression=causar uma boa impressão; welcome the guests=receber os convidados
thank|show gratitude=demonstrar gratidão; build a good relationship=construir um bom relacionamento; recognize the effort=reconhecer o esforço
interrupt|ask a question=fazer uma pergunta; correct a mistake=corrigir um erro; share an idea=compartilhar uma ideia
interview|choose the best candidate=escolher o melhor candidato; learn more about the person=saber mais sobre a pessoa; fill the position=preencher a vaga
communicate|share ideas=compartilhar ideias; avoid misunderstandings=evitar mal-entendidos; coordinate the team=coordenar a equipe
share|help others=ajudar os outros; spread the news=divulgar a notícia; build trust=construir confiança
comfort|calm a friend=acalmar um amigo; show support=demonstrar apoio; relieve the pain=aliviar a dor
hug|show affection=demonstrar carinho; comfort a friend=consolar um amigo; say goodbye=dizer adeus
welcome|make the guests comfortable=deixar os convidados confortáveis; start the event=iniciar o evento; show hospitality=demonstrar hospitalidade
inspire|motivate the team=motivar a equipe; change lives=mudar vidas; spread hope=espalhar esperança
surprise|make a friend happy=deixar um amigo feliz; celebrate the day=comemorar o dia; break the routine=quebrar a rotina
chase|catch the thief=pegar o ladrão; reach the goal=alcançar a meta; win the race=vencer a corrida
kick|score a goal=marcar um gol; pass the ball=passar a bola; open the door=abrir a porta
score|win the match=vencer a partida; help the team=ajudar a equipe; break the record=quebrar o recorde
shoot|score a goal=marcar um gol; win the game=vencer o jogo; take a photo=tirar uma foto
hit|score a point=marcar um ponto; reach the target=atingir o alvo; win the point=ganhar o ponto
beat|win the title=conquistar o título; prove {p} value=provar {M} valor; reach the final=chegar à final
cheer|support the team=apoiar a equipe; encourage the players=encorajar os jogadores; enjoy the game=aproveitar o jogo
add|improve the recipe=melhorar a receita; complete the list=completar a lista; get the total=obter o total
divide|share the cost=dividir o custo; organize the work=organizar o trabalho; solve the problem=resolver o problema
convert|change the format=mudar o formato; save space=economizar espaço; share the file=compartilhar o arquivo
charge|cover the costs=cobrir os custos; make a profit=obter lucro; pay the bills=pagar as contas
refund|satisfy the client=satisfazer o cliente; fix the mistake=consertar o erro; keep the trust=manter a confiança
withdraw|pay the bills=pagar as contas; buy groceries=comprar mantimentos; avoid fees=evitar taxas
deposit|save money=economizar dinheiro; pay the debt=pagar a dívida; build a reserve=formar uma reserva
fire|reduce costs=reduzir custos; improve the team=melhorar a equipe; solve the problem=resolver o problema
resign|start a new career=começar uma nova carreira; take a break=dar uma pausa; avoid conflict=evitar conflito
promote|reward the effort=recompensar o esforço; motivate the team=motivar a equipe; sell more=vender mais
attend|learn something new=aprender algo novo; meet people=conhecer pessoas; support a friend=apoiar um amigo
delegate|save time=economizar tempo; focus on priorities=focar nas prioridades; develop the team=desenvolver a equipe
supervise|ensure quality=garantir a qualidade; avoid mistakes=evitar erros; help the team=ajudar a equipe
collaborate|solve the problem=resolver o problema; share knowledge=compartilhar conhecimento; deliver better results=entregar melhores resultados
achieve|reach the goal=alcançar a meta; make progress=fazer progresso; prove {p} value=provar {M} valor
operate|run the machine=operar a máquina; keep things working=manter as coisas funcionando; serve the clients=atender os clientes
cancel|avoid extra costs=evitar custos extras; change the plan=mudar o plano; save money=economizar dinheiro
submit|meet the deadline=cumprir o prazo; get approval=obter aprovação; send the application=enviar a candidatura
type|write the report=escrever o relatório; answer the message=responder à mensagem; finish the work=terminar o trabalho
download|read it offline=lê-lo offline; save time=economizar tempo; use the app=usar o aplicativo
upload|share the file=compartilhar o arquivo; keep a backup=guardar um backup; send the work=enviar o trabalho
code|build the app=criar o aplicativo; solve the problem=resolver o problema; automate the work=automatizar o trabalho
connect|share the data=compartilhar os dados; join the meeting=entrar na reunião; link the devices=ligar os dispositivos
browse|find information=encontrar informações; compare prices=comparar preços; kill time=passar o tempo
stream|watch the game=assistir ao jogo; reach more people=alcançar mais pessoas; share the event=compartilhar o evento
encrypt|protect the data=proteger os dados; keep it private=mantê-lo privado; prevent leaks=evitar vazamentos
debug|fix the error=corrigir o erro; improve the code=melhorar o código; save time=economizar tempo
post|share the news=compartilhar a notícia; reach more people=alcançar mais pessoas; promote the brand=divulgar a marca
press|start the machine=ligar a máquina; send the message=enviar a mensagem; confirm the choice=confirmar a escolha
fry|cook the fish=cozinhar o peixe; make the meal crunchy=deixar a refeição crocante; prepare lunch=preparar o almoço
chop|prepare the salad=preparar a salada; save cooking time=economizar tempo de preparo; mix the flavors=misturar os sabores
slice|serve the cake=servir o bolo; make a sandwich=fazer um sanduíche; share the pizza=dividir a pizza
peel|prepare the fruit=preparar a fruta; remove the skin=remover a casca; cook the potatoes=cozinhar as batatas
pour|serve the drink=servir a bebida; fill the glass=encher o copo; water the plants=regar as plantas
stir|mix the sauce=misturar o molho; avoid burning it=evitar queimá-lo; blend the flavors=combinar os sabores
taste|check the flavor=conferir o sabor; fix the recipe=ajustar a receita; enjoy the meal=aproveitar a refeição
grill|cook the meat=cozinhar a carne; enjoy the weekend=aproveitar o fim de semana; feed the guests=alimentar os convidados
season|improve the flavor=melhorar o sabor; finish the dish=finalizar o prato; please the guests=agradar aos convidados
chew|digest the food=digerir a comida; enjoy the flavor=aproveitar o sabor; avoid choking=evitar engasgos
melt|make the sauce=preparar o molho; soften the butter=amolecer a manteiga; prepare the dessert=preparar a sobremesa
squeeze|make the juice=fazer o suco; remove the water=remover a água; flavor the dish=temperar o prato
tidy|find things easily=encontrar as coisas com facilidade; welcome the guests=receber os convidados; make the home neat=deixar a casa arrumada
rest|recover energy=recuperar a energia; relax {p} mind=relaxar {F} mente; avoid exhaustion=evitar o esgotamento
fold|save space=economizar espaço; keep the clothes neat=manter as roupas arrumadas; pack the bag=arrumar a mala
decorate|welcome the guests=receber os convidados; celebrate the holiday=comemorar o feriado; renew the room=renovar o quarto
water|help the plants grow=ajudar as plantas a crescer; keep the garden alive=manter o jardim vivo; save the flowers=salvar as flores
light|see in the dark=enxergar no escuro; create a cozy mood=criar um clima aconchegante; start the fire=acender o fogo
sew|fix the clothes=consertar as roupas; make a dress=fazer um vestido; save money=economizar dinheiro
shape|create a model=criar um modelo; improve the design=melhorar o design; fit the space=caber no espaço
dig|plant a tree=plantar uma árvore; find water=encontrar água; build the foundation=construir a fundação
shake|mix the drink=misturar a bebida; remove the dust=tirar a poeira; wake the baby=acordar o bebê
pronounce|be understood=ser compreendido; sound natural=soar natural; improve {p} speaking=melhorar {F} fala
spell|avoid mistakes=evitar erros; be understood=ser compreendido; write the name correctly=escrever o nome corretamente
quote|support the argument=apoiar o argumento; give credit=dar crédito; make the point clear=deixar o ponto claro
research|find reliable data=encontrar dados confiáveis; support the idea=apoiar a ideia; learn the facts=conhecer os fatos
examine|find the cause=encontrar a causa; check the quality=conferir a qualidade; make a diagnosis=fazer um diagnóstico
summarize|save time=economizar tempo; share the key points=compartilhar os pontos principais; help the team=ajudar a equipe
highlight|show the key points=mostrar os pontos principais; study faster=estudar mais rápido; draw attention=chamar a atenção
draft|organize the ideas=organizar as ideias; start the project=iniciar o projeto; get feedback=receber retorno
hear|understand the message=entender a mensagem; learn the news=saber da notícia; enjoy the music=aproveitar a música
diagnose|find the cause=encontrar a causa; choose the treatment=escolher o tratamento; help the patient=ajudar o paciente
harvest|feed the family=alimentar a família; sell at the market=vender na feira; store food=estocar alimentos
burn|keep warm=manter o calor; cook the meal=cozinhar a refeição; get rid of the trash=descartar o lixo
freeze|keep the food fresh=manter a comida fresca; save leftovers=guardar as sobras; preserve the taste=preservar o sabor
survive|protect the family=proteger a família; face the challenge=enfrentar o desafio; reach safety=chegar a um lugar seguro
sing|entertain the guests=entreter os convidados; express {p} feelings=expressar {FP} emoções; calm the baby=acalmar o bebê
dance|celebrate the night=comemorar a noite; stay in shape=manter a forma; enjoy the party=curtir a festa
perform|entertain the audience=entreter o público; show {p} talent=mostrar {M} talento; earn a living=ganhar a vida
film|record the event=gravar o evento; tell a story=contar uma história; share the moment=compartilhar o momento
photograph|keep the memory=guardar a lembrança; show the product=mostrar o produto; tell a story=contar uma história
entertain|please the guests=agradar aos convidados; make people laugh=fazer as pessoas rirem; keep the kids busy=manter as crianças ocupadas
gather|share the news=compartilhar a notícia; plan the event=planejar o evento; collect the data=reunir os dados
forbid|protect the children=proteger as crianças; avoid accidents=evitar acidentes; keep the order=manter a ordem
allow|help the team=ajudar a equipe; save time=economizar tempo; give more freedom=dar mais liberdade
require|ensure quality=garantir a qualidade; avoid mistakes=evitar erros; follow the rules=seguir as regras
ban|protect the public=proteger o público; stop the problem=impedir o problema; enforce the rules=fazer cumprir as regras
declare|make it official=oficializá-lo; share the decision=compartilhar a decisão; avoid doubts=evitar dúvidas
continue|finish the project=terminar o projeto; reach the goal=alcançar a meta; keep the progress=manter o progresso
expand|reach new markets=alcançar novos mercados; grow the business=expandir o negócio; hire more people=contratar mais pessoas
own|control the business=controlar o negócio; build wealth=construir patrimônio; protect {p} future=proteger {M} futuro
gain|improve {p} skills=melhorar {FP} habilidades; build experience=ganhar experiência; reach the goal=alcançar a meta
steal|feed the family=alimentar a família; get money=conseguir dinheiro; survive=sobreviver
wish|inspire others=inspirar os outros; show care=demonstrar carinho; share good news=compartilhar boas notícias
concentrate|finish the task=terminar a tarefa; avoid mistakes=evitar erros; improve the results=melhorar os resultados
identify|solve the problem=resolver o problema; find the cause=encontrar a causa; avoid mistakes=evitar erros
verify|avoid mistakes=evitar erros; confirm the facts=confirmar os fatos; ensure quality=garantir a qualidade
define|set the goals=definir as metas; avoid confusion=evitar confusão; guide the team=guiar a equipe
prove|convince the client=convencer o cliente; support the idea=apoiar a ideia; win the argument=ganhar a discussão
advise|help the client=ajudar o cliente; avoid mistakes=evitar erros; guide the decision=orientar a decisão
persuade|win support=obter apoio; change the decision=mudar a decisão; close the deal=fechar o negócio
/* v118: lote 3 — finalidades curadas (141 verbos) */
accuse|protect the truth=proteger a verdade; defend the victim=defender a vítima; demand justice=exigir justiça
evaluate|measure the results=medir os resultados; improve the process=melhorar o processo; choose the best option=escolher a melhor opção
recommend|help the client=ajudar o cliente; share a good option=compartilhar uma boa opção; avoid mistakes=evitar erros
mention|remind the team=lembrar a equipe; add a detail=acrescentar um detalhe; support the point=apoiar o ponto
announce|share the news=compartilhar a notícia; inform the public=informar o público; launch the project=lançar o projeto
argue|defend {p} idea=defender {F} ideia; change the decision=mudar a decisão; prove the point=provar o ponto
suggest|help the team=ajudar a equipe; offer a solution=oferecer uma solução; improve the plan=melhorar o plano
report|inform the manager=informar o gerente; share the results=compartilhar os resultados; record the problem=registrar o problema
whisper|keep it secret=mantê-lo em segredo; avoid waking the baby=evitar acordar o bebê; share a secret=compartilhar um segredo
promise|build trust=construir confiança; calm a friend=acalmar um amigo; guarantee the result=garantir o resultado
care|help the family=ajudar a família; protect the children=proteger as crianças; show love=demonstrar amor
laugh|relieve the stress=aliviar o estresse; cheer up a friend=animar um amigo; enjoy the moment=aproveitar o momento
cry|release the pain=aliviar a dor; ask for help=pedir ajuda; get attention=chamar a atenção
smile|show kindness=demonstrar gentileza; welcome the guests=receber os convidados; make a good impression=causar uma boa impressão
fly|save time=economizar tempo; visit the family=visitar a família; reach the city=chegar à cidade
depart|catch the flight=pegar o voo; avoid the traffic=evitar o trânsito; arrive on time=chegar na hora
board|catch the flight=pegar o voo; start the trip=iniciar a viagem; find {p} seat=encontrar {M} assento
land|end the flight=encerrar o voo; start the vacation=começar as férias; meet the family=encontrar a família
stretch|relax the muscles=relaxar os músculos; avoid injuries=evitar lesões; improve flexibility=melhorar a flexibilidade
dive|explore the sea=explorar o mar; see the fish=ver os peixes; train {p} breathing=treinar {F} respiração
subtract|find the difference=encontrar a diferença; check the balance=conferir o saldo; solve the problem=resolver o problema
multiply|find the total=encontrar o total; grow the profit=aumentar o lucro; solve the equation=resolver a equação
round|simplify the number=simplificar o número; make an estimate=fazer uma estimativa; ease the calculation=facilitar o cálculo
plot|show the trend=mostrar a tendência; explain the data=explicar os dados; compare the results=comparar os resultados
rank|compare the options=comparar as opções; choose the best one=escolher o melhor; show the order=mostrar a ordem
earn|support the family=sustentar a família; pay the bills=pagar as contas; save for the future=economizar para o futuro
waste|relax a little=relaxar um pouco; kill time=passar o tempo; test the limits=testar os limites
scan|find the error=encontrar o erro; save the document=salvar o documento; check the code=conferir o código
paste|add the text=acrescentar o texto; save time=economizar tempo; complete the document=completar o documento
spread|share the news=divulgar a notícia; cover the bread=cobrir o pão; reach more people=alcançar mais pessoas
lock|protect the house=proteger a casa; keep it safe=mantê-lo seguro; avoid theft=evitar roubos
sweep|clean the floor=limpar o chão; remove the dust=remover a poeira; welcome the guests=receber os convidados
hang|dry the clothes=secar as roupas; decorate the wall=decorar a parede; save space=economizar espaço
wipe|clean the table=limpar a mesa; remove the dust=remover a poeira; dry the surface=secar a superfície
tie|keep it in place=mantê-lo no lugar; secure the bag=prender a bolsa; finish the package=finalizar o pacote
stick|fix the label=fixar a etiqueta; keep the paper in place=manter o papel no lugar; finish the poster=finalizar o cartaz
tear|open the package=abrir o pacote; remove the page=remover a página; get the paper=pegar o papel
breathe|stay calm=manter a calma; relax {p} body=relaxar {M} corpo; get more oxygen=obter mais oxigênio
sweat|cool the body=resfriar o corpo; lose weight=perder peso; burn calories=queimar calorias
touch|feel the texture=sentir a textura; show affection=demonstrar carinho; test the surface=testar a superfície
collect|build a collection=formar uma coleção; save memories=guardar lembranças; get the data=obter os dados
obey|avoid problems=evitar problemas; keep the peace=manter a paz; follow the rules=seguir as regras
arrest|stop the crime=impedir o crime; protect the public=proteger o público; enforce the law=fazer cumprir a lei
elect|choose a leader=escolher um líder; change the future=mudar o futuro; represent the people=representar o povo
govern|keep the order=manter a ordem; serve the people=servir o povo; improve the country=melhorar o país
punish|teach a lesson=ensinar uma lição; keep the order=manter a ordem; prevent new mistakes=prevenir novos erros
comply|avoid fines=evitar multas; follow the law=seguir a lei; protect the company=proteger a empresa
decrease|save money=economizar dinheiro; reduce the risk=reduzir o risco; lower the cost=baixar o custo
end|start something new=começar algo novo; avoid more losses=evitar mais perdas; close the chapter=encerrar o capítulo
adjust|improve the fit=melhorar o ajuste; fix the problem=resolver o problema; get better results=obter melhores resultados
refuse|protect {p} time=proteger {M} tempo; avoid trouble=evitar problemas; keep {p} principles=manter {MP} princípios
assume|take the lead=assumir a liderança; save time=economizar tempo; move the project forward=fazer o projeto avançar
interpret|explain the data=explicar os dados; understand the message=entender a mensagem; help the client=ajudar o cliente
reflect|learn from the experience=aprender com a experiência; improve the future=melhorar o futuro; understand the problem=entender o problema
reconsider|avoid a mistake=evitar um erro; improve the plan=melhorar o plano; make a better choice=fazer uma escolha melhor
recall|remember the details=lembrar os detalhes; tell the story=contar a história; avoid mistakes=evitar erros
conclude|finish the meeting=encerrar a reunião; summarize the idea=resumir a ideia; make a decision=tomar uma decisão
hesitate|think it through=pensar bem; avoid a mistake=evitar um erro; gain time=ganhar tempo
determine|set the goal=definir a meta; find the cause=encontrar a causa; choose the path=escolher o caminho
deny|protect {p} image=proteger {F} imagem; avoid blame=evitar a culpa; keep it secret=mantê-lo em segredo
admit|fix the mistake=consertar o erro; build trust=construir confiança; move forward=seguir em frente
applaud|show respect=demonstrar respeito; encourage the team=encorajar a equipe; celebrate the result=celebrar o resultado
appreciate|show gratitude=demonstrar gratidão; value the effort=valorizar o esforço; build a good relationship=construir um bom relacionamento
endorse|support the idea=apoiar a ideia; build trust=construir confiança; promote the product=divulgar o produto
reply|answer the question=responder à pergunta; keep the contact=manter o contato; solve the problem=resolver o problema
respond|answer the client=atender o cliente; solve the problem=resolver o problema; avoid delays=evitar atrasos
insist|defend {p} idea=defender {F} ideia; get the result=obter o resultado; avoid a mistake=evitar um erro
claim|get the prize=receber o prêmio; defend {p} rights=defender {MP} direitos; prove the point=provar o ponto
confess|clear {p} conscience=aliviar {F} consciência; fix the mistake=consertar o erro; build trust=construir confiança
discourage|avoid risk=evitar risco; stop bad habits=impedir maus hábitos; protect a friend=proteger um amigo
congratulate|celebrate the win=comemorar a vitória; show respect=demonstrar respeito; motivate the team=motivar a equipe
notify|inform the team=informar a equipe; avoid surprises=evitar surpresas; confirm the change=confirmar a mudança
demand|get a response=obter uma resposta; defend {p} rights=defender {MP} direitos; improve the service=melhorar o serviço
address|solve the problem=resolver o problema; answer the question=responder à pergunta; start the discussion=iniciar a discussão
emphasize|make the point clear=deixar o ponto claro; draw attention=chamar a atenção; help others remember=ajudar os outros a lembrar
calm|reduce the stress=reduzir o estresse; help a friend=ajudar um amigo; avoid conflict=evitar conflito
please|satisfy the client=satisfazer o cliente; make a friend happy=deixar um amigo feliz; win support=conquistar apoio
impress|win the client=conquistar o cliente; get the job=conseguir o emprego; make a good impression=causar uma boa impressão
wander|clear {p} mind=clarear {F} mente; discover the city=descobrir a cidade; kill some time=passar o tempo
march|support the cause=apoiar a causa; defend {p} rights=defender {MP} direitos; reach the square=chegar à praça
slide|reach the base=chegar à base; save time=economizar tempo; avoid the obstacle=evitar o obstáculo
stroll|relax after dinner=relaxar depois do jantar; enjoy the city=aproveitar a cidade; clear {p} mind=clarear {F} mente
skate|stay in shape=manter a forma; enjoy the ride=curtir o passeio; practice new tricks=praticar novas manobras
ski|enjoy the snow=aproveitar a neve; stay in shape=manter a forma; spend time with friends=passar tempo com amigos
sail|cross the ocean=atravessar o oceano; enjoy the sea=aproveitar o mar; reach the island=chegar à ilha
row|stay in shape=manter a forma; cross the lake=atravessar o lago; train the arms=treinar os braços
migrate|find a better life=encontrar uma vida melhor; escape the cold=escapar do frio; look for food=procurar comida
retreat|avoid a loss=evitar uma perda; protect the team=proteger a equipe; plan a new attack=planejar um novo ataque
advance|reach the goal=alcançar a meta; win the match=vencer a partida; make progress=fazer progresso
cycle|stay in shape=manter a forma; avoid the traffic=evitar o trânsito; save money=economizar dinheiro
coach|improve the team=melhorar a equipe; develop the players=desenvolver os jogadores; win the title=conquistar o título
exercise|stay in shape=manter a forma; lose weight=perder peso; improve {p} health=melhorar {F} saúde
balance|keep the control=manter o controle; avoid falling=evitar cair; organize the budget=organizar o orçamento
integrate|connect the systems=conectar os sistemas; join the team=integrar a equipe; save time=economizar tempo
simplify|save time=economizar tempo; avoid confusion=evitar confusão; help the user=ajudar o usuário
shop|buy a gift=comprar um presente; find a bargain=encontrar uma pechincha; get the groceries=comprar mantimentos
borrow|save money=economizar dinheiro; finish the project=terminar o projeto; start the business=abrir o negócio
budget|control the spending=controlar os gastos; save money=economizar dinheiro; plan the year=planejar o ano
import|bring new products=trazer novos produtos; reduce costs=reduzir custos; load the data=carregar os dados
export|sell abroad=vender no exterior; grow the business=expandir o negócio; share the data=compartilhar os dados
sponsor|support the event=apoiar o evento; promote the brand=divulgar a marca; help the team=ajudar a equipe
finance|start the business=abrir o negócio; support the project=apoiar o projeto; buy the house=comprar a casa
profit|grow the business=expandir o negócio; reward the investors=recompensar os investidores; reinvest in the company=reinvestir na empresa
price|attract clients=atrair clientes; cover the costs=cobrir os custos; compete in the market=competir no mercado
discount|attract clients=atrair clientes; sell more=vender mais; clear the stock=liquidar o estoque
bill|collect the payment=cobrar o pagamento; cover the costs=cobrir os custos; keep the records=manter os registros
employ|grow the team=ampliar a equipe; fill the position=preencher a vaga; support the community=apoiar a comunidade
coordinate|organize the team=organizar a equipe; avoid conflicts=evitar conflitos; meet the deadline=cumprir o prazo
consult|get expert advice=obter conselho de especialistas; avoid mistakes=evitar erros; make a good decision=tomar uma boa decisão
assign|share the work=dividir o trabalho; develop the team=desenvolver a equipe; meet the deadline=cumprir o prazo
assist|help the client=ajudar o cliente; save time=economizar tempo; support the team=apoiar a equipe
represent|defend the client=defender o cliente; speak for the team=falar pela equipe; protect the interests=proteger os interesses
merge|reduce costs=reduzir custos; grow the company=expandir a empresa; reach more clients=alcançar mais clientes
file|keep the records=manter os registros; find it later=encontrá-lo depois; organize the documents=organizar os documentos
appoint|fill the position=preencher a vaga; lead the project=liderar o projeto; improve the team=melhorar a equipe
audit|find errors=encontrar erros; ensure compliance=garantir a conformidade; protect the company=proteger a empresa
forecast|plan the budget=planejar o orçamento; reduce risk=reduzir o risco; prepare for the year=preparar o ano
allocate|use the budget well=usar bem o orçamento; support the project=apoiar o projeto; avoid waste=evitar desperdício
outsource|reduce costs=reduzir custos; save time=economizar tempo; focus on the core business=focar no negócio principal
diversify|reduce risk=reduzir o risco; grow the business=expandir o negócio; reach new markets=alcançar novos mercados
prioritize|save time=economizar tempo; meet the deadline=cumprir o prazo; focus on what matters=focar no que importa
handle|solve the problem=resolver o problema; help the client=ajudar o cliente; avoid delays=evitar atrasos
compile|run the program=executar o programa; check the code=conferir o código; build the app=gerar o aplicativo
deploy|launch the app=lançar o aplicativo; reach the users=alcançar os usuários; fix the bug=corrigir o erro
log|track the errors=rastrear os erros; keep a record=manter um registro; find the problem=encontrar o problema
restore|recover the data=recuperar os dados; fix the system=consertar o sistema; return to the previous version=voltar à versão anterior
format|organize the text=organizar o texto; improve the look=melhorar a aparência; clean the disk=limpar o disco
refresh|see the new data=ver os novos dados; fix the page=consertar a página; update the screen=atualizar a tela
sync|keep the files updated=manter os arquivos atualizados; avoid conflicts=evitar conflitos; share the data=compartilhar os dados
store|save space=economizar espaço; protect the data=proteger os dados; find it later=encontrá-lo depois
load|open the page=abrir a página; start the app=iniciar o aplicativo; show the data=mostrar os dados
forward|share the message=compartilhar a mensagem; inform the team=informar a equipe; save time=economizar tempo
subscribe|get the news=receber as novidades; support the creator=apoiar o criador; access the content=acessar o conteúdo
tag|find it later=encontrá-lo depois; organize the files=organizar os arquivos; notify the team=notificar a equipe
authenticate|protect the account=proteger a conta; confirm {p} identity=confirmar {F} identidade; avoid fraud=evitar fraudes
customize|fit the client=atender o cliente; improve the experience=melhorar a experiência; save time=economizar tempo
classify|organize the data=organizar os dados; find it faster=encontrá-lo mais rápido; avoid confusion=evitar confusão
insert|add the data=acrescentar os dados; complete the form=completar o formulário; update the table=atualizar a tabela
attach|share the file=compartilhar o arquivo; support the message=apoiar a mensagem; send the proof=enviar o comprovante
track|follow the progress=acompanhar o progresso; find the package=encontrar o pacote; avoid delays=evitar atrasos
detect|find the error=encontrar o erro; avoid risks=evitar riscos; protect the system=proteger o sistema
/* v119: lote 4 — finalidades curadas (121 verbos) */
demonstrate|prove the point=provar o ponto; teach the team=ensinar a equipe; convince the client=convencer o cliente
weigh|check the amount=conferir a quantidade; follow the recipe=seguir a receita; control {p} health=controlar {F} saúde
total|find the final value=encontrar o valor final; close the account=fechar a conta; check the budget=conferir o orçamento
bargain|get a better price=conseguir um preço melhor; save money=economizar dinheiro; close the deal=fechar o negócio
click|open the link=abrir o link; send the form=enviar o formulário; confirm the choice=confirmar a escolha
bathe|clean the baby=limpar o bebê; relax after work=relaxar depois do trabalho; refresh the body=refrescar o corpo
camp|enjoy nature=aproveitar a natureza; spend time with friends=passar tempo com amigos; escape the city=escapar da cidade
fish|feed the family=alimentar a família; relax at the lake=relaxar no lago; enjoy the weekend=aproveitar o fim de semana
surf|enjoy the waves=aproveitar as ondas; stay in shape=manter a forma; clear {p} mind=clarear {F} mente
referee|keep the game fair=manter o jogo justo; enforce the rules=fazer cumprir as regras; avoid fights=evitar brigas
sue|get compensation=obter indenização; defend {p} rights=defender {MP} direitos; stop the abuse=impedir o abuso
testify|tell the truth=contar a verdade; help the court=ajudar o tribunal; support the victim=apoiar a vítima
investigate|find the cause=encontrar a causa; discover the truth=descobrir a verdade; solve the case=resolver o caso
observe|learn from others=aprender com os outros; understand the pattern=entender o padrão; collect the data=reunir os dados
experiment|test the idea=testar a ideia; find a better method=encontrar um método melhor; learn something new=aprender algo novo
debate|test the idea=testar a ideia; reach an agreement=chegar a um acordo; defend {p} position=defender {F} posição
enroll|start the course=iniciar o curso; learn a new skill=aprender uma nova habilidade; improve {p} career=melhorar {F} carreira
lecture|teach the students=ensinar os alunos; share {p} knowledge=compartilhar {M} conhecimento; explain the theory=explicar a teoria
revise|improve the text=melhorar o texto; find mistakes=encontrar erros; prepare for the exam=preparar a prova
cite|support the argument=apoiar o argumento; give credit=dar crédito; prove the point=provar o ponto
rehearse|avoid mistakes=evitar erros; feel prepared=sentir preparo; improve the performance=melhorar a apresentação
annotate|remember the key points=lembrar os pontos principais; study better=estudar melhor; explain the code=explicar o código
underline|remember the key points=lembrar os pontos principais; study faster=estudar mais rápido; draw attention=chamar a atenção
paraphrase|avoid copying=evitar cópia; explain the idea=explicar a ideia; make it clearer=torná-lo mais claro
tax|raise revenue=arrecadar receita; fund public services=financiar serviços públicos; reduce waste=reduzir o desperdício
insure|protect the family=proteger a família; avoid big losses=evitar grandes perdas; feel safe=ter segurança
accomplish|reach the goal=alcançar a meta; finish the plan=concluir o plano; prove {p} value=provar {M} valor
reconcile|fix the accounts=acertar as contas; avoid errors=evitar erros; close the month=fechar o mês
streamline|save time=economizar tempo; cut costs=cortar custos; improve the process=melhorar o processo
leverage|grow faster=crescer mais rápido; use the resources well=usar bem os recursos; increase the return=aumentar o retorno
onboard|welcome the new employee=acolher o novo funcionário; train the team=treinar a equipe; speed up the start=acelerar o início
hack|test the security=testar a segurança; find the weakness=encontrar a falha; solve the problem=resolver o problema
scroll|read the page=ler a página; find the information=encontrar a informação; see more content=ver mais conteúdo
reboot|fix the problem=resolver o problema; update the system=atualizar o sistema; restart the device=reiniciar o aparelho
scrape|collect the data=reunir os dados; save time=economizar tempo; build the database=montar o banco de dados
visualize|understand the data=entender os dados; explain the results=explicar os resultados; find patterns=encontrar padrões
enable|use the feature=usar o recurso; improve the system=melhorar o sistema; help the users=ajudar os usuários
roast|cook the meat=cozinhar a carne; enhance the flavor=realçar o sabor; feed the guests=alimentar os convidados
steam|keep the nutrients=manter os nutrientes; cook the vegetables=cozinhar os legumes; prepare a light meal=preparar uma refeição leve
simmer|blend the flavors=combinar os sabores; thicken the sauce=engrossar o molho; finish the soup=finalizar a sopa
whisk|add air to the mix=incorporar ar à mistura; make the cream=fazer o creme; prepare the batter=preparar a massa
knead|prepare the dough=preparar a massa; make the bread=fazer o pão; improve the texture=melhorar a textura
marinate|add flavor=acrescentar sabor; soften the meat=amaciar a carne; prepare dinner=preparar o jantar
dice|prepare the salad=preparar a salada; cook faster=cozinhar mais rápido; mix the flavors=misturar os sabores
mash|make the puree=fazer o purê; prepare the baby food=preparar a comida do bebê; soften the potatoes=amaciar as batatas
toast|warm the bread=aquecer o pão; make breakfast=fazer o café da manhã; add crunch=acrescentar crocância
brew|make the coffee=fazer o café; start the morning=começar a manhã; serve the guests=servir os convidados
garnish|decorate the plate=decorar o prato; add color=acrescentar cor; finish the dish=finalizar o prato
iron|look professional=parecer profissional; remove the wrinkles=tirar os amassados; prepare the clothes=preparar as roupas
vacuum|clean the carpet=limpar o tapete; remove the dust=remover a poeira; keep the house tidy=manter a casa arrumada
mop|clean the floor=limpar o chão; remove the dirt=remover a sujeira; keep the house tidy=manter a casa arrumada
scrub|remove the dirt=remover a sujeira; clean the pan=limpar a panela; keep it spotless=mantê-lo impecável
rinse|remove the soap=remover o sabão; clean the dishes=limpar a louça; finish the wash=terminar a lavagem
empty|free up space=liberar espaço; clean the room=limpar o quarto; start again=começar de novo
switch|try a new option=tentar uma nova opção; save money=economizar dinheiro; improve the result=melhorar o resultado
cover|protect the floor=proteger o chão; keep the food warm=manter a comida quente; hide the mistake=esconder o erro
furnish|make the house cozy=deixar a casa aconchegante; welcome the tenants=receber os inquilinos; prepare the apartment=preparar o apartamento
unlock|enter the room=entrar no quarto; access the files=acessar os arquivos; open the door=abrir a porta
stack|save space=economizar espaço; organize the boxes=organizar as caixas; keep things tidy=manter as coisas arrumadas
invent|solve a problem=resolver um problema; improve life=melhorar a vida; make money=ganhar dinheiro
craft|make a unique piece=fazer uma peça única; sell at the fair=vender na feira; express {p} creativity=expressar {F} criatividade
carve|make a sculpture=fazer uma escultura; decorate the wood=decorar a madeira; shape the stone=moldar a pedra
knit|make a sweater=fazer um suéter; keep warm=manter o calor; relax after work=relaxar depois do trabalho
weave|make the fabric=fazer o tecido; sell at the market=vender na feira; keep the tradition=manter a tradição
glue|fix the broken piece=consertar a peça quebrada; assemble the model=montar o modelo; finish the craft=terminar o artesanato
nail|fix the board=fixar a tábua; hang the picture=pendurar o quadro; build the shelf=construir a prateleira
drill|make a hole=fazer um furo; hang the shelf=pendurar a prateleira; install the lamp=instalar a lâmpada
saw|cut the board=cortar a tábua; build the table=construir a mesa; prepare the wood=preparar a madeira
hammer|fix the nail=fixar o prego; build the fence=construir a cerca; repair the chair=consertar a cadeira
screw|fix the shelf=fixar a prateleira; assemble the bed=montar a cama; tighten the lid=apertar a tampa
polish|make it shine=fazê-lo brilhar; protect the surface=proteger a superfície; renew the look=renovar a aparência
manufacture|meet the demand=atender à demanda; sell abroad=vender no exterior; reduce costs=reduzir custos
forge|shape the metal=moldar o metal; make a tool=fazer uma ferramenta; create a strong blade=criar uma lâmina forte
mend|fix the clothes=consertar as roupas; save money=economizar dinheiro; extend its life=prolongar sua vida
sharpen|cut better=cortar melhor; improve the tool=melhorar a ferramenta; work safely=trabalhar com segurança
mold|shape the clay=moldar a argila; make a copy=fazer uma cópia; create the piece=criar a peça
prescribe|treat the disease=tratar a doença; relieve the pain=aliviar a dor; help the patient=ajudar o paciente
vaccinate|prevent the disease=prevenir a doença; protect the children=proteger as crianças; stop the outbreak=conter o surto
inject|deliver the medicine=aplicar o remédio; relieve the pain=aliviar a dor; treat the patient=tratar o paciente
cure|help the patient=ajudar o paciente; stop the disease=interromper a doença; save lives=salvar vidas
sculpt|make a statue=fazer uma estátua; express {p} art=expressar {F} arte; shape the clay=moldar a argila
sketch|plan the design=planejar o projeto; show the idea=mostrar a ideia; practice drawing=praticar desenho
illustrate|explain the idea=explicar a ideia; decorate the book=decorar o livro; attract readers=atrair leitores
direct|guide the team=guiar a equipe; tell the story=contar a história; control the project=controlar o projeto
tune|improve the sound=melhorar o som; play in harmony=tocar em harmonia; prepare for the show=preparar o show
conduct|lead the orchestra=conduzir a orquestra; run the experiment=realizar o experimento; guide the meeting=conduzir a reunião
improvise|solve the problem=resolver o problema; keep the show going=manter o show em andamento; surprise the audience=surpreender o público
exhibit|show {p} work=mostrar {M} trabalho; attract visitors=atrair visitantes; sell the art=vender a arte
convict|punish the crime=punir o crime; protect society=proteger a sociedade; do justice=fazer justiça
prosecute|seek justice=buscar justiça; punish the crime=punir o crime; protect the public=proteger o público
enforce|keep the order=manter a ordem; protect the rights=proteger os direitos; apply the law=aplicar a lei
regulate|protect the consumers=proteger os consumidores; control the market=controlar o mercado; avoid abuse=evitar abusos
authorize|allow the project=permitir o projeto; speed up the process=acelerar o processo; confirm the payment=confirmar o pagamento
prohibit|protect the public=proteger o público; avoid accidents=evitar acidentes; keep the order=manter a ordem
appeal|change the decision=mudar a decisão; defend {p} rights=defender {MP} direitos; get a new trial=obter um novo julgamento
rescue|save lives=salvar vidas; help the victims=ajudar as vítimas; reach the survivors=alcançar os sobreviventes
boost|increase the sales=aumentar as vendas; improve the results=melhorar os resultados; motivate the team=motivar a equipe
accelerate|save time=economizar tempo; reach the goal=alcançar a meta; speed up the growth=acelerar o crescimento
strengthen|improve {p} health=melhorar {F} saúde; build trust=construir confiança; protect the structure=proteger a estrutura
renew|keep the contract=manter o contrato; refresh the look=renovar o visual; continue the service=continuar o serviço
reform|improve the system=melhorar o sistema; fix the problem=resolver o problema; modernize the company=modernizar a empresa
transform|improve the business=melhorar o negócio; change the result=mudar o resultado; create new value=criar novo valor
distribute|share the profit=dividir o lucro; reach more clients=alcançar mais clientes; help the community=ajudar a comunidade
transfer|send the money=enviar o dinheiro; move the data=mover os dados; change the department=mudar de departamento
ship|deliver the order=entregar o pedido; reach the client=alcançar o cliente; meet the deadline=cumprir o prazo
mail|send the letter=enviar a carta; share the documents=compartilhar os documentos; keep in touch=manter contato
hand|give the document=entregar o documento; pass the tool=passar a ferramenta; help a friend=ajudar um amigo
select|choose the best option=escolher a melhor opção; save time=economizar tempo; fit the need=atender à necessidade
purchase|get the equipment=adquirir o equipamento; renew the stock=renovar o estoque; improve the service=melhorar o serviço
reimburse|return the money=devolver o dinheiro; satisfy the client=satisfazer o cliente; keep the trust=manter a confiança
modify|improve the design=melhorar o projeto; fix the problem=resolver o problema; fit the need=atender à necessidade
construct|build the house=construir a casa; create a new space=criar um novo espaço; meet the demand=atender à demanda
instruct|teach the team=ensinar a equipe; avoid mistakes=evitar erros; guide the process=guiar o processo
establish|build a business=construir um negócio; set the rules=definir as regras; create a routine=criar uma rotina
obtain|get the license=conseguir a licença; reach the goal=alcançar a meta; improve the result=melhorar o resultado
retain|keep the clients=manter os clientes; protect the talent=proteger o talento; save money=economizar dinheiro
rely|reduce the risk=reduzir o risco; save time=economizar tempo; trust the team=confiar na equipe
flee|escape danger=escapar do perigo; protect the family=proteger a família; find safety=encontrar segurança
hike|enjoy nature=aproveitar a natureza; stay in shape=manter a forma; reach the top=chegar ao topo
jog|stay in shape=manter a forma; clear {p} mind=clarear {F} mente; lose weight=perder peso
steer|avoid the obstacle=evitar o obstáculo; keep the direction=manter a direção; guide the team=guiar a equipe
`;
const O2_TEMA_TXT = `F|mente|understand the problem=entender o problema; make better decisions=tomar melhores decisões; avoid mistakes=evitar erros
F|juiz|be fair=ser justo; make the right call=tomar a decisão certa; protect the team=proteger a equipe
F|fala|share my ideas=compartilhar minhas ideias; be understood=ser entendido; avoid confusion=evitar confusão
F|afeto|show my feelings=demonstrar meus sentimentos; build trust=construir confiança; stay close to them=ficar perto deles
F|move|get there on time=chegar lá a tempo; avoid the traffic=evitar o trânsito; save time=economizar tempo
F|esporte|stay in shape=manter a forma; win the game=ganhar o jogo; improve my performance=melhorar meu desempenho
F|mat|get the right result=obter o resultado certo; avoid errors=evitar erros; solve the problem=resolver o problema
F|compra|save money=economizar dinheiro; get a better price=conseguir um preço melhor; grow the business=fazer o negócio crescer
F|trab|reach the goal=alcançar a meta; meet the deadline=cumprir o prazo; improve the results=melhorar os resultados
F|tech|solve the problem=resolver o problema; improve the system=melhorar o sistema; save time=economizar tempo
F|comida|stay healthy=manter a saúde; feed my family=alimentar minha família; enjoy the meal=aproveitar a refeição
F|casa|keep the house in order=manter a casa em ordem; feel comfortable=ficar confortável; welcome our guests=receber nossos convidados
F|fazer|solve the problem=resolver o problema; improve the result=melhorar o resultado; save time=economizar tempo
F|estudo|pass the exam=passar na prova; learn something new=aprender algo novo; get a better job=conseguir um emprego melhor
F|corpo|stay healthy=manter a saúde; feel better=ficar melhor; recover my energy=recuperar a energia
F|natureza|protect the environment=proteger o meio ambiente; save energy=economizar energia; enjoy the outdoors=aproveitar o ar livre
F|arte|express my ideas=expressar minhas ideias; inspire people=inspirar as pessoas; share my vision=compartilhar minha visão
F|lei|protect our rights=proteger nossos direitos; keep order=manter a ordem; avoid problems=evitar problemas
F|muda|improve the situation=melhorar a situação; face the new reality=encarar a nova realidade; reach a better result=alcançar um resultado melhor
F|troca|get a better deal=conseguir um negócio melhor; reach an agreement=chegar a um acordo; save money=economizar dinheiro
C|mente|need:more time=de mais tempo; want:a clear answer=uma resposta clara; believe:it matters=que isso importa
C|juiz|believe:it is right=que isso é certo; want:a fair result=um resultado justo; need:clear rules=de regras claras
C|fala|want:to be clear=ser claro; need:an answer=de uma resposta; believe:it is important=que isso é importante
C|afeto|love:them=eles; trust:them=neles; need:support=de apoio
C|move|need:to arrive early=chegar cedo; want:to save time=economizar tempo; expect:heavy traffic=trânsito pesado
C|esporte|love:the game=o jogo; want:to win=vencer; need:more practice=de mais treino
C|mat|need:an exact answer=de uma resposta exata; want:to avoid errors=evitar erros; expect:a precise result=um resultado preciso
C|compra|need:it=disso; want:a better price=um preço melhor; expect:good quality=boa qualidade
C|trab|need:the money=do dinheiro; love:the job=o trabalho; want:a better career=uma carreira melhor
C|tech|need:a faster system=de um sistema mais rápido; want:to save time=economizar tempo; expect:fewer errors=menos erros
C|comida|love:good food=boa comida; need:more energy=de mais energia; want:a healthy life=uma vida saudável
C|casa|need:more space=de mais espaço; want:a clean home=uma casa limpa; expect:guests=convidados
C|fazer|need:a good result=de um bom resultado; want:to finish early=terminar cedo; expect:good feedback=um bom retorno
C|estudo|need:a good grade=de uma boa nota; want:to learn more=aprender mais; love:the subject=a matéria
C|corpo|need:more rest=de mais descanso; want:to feel better=ficar melhor; need:good health=de boa saúde
C|natureza|love:nature=a natureza; want:to protect it=protegê-la; want:a better planet=um planeta melhor
C|arte|love:the craft=o ofício; want:to inspire people=inspirar as pessoas; need:to be creative=ser criativo
C|lei|believe:in justice=na justiça; need:clear rules=de regras claras; want:to protect people=proteger as pessoas
C|muda|need:a change=de uma mudança; want:a better result=um resultado melhor; expect:progress=progresso
C|troca|need:a better deal=de um negócio melhor; want:to help=ajudar; expect:a fair price=um preço justo
S|mente|understand:the problem=o problema; learn:more=mais; know:the answer=a resposta
S|juiz|trust:the process=no processo; understand:the rules=as regras; accept:the result=o resultado
S|fala|understand:the idea=a ideia; know:the plan=o plano; trust:the message=na mensagem
S|afeto|trust:them=neles; enjoy:the moment=o momento; feel:closer=mais perto
S|move|arrive:early=cedo; save:time=tempo; enjoy:the trip=a viagem
S|esporte|become:stronger=mais forte; enjoy:the game=o jogo; improve:every day=a cada dia
S|mat|know:the answer=a resposta; understand:the result=o resultado; trust:the numbers=nos números
S|compra|save:money=dinheiro; get:a good deal=um bom negócio; enjoy:the result=o resultado
S|trab|earn:more money=mais dinheiro; learn:more=mais; improve:every day=a cada dia
S|tech|save:time=tempo; solve:the issue=o problema; trust:the system=no sistema
S|comida|become:healthier=mais saudável; enjoy:the meal=a refeição; save:money=dinheiro
S|casa|become:comfortable=confortável; enjoy:the space=o espaço; save:time=tempo
S|fazer|finish:early=cedo; enjoy:the result=o resultado; learn:more=mais
S|estudo|learn:more=mais; understand:the subject=a matéria; become:confident=confiante
S|corpo|become:healthier=mais saudável; recover:faster=mais rápido; enjoy:life=a vida
S|natureza|enjoy:the view=a vista; save:energy=energia; become:calmer=mais calmo
S|arte|enjoy:the result=o resultado; inspire:people=as pessoas; become:proud=orgulhoso
S|lei|become:safer=mais seguro; trust:the system=no sistema; understand:the rules=as regras
S|muda|improve:every day=a cada dia; become:better=melhor; learn:more=mais
S|troca|save:money=dinheiro; become:satisfied=satisfeito; enjoy:the deal=o negócio
T|mente|think:about the problem=sobre o problema; decide:the next step=o próximo passo; remember:the details=dos detalhes
T|juiz|hear:the case=o caso; read:the evidence=as provas; decide:the case=o caso
T|fala|explain:the idea=a ideia; answer:the question=a pergunta; finish:speaking=de falar
T|afeto|meet:the family=a família; call:home=para casa; visit:the family=a família
T|move|arrive:at the station=na estação; reach:the city=a cidade; cross:the bridge=a ponte
T|esporte|finish:the match=a partida; win:the game=o jogo; start:training=o treino
T|mat|finish:the calculation=o cálculo; get:the result=o resultado; check:the numbers=os números
T|compra|find:a good price=um bom preço; receive:the payment=o pagamento; pay:the bill=a conta
T|trab|finish:the work=o trabalho; receive:the payment=o pagamento; arrive:at the office=no escritório
T|tech|install:the update=a atualização; fix:the bug=o erro; start:the system=o sistema
T|comida|finish:cooking=de cozinhar; prepare:the meal=a refeição; taste:the soup=a sopa
T|casa|clean:the house=a casa; open:the door=a porta; finish:the repairs=os reparos
T|fazer|finish:the task=a tarefa; start:the project=o projeto; complete:the plan=o plano
T|estudo|finish:the lesson=a lição; read:the chapter=o capítulo; review:the notes=as anotações
T|corpo|rest:enough=o suficiente; eat:a healthy meal=uma refeição saudável; finish:the workout=o treino
T|natureza|see:the sunrise=o nascer do sol; reach:the top=o topo; cross:the river=o rio
T|arte|finish:the painting=a pintura; start:a new piece=uma nova peça; show:the work=o trabalho
T|lei|read:the law=a lei; sign:the contract=o contrato; hear:the verdict=o veredito
T|muda|finish:the change=a mudança; accept:the new rules=as novas regras; start:the new phase=a nova fase
T|troca|close:the deal=o negócio; sign:the agreement=o acordo; receive:the offer=a oferta
A|mente|difficult=difícil; confusing=confuso; unclear=incerto
A|juiz|complicated=complicado; unfair=injusto; controversial=controverso
A|fala|awkward=constrangedor; difficult=difícil; risky=arriscado
A|afeto|painful=doloroso; hard=difícil; complicated=complicado
A|move|slow=lento; tiring=cansativo; expensive=caro
A|esporte|tough=duro; tiring=cansativo; painful=doloroso
A|mat|complex=complexo; difficult=difícil; long=longo
A|compra|expensive=caro; risky=arriscado; uncertain=incerto
A|trab|tiring=cansativo; stressful=estressante; hard=difícil
A|tech|complex=complexo; slow=lento; risky=arriscado
A|comida|expensive=caro; messy=bagunçado; slow=demorado
A|casa|tiring=cansativo; expensive=caro; messy=bagunçado
A|fazer|hard=difícil; slow=lento; stressful=estressante
A|estudo|hard=difícil; tiring=cansativo; long=longo
A|corpo|painful=doloroso; tiring=cansativo; hard=difícil
A|natureza|cold=frio; difficult=difícil; tiring=cansativo
A|arte|difficult=difícil; risky=arriscado; slow=lento
A|lei|complicated=complicado; slow=lento; expensive=caro
A|muda|hard=difícil; risky=arriscado; stressful=estressante
A|troca|risky=arriscado; complicated=complicado; expensive=caro
N|mente|the doubt=da dúvida; the confusion=da confusão; the stress=do estresse
N|juiz|the pressure=da pressão; the criticism=da crítica; the doubt=da dúvida
N|fala|the fear=do medo; the nerves=do nervosismo; the noise=do barulho
N|afeto|the distance=da distância; the conflict=do conflito; the pain=da dor
N|move|the traffic=do trânsito; the rain=da chuva; the distance=da distância
N|esporte|the pain=da dor; the pressure=da pressão; the rain=da chuva
N|mat|the difficulty=da dificuldade; the pressure=da pressão; the complexity=da complexidade
N|compra|the price=do preço; the risk=do risco; the cost=do custo
N|trab|the pressure=da pressão; the stress=do estresse; the deadline=do prazo
N|tech|the delay=do atraso; the risk=do risco; the cost=do custo
N|comida|the heat=do calor; the cost=do custo; the mess=da bagunça
N|casa|the noise=do barulho; the mess=da bagunça; the cost=do custo
N|fazer|the delay=do atraso; the difficulty=da dificuldade; the pressure=da pressão
N|estudo|the stress=do estresse; the difficulty=da dificuldade; the noise=do barulho
N|corpo|the pain=da dor; the fatigue=do cansaço; the stress=do estresse
N|natureza|the cold=do frio; the rain=da chuva; the distance=da distância
N|arte|the criticism=da crítica; the doubt=da dúvida; the pressure=da pressão
N|lei|the pressure=da pressão; the risk=do risco; the cost=do custo
N|muda|the fear=do medo; the risk=do risco; the uncertainty=da incerteza
N|troca|the risk=do risco; the price=do preço; the delay=do atraso`;
/* v117: verbos sem antônimo na ficha ganham 2 verbos de CONTRASTE curados (não são antônimos: são o que "but"/"or" naturalmente opõe —
   "She sings, but she doesn't dance"). O dicionário continua sem listá-los como antônimos. */
const O2_CONTRA_TXT = `x-ray|diagnose,treat
cross|wait,run
dream|sleep,plan
drink|eat,cook
figure|guess,calculate
step|jump,run
turn|stop,move
mean|say,think
predict|guess,know
compare|choose,decide
judge|forgive,listen
deserve|earn,win
interview|hire,listen
kiss|hug,hold
kick|pass,catch
dribble|pass,shoot
surf|swim,dive
referee|play,coach
round|add,calculate
weigh|measure,count
total|add,subtract
plot|plan,draw
rank|sort,choose
cost|save,earn
bargain|pay,buy
click|type,scroll
print|copy,save
code|test,design
browse|buy,search
debug|write,test
bake|buy,sell
chop|mix,boil
slice|serve,eat
taste|serve,cook
serve|eat,cook
grill|boil,fry
season|taste,cook
bite|chew,swallow
brush|wash,clean
bathe|wash,dry
design|build,draw
translate|write,read
spell|read,write
edit|write,publish
cough|sneeze,breathe
sneeze|cough,breathe
fish|hunt,swim
camp|hike,sleep
sing|dance,play
dance|sing,jump
act|direct,write
film|photograph,edit
photograph|film,paint
testify|lie,listen
happen|change,stop
seem|look,feel
intend|try,plan
depend|decide,choose
rate|review,rank
chat|listen,write
gossip|talk,listen
sigh|smile,laugh
joke|laugh,listen
swear|promise,lie
narrate|describe,explain
remind|forget,tell
stutter|speak,sing
shiver|sweat,burn
hike|walk,run
skate|ski,run
ski|skate,walk
row|swim,sail
box|train,run
punch|kick,hit
coach|play,train
approximate|measure,calculate
sponsor|support,finance
price|sell,buy
insure|pay,protect
cash|deposit,pay
audit|review,check
amortize|pay,spend
forecast|plan,predict
scroll|click,tap
tap|click,press
format|edit,type
render|draw,edit
scrape|copy,collect
visualize|calculate,imagine
whisk|pour,bake
knead|mix,bake
grate|boil,mix
marinate|cook,season
dice|fry,boil
mash|fry,slice
brew|drink,serve
lick|bite,taste
ferment|boil,freeze
garnish|cook,taste
vacuum|sweep,clean
scrub|wipe,rinse
knock|ring,enter
ring|knock,call
carve|paint,sculpt
drill|saw,hammer
saw|drill,hammer
hammer|saw,drill
forge|mend,repair
grind|mix,cut
annotate|read,edit
conjugate|translate,spell
yawn|sleep,rest
peek|look,watch
smell|taste,touch
sniff|smell,taste
rub|wipe,touch
hum|sing,whistle
whistle|sing,hum
snore|sleep,breathe
vaccinate|treat,cure
splash|swim,pour
spray|pour,water
graze|feed,eat
hatch|grow,plant
sculpt|paint,carve
sketch|paint,design
strum|sing,play
tune|play,adjust
conduct|play,sing
frame|paint,hang
recite|read,sing
dub|translate,film
belong|own,keep
say|listen,ask
understand|ignore,forget
clean|cook,dry
do|plan,stop
draw|paint,write
fight|negotiate,help
wash|dry,iron
realize|ignore,doubt
admire|criticize,envy
respect|ignore,insult
support|criticize,ignore
explain|ask,mention
mention|ignore,forget
warn|encourage,help
express|hide,ignore
hug|kiss,greet
marry|date,leave
park|drive,stop
board|leave,wait
guide|follow,teach
train|rest,compete
compete|collaborate,help
beat|lose,help
cheer|criticize,watch
dive|swim,float
manage|delegate,follow
negotiate|accept,refuse
organize|forget,clean
promote|fire,hire
present|listen,hide
produce|buy,sell
supervise|help,follow
develop|test,sell
recruit|fire,train
update|check,delete
connect|leave,stop
record|play,delete
encrypt|send,store
automate|check,monitor
mix|boil,serve
swallow|chew,drink
dress|wash,pack
sweep|mop,wash
tidy|clean,decorate
fold|pack,iron
decorate|clean,paint
light|clean,cover
pack|carry,send
wipe|scrub,rinse
paint|draw,decorate
assemble|repair,use
sew|iron,cut
shape|cut,mold
tie|carry,pack
bend|break,lift
shake|hold,mix
help|ask,thank
practice|rest,teach
draft|edit,publish
correct|ignore,teach
publish|write,edit
breathe|cough,rest
bleed|heal,treat
treat|diagnose,heal
diagnose|treat,examine
burn|cook,clean
shine|work,clean
celebrate|work,rest
relax|work,train
gather|share,count
obey|ask,follow
require|offer,accept
sue|negotiate,accept
vote|elect,decide
elect|vote,decide
punish|forgive,teach
adapt|change,follow
interpret|translate,explain
reflect|decide,plan
wish|hope,plan
reconsider|decide,confirm
distinguish|compare,identify
verify|check,confirm
define|explain,describe
prove|explain,test
endorse|sign,review
insist|accept,ask
advise|listen,ask
convince|prove,ask
persuade|ask,convince
mumble|speak,shout
tease|thank,joke
curse|thank,swear
clarify|ask,explain
emphasize|explain,mention
adore|like,respect
cherish|keep,protect
date|marry,meet
grieve|remember,rest
blush|smile,laugh
rush|wait,walk
sail|row,travel
steer|drive,follow
stumble|walk,run
lean|stand,sit
swing|jump,sit
bat|throw,catch
exceed|meet,reach
balance|measure,carry
tally|count,add
simplify|explain,change
double|add,multiply
budget|spend,save
finance|pay,invest
discount|charge,sell
coordinate|plan,organize
assist|ask,guide
represent|defend,speak
merge|share,sort
reconcile|check,fix
accrue|pay,count
allocate|spend,plan
outsource|hire,manage
diversify|invest,plan
liquidate|sell,pay
streamline|simplify,improve
prioritize|plan,organize
onboard|train,welcome
involve|invite,ask
handle|manage,fix
compile|test,run
refresh|update,check
sync|update,copy
tag|share,sort
configure|install,test
optimize|test,monitor
customize|install,choose
enable|install,configure
simmer|boil,stir
sip|drink,taste
iron|fold,wash
dust|wipe,sweep
mop|sweep,rinse
rinse|wash,dry
dry|wash,hang
cover|open,remove
furnish|decorate,rent
stack|sort,carry
leak|fix,drip
craft|buy,design
knit|sew,weave
weave|knit,sew
glue|nail,tie
nail|glue,hammer
screw|nail,glue
polish|clean,paint
sharpen|cut,grind
mold|shape,cut
cheat|win,lose
underline|highlight,read
faint|rest,breathe
vomit|cough,eat
scratch|rub,touch
limp|walk,run
cure|treat,help
inject|treat,heal
blow|breathe,whistle
erode|build,change
evaporate|freeze,boil
ripen|grow,harvest
sparkle|shine,burn
illustrate|explain,draw
rhyme|sing,write
animate|draw,film
regulate|adjust,manage
explode|burn,break
evolve|change,grow
transform|change,keep
vary|change,keep
widen|open,expand
soften|melt,mix
stabilize|fix,adjust
reform|change,fix
mature|grow,learn
affect|change,cause
postpone|cancel,schedule
establish|build,open
`;
const O2_CONTRA = {};
O2_CONTRA_TXT.split('\n').forEach(l => { const [k, v] = l.split('|'); if(k && v) O2_CONTRA[k] = v.split(','); });
const O2_FIN = {}, O2_TEMA = { F:{}, C:{}, S:{}, T:{}, A:{}, N:{} };   /* v92: T eventos (temporal) · A adjetivos (concessiva) · N substantivos (despite) */
(function(){
  const par = t => t.split('; ').map(o => { const i = o.indexOf('='); return { en: o.slice(0, i), pt: o.slice(i + 1) }; });
  O2_FIN_TXT.split('\n').forEach(l => { const i = l.indexOf('|'); if(i > 0) O2_FIN[l.slice(0, i)] = par(l.slice(i + 1)); });
  O2_TEMA_TXT.split('\n').forEach(l => {
    const [k, tema, resto] = l.split('|');
    if(!k || !resto) return;
    O2_TEMA[k][tema] = par(resto).map(o => {
      if(k === 'F') return { en:o.en.replace(/\b(my|our)\b/g, '{p}'),
        pt:o.pt.replace(/\b(minhas|nossas)\b/g,'{FP}').replace(/\b(minha|nossa)\b/g,'{F}').replace(/\b(meus|nossos)\b/g,'{MP}').replace(/\b(meu|nosso)\b/g,'{M}') };
      if(k === 'A' || k === 'N') return { en:o.en, pt:o.pt };
      const j = o.en.indexOf(':');
      return { v: o.en.slice(0, j), en: o.en.slice(j + 1), pt: o.pt };
    });
  });
})();
/* ================= v92: SUBJUNTIVO e CONDICIONAL do português =================
   Derivados da conjugação já existente (PT_VERBS), sem tabela nova por verbo:
     presente do subjuntivo   ← 1ª pessoa do presente ("trabalho" → trabalhe) + 7 irregulares (ser, estar, dar, ir, haver, saber, querer)
     imperfeito do subjuntivo ← 3ª pl. do pretérito perfeito ("trabalharam" → trabalhasse / trabalhássemos)
     futuro do subjuntivo     ← 3ª pl. do pretérito perfeito ("trabalharam" → trabalhar / trabalharmos)
     condicional (fut. do pret.) ← infinitivo + -ia (exceto dizer/fazer/trazer → diria/faria/traria)
   Pessoas: 1s, 3s, 1p, 3p (o mesmo recorte do resto do motor). Verbos de várias palavras ("ficar sem")
   conjugam só a 1ª e carregam o resto. Devolve null se a forma não for derivável (os testes garantem que isso não ocorre). */
const PT_SUBJ_EXC = {
  ser:    { "1s":"seja",   "3s":"seja",   "1p":"sejamos",   "3p":"sejam" },
  estar:  { "1s":"esteja", "3s":"esteja", "1p":"estejamos", "3p":"estejam" },
  dar:    { "1s":"dê",     "3s":"dê",     "1p":"demos",     "3p":"deem" },
  ir:     { "1s":"vá",     "3s":"vá",     "1p":"vamos",     "3p":"vão" },
  haver:  { "1s":"haja",   "3s":"haja",   "1p":"hajamos",   "3p":"hajam" },
  saber:  { "1s":"saiba",  "3s":"saiba",  "1p":"saibamos",  "3p":"saibam" },
  querer: { "1s":"queira", "3s":"queira", "1p":"queiramos", "3p":"queiram" }
};
function ptSubj(verbId, person, modo){
  const v = PT_VERBS[verbId]; if(!v || !v.inf) return null;
  const infTok = v.inf.split(' ')[0];
  const parte = f => { const t = f.split(' '); return { head: t[0], rest: t.slice(1).join(' ') }; };
  const junta = (h, r) => r ? h + ' ' + r : h;
  if(modo === 'pres'){
    const f1 = parte(v.presente['1s']);
    if(PT_SUBJ_EXC[infTok]) return junta(PT_SUBJ_EXC[infTok][person], f1.rest);
    if(!/o$/.test(f1.head)) return null;
    let st = f1.head.slice(0, -1);
    const ar = /ar$/.test(infTok), vg = ar ? 'e' : 'a';
    if(ar){                                                   /* mantém o som: ficar → fique · pagar → pague · começar → comece */
      if(/c$/.test(st)) st = st.slice(0, -1) + 'qu'; else if(/g$/.test(st)) st += 'u'; else if(/ç$/.test(st)) st = st.slice(0, -1) + 'c';
    }
    return junta(st + ({ "1s":vg, "3s":vg, "1p":vg + 'mos', "3p":vg + 'm' })[person], f1.rest);
  }
  const p3 = parte(v.pperf['3p']);
  if(!/ram$/.test(p3.head)) return null;
  if(modo === 'imp'){
    const base = p3.head.slice(0, -3);
    if(person === '1p'){                                      /* a vogal antes de -ssemos leva acento */
      const ult = base.slice(-1);
      const erReg = /er$/.test(infTok) && base + 'ram' === infTok.slice(0, -2) + 'eram';   /* comêssemos × tivéssemos */
      const ac = ({ a:'á', e: erReg ? 'ê' : 'é', i:'í', o:'ô', u:'ú' })[ult];
      return junta((ac ? base.slice(0, -1) + ac : base) + 'ssemos', p3.rest);
    }
    return junta(base + (person === '3p' ? 'ssem' : 'sse'), p3.rest);
  }
  if(modo === 'fut'){
    let b = p3.head.slice(0, -2);
    if(person !== '3p') b = b.replace(/ír$/, 'ir');          /* sair, cair, construir — o acento só fica em saírem/caírem */
    return junta(b + ({ "1s":'', "3s":'', "1p":'mos', "3p":'em' })[person], p3.rest);
  }
  return null;
}
/* v120: pretérito IMPERFEITO do indicativo, derivado do infinitivo (sem tabela por verbo).
   -ar → -ava · -er/-ir → -ia · irregulares: ser (era), ter e derivados (tinha), vir e derivados (vinha), pôr e derivados (punha), ver (via).
   Mantém o resto do verbo composto ("dar uma pausa" → "dava uma pausa"). */
function ptImperf(verbId, person){
  const v = PT_VERBS[verbId]; if(!v || !v.inf) return null;
  const inf = v.inf.split(' ')[0], idx = { "1s":0, "3s":0, "1p":1, "3p":2 }[person];
  if(idx === undefined) return null;
  /* cauda do verbo composto ("dar uma pausa"): vem da própria 3ª pessoa do presente */
  const cauda = (v.presente['3s'] || '').split(' ').slice(1).join(' ');
  const fim = h => cauda ? h + ' ' + cauda : h;
  const F = (b, a, c, d) => [b + a, b + c, b + d][idx];
  let r;
  if(inf === 'ser') r = ['era', 'éramos', 'eram'][idx];
  else if(/p[oô]r$/.test(inf)) r = F(inf.slice(0, -3), 'punha', 'púnhamos', 'punham');                        /* pôr · compor · expor · supor */
  else if(/^(ter|(man|con|ob|re|de|abs|sus|entre|a)ter)$/.test(inf)) r = F(inf.slice(0, -3), 'tinha', 'tínhamos', 'tinham');   /* ter · manter · obter */
  else if(/^(vir|(inter|con|pro|ad|sobre|desa|a)vir)$/.test(inf)) r = F(inf.slice(0, -3), 'vinha', 'vínhamos', 'vinham');     /* vir · intervir */
  else if(/^(ver|prever|rever|antever|entrever)$/.test(inf)) r = F(inf.slice(0, -3), 'via', 'víamos', 'viam');
  else if(/ar$/.test(inf)) r = F(inf.slice(0, -2), 'ava', 'ávamos', 'avam');
  else if(/(er|ir)$/.test(inf)){
    const b = inf.slice(0, -2), ac = /[aeou]$/.test(b) && !/[gq]u$/.test(b);       /* sair → saía · construir → construía · seguir → seguia */
    r = ac ? F(b, 'ía', 'íamos', 'íam') : F(b, 'ia', 'íamos', 'iam');
  } else return null;
  return fim(r);
}
function ptCond(verbId, person){
  const v = PT_VERBS[verbId]; if(!v || !v.inf) return null;
  const t = v.inf.split(' '), inf = t[0], rest = t.slice(1).join(' ');
  let st = inf;
  if(/dizer$/.test(inf)) st = inf.replace(/dizer$/, 'dir');
  else if(/fazer$/.test(inf)) st = inf.replace(/fazer$/, 'far');
  else if(/trazer$/.test(inf)) st = inf.replace(/trazer$/, 'trar');
  else if(inf === 'pôr') st = 'por';
  const f = st + ({ "1s":'ia', "3s":'ia', "1p":'íamos', "3p":'iam' })[person];
  return rest ? f + ' ' + rest : f;
}
const PT_COND_TER = { "1s":"teria", "3s":"teria", "1p":"teríamos", "3p":"teriam" };
let ptCondModo = null;      /* 'c2' | 'c3' enquanto a principal vira "would"/"would have" (condicional tipo 2/3) */
/* conj: forma em inglês e em português; vg = vírgula antes */
const O2_TIPOS = [
  { k:'final', ic:'🎯', nome:'Finalidade', fam:'Subordinada adverbial final', forma:'A',
    conjs:[{ en:'in order to', pt:'para' }, { en:'so as to', pt:'de modo a' }, { en:'to', pt:'para' }, { en:'so that', pt:'para que' }, { en:'in order that', pt:'a fim de que' }],
    est:'+ in order to + verbo base',
    nota:'<b>Finalidade</b> — a 2ª oração é <b>infinitiva</b>: sem sujeito e sem tempo próprio, herda os da principal. Para negar, o motor usa <b>in order not to</b> / <b>so as not to</b> ("to" sozinho fica ambíguo). O português usa "para" + infinitivo.' },
  { k:'adv', ic:'↔️', nome:'Adversativa (contraste)', fam:'Coordenada adversativa', forma:'B',
    conjs:[{ en:'but', pt:'mas', vg:1 }, { en:'yet', pt:'porém', vg:1 }, { en:'whereas', pt:'ao passo que', vg:1 }, { en:'while', pt:'enquanto', vg:1 }],
    est:'+ , but + oração (mesmo tempo)',
    nota:'<b>Adversativa</b> — <b>but</b> liga duas orações independentes, com <b>vírgula antes</b>. A 2ª herda <b>tempo e aspecto</b> da 1ª e repete o sujeito (a elipse seria possível, mas repetir deixa o contraste claro). O verbo 2 vem dos <b>antônimos</b> do verbo 1.<br><b>Yet</b> = “porém” (mais formal, contraste inesperado). <b>Whereas</b> e <b>while</b> (no sentido de “enquanto/ao passo que”) contrastam dois fatos paralelos, sempre com vírgula antes; cuidado: <b>while</b> também pode ser temporal (veja Temporal). <b>However</b>, <b>nevertheless</b> e <b>still</b> NÃO são conjunções: pedem ponto e vírgula/ponto antes e vírgula depois (“…; however, she rests”), por isso ficam só na seção.' },
  { k:'adit', ic:'➕', nome:'Aditiva (adição)', fam:'Coordenada aditiva', forma:'B',
    conjs:[{ en:'and', pt:'e' }, { en:'and also', pt:'e também' }, { en:'and then', pt:'e depois' }, { en:'plus', pt:'além disso', vg:1 }],
    est:'+ and + oração (mesmo tempo)',
    nota:'<b>Aditiva</b> — <b>and</b> soma uma ação da mesma família semântica; sem vírgula quando as orações são curtas. Tempo e aspecto são os da 1ª oração; o verbo 2 vem dos <b>sinônimos</b> do verbo 1.<br><b>And then</b> acrescenta a ideia de <b>sequência</b> (primeiro uma ação, depois a outra); <b>plus</b> é informal (“além disso”) e leva vírgula. Exceção: <b>as well as</b> e <b>not only… but also</b> têm estrutura própria (veja a seção) e não entram aqui.' },
  { k:'alt', ic:'🔀', nome:'Alternativa (ou)', fam:'Coordenada alternativa', forma:'B',
    conjs:[{ en:'or', pt:'ou' }, { en:'otherwise', pt:'senão', vg:1 }, { en:'or else', pt:'ou então', vg:1 }],
    est:'+ or / , otherwise + oração (mesmo tempo)',
    nota:'<b>Alternativa</b> — <b>or</b> apresenta a outra possibilidade (sem vírgula quando curta); <b>otherwise</b> e <b>or else</b> dizem "se não, então…" (<i>or else</i> é mais informal e enfático) e vêm depois de <b>vírgula</b>. Tempo e aspecto são os da 1ª oração. O verbo 2 vem de antônimos e sinônimos do verbo 1.' },
  { k:'expl', ic:'📝', nome:'Explicativa (pois)', fam:'Coordenada explicativa', forma:'C',
    conjs:[{ en:'for', pt:'pois', vg:1 }],
    est:'+ , for + sujeito + verbo',
    nota:'<b>Explicativa</b> — <b>for</b> (= "pois") justifica a afirmação anterior; é <b>formal/literário</b>, sempre com <b>vírgula antes</b>, e não abre a frase. No dia a dia use <b>because</b>. Contínuos viram simples, como na causal.' },
  { k:'rel', ic:'🏷️', nome:'Relativa restritiva (qual?)', fam:'Subordinada adjetiva restritiva', forma:'R',
    conjs:[{ en:'that', pt:'que' }, { en:'which', pt:'que' }, { en:'who', pt:'que' }, { en:'whose', pt:'cujo' }, { en:'where', pt:'onde' }, { en:'when', pt:'em que' }],
    est:'+ that/which/who + sujeito + verbo (sem objeto)', nota:'' },
  { k:'relx', ic:'💬', nome:'Relativa explicativa (informação extra)', fam:'Subordinada adjetiva explicativa', forma:'R',
    conjs:[{ en:'which', pt:'que', vg:1 }, { en:'who', pt:'que', vg:1 }, { en:'whose', pt:'cujo', vg:1 }, { en:'where', pt:'onde', vg:1 }, { en:'when', pt:'em que', vg:1 }],
    est:'+ , which/who + sujeito + verbo (sem objeto)', nota:'' },
  { k:'obj', ic:'💭', nome:'Objetiva direta (that / if / whether)', fam:'Subordinada substantiva objetiva direta', forma:'S',
    conjs:[{ en:'that', pt:'que' }, { en:'if', pt:'se' }, { en:'whether', pt:'se' }],
    est:'+ that/if/whether + it (ou sujeito) + be + adjetivo', nota:'' },
  { k:'caus', ic:'❓', nome:'Causal (motivo)', fam:'Subordinada adverbial causal', forma:'C',
    conjs:[{ en:'because', pt:'porque' }, { en:'since', pt:'já que', vg:1, ini:true }, { en:'as', pt:'como', vg:1, ini:true }, { en:'now that', pt:'agora que', vg:1, ini:true }, { en:'given that', pt:'dado que', vg:1, ini:true }, { en:'seeing that', pt:'visto que', vg:1, ini:true }],
    est:'+ because + sujeito + verbo',
    nota:'<b>Causal</b> — <b>because</b> pede uma oração <b>completa</b> (sujeito + verbo); nunca "because to…". O tempo é o da principal, mas contínuos viram <b>simples</b>: motivos e resultados pedem o simples. "Since" causal costuma vir com vírgula.<br><b>As</b> (“como”), <b>since</b>, <b>given that</b> e <b>seeing that</b> apresentam um motivo <b>já conhecido</b> e gostam de abrir a frase (“As she needs the money, she works”); <b>because</b> traz a informação nova e fica no fim. <b>Now that</b> = “agora que”: o motivo é uma situação recente. Exceção: <b>as</b> também pode ser temporal (“enquanto”) — aqui é só causal.' },
  { k:'cons', ic:'➡️', nome:'Consecutiva (resultado)', fam:'Coordenada conclusiva', forma:'C',
    conjs:[{ en:'so', pt:'então', vg:1 }, { en:'and so', pt:'e por isso', vg:1 }, { en:'which is why', pt:'e é por isso que', vg:1 }],
    est:'+ , so + sujeito + verbo',
    nota:'<b>Consecutiva</b> — <b>so</b> introduz o resultado, com <b>vírgula antes</b>. Tempo da principal (contínuos viram simples). Cuidado: "so" ≠ "so that" (finalidade): <b>so that</b> está em Finalidade.<br><b>Which is why</b> retoma toda a oração anterior (“…, which is why she earns more”). <b>Therefore, thus, hence</b> e <b>consequently</b> são advérbios de ligação (ponto e vírgula antes, vírgula depois) e ficam na seção.' },
  /* ---- v92 · fase 3 ---- */
  { k:'temp', ic:'⏳', nome:'Temporal (quando)', fam:'Subordinada adverbial temporal', forma:'T',
    conjs:[{ en:'when', pt:'quando' }, { en:'as soon as', pt:'assim que' }, { en:'after', pt:'depois que' }, { en:'while', pt:'enquanto' }, { en:'before', pt:'antes que' }, { en:'until', pt:'até que' }, { en:'once', pt:'uma vez que' }, { en:'the moment', pt:'no momento em que' }, { en:'the first time', pt:'a primeira vez que' }, { en:'whenever', pt:'sempre que', hab:1 }, { en:'every time', pt:'toda vez que', hab:1 }, { en:'each time', pt:'cada vez que', hab:1 }],
    est:'+ when/after… + sujeito + verbo (presente se a principal for futura)',
    nota:'<b>Temporal</b> — depois de when, as soon as, after, while, before e until o inglês <b>não usa will</b>: o futuro da principal vira <b>presente simples</b> ("I will call when she <i>arrives</i>"). O português pede aqui o <b>futuro do subjuntivo</b> ("quando ela <i>chegar</i>") — e, com before/until, o <b>presente do subjuntivo</b> ("antes que ela chegue"). No passado tudo vai ao passado, e <b>while</b> pede o passado contínuo.<br><b>Once</b> (“uma vez que”), <b>the moment</b> (“no momento em que”) e <b>the first time</b> funcionam como when/as soon as: presente simples no lugar do futuro. Exceção: <b>every time</b>/<b>whenever</b> (habituais) ficam só na seção, porque no passado pedem o imperfeito do português.' },
  { k:'cond', ic:'🔀', nome:'Condicional (se…)', fam:'Subordinada adverbial condicional', forma:'K',
    conjs:[{ en:'if', pt:'se' }, { en:'unless', pt:'a menos que' }, { en:'as long as', pt:'desde que' }, { en:'provided that', pt:'contanto que' }, { en:'so long as', pt:'desde que' }, { en:'in case', pt:'caso' }],
    est:'+ if + oração (tipo 0–3)',
    nota:'<b>Condicional</b> — escolha o tipo (0–3); o motor ajusta o tempo da principal.<br><b>Provided that</b>, <b>as long as</b> e <b>so long as</b> = “desde que/contanto que”: condição necessária, sempre com <b>presente simples</b> e subjuntivo no português. <b>In case</b> = “caso” indica <b>precaução</b> (“leve o guarda-chuva caso chova”), não condição: não use will depois dela. Estas conjunções só existem nos tipos 0 e 1; os tipos 2 e 3 (irreal) pedem <b>if</b>.' },
  { k:'conc', ic:'🧱', nome:'Concessiva (apesar de)', fam:'Subordinada adverbial concessiva', forma:'Q',
    conjs:[{ en:'although', pt:'embora', ini:true }, { en:'though', pt:'embora' }, { en:'even though', pt:'mesmo que', ini:true }, { en:'despite', pt:'apesar', ini:true }, { en:'in spite of', pt:'apesar', ini:true }, { en:'even if', pt:'mesmo que', ini:true }],
    est:'+ although + it is + adjetivo  |  + despite + substantivo',
    nota:'<b>Concessiva</b> — <b>although / though / even though</b> pedem uma <b>oração completa</b> ("although it is hard"); <b>despite / in spite of</b> pedem <b>substantivo</b> ou -ing ("despite the pressure"). <b>Even if</b> (“mesmo que”) vale para uma hipótese (“talvez aconteça, mas…”), enquanto <b>even though</b> trata de um fato real. Nunca "despite of" nem "although… but". O português usa <b>embora + subjuntivo</b> ("embora seja difícil") e <b>apesar de</b> + substantivo.' },
  /* ---- v101 · fase 4 ---- */
  { k:'cmp', ic:'⚖️', nome:'Comparativa (como / do que)', fam:'Subordinada adverbial comparativa', forma:'D',
    conjs:[{ en:'as … as', pt:'tão … quanto' }, { en:'than', pt:'do que' }, { en:'less … than', pt:'menos … do que' }, { en:'the same way as', pt:'do mesmo jeito que' }, { en:'like', pt:'como' }],
    est:'+ as/more/less + advérbio + as/than + sujeito + auxiliar',
    nota:'<b>Comparativa</b> — compara o modo/grau da ação com o de <b>outra pessoa</b>. Igualdade: <b>as + advérbio + as</b>; superioridade: <b>more + advérbio + than</b>; inferioridade: <b>less + advérbio + than</b>. Depois de as/than vem o sujeito + <b>só o auxiliar</b> (do/does/did, is/are, has/have, will…), nunca o verbo repetido: "She works as carefully as he <i>does</i>". No português o verbo some: "…quanto ele".' },
  { k:'conf', ic:'📐', nome:'Conformativa (conforme)', fam:'Subordinada adverbial conformativa', forma:'N',
    conjs:[{ en:'as', pt:'como' }, { en:'just as', pt:'exatamente como' }, { en:'according to', pt:'de acordo com', ini:true }, { en:'as per', pt:'conforme' }],
    est:'+ as + oração  |  + according to / as per + substantivo',
    nota:'<b>Conformativa</b> — diz que a ação segue o que foi combinado, planejado ou escrito. <b>As / just as</b> pedem uma <b>oração</b> ("as we planned"); <b>according to / as per</b> pedem um <b>substantivo</b> ("according to the plan"). Sempre "according <b>to</b>" (nunca "with").' },
  { k:'prop', ic:'📈', nome:'Proporcional (quanto mais…)', fam:'Subordinada adverbial proporcional', forma:'P',
    conjs:[{ en:'the more … the more', pt:'quanto mais … mais' }, { en:'the less … the less', pt:'quanto menos … menos' }, { en:'the more … the less', pt:'quanto mais … menos' }, { en:'the less … the more', pt:'quanto menos … mais' }, { en:'as', pt:'à medida que' }],
    est:'The more + oração, the more + oração  |  As + oração, oração + more',
    nota:'<b>Proporcional</b> — duas quantidades que variam juntas: <b>the + comparativo + oração, the + comparativo + oração</b>.' },
  /* ---- v103 ---- */
  { k:'csq', ic:'🎚️', nome:'Consecutiva intensiva (tão… que)', fam:'Subordinada adverbial consecutiva', forma:'Z',
    conjs:[{ en:'so … that', pt:'tão … que' }, { en:'so much that', pt:'tanto que' }, { en:'in such a way that', pt:'de tal modo que' }],
    est:'+ so + advérbio + that + sujeito + verbo',
    nota:'<b>Consecutiva intensiva</b> — a intensidade da ação gera uma <b>consequência</b>. <b>So + advérbio + that</b> mede o modo ("so carefully that…"); <b>so much that</b> mede a quantidade; <b>in such a way that</b> descreve o jeito. Depois de <b>that</b> vem uma oração completa, no tempo da principal (contínuos viram simples). Não confunda com <b>so that</b> (finalidade).' },
  { k:'subj', ic:'🔎', nome:'Subjetiva (It is … that / to)', fam:'Subordinada substantiva subjetiva', forma:'U',
    conjs:[{ en:'It is … that', pt:'É … que' }, { en:'It is … to', pt:'É … (infinitivo)' }],
    est:'It + be + adjetivo + that + oração  |  It + be + adjetivo + to + verbo',
    nota:'<b>Subjetiva</b> — a oração é o <b>sujeito</b> da frase. Em inglês o natural é começar com <b>it</b> vazio e deixar a oração para o fim: "It is clear <b>that</b> she works". Com <b>that</b> a oração mantém a sua frase completa (tempo, pronome, negação); com <b>to</b> o verbo fica no infinitivo e a frase generaliza ("It is important <b>to</b> work").' },
  { k:'pred', ic:'📌', nome:'Predicativa (The truth is that…)', fam:'Subordinada substantiva predicativa', forma:'Y',
    conjs:[{ en:'… is that', pt:'… é que' }],
    est:'The + substantivo + be + that + oração',
    nota:'<b>Predicativa</b> — a oração completa o verbo <b>be</b> depois de um substantivo abstrato: "The truth <b>is that</b> she works". Mantenha a ordem sujeito + verbo e use <b>that</b> (não "is because"). Em português: "A verdade <b>é que</b>…".' },
  /* ---- v104 ---- */
  { k:'oi', ic:'🧷', nome:'Objetiva indireta (about / on + oração)', fam:'Subordinada substantiva objetiva indireta', forma:'I',
    conjs:[{ en:'how', pt:'como' }, { en:'whether', pt:'se' }, { en:'-ing', pt:'(gerúndio)' }],
    est:'+ preposição do verbo + how / whether + it (ou sujeito) + be + adjetivo  |  + preposição + verbo-ing',
    nota:'<b>Objetiva indireta</b> — a oração completa um verbo que pede <b>preposição</b> (talk <b>about</b>, depend <b>on</b>, insist <b>on</b>…). Depois da preposição o inglês aceita <b>how / whether / wh-</b> + oração ou um verbo em <b>-ing</b>, nunca <i>that</i> nem <i>if</i> ("depend on whether", não "depend on if"). Na oração com how/whether a ordem é de afirmativa: "how difficult <b>it is</b>".' },
  /* ---- v161 ---- */
  { k:'oq', ic:'🔍', nome:'Pergunta indireta (what / where / which one…)', fam:'Subordinada substantiva objetiva direta interrogativa', forma:'G',
    conjs:[{ en:'what', pt:'o que', g:'What (objeto)' }, { en:'who', pt:'quem', g:'Who (objeto)' }, { en:'which one', pt:'qual', g:'Which one' }, { en:'where', pt:'onde', g:'Where' }, { en:'when', pt:'quando', g:'When' }, { en:'why', pt:'por que', g:'Why' }, { en:'how', pt:'como', g:'How' }, { en:'how long', pt:'quanto tempo', g:'How long' }, { en:'how often', pt:'com que frequência', g:'How often' }, { en:'how much', pt:'quanto', g:'How much' }, { en:'how many times', pt:'quantas vezes', g:'How many times' }, { en:'what time', pt:'a que horas', g:'What time' }, { en:'how far', pt:'até onde', g:'How far' }, { en:'how well', pt:'quão bem', g:'How well' }, { en:'if', pt:'se', g:'YN' }, { en:'whether', pt:'se', g:'YN' }],
    est:'+ palavra interrogativa + sujeito + verbo (ordem de afirmativa, sem do/does)',
    nota:'<b>Pergunta indireta</b> — a pergunta vira o objeto de um verbo de saber, perguntar ou explicar. Dentro dela a ordem é de afirmativa e não há do/does/did.' },
  /* ---- v105 ---- */
  { k:'cn', ic:'🗞️', nome:'Completiva nominal (the idea that…)', fam:'Subordinada substantiva completiva nominal', forma:'W',
    conjs:[{ en:'that', pt:'de que' }],
    est:'+ the + substantivo abstrato + that + it (ou sujeito) + be + adjetivo',
    nota:'<b>Completiva nominal</b> — a oração completa um <b>substantivo</b> (the idea, the fact, the rumor…), não o verbo: "She accepts the idea <b>that</b> it is hard". O <b>that</b> é conjunção e a oração é <b>completa</b> (tem sujeito próprio); por isso difere da relativa ("a laptop that she needs", onde falta o objeto). Em português o substantivo pede <b>preposição</b>: “a ideia <b>de que</b>…”.' },
  /* ---- v107 ---- */
  { k:'ap', ic:'✒️', nome:'Apositiva (one goal: to… / one idea: that…)', fam:'Subordinada substantiva apositiva', forma:'X',
    conjs:[{ en:': that', pt:': que' }, { en:': to', pt:': (infinitivo)' }],
    est:'+ one + substantivo + : that + oração  |  + one + substantivo + : to + verbo',
    nota:'<b>Apositiva</b> — a oração <b>explica</b> o substantivo que vem antes, separada por <b>dois-pontos</b>: "She has one goal<b>: to</b> earn more money" / "She accepts one idea<b>: that</b> it is risky". Substantivos de <b>conteúdo</b> (idea, fact, belief) levam <b>that</b> + oração; substantivos de <b>intenção</b> (goal, plan, dream, wish) levam <b>to</b> + verbo.' },
  /* ---- v135 · ORAÇÕES REDUZIDAS (classificadas pela função: adverbial · substantiva · adjetiva) ---- */
  { k:'rger', ic:'✂️', nome:'Reduzida de gerúndio (-ing)', fam:'Subordinada adverbial reduzida de gerúndio', forma:'V',
    conjs:[{ en:'while', pt:'(enquanto)' }, { en:'after', pt:'depois de', ini:true }, { en:'before', pt:'antes de' }, { en:'upon', pt:'ao', ini:true }, { en:'by', pt:'(gerúndio: meio)' }, { en:'without', pt:'sem' }, { en:'having', pt:'tendo + particípio', ini:true }, { en:'(só -ing)', pt:'(gerúndio)', ini:true }],
    est:'+ while/after/before/by/without + verbo-ing (mesmo sujeito da principal)',
    nota:'<b>Reduzida de gerúndio</b> — a 2ª oração perde o <b>sujeito</b> e o <b>tempo</b>: sobra só o verbo em <b>-ing</b>, que herda os dois da principal. Regra de ouro: <b>o sujeito é o mesmo</b> ("After finishing, <i>she</i> rests": quem terminou e quem descansa é ela); se o sujeito muda, não dá para reduzir.<br>Depois de preposição o inglês só aceita <b>-ing</b> (nunca infinitivo): <i>after working</i>, <i>before leaving</i>, <i>without asking</i>. Em português a preposição pede <b>infinitivo</b> ("depois de trabalhar", "antes de sair", "sem perguntar"), e o <b>gerúndio</b> fica para o modo e o "ao mesmo tempo" ("trabalha lendo").' },
  { k:'rpart', ic:'✂️', nome:'Reduzida de particípio (-ed)', fam:'Subordinada adverbial reduzida de particípio', forma:'V',
    conjs:[{ en:'once', pt:'uma vez', ini:true }, { en:'when', pt:'quando', ini:true }, { en:'if', pt:'se', ini:true }, { en:'although', pt:'embora', ini:true }, { en:'(só -ed)', pt:'(particípio)', ini:true }],
    est:'+ once/when/if/although + particípio (sujeito + be omitidos)',
    nota:'<b>Reduzida de particípio</b> — a conjunção fica e some o <b>sujeito + be</b>: "If <i>she is</i> needed" → "If needed". O particípio tem sentido <b>passivo ou de estado</b> (ela é chamada, ela está cansada), e o sujeito é o mesmo da principal. Abre a frase, com vírgula.<br>Em português acontece o mesmo ("se necessário", "quando solicitada", "embora cansada") e o particípio <b>concorda em gênero e número</b> com o sujeito.' },
  { k:'rinf', ic:'✂️', nome:'Objetiva reduzida de infinitivo (want to / enjoy -ing)', fam:'Subordinada substantiva objetiva direta reduzida de infinitivo', forma:'V',
    conjs:[{ en:'to', pt:'(infinitivo)' }, { en:'-ing', pt:'(gerúndio)' }],
    est:'+ verbo (want, decide…) + to + verbo base  |  + verbo (enjoy, avoid…) + verbo-ing',
    nota:'<b>Objetiva direta reduzida</b> — em vez de "She wants that she saves money", o inglês reduz ao infinitivo: <b>want to save</b>. É a oração reduzida mais usada no dia a dia, e vale quando <b>quem quer e quem faz é a mesma pessoa</b>.<br>Cada verbo escolhe a sua forma: <b>want, need, decide, hope, learn, plan</b> pedem <b>to + verbo</b>; <b>enjoy, avoid, finish, suggest, practice</b> pedem <b>-ing</b>; <b>like, love, prefer, hate, start</b> aceitam as duas. Em português as duas viram infinitivo ("quer economizar", "evita gastar").' },
  { k:'rrel', ic:'✂️', nome:'Relativa reduzida (-ing / -ed / to)', fam:'Subordinada adjetiva reduzida', forma:'V',
    conjs:[{ en:'-ing', pt:'(gerúndio)' }, { en:'-ed', pt:'(particípio)' }, { en:'to', pt:'(infinitivo)' }],
    est:'+ substantivo + verbo-ing / particípio / to + verbo',
    nota:'<b>Relativa reduzida</b> — corta o pronome relativo e o auxiliar: "a laptop <i>that is made</i> in Brazil" → "a laptop <b>made</b> in Brazil". O <b>-ing</b> descreve o que o substantivo faz ("the man <b>working</b> here"); o <b>-ed</b> descreve o que se fez com ele ("a book <b>written</b> in English"); o <b>to + verbo</b> diz para que serve ou o que fazer com ele ("a laptop <b>to use</b> every day", "the first <b>to arrive</b>").<br>Em português o particípio adjetivo é comum ("feito no Brasil"), mas o gerúndio adjetivo é raro: preferimos "que trabalha aqui".' }
];
const O2_POSS = { I:'my', You:'your', He:'his', She:'her', It:'its', We:'our', They:'their' };
const O2_PT_POSS = { I:['meu','minha','meus','minhas'], You:['seu','sua','seus','suas'], He:['seu','sua','seus','suas'], She:['seu','sua','seus','suas'],
                     It:['seu','sua','seus','suas'], We:['nosso','nossa','nossos','nossas'], They:['seu','sua','seus','suas'] };
function o2Sub(s, pr, pt){
  if(!pt) return s.replace(/\{p\}/g, O2_POSS[pr] || 'my');
  const t = O2_PT_POSS[pr] || O2_PT_POSS.I;
  return s.replace(/\{MP\}/g, t[2]).replace(/\{FP\}/g, t[3]).replace(/\{M\}/g, t[0]).replace(/\{F\}/g, t[1]);
}
/* ================= v101 · fase 4: comparativa · conformativa · proporcional ================= */
/* advérbios por tema: en=pt|g  (g: a = advérbio em -mente · m/f = "com tanto(a) + substantivo") */
const O2_CMP_TXT = `afeto|openly=abertamente|a; often=frequência|f; sincerely=sinceramente|a
arte|carefully=cuidado|m; creatively=criatividade|f; often=frequência|f
casa|often=frequência|f; carefully=cuidado|m; calmly=calma|f
comida|often=frequência|f; carefully=cuidado|m; quickly=rapidez|f
compra|often=frequência|f; carefully=cuidado|m; wisely=sabedoria|f
corpo|often=frequência|f; carefully=cuidado|m; regularly=regularidade|f
esporte|seriously=seriedade|f; often=frequência|f; regularly=regularidade|f
estudo|seriously=seriedade|f; carefully=cuidado|m; regularly=regularidade|f
fala|clearly=clareza|f; politely=educação|f; confidently=confiança|f
fazer|carefully=cuidado|m; quickly=rapidez|f; efficiently=eficiência|f
juiz|carefully=cuidado|m; fairly=justiça|f; seriously=seriedade|f
lei|carefully=cuidado|m; strictly=rigor|m; seriously=seriedade|f
mat|carefully=cuidado|m; accurately=precisão|f; quickly=rapidez|f
mente|carefully=cuidado|m; seriously=seriedade|f; clearly=clareza|f
move|often=frequência|f; quickly=rapidez|f; carefully=cuidado|m
muda|gradually=gradualmente|a; quickly=rapidez|f; often=frequência|f
natureza|often=frequência|f; regularly=regularidade|f; gradually=gradualmente|a
tech|efficiently=eficiência|f; quickly=rapidez|f; carefully=cuidado|m
trab|seriously=seriedade|f; efficiently=eficiência|f; carefully=cuidado|m
troca|often=frequência|f; carefully=cuidado|m; quickly=rapidez|f`;
/* proporcional: verbo:quantidade=pt (o 2º termo: "the more MONEY she earns") */
const O2_PROP_TXT = `afeto|understand:=; learn:=; know:=
arte|learn:=; improve:=; understand:=
casa|save:money=dinheiro; spend:money=dinheiro; learn:=
comida|save:money=dinheiro; spend:money=dinheiro; learn:=
compra|save:money=dinheiro; spend:money=dinheiro; earn:money=dinheiro
corpo|improve:=; learn:=; know:=
esporte|improve:=; win:=; learn:=
estudo|learn:=; understand:=; know:=
fala|learn:=; understand:=; improve:=
fazer|learn:=; improve:=; save:time=tempo
juiz|understand:=; learn:=; know:=
lei|learn:=; understand:=; know:=
mat|learn:=; understand:=; know:=
mente|learn:=; understand:=; know:=
move|learn:=; save:time=tempo; improve:=
muda|learn:=; improve:=; understand:=
natureza|learn:=; understand:=; know:=
tech|learn:=; save:time=tempo; improve:=
trab|earn:money=dinheiro; learn:=; improve:=
troca|save:money=dinheiro; earn:money=dinheiro; learn:=`;
const O2_CONF_GEN = [
  { en:'the plan', pt:'o plano', cl:'we planned', clpt:'planejamos' },
  { en:'the agreement', pt:'o combinado', cl:'we agreed', clpt:'combinamos' }
];
const O2_CONF_3 = {
  def:   { en:'the instructions', pt:'as instruções', cl:'the instructions say', clpt:'dizem as instruções' },
  tech:  { en:'the documentation', pt:'a documentação', cl:'the documentation says', clpt:'diz a documentação' },
  lei:   { en:'the law', pt:'a lei', cl:'the law requires', clpt:'exige a lei' },
  trab:  { en:'the contract', pt:'o contrato', cl:'the contract states', clpt:'estabelece o contrato' },
  compra:{ en:'the contract', pt:'o contrato', cl:'the contract says', clpt:'diz o contrato' },
  troca: { en:'the contract', pt:'o contrato', cl:'the contract says', clpt:'diz o contrato' },
  comida:{ en:'the recipe', pt:'a receita', cl:'the recipe says', clpt:'diz a receita' },
  esporte:{ en:'the coach', pt:'o treinador', cl:'the coach instructed', clpt:'orientou o treinador' },
  estudo:{ en:'the teacher', pt:'o professor', cl:'the teacher explained', clpt:'explicou o professor' },
  juiz:  { en:'the rules', pt:'as regras', cl:'the rules say', clpt:'dizem as regras' },
  fala:  { en:'the script', pt:'o roteiro', cl:'the script says', clpt:'diz o roteiro' },
  arte:  { en:'the brief', pt:'o briefing', cl:'the brief says', clpt:'diz o briefing' },
  move:  { en:'the map', pt:'o mapa', cl:'the map shows', clpt:'mostra o mapa' },
  corpo: { en:'the doctor', pt:'o médico', cl:'the doctor advised', clpt:'recomendou o médico' }
};
const O2_CMP = {}, O2_PROP = {};
(function(){
  const lin = (txt, fn) => txt.split('\n').forEach(l => { const i = l.indexOf('|'); if(i > 0) fn(l.slice(0, i), l.slice(i + 1).split('; ')); });
  lin(O2_CMP_TXT, (t, it) => { O2_CMP[t] = it.map(x => { const [a, b] = x.split('='), [pt, g] = b.split('|'); return { en:a, pt, g }; }); });
  lin(O2_PROP_TXT, (t, it) => { O2_PROP[t] = it.map(x => { const j = x.indexOf(':'), r = x.slice(j + 1), e = r.indexOf('='); return { v:x.slice(0, j), q:r.slice(0, e), ptq:r.slice(e + 1) }; }); });
})();
function o2TemaTab(tab, v){
  for(const c of verbCats(v)) if(tab[c]) return tab[c];
  return tab.trab;
}
const o2ConfOpcoes = v => O2_CONF_GEN.concat([O2_CONF_3[verbCats(v).find(c => O2_CONF_3[c])] || O2_CONF_3.def]);
/* grau: 'eq' · 'sup' · 'inf' → português do advérbio ("tão cuidadosamente" · "com mais cuidado") */
function o2CmpPT(op, grau){
  const q = grau === 'eq' ? (op.g === 'a' ? 'tão' : op.g === 'm' ? 'tanto' : 'tanta') : grau === 'sup' ? 'mais' : 'menos';
  return op.g === 'a' ? q + ' ' + op.pt : 'com ' + q + ' ' + op.pt;
}
/* ================= v135 · ORAÇÕES REDUZIDAS — dados e formas =================
   Reduzida = oração subordinada sem conjunção própria (ou só com a preposição) e sem sujeito, com o verbo numa forma NOMINAL:
   gerúndio (-ing), particípio (-ed) ou infinitivo (to). O sujeito e o tempo vêm da oração principal. */
/* verbos que aceitam objetiva reduzida: c = formas aceitas (to · -ing) · prep = preposição do português ("termina DE", "concorda EM") */
const O2_RI = {
  want:{ c:['to'] }, need:{ c:['to'] }, decide:{ c:['to'] }, plan:{ c:['to'] }, hope:{ c:['to'] }, try:{ c:['to'] }, learn:{ c:['to'], prep:'a' },
  promise:{ c:['to'] }, choose:{ c:['to'] }, intend:{ c:['to'] }, wish:{ c:['to'] }, agree:{ c:['to'], prep:'em' },
  enjoy:{ c:['-ing'], prep:'de', sub:['aproveit', 'gost'] }, avoid:{ c:['-ing'] }, finish:{ c:['-ing'], prep:'de' }, suggest:{ c:['-ing'] }, consider:{ c:['-ing'] }, practice:{ c:['-ing'] },
  stop:{ c:['-ing'], prep:'de' }, imagine:{ c:['-ing'] }, quit:{ c:['-ing'], prep:'de' }, postpone:{ c:['-ing'] }, recommend:{ c:['-ing'] }, deny:{ c:['-ing'] }, admit:{ c:['-ing'] },
  like:{ c:['to', '-ing'], prep:'de' }, love:{ c:['to', '-ing'] }, prefer:{ c:['to', '-ing'] }, hate:{ c:['to', '-ing'] }, start:{ c:['to', '-ing'], prep:'a' }, begin:{ c:['to', '-ing'], prep:'a' }, continue:{ c:['to', '-ing'], prep:'a' }
};
const O2_RI_SUG = ['want', 'decide', 'enjoy', 'avoid', 'like'];
function o2RinfEstado(){
  const verb = verbById(state.verbo), d = O2_RI[verb.id];
  if(!d) return { ok:false, msg:'A objetiva reduzida parte de um verbo que aceita <b>to + verbo</b> ou <b>verbo-ing</b> como objeto (want <b>to save</b>, enjoy <b>saving</b>…). Escolha um destes no dial ③:' };
  if(state.colocacao !== null) return { ok:false, msg:'A oração reduzida <b>é</b> o objeto do verbo, então não combina com uma colocação do dial ⑨. Tire a colocação para usar este tipo.', semSug:true };
  return { ok:true, d };
}
/* v137 · rinf: 3 complementos CURADOS por verbo principal (cada um combina com o que o verbo pede: "avoid" + algo evitável, "promise" + algo prometível) */
const _o = (en, pt) => ({ en, pt });
const O2_RI_OPC = {
  want:[_o('save more money', 'economizar mais dinheiro'), _o('learn a new skill', 'aprender uma nova habilidade'), _o('travel more', 'viajar mais')],
  need:[_o('rest a little', 'descansar um pouco'), _o('talk to the manager', 'falar com o gerente'), _o('update the report', 'atualizar o relatório'), _o('save money', 'economizar dinheiro')],
  decide:[_o('move to another city', 'mudar para outra cidade'), _o('change jobs', 'mudar de emprego'), _o('start a business', 'abrir um negócio'), _o('make better decisions', 'tomar decisões melhores')],
  plan:[_o('launch the product', 'lançar o produto'), _o('visit the client', 'visitar o cliente'), _o('travel in July', 'viajar em julho'), _o('meet the deadline', 'cumprir o prazo')],
  hope:[_o('get the job', 'conseguir o emprego'), _o('pass the exam', 'passar na prova'), _o('see you soon', 'ver você em breve'), _o('build trust', 'construir confiança')],
  try:[_o('fix the problem', 'resolver o problema'), _o('speak more slowly', 'falar mais devagar'), _o('stay calm', 'manter a calma')],
  learn:[_o('use the system', 'usar o sistema'), _o('cook at home', 'cozinhar em casa'), _o('speak in public', 'falar em público'), _o('avoid mistakes', 'evitar erros')],
  promise:[_o('arrive on time', 'chegar na hora'), _o('call you tomorrow', 'ligar para você amanhã'), _o('keep the secret', 'guardar o segredo'), _o('share {p} ideas', 'compartilhar {FP} ideias')],
  choose:[_o('stay at home', 'ficar em casa'), _o('work remotely', 'trabalhar a distância'), _o('study at night', 'estudar à noite')],
  intend:[_o('finish the project', 'terminar o projeto'), _o('talk to the team', 'conversar com a equipe'), _o('leave early', 'sair cedo')],
  wish:[_o('change the plan', 'mudar o plano'), _o('speak to the manager', 'falar com o gerente'), _o('know the truth', 'saber a verdade')],
  agree:[_o('meet on Monday', 'se encontrar na segunda'), _o('share the costs', 'dividir os custos'), _o('sign the contract', 'assinar o contrato')],
  enjoy:[_o('cook for friends', 'cozinhar para os amigos'), _o('read at night', 'ler à noite'), _o('walk in the park', 'caminhar no parque'), _o('show {p} feelings', 'demonstrar {MP} sentimentos')],
  avoid:[_o('drive at night', 'dirigir à noite'), _o('spend too much', 'gastar demais'), _o('argue with clients', 'discutir com os clientes')],
  finish:[_o('write the report', 'escrever o relatório'), _o('clean the house', 'limpar a casa'), _o('read the book', 'ler o livro')],
  suggest:[_o('take a break', 'fazer uma pausa'), _o('meet earlier', 'se encontrar mais cedo'), _o('ask for help', 'pedir ajuda')],
  consider:[_o('change jobs', 'mudar de emprego'), _o('move abroad', 'morar no exterior'), _o('hire a manager', 'contratar um gerente')],
  practice:[_o('speak English', 'falar inglês'), _o('play the piano', 'tocar piano'), _o('write every day', 'escrever todo dia')],
  stop:[_o('smoke', 'fumar'), _o('argue about money', 'discutir por dinheiro'), _o('work late', 'trabalhar até tarde')],
  imagine:[_o('live by the sea', 'morar à beira-mar'), _o('travel the world', 'viajar pelo mundo'), _o('work from home', 'trabalhar em casa')],
  quit:[_o('smoke', 'fumar'), _o('drink soda', 'tomar refrigerante'), _o('work there', 'trabalhar lá')],
  postpone:[_o('sign the contract', 'assinar o contrato'), _o('start the project', 'começar o projeto'), _o('call the client', 'ligar para o cliente')],
  recommend:[_o('book early', 'reservar com antecedência'), _o('try the soup', 'experimentar a sopa'), _o('take the train', 'pegar o trem'), _o('protect the team', 'proteger a equipe')],
  deny:[_o('break the rules', 'quebrar as regras'), _o('take the money', 'pegar o dinheiro'), _o('know the answer', 'saber a resposta')],
  admit:[_o('make a mistake', 'cometer um erro'), _o('forget the date', 'esquecer a data'), _o('lose the file', 'perder o arquivo')],
  like:[_o('walk home', 'voltar a pé para casa'), _o('cook dinner', 'preparar o jantar'), _o('listen to music', 'ouvir música')],
  love:[_o('travel', 'viajar'), _o('watch movies', 'assistir a filmes'), _o('cook for friends', 'cozinhar para os amigos')],
  prefer:[_o('stay home', 'ficar em casa'), _o('work alone', 'trabalhar sozinho'), _o('pay in cash', 'pagar em dinheiro'), _o('be fair', 'ser justo')],
  hate:[_o('wait in line', 'esperar na fila'), _o('get up early', 'acordar cedo'), _o('miss the bus', 'perder o ônibus')],
  start:[_o('work early', 'trabalhar cedo'), _o('study English', 'estudar inglês'), _o('save money', 'economizar dinheiro'), _o('improve the results', 'melhorar os resultados')],
  begin:[_o('work on the plan', 'trabalhar no plano'), _o('learn Spanish', 'aprender espanhol'), _o('write the report', 'escrever o relatório')],
  continue:[_o('study every day', 'estudar todo dia'), _o('work on the project', 'trabalhar no projeto'), _o('save money', 'economizar dinheiro'), _o('improve the situation', 'melhorar a situação')]
};
/* v142 · rinf: mais 2 complementos de NEGÓCIOS por verbo (foco TOEIC / ambiente corporativo) */
Object.entries({
  want:'close the deal=fechar o negócio|expand the team=ampliar a equipe',
  need:'review the contract=revisar o contrato|schedule a meeting=marcar uma reunião',
  decide:'hire a new manager=contratar um novo gerente|launch the product=lançar o produto',
  plan:'expand the team=ampliar a equipe|open a new office=abrir um novo escritório',
  hope:'close the deal=fechar o negócio|win the contract=ganhar o contrato',
  try:'reduce the costs=reduzir os custos|finish on time=terminar no prazo',
  learn:'manage the budget=gerenciar o orçamento|write reports=escrever relatórios',
  promise:'deliver on time=entregar no prazo|send the report=enviar o relatório',
  choose:'invest in training=investir em treinamento|accept the offer=aceitar a oferta',
  intend:'sign the contract=assinar o contrato|reduce the risks=reduzir os riscos',
  wish:'improve the results=melhorar os resultados|join the team=entrar na equipe',
  agree:'accept the terms=aceitar os termos|reduce the price=reduzir o preço',
  enjoy:'negotiate with clients=negociar com clientes|lead the team=liderar a equipe',
  avoid:'miss the deadline=perder o prazo|lose clients=perder clientes',
  finish:'review the contract=revisar o contrato|prepare the slides=preparar os slides',
  suggest:'postpone the meeting=adiar a reunião|hire more people=contratar mais pessoas',
  consider:'accept the offer=aceitar a oferta|open a new office=abrir um novo escritório',
  practice:'give presentations=fazer apresentações|negotiate prices=negociar preços',
  stop:'waste money=desperdiçar dinheiro|delay the project=atrasar o projeto',
  imagine:'lead a team=liderar uma equipe|run a company=dirigir uma empresa',
  quit:'waste time=perder tempo|delay the answer=adiar a resposta',
  postpone:'launch the product=lançar o produto|review the budget=revisar o orçamento',
  recommend:'invest in training=investir em treinamento|sign the contract=assinar o contrato',
  deny:'make the mistake=cometer o erro|sign the form=assinar o formulário',
  admit:'miss the deadline=perder o prazo|ignore the rules=ignorar as regras',
  like:'work in a team=trabalhar em equipe|solve problems=resolver problemas',
  love:'solve problems=resolver problemas|lead projects=liderar projetos',
  prefer:'work in a team=trabalhar em equipe|meet in person=se encontrar pessoalmente',
  hate:'miss deadlines=perder prazos|work overtime=fazer hora extra',
  start:'build a team=montar uma equipe|run the project=tocar o projeto',
  begin:'review the budget=revisar o orçamento|meet the clients=encontrar os clientes',
  continue:'invest in training=investir em treinamento|improve the process=melhorar o processo'
}).forEach(([id, t]) => t.split('|').forEach(x => O2_RI_OPC[id].push({ en:x.split('=')[0], pt:x.split('=')[1] })));
/* v137 · rger: o complemento depende do PAPEL da conjunção (antes todas usavam "metas": "by reaching the goal", "while meeting the deadline").
   while = ação paralela · after/before = etapa anterior/posterior · upon = gatilho · by = meio · without = o que se omite · having = ação já concluída · (só -ing) = modo */
const O2_RG_POOL = {
  while:[_o('listen to music', 'ouvir música'), _o('talk on the phone', 'falar ao telefone'), _o('wait for the answer', 'esperar a resposta'), _o('drink coffee', 'tomar café'), _o('take notes', 'fazer anotações'), _o('check the messages', 'ver as mensagens'), _o('enjoy the meal', 'aproveitar a refeição'), _o('improve {p} performance', 'melhorar {M} desempenho'), _o('learn something new', 'aprender algo novo')],
  step:[_o('check the details', 'conferir os detalhes'), _o('read the instructions', 'ler as instruções'), _o('talk to the team', 'conversar com a equipe'), _o('call the client', 'ligar para o cliente'), _o('save the file', 'salvar o arquivo'), _o('review the plan', 'revisar o plano'), _o('take a break', 'fazer uma pausa'), _o('solve the problem', 'resolver o problema'), _o('get a better price', 'conseguir um preço melhor'), _o('reach an agreement', 'chegar a um acordo'), _o('meet the deadline', 'cumprir o prazo')],
  upon:[_o('arrive at work', 'chegar ao trabalho'), _o('read the message', 'ler a mensagem'), _o('hear the news', 'ouvir a notícia'), _o('see the results', 'ver os resultados'), _o('receive the invitation', 'receber o convite')],
  by:[_o('ask questions', 'fazer perguntas'), _o('practice every day', 'praticar todo dia'), _o('read carefully', 'ler com atenção'), _o('take notes', 'fazer anotações'), _o('listen to the clients', 'ouvir os clientes'), _o('compare the options', 'comparar as opções'), _o('avoid mistakes', 'evitar erros'), _o('avoid the traffic', 'evitar o trânsito'), _o('get a better price', 'conseguir um preço melhor'), _o('solve the problem', 'resolver o problema')],
  without:[_o('ask for help', 'pedir ajuda'), _o('make noise', 'fazer barulho'), _o('check the details', 'conferir os detalhes'), _o('say a word', 'dizer uma palavra'), _o('waste time', 'perder tempo'), _o('make mistakes', 'cometer erros')],
  having:[_o('finish the report', 'terminar o relatório'), _o('check the data', 'conferir os dados'), _o('read the contract', 'ler o contrato'), _o('talk to the team', 'conversar com a equipe'), _o('learn the basics', 'aprender o básico')],
  modo:[_o('work hard', 'trabalhar duro'), _o('listen carefully', 'ouvir com atenção'), _o('plan ahead', 'planejar com antecedência'), _o('ask questions', 'fazer perguntas'), _o('stay calm', 'manter a calma')]
};
/* v137 · rger por TEMA do verbo: dentro de cada papel, os complementos do campo do verbo vêm primeiro (o resto é neutro e completa a lista) */
const O2_RG_TEMA = {
  trab:{ while:[_o('answer emails', 'responder e-mails'), _o('attend the meeting', 'participar da reunião')], step:[_o('update the report', 'atualizar o relatório'), _o('check the schedule', 'conferir a agenda')], by:[_o('set clear goals', 'definir metas claras'), _o('track the results', 'acompanhar os resultados')], without:[_o('miss the deadline', 'perder o prazo'), _o('ignore the rules', 'ignorar as regras')], modo:[_o('follow the plan', 'seguir o plano')] },
  estudo:{ while:[_o('read the book', 'ler o livro')], step:[_o('review the notes', 'revisar as anotações')], by:[_o('solve exercises', 'resolver exercícios'), _o('review the mistakes', 'revisar os erros')], without:[_o('skip the lessons', 'pular as aulas')], modo:[_o('study hard', 'estudar com afinco')] },
  fala:{ while:[_o('listen to the other side', 'ouvir o outro lado')], step:[_o('prepare the speech', 'preparar o discurso')], by:[_o('use simple words', 'usar palavras simples'), _o('repeat the question', 'repetir a pergunta')], without:[_o('raise {p} voice', 'levantar {F} voz')], modo:[_o('speak clearly', 'falar com clareza')] },
  comida:{ while:[_o('stir the sauce', 'mexer o molho')], step:[_o('wash the vegetables', 'lavar os legumes')], by:[_o('use fresh ingredients', 'usar ingredientes frescos'), _o('follow the recipe', 'seguir a receita')], without:[_o('add salt', 'colocar sal')], modo:[_o('taste the sauce', 'provar o molho')] },
  move:{ while:[_o('listen to the radio', 'ouvir o rádio')], step:[_o('check the map', 'conferir o mapa')], by:[_o('follow the map', 'seguir o mapa')], without:[_o('stop on the way', 'parar no caminho')], modo:[_o('drive carefully', 'dirigir com cuidado')] },
  compra:{ while:[_o('wait in line', 'esperar na fila')], step:[_o('compare the prices', 'comparar os preços'), _o('read the reviews', 'ler as avaliações')], by:[_o('negotiate the price', 'negociar o preço'), _o('compare the prices', 'comparar os preços')], without:[_o('check the price', 'conferir o preço')], modo:[_o('compare the options', 'comparar as opções')] },
  tech:{ while:[_o('run the test', 'rodar o teste')], step:[_o('back up the data', 'fazer backup dos dados'), _o('test the code', 'testar o código')], by:[_o('test the code', 'testar o código'), _o('update the system', 'atualizar o sistema')], without:[_o('save the file', 'salvar o arquivo'), _o('back up the data', 'fazer backup dos dados')], modo:[_o('work offline', 'trabalhar offline')] },
  casa:{ while:[_o('watch TV', 'assistir TV')], step:[_o('clean the kitchen', 'limpar a cozinha')], by:[_o('follow the recipe', 'seguir a receita')], without:[_o('make a mess', 'fazer bagunça')], modo:[_o('take {p} time', 'ter calma')] },
  corpo:{ step:[_o('warm up', 'aquecer')], by:[_o('eat well', 'comer bem'), _o('sleep enough', 'dormir o suficiente')], without:[_o('feel pain', 'sentir dor'), _o('skip meals', 'pular refeições')], modo:[_o('breathe slowly', 'respirar devagar')] },
  juiz:{ while:[_o('listen to the witnesses', 'ouvir as testemunhas')], step:[_o('read the evidence', 'ler as provas'), _o('hear both sides', 'ouvir os dois lados')], by:[_o('weigh the evidence', 'pesar as provas'), _o('follow the rules', 'seguir as regras')], without:[_o('hear both sides', 'ouvir os dois lados'), _o('check the facts', 'conferir os fatos')], modo:[_o('stay neutral', 'manter a neutralidade')] },
  afeto:{ while:[_o('hold hands', 'dar as mãos'), _o('talk about the day', 'conversar sobre o dia')], step:[_o('say thank you', 'agradecer'), _o('make plans', 'fazer planos')], by:[_o('listen with care', 'ouvir com atenção'), _o('spend time together', 'passar tempo juntos')], without:[_o('say goodbye', 'se despedir'), _o('hurt anyone', 'magoar ninguém')], modo:[_o('smile warmly', 'sorrir com carinho')] },
  esporte:{ while:[_o('wear a helmet', 'usar capacete')], step:[_o('warm up', 'aquecer'), _o('stretch the legs', 'alongar as pernas')], by:[_o('train every day', 'treinar todo dia'), _o('follow the coach', 'seguir o treinador')], without:[_o('break the rules', 'quebrar as regras'), _o('lose focus', 'perder o foco')], modo:[_o('play fair', 'jogar limpo')] },
  mat:{ while:[_o('check the steps', 'conferir as etapas')], step:[_o('check the numbers', 'conferir os números'), _o('write the formula', 'escrever a fórmula')], by:[_o('use a formula', 'usar uma fórmula'), _o('break the problem into parts', 'dividir o problema em partes')], without:[_o('use a calculator', 'usar calculadora'), _o('skip the steps', 'pular as etapas')], modo:[_o('count carefully', 'contar com cuidado')] },
  fazer:{ step:[_o('gather the materials', 'reunir os materiais'), _o('plan the steps', 'planejar as etapas')], by:[_o('follow the instructions', 'seguir as instruções'), _o('start small', 'começar pequeno')], without:[_o('read the instructions', 'ler as instruções')], modo:[_o('work step by step', 'trabalhar passo a passo')] },
  natureza:{ while:[_o('watch the birds', 'observar os pássaros'), _o('walk in the forest', 'caminhar na floresta')], step:[_o('check the weather', 'ver a previsão do tempo')], by:[_o('plant trees', 'plantar árvores'), _o('save water', 'economizar água')], without:[_o('harm the animals', 'machucar os animais'), _o('leave trash', 'deixar lixo')], modo:[_o('walk slowly', 'caminhar devagar')] },
  arte:{ step:[_o('sketch the idea', 'esboçar a ideia'), _o('choose the colors', 'escolher as cores')], by:[_o('mix the colors', 'misturar as cores'), _o('study the masters', 'estudar os mestres')], without:[_o('copy anyone', 'copiar ninguém'), _o('lose the rhythm', 'perder o ritmo')], while:[_o('look at the picture', 'olhar o quadro')], modo:[_o('work with passion', 'trabalhar com paixão')] },
  lei:{ while:[_o('read the contract', 'ler o contrato')], step:[_o('read the contract', 'ler o contrato'), _o('check the law', 'conferir a lei')], by:[_o('follow the law', 'seguir a lei'), _o('hire a lawyer', 'contratar um advogado')], without:[_o('break the law', 'violar a lei'), _o('sign anything', 'assinar nada')], modo:[_o('follow the rules', 'seguir as regras')] },
  muda:{ while:[_o('adapt to the new routine', 'se adaptar à nova rotina')], step:[_o('make a plan', 'fazer um plano'), _o('talk to the team', 'conversar com a equipe')], by:[_o('change one habit at a time', 'mudar um hábito por vez'), _o('test small changes', 'testar pequenas mudanças')], without:[_o('lose focus', 'perder o foco'), _o('change the plan', 'mudar o plano')], modo:[_o('adapt quickly', 'se adaptar rápido')] },
  troca:{ while:[_o('talk about the price', 'conversar sobre o preço')], step:[_o('agree on the terms', 'combinar os termos'), _o('check the offer', 'conferir a oferta')], by:[_o('offer something in return', 'oferecer algo em troca'), _o('share the costs', 'dividir os custos')], without:[_o('ask for anything', 'pedir nada'), _o('check the terms', 'conferir os termos')], modo:[_o('trade fairly', 'negociar com justiça')] },
  mente:{ while:[_o('look at the evidence', 'olhar as evidências')], step:[_o('weigh the options', 'avaliar as opções')], by:[_o('think carefully', 'pensar com cuidado')], without:[_o('think twice', 'pensar duas vezes')], modo:[_o('think carefully', 'pensar com cuidado')] }
};
/* v140 · complementos extras por campo (mais "modo" e "while", que eram os papéis mais magros) */
`compra|without: read the terms=ler os termos
estudo|step: organize the notes=organizar as anotações|without: copy the answers=copiar as respostas
fala|step: practice the opening=ensaiar a abertura|without: interrupt anyone=interromper ninguém
comida|step: wash {p} hands=lavar {FP} mãos|without: burn the food=queimar a comida
move|step: plan the route=planejar o trajeto|by: avoid the traffic=evitar o trânsito|without: get lost=se perder
casa|step: gather the supplies=reunir os materiais|by: make a list=fazer uma lista|without: make noise=fazer barulho
natureza|step: pack water=levar água
mente|step: gather the facts=reunir os fatos|by: ask questions=fazer perguntas|without: rush=se apressar
corpo|while: listen to music=ouvir música|step: drink water=beber água
fazer|while: listen to music=ouvir música|without: ask for help=pedir ajuda
trab|modo: work efficiently=trabalhar com eficiência|while: check the numbers=conferir os números
estudo|modo: read carefully=ler com atenção|while: listen to the teacher=ouvir o professor
fala|modo: listen carefully=ouvir com atenção|while: look at the audience=olhar para o público
comida|modo: work cleanly=trabalhar com limpeza|while: set the table=pôr a mesa
move|modo: stay alert=ficar atento|while: look at the scenery=olhar a paisagem
compra|modo: compare carefully=comparar com cuidado|while: check the prices online=conferir os preços online
tech|modo: stay focused=manter o foco|modo: test often=testar com frequência|while: read the logs=ler os logs
casa|modo: work carefully=trabalhar com cuidado|while: listen to the radio=ouvir o rádio
corpo|modo: stay relaxed=ficar relaxado|while: stretch the legs=alongar as pernas
mente|modo: stay open=manter a mente aberta|while: read the evidence=ler as provas
juiz|modo: act fairly=agir com justiça|while: take notes=anotar
afeto|modo: speak softly=falar baixinho
esporte|modo: stay focused=manter o foco|while: listen to the coach=ouvir o treinador
mat|modo: work step by step=trabalhar passo a passo|while: write the steps=escrever as etapas
fazer|modo: work patiently=trabalhar com paciência|while: check the instructions=conferir as instruções
natureza|modo: move quietly=andar em silêncio
arte|modo: work patiently=trabalhar com paciência|while: sketch the scene=esboçar a cena
lei|modo: read carefully=ler com atenção|while: take notes=anotar
muda|modo: stay flexible=manter a flexibilidade|while: watch the results=acompanhar os resultados
troca|modo: negotiate calmly=negociar com calma|while: check the terms=conferir os termos`.split('\n').forEach(l => {
  const p = l.split('|'), d = O2_RG_TEMA[p[0]];
  p.slice(1).forEach(x => { const m = x.match(/^(\w+): (.*)$/); if(m) (d[m[1]] = d[m[1]] || []).push({ en:m[2].split('=')[0], pt:m[2].split('=')[1] }); });
});
/* v138 · rger por VERBO: os verbos mais usados têm complementos próprios (passam à frente do tema) */
const O2_RG_VERBO = {
  write:{ step:[_o('plan the text', 'planejar o texto'), _o('gather the data', 'reunir os dados')], by:[_o('revise the draft', 'revisar o rascunho'), _o('read it aloud', 'ler em voz alta')], without:[_o('check the grammar', 'conferir a gramática')] },
  read:{ step:[_o('find a quiet place', 'achar um lugar tranquilo')], by:[_o('underline the key points', 'sublinhar os pontos principais')], without:[_o('skip the details', 'pular os detalhes')] },
  buy:{ step:[_o('set a budget', 'definir um orçamento')], by:[_o('wait for a sale', 'esperar uma promoção')], without:[_o('check the warranty', 'conferir a garantia')] },
  sell:{ step:[_o('set the price', 'definir o preço'), _o('take photos', 'tirar fotos')], by:[_o('offer a discount', 'oferecer um desconto'), _o('know the product', 'conhecer o produto')], without:[_o('lie about the price', 'mentir sobre o preço')] },
  drive:{ step:[_o('check the tires', 'conferir os pneus')], by:[_o('avoid the rush hour', 'evitar o horário de pico')], without:[_o('use the phone', 'usar o celular'), _o('forget the seat belt', 'esquecer o cinto')] },
  call:{ step:[_o('write down the questions', 'anotar as perguntas'), _o('find the number', 'achar o número')], by:[_o('leave a message', 'deixar um recado')] },
  meet:{ step:[_o('confirm the time', 'confirmar o horário'), _o('send the agenda', 'enviar a pauta')], by:[_o('arrive early', 'chegar cedo')] },
  learn:{ step:[_o('read the basics', 'ler o básico')], by:[_o('make mistakes', 'cometer erros'), _o('ask questions', 'fazer perguntas')] },
  speak:{ step:[_o('take a deep breath', 'respirar fundo')], by:[_o('practice with friends', 'praticar com amigos')], without:[_o('read the notes', 'ler as anotações')] },
  send:{ step:[_o('check the address', 'conferir o endereço'), _o('attach the file', 'anexar o arquivo')], without:[_o('attach the file', 'anexar o arquivo')] },
  help:{ step:[_o('ask what they need', 'perguntar do que precisam')], by:[_o('listen first', 'ouvir primeiro'), _o('share the work', 'dividir o trabalho')], without:[_o('ask for anything', 'pedir nada')] },
  travel:{ step:[_o('book the tickets', 'comprar as passagens'), _o('check the passport', 'conferir o passaporte')], by:[_o('take the night train', 'pegar o trem noturno')], without:[_o('plan too much', 'planejar demais')] },
  build:{ step:[_o('draw the plan', 'desenhar o projeto'), _o('buy the materials', 'comprar os materiais')], by:[_o('start small', 'começar pequeno')], without:[_o('skip the plan', 'pular o projeto')] },
  fix:{ step:[_o('find the cause', 'achar a causa')], by:[_o('replace the part', 'trocar a peça')], without:[_o('break anything', 'quebrar nada')] },
  pay:{ step:[_o('check the amount', 'conferir o valor')], by:[_o('transfer the money', 'transferir o dinheiro'), _o('use a card', 'usar cartão')], without:[_o('check the bill', 'conferir a conta')] },
  teach:{ step:[_o('prepare the lesson', 'preparar a aula')], by:[_o('give examples', 'dar exemplos'), _o('ask questions', 'fazer perguntas')], without:[_o('lose patience', 'perder a paciência')] },
  manage:{ step:[_o('set priorities', 'definir prioridades')], by:[_o('delegate tasks', 'delegar tarefas'), _o('track the results', 'acompanhar os resultados')], without:[_o('lose control', 'perder o controle')] },
  visit:{ step:[_o('call ahead', 'ligar antes'), _o('check the opening hours', 'conferir o horário de funcionamento')] }
};
/* v140 · mais verbos com complementos próprios, em texto compacto: verbo|papel: en=pt; ... (step = after/before/upon/having · by · without · modo) */
const O2_RG_VERBO_TXT = `write|modo: think first=pensar primeiro
read|modo: stay focused=manter o foco
buy|modo: compare carefully=comparar com cuidado
sell|modo: smile warmly=sorrir com carinho
drive|modo: stay alert=ficar atento
call|modo: speak clearly=falar com clareza
meet|modo: smile warmly=sorrir com carinho
learn|modo: stay curious=manter a curiosidade
speak|modo: breathe slowly=respirar devagar
send|modo: act quickly=agir rápido
help|modo: smile warmly=sorrir com carinho
travel|modo: pack light=levar pouca bagagem
build|modo: work step by step=trabalhar passo a passo
fix|modo: work patiently=trabalhar com paciência
pay|modo: act carefully=agir com cuidado
teach|modo: speak clearly=falar com clareza
manage|modo: stay calm=manter a calma
visit|modo: arrive early=chegar cedo
use|step: read the manual=ler o manual|by: follow the steps=seguir as etapas|without: ask permission=pedir permissão|modo: think first=pensar primeiro
make|step: gather the materials=reunir os materiais|by: follow the recipe=seguir a receita|without: waste time=perder tempo|modo: work carefully=trabalhar com cuidado
take|step: check the schedule=conferir o horário|by: plan ahead=planejar com antecedência|without: ask permission=pedir permissão|modo: move slowly=andar devagar
give|step: prepare the gift=preparar o presente|by: listen to people=ouvir as pessoas|without: expect anything=esperar nada|modo: smile warmly=sorrir com carinho
get|step: ask for directions=pedir informação|by: leave early=sair cedo|without: complain=reclamar|modo: stay calm=manter a calma
go|step: pack the bags=fazer as malas|by: take the bus=pegar o ônibus|without: say goodbye=se despedir|modo: walk slowly=caminhar devagar
come|step: call ahead=ligar antes|by: take the train=pegar o trem|without: bring anything=trazer nada|modo: smile warmly=sorrir com carinho
see|step: open the door=abrir a porta|by: look closely=olhar de perto|without: wear glasses=usar óculos|modo: look closely=olhar de perto
find|step: search the files=procurar nos arquivos|by: ask around=perguntar por aí|without: lose hope=perder a esperança|modo: search carefully=procurar com cuidado
keep|step: make a list=fazer uma lista|by: organize the files=organizar os arquivos|without: forget anything=esquecer nada|modo: stay organized=manter a organização
start|step: set the goals=definir as metas|by: make a plan=fazer um plano|without: wait=esperar|modo: move step by step=ir passo a passo
finish|step: check the details=conferir os detalhes|by: work late=trabalhar até tarde|without: rush=se apressar|modo: work steadily=trabalhar com constância
open|step: find the key=achar a chave|by: press the button=apertar o botão|without: make noise=fazer barulho|modo: move gently=mexer com cuidado
close|step: save the work=salvar o trabalho|by: turn off the lights=apagar as luzes|without: make noise=fazer barulho|modo: act quickly=agir rápido
run|step: warm up=aquecer|by: train every day=treinar todo dia|without: stop=parar|modo: breathe slowly=respirar devagar
walk|step: put on comfortable shoes=calçar sapatos confortáveis|by: take the stairs=usar as escadas|without: rush=se apressar|modo: enjoy the view=curtir a paisagem
eat|step: wash {p} hands=lavar {FP} mãos|by: choose fresh food=escolher comida fresca|without: wash {p} hands=lavar {FP} mãos|modo: chew slowly=mastigar devagar
drink|step: pour the water=servir a água|by: avoid sugar=evitar açúcar|without: check the label=ler o rótulo|modo: sip slowly=beber aos poucos
sleep|step: turn off the phone=desligar o celular|by: keep a routine=manter uma rotina|without: wake up=acordar|modo: breathe slowly=respirar devagar
ask|step: think about the question=pensar na pergunta|by: raise {p} hand=levantar {F} mão|without: hesitate=hesitar|modo: speak politely=falar com educação
answer|step: read the question=ler a pergunta|by: give examples=dar exemplos|without: hesitate=hesitar|modo: speak clearly=falar com clareza
listen|step: turn off the phone=desligar o celular|by: take notes=anotar|without: interrupt=interromper|modo: stay quiet=ficar em silêncio
watch|step: read the review=ler a crítica|by: pay attention=prestar atenção|without: look away=desviar o olhar|modo: stay quiet=ficar em silêncio
wait|step: take a number=pegar uma senha|by: read a book=ler um livro|without: complain=reclamar|modo: stay calm=manter a calma
talk|step: listen to the other side=ouvir o outro lado|by: ask questions=fazer perguntas|without: interrupt=interromper|modo: speak slowly=falar devagar
think|step: take a deep breath=respirar fundo|by: write the ideas down=anotar as ideias|without: rush=se apressar|modo: stay open=manter a mente aberta
understand|step: read the text twice=ler o texto duas vezes|by: ask questions=fazer perguntas|without: translate every word=traduzir cada palavra|modo: listen carefully=ouvir com atenção
explain|step: prepare an example=preparar um exemplo|by: use simple words=usar palavras simples|without: use jargon=usar jargão|modo: speak slowly=falar devagar
show|step: prepare the slides=preparar os slides|by: give examples=dar exemplos|without: hide anything=esconder nada|modo: speak clearly=falar com clareza
bring|step: pack the bag=arrumar a bolsa|by: ask a friend=pedir a um amigo|without: forget anything=esquecer nada|modo: walk carefully=andar com cuidado
carry|step: pick up the box=pegar a caixa|by: use a cart=usar um carrinho|without: drop anything=deixar cair nada|modo: walk carefully=andar com cuidado
change|step: make a list=fazer uma lista|by: start small=começar pequeno|without: tell anyone=contar a ninguém|modo: adapt quickly=se adaptar rápido
choose|step: compare the options=comparar as opções|by: ask for advice=pedir conselhos|without: rush=se apressar|modo: think carefully=pensar com cuidado
cut|step: mark the line=marcar a linha|by: use scissors=usar tesoura|without: make a mess=fazer bagunça|modo: work carefully=trabalhar com cuidado
draw|step: sharpen the pencil=apontar o lápis|by: follow a model=seguir um modelo|without: lift the pen=levantar a caneta|modo: work patiently=trabalhar com paciência
remember|step: write it down=anotar|by: repeat the words=repetir as palavras|without: check the notes=olhar as anotações|modo: think calmly=pensar com calma
hire|step: interview the candidates=entrevistar os candidatos|by: ask for references=pedir referências|without: check the resume=conferir o currículo|modo: act fast=agir rápido
join|step: fill out the form=preencher o formulário|by: pay the fee=pagar a taxa|without: ask questions=fazer perguntas|modo: smile warmly=sorrir com carinho
leave|step: turn off the lights=apagar as luzes|by: take the first train=pegar o primeiro trem|without: say goodbye=se despedir|modo: move quietly=sair em silêncio
lead|step: set the goals=definir as metas|by: set an example=dar o exemplo|without: shout=gritar|modo: listen carefully=ouvir com atenção
move|step: pack the boxes=empacotar as caixas|by: hire a truck=contratar um caminhão|without: break anything=quebrar nada|modo: work carefully=trabalhar com cuidado
order|step: check the menu=ver o cardápio|by: use the app=usar o aplicativo|without: check the price=conferir o preço|modo: decide quickly=decidir rápido
organize|step: make a list=fazer uma lista|by: use folders=usar pastas|without: lose anything=perder nada|modo: work step by step=trabalhar passo a passo
prepare|step: gather the materials=reunir os materiais|by: make a list=fazer uma lista|without: skip the details=pular os detalhes|modo: work calmly=trabalhar com calma
present|step: practice the speech=ensaiar o discurso|by: use clear slides=usar slides claros|without: read the slides=ler os slides|modo: speak clearly=falar com clareza
produce|step: test the samples=testar as amostras|by: reduce the waste=reduzir o desperdício|without: lose quality=perder qualidade|modo: work efficiently=trabalhar com eficiência
review|step: collect the comments=reunir os comentários|by: check every detail=conferir cada detalhe|without: skip the details=pular os detalhes|modo: read carefully=ler com atenção
save|step: count the money=contar o dinheiro|by: avoid waste=evitar desperdício|without: spend too much=gastar demais|modo: plan carefully=planejar com cuidado
share|step: choose the files=escolher os arquivos|by: send a link=enviar um link|without: ask permission=pedir permissão|modo: smile warmly=sorrir com carinho
solve|step: read the problem again=reler o problema|by: break it into parts=dividir em partes|without: give up=desistir|modo: think calmly=pensar com calma
spend|step: check the budget=conferir o orçamento|by: pay in cash=pagar em dinheiro|without: check the price=conferir o preço|modo: plan carefully=planejar com cuidado
test|step: write the cases=escrever os casos de teste|by: run it twice=rodar duas vezes|without: skip the steps=pular as etapas|modo: work carefully=trabalhar com cuidado
train|step: warm up=aquecer|by: follow a plan=seguir um plano|without: skip the rest days=pular os dias de descanso|modo: breathe slowly=respirar devagar
update|step: back up the data=fazer backup dos dados|by: install the new version=instalar a nova versão|without: lose the data=perder os dados|modo: work carefully=trabalhar com cuidado
wear|step: choose the clothes=escolher a roupa|by: dress for the weather=se vestir conforme o tempo|without: look in the mirror=olhar o espelho
win|step: shake hands=apertar as mãos|by: train hard=treinar duro|without: cheat=trapacear|modo: stay focused=manter o foco
lose|step: check the damage=avaliar o prejuízo|by: take risks=correr riscos|without: give up=desistir|modo: stay calm=manter a calma
sign|step: read the contract=ler o contrato|by: use a pen=usar caneta|without: read the contract=ler o contrato|modo: act carefully=agir com cuidado
book|step: compare the prices=comparar os preços|by: use the website=usar o site|without: check the dates=conferir as datas|modo: decide quickly=decidir rápido
cancel|step: call the company=ligar para a empresa|by: use the app=usar o aplicativo|without: tell anyone=avisar ninguém|modo: act quickly=agir rápido
deliver|step: check the address=conferir o endereço|by: use a courier=usar um entregador|without: damage the package=danificar o pacote|modo: act fast=agir rápido
repair|step: find the cause=achar a causa|by: replace the part=trocar a peça|without: break anything=quebrar nada|modo: work patiently=trabalhar com paciência
invite|step: make a list=fazer uma lista|by: send a message=enviar uma mensagem|without: forget anyone=esquecer ninguém|modo: smile warmly=sorrir com carinho
work|step: check the schedule=conferir a agenda|by: set clear goals=definir metas claras|without: lose focus=perder o foco|modo: stay organized=manter a organização
put|step: clear the table=limpar a mesa|by: follow the labels=seguir as etiquetas|without: make noise=fazer barulho|modo: act carefully=agir com cuidado
say|step: think first=pensar primeiro|by: choose simple words=escolher palavras simples|without: hesitate=hesitar|modo: speak clearly=falar com clareza
know|step: ask around=perguntar por aí|by: read the news=ler as notícias|without: check the facts=conferir os fatos|modo: stay curious=manter a curiosidade
tell|step: take a deep breath=respirar fundo|by: give examples=dar exemplos|without: hide anything=esconder nada|modo: speak slowly=falar devagar
become|step: set a goal=definir uma meta|by: practice every day=praticar todo dia|without: give up=desistir|modo: stay patient=ter paciência
feel|step: take a deep breath=respirar fundo|by: talk to a friend=conversar com um amigo|without: judge anyone=julgar ninguém|modo: stay calm=manter a calma
begin|step: read the instructions=ler as instruções|by: make a plan=fazer um plano|without: wait=esperar|modo: move step by step=ir passo a passo
hold|step: check the weight=conferir o peso|by: use both hands=usar as duas mãos|without: drop anything=deixar cair nada|modo: stay steady=ficar firme
break|step: check the damage=avaliar o dano|by: use a hammer=usar um martelo|without: make noise=fazer barulho|modo: act carefully=agir com cuidado
fall|step: lose balance=perder o equilíbrio|by: slip on the ice=escorregar no gelo|without: make a sound=fazer um som|modo: stay calm=manter a calma
forget|step: lose focus=perder o foco|by: skip the notes=pular as anotações|without: check the list=conferir a lista|modo: think calmly=pensar com calma
grow|step: plant the seeds=plantar as sementes|by: water the plants=regar as plantas|without: need much care=precisar de muito cuidado|modo: stay patient=ter paciência
catch|step: run fast=correr rápido|by: use a net=usar uma rede|without: lose balance=perder o equilíbrio|modo: stay alert=ficar atento
imagine|step: close the eyes=fechar os olhos|by: draw a picture=desenhar uma imagem|without: doubt it=duvidar|modo: think freely=pensar livremente
need|step: check the budget=conferir o orçamento|by: ask for advice=pedir conselhos|without: complain=reclamar|modo: stay honest=ser honesto
overcome|step: face the fear=encarar o medo|by: ask for help=pedir ajuda|without: give up=desistir|modo: stay strong=ficar forte
quit|step: talk to the boss=conversar com o chefe|by: send a letter=enviar uma carta|without: say goodbye=se despedir|modo: act calmly=agir com calma
agree|step: read the terms=ler os termos|by: shake hands=apertar as mãos|without: argue=discutir|modo: nod politely=assentir com educação
check|step: open the file=abrir o arquivo|by: compare the numbers=comparar os números|without: skip the details=pular os detalhes|modo: work carefully=trabalhar com cuidado
clean|step: gather the supplies=reunir os materiais|by: use soap=usar sabão|without: make a mess=fazer bagunça|modo: work quickly=trabalhar rápido
count|step: gather the items=reunir os itens|by: use a calculator=usar calculadora|without: skip any=pular nenhum|modo: stay focused=manter o foco
cross|step: look both ways=olhar para os dois lados|by: use the bridge=usar a ponte|without: stop=parar|modo: walk carefully=andar com cuidado
deal|step: read the offer=ler a oferta|by: stay calm=manter a calma|without: lose control=perder o controle|modo: negotiate calmly=negociar com calma
decide|step: weigh the options=avaliar as opções|by: ask for advice=pedir conselhos|without: rush=se apressar|modo: think carefully=pensar com cuidado
do|step: plan the steps=planejar as etapas|by: follow the instructions=seguir as instruções|without: ask for help=pedir ajuda|modo: work step by step=trabalhar passo a passo
dream|step: go to sleep=ir dormir|by: set big goals=definir grandes metas|without: give up=desistir|modo: think big=pensar grande
drop|step: check the weight=conferir o peso|by: open the hand=abrir a mão|without: make noise=fazer barulho|modo: act carefully=agir com cuidado
face|step: take a deep breath=respirar fundo|by: stay calm=manter a calma|without: run away=fugir|modo: stay strong=ficar forte
fight|step: warm up=aquecer|by: train hard=treinar duro|without: lose control=perder o controle|modo: stay focused=manter o foco
figure|step: read the problem again=reler o problema|by: break it into parts=dividir em partes|without: give up=desistir|modo: think calmly=pensar com calma
fill|step: find a container=achar um recipiente|by: pour slowly=despejar devagar|without: spill anything=derramar nada|modo: work carefully=trabalhar com cuidado
follow|step: read the map=ler o mapa|by: keep a distance=manter distância|without: lose the way=perder o caminho|modo: stay alert=ficar atento
have|step: prepare the table=arrumar a mesa|by: plan ahead=planejar com antecedência|without: complain=reclamar|modo: stay relaxed=ficar relaxado
let|step: think about it=pensar a respeito|by: set clear rules=definir regras claras|without: ask questions=fazer perguntas|modo: stay calm=manter a calma
like|step: try it first=experimentar antes|by: share it with friends=compartilhar com amigos|without: judge anyone=julgar ninguém|modo: smile warmly=sorrir com carinho
live|step: find a place=achar um lugar|by: save money=economizar dinheiro|without: worry=se preocupar|modo: stay positive=pensar positivo
look|step: put on glasses=pôr os óculos|by: pay attention=prestar atenção|without: stare=ficar encarando|modo: stay curious=manter a curiosidade
pass|step: study the material=estudar a matéria|by: practice every day=praticar todo dia|without: cheat=trapacear|modo: stay focused=manter o foco
pick|step: compare the options=comparar as opções|by: ask for advice=pedir conselhos|without: rush=se apressar|modo: think carefully=pensar com cuidado
play|step: warm up=aquecer|by: follow the rules=seguir as regras|without: cheat=trapacear|modo: stay focused=manter o foco
pull|step: check the rope=conferir a corda|by: use both hands=usar as duas mãos|without: break anything=quebrar nada|modo: act carefully=agir com cuidado
push|step: check the door=conferir a porta|by: use both hands=usar as duas mãos|without: force it=forçar|modo: act gently=agir com delicadeza
raise|step: count the money=contar o dinheiro|by: ask for donations=pedir doações|without: make a fuss=fazer alarde|modo: stay polite=ser educado
return|step: pack the bags=fazer as malas|by: take the train=pegar o trem|without: say goodbye=se despedir|modo: move quietly=sair em silêncio
ride|step: put on a helmet=pôr o capacete|by: follow the path=seguir o caminho|without: look back=olhar para trás|modo: stay alert=ficar atento
set|step: gather the tools=reunir as ferramentas|by: follow the manual=seguir o manual|without: skip the steps=pular as etapas|modo: work carefully=trabalhar com cuidado
stand|step: stretch the legs=alongar as pernas|by: lean on the wall=apoiar-se na parede|without: move=se mexer|modo: stay straight=ficar reto
stay|step: book a room=reservar um quarto|by: follow the rules=seguir as regras|without: complain=reclamar|modo: act politely=agir com educação
stop|step: look around=olhar em volta|by: press the button=apertar o botão|without: look back=olhar para trás|modo: act quickly=agir rápido
throw|step: aim carefully=mirar com cuidado|by: use both hands=usar as duas mãos|without: aim=mirar|modo: stay focused=manter o foco
turn|step: check the road=olhar a pista|by: use the signal=usar a seta|without: look first=olhar antes|modo: act carefully=agir com cuidado
wash|step: gather the clothes=juntar as roupas|by: use hot water=usar água quente|without: use soap=usar sabão|modo: work quickly=trabalhar rápido
believe|step: check the facts=conferir os fatos|by: trust the evidence=confiar nas provas|without: doubt=duvidar|modo: stay open=manter a mente aberta
realize|step: think it over=pensar a respeito|by: look at the facts=olhar os fatos|without: think twice=pensar duas vezes|modo: stay open=manter a mente aberta
notice|step: look closely=olhar de perto|by: pay attention=prestar atenção|without: ask=perguntar|modo: stay alert=ficar atento
guess|step: look at the clues=olhar as pistas|by: use the context=usar o contexto|without: check=conferir|modo: think quickly=pensar rápido
doubt|step: check the facts=conferir os fatos|by: ask questions=fazer perguntas|without: hesitate=hesitar|modo: stay calm=manter a calma
recognize|step: look closely=olhar de perto|by: compare the details=comparar os detalhes|without: ask=perguntar|modo: stay alert=ficar atento
consider|step: gather the facts=reunir os fatos|by: weigh the options=avaliar as opções|without: rush=se apressar|modo: think carefully=pensar com cuidado
focus|step: turn off the phone=desligar o celular|by: set clear goals=definir metas claras|without: lose time=perder tempo|modo: stay calm=manter a calma
memorize|step: read the text twice=ler o texto duas vezes|by: repeat the words=repetir as palavras|without: use notes=usar anotações|modo: stay focused=manter o foco
analyze|step: collect the data=coletar os dados|by: compare the numbers=comparar os números|without: skip the details=pular os detalhes|modo: think carefully=pensar com cuidado
expect|step: check the schedule=conferir a agenda|by: plan ahead=planejar com antecedência|without: complain=reclamar|modo: stay positive=pensar positivo
predict|step: collect the data=coletar os dados|by: look at the trends=olhar as tendências|without: check the data=conferir os dados|modo: think carefully=pensar com cuidado
compare|step: collect the data=coletar os dados|by: make a table=fazer uma tabela|without: skip the details=pular os detalhes|modo: work carefully=trabalhar com cuidado
judge|step: hear both sides=ouvir os dois lados|by: weigh the evidence=pesar as provas|without: take sides=tomar partido|modo: stay neutral=manter a neutralidade
blame|step: check the facts=conferir os fatos|by: point at someone=apontar para alguém|without: know the facts=saber os fatos|modo: stay calm=manter a calma
praise|step: notice the effort=notar o esforço|by: give examples=dar exemplos|without: exaggerate=exagerar|modo: smile warmly=sorrir com carinho
criticize|step: listen first=ouvir primeiro|by: give examples=dar exemplos|without: offend anyone=ofender ninguém|modo: speak politely=falar com educação
approve|step: read the proposal=ler a proposta|by: sign the form=assinar o formulário|without: ask questions=fazer perguntas|modo: act quickly=agir rápido
reject|step: read the proposal=ler a proposta|by: send a message=enviar uma mensagem|without: explain=explicar|modo: speak politely=falar com educação
accuse|step: check the facts=conferir os fatos|by: point at someone=apontar para alguém|without: have proof=ter provas|modo: stay calm=manter a calma
admire|step: look closely=olhar de perto|by: study the work=estudar a obra|without: envy anyone=invejar ninguém|modo: smile warmly=sorrir com carinho
respect|step: listen first=ouvir primeiro|by: follow the rules=seguir as regras|without: judge anyone=julgar ninguém|modo: speak politely=falar com educação
evaluate|step: collect the data=coletar os dados|by: use clear criteria=usar critérios claros|without: skip the details=pular os detalhes|modo: think carefully=pensar com cuidado
recommend|step: try it first=experimentar antes|by: share {p} experience=compartilhar {F} experiência|without: exaggerate=exagerar|modo: speak clearly=falar com clareza
support|step: listen first=ouvir primeiro|by: share the work=dividir o trabalho|without: judge anyone=julgar ninguém|modo: smile warmly=sorrir com carinho
defend|step: gather the proofs=reunir as provas|by: present the facts=apresentar os fatos|without: lose control=perder o controle|modo: stay calm=manter a calma
trust|step: check the facts=conferir os fatos|by: listen to people=ouvir as pessoas|without: doubt=duvidar|modo: stay open=manter a mente aberta
forgive|step: listen first=ouvir primeiro|by: talk to them=conversar com eles|without: hold a grudge=guardar rancor|modo: smile warmly=sorrir com carinho
negotiate|step: set the limits=definir os limites|by: listen first=ouvir primeiro|without: lose control=perder o controle|modo: stay calm=manter a calma
invest|step: study the market=estudar o mercado|by: spread the risk=diluir o risco|without: check the risks=conferir os riscos|modo: think long term=pensar no longo prazo
accept|step: read the terms=ler os termos|by: sign the form=assinar o formulário|without: ask questions=fazer perguntas|modo: speak politely=falar com educação
improve|step: measure the results=medir os resultados|by: practice every day=praticar todo dia|without: lose quality=perder qualidade|modo: work steadily=trabalhar com constância
arrive|step: check the traffic=ver o trânsito|by: leave early=sair cedo|without: call ahead=avisar antes|modo: stay calm=manter a calma
rest|step: finish the work=terminar o trabalho|by: sleep enough=dormir o suficiente|without: check the phone=olhar o celular|modo: breathe slowly=respirar devagar
install|step: back up the data=fazer backup dos dados|by: follow the guide=seguir o guia|without: lose the settings=perder as configurações|modo: work carefully=trabalhar com cuidado
schedule|step: check the calendar=conferir a agenda|by: use the calendar=usar a agenda|without: forget anyone=esquecer ninguém|modo: plan carefully=planejar com cuidado
submit|step: check the form=conferir o formulário|by: use the website=usar o site|without: miss the deadline=perder o prazo|modo: act carefully=agir com cuidado
launch|step: test the product=testar o produto|by: run a campaign=fazer uma campanha|without: warn the team=avisar a equipe|modo: act confidently=agir com confiança
increase|step: analyze the data=analisar os dados|by: cut the costs=cortar os custos|without: lose quality=perder qualidade|modo: grow steadily=crescer com constância
reduce|step: measure the costs=medir os custos|by: cut the waste=cortar o desperdício|without: lose quality=perder qualidade|modo: act gradually=agir aos poucos
report|step: collect the data=coletar os dados|by: use clear charts=usar gráficos claros|without: hide the numbers=esconder os números|modo: write clearly=escrever com clareza
forecast|step: collect the data=coletar os dados|by: study the trends=estudar as tendências|without: check the numbers=conferir os números|modo: think carefully=pensar com cuidado
confirm|step: check the details=conferir os detalhes|by: send an email=enviar um e-mail|without: delay the answer=adiar a resposta|modo: act quickly=agir rápido
attend|step: confirm the time=confirmar o horário|by: arrive early=chegar cedo|without: miss the start=perder o começo|modo: stay focused=manter o foco
propose|step: prepare the offer=preparar a oferta|by: present the numbers=apresentar os números|without: hide the risks=esconder os riscos|modo: speak clearly=falar com clareza
implement|step: test the plan=testar o plano|by: train the team=treinar a equipe|without: lose control=perder o controle|modo: work step by step=trabalhar passo a passo
develop|step: define the goals=definir as metas|by: test every version=testar cada versão|without: skip the tests=pular os testes|modo: work patiently=trabalhar com paciência
design|step: sketch the idea=esboçar a ideia|by: test prototypes=testar protótipos|without: forget the user=esquecer o usuário|modo: think creatively=pensar com criatividade
monitor|step: set the targets=definir as metas|by: track the numbers=acompanhar os números|without: miss any detail=perder nenhum detalhe|modo: stay alert=ficar atento
discuss|step: read the report=ler o relatório|by: ask questions=fazer perguntas|without: interrupt=interromper|modo: speak politely=falar com educação
assign|step: define the tasks=definir as tarefas|by: set clear deadlines=definir prazos claros|without: forget anyone=esquecer ninguém|modo: act fairly=agir com justiça
delegate|step: define the tasks=definir as tarefas|by: trust the team=confiar na equipe|without: lose control=perder o controle|modo: speak clearly=falar com clareza
promote|step: set the budget=definir o orçamento|by: use social media=usar as redes sociais|without: exaggerate=exagerar|modo: act confidently=agir com confiança
recruit|step: write the job ad=escrever o anúncio da vaga|by: use social media=usar as redes sociais|without: skip the interview=pular a entrevista|modo: act fairly=agir com justiça
supervise|step: set the goals=definir as metas|by: check the progress=conferir o progresso|without: control every detail=controlar cada detalhe|modo: stay calm=manter a calma
contact|step: find the number=achar o número|by: send an email=enviar um e-mail|without: wait=esperar|modo: speak politely=falar com educação
reply|step: read the message=ler a mensagem|by: send an email=enviar um e-mail|without: delay=demorar|modo: write clearly=escrever com clareza
process|step: check the documents=conferir os documentos|by: use the system=usar o sistema|without: miss any step=pular nenhuma etapa|modo: work carefully=trabalhar com cuidado
apply|step: update the resume=atualizar o currículo|by: fill out the form=preencher o formulário|without: miss the deadline=perder o prazo|modo: act confidently=agir com confiança
register|step: gather the documents=reunir os documentos|by: fill out the form=preencher o formulário|without: forget the ID=esquecer o documento|modo: act carefully=agir com cuidado
renew|step: check the date=conferir a data|by: pay the fee=pagar a taxa|without: miss the date=perder o prazo|modo: act early=agir cedo
ship|step: pack the order=embalar o pedido|by: use a courier=usar uma transportadora|without: damage the package=danificar o pacote|modo: act fast=agir rápido
refund|step: check the receipt=conferir o recibo|by: use the same card=usar o mesmo cartão|without: ask questions=fazer perguntas|modo: act quickly=agir rápido
offer|step: check the budget=conferir o orçamento|by: lower the price=baixar o preço|without: hide the terms=esconder as condições|modo: speak politely=falar com educação
advertise|step: define the audience=definir o público|by: use social media=usar as redes sociais|without: exaggerate=exagerar|modo: act creatively=agir com criatividade
market|step: study the audience=estudar o público|by: use social media=usar as redes sociais|without: exaggerate=exagerar|modo: think creatively=pensar com criatividade
compete|step: study the rivals=estudar os rivais|by: lower the price=baixar o preço|without: cheat=trapacear|modo: stay focused=manter o foco
achieve|step: set clear goals=definir metas claras|by: work steadily=trabalhar com constância|without: give up=desistir|modo: stay motivated=manter a motivação
exceed|step: set higher goals=definir metas mais altas|by: work extra hours=fazer hora extra|without: lose quality=perder qualidade|modo: stay motivated=manter a motivação
complete|step: check the list=conferir a lista|by: follow the plan=seguir o plano|without: skip any step=pular nenhuma etapa|modo: work steadily=trabalhar com constância
practice|step: warm up=aquecer|by: repeat the words=repetir as palavras|without: skip the basics=pular o básico|modo: stay patient=ter paciência
audit|step: collect the records=reunir os registros|by: check every entry=conferir cada lançamento|without: miss any detail=perder nenhum detalhe|modo: work carefully=trabalhar com cuidado
transfer|step: check the account=conferir a conta|by: use the app=usar o aplicativo|without: pay fees=pagar taxas|modo: act carefully=agir com cuidado
withdraw|step: check the balance=conferir o saldo|by: use the card=usar o cartão|without: pay fees=pagar taxas|modo: act carefully=agir com cuidado
deposit|step: count the money=contar o dinheiro|by: use the app=usar o aplicativo|without: lose the receipt=perder o comprovante|modo: act carefully=agir com cuidado
borrow|step: ask permission=pedir permissão|by: sign a contract=assinar um contrato|without: ask=perguntar|modo: speak politely=falar com educação
lend|step: check the risk=avaliar o risco|by: sign a contract=assinar um contrato|without: ask for interest=cobrar juros|modo: act carefully=agir com cuidado
earn|step: finish the work=terminar o trabalho|by: work extra hours=fazer hora extra|without: cheat=trapacear|modo: work steadily=trabalhar com constância
charge|step: check the price=conferir o preço|by: issue an invoice=emitir uma nota|without: hide the fees=esconder as taxas|modo: act fairly=agir com justiça
coach|step: set the goals=definir as metas|by: give feedback=dar feedback|without: judge anyone=julgar ninguém|modo: speak kindly=falar com gentileza
motivate|step: set clear goals=definir metas claras|by: give feedback=dar feedback|without: pressure anyone=pressionar ninguém|modo: smile warmly=sorrir com carinho
inspire|step: share the vision=compartilhar a visão|by: set an example=dar o exemplo|without: pressure anyone=pressionar ninguém|modo: speak clearly=falar com clareza
resign|step: talk to the boss=conversar com o chefe|by: send a letter=enviar uma carta|without: say goodbye=se despedir|modo: act calmly=agir com calma
retire|step: save money=economizar dinheiro|by: save every month=poupar todo mês|without: worry=se preocupar|modo: plan carefully=planejar com cuidado
interview|step: read the resume=ler o currículo|by: ask good questions=fazer boas perguntas|without: judge too fast=julgar rápido demais|modo: speak politely=falar com educação
publish|step: edit the text=revisar o texto|by: use the website=usar o site|without: check the facts=conferir os fatos|modo: write clearly=escrever com clareza
edit|step: read the text twice=ler o texto duas vezes|by: cut the extra words=cortar as palavras extras|without: change the meaning=mudar o sentido|modo: work carefully=trabalhar com cuidado
translate|step: read the whole text=ler o texto inteiro|by: use a dictionary=usar um dicionário|without: change the meaning=mudar o sentido|modo: work carefully=trabalhar com cuidado
research|step: define the question=definir a pergunta|by: read the papers=ler os artigos|without: check the sources=conferir as fontes|modo: work patiently=trabalhar com paciência
survey|step: write the questions=escrever as perguntas|by: ask many people=perguntar a muita gente|without: ask leading questions=fazer perguntas tendenciosas|modo: act fairly=agir com justiça
record|step: test the sound=testar o som|by: use a microphone=usar um microfone|without: make noise=fazer barulho|modo: stay quiet=ficar em silêncio
measure|step: choose the tool=escolher a ferramenta|by: use a ruler=usar uma régua|without: guess=chutar|modo: work carefully=trabalhar com cuidado
calculate|step: collect the numbers=reunir os números|by: use a spreadsheet=usar uma planilha|without: skip the steps=pular as etapas|modo: work carefully=trabalhar com cuidado
budget|step: list the expenses=listar as despesas|by: track every cost=acompanhar cada gasto|without: forget the taxes=esquecer os impostos|modo: plan carefully=planejar com cuidado
plan|step: set the goals=definir as metas|by: listen to the team=ouvir a equipe|without: ignore the risks=ignorar os riscos|modo: think ahead=pensar à frente
coordinate|step: set the schedule=definir o cronograma|by: use a shared calendar=usar uma agenda compartilhada|without: forget anyone=esquecer ninguém|modo: communicate clearly=comunicar com clareza`;
O2_RG_VERBO_TXT.split('\n').forEach(l => {
  const p = l.split('|'), id = p[0], d = O2_RG_VERBO[id] || (O2_RG_VERBO[id] = {});
  p.slice(1).forEach(x => { const m = x.match(/^(\w+): (.*)$/); if(m) d[m[1]] = (d[m[1]] || []).concat([{ en:m[2].split('=')[0], pt:m[2].split('=')[1] }]); });
});
/* v143 · rger por SUBGRUPO de verbos: lista de verbos | step | by | without | modo (itens separados por ';'). Cobre os verbos que não têm lista individual. */
const O2_RG_SUB_TXT = `arise give-up run-out carry-on decrease continue end remain happen seem appear disappear exist replace adapt adjust expand last worsen evolve transform vary fade vanish shift shrink widen strengthen weaken soften boost accelerate stabilize reform mature affect cause commence modify abandon cease proceed|step: check the situation=avaliar a situação; talk to the team=conversar com a equipe|by: adapt to the context=se adaptar ao contexto; follow the plan=seguir o plano|without: lose control=perder o controle; warn anyone=avisar ninguém|modo: adapt quickly=se adaptar rápido; stay calm=manter a calma|while: listen to the news=ouvir as notícias; wait for the answer=esperar a resposta
breathe cough hurt bleed heal sweat sneeze recover die yawn faint vomit swell scratch limp snore nap suffer|step: rest a little=descansar um pouco; drink water=beber água|by: rest enough=descansar o suficiente; follow the doctor's advice=seguir o conselho do médico|without: feel pain=sentir dor; complain=reclamar|modo: stay calm=manter a calma; breathe slowly=respirar devagar|while: rest on the couch=descansar no sofá; drink water=beber água
treat diagnose cure inject vaccinate prescribe x-ray|step: examine the patient=examinar o paciente; check the history=ver o histórico|by: follow the protocol=seguir o protocolo; run tests=fazer exames|without: hurt the patient=machucar o paciente; skip the tests=pular os exames|modo: work carefully=trabalhar com cuidado; stay calm=manter a calma|while: take notes=fazer anotações; talk to the patient=conversar com o paciente
hear touch nod frown stare glance gaze peek smell sniff blink rub pinch hum whistle look-at|step: turn around=virar-se; take a deep breath=respirar fundo|by: pay attention=prestar atenção; stay quiet=ficar em silêncio|without: make a sound=fazer um som; say a word=dizer uma palavra|modo: stay quiet=ficar em silêncio; smile warmly=sorrir com carinho|while: stand still=ficar parado; wait quietly=esperar em silêncio
mention announce argue suggest warn describe express state indicate claim insist confess clarify emphasize refer address inquire stutter ask-for|step: prepare the points=preparar os pontos; check the facts=conferir os fatos|by: give examples=dar exemplos; use simple words=usar palavras simples|without: hide anything=esconder nada; hesitate=hesitar|modo: speak clearly=falar com clareza; speak calmly=falar com calma|while: look at the audience=olhar para o público; take notes=fazer anotações
yell shout scream whisper murmur mumble sigh swear curse complain|step: take a deep breath=respirar fundo; count to ten=contar até dez|by: raise {p} voice=levantar {F} voz; speak louder=falar mais alto|without: think=pensar; lose control=perder o controle|modo: stay calm=manter a calma; speak softly=falar baixinho|while: walk away=se afastar; wait outside=esperar lá fora
greet thank apologize congratulate chat gossip tease joke encourage discourage comfort welcome|step: smile warmly=sorrir com carinho; make eye contact=olhar nos olhos|by: listen carefully=ouvir com atenção; speak kindly=falar com gentileza|without: offend anyone=ofender ninguém; forget the names=esquecer os nomes|modo: smile warmly=sorrir com carinho; speak kindly=falar com gentileza|while: drink coffee=tomar café; walk together=caminhar juntos
convince persuade advise inform notify remind request demand interrupt communicate respond narrate lie conceal|step: prepare the arguments=preparar os argumentos; check the facts=conferir os fatos|by: give examples=dar exemplos; show the numbers=mostrar os números|without: pressure anyone=pressionar ninguém; hide the facts=esconder os fatos|modo: speak clearly=falar com clareza; stay polite=ser educado|while: look at the person=olhar para a pessoa; take notes=fazer anotações
zoom turn-on click type scroll tap press browse search download upload copy paste scan print|step: open the app=abrir o aplicativo; log in=entrar na conta|by: use the keyboard=usar o teclado; follow the menu=seguir o menu|without: lose the file=perder o arquivo; close the window=fechar a janela|modo: work fast=trabalhar rápido; work carefully=trabalhar com cuidado|while: listen to music=ouvir música; drink coffee=tomar café
code debug compile deploy automate configure optimize customize authenticate encrypt filter sort format log scrape sync store restore reboot refresh render load crash hack|step: back up the data=fazer backup dos dados; test the code=testar o código|by: run the tests=rodar os testes; read the logs=ler os logs|without: break the system=quebrar o sistema; skip the tests=pular os testes|modo: work carefully=trabalhar com cuidado; test often=testar com frequência|while: run the tests=rodar os testes; read the logs=ler os logs
classify visualize detect track enable remove insert attach connect delete subscribe unsubscribe tag post forward text stream|step: check the settings=conferir as configurações; save the file=salvar o arquivo|by: use the app=usar o aplicativo; follow the steps=seguir as etapas|without: lose the data=perder os dados; ask permission=pedir permissão|modo: work carefully=trabalhar com cuidado; act quickly=agir rápido|while: listen to music=ouvir música; watch the screen=olhar a tela
presume mean assume ignore interpret discover reflect regret reconsider recall conclude infer ponder deduce identify distinguish determine verify define prove suppose pretend depend find-out|step: gather the facts=reunir os fatos; think it over=pensar a respeito|by: compare the evidence=comparar as provas; ask questions=fazer perguntas|without: check the facts=conferir os fatos; jump to conclusions=tirar conclusões precipitadas|modo: think carefully=pensar com cuidado; stay open=manter a mente aberta|while: read the news=ler as notícias; take notes=fazer anotações
wish intend aim hesitate concentrate deny admit|step: think about it=pensar a respeito; weigh the options=avaliar as opções|by: set clear goals=definir metas claras; ask for advice=pedir conselhos|without: hesitate=hesitar; rush=se apressar|modo: stay honest=ser honesto; stay calm=manter a calma|while: take a walk=dar uma caminhada; think about it=pensar a respeito
love adore cherish miss care hug kiss marry embrace flirt date look-after|step: say hello=cumprimentar; buy a gift=comprar um presente|by: spend time together=passar tempo juntos; listen with care=ouvir com atenção|without: hurt anyone=magoar ninguém; say goodbye=se despedir|modo: smile warmly=sorrir com carinho; speak softly=falar baixinho|while: hold hands=dar as mãos; talk about the day=conversar sobre o dia
hate fear envy grieve worry blush shiver annoy bore upset frighten shock disappoint surprise please|step: take a deep breath=respirar fundo; talk to a friend=conversar com um amigo|by: talk to someone=conversar com alguém; breathe slowly=respirar devagar|without: say a word=dizer uma palavra; show {p} feelings=demonstrar {MP} sentimentos|modo: stay calm=manter a calma; breathe slowly=respirar devagar|while: take a walk=dar uma caminhada; listen to music=ouvir música
enjoy want hope laugh cry smile amuse delight impress calm|step: relax a little=relaxar um pouco; call a friend=ligar para um amigo|by: spend time with friends=passar tempo com amigos; listen to music=ouvir música|without: worry=se preocupar; rush=se apressar|modo: smile warmly=sorrir com carinho; stay positive=pensar positivo|while: listen to music=ouvir música; sing along=cantar junto
refuse receive own gain provide exchange steal hide seek swap hand distribute substitute mail belong obtain retain look-for|step: check the list=conferir a lista; ask permission=pedir permissão|by: sign the form=assinar o formulário; follow the rules=seguir as regras|without: ask for anything=pedir nada; lose track=perder o controle|modo: act carefully=agir com cuidado; act fairly=agir com justiça|while: wait in line=esperar na fila; check the list=conferir a lista
fire collaborate operate employ consult assist represent merge file appoint accomplish reconcile outsource diversify streamline leverage prioritize onboard involve handle succeed attempt utilize dispatch postpone establish terminate rely|step: define the goals=definir as metas; talk to the team=conversar com a equipe|by: follow the process=seguir o processo; track the results=acompanhar os resultados|without: lose focus=perder o foco; ignore the rules=ignorar as regras|modo: stay organized=manter a organização; work efficiently=trabalhar com eficiência|while: answer emails=responder e-mails; attend the meeting=participar da reunião
depreciate amortize accrue allocate capitalize liquidate|step: review the accounts=revisar as contas; collect the records=reunir os registros|by: follow the accounting rules=seguir as normas contábeis; use a spreadsheet=usar uma planilha|without: miss any entry=perder nenhum lançamento; skip the review=pular a revisão|modo: work carefully=trabalhar com cuidado; plan carefully=planejar com cuidado|while: check the numbers=conferir os números; use a spreadsheet=usar uma planilha
wake dress brush bathe lock sweep tidy fold hang decorate water light pack wipe iron dust vacuum mop scrub rinse dry empty switch cover furnish knock ring unlock stack leak drip get-up|step: gather the supplies=reunir os materiais; open the windows=abrir as janelas|by: follow a routine=seguir uma rotina; use a cloth=usar um pano|without: make a mess=fazer bagunça; make noise=fazer barulho|modo: work quickly=trabalhar rápido; work carefully=trabalhar com cuidado|while: listen to the radio=ouvir o rádio; watch TV=assistir TV
step enter climb jump fly swim depart escape park board land reach chase explore guide wander march crawl slide slip roll rush hike stroll approach avoid jog skate ski sail row steer stumble lean kneel crouch sit rise bounce swing spin migrate flee retreat advance cycle encounter come-back take-off|step: check the route=conferir o trajeto; pack the bags=fazer as malas|by: follow the path=seguir o caminho; take the shortcut=pegar o atalho|without: get lost=se perder; look back=olhar para trás|modo: move slowly=andar devagar; stay alert=ficar atento|while: listen to the radio=ouvir o rádio; look at the scenery=olhar a paisagem
kick score lift stretch shoot hit dribble beat cheer surf dive referee box punch exercise skip bat work-out|step: warm up=aquecer; stretch the legs=alongar as pernas|by: train every day=treinar todo dia; follow the coach=seguir o treinador|without: break the rules=quebrar as regras; lose focus=perder o foco|modo: play fair=jogar limpo; stay focused=manter o foco|while: listen to music=ouvir música; wear a helmet=usar capacete
lay create paint assemble sew shape tie stick dig tear bend shake try invent craft carve knit weave glue nail drill saw hammer screw polish manufacture forge mend sharpen grind mold construct|step: gather the materials=reunir os materiais; plan the steps=planejar as etapas|by: follow the instructions=seguir as instruções; use the right tools=usar as ferramentas certas|without: break anything=quebrar nada; skip the steps=pular as etapas|modo: work carefully=trabalhar com cuidado; work patiently=trabalhar com paciência|while: listen to music=ouvir música; check the instructions=conferir as instruções
deserve suspect prefer disagree condemn applaud appreciate underestimate overestimate rate mock insult offend endorse select turn-down|step: hear both sides=ouvir os dois lados; check the facts=conferir os fatos|by: weigh the evidence=pesar as provas; follow clear criteria=seguir critérios claros|without: take sides=tomar partido; hurt anyone=magoar ninguém|modo: stay neutral=manter a neutralidade; act fairly=agir com justiça|while: take notes=fazer anotações; listen to the witnesses=ouvir as testemunhas
add subtract multiply divide estimate round weigh total demonstrate plot rank convert compute balance integrate approximate tally simplify double triple|step: check the numbers=conferir os números; write the formula=escrever a fórmula|by: use a calculator=usar calculadora; use a formula=usar uma fórmula|without: skip the steps=pular as etapas; guess=chutar|modo: count carefully=contar com cuidado; work step by step=trabalhar passo a passo|while: write the steps=escrever as etapas; check the numbers=conferir os números
cost owe bargain rent donate waste shop import export auction sponsor finance profit price discount tax insure cash bill purchase reimburse|step: compare the prices=comparar os preços; check the budget=conferir o orçamento|by: negotiate the price=negociar o preço; wait for a sale=esperar uma promoção|without: read the terms=ler os termos; check the price=conferir o preço|modo: compare carefully=comparar com cuidado; plan carefully=planejar com cuidado|while: wait in line=esperar na fila; check the prices online=conferir os preços online
cook bake boil fry chop slice peel pour mix stir taste serve grill season feed chew swallow bite melt squeeze spread roast steam simmer whisk knead grate marinate dice mash toast sprinkle stuff brew sip devour nibble snack starve dine lick thaw ferment drain garnish|step: wash the vegetables=lavar os legumes; wash {p} hands=lavar {FP} mãos|by: follow the recipe=seguir a receita; use fresh ingredients=usar ingredientes frescos|without: burn the food=queimar a comida; add salt=colocar sal|modo: work cleanly=trabalhar com limpeza; work patiently=trabalhar com paciência|while: stir the sauce=mexer o molho; set the table=pôr a mesa
study pronounce spell quote examine summarize highlight draft correct revise enroll lecture cheat underline annotate cite paraphrase rehearse conjugate fail debate investigate observe experiment instruct|step: read the text twice=ler o texto duas vezes; organize the notes=organizar as anotações|by: solve exercises=resolver exercícios; review the mistakes=revisar os erros|without: copy the answers=copiar as respostas; skip the lessons=pular as aulas|modo: read carefully=ler com atenção; work patiently=trabalhar com paciência|while: listen to the teacher=ouvir o professor; take notes=fazer anotações
plant harvest protect recycle pollute burn freeze shine fish camp bloom survive sink blow flood flow splash spray wither sprout hunt graze hatch float erode evaporate ripen sparkle decay soar|step: check the weather=ver a previsão do tempo; pack water=levar água|by: save water=economizar água; plant trees=plantar árvores|without: harm the animals=machucar os animais; leave trash=deixar lixo|modo: walk slowly=caminhar devagar; move quietly=andar em silêncio|while: watch the birds=observar os pássaros; walk in the forest=caminhar na floresta
sing dance act perform film photograph entertain celebrate relax collect gather sculpt sketch illustrate direct strum tune conduct improvise frame exhibit rhyme recite dub animate|step: sketch the idea=esboçar a ideia; warm up=aquecer|by: practice every day=praticar todo dia; study the masters=estudar os mestres|without: lose the rhythm=perder o ritmo; copy anyone=copiar ninguém|modo: work with passion=trabalhar com paixão; work patiently=trabalhar com paciência|while: listen to music=ouvir música; look at the picture=olhar o quadro
obey forbid allow require sue arrest vote elect ban govern punish testify declare comply sentence convict acquit prosecute enforce regulate legislate authorize license prohibit violate oblige appeal ratify repeal enact inherit release|step: read the law=ler a lei; check the facts=conferir os fatos|by: follow the law=seguir a lei; hire a lawyer=contratar um advogado|without: break the law=violar a lei; sign anything=assinar nada|modo: follow the rules=seguir as regras; stay calm=manter a calma|while: take notes=fazer anotações; read the contract=ler o contrato
promise|step: think it over=pensar a respeito; check the schedule=conferir a agenda|by: put it in writing=colocar por escrito; set a date=marcar uma data|without: think twice=pensar duas vezes; read the terms=ler os termos|modo: speak clearly=falar com clareza; stay honest=ser honesto|while: shake hands=apertar as mãos; sign the paper=assinar o papel
confiscate threaten attack destroy damage kill rescue explode|step: check the situation=avaliar a situação; call for help=pedir ajuda|by: follow the safety rules=seguir as regras de segurança; ask for help=pedir ajuda|without: warn anyone=avisar ninguém; hurt anyone=machucar ninguém|modo: stay calm=manter a calma; act carefully=agir com cuidado|while: wait for help=esperar ajuda; call for help=pedir ajuda`;
O2_RG_SUB_TXT.split('\n').forEach(l => {
  const p = l.split('|'), ids = p[0].split(' ');
  ids.forEach(id => {
    const d = O2_RG_VERBO[id] || (O2_RG_VERBO[id] = {});
    p.slice(1).forEach(x => { const m = x.match(/^(\w+): (.*)$/); if(m && !(d[m[1]] && d[m[1]].length >= 2)) d[m[1]] = (d[m[1]] || []).concat(m[2].split('; ').map(y => ({ en:y.split('=')[0], pt:y.split('=')[1] }))); });
  });
});
/* verbos frasais (give up, look up…) sem lista própria: complementos genéricos de estudo de expressões */
VERBS.filter(v => v.phrasal && !O2_RG_VERBO[v.id]).forEach(v => { O2_RG_VERBO[v.id] = {
  step: [{ en:'check the context', pt:'ver o contexto' }, { en:'read the instructions', pt:'ler as instruções' }],
  by: [{ en:'practice every day', pt:'praticar todo dia' }, { en:'use it in sentences', pt:'usar em frases' }],
  without: [{ en:'translate word by word', pt:'traduzir palavra por palavra' }, { en:'lose the meaning', pt:'perder o sentido' }],
  modo: [{ en:'stay focused', pt:'manter o foco' }, { en:'work patiently', pt:'trabalhar com paciência' }] }; });
/* v143: lacunas pontuais — papéis que ficaram sem item próprio em verbos com entrada parcial */
const O2_RG_LACUNA = {
  meet:{ without:[{ en:'checking the agenda', pt:'conferir a pauta' }, { en:'preparing the numbers', pt:'preparar os números' }] },
  send:{ by:[{ en:'attaching the file', pt:'anexar o arquivo' }, { en:'using the official channel', pt:'usar o canal oficial' }] },
  wear:{ modo:[{ en:'looking professional', pt:'com aparência profissional' }, { en:'feeling comfortable', pt:'sentindo-se à vontade' }] },
  visit:{ by:[{ en:'booking in advance', pt:'agendar com antecedência' }, { en:'taking the train', pt:'ir de trem' }], without:[{ en:'calling first', pt:'ligar antes' }, { en:'bringing a gift', pt:'levar um presente' }] },
  call:{ without:[{ en:'leaving a message', pt:'deixar recado' }, { en:'checking the number', pt:'conferir o número' }] },
  learn:{ without:[{ en:'making mistakes', pt:'errar' }, { en:'practicing aloud', pt:'praticar em voz alta' }] } };
Object.keys(O2_RG_LACUNA).forEach(id => { const d = O2_RG_VERBO[id] || (O2_RG_VERBO[id] = {}); Object.keys(O2_RG_LACUNA[id]).forEach(k => { if(!(d[k] && d[k].length)) d[k] = O2_RG_LACUNA[id][k]; }); });
let o2MaisOpc = {};   /* v143: tipo → lista de opções expandida */
const O2_RG_PAPEL = { while:'while', after:'step', before:'step', upon:'upon', by:'by', without:'without', having:'having' };
/* devolve o conjunto do papel (as 3 primeiras variam conforme o verbo), sem repetir o verbo principal (lemma) e girando o ponto de partida pelo verbo para dar variedade */
function o2RgerOpcoes(v, cj){
  const t = O2_TIPOS.find(x => x.k === 'rger'), e = (t.conjs[Math.min(cj, t.conjs.length - 1)] || t.conjs[0]).en;
  const papel = O2_RG_PAPEL[e] || 'modo', semV = o => o.en.split(' ')[0] !== v.id;
  const pk = papel === 'upon' || papel === 'having' ? 'step' : papel;
  const cat = verbCats(v).find(c => O2_RG_TEMA[c] && O2_RG_TEMA[c][pk]);
  /* v141: com 2+ complementos próprios do verbo, o campo só entra no fim da lista (evita "dream … weigh the options") */
  const proprios = ((O2_RG_VERBO[v.id] || {})[pk] || []).filter(semV), doCampo = ((cat && O2_RG_TEMA[cat][pk]) || []).filter(semV);
  const unico = a => a.filter((o, i) => a.findIndex(x => x.en === o.en) === i);
  const tem = unico(proprios.length >= 2 ? proprios : proprios.concat(doCampo)), campoFim = proprios.length >= 2 ? doCampo : [];
  const base = O2_RG_POOL[papel].filter(semV).filter(o => !tem.some(x => x.en === o.en));
  /* metas genéricas (usadas nos parágrafos) ficam no fim da lista: servem a qualquer verbo, mas não são a 1ª escolha */
  const metas = o => /^(enjoy the meal|improve \{p\} performance|learn something new|solve the problem|get a better price|reach an agreement|meet the deadline|avoid mistakes|avoid the traffic)$/.test(o.en);
  const pool = base.filter(o => !metas(o)), fim = base.filter(metas);
  const h = (v.id || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0), n = pool.length, out = tem.slice();
  for(let i = 0; i < n; i++) out.push(pool[(h + i) % n]);
  return unico(out.concat(campoFim.filter(o => !out.some(x => x.en === o.en)), fim));
}
/* particípios curados (sujeito = quem sofre a ação ou está no estado). pm/pf = português masculino/feminino; inv = invariável ("se necessário") */
const O2_RP = [
  [{ en:'prepared', pm:'preparado', pf:'preparada' }, { en:'trained', pm:'treinado', pf:'treinada' }, { en:'approved', pm:'aprovado', pf:'aprovada' }, { en:'confirmed', pm:'confirmado', pf:'confirmada' }, { en:'signed', pm:'assinado', pf:'assinada' }, { en:'completed', pm:'concluído', pf:'concluída' }],       /* once */
  [{ en:'asked', pm:'solicitado', pf:'solicitada' }, { en:'invited', pm:'convidado', pf:'convidada' }, { en:'called', pm:'chamado', pf:'chamada' }, { en:'needed', pm:'necessário', pf:'necessário', inv:1 }, { en:'contacted', pm:'contatado', pf:'contatada' }, { en:'required', pm:'exigido', pf:'exigida' }],        /* when */
  [{ en:'needed', pm:'necessário', pf:'necessário', inv:1 }, { en:'asked', pm:'solicitado', pf:'solicitada' }, { en:'paid', pm:'pago', pf:'paga' }, { en:'invited', pm:'convidado', pf:'convidada' }, { en:'required', pm:'exigido', pf:'exigida' }, { en:'approved', pm:'aprovado', pf:'aprovada' }],          /* if */
  [{ en:'tired', pm:'cansado', pf:'cansada' }, { en:'warned', pm:'avisado', pf:'avisada' }, { en:'worried', pm:'preocupado', pf:'preocupada' }, { en:'delayed', pm:'atrasado', pf:'atrasada' }, { en:'surprised', pm:'surpreso', pf:'surpresa' }, { en:'disappointed', pm:'decepcionado', pf:'decepcionada' }],           /* although */
  [{ en:'tired', pm:'cansado', pf:'cansada' }, { en:'prepared', pm:'preparado', pf:'preparada' }, { en:'surprised', pm:'surpreso', pf:'surpresa' }, { en:'worried', pm:'preocupado', pf:'preocupada' }, { en:'confused', pm:'confuso', pf:'confusa' }, { en:'excited', pm:'animado', pf:'animada' }]         /* (só -ed) */
];
/* relativas reduzidas por tipo do substantivo ({s} = sujeito, só na forma desenvolvida) */
const O2_RR = {
  '-ing':{
    pessoa:[{ en:'working here', pt:'que trabalha aqui', ptp:'que trabalham aqui', full:'who works here' }, { en:'living nearby', pt:'que mora por perto', ptp:'que moram por perto', full:'who lives nearby' }, { en:'waiting outside', pt:'que espera lá fora', ptp:'que esperam lá fora', full:'who is waiting outside' }],
    coisa:[{ en:'costing less', pt:'que custa menos', ptp:'que custam menos', full:'that costs less' }, { en:'including the taxes', pt:'que inclui os impostos', ptp:'que incluem os impostos', full:'that includes the taxes' }, { en:'working perfectly', pt:'que funciona perfeitamente', ptp:'que funcionam perfeitamente', full:'that works perfectly' }],
    lugar:[{ en:'offering free parking', pt:'que oferece estacionamento grátis', ptp:'que oferecem estacionamento grátis', full:'that offers free parking' }, { en:'serving local food', pt:'que serve comida local', ptp:'que servem comida local', full:'that serves local food' }, { en:'opening at nine', pt:'que abre às nove', ptp:'que abrem às nove', full:'that opens at nine' }],
    tempo:[{ en:'following the meeting', pt:'que vem depois da reunião', ptp:'que vêm depois da reunião', full:'that follows the meeting' }, { en:'coming soon', pt:'que está chegando', ptp:'que estão chegando', full:'that is coming soon' }, { en:'ending the project', pt:'que encerra o projeto', ptp:'que encerram o projeto', full:'that ends the project' }] },
  '-ed':{
    pessoa:[{ en:'invited to the meeting', pm:'convidado', pf:'convidada', rest:' para a reunião', full:'who was invited to the meeting' }, { en:'trained by experts', pm:'treinado', pf:'treinada', rest:' por especialistas', full:'who was trained by experts' }, { en:'hired last year', pm:'contratado', pf:'contratada', rest:' no ano passado', full:'who was hired last year' }],
    coisa:[{ en:'made in Brazil', pm:'feito', pf:'feita', rest:' no Brasil', full:'that is made in Brazil' }, { en:'written in English', pm:'escrito', pf:'escrita', rest:' em inglês', full:'that is written in English' }, { en:'needed for work', pm:'necessário', pf:'necessária', rest:' para o trabalho', full:'that is needed for work' }],
    lugar:[{ en:'built in 2010', pm:'construído', pf:'construída', rest:' em 2010', full:'that was built in 2010' }, { en:'located downtown', pm:'localizado', pf:'localizada', rest:' no centro', full:'that is located downtown' }, { en:'known for its food', pm:'conhecido', pf:'conhecida', rest:' pela comida', full:'that is known for its food' }],
    tempo:[{ en:'planned for tomorrow', pm:'planejado', pf:'planejada', rest:' para amanhã', full:'that is planned for tomorrow' }, { en:'scheduled for Monday', pm:'marcado', pf:'marcada', rest:' para segunda', full:'that is scheduled for Monday' }, { en:'remembered by everyone', pm:'lembrado', pf:'lembrada', rest:' por todos', full:'that is remembered by everyone' }] },
  'to':{
    pessoa:[{ en:'to talk to', pt:'com quem conversar', full:'who {s} can talk to' }, { en:'to rely on', pt:'em quem confiar', full:'who {s} can rely on' }, { en:'to learn from', pt:'com quem aprender', full:'who {s} can learn from' }],
    coisa:[{ en:'to think about', pt:'em que pensar', full:'that {s} can think about' }, { en:'to talk about', pt:'sobre o que falar', full:'that {s} can talk about' }, { en:'to rely on', pt:'em que confiar', full:'that {s} can rely on' }],
    lugar:[{ en:'to live in', pt:'onde morar', full:'where {s} can live' }, { en:'to work in', pt:'onde trabalhar', full:'where {s} can work' }, { en:'to stay at', pt:'onde ficar', full:'where {s} can stay' }],
    tempo:[{ en:'to start', pt:'para começar', full:'when {s} can start' }, { en:'to decide', pt:'para decidir', full:'when {s} has to decide' }, { en:'to celebrate', pt:'para comemorar', full:'when {s} can celebrate' }] }
};
/* ================= v137 · COMBINAÇÕES GENÉRICAS — opções curadas por CLASSE do substantivo e por FUNÇÃO da conjunção =================
   Antes: "a break costing less", "English made in Brazil". Agora a relativa reduzida só usa opções que fazem sentido para a CLASSE do núcleo
   (documento, objeto, comida, evento, mídia, organização, animal, dinheiro/dados, abstrato) e recusa núcleos que não aceitam a forma (qualidades, números, "a break"). */
const O2_RR_CLS = {
  doc:'web report document file files code contract proposal letter email message text page paper book article form list map password agreement license record entry equation formula theorem graph column label update link bill invoice instruction manual note contract catalog database spam comment application statement receipt permit visa lease request booking title verb sentence feedback warning treaty homework invitation signature',
  obj:'car phone ball key door table wall floor shoe jacket dress box boat tool computer laptop radio bike bus train taxi plane drone chair desk machine device engine screen server board piece part carpet roof bridge rope wood metal plastic clay package parcel bag luggage mask suit chest flag piano guitar statue plate drawer toy camera tv coat ring watch bottle cup brick glass shoes clothes clothe goods good gift button app software program website equipment dice weight trophy hand arm muscle seed plant flower tree stair shirt sweater scarf sock cloth towel candle lamp fabric wire knot poster logo pencil knife blade sword spoon pan pot bin lid shelf basket fence tile furniture sink gate porch garage wallet coin stamp icon disk router card ticket voucher nail diamond marble weapon wheel globe net seat bell trash flyer packaging screenshot gum pill bat',
  food:'food dinner meal coffee tea bread meat fish cake sauce vegetable potato rice egg soup butter cheese chicken dough salad pasta cream wine salt apple fruit lunch breakfast snack juice milk beer sugar cookie pizza dish dishe herb tomato garlic sandwich chocolate lemon orange jam corn salsa onion ingredient carrot banana avocado nut turkey pepper dessert spice pumpkin grocery',
  event:'meeting trip class project course call game event task appointment party test exam lesson schedule marathon contest match election competition conference interview visit tour mission order campaign wedding birthday victory presentation trial experiment strike delivery attack',
  media:'movie song video story documentary poem painting picture photo music scene portrait speech show film series podcast album novel melody tune symphony solo chord',
  org:'company committee business service bank firm store brand organization agency department economy system startup industry orchestra choir',
  animal:'dog cat horse bird animal cow pet deer',
  price:'price cost fee discount refund offer deal',
  mass:'money data information news income revenue sale payment loan debt asset progress budget salary cash rent fund investment stock profit credit currency expense balance portfolio medicine vaccine antibiotic',
  /* x = núcleo que NÃO aceita relativa reduzida com estas opções (qualidades, sentimentos, números, palavras que não são substantivos concretos) */
  x:'english language skill accent break rest nap chance luck fear courage loyalty gratitude patience respect innocence silence pain success loss hope doubt failure effort focus access confidence pride life me go talk decide raise throw ten hundred kilo dollar hour little best worst online briefly important comfortable dark criminal final one other everything something lot goodbye present average smoking waiting cover use water oil air mountain forest equally forth guilty wrong two local cold working living accused second top lead shock itch smoke statu sense nature sunday search hire blow climb repair creativity importance freedom nerve morale growth quality expectation speed size scale scope tone caution apology oath prayer meaning river ocean lake landscape coast hole stain wave curve fire star planet surface border sky'
};
const O2_RR_MAPA = {};
Object.keys(O2_RR_CLS).forEach(c => O2_RR_CLS[c].split(' ').forEach(w => { O2_RR_MAPA[w] = c; }));
/* núcleo → classe. Pessoa/lugar/tempo continuam pelo o2RelTipo; "coisa" desconhecida cai em "abs" (opções seguras para quase qualquer substantivo) */
function o2RelClasse(hd, en, tp){
  if(tp !== 'coisa') return tp;
  const raw = (en || '').toLowerCase().replace(/[^a-z\s-]/g, '').trim().split(/\s+/).pop() || '';
  return O2_RR_MAPA[hd] || O2_RR_MAPA[raw] || O2_RR_MAPA[raw.replace(/es$/, '')] || O2_RR_MAPA[raw.replace(/s$/, '')] || 'abs';
}
/* helpers curtos para escrever os dados: -ing (pt singular / plural), -ed (masc / fem / resto), to */
const _ri = (en, pt, ptp, full) => ({ en, pt, ptp, full });
const _re = (en, pm, pf, rest, full) => ({ en, pm, pf, rest, full });
const _rt = (en, pt, full) => ({ en, pt, full });
const O2_RR_C = {
  obj:{ '-ing':[_ri('working perfectly', 'que funciona perfeitamente', 'que funcionam perfeitamente', 'that works perfectly'), _ri('costing less', 'que custa menos', 'que custam menos', 'that costs less'), _ri('lying on the table', 'que está sobre a mesa', 'que estão sobre a mesa', 'that is lying on the table')],
        '-ed':[_re('made in Brazil', 'feito', 'feita', ' no Brasil', 'that is made in Brazil'), _re('used every day', 'usado', 'usada', ' todos os dias', 'that is used every day'), _re('left on the table', 'deixado', 'deixada', ' sobre a mesa', 'that was left on the table')],
        'to':[_rt('to use', 'para usar', 'that {s} can use'), _rt('to fix', 'para consertar', 'that {s} can fix'), _rt('to try', 'para experimentar', 'that {s} can try')] },
  doc:{ '-ing':[_ri('describing the process', 'que descreve o processo', 'que descrevem o processo', 'that describes the process'), _ri('including the details', 'que inclui os detalhes', 'que incluem os detalhes', 'that includes the details'), _ri('explaining the rules', 'que explica as regras', 'que explicam as regras', 'that explains the rules')],
        '-ed':[_re('written in English', 'escrito', 'escrita', ' em inglês', 'that is written in English'), _re('signed by both sides', 'assinado', 'assinada', ' pelas duas partes', 'that was signed by both sides'), _re('sent last week', 'enviado', 'enviada', ' na semana passada', 'that was sent last week'), _re('needed for work', 'necessário', 'necessária', ' para o trabalho', 'that is needed for work')],
        'to':[_rt('to read', 'para ler', 'that {s} can read'), _rt('to sign', 'para assinar', 'that {s} can sign'), _rt('to review', 'para revisar', 'that {s} can review')] },
  food:{ '-ing':[_ri('smelling good', 'que tem cheiro bom', 'que têm cheiro bom', 'that smells good'), _ri('containing nuts', 'que contém nozes', 'que contêm nozes', 'that contains nuts'), _ri('costing less', 'que custa menos', 'que custam menos', 'that costs less')],
         '-ed':[_re('cooked at home', 'cozido', 'cozida', ' em casa', 'that was cooked at home'), _re('served hot', 'servido', 'servida', ' quente', 'that is served hot'), _re('made with fresh ingredients', 'feito', 'feita', ' com ingredientes frescos', 'that is made with fresh ingredients')],
         'to':[_rt('to eat', 'para comer', 'that {s} can eat'), _rt('to share', 'para dividir', 'that {s} can share'), _rt('to try', 'para experimentar', 'that {s} can try')] },
  event:{ '-ing':[_ri('starting at nine', 'que começa às nove', 'que começam às nove', 'that starts at nine'), _ri('lasting two hours', 'que dura duas horas', 'que duram duas horas', 'that lasts two hours'), _ri('involving the whole team', 'que envolve toda a equipe', 'que envolvem toda a equipe', 'that involves the whole team')],
          '-ed':[_re('scheduled for Monday', 'marcado', 'marcada', ' para segunda', 'that is scheduled for Monday'), _re('planned for tomorrow', 'planejado', 'planejada', ' para amanhã', 'that is planned for tomorrow'), _re('held online', 'realizado', 'realizada', ' online', 'that is held online')],
          'to':[_rt('to attend', 'para participar', 'that {s} can attend'), _rt('to cancel', 'para cancelar', 'that {s} can cancel'), _rt('to organize', 'para organizar', 'that {s} can organize')] },
  media:{ '-ing':[_ri('telling a true story', 'que conta uma história verdadeira', 'que contam uma história verdadeira', 'that tells a true story'), _ri('teaching an important lesson', 'que ensina uma lição importante', 'que ensinam uma lição importante', 'that teaches an important lesson'), _ri('attracting millions of people', 'que atrai milhões de pessoas', 'que atraem milhões de pessoas', 'that attracts millions of people')],
          '-ed':[_re('released last year', 'lançado', 'lançada', ' no ano passado', 'that was released last year'), _re('known worldwide', 'conhecido', 'conhecida', ' no mundo todo', 'that is known worldwide'), _re('shared online', 'compartilhado', 'compartilhada', ' na internet', 'that was shared online')],
          'to':[_rt('to recommend', 'para recomendar', 'that {s} can recommend'), _rt('to remember', 'para lembrar', 'that {s} can remember'), _rt('to talk about', 'sobre o que falar', 'that {s} can talk about')] },
  org:{ '-ing':[_ri('growing fast', 'que cresce rápido', 'que crescem rápido', 'that grows fast'), _ri('hiring new people', 'que contrata pessoas novas', 'que contratam pessoas novas', 'that hires new people'), _ri('offering good prices', 'que oferece bons preços', 'que oferecem bons preços', 'that offers good prices')],
        '-ed':[_re('founded in 2010', 'fundado', 'fundada', ' em 2010', 'that was founded in 2010'), _re('known for its quality', 'conhecido', 'conhecida', ' pela qualidade', 'that is known for its quality'), _re('located downtown', 'localizado', 'localizada', ' no centro', 'that is located downtown')],
        'to':[_rt('to work for', 'onde trabalhar', 'that {s} can work for'), _rt('to invest in', 'em que investir', 'that {s} can invest in'), _rt('to rely on', 'em que confiar', 'that {s} can rely on')] },
  animal:{ '-ing':[_ri('running in the park', 'que corre no parque', 'que correm no parque', 'that is running in the park'), _ri('waiting outside', 'que espera lá fora', 'que esperam lá fora', 'that is waiting outside'), _ri('barking all night', 'que late a noite toda', 'que latem a noite toda', 'that barks all night')],
           '-ed':[_re('trained by experts', 'treinado', 'treinada', ' por especialistas', 'that was trained by experts'), _re('found in the street', 'encontrado', 'encontrada', ' na rua', 'that was found in the street'), _re('adopted last year', 'adotado', 'adotada', ' no ano passado', 'that was adopted last year')],
           'to':[_rt('to feed', 'para alimentar', 'that {s} can feed'), _rt('to walk', 'para passear', 'that {s} can walk'), _rt('to take care of', 'para cuidar', 'that {s} can take care of')] },
  mass:{ '-ing':[_ri('coming from sales', 'que vem das vendas', 'que vêm das vendas', 'that comes from sales'), _ri('arriving next week', 'que chega na semana que vem', 'que chegam na semana que vem', 'that arrives next week'), _ri('growing every month', 'que cresce a cada mês', 'que crescem a cada mês', 'that grows every month')],
         '-ed':[_re('stored safely', 'armazenado', 'armazenada', ' com segurança', 'that is stored safely'), _re('needed for work', 'necessário', 'necessária', ' para o trabalho', 'that is needed for work'), _re('used every day', 'usado', 'usada', ' todos os dias', 'that is used every day')],
         'to':[_rt('to use', 'para usar', 'that {s} can use'), _rt('to save', 'para guardar', 'that {s} can save'), _rt('to share', 'para compartilhar', 'that {s} can share')] },
  price:{ '-ing':[_ri('increasing every month', 'que aumenta a cada mês', 'que aumentam a cada mês', 'that increases every month'), _ri('including the taxes', 'que inclui os impostos', 'que incluem os impostos', 'that includes the taxes'), _ri('changing every week', 'que muda toda semana', 'que mudam toda semana', 'that changes every week')],
          '-ed':[_re('agreed last week', 'combinado', 'combinada', ' na semana passada', 'that was agreed last week'), _re('listed on the website', 'listado', 'listada', ' no site', 'that is listed on the website'), _re('announced yesterday', 'anunciado', 'anunciada', ' ontem', 'that was announced yesterday')],
          'to':[_rt('to pay', 'para pagar', 'that {s} can pay'), _rt('to negotiate', 'para negociar', 'that {s} can negotiate'), _rt('to accept', 'para aceitar', 'that {s} can accept')] },
  abs:{ '-ing':[_ri('affecting everyone', 'que afeta todo mundo', 'que afetam todo mundo', 'that affects everyone'), _ri('involving the team', 'que envolve a equipe', 'que envolvem a equipe', 'that involves the team'), _ri('causing delays', 'que causa atrasos', 'que causam atrasos', 'that causes delays')],
        '-ed':[_re('mentioned yesterday', 'mencionado', 'mencionada', ' ontem', 'that was mentioned yesterday'), _re('discussed in the meeting', 'discutido', 'discutida', ' na reunião', 'that was discussed in the meeting'), _re('known by everyone', 'conhecido', 'conhecida', ' por todos', 'that is known by everyone')],
        'to':[_rt('to think about', 'em que pensar', 'that {s} can think about'), _rt('to talk about', 'sobre o que falar', 'that {s} can talk about'), _rt('to deal with', 'com que lidar', 'that {s} can deal with')] }
};
/* opções da relativa reduzida: pessoa/lugar/tempo vêm de O2_RR; "coisa" vem da classe do núcleo */
function o2RrOpcoes(forma, tipo, cls){
  return (tipo === 'coisa' ? (O2_RR_C[cls] || O2_RR_C.abs)[forma] : O2_RR[forma][tipo]);
}
/* formas nominais: inglês (-ing · particípio) e português (gerúndio · particípio) derivadas do verbo, com irregulares à parte */
const O2_PT_GER_IRR = { 'pôr':'pondo', ter:'tendo', vir:'vindo', ver:'vendo', ser:'sendo', ir:'indo' };
const O2_PT_PART_IRR = { fazer:'feito', dizer:'dito', ver:'visto', vir:'vindo', 'pôr':'posto', escrever:'escrito', abrir:'aberto', cobrir:'coberto', pagar:'pago', gastar:'gasto', ganhar:'ganho', aceitar:'aceito', entregar:'entregue', ser:'sido', ter:'tido' };
function o2PtGer(inf){
  const w = inf.split(' ')[0];
  if(O2_PT_GER_IRR[w]) return O2_PT_GER_IRR[w];
  if(/ar$/.test(w)) return w.slice(0, -2) + 'ando';
  if(/er$/.test(w)) return w.slice(0, -2) + 'endo';
  if(/ir$/.test(w)) return w.slice(0, -2) + 'indo';
  if(/or$/.test(w)) return w.slice(0, -2) + 'ondo';
  return w;
}
function o2PtPart(inf){
  const w = inf.split(' ')[0];
  if(O2_PT_PART_IRR[w]) return O2_PT_PART_IRR[w];
  if(/ar$/.test(w)) return w.slice(0, -2) + 'ado';
  return /(er|ir)$/.test(w) ? w.slice(0, -2) + 'ido' : w;
}
function o2EnIng(w){
  const v = verbPorNome(w); if(v && v.base === w) return v.ing;
  if(w === 'be') return 'being';
  return /ie$/.test(w) ? w.slice(0, -2) + 'ying' : /[^e]e$/.test(w) ? w.slice(0, -1) + 'ing' : w + 'ing';
}
function o2EnPP(w){
  const v = verbPorNome(w); if(v && v.base === w) return v.pp;
  if(w === 'be') return 'been';
  return /e$/.test(w) ? w + 'd' : w + 'ed';
}
/* "save money" → { w:'save', rest:' money' } (inglês) e { pw:'economizar', prest:' dinheiro' } (português) */
function o2RedSplit(op, pr){
  const en = o2Sub(op.en, pr), pt = o2Sub(op.pt, pr, true), i = en.indexOf(' '), j = pt.indexOf(' ');
  return { w: i < 0 ? en : en.slice(0, i), rest: i < 0 ? '' : en.slice(i), pw: j < 0 ? pt : pt.slice(0, j), prest: j < 0 ? '' : pt.slice(j) };
}
/* forma desenvolvida equivalente (só para o aluno comparar): "she reads the news" */
function o2RedDev(w, rest, pr, neg){
  const v = verbPorNome(w); if(!v || v.base !== w || w === 'be') return null;
  try {
    const g = generate('fact', state.tempo === 'past' ? 'past' : 'present', 'simples', neg ? 'negativa' : 'afirmativa', pr, v);
    let t = stripMarks(g.text); if(!/^I\b/.test(t)) t = t.charAt(0).toLowerCase() + t.slice(1);
    return t + rest;
  } catch(e){ return null; }
}
const O2_RED_G = pr => (pr === 'She' ? 'f' : 'm') + (pr === 'We' || pr === 'They' ? 'p' : 's');   /* gênero e número do sujeito (masculino é o padrão neutro) */
function o2PtPartConc(o, pr){
  const g = O2_RED_G(pr), base = (g[0] === 'f' ? o.pf : o.pm);
  return (g[1] === 'p' && !o.inv) ? (/[ãõ]o$/.test(base) ? base : base.replace(/(.*)$/, '$1s')) : base;
}
function o2Norm(){
  if(!state.o2 || typeof state.o2 !== 'object') state.o2 = { tipo:null, opt:0, conj:0, neg:false, custom:null, para:null, c2:null, cnd:null, tr:null };
  const o = state.o2, t = O2_TIPOS.find(x => x.k === o.tipo);
  /* v108: foco dos encaixes (1 = principal, 2 = 2ª oração) e a "mala" de encaixes da 2ª oração */
  o.foco = (o.foco === 2 && o.tipo) ? 2 : 1;
  if(!o.sl2 || typeof o.sl2 !== 'object') o.sl2 = {};
  if(!Array.isArray(o.sl2.signalMids)) o.sl2.signalMids = [];
  if(!Array.isArray(o.sl2.signalEnds)) o.sl2.signalEnds = [];
  if(!t){ o.tipo = null; o.conj = 0; } else if(!(o.conj >= 0 && o.conj < t.conjs.length)) o.conj = 0;
  if(!Number.isInteger(o.opt) || o.opt < 0 || o.opt > 29) o.opt = 0;   /* v142: as listas de opções passaram de 3 (rger/rinf/rpart têm mais) */
  o.neg = !!o.neg;
  if(!(typeof o.q === 'string' && O2_Q[o.q])) o.q = null;   /* v131: sujeito concreto da substantiva (null = "it") */
  delete o.ini;                                          /* v96: a ordem é decidida pela conjunção, não pelo aluno */
  const trOk = ['caus>cons', 'cons>caus', 'conc>adv', 'final>cons', 'caus>of', 'cond>or'];
  if(!trOk.includes(o.tr)) o.tr = null;                  /* v96: transformação de sentido ativa */
  if(!(Number.isInteger(o.cnd) && o.cnd >= 0 && o.cnd <= 3)) o.cnd = null;   /* v92: tipo da condicional (null = deriva da principal) */
  if(o.c2 !== 'same' && o.c2 !== 'none' && !(Number.isInteger(o.c2) && o.c2 >= 0 && o.c2 < 3)) o.c2 = null;   /* colocação do verbo 2 */
  if(o.custom && (!VERBS.some(v => v.id === o.custom) || o.para !== state.verbo)) o.custom = null;
}
function o2TemaDe(v, tp){
  const cats = verbCats(v);
  for(const c of cats) if(O2_TEMA[tp][c]) return O2_TEMA[tp][c];
  return O2_TEMA[tp].trab;
}
/* até 3 opções coerentes com o verbo principal; src: ✓ curada · ≈ por tema · auto derivada dos antônimos/sinônimos */
function o2Opcoes(k, v, cj){
  const ex = VERB_EXTRA[v.id] || { syn:[], ant:[] };
  const mapa = ws => { const out = [], vis = new Set(); ws.forEach(w => { const x = verbPorNome(w); if(x && x.id !== v.id && !vis.has(x.id)){ vis.add(x.id); out.push(x); } }); return out; };
  if(k === 'final'){
    const cur = !v.phrasal && O2_FIN[v.id];
    return (cur || o2TemaDe(v, 'F')).map(o => ({ en:o.en, pt:o.pt, src: cur ? '✓' : '≈' }));
  }
  /* v117: sem antônimo na ficha → verbos de contraste curados (src ✓) */
  const antEf = () => { const a = mapa(ex.ant); return a.length ? { a, src:'auto' } : { a:mapa(O2_CONTRA[v.id] || []), src:'✓' }; };
  if(k === 'adv'){
    const { a, src } = antEf(), out = [];
    if(a[0]){ out.push({ v:a[0].id, neg:false, src }, { v:a[0].id, neg:true, src }); }
    if(a[1]) out.push({ v:a[1].id, neg:false, src });
    return out;
  }
  if(k === 'alt'){                       /* v93: antônimos primeiro (or = outra via), depois sinônimo */
    const { a, src } = antEf(), sy = mapa(ex.syn), out = [];
    if(a[0]) out.push({ v:a[0].id, neg:false, src });
    if(a[1]) out.push({ v:a[1].id, neg:false, src });
    if(sy[0]) out.push({ v:sy[0].id, neg:false, src:'auto' });
    return out;
  }
  if(k === 'adit') return mapa(ex.syn).slice(0, 3).map(x => ({ v:x.id, neg:false, src:'auto' }));
  if(k === 'oq') return o2OqOpcoes(v, cj);                  /* v161: verbos do gatilho */
  if(k === 'obj') return o2TemaDe(v, 'A').map(o => ({ en:o.en, pt:o.pt, src:'≈' }));   /* v98: "it is …" */
  if(k === 'rel' || k === 'relx'){
    const st = o2RelEstado(), tp = O2_TIPOS.find(t => t.k === k), ef = st.ok ? o2RelEf((tp.conjs[cj] || tp.conjs[0]).en, st.tipo) : null;
    if(ef === 'whose') return O2_WHOSE[st.tipo].map((w, i) => ({ v:null, wh:w, en:'', pt:'', neg:false, src:'auto' }));
    if(ef === 'where') return O2_REL_WHERE.map(x => ({ v:x, en:'', pt:'', neg:false, src:'auto' }));
    if(ef === 'when') return O2_REL_WHEN.map(x => ({ v:x, en:'', pt:'', neg:false, src:'auto' }));
    return (st.ok && st.pessoa ? O2_REL_PESSOA : O2_REL_COISA).map(x => ({ v:x, en:'', pt:'', neg:false, src:'auto' }));
  }
  if(k === 'conc'){                     /* v92: although → adjetivo ("it is hard") · despite → substantivo ("the pressure") */
    return o2TemaDe(v, o2ConcNome(cj) ? 'N' : 'A').map(o => ({ en:o.en, pt:o.pt, src:'≈' }));
  }
  /* v135: reduzidas */
  if(k === 'rger') return o2RgerOpcoes(v, cj).map(o => ({ en:o.en, pt:o.pt, src:'✓' }));   /* v137: por papel da conjunção */
  if(k === 'rpart') return O2_RP[Math.min(cj, O2_RP.length - 1)].map(o => Object.assign({ pt:'', src:'≈' }, o));
  if(k === 'rinf') return (O2_RI_OPC[v.id] || o2TemaDe(v, 'F')).map(o => ({ en:o.en, pt:o.pt, src: O2_RI_OPC[v.id] ? '✓' : '≈' }));   /* v137: curado por verbo */
  if(k === 'rrel'){ const st = o2RelEstado(true); if(!st.ok) return [];
    const forma = ['-ing', '-ed', 'to'][Math.min(cj, 2)], base = o2RrOpcoes(forma, st.tipo, st.cls);
    /* v137: sem repetir o verbo principal ("feed the dog to feed", "cook dinner cooked at home") */
    const w1 = o => o.en.split(' ')[0], red = o => forma === '-ing' ? w1(o) === o2EnIng(v.id) : forma === '-ed' ? w1(o) === o2EnPP(v.id) : o.en.split(' ')[1] === v.id;
    const ok = base.filter(o => !red(o));
    return (ok.length >= 2 ? ok : base).map(o => Object.assign({ src:'≈' }, o)); }   /* v137: por classe */
  if(k === 'ap'){                         /* v107 */
    const d = o2ApCand(v.id), cn = O2_TIPOS.find(t => t.k === 'ap').conjs[cj].en, e = d.c.includes(cn) ? cn : d.c[0];
    return (e === ': to' ? d.to : d.th).map(n => ({ en:n, pt:O2_AP_PT[n], src:'≈' }));
  }
  if(k === 'cn'){ const d = O2_CN[v.id] || []; return d.map(n => ({ en:n, pt:O2_CN_PT[n], src:'≈' })); }
  if(k === 'oi'){                       /* v104: -ing → verbos de resultado (S) · how/whether → adjetivos (A) */
    const d = O2_OBJI[v.id], cn = O2_TIPOS.find(t => t.k === 'oi').conjs[cj].en, e = d && d.c.includes(cn) ? cn : (d ? d.c[0] : cn);
    return e === '-ing' ? o2TemaDe(v, 'S').filter(o => o.v !== v.id).map(o => ({ v:o.v, en:o.en, pt:o.pt, neg:false, src:'≈' })) : o2TemaDe(v, 'A').map(o => ({ en:o.en, pt:o.pt, src:'≈' }));
  }
  if(k === 'subj') return (cj === 0
    ? [{ en:'true', pt:'verdade' }, { en:'clear', pt:'claro' }, { en:'obvious', pt:'óbvio' }]
    : [{ en:'important', pt:'importante' }, { en:'difficult', pt:'difícil' }, { en:'easy', pt:'fácil' }]).map(o => Object.assign({ src:'≈' }, o));
  if(k === 'pred') return [{ en:'truth', pt:'a verdade' }, { en:'problem', pt:'o problema' }, { en:'point', pt:'o ponto' }].map(o => Object.assign({ src:'≈' }, o));
  if(k === 'cmp') return o2TemaTab(O2_CMP, v).map(a => ({ en:a.en, pt:a.pt, g:a.g, src:'≈' }));
  if(k === 'conf') return o2ConfOpcoes(v).map(o => Object.assign({ src:'≈' }, o));
  if(k === 'prop') return o2TemaTab(O2_PROP, v).filter(o => o.v !== v.id).map(o => ({ v:o.v, q:o.q, ptq:o.ptq, en:'', pt:'', neg:false, src:'≈' }));
  const tp = (k === 'caus' || k === 'expl') ? 'C' : k === 'temp' ? 'T' : k === 'cond' ? 'C' : 'S';
  return o2TemaDe(v, tp).filter(o => o.v !== v.id).map(o => ({ v:o.v, en:o.en, pt:o.pt, neg:false, src:'≈' }));
}
const nomeV = x => x.base + (x.prt ? ' ' + x.prt : '');
/* texto curto da opção (para os chips) */
function o2Rotulo(k, op){
  if(k === 'final') return o2Sub(op.en, state.pronome);
  if(k === 'rger' || k === 'rinf') return o2Sub(op.en, state.pronome);
  if(k === 'rpart' || k === 'rrel' || k === 'conc' || k === 'obj' || k === 'cmp' || k === 'subj' || k === 'pred' || (k === 'oi' && !op.v) || k === 'cn' || k === 'ap') return op.en;
  if(k === 'conf') return (state.o2.tipo === 'conf' && state.o2.conj >= 2) ? op.en : op.cl;   /* v101: o chip mostra o que a conjunção escolhida realmente usa */
  if(op.wh) return 'whose ' + op.wh.n + ' + ' + op.wh.adj;
  const x = verbById(op.v);
  return (op.neg ? "don't " : '') + nomeV(x) + (op.en ? ' ' + o2Sub(op.en, state.pronome) : '');
}
/* quando a 2ª oração pode existir: { off, soFinal, msg } */
function o2Bloqueio(){
  if(state.categoria !== 'fact') return { off:true, msg:'A 2ª oração parte de um verbo de ação: volte a categoria para <b>Ação / Fato</b> (②).' };
  if(state.formato === 'pergunta' && state.whWord) return { off:true, msg:'Com palavra interrogativa (⑧) a 2ª oração fica desligada — escolha outro formato ou tire a interrogativa.' };
  if(state.formato === 'pergunta' || state.formato === 'pergunta_negativa') return { off:false, soFinal:true, msg:'Em perguntas só a <b>finalidade</b> ("Do you work in order to…?") e a <b>pergunta indireta</b> ("Do you know where she lives?") se encaixam.' };
  return { off:false };
}
/* monta a 2ª oração: devolve null (desligada/indisponível) ou { en, ptJuntar(pt1), estrutura, nota, tipo } */
/* v90.1: "mesmo objeto" — reaproveita a colocação-objeto da 1ª oração na 2ª (She creates a plan, but she destroys the plan).
   Só vale para colocações que SÃO objeto (não preposicionadas nem advérbios) e verbos 2 transitivos (têm alguma colocação-objeto).
   Repetimos o substantivo com artigo definido em vez de usar "it/them": evita errar animacidade/número e o clítico do PT. */
const O2_PREP = /^(on|from|as|in|at|to|with|for|about|of|by|into|over|up|down|out|off|through|across|around|after|before|under|between|against|toward|towards|during|without|within|upon|onto)\b/i;
const O2_ADVS = new Set(['online','together','alone','hard','early','late','well','fast','quickly','slowly','carefully','abroad','outside','inside','daily','again','away','back','home','here','there','now','today','tomorrow','yesterday','loudly','quietly','clearly','honestly','politely','openly','badly','easily','regularly','overnight','upstairs','downstairs','everywhere','forward',
  /* v136: advérbios de tempo/lugar/frequência e adjetivos predicativos ("feel happy", "text me later") que NÃO são objeto direto */
  'ahead','later','soon','often','twice','forever','tonight','nearby','first','left','south','more','little','so','better','stronger','live','open',
  'happy','tired','calm','sure','silent','famous','young','rich','black','deep','high']);
function o2ObjDef(c){
  if(!c || !c.en) return null;
  const en = c.en.trim();
  if(O2_PREP.test(en) || O2_ADVS.has(en.toLowerCase()) || /^[a-z]+ly$/i.test(en) || /^to\s/i.test(en) || /^(too|twice|once|every other)\b/i.test(en)) return null;   /* v136: + too…, twice a week */
  if(/^(that|if|whether|how|what|why|where|when|who)\b/i.test(en)) return null;
  if(/^(every|each|this|last|next|all|one|two|three|ten|twenty|a few|several)?\s*(morning|evening|night|afternoon|day|week|weekend|month|year|hour|minute|moment|time|summer|winter)s?\b/i.test(en) && /^(every|each|this|last|next|all)\s/i.test(en)) return null;   /* locução de tempo, não objeto */
  return { en: en.replace(/^(a|an)\s+/i, 'the '),
           pt: (c.pt || '').trim().replace(/^um\s+/i, 'o ').replace(/^uma\s+/i, 'a ').replace(/^uns\s+/i, 'os ').replace(/^umas\s+/i, 'as ') };
}
/* núcleo do sintagma (último substantivo, singularizado) — compara objetos entre verbos */
function o2Head(en){
  const w = (en || '').toLowerCase().replace(/[^a-z\s-]/g, '').trim().split(/\s+/).pop() || '';
  return w.replace(/ies$/, 'y').replace(/([^s])s$/, '$1');
}
/* PT: tira a preposição de regência do verbo 1 (de/em/com… ou contração do/na/ao…) e põe a do verbo 2 */
const O2_CONTR = { do:['de','o'], da:['de','a'], dos:['de','os'], das:['de','as'], no:['em','o'], na:['em','a'], nos:['em','os'], nas:['em','as'],
                   ao:['a','o'], 'à':['a','a'], aos:['a','os'], 'às':['a','as'], pelo:['por','o'], pela:['por','a'], pelos:['por','os'], pelas:['por','as'] };
const O2_PREP_PT = { de:{o:'do',a:'da',os:'dos',as:'das'}, em:{o:'no',a:'na',os:'nos',as:'nas'}, a:{o:'ao',a:'à',os:'aos',as:'às'}, por:{o:'pelo',a:'pela',os:'pelos',as:'pelas'} };
function o2PtSplit(pt){
  const m = (pt || '').trim().match(/^(\S+)\s+(.*)$/);
  if(m && O2_CONTR[m[1].toLowerCase()]){ const [p, art] = O2_CONTR[m[1].toLowerCase()]; return { prep:p, np: art + ' ' + m[2] }; }
  if(m && /^(de|em|com|para|por)$/i.test(m[1])) return { prep:m[1].toLowerCase(), np: m[2] };
  return { prep:null, np: (pt || '').trim() };
}
function o2PtAdapt(ptNp, v2){
  const base = o2PtSplit(ptNp).np;
  const c2 = (v2.col || []).find(c => o2ObjDef(c));
  const p2 = c2 ? o2PtSplit(c2.pt).prep : null;
  if(!p2) return base;
  const m = base.match(/^(o|a|os|as)\s+(.*)$/i), tb = O2_PREP_PT[p2];
  return (m && tb) ? tb[m[1].toLowerCase()] + ' ' + m[2] : p2 + ' ' + base;
}
/* v122: índice da 1ª colocação de OBJETO direto do verbo (null se intransitivo) — o padrão do passo ④ */
function colAutoIdx(v){
  const i = ((v && v.col) || []).findIndex(c => o2ObjDef(c));
  return i >= 0 ? i : null;
}
const o2Transitivo = v => !!(v && (v.col || []).some(c => o2ObjDef(c)));
/* v92: afinidade verbo-objeto CURADA à mão (antônimos e sinônimos): "verbo1>verbo2:núcleos dos objetos".
   Um par aqui significa que, com esse objeto, as duas orações fazem sentido juntas (✓). */
const O2_AFF_TXT = `write>read:letter,report
see>ignore:result
take>give:key
take>leave:key
run>stop:marathon
buy>sell:gift,grocery
get>give:discount
get>lose:discount,job
make>destroy:cake
make>break:plan
know>ignore:answer,truth
know>doubt:answer,truth
give>take:advice,present
give>receive:advice,present
become>stay:famou,rich,stronger
become>remain:famou,rich,stronger
feel>ignore:pain,pressure
bring>remove:document
begin>end:project
begin>finish:project
keep>lose:focu,promise,routine
hold>release:door,hand
hold>drop:phone
meet>miss:friend
win>lose:election,prize
teach>learn:english
sell>buy:everything,house
send>receive:email,report
choose>reject:option
wear>remove:comfortable,suit
forget>remember:appointment,key
catch>release:thief
catch>drop:ball,rope
imagine>remember:scene
imagine>recall:scene
need>have:break,help
quit>continue:course,game,job
visit>avoid:client,family,museum
give-up>continue:idea,smoking
look-for>find:apartment,job
turn-on>turn-off:radio
take-off>put-on:mask,shoe
carry>drop:bag
check>ignore:email,result
count>ignore:money,vote
drop>catch:glass,key
face>flee:problem
face>avoid:consequence,truth
fill>drain:glass
have>lose:idea,time
like>hate:idea,music,place
pass>stop:ball
pay>owe:bill,rent
pick>reject:one
pull>push:door,rope
push>pull:car
read>write:book
show>hide:photo,result
show>conceal:result
stop>start:car,noise
throw>keep:ball
throw>catch:dice
learn>teach:language,skill
learn>forget:language,skill
remember>forget:detail,name
believe>doubt:story
notice>ignore:change,difference,smell
guess>know:price
presume>doubt:innocence,worst
doubt>believe:evidence,fact,result
recognize>ignore:face,value
consider>ignore:change,detail,option
memorize>forget:formula,list,word
analyze>ignore:data,option
solve>create:problem,puzzle
expect>doubt:reply,worst
blame>forgive:team
praise>criticize:team,work
criticize>praise:decision,plan
approve>reject:budget,plan
reject>approve:idea,offer
reject>accept:idea,proposal
accuse>defend:colleague,company,neighbor
accuse>acquit:colleague,company,neighbor
evaluate>ignore:option,result,risk
recommend>discourage:place
defend>attack:position,team
defend>abandon:position,team
forgive>blame:friend,mistake
forgive>punish:friend
suspect>believe:worst
prefer>reject:one,tea
ask>answer:teacher
discuss>ignore:plan
announce>conceal:decision,result,winner
suggest>reject:approach,solution
report>conceal:bug,problem,result
describe>hide:detail,problem
greet>ignore:everyone,guest
interrupt>continue:meeting
share>keep:idea,meal
love>hate:children,life,music
hate>love:morning,noise,waiting
hate>like:morning,noise,waiting
enjoy>hate:trip
fear>face:dark,failure,worst
miss>catch:bu,chance,train
welcome>reject:guest,member
inspire>discourage:other,people
surprise>bore:guest,neighbor
enter>leave:building
reach>miss:goal,station
explore>ignore:city,forest,place
score>miss:goal
lift>drop:boxe,trophy,weight
shoot>miss:throw
hit>miss:ball,target
add>subtract:number,total
subtract>add:cost,discount,ten
multiply>divide:value
calculate>guess:average,cost,risk
measure>guess:angle,length
estimate>measure:cost,time
convert>keep:file
spend>save:fortune,money
spend>earn:fortune
order>cancel:coffee,pizza
charge>refund:fee
charge>pay:fee,interest
owe>pay:dollar,favor,money
earn>lose:living,money,salary
earn>spend:salary
refund>charge:customer,money
deliver>collect:package
rent>buy:apartment,car,room
rent>own:apartment,room
donate>take:blood,clothe,money
donate>receive:blood,clothe,money
withdraw>deposit:cash
deposit>withdraw:dollar
waste>save:food,money,time
hire>fire:developer,staff
fire>hire:employee,manager
fire>employ:employee,manager
lead>follow:team
schedule>cancel:appointment,call
plan>improvise:trip
apply>ignore:rule
attend>skip:conference,meeting
attend>miss:class,conference,meeting
delegate>keep:task
launch>cancel:campaign,product
launch>withdraw:product
complete>start:course,project,task
complete>abandon:course,task
finish>start:first,report
finish>begin:first,report
start>stop:business
start>finish:business
achieve>miss:goal
operate>stop:business,machine
operate>break:business,machine
cancel>confirm:meeting,order,trip
cancel>keep:meeting,order,trip
submit>withdraw:application,proposal
review>ignore:contract,number
prepare>improvise:dinner,meeting,presentation
type>delete:password
download>upload:report
upload>download:photo,video
install>remove:app,software,update
delete>keep:file,history,message
delete>save:history,message
scan>ignore:code,document
test>assume:theory
copy>create:file
copy>delete:link,text
paste>cut:link,text
stream>download:movie,music
sort>mix:file,list
process>ignore:data,order,payment
open>close:file
post>delete:comment,photo
post>remove:comment,photo
monitor>ignore:price,progress,system
press>release:button,key
cook>burn:dinner,rice
boil>freeze:egg,potatoe
fry>boil:fish
peel>cover:apple,potatoe
chew>swallow:food,gum
melt>freeze:butter,cheese,chocolate
fix>break:bike,roof,sink
fix>damage:bike,sink
repair>break:car,phone
repair>damage:phone
lock>open:car,gate
lock>unlock:gate
hang>drop:coat,picture
build>destroy:house,website
create>copy:account,plan
create>destroy:account,world
stick>peel:label
dig>fill:hole
tear>mend:fabric
tear>sew:fabric
use>waste:app,tool
study>ignore:english
pronounce>mumble:word
quote>paraphrase:poem
research>assume:cause
examine>ignore:evidence,patient
summarize>expand:report,text
highlight>hide:point,risk
hurt>heal:animal
hurt>help:animal
touch>avoid:screen,surface,wall
hear>ignore:new,noise
watch>ignore:game,movie,tv
recover>lose:data,file,money
harvest>plant:corn
recycle>waste:glass,paper,plastic
pollute>clean:air,ocean,river
freeze>thaw:food
entertain>bore:children,crowd,guest
forbid>allow:entry,phone,smoking
allow>forbid:access,use
allow>ban:access,use
arrest>release:driver,thief
ban>allow:app,product,smoking
sign>cancel:check,contract,document
declare>conceal:income,winner
change>keep:date,plan
increase>decrease:price
increase>reduce:price
decrease>increase:cost
continue>stop:work,working
continue>quit:work,working
end>begin:call,contract,meeting
end>start:call,contract,meeting
reduce>increase:cost,risk,waste
reduce>raise:cost,risk
replace>keep:one,part,worker
replace>retain:one,part,worker
adjust>fix:setting
adjust>keep:plan,setting
offer>refuse:discount,job
accept>refuse:offer,responsibility
accept>reject:responsibility,result
refuse>accept:deal,help
receive>give:feedback,gift
receive>send:feedback,gift
own>rent:house
gain>lose:advantage,skill
exchange>keep:gift,idea,money
steal>give:car,wallet
hide>show:key,secret,truth
seek>avoid:help,truth
ignore>notice:call,problem,warning
recall>forget:detail,memory,name
conclude>begin:deal,meeting,study
conclude>start:deal,meeting,study
ponder>ignore:option,question
deduce>guess:cause,rule
determine>doubt:cause,outcome
confirm>deny:new
confirm>cancel:booking
deny>admit:accusation,rumor
deny>confirm:everything,rumor
admit>deny:defeat,mistake,truth
condemn>praise:attack,decision,violence
applaud>criticize:performance,team
appreciate>ignore:effort,help
underestimate>overestimate:opponent,problem,risk
overestimate>underestimate:benefit,cost,result
mock>praise:accent,colleague,idea
mock>respect:colleague,idea
insult>praise:colleague,guest,referee
offend>please:colleague,guest
claim>deny:credit
confess>deny:crime,truth
confess>conceal:crime,everything
encourage>discourage:creativity
discourage>encourage:smoking
congratulate>criticize:friend,team,winner
demand>offer:refund,respect
address>ignore:audience,issue
address>avoid:issue
envy>admire:freedom,friend,success
embrace>reject:change,friend
annoy>please:neighbor,teacher
bore>amuse:audience,student
amuse>bore:children,guest
delight>disappoint:audience,children,everyone
delight>bore:children
impress>bore:boss,client
impress>disappoint:boss,client,everyone
disappoint>please:fan,friend,team
frighten>calm:dog,everyone
shock>comfort:audience,everyone
shock>calm:audience,everyone,market
upset>please:child,friend
calm>upset:crowd
please>annoy:audience,customer
roll>stop:ball,dice
approach>leave:building,door
avoid>face:conflict
avoid>seek:conflict
spin>stop:globe,wheel
compute>guess:average,result,sum
integrate>divide:team
triple>reduce:profit,sale,size
import>export:oil
export>import:software
auction>buy:house,painting
tax>refund:income
bill>refund:client,service
employ>fire:local,staff,worker
consult>ignore:expert,lawyer,manual
assign>withdraw:task
assign>keep:project,role,task
file>withdraw:complaint,report
appoint>remove:committee,director,manager
accomplish>fail:goal,task
depreciate>appreciate:asset,equipment
set-up>cancel:business
pick-up>drop:friend,kid,package
give-back>keep:book,key,money
give-back>take:book,money
turn-off>turn-on:tv
look-up>ignore:address,number,word
throw-away>keep:clothe,packaging
throw-away>save:clothe,packaging
call-off>confirm:meeting,search,strike
let-down>support:fan,friend
pay-back>owe:debt,friend,loan
pay-back>borrow:loan
point-out>hide:difference,mistake,problem
take-over>give-up:company,lead,project
cut-down>increase:cost
drop-off>pick-up:car
keep-up>stop:payment,work
put-on>remove:glasse,jacket
put-on>take-off:glasse
run-into>avoid:friend,stranger
cheer-up>upset:children,team
mix-up>sort:date,name,order
speed-up>slow-down:delivery,work
slow-down>speed-up:car,pace
shut-down>open:factory,server,system
warm-up>cool-down:food,muscle
cool-down>warm-up:water
carry-out>abandon:experiment,order
bring-up>drop:concern,issue,topic
bring-up>ignore:concern,issue,topic
look-into>ignore:case,complaint
tear-down>build:building,wall
hack>defend:account,server,system
deploy>withdraw:app,update
log>delete:error,event
restore>damage:data,system
restore>delete:data
reboot>shut-down:phone
store>use:data,file,password
forward>keep:email,file,message
classify>mix:data,email,image
remove>add:cover,file
remove>insert:file
insert>remove:card,coin,page
attach>remove:document,photo
track>lose:data,package,progress
detect>miss:error,leak,signal
roast>boil:chicken,vegetable
steam>freeze:fish,vegetable
toast>burn:bread,nut,seed
sprinkle>pour:salt,sugar
stuff>empty:pepper
devour>nibble:food,meal
nibble>devour:bread,cookie,snack
thaw>freeze:chicken,fish,meat
drain>fill:water
empty>fill:bin,room
switch>keep:channel,seat,side
unlock>lock:phone
invent>copy:machine,story,tool
manufacture>buy:car,good,part
mend>break:fence,net
mend>damage:fence,net,shirt
revise>keep:note,text
cite>ignore:law,source
paraphrase>quote:text
rehearse>improvise:scene,song
fail>pass:course,exam
investigate>ignore:case,cause,crime
observe>ignore:behavior,sky
pinch>release:arm,cheek
prescribe>forbid:antibiotic,medicine,treatment
flood>drain:city,street
direct>follow:traffic
improvise>plan:solo,speech
improvise>rehearse:solo
exhibit>hide:painting,work
exhibit>conceal:painting,work
sentence>acquit:criminal
convict>acquit:criminal
acquit>condemn:accused,defendant,suspect
acquit>convict:accused
prosecute>defend:company,suspect
enforce>ignore:ban,law,rule
authorize>forbid:payment,transfer,use
license>ban:driver,software
prohibit>allow:entry,smoking
violate>respect:contract,law
violate>obey:contract
oblige>release:citizen,company,party
ratify>reject:agreement,law,treaty
repeal>pass:ban,law,rule
repeal>enact:ban
enact>repeal:reform
inherit>leave:business,fortune,house
release>hold:hostage,prisoner,suspect
confiscate>give-back:car,good,weapon
threaten>protect:colleague,company,peace
attack>defend:enemy,problem
destroy>build:city,plan
destroy>create:city
damage>improve:car,roof
damage>repair:roof
rescue>abandon:child,dog,hostage
strengthen>weaken:bond
weaken>strengthen:signal
boost>reduce:economy,morale,sale
accelerate>slow-down:growth
renew>cancel:contract,lease,license
renew>end:lease,license
cause>stop:damage,delay,problem
swap>keep:gift,place
transfer>keep:file,money
hand>take:paper,report
distribute>collect:flyer,food
substitute>keep:ingredient,player,worker
mail>receive:invoice,letter,package
ship>receive:good,order,package
conceal>show:evidence,fact,truth
state>hide:fact,name,reason
indicate>conceal:direction,error,preference
ask-for>offer:advice,refund
ask-for>refuse:advice,refund
terminate>start:agreement,contract,service
attempt>abandon:approach,climb,repair
utilize>waste:method,resource,software
dispatch>receive:order,package
obtain>lose:information,permit,visa
retain>lose:document,receipt,staff
retain>release:staff
purchase>sell:equipment,laptop,license
reimburse>charge:cost,customer,expense
select>reject:candidate,date,option
turn-down>accept:invitation,job
commence>end:course,trial
commence>conclude:course,trial
modify>keep:design,plan,setting
abandon>keep:idea,plan,project
abandon>support:plan,project
cease>continue:operation,payment,production
cease>start:operation,payment,production
construct>destroy:bridge,model
instruct>obey:staff,student,team
encounter>avoid:difficulty,resistance
look-at>ignore:data,map,report
buy>purchase:gift,grocery
get>obtain:discount,job,result
get>receive:discount,job,result
make>produce:cake,plan
know>understand:answer,truth
give>offer:advice,present
give>provide:advice
find>discover:key,solution
begin>start:project
begin>commence:project
keep>retain:focu,routine
send>dispatch:email,message,report
choose>pick:option
choose>select:career
need>require:break,help,time
quit>stop:course,game
quit>leave:course,job
give-up>quit:smoking
look-for>seek:job
take-off>remove:jacket,mask,shoe
check>verify:email,result
check>test:result
clean>tidy:house,kitchen
count>calculate:money,vote
decide>choose:date
decide>determine:date
do>perform:work
do>complete:work
draw>sketch:map,picture
like>enjoy:idea,music,place
like>love:idea,place
pick>choose:color,one,team
pick>select:color,one,team
pull>draw:rope
read>study:book
read>scan:new
save>keep:file
wash>clean:car,dishe,hand
wash>rinse:hand
learn>study:language
remember>recall:password
believe>accept:story
realize>understand:mistake,risk,truth
realize>notice:mistake,risk,truth
notice>observe:change,difference
notice>detect:change,difference,smell
guess>assume:answer,price
guess>estimate:price
presume>assume:innocence,worst
recognize>identify:face,value
consider>ponder:change,detail
consider>weigh:change,detail
memorize>retain:formula,list,word
analyze>examine:data,option,problem
analyze>study:data,option,problem
analyze>evaluate:data,problem
solve>fix:problem
predict>forecast:future,outcome,weather
compare>weigh:price,result
blame>accuse:team
praise>applaud:effort,work
criticize>condemn:plan
criticize>attack:decision,plan
approve>endorse:budget,proposal
approve>authorize:budget,plan,proposal
approve>accept:budget,plan,proposal
reject>refuse:idea,offer,proposal
accuse>charge:colleague,company,neighbor
accuse>blame:colleague,company,neighbor
admire>respect:courage,work
admire>praise:courage
respect>admire:elder,opinion,rule
deserve>earn:raise,respect
evaluate>judge:option,result,risk
evaluate>rate:result
recommend>suggest:book,place,product
recommend>endorse:book,place
defend>protect:other,position,team
prefer>choose:one,tea
explain>describe:process,rule
explain>clarify:process
discuss>debate:plan,problem
announce>declare:decision,result
suggest>recommend:approach,idea,solution
report>announce:bug,problem
describe>explain:detail,problem,scene
express>state:doubt,gratitude,opinion
thank>appreciate:everyone,staff,team
share>divide:cost,meal
love>cherish:children,life
love>adore:life
enjoy>like:moment,trip
hug>hold:child,friend
hug>embrace:child
welcome>receive:everyone,guest,member
welcome>accept:member
welcome>greet:member
inspire>encourage:other,people
surprise>shock:guest,neighbor
board>enter:plane,train
chase>hunt:thief
chase>follow:dream,thief
explore>investigate:city,forest,place
explore>discover:city,forest,place
guide>lead:tourist
guide>direct:team,tourist
lift>raise:boxe,trophy,weight
hit>punch:ball
add>total:number,total
multiply>increase:value
divide>share:bill
calculate>estimate:average,risk
calculate>compute:cost,risk
estimate>guess:cost,time
estimate>approximate:time
estimate>calculate:time
weigh>measure:box,kilo
demonstrate>show:point,theorem,theory
demonstrate>prove:theorem
demonstrate>illustrate:theorem,theory
rank>order:result,team
rank>rate:result,team
convert>change:currency,file,unit
convert>transform:file
spend>use:money
order>request:coffee,pizza
charge>bill:fee
earn>make:living,money,salary
earn>gain:money,salary
earn>deserve:money,salary
refund>reimburse:money
rent>hire:car
rent>let:apartment,room
donate>give:blood,clothe,money
withdraw>remove:cash,money
deposit>put:check,dollar,money
waste>lose:food,money,time
manage>run:budget,project,team
manage>handle:budget,project,team
hire>employ:developer
hire>recruit:developer,staff
lead>direct:meeting,team
schedule>plan:appointment,call,meeting
plan>design:trip
organize>coordinate:schedule
apply>use:method,pressure,rule
apply>employ:method
promote>boost:brand,product
present>give:proposal,result
present>show:proposal
produce>make:good,report,result
produce>create:good,report,result
launch>start:campaign,product,startup
launch>release:product
supervise>manage:staff
supervise>monitor:project,staff
complete>finish:course,project,task
complete>conclude:course,project,task
complete>accomplish:course,project
finish>end:report
finish>complete:report
start>begin:business
start>launch:business
improve>boost:process,quality
develop>build:product,skill,strategy
develop>grow:skill
achieve>accomplish:result,success
achieve>reach:result,success
operate>run:business,machine
cancel>call-off:order,trip
submit>hand-in:application,proposal
submit>send:application,proposal
review>check:contract,number
review>revise:contract,number
prepare>plan:dinner,meeting,presentation
recruit>hire:member
type>write:message,password
download>save:report
upload>submit:file,photo,video
upload>post:video
install>set-up:app,software
install>deploy:software
delete>wipe:file,history
delete>remove:history,message
print>publish:document
print>copy:document
scan>examine:code,document
scan>check:code,document
test>check:code,system,theory
test>examine:code,system,theory
update>refresh:software,statu
update>renew:software
connect>join:device
connect>attach:device
browse>surf:web
browse>scan:catalog
record>log:meeting
paste>stick:link,text
paste>insert:link,screenshot,text
stream>play:movie,music
sort>order:file,list
sort>classify:file,list
debug>fix:code,error,program
debug>clean:code
automate>streamline:report,task
process>handle:data,order,payment
open>unlock:account
post>publish:comment,photo
post>share:comment,photo
monitor>watch:price,progress,system
monitor>track:price,system
monitor>observe:price,progress,system
press>push:key
cook>fry:rice
cook>make:dinner,rice
cook>prepare:rice
boil>simmer:potatoe
chop>cut:herb,onion
slice>cut:bread,tomato
mix>stir:color,ingredient
stir>mix:sauce,soup
taste>try:soup,wine
chew>bite:food
bite>nibble:apple,cake,sandwich
melt>thaw:butter
melt>soften:cheese,chocolate
squeeze>press:lemon,orange
brush>sweep:carpet
brush>clean:carpet,dog
bathe>wash:baby,dog
fix>repair:bike,roof,sink
fix>mend:bike,roof
repair>fix:car,damage,phone
repair>restore:car,phone
sweep>brush:floor
sweep>clean:floor,porch
tidy>clean:desk,garage,room
water>spray:garden
pack>load:boxe
pack>stuff:boxe
wipe>clean:floor,glass,table
wipe>dry:floor,glass,table
build>construct:house
create>produce:plan
create>make:account,world
design>plan:building,system
design>draft:logo
assemble>build:table
sew>mend:button,dress
stick>attach:label,note,poster
stick>glue:note,poster
use>employ:tool
use>apply:sense
use>utilize:app,tool
try>attempt:way
try>test:way
help>assist:friend,other
help>support:friend,other
study>learn:english
study>review:english
practice>drill:english
translate>interpret:contract,text
translate>render:contract,text
translate>convert:text
pronounce>say:word
quote>cite:author,poem
research>investigate:market,topic
research>study:cause,market,topic
research>explore:cause,market,topic
examine>study:evidence,patient
examine>check:evidence,patient
edit>polish:text
edit>revise:video
draft>sketch:email,letter
correct>fix:accent,mistake,test
publish>release:article,book,paper
publish>print:article,book,paper
heal>cure:friend,wound
heal>mend:wound
touch>feel:screen,surface,wall
hear>catch:noise
hear>learn:new
watch>observe:game
treat>handle:equally,infection,patient
diagnose>identify:disease
diagnose>detect:disease,problem
diagnose>determine:problem
harvest>gather:corn,fruit
harvest>pick:corn,fruit
protect>defend:children,environment,nature
perform>do:test
film>shoot:documentary,scene
film>record:documentary,scene
photograph>shoot:animal,landscape,wedding
entertain>delight:crowd,guest
entertain>amuse:crowd
invite>ask:friend
invite>welcome:friend,team
collect>gather:coin,memory,stamp
gather>collect:information
gather>assemble:family,friend
obey>follow:law,order
forbid>ban:entry,phone
forbid>prohibit:phone
allow>authorize:access
require>need:password,patience,proof
require>demand:password,patience,proof
sue>prosecute:city
elect>choose:leader,mayor,president
elect>appoint:leader,mayor,president
ban>forbid:app,product
ban>prohibit:app,product
sign>endorse:check,contract,document
govern>run:country,state
declare>announce:war
declare>state:income,winner
change>modify:date
increase>boost:price
decrease>drop:cost
end>finish:call,meeting
end>stop:call,contract,meeting
end>conclude:call,contract
reduce>cut:risk,waste
reduce>decrease:risk,waste
replace>substitute:one,part
replace>swap:one,part,worker
adjust>adapt:setting
adjust>set:setting
expand>grow:business
offer>provide:discount,help
accept>take:offer,responsibility
refuse>reject:deal,help
receive>get:feedback,gift,message
receive>obtain:feedback
own>have:business,car,house
gain>obtain:advantage,experience,skill
gain>earn:experience
provide>give:information,service,support
provide>offer:information,service,support
exchange>swap:money
steal>take:car,wallet
hide>cover:secret,truth
hide>conceal:key,secret
seek>look-for:help,solution,truth
interpret>explain:data,dream,result
discover>find:cure,planet,truth
reconsider>review:decision,offer,plan
recall>remember:memory
conclude>finish:deal,meeting,study
conclude>end:deal,study
infer>deduce:conclusion,meaning
ponder>consider:question
ponder>weigh:question
deduce>conclude:cause
deduce>infer:answer,rule
identify>recognize:cause,suspect
determine>decide:price
determine>establish:cause,outcome,price
verify>confirm:data,fact,identity
verify>check:data,fact,identity
confirm>verify:booking,date,new
deny>reject:accusation,rumor
admit>confess:defeat,mistake
define>explain:goal,problem,term
prove>show:case,point,theory
prove>confirm:case,point,theory
prove>demonstrate:case
condemn>criticize:attack,violence
applaud>praise:performance
rate>rank:movie,product,service
rate>score:movie
mock>tease:accent,colleague
insult>offend:referee
offend>hurt:colleague,customer,guest
offend>upset:colleague,customer,guest
offend>insult:customer
endorse>approve:candidate,product
claim>demand:credit,prize,reward
confess>admit:crime,everything
advise>recommend:caution
convince>persuade:board,client,everyone
persuade>convince:committee,customer,friend
encourage>support:creativity,student
congratulate>praise:friend,winner
murmur>whisper:prayer
mumble>murmur:apology,something
tease>mock:friend
narrate>tell:event
inform>notify:client,everyone
inform>tell:client,everyone,team
notify>inform:customer
notify>advise:customer
request>seek:refund
request>demand:help
demand>require:answer,refund,respect
demand>claim:refund,respect
address>handle:issue,problem
clarify>explain:doubt,point
clarify>simplify:rule
emphasize>underline:importance,point,risk
emphasize>highlight:importance
adore>cherish:children,music,view
adore>love:view
embrace>welcome:change,friend,idea
amuse>delight:guest
amuse>entertain:everyone
delight>please:children
upset>hurt:child,everyone
please>delight:customer
roll>spin:ball,dice
steer>guide:boat,car
spin>turn:globe,wheel
flee>escape:country
punch>hit:bag
coach>instruct:player
skip>miss:class,meal
compute>calculate:result,sum
compute>work-out:average,result,sum
integrate>merge:data
approximate>estimate:result,value
tally>total:score,vote
tally>count:point,score
simplify>clarify:process
double>multiply:amount,price,speed
borrow>take:book,car,money
auction>sell:painting
sponsor>support:event,student
discount>reduce:fee,price
insure>cover:car,good,house
insure>protect:car,good,house
bill>charge:client
employ>hire:local,worker
coordinate>organize:project
coordinate>manage:event
consult>ask:expert,lawyer
assist>help:client,doctor
assist>support:client,doctor
file>store:document,report
file>submit:complaint,document
appoint>assign:director,manager
accomplish>complete:goal
audit>review:account,company,process
audit>examine:account,company,process
forecast>predict:demand,revenue,sale
allocate>assign:budget,fund,time
allocate>distribute:budget,fund
streamline>simplify:operation,workflow
streamline>optimize:operation,workflow
leverage>use:brand,data,experience
prioritize>rank:task
prioritize>order:task
onboard>integrate:client,hire
onboard>welcome:client,hire,team
handle>manage:equipment,package,situation
handle>operate:equipment
set-up>establish:business
pick-up>collect:friend,kid,package
pick-up>lift:kid,package
give-back>restore:book,money
make-up>invent:excuse,name
look-up>search:address,number,word
look-up>consult:word
throw-away>waste:clothe,packaging
call-off>cancel:search,strike
figure-out>work-out:answer,problem,solution
hand-in>submit:form,homework
hand-in>deliver:form,homework,report
let-down>fail:fan,friend,team
pay-back>reimburse:debt,friend,loan
point-out>indicate:difference,mistake,problem
point-out>highlight:difference,mistake,problem
point-out>show:difference,mistake,problem
take-over>assume:lead,project
drop-off>deliver:car,kid
drop-off>leave:car,kid,package
get-over>overcome:cold,loss,shock
keep-up>continue:pace,payment
put-on>wear:glasse,jacket
run-into>encounter:friend,stranger
run-into>meet:stranger
clean-up>tidy:garden,mess
clean-up>wash:room
cheer-up>comfort:children,team
speed-up>accelerate:delivery,work
shut-down>close:factory,server,system
shut-down>stop:factory,server,system
carry-out>perform:experiment,plan
bring-up>raise:concern,issue,topic
bring-up>mention:concern,issue,topic
come-across>find:book,photo,problem
look-into>examine:case,complaint,problem
look-into>research:case,complaint,problem
look-into>investigate:complaint,problem
compile>build:code,program,project
deploy>launch:app,update
log>record:action,error,event
tap>touch:button,icon
restore>repair:file,system
restore>recover:system
refresh>renew:data
refresh>update:page,screen
store>keep:data,file,password
store>save:data,password
render>make:image,video
authenticate>verify:login,request,user
authenticate>confirm:login,request,user
configure>set-up:router,setting,system
configure>adjust:router,system
optimize>improve:code,performance
customize>adapt:app,layout,report
visualize>imagine:data,result,scenario
classify>sort:data,email,image
enable>allow:feature,option
remove>delete:stain
insert>add:card,coin,page
attach>connect:document,file,photo
track>follow:data,package,progress
track>monitor:data,package
detect>notice:error,leak,signal
roast>bake:chicken,vegetable
roast>grill:chicken
steam>cook:fish,vegetable
whisk>beat:cream,egg
whisk>mix:cream,egg,sauce
knead>press:bread,dough
marinate>season:chicken
dice>cut:meat,onion,potatoe
dice>chop:meat,potatoe
sprinkle>dust:sugar
stuff>fill:pepper,turkey
brew>make:beer,coffee,tea
nibble>bite:bread,cookie
drain>empty:water
garnish>decorate:dessert,dish,salad
iron>press:clothe,dress,shirt
dust>wipe:desk,furniture,shelve
dust>clean:desk,furniture,shelve
vacuum>clean:car,carpet,floor
mop>clean:floor,tile
mop>wipe:tile
scrub>rub:floor,pan,stain
scrub>clean:floor,pan,stain
rinse>clean:dishe,glass,vegetable
rinse>wash:glass,vegetable
dry>wipe:dishe
empty>drain:glass
switch>change:channel,seat,side
switch>swap:channel,seat,side
unlock>open:car,phone
invent>create:machine,story,tool
craft>make:table,tool
craft>build:table,tool
craft>create:table,tool
carve>cut:pumpkin,wood
carve>sculpt:wood
knit>weave:scarf
glue>stick:paper,piece
glue>paste:label,paper,piece
drill>bore:hole,wall,wood
saw>cut:board,branch,wood
polish>shine:floor,shoe,silver
manufacture>make:car,good,part
manufacture>produce:car,part
manufacture>build:car,good,part
mend>repair:fence,net,shirt
mend>fix:fence,net,shirt
revise>edit:note
revise>review:note,text
underline>highlight:title,word
underline>emphasize:text,title,word
cite>mention:example,law,source
cite>quote:example,law
rehearse>practice:scene,song,speech
rehearse>drill:scene,song,speech
debate>discuss:law,topic
investigate>examine:case,cause,crime
investigate>research:case,crime
observe>watch:behavior,sky
observe>notice:behavior,sky
smell>detect:smoke
smell>sniff:smoke
sniff>smell:air
scratch>rub:arm,head
rub>wipe:eye
pinch>squeeze:arm,cheek
cure>heal:patient
cure>treat:disease
prescribe>recommend:antibiotic,medicine,treatment
prescribe>order:antibiotic,medicine,treatment
hunt>chase:deer
sculpt>shape:marble,statue
sculpt>mold:statue
sculpt>carve:marble
sketch>draw:plan,portrait
sketch>draft:plan
illustrate>explain:idea,point
illustrate>show:idea,point
strum>play:chord,guitar
tune>adjust:guitar,piano,radio
conduct>lead:choir,orchestra
exhibit>show:painting,work
exhibit>present:painting,work
recite>narrate:line,poem
sentence>punish:criminal,defendant
convict>condemn:criminal,defendant,suspect
prosecute>charge:company,suspect
prosecute>try:suspect
prosecute>sue:suspect
enforce>apply:law
regulate>govern:industry,market
regulate>adjust:price
authorize>approve:payment,transfer,use
license>authorize:driver,product,software
prohibit>ban:entry,use
prohibit>forbid:use
violate>break:contract,law
ratify>approve:agreement,law,treaty
ratify>confirm:agreement,law,treaty
repeal>cancel:ban,law,rule
enact>pass:law,reform,rule
inherit>receive:business,fortune,house
inherit>get:business,fortune,house
confiscate>take:car,good,weapon
damage>break:car,file,roof
rescue>save:child,dog,hostage
transform>change:city,company,process
transform>convert:process
shift>move:focu,schedule,weight
shift>switch:focu
shift>change:focu,schedule,weight
widen>expand:gap,road,scope
strengthen>boost:team
weaken>reduce:signal
boost>raise:morale,sale
boost>increase:sale
accelerate>speed-up:growth
renew>restore:lease,license
reform>improve:company,law,system
cause>produce:damage,problem
swap>exchange:place
swap>switch:place
transfer>move:file,money
hand>give:key,paper,report
hand>pass:key,paper,report
hand>deliver:key,paper,report
distribute>share:flyer,food,task
substitute>replace:ingredient,player
substitute>swap:ingredient,player,worker
mail>post:invoice,letter,package
mail>send:invoice,letter,package
ship>send:good,order,package
ship>deliver:good,order
conceal>cover:evidence,truth
conceal>hide:evidence,fact
state>declare:fact
state>say:fact,name,reason
indicate>show:direction,error,preference
indicate>suggest:preference
ask-for>demand:help
ask-for>seek:advice,refund
ask-for>request:advice
terminate>cancel:agreement,contract,service
terminate>end:agreement,service
attempt>try:approach,climb,repair
utilize>use:method,resource,software
utilize>employ:method,resource,software
dispatch>send:order,package,team
dispatch>forward:order,package
establish>set-up:company,connection,rule
obtain>get:information,permit,visa
retain>keep:document,receipt,staff
purchase>buy:equipment,laptop,license
reimburse>refund:cost,expense
select>choose:candidate,date
select>pick:candidate,date,option
select>elect:candidate
turn-down>refuse:invitation,job,offer
turn-down>reject:invitation,job
commence>begin:course,meeting,trial
commence>start:course,meeting,trial
modify>change:design,setting
modify>adjust:design
abandon>leave:plan,project
abandon>quit:project
cease>stop:operation,payment,production
cease>end:operation,payment,production
construct>build:bridge,model
construct>assemble:model
instruct>teach:staff,student
instruct>direct:staff,student,team
instruct>order:staff,student,team
encounter>meet:difficulty,problem,resistance
encounter>face:difficulty,resistance
look-at>examine:data,map,report`;
const O2_AFF = new Set();
O2_AFF_TXT.split('\n').forEach(l => { const i = l.indexOf(':'); if(i < 0) return; const p = l.slice(0, i); l.slice(i + 1).split(',').forEach(hh => O2_AFF.add(p + ':' + hh)); });
const o2AffCurada = (v1, v2, c1) => O2_AFF.has(v1 + '>' + v2 + ':' + o2Head(c1.en));
/* ✓ se: (a) curada à mão, ou (b) o verbo 2 tem o mesmo objeto nas próprias colocações */
function o2Afin(verb1, v2){
  const c1 = state.colocacao !== null ? (verb1.col || [])[state.colocacao] : null;
  if(!c1 || !v2) return false;
  return o2AffCurada(verb1.id, v2.id, c1) || (v2.col || []).some(c => o2ObjDef(c) && o2Head(c.en) === o2Head(c1.en));
}
/* a opção precisa de complemento? (antônimo/sinônimo/verbo livre não trazem objeto) */
const o2PrecisaCpl = (k, op) => op && (op.src === 'auto' || op.src === 'livre') && !op.en || (op && op.src === 'livre');
/* ================= v92 · fase 3: temporal · condicional · concessiva ================= */
/* v94: só subordinadas adverbiais podem abrir a frase (coordenadas ficam entre as orações); "so that" não abre */
const O2_INI = new Set(['final', 'caus', 'temp', 'cond', 'conc', 'conf', 'rger', 'rpart']);
const o2PodeIni = (tipo, c) => !!tipo && O2_INI.has(tipo.k) && !(c && (c.en === 'so that' || c.en === 'in order that'));
/* ================= v98: orações SUBSTANTIVAS (objetiva direta) =================
   A oração é o OBJETO de um verbo de pensar/dizer/perguntar, então só vale com esses verbos (senão "She buys that it is…" não faz sentido).
   conjunções permitidas por verbo: that (declarações) · if / whether (perguntas indiretas) · pt: 'subj' = o português pede subjuntivo. */
const O2_SUBJ = {};
(function(){
  const que = 'think believe say feel explain claim admit realize notice remember discover learn mention state argue assume guess imagine suppose expect forget show prove report announce confirm insist recognize predict declare indicate demonstrate conclude promise agree understand';
  que.split(' ').forEach(v => { O2_SUBJ[v] = { c:['that'] }; });
  'know find-out determine'.split(' ').forEach(v => { O2_SUBJ[v] = { c:['that', 'if', 'whether'] }; });
  'ask check decide see verify'.split(' ').forEach(v => { O2_SUBJ[v] = { c:['if', 'whether'] }; });
  O2_SUBJ.doubt = { c:['that', 'if', 'whether'], subj:['that'] };       /* "duvido que seja" (subjuntivo) × "duvido se é" */
  O2_SUBJ.hope = { c:['that'], subj:['that'] };                          /* "espero que seja" */
})();
/* conjunção efetiva × inválidas para o card (relativas: who só pessoas / which só coisas; objetiva: as do verbo) */
function o2ConjValidas(t){
  const o = state.o2, cur = t.conjs[o.tipo === t.k ? o.conj : 0].en;
  if(t.forma === 'R'){
    const st = o2RelEstado(); if(!st.ok) return null;
    const inv = new Set(t.conjs.map(c => c.en).filter(x => !(O2_REL_OK[x] || []).includes(st.tipo)));
    return { invalida:inv, ef: inv.has(cur) ? o2RelEf(cur, st.tipo) : cur, motivo: O2_REL_MOTIVO[st.tipo] };
  }
  if(t.forma === 'X'){
    const st = o2ApEstado(); if(!st.ok) return null;
    const inv = new Set(t.conjs.map(c => c.en).filter(x => !st.d.c.includes(x)));
    return { invalida:inv, ef: st.d.c.includes(cur) ? cur : st.d.c[0], motivo:'Este verbo não aceita este tipo de substantivo' };
  }
  if(t.forma === 'I'){
    const st = o2OiEstado(); if(!st.ok) return null;
    const inv = new Set(t.conjs.map(c => c.en).filter(x => !st.d.c.includes(x)));
    return { invalida:inv, ef: st.d.c.includes(cur) ? cur : st.d.c[0], motivo:'Este verbo não aceita este complemento' };
  }
  if(t.forma === 'S'){
    const st = o2SubstEstado(); if(!st.ok) return null;
    const inv = new Set(t.conjs.map(c => c.en).filter(x => !st.d.c.includes(x)));
    return { invalida:inv, ef: st.d.c.includes(cur) ? cur : st.d.c[0], motivo:'Este verbo não aceita esta conjunção' };
  }
  if(t.k === 'rinf'){                                       /* v135: to × -ing conforme o verbo */
    const st = o2RinfEstado(); if(!st.ok) return null;
    const inv = new Set(t.conjs.map(c => c.en).filter(x => !st.d.c.includes(x)));
    return { invalida:inv, ef: st.d.c.includes(cur) ? cur : st.d.c[0], motivo:'Este verbo não aceita esta forma' };
  }
  return null;
}
/* v104: objetiva indireta — verbo → preposição (EN/PT) e quais complementos aceita */
const O2_OBJI = {
  talk:{ p:'about', pp:'sobre', c:['how', 'whether', '-ing'] }, complain:{ p:'about', pp:'de', c:['how', '-ing'] },
  think:{ p:'about', pp:'sobre', c:['how', 'whether', '-ing'] }, depend:{ p:'on', pp:'de', c:['how', 'whether'] },
  insist:{ p:'on', pp:'em', c:['-ing'] }, argue:{ p:'about', pp:'sobre', c:['how', 'whether', '-ing'] },
  dream:{ p:'of', pp:'com', c:['-ing'] }, joke:{ p:'about', pp:'sobre', c:['how', '-ing'] },
  lie:{ p:'about', pp:'sobre', c:['how', '-ing'] }, focus:{ p:'on', pp:'em', c:['how', '-ing'] },
  learn:{ p:'about', pp:'sobre', c:['how', '-ing'] }, ask:{ p:'about', pp:'sobre', c:['how', 'whether'] },
  speak:{ p:'about', pp:'sobre', c:['how', '-ing'] }, write:{ p:'about', pp:'sobre', c:['how', '-ing'] },
  read:{ p:'about', pp:'sobre', c:['how', '-ing'] }, hear:{ p:'about', pp:'sobre', c:['how'] },
  believe:{ p:'in', pp:'em', c:['-ing'] }, apologize:{ p:'for', pp:'por', c:['-ing'] }, agree:{ p:'on', pp:'sobre', c:['how', 'whether'] }
};
/* v105: completiva nominal — verbo → substantivos abstratos que ele aceita ("accept the idea that") */
const O2_CN = {
  accept:['idea', 'fact', 'possibility'], deny:['fact', 'rumor', 'claim'], ignore:['fact', 'rumor', 'possibility'], know:['fact', 'rumor'],
  share:['idea', 'belief', 'hope'], support:['idea', 'belief', 'claim'], reject:['idea', 'claim', 'possibility'], hear:['news', 'rumor', 'claim'],
  spread:['rumor', 'news', 'idea'], have:['feeling', 'hope', 'impression'], express:['belief', 'hope', 'concern'], welcome:['news', 'idea', 'fact']
};
const O2_CN_PT = { idea:'a ideia', fact:'o fato', possibility:'a possibilidade', rumor:'o boato', claim:'a alegação', belief:'a crença', hope:'a esperança',
                   news:'a notícia', feeling:'a sensação', impression:'a impressão', concern:'a preocupação' };
/* v107: apositiva — that (conteúdo) × to (intenção) */
const O2_AP_TO = { have:['goal', 'plan', 'dream'], share:['goal', 'dream', 'plan'], express:['wish', 'dream'] };
const O2_AP_PT = { goal:'um objetivo', plan:'um plano', dream:'um sonho', wish:'um desejo', idea:'uma ideia', fact:'um fato', possibility:'uma possibilidade', rumor:'um boato',
                   claim:'uma alegação', belief:'uma crença', hope:'uma esperança', feeling:'uma sensação', impression:'uma impressão', concern:'uma preocupação' };
function o2ApCand(id){
  const th = (O2_CN[id] || []).filter(n => n !== 'news'), to = O2_AP_TO[id] || [];
  return { th, to, c:[].concat(th.length ? [': that'] : [], to.length ? [': to'] : []) };
}
const O2_AP_SUG = ['have', 'share', 'accept', 'express'];
function o2ApEstado(){
  const verb = verbById(state.verbo), d = o2ApCand(verb.id);
  if(!d.c.length) return { ok:false, msg:'A apositiva parte de um verbo que aceita um substantivo explicado depois de dois-pontos (have <b>one goal</b>: to…, accept <b>one idea</b>: that…). Escolha um destes no dial ③:' };
  if(state.colocacao !== null) return { ok:false, msg:'Aqui o objeto do verbo é o substantivo (“one goal”), então não combina com uma colocação do dial ⑨. Tire a colocação para usar este tipo.', semSug:true };
  return { ok:true, d };
}
const O2_CN_SUG = ['accept', 'deny', 'share', 'hear', 'have'];
function o2CnEstado(){
  const verb = verbById(state.verbo), d = O2_CN[verb.id];
  if(!d) return { ok:false, msg:'A completiva nominal parte de um verbo que aceita um substantivo abstrato (accept <b>the idea</b> that, deny <b>the fact</b> that, hear <b>the news</b> that…). Escolha um destes no dial ③:' };
  if(state.colocacao !== null) return { ok:false, msg:'Aqui o objeto do verbo é o substantivo abstrato (“the idea”), então não combina com uma colocação do dial ⑨. Tire a colocação para usar este tipo.', semSug:true };
  return { ok:true, d };
}
const O2_OI_SUG = ['talk', 'think', 'depend', 'insist', 'apologize'];
function o2OiEstado(){
  const verb = verbById(state.verbo), d = O2_OBJI[verb.id];
  if(!d) return { ok:false, msg:'A objetiva indireta parte de um verbo que pede <b>preposição</b> + oração (talk about, depend on, insist on, apologize for…). Escolha um destes no dial ③:' };
  if(state.colocacao !== null) return { ok:false, msg:'Aqui a preposição vem do próprio verbo (“talk <b>about</b> how…”), então não combina com uma colocação do dial ⑨. Tire a colocação para usar este tipo.', semSug:true };
  return { ok:true, d };
}
const O2_SUBJ_SUG = ['think', 'say', 'know', 'ask', 'hope'];
function o2SubstEstado(){
  const verb = verbById(state.verbo), d = O2_SUBJ[verb.id];
  if(!d) return { ok:false, msg:'A objetiva direta parte de um verbo de <b>pensar, dizer ou perguntar</b> (think, say, know, ask, hope…): é a oração que faz o papel de objeto do verbo. Escolha um destes no dial ③:' };
  if(state.colocacao !== null) return { ok:false, msg:'A oração substantiva <b>é</b> o objeto do verbo, então não combina com uma colocação do dial ⑨ (“think about the future that…”). Tire a colocação para usar este tipo.', semSug:true };
  return { ok:true, d };
}
/* ================= v97: orações RELATIVAS =================
   O substantivo é o OBJETO da colocação escolhida (⑨); a relativa ocupa o fim da frase ("She buys a laptop that she needs"),
   por isso só vale sem palavras-sinal de fim. O pronome relativo substitui o objeto: nunca "that she needs it". */
const O2_REL = [{ v:'need', prep:'de' }, { v:'use', prep:'' }, { v:'want', prep:'' }, { v:'like', prep:'de' }, { v:'love', prep:'' }, { v:'prefer', prep:'' }];
/* verbos que fazem sentido com o substantivo: pessoas (precisar, querer, gostar) × coisas (precisar, usar, querer) */
const O2_REL_PESSOA = ['need', 'want', 'like'], O2_REL_COISA = ['need', 'use', 'want'];
const O2_PESSOA = new Set(['client','customer','doctor','teacher','friend','colleague','student','manager','boss','candidate','worker','employee','partner','expert','patient','team','staff','people','driver','lawyer','buyer','seller','supplier','user','member','leader','child','parent','player','neighbor','guest','visitor','investor','speaker','author','audience','family','person','man','woman','engineer','nurse','developer','designer','analyst','consultant','specialist','agent','artist','chef','mentor','coach','intern','trainee','applicant','professional','programmer','accountant','dentist','judge','witness','tenant','owner','founder','director','assistant','secretary','salesperson','waiter','cook','musician','dancer','athlete','coworker','boy','girl','kid','baby','woman','mother','father','brother','sister','son','daughter','husband','wife']);
/* v101.1: mais substantivos de pessoa (who) */
['children','everyone','someone','somebody','anyone','tourist','crowd','president','opponent','fan','stranger','enemy','rival','kid','mother','father','brother','sister','son','daughter','wife','husband','girl','boy','artist','writer','singer','judge','officer','chef','nurse','engineer','developer','designer','analyst','director','minister','coach','athlete','trainer','tutor','mentor','intern','applicant','voter','passenger','employer','owner','girlfriend','boyfriend','reader','viewer','follower','subscriber','recruiter','consultant','contractor','freelancer','vendor','client','colleague'].forEach(w => O2_PESSOA.add(w));
/* v113: tipo do substantivo-núcleo decide o pronome relativo: pessoa (who/whose) · lugar (where) · tempo (when) · coisa (which) */
['suspect','thief','defendant','winner','referee','bride','champion','defender','elder','criminal','mayor','hostage','prisoner','citizen'].forEach(w => O2_PESSOA.add(w));   /* v137: pessoas que caíam em "coisa" */
const O2_LUGAR = new Set(['house','room','place','city','building','market','country','garden','office','kitchen','street','apartment','museum','restaurant','hotel','school','hospital','park','store','shop','factory','village','town','beach','area','region','bank','library','gym','airport','station','theater','theatre','cafe','bar','world','neighborhood','campus','farm','island','church','stadium','studio','lab','laboratory','warehouse','mall','square','road','site','venue','branch','classroom','bedroom','hall']);
const O2_TEMPO_N = new Set(['time','moment','day','week','year','hour','month','night','morning','season','period','era','evening','afternoon','weekend','summer','winter','century','decade']);
/* só vale o substantivo "puro": expressões com preposição ("everything in place") ou número ("eight hours") não viram lugar/tempo */
const o2RelTipo = (h, en) => O2_PESSOA.has(h) ? 'pessoa' : (/\b(in|at|on|of|for|to|with|by|from|about|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/i.test(en || '') ? 'coisa' : O2_LUGAR.has(h) ? 'lugar' : O2_TEMPO_N.has(h) ? 'tempo' : 'coisa');
const O2_REL_OK = { that:['pessoa', 'lugar', 'tempo', 'coisa'], who:['pessoa'], which:['lugar', 'tempo', 'coisa'], whose:['pessoa', 'lugar', 'coisa'], where:['lugar'], when:['tempo'] };
const o2RelEf = (cur, tipo) => (O2_REL_OK[cur] || []).includes(tipo) ? cur : (tipo === 'pessoa' ? 'who' : 'which');
const O2_REL_MOTIVO = { pessoa:'O substantivo é uma pessoa: use who, that ou whose', lugar:'O substantivo é um lugar: use where, which, that ou whose', tempo:'O substantivo é um tempo: use when, which ou that', coisa:'O substantivo é uma coisa: use which, that ou whose' };
/* whose + substantivo possuído + be + adjetivo (o possuído concorda em gênero com "cujo/cuja" e com o adjetivo) */
const O2_WHOSE = {
  pessoa:[{ n:'company', pt:'empresa', g:'f', adj:'successful', m:'bem-sucedido', f:'bem-sucedida' }, { n:'idea', pt:'ideia', g:'f', adj:'useful', m:'útil', f:'útil' }, { n:'work', pt:'trabalho', g:'m', adj:'famous', m:'famoso', f:'famosa' }],
  coisa:[{ n:'price', pt:'preço', g:'m', adj:'high', m:'alto', f:'alta' }, { n:'design', pt:'design', g:'m', adj:'modern', m:'moderno', f:'moderna' }, { n:'quality', pt:'qualidade', g:'f', adj:'excellent', m:'excelente', f:'excelente' }]
};
O2_WHOSE.lugar = O2_WHOSE.coisa;
/* verbos da relativa de lugar (where) e de tempo (when): intransitivos que combinam com o substantivo */
const O2_REL_WHERE = ['work', 'live', 'study'], O2_REL_WHEN = ['arrive', 'start', 'finish'];
/* v101.1: colocação de PESSOA com preposição ("deal with clients", "apologize to the client") também aceita a relativa:
   o pronome se prende ao substantivo, não à preposição — "She deals with clients who she needs." */
function o2RelPrepPessoa(c){
  if(!c || !c.en) return null;
  const m = c.en.trim().match(/^(with|to|for|on|in|about|of|from)\s+(.+)$/i);
  if(!m || /^(me|you|him|her|us|them|it|myself|yourself)\b/i.test(m[2])) return null;
  return O2_PESSOA.has(o2Head(m[2])) ? { en:m[2].replace(/^(a|an)\s+/i, 'the '), pt:'' } : null;
}
function o2RelEstado(red){
  const verb = verbById(state.verbo), c1 = state.colocacao !== null ? (verb.col || [])[state.colocacao] : null;
  const def = c1 ? (o2ObjDef(c1) || o2RelPrepPessoa(c1)) : null;
  if(!def) return { ok:false, msg:'A relativa precisa de um <b>substantivo</b>: escolha no dial ⑨ uma colocação que seja objeto (ex.: “a laptop”) ou uma <b>pessoa</b> com preposição (ex.: “with clients”).' };
  if(endList().length || state.signalSplit) return { ok:false, msg:'A relativa vem logo depois do substantivo, no <b>fim</b> da frase: tire as palavras-sinal de fim (lugar, tempo, modo…) para usar este tipo.' };
  const hd = o2Head(def.en), tp = o2RelTipo(hd, def.en), cls = o2RelClasse(hd, def.en, tp);
  /* v137: a relativa REDUZIDA recusa núcleos que não são coisas/pessoas concretas ("a break", "English", qualidades) */
  if(red && cls === 'x') return { ok:false, msg:'“<b>' + escapeHTML(def.en) + '</b>” não combina com a relativa reduzida: as opções (-ing, particípio, to) descrevem <b>pessoas, lugares, coisas ou documentos concretos</b>, e com este núcleo soariam estranhas. Escolha no dial ⑨ outra colocação (ex.: “a report”, “a laptop”)' + ((verb.col || []).some(x => { const d2 = o2ObjDef(x) || o2RelPrepPessoa(x); if(!d2) return false; const h2 = o2Head(d2.en); return o2RelClasse(h2, d2.en, o2RelTipo(h2, d2.en)) !== 'x'; }) ? ' ou use o botão.' : '. <b>' + escapeHTML(nomeV(verb)) + '</b> não tem nenhuma colocação que sirva de núcleo, então o botão troca por um verbo transitivo comum.') };
  return { ok:true, pessoa:tp === 'pessoa', tipo:tp, head:hd, cls };
}
/* v136: leva o motor ao que a oração reduzida precisa, mexendo o mínimo (verbo, colocação, palavras-sinal de fim).
   Antes o dial só AVISAVA ("escolha um verbo…") e a frase ficava sem a 2ª oração; agora "Usar no motor" e o botão do aviso resolvem. */
const O2_REL_VERBOS = ['write', 'buy', 'hire', 'read', 'build', 'make', 'create'];
function o2AjustaReduzida(k){
  if(k === 'rinf'){
    if(!O2_RI[state.verbo]) state.verbo = O2_RI_SUG[0];
    state.colocacao = null;
  } else if(k === 'rrel'){
    if(!o2RelEstado(true).ok){
      /* v137: o índice precisa ser de um núcleo que a reduzida aceite (não "a break", "English"…) */
      const colOk = c => { const d = o2ObjDef(c) || o2RelPrepPessoa(c); if(!d) return false; const h = o2Head(d.en); return o2RelClasse(h, d.en, o2RelTipo(h, d.en)) !== 'x'; };
      const idxOk = v => (v.col || []).findIndex(colOk);
      let v = verbById(state.verbo), i = idxOk(v);
      if(state.colocacao !== null && v.col && v.col[state.colocacao] && colOk(v.col[state.colocacao])) i = state.colocacao;   /* já serve: mantém */
      if(i < 0){                                           /* verbo sem núcleo adequado: troca por um transitivo comum */
        const id = O2_REL_VERBOS.find(x => verbById(x) && idxOk(verbById(x)) >= 0);
        if(id){ state.verbo = id; v = verbById(id); i = idxOk(v); }
      }
      if(i >= 0) state.colocacao = i;
    }
    state.signalEnds = []; state.signalSplit = null;      /* a relativa fica no fim da frase: sem palavras-sinal de fim */
  }
}
/* v96: conjunção marcada com ini:true abre SEMPRE a frase (fica melhor assim) e a ordem é automática; sem alternância manual */
const o2IniEf = (tipo, c) => o2PodeIni(tipo, c) && !!c.ini;
const O2_INI_NOTA = c => '<br><br>↔️ <b>Ordem invertida automática</b> — <b>' + c.en + '</b> funciona melhor abrindo a frase, então o motor coloca a subordinada primeiro e a separa da principal por <b>vírgula</b>. A 2ª oração passa a ter maiúscula inicial e a principal, minúscula ("I" continua maiúsculo). Quando a ideia vem depois da principal, sem vírgula, a conjunção mais natural é outra (por exemplo because ou though).';
const PT_TIVESSE = { "1s":"tivesse", "3s":"tivesse", "1p":"tivéssemos", "3p":"tivessem" };
const O2_CND_REQ = ['presente (simples ou contínuo)', 'futuro (simples ou contínuo)', 'futuro simples', 'futuro perfeito'];
/* tipo da condicional em vigor: o escolhido, ou o derivado da principal; unless/as long as só têm 0 e 1 */
function o2CondEstado(){
  const o = state.o2, c = O2_TIPOS.find(t => t.k === 'cond').conjs[o.conj] || { en:'if' };
  const tp = state.tempo, asp = state.aspecto, ehIf = c.en === 'if';
  let cnd = o.cnd !== null ? o.cnd : (tp === 'present' ? 0 : (tp === 'future' && asp === 'perfeito' ? 3 : 1));
  if(!ehIf && cnd > 1) cnd = 1;
  const simp = asp === 'simples' || asp === 'continuo';
  const ok = cnd === 0 ? (tp === 'present' && simp) : cnd === 1 ? (tp === 'future' && simp) : cnd === 2 ? (tp === 'future' && asp === 'simples') : (tp === 'future' && asp === 'perfeito');
  return { cnd, ok, c, ehIf, msg: ok ? '' : 'A condicional <b>tipo ' + cnd + '</b> pede a principal em <b>' + O2_CND_REQ[cnd] + '</b>; o motor está em outro tempo/aspecto. Ajuste-o ou use o botão abaixo.' };
}
/* leva o motor (tempo/aspecto) ao que o tipo pede, mexendo o mínimo */
function o2CondMotor(cnd){
  const simp = state.aspecto === 'simples' || state.aspecto === 'continuo';
  if(cnd === 0){ state.tempo = 'present'; if(!simp) state.aspecto = 'simples'; }
  else if(cnd === 1){ state.tempo = 'future'; if(!simp) state.aspecto = 'simples'; }
  else if(cnd === 2){ state.tempo = 'future'; state.aspecto = 'simples'; }
  else { state.tempo = 'future'; state.aspecto = 'perfeito'; }
}
function o2CondNota(cnd, cj){
  if(cj === 'unless') return '<b>Unless</b> = <b>if … not</b>: a oração fica <b>afirmativa</b> (negar de novo duplicaria a negação). Presente simples no inglês; <b>subjuntivo</b> no português ("a menos que ela precise").';
  if(cj === 'as long as') return '<b>As long as</b> = "desde que": condição necessária, com <b>presente simples</b> (nunca will) e <b>subjuntivo</b> no português ("desde que ela precise").';
  return [
    '<b>Condicional tipo 0</b> (fato geral): <b>if + presente simples → presente simples</b>. "If" ≈ "sempre que". Português: indicativo ("se ela precisa…").',
    '<b>Tipo 1</b> (possibilidade real no futuro): <b>if + presente simples → will + verbo base</b>. Nunca "if … will". Português: <b>futuro do subjuntivo</b> na condição ("se ela precisar") e futuro na principal.',
    '<b>Tipo 2</b> (hipótese improvável/irreal no presente ou futuro): <b>if + passado simples → would + verbo base</b>. Português: <b>imperfeito do subjuntivo</b> + condicional ("trabalharia se precisasse"). O motor troca o <i>will</i> da principal por <i>would</i>.',
    '<b>Tipo 3</b> (irreal no passado): <b>if + past perfect → would have + particípio</b>. Português: <b>"tivesse" + particípio</b> e <b>"teria" + particípio</b>. O motor troca <i>will have</i> por <i>would have</i>.'
  ][cnd];
}
const O2_CND_EST = ['+ if + presente simples (tipo 0)', '+ if + presente simples (tipo 1: principal com will)', '+ if + passado simples (tipo 2: principal com would)', '+ if + past perfect (tipo 3: principal com would have)'];
/* will → would na frase da principal (inclui won't/Will/Won't) */
const o2WouldMain = t => t.split(M('will')).join(M('would')).split(M("won't")).join(M("wouldn't")).split(M('Will')).join(M('Would')).split(M("Won't")).join(M("Wouldn't"));
/* cláusula finita no modo pedido: 'ind' (indicativo via translate) | 'pres' | 'imp' | 'fut' (subjuntivos) | 'perf' (tivesse + particípio) */
/* ================= v108: FOCO DOS ENCAIXES — Oração 1 | Oração 2 =================
   Os encaixes (palavras-sinal ⑨ e complemento/colocação ④) valem para UMA oração por vez. Com a
   2ª oração ativa surgem dois botões; no foco 2 os mesmos dials passam a editar a 2ª oração.
   Capacidade por tipo (o motor decide, o aluno não precisa saber):
     full : oração finita montada pelo motor (adv, adit, alt, expl, caus, cons) → meio + fim + complemento
     ends : temporal/condicional (verbo em subjuntivo no PT) e infinitiva (final) → só fim + complemento
     none : estrutura fixa (relativas, comparativa, conformativa, proporcional, subjetiva, predicativa,
            objetivas, consecutiva intensiva, completiva nominal, apositiva, concessiva) → sem encaixes
   O contexto de validade (tempo, aspecto, polaridade) é o da PRÓPRIA 2ª oração, derivado da principal. */
/* concessiva: despite / in spite of pedem SUBSTANTIVO; as demais (although, though, even though, even if) pedem oração com adjetivo */
const o2ConcNome = cj => { const c = (O2_TIPOS.find(t => t.k === 'conc') || { conjs:[] }).conjs[cj]; return !!c && (c.en === 'despite' || c.en === 'in spite of'); };
const O2_FORMA_FIXA = ['G', 'R', 'S', 'Q', 'D', 'N', 'P', 'U', 'Y', 'Z', 'I', 'W', 'X', 'V'];
function o2Ctx2(){
  const o = state.o2, tipo = O2_TIPOS.find(t => t.k === o.tipo);
  if(!tipo) return null;
  const f = tipo.forma, c = tipo.conjs[o.conj] || tipo.conjs[0], tp = state.tempo;
  if(O2_FORMA_FIXA.includes(f)) return { tipo, cap:'none', motivo:'tem estrutura fixa' };
  if(f === 'A') return { tipo, cap:'ends', tempo:tp, aspecto:state.aspecto, formato:o.neg ? 'negativa' : 'afirmativa' };
  if(f === 'T'){
    const k = c.en;
    return { tipo, cap:'ends', tempo: tp === 'past' ? 'past' : 'present', aspecto: (k === 'while' && tp === 'past') ? 'continuo' : 'simples', formato:o.neg ? 'negativa' : 'afirmativa' };
  }
  if(f === 'K'){
    const st = o2CondEstado();
    if(!st.ok) return { tipo, cap:'none', motivo:'não combina com a principal' };
    const cnd = st.cnd;
    return { tipo, cap:'ends', tempo: cnd >= 2 ? 'past' : 'present', aspecto: cnd === 3 ? 'perfeito' : 'simples', formato:(c.en !== 'unless' && o.neg) ? 'negativa' : 'afirmativa' };
  }
  const ops = o2Opcoes(tipo.k, verbById(state.verbo), o.conj);
  const op = o.custom ? {} : (ops[o.opt] || {});
  const neg = (tipo.k === 'adv' && !o.custom) ? !!op.neg : o.neg;   /* v152: com verbo livre na adversativa, a negação vem de o.neg */
  const asp = ((tipo.k === 'caus' || tipo.k === 'cons' || tipo.k === 'expl') && (state.aspecto === 'continuo' || state.aspecto === 'perfeito_continuo')) ? 'simples' : state.aspecto;
  return { tipo, cap:'full', tempo:tp, aspecto:asp, formato:neg ? 'negativa' : 'afirmativa' };
}
/* peças que a 2ª oração aceita AGORA (por tempo/aspecto/polaridade dela; sem partido, sem abertura de frase) */
function o2PalavrasSinal2(ctx){
  if(!ctx || ctx.cap === 'none') return [];
  const key = ctx.tempo + '_' + ctx.aspecto;
  return (SIGNAL_WORDS[key] || []).filter(sw => signalAllowed(sw, ctx.formato) && sw.cls !== 'seqFam'
    && (ctx.cap === 'full' ? !(sw.cls === 'timeMid' || PT_ADV_INICIO.has(SIGNAL_PT[sw.w] || sw.w)) : sw.pl === 'end'));
}
/* encaixes da 2ª oração já filtrados: só o que ainda vale, um ocupante por encaixe */
function o2Sl2(){
  const o = state.o2, vazio = { signalMids:[], signalEnds:[] };
  if(!o || !o.tipo || !o.sl2) return vazio;
  const ctx = o2Ctx2(), ok = o2PalavrasSinal2(ctx);
  if(!ok.length) return vazio;
  const vistos = new Set();
  const um = lista => (lista || []).filter(x => {
    if(!ok.some(w => w.w === x.w && w.pl === x.pl)) return false;
    const r = slotOf(x); if(vistos.has(r)) return false; vistos.add(r); return true; });
  return { signalMids: um(o.sl2.signalMids), signalEnds: um(o.sl2.signalEnds) };
}
const o2Sl2N = sl => (sl || o2Sl2()).signalMids.length + (sl || o2Sl2()).signalEnds.length;
/* fim de oração: marcado (EN colorido) e português */
const o2EndsEN = sl => sortEnds(sl.signalEnds).map(s => ' ' + C(s.w, s.cls)).join('');
const o2EndsPT = sl => sortEnds(sl.signalEnds).map(s => ' ' + (SIGNAL_PT[s.w] || s.w)).join('');
/* o foco só vale com 2ª oração realmente montada */
function o2Foco(){
  const o = state.o2;
  return (o && o.tipo && o.foco === 2 && o2Compor()) ? 2 : 1;
}
function o2Clausula(op, cpl, pr, tempoC, aspC, neg, modo, sl){
  const fmt = neg ? 'negativa' : 'afirmativa', person = ptPerson(pr);
  const g2 = generate('fact', tempoC, aspC, fmt, pr, verbById(op.v));
  const en = lowerFirstMarked(g2.text) + (op.en ? ' ' + o2Sub(op.en, pr) : '') + (cpl ? ' ' + cpl.en : '');
  let core = null;
  if(modo === 'perf'){ const pv = PT_VERBS[op.v]; core = pv && pv.part ? PT_TIVESSE[person] + ' ' + pv.part : null; }
  else if(modo === 'ipf') core = ptImperf(op.v, person);               /* v120: habitual no passado */
  else if(modo !== 'ind') core = ptSubj(op.v, person, modo);
  let pt2;
  if(core) pt2 = PT_PRONOUN[pr].toLowerCase() + ' ' + (neg ? 'não ' : '') + core;
  else {                                   /* sem forma derivável: cai no indicativo (os testes garantem que é raro/inexistente) */
    pt2 = translate('fact', tempoC, aspC, fmt, pr, null, [], op.v, null, null).replace(/[.?!]\s*$/, '');
    pt2 = pt2.charAt(0).toLowerCase() + pt2.slice(1);
  }
  if(op.v === 'save') pt2 = pt2.replace(/\bsalv/g, 'economiz');
  return { en: en + (sl ? o2EndsEN(sl) : ''), pt: pt2 + (op.pt ? ' ' + o2Sub(op.pt, pr, true) : '') + (cpl ? ' ' + cpl.pt : '') + (sl ? o2EndsPT(sl) : '') };
}
/* ramo T (temporal) · K (condicional) · Q (concessiva): { enCl, ptCl, est, nota, mainEN, ptModo } ou null */
/* ================= v96: TRANSFORMAÇÕES — mesmo sentido, outra estrutura =================
   Troca a ordem lógica das orações E a conjunção, preservando o significado:
     causal  ⇄ consecutiva : "X because Y"  ⇄  "Y, so X"
     concessiva → adversativa : "Although A, B"  →  "A, but B"
     finalidade → consecutiva : "M to V"  →  "I want to V, so M"
   (unless ⇄ if…not é só troca de conectivo/polaridade e fica no card Condicional.) */
const O2_TR = {
  'caus>cons': { de:'caus', nome:'Consecutiva (so)', rot:'→ consecutiva: Y, so X',
    nota:'<b>Causal → consecutiva</b> — "<i>X because Y</i>" e "<i>Y, so X</i>" dizem o mesmo com os papéis trocados: na causal a <b>causa</b> vem depois de <i>because</i>; na consecutiva ela vai para o <b>começo</b> e o resultado vem depois de <i>so</i>, com vírgula. O motor trocou a ordem das orações e a conjunção.' },
  'cons>caus': { de:'cons', nome:'Causal (because)', rot:'→ causal: Y because X',
    nota:'<b>Consecutiva → causal</b> — "<i>X, so Y</i>" equivale a "<i>Y because X</i>": o resultado passa para o começo e a causa vem depois de <i>because</i>, sem vírgula. O motor trocou a ordem das orações e a conjunção.' },
  'conc>adv': { de:'conc', nome:'Adversativa (but)', rot:'→ adversativa: A, but B',
    nota:'<b>Concessiva → adversativa</b> — "<i>Although A, B</i>" e "<i>A, but B</i>" expressam o mesmo contraste. Nunca junte os dois ("although… but"). Em português o verbo passa do subjuntivo ("embora seja") para o indicativo ("é … mas").' },
  'caus>of': { de:'caus', nome:'Causal (because of + nome)', rot:'→ because of + substantivo',
    nota:'<b>Causal → because of</b> — "<i>because she needs more time</i>" (oração) vira "<i>because of her need for more time</i>" (substantivo): <b>because of</b> pede <b>nome</b>, nunca uma oração. O verbo vira o substantivo correspondente (need → <i>need for</i>, want → <i>desire for / wish to</i>, expect → <i>expectation of</i>). Em português: <b>por causa de(a)</b> + nome ("por causa da necessidade de…").' },
  'cond>or': { de:'cond', nome:'Alternativa (or else)', rot:'→ A, or else B',
    nota:'<b>Condicional → or else</b> — "<i>If she doesn\'t need the money, B</i>" e "<i>Unless she needs the money, B</i>" dizem o mesmo que "<i>She needs the money, or else B</i>": a condição passa a ser <b>afirmativa</b>, vem primeiro, e <b>or else</b> (“ou então / senão”) introduz o que acontece se ela não se cumprir. Em português a condição sai do subjuntivo: "ela precisa do dinheiro, ou então…".' },
  'final>cons': { de:'final', nome:'Consecutiva (want … so)', rot:'→ "want to V, so …"',
    nota:'<b>Finalidade → consecutiva</b> — "<i>M to V</i>" equivale a "<i>I want to V, so M</i>": a finalidade vira o <b>desejo</b> (want) e a ação principal vira o <b>resultado</b>, introduzido por <i>so</i> depois de vírgula.' }
};
/* v113: causal → because of + substantivo. Só quando o verbo da causa tem nome correspondente (need→need for, want→desire for/wish to,
   expect→expectation of) e o complemento não é pronome; sem negação ("because she doesn't need" não vira nome). */
const O2_BO = { need:{ np:'need for', inf:'need to', pn:'da necessidade ', pi:'da necessidade de ' }, want:{ np:'desire for', inf:'wish to', pn:'do desejo de ', pi:'do desejo de ' }, expect:{ np:'expectation of', inf:null, pn:'da expectativa de ', pi:null } };
function o2BecauseOf(op){
  if(!op || !op.v || !O2_BO[op.v] || !op.en || state.o2.neg) return null;
  const en = op.en.trim();
  if(/^(it|them|him|her|us|me|you|this|that)$/i.test(en)) return null;
  const inf = /^to /i.test(en), d = O2_BO[op.v];
  if(inf ? !d.inf : false) return null;
  return { d, inf };
}
function o2TrChaves(tipo, c, op){
  if(!tipo || state.formato === 'pergunta' || state.formato === 'pergunta_negativa') return [];
  if(tipo.k === 'caus') return o2BecauseOf(op) ? ['caus>cons', 'caus>of'] : ['caus>cons'];
  if(tipo.k === 'cond' && (c.en === 'unless' || (c.en === 'if' && state.o2.neg)) && o2CondEstado().cnd <= 1) return ['cond>or'];
  if(tipo.k === 'cons') return ['cons>caus'];
  if(tipo.k === 'conc' && c.en !== 'despite' && c.en !== 'in spite of') return ['conc>adv'];
  if(tipo.k === 'final' && c.en !== 'so that' && c.en !== 'in order that') return ['final>cons'];
  return [];
}
const o2Cap = t => t.charAt(0).toUpperCase() + t.slice(1), o2Low = t => t.charAt(0).toLowerCase() + t.slice(1);
/* res = retorno do o2Compor; se houver transformação válida, acrescenta compose* (a render recompõe a frase inteira) */
function o2AplicaTr(res, tipo, c, o, pr, op, cpl){
  const key = o.tr;
  if(!key || !o2TrChaves(tipo, c, op).includes(key)) return res;
  const strip = t => t.replace(/[.?!]\s*$/, '');
  let cEN, cPT, conjEN, conjPT, ordem;      /* orações: 1ª e 2ª na frase final */
  if(key === 'caus>cons'){          /* Y, so X */
    res.composeEN = main => upperFirstMarked(res.enBody) + ', ' + J('so') + ' ' + lowerFirstMarked(main);
    res.composePT = pt1 => o2Cap(res.ptBody) + ', então ' + o2Low(strip(pt1)) + pt1.slice(strip(pt1).length);
  } else if(key === 'caus>of'){     /* v113: X because of her need for Y */
    const bo = o2BecauseOf(op), poss = O2_POSS[pr] || 'their', en0 = o2Sub(op.en, pr), pt0 = o2Sub(op.pt, pr, true);
    const enNP = bo.inf ? bo.d.inf + ' ' + en0.replace(/^to /i, '') : bo.d.np + ' ' + en0;
    const ptNP = bo.inf ? bo.d.pi + pt0 : (op.v === 'need' && /^(de|do|da|dos|das|disso|dele|dela|deles|delas)(\s|$)/.test(pt0) ? bo.d.pn + pt0 : (bo.d.pn.endsWith(' de ') ? bo.d.pn : bo.d.pn + 'de ') + pt0);
    res.composeEN = main => main + ' ' + J('because of') + ' ' + poss + ' ' + enNP;
    res.composePT = pt1 => strip(pt1) + ' por causa ' + ptNP + pt1.slice(strip(pt1).length);
  } else if(key === 'cond>or'){      /* v113: If not A, B  ⇄  A, or else B */
    const rA = o2Clausula(op, cpl, pr, 'present', 'simples', false, 'ind', o2Sl2());
    res.composeEN = main => upperFirstMarked(rA.en) + ', ' + J('or else') + ' ' + lowerFirstMarked(main);
    res.composePT = pt1 => o2Cap(rA.pt) + ', ou então ' + o2Low(strip(pt1)) + pt1.slice(strip(pt1).length);
  } else if(key === 'cons>caus'){   /* Y because X */
    res.composeEN = main => upperFirstMarked(res.enBody) + ' ' + J('because') + ' ' + lowerFirstMarked(main);
    res.composePT = pt1 => o2Cap(res.ptBody) + ' porque ' + o2Low(strip(pt1)) + pt1.slice(strip(pt1).length);
  } else if(key === 'conc>adv'){    /* A, but B */
    res.composeEN = main => upperFirstMarked(res.enBody) + ', ' + J('but') + ' ' + lowerFirstMarked(main);
    res.composePT = pt1 => o2Cap(res.ptInd) + ', mas ' + o2Low(strip(pt1)) + pt1.slice(strip(pt1).length);
  } else {                          /* final>cons: I want to V, so M */
    const fmt = o.neg ? 'negativa' : 'afirmativa';
    const tC = state.tempo, wantEN = generate('fact', tC, 'simples', fmt, pr, verbById('want')).text;
    const wantPT = translate('fact', tC, 'simples', fmt, pr, null, [], 'want', null, null).replace(/[.?!]\s*$/, '');
    const slT = o2Sl2();   /* v108: os encaixes de fim da finalidade viajam com ela */
    const vpEN = o2Sub(op.en, pr) + (cpl ? ' ' + cpl.en : '') + o2EndsEN(slT), vpPT = o2Sub(op.pt, pr, true) + (cpl ? ' ' + cpl.pt : '') + o2EndsPT(slT);
    res.composeEN = main => upperFirstMarked(wantEN) + ' ' + J('to') + ' ' + vpEN + ', ' + J('so') + ' ' + lowerFirstMarked(main);
    res.composePT = pt1 => o2Cap(wantPT) + ' ' + vpPT + ', então ' + o2Low(strip(pt1)) + pt1.slice(strip(pt1).length);
  }
  const T = O2_TR[key];
  res.trLabel = T.nome; res.ini = false; res.estrutura = T.rot; res.nota = T.nota;
  return res;
}
function o2ComporFinita(tipo, o, c, op, cpl, pr){
  const tp = state.tempo;
  let enCl, ptCl, est = tipo.est, nota = tipo.nota, mainEN = null, ptModo = null, ptInd = null;
  if(tipo.forma === 'T'){
    const k = c.en, subj = k === 'before' || k === 'until';
    const tC = tp === 'past' ? 'past' : 'present', aC = (k === 'while' && tp === 'past') ? 'continuo' : 'simples';
    /* v120: habitual no passado ("whenever she needed money, she worked") → imperfeito nas DUAS orações; o modal mantém o perfeito */
    const hab = !!c.hab && tp === 'past' && !(O2C && O2C.id === 'modal');
    const modo = subj ? (tp === 'past' ? 'imp' : 'pres') : (hab ? 'ipf' : (tp === 'future' ? 'fut' : 'ind'));
    const r = o2Clausula(op, cpl, pr, tC, aC, o.neg, modo, o2Sl2());
    enCl = J(c.en) + ' ' + r.en; ptCl = c.pt + ' ' + r.pt;
    if(hab){ ptModo = 'ipf'; nota += '<br>🔁 <b>' + o2Cap(c.en) + '</b> no passado expressa <b>hábito</b>: o português usa o <b>pretérito imperfeito</b> nas duas orações ("trabalhava… sempre que precisava"), e não o perfeito.'; }
    else if(c.hab) nota += '<br>🔁 <b>' + o2Cap(c.en) + '</b> = “toda vez que”: ação que se repete. Fica no presente simples (nunca will), mesmo falando do futuro.';
  } else if(tipo.forma === 'K'){
    const st = o2CondEstado();
    if(!st.ok) return null;
    const cnd = st.cnd, neg = c.en === 'unless' ? false : o.neg;
    const tC = cnd >= 2 ? 'past' : 'present', aC = cnd === 3 ? 'perfeito' : 'simples';
    const modo = !st.ehIf ? 'pres' : (['ind', 'fut', 'imp', 'perf'])[cnd];
    const r = o2Clausula(op, cpl, pr, tC, aC, neg, modo, o2Sl2());
    enCl = J(c.en) + ' ' + r.en; ptCl = c.pt + ' ' + r.pt;
    if(cnd >= 2){ mainEN = o2WouldMain; ptModo = cnd === 2 ? 'c2' : 'c3'; }
    est = st.ehIf ? O2_CND_EST[cnd] : '+ ' + c.en + ' + presente simples';
    nota = o2CondNota(cnd, c.en);
  } else {                                         /* Q: concessiva */
    const despite = c.en === 'despite' || c.en === 'in spite of';
    if(despite){ enCl = J(c.en) + ' ' + op.en; ptCl = c.pt + ' ' + op.pt; est = '+ ' + c.en + ' + substantivo'; }
    else {
      const past = tp === 'past', fut = tp === 'future', neg = o.neg;
      const be = neg ? (past ? "wasn't" : fut ? "won't be" : "isn't") : (past ? 'was' : fut ? 'will be' : 'is');
      enCl = J(c.en) + ' it ' + M(be) + ' ' + op.en;
      ptCl = c.pt + ' ' + (neg ? 'não ' : '') + (past ? 'fosse' : 'seja') + ' ' + op.pt;
      ptInd = (neg ? 'não ' : '') + (past ? 'era' : fut ? 'será' : 'é') + ' ' + op.pt;   /* versão em indicativo, para "…, mas …" */
      est = '+ ' + c.en + ' + it + be + adjetivo';
    }
  }
  return { enCl, ptCl, est, nota, mainEN, ptModo, ptInd };
}
