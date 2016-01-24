(function () {
    'use strict';

    angular
        .module('app')
        .service('NavigationService', navigationService);

    navigationService.$inject = ['$rootScope'];

    function navigationService($rootScope) {

        var service = {
            // properties 
            params: getParams,
            go: goHandler,
        };

        return service;

        function getParams() {
            return $rootScope.$stateParams;
        }

        function goHandler(stateName, toParams, options) {
            $rootScope.$state.go(stateName, toParams, options);
        }
    }
})();