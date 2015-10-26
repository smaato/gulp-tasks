
describe('Assets Gulp Task Collection', function() {
  var assetsGulpTaskCollection = require('./assets.js');
  var gulp = require('gulp');
  var runSequence = require('run-sequence');

  it('can be imported', function() {
    expect(assetsGulpTaskCollection).toBeDefined();
  });

  describe('Copy Gulp Task Definition', function() {
    it('is defined', function() {
      expect(assetsGulpTaskCollection.copy).toBeDefined();
    });

    it('can not be called with an invalid configuration', function() {
      expect(function() {
        return assetsGulpTaskCollection.copy({});
      }).toThrow();

      expect(function() {
        return assetsGulpTaskCollection.copy({
          dst: './dist/assets'
        });
      }).toThrow();

      expect(function() {
        return assetsGulpTaskCollection.copy({
          src: []
        });
      }).toThrow();
    });

    it('can be called without a configuration', function() {
      expect(assetsGulpTaskCollection.copy).not.toThrow();
    });

    it('registers a gulp task', function() {
      expect(gulp.tasks.assets).toBeDefined();
    });

    describe('Copy Gulp Task', function() {
      beforeEach(function(done) {
        runSequence(
          'assets',
          done
        );
      });

      it('can be executed', function() {
        expect(gulp.tasks.assets.done).toBe(true);
      });
    });
  });
});
