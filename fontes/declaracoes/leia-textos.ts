import { Construto } from "@designliquido/delegua/construtos";
import { Leia } from "@designliquido/delegua/declaracoes";
import { SimboloInterface } from "@designliquido/delegua/interfaces";
import { uuidv4 } from "@designliquido/delegua/geracao-identificadores";

import { VisitanteComumPotigolInterface } from "../interfaces";

/**
 * Declaração que pede a leitura de várias informações pela entrada
 * configurada no início da aplicação (por exemplo, o console).
 */
export class LeiaTextos extends Leia {
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
        return await visitante.visitarDeclaracaoLeiaTextos(this);
    }
}