import { Declaracao } from '@designliquido/delegua/declaracoes';
import { ConstrutoInterface, SimboloInterface } from '@designliquido/delegua/interfaces';

import { VisitanteComumPotigolInterface } from '../interfaces';

export class AtribuicaoParalelaVariavel extends Declaracao {
    simbolos: SimboloInterface[];
    inicializadores: ConstrutoInterface[];

    constructor(simbolos: SimboloInterface[], inicializadores: ConstrutoInterface[]) {
        super(Number(simbolos[0].linha), simbolos[0].hashArquivo);
        this.simbolos = simbolos;
        this.inicializadores = inicializadores;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoAtribuicaoParalelaVariavel(this);
    }

    paraTexto(): string {
        return `<atribuição-paralela-variável />`;
    }
}
