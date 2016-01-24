(function () {
    'use strict';

    angular
        .module('app')
        .factory('LoaderFactory', loaderFactory);

    loaderFactory.$inject = [];

    function loaderFactory() {
        return function (maxListeners) {
            var loader = this;

            // TODO: NOT USED
            loader.maxListeners = maxListeners || 100;

            loader.current = undefined;
            loader.loadedEvents = [];
            loader.load = loadEntity;
            loader.addLoadedEventListener = addEventListener;
            loader.removeLoadedEventListener = removeEventListener;

            return loader;

            function removeEventListener(eventHandler) {
                var foundIdx = -1;
                for (var idx = 0; idx < loader.loadedEvents.length; idx++) {
                    if (loader.loadedEvents[idx] === eventHandler) {
                        foundIdx = idx;
                        break;
                    }
                }

                if (foundIdx >= 0) {
                    loader.loadedEvents.splice(foundIdx, 1);
                }
            }

            function addEventListener(eventHandler) {
                var found = false;
                for (var idx = 0; idx < loader.loadedEvents.length; idx++) {
                    if (loader.loadedEvents[idx] === eventHandler) {
                        found = true;
                        break;
                    }
                }

                if (!found && isFunction(eventHandler)) {
                    loader.loadedEvents.push(eventHandler);
                }
            }

            function loadEntity(entity) {
                if (entity !== loader.current) {
                    loader.current = entity;
                    for (var idx = 0; idx < loader.loadedEvents.length; idx++) {
                        loader.loadedEvents[idx](loader.current);
                    }
                }
            }

            function isFunction(functionToCheck) {
                var getType = {};
                return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
            }
            
        };
    }
})();