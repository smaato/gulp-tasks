
/**
 * @description Template related tasks
 */

module.exports = function templateGulpTasks(src, dst) {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');
  var gulpJade = require('gulp-jade');

  var TEMPLATES_DST = dst || './dist';
  var TEMPLATES_SRC = src || [];

  gulp.task('jade', function jade() {
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
