(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminCacheController', adminCacheController);

    adminCacheController.$inject = ['AuthService', '$cacheFactory', 'ReferenceDataService'];
    function adminCacheController(authService, $cacheFactory, refDataService) {

        authService.fillAuthData();

        var vm = this;
        vm.data = $cacheFactory.get('$http');
        vm.message = '';
        vm.savedSuccessfully = false;
        vm.hasCache = vm.data.info().size > 0;
        vm.refDataKeys = [];

        // methods
        vm.removeAll = removeAll;
        vm.flushRefData = flushRefData;

        // init
        activate();

        // event handlers 
        function flushRefData(key) {
            refDataService.flush(key);
            loadRefDataKeys();
        }

        function removeAll() {
            vm.savedSuccessfully = false;
            vm.message = '';

            if (vm.data) {
                vm.data.removeAll();
                vm.data = $cacheFactory.get('$http');
                vm.hasCache = vm.data.info().size > 0;
                vm.savedSuccessfully = true;
                vm.message = 'All Caches are cleaned up';
            }
        }

        // helpers
        function activate() {
            loadRefDataKeys();
        }

        function loadRefDataKeys() {
            vm.refDataKeys = refDataService.getKeys();
        }
    }
}());