'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();


function scriptsReload() {
  return buildScripts()
    .pipe(browserSync.stream());
};

function scripts() {
  return buildScripts();
}

function buildScripts() {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.size())
};

exports.tasks = {
  'scripts': scripts,
  "scripts-reload": scriptsReload
}