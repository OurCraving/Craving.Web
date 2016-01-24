module.exports = function ($stateProvider) {
    $stateProvider.state('proposal',
        {
            "abstract": true,
            url: '/proposal',
            views: {
                'app': {
                    templateUrl: 'layout/shell_center_content.html',
                    controller: [
                        '$scope', function ($scope) {
                            $scope.app.settings.htmlClass = 'hide-sidebar top-navbar ls-bottom-footer-fixed';
                        }
                    ]
                }
            }
        })
        .state('proposal.home', {
            url: '/craving',
            views: {
                'content@proposal': {
                    templateUrl: 'proposal/home.html',
                    controller: 'MyProposalController',
                    controllerAs: 'vm'
                }
            }
        })
         .state('proposal.home.detail', {
             url: '/:key',
             views: {
                 'content@proposal': {
                     templateUrl: 'proposal/home.html',
                     controller: 'MyProposalController',
                     controllerAs: 'vm'
                 }
             }
         })
        // this is used by other users to open the craving proposal
        // if the owner sends this link manually, email querystring is empty; 
        // if the owner uses our online form to send to a friend, the querystring should contain the value for each email entered in the box 
        .state('proposal.view', {
            url: '/view/:key?email&confirm',
            views: {
                'content@proposal': {
                    templateUrl: 'proposal/view.html',
                    controller: 'ViewProposalController',
                    controllerAs: 'vm'
                }
            }
        });
};