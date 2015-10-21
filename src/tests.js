
/**
 * @description Test related tasks
 */

module.exports = function testGulpTasks(config) {
  var del = require('del');
  var gulp = require('gulp');
  var gulpBabel = require('gulp-babel');
  var gulpConnect = require('gulp-connect');
  var gulpNightwatch = require('gulp-nightwatch');
  var gulpReplace = require('gulp-replace');
  var karmaServer = require('karma').Server;
  var runSequence = require('run-sequence');

  var TEST_CFG = config || {
    e2e: {
      connect: {},
      dir: './e2e/',
      shim: '',
      wasNightwatchFailing: false
    },
    karma: {}
  };

  /**
   * @description Unit test task
   */
  gulp.task('unit', function unit(callback) {
    return karmaServer.start(TEST_CFG.karma, function exitGulp(exitStatus) {
      if (exitStatus) {
        throw new Error('Unit testing failed');
      } else {
        callback(exitStatus);
      }
    });
  });

  /**
   * @description End-to-end test tasks
   */
  gulp.task('e2e:startConnect', function e2eStartConnect() {
    gulpConnect.server(TEST_CFG.e2e.connect);
  });

  gulp.task('e2e:clean', function e2eClean(callback) {
    return del([
      TEST_CFG.e2e.dir + 'dist/**/*',
      TEST_CFG.e2e.dir + 'dist/'
    ], callback);
  });

  gulp.task('e2e:compileTests', function e2eCompileTests() {
    return gulp.src(TEST_CFG.e2e.dir + 'src/**/*.js')
      .pipe(gulpBabel())
      .pipe(gulp.dest(TEST_CFG.e2e.dir + 'dist'));
  });

  gulp.task('e2e:addShim', function e2eAddShim() {
    return gulp.src(['./dist/index.html'])
      .pipe(gulpReplace('<script', (TEST_CFG.e2e.shim + '<script')))
      .pipe(gulp.dest('./dist/'));
  });

  gulp.task('e2e:nightwatch', function e2eNightwatch() {
    return gulp.src('')
      .pipe(gulpNightwatch({
        configFile: TEST_CFG.e2e.dir + 'config/nightwatch.json',
        cliArgs: ['--env phantomjs']
      }))
      .on('error', function continueGulp() {
        // If there's an error we need to complete the task and remove the shim
        TEST_CFG.e2e.wasNightwatchFailing = true;
        this.emit('end');
      });
  });

  gulp.task('e2e:removeShim', function e2eRemoveShim() {
    return gulp.src(['./dist/index.html'])
      .pipe(gulpReplace((TEST_CFG.e2e.shim + '<script'), '<script'))
      .pipe(gulp.dest('./dist/'));
  });

  gulp.task('e2e:stopConnect', function e2eStopConnect() {
    gulpConnect.serverClose();
  });

  gulp.task('e2e', function e2e(callback) {
    runSequence(
      'e2e:startConnect',
      'e2e:clean',
      'e2e:compileTests',
      'e2e:addShim',
      'e2e:nightwatch',
      'e2e:removeShim',
      'e2e:stopConnect',
      function catchNightwatchFail(error) {
        if (TEST_CFG.e2e.wasNightwatchFailing) {
          throw new Error('E2E testing failed');
        }
        callback(error);
      }
    );
  });
};
