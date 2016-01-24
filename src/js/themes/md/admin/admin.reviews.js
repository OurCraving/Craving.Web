(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminReviewController', adminReviewController);

    adminReviewController.$inject = ['AuthService', 'AdminService', 'NavigationService', 'ModalService', 'fileService'];
    function adminReviewController(authService, adminService, navigationService, modalService, fileService) {

        authService.fillAuthData();

        var vm = this;
        vm.message = '';
        // properties
        vm.query = {
            filter: '',
            order: 'date',
            limit: 20,
            page: 1
        };

        // methods
        function getRecentReviews() {
            adminService.getAllRecentReviews(vm.query.page, vm.query.limit).then(function (response) {
                vm.reviews = response.data.Items;
                vm.total = response.data.Total;
            });
        }

        // init
        activate();

        // event handlers 
        vm.openDishDetail = openDishDetail;
        vm.getDinerImage = getDinerImage;
        vm.removeReview = removeReview;

        // helpers
        function activate() {
            getRecentReviews();
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function openDishDetail(dishId) {
            navigationService.go('dish.detail', { 'id': dishId });
        }

        function removeReview(reviewId) {
            modalService.openModal('admin/moderation_reason_modal.html', 'AdminModerationModalController').then(function (data) {
                if (data && data !== 'cancel' && data.reason) {
                    adminService.removeReview(reviewId, data.reason).then(function () {
                        getRecentReviews();
                    });
                }
            });
        }
    }
}());