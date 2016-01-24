(function () {
    'use strict';

    angular
        .module('app')
        .controller('DishDetailController', dishDetailController);

    dishDetailController.$inject = ['restaurantLoader', 'AuthService', 'CravingService', 'ProposalService', 'ResumeService',
        'NavigationService', 'ModalService', 'FactualService', 'RecentDishService', 'AdminService', '$rootScope', '$scope', '$q', 'fileService'];

    function dishDetailController(restaurantLoader, authService, cravingService, proposalService, resumeService,
        navigationService, modalService, factualService, recentDishService, adminService, $rootScope, $scope, $q, fileService) {

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
        vm.isMyFavorite = false;
        vm.myOriginalRating = 0;
        vm.overStar = false;
        vm.maxRating = 5;
        vm.percent = 0;
        vm.firstTimeVote = true;

        vm.restaurants = [];
        vm.proposals = [];
        vm.recentProposal = undefined;

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

        vm.getProposalName = getProposalName;
        vm.addToProposal = addToProposal;
        vm.addToNewProposal = addToNewProposal;
        vm.removeDish = removeDish;
        vm.craveForIt = craveForIt;

        // initialize
        activate();

        // event handlers
        function getDinerImage(imgName) {
            return fileService.getSafeAvatarImage(imgName);
        }

        function getDishImageSrc(imgName) {
            return fileService.getSafePreviewImage(imgName);
        }

        function openDiner(dinerId, ev) {
            modalService.openModal('user/diner.html', 'DinerDetailController', { 'dinerId': dinerId }, ev);
        }

        function openMap() {
            modalService.toggleSidenav("left").then(function () {
                $("#left").trigger('sidenav.' + (modalService.isSidenavOpen("left") === true ? 'open' : 'close'));
            });
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

        function openImage(fileName, ev) {
            modalService.openModal('layout/image_modal.html', 'ImageModalController', { 'Name': vm.dish.Name, 'FileName': fileName }, ev);
        }

        function addFile(ev) {
            if (authService.authentication.isAuth === false) {
                resumeService.flush();
                resumeService.createResume(function () {
                    // we don't need to do anything, it will come back to this page after logging in
                }, "You need to log in first before adding new image to this dish.");
            }

            modalService.openModal('dish/add-image-modal.html', 'DishAddImageController', { Dish: vm.dish }, ev).then(function (data) {
                if (data && data !== 'cancel' && data.length > 0) {
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareAddImage(data); }, "You need to log in first before adding new image to this dish.");
                }
            });
        }

        function addCravingTags(ev) {
            modalService.openModal('dish/add-tag-modal.html', 'DishAddTagsController', { Dish: vm.dish }, ev).then(function (data) {
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

        function getReviewPostDate(d) {
            if (d) return window.helper.getPostDateDescription(d);

            return "";
        }

        function getProposalName(proposal) {
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        }

        function addToProposal(proposal, $event) {
            if (!proposal) {
                addToNewProposal();
                return;
            }

            resumeService.flush();
            resumeService.createResume(function () { return prepareAddDishToProposal(proposal, $event); }, "You need to log in first before using the craving proposal.");
        }

        function addToNewProposal(ev) {
            modalService.openModal('proposal/new_proposal_modal.html', 'ProposalModalController', { Dish: vm.dish }, ev).then(function (data) {
                var name;
                if (data && data !== 'cancel' && data.name) {
                    name = data.name;
                    resumeService.flush();
                    resumeService.createResume(function () { return prepareAddDishToNewProposal(name); }, "You need to log in first before using the craving proposal.");
                }
            });
        }

        function craveForIt() {
            resumeService.flush();
            resumeService.createResume(function () { return prepareCraveForIt(); }, "You need to log in first before adding a dish to your favorite list.");
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

                    $scope.updatePageTitle(vm.dish.Name + " @ " + vm.dish.RestaurantName);
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
            vm.recentProposal = undefined;
            if (authService.authentication.isAuth) {
                proposalService.getByDiner(authService.authentication.dinerId).then(function (response) {
                    var all = response.data.Items;
                    vm.proposals = [];
                    for (var idx = 0; idx < all.length; idx++) {
                        if (all[idx].IsExpired !== true) {
                            vm.proposals.push(all[idx]);
                        }
                    }

                    if (vm.proposals.length > 0) {
                        vm.recentProposal = vm.proposals[0];
                    }
                });
            }
        }

        function loadCravingDiners() {
            cravingService.getCravingDiners(vm.dishId).then(function (response) {
                vm.cravingDiners = response.data.Items;
                vm.numberOfCravingDiners = vm.cravingDiners.length;
                for (var i = 0, len = vm.cravingDiners.length; i < len; i++) {
                    if (vm.cravingDiners[i].DinerId === authService.authentication.dinerId) {
                        vm.isMyFavorite = true;
                        break;
                    }
                }
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
        function prepareCraveForIt() {
            return cravingService.craveForIt(vm.dishId).then(
                function () {
                    loadCravingDiners();
                });
        }

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
                navigationService.go('proposal.home.detail', { key: response.data, confirm: true });
            }, function (err) {
                // TODO: for this one we should go to a dedicated page 
            });
        }

        function prepareUpdatingCravings(selectedCravings) {
            var cravingIds = selectedCravings.map(function (a) { return a.CravingId !== undefined ? a.CravingId : a; });
            return cravingService.updateCravings(vm.dish.DishId, cravingIds).then(function (response) {
                vm.dish.Cravings = response.data.Items;
            }, function (err) {
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

        function prepareAddDishToProposal(proposal, ev) {
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
                            modalService.openModal('proposal/proposal_modal.html', 'ProposalModalController', { Dish: vm.dish, Proposal: proposal }, ev);
                        }, function (err) {
                            modalService.openModal('proposal/proposal_modal.html', 'ProposalModalController', { Dish: vm.dish, Proposal: proposal, AlreadyIn: true }, ev);
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
