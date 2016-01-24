(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchCravingController', searchCravingController);

    searchCravingController.$inject = ['CravingService',  'NavigationService', '$rootScope','$scope'];

    function searchCravingController(cravingService, navigationService, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Search Cravings';
        vm.searchResults = [];
        vm.input = $rootScope.$stateParams.criteria;
        vm.searchText = "";

        // events
        vm.getDinerImage = getDinerImage;
        vm.getPreviewImage = getPreviewImage;
        vm.formateDate = formateDate;
        vm.openDetail = openDetail;

        activate();
        var oldInput = "";

        function activate() {
            vm.position = $rootScope.position;
            $scope.$watch('vm.input', function () {
                if (vm.input === undefined || vm.input.trim().length === 0) {
                    vm.searchResults = [];
                }
                else if (vm.input !== oldInput) {
                    performSearch();
                }
            });
        }

        function performSearch() {
            var param = window.helper.replaceAll(vm.input, '+', ',');
            vm.searchText = param;

            var city = $rootScope.position.userLocation.city;
            var location = $rootScope.position.coords.latitude + "," + $rootScope.position.coords.longitude;
            cravingService.searchCraving(param, city, location).then(function (response) {
                vm.searchResults = response.data.Items;
                oldInput = vm.input;
            });
        }

        function getDinerImage(imgName) {
            return window.helper.getSafeAvatarImage(imgName);
        }

        function getPreviewImage(url) {
            return window.helper.getSafePreviewImage(url);
        }

        function openDetail(dish, md) {
            if (md) {
                navigationService.go('dish.detail', { 'id': dish.DishId });
            } else {
                navigationService.go('detail.dish', { 'id': dish.DishId });
            }
        }

        function formateDate(d) {
            if (d)
                return window.helper.getPostDateDescription(d);
            return "";
        }
    }
})();
