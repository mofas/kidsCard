'use strict';

var module = angular.module('kidsCardView', ['services']);

module.controller('ViewCtrl' , [ '$scope' , '$http' , 'synScopeAndData' , 
	function($scope , $http , synScopeAndData) {

	// Load data
	$http.get("data/view.json").success(function(data){				
		synScopeAndData($scope , data);
	});	

	
}]);
