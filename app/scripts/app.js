'use strict';

var module = null;

module = angular.module('kidsCardApp', [	
	'ngRoute',
	'ngAnimate',
	
	'directive',
  'ui',
  'filter',
  'kidsCardApp.controllers'
]);

module.config([ '$routeProvider' , function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html',
      controller: 'IndexPageCtrl'      
    })
    .when('/collectTask', {
      templateUrl: 'views/collectTask.html',
      controller: 'collectTaskPageCtrl',
    })
    .when('/cardFactory', {
      templateUrl: 'views/cardFactory.html',
      controller: 'cardFactoryPageCtrl',
    })
    .when('/giftBox', {
      templateUrl: 'views/giftBox.html',
      controller: 'giftBoxPageCtrl',
      resolve: {
        data: ['DataLoader' , function (DataLoader) {
          return DataLoader('data/giftBox.json');
        }]
      }, 
    })
    .when('/cardList', {
      templateUrl: 'views/cardList.html',
      controller: 'cardListPageCtrl'
    })
    .when('/shareCardView', {
      templateUrl: 'views/shareCardView.html',
      controller: 'shareCardViewPageCtrl',
      resolve: {
        data: ['DataLoader' , function (DataLoader) {
          return DataLoader('data/view.json');
        }]
      },
    })
    .when('/myCardList', {
      templateUrl: 'views/cardList.html',
      controller: 'cardListPageCtrl'
    })
    .when('/voteList', {
      templateUrl: 'views/voteList.html',
      controller: 'voteListPageCtrl'
    })
    .when('/topList', {
      templateUrl: 'views/topList.html',
      controller: 'topListPageCtrl',
      resolve: {
        data: ['DataLoader' , function (DataLoader) {
          return DataLoader('data/topList.json');
        }]
      }, 
    })
    .when('/reward', {
      templateUrl: 'views/reward.html',
      controller: 'rewardPageCtrl',
    })

    .otherwise({
      redirectTo: '/'
    });
}]);
