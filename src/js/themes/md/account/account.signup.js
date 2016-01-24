(function () {

    var app = angular.module('app');

    app.controller('AccountSignupController', accountSignupController);

    accountSignupController.$inject = ['AuthService', 'logger', '$timeout', 'ModalService', 'NavigationService', '$scope'];

    function accountSignupController(authService, logger, $timeout, modalService, navigationService, $scope) {
        var vm = this;
        vm.title = "Sign up";
        vm.message = "";
        vm.savedSuccessfully = false;
        vm.registration = {
            email: "",
            password: "",
            confirmPassword: ""
        };

        vm.showForm = true;
        vm.submit = signupHandler;
        vm.close = close;
        vm.loginWithFacebook = loginWithFacebook;
        vm.externalAuthCompleted = externalAuthCompleted;

        function close() {
            modalService.closeModal();
        }

        function signupHandler() {
            if ($scope.singupForm.$valid !== true) return;

            // all the validations here are redundant after using ng-messages
            if (failGuard()) {
                return;
            }

            authService.saveRegistration(vm.registration).then(function () {
                vm.isBusy = false;
                vm.message = "User is registered successfully! Please check your email box to activate your account.";
                vm.savedSuccessfully = true;
                vm.submitted = true;
                logger.info('Thanks for signing up.');
                vm.showForm = false;
            },
            function (response) {
                vm.isBusy = false;
                window.helper.handleError(response, vm, "Failed to register user due to:");
            });

            vm.isBusy = true;
        }

        function failGuard() {
            if (vm.registration.email === "") {
                vm.message = "Please enter the email address to register";
                return true;
            }

            if (window.helper.isEmail(vm.registration.email) === false) {
                vm.message = "Your email address format is not correct";
                return true;
            }

            if (vm.registration.password === "" || vm.registration.confirmPassword === "") {
                vm.message = "Please enter your password and confirm password to register";
                return true;
            }

            if (vm.registration.password !== vm.registration.confirmPassword) {
                vm.message = "Password doesn't match the confirm password";
                return true;
            }

            return false;
        }

        function loginWithFacebook() {
            authService.externalLogin("Facebook", vm);
        }

        function externalAuthCompleted(fragment) {
            close();

            //If the user does not have a local account set up send them to the profile association page.
            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    username: fragment.external_user_name,
                    email: fragment.email,
                    externalAccessToken: fragment.external_access_token
                };

                navigationService.go('profile.associate');
            }
            else {
                //Obtain access token and redirect to profile home page.
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.getAccessToken(externalData).then(function (response) {
                    navigationService.go('profile.home');
                },
                function (err) {
                    vm.message = err.error_description;
                });
            }
        }
    }
})();
