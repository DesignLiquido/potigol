import { AcessoMetodoOuPropriedade, Construto } from '@designliquido/delegua/construtos';
import { InterpretadorComDepuracao } from '@designliquido/delegua/interpretador/interpretador-com-depuracao';

import { InterpretadorPotigolInterface } from '../interfaces';
import {
    LeiaInteiro,
    LeiaInteiros,
    LeiaReais,
    LeiaReal,
    LeiaTexto,
    LeiaTextos,
    ReatribuicaoVariavel,
} from '../declaracoes';
import { QualTipo } from '../construtos';

import * as comum from './comum';

export class InterpretadorPotigolComDepuracao
    extends InterpretadorComDepuracao
    implements InterpretadorPotigolInterface
{
    constructor(diretorioBase: string, funcaoDeRetorno: Function = null, funcaoDeRetornoMesmaLinha: Function = null) {
        super(diretorioBase, funcaoDeRetorno, funcaoDeRetornoMesmaLinha);
        this.expandirPropriedadesDeObjetosEmEspacoVariaveis = true;
        this.regexInterpolacao = /{(.*?)}/g;

        comum.carregarBibliotecaGlobal(this.pilhaEscoposExecucao);
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

    async visitarExpressaoQualTipo(expressao: QualTipo): Promise<string> {
        return comum.visitarExpressaoQualTipo(this, expressao);
    }

    async avaliarArgumentosEscreva(argumentos: Construto[]): Promise<string> {
        return comum.avaliarArgumentosEscreva(this, argumentos.length > 0 ? argumentos[0] : undefined);
    }
}
