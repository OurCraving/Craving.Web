(function () {
    'use strict';

    // we are using Factual API because it doesn't have the limitations that Google Places API has, 
    // https://developers.google.com/places/webservice/usage
    // Google constraints: 
    // 1) 1000 requests per 24 hours, can get 150, 000 requests per 24 hours if verified
    // 2) max 60 records, 20 each request, must wait 2 seconds for the next page 
    // 3) each text search is counted as 10 requests, which means if we want to support wildcard search of restaurant, it might be unpredictable 

    // FactualAPI supports 10K free requests per day 
    // no max record limit, no paging delay, can navigate next and previous, can support different search methods 

    angular
        .module('app')
        .service('FactualService', factualService);

    factualService.$inject = ['$http', 'logger'];

    // TODO: this service is not supposed to exist in this form, instead, it should call our own service, which internally call FactualAPI;
    // for 2 reasons: 1) we don't have to expose what external API and the API key we are using to the client side 
    // 2) if we ever need to change the dependency, we change in our server side, so the client side doesn't have any impact. 
    // it's here now because after I crafted the server side service, I actually need more data and an additional op, I endedup quickly adding them here instead 
    function factualService($http, logger) {
        var service = this;
        var factualKey = "KEY=[EnterYourKeyHere]";
        var serviceBaseUrl = "http://api.v3.factual.com/t/places";

        var searchUrl = serviceBaseUrl + "?geo={\"$circle\":{\"$center\":[{0}, {1}],\"$meters\": 2000}}" +
            "&filters={\"category_ids\":{\"$includes_any\":[312,347]}}" +
            "&include_count=true&" + factualKey;

        var getByNameUrl = serviceBaseUrl + "?" +
            "filters={" +
                "\"$and\": [" +
                  "{" +
                      "\"category_ids\": {" +
                          "\"$includes_any\": [312,347]" +
                      "}" +
                  "}," +
                  "{" +
                      "\"name\": {" +
                          "\"$search\": \"{0}\"" +
                      "}" +
                  "}," +
                  "{" +
                      "\"locality\": {" +
                          "\"$eq\":\"{1}\"}}]}" +
    "&include_count=true&" + factualKey;

        var findInCityUrl = "http://api.v3.factual.com/t/places-us?q={2}&filters={\"$and\":[{\"locality\":\"{0}\"},{\"region\":\"{1}\"}]}&limit=1&select=name,address,postcode&" + factualKey;

        service.searchNear = getData;
        service.getPlace = getPlace;
        service.getByName = getByName;
        service.findInCity = findInCity;

        return service;

        // name is the name of a restaurant
        function findInCity(name, city, region) {
            var url = getByNameUrl.format(city, region, escape(name));
            return $http({ method: 'GET', url: url })
                .then(
                function (data, status, headers, config) {
                    return data.data;
                },
                function (error) {
                    logger.error(error);
                    return error;
                }
            );
        }

        function getByName(name, city) {
            var searchText = escape(name);
            var url = getByNameUrl.format(searchText, city);
            return $http({ method: 'GET', url: url })
                .then(
                function (data, status, headers, config) {
                    return data.data;
                },
                function (error) {
                    logger.error(error);
                    return error;
                }
            );
        }

        function getData(lat, lng, offset, limit) {
            var url = searchUrl.format(lat, lng);
            if (offset !== undefined) {
                url = url + "&offset=" + offset;
            }

            if (limit) {
                url = url + "&limit=" + limit;
            }

            return $http({
                method: 'GET',
                url: url,
                cache: true
            }).then(function (data, status, headers, config) {
                return data.data;
            },
            function (error) {
                logger.error(error);
                return error;
            }
            );
        }

        function getPlace(placeId) {
            var url = serviceBaseUrl + "/" + placeId + "?" + factualKey;
            return $http({
                method: 'GET',
                url: url,
                cache: true
            }).then(function (data, status, headers, config) {
                return data.data;
            },
            function (error) {
                logger.error(error);
                return error;
            }
            );
        }
    }

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }
})();