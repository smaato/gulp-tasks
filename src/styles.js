
/**
 * @description Style related tasks
 */

// Compass and PostCSS
module.exports.compassAndPostcss = (config) => {
  const autoprefixer = require('autoprefixer');
  const cssMqpacker = require('css-mqpacker');
  const del = require('del');
  const gulp = require('gulp');
  const gulpCompass = require('gulp-compass');
  const gulpConnect = require('gulp-connect');
  const gulpPostcss = require('gulp-postcss');
  const gulpRename = require('gulp-rename');
  const gulpReplace = require('gulp-replace');
  const runSequence = require('run-sequence');

  const STYLES_CONFIG = Object.assign({
    dst: './dist/css',
    src: './src/**/*.scss',
    compassSassDir: './src',
    taskName: 'styles',
    compassImportPath: './node_modules',
  }, config);

  const COMPASS_SASS_DIR = STYLES_CONFIG.compassSassDir || (() => {
    // Compass needs to know where the SASS files are housed.
    const stylesPath = STYLES_CONFIG.src.split('/');
    return stylesPath.slice(0, 2).join('/');
  }());

  if (!STYLES_CONFIG.dst || !STYLES_CONFIG.src) {
    throw new Error('Invalid configuration: value of dst needs to be a path and value of src needs to be a glob or an array of globs.');
  }

  gulp.task((STYLES_CONFIG.taskName + ':compass'), () => {
    return gulp.src(STYLES_CONFIG.src)
      .pipe(gulpCompass({
        css: STYLES_CONFIG.dst,
        import_path: STYLES_CONFIG.compassImportPath,
        sass: COMPASS_SASS_DIR,
        sourcemap: true,
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
          browsers: ['last 2 versions'],
        }),
        cssMqpacker,
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
  const gulp = require('gulp');
  const gulpCssmin = require('gulp-cssmin');
  const gulpRename = require('gulp-rename');

  const STYLES_CONFIG = Object.assign({
    src: './dist/css',
    taskName: 'minifyStyles',
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
