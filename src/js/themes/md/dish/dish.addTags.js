(function () {
    'use strict';

    // this controller is used in a modal window for adding craving tags to an existing dish
    angular
        .module('app')
        .controller('DishAddTagsController', dishAddTagsController);

    dishAddTagsController.$inject = ['ModalService', 'modalItem'];

    function dishAddTagsController(modalService, modalItem) {
        var vm = this;
        vm.dish = modalItem.Dish;
        vm.message = "";
        vm.selectedCravings = vm.dish.Cravings.map(function (c) { return c.CravingId; });

        vm.close = function () {
            modalService.closeModal();
        };

        vm.submit = function (result) {
            if (result.length === 0) {
                vm.message = "Cannot remove all craving tags, unless you are an administrator";
            } else {
                modalService.submitModal(result);
            }
        };
    }

})();