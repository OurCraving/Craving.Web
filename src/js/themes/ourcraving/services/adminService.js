(function () {
    'use strict';
    var profileKey = "ProfileData";
    var app = angular.module('app');

    app
        .service('AdminService', adminService);

    adminService.$inject = ['$http', '$q', 'logger', 'localStorageService', 'baseUrl2'];

    function adminService($http, $q, logger, localStorageService, baseUrl2) {

        var adminServiceFactory = {
            removeDish: removeDish,
            removeReview: removeReview,
            getAllCravingTags: getAllCravingTags,
            getAllRecentDishes: getAllRecentDishes,
            getAllRecentReviews: getAllRecentReviews,
            getAllRecentUsers: getAllRecentUsers,
            updateCravingTag: updateCravingTag
        };

        return adminServiceFactory;

        function removeDish(dishId, reason) {
            var data = {
                Reason: reason
            };

            return $http({
                method: 'DELETE',
                url: baseUrl2 + "dishes/" + dishId,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                cache: false
            });
        }

        function removeReview(reviewId, reason) {
            var data = {
                Reason: reason
            };

            return $http({
                method: 'DELETE',
                url: baseUrl2 + "dishes/review/" + reviewId,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                cache: false
            });
        }

        function updateCravingTag(tagId, active)
        {
            var data = {
                Id: tagId,
                IsActive: active
            };

            return $http({
                method: 'PUT',
                url: baseUrl2 + "cravings/" + tagId,
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                cache: false
            });
        }

        function getAllCravingTags(page, limit)
        {
            return $http.get(baseUrl2 + "cravings/" + "all?pageNumber=" + page + "&pageSize=" + limit);
        }

        function getAllRecentDishes(page, limit) {
            return $http.get(baseUrl2 + "dishes/" + "admin/all?pageNumber=" + page + "&pageSize=" + limit);
        }

        function getAllRecentReviews(page, limit) {
            return $http.get(baseUrl2 + "dishes/" + "admin/review/all?pageNumber=" + page + "&pageSize=" + limit);
        }

        function getAllRecentUsers(page, limit) {
            return $http.get(baseUrl2 + "diners/" + "admin/all?pageNumber=" + page + "&pageSize=" + limit);
        }

    }
}());