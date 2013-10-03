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
      // resolve: {
      //   data: ['ItineraryListDataLoader' , function (ItineraryListDataLoader) {
      //     return ItineraryListDataLoader();
      //   }]
      // }, 
    })
    .when('/cardFactory', {
      templateUrl: 'views/cardFactory.html',
      controller: 'cardFactoryPageCtrl',
      // resolve: {
      //   data: ['ItineraryInfoDataLoader' , function (ItineraryInfoDataLoader) {
      //     return ItineraryInfoDataLoader();
      //   }]
      // }, 
    })
    .when('/giftBox', {
      templateUrl: 'views/giftBox.html',
      controller: 'giftBoxPageCtrl',
      // resolve: {
      //   data: ['ItineraryInfoDataLoader' , function (ItineraryInfoDataLoader) {
      //     return ItineraryInfoDataLoader();
      //   }]
      // }, 
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
        data: ['TopListDataLoader' , function (TopListDataLoader) {
          return TopListDataLoader();
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
