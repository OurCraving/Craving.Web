(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('ProfileController', profileController);

    profileController.$inject = ['AuthService', 'DinerService', 'ResumeService', 'NavigationService', '$rootScope', '$scope'];
    function profileController(authService, dinerService, resumeService, navigationService, $rootScope, $scope) {

        authService.fillAuthData();

        var vm = this;
        // properties
        vm.title = "Profile";
        vm.menu = buildMenu();
        vm.selectedItem = validateSelectedItem($rootScope.$stateParams.selected);
        vm.selectedItemPage = "account/profile." + vm.selectedItem.key + ".html";

        activate();

        // methods
        vm.checkActive = checkActiveHandler;

        function activate() {
            authService.fillAuthData();
            if (authService.authentication.isAuth !== true) {
                resumeService.createResume(function () { }, "You need to login first to access your profile.");
                navigationService.go('login'); // simply just go there, it will comeback automatically
            }

            dinerService.getMyProfile().then(function () {
                vm.profile = dinerService.profile;
            });
        }

        // event handlers 
        function checkActiveHandler(item) {
            if (vm.selectedItem === item) return "active";
            return "";
        }

        function validateSelectedItem(selectedItem) {
            for (var idx = 0; idx < vm.menu.length; idx++) {
                if (vm.menu[idx].key === selectedItem) {
                    $scope.updatePageTitle('OurCraving -> Profile -> ' + vm.menu[idx].title);
                    return vm.menu[idx];
                }
            }

            return vm.menu[0];
        }

        function buildMenu() {
            return [
            {
                key: 'basic',
                link: "profile.home.detail({selected:'basic'})",
                title: 'Basic Information',
                icon: 'account_box'
            },
            {
                key: 'dislike',
                link: "profile.home.detail({selected:'dislike'})",
                title: 'Dislike Cravings',
                icon: 'favorite_outline'
            },
                {
                    key: 'favorite',
                    link: "profile.home.detail({selected:'favorite'})",
                    title: 'Favorite Dishes',
                    icon: 'favorite'
                },
                {
                    key: 'mydish',
                    link: "profile.home.detail({selected:'mydish'})",
                    title: 'My Added Dishes',
                    icon: 'restaurant_menu'
                },
                {
                    key: 'myreview',
                    link: "profile.home.detail({selected:'myreview'})",
                    title: 'My Reviews',
                    icon: 'rate_review'
                },
                {
                    key: 'settings',
                    link: "profile.home.detail({selected:'settings'})",
                    title: 'Settings',
                    icon: 'settings'
                },
                {
                    key: 'cravinghistory',
                    link: "profile.home.detail({selected:'cravinghistory'})",
                    title: 'Craving History',
                    icon: 'history'
                },
                {
                    key: 'updatepassword',
                    link: "profile.home.detail({selected:'updatepassword'})",
                    title: 'Update Password',
                    icon: 'security'
                }
            ];
        }
    }
}());