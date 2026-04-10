# Tradutores

## Tradutor Reverso (Potigol → Delégua)

A classe `TradutorReversoPotigol` converte a árvore sintática gerada pelo `AvaliadorSintaticoPotigol` em código-fonte equivalente em Delégua.

### Funcionalidades com mapeamento direto

| Potigol | Delégua |
|---|---|
| `escreva` / `imprima` | `escreva()` |
| `val x = valor` | `var x = valor` |
| `var x := valor` | `var x = valor` |
| `x := novoValor` (reatribuição) | `x = novoValor` |
| `se … então … senão … fim` | `se (…) { … } senão { … }` |
| `enquanto … faça … fim` | `enquanto (…) { … }` |
| `para i de 1 até N faça … fim` | `para (var i = 1; i <= N; i = i + 1) { … }` |
| `para i em colecao faça … fim` | `para cada i em colecao { … }` |
| `escolha … caso … fim` | `escolha (…) { caso …: … }` |
| `nomeFuncao(params) = expr` | `função nomeFuncao(params) { retorna expr }` |
| `div` (divisão inteira) | `\` |
| `mod` (módulo) | `%` |
| `^` (exponenciação) | `**` |
| `<>` (diferente) | `!=` |
| `e` / `ou` / `não` | `e` / `ou` / `!` |
| `verdadeiro` / `falso` | `verdadeiro` / `falso` |
| `leia_inteiro` / `leia_real` / `leia_texto` | `leia()` |
| `"texto {variavel}"` (interpolação) | `` `texto ${variavel}` `` |
| `.tamanho` | `.tamanho()` |
| `.inverta` | `.inverter()` |
| `.ordene` | `.ordenar()` |
| `.pegue(n)` | `.fatiar(0, n)` |
| `.descarte(n)` | `.fatiar(n)` |
| `.junte(sep)` | `.juntar(sep)` |
| `.mapeie(f)` | `.mapear(f)` |
| `.selecione(f)` / `.filtre(f)` | `.filtrar(f)` |
| `.contém(x)` | `.inclui(x)` |
| `.maiúsculo()` | `.maiusculo()` |
| `.minúsculo()` | `.minusculo()` |
| `.divida(sep)` | `.dividir(sep)` |
| `.cabeça` / `.primeiro` | `[0]` |
| `.último` | `[colecao.tamanho() - 1]` |
| `.cauda` | `.fatiar(1)` |
| `.vazia` | `.tamanho() == 0` |

### Funcionalidades sem mapeamento direto

| Funcionalidade Potigol | Situação em Delégua |
|---|---|
| `imprima` (sem quebra de linha) | Mapeado para `escreva()` — semântica de quebra de linha não é preservada |
| `para … gere` (gerador/yield) | Não existe protocolo de gerador em Delégua; traduzido como `para` numérico simples — geração lazy não é preservada |
| `tipo NomeAlias = TipoOriginal` | Sem alias de tipos em Delégua; emitido como comentário `// tipo … = …` |
| `val x: Inteiro = 42` (anotação de tipo) | Anotação de tipo descartada silenciosamente; `var` em Delégua não carrega tipo estático |
| `tipo Ponto` (classe estrutural) | Traduzido para `classe`, mas imutabilidade e construtores automáticos de Potigol não são aplicados |
| `leia_inteiro` / `leia_real` / `leia_texto` | Mapeados para `leia()` sem tipo; coerção automática de tipo que Potigol fazia em tempo de leitura é perdida |
| `leia_inteiros(n)` / `leia_reais(n)` / `leia_textos(n)` | Mapeados para `leia(n)`, mas Delégua não divide a linha lida em uma lista tipada |
| `a, b = leia_inteiro` (atribuição múltipla de leitura) | Representado como `ConstMultiplo`; sem equivalente nativo em Delégua fora do dialeto |
| `x :: lista` (cons — pré-pendura em lista) | Sem operador `::` em Delégua |
| `valor formato "%.2f"` (formatação de número) | Sem operador `formato` em Delégua |
| `Arquivo.leia` / `Arquivo.salve` | Sem global `Arquivo` em Delégua padrão |
| `abs`, `sen`, `cos`, `arcsen`, `raiz`, `log`, `log10`, `aleatório`, `piso`, `teto`, `arredonde`, `PI` | Funções globais de matemática de Potigol; em Delégua equivalem à classe `Matematica` — não há mapeamento direto como funções de topo de nível |
| `use NomeBiblioteca` | Corresponde a `importar` em Delégua; nenhuma tradução automática é realizada |
| `.pegue_enquanto(f)` / `.descarte_enquanto(f)` | Operações de lista de ordem superior com predicado — sem equivalente nos primitivos de Delégua |
| `.divida_quando(f)` | Dividir lista por predicado — sem equivalente em Delégua |
| `.injete(f)` / `.reduza(f)` | Redução funcional (fold) — Delégua não possui `reduzir` nativo |
| `qual_tipo` | Reflexão de tipo em tempo de execução — Delégua tem `tipo_de()` mas nomenclatura e semântica diferem |
| `Matriz` / `Cubo` (arrays 2D/3D nativos) | Sem tipos `Matriz`/`Cubo` em Delégua; requer `vetor` de `vetor` |
| `abstrato` (classes abstratas) | Sem modificador `abstrato` em Delégua |
| `def nomeFuncao(…)` | Palavra-chave `def` mapeada para `função`; funciona na tradução mas a palavra-chave original é perdida |
