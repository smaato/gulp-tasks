
const gulp = require('gulp');
const styles = require('./styles.js');

describe('styles module', () => {
  describe('compassAndPostcss method', () => {
    it('is a function', () => {
      expect(typeof styles.compassAndPostcss).toBe('function');
    });

    it('registers 5 gulp tasks', () => {
      styles.compassAndPostcss({
        taskName: 'stylesCompassAndPostcssRegistration',
      });
      expect(gulp.tasks.stylesCompassAndPostcssRegistration).toBeDefined();
      expect(gulp.tasks['stylesCompassAndPostcssRegistration:compass']).toBeDefined();
      expect(gulp.tasks['stylesCompassAndPostcssRegistration:postCss']).toBeDefined();
      expect(gulp.tasks['stylesCompassAndPostcssRegistration:renameDstIndexCss']).toBeDefined();
      expect(gulp.tasks['stylesCompassAndPostcssRegistration:deleteDstIndexCss']).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          styles.compassAndPostcss({
            dst: false,
          });
        }).toThrow();

        expect(() => {
          styles.compassAndPostcss({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          styles.compassAndPostcss({
            dst: '/',
            src: '/',
          });
        }).not.toThrow();
      });
    });
  });

  describe('minifyCss method', () => {
    it('is a function', () => {
      expect(typeof styles.minifyCss).toBe('function');
    });

    it('registers a gulp task', () => {
      styles.minifyCss({
        taskName: 'stylesMinifyCssRegistration',
      });
      expect(gulp.tasks.stylesMinifyCssRegistration).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          styles.minifyCss({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          styles.minifyCss({
            src: '/',
          });
        }).not.toThrow();
      });
    });
  });
});
