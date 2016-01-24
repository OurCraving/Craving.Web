(function () {
    'use strict';

    angular
        .module('app')
        .config(['uiGmapGoogleMapApiProvider', function (mapProvider) {
            window.MapHelper.configMap(mapProvider);
        }])
        .controller('DishMapEditController', dishMapEditController);

    dishMapEditController.$inject = ['GeoService', 'RestaurantService', 'DinerService', 'ReferenceDataService', 'FactualService', 'ModalService',
        'loader', 'uiGmapGoogleMapApi',
        '$timeout', '$rootScope', '$scope'];

    function dishMapEditController(geoService, restService, dinerService, refDataService, factualService, modalService,
        dishLoader, mapApi,
        $timeout, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        var pageLimit = 15;

        vm.userCoords = {}; // this stores the current user's marker 
        vm.dish = dishLoader.current;

        vm.selectedRestaurant = undefined;
        vm.availableRestaurants = [];

        vm.offset = 0; // factual service search offset
        vm.itemTitle = ""; // title of the item panel
        vm.hasNextPage = false; // indicate if there is next page;
        vm.hasPrevPage = false;
        vm.currentPage = 1;
        vm.pages = []; // for displaying pagination
        vm.pageSize = pageLimit;
        vm.showSearch = false;
        vm.cravings = [];
        vm.searchText = "";

        vm.position = window.helper.getDefaultLocation();
        vm.map = {};
        vm.map.markers = [];
        vm.map.userMarker = undefined;
        vm.map.selectedMarker = null;
        vm.items = [];
        vm.total = 0; // store the total searched results 

        // events
        vm.locate = locate;
        vm.getCuisine = getCuisine;
        vm.searchRestaurant = searchRestaurant;
        vm.gotoPage = gotoPage;
        vm.gotoPrevPage = gotoPrevPage;
        vm.gotoNextPage = gotoNextPage;
        vm.close = close;

        // initialize
        activate();

        // helpers
        function activate() {
            mapApi.then(function (map) {
                if ($rootScope.position) {
                    vm.position = $rootScope.position;
                } else {
                    vm.position = window.helper.getDefaultLocation();
                }

                updateCenter();

                $("#left").on('sidenav.open', function (ev) {
                    if (ev.target.id == 'left') {
                        vm.map.control.refresh();
                    }
                });
            });

            refDataService.getData("cravingtype").then(function (response) {
                vm.cravings = response.Items.map(function (c) { return c.Name; });
            });


        }

        // event handlers
        function close() {
            // this key is defined in shell_width_right_sidebar.html
            modalService.closeSidenav("left");
        }

        // it applies some intelligence to load the cuisine type of a restaurant 
        // Factual API only returns the real cuisine types from restaurant-XX dataset not from "places" dataset 
        // however, we can derive a rough cuisine type from the category_labels 
        function getCuisine(item) {
            var retval = [];
            var defaultCuisine = "Food and Dining";
            var genericCategory = "Restaurants";
            if (item.cuisine && item.cuisine.constructor === Array) {
                return item.cuisine.splice(0, 3);
            } else if (item.category_labels && item.category_labels.constructor === Array) {
                for (var idx = 0; idx < item.category_labels.length; idx++) {
                    var labels = item.category_labels[idx];
                    if (labels.constructor === Array) {
                        if (labels[labels.length - 1] !== genericCategory) {
                            retval.push(labels[labels.length - 1]);
                        }
                    }

                    if (retval.length === 3)
                        break;
                }

                if (retval.length === 0) {
                    retval.push(defaultCuisine);
                }
            } else {
                retval.push(defaultCuisine);
            }

            return retval;
        }

        function searchRestaurant() {
            if (!vm.position) return;

            // reset
            if (vm.searchText === "" || !vm.searchText) {
                updateCenter();
                return;
            }

            clearMarkers();

            factualService.getByName(vm.searchText, vm.position.userLocation.city).then(
                function (data) {
                    var items = data.response.data;
                    loadSearchedResults(items);

                }, function (err) {
                    window.helper.handleError(err, vm);
                    vm.hasError = true;
                });
        }

        function locate(item) {
            var marker = findMarker(item.factual_id);
            if (marker) {
                selectMarker(marker);
            }
        }

        function gotoPrevPage() {
            if (vm.offset > 0) {
                vm.offset = vm.offset - pageLimit;
                reloadRestaurants();
            }
        }

        function gotoNextPage() {
            if (vm.offset + pageLimit < vm.total) {
                vm.offset = vm.offset + pageLimit;
                reloadRestaurants();
            }
        }

        function gotoPage(p) {
            if (p > vm.currentPage) {
                vm.offset = pageLimit * (p - 1);
            } else {
                if (p === 1)
                    vm.offset = 0;
                else
                    vm.offset = vm.offset - pageLimit * (p - 1);
            }

            reloadRestaurants();
        }

        // helpers
        function updateCenter() {
            vm.map = window.MapHelper.createMap(vm.position.coords);
            vm.userCoords = vm.position.coords;
            ensureUserMarker();
            reloadRestaurants();
        }

        function clearMarkers() {
            initializeMarkers();
            for (var key in vm.map.markers) {
                vm.map.markers[key].setMap(null);
            };
        }

        function loadRestaurants() {
            factualService.searchNear(vm.userCoords.latitude, vm.userCoords.longitude, vm.offset, pageLimit).then(
                function (data) {
                    drawMarker(data);
                });
        }

        function reloadRestaurants() {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                clearMarkers();
                loadRestaurants();
            });
        }

        function drawMarker(data) {
            var markerId = 1;

            if (!data || !data.response.data || data.response.data.length == 0) {
                vm.itemTitle = "Oops, it appears there is no restaurant near here.";

            } else {

                vm.total = data.response.total_row_count;
                vm.hasNextPage = vm.offset + pageLimit < vm.total;
                // we only show up-to 10 pages
                if (vm.total <= pageLimit * 10) {
                    vm.itemTitle = "We found " + vm.total + " restaurants near here.";
                } else {
                    vm.itemTitle = "There are more than 150 restaurants near here, try to search by typing the name";
                }

                var totalPage = getTotalPage(vm.total, pageLimit);
                vm.pages = [];
                for (var pageIndex = 1; pageIndex <= totalPage; pageIndex++) {
                    vm.pages.push(pageIndex);
                    if (pageIndex >= 10) {
                        break;
                    }
                }

                vm.currentPage = getCurrentPage(vm.total);
                vm.hasPrevPage = vm.currentPage > 1;
            }

            var markers = [];
            for (var idx = 0; idx < data.response.data.length; idx++) {
                var obj = data.response.data[idx];
                obj.isSelected = false;
                obj.placeIndex = vm.offset + idx + 1;
                var markerData = window.MapHelper.createRestaurantMarker(obj, markerId++, onMarkerSelected, null);
                markers.push(markerData);
                vm.items.push(obj);
            }

            $timeout(function () {
                vm.map.markers = markers;
            }, 250); // if I don't delay here, it doesn't show all the new markers 

            return vm.items;
        }

        // vm.markers has the data used to draw markers on the map
        function findMarker(factualId) {
            for (var idx = 0; idx < vm.map.markers.length; idx++) {
                if (vm.map.markers[idx].factual_id == factualId)
                    return vm.map.markers[idx];
            }

            return undefined;
        }

        // vm.items has the data used to display restaurant info in the lower part
        function findItem(factualId) {
            for (var idx = 0; idx < vm.items.length; idx++) {
                if (vm.items[idx].factual_id == factualId)
                    return vm.items[idx];
            }

            return undefined;
        }

        function initializeMarkers() {
            vm.items = [];
            vm.map.markers = [];
            vm.total = 0;
            vm.pages = [];
            vm.currentPage = 1;
            vm.hasNextPage = false;
            vm.hasPrevPage = false;
        }

        function getTotalPage(total, pageSize) {
            return window.helper.parseInt10((total + (pageSize - 1)) / pageSize);
        }

        function getCurrentPage() {
            return (vm.offset / pageLimit) + 1;
        }

        function loadSearchedResults(items) {
            vm.items = [];
            vm.map.markers = [];
            if (items.length > 0) {
                var counter = 1;
                for (var idx = 0; idx < items.length; idx++) {
                    if (window.helper.hasDuplication(items[idx], vm.items)) {
                        continue;
                    }

                    var item = items[idx];
                    item.placeIndex = counter++;
                    // the Item's properties are named differently, they are FindRestaurantResp DTO
                    var markerData = window.MapHelper.createRestaurantMarker(item, counter, onMarkerSelected, null);
                    vm.map.markers.push(markerData);
                    vm.items.push(item);
                }

                // the first one is the closet one, default is sorted by distance asc 
                vm.map.center = { latitude: items[0].latitude, longitude: items[0].longitude };

                // TODO: a better experience is to center using the user's location and connect to the closeset one 
            }

            vm.itemTitle = "We found " + vm.items.length + " restaurants matching [" + vm.searchText + "]";
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
                    dishLoader.load(item);
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
                    dishLoader.load(null);
                });
                marker.options.opacity = 0.4;
            }
        }

        function ensureUserMarker() {
            if (!vm.userMarker) {
                vm.map.userMarker = window.MapHelper.createUserMarker(vm.userCoords, onUserMarkerDragged);
            }
        }

        function onUserMarkerDragged(marker, eventName, args) {
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            var coords = { latitude: lat, longitude: lng };

            vm.userCoords = coords;
            reloadRestaurants();

            vm.map.center.latitude = lat;
            vm.map.center.longitude = lng;
        }
    }

})();
