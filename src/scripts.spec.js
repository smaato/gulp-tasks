
const gulp = require('gulp');
const scripts = require('./scripts.js');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const lstat = require('fs').lstat;

describe('scripts module', () => {
  describe('browserifyAndWatchify method', () => {
    it('is a function', () => {
      expect(typeof scripts.browserifyAndWatchify).toBe('function');
    });

    it('registers 2 gulp tasks', () => {
      scripts.browserifyAndWatchify({
        taskName: 'scriptsBrowserifyAndWatchifyReigstration',
      });
      expect(gulp.tasks.scriptsBrowserifyAndWatchifyReigstration).toBeDefined();
      expect(gulp.tasks.scriptsBrowserifyAndWatchifyReigstrationThenWatch).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          scripts.browserifyAndWatchify({
            dst: false,
          });
        }).toThrow();

        expect(() => {
          scripts.browserifyAndWatchify({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          scripts.browserifyAndWatchify({
            dst: '/',
            src: '/',
          });
        }).not.toThrow();
      });
    });

    describe('gulp task', () => {
      beforeEach(done => {
        // rm -rf the dist folder.
        rimraf('./demo/dist', done);
      });

      it('compiles a JS file', (done) => {
        scripts.browserifyAndWatchify({
          taskName: 'scriptsBrowserifyAndWatchifyGulpTask',
          src: './demo/src/index.js',
          dst: './demo/dist/js',
        });

        /**
         * Because the Gulp task is async, we need to use runSequence to execute
         * the task and then call the `done` async callback.
         */
        runSequence('scriptsBrowserifyAndWatchifyGulpTask', () => {
          expect(gulp.tasks.scriptsBrowserifyAndWatchifyGulpTask.done).toBe(true);
          lstat('./demo/dist/js/dist.js', (err, stats) => {
            if (err) throw err;
            expect(stats.isFile()).toBe(true);
            done();
          });
        });
      });
    });
  });

  describe('uglify method', () => {
    it('is a function', () => {
      expect(typeof scripts.uglify).toBe('function');
    });

    it('registers a gulp task', () => {
      scripts.uglify({
        taskName: 'scriptsUglifyRegistration',
      });
      expect(gulp.tasks.scriptsUglifyRegistration).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          scripts.uglify({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          scripts.uglify({
            src: '/',
          });
        }).not.toThrow();
      });
    });

    describe('gulp task', () => {
      beforeEach(done => {
        // rm -rf the dist folder.
        rimraf('./demo/dist', done);
      });

      it('minifies a compiled JS file', (done) => {
        scripts.browserifyAndWatchify({
          taskName: 'scriptsUglifyGulpTask:compile',
          src: './demo/src/index.js',
          dst: './demo/dist/js',
        });

        scripts.uglify({
          taskName: 'scriptsUglifyGulpTask',
          src: './demo/dist/js',
        });

        /**
         * Because the Gulp task is async, we need to use runSequence to execute
         * the task and then call the `done` async callback.
         */
        runSequence('scriptsUglifyGulpTask:compile', 'scriptsUglifyGulpTask', () => {
          expect(gulp.tasks.scriptsUglifyGulpTask.done).toBe(true);
          lstat('./demo/dist/js/dist.min.js', (err, stats) => {
            if (err) throw err;
            expect(stats.isFile()).toBe(true);
            done();
          });
        });
      });
    });
  });
});
