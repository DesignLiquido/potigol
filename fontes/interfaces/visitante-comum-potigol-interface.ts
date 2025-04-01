import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';

import { LeiaInteiro, LeiaInteiros, LeiaReais, LeiaReal, LeiaTexto, LeiaTextos, ReatribuicaoVariavel } from '../declaracoes';
import { QualTipo } from '../construtos/qual-tipo';

export interface VisitanteComumPotigolInterface extends VisitanteComumInterface {
    visitarDeclaracaoLeiaInteiro(declaracao: LeiaInteiro): Promise<any> | void;
    visitarDeclaracaoLeiaInteiros(declaracao: LeiaInteiros): Promise<any> | void;
    visitarDeclaracaoLeiaReais(declaracao: LeiaReais): Promise<any> | void;
    visitarDeclaracaoLeiaReal(declaracao: LeiaReal): Promise<any> | void;
    visitarDeclaracaoLeiaTexto(declaracao: LeiaTexto): Promise<any> | void;
    visitarDeclaracaoLeiaTextos(declaracao: LeiaTextos): Promise<any> | void;
    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): Promise<any> | void;
    visitarExpressaoQualTipo(expressao: QualTipo): Promise<string> | void;
}
