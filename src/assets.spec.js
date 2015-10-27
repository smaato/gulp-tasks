
describe('Assets Gulp Task Collection', () => {
  var assetsGulpTaskCollection = require('./assets.js');
  var gulp = require('gulp');
  var runSequence = require('run-sequence');

  it('can be imported', () => {
    expect(assetsGulpTaskCollection).toBeDefined();
  });

  describe('Copy Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(assetsGulpTaskCollection.copy).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return assetsGulpTaskCollection.copy({});
      }).toThrow();

      expect(() => {
        return assetsGulpTaskCollection.copy({
          dst: './dist/assets'
        });
      }).toThrow();

      expect(() => {
        return assetsGulpTaskCollection.copy({
          src: [
            './src/assets/**/*'
          ]
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        assetsGulpTaskCollection.copy({
          dst: './dist/assets',
          src: [
            './src/assets/**/*'
          ],
          taskName: 'assetsTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.assetsTest).toBeDefined();
    });

    describe('Copy Gulp Task', () => {
      beforeEach((done) => {
        /*
        The provided done function has to be called to proceed and therefore
        allows to do async operations here
        runSequence runs gulp tasks in order and accepts a callback as the last
        argument which is used to ensure that the gulp task finished before
        assertions are evaluated
        */
        runSequence(
          'assetsTest',
          done
        );
      });

      it('can be executed', () => {
        expect(gulp.tasks.assetsTest.done).toBe(true);
      });
    });
  });
});
