import { InterpretadorPotigolInterface } from '../interfaces';

const primitivasCubo = {
    camadas: (interpretador: InterpretadorPotigolInterface, cubo: any): Promise<any> =>
        Promise.resolve(cubo.camadas()),

    linhas: (interpretador: InterpretadorPotigolInterface, cubo: any): Promise<any> =>
        Promise.resolve(cubo.linhas()),

    colunas: (interpretador: InterpretadorPotigolInterface, cubo: any): Promise<any> =>
        Promise.resolve(cubo.colunas()),

    obter: (interpretador: InterpretadorPotigolInterface, cubo: any, camada: number, linha: number, coluna: number): Promise<any> =>
        Promise.resolve(cubo.obter(camada, linha, coluna)),

    definir: (interpretador: InterpretadorPotigolInterface, cubo: any, camada: number, linha: number, coluna: number, valor: any): Promise<any> => {
        cubo.definir(camada, linha, coluna, valor);
        return Promise.resolve(cubo);
    }
};

export default primitivasCubo;
