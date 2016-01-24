(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileDislikeCravingController', profileDislikeCravingController);

    profileDislikeCravingController.$inject = ['AuthService', 'DinerService', 'ModalService'];
    function profileDislikeCravingController(authService, dinerService, modalService) {
        var vm = this;

        // properties
        vm.title = "Dislike Craving List";
        vm.data = [];
        vm.savedSuccessfully = false;
        vm.message = "";
        vm.selected = [];

        // methods
        vm.submit = submitHandler;
        vm.toggleSidenav = toggleSidenav;

        init();

        // event handlers
        function init() {
            if (authService.authentication.isAuth) {
                dinerService.getMyProfile().then(function() {
                    dinerService.getDislike(dinerService.profile.id).then(
                        function (response) {
                            vm.selected = response.data.Items;
                        },
                        function (err) {
                            window.helper.handleError(err, vm, "Failed to retrieve the disliking cravings due to:");
                        }
                        );
                });
            }
        }

        function submitHandler() {
            authService.fillAuthData();
            if (authService.authentication.isAuth) {
                if (vm.selected !== null && vm.selected.length > 0) {

                    dinerService.getMyProfile().then(function () {
                        var cravingIds = vm.selected.map(function(element) { return element.CravingId; });
                        dinerService.updateDislike(dinerService.profile.id, cravingIds).then(
                            function () {
                                vm.isBusy = false;
                                vm.savedSuccessfully = true;
                                vm.message = "Your disliked cravings have been saved.";
                            },
                            function (err) {
                                window.helper.handleError(err, vm, "Failed to update the disliking cravings due to:");
                            });
                    });
                }
            } else {
                vm.message = "Oops, you are not authenticated..."; // TODO: this shouldn't happen, but if the user opens it from history, we need t auto re-authenticate
            }
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }
    }

}());