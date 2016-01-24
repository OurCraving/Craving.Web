(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileUpdatePasswordController', profileUpdatePasswordController);

    profileUpdatePasswordController.$inject = ['AuthService', 'ModalService', '$location', '$timeout', '$scope'];
    function profileUpdatePasswordController(authService, modalService, $location, $timeout, $scope) {
        var vm = this;

        // properties
        vm.title = "Udpate Password";
        vm.data = {
            currentPassword: "",
            newPassword: "",
            newConfirmPassword: ""
        };
        vm.savedSuccessfully = false;
        vm.message = "";

        // methods
        vm.submit = updatePasswordHandler;
        vm.updatePassword = updatePasswordHandler;
        vm.toggleSidenav = toggleSidenav;

        // event handlers 
        function updatePasswordHandler() {

            authService.fillAuthData();

            if (authService.authentication.isAuth === false || authService.authentication.email === "") {
                vm.message = "You appear to have not been authenticated yet, you may need to log out first and try again";
                return;
            }

            if (vm.data.currentPassword === "") {
                vm.message = "Current Password cannot be empty";
                return;
            }

            if (vm.data.newPassword === "" || vm.data.newConfirmPassword === "") {
                vm.message = "New Password cannot be empty";
                return;
            }

            if (vm.data.newConfirmPassword !== vm.data.newPassword) {
                vm.message = "New password does not match the new confirm password";
                return;
            }

            var changeData = {
                Email: authService.authentication.email,
                CurrentPassword: vm.data.currentPassword,
                NewPassword: vm.data.newPassword,
                NewConfirmPassword: vm.data.newConfirmPassword
            };

            authService.changepassword(changeData).then(function (response) {
                vm.message = "Your password has been changed successfully. Logging you out now because you need to log in with your new password again.";
                vm.savedSuccessfully = true;
                startTimer();
            }, function (response) {
                window.helper.handleError(response, vm, "Failed to update password due to:");
            });

        }

        function startTimer() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                authService.logOut();
                $location.path('/');
            }, 3000);
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }
    }

}());