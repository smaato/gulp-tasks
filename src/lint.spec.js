
const gulp = require('gulp');
const lint = require('./lint.js');
const runSequence = require('run-sequence');

describe('lint module', () => {
  describe('eslint method', () => {
    it('is a function', () => {
      expect(typeof lint.eslint).toBe('function');
    });

    it('registers a gulp task', () => {
      lint.eslint({
        taskName: 'lintEslintRegistration',
      });
      expect(gulp.tasks.lintEslintRegistration).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          lint.eslint({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          lint.eslint({
            src: '/',
          });
        }).not.toThrow();
      });
    });

    describe('gulp task', () => {
      it('completes successfully', (done) => {
        lint.eslint({
          taskName: 'lintEsLintGulpTask',
        });
        /**
         * Because the Gulp task is async, we need to use runSequence to execute
         * the task and then call the `done` async callback.
         */
        runSequence('lintEsLintGulpTask', () => {
          expect(gulp.tasks.lintEsLintGulpTask.done).toBe(true);
          done();
        });
      });
    });
  });
});
