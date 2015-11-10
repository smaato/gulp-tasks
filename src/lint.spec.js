
describe('Lint Gulp Task Module', () => {
  const gulp = require('gulp');
  const lint = require('./lint.js');
  const runSequence = require('run-sequence');

  it('is an object', () => {
    expect(typeof lint).toBe('object');
  });

  describe('ESLint Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof lint.eslint).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return lint.eslint({
          src: false,
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        lint.eslint({
          src: './shouldNotExist/src/**/*.js',
          taskName: 'lintTest',
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.lintTest).toBeDefined();
    });

    describe('ESLint Gulp Task', () => {
      beforeEach((done) => {
        /*
        The provided done function has to be called to proceed and therefore
        allows to do async operations here
        runSequence runs gulp tasks in order and accepts a callback as the last
        argument which is used to ensure that the gulp task finished before
        assertions are evaluated
        */
        runSequence(
          'lintTest',
          done
        );
      });

      it('completes successfully', () => {
        expect(gulp.tasks.lintTest.done).toBe(true);
      });
    });
  });
});
