var config = require('../config');
var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('watch:set', function (callback) {
    global.isWatching = true;
    global.debug = true;
    callback();
});

var watch = {
    less: {
        tasks: [ 'less:watch' ]
    },
    js: {
        tasks: ['jshint', 'browserify:main']
    },
    html: {
        tasks: [ 'swig:watch' ]
    }
};

Object.keys(watch).forEach(function (watcher) {
    gulp.task('watch:' + watcher, [ 'watch:set' ], function (callback) {
        // run in sequence
        // runSequence.apply(runSequence, watch[ watcher ].tasks.concat(callback));

        // run in batch
        runSequence(watch[ watcher ].tasks, callback);
    });
});

gulp.task('watch', [ 'watch:set' ], function (callback) {
    runSequence(
        'browserSync:init',
        ['watch:less', 'watch:js', 'watch:html'],
        callback);
});