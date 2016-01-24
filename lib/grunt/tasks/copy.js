var config = require('../config');
var path = require('path');

module.exports = function (grunt) {

    if (! config.theme) return;

    var distThemePath = path.join(config.dist, config.theme);

    grunt.config('copy', {
        images_common: {
            expand: true,
            cwd: 'src/images/common/',
            src: '**/*',
            dest: path.join(distThemePath, 'images')
        },
        images_theme: {
            expand: true,
            cwd: path.join('src', 'images', 'themes', config.theme),
            src: '**/*',
            dest: path.join(distThemePath, 'images')
        }
    });

    grunt.registerTask('copy-build', function () {
        var async = this.async();
        var tasks = [ 'copy:images_common', 'copy:images_theme' ];

        if (config.copy.length) {
            config.copy.forEach(function (task) {
                if (typeof task.themes == 'undefined' || task.themes.indexOf(config.theme) !== - 1) {
                    grunt.config([ 'copy', task.task ], {
                        expand: true,
                        cwd: task.cwd.ReplaceSpecialPaths(config),
                        src: task.src,
                        dest: path.join(config.dist, config.theme, task.dest),
                        flatten: typeof task.flatten !== 'undefined' ? task.flatten : false
                    });
                    tasks.push('copy:' + task.task);
                }
            });
        }

        tasks.forEach(function (task) {
            grunt.task.run(task);
        });
        async();
    });

    grunt.registerTask('copy-theme', function () {
        var async = this.async();
        var to = grunt.option('to');
        var force = grunt.option('force');
        var tasks = [];
        var src = [ 'html', 'js', 'less', 'images' ];
        var paths = [];

        if (! to) {
            grunt.fail.fatal('--to "new-theme-name" option undefined');
        }

        src.forEach(function(key){
            var obj = {
                task: key,
                cwd: path.join('src', key, 'themes', config.theme),
                dest: path.join('src', key, 'themes', to)
            };
            paths.push(obj);
        });

        paths.forEach(function (path) {
            if (grunt.file.exists(path.dest) && ! force) {
                grunt.fail.fatal(path.dest + ' already exists. use --force to overwrite');
            }
            var task = 'copy-theme-' + path.task;
            grunt.config([ 'copy', task ], {
                expand: true,
                cwd: path.cwd,
                src: '**',
                dest: path.dest
            });
            tasks.push(task);
        });

        tasks.forEach(function (task) {
            grunt.task.run(task);
        });
        async();
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};