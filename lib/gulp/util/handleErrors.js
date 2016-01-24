var notify = require("gulp-notify");
var path = require('path');
var gutil = require("gulp-util");

module.exports = function () {

    var args = Array.prototype.slice.call(arguments);

    if (global.isWatching) {

        // Send error to notification center with gulp-notify
        notify.onError({
            title: "Compile Error",
            message: "<%= error.message %>",
            icon: path.join(__dirname, '/../assets/fail.png')
        }).apply(this, args);

    }
    else {
        gutil.log(gutil.colors.red(args[ 0 ].message));
        process.exit(1);
    }

	process.stdout.write(gutil.colors.red(args[ 0 ].message));

    // Keep gulp from hanging on this task
    this.emit('end');
};