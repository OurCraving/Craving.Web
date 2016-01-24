var config = require('../config');

module.exports = function (grunt) {

    var concurrent = {
        options: {
            logConcurrentOutput: true,
            limit: config.cpu
        },
        "build-dist-1": [
            'prettify:theme',
            'less:theme',
            'less:vendor',
            'jshint:all',
            'browserify',
            'concat'
        ],
        "build-dist-2": [
            'cssmin:vendor',
            'cssmin:theme',
            'uglify:theme',
            'uglify:main'
        ],
        "build-dm-1": [
            'prettify:theme',
            'less:theme',
            'less:vendor',
            'jshint:all',
            'concat'
        ],
        "build-dm": [
            'build:modules_less',
            'build:modules_js'
        ],
        "build-dms": [
            'build:dm',
            'build:skins'
        ],
        "build-modules-js-1": [
            'browserify-modules',
            'concat-modules'
        ],
        "build-modules-js-2": [
            'uglify:modules',
            'uglify:theme'
        ]
    };

    grunt.registerTask('setConcurrentCPU', function (limit) {
        concurrent.options.limit = limit;
        grunt.config('concurrent', concurrent);
    });

    if (! config.minify) {
        var exclude = [ 'cssmin', 'uglify' ];
        for (var key in concurrent) {

            if (Object.prototype.toString.call(concurrent[ key ]) !== '[object Array]') {
                continue;
            }

            for (var i = 0; i < concurrent[ key ].length; i ++) {
                exclude.forEach(function (e) {
                    if (i < 0) return false;
                    if (concurrent[ key ][ i ].indexOf(e) !== - 1) {
                        concurrent[ key ].splice(i, 1);
                        i --;
                    }
                });
            }
        }
    }

    grunt.config('concurrent', concurrent);

    grunt.loadNpmTasks('grunt-concurrent');

};