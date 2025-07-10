import { LexadorPotigol } from '../fontes/lexador/lexador-potigol';
import { AvaliadorSintaticoPotigol } from '../fontes/avaliador-sintatico/avaliador-sintatico-potigol';
import { InterpretadorPotigolComDepuracao } from '../fontes/interpretador/interpretador-potigol-com-depuracao';

describe('Interpretador com Depuração (Potigol)', () => {
    let lexador: LexadorPotigol;
    let avaliadorSintatico: AvaliadorSintaticoPotigol;
    let interpretador: InterpretadorPotigolComDepuracao;

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
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

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
    });
});
