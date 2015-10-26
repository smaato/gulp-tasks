
var gulp = require('gulp');
var gulpJasmine = require('gulp-jasmine');
var lintGulpTaskCollection = require('./src/lint');

var LINT_SRC = './**/*.js';

lintGulpTaskCollection.eslint({
  src: LINT_SRC
});

gulp.task('test', ['lint'], function test() {
  return gulp.src('./src/**/*.js')
    .pipe(gulpJasmine());
});

gulp.task('default', ['test']);
