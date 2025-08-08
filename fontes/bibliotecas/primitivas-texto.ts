import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';

export default {
    cabeça: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(texto[0]),
    cauda: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(texto.substring(1)),
    contém: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string, caractere: string): Promise<any> =>
        Promise.resolve(texto.includes(caractere)),
    descarte: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string, posicao: number): Promise<any> =>
        Promise.resolve(texto.substring(posicao)),
    descarte_enquanto: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(''),
    divida: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string, separador: string = ' '): Promise<any> =>
        Promise.resolve(texto.split(separador)),
    injete: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(''),
    insira: (
        interpretador: VisitanteComumInterface,
        nomePrimitiva: string,
        texto: string,
        posicao: number,
        elemento: string
    ): Promise<any> => {
        let vetor = texto.split('');
        vetor.splice(posicao - 1, 0, elemento);
        return Promise.resolve(vetor.join(''));
    },
    inteiro: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> =>
        Promise.resolve(Math.floor(Number(texto))),
    inverta: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> =>
        Promise.resolve(texto.split('').reduce((texto, caracter) => (texto = caracter + texto), '')),
    junte: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string, separador: string): Promise<any> =>
        Promise.resolve(texto.split('').join(separador)),
    lista: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(texto.split('')),
    maiúsculo: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> =>
        Promise.resolve(texto.toUpperCase()),
    minúsculo: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> =>
        Promise.resolve(texto.toLowerCase()),
    ordene: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> =>
        Promise.resolve(texto.split('').sort().join('')),
    qual_tipo: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve('Texto'),
    pegue: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string, caracteres: number): Promise<any> =>
        Promise.resolve(texto.substring(0, caracteres)),
    pegue_enquanto: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(''),
    posição: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string, caractere: string): Promise<any> =>
        Promise.resolve(texto.indexOf(caractere) + 1),
    real: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(Number(texto)),
    remova: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string, posicao: number): Promise<any> => {
        let vetor = texto.split('');
        vetor.splice(posicao - 1, 1);
        return Promise.resolve(vetor.join(''));
    },
    selecione: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(''),
    tamanho: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> => Promise.resolve(texto.length),
    último: (interpretador: VisitanteComumInterface, nomePrimitiva: string, texto: string): Promise<any> =>
        Promise.resolve(texto.length > 0 ? texto[texto.length - 1] : ''),
};
