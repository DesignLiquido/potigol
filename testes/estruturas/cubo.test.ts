import { EstruturaCubo } from '../../fontes/interpretador/estruturas/cubo';

describe('EstruturaCubo', () => {
    let cubo: EstruturaCubo;

    beforeEach(() => {
        cubo = new EstruturaCubo([
            [[1, 2], [3, 4]],
            [[5, 6], [7, 8]],
        ]);
    });

    describe('Dimensões', () => {
        it('camadas() retorna o número de camadas', () => {
            expect(cubo.camadas()).toBe(2);
        });

        it('linhas() retorna o número de linhas', () => {
            expect(cubo.linhas()).toBe(2);
        });

        it('colunas() retorna o número de colunas', () => {
            expect(cubo.colunas()).toBe(2);
        });

        it('linhas() em cubo vazio retorna 0', () => {
            const vazio = new EstruturaCubo([]);
            expect(vazio.linhas()).toBe(0);
        });

        it('colunas() em cubo vazio retorna 0', () => {
            const vazio = new EstruturaCubo([]);
            expect(vazio.colunas()).toBe(0);
        });

        it('colunas() em cubo com camada vazia retorna 0', () => {
            const semColunas = new EstruturaCubo([[]]);
            expect(semColunas.colunas()).toBe(0);
        });
    });

    describe('paraTexto()', () => {
        it('Retorna representação textual do cubo', () => {
            const cuboSimples = new EstruturaCubo([[[1, 2], [3, 4]]]);
            const texto = cuboSimples.paraTexto();
            expect(texto).toContain('1');
            expect(texto).toContain('2');
            expect(texto).toContain('3');
            expect(texto).toContain('4');
        });

        it('Formata cubo vazio como []', () => {
            const vazio = new EstruturaCubo([]);
            expect(vazio.paraTexto()).toBe('[]');
        });

        it('Formata elementos com propriedade valor', () => {
            const cuboComValor = new EstruturaCubo([[[{ valor: 42 }]]]);
            const texto = cuboComValor.paraTexto();
            expect(texto).toContain('42');
        });

        it('Formata cubo 2x2x2 corretamente', () => {
            const texto = cubo.paraTexto();
            expect(texto.startsWith('[')).toBe(true);
            expect(texto.endsWith(']')).toBe(true);
        });
    });

    describe('toString()', () => {
        it('Retorna representação com tipo', () => {
            const texto = cubo.toString();
            expect(texto).toContain('Cubo');
            expect(texto).toContain('qualquer');
        });

        it('Retorna tipo personalizado', () => {
            const tipado = new EstruturaCubo([[[1]]], 'inteiro');
            expect(tipado.toString()).toContain('inteiro');
        });
    });

    describe('obter()', () => {
        it('Acessa elemento válido', () => {
            expect(cubo.obter(0, 0, 0)).toBe(1);
            expect(cubo.obter(1, 1, 1)).toBe(8);
        });

        it('Lança erro para camada fora dos limites (abaixo)', () => {
            expect(() => cubo.obter(-1, 0, 0)).toThrow('camada');
        });

        it('Lança erro para camada fora dos limites (acima)', () => {
            expect(() => cubo.obter(99, 0, 0)).toThrow('camada');
        });

        it('Lança erro para linha fora dos limites', () => {
            expect(() => cubo.obter(0, 99, 0)).toThrow('linha');
        });

        it('Lança erro para coluna fora dos limites', () => {
            expect(() => cubo.obter(0, 0, 99)).toThrow('coluna');
        });
    });

    describe('definir()', () => {
        it('Define elemento válido', () => {
            cubo.definir(0, 0, 0, 99);
            expect(cubo.obter(0, 0, 0)).toBe(99);
        });

        it('Lança erro para camada fora dos limites', () => {
            expect(() => cubo.definir(-1, 0, 0, 99)).toThrow('camada');
        });

        it('Lança erro para camada acima dos limites', () => {
            expect(() => cubo.definir(99, 0, 0, 99)).toThrow('camada');
        });

        it('Lança erro para linha fora dos limites', () => {
            expect(() => cubo.definir(0, 99, 0, 99)).toThrow('linha');
        });

        it('Lança erro para coluna fora dos limites', () => {
            expect(() => cubo.definir(0, 0, 99, 99)).toThrow('coluna');
        });
    });
});
