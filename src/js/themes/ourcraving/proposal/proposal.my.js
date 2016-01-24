(function () {
    'use strict';

    angular
        .module('app')
        .controller('MyProposalController', myProposalController);

    myProposalController.$inject = ['ProposalService', 'DinerService', 'RestaurantService', 'NavigationService',
        '$timeout', '$rootScope','$scope'];

    // TODO:  I don't like this controller at this point, because it and ProposalService are mixing some logic in both places 
    // ideally, the ProposalService should be dumb, and it simply hits the REST. 
    // however, the ProposalService must handle the logic of an unsaved proposal, which can be interacted with other controllers 
    // need to figure out a better way to manage these relationship
    function myProposalController(proposalService, dinerService, restService, navigationService,
        $timeout, $rootScope, $scope) {
        var vm = this;

        vm.diner = undefined;
        vm.overlayTitle = "Craving Proposal";
        vm.coverClass = "bg-craving-proposal";
        vm.profile = {};
        vm.proposals = [];
        vm.votes = [];
        vm.currentKey = undefined;
        vm.selectedProposal = undefined;
        vm.proposalUrl = undefined;
        vm.titleInEdit = false;
        vm.updatingProposalName = "";
        vm.hasAnyExpiredProposal = false;
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.isLoaded = false;

        // events
        vm.getProposalTitle = getProposalTitle;
        vm.checkActive = checkActive;
        vm.extendProposal = extendProposal;
        vm.expireProposal = expireProposal;
        vm.isExpired = isExpired;
        vm.formateDate = formateDate;
        vm.copyUrl = copyUrl;
        vm.getIterations = getIterations;
        vm.voteItem = voteItem;
        vm.removeItem = removeItem;
        vm.removeProposal = removeProposal;
        vm.saveProposalName = saveProposalName;
        vm.filterByActive = filterByActive;
        vm.filterByExpiration = filterByExpiration;

        // initialize
        activate();

        // event handlers
        function getProposalTitle(proposal) {
            var title = "Unnamed";
            if (proposal) {
                if (!(proposal.Name === null || proposal.Name === undefined || proposal.Name === ""))
                    title = proposal.Name;
            }
            return title;
        }

        function saveProposalName() {
            if (vm.selectedProposal.Name !== vm.updatingProposalName) {
                proposalService.updateName(vm.selectedProposal.Id, vm.updatingProposalName).then(function (response) {
                    vm.selectedProposal.Name = vm.updatingProposalName;
                    vm.titleInEdit = false;
                    postInfo('');
                }, function (err) {
                    postError(err, vm);
                });
            }

        }

        function checkActive(proposal) {
            var retval = $rootScope.$state.is('proposal.home.detail', { 'key': proposal.Key }) ||
                (vm.proposals.length > 0 && vm.proposals[0].Key === proposal.Key && vm.currentKey === undefined);

            if (retval) return "active";
            return "";
        }

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }

        function isExpired(proposal) {
            if (proposal)
                return (proposal.IsExpired);

            return false;
        }

        function copyUrl() {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", vm.proposalUrl);
        }

        function filterByActive(proposal) {
            return proposal.IsExpired === true;
        }

        function filterByExpiration(proposal) {
            return proposal.IsExpired === false;
        }

        function extendProposal(proposal) {
            proposalService.extendProposal(proposal.Id).then(
                function () {
                    // for now I don't want to retrieve it again from the server side to refresh it, I know it could cause problem
                    // moreover, an unsaved proposal simply doesn't have a record in DB yet 
                    proposal.ExpirationDate = window.helper.getTodayPlus(30);
                    proposal.IsExpired = false;
                    checkHasAnyExpiredProposal();
                }, function (err) {
                    postError('Failed to expire proposal due to:' + err);
                });
        }

        function expireProposal(proposal) {
            proposalService.expireProposal(proposal.Id).then(
                function () {
                    proposal.ExpirationDate = window.helper.getTodayPlus(-1);
                    proposal.IsExpired = true;
                    vm.hasAnyExpiredProposal = true;
                }, function (err) {
                    postError('Failed to expire proposal due to:' + err);
                });
        }

        function voteItem(item) {
            if (proposalService.hasVoted(item, vm.profile.id)) {
                postInfo('');
                proposalService.removeVote(vm.selectedProposal, item).then(function (response) {
                    getProposalDetail();
                }, function(err) {
                    postError(err);
                });
            } else {
                // this is needed because a user might be able to vote more than 1 per proposal (in the future) 
                if (proposalService.canVote(vm.selectedProposal, vm.profile.id)) {
                    proposalService.castVote(vm.selectedProposal, item).then(function (response) {
                        if (response.status === 200) {
                            postInfo('');
                            // this is bad for performance, but it's the quickest way to refresh the data 
                            getProposalDetail();
                        }
                    }, function (err) {
                        vm.votes[item.RestaurantId] = false;
                        postError('Vote failed: it is likely that you have already voted');
                    });
                } else {
                    vm.votes[item.RestaurantId] = false;
                    postError('You have already voted! You can only vote once in each proposal.');
                }
            }
        }

        function removeItem(item) {
            // we still want to do a client-side check even the server side already checks
            if (vm.profile.id === vm.selectedProposal.CreatorId) {
                proposalService.removeItem(vm.selectedProposal, item).then(function (response) {
                    var findIdx = -1;
                    for (var idx = 0; idx < vm.selectedProposal.Items.length; idx++) {
                        if (vm.selectedProposal.Items[idx].DishId === item.DishId) {
                            findIdx = idx;
                            break;
                        }
                    }
                    if (findIdx > -1) {
                        vm.selectedProposal.Items.splice(findIdx);
                        syncTotalItems(vm.selectedProposal);
                    }
                    
                    postInfo('Removed successfully');
                }, function (err) {
                    postError('Only proposal owner can remove option.');
                });
            } else {
                postError('Only proposal owner can remove option.');
            }
        }

        function removeProposal(proposal) {
            if (vm.profile.id === vm.selectedProposal.CreatorId) {
                proposalService.removeCart(proposal.Id).then(function (response) {
                    navigationService.go('proposal.home', {}, { 'reload': true });
                }, function (err) {
                    postError('Trying to delete proposal failed, probably due to unthorized. If you think this is wrong, please contact us. ');
                });
            } else {
                postError('Only proposal owner can delete proposal.');
            }
        }

        function getIterations(counter) {
            var data = [];
            for (var i = 0; i < counter; i++) {
                data.push(i + 1);
            }
            return data;
        }

        // helpers
        function activate() {
            dinerService.getMyProfile().then(function () {
                vm.profile = dinerService.profile;

                proposalService.getByDiner(vm.profile.id).then(function (response) {
                    vm.proposals = response.data.Items;
                    if (vm.proposals.length > 0) {
                        vm.currentKey = $rootScope.$stateParams.key;
                        if (vm.currentKey) {
                            for (var idx = 0; idx < vm.proposals.length; idx++) {
                                if (vm.proposals[idx].Key === vm.currentKey) {
                                    vm.selectedProposal = vm.proposals[idx];
                                    break;
                                }
                            }
                        } else {
                            vm.selectedProposal = vm.proposals[0];
                        }
                    }

                    if (vm.selectedProposal) {
                        vm.proposalUrl = proposalService.getProposalUrl(vm.selectedProposal);
                        getProposalDetail();

                        $scope.updatePageTitle('Craving Proposal - ' + getProposalTitle(vm.selectedProposal));
                        vm.isLoaded = true;
                    }

                    checkHasAnyExpiredProposal();
                });
            }, function (err) {
                // this means this user is not authenticated yet, 
                // TODO: use the resumeService here 
            });
        }

        function getProposalDetail() {
            // this one gets the full detail, including items and votes 
            proposalService.getByKey(vm.selectedProposal.Key).then(
                function (resp) {
                    vm.selectedProposal = resp.data;
                    vm.updatingProposalName = vm.selectedProposal.Name;
                    if (vm.selectedProposal) {
                        updateVotes();
                    }
                });
        }

        function checkHasAnyExpiredProposal() {
            for (var idx = 0; idx < vm.proposals.length; idx++) {
                if (vm.proposals[idx].IsExpired === true) {
                    vm.hasAnyExpiredProposal = true;
                    break;
                }
            }
        }

        function updateVotes() {
            for (var x = 0 ; x < vm.selectedProposal.Items.length; x++) {
                var item = vm.selectedProposal.Items[x];
                if (item.Votes && item.Votes.length > 0) {
                    for (var y = 0; y < item.Votes.length; y++) {
                        if (vm.profile.id === item.Votes[y].DinerId) {
                            vm.votes[item.RestaurantId] = true;
                        }
                    }
                }
            }
        }

        function postInfo(message) {
            vm.savedSuccessfully = true;
            vm.message = message;
        }

        function postError(message) {
            vm.savedSuccessfully = false;
            vm.message = message;
        }

        function syncTotalItems(proposal) {

            var timer = $timeout(function() {
                $timeout.cancel(timer);
                for (var idx = 0; idx < vm.proposals.length; idx++) {
                    if (vm.proposals[idx].Key === proposal.Key) {
                        vm.proposals[idx].TotalItems = vm.proposals[idx].TotalItems - 1;
                    }
                }

                proposal.TotalItems = proposal.TotalItems - 1;
            });

        }
    }

})();
