(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecentCravingController', recentCravingController);

    recentCravingController.$inject = ['CravingService', 'NavigationService', '$rootScope'];

    function recentCravingController(cravingService, navigationService,  $rootScope) {
        /* jshint validthis:true */
        var vm = this;

        // properties
        vm.title = "Recent Cravings";
        vm.dishes = [];
        vm.position = null;

        // events
        vm.getDinerImage = getDinerImage;
        vm.getPreviewImage = getPreviewImage;
        vm.openDetail = openDetail;
        vm.craveForIt = craveForIt;

        activate();

        function activate() {
            vm.position = $rootScope.position;
            getRecent();
        }

        function getRecent() {
            // TODO: need to store paging parameters somewhere
            cravingService.getRecent($rootScope.position.userLocation.city).then(function (response) {
                vm.dishes = response.data.Items;
            });
        }

        function getDinerImage(imgName) {
            return window.helper.getSafeAvatarImage(imgName);
        }

        function openDetail(dish) {
            navigationService.go('detail.dish', { 'id': dish.DishId });
        }

        function craveForIt(dish, $event) {
            alert("I like it!");
            $event.preventDefault();
            $event.stopPropagation();
        }

        function getPreviewImage(url) {
            return window.helper.getSafePreviewImage(url);
        }
    }
})();
