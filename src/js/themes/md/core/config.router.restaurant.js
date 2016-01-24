module.exports = function ($stateProvider) {
    $stateProvider.state('restaurant',
        {
            "abstract": true,
            url: '/restaurant',
            views: {
                'app': {
                    templateUrl: 'layout/shell.html',
                    controller: [
                        '$scope', function ($scope) {
                            $scope.app.settings.pageTitle = 'Restaurant';
                        }
                    ]
                }
            }
        })
         .state('restaurant.home', {
             url: '/:id',
             views: {
                 'content@restaurant': {
                     templateUrl: 'restaurant/home.html',
                     controller: 'RestaurantController',
                     controllerAs: 'vm'
                 }
             }
         })
    ;
};