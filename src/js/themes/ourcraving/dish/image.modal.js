(function () {
    'use strict';

    angular
        .module('app')
        .controller('ImageModalController', imageModalController);

    imageModalController.$inject = ['ModalService', 'modalItem', 'fileServer'];

    function imageModalController(modalService, modalItem, fileServer) {
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
            return window.helper.getSafePreviewImage(imgName, fileServer);
        }

        function close() {
            modalService.closeModal();
        }
    }

})();
