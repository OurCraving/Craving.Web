(function () {
    'use strict';

    angular
        .module('app')
        .directive('onLastRepeat', onLastRepeat);

    onLastRepeat.$inject = [];

    function onLastRepeat(refService) {
        // Usage:
        //     <any ng-repeat="" on-last-repeat> 
        //      in controller: $scope.$on('onRepeatLast', function(scope, elem,ent, attrs) {});
        // Creates:
        return function (scope, element, attrs) {
            if (scope.$last)
                setTimeout(function () {
                    scope.$emit('onRepeatLast', element, attrs);
                }, 1);
        };
    }

})();