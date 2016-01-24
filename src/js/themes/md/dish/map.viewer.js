(function () {
    'use strict';

    angular
        .module('app')
        .config(['uiGmapGoogleMapApiProvider', function (mapProvider) {
            window.MapHelper.configMap(mapProvider);
        }])
        .controller('RestaurantMapController', restaurantMapController);

    restaurantMapController.$inject = ['restaurantLoader', 'RestaurantService','ModalService',
        'uiGmapGoogleMapApi', '$timeout', '$rootScope', '$scope'];

    function restaurantMapController(restaurantLoader, restService, modalService,
        mapApi, $timeout, $rootScope, $scope) {
        var vm = this;
        vm.message = "";
        vm.hasError = false;
        vm.restaurants = [];
        vm.items = [];

        vm.map = {};
        vm.map.markers = [];
        vm.map.userMarker = undefined;
        vm.map.selectedMarker = null;

        // events
        vm.locate = locate;
        vm.close = close;

        // initialize
        activate();

        // event handlers
        function locate(item) {
            var marker = findMarker(item.factual_id);
            if (marker) {
                selectMarker(marker);
            }
        }

        function close() {
            modalService.closeSidenav("left");
        }

        // helpers
        function activate() {
            restaurantLoader.addLoadedEventListener(handleRestaurantLoaded);

            mapApi.then(function (map) {
                if ($rootScope.position) {
                    vm.position = $rootScope.position;
                } else {
                    vm.position = window.helper.getDefaultLocation();
                }

                updateCenter();

                $("#left").on('sidenav.open', function (ev) {
                    if (ev.target.id === 'left') {
                        vm.map.control.refresh();
                    }
                });
            });
        }

        // for this loader, this event is fired when all restaurants are loaded
        function handleRestaurantLoaded(restaurants) {
            vm.hasError = false;
            // we need to wait for the map initialized after the dish is loaded 
            (function tick() {
                var timer = $timeout(tick, 500);
                $timeout.cancel(timer); // if the map is initialized, we don't have to wait
                clearMarkers();
                locateRestaurant(restaurants);
            })();
        }

        function clearMarkers() {
            initializeMarkers();
            for (var key in vm.map.markers) {
                vm.map.markers[key].setMap(null);
            };
        }

        function initializeMarkers() {
            vm.restaurants = [];
            vm.map.markers = [];
        }

        function locateRestaurant(data) {
            if (data && data.length && data.length > 0) {
                var markers = [];
                for (var idx = 0; idx < data.length; idx++) {
                    var item = data[idx];
                    item.placeIndex = idx + 1;
                    item.isSelected = false;
                    vm.items.push(item);

                    var markerData = window.MapHelper.createRestaurantMarker(item, idx, onMarkerSelected, null);
                    markers.push(markerData);

                    vm.restaurants.push(item);
                }

                $timeout(function () {
                    vm.map.markers = markers;
                    vm.map.center = { latitude: vm.items[0].latitude, longitude: vm.items[0].longitude };
                }, 250); // if I don't delay here, it doesn't show all the new markers 
            }
        }

        function updateCenter() {
            vm.map = window.MapHelper.createMap(vm.position.coords);
            vm.userCoords = vm.position.coords;
            ensureUserMarker();
        }

        function ensureUserMarker() {
            if (!vm.userMarker) {
                vm.map.userMarker = window.MapHelper.createUserMarker(vm.userCoords, null);
            }
        }

        function onMarkerSelected(sender) {
            if (sender.model && sender.model.factual_id) {
                selectMarker(sender.model);
            }
        }

        function selectMarker(marker) {
            if (vm.map.selectedMarker) {
                deSelectMarker(vm.map.selectedMarker);
            }

            var item = findItem(marker.factual_id);
            marker.options.opacity = 1.0;
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = true;
                });

                vm.map.selectedMarker = marker;
                vm.map.center.latitude = marker.coords.latitude;
                vm.map.center.longitude = marker.coords.longitude;
            }
        }

        function deSelectMarker(marker) {
            var item = findItem(marker.factual_id);
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = false;
                });
                marker.options.opacity = 0.4;
            }
        }

        function findMarker(factualId) {
            for (var idx = 0; idx < vm.map.markers.length; idx++) {
                if (vm.map.markers[idx].factual_id === factualId)
                    return vm.map.markers[idx];
            }

            return undefined;
        }

        function findItem(factualId) {
            for (var idx = 0; idx < vm.items.length; idx++) {
                if (vm.items[idx].factual_id === factualId)
                    return vm.items[idx];
            }

            return undefined;
        }
    }

})();
