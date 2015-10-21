var gulp = require('gulp');

var LINT_SRC = './**/*.js';

require('./src/lint').eslint(LINT_SRC);

gulp.task('default', ['lint']);
