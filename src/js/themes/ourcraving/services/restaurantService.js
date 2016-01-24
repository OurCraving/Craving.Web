(function () {
    'use strict';

    angular
        .module('app')
        .service('RestaurantService', restaurantService);

    restaurantService.$inject = ['$http', '$q', 'logger', 'baseUrl2'];

    function restaurantService($http, $q, logger, baseUrl2) {
        var serviceBase = baseUrl2;
        var service = {

            // events
            find: findRestaurant,
            findExact: findRestaurantExact,
            matchDish: matchDish,
            addDish: addDish,
            getDishes: getDishes,
            getCravings: getCravings,
            getDishByName: getDishByName,
            getRandomRestaurant: getRandomRestaurant,
            getCitySummaries: getCitySummaries
        };

        return service;

        function matchDish(name) {
            return $http.get(serviceBase + "dishes/match/" + name);
        }

        function findRestaurantExact(userLocation, restaurantName) {
            var input = {
                "location": userLocation.coords.latitude + "," + userLocation.coords.longitude,
                "name": restaurantName,
                "city": userLocation.city,
                "region": userLocation.region,
                "country": userLocation.country
            };
            return $http.get(serviceBase + "restaurants/findexact", { params: input });
        }

        function findRestaurant(userLocation, restaurantName) {
            var input = {
                "location": userLocation.coords.latitude + "," + userLocation.coords.longitude,
                "name": restaurantName,
                "city": userLocation.city,
                "region": userLocation.region,
                "country": userLocation.country
            };
            return $http.get(serviceBase + "restaurants/find", { params: input });
        }

        function getCravings(restaurantId) {
            return $http.get(serviceBase + "restaurants/" + restaurantId + "/cravings");
        }

        function getDishes(restaurantId) {
            return $http.get(serviceBase + "restaurants/" + restaurantId + "/dishes");
        }

        function getDishByName(restaurantName, dishName) {
            var restName = window.helper.replaceAll(restaurantName, "&", "_");
            var dName = window.helper.replaceAll(dishName, "&", "_");
            return $http.get(serviceBase + "restaurants/" + escape(restName) + "/dish/" + escape(dName));
        }

        function getRandomRestaurant(userLocation, total) {
            var input = {
                "location": userLocation.coords.latitude + "," + userLocation.coords.longitude,
                "city": userLocation.city,
                "region": userLocation.region,
                "country": userLocation.country,
                "total": total
            };

            return $http.get(serviceBase + "restaurants/random", { params: input });
        }

        // the input comes from dish.add.js 
        function addDish(dish, dinerProfile, userLocation) {
            // this data needs to match AddDishReqV2 format 
            var data = {
                "RestaurantName": dish.restaurant.name,
                "City": dish.restaurant.city || userLocation.city,
                "Region": dish.restaurant.region || userLocation.region,
                "Country": dish.restaurant.country || userLocation.country,
                "Address": dish.restaurant.address,
                "Geo": {
                    "Latitude": dish.restaurant.latitude,
                    "Longitude": dish.restaurant.longitude
                },
                "PlaceId": dish.restaurant.placeId,
                "PostalCode": dish.restaurant.postalCode,
                "PhoneNumber": dish.restaurant.phoneNumber,
                "Name": dish.name,
                "Description": dish.description,
                "Rating": dish.rating,
                "Review": dish.review,
                "ImageFileName": dish.imageFileName,
                "DinerId": dinerProfile.id,
                "SelectedCravings": dish.selectedCravings.length > 0 ? dish.selectedCravings.map(function (element) { return element.CravingId; }) : []
            };

            return $http.post(serviceBase + 'dishes/add', data);
        }

        function getCitySummaries() {
            return $http.get(serviceBase + 'restaurants/citysummary');
        }
    }
})();