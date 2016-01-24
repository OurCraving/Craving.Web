(function () {
    "use strict";

    angular.module('app')
        .controller('MainController', ['$scope', '$rootScope', function ($scope, $rootScope) {

            $scope.app = {
                settings: {
                    pageTitle: 'OurCraving - where you find your cravings',
                    htmlClass: ''
                }
            };

        $scope.updatePageTitle = function(title) {
            $scope.app.settings.pageTitle = title;
        };

    }]);

})();
