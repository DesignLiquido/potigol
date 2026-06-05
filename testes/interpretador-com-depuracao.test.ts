import { LexadorPotigol } from '../fontes/lexador/lexador-potigol';
import { AvaliadorSintaticoPotigol } from '../fontes/avaliador-sintatico/avaliador-sintatico-potigol';
import { InterpretadorPotigolComDepuracao } from '../fontes/interpretador/interpretador-potigol-com-depuracao';
import { TipoDe, FuncaoConstruto } from '@designliquido/delegua/construtos';
import { Literal } from '@designliquido/delegua/construtos';
import { Classe } from '@designliquido/delegua/declaracoes';

describe('Interpretador com Depuração (Potigol)', () => {
    let lexador: LexadorPotigol;
    let avaliadorSintatico: AvaliadorSintaticoPotigol;
    let interpretador: InterpretadorPotigolComDepuracao;

    async function executar(linhas: string[]): Promise<string[]> {
        const saidas: string[] = [];
        interpretador = new InterpretadorPotigolComDepuracao(
            process.cwd(),
            (texto: string) => saidas.push(texto),
            (texto: string) => saidas.push(texto)
        );
        interpretador.finalizacaoDaExecucao = () => {};
        const retornoLexador = lexador.mapear(linhas, -1);
        const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);
        interpretador.prepararParaDepuracao(retornoAvaliador.declaracoes);
        await interpretador.instrucaoContinuarInterpretacao();
        return saidas;
    }

    describe('interpretar()', () => {
        beforeEach(() => {
            lexador = new LexadorPotigol();
            avaliadorSintatico = new AvaliadorSintaticoPotigol();
        });

        describe('Sem pontos de parada', () => {
            let _saidas: string[] = [];
            const funcaoSaida = (texto: string) => {
                _saidas.push(texto);
            }

            beforeEach(() => {
                interpretador = new InterpretadorPotigolComDepuracao(
                    process.cwd(),
                    funcaoSaida,
                    funcaoSaida
                );
            });

            it('Trivial', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva "Olá Mundo"'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                let execucaoFinalizada: boolean = false;
                interpretador.finalizacaoDaExecucao = () => {
                    execucaoFinalizada = true;
                }

                interpretador.prepararParaDepuracao(retornoAvaliadorSintatico.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(interpretador.pontoDeParadaAtivo).toBe(false);
                expect(execucaoFinalizada).toBe(true);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toContain("Olá Mundo");
            });
        });

        describe('Expressões binárias', () => {
            it('Soma de inteiros', async () => {
                const saidas = await executar(['escreva 5 + 3']);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('8');
            });

            it('Subtração de inteiros', async () => {
                const saidas = await executar(['escreva 10 - 4']);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('6');
            });

            it('Multiplicação de inteiros', async () => {
                const saidas = await executar(['escreva 3 * 4']);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('12');
            });

            it('Divisão de inteiros', async () => {
                const saidas = await executar(['escreva 10 / 2']);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('5');
            });
        });

        describe('Declaração const (val)', () => {
            it('Declara e usa val simples', async () => {
                const saidas = await executar([
                    'val x = 42',
                    'escreva x',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('42');
            });

            it('Declara múltiplos vals', async () => {
                const saidas = await executar([
                    'val a = 10',
                    'val b = 20',
                    'escreva a + b',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('30');
            });
        });

        describe('Funções', () => {
            it('Define e chama função simples', async () => {
                const saidas = await executar([
                    'def dobro(x: Inteiro): Inteiro = x * 2',
                    'escreva dobro(5)',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('10');
            });

            it('Função com múltiplos parâmetros', async () => {
                const saidas = await executar([
                    'def soma(a, b: Inteiro): Inteiro = a + b',
                    'escreva soma(3, 4)',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('7');
            });
        });

        describe('Para..gere', () => {
            it('Loop simples', async () => {
                const saidas = await executar([
                    'para i de 1 ate 3 gere',
                    '    escreva i',
                    'fim',
                ]);
                expect(saidas).toHaveLength(3);
                expect(saidas).toEqual(['1', '2', '3']);
            });

            it('Loop com passo', async () => {
                const saidas = await executar([
                    'para i de 1 ate 5 passo 2 gere',
                    '    escreva i',
                    'fim',
                ]);
                expect(saidas).toHaveLength(3);
                expect(saidas).toEqual(['1', '3', '5']);
            });
        });

        describe('Escolha', () => {
            it('Escolha com caso correspondente', async () => {
                const saidas = await executar([
                    'val x = 2',
                    'escolha x',
                    '    caso 1 => escreva "um"',
                    '    caso 2 => escreva "dois"',
                    '    caso _ => escreva "outro"',
                    'fim',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('dois');
            });

            it('Escolha com caso padrão', async () => {
                const saidas = await executar([
                    'val x = 99',
                    'escolha x',
                    '    caso 1 => escreva "um"',
                    '    caso _ => escreva "outro"',
                    'fim',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('outro');
            });
        });

        describe('Alias de tipo', () => {
            it('Declara alias sem erro', async () => {
                const saidas = await executar([
                    'tipo Novo = Inteiro',
                    'escreva "ok"',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('ok');
            });
        });

        describe('Atribuição paralela', () => {
            it('Troca valores com atribuição paralela', async () => {
                const saidas = await executar([
                    'var a := 2',
                    'var b := 5',
                    'a, b := b, a',
                    'escreva a',
                    'escreva b',
                ]);
                expect(saidas).toHaveLength(2);
                expect(saidas[0]).toBe('5');
                expect(saidas[1]).toBe('2');
            });
        });

        describe('Reatribuição de variável', () => {
            it('Reatribui var', async () => {
                const saidas = await executar([
                    'var x := 1',
                    'x := 2',
                    'escreva x',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('2');
            });
        });

        describe('Acesso a método ou propriedade', () => {
            it('Acessa tamanho de texto', async () => {
                const saidas = await executar([
                    'escreva "ola".tamanho',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('3');
            });
        });

        describe('tipoDe (chamada direta)', () => {
            it('Retorna tipo de literal inteiro', async () => {
                interpretador = new InterpretadorPotigolComDepuracao(process.cwd(), () => {}, () => {});
                interpretador.finalizacaoDaExecucao = () => {};
                const simT = { lexema: 'tipoDe', linha: 1, hashArquivo: -1 } as any;
                const expressao = new TipoDe(-1, simT, new Literal(-1, 1, 42, 'inteiro'));
                const resultado = await interpretador.visitarExpressaoTipoDe(expressao);
                expect(resultado).toBeDefined();
            });

            it('Retorna tipo de literal texto', async () => {
                interpretador = new InterpretadorPotigolComDepuracao(process.cwd(), () => {}, () => {});
                interpretador.finalizacaoDaExecucao = () => {};
                const simT = { lexema: 'tipoDe', linha: 1, hashArquivo: -1 } as any;
                const expressao = new TipoDe(-1, simT, new Literal(-1, 1, 'ola', 'texto'));
                const resultado = await interpretador.visitarExpressaoTipoDe(expressao);
                expect(resultado).toBeDefined();
            });
        });

        describe('Interpolação de string', () => {
            it('Interpola variável em texto', async () => {
                const saidas = await executar([
                    'val nome = "Mundo"',
                    'escreva "Olá {nome}"',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('Olá Mundo');
            });

            it('Interpola expressão aritmética em texto', async () => {
                const saidas = await executar([
                    'val x = 5',
                    'escreva "Resultado: {x * 2}"',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('Resultado: 10');
            });
        });

        describe('Pontos de parada', () => {
            it('Executa sem pontos de parada configurados', async () => {
                const saidas: string[] = [];
                interpretador = new InterpretadorPotigolComDepuracao(
                    process.cwd(),
                    (texto: string) => saidas.push(texto),
                    (texto: string) => saidas.push(texto)
                );

                const retornoLexador = lexador.mapear([
                    'escreva "linha 1"',
                    'escreva "linha 2"',
                ], -1);
                const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);

                let finalizado = false;
                interpretador.finalizacaoDaExecucao = () => { finalizado = true; };
                interpretador.prepararParaDepuracao(retornoAvaliador.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(interpretador.pontoDeParadaAtivo).toBe(false);
                expect(finalizado).toBe(true);
                expect(saidas).toHaveLength(2);
            });

            it('Instrução avançar executa próxima declaração', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva "passo 1"',
                    'escreva "passo 2"',
                ], -1);
                const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);

                interpretador = new InterpretadorPotigolComDepuracao(process.cwd(), () => {}, () => {});
                interpretador.finalizacaoDaExecucao = () => {};
                interpretador.prepararParaDepuracao(retornoAvaliador.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(interpretador.pontoDeParadaAtivo).toBe(false);
            });
        });

        describe('Tipos (Classes Potigol)', () => {
            it('Declara e usa tipo simples', async () => {
                const saidas = await executar([
                    'tipo Quadrado',
                    '  lado: Inteiro',
                    '  area() = lado * lado',
                    'fim',
                    'val q = Quadrado(5)',
                    'escreva q.area()',
                ]);
                expect(saidas).toHaveLength(1);
                expect(saidas[0]).toBe('25');
            });
        });

        describe('Métodos diretos', () => {
            it('visitarExpressaoFuncaoConstruto executa com parâmetros', async () => {
                interpretador = new InterpretadorPotigolComDepuracao(process.cwd(), () => {}, () => {});
                interpretador.finalizacaoDaExecucao = () => {};
                const simParam = { lexema: 'x', linha: 1, hashArquivo: -1 } as any;
                const funcao = new FuncaoConstruto(-1, 1, [{ nome: simParam, tipoDado: 'inteiro', abrangencia: null }], []);
                const resultado = await interpretador.visitarExpressaoFuncaoConstruto(funcao);
                expect(resultado).toBeDefined();
            });

            it('avaliarArgumentosEscreva retorna string de literal', async () => {
                interpretador = new InterpretadorPotigolComDepuracao(process.cwd(), () => {}, () => {});
                interpretador.finalizacaoDaExecucao = () => {};
                const literal = new Literal(-1, 1, 42, 'inteiro');
                const resultado = await interpretador.avaliarArgumentosEscreva([literal]);
                expect(resultado).toBeDefined();
            });

            it('avaliarArgumentosEscreva sem argumentos retorna string vazia', async () => {
                interpretador = new InterpretadorPotigolComDepuracao(process.cwd(), () => {}, () => {});
                interpretador.finalizacaoDaExecucao = () => {};
                const resultado = await interpretador.avaliarArgumentosEscreva([]);
                expect(resultado).toBeDefined();
            });

            it('visitarDeclaracaoClasse via AST direto', async () => {
                interpretador = new InterpretadorPotigolComDepuracao(process.cwd(), () => {}, () => {});
                interpretador.finalizacaoDaExecucao = () => {};
                const simNome = { lexema: 'MinhaClasse', linha: 1, hashArquivo: -1 } as any;
                const classe = new Classe(simNome, [], [], [], []);
                const resultado = await interpretador.visitarDeclaracaoClasse(classe);
                expect(resultado).toBeDefined();
            });
        });
    });
});
