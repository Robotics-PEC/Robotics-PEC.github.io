const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function loadModule(filePath) {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const result = ts.transpileModule(content, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2020
        }
    });
    const m = { exports: {} };
    const wrapped = new Function('require', 'exports', 'module', '__filename', '__dirname', result.outputText);
    wrapped(
        (dep) => {
            if (dep.startsWith('./') || dep.startsWith('../')) {
                const targetPath = path.resolve(path.dirname(fullPath), dep);
                return loadModule(targetPath.endsWith('.ts') ? targetPath : targetPath + '.ts');
            }
            return require(dep);
        },
        m.exports,
        m,
        fullPath,
        path.dirname(fullPath)
    );
    return m.exports;
}

const testModule = loadModule('./src/__tests__/inventory/inventory-unit.test.ts');
testModule.runInventoryUnitTests();
