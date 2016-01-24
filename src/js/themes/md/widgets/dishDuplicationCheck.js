(function () {
    'use strict';

    angular
        .module('app')
        .directive('dishDuplicationCheck', duplicationCheck);

    duplicationCheck.$inject = ['RestaurantService'];

    function duplicationCheck(restService) {
        // Usage:
        //     <input dish-duplication-check="vm.dish.restaurantName" ng-model="vm.dish.name" />

        var running;
        return {
            require: "ngModel",
            scope: {
                restaurantName: "=dishDuplicationCheck"
            },
            link: function (scope, element, attributes, ngModel) {

                //ngModel.$validators.dishDuplicationCheck = function (modelValue) {
                //    runValidation(modelValue);
                //};

                element.on('blur', function() {
                    runValidation(ngModel.$modelValue);
                });

                scope.$watch("restaurantName", function () {
                    if (running) clearTimeout(running);
                    runValidation(ngModel.$modelValue);
                });

                function runValidation(modelValue) {
                    if (modelValue !== undefined && modelValue !== "" &&
                        scope.restaurantName !== undefined && scope.restaurantName != '') {
                        running = setTimeout(function () {
                            restService.getDishByName(scope.restaurantName, modelValue).success(function (data) {
                                ngModel.$setValidity('dishDuplicationCheck', data.Items.length == 0);
                            });
                        }, 200);
                    }

                }
            }
        };
    }

})();