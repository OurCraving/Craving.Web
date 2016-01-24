(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminUserController', adminReviewController);

    adminReviewController.$inject = ['AuthService', 'AdminService', 'fileService'];
    function adminReviewController(authService, adminService, fileService) {

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
        function getRecentUsers() {
            adminService.getAllRecentUsers(vm.query.page, vm.query.limit).then(function (response) {
                vm.users = response.data.Items;
                vm.total = response.data.Total;
            });
        }

        // init
        activate();

        // event handlers 
        vm.getDinerImage = getDinerImage;

        // helpers
        function activate() {
            getRecentUsers();
        }

        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }
    }
}());