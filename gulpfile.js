
const gulp = require('gulp');
const gulpJasmine = require('gulp-jasmine');
const lintJs = require('./index').lintJs;

gulp.task('lint', lintJs({
  src: [
    './*.js',
    './src/**/*.js',
  ],
}).task);

gulp.task('unit', () => {
  return gulp.src('./src/**/*.js')
    .pipe(gulpJasmine({
      verbose: true,
    }));
});

gulp.task('test', ['lint', 'unit']);
