import { DeleguaFuncao } from '@designliquido/delegua/estruturas/delegua-funcao';
import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';

export default {
    cabeça: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> => Promise.resolve(vetor[0]),
    cauda: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> => {
        let copia = [...vetor];
        copia.splice(0, 1);
        return Promise.resolve(copia);
    },
    contém: (interpretador: VisitanteComumInterface, vetor: Array<any>, elemento: any): Promise<any> =>
        Promise.resolve(vetor.includes(elemento)),
    descarte: (interpretador: VisitanteComumInterface, vetor: Array<any>, elementos: number): Promise<any> => {
        let copia = [...vetor];
        copia.splice(0, elementos);
        return Promise.resolve(copia);
    },
    descarte_enquanto: async (
        interpretador: VisitanteComumInterface,
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'descarte_enquanto'.");
        }

        const retorno = [...vetor];
        for (let elemento of vetor) {
            let resultado = await funcao.chamar(interpretador, [elemento]);
            if (resultado) {
                retorno.shift();
            } else {
                break;
            }
        }

        return retorno;
    },
    divida_quando: async (
        interpretador: VisitanteComumInterface,
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
            if (resultado) {
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
    imutável: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> => Promise.resolve(),
    injete: async (interpretador: VisitanteComumInterface, vetor: Array<any>, funcao: DeleguaFuncao): Promise<any> => {
        // TODO: Terminar
        /* if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'injete'.");
        }

        let retorno: any;
        for (let elemento of vetor) {
            retorno = await funcao.chamar(interpretador, [retorno, elemento]);
        }

        return retorno; */
        return Promise.resolve();
    },
    insira: (
        interpretador: VisitanteComumInterface,
        vetor: Array<any[]>,
        posicao: number,
        elemento: any
    ): Promise<any[]> => {
        let copia = [...vetor];
        copia.splice(posicao - 1, 0, elemento);
        return Promise.resolve(copia);
    },
    inverta: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> => {
        let copia = [];
        for (let elemento of vetor) {
            copia.unshift(elemento);
        }
        return Promise.resolve(copia);
    },
    junte: (interpretador: VisitanteComumInterface, vetor: Array<any>, separador: string): Promise<any> =>
        Promise.resolve(vetor.join(separador)),
    mapeie: async (interpretador: VisitanteComumInterface, vetor: Array<any>, funcao: DeleguaFuncao): Promise<any> => {
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
    ordene: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor.sort((a, b) => a - b)),
    pegue: (interpretador: VisitanteComumInterface, vetor: Array<any>, elementos: number): Promise<any> =>
        Promise.resolve(vetor.slice(0, elementos)),
    pegue_enquanto: async (
        interpretador: VisitanteComumInterface,
        vetor: Array<any>,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'pegue_enquanto'.");
        }

        const retorno = [];
        for (let elemento of vetor) {
            let resultado = await funcao.chamar(interpretador, [elemento]);
            if (resultado) {
                retorno.push(elemento);
            } else {
                break;
            }
        }

        return retorno;
    },
    posição: (interpretador: VisitanteComumInterface, vetor: Array<any>, elemento: any): Promise<any> =>
        Promise.resolve(vetor.indexOf(elemento) + 1),
    qual_tipo: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<string> => Promise.resolve('Lista'),
    remova: (interpretador: VisitanteComumInterface, vetor: Array<any>, posicao: number): Promise<any> => {
        let copia = [...vetor];
        copia.splice(posicao - 1, 1);
        return Promise.resolve(copia);
    },
    selecione: async (
        interpretador: VisitanteComumInterface,
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
    tamanho: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> => Promise.resolve(vetor.length),
    último: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor.length > 0 ? vetor[vetor.length - 1] : undefined),
    vazia: (interpretador: VisitanteComumInterface, vetor: Array<any>): Promise<any> =>
        Promise.resolve(vetor.length === 0),
};
