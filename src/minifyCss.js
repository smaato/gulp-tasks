
const gulp = require('gulp');
const gulpCssmin = require('gulp-cssmin');
const gulpRename = require('gulp-rename');
const TextUtils = require('./services/TextUtils');

module.exports = customConfig => {
  const config = Object.assign({
    src: './dist/css',
  }, customConfig);

  if (!config.src) {
    throw new Error(TextUtils.cleanString(
      `Invalid configuration: value of src needs to be a glob or an array
      of globs.`
    ));
  }

  // Minify CSS with clean-css.
  function minifyCss() {
    return gulp.src(`${config.src}/dist.css`)
      .pipe(gulpCssmin())
      .pipe(gulpRename('dist.min.css'))
      .pipe(gulp.dest(config.src));
  }

  return {
    task: minifyCss,
    config,
  };
};
