module.exports = function ($stateProvider) {
    $stateProvider
           .state('app', {
               "abstract": true,
               url: '',
               views: {
                   'app': {
                       templateUrl: 'layout/shell.html'
                   }
               }
           })
           .state('app.home', {
               url: '/home',
               views: {
                   'content@app': {
                       templateUrl: 'craving/home.html',
                       controller: "CravingTagsController",
                       controllerAs: "vm"
                   }
               }
           })
       .state('app.home.search', {
           url: '^/search/:criteria',
           views: {
               'content@app': {
                   templateUrl: 'craving/search.html',
                   controller: "SearchCravingController",
                   controllerAs: "vm"
               }
           }
       })
           .state('app.help', {
               url: '^/help',
               views: {
                   'content@app': {
                       templateUrl: 'sys/help.html',
                       controller: ['$scope', function ($scope) {
                           $scope.app.settings.pageTitle = 'OurCraving - Help & FAQ';
                       }]
                   }
               }
           })
           .state('app.about', {
               url: '^/aboutus',
               views: {
                   'content@app': {
                       templateUrl: 'sys/about.html',
                       controller: ['$scope', function ($scope) {
                           $scope.app.settings.pageTitle = 'OurCraving - About Us';
                       }]
                   }
               }
           })
           .state('app.termsconditions', {
               url: '^/termsconditions',
               views: {
                   'content@app': {
                       templateUrl: 'sys/terms.html',
                       controller: ['$scope', function ($scope) {
                           $scope.app.settings.pageTitle = 'OurCraving - Terms and Conditions';
                       }]
                   }
               }
           })
           .state('app.location', {
               url: '^/location',
               views: {
                   'content@app': {
                       templateUrl: 'sys/location.html',
                       controller: 'LocationController',
                       controllerAs: 'vm'
                   }
               }
           });
};