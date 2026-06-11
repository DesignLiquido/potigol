import { Declaracao } from '@designliquido/delegua/declaracoes';
import { ConstrutoInterface, SimboloInterface } from '@designliquido/delegua/interfaces';

import { VisitanteComumPotigolInterface } from '../interfaces';

export class ParaEmGere extends Declaracao {
    simboloIteracao: SimboloInterface;
    colecao: ConstrutoInterface;
    condicao: ConstrutoInterface;
    corpo: any[];
    aplanar: boolean;

    constructor(
        hashArquivo: number,
        linha: number,
        simboloIteracao: SimboloInterface,
        colecao: ConstrutoInterface,
        corpo: any[],
        condicao?: ConstrutoInterface
    ) {
        super(linha, hashArquivo);
        this.simboloIteracao = simboloIteracao;
        this.colecao = colecao;
        this.corpo = corpo;
        this.condicao = condicao;
        this.aplanar = false;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoParaEmGere(this);
    }

    paraTexto(): string {
        return `<para-em-gere ${this.simboloIteracao.lexema} />`;
    }
}
