(function () {
    'use strict';

    angular.module('app')
      .run(['$rootScope', '$state', '$stateParams', 'GeoService', '$timeout',
            function ($rootScope, $state, $stateParams, geoService, $timeout) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                var defaultLocation = window.helper.getDefaultLocation();
                $rootScope.position = defaultLocation;
                loadGeoLocation();

                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    if ((defaultLocation.coords.latitude === $rootScope.position.coords.latitude && $rootScope.position.coords.longitude === defaultLocation.coords.longitude) 
                    || ($rootScope.position === undefined || $rootScope.position.coords === undefined) ){
                        // hmm, let's try again, because it seems we failed to load a user location
                        loadGeoLocation();
                    }
                }, 6000);

                // TODO: this code doesn't seem to run properly, sometimes, not sure if it's only happening in the browserify environment
                function loadGeoLocation() {
                    var q = geoService.initialize();
                    q.then(function () {
                        $rootScope.position = geoService.position;
                    }).catch(function () {
                        $rootScope.position = defaultLocation;
                    });
                }
            }
      ])
      .config(
        ['$stateProvider', '$urlRouterProvider',
          function ($stateProvider, $urlRouterProvider) {

              $urlRouterProvider
                .otherwise('/home');

              $stateProvider
                .state('app', {
                    "abstract": true,
                    url: '',
                    views: {
                        'app': {
                            templateUrl: 'layout/shell.html',
                            controller: ['$scope', function ($scope) {
                                $scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l-sum-13';
                            }]
                        }
                    }
                })
                .state('app.home', {
                    url: '/home',
                    views: {
                        'content@app': { templateUrl: 'craving/recent.html' }
                    }
                })
              .state('app.home.search', {
                  url: '^/search/:criteria',
                  views: {
                      'content@app': { templateUrl: 'craving/search.html' }
                  }
              });

              configDishRoutes($stateProvider);
              configAccountRoutes($stateProvider);
              configProposalRoutes($stateProvider);
              configAdminRoutes($stateProvider);
          }
        ]
      );

    function configDishRoutes($stateProvider) {
        var dishRoute = require("./config.router.dish.js");
        dishRoute($stateProvider);
    }

    function configAccountRoutes($stateProvider) {
        var accountRoute = require("./config.router.account.js");
        accountRoute($stateProvider);
    }

    function configProposalRoutes($stateProvider) {
        var proposalRoute = require("./config.router.proposal.js");
        proposalRoute($stateProvider);
    }

    function configAdminRoutes($stateProvider) {
        var proposalRoute = require("./config.router.admin.js");
        proposalRoute($stateProvider);
    }
})();
