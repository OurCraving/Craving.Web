(function () {
    'use strict';

    angular
        .module('app')
        .controller('CravingTagsController', cravingTagsController);

    cravingTagsController.$inject = ['CravingService', 'NavigationService', '$rootScope', '$scope'];

    function cravingTagsController(cravingService, navigationService, $rootScope, $scope) {
        /* jshint validthis:true */
        var vm = this;
        var pageSize = 20;

        // properties 
        vm.offset = 0;
        vm.all = [];
        vm.cravings = [];
        vm.cravingStyles = [];
        vm.hasMore = false;
        
        // events
        vm.search = searchHandler;
        vm.loadMore = loadMore;

        activate();

        function activate() {
            vm.position = $rootScope.position;
            loadTrendingForLocation(vm.position.coords.latitude + "," + vm.position.coords.longitude);
            $scope.updatePageTitle('OurCraving - where you find your cravings');
        }

        function loadTrendingForLocation(location) {
            cravingService.getTrending(location).then(function (response) {
                // TODO: this array contains searchtimes, but now we are not using it, so just trim to string only
                vm.all = $.map(response.data.Items, function (val) { return val.CravingTag; });
                vm.offset = 0;
                loadMore();
            }, function (err) {
                vm.cravings = getDefaultCravings();
                getRandomCravingStyle();
            });
        }

        function loadMore() {
            var currentOffset = vm.offset + pageSize;
            vm.cravings = vm.all.slice(0, currentOffset);
            vm.offset = currentOffset;
            vm.hasMore = vm.offset < vm.all.length;
            getRandomCravingStyle();
        }

        // this is only here, if we failed to retrieve from service
        // but again, why bother, we should find a different approach to handle error
        function getDefaultCravings() {
            return ["Beef", "Pork", "Chicken", "Cheese", "Chocalate", "Sweet", "Fish", "Shrimp", "Ramen", "Beer", "Lamb", "Pork Belly",
                "Bacon", "Taco", "Coffee", "Spicy", "Sandwich", "Soup", "Noodle", "Nuts", "Ice Cream", "Pasta", "Seafood", "Udon",
                "Deep Fry", "Candy", "Cake", "Dessert", "Pho", "Rice", "Spaghetti", "Bean", "Mashed Potatoes", "Salami", "Tomatillo",
                "Lemon", "Green Tea", "Hummus", "Eggplant", "Cayenne Pepper"];
        }

        function getRandomCravingStyle() {
            vm.cravingStyles = [];
            for (var idx = 0; idx < vm.cravings.length; idx ++) {
                vm.cravingStyles.push(shouldPrimary() ? 'md-primary' : 'md-accent');
            }
        }

        function searchHandler(criteria) {
            var idx = getCriteriaIndex(criteria);
            var isSelected = idx >= 0;
            if (isSelected) {
                removeCriteria(criteria, idx);
            } else {
                addCriteria(criteria);
            }

            performSearch();
        }

        function removeCriteria(criteria, idx) {
            if (idx >= 0) {
                var currentCriteria = $rootScope.$stateParams.criteria;
                currentCriteria = currentCriteria.replace(criteria + "+", "");
                currentCriteria = currentCriteria.replace("+" + criteria, "");
                currentCriteria = currentCriteria.replace(criteria, "");
                $rootScope.$stateParams.criteria = currentCriteria;
            }
        }

        function addCriteria(criteria) {
            if ($rootScope.$stateParams.criteria && $rootScope.$stateParams.criteria.length > 0) {
                $rootScope.$stateParams.criteria = $rootScope.$stateParams.criteria + "+" + criteria;
            }
            else
                $rootScope.$stateParams.criteria = criteria;
        }

        function getCriteriaIndex(criteria) {
            if ($rootScope.$stateParams.criteria) {
                var currentCriteria = $rootScope.$stateParams.criteria;
                var idx = currentCriteria.indexOf(criteria);
                return idx;
            }

            return -1;
        }

        function performSearch() {
            var currentCriteria = $rootScope.$stateParams.criteria;
            if (currentCriteria.length < 1) {
                navigationService.go('app.home');
            } else {
                var param = buildCriteria(currentCriteria);
                navigationService.go('app.home.search', { 'criteria': param });
            }
        }

        function buildCriteria(currentCriteria) {
            return currentCriteria;
        }

        function shouldPrimary() {
            var should = window.helper.randomInt(20) === 10;
            return should;
        }
    }
})();
