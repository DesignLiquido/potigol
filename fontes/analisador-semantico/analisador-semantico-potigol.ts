import { AnalisadorSemanticoBase, PilhaVariaveis } from '@designliquido/delegua/analisador-semantico';
import { QualTipo } from '@designliquido/delegua/construtos';
import { Const, Declaracao, Var } from '@designliquido/delegua/declaracoes';
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

    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): void | Promise<any> {
        return Promise.resolve();
    }

    override visitarDeclaracaoVar(declaracao: Var): Promise<any> {
        this.variaveis[declaracao.simbolo.lexema] = {
            tipo: 'qualquer',
            subtipo: undefined,
            imutavel: false,
            valor: undefined,
            valorDefinido: true,
        };

        return Promise.resolve();
    }

    override visitarExpressaoDeVariavel(expressao: Var | Const): Promise<any> {
        if (!(expressao.simbolo.lexema in this.variaveis)) {
            this.adicionarDiagnostico(
                expressao.simbolo,
                `Variável '${expressao.simbolo.lexema}' ainda não foi declarada.`
            );
        }

        return Promise.resolve();
    }

    visitarExpressaoQualTipo(expressao: QualTipo<string>): void | Promise<string> {
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
