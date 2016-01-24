(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminCravingTagsController', adminCravingTagsController);

    adminCravingTagsController.$inject = ['AuthService', 'AdminService', 'NavigationService', 'ModalService'];
    function adminCravingTagsController(authService, adminService, navigationService, modalService) {

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
        function getCravingTags() {
            adminService.getAllCravingTags(vm.query.page, vm.query.limit).then(function (response) {
                vm.tags = response.data.Items;
                vm.total = response.data.PageSize * response.data.PageCount;
            });
        }

        // init
        activate();

        // event handlers 
        vm.onPaginationChange = onPaginationChange;
        vm.disableTag = disableTag;
        vm.enableTag = enableTag;

        // helpers
        function activate() {
            getCravingTags();
        }

        function onPaginationChange(page, limit) {
            vm.query.page = page;
            vm.query.limit = limit;
            getCravingTags();
        }

        function disableTag(tagId) {
            adminService.updateCravingTag(tagId, false).then(function () {
                getCravingTags();
            });
        }

        function enableTag(tagId) {
            adminService.updateCravingTag(tagId, true).then(function () {
                getCravingTags();
            });
        }
    }
}());