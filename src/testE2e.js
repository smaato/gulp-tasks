
const del = require('del');
const gulp = require('gulp');
const gulpBabel = require('gulp-babel');
const gulpConnect = require('gulp-connect');
const gulpNightwatch = require('gulp-nightwatch');
const gulpReplace = require('gulp-replace');
const runSequence = require('run-sequence');

module.exports = customConfig => {
  const config = Object.assign({
    subTaskPrefix: 'testE2e',
    dir: './e2e',
    // Test with Chrome and Firefox by default.
    cliArgs: ['--env chrome,firefox,phantomjs'],
    src: '/src/**/*.js',
    dst: '/dist',
    connect: {
      root: './dist',
    },
    shim: false,
  }, customConfig);

  if (!config.dir) {
    throw new Error('Invalid configuration: value of dir needs to be a path.');
  }

  if (!config.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  if (!config.dst) {
    throw new Error('Invalid configuration: value of dst needs to be a path.');
  }

  if (!config.connect) {
    throw new Error('Invalid configuration: value of connect needs to be an object.');
  }

  // Start server.
  const startServer = `${config.subTaskPrefix}:startServer`;

  gulp.task(startServer, () => {
    gulpConnect.server(config.connect);
  });

  // Clean the dist directory.
  const cleanDist = `${config.subTaskPrefix}:cleanDist`;

  gulp.task(cleanDist, (callback) => {
    return del([
      `${config.dir}${config.dst}/**/*`,
      `${config.dir}${config.dst}/`,
    ], callback);
  });

  // Compile the JS for the tests.
  const compileTests = `${config.subTaskPrefix}:compileTests`;

  gulp.task(compileTests, () => {
    return gulp.src(`${config.dir}${config.src}`)
      .pipe(gulpBabel())
      .pipe(gulp.dest(`${config.dir}${config.dst}`));
  });

  // Shim functions so Karma can run in PhantomJS.
  const shimKarma = `${config.subTaskPrefix}:shimKarma`;

  gulp.task(shimKarma, (callback) => {
    if (config.shim) {
      return gulp.src([`.${config.dst}/index.html`])
        .pipe(gulpReplace('<script', `${config.shim}<script`))
        .pipe(gulp.dest(`.${config.dst}/`));
    }
    callback();
  });

  // Run tests with Nightwatch.
  const runTests = `${config.subTaskPrefix}:runTests`;

  gulp.task(runTests, () => {
    return gulp.src('')
      .pipe(gulpNightwatch({
        configFile: `${config.dir}/nightwatch.json`,
        cliArgs: config.cliArgs,
      }))
      .on('error', function onRunE2eTestsError() {
        config.wasNightwatchFailing = true;
        // If there's an error we need to complete the task and remove the shim.
        this.emit('end');
      });
  });

  // Remove Karma shim.
  const unshimKarma = `${config.subTaskPrefix}:unshimKarma`;

  gulp.task(unshimKarma, (callback) => {
    if (config.shim) {
      return gulp.src([`.${config.dst}/index.html`])
        .pipe(gulpReplace(`${config.shim}<script`, '<script'))
        .pipe(gulp.dest(`.${config.dst}/`));
    }
    callback();
  });

  // Stop server.
  const stopServer = `${config.subTaskPrefix}:stopServer`;

  gulp.task(stopServer, () => {
    gulpConnect.serverClose();
  });

  // Run tests with Nightwatch.
  function testE2e(done) {
    runSequence(
      startServer,
      cleanDist,
      compileTests,
      shimKarma,
      runTests,
      unshimKarma,
      stopServer,
      err => {
        // We need to throw an error here so that our pre-commit hook will fail.
        if (config.wasNightwatchFailing) {
          throw new Error('E2E testing failed');
        }
        done(err);
      }
    );
  }

  return {
    task: testE2e,
    config,
  };
};
