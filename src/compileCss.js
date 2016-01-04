
const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const cssWebSocketServer = require('./cssWebSocketServer');
const del = require('del');
const fs  = require('fs');
const gulp = require('gulp');
const gulpCompass = require('gulp-compass');
const gulpPostcss = require('gulp-postcss');
const gulpRename = require('gulp-rename');
const gulpReplace = require('gulp-replace');
const mkdirp = require('mkdirp');
const path  = require('path');
const runSequence = require('run-sequence');

module.exports = customConfig => {
  const config = Object.assign({
    subTaskPrefix: 'compileCss',
    src: './src/**/*.scss',
    dst: './dist/css',
    compassSassDir: undefined,
    compassImportPath: './node_modules',
    sourceMap: (process.env.NODE_ENV !== 'production'),
    wsPort: 4000,
  }, customConfig);

  if (!config.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  if (!config.dst) {
    throw new Error('Invalid configuration: value of dst needs to be a path.');
  }

  cssWebSocketServer.start(config.wsPort);

  function configureClientSideWs() {
    // This file is like a template for future JS file
    const lines = fs.readFileSync(__dirname + '/cssWebSocketClientSide.txt')
      .toString()
      .split('\n');

    function writeLines(fd) {
      const line = lines.shift();

      // Here the variables from config are supplied to final JS
      const lineReplaced = line.toString()
        .replace('#{cssHref}', '/css/dist.css') // TODO: remove hardcode
        .replace('#{port}', config.wsPort)
        .concat('\n');

      fs.writeSync(fd, lineReplaced);

      if (lines.length > 0) {
        writeLines(fd);
      }
    }

    const cssWebSocketFolder = path.join(
      __dirname,
      '../dist'
    );

    mkdirp.sync(cssWebSocketFolder);

    const cssWebSocketFile = path.join(
      cssWebSocketFolder,
      'cssWebSocketClientSide.js'
    );

    // This creates JS file from template
    fs.open(cssWebSocketFile, 'w', (err, fd) => {
      writeLines(fd);
    });
  }

  configureClientSideWs();

  // Compile SCSS with Compass.
  const compileScss = `${config.subTaskPrefix}:compass`;

  config.compassSassDir = config.compassSassDir || (() => {
    // Compass needs to know where the SCSS files are housed.
    const stylesPath = config.src.split('/');
    return stylesPath.slice(0, 2).join('/');
  })();

  gulp.task(compileScss, () => {
    return gulp.src(config.src)
      .pipe(gulpCompass({
        css: config.dst,
        import_path: config.compassImportPath,
        sass: config.compassSassDir,
        sourcemap: config.sourceMap,
      }))
      .on('error', function onCompileScssError() {
        // Continue watching when an error occurs.
        this.emit('end');
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
      .on('error', function onPostCssError() {
        // Continue watching when an error occurs.
        this.emit('end');
      })
      .pipe(gulp.dest(config.dst));
  });

  // Rename the compiled CSS file.
  const renameCompiledCss = `${config.subTaskPrefix}:renameDstIndexCss`;

  gulp.task(renameCompiledCss, () => {
    const stream = gulp.src(`${config.dst}/*`)
      // Replace occurences of index.css with dist.css inside of files
      .pipe(gulpReplace('index.css', 'dist.css'))
      // Rename files from *index*.* to *dist*.*
      .pipe(gulpRename((pathToRename) => {
        pathToRename.basename = pathToRename.basename.replace('index', 'dist');
      }))
      .pipe(gulp.dest(config.dst));

    stream.on('finish', () => {
      // In case you have site opened in numerous browsers or tabs/windows
      // there will be many clients connected, so send update to all
      cssWebSocketServer.instance.clients.forEach(client => client.send());
    });

    return stream;
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
