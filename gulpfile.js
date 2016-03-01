
const gulp = require('gulp');
const gulpJasmine = require('gulp-jasmine');
const lintJs = require('./index').lintJs;

gulp.task('cssWsConfigureClient', () => {
  const cssWsConfigureClient = require('./src/cssWebsocket/configureClient');
  cssWsConfigureClient(4000, '/css/dist.css');
});

gulp.task('lint', ['cssWsConfigureClient'], lintJs({
  src: [
    './*.js',
    './src/**/*.js',
    './dist/cssWebsocketClient.js',
  ],
}).task);

gulp.task('unit', () => (
  gulp.src(['./src/**/*.js', '!./src/cssWebsocket/*'])
    .pipe(gulpJasmine({
      verbose: true,
    }))
));

gulp.task('test', ['lint', 'unit']);
