(function () {
    "use strict";

    angular.module('app')

        .constant('toastr', toastr)
        .constant('uploadUrl', "http://localhost:54991/Uploader/UploadHandler.ashx")
        .controller('MainController', ['$scope', '$state',
            function ($scope, $state) {
                $scope.app = {
                    settings: {
                        htmlClass: ''
                    }
                };

                $scope.$state = $state;

            } ]);

})();
