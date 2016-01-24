(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileMyDishController', profileMyDishController);

    profileMyDishController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileMyDishController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Recent Added Dishes";
        vm.data = [];
        vm.savedSuccessfully = false;
        vm.message = "";

        // methods
        vm.toggleSidenav = toggleSidenav;
        vm.formateDate = formateDate;
        init();

        // event handlers
        function init() {
            if (authService.authentication.isAuth) {
                dinerService.getMyProfile().then(function () {
                    dinerService.getRecentAddedDishes(dinerService.profile.id, true).then(
                        function (response) {
                            vm.data = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve my dishes due to:");
                        }
                        );
                });
            }
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }
    }

}());