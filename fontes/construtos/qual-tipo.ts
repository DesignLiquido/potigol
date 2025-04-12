import { Construto } from '@designliquido/delegua/construtos';
import { SimboloInterface } from '@designliquido/delegua/interfaces';

import { VisitanteComumPotigolInterface } from '../interfaces';

// TODO: Depreciado. Priorizar `TipoDe`.
export class QualTipo<TTipoSimbolo extends string = string> implements Construto {
    linha: number;
    hashArquivo: number;
    valor: any;

    simbolo: SimboloInterface<TTipoSimbolo>;

    constructor(hashArquivo: number, simbolo: SimboloInterface<TTipoSimbolo>, valor: any) {
        this.linha = Number(simbolo.linha);
        this.hashArquivo = hashArquivo;
        this.valor = valor;
        this.simbolo = simbolo;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return visitante.visitarExpressaoQualTipo(this);
    }
}
