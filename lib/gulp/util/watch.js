var path = require('path');

module.exports = {
    isChanged: function (file) {
        return file.event === 'change';
    },

    mapCwd: function (paths, cwd) {
        var test = new RegExp('^(?![a-zA-Z0-9*]).');
        return paths.map(function (value) {

            var match = value.match(test);

            if (match) {
                value = value.replace(test, '');
            }

            return (match ? match[ 0 ] : '') + path.join(cwd, value);
        });
    }
};