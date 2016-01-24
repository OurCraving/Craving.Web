(function () {
    'use strict';

    angular
        .module('app')
        .controller('LocationController', locationController);

    locationController.$inject = ['GeoService', 'RestaurantService', '$http', '$scope', '$rootScope'];

    function locationController(geoService, restService, $http, $scope, $rootScope) {
        var vm = this;
        vm.message = "";
        vm.savedSuccessfully = false;
        vm.currentCity = "";
        vm.title = "Set Your Location";
        vm.supportedCities = [];

        vm.relocateMe = relocateMe;
        vm.chooseCity = chooseCity;

        activate();

        function activate() {
            $scope.updatePageTitle('OurCraving - Choose your location');

            restService.getCitySummaries().then(function (response) {
                vm.supportedCities = response.data.Items;
            });

            updateMe();
        }

        var repeatGuard = 0;
        function relocateMe() {
            geoService.position = undefined;
            vm.savedSuccessfully = false;

            var q = geoService.initialize();

            q.then(function () {
                if (geoService.position) {
                    $rootScope.position = geoService.position;
                    updateMe();
                    vm.message = "You have been relocated successfully.";
                } else {
                    if (repeatGuard >= 5) {
                        vm.message = "Relocation timeout... try to refresh the browser first";
                    } else {
                        repeatGuard++;
                        relocateMe();
                    }
                }
            }).catch(function (err) {
                window.helper.handleError(err, vm);
            });
        }

        function chooseCity(city, region) {
            vm.message = "";

            // TODO: I am not sure how to handle this better
            var endpoint = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ", " + region + "&key=[EnterYourKeyHere]";
            $http({
                url: endpoint,
                cache: true,
                method: 'GET'
            }).then(function (response) {
                if (response.data.results.length > 0) {
                    var location = getLocation(response.data.results[0]);
                    $rootScope.position = location;
                    geoService.updatePosition(location);
                    updateMe();
                }
            });
        }

        function updateMe() {
            vm.savedSuccessfully = true;
            vm.currentCity = $rootScope.position.userLocation.city + ", " + $rootScope.position.userLocation.region;
        }

        function getLocation(result) {
            return {
                coords: {
                    latitude: result.geometry.location.lat,
                    longitude: result.geometry.location.lng
                },
                userLocation: {
                    city: result.address_components[0].long_name,
                    region: result.address_components[result.address_components.length - 2].long_name,
                    country: result.address_components[result.address_components.length - 1].long_name
                }

            };
        }
    }
})();
