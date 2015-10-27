
/**
 * @description Lint related tasks
 */

// ESLint
module.exports.eslint = (config) => {
  var gulp = require('gulp');
  var gulpEslint = require('gulp-eslint');

  var LINT_CONFIG = config || {
    src: []
  };

  gulp.task((LINT_CONFIG.taskName || 'lint'), () => {
    return gulp.src(LINT_CONFIG.src)
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .on('error', () => {
        throw new Error('Linting failed');
      });
  });
};
