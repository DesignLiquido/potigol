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
| Matrizes (`Matriz[T]`) | ❌ | Não implementado |
| Cubos (`Cubo[T]`) | ❌ | Não implementado |
| `InteiroGrande` | ❌ | Não implementado |

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
| `para X em colecao faça` (for-each) | ❌ | Palavra-chave `em` ausente |

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
| Matrizes | ❌ | Não implementado |
| Cubos | ❌ | Não implementado |

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

- **Funcionalidades implementadas**: ~90%
- **Funcionalidades parciais**: ~5%
- **Funcionalidades não implementadas**: ~5%

### Principais Gaps
1. Laço `para X em colecao faça` (for-each)
2. Matrizes e cubos multidimensionais
3. Operações de arquivo e URL
4. Alguns aliases de método (`primeiro`, `filtre`, `reduza`)
5. Sobrecarga `aleatorio(lista)`

### Próximos Passos
- ✅ **Fase 8 concluída**: Correções de funcionalidades parciais
- Implementar for-each (Fase 9)
- Resolver stubs no formatador (Fase 2 - já parcialmente feito)
- Corrigir formatação if-elseif (Fase 3 - já feito)
- Adicionar aliases e sobrecargas (Fase 4 - já parcialmente feito)
- Expandir análise semântica (Fase 5)
- Adicionar testes de regressão (Fase 6)

Esta matriz será atualizada conforme novas funcionalidades forem implementadas.