(function () {
    'use strict';

    angular.module('app', [
      'ngResource',
      'ngSanitize',
      'ngTouch',
      'ui.router',
      'ui.utils',
      'ui.event',
      'ui.select',
      'ui.jq',
      'ui.bootstrap',
      'LocalStorageModule',
      'bootstrap.fileField'
    ]);

    var app = angular.module('app')
      .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$interpolateProvider', '$httpProvider',
          function ($controllerProvider, $compileProvider, $filterProvider, $provide, $interpolateProvider, $httpProvider) {
              app.controller = $controllerProvider.register;
              app.directive = $compileProvider.directive;
              app.filter = $filterProvider.register;
              app.factory = $provide.factory;
              app.service = $provide.service;
              app.constant = $provide.constant;
              app.value = $provide.value;

              $httpProvider.interceptors.push('authInterceptorService');

              //Enable cross domain calls
              $httpProvider.defaults.useXDomain = true;

              //Remove the header containing XMLHttpRequest used to identify ajax call 
              //that would prevent CORS from working
              delete $httpProvider.defaults.headers.common['X-Requested-With'];

              //$httpProvider.defaults.headers.post = {
              //    'Access-Control-Allow-Origin': '*',
              //    'Access-Control-Allow-Methods': 'POST',
              //    'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With'
              //};

              $httpProvider.defaults.headers.put = {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With',
                  'Content-Type': 'application/json'
              };

              $interpolateProvider.startSymbol('::');
              $interpolateProvider.endSymbol('::');
          }
        ]);

    app.filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });
})();
