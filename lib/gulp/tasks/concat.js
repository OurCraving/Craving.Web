var config = require('../config');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var handleErrors = require('../util/handleErrors');
var sourcemaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');
var runSequence = require('run-sequence');
var shortid = require('shortid');

var gulpConcat = function (src, dest, bundleName) {
    return gulp.src(src)
        .pipe(gulpIf(global.debug, sourcemaps.init()))
        .pipe(concat(bundleName))
        .pipe(gulpIf(global.debug, sourcemaps.write('.')))
        .pipe(gulp.dest(dest))
        .on('error', handleErrors);
};

gulp.task('concat:dist', function (callback) {
    var tasks = [];
    if (config.concat.length) {
        config.concat.forEach(function (task) {
            if ((typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) && (typeof task.exclude == 'undefined' || task.exclude.indexOf(config.theme) === - 1)) {

                // ignore modules
                if (task.build.indexOf("js/app/") !== - 1 && task.build.indexOf("css/app/") !== - 1) return true;

                var id = shortid.generate(),
                    taskId = 'concat:' + task.build + '-' + id;

                var files = [];
                task.files.forEach(function (file) {
                    var cwd;
                    try {
                        cwd = task.cwd.ReplaceSpecialPaths(config);
                    } catch (e) {
                    }
                    file = file.ReplaceSpecialPaths(config);
                    files.push(path.join(cwd, file));
                });

                gulp.task(taskId, function () {
                    return gulpConcat(files, path.join(config.dist, config.theme), task.build);
                });

                tasks.push(taskId);
            }
        });
    }

    if (tasks.length) {
        runSequence.apply(runSequence, tasks.concat(callback));
    } else {
        callback();
    }
});

gulp.task('concat:modules', function (callback) {
    var tasks = [];
    if (config.concat.length) {
        config.concat.forEach(function (task) {
            if (task.build && (typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) && (typeof task.exclude == 'undefined' || task.exclude.indexOf(config.theme) === - 1)) {

                // ignore anything other than modules
                if (task.build.indexOf("js/app/") === - 1) return true;
                if (task.build.indexOf("css/app/") === - 1) return true;

                var id = shortid.generate(),
                    taskId = 'concat:' + task.build + '-' + id;

                var files = [];
                task.files.forEach(function (file) {
                    var cwd = task.cwd.ReplaceSpecialPaths(config);
                    files.push(path.join(cwd, file));
                });

                gulp.task(taskId, function () {
                    return gulpConcat(files, path.join(config.dist, config.theme), task.build);
                });

                tasks.push(taskId);
            }
        });
    }

    if (tasks.length) {
        runSequence.apply(runSequence, tasks.concat(callback));
    }
    else {
        callback();
    }
});