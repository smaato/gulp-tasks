
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

module.exports = customConfig => {
  const config = Object.assign({
    subTaskPrefix: 'compileCss',
    src: './src/**/*.scss',
    dst: './dist/css',
    compassSassDir: './src',
    compassImportPath: './node_modules',
    sourceMap: true,
  }, customConfig);

  if (!config.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  if (!config.dst) {
    throw new Error('Invalid configuration: value of dst needs to be a path.');
  }

  // Compile SCSS with Compass.
  const compileScss = `${config.subTaskPrefix}:compass`;

  const compassSassDir = config.compassSassDir || (() => {
    // Compass needs to know where the SCSS files are housed.
    const stylesPath = config.src.split('/');
    return stylesPath.slice(0, 2).join('/');
  }());

  gulp.task(compileScss, () => {
    return gulp.src(config.src)
      .pipe(gulpCompass({
        css: config.dst,
        import_path: config.compassImportPath,
        sass: compassSassDir,
        sourcemap: config.sourceMap,
      }))
      .on('error', () => {
        throw new Error('Compass failed');
      })
      .pipe(gulp.dest(config.dst));
  });

  // Run compiled CSS through PostCSS with Autoprefixer.
  const applyPostCss = `${config.subTaskPrefix}:postCss`;

  gulp.task(applyPostCss, () => {
    return gulp.src(`${config.dst}/index.css`)
      .pipe(gulpPostcss([
        autoprefixer({
          browsers: ['last 2 versions'],
        }),
        cssMqpacker,
      ]))
      .pipe(gulp.dest(config.dst));
  });

  // Rename the compiled CSS file.
  const renameCompiledCss = `${config.subTaskPrefix}:renameDstIndexCss`;

  gulp.task(renameCompiledCss, () => {
    return gulp.src(`${config.dst}/*`)
      // Replace occurences of index.css with dist.css inside of files
      .pipe(gulpReplace('index.css', 'dist.css'))
      // Rename files from *index*.* to *dist*.*
      .pipe(gulpRename((path) => {
        path.basename = path.basename.replace('index', 'dist');
      }))
      .pipe(gulp.dest(config.dst))
      .pipe(gulpConnect.reload());
  });

  // Delete the original compiled CSS files.
  const deleteOriginalCss = `${config.subTaskPrefix}:deleteDstIndexCss`;

  gulp.task(deleteOriginalCss, () => {
    return del([
      `${config.dst}/index.css`,
      `${config.dst}/index.css.map`,
    ]);
  });

  // Compile CSS with Compass and PostCSS.
  function compileCss(callback) {
    runSequence(
      compileScss,
      applyPostCss,
      renameCompiledCss,
      deleteOriginalCss,
      callback
    );
  }

  return {
    task: compileCss,
    config,
  };
};
