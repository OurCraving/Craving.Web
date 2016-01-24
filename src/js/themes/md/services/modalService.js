(function () {
    'use strict';

    angular
        .module('app')
        .service('ModalService', modalService);

    modalService.$inject = ['$mdDialog','$mdSidenav', '$rootScope'];

    // this service launches and closes a modal window 
    function modalService($mdDialog,$mdSidenav, $rootScope) {

        var service = {
            // calling this must pass a template and a controller. this is used to open an ad-hoc modal
            openModal: openHandler,

            // this will close only modal dialogs 
            closeModal: closeModalHandler,

            // this submits the modal dialog and returns a result
            submitModal: submitModalHandler,

            toggleSidenav: toggleSidenav,
            isSidenavOpen: isSidenavOpen,
            closeSidenav: closeSidenav
    };

        return service;

        // the input: entity is something can be passed in and resolved into the modal controller if wish 
        // if skip, the modal controller can ignore this; otherwise it can load something directly without having a DB roundtrip 
        function openHandler(url, controller, entity, ev) {
            cleanupModal();
            var modalScope = $rootScope.$new(true); // creating an isolate scope
            $rootScope.modalScope = modalScope;

            modalScope.modalInstance = $mdDialog.show({
                controller: controller,
                controllerAs: 'vm',
                templateUrl: url,
                targetEvent: ev,
                locals: { modalItem: entity }
            });

            return modalScope.modalInstance;
        }

        function closeModalHandler(reason) {
            if ($rootScope.modalScope && $rootScope.modalScope.modalInstance) {
                $mdDialog.hide(reason || 'cancel');
                cleanupModal();
            }
        }

        function submitModalHandler(result) {
            if ($rootScope.modalScope && $rootScope.modalScope.modalInstance) {
                $mdDialog.hide(result || 'cancel');
                cleanupModal();
            }
        }

        function cleanupModal() {
            if ($rootScope.modalScope) {
                $rootScope.modalScope.$destroy();
                $rootScope.modalScope = null;
            }
        }

        function toggleSidenav(menuId) {
            return $mdSidenav(menuId).toggle();
        }

        function isSidenavOpen(id) {
            return $mdSidenav(id).isOpen();
        }

        function closeSidenav(menuId) {
            return $mdSidenav(menuId).close();
        }
    }
})();