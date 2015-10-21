
/**
 * @description Template related tasks
 */

// Jade
module.exports.jade = function jade(src, dst) {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');
  var gulpJade = require('gulp-jade');

  var TEMPLATES_DST = dst || './dist';
  var TEMPLATES_SRC = src || [];

  gulp.task('templates', function templates() {
    return gulp.src(TEMPLATES_SRC)
      .pipe(gulpJade({
        locals: {
          DATE_TIME: (new Date().getTime())
        }
      }))
      .pipe(gulp.dest(TEMPLATES_DST))
      .pipe(gulpConnect.reload());
  });
};
