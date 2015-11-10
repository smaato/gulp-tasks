
const gulp = require('gulp');
const scripts = require('./scripts.js');

describe('scripts module', () => {
  describe('browserifyAndWatchify method', () => {
    it('is a function', () => {
      expect(typeof scripts.browserifyAndWatchify).toBe('function');
    });

    it('registers 2 gulp tasks', () => {
      scripts.browserifyAndWatchify({
        taskName: 'scriptsBrowserifyAndWatchifyReigstration',
      });
      expect(gulp.tasks.scriptsBrowserifyAndWatchifyReigstration).toBeDefined();
      expect(gulp.tasks.scriptsBrowserifyAndWatchifyReigstrationThenWatch).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          scripts.browserifyAndWatchify({
            dst: false,
          });
        }).toThrow();

        expect(() => {
          scripts.browserifyAndWatchify({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          scripts.browserifyAndWatchify({
            dst: '/',
            src: '/',
          });
        }).not.toThrow();
      });
    });
  });

  describe('uglify method', () => {
    it('is a function', () => {
      expect(typeof scripts.uglify).toBe('function');
    });

    it('registers a gulp task', () => {
      scripts.uglify({
        taskName: 'scriptsUglifyRegistration',
      });
      expect(gulp.tasks.scriptsUglifyRegistration).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          scripts.uglify({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          scripts.uglify({
            src: '/',
          });
        }).not.toThrow();
      });
    });
  });
});
