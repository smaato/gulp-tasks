
describe('Styles Gulp Task Module', () => {
  const gulp = require('gulp');
  const styles = require('./styles.js');

  it('is an object', () => {
    expect(typeof styles).toBe('object');
  });

  describe('Compass/Postcss Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof styles.compassAndPostcss).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return styles.compassAndPostcss({
          dst: false,
        });
      }).toThrow();

      expect(() => {
        return styles.compassAndPostcss({
          src: false,
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        styles.compassAndPostcss({
          dst: './shouldNotExist/dist/css',
          src: './shouldNotExist/src/**/*.scss',
          taskName: 'stylesTest',
        });
      }).not.toThrow();
    });

    it('registers five gulp tasks', () => {
      expect(gulp.tasks.stylesTest).toBeDefined();
      expect(gulp.tasks['stylesTest:compass']).toBeDefined();
      expect(gulp.tasks['stylesTest:postCss']).toBeDefined();
      expect(gulp.tasks['stylesTest:renameDstIndexCss']).toBeDefined();
      expect(gulp.tasks['stylesTest:deleteDstIndexCss']).toBeDefined();
    });
  });

  describe('clean-css Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof styles.minifyCss).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return styles.minifyCss({
          src: false,
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        styles.minifyCss({
          src: './shouldNotExist/dist/css',
          taskName: 'minifyStylesTest',
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.minifyStylesTest).toBeDefined();
    });
  });
});
