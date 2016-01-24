var config = require('../config');
var path = require('path');

module.exports = function (grunt) {

    if (! config.theme) return;

    var cssPath = path.join(config.dist, config.theme, 'css');

    grunt.config([ 'cssmin', 'vendor' ], {
        expand: true,
        cwd: path.join(cssPath, 'vendor'),
        src: [ 'vendor.css' ],
        dest: path.join(cssPath, 'vendor'),
        ext: '.min.css'
    });

    grunt.config([ 'cssmin', 'theme' ], {
        expand: true,
        cwd: path.join(cssPath, 'app'),
        src: [ 'app.css', 'main.css', '!*.min.css' ],
        dest: path.join(cssPath, 'app'),
        ext: '.min.css'
    });

    grunt.config([ 'cssmin', 'modules' ], {
        expand: true,
        cwd: path.join(cssPath, 'app'),
        src: [ '*.css', '!*.min.css', '!app.css', '!main.css' ],
        dest: path.join(cssPath, 'app'),
        ext: '.min.css'
    });

    grunt.config([ 'cssmin', 'skins' ], {
        expand: true,
        cwd: cssPath,
        src: [ 'skin-*.css', '!*.min.css' ],
        dest: cssPath,
        ext: '.min.css'
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
};