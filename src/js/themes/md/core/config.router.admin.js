module.exports = function ($stateProvider) {
    $stateProvider.state('admin',
        {
            "abstract": true,
            url: '/admin',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html',
                    controller: [
                        '$scope', function ($scope) {
                            $scope.app.settings.pageTitle = 'Administrator';
                        }
                    ]
                }
            }
        })
        .state('admin.home', {
            url: '/home',
            views: {
                'content@admin': {
                    templateUrl: 'admin/home.html',
                    controller: 'AdminController',
                    controllerAs: 'vm'
                }
            }
        })
         .state('admin.home.detail', {
             url: '/:selected',
             views: {
                 'content@admin': {
                     templateUrl: 'admin/home.html',
                     controller: 'AdminController',
                     controllerAs: 'vm'
                 }
             }
         })
    ;
};