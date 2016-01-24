module.exports = function ($stateProvider) {
    $stateProvider
        .state('dish', {
            "abstract": true,
            url: '/dish',
            views: {
                'app': {
                    templateUrl: 'layout/shell_with_left_sidebar.html'
                }
            }
        })
        .state('dish.add', {
            url: '/add?input',
            resolve: {
                loader: [
                    'LoaderFactory', function (loaderFactory) {
                        var instance = new loaderFactory();
                        var dish = {};
                        dish.type = "New"; // this is not used yet
                        instance.current = dish;
                        return instance;
                    }
                ]
            },
            views: {
                'sidebar@dish': {
                    templateUrl: 'dish/map.add.html',
                    controller: 'DishMapEditController',
                    controllerAs: 'vm'
                },
                'content@dish': {
                    templateUrl: 'dish/dish.add.html',
                    controller: 'DishFieldEditController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('dish.detail', {
            url: '/detail/:id',
            resolve: {
                restaurantLoader: ['LoaderFactory', function (loaderFactory) {
                    return new loaderFactory();
                }]
            },
            views: {
                'sidebar@dish': {
                    templateUrl: 'dish/map.viewer.html',
                    controller: 'RestaurantMapController',
                    controllerAs: 'vm'
                },
                'content@dish': {
                    templateUrl: 'dish/dish.detail.html',
                    controller: 'DishDetailController',
                    controllerAs: 'vm'
                }
            }
        });
};