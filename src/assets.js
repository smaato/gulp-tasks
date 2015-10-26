
/**
 * @description Asset related tasks
 */

// Copy and trigger live reload
module.exports.copy = function copy(config) {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var ASSETS_CFG = config || {
    dst: './dist/assets',
    src: []
  };

  if (!ASSETS_CFG.dst || !ASSETS_CFG.src) {
    throw new Error('Invalid configuration');
  }

  gulp.task('assets', function assets() {
    return gulp
      .src(ASSETS_CFG.src)
      .pipe(gulp.dest(ASSETS_CFG.dst))
      .pipe(gulpConnect.reload());
  });
};
