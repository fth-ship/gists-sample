var Gists = new Mongo.Collection('gists');
var gists = null;

if (Meteor.isClient) {
    gists = angular.module('gists', ['angular-meteor', 'ui.router']);

    gists
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $locationProvider) {
            $locationProvider.html5Mode(true);

            $stateProvider
                .state('gists', {
                    url: '/',
                    templateUrl: 'gists.ng.html',
                    controller: 'GistsCtrl'
                })
                .state('gist', {
                    url: '/gist/:_id',
                    templateUrl: 'gist.ng.html',
                    controller: 'GistCtrl'
                });

            $urlRouterProvider.otherwise('/');
        }]);

    gists
        .controller('GistsCtrl', ['$scope', '$meteor', '$log', function ($scope, $meteor, $log) {
           $log.debug('Gists controller'); 
           $scope.gists = $meteor.collection(Gists).subscribe('gists');

           $scope.saveGist = function (fileName, fileContent) {
               $log.debug('gist was saved!');
               $scope.gists.save({ name: fileName, content: fileContent, createdAt: Date.now(), updatedAt: Date.now() });
           };
        }])
        .controller('GistCtrl', ['$scope', '$meteor', '$log', '$stateParams', function ($scope, $meteor, $log, $stateParams) {
            $log.debug('Gist controller');
            $scope.gist = $meteor.object(Gists, $stateParams._id).subscribe('gists');
        }])
        .filter('prettyDate', function () {
            return function (input) {
                return moment(input).format('DD/MM/YYYY');
            };
        });
    
    gists
        .run(function ($log) {
            $log.debug('Gists running!');
        });
}

if (Meteor.isServer) {
    Meteor.publish('gists', function () {
        return Gists.find({});
    });
}
