import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';

export default {
    arredonde: (interpretador: VisitanteComumInterface, numero: number): Promise<any> =>
        Promise.resolve(Math.ceil(numero)),
    caractere: (interpretador: VisitanteComumInterface, numero: number): Promise<any> =>
        Promise.resolve(String.fromCharCode(numero)),
    inteiro: (interpretador: VisitanteComumInterface, numero: number): Promise<any> =>
        Promise.resolve(Math.floor(numero)),
    formato: (interpretador: VisitanteComumInterface, numero: number, mascara: string): Promise<any> =>
        Promise.resolve(),
    qual_tipo: (interpretador: VisitanteComumInterface, numero: number): Promise<any> =>
        Promise.resolve(Math.floor(numero) === numero ? 'Inteiro' : 'Real'),
    piso: (interpretador: VisitanteComumInterface, numero: number): Promise<any> => Promise.resolve(Math.floor(numero)),
    real: (interpretador: VisitanteComumInterface, numero: number): Promise<any> => Promise.resolve(numero),
    teto: (interpretador: VisitanteComumInterface, numero: number): Promise<any> => Promise.resolve(Math.ceil(numero)),
    texto: (interpretador: VisitanteComumInterface, numero: number): Promise<any> => Promise.resolve(String(numero)),
};
