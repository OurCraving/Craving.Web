(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantMapController', restaurantMapController);

    restaurantMapController.$inject = ['restaurantLoader', 'RestaurantService', '$timeout', '$rootScope'];

    function restaurantMapController(restaurantLoader, restService, $timeout, $rootScope) {

        var vm = this;
        vm.message = "";
        vm.hasError = false;
        vm.restMarkers = [];
        vm.restaurants = [];

        // initialize
        activate();

        // helpers
        function activate() {
            restaurantLoader.addLoadedEventListener(handleRestaurantLoaded);
            $(document).on('map.init', function (event, data) {
                vm.map = data.map;
                vm.mapData = data;
                if ($rootScope.position) {
                    vm.position = $rootScope.position;
                } else {
                    vm.position = window.helper.getDefaultLocation();
                }
            });
        }

        // for this loader, this event is fired when all restaurants are loaded
        function handleRestaurantLoaded(restaurants) {
            vm.hasError = false;
            // we need to wait for the map initialized after the dish is loaded 
            (function tick() {
                var timer = $timeout(tick, 1000);
                if (vm.map && vm.mapData) {
                    $timeout.cancel(timer); // if the map is initialized, we don't have to wait
                    var markers = vm.mapData.container.gmap('get', 'markers');
                    clearMarkers(markers);
                    locateRestaurant(restaurants);
                }
            })();
        }

        function clearMarkers(markers) {
            vm.mapData.removeMarkers(0, markers.length);
            initializeMarkers();
        }

        function initializeMarkers() {
            vm.restMarkers = [];
            vm.restaurants = [];
        }

        function locateRestaurant(data) {
            if (data && data.length && data.length > 0) {
                for (var idx = 0; idx < data.length; idx++) {

                    var item = data[idx];
                    item.placeIndex = idx + 1;
                    // the Item's properties are named differently, they are FindRestaurantResp DTO
                    var markerData = window.MapHelper.createRestaurantMarker(item, idx);
                    vm.restMarkers.push(markerData);
                    vm.restaurants.push(item);
                    var markerInst = vm.mapData.addMarker(idx, markerData, { "draggable": false, "opacity": 0.4 });
                }

                // the first one is the closet one, default is sorted by distance asc 
                var origin = new google.maps.LatLng(data[0].latitude, data[0].longitude);
                vm.map.setOptions({ 'center': origin });

                // TODO: a better experience is to center using the user's location and connect to the closeset one 
            }
        }


    }

})();
