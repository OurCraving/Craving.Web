var gulp = require('gulp');
var less = require('gulp-less');
var config = require('../config');
var path = require('path');
var handleErrors = require('../util/handleErrors');
var complete = require('../util/handleComplete');
var gulpIf = require('gulp-if');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

var destPath      = path.join(config.dist, config.theme, 'css'),
    cwdThemesPath = path.join('src', 'less', 'themes', config.theme),
    cwdSkinsPath  = path.join('src', 'less', 'skins', config.theme);

var gulpLess = function (src, cwd, dest) {

    var tempDestPath = destPath;
    if (typeof dest !== 'undefined' && dest) {
        tempDestPath = path.join(destPath, dest);
    }

    return gulp.src(src, {cwd: cwd || process.cwd()})
        .on('error', handleErrors)
        .pipe(less(config.less).on('error', handleErrors))
        .pipe(gulpIf(global.debug, sourcemaps.init()))
        .pipe(autoprefixer({browsers: [ 'last 4 versions' ]}).on('error', handleErrors))
        .pipe(gulpIf(global.debug, sourcemaps.write('.')))
        .pipe(gulp.dest(tempDestPath))
        .pipe(gulpIf(global.isWatching, complete()))
        .pipe(gulpIf(global.isWatching, browserSync.reload({stream: true})));
};

gulp.task('less:theme', function () {
    return gulpLess([ '*.less', '!_*.less' ], cwdThemesPath, 'app');
});

gulp.task('less:modules', function () {
    return gulpLess([ 'app/*.less', '!app/_*.less' ], cwdThemesPath, 'app');
});

gulp.task('less:vendor', function () {
    return gulpLess([ 'vendor/*.less', '!vendor/_*.less' ], cwdThemesPath, 'vendor');
});

gulp.task('less:skins', function () {
    return gulpLess('*.less', cwdSkinsPath);
});

gulp.task('less', [ 'less:theme', 'less:modules', 'less:vendor', 'less:skins' ]);

gulp.task('less:watch', function () {
    var src = [ '**/*.less', '!app/*.less' ];
    watch(src, {cwd: cwdThemesPath, verbose: true, read: false}, function () {
        gulpLess('app.less', cwdThemesPath, 'app');
    });
    watch('lib/**/*.less', {verbose: true, read: false}, function () {
        gulpLess('app.less', cwdThemesPath, 'app');
    });
});