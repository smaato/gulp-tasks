
/**
 * @description Style related tasks
 */

// Compass and PostCSS
module.exports.compassAndPostcss = (config) => {
  var autoprefixer = require('autoprefixer');
  var cssMqpacker = require('css-mqpacker');
  var del = require('del');
  var gulp = require('gulp');
  var gulpCompass = require('gulp-compass');
  var gulpConnect = require('gulp-connect');
  var gulpPostcss = require('gulp-postcss');
  var gulpRename = require('gulp-rename');
  var gulpReplace = require('gulp-replace');
  var runSequence = require('run-sequence');

  var STYLES_CONFIG = config || {
    dst: './dist/css',
    src: []
  };

  gulp.task('compass', () => {
    return gulp.src(STYLES_CONFIG.src)
      .pipe(gulpCompass({
        css: STYLES_CONFIG.dst,
        import_path: './node_modules',
        sass: './app',
        sourcemap: true
      }))
      .on('error', () => {
        throw new Error('Compass failed');
      })
      .pipe(gulp.dest(STYLES_CONFIG.dst));
  });

  gulp.task('postCss', () => {
    return gulp.src((STYLES_CONFIG.dst + '/index.css'))
      .pipe(gulpPostcss([
        autoprefixer({
          browsers: ['last 2 versions']
        }),
        cssMqpacker
      ]))
      .pipe(gulp.dest(STYLES_CONFIG.dst));
  });

  gulp.task('renameDstIndexCss', () => {
    return gulp.src((STYLES_CONFIG.dst + '/*'))
      // Replace occurences of index.css with dist.css inside of files
      .pipe(gulpReplace('index.css', 'dist.css'))
      // Rename files from *index*.* to *dist*.*
      .pipe(gulpRename((path) => {
        path.basename = path.basename.replace('index', 'dist');
      }))
      .pipe(gulp.dest(STYLES_CONFIG.dst))
      .pipe(gulpConnect.reload());
  });

  gulp.task('deleteDstIndexCss', () => {
    return del([
      (STYLES_CONFIG.dst + '/index.css'),
      (STYLES_CONFIG.dst + '/index.css.map')
    ]);
  });

  gulp.task('styles', (callback) => {
    runSequence(
      'compass',
      'postCss',
      'renameDstIndexCss',
      'deleteDstIndexCss',
      callback
    );
  });
};

// clean-css
module.exports.cleanCss = (config) => {
  var gulp = require('gulp');
  var gulpCssmin = require('gulp-cssmin');
  var gulpRename = require('gulp-rename');

  var STYLES_CONFIG = config || {
    src: './dist/css'
  };

  gulp.task('minifyStyles', () => {
    return gulp.src((STYLES_CONFIG.src + '/dist.css'))
      .pipe(gulpCssmin())
      .pipe(gulpRename('dist.min.css'))
      .pipe(gulp.dest(STYLES_CONFIG.src));
  });
};
