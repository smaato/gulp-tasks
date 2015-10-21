
/**
 * @description Lint related tasks
 */

// ESLint
module.exports.eslint = function eslint(src) {
  var gulp = require('gulp');
  var gulpEslint = require('gulp-eslint');

  var LINT_SRC = src || [];

  gulp.task('lint', function lint() {
    return gulp.src(LINT_SRC)
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .on('error', function exitGulp() {
        throw new Error('Linting failed');
      });
  });
};
