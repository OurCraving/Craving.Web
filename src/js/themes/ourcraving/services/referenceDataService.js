(function () {
    'use strict';

    var app = angular.module('app');

    app
        .service('ReferenceDataService', referenceDataService);

    referenceDataService.$inject = ['$http', 'baseUrl', 'logger', '$q'];

    // indeed, we can use Angular built-in option cache: true to cache a get op for some of these data, but there is no a strangeforward way to flush.
    // to do that, I will have to write a cacheFactory first
    function referenceDataService($http, baseUrl, logger, $q) {
        var caches = [];
        var service = {
            getData: getData,
            getKeys: getKeys,
            flush: flush // it should be called if we want to remove a specified ref data from cache
        };

        return service;

        function getData(refTableName) {
            if (caches[refTableName] !== undefined) {
                var def = $q.defer();
                def.resolve(caches[refTableName]);
                return def.promise;
            } else {
                var dataUrl = baseUrl + refTableName;
                return $http({
                    method: 'GET',
                    url: dataUrl
                }).then(function (data, status, headers, config) {
                    caches[refTableName] = data.data;
                    return data.data;
                }, function (error) {
                    console.log(error);
                    logger.error(error);
                    return error;
                });
            }
        }

        function getKeys() {
            return Object.keys(caches);
        }

        function flush(refTableName) {
            if (refTableName in caches)
                caches.remove(refTableName);
        }
    }
})();
