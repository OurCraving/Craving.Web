var config = require('../config');
var path = require('path');

module.exports = function (grunt) {

    grunt.config('clean', {
        options: {
            force: true
        },
        html: {
            src: [ config.dist + '/' + config.theme + '/**/*.html' ]
        },
        dist: {
            src: [ config.dist + '/' + config.theme + '/**/*' ]
        },
        modules: {
            src: [ config.dist + '/' + config.theme + '/css/app/*.css', config.dist + '/' + config.theme + '/js/app/*.js', '!*/app/app.css', '!*/app/main.css', '!*/app/app.js', '!*/app/main.js' ]
        },
        skins: {
            src: [ config.dist + '/' + config.theme + '/css/skin-*.css' ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
};