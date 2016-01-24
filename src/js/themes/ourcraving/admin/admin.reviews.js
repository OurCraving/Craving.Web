(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminReviewController', adminReviewController);

    adminReviewController.$inject = ['AuthService', '$location', '$rootScope', '$scope'];
    function adminReviewController(authService, $location, $rootScope, $scope) {

        authService.fillAuthData();

        var vm = this;
        // properties

        // methods

        // init
        activate();

        // event handlers 

        // helpers
        function activate() {

        }
    }
}());