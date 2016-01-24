var gulp = require('gulp');
var config = require('../config');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var complete = require('../util/handleComplete');
var path = require('path');
var rename = require('gulp-rename');
var changed = require('gulp-changed');

var gulpUglify = function (src, cb) {
    if (config.minify) {
        var uglifyPath = path.join(config.dist, config.theme, 'js');
        return gulp.src(src, {cwd: uglifyPath})
            .pipe(changed(uglifyPath, {extension: '.min.js'}))
            .pipe(uglify().on('error', handleErrors))
            .pipe(rename({extname: '.min.js'}))
            .pipe(gulp.dest(uglifyPath))
            .pipe(gulpIf(global.isWatching, complete()))
            .on('error', handleErrors);
    }
    cb();
};

gulp.task('uglify:all', function (cb) {
    return gulpUglify([ '**/*.js', '!*.min.js' ], cb);
});

gulp.task('uglify:theme', function (cb) {
    return gulpUglify([ 'app/app.js', 'app/main.js', 'vendor/*.js', '!*.min.js' ], cb);
});

gulp.task('uglify:modules', function (cb) {
    return gulpUglify([ 'app/**/*.js', '!*.min.js' ], cb);
});

gulp.task('uglify:main', function (cb) {
    return gulpUglify([ 'app/app.js' ], cb);
});