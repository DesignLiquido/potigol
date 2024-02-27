import { registrarBibliotecaGlobalPotigol } from '@designliquido/delegua/bibliotecas/dialetos/potigol/biblioteca-global';
import { AcessoMetodoOuPropriedade, Construto, QualTipo } from '@designliquido/delegua/construtos';
import { InterpretadorComDepuracao } from '@designliquido/delegua/interpretador/interpretador-com-depuracao';

import * as comum from './comum';
import { LeiaMultiplo } from '@designliquido/delegua';

export class InterpretadorPotigolComDepuracao extends InterpretadorComDepuracao {
    constructor(diretorioBase: string, funcaoDeRetorno: Function = null, funcaoDeRetornoMesmaLinha: Function = null) {
        super(diretorioBase, funcaoDeRetorno, funcaoDeRetornoMesmaLinha);
        this.expandirPropriedadesDeObjetosEmEspacoVariaveis = true;
        this.regexInterpolacao = /{(.*?)}/g;

        registrarBibliotecaGlobalPotigol(this, this.pilhaEscoposExecucao);
    }

    protected async resolverInterpolacoes(textoOriginal: string, linha: number): Promise<any[]> {
        return comum.resolverInterpolacoes(this, textoOriginal, linha);
    }

    protected retirarInterpolacao(texto: string, variaveis: any[]): string {
        return comum.retirarInterpolacao(texto, variaveis);
    }

    async visitarExpressaoAcessoMetodo(expressao: AcessoMetodoOuPropriedade): Promise<any> {
        return comum.visitarExpressaoAcessoMetodo(this, expressao);
    }

    async visitarExpressaoLeiaMultiplo(expressao: LeiaMultiplo): Promise<any> {
        return comum.visitarExpressaoLeiaMultiplo(this, expressao);
    }

    async visitarExpressaoQualTipo(expressao: QualTipo): Promise<string> {
        return comum.visitarExpressaoQualTipo(this, expressao);
    }

    async avaliarArgumentosEscreva(argumentos: Construto[]): Promise<string> {
        return comum.avaliarArgumentosEscreva(this, argumentos);
    }
}
