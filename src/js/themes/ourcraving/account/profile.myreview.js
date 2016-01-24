(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileMyReviewController', profileMyReviewController);

    profileMyReviewController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileMyReviewController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Recent Reviews";
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
                    dinerService.getRecentReviews(dinerService.profile.id, true).then(
                        function (response) {
                            vm.data = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve my reviews due to:");
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