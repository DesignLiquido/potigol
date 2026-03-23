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

            it('Tipos avançados', async () => {
                const resultado = lexador.mapear([
                    'Matriz Cubo InteiroGrande'
                ], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(3);
                expect(resultado.simbolos[0].tipo).toBe('MATRIZ');
                expect(resultado.simbolos[1].tipo).toBe('CUBO');
                expect(resultado.simbolos[2].tipo).toBe('INTEIRO_GRANDE');
            });

            it('Literal InteiroGrande com sufixo g', async () => {
                const resultado = lexador.mapear([
                    '42g'
                ], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(1);
                expect(resultado.simbolos[0].tipo).toBe('INTEIRO_GRANDE');
                expect(resultado.simbolos[0].literal).toBe(BigInt(42));
            });

            it('Operadores .. e senãose', async () => {
                const resultado = lexador.mapear([
                    '1..10 senãose senaose'
                ], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(5);
                expect(resultado.simbolos[1].tipo).toBe('PONTO_PONTO');
                expect(resultado.simbolos[3].tipo).toBe('SENAOSE');
                expect(resultado.simbolos[4].tipo).toBe('SENAOSE');
            });
        });
    });
});
