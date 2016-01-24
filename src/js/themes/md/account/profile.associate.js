(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileAssociateController', profileAssociateController);

    profileAssociateController.$inject = ['AuthService', 'ModalService', 'NavigationService', 'logger'];
    function profileAssociateController(authService, modalService, navigationService, logger) {
        var vm = this;

        // properties
        vm.authData = authService.externalAuthData;
        
        vm.title = "You're almost done linking your " + vm.authData.provider + " account!";
        vm.savedSuccessfully = false;
        vm.message = '';       

        // methods
        init();

        // event handlers
        vm.cancel = cancel;
        vm.submit = submit;

        function init() {
            //In the event that we don't have auth data, redirect back to the home page
            //rather than showing a broken form.
            if (!vm.authData || !vm.authData.provider) {
                navigationService.go('app.home');
            }                
        }

        function cancel() {
            navigationService.go('app.home');
        }

        function submit() {

            if (!vm.authData.username || !vm.authData.email) {
                vm.savedSuccessfully = false;
                vm.message = "Whoops! Looks like you're missing some required information!";
                return;
            }

            if (!vm.authData.provider || !vm.authData.externalAccessToken) {
                vm.savedSuccessfully = false;
                vm.message = "Looks like we ran into a problem on our end. Please try linking your account again!";
                return;
            }

            var data = {
                'ExternalAccessToken': vm.authData.externalAccessToken,
                'Provider': vm.authData.provider,
                'Username': vm.authData.username,
                'Email': vm.authData.email
            }

            authService.registerExternalUser(vm.authData).then(
                function (response) {
                    vm.isBusy = false;
                    vm.submitted = true;
                    vm.message = "Login successfully.";
                    vm.savedSuccessfully = true;
                    logger.success('External User Registered Successfully!');

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
                }
            );
        }
    }

}());