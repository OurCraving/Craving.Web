var gulp = require('gulp');
var config = require('../config');
var runSequence = require('run-sequence');

gulp.task('build:d', function (callback) {
    runSequence(
        ['jshint'],
        ['less:theme', 'less:vendor', 'copy:build'],
        [
            'cssmin:vendor',
            'cssmin:theme',
            'browserify:main',
            'concat:dist',
            'swig:dist'
        ],
		['env:replace'],
        ['uglify:main', 'uglify:theme', 'prettify:theme'],
        callback);
});

gulp.task('build:choose', function (callback) {
    runSequence(
        'build:d',
        'rename',
        callback);
});

gulp.task('build:dm', function (callback) {
    runSequence(
        ['jshint'],
        ['less:theme', 'less:vendor', 'less:modules', 'copy:build'],
        [
            'cssmin:vendor',
            'cssmin:theme',
            'cssmin:modules',
            'browserify:modules',
            'concat:dist',
            'concat:modules',
            'swig:dist'
        ],
        ['env:replace'],
        ['uglify:main', 'uglify:theme', 'uglify:modules', 'prettify:theme'],
        callback);
});

var replace = require('gulp-replace');
var path = require('path');
var handleErrors = require('../util/handleErrors');
var gulpIf = require('gulp-if');
var complete = require('../util/handleComplete');

var gulpReplace = function (files, cb) {
    var env = config.release || 'debug';
    var endpoint = env === 'debug' ? 'localhost:40104' : 'www.cravingconnect.co';
    var fileserver = env === 'debug' ? 'localhost:54991' : 'www.ourcraving.com';
    var scriptFolder = 'js/app';
    var replacePath = path.join(config.dist, config.theme, scriptFolder);
    //var destPath = path.join(config.dist, config.theme, scriptFolder);

    // process.stdout.write(endpoint);
    return gulp.src(files, { cwd: replacePath })
        .pipe(replace('@@serviceEndPoint', endpoint).on('error', handleErrors))
		.pipe(replace('@@fileEndPoint', fileserver).on('error', handleErrors))
        .pipe(gulp.dest(replacePath).on('error', handleErrors))
        .pipe(gulpIf(global.isWatching, complete()))
        .on('error', handleErrors);
};

gulp.task('env:replace', function () {
    return gulpReplace(['app.js']);
});