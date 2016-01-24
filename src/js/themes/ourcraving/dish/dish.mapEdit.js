(function () {
    'use strict';

    angular
        .module('app')
        .controller('DishMapEditController', dishMapEditController);

    dishMapEditController.$inject = ['GeoService', 'RestaurantService', 'DinerService', 'ReferenceDataService', 'FactualService', 'loader', '$timeout', '$rootScope', '$scope'];

    function dishMapEditController(geoService, restService, dinerService, refDataService, factualService, dishLoader, $timeout, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        var pageLimit = 15;

        vm.userCoords = {}; // this stores the current user's marker 
        vm.map = undefined;
        vm.mapData = undefined;
        vm.dish = dishLoader.current;
        vm.position = window.helper.getDefaultLocation();
        vm.isFilterMode = false;
        vm.userMarkerExisted = false;

        vm.selectedRestaurant = undefined;
        vm.availableRestaurants = [];
        vm.offset = 0; // factual service search offset
        vm.items = [];
        vm.total = 0; // store the total searched results 
        vm.itemTitle = ""; // title of the item panel
        vm.hasNextPage = false; // indicate if there is next page;
        vm.hasPrevPage = false;
        vm.currentPage = 1;
        vm.pages = []; // for displaying pagination
        vm.pageSize = pageLimit;

        // events
        vm.locate = locate;
        vm.getCuisine = getCuisine;
        vm.searchRestaurant = searchRestaurant;
        vm.selectRestaurant = onSelectRestaurant;
        vm.gotoPage = gotoPage;
        vm.gotoPrevPage = gotoPrevPage;
        vm.gotoNextPage = gotoNextPage;
        vm.cleanupFilter = removeFilter;

        // initialize
        activate();

        // helpers
        function activate() {

            $(document).on('map.init', function (event, data) {
                vm.map = data.map;
                vm.mapData = data;

                if ($rootScope.position) {
                    vm.position = $rootScope.position;
                } else {
                    vm.position = window.helper.getDefaultLocation();
                }

                updateCenter();
            });

            $scope.$on('onRepeatLast', function (scope, element, attrs) {
                $(".grid-tiles").freetile({
                    animate: true,
                    elementDelay: 30,
                    selector: ".grid-item",
                    callback: function () {
                        // very important, without it, the page loses scrollbar or can't scroll properly
                        $('[data-scrollable]').getNiceScroll().resize();
                    }
                });
            });
        }

        // event handlers

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

        function searchRestaurant(query) {
            if (!query || !vm.position) return;
            // should we do this? if only one char, the search might be annoying
            if (query.length <= 2) return;

            restService.find(vm.position, query).then(function (response) {
                vm.availableRestaurants = response.data.Items;
            });
        }

        function onSelectRestaurant(selected) {
            if (selected != null) {
                vm.isFilterMode = true;
                var markers = vm.mapData.container.gmap('get', 'markers');
                clearMarkers(markers);

                factualService.getByName(selected.Name, vm.position.userLocation.city).then(
                    function (data) {
                        var items = data.response.data;
                        vm.items = [];

                        var markerId = markers.length;
                        if (items.length > 0) {
                            var counter = 1;
                            for (var idx = 0; idx < items.length; idx++) {
                                if (window.helper.hasDuplication(items[idx], vm.items)) {
                                    continue;
                                }

                                var item = items[idx];
                                item.placeIndex = counter ++;
                                // the Item's properties are named differently, they are FindRestaurantResp DTO
                                var markerData = window.MapHelper.createRestaurantMarker(item, markerId);
                                var markerInst = vm.mapData.addMarker(markerId, markerData, { "draggable": false, "opacity": 0.4 });
                                markerId++;

                                markerInst.onMarkerSelected = onMarkerSelected;
                                markerInst.onMarkerDeselected = onMarkerDeselected;
                                vm.markers.push(markerData);
                                vm.items.push(item);
                            }

                            // the first one is the closet one, default is sorted by distance asc 
                            var origin = new google.maps.LatLng(items[0].latitude, items[0].longitude);
                            vm.map.setOptions({ 'center': origin });

                            // TODO: a better experience is to center using the user's location and connect to the closeset one 
                        }

                        vm.itemTitle = "We found " + vm.items.length + " locations of [" + selected.Name + "]";

                    }, function (err) {
                        window.helper.handleError(err, vm);
                        vm.hasError = true;
                    });
            } else {
                if (vm.isFilterMode) {
                    vm.isFilterMode = false;
                    updateCenter();
                }
            }
        }

        function removeFilter() {
            vm.selectedRestaurant = undefined;
            vm.isFilterMode = false;
            updateCenter();
        }

        function locate(item) {
            var marker = findMarker(item.factual_id);
            if (marker) {
                vm.mapData.iw.open(marker.idx, marker);
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
                if (p == 1)
                    vm.offset = 0;
                else
                    vm.offset = vm.offset - pageLimit * (p - 1);
            }

            reloadRestaurants();
        }

        // helpers
        function updateCenter() {
            if (!vm.userMarkerExisted) {
                vm.mapData.iw.closeCurrent();
                var markers = vm.mapData.container.gmap('get', 'markers'),
                    markerOptions = { "draggable": true },
                    markerData = window.MapHelper.createUserMarker(vm.position.coords);

                var markerInst = vm.mapData.addMarker(markers.length, markerData, markerOptions);
                google.maps.event.addListener(markerInst, 'dragend', function() { onMarkerDragged(markerInst); });
                vm.userMarkerExisted = true;
            }

            var origin = new google.maps.LatLng(vm.position.coords.latitude, vm.position.coords.longitude);
            vm.map.setOptions({ 'center': origin });
            vm.userCoords = vm.position.coords;
            reloadRestaurants(markers);
        }

        function clearMarkers(markers, all) {
            var startIdx = all? 0 : 1;
            vm.mapData.removeMarkers(startIdx, markers.length);

            initializeMarkers();
            if (all) {
                vm.userMarkerExisted = false;
            }
        }

        function loadRestaurants(markers) {
            factualService
                .searchNear(vm.userCoords.latitude, vm.userCoords.longitude, vm.offset, pageLimit)
                .then(
                function (data) {
                    drawMarker(data, markers);
                });
        }

        function reloadRestaurants(markers) {
            if (!markers) {
                markers = vm.mapData.container.gmap('get', 'markers');
            }
            clearMarkers(markers);
            loadRestaurants(markers);
        }

        function drawMarker(data, markers) {
            var startIdx = markers.length;
            var markerId = startIdx; // the first one is actually the "me"

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

            $.each(data.response.data, function (idx, obj) {
                obj.isSelected = false;
                obj.placeIndex = vm.offset + idx + 1;
                var markerData = window.MapHelper.createRestaurantMarker(obj, markerId++);
                vm.markers.push(markerData);
                vm.items.push(obj);

                var markerInst = vm.mapData.addMarker(startIdx++, markerData, { "draggable": false, "opacity": 0.4 });
                markerInst.onMarkerSelected = onMarkerSelected;
                markerInst.onMarkerDeselected = onMarkerDeselected;
            });

            return vm.items;
        }

        function onMarkerDeselected(markerInst) {
            var item = findItem(markerInst.content.factual_id);
            if (item) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = false;
                    dishLoader.load(null);
                });
            }
        }

        function onMarkerSelected(markerInst) {
            var item = findItem(markerInst.content.factual_id);
            if (item) {
                // I have to do this for the scenaio clicking from a map marker and we want to select the cell, this is a safe apply
                // the reason (I guess) the action is from another scope, which doesn't kick in the current scope's digesting
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    item.isSelected = true;
                    dishLoader.load(item);
                });
            }
        }

        // vm.markers has the data used to draw markers on the map
        function findMarker(factualId) {
            for (var idx = 0; idx < vm.markers.length; idx++) {
                if (vm.markers[idx].factual_id == factualId)
                    return vm.markers[idx];
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

        function onMarkerDragged(markerInst) {
            var lat = markerInst.getPosition().lat();
            var lng = markerInst.getPosition().lng();
            var coords = {
                latitude: lat,
                longitude: lng
            };

            vm.userCoords = coords;
            var markers = vm.mapData.container.gmap('get', 'markers');
            // VERYIMPORTANT to reset the offset in here
            vm.offset = 0;
            reloadRestaurants(markers);
            console.log('"latitude": ' + lat + ', "longitude": ' + lng);
        }

        function initializeMarkers() {
            vm.items = [];
            vm.markers = [];
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
    }

})();
