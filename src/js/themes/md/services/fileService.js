(function () {
    'use strict';

    angular
        .module('app')
        .service('fileService', fileService);

    fileService.$inject = ['fileServer'];

    // this service launches and closes a modal window 
    function fileService(fileServer) {

        var service = {
            getSafePreviewImage: getSafePreviewImage,
            getSafeAvatarImage: getSafeAvatarImage
        };

        return service;

        function getSafeAvatarImage(imgName) {
            // chance is the diner has no image, which will return "Mystery" 
            if (imgName === "Mystery" || imgName === "" || imgName === undefined || imgName === null) {
                return "images/generic/generic_user.png";
            } else if (!imgName.startsWith("http://")) {
                imgName = window.helper.replaceAll(imgName, "\\", "/");
                imgName = fileServer + "/" + imgName;
            }

            return imgName;
        }

        function getSafePreviewImage(imgName) {
            if (imgName) {
                if (!imgName.startsWith("http://")) {
                    imgName = fileServer + "/" + imgName;
                }
            } else {
                imgName = "images/generic/no_image_available.png";
            }
            return imgName;
        }
    }
})();