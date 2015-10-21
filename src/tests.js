
/**
 * @description Test related tasks
 */

// Karma
module.exports.karma = function karma(config) {
  var gulp = require('gulp');
  var karmaServer = require('karma').Server;

  var KARMA_CFG = config || {};

  gulp.task('unit', function karmaGulpTask(callback) {
    return karmaServer.start(KARMA_CFG, function exitGulp(exitStatus) {
      if (exitStatus) {
        throw new Error('Unit testing failed');
      } else {
        callback(exitStatus);
      }
    });
  });
};

// Nightwatch
module.exports.nightwatch = function nightwatch(config) {
  var del = require('del');
  var gulp = require('gulp');
  var gulpBabel = require('gulp-babel');
  var gulpConnect = require('gulp-connect');
  var gulpNightwatch = require('gulp-nightwatch');
  var gulpReplace = require('gulp-replace');
  var runSequence = require('run-sequence');

  var NIGHTWATCH_CFG = config || {
    connect: {},
    dir: './e2e/',
    shim: '',
    wasNightwatchFailing: false
  };

  gulp.task('e2e:startConnect', function e2eStartConnect() {
    gulpConnect.server(NIGHTWATCH_CFG.connect);
  });

  gulp.task('e2e:clean', function e2eClean(callback) {
    return del([
      NIGHTWATCH_CFG.dir + 'dist/**/*',
      NIGHTWATCH_CFG.dir + 'dist/'
    ], callback);
  });

  gulp.task('e2e:compileTests', function e2eCompileTests() {
    return gulp.src(NIGHTWATCH_CFG.dir + 'src/**/*.js')
      .pipe(gulpBabel())
      .pipe(gulp.dest(NIGHTWATCH_CFG.dir + 'dist'));
  });

  gulp.task('e2e:addShim', function e2eAddShim() {
    return gulp.src(['./dist/index.html'])
      .pipe(gulpReplace('<script', (NIGHTWATCH_CFG.shim + '<script')))
      .pipe(gulp.dest('./dist/'));
  });

  gulp.task('e2e:nightwatch', function e2eNightwatch() {
    return gulp.src('')
      .pipe(gulpNightwatch({
        configFile: NIGHTWATCH_CFG.dir + 'config/nightwatch.json',
        cliArgs: ['--env phantomjs']
      }))
      .on('error', function continueGulp() {
        // If there's an error we need to complete the task and remove the shim
        NIGHTWATCH_CFG.wasNightwatchFailing = true;
        this.emit('end');
      });
  });

  gulp.task('e2e:removeShim', function e2eRemoveShim() {
    return gulp.src(['./dist/index.html'])
      .pipe(gulpReplace((NIGHTWATCH_CFG.shim + '<script'), '<script'))
      .pipe(gulp.dest('./dist/'));
  });

  gulp.task('e2e:stopConnect', function e2eStopConnect() {
    gulpConnect.serverClose();
  });

  gulp.task('e2e', function nightwatchGulpTask(callback) {
    runSequence(
      'e2e:startConnect',
      'e2e:clean',
      'e2e:compileTests',
      'e2e:addShim',
      'e2e:nightwatch',
      'e2e:removeShim',
      'e2e:stopConnect',
      function catchNightwatchFail(error) {
        if (NIGHTWATCH_CFG.wasNightwatchFailing) {
          throw new Error('E2E testing failed');
        }
        callback(error);
      }
    );
  });
};
