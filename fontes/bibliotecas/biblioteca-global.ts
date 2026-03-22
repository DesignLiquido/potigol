import { InterpretadorPotigolInterface } from '../interfaces';

export async function abs(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.abs(valor));
}

export async function aleatorio(
    interpretadorOuPrimeiro?: InterpretadorPotigolInterface | number,
    primeiroOuUltimo?: number | Array<any>,
    ultimo?: number
): Promise<any> {
    // Sobrecarga: aleatorio(lista) — retorna elemento aleatório da lista
    if (Array.isArray(primeiroOuUltimo)) {
        const lista = primeiroOuUltimo;
        if (lista.length === 0) return Promise.resolve(undefined);
        return Promise.resolve(lista[Math.floor(Math.random() * lista.length)]);
    }

    const primeiroArgumentoEValor = typeof interpretadorOuPrimeiro === 'number';
    const primeiro = primeiroArgumentoEValor ? interpretadorOuPrimeiro : (primeiroOuUltimo as number | undefined);
    const segundo = primeiroArgumentoEValor ? (primeiroOuUltimo as number | undefined) : ultimo;

    if (typeof primeiro !== 'number') {
        return Promise.resolve(Math.random());
    }

    if (typeof segundo !== 'number') {
        const maximo = Math.trunc(primeiro);
        const aleatorioNoIntervalo = Math.floor(Math.random() * maximo) + 1;
        return Promise.resolve(aleatorioNoIntervalo);
    }

    const minimo = Math.min(Math.trunc(primeiro), Math.trunc(segundo));
    const maximo = Math.max(Math.trunc(primeiro), Math.trunc(segundo));
    const faixa = maximo - minimo + 1;
    return Promise.resolve(Math.floor(Math.random() * faixa) + minimo);
}

export async function arccos(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.acos(valor));
}

export async function arcsen(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.asin(valor));
}

export async function arctg(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.atan(valor));
}

export async function cos(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.cos(valor));
}

export async function log(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.log(valor));
}

export async function log10(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.log10(valor));
}

export async function pi(): Promise<number> {
    return Promise.resolve(Math.PI);
}

export async function raiz(
    interpretadorOuValor: InterpretadorPotigolInterface | number,
    valorOuIndice: number,
    indice = 2
) {
    const valor = typeof interpretadorOuValor === 'number' ? interpretadorOuValor : valorOuIndice;
    const indiceEfetivo = typeof interpretadorOuValor === 'number' ? valorOuIndice : indice;
    return Promise.resolve(Math.pow(valor, 1 / indiceEfetivo));
}

export async function sen(interpretador: InterpretadorPotigolInterface, valor: number) {
    return Promise.resolve(Math.sin(valor));
}

export async function tg(interpretador: InterpretadorPotigolInterface, valor: number) {
    return Promise.resolve(Math.tan(valor));
}
