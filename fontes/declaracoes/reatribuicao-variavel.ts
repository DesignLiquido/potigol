import { Declaracao } from '@designliquido/delegua/declaracoes';
import { ConstrutoInterface, SimboloInterface } from '@designliquido/delegua/interfaces';
import { TipoInferencia } from '@designliquido/delegua/inferenciador';

import { VisitanteComumPotigolInterface } from '../interfaces';

/**
 * Uma declaração de reatribuição de variável.
 * Em Potigol, para a correta formatação de código, precisamos separar as declarações.
 */
export class ReatribuicaoVariavel extends Declaracao {
    simbolo: SimboloInterface;
    inicializador: ConstrutoInterface;
    tipo: TipoInferencia;
    referencia: boolean;

    constructor(simbolo: SimboloInterface, inicializador: ConstrutoInterface, tipo: TipoInferencia = undefined) {
        super(Number(simbolo.linha), simbolo.hashArquivo);
        this.simbolo = simbolo;
        this.inicializador = inicializador;
        this.tipo = tipo;
        this.referencia = false;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoReatribuicaoVariavel(this);
    }

    paraTexto(): string {
        return `<reatribuição-variável />`;
    }
}
