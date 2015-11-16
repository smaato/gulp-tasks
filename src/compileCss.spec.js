
const gulp = require('gulp');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const lstatSync = require('fs').lstatSync;
const compileCss = require('../index').compileCss;

describe('compileCss method', () => {
  it('returns a config and a task', () => {
    const result = compileCss();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = compileCss();
      expect(result.config).toEqual({
        subTaskPrefix: 'compileCss',
        src: './src/**/*.scss',
        dst: './dist/css',
        compassSassDir: './src',
        compassImportPath: './node_modules',
        sourceMap: true,
      });
    });

    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        compileCss({
          dst: false,
        });
      }).toThrowError('Invalid configuration: value of dst needs to be a path.');

      expect(() => {
        compileCss({
          src: false,
        });
      }).toThrowError('Invalid configuration: value of src needs to be a glob or an array of globs.');
    });
  });

  describe('internals', () => {
    it('registers 4 sub-tasks', () => {
      compileCss({
        subTaskPrefix: 'compileCssInternals',
      });
      expect(gulp.tasks['compileCssInternals:compass']).toBeDefined();
      expect(gulp.tasks['compileCssInternals:postCss']).toBeDefined();
      expect(gulp.tasks['compileCssInternals:renameDstIndexCss']).toBeDefined();
      expect(gulp.tasks['compileCssInternals:deleteDstIndexCss']).toBeDefined();
    });
  });

  describe('gulp task', () => {
    beforeEach(done => {
      // rm -rf the dist folder.
      rimraf('./demo/dist', done);
    });

    it('compiles a CSS file and source map', (done) => {
      gulp.task('testCompileCss', compileCss({
        src: './demo/src/**/*.scss',
        dst: './demo/dist/css',
        compassSassDir: './demo/src',
      }).task);

      /**
       * Because the Gulp task is async, we need to use runSequence to execute
       * the task and then call the `done` async callback.
       */
      runSequence('testCompileCss', () => {
        expect(gulp.tasks.testCompileCss.done).toBe(true);

        const cssFile = lstatSync('./demo/dist/css/dist.css');
        expect(cssFile.isFile()).toBe(true);

        const cssMapFile = lstatSync('./demo/dist/css/dist.css.map');
        expect(cssMapFile.isFile()).toBe(true);

        done();
      });
    });
  });
});
