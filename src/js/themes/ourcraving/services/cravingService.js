(function () {
    'use strict';

    var app = angular.module('app');

    app.service('CravingService', cravingService);

    cravingService.$inject = ['$http', '$q', 'baseUrl2'];

    function cravingService($http, $q, baseUrl2) {

        var service = {
            // properties

            // methods
            getTrending: getTrendingHandler,
            searchCraving: searchCravingHandler,
            getRecent: getRecentHandler,
            getDish: getDishHandler,
            getCravingDiners: getCravingDiners,
            getDishReview: getDishReview,

            craveForIt: craveForItHandler,
            updateCravings: updateCravings,
            updateDescription: updateDescription,
            addFile: addFile,
            addReview: addReview,
            updateReview: updateReview,
            addOpinion: addOpinion
        };

        return service;

        // used to vote if a review is useful 
        function addOpinion(dishId, reviewId, dinerId, isUseful) {
            var data = {
                "DishId": dishId,
                "ReviewId": reviewId,
                "DinerId": dinerId,
                "IsUseful": isUseful
            };

            return $http.put(baseUrl2 + "dishes/" + dishId + "/rating/" + reviewId + "/opinion", data);
        }

        function updateReview(dishId, reviewId, rating, review, dinerId) {
            var data = {
                "DishId": dishId,
                "Rating": rating,
                "Review": review,
                "ReviewerId": dinerId
            };

            return $http.put(baseUrl2 + "dishes/" + dishId + "/rating/" + reviewId, data);
        }

        function addReview(dishId, rating, review, dinerId) {
            var data = {
                "DishId": dishId,
                "Rating": rating,
                "Review": review,
                "ReviewerId": dinerId
            };

            return $http.post(baseUrl2 + "dishes/" + dishId + "/rating", data);
        }

        function updateDescription(dishId, description) {
            var data = {
                "DishId": dishId,
                "Description": description
            };

            return $http.put(baseUrl2 + "dishes/" + dishId + "/description", data);
        }

        function getDishReview(dishId) {
            return $http.get(baseUrl2 + "dishes/" + dishId + "/reviews");
        }

        function getCravingDiners(dishId) {
            return $http.get(baseUrl2 + "dishes/" + dishId + "/cravingdiners");
        }

        function getDishHandler(dishId) {
            return $http.get(baseUrl2 + "dishes/" + dishId);
        }

        // city - a string of city name
        // location - a geo location: it should be fomatted as "lat, lon", without quotation marks 
        function getTrendingHandler(location) {
            // this op can be paged, but I don't know if we need to, let's just simply get everything and cache it
            return $http(
                {
                    url: baseUrl2 + "cravings/trending?showAll=true&&location=" + location,
                    cache: true,
                    method: 'GET'
                });
        }

        // used when a user clicks the [Crave] icon of a dish 
        // "fire-and-forget" 
        function craveForItHandler(dishId) {
            // I am not sure what we need to do
            return $http.put(baseUrl2 + "cravings/dish/" + dishId);
        }

        function searchCravingHandler(cravings, city, location, pageNumber) {
            var pageSize = 20;
            return $http(
                {
                    url: baseUrl2 + "dishes/search/" + city + "?cravings=" + cravings + "&location=" + location + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize,
                    method: 'GET'
                }
                );
        }

        function getRecentHandler(city) {
            return $http.get(baseUrl2 + "dishes/" + city);
        }

        function updateCravings(dishId, cravings) {
            return $http.put(baseUrl2 + 'dishes/' + dishId + '/cravings', { 'Cravings': cravings });
        }

        function addFile(dishId, fileName) {
            return $http.post(baseUrl2 + 'dishes/' + dishId + '/file', {
                'DishId': dishId,
                'FileName': fileName
            });
        }
    }
})();