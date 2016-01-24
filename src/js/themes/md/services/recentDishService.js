(function () {
    'use strict';

    angular
        .module('app')
        .service('RecentDishService', recentDishService);

    recentDishService.$inject = ['localStorageService'];

    function recentDishService(localStorageService) {
        var service = {
            // events
            loadRecent: loadRecent,
            addToRecent: addToRecent,
            onRefresh: undefined,
            flush : flush,
            dishes: []
        };

        var storageKey = "recentDishData";

        return service;

        function loadRecent() {
            service.dishes = localStorageService.get(storageKey);
            if (!service.dishes) {
                service.dishes = [];
            }

            return service.dishes;
        }

        function addToRecent(dish) {
            service.dishes = localStorageService.get(storageKey);
            if (!service.dishes) {
                service.dishes = [];
            }

            var foundIdx = undefined;
            for (var idx = 0; idx < service.dishes.length; idx++) {
                if (service.dishes[idx].DishId === dish.DishId) {
                    foundIdx = idx;
                    break;
                }
            }

            if (foundIdx !== undefined) {
                service.dishes.splice(foundIdx, 1);
            } else {
                if (service.dishes.length >= 9) {
                    service.dishes.pop();
                }
            }

            service.dishes.unshift(dish);
            localStorageService.set(storageKey, service.dishes);
            if (service.onRefresh) {
                service.onRefresh();
            }
        }

        function flush() {
            service.dishes = [];
            localStorageService.set(storageKey, service.dishes);
            if (service.onRefresh) {
                service.onRefresh();
            }
        }
    }
})();