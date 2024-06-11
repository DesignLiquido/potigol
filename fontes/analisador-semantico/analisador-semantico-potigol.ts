import { AnalisadorSemanticoBase, PilhaVariaveis } from "@designliquido/delegua/analisador-semantico";
import { QualTipo } from "@designliquido/delegua/construtos";
import { Declaracao } from "@designliquido/delegua/declaracoes";
import { DiagnosticoAnalisadorSemantico } from "@designliquido/delegua/interfaces";
import { FuncaoHipoteticaInterface } from '@designliquido/delegua/interfaces/funcao-hipotetica-interface';
import { RetornoAnalisadorSemantico } from "@designliquido/delegua/interfaces/retornos/retorno-analisador-semantico";
import { VariavelHipoteticaInterface } from '@designliquido/delegua/interfaces/variavel-hipotetica-interface';

import { ReatribuicaoVariavel } from "../declaracoes";
import { VisitanteComumPotigolInterface } from "../interfaces";

export class AnalisadorSemanticoPotigol 
    extends AnalisadorSemanticoBase
    implements VisitanteComumPotigolInterface
{
    pilhaVariaveis: PilhaVariaveis;
    variaveis: { [nomeVariavel: string]: VariavelHipoteticaInterface };
    funcoes: { [nomeFuncao: string]: FuncaoHipoteticaInterface };
    atual: number;
    diagnosticos: DiagnosticoAnalisadorSemantico[];
    
    visitarDeclaracaoReatribuicaoVariavel(declaracao: ReatribuicaoVariavel): void | Promise<any> {
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
