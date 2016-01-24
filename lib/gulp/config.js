var gulp = require('gulp');
var path = require('path');
var os = require('os');
var fs = require('fs');
var expand = require('glob-expand');
var minimist = require('minimist');
var gutil = require('gulp-util');
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

var readJSON = function (path) {
    return JSON.parse(fs.readFileSync(path));
};

module.exports = function () {

    var config = {
        concat: [],
        rename: [],
        browserify: [],
        copy: [],
        swig: {}
    };

    var knownOptions = {
        string: [ 'theme', 'dist' ],
        boolean: [ 'minify', 'debug', 'bundle','release' ],
        default: {
            dist: 'dist/themes',
            theme: false,
            minify: false,
            debug: false,
            bundle: true,
			release: false
        }
    };

    var options = minimist(process.argv.slice(2), knownOptions);

    global.debug = options.debug;
    global.bundle = options.bundle;

    var expandConfigFile = function (value) {
        var file = value.split('/').pop(),
            configKey = file.split('.').shift(),
            configValue = readJSON(path.join(process.cwd(), value));

        if (Array.isArray(config[ configKey ])) {
            if (Array.isArray(configValue)) {
                configValue.forEach(function(configValueItem){
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
        expand({
            cwd: process.cwd(),
            filter: 'isFile'
        }, value + '/*.json').forEach(expandConfigFile);
    };

    expand({
        cwd: process.cwd(),
        filter: 'isDirectory'
    }, '.build/*').forEach(expandConfigDirectory);

    expand({
        cwd: process.cwd(),
        filter: 'isFile'
    }, '.build/*.json').forEach(expandConfigFile);

    try {
        config.skins = readJSON(path.join(process.cwd(), 'src', 'skins.json'));
    } catch (err) {
    }

    if (! options.theme) {
        gutil.log(gutil.colors.red('You must specify a theme by using the --theme [theme_name] option.'));
        process.exit(1);
    }

    if (typeof config.dist !== 'undefined' && typeof config.dist[ options.theme ] !== 'undefined') {
        options.dist = config.dist[ options.theme ];
    }

    extend(true, config, options);

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

    if (options.debug) {
        require('time-require');
    }

    return config;

}();