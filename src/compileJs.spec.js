
const gulp = require('gulp');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const lstat = require('fs').lstat;
const compileJs = require('../index').compileJs;

describe('compileJs method', () => {
  it('returns a config and a task', () => {
    const result = compileJs();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = compileJs();
      expect(result.config).toEqual({
        src: './src/index.js',
        dst: './dist/js',
        watch: false,
        makeSourceMaps: true,
        hmrPort: 3123,
        cssReloadPort: 4000,
        cssReloadPath: '/css/dist.css',
      });
    });

    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        compileJs({
          dst: false,
        });
      }).toThrowError(
        'Invalid configuration: value of dst needs to be a path.'
      );

      expect(() => {
        compileJs({
          src: false,
        });
      }).toThrowError(
        'Invalid configuration: value of src needs to be a glob or an array ' +
        'of globs.'
      );
    });
  });

  describe('gulp task', () => {
    beforeEach((done) => {
      // rm -rf the dist folder.
      rimraf('./demo/dist', done);
    });

    it('compiles a JS file', (done) => {
      gulp.task('testCompileJs', compileJs({
        src: './demo/src/index.js',
        dst: './demo/dist/js',
      }).task);

      /**
       * Because the Gulp task is async, we need to use runSequence to execute
       * the task and then call the `done` async callback.
       */
      runSequence('testCompileJs', () => {
        expect(gulp.tasks.testCompileJs.done).toBe(true);
        lstat('./demo/dist/js/dist.js', (err, stats) => {
          if (err) throw err;
          expect(stats.isFile()).toBe(true);
          done();
        });
      });
    });
  });
});
