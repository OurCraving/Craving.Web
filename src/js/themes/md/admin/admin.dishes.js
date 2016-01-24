(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminDishController', adminDishController);

    adminDishController.$inject = ['AuthService', 'AdminService', 'NavigationService', 'ModalService', 'fileService'];
    function adminDishController(authService, adminService, navigationService, modalService, fileService) {

        authService.fillAuthData();

        // properties
        var vm = this;
        vm.message = '';
        vm.query = {
            filter: '',
            order: 'date',
            limit: 20,
            page: 1
        };

        // methods
        function getRecentDishes() {
            adminService.getAllRecentDishes(vm.query.page, vm.query.limit).then(function (response) {
                vm.dishes = response.data.Items;
                vm.total = response.data.PageSize * response.data.PageCount;
            });
        }

        // init
        activate();

        // event handlers 
        vm.getDinerImage = getDinerImage;
        vm.getPreviewImage = getPreviewImage;
        vm.openDetail = openDetail;
        vm.onPaginationChange = onPaginationChange;
        vm.removeDish = removeDish;

        // helpers
        function activate() {
            getRecentDishes();
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function getPreviewImage(imgName) {
            return fileService.getSafePreviewImage(imgName);
        }

        function openDetail(dish) {
            navigationService.go('dish.detail', { 'id': dish.DishId });
        }

        function onPaginationChange(page, limit) {
            vm.query.page = page;
            vm.query.limit = limit;
            getRecentDishes();
        }

        function removeDish(dishId) {
            modalService.openModal('admin/moderation_reason_modal.html', 'AdminModerationModalController').then(function (data) {
                if (data && data !== 'cancel' && data.reason) {
                    adminService.removeDish(dishId, data.reason).then(function () {
                        getRecentDishes();
                    });
                }
            });
        }
    }
}());