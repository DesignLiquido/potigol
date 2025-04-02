import { Leia } from "@designliquido/delegua";
import { VisitanteComumPotigolInterface } from "../interfaces";

export class LeiaInteiro extends Leia {
    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoLeiaInteiro(this);
    }
}
