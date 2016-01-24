(function () {
    'use strict';

    // part of this file come from a github open source project, but it was a factory. 
    // converted it to a service so only one instance will be created, and we don't have to request geolocation from the browser 
    // however, a draw back is: if the user has the browser open and then travel to another city (keep the browser opened), the geolocation won't refresh
    var app = angular.module('app');

    app
        .service('GeoService', geoService);

    geoService.$inject = ['$rootScope', '$window', '$q', '$http', 'baseUrl2'];

    function geoService($rootScope, $window, $q, $http, baseUrl2) {

        var service = {
            getCurrentPosition: getCurrentPosition,
            initialize: initialize,
            getPosition: getPosition,
            updatePosition: updatePosition,

            // properties 
            position: {},
            hasInitialized: false,
            GEO_UPDATE: 'geo_updated'
        };

        return service;

        function supported() {
            return 'geolocation' in $window.navigator;
        }

        function getPosition() {
            return service.position;
        }

        function initialize() {
            service.hasInitialized = false;
            var deferred = $q.defer();
            if (service.position && service.position.coords && service.position.userLocation && service.position.userLocation.city) {
                service.hasInitialized = true;
                deferred.resolve(service.position);
                return deferred.promise;
            } else {
                return loadGeo().then(loadPlace);
            }
        }

        function getCurrentPosition(options) {
            var deferred = $q.defer();
            if (supported()) {
                $window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        // this is a very strange issue. I encountered a few times the returned location is far off from where I am
                        // the accuracy is over 6000. did some research, it seems if keep calling this getCurrentPosition, it will 
                        // get better accurate value each time. someone even wrote a library to pass in a desired accuracy and return 
                        // only if the value is met, but I think that's overkilled, here calling it twice is probably enough 
                        if (position.coords.accuracy > 5000) {
                            $window.navigator.geolocation.getCurrentPosition(
                                function (secondPosition) {
                                    foundPosition(secondPosition, deferred);
                                }
                            );
                        } else {
                            foundPosition(position, deferred);
                        }

                    },
                    function (error) {
                        deferred.reject({ error: error });
                    }, options);
            } else {
                deferred.reject({
                    error: {
                        code: 2,
                        message: 'This web browser does not support HTML5 Geolocation'
                    }
                });
            }
            return deferred.promise;
        }

        function foundPosition(position, deferred) {
            service.position = {};
            service.position.coords = position.coords;
            service.position.timestamp = position.timestamp;
            deferred.resolve(position);
        }

        function loadGeo() {
            return getCurrentPosition({ timeout: 6000, enableHighAccuracy: false, maximumAge: 60000 });
        }

        function loadPlace(position) {
            return locateUserLocation(position.coords.latitude, position.coords.longitude).then(function (response) {
                service.position.userLocation = {};
                service.position.userLocation.city = response.data.City;
                service.position.userLocation.region = response.data.Region;
                service.position.userLocation.country = response.data.Country;
                service.hasInitialized = true;

                updatePosition(service.position);
            });
        }

        function updatePosition(position) {
            $rootScope.$emit(service.GEO_UPDATE, position);
        }

        function locateUserLocation(latitude, longitude) {
            var serviceBase = baseUrl2;
            var input = {
                "location": latitude + "," + longitude
            };

            return $http.get(serviceBase + "restaurants/location", { params: input });
        }

    }

})();