(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminController', adminController);

    adminController.$inject = ['AuthService', '$location', '$rootScope', '$scope'];
    function adminController(authService, $location, $rootScope, $scope) {

        authService.fillAuthData();

        var vm = this;
        // properties
        vm.title = "Administration";
        vm.overlayTitle = "";
        vm.coverClass = "bg-profile";
        vm.selectedItem = validateSelectedItem($rootScope.$stateParams.selected);
        vm.selectedItemPage = "admin/admin." + vm.selectedItem + ".html";
        vm.hasAccess = true;

        // methods
        vm.checkActive = checkActiveHandler;

        // init
        activate();

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
                case 'dishes':
                    vm.title = "Recent Dishes";
                    return selectedItem;
                case 'reviews':
                    vm.title = "Recent Reviews";
                    return selectedItem;
                case 'users':
                    default:
                    vm.title = "Recent Users";
                    return selectedItem;
                case 'files':
                    vm.title = "Recent Files";
                    return selectedItem;
                    
            }
        }

        // helpers
        function activate() {

        }

    }
}());