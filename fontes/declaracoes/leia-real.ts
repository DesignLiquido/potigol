import { Leia } from "@designliquido/delegua";
import { VisitanteComumPotigolInterface } from "../interfaces";

export class LeiaReal extends Leia {
    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoLeiaReal(this);
    }
}
