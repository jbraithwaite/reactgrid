// https://gist.github.com/Sigmus/9253068

var package = require('./package.json');

var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var uglify = require('gulp-uglifyjs');
var notify = require("gulp-notify");
var rename = require("gulp-rename");
var minifycss = require('gulp-minify-css');
var header = require('gulp-header');

var scriptsDir = './src';
var buildDir = './dist';

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {

  var props = {entries: [scriptsDir + '/' + file], standalone: 'Reactgrid',  debug: true, cache: {}, packageCache: {}};
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  bundler.transform(reactify);
  bundler.exclude('underscore');

  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(rename(package.name + ".js"))
      .pipe(gulp.dest(buildDir + '/'))
    ;
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  return rebundle();
}

gulp.task('ulglify:css', function() {
  return gulp.src(['src/*.css'])
    .pipe(rename(package.name + ".min.css"))
    .pipe(minifycss())
    .pipe(header("/*! Reactgrid v"+package.version+" | (c) "+(1900 + (new Date).getYear())+" "+package.author+" | "+package.license+" License */\n"))
    .pipe(gulp.dest(buildDir + '/'));
});

gulp.task('ulglify:js', function(){
  return gulp.src('dist/'+package.name+'.js')
    .pipe(uglify(package.name + '.min.js', {
      preserveComments: false,
      compress: {
        warnings: false
      }
    }))
    .pipe(header("/*! Reactgrid v"+package.version+" | (c) "+(1900 + (new Date).getYear())+" "+package.author+" | "+package.license+" License */\n"))
    .pipe(gulp.dest(buildDir + '/'))
  ;
});

gulp.task('watch', function() {
  gulp.watch('dist/'+package.name+'.js', ['ulglify:js']);
  gulp.watch('dist/'+package.name+'.css', ['ulglify:css']);
});

gulp.task('bundle:dev', function() {
  return buildScript('index.js', true);
});

gulp.task('bundle', function() {
  return buildScript('index.js', false);
});

gulp.task('dev', ['bundle:dev', 'ulglify:css', 'watch']);
gulp.task('default', ['bundle', 'ulglify:css', 'watch']);

