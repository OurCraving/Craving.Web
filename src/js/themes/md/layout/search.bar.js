(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchBarController', searchBarController);

    searchBarController.$inject = ['CravingService', 'ReferenceDataService', 'NavigationService', '$rootScope', '$scope'];

    function searchBarController(cravingService, refService, navigationService, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Search Cravings';
        vm.input = $rootScope.$stateParams.criteria;
        vm.selectedCravings = [];
        vm.cravings = [];
        vm.searchText = null;
        vm.selectedItem = null;
        vm.showSearch = false;

        // events
        vm.querySearch = querySearch;

        activate();
        var oldInput = "";
        var stateChangedSubscribed;

        function activate() {
            vm.position = $rootScope.position;
            checkSearch();

            refService.getData("cravingtype").then(function (response) {
                vm.cravings = response.Items.map(function (c) { return c.Name; });
            });

            // this is important, coz the header has only one instance
            $scope.$on('$stateChangeSuccess', newSearch);

            $scope.$watchCollection('vm.selectedCravings', function (newVal, oldVal) {
                // we don't need to worry about the value, only the length is fine 
                if (angular.isArray(oldVal) && oldVal.length !== newVal.length) {
                    if (newVal.length === 0) {
                        navigationService.go('app.home');
                    } else {
                        var currentCriteria = vm.selectedCravings.join('+');
                        $rootScope.$stateParams.criteria = currentCriteria;
                        navigationService.go('app.home.search', { 'criteria': currentCriteria });
                    }
                }
            });
        }

        function newSearch() {
            stateChangedSubscribed = true;
            vm.input = $rootScope.$stateParams.criteria;
            checkSearch();
        }

        function checkSearch() {
            if (vm.input === undefined || vm.input.trim().length === 0) {
                vm.selectedCravings = [];
                vm.showSearch = false;
            }
            else if (vm.input !== oldInput) {
                vm.selectedCravings = vm.input.split("+");
                vm.showSearch = true;
            }

            // do not unsubscribe it, coz the header doesn't change
            //if (stateChangedSubscribed) {
            //    $scope.$off('$stateChangeSuccess', newSearch);
            //}
        }

        function querySearch(query) {
            var results = query ? vm.cravings.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(craving) {
                return (craving.toLowerCase().indexOf(lowercaseQuery) === 0);
            };
        }
    }
})();
