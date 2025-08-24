import {
    AcessoIndiceVariavel,
    AcessoMetodoOuPropriedade,
    AcessoPropriedade,
    Agrupamento,
    ArgumentoReferenciaFuncao,
    AtribuicaoPorIndice,
    Atribuir,
    Binario,
    Chamada,
    ComentarioComoConstruto,
    Constante,
    Construto,
    Deceto,
    DefinirValor,
    Dicionario,
    Dupla,
    ExpressaoRegular,
    FimPara,
    FormatacaoEscrita,
    FuncaoConstruto,
    Isto,
    Leia,
    Literal,
    Logico,
    Noneto,
    Octeto,
    Quarteto,
    Quinteto,
    ReferenciaFuncao,
    Separador,
    Septeto,
    Sexteto,
    Super,
    TipoDe,
    Trio,
    Tupla,
    Unario,
    Variavel,
    Vetor,
} from '@designliquido/delegua/construtos';
import {
    Classe,
    Const,
    ConstMultiplo,
    Expressao,
    FuncaoDeclaracao,
    Enquanto,
    Escolha,
    Escreva,
    Fazer,
    Importar,
    Para,
    ParaCada,
    Se,
    Tente,
    Var,
    VarMultiplo,
    Bloco,
    Continua,
    EscrevaMesmaLinha,
    Retorna,
    Sustar,
    Declaracao,
    Falhar,
    Aleatorio,
    CabecalhoPrograma,
    TendoComo,
    PropriedadeClasse,
    InicioAlgoritmo,
    Comentario,
} from '@designliquido/delegua/declaracoes';
import { ContinuarQuebra, SustarQuebra } from '@designliquido/delegua/quebras';

import { LeiaInteiro, LeiaInteiros, LeiaReais, LeiaReal, LeiaTexto, LeiaTextos, QualTipo } from '../construtos';
import { ReatribuicaoVariavel } from '../declaracoes';
import { VisitanteComumPotigolInterface } from '../interfaces';

import tiposDeSimbolos from '../tipos-de-simbolos/lexico-regular';

export class FormatadorPotigol implements VisitanteComumPotigolInterface {
    indentacaoAtual: number;
    quebraLinha: string;
    tamanhoIndentacao: number;
    codigoFormatado: string;
    devePularLinha: boolean;
    deveIndentar: boolean;

    constructor(quebraLinha: string, tamanhoIndentacao: number = 4) {
        this.quebraLinha = quebraLinha;
        this.tamanhoIndentacao = tamanhoIndentacao;

        this.indentacaoAtual = 0;
        this.codigoFormatado = '';
        this.devePularLinha = true;
        this.deveIndentar = true;
    }

    visitarExpressaoComentario(expressao: ComentarioComoConstruto): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoSeparador(expressao: Separador): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoArgumentoReferenciaFuncao(expressao: ArgumentoReferenciaFuncao): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoReferenciaFuncao(expressao: ReferenciaFuncao): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoQualTipo(expressao: QualTipo): Promise<string> | void {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoLeiaInteiro(declaracao: LeiaInteiro): Promise<any> | void {
        this.codigoFormatado += 'leia_inteiro';
    }

    visitarDeclaracaoLeiaInteiros(declaracao: LeiaInteiros): Promise<any> | void {
        this.codigoFormatado += 'leia_inteiros';
        if (declaracao.argumentoCardinalidade) {
            this.codigoFormatado += '(';
            this.formatarDeclaracaoOuConstruto(declaracao.argumentoCardinalidade);
            this.codigoFormatado += ')';
        }
    }

    visitarDeclaracaoLeiaReais(declaracao: LeiaReais): Promise<any> | void {
        this.codigoFormatado += 'leia_reais';
        if (declaracao.argumentoCardinalidade) {
            this.codigoFormatado += '(';
            this.formatarDeclaracaoOuConstruto(declaracao.argumentoCardinalidade);
            this.codigoFormatado += ')';
        }
    }

    visitarDeclaracaoLeiaReal(declaracao: LeiaReal): Promise<any> | void {
        this.codigoFormatado += 'leia_real';
    }

    visitarDeclaracaoLeiaTexto(declaracao: LeiaTexto): Promise<any> | void {
        this.codigoFormatado += 'leia_texto';
    }

    visitarDeclaracaoLeiaTextos(declaracao: LeiaTextos): Promise<any> | void {
        this.codigoFormatado += 'leia_textos';
        if (declaracao.argumentoCardinalidade) {
            this.codigoFormatado += '(';
            this.formatarDeclaracaoOuConstruto(declaracao.argumentoCardinalidade);
            this.codigoFormatado += ')';
        }
    }

    visitarExpressaoAcessoMetodoOuPropriedade(expressao: AcessoMetodoOuPropriedade): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoAcessoPropriedade(expressao: AcessoPropriedade): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): void {
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        }

        this.codigoFormatado += `${declaracao.simbolo.lexema}`;
        if (declaracao.inicializador) {
            this.codigoFormatado += ` := `;
            this.deveIndentar = false;
            this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
            this.deveIndentar = true;
        }

        // TODO: Talvez seja necessário mais futuramente.
        /* if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        } */
    }

    /**
     * Aparentemente só existe comentário de uma linha só em Potigol.
     * @param declaracao A declaração de comentário.
     */
    visitarDeclaracaoComentario(declaracao: Comentario): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}# ${declaracao.conteudo}${this.quebraLinha}`;
    }

    visitarDeclaracaoTendoComo(declaracao: TendoComo): void {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoInicioAlgoritmo(declaracao: InicioAlgoritmo): Promise<void> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoCabecalhoPrograma(declaracao: CabecalhoPrograma): Promise<void> {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoTupla(expressao: Tupla): Promise<void> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoClasse(declaracao: Classe): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}tipo ${declaracao.simbolo.lexema}${this.quebraLinha}`;
        this.formatarBlocoOuVetorDeclaracoes(declaracao.propriedades);
        this.formatarBlocoOuVetorDeclaracoes(declaracao.metodos);
        this.codigoFormatado += `fim${this.quebraLinha}`;
    }

    visitarExpressaoPropriedadeClasse(expressao: PropriedadeClasse): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}${expressao.nome.lexema}: `;
        if (expressao.tipo) {
            this.codigoFormatado += `${expressao.tipo}`;
        }

        this.codigoFormatado += this.quebraLinha;
    }

    visitarDeclaracaoConst(declaracao: Const): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}${declaracao.simbolo.lexema}`;

        if (declaracao.tipoExplicito) {
            switch (declaracao.tipo.toUpperCase()) {
                case tiposDeSimbolos.TEXTO:
                    this.codigoFormatado += ': Caractere';
                    break;
                case tiposDeSimbolos.INTEIRO:
                    this.codigoFormatado += ': Inteiro';
                    break;
                case 'NUMERO':
                case tiposDeSimbolos.REAL:
                    this.codigoFormatado += ': Real';
                    break;
                case tiposDeSimbolos.LOGICO:
                case tiposDeSimbolos.LÓGICO:
                    this.codigoFormatado += ': Lógico';
                    break;
            }
        }

        if (declaracao.inicializador) {
            this.codigoFormatado += ' = ';
            this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
        }
    }

    visitarDeclaracaoConstMultiplo(declaracao: ConstMultiplo): Promise<void> {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoDeAtribuicao(expressao: Atribuir): void {
        this.formatarDeclaracaoOuConstruto(expressao.alvo);
        this.codigoFormatado += ` de `;
        this.formatarDeclaracaoOuConstruto(expressao.valor);

        if (this.devePularLinha) {
            this.codigoFormatado += `${this.quebraLinha}`;
        }
    }

    visitarDeclaracaoDeExpressao(declaracao: Expressao): void {
        this.formatarDeclaracaoOuConstruto(declaracao.expressao);
    }

    visitarDeclaracaoAleatorio(declaracao: Aleatorio): Promise<void> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoDefinicaoFuncao(declaracao: FuncaoDeclaracao): void {
        if (declaracao.simbolo.tipo !== tiposDeSimbolos.CONSTRUTOR) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}${declaracao.simbolo.lexema}(`;

            this.visitarExpressaoFuncaoConstruto(declaracao.funcao);
        }
    }

    visitarDeclaracaoEnquanto(declaracao: Enquanto): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}enquanto `;
        this.formatarDeclaracaoOuConstruto(declaracao.condicao);
        this.codigoFormatado += ` faca`;
        this.codigoFormatado += this.quebraLinha;

        this.devePularLinha = true;
        this.formatarDeclaracaoOuConstruto(declaracao.corpo);
        this.codigoFormatado += this.quebraLinha;
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim`;
        this.devePularLinha = false;
    }

    private formatarBlocoOuVetorDeclaracoes(declaracoes: Declaracao[]): void {
        this.indentacaoAtual += this.tamanhoIndentacao;
        for (let declaracaoBloco of declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracaoBloco);
        }
        this.indentacaoAtual -= this.tamanhoIndentacao;
    }

    visitarDeclaracaoEscolha(declaracao: Escolha): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}escolha `;

        this.formatarDeclaracaoOuConstruto(declaracao.identificadorOuLiteral);
        this.codigoFormatado += this.quebraLinha;
        this.indentacaoAtual += this.tamanhoIndentacao;
        this.deveIndentar = false;

        for (let caminho of declaracao.caminhos) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}caso `;
            this.formatarDeclaracaoOuConstruto(caminho.condicoes[0]);
            this.codigoFormatado += ` => `;
            this.devePularLinha = false;
            this.deveIndentar = false;
            this.formatarBlocoOuVetorDeclaracoes(caminho.declaracoes);
            this.codigoFormatado += this.quebraLinha;
            this.devePularLinha = true;
            this.deveIndentar = true;
        }

        if (declaracao.caminhoPadrao.declaracoes.length > 0) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}caso _ => `;
            this.devePularLinha = false;
            this.deveIndentar = false;
            this.formatarBlocoOuVetorDeclaracoes(declaracao.caminhoPadrao.declaracoes);
            this.codigoFormatado += this.quebraLinha;
            this.devePularLinha = true;
            this.deveIndentar = true;
        }

        this.indentacaoAtual -= this.tamanhoIndentacao;
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim${this.quebraLinha}`;
    }

    visitarDeclaracaoEscreva(declaracao: Escreva): void {
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}escreva `;
        } else {
            this.codigoFormatado += `escreva `;
        }

        this.deveIndentar = false;
        for (let argumento of declaracao.argumentos) {
            this.formatarDeclaracaoOuConstruto(argumento);
        }

        this.deveIndentar = true;

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
    }

    visitarDeclaracaoFazer(declaracao: Fazer): void {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoImportar(declaracao: Importar): void {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoPara(declaracao: Para): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}para `;
        this.devePularLinha = false;
        if (declaracao.inicializador) {
            if (Array.isArray(declaracao.inicializador)) {
                this.deveIndentar = false;
                for (let declaracaoInicializador of declaracao.inicializador) {
                    this.formatarDeclaracaoOuConstruto(declaracaoInicializador);
                }
                this.deveIndentar = true;
            } else {
                this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
            }
        }

        if (declaracao.condicao instanceof Binario) this.codigoFormatado += ` ate ${declaracao.condicao.direita.valor}`;
        else this.formatarDeclaracaoOuConstruto(declaracao.condicao);

        this.codigoFormatado += ` faca${this.quebraLinha}`;
        this.formatarDeclaracaoOuConstruto(declaracao.incrementar);
        this.formatarBlocoOuVetorDeclaracoes(declaracao.corpo.declaracoes);

        this.codigoFormatado += `${this.quebraLinha}${' '.repeat(this.indentacaoAtual)}fim${this.quebraLinha}`;
    }

    visitarDeclaracaoParaCada(declaracao: ParaCada): Promise<void> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoSe(declaracao: Se): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}se `;
        this.formatarDeclaracaoOuConstruto(declaracao.condicao);
        this.codigoFormatado += ` entao${this.quebraLinha}`;

        this.indentacaoAtual += this.tamanhoIndentacao;
        for (let declaracaoBloco of (declaracao.caminhoEntao as Bloco).declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracaoBloco);
        }

        this.indentacaoAtual -= this.tamanhoIndentacao;
        if (declaracao.caminhoSenao) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}senao${this.quebraLinha}`;
            this.formatarDeclaracaoOuConstruto(declaracao.caminhoSenao);
        }

        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim${this.quebraLinha}`;
    }

    visitarDeclaracaoTente(declaracao: Tente): void {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoVar(declaracao: Var): void {
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        }

        this.codigoFormatado += `var ${declaracao.simbolo.lexema}`;
        if (declaracao.inicializador) {
            this.codigoFormatado += ` := `;
            this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
        }

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
    }

    visitarDeclaracaoVarMultiplo(declaracao: VarMultiplo): void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoAcessoIndiceVariavel(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoAcessoElementoMatriz(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoAcessoMetodo(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoAgrupamento(expressao: any): any {
        this.codigoFormatado += '(';
        this.formatarDeclaracaoOuConstruto(expressao.expressao);
        this.codigoFormatado += ')';
    }

    visitarExpressaoAtribuicaoPorIndice(expressao: any): void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoAtribuicaoPorIndicesMatriz(expressao: any): void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoBinaria(expressao: Binario) {
        this.formatarDeclaracaoOuConstruto(expressao.esquerda);
        switch (expressao.operador.tipo) {
            case tiposDeSimbolos.ADICAO:
                this.codigoFormatado += ' + ';
                break;
            case tiposDeSimbolos.CONCATENACAO_LISTA:
                this.codigoFormatado += ` :: `;
                break;
            case tiposDeSimbolos.DIFERENTE:
                this.codigoFormatado += ` <> `;
                break;
            case tiposDeSimbolos.DIVISAO:
                this.codigoFormatado += ' / ';
                break;
            case tiposDeSimbolos.DIVISAO_INTEIRA:
                this.codigoFormatado += ' div ';
                break;
            case tiposDeSimbolos.IGUAL:
                this.codigoFormatado += ' = ';
                break;
            case tiposDeSimbolos.IGUAL_IGUAL:
                this.codigoFormatado += ` == `;
                break;
            case tiposDeSimbolos.MAIOR:
                this.codigoFormatado += ' > ';
                break;
            case tiposDeSimbolos.MAIOR_IGUAL:
                this.codigoFormatado += ' >= ';
                break;
            case tiposDeSimbolos.MENOR:
                this.codigoFormatado += ' < ';
                break;
            case tiposDeSimbolos.MENOR_IGUAL:
                this.codigoFormatado += ' <= ';
                break;
            case tiposDeSimbolos.SUBTRACAO:
                this.codigoFormatado += ` - `;
                break;
            case tiposDeSimbolos.MULTIPLICACAO:
                this.codigoFormatado += ` * `;
                break;
            case tiposDeSimbolos.MODULO:
                this.codigoFormatado += ` mod `;
                break;
            case tiposDeSimbolos.EXPONENCIACAO:
                this.codigoFormatado += ` ^ `;
                break;
            default:
                console.log(expressao.operador.tipo);
                break;
        }
        this.formatarDeclaracaoOuConstruto(expressao.direita);
    }

    visitarExpressaoBloco(declaracao: Bloco): any {
        this.formatarBlocoOuVetorDeclaracoes(declaracao.declaracoes);
    }

    visitarExpressaoContinua(declaracao?: Continua): ContinuarQuebra {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoDeChamada(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoDefinirValor(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoDeleguaFuncao(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoDeVariavel(expressao: Variavel) {
        if (this.deveIndentar) {
            this.codigoFormatado += ' '.repeat(this.indentacaoAtual);
        }

        this.codigoFormatado += `${expressao.simbolo.lexema}`;
    }

    visitarExpressaoDicionario(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoExpressaoRegular(expressao: ExpressaoRegular): Promise<RegExp> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha) {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}imprima `;
        for (let argumento of declaracao.argumentos) {
            const argumentoTratado = argumento as FormatacaoEscrita;
            this.formatarDeclaracaoOuConstruto(argumentoTratado);
            this.codigoFormatado += ', ';
        }
        if (declaracao.argumentos.length && this.codigoFormatado[this.codigoFormatado.length - 2] === ',') {
            this.codigoFormatado = this.codigoFormatado.slice(0, -2);
        }
    }

    visitarExpressaoFalhar(expressao: any): void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoFimPara(declaracao: FimPara) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoFormatacaoEscrita(declaracao: FormatacaoEscrita) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoFuncaoConstruto(expressao: FuncaoConstruto) {
        this.indentacaoAtual += this.tamanhoIndentacao;

        if (expressao.parametros.length > 0) {
            for (let parametro of expressao.parametros) {
                if (parametro.tipoDado) {
                    this.codigoFormatado += `${parametro.nome.lexema}: `;
                    switch (parametro.tipoDado.toUpperCase()) {
                        case tiposDeSimbolos.TEXTO:
                            this.codigoFormatado += 'Caractere';
                            break;
                        case tiposDeSimbolos.REAL:
                            this.codigoFormatado += 'Real';
                            break;
                        case tiposDeSimbolos.INTEIRO:
                            this.codigoFormatado += 'Inteiro';
                            break;
                        default:
                            break;
                    }
                    this.codigoFormatado += `, `;
                }
            }

            this.codigoFormatado = `${this.codigoFormatado.slice(0, -2)})`;
        }

        // Se há tipo de retorno definido
        if (expressao.tipo) {
            this.codigoFormatado += `: ${expressao.tipo}`;
        }

        this.codigoFormatado += ` = `;
        this.deveIndentar = false;

        for (let declaracaoCorpo of expressao.corpo) {
            this.formatarDeclaracaoOuConstruto(declaracaoCorpo);
        }

        this.deveIndentar = true;
        this.indentacaoAtual -= this.tamanhoIndentacao;
    }

    visitarExpressaoIsto(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoLeia(expressao: Leia): void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoLiteral(expressao: Literal): any {
        if (typeof expressao.valor === 'string') {
            this.codigoFormatado += `"${expressao.valor}"`;
            return;
        } else if (typeof expressao.valor === 'boolean') {
            if (expressao.valor) {
                this.codigoFormatado += 'verdadeiro';
            } else {
                this.codigoFormatado += 'falso';
            }
            return;
        }

        this.codigoFormatado += `${expressao.valor}`;
    }

    visitarExpressaoLogica(expressao: any) {
        this.formatarDeclaracaoOuConstruto(expressao.esquerda);

        switch (expressao.operador.tipo) {
            case tiposDeSimbolos.E:
                this.codigoFormatado += ` e `;
                break;
            case tiposDeSimbolos.OU:
                this.codigoFormatado += ` ou `;
                break;
            case tiposDeSimbolos.NEGACAO:
                this.codigoFormatado += ` nao `;
                break;
        }

        this.formatarDeclaracaoOuConstruto(expressao.direita);
    }

    visitarExpressaoRetornar(declaracao: Retorna): any {
        this.formatarDeclaracaoOuConstruto(declaracao.valor);
    }

    visitarExpressaoSuper(expressao: Super) {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoSustar(declaracao?: Sustar): SustarQuebra {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoTipoDe(expressao: TipoDe): void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoUnaria(expressao: Unario) {
        let operador: string;
        switch (expressao.operador.tipo) {
            case tiposDeSimbolos.SUBTRACAO:
                operador = ` - `;
                break;
            case tiposDeSimbolos.ADICAO:
                operador = ` + `;
                break;
            case tiposDeSimbolos.NEGACAO:
                operador = ` nao `;
                break;
        }

        switch (expressao.incidenciaOperador) {
            case 'ANTES':
                this.codigoFormatado += operador;
                this.formatarDeclaracaoOuConstruto(expressao.operando);
                break;
            case 'DEPOIS':
                this.formatarDeclaracaoOuConstruto(expressao.operando);
                this.codigoFormatado += operador;
                break;
        }

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
    }

    visitarExpressaoVetor(expressao: any) {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoConstante(expressao: Constante): any {
        if (this.deveIndentar) {
            this.codigoFormatado += ' '.repeat(this.indentacaoAtual);
        }

        this.codigoFormatado += `${expressao.simbolo.lexema}`;
    }

    private formatarDeclaracaoTuplas(declaracao: Declaracao | Construto) {
        const declaracoes = Object.keys(declaracao);
        this.codigoFormatado += '(';
        for (let chaveDeclaracao of declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracao[chaveDeclaracao]);
            this.codigoFormatado += ', ';
        }
        this.codigoFormatado = this.codigoFormatado.slice(0, -2);
        this.codigoFormatado += ')';
    }

    visitarExpressaoDupla(expressao: Dupla): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoTrio(expressao: Trio): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoQuarteto(expressao: Quarteto): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoQuinteto(expressao: Quinteto): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoSexteto(expressao: Sexteto): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoSepteto(expressao: Septeto): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoOcteto(expressao: Octeto): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoNoneto(expressao: Noneto): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    visitarExpressaoDeceto(expressao: Deceto): any {
        this.formatarDeclaracaoTuplas(expressao);
    }

    formatarDeclaracaoOuConstruto(declaracaoOuConstruto: Declaracao | Construto): void {
        switch (declaracaoOuConstruto.constructor.name) {
            case 'AcessoIndiceVariavel':
                this.visitarExpressaoAcessoIndiceVariavel(declaracaoOuConstruto as AcessoIndiceVariavel);
                break;
            case 'AcessoMetodoOuPropriedade':
                this.visitarExpressaoAcessoMetodo(declaracaoOuConstruto as AcessoMetodoOuPropriedade);
                break;
            case 'Agrupamento':
                this.visitarExpressaoAgrupamento(declaracaoOuConstruto as Agrupamento);
                break;
            case 'AtribuicaoPorIndice':
                this.visitarExpressaoAtribuicaoPorIndice(declaracaoOuConstruto as AtribuicaoPorIndice);
                break;
            case 'Atribuir':
                this.visitarExpressaoDeAtribuicao(declaracaoOuConstruto as Atribuir);
                break;
            case 'Binario':
                this.visitarExpressaoBinaria(declaracaoOuConstruto as Binario);
                break;
            case 'Bloco':
                this.visitarExpressaoBloco(declaracaoOuConstruto as Bloco);
                break;
            case 'Chamada':
                this.visitarExpressaoDeChamada(declaracaoOuConstruto as Chamada);
                break;
            case 'Classe':
                this.visitarDeclaracaoClasse(declaracaoOuConstruto as Classe);
                break;
            case 'Continua':
                this.visitarExpressaoContinua(declaracaoOuConstruto as Continua);
                break;
            case 'DefinirValor':
                this.visitarExpressaoDefinirValor(declaracaoOuConstruto as DefinirValor);
                break;
            case 'Dicionario':
                this.visitarExpressaoDicionario(declaracaoOuConstruto as Dicionario);
                break;
            case 'Dupla':
                this.visitarExpressaoDupla(declaracaoOuConstruto as Dupla);
                break;
            case 'Trio':
                this.visitarExpressaoTrio(declaracaoOuConstruto as Trio);
                break;
            case 'Quarteto':
                this.visitarExpressaoQuarteto(declaracaoOuConstruto as Quarteto);
                break;
            case 'Quinteto':
                this.visitarExpressaoQuinteto(declaracaoOuConstruto as Quinteto);
                break;
            case 'Sexteto':
                this.visitarExpressaoSexteto(declaracaoOuConstruto as Sexteto);
                break;
            case 'Septeto':
                this.visitarExpressaoSepteto(declaracaoOuConstruto as Septeto);
                break;
            case 'Octeto':
                this.visitarExpressaoOcteto(declaracaoOuConstruto as Octeto);
                break;
            case 'Noneto':
                this.visitarExpressaoNoneto(declaracaoOuConstruto as Noneto);
                break;
            case 'Deceto':
                this.visitarExpressaoDeceto(declaracaoOuConstruto as Deceto);
                break;
            case 'Escolha':
                this.visitarDeclaracaoEscolha(declaracaoOuConstruto as Escolha);
                break;
            case 'Enquanto':
                this.visitarDeclaracaoEnquanto(declaracaoOuConstruto as Enquanto);
                break;
            case 'Escreva':
                this.visitarDeclaracaoEscreva(declaracaoOuConstruto as Escreva);
                break;
            case 'EscrevaMesmaLinha':
                this.visitarDeclaracaoEscrevaMesmaLinha(declaracaoOuConstruto as Escreva);
                break;
            case 'Expressao':
                this.visitarDeclaracaoDeExpressao(declaracaoOuConstruto as Expressao);
                break;
            case 'ExpressaoRegular':
                this.visitarExpressaoExpressaoRegular(declaracaoOuConstruto as ExpressaoRegular);
                break;
            case 'Falhar':
                this.visitarExpressaoFalhar(declaracaoOuConstruto as Falhar);
                break;
            case 'Fazer':
                this.visitarDeclaracaoFazer(declaracaoOuConstruto as Fazer);
                break;
            case 'FuncaoConstruto':
                this.visitarExpressaoFuncaoConstruto(declaracaoOuConstruto as FuncaoConstruto);
                break;
            case 'FuncaoDeclaracao':
                this.visitarDeclaracaoDefinicaoFuncao(declaracaoOuConstruto as FuncaoDeclaracao);
                break;
            case 'Importar':
                this.visitarDeclaracaoImportar(declaracaoOuConstruto as Importar);
                break;
            case 'Isto':
                this.visitarExpressaoIsto(declaracaoOuConstruto as Isto);
                break;
            case 'Leia':
                this.visitarExpressaoLeia(declaracaoOuConstruto as Leia);
                break;
            case 'Literal':
                this.visitarExpressaoLiteral(declaracaoOuConstruto as Literal);
                break;
            case 'Logico':
                this.visitarExpressaoLogica(declaracaoOuConstruto as Logico);
                break;
            case 'Para':
                this.visitarDeclaracaoPara(declaracaoOuConstruto as Para);
                break;
            case 'ParaCada':
                this.visitarDeclaracaoParaCada(declaracaoOuConstruto as ParaCada);
                break;
            case 'ReatribuicaoVariavel':
                this.visitarDeclaracaoReatribuicaoVariavel(declaracaoOuConstruto as ReatribuicaoVariavel);
                break;
            case 'Retorna':
                this.visitarExpressaoRetornar(declaracaoOuConstruto as Retorna);
                break;
            case 'Se':
                this.visitarDeclaracaoSe(declaracaoOuConstruto as Se);
                break;
            case 'Super':
                this.visitarExpressaoSuper(declaracaoOuConstruto as Super);
                break;
            case 'Sustar':
                this.visitarExpressaoSustar(declaracaoOuConstruto as Sustar);
                break;
            case 'Tente':
                this.visitarDeclaracaoTente(declaracaoOuConstruto as Tente);
                break;
            case 'TipoDe':
                this.visitarExpressaoTipoDe(declaracaoOuConstruto as TipoDe);
                break;
            case 'Unario':
                this.visitarExpressaoUnaria(declaracaoOuConstruto as Unario);
                break;
            case 'Const':
                this.visitarDeclaracaoConst(declaracaoOuConstruto as Const);
                break;
            case 'Var':
                this.visitarDeclaracaoVar(declaracaoOuConstruto as Var);
                break;
            case 'Variavel':
                this.visitarExpressaoDeVariavel(declaracaoOuConstruto as Variavel);
                break;
            case 'Vetor':
                this.visitarExpressaoVetor(declaracaoOuConstruto as Vetor);
                break;
            case 'Constante':
                this.visitarDeclaracaoConstante(declaracaoOuConstruto as Constante);
                break;
            case 'PropriedadeClasse':
                this.visitarExpressaoPropriedadeClasse(declaracaoOuConstruto as any);
                break;
            default:
                console.log(declaracaoOuConstruto.constructor.name);
                break;
        }
    }

    formatar(declaracoes: Declaracao[]): string {
        this.indentacaoAtual = 0;
        this.codigoFormatado = '';
        this.devePularLinha = true;
        this.deveIndentar = true;

        for (let declaracao of declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracao);
        }

        this.indentacaoAtual -= this.tamanhoIndentacao;

        return this.codigoFormatado;
    }
}
