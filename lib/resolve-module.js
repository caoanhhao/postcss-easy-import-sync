var fs = require('fs');
var resolve = require('resolve');
var addPrefix = require('./add-prefix');
var hasExtensions = require('./has-extensions');

module.exports = function (id, base, opts) {
    var prefix = opts.prefix;
    var prefixedId = prefix ? addPrefix(id, prefix) : id;
    var extensions = opts.extensions;
    var resolveOpts = {
        basedir: base,
        extensions: opts.extensions,
        moduleDirectory: [
            'node_modules',
            'web_modules'
        ],
        paths: opts.path,
        isFile: function (file) {
            try {
                return fs.statSync(file).isFile();
            } catch (e) {
                return false;
            }
        },
        packageFilter: function (pkg) {
            if (pkg.style) {
                pkg.main = pkg.style;
            } else if (
                !pkg.main ||
                !hasExtensions(pkg.main, extensions)
            ) {
                pkg.main = 'index' + extensions[0];
            }
            return pkg;
        }
    };

    try {
        return resolve.sync('./' + prefixedId, resolveOpts);
    } catch (e) {
        try {
            if (!prefix) {
                throw Error();
            }
            return resolve.sync(prefixedId, resolveOpts);
        } catch (e1) {
            try {
                return resolve.sync('./' + id, resolveOpts);
            } catch (e2) {
                try {
                    return resolve.sync(id, resolveOpts);
                } catch (e3) {
                    throw e3;
                }
            }
        }
    }
};
