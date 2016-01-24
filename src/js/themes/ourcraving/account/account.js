(function () {

    // var accountApp = angular.module('cc.app.account', ['oc.services']);
    var app = angular.module('app');

    app 
        .controller('AccountController', accountController)
        .controller('ResetPasswordController', resetController)
        .controller('ActivateController', activateController)
        .controller('UnauthorizedController', unauthorizedController);

    accountController.$inject = ['AuthService', 'DinerService', '$location', '$sce','$timeout'];
    function accountController(authService, dinerService, $location, $sce, $timeout) {
        var vm = this;

        // properties
        vm.claims = "";
        vm.authentication = authService.authentication;
        vm.showLogin = true;
        vm.showSignup = true;

        // events
        vm.logout = logOutHandler;

        // this is the test method
        vm.loadClaims = loadClaimsHandler;

        activate();

        // event handlers
        function logOutHandler() {
            authService.logOut();
            dinerService.flush();
            window.helper.refreshing($timeout, 0);
        }

        function loadClaimsHandler() {
            authService.loadClaims().then(function (response) {
                if (response && response.data) {
                    vm.claims = "";
                    for (var idx in response.data) {
                        var claim = response.data[idx];
                        vm.claims = vm.claims + claim.Type + ": " + claim.Value + "<br />";
                    }

                    vm.claims = $sce.trustAsHtml(vm.claims);
                }
            });
        }

        function activate() {
            authService.fillAuthData();
            vm.showLogin = authService.authentication.isAuth === false;
            vm.showSignup = authService.authentication.isAuth === false;
            vm.showUser = authService.authentication.isAuth === true;
        }
    }

    activateController.$inject = ['$location', '$timeout', 'AuthService', '$stateParams', "$sce", '$scope'];
    function activateController($location, $timeout, authService, $stateParams, $sce, $scope) {

        // this is for this particular template to add a style to the body
        $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';

        var vm = this;
        vm.activate = activateHandler;
        vm.message = "";
        vm.title = "Account Activation";
        vm.description = "";
        vm.savedSuccessfully = false;
        vm.userId = $stateParams.id;
        vm.code = $stateParams.code;

        // initialize
        vm.activate();

        function activateHandler() {

            if (vm.userId && vm.code) {
                authService.activate(vm.userId, vm.code).then(function(response) {
                    vm.message = $sce.trustAsHtml("User has been registered successfully. You can login now. ");
                    vm.savedSuccessfully = true;
                }, function(response) {
                    window.helper.handleError(response, vm, "Failed to activate user due to:");
                });
            } else {
                vm.message = "Cannot activate you.";  // TODO: do something funny here 
            }
        }
    }

    resetController.$inject = ['$location', '$timeout', 'AuthService', '$stateParams', '$scope'];
    function resetController($location, $timeout, authService, $stateParams, $scope) {

        $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';

        var vm = this;
        vm.title = "Reset Password";
        vm.resetPassword = resetHandler;
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.resetData = {
            email: "",
            password: "",
            confirmPassword: "",
            code: $stateParams.code
        };

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

            authService.resetpassword(vm.resetData).then(function (response) {
                vm.message = "Your password has been reset successfully. You can now login with your new password.";
                vm.savedSuccessfully = true;
                startTimer();
            }, function (response) {
                window.helper.handleError(response, vm, "Failed to reset password due to:");
            });
        }

        function startTimer() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/');
            }, 5000);
        }
    }

    unauthorizedController.$inject = ['$location', '$timeout'];
    function unauthorizedController($location, $timeout) {
        var vm = this;
        vm.title = "Authentication Denied";
        vm.message = "Ah, it looks like that you need to login again. Redirecting you to the home page now, please log in again.";

        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/');
        }, 5000);
    }
})();
