(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderCommandController', headerCommandController);

    // this controller replaces the original one AccountController
    headerCommandController.$inject = ['AuthService', 'DinerService', 'NavigationService', 'ModalService', '$scope', '$timeout', 'fileService'];

    function headerCommandController(authService, dinerService, navigationService, modalService, $scope, $timeout, fileService) {
        /* jshint validthis:true */
        var vm = this;
        var iconIdx = 0;
        vm.addDishIcons = ['add', 'restaurant_menu'];
        vm.addDishIcon = vm.addDishIcons[iconIdx];
        vm.authentication = authService.authentication;
        vm.showLogin = true;
        vm.showSignup = true;
        vm.showUser = false;

        // events
        vm.showLoginModal = showLogin;
        vm.showSignupModal = showSignup;
        vm.logout = logOutHandler;
        vm.getDinerImage = getDinerImage;

        activate();
        function activate() {
            setInterval(function () {
                if (iconIdx === 0) {
                    iconIdx = 1;
                } else {
                    iconIdx = 0;
                }
                vm.addDishIcon = vm.addDishIcons[iconIdx];
                $scope.$apply();
            }, 5000);

            authService.fillAuthData();
            vm.authentication = authService.authentication;
            vm.showLogin = authService.authentication.isAuth === false;
            vm.showSignup = authService.authentication.isAuth === false;
            vm.showUser = authService.authentication.isAuth === true;
        }

        function logOutHandler() {
            authService.logOut();
            dinerService.flush();
            window.helper.refreshing($timeout, 0);
        }

        function showLogin(ev) {
            modalService.openModal('account/login.modal.html',"AccountLoginController", null, ev);
        }

        function showSignup(ev) {
            modalService.openModal('account/signup.modal.html', "AccountSignupController", null, ev);
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }
    }
})();
