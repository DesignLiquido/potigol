import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';

import { AliasTipo, ReatribuicaoVariavel } from '../declaracoes';
import { LeiaInteiro, LeiaInteiros, LeiaReais, LeiaReal, LeiaTexto, LeiaTextos } from '../construtos';

export interface VisitanteComumPotigolInterface extends VisitanteComumInterface {
    visitarDeclaracaoAliasTipo(declaracao: AliasTipo): Promise<any> | void;
    visitarDeclaracaoLeiaInteiro(declaracao: LeiaInteiro): Promise<any> | void;
    visitarDeclaracaoLeiaInteiros(declaracao: LeiaInteiros): Promise<any> | void;
    visitarDeclaracaoLeiaReais(declaracao: LeiaReais): Promise<any> | void;
    visitarDeclaracaoLeiaReal(declaracao: LeiaReal): Promise<any> | void;
    visitarDeclaracaoLeiaTexto(declaracao: LeiaTexto): Promise<any> | void;
    visitarDeclaracaoLeiaTextos(declaracao: LeiaTextos): Promise<any> | void;
    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): Promise<any> | void;
}
