(function () {
    'use strict';

    angular
        .module('app')
        .service('ModalService', modalService);

    modalService.$inject = ['$modal', '$rootScope'];

    // this service launches and closes a modal window 
    function modalService($modal, $rootScope) {

        var service = {
            // calling this must pass a template and a controller. this is used to open an ad-hoc modal
            openModal: openHandler,

            // this will close only modal dialogs 
            closeModal: closeModalHandler,

            // this submits the modal dialog and returns a result
            submitModal: submitModalHandler,
            toggleSidenav: toggleSidenav
        };

        return service;

        // the input: entity is something can be passed in and resolved into the modal controller if wish 
        // if skip, the modal controller can ignore this; otherwise it can load something directly without having a DB roundtrip 
        function openHandler(url, controller, backdrop, size, entity) {
            cleanupModal();
            var modalScope = $rootScope.$new(true); // creating an isolate scope
            $rootScope.modalScope = modalScope;
            modalScope.modalInstance = $modal.open({
                templateUrl: url,
                controller: controller,
                controllerAs: 'vm',
                backdrop: backdrop || 'static',
                size: size,
                resolve: {
                    modalItem: function() {
                        return entity;
                    }
                }
                // NOTE: AngularJS 1.4 will have trouble if a modal is animated!
                //animation : false
            });

            return modalScope.modalInstance;
        }

        function closeModalHandler(reason) {
            if ($rootScope.modalScope && $rootScope.modalScope.modalInstance) {
                $rootScope.modalScope.modalInstance.close(reason || 'cancel');
                cleanupModal();
            }
        }

        function submitModalHandler(result) {
            $rootScope.modalScope.modalInstance.close(result);
            cleanupModal();
        }

        function cleanupModal() {
            if ($rootScope.modalScope) {
                $rootScope.modalScope.$destroy();
                $rootScope.modalScope = null;
            }
        }

        function toggleSidenav() {
            // does nothing in this theme
        }
    }
})();