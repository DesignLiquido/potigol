import { InterpretadorInterface } from '@designliquido/delegua/interfaces';
import { DeleguaFuncao } from '@designliquido/delegua/interpretador/estruturas';
import { InterpretadorPotigolInterface } from '../interfaces';

export default {
    cabeça: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> => Promise.resolve(texto[0]),
    cauda: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> => Promise.resolve(texto.substring(1)),
    contém: (interpretador: InterpretadorPotigolInterface, texto: string, caractere: string): Promise<any> =>
        Promise.resolve(texto.includes(caractere)),
    descarte: (interpretador: InterpretadorPotigolInterface, texto: string, posicao: number): Promise<any> =>
        Promise.resolve(texto.substring(posicao)),
    descarte_enquanto: async (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'descarte_enquanto'.");
        }

        const vetor = texto.split('');
        let indice = 0;
        while (indice < vetor.length) {
            const resultado = await funcao.chamar(interpretador, [vetor[indice] as any]);
            const resolvido = interpretador.resolverValor
                ? interpretador.resolverValor(resultado)
                : resultado;

            if (!resolvido) {
                break;
            }

            indice++;
        }

        return Promise.resolve(vetor.slice(indice).join(''));
    },
    divida: (interpretador: InterpretadorPotigolInterface, texto: string, separador?: string): Promise<any> =>
        Promise.resolve(texto.split(separador !== undefined ? separador : ' ')),
    injete: async (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        funcao: DeleguaFuncao,
        valorInicial?: any
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'injete'.");
        }

        const vetor = texto.split('');
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
            retorno = interpretador.resolverValor
                ? interpretador.resolverValor(retorno)
                : retorno;
        }

        return Promise.resolve(retorno);
    },
    insira: (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        posicao: number,
        elemento: string
    ): Promise<any> => {
        let vetor = texto.split('');
        vetor.splice(posicao - 1, 0, elemento);
        return Promise.resolve(vetor.join(''));
    },
    inteiro: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> =>
        Promise.resolve(Math.floor(Number(texto))),
    inverta: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> =>
        Promise.resolve(texto.split('').reduce((texto, caracter) => (texto = caracter + texto), '')),
    junte: (interpretador: InterpretadorPotigolInterface, texto: string, separador: string): Promise<any> =>
        Promise.resolve(texto.split('').join(separador)),
    lista: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> => Promise.resolve(texto.split('')),
    maiúsculo: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> =>
        Promise.resolve(texto.toUpperCase()),
    minúsculo: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> =>
        Promise.resolve(texto.toLowerCase()),
    ordene: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> =>
        Promise.resolve(texto.split('').sort().join('')),
    qual_tipo: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> => Promise.resolve('Texto'),
    pegue: (interpretador: InterpretadorPotigolInterface, texto: string, caracteres: number): Promise<any> =>
        Promise.resolve(texto.substring(0, caracteres)),
    pegue_enquanto: async (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'pegue_enquanto'.");
        }

        const vetor = texto.split('');
        const retorno: string[] = [];
        for (let indice = 0; indice < vetor.length; indice++) {
            const resultado = await funcao.chamar(interpretador, [vetor[indice] as any]);
            const resolvido = interpretador.resolverValor
                ? interpretador.resolverValor(resultado)
                : resultado;

            if (!resolvido) {
                break;
            }

            retorno.push(vetor[indice]);
        }

        return Promise.resolve(retorno.join(''));
    },
    posição: (interpretador: InterpretadorPotigolInterface, texto: string, caractere: string): Promise<any> =>
        Promise.resolve(texto.indexOf(caractere) + 1),
    real: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> => Promise.resolve(Number(texto)),
    remova: (interpretador: InterpretadorPotigolInterface, texto: string, posicao: number): Promise<any> => {
        let vetor = texto.split('');
        vetor.splice(posicao - 1, 1);
        return Promise.resolve(vetor.join(''));
    },
    selecione: async (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'selecione'.");
        }

        const vetor = texto.split('');
        const retorno: string[] = [];
        for (let indice = 0; indice < vetor.length; indice++) {
            const resultado = await funcao.chamar(interpretador, [vetor[indice] as any]);
            const resolvido = interpretador.resolverValor
                ? interpretador.resolverValor(resultado)
                : resultado;

            if (resolvido) {
                retorno.push(vetor[indice]);
            }
        }

        return Promise.resolve(retorno.join(''));
    },
    tamanho: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> => Promise.resolve(texto.length),
    último: (interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> =>
        Promise.resolve(texto.length > 0 ? texto[texto.length - 1] : ''),
    primeiro: (_interpretador: InterpretadorPotigolInterface, texto: string): Promise<any> =>
        Promise.resolve(texto.length > 0 ? texto[0] : ''),
    filtre: async (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'filtre'.");
        }
        const vetor = texto.split('');
        const retorno: string[] = [];
        for (let indice = 0; indice < vetor.length; indice++) {
            const resultado = await funcao.chamar(interpretador, [vetor[indice] as any]);
            const resolvido = interpretador.resolverValor
                ? interpretador.resolverValor(resultado)
                : resultado;
            if (resolvido) {
                retorno.push(vetor[indice]);
            }
        }
        return Promise.resolve(retorno.join(''));
    },
    reduza: async (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        funcao: DeleguaFuncao,
        valorInicial?: any
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'reduza'.");
        }
        const vetor = texto.split('');
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
            retorno = interpretador.resolverValor
                ? interpretador.resolverValor(retorno)
                : retorno;
        }
        return Promise.resolve(retorno);
    },
    mapeie: async (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        funcao: DeleguaFuncao
    ): Promise<any> => {
        if (funcao === undefined || funcao === null) {
            return Promise.reject("É necessário passar uma função para o método 'mapeie'.");
        }
        const vetor = texto.split('');
        const retorno: any[] = [];
        for (const elemento of vetor) {
            const resultado = await funcao.chamar(interpretador, [elemento as any]);
            const resolvido = interpretador.resolverValor
                ? interpretador.resolverValor(resultado)
                : resultado;
            retorno.push(resolvido);
        }
        return Promise.resolve(retorno);
    },
    zip: (
        interpretador: InterpretadorPotigolInterface,
        texto: string,
        outro: string | Array<any>
    ): Promise<any> => {
        const vetor1 = texto.split('');
        const vetor2 = typeof outro === 'string' ? outro.split('') : outro;
        const tamanho = Math.min(vetor1.length, vetor2.length);
        const retorno: any[][] = [];
        for (let i = 0; i < tamanho; i++) {
            retorno.push([vetor1[i], vetor2[i]]);
        }
        return Promise.resolve(retorno);
    },
};
