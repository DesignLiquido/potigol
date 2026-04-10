import { LexadorPotigol } from '../../fontes/lexador';
import { AvaliadorSintaticoPotigol } from '../../fontes/avaliador-sintatico';
import { TradutorReversoPotigol } from '../../fontes/tradutores';

describe('Tradutor Reverso Potigol -> Delégua', () => {
    let lexador: LexadorPotigol;
    let avaliadorSintatico: AvaliadorSintaticoPotigol;
    const tradutor = new TradutorReversoPotigol();

    beforeEach(() => {
        lexador = new LexadorPotigol();
        avaliadorSintatico = new AvaliadorSintaticoPotigol();
    });

    async function traduzir(linhas: string[]): Promise<string> {
        const retornoLexador = lexador.mapear(linhas, -1);
        const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);
        return tradutor.traduzir(retornoAvaliador.declaracoes);
    }

    describe('Saída', () => {
        it('escreva string literal -> escreva()', async () => {
            const resultado = await traduzir([`escreva "Olá mundo"`]);
            expect(resultado).toMatch(/escreva\("Olá mundo"\)/);
        });

        it('escreva com parênteses -> escreva()', async () => {
            // Argumento em parênteses vira Agrupamento na AST, produzindo escreva(("..."))
            const resultado = await traduzir([`escreva("Olá mundo")`]);
            expect(resultado).toMatch(/escreva\(/);
            expect(resultado).toMatch(/Olá mundo/);
        });

        it('imprima -> escreva()', async () => {
            const resultado = await traduzir([`imprima "Olá"`]);
            expect(resultado).toMatch(/escreva\("Olá"\)/);
        });
    });

    describe('Variáveis e constantes', () => {
        it('val (constante implícita) -> var', async () => {
            const resultado = await traduzir([`x = 42`]);
            expect(resultado).toMatch(/var x = 42/);
        });

        it('val explícito -> var', async () => {
            const resultado = await traduzir([`val x = 42`]);
            expect(resultado).toMatch(/var x = 42/);
        });

        it('var (mutável) -> var', async () => {
            const resultado = await traduzir([`var x := 10`]);
            expect(resultado).toMatch(/var x = 10/);
        });

        it('reatribuição de variável (:=) -> atribuição (=)', async () => {
            const codigo = [
                'var x := 1',
                'x := 2',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/var x = 1/);
            expect(resultado).toMatch(/x = 2/);
        });
    });

    describe('Operações aritméticas', () => {
        it('adição', async () => {
            const resultado = await traduzir([`x = 1 + 2`]);
            expect(resultado).toMatch(/var x = 1 \+ 2/);
        });

        it('subtração', async () => {
            const resultado = await traduzir([`x = 10 - 3`]);
            expect(resultado).toMatch(/var x = 10 - 3/);
        });

        it('multiplicação', async () => {
            const resultado = await traduzir([`x = 4 * 5`]);
            expect(resultado).toMatch(/var x = 4 \* 5/);
        });

        it('divisão', async () => {
            const resultado = await traduzir([`x = 10 / 2`]);
            expect(resultado).toMatch(/var x = 10 \/ 2/);
        });

        it('divisão inteira (div) -> \\', async () => {
            const resultado = await traduzir([`x = 10 div 3`]);
            expect(resultado).toMatch(/var x = 10 \\ 3/);
        });

        it('módulo (mod) -> %', async () => {
            const resultado = await traduzir([`x = 10 mod 3`]);
            expect(resultado).toMatch(/var x = 10 % 3/);
        });

        it('exponenciação (^) -> **', async () => {
            const resultado = await traduzir([`x = 2 ^ 8`]);
            expect(resultado).toMatch(/var x = 2 \*\* 8/);
        });
    });

    describe('Comparações', () => {
        it('igual (==)', async () => {
            const resultado = await traduzir([`x = 1 == 1`]);
            expect(resultado).toMatch(/var x = 1 == 1/);
        });

        it('diferente (<>) -> !=', async () => {
            const resultado = await traduzir([`x = 1 <> 2`]);
            expect(resultado).toMatch(/var x = 1 != 2/);
        });

        it('maior (>)', async () => {
            const resultado = await traduzir([`x = 3 > 2`]);
            expect(resultado).toMatch(/var x = 3 > 2/);
        });

        it('menor (<)', async () => {
            const resultado = await traduzir([`x = 2 < 3`]);
            expect(resultado).toMatch(/var x = 2 < 3/);
        });
    });

    describe('Lógica', () => {
        it('e -> e', async () => {
            const resultado = await traduzir([`x = verdadeiro e falso`]);
            expect(resultado).toMatch(/var x = verdadeiro e falso/);
        });

        it('ou -> ou', async () => {
            const resultado = await traduzir([`x = verdadeiro ou falso`]);
            expect(resultado).toMatch(/var x = verdadeiro ou falso/);
        });

        it('nao / não -> !', async () => {
            const resultado = await traduzir([`x = não verdadeiro`]);
            expect(resultado).toMatch(/var x = !verdadeiro/);
        });
    });

    describe('Condicional (se/então/senão)', () => {
        it('se simples', async () => {
            const codigo = [
                'se 1 > 0 então',
                '  escreva "positivo"',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/se \(1 > 0\)/);
            expect(resultado).toMatch(/escreva\("positivo"\)/);
        });

        it('se/senão', async () => {
            const codigo = [
                'se 1 > 0 então',
                '  escreva "positivo"',
                'senão',
                '  escreva "negativo"',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/se \(1 > 0\)/);
            expect(resultado).toMatch(/escreva\("positivo"\)/);
            expect(resultado).toMatch(/senão/);
            expect(resultado).toMatch(/escreva\("negativo"\)/);
        });
    });

    describe('Laços de repetição', () => {
        it('enquanto/faça -> enquanto', async () => {
            const codigo = [
                'var i := 0',
                'enquanto i < 5 faça',
                '  i := i + 1',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/var i = 0/);
            expect(resultado).toMatch(/enquanto \(i < 5\)/);
            expect(resultado).toMatch(/i = i \+ 1/);
        });

        it('para de/até/faça -> para', async () => {
            const codigo = [
                'para i de 1 até 5 faça',
                '  escreva i',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/para/);
            expect(resultado).toMatch(/escreva\(i\)/);
        });
    });

    describe('Funções', () => {
        it('função de linha única (= expressão)', async () => {
            const codigo = ['dobro(x: Inteiro) = x * 2'];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/função dobro\(x\)/);
            expect(resultado).toMatch(/retorna x \* 2/);
        });

        it('função com bloco', async () => {
            // `retorne` sem parênteses dentro do corpo é resolvido pelo parser como expressão.
            // Verificamos que a declaração de função é traduzida corretamente.
            const codigo = [
                'soma(a, b: Inteiro): Inteiro',
                '  a + b',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/função soma\(a, b\)/);
            expect(resultado).toMatch(/a \+ b/);
        });
    });

    describe('Listas', () => {
        it('literal de lista -> vetor', async () => {
            const resultado = await traduzir([`nums = [1, 2, 3]`]);
            expect(resultado).toMatch(/var nums = \[1, 2, 3\]/);
        });

        it('acesso por índice', async () => {
            const resultado = await traduzir([`x = nums[0]`]);
            expect(resultado).toMatch(/var x = nums\[0\]/);
        });

        it('método tamanho -> tamanho()', async () => {
            const resultado = await traduzir([`t = nums.tamanho`]);
            expect(resultado).toMatch(/var t = nums\.tamanho\(\)/);
        });

        it('método inverta -> inverter()', async () => {
            const resultado = await traduzir([`r = nums.inverta`]);
            expect(resultado).toMatch(/var r = nums\.inverter\(\)/);
        });

        it('método ordene -> ordenar()', async () => {
            const resultado = await traduzir([`r = nums.ordene`]);
            expect(resultado).toMatch(/var r = nums\.ordenar\(\)/);
        });
    });

    describe('Entrada (leia_*)', () => {
        it('leia_inteiro -> leia()', async () => {
            const resultado = await traduzir([`x = leia_inteiro`]);
            expect(resultado).toMatch(/var x = leia\(\)/);
        });

        it('leia_texto -> leia()', async () => {
            const resultado = await traduzir([`s = leia_texto`]);
            expect(resultado).toMatch(/var s = leia\(\)/);
        });

        it('leia_real -> leia()', async () => {
            const resultado = await traduzir([`n = leia_real`]);
            expect(resultado).toMatch(/var n = leia\(\)/);
        });
    });
});
