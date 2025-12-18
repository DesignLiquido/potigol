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
                it('Sucesso - Escreva Olá Mundo', () => {
                    const retornoLexador = lexador.mapear(['escreva      "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva "Olá mundo"');
                });

                it('Sucesso - Imprima Olá Mundo', () => {
                    const retornoLexador = lexador.mapear(['imprima                      "Olá mundo"'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);
                    
                    expect(linhasResultado).toHaveLength(1);
                    expect(linhasResultado[0]).toBe('imprima "Olá mundo"');
                });
            });

            describe('Operações matemáticas', () => {
                it('Sucesso - Operações encadeadas', () => {
                    const retornoLexador = lexador.mapear(['escreva (2 *8)-(5  / 4^    7)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva (2 * 8) - (5 / 4 ^ 7)');
                });

                it('Sucesso - Mod e Div', () => {
                    const retornoLexador = lexador.mapear(['escreva (100   mod   6  div 2)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva (100 mod 6 div 2)');
                });
            });

            describe('Operações lógicas', () => {
                it('Sucesso - Ou', () => {
                    const retornoLexador = lexador.mapear(['escreva       verdadeiro   ou     falso'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva verdadeiro ou falso');
                });

                it('Sucesso - Não (sem acento)', () => {
                    const retornoLexador = lexador.mapear(['escreva    nao         verdadeiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(3);
                    expect(linhasResultado[0]).toBe('escreva  nao verdadeiro');
                });

                it('Sucesso - Comparação de igualdade', () => {
                    const retornoLexador = lexador.mapear(['escreva 2==2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 == 2');
                });

                it('Sucesso - Comparação de desigualdade', () => {
                    const retornoLexador = lexador.mapear(['escreva 2<> 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 <> 2');
                });

                it('Sucesso - Comparação de menor', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 <2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 < 2');
                });

                it('Sucesso - Comparação de menor ou igual', () => {
                    const retornoLexador = lexador.mapear(['escreva 2<=2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 <= 2');
                });

                it('Sucesso - Comparação de maior', () => {
                    const retornoLexador = lexador.mapear(['escreva 2> 2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 > 2');
                });

                it('Sucesso - Comparação de maior ou igual', () => {
                    const retornoLexador = lexador.mapear(['escreva 2 >=2'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('escreva 2 >= 2');
                });
            });

            describe('Atribuição de variáveis', () => {
                it('Sucesso - Declaração de inteiro constante, inferência', () => {
                    const retornoLexador = lexador.mapear(['a=10'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('a = 10');
                });

                it('Sucesso - Declaração de caractere constante, dica de tipo', () => {
                    const retornoLexador = lexador.mapear(["c:Real=3.5"], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('c: Real = 3.5');
                });

                it('Sucesso - Declaração de inteiro variável, inferência', () => {
                    const retornoLexador = lexador.mapear(['var a:=10'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(2);
                    expect(linhasResultado[0]).toBe('var a := 10');
                });

                it('Sucesso - Declaração de múltiplas variáveis inteiras, inferência', () => {
                    const retornoLexador = lexador.mapear(['var a, b, c := 10, 20, 30'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(4);
                    // TODO: Agrupar atribuições em uma linha.
                    // expect(linhasResultado[0]).toBe('var a, b, c := 10, 20, 30');
                });
            });

            describe('Estruturas de decisão', () => {
                it('Escolha', () => {
                    const retornoLexador = lexador.mapear([
                        'escolha                         x',
                        'caso 1 => escreva "Um"',
                        '  caso 2 => escreva "Dois"',
                        'caso 3 => escreva    "Três"',
                        '  caso _=>escreva "Outro valor"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
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

                it('Se', () => {
                    const retornoLexador = lexador.mapear([
                        'se    verdadeiro  então',
                        '              escreva "verdadeiro"',
                        '   senão',
                        '  escreva   "falso"',
                        '     fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado).toHaveLength(6);
                    expect(linhasResultado[0]).toBe('se verdadeiro entao');
                    expect(linhasResultado[1]).toContain('escreva "verdadeiro"');
                    expect(linhasResultado[2]).toContain('senao');
                    expect(linhasResultado[3]).toContain('escreva "falso"');
                    expect(linhasResultado[4]).toBe('fim');
                });
            });

            describe('Estruturas de repetição', () => {
                it('Enquanto', () => {
                    const retornoLexador = lexador.mapear([
                        'var i    :=  0',
                        'enquanto     i<= 10     faça',
                        '       escreva    i',
                        'i:= i+1',
                        'fim'
                    ], -1);

                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(5);
                    expect(linhasResultado[0]).toBe('var i := 0');
                    expect(linhasResultado[1]).toBe('enquanto i <= 10 faca');
                    expect(linhasResultado[2]).toContain('escreva i');
                    expect(linhasResultado[3]).toContain('i := i + 1');
                    expect(linhasResultado[4]).toBe('fim');
                });

                it('Para', () => {
                    const retornoLexador = lexador.mapear([
                        'var soma:=0',
                        'para i    de  1     até 10   faça',
                        '             soma :=soma +     i',
                        '  fim',
                        '    escreva       "A soma é {soma}."'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(5);
                    expect(linhasResultado[0]).toBe('var soma := 0');
                    expect(linhasResultado[1]).toBe('para i de 1 ate 10 faca');
                    expect(linhasResultado[2]).toContain('soma := soma + i');
                    expect(linhasResultado[3]).toBe('fim');
                    expect(linhasResultado[4]).toBe('escreva "A soma é {soma}."');
                });
            });

            it('Função de uma linha, argumentos com tipo definido, sem dica de retorno', () => {
                const retornoLexador = lexador.mapear([
                    'soma(  x:    Inteiro,y : Inteiro) =  x    +y'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                const linhasResultado = resultado.split(sistemaOperacional.EOL);

                expect(linhasResultado).toHaveLength(1);
                expect(linhasResultado[0]).toBe('soma(x: Inteiro, y: Inteiro) = x + y');
            });

            it('Função de uma linha, argumentos com tipo definido, com dica de retorno', () => {
                const retornoLexador = lexador.mapear([
                    'soma( x :Inteiro,y:Inteiro        )  : Inteiro =  x  +y'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                const linhasResultado = resultado.split(sistemaOperacional.EOL);

                expect(linhasResultado).toHaveLength(1);
                expect(linhasResultado[0]).toBe('soma(x: Inteiro, y: Inteiro): Inteiro = x + y');
            });

            describe('Entrada de dados', () => {
                it('leia_inteiro', () => {
                    const retornoLexador = lexador.mapear(['var x := leia_inteiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_inteiro');
                });

                it('leia_inteiros com argumento', () => {
                    const retornoLexador = lexador.mapear(['var x := leia_inteiros(5)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_inteiros(5)');
                });

                it('leia_real', () => {
                    const retornoLexador = lexador.mapear(['var x := leia_real'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_real');
                });

                it('leia_reais com argumento', () => {
                    const retornoLexador = lexador.mapear(['var x := leia_reais(3)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_reais(3)');
                });

                it('leia_texto', () => {
                    const retornoLexador = lexador.mapear(['var x := leia_texto'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_texto');
                });

                it('leia_textos com argumento', () => {
                    const retornoLexador = lexador.mapear(['var x := leia_textos(10)'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var x := leia_textos(10)');
                });
            });

            describe('Reatribuição de variáveis', () => {
                it('Reatribuição simples', () => {
                    const retornoLexador = lexador.mapear([
                        'var x := 10',
                        'x := 20'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(2);
                    expect(linhasResultado[0]).toBe('var x := 10');
                    expect(linhasResultado[1]).toBe('x := 20');
                });

                it('Reatribuição com expressão', () => {
                    const retornoLexador = lexador.mapear([
                        'var x := 10',
                        'x   :=   x   +   5'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(2);
                    expect(linhasResultado[0]).toBe('var x := 10');
                    expect(linhasResultado[1]).toBe('x := x + 5');
                });
            });


            describe('Constantes com tipos explícitos', () => {
                it('Constante com tipo Texto/Caractere', () => {
                    const retornoLexador = lexador.mapear(['nome: Texto = "João"'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('nome: Caractere = "João"');
                });

                it('Constante com tipo Inteiro', () => {
                    const retornoLexador = lexador.mapear(['idade:   Inteiro   =   25'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('idade: Inteiro = 25');
                });

                it('Constante com tipo Logico', () => {
                    const retornoLexador = lexador.mapear(['ativo: Logico = verdadeiro'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('ativo: Lógico = verdadeiro');
                });

                it('Constante com tipo Lógico (com acento)', () => {
                    const retornoLexador = lexador.mapear(['ativo: Lógico = falso'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('ativo: Lógico = falso');
                });
            });

            describe('Operadores adicionais', () => {
                it('Operador lógico E (and)', () => {
                    const retornoLexador = lexador.mapear(['escreva verdadeiro    e    falso'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('escreva verdadeiro e falso');
                });
            });

            describe('Referências e constantes', () => {
                it('Referência a constante', () => {
                    const retornoLexador = lexador.mapear([
                        'PI = 3.14159',
                        'escreva PI'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(2);
                    expect(linhasResultado[0]).toBe('PI = 3.14159');
                    expect(linhasResultado[1]).toContain('PI');
                });
            });

            describe('Casos adicionais', () => {
                it('Unário com operador de adição antes', () => {
                    const retornoLexador = lexador.mapear(['escreva +5'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toContain('+');
                });

                it('Unário com operador de subtração antes', () => {
                    const retornoLexador = lexador.mapear(['escreva -10'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toContain('-');
                });

                it('Escolha sem caminho padrão', () => {
                    const retornoLexador = lexador.mapear([
                        'escolha x',
                        'caso 1 => escreva "Um"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('escolha x');
                    expect(linhasResultado[1]).toContain('caso 1');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Se sem caminho senao', () => {
                    const retornoLexador = lexador.mapear([
                        'se verdadeiro então',
                        '  escreva "verdadeiro"',
                        'fim'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(3);
                    expect(linhasResultado[0]).toBe('se verdadeiro entao');
                    expect(linhasResultado[1]).toContain('escreva "verdadeiro"');
                    expect(linhasResultado[2]).toBe('fim');
                });

                it('Função sem parâmetros e sem tipo de retorno', () => {
                    const retornoLexador = lexador.mapear(['ola() = escreva "Olá"'], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toContain('ola()');
                });
            });

            describe('Declarações de tuplas', () => {
                it('Dupla', () => {
                    const retornoLexador = lexador.mapear([
                        'var   t  :=(1 ,2)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2)');
                });

                it('Trio', () => {
                    const retornoLexador = lexador.mapear([
                        '   var     t:=(1,2,   3 )'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3)');
                });

                it('Quarteto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t:=(1,2,3,4)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4)');
                });

                it('Quinteto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t :=( 1 ,   2,   3,4,   5   )'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5)');
                });

                it('Sexteto', () => {
                    const retornoLexador = lexador.mapear([
                        '  var   t :=   ( 1, 2  ,  3 , 4 ,5,6)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6)');
                });

                it('Septeto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t:=( 1 ,   2 ,3, 4  ,5, 6  , 7  )'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7)');
                });

                it('Octeto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t:=(1,2,3,4,5,6,7,8)'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7, 8)');
                });

                it('Noneto', () => {
                    const retornoLexador = lexador.mapear([
                        ' var  t  :=  (  1 , 2 , 3, 4 , 5  , 6  ,  7,    8 , 9    )'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7, 8, 9)');
                });

                it('Deceto', () => {
                    const retornoLexador = lexador.mapear([
                        'var t :=( 1, 2  , 3   ,  4,     5,   6 ,  7,8, 9,10  )'
                    ], -1);
                    const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                    const resultado = formatadorPotigol.formatar(retornoAvaliadorSintatico.declaracoes);
                    const linhasResultado = resultado.split(sistemaOperacional.EOL);

                    expect(linhasResultado.length).toBeGreaterThanOrEqual(1);
                    expect(linhasResultado[0]).toBe('var t := (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)');
                });
            });
        });
    });
});
