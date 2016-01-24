(function () {
    'use strict';

    angular
        .module('app')
        .controller('SingleRandomRestaurantController', singleRandomRestaurantController);

    singleRandomRestaurantController.$inject = ['RestaurantService', '$rootScope'];

    function singleRandomRestaurantController(restService, $rootScope) {
        /* jshint validthis:true */
        var vm = this;
        
        // properties 
        vm.restaurant = undefined;

        // events
        
        activate();

        function activate() {
            vm.position = $rootScope.position;
            get(1);
        }

        function get(total) {
            restService.getRandomRestaurant(vm.position, total).success(function(data) {
                if (data.Items && data.Items.length > 0) {
                    vm.restaurant = data.Items[0];
                }
            }).error(function() {
                vm.restaurant = undefined;
            });
        }
    }
})();
