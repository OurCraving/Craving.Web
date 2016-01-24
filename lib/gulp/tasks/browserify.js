var browserify = require('browserify');
var watchify = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var complete = require('../util/handleComplete');
var source = require('vinyl-source-stream');
var config = require('../config');
var path = require('path');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var fs = require('fs');
var replace = require('gulp-replace');
var bundles = [];

gulp.task('browserify:init-main', function (callback) {

    bundles = [ {
        src: './src/js/themes/' + config.theme + '/app.js',
        dest: path.join(config.dist, config.theme, 'js', 'app'),
        bundleName: 'app.js'
    } ];

    if (fs.existsSync('./src/js/themes/' + config.theme + '/main.js')) {
        bundles.push({
            src: './src/js/themes/' + config.theme + '/main.js',
            dest: path.join(config.dist, config.theme, 'js', 'app'),
            bundleName: 'main.js'
        });
    }

    callback();

});

gulp.task('browserify:init-modules', [ 'browserify:init-main' ], function (callback) {

    config.browserify.forEach(function (task) {
        if ((typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) && (typeof task.exclude == 'undefined' || task.exclude.indexOf(config.theme) === - 1)) {
            var dest = path.join(config.dist, config.theme, 'js'),
                src = task.cwd + task.src;

            bundles.push({
                src: src,
                dest: dest,
                bundleName: task.build
            });
        }
    });

    callback();

});

gulp.task('browserify:run', function (callback) {

    var bundleQueue = bundles.length;
    var env = config.release || 'debug';
    var endpoint = env === 'debug' ? 'localhost:40104' : 'www.cravingconnect.co';
    var fileserver = env === 'debug' ? 'localhost:54991' : 'www.ourcraving.com';
    var rootPath = env === 'debug' ? '/md' : '';

    var browserifyThis = function (bundleConfig) {

        var bundler = browserify({
            // Required watchify args
            cache: {}, packageCache: {}, fullPaths: true,
            // Specify the entry point of your app
            entries: bundleConfig.src,
            // Enable source maps!
            debug: global.debug,
            paths: config.browserifyOptions.paths
        });

        var bundle = function () {
            // Log when bundling starts
            bundleLogger.start(path.join(bundleConfig.dest, bundleConfig.bundleName));

            return bundler
                .bundle()
                // Report compile errors
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.bundleName))
                // Specify the output destination
                .pipe(replace('@@serviceEndPoint', endpoint).on('error', handleErrors))
                .pipe(replace('@@fileEndPoint', fileserver).on('error', handleErrors))
                .pipe(replace('@@rootPath', rootPath).on('error', handleErrors))
                .pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished)
                .pipe(gulpIf(global.isWatching, complete()))
                .pipe(gulpIf(global.isWatching, browserSync.reload({stream: true})));
        };

        if (global.isWatching) {
            // Wrap with watchify and rebundle on changes
            bundler = watchify(bundler);
            // Rebundle on update
            bundler.on('update', bundle);
        }

        var reportFinished = function () {
            // Log when bundling completes
            bundleLogger.end(path.join(bundleConfig.dest, bundleConfig.bundleName));

            if (bundleQueue) {
                bundleQueue --;
                if (bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    bundles.forEach(browserifyThis);
});

gulp.task('browserify:main', function (callback) {
    runSequence('browserify:init-main', 'browserify:run', callback);
});
gulp.task('browserify:modules', function (callback) {
    runSequence('browserify:init-modules', 'browserify:run', callback);
});
gulp.task('browserify', function (callback) {
    runSequence('browserify:init-main', 'browserify:init-modules', 'browserify:run', callback);
});