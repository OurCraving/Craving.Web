(function () {
    'use strict';

    // angular.module('oc.services', ['ngResource'])
    var app = angular.module('app');

    app
        .constant("ocService", '@@serviceEndPoint')
        .constant("baseUrl", 'http://@@serviceEndPoint/api/v1/')
        .constant("baseUrl2", 'http://@@serviceEndPoint/api/v2/')
        .constant("authUrl", 'http://@@serviceEndPoint/api/v2/account')
        .constant("tokenUrl", 'http://@@serviceEndPoint/oauth/token')
        .constant('uploadUrl', "http://@@fileEndPoint/Uploader/UploadHandler.ashx")
        .constant('fileServer', "http://@@fileEndPoint")
        .constant('authSettings', { clientId: 'ocWeb' });
})();