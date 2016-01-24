(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminModerationModalController', modalAdminModerationController);

    modalAdminModerationController.$inject = ['ModalService', 'modalItem'];

    function modalAdminModerationController(modalService) {
        var vm = this;
        vm.message = '';
        vm.reasonData = { reason: '' };

        vm.close = function () {
            modalService.closeModal();
        };

        vm.submit = function (result) {
            if (!result.reason || result.reason.trim() === "") {
                vm.savedSuccessfully = false;
                vm.message = "Please enter a reason before submitting this moderation request.";
                return false;
            }

            modalService.submitModal(result);
        };
    }
})();