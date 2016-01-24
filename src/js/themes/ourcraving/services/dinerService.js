(function () {
    'use strict';
    var profileKey = "ProfileData";
    var app = angular.module('app');

    app
        .service('DinerService', dinerService);

    dinerService.$inject = ['$http', '$q', 'logger', 'localStorageService', 'baseUrl2'];

    function dinerService($http, $q, logger, localStorageService, baseUrl2, genericAvatar) {
        var serviceBase = baseUrl2;

        // dinerSummary 
        var profile = {
            displayName: "",
            tagLine: "",
            avatar: "",
            birthday: "",
            email: "",
            id: ""
        };

        var dinerServiceFactory = {
            // properties
            profile: profile,
            // methods 
            get: getDiner,
            getMyProfile: getMyProfile,
            updateMyProfile: updateMyProfile,
            updateDislike: updateDislike,
            getDislike: getDislike,
            getRecentCravings: getRecentCravings,
            getRecentReviews: getRecentReviews,
            getRecentAddedDishes: getRecentAddedDishes,
            getRecentFavorites: getRecentFavorites,

            flush: cleanupCache
        };

        return dinerServiceFactory;

        function getDiner(id) {
            return $http.get(serviceBase + "diners/profile/" + id);
        }

        function getMyProfile() {
            return getCachedProfile();
        }

        function updateMyProfile() {
            return $http.put(serviceBase + "diners/" + profile.id + "/update", profile).then(
                function (response) {
                    setProfile(response.data);
                    cacheProfile();
                });
        }

        function getDislike(id) {
            return $http.get(serviceBase + "diners/" + id + "/dislikes");
        }

        function getRecentCravings(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/cravings";
            if (all) {
                url = url + "?all=true";
            }

            return $http.get(url);
        }

        function getRecentReviews(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/reviews";
            if (all) {
                url = url + "?all=true";
            }
            return $http.get(url);
        }

        function getRecentAddedDishes(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/dishes";
            if (all) {
                url = url + "?all=true";
            }

            return $http.get(url);
        }

        function getRecentFavorites(id, all) {
            var url = serviceBase + "diners/" + id + "/recent/favorites";
            if (all) {
                url = url + "?all=true";
            }
            return $http.get(url);
        }

        function updateDislike(id, cravingIds) {
            var data = {
                "Cravings": cravingIds,
                "Id": id
            };

            return $http.put(serviceBase + "diners/" + id + "/dislikes", data);
        }

        function getCachedProfile() {
            var deferred = $q.defer();

            var profileData = localStorageService.get(profileKey);
            if (!profileData || !profileData.id || !profileData.displayName || !profileData.email) {
                $http.get(serviceBase + "diners/profile").then(
                        function (response) {
                            profile.displayName = response.data.DisplayName;
                            profile.tagLine = response.data.TagLine;
                            profile.avatar = response.data.Avatar;
                            profile.birthday = new Date(response.data.Birthday);
                            profile.email = response.data.Email;
                            profile.id = response.data.Id;
                            //profile.avatar = window.helper.getSafeAvatarImage(profile.avatar);
                            profile.isLoaded = true;
                            cacheProfile();

                            deferred.resolve(profile);
                        },
                        function (err) {
                            deferred.reject(err);
                        });
            } else {
                profile.displayName = profileData.displayName;
                profile.tagLine = profileData.tagLine;
                profile.avatar = profileData.avatar;
                profile.birthday = new Date(profileData.birthday);
                profile.email = profileData.email;
                profile.id = profileData.id;
                deferred.resolve(profile);
            }

            return deferred.promise;
        }

        function cleanupCache() {
            localStorageService.remove(profileKey);
        }

        function setProfile(response) {
            profile.displayName = response.DisplayName;
            profile.tagLine = response.TagLine;
            profile.avatar = response.Avatar;
            profile.birthday = new Date(response.Birthday);
            profile.email = response.Email || response.PrimaryEmail;
            profile.id = response.Id;
            // profile.avatar = window.helper.getSafeAvatarImage(profile.avatar);
            profile.isLoaded = true;
        }

        function cacheProfile() {
            if (profile !== null && profile.isLoaded) {
                localStorageService.set(profileKey,
                    {
                        displayName: profile.displayName,
                        tagLine: profile.tagLine,
                        avatar: profile.avatar,
                        birthday: profile.birthday,
                        email: profile.email,
                        id: profile.id
                    });
            }
        }
    }
}());