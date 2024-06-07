import { InterpretadorInterface } from '@designliquido/delegua';
import { QualTipo } from '@designliquido/delegua/construtos';
import { MicroAvaliadorSintaticoBase } from '@designliquido/delegua/avaliador-sintatico/micro-avaliador-sintatico-base';

import { MicroLexadorPotigol } from '../lexador';

export interface InterpretadorPotigolInterface extends InterpretadorInterface {
    microLexador: MicroLexadorPotigol;
    microAvaliadorSintatico: MicroAvaliadorSintaticoBase;
    regexInterpolacao: RegExp;
    visitarExpressaoQualTipo(expressao: QualTipo): Promise<string>;
}
