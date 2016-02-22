
const gulp = require('gulp');
const gulpConnect = require('gulp-connect');
const gulpJade = require('gulp-jade');
const TextUtils = require('./services/TextUtils');

// Jade
module.exports = customConfig => {
  const config = Object.assign({
    src: './src/**/*.jade',
    dst: './dist',
  }, customConfig);

  if (!config.src) {
    throw new Error(TextUtils.cleanString(
      `Invalid configuration: value of src needs to be a glob or an array
      of globs.`
    ));
  }

  if (!config.dst) {
    throw new Error('Invalid configuration: value of dst needs to be a path.');
  }

  // Compile Jade templates into HTML.
  function compileHtml() {
    return gulp.src(config.src)
      .pipe(gulpJade({
        locals: {
          DATE_TIME: new Date().getTime(),
        },
      }))
      .pipe(gulp.dest(config.dst))
      .pipe(gulpConnect.reload());
  }

  return {
    task: compileHtml,
    config,
  };
};
