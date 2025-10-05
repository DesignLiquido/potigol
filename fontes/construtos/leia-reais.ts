import { Construto, Leia, SimboloInterface } from '@designliquido/delegua';
import { uuidv4 } from '@designliquido/delegua/geracao-identificadores';

import { VisitanteComumPotigolInterface } from '../interfaces';

export class LeiaReais extends Leia {
    simbolo: SimboloInterface;
    id: string;
    argumentoCardinalidade?: Construto;

    constructor(simbolo: SimboloInterface, argumentoCardinalidade?: Construto, demaisArgumentos?: Construto[]) {
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
