module.exports = function ($stateProvider) {
    $stateProvider
        .state('login', { // this route is used to show the login form in the full page
            url: '/login?selected',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html'
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
                    templateUrl: 'layout/shell.html',
                    controller: 'AccountController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('profile.activate', {
            url: '/activate?email&id&code',
            views: {
                "content@profile": {
                    templateUrl: 'account/activate.html',
                    controller: 'ActivateController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('profile.reset', {
            url: '/reset?email&id&code',
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
    .state('profile.associate', {
        url: '/associate',
        views: {
            "content@profile": {
                templateUrl: 'account/profile.associate.html',
                controller: 'ProfileAssociateController',
                controllerAs: 'vm'
            }
        }
    })
    ;
};