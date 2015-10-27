
describe('Lint Gulp Task Collection', () => {
  var gulp = require('gulp');
  var lintGulpTaskCollection = require('./lint.js');
  var runSequence = require('run-sequence');

  it('can be imported', () => {
    expect(lintGulpTaskCollection).toBeDefined();
  });

  describe('ESLint Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(lintGulpTaskCollection.eslint).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return lintGulpTaskCollection.eslint({});
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        lintGulpTaskCollection.eslint({
          src: [
            './src/**/*.js'
          ],
          taskName: 'lintTest'
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

      it('can be executed', () => {
        expect(gulp.tasks.lintTest.done).toBe(true);
      });
    });
  });
});
