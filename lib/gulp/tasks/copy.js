var gulp = require('gulp');
var path = require('path');
var config = require('../config');
var handleErrors = require('../util/handleErrors');
var complete = require('../util/handleComplete');
var gulpIf = require('gulp-if');
var runSequence = require('run-sequence');
var gulpFlatten = require('gulp-flatten');
var distThemePath = path.join(config.dist, config.theme);

var gulpCopy = function (src, dest, cwd, flatten) {
    return gulp.src(src, {cwd: cwd || process.cwd()})
        .on('error', handleErrors)
        .pipe(gulpIf(flatten, gulpFlatten()))
        .pipe(gulp.dest(dest))
        .pipe(gulpIf(global.isWatching, complete()));
};

/*
 * IMAGES
 */

gulp.task('copy:images-common', function () {
    return gulpCopy('**/*', path.join(distThemePath, 'images'), 'src/images/common/');
});

gulp.task('copy:images-theme', [ 'copy:images-common' ], function () {
    return gulpCopy('**/*', path.join(distThemePath, 'images'), path.join('src', 'images', 'themes', config.theme));
});

gulp.task('copy:images', [ 'copy:images-common', 'copy:images-theme' ]);

/*
 * BUILD
 */

gulp.task('copy:build', function (callback) {
    var tasks = [ 'copy:images' ];
    if (config.copy.length) {
        config.copy.forEach(function (task) {
            if (typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) {

                var flatten = typeof task.flatten !== 'undefined' ? task.flatten : false;

                gulp.task('copy:' + task.task, function () {
                    return gulpCopy(task.src, path.join(config.dist, config.theme, task.dest), task.cwd.ReplaceSpecialPaths(config), flatten);
                });

                tasks.push('copy:' + task.task);
            }
        });
    }

    if (tasks.length) {
        runSequence.apply(runSequence, tasks.concat(callback));
    } else {
        callback();
    }
});