var gulp = require('gulp');
var jshint = require('gulp-jshint');
var handleErrors = require('../util/handleErrors');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var wutil = require('../util/watch');

gulp.task('jshint', function (callback) {

    if (! global.debug) {
        return callback();
    }

    var src = [ 'src/js/**/*.js', 'lib/**/*.js', '!lib/grunt/**/*.js', '!lib/gulp/**/*.js' ];
    var run = gulp.src(src);

    if (global.isWatching === true) {
        run = run.pipe(watch(src))
            .pipe(filter(wutil.isChanged));
    }

    return run
        .pipe(jshint({lookup: false}))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', handleErrors);
});