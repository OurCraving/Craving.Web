(function () {
    'use strict';

    angular
        .module('app')
        .controller('ImageModalController', imageModalController);

    imageModalController.$inject = ['ModalService', 'modalItem', 'fileService'];

    function imageModalController(modalService, modalItem, fileService) {
        var vm = this;
        vm.message = "";
        vm.entity = undefined;
        vm.getImageSrc = getImageSrc;
        vm.close = close;

        // initialize
        activate();

        // helpers
        function activate() {
            vm.entity = modalItem;
        }

        function getImageSrc(imgName) {
            return fileService.getSafePreviewImage(imgName);
        }

        function close() {
            modalService.closeModal();
        }
    }

})();
