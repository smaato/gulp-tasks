
const gulp = require('gulp');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const lstat = require('fs').lstat;
const compileCss = require('../index').compileCss;
const minifyCss = require('../index').minifyCss;

describe('minifyCss method', () => {
  it('returns a config and a task', () => {
    const result = minifyCss();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = minifyCss();
      expect(result.config).toEqual({
        src: './dist/css',
      });
    });

    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        minifyCss({
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

    it('minifies a compiled CSS file', (done) => {
      gulp.task('testMinifyCss:compile', compileCss({
        src: './demo/src/**/*.scss',
        dst: './demo/dist/css',
        compassSassDir: './demo/src',
      }).task);

      gulp.task('testMinifyCss', minifyCss({
        src: './demo/dist/css',
      }).task);

      /**
       * Because the Gulp task is async, we need to use runSequence to execute
       * the task and then call the `done` async callback.
       */
      runSequence('testMinifyCss:compile', 'testMinifyCss', () => {
        expect(gulp.tasks.testMinifyCss.done).toBe(true);
        lstat('./demo/dist/css/dist.min.css', (err, stats) => {
          if (err) throw err;
          expect(stats.isFile()).toBe(true);
          done();
        });
      });
    });
  });
});
