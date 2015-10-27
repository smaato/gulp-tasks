
describe('Styles Gulp Task Collection', () => {
  var gulp = require('gulp');
  var stylesGulpTaskCollection = require('./styles.js');

  it('can be imported', () => {
    expect(stylesGulpTaskCollection).toBeDefined();
  });

  describe('Compass/Postcss Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(stylesGulpTaskCollection.compassAndPostcss).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return stylesGulpTaskCollection.compassAndPostcss({});
      }).toThrow();

      expect(() => {
        return stylesGulpTaskCollection.compassAndPostcss({
          dst: './dist/css'
        });
      }).toThrow();

      expect(() => {
        return stylesGulpTaskCollection.compassAndPostcss({
          src: [
            './src/**/*.scss'
          ]
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        stylesGulpTaskCollection.compassAndPostcss({
          dst: './dist/css',
          src: [
            './src/**/*.scss'
          ],
          taskName: 'stylesTest'
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
    it('is defined', () => {
      expect(stylesGulpTaskCollection.cleanCss).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return stylesGulpTaskCollection.cleanCss({});
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        stylesGulpTaskCollection.cleanCss({
          src: './dist/css',
          taskName: 'minifyStylesTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.minifyStylesTest).toBeDefined();
    });
  });
});
