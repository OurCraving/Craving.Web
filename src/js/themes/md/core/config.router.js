(function () {
    'use strict';

    angular.module('app')
     .run(['$rootScope', '$state', '$stateParams', 'GeoService', '$timeout','$location', '$window',
            function ($rootScope, $state, $stateParams, geoService, $timeout, $location, $window) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                var defaultLocation = window.helper.getDefaultLocation();
                $rootScope.position = defaultLocation;
                loadGeoLocation();

                // google analytics
                $rootScope.$on('$stateChangeSuccess',
                    function (event) {
                        if (!$window.ga)
                            return;

                        $window.ga('send', 'pageview', { page: $location.path() });
                    });

                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    if ((defaultLocation.coords.latitude === $rootScope.position.coords.latitude && $rootScope.position.coords.longitude === defaultLocation.coords.longitude)
                    || ($rootScope.position === undefined || $rootScope.position.coords === undefined)) {
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

                $rootScope.constructor.prototype.$off = function (eventName, fn) {
                    if (this.$$listeners) {
                        var eventArr = this.$$listeners[eventName];
                        if (eventArr) {
                            for (var i = 0; i < eventArr.length; i++) {
                                if (eventArr[i] === fn) {
                                    eventArr.splice(i, 1);
                                }
                            }
                        }
                    }
                };
            }
     ])
      .config(
        ['$stateProvider', '$urlRouterProvider','$locationProvider',
          function ($stateProvider, $urlRouterProvider, $locationProvider) {

              $urlRouterProvider.otherwise('/home');

              configHomeRoutes($stateProvider);
              configDishRoutes($stateProvider);
              configAccountRoutes($stateProvider);
              configProposalRoutes($stateProvider);
              configAdminRoutes($stateProvider);
              configRestaurantRoutes($stateProvider);

              $locationProvider.html5Mode(false).hashPrefix('!');
          }
        ]
      );

    function configHomeRoutes($stateProvider) {
        var homeRoute = require("./config.router.home.js");
        homeRoute($stateProvider);
    }

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

    function configRestaurantRoutes($stateProvider) {
        var restRoute = require("./config.router.restaurant.js");
        restRoute($stateProvider);
    }
})();
