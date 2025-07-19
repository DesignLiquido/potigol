export class EstruturaTupla {
    valores: Array<any>;

    constructor(valores: Array<any>) {
        this.valores = valores;
    }

    /**
     * Método utilizado pelo dialeto para a saída. Por exemplo, método `escreva`.
     * @returns {string} A representação do objeto como texto.
     */
    paraTexto(): string {
        let retorno = '(';
        for (let valor of this.valores) {
            retorno += (valor.hasOwnProperty('valor') ? valor.valor : valor) + ',';
        }

        if (this.valores.length > 0) {
            retorno = retorno.slice(0, -1);
        }

        retorno += ')';
        return retorno;
    }

    /**
     * Método utilizado pelo VSCode para representar este objeto quando impresso.
     * @returns {string} A representação do objeto como texto.
     */
    toString(): string {
        return `<Tupla ${JSON.stringify(this.valores)}>`;
    }
}
