
var gulp = require('gulp');
var gulpJasmine = require('gulp-jasmine');
var lintGulpTaskCollection = require('./src/lint');

var LINT_SRC = './**/*.js';

lintGulpTaskCollection.eslint({
  src: LINT_SRC
});

gulp.task('test', ['lint'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(gulpJasmine({
      verbose: true
    }));
});

gulp.task('default', ['test']);
