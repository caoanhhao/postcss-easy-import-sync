import test from 'ava';
import path from 'path';
import resolveGlob from '../lib/resolve-glob.js';

const resolve = p => path.resolve('fixtures/glob', p);

// for tests to work with ava >=0.18
process.chdir(__dirname);

test('should resolve relative globs', t => {
    let result = resolveGlob('relative.*', path.resolve('fixtures/glob'), {
        extensions: ['.css', '.scss'],
        path: []
    });
    return t.deepEqual(result, [
        'relative.bar.scss',
        'relative.foo.css'
    ].map(resolve));
});

test('should resolve globs without magic and extension', t => {
    let result = resolveGlob('ext', path.resolve('fixtures/glob'), {
        extensions: ['.css', '.scss'],
        path: []
    });
    return t.deepEqual(result, [
        'ext.css',
        'ext.scss'
    ].map(resolve));
});

test('should resolve globs in paths', t => {
    let result = resolveGlob('path.*', path.resolve('fixtures/glob'), {
        extensions: ['.css', '.scss'],
        path: [
            'path-1',
            'path-2'
        ].map(resolve)
    });
    return t.deepEqual(result, [
        'path.0.css',
        'path-1/path.1-1.css',
        'path-1/path.1.3.scss',
        'path-2/path.2.css',
        'path-2/path.2.scss'
    ].map(resolve));
});

test('should not resolve globs with empty extensions', t => {
    let result = resolveGlob('{path,relative}.*', path.resolve('fixtures/glob'),
        {
            extensions: [],
            path: [
                'path-1',
                'path-2'
            ].map(resolve)
        });
    return t.is(result.length, 0);
});

test('should resolve prefixed files in favour of non-prefixed', t => {
    let result = resolveGlob('prefixed/prefix.*', path.resolve('fixtures/glob'),
        {
            extensions: ['.css', '.scss'],
            path: [],
            prefix: '_'
        });
    return t.deepEqual(result, [
        'prefixed/_prefix.foo.css',
        'prefixed/_prefix.foo.scss'
    ].map(resolve));
});

test('should resolve non-prefixed files with the same name if prefixed cannot be found', t => { // eslint-disable-line max-len
    let result = resolveGlob('prefixed/without/*.*', path.resolve('fixtures/glob'), // eslint-disable-line max-len
        {
            extensions: ['.css', '.scss'],
            path: [],
            prefix: '_'
        });
    return t.deepEqual(result, [
        'prefixed/without/_baz.css',
        'prefixed/without/_foo.css',
        'prefixed/without/_z.css',
        'prefixed/without/bar.css',
        'prefixed/without/file.css'
    ].map(resolve));
});

test('should resolve every match if prefix is not defined', t => { // eslint-disable-line max-len
    // eslint-disable-next-line max-len
    let result = resolveGlob('prefixed/without/*.*', path.resolve('fixtures/glob'),
        {
            extensions: ['.css', '.scss'],
            path: []
        });
    return t.deepEqual(result, [
        'prefixed/without/_baz.css',
        'prefixed/without/_foo.css',
        'prefixed/without/_z.css',
        'prefixed/without/bar.css',
        'prefixed/without/baz.css',
        'prefixed/without/file.css',
        'prefixed/without/foo.css',
        'prefixed/without/z.css'
    ].map(resolve));
});

test('should resolve globs in node_modules', t => {
    // eslint-disable-next-line max-len
    let result = resolveGlob('css.globtest/*.css', path.resolve('fixtures/glob'),
        {
            extensions: ['.css', '.scss'],
            path: []
        });
    return t.deepEqual(result, [
        path.resolve('node_modules/css.globtest/glob1.css')
    ]);
});
