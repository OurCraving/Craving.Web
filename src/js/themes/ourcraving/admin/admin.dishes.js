(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminDishController', adminDishController);

    adminDishController.$inject = ['AuthService', 'AdminService', 'NavigationService', '$location', '$rootScope', '$scope'];
    function adminDishController(authService, adminService, navigationService, $location, $rootScope, $scope) {

        authService.fillAuthData();

        // properties
        var vm = this;
        $scope.viewModel = vm;

        vm.gridOptions = {
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableSorting: true,
            showGridFooter: true,
            rowsPerPage: 10,
            enablePaginationControls: true,
            enablePagination: true,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            noUnselect: true,

            onRegisterApi: function(gridApi) {
                vm.gridApi = gridApi;
            }
        };

        vm.gridOptions.columnDefs = [
            {
                name: 'Image',
                cellTemplate: '<div class="ui-grid-cell-contents" >' +
                    '<div class="panel panel-default dish-item " data-ng-click=" vm.openDetail(row.entity)">' +
                    '</div>' +
                    '<a><img ng-src="::vm.getPreviewImage(d.DishImageFileName)::" class="media-object img-dish-preview" /></a></p>' +
                    '</div>'
            },
            {
                name: 'Dish Details',
                cellTemplate: '<div class="ui-grid-cell-contents" >' +
                    '</div>'
            },
            {
                name: 'Creator',
                cellTemplate: '<div class="ui-grid-cell-contents" >' + 
                    '</div>'
            }
        ];

        // methods
        function getRecentDishes() {
            adminService.getAllRecentDishes().then(function(response) {
                vm.dishes = response.data.Items;
                vm.gridOptions.data = vm.dishes;
            });
        }

        // init
        activate();

        // event handlers 
        vm.getDinerImage = getDinerImage;
        vm.getPreviewImage = getPreviewImage;
        vm.openDetail = openDetail;
              
        vm.gridOptions.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
        };
 
        // helpers
        function activate() {
            getRecentDishes();
        }

        function getDinerImage(imgName) {
            return window.helper.getSafeAvatarImage(imgName);
        }

        function getPreviewImage(imgName) {
            return window.helper.getSafePreviewImage(imgName);
        }

        function openDetail(dish) {
            navigationService.go('detail.dish', { 'id': dish.DishId });
        }
    }
}());