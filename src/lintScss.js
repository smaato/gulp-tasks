
const gulp = require('gulp');
const gulpScssLint = require('gulp-scss-lint');
const TextUtils = require('./services/TextUtils');

module.exports = customConfig => {
  const config = Object.assign({
    file: undefined,
    src: './src/**/*.scss',
  }, customConfig);

  if (!config.src) {
    throw new Error(TextUtils.cleanString(
      `Invalid configuration: value of src needs to be a glob or an array
      of globs.`
    ));
  }

  // Lint SCSS with scss_lint.
  function lintScss() {
    return gulp.src(config.src)
      .pipe(gulpScssLint({
        config: config.file,
      }))
      .pipe(gulpScssLint.failReporter());
  }

  return {
    task: lintScss,
    config,
  };
};
