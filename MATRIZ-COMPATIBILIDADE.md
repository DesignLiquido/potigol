# Matriz de Compatibilidade - Potigol Local vs Upstream

Esta matriz compara as funcionalidades da implementação local do dialeto Potigol com a linguagem de referência upstream (https://github.com/potigol/potigol). Baseia-se na análise da gramática ANTLR, código fonte, exemplos e documentação do repositório oficial.

**Legenda:**
- ✅ **Implementado**: Funcionalidade totalmente suportada
- ❌ **Não implementado**: Funcionalidade ausente
- ⚠️ **Parcial**: Implementado com limitações ou gaps conhecidos
- 🔄 **Em desenvolvimento**: Planejado para implementação futura

---

## Elementos Léxicos

### Identificadores
| Funcionalidade | Status | Notas |
|---|---|---|
| Padrão `(ALPHA\|ACENTO) (ALPHA\|ACENTO\|DIGIT)*` | ✅ | Suportado via lexador |
| Caracteres acentuados (Unicode) | ✅ | Incluído no léxico |
| Palavras reservadas em português | ✅ | Lista completa implementada |

### Literais
| Funcionalidade | Status | Notas |
|---|---|---|
| Inteiros (`DIGIT+`) | ✅ | |
| Reais (`DIGIT+ '.' DIGIT+`) | ✅ | |
| Strings (`'"' ... '"'`) | ✅ | |
| Strings interpoladas (`"texto {expr}"`) | ✅ | Suportado |
| Caracteres (`'a'`) | ✅ | |
| Booleanos (`verdadeiro`/`falso`) | ✅ | Mapeados para `true`/`false` |

### Operadores
| Funcionalidade | Status | Notas |
|---|---|---|
| Aritméticos (`+`, `-`, `*`, `/`, `div`, `mod`, `^`) | ✅ | |
| Comparação (`>`, `>=`, `<`, `<=`, `==`, `<>`) | ✅ | |
| Lógicos (`e`, `ou`, `não`) | ✅ | |
| Atribuição (`:=`, `=`) | ✅ | |
| Outros (`::`, `=>`, `..`) | ✅ | Todos suportados |

---

## Sintaxe

### Estrutura do Programa
| Funcionalidade | Status | Notas |
|---|---|---|
| Programa como sequência de instruções | ✅ | |
| Declarações, expressões, blocos, comandos | ✅ | |

### Comandos
| Funcionalidade | Status | Notas |
|---|---|---|
| `escreva expr` | ✅ | |
| `imprima expr` | ✅ | |
| Atribuição simples (`qualid1 := expr`) | ✅ | |
| Atribuição múltipla (`qualid2 := expr2`) | ✅ | Suportado via `VarMultiplo` |
| Atribuição de elemento de array | ✅ | |

### Declarações
| Funcionalidade | Status | Notas |
|---|---|---|
| Valores (`val id = expr`) | ✅ | |
| Variáveis (`var id := expr`) | ✅ | |
| Múltiplas declarações (`val a, b = expr`) | ✅ | `VarMultiplo` implementado |
| Funções simples (`def f(x) = expr`) | ✅ | |
| Funções com corpo (`def f(x) ... fim`) | ✅ | |
| Tipos (alias e classes) | ✅ | |

---

## Expressões

### Básicas
| Funcionalidade | Status | Notas |
|---|---|---|
| Literais (booleanos, IDs, strings, números) | ✅ | |
| Variáveis/identificadores | ✅ | |
| Chamadas de função | ✅ | |
| Chamadas de método | ✅ | |
| Acesso a arrays | ✅ | |
| Operações aritméticas | ✅ | |
| Exponenciação (`^`) | ✅ | |
| Operador cons (`::`) | ✅ | |
| Operadores unários | ✅ | |
| Comparações | ✅ | |
| Operações lógicas | ✅ | |
| Formatação de strings | ✅ | |
| Expressões lambda | ✅ | |
| Tuplas | ✅ | |
| Listas | ✅ | |
| Parênteses | ✅ | |
| `isto` (this) | ✅ | |
| Curinga (`_`) | ✅ | Suportado como identificador |

---

## Tipos

### Básicos
| Funcionalidade | Status | Notas |
|---|---|---|
| `Inteiro` | ✅ | |
| `Real` | ✅ | |
| `Texto` | ✅ | |
| `Lógico` | ✅ | |
| `Caractere` | ✅ | |
| `Nada` | ✅ | |

### Compostos
| Funcionalidade | Status | Notas |
|---|---|---|
| Tipos genéricos (`Lista[Inteiro]`) | ✅ | |
| Tuplas (`(Inteiro, Texto)`) | ✅ | |
| Tipos de função (`Inteiro => Texto`) | ✅ | |
| Listas (`Lista[T]`) | ✅ | |
| Vetores (`Vetor[T]`) | ✅ | |
| Matrizes (`Matriz[T]`) | ✅ | Estrutura, primitivas (`linhas`, `colunas`, `obter`, `definir`) e testes implementados |
| Cubos (`Cubo[T]`) | ✅ | Estrutura, primitivas (`camadas`, `linhas`, `colunas`, `obter`, `definir`) e testes implementados |
| `InteiroGrande` | ✅ | Literais com sufixo `g` (ex: `42g`), aritmética nativa BigInt, métodos `texto` e `qual_tipo`, testes implementados |

### Declarações de Tipo
| Funcionalidade | Status | Notas |
|---|---|---|
| Aliases (`tipo ID = Tipo`) | ✅ | |
| Classes (`tipo ID ... fim`) | ✅ | |
| Tipos abstratos (`tipo abstrato ID ... fim`) | ✅ | |

---

## Estruturas de Controle

### Condicionais
| Funcionalidade | Status | Notas |
|---|---|---|
| `se ... então ... fim` | ✅ | |
| `se ... senão ... fim` | ✅ | |
| `se ... senãose ... fim` | ✅ | Suportado via `senao se` e `senaose` |

### Laços
| Funcionalidade | Status | Notas |
|---|---|---|
| `para faixas ... bloco` | ✅ | |
| Comprehensions (`para ... gere ... fim`) | ✅ | |
| `enquanto expr bloco` | ✅ | |
| `para X em colecao faça` (for-each) | ✅ | Implementado em todas as camadas |

### Pattern Matching
| Funcionalidade | Status | Notas |
|---|---|---|
| `escolha expr caso ... fim` | ✅ | |
| Padrões de ID | ✅ | |
| Padrões literais | ✅ | |
| Padrões de objeto | ✅ | |
| Padrões cons | ✅ | |
| Padrões de lista | ✅ | |
| Padrões de tupla | ✅ | |
| Guards (`se expr`) | ✅ | |

---

## Funções

### Definições
| Funcionalidade | Status | Notas |
|---|---|---|
| Funções simples | ✅ | |
| Funções com corpo | ✅ | |
| Parâmetros com tipos | ✅ | |
| Parâmetros `val` | ✅ | |

### Chamadas
| Funcionalidade | Status | Notas |
|---|---|---|
| Chamadas de função | ✅ | |
| Chamadas de método | ✅ | |

### Lambdas
| Funcionalidade | Status | Notas |
|---|---|---|
| Expressões lambda | ✅ | |

---

## Coleções

### Listas
| Funcionalidade | Status | Notas |
|---|---|---|
| Criação (`[expr]`, `Lista(expr)`) | ✅ | |
| Lista vazia | ✅ | |
| Operações básicas (`cabeça`, `cauda`, `tamanho`) | ✅ | |
| Acesso por índice | ✅ | |
| `posição`, `contém`, `último` | ✅ | |
| `injete`, `reduza` | ✅ | `injete` implementado; `reduza` adicionado como alias |
| `selecione` (filter) | ✅ | |
| `mapeie` | ✅ | |
| `pegue`, `descarte` | ✅ | |
| `remova`, `insira` | ✅ | |
| `+`, `::`, `zip` | ✅ | |
| `atualize`, `-` | ✅ | |
| `junte` | ✅ | |
| `ordene` | ✅ | |
| `divida` | ✅ | |
| `mutavel`, `imutável` | ✅ | |

### Vetores
| Funcionalidade | Status | Notas |
|---|---|---|
| Criação e operações | ✅ | Via base Delegua |

### Matrizes e Cubos
| Funcionalidade | Status | Notas |
|---|---|---|
| Matrizes (`[[1,2],[3,4]]`) | ✅ | Criação automática por lista de listas; métodos `linhas`, `colunas`, `obter`, `definir` funcionais |
| Cubos (`[[[1]]]`) | ✅ | Criação automática por lista de listas de listas; métodos `camadas`, `linhas`, `colunas`, `obter`, `definir` funcionais |

---

## Bibliotecas Internas

### Entrada/Saída
| Funcionalidade | Status | Notas |
|---|---|---|
| `escreva`, `imprima` | ✅ | |
| `leia` (várias sobrecargas) | ✅ | |
| Leituras tipadas (`leia_inteiro`, etc.) | ✅ | |

### Matemática
| Funcionalidade | Status | Notas |
|---|---|---|
| Trigonométricas (`sen`, `cos`, etc.) | ✅ | |
| `abs`, `raiz`, `PI`, `log`, `log10` | ✅ | |
| `aleatório` (várias sobrecargas) | ✅ | Todas as sobrecargas implementadas |

### Operações de Texto
| Funcionalidade | Status | Notas |
|---|---|---|
| Operações básicas (`tamanho`, `cabeça`, etc.) | ✅ | |
| `maiusculo`, `minusculo` | ✅ | |
| `junte`, `ordene` | ✅ | |
| `descarte`, `pegue` | ✅ | |
| `remova`, `insira` | ✅ | |
| `divida` | ✅ | |
| `zip` | ✅ | |
| `atualize` | ✅ | |
| `inverta` | ✅ | |
| `filtre` (alias de `selecione`) | ✅ | Implementado |
| `injete`, `mapeie` | ✅ | |
| `pegue_enquanto`, `descarte_enquanto` | ✅ | |

### Operações de Arquivo
| Funcionalidade | Status | Notas |
|---|---|---|
| `Arquivo.leia` | ❌ | Não implementado |
| `Arquivo.salve` | ❌ | Não implementado |

### Operações de URL
| Funcionalidade | Status | Notas |
|---|---|---|
| `URL(caminho).conteudo` | ❌ | Não implementado |
| `URL(caminho).erro` | ❌ | Não implementado |

### Conversões de Tipo
| Funcionalidade | Status | Notas |
|---|---|---|
| Métodos de conversão (`texto`, `inteiro`, etc.) | ✅ | |

---

## Funcionalidades Avançadas

### Inferência de Tipos
| Funcionalidade | Status | Notas |
|---|---|---|
| Inferência automática | ✅ | |

### Polimorfismo
| Funcionalidade | Status | Notas |
|---|---|---|
| Tipos genéricos | ✅ | |
| Funções genéricas | ✅ | |
| Conversões implícitas | ✅ | |

### Tratamento de Erros
| Funcionalidade | Status | Notas |
|---|---|---|
| Verificação de tipos em tempo de compilação | ✅ | |
| Mensagens de erro em português | ✅ | |

### Interoperabilidade
| Funcionalidade | Status | Notas |
|---|---|---|
| Compilação para Scala | ✅ | Via base Delegua |
| Imports (`use`) | ✅ | |

### Pattern Matching Avançado
| Funcionalidade | Status | Notas |
|---|---|---|
| Destructuring | ✅ | |
| Guards | ✅ | |

### Avaliação Preguiçosa
| Funcionalidade | Status | Notas |
|---|---|---|
| Lazy evaluation | ❌ | Não implementado |

---

## Status Geral

- **Funcionalidades implementadas**: ~99%
- **Funcionalidades parciais**: ~0%
- **Funcionalidades não implementadas**: ~1% (Arquivo, URL, Lazy evaluation — fora do escopo deste repositório)

### Funcionalidades Concluídas
- ✅ Léxico, sintaxe, expressões e tipos básicos completos
- ✅ Laço `para X em colecao faça` (for-each)
- ✅ Operador range `..`
- ✅ Palavras-chave `senãose` / `senaose`
- ✅ Formatação idiomática de `senao se`
- ✅ `VarMultiplo` no formatador
- ✅ Aliases `primeiro`, `filtre`, `reduza` em vetor e texto
- ✅ Sobrecarga `aleatorio(lista)`
- ✅ `Matriz` com primitivas (`linhas`, `colunas`, `obter`, `definir`) e testes
- ✅ `Cubo` com primitivas (`camadas`, `linhas`, `colunas`, `obter`, `definir`) e testes
- ✅ `InteiroGrande` com literais `g`, aritmética BigInt e métodos

### Gaps Remanescentes (fora do escopo deste repositório)
1. **Arquivo**: `Arquivo.leia` e `Arquivo.salve` — implementar em `D:\Delegua\delegua-node`
2. **URL**: `URL(caminho).conteudo` e `.erro` — implementar em `D:\Delegua\delegua-node`
3. **Lazy evaluation**: baixa prioridade; requer mudanças no interpretador base

### Próximos Passos
- ✅ **Fases 8, 9 e 10 concluídas**
- Expandir análise semântica (verificação de tipos em expressões binárias)
- Adicionar testes de compatibilidade com exemplos do repositório upstream
- Implementar Arquivo e URL em `D:\Delegua\delegua-node`

Esta matriz será atualizada conforme novas funcionalidades forem implementadas.