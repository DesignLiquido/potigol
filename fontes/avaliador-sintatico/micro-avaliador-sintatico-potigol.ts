import {
    AcessoIndiceVariavel,
    AcessoMetodoOuPropriedade,
    Agrupamento,
    Chamada,
    Constante,
    Literal,
    Tupla,
    Variavel,
} from '@designliquido/delegua/construtos';
import { Declaracao } from '@designliquido/delegua/declaracoes';
import { MicroAvaliadorSintaticoBase } from '@designliquido/delegua/avaliador-sintatico/micro-avaliador-sintatico-base';
import { SeletorTuplas } from '@designliquido/delegua/construtos/tuplas';
import { ConstrutoInterface, RetornoAvaliadorSintaticoInterface, RetornoLexadorInterface, SimboloInterface } from '@designliquido/delegua/interfaces';
import { Simbolo } from '@designliquido/delegua/lexador';

import tiposDeSimbolos from '../tipos-de-simbolos/micro-lexico';

/**
 * O Micro Avaliador Sintático funciona em dois momentos:
 *
 * - Avaliação de elementos dentro de interpolações de texto (interpretador);
 * - Avaliação de argumentos de funções (avaliador sintático).
 */
export class MicroAvaliadorSintaticoPotigol extends MicroAvaliadorSintaticoBase {
    hashArquivo: number;
    // Aqui precisamos ter declarações como propriedade porque
    // chamadas a certos métodos de primitivas, como "formato", exigem
    // ver a ultima declaração resolvida.
    declaracoes: Declaracao[];

    constructor(hashArquivo: number) {
        super();
        this.hashArquivo = hashArquivo;
        this.declaracoes = [];
    }

    primario(): ConstrutoInterface {
        const simboloAtual = this.simbolos[this.atual];

        switch (simboloAtual.tipo) {
            case tiposDeSimbolos.PARENTESE_ESQUERDO:
                this.avancarEDevolverAnterior();
                const expressao = this.ou();
                switch (this.simbolos[this.atual].tipo) {
                    case tiposDeSimbolos.VIRGULA:
                        // Tupla
                        const argumentos = [expressao];
                        while (this.simbolos[this.atual].tipo === tiposDeSimbolos.VIRGULA) {
                            this.avancarEDevolverAnterior();
                            argumentos.push(this.ou());
                        }

                        this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após a expressão.");
                        return new SeletorTuplas(...argumentos) as Tupla;
                    default:
                        this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após a expressão.");
                        return new Agrupamento(this.hashArquivo, Number(simboloAtual.linha), expressao);
                }

            case tiposDeSimbolos.FORMATO:

            case tiposDeSimbolos.CARACTERE:
            case tiposDeSimbolos.INTEIRO:
            case tiposDeSimbolos.LOGICO:
            case tiposDeSimbolos.REAL:
            case tiposDeSimbolos.TEXTO:
                const simboloLiteral: SimboloInterface = this.avancarEDevolverAnterior();
                return new Literal(this.hashArquivo, Number(simboloLiteral.linha), simboloLiteral.literal);
            case tiposDeSimbolos.FALSO:
            case tiposDeSimbolos.VERDADEIRO:
                const simboloVerdadeiroFalso: SimboloInterface = this.avancarEDevolverAnterior();
                return new Literal(
                    this.hashArquivo,
                    Number(simboloVerdadeiroFalso.linha),
                    simboloVerdadeiroFalso.tipo === tiposDeSimbolos.VERDADEIRO
                );
            case tiposDeSimbolos.VIRGULA:
                this.avancarEDevolverAnterior();
                return undefined;
            default:
                const simboloIdentificador: SimboloInterface = this.avancarEDevolverAnterior();
                // Diferentemente da avaliação sintática tradicional, mesmo que o símbolo
                // seja uma variável, sempre resolve como constante.
                return new Constante(this.hashArquivo, simboloIdentificador);
        }
    }

    protected formato(): ConstrutoInterface {
        const expressao = this.primario();

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.FORMATO)) {
            // O próximo símbolo precisa ser um texto no padrão "%Nd" ou "%.Nf", onde N é um inteiro.
            const simboloMascaraFormato = this.consumir(
                tiposDeSimbolos.TEXTO,
                "Esperado máscara de formato após método 'formato'."
            );
            if (!/%((\d+)d|\.(\d+)f)/gi.test(simboloMascaraFormato.literal)) {
                throw this.erro(simboloMascaraFormato, 'Máscara para função de formato inválida.');
            }

            return new Chamada(
                this.hashArquivo, // new Expressao(new MetodoPrimitiva(expressao, primitivasNumero.formato)), undefined, [expressao]);
                new AcessoMetodoOuPropriedade(
                    this.hashArquivo,
                    expressao,
                    new Simbolo(tiposDeSimbolos.FORMATO, 'formato', 'formato', expressao.linha, this.hashArquivo)
                ),
                [new Literal(this.hashArquivo, expressao.linha, simboloMascaraFormato.literal)]
            );
        }

        return expressao;
    }

    chamar(): ConstrutoInterface {
        let expressao = this.formato();

        while (expressao) {
            if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PARENTESE_ESQUERDO)) {
                const argumentos: ConstrutoInterface[] = [];
                if (!this.verificarTipoSimboloAtual(tiposDeSimbolos.PARENTESE_DIREITO)) {
                    argumentos.push(this.ou());
                    while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA)) {
                        argumentos.push(this.ou());
                    }
                }
                this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após argumentos.");
                expressao = new Chamada(this.hashArquivo, expressao, argumentos);
            } else if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.COLCHETE_ESQUERDO)) {
                const indice = this.ou();
                const simboloFechamento = this.consumir(
                    tiposDeSimbolos.COLCHETE_DIREITO,
                    "Esperado ']' após escrita do índice."
                );
                const variavelVetor = new Variavel(expressao.hashArquivo, (expressao as any).simbolo);
                expressao = new AcessoIndiceVariavel(this.hashArquivo, variavelVetor, indice, simboloFechamento);
            } else {
                break;
            }
        }

        return expressao;
    }

    analisar(retornoLexador: RetornoLexadorInterface<SimboloInterface>, linha: number): RetornoAvaliadorSintaticoInterface<Declaracao> {
        this.erros = [];
        this.atual = 0;
        this.linha = linha;

        this.simbolos = retornoLexador?.simbolos || [];

        this.declaracoes = [];
        while (this.atual < this.simbolos.length) {
            this.declaracoes.push(this.declaracao() as Declaracao);
        }

        return {
            declaracoes: this.declaracoes.filter(d => d),
            erros: this.erros,
        } as RetornoAvaliadorSintaticoInterface<Declaracao>;
    }
}
