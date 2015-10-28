
# Gulp Tasks

> Collection of reusable gulp tasks

## Usage

Set up Gulp: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

Install this repository as an NPM dependency to integrate its gulp tasks:

In your package.json:
```json
{
  ...
  "devDependencies": {
    ...
    "gulp-tasks": "git@github.com:SmaatoUI/gulp-tasks.git#v0.1.0",
    ...
  }
  ...
}
```

On the command line:
```bash
npm install
```

In your gulpfile.js:
```javascript
var lint = require('gulp-tasks/src/lint');

lint.eslint({
  src: './**/*.js',
  taskName: 'lint'
});
```

Use 'lint' in other gulp tasks or run it from the command line:
```bash
gulp lint
```

## Available Gulp Tasks

assets
├--copy
deploy
├--awsS3
lint
├--eslint
localWebServer
├--connect
scripts
├--browserifyAndWatchify
├--uglify
styles
├--compassAndPostcss
├--minifyCss
templates
├--jade
tests
├--karma
├--nightwatch
