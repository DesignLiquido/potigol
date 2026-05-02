import { ConstrutoInterface, Leia, SimboloInterface } from '@designliquido/delegua';
import { uuidv4 } from '@designliquido/delegua/geracao-identificadores';

import { VisitanteComumPotigolInterface } from '../interfaces';

export class LeiaReais extends Leia {
    simbolo: SimboloInterface;
    id: string;
    argumentoCardinalidade?: ConstrutoInterface;

    constructor(simbolo: SimboloInterface, argumentoCardinalidade?: ConstrutoInterface, demaisArgumentos?: ConstrutoInterface[]) {
        super(simbolo, demaisArgumentos);
        this.simbolo = simbolo;
        this.id = uuidv4();
        this.argumentoCardinalidade = argumentoCardinalidade;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        const resultadosLidos = await visitante.visitarDeclaracaoLeiaReais(this);
        return resultadosLidos.map((numero: string) => Number(numero));
    }
}
