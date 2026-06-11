import {
    AcessoMetodo,
    AcessoIndiceVariavel,
    AcessoIntervaloVariavel,
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
    TuplaN,
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
    CabecalhoPrograma,
    TendoComo,
    PropriedadeClasse,
    InicioAlgoritmo,
    Comentario,
    TextoDocumentacao,
} from '@designliquido/delegua/declaracoes';
import { ContinuarQuebra, SustarQuebra } from '@designliquido/delegua/quebras';

import { ConstanteOuVariavel, LeiaInteiro, LeiaInteiros, LeiaReais, LeiaReal, LeiaTexto, LeiaTextos } from '../construtos';
import { AliasTipo, AtribuicaoParalelaVariavel, ParaEmGere, ParaGere, ReatribuicaoVariavel } from '../declaracoes';
import { VisitanteComumPotigolInterface } from '../interfaces';

import tiposDeSimbolos from '../tipos-de-simbolos/lexico-regular';
import { ConstrutoInterface } from '@designliquido/delegua';

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

    private normalizarTipo(tipo: string | undefined): string | undefined {
        if (!tipo) {
            return undefined;
        }

        switch (tipo.toUpperCase()) {
            case tiposDeSimbolos.TEXTO:
                return 'Caractere';
            case tiposDeSimbolos.INTEIRO:
                return 'Inteiro';
            case 'NUMERO':
            case tiposDeSimbolos.REAL:
                return 'Real';
            case tiposDeSimbolos.LOGICO:
            case tiposDeSimbolos.LÓGICO:
                return 'Lógico';
            default:
                return tipo;
        }
    }

    visitarExpressaoTuplaN(expressao: TuplaN): Promise<any> | void {
        this.codigoFormatado += '(';
        for (let indice = 0; indice < expressao.elementos.length; indice++) {
            this.formatarDeclaracaoOuConstruto(expressao.elementos[indice]);
            if (indice < expressao.elementos.length - 1) {
                this.codigoFormatado += ', ';
            }
        }
        this.codigoFormatado += ')';
    }
    
    /* istanbul ignore next */
    visitarExpressaoAcessoIntervaloVariavel(expressao: AcessoIntervaloVariavel): Promise<any> | void {
        // Fatiamento/slicing (a[1:5]) não é uma construção de Potigol. Use pegue() e descarte().
        throw new Error('Fatiamento de intervalos não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarDeclaracaoTextoDocumentacao(declaracao: TextoDocumentacao): Promise<any> | void {
        // Documentação inline não existe em Potigol.
        throw new Error('TextoDocumentacao não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarExpressaoComentario(expressao: ComentarioComoConstruto): Promise<any> | void {
        // Comentário como construto não existe em Potigol.
        throw new Error('ComentarioComoConstruto não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarExpressaoSeparador(expressao: Separador): Promise<any> | void {
        // Separador não existe em Potigol.
        throw new Error('Separador não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarExpressaoArgumentoReferenciaFuncao(expressao: ArgumentoReferenciaFuncao): Promise<any> | void {
        // Referência de argumento de função como construto não existe em Potigol.
        throw new Error('ArgumentoReferenciaFuncao não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarExpressaoReferenciaFuncao(expressao: ReferenciaFuncao): Promise<any> | void {
        // Referência de função como construto não existe em Potigol.
        throw new Error('ReferenciaFuncao não é uma construção de Potigol.');
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
        this.formatarDeclaracaoOuConstruto(expressao.objeto);
        this.codigoFormatado += `.${expressao.simbolo.lexema}`;
    }

    visitarExpressaoAcessoPropriedade(expressao: AcessoPropriedade): Promise<any> | void {
        this.formatarDeclaracaoOuConstruto(expressao.objeto);
        this.codigoFormatado += `.${expressao.nomePropriedade}`;
    }

    visitarDeclaracaoAtribuicaoParalelaVariavel(declaracao: AtribuicaoParalelaVariavel): void {
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        }

        this.codigoFormatado += declaracao.simbolos.map(s => s.lexema).join(', ');
        this.codigoFormatado += ` := `;
        this.deveIndentar = false;
        declaracao.inicializadores.forEach((init, i) => {
            if (i > 0) this.codigoFormatado += ', ';
            this.formatarDeclaracaoOuConstruto(init);
        });
        this.deveIndentar = true;
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

    /* istanbul ignore next */
    visitarDeclaracaoTendoComo(declaracao: TendoComo): void {
        // TendoComo (with...as) não existe em Potigol.
        throw new Error('TendoComo não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarDeclaracaoInicioAlgoritmo(declaracao: InicioAlgoritmo): Promise<void> {
        // InicioAlgoritmo não existe em Potigol.
        throw new Error('InicioAlgoritmo não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarDeclaracaoCabecalhoPrograma(declaracao: CabecalhoPrograma): Promise<void> {
        // CabecalhoPrograma não existe em Potigol.
        throw new Error('CabecalhoPrograma não é uma construção de Potigol.');
    }

    visitarExpressaoTupla(expressao: Tupla): void {
        const elementos = (expressao as any).elementos;
        if (Array.isArray(elementos)) {
            this.codigoFormatado += '(';
            for (let indice = 0; indice < elementos.length; indice++) {
                this.formatarDeclaracaoOuConstruto(elementos[indice]);
                if (indice < elementos.length - 1) {
                    this.codigoFormatado += ', ';
                }
            }
            this.codigoFormatado += ')';
        }
    }

    visitarDeclaracaoClasse(declaracao: Classe): void {
        const prefixoAbstrato = declaracao.abstrata ? ' abstrato' : '';
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}tipo${prefixoAbstrato} ${declaracao.simbolo.lexema}${this.quebraLinha}`;
        this.indentacaoAtual += this.tamanhoIndentacao;

        for (const propriedade of declaracao.propriedades) {
            this.formatarDeclaracaoOuConstruto(propriedade);
        }

        for (const metodo of declaracao.metodos) {
            const tamanhoAntes = this.codigoFormatado.length;
            this.formatarDeclaracaoOuConstruto(metodo);

            if (this.codigoFormatado.length > tamanhoAntes && !this.codigoFormatado.endsWith(this.quebraLinha)) {
                this.codigoFormatado += this.quebraLinha;
            }
        }

        this.indentacaoAtual -= this.tamanhoIndentacao;
        this.codigoFormatado += `fim${this.quebraLinha}`;
    }

    visitarDeclaracaoAliasTipo(declaracao: AliasTipo): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}tipo ${declaracao.simbolo.lexema} = ${declaracao.tipoOriginal}${this.quebraLinha}`;
    }

    visitarExpressaoPropriedadeClasse(expressao: PropriedadeClasse): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}${expressao.nome.lexema}: `;
        if (expressao.tipo) {
            this.codigoFormatado += `${this.normalizarTipo(expressao.tipo)}`;
        }

        this.codigoFormatado += this.quebraLinha;
    }

    visitarDeclaracaoConst(declaracao: Const): void {
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        }

        this.codigoFormatado += `${declaracao.simbolo.lexema}`;

        if (declaracao.tipoExplicito) {
            const tipoNormalizado = this.normalizarTipo(declaracao.tipo);
            if (tipoNormalizado) {
                this.codigoFormatado += `: ${tipoNormalizado}`;
            }
        }

        if (declaracao.inicializador) {
            this.codigoFormatado += ' = ';
            this.deveIndentar = false;
            this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
            this.deveIndentar = true;
        }

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
    }

    visitarDeclaracaoConstMultiplo(declaracao: ConstMultiplo): void {
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        }

        this.codigoFormatado += declaracao.simbolos.map((simbolo) => simbolo.lexema).join(', ');
        this.codigoFormatado += ' = ';
        this.deveIndentar = false;
        this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
        this.deveIndentar = true;

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
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
            for (let indice = 0; indice < caminho.condicoes.length; indice++) {
                this.formatarDeclaracaoOuConstruto(caminho.condicoes[indice]);
                if (indice < caminho.condicoes.length - 1) {
                    this.codigoFormatado += ', ';
                }
            }

            if ((caminho as any).guarda) {
                this.codigoFormatado += ` se `;
                this.formatarDeclaracaoOuConstruto((caminho as any).guarda);
            }

            this.codigoFormatado += ` => `;
            this.devePularLinha = false;
            this.deveIndentar = false;
            this.formatarBlocoOuVetorDeclaracoes(caminho.declaracoes);
            this.codigoFormatado += this.quebraLinha;
            this.devePularLinha = true;
            this.deveIndentar = true;
        }

        if (declaracao.caminhoPadrao && declaracao.caminhoPadrao.declaracoes.length > 0) {
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

    /* istanbul ignore next */
    visitarDeclaracaoFazer(declaracao: Fazer): void {
        // Laço faça...enquanto (do-while) não existe em Potigol.
        throw new Error('O laço faça...enquanto não é uma construção de Potigol.');
    }

    visitarDeclaracaoImportar(declaracao: Importar): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}use `;
        this.formatarDeclaracaoOuConstruto(declaracao.caminho);
        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
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

    visitarDeclaracaoParaGere(declaracao: ParaGere): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}para ${declaracao.simboloIteracao.lexema} de `;
        this.deveIndentar = false;
        this.devePularLinha = false;
        this.formatarDeclaracaoOuConstruto(declaracao.inicio);
        this.codigoFormatado += ' ate ';
        this.formatarDeclaracaoOuConstruto(declaracao.fim);

        if (declaracao.passo) {
            this.codigoFormatado += ' passo ';
            this.formatarDeclaracaoOuConstruto(declaracao.passo);
        }

        if (declaracao.condicao) {
            this.codigoFormatado += ' se ';
            this.formatarDeclaracaoOuConstruto(declaracao.condicao);
        }

        this.codigoFormatado += ` gere${this.quebraLinha}`;
        this.devePularLinha = true;
        this.formatarBlocoOuVetorDeclaracoes(declaracao.corpo as any[]);
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim${this.quebraLinha}`;
        this.deveIndentar = true;
    }

    visitarDeclaracaoParaEmGere(declaracao: ParaEmGere): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}para ${declaracao.simboloIteracao.lexema} em `;
        this.deveIndentar = false;
        this.devePularLinha = false;
        this.formatarDeclaracaoOuConstruto(declaracao.colecao);

        if (declaracao.condicao) {
            this.codigoFormatado += ' se ';
            this.formatarDeclaracaoOuConstruto(declaracao.condicao);
        }

        this.codigoFormatado += ` gere${this.quebraLinha}`;
        this.devePularLinha = true;
        this.formatarBlocoOuVetorDeclaracoes(declaracao.corpo as any[]);
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim${this.quebraLinha}`;
        this.deveIndentar = true;
    }

    visitarDeclaracaoParaCada(declaracao: ParaCada): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}para ${(declaracao.variavelIteracao as any).simbolo.lexema} em `;
        this.deveIndentar = false;
        this.devePularLinha = false;
        this.formatarDeclaracaoOuConstruto(declaracao.vetorOuDicionario);
        this.codigoFormatado += ` faca${this.quebraLinha}`;
        this.deveIndentar = true;
        this.devePularLinha = true;
        this.formatarBlocoOuVetorDeclaracoes(declaracao.corpo.declaracoes);
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim${this.quebraLinha}`;
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

        let caminhoAtual = declaracao.caminhoSenao;
        while (caminhoAtual instanceof Se) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}senao se `;
            this.formatarDeclaracaoOuConstruto(caminhoAtual.condicao);
            this.codigoFormatado += ` entao${this.quebraLinha}`;
            this.indentacaoAtual += this.tamanhoIndentacao;
            for (let d of (caminhoAtual.caminhoEntao as Bloco).declaracoes) {
                this.formatarDeclaracaoOuConstruto(d);
            }
            this.indentacaoAtual -= this.tamanhoIndentacao;
            caminhoAtual = caminhoAtual.caminhoSenao;
        }

        if (caminhoAtual) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}senao${this.quebraLinha}`;
            this.formatarDeclaracaoOuConstruto(caminhoAtual);
        }

        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim${this.quebraLinha}`;
    }

    /* istanbul ignore next */
    visitarDeclaracaoTente(declaracao: Tente): void {
        // Tratamento de exceções (tente...senão) não existe em Potigol.
        throw new Error('Tratamento de exceções não é uma construção de Potigol.');
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
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        }

        this.codigoFormatado += `var ${declaracao.simbolos.map((s) => s.lexema).join(', ')} := `;
        this.deveIndentar = false;
        this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
        this.deveIndentar = true;

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
    }

    visitarExpressaoAcessoIndiceVariavel(expressao: AcessoIndiceVariavel) {
        this.formatarDeclaracaoOuConstruto(expressao.entidadeChamada);
        this.codigoFormatado += '[';
        this.formatarDeclaracaoOuConstruto(expressao.indice);
        this.codigoFormatado += ']';
    }

    /* istanbul ignore next */
    visitarExpressaoAcessoElementoMatriz(expressao: any) {
        // Acesso a matrizes multidimensionais não é uma construção de Potigol.
        throw new Error('Acesso a elemento de matriz não é uma construção de Potigol.');
    }

    visitarExpressaoAcessoMetodo(expressao: AcessoMetodo) {
        this.formatarDeclaracaoOuConstruto(expressao.objeto);
        this.codigoFormatado += `.${expressao.nomeMetodo}`;
    }

    visitarExpressaoAgrupamento(expressao: any): any {
        this.codigoFormatado += '(';
        this.formatarDeclaracaoOuConstruto(expressao.expressao);
        this.codigoFormatado += ')';
    }

    visitarExpressaoAtribuicaoPorIndice(expressao: AtribuicaoPorIndice): void {
        this.formatarDeclaracaoOuConstruto(expressao.objeto);
        this.codigoFormatado += '[';
        this.formatarDeclaracaoOuConstruto(expressao.indice);
        this.codigoFormatado += '] := ';
        this.formatarDeclaracaoOuConstruto(expressao.valor);

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
    }

    /* istanbul ignore next */
    visitarExpressaoAtribuicaoPorIndicesMatriz(expressao: any): void {
        // Atribuição por índices de matriz não é uma construção de Potigol.
        throw new Error('Atribuição por índices de matriz não é uma construção de Potigol.');
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

    /* istanbul ignore next */
    visitarExpressaoContinua(declaracao?: Continua): ContinuarQuebra {
        // A instrução 'continua' (continue) não existe em Potigol.
        throw new Error("A instrução 'continua' não é uma construção de Potigol.");
    }

    visitarExpressaoDeChamada(expressao: Chamada) {
        this.formatarDeclaracaoOuConstruto(expressao.entidadeChamada);
        this.codigoFormatado += '(';

        for (let indice = 0; indice < expressao.argumentos.length; indice++) {
            this.formatarDeclaracaoOuConstruto(expressao.argumentos[indice]);
            if (indice < expressao.argumentos.length - 1) {
                this.codigoFormatado += ', ';
            }
        }

        this.codigoFormatado += ')';
    }

    visitarExpressaoDefinirValor(expressao: DefinirValor) {
        this.formatarDeclaracaoOuConstruto(expressao.objeto);
        this.codigoFormatado += `.${expressao.nome.lexema} := `;
        this.formatarDeclaracaoOuConstruto(expressao.valor);

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
    }

    /* istanbul ignore next */
    visitarExpressaoDeleguaFuncao(expressao: any) {
        // Funções Delegua como construto não existem em Potigol.
        throw new Error('DeleguaFuncao não é uma construção de Potigol.');
    }

    visitarExpressaoDeVariavel(expressao: Variavel) {
        if (this.deveIndentar) {
            this.codigoFormatado += ' '.repeat(this.indentacaoAtual);
        }

        this.codigoFormatado += `${expressao.simbolo.lexema}`;
    }

    /* istanbul ignore next */
    visitarExpressaoDicionario(expressao: any) {
        // Dicionários não existem em Potigol.
        throw new Error('Dicionário não é uma construção de Potigol.');
    }

    /* istanbul ignore next */
    visitarExpressaoExpressaoRegular(expressao: ExpressaoRegular): Promise<RegExp> {
        // Expressões regulares como literais não existem em Potigol.
        throw new Error('Expressão regular não é uma construção de Potigol.');
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

    /* istanbul ignore next */
    visitarExpressaoFalhar(expressao: any): void {
        // A instrução 'falhar' não existe em Potigol.
        throw new Error("A instrução 'falhar' não é uma construção de Potigol.");
    }

    visitarExpressaoFimPara(declaracao: FimPara) {
        // FimPara representa o incremento em loops 'para'
        // Não adiciona formatação extra, apenas processa o conteúdo
        if (declaracao.incremento) {
            this.formatarDeclaracaoOuConstruto(declaracao.incremento);
        }
    }

    /* istanbul ignore next */
    visitarExpressaoFormatacaoEscrita(declaracao: FormatacaoEscrita) {
        // FormatacaoEscrita não é produzida pelo avaliador sintático de Potigol.
        // Em Potigol, formatação é feita pelo método .formato() nos valores.
        throw new Error('FormatacaoEscrita não é produzida pelo avaliador sintático de Potigol.');
    }

    visitarExpressaoFuncaoConstruto(expressao: FuncaoConstruto) {
        this.indentacaoAtual += this.tamanhoIndentacao;

        if (expressao.parametros.length > 0) {
            for (let parametro of expressao.parametros) {
                if (parametro.tipoDado) {
                    this.codigoFormatado += `${parametro.nome.lexema}: `;
                    const tipoNormalizado = this.normalizarTipo(parametro.tipoDado);
                    if (tipoNormalizado) {
                        this.codigoFormatado += tipoNormalizado;
                    }
                    this.codigoFormatado += `, `;
                }
            }

            this.codigoFormatado = `${this.codigoFormatado.slice(0, -2)})`;
        } else {
            // Função sem parâmetros - fecha os parênteses
            this.codigoFormatado += ')';
        }

        // Se há tipo de retorno definido
        if (expressao.tipo) {
            this.codigoFormatado += `: ${this.normalizarTipo(expressao.tipo)}`;
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
        this.codigoFormatado += 'isto';
    }

    /* istanbul ignore next */
    visitarExpressaoLeia(expressao: Leia): void {
        // Potigol não possui 'leia' genérico — use leia_inteiro, leia_real ou leia_texto.
        throw new Error("Potigol não possui 'leia' genérico. Use leia_inteiro, leia_real ou leia_texto.");
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

    /* istanbul ignore next */
    visitarExpressaoSuper(expressao: Super) {
        // A instrução 'super' não existe em Potigol — o dialeto não suporta herança.
        throw new Error("A instrução 'super' não é uma construção de Potigol.");
    }

    /* istanbul ignore next */
    visitarExpressaoSustar(declaracao?: Sustar): SustarQuebra {
        // A instrução 'sustar' (break) não existe em Potigol.
        throw new Error("A instrução 'sustar' não é uma construção de Potigol.");
    }

    visitarExpressaoTipoDe(expressao: TipoDe): void {
        this.formatarDeclaracaoOuConstruto(expressao.valor);
        this.codigoFormatado += `.${expressao.simbolo.lexema}`;
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

    visitarExpressaoVetor(expressao: Vetor) {
        this.codigoFormatado += '[';
        for (let indice = 0; indice < expressao.elementos.length; indice++) {
            this.formatarDeclaracaoOuConstruto(expressao.elementos[indice]);
            if (indice < expressao.elementos.length - 1) {
                this.codigoFormatado += ', ';
            }
        }
        this.codigoFormatado += ']';
    }

    visitarDeclaracaoConstante(expressao: Constante): any {
        if (this.deveIndentar) {
            this.codigoFormatado += ' '.repeat(this.indentacaoAtual);
        }

        this.codigoFormatado += `${expressao.simbolo.lexema}`;
    }

    visitarExpressaoConstanteOuVariavel(expressao: ConstanteOuVariavel): void {
        if (this.deveIndentar) {
            this.codigoFormatado += ' '.repeat(this.indentacaoAtual);
        }

        this.codigoFormatado += `${expressao.simbolo.lexema}`;
    }

    private formatarDeclaracaoTuplas(declaracao: Declaracao | ConstrutoInterface) {
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

    formatarDeclaracaoOuConstruto(declaracaoOuConstruto: Declaracao | ConstrutoInterface): void {
        switch (declaracaoOuConstruto.constructor) {
            case AcessoIndiceVariavel:
                this.visitarExpressaoAcessoIndiceVariavel(declaracaoOuConstruto as AcessoIndiceVariavel);
                break;
            case AcessoMetodoOuPropriedade:
                this.visitarExpressaoAcessoMetodoOuPropriedade(declaracaoOuConstruto as AcessoMetodoOuPropriedade);
                break;
            case AcessoMetodo:
                this.visitarExpressaoAcessoMetodo(declaracaoOuConstruto as AcessoMetodo);
                break;
            case AcessoPropriedade:
                this.visitarExpressaoAcessoPropriedade(declaracaoOuConstruto as AcessoPropriedade);
                break;
            case Agrupamento:
                this.visitarExpressaoAgrupamento(declaracaoOuConstruto as Agrupamento);
                break;
            case AtribuicaoPorIndice:
                this.visitarExpressaoAtribuicaoPorIndice(declaracaoOuConstruto as AtribuicaoPorIndice);
                break;
            case Atribuir:
                this.visitarExpressaoDeAtribuicao(declaracaoOuConstruto as Atribuir);
                break;
            case Binario:
                this.visitarExpressaoBinaria(declaracaoOuConstruto as Binario);
                break;
            case Bloco:
                this.visitarExpressaoBloco(declaracaoOuConstruto as Bloco);
                break;
            case Chamada:
                this.visitarExpressaoDeChamada(declaracaoOuConstruto as Chamada);
                break;
            case Classe:
                this.visitarDeclaracaoClasse(declaracaoOuConstruto as Classe);
                break;
            case AliasTipo:
                this.visitarDeclaracaoAliasTipo(declaracaoOuConstruto as AliasTipo);
                break;
            case Comentario:
                this.visitarDeclaracaoComentario(declaracaoOuConstruto as Comentario);
                break;
            case Continua:
                this.visitarExpressaoContinua(declaracaoOuConstruto as Continua);
                break;
            case DefinirValor:
                this.visitarExpressaoDefinirValor(declaracaoOuConstruto as DefinirValor);
                break;
            case Dicionario:
                this.visitarExpressaoDicionario(declaracaoOuConstruto as Dicionario);
                break;
            case Dupla:
                this.visitarExpressaoDupla(declaracaoOuConstruto as Dupla);
                break;
            case Trio:
                this.visitarExpressaoTrio(declaracaoOuConstruto as Trio);
                break;
            case Quarteto:
                this.visitarExpressaoQuarteto(declaracaoOuConstruto as Quarteto);
                break;
            case Quinteto:
                this.visitarExpressaoQuinteto(declaracaoOuConstruto as Quinteto);
                break;
            case Sexteto:
                this.visitarExpressaoSexteto(declaracaoOuConstruto as Sexteto);
                break;
            case Septeto:
                this.visitarExpressaoSepteto(declaracaoOuConstruto as Septeto);
                break;
            case Octeto:
                this.visitarExpressaoOcteto(declaracaoOuConstruto as Octeto);
                break;
            case Noneto:
                this.visitarExpressaoNoneto(declaracaoOuConstruto as Noneto);
                break;
            case Deceto:
                this.visitarExpressaoDeceto(declaracaoOuConstruto as Deceto);
                break;
            case TuplaN:
                this.visitarExpressaoTuplaN(declaracaoOuConstruto as TuplaN);
                break;
            case Escolha:
                this.visitarDeclaracaoEscolha(declaracaoOuConstruto as Escolha);
                break;
            case Enquanto:
                this.visitarDeclaracaoEnquanto(declaracaoOuConstruto as Enquanto);
                break;
            case Escreva:
                this.visitarDeclaracaoEscreva(declaracaoOuConstruto as Escreva);
                break;
            case EscrevaMesmaLinha:
                this.visitarDeclaracaoEscrevaMesmaLinha(declaracaoOuConstruto as Escreva);
                break;
            case Expressao:
                this.visitarDeclaracaoDeExpressao(declaracaoOuConstruto as Expressao);
                break;
            case ExpressaoRegular:
                this.visitarExpressaoExpressaoRegular(declaracaoOuConstruto as ExpressaoRegular);
                break;
            case Falhar:
                this.visitarExpressaoFalhar(declaracaoOuConstruto as Falhar);
                break;
            case Fazer:
                this.visitarDeclaracaoFazer(declaracaoOuConstruto as Fazer);
                break;
            case FimPara:
                this.visitarExpressaoFimPara(declaracaoOuConstruto as FimPara);
                break;
            case FuncaoConstruto:
                this.visitarExpressaoFuncaoConstruto(declaracaoOuConstruto as FuncaoConstruto);
                break;
            case FuncaoDeclaracao:
                this.visitarDeclaracaoDefinicaoFuncao(declaracaoOuConstruto as FuncaoDeclaracao);
                break;
            case Importar:
                this.visitarDeclaracaoImportar(declaracaoOuConstruto as Importar);
                break;
            case Isto:
                this.visitarExpressaoIsto(declaracaoOuConstruto as Isto);
                break;
            case Leia:
                this.visitarExpressaoLeia(declaracaoOuConstruto as Leia);
                break;
            case LeiaInteiro:
                this.visitarDeclaracaoLeiaInteiro(declaracaoOuConstruto as LeiaInteiro);
                break;
            case LeiaInteiros:
                this.visitarDeclaracaoLeiaInteiros(declaracaoOuConstruto as LeiaInteiros);
                break;
            case LeiaReal:
                this.visitarDeclaracaoLeiaReal(declaracaoOuConstruto as LeiaReal);
                break;
            case LeiaReais:
                this.visitarDeclaracaoLeiaReais(declaracaoOuConstruto as LeiaReais);
                break;
            case LeiaTexto:
                this.visitarDeclaracaoLeiaTexto(declaracaoOuConstruto as LeiaTexto);
                break;
            case LeiaTextos:
                this.visitarDeclaracaoLeiaTextos(declaracaoOuConstruto as LeiaTextos);
                break;
            case Literal:
                this.visitarExpressaoLiteral(declaracaoOuConstruto as Literal);
                break;
            case Logico:
                this.visitarExpressaoLogica(declaracaoOuConstruto as Logico);
                break;
            case Para:
                this.visitarDeclaracaoPara(declaracaoOuConstruto as Para);
                break;
            case ParaGere:
                this.visitarDeclaracaoParaGere(declaracaoOuConstruto as ParaGere);
                break;
            case ParaEmGere:
                this.visitarDeclaracaoParaEmGere(declaracaoOuConstruto as ParaEmGere);
                break;
            case ParaCada:
                this.visitarDeclaracaoParaCada(declaracaoOuConstruto as ParaCada);
                break;
            case AtribuicaoParalelaVariavel:
                this.visitarDeclaracaoAtribuicaoParalelaVariavel(declaracaoOuConstruto as AtribuicaoParalelaVariavel);
                break;
            case ReatribuicaoVariavel:
                this.visitarDeclaracaoReatribuicaoVariavel(declaracaoOuConstruto as ReatribuicaoVariavel);
                break;
            case Retorna:
                this.visitarExpressaoRetornar(declaracaoOuConstruto as Retorna);
                break;
            case Se:
                this.visitarDeclaracaoSe(declaracaoOuConstruto as Se);
                break;
            case Super:
                this.visitarExpressaoSuper(declaracaoOuConstruto as Super);
                break;
            case Sustar:
                this.visitarExpressaoSustar(declaracaoOuConstruto as Sustar);
                break;
            case Tente:
                this.visitarDeclaracaoTente(declaracaoOuConstruto as Tente);
                break;
            case TipoDe:
                this.visitarExpressaoTipoDe(declaracaoOuConstruto as TipoDe);
                break;
            case Unario:
                this.visitarExpressaoUnaria(declaracaoOuConstruto as Unario);
                break;
            case Const:
                this.visitarDeclaracaoConst(declaracaoOuConstruto as Const);
                break;
            case ConstMultiplo:
                this.visitarDeclaracaoConstMultiplo(declaracaoOuConstruto as ConstMultiplo);
                break;
            case Var:
                this.visitarDeclaracaoVar(declaracaoOuConstruto as Var);
                break;
            case VarMultiplo:
                this.visitarDeclaracaoVarMultiplo(declaracaoOuConstruto as VarMultiplo);
                break;
            case Variavel:
                this.visitarExpressaoDeVariavel(declaracaoOuConstruto as Variavel);
                break;
            case Vetor:
                this.visitarExpressaoVetor(declaracaoOuConstruto as Vetor);
                break;
            case Constante:
                this.visitarDeclaracaoConstante(declaracaoOuConstruto as Constante);
                break;
            case ConstanteOuVariavel:
                this.visitarExpressaoConstanteOuVariavel(declaracaoOuConstruto as ConstanteOuVariavel);
                break;
            case PropriedadeClasse:
                this.visitarExpressaoPropriedadeClasse(declaracaoOuConstruto as PropriedadeClasse);
                break;
            default:
                throw new Error(
                    `Construto ou declaração não implementado no formatador: ${declaracaoOuConstruto.constructor.name}`
                );
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
