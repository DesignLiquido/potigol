export function inferirTipoVariavel(variavel: string | number | Array<any> | boolean | null | undefined) {
    const tipo = typeof variavel;
    switch (tipo) {
        case 'string':
            return 'Texto';
        case 'number':
            if (variavel.toString().indexOf('.') > -1) return 'Real';
            return 'Inteiro';
        case 'bigint':
            return 'InteiroGrande';
        case 'boolean':
            return 'Lógico';
        case 'undefined':
            return 'Nulo';
        case 'object':
            if (Array.isArray(variavel)) {
                // Check if it's a matrix (2D array)
                if (variavel.length > 0 && Array.isArray(variavel[0])) {
                    // Check if it's a cube (3D array)
                    if (variavel[0].length > 0 && Array.isArray(variavel[0][0])) {
                        return 'Cubo';
                    }
                    return 'Matriz';
                }
                return 'Lista';
            }
            // Check for custom structures
            if (variavel && variavel.constructor) {
                if (variavel.constructor.name === 'EstruturaMatriz') return 'Matriz';
                if (variavel.constructor.name === 'EstruturaCubo') return 'Cubo';
                if (variavel.constructor.name === 'EstruturaTupla') return 'Tupla';
            }
            if (variavel === null) return 'nulo';
            if (variavel.constructor.name === 'DeleguaModulo') return 'módulo';
            return 'Dicionário';
        case 'function':
            return 'Função';
        case 'symbol':
            return 'Símbolo';
    }
}
