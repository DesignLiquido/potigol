import { Declaracao } from '@designliquido/delegua/declaracoes';
import { ConstrutoInterface, SimboloInterface } from '@designliquido/delegua/interfaces';

import { VisitanteComumPotigolInterface } from '../interfaces';

export class ParaGere extends Declaracao {
    simboloIteracao: SimboloInterface;
    inicio: ConstrutoInterface;
    fim: ConstrutoInterface;
    passo: ConstrutoInterface;
    condicao: ConstrutoInterface;
    corpo: any[];
    aplanar: boolean;

    constructor(
        hashArquivo: number,
        linha: number,
        simboloIteracao: SimboloInterface,
        inicio: ConstrutoInterface,
        fim: ConstrutoInterface,
        corpo: any[],
        passo?: ConstrutoInterface,
        condicao?: ConstrutoInterface
    ) {
        super(linha, hashArquivo);
        this.simboloIteracao = simboloIteracao;
        this.inicio = inicio;
        this.fim = fim;
        this.corpo = corpo;
        this.passo = passo;
        this.condicao = condicao;
        this.aplanar = false;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoParaGere(this);
    }

    paraTexto(): string {
        return `<para-gere ${this.simboloIteracao.lexema} />`;
    }
}
