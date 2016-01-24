(function () {
    'use strict';

    angular
        .module('app')
        .directive('fileField', fileField);

    fileField.$inject = ['$parse'];

    function fileField($parse) {
        return {
            require: 'ngModel',
            restrict: 'E',
            scope: {
                onFileRead: '&',
                preview: '='
            },
            link: function (scope, element, attrs, ngModel) {
                //set default bootstrap class
                //if (!attrs.class && !attrs.ngClass) {
                //    element.addClass('md-button md-raised');
                //}

                var field = element.find('input');

                field.bind('change', function (event) {
                    scope.$evalAsync(function () {
                        ngModel.$setViewValue(event.target.files[0]);
                        if (attrs.preview) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                scope.$evalAsync(function () {
                                    scope[attrs.preview] = e.target.result;
                                    scope.preview = e.target.result;
                                });

                                scope.$apply(function () {
                                    if (scope.onFileRead) {
                                        scope.onFileRead({
                                            file: event.target.files[0],
                                            content: e.target.result
                                        });
                                    }
                                });

                                //if (attrs.onFileRead) {
                                //    var callback = $parse(attrs.onFileRead);
                                //    callback(event.target.files[0], e.target.result);
                                //}

                            };
                            reader.readAsDataURL(event.target.files[0]);
                        }
                    });
                });

                field.bind('click', function (e) {
                    e.stopPropagation();
                });

                element.bind('click', function (e) {
                    e.preventDefault();
                    field[0].click();
                });
            },
            template: '<button class="md-button md-raised" type="button"><ng-transclude></ng-transclude><input type="file" style="display:none"></button>',
            replace: true,
            transclude: true
        };
    }

})();
