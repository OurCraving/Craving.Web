(function () {
    'use strict';
    var app = angular.module('app');
    app
        .controller('AdminFilesController', adminFilesController);

    adminFilesController.$inject = ['AuthService', 'AdminService', 'fileServer'];
    function adminFilesController(authService, adminService, fileServer) {

        authService.fillAuthData();

        var vm = this;
        vm.message = '';
        
        // methods
        
        // init
        activate();

        // event handlers 
        
        // helpers
        function activate() {
            
        }
    }
}());