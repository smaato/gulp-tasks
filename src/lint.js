/**
 * @description Lint related tasks
 */

module.exports = function lint(src) {
  var gulp = require('gulp');
  var gulpEslint = require('gulp-eslint');

  var LINT_SRC = src || [];

  /**
   * @description ESLint
   */
  gulp.task('eslint', function eslint() {
    return gulp.src(LINT_SRC)
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .on('error', function exitGulp() {
        throw new Error('Linting failed');
      });
  });
};
