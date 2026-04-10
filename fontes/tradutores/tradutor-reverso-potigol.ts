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
    Logico,
    Unario,
    Variavel,
    Vetor,
} from '@designliquido/delegua/construtos';
import {
    Bloco,
    Classe,
    Const,
    ConstMultiplo,
    Declaracao,
    Enquanto,
    Escreva,
    EscrevaMesmaLinha,
    Escolha,
    Expressao,
    FuncaoDeclaracao,
    Para,
    ParaCada,
    PropriedadeClasse,
    Retorna,
    Se,
    Var,
} from '@designliquido/delegua/declaracoes';
import { SimboloInterface, TradutorInterface } from '@designliquido/delegua/interfaces';

import { LeiaInteiro, LeiaInteiros, LeiaReal, LeiaReais, LeiaTexto, LeiaTextos } from '../construtos';
import { AliasTipo, ParaGere, ReatribuicaoVariavel } from '../declaracoes';

import tiposDeSimbolos from '../tipos-de-simbolos/lexico-regular';

/**
 * Tradutor Reverso de Potigol para Delégua.
 * Recebe a árvore sintática gerada pelo `AvaliadorSintaticoPotigol`
 * e produz código-fonte equivalente em Delégua.
 */
export class TradutorReversoPotigol implements TradutorInterface<Declaracao> {
    indentacao: number = 0;

    // #region Operadores

    traduzirSimboloOperador(operador: SimboloInterface): string {
        switch (operador.tipo) {
            case tiposDeSimbolos.ADICAO:
                return '+';
            case tiposDeSimbolos.DIFERENTE:
                return '!=';
            case tiposDeSimbolos.DIVISAO:
                return '/';
            case tiposDeSimbolos.DIVISAO_INTEIRA:
                // Em Potigol `div`; em Delégua `\`
                return '\\';
            case tiposDeSimbolos.E:
                return 'e';
            case tiposDeSimbolos.EXPONENCIACAO:
                return '**';
            case tiposDeSimbolos.IGUAL:
                return '=';
            case tiposDeSimbolos.IGUAL_IGUAL:
                return '==';
            case tiposDeSimbolos.MAIOR:
                return '>';
            case tiposDeSimbolos.MAIOR_IGUAL:
                return '>=';
            case tiposDeSimbolos.MENOR:
                return '<';
            case tiposDeSimbolos.MENOR_IGUAL:
                return '<=';
            case tiposDeSimbolos.MODULO:
                return '%';
            case tiposDeSimbolos.MULTIPLICACAO:
                return '*';
            case tiposDeSimbolos.NEGACAO:
                return '!';
            case tiposDeSimbolos.OU:
                return 'ou';
            case tiposDeSimbolos.SUBTRACAO:
                return '-';
            default:
                return operador.lexema;
        }
    }

    // #endregion

    // #region Construtos

    traduzirConstrutoAgrupamento(agrupamento: Agrupamento): string {
        return (
            '(' +
            this.dicionarioConstrutos[agrupamento.expressao.constructor.name](agrupamento.expressao) +
            ')'
        );
    }

    traduzirConstrutoAtribuir(atribuir: Atribuir): string {
        const alvo = this.dicionarioConstrutos[atribuir.alvo.constructor.name](atribuir.alvo);
        let valor: string;
        if (atribuir.simboloOperador && atribuir.valor.constructor === Binario) {
            valor = this.dicionarioConstrutos[(atribuir.valor as Binario).direita.constructor.name](
                (atribuir.valor as Binario).direita
            );
        } else {
            valor = this.dicionarioConstrutos[atribuir.valor.constructor.name](atribuir.valor);
        }
        const operador = atribuir.simboloOperador?.lexema || ':=';
        return `${alvo} ${operador} ${valor}`;
    }

    traduzirConstrutoBinario(binario: Binario): string {
        const esquerda = this.dicionarioConstrutos[binario.esquerda.constructor.name](binario.esquerda);
        const operador = this.traduzirSimboloOperador(binario.operador);
        const direita = this.dicionarioConstrutos[binario.direita.constructor.name](binario.direita);
        return `${esquerda} ${operador} ${direita}`;
    }

    traduzirConstrutoChamada(chamada: Chamada): string {
        const entidade = this.dicionarioConstrutos[chamada.entidadeChamada.constructor.name](
            chamada.entidadeChamada,
            chamada.argumentos
        );
        return entidade;
    }

    traduzirConstrutoDefinirValor(definirValor: DefinirValor): string {
        const objeto =
            definirValor.objeto instanceof Isto
                ? 'isto'
                : this.dicionarioConstrutos[definirValor.objeto.constructor.name](definirValor.objeto);
        return `${objeto}.${definirValor.nome.lexema} = ${this.dicionarioConstrutos[definirValor.valor.constructor.name](definirValor.valor)}`;
    }

    traduzirConstrutoFimPara(fimPara: FimPara): string {
        return this.dicionarioDeclaracoes[fimPara.incremento.constructor.name](fimPara.incremento);
    }

    traduzirConstrutoLiteral(literal: Literal): string {
        if (typeof literal.valor === 'string') {
            // Potigol usa {variavel} para interpolação; Delégua usa ${variavel}.
            // O lexer do Potigol já armazena o texto incluindo as chaves.
            const valorTraduzido = literal.valor.replace(/\{([^}]+)\}/g, '${$1}');
            if (valorTraduzido !== literal.valor) {
                return `\`${valorTraduzido}\``;
            }
            return `"${literal.valor}"`;
        }
        if (typeof literal.valor === 'boolean') {
            return literal.valor ? 'verdadeiro' : 'falso';
        }
        return String(literal.valor);
    }

    traduzirConstrutoLogico(logico: Logico): string {
        const esquerda = this.dicionarioConstrutos[logico.esquerda.constructor.name](logico.esquerda);
        const operador = this.traduzirSimboloOperador(logico.operador);
        const direita = this.dicionarioConstrutos[logico.direita.constructor.name](logico.direita);
        return `${esquerda} ${operador} ${direita}`;
    }

    traduzirConstrutoUnario(unario: Unario): string {
        const operador = this.traduzirSimboloOperador(unario.operador);
        const operando = this.dicionarioConstrutos[unario.operando.constructor.name](unario.operando);
        return `${operador}${operando}`;
    }

    traduzirConstrutoVariavel(variavel: Variavel, argumentos?: Construto[]): string {
        const args = argumentos || [];
        if (args.length === 0) {
            return variavel.simbolo.lexema;
        }
        const argsResolvidos = args
            .map((a) => this.dicionarioConstrutos[a.constructor.name](a))
            .join(', ');
        return `${variavel.simbolo.lexema}(${argsResolvidos})`;
    }

    traduzirConstrutoConstante(constante: Constante, argumentos?: Construto[]): string {
        const args = argumentos || [];
        if (args.length === 0) {
            return constante.simbolo.lexema;
        }
        const argsResolvidos = args
            .map((a) => this.dicionarioConstrutos[a.constructor.name](a))
            .join(', ');
        return `${constante.simbolo.lexema}(${argsResolvidos})`;
    }

    traduzirConstrutoAcessoMetodoOuPropriedade(
        acesso: AcessoMetodoOuPropriedade,
        argumentos?: Construto[]
    ): string {
        const objeto = this.dicionarioConstrutos[acesso.objeto.constructor.name](acesso.objeto);
        const nomeMetodo = acesso.simbolo.lexema;

        // Tradução de métodos de coleção / texto para equivalentes em Delégua
        const traducaoMetodo = this.traduzirMetodoPotigol(nomeMetodo, objeto, argumentos || []);
        if (traducaoMetodo !== null) {
            return traducaoMetodo;
        }

        if (!argumentos || argumentos.length === 0) {
            return `${objeto}.${nomeMetodo}`;
        }
        const argsResolvidos = argumentos
            .map((a) => this.dicionarioConstrutos[a.constructor.name](a))
            .join(', ');
        return `${objeto}.${nomeMetodo}(${argsResolvidos})`;
    }

    /**
     * Traduz métodos específicos de Potigol para equivalentes em Delégua.
     * Retorna `null` se não houver mapeamento direto.
     */
    protected traduzirMetodoPotigol(
        nomeMetodo: string,
        objeto: string,
        argumentos: Construto[]
    ): string | null {
        const args = argumentos.map((a) => this.dicionarioConstrutos[a.constructor.name](a));
        switch (nomeMetodo) {
            // Métodos comuns a Lista/Texto
            case 'tamanho':
                return `${objeto}.tamanho()`;
            case 'cabeça':
            case 'primeiro':
                return `${objeto}[0]`;
            case 'último':
                return `${objeto}[${objeto}.tamanho() - 1]`;
            case 'cauda':
                return `${objeto}.fatiar(1)`;
            case 'inverta':
                return `${objeto}.inverter()`;
            case 'ordene':
                return `${objeto}.ordenar()`;
            case 'pegue':
                return args.length > 0 ? `${objeto}.fatiar(0, ${args[0]})` : `${objeto}`;
            case 'descarte':
                return args.length > 0 ? `${objeto}.fatiar(${args[0]})` : `${objeto}`;
            case 'junte':
                return args.length > 0
                    ? `${args[0]}.juntar(${objeto})`
                    : `${objeto}.juntar("")`;
            case 'mapeie':
                return args.length > 0 ? `${objeto}.mapear(${args[0]})` : `${objeto}.mapear()`;
            case 'selecione':
            case 'filtre':
                return args.length > 0 ? `${objeto}.filtrar(${args[0]})` : `${objeto}`;
            case 'injete':
            case 'reduza':
                return args.length > 0 ? `${objeto}.reduzir(${args.join(', ')})` : `${objeto}`;
            case 'contém':
                return args.length > 0 ? `${objeto}.inclui(${args[0]})` : `${objeto}`;
            case 'maiúsculo':
                return `${objeto}.maiusculo()`;
            case 'minúsculo':
                return `${objeto}.minusculo()`;
            case 'divida':
                return args.length > 0 ? `${objeto}.dividir(${args[0]})` : `${objeto}.dividir(" ")`;
            case 'insira':
                // Não há equivalente direto; mantém como chamada
                return null;
            case 'remova':
                return args.length > 0 ? `${objeto}.remover(${args[0]})` : null;
            case 'posição':
                return args.length > 0 ? `${objeto}.posicao(${args[0]})` : null;
            case 'vazia':
                return `${objeto}.tamanho() == 0`;
            default:
                return null;
        }
    }

    traduzirConstrutoAcessoIndiceVariavel(acesso: AcessoIndiceVariavel): string {
        const entidade = this.dicionarioConstrutos[acesso.entidadeChamada.constructor.name](
            acesso.entidadeChamada
        );
        const indice = this.dicionarioConstrutos[acesso.indice.constructor.name](acesso.indice);
        return `${entidade}[${indice}]`;
    }

    traduzirFuncaoConstruto(funcao: FuncaoConstruto): string {
        const params = funcao.parametros.map((p) => p.nome.lexema).join(', ');
        const corpo = this.logicaComumBlocoEscopo(funcao.corpo);
        return `função(${params}) ${corpo}`;
    }

    traduzirConstrutoLeia(leia: Leia): string {
        if (leia instanceof LeiaInteiro) return 'leia()';
        if (leia instanceof LeiaReal) return 'leia()';
        if (leia instanceof LeiaTexto) return 'leia()';
        if (leia instanceof LeiaInteiros) {
            const args = leia.argumentos?.length
                ? leia.argumentos.map((a) => this.dicionarioConstrutos[a.constructor.name](a)).join(', ')
                : '';
            return args ? `leia(${args})` : 'leia()';
        }
        if (leia instanceof LeiaReais) {
            const args = leia.argumentos?.length
                ? leia.argumentos.map((a) => this.dicionarioConstrutos[a.constructor.name](a)).join(', ')
                : '';
            return args ? `leia(${args})` : 'leia()';
        }
        if (leia instanceof LeiaTextos) {
            const args = leia.argumentos?.length
                ? leia.argumentos.map((a) => this.dicionarioConstrutos[a.constructor.name](a)).join(', ')
                : '';
            return args ? `leia(${args})` : 'leia()';
        }
        return 'leia()';
    }

    traduzirConstrutoVetor(vetor: Vetor): string {
        if (!vetor.valores.length) return '[]';
        const valores = vetor.valores
            .map((v) => this.dicionarioConstrutos[v.constructor.name](v))
            .join(', ');
        return `[${valores}]`;
    }

    // #endregion

    // #region Declarações

    protected logicaComumBlocoEscopo(declaracoes: Declaracao[]): string {
        let resultado = '{\n';
        this.indentacao += 4;

        if (typeof declaracoes[Symbol.iterator] === 'function') {
            for (const dec of declaracoes) {
                resultado += ' '.repeat(this.indentacao);
                const nome = dec.constructor.name;
                if (this.dicionarioConstrutos.hasOwnProperty(nome)) {
                    resultado += this.dicionarioConstrutos[nome](dec);
                } else {
                    resultado += this.dicionarioDeclaracoes[nome](dec);
                }
                resultado += '\n';
            }
        }

        this.indentacao -= 4;
        resultado += ' '.repeat(this.indentacao) + '}';
        return resultado;
    }

    traduzirDeclaracaoBloco(bloco: Bloco): string {
        return this.logicaComumBlocoEscopo(bloco.declaracoes);
    }

    traduzirDeclaracaoConst(declaracaoConst: Const): string {
        const nome = declaracaoConst.simbolo.lexema;
        if (!declaracaoConst.inicializador) return `var ${nome}`;
        const valor = this.dicionarioConstrutos[declaracaoConst.inicializador.constructor.name](
            declaracaoConst.inicializador
        );
        return `var ${nome} = ${valor}`;
    }

    traduzirDeclaracaoConstMultiplo(constMultiplo: ConstMultiplo): string {
        const nomes = constMultiplo.simbolos.map((s) => s.lexema).join(', ');
        const inicializador = this.dicionarioConstrutos[constMultiplo.inicializador.constructor.name](
            constMultiplo.inicializador
        );
        return `var ${nomes} = ${inicializador}`;
    }

    traduzirDeclaracaoVar(declaracaoVar: Var): string {
        const nome = declaracaoVar.simbolo.lexema;
        if (!declaracaoVar.inicializador) return `var ${nome}`;
        const valor = this.dicionarioConstrutos[declaracaoVar.inicializador.constructor.name](
            declaracaoVar.inicializador
        );
        return `var ${nome} = ${valor}`;
    }

    traduzirDeclaracaoReatribuicaoVariavel(reatribuicao: ReatribuicaoVariavel): string {
        const nome = reatribuicao.simbolo.lexema;
        const valor = this.dicionarioConstrutos[reatribuicao.inicializador.constructor.name](
            reatribuicao.inicializador
        );
        return `${nome} = ${valor}`;
    }

    traduzirDeclaracaoEscreva(escreva: Escreva): string {
        const args = escreva.argumentos
            .map((a) => this.dicionarioConstrutos[a.constructor.name](a))
            .join(', ');
        return `escreva(${args})`;
    }

    traduzirDeclaracaoEscrevaMesmaLinha(escreva: EscrevaMesmaLinha): string {
        const args = escreva.argumentos
            .map((a) => this.dicionarioConstrutos[a.constructor.name](a))
            .join(', ');
        // `imprima` em Potigol não adiciona nova linha — mapeia para `escreva` com concatenação manual se necessário
        return `escreva(${args})`;
    }

    traduzirDeclaracaoExpressao(expressao: Expressao): string {
        return this.dicionarioConstrutos[expressao.expressao.constructor.name](expressao.expressao);
    }

    traduzirDeclaracaoFuncao(declaracaoFuncao: FuncaoDeclaracao): string {
        const nome = declaracaoFuncao.simbolo.lexema;
        const params = declaracaoFuncao.funcao.parametros.map((p) => p.nome.lexema).join(', ');
        const corpo = this.logicaComumBlocoEscopo(declaracaoFuncao.funcao.corpo);
        return `função ${nome}(${params}) ${corpo}`;
    }

    traduzirDeclaracaoSe(declaracaoSe: Se): string {
        const condicao = this.dicionarioConstrutos[declaracaoSe.condicao.constructor.name](
            declaracaoSe.condicao
        );
        let resultado = `se (${condicao}) `;
        resultado += this.dicionarioDeclaracoes[declaracaoSe.caminhoEntao.constructor.name](
            declaracaoSe.caminhoEntao
        );

        if (declaracaoSe.caminhoSenao) {
            resultado += ' '.repeat(this.indentacao) + ' senão ';
            resultado += this.dicionarioDeclaracoes[declaracaoSe.caminhoSenao.constructor.name](
                declaracaoSe.caminhoSenao
            );
        }
        return resultado;
    }

    traduzirDeclaracaoEnquanto(declaracaoEnquanto: Enquanto): string {
        const condicao = this.dicionarioConstrutos[declaracaoEnquanto.condicao.constructor.name](
            declaracaoEnquanto.condicao
        );
        const corpo = this.dicionarioDeclaracoes[declaracaoEnquanto.corpo.constructor.name](
            declaracaoEnquanto.corpo
        );
        return `enquanto (${condicao}) ${corpo}`;
    }

    traduzirDeclaracaoPara(para: Para): string {
        let resultado = 'para ';

        // inicializador pode ser Array ou Declaracao
        if (Array.isArray(para.inicializador)) {
            resultado +=
                this.dicionarioDeclaracoes[para.inicializador[0].constructor.name](
                    para.inicializador[0],
                    false
                ) + '; ';
        } else {
            resultado +=
                this.dicionarioDeclaracoes[para.inicializador.constructor.name](
                    para.inicializador,
                    false
                ) + '; ';
        }

        resultado +=
            this.dicionarioConstrutos[para.condicao.constructor.name](para.condicao) + '; ';
        resultado +=
            this.dicionarioConstrutos[para.incrementar.constructor.name](para.incrementar) + ' ';
        resultado += this.dicionarioDeclaracoes[para.corpo.constructor.name](para.corpo);
        return resultado;
    }

    traduzirDeclaracaoParaGere(paraGere: ParaGere): string {
        // `para...gere` não tem equivalente direto em Delégua.
        // Traduz como um `para` numérico simples com retorna dentro do corpo.
        const nome = paraGere.simboloIteracao.lexema;
        const inicio = this.dicionarioConstrutos[paraGere.inicio.constructor.name](paraGere.inicio);
        const fim = this.dicionarioConstrutos[paraGere.fim.constructor.name](paraGere.fim);
        const passo = paraGere.passo
            ? this.dicionarioConstrutos[paraGere.passo.constructor.name](paraGere.passo)
            : '1';

        const corpoParts = paraGere.corpo
            .map((dec: Declaracao) => {
                const nome = dec.constructor.name;
                if (this.dicionarioConstrutos.hasOwnProperty(nome)) {
                    return ' '.repeat(this.indentacao + 4) + this.dicionarioConstrutos[nome](dec);
                }
                return ' '.repeat(this.indentacao + 4) + this.dicionarioDeclaracoes[nome](dec);
            })
            .join('\n');

        return (
            `para (var ${nome} = ${inicio}; ${nome} <= ${fim}; ${nome} = ${nome} + ${passo}) {\n` +
            corpoParts +
            '\n' +
            ' '.repeat(this.indentacao) +
            '}'
        );
    }

    traduzirDeclaracaoParaCada(paraCada: ParaCada): string {
        const variavel = this.dicionarioConstrutos[paraCada.variavelIteracao.constructor.name](
            paraCada.variavelIteracao
        );
        const colecao = this.dicionarioConstrutos[paraCada.vetorOuDicionario.constructor.name](
            paraCada.vetorOuDicionario
        );
        const corpo = this.dicionarioDeclaracoes[paraCada.corpo.constructor.name](paraCada.corpo);
        return `para cada ${variavel} em ${colecao} ${corpo}`;
    }

    traduzirDeclaracaoEscolha(escolha: Escolha): string {
        const condicao = this.dicionarioConstrutos[escolha.identificadorOuLiteral.constructor.name](
            escolha.identificadorOuLiteral
        );
        let resultado = `escolha (${condicao}) {\n`;
        this.indentacao += 4;

        for (const caminho of escolha.caminhos) {
            for (const cond of caminho.condicoes) {
                const condStr = this.dicionarioConstrutos[cond.constructor.name](cond);
                resultado += ' '.repeat(this.indentacao) + `caso ${condStr}:\n`;
            }
            this.indentacao += 4;
            for (const dec of caminho.declaracoes) {
                const nome = dec.constructor.name;
                const linha =
                    this.dicionarioDeclaracoes.hasOwnProperty(nome)
                        ? this.dicionarioDeclaracoes[nome](dec)
                        : this.dicionarioConstrutos[nome](dec);
                resultado += ' '.repeat(this.indentacao) + linha + '\n';
            }
            this.indentacao -= 4;
        }

        if (escolha.caminhoPadrao) {
            resultado += ' '.repeat(this.indentacao) + 'padrao:\n';
            this.indentacao += 4;
            for (const dec of escolha.caminhoPadrao.declaracoes) {
                const nome = dec.constructor.name;
                const linha =
                    this.dicionarioDeclaracoes.hasOwnProperty(nome)
                        ? this.dicionarioDeclaracoes[nome](dec)
                        : this.dicionarioConstrutos[nome](dec);
                resultado += ' '.repeat(this.indentacao) + linha + '\n';
            }
            this.indentacao -= 4;
        }

        this.indentacao -= 4;
        resultado += ' '.repeat(this.indentacao) + '}';
        return resultado;
    }

    traduzirDeclaracaoRetorna(retorna: Retorna): string {
        if (!retorna.valor) return 'retorna';
        const valor = this.dicionarioConstrutos[retorna.valor.constructor.name](retorna.valor);
        return `retorna ${valor}`;
    }

    traduzirDeclaracaoClasse(classe: Classe): string {
        let resultado = `classe ${classe.simbolo.lexema}`;
        if (classe.superClasse) {
            resultado += ` herda ${(classe.superClasse as any).simbolo.lexema}`;
        }
        resultado += ' {\n';
        this.indentacao += 4;

        for (const prop of classe.propriedades as PropriedadeClasse[]) {
            resultado += ' '.repeat(this.indentacao) + `var ${prop.nome.lexema}\n`;
        }
        for (const metodo of classe.metodos) {
            resultado += ' '.repeat(this.indentacao) + this.traduzirDeclaracaoFuncao(metodo) + '\n';
        }

        this.indentacao -= 4;
        resultado += ' '.repeat(this.indentacao) + '}';
        return resultado;
    }

    traduzirDeclaracaoAliasTipo(alias: AliasTipo): string {
        // Potigol: `tipo NovaNome = TipoOriginal`
        // Delégua não tem alias de tipo, então ignoramos ou emitimos um comentário.
        return `// tipo ${alias.simbolo.lexema} = ${alias.tipoOriginal}`;
    }

    // #endregion

    dicionarioConstrutos: { [nome: string]: Function } = {
        AcessoIndiceVariavel: this.traduzirConstrutoAcessoIndiceVariavel.bind(this),
        AcessoMetodoOuPropriedade: this.traduzirConstrutoAcessoMetodoOuPropriedade.bind(this),
        Agrupamento: this.traduzirConstrutoAgrupamento.bind(this),
        Atribuir: this.traduzirConstrutoAtribuir.bind(this),
        Binario: this.traduzirConstrutoBinario.bind(this),
        Chamada: this.traduzirConstrutoChamada.bind(this),
        Constante: this.traduzirConstrutoConstante.bind(this),
        DefinirValor: this.traduzirConstrutoDefinirValor.bind(this),
        FimPara: this.traduzirConstrutoFimPara.bind(this),
        FuncaoConstruto: this.traduzirFuncaoConstruto.bind(this),
        Isto: () => 'isto',
        LeiaInteiro: this.traduzirConstrutoLeia.bind(this),
        LeiaInteiros: this.traduzirConstrutoLeia.bind(this),
        LeiaReal: this.traduzirConstrutoLeia.bind(this),
        LeiaReais: this.traduzirConstrutoLeia.bind(this),
        LeiaTexto: this.traduzirConstrutoLeia.bind(this),
        LeiaTextos: this.traduzirConstrutoLeia.bind(this),
        Leia: this.traduzirConstrutoLeia.bind(this),
        Literal: this.traduzirConstrutoLiteral.bind(this),
        Logico: this.traduzirConstrutoLogico.bind(this),
        Unario: this.traduzirConstrutoUnario.bind(this),
        Variavel: this.traduzirConstrutoVariavel.bind(this),
        Vetor: this.traduzirConstrutoVetor.bind(this),
    };

    dicionarioDeclaracoes: { [nome: string]: Function } = {
        AliasTipo: this.traduzirDeclaracaoAliasTipo.bind(this),
        Bloco: this.traduzirDeclaracaoBloco.bind(this),
        Classe: this.traduzirDeclaracaoClasse.bind(this),
        Const: this.traduzirDeclaracaoConst.bind(this),
        ConstMultiplo: this.traduzirDeclaracaoConstMultiplo.bind(this),
        Continua: () => 'continua',
        Enquanto: this.traduzirDeclaracaoEnquanto.bind(this),
        Escolha: this.traduzirDeclaracaoEscolha.bind(this),
        Escreva: this.traduzirDeclaracaoEscreva.bind(this),
        EscrevaMesmaLinha: this.traduzirDeclaracaoEscrevaMesmaLinha.bind(this),
        Expressao: this.traduzirDeclaracaoExpressao.bind(this),
        FuncaoDeclaracao: this.traduzirDeclaracaoFuncao.bind(this),
        Para: this.traduzirDeclaracaoPara.bind(this),
        ParaCada: this.traduzirDeclaracaoParaCada.bind(this),
        ParaGere: this.traduzirDeclaracaoParaGere.bind(this),
        ReatribuicaoVariavel: this.traduzirDeclaracaoReatribuicaoVariavel.bind(this),
        Retorna: this.traduzirDeclaracaoRetorna.bind(this),
        Se: this.traduzirDeclaracaoSe.bind(this),
        Sustar: () => 'sustar',
        Var: this.traduzirDeclaracaoVar.bind(this),
    };

    traduzir(declaracoes: Declaracao[]): string {
        let resultado = '';
        for (const declaracao of declaracoes) {
            const nome = declaracao.constructor.name;
            if (this.dicionarioDeclaracoes.hasOwnProperty(nome)) {
                resultado += this.dicionarioDeclaracoes[nome](declaracao) + '\n';
            } else if (this.dicionarioConstrutos.hasOwnProperty(nome)) {
                resultado += this.dicionarioConstrutos[nome](declaracao) + '\n';
            }
        }
        return resultado;
    }
}
