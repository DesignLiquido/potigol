import { DeleguaFuncao } from '@designliquido/delegua/interpretador/estruturas';
import { InterpretadorPotigolInterface } from '../interfaces';

const primitivasMatriz = {
    linhas: (interpretador: InterpretadorPotigolInterface, matriz: any): Promise<any> =>
        Promise.resolve(matriz.linhas()),

    colunas: (interpretador: InterpretadorPotigolInterface, matriz: any): Promise<any> =>
        Promise.resolve(matriz.colunas()),

    obter: (interpretador: InterpretadorPotigolInterface, matriz: any, linha: number, coluna: number): Promise<any> =>
        Promise.resolve(matriz.obter(linha, coluna)),

    definir: (interpretador: InterpretadorPotigolInterface, matriz: any, linha: number, coluna: number, valor: any): Promise<any> => {
        matriz.definir(linha, coluna, valor);
        return Promise.resolve(matriz);
    }
};

export default primitivasMatriz;