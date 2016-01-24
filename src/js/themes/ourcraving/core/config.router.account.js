module.exports = function ($stateProvider) {
    // account 
    $stateProvider
        .state('login', { // this route is used to show the login form in the full page
            url: '/login',
            views: {
                'app': {
                    templateUrl: 'layout/shell_center_content.html',
                    controller: [
                        '$scope', function ($scope) {
                            $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';
                        }
                    ]
                },
                'content@login': {
                    templateUrl: 'account/loginPage.html',
                    controller: 'AccountLoginController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('profile', {
            "abstract": true,
            url: '/profile',
            views: {
                'app': {
                    templateUrl: 'layout/shell_center_content.html',
                    controller: ['$scope', function ($scope) {
                        $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';
                    }]
                }
            }
        })
    .state('profile.activate', {
        url: '/activate?id&code',
        views: {
            "content@profile": {
                templateUrl: 'account/activate.html',
                controller: 'ActivateController',
                controllerAs: 'vm'
            }
        }
    })
    .state('profile.reset', {
        url: '/reset?profile',
        views: {
            "content@profile": {
                templateUrl: 'account/reset.html',
                controller: 'ResetPasswordController',
                controllerAs: 'vm'
            }
        }
    })
    .state('profile.home', {
        url: '/home',
        views: {
            "content@profile": {
                templateUrl: 'account/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            }
        }
    })
    .state('profile.home.detail', {
        url: '/:selected',
        views: {
            "content@profile": {
                templateUrl: 'account/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            }
        }
    })
    .state('profile.settings', {
        url: '/settings',
        views: {
            "content@profile": {
                templateUrl: 'account/profile.settings.html',
                controller: 'ProfileSettingsController',
                controllerAs: 'vm'
            }
        }
    });
};