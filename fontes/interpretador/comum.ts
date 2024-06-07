import { AcessoMetodoOuPropriedade, Binario, ConstanteOuVariavel, Construto, Literal, QualTipo, Tupla, Unario, Variavel } from '@designliquido/delegua/construtos';
import { DeleguaModulo, FuncaoPadrao, MetodoPrimitiva, ObjetoDeleguaClasse } from '@designliquido/delegua/estruturas';
import { VariavelInterface } from '@designliquido/delegua/interfaces';
import { ErroEmTempoDeExecucao } from '@designliquido/delegua/excecoes';
import { InterpretadorBase } from '@designliquido/delegua/interpretador';
import { LeiaMultiplo } from '@designliquido/delegua';
import { PilhaEscoposExecucaoInterface } from '@designliquido/delegua/interfaces/pilha-escopos-execucao-interface';

import { inferirTipoVariavel } from './inferenciador';
import { EstruturaTupla } from '../estruturas';
import { InterpretadorPotigolInterface } from '../interfaces';

import * as bibliotecaGlobal from '../bibliotecas/biblioteca-global';
import primitivasNumero from '../bibliotecas/primitivas-numero';
import primitivasTexto from '../bibliotecas/primitivas-texto';
import primitivasVetor from '../bibliotecas/primitivas-vetor';

export function carregarBibliotecaGlobal(pilhaEscoposExecucao: PilhaEscoposExecucaoInterface) {
    pilhaEscoposExecucao.definirVariavel(
        'abs',
        new FuncaoPadrao(1, bibliotecaGlobal.abs)
    );

    pilhaEscoposExecucao.definirVariavel(
        'aleatório',
        new FuncaoPadrao(0, bibliotecaGlobal.aleatorio)
    );

    pilhaEscoposExecucao.definirVariavel(
        'arccos',
        new FuncaoPadrao(1, bibliotecaGlobal.arccos)
    );

    pilhaEscoposExecucao.definirVariavel(
        'arcsen',
        new FuncaoPadrao(1, bibliotecaGlobal.arcsen)
    );

    pilhaEscoposExecucao.definirVariavel(
        'arctg',
        new FuncaoPadrao(1, bibliotecaGlobal.arctg)
    );

    pilhaEscoposExecucao.definirVariavel(
        'cos',
        new FuncaoPadrao(1, bibliotecaGlobal.cos)
    );

    pilhaEscoposExecucao.definirVariavel(
        'log',
        new FuncaoPadrao(1, bibliotecaGlobal.log)
    );

    pilhaEscoposExecucao.definirVariavel(
        'log10',
        new FuncaoPadrao(1, bibliotecaGlobal.log10)
    );

    pilhaEscoposExecucao.definirVariavel(
        'pi',
        new FuncaoPadrao(0, bibliotecaGlobal.pi)
    );

    pilhaEscoposExecucao.definirVariavel(
        'raiz',
        new FuncaoPadrao(1, bibliotecaGlobal.raiz)
    );

    pilhaEscoposExecucao.definirVariavel(
        'sen',
        new FuncaoPadrao(1, bibliotecaGlobal.sen)
    );

    pilhaEscoposExecucao.definirVariavel(
        'tg',
        new FuncaoPadrao(1, bibliotecaGlobal.tg)
    );
}

/**
 * Executa um acesso a método, normalmente de um objeto de classe.
 * @param expressao A expressão de acesso.
 * @returns O resultado da execução.
 */
export async function visitarExpressaoAcessoMetodo(
    interpretador: InterpretadorPotigolInterface,
    expressao: AcessoMetodoOuPropriedade
): Promise<any> {
    const variavelObjeto: VariavelInterface = await interpretador.avaliar(expressao.objeto);
    const objeto = variavelObjeto.hasOwnProperty('valor') ? variavelObjeto.valor : variavelObjeto;

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
    if (typeof objeto[expressao.simbolo.lexema] === 'function') {
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
    if (tipoObjeto === null || tipoObjeto === undefined) {
        tipoObjeto = inferirTipoVariavel(variavelObjeto as any);
    }

    switch (tipoObjeto) {
        case 'Inteiro':
        case 'Real':
        case 'número': // TODO: Remover. Potigol não trabalha com um tipo 'número'.
            const metodoDePrimitivaNumero: Function = primitivasNumero[expressao.simbolo.lexema];
            if (metodoDePrimitivaNumero) {
                return new MetodoPrimitiva(objeto, metodoDePrimitivaNumero);
            }
            break;
        case 'texto':
            const metodoDePrimitivaTexto: Function = primitivasTexto[expressao.simbolo.lexema];
            if (metodoDePrimitivaTexto) {
                return new MetodoPrimitiva(objeto, metodoDePrimitivaTexto);
            }
            break;
        case 'vetor':
            const metodoDePrimitivaVetor: Function = primitivasVetor[expressao.simbolo.lexema];
            if (metodoDePrimitivaVetor) {
                return new MetodoPrimitiva(objeto, metodoDePrimitivaVetor);
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

export async function visitarExpressaoLeiaMultiplo(
    interpretador: InterpretadorPotigolInterface,
    expressao: LeiaMultiplo
): Promise<any> {
    let respostas = [];
    // O argumento sempre vem preenchido aqui.
    // Se for um literal, o literal contém o número de valores a serem lidos
    // da entrada.
    let valores = 0;
    const argumento = expressao.argumento;
    if (argumento instanceof Literal) {
        switch (argumento.valor) {
            case ',':
                await interpretador.interfaceEntradaSaida.question('> ', (resposta: any) => {
                    respostas = String(resposta)
                        .split(',')
                        .filter((valor) => !/(\s+)/.test(valor));
                });
                break;
            default:
                valores = argumento.valor;
                for (let i = 0; i < valores; i++) {
                    await interpretador.interfaceEntradaSaida.question('> ', (resposta: any) => {
                        respostas.push(resposta);
                    });
                }

                break;
        }
    }

    return Promise.resolve(respostas);
}

export async function visitarExpressaoQualTipo(
    interpretador: InterpretadorPotigolInterface,
    expressao: QualTipo
): Promise<string> {
    let qualTipo = expressao.valor;

    if (expressao?.valor instanceof ConstanteOuVariavel) {
        const nome = expressao?.valor.simbolo.lexema;
        qualTipo = interpretador.pilhaEscoposExecucao.topoDaPilha().ambiente.valores[nome].valor;
    }

    if (
        qualTipo instanceof Binario ||
        qualTipo instanceof Literal ||
        qualTipo instanceof QualTipo ||
        qualTipo instanceof Unario ||
        qualTipo instanceof Variavel
    ) {
        qualTipo = await interpretador.avaliar(qualTipo);
        return qualTipo.tipo || inferirTipoVariavel(qualTipo);
    }

    return inferirTipoVariavel(qualTipo?.valores || qualTipo);
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
    argumento: Construto
): Promise<string> {
    let formatoTexto: string = '';
    if (argumento === undefined) {
        return formatoTexto;
    }

    const resultadoAvaliacao = await interpretador.avaliar(argumento);
    if (typeof resultadoAvaliacao.paraTexto === 'function') {
        formatoTexto = resultadoAvaliacao.paraTexto();
    } else {
        let valor = resultadoAvaliacao?.hasOwnProperty('valor') ? resultadoAvaliacao.valor : resultadoAvaliacao;
        formatoTexto = `${interpretador.paraTexto(valor)}`;
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
