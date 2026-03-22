import { AcessoMetodoOuPropriedade, Construto, FuncaoConstruto, TipoDe } from '@designliquido/delegua/construtos';
import { InterpretadorBaseComDepuracao } from '@designliquido/delegua/interpretador/depuracao/interpretador-base-com-depuracao';
import { DeleguaFuncao, DescritorTipoClasse } from '@designliquido/delegua/interpretador/estruturas';
import { Classe, Const, Escolha } from '@designliquido/delegua/declaracoes';

import { InterpretadorPotigolInterface } from '../interfaces';
import { AliasTipo, ParaGere, ReatribuicaoVariavel } from '../declaracoes';
import { LeiaInteiro, LeiaInteiros, LeiaReais, LeiaReal, LeiaTexto, LeiaTextos } from '../construtos';

import * as comum from './comum';

export class InterpretadorPotigolComDepuracao
    extends InterpretadorBaseComDepuracao
    implements InterpretadorPotigolInterface
{
    constructor(diretorioBase: string, funcaoDeRetorno: Function = null, funcaoDeRetornoMesmaLinha: Function = null) {
        super(diretorioBase, funcaoDeRetorno, funcaoDeRetornoMesmaLinha);
        this.expandirPropriedadesDeObjetosEmEspacoMemoria = true;
        this.regexInterpolacao = /{(.*?)}/g;

        comum.carregarBibliotecaGlobal(this.pilhaEscoposExecucao);
    }

    override resolverValor(objeto: any) {
        return comum.resolverValor(objeto);
    }

    override async visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        return comum.visitarDeclaracaoConst(this, declaracao);
    }

    override async visitarDeclaracaoClasse(declaracao: Classe): Promise<DescritorTipoClasse> {
        return comum.visitarDeclaracaoClasse(this, declaracao);
    }

    override async visitarDeclaracaoEscolha(declaracao: Escolha): Promise<any> {
        return comum.visitarDeclaracaoEscolhaComGuarda(this, declaracao);
    }

    visitarDeclaracaoAliasTipo(declaracao: AliasTipo): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoParaGere(declaracao: ParaGere): Promise<any> | void {
        return comum.visitarDeclaracaoParaGere(this, declaracao);
    }

    visitarDeclaracaoLeiaInteiros(declaracao: LeiaInteiros): Promise<any> | void {
        return comum.visitarExpressaoLeiaMultiplo(this, declaracao);
    }

    visitarDeclaracaoLeiaReais(declaracao: LeiaReais): Promise<any> | void {
        return comum.visitarExpressaoLeiaMultiplo(this, declaracao);
    }

    visitarDeclaracaoLeiaTextos(declaracao: LeiaTextos): Promise<any> | void {
        return comum.visitarExpressaoLeiaMultiplo(this, declaracao);
    }

    visitarDeclaracaoLeiaInteiro(declaracao: LeiaInteiro): Promise<any> | void {
        return comum.visitarExpressaoLeia(this, declaracao);
    }

    visitarDeclaracaoLeiaReal(declaracao: LeiaReal): Promise<any> | void {
        return comum.visitarExpressaoLeia(this, declaracao);
    }

    visitarDeclaracaoLeiaTexto(declaracao: LeiaTexto): Promise<any> | void {
        return comum.visitarExpressaoLeia(this, declaracao);
    }

    protected async resolverInterpolacoes(textoOriginal: string, linha: number): Promise<any[]> {
        return comum.resolverInterpolacoes(this, textoOriginal, linha);
    }

    protected retirarInterpolacao(texto: string, variaveis: any[]): string {
        return comum.retirarInterpolacao(texto, variaveis);
    }

    async visitarDeclaracaoReatribuicaoVariavel(expressao: ReatribuicaoVariavel): Promise<any> {
        return comum.visitarDeclaracaoReatribuicaoVariavel(this, expressao);
    }

    async visitarExpressaoAcessoMetodoOuPropriedade(expressao: AcessoMetodoOuPropriedade): Promise<any> {
        return comum.visitarExpressaoAcessoMetodoOuPropriedade(this, expressao);
    }

    override async visitarExpressaoBinaria(expressao: any): Promise<any> {
        return comum.visitarExpressaoBinaria(this, expressao);
    }

    override async visitarExpressaoFuncaoConstruto(
        funcaoConstruto: FuncaoConstruto
    ): Promise<DeleguaFuncao> {
        return comum.visitarExpressaoFuncaoConstruto(this, funcaoConstruto);
    }

    async visitarExpressaoTipoDe(expressao: TipoDe): Promise<string> {
        return comum.visitarExpressaoTipoDe(this, expressao);
    }

    async avaliarArgumentosEscreva(argumentos: Construto[]): Promise<string> {
        return comum.avaliarArgumentosEscreva(this, argumentos.length > 0 ? argumentos[0] : undefined);
    }
}
