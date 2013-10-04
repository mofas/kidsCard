'use strict';

var app = angular.module('kidsCardApp', [	
	'ngRoute',
	'ngAnimate',
	
	'directive',
  'ui',
  'filter',
  'kidsCardApp.controllers'
]);

app.config([ '$routeProvider' , function ($routeProvider) {
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
      controller: 'cardListPageCtrl',
      // resolve: {
      //   data: ['ItineraryInfoDataLoader' , function (ItineraryInfoDataLoader) {
      //     return ItineraryInfoDataLoader();
      //   }]
      // }, 
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
      // resolve: {
      //   data: ['ItineraryInfoDataLoader' , function (ItineraryInfoDataLoader) {
      //     return ItineraryInfoDataLoader();
      //   }]
      // }, 
    })

    .otherwise({
      redirectTo: '/'
    });
}]);
