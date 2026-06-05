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

    describe('Comparações (operadores restantes)', () => {
        it('maior ou igual (>=)', async () => {
            const resultado = await traduzir([`x = 3 >= 2`]);
            expect(resultado).toMatch(/var x = 3 >= 2/);
        });

        it('menor ou igual (<=)', async () => {
            const resultado = await traduzir([`x = 2 <= 3`]);
            expect(resultado).toMatch(/var x = 2 <= 3/);
        });
    });

    describe('Literais booleanos', () => {
        it('verdadeiro -> verdadeiro', async () => {
            const resultado = await traduzir([`x = verdadeiro`]);
            expect(resultado).toMatch(/var x = verdadeiro/);
        });

        it('falso -> falso', async () => {
            const resultado = await traduzir([`x = falso`]);
            expect(resultado).toMatch(/var x = falso/);
        });
    });

    describe('Interpolação de texto', () => {
        it('string com {variavel} -> template literal com ${variavel}', async () => {
            const resultado = await traduzir([`escreva "Olá {nome}"`]);
            expect(resultado).toMatch(/`Olá \$\{nome\}`/);
        });
    });

    describe('Vetores', () => {
        it('vetor vazio -> []', async () => {
            const resultado = await traduzir([`nums = []`]);
            expect(resultado).toMatch(/\[\]/);
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

        it('múltiplos inteiros (a, b = leia_inteiro) -> ConstMultiplo leia()', async () => {
            const resultado = await traduzir([`a, b = leia_inteiro`]);
            expect(resultado).toMatch(/var a, b = leia\(\)/);
        });

        it('múltiplos reais (a, b = leia_real) -> ConstMultiplo leia()', async () => {
            const resultado = await traduzir([`a, b = leia_real`]);
            expect(resultado).toMatch(/var a, b = leia\(\)/);
        });

        it('múltiplos textos (a, b = leia_texto) -> ConstMultiplo leia()', async () => {
            const resultado = await traduzir([`a, b = leia_texto`]);
            expect(resultado).toMatch(/var a, b = leia\(\)/);
        });

        it('leia_inteiros(n) com quantidade -> leia() (cardinalidade não propagada pelo tradutor)', async () => {
            const resultado = await traduzir([`x = leia_inteiros(3)`]);
            expect(resultado).toMatch(/var x = leia\(\)/);
        });

        it('leia_reais(n) com quantidade -> leia() (cardinalidade não propagada pelo tradutor)', async () => {
            const resultado = await traduzir([`x = leia_reais(3)`]);
            expect(resultado).toMatch(/var x = leia\(\)/);
        });

        it('leia_textos(n) com quantidade -> leia() (cardinalidade não propagada pelo tradutor)', async () => {
            const resultado = await traduzir([`x = leia_textos(3)`]);
            expect(resultado).toMatch(/var x = leia\(\)/);
        });
    });

    describe('Funções anônimas (lambda)', () => {
        it('lambda de um parâmetro -> função(...)', async () => {
            const resultado = await traduzir([`escreva ((x: Inteiro) => x + 1)(2)`]);
            expect(resultado).toMatch(/função\(x\)/);
        });

        it('lambda de dois parâmetros -> função(...)', async () => {
            const resultado = await traduzir([`escreva ((x, y: Inteiro) => x + y)(2, 3)`]);
            expect(resultado).toMatch(/função\(x, y\)/);
        });
    });

    describe('Métodos de coleção e texto', () => {
        it('cabeça -> [0]', async () => {
            const resultado = await traduzir([`x = lista.cabeça`]);
            expect(resultado).toMatch(/var x = lista\[0\]/);
        });

        it('primeiro -> [0]', async () => {
            const resultado = await traduzir([`x = lista.primeiro`]);
            expect(resultado).toMatch(/var x = lista\[0\]/);
        });

        it('último -> [tamanho() - 1]', async () => {
            const resultado = await traduzir([`x = lista.último`]);
            expect(resultado).toMatch(/lista\.tamanho\(\) - 1/);
        });

        it('cauda -> fatiar(1)', async () => {
            const resultado = await traduzir([`x = lista.cauda`]);
            expect(resultado).toMatch(/lista\.fatiar\(1\)/);
        });

        it('pegue(n) -> fatiar(0, n)', async () => {
            const resultado = await traduzir([`x = lista.pegue(2)`]);
            expect(resultado).toMatch(/lista\.fatiar\(0, 2\)/);
        });

        it('descarte(n) -> fatiar(n)', async () => {
            const resultado = await traduzir([`x = lista.descarte(2)`]);
            expect(resultado).toMatch(/lista\.fatiar\(2\)/);
        });

        it('junte(sep) -> juntar(lista)', async () => {
            const resultado = await traduzir([`x = lista.junte(",")`]);
            expect(resultado).toMatch(/juntar\(lista\)/);
        });

        it('junte sem argumento -> juntar("")', async () => {
            const resultado = await traduzir([`x = lista.junte`]);
            expect(resultado).toMatch(/lista\.juntar\(""\)/);
        });

        it('mapeie(f) -> mapear(f)', async () => {
            const resultado = await traduzir([`x = lista.mapeie(dobro)`]);
            expect(resultado).toMatch(/lista\.mapear\(dobro\)/);
        });

        it('selecione(f) -> filtrar(f)', async () => {
            const resultado = await traduzir([`x = lista.selecione(positivo)`]);
            expect(resultado).toMatch(/lista\.filtrar\(positivo\)/);
        });

        it('filtre(f) -> filtrar(f)', async () => {
            const resultado = await traduzir([`x = lista.filtre(positivo)`]);
            expect(resultado).toMatch(/lista\.filtrar\(positivo\)/);
        });

        it('injete(f) -> reduzir(f)', async () => {
            const resultado = await traduzir([`x = lista.injete(soma)`]);
            expect(resultado).toMatch(/lista\.reduzir\(soma\)/);
        });

        it('reduza(f) -> reduzir(f)', async () => {
            const resultado = await traduzir([`x = lista.reduza(soma)`]);
            expect(resultado).toMatch(/lista\.reduzir\(soma\)/);
        });

        it('contém(v) -> inclui(v)', async () => {
            const resultado = await traduzir([`x = lista.contém(5)`]);
            expect(resultado).toMatch(/lista\.inclui\(5\)/);
        });

        it('maiúsculo -> maiusculo()', async () => {
            const resultado = await traduzir([`x = texto.maiúsculo`]);
            expect(resultado).toMatch(/texto\.maiusculo\(\)/);
        });

        it('minúsculo -> minusculo()', async () => {
            const resultado = await traduzir([`x = texto.minúsculo`]);
            expect(resultado).toMatch(/texto\.minusculo\(\)/);
        });

        it('divida(sep) -> dividir(sep)', async () => {
            const resultado = await traduzir([`x = texto.divida(" ")`]);
            expect(resultado).toMatch(/texto\.dividir\(" "\)/);
        });

        it('remova(i) -> remover(i)', async () => {
            const resultado = await traduzir([`x = lista.remova(0)`]);
            expect(resultado).toMatch(/lista\.remover\(0\)/);
        });

        it('posição(v) -> posicao(v)', async () => {
            const resultado = await traduzir([`x = lista.posição(5)`]);
            expect(resultado).toMatch(/lista\.posicao\(5\)/);
        });

        it('vazia -> tamanho() == 0', async () => {
            const resultado = await traduzir([`x = lista.vazia`]);
            expect(resultado).toMatch(/lista\.tamanho\(\) == 0/);
        });
    });

    describe('Escolha/caso', () => {
        it('escolha com casos simples -> escolha com caso', async () => {
            const codigo = [
                'var x := 2',
                'escolha x',
                'caso 1 => escreva "um"',
                'caso 2 => escreva "dois"',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/escolha/);
            expect(resultado).toMatch(/caso 1:/);
            expect(resultado).toMatch(/caso 2:/);
            expect(resultado).toMatch(/escreva\("um"\)/);
            expect(resultado).toMatch(/escreva\("dois"\)/);
        });

        it('escolha com caso padrão (_) -> padrao:', async () => {
            const codigo = [
                'var x := 3',
                'escolha x',
                'caso 1 => escreva "um"',
                'caso _ => escreva "outro"',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/padrao:/);
            expect(resultado).toMatch(/escreva\("outro"\)/);
        });
    });

    describe('Para gere', () => {
        it('para de/até/gere sem passo -> para com passo 1', async () => {
            const codigo = [
                'para i de 1 até 5 gere',
                'escreva i',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/para \(var i = 1; i <= 5; i = i \+ 1\)/);
            expect(resultado).toMatch(/escreva\(i\)/);
        });

        it('para de/até/passo/gere com passo explícito', async () => {
            const codigo = [
                'para i de 0 até 10 passo 2 gere',
                'escreva i',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/para \(var i = 0; i <= 10; i = i \+ 2\)/);
        });
    });

    describe('Para cada', () => {
        it('para cada x em lista -> para cada ... em ...', async () => {
            const codigo = [
                'para x em [1, 2, 3] faca',
                '  escreva x',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/para cada x em \[1, 2, 3\]/);
            expect(resultado).toMatch(/escreva\(x\)/);
        });
    });

    describe('Alias de tipo', () => {
        it('tipo Novo = Existente -> comentário', async () => {
            const resultado = await traduzir([`tipo Comprimento = Inteiro`]);
            expect(resultado).toMatch(/\/\/ tipo Comprimento = Inteiro/);
        });
    });

    describe('Chamadas de função (Constante com argumentos)', () => {
        it('chamada de função definida pelo usuário', async () => {
            const codigo = [
                'dobro(x: Inteiro) = x * 2',
                'escreva dobro(5)',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/dobro\(5\)/);
        });
    });

    describe('Acesso a métodos não mapeados', () => {
        it('propriedade desconhecida sem args -> objeto.propriedade', async () => {
            const resultado = await traduzir([`x = obj.qualTipo`]);
            expect(resultado).toMatch(/obj\.qualTipo/);
        });

        it('insira (sem tradução direta) com args -> método original', async () => {
            const resultado = await traduzir([`x = lista.insira(5)`]);
            expect(resultado).toMatch(/lista\.insira\(5\)/);
        });
    });

    describe('Declaração de classe (tipo)', () => {
        it('tipo com propriedades -> classe com var', async () => {
            const codigo = [
                'tipo Ponto',
                '  x: Inteiro',
                '  y: Inteiro',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/classe Ponto/);
            expect(resultado).toMatch(/var x/);
            expect(resultado).toMatch(/var y/);
        });

        it('tipo com método -> classe com função', async () => {
            const codigo = [
                'tipo Circulo',
                '  raio: Inteiro',
                '  area() = raio * raio',
                'fim',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/classe Circulo/);
            expect(resultado).toMatch(/função area/);
        });

        it('instanciação de tipo (Constante com args)', async () => {
            const codigo = [
                'tipo Ponto',
                '  x: Inteiro',
                '  y: Inteiro',
                'fim',
                'p = Ponto(1, 2)',
            ];
            const resultado = await traduzir(codigo);
            expect(resultado).toMatch(/Ponto\(1, 2\)/);
        });
    });
});
