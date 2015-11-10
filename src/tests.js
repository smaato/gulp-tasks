
/**
 * @description Test related tasks
 */

// Karma
module.exports.karma = (config) => {
  const gulp = require('gulp');
  const karmaServer = require('karma').Server;

  const KARMA_CONFIG = Object.assign({
    taskName: 'unit',
  }, config);

  gulp.task(KARMA_CONFIG.taskName, (callback) => {
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
  const del = require('del');
  const gulp = require('gulp');
  const gulpBabel = require('gulp-babel');
  const gulpConnect = require('gulp-connect');
  const gulpNightwatch = require('gulp-nightwatch');
  const gulpReplace = require('gulp-replace');
  const runSequence = require('run-sequence');

  const NIGHTWATCH_CONFIG = Object.assign({
    connect: {
      root: './dist',
    },
    dir: './e2e/',
    shim: false,
    taskName: 'e2e',
  }, config);

  if (!NIGHTWATCH_CONFIG.connect || !NIGHTWATCH_CONFIG.dir) {
    throw new Error('Invalid configuration: value of connect needs to be an object and value of dir needs to be a path.');
  }

  gulp.task((NIGHTWATCH_CONFIG.taskName + ':startConnect'), () => {
    gulpConnect.server(NIGHTWATCH_CONFIG.connect);
  });

  gulp.task((NIGHTWATCH_CONFIG.taskName + ':clean'), (callback) => {
    return del([
      NIGHTWATCH_CONFIG.dir + 'dist/**/*',
      NIGHTWATCH_CONFIG.dir + 'dist/',
    ], callback);
  });

  gulp.task((NIGHTWATCH_CONFIG.taskName + ':compileTests'), () => {
    return gulp.src(NIGHTWATCH_CONFIG.dir + 'src/**/*.js')
      .pipe(gulpBabel())
      .pipe(gulp.dest(NIGHTWATCH_CONFIG.dir + 'dist'));
  });

  gulp.task((NIGHTWATCH_CONFIG.taskName + ':addShim'), (callback) => {
    if (NIGHTWATCH_CONFIG.shim) {
      return gulp.src(['./dist/index.html'])
        .pipe(gulpReplace('<script', (NIGHTWATCH_CONFIG.shim + '<script')))
        .pipe(gulp.dest('./dist/'));
    }
    callback();
  });

  gulp.task((NIGHTWATCH_CONFIG.taskName + ':nightwatch'), () => {
    return gulp.src('')
      .pipe(gulpNightwatch({
        configFile: NIGHTWATCH_CONFIG.dir + 'config/nightwatch.json',
        cliArgs: ['--env phantomjs'],
      }))
      .on('error', () => {
        // If there's an error we need to complete the task and remove the shim
        NIGHTWATCH_CONFIG.wasNightwatchFailing = true;
        this.emit('end');
      });
  });

  gulp.task((NIGHTWATCH_CONFIG.taskName + ':removeShim'), (callback) => {
    if (NIGHTWATCH_CONFIG.shim) {
      return gulp.src(['./dist/index.html'])
        .pipe(gulpReplace((NIGHTWATCH_CONFIG.shim + '<script'), '<script'))
        .pipe(gulp.dest('./dist/'));
    }
    callback();
  });

  gulp.task((NIGHTWATCH_CONFIG.taskName + ':stopConnect'), () => {
    gulpConnect.serverClose();
  });

  gulp.task(NIGHTWATCH_CONFIG.taskName, (callback) => {
    runSequence(
      (NIGHTWATCH_CONFIG.taskName + ':startConnect'),
      (NIGHTWATCH_CONFIG.taskName + ':clean'),
      (NIGHTWATCH_CONFIG.taskName + ':compileTests'),
      (NIGHTWATCH_CONFIG.taskName + ':addShim'),
      (NIGHTWATCH_CONFIG.taskName + ':nightwatch'),
      (NIGHTWATCH_CONFIG.taskName + ':removeShim'),
      (NIGHTWATCH_CONFIG.taskName + ':stopConnect'),
      (error) => {
        if (NIGHTWATCH_CONFIG.wasNightwatchFailing) {
          throw new Error('E2E testing failed');
        }
        callback(error);
      }
    );
  });
};
