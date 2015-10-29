
/**
 * @description Lint related tasks
 */

// ESLint
module.exports.eslint = (config) => {
  var gulp = require('gulp');
  var gulpEslint = require('gulp-eslint');

  var LINT_CONFIG = Object.assign({
    src: './src/**/*.js',
    taskName: 'lint'
  }, config);

  if (!LINT_CONFIG.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  gulp.task(LINT_CONFIG.taskName, () => {
    return gulp.src(LINT_CONFIG.src)
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .on('error', () => {
        throw new Error('Linting failed');
      });
  });
};
