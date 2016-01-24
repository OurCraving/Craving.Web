var gulp = require('gulp');
var config = require('../config');
var gulpIf = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var complete = require('../util/handleComplete');
var path = require('path');
var prettify = require('gulp-prettify');

var gulpPrettify = function (src) {
    var prettifyPath = path.join(config.dist, config.theme);
    return gulp.src(src, {cwd: prettifyPath})
        .pipe(prettify({
            indent: 4,
            indent_inner_html: false,
            preserve_newlines: true,
            max_preserve_newlines: 1,
            brace_style: "condense",
            unformatted: [ "a", "span", "i", "pre", "code" ]
        }).on('error', handleErrors))
        .pipe(gulp.dest(prettifyPath))
        .pipe(gulpIf(global.isWatching, complete()))
        .on('error', handleErrors);
};

gulp.task('prettify:theme', function () {
    return gulpPrettify([ '**/*.html' ]);
});