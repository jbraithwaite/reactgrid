var package = require('./package.json');
var gulp = require('gulp');
var uglify = require('gulp-uglifyjs');
var rename = require("gulp-rename");
var minifycss = require('gulp-minify-css');
var header = require('gulp-header');
var webpack = require('webpack');

var scriptsDir = './src';
var buildDir = './dist';

gulp.task('react:compile', function(callback) {

    webpack({
      cache: true,
      entry: {
        app: './src/index.js',
      },
      output: {
        libraryTarget: "var",
        library: "Reactgrid",
        filename: buildDir + '/' + package.name + '.js'
      },
      externals: {
        react: 'React',
        underscore: '_'
      }
    }, function(err, stats) {
        if (err) console.log(err);
        callback();
    });
});

gulp.task('ulglify:css', function() {
  return gulp.src(['dist/'+package.name+'.css'])
    .pipe(rename(package.name + ".min.css"))
    .pipe(minifycss())
    .pipe(header("/*! Reactgrid v"+package.version+" | (c) "+(1900 + (new Date()).getYear())+" "+package.author+" | "+package.license+" License */\n"))
    .pipe(gulp.dest(buildDir + '/'));
});

gulp.task('ulglify:js',['react:compile'], function(){
  return gulp.src('dist/'+package.name+'.js')
    .pipe(uglify(package.name + '.min.js', {
      preserveComments: false,
      compress: {
        warnings: false
      }
    }))
    .pipe(header("/*! Reactgrid v"+package.version+" | (c) "+(1900 + (new Date()).getYear())+" "+package.author+" | "+package.license+" License */\n"))
    .pipe(gulp.dest(buildDir + '/'))
  ;
});

gulp.task('default', ['ulglify:js', 'ulglify:css']);

