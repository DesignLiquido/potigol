import { DeleguaFuncao } from '@designliquido/delegua/interpretador/estruturas';
import { InterpretadorPotigolInterface } from '../interfaces';

export default {
    cabeça: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor[0]),
    cauda: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> => {
        let copia = [...vetor];
        copia.splice(0, 1);
        return Promise.resolve(copia);
    },
    contém: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>, elemento: any): Promise<any> =>
        Promise.resolve(vetor.includes(elemento)),
    descarte: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>, elementos: number): Promise<any> => {
        let copia = [...vetor];
        copia.splice(0, elementos);
        return Promise.resolve(copia);
    },
    descarte_enquanto: async (
        interpretador: InterpretadorPotigolInterface,
        
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'descarte_enquanto'.");
        }

        const retorno = [...vetor];
        for (let elemento of vetor) {
            let resultado = await funcao.chamar(interpretador, [elemento]);
            let resultadoResolvido = interpretador.resolverValor(resultado);
            if (resultadoResolvido) {
                retorno.shift();
            } else {
                break;
            }
        }

        return retorno;
    },
    divida_quando: async (
        interpretador: InterpretadorPotigolInterface,
        
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (vetor.length === 0) {
            return vetor;
        }

        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'divida_quando'.");
        }

        const retorno = [];
        let elementoAnterior: any = vetor.shift();
        let retornoAcumulado: any[] = [elementoAnterior];
        for (let elemento of vetor) {
            let resultado = await funcao.chamar(interpretador, [elementoAnterior, elemento]);
            let resultadoResolvido = interpretador.resolverValor(resultado);
            if (resultadoResolvido) {
                elementoAnterior = elemento;
                retorno.push(retornoAcumulado);
                retornoAcumulado = [elemento];
            } else {
                retornoAcumulado.push(elemento);
            }
        }

        if (retornoAcumulado.length > 0) {
            retorno.push(retornoAcumulado);
        }

        return retorno;
    },
    imutável: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> => Promise.resolve(),
    injete: async (
        interpretador: InterpretadorPotigolInterface,
        
        vetor: Array<any>,
        funcao: DeleguaFuncao,
        valorInicial?: any
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'injete'.");
        }

        if (vetor.length === 0 && valorInicial === undefined) {
            return Promise.resolve(undefined);
        }

        let retorno: any = valorInicial;
        let indiceInicio = 0;
        if (retorno === undefined) {
            retorno = vetor[0];
            indiceInicio = 1;
        }

        for (let indice = indiceInicio; indice < vetor.length; indice++) {
            const elemento = vetor[indice];
            retorno = await funcao.chamar(interpretador, [retorno, elemento]);
            retorno = interpretador.resolverValor(retorno);
        }

        return retorno;
    },

    insira: (
        interpretador: InterpretadorPotigolInterface,
        vetor: Array<any[]>,
        posicao: number,
        elemento: any
    ): Promise<any[]> => {
        let copia = [...vetor];
        copia.splice(posicao - 1, 0, elemento);
        return Promise.resolve(copia);
    },
    inverta: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> => {
        let copia = [];
        for (let elemento of vetor) {
            copia.unshift(elemento);
        }
        return Promise.resolve(copia);
    },
    junte: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>, separador: string): Promise<any> =>
        Promise.resolve(vetor.join(separador)),
    mapeie: async (
        interpretador: InterpretadorPotigolInterface,
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'mapeie'.");
        }

        const retorno = [];
        for (let elemento of vetor) {
            let resultado = await funcao.chamar(interpretador, [elemento]);
            retorno.push(resultado);
        }

        return retorno;
    },
    ordene: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor.sort((a, b) => a - b)),
    pegue: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>, elementos: number): Promise<any> =>
        Promise.resolve(vetor.slice(0, elementos)),
    pegue_enquanto: async (
        interpretador: InterpretadorPotigolInterface,
        
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'pegue_enquanto'.");
        }

        const retorno = [];
        for (let elemento of vetor) {
            let resultado = await funcao.chamar(interpretador, [elemento]);
            let resultadoResolvido = interpretador.resolverValor(resultado);
            if (resultadoResolvido) {
                retorno.push(elemento);
            } else {
                break;
            }
        }

        return retorno;
    },
    posição: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>, elemento: any): Promise<any> =>
        Promise.resolve(vetor.indexOf(elemento) + 1),
    qual_tipo: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<string> =>
        Promise.resolve('Lista'),
    remova: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>, posicao: number): Promise<any> => {
        let copia = [...vetor];
        copia.splice(posicao - 1, 1);
        return Promise.resolve(copia);
    },
    selecione: async (
        interpretador: InterpretadorPotigolInterface,
        
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'selecione'.");
        }

        const retorno = [];
        for (let elemento of vetor) {
            if (await funcao.chamar(interpretador, [elemento])) {
                retorno.push(elemento);
            }
        }

        return retorno;
    },
    tamanho: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor.length),
    último: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor.length > 0 ? vetor[vetor.length - 1] : undefined),
    vazia: (interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor.length === 0),
};
