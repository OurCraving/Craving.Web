module.exports = function ($stateProvider) {
    $stateProvider
        .state('dish', {
            "abstract": true,
            url: '/dish',
            views: {
                'app': {
                    templateUrl: 'layout/shell_with_2sidebars.html',
                    controller: [
                        '$scope', function($scope) {
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs sidebar-r-48pc-lg sidebar-r-40pc';
                        }
                    ]
                }
            }
        })
        .state('dish.add', {
            url: '/add',
            resolve: {
                loader: [
                    'LoaderFactory', function(loaderFactory) {
                        var instance = new loaderFactory();
                        var dish = {};
                        dish.type = "New"; // this is not used yet
                        instance.current = dish;

                        return instance;
                    }
                ]
            },
            views: {
                'editor@dish': {
                    templateUrl: 'dish/map-editor.html',
                    controller: 'DishMapEditController',
                    controllerAs: 'vm'
                },
                'content@dish': {
                    templateUrl: 'dish/field-editor.html',
                    controller: 'DishFieldEditController',
                    controllerAs: 'vm'
                }
            }
        });

    $stateProvider
        .state('detail', {
            "abstract": true,
            url: '/detail',
            views: {
                'app': {
                    templateUrl: 'layout/shell_with_smaller_sides.html',
                    controller: [
                        '$scope', function ($scope) {
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs sidebar-r-25pc-lg sidebar-r-30pc';
                        }
                    ]
                }
            }
        })
        .state('detail.dish', {
            url: '/dish/:id',
            resolve: {
                restaurantLoader: ['LoaderFactory', function (loaderFactory) {
                    return new loaderFactory();
                }],
                dinerLoader: ['LoaderFactory', function (loaderFactory) {
                    return new loaderFactory();
                }]
            },
            views: {
                'editor@detail': {
                    templateUrl: 'dish/map-viewer.html',
                    controller: 'RestaurantMapController',
                    controllerAs: 'vm'
                },
                'content@detail': {
                    templateUrl: 'dish/detail-viewer.html',
                    controller: 'DishDetailController',
                    controllerAs: 'vm'
                },
                'overlay@detail': {
                    templateUrl: 'users/diner-viewer.html',
                    controller: 'DinerDetailController',
                    controllerAs: 'vm'
                }
            }
        });
};