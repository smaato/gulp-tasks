
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

  gulp.task('assets', function assets() {
    gulp
      .src(ASSETS_CFG.src)
      .pipe(gulp.dest(ASSETS_CFG.dst))
      .pipe(gulpConnect.reload());
  });
};
