
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

  var STYLES_CONFIG = Object.assign({
    dst: './dist/css',
    src: './src/**/*.scss',
    taskName: 'styles'
  }, config);

  if (!STYLES_CONFIG.dst || !STYLES_CONFIG.src) {
    throw new Error('Invalid configuration: value of dst needs to be a path and value of src needs to be a glob or an array of globs.');
  }

  gulp.task((STYLES_CONFIG.taskName + ':compass'), () => {
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

  gulp.task((STYLES_CONFIG.taskName + ':postCss'), () => {
    return gulp.src((STYLES_CONFIG.dst + '/index.css'))
      .pipe(gulpPostcss([
        autoprefixer({
          browsers: ['last 2 versions']
        }),
        cssMqpacker
      ]))
      .pipe(gulp.dest(STYLES_CONFIG.dst));
  });

  gulp.task((STYLES_CONFIG.taskName + ':renameDstIndexCss'), () => {
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

  gulp.task((STYLES_CONFIG.taskName + ':deleteDstIndexCss'), () => {
    return del([
      (STYLES_CONFIG.dst + '/index.css'),
      (STYLES_CONFIG.dst + '/index.css.map')
    ]);
  });

  gulp.task(STYLES_CONFIG.taskName, (callback) => {
    runSequence(
      (STYLES_CONFIG.taskName + ':compass'),
      (STYLES_CONFIG.taskName + ':postCss'),
      (STYLES_CONFIG.taskName + ':renameDstIndexCss'),
      (STYLES_CONFIG.taskName + ':deleteDstIndexCss'),
      callback
    );
  });
};

// Minifying styles with clean-css
module.exports.minifyCss = (config) => {
  var gulp = require('gulp');
  var gulpCssmin = require('gulp-cssmin');
  var gulpRename = require('gulp-rename');

  var STYLES_CONFIG = Object.assign({
    src: './dist/css',
    taskName: 'minifyStyles'
  }, config);

  if (!STYLES_CONFIG.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  gulp.task(STYLES_CONFIG.taskName, () => {
    return gulp.src((STYLES_CONFIG.src + '/dist.css'))
      .pipe(gulpCssmin())
      .pipe(gulpRename('dist.min.css'))
      .pipe(gulp.dest(STYLES_CONFIG.src));
  });
};
