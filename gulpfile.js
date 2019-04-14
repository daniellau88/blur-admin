'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var tasks = {};

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  const gulpFiles = require('./gulp/' + file);
  // console.log(exports);
  tasks = {...tasks, ...gulpFiles.tasks};
});
// var hub = new HubRegistry(['gulp/*.js']);

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
function gulpDefault() {
  gulp.start('build');
}
// gulp.registry(hub);

module.exports = tasks;
module.exports.default = gulp.series(tasks.clean, gulpDefault);