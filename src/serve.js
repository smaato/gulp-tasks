
const gulpConnect = require('gulp-connect');

module.exports = customConfig => {
  const config = Object.assign({
    root: './dist',
    fallback: './dist/index.html',
    port: 8000,
    livereload: true,
  }, customConfig);

  // Use Connect to serve files to localhost.
  function serve() {
    gulpConnect.server(config);
  }

  return {
    task: serve,
    config,
  };
};
