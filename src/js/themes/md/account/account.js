(function () {

    // var accountApp = angular.module('cc.app.account', ['oc.services']);
    var app = angular.module('app');

    app.controller('AccountController', accountController);

    accountController.$inject = ['AuthService', 'DinerService', '$location', '$sce', '$timeout'];
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

})();
