import { InterpretadorPotigol } from '../../fontes/interpretador';
import primitivasTexto from '../../fontes/bibliotecas/primitivas-texto';
import { DeleguaFuncao } from '@designliquido/delegua/interpretador/estruturas';
import { AcessoMetodoOuPropriedade, Binario, FuncaoConstruto, Literal, Variavel } from '@designliquido/delegua/construtos';
import { Retorna } from '@designliquido/delegua/declaracoes';
import { ParametroInterface } from '@designliquido/delegua/interfaces';
import { Simbolo } from '@designliquido/delegua/lexador';
import tiposDeSimbolos from '../../fontes/tipos-de-simbolos/lexico-regular';

describe('Primitivas de texto - Potigol', () => {
    let interpretador: InterpretadorPotigol;

    beforeEach(() => {
        interpretador = new InterpretadorPotigol(
            process.cwd(), 
            false
        )
    });

    describe('cabeça()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.cabeça(interpretador, 'abc');
            expect(resultado).toStrictEqual('a');
        });
    });

    describe('cauda()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.cauda(interpretador, 'abc');
            expect(resultado).toStrictEqual('bc');
        });
    });

    describe('contém()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.contém(interpretador, 'abc', 'b');
            expect(resultado).toBe(true);
        });

        it('Elemento inexistente', async () => {
            const resultado = await primitivasTexto.contém(interpretador, 'abc', 'f');
            expect(resultado).toBe(false);
        });
    });

    describe('descarte()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.descarte(interpretador, 'abcde', 2);
            expect(resultado).toStrictEqual('cde');
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
                        tipoDado: 'texto'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.DIFERENTE, '<>', '<>', -1, -1),
                            new Literal(-1, -1, 'c')
                        )
                    )
                ])
            );

            const resultado = await primitivasTexto.descarte_enquanto(interpretador, 'abcde', deleguaFuncao);
            expect(resultado).toStrictEqual('cde');
        });
    });

    describe('divida()', () => {
        it('Sem separador como argumento', async () => {
            const resultado = await primitivasTexto.divida(interpretador, 'Um texto');
            expect(resultado).toStrictEqual(['Um', 'texto']);
        });

        it('Com separador como argumento', async () => {
            const resultado = await primitivasTexto.divida(interpretador, 'Um-texto', '-');
            expect(resultado).toStrictEqual(['Um', 'texto']);
        });
    });

    describe('insira()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.insira(interpretador, 'abc', 3, 'd');
            expect(resultado).toStrictEqual('abdc');
        });
    });

    describe('inteiro()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.inteiro(interpretador, '123');
            expect(resultado).toStrictEqual(123);
        });

        it('Texto decimal', async () => {
            const resultado = await primitivasTexto.inteiro(interpretador, '123.45');
            expect(resultado).toStrictEqual(123);
        });
    });

    describe('inverta()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.inverta(interpretador, 'abcde');
            expect(resultado).toStrictEqual('edcba');
        });
    });

    describe('junte()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.junte(interpretador, 'abc', '-');
            expect(resultado).toStrictEqual('a-b-c');
        });
    });

    describe('injete()', () => {
        it('Trivial', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'texto'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'texto'
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

            const resultado = await primitivasTexto.injete(interpretador, 'abc', deleguaFuncao);
            expect(resultado).toStrictEqual('abc');
        });
    });

    describe('lista()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.lista(interpretador, 'abc');
            expect(resultado).toStrictEqual(['a', 'b', 'c']);
        });
    });

    describe('maiúsculo()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.maiúsculo(interpretador, 'Abc');
            expect(resultado).toStrictEqual('ABC');
        });
    });

    describe('minúsculo()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.minúsculo(interpretador, 'Abc');
            expect(resultado).toStrictEqual('abc');
        });
    });

    describe('ordene()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.ordene(interpretador, 'bca');
            expect(resultado).toStrictEqual('abc');
        });
    });

    describe('pegue()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.pegue(interpretador, 'abcde', 3);
            expect(resultado).toStrictEqual('abc');
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
                        tipoDado: 'texto'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.DIFERENTE, '<>', '<>', -1, -1),
                            new Literal(-1, -1, 'd')
                        )
                    )
                ])
            );

            const resultado = await primitivasTexto.pegue_enquanto(interpretador, 'abcde', deleguaFuncao);
            expect(resultado).toStrictEqual('abc');
        });
    });

    describe('posição()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.posição(interpretador, 'abcde', 'b');
            expect(resultado).toStrictEqual(2);
        });
    });

    describe('qual_tipo()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.qual_tipo(interpretador, 'bca');
            expect(resultado).toStrictEqual('Texto');
        });
    });

    describe('real()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.real(interpretador, '123.45');
            expect(resultado).toStrictEqual(123.45);
        });
    });

    describe('remova()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.remova(interpretador, 'abc', 2);
            expect(resultado).toStrictEqual('ac');
        });
    });

    describe('selecione()', () => {
        it('Trivial', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'texto'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.DIFERENTE, '<>', '<>', -1, -1),
                            new Literal(-1, -1, 'b')
                        )
                    )
                ])
            );

            const resultado = await primitivasTexto.selecione(interpretador, 'abc', deleguaFuncao);
            expect(resultado).toStrictEqual('ac');
        });
    });

    describe('primeiro()', () => {
        it('Retorna primeiro caractere', async () => {
            const resultado = await primitivasTexto.primeiro(interpretador, 'abc');
            expect(resultado).toStrictEqual('a');
        });

        it('Texto vazio retorna string vazia', async () => {
            const resultado = await primitivasTexto.primeiro(interpretador, '');
            expect(resultado).toStrictEqual('');
        });
    });

    describe('tamanho()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.tamanho(interpretador, 'abc');
            expect(resultado).toStrictEqual(3);
        });
    });

    describe('último()', () => {
        it('Trivial', async () => {
            const resultado = await primitivasTexto.último(interpretador, 'abc');
            expect(resultado).toStrictEqual('c');
        });

        it('Texto vazio', async () => {
            const resultado = await primitivasTexto.último(interpretador, '');
            expect(resultado).toStrictEqual('');
        });
    });

    describe('mapeie()', () => {
        it('Converte cada caractere para maiúsculo', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'texto'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new AcessoMetodoOuPropriedade(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'maiúsculo', 'maiúsculo', -1, -1)
                        )
                    )
                ])
            );

            const resultado = await primitivasTexto.mapeie(interpretador, 'abc', deleguaFuncao);
            expect(resultado).toStrictEqual(['A', 'B', 'C']);
        });
    });

    describe('filtre()', () => {
        it('Filtra caracteres que satisfazem a condição', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'texto'
                    } as ParametroInterface
                ], [
                    new Retorna(
                        { linha: -1, hashArquivo: -1, lexema: '', literal: '', tipo: 'qualquer' },
                        new Binario(
                            -1,
                            new Variavel(-1, new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1)),
                            new Simbolo(tiposDeSimbolos.DIFERENTE, '<>', '<>', -1, -1),
                            new Literal(-1, -1, 'b')
                        )
                    )
                ])
            );

            const resultado = await primitivasTexto.filtre(interpretador, 'abc', deleguaFuncao);
            expect(resultado).toStrictEqual('ac');
        });

        it('Rejeita quando função é nula', async () => {
            await expect(primitivasTexto.filtre(interpretador, 'abc', null)).rejects.toContain('filtre');
        });
    });

    describe('reduza()', () => {
        it('Reduz concatenando caracteres', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'texto'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'texto'
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

            const resultado = await primitivasTexto.reduza(interpretador, 'abc', deleguaFuncao);
            expect(resultado).toStrictEqual('abc');
        });

        it('Reduz com valor inicial', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'x', 'x', -1, -1),
                        tipoDado: 'texto'
                    } as ParametroInterface,
                    {
                        abrangencia: 'padrao',
                        nome: new Simbolo(tiposDeSimbolos.IDENTIFICADOR, 'y', 'y', -1, -1),
                        tipoDado: 'texto'
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

            const resultado = await primitivasTexto.reduza(interpretador, 'bc', deleguaFuncao, 'a');
            expect(resultado).toStrictEqual('abc');
        });

        it('Rejeita quando função é nula', async () => {
            await expect(primitivasTexto.reduza(interpretador, 'abc', null)).rejects.toContain('reduza');
        });

        it('Texto vazio sem valor inicial retorna undefined', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [], [])
            );
            const resultado = await primitivasTexto.reduza(interpretador, '', deleguaFuncao);
            expect(resultado).toBeUndefined();
        });
    });

    describe('Verificações de função nula', () => {
        it('descarte_enquanto rejeita quando função é nula', async () => {
            await expect(primitivasTexto.descarte_enquanto(interpretador, 'abc', null)).rejects.toContain('descarte_enquanto');
        });

        it('injete rejeita quando função é nula', async () => {
            await expect(primitivasTexto.injete(interpretador, 'abc', null)).rejects.toContain('injete');
        });

        it('injete texto vazio sem valor inicial retorna undefined', async () => {
            const deleguaFuncao: DeleguaFuncao = new DeleguaFuncao(
                'funcao',
                new FuncaoConstruto(-1, -1, [], [])
            );
            const resultado = await primitivasTexto.injete(interpretador, '', deleguaFuncao);
            expect(resultado).toBeUndefined();
        });

        it('pegue_enquanto rejeita quando função é nula', async () => {
            await expect(primitivasTexto.pegue_enquanto(interpretador, 'abc', null)).rejects.toContain('pegue_enquanto');
        });

        it('selecione rejeita quando função é nula', async () => {
            await expect(primitivasTexto.selecione(interpretador, 'abc', null)).rejects.toContain('selecione');
        });

        it('mapeie rejeita quando função é nula', async () => {
            await expect(primitivasTexto.mapeie(interpretador, 'abc', null)).rejects.toContain('mapeie');
        });
    });

    describe('zip()', () => {
        it('Zip texto com texto', async () => {
            const resultado = await primitivasTexto.zip(interpretador, 'abc', '123');
            expect(resultado).toStrictEqual([['a', '1'], ['b', '2'], ['c', '3']]);
        });

        it('Zip com texto mais curto', async () => {
            const resultado = await primitivasTexto.zip(interpretador, 'ab', '1234');
            expect(resultado).toStrictEqual([['a', '1'], ['b', '2']]);
        });

        it('Zip com texto mais longo', async () => {
            const resultado = await primitivasTexto.zip(interpretador, 'abcd', '12');
            expect(resultado).toStrictEqual([['a', '1'], ['b', '2']]);
        });
    });
});
