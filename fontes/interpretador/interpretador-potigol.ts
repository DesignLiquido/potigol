import { InterpretadorBase } from '@designliquido/delegua/interpretador';
import {
    AcessoMetodoOuPropriedade,
    FuncaoConstruto, TipoDe, Tupla
} from '@designliquido/delegua/construtos';
import { Classe, Const, Escolha } from '@designliquido/delegua/declaracoes';
import { DeleguaFuncao, DescritorTipoClasse, ObjetoPadrao } from '@designliquido/delegua/interpretador/estruturas';
import { ConstrutoInterface } from '@designliquido/delegua';

import { AliasTipo, ParaGere, ReatribuicaoVariavel } from '../declaracoes';
import { InterpretadorPotigolInterface } from '../interfaces/interpretador-potigol-interface';
import { MicroLexadorPotigol } from '../lexador';
import { MicroAvaliadorSintaticoPotigol } from '../avaliador-sintatico/micro-avaliador-sintatico-potigol';
import { LeiaInteiros, LeiaReais, LeiaTextos, LeiaInteiro, LeiaReal, LeiaTexto } from '../construtos';
import { EstruturaCubo, EstruturaMatriz } from './estruturas';

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
        this.expandirPropriedadesDeObjetosEmEspacoMemoria = true;
        this.regexInterpolacao = /{(.*?)}/g;

        this.microLexador = new MicroLexadorPotigol();
        this.microAvaliadorSintatico = new MicroAvaliadorSintaticoPotigol(-1) as any;

        comum.carregarBibliotecaGlobal(this.pilhaEscoposExecucao);
    }

    override resolverValor(objeto: any) {
        return comum.resolverValor(objeto);
    }

    override async visitarDeclaracaoClasse(declaracao: Classe): Promise<DescritorTipoClasse> {
        return comum.visitarDeclaracaoClasse(this, declaracao);
    }

    override async visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        return comum.visitarDeclaracaoConst(this, declaracao);
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

    async visitarVetor(expressao: any): Promise<any> {
        const valores = [];
        for (const elemento of expressao.valores) {
            if (elemento && elemento.valores && Array.isArray(elemento.valores)) {
                // It's a Vetor-like object
                const subvalores = [];
                for (const subelemento of elemento.valores) {
                    subvalores.push(await this.avaliar(subelemento));
                }
                valores.push(subvalores);
            } else {
                valores.push(await this.avaliar(elemento));
            }
        }

        // Check if this is a matrix (2D array)
        if (valores.length > 0 && Array.isArray(valores[0])) {
            // Check if it's a cube (3D array)
            if (valores[0].length > 0 && Array.isArray(valores[0][0])) {
                return new EstruturaCubo(valores);
            }
            return new EstruturaMatriz(valores);
        }

        return valores;
    }

    override async avaliar(expressao: any): Promise<any> {
        if (expressao && expressao.constructor && expressao.constructor.name === 'Vetor') {
            return this.visitarVetor(expressao);
        }
        return super.avaliar(expressao);
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

        if (objeto instanceof EstruturaMatriz || objeto instanceof EstruturaCubo) {
            return objeto.paraTexto();
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

    async visitarExpressaoTipoDe(expressao: TipoDe): Promise<string> {
        return comum.visitarExpressaoTipoDe(this, expressao);
    }

    override async visitarExpressaoTupla(expressao: Tupla): Promise<any> {
        return comum.visitarExpressaoTupla(this, expressao);
    }

    protected async avaliarArgumentosEscreva(argumentos: ConstrutoInterface[]): Promise<string> {
        return comum.avaliarArgumentosEscreva(this, argumentos.length > 0 ? argumentos[0] : undefined);
    }
}
