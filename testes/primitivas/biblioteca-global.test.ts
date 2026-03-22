import { InterpretadorPotigol } from '../../fontes/interpretador';
import * as bibliotecaGlobal from '../../fontes/bibliotecas/biblioteca-global';

describe('Biblioteca global - Potigol', () => {
    let interpretador: InterpretadorPotigol;

    beforeEach(() => {
        interpretador = new InterpretadorPotigol(process.cwd(), false);
    });

    describe('abs()', () => {
        it('Retorna valor absoluto', async () => {
            const resultado = await bibliotecaGlobal.abs(interpretador, -10);
            expect(resultado).toBe(10);
        });
    });

    describe('aleatorio()', () => {
        it('Retorna valor no intervalo [0, 1)', async () => {
            const resultado = await bibliotecaGlobal.aleatorio();
            expect(resultado).toBeGreaterThanOrEqual(0);
            expect(resultado).toBeLessThan(1);
        });

        it('Com um argumento, retorna inteiro no intervalo [1, n]', async () => {
            const resultado = await bibliotecaGlobal.aleatorio(5);
            expect(Number.isInteger(resultado)).toBe(true);
            expect(resultado).toBeGreaterThanOrEqual(1);
            expect(resultado).toBeLessThanOrEqual(5);
        });

        it('Com dois argumentos, retorna inteiro no intervalo [inicio, fim]', async () => {
            const resultado = await bibliotecaGlobal.aleatorio(3, 7);
            expect(Number.isInteger(resultado)).toBe(true);
            expect(resultado).toBeGreaterThanOrEqual(3);
            expect(resultado).toBeLessThanOrEqual(7);
        });
    });

    describe('pi()', () => {
        it('Retorna PI', async () => {
            const resultado = await bibliotecaGlobal.pi();
            expect(resultado).toBeCloseTo(Math.PI, 10);
        });
    });

    describe('raiz()', () => {
        it('Retorna raiz quadrada', async () => {
            const resultado = await bibliotecaGlobal.raiz(interpretador, 81);
            expect(resultado).toBe(9);
        });

        it('Aceita indice de raiz', async () => {
            const resultado = await bibliotecaGlobal.raiz(interpretador, 27, 3);
            expect(resultado).toBeCloseTo(3, 10);
        });
    });

    describe('sen()/cos()/tg()', () => {
        it('Calcula funções trigonométricas', async () => {
            const seno = await bibliotecaGlobal.sen(interpretador, 0);
            const cosseno = await bibliotecaGlobal.cos(interpretador, 0);
            const tangente = await bibliotecaGlobal.tg(interpretador, 0);

            expect(seno).toBeCloseTo(0, 10);
            expect(cosseno).toBeCloseTo(1, 10);
            expect(tangente).toBeCloseTo(0, 10);
        });
    });

    describe('arcsen()/arccos()/arctg()', () => {
        it('Calcula funções trigonométricas inversas', async () => {
            const arcseno = await bibliotecaGlobal.arcsen(interpretador, 0);
            const arccosseno = await bibliotecaGlobal.arccos(interpretador, 1);
            const arctangente = await bibliotecaGlobal.arctg(interpretador, 0);

            expect(arcseno).toBeCloseTo(0, 10);
            expect(arccosseno).toBeCloseTo(0, 10);
            expect(arctangente).toBeCloseTo(0, 10);
        });
    });

    describe('log()/log10()', () => {
        it('Calcula logaritmos', async () => {
            const natural = await bibliotecaGlobal.log(interpretador, Math.E);
            const base10 = await bibliotecaGlobal.log10(interpretador, 1000);

            expect(natural).toBeCloseTo(1, 10);
            expect(base10).toBeCloseTo(3, 10);
        });
    });
});
