(function () {
    'use strict';

    angular
        .module('app')
        .controller('ViewProposalController', viewProposalController);

    viewProposalController.$inject = ['ProposalService', 'DinerService', 'RestaurantService', 'NavigationService',
        '$timeout', '$rootScope', '$scope'];

    function viewProposalController(proposalService, dinerService, restService, navigationService,
        $timeout, $rootScope, $scope) {
        var vm = this;

        var confirm = $rootScope.$stateParams.confirm;

        vm.diner = undefined;
        vm.overlayTitle = "Craving Proposal";
        vm.coverClass = "bg-craving-proposal";

        vm.profile = {};
        vm.proposals = [];
        vm.votes = [];
        vm.currentKey = undefined;
        vm.selectedProposal = undefined;
        vm.proposalUrl = undefined;
        vm.savedSuccessfully = false;
        vm.message = '';
        vm.isLoaded = false;

        // events
        vm.getProposalTitle = getProposalTitle;
        vm.formateDate = formateDate;
        vm.voteItem = voteItem;
        vm.getIterations = getIterations;

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

        function formateDate(d) {
            if (d)
                return window.helper.formatDate(d);
            return "";
        }

        function voteItem(item) {
            if (proposalService.hasVoted(item, vm.profile.id)) {
                postInfo('');
                proposalService.removeVote(vm.selectedProposal, item).then(function (response) {
                    getProposalDetail();
                }, function (err) {
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

        function getIterations(counter) {
            var data = [];
            for (var i = 0; i < counter; i++) {
                data.push(i + 1);
            }
            return data;
        }

        // helpers
        function activate() {
            vm.currentKey = $rootScope.$stateParams.key;
            if (vm.currentKey) {
                getProposalDetail();
                if (confirm) {
                    // TODO: should display the just-added dish name
                    postInfo('Dish has been added to the craving proposal');
                }
            } else {
                postError('ah, you need a Key to open a Craing Proposal. Or create your own one now.');
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

        function getProposalDetail() {
            // this one gets the full detail, including items and votes 
            proposalService.getByKey(vm.currentKey).then(
                function (resp) {
                    if (resp.data)
                        vm.selectedProposal = resp.data;
                    else
                        vm.selectedProposal = resp;

                    if (vm.selectedProposal) {
                        if (vm.selectedProposal.IsExpired) {
                            postError('This craving proposal has expired. You are too late. They have gone for the food without you. ');
                        } else {
                            updateVotes();
                            postInfo('');
                        }

                        $scope.updatePageTitle('Craving Proposal - ' + getProposalTitle(vm.selectedProposal));
                        vm.proposalUrl = proposalService.getProposalUrl(vm.selectedProposal);
                        vm.isLoaded = true;
                    }
                }, function (err) {
                    postError('Snap! The Craving Proposal you are trying to open does not exist anymore. Check with your friend. ');
                });
        }

        function postInfo(message) {
            vm.savedSuccessfully = true;
            vm.message = message;
        }

        function postError(message) {
            vm.savedSuccessfully = false;
            vm.message = message;
        }
    }

})();
