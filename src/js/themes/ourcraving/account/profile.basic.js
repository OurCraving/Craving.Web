(function () {
    'use strict';

    angular.module('app')
        .controller('ProfileBasicInformationController', profileBasicInformationController);

    profileBasicInformationController.$inject = ['AuthService', 'DinerService', 'ModalService', '$location', '$http', 'uploadUrl', 'fileServer'];
    function profileBasicInformationController(authService, dinerService, modalService, $location, $http, uploadUrl, fileServer) {
        var vm = this;

        // properties
        vm.title = "Basic Information";
        vm.savedSuccessfully = false;
        vm.message = "";
        vm.data = dinerService.profile;
        vm.isBusy = false;
        vm.uploadingFile = "";
        vm.canDeleteAvatar = false;
        vm.isDirty = false;

        // methods
        vm.submit = submitHandler;
        vm.deleteAvatar = deleteHandler;
        vm.resetUpload = resetHandler;
        vm.toggleSidenav = toggleSidenav;
        vm.getDinerImage = getDinerImage;

        // initializer
        init();

        // event handlers 
        function init() {
            // must load the authentication data first
            authService.fillAuthData();
            dinerService.getMyProfile().then(function () {
                vm.data = dinerService.profile;
                if (vm.data.avatar !== "" && vm.data.avatar !== window.helper.getSafeAvatarImage()) {
                    vm.canDeleteAvatar = true;
                }
            });
        }

        function submitHandler() {
            if (vm.uploadingFile && vm.uploadingFile !== "") {
                var file = vm.uploadingFile;

                // when we upload, don't specify the path, the uploader will figure it out by "type"
                var filename = authService.authentication.uid + "-" + file.name;

                var fd = new FormData();
                fd.append('filename', filename);
                fd.append('file', file);
                fd.append('type', 'user');

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function (data) {
                        //do something on success
                        vm.data.avatar = data;
                        vm.uploadingFile = "";
                        vm.canDeleteAvatar = true;
                        saveProfile();
                    })
                    .error(function (err) {
                        window.helper.handleError(err, vm, "Failed to upload photos due to:");
                    });
            } else {
                saveProfile();
            }
        }

        function saveProfile() {
            dinerService.updateMyProfile().then(
               function () {
                   vm.isBusy = false;
                   vm.savedSuccessfully = true;
                   vm.message = "Your profile has been updated.";

                   if (vm.data.displayName !== authService.authentication.displayName) {
                       authService.authentication.displayName = vm.data.displayName;
                   }
               },
               function (err) {
                   window.helper.handleError(err, vm, "Failed to save profile due to:");
               });
        }

        function deleteHandler() {
            vm.data.avatar = window.helper.getSafeAvatarImage();
            vm.canDeleteAvatar = false;
            vm.isDirty = true;
        }

        function resetHandler() {
            vm.uploadingFile = "";
        }

        function toggleSidenav(menuId) {
            modalService.toggleSidenav(menuId);
        }

        function getDinerImage(imgName) {
            return window.helper.getSafeAvatarImage(imgName, fileServer);
        }
    }

}());