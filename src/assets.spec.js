
describe('Assets Gulp Task Collection', () => {
  var assetsGulpTaskCollection = require('./assets.js');
  var gulp = require('gulp');
  var runSequence = require('run-sequence');

  it('can be imported', () => {
    expect(assetsGulpTaskCollection).toBeDefined();
  });

  describe('Copy Gulp Task Definition', () => {
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
