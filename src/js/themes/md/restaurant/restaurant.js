(function () {
    'use strict';

    angular
        .module('app')
        .controller('RestaurantController', restaurantController);

    restaurantController.$inject = ['RestaurantService', 'NavigationService', 'uiGmapGoogleMapApi', 'FactualService',
        '$rootScope', '$scope',
        'fileService', '$timeout'];

    function restaurantController(restaurantService, navigationService, mapApi, factualService,
        $rootScope, $scope,
        fileService, $timeout) {

        var vm = this;
        vm.cravings = [];
        vm.selectedCravings = [];
        vm.dishes = [];
        vm.message = "";
        vm.isValid = true;
        vm.RestaurantName = "";
        vm.restaurants = [];
        vm.items = [];
        vm.map = {};
        vm.map.markers = [];
        vm.map.userMarker = undefined;
        vm.map.selectedMarker = null;

        // events
        vm.getPreviewImage = getPreviewImage;
        vm.isCravingSelected = isCravingSelected;
        vm.selectCraving = selectCraving;
        vm.filterDish = filterDish;
        vm.locate = locate;

        activate();

        function activate() {
            vm.restaurantId = $rootScope.$stateParams.id;
            if (vm.restaurantId) {

                mapApi.then(function (map) {
                    if ($rootScope.position) {
                        vm.position = $rootScope.position;
                    } else {
                        vm.position = window.helper.getDefaultLocation();
                    }

                    updateCenter();

                    loadCravings();
                    loadDishes();
                    
                });

            } else {
                vm.message = "Restaurant Id is missing. The URL is invalid. Redirecting you to the home page now...";
                vm.isValid = false;
                gohome();
            }
        }

        function locate(item) {
            var marker = findMarker(item.factual_id);
            if (marker) {
                selectMarker(marker);
            }
        }

        function getPreviewImage(url) {
            return fileService.getSafePreviewImage(url);
        }

        function isCravingSelected(item) {
            return vm.selectedCravings.indexOf(item) > -1;
        }

        function selectCraving(item) {
            var idx = vm.selectedCravings.indexOf(item);
            if (idx > -1) vm.selectedCravings.splice(idx, 1);
            else vm.selectedCravings.push(item);

            applyFilter();
        }

        function loadCravings() {
            restaurantService.getCravings(vm.restaurantId).then(function (response) {
                vm.cravings = response.data.Cravings;
                vm.restaurantName = response.data.RestaurantName;

                $scope.updatePageTitle('Restaurant - ' + vm.restaurantName);

                loadRestaurantLocation();
            },
                function (err) {
                    window.helper.handleError(err, vm);
                });
        }

        function loadDishes() {
            restaurantService.getDishes(vm.restaurantId).then(function (response) {
                vm.dishes = response.data.Items;
            }, function (err) {
                window.helper.handleError(err, vm);
            });
        }

        function loadRestaurantLocation() {
            factualService.getByName(vm.restaurantName, vm.position.userLocation.city).then(
                function (data) {
                    var restaurants = [];
                    for (var idx = 0; idx < data.response.data.length; idx++) {
                        if (window.helper.hasDuplication(data.response.data[idx], restaurants) === false) {
                            restaurants.push(data.response.data[idx]);
                        }
                    }

                    locateRestaurant(restaurants);
                });
        }

        function filterDish(c) {
            return c.isFiltered === undefined || c.isFiltered === false;
        }

        function applyFilter() {
            var noFilter = false;
            if (vm.selectedCravings.length === 0 || vm.selectedCravings.length === vm.cravings.length) {
                noFilter = true;
            }

            var selectedTags = vm.selectedCravings.map(function (c) {
                return c.CravingTag;
            });

            for (var idx = 0; idx < vm.dishes.length; idx++) {
                var dish = vm.dishes[idx];
                if (noFilter) {
                    dish.isFiltered = false;
                } else {
                    dish.isFiltered = true; // assuming this dish is out, but if we found any tag is in the selected, we stop the loop
                    for (var j = 0; j < dish.Cravings.length; j++) {
                        var tag = dish.Cravings[j];
                        if (isCravingTagSelected(tag, selectedTags)) {
                            dish.isFiltered = false;
                            break;
                        }
                    }
                }
            }
        }

        function isCravingTagSelected(tag, list) {
            return list.indexOf(tag) > -1;
        }

        function gohome() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                navigationService.go("app.home");
            }, 2000);
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
                    vm.map.options.zoom = 11;
                    vm.map.options.zoomControlOptions = {
                        position: google.maps.ControlPosition.LEFT_TOP,
                        style: google.maps.ZoomControlStyle.LARGE
                    };
                    vm.map.options.scrollwheel = false;
                }, 250); // if I don't delay here, it doesn't show all the new markers 
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
