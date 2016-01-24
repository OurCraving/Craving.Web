var config = require('../config');

module.exports = function (grunt) {
    var build = {
        dist: {
            tasks: [
                'clean:dist',
                'swig:dist',
                'copy-build',
                'concurrent:build-dist-1',
                'autoprefixer:theme',
                'concurrent:build-dist-2'
            ]
        },
        modules_less: {
            tasks: [
                'clean:modules',
                'less:modules',
                'autoprefixer:modules',
                'cssmin:modules'
            ]
        },
        modules_js: {
            tasks: [
                'jshint:all',
                'concurrent:build-modules-js-1',
                'concurrent:build-modules-js-2'
            ]
        },
        skins: {
            tasks: [
                'clean:skins',
                'less:skins',
                'autoprefixer:skins',
                'cssmin:skins'
            ]
        },
        d: {
            tasks: [
                'setWatch',
                'build:dist'
            ]
        },
        dm: {
            tasks: [
                'clean:dist',
                'swig:dist',
                'copy-build',
                'concurrent:build-dm-1',
                'autoprefixer:theme',
                'concurrent:build-dist-2',
                'concurrent:build-dm'
            ]
        },
        dms: {
            tasks: [ 'concurrent:build-dms' ]
        },
        choose: {
            tasks: [
                'build:d',
                'rename'
            ]
        }
    };

    if (! config.minify) {
        var exclude = [ 'cssmin', 'uglify' ];
        for (var b in build) {
            for (var i = 0; i < build[ b ].tasks.length; i++) {
                exclude.forEach(function (e) {
                    if (build[ b ].tasks[ i ].indexOf(e) !== -1) {
                        build[ b ].tasks.splice(i, 1);
                        i--;
                    }
                });
            }
        }
    }

    grunt.config('build', build);

    grunt.registerMultiTask('build', function () {
        var async = this.async();
        grunt.task.run(this.data.tasks);
        async();
    });
};