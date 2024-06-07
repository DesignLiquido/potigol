
import { InterpretadorBase } from '@designliquido/delegua/interpretador';
import {
    AcessoMetodoOuPropriedade,
    Construto,
    QualTipo,
    Tupla
} from '@designliquido/delegua/construtos';
import { ObjetoPadrao } from '@designliquido/delegua/estruturas';
import { LeiaMultiplo } from '@designliquido/delegua/declaracoes';

import { InterpretadorPotigolInterface } from '../interfaces/interpretador-potigol-interface';
import { MicroLexadorPotigol } from '../lexador';
import { MicroAvaliadorSintaticoPotigol } from '../avaliador-sintatico/micro-avaliador-sintatico-potigol';

import * as comum from './comum';

/**
 * Uma implementação do interpretador de Potigol.
 */
export class InterpretadorPotigol 
    extends InterpretadorBase 
    implements InterpretadorPotigolInterface 
{
    constructor(
        diretorioBase: string,
        performance = false,
        funcaoDeRetorno: Function = null,
        funcaoDeRetornoMesmaLinha: Function = null
    ) {
        super(diretorioBase, performance, funcaoDeRetorno, funcaoDeRetornoMesmaLinha);
        this.expandirPropriedadesDeObjetosEmEspacoVariaveis = true;
        this.regexInterpolacao = /{(.*?)}/g;

        this.microLexador = new MicroLexadorPotigol();
        this.microAvaliadorSintatico = new MicroAvaliadorSintaticoPotigol(-1) as any;

        comum.carregarBibliotecaGlobal(this.pilhaEscoposExecucao);
    }

    paraTexto(objeto: any) {
        if (objeto === null || objeto === undefined) return 'nulo';
        if (typeof objeto === 'boolean') {
            return objeto ? 'verdadeiro' : 'falso';
        }

        if (objeto instanceof Date) {
            const formato = Intl.DateTimeFormat('pt', {
                dateStyle: 'full',
                timeStyle: 'full',
            });
            return formato.format(objeto);
        }

        if (Array.isArray(objeto)) return `[${objeto.join(', ')}]`;
        if (objeto.valor instanceof ObjetoPadrao) return objeto.valor.paraTexto();
        if (typeof objeto === 'object') return JSON.stringify(objeto);

        return objeto.toString();
    }

    protected async resolverInterpolacoes(textoOriginal: string, linha: number): Promise<any[]> {
        return comum.resolverInterpolacoes(this, textoOriginal, linha);
    }

    protected retirarInterpolacao(texto: string, variaveis: any[]): string {
        return comum.retirarInterpolacao(texto, variaveis);
    }

    override async visitarExpressaoAcessoMetodo(expressao: AcessoMetodoOuPropriedade): Promise<any> {
        return comum.visitarExpressaoAcessoMetodo(this, expressao);
    }

    override async visitarExpressaoLeiaMultiplo(expressao: LeiaMultiplo): Promise<any> {
        return comum.visitarExpressaoLeiaMultiplo(this, expressao);
    }

    override async visitarExpressaoQualTipo(expressao: QualTipo): Promise<string> {
        return comum.visitarExpressaoQualTipo(this, expressao);
    }
    
    override async visitarExpressaoTupla(expressao: Tupla): Promise<any> {
        return comum.visitarExpressaoTupla(this, expressao);
    }

    protected async avaliarArgumentosEscreva(argumentos: Construto[]): Promise<string> {
        return comum.avaliarArgumentosEscreva(this, argumentos.length > 0 ? argumentos[0] : undefined);
    }
}
