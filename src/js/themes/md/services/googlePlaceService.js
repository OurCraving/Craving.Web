(function () {
    'use strict';

    angular
        .module('app')
        .service('GoogleService', googleService);

    function googleService() {
        this.getRestaurantsFromGoogle = getRestaurantsFromGoogle;

        function getRestaurantsFromGoogle(map, lat, lon, successCallback, errorCallback) {

            var pyrmont = new google.maps.LatLng(lat, lon);

            var request = {
                location: pyrmont,
                radius: 1500,
                types: ['restaurant']
            };

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function (results, status, pagination) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    successCallback(results, pagination);
                } else {
                    errorCallback(results, status);
                }
            });
        };
    }
})();