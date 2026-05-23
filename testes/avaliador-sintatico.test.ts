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
                it('Escreva Olá Mundo', async () => {
                    const retornoLexador = lexador.mapear(['escreva "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Imprima Olá Mundo', async () => {
                    const retornoLexador = lexador.mapear(['imprima "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Operações matemáticas', () => {
                it('Soma trivial', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 + 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Operações encadeadas', async () => {
                    const retornoLexador = lexador.mapear(['escreva (2 * 8) - (5 / 4 ^ 7)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Mod e Div', async () => {
                    const retornoLexador = lexador.mapear(['escreva (100 mod 6 div 2)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });
            
            describe('Operações lógicas', () => {
                it('Ou', async () => {
                    const retornoLexador = lexador.mapear(['verdadeiro ou falso'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('E', async () => {
                    const retornoLexador = lexador.mapear(['verdadeiro e falso'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Não (sem acento)', async () => {
                    const retornoLexador = lexador.mapear(['nao verdadeiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Não (com acento)', async () => {
                    const retornoLexador = lexador.mapear(['não verdadeiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de igualdade', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 == 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de desigualdade', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 <> 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de menor', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 < 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de menor ou igual', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 <= 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de maior', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 > 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Comparação de maior ou igual', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 >= 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });
            
            describe('Atribuição de variáveis', () => {
                it('Declaração de inteiro constante, inferência', async () => {
                    const retornoLexador = lexador.mapear(['a = 10'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de inteiro variável, inferência', async () => {
                    const retornoLexador = lexador.mapear(['var a := 10'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de múltiplas variáveis inteiras, inferência', async () => {
                    const retornoLexador = lexador.mapear(['var a, b, c := 10, 20, 30'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
                });
    
                it('Declaração de caractere constante, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(["c: Caractere = 'z'"], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Declaração de inteiro constante com val, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(['val a: Inteiro = 10'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de inteiro constante, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(['a: Inteiro = 10'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de lógico (com acento) constante, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(['b: Lógico = verdadeiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de lógico (sem acento) constante, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(['b: Logico = verdadeiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de real constante, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(['r: Real = 3.14'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
    
                it('Declaração de texto constante, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(['s: Texto = "Programação"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Declaração de múltiplas constantes, lado direito usando `leia_inteiro`', async () => {
                    const retornoLexador = lexador.mapear(['a, b, c = leia_inteiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Declaração de múltiplas constantes, lado direito usando `leia_inteiros`', async () => {
                    const retornoLexador = lexador.mapear(['a, b, c = leia_inteiros(3)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
        
                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });
            
            describe('Estruturas de decisão', () => {
                it('Escolha', async () => {
                    const retornoLexador = lexador.mapear([
                        'escolha x',
                        '  caso 1 => escreva "Um"',
                        '  caso 2 => escreva "Dois"',
                        '  caso 3 => escreva "Três"',
                        '  caso _ => escreva "Outro valor"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Escolha com múltiplos casos e guarda', async () => {
                    const retornoLexador = lexador.mapear([
                        'escolha x',
                        '  caso 1, 2 se x > 0 => escreva "Positivo"',
                        '  caso _ => escreva "Outro"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Se', async () => {
                    const retornoLexador = lexador.mapear([
                        'se verdadeiro então',
                        '  escreva "verdadeiro"',
                        'senão',
                        '  escreva "falso"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Se aninhado (issue 188)', async () => {
                    const retornoLexador = lexador.mapear([
                        'se verdadeiro então',
                        '  se verdadeiro então',
                        '    escreva "ac"',
                        '  senão',
                        '    escreva "ad"',
                        '  fim',
                        'senão',
                        '  se verdadeiro então',
                        '    escreva "bc"',
                        '  senão',
                        '    escreva "bd"',
                        '  fim',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Estruturas de repetição', () => {
                it('Enquanto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var i := 0',
                        'enquanto i <= 10 faça',
                        '  escreva i',
                        '  i := i + 1',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
                });

                it('Para', async () => {
                    const retornoLexador = lexador.mapear([
                        'var soma := 0',
                        'para i de 1 até 10 faça',
                        '  soma := soma + i',
                        'fim',
                        'escreva "A soma é {soma}."'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
                });

                it('Para gere', async () => {
                    const retornoLexador = lexador.mapear([
                        'para i de 1 até 5 gere',
                        '  escreva i',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Para gere com guarda', async () => {
                    const retornoLexador = lexador.mapear([
                        'para i de 1 até 5 se i > 2 gere',
                        '  escreva i',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Para cada (for-each sobre lista)', async () => {
                    const retornoLexador = lexador.mapear([
                        'lista = [1, 2, 3]',
                        'para x em lista faca',
                        '  escreva x',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
                });

                it('Para cada (for-each sobre vetor literal)', async () => {
                    const retornoLexador = lexador.mapear([
                        'para nome em ["Ana", "Bia", "Carlos"] faca',
                        '  escreva nome',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Declarações de funções', () => {
                it('Função de uma linha com def, argumentos com tipo definido, sem dica de retorno', async () => {
                    const retornoLexador = lexador.mapear([
                        'def soma(x: Inteiro, y: Inteiro) = x + y'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Função de uma linha, argumentos com tipo definido, sem dica de retorno', async () => {
                    const retornoLexador = lexador.mapear([
                        'soma(x: Inteiro, y: Inteiro) = x + y'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Função de uma linha, argumentos com tipo definido, com dica de retorno', async () => {
                    const retornoLexador = lexador.mapear([
                        'soma(x: Inteiro, y: Inteiro): Inteiro = x + y'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Função anônima', async () => {
                    const retornoLexador = lexador.mapear([
                        'soma = (x, y: Inteiro) => x + y',
                        'escreva soma(2, 3)'
                    ], -1);
                    
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
                });

                it('Função anônima com um parâmetro tipado', async () => {
                    const retornoLexador = lexador.mapear([
                        'sucessor = (x: Inteiro) => x + 1',
                        'escreva sucessor(2)'
                    ], -1);

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
                });

                it('Função anônima imediatamente chamada com um parâmetro tipado', async () => {
                    const retornoLexador = lexador.mapear([
                        'escreva ((x: Inteiro) => x + 1)(2)'
                    ], -1);

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Declarações de tuplas', () => {
                it('Dupla', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Trio', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Quarteto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Quinteto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Sexteto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Septeto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Octeto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7, 8)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Noneto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7, 8, 9)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Deceto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t := (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });
            });

            describe('Tipos', () => {
                it('Trivial', async () => {
                    const retornoLexador = lexador.mapear([
                        'tipo Quadrado',
                        '  lado: Inteiro',
                        '  area() = lado * lado',
                        '  perimetro() = 4 * lado',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                });

                it('Alias de tipo', async () => {
                    const retornoLexador = lexador.mapear([
                        'tipo Medida = Inteiro',
                        'distancia: Medida = 10'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
                });

                it('Tipo abstrato', async () => {
                    const retornoLexador = lexador.mapear([
                        'tipo abstrato Figura',
                        '  lados: Inteiro',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
                    expect((retornoAvaliadorSintatico.declaracoes[0] as any).abstrata).toBe(true);
                });

                it('Importação com use', async () => {
                    const retornoLexador = lexador.mapear([
                        'use "./biblioteca"',
                        'escreva "ok"'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.erros).toHaveLength(0);
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
                });
            });

            describe('Primitivas', () => {
                it('formato, trivial', async () => {
                    const retornoLexador = lexador.mapear([
                        'x = leia_real',
                        'area = (x * x) * 3.14159',
                        'escreva "A={area formato "%.4f"}"'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

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
                it('Concatenação de listas', async () => {
                    const retornoLexador = lexador.mapear([
                        'lista1 = [1,2,3,4]',
                        'lista2 = 0::lista1',
                        'escreva lista2'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    expect(retornoAvaliadorSintatico).toBeTruthy();
                    expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
                });
            });
        });

        describe('Cenários de Falha', () => {
            it('Falha - Declaração de múltiplas variáveis inteiras, lado direito diferente de esquerdo', async () => {
                const retornoLexador = lexador.mapear(['var a, b, c := 10, 20'], -1);
                await expect(avaliadorSintatico.analisar(retornoLexador, -1)).rejects.toThrow(ErroAvaliadorSintatico);
                await expect(avaliadorSintatico.analisar(retornoLexador, -1)).rejects.toThrow(
                    expect.objectContaining({
                        message: "Quantidade de identificadores à esquerda do igual é diferente da quantidade de valores à direita.",
                    })
                );
            });
        });
    });
});
