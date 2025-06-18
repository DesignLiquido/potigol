import { Leia } from '@designliquido/delegua';
import { VisitanteComumPotigolInterface } from '../interfaces';

export class LeiaTexto extends Leia {
    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoLeiaTexto(this);
    }
}
