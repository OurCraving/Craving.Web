(function () {
    'use strict';

    var defaultKey = "12345";
    angular
        .module('app')
        .service('ProposalService', proposalService);

    proposalService.$inject = ['RestaurantService', '$http', '$q', 'logger', 'baseUrl2', '$rootScope'];

    function proposalService(restService, $http, $q, logger, baseUrl2, $rootScope) {
        var serviceBase = baseUrl2;
        var service = {
            // events
            getByDiner: getByDiner,
            getByKey: getByKey,
            getProposalUrl: getProposalUrl,

            addItem: addItem,
            castVote: castVote,
            createProposal: createProposal,
            extendProposal: extendProposal,
            expireProposal: expireProposal,
            reactivate: reactivate,
            updateName: updateName,

            removeVote: removeVote,
            removeCart: removeCart,
            removeItem: removeItem,

            hasVoted: hasVoted,
            canVote: canVote,

            // properties
            proposals: []
    };

        return service;

        function getProposalUrl(proposal) {
            return $rootScope.$state.href('proposal.view', { key: proposal.Key }, { absolute: true });
        }

        function getByDiner(dinerId) {
            var deferred = $q.defer();
            $http.get(serviceBase + "cravingcart/diner/" + dinerId).then(function (response) {
                if (response.data) {
                    service.proposals = response.data.Items;
                }
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getByKey(key) {
            return $http.get(serviceBase + "cravingcart/" + key);
        }

        function reactivate(cartId) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/extend");
        }

        function removeItem(proposal, item) {
            var cartId = proposal.Id;
            var itemId = item.Id;

            return $http.delete(serviceBase + "cravingcart/" + cartId + "/item/" + itemId);
        }

        function removeCart(cartId) {
            return $http.delete(serviceBase + "cravingcart/" + cartId);
        }

        function castVote(proposal, item) {
            var cartId = proposal.Id;
            var itemId = item.Id;

            // I don't need to pass dinerId, because the service side will load it automatically if the user is logged in
            return $http.put(serviceBase + "cravingcart/" + cartId + "/vote/" + itemId);
        }

        function removeVote(proposal, item) {
            var cartId = proposal.Id;
            var itemId = item.Id;
            return $http.delete(serviceBase + "cravingcart/" + cartId + "/vote/" + itemId);
        }

        function hasVoted(item, dinerId) {
            if (item.Votes) {
                for (var idx = 0; idx < item.Votes.length; idx++) {
                    if (item.Votes[idx].DinerId === dinerId)
                        return true;
                }
            }
            return false;
        }

        function canVote(proposal, dinerId) {
            // this method returns false as long as this dinerId has voted to any, however, the server side has a value that is configureable per proposal
            // currently we are not using that value, but we might think about it later 
            var curr = proposal;
            if (curr && curr.Items) {
                for (var idx = 0; idx < curr.Items.length; idx++) {
                    var votes = curr.Items[idx].Votes;
                    if (votes) {
                        for (var j = 0; j < votes.length; j++) {
                            if (votes[j].DinerId === dinerId) {
                                return false;
                            }
                        }
                    }
                }
            }

            return true;
        }

        function extendProposal(cartId) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/extend");
        }

        function expireProposal(cartId) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/expire");
        }

        function updateName(cartId, name) {
            return $http.put(serviceBase + "cravingcart/" + cartId + "/name", '"' + name + '"').then(function() {
                for (var idx = 0; idx < service.proposals.length; idx++) {
                    if (service.proposals[idx].Id == cartId) {
                        service.proposals[idx].Name = name;
                    }
                }
            });
        }

        function createProposal(proposal) {
            return $http.post(serviceBase + "cravingcart", proposal);
        }

        // this service method is not responsible for what to do if there is no proposal or if the user is not authenticated 
        function addItem(dish, proposal) {
            return $http.put(serviceBase + "cravingcart/" + proposal.Id + "/item/", {
                "RestaurantId": dish.RestaurantId,
                "DishId": dish.DishId
            });
        }
    }
})();