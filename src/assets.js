
/**
 * @description Asset related tasks
 */

module.exports = function assetGulpTasks(src, dst) {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var ASSETS_DST = dst || './dist/assets';
  var ASSETS_SRC = src || [];

  gulp.task('assets', function assets() {
    gulp
      .src(ASSETS_SRC)
      .pipe(gulp.dest(ASSETS_DST))
      .pipe(gulpConnect.reload());
  });
};
