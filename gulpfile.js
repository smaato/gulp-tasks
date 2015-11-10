
const gulp = require('gulp');
const gulpJasmine = require('gulp-jasmine');
const lint = require('./src/lint');

lint.eslint({
  src: [
    './*.js',
    './src/**/*.js',
  ],
});

gulp.task('test', ['lint'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(gulpJasmine({
      verbose: true,
    }));
});