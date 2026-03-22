import {
    AcessoIndiceVariavel,
    AcessoMetodoOuPropriedade,
    Agrupamento,
    Atribuir,
    Binario,
    Chamada,
    Constante,
    Construto,
    DefinirValor,
    FimPara,
    FuncaoConstruto,
    Isto,
    Leia,
    Literal,
    TipoDe,
    Tupla,
    Unario,
    Variavel,
    Vetor,
} from '@designliquido/delegua/construtos';
import {
    Escreva,
    Declaracao,
    Se,
    Enquanto,
    Para,
    Escolha,
    Fazer,
    EscrevaMesmaLinha,
    Const,
    Var,
    Bloco,
    Expressao,
    FuncaoDeclaracao,
    Classe,
    PropriedadeClasse,
    ConstMultiplo,
    Retorna,
    Importar,
} from '@designliquido/delegua/declaracoes';
import { RetornoLexador, RetornoAvaliadorSintatico } from '@designliquido/delegua/interfaces/retornos';
import { AvaliadorSintaticoBase } from '@designliquido/delegua/avaliador-sintatico/avaliador-sintatico-base';

import { ParametroInterface, SimboloInterface } from '@designliquido/delegua/interfaces';
import { Simbolo } from '@designliquido/delegua/lexador';
import { ErroAvaliadorSintatico } from '@designliquido/delegua/avaliador-sintatico/erro-avaliador-sintatico';
import { SeletorTuplas } from '@designliquido/delegua/construtos/tuplas';

import {
    ConstanteOuVariavel,
    LeiaInteiro,
    LeiaInteiros,
    LeiaReais,
    LeiaReal,
    LeiaTexto,
    LeiaTextos,
} from '../construtos';
import { AliasTipo, ParaGere, ReatribuicaoVariavel } from '../declaracoes';
import { MicroAvaliadorSintaticoPotigol } from './micro-avaliador-sintatico-potigol';
import { PilhaEscoposVariaveisConhecidas } from './pilha-escopos-variaveis-conhecidas';

import tipoDeDadosPotigol from '../tipos-de-dados';
import tiposDeSimbolos from '../tipos-de-simbolos/lexico-regular';
import { TipoInferencia } from '@designliquido/delegua/inferenciador';

/**
 * 
 * TODO: Pensar numa forma de avaliar múltiplas constantes sem
 * transformar o retorno de `primario()` em um vetor.
 */
export class AvaliadorSintaticoPotigol extends AvaliadorSintaticoBase {

    microAvaliadorSintatico: MicroAvaliadorSintaticoPotigol;
    tiposDefinidosEmCodigo: Record<string, string>;

    tiposPotigolParaDelegua = {
        Caractere: 'texto',
        Inteiro: 'inteiro',
        Logico: 'lógico',
        Lógico: 'lógico',
        Real: 'numero',
        Texto: 'texto',
        undefined: undefined,
    };

    declaracoes: Declaracao[];
    pilhaEscoposVariaveisConhecidas: PilhaEscoposVariaveisConhecidas;

    constructor() {
        super();
        this.declaracoes = [];
        this.pilhaEscoposVariaveisConhecidas = new PilhaEscoposVariaveisConhecidas();
        this.tiposDefinidosEmCodigo = {};
    }

    /**
     * Com não há um `leia()` genérico em Potigol, mas sim três tipos de `leia` fortemente
     * tipados, consideramos que este dialeto não implementa `leia`.
     * @see primario
     */
    protected declaracaoLeia(): Leia {
        throw this.erro(
            this.simbolos[this.atual] || this.simboloAnterior(),
            "Potigol não possui um comando genérico 'leia'. Use uma das formas tipadas, como 'leia_inteiro', 'leia_real' ou 'leia_texto'."
        );
    }

    /**
     * Testa se o primeiro parâmetro na lista de símbolos
     * pertence a uma declaração ou não.
     * @param simbolos Os símbolos que fazem parte da lista de argumentos
     * de uma chamada ou declaração de função.
     * @returns `true` se parâmetros são de declaração. `false` caso contrário.
     */
    protected testePrimeiroParametro(simbolos: SimboloInterface[]) {
        let atual = 0;

        // Primeiro teste: literal ou identificador
        if (
            [tiposDeSimbolos.INTEIRO, tiposDeSimbolos.LOGICO, tiposDeSimbolos.REAL, tiposDeSimbolos.TEXTO].includes(
                simbolos[atual].tipo
            )
        ) {
            return false;
        }

        // Segundo teste: vírgula imediatamente após identificador,
        // ou simplesmente fim da lista de símbolos.
        atual++;
        if (atual === simbolos.length || simbolos[atual].tipo === tiposDeSimbolos.VIRGULA) {
            return false;
        }

        // Outros casos: dois-pontos após identificador, etc.
        return true;
    }

    /**
     * Retorna uma declaração de função iniciada por igual ou seta,
     * ou seja, com apenas uma instrução.
     * @param simboloPrimario O símbolo que identifica a função (nome),
     *                        também usado para fins de localização.
     * @param parametros A lista de parâmetros da função.
     * @param tipoRetorno O tipo de retorno da função.
     * @returns Um construto do tipo `FuncaoDeclaracao`.
     */
    protected async declaracaoFuncaoPotigolIniciadaPorIgualOuSeta(
        simboloPrimario: SimboloInterface,
        parametros: ParametroInterface[],
        tipoRetorno?: SimboloInterface
    ): Promise<FuncaoConstruto> {
        const corpo = new FuncaoConstruto(simboloPrimario.hashArquivo, simboloPrimario.linha, parametros, [
            new Retorna(simboloPrimario, await this.expressao()),
        ]);

        if (tipoRetorno) {
            corpo.tipo = tipoRetorno.lexema;
        }

        // return new FuncaoDeclaracao(simboloPrimario, corpo, tipoRetorno ? tipoRetorno.lexema : 'qualquer');
        return corpo;
    }

    /**
     * Retorna uma declaração de função terminada por `fim`,
     * ou seja, com mais de uma instrução.
     * @param simboloPrimario O símbolo que identifica a função (nome).
     * @param parenteseEsquerdo O parêntese esquerdo, usado para fins de localização.
     * @param parametros A lista de parâmetros da função.
     * @param tipoRetorno O tipo de retorno da função.
     * @returns Um construto do tipo `FuncaoDeclaracao`.
     */
    protected async declaracaoFuncaoPotigolTerminadaPorFim(
        simboloPrimario: SimboloInterface,
        parenteseEsquerdo: SimboloInterface,
        parametros: ParametroInterface[],
        tipoRetorno?: SimboloInterface
    ): Promise<FuncaoDeclaracao> {
        const corpo = await this.corpoDaFuncao(simboloPrimario.lexema, parenteseEsquerdo, parametros);

        if (tipoRetorno) {
            corpo.tipo = tipoRetorno.lexema;
        }

        return new FuncaoDeclaracao(simboloPrimario, corpo, tipoRetorno.lexema);
    }

    async corpoDaFuncao(nomeFuncao: string, simboloLocalizacao?: SimboloInterface, parametros?: any[]): Promise<FuncaoConstruto> {
        const corpo = await this.blocoEscopo();

        return new FuncaoConstruto(this.hashArquivo, Number(simboloLocalizacao.linha), parametros, corpo);
    }

    /**
     * Ponto comum entre declarações de funções com nome. Em Potigol, usar `def` para definir
     * uma função é opcional. Essa lógica serve tanto para quando a palavra `def` é usada, 
     * como para casos em que a função começa pelo seu nome, seguida de parênteses.
     * @param {SimboloInterface} simboloNomeFuncao Normalmente um `Simbolo` do tipo `IDENTIFICADOR`.
     * @returns 
     */
    protected async logicaComumDefinicaoFuncaoComNome(simboloNomeFuncao: SimboloInterface<string>): Promise<FuncaoDeclaracao> {
        // O parêntese esquerdo é considerado o símbolo inicial para
        // fins de localização.
        const parenteseEsquerdo = this.avancarEDevolverAnterior();
        const simbolosEntreParenteses: SimboloInterface[] = [];
        while (!this.verificarTipoSimboloAtual(tiposDeSimbolos.PARENTESE_DIREITO)) {
            simbolosEntreParenteses.push(this.avancarEDevolverAnterior());
        }

        const resolucaoParametros = this.logicaComumParametrosPotigol(simbolosEntreParenteses);
        
        this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após parâmetros.");

        // Pode haver uma dica do tipo de retorno ou não.
        // Se houver, é uma declaração de função (verificado mais abaixo).
        let tipoRetorno: SimboloInterface = undefined;
        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.DOIS_PONTOS)) {
            this.verificacaoTipo(
                this.simbolos[this.atual],
                'Esperado tipo válido após dois-pontos como retorno de função.'
            );

            tipoRetorno = this.avancarEDevolverAnterior();
        }

        // Se houver símbolo de igual, seja após fechamento de parênteses,
        // seja após a dica de retorno, é uma declaração de função.
        if (this.simbolos[this.atual].tipo === tiposDeSimbolos.IGUAL) {
            this.avancarEDevolverAnterior();
            const corpoFuncao = await this.declaracaoFuncaoPotigolIniciadaPorIgualOuSeta(
                simboloNomeFuncao,
                resolucaoParametros.parametros,
                tipoRetorno
            );
            return new FuncaoDeclaracao(simboloNomeFuncao, corpoFuncao, tipoRetorno ? tipoRetorno.lexema : 'qualquer')
        }

        return this.declaracaoFuncaoPotigolTerminadaPorFim(
            simboloNomeFuncao,
            parenteseEsquerdo,
            resolucaoParametros.parametros,
            tipoRetorno
        );
    }

    protected async declaracaoDeFuncaoComDef(): Promise<FuncaoDeclaracao> {
        this.avancarEDevolverAnterior(); // `def`
        const simboloNomeFuncao = this.consumir(
            tiposDeSimbolos.IDENTIFICADOR, 
            `Esperado nome da função após palavra reservada 'def'. Atual: ${this.simbolos[this.atual].tipo}.`
        );

        return await this.logicaComumDefinicaoFuncaoComNome(simboloNomeFuncao);
    }

    protected async declaracaoDeFuncaoOuMetodo(construtoPrimario: ConstanteOuVariavel): Promise<FuncaoDeclaracao> {
        return await this.logicaComumDefinicaoFuncaoComNome(construtoPrimario.simbolo);
    }

    async finalizarChamada(entidadeChamada: Construto): Promise<Chamada> {
        const simbolosEntreParenteses: SimboloInterface[] = [];
        while (!this.verificarTipoSimboloAtual(tiposDeSimbolos.PARENTESE_DIREITO)) {
            simbolosEntreParenteses.push(this.avancarEDevolverAnterior());
        }

        this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após parâmetros.");

        const argumentos = await this.microAvaliadorSintatico.analisar(
            { simbolos: simbolosEntreParenteses } as any,
            entidadeChamada.linha
        );

        return new Chamada(
            this.hashArquivo,
            entidadeChamada,
            argumentos.declaracoes.filter((d) => d) as any[]
        );
    }

    /**
     * Verificação comum de tipos.
     * Avança o símbolo se não houver erros.
     * @param simbolo O símbolo sendo analisado.
     * @param mensagemErro A mensagem de erro caso o símbolo atual não seja de tipo.
     */
    protected verificacaoTipo(simbolo: SimboloInterface, mensagemErro: string) {
        if (
            ![tiposDeSimbolos.INTEIRO, tiposDeSimbolos.LOGICO, tiposDeSimbolos.REAL, tiposDeSimbolos.TEXTO].includes(
                simbolo.tipo
            )
            && !(simbolo.lexema in this.tiposDefinidosEmCodigo)
        ) {
            throw this.erro(simbolo, mensagemErro);
        }
    }

    protected logicaComumParametrosPotigol(simbolos: SimboloInterface[]): {
        parametros: ParametroInterface[];
        tipagemDefinida: boolean;
    } {
        const parametros: ParametroInterface[] = [];
        let indice = 0;
        let tipagemDefinida = false;

        while (indice < simbolos.length) {
            if (parametros.length >= 255) {
                this.erro(simbolos[indice], 'Não pode haver mais de 255 parâmetros');
            }

            const parametro: Partial<ParametroInterface> = {};

            // TODO: verificar se Potigol trabalha com número variável de parâmetros.
            /* if (this.simbolos[this.atual].tipo === tiposDeSimbolos.MULTIPLICACAO) {
                this.consumir(tiposDeSimbolos.MULTIPLICACAO, null);
                parametro.abrangencia = 'multiplo';
            } else {
                parametro.abrangencia = 'padrao';
            } */

            parametro.abrangencia = 'padrao';
            if (simbolos[indice].tipo !== tiposDeSimbolos.IDENTIFICADOR) {
                throw this.erro(simbolos[indice], 'Esperado nome do parâmetro.');
            }

            parametro.nome = simbolos[indice];
            indice++;

            if (simbolos[indice].tipo === tiposDeSimbolos.DOIS_PONTOS) {
                indice++;
                this.verificacaoTipo(
                    simbolos[indice],
                    'Esperado tipo do argumento após dois-pontos, em definição de função.'
                );

                const tipoParametro = simbolos[indice];
                const resolucaoTipo = this.tiposPotigolParaDelegua[tipoParametro.lexema];
                parametro.tipoDado = resolucaoTipo;
                tipagemDefinida = true;
                indice++;
            }

            // TODO: Verificar se Potigol trabalha com valores padrão em argumentos.
            /* if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.IGUAL)) {
                parametro.valorPadrao = this.primario();
            } */

            parametros.push(parametro as ParametroInterface);

            // if (parametro.abrangencia === 'multiplo') break;
            // 
            if (indice < simbolos.length && simbolos[indice].tipo !== tiposDeSimbolos.VIRGULA) {
                throw this.erro(simbolos[indice], 'Esperado vírgula entre parâmetros de função.');
            }

            indice++;
        }

        return {
            parametros,
            tipagemDefinida,
        };
    }

    protected async logicaLeiaMultiplo() {
        const simboloLeiaMultiplo: SimboloInterface = this.avancarEDevolverAnterior();
        this.consumir(
            tiposDeSimbolos.PARENTESE_ESQUERDO,
            `Esperado parêntese esquerdo após ${simboloLeiaMultiplo.lexema}.`
        );

        const argumento = await this.expressao();

        this.consumir(
            tiposDeSimbolos.PARENTESE_DIREITO,
            `Esperado parêntese direito após número de parâmetros em chamada de ${simboloLeiaMultiplo.lexema}.`
        );

        switch (simboloLeiaMultiplo.tipo) {
            case tiposDeSimbolos.LEIA_INTEIROS:
                return new LeiaInteiros(simboloLeiaMultiplo, argumento);
            case tiposDeSimbolos.LEIA_REAIS:
                return new LeiaReais(simboloLeiaMultiplo, argumento);
            case tiposDeSimbolos.LEIA_TEXTOS:
                return new LeiaTextos(simboloLeiaMultiplo, argumento);
        }
    }

    /**
     * Lógica para leitura de argumentos tipados de função. Ocorre em casos de leitura
     * de funções anônimas.
     * @param primeiroArgumento O primeiro argumento, já resolvido como construto.
     */
    protected logicaArgumentosTipados(primeiroArgumento: Construto) {
        // Quando esta função executa, já sabemos que o próximo símbolo será um 
        // dois-pontos.
        const simboloPrimeiroArgumento = (primeiroArgumento as any).simbolo as SimboloInterface;
        const simbolosEntreParenteses: SimboloInterface[] = [];

        while (!this.verificarTipoSimboloAtual(tiposDeSimbolos.PARENTESE_DIREITO)) {
            simbolosEntreParenteses.push(this.avancarEDevolverAnterior());
        }

        const todosOsSimbolos = [simboloPrimeiroArgumento, ...simbolosEntreParenteses];
        return this.logicaComumParametrosPotigol(todosOsSimbolos);
    }

    protected logicaFuncaoAnonimaOuTupla(primeiroConstruto: Construto) {
        const simbolosEntreParenteses: SimboloInterface[] = [];
        while (!this.verificarTipoSimboloAtual(tiposDeSimbolos.PARENTESE_DIREITO)) {
            simbolosEntreParenteses.push(this.avancarEDevolverAnterior());
        }

        // Se houver algum dois-pontos nos símbolos lidos, os símbolos devem ser parâmetros.
        if (simbolosEntreParenteses.some(s => s.tipo === tiposDeSimbolos.DOIS_PONTOS)) {
            // Colocamos o primeiro símbolo de volta porque se cada parâmetro possui um tipo
            // definido, precisamos avaliar o primeiro símbolo novamente.
            const simboloPrimeiroConstruto = (primeiroConstruto as any).simbolo;
            const todosOsSimbolos = [simboloPrimeiroConstruto, ...simbolosEntreParenteses];
            const resolucaoParametros = this.logicaComumParametrosPotigol(todosOsSimbolos);

            // Pelo menos o último símbolo precisa ter um tipo.
            if (!resolucaoParametros.tipagemDefinida) {
                throw this.erro(simboloPrimeiroConstruto, `Não foi encontrado um tipo válido na definição de parâmetros para função.`);
            }

            this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após parâmetros ou argumentos.");

            const tipoUltimoParametro = resolucaoParametros.parametros[resolucaoParametros.parametros.length - 1].tipoDado;
            for (const parametro of resolucaoParametros.parametros) {
                if (parametro.tipoDado === undefined) {
                    parametro.tipoDado = tipoUltimoParametro;
                }
            }

            // Pode haver uma dica do tipo de retorno ou não.
            let tipoRetorno: SimboloInterface = undefined;
            if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.DOIS_PONTOS)) {
                this.verificacaoTipo(
                    this.simbolos[this.atual],
                    'Esperado tipo válido após dois-pontos como retorno de função.'
                );

                tipoRetorno = this.avancarEDevolverAnterior();
            }
            
            // Em funções anônimas, logo após o fechamento dos parênteses, e com ou sem dica de retorno, 
            // o próximo símbolo precisa ser uma seta.
            this.consumir(tiposDeSimbolos.SETA, `Esperado seta para definição de corpo de função anônima após leitura de parâmetros. Atual: ${this.simbolos[this.atual].tipo}.`);

            return this.declaracaoFuncaoPotigolIniciadaPorIgualOuSeta(
                { hashArquivo: primeiroConstruto.hashArquivo, linha: primeiroConstruto.linha } as SimboloInterface,
                resolucaoParametros.parametros,
                tipoRetorno
            );
        } else { // Senão, são tuplas.
            // Remove a primeira vírgula
            simbolosEntreParenteses.shift();
            const retornoMicroAvaliadorSintatico = this.microAvaliadorSintatico.analisar(
                { simbolos: simbolosEntreParenteses } as any, 
                primeiroConstruto.linha
            );

            this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após parâmetros ou argumentos.");
            return new SeletorTuplas(primeiroConstruto, ...retornoMicroAvaliadorSintatico.declaracoes) as Tupla;
        }        

        // Se próximo símbolo for fechamento de parênteses, é uma tupla. 
        // Se for dois-pontos (ou seja, especificação de tipos de parâmetros), provavelmente é uma função anônima.
        /* switch (this.simbolos[this.atual].tipo) {
            case tiposDeSimbolos.DOIS_PONTOS:
                // TODO: Terminar
                throw this.erro(this.simbolos[this.atual], 'Terminar.');
            case tiposDeSimbolos.PARENTESE_DIREITO:
                this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após a expressão.");
                return new SeletorTuplas(...argumentos) as Tupla;
        } */
        
    }

    async primario(): Promise<Construto> {
        const simboloAtual = this.simbolos[this.atual];

        switch (simboloAtual.tipo) {
            case tiposDeSimbolos.PARENTESE_ESQUERDO:
                this.avancarEDevolverAnterior();
                const expressao = await this.ou();
                switch (this.simbolos[this.atual].tipo) {
                    case tiposDeSimbolos.DOIS_PONTOS:
                        const argumentosFuncao = this.logicaArgumentosTipados(expressao);

                        if (!argumentosFuncao.tipagemDefinida) {
                            throw this.erro(
                                this.simbolos[this.atual],
                                'Não foi encontrado um tipo válido na definição de parâmetros para função.'
                            );
                        }

                        this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após parâmetros.");

                        const tipoUltimoParametro = argumentosFuncao.parametros[argumentosFuncao.parametros.length - 1].tipoDado;
                        for (const parametro of argumentosFuncao.parametros) {
                            if (parametro.tipoDado === undefined) {
                                parametro.tipoDado = tipoUltimoParametro;
                            }
                        }

                        let tipoRetorno: SimboloInterface = undefined;
                        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.DOIS_PONTOS)) {
                            this.verificacaoTipo(
                                this.simbolos[this.atual],
                                'Esperado tipo válido após dois-pontos como retorno de função.'
                            );

                            tipoRetorno = this.avancarEDevolverAnterior();
                        }

                        this.consumir(
                            tiposDeSimbolos.SETA,
                            `Esperado seta para definição de corpo de função anônima após leitura de parâmetros. Atual: ${this.simbolos[this.atual].tipo}.`
                        );

                        return this.declaracaoFuncaoPotigolIniciadaPorIgualOuSeta(
                            { hashArquivo: expressao.hashArquivo, linha: expressao.linha } as SimboloInterface,
                            argumentosFuncao.parametros,
                            tipoRetorno
                        );
                    case tiposDeSimbolos.VIRGULA:
                        return this.logicaFuncaoAnonimaOuTupla(expressao);
                    default:
                        this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após a expressão.");
                        return new Agrupamento(this.hashArquivo, Number(simboloAtual.linha), expressao);
                }
            case tiposDeSimbolos.COLCHETE_ESQUERDO:
                this.avancarEDevolverAnterior();
                let valores = [];

                if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.COLCHETE_DIREITO)) {
                    return new Vetor(this.hashArquivo, Number(simboloAtual.linha), []);
                }

                while (!this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.COLCHETE_DIREITO)) {
                    const valor = await this.atribuir();
                    valores.push(valor);
                    if (this.simbolos[this.atual].tipo !== tiposDeSimbolos.COLCHETE_DIREITO) {
                        this.consumir(tiposDeSimbolos.VIRGULA, 'Esperado vírgula antes da próxima expressão.');
                    }
                }

                return new Vetor(this.hashArquivo, Number(simboloAtual.linha), valores);
            case tiposDeSimbolos.CARACTERE:
            case tiposDeSimbolos.INTEIRO:
            case tiposDeSimbolos.LOGICO:
            case tiposDeSimbolos.REAL:
            case tiposDeSimbolos.TEXTO:
                const simboloLiteral: SimboloInterface = this.avancarEDevolverAnterior();
                const dicionarioTiposDelegua = {
                    CARACTERE: 'texto',
                    INTEIRO: 'inteiro',
                    LOGICO: 'lógico',
                    REAL: 'número',
                    TEXTO: 'texto',
                };

                return new Literal(
                    this.hashArquivo,
                    Number(simboloLiteral.linha),
                    simboloLiteral.literal,
                    dicionarioTiposDelegua[simboloLiteral.tipo]
                );
            case tiposDeSimbolos.FALSO:
            case tiposDeSimbolos.VERDADEIRO:
                const simboloVerdadeiroFalso: SimboloInterface = this.avancarEDevolverAnterior();
                return new Literal(
                    this.hashArquivo,
                    Number(simboloVerdadeiroFalso.linha),
                    simboloVerdadeiroFalso.tipo === tiposDeSimbolos.VERDADEIRO,
                    'lógico'
                );
            case tiposDeSimbolos.LEIA_INTEIRO:
                const simboloLeiaInteiro: SimboloInterface = this.avancarEDevolverAnterior();
                return new LeiaInteiro(simboloLeiaInteiro, []);
            case tiposDeSimbolos.LEIA_REAL:
                const simboloLeiaReal: SimboloInterface = this.avancarEDevolverAnterior();
                return new LeiaReal(simboloLeiaReal, []);
            case tiposDeSimbolos.LEIA_TEXTO:
                const simboloLeiaTexto: SimboloInterface = this.avancarEDevolverAnterior();
                return new LeiaTexto(simboloLeiaTexto, []);
            case tiposDeSimbolos.LEIA_INTEIROS:
            case tiposDeSimbolos.LEIA_REAIS:
            case tiposDeSimbolos.LEIA_TEXTOS:
                return await this.logicaLeiaMultiplo();
            default:
                const simboloIdentificador: SimboloInterface = this.avancarEDevolverAnterior();
                return new ConstanteOuVariavel(this.hashArquivo, simboloIdentificador);
        }
    }

    protected async formato(): Promise<Construto> {
        const expressao = await this.primario();

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

    /**
     * Concatenação de lista é expressa por dois símbolos de dois-pontos
     * em sequência
     * @returns Um construto, ou vindo da continuação da análise, ou um Binário.
     */
    protected async concatenacaoLista(): Promise<Construto> {
        let expressao = await this.formato();

        if (this.atual < this.simbolos.length) {
            if (
                this.simbolos[this.atual].tipo === tiposDeSimbolos.DOIS_PONTOS &&
                this.verificarTipoProximoSimbolo(tiposDeSimbolos.DOIS_PONTOS)
            ) {
                const primeiroDoisPontos = this.avancarEDevolverAnterior();
                this.avancarEDevolverAnterior();
                const ladoDireito = await this.formato();
                // Como aqui precisamos resolver se o lado direito é constante ou variável,
                // e a concatenação funciona para o operando direito apenas como leitura,
                // é seguro emitir um construto de constante aqui.
                if (!(ladoDireito instanceof ConstanteOuVariavel)) {
                    throw this.erro(
                        primeiroDoisPontos,
                        'Operando direito de uma concatenação de lista não parece ser uma constante ou variável.'
                    );
                }

                const ladoDireitoComoConstante = new Constante(ladoDireito.hashArquivo, ladoDireito.simbolo);
                expressao = new Binario(
                    this.hashArquivo,
                    expressao,
                    new Simbolo(
                        tiposDeSimbolos.CONCATENACAO_LISTA,
                        '::',
                        '::',
                        primeiroDoisPontos.linha,
                        primeiroDoisPontos.hashArquivo
                    ),
                    ladoDireitoComoConstante
                );
            }
        }

        return expressao;
    }

    /**
     * Em Potigol, só é possível determinar a diferença entre uma chamada e uma
     * declaração de função depois dos argumentos.
     *
     * Chamadas não aceitam dicas de tipos de parâmetros.
     * @returns Um construto do tipo `AcessoMetodo`, `AcessoIndiceVariavel` ou `Constante`,
     * dependendo dos símbolos encontrados.
     */
    async chamar(): Promise<Construto> {
        let expressao = await this.concatenacaoLista();

        while (true) {
            if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PARENTESE_ESQUERDO)) {
                if (expressao instanceof ConstanteOuVariavel) {
                    expressao = new Constante(expressao.hashArquivo, expressao.simbolo);
                }
                expressao = await this.finalizarChamada(expressao);
            } else if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PONTO)) {
                if (this.verificarTipoSimboloAtual(tiposDeSimbolos.QUAL_TIPO)) {
                    const identificador = this.simbolos[this.atual - 2];
                    const simbolo = this.simbolos[this.atual];
                    const valor = expressao ? expressao : new Literal(
                        identificador.hashArquivo,
                        identificador.linha,
                        identificador.lexema
                    );
                    this.avancarEDevolverAnterior();
                    // return new TipoDe(this.hashArquivo, simbolo, valor);
                    return new TipoDe(this.hashArquivo, simbolo, valor);
                } else {
                    const nome = this.consumir(tiposDeSimbolos.IDENTIFICADOR, "Esperado nome do método após '.'.");
                    const variavelMetodo = new Variavel(expressao.hashArquivo, (expressao as any).simbolo);
                    expressao = new AcessoMetodoOuPropriedade(this.hashArquivo, variavelMetodo, nome);
                }
            } else if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.COLCHETE_ESQUERDO)) {
                const indice = await this.expressao();
                const simboloFechamento = this.consumir(
                    tiposDeSimbolos.COLCHETE_DIREITO,
                    "Esperado ']' após escrita do indice."
                );
                const variavelVetor = new Variavel(expressao.hashArquivo, (expressao as any).simbolo);
                expressao = new AcessoIndiceVariavel(this.hashArquivo, variavelVetor, indice, simboloFechamento);
            } else {
                if (expressao instanceof ConstanteOuVariavel) {
                    // Neste ponto, precisamos resolver se identificador é uma variável ou
                    // constante.
                    // Se houver menções a variáveis neste escopo ou em escopos anteriores,
                    // consideramos a expressão como variável.
                    // Caso contrário, consideramos como constante.
                    if (this.pilhaEscoposVariaveisConhecidas.variavelExiste(expressao.simbolo.lexema)) {
                        expressao = new Variavel(expressao.hashArquivo, expressao.simbolo);
                    } else {
                        expressao = new Constante(expressao.hashArquivo, expressao.simbolo);
                    }
                }

                break;
            }
        }

        return expressao;
    }

    async comparacaoIgualdade(): Promise<Construto> {
        let expressao = await this.comparar();

        while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.DIFERENTE, tiposDeSimbolos.IGUAL_IGUAL)) {
            const operador = this.simbolos[this.atual - 1];
            const direito = await this.comparar();
            expressao = new Binario(this.hashArquivo, expressao, operador, direito);
        }

        return expressao;
    }

    protected verificarDefinicaoTipoAtual(): string {
        const tipos = [...Object.values(tipoDeDadosPotigol)];

        if (this.simbolos[this.atual].lexema in this.tiposDefinidosEmCodigo) {
            return this.tiposDefinidosEmCodigo[this.simbolos[this.atual].lexema];
        }

        const lexemaElementar = this.simbolos[this.atual].lexema.toLowerCase();
        const tipoElementarResolvido = tipos.find((tipo) => tipo.toLowerCase() === lexemaElementar);
        if (!tipoElementarResolvido) {
            throw this.erro(
                this.simbolos[this.atual],
                `Tipo de dados desconhecido: '${this.simbolos[this.atual].lexema}'.`
            );
        }

        // TODO: Verificar se precisa de alguma avaliação de vetor.
        /* if (this.verificarTipoProximoSimbolo(tiposDeSimbolos.COLCHETE_ESQUERDO)) {
            const tiposVetores = [
                'inteiro[]',
                'numero[]',
                'número[]',
                'qualquer[]',
                'real[]',
                'texto[]',
            ];
            this.avancarEDevolverAnterior();

            if (!this.verificarTipoProximoSimbolo(tiposDeSimbolos.COLCHETE_DIREITO)) {
                throw this.erro(
                    this.simbolos[this.atual],
                    `Esperado símbolo de fechamento do vetor: ']'. Atual: ${this.simbolos[this.atual].lexema}`
                );
            }

            const tipoVetor = tiposVetores.find((tipo) => tipo === `${lexemaElementar}[]`);
            this.avancarEDevolverAnterior();
            return tipoVetor as TipoInferencia;
        } */

        return tipoElementarResolvido as TipoInferencia;
    }

    protected logicaComumInicializadorLeia(inicializador: Construto, identificadores: SimboloInterface<string>[]) {
        switch (inicializador.constructor) {
            case LeiaInteiro:
                const inicializadorTipadoInteiro = inicializador as LeiaInteiro;
                return new LeiaInteiros(
                    inicializadorTipadoInteiro.simbolo,
                    new Literal(
                        this.hashArquivo,
                        Number(inicializadorTipadoInteiro.simbolo.linha),
                        identificadores.length
                    )
                );
                
            case LeiaReal:
                const inicializadorTipadoReal = inicializador as LeiaReal;
                return new LeiaReais(
                    inicializadorTipadoReal.simbolo,
                    new Literal(
                        this.hashArquivo,
                        Number(inicializadorTipadoReal.simbolo.linha),
                        identificadores.length
                    )
                );

            case LeiaTexto:
                const inicializadorTipadoTexto = inicializador as LeiaTexto;
                return new LeiaTextos(
                    inicializadorTipadoTexto.simbolo,
                    new Literal(
                        this.hashArquivo,
                        Number(inicializadorTipadoTexto.simbolo.linha),
                        identificadores.length
                    )
                );

        }
    }

    protected logicaComumInferenciaTiposLeia(inicializador: Construto) {
        switch (inicializador.constructor) {
            case LeiaInteiros:
                return 'inteiro[]';
            case LeiaInteiro:
                return 'inteiro';
            case LeiaReais:
                return 'real[]';
            case LeiaReal:
                return 'real';
            case LeiaTextos:
                return 'texto[]';
            case LeiaTexto:
                return 'texto';
            default:
                return 'qualquer';
        }
    }

    /**
     * Em Potigol, a palavra reservada `val` indica uma constante.
     */
    protected async declaracaoDeConstanteExplicita(): Promise<Const> {
        this.avancarEDevolverAnterior(); // `val`

        const nomeConstante = this.consumir(tiposDeSimbolos.IDENTIFICADOR, 'Esperado nome da constante.');
        let tipo: any = null;

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.DOIS_PONTOS)) {
            const tipoConstante = this.verificarDefinicaoTipoAtual();
            if (!tipoConstante) {
                throw this.erro(this.simbolos[this.atual], 'Tipo definido na constante não é válido.');
            }
            tipo = tipoConstante;
            this.avancarEDevolverAnterior();
        }

        this.consumir(tiposDeSimbolos.IGUAL, "Esperado '=' após identificador em instrução 'val'.");
        let inicializador = await this.expressao();
        if (inicializador instanceof LeiaInteiro || inicializador instanceof LeiaReal || inicializador instanceof LeiaTexto) {
            inicializador = this.logicaComumInicializadorLeia(inicializador, [nomeConstante]);
        }

        return new Const(nomeConstante, inicializador, tipo);
    }

    protected async declaracaoDeConstantes(primeiroIdentificador: Constante): Promise<ConstMultiplo | Const[]> {
        // Normalmente o símbolo atual aqui será uma vírgula.
        this.avancarEDevolverAnterior();

        const identificadores: SimboloInterface[] = [primeiroIdentificador.simbolo];
        let tipo: any = null;

        do {
            identificadores.push(
                this.consumir(tiposDeSimbolos.IDENTIFICADOR, 'Esperado nome da constante.')
            );
        } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

        // TODO: Aparentemente, não é possível definir tipo para atribuição
        // múltipla de constantes. Se algo mudar nisso, o código abaixo poderá
        // voltar a ser usado.
        /* if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.DOIS_PONTOS)) {
            const tipoConstante = this.verificarDefinicaoTipoAtual();
            if (!tipoConstante) {
                throw this.erro(this.simboloAtual(), 'Tipo definido na constante não é válido.');
            }
            tipo = tipoConstante;
            this.avancarEDevolverAnterior();
        } */

        this.consumir(tiposDeSimbolos.IGUAL, "Esperado '=' após identificador em instrução 'constante'.");

        const inicializadores = [];
        do {
            let inicializador = await this.expressao();
            if (identificadores.length > 1 && (
                    inicializador instanceof LeiaInteiro || inicializador instanceof LeiaReal || inicializador instanceof LeiaTexto
            )) {
                inicializador = this.logicaComumInicializadorLeia(inicializador, identificadores);
            }

            inicializadores.push(inicializador);
        } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

        if (identificadores.length !== inicializadores.length) {
            // Pode ser que a inicialização seja feita por uma das
            // funções `leia`, que podem ler vários valores. Neste caso, não deve dar erro.
            if (
                !(
                    inicializadores.length === 1 &&
                    (inicializadores[0] instanceof LeiaInteiro || inicializadores[0] instanceof LeiaInteiros ||
                     inicializadores[0] instanceof LeiaReal || inicializadores[0] instanceof LeiaReais ||
                     inicializadores[0] instanceof LeiaTexto || inicializadores[0] instanceof LeiaTextos)
                )
            ) {
                throw this.erro(
                    identificadores[0],
                    'Quantidade de identificadores à esquerda do igual é diferente da quantidade de valores à direita.'
                );
            }

            const tipoConversao: TipoInferencia = this.logicaComumInferenciaTiposLeia(inicializadores[0]);
            return new ConstMultiplo(identificadores, inicializadores[0], tipoConversao);
        }

        let retorno: Const[] = [];
        for (let [indice, identificador] of identificadores.entries()) {
            retorno.push(new Const(identificador, inicializadores[indice], tipo));
        }

        return retorno;
    }

    /**
     * Este método contempla dois cenários:
     *
     * - A atribuição de variáveis em si (o primeiro símbolo é a palavra reservada `var`);
     * - Uma reatribuição de uma ou mais variáveis (o primeiro símbolo a ser lido é uma
     * vírgula, e o primeiro identificador é passado como argumento). Neste caso, não há
     * a palavra reservada `var`.
     * @param primeiroIdentificador Um construto de variável. É defiido em reatribuições.
     * @returns Um vetor de declarações `Var`.
     */
    async declaracaoDeVariaveisPotigol(primeiroIdentificador?: Variavel): Promise<Var[]> {
        const identificadores: SimboloInterface[] = [];
        let simboloVar: SimboloInterface<string>;

        // Se houver primeiro identificador definido (reatribuição),
        // o símbolo atual aqui será uma vírgula.
        if (primeiroIdentificador) {
            this.avancarEDevolverAnterior();
            identificadores.push(primeiroIdentificador.simbolo);
        } else {
            simboloVar = this.avancarEDevolverAnterior();
        }

        do {
            identificadores.push(
                this.consumir(tiposDeSimbolos.IDENTIFICADOR, 'Esperado nome de variável.')
            );
        } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

        this.consumir(tiposDeSimbolos.REATRIBUIR, "Esperado ':=' após identificador em instrução 'var'.");

        const inicializadores = [];
        do {
            inicializadores.push(await this.expressao());
        } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

        if (identificadores.length !== inicializadores.length) {
            throw this.erro(
                simboloVar,
                'Quantidade de identificadores à esquerda do igual é diferente da quantidade de valores à direita.'
            );
        }

        const retorno = [];
        const escopoAtual = this.pilhaEscoposVariaveisConhecidas.topoDaPilha();
        for (let [indice, identificador] of identificadores.entries()) {
            retorno.push(new Var(identificador, inicializadores[indice]));
            escopoAtual.push(identificador.lexema);
        }

        return retorno;
    }

    protected logicaAtribuicaoComDicaDeTipo() {
        // A dica de tipo é opcional.
        // Só que, se a avaliação entra na dica, só
        // podemos ter uma constante apenas.
        this.avancarEDevolverAnterior();
        const simboloTipo = this.simbolos[this.atual];
        if (
            ![
                tiposDeSimbolos.CARACTERE,
                tiposDeSimbolos.INTEIRO,
                tiposDeSimbolos.LOGICO,
                tiposDeSimbolos.LÓGICO,
                tiposDeSimbolos.REAL,
                tiposDeSimbolos.TEXTO,
            ].includes(simboloTipo.tipo)
            && !(simboloTipo.lexema in this.tiposDefinidosEmCodigo)
        ) {
            throw this.erro(this.simbolos[this.atual], 'Esperado tipo após dois-pontos e nome de identificador.');
        }

        return this.avancarEDevolverAnterior();
    }

    /**
     * Em Potigol, `escreva` aceita apenas um argumento.
     * @returns Uma declaração `Escreva`.
     */
    async declaracaoEscreva(): Promise<Escreva> {
        const simboloAtual = this.avancarEDevolverAnterior();
        const argumento = await this.ou();

        return new Escreva(Number(simboloAtual.linha), simboloAtual.hashArquivo, [argumento]);
    }

    /**
     * Em Potigol, `imprima` aceita apenas um argumento.
     * @returns Uma declaração `EscrevaMesmaLinha`, já que `imprima` em Potigol escreve
     * o resultado na saída na mesma linha.
     * @see https://potigol.github.io/docs/basico/entrada_saida.html
     */
    async declaracaoImprima(): Promise<EscrevaMesmaLinha> {
        const simboloAtual = this.avancarEDevolverAnterior();
        const argumento = await this.ou();

        return new EscrevaMesmaLinha(Number(simboloAtual.linha), simboloAtual.hashArquivo, [argumento]);
    }

    /**
     * Blocos de escopo em Potigol existem quando:
     *
     * - Em uma declaração de função ou método, após fecha parênteses, o próximo
     * símbolo obrigatório não é `=` e há pelo menos um `fim` até o final do código;
     * - Em uma declaração `se`;
     * - Em uma declaração `enquanto`;
     * - Em uma declaração `para`.
     * @returns Um vetor de `Declaracao`.
     */
    async blocoEscopo(): Promise<Array<Declaracao>> {
        let declaracoes: Array<Declaracao> = [];
        this.pilhaEscoposVariaveisConhecidas.empilhar([]);

        while (!this.estaNoFinal() && !this.verificarTipoSimboloAtual(tiposDeSimbolos.FIM)) {
            const retornoDeclaracao = await this.resolverDeclaracaoForaDeBloco();
            if (Array.isArray(retornoDeclaracao)) {
                declaracoes = declaracoes.concat(retornoDeclaracao);
            } else {
                declaracoes.push(retornoDeclaracao as Declaracao);
            }
        }

        this.pilhaEscoposVariaveisConhecidas.removerUltimo();
        return declaracoes;
    }

    async declaracaoSe(): Promise<Se> {
        const simboloSe: SimboloInterface = this.avancarEDevolverAnterior();

        const condicao = await this.expressao();

        this.consumir(tiposDeSimbolos.ENTAO, "Esperado palavra reservada 'entao' após condição em declaração 'se'.");

        const declaracoes = [];
        do {
            declaracoes.push(await this.resolverDeclaracaoForaDeBloco());
        } while (![tiposDeSimbolos.SENAO, tiposDeSimbolos.FIM].includes(this.simbolos[this.atual].tipo));

        let caminhoSenao = null;
        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.SENAO)) {
            const simboloSenao = this.simbolos[this.atual - 1];
            const declaracoesSenao = [];

            do {
                declaracoesSenao.push(await this.resolverDeclaracaoForaDeBloco());
            } while (![tiposDeSimbolos.FIM].includes(this.simbolos[this.atual].tipo));

            caminhoSenao = new Bloco(
                this.hashArquivo,
                Number(simboloSenao.linha),
                declaracoesSenao.filter((d) => d)
            );
        }

        this.consumir(tiposDeSimbolos.FIM, "Esperado palavra-chave 'fim' para fechamento de declaração 'se'.");

        return new Se(
            condicao,
            new Bloco(
                this.hashArquivo,
                Number(simboloSe.linha),
                declaracoes.filter((d) => d)
            ),
            [],
            caminhoSenao
        );
    }

    async declaracaoEnquanto(): Promise<Enquanto> {
        const simboloAtual = this.avancarEDevolverAnterior();

        const condicao = await this.expressao();

        this.consumir(
            tiposDeSimbolos.FACA,
            "Esperado paravra reservada 'faca' após condição de continuidade em declaracão 'enquanto'."
        );

        const declaracoes = [];
        do {
            declaracoes.push(await this.resolverDeclaracaoForaDeBloco());
        } while (![tiposDeSimbolos.FIM].includes(this.simbolos[this.atual].tipo));

        this.consumir(tiposDeSimbolos.FIM, "Esperado palavra-chave 'fim' para fechamento de declaração 'enquanto'.");

        return new Enquanto(
            condicao,
            new Bloco(
                simboloAtual.hashArquivo,
                Number(simboloAtual.linha),
                declaracoes.filter((d) => d)
            )
        );
    }

    async declaracaoPara(): Promise<Para> {
        const simboloPara: SimboloInterface = this.avancarEDevolverAnterior();

        const variavelIteracao = this.consumir(
            tiposDeSimbolos.IDENTIFICADOR,
            "Esperado identificador de variável após 'para'."
        );

        this.consumir(tiposDeSimbolos.DE, "Esperado palavra reservada 'de' após variável de controle de 'para'.");

        const literalOuVariavelInicio = await this.adicaoOuSubtracao();

        this.consumir(
            tiposDeSimbolos.ATE,
            "Esperado palavra reservada 'ate' após valor inicial do laço de repetição 'para'."
        );

        const literalOuVariavelFim = await this.adicaoOuSubtracao();

        let operadorCondicao = new Simbolo(
            tiposDeSimbolos.MENOR_IGUAL,
            '<=',
            null,
            Number(simboloPara.linha),
            this.hashArquivo
        );
        let operadorCondicaoIncremento = new Simbolo(
            tiposDeSimbolos.MENOR,
            '<',
            null,
            Number(simboloPara.linha),
            this.hashArquivo
        );

        // Isso existe porque o laço `para` do Potigol pode ter o passo positivo ou negativo
        // dependendo dos operandos de início e fim, que só são possíveis de determinar
        // em tempo de execução.
        // Quando um dos operandos é uma variável, tanto a condição do laço quanto o
        // passo são considerados indefinidos aqui.
        let passo: Construto;
        let resolverIncrementoEmExecucao = false;
        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PASSO)) {
            passo = await this.unario();
        } else {
            if (literalOuVariavelInicio instanceof Literal && literalOuVariavelFim instanceof Literal) {
                if (literalOuVariavelInicio.valor > literalOuVariavelFim.valor) {
                    passo = new Unario(
                        this.hashArquivo,
                        new Simbolo(
                            tiposDeSimbolos.SUBTRACAO,
                            '-',
                            undefined,
                            simboloPara.linha,
                            simboloPara.hashArquivo
                        ),
                        new Literal(this.hashArquivo, Number(simboloPara.linha), 1),
                        'ANTES'
                    );
                    operadorCondicao = new Simbolo(
                        tiposDeSimbolos.MAIOR_IGUAL,
                        '>=',
                        null,
                        Number(simboloPara.linha),
                        this.hashArquivo
                    );
                    operadorCondicaoIncremento = new Simbolo(
                        tiposDeSimbolos.MAIOR,
                        '>',
                        null,
                        Number(simboloPara.linha),
                        this.hashArquivo
                    );
                } else {
                    passo = new Literal(this.hashArquivo, Number(simboloPara.linha), 1);
                }
            } else {
                // Passo e operador de condição precisam ser resolvidos em tempo de execução.
                passo = undefined;
                operadorCondicao = undefined;
                operadorCondicaoIncremento = undefined;
                resolverIncrementoEmExecucao = true;
            }
        }

        let condicaoGere: Construto = undefined;
        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.SE)) {
            condicaoGere = await this.expressao();
        }

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.GERE)) {
            const declaracoesGere = [];
            let simboloAtualBlocoGere: SimboloInterface = this.simbolos[this.atual];
            while (simboloAtualBlocoGere.tipo !== tiposDeSimbolos.FIM) {
                declaracoesGere.push(await this.resolverDeclaracaoForaDeBloco());
                simboloAtualBlocoGere = this.simbolos[this.atual];
            }

            this.consumir(tiposDeSimbolos.FIM, "Esperado 'fim' após bloco de 'gere'.");
            return new ParaGere(
                this.hashArquivo,
                Number(simboloPara.linha),
                variavelIteracao,
                literalOuVariavelInicio,
                literalOuVariavelFim,
                declaracoesGere.filter((d) => d),
                passo,
                condicaoGere
            ) as unknown as Para;
        }

        if (condicaoGere) {
            throw this.erro(
                this.simbolos[this.atual] || this.simboloAnterior(),
                "A guarda 'se' em laço 'para' só é suportada com a forma 'gere' neste dialeto."
            );
        }

        this.consumir(
            tiposDeSimbolos.FACA,
            "Esperado palavra reservada 'faca' após valor final do laço de repetição 'para', ou 'gere' para compreensão."
        );

        const declaracoesBlocoPara = [];
        let simboloAtualBlocoPara: SimboloInterface = this.simbolos[this.atual];
        while (simboloAtualBlocoPara.tipo !== tiposDeSimbolos.FIM) {
            declaracoesBlocoPara.push(await this.resolverDeclaracaoForaDeBloco());
            simboloAtualBlocoPara = this.simbolos[this.atual];
        }

        this.consumir(tiposDeSimbolos.FIM, '');

        const corpo = new Bloco(
            this.hashArquivo,
            Number(simboloPara.linha) + 1,
            declaracoesBlocoPara.filter((d) => d)
        );

        const para = new Para(
            this.hashArquivo,
            Number(simboloPara.linha),
            new Expressao(new Atribuir(
                this.hashArquivo,
                new Variavel(this.hashArquivo, variavelIteracao, 'inteiro'),
                literalOuVariavelInicio
            )),
            new Binario(
                this.hashArquivo,
                new Variavel(this.hashArquivo, variavelIteracao),
                operadorCondicao,
                literalOuVariavelFim
            ),
            new FimPara(
                this.hashArquivo,
                Number(simboloPara.linha),
                new Binario(
                    this.hashArquivo,
                    new Variavel(this.hashArquivo, variavelIteracao),
                    operadorCondicaoIncremento,
                    literalOuVariavelFim
                ),
                new Expressao(
                    new Atribuir(
                        this.hashArquivo,
                        new Variavel(this.hashArquivo, variavelIteracao, 'inteiro'),
                        new Binario(
                            this.hashArquivo,
                            new Variavel(this.hashArquivo, variavelIteracao),
                            new Simbolo(tiposDeSimbolos.ADICAO, '+', null, Number(simboloPara.linha), this.hashArquivo),
                            passo
                        )
                    )
                )
            ),
            corpo
        );
        para.blocoPosExecucao = corpo;
        para.resolverIncrementoEmExecucao = resolverIncrementoEmExecucao;
        return para;
    }

    async declaracaoEscolha(): Promise<Escolha> {
        this.avancarEDevolverAnterior();

        const condicao = await this.expressao();

        const caminhos = [];
        let caminhoPadrao = null;

        while (!this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.FIM)) {
            this.consumir(tiposDeSimbolos.CASO, "Esperado palavra reservada 'caso' após condição de 'escolha'.");
            if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.TRACO_BAIXO)) {
                // Caso padrão
                if (caminhoPadrao !== null) {
                    const excecao = new ErroAvaliadorSintatico(
                        this.simbolos[this.atual],
                        "Você só pode ter um caminho padrão em cada declaração de 'escolha'."
                    );
                    this.erros.push(excecao);
                    throw excecao;
                }

                this.consumir(tiposDeSimbolos.SETA, "Esperado '=>' após palavra reservada 'caso'.");
                const declaracoesPadrao = [await this.resolverDeclaracaoForaDeBloco()];

                // TODO: Verificar se Potigol admite bloco de escopo para `escolha`.
                /* const declaracoesPadrao = [];
                do {
                    declaracoesPadrao.push(this.declaracao());
                } while (!this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.CASO, tiposDeSimbolos.FIM)); */

                caminhoPadrao = {
                    declaracoes: declaracoesPadrao,
                };

                continue;
            }

            const caminhoCondicoes = [await this.expressao()];
            while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA)) {
                caminhoCondicoes.push(await this.expressao());
            }

            let guarda = null;
            if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.SE)) {
                guarda = await this.expressao();
            }

            this.consumir(tiposDeSimbolos.SETA, "Esperado '=>' após palavra reservada 'caso'.");
            const declaracoes = [await this.resolverDeclaracaoForaDeBloco()];

            // TODO: Verificar se Potigol admite bloco de escopo para `escolha`.
            /* const declaracoes = [];
            do {
                declaracoes.push(this.declaracao());
            } while (!this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.CASO, tiposDeSimbolos.FIM)); */

            caminhos.push({
                condicoes: caminhoCondicoes,
                declaracoes,
                guarda,
            });
        }

        return new Escolha(condicao, caminhos, caminhoPadrao);
    }

    declaracaoFazer(): Fazer {
        throw this.erro(
            this.simbolos[this.atual] || this.simboloAnterior(),
            "A construção iniciada por 'faca' não é suportada como declaração isolada neste dialeto. Use 'enquanto ... faca ... fim' ou 'para ... faca ... fim'."
        );
    }

    protected declaracaoUse(): Importar {
        this.avancarEDevolverAnterior();
        const caminho = this.consumir(tiposDeSimbolos.TEXTO, "Esperado caminho textual após 'use'.");
        return new Importar(new Literal(this.hashArquivo, Number(caminho.linha), caminho.literal, 'texto'));
    }

    protected async declaracaoTipoOuAlias(): Promise<Classe | AliasTipo> {
        const simboloTipo = this.avancarEDevolverAnterior();
        const tipoAbstrato = this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.ABSTRATO);
        const simboloNomeTipo = this.consumir(
            tiposDeSimbolos.IDENTIFICADOR,
            "Esperado nome após palavra reservada 'tipo'."
        );

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.IGUAL)) {
            if (tipoAbstrato) {
                throw this.erro(
                    this.simboloAnterior(),
                    "Não é permitido declarar alias com 'tipo abstrato'. Use 'tipo Nome = Tipo' ou 'tipo abstrato Nome ... fim'."
                );
            }

            const tipoOriginal = this.verificarDefinicaoTipoAtual();
            this.avancarEDevolverAnterior();
            this.tiposDefinidosEmCodigo[simboloNomeTipo.lexema] = tipoOriginal;
            return new AliasTipo(simboloNomeTipo, tipoOriginal);
        }

        const construto = new ConstanteOuVariavel(this.hashArquivo, simboloNomeTipo);

        const metodos: FuncaoDeclaracao[] = [];
        const propriedades: PropriedadeClasse[] = [];
        while (!this.estaNoFinal() && !this.verificarTipoSimboloAtual(tiposDeSimbolos.FIM)) {
            const identificador: SimboloInterface = this.consumir(
                tiposDeSimbolos.IDENTIFICADOR,
                'Esperado nome de propriedade ou método.'
            );

            if (this.simbolos[this.atual].tipo === tiposDeSimbolos.PARENTESE_ESQUERDO) {
                const construtoMetodo = new Constante(identificador.hashArquivo, identificador);
                metodos.push(await this.declaracaoDeFuncaoOuMetodo(construtoMetodo));
            } else {
                this.consumir(
                    tiposDeSimbolos.DOIS_PONTOS,
                    'Esperado dois-pontos após nome de propriedade em declaração de tipo.'
                );

                this.verificacaoTipo(
                    this.simbolos[this.atual],
                    'Esperado tipo do argumento após dois-pontos, em definição de função.'
                );

                const tipoPropriedade = this.avancarEDevolverAnterior();
                propriedades.push(
                    new PropriedadeClasse(identificador, this.tiposPotigolParaDelegua[tipoPropriedade.lexema])
                );
            }
        }

        this.consumir(tiposDeSimbolos.FIM, "Esperado 'fim' após o escopo do tipo.");

        const instrucoesConstrutor = [];
        for (let propriedade of propriedades) {
            instrucoesConstrutor.push(
                new Expressao(
                    new DefinirValor(
                        propriedade.hashArquivo,
                        propriedade.linha,
                        new Isto(
                            propriedade.hashArquivo,
                            propriedade.linha,
                            new Simbolo(
                                tiposDeSimbolos.ISTO,
                                'isto',
                                undefined,
                                simboloTipo.linha,
                                simboloTipo.hashArquivo
                            )
                        ),
                        propriedade.nome,
                        new Variavel(propriedade.hashArquivo, propriedade.nome)
                    )
                )
            );
        }

        const construtorConstruto = new FuncaoConstruto(
            simboloTipo.hashArquivo,
            simboloTipo.linha,
            propriedades.map(
                (p) =>
                    ({
                        abrangencia: 'padrao',
                        nome: p.nome,
                    }) as ParametroInterface
            ),
            instrucoesConstrutor
        );

        const construtor = new FuncaoDeclaracao(
            new Simbolo(
                tiposDeSimbolos.CONSTRUTOR,
                'construtor',
                undefined,
                simboloTipo.hashArquivo,
                simboloTipo.linha
            ),
            construtorConstruto,
            undefined
        );

        // Nesta fase, `tipo abstrato` compartilha a mesma representação sintática
        // de `tipo`, preservando compatibilidade de execução com o runtime atual.
        metodos.unshift(construtor);
        return new Classe(construto.simbolo, undefined, metodos, propriedades);
    }

    /**
     * Uma declaração de tipo nada mais é do que um declaração de classe.
     * Em Potigol, classe e tipo são praticamente a mesma coisa.
     *
     * @returns Um construto do tipo `Classe`.
     */
    protected async declaracaoTipo(): Promise<Classe> {
        const declaracaoTipo = await this.declaracaoTipoOuAlias();
        if (declaracaoTipo instanceof AliasTipo) {
            throw this.erro(
                declaracaoTipo.simbolo,
                'Alias de tipo não pode ser usado em um contexto que exige declaração de classe.'
            );
        }

        return declaracaoTipo;
    }

    async atribuir(): Promise<any> {
        const expressao = await this.ou();

        if (!this.estaNoFinal()) {
            let tipoVariavelOuConstante: SimboloInterface<string>;
            if (expressao instanceof Constante) {
                // Atribuição constante.
                let tipoExplicito = false;
                if (this.simbolos[this.atual].tipo === tiposDeSimbolos.DOIS_PONTOS) {
                    tipoVariavelOuConstante = this.logicaAtribuicaoComDicaDeTipo();
                    tipoExplicito = true;
                }

                switch (this.simbolos[this.atual].tipo) {
                    case tiposDeSimbolos.VIRGULA:
                        return await this.declaracaoDeConstantes(expressao);
                    case tiposDeSimbolos.IGUAL:
                        this.avancarEDevolverAnterior();
                        const valorAtribuicao = await this.ou();
                        return new Const(
                            (expressao as Constante).simbolo,
                            valorAtribuicao,
                            tipoVariavelOuConstante
                                ? (this.tiposPotigolParaDelegua[tipoVariavelOuConstante.lexema] as TipoInferencia)
                                : undefined,
                            tipoExplicito
                        );
                }
            } else if (expressao instanceof Variavel) {
                // Reatribuição de variável.

                switch (this.simbolos[this.atual].tipo) {
                    case tiposDeSimbolos.VIRGULA:
                        return await this.declaracaoDeVariaveisPotigol(expressao);
                    case tiposDeSimbolos.REATRIBUIR:
                        this.avancarEDevolverAnterior();
                        const valorAtribuicao = await this.ou();
                        return new ReatribuicaoVariavel(
                            (expressao as Variavel).simbolo,
                            valorAtribuicao,
                            tipoVariavelOuConstante
                                ? (this.tiposPotigolParaDelegua[tipoVariavelOuConstante.lexema] as TipoInferencia)
                                : undefined
                        );
                }
            }
        }

        return expressao;
    }

    /**
     * Potigol não possui simplesmente um `leia`. Seus comandos `leia` são todos tipados.
     * São eles: `leia_inteiro`, `leia_inteiros`, `leia_real`, `leia_reais`, `leia_texto` e
     * `leia_textos`.
     */
    protected async expressaoLeia(): Promise<Leia> {
        throw this.erro(
            this.simbolos[this.atual] || this.simboloAnterior(),
            "Potigol não possui uma expressão genérica 'leia'. Use uma das formas tipadas, como 'leia_inteiro', 'leia_real', 'leia_texto', 'leia_inteiros', 'leia_reais' ou 'leia_textos'."
        );
    }

    /**
     * Em Potigol, uma definição de função pode simplesmente começar com um
     * identificador - que não é uma palavra reservada - seguido de parênteses.
     * Este ponto de entrada verifica o símbolo atual e o próximo.
     *
     * Diferentemente dos demais dialetos, verificamos logo de cara se
     * temos uma definição ou chamada de função, isto porque definições
     * nunca aparecem do lado direito de uma atribuição, a não ser que
     * estejam entre parênteses (_currying_).
     *
     * Se o próximo símbolo for parênteses, ou é uma definiçao de função,
     * ou uma chamada de função.
     */
    async expressaoOuDefinicaoFuncao() {
        if (!this.estaNoFinal() && this.simbolos[this.atual].tipo === tiposDeSimbolos.IDENTIFICADOR) {
            if (this.atual + 1 < this.simbolos.length) {
                switch (this.simbolos[this.atual + 1].tipo) {
                    case tiposDeSimbolos.PARENTESE_ESQUERDO:
                        const construtoPrimario = await this.primario();
                        return this.declaracaoDeFuncaoOuMetodo(construtoPrimario as ConstanteOuVariavel);
                }
            }
        }

        return await this.atribuir();
    }

    resolverDeclaracaoForaDeBloco(): Declaracao | Declaracao[] | Construto | Construto[] | any {
        const simboloAtual = this.simbolos[this.atual];
        switch (simboloAtual.tipo) {
            case tiposDeSimbolos.DEF:
                return this.declaracaoDeFuncaoComDef();
            case tiposDeSimbolos.ENQUANTO:
                return this.declaracaoEnquanto();
            case tiposDeSimbolos.ESCOLHA:
                return this.declaracaoEscolha();
            case tiposDeSimbolos.ESCREVA:
                return this.declaracaoEscreva();
            case tiposDeSimbolos.FACA:
                return this.declaracaoFazer();
            case tiposDeSimbolos.IMPRIMA:
                return this.declaracaoImprima();
            case tiposDeSimbolos.PARA:
                return this.declaracaoPara();
            case tiposDeSimbolos.SE:
                return this.declaracaoSe();
            case tiposDeSimbolos.TIPO:
                return this.declaracaoTipoOuAlias();
            case tiposDeSimbolos.USE:
                return this.declaracaoUse();
            case tiposDeSimbolos.VAL:
                return this.declaracaoDeConstanteExplicita();
            case tiposDeSimbolos.VARIAVEL:
                return this.declaracaoDeVariaveisPotigol();
            default:
                return this.expressaoOuDefinicaoFuncao();
        }
    }

    async analisar(
        retornoLexador: RetornoLexador<SimboloInterface>,
        hashArquivo: number
    ): Promise<RetornoAvaliadorSintatico<Declaracao>> {
        this.microAvaliadorSintatico = new MicroAvaliadorSintaticoPotigol(hashArquivo);
        this.erros = [];
        this.atual = 0;
        this.blocos = 0;
        this.pilhaEscoposVariaveisConhecidas = new PilhaEscoposVariaveisConhecidas();
        this.pilhaEscoposVariaveisConhecidas.empilhar([]);
        this.tiposDefinidosEmCodigo = {};

        this.hashArquivo = hashArquivo || 0;
        this.simbolos = retornoLexador?.simbolos || [];

        this.declaracoes = [];
        while (!this.estaNoFinal()) {
            const retornoDeclaracao = await this.resolverDeclaracaoForaDeBloco();
            if (Array.isArray(retornoDeclaracao)) {
                this.declaracoes = this.declaracoes.concat(retornoDeclaracao);
            } else {
                this.declaracoes.push(retornoDeclaracao as Declaracao);
            }
        }

        return {
            declaracoes: this.declaracoes,
            erros: this.erros,
        } as RetornoAvaliadorSintatico<Declaracao>;
    }
}
