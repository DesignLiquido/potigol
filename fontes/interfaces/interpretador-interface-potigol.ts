import { QualTipo } from '@designliquido/delegua/construtos';

import { VisitanteComumInterface } from '@designliquido/delegua/interfaces/visitante-comum-interface';

export interface InterpretadorInterfacePotigol extends VisitanteComumInterface {
    visitarExpressaoQualTipo(expressao: QualTipo): Promise<string>;
}
