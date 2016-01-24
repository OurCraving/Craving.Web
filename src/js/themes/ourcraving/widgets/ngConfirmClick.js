(function () {
    'use strict';

    angular
        .module('app')
        .directive('ngConfirmClick', ngConfirmClick);

    function ngConfirmClick() {
        // Usage:
        //     <button nng-confirm-click="$event.stopPropagation();getExternalScopes().delete(row);">Delete</button>
        // Creates:
        //  pops up a confirmation dialog when clicking the button 
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attr) {
            var msg = attr.confirmMsg || "Are you sure?";
            var clickAction = attr.ngConfirmClick;
            element.bind('click', function (event) {
                if (window.confirm(msg)) {
                    scope.$eval(clickAction);
                }
            });
        }
    }

})();