
// Copying
module.exports.copy = require('./src/copy');

// Compilation
module.exports.compileCss = require('./src/compileCss');
module.exports.compileHtml = require('./src/compileHtml');
module.exports.compileJs = require('./src/compileJs');

// Deploying
module.exports.deploy = require('./src/deploy');

// Linting
module.exports.lintJs = require('./src/lintJs');

// Minification
module.exports.minifyCss = require('./src/minifyCss');
module.exports.minifyJs = require('./src/minifyJs');

// Serving files
module.exports.serve = require('./src/serve');

// Tests
module.exports.testE2e = require('./src/testE2e');
module.exports.testUnit = require('./src/testUnit');
