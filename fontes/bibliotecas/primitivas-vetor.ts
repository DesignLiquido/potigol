import { DeleguaFuncao, FuncaoPadrao } from '@designliquido/delegua/interpretador/estruturas';
import { InterpretadorPotigolInterface } from '../interfaces';

const primitivasVetor = {
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
        funcaoOuValorInicial: any,
        funcaoOpcional?: any
    ): Promise<any> => {
        const ehChamavel = (v: any) => v && typeof v.chamar === 'function';

        const executarInjete = async (
            interp: InterpretadorPotigolInterface,
            v: Array<any>,
            fn: DeleguaFuncao,
            ini: any
        ) => {
            if (v.length === 0 && ini === undefined) {
                return undefined;
            }
            let retorno: any = ini;
            let indiceInicio = 0;
            if (retorno === undefined) {
                retorno = v[0];
                indiceInicio = 1;
            }
            for (let indice = indiceInicio; indice < v.length; indice++) {
                const elemento = v[indice];
                retorno = await fn.chamar(interp, [retorno, elemento]);
                retorno = interp.resolverValor(retorno);
            }
            return retorno;
        };

        if (ehChamavel(funcaoOuValorInicial)) {
            return executarInjete(interpretador, vetor, funcaoOuValorInicial, funcaoOpcional);
        }

        if (ehChamavel(funcaoOpcional)) {
            return executarInjete(interpretador, vetor, funcaoOpcional, funcaoOuValorInicial);
        }

        if (funcaoOuValorInicial === undefined || funcaoOuValorInicial === null) {
            return Promise.reject("É necessário passar uma função para o método 'injete'.");
        }

        // Partial application: a.injete(valorInicial) → returns callable for a.injete(valorInicial)(funcao)
        const valorInicial = funcaoOuValorInicial;
        const vetorCapturado = vetor;
        return new FuncaoPadrao(1, async (interp: InterpretadorPotigolInterface, fn: any) => {
            if (!ehChamavel(fn)) {
                return Promise.reject("É necessário passar uma função para o método 'injete'.");
            }
            return executarInjete(interp, vetorCapturado, fn, valorInicial);
        });
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
            const resultado = await funcao.chamar(interpretador, [elemento]);
            const resolvido = interpretador.resolverValor
                ? interpretador.resolverValor(resultado)
                : resultado;
            if (resolvido) {
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
    primeiro: (_interpretador: InterpretadorPotigolInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor[0]),
    filtre: async (
        interpretador: InterpretadorPotigolInterface,
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'filtre'.");
        }
        const retorno = [];
        for (let elemento of vetor) {
            if (await funcao.chamar(interpretador, [elemento])) {
                retorno.push(elemento);
            }
        }
        return retorno;
    },
    reduza: async (
        interpretador: InterpretadorPotigolInterface,
        vetor: Array<any>,
        funcao: DeleguaFuncao,
        valorInicial?: any
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'reduza'.");
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
            retorno = await funcao.chamar(interpretador, [retorno, vetor[indice]]);
            retorno = interpretador.resolverValor(retorno);
        }
        return retorno;
    },
};

export default primitivasVetor;
