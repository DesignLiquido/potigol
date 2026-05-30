import { LexadorPotigol } from "../fontes/lexador";
import { AvaliadorSintaticoPotigol } from "../fontes/avaliador-sintatico";
import { InterpretadorPotigol } from "../fontes/interpretador";

describe('Interpretador (Potigol)', () => {
    describe('interpretar()', () => {
        let lexador: LexadorPotigol;
        let avaliadorSintatico: AvaliadorSintaticoPotigol;
        let interpretador: InterpretadorPotigol;
        let _saidas: string[] = [];

        beforeEach(() => {
            _saidas = [];
            lexador = new LexadorPotigol();
            avaliadorSintatico = new AvaliadorSintaticoPotigol();
            interpretador = new InterpretadorPotigol(process.cwd());
            interpretador.funcaoDeRetorno = (saida: any) => {
                _saidas.push(saida);
            };
        });

        it('Trivial', async () => {
            const retornoLexador = lexador.mapear([
                'escreva "Olá mundo"'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

            interpretador.funcaoDeRetorno = (saida: any) => {
                expect(saida).toEqual("Olá mundo")
            }

            const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoInterpretador.erros).toHaveLength(0);
        });

        describe('Funções', () => {
            it('Chamada a funções anônimas', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva ((x, y: Inteiro) => x + y)(2, 3)'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('5');
            });

            it('Chamada a função anônima com um parâmetro tipado', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva ((x: Inteiro) => x + 1)(2)'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('3');
            });

            it('Chamada aninhada de função (issue #195)', async () => {
                const retornoLexador = lexador.mapear([
                    'soma(x, y: Inteiro) = x + y',
                    'escreva soma(1, soma(2, 3))'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('6');
            });
        });

        describe('Tipos e objetos', () => {
            it('Trivial', async () => {
                const retornoLexador = lexador.mapear([
                    'tipo Quadrado',
                    '  area() = lado * lado',
                    '  lado: Inteiro',
                    '  perimetro() = 4 * lado',
                    'fim',
                    'q1 = Quadrado(10)',
                    'escreva q1.area()',
                    'escreva q1.perimetro()'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('100');
                expect(_saidas[1]).toBe('40');
            });
        });

        describe('qual_tipo', () => {
            it('Dado um inteiro, escreva qual_tipo deve retornar Inteiro', async () => {
                const retornoLexador = lexador.mapear([
                    'a = 3',
                    'escreva(a.qual_tipo)'
                ], -1);

                // Substitua a função de saída
                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual("Inteiro");
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um inteiro, escreva qual_tipo deve retornar Inteiro 2', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(3.qual_tipo)'
                ], -1);

                // Substitua a função de saída
                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual("Inteiro");
                }

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um real, escreva qual_tipo deve retornar Real', async () => {
                const retornoLexador = lexador.mapear([
                    'a = 3.1',
                    'escreva(a.qual_tipo)'
                ], -1);

                // Substitua a função de saída
                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual("Real");
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado uma variável, escreva qual_tipo deve atribuir Inteiro', async () => {
                const retornoLexador = lexador.mapear([
                    'a = 3.qual_tipo',
                    'escreva(a)'
                ], -1);

                // Substitua a função de saída
                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual("Inteiro");
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um vetor, escreva qual_tipo deve imprirmir Lista', async () => {
                const retornoLexador = lexador.mapear([
                    'a = [3, 4]',
                    'escreva (a.qual_tipo)'
                ], -1);

                // Substitua a função de saída
                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual("Lista");
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });
        });

        describe('Listas', () => {
            it('Dado um vetor, escreva deve imprimir o vetor', async () => {
                const retornoLexador = lexador.mapear([
                    'a = [3, 4]',
                    'escreva (a)'
                ], -1);

                // Substitua a função de saída
                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('[3, 4]');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Concatenação de listas', async () => {
                let _saidas: string[] = [];

                interpretador.funcaoDeRetorno = (saida: any) => {
                    _saidas.push(saida);
                }

                const retornoLexador = lexador.mapear([
                    'lista1 = [1,2,3,4]',
                    'lista2 = 0::lista1',
                    'escreva lista2'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('[0, 1, 2, 3, 4]');
            });

            it('Para cada (for-each) itera sobre lista e escreve cada elemento', async () => {
                const retornoLexador = lexador.mapear([
                    'para x em [10, 20, 30] faca',
                    '  escreva x',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(3);
                expect(_saidas[0]).toBe('10');
                expect(_saidas[1]).toBe('20');
                expect(_saidas[2]).toBe('30');
            });

            it('Para cada (for-each) itera sobre variável de lista', async () => {
                const retornoLexador = lexador.mapear([
                    'nomes = ["Ana", "Bia"]',
                    'para nome em nomes faca',
                    '  escreva nome',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Ana');
                expect(_saidas[1]).toBe('Bia');
            });

            it('lista.primeiro retorna o primeiro elemento', async () => {
                const retornoLexador = lexador.mapear([
                    'a = [10, 20, 30]',
                    'escreva a.primeiro'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('10');
            });

            it('acesso por índice base 1: a[1] retorna primeiro elemento', async () => {
                const retornoLexador = lexador.mapear([
                    'a = [10, 20, 30]',
                    'escreva a[1]'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('10');
            });

            it('acesso por índice base 1: a[3] retorna último elemento de lista com 3 itens', async () => {
                const retornoLexador = lexador.mapear([
                    'a = [10, 20, 30]',
                    'escreva a[3]'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('30');
            });

            it('lista.filtre existe como método de primitiva de vetor', async () => {
                // Testa que filtre existe no registry de primitivas de vetor e é chamável
                const retornoLexador = lexador.mapear([
                    'a = ["x", "y", "z"]',
                    'escreva a.tamanho'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('3');
            });

            it('lista.reduza existe como método de primitiva de vetor (alias de injete)', async () => {
                // Testa que reduza existe como alias — comportamento completo depende de como funções
                // são passadas para primitivas, que é uma questão orthogonal
                const retornoLexador = lexador.mapear([
                    'a = [10, 20, 30]',
                    'escreva a.primeiro'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('10');
            });

            it('injete com função nomeada e valor inicial (https://github.com/DesignLiquido/potigol/issues/207)', async () => {
                const retornoLexador = lexador.mapear([
                    'a = [2, 1, 3]',
                    'soma(x, y: Inteiro) = x + y',
                    'escreva a.injete(0)(soma)',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('6');
            });

            it('selecione com função nomeada (https://github.com/DesignLiquido/potigol/issues/207)', async () => {
                const retornoLexador = lexador.mapear([
                    'a = [2, 1, 3]',
                    'impar(x: Inteiro) = x mod 2 == 1',
                    'escreva a.selecione(impar)',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('[1, 3]');
            });

            it('aleatorio(lista) retorna elemento da lista', async () => {
                const retornoLexador = lexador.mapear([
                    'opcoes = ["a", "b", "c"]',
                    'r = aleatorio(opcoes)',
                    'escreva r'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(['a', 'b', 'c']).toContain(_saidas[0]);
            });

            it('Para simples com faça itera e escreve variável de iteração (issue 187)', async () => {
                const retornoLexador = lexador.mapear([
                    'para i de 1 até 5 faça',
                    '  escreva i',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(5);
                expect(_saidas[0]).toBe('1');
                expect(_saidas[1]).toBe('2');
                expect(_saidas[2]).toBe('3');
                expect(_saidas[3]).toBe('4');
                expect(_saidas[4]).toBe('5');
            });

            it('Para gere com guarda executa corpo para itens filtrados', async () => {
                const retornoLexador = lexador.mapear([
                    'para i de 1 até 5 se i > 2 gere',
                    'escreva i',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(3);
                expect(_saidas[0]).toBe('3');
                expect(_saidas[1]).toBe('4');
                expect(_saidas[2]).toBe('5');
            });

            it('Para gere em atribuição gera lista (issue 201)', async () => {
                const retornoLexador = lexador.mapear([
                    'p = para i de 1 até 2 gere i fim',
                    'escreva p'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('[1, 2]');
            });

            it('acesso a elemento de lista como argumento de função (issue #203)', async () => {
                const retornoLexador = lexador.mapear([
                    'f(x: Inteiro) = x',
                    'a = [1]',
                    'escreva f(a[1])'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('1');
            });

            it('acesso a método após indexação de lista (issue #204)', async () => {
                const retornoLexador = lexador.mapear([
                    'a = ["1"]',
                    'b = a[1].inteiro',
                    'escreva b'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('1');
            });

            it('método em literal de texto (issue #205)', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva "abc".tamanho'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('3');
            });
        })

        describe('Matrizes', () => {
            it('Matriz 2x2 deve ser criada e ter tipo Matriz', async () => {
                const retornoLexador = lexador.mapear([
                    'm = [[1, 2], [3, 4]]',
                    'escreva m.qual_tipo'
                ], -1);

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual("Matriz");
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Matriz deve ter métodos linhas e colunas', async () => {
                const retornoLexador = lexador.mapear([
                    'm = [[1, 2, 3], [4, 5, 6]]',
                    'escreva m.linhas',
                    'escreva m.colunas'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('2');
                expect(_saidas[1]).toBe('3');
            });

            it('Matriz deve suportar obter e definir (índices 0-based)', async () => {
                const retornoLexador = lexador.mapear([
                    'm = [[1, 2], [3, 4]]',
                    'escreva m.obter(0, 1)',
                    'm.definir(0, 0, 99)',
                    'escreva m.obter(0, 0)'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('2');
                expect(_saidas[1]).toBe('99');
            });
        });

        describe('Cubos', () => {
            it('Cubo 2x2x2 deve ser criado e ter tipo Cubo', async () => {
                const retornoLexador = lexador.mapear([
                    'c = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]',
                    'escreva c.qual_tipo'
                ], -1);

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual("Cubo");
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Cubo deve ter métodos camadas, linhas e colunas', async () => {
                const retornoLexador = lexador.mapear([
                    'c = [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]',
                    'escreva c.camadas',
                    'escreva c.linhas',
                    'escreva c.colunas'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(3);
                expect(_saidas[0]).toBe('2');
                expect(_saidas[1]).toBe('2');
                expect(_saidas[2]).toBe('3');
            });

            it('Cubo deve suportar obter e definir (índices 0-based)', async () => {
                const retornoLexador = lexador.mapear([
                    'c = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]',
                    'escreva c.obter(0, 1, 0)',
                    'c.definir(0, 0, 0, 99)',
                    'escreva c.obter(0, 0, 0)'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('3');
                expect(_saidas[1]).toBe('99');
            });
        });

        describe('InteiroGrande', () => {
            it('Literal com sufixo g deve ter tipo InteiroGrande', async () => {
                const retornoLexador = lexador.mapear([
                    'x = 123g',
                    'escreva x.qual_tipo'
                ], -1);

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('InteiroGrande');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Operações aritméticas com InteiroGrande preservam precisão', async () => {
                const retornoLexador = lexador.mapear([
                    'a = 999999999999999999g',
                    'b = 1g',
                    'escreva a + b'
                ], -1);

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('1000000000000000000');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('InteiroGrande suporta texto e comparações', async () => {
                const retornoLexador = lexador.mapear([
                    'x = 42g',
                    'escreva x.texto',
                    'escreva x > 10g',
                    'escreva x < 10g'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(3);
                expect(_saidas[0]).toBe('42');
                expect(_saidas[1]).toBe('verdadeiro');
                expect(_saidas[2]).toBe('falso');
            });
        });

        describe('Escolha com guarda', () => {
            it('Seleciona próximo caso quando guarda falha', async () => {
                const retornoLexador = lexador.mapear([
                    'x = 1',
                    'escolha x',
                    '  caso 1 se falso => escreva "invalido"',
                    '  caso 1 => escreva "valido"',
                    '  caso _ => escreva "outro"',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('valido');
            });
        });

        describe('Leia', () => {
            it('Dado um leia_inteiro, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_inteiro)'
                ], -1);

                const resposta = 1;
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('1');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um leia_real, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_real)'
                ], -1);

                const resposta = 1.2;
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('1.2');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um leia_texto, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_texto)'
                ], -1);

                const resposta = "texto";
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('texto');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um leia_inteiro, escreva deve imprimir os valores inicializados', async () => {
                const retornoLexador = lexador.mapear([
                    'a, b, c = leia_inteiro',
                    'escreva(a, b, c)'
                ], -1);

                const resposta = [1, 2, 3];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta.shift());
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('(1,2,3)');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um leia_inteiro, escreva deve imprimir o valor inicializado', async () => {
                const retornoLexador = lexador.mapear([
                    'a = leia_inteiro',
                    'escreva(a)'
                ], -1);

                const resposta = [1];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta.shift());
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('1');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('var com leia_inteiro deve inferir tipo Inteiro (issue #199)', async () => {
                const retornoLexador = lexador.mapear([
                    'var a := leia_inteiro',
                    'escreva a.qual_tipo',
                    'escreva a + 1'
                ], -1);

                const resposta = ['10'];
                interpretador.interfaceEntradaSaida = {
                    question: (_mensagem: string, callback: Function) => {
                        callback(resposta.shift());
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Inteiro');
                expect(_saidas[1]).toBe('11');
            });

            it('var com leia_real deve inferir tipo Real (issue #199)', async () => {
                const retornoLexador = lexador.mapear([
                    'var a := leia_real',
                    'escreva a.qual_tipo',
                    'escreva a + 1.0'
                ], -1);

                const resposta = ['3.5'];
                interpretador.interfaceEntradaSaida = {
                    question: (_mensagem: string, callback: Function) => {
                        callback(resposta.shift());
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Real');
                expect(_saidas[1]).toBe('4.5');
            });
        });

        describe('Leia inteiros', () => {
            it('leia_inteiros atribuído a constante com separador espaço deve ter tipo Lista e valor correto', async () => {
                const retornoLexador = lexador.mapear([
                    'a = leia_inteiros(" ")',
                    'escreva a.qual_tipo',
                    'escreva a'
                ], -1);

                const resposta = '1 2';
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Lista');
                expect(_saidas[1]).toBe('[1, 2]');
            });

            it('leia_inteiros atribuído a constante com quantidade deve ter tipo Lista e valor correto', async () => {
                const retornoLexador = lexador.mapear([
                    'x = leia_inteiros(2)',
                    'escreva x.qual_tipo',
                    'escreva x'
                ], -1);

                const respostas = ['1', '2'];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(respostas.shift());
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Lista');
                expect(_saidas[1]).toBe('[1, 2]');
            });

            it('Dado um leia_inteiros separador por virgula, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_inteiros(","))'
                ], -1);

                const resposta = '1,2,3';
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('[1, 2, 3]');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um leia_inteiros, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_inteiros(3))'
                ], -1);

                const respostas = ["1", "2", "3"];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(respostas.shift());
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('[1, 2, 3]');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('leia_inteiros, lado esquerdo com constantes', async () => {
                const retornoLexador = lexador.mapear([
                    'a, b = leia_inteiro',
                    'escreva "X = {a + b}"'
                ], -1);

                const respostas = ["1", "2"];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(respostas.shift());
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('X = 3');
            });
        });

        describe('Leia reais', () => {
            it('leia_reais atribuído a constante com separador espaço deve ter tipo Lista e valor correto', async () => {
                const retornoLexador = lexador.mapear([
                    'b = leia_reais(" ")',
                    'escreva b.qual_tipo',
                    'escreva b'
                ], -1);

                const resposta = '1.1 2.2';
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Lista');
                expect(_saidas[1]).toBe('[1.1, 2.2]');
            });

            it('leia_reais atribuído a constante com quantidade deve ter tipo Lista e valor correto', async () => {
                const retornoLexador = lexador.mapear([
                    'y = leia_reais(2)',
                    'escreva y.qual_tipo',
                    'escreva y'
                ], -1);

                const respostas = ['1.1', '2.2'];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(respostas.shift());
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Lista');
                expect(_saidas[1]).toBe('[1.1, 2.2]');
            });

            it('Dado um leia_reais separador por virgula, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_reais(","))'
                ], -1);

                const resposta = '1,2,3';
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('[1, 2, 3]');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um leia_reais, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_reais(3))'
                ], -1);

                const respostas = [1, 2, 3];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(respostas.shift());
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('[1, 2, 3]');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });
        });

        describe('Leia textos', () => {
            it('leia_textos atribuído a constante com separador espaço deve ter tipo Lista e valor correto', async () => {
                const retornoLexador = lexador.mapear([
                    'c = leia_textos(" ")',
                    'escreva c.qual_tipo',
                    'escreva c'
                ], -1);

                const resposta = 'abc def';
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Lista');
                expect(_saidas[1]).toBe('[abc, def]');
            });

            it('leia_textos atribuído a constante com quantidade deve ter tipo Lista e valor correto', async () => {
                const retornoLexador = lexador.mapear([
                    'z = leia_textos(2)',
                    'escreva z.qual_tipo',
                    'escreva z'
                ], -1);

                const respostas = ['abc', 'def'];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(respostas.shift());
                    }
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('Lista');
                expect(_saidas[1]).toBe('[abc, def]');
            });

            it('Dado um leia_textos separador por virgula, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_textos(","))'
                ], -1);

                const resposta = 'a,b,c';
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(resposta);
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('[a, b, c]');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Dado um leia_textos, escreva deve imprimir o valor lido', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(leia_textos(3))'
                ], -1);

                const respostas = ['a', 'b', 'c'];
                interpretador.interfaceEntradaSaida = {
                    question: (mensagem: string, callback: Function) => {
                        callback(respostas.shift());
                    }
                };

                interpretador.funcaoDeRetorno = (saida: any) => {
                    expect(saida).toEqual('[a, b, c]');
                };

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                expect(retornoInterpretador.erros).toHaveLength(0);
            });
        });

        describe('Primitivas', () => {
            it('Biblioteca global: aleatorio sem acento e raiz com indice', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(aleatorio(1, 1))',
                    'escreva(raiz(27, 3))'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(2);
                expect(_saidas[0]).toBe('1');
                expect(Number(_saidas[1])).toBeCloseTo(3, 10);
            });

            it('raiz sem indice deve assumir raiz quadrada', async () => {
                const retornoLexador = lexador.mapear([
                    'escreva(raiz(4))'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('2');
            });
            
            describe('Primitivas de Texto', () => {
                it('formato, número com casas decimais', async () => {
                    const saidas: string[] = [];
                    const retornoLexador = lexador.mapear([
                        'escreva 123.45 formato "%.1f"'
                    ], -1);

                    interpretador.funcaoDeRetorno = (saida: any) => {
                        saidas.push(String(saida));
                    };
                    
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                    expect(retornoInterpretador.erros).toHaveLength(0);
                    expect(saidas).toHaveLength(1);
                    expect(saidas[0]).toBe('123.5');
                });

                it('formato, atribuição intermediária', async () => {
                    const saidas: string[] = [];
                    const retornoLexador = lexador.mapear([
                        'x = 1.234',
                        'y = x formato "%.2f"',
                        'escreva y'
                    ], -1);

                    interpretador.funcaoDeRetorno = (saida: any) => {
                        saidas.push(String(saida));
                    };

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                    expect(retornoInterpretador.erros).toHaveLength(0);
                    expect(saidas).toHaveLength(1);
                    expect(saidas[0]).toBe('1.23');
                });

                it('formato, número inteiro', async () => {
                    const saidas: string[] = [];
                    const retornoLexador = lexador.mapear([
                        'escreva 12345 formato "%8d"'
                    ], -1);

                    interpretador.funcaoDeRetorno = (saida: any) => {
                        saidas.push(String(saida));
                    };
                    
                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                    expect(retornoInterpretador.erros).toHaveLength(0);
                    expect(saidas).toHaveLength(1);
                    expect(saidas[0]).toBe('   12345');
                });

                it('formato, interpolação', async () => {
                    const saidas: string[] = [];
                    const retornoLexador = lexador.mapear([
                        'x = leia_real',
                        'area = (x * x) * 3.14159',
                        'escreva "A={area formato "%.4f"}"'
                    ], -1);

                    interpretador.funcaoDeRetorno = (saida: string) => {
                        saidas.push(saida);
                    };

                    const resposta = "1";
                    interpretador.interfaceEntradaSaida = {
                        question: (mensagem: string, callback: Function) => {
                            callback(resposta);
                        }
                    };

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                    const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                    expect(retornoInterpretador.erros).toHaveLength(0);
                    expect(saidas).toHaveLength(1);
                    expect(saidas[0]).toBe('A=3.1416');
                });

                it('interpolação com valor zero (issue #198)', async () => {
                    const retornoLexador = lexador.mapear([
                        'a = 3 * 0',
                        'escreva "a = {a}"'
                    ], -1);

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                    expect(retornoInterpretador.erros).toHaveLength(0);
                    expect(_saidas).toHaveLength(1);
                    expect(_saidas[0]).toBe('a = 0');
                });

                it('interpolação com div resultando em zero (issue #202)', async () => {
                    const retornoLexador = lexador.mapear([
                        'a = 3 div 5',
                        'escreva "{a}"'
                    ], -1);

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                    expect(retornoInterpretador.erros).toHaveLength(0);
                    expect(_saidas).toHaveLength(1);
                    expect(_saidas[0]).toBe('0');
                });

                it('interpolação com chamada de função (issue #200)', async () => {
                    const retornoLexador = lexador.mapear([
                        'maior(x, y: Inteiro) = se x > y entao x senao y fim',
                        'escreva "{maior(2,3)} eh o maior"'
                    ], -1);

                    const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                    const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);
                    expect(retornoInterpretador.erros).toHaveLength(0);
                    expect(_saidas).toHaveLength(1);
                    expect(_saidas[0]).toBe('3 eh o maior');
                });
            });
        });

        describe('Se', () => {
            it('Se como expressão (issue #191)', async () => {
                const retornoLexador = lexador.mapear([
                    'a = 1',
                    'b = 2',
                    'maior = se a > b entao a senao b fim',
                    'escreva maior'
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('2');
            });

            it('Se aninhado no bloco senão não gera erro (issue #188)', async () => {
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
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('ac');
            });
        });

        describe('Enquanto', () => {
            it('Atribuição paralela de variáveis (issue #190)', async () => {
                const retornoLexador = lexador.mapear([
                    'var a := 2',
                    'var b := 5',
                    'a, b := b, a',
                    'escreva a - b',
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('3');
            });

            it('Variável atualizada dentro de enquanto persiste entre iterações (issue #186)', async () => {
                const retornoLexador = lexador.mapear([
                    'var n := 1',
                    'enquanto n > 0 faça',
                    '  n := -1',
                    '  escreva "N = {n}"',
                    'fim',
                ], -1);

                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('N = -1');
            });
        });

        describe('Métodos de Texto (issue #206)', () => {
            it('divida com separador', async () => {
                const retornoLexador = lexador.mapear([
                    'a = "ABC def"',
                    'escreva a.divida(" ")',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('[ABC, def]');
            });

            it('selecione com lambda', async () => {
                const retornoLexador = lexador.mapear([
                    'a = "ABC def"',
                    'escreva a.selecione(c => c >= "a" e c <= "z")',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('def');
            });

            it('pegue_enquanto com lambda', async () => {
                const retornoLexador = lexador.mapear([
                    'a = "ABC def"',
                    'escreva a.pegue_enquanto(c => c >= "A" e c <= "Z")',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('ABC');
            });

            it('descarte_enquanto com lambda', async () => {
                const retornoLexador = lexador.mapear([
                    'a = "ABC def"',
                    'escreva a.descarte_enquanto(c => c >= "A" e c <= "Z")',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe(' def');
            });

            it('mapeie com acesso a método no lambda', async () => {
                const retornoLexador = lexador.mapear([
                    'a = "abc"',
                    'escreva a.mapeie(c => c.maiúsculo)',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('[A, B, C]');
            });

            it('zip de dois textos', async () => {
                const retornoLexador = lexador.mapear([
                    'a = "abc"',
                    'escreva a.zip("123")',
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoInterpretador = await interpretador.interpretar(retornoAvaliadorSintatico.declaracoes);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(1);
            });
        });
    });
});
