(function () {
    'use strict';

    angular
        .module('app')
        .controller('DishDetailController', dishDetailController);

    dishDetailController.$inject = ['dinerLoader', 'restaurantLoader', 'AuthService', 'CravingService', 'ProposalService', 'ResumeService',
        'NavigationService', 'ModalService', 'FactualService', 'RecentDishService', 'AdminService', '$rootScope', '$scope', '$q'];

    function dishDetailController(dinerLoader, restaurantLoader, authService, cravingService, proposalService, resumeService,
        navigationService, modalService, factualService, recentDishService, adminService, $rootScope, $scope, $q) {

        var vm = this;
        vm.dish = undefined;

        vm.hasDescription = false;
        vm.showDescriptionEditor = false;
        vm.updatingDescription = "";

        vm.message = '';
        vm.savedSuccessfully = false;

        vm.myRating = 0;
        vm.myReview = undefined;
        vm.myReviewId = undefined;
        vm.hasMyReview = false;
        vm.myReviewIsChanged = false;
        vm.reviews = [];
        vm.totalReviews = 0;

        vm.numberOfCravingDiners = 0;
        vm.myOriginalRating = 0;
        vm.overStar = false;
        vm.maxRating = 5;
        vm.percent = 0;
        vm.firstTimeVote = true;

        vm.restaurants = [];

        // events
        vm.openDiner = openDiner;
        vm.openMap = openMap;
        vm.getDinerImage = getDinerImage;
        vm.getDishImageSrc = getDishImageSrc;
        vm.hoveringLeave = hoveringLeave;
        vm.hoveringOver = hoveringOver;
        vm.addCravingTags = addCravingTags;
        vm.openImage = openImage;
        vm.addFile = addFile;
        vm.saveDescription = saveDescription;
        vm.saveMyReview = saveMyReview;
        vm.getReviewPostDate = getReviewPostDate;
        vm.getDirection = getDirection;

        vm.getProposalName = getProposalName;
        vm.addToProposal = addToProposal;
        vm.addToNewProposal = addToNewProposal;
        vm.removeDish = removeDish;

        // initialize
        activate();

        // event handlers
        function getDinerImage(imgName) {
            return window.helper.getSafeAvatarImage(imgName);
        }

        function getDishImageSrc(imgName) {
            return window.helper.getSafePreviewImage(imgName);
        }

        function openDiner(dinerId) {
            if (dinerId) {
                dinerLoader.load(dinerId);
            } else {
                dinerLoader.load(vm.dish.CreatorId);
            }
            window.sidebar.open('sidebar-agent', { effect: "st-effect-1", duration: 550, overlay: true });
        }

        function openMap() {
            window.sidebar.open('sidebar-edit', { effect: "st-effect-1", duration: 550, overlay: false });
        }

        function hoveringOver(value) {
            vm.overStar = value;
            vm.percent = 100 * (value / vm.maxRating);
            vm.ratingLabel = window.helper.buildRatingLabel(value);
        }

        function hoveringLeave() {
            if (vm.overStar !== vm.myRating) {
                vm.percent = 100 * (vm.myRating / vm.maxRating);
                vm.ratingLabel = window.helper.buildRatingLabel(vm.myRating);
            }

            vm.overStar = null;
        }

        $scope.$watch('vm.myRating', function () {
            vm.myReviewIsChanged = (vm.myRating !== vm.myOriginalRating);
        });

        function openImage(fileName) {
            modalService.openModal('layout/image_modal.html', 'ImageModalController', true, '',
                { 'Name': vm.dish.Name, 'FileName': fileName });
        }

        function addFile() {
            modalService.openModal('dish/add-image-modal.html', 'DishAddImageController', true, 'lg', { Dish: vm.dish }).result.then(function (data) {
                if (data && data !== 'cancel' && data.length > 0) {
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareAddImage(data); }, "You need to log in first before adding new image to this dish.");
                }
            });
        }

        function addCravingTags() {
            modalService.openModal('dish/add-tag-modal.html', 'DishAddTagsController', true, 'lg', { Dish: vm.dish }).result.then(function (data) {
                if (data && data !== 'cancel' && data.length > 0) {
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareUpdatingCravings(data); }, "You need to log in first before adding new craving tags to this dish.");
                }
            });
        }

        function saveDescription() {
            resumeService.flush();
            resumeService.createResume(prepareSaveDescription, "You need to log in first before saving a new description.");
        }

        function saveMyReview() {
            resumeService.flush();
            resumeService.createResume(prepareSaveMyReview, "You need to log in first before saving your resview. ");
        }

        function getReviewPostDate(review) {
            return window.helper.getPostDateDescription(review.PostDate);
        }

        function getDirection(restaurant) {
            var link = "https://maps.google.com?saddr=Current+Location&daddr=";
            window.open(link + restaurant.address + "+" + restaurant.locality + "+" + restaurant.postcode, "_blank");
        }

        function getProposalName(proposal) {
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        }

        function addToProposal(proposal) {
            if (!proposal) {
                addToNewProposal();
                return;
            }

            resumeService.flush();
            resumeService.createResume(function () { return prepareAddDishToProposal(proposal); }, "You need to log in first before using the craving proposal.");
        }

        function addToNewProposal() {
            modalService.openModal('proposal/new_proposal_modal.html', 'ProposalModalController', true, 'sm', { Dish: vm.dish }).result.then(function (data) {
                var name = "";
                if (data && data !== 'cancel' && data.name) {
                    name = data.name;
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareAddDishToNewProposal(name); }, "You need to log in first before using the craving proposal.");
                }
            });
        }

        // helpers
        function activate() {
            vm.dishId = $rootScope.$stateParams.id;

            if (vm.dishId) {
                authService.fillAuthData();
                cravingService.getDish(vm.dishId).then(function (response) {
                    vm.dish = response.data;
                    vm.hasDescription = vm.dish.Description !== null && vm.dish.Description !== "";
                    vm.updatingDescription = vm.dish.Description;
                    loadAdditionalData(vm.dish);

                }).catch(function (err, status) {
                    if (status === 404) {
                        window.helper.handleError(err, vm, "Dish is not found:");
                    } else {
                        window.helper.handleError(err, vm, "Failed to retrieve dish due to:");
                    }
                });
            }

            $scope.$on('onRepeatLast', function (scope, element, attrs) {
                $(".grid-tiles").freetile({
                    animate: true,
                    elementDelay: 30,
                    selector: ".grid-item",
                    callback: function () {
                        // very important, without it, the page loses scrollbar or can't scroll properly
                        $('[data-scrollable]').getNiceScroll().resize();
                    }
                });
            });
        }

        function loadAdditionalData(dish) {
            recentDishService.addToRecent(dish);
            loadCravingDiners();
            loadReviews();
            loadPosition();
            loadRestaurantInfo(dish);
            loadProposals();
        }

        function loadProposals() {
            if (authService.authentication.isAuth) {
                proposalService.getByDiner(authService.authentication.dinerId).then(function (response) {
                    var all = response.data.Items;
                    vm.proposals = [];
                    for (var idx = 0; idx < all.length; idx++) {
                        if (all[idx].IsExpired !== true) {
                            vm.proposals.push(all[idx]);
                        }
                    }
                });
            }
        }

        function loadCravingDiners() {
            cravingService.getCravingDiners(vm.dishId).then(function (response) {
                vm.cravingDiners = response.data.Items;
                vm.numberOfCravingDiners = vm.cravingDiners.length;
            });
        }

        function loadReviews() {
            cravingService.getDishReview(vm.dishId).then(function (response) {
                if (response && response.data.Items) {
                    // first, take the average 
                    var total = 0;
                    var myReviewIdx = -1;
                    for (var idx = 0; idx < response.data.Items.length; idx++) {
                        total += response.data.Items[idx].Rating;

                        if (authService.authentication.isAuth && authService.authentication.dinerId === response.data.Items[idx].ReviewerId) {
                            vm.myRating = response.data.Items[idx].Rating;
                            vm.myOriginalRating = vm.myRating;
                            vm.myReview = response.data.Items[idx].Review;
                            vm.myReviewId = response.data.Items[idx].ReviewId;
                            vm.firstTimeVote = false;
                            myReviewIdx = idx;
                            vm.hasMyReview = true;
                        }
                    }

                    vm.averageRating = total / response.data.Items.length;
                    vm.totalReviews = response.data.Items.length; // we need to store this value, coz it's possible the only reviewer is the current user

                    vm.reviews = response.data.Items;
                    // we don't show my own review in the list, because it's showed in the top and editable 
                    if (myReviewIdx >= 0) {
                        vm.reviews.splice(myReviewIdx, 1);
                    }
                }
            });
        }

        function loadPosition() {
            if ($rootScope.position) {
                vm.position = $rootScope.position;
            } else {
                vm.position = window.helper.getDefaultLocation();
            }
        }

        function loadRestaurantInfo(dish) {
            factualService.getByName(dish.RestaurantName, vm.position.userLocation.city).then(
                function (data) {
                    vm.restaurants = [];
                    for (var idx = 0; idx < data.response.data.length; idx++) {
                        if (window.helper.hasDuplication(data.response.data[idx], vm.restaurants) === false) {
                            vm.restaurants.push(data.response.data[idx]);
                        }
                    }

                    restaurantLoader.load(vm.restaurants);
                });
        }

        function removeDish() {
            adminService.removeDish(vm.dishId, 0)
                .success(function () {
                    // TODO: there is no point to post a message, probably just go back to home page
                    postInfo("Dish has been removed");
                })
                .error(function (err) {
                    window.helper.handleError(err, vm, "Dish could not be removed");
                });
        }

        function postInfo(message) {
            vm.savedSuccessfully = true;
            vm.message = message;
        }

        // this function will be called from resumeService
        function prepareAddDishToNewProposal(name) {
            var data = {
                Name: name,
                Items: []
            };

            data.Items.push({
                RestaurantId: vm.dish.RestaurantId,
                DishId: vm.dish.DishId
            });

            return proposalService.createProposal(data).then(function (response) {
                navigationService.go('proposal.view', { key: response.data, confirm: true });
            }, function (err) {
                // TODO: for this one we should go to a dedicated page 
            });
        }

        function prepareUpdatingCravings(selectedCravings) {
            return cravingService.updateCravings(vm.dish.DishId, selectedCravings).then(function(response) {
                vm.dish.Cravings = response.data.Items;
            }, function(err) {
                window.helper.handleError(err, vm, "Failed to update cravings due to:");
            });
        }

        function prepareAddImage(filename) {
            return cravingService.addFile(vm.dish.DishId, filename).then(function (response) {
                var newFile = response.data;
                vm.dish.DishImageFiles.push(newFile);
            }, function (err) {
                window.helper.handleError(err, vm, "Failed to update cravings due to:");
            });
        }

        function prepareAddDishToProposal(proposal) {
            // we will always reload all proposals before adding a dish to it, coz this could come from a resume
            authService.fillAuthData();
            var dinerId = authService.authentication.dinerId;
            return proposalService.getByDiner(dinerId).then(function (response) {
                var all = response.data.Items;
                vm.proposals = [];
                for (var idx = 0; idx < all.length; idx++) {
                    if (all[idx].IsExpired !== true) {
                        vm.proposals.push(all[idx]);
                    }
                }

                if (proposalService.proposals.length === 0) {
                    return prepareAddDishToNewProposal();
                } else {
                    if (!proposal) {
                        proposal = proposalService.proposals[0];
                    }

                    if (proposal.IsExpired) {
                        return prepareAddDishToNewProposal();
                    } else {
                        return proposalService.addItem(vm.dish, proposal).then(function () {
                            modalService.openModal('proposal/proposal_modal.html', 'ProposalModalController', true, 'lg', { Dish: vm.dish, Proposal: proposal });
                        }, function (err) {
                            modalService.openModal('proposal/proposal_modal.html', 'ProposalModalController', true, 'lg', { Dish: vm.dish, Proposal: proposal, AlreadyIn: true });
                        });
                    }
                }
            });
        }

        function prepareSaveMyReview() {
            if (vm.hasMyReview === true) {
                // update review
                return cravingService.updateReview(vm.dishId, vm.myReviewId, vm.myRating, vm.myReview, authService.authentication.dinerId).then(function () {
                    loadReviews();
                    vm.myReviewIsChanged = false;
                }, function (err) {
                    window.helper.handleError(err, vm, "Failed to save review due to:");
                });
            } else {
                // add a new review 
                return cravingService.addReview(vm.dishId, vm.myRating, vm.myReview, authService.authentication.dinerId).then(function () {
                    loadReviews();
                    vm.myReviewIsChanged = false;
                }, function (err) {
                    window.helper.handleError(err, vm, "Failed to save review due to:");
                });
            }
        }

        function prepareSaveDescription() {
            var deferred = $q.defer();
            if (vm.dish.Description !== vm.updatingDescription) {
                cravingService.updateDescription(vm.dishId, vm.updatingDescription).then(function () {
                    vm.dish.Description = vm.updatingDescription;
                    vm.showDescriptionEditor = false;
                    vm.hasDescription = vm.dish.Description !== null && vm.dish.Description !== "";
                    postInfo('');
                    deferred.resolve();
                }, function (err) {
                    deferred.reject();
                    window.helper.handleError(err, vm, "Failed to save dish description due to:");
                });
            } else {
                deferred.resolve(''); // nothing to save
            }

            return deferred.promise;
        }
    }

})();
