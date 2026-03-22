import { Construto } from '@designliquido/delegua/construtos';
import { Declaracao } from '@designliquido/delegua/declaracoes';
import { SimboloInterface } from '@designliquido/delegua/interfaces';

import { VisitanteComumPotigolInterface } from '../interfaces';

export class ParaGere extends Declaracao {
    simboloIteracao: SimboloInterface;
    inicio: Construto;
    fim: Construto;
    passo: Construto;
    condicao: Construto;
    corpo: any[];

    constructor(
        hashArquivo: number,
        linha: number,
        simboloIteracao: SimboloInterface,
        inicio: Construto,
        fim: Construto,
        corpo: any[],
        passo?: Construto,
        condicao?: Construto
    ) {
        super(linha, hashArquivo);
        this.simboloIteracao = simboloIteracao;
        this.inicio = inicio;
        this.fim = fim;
        this.corpo = corpo;
        this.passo = passo;
        this.condicao = condicao;
    }

    async aceitar(visitante: VisitanteComumPotigolInterface): Promise<any> {
        return await visitante.visitarDeclaracaoParaGere(this);
    }

    paraTexto(): string {
        return `<para-gere ${this.simboloIteracao.lexema} />`;
    }
}