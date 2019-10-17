import test from 'ava';
import path from 'path';
import resolveModule from '../lib/resolve-module.js';

const resolve = p => path.resolve('fixtures/module', p);

// for tests to work with ava >=0.18
process.chdir(__dirname);

test('should resolve file (css)', t => {
    let result = resolveModule('index', path.resolve('fixtures/module'), {
        extensions: ['.css', '.scss']
    });
    return t.is(result, resolve('index.css'));
});

test('should resolve file (scss)', t => {
    let result = resolveModule('index', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css']
    });
    return t.is(result, resolve('index.scss'));
});

test('should resolve file with extension', t => {
    let result = resolveModule('index.css', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css']
    });
    return t.is(result, resolve('index.css'));
});

test('should resolve local module (css)', t => {
    let result = resolveModule('module-1', path.resolve('fixtures/module'), {
        extensions: ['.css', '.scss']
    });
    return t.is(result, resolve('module-1/main.css'));
});

test('should resolve local module (index.scss)', t => {
    let result = resolveModule('module-2', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css']
    });
    return t.is(result, resolve('module-2/index.scss'));
});

test('should resolve file via path', t => {
    let result = resolveModule('foo', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css'],
        path: [
            resolve('path-1'),
            resolve('path-2')
        ]
    });
    return t.is(result, resolve('path-1/foo.css'));
});

test('should resolve prefixed file', t => {
    let result = resolveModule('bar', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css'],
        prefix: '_'
    });
    return t.is(result, resolve('_bar.css'));
});

test('should resolve prefixed local module', t => {
    let result = resolveModule('module-3', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css'],
        prefix: '_'
    });
    return t.is(result, resolve('_module-3/index.scss'));
});

test('should resolve prefixed file via path', t => {
    let result = resolveModule('foo', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css'],
        prefix: '_',
        path: [
            resolve('path-1')
        ]
    });
    return t.is(result, resolve('path-1/_foo.css'));
});

test('should fallback and resolve non-prefix file if only match', t => {
    let result = resolveModule('path-2/foo', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css'],
        prefix: '_'
    });
    return t.is(result, resolve('path-2/foo.css'));
});

test('should fallback and resolve non-prefix file via path', t => {
    let result = resolveModule('foo', path.resolve('fixtures/module'), {
        extensions: ['.scss', '.css'],
        prefix: '_',
        path: [
            resolve('path-2')
        ]
    });
    return t.is(result, resolve('path-2/foo.css'));
});
