(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileCravingHistoryController', profileCravingHistoryController);

    profileCravingHistoryController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileCravingHistoryController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Craving History";
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
                    dinerService.getRecentCravings(dinerService.profile.id, true).then(
                        function (response) {
                            vm.data = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve recent cravings due to:");
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