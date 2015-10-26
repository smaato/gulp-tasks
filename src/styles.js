
/**
 * @description Style related tasks
 */

// Compass and PostCSS
module.exports.compassAndPostcss = function compassAndPostcss(config) {
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

  var STYLES_CFG = config || {
    dst: './dist/css',
    src: []
  };

  gulp.task('compass', function compass() {
    return gulp.src(STYLES_CFG.src)
      .pipe(gulpCompass({
        css: STYLES_CFG.dst,
        import_path: './node_modules',
        sass: './app',
        sourcemap: true
      }))
      .on('error', function exitGulp() {
        throw new Error('Compass failed');
      })
      .pipe(gulp.dest(STYLES_CFG.dst));
  });

  gulp.task('postCss', function postCss() {
    return gulp.src((STYLES_CFG.dst + '/index.css'))
      .pipe(gulpPostcss([
        autoprefixer({
          browsers: ['last 2 versions']
        }),
        cssMqpacker
      ]))
      .pipe(gulp.dest(STYLES_CFG.dst));
  });

  gulp.task('renameDstIndexCss', function renameDstIndexCss() {
    return gulp.src((STYLES_CFG.dst + '/*'))
      // Replace occurences of index.css with dist.css inside of files
      .pipe(gulpReplace('index.css', 'dist.css'))
      // Rename files from *index*.* to *dist*.*
      .pipe(gulpRename(function rename(path) {
        path.basename = path.basename.replace('index', 'dist');
      }))
      .pipe(gulp.dest(STYLES_CFG.dst))
      .pipe(gulpConnect.reload());
  });

  gulp.task('deleteDstIndexCss', function deleteDstIndexCss() {
    return del([
      (STYLES_CFG.dst + '/index.css'),
      (STYLES_CFG.dst + '/index.css.map')
    ]);
  });

  gulp.task('styles', function styles(callback) {
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
module.exports.cleanCss = function cleanCss(config) {
  var gulp = require('gulp');
  var gulpCssmin = require('gulp-cssmin');
  var gulpRename = require('gulp-rename');

  var STYLES_CFG = config || {
    src: './dist/css'
  };

  gulp.task('minifyStyles', function minifyStyles() {
    return gulp.src((STYLES_CFG.src + '/dist.css'))
      .pipe(gulpCssmin())
      .pipe(gulpRename('dist.min.css'))
      .pipe(gulp.dest(STYLES_CFG.src));
  });
};
