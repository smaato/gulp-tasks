var gulp = require('gulp');

var LINT_SRC = './**/*.js';

require('./src/lint')(LINT_SRC);

gulp.task('default', ['eslint']);
