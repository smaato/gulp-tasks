
# Gulp Tasks

> Methods for easily creating common gulp tasks

## Usage

Set up Gulp: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

Install this repository as an NPM dependency:

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

Refer to `demo/gulpfile.js` for a thorough example of how to use all this
module's methods. Feel free to copy, paste, and customize in your own projects.

Here's a brief example of how you can use this module to create and register
gulp tasks:

```javascript
var gulpTasks = require('gulp-tasks');

// Each module method returns an object with `config` and `task` properties.
//   - The config property is used for testing.
//   - The task property is a function which you can register as a gulp task.

gulp.task('demoLintJs', gulpTasks.lintJs({
  src: './src/**/*.js',
}).task);
```

## Task-creation methods

### copy

Copy assets from one location to another.

### compileCss

Compile SCSS with Compass, and run the compiled CSS through PostCSS with
Autoprefixer.

### compileHtml

Compile Jade templates into HTML.

### compileJs

Compile JS with Browserify, Browserify-HMR, and Babelify. Optionally watch for
changes and re-compile.

### deploy

Deploy to an AWS S3 bucket.

### lintJs

Lint JS with ESLint.

### lintScss

Lint SCSS with scss_lint.

### minifyCss

Minify CSS with clean-css.

### minifyJs

Minify JS with uglify.

### serve

Serve files on localhost.

### testE2e

Run end-to-end tests with Nightwatch in PhantomJS.

### testUnit

Run unit tests with Karma.

## Maintenance

There is a `demo/src` directory and a `demo/gulpfile.js`. To use the demo
gulpfile from the command line, first cd into the demo dir.

You can use this demo gulpfile to test out this module, refactor it, and make
changes and additions.

### Writing unit tests

The unit tests document inputs and outputs: acceptable inputs document how they
correspond to outputs, and unacceptable inputs document errors.

Here are some tips for writing good unit tests:

* **Test module methods and gulp tasks separately.** Module methods are used to
generated gulp tasks, whereas gulp tasks act upon the file system.
* **Test each method's configuration options.** Test unacceptable configuration
parameters and resulting errors. Document defaults.
* **Avoid tightly-coupled specs.** Make sure you register a new task
in each spec -- don't assume a task has already been registered by another
spec, to avoid tightly coupling the specs and the order in which they're
executed.
* **Avoid task name collisions!** Because we can't unregister gulp tasks,
there is no way to clean up after executing a spec. So make sure all tasks
(and sub-tasks!) are registered with unique names.
* **Test the file output of tasks** where possible. Don't forget to clean up
the `dist` directory *before* executing the task.
* **Use `describe` blocks** to clearly group and sub-group like-minded specs. Name
these blocks in such a way so that the resulting assertion reads like a sentence.
* **Name expectations explicitly** and remove any content within a test that doesn't
affect the expectation.

In general:

* **Use tests to guard against very specific mistakes** (e.g. "x is likely
to break if we refactor y and forget to do z").
* **Use tests to document the specific usage of an interface.**
