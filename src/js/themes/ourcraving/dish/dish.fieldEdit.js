(function () {
    'use strict';

    angular
        .module('app')
        .controller('DishFieldEditController', dishFieldEditController);

    dishFieldEditController.$inject = [
        'GeoService', 'RestaurantService', 'DinerService', 'ReferenceDataService',
        'ResumeService', 'AuthService',
        'loader', 'uploadUrl',
        '$timeout', '$scope', '$rootScope', '$http'];

    function dishFieldEditController(
        geoService, restService, dinerService, refService, resumeService, authService,
        dishLoader, uploadUrl,
        $timeout, $scope, $rootScope, $http) {
        /* jshint validthis:true */
        var vm = this;
        // properties 
        vm.dish = dishLoader.current;
        vm.dish.restaurant = {};
        vm.dish.selectedCravings = [];
        vm.dish.rating = 0;
        vm.dish.uploadImage = '';

        vm.overStar = false;
        vm.showReviewBox = false;
        vm.message = "";
        vm.invalid = {};
        vm.invalid.city = false;
        vm.invalid.dishname = false;
        vm.showAddDish = true;

        vm.maxRating = 5;
        vm.ratingLabel = "";
        vm.percent = 0;

        // events
        vm.matchDish = matchDish;
        vm.tagDishTransform = tagDishTransform;
        vm.hoveringOver = hoveringOver;
        vm.hoveringLeave = hoveringLeave;
        vm.resetUpload = resetUpload;
        vm.submit = submitHandler;
        vm.cancel = cancelHandler;
        vm.resetAddDish = resetAddDish;

        // initialize
        activate();

        // helpers
        function activate() {
            setUserLocation($rootScope.position);

            authService.fillAuthData();
            if (authService.authentication.isAuth === false) {
                resumeService.flush();
                resumeService.createResume(function() {
                    // we don't need to do anything, it will come back to this page after logging in
                }, "Must login to add a new dish");
            }

            dishLoader.addLoadedEventListener(function (restData) {
                var timer = $timeout(function () {
                    $timeout.cancel(timer);
                    if (restData) {
                        vm.dish.restaurant.name = restData.name;
                        vm.dish.restaurant.address = restData.address;
                        vm.dish.restaurant.postalCode = restData.postcode;
                        vm.dish.restaurant.phoneNumber = restData.tel;
                        vm.dish.restaurant.latitude = restData.latitude;
                        vm.dish.restaurant.longitude = restData.longitude;
                        vm.dish.restaurant.placeId = restData.factual_id;
                    } else {
                        vm.dish.restaurant.Name = null;
                    }
                });
            });
        }

        function resetUpload() {
            vm.dish.uploadImage = '';
        }

        function matchDish(query) {
            if (!query || !vm.userLocation) return;

            // the server has a  constraint that it only searches if the given name has 5 or more characters 
            if (query.length <= 5) return;

            restService.matchDish(query).then(function (response) {
                vm.matchingDishes = response.data.Items;
            });
        };

        function tagDishTransform(newTag) {
            // this needs to create an item that has the same format to matchingDishes
            var dish = {
                DishName: newTag + " (new dish)"
            };
            return dish;
        };

        function hoveringOver(value) {
            vm.overStar = value;
            vm.percent = 100 * (value / vm.maxRating);
            buildRatingLabel(value);
        };

        function hoveringLeave() {
            if (vm.overStar !== vm.rating) {
                vm.percent = 100 * (vm.dish.rating / vm.maxRating);
                buildRatingLabel(vm.dish.rating);
            }

            vm.overStar = null;
        };

        $scope.$watch('vm.dish.rating', function () {
            if (vm.dish.rating > 0)
                vm.showReviewBox = true;
            else
                vm.showReviewBox = false;
        });

        function submitHandler() {
            dinerService.getMyProfile().then(function () {
                vm.dish.selected.DishName = vm.dish.selected.DishName.replace(' (new dish)', '');
                restService.addDish(vm.dish, dinerService.profile, vm.userLocation).then(function (response) {
                    vm.showAddDish = false;
                    var dishId = response.data;
                    uploadImage(dishId);
                },
                function (err) {
                    window.helper.handleError(err, err);
                });
            });
        }

        function uploadImage(id) {
            if (vm.dish.uploadImage && vm.dish.uploadImage !== "") {
                var file = vm.uploadImage;
                // when we upload, don't specify the path, the uploader will figure it out by "type"
                var fd = new FormData();
                fd.append('file', file);
                fd.append('id', id);

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function (data) {
                        vm.dish.imageFileName = data;
                    })
                    .error(function (err) {
                        window.helper.handleError(err, vm, "Failed to upload photos due to:");
                    });
            }
        }

        function cancelHandler() {
            window.sidebar.close('sidebar-edit', { effect: "st-effect-1", duration: 550, overlay: false });
        }

        function resetAddDish() {
            vm.showAddDish = true;

            // don't reset vm.wizard.userlocation
            vm.dish.rating = 0;
            vm.dish.review = "";
            vm.dish.selected = "";
            vm.dish.restaurant = {};
            vm.step = 0;
            vm.dish.uploadImage = "";
        }

        function buildRatingLabel(value) {
            vm.ratingLabel = window.helper.buildRatingLabel(value);
        }

        function setUserLocation(position) {
            vm.userLocation = {};
            vm.userLocation.city = position.userLocation.city;
            vm.userLocation.region = position.userLocation.region;
            vm.userLocation.country = position.userLocation.country;
            vm.userLocation.location = position.coords.latitude + "," + position.coords.longitude;
        }
    }

})();
