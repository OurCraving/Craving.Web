(function () {

    // var accountApp = angular.module('cc.app.account', ['oc.services']);
    var app = angular.module('app');

    app.controller('ActivateController', activateController);

    activateController.$inject = ['$location', '$timeout', 'AuthService', '$stateParams', "$sce", '$scope'];
    function activateController($location, $timeout, authService, $stateParams, $sce, $scope) {

        $scope.updatePageTitle('Account Activation');
        var vm = this;
        vm.activate = activateHandler;
        vm.message = "";
        vm.title = "Account Activation";
        vm.savedSuccessfully = false;
        vm.userId = $stateParams.id;
        vm.code = $stateParams.code;

        // initialize
        vm.activate();

        function activateHandler() {
            if (vm.userId && vm.code) {
                vm.showFaulty = false;
                authService.activate(vm.userId, vm.code).then(function (response) {
                    vm.message = $sce.trustAsHtml("User has been registered successfully. You can login now...Sending you to the login page");
                    vm.savedSuccessfully = true;
                    startTimer();
                }, function (response) {
                    window.helper.handleError(response, vm, "Failed to activate user due to:");
                });
            } else {
                vm.message = "Cannot activate you.";
                vm.showFaulty = true;
            }
        }

        function startTimer() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('login');
            }, 2000);
        }
    }

})();
