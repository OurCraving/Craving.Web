(function () {

    // var accountApp = angular.module('cc.app.account', ['oc.services']);
    var app = angular.module('app');

    app.controller('ResetPasswordController', resetController);

    resetController.$inject = ['$location', '$timeout', 'AuthService', '$stateParams', '$scope'];
    function resetController($location, $timeout, authService, $stateParams, $scope) {

        $scope.updatePageTitle('Reset Password');

        var vm = this;
        vm.title = "Reset Password";
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.invalid = false;
        vm.resetData = {
            email: $stateParams.email,
            password: "",
            confirmPassword: "",
            code: $stateParams.code
        };

        vm.submit = resetHandler;

        activate();

        function activate() {
            if (!$stateParams.code || $stateParams.code === '') {
                vm.message = "Reset code is invalid, please copy the full URL from your email to your browser.";
                vm.invalid = true;
            } else {
                vm.invalid = false;
            }
        }

        function resetHandler() {
            if (vm.resetData.email === "") {
                vm.message = "Please enter your password";
                return;
            }

            if (vm.resetData.password === "" || vm.resetData.confirmPassword === "") {
                vm.message = "Password and confirm password cannot be empty";
                return;
            }

            if (vm.resetData.password !== vm.resetData.confirmPassword) {
                vm.message = "Password is not the same to confirm password";
                return;
            }

            if (vm.resetData.code === "" || vm.resetData.code === undefined) {
                vm.message = "Reset code is missing, can't update your password";
                return;
            }

            authService.resetpassword(vm.resetData).then(function (response) {
                vm.message = "Your password has been reset successfully. You can now login with your new password. Sending you to the login page.";
                vm.savedSuccessfully = true;
                startTimer();
            }, function (response) {
                window.helper.handleError(response, vm, "Failed to reset password due to:");
            });
        }

        function startTimer() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('login');
            }, 2000);
        }
    }
})();
