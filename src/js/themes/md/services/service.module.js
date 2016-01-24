(function() {
    'use strict';

    // angular.module('oc.services', ['ngResource'])
    var app = angular.module('app');

    app
        .config([
            '$httpProvider', function($httpProvider) {
                //$httpProvider.defaults.headers.post = {
                //    'Access-Control-Allow-Origin': 'http://localhost:3000',
                //    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                //    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With'
                //};

                //$httpProvider.defaults.headers.put = {
                //    'Access-Control-Allow-Origin': 'http://localhost:3000',
                //    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                //    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
                //    'Content-Type': 'application/json'
                //};
            }
        ]);

})();