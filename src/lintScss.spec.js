
const gulp = require('gulp');
const runSequence = require('run-sequence');
const lintScss = require('../index').lintScss;

describe('lintScss method', () => {
  it('returns a config and a task', () => {
    const result = lintScss();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        lintScss({
          src: false,
        });
      }).toThrowError(
        'Invalid configuration: value of src needs to be a glob or an array ' +
        'of globs.'
      );
    });
  });

  describe('gulp task', () => {
    it('completes successfully', (done) => {
      gulp.task('testLintScss', lintScss().task);

      /**
       * Because the Gulp task is async, we need to use runSequence to execute
       * the task and then call the `done` async callback.
       */
      runSequence('testLintScss', () => {
        expect(gulp.tasks.testLintScss.done).toBe(true);
        done();
      });
    });
  });
});
