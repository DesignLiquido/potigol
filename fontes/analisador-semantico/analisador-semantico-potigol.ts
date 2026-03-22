import { AnalisadorSemanticoBase, GerenciadorEscopos, PilhaVariaveis } from '@designliquido/delegua/analisador-semantico';
import {
    Const,
    Declaracao,
    Enquanto,
    Escolha,
    Escreva,
    Expressao,
    Falhar,
    FuncaoDeclaracao,
    Var
} from '@designliquido/delegua/declaracoes';
import {
    Agrupamento,
    Atribuir,
    Binario,
    Chamada,
    Construto,
    FuncaoConstruto,
    Literal,
    Logico,
    Separador,
    Vetor,
    Variavel,
    Constante,
    TipoDe
} from '@designliquido/delegua';
import {
    DiagnosticoAnalisadorSemantico,
    DiagnosticoSeveridade,
    ParametroInterface,
    SimboloInterface,
} from '@designliquido/delegua/interfaces';
import { FuncaoHipoteticaInterface } from '@designliquido/delegua/interfaces/funcao-hipotetica-interface';
import { RetornoAnalisadorSemantico } from '@designliquido/delegua/interfaces/retornos/retorno-analisador-semantico';

import { AliasTipo, ReatribuicaoVariavel } from '../declaracoes';
import { VisitanteComumPotigolInterface } from '../interfaces';
import { LeiaInteiro, LeiaInteiros, LeiaReais, LeiaReal, LeiaTexto, LeiaTextos } from '../construtos';

/**
 * Analisador Semântico do Potigol.
 * Realiza verificações semânticas no código, como tipos, variáveis não declaradas,
 * divisão por zero, e outras validações em tempo de compilação.
 */
export class AnalisadorSemanticoPotigol extends AnalisadorSemanticoBase implements VisitanteComumPotigolInterface {
    pilhaVariaveis: PilhaVariaveis;
    funcoes: { [nomeFuncao: string]: FuncaoHipoteticaInterface };
    atual: number;
    diagnosticos: DiagnosticoAnalisadorSemantico[];

    constructor() {
        super();
        this.pilhaVariaveis = new PilhaVariaveis();
        this.funcoes = {};
        this.atual = 0;
        this.diagnosticos = [];
    }

    /**
     * Verifica o tipo atribuído a uma variável na declaração
     */
    verificarTipoAtribuido(declaracao: Var | Const): void {
        if (declaracao.tipo) {
            if (['vetor', 'qualquer[]', 'inteiro[]', 'texto[]'].includes(declaracao.tipo)) {
                if (declaracao.inicializador instanceof Vetor) {
                    const vetor = declaracao.inicializador as Vetor;
                    const vetorSemSeparadores = vetor.valores.filter(
                        (v) => v.constructor !== Separador
                    );

                    if (declaracao.tipo === 'inteiro[]') {
                        const apenasValores = vetorSemSeparadores.find(
                            (v) => typeof v?.valor !== 'number'
                        );
                        if (apenasValores) {
                            this.erro(
                                declaracao.simbolo,
                                `Atribuição inválida para '${declaracao.simbolo.lexema}': é esperado um valor do tipo vetor de inteiro ou real. Atual: ${vetor.tipo}.`
                            );
                        }
                    }
                    if (declaracao.tipo === 'texto[]') {
                        const apenasValores = vetorSemSeparadores.find(
                            (v) => typeof v?.valor !== 'string'
                        );
                        if (apenasValores) {
                            this.erro(
                                declaracao.simbolo,
                                `Atribuição inválida para '${declaracao.simbolo.lexema}': é esperado um valor do tipo vetor de texto. Atual: ${vetor.tipo}.`
                            );
                        }
                    }
                } else {
                    this.erro(
                        declaracao.simbolo,
                        `Atribuição inválida para '${declaracao.simbolo.lexema}': é esperado um vetor de elementos.`
                    );
                }
            }
            if (declaracao.inicializador instanceof Literal) {
                const literal = declaracao.inicializador as Literal;
                if (declaracao.tipo === 'texto' && literal.tipo !== 'texto') {
                    this.erro(
                        declaracao.simbolo,
                        `Atribuição inválida para '${declaracao.simbolo.lexema}': é esperado um valor do tipo texto. Atual: ${literal.tipo}.`
                    );
                }
                if (
                    ['inteiro', 'número', 'real'].includes(declaracao.tipo) &&
                    !['inteiro', 'número', 'real'].includes(literal.tipo)
                ) {
                    this.erro(
                        declaracao.simbolo,
                        `Atribuição inválida para '${declaracao.simbolo.lexema}': é esperado um valor do tipo número. Atual: ${literal.tipo}.`
                    );
                }
            }
        }
    }

    override visitarExpressaoTipoDe(expressao: TipoDe): Promise<any> {
        return this.verificarTipoDe(expressao.valor);
    }

    /**
     * Verifica recursivamente o tipo de uma expressão
     */
    private verificarTipoDe(valor: Construto): Promise<any> {
        switch (valor.constructor) {
            case Agrupamento:
                const valorAgrupamento = valor as Agrupamento;
                return this.verificarTipoDe(valorAgrupamento.expressao);
            case Binario:
                const valorBinario = valor as Binario;
                this.verificarTipoDe(valorBinario.direita);
                this.verificarTipoDe(valorBinario.esquerda);
                break;
            case Variavel:
                const valorVariavel = valor as Variavel;
                return this.verificarVariavel(valorVariavel);
        }

        return Promise.resolve();
    }

    override visitarExpressaoFalhar(expressao: Falhar): Promise<any> {
        return this.verificarFalhar(expressao.explicacao);
    }

    /**
     * Verifica recursivamente a expressão de falha
     */
    private verificarFalhar(valor: Construto): Promise<any> {
        if (valor instanceof Binario) {
            this.verificarFalhar(valor.direita);
            this.verificarFalhar(valor.esquerda);
        }
        if (valor instanceof Agrupamento) {
            return this.verificarFalhar(valor.expressao);
        }
        if (valor instanceof Variavel) {
            return this.verificarVariavel(valor);
        }
        return Promise.resolve();
    }

    /**
     * Compara argumentos passados contra os parâmetros esperados de uma função
     */
    protected comparacaoArgumentosContraParametrosFuncao(
        simboloFuncao: SimboloInterface,
        parametros: ParametroInterface[],
        argumentos: Construto[]
    ): void {
        if (parametros.length !== argumentos.length) {
            this.erro(
                simboloFuncao,
                `Função '${simboloFuncao.lexema}' espera ${parametros.length} parâmetros. Atual: ${argumentos.length}.`
            );
        }

        for (let [indice, parametro] of parametros.entries()) {
            const argumento = argumentos[indice] as any;
            if (argumento) {
                if (parametro.tipoDado === 'texto' && argumento.tipo !== 'texto') {
                    this.erro(
                        simboloFuncao,
                        `O valor passado para o parâmetro '${parametro.nome.lexema}' (${parametro.tipoDado}) é diferente do esperado pela função (${argumento.tipo}).`
                    );
                } else if (['inteiro', 'número', 'real'].includes(parametro.tipoDado)) {
                    // Conversões implícitas entre tipos numéricos são permitidas
                    if (!['inteiro', 'número', 'real'].includes(argumento.tipo)) {
                        this.erro(
                            simboloFuncao,
                            `O valor passado para o parâmetro '${parametro.nome.lexema}' (${parametro.tipoDado}) é diferente do esperado pela função (${argumento.tipo}).`
                        );
                    }
                }
            }
        }
    }

    override visitarExpressaoDeChamada(expressao: Chamada): Promise<any> {
        // Marca argumentos como usados
        for (const argumento of expressao.argumentos) {
            if (argumento instanceof Variavel) {
                this.gerenciadorEscopos.marcarComoUsada(argumento.simbolo.lexema);
            }
        }

        switch (expressao.entidadeChamada.constructor) {
            case Variavel:
                const entidadeChamadaVariavel = expressao.entidadeChamada as Variavel;
                const funcaoChamada =
                    this.gerenciadorEscopos.buscar(entidadeChamadaVariavel.simbolo.lexema) ||
                    this.funcoes[entidadeChamadaVariavel.simbolo.lexema];

                if (!funcaoChamada) {
                    this.erro(
                        entidadeChamadaVariavel.simbolo,
                        `Chamada da função '${entidadeChamadaVariavel.simbolo.lexema}' não existe.`
                    );
                    return Promise.resolve();
                }

                const funcao = funcaoChamada.valor as FuncaoConstruto;
                this.comparacaoArgumentosContraParametrosFuncao(
                    entidadeChamadaVariavel.simbolo,
                    funcao.parametros,
                    expressao.argumentos
                );
                break;
        }

        return Promise.resolve();
    }

    override visitarExpressaoDeAtribuicao(expressao: Atribuir): Promise<any> {
        let simboloAlvo: SimboloInterface;

        switch (expressao.alvo.constructor) {
            case Variavel:
                const alvoVariavel = expressao.alvo as Variavel;
                simboloAlvo = alvoVariavel.simbolo;
                break;
            default:
                return Promise.resolve();
        }

        const variavel = this.gerenciadorEscopos.buscar(simboloAlvo.lexema);

        if (!variavel) {
            this.erro(
                simboloAlvo,
                `Variável '${simboloAlvo.lexema}' ainda não foi declarada até este ponto.`
            );
            return Promise.resolve();
        }

        if (variavel.imutavel) {
            this.erro(
                simboloAlvo,
                `Constante '${simboloAlvo.lexema}' não pode ser modificada.`
            );
            return Promise.resolve();
        }

        // Marca como inicializada após atribuição
        this.gerenciadorEscopos.marcarComoInicializada(simboloAlvo.lexema, expressao.valor);

        // Verificação de tipos
        if (variavel.tipo) {
            if (expressao.valor instanceof Literal && variavel.tipo.includes('[]')) {
                this.erro(
                    simboloAlvo,
                    `Atribuição inválida, esperado tipo '${variavel.tipo}' na atribuição.`
                );
                return Promise.resolve();
            }
            if (expressao.valor instanceof Vetor && !variavel.tipo.includes('[]')) {
                this.erro(
                    simboloAlvo,
                    `Atribuição inválida, esperado tipo '${variavel.tipo}' na atribuição.`
                );
                return Promise.resolve();
            }

            if (expressao.valor instanceof Literal) {
                let valorLiteral = typeof (expressao.valor as Literal).valor;
                if (!['qualquer'].includes(variavel.tipo)) {
                    if (valorLiteral === 'string') {
                        if (variavel.tipo !== 'texto') {
                            this.erro(simboloAlvo, `Esperado tipo '${variavel.tipo}' na atribuição.`);
                            return Promise.resolve();
                        }
                    }
                    if (valorLiteral === 'number') {
                        if (!['inteiro', 'número', 'real'].includes(variavel.tipo)) {
                            this.erro(simboloAlvo, `Esperado tipo '${variavel.tipo}' na atribuição.`);
                            return Promise.resolve();
                        }
                    }
                }
            }
            if (expressao.valor instanceof Vetor) {
                let valoresSemSeparador = (expressao.valor as Vetor).valores.filter(
                    (v) => v.constructor !== Separador
                );
                if (!['qualquer[]'].includes(variavel.tipo)) {
                    if (variavel.tipo === 'texto[]') {
                        if (!valoresSemSeparador.every((v) => typeof v.valor === 'string')) {
                            this.erro(simboloAlvo, `Esperado tipo '${variavel.tipo}' na atribuição.`);
                            return Promise.resolve();
                        }
                    }
                    if (['inteiro[]', 'numero[]'].includes(variavel.tipo)) {
                        if (!valoresSemSeparador.every((v) => typeof v.valor === 'number')) {
                            this.erro(simboloAlvo, `Esperado tipo '${variavel.tipo}' na atribuição.`);
                            return Promise.resolve();
                        }
                    }
                }
            }
        }

        return Promise.resolve();
    }

    override async visitarDeclaracaoDeExpressao(declaracao: Expressao): Promise<any> {
        return await declaracao.expressao.aceitar(this);
    }

    override visitarDeclaracaoEscolha(declaracao: Escolha): Promise<any> {
        const identificadorOuLiteral = declaracao.identificadorOuLiteral as Construto;
        const tipo = identificadorOuLiteral.tipo;

        for (let caminho of declaracao.caminhos) {
            for (let condicao of caminho.condicoes) {
                switch (condicao.constructor) {
                    case Literal:
                        const condicaoLiteral = condicao as Literal;

                        if (condicaoLiteral.tipo !== tipo) {
                            this.erro(
                                {
                                    lexema: condicaoLiteral.valor,
                                    tipo: condicaoLiteral.tipo,
                                    linha: condicaoLiteral.linha,
                                    hashArquivo: condicaoLiteral.hashArquivo,
                                } as SimboloInterface,
                                `'caso ${condicaoLiteral.valor}:' não é do mesmo tipo esperado em 'escolha' (esperado: ${tipo}, atual: ${condicaoLiteral.tipo}).`
                            );
                        }
                        break;
                    case Variavel:
                        const condicaoVariavel = condicao as Variavel;
                        this.verificarVariavel(condicaoVariavel);
                        const variavelHipotetica = this.gerenciadorEscopos.buscar(condicaoVariavel.simbolo.lexema);
                        if (variavelHipotetica && typeof variavelHipotetica.valor !== tipo) {
                            this.erro(
                                condicaoVariavel.simbolo,
                                `'caso ${condicaoVariavel.simbolo.lexema}:' não é do mesmo tipo esperado em 'escolha'`
                            );
                        }
                        break;
                }
            }
        }

        return Promise.resolve();
    }

    override visitarDeclaracaoEnquanto(declaracao: Enquanto): Promise<any> {
        return this.verificarCondicao(declaracao.condicao);
    }

    /**
     * Verifica recursivamente uma condição
     */
    private verificarCondicao(condicao: Construto): Promise<void> {
        if (condicao instanceof Agrupamento) {
            return this.verificarCondicao(condicao.expressao);
        }

        if (condicao instanceof Variavel) {
            return this.verificarVariavelBinaria(condicao);
        }

        if (condicao instanceof Binario) {
            return this.verificarBinario(condicao);
        }

        if (condicao instanceof Logico) {
            return this.verificarLogico(condicao);
        }

        if (condicao instanceof Chamada) {
            return this.verificarChamada(condicao);
        }

        return Promise.resolve();
    }

    /**
     * Verifica se uma variável é do tipo lógico/booleano
     */
    private verificarVariavelBinaria(variavel: Variavel): Promise<void> {
        this.verificarVariavel(variavel);
        const variavelHipotetica = this.gerenciadorEscopos.buscar(variavel.simbolo.lexema);
        if (
            variavelHipotetica &&
            !(variavelHipotetica.valor instanceof Binario) &&
            typeof variavelHipotetica.valor !== 'boolean'
        ) {
            this.erro(variavel.simbolo, `Esperado tipo 'lógico' na condição do 'enquanto'.`);
        }
        return Promise.resolve();
    }

    /**
     * Verifica se uma variável existe e foi inicializada
     */
    private verificarVariavel(variavel: Variavel): Promise<void> {
        const variavelEscopo = this.gerenciadorEscopos.buscar(variavel.simbolo.lexema);

        if (!variavelEscopo) {
            this.erro(
                variavel.simbolo,
                `Variável '${variavel.simbolo.lexema}' ainda não foi declarada até este ponto.`
            );
            return Promise.resolve();
        }

        // Marca como usada
        this.gerenciadorEscopos.marcarComoUsada(variavel.simbolo.lexema);

        // Verifica se foi inicializada
        if (!variavelEscopo.inicializada) {
            this.aviso(
                variavel.simbolo,
                `Variável '${variavel.simbolo.lexema}' pode não ter sido inicializada antes do uso.`
            );
        }

        return Promise.resolve();
    }

    /**
     * Verifica uma expressão binária recursivamente
     */
    private verificarBinario(binario: Binario): Promise<void> {
        this.verificarExistenciaConstruto(binario.direita);
        this.verificarExistenciaConstruto(binario.esquerda);
        this.verificarOperadorBinario(binario);
        return Promise.resolve();
    }

    /**
     * Verifica operadores binários e seus operandos
     */
    private verificarOperadorBinario(binario: Binario): void {
        if (binario.esquerda instanceof Binario) {
            this.verificarOperadorBinario(binario.esquerda);
        }

        if (binario.direita instanceof Binario) {
            this.verificarOperadorBinario(binario.direita);
        }

        const operadoresMatematicos = ['ADICAO', 'SUBTRACAO', 'MULTIPLICACAO', 'DIVISAO', 'MODULO'];

        if (operadoresMatematicos.includes(binario.operador.tipo)) {
            this.verificarTiposOperandos(binario);
        }

        if (binario.operador.tipo === 'DIVISAO') {
            this.verificarDivisaoPorZero(binario);
        }
    }

    /**
     * Verifica se os tipos dos operandos são compatíveis
     */
    private verificarTiposOperandos(binario: Binario): void {
        const tipoEsquerda = this.obterTipoExpressao(binario.esquerda);
        const tipoDireita = this.obterTipoExpressao(binario.direita);

        if (tipoEsquerda && tipoDireita && tipoEsquerda !== tipoDireita) {
            // Verificar se são tipos numéricos compatíveis
            const tiposNumericos = ['inteiro', 'número', 'real'];
            const ambosNumericos = tiposNumericos.includes(tipoEsquerda) &&
                                tiposNumericos.includes(tipoDireita);

            if (!ambosNumericos) {
                this.aviso(
                    binario.operador,
                    `Operação entre tipos diferentes: tipo esquerdo '${tipoEsquerda}' e tipo direito '${tipoDireita}'. O resultado será resolvido implicitamente.`
                );
            }
        }
    }

    /**
     * Verifica divisão por zero em tempo de compilação
     */
    private verificarDivisaoPorZero(binario: Binario): void {
        const valorDireita = this.avaliarExpressaoConstante(binario.direita);

        if (valorDireita === 0) {
            this.erro(binario.operador, `Divisão por zero.`);
        }
    }

    /**
     * Tenta avaliar uma expressão em tempo de compilação para detectar valores constantes
     * Retorna o valor se puder ser determinado, ou null caso contrário
     */
    private avaliarExpressaoConstante(expressao: Construto): any {
        if (expressao instanceof Literal) {
            return expressao.valor;
        }

        if (expressao instanceof Variavel) {
            const variavel = this.gerenciadorEscopos.buscar(expressao.simbolo.lexema);

            if (!variavel) {
                return null;
            }

            if (variavel.imutavel && variavel.inicializada) {
                return variavel.valor;
            }

            if (variavel.inicializada && variavel.valor !== undefined) {
                return variavel.valor;
            }

            return null;
        }

        if (expressao instanceof Binario) {
            const esquerda = this.avaliarExpressaoConstante(expressao.esquerda);
            const direita = this.avaliarExpressaoConstante(expressao.direita);

            if (esquerda !== null && direita !== null) {
                return this.calcularOperacaoBinaria(expressao.operador.tipo, esquerda, direita);
            }
        }

        if (expressao instanceof Agrupamento) {
            return this.avaliarExpressaoConstante(expressao.expressao);
        }

        return null;
    }

    /**
     * Calcula o resultado de uma operação binária em tempo de compilação
     */
    private calcularOperacaoBinaria(operador: string, esquerda: any, direita: any): any {
        try {
            switch (operador) {
                case 'ADICAO':
                    return esquerda + direita;
                case 'SUBTRACAO':
                    return esquerda - direita;
                case 'MULTIPLICACAO':
                    return esquerda * direita;
                case 'DIVISAO':
                    return esquerda / direita;
                case 'MODULO':
                    return esquerda % direita;
                case 'MAIOR':
                    return esquerda > direita;
                case 'MAIOR_IGUAL':
                    return esquerda >= direita;
                case 'MENOR':
                    return esquerda < direita;
                case 'MENOR_IGUAL':
                    return esquerda <= direita;
                case 'IGUAL':
                    return esquerda === direita;
                case 'DIFERENTE':
                    return esquerda !== direita;
                default:
                    return null;
            }
        } catch (e) {
            return null;
        }
    }

    /**
     * Verifica se um construto existe (principalmente variáveis)
     */
    private verificarExistenciaConstruto(construto: Construto): void {
        if (construto instanceof Variavel) {
            if (!this.gerenciadorEscopos.buscar(construto.simbolo.lexema)) {
                this.erro(
                    construto.simbolo,
                    `Variável ${construto.simbolo.lexema} ainda não foi declarada até este ponto.`
                );
                return;
            }

            this.gerenciadorEscopos.marcarComoUsada(construto.simbolo.lexema);
            return;
        }

        if (construto instanceof Binario) {
            this.verificarBinario(construto);
        }
    }

    /**
     * Verifica uma expressão lógica
     */
    private verificarLogico(logico: Logico): Promise<void> {
        this.verificarLadoLogico(logico.direita);
        this.verificarLadoLogico(logico.esquerda);
        return Promise.resolve();
    }

    /**
     * Verifica uma chamada de função
     */
    private verificarChamada(chamada: Chamada): Promise<void> {
        switch (chamada.entidadeChamada.constructor) {
            case Variavel:
                let entidadeChamadaVariavel = chamada.entidadeChamada as Variavel;
                if (!this.funcoes[entidadeChamadaVariavel.simbolo.lexema]) {
                    this.erro(
                        entidadeChamadaVariavel.simbolo,
                        `Chamada da função '${entidadeChamadaVariavel.simbolo.lexema}' não existe.`
                    );
                }
                break;
        }

        return Promise.resolve();
    }

    /**
     * Verifica o lado de uma expressão lógica
     */
    private verificarLadoLogico(lado: Construto): void {
        if (lado instanceof Variavel) {
            let variavel = lado as Variavel;
            this.verificarVariavelBinaria(variavel);
        }
    }

    /**
     * Verifica interpolações de texto e marca variáveis como usadas
     */
    protected verificarInterpolacaoTexto(texto: string, literal: Literal): void {
        // Regex para encontrar ${identificador}
        const regexInterpolacao = /\$\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
        let match;

        while ((match = regexInterpolacao.exec(texto)) !== null) {
            const nomeVariavel = match[1];

            const variavel = this.gerenciadorEscopos.buscar(nomeVariavel);
            const funcao = this.funcoes[nomeVariavel];

            if (!variavel && !funcao) {
                this.erro(
                    {
                        lexema: nomeVariavel,
                        tipo: 'IDENTIFICADOR',
                        linha: literal.linha,
                        hashArquivo: literal.hashArquivo
                    } as SimboloInterface,
                    `Variável '${nomeVariavel}' usada em interpolação não foi declarada.`
                );
            } else if (variavel) {
                this.gerenciadorEscopos.marcarComoUsada(nomeVariavel);
            }
        }
    }

    override visitarDeclaracaoEscreva(declaracao: Escreva): Promise<any> {
        for (const argumento of declaracao.argumentos) {
            if (argumento instanceof Literal && typeof argumento.valor === 'string') {
                this.verificarInterpolacaoTexto(argumento.valor, argumento);
            }

            if (argumento instanceof Variavel) {
                this.verificarVariavel(argumento);
            }
        }

        return Promise.resolve();
    }

    /**
     * Verifica variáveis não usadas no escopo atual
     */
    private verificarVariaveisNaoUsadas(): void {
        const variaveisNaoUsadas = this.gerenciadorEscopos.obterVariaveisNaoUsadas();

        for (const variavel of variaveisNaoUsadas) {
            this.aviso(
                {
                    lexema: variavel.nome,
                    tipo: 'IDENTIFICADOR',
                    linha: variavel.linha,
                    hashArquivo: variavel.hashArquivo
                } as SimboloInterface,
                `Variável '${variavel.nome}' foi declarada mas nunca foi usada.`
            );
        }
    }

    override visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        this.gerenciadorEscopos.declarar(
            declaracao.simbolo.lexema,
            {
                nome: declaracao.simbolo.lexema,
                tipo: declaracao.tipo as any,
                imutavel: true,
                valor: declaracao.inicializador,
                inicializada: declaracao.inicializador !== undefined,
                usada: false,
                hashArquivo: declaracao.simbolo.hashArquivo,
                linha: declaracao.simbolo.linha
            }
        );

        if (declaracao.inicializador) {
            this.verificarTipoAtribuido(declaracao);
        }

        return Promise.resolve();
    }

    override visitarDeclaracaoVar(declaracao: Var): Promise<any> {
        this.gerenciadorEscopos.declarar(
            declaracao.simbolo.lexema,
            {
                nome: declaracao.simbolo.lexema,
                tipo: declaracao.tipo as any,
                imutavel: false,
                valor: declaracao.inicializador,
                inicializada: declaracao.inicializador !== undefined,
                usada: false,
                hashArquivo: declaracao.simbolo.hashArquivo,
                linha: declaracao.simbolo.linha
            }
        );

        if (declaracao.inicializador) {
            this.verificarTipoAtribuido(declaracao);
        }

        return Promise.resolve();
    }

    override visitarExpressaoDeVariavel(expressao: Variavel | Constante): Promise<any> {
        if (expressao instanceof Variavel) {
            this.verificarVariavel(expressao);
        }

        return Promise.resolve();
    }

    // Visitadores específicos do Potigol
    visitarDeclaracaoLeiaInteiro(declaracao: LeiaInteiro): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaInteiros(declaracao: LeiaInteiros): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaReais(declaracao: LeiaReais): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaReal(declaracao: LeiaReal): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaTexto(declaracao: LeiaTexto): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaTextos(declaracao: LeiaTextos): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoAliasTipo(declaracao: AliasTipo): Promise<any> | void {
        return Promise.resolve();
    }

    override visitarExpressaoBinaria(expressao: Binario): Promise<any> {
        this.verificarExistenciaConstruto(expressao.direita);
        this.verificarExistenciaConstruto(expressao.esquerda);
        this.verificarOperadorBinario(expressao);
        return Promise.resolve();
    }

    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): void | Promise<any> {
        // Verifica se a variável existe
        const variavel = this.gerenciadorEscopos.buscar(declaracao.simbolo.lexema);
        if (!variavel) {
            this.erro(
                declaracao.simbolo,
                `Variável '${declaracao.simbolo.lexema}' ainda não foi declarada até este ponto.`
            );
        } else if (variavel.imutavel) {
            this.erro(
                declaracao.simbolo,
                `Constante '${declaracao.simbolo.lexema}' não pode ser modificada.`
            );
        }

        // Marca variáveis usadas na expressão de inicialização
        if (declaracao.inicializador) {
            this.marcarVariaveisUsadasEmExpressao(declaracao.inicializador);
        }

        // Marca como inicializada
        if (declaracao.inicializador) {
            this.gerenciadorEscopos.marcarComoInicializada(declaracao.simbolo.lexema, declaracao.inicializador);
        }

        return Promise.resolve();
    }

    /**
     * Método principal de análise semântica
     */
    async analisar(declaracoes: Declaracao[]): Promise<RetornoAnalisadorSemantico> {
        // Reinicia o gerenciador de escopos
        this.gerenciadorEscopos = new GerenciadorEscopos();
        this.funcoes = {};
        this.atual = 0;
        this.diagnosticos = [];

        while (this.atual < declaracoes.length) {
            await declaracoes[this.atual].aceitar(this);
            this.atual++;
        }

        // Verifica variáveis não usadas ao final da análise
        this.verificarVariaveisNaoUsadas();

        return {
            diagnosticos: this.diagnosticos,
        } as RetornoAnalisadorSemantico;
    }
}
