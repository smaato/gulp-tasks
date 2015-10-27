
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
          src: []
        });
      }).toThrow();
    });

    it('can be called without a configuration', () => {
      expect(assetsGulpTaskCollection.copy).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.assets).toBeDefined();
    });

    describe('Copy Gulp Task', () => {
      beforeEach((done) => {
        /*
        The provided done function has to be called to proceed and therefore
        allows to do async operations here
        runSequence runs gulp tasks in order and accepts a callback as the last
        argument which is used to ensure that the assets gulp task finished
        before assertions are evaluated
        */
        runSequence(
          'assets',
          done
        );
      });

      it('can be executed', () => {
        expect(gulp.tasks.assets.done).toBe(true);
      });
    });
  });
});
