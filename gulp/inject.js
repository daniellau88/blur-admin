'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

var scriptsTasks = require('./scripts');
var stylesTasks = require('./styles');
var imagesTasks = require('./images');

var { scripts } = scriptsTasks.tasks;
var { styles, stylesAuth, styles404 } = stylesTasks.tasks;
var { copyVendorImages } = imagesTasks.tasks;

function injectReload(cb) {
  browserSync.reload();
  cb();
};

function inject() {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/main.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], {read: false});

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/assets/js/**/*.js'),
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
    /*.pipe($.angularFilesort())*/.on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/index.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
}

function injectAuth() {
  return injectAlone({
    css: [path.join('!' + conf.paths.tmp, '/serve/app/vendor.css'), path.join(conf.paths.tmp, '/serve/app/auth.css')],
    paths: [path.join(conf.paths.src, '/auth.html'), path.join(conf.paths.src, '/reg.html')]
  })
}

function inject404() {
  return injectAlone({
    css: [path.join('!' + conf.paths.tmp, '/serve/app/vendor.css'), path.join(conf.paths.tmp, '/serve/app/404.css')],
    paths: path.join(conf.paths.src, '/404.html')
  })
}

var injectAlone = function (options) {
  var injectStyles = gulp.src(
    options.css
    , {read: false});

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(options.paths)
    .pipe($.inject(injectStyles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
};

const injectTask = gulp.series(styles, inject);
const inject404Task = gulp.series(styles404, inject404);
const injectAuthTask = gulp.series(stylesAuth, injectAuth);
const overallInjectTask = gulp.series(scripts, gulp.parallel(injectTask, inject404Task, injectAuthTask, copyVendorImages))

exports.tasks = {
  'inject': overallInjectTask,
  'inject404': inject404Task,
  'injectAuth': injectAuthTask,
  'inject-reload': gulp.series(overallInjectTask, injectReload)
}