import { QualTipo } from '@designliquido/delegua/construtos';
import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';

import { ReatribuicaoVariavel } from '../declaracoes/reatribuicao-variavel';

export interface VisitanteComumPotigolInterface extends VisitanteComumInterface {
    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): Promise<any> | void;
    visitarExpressaoQualTipo(expressao: QualTipo): Promise<string> | void;
}
