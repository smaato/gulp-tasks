
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

See below for more information on the modules and methods, and which Gulp tasks
they will create.

## Modules and methods

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

### Writing unit tests

The unit tests document inputs and outputs: acceptable inputs document how they
correspond to outputs, and unacceptable inputs document errors.

Here are some tips for writing good unit tests:

* **Test module methods and gulp tasks separately.** Module methods are used to
generated gulp tasks, whereas gulp tasks act upon the file system.
* **Test each method's configuration options.** Test unacceptable configuration
parameters and resulting errors.
* **Test which tasks are created by invoking a method.** Make sure you register a
new task in each spec -- don't assume a task has already been registered by
another spec, to avoid tightly coupling the specs and the order in which they're
executed.
* **Avoid task name collisions!** Because we can't unregister gulp tasks,
there is no way to clean up after executing a spec. So make sure all tasks are
registered with unique names.
* **Use `describe` blocks** to clearly group and sub-group like-minded specs. Name
these blocks in such a way so that the resulting assertion reads like a sentence.
* **Name expectations explicitly** and remove any content within a test that doesn't
affect the expectation.
