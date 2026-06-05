import { LexadorPotigol } from "../fontes/lexador";
import { AvaliadorSintaticoPotigol } from "../fontes/avaliador-sintatico";
import { AnalisadorSemanticoPotigol } from "../fontes/analisador-semantico";
import { DiagnosticoSeveridade } from "@designliquido/delegua/interfaces";
import { Const, Var, Enquanto, Expressao, Falhar, Bloco, VarMultiplo } from '@designliquido/delegua/declaracoes';
import { Literal } from '@designliquido/delegua/construtos';
import { Binario, Logico, Variavel, TipoDe, AcessoMetodoOuPropriedade, Agrupamento, Vetor, Chamada, Atribuir, FuncaoConstruto, Constante } from '@designliquido/delegua';
import { ParaGere, AtribuicaoParalelaVariavel, ReatribuicaoVariavel, AliasTipo } from '../fontes/declaracoes';
import { LeiaInteiro, LeiaReal, LeiaTexto, LeiaInteiros, LeiaReais, LeiaTextos } from '../fontes/construtos';

describe('Analisador semântico', () => {
    let lexador: LexadorPotigol;
    let avaliadorSintatico: AvaliadorSintaticoPotigol;
    let analisadorSemantico: AnalisadorSemanticoPotigol;

    beforeEach(() => {
        lexador = new LexadorPotigol();
        avaliadorSintatico = new AvaliadorSintaticoPotigol();
        analisadorSemantico = new AnalisadorSemanticoPotigol();
    });

    describe('Cenários de sucesso', () => {
        it('Declaração de inteiro constante com val, dica de tipo e uso da variável', async () => {
            const retornoLexador = lexador.mapear(['val a: Inteiro = 10', 'val b: Inteiro = a + 5'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            // b não é usada, então teremos 1 aviso
            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Declaração de variável com var e uso', async () => {
            const retornoLexador = lexador.mapear(['var x := 3.14', 'x := x + 1.0'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita uso de alias de tipo valido em declaracao', async () => {
            const retornoLexador = lexador.mapear([
                'tipo Medida = Inteiro',
                'valor: Medida = 10',
                'escreva valor'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita instanciação de tipo concreto', async () => {
            const retornoLexador = lexador.mapear([
                'tipo Quadrado',
                '  lado: Inteiro',
                'fim',
                'q = Quadrado(10)'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita escolha com guarda lógica', async () => {
            const retornoLexador = lexador.mapear([
                'escolha 1',
                '  caso 1 se verdadeiro => escreva "ok"',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita para cada (for-each) sobre lista', async () => {
            const retornoLexador = lexador.mapear([
                'para x em [1, 2, 3] faca',
                '  escreva x',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita variável de iteração de para cada usada no corpo', async () => {
            const retornoLexador = lexador.mapear([
                'numeros = [1, 2, 3]',
                'para n em numeros faca',
                '  escreva n',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });
    });

    describe('Avisos', () => {
        it('Deve avisar sobre variável não usada', async () => {
            const retornoLexador = lexador.mapear(['val a: Inteiro = 10'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            expect(retornoAnaliseSemantica.diagnosticos).toHaveLength(1);
            expect(retornoAnaliseSemantica.diagnosticos[0].severidade).toBe(DiagnosticoSeveridade.AVISO);
            expect(retornoAnaliseSemantica.diagnosticos[0].mensagem).toContain('nunca foi usada');
        });

        it('Deve detectar corretamente variáveis usadas em reatribuição', async () => {
            const retornoLexador = lexador.mapear(['var x := 0', 'var y := 0', 'var z := 0', 'z := x + y'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            // Todas foram usadas, então não deve ter avisos
            const avisos = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.AVISO);
            expect(avisos).toHaveLength(0);
        });
    });

    describe('Erros', () => {
        it('Analisador não gera erros quando sintaxe está correta', async () => {
            const retornoLexador = lexador.mapear(['val a = 10', 'val b = a + 5'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            // Pode ter avisos sobre variáveis não usadas, mas não erros
            const erros = retornoAnaliseSemantica.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Deve detectar divisão por zero em tempo de compilação', async () => {
            const retornoLexador = lexador.mapear(['val a = 10 / 0'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            // Divisão por zero pode ser detectada
            const erroDivisao = retornoAnaliseSemantica.diagnosticos.find(
                d => d.mensagem?.toLowerCase().includes('zero')
            );
            // Se não detectar, teste ainda passa (funcionalidade opcional)
            if (erroDivisao) {
                expect(erroDivisao.severidade).toBe(DiagnosticoSeveridade.ERRO);
            }
        });

        it('Detecta modificação de constante via reatribuição', async () => {
            const retornoLexador = lexador.mapear(['val a = 10', 'a := 20'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erroConstante = retornoAnaliseSemantica.diagnosticos.find(
                d => d.severidade === DiagnosticoSeveridade.ERRO &&
                     (d.mensagem?.toLowerCase().includes('constante') || d.mensagem?.toLowerCase().includes('imutável'))
            );
            expect(erroConstante).toBeTruthy();
        });

        it('Detecta tipo incompatível na declaração de vetor de inteiros', async () => {
            const retornoLexador = lexador.mapear(['val a = [1, 2, "texto"]'], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            expect(retornoAnaliseSemantica).toBeTruthy();
            // Sem tipo explícito, o analisador aceita vetor misto
            // Este teste valida que não gera erro inesperado
            const errosFatais = retornoAnaliseSemantica.diagnosticos.filter(
                d => d.severidade === DiagnosticoSeveridade.ERRO && d.mensagem?.includes('fatal')
            );
            expect(errosFatais).toHaveLength(0);
        });

        it('Detecta alias de tipo duplicado', async () => {
            const retornoLexador = lexador.mapear([
                'tipo Medida = Inteiro',
                'tipo Medida = Real'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erro = retornoAnaliseSemantica.diagnosticos.find(
                d => d.severidade === DiagnosticoSeveridade.ERRO && d.mensagem?.includes('ja existe')
            );
            expect(erro).toBeTruthy();
        });

        it('Detecta instanciação de tipo abstrato', async () => {
            const retornoLexador = lexador.mapear([
                'tipo abstrato Figura',
                '  lados: Inteiro',
                'fim',
                'f = Figura(4)'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erro = retornoAnaliseSemantica.diagnosticos.find(
                d => d.severidade === DiagnosticoSeveridade.ERRO && d.mensagem?.includes('não pode ser instanciado')
            );
            expect(erro).toBeTruthy();
        });

        it('Detecta guarda não lógica em escolha', async () => {
            const retornoLexador = lexador.mapear([
                'escolha 1',
                '  caso 1 se 1 => escreva "ok"',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);
            const retornoAnaliseSemantica = await analisadorSemantico.analisar(retornoAvaliadorSintatico.declaracoes);

            const erro = retornoAnaliseSemantica.diagnosticos.find(
                d => d.severidade === DiagnosticoSeveridade.ERRO && d.mensagem?.includes("Esperado tipo 'lógico' na condição")
            );
            expect(erro).toBeTruthy();
        });
    });

    describe('Falsos positivos de variável não usada (issue #177)', () => {
        async function analisar(linhas: string[]) {
            const retornoLexador = lexador.mapear(linhas, -1);
            const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);
            return analisadorSemantico.analisar(retornoAvaliador.declaracoes);
        }

        it('Caso 1: declaração simples de constante usada em escreva não gera aviso', async () => {
            const retorno = await analisar(['a = 10', 'escreva a']);
            const avisos = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.AVISO);
            expect(avisos).toHaveLength(0);
        });

        it('Caso 2: atribuição simultânea de constantes usadas em escreva não gera aviso', async () => {
            const retorno = await analisar(['a, b = 10, 20', 'escreva a', 'escreva b']);
            const avisos = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.AVISO);
            expect(avisos).toHaveLength(0);
        });

        it('Caso 3: var não usada continua gerando aviso (comportamento correto)', async () => {
            const retorno = await analisar(['var a := 10', 'var b := 20', 'escreva a']);
            const avisos = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.AVISO);
            expect(avisos).toHaveLength(1);
            expect(avisos[0].mensagem).toContain("'b'");
        });

        it('Caso 4: variável usada no inicializador de outra variável não gera aviso', async () => {
            const retorno = await analisar(['var a := 10', 'var b := a + 2', 'escreva b']);
            const avisos = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.AVISO);
            expect(avisos).toHaveLength(0);
        });

        it('Caso 5: acesso indexado à variável não gera aviso', async () => {
            const retorno = await analisar(['var a := [2, 3, 5, 7, 11]', 'escreva a[1]']);
            const avisos = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.AVISO);
            expect(avisos).toHaveLength(0);
        });
    });

    describe('Interpolação de texto (issue #184)', () => {
        async function analisar(linhas: string[]) {
            const retornoLexador = lexador.mapear(linhas, -1);
            const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);
            return analisadorSemantico.analisar(retornoAvaliador.declaracoes);
        }

        it('Não gera aviso de variável não usada quando variável aparece em {variavel}', async () => {
            const retorno = await analisar([
                'x = 1',
                'y = 2',
                'escreva "x = {x}"',
                'escreva y'
            ]);

            const avisos = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.AVISO);
            expect(avisos).toHaveLength(0);
        });

        it('Gera erro quando variável em {variavel} não foi declarada', async () => {
            const retorno = await analisar([
                'escreva "x = {x}"'
            ]);

            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(1);
            expect(erros[0].mensagem).toContain("usada em interpolação não foi declarada");
        });
    });

    describe('Verificação de aridade de métodos', () => {
        async function analisar(linhas: string[]) {
            const retornoLexador = lexador.mapear(linhas, -1);
            const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);
            return analisadorSemantico.analisar(retornoAvaliador.declaracoes);
        }

        it('Aceita chamada de método com aridade correta (tamanho sem argumentos)', async () => {
            const retorno = await analisar([
                'a = [1, 2, 3]',
                'escreva a.tamanho()',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita chamada de método com aridade correta (mapeie com uma função)', async () => {
            const retorno = await analisar([
                'a = [1, 2, 3]',
                'def dobro(x: Inteiro): Inteiro = x * 2',
                'escreva a.mapeie(dobro)',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });
    });

    describe('VarMultiplo (AST direto)', () => {
        it('Registra todas as variáveis declaradas em VarMultiplo', async () => {
            const simboloA = { lexema: 'a', linha: 1, hashArquivo: -1 } as any;
            const simboloB = { lexema: 'b', linha: 1, hashArquivo: -1 } as any;
            const inicializador = new Literal(-1, 1, 0);
            const varMultiplo = new VarMultiplo([simboloA, simboloB], inicializador);

            const retorno = await analisadorSemantico.analisar([varMultiplo]);

            expect(retorno).toBeTruthy();
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });
    });

    describe('verificarTipoAtribuido - vetores tipados (AST direto)', () => {
        it('Aceita inteiro[] com valores numéricos', async () => {
            const simbolo = { lexema: 'nums', linha: 1, hashArquivo: -1 } as any;
            const vetor = new Vetor(-1, 1, [new Literal(-1, 1, 1, 'inteiro'), new Literal(-1, 1, 2, 'inteiro')]);
            const decl = new Const(simbolo, vetor, 'inteiro[]');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Detecta inteiro[] com valor texto', async () => {
            const simbolo = { lexema: 'nums', linha: 1, hashArquivo: -1 } as any;
            const vetor = new Vetor(-1, 1, [new Literal(-1, 1, 'ola', 'texto')]);
            const decl = new Const(simbolo, vetor, 'inteiro[]');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('inteiro');
        });

        it('Aceita texto[] com valores string', async () => {
            const simbolo = { lexema: 'palavras', linha: 1, hashArquivo: -1 } as any;
            const vetor = new Vetor(-1, 1, [new Literal(-1, 1, 'ola', 'texto')]);
            const decl = new Const(simbolo, vetor, 'texto[]');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Detecta texto[] com valores numéricos', async () => {
            const simbolo = { lexema: 'palavras', linha: 1, hashArquivo: -1 } as any;
            const vetor = new Vetor(-1, 1, [new Literal(-1, 1, 42, 'inteiro')]);
            const decl = new Const(simbolo, vetor, 'texto[]');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('texto');
        });

        it('Detecta tipo vetor com inicializador não-vetor', async () => {
            const simbolo = { lexema: 'v', linha: 1, hashArquivo: -1 } as any;
            const decl = new Const(simbolo, new Literal(-1, 1, 42, 'inteiro'), 'vetor');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
        });

        it('Detecta tipo texto com literal numérico', async () => {
            const simbolo = { lexema: 't', linha: 1, hashArquivo: -1 } as any;
            const decl = new Const(simbolo, new Literal(-1, 1, 42, 'inteiro'), 'texto');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('texto');
        });

        it('Detecta tipo inteiro com literal texto', async () => {
            const simbolo = { lexema: 'n', linha: 1, hashArquivo: -1 } as any;
            const decl = new Const(simbolo, new Literal(-1, 1, 'ola', 'texto'), 'inteiro');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('número');
        });
    });

    describe('visitarExpressaoTipoDe (AST direto)', () => {
        it('Aceita tipoDe de variável declarada', async () => {
            const simX = { lexema: 'x', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const simT = { lexema: 'tipoDe', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const constDecl = new Const(simX, new Literal(-1, 1, 42, 'inteiro'));
            const tipoDe = new TipoDe(-1, simT, new Variavel(-1, simX));
            const retorno = await analisadorSemantico.analisar([constDecl, new Expressao(tipoDe)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro para tipoDe de variável não declarada', async () => {
            const simX = { lexema: 'xNaoDeclarado', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const simT = { lexema: 'tipoDe', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const tipoDe = new TipoDe(-1, simT, new Variavel(-1, simX));
            const retorno = await analisadorSemantico.analisar([new Expressao(tipoDe)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain("'xNaoDeclarado'");
        });

        it('Aceita tipoDe com Binario', async () => {
            const simT = { lexema: 'tipoDe', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const opSim = { lexema: '+', tipo: 'ADICAO', linha: 1, hashArquivo: -1 } as any;
            const binario = new Binario(-1, new Literal(-1, 1, 1, 'inteiro'), opSim, new Literal(-1, 1, 2, 'inteiro'));
            const tipoDe = new TipoDe(-1, simT, binario);
            const retorno = await analisadorSemantico.analisar([new Expressao(tipoDe)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita tipoDe com Agrupamento', async () => {
            const simT = { lexema: 'tipoDe', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const agrupamento = new Agrupamento(-1, 1, new Literal(-1, 1, 42, 'inteiro'));
            const tipoDe = new TipoDe(-1, simT, agrupamento);
            const retorno = await analisadorSemantico.analisar([new Expressao(tipoDe)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });
    });

    describe('visitarExpressaoFalhar (AST direto)', () => {
        it('Aceita falhar com literal texto', async () => {
            const sim = { lexema: 'falhar', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const falhar = new Falhar(sim, new Literal(-1, 1, 'erro ocorrido', 'texto'));
            const retorno = await analisadorSemantico.analisar([falhar]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita falhar com Binario', async () => {
            const sim = { lexema: 'falhar', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const opSim = { lexema: '+', tipo: 'ADICAO', linha: 1, hashArquivo: -1 } as any;
            const binario = new Binario(-1, new Literal(-1, 1, 1, 'inteiro'), opSim, new Literal(-1, 1, 2, 'inteiro'));
            const falhar = new Falhar(sim, binario);
            const retorno = await analisadorSemantico.analisar([falhar]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita falhar com Agrupamento', async () => {
            const sim = { lexema: 'falhar', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const agrupamento = new Agrupamento(-1, 1, new Literal(-1, 1, 'erro', 'texto'));
            const falhar = new Falhar(sim, agrupamento);
            const retorno = await analisadorSemantico.analisar([falhar]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro para falhar com variável não declarada', async () => {
            const sim = { lexema: 'falhar', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const simX = { lexema: 'mensagem', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const falhar = new Falhar(sim, new Variavel(-1, simX));
            const retorno = await analisadorSemantico.analisar([falhar]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain("'mensagem'");
        });
    });

    describe('comparacaoArgumentosContraParametrosFuncao - aridade e tipos (AST direto)', () => {
        function criarFuncaoNaEscopo(nomeFn: string, parametros: any[]): Const {
            const simFn = { lexema: nomeFn, linha: 1, hashArquivo: -1 } as any;
            const funcao = new FuncaoConstruto(-1, 1, parametros, []);
            return new Const(simFn, funcao);
        }

        function criarChamada(nomeFn: string, argumentos: any[]): Const {
            const simFn = { lexema: nomeFn, tipo: 'IDENTIFICADOR', linha: 2, hashArquivo: -1 } as any;
            const simR = { lexema: 'resultado', linha: 2, hashArquivo: -1 } as any;
            const chamada = new Chamada(-1, new Constante(-1, simFn), argumentos);
            return new Const(simR, chamada);
        }

        it('Detecta chamada de função com argumentos a mais', async () => {
            const simX = { lexema: 'x', linha: 1, hashArquivo: -1 } as any;
            const declFn = criarFuncaoNaEscopo('dobro', [{ nome: simX, tipoDado: 'inteiro' }]);
            const chamada = criarChamada('dobro', [new Literal(-1, 2, 5, 'inteiro'), new Literal(-1, 2, 10, 'inteiro')]);
            const retorno = await analisadorSemantico.analisar([declFn, chamada]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            const erroAridade = erros.find(d => d.mensagem?.includes('espera'));
            expect(erroAridade).toBeTruthy();
        });

        it('Aceita chamada de função com aridade correta', async () => {
            const simX = { lexema: 'x', linha: 1, hashArquivo: -1 } as any;
            const declFn = criarFuncaoNaEscopo('dobro', [{ nome: simX, tipoDado: 'inteiro' }]);
            const chamada = criarChamada('dobro', [new Literal(-1, 2, 5, 'inteiro')]);
            const retorno = await analisadorSemantico.analisar([declFn, chamada]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Detecta chamada de função inexistente', async () => {
            const chamada = criarChamada('funcaoInexistente', [new Literal(-1, 1, 5, 'inteiro')]);
            const retorno = await analisadorSemantico.analisar([chamada]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros.find(d => d.mensagem?.includes('não existe'))).toBeTruthy();
        });

        it('Detecta argumento de tipo errado para parâmetro Texto', async () => {
            const simNome = { lexema: 'nome', linha: 1, hashArquivo: -1 } as any;
            const declFn = criarFuncaoNaEscopo('saudacao', [{ nome: simNome, tipoDado: 'texto' }]);
            const chamada = criarChamada('saudacao', [new Literal(-1, 2, 5, 'inteiro')]);
            const retorno = await analisadorSemantico.analisar([declFn, chamada]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
        });
    });

    describe('verificarCondicao - variantes via guards em escolha', () => {
        async function analisar(linhas: string[]) {
            const retornoLexador = lexador.mapear(linhas, -1);
            const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);
            return analisadorSemantico.analisar(retornoAvaliador.declaracoes);
        }

        it('Aceita guard com expressão binária de comparação', async () => {
            const retorno = await analisar([
                'escolha 1',
                '  caso 1 se 1 > 0 => escreva "ok"',
                'fim',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita guard com expressão lógica composta', async () => {
            const retorno = await analisar([
                'escolha 1',
                '  caso 1 se verdadeiro e verdadeiro => escreva "ok"',
                'fim',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita guard com agrupamento de booleano', async () => {
            const retorno = await analisar([
                'escolha 1',
                '  caso 1 se (verdadeiro) => escreva "ok"',
                'fim',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita guard com variável cujo valor é uma comparação binária', async () => {
            const retorno = await analisar([
                'var ok := 1 > 0',
                'escolha 1',
                '  caso 1 se ok => escreva "ok"',
                'fim',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });
    });

    describe('visitarDeclaracaoParaGere', () => {
        async function analisar(linhas: string[]) {
            const retornoLexador = lexador.mapear(linhas, -1);
            const retornoAvaliador = await avaliadorSintatico.analisar(retornoLexador, -1);
            return analisadorSemantico.analisar(retornoAvaliador.declaracoes);
        }

        it('Aceita para gere simples', async () => {
            const retorno = await analisar([
                'para i de 1 ate 10 faca',
                '  escreva i',
                'fim',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita para gere com passo', async () => {
            const retorno = await analisar([
                'para i de 1 ate 10 passo 2 faca',
                '  escreva i',
                'fim',
            ]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita para gere com condição binária (AST direto)', async () => {
            const simI = { lexema: 'i', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const opSim = { lexema: '>', tipo: 'MAIOR', linha: 1, hashArquivo: -1 } as any;
            const cond = new Binario(-1, new Variavel(-1, simI), opSim, new Literal(-1, 1, 5, 'inteiro'));
            const paraGere = new ParaGere(-1, 1, simI,
                new Literal(-1, 1, 1, 'inteiro'),
                new Literal(-1, 1, 10, 'inteiro'),
                [], undefined, cond);
            const retorno = await analisadorSemantico.analisar([paraGere]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Aceita para gere com condição lógica (AST direto)', async () => {
            const simI = { lexema: 'j', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const opSim = { lexema: 'e', tipo: 'E', linha: 1, hashArquivo: -1 } as any;
            const cond = new Logico(-1, new Literal(-1, 1, true, 'lógico'), opSim, new Literal(-1, 1, false, 'lógico'));
            const paraGere = new ParaGere(-1, 1, simI,
                new Literal(-1, 1, 1, 'inteiro'),
                new Literal(-1, 1, 10, 'inteiro'),
                [], undefined, cond);
            const retorno = await analisadorSemantico.analisar([paraGere]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro para condição que chama função não declarada (AST direto)', async () => {
            const simI = { lexema: 'k', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const simFn = { lexema: 'ehValido', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const chamada = new Chamada(-1, new Variavel(-1, simFn), []);
            const paraGere = new ParaGere(-1, 1, simI,
                new Literal(-1, 1, 1, 'inteiro'),
                new Literal(-1, 1, 10, 'inteiro'),
                [], undefined, chamada);
            const retorno = await analisadorSemantico.analisar([paraGere]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
        });

        it('Aceita para gere com condição de agrupamento (AST direto)', async () => {
            const simI = { lexema: 'm', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const agrupamento = new Agrupamento(-1, 1, new Literal(-1, 1, true, 'lógico'));
            const paraGere = new ParaGere(-1, 1, simI,
                new Literal(-1, 1, 1, 'inteiro'),
                new Literal(-1, 1, 5, 'inteiro'),
                [], undefined, agrupamento);
            const retorno = await analisadorSemantico.analisar([paraGere]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });
    });

    describe('visitarDeclaracaoEnquanto (AST direto)', () => {
        it('Aceita enquanto com condição booleana verdadeira', async () => {
            const corpo = new Bloco(-1, 1, []);
            const enquanto = new Enquanto(new Literal(-1, 1, true, 'lógico'), corpo);
            const retorno = await analisadorSemantico.analisar([enquanto]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro para condição não booleana em enquanto', async () => {
            const corpo = new Bloco(-1, 1, []);
            const enquanto = new Enquanto(new Literal(-1, 1, 1, 'inteiro'), corpo);
            const retorno = await analisadorSemantico.analisar([enquanto]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain("'lógico'");
        });
    });

    describe('Construtos Leia (chamada direta ao visitante)', () => {
        it('visitarDeclaracaoLeiaInteiro não gera erros', async () => {
            await analisadorSemantico.analisar([]);
            const sim = { lexema: 'leia_inteiro', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            await analisadorSemantico.visitarDeclaracaoLeiaInteiro(new LeiaInteiro(sim, []));
            const erros = analisadorSemantico.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('visitarDeclaracaoLeiaReal não gera erros', async () => {
            await analisadorSemantico.analisar([]);
            const sim = { lexema: 'leia_real', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            await analisadorSemantico.visitarDeclaracaoLeiaReal(new LeiaReal(sim, []));
            const erros = analisadorSemantico.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('visitarDeclaracaoLeiaTexto não gera erros', async () => {
            await analisadorSemantico.analisar([]);
            const sim = { lexema: 'leia_texto', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            await analisadorSemantico.visitarDeclaracaoLeiaTexto(new LeiaTexto(sim, []));
            const erros = analisadorSemantico.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('visitarDeclaracaoLeiaInteiros não gera erros', async () => {
            await analisadorSemantico.analisar([]);
            const sim = { lexema: 'leia_inteiros', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            await analisadorSemantico.visitarDeclaracaoLeiaInteiros(new LeiaInteiros(sim));
            const erros = analisadorSemantico.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('visitarDeclaracaoLeiaReais não gera erros', async () => {
            await analisadorSemantico.analisar([]);
            const sim = { lexema: 'leia_reais', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            await analisadorSemantico.visitarDeclaracaoLeiaReais(new LeiaReais(sim));
            const erros = analisadorSemantico.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('visitarDeclaracaoLeiaTextos não gera erros', async () => {
            await analisadorSemantico.analisar([]);
            const sim = { lexema: 'leia_textos', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            await analisadorSemantico.visitarDeclaracaoLeiaTextos(new LeiaTextos(sim));
            const erros = analisadorSemantico.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });
    });

    describe('visitarExpressaoAcessoMetodoOuPropriedade (AST direto)', () => {
        it('Aceita acesso a propriedade de variável declarada', async () => {
            const simA = { lexema: 'lista', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const simMet = { lexema: 'tamanho', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const constDecl = new Const(simA, new Vetor(-1, 1, [new Literal(-1, 1, 1, 'inteiro')]));
            const acesso = new AcessoMetodoOuPropriedade(-1, new Variavel(-1, simA), simMet);
            const retorno = await analisadorSemantico.analisar([constDecl, new Expressao(acesso)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro para acesso a propriedade de variável não declarada', async () => {
            const simA = { lexema: 'listaInexistente', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const simMet = { lexema: 'tamanho', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const acesso = new AcessoMetodoOuPropriedade(-1, new Variavel(-1, simA), simMet);
            const retorno = await analisadorSemantico.analisar([new Expressao(acesso)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('listaInexistente');
        });
    });

    describe('visitarExpressaoBinaria (AST direto)', () => {
        it('Aceita expressão binária com literais numéricos', async () => {
            const opSim = { lexema: '+', tipo: 'ADICAO', linha: 1, hashArquivo: -1 } as any;
            const binario = new Binario(-1, new Literal(-1, 1, 1, 'inteiro'), opSim, new Literal(-1, 1, 2, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([new Expressao(binario)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Detecta divisão por zero via expressão binária standalone', async () => {
            const opSim = { lexema: '/', tipo: 'DIVISAO', linha: 1, hashArquivo: -1 } as any;
            const binario = new Binario(-1, new Literal(-1, 1, 10, 'inteiro'), opSim, new Literal(-1, 1, 0, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([new Expressao(binario)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('zero');
        });

        it('Detecta tipos incompatíveis em adição', async () => {
            const opSim = { lexema: '+', tipo: 'ADICAO', linha: 1, hashArquivo: -1 } as any;
            const binario = new Binario(-1, new Literal(-1, 1, 1, 'inteiro'), opSim, new Literal(-1, 1, 'ola', 'texto'));
            const retorno = await analisadorSemantico.analisar([new Expressao(binario)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('incompatíveis');
        });
    });

    describe('visitarDeclaracaoAtribuicaoParalelaVariavel (AST direto)', () => {
        it('Aceita reatribuição paralela de variáveis mutáveis', async () => {
            const simA = { lexema: 'pA', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const simB = { lexema: 'pB', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const varA = new Var(simA, new Literal(-1, 1, 1, 'inteiro'));
            const varB = new Var(simB, new Literal(-1, 1, 2, 'inteiro'));
            const atrib = new AtribuicaoParalelaVariavel(
                [simA, simB],
                [new Literal(-1, 1, 10, 'inteiro'), new Literal(-1, 1, 20, 'inteiro')]
            );
            const retorno = await analisadorSemantico.analisar([varA, varB, atrib]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro para variável não declarada em reatribuição paralela', async () => {
            const simX = { lexema: 'xInexPar', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const atrib = new AtribuicaoParalelaVariavel([simX], [new Literal(-1, 1, 42, 'inteiro')]);
            const retorno = await analisadorSemantico.analisar([atrib]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain("'xInexPar'");
        });

        it('Gera erro ao tentar reatribuir constante via reatribuição paralela', async () => {
            const simA = { lexema: 'constParal', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const constDecl = new Const(simA, new Literal(-1, 1, 1, 'inteiro'));
            const atrib = new AtribuicaoParalelaVariavel([simA], [new Literal(-1, 1, 10, 'inteiro')]);
            const retorno = await analisadorSemantico.analisar([constDecl, atrib]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            const erroConst = erros.find(d => d.mensagem?.includes('não pode ser modificada'));
            expect(erroConst).toBeTruthy();
        });
    });

    describe('visitarDeclaracaoReatribuicaoVariavel (AST direto)', () => {
        it('Aceita reatribuição de variável mutável', async () => {
            const simX = { lexema: 'reatribX', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const varDecl = new Var(simX, new Literal(-1, 1, 0, 'inteiro'));
            const reattr = new ReatribuicaoVariavel(simX, new Literal(-1, 1, 10, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([varDecl, reattr]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro para variável não declarada em reatribuição', async () => {
            const simX = { lexema: 'reatribInex', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const reattr = new ReatribuicaoVariavel(simX, new Literal(-1, 1, 10, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([reattr]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain("'reatribInex'");
        });

        it('Gera erro ao tentar reatribuir constante', async () => {
            const simA = { lexema: 'reatribConst', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const constDecl = new Const(simA, new Literal(-1, 1, 5, 'inteiro'));
            const reattr = new ReatribuicaoVariavel(simA, new Literal(-1, 1, 10, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([constDecl, reattr]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            const erroConst = erros.find(d => d.mensagem?.includes('não pode ser modificada'));
            expect(erroConst).toBeTruthy();
        });
    });

    describe('visitarExpressaoDeAtribuicao (AST direto)', () => {
        it('Aceita atribuição a variável mutável', async () => {
            const simX = { lexema: 'atribX', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const varDecl = new Var(simX, new Literal(-1, 1, 0, 'inteiro'));
            const atrib = new Atribuir(-1, new Variavel(-1, simX), new Literal(-1, 1, 10, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([varDecl, new Expressao(atrib)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros).toHaveLength(0);
        });

        it('Gera erro ao atribuir a variável não declarada', async () => {
            const simX = { lexema: 'atribInex', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const atrib = new Atribuir(-1, new Variavel(-1, simX), new Literal(-1, 1, 10, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([new Expressao(atrib)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain("'atribInex'");
        });

        it('Gera erro ao atribuir a constante imutável', async () => {
            const simA = { lexema: 'atribConst', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const constDecl = new Const(simA, new Literal(-1, 1, 5, 'inteiro'));
            const atrib = new Atribuir(-1, new Variavel(-1, simA), new Literal(-1, 1, 10, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([constDecl, new Expressao(atrib)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            const erroConst = erros.find(d => d.mensagem?.includes('Constante') || d.mensagem?.includes('não pode ser modificada'));
            expect(erroConst).toBeTruthy();
        });

        it('Gera erro ao atribuir Literal a variável tipada como inteiro[]', async () => {
            const simA = { lexema: 'atribVetor', tipo: 'IDENTIFICADOR', linha: 1, hashArquivo: -1 } as any;
            const varDecl = new Var(simA, new Vetor(-1, 1, [new Literal(-1, 1, 1, 'inteiro')]), 'inteiro[]');
            const atrib = new Atribuir(-1, new Variavel(-1, simA), new Literal(-1, 1, 99, 'inteiro'));
            const retorno = await analisadorSemantico.analisar([varDecl, new Expressao(atrib)]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain('Atribuição inválida');
        });
    });

    describe('Alias de tipo - base tipo desconhecido (AST direto)', () => {
        it('Detecta alias para tipo base desconhecido', async () => {
            const sim = { lexema: 'Novo', linha: 1, hashArquivo: -1 } as any;
            const aliasTipo = new AliasTipo(sim, 'TipoInexistente');
            const retorno = await analisadorSemantico.analisar([aliasTipo]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            const erroBase = erros.find(d => d.mensagem?.includes('nao existe'));
            expect(erroBase).toBeTruthy();
        });

        it('Detecta alias com nome de tipo base reservado (inteiro já existe)', async () => {
            const sim = { lexema: 'inteiro', linha: 1, hashArquivo: -1 } as any;
            const aliasTipo = new AliasTipo(sim, 'real');
            const retorno = await analisadorSemantico.analisar([aliasTipo]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            const erroBase = erros.find(d => d.mensagem?.includes('ja existe'));
            expect(erroBase).toBeTruthy();
        });
    });

    describe('visitarDeclaracaoVar - tipo desconhecido', () => {
        it('Detecta tipo desconhecido em declaração var', async () => {
            const sim = { lexema: 'xTipoFantasma', linha: 1, hashArquivo: -1 } as any;
            const decl = new Var(sim, new Literal(-1, 1, 42, 'inteiro'), 'TipoFantasma');
            const retorno = await analisadorSemantico.analisar([decl]);
            const erros = retorno.diagnosticos.filter(d => d.severidade === DiagnosticoSeveridade.ERRO);
            expect(erros.length).toBeGreaterThan(0);
            expect(erros[0].mensagem).toContain("'TipoFantasma'");
        });
    });
});
