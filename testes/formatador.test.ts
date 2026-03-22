import * as sistemaOperacional from 'os';

import { LexadorPotigol } from "../fontes/lexador";
import { AvaliadorSintaticoPotigol } from "../fontes/avaliador-sintatico";
import { FormatadorPotigol } from "../fontes/formatador";

describe('Formatador > Potigol', () => {
    describe('analisar()', () => {
        const formatadorPotigol = new FormatadorPotigol(sistemaOperacional.EOL);
        let avaliadorSintatico = new AvaliadorSintaticoPotigol();
        let lexador = new LexadorPotigol();

        describe('Cenários de sucesso', () => {
            describe('Entrada e saída', () => {
                it('Sucesso - Escreva Olá Mundo', async () => {
                    const retornoLexador = lexador.mapear(['escreva      "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva "Olá mundo"');
                });

                it('Sucesso - Imprima Olá Mundo', async () => {
                    const retornoLexador = lexador.mapear(['imprima                      "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);
                    
                    expect(linhasResultado).toHaveLength(1);
                    expect(linhasResultado[0]).toBe('imprima "Olá mundo"');
                });
            });

            describe('Operações matemáticas', () => {
                it('Sucesso - Operações encadeadas', async () => {
                    const retornoLexador = lexador.mapear(['escreva (2 *8)-(5  / 4^    7)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva (2 * 8) - (5 / 4 ^ 7)');
                });

                it('Sucesso - Mod e Div', async () => {
                    const retornoLexador = lexador.mapear(['escreva (100   mod   6  div 2)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva (100 mod 6 div 2)');
                });
            });

            describe('Operações lógicas', () => {
                it('Sucesso - Ou', async () => {
                    const retornoLexador = lexador.mapear(['escreva       verdadeiro   ou     falso'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva verdadeiro ou falso');
                });

                it('Sucesso - Não (sem acento)', async () => {
                    const retornoLexador = lexador.mapear(['escreva    nao         verdadeiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(3);
                    expect(linhasResultado[0]).toBe('escreva  nao verdadeiro');
                });

                it('Sucesso - Comparação de igualdade', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2==2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 == 2');
                });

                it('Sucesso - Comparação de desigualdade', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2<> 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 <> 2');
                });

                it('Sucesso - Comparação de menor', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 <2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 < 2');
                });

                it('Sucesso - Comparação de menor ou igual', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2<=2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 <= 2');
                });

                it('Sucesso - Comparação de maior', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2> 2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 > 2');
                });

                it('Sucesso - Comparação de maior ou igual', async () => {
                    const retornoLexador = lexador.mapear(['escreva 2 >=2'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 >= 2');
                });
            });

            describe('Atribuição de variáveis', () => {
                it('Sucesso - Declaração de inteiro constante, inferência', async () => {
                    const retornoLexador = lexador.mapear(['a=10'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('a = 10');
                });

                it('Sucesso - Declaração de caractere constante, dica de tipo', async () => {
                    const retornoLexador = lexador.mapear(["c:Real=3.5"], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('c: Real = 3.5');
                });

                it('Sucesso - Declaração de inteiro variável, inferência', async () => {
                    const retornoLexador = lexador.mapear(['var a:=10'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('var a := 10');
                });

                it('Sucesso - Declaração de múltiplas variáveis inteiras, inferência', async () => {
                    const retornoLexador = lexador.mapear(['var a, b, c := 10, 20, 30'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(4);
                    // TODO: Agrupar atribuições em uma linha.
                    // expect(linhasResultado[0]).toBe('var a, b, c := 10, 20, 30');
                });
            });

            describe('Estruturas de decisão', () => {
                it('Escolha', async () => {
                    const retornoLexador = lexador.mapear([
                        'escolha                         x',
                        'caso 1 => escreva "Um"',
                        '  caso 2 => escreva "Dois"',
                        'caso 3 => escreva    "Três"',
                        '  caso _=>escreva "Outro valor"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(7);
                    expect(linhasResultado[0]).toBe('escolha x');
                    expect(linhasResultado[1]).toContain('caso 1 => escreva "Um"');
                    expect(linhasResultado[2]).toContain('caso 2 => escreva "Dois"');
                    expect(linhasResultado[3]).toContain('caso 3 => escreva "Três"');
                    expect(linhasResultado[4]).toContain('caso _ => escreva "Outro valor"');
                    expect(linhasResultado[5]).toBe('fim');
                });

                it('Escolha com múltiplos casos e guarda', async () => {
                    const retornoLexador = lexador.mapear([
                        'escolha x',
                        'caso 1,2 se x>0 => escreva "Positivo"',
                        'caso _ => escreva "Outro"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(5);
                    expect(linhasResultado[0]).toBe('escolha x');
                    expect(linhasResultado[1]).toContain('caso 1, 2 se x > 0 => escreva "Positivo"');
                    expect(linhasResultado[2]).toContain('caso _ => escreva "Outro"');
                    expect(linhasResultado[3]).toBe('fim');
                });

                it('Se', async () => {
                    const retornoLexador = lexador.mapear([
                        'se    verdadeiro  então',
                        '              escreva "verdadeiro"',
                        '   senão',
                        '  escreva   "falso"',
                        '     fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(6);
                    expect(linhasResultado[0]).toBe('se verdadeiro entao');
                    expect(linhasResultado[1]).toContain('escreva "verdadeiro"');
                    expect(linhasResultado[2]).toContain('senao');
                    expect(linhasResultado[3]).toContain('escreva "falso"');
                    expect(linhasResultado[4]).toBe('fim');
                });

                it('Se-senao se-senao (cadeia elseif)', async () => {
                    const retornoLexador = lexador.mapear([
                        'se x > 0 entao',
                        '  escreva "positivo"',
                        'senao se x < 0 entao',
                        '  escreva "negativo"',
                        'senao',
                        '  escreva "zero"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado[0]).toBe('se x > 0 entao');
                    expect(linhasResultado[1]).toBe('    escreva "positivo"');
                    expect(linhasResultado[2]).toBe('senao se x < 0 entao');
                    expect(linhasResultado[3]).toBe('    escreva "negativo"');
                    expect(linhasResultado[4]).toBe('senao');
                    expect(linhasResultado[5]).toBe('    escreva "zero"');
                    expect(linhasResultado[6]).toBe('fim');
                });

                it('Se-senao se sem senao final', async () => {
                    const retornoLexador = lexador.mapear([
                        'se x > 0 entao',
                        '  escreva "positivo"',
                        'senao se x < 0 entao',
                        '  escreva "negativo"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado[0]).toBe('se x > 0 entao');
                    expect(linhasResultado[1]).toBe('    escreva "positivo"');
                    expect(linhasResultado[2]).toBe('senao se x < 0 entao');
                    expect(linhasResultado[3]).toBe('    escreva "negativo"');
                    expect(linhasResultado[4]).toBe('fim');
                });
            });

            describe('Estruturas de repetição', () => {
                it('Enquanto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var i    :=  0',
                        'enquanto     i<= 10     faça',
                        '       escreva    i',
                        'i:= i+1',
                        'fim'
                    ], -1);

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(5);
                    expect(linhasResultado[0]).toBe('var i := 0');
                    expect(linhasResultado[1]).toBe('enquanto i <= 10 faca');
                    expect(linhasResultado[2]).toContain('escreva i');
                    expect(linhasResultado[3]).toContain('i := i + 1');
                    expect(linhasResultado[4]).toBe('fim');
                });

                it('Para', async () => {
                    const retornoLexador = lexador.mapear([
                        'var soma:=0',
                        'para i    de  1     até 10   faça',
                        '             soma :=soma +     i',
                        '  fim',
                        '    escreva       "A soma é {soma}."'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(5);
                    expect(linhasResultado[0]).toBe('var soma := 0');
                    expect(linhasResultado[1]).toBe('para i de 1 ate 10 faca');
                    expect(linhasResultado[2]).toContain('soma := soma + i');
                    expect(linhasResultado[3]).toBe('fim');
                    expect(linhasResultado[4]).toBe('escreva "A soma é {soma}."');
                });

                it('Para gere', async () => {
                    const retornoLexador = lexador.mapear([
                        'para i de 1 até 5   gere',
                        'escreva i',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('para i de 1 ate 5 passo 1 gere');
                    expect(linhasResultado[1]).toBe('escreva i');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Para gere com guarda', async () => {
                    const retornoLexador = lexador.mapear([
                        'para i de 1 até 5 se i>2 gere',
                        'escreva i',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('para i de 1 ate 5 passo 1 se i > 2 gere');
                    expect(linhasResultado[1]).toBe('escreva i');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Para cada (for-each) sobre lista literal', async () => {
                    const retornoLexador = lexador.mapear([
                        'para x em [1, 2, 3] faca',
                        '  escreva x',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('para x em [1, 2, 3] faca');
                    expect(linhasResultado[1]).toBe('    escreva x');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Para cada (for-each) sobre variável', async () => {
                    const retornoLexador = lexador.mapear([
                        'lista = [10, 20]',
                        'para n em lista faca',
                        '  escreva n',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(4);
                    expect(linhasResultado[1]).toBe('para n em lista faca');
                    expect(linhasResultado[2]).toBe('    escreva n');
                    expect(linhasResultado[3]).toBe('fim');
                });
            });

            it('Função de uma linha, argumentos com tipo definido, sem dica de retorno', async () => {
                const retornoLexador = lexador.mapear([
                    'soma(  x:    Inteiro,y : Inteiro) =  x    +y'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                const linhasResultado = resultado.split(sistemaOperacional.EOL);

                expect(linhasResultado).toHaveLength(1);
                expect(linhasResultado[0]).toBe('soma(x: Inteiro, y: Inteiro) = x + y');
            });

            it('Função de uma linha, argumentos com tipo definido, com dica de retorno', async () => {
                const retornoLexador = lexador.mapear([
                    'soma( x :Inteiro,y:Inteiro        )  : Inteiro =  x  +y'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                const linhasResultado = resultado.split(sistemaOperacional.EOL);

                expect(linhasResultado).toHaveLength(1);
                expect(linhasResultado[0]).toBe('soma(x: Inteiro, y: Inteiro): Inteiro = x + y');
            });

            describe('Entrada de dados', () => {
                it('leia_inteiro', async () => {
                    const retornoLexador = lexador.mapear(['var x := leia_inteiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_inteiro');
                });

                it('leia_inteiros com argumento', async () => {
                    const retornoLexador = lexador.mapear(['var x := leia_inteiros(5)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_inteiros(5)');
                });

                it('leia_real', async () => {
                    const retornoLexador = lexador.mapear(['var x := leia_real'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_real');
                });

                it('leia_reais com argumento', async () => {
                    const retornoLexador = lexador.mapear(['var x := leia_reais(3)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_reais(3)');
                });

                it('leia_texto', async () => {
                    const retornoLexador = lexador.mapear(['var x := leia_texto'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_texto');
                });

                it('leia_textos com argumento', async () => {
                    const retornoLexador = lexador.mapear(['var x := leia_textos(10)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_textos(10)');
                });

                it('Atribuicao multipla de constantes com leia_inteiros', async () => {
                    const retornoLexador = lexador.mapear(['a, b = leia_inteiros(2)'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('a, b = leia_inteiros(2)');
                });
            });

            describe('Reatribuição de variáveis', () => {
                it('Reatribuição simples', async () => {
                    const retornoLexador = lexador.mapear([
                        'var x := 10',
                        'x := 20'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(2);
                    expect(linhasResultado[0]).toBe('var x := 10');
                    expect(linhasResultado[1]).toBe('x := 20');
                });

                it('Reatribuição com expressão', async () => {
                    const retornoLexador = lexador.mapear([
                        'var x := 10',
                        'x   :=   x   +   5'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(2);
                    expect(linhasResultado[0]).toBe('var x := 10');
                    expect(linhasResultado[1]).toBe('x := x + 5');
                });
            });


            describe('Constantes com tipos explícitos', () => {
                it('Constante com tipo Texto/Caractere', async () => {
                    const retornoLexador = lexador.mapear(['nome: Texto = "João"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('nome: Caractere = "João"');
                });

                it('Constante com tipo Inteiro', async () => {
                    const retornoLexador = lexador.mapear(['idade:   Inteiro   =   25'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('idade: Inteiro = 25');
                });

                it('Constante com tipo Logico', async () => {
                    const retornoLexador = lexador.mapear(['ativo: Logico = verdadeiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('ativo: Lógico = verdadeiro');
                });

                it('Constante com tipo Lógico (com acento)', async () => {
                    const retornoLexador = lexador.mapear(['ativo: Lógico = falso'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('ativo: Lógico = falso');
                });

                it('Alias de tipo', async () => {
                    const retornoLexador = lexador.mapear(['tipo   Medida=Inteiro'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('tipo Medida = Inteiro');
                });

                it('Importação com use', async () => {
                    const retornoLexador = lexador.mapear(['use    "./biblioteca"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('use "./biblioteca"');
                });

                it('Tipo abstrato', async () => {
                    const retornoLexador = lexador.mapear([
                        'tipo abstrato Figura',
                        '  lados: Inteiro',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('tipo abstrato Figura');
                    expect(linhasResultado[1]).toBe('    lados: Inteiro');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Tipo com metodo usando isto', async () => {
                    const retornoLexador = lexador.mapear([
                        'tipo Quadrado',
                        '  lado: Inteiro',
                        '  area() = isto.lado * isto.lado',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(4);
                    expect(linhasResultado[0]).toBe('tipo Quadrado');
                    expect(linhasResultado[1]).toBe('    lado: Inteiro');
                    expect(linhasResultado[2]).toBe('    area() = isto.lado * isto.lado');
                    expect(linhasResultado[3]).toBe('fim');
                });
            });

            describe('Operadores adicionais', () => {
                it('Operador lógico E (and)', async () => {
                    const retornoLexador = lexador.mapear(['escreva verdadeiro    e    falso'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('escreva verdadeiro e falso');
                });
            });

            describe('Referências e constantes', () => {
                it('Referência a constante', async () => {
                    const retornoLexador = lexador.mapear([
                        'PI = 3.14159',
                        'escreva PI'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(2);
                    expect(linhasResultado[0]).toBe('PI = 3.14159');
                    expect(linhasResultado[1]).toContain('PI');
                });

                it('Chamada de função global com argumentos', async () => {
                    const retornoLexador = lexador.mapear([
                        'escreva raiz( 27,3)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('escreva raiz(27, 3)');
                });

                it('Acesso de método/propriedade', async () => {
                    const retornoLexador = lexador.mapear([
                        'escreva texto.qual_tipo'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('escreva texto.qual_tipo');
                });

                it('Acesso por índice em vetor', async () => {
                    const retornoLexador = lexador.mapear([
                        'a = [1,2, 3]',
                        'escreva a[0]'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(2);
                    expect(linhasResultado[0]).toBe('a = [1, 2, 3]');
                    expect(linhasResultado[1]).toBe('escreva a[0]');
                });
            });

            describe('Casos adicionais', () => {
                it('Unário com operador de adição antes', async () => {
                    const retornoLexador = lexador.mapear(['escreva +5'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toContain('+');
                });

                it('Unário com operador de subtração antes', async () => {
                    const retornoLexador = lexador.mapear(['escreva -10'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toContain('-');
                });

                it('Escolha sem caminho padrão', async () => {
                    const retornoLexador = lexador.mapear([
                        'escolha x',
                        'caso 1 => escreva "Um"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('escolha x');
                    expect(linhasResultado[1]).toContain('caso 1');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Se sem caminho senao', async () => {
                    const retornoLexador = lexador.mapear([
                        'se verdadeiro então',
                        '  escreva "verdadeiro"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('se verdadeiro entao');
                    expect(linhasResultado[1]).toContain('escreva "verdadeiro"');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Função sem parâmetros e sem tipo de retorno', async () => {
                    const retornoLexador = lexador.mapear(['ola() = escreva "Olá"'], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toContain('ola()');
                });
            });

            describe('Declarações de tuplas', () => {
                it('Dupla', async () => {
                    const retornoLexador = lexador.mapear([
                        'var   t  :=(1 ,2)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2)');
                });

                it('Trio', async () => {
                    const retornoLexador = lexador.mapear([
                        '   var     t:=(1,2,   3 )'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3)');
                });

                it('Quarteto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t:=(1,2,3,4)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4)');
                });

                it('Quinteto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t :=( 1 ,   2,   3,4,   5   )'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5)');
                });

                it('Sexteto', async () => {
                    const retornoLexador = lexador.mapear([
                        '  var   t :=   ( 1, 2  ,  3 , 4 ,5,6)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6)');
                });

                it('Septeto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t:=( 1 ,   2 ,3, 4  ,5, 6  , 7  )'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7)');
                });

                it('Octeto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t:=(1,2,3,4,5,6,7,8)'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7, 8)');
                });

                it('Noneto', async () => {
                    const retornoLexador = lexador.mapear([
                        ' var  t  :=  (  1 , 2 , 3, 4 , 5  , 6  ,  7,    8 , 9    )'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7, 8, 9)');
                });

                it('Deceto', async () => {
                    const retornoLexador = lexador.mapear([
                        'var t :=( 1, 2  , 3   ,  4,     5,   6 ,  7,8, 9,10  )'
                    ], -1);
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)');
                });

            });
        });
    });
});
