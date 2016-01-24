(function () {
    'use strict';

    angular
        .module('app')
        .controller('DishFieldEditController', dishFieldEditController);

    dishFieldEditController.$inject = [
        'GeoService', 'RestaurantService', 'DinerService', 'ReferenceDataService',
        'ResumeService', 'AuthService', 'CravingService',
        'loader', 'uploadUrl',
        'ModalService',
        '$timeout', '$scope', '$rootScope', '$http'];

    function dishFieldEditController(
        geoService, restService, dinerService, refService,
        resumeService, authService, cravingService,
        dishLoader, uploadUrl,
        modalService,
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
        vm.savedSuccessfully = false;
        vm.invalid = {};
        vm.invalid.city = false;
        vm.invalid.dishname = false;
        vm.showAddDish = true;
        vm.isBusy = false;
        vm.fileInvalid = false;

        vm.maxRating = 5;
        vm.ratingLabel = "";
        vm.percent = 0;

        // events
        vm.matchDish = matchDish;
        vm.hoveringOver = hoveringOver;
        vm.hoveringLeave = hoveringLeave;
        vm.resetUpload = resetUpload;
        vm.submit = submitHandler;
        vm.resetAddDish = resetAddDish;
        vm.openMap = openMap;
        vm.onFileRead = onFileRead;

        // initialize
        activate();

        // helpers
        function activate() {
            setUserLocation($rootScope.position);

            authService.fillAuthData();
            if (authService.authentication.isAuth === false) {
                resumeService.flush();
                resumeService.createResume(function () {
                    // we don't need to do anything, it will come back to this page after logging in
                }, "Must login to add a new dish");
            }

            $scope.updatePageTitle('OurCraving - suggest a new dish');
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

            initializeSelectedCravings();
        }

        function openMap() {
            modalService.toggleSidenav("left").then(function () {
                $("#left").trigger('sidenav.' + (modalService.isSidenavOpen("left") === true ? 'open' : 'close'));
            });
        }

        function onFileRead(file, content) {
            if (file.size > 5000000) {
                vm.fileInvalid = true;
            } else {
                vm.fileInvalid = false;
            }
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
            if ($scope.dishForm.$valid !== true) return;

            if (vm.fileInvalid) {
                vm.message = "Image size is too big... must be less than 5 MB.";
                return;
            }

            vm.message = "";

            dinerService.getMyProfile().then(function () {
                vm.isBusy = true;
                restService.addDish(vm.dish, dinerService.profile, vm.userLocation).then(function (response) {
                    vm.showAddDish = false;
                    var dishId = response.data;
                    vm.isBusy = false;
                    uploadImage(dishId);
                },
                function (err) {
                    window.helper.handleError(err, vm);
                    vm.isBusy = false;
                });
            });
        }

        function uploadImage(id) {
            vm.isBusy = true;
            vm.savedSuccessfully = true;
            if (vm.dish.uploadImage && vm.dish.uploadImage !== "") {
                var file = vm.dish.uploadImage;
                vm.savedSuccessfully = false;

                // when we upload, don't specify the path, the uploader will figure it out by "type"
                var fd = new FormData();
                fd.append('file', file);
                fd.append('id', id);
                fd.append('dinerId', dinerService.profile.id);

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function (data) {
                        saveImage(data, id);
                        vm.isBusy = false;
                        vm.savedSuccessfully = true;
                    })
                    .error(function (err) {
                        window.helper.handleError(err, vm, "Failed to upload photos due to:");
                        vm.message = vm.message + "You cannot add image again from here. However, you can find this dish you just added and add the image again from there.";
                        // must disable the save button even uploading image fails 
                        vm.isBusy = true;
                    });
            }
        }

        function resetAddDish() {
            // don't reset vm.wizard.userlocation
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                vm.showAddDish = true;

                vm.dish.rating = 0;
                vm.dish.review = "";
                vm.dish.selected = "";
                vm.dish.restaurant = {};
                vm.dish.name = "";
                vm.dish.description = "";
                vm.dish.selectedCravings = [];
                vm.step = 0;
                vm.dish.uploadImage = "";

                //$rootScope.$state.go("dish.add", {}, { reload: true });
            });
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

        function initializeSelectedCravings() {
            var input = $rootScope.$stateParams.input;
            if (input && input.split) {
                input = window.helper.replaceAll(input, '+', ',');
                var inputArr = input.split(',');
                refService.getData("cravingtype").then(function (response) {
                    var cravings = response.Items.sort(function (a, b) {
                        return a.Name > b.Name;
                    });

                    var selected = [];
                    for (var idx = 0; idx < inputArr.length; idx++) {
                        for (var j = 0; j < cravings.length; j++) {
                            if (cravings[j].Name === inputArr[idx]) {
                                selected.push({ CravingId: cravings[j].Id });
                                break;
                            }
                        }
                    }
                    vm.dish.selectedCravings = selected;
                });

            }
        }

        function saveImage(filename, dishId) {
            return cravingService.addFile(dishId, filename).then(function (response) {
                // no need to do anything
            }, function (err) {
                window.helper.handleError(err, vm, "Failed to update cravings due to:");
            });
        }
    }

})();
