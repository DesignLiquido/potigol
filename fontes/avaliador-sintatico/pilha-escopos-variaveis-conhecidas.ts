import { PilhaInterface } from '@designliquido/delegua/interfaces';

export class PilhaEscoposVariaveisConhecidas implements PilhaInterface<string[]> {
    pilha: string[][];

    constructor() {
        this.pilha = [];
    }

    empilhar(item: string[]): void {
        this.pilha.push(item);
    }

    eVazio(): boolean {
        return this.pilha.length === 0;
    }

    topoDaPilha(): string[] {
        if (this.eVazio()) throw new Error('Pilha vazia.');
        return this.pilha[this.pilha.length - 1];
    }

    removerUltimo(): string[] {
        if (this.eVazio()) throw new Error('Pilha vazia.');
        return this.pilha.pop();
    }

    variavelExiste(nome: string) {
        for (let i = 0; i < this.pilha.length; i++) {
            if (this.pilha[i].includes(nome)) {
                return true;
            }
        }

        return false;
    }
}
