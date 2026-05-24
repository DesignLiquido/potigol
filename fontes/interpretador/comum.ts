import {
    AcessoMetodoOuPropriedade,
    Binario,
    Constante,
    FuncaoConstruto,
    Literal,
    TipoDe,
    Tupla,
    Unario,
    Variavel,
} from '@designliquido/delegua/construtos';
import {
    DeleguaFuncao,
    DeleguaModulo,
    DescritorTipoClasse,
    FuncaoPadrao,
    MetodoPrimitiva,
    ObjetoDeleguaClasse,
} from '@designliquido/delegua/interpretador/estruturas';
import { ConstrutoInterface, VariavelInterface } from '@designliquido/delegua/interfaces';
import { Classe, Const, Escolha } from '@designliquido/delegua/declaracoes';
import { ErroEmTempoDeExecucao } from '@designliquido/delegua/excecoes';
import { PilhaEscoposExecucaoInterface } from '@designliquido/delegua/interfaces/pilha-escopos-execucao-interface';
import { ContinuarQuebra, RetornoQuebra, SustarQuebra } from '@designliquido/delegua/quebras';

import { inferirTipoVariavel } from './inferenciador';
import { InterpretadorPotigolInterface } from '../interfaces';
import {
    ConstanteOuVariavel,
    LeiaInteiro,
    LeiaInteiros,
    LeiaReais,
    LeiaReal,
    LeiaTexto,
    LeiaTextos,
} from '../construtos';
import { ParaGere, ReatribuicaoVariavel } from '../declaracoes';
import { EstruturaMatriz, EstruturaCubo, EstruturaTupla, PotigolFuncao } from './estruturas';

import * as bibliotecaGlobal from '../bibliotecas/biblioteca-global';
import primitivasNumero from '../bibliotecas/primitivas-numero';
import primitivasTexto from '../bibliotecas/primitivas-texto';
import primitivasCubo from '../bibliotecas/primitivas-cubo';
import primitivasMatriz from '../bibliotecas/primitivas-matriz';
import primitivasVetor from '../bibliotecas/primitivas-vetor';
import tiposDeSimbolos from '../tipos-de-simbolos/lexico-regular';

const tiposNumericos = ['inteiro', 'numero', 'número', 'real', 'InteiroGrande'];

export function carregarBibliotecaGlobal(pilhaEscoposExecucao: PilhaEscoposExecucaoInterface) {
    pilhaEscoposExecucao.definirVariavel('abs', new FuncaoPadrao(1, bibliotecaGlobal.abs));

    pilhaEscoposExecucao.definirVariavel('aleatório', new FuncaoPadrao(2, bibliotecaGlobal.aleatorio));
    pilhaEscoposExecucao.definirVariavel('aleatorio', new FuncaoPadrao(2, bibliotecaGlobal.aleatorio));

    pilhaEscoposExecucao.definirVariavel('arccos', new FuncaoPadrao(1, bibliotecaGlobal.arccos));

    pilhaEscoposExecucao.definirVariavel('arcsen', new FuncaoPadrao(1, bibliotecaGlobal.arcsen));

    pilhaEscoposExecucao.definirVariavel('arctg', new FuncaoPadrao(1, bibliotecaGlobal.arctg));

    pilhaEscoposExecucao.definirVariavel('cos', new FuncaoPadrao(1, bibliotecaGlobal.cos));

    pilhaEscoposExecucao.definirVariavel('log', new FuncaoPadrao(1, bibliotecaGlobal.log));

    pilhaEscoposExecucao.definirVariavel('log10', new FuncaoPadrao(1, bibliotecaGlobal.log10));

    pilhaEscoposExecucao.definirVariavel('pi', new FuncaoPadrao(0, bibliotecaGlobal.pi));

    pilhaEscoposExecucao.definirVariavel('raiz', new FuncaoPadrao(2, bibliotecaGlobal.raiz));

    pilhaEscoposExecucao.definirVariavel('sen', new FuncaoPadrao(1, bibliotecaGlobal.sen));

    pilhaEscoposExecucao.definirVariavel('tg', new FuncaoPadrao(1, bibliotecaGlobal.tg));
}

function resolverNomeObjectoAcessado(objetoAcessado: any): string {
    if (objetoAcessado instanceof Variavel) {
        return objetoAcessado.simbolo.lexema;
    } 
    
    if (objetoAcessado instanceof Constante) {
        return objetoAcessado.simbolo.lexema;
    }

    if (objetoAcessado instanceof ConstanteOuVariavel) {
        return objetoAcessado.simbolo.lexema;
    }

    return '';
}

export function resolverValor(objeto: any) {
    if (objeto === null || objeto === undefined) {
        return objeto;
    }

    if (Array.isArray(objeto)) {
        const vetorResolvido: any[] = [];
        for (const elemento of objeto) {
            vetorResolvido.push(resolverValor(elemento));
        }

        // Check if this is a matrix (2D array)
        if (vetorResolvido.length > 0 && Array.isArray(vetorResolvido[0])) {
            // Check if it's a cube (3D array)
            if (vetorResolvido[0].length > 0 && Array.isArray(vetorResolvido[0][0])) {
                return new EstruturaCubo(vetorResolvido);
            }
            return new EstruturaMatriz(vetorResolvido);
        }

        return vetorResolvido;
    }

    if (objeto instanceof RetornoQuebra) {
        return resolverValor(objeto.valor);
    }

    if (objeto.hasOwnProperty && objeto.hasOwnProperty('valorRetornado')) {
        return resolverValor(objeto.valorRetornado);
    }

    if (objeto.hasOwnProperty('valor')) {
        if (Array.isArray(objeto.valor)) {
            return resolverValor(objeto.valor);
        }

        return objeto.valor;
    }

    return objeto;
}

/**
 * Executa uma declaração de classe.
 * Uma variável do tipo `DeleguaClasse` é adicionada à pilha de escopos de execução.
 * @param declaracao A declaração de classe.
 * @returns Sempre retorna nulo, por ser requerido pelo contrato de visita.
 */
export async function visitarDeclaracaoClasse(
    interpretador: InterpretadorPotigolInterface,
    declaracao: Classe
): Promise<DescritorTipoClasse> {
    let superClasse = null;
    if (declaracao.superClasse !== null && declaracao.superClasse !== undefined) {
        const variavelSuperClasse: VariavelInterface = await interpretador.avaliar(
            declaracao.superClasse
        );
        superClasse = variavelSuperClasse.valor;
        if (!(superClasse instanceof DescritorTipoClasse)) {
            throw new ErroEmTempoDeExecucao(
                declaracao.superClasse.nome,
                'Superclasse precisa ser uma classe.',
                declaracao.linha
            );
        }
    }

    // TODO: Precisamos disso?
    interpretador.pilhaEscoposExecucao.definirVariavel(declaracao.simbolo.lexema, declaracao);

    if (declaracao.superClasse !== null && declaracao.superClasse !== undefined) {
        interpretador.pilhaEscoposExecucao.definirVariavel('super', superClasse);
    }

    const metodos = {};
    const definirMetodos = declaracao.metodos;
    for (let i = 0; i < declaracao.metodos.length; i++) {
        const metodoAtual = definirMetodos[i];
        const eInicializador = metodoAtual.simbolo.lexema === 'construtor';
        const funcao = new PotigolFuncao(
            metodoAtual.simbolo.lexema,
            metodoAtual.funcao,
            undefined,
            eInicializador
        );
        metodos[metodoAtual.simbolo.lexema] = funcao;
    }

    const descritorTipoClasse: DescritorTipoClasse = new DescritorTipoClasse(
        declaracao.simbolo,
        superClasse,
        metodos,
        declaracao.propriedades
    );

    descritorTipoClasse.dialetoRequerExpansaoPropriedadesEspacoMemoria = true;
    descritorTipoClasse.dialetoRequerDeclaracaoPropriedades = true;

    interpretador.pilhaEscoposExecucao.atribuirVariavel(declaracao.simbolo, descritorTipoClasse);
    return null;
}

/**
 * Expressões como por exemplo `x = leia_real` dão a dica do tipo
 * da variável no inicializador, o que nos obriga a reescrever a visita à
 * declarações de constantes.
 * @param {Const} declaracao A declaração de constante.
 * @returns Nulo.
 */
export async function visitarDeclaracaoConst(
    interpretador: InterpretadorPotigolInterface,
    declaracao: Const
): Promise<any> {
    const valorFinal = await interpretador.avaliacaoDeclaracaoVarOuConst(declaracao);
    let tipoResolvido = declaracao.tipo;

    // Leia base class sets tipo='texto' on all Leia constructs, which Const picks up as
    // inicializador.tipo. Override with the correct type for each Leia variant.
    switch (declaracao.inicializador?.constructor) {
        case LeiaInteiro:
            tipoResolvido = 'inteiro';
            break;
        case LeiaReal:
            tipoResolvido = 'número';
            break;
        case LeiaTexto:
            tipoResolvido = 'texto';
            break;
        case LeiaInteiros:
        case LeiaReais:
        case LeiaTextos:
            tipoResolvido = null;
            break;
    }

    interpretador.pilhaEscoposExecucao.definirConstante(declaracao.simbolo.lexema, valorFinal, tipoResolvido);
    return null;
}

export async function visitarDeclaracaoReatribuicaoVariavel(
    interpretador: InterpretadorPotigolInterface,
    declaracao: ReatribuicaoVariavel
): Promise<any> {
    const valorFinal = await interpretador.avaliacaoDeclaracaoVarOuConst(declaracao);

    interpretador.pilhaEscoposExecucao.atribuirVariavel(declaracao.simbolo, valorFinal);

    return null;
}

export async function visitarDeclaracaoParaGere(
    interpretador: InterpretadorPotigolInterface,
    declaracao: ParaGere
): Promise<any> {
    const inicioAvaliacao = await interpretador.avaliar(declaracao.inicio);
    const fimAvaliacao = await interpretador.avaliar(declaracao.fim);

    let inicio = Number(resolverValor(inicioAvaliacao));
    let fim = Number(resolverValor(fimAvaliacao));

    let passo = declaracao.passo ? Number(resolverValor(await interpretador.avaliar(declaracao.passo))) : undefined;
    if (passo === undefined || Number.isNaN(passo)) {
        passo = inicio <= fim ? 1 : -1;
    }

    if (passo === 0) {
        throw new ErroEmTempoDeExecucao(
            declaracao.simboloIteracao,
            "O passo de 'para ... gere' não pode ser zero.",
            declaracao.linha
        );
    }

    const condicaoContinuidade = passo > 0
        ? (valorAtual: number) => valorAtual <= fim
        : (valorAtual: number) => valorAtual >= fim;

    const resultados = [];
    for (let valorAtual = inicio; condicaoContinuidade(valorAtual); valorAtual += passo) {
        interpretador.pilhaEscoposExecucao.definirVariavel(
            declaracao.simboloIteracao.lexema,
            valorAtual,
            'inteiro'
        );

        if (declaracao.condicao) {
            const condicao = await interpretador.avaliar(declaracao.condicao);
            if (!(interpretador as any).eVerdadeiro(condicao)) {
                continue;
            }
        }

        for (const declaracaoCorpo of declaracao.corpo) {
            const retorno = await interpretador.executar(declaracaoCorpo);
            if (retorno instanceof SustarQuebra) {
                return resultados;
            }

            if (retorno instanceof ContinuarQuebra) {
                break;
            }

            const valorResolvido = resolverValor(retorno);
            if (valorResolvido !== null && valorResolvido !== undefined) {
                resultados.push(valorResolvido);
            }
        }
    }

    return resultados;
}

export async function visitarDeclaracaoEscolhaComGuarda(
    interpretador: InterpretadorPotigolInterface,
    declaracao: Escolha
): Promise<any> {
    const condicaoEscolha = await interpretador.avaliar(declaracao.identificadorOuLiteral);
    const valorCondicaoEscolha = resolverValor(condicaoEscolha);
    let encontrado = false;

    for (let i = 0; i < declaracao.caminhos.length; i++) {
        const caminho = declaracao.caminhos[i] as any;
        let condicaoCorresponde = false;
        for (let j = 0; j < caminho.condicoes.length; j++) {
            const condicaoAvaliada = await interpretador.avaliar(caminho.condicoes[j]);
            if (resolverValor(condicaoAvaliada) === valorCondicaoEscolha) {
                condicaoCorresponde = true;
                break;
            }
        }

        if (!condicaoCorresponde) {
            continue;
        }

        if (caminho.guarda) {
            const guardaAvaliada = await interpretador.avaliar(caminho.guarda);
            if (!(interpretador as any).eVerdadeiro(guardaAvaliada)) {
                continue;
            }
        }

        encontrado = true;
        await interpretador.executarBloco(caminho.declaracoes);
    }

    if (declaracao.caminhoPadrao !== null && !encontrado) {
        await interpretador.executarBloco(declaracao.caminhoPadrao.declaracoes);
    }

    return null;
}

/**
 * Executa um acesso a método, normalmente de um objeto de classe.
 * @param expressao A expressão de acesso.
 * @returns O resultado da execução.
 */
export async function visitarExpressaoAcessoMetodoOuPropriedade(
    interpretador: InterpretadorPotigolInterface,
    expressao: AcessoMetodoOuPropriedade
): Promise<any> {
    const variavelObjeto: VariavelInterface =
        expressao.objeto instanceof ConstanteOuVariavel
            ? interpretador.pilhaEscoposExecucao.obterVariavelPorNome((expressao.objeto as any).simbolo.lexema)
            : await interpretador.avaliar(expressao.objeto);
    const nomeObjeto: string = resolverNomeObjectoAcessado(expressao.objeto);
    let objeto = variavelObjeto.hasOwnProperty('valor') ? variavelObjeto.valor : variavelObjeto;

    if (objeto instanceof ObjetoDeleguaClasse) {
        return objeto.obter(expressao.simbolo) || null;
    }

    // TODO: Isso está aqui porque Delégua trabalha com objetos
    // como dicionários internamente.
    // Verificar se Potigol também possui suporte a dicionários.
    if (objeto.constructor === Object) {
        return objeto[expressao.simbolo.lexema] || null;
    }

    // Função tradicional do JavaScript.
    // Normalmente executa quando uma biblioteca é importada.
    // EstruturaMatriz e EstruturaCubo são excluídas aqui porque seus métodos
    // devem ser despachados via MetodoPrimitiva para receber os argumentos corretamente.
    if (
        typeof objeto[expressao.simbolo.lexema] === 'function' &&
        !(objeto instanceof EstruturaMatriz) &&
        !(objeto instanceof EstruturaCubo)
    ) {
        return objeto[expressao.simbolo.lexema];
    }

    // Objeto tradicional do JavaScript.
    // Normalmente executa quando uma biblioteca é importada.
    if (typeof objeto[expressao.simbolo.lexema] === 'object') {
        return objeto[expressao.simbolo.lexema];
    }

    if (objeto instanceof DeleguaModulo) {
        return objeto.componentes[expressao.simbolo.lexema] || null;
    }

    let tipoObjeto: any = variavelObjeto.tipo;
    if (tipoObjeto === null || tipoObjeto === undefined || tipoObjeto === 'qualquer') {
        tipoObjeto = inferirTipoVariavel(objeto);
    }

    // Convert arrays to appropriate structures based on type
    if (tipoObjeto === 'Matriz' && Array.isArray(objeto)) {
        objeto = new EstruturaMatriz(objeto);
    } else if (tipoObjeto === 'Cubo' && Array.isArray(objeto)) {
        objeto = new EstruturaCubo(objeto);
    }

    switch (tipoObjeto) {
        case 'inteiro':
        case 'Inteiro': // TODO: Remover.
        case 'Real': // TODO: Remover.
        case 'InteiroGrande':
        case 'número':
            const metodoDePrimitivaNumero: Function = primitivasNumero[expressao.simbolo.lexema];
            if (metodoDePrimitivaNumero) {
                const metodoNumero = new MetodoPrimitiva(nomeObjeto, objeto, metodoDePrimitivaNumero, expressao.simbolo.lexema, 'número');
                if (metodoNumero.valorAridade === 0) return metodoNumero.chamar(interpretador);
                return metodoNumero;
            }
            break;
        case 'texto':
            const metodoDePrimitivaTexto: Function = primitivasTexto[expressao.simbolo.lexema];
            if (metodoDePrimitivaTexto) {
                const metodoTexto = new MetodoPrimitiva(nomeObjeto, objeto, metodoDePrimitivaTexto, expressao.simbolo.lexema, 'texto');
                if (metodoTexto.valorAridade === 0) return metodoTexto.chamar(interpretador);
                return metodoTexto;
            }
            break;
        case 'vetor':
        case 'Lista':
            const metodoDePrimitivaVetor: Function = primitivasVetor[expressao.simbolo.lexema];
            if (metodoDePrimitivaVetor) {
                const metodoVetor = new MetodoPrimitiva(nomeObjeto, objeto, metodoDePrimitivaVetor, expressao.simbolo.lexema, 'vetor');
                if (metodoVetor.valorAridade === 0) return metodoVetor.chamar(interpretador);
                return metodoVetor;
            }
            break;
        case 'Matriz':
            const metodoDePrimitivaMatriz: Function = primitivasMatriz[expressao.simbolo.lexema];
            if (metodoDePrimitivaMatriz) {
                const metodoMatriz = new MetodoPrimitiva(nomeObjeto, objeto, metodoDePrimitivaMatriz, expressao.simbolo.lexema, 'Matriz');
                if (metodoMatriz.valorAridade === 0) return metodoMatriz.chamar(interpretador);
                return metodoMatriz;
            }
            break;
        case 'Cubo':
            const metodoDePrimitivaCubo: Function = primitivasCubo[expressao.simbolo.lexema];
            if (metodoDePrimitivaCubo) {
                const metodoCubo = new MetodoPrimitiva(nomeObjeto, objeto, metodoDePrimitivaCubo, expressao.simbolo.lexema, 'Cubo');
                if (metodoCubo.valorAridade === 0) return metodoCubo.chamar(interpretador);
                return metodoCubo;
            }
            break;
    }

    return Promise.reject(
        new ErroEmTempoDeExecucao(
            expressao.simbolo,
            `Método para objeto ou primitiva não encontrado: ${expressao.simbolo.lexema}.`,
            expressao.linha
        )
    );
}

export async function visitarExpressaoBinaria(
    interpretador: InterpretadorPotigolInterface,
    expressao: any
): Promise<any> {
    const esquerda: VariavelInterface | any = await interpretador.avaliar(expressao.esquerda);
    const direita: VariavelInterface | any = await interpretador.avaliar(expressao.direita);
    const valorEsquerdo: any = resolverValor(esquerda);
    const valorDireito: any = resolverValor(direita);
    const tipoEsquerdo: string = esquerda?.hasOwnProperty('tipo') ? esquerda.tipo : inferirTipoVariavel(esquerda);
    const tipoDireito: string = direita?.hasOwnProperty('tipo') ? direita.tipo : inferirTipoVariavel(direita);

    const ambosInteiroGrande = typeof valorEsquerdo === 'bigint' && typeof valorDireito === 'bigint';

    switch (expressao.operador.tipo) {
        case tiposDeSimbolos.EXPONENCIACAO:
            interpretador.verificarOperandosNumeros(expressao.operador, esquerda, direita);
            if (ambosInteiroGrande) return valorEsquerdo ** valorDireito;
            return Math.pow(valorEsquerdo, valorDireito);

        case tiposDeSimbolos.MAIOR:
            if (tiposNumericos.includes(tipoEsquerdo) && tiposNumericos.includes(tipoDireito)) {
                if (ambosInteiroGrande) return valorEsquerdo > valorDireito;
                return Number(valorEsquerdo) > Number(valorDireito);
            }

            return String(valorEsquerdo) > String(valorDireito);

        case tiposDeSimbolos.MAIOR_IGUAL:
            interpretador.verificarOperandosNumeros(expressao.operador, esquerda, direita);
            if (ambosInteiroGrande) return valorEsquerdo >= valorDireito;
            return Number(valorEsquerdo) >= Number(valorDireito);

        case tiposDeSimbolos.MENOR:
            if (tiposNumericos.includes(tipoEsquerdo) && tiposNumericos.includes(tipoDireito)) {
                if (ambosInteiroGrande) return valorEsquerdo < valorDireito;
                return Number(valorEsquerdo) < Number(valorDireito);
            }

            return String(valorEsquerdo) < String(valorDireito);

        case tiposDeSimbolos.MENOR_IGUAL:
            interpretador.verificarOperandosNumeros(expressao.operador, esquerda, direita);
            if (ambosInteiroGrande) return valorEsquerdo <= valorDireito;
            return Number(valorEsquerdo) <= Number(valorDireito);

        case tiposDeSimbolos.SUBTRACAO:
            interpretador.verificarOperandosNumeros(expressao.operador, esquerda, direita);
            if (ambosInteiroGrande) return valorEsquerdo - valorDireito;
            return Number(valorEsquerdo) - Number(valorDireito);

        case tiposDeSimbolos.ADICAO:
            if (ambosInteiroGrande) return valorEsquerdo + valorDireito;
            if (tiposNumericos.includes(tipoEsquerdo.toLowerCase()) && tiposNumericos.includes(tipoDireito.toLowerCase())) {
                return Number(valorEsquerdo) + Number(valorDireito);
            }

            return String(valorEsquerdo) + String(valorDireito);

        case tiposDeSimbolos.DIVISAO:
            interpretador.verificarOperandosNumeros(expressao.operador, esquerda, direita);
            if (ambosInteiroGrande) return valorEsquerdo / valorDireito;
            return Number(valorEsquerdo) / Number(valorDireito);

        case tiposDeSimbolos.DIVISAO_INTEIRA:
            interpretador.verificarOperandosNumeros(expressao.operador, esquerda, direita);
            if (ambosInteiroGrande) return valorEsquerdo / valorDireito;
            return Math.floor(Number(valorEsquerdo) / Number(valorDireito));

        case tiposDeSimbolos.MULTIPLICACAO:
            if (ambosInteiroGrande) return valorEsquerdo * valorDireito;
            return Number(valorEsquerdo) * Number(valorDireito);

        case tiposDeSimbolos.MODULO:
            interpretador.verificarOperandosNumeros(expressao.operador, esquerda, direita);
            if (ambosInteiroGrande) return valorEsquerdo % valorDireito;
            return Number(valorEsquerdo) % Number(valorDireito);

        case tiposDeSimbolos.DIFERENTE:
            return !interpretador.eIgual(valorEsquerdo, valorDireito);

        case tiposDeSimbolos.IGUAL_IGUAL:
            return interpretador.eIgual(valorEsquerdo, valorDireito);

        case tiposDeSimbolos.CONCATENACAO_LISTA:
            if (!Array.isArray(valorDireito)) {
                throw new ErroEmTempoDeExecucao(
                    expressao.operador,
                    'Lado direito da concatenação não parece ser uma lista.'
                );
            }

            return [valorEsquerdo].concat(valorDireito);
    }
}

export async function visitarExpressaoFuncaoConstruto(
    interpretador: InterpretadorPotigolInterface,
    funcaoConstruto: FuncaoConstruto
): Promise<DeleguaFuncao> {
    return new PotigolFuncao(null, funcaoConstruto);
}

export async function visitarExpressaoLeia(
    interpretador: InterpretadorPotigolInterface,
    expressao: LeiaInteiro | LeiaReal | LeiaTexto
): Promise<any> {
    const _resposta: string = await new Promise((resolver) => {
        interpretador.interfaceEntradaSaida.question('> ', (resposta: any) => {
            resolver(String(resposta));
        });
    });

    // TODO: Ver o que acontece em Potigol quando tipos conflitam.
    switch (expressao.constructor) {
        case LeiaInteiro:
            return parseInt(_resposta.trim());
        case LeiaReal:
            return Number(_resposta.trim());
        case LeiaTexto:
            return _resposta;
    }
}

export async function visitarExpressaoLeiaMultiplo(
    interpretador: InterpretadorPotigolInterface,
    expressao: LeiaInteiros | LeiaReais | LeiaTextos
): Promise<any> {
    const argumento = expressao.argumentoCardinalidade;
    if (!(argumento instanceof Literal)) {
        return [];
    }

    if (typeof argumento.valor === 'string') {
        const separador = argumento.valor;
        const linha: string = await new Promise((resolver) => {
            interpretador.interfaceEntradaSaida.question('> ', (resposta: any) => {
                resolver(String(resposta));
            });
        });
        return linha.split(separador).map((v) => v.trim()).filter((v) => v !== '');
    }

    const quantidade = argumento.valor as number;
    const respostas: any[] = [];
    for (let i = 0; i < quantidade; i++) {
        const resposta = await new Promise<string>((resolver) => {
            interpretador.interfaceEntradaSaida.question('> ', (r: any) => {
                resolver(String(r));
            });
        });
        respostas.push(resposta);
    }

    switch (expressao.constructor) {
        case LeiaInteiros:
            return respostas.map((v) => parseInt(v));
        case LeiaReais:
            return respostas.map((v) => Number(v));
        default:
            return respostas;
    }
}

export async function visitarExpressaoTipoDe(
    interpretador: InterpretadorPotigolInterface,
    expressao: TipoDe
): Promise<string> {
    let qualTipo = expressao.valor;

    if (expressao?.valor instanceof ConstanteOuVariavel) {
        const nome = (expressao?.valor as any).simbolo.lexema;
        qualTipo = interpretador.pilhaEscoposExecucao.topoDaPilha().espacoMemoria.valores[nome].valor;
    }

    if (
        qualTipo instanceof Binario ||
        qualTipo instanceof Literal ||
        qualTipo instanceof TipoDe ||
        qualTipo instanceof Unario ||
        qualTipo instanceof Variavel
    ) {
        qualTipo = await interpretador.avaliar(qualTipo);
        return qualTipo.tipo || inferirTipoVariavel(qualTipo as any);
    }

    return inferirTipoVariavel((qualTipo as any)?.valores || qualTipo);
}

export async function visitarExpressaoTupla(
    interpretador: InterpretadorPotigolInterface,
    expressao: Tupla
): Promise<EstruturaTupla> {
    const chaves = Object.keys(expressao);
    const valores = [];
    for (let chave of chaves) {
        const valor = await interpretador.avaliar(expressao[chave]);
        valores.push(valor);
    }

    const estruturaTupla = new EstruturaTupla(valores);
    return estruturaTupla;
}

/**
 * `escreva` em Potigol tem apenas um argumento.
 * @param interpretador A instância do interpretador.
 * @param argumento
 * @returns
 */
export async function avaliarArgumentosEscreva(
    interpretador: InterpretadorPotigolInterface,
    argumento: ConstrutoInterface
): Promise<string> {
    let formatoTexto: string = '';
    if (argumento === undefined) {
        return formatoTexto;
    }

    const resultadoAvaliacao = await interpretador.avaliar(argumento);
    const resultadoAvaliacaoResolvido = resolverValor(resultadoAvaliacao);
    // TODO: Depreciar esta forma. Construtos e declarações usam `paraTexto` com outra finalidade.
    if (typeof resultadoAvaliacaoResolvido.paraTexto === 'function') {
        formatoTexto = resultadoAvaliacao.paraTexto();
    } else {
        formatoTexto = `${interpretador.paraTexto(resultadoAvaliacaoResolvido)}`;
    }

    return formatoTexto;
}

/**
 * Resolve todas as interpolações em um texto.
 * @param {texto} textoOriginal O texto original com as variáveis interpoladas.
 * @returns Uma lista de variáveis interpoladas.
 */
export async function resolverInterpolacoes(
    interpretador: InterpretadorPotigolInterface,
    textoOriginal: string,
    linha: number
): Promise<any[]> {
    const variaveis = textoOriginal.match(interpretador.regexInterpolacao);

    let resultadosAvaliacaoSintatica = variaveis.map((s) => {
        const expressao: string = s.replace(/[\{\}]*/gm, '');

        let microLexador = interpretador.microLexador.mapear(expressao);
        const resultadoMicroAvaliadorSintatico = interpretador.microAvaliadorSintatico.analisar(microLexador, linha);

        return {
            nomeVariavel: expressao,
            resultadoMicroAvaliadorSintatico,
        };
    });

    // TODO: Verificar erros do `resultadosAvaliacaoSintatica`.

    const resolucoesPromises = await Promise.all(
        resultadosAvaliacaoSintatica
            .flatMap((r) => r.resultadoMicroAvaliadorSintatico.declaracoes)
            .map((d) => interpretador.avaliar(d))
    );

    return resolucoesPromises.map((item, indice) => ({
        variavel: resultadosAvaliacaoSintatica[indice].nomeVariavel,
        valor: item,
    }));
}

/**
 * Retira a interpolação de um texto.
 * @param {texto} texto O texto
 * @param {any[]} variaveis A lista de variaveis interpoladas
 * @returns O texto com o valor das variaveis.
 */
export function retirarInterpolacao(texto: string, variaveis: any[]): string {
    let textoFinal = texto;

    variaveis.forEach((elemento) => {
        if (elemento?.valor?.tipo === 'lógico') {
            textoFinal = textoFinal.replace('{' + elemento.variavel + '}', this.paraTexto(elemento?.valor?.valor));
        } else {
            textoFinal = textoFinal.replace('{' + elemento.variavel + '}', elemento?.valor?.valor || elemento?.valor);
        }
    });

    return textoFinal;
}
