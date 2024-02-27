import { AcessoMetodoOuPropriedade, Binario, ConstanteOuVariavel, Construto, Literal, QualTipo, Unario, Variavel } from '@designliquido/delegua/construtos';
import { DeleguaModulo, MetodoPrimitiva, ObjetoDeleguaClasse } from '@designliquido/delegua/estruturas';
import { VariavelInterface } from '@designliquido/delegua/interfaces';
import { ErroEmTempoDeExecucao } from '@designliquido/delegua/excecoes';
import { InterpretadorBase } from '@designliquido/delegua/interpretador';

import { inferirTipoVariavel } from './inferenciador';
import primitivasNumero from '../bibliotecas/primitivas-numero';
import primitivasTexto from '../bibliotecas/primitivas-texto';
import primitivasVetor from '../bibliotecas/primitivas-vetor';
import { LeiaMultiplo } from '@designliquido/delegua';

/**
 * Executa um acesso a método, normalmente de um objeto de classe.
 * @param expressao A expressão de acesso.
 * @returns O resultado da execução.
 */
export async function visitarExpressaoAcessoMetodo(
    interpretador: InterpretadorBase,
    expressao: AcessoMetodoOuPropriedade
): Promise<any> {
    const variavelObjeto: VariavelInterface = await interpretador.avaliar(expressao.objeto);
    const objeto = variavelObjeto.hasOwnProperty('valor') ? variavelObjeto.valor : variavelObjeto;

    if (objeto instanceof ObjetoDeleguaClasse) {
        return objeto.obter(expressao.simbolo) || null;
    }

    // TODO: Possivelmente depreciar esta forma.
    // Não parece funcionar em momento algum.
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
        case 'numero':
        case 'número':
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
    interpretador: InterpretadorBase,
    expressao: LeiaMultiplo
): Promise<any> {
    let respostas = [];
    // O argumento sempre vem preenchido aqui.
    // Se for um literal, o literal contém o número de valores a serem lidos
    // da entrada.
    let valores = 0;
    const argumento = expressao.argumento;
    if (argumento instanceof Literal) {
        valores = argumento.valor;
    }

    for (let i = 0; i < valores; i++) {
        await interpretador.interfaceEntradaSaida.question('> ', (resposta: any) => {
            respostas.push(resposta);
        });
    }
    
    return Promise.resolve(respostas);
}

export async function visitarExpressaoQualTipo(
    interpretador: InterpretadorBase,
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

export async function avaliarArgumentosEscreva(
    interpretador: InterpretadorBase,
    argumentos: Construto[]
): Promise<string> {
    let formatoTexto: string = '';

    for (const argumento of argumentos) {
        const resultadoAvaliacao = await interpretador.avaliar(argumento);
        let valor = resultadoAvaliacao?.hasOwnProperty('valor') ? resultadoAvaliacao.valor : resultadoAvaliacao;
        formatoTexto += `${interpretador.paraTexto(valor)},`;
    }

    formatoTexto = formatoTexto.slice(0, -1);

    if (argumentos.length > 1) {
        formatoTexto = `(${formatoTexto})`;
    }

    return formatoTexto;
}

/**
 * Resolve todas as interpolações em um texto.
 * @param {texto} textoOriginal O texto original com as variáveis interpoladas.
 * @returns Uma lista de variáveis interpoladas.
 */
export async function resolverInterpolacoes(
    interpretador: InterpretadorBase,
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
