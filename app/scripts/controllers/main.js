'use strict';

var app = angular.module('kidsCardApp.controllers', ['utility']);




var injectData = function($scope){
	$scope.bg = [
		{
			"topic": "simple",
			"thumb": "images/bg/1-1/001.jpg",
			"src": "images/bg/1-1/001-1.jpg"
		},
		{
			"topic": "simple",
			"thumb": "images/bg/1-1/002.jpg",
			"src": "images/bg/1-1/002-1.jpg"
		},
		{
			"topic": "simple",
			"thumb": "images/bg/1-1/003.jpg",
			"src": "images/bg/1-1/003-1.jpg"
		},
		{
			"topic": "simple",
			"thumb": "images/bg/1-1/004.jpg",
			"src": "images/bg/1-1/004-1.jpg"
		}
	];

	$scope.frame = [
		{
			"topic": "simple",
			"thumb": "images/frame/2-1/001.png",
			"src": "images/frame/2-1/001.png"
		},
		{
			"topic": "simple",
			"thumb": "images/frame/2-1/002.png",
			"src": "images/frame/2-1/002.png"
		},
		{
			"topic": "simple",
			"thumb": "images/frame/2-1/003.png",
			"src": "images/frame/2-1/003.png"
		},
		{
			"topic": "simple",
			"thumb": "images/frame/2-1/004.png",
			"src": "images/frame/2-1/004.png"
		},
				{
			"topic": "simple",
			"thumb": "images/frame/2-1/005.png",
			"src": "images/frame/2-1/005.png"
		},
		{
			"topic": "simple",
			"thumb": "images/frame/2-1/006.png",
			"src": "images/frame/2-1/006.png"
		},
		{
			"topic": "simple",
			"thumb": "images/frame/2-1/007.png",
			"src": "images/frame/2-1/007.png"
		}
	];

	$scope.adornment = [
		{
			"topic": "simple",
			"thumb": "images/adornment/3-1/001.jpg",
			"src": "images/adornment/3-1/001-1.png"
		},
		{
			"topic": "simple",
			"thumb": "images/adornment/3-1/002.jpg",
			"src": "images/adornment/3-1/002-1.png"
		},
		{
			"topic": "simple",
			"thumb": "images/adornment/3-1/003.jpg",
			"src": "images/adornment/3-1/003-1.png"
		},
		{
			"topic": "simple",
			"thumb": "images/adornment/3-1/004.jpg",
			"src": "images/adornment/3-1/004-1.png"
		},
				{
			"topic": "simple",
			"thumb": "images/adornment/3-1/005.jpg",
			"src": "images/adornment/3-1/005-1.png"
		},
		{
			"topic": "simple",
			"thumb": "images/adornment/3-1/006.jpg",
			"src": "images/adornment/3-1/006-1.png"
		},
		{
			"topic": "simple",
			"thumb": "images/adornment/3-1/007.jpg",
			"src": "images/adornment/3-1/007-1.png"
		}
	];

	$scope.word = [

	];

	$scope.graffiti = [

	];
}


var initData = function($scope){
	//function
	$scope.topic = "simple";
	$scope.isWindowOpen = false;
	$scope.openSection = "bg";
	$scope.adornmentIndex = 0;

	//canvas
	$scope.selected_bg = "transparent";
	$scope.selected_frame = "transparent";
	$scope.adornmentList = [];
}

app.controller('MainCtrl', [ '$scope' , '$timeout', 'extend' , function ($scope , $timeout , extend) {


	injectData($scope);
	initData($scope);
	
	

	$scope.closeWindow = function(){
		$scope.isWindowOpen = false;
	}
	$scope.openWindow = function(){
		$scope.isWindowOpen = true;
	}

	$scope.openSectionWindow = function(target){		
		$scope.openWindow();
		$scope.openSection = target;		
	}
	$scope.selectTopic = function(topic){
		$scope.topic = topic;
	}

	$scope.reset = function(){
		$scope.selected_bg = "transparent";
		$scope.selected_frame = "transparent";
	}

	$scope.selectBackground = function(src){		
		$scope.selected_bg = 'url(' + src + ') repeat;';
	}

	$scope.selectFrame = function(src){		
		$scope.selected_frame = 'url(' + src + ') no-repeat;';
	}

	$scope.addAdornment = function(item){
		var newObj = { 
			id: $scope.adornmentIndex++,
			src: item.src			
		}
		$scope.adornmentList.push(newObj);
		console.log($scope.adornmentList);
	}

	$scope.removeAdornment = function(index){
		// angular.forEach();
		$scope.adornmentList.
		console.log($scope.adornmentList);
	}

	
}]);
