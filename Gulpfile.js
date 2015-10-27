
var gulp = require('gulp');
var gulpJasmine = require('gulp-jasmine');
var lintGulpTaskCollection = require('./src/lint');

lintGulpTaskCollection.eslint({
  src: [
    './*.js',
    './src/**/*.js'
  ]
});

gulp.task('test', ['lint'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(gulpJasmine({
      verbose: true
    }));
});

gulp.task('default', ['test']);
