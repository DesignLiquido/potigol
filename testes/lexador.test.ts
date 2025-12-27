import { LexadorPotigol } from "../fontes/lexador";

describe('Lexador (Potigol)', () => {
    describe('mapear()', () => {
        let lexador: LexadorPotigol;

        beforeEach(() => {
            lexador = new LexadorPotigol();
        });

        describe('Cenário de sucesso', () => {
            it('Arquivo vazio.', async () => {
                const resultado = lexador.mapear([''], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(0);
            });

            it('Olá mundo', async () => {
                const resultado = lexador.mapear([
                    'escreva "Olá Mundo"'
                ], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(2);
            });
        });
    });
});
