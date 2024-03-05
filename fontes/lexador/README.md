# Lexador

O Lexador, ou analisador léxico, transforma um código fonte em uma lista de símbolos. A ordem dos símbolos gerados é relevante para a próxima etapa: a avaliação sintática.

Um símbolo é equivalente a um lexema. Um lexema é uma unidade básica do léxico de qualquer linguagem, sendo formada por um ou mais caracteres. Como Potigol é implementado seguindo a língua portuguesa, o alfabeto usado por padrão é o latino, com caracteres acentuados. 

Caracteres que não são alfanuméricos normalmente possuem funções de estruturação e cadência nas linguagens implementadas. Por exemplo, os símbolos de abre e fecha chaves - `{` e `}`, respectivamente, são usados para interpolação de texto. Cada um desses símbolos é traduzido pelo lexador para `tiposDeSimbolos.CHAVE_ESQUERDA` e `tiposDeSimbolos.CHAVE_DIREITA`, respectivamente.

Todos os tipos de símbolos para Potigol [estão definidos aqui](https://github.com/DesignLiquido/potigol/tree/principal/fontes/tipos-de-simbolos). 

## Interpolação de texto

Em Potigol, quando há a leitura de um texto e uma chave é encontrada dentro deste texto, o comportamento geral do Lexador é alterado para aceitar todo e qualquer caracter que não seja o fechamento de chaves como texto. 