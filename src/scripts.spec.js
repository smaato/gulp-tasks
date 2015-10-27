
describe('Scripts Gulp Task Collection', () => {
  var gulp = require('gulp');
  var scriptsGulpTaskCollection = require('./scripts.js');

  it('can be imported', () => {
    expect(scriptsGulpTaskCollection).toBeDefined();
  });

  describe('Browserify/Watchify Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(scriptsGulpTaskCollection.browserifyAndWatchify).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return scriptsGulpTaskCollection.browserifyAndWatchify({});
      }).toThrow();

      expect(() => {
        return scriptsGulpTaskCollection.browserifyAndWatchify({
          dst: './dist/js'
        });
      }).toThrow();

      expect(() => {
        return scriptsGulpTaskCollection.browserifyAndWatchify({
          src: './src/index.js'
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        scriptsGulpTaskCollection.browserifyAndWatchify({
          dst: './dist/js',
          src: './src/index.js',
          taskName: 'scriptsTest'
        });
      }).not.toThrow();
    });

    it('registers two gulp tasks', () => {
      expect(gulp.tasks.scriptsTest).toBeDefined();
      expect(gulp.tasks.scriptsTestThenWatch).toBeDefined();
    });
  });

  describe('Uglify Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(scriptsGulpTaskCollection.uglify).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return scriptsGulpTaskCollection.uglify({});
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        scriptsGulpTaskCollection.uglify({
          src: './dist/js',
          taskName: 'minifyScriptsTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.minifyScriptsTest).toBeDefined();
    });
  });
});
