(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecentDishController', recentDishController);

    recentDishController.$inject = ['RecentDishService', 'NavigationService', '$rootScope'];

    function recentDishController(recentService,navigationService, $rootScope) {
        var vm = this;
        vm.message = "";
        vm.dishes = [];

        // events
        vm.openDish = openDish;
        vm.isCurrent = isCurrent;
        vm.isOpen = false;

        // initialize
        activate();

        // helpers
        function activate() {
            loadRecent();

            recentService.onRefresh = function() {
                loadRecent();
            };
        }

        function isCurrent(dish) {
            var retval = $rootScope.$state.is('detail.dish', { 'id': dish.DishId }) || 
                $rootScope.$state.is('dish.detail', { 'id': dish.DishId }); // sigh... I used a different route in the MD theme
            return retval;
        }

        function openDish(dish) {
            navigationService.go('detail.dish', { 'id': dish.DishId });
        }

        function loadRecent() {
            recentService.loadRecent();
            vm.dishes = recentService.dishes;
        }
    }

})();
