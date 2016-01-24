(function () {
    'use strict';

    angular
        .module('app')
        .controller('NavbarLocationController', locationController);

    locationController.$inject = ['GeoService','$rootScope'];

    // this controller will be assigned to everything inside shell.html, unless a part has a specific controller 
    // this will be the first controller loaded in the whole system, so we can do some initialization here 
    function locationController(geoService, $rootScope) {
        var vm = this;
        vm.position = $rootScope.position;

        activate();

        function activate() {
            if (vm.position == undefined) {
                vm.position = window.helper.getDefaultLocation();
            }

            $rootScope.$on(geoService.GEO_UPDATE, function(event, data) {
                vm.position = data;
            });

        }
    }
})();
