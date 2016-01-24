(function () {
    'use strict';

    angular.module('app', [
      'ngResource',
      'ngSanitize',
      'ngTouch',
      'ui.router',
      'ui.utils',
      'ui.event',
      'ui.jq',
      'ui.bootstrap',
      'ui.select',
      'LocalStorageModule',
      'ngAnimate',
      'ngplus',
      'md.data.table',
      'ngMaterial',
      'ngMdIcons',
      'ngMessages',
      'angular.filter',
      'uiGmapgoogle-maps'
    ]);

    var app = angular.module('app')
      .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
          function ($controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {
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
          }
        ])
    .config(function ($mdThemingProvider) {
        var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ECEFF1',
            '200': '1976D2'
        });

        $mdThemingProvider.definePalette('customGreen', customBlueMap);
        $mdThemingProvider.theme('default')
          .primaryPalette('customGreen', {
              'default': '500',
              'hue-1': '50',
              'hue-2': '200'
          }).accentPalette('red');

        $mdThemingProvider.theme('input', 'default').primaryPalette('grey');
    });;

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
