import test from 'ava';
import easyImportSync from '../';
import path from 'path';
import postcss from 'postcss';

const msg = err => 'postcss-easy-import: ' + err;

// for tests to work with ava >=0.18
process.chdir(__dirname);

function preprocess(input, output, opts, t) {
    return postcss([ easyImportSync(opts) ]).process(input)
        .then(result => {
            console.log(result.css);
            console.log(output);
            t.is(result.css, output);
            t.is(result.warnings().length, 0);
        });
}

test('should fail on incorrect \'prefix\'', t => {
    t.throws(() => {
        easyImportSync({
            prefix: 1
        });
    }, msg('\'prefix\' option should be a string or false'));
});

test('should not fail on correct \'prefix\'', t => {
    t.notThrows(() => {
        easyImportSync({
            prefix: 'some string'
        });
    });

    t.notThrows(() => {
        easyImportSync({
            prefix: false
        });
    });
});

test('should fail on incorrect \'extensions\'', t => {
    const error = msg(
        '\'extensions\' option should be string or array of strings'
    );

    t.throws(() => {
        easyImportSync({
            extensions: 1
        });
    }, error);

    t.throws(() => {
        easyImportSync({
            extensions: ''
        });
    }, error);

    t.throws(() => {
        easyImportSync({
            extensions: []
        });
    }, error);

    t.throws(() => {
        easyImportSync({
            extensions: ['']
        });
    }, error);
});

test('should not fail on correct \'extensions\'', t => {
    t.notThrows(() => {
        easyImportSync({
            extensions: '.css'
        });
    });

    t.notThrows(() => {
        easyImportSync({
            extensions: ['.css', '.scss']
        });
    });
});

test('should handle glob imports', t => {
    return preprocess(
        '@import "./*.css";\n',
        '.bar {\n    color: green;\n}\n.foo {\n    color: red;\n}\n',
        { root: path.resolve('./fixtures/integration') },
        t
    );
});

test('should handle module imports', t => {
    return preprocess(
        '@import "./module/baz.css";\n',
        '.baz {\n    color: blue;\n}\n',
        { root: path.resolve('./fixtures/integration') },
        t
    );
});

test('should handle glob and module imports together', t => {
    return preprocess(
        '@import "./module/baz.css";\n @import "./*.css";',
        '.baz {\n    color: blue;\n}\n .bar {\n    color: green;\n}\n .foo {\n    color: red;\n}', // eslint-disable-line max-len
        { root: path.resolve('./fixtures/integration') },
        t
    );
});

test('should import glob from node_modules', t => {
    return preprocess(
        '@import "css.globtest/*.css"',
        '.bar {\n  color: green;\n}\n.foo {\n  color: tomato;\n}',
        {},
        t
    );
});
