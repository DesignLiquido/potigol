import { InterpretadorInterface } from '@designliquido/delegua';
import { PilhaEscoposExecucaoInterface } from '@designliquido/delegua/interfaces/pilha-escopos-execucao-interface';
import { ArgumentoInterface } from '@designliquido/delegua/interpretador/argumento-interface';
import { ObjetoDeleguaClasse } from '@designliquido/delegua/interpretador/estruturas';
import { DeleguaFuncao } from '@designliquido/delegua/interpretador/estruturas/delegua-funcao';
import { RetornoQuebra } from '@designliquido/delegua/quebras';
import { inferirTipoVariavel } from '../inferenciador';

/**
 * Qualquer função declarada em código é uma `PotigolFuncao`.
 */
export class PotigolFuncao extends DeleguaFuncao {
    override async chamar(
        visitante: InterpretadorInterface,
        argumentos: Array<ArgumentoInterface>
    ): Promise<any> {
        const ambiente = this.resolverAmbiente(argumentos);

        if (this.instancia !== undefined) {
            ambiente.valores['isto'] = {
                valor: this.instancia,
                tipo: 'objeto',
                imutavel: false,
            };

            // Apenas Potigol usa isso até então.
            if (
                this.instancia.classe.dialetoRequerExpansaoPropriedadesEspacoVariaveis &&
                this.nome !== 'construtor'
            ) {
                for (let [nomeCampo, valorCampo] of Object.entries(this.instancia.propriedades)) {
                    ambiente.valores[nomeCampo] = {
                        valor: valorCampo,
                        // TODO: Possivelmente será necessário alterar `ambiente.valores` para
                        // trabalhar com os tipos de variáveis do Potigol.
                        tipo: inferirTipoVariavel(valorCampo as any) as any,
                        imutavel: false,
                    };
                }
            }
        }

        const interpretador = visitante as any;
        interpretador.proximoEscopo = 'funcao';
        const retornoBloco: any = await interpretador.executarBloco(
            this.declaracao.corpo,
            ambiente
        );

        const referencias = this.declaracao.parametros
            .map((p, indice) => {
                if (p.referencia) {
                    return {
                        indice: indice,
                        parametro: p,
                    };
                }
            })
            .filter((r) => r);
        const pilha = interpretador.pilhaEscoposExecucao as PilhaEscoposExecucaoInterface;

        for (let referencia of referencias) {
            let argumentoReferencia = ambiente.valores[referencia.parametro.nome.lexema];

            pilha.definirVariavel(referencia.parametro.nome.lexema, argumentoReferencia.valor);
        }

        if (retornoBloco instanceof RetornoQuebra) {
            return retornoBloco.valor;
        }

        if (this.eInicializador) {
            return this.instancia;
        }

        return retornoBloco;
    }

    override funcaoPorMetodoDeClasse(instancia: ObjetoDeleguaClasse): DeleguaFuncao {
        return new PotigolFuncao(this.nome, this.declaracao, instancia, this.eInicializador);
    }
}
