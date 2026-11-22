# Painel Mestre do Inglês — arquitetura (v177)

App estático (PWA), sem build e sem dependências: HTML + CSS + JavaScript clássico. O que roda no navegador é exatamente o que está no repositório.

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | Só a estrutura (marcação) e a lista de scripts. ~30 KB. |
| `pm.css` | Todo o estilo (temas claro/escuro, modo TV, componentes). |
| `pm-01` … `pm-14-*.js` | Código do app, na **ordem de carga** (ver abaixo). |
| `expressoes.js` | Dados: banco de 100 famílias de expressões (carregado sob demanda). |
| `data-trilha.js` | Dados: os 110 assuntos da Trilha (`TRILHA_DADOS`) e os **verbetes** (`TRILHA_VERBETES`). Carrega com a página, antes de `pm-13`. |
| `data-adjetivos.js` | Dados + modelo do **objeto** (v174): os 8 tipos de adjetivo em ordem (opinião, tamanho, idade, forma, cor, origem, material, propósito), ~1.090 adjetivos em subcategorias (linhas `# Nome` no texto-fonte; `op.sub`), 68 substantivos, determinantes e `npMonta()` (monta EN marcado + PT, a/an por som, concordância, ordem). Carrega com a página, antes de `pm-09`. |
| `data-subcat.js` | **Subcategorias** de todos os encaixes (v177): `SUBCAT[id] = [[nome, significado, [palavras]]]` para os 15 adverbiais e para determinante/substantivo (ids 30/31), e `ADJ_SUB_DESC` (significado das subcategorias dos 8 adjetivos). Arquivo gerado a partir de regras; toda expressão de `SIGNAL_WORDS` precisa ter grupo (o teste v177 falha se faltar). Carrega depois de `data-adjetivos.js`, antes de `pm-09`. |
| `sw.js` | Service worker: pré-cache de tudo e funcionamento offline. |
| `ipa.js`, `ipa-uk.js` | Dados: dicionário de pronúncia US e UK (carregados sob demanda). |
| `manifest.json`, `icon-*.png`, `*.woff2` | PWA e fontes. |

## Módulos JS, em ordem de carga

A ordem importa: todos compartilham o mesmo escopo global (como antes, quando era um arquivo só). Cada módulo pode **usar** o que está nos anteriores ao carregar, e o que está nos posteriores apenas dentro de funções.

| # | Arquivo | Conteúdo |
|---|---|---|
| 01 | `pm-01-base.js` | Modo TV, áudio, pronúncia por toque, -ed, fonética, sufixos, persistência, variante US/UK, acessibilidade, `APP_VERSION` |
| 02 | `pm-02-verbos.js` | Banco de verbos, motor de tradução PT, banco ampliado, etimologia |
| 03 | `pm-03-wh-dials.js` | Motor de perguntas wh, possessivos, dials e interface do motor |
| 04 | `pm-04-lexico.js` | Léxico dos verbos, IPA/regência/sinônimos, registro, ordem dos adjuntos |
| 05 | `pm-05-geografia.js` | Geografia da frase (encaixes, posições, sinais) |
| 06 | `pm-06-oracoes.js` | Motor da 2ª oração (tipos, reduzidas, dials Ⓐ e ⑩) |
| 07 | `pm-07-modais.js` | Motor de modais v2 |
| 08 | `pm-08-treino.js` | Caderno, shadowing, PWA, tema, Gatilhos, prática e verificação |
| — | `data-adjetivos.js` | (dados, carregado antes do 09) adjetivos, substantivos e `npMonta` |
| 09 | `pm-09-expressoes.js` | Banco de expressões, anatomia, atalhos, montador |
| 10 | `pm-10-glossario.js` | Glossário por encaixe |
| 11 | `pm-11-reduzidas.js` | Cobertura das reduzidas e utilitários da Gramática |
| 12 | `pm-12-relativas.js` | Relativa × pergunta indireta |
| — | `data-trilha.js` | (dados, carregado antes do 13) assuntos e verbetes da Trilha |
| 13 | `pm-13-trilha-estruturas.js` | Trilha (+ repetição espaçada e Teste-se dos verbetes), respostas curtas, números, estruturas, IPA sob demanda |
| 14 | `pm-14-menu.js` | Introdução de cada seção e menu da Referência |

## Como publicar uma versão

1. Edite só os módulos que mudaram.
2. Troque o nome do cache em `sw.js` (`painel-mestre-ingles-vNNN`). **Sempre**: é o que faz o celular baixar o conjunto novo de uma vez.
3. Se mudar a versão exibida, altere `APP_VERSION` em `pm-01-base.js`.
4. Suba apenas os arquivos alterados + `sw.js`.

Se criar um módulo novo (ou arquivo de dados): adicione o `<script defer src="…">` em `index.html` **e** o caminho em `ASSETS` no `sw.js`. Sem isso ele não funciona offline.

## Verbetes da Trilha

Cada assunto tem um verbete em `TRILHA_VERBETES[id]` com: `r` (como funciona), `f` (fórmula), `x` (exemplos: texto marcado à mão ou uma especificação do **motor**, que gera frase colorida + tradução), `p` (contraste com o português), `e` (armadilhas: errado → certo → porquê) e `t` (Teste-se, que alimenta as caixas da repetição espaçada). O verbete é montado só quando o assunto é aberto. Marcas à mão: `{f:}` formato, `{x:}` negação, `{y:}` pergunta, `{q:}` quando, `{c:}` como, `{o:}` onde, `{r:}` regência, `{j:}` conector, `{s:}` sujeito, `{v:}` verbo.

## Regras que mantêm o app consistente

- Scripts clássicos com `defer` (não módulos ES): funcionam em `file://` e compartilham o escopo global.
- Não renomear nem reordenar os arquivos sem rever a ordem de carga.
- Dados grandes ficam em arquivos próprios (`expressoes.js`, `ipa*.js`, `data-trilha.js`); só os opcionais e pesados (`expressoes.js`, `ipa*.js`) carregam sob demanda, para a abertura ser rápida no celular.

## Dívida técnica conhecida

- Os módulos 04 e 05 (~340 KB cada) misturam dados e lógica; o próximo passo natural é extrair os dados para arquivos `data-*.js`.
- O escopo global compartilhado é simples, mas implícito: dependências entre módulos não estão declaradas.


## O objeto: substantivo + 8 adjetivos (v174)

- Encaixes ids 30–39 (determinante, substantivo, 8 adjetivos), **sem renumerar** os 15 adverbiais (`SLOT_ORDEM`). Qualquer adjetivo liga o substantivo; desligar o substantivo limpa tudo; o verbo passa a um transitivo (`npVerboAuto`) e é restaurado ao desmontar.
- A seleção `{det, noun, adj:{tipo:palavra}}` vira `col = {raw, pt}` via `npMonta`; `applySignal` aceita `col.raw` (já marcado) e `translate` acrescenta `col.pt` antes dos adverbiais de fim.
- Cores: pares de controle `\u0010–\u001F` (`A7`, `ADJ7_MARCA`) e variáveis `--ad-*` (claro/escuro).
- Escopo atual: montador e cartões da Anatomia, só singular. Motor principal, demais motores e Tabela-resumo: versões futuras.
- Subcategorias (v175): cada tipo de adjetivo tem 5–11 grupos. O seletor do montador e o Glossário mostram chips (`np-sub`), títulos de grupo (`np-subh`) e busca, ligados por `npFiltroLiga` (filtra sem reconstruir).
- Combinações (v176): na Anatomia, duplas (28), trios (56) e quartetos (70) dos 8 tipos + 14 "mais úteis" curadas (`COMB_TOP`), em `pm-10-glossario.js` (`buildCombos`). Filtro "contém", palavras-modelo (`COMB_BASE`) ou sorteio reproduzível (`combPr`); o cartão carrega a frase no montador (`aplicarNoMontador`).
- Subcategorias em todos os encaixes (v177): `subOrdena(r, lista)` agrupa qualquer lista de peças e marca `.sub`/`.subd`; `chipsDeLista` e `npItensHTML` desenham chips e títulos (com o significado do grupo); `npFiltroLiga` filtra por chip + busca. Vale no seletor do montador e no Glossário por encaixe. Peça nova sem grupo cai em "Outras" (e o teste v177 acusa).
