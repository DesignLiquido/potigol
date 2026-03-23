export class EstruturaMatriz {
    valores: Array<Array<any>>;
    tipoElemento: string;

    constructor(valores: Array<Array<any>>, tipoElemento: string = 'qualquer') {
        this.valores = valores;
        this.tipoElemento = tipoElemento;
    }

    /**
     * Método utilizado pelo dialeto para a saída. Por exemplo, método `escreva`.
     * @returns {string} A representação do objeto como texto.
     */
    paraTexto(): string {
        let retorno = '[';
        for (let linha of this.valores) {
            retorno += '[';
            for (let elemento of linha) {
                retorno += (elemento.hasOwnProperty('valor') ? elemento.valor : elemento) + ',';
            }
            if (linha.length > 0) {
                retorno = retorno.slice(0, -1);
            }
            retorno += '],';
        }
        if (this.valores.length > 0) {
            retorno = retorno.slice(0, -1);
        }
        retorno += ']';
        return retorno;
    }

    /**
     * Método utilizado pelo VSCode para representar este objeto quando impresso.
     * @returns {string} A representação do objeto como texto.
     */
    toString(): string {
        return `<Matriz[${this.tipoElemento}] ${JSON.stringify(this.valores)}>`;
    }

    /**
     * Retorna o número de linhas da matriz.
     * @returns {number} Número de linhas.
     */
    linhas(): number {
        return this.valores.length;
    }

    /**
     * Retorna o número de colunas da matriz.
     * @returns {number} Número de colunas.
     */
    colunas(): number {
        return this.valores.length > 0 ? this.valores[0].length : 0;
    }

    /**
     * Acessa um elemento da matriz.
     * @param linha Índice da linha.
     * @param coluna Índice da coluna.
     * @returns O elemento na posição especificada.
     */
    obter(linha: number, coluna: number): any {
        if (linha < 0 || linha >= this.valores.length) {
            throw new Error(`Índice de linha ${linha} fora dos limites`);
        }
        if (coluna < 0 || coluna >= this.valores[linha].length) {
            throw new Error(`Índice de coluna ${coluna} fora dos limites`);
        }
        return this.valores[linha][coluna];
    }

    /**
     * Define um elemento da matriz.
     * @param linha Índice da linha.
     * @param coluna Índice da coluna.
     * @param valor Novo valor.
     */
    definir(linha: number, coluna: number, valor: any): void {
        if (linha < 0 || linha >= this.valores.length) {
            throw new Error(`Índice de linha ${linha} fora dos limites`);
        }
        if (coluna < 0 || coluna >= this.valores[linha].length) {
            throw new Error(`Índice de coluna ${coluna} fora dos limites`);
        }
        this.valores[linha][coluna] = valor;
    }
}