(function () {
    'use strict';

    angular
        .module('app')
        .controller('DinerDetailController', dinerDetailController);

    dinerDetailController.$inject = ['DinerService', 'ModalService', '$timeout', '$scope', '$rootScope', 'modalItem', 'fileService'];

    function dinerDetailController(dinerService, modalService, $timeout, $scope, $rootScope, modalItem, fileService) {

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
            if (modalItem && modalItem.dinerId) {
                onDinerIdLoaded(modalItem.dinerId);
            } else {
                // this allows this controller reused when we want to display a diner without a dishLoader, in that case, the 
                // diner id should appear in the url 
                var dinerId = $rootScope.$stateParams.id;
                onDinerIdLoaded(dinerId);
            }
        }

        function onDinerIdLoaded(dinerId) {
            if (!dinerId) {
                vm.message = "No diner can be loaded. The Id is missing.";
                return;
            }
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
            modalService.closeModal();
        }

        function getMemberSince(diner) {
            if (diner && diner.RegistrationDate) {
                var date = new Date(diner.RegistrationDate);
                return date.getFullYear() + "," + window.helper.getMonthName(date);
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
            return fileService.getSafeAvatarImage(imgName);
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
