var config = require('../config');

module.exports = function (grunt) {

    if (! config.theme) return;

    var watch = {
        less_theme: {
            files: [ 'src/less/themes/' + config.theme + '/**/*.less', 'src/less/common/**/*.less', 'src/less/vendor/**/*.less', 'lib/**/*.less', '!module-*.less' ],
            tasks: [ 'less:theme', 'autoprefixer:theme', 'cssmin:theme', 'browserSyncReload' ]
        },
        less_modules: {
            files: [ 'src/less/themes/' + config.theme + '/**/*.less', 'src/less/common/**/*.less', 'src/less/vendor/**/*.less', 'lib/**/*.less' ],
            tasks: [ 'less:modules', 'autoprefixer:modules', 'cssmin:modules', 'browserSyncReload' ]
        },
        less_skins: {
            files: 'src/less/skins/' + config.theme + '/**/*.less',
            tasks: [ 'less:skins', 'autoprefixer:skins', 'cssmin:skins', 'browserSyncReload' ]
        },
        js: {
            files: [ 'src/js/**/*', 'lib/**/*.js' ],
            tasks: [ 'jshint', 'browserify', 'uglify:main' ]
        },
        app: {
            files: [ 'src/html/**/*.html', 'lib/**/*.html' ],
            tasks: [ 'clean:html', 'swig:dist', 'browserSyncReload', 'rename' ],
            options: {
                spawn: false
            }
        }
    };

    if (! config.minify) {
        var exclude = [ 'cssmin', 'uglify' ];
        for (var b in watch) {
            for (var i = 0; i < watch[ b ].tasks.length; i ++) {
                exclude.forEach(function (e) {
                    if (typeof watch[ b ].tasks[ i ] !== 'string') {
                        return;
                    }
                    if (watch[ b ].tasks[ i ].indexOf(e) !== - 1) {
                        watch[ b ].tasks.splice(i, 1);
                        i --;
                    }
                });
            }
        }
    }

    grunt.config('watch', watch);

    grunt.registerTask('setWatch', function () {
        global.isWatching = true;
    });

    grunt.registerTask('watch-less', [ 'setWatch', 'browserSyncInit:dist', 'switchwatch:less_theme:js:app' ]);

    // Run with: grunt switchwatch:target1:target2 to only watch those targets
    grunt.registerTask('switchwatch', function () {
        var targets = Array.prototype.slice.call(arguments, 0);
        Object.keys(grunt.config('watch')).filter(function (target) {
            return ! (grunt.util._.indexOf(targets, target) !== - 1);
        }).forEach(function (target) {
            grunt.log.writeln('Ignoring ' + target + '...');
            grunt.config([ 'watch', target ], {files: []});
        });
        grunt.task.run('watch');
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};