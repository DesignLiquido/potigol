import { Construto } from "@designliquido/delegua/construtos";
import { Declaracao } from "@designliquido/delegua/declaracoes";
import { SimboloInterface } from "@designliquido/delegua/interfaces";
import { TipoDadosElementar } from "@designliquido/delegua/tipo-dados-elementar";

import { VisitanteComumPotigolInterface } from "../interfaces";

/**
 * Uma declaração de reatribuição de variável.
 * Em Potigol, para a correta formatação de código, precisamos separar as declarações.
 */
export class ReatribuicaoVariavel extends Declaracao {
    simbolo: SimboloInterface;
    inicializador: Construto;
    tipo: TipoDadosElementar;
    referencia: boolean;

    constructor(simbolo: SimboloInterface, inicializador: Construto, tipo: TipoDadosElementar = undefined) {
        super(Number(simbolo.linha), simbolo.hashArquivo);
        this.simbolo = simbolo;
        this.inicializador = inicializador;
        this.tipo = tipo;
        this.referencia = false;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoReatribuicaoVariavel(this);
    }
}
