var notify = require("gulp-notify");
var path = require('path');

module.exports = function (title, message) {

    // Send complete to notification center with gulp-notify
    return notify({
        title: title || "Compile Complete",
        message: message || "<%= file.relative %>",
        icon: path.join(__dirname, '/../assets/pass.png')
    });

};