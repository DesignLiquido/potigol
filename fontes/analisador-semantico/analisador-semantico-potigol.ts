import { AnalisadorSemanticoBase, PilhaVariaveis } from '@designliquido/delegua/analisador-semantico';
import { Const, Declaracao, Var, VarMultiplo } from '@designliquido/delegua/declaracoes';
import {
    DiagnosticoAnalisadorSemantico,
    DiagnosticoSeveridade,
    SimboloInterface,
} from '@designliquido/delegua/interfaces';
import { FuncaoHipoteticaInterface } from '@designliquido/delegua/interfaces/funcao-hipotetica-interface';
import { RetornoAnalisadorSemantico } from '@designliquido/delegua/interfaces/retornos/retorno-analisador-semantico';
import { VariavelHipoteticaInterface } from '@designliquido/delegua/interfaces/variavel-hipotetica-interface';

import { ReatribuicaoVariavel } from '../declaracoes';
import { VisitanteComumPotigolInterface } from '../interfaces';
import { LeiaInteiro, LeiaInteiros, LeiaReais, LeiaReal, LeiaTexto, LeiaTextos } from '../construtos';
import { Constante, TipoDe, Variavel } from '@designliquido/delegua';

export class AnalisadorSemanticoPotigol extends AnalisadorSemanticoBase implements VisitanteComumPotigolInterface {
    pilhaVariaveis: PilhaVariaveis;
    variaveis: { [nomeVariavel: string]: VariavelHipoteticaInterface };
    funcoes: { [nomeFuncao: string]: FuncaoHipoteticaInterface };
    atual: number;
    diagnosticos: DiagnosticoAnalisadorSemantico[];

    adicionarDiagnostico(
        simbolo: SimboloInterface,
        mensagem: string,
        severidade: DiagnosticoSeveridade = DiagnosticoSeveridade.ERRO
    ): void {
        this.diagnosticos.push({
            simbolo: simbolo,
            mensagem: mensagem,
            hashArquivo: simbolo.hashArquivo,
            linha: simbolo.linha,
            severidade: severidade,
        });
    }

    visitarDeclaracaoLeiaInteiro(declaracao: LeiaInteiro): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaInteiros(declaracao: LeiaInteiros): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaReais(declaracao: LeiaReais): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaReal(declaracao: LeiaReal): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaTexto(declaracao: LeiaTexto): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoLeiaTextos(declaracao: LeiaTextos): Promise<any> | void {
        return Promise.resolve();
    }

    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): void | Promise<any> {
        return Promise.resolve();
    }

    override visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        this.variaveis[declaracao.simbolo.lexema] = {
            tipo: declaracao.tipo as any,
            subtipo: undefined,
            imutavel: false,
            valor: undefined,
            valorDefinido: true,
        };

        return Promise.resolve();
    }

    override visitarDeclaracaoVar(declaracao: Var): Promise<any> {
        this.variaveis[declaracao.simbolo.lexema] = {
            tipo: declaracao.tipo as any,
            subtipo: undefined,
            imutavel: false,
            valor: undefined,
            valorDefinido: true,
        };

        return Promise.resolve();
    }

    override visitarExpressaoDeVariavel(expressao: Variavel | Constante): Promise<any> {
        if (!(expressao.simbolo.lexema in this.variaveis)) {
            this.adicionarDiagnostico(
                expressao.simbolo,
                `Variável '${expressao.simbolo.lexema}' ainda não foi declarada.`
            );
        }

        return Promise.resolve();
    }

    visitarExpressaoTipoDe(expressao: TipoDe<string>): Promise<string> {
        return Promise.resolve('');
    }

    analisar(declaracoes: Declaracao[]): RetornoAnalisadorSemantico {
        this.variaveis = {};
        this.atual = 0;
        this.diagnosticos = [];
        while (this.atual < declaracoes.length) {
            declaracoes[this.atual].aceitar(this);
            this.atual++;
        }

        return {
            diagnosticos: this.diagnosticos,
        } as RetornoAnalisadorSemantico;
    }
}
