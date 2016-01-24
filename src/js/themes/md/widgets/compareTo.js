(function () {
    'use strict';

    angular
        .module('app')
        .directive('compareTo', compareTo);

    compareTo.$inject = [];

    function compareTo() {
        // Usage:
        //     <input type="password" name="confirmPassword" ng-model="registration.user.confirmPassword" required compare-to="registration.user.password" />
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }

})();