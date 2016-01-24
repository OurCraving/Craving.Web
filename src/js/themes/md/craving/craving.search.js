(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchCravingController', searchCravingController);

    searchCravingController.$inject = ['CravingService', 'NavigationService', '$rootScope', '$scope', 'fileService'];

    function searchCravingController(cravingService, navigationService, $rootScope, $scope, fileService) {
        /* jshint validthis:true */
        var iconIdx = 0;
        var vm = this;
        vm.title = 'Search Cravings';
        vm.searchResults = [];
        vm.input = $rootScope.$stateParams.criteria;
        vm.searchText = "";
        vm.searching = false;
        vm.addDishIcons = ['add', 'restaurant_menu'];
        vm.addDishIcon = vm.addDishIcons[iconIdx];
        vm.currentPage = 1;
        vm.resultTotal = 1;
        vm.hasMore = false;

        // events
        vm.getDinerImage = getDinerImage;
        vm.getPreviewImage = getPreviewImage;
        vm.formateDate = formateDate;
        vm.openDetail = openDetail;
        vm.loadMore = loadMore;

        activate();
        var oldInput = "";

        function activate() {
            vm.position = $rootScope.position;
            vm.currentPage = 1;
            vm.resultTotal = 0;
            vm.loaded = 0;
            vm.hasMore = false;
            $scope.$watch('vm.input', function () {
                if (vm.input === undefined || vm.input.trim().length === 0) {
                    vm.searchResults = [];
                }
                else if (vm.input !== oldInput) {
                    vm.searchResults = [];
                    performSearch();
                }
            });

            setIcons();
            fixMaterialTemp();
        }

        function loadMore() {
            if (!vm.hasMore) return;
            vm.currentPage++;
            performSearch();
        }

        function performSearch() {
            vm.searching = true;
            var param = window.helper.replaceAll(vm.input, '+', ',');
            vm.searchText = param;

            var city = $rootScope.position.userLocation.city;
            var location = $rootScope.position.coords.latitude + "," + $rootScope.position.coords.longitude;
            cravingService.searchCraving(param, city, location, vm.currentPage).then(function (response) {
                vm.resultTotal = response.data.Total;
                if (vm.searchResults.length === 0) {
                    vm.searchResults = response.data.Items;
                } else {
                    vm.searchResults = vm.searchResults.concat(response.data.Items);
                }

                oldInput = vm.input;
                vm.searching = false;
                vm.hasMore = (vm.searchResults.length < vm.resultTotal);
            }, function(err) {
                vm.searching = false;
            });
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function getPreviewImage(url) {
            return fileService.getSafePreviewImage(url);
        }

        function openDetail(dish) {
            navigationService.go('dish.detail', { 'id': dish.DishId });
        }

        function formateDate(d) {
            if (d)
                return window.helper.getPostDateDescription(d);
            return "";
        }

        function setIcons() {
            setInterval(function () {
                if (iconIdx === 0) {
                    iconIdx = 1;
                } else {
                    iconIdx = 0;
                }
                vm.addDishIcon = vm.addDishIcons[iconIdx];
                $scope.$apply();
            }, 5000);
        }

        // material has a bug that once selecting more than 1 chip, a mask added to the page is not removed. 
        // it's reported to github already, but don't know who is fixing it. now this is a temp fix to make sure the app still function
        function fixMaterialTemp() {
            var result = document.getElementsByClassName("md-scroll-mask");
            var elements = angular.element(result);
            angular.forEach(elements, function (ele) {
                ele.remove();
            });
        }
    }
})();
