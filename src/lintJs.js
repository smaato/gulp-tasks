
const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');

module.exports = (customConfig) => {
  const config = Object.assign({
    src: './src/**/*.js',
  }, customConfig);

  if (!config.src) {
    throw new Error(
      'Invalid configuration: value of src needs to be a glob or an array ' +
      'of globs.'
    );
  }

  // Lint JS with ESLint.
  function lintJs() {
    return gulp.src(config.src)
      .pipe(gulpEslint())
      .pipe(gulpEslint.format())
      .pipe(gulpEslint.failAfterError())
      .on('error', () => {
        throw new Error('JS Linting failed');
      });
  }

  return {
    task: lintJs,
    config,
  };
};
