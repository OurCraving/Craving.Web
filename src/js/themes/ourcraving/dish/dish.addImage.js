(function () {
    'use strict';

    // this controller is used in a modal window for uploading a new image to an existing dish
    angular
        .module('app')
        .controller('DishAddImageController', dishAddImageController);

    dishAddImageController.$inject = ['ModalService','$http', 'uploadUrl', 'modalItem'];

    function dishAddImageController(modalService, $http, uploadUrl, modalItem) {
        var vm = this;
        vm.uploadImage = '';
        vm.dish = modalItem.Dish;
        vm.message = "";
        vm.onFileRead = onFileRead;

        vm.resetUpload = function () {
            vm.uploadImage = '';
            vm.message = '';
        };

        vm.close = function () {
            modalService.closeModal();
        };

        vm.submit = function () {
            if (vm.uploadImage && vm.uploadImage !== "") {
                uploadImage(vm.dish.DishId);
            } else {
                vm.message = "No image is selected to upload";
            }
        };

        function onFileRead(file, content) {
            guardImage(file);
        }

        function uploadImage(id) {

            var file = vm.uploadImage;

            if (!guardImage(file))
                return;

            // when we upload, don't specify the path, the uploader will figure it out by "type"
            var fd = new FormData();
            fd.append('file', file);
            fd.append('id', id);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
                .success(function (data) {
                    modalService.submitModal(data);
                })
                .error(function (err) {
                    window.helper.handleError(err, vm, "Failed to upload photos due to:");
                });
        }

        function guardImage(file) {
            if (file.size > 5000000) {
                vm.fileInvalid = true;
            } else {
                vm.fileInvalid = false;
            }

            if (vm.fileInvalid) {
                vm.message = "Image size is too big... must be less than 5 MB.";
            }

            return !vm.fileInvalid;
        }
    }

})();