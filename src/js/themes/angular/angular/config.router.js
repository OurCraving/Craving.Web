(function(){
    'use strict';

    angular.module('app')
        .run([ '$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ])
        .config(
        [ '$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/discover/map-full');

                $stateProvider
                    .state('discover', {
                        abstract: true,
                        url: '/discover',
                        template: '<div ui-view class="ui-view-main" />'
                    })
                    .state('discover.map-full', {
                        url: '/map-full',
                        templateUrl: 'discover/map-full.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs';
                        }]
                    })
                    .state('discover.map-listing-list', {
                        url: '/map-listing-list',
                        templateUrl: 'discover/map-listing-list.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs sidebar-r-48pc-lg sidebar-r-40pc';
                        }]
                    })
                    .state('discover.map-listing-grid', {
                        url: '/map-listing-grid',
                        templateUrl: 'discover/map-listing-grid.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs sidebar-r-48pc-lg sidebar-r-40pc';
                        }]
                    })
                    .state('discover.listing', {
                        url: '/listing',
                        templateUrl: 'discover/listing.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l-sum-13';
                        }]
                    })
                    .state('discover.listing-grid', {
                        url: '/listing-grid',
                        templateUrl: 'discover/listing-grid.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l-sum-13';
                        }]
                    })
                    .state('discover.listing-map', {
                        url: '/listing-map',
                        templateUrl: 'discover/listing-map.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l-sum-13';
                        }]
                    });

                $stateProvider
                    .state('property', {
                        abstract: true,
                        url: '/property',
                        template: '<div ui-view class="ui-view-main" />'
                    })
                    .state('property.map', {
                        url: '/map',
                        templateUrl: 'property/map.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs sidebar-r-48pc-lg sidebar-r-40pc';
                        }]
                    })
                    .state('property.property', {
                        url: '/property',
                        templateUrl: 'property/property.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs sidebar-r-25pc-lg sidebar-r-30pc';
                        }]
                    })
                    .state('property.edit', {
                        url: '/edit',
                        templateUrl: 'property/edit.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs sidebar-r-48pc-lg sidebar-r-40pc';
                        }]
                    });

                $stateProvider
                    .state('map-features', {
                        abstract: true,
                        url: '/map-features',
                        template: '<div ui-view class="ui-view-main" />'
                    })
                    .state('map-features.themes', {
                        url: '/themes',
                        templateUrl: 'map-features/themes.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1 sidebar-r1-xs';
                        }]
                    })
                    .state('map-features.filters', {
                        url: '/filters',
                        templateUrl: 'map-features/filters.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l1';
                        }]
                    })
                    .state('map-features.markers', {
                        url: '/markers',
                        templateUrl: 'map-features/markers.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
                        }]
                    });

                $stateProvider
                    .state('front', {
                        abstract: true,
                        url: '/front',
                        template: '<div ui-view class="ui-view-main" />'
                    })
                    .state('front.home-map', {
                        url: '/home-map',
                        templateUrl: 'front/home-map.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';
                        }]
                    })
                    .state('front.home-slider', {
                        url: '/home-slider',
                        templateUrl: 'front/home-slider.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'hide-sidebar ls-bottom-footer-fixed';
                        }]
                    })
                    .state('front.listing', {
                        url: '/listing',
                        templateUrl: 'front/listing.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';
                        }]
                    })
                    .state('front.listing-grid', {
                        url: '/listing-grid',
                        templateUrl: 'front/listing-grid.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';
                        }]
                    })
                    .state('front.property', {
                        url: '/property',
                        templateUrl: 'front/property.html',
                        controller: ['$scope', function($scope){
                            $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';
                        }]
                    });
            }
        ]
    );

})();