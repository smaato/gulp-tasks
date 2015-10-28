
/**
 * @description Asset related tasks
 */

// Copy and trigger live reload
module.exports.copy = (config) => {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var ASSETS_CONFIG = Object.assign({
    dst: './dist/assets',
    src: './src/assets/**/*',
    taskName: 'assets'
  }, config);

  if (!ASSETS_CONFIG.dst || !ASSETS_CONFIG.src) {
    throw new Error('Invalid configuration: value of dst needs to be a path and value of src needs to be a glob or an array of globs.');
  }

  gulp.task(ASSETS_CONFIG.taskName, () => {
    return gulp
      .src(ASSETS_CONFIG.src)
      .pipe(gulp.dest(ASSETS_CONFIG.dst))
      .pipe(gulpConnect.reload());
  });
};
