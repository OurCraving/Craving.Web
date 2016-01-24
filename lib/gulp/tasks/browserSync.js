var config = require('../config');
var browserSync = require('browser-sync');
var path = require('path');
var gulp = require('gulp');
var extend = require('extend');

var startPath = config.dist + (config.dist !== '' ? '/' : '' ) +
    ( config.theme != 'choose' ? config.theme : '' ) + '/index.html';

var defaults = {
    online: false,
    notify: false,
    minify: false,
    injectChanges: false
};

gulp.task("browserSync:init", function (callback) {
    var options = defaults;
    extend(true, options, {
        server: {
            baseDir: './'
        },
        startPath: startPath
    });

    browserSync.init([
        config.dist + '/' + config.theme + '/**/css/*.css',
        config.dist + '/' + config.theme + '/**/js/*.js'
    ], options);

    callback();
});

gulp.task("browserSync:reload", function (callback) {
    browserSync.reload();
    callback();
});