
# Gulp Tasks

> Collection of reusable gulp tasks

## Usage

Set up Gulp: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

Install this repository as an NPM dependency to integrate its gulp tasks:

In your package.json:
```
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

Refer to `demo/gulpfile.js` for a thorough example of how to use all of the
tasks. Feel free to copy, paste, and customize in your own projects.

In brief, you'll need to use the tasks like this:
```javascript
var lint = require('gulp-tasks/src/lint');

lint.eslint({
  src: './**/*.js',
  taskName: 'lint'
});
```

Then you can use 'lint' in other gulp tasks or run it from the command line:
```bash
gulp lint
```

See below for more information on available tasks.

## Available Gulp Tasks

### assets.copy
### deploy.awsS3
### lint.eslint
### localWebServer.connect
### scripts.browserifyAndWatchify
### scripts.uglify
### styles.compassAndPostcss
### styles.minifyCss
### templates.jade
### tests.karma
### tests.nightwatch

## Maintenance

There is a `demo/src` directory and a `demo/gulpfile.js`. To use the demo
gulpfile from the command line, first cd into the demo dir.

You can use these tasks to test them out, refactor, and make changes and additions.
