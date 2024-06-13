import { MicroAvaliadorSintaticoBase } from '@designliquido/delegua/avaliador-sintatico/micro-avaliador-sintatico-base';
import { Const, ConstMultiplo, Var, VarMultiplo } from '@designliquido/delegua/declaracoes';
import { InterpretadorInterface, VariavelInterface } from '@designliquido/delegua/interfaces';

import { ReatribuicaoVariavel } from '../declaracoes';
import { MicroLexadorPotigol } from '../lexador';
import { VisitanteComumPotigolInterface } from './visitante-comum-potigol-interface';

export interface InterpretadorPotigolInterface extends InterpretadorInterface, VisitanteComumPotigolInterface {
    microLexador: MicroLexadorPotigol;
    microAvaliadorSintatico: MicroAvaliadorSintaticoBase;
    regexInterpolacao: RegExp;
    avaliacaoDeclaracaoVarOuConst(declaracao: Const | ConstMultiplo | Var | VarMultiplo | ReatribuicaoVariavel): Promise<any>
    eIgual(esquerda: VariavelInterface | any, direita: VariavelInterface | any): boolean
}
