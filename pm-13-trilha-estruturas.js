/* ---- v163: TRILHA DO CONHECIMENTO ----
   Um "livro" de gramática do A1 ao C2: sumário de assuntos, cada um com título em português e em inglês, nota que abre e fecha
   (tudo recolhido por padrão), ligação para onde o assunto é tratado no app e, quando falta, o plano de onde encaixar.
   Os dados são linhas [nível, id, português, inglês, situação, ligações, nota, destino]; as ligações são códigos curtos:
   m:tempo/aspecto/categoria/formato (motor) · g:tipo (Gramática) · o:tipo (motor com 2ª oração) · d:função (modais) · s:bloco · p · x */
const TRILHA_DADOS = [["A1","tobe","Verbo to be (sou, é, estão)","Verb to be (am / is / are)","ok",["m:present/simples/state","m:present/simples/state/negativa","m:present/simples/state/pergunta"],"Em inglês o sujeito e o verbo são obrigatórios: não existe \"sou feliz\" sem <i>I am happy</i>. A forma muda com a pessoa (am, is, are) e a pergunta inverte sujeito e verbo.",""],["A1","subjpron","Pronomes pessoais sujeito","Subject pronouns (I, you, he, she, it, we, they)","ok",["m:present/simples"],"<i>It</i> serve para coisas, animais e ideias; <i>you</i> vale para singular e plural. Não se omite o pronome como em português.",""],["A1","pressimp","Presente simples","Present simple","ok",["m:present/simples","s:block-matrix"],"Hábitos, rotinas e fatos. Só a 3ª pessoa do singular (he/she/it) leva <b>-s</b>.",""],["A1","dosupport","Negativas e perguntas com do / does","Do-support: negatives and questions","ok",["m:present/simples//negativa","m:present/simples//pergunta","s:block-erros"],"O auxiliar <i>do/does</i> carrega o tempo e a pessoa; o verbo principal volta à forma base. É o erro nº 1 de quem traduz do português.",""],["A1","thirds","Pronúncia do -s da 3ª pessoa","Pronunciation of third-person -s","ok",["s:block-fon"],"O -s soa /s/, /z/ ou /ɪz/ conforme o último som do verbo, como acontece com o -ed.",""],["A1","wh1","Palavras interrogativas básicas","Question words (what, where, who, when, why, how)","ok",["s:block-gatilhos","m:present/simples//pergunta"],"Cada palavra interrogativa pede um tipo de resposta. O módulo Gatilhos de resposta treina o reflexo.",""],["A1","articles","Artigos a / an / the","Articles (a, an, the)","ok",["s:block-estruturas"],"<i>a / an</i> (som de vogal), <i>the</i> (conhecido) e artigo zero (plural e incontável em sentido geral).",""],["A1","plural","Plural dos substantivos","Plural nouns (-s, -es, -ies, irregulars)","ok",["s:block-fon","s:block-estruturas"],"-s, -es (sibilante), -y→-ies, -f/-fe→-ves, -o→-es e irregulares, por regra.",""],["A1","posadj","Adjetivos possessivos","Possessive adjectives (my, your, his, her, our, their)","ok",["s:block-estruturas"],"Quadro de pronomes: <i>my, your, his, her, its, our, their</i> (adjetivo) e <i>mine, yours…</i> (pronome).",""],["A1","demon","Demonstrativos","Demonstratives (this, that, these, those)","ok",["s:block-estruturas"],"<i>this / these</i> (perto) e <i>that / those</i> (longe), singular e plural.",""],["A1","therebe","There is / There are","There is / There are (existence)","ok",["s:block-estruturas","s:block-gatilhos"],"<i>There is</i> com singular, <i>there are</i> com plural; negativa e pergunta com <i>any</i>, resposta curta repete <i>there</i> + verbo.",""],["A1","imperative","Imperativo","Imperatives (Open it. Don't open it. Let's go.)","ok",["s:block-estruturas"],"Forma base sem sujeito; <i>don't</i> proíbe, <i>please</i> suaviza, <i>let's</i> convida.",""],["A1","can","Can / can't (capacidade)","Can for ability","ok",["d:capacidade"],"Não leva -s na 3ª pessoa nem <i>to</i> depois dele. Para o futuro e o passado perfeito usa-se <i>be able to</i>.",""],["A1","prep1","Preposições de tempo e lugar (in, on, at)","Prepositions of time and place (in, on, at)","ok",["s:block-estruturas","x"],"<i>at</i> ponto exato, <i>on</i> dia e superfície, <i>in</i> período longo e espaço fechado.",""],["A1","prescont","Presente contínuo","Present continuous","ok",["m:present/continuo"],"Ação em curso agora ou fase temporária: <i>be</i> + verbo com <b>-ing</b>. Verbos de estado (<i>know, want</i>) não costumam ir para o contínuo.",""],["A1","freq","Advérbios de frequência","Adverbs of frequency (always, usually, never…)","ok",["s:block-posicao","m:present/simples"],"Ficam antes do verbo principal e depois do <i>be</i>. O Guia de posição mostra cada caso.",""],["A1","likeing","Gostar de + verbo","Like / love / hate + -ing","ok",["g:rinf"],"Depois de <i>enjoy, like, love, hate</i> usa-se -ing; o português usa o infinitivo (\"gosto de nadar\").",""],["A1","conj1","Ligar ideias: and, but, or, because","Basic linking words (and, but, or, because)","ok",["g:adit","g:adv","g:alt","g:caus"],"Quatro conectores bastam para falar em frases longas. Cada um tem um cartão com exemplos do motor.",""],["A1","numbers","Números, datas e horas","Numbers, dates and time","ok",["s:block-numeros","s:block-gatilhos"],"Cardinais, ordinais, anos, datas e horas calculados por regra, em US e UK, com áudio e treino. Em inglês, o ano lê-se em pares (<i>nineteen ninety-nine</i>).",""],["A1","objpron","Pronomes objeto","Object pronouns (me, you, him, her, it, us, them)","ok",["s:block-estruturas"],"<i>me, you, him, her, it, us, them</i> depois do verbo ou da preposição.",""],["A1","genitive","Genitivo 's","Possessive 's (Ana's book)","ok",["s:block-estruturas"],"<b>'s</b> para pessoas, <b>s'</b> para plural em -s, <i>of</i> para coisas.",""],["A1","shortans","Perguntas de sim ou não e respostas curtas","Yes/no questions and short answers","ok",["m:present/simples//pergunta","s:block-gatilhos"],"Sim/não e resposta curta (<i>Yes, she does.</i>) na aba “Respostas curtas”.",""],["A1","verbs1","Verbos do dia a dia e colocações","Everyday verbs and collocations","ok",["x","m:present/simples"],"O banco tem centenas de verbos, cada um com complementos (colocações) prontos.",""],["A2","pastsimp","Passado simples (regulares e irregulares)","Past simple","ok",["m:past/simples","s:block-ed"],"Regulares: -ed (com três pronúncias). Irregulares: formas próprias, que se aprendem em grupos.",""],["A2","pastneg","Passado: negativas e perguntas com did","Past simple negatives and questions with did","ok",["m:past/simples//negativa","m:past/simples//pergunta"],"<i>Did</i> carrega o passado; o verbo volta à forma base: <i>Did you work?</i>, nunca <i>Did you worked?</i>.",""],["A2","waswere","Was / were","Past of to be (was / were)","ok",["m:past/simples/state"],"<i>Was</i> para I/he/she/it, <i>were</i> para os demais. Pergunta e negativa sem <i>did</i>.",""],["A2","futwill","Futuro com will","Future with will","ok",["m:future/simples"],"Decisões na hora, previsões e promessas. Depois de when/if/before, o inglês usa o presente, não <i>will</i>.",""],["A2","goingto","Futuro com going to e presente contínuo futuro","Future with going to / present continuous for plans","ok",["s:block-estruturas"],"<i>will</i>, <i>going to</i>, presente contínuo e presente simples, lado a lado com a regra de uso.",""],["A2","pastcont","Passado contínuo","Past continuous","ok",["m:past/continuo"],"Ação em andamento num ponto do passado, muitas vezes interrompida por uma ação do passado simples.",""],["A2","compsuper","Comparativos e superlativos","Comparatives and superlatives","ok",["g:cmp","s:block-estruturas"],"Regra ortográfica: -er/-est, dobra de consoante, -y→-ier, more/most e irregulares.",""],["A2","manner","Advérbios de modo","Adverbs of manner (-ly)","ok",["s:block-posicao","s:block-estruturas"],"Adjetivo + -ly por regra (-y→-ily, -le→-ly, -ic→-ically) e irregulares <i>well, fast, hard</i>.",""],["A2","should","Should (conselho)","Should for advice","ok",["d:conselho"],"Não leva -s nem <i>to</i>. Para criticar o passado usa-se <i>should have</i> + particípio.",""],["A2","musthave","Must e have to (obrigação)","Must and have to (obligation)","ok",["d:obrigacao"],"<i>Must not</i> é proibição; <i>don't have to</i> é ausência de obrigação. São bem diferentes.",""],["A2","permission","Can, could e may (permissão e pedidos)","Can / could / may (permission and requests)","ok",["d:permissao"],"<i>Could</i> e <i>may</i> soam mais educados que <i>can</i>. Para pedir, a forma importa mais que o tempo.",""],["A2","countable","Contáveis e incontáveis; some, any, much, many","Countable and uncountable nouns; some, any, much, many","ok",["s:block-estruturas"],"Contável: <i>many, a few</i>; incontável: <i>much, a little</i>; ambos: <i>some, any, a lot of</i>.",""],["A2","whquant","How much, how many, how often, how long","Quantity and frequency questions","ok",["s:block-gatilhos"],"Cada uma já tem verbos próprios e respostas prontas nos gatilhos.",""],["A2","subjq","Perguntas sobre o sujeito","Subject questions (Who called?)","ok",["s:block-gatilhos","s:block-erros"],"Quando a palavra interrogativa é o sujeito, não há <i>do/does</i>; quando é objeto, há.",""],["A2","verbinf","Verbo + infinitivo com to","Verb + to-infinitive (want to, need to, decide to)","ok",["g:rinf"],"Depois de <i>want, need, decide, plan</i> usa-se <i>to</i> + verbo, e não -ing.",""],["A2","adjorder","Ordem dos adjetivos","Adjective order (opinion, size, age, colour…)","ok",["s:block-estruturas"],"Opinião · tamanho · idade · forma · cor · origem · material.",""],["A2","prep2","Preposições de movimento","Prepositions of movement (to, into, through, across…)","ok",["s:block-estruturas","x"],"<i>to, into, onto, through, across, along, over, past</i>: destino, entrada, travessia.",""],["A2","timeexp","Marcadores de tempo (yesterday, ago, last week…)","Time expressions (yesterday, ago, last week…)","ok",["s:block-adverbs-tempo"],"Cada tempo verbal tem seus marcadores; <i>ago</i> pede o passado simples.",""],["A2","therewas","There was / There were","There was / There were","ok",["s:block-estruturas"],"<i>There was / were</i> concordam com o que vem depois; no futuro, <i>there will be</i>.",""],["B1","presperf","Presente perfeito","Present perfect (have / has + past participle)","ok",["m:present/perfeito","s:block-matrix"],"Liga o passado ao presente: experiência, resultado agora, tempo que continua. Não se usa com marcadores de tempo terminado (<i>yesterday</i>).",""],["B1","forsince","For e since","For and since","ok",["m:present/perfeito","s:block-adverbs-tempo"],"<i>For</i> + duração, <i>since</i> + ponto de partida. O português usa \"há\" e \"desde\".",""],["B1","perfvspast","Presente perfeito × passado simples","Present perfect vs past simple","ok",["m:present/perfeito","m:past/simples","s:block-matrix"],"Tempo terminado e nomeado → passado simples. Tempo aberto ou sem data → presente perfeito.",""],["B1","perfcont","Presente perfeito contínuo","Present perfect continuous","ok",["m:present/perfeito_continuo"],"Ênfase na duração e na ação que ainda vem ocorrendo, ou acabou de ocorrer.",""],["B1","pastperf","Passado perfeito","Past perfect","ok",["m:past/perfeito"],"O passado do passado: a ação que aconteceu antes de outra ação passada.",""],["B1","cond01","Condicionais zero e primeira","Zero and first conditionals","ok",["g:cond","o:cond"],"Depois de <i>if</i>, presente simples, mesmo com sentido de futuro. A principal leva <i>will</i> no tipo 1.",""],["B1","cond2","Segunda condicional","Second conditional (if + past, would + base)","ok",["g:cond","o:cond"],"Situações imaginárias no presente. O passado depois de <i>if</i> não é tempo passado, é irrealidade.",""],["B1","usedto","Used to e would (hábitos passados)","Used to / would for past habits","ok",["d:habito"],"A negativa é <i>didn't use to</i>, sem -d. <i>Would</i> só para ações repetidas, não para estados.",""],["B1","passive1","Voz passiva (presente e passado simples)","Passive voice (present and past simple)","ok",["s:block-estruturas"],"<i>be</i> no tempo certo + particípio; o objeto da ativa vira sujeito e o agente (<i>by</i>) é opcional.",""],["B1","relative","Orações relativas restritivas","Defining relative clauses (who, which, that, whose)","ok",["g:rel","o:rel","g:oq"],"Dizem <b>qual</b> pessoa ou coisa. Sem vírgula. Cuidado para não confundir com a pergunta indireta (cartão de contraste na Gramática).",""],["B1","reportst","Discurso indireto: afirmações","Reported speech: statements","ok",["g:obj","s:block-estruturas"],"Recuo de tempo montado pelo motor: presente → passado, perfeito/passado → <i>had</i> + particípio, <i>will → would</i>.",""],["B1","reportq","Discurso indireto: perguntas","Reported questions","ok",["g:oq","o:oq"],"A pergunta indireta tem ordem de afirmativa; o tempo e o sujeito da pergunta se ajustam no motor.",""],["B1","gerinf","Gerúndio ou infinitivo","Gerund vs infinitive","ok",["g:rinf","g:rger","s:block-estruturas"],"Verbos que pedem -ing, os que pedem <i>to</i> e os que mudam de sentido (<i>stop, remember, try</i>).",""],["B1","deduction","Dedução e possibilidade (might, may, could, must)","Modals of possibility and deduction","ok",["d:possibilidade"],"<i>Must</i> = quase certeza; <i>might</i> = possibilidade fraca. O passado da dedução usa <i>have</i> + particípio.",""],["B1","soSuch","So … that / such … that","So… that / such… that","ok",["g:csq"],"<i>So</i> + adjetivo ou advérbio; <i>such</i> + substantivo.",""],["B1","enoughtoo","Enough e too","Enough and too","ok",["s:block-estruturas"],"<i>enough</i> depois do adjetivo e antes do substantivo; <i>too</i> = demais.",""],["B1","tags","Question tags","Question tags (isn't it? don't you?)","ok",["s:block-gatilhos"],"Aba “Respostas curtas” dos Gatilhos: frase afirmativa → tag negativa e vice-versa, repetindo o auxiliar.",""],["B1","phrasal1","Phrasal verbs comuns","Common phrasal verbs","ok",["x","m:present/simples"],"O banco tem phrasal verbs marcados e as Expressões trazem as famílias.",""],["B1","linkers","Contraste e concessão (although, however)","Contrast and concession (although, however, despite)","ok",["g:conc","g:adv"],"<i>Although</i> abre oração; <i>despite</i> pede substantivo ou -ing.",""],["B1","purpose","Finalidade (to, in order to, so that)","Purpose (to, in order to, so that)","ok",["g:final"],"<i>To</i> + verbo é a forma mais comum; <i>so that</i> pede um sujeito próprio.",""],["B1","timecl","Orações de tempo (when, while, as soon as)","Time clauses","ok",["g:temp","s:block-conj"],"Com sentido de futuro, usa-se o presente depois dessas conjunções.",""],["B1","whprep","Perguntas com preposição final","Questions with final prepositions (Who… with? What… for?)","ok",["s:block-gatilhos"],"A preposição fica no fim da pergunta em inglês falado.",""],["B1","verbobj","Verbo + objeto + infinitivo","Verb + object + infinitive (want him to go)","ok",["g:rinf"],"O objeto vem entre o verbo e o infinitivo, sem <i>that</i>.",""],["B1","depprep","Preposições dependentes","Dependent prepositions (good at, depend on)","ok",["s:block-estruturas","x"],"Verbo + preposição, extraídos do banco de expressões e agrupados por preposição.",""],["B2","pastperfcont","Passado perfeito contínuo","Past perfect continuous","ok",["m:past/perfeito_continuo"],"Duração de uma ação anterior a outra no passado.",""],["B2","futcont","Futuro contínuo e futuro perfeito","Future continuous and future perfect","ok",["m:future/continuo","m:future/perfeito","m:future/perfeito_continuo"],"Ação em curso num momento futuro, ou concluída antes dele.",""],["B2","cond3","Terceira condicional","Third conditional (if + past perfect, would have)","ok",["g:cond","o:cond"],"Arrependimento e situações impossíveis no passado.",""],["B2","mixedcond","Condicionais mistas","Mixed conditionals","ok",["s:block-estruturas"],"<i>If</i> + passado perfeito, <i>would</i> + base (passado → presente) e o inverso.",""],["B2","wish","Wish e if only","Wish / if only (wishes and regrets)","ok",["s:block-estruturas"],"<i>wish / if only</i> + passado simples (presente irreal), + passado perfeito (arrependimento), + <i>would</i> (queixa).",""],["B2","passive2","Passiva avançada (contínua, perfeita, modal)","Advanced passive (continuous, perfect, modal)","ok",["s:block-estruturas"],"Contínua (<i>is being done</i>), perfeita (<i>has been done</i>) e modal (<i>can be done</i>) montadas por regra.",""],["B2","causative","Causativa (have / get something done)","Causative (have / get something done)","ok",["s:block-estruturas"],"<i>have / get</i> + objeto + particípio, com o tempo marcado no <i>have/get</i>.",""],["B2","reportfull","Discurso indireto completo (ordens, recuo de tempo)","Reported speech: commands, backshift","ok",["g:obj","g:oq","s:block-estruturas"],"Afirmações, perguntas de sim/não (<i>asked if</i>) e ordens (<i>told me to / not to</i>), com recuo de tempo.",""],["B2","relx","Relativas explicativas","Non-defining relative clauses","ok",["g:relx","o:relx"],"Entre vírgulas, trazem informação extra. <i>That</i> não se usa aqui.",""],["B2","relred","Relativas reduzidas","Reduced relative clauses","ok",["g:rrel","o:rrel"],"Substantivo + <i>-ing</i> / particípio / <i>to</i>, no lugar de pronome + verbo.",""],["B2","participle","Orações participiais","Participle clauses (-ing / -ed)","ok",["g:rger","g:rpart","o:rger"],"Mesmo sujeito que a principal. Substituem conjunção + verbo e deixam a frase mais enxuta.",""],["B2","formalconn","Conectivos formais (nevertheless, moreover, therefore)","Formal connectors (nevertheless, moreover, therefore)","ok",["g:adit","g:cons","s:block-estruturas"],"Conectivos de abertura de frase por função, com a pontuação (; however,).",""],["B2","modalperf","Modais no passado (should have, could have, must have)","Modal perfects (should have, could have, must have)","ok",["d:conselho","d:possibilidade"],"Crítica e especulação sobre o passado.",""],["B2","cleft","Ênfase com It is… that / What… is","Cleft sentences (It was… that / What I need is…)","ok",["g:subj","g:pred","s:block-estruturas"],"<i>It is … who/that</i> e <i>What … is</i> destacam o foco da frase.",""],["B2","nounclauses","Orações substantivas","Noun clauses (that / if / wh- clauses)","ok",["g:obj","g:oq","g:subj","g:pred","g:cn","g:ap","g:oi"],"Fazem papel de substantivo: objeto, sujeito, complemento. O mapa da Gramática mostra todas.",""],["B2","quantadv","Quantificadores avançados (both, either, neither, each, all)","Advanced quantifiers (both, either, neither, each, all)","ok",["s:block-estruturas"],"<i>both, either, neither, each, all</i> e a concordância verbal.",""],["B2","artadv","Artigos avançados e zero artigo","Advanced articles and the zero article","ok",["s:block-estruturas"],"Artigo zero em generalizações e <i>the</i> com mares, cadeias de montanhas e únicos.",""],["B2","comparison","Estruturas comparativas (the more… the more; as… as)","Comparative structures","ok",["g:prop","g:cmp"],"Proporção e igualdade, com exemplos do motor.",""],["B2","advpos","Posição dos advérbios","Adverb placement","ok",["s:block-posicao"],"Início, meio ou fim da frase muda o efeito e a ênfase.",""],["B2","usedtoget","Be used to / get used to","Be used to / get used to + -ing","ok",["s:block-estruturas"],"<i>be/get used to</i> + -ing (acostumado) contra <i>used to</i> + base (hábito passado).",""],["B2","condalt","Condicionais alternativas (unless, as long as, provided)","Conditional alternatives (unless, as long as, provided that)","ok",["g:cond"],"<i>Unless</i> = <i>if not</i>. O cartão da condicional lista as conjunções.",""],["B2","prepgerund","Preposição + -ing","Preposition + gerund","ok",["g:rger"],"Depois de preposição, sempre -ing. O português usa o infinitivo.",""],["B2","collocations","Colocações e coocorrências","Collocations","ok",["m:present/simples","x"],"O motor de colocações é o coração do app: verbo + complemento natural.",""],["C1","inversion","Inversão após advérbios negativos","Inversion after negative adverbs (Never have I…, Not only…)","ok",["s:block-estruturas"],"<i>Never have I…, Not only do I…, Rarely do I…</i>: auxiliar antes do sujeito.",""],["C1","mandative","Subjuntivo mandativo","Mandative subjunctive (It's essential that he be…)","ok",["s:block-estruturas"],"Verbo na forma base depois de <i>essential, suggest, insist</i>.",""],["C1","futpast","Futuro no passado","Future in the past (was going to, would)","ok",["s:block-estruturas"],"<i>was going to / would</i>: o futuro visto do passado.",""],["C1","ellipsis","Elipse e substituição (So do I, Neither do I)","Ellipsis and substitution (So do I, Neither do I)","ok",["s:block-gatilhos"],"<i>So do I</i> concorda no positivo, <i>Neither do I</i> no negativo; a aba “Respostas curtas” monta ambos pelo auxiliar da frase.",""],["C1","emphdo","Ênfase com do","Emphatic do (I do like it)","ok",["s:block-estruturas"],"<i>do/does/did</i> + base para reforçar: <i>I do like it</i>.",""],["C1","passiverep","Passivas de relato (It is said that…)","Reporting passives (It is said that…)","ok",["s:block-estruturas"],"<i>It is said that…</i> e <i>She is said to…</i>.",""],["C1","whsubject","Orações com wh como sujeito","Wh-clauses as subject (What happened was…)","ok",["g:oq","g:subj","s:block-estruturas"],"<i>What happened was…</i>: oração com wh- funcionando como sujeito.",""],["C1","cnominal","Completiva nominal e apositiva","Noun complement and appositive clauses","ok",["g:cn","g:ap"],"O substantivo abstrato pede a oração: <i>the idea that…, one goal: to…</i>.",""],["C1","hedging","Atenuação e marcadores de discurso","Hedging and discourse markers","ok",["x","s:block-estruturas"],"Atenuação (<i>I think, it seems, sort of</i>) e marcadores (<i>well, actually, anyway</i>).",""],["C1","register","Registro formal e informal","Formal and informal register","ok",["s:block-gramatica","s:block-estruturas"],"Espelho informal → formal (<i>get → obtain</i>) além da etiqueta de registro de cada oração.",""],["C1","phrasaladv","Phrasal verbs avançados e idiomas","Advanced phrasal verbs and idioms","ok",["x"],"Famílias de expressões com tradução, nota e agrupamento semântico.",""],["C1","synant","Sinônimos, antônimos e famílias de palavras","Synonyms, antonyms and word families","ok",["x","s:block-adverbs-tempo"],"Os verbos trazem sinônimos e antônimos; as famílias de palavras mostram a derivação.",""],["C2","fronting","Ordem marcada e topicalização","Fronting and marked word order","ok",["s:block-estruturas"],"Elemento deslocado para o início, com inversão quando o advérbio é negativo.",""],["C2","wereSubj","Subjuntivo were e inversão condicional","Were-subjunctive and conditional inversion (Were it not for…)","ok",["s:block-estruturas"],"<i>If I were…</i> e a inversão formal <i>Were it not for…</i>.",""],["C2","modalnuance","Nuances modais (would rather, had better, be bound to)","Modal nuance (would rather, had better, be bound to)","ok",["d:conselho","d:obrigacao","s:block-estruturas"],"<i>would rather, had better, be bound to</i> com a forma do verbo escolhido.",""],["C2","cohesion","Coesão do discurso","Discourse cohesion (reference, substitution, linking)","ok",["s:block-paragrafos","s:block-estruturas"],"Retomada (<i>this, that</i>), substituição e conectores de reformulação.",""],["C2","stylistic","Variação de estilo (reduzida × desenvolvida)","Stylistic variation (reduced vs full clauses)","ok",["s:block-gramatica"],"A seção Estilo mostra o efeito de cada combinação de famílias de oração.",""],["C2","pragmatics","Polidez e indireção","Politeness and indirectness","ok",["d:permissao","g:oq","s:block-estruturas"],"Gradação de polidez: ordem → <i>can</i> → <i>could</i> → <i>would you mind</i>.",""],["C2","prosody","Tonicidade, entonação e fala conectada","Stress, intonation and connected speech","ok",["s:block-estruturas"],"Acento de frase (conteúdo × função), entonação ↗ ↘ e fala conectada (<i>wanna, gonna</i>).",""],["C2","spelling","Ortografia: regras de -ing, -ed e -s","Spelling rules (-ing, -ed, -s)","ok",["s:block-fon","s:block-ed","s:block-estruturas"],"-ing, -ed e -s do verbo escolhido, por regra (corta -e, dobra consoante).",""],["C2","ipa","IPA americano e britânico","IPA: American and British","ok",["s:block-fon","s:block-ed"],"Todo o vocabulário tem transcrição US e UK, com áudio.",""]];
const TRILHA_DEST = {"N1":["Nova seção \"Substantivos e determinantes\"","Artigos, plural, possessivos, demonstrativos, contáveis, quantificadores, pronomes objeto, genitivo e ortografia. Em Referência, perto de Anatomia da frase; o complemento da colocação vira dial de determinante (a / an / the / zero)."],"N2":["Nova seção \"Adjetivos e advérbios: graus e ordem\"","Comparativo/superlativo, ordem dos adjetivos, enough/too e advérbios de modo. Em Referência, depois da nova seção de substantivos."],"N3":["Nova seção \"Preposições\"","Tempo, lugar, movimento e preposições dependentes de verbos e adjetivos, a partir das colocações que já existem no banco."],"N4":["Nova seção \"Números, datas e horas\"","Leitura de cardinais, ordinais, anos, datas e horários, ligada aos gatilhos When e What time."],"M1":["Motor (Tempos): novo dial \"Voz\" ativa / passiva","Maior lacuna estrutural: dial extra que combina com tempo, aspecto, formato e modais; liberaria passiva avançada e passiva de relato."],"M2":["Motor: formato Imperativo","Quarto formato além de afirmativa, negativa e pergunta: imperativo, don't + verbo e let's."],"M3":["Motor: modos de futuro","Escolha entre will, going to e presente contínuo futuro, com a regra de uso ao lado do resultado."],"M4":["Motor: categoria existencial","There is / There are / There was / There were, com negativa e pergunta, ao lado de fato e estado."],"M5":["Motor: causativa","Have/get + objeto + particípio, apoiada no dial de voz."],"O1":["Orações compostas: novos tipos","Optativa (wish / if only), condicional mista, be used to, verbos que mudam de sentido (gerúndio × infinitivo), conectivos formais e wh como sujeito."],"O2":["Discurso indireto com recuo de tempo","Tipo próprio que recua os tempos (will → would, presente → passado) e traz ordens; aproveita o tempo próprio já existente na pergunta indireta."],"G1":["Gatilhos de resposta: respostas curtas e fala natural","Respostas curtas, question tags, So do I / Neither do I, atenuação, polidez e coesão, no padrão do reflexo cronometrado."],"E1":["Nova seção \"Ênfase e ordem marcada\"","Inversão, clivagem, do enfático, fronting, subjuntivo e registro formal."],"F1":["Fonética: tonicidade e entonação","Acento de frase, entonação e fala conectada, ao lado de Pronúncia do -ed e Regras fonéticas."]};
const TRILHA_NIVEIS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TRILHA_NIVEL_NOME = { A1:'Iniciante', A2:'Básico', B1:'Intermediário', B2:'Intermediário superior', C1:'Avançado', C2:'Proficiente' };
const TRILHA_ST = { ok:{ ic:'✅', nome:'Coberto', cor:'var(--teal)' }, parc:{ ic:'🟡', nome:'Parcial', cor:'var(--amber)' }, falta:{ ic:'🔴', nome:'Falta', cor:'var(--red)' } };
const TRILHA_KEY = 'pm_trilha';
const trilha = { nivel:null, st:null, q:'', est:{} };
try { trilha.est = JSON.parse(localStorage.getItem(TRILHA_KEY) || '{}') || {}; } catch(e){ trilha.est = {}; }
const trilhaSalva = () => { try { localStorage.setItem(TRILHA_KEY, JSON.stringify(trilha.est)); } catch(e){} };
const trilhaNorm = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const TRILHA_TEMPO = { present:'Presente', past:'Passado', future:'Futuro' };
const TRILHA_ASP = { simples:'simples', continuo:'contínuo', perfeito:'perfeito', perfeito_continuo:'perfeito contínuo' };
const TRILHA_FMT = { negativa:'negativa', pergunta:'pergunta', pergunta_negativa:'pergunta negativa' };
/* rótulo e ícone de uma ligação */
function trilhaRot(tok){
  const [tp, arg] = [tok.split(':')[0], tok.slice(tok.indexOf(':') + 1)];
  if(tp === 'm'){ const [t, a, c, f] = arg.split('/');
    return '⚙️ Motor: ' + [TRILHA_TEMPO[t], TRILHA_ASP[a], c === 'state' ? 'to be' : '', TRILHA_FMT[f] || ''].filter(Boolean).join(' · '); }
  if(tp === 'g') return '🌳 Gramática: ' + ((GRAM_TIPOS[arg] || {}).nome || arg);
  if(tp === 'o') return '⚙️ Motor com 2ª oração: ' + ((GRAM_TIPOS[arg] || {}).nome || arg);
  if(tp === 'd') return '🗣️ Modais: ' + ((MODAL_ENGINE[arg] || {}).label || arg);
  if(tp === 's'){ const r = REF_MENU.find(x => x[0] === arg); return (r ? r[1] + ' ' + r[2] : arg); }
  if(tok === 'p') return '🎯 Praticar';
  if(tok === 'x') return '🗃️ Expressões';
  return tok;
}
const trilhaRola = (el, off) => { if(!el) return; window.scrollTo({ top:Math.max(0, el.getBoundingClientRect().top + window.scrollY - (off || 70)), behavior:REDUZ() ? 'auto' : 'smooth' }); };
function trilhaIr(tok){
  const tp = tok.split(':')[0], arg = tok.slice(tok.indexOf(':') + 1);
  const abre = id => { const b = document.getElementById(id); if(b && b.dataset.open !== 'true') toggleBlock(id); return b; };
  if(tp === 'm'){ const [t, a, c, f] = arg.split('/');
    state.tempo = t; state.categoria = c === 'state' ? 'state' : 'fact';
    state.aspecto = (CATEGORIES[state.categoria].aspects.includes(a)) ? a : CATEGORIES[state.categoria].aspects[0];
    state.formato = f || 'afirmativa'; if(!/^pergunta/.test(state.formato)) state.whWord = null;
    render(); trilhaRola(document.querySelector('#console-tempos .readout') || document.getElementById('console-tempos'), 140); algoAviso('Aberto no motor'); return; }
  if(tp === 'o'){ o2UsarNoMotor(arg); trilhaRola(document.querySelector('#console-tempos .readout') || document.getElementById('console-tempos'), 140); return; }
  if(tp === 'g'){ abre('block-gramatica'); setTimeout(() => { const d = document.getElementById('gr-t-' + arg); if(d){ d.hidden = false; d.open = true; trilhaRola(d, 90); } }, 120); return; }
  if(tp === 'd'){ if(MODAL_ENGINE[arg]){ modalState.funcao = arg; if(!MODAL_ENGINE[arg].tempos.some(t => t.key === modalState.tempo)) modalState.tempo = MODAL_ENGINE[arg].tempos[0].key; buildModalGrid(); renderModal(); }
    trilhaRola(document.getElementById('console-modais'), 70); return; }
  if(tp === 's'){ const b = abre(arg); setTimeout(() => trilhaRola(b, 70), 120); return; }
  if(tok === 'p'){ trilhaRola(document.getElementById('console-pratica'), 70); return; }
  if(tok === 'x'){ trilhaRola(document.getElementById('console-expressoes'), 70); return; }
}
/* ---- v169: REPETIÇÃO ESPAÇADA (Leitner) na Trilha ----
   Cada assunto estudado guarda { t: último contato, b: caixa 1..5 }. O próximo contato vence em INT[b-1] dias:
   acertar sobe de caixa (intervalo cresce); "esqueci" volta à caixa 1. O valor antigo (1) vira caixa 1 vencida hoje. */
const TRILHA_INT = [1, 3, 7, 14, 30], TRILHA_DIA = 86400000;
const trEst = id => { const v = trilha.est[id]; if(!v) return null; return typeof v === 'object' ? v : { t:0, b:1 }; };
const trVence = id => { const e = trEst(id); return e ? e.t + TRILHA_INT[Math.min(4, Math.max(0, e.b - 1))] * TRILHA_DIA : null; };
const trDevido = id => { const v = trVence(id); return v !== null && v <= Date.now(); };
function trRotaHTML(){
  const L = trilhaLinhas(), devidos = L.filter(x => trilha.est[x.id] && trDevido(x.id)).slice(0, 4);
  const novos = L.filter(x => !trilha.est[x.id] && x.st === 'ok').slice(0, 3), est = L.filter(x => trilha.est[x.id]);
  const caixas = [1, 2, 3, 4, 5].map(b => est.filter(x => trEst(x.id).b === b).length);
  const btn = x => `<button type="button" class="signal-chip tr-lk" data-tr-abre="${x.id}">${x.n} · ${x.pt}</button>`;
  return `<div class="tr-rota"><div class="tr-rota-t">📅 Rota de hoje <small>repetição espaçada · caixas 1–5: ${caixas.join(' · ')}</small></div>
    <div class="tr-rota-l"><b>🔁 Revisar (${devidos.length ? devidos.length + (est.filter(x => trDevido(x.id)).length > devidos.length ? '+' : '') : '0'})</b> ${devidos.length ? devidos.map(btn).join(' ') : '<i>nada vencido — bom ritmo</i>'}</div>
    <div class="tr-rota-l"><b>🆕 Próximos</b> ${novos.length ? novos.map(btn).join(' ') : '<i>tudo estudado</i>'}</div></div>`;
}
const trilhaLinhas = () => TRILHA_DADOS.map(r => ({ n:r[0], id:r[1], pt:r[2], en:r[3], st:r[4], lk:r[5], nota:r[6], dest:r[7] }));
function trilhaFiltrada(){
  const q = trilhaNorm(trilha.q.trim());
  return trilhaLinhas().filter(x => (!trilha.nivel || x.n === trilha.nivel) && (!trilha.st || x.st === trilha.st) && (!q || trilhaNorm(x.pt + ' ' + x.en + ' ' + x.nota).includes(q)));
}
function trilhaItemHTML(x){
  const S = TRILHA_ST[x.st], D = TRILHA_DEST[x.dest], est = !!trilha.est[x.id];
  const links = x.lk.length ? x.lk.map(k => `<button type="button" class="signal-chip tr-lk" data-tr-ir="${k}">${escapeHTML(trilhaRot(k))}</button>`).join(' ') : '<i>Ainda não há um lugar no app para este assunto.</i>';
  return `<details class="gr-t tr-it" id="tr-${x.id}" data-id="${x.id}" data-st="${x.st}" style="--gf:${S.cor}">
    <summary><span class="gr-t-ic" title="${S.nome}">${S.ic}</span><span class="gr-t-main"><b>${x.pt}</b><small lang="en">${x.en}</small></span>
      <span class="gr-t-meta"><span class="tr-nv">${x.n}</span><span class="tr-ok" data-ok="${est}">${est ? (trDevido(x.id) ? '🔁 revisar' : '✔ estudado · caixa ' + trEst(x.id).b) : ''}</span></span></summary>
    <div class="gr-t-body">
      <div class="gr-row"><div class="gr-lab">Em resumo</div><div class="gr-val">${x.nota}</div></div>
      <div class="gr-row"><div class="gr-lab">No app</div><div class="gr-val"><div class="tr-links">${links}</div></div></div>
      ${D ? `<div class="gr-row"><div class="gr-lab">${x.st === 'falta' ? 'Onde encaixar' : 'Para completar'}</div><div class="gr-val"><b>${D[0]}</b><br><span class="tr-pl">${D[1]}</span></div></div>` : ''}
      <div class="gr-acts">${est ? `<button type="button" class="signal-chip" data-tr-rev="${x.id}">✓ revisei (sobe de caixa)</button><button type="button" class="signal-chip" data-tr-esq="${x.id}">↺ esqueci (volta à caixa 1)</button>` : ''}<button type="button" class="signal-chip tr-est" data-tr-est="${x.id}">${est ? '↩ desmarcar' : '☐ marcar como estudado'}</button></div>
    </div></details>`;
}
function trilhaPlanoHTML(){
  const grupos = {}; trilhaLinhas().filter(x => x.st !== 'ok').forEach(x => { (grupos[x.dest] = grupos[x.dest] || []).push(x); });
  const ks = Object.keys(grupos).sort((a, b) => grupos[b].length - grupos[a].length);
  const total = ks.reduce((n, k) => n + grupos[k].length, 0);
  if(!total) return `<div class="num-reg">✅ Nada falta no sumário: todos os assuntos têm explicação e exemplo no app. Novas lacunas voltam a aparecer aqui.</div>`;   /* v168 */
  return `<details class="gr-t tr-plano" style="--gf:var(--red)"><summary><span class="gr-t-ic">🧩</span><span class="gr-t-main"><b>Plano: o que falta e onde encaixar</b><small>${total} assuntos em ${ks.length} frentes, da maior para a menor</small></span></summary>
    <div class="gr-t-body">${ks.map(k => `<div class="tr-gp"><div class="tr-gp-t"><b>${TRILHA_DEST[k][0]}</b> <span class="tr-gp-n">${grupos[k].length}</span></div><p class="gr-p">${TRILHA_DEST[k][1]}</p>
      <div class="tr-links">${grupos[k].map(x => `<button type="button" class="signal-chip" data-tr-abre="${x.id}" style="border-color:${TRILHA_ST[x.st].cor}">${x.n} · ${x.pt}</button>`).join(' ')}</div></div>`).join('')}</div></details>`;
}
function trilhaResumoHTML(){
  const L = trilhaLinhas(), n = st => L.filter(x => x.st === st).length, est = L.filter(x => trilha.est[x.id]).length;
  const por = TRILHA_NIVEIS.map(nv => { const l = L.filter(x => x.n === nv), ok = l.filter(x => x.st === 'ok').length; return { nv, tot:l.length, ok }; });
  return `<div class="tr-stats"><span><b>${L.length}</b> assuntos</span><span style="color:var(--teal)">✅ <b>${n('ok')}</b> cobertos</span><span style="color:var(--amber)">🟡 <b>${n('parc')}</b> parciais</span><span style="color:var(--red)">🔴 <b>${n('falta')}</b> faltam</span><span>✔ <b id="trEstN">${est}</b> estudados</span></div>
    <div class="tr-niv">${por.map(x => `<div class="tr-nv-c" title="${TRILHA_NIVEL_NOME[x.nv]}"><b>${x.nv}</b><span class="tr-bar"><i style="width:${Math.round(100 * x.ok / x.tot)}%"></i></span><small>${x.ok}/${x.tot}</small></div>`).join('')}</div>`;
}
function trilhaRender(){
  const el = document.getElementById('trilhaWrap'); if(!el) return;
  const foco = document.activeElement && document.activeElement.id === 'trilhaBusca';
  const itens = trilhaFiltrada();
  const chip = (cls, dado, val, txt, ativo) => `<button type="button" class="gr-idx-b ${cls}" data-${dado}="${val}" aria-pressed="${ativo}"${ativo ? ' style="color:var(--brass); border-color:var(--brass)"' : ''}>${txt}</button>`;
  const corpo = TRILHA_NIVEIS.map(nv => { const l = itens.filter(x => x.n === nv); if(!l.length) return '';
    return `<section class="tr-lv" id="tr-lv-${nv}"><h3 class="gr-h"><span>${nv}</span>${TRILHA_NIVEL_NOME[nv]} <small class="tr-lv-n">${l.length}</small></h3>${l.map(trilhaItemHTML).join('')}</section>`; }).join('');
  el.innerHTML = trilhaResumoHTML() + trRotaHTML() + trilhaPlanoHTML() +
    `<div class="tr-filtros"><div class="gr-idx" role="group" aria-label="Nível">${chip('tr-f', 'tr-nivel', '', 'Todos', !trilha.nivel)}${TRILHA_NIVEIS.map(nv => chip('tr-f', 'tr-nivel', nv, nv, trilha.nivel === nv)).join('')}</div>
      <div class="gr-idx" role="group" aria-label="Situação">${chip('tr-f', 'tr-st', '', 'Qualquer situação', !trilha.st)}${Object.keys(TRILHA_ST).map(k => chip('tr-f', 'tr-st', k, TRILHA_ST[k].ic + ' ' + TRILHA_ST[k].nome, trilha.st === k)).join('')}</div>
      <input type="search" id="trilhaBusca" class="tr-busca" placeholder="Buscar em português ou inglês…" autocomplete="off" value="${escapeHTML(trilha.q)}"></div>
    <div class="gr-acts"><button type="button" class="signal-chip" data-tr-todos="1">abrir todos</button><button type="button" class="signal-chip" data-tr-todos="0">recolher todos</button><span class="tr-cont">${itens.length} de ${TRILHA_DADOS.length}</span></div>
    ${corpo || '<p class="gr-p"><i>Nenhum assunto com esse filtro.</i></p>'}`;
  const b = document.getElementById('trilhaBusca'); if(b){ b.oninput = () => { trilha.q = b.value; trilhaRender(); }; if(foco){ b.focus(); b.setSelectionRange(b.value.length, b.value.length); } }
}
(function trilhaEventos(){
  const el = document.getElementById('trilhaWrap'); if(!el) return;
  el.addEventListener('click', e => { const t = e.target;
    const ir = t.closest('[data-tr-ir]'); if(ir){ trilhaIr(ir.dataset.trIr); return; }
    const nv = t.closest('[data-tr-nivel]'); if(nv){ trilha.nivel = nv.dataset.trNivel || null; trilhaRender(); return; }
    const st = t.closest('[data-tr-st]'); if(st){ trilha.st = st.dataset.trSt || null; trilhaRender(); return; }
    const td = t.closest('[data-tr-todos]'); if(td){ el.querySelectorAll('details.tr-it').forEach(d => { d.open = td.dataset.trTodos === '1'; }); return; }
    const ab = t.closest('[data-tr-abre]'); if(ab){ trilha.nivel = null; trilha.st = null; trilha.q = ''; trilhaRender(); const d = document.getElementById('tr-' + ab.dataset.trAbre); if(d){ d.open = true; trilhaRola(d, 90); } return; }
    const es = t.closest('[data-tr-est]'), rv = t.closest('[data-tr-rev]'), eq = t.closest('[data-tr-esq]');
    if(es || rv || eq){
      const alvo = es || rv || eq, id = alvo.dataset.trEst || alvo.dataset.trRev || alvo.dataset.trEsq, cur = trEst(id);
      if(es){ if(trilha.est[id]) delete trilha.est[id]; else trilha.est[id] = { t:Date.now(), b:1 }; }
      else if(rv){ trilha.est[id] = { t:Date.now(), b:Math.min(5, (cur ? cur.b : 0) + 1) }; }
      else { trilha.est[id] = { t:Date.now(), b:1 }; }
      trilhaSalva();
      const abertos = [...el.querySelectorAll('details.tr-it[open]')].map(d => d.id), y = window.scrollY;
      trilhaRender(); abertos.forEach(a => { const d = document.getElementById(a); if(d) d.open = true; }); window.scrollTo(0, y);
    }
  });
})();
/* ---- v164: RESPOSTAS CURTAS, TAGS E "SO DO I" (aba dos Gatilhos) ----
   Tudo sai do motor: o auxiliar de cada tempo e aspecto é a primeira palavra da PERGUNTA que o próprio motor monta
   (Does / Did / Will / Is / Has…). Daí se derivam a tag, as respostas curtas e a concordância. */
let gatCur = { v:'work', p:'She', ta:'present/simples', f:'afirmativa' };
const GAT_TA = [['present/simples', 'presente simples'], ['past/simples', 'passado simples'], ['future/simples', 'futuro (will)'], ['present/continuo', 'presente contínuo'], ['past/continuo', 'passado contínuo'],
  ['present/perfeito', 'presente perfeito'], ['past/perfeito', 'passado perfeito'], ['future/perfeito', 'futuro perfeito'], ['present/perfeito_continuo', 'presente perfeito contínuo']];
const GAT_NEG = { does:"doesn't", did:"didn't", do:"don't", will:"won't", is:"isn't", are:"aren't", was:"wasn't", were:"weren't", has:"hasn't", have:"haven't", had:"hadn't", am:"aren't", would:"wouldn't", can:"can't" };
function gatCurtas(c){
  const [t, a] = c.ta.split('/'), v = verbById(c.v), pv = gatPrV(v.id, c.p);
  const txt = (f, pr) => stripMarks(generate('fact', t, a, f, pr, v).text).trim();
  const ptx = (f, pr) => { let r = ''; try { r = translate('fact', t, a, f, pr, null, [], v.id, null, null); } catch(e){} return r.replace(/[.?!]\s*$/, ''); };
  const low = pr => pr === 'I' ? 'I' : pr.toLowerCase(), cap = x => x.charAt(0).toUpperCase() + x.slice(1);
  const aux = pr => txt('pergunta', pr).split(' ')[0].toLowerCase();
  const negA = (A, pr) => (A === 'am' && pr === 'I') ? "I'm not" : low(pr) + ' ' + (GAT_NEG[A] || A + ' not');
  const A = aux(pv), pos = c.f === 'afirmativa';
  const base = txt(c.f, pv), basePT = ptx(c.f, pv);
  const out = [];
  out.push({ tit:'Frase base', en:base + '.', pt:basePT + '.', nota:'O ponto de partida, montado pelo motor.' });
  /* tag: polaridade invertida, repete o auxiliar */
  const tag = pos ? (GAT_NEG[A] || A + ' not') + ' ' + low(pv) : A + ' ' + low(pv);
  out.push({ tit:'Question tag', en:base + ', ' + tag + '?', pt:basePT + ', né?', nota:(pos ? 'Frase afirmativa → tag <b>negativa</b>' : 'Frase negativa → tag <b>positiva</b>') + '. A tag repete o auxiliar (<i>' + A + '</i>) e o sujeito, em pronome.' });
  /* pergunta de sim ou não e respostas curtas */
  const pa = { You:'I', I:'You' }[pv] || pv, Ap = aux(pa);
  out.push({ tit:'Pergunta de sim ou não', en:txt('pergunta', pv) + '?', pt:ptx('pergunta', pv) + '?', nota:'O auxiliar vai para o começo: <i>' + cap(A) + '</i>.' });
  out.push({ tit:'Resposta curta: sim', en:'Yes, ' + low(pa) + ' ' + Ap + '.', pt:'Sim, ' + ptx('afirmativa', pa).replace(/^./, m => m.toLowerCase()) + '.', nota:'Só o auxiliar, sem repetir o verbo. Em <i>Yes, I do</i> não existe contração.' });
  out.push({ tit:'Resposta curta: não', en:'No, ' + negA(Ap, pa) + '.', pt:'Não, ' + ptx('negativa', pa).replace(/^./, m => m.toLowerCase()) + '.', nota:'A negativa contrai o auxiliar com <i>not</i>.' });
  /* concordar e discordar: So do I / Neither do I */
  const R = pv === 'I' ? 'You' : 'I', Ar = aux(R), ptR = R === 'I' ? 'Eu' : 'Você';
  out.push({ tit:pos ? 'Concordar (So…)' : 'Concordar (Neither…)', en:(pos ? 'So ' : 'Neither ') + Ar + ' ' + low(R) + '.', pt:ptR + ' também' + (pos ? '' : ' não') + '.', nota:(pos ? '<i>So</i>' : '<i>Neither</i>') + ' + auxiliar + sujeito: a ordem inverte, como numa pergunta.' });
  out.push({ tit:'Discordar', en:cap(pos ? negA(Ar, R) : low(R) + ' ' + Ar) + '.', pt:ptR + (pos ? ' não' : ' sim') + '.', nota:'Polaridade oposta à da frase base.' });
  return out;
}
function gatCurtasHTML(){
  const ids = ['work', 'go', 'eat', 'write', 'read', 'study', 'live', 'need', 'want', 'like', 'know', 'buy', 'call', 'help', 'meet', 'play', 'leave', 'arrive', 'speak', 'drive', 'take', 'use'].filter(i => verbById(i).id === i);
  const sel = (id, lista, atual) => `<select id="${id}">${lista.map(x => { const [v, n] = Array.isArray(x) ? x : [x, x]; return `<option value="${v}"${v === atual ? ' selected' : ''}>${n}</option>`; }).join('')}</select>`;
  let linhas = []; try { linhas = gatCurtas(gatCur); } catch(e){ linhas = []; }
  return `<p class="ed-nota">Perguntas de sim ou não pedem respostas rápidas. Escolha o verbo, o sujeito e o tempo: o motor mostra a tag, as respostas curtas e como concordar ou discordar.</p>
    <div class="gat-ctl"><label>verbo ${sel('gatCV', ids, gatCur.v)}</label><label>sujeito ${sel('gatCP', GAT_PR, gatCur.p)}</label><label>tempo ${sel('gatCT', GAT_TA, gatCur.ta)}</label><label>frase ${sel('gatCF', [['afirmativa', 'afirmativa'], ['negativa', 'negativa']], gatCur.f)}</label></div>
    <div class="gat-bat" id="gatCurLista">${linhas.map(x => `<div class="gat-ex" data-en="${escapeHTML(x.en)}"><span class="gat-en"><b class="gat-cu-t">${x.tit}</b><br>${escapeHTML(x.en)}</span><span class="gat-pt">${escapeHTML(x.pt)}</span><span class="gat-ab">${btnAud(x.en)}</span></div><p class="ed-nota gat-cu-n">${x.nota}</p>`).join('')}</div>`;
}
document.addEventListener('change', e => { const id = e.target && e.target.id; if(!/^gatC[VPTF]$/.test(id || '')) return;
  const k = { gatCV:'v', gatCP:'p', gatCT:'ta', gatCF:'f' }[id]; gatCur[k] = e.target.value;
  const l = document.getElementById('gatCurLista'); if(l){ const h = gatCurtasHTML(), d = document.createElement('div'); d.innerHTML = h; l.innerHTML = d.querySelector('#gatCurLista').innerHTML; } });
/* ---- v164: NÚMEROS, DATAS E HORAS ---- algoritmos de leitura (inglês US/UK e português), sem frases digitadas */
const NM_EN1 = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const NM_EN10 = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const NM_ENG = [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
function nmEnAbaixo(n, uk){   /* 0 < n < 1000 */
  const c = Math.floor(n / 100), r = n % 100, out = [];
  if(c) out.push(NM_EN1[c] + ' hundred');
  if(r){ const dz = r < 20 ? NM_EN1[r] : NM_EN10[Math.floor(r / 10)] + (r % 10 ? '-' + NM_EN1[r % 10] : ''); out.push((c && uk ? 'and ' : '') + dz); }
  return out.join(' ');
}
function nmEn(n, uk){
  if(n === 0) return 'zero';
  const partes = []; let resto = n;
  NM_ENG.forEach(([v, nome]) => { const q = Math.floor(resto / v); if(q){ partes.push(nmEnAbaixo(q, uk) + ' ' + nome); resto %= v; } });
  if(resto){ const t = nmEnAbaixo(resto, uk); partes.push(uk && partes.length && resto < 100 ? 'and ' + t : t); }
  return partes.join(' ');
}
const NM_PT1 = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez','onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito','dezenove'];
const NM_PT10 = ['','','vinte','trinta','quarenta','cinquenta','sessenta','setenta','oitenta','noventa'];
const NM_PT100 = ['','cento','duzentos','trezentos','quatrocentos','quinhentos','seiscentos','setecentos','oitocentos','novecentos'];
function nmPtAbaixo(n, fem){   /* 0 < n < 1000 */
  if(n === 100) return 'cem';
  const c = Math.floor(n / 100), r = n % 100, out = [];
  const f = x => fem ? ({ um:'uma', dois:'duas' }[x] || x) : x;
  if(c) out.push(fem && c >= 2 ? NM_PT100[c].replace(/os$/, 'as') : NM_PT100[c]);
  if(r) out.push(r < 20 ? f(NM_PT1[r]) : NM_PT10[Math.floor(r / 10)] + (r % 10 ? ' e ' + f(NM_PT1[r % 10]) : ''));
  return out.join(' e ');
}
function nmPt(n, fem){
  if(n === 0) return 'zero';
  const grupos = [[1e9, 'bilhão', 'bilhões', false], [1e6, 'milhão', 'milhões', false], [1e3, 'mil', 'mil', true]], partes = []; let resto = n;
  grupos.forEach(([v, s, p, mil]) => { const q = Math.floor(resto / v); if(!q) return; resto %= v;
    partes.push(v === 1e3 ? (q === 1 ? 'mil' : nmPtAbaixo(q, true) + ' mil') : nmPtAbaixo(q, false) + ' ' + (q === 1 ? s : p)); });
  let t = partes.join(partes.length > 1 ? ', ' : '');
  if(resto){ const u = nmPtAbaixo(resto, fem); t += (partes.length ? (resto < 100 || resto % 100 === 0 ? ' e ' : ' ') : '') + u; }
  return t;
}
const NM_ORD_EN = { one:'first', two:'second', three:'third', five:'fifth', eight:'eighth', nine:'ninth', twelve:'twelfth' };
function nmOrdEn(n, uk){
  const w = nmEn(n, uk).split(/([ -])/); let ult = w.length - 1; const u = w[ult];
  w[ult] = NM_ORD_EN[u] || (/y$/.test(u) ? u.replace(/y$/, 'ieth') : u + 'th'); return w.join('');
}
const nmSufixo = n => { const r = n % 100; if(r >= 11 && r <= 13) return n + 'th'; return n + ({ 1:'st', 2:'nd', 3:'rd' }[n % 10] || 'th'); };
const NM_PT_ORD1 = ['', 'primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'sexto', 'sétimo', 'oitavo', 'nono'];
const NM_PT_ORD10 = ['', 'décimo', 'vigésimo', 'trigésimo', 'quadragésimo', 'quinquagésimo', 'sexagésimo', 'septuagésimo', 'octogésimo', 'nonagésimo'];
function nmOrdPt(n){   /* 1..99 */
  if(n < 1 || n > 99) return '';
  const d = Math.floor(n / 10), u = n % 10; return [NM_PT_ORD10[d], NM_PT_ORD1[u]].filter(Boolean).join(' ');
}
function nmAnoEn(y, uk){
  if(y < 1100 || y > 2999) return nmEn(y, uk);
  if(y >= 2000 && y <= 2009) return y === 2000 ? 'two thousand' : 'two thousand ' + (uk ? 'and ' : '') + NM_EN1[y - 2000];
  const a = Math.floor(y / 100), b = y % 100;
  if(b === 0) return nmEn(a, uk) + ' hundred';
  return nmEn(a, uk) + ' ' + (b < 10 ? 'oh ' + NM_EN1[b] : nmEn(b, uk));
}
const NM_MES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const NM_MES_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const NM_DIA_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const NM_DIA_PT = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
function nmData(a, m, d, uk){   /* m: 0..11 */
  const wd = new Date(a, m, d).getDay(), anoEn = nmAnoEn(a, uk);
  const lista = [];
  if(uk){ lista.push({ rot:'Escrita', en:NM_DIA_EN[wd] + ' ' + nmSufixo(d) + ' ' + NM_MES_EN[m] + ' ' + a }); lista.push({ rot:'Falada', en:NM_DIA_EN[wd] + ', the ' + nmOrdEn(d, uk) + ' of ' + NM_MES_EN[m] + ', ' + anoEn }); }
  else { lista.push({ rot:'Escrita', en:NM_DIA_EN[wd] + ', ' + NM_MES_EN[m] + ' ' + nmSufixo(d) + ', ' + a }); lista.push({ rot:'Falada', en:NM_DIA_EN[wd] + ', ' + NM_MES_EN[m] + ' ' + nmOrdEn(d, uk) + ', ' + anoEn }); }
  const diaPt = d === 1 ? 'primeiro' : nmPt(d);
  const pt = NM_DIA_PT[wd] + ', ' + d + ' de ' + NM_MES_PT[m] + ' de ' + a, ptFal = NM_DIA_PT[wd] + ', ' + diaPt + ' de ' + NM_MES_PT[m] + ' de ' + nmPt(a);
  lista[0].pt = pt; lista[1].pt = ptFal; return lista;
}
function nmHora(h, mi, uk){   /* 0..23, 0..59 */
  const h12 = h % 12 === 0 ? 12 : h % 12, prox = (h + 1) % 12 === 0 ? 12 : (h + 1) % 12, ap = h < 12 ? 'a.m.' : 'p.m.';
  const horaEn = x => NM_EN1[x], palEn = x => nmEn(x, uk);
  const horaPt = (x, art) => { const n = x % 24; if(n === 0) return 'meia-noite'; if(n === 12) return 'meio-dia'; const v = n % 12 === 0 ? 12 : n % 12; return (art ? (v === 1 ? 'a ' : 'as ') : '') + (v === 1 ? 'uma' : v === 2 ? 'duas' : NM_PT1[v] ) + (art ? '' : (v === 1 ? ' hora' : ' horas')); };
  const out = [];
  const esp = (mi === 0 && (h === 0 || h === 12)) ? (h === 0 ? 'midnight' : 'noon') : null;
  /* digital */
  out.push({ rot:'Digital', en:esp || (horaEn(h12) + ' ' + (mi === 0 ? "o'clock" : mi < 10 ? 'oh ' + NM_EN1[mi] : palEn(mi))) + ' ' + (esp ? '' : ap).trim(), pt:mi === 0 ? (esp ? (h === 0 ? 'meia-noite' : 'meio-dia') : horaPt(h) + ' em ponto') : horaPt(h) + ' e ' + nmPt(mi) });
  /* relógio */
  let rel, relPt;
  if(mi === 0){ rel = esp || horaEn(h12) + " o'clock"; relPt = esp ? (h === 0 ? 'meia-noite' : 'meio-dia') : horaPt(h) + ' em ponto'; }
  else if(mi === 15){ rel = 'a quarter past ' + horaEn(h12); relPt = horaPt(h) + ' e quinze'; }
  else if(mi === 30){ rel = 'half past ' + horaEn(h12); relPt = horaPt(h) + ' e meia'; }
  else if(mi === 45){ rel = 'a quarter to ' + horaEn(prox); relPt = 'quinze para ' + horaPt(h + 1, true); }
  else if(mi < 30){ rel = palEn(mi) + (mi % 5 ? ' minutes' : '') + ' past ' + horaEn(h12); relPt = horaPt(h) + ' e ' + nmPt(mi); }
  else { rel = palEn(60 - mi) + ((60 - mi) % 5 ? ' minutes' : '') + ' to ' + horaEn(prox); relPt = nmPt(60 - mi) + ' para ' + horaPt(h + 1, true); }
  out.push({ rot:'No relógio', en:rel + ((esp || mi === 0 && false) ? '' : ''), pt:relPt });
  return out;
}

/* ---- v164: BLOCO NÚMEROS, DATAS E HORAS (interface + treino) ---- */
let numTreino = null;   /* { tipo, en:[aceitas], pt, dica } */
function numVal(id){ const e = document.getElementById(id); return e ? e.value : ''; }
function numLinha(rot, en, pt){ return `<div class="num-lin"><div class="num-r">${rot}</div><div class="num-en">${escapeHTML(en)} ${btnAud(en)}</div><div class="num-pt">${escapeHTML(pt)}</div></div>`; }
function numRender(){
  const w = document.getElementById('numWrap'); if(!w) return;
  const uk = ENG === 'uk';
  const guarda = ['numN','numA','numD','numH'].reduce((o, k) => (o[k] = numVal(k), o), {});
  const n = Math.max(0, Math.min(999999999999, parseInt(guarda.numN || '1234567', 10) || 0));
  const a = Math.max(1100, Math.min(2999, parseInt(guarda.numA || '1999', 10) || 1999));
  const hoje = new Date(), dStr = guarda.numD || (hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0'));
  const hStr = guarda.numH || '14:45';
  const [dy, dm, dd] = dStr.split('-').map(Number), [hh, hm] = hStr.split(':').map(Number);
  const ords = [numLinha('Cardinal', nmEn(n, uk), nmPt(n))];
  if(n >= 1 && n <= 99) ords.push(numLinha('Ordinal', nmOrdEn(n, uk) + ' (' + nmSufixo(n) + ')', nmOrdPt(n) + ' (' + n + 'º)'));
  else if(n >= 100) ords.push(numLinha('Ordinal', nmOrdEn(n, uk) + ' (' + nmSufixo(n) + ')', '— (em português, acima de 99 usa-se o cardinal: “o ' + n + 'º”)'));
  const dataL = nmData(dy, dm - 1, dd, uk).map(x => numLinha(x.rot, x.en, x.pt)).join('');
  const horaL = nmHora(hh, hm, uk).map(x => numLinha(x.rot, x.en, x.pt)).join('');
  w.innerHTML = `
  <div class="num-top">${ipaChipHTML()}</div>
  <p class="num-nota">Variante ativa: <b>${uk ? 'UK (britânico)' : 'US (americano)'}</b> — troque no botão US/UK do topo. Tudo aqui é calculado por regra, não digitado.</p>
  <div class="num-card"><h3>🔢 Números · <i>Numbers</i></h3>
    <input id="numN" type="number" min="0" max="999999999999" inputmode="numeric" value="${n}"> ${ords.join('')}
    <div class="num-reg">Regra: o inglês liga dezena e unidade com hífen (<i>twenty-one</i>); o britânico põe <i>and</i> depois de centena (<i>one hundred and one</i>). Em português, o <i>e</i> liga as ordens (<i>cento e um</i>) e <i>mil</i> só leva <i>e</i> se o resto for &lt; 100 ou centena redonda.</div></div>
  <div class="num-card"><h3>📆 Anos · <i>Years</i></h3>
    <input id="numA" type="number" min="1100" max="2999" value="${a}"> ${numLinha('Leitura', nmAnoEn(a, uk), nmPt(a))}
    <div class="num-reg">Anos em inglês lêem-se em pares: 19|99, 20|26. Entre 2000 e 2009: <i>two thousand (and) five</i>; “oh” para 01–09 depois de centena (<i>nineteen oh five</i>).</div></div>
  <div class="num-card"><h3>🗓️ Datas · <i>Dates</i></h3>
    <input id="numD" type="date" value="${dStr}"> ${dataL}
    <div class="num-reg">${uk ? 'UK: dia antes do mês (<i>the 18th of November</i>).' : 'US: mês antes do dia (<i>November 18th</i>).'} Ordinal na data; em português, só o dia 1 é ordinal (<i>primeiro de maio</i>).</div></div>
  <div class="num-card"><h3>🕒 Horas · <i>Telling the time</i></h3>
    <input id="numH" type="time" value="${hStr}"> ${horaL}
    <div class="num-reg"><i>past</i> até a meia hora, <i>to</i> depois dela; <i>a quarter</i> = 15, <i>half past</i> = 30; <i>o'clock</i> só com hora cheia; <i>a.m./p.m.</i> no formato de 12 horas.</div></div>
  <div class="num-card"><h3>🎯 Treino · <i>Drill</i></h3><div id="numTreino"></div></div>`;
  numTreinoDesenha();
  ipaAnota(w);   /* v169 */
}
/* Treino: sorteia um item; o aluno digita a leitura em inglês (aceita as formas UK e US) */
function numTreinoNovo(){
  const r = k => Math.floor(Math.random() * k), uk = ENG === 'uk', t = r(4);
  if(t === 0){ const n = [r(100), 100 + r(900), 1000 + r(99000), 100000 + r(900000)][r(4)]; numTreino = { rot:'Número', q:String(n), en:[nmEn(n, false), nmEn(n, true)], pt:nmPt(n) }; }
  else if(t === 1){ const y = 1100 + r(1900); numTreino = { rot:'Ano', q:String(y), en:[nmAnoEn(y, false), nmAnoEn(y, true), nmEn(y, false)], pt:nmPt(y) }; }
  else if(t === 2){ const m = r(12), d = 1 + r(28), x = nmData(2026, m, d, uk)[1]; numTreino = { rot:'Data', q:d + ' de ' + NM_MES_PT[m], en:[x.en.replace(/^[A-Za-z]+, /, '').replace(/, [^,]+$/, '')], pt:'' }; }
  else { const h = r(24), mi = [0, 5, 10, 15, 20, 30, 40, 45, 50][r(9)], x = nmHora(h, mi, uk)[1]; numTreino = { rot:'Hora', q:String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0'), en:[x.en], pt:x.pt }; }
}
const numNorm = s => String(s).toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').replace(/ and /g, ' ').trim();
function numTreinoDesenha(res){
  const el = document.getElementById('numTreino'); if(!el) return;
  if(!numTreino) numTreinoNovo();
  const t = numTreino;
  el.innerHTML = `<div class="num-q">${t.rot}: <b>${escapeHTML(t.q)}</b></div>
    <input id="numResp" type="text" autocomplete="off" autocapitalize="off" placeholder="escreva por extenso, em inglês">
    <button type="button" class="chip" id="numChecar">Conferir</button> <button type="button" class="chip" id="numOutro">Outro ↻</button>
    <div id="numRes" class="num-res">${res || ''}</div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('#numChecar, #numOutro'); if(!b || !numTreino) return;
  if(b.id === 'numOutro'){ numTreinoNovo(); numTreinoDesenha(); return; }
  const r = numNorm(numVal('numResp')), ok = numTreino.en.some(x => numNorm(x) === r);
  const res = document.getElementById('numRes');
  res.innerHTML = ok ? '✅ Correto.' : '❌ Esperado: <b>' + escapeHTML(numTreino.en[0]) + '</b>' + (numTreino.en[1] && numTreino.en[1] !== numTreino.en[0] ? ' / ' + escapeHTML(numTreino.en[1]) : '');
});
document.addEventListener('input', e => { if(e.target && /^num[NADH]$/.test(e.target.id)) numRender(); });


/* ---- v164: BLOCO ESTRUTURAS ESSENCIAIS (futuro, imperativo, there is/are, determinantes, graus, preposições) ----
   Frases saem do motor (generate/translate) ou de regras; só entram como dado léxico as palavras soltas. */
const EST_BE = { I:'am', You:'are', He:'is', She:'is', It:'is', We:'are', They:'are' };
const estCap = x => x.charAt(0).toUpperCase() + x.slice(1);
const estArt = n => (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n;
function estLinha(rot, en, pt, nota){ return `<div class="num-lin"><div class="num-r">${rot}</div><div class="num-en">${escapeHTML(en)} ${btnAud(en)}</div>${pt ? `<div class="num-pt">${escapeHTML(pt)}</div>` : ''}${nota ? `<div class="num-pt">${nota}</div>` : ''}</div>`; }
/* Futuro: quatro formas, mesma ideia de tempo, intenções diferentes */
/* PT de apoio: infinitivo/particípio vêm de PT_VERBS; sem dado, a linha fica sem tradução */
const estInf = v => (PT_VERBS[v.id] || {}).inf || '';
const estPart = (v, fem, pl) => { const x = (PT_VERBS[v.id] || {}).part || ''; return x ? x.replace(/o$/, (fem ? 'a' : 'o') + (pl ? 's' : '')) : ''; };
const estPtTxt = (frase, v) => (estInf(v) ? frase : '');
function estFuturo(v, pr){
  const ger = (t, a) => stripMarks(generate('fact', t, a, 'afirmativa', pr, v).text).trim();
  const pt = (t, a) => { try { return translate('fact', t, a, 'afirmativa', pr, null, [], v.id, null, null); } catch(e){ return ''; } };
  const lc = pr === 'I' ? 'I' : pr;
  return [
    estLinha('will', ger('future', 'simples') + '.', pt('future', 'simples'), 'Decisão no momento da fala, previsão, promessa.'),
    estLinha('going to', lc + ' ' + EST_BE[pr] + ' going to ' + v.base + '.', estPtTxt(({ I:'Eu vou ', She:'Ela vai ', They:'Eles vão ' }[pr] || '') + estInf(v) + '.', v), 'Plano já decidido ou evidência presente (<i>vai acontecer</i>).'),
    estLinha('presente contínuo', ger('present', 'continuo') + '.', pt('present', 'continuo'), 'Arranjo marcado, combinado com alguém (agenda).'),
    estLinha('presente simples', ger('present', 'simples') + '.', pt('present', 'simples'), 'Horário fixo, tabela (trem, aula, voo).')
  ].join('');
}
/* Imperativo: base do verbo, sem sujeito */
function estImperativo(v){
  const b = v.base;
  return [
    estLinha('ordem / instrução', estCap(b) + '.', estInf(v) ? '(' + estInf(v) + ')' : '', 'Forma base, sem sujeito: o “você” está implícito.'),
    estLinha('proibição', "Don't " + b + '.', estInf(v) ? 'Não ' + estInf(v) + '.' : '', '<i>Don\'t</i> + base. Mais forte: <i>Never ' + b + '</i>.'),
    estLinha('educado', 'Please ' + b + '.', '', '<i>Please</i> no início ou no fim (<i>' + estCap(b) + ', please</i>).'),
    estLinha('convite', "Let's " + b + '.', estInf(v) ? 'Vamos ' + estInf(v) + '.' : '', '<i>Let\'s</i> inclui quem fala (“vamos”). Negativo: <i>Let\'s not ' + b + '</i>.'),
    estLinha('ênfase', 'Do ' + b + '.', '', '<i>Do</i> reforça o pedido (“faça mesmo”).')
  ].join('');
}
/* There is / there are: concordância com o primeiro substantivo da lista */
const EST_NOUNS = [['book','books','livro','livros','m'], ['chair','chairs','cadeira','cadeiras','f'], ['apple','apples','maçã','maçãs','f'], ['student','students','estudante','estudantes','m'], ['window','windows','janela','janelas','f']];
function estThere(n){
  const [s, p] = n, um = estArt(s);
  return [
    estLinha('singular', 'There is ' + um + '.', 'Há ' + (n[4] === 'f' ? 'uma ' : 'um ') + n[2] + '.', '<i>there is</i> + a/an + singular (contração: <i>there\'s</i>).'),
    estLinha('plural', 'There are ' + p + '.', 'Há ' + n[3] + '.', '<i>there are</i> + plural (ou <i>some/many</i>).'),
    estLinha('negativa', 'There isn\'t ' + um + '. / There aren\'t any ' + p + '.', 'Não há ' + (n[4] === 'f' ? 'uma ' : 'um ') + n[2] + '. / Não há ' + n[3] + '.', 'Com plural e negativa/pergunta, usa-se <i>any</i>.'),
    estLinha('pergunta', 'Is there ' + um + '? / Are there any ' + p + '?', 'Há ' + (n[4] === 'f' ? 'uma ' : 'um ') + n[2] + '? / Há ' + n[3] + '?', 'Inverte: verbo antes de <i>there</i>.'),
    estLinha('resposta curta', 'Yes, there is. / No, there aren\'t.', '', 'A resposta curta repete <i>there</i> + verbo.'),
    estLinha('passado', 'There was ' + um + '. / There were ' + p + '.', 'Havia ' + (n[4] === 'f' ? 'uma ' : 'um ') + n[2] + '. / Havia ' + n[3] + '.', '<i>was/were</i> concordam com o que vem depois.'),
    estLinha('futuro', 'There will be ' + um + '.', 'Haverá ' + (n[4] === 'f' ? 'uma ' : 'um ') + n[2] + '.', '<i>there will be</i>: <i>be</i> não varia.')
  ].join('');
}
/* Graus do adjetivo: regra ortográfica, com irregulares à parte */
const EST_ADJ = ['tall','big','happy','nice','expensive','interesting','good','bad','far','little'];
const EST_ADJ_IRR = { good:['better','best'], bad:['worse','worst'], far:['farther','farthest'], little:['less','least'] };
function estGraus(a){
  if(EST_ADJ_IRR[a]) return { c:EST_ADJ_IRR[a][0], s:EST_ADJ_IRR[a][1], r:'irregular' };
  const sil = (a.match(/[aeiouy]+/g) || []).length;
  if(a.endsWith('y') && sil <= 2) return { c:a.slice(0, -1) + 'ier', s:a.slice(0, -1) + 'iest', r:'-y → -ier / -iest' };
  if(sil === 1 || /^(nice)$/.test(a)){
    if(a.endsWith('e')) return { c:a + 'r', s:a + 'st', r:'termina em -e: só -r / -st' };
    if(/[^aeiou][aeiou][^aeiouwy]$/.test(a)) return { c:a + a.slice(-1) + 'er', s:a + a.slice(-1) + 'est', r:'consoante-vogal-consoante: dobra a última letra' };
    return { c:a + 'er', s:a + 'est', r:'1 sílaba: -er / -est' };
  }
  return { c:'more ' + a, s:'the most ' + a, r:'2+ sílabas: more / most' };
}
/* Preposições: tempo e lugar (léxico) + dependentes extraídas do banco de expressões */
const EST_PREP = [
  ['at', 'ponto exato', 'at 5 o\'clock · at noon · at night · at the station · at home'],
  ['on', 'dia, data, superfície', 'on Monday · on May 5th · on the table · on the second floor'],
  ['in', 'período longo, espaço fechado', 'in 2026 · in May · in the morning · in the box · in Brazil']
];
function estDependentes(){
  if(typeof hasDb !== 'function' || !hasDb()) return '<div class="num-reg">O banco de expressões ainda está carregando…</div>';
  const mapa = {};
  Object.values(EXPR_DB).forEach(f => (f.items || []).forEach(it => {
    const m = /^to ([a-z]+) (on|with|about|for|to|in|at|of|from|by)\b/.exec(it.expression || '');
    if(m) (mapa[m[2]] = mapa[m[2]] || []).push([it.expression.replace(/\s*\(.*$/, ''), it.translation]);
  }));
  return Object.keys(mapa).sort((x, y) => mapa[y].length - mapa[x].length).map(pp =>
    `<details class="est-det"><summary><b>${pp}</b> · ${mapa[pp].length} expressões</summary>` +
    mapa[pp].slice(0, 14).map(e => `<div class="num-lin"><div class="num-en">${escapeHTML(e[0])} ${btnAud(e[0])}</div><div class="num-pt">${escapeHTML(e[1])}</div></div>`).join('') + '</details>').join('');
}

/* Voz passiva e causativa: auxiliar be (ou have/get) no tempo certo + particípio do verbo (v.pp).
   Sujeito = o substantivo escolhido em "There is/are"; o concordância be segue singular/plural. */
const estChk = () => { const e = document.getElementById('estPl'); return !!(e && e.checked); };
/* verbos sem objeto não formam passiva: o cartão avisa */
const EST_INTR = new Set(['go','come','arrive','sleep','die','fall','run','walk','sit','stand','stay','travel','swim','fly','laugh','cry','smile','wait','happen','exist','rise','appear','depart','escape','sneeze','cough','sweat','bloom','sink','shine','jump','climb','arise','become','seem','live','work']);
const estIntrAviso = v => EST_INTR.has(v.id) ? '<div class="num-reg">⚠️ <i>' + v.base + '</i> normalmente não leva objeto (intransitivo): a passiva soa estranha. Escolha um verbo transitivo (<i>write, eat, take, buy</i>).</div>' : '';
function estPassiva(v, n, plural){
  const sj = 'The ' + (plural ? n[1] : n[0]), pp = v.pp, be = plural ? 'are' : 'is', was = plural ? 'were' : 'was', hv = plural ? 'have' : 'has';
  /* PT: artigo + substantivo + auxiliar + particípio concordando em gênero e número */
  const fem = n[4] === 'f', art = (fem ? (plural ? 'As ' : 'A ') : (plural ? 'Os ' : 'O ')) + (plural ? n[3] : n[2]), pt = estPart(v, fem, plural);
  const P = (aux) => pt ? art + ' ' + aux + ' ' + pt + '.' : '';
  return [
    estLinha('presente simples', sj + ' ' + be + ' ' + pp + '.', P(plural ? 'são' : 'é'), 'be (presente) + particípio.'),
    estLinha('passado simples', sj + ' ' + was + ' ' + pp + '.', P(plural ? 'foram' : 'foi'), 'be (passado) + particípio.'),
    estLinha('futuro', sj + ' will be ' + pp + '.', P(plural ? 'serão' : 'será'), 'will be + particípio.'),
    estLinha('presente contínuo', sj + ' ' + be + ' being ' + pp + '.', P(plural ? 'estão sendo' : 'está sendo'), 'be + <i>being</i> + particípio: a ação está em curso.'),
    estLinha('presente perfeito', sj + ' ' + hv + ' been ' + pp + '.', P(plural ? 'têm sido' : 'tem sido'), 'have/has + <i>been</i> + particípio.'),
    estLinha('modal', sj + ' can be ' + pp + '.', P(plural ? 'podem ser' : 'pode ser'), 'modal + <i>be</i> + particípio.'),
    estLinha('com agente', sj + ' ' + be + ' ' + pp + ' by her.', pt ? art + ' ' + (plural ? 'são' : 'é') + ' ' + pt + ' por ela.' : '', '<i>by</i> + agente só quando ele importa; senão omite-se.')
  ].join('');
}
function estCausativa(v, n, plural){
  const o = 'the ' + (plural ? n[1] : n[0]), pp = v.pp;
  return [
    estLinha('have', 'I have ' + o + ' ' + pp + '.', '', '<i>have</i> + objeto + particípio: mando/faço alguém fazer (neutro, serviço).'),
    estLinha('get', 'I get ' + o + ' ' + pp + '.', '', '<i>get</i>: mais informal; também “conseguir que seja feito”.'),
    estLinha('passado', 'I had ' + o + ' ' + pp + '.', '', 'O tempo vai no <i>have/get</i>; o particípio não muda.'),
    estLinha('futuro', "I'll have " + o + ' ' + pp + '.', '', 'will have + objeto + particípio.')
  ].join('');
}

/* Discurso indireto: recuo de tempo (backshift). A frase direta e a indireta saem do motor;
   o recuo é a tabela abaixo [tempo, aspecto] direto → [tempo, aspecto] indireto. */
const EST_RECUO = [
  ['present','simples','past','simples','presente → passado'],
  ['present','continuo','past','continuo','presente contínuo → passado contínuo'],
  ['present','perfeito','past','perfeito','presente perfeito → passado perfeito (<i>had</i> + particípio)'],
  ['past','simples','past','perfeito','passado simples → passado perfeito (<i>had</i> + particípio)'],
  ['future','simples','future','simples','<i>will</i> → <i>would</i>']
];
function estIndireto(v){
  const ger = (t, a, f, pr) => stripMarks(generate('fact', t, a, f, pr, v).text).trim();
  const pt = (t, a, f, pr) => { try { return translate('fact', t, a, f, pr, null, [], v.id, null, null).replace(/[.?!]\s*$/, ''); } catch(e){ return ''; } };
  const lin = EST_RECUO.map(r => {
    const dir = ger(r[0], r[1], 'afirmativa', 'I');
    let ind = ger(r[2], r[3], 'afirmativa', 'She').replace(/^She/, 'she');
    if(r[0] === 'future') ind = ind.replace(/\bwill\b/, 'would');
    return estLinha(r[0] === 'present' && r[1] === 'simples' ? 'regra' : '·', 'She said, “' + dir + '.” → She said (that) ' + ind + '.', 'Ela disse: “' + pt(r[0], r[1], 'afirmativa', 'I') + '.”', r[4]);
  });
  const perg = ger('present', 'simples', 'afirmativa', 'I'), pass = ger('past', 'simples', 'afirmativa', 'She');
  lin.push(estLinha('sim/não', 'She asked, “' + ger('present', 'simples', 'pergunta', 'You') + '?” → She asked if I ' + v.past + '.', '', 'Pergunta indireta: <i>if / whether</i> + ordem de afirmativa (sem <i>do</i>), com recuo.'));
  lin.push(estLinha('ordem', 'She said, “' + estCap(v.base) + '.” → She told me to ' + v.base + '.', '', '<i>told</i> + pessoa + <i>to</i> + verbo.'));
  lin.push(estLinha('proibição', 'She said, “Don\'t ' + v.base + '.” → She told me not to ' + v.base + '.', '', 'Negativa: <i>not to</i> + verbo.'));
  return lin.join('');
}

/* Orações especiais (O1) e ênfase/ordem marcada (E1): modelos com palavras funcionais + formas do motor (v.base, v.past, v.pp, v.ing, v.s3). */
function estEspeciais(v){
  const g = (t, a, pr) => stripMarks(generate('fact', t, a, 'afirmativa', pr, v).text).trim();
  const low = x => x.replace(/^(She|He|It|They|We)\b/, m => m.toLowerCase());
  return [
    estLinha('wish · presente', 'I wish I ' + v.past + '. / If only I ' + v.past + '.', '', 'Desejo sobre o presente: <i>wish</i> + passado simples (irreal).'),
    estLinha('wish · passado', 'I wish I had ' + v.pp + '. / If only I had ' + v.pp + '.', '', 'Arrependimento: <i>wish</i> + passado perfeito.'),
    estLinha('wish · would', 'I wish she would ' + v.base + '.', '', 'Queixa ou desejo de mudança no outro: <i>wish</i> + <i>would</i>.'),
    estLinha('condicional mista', 'If I had ' + v.pp + ', I would be ready now.', '', 'Passado → presente: <i>if</i> + passado perfeito, <i>would</i> + base. Invertida: <i>If I ' + v.past + ', I would have been ready</i> (presente → passado).'),
    estLinha('be used to', 'I am used to ' + v.ing + '.', estInf(v) ? 'Estou acostumado a ' + estInf(v) + '.' : '', 'Estar acostumado: <i>be used to</i> + <b>-ing</b> (<i>get used to</i> = acostumar-se).'),
    estLinha('used to', 'I used to ' + v.base + '.', estInf(v) ? 'Eu costumava ' + estInf(v) + '.' : '', 'Hábito passado: <i>used to</i> + <b>base</b>. Não confundir com <i>be used to</i>.'),
    estLinha('+ -ing', 'I enjoy ' + v.ing + '. / I avoid ' + v.ing + '.', estInf(v) ? 'Eu gosto de ' + estInf(v) + '. / Eu evito ' + estInf(v) + '.' : '', 'Pedem gerúndio: <i>enjoy, avoid, finish, keep, mind, suggest</i>.'),
    estLinha('+ to', 'I want to ' + v.base + '. / I decided to ' + v.base + '.', estInf(v) ? 'Eu quero ' + estInf(v) + '. / Eu decidi ' + estInf(v) + '.' : '', 'Pedem infinitivo: <i>want, decide, hope, plan, need, promise</i>.'),
    estLinha('muda o sentido', 'I stopped ' + v.ing + '. / I stopped to ' + v.base + '.', '', '<i>stop, remember, forget, try</i>: o gerúndio olha o fato; o infinitivo, a finalidade.'),
    estLinha('futuro no passado', 'She said she was going to ' + v.base + '. / She said she would ' + v.base + '.', '', '<i>was going to / would</i>: futuro visto de um ponto no passado.'),
    estLinha('subjuntivo mandativo', 'It is essential that she ' + v.base + '.', '', 'Depois de <i>essential, suggest, insist, demand</i>: verbo na forma base, sem -s.'),
    estLinha('were · condicional', 'If I were you, I would ' + v.base + '. / Were it not for her, I would ' + v.base + '.', '', '<i>were</i> para todas as pessoas no irreal; inversão sem <i>if</i> é formal.'),
    estLinha('conectivos formais', 'She ' + v.s3 + '; however, I ' + v.base + '. / Moreover, / Therefore, / Nevertheless,', '', 'Contraste: <i>however, nevertheless</i>. Adição: <i>moreover, furthermore</i>. Consequência: <i>therefore, consequently</i>. Ponto e vírgula antes, vírgula depois.')
  ].join('');
}
function estEnfase(v){
  return [
    estLinha('do enfático', 'I do ' + v.base + '. / She does ' + v.base + '. / I did ' + v.base + '.', '', '<i>do/does/did</i> + base reforça: “eu realmente faço”.'),
    estLinha('clivagem · It', 'It is Ana who ' + v.s3 + '.', '', '<i>It is / was</i> + foco + <i>who / that</i>: destaca quem ou o quê.'),
    estLinha('clivagem · What', 'What I need is to ' + v.base + '.', '', '<i>What</i> + oração + <i>is</i> + foco: wh- como sujeito (também <i>What happened was…</i>).'),
    estLinha('inversão · never', 'Never have I ' + v.pp + ' so much.', '', 'Advérbio negativo no início → auxiliar antes do sujeito.'),
    estLinha('inversão · not only', 'Not only do I ' + v.base + ', but I also teach.', '', '<i>Not only / Rarely / Seldom / Hardly</i> + auxiliar + sujeito.'),
    estLinha('fronting', 'Rarely do I ' + v.base + ' alone. / Here comes the bus.', '', 'Elemento deslocado para o começo para dar ênfase; sujeito e verbo podem inverter.'),
    estLinha('registro', 'I can\'t ' + v.base + ' → I am unable to ' + v.base + '.', '', 'Informal → formal: contração e <i>can</i> cedem a <i>be able to / unable</i>.')
  ].join('');
}

/* Palavras pequenas (N1/N2): quadro de pronomes, demonstrativos, genitivo, plural e advérbio por regra. */
const EST_PRON = { I:['me','my','mine','myself'], You:['you','your','yours','yourself'], He:['him','his','his','himself'], She:['her','her','hers','herself'], It:['it','its','—','itself'], We:['us','our','ours','ourselves'], They:['them','their','theirs','themselves'] };
function estPlural(n){
  if(/(s|x|z|ch|sh)$/.test(n)) return n + 'es';
  if(/[^aeiou]y$/.test(n)) return n.slice(0, -1) + 'ies';
  if(/(f|fe)$/.test(n)) return n.replace(/fe?$/, 'ves');
  if(/[^aeiou]o$/.test(n)) return n + 'es';
  return n + 's';
}
const EST_PL_IRR = { man:'men', woman:'women', child:'children', foot:'feet', tooth:'teeth', person:'people', mouse:'mice' };
const EST_PL_N = ['book','box','city','knife','church','day','potato','man','child'];
function estAdvLy(a){
  if(/[^aeiou]y$/.test(a)) return a.slice(0, -1) + 'ily';
  if(/le$/.test(a)) return a.slice(0, -1) + 'y';
  if(/ic$/.test(a)) return a + 'ally';
  return ({ good:'well', fast:'fast', hard:'hard', late:'late' })[a] || a + 'ly';
}
function estPequenas(){
  const lin = [];
  lin.push('<div class="num-lin"><div class="num-r">pronomes</div><div class="num-en">sujeito · objeto · adj. possessivo · pron. possessivo · reflexivo</div></div>');
  Object.keys(EST_PRON).forEach(k => { const r = EST_PRON[k]; lin.push(estLinha(k, k + ' · ' + r.join(' · '), '', '')); });
  lin.push(estLinha('this / these', 'this book · these books', '', 'Perto de quem fala: <i>this</i> (singular), <i>these</i> (plural).'));
  lin.push(estLinha('that / those', 'that book · those books', '', 'Longe de quem fala: <i>that</i> (singular), <i>those</i> (plural).'));
  lin.push(estLinha("genitivo 's", "Ana's book · the students' room · the cover of the book", '', "Pessoas: <b>'s</b> (singular) e <b>s'</b> (plural em -s); coisas: <i>of</i>."));
  lin.push(estLinha('enough / too', 'tall enough · enough time · too tall · too much', '', '<i>enough</i> depois do adjetivo e antes do substantivo; <i>too</i> = demais (negativo).'));
  lin.push(estLinha('both / either / neither', 'both of them · either of them · neither of them · each · all', '', '<i>both</i> = os dois; <i>either</i> = um ou outro; <i>neither</i> = nenhum dos dois (verbo afirmativo).'));
  lin.push(estLinha('artigo zero (avançado)', 'Life is short. · I like music. · the sea · the Alps', '', 'Sem artigo em generalizações; <i>the</i> com mares, cadeias de montanhas e únicos.'));
  EST_PL_N.forEach(n => lin.push(estLinha('plural', n + ' → ' + (EST_PL_IRR[n] || estPlural(n)), '', EST_PL_IRR[n] ? 'irregular' : (/(s|x|z|ch|sh)$/.test(n) ? '-es depois de sibilante' : /[^aeiou]y$/.test(n) ? '-y → -ies' : /(f|fe)$/.test(n) ? '-f/-fe → -ves' : /[^aeiou]o$/.test(n) ? '-o → -es (poucos)' : '+ -s'))));
  ['quick','happy','gentle','basic','good','fast'].forEach(a => lin.push(estLinha('advérbio', a + ' → ' + estAdvLy(a), '', 'Advérbio de modo: -ly (-y→-ily, -le→-ly, -ic→-ically); irregulares <i>well, fast, hard</i>.')));
  return lin.join('');
}

/* Fluência e registro: movimento, atenuação, registro, nuances modais, coesão, polidez, ortografia, passiva de relato e prosódia.
   Prosódia: palavras de conteúdo (verbo/substantivo) ganham acento; palavras funcionais ficam fracas — a lista abaixo decide. */
const EST_FRACAS = new Set(['i','you','he','she','it','we','they','a','an','the','is','are','am','was','were','do','does','did','will','would','can','could','to','of','at','in','on','for','and','but','that','has','have','had','been','be']);
function estAcento(frase){
  return frase.split(' ').map(w => EST_FRACAS.has(w.toLowerCase().replace(/[^a-z']/g, '')) ? w.toLowerCase() : w.toUpperCase()).join(' ');
}
function estFluencia(v){
  const g = (t, a, f, pr) => stripMarks(generate('fact', t, a, f, pr, v).text).trim();
  let ipa = ''; try { const r = ipaDe(v); ipa = typeof r === 'string' ? r : (r && (r.us || r.ipa) || ''); } catch(e){}
  return [
    estLinha('movimento', 'to · into · onto · through · across · along · over · past', '', 'Preposições de movimento: <i>to</i> destino, <i>into</i> entrada, <i>through</i> atravessar um espaço, <i>across</i> de um lado a outro.'),
    estLinha('atenuação', 'I think · I suppose · It seems · sort of · a bit', '', 'Suavizam uma afirmação (<i>hedging</i>): <i>It seems that she ' + v.s3 + '.</i>'),
    estLinha('marcadores', 'Well, · Actually, · By the way, · Anyway, · You know,', '', 'Abrem ou reorientam a fala: <i>well</i> hesitação, <i>actually</i> correção, <i>anyway</i> retomada.'),
    estLinha('registro', 'get → obtain · ask for → request · find out → discover · I\'m sorry → I apologise', '', 'Espelho informal → formal; verbos de origem germânica (informal) × latina (formal).'),
    estLinha('would rather', 'I would rather ' + v.base + '. / I would rather not ' + v.base + '.', estInf(v) ? 'Eu preferiria ' + estInf(v) + '. / Eu preferiria não ' + estInf(v) + '.' : '', 'Preferência: <i>would rather</i> + base.'),
    estLinha('had better', 'You had better ' + v.base + '.', estInf(v) ? 'É melhor você ' + estInf(v) + '.' : '', 'Conselho forte, quase aviso: <i>had better</i> + base (negativa: <i>had better not</i>).'),
    estLinha('be bound to', 'She is bound to ' + v.base + '.', estInf(v) ? 'Ela com certeza vai ' + estInf(v) + '.' : '', 'Quase certeza (“com certeza vai”): <i>be bound to</i> + base.'),
    estLinha('polidez', 'Open it. → Can you open it? → Could you open it? → Would you mind opening it?', '', 'Gradação: ordem → <i>can</i> → <i>could</i> → <i>would you mind</i> + -ing (mais indireto = mais educado).'),
    estLinha('coesão', 'She ' + v.s3 + '. This is why… / Her ' + v.ing + '… / That is, / In other words,', '', 'Retomada por referência (<i>this, that, it</i>), substituição e conectores de reformulação.'),
    estLinha('ortografia', v.base + ' → ' + v.ing + ' · ' + v.past + ' · ' + v.s3, '', 'Formas por regra: -ing (corta -e, dobra consoante), -ed/irregular e -s/-es.'),
    estLinha('passiva de relato', 'It is said that she ' + v.s3 + '. / She is said to ' + v.base + '.', '', '<i>It is said / believed / reported that…</i> ou sujeito + <i>is said to</i> + base.'),
    estLinha('acento de frase', estAcento(g('present', 'simples', 'afirmativa', 'She')) + '.', '', 'Em MAIÚSCULAS, o que carrega acento: palavras de conteúdo. Pronome e auxiliar ficam fracos.'),
    estLinha('acento · pergunta', estAcento(g('present', 'simples', 'pergunta', 'You')) + '?', '', 'Sim/não: entonação <b>↗</b> sobe no fim; afirmação e <i>wh-</i>: <b>↘</b> desce.'),
    estLinha('fala conectada', 'want to → wanna · going to → gonna · did you → didja · a lot of → a lotta', '', 'Fala rápida junta e reduz palavras; é para entender, não para escrever.')
  ].join('') + (ipa ? estLinha('IPA do verbo', v.base + '  /' + ipa.replace(/^\/|\/$/g, '') + '/', '', 'Transcrição do verbo escolhido.') : '');
}
function estRender(){
  const w = document.getElementById('estWrap'); if(!w) return;
  const vid = numVal('estV') || 'work', v = verbById(vid), pr = numVal('estP') || 'She', ni = parseInt(numVal('estN') || '0', 10) || 0, ai = numVal('estA') || 'tall';
  const opt = (arr, cur, f) => arr.map(x => `<option value="${f ? f(x)[0] : x}"${(f ? f(x)[0] : x) == cur ? ' selected' : ''}>${f ? f(x)[1] : x}</option>`).join('');
  const g = estGraus(ai);
  w.innerHTML = `
  <div class="num-top">${ipaChipHTML()}</div>
  <div class="num-card"><h3>🚀 Futuro · <i>Ways to talk about the future</i></h3>
    <select id="estV">${opt(VERBS, vid, x => [x.id, x.base])}</select> <select id="estP">${opt(['I','She','They'], pr)}</select>
    ${estFuturo(v, pr)}</div>
  <div class="num-card"><h3>📣 Imperativo · <i>Imperatives</i></h3>${estImperativo(v)}</div>
  <div class="num-card"><h3>📍 Existencial · <i>There is / There are</i></h3>
    <select id="estN">${opt(EST_NOUNS, ni, x => [EST_NOUNS.indexOf(x), x[0]])}</select>${estThere(EST_NOUNS[ni])}</div>
  <div class="num-card"><h3>🔁 Voz passiva · <i>Passive voice</i></h3>${estIntrAviso(v)}${estPassiva(v, EST_NOUNS[ni], estChk())}
    <label class="num-reg"><input type="checkbox" id="estPl"${estChk() ? ' checked' : ''}> plural</label>
    <div class="num-reg">Estrutura: <i>be</i> no tempo desejado + particípio. O objeto da ativa vira sujeito. Frases estruturais: o substantivo vem de “There is/are”, então algumas combinações são só ilustrativas.</div></div>
  <div class="num-card"><h3>💇 Causativa · <i>Have / get something done</i></h3>${estCausativa(v, EST_NOUNS[ni], estChk())}</div>
  <div class="num-card"><h3>💬 Discurso indireto · <i>Reported speech</i></h3>${estIndireto(v)}
    <div class="num-reg">Recuo: o tempo “anda um passo para trás” quando o verbo de relato está no passado. Pronomes e marcadores de tempo também mudam (<i>I → she</i>, <i>now → then</i>, <i>tomorrow → the next day</i>).</div></div>
  <div class="num-card"><h3>🔀 Orações especiais · <i>Wishes, mixed conditionals, -ing / to, formal links</i></h3>${estEspeciais(v)}</div>
  <div class="num-card"><h3>🎯 Ênfase e ordem marcada · <i>Emphasis &amp; inversion</i></h3>${estEnfase(v)}</div>
  <div class="num-card"><h3>🔤 Palavras pequenas · <i>Pronouns, plurals, adverbs</i></h3>${estPequenas()}</div>
  <div class="num-card"><h3>🗣️ Fluência e registro · <i>Hedging, politeness, stress &amp; connected speech</i></h3>${estFluencia(v)}</div>
  <div class="num-card"><h3>🧱 Determinantes · <i>Nouns &amp; determiners</i></h3>
    ${estLinha('a / an', 'a book · an apple', '', 'Contável singular, primeira menção. <i>an</i> antes de som de vogal.')}
    ${estLinha('the', 'the book', '', 'Já conhecido ou único.')}
    ${estLinha('zero', 'books · water', '', 'Plural ou incontável, em sentido geral: sem artigo.')}
    ${estLinha('contável', 'many · a few · few · several', '', 'Plural contável.')}
    ${estLinha('incontável', 'much · a little · little', '', 'Incontável (<i>water, money, time</i>).')}
    ${estLinha('ambos', 'some · any · a lot of · plenty of', '', '<i>some</i> em afirmativas; <i>any</i> em negativas e perguntas.')}</div>
  <div class="num-card"><h3>📈 Graus e ordem · <i>Adjectives: degrees &amp; order</i></h3>
    <select id="estA">${opt(EST_ADJ, ai)}</select>
    ${estLinha('comparativo', g.c + ' (than)', '', g.r)}${estLinha('superlativo', g.s, '', 'Superlativo leva <i>the</i>.')}
    ${estLinha('igualdade', 'as ' + ai + ' as', '', 'Igualdade: <i>as … as</i>; negativa: <i>not as … as</i>.')}
    ${estLinha('ordem', 'opinion · size · age · shape · colour · origin · material', '', 'Ordem dos adjetivos antes do substantivo: <i>a lovely small old round red Italian wooden table</i> (raramente mais de três).')}</div>
  <div class="num-card"><h3>🧭 Preposições · <i>Prepositions</i></h3>
    ${EST_PREP.map(x => estLinha(x[0], x[2], '', x[1])).join('')}
    <div class="num-reg">Dependentes (verbo + preposição), extraídas do banco de expressões:</div>${estDependentes()}</div>`;
  ipaAnota(w);   /* v169 */
}
document.addEventListener('change', e => { if(e.target && /^est(V|P|N|A|Pl)$/.test(e.target.id)) estRender(); });


