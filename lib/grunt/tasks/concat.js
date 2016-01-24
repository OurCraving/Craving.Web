var config = require('../config');
var path = require('path');

module.exports = function (grunt) {

    if (! config.theme) return;

    grunt.config('concat', {
        options: {
            banner: '<%= banner %>\n<%= jqueryCheck %>',
            stripBanners: false,
            nonull: true
        }
    });

    if (config.concat.length) {
        config.concat.forEach(function (task) {
            if ((typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) && (typeof task.exclude == 'undefined' || task.exclude.indexOf(config.theme) === - 1)) {

                // ignore modules
                if (task.build.indexOf("js/app/") !== - 1 && task.build.indexOf("css/app/") !== - 1) return true;

                var files = [];
                task.files.forEach(function (file) {
                    var cwd = task.cwd.ReplaceSpecialPaths(config);
                    files.push(path.join(cwd, file));
                });
                grunt.config([ 'concat', task.build ], {
                    src: [ files ],
                    dest: path.join(config.dist, config.theme, task.build)
                });
            }
        });
    }

    grunt.registerTask('concat-modules', function () {
        if (config.concat.length) {
            config.concat.forEach(function (task) {
                if ((typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) && (typeof task.exclude == 'undefined' || task.exclude.indexOf(config.theme) === - 1)) {

                    // ignore anything other than modules
                    if (task.build.indexOf("js/app/") === - 1) return true;
                    if (task.build.indexOf("css/app/") === - 1) return true;

                    var files = [];
                    task.files.forEach(function (file) {
                        var cwd = task.cwd.ReplaceSpecialPaths(config);
                        files.push(path.join(cwd, file));
                    });
                    grunt.config([ 'concat', task.build ], {
                        src: [ files ],
                        dest: path.join(config.dist, config.theme, task.build)
                    });

                    grunt.task.run('concat:' + task.build);
                }
            });
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
};