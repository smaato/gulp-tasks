
var gulp = require('gulp');
var lintGulpTaskCollection = require('./src/lint');

var LINT_SRC = './**/*.js';

lintGulpTaskCollection.eslint({
  src: LINT_SRC
});

gulp.task('default', ['lint']);
