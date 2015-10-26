
/**
 * @description Lint related tasks
 */

// ESLint
module.exports.eslint = function eslint(config) {
  var gulp = require('gulp');
  var gulpEslint = require('gulp-eslint');

  var LINT_CFG = config || {
    src: []
  };

  gulp.task('lint', function lint() {
    return gulp.src(LINT_CFG.src)
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .on('error', function exitGulp() {
        throw new Error('Linting failed');
      });
  });
};
