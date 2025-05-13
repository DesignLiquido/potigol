import { InterpretadorPotigolInterface } from '../interfaces';

export async function abs(interpretador: InterpretadorPotigolInterface, valor: number): Promise<number> {
    return Promise.resolve(Math.abs(valor));
}

export async function aleatorio(): Promise<number> {
    return Promise.resolve(Math.random());
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

export async function raiz(interpretador: InterpretadorPotigolInterface, valor: number) {
    return Promise.resolve(Math.sqrt(valor));
}

export async function sen(interpretador: InterpretadorPotigolInterface, valor: number) {
    return Promise.resolve(Math.sin(valor));
}

export async function tg(interpretador: InterpretadorPotigolInterface, valor: number) {
    return Promise.resolve(Math.tan(valor));
}
