(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProposalModalController', modalProposalController);

    modalProposalController.$inject = ['ModalService', 'modalItem'];

    function modalProposalController(modalService, modalItem) {
        var vm = this;
        vm.Dish = modalItem.Dish;
        vm.Proposal = modalItem.Proposal;
        vm.AlreadyIn = modalItem.AlreadyIn || false;
        vm.proposalData = { name: ''};
        vm.message = "";

        vm.close = function() {
            modalService.closeModal();
        };

        vm.submit = function(result) {
            modalService.submitModal(result);
        };

        vm.getProposalTitle = function (proposal) {
            // this is duplicate to the proposal.my.js
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        };
    }

})();