(function () {
    'use strict';

    angular
        .module('app')
        .controller('DinerDetailController', dinerDetailController);

    dinerDetailController.$inject = ['dinerLoader', 'DinerService', '$timeout', '$scope', '$rootScope'];

    function dinerDetailController(loader, dinerService, $timeout, $scope, $rootScope) {

        var vm = this;
        vm.message = "";
        vm.diner = undefined;
        vm.recentCravings = [];
        vm.recentDishes = [];
        vm.recentReviews = [];
        vm.dislikes = [];

        // events
        vm.close = close;
        vm.getMemberSince = getMemberSince;
        vm.formateDate = formateDate;
        vm.getDinerImage = getDinerImage;

        // initialize
        activate();

        // helpers
        function activate() {
            // a dishLoader is used when opening a dish detail page, the diner page is a sidebar, we need to loader to tell 
            // us which diner to open 
            if (loader) {
                loader.addLoadedEventListener(onDinerIdLoaded);
            } else {
                // this allows this controller reused when we want to display a diner without a dishLoader, in that case, the 
                // diner id should appear in the url 
                var dinerId = $rootScope.$stateParams.id;
                if (dinerId) {
                    onDinerIdLoaded(dinerId);
                } else {
                    
                }
            }
        }

        function onDinerIdLoaded(dinerId) {
            if (!dinerId) return;
            dinerService.get(dinerId).then(
                function (response) {
                    vm.diner = response.data;
                    vm.dislikes = vm.diner.Dislikes;
                    loadAdditionalData();
                },
                function (err, status) {
                    window.helper.handleError(err, vm, "Cannot load user: ", status);
                });
        }

        function close() {
            window.sidebar.close('sidebar-agent', { effect: "st-effect-1", duration: 550, overlay: true });
        }

        function getMemberSince(diner) {
            if (diner && diner.RegistrationDate) {
                var date = new Date(diner.RegistrationDate);
                return date.getYear() + "," + window.helper.getMonthName(date);
            } else {
                return "";
            }
        }

        function formateDate(d) {
            if (d)
                return window.helper.getPostDateDescription(d);

            return "";
        }

        function getDinerImage(imgName) {
            return window.helper.getSafeAvatarImage(imgName);
        }

        // helpers
        function loadAdditionalData() {
            loadRecentCravings();
            loadRecentReviews();
            loadRecentAddedDishes();
        }

        function loadRecentCravings() {
            vm.recentCravings = [];
            dinerService.getRecentCravings(vm.diner.Id).then(
                function (response) {
                    vm.recentCravings = response.data.Items;
                });
        }

        function loadRecentReviews() {
            vm.recentReviews = [];
            dinerService.getRecentReviews(vm.diner.Id).then(
                function (response) {
                    vm.recentReviews = response.data.Items;
                });
        }

        function loadRecentAddedDishes() {
            vm.recentDishes = [];
            dinerService.getRecentAddedDishes(vm.diner.Id).then(
                function (response) {
                    vm.recentDishes = response.data.Items;
                });
        }
    }

})();
