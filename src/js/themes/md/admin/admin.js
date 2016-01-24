(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminController', adminController);

    adminController.$inject = ['AuthService', 'ResumeService', 'NavigationService', '$rootScope', '$scope'];
    function adminController(authService, resumeService, navigationService, $rootScope, $scope) {

        authService.fillAuthData();

        var vm = this;
        // properties
        vm.title = "Administration";
        vm.overlayTitle = "";
        vm.menu = buildMenu();
        vm.selectedItem = validateSelectedItem($rootScope.$stateParams.selected);
        vm.selectedItemPage = "admin/admin." + vm.selectedItem.key + ".html";
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
            for (var idx = 0; idx < vm.menu.length; idx++) {
                if (vm.menu[idx].key === selectedItem) {
                    $scope.updatePageTitle('OurCraving -> Administration -> ' + vm.menu[idx].title);
                    return vm.menu[idx];
                }
            }

            return vm.menu[0];
        }

        // helpers
        function activate() {
            authService.fillAuthData();
            if (authService.authentication.isAuth !== true) {
                resumeService.createResume(function () { }, "You need to login first to access the admin page.");
            }
        }

        function buildMenu() {
            return [
            {
                key: 'dishes',
                link: "admin.home.detail({selected:'dishes'})",
                title: 'Recent Dishes',
                icon: 'restaurant_menu'
            },
            {
                key: 'reviews',
                link: "admin.home.detail({selected:'reviews'})",
                title: 'Recent Reviews',
                icon: 'comment'
            },
                {
                    key: 'users',
                    link: "admin.home.detail({selected:'users'})",
                    title: 'Recent Users',
                    icon: 'people'
                },
                {
                    key: 'files',
                    link: "admin.home.detail({selected:'files'})",
                    title: 'Recent Files',
                    icon: 'photo'
                },
                {
                    key: 'cravingtags',
                    link: "admin.home.detail({selected:'cravingtags'})",
                    title: 'Craving Tags',
                    icon: 'flag'
                }
                ,
                {
                    key: 'cache',
                    link: "admin.home.detail({selected:'cache'})",
                    title: 'Cache Management',
                    icon: 'cached'
                }
            ];
        }
    }
}());