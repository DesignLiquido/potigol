import primitivasCubo from '../../fontes/bibliotecas/primitivas-cubo';
import { EstruturaCubo } from '../../fontes/interpretador/estruturas/cubo';

describe('Primitivas de Cubo', () => {
    let cubo: EstruturaCubo;

    beforeEach(() => {
        cubo = new EstruturaCubo([
            [[1, 2, 3], [4, 5, 6]],
            [[7, 8, 9], [10, 11, 12]],
        ]);
    });

    it('camadas() retorna o número de camadas', async () => {
        const resultado = await primitivasCubo.camadas(null, cubo);
        expect(resultado).toBe(2);
    });

    it('linhas() retorna o número de linhas', async () => {
        const resultado = await primitivasCubo.linhas(null, cubo);
        expect(resultado).toBe(2);
    });

    it('colunas() retorna o número de colunas', async () => {
        const resultado = await primitivasCubo.colunas(null, cubo);
        expect(resultado).toBe(3);
    });

    it('obter() acessa elemento correto', async () => {
        const resultado = await primitivasCubo.obter(null, cubo, 0, 0, 0);
        expect(resultado).toBe(1);
    });

    it('obter() acessa elemento na segunda camada', async () => {
        const resultado = await primitivasCubo.obter(null, cubo, 1, 1, 2);
        expect(resultado).toBe(12);
    });

    it('definir() atualiza o elemento e retorna o cubo', async () => {
        const resultado = await primitivasCubo.definir(null, cubo, 0, 0, 0, 99);
        expect(resultado).toBe(cubo);
        expect(cubo.obter(0, 0, 0)).toBe(99);
    });
});
