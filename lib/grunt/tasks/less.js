var config = require('../config');
var path = require('path');

module.exports = function (grunt) {

    if (! config.theme) return;

    grunt.config('less', {options: config.less});

    var destPath = path.join(config.dist, config.theme, 'css'),
        cwdThemesPath = path.join('src', 'less', 'themes', config.theme);

    grunt.config([ 'less', 'theme' ], {
        expand: true,
        cwd: cwdThemesPath,
        src: [ '*.less', '!_*.less' ],
        dest: destPath,
        ext: '.css'
    });
    grunt.config([ 'less', 'modules' ], {
        expand: true,
        cwd: cwdThemesPath,
        src: [ 'app/*.less', '!app/_*.less' ],
        dest: destPath,
        ext: '.css'
    });
    grunt.config([ 'less', 'vendor' ], {
        expand: true,
        cwd: cwdThemesPath,
        src: [ 'vendor/*.less', '!vendor/_*.less' ],
        dest: destPath,
        ext: '.css'
    });
    grunt.config([ 'less', 'skins' ], {
        expand: true,
        cwd: path.join('src', 'less', 'skins', config.theme),
        src: '*.less',
        dest: destPath,
        ext: '.css'
    });

    grunt.loadNpmTasks('grunt-contrib-less');
};