
describe('Scripts Gulp Task Module', () => {
  var gulp = require('gulp');
  var scripts = require('./scripts.js');

  it('is an object', () => {
    expect(typeof scripts).toBe('object');
  });

  describe('Browserify/Watchify Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof scripts.browserifyAndWatchify).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return scripts.browserifyAndWatchify({
          dst: false
        });
      }).toThrow();

      expect(() => {
        return scripts.browserifyAndWatchify({
          src: false
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        scripts.browserifyAndWatchify({
          dst: './shouldNotExist/dist/js',
          src: './shouldNotExist/src/index.js',
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
    it('is a function', () => {
      expect(typeof scripts.uglify).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return scripts.uglify({
          src: false
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        scripts.uglify({
          src: './shouldNotExist/dist/js',
          taskName: 'minifyScriptsTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.minifyScriptsTest).toBeDefined();
    });
  });
});
