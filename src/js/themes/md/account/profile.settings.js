(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileSettingsController', profileSettingsController);

    profileSettingsController.$inject = ['AuthService', 'RecentDishService', 'ModalService'];
    function profileSettingsController(authService, recentDishService, modalService) {
        var vm = this;

        // properties
        vm.title = "Recent Viewed Dishes";
        vm.savedSuccessfully = false;
        vm.message = "";
        vm.recentDishTotal = 0;

        // methods
        vm.toggleSidenav = toggleSidenav;
        vm.formateDate = formateDate;
        vm.clearupRecentDishes = clearupRecentDishes;

        init();

        // event handlers
        function init() {
            recentDishService.loadRecent();
            vm.recentDishTotal = recentDishService.dishes.length;
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }

        function clearupRecentDishes() {
            recentDishService.flush();
            vm.recentDishTotal = recentDishService.dishes.length;
        }
    }

}());