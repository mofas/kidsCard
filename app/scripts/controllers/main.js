'use strict';

var app = angular.module('kidsCardApp.controllers', ['utility']);

app.service('shareCanvasDataService', [ function () {
	return { shareData : {} }
}]);

app.service('StyleService', [ function () {
	return {		
		getBGStyle : function(bg){						
			if(bg === "transparent"){
				return { 'background' : 'transparent'}
			}			
			//color code
			else if(bg.indexOf("#") == 0){
				return {
					'background' : bg
				}
			}
			//IMAGES
			else{
				return{
					'background' : 'url(' + bg + ') no-repeat',
				}
			}
		}
	}
}]);



app.controller('MainCtrl' , [ '$scope' , function($scope) {
	$scope.previewMode = false;
	$scope.openPreview = function () {
		$scope.previewMode = true;
	}
	$scope.closePreview = function() {
		$scope.previewMode = false;
	}
}]);

app.controller('CardFactoryCtrl', [ '$scope' , '$timeout', 'StyleService' , 'shareCanvasDataService' ,
	function ($scope , $timeout , StyleService , shareCanvasDataService) {


	var initData = function($scope){
		//function
		$scope.topic = "simple";
		$scope.isWindowOpen = false;
		$scope.openSection = "bg";
		$scope.adornmentIndex = 0;

		//canvas
		$scope.selected_bg = { "background" : "transparent" };
		$scope.selected_frame = { "background" : "transparent" };
		$scope.adornmentList = [];
		$scope.bubblerList = [];

	}

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

		$scope.bubbler = [
			{
				"topic": "simple",
				"style": { "border" : "4px dashed #FF88A",  "border-radius" : "35px", "background": "#FFC1D1"},
				"thumb": "images/bubbler/001.png"
			},
			{
				"topic": "simple",
				"style": { "border" : "4px dashed #FFB19",  "border-radius" : "35px", "background": "#FFD0C1"},
				"thumb": "images/bubbler/002.png"
			},
			{
				"topic": "simple",
				"style": { "border" : "4px dashed #93E69",  "border-radius" : "35px", "background": "#BDF1C0"},
				"thumb": "images/bubbler/003.png"
			},
			{
				"topic": "simple",
				"style": { "border" : "4px dashed #93C2E",  "border-radius" : "35px", "background": "#BDDBF1"},
				"thumb": "images/bubbler/004.png"
			},
			{
				"topic": "simple",
				"style": { "border" : "4px dashed #BE93E",  "border-radius" : "35px", "background": "#D7BDF1"},
				"thumb": "images/bubbler/005.png"
			},
			{
				"topic": "simple",
				"style": { "border" : "4px dashed #FF88A6", "border-radius" : "100px", "background": "#FFC1D1"},
				"thumb": "images/bubbler/006.png"
			}
		];

		$scope.graffiti = [

		];
	}

	var injectFunction = function($scope){

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
			$scope.adornmentList = [];
			$scope.bubblerList = [];
		}

		$scope.selectBackground = function(src){		
			$scope.selected_bg = StyleService.getBGStyle(src);			
		}

		$scope.selectFrame = function(src){		
			$scope.selected_frame = StyleService.getBGStyle(src);
		}

		$scope.addAdornment = function(item){
			var newObj = { 
				id: $scope.adornmentIndex++,
				src: item.src,
				style: StyleService.getBGStyle(item.src)		
			}
			$scope.adornmentList.push(newObj);		
			$scope.closeWindow();
		}

		$scope.removeAdornment = function(id){
			var index = null;
			 angular.forEach($scope.adornmentList , function(obj , i){		 	
			 	if( obj.id == id){
			 		index = i;
			 	}
			 });
			$scope.adornmentList.splice(index , 1);		
		}


		$scope.addBubbler = function(item){
			var newObj = { 
				id: $scope.adornmentIndex++,
				style: item.style
			}
			$scope.bubblerList.push(newObj);		
			$scope.closeWindow();
		}

		$scope.removeBubbler = function(id){
			var index = null;
			 angular.forEach($scope.bubblerList , function(obj , i){		 	
			 	if( obj.id == id){
			 		index = i;
			 	}
			 });
			$scope.bubblerList.splice(index , 1);			
		}

		$scope.preview = function(){			
			var canvasData = {};
			canvasData.selected_bg = $scope.selected_bg;
			canvasData.selected_frame = $scope.selected_frame;
			canvasData.adornmentList = $scope.adornmentList;
			canvasData.bubblerList = $scope.bubblerList;						
			shareCanvasDataService.shareData = canvasData;
			shareCanvasDataService.refresh();			
		}
	}

	initData($scope);
	injectData($scope);
	injectFunction($scope);	
	
}]);

app.controller('PreviewCtrl', [ '$scope' , '$timeout' , 'shareCanvasDataService' , 
	function ($scope , $timeout , shareCanvasDataService) {
	
		shareCanvasDataService.refresh = function(){			
			$scope.adornmentList = [];
			$scope.bubblerList = [];
			//timeout force $digest
			$timeout(function(){
				$scope.selected_bg = shareCanvasDataService.shareData.selected_bg;
				$scope.selected_frame = shareCanvasDataService.shareData.selected_frame;
				$scope.adornmentList = shareCanvasDataService.shareData.adornmentList;
				$scope.bubblerList = shareCanvasDataService.shareData.bubblerList;					
			}, 1);
		}		
}]);