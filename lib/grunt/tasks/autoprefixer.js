var config = require('../config');
var path = require('path');

module.exports = function (grunt) {

    if (! config.theme) return;

    var cssPath = path.join(config.dist, config.theme, 'css');

    grunt.config('autoprefixer', {
        options: {
            browsers: [ 'last 4 versions' ],
            map: global.debug
        }
    });

    grunt.config([ 'autoprefixer', 'theme' ], {
        expand: true,
        cwd: cssPath,
        src: [ 'app/app.css', 'app/main.css', '!app/*.min.css' ],
        dest: cssPath
    });

    grunt.config([ 'autoprefixer', 'modules' ], {
        expand: true,
        cwd: cssPath,
        src: [ 'app/*.css', '!app/*.min.css', '!app/app.css', '!app/main.css' ],
        dest: cssPath
    });

    grunt.config([ 'autoprefixer', 'skins' ], {
        expand: true,
        cwd: cssPath,
        src: [ 'skin-*.css', '!skin-*.min.css' ],
        dest: cssPath
    });

    grunt.loadNpmTasks('grunt-autoprefixer');
};