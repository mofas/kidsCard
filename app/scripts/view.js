'use strict';

var app = angular.module('kidsCardView', ['services']);

app.controller('ViewCtrl' , [ '$scope' , '$http' , 'synScopeAndData' , 
	function($scope , $http , synScopeAndData) {

	// Load data
	$http.get("data/view.json").success(function(data){				
		// $scope.selected_bg = data.selected_bg;
		// $scope.selected_frame =	data.selected_frame;
		// $scope.adornmentList = data.adornmentList;
		// $scope.bubblerList = data.bubblerList;
		// $scope.graffitiList = data.graffitiList;
		synScopeAndData($scope , data);
	});	

	
}]);
