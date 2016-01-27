
const gulp = require('gulp');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const fs = require('fs');
const lstat = fs.lstat;
const compileJs = require('../index').compileJs;
const minifyJs = require('../index').minifyJs;

describe('minifyJs method', () => {
  it('returns a config and a task', () => {
    const result = minifyJs();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = minifyJs();
      expect(result.config).toEqual({
        src: './dist/js',
        dropConsole: true,
        mangle: true,
      });
    });

    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        minifyJs({
          src: false,
        });
      }).toThrowError('Invalid configuration: value of src needs to be a glob or an array of globs.');
    });
  });

  describe('gulp task', () => {
    gulp.task('testMinifyJs:compile', compileJs({
      src: './demo/src/index.js',
      dst: './demo/dist/js',
    }).task);

    gulp.task('testMinifyJs', minifyJs({
      src: './demo/dist/js',
    }).task);

    beforeEach(done => {
      // rm -rf the dist folder.
      rimraf('./demo/dist', () => {
        /**
        * Because the Gulp task is async, we need to use runSequence to execute
        * the task and then call the `done` async callback.
        */
        runSequence('testMinifyJs:compile', 'testMinifyJs', done);
      });
    });

    it('minifies a compiled JS file', (done) => {
      expect(gulp.tasks.testMinifyJs.done).toBe(true);
      lstat('./demo/dist/js/dist.min.js', (err, stats) => {
        if (err) throw err;
        expect(stats.isFile()).toBe(true);
        done();
      });
    });

    it('removes console.log statements by default', () => {
      const dist = fs.readFileSync('./demo/dist/js/dist.js');
      const distMin = fs.readFileSync('./demo/dist/js/dist.min.js');
      const consoleLogStatement = 'console.log(\'Hello, world!\'';

      expect(dist).toContain(consoleLogStatement);
      expect(distMin).not.toContain(consoleLogStatement);
    });
  });
});
