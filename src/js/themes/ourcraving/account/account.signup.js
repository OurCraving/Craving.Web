(function () {

    var app = angular.module('app');

    app.controller('AccountSignupController', accountSignupController);

    accountSignupController.$inject = ['AuthService', 'logger', '$timeout'];
    function accountSignupController(authService, logger, $timeout) {
        var vm = this;
        vm.message = "";
        vm.savedSuccessfully = false;
        vm.registration = {
            email: "",
            password: "",
            confirmPassword: ""
        };

        vm.submitRegistration = signupHandler;
        function signupHandler() {
            if (vm.registration.email === "") {
                vm.message = "Please enter the email address to register";
                return;
            }

            if (window.helper.isEmail(vm.registration.email) === false) {
                vm.message = "Your email address format is not correct";
                return;
            }

            if (vm.registration.password === "" || vm.registration.confirmPassword === "") {
                vm.message = "Please enter your password and confirm password to register";
                return;
            }

            if (vm.registration.password !== vm.registration.confirmPassword) {
                vm.message = "Password doesn't match the confirm password";
                return;
            }

            authService.saveRegistration(vm.registration).then(function () {
                vm.isBusy = false;
                vm.message = "User is registered successfully! Please check your email box to activate your account.";
                vm.savedSuccessfully = true;
                vm.submitted = true;
                logger.info('Thanks for signing up.');
                window.helper.refreshing($timeout, 5000);
            },
            function (response) {
                vm.isBusy = false;
                window.helper.handleError(response, vm, "Failed to register user due to:");
            });

            vm.isBusy = true;
        }
    }

})();
