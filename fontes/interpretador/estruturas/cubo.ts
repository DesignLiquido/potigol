export class EstruturaCubo {
    valores: Array<Array<Array<any>>>;
    tipoElemento: string;

    constructor(valores: Array<Array<Array<any>>>, tipoElemento: string = 'qualquer') {
        this.valores = valores;
        this.tipoElemento = tipoElemento;
    }

    /**
     * Método utilizado pelo dialeto para a saída. Por exemplo, método `escreva`.
     * @returns {string} A representação do objeto como texto.
     */
    paraTexto(): string {
        let retorno = '[';
        for (let camada of this.valores) {
            retorno += '[';
            for (let linha of camada) {
                retorno += '[';
                for (let elemento of linha) {
                    retorno += (elemento.hasOwnProperty('valor') ? elemento.valor : elemento) + ',';
                }
                if (linha.length > 0) {
                    retorno = retorno.slice(0, -1);
                }
                retorno += '],';
            }
            if (camada.length > 0) {
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
        return `<Cubo[${this.tipoElemento}] ${JSON.stringify(this.valores)}>`;
    }

    /**
     * Retorna o número de camadas do cubo.
     * @returns {number} Número de camadas.
     */
    camadas(): number {
        return this.valores.length;
    }

    /**
     * Retorna o número de linhas do cubo.
     * @returns {number} Número de linhas.
     */
    linhas(): number {
        return this.valores.length > 0 ? this.valores[0].length : 0;
    }

    /**
     * Retorna o número de colunas do cubo.
     * @returns {number} Número de colunas.
     */
    colunas(): number {
        return this.valores.length > 0 && this.valores[0].length > 0 ? this.valores[0][0].length : 0;
    }

    /**
     * Acessa um elemento do cubo.
     * @param camada Índice da camada.
     * @param linha Índice da linha.
     * @param coluna Índice da coluna.
     * @returns O elemento na posição especificada.
     */
    obter(camada: number, linha: number, coluna: number): any {
        if (camada < 0 || camada >= this.valores.length) {
            throw new Error(`Índice de camada ${camada} fora dos limites`);
        }
        if (linha < 0 || linha >= this.valores[camada].length) {
            throw new Error(`Índice de linha ${linha} fora dos limites`);
        }
        if (coluna < 0 || coluna >= this.valores[camada][linha].length) {
            throw new Error(`Índice de coluna ${coluna} fora dos limites`);
        }
        return this.valores[camada][linha][coluna];
    }

    /**
     * Define um elemento do cubo.
     * @param camada Índice da camada.
     * @param linha Índice da linha.
     * @param coluna Índice da coluna.
     * @param valor Novo valor.
     */
    definir(camada: number, linha: number, coluna: number, valor: any): void {
        if (camada < 0 || camada >= this.valores.length) {
            throw new Error(`Índice de camada ${camada} fora dos limites`);
        }
        if (linha < 0 || linha >= this.valores[camada].length) {
            throw new Error(`Índice de linha ${linha} fora dos limites`);
        }
        if (coluna < 0 || coluna >= this.valores[camada][linha].length) {
            throw new Error(`Índice de coluna ${coluna} fora dos limites`);
        }
        this.valores[camada][linha][coluna] = valor;
    }
}