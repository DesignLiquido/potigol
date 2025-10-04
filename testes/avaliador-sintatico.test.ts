import { LexadorPotigol, MicroLexadorPotigol } from "../fontes/lexador";
import { AvaliadorSintaticoPotigol } from "../fontes/avaliador-sintatico";
import { ErroAvaliadorSintatico } from "@designliquido/delegua/avaliador-sintatico/erro-avaliador-sintatico";
import { Escreva } from "@designliquido/delegua";
import { MicroAvaliadorSintaticoPotigol } from "../fontes/avaliador-sintatico/micro-avaliador-sintatico-potigol";

describe('Avaliador sintático', () => {
    describe('analisar()', () => {
        let lexador = new LexadorPotigol();
        let avaliadorSintatico = new AvaliadorSintaticoPotigol();

        describe('Cenários de sucesso', () => {
            describe('Entrada e saída', () => {
                it('Escreva Olá Mundo', () => {
                    const retornoLexador = lexador.mapear(['escreva "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Imprima Olá Mundo', () => {
                    const retornoLexador = lexador.mapear(['imprima "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Operações matemáticas', () => {
                it('Soma trivial', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 + 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Operações encadeadas', () => {
                    const retornoLexador = lexador.mapear(['escreva (2 * 8) - (5 / 4 ^ 7)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Mod e Div', () => {
                    const retornoLexador = lexador.mapear(['escreva (100 mod 6 div 2)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });
            
            describe('Operações lógicas', () => {
                it('Ou', () => {
                    const retornoLexador = lexador.mapear(['verdadeiro ou falso'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('E', () => {
                    const retornoLexador = lexador.mapear(['verdadeiro e falso'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Não (sem acento)', () => {
                    const retornoLexador = lexador.mapear(['nao verdadeiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Não (com acento)', () => {
                    const retornoLexador = lexador.mapear(['não verdadeiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de igualdade', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 == 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de desigualdade', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 <> 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de menor', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 < 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de menor ou igual', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 <= 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de maior', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 > 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de maior ou igual', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 >= 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });
            
            describe('Atribuição de variáveis', () => {
                it('Declaração de inteiro constante, inferência', () => {
                    const retornoLexador = lexador.mapear(['a = 10'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de inteiro variável, inferência', () => {
                    const retornoLexador = lexador.mapear(['var a := 10'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de múltiplas variáveis inteiras, inferência', () => {
                    const retornoLexador = lexador.mapear(['var a, b, c := 10, 20, 30'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
                });
    
                it('Declaração de caractere constante, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(["c: Caractere = 'z'"], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Declaração de inteiro constante com val, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(['val a: Inteiro = 10'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de inteiro constante, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(['a: Inteiro = 10'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de lógico (com acento) constante, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(['b: Lógico = verdadeiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de lógico (sem acento) constante, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(['b: Logico = verdadeiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de real constante, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(['r: Real = 3.14'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de texto constante, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(['s: Texto = "Programação"'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Declaração de múltiplas constantes, lado direito usando `leia_inteiro`', () => {
                    const retornoLexador = lexador.mapear(['a, b, c = leia_inteiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Declaração de múltiplas constantes, lado direito usando `leia_inteiros`', () => {
                    const retornoLexador = lexador.mapear(['a, b, c = leia_inteiros(3)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });
            
            describe('Estruturas de decisão', () => {
                it('Escolha', () => {
                    const retornoLexador = lexador.mapear([
                        'escolha x',
                        '  caso 1 => escreva "Um"',
                        '  caso 2 => escreva "Dois"',
                        '  caso 3 => escreva "Três"',
                        '  caso _ => escreva "Outro valor"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Se', () => {
                    const retornoLexador = lexador.mapear([
                        'se verdadeiro então',
                        '  escreva "verdadeiro"',
                        'senão',
                        '  escreva "falso"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Estruturas de repetição', () => {
                it('Enquanto', () => {
                    const retornoLexador = lexador.mapear([
                        'var i := 0',
                        'enquanto i <= 10 faça',
                        '  escreva i',
                        '  i := i + 1',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
                });

                it('Para', () => {
                    const retornoLexador = lexador.mapear([
                        'var soma := 0',
                        'para i de 1 até 10 faça',
                        '  soma := soma + i',
                        'fim',
                        'escreva "A soma é {soma}."'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
                });
            });

            describe('Declarações de funções', () => {
                it('Função de uma linha, argumentos com tipo definido, sem dica de retorno', () => {
                    const retornoLexador = lexador.mapear([
                        'soma(x: Inteiro, y: Inteiro) = x + y'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Função de uma linha, argumentos com tipo definido, com dica de retorno', () => {
                    const retornoLexador = lexador.mapear([
                        'soma(x: Inteiro, y: Inteiro): Inteiro = x + y'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Declarações de tuplas', () => {
                it('Dupla', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Trio', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Quarteto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Quinteto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Sexteto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Septeto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Octeto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7, 8)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Noneto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7, 8, 9)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Deceto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Tipos', () => {
                it('Trivial', () => {
                    const retornoLexador = lexador.mapear([
                        'tipo Quadrado',
                        '  lado: Inteiro',
                        '  area() = lado * lado',
                        '  perimetro() = 4 * lado',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Primitivas', () => {
                it('formato, trivial', () => {
                    const retornoLexador = lexador.mapear([
                        'x = leia_real',
                        'area = (x * x) * 3.14159',
                        'escreva "A={area formato "%.4f"}"'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3); 

                    // Micro Análise Sintática
                    const declaracaoEscreva = retornoAvaliadorSintatico.declaracoes[2] as Escreva;
                    expect(declaracaoEscreva.argumentos).toHaveLength(1);
                    
                    const argumentoEscreva = declaracaoEscreva.argumentos[0];
                    const regexInterpolacao = /\{(.*)\}/gi;
                    const microLexador = new MicroLexadorPotigol();
                    const microAvaliadorSintatico = new MicroAvaliadorSintaticoPotigol(-1);
                    const argumentoInterpolado = argumentoEscreva.valor.match(regexInterpolacao)[0];
                    const resultadoMicroLexador = microLexador.mapear(argumentoInterpolado.replace(/[{}]/gi, ''));
                    const resultadoMicroAvaliacao = microAvaliadorSintatico.analisar(resultadoMicroLexador, 3);
                    expect(resultadoMicroAvaliacao.declaracoes).toHaveLength(1);
                });
            });

            describe('Listas', () => {
                it('Concatenação de listas', () => {
                    const retornoLexador = lexador.mapear([
                        'lista1 = [1,2,3,4]',
                        'lista2 = 0::lista1',
                        'escreva lista2'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
                });
            });
        });

        describe('Cenários de Falha', () => {
            it('Falha - Declaração de múltiplas variáveis inteiras, lado direito diferente de esquerdo', () => {
                const retornoLexador = lexador.mapear(['var a, b, c := 10, 20'], -1);
                expect(() => avaliadorSintatico.analisar(retornoLexador, -1)).toThrow(ErroAvaliadorSintatico);
                expect(() => avaliadorSintatico.analisar(retornoLexador, -1)).toThrow(
                    expect.objectContaining({
                        message: "Quantidade de identificadores à esquerda do igual é diferente da quantidade de valores à direita.",
                    })
                );
            });
        });
    });
});
