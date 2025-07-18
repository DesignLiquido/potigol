import { InterpretadorBase } from '@designliquido/delegua/interpretador';
import { AcessoMetodoOuPropriedade, Construto, FuncaoConstruto, Tupla } from '@designliquido/delegua/construtos';
import { Const } from '@designliquido/delegua/declaracoes';
import { DeleguaFuncao, ObjetoPadrao } from '@designliquido/delegua/interpretador/estruturas';

import { ReatribuicaoVariavel } from '../declaracoes';
import { InterpretadorPotigolInterface } from '../interfaces/interpretador-potigol-interface';
import { MicroLexadorPotigol } from '../lexador';
import { MicroAvaliadorSintaticoPotigol } from '../avaliador-sintatico/micro-avaliador-sintatico-potigol';
import { QualTipo } from '../construtos/qual-tipo';
import { LeiaInteiros, LeiaReais, LeiaTextos, LeiaInteiro, LeiaReal, LeiaTexto } from '../construtos';

import * as comum from './comum';

/**
 * Uma implementação do interpretador de Potigol.
 */
export class InterpretadorPotigol extends InterpretadorBase implements InterpretadorPotigolInterface {
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

    /**
     * Expressões como por exemplo `x = leia_real` dão a dica do tipo
     * da variável no inicializador, o que nos obriga a reescrever a visita à
     * declarações de constantes.
     * @param {Const} declaracao A declaração de constante.
     * @returns Nulo.
     */
    override async visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        const valorFinal = await this.avaliacaoDeclaracaoVarOuConst(declaracao);
        let tipoResolvido = declaracao.tipo;
        if (tipoResolvido === 'qualquer') {
            switch (declaracao.inicializador.constructor.name) {
                case 'LeiaInteiro':
                    tipoResolvido = 'inteiro';
                    break;
                case 'LeiaReal':
                    tipoResolvido = 'número';
                    break;
                case 'LeiaTexto':
                    tipoResolvido = 'texto';
                    break;
            }
        }

        this.pilhaEscoposExecucao.definirConstante(declaracao.simbolo.lexema, valorFinal, tipoResolvido);
        return null;
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

    async visitarDeclaracaoReatribuicaoVariavel(expressao: ReatribuicaoVariavel): Promise<any> {
        return comum.visitarDeclaracaoReatribuicaoVariavel(this, expressao);
    }

    override async visitarExpressaoAcessoMetodoOuPropriedade(expressao: AcessoMetodoOuPropriedade): Promise<any> {
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

    async visitarExpressaoQualTipo(expressao: QualTipo): Promise<string> {
        return comum.visitarExpressaoQualTipo(this, expressao);
    }

    override async visitarExpressaoTupla(expressao: Tupla): Promise<any> {
        return comum.visitarExpressaoTupla(this, expressao);
    }

    protected async avaliarArgumentosEscreva(argumentos: Construto[]): Promise<string> {
        return comum.avaliarArgumentosEscreva(this, argumentos.length > 0 ? argumentos[0] : undefined);
    }
}
