
const gulp = require('gulp');
const gulpJasmine = require('gulp-jasmine');
const lint = require('./src/lint');

lint.eslint({
  src: [
    './*.js',
    './src/**/*.js',
  ],
});

gulp.task('unit', () => {
  return gulp.src('./src/**/*.js')
    .pipe(gulpJasmine({
      verbose: true,
    }));
});

gulp.task('test', ['lint', 'unit']);
