(function () {
    'use strict';

    var app = angular.module('app');
    app.factory('logger', logger);

    logger.$inject = ['$mdToast'];

    function logger($mdToast) {
        var service = {
            showToasts: true,

            error: error,
            info: info,
            success: success,
            warning: warning,
        };

        return service;
        /////////////////////

        // TODO: mdToast supports custom template

        function error(message, data, title) {
            $mdToast.simple().content(message);
        }

        function info(message, data, title) {
            $mdToast.simple().content(message);
        }

        function success(message, data, title) {
            $mdToast.simple().content(message);
        }

        function warning(message, data, title) {
            $mdToast.simple().content(message);
        }
    }
})();