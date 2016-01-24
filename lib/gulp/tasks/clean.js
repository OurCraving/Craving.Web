var gulp = require('gulp');
var config = require('../config');
var del = require('del');

gulp.task('clean:html', function (cb) {
    del([ config.dist + '/' + config.theme + '/**/*.html', '!' + config.dist + '/' + config.theme + '/components/**/*.html' ], cb);
});

gulp.task('clean:dist', function (cb) {
    del([ config.dist + '/' + config.theme + '/**/*' ], cb);
});

gulp.task('clean:modules', function (cb) {
    del([ config.dist + '/' + config.theme + '/css/app/*.css', config.dist + '/' + config.theme + '/js/app/*.js', '!*/app/app.css', '!*/app/main.css', '!*/app/app.js', '!*/app/main.js' ], cb);
});

gulp.task('clean:skins', function (cb) {
    del([ config.dist + '/' + config.theme + '/css/skin-*.css' ], cb);
});