import { DeleguaFuncao } from '@designliquido/delegua/interpretador/estruturas';
import { Binario, FuncaoConstruto, Literal, Variavel } from '@designliquido/delegua/construtos';
import { Retorna } from '@designliquido/delegua/declaracoes';
import { ParametroInterface } from '@designliquido/delegua/interfaces';
import { Simbolo } from '@designliquido/delegua/lexador';

import { InterpretadorPotigol } from '../../fontes/interpretador';

import primitivasVetor from '../../fontes/bibliotecas/primitivas-vetor';
import tiposDeSimbolos from '../../fontes/tipos-de-simbolos/lexico-regular';

describe('Primitivas de vetor - Potigol', () => {
    let interpretador: InterpretadorPotigol;

    beforeEach(() => {
        interpretador = new InterpretadorPotigol(
            process.cwd(), 
            false
        )
    });

    describe('cabeça()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.cabeça(interpretador, [1, 2, 3]);
            expect(resultado).toStrictEqual(1);
        });
    });

    describe('cauda()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.cauda(interpretador, [1, 2, 3]);
            expect(resultado).toStrictEqual([2, 3]);
        });
    });

    describe('contém()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.contém(interpretador, [1, 2, 3], 2);
            expect(resultado).toBe(true);
        });

        it('Elemento inexistente', async () => {
            const resultado = await primitivasVetor.contém(interpretador, [1, 2, 3], 4);
            expect(resultado).toBe(false);
        });
    });

    describe('descarte()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.descarte(interpretador, [2, 4, 6, 8, 10], 2);
            expect(resultado).toStrictEqual([6, 8, 10]);
        });
    });

    describe('descarte_enquanto()', () => {
        it('Trivial', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao', 
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        {
                            linha: -1,
                            hashArquivo: -1,
                            lexema: '',
                            literal: '',
                            tipo: 'qualquer',
                        }, 
                        new Binario(
                            -1, 
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.MENOR, '<', '<', -1, -1), 
                            new Literal(-1, -1, 6)
                        )
                    )
                ])
            );
            
            const resultado = await primitivasVetor.descarte_enquanto(interpretador, [2, 4, 6, 8, 10], deleguaFuncao);
            expect(resultado).toStrictEqual([6, 8, 10]);
        });
    });

    describe('divida_quando()', () => {
        const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
            'funcao', 
            new FuncaoConstruto(-1, -1, [
                {
                    abrangencia: 'padrao',
                    nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                    tipoDado: 'numero'
                } as ParametroInterface,
                {
                    abrangencia: 'padrao',
                    nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                    tipoDado: 'numero'
                } as ParametroInterface
            ], [
                new Retorna(
                    {
                        linha: -1,
                        hashArquivo: -1,
                        lexema: '',
                        literal: '',
                        tipo: 'qualquer',
                    }, 
                    new Binario(
                        -1, 
                        new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                        new Simbolo(tiposDeSimbolos.DIFERENTE, '<>', '<>', -1, -1), 
                        new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1))
                    )
                )
            ])
        );

        it('Trivial', async () => {
            const resultado = await primitivasVetor.divida_quando(interpretador, [2, 2, 3, 3, 3, 6, 5, 6], deleguaFuncao);
            expect(resultado).toStrictEqual([[2, 2], [3, 3, 3], [6], [5], [6]]);
        });

        it('Vetor vazio', async () => {
            const resultado = await primitivasVetor.divida_quando(interpretador, [], deleguaFuncao);
            expect(resultado).toStrictEqual([]);
        });

        it('Vetor com um elemento', async () => {
            const resultado = await primitivasVetor.divida_quando(interpretador, [10], deleguaFuncao);
            expect(resultado).toStrictEqual([[10]]);
        });
    });

    describe('injete()', () => {
        it('Trivial, apenas um argumento', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao', 
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        {
                            linha: -1,
                            hashArquivo: -1,
                            lexema: '',
                            literal: '',
                            tipo: 'qualquer',
                        }, 
                        new Binario(
                            -1, 
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', '+', -1, -1), 
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1))
                        )
                    )
                ])
            );
            
            const resultado = await primitivasVetor.injete(interpretador, [2, 4, 6], deleguaFuncao);
            expect(resultado).toStrictEqual(12);
        });

        it('Com valor inicial', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        {
                            linha: -1,
                            hashArquivo: -1,
                            lexema: '',
                            literal: '',
                            tipo: 'qualquer',
                        },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', '+', -1, -1),
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1))
                        )
                    )
                ])
            );

            const resultado = await primitivasVetor.injete(interpretador, [2, 4, 6], deleguaFuncao, 10);
            expect(resultado).toStrictEqual(22);
        });
    });

    describe('inverta()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.inverta(interpretador, [2, 4, 6, 8, 10]);
            expect(resultado).toStrictEqual([10, 8, 6, 4, 2]);
        });
    });

    describe('junte()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.junte(interpretador, [2, 4, 6, 8, 10], '-');
            expect(resultado).toStrictEqual('2-4-6-8-10');
        });
    });

    describe('ordene()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.ordene(interpretador, [4, 8, 10, 2, 6]);
            expect(resultado).toStrictEqual([2, 4, 6, 8, 10]);
        });
    });

    describe('pegue()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.pegue(interpretador, [2, 4, 6, 8, 10], 3);
            expect(resultado).toStrictEqual([2, 4, 6]);
        });
    });

    describe('pegue_enquanto()', () => {
        it('Trivial', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao', 
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        {
                            linha: -1,
                            hashArquivo: -1,
                            lexema: '',
                            literal: '',
                            tipo: 'qualquer',
                        }, 
                        new Binario(
                            -1, 
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.MENOR, '<', '<', -1, -1), 
                            new Literal(-1, -1, 6)
                        )
                    )
                ])
            );
            
            const resultado = await primitivasVetor.pegue_enquanto(interpretador, [2, 4, 6, 8, 10], deleguaFuncao);
            expect(resultado).toStrictEqual([2, 4]);
        });
    });

    describe('posição()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.posição(interpretador, [2, 4, 6, 8, 10], 8);
            expect(resultado).toStrictEqual(4);
        });
    });

    describe('remova()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.remova(interpretador, [2, 4, 6, 8, 10], 3);
            expect(resultado).toStrictEqual([2, 4, 8, 10]);
        });
    });

    describe('tamanho()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.tamanho(interpretador, [2, 4, 6, 8, 10]);
            expect(resultado).toStrictEqual(5);
        });
    });

    describe('último()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasVetor.último(interpretador, [2, 4, 6, 8, 10]);
            expect(resultado).toStrictEqual(10);
        });

        it('Vetor vazio retorna undefined', async () => {
            const resultado = await primitivasVetor.último(interpretador, []);
            expect(resultado).toBeUndefined();
        });
    });

    describe('vazia()', () => {
        it('Lista com elementos', async () => {
            const resultado = await primitivasVetor.vazia(interpretador, [2, 4, 6, 8, 10]);
            expect(resultado).toBe(false);
        });

        it('Lista vazia', async () => {
            const resultado = await primitivasVetor.vazia(interpretador, []);
            expect(resultado).toBe(true);
        });
    });

    describe('imutável()', () => {
        it('Retorna sem erro', async () => {
            const resultado = await primitivasVetor.imutável(interpretador, [1, 2, 3]);
            expect(resultado).toBeUndefined();
        });
    });

    describe('primeiro()', () => {
        it('Retorna primeiro elemento', async () => {
            const resultado = await primitivasVetor.primeiro(interpretador, [2, 4, 6]);
            expect(resultado).toStrictEqual(2);
        });
    });

    describe('mapeie()', () => {
        it('Transforma elementos do vetor', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', '+', -1, -1),
                            new Literal(-1, -1, 1)
                        )
                    )
                ])
            );

            const resultado = await primitivasVetor.mapeie(interpretador, [1, 2, 3], deleguaFuncao);
            expect(resultado).toHaveLength(3);
        });

        it('Rejeita quando função é nula', async () => {
            await expect(primitivasVetor.mapeie(interpretador, [1, 2, 3], null)).rejects.toContain('mapeie');
        });
    });

    describe('selecione()', () => {
        it('Seleciona elementos que satisfazem a condição', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.MENOR, '<', '<', -1, -1),
                            new Literal(-1, -1, 5)
                        )
                    )
                ])
            );

            const resultado = await primitivasVetor.selecione(interpretador, [2, 4, 6, 8], deleguaFuncao);
            expect(resultado).toStrictEqual([2, 4]);
        });

        it('Rejeita quando função é nula', async () => {
            await expect(primitivasVetor.selecione(interpretador, [1, 2, 3], null)).rejects.toContain('selecione');
        });
    });

    describe('filtre()', () => {
        it('Executa sem erros e retorna array', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.MENOR, '<', '<', -1, -1),
                            new Literal(-1, -1, 5)
                        )
                    )
                ])
            );

            const resultado = await primitivasVetor.filtre(interpretador, [2, 4, 6, 8], deleguaFuncao);
            expect(Array.isArray(resultado)).toBe(true);
        });

        it('Rejeita quando função é nula', async () => {
            await expect(primitivasVetor.filtre(interpretador, [1, 2, 3], null)).rejects.toContain('filtre');
        });
    });

    describe('reduza()', () => {
        it('Reduz somando elementos', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', '+', -1, -1),
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1))
                        )
                    )
                ])
            );

            const resultado = await primitivasVetor.reduza(interpretador, [1, 2, 3, 4], deleguaFuncao);
            expect(resultado).toStrictEqual(10);
        });

        it('Reduz com valor inicial', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', '+', -1, -1),
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1))
                        )
                    )
                ])
            );

            const resultado = await primitivasVetor.reduza(interpretador, [1, 2, 3], deleguaFuncao, 10);
            expect(resultado).toStrictEqual(16);
        });

        it('Rejeita quando função é nula', async () => {
            await expect(primitivasVetor.reduza(interpretador, [1, 2, 3], null)).rejects.toContain('reduza');
        });

        it('Vetor vazio sem valor inicial retorna undefined', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [], [])
            );
            const resultado = await primitivasVetor.reduza(interpretador, [], deleguaFuncao);
            expect(resultado).toBeUndefined();
        });
    });

    describe('Verificações de função nula', () => {
        it('descarte_enquanto rejeita quando função é nula', async () => {
            await expect(primitivasVetor.descarte_enquanto(interpretador, [1, 2, 3], null)).rejects.toContain('descarte_enquanto');
        });

        it('divida_quando rejeita quando função é nula (vetor não vazio)', async () => {
            await expect(primitivasVetor.divida_quando(interpretador, [1, 2], null)).rejects.toContain('divida_quando');
        });

        it('pegue_enquanto rejeita quando função é nula', async () => {
            await expect(primitivasVetor.pegue_enquanto(interpretador, [1, 2, 3], null)).rejects.toContain('pegue_enquanto');
        });

        it('injete rejeita quando função é nula', async () => {
            await expect(primitivasVetor.injete(interpretador, [1, 2, 3], null)).rejects.toContain('injete');
        });

        it('injete com valor inicial não chamável e função como segundo arg', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', '+', -1, -1),
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1))
                        )
                    )
                ])
            );

            const resultado = await primitivasVetor.injete(interpretador, [1, 2, 3], 0, deleguaFuncao);
            expect(resultado).toStrictEqual(6);
        });

        it('injete com vetor vazio e sem valor inicial retorna undefined via executarInjete', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [], [])
            );
            const resultado = await primitivasVetor.injete(interpretador, [], deleguaFuncao);
            expect(resultado).toBeUndefined();
        });

        it('injete com valor inicial não chamável retorna FuncaoPadrao (aplicação parcial)', async () => {
            const funcaoPadrao = await primitivasVetor.injete(interpretador, [1, 2, 3], 10);
            expect(funcaoPadrao).toBeDefined();
            expect(typeof funcaoPadrao.chamar).toBe('function');
        });

        it('aplicação parcial de injete com função chamável executa', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'numero'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', '+', -1, -1),
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1))
                        )
                    )
                ])
            );

            const funcaoPadrao = await primitivasVetor.injete(interpretador, [1, 2, 3], 10);
            const resultado = await funcaoPadrao.chamar(interpretador, [deleguaFuncao], null);
            expect(resultado).toStrictEqual(16);
        });

        it('aplicação parcial de injete com função inválida rejeita', async () => {
            const funcaoPadrao = await primitivasVetor.injete(interpretador, [1, 2, 3], 10);
            await expect(funcaoPadrao.chamar(interpretador, [null], null)).rejects.toContain('injete');
        });
    });
});
