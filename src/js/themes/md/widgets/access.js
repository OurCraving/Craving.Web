(function () {
    'use strict';

    angular
        .module('app')
        .directive('access', access);

    access.$inject = ['AuthService'];

    function access(authService) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        function link($scope, element, attrs) {

            var roles = attrs.access.toLowerCase().split(',').map(function (s) { return s.trim(); });
            var reverse = attrs.reverse || false;

            var showElement = function() {
                element.removeClass('hidden');
            };

            var hideElement = function() {
                element.addClass('hidden');
            };

            var determineAccess = function() {
                var hasAccess = authService.authorize(roles, attrs.roleCheckType);

                if (hasAccess) {
                    if (reverse) {
                        hideElement();
                    } else {
                        showElement();
                    }
                } else {
                    if (reverse) {
                        showElement();
                    } else {
                        hideElement();
                    }
                }
            };

            if (roles.length > 0) {
                determineAccess();
            }
        }        
    }

})();