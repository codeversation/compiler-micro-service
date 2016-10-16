const gulp = require('gulp');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const path = require('path');
const changed = require('gulp-changed');
const del = require('del');
const nodemon = require('gulp-nodemon');
const nodemonConfig = require('./nodemon');
const eslint = require('gulp-eslint');
const spawn = require('child_process').spawn;

// Setup the directories of the project
const paths = {
  src: 'src',
  build: 'build',
  vendor: 'vendor',
};

const PWD = process.env.PWD;

// Util that produeces a path refering to the files inside a given dir.
const files = dir => path.join(dir, '/**/*');
const out = dir => path.join(paths.build, dir);
const lib = dir => out(path.join('lib', 'node_modules', dir));

paths.lib = path.join(paths.build, 'lib', 'node_modules');
paths.server = lib('index.js');
gutil.log(paths.server);

nodemonConfig.watch = [paths.lib];

////////////////////////

gulp.task('default', ['server'])

// start dev server
gulp.task('dev', ['watch'], () => {
  nodemonConfig.script = paths.server;
  nodemonConfig.stdout = false;

  nodemon(nodemonConfig)

  .on('stdout', data => {
    data.toString().trim().split(/\r\n|\r|\n/g).map(line => {
      gutil.log(`[srv]: ${line}`);
    });
  });
});

gulp.task('server', ['build'], () => {
  const server = spawn('node', ['build/lib/node_modules']);

  server.stdout.on('data', (data) => {
    data.toString().trim().split('\n').map(line => {
      gutil.log(gutil.colors.blue('server'), ':', line);
    });
  });

  server.stderr.on('data', (data) => {
    data.toString().trim().split('\n').map(line => {
      gutil.log(gutil.colors.red('server'), ':', line);
    });
  });

  server.on('close', (code) => {
    gutil.log(`server exited with code ${code}`);
  });
});

gulp.task('eslint', () => {
  return gulp.src(files(paths.src))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('watch', ['watch-src', 'watch-vendor']);

gulp.task('build', ['build-lib', 'build-vendor']);

// watches
gulp.task('watch-src', ['build-lib'], () => {
  gulp.watch(files(paths.src), ['build-lib']);
});

gulp.task('watch-vendor', ['build-vendor'], () => {
  gulp.watch(files(paths.vendor), ['build-vendor']);
});

///////////// builds

gulp.task('build-lib', () => {
  return gulp.src(files(paths.src))
    .pipe(changed(paths.lib))
    .pipe(babel())
    .pipe(gulp.dest(paths.lib));
});

gulp.task('build-vendor', () => {
  return gulp.src(files(paths.vendor))
    .pipe(changed(lib(paths.vendor)))
    .pipe(gulp.dest(lib(paths.vendor)));
});

// clean
gulp.task('clean', () => {
  return del(paths.build);
});
