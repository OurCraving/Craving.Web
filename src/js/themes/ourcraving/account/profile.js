(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('ProfileController', profileController);

    profileController.$inject = ['AuthService', '$location', '$rootScope'];
    function profileController(authService, $location, $rootScope) {

        authService.fillAuthData();

        var vm = this;
        // properties
        vm.title = "Profile";
        vm.overlayTitle = authService.authentication.displayName;
        vm.coverClass = "bg-profile";
        vm.selectedItem = validateSelectedItem($rootScope.$stateParams.selected);
        vm.selectedItemPage = "account/profile." + vm.selectedItem + ".html";

        // methods
        vm.checkActive = checkActiveHandler;

        // event handlers 
        function checkActiveHandler(item) {
            if (vm.selectedItem === item) return "active";
            return "";
        }

        function validateSelectedItem(selectedItem) {
            // another approach is to define a json array with title, path, and key, and use ng-repeat to output them 
            // the current way I am using might cause some inconsistency if change is needed, coz I have to remember to change
            // both in the html and in js code
            switch (selectedItem) {
                case 'dislike':
                    vm.title = "Dislike Cravings";
                    return selectedItem;
                case 'cravinghistory':
                    vm.title = "My Craving History";
                    return selectedItem;
                case 'messages':
                    vm.title = "Messages";
                    return selectedItem;
                case 'friends':
                    vm.title = "Friends";
                    return selectedItem;
                case 'updatepassword':
                    vm.title = "Reset Password";
                    return selectedItem;
                default:
                    vm.title = "Basic Information";
                    return 'basic';
            }
        }
    }


}());