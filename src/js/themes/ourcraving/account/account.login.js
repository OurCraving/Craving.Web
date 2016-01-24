(function () {

    var app = angular.module('app');

    app
        .controller('AccountLoginController', accountLoginController);
    accountLoginController.$inject = ['AuthService', 'logger', '$timeout', 'ResumeService', 'NavigationService', '$rootScope'];
    function accountLoginController(authService, logger, $timeout, resumeService, navigationService, $rootScope) {
        var vm = this;
        vm.loginData = {
            email: "",
            password: "",
            useRefreshTokens: true // always use refreshtoken unless we want to change it later
        };
        vm.forgetData = {
            email: ""
        };

        vm.showLoginForm = true;
        vm.savedSuccessfully = false;
        vm.message = "";
        vm.overlayTitle = "Sign In";
        vm.coverClass = "bg-signin";

        // events
        vm.submit = submitHandler;
        vm.viewSwitch = viewSwitchHandler;

        activate();

        function submitHandler() {
            vm.savedSuccessfully = false;
            vm.message = "";
            if (vm.showLoginForm) {
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
                logger.success('Reset password is requested successfully. Check your mail box please.');
                refreshing($timeout);

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

        function viewSwitchHandler(showLogin) {
            if (vm.showLoginForm !== showLogin) {
                vm.showLoginForm = showLogin;
                vm.message = "";
            }
        }

        function activate() {
            if (resumeService && resumeService.hasMessage) {
                vm.message = resumeService.message;
            } 
        }
    }

})();
