var gulp = require('gulp');
var config = require('../config');
var extend = require('extend');
var path = require('path');
var handleErrors = require('../util/handleErrors');
var complete = require('../util/handleComplete');
var swig = require('swig');
var es = require('event-stream');
var fs = require('fs');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var highlight = require('swig-highlight');
var gulpIf = require('gulp-if');
var wutil = require('../util/watch');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var browserSync = require('browser-sync');

var opts = {
    defaults: {
        autoescape: true,
        loader: swig.loaders.fs(process.cwd()),
        cache: false,
        varControls: config.swig.varControls || [ "[[", "]]" ],
        locals: {
            now: function () {
                return new Date();
            },
            random: function (min, max) {
                return Math.floor(Math.random() * max) + min;
            }
        }
    }
};

var setupSwig = function () {
    highlight.apply(swig);
    swig.setDefaults(opts.defaults);

    swig.setFilter('contains', function (input, contains) {
        return input.indexOf(contains) > - 1;
    });
    swig.setFilter('typeof', function (input, type) {
        if (typeof type == 'undefined') return typeof input;
        return typeof input == type;
    });
    swig.setFilter('inArray', function (array, obj) {
        if (typeof array !== 'object') return false;
        return array.inArray(obj);
    });
    swig.setFilter('array_key_exists', function (array, key) {
        return key in array;
    });
};

var pipeSwig = function (file, callback) {
    var data = {};

    try {
        var globalSwig = path.join(process.cwd(), 'src', 'swig.json');
        extend(true, data, JSON.parse(fs.readFileSync(globalSwig)));
    } catch (err) {
    }

    try {
        var themeSwig = path.join(process.cwd(), 'src', 'html', 'themes', config.theme, 'swig.json');
        extend(true, data, JSON.parse(fs.readFileSync(themeSwig)));
    } catch (err) {
    }

    var filePath = String(file.path),
        destPath = filePath.replace('src/html/themes', ''),
        outputFile = path.basename(filePath),
        slug = path.basename(filePath, path.extname(filePath)),
        tplVars = {
            config: config,
            page: {
                path: destPath,
                basename: outputFile,
                slug: slug
            },
            bundle: global.bundle
        };

    extend(true, data, tplVars);

    try {
        var tpl = swig.compile(String(file.contents), {filename: file.path});
        var compiled = tpl(data);

        file.contents = new Buffer(compiled);
        callback(null, file);
    } catch (err) {
        callback(new PluginError('swig', err));
        callback();
    }

};

var esPipeSwig = function () {
    return es.map(pipeSwig);
};

var gulpSwig = function (src) {
    return gulp.src(src)
        .on('error', handleErrors)
        .pipe(esPipeSwig().on('error', handleErrors))
        .pipe(gulp.dest(path.join(config.dist, config.theme)))
        .pipe(gulpIf(global.isWatching, complete()))
        .pipe(gulpIf(global.isWatching, browserSync.reload({stream: true})));
};

setupSwig();

gulp.task('swig:dist', function () {
    return gulpSwig([ 'src/html/themes/' + config.theme + '/**/*.html', '!**/_*.html' ]);
});

gulp.task('swig', [ 'swig:dist' ]);

gulp.task('swig:watch', function () {
    watch([ 'src/html/themes/' + config.theme + '/**/*.html', 'lib/**/*.html' ], {verbose: true, read: false}, function () {
        gulpSwig([ 'src/html/themes/' + config.theme + '/**/*.html', '!**/_*.html' ]);
    });
});