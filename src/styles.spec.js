
const gulp = require('gulp');
const styles = require('./styles.js');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const lstat = require('fs').lstat;
const lstatSync = require('fs').lstatSync;

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

    describe('gulp task', () => {
      beforeEach(done => {
        // rm -rf the dist folder.
        rimraf('./demo/dist', done);
      });

      it('compiles a CSS file and source map', (done) => {
        styles.compassAndPostcss({
          taskName: 'stylesCompassAndPostcssGulpTask',
          src: './demo/src/**/*.scss',
          dst: './demo/dist/css',
          compassSassDir: './demo/src',
        });

        /**
         * Because the Gulp task is async, we need to use runSequence to execute
         * the task and then call the `done` async callback.
         */
        runSequence('stylesCompassAndPostcssGulpTask', () => {
          expect(gulp.tasks.stylesCompassAndPostcssGulpTask.done).toBe(true);

          const cssFile = lstatSync('./demo/dist/css/dist.css');
          expect(cssFile.isFile()).toBe(true);

          const cssMapFile = lstatSync('./demo/dist/css/dist.css.map');
          expect(cssMapFile.isFile()).toBe(true);

          done();
        });
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

    describe('gulp task', () => {
      beforeEach(done => {
        // rm -rf the dist folder.
        rimraf('./demo/dist', done);
      });

      it('minifies a compiled CSS file', (done) => {
        styles.compassAndPostcss({
          taskName: 'stylesMinifyCssGulpTask:compile',
          src: './demo/src/**/*.scss',
          dst: './demo/dist/css',
          compassSassDir: './demo/src',
        });

        styles.minifyCss({
          taskName: 'stylesMinifyCssGulpTask',
          src: './demo/dist/css',
        });

        /**
         * Because the Gulp task is async, we need to use runSequence to execute
         * the task and then call the `done` async callback.
         */
        runSequence('stylesMinifyCssGulpTask:compile', 'stylesMinifyCssGulpTask', () => {
          expect(gulp.tasks.stylesMinifyCssGulpTask.done).toBe(true);
          lstat('./demo/dist/css/dist.min.css', (err, stats) => {
            if (err) throw err;
            expect(stats.isFile()).toBe(true);
            done();
          });
        });
      });
    });
  });
});
