import { Declaracao } from '@designliquido/delegua/declaracoes';
import { SimboloInterface } from '@designliquido/delegua/interfaces';

import { VisitanteComumPotigolInterface } from '../interfaces';

export class AliasTipo extends Declaracao {
    simbolo: SimboloInterface;
    tipoOriginal: string;

    constructor(simbolo: SimboloInterface, tipoOriginal: string) {
        super(Number(simbolo.linha), simbolo.hashArquivo);
        this.simbolo = simbolo;
        this.tipoOriginal = tipoOriginal;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoAliasTipo(this);
    }

    paraTexto(): string {
        return `<alias-tipo ${this.simbolo.lexema}=${this.tipoOriginal} />`;
    }
}