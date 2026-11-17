# Painel Mestre do Inglês — arquitetura (v171)

App estático (PWA), sem build e sem dependências: HTML + CSS + JavaScript clássico. O que roda no navegador é exatamente o que está no repositório.

## Arquivos

| Arquivo | Papel |
|---|---|
| `index.html` | Só a estrutura (marcação) e a lista de scripts. ~30 KB. |
| `pm.css` | Todo o estilo (temas claro/escuro, modo TV, componentes). |
| `pm-01` … `pm-14-*.js` | Código do app, na **ordem de carga** (ver abaixo). |
| `expressoes.js` | Dados: banco de 100 famílias de expressões (carregado sob demanda). |
| `ipa.js`, `ipa-uk.js` | Dados: dicionário de pronúncia US e UK (carregados sob demanda). |
| `sw.js` | Service worker: pré-cache de tudo e funcionamento offline. |
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
| 09 | `pm-09-expressoes.js` | Banco de expressões, anatomia, atalhos, montador |
| 10 | `pm-10-glossario.js` | Glossário por encaixe |
| 11 | `pm-11-reduzidas.js` | Cobertura das reduzidas e utilitários da Gramática |
| 12 | `pm-12-relativas.js` | Relativa × pergunta indireta |
| 13 | `pm-13-trilha-estruturas.js` | Trilha (+ repetição espaçada), respostas curtas, números, estruturas, IPA sob demanda |
| 14 | `pm-14-menu.js` | Introdução de cada seção e menu da Referência |

## Como publicar uma versão

1. Edite só os módulos que mudaram.
2. Troque o nome do cache em `sw.js` (`painel-mestre-ingles-vNNN`). **Sempre**: é o que faz o celular baixar o conjunto novo de uma vez.
3. Se mudar a versão exibida, altere `APP_VERSION` em `pm-01-base.js`.
4. Suba apenas os arquivos alterados + `sw.js`.

Se criar um módulo novo: adicione o `<script defer src="…">` em `index.html` **e** o caminho em `ASSETS` no `sw.js`. Sem isso ele não funciona offline.

## Regras que mantêm o app consistente

- Scripts clássicos com `defer` (não módulos ES): funcionam em `file://` e compartilham o escopo global.
- Não renomear nem reordenar os arquivos sem rever a ordem de carga.
- Dados grandes e opcionais ficam em arquivos próprios (`expressoes.js`, `ipa*.js`) e carregam sob demanda, para a abertura ser rápida no celular.

## Dívida técnica conhecida

- Os módulos 04 e 05 (~340 KB cada) misturam dados e lógica; o próximo passo natural é extrair os dados para arquivos `data-*.js`.
- O escopo global compartilhado é simples, mas implícito: dependências entre módulos não estão declaradas.
