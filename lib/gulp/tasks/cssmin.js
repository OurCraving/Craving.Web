var gulp = require('gulp');
var config = require('../config');
var path = require('path');
var gulpIf = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var changed = require('gulp-changed');

var cssPath = path.join(config.dist, config.theme, 'css');

var gulpCssmin = function (src, cb, dest) {
    if (config.minify) {

        var destTemp = cssPath;
        if (typeof dest !== 'undefined') {
            destTemp = path.join(cssPath, dest);
        }

        return gulp.src(src, {cwd: cssPath})
            .on('error', handleErrors)
            .pipe(changed(cssPath, {extension: '.min.css'}))
            .pipe(gulpIf(global.debug, sourcemaps.init()))
            .pipe(minifyCSS().on('error', handleErrors))
            .pipe(gulpIf(global.debug, sourcemaps.write('.')))
            .pipe(rename({
                extname: '.min.css'
            }))
            .pipe(gulp.dest(destTemp));
    }
    cb();
};

gulp.task('cssmin:vendor', function (cb) {
    return gulpCssmin([ '*.css', '!*.min.css' ], cb, 'min');
});

gulp.task('cssmin:theme', function (cb) {
    return gulpCssmin([ 'app/app.css', 'app/main.css' ], cb, 'app');
});

gulp.task('cssmin:modules', function (cb) {
    return gulpCssmin([ 'app/*.css', '!app/*.min.css', '!app/app.css', '!app/main.css' ], cb, 'app');
});

gulp.task('cssmin:skins', function (cb) {
    return gulpCssmin([ 'skin-*.css', '!*.min.css' ], cb);
});