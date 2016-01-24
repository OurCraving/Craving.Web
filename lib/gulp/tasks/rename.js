var gulp = require('gulp');
var rename = require('gulp-rename');
var config = require('../config');
var handleErrors = require('../util/handleErrors');
var runSequence = require('run-sequence');
var shortid = require('shortid');
var tasks = [];

if (config.rename.length) {
    config.rename.forEach(function (task) {
        if ((typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) && (typeof task.exclude == 'undefined' || task.exclude.indexOf(config.theme) === - 1)) {

            task.files.forEach(function (file) {
                var id = shortid.generate(),
                    taskShortId = 'rename:' + task.name + id;

                gulp.task(taskShortId, function () {
                    return gulp.src(file.src.ReplaceSpecialPaths(config))
                        .on('error', handleErrors)
                        .pipe(rename(file.dest.ReplaceSpecialPaths(config)))
                        .pipe(gulp.dest(process.cwd()));
                });
                tasks.push(taskShortId);
            });

        }
    });
}

gulp.task('rename', function (callback) {
    if (tasks.length) {
        runSequence.apply(runSequence, tasks.concat(callback));
    }
    else {
        callback();
    }
});