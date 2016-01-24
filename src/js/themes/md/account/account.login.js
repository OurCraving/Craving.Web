(function () {

    var app = angular.module('app');

    app
        .controller('AccountLoginController', accountLoginController);
    accountLoginController.$inject = ['AuthService', 'logger', '$timeout', 'ResumeService', 'NavigationService', 'ModalService', '$rootScope'];
    function accountLoginController(authService, logger, $timeout, resumeService, navigationService, modalService, $rootScope) {
        var vm = this;
        vm.loginData = {
            email: "",
            password: "",
            useRefreshTokens: true // always use refreshtoken unless we want to change it later
        };

        vm.forgetData = {
            email: ""
        };

        vm.title = "Login";

        vm.selectedIndex = "0";
        vm.savedSuccessfully = false;
        vm.message = "";

        // events
        vm.submit = submitHandler;
        vm.close = close;
        vm.loginWithFacebook = loginWithFacebook;
        vm.externalAuthCompleted = externalAuthCompleted;

        activate();

        function close() {
            modalService.closeModal();
        }

        function submitHandler() {
            vm.savedSuccessfully = false;
            vm.message = "";
            if (vm.selectedIndex === "0") {
                loginHandler();
            } else {
                findPasswordHanlder();
            }
        }

        function findPasswordHanlder() {
            if (vm.forgetData.email === "") {
                vm.message = "Please enter the email address of your account to reset password";
                return;
            }

            if (window.helper.isEmail(vm.forgetData.email) === false) {
                vm.message = "Your email address format is not correct";
                return;
            }

            authService.forgetpassword(vm.forgetData.email).then(function () {
                vm.isBusy = false;
                vm.message = "Password reset request is sent!";
                vm.savedSuccessfully = true;
                vm.submitted = true;
                logger.success('Reset password is requested successfully. Check your mail box. You should receive an email to reset your password in 30 minutes. ');

            }, function (response) {
                if (response.status === 404) {
                    vm.message = vm.forgetData.email + " is not registered";
                } else {
                    window.helper.handleError(response, vm, "Failed to request password reset due to:");
                }

                vm.isBusy = false;
            });

            vm.isBusy = true;
        }

        function loginHandler() {
            if (vm.loginData.email === "" || vm.loginData.password === "") {
                vm.message = "Please enter both of your email address and password";
                return;
            }

            if (window.helper.isEmail(vm.loginData.email) === false) {
                vm.message = "Your email address format is not correct";
                return;
            }

            authService.login(vm.loginData).then(
                function () {
                    vm.isBusy = false;
                    vm.submitted = true;
                    vm.message = "Login successfully.";
                    vm.savedSuccessfully = true;
                    logger.success('Login Successfully!');

                    if (resumeService.needResume()) {
                        resumeService.resume();
                    } else {
                        if ($rootScope.$state.is('login')) {
                            navigationService.go('profile.home');
                        } else {
                            window.helper.refreshing($timeout);
                        }
                    }
                },
                function (err) {
                    vm.isBusy = false;
                    window.helper.handleError(err, vm, "Login failed due to:");
                });

            vm.isBusy = true;
        }

        function loginWithFacebook() {
            authService.externalLogin("Facebook", vm);
        }

        function activate() {
            if (resumeService && resumeService.hasMessage && $rootScope.$state.is('login')) {
                vm.message = resumeService.message;
            }

            if ($rootScope.$stateParams.selected) {
                vm.selectedIndex = $rootScope.$stateParams.selected;
            }
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
