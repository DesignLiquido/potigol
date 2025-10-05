import { LexadorPotigol } from "../fontes/lexador";
import { AvaliadorSintaticoPotigol } from "../fontes/avaliador-sintatico";
import { AnalisadorSemanticoPotigol } from "../fontes/analisador-semantico";

describe('Analisador semântico', () => {
    let lexador = new LexadorPotigol();
    let avaliadorSintatico = new AvaliadorSintaticoPotigol();
    let analisadorSemantico = new AnalisadorSemanticoPotigol();

    describe('Cenários de sucesso', () => {
        it('Declaração de inteiro constante com val, dica de tipo', () => {
            const retornoLexador = lexador.mapear(['val a: Inteiro = 10'], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            expect(retornoAnaliseSemantica.diagnosticos).toHaveLength(0);
        });
    });
});