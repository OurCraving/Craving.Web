var grunt = require('grunt');
var path = require('path');
var os = require('os');
var extend = require('extend');

Array.prototype.inArray = function (obj, wildcard) {

    if (typeof obj == 'object') {
        var a = obj.length;
        while (a --) {
            if (this.inArray(obj[ a ])) return true;
        }
        return false;
    }

    var i = this.length;
    while (i --) {
        if (this[ i ] === obj) {
            return true;
        }
        if (typeof wildcard !== 'undefined' && wildcard === true) {
            if (this[ i ].indexOf(obj) !== - 1) {
                return true;
            }
        }
    }
    return false;
};

/** @return: String */
String.prototype.ReplaceSpecialPaths = function (config) {
    return this
        .replace('$THEME_DIR', path.join(config.dist, config.theme))
        .replace('$DIST_DIR', config.dist)
        .replace('$ROOT_DIR', '')
        .replace(/^(\/)/, "");
};

module.exports = function (grunt) {

    var config = {
        concat: [],
        rename: [],
        browserify: [],
        copy: [],
        swig: {}
    };

    var theme = grunt.option('theme');
    var dist = grunt.option('dist') || 'dist/themes';
    var minify = grunt.option('minify') === true;
    var bundle = grunt.option('bundle') !== false;

    global.debug = grunt.option('debug') === true;
    global.bundle = bundle;

    config.cpu = Math.max((os.cpus().length || 1), 2);

    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
        ' * <%= pkg.description %> <%= pkg.version %>\n' +
        ' * Author: <%= pkg.author%>\n' +
        ' * Licence: <%= pkg.license.url %>\n' +
        ' * Copyright <%= grunt.template.today("yyyy") %>\n' +
        ' */\n'
    });

    var expandConfigFile = function (value) {
        var file = value.split('/').pop(),
            configKey = file.split('.').shift(),
            configValue = grunt.file.readJSON(path.join(process.cwd(), value));

        if (Array.isArray(config[ configKey ])) {
            if (Array.isArray(configValue)) {
                configValue.forEach(function (configValueItem) {
                    config[ configKey ].push(configValueItem);
                });
            }
            else {
                config[ configKey ].push(configValue);
            }
        }

        if (typeof config[ configKey ] == 'undefined') {
            config[ configKey ] = configValue;
        }
    };

    var expandConfigDirectory = function (value) {
        grunt.file.expand({
            cwd: process.cwd(),
            filter: 'isFile'
        }, value + '/*.json').forEach(expandConfigFile);
    };

    grunt.file.expand({
        cwd: process.cwd(),
        filter: 'isDirectory'
    }, '.build/*').forEach(expandConfigDirectory);

    grunt.file.expand({
        cwd: process.cwd(),
        filter: 'isFile'
    }, '.build/*.json').forEach(expandConfigFile);

    try {
        config.skins = grunt.file.readJSON(path.join(process.cwd(), 'src', 'skins.json'));
    } catch (err) {
    }

    if (! theme && ! grunt.cli.tasks.inArray('parallel', true) && ! grunt.cli.tasks.inArray(Object.keys(config.parallel))) {
        grunt.fail.fatal('You must specify a theme by using the --theme [theme_name] option.');
    }

    if (typeof config.dist !== 'undefined' && typeof config.dist[ theme ] !== 'undefined') {
        dist = config.dist[ theme ];
    }

    grunt.registerTask('setCPU', function (limit) {
        var async = this.async();
        grunt.task.run([ 'setParallelCPU:' + limit, 'setConcurrentCPU:' + limit ]);
        async();
    });

    config.theme = theme;
    config.dist = dist;
    config.minify = minify;

    var lessOptions = {
        less: {
            paths: [
                path.join(process.cwd(), 'bower_components'),
                path.join(process.cwd(), 'lib')
            ]
        }
    };

    extend(true, config, lessOptions);

    var browserifyOptions = {
        browserifyOptions: {
            paths: [
                path.join(process.cwd(), 'lib'),
                path.join(process.cwd(), config.dist, config.theme, 'js')
            ]
        }
    };

    extend(true, config, browserifyOptions);

    return config;

}(grunt);