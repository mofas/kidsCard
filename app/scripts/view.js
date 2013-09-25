'use strict';

var app = angular.module('kidsCardView', []);

app.controller('ViewCtrl' , [ '$scope' , '$http' , function($scope , $http) {

	// Load data
	$http.get("data/view.json").success(function(data){				
		$scope.selected_bg = data.selected_bg;
		$scope.selected_frame =	data.selected_frame;
		$scope.adornmentList = data.adornmentList;
		$scope.bubblerList = data.bubblerList;
	});	

	
}]);
