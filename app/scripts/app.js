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
    .when('/shareCardView/:id', {
      templateUrl: 'views/shareCardView.html',
      controller: 'shareCardViewPageCtrl',
      resolve: {
        data: ['DataLoader' , '$route' , function (DataLoader , $route) {          
          return DataLoader('data/view.json?id=' + $route.current.params.id);
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


//check login status
module.run(['$rootScope', '$location', function($rootScope, $location) {  
  $rootScope.$on( "$locationChangeStart", function(event, next, current) {        
    var route = next.substring(next.indexOf("#")+2 || 0 , next.length);
    // replace checkLogin with your check function
    var checkLogin = false;
    if ( !checkLogin ) {
      // no logged user, check route
      // if ( route == "collectTask" || route == "cardFactory" || route == "giftBox") {
      //   //redirect & do something        
      //   alert("這個需要登入唷");
      //   event.preventDefault();        
      // }
    }         
  });
}]);
