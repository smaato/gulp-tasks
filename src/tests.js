
/**
 * @description Test related tasks
 */

// Karma
module.exports.karma = (config) => {
  var gulp = require('gulp');
  var karmaServer = require('karma').Server;

  var KARMA_CONFIG = config || {};

  gulp.task((KARMA_CONFIG.taskName || 'unit'), (callback) => {
    return karmaServer.start(KARMA_CONFIG, (exitStatus) => {
      if (exitStatus) {
        throw new Error('Unit testing failed');
      } else {
        callback(exitStatus);
      }
    });
  });
};

// Nightwatch
module.exports.nightwatch = (config) => {
  var del = require('del');
  var gulp = require('gulp');
  var gulpBabel = require('gulp-babel');
  var gulpConnect = require('gulp-connect');
  var gulpNightwatch = require('gulp-nightwatch');
  var gulpReplace = require('gulp-replace');
  var runSequence = require('run-sequence');

  var NIGHTWATCH_CONFIG = config || {
    connect: {
      root: './dist'
    },
    dir: './e2e/',
    shim: '<script></script>'
  };

  if (!NIGHTWATCH_CONFIG.connect || !NIGHTWATCH_CONFIG.dir || !NIGHTWATCH_CONFIG.shim) {
    throw new Error('Invalid configuration');
  }

  gulp.task(((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':startConnect'), () => {
    gulpConnect.server(NIGHTWATCH_CONFIG.connect);
  });

  gulp.task(((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':clean'), (callback) => {
    return del([
      NIGHTWATCH_CONFIG.dir + 'dist/**/*',
      NIGHTWATCH_CONFIG.dir + 'dist/'
    ], callback);
  });

  gulp.task(((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':compileTests'), () => {
    return gulp.src(NIGHTWATCH_CONFIG.dir + 'src/**/*.js')
      .pipe(gulpBabel())
      .pipe(gulp.dest(NIGHTWATCH_CONFIG.dir + 'dist'));
  });

  gulp.task(((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':addShim'), () => {
    return gulp.src(['./dist/index.html'])
      .pipe(gulpReplace('<script', (NIGHTWATCH_CONFIG.shim + '<script')))
      .pipe(gulp.dest('./dist/'));
  });

  gulp.task(((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':nightwatch'), () => {
    return gulp.src('')
      .pipe(gulpNightwatch({
        configFile: NIGHTWATCH_CONFIG.dir + 'config/nightwatch.json',
        cliArgs: ['--env phantomjs']
      }))
      .on('error', () => {
        // If there's an error we need to complete the task and remove the shim
        NIGHTWATCH_CONFIG.wasNightwatchFailing = true;
        this.emit('end');
      });
  });

  gulp.task(((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':removeShim'), () => {
    return gulp.src(['./dist/index.html'])
      .pipe(gulpReplace((NIGHTWATCH_CONFIG.shim + '<script'), '<script'))
      .pipe(gulp.dest('./dist/'));
  });

  gulp.task(((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':stopConnect'), () => {
    gulpConnect.serverClose();
  });

  gulp.task((NIGHTWATCH_CONFIG.taskName || 'e2e'), (callback) => {
    runSequence(
      ((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':startConnect'),
      ((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':clean'),
      ((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':compileTests'),
      ((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':addShim'),
      ((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':nightwatch'),
      ((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':removeShim'),
      ((NIGHTWATCH_CONFIG.taskName || 'e2e') + ':stopConnect'),
      (error) => {
        if (NIGHTWATCH_CONFIG.wasNightwatchFailing) {
          throw new Error('E2E testing failed');
        }
        callback(error);
      }
    );
  });
};
