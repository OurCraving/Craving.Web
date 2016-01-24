(function () {
    'use strict';

    angular
        .module('app')
        .directive('cravingSelect', cravingSelect);

    cravingSelect.$inject = ['ReferenceDataService', '$timeout'];

    function cravingSelect(refService, $timeout) {
        // Usage:
        //     <cravingSelect></cravingSelect>
        // Creates:
        var directive = {
            templateUrl: 'widgets/cravingSelect.tpl.html',
            restrict: 'E',
            replace: true,
            scope: {
                selectedCraving: "="
            },
            link: link
        };

        return directive;

        function link($scope, element, attrs) {
            $scope.cravings = [];
            $scope.local = {};

            refService.getData("cravingtype").then(function (response) {
                $scope.cravings = response.Items.sort(function (a, b) {
                    return a.Name > b.Name;
                });
                setLocalSelection();
            });

            // this is a hack, because this directive is loaded before the page is loaded
            // the selected is only loaded after the page is loaded, so the directive can't display the selected items 
            $scope.$watch("selectedCraving", function () {
                if ($scope.selectedCraving.length === 0) {
                    var timer1 = $timeout(function () {
                        $timeout.cancel(timer1);
                        $scope.local.selected = undefined;
                    });
                }
                else if ($scope.selectedCraving.length > 0 && $scope.local.selected === undefined ) {
                    var timer2 = $timeout(function () {
                        $timeout.cancel(timer2);
                        setLocalSelection();
                    });
                }
            });

            // I honestly don't know why I have to do this, I was expecting "=" is a 2-way binding and as long as I use ng-model (tried),
            // it should automatically update the creator. but I spent a few hours and couldn't get it work. 
            // so I have to manually update this variable
            $scope.selectCraving = function (item, model) {

                var idx = findItem(item.Id);
                if (idx < 0) {
                    $scope.selectedCraving.push({ CravingId: item.Id });
                }
            };

            $scope.removeCraving = function (item, model) {
                var idx = findItem(item.Id);
                if (idx >= 0) {
                    $scope.selectedCraving.splice(idx, 1);
                }
            };

            function findItem(id) {
                for (var idx = 0; idx < $scope.selectedCraving.length; idx++) {
                    if ($scope.selectedCraving[idx].CravingId === id) {
                        return idx;
                    }
                }
                return -1;
            }

            function setLocalSelection() {
                // can we do better in here?
                $scope.local.selected = [];
                if ($scope.selectedCraving.length > 0) {
                    for (var i = 0; i < $scope.selectedCraving.length; i++) {
                        for (var j = 0; j < $scope.cravings.length; j++) {
                            if ($scope.selectedCraving[i].CravingId === $scope.cravings[j].Id) {
                                $scope.local.selected.push($scope.cravings[j]);
                                break;
                            }
                        }
                    }
                }
            }
        } // end link
    }

})();