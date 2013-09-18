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
		},

		//obj in list contain 'data' which function 'transform' use to adjust dom
		//now we convert it to 'style' which ng-style can digest and remove unnecessary data.
		convertDataToStyle : function(list){
			var returnList = [],
				newObj,
				transformStr = "",
				data;			
			
			angular.forEach(list , function(originalObj){					
				newObj = {
					id: originalObj.id,
					style: {},
					inner: {
						style: {}
					}
				}
				//copy style into inside 
				angular.forEach(originalObj.style , function(val, key){					
					newObj.inner.style[key] = val;
				});
				//width and height
				if(originalObj.data.W != 0){
					newObj.style["width"] = originalObj.data.W + "px";
				}
				if(originalObj.data.H != 0){
					newObj.style["height"] = originalObj.data.H + "px";					
				}
				//text
				if(originalObj.text != null){
					newObj.text = originalObj.text;
				}

			 	if(originalObj.data != null){
			 		data = originalObj.data;			 		
			 		transformStr = 'translate(' + (data.offsetX || 0) + 'px,' + (data.offsetY || 0) + 'px) ' + 
							'rotate(' + (data.rotateDegrees || 0) + 'deg) ' +
							'scale( ' + (data.scaleX || 1) + ', ' + (data.scaleY || 1) + ')';					
					newObj.style["-moz-transform"] = transformStr;
					newObj.style["-webkit-transform"] = transformStr;
					newObj.style["-o-transform"] = transformStr;
					newObj.style["-ms-transform"] = transformStr;

					//inner style
					if(originalObj.data.resizeInner && originalObj.data.inner != null){
						data = originalObj.data.inner;						
			 			transformStr = 'translate(' + (data.offsetX || 0) + 'px,' + (data.offsetY || 0) + 'px) ' + 
							'rotate(' + (data.rotateDegrees || 0) + 'deg) ' +
							'scale( ' + (data.scaleX || 1) + ', ' + (data.scaleY || 1) + ')';
						newObj.inner.style["-moz-transform"] = transformStr;
						newObj.inner.style["-webkit-transform"] = transformStr;
						newObj.inner.style["-o-transform"] = transformStr;
						newObj.inner.style["-ms-transform"] = transformStr;
					}
			 	}
			 	returnList.push(newObj);
			});			
			return returnList;
		}
	}
}]);


app.controller('MainCtrl' , [ '$scope' , 'shareCanvasDataService' , function($scope , shareCanvasDataService) {
	$scope.previewMode = false;

	$scope.openPreview = function () {		
		if(shareCanvasDataService.ready != false){
			$scope.previewMode = true;	
		}		
	}
	$scope.closePreview = function() {
		$scope.previewMode = false;
	}
}]);

app.controller('CardFactoryCtrl', [ '$scope' , '$http' , '$q' , '$timeout', 'StyleService' , 'shareCanvasDataService' ,
	function ($scope , $http , $q , $timeout , StyleService , shareCanvasDataService) {

	var changePageSizeEvent = function(){		
		if($scope.openSection === "adornment"){
			$scope.pageSize = 24;	
		}
		else{
			$scope.pageSize = 8;
		}
	}

	var initData = function($scope){
		//function
		$scope.isStart = false;
		$scope.topic = "simple";
		$scope.isWindowOpen = false;		
		$scope.openSection = null;
		$scope.adornmentIndex = 0;
		$scope.isLoadding = true;

		$scope.currentPage = 0;
		$scope.numberOfPages = 0;
		$scope.pageSize = 24;  //adornment is 24, bg frame and bubbler is 8

		$scope.adornmentLimit = 10;
		$scope.bubblerLimit = 5;

		//canvas
		$scope.selected_bg = { "background" : "transparent" };
		$scope.selected_frame = { "background" : "transparent" };
		$scope.adornmentList = [];
		$scope.bubblerList = [];
	}

	var injectFunction = function($scope){		
		$scope.$watch("openSection" , function(){			
			var targetSection = $scope[$scope.openSection];						
			if(targetSection != null){
				changePageSizeEvent();
				$scope.numberOfPages = Math.ceil($scope[$scope.openSection].length/$scope.pageSize);
			}
			else{
				$scope.numberOfPages = 0;
			}			
		});


		$scope.startFn = function(){						
			$scope.isStart = true;			
			$scope.$apply();			
		}

		$scope.setCurrentPage = function($index){
			$scope.currentPage = $index;
		}		

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
			$scope.closeWindow();
			if($scope.adornmentList.length >= $scope.adornmentLimit){
				alert("你已經用了太多的裝飾品囉");
				return;
			}
			var newObj = { 
				id: $scope.adornmentIndex++,
				src: item.src,
				style: StyleService.getBGStyle(item.src)		
			}
			$scope.adornmentList.push(newObj);		
			
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
			$scope.closeWindow();
			if($scope.bubblerList.length >= $scope.bubblerLimit){
				alert("你已經用了太多的對話框囉");
				return;
			}
			var newObj = { 
				id: $scope.adornmentIndex++,
				style: item.style
			}
			$scope.bubblerList.push(newObj);					
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

		var isBasicSetting = function(){
			if($scope.selected_bg.background == "transparent"){
				alert("先幫你的卡片加個背景吧");
				return false;
			}
			if($scope.selected_frame.background == "transparent"){
				alert("先挑選個好看的邊框吧");
				return false;
			}
			return true;
		}

		$scope.preview = function(callback){
			//check if user had set background and frame			
			var canvasData = {};
			canvasData.selected_bg = $scope.selected_bg;
			canvasData.selected_frame = $scope.selected_frame;

			canvasData.adornmentList = StyleService.convertDataToStyle($scope.adornmentList);
			canvasData.bubblerList = StyleService.convertDataToStyle($scope.bubblerList);

			shareCanvasDataService.shareData = canvasData;						
			shareCanvasDataService.ready = isBasicSetting() ? true : false;
			//shareCanvasDataService.ready = true;


			shareCanvasDataService.refresh();			
		}
	}

	initData($scope);
	injectFunction($scope);	

	//LOAD DATA	
	$scope.$watch("topic" , function(){		
		$scope.isLoadding = true;		
		$scope.bg = [];
		$scope.frame = [];
		$scope.adornment = [];
		$scope.bubbler = [];		
		$q.all([
			$http.get("data/" + $scope.topic + ".json").success(function(data){				
				$scope.bg = data.bg;
				$scope.frame = data.frame;
				$scope.adornment = data.adornment;
				$scope.bubbler = data.bubbler;	
				//refresh pageNo				
				if($scope.openSection != null){
					$scope.numberOfPages = Math.ceil($scope[$scope.openSection].length/$scope.pageSize);
				}
				$scope.currentPage = 0;
			}),
			$http.get("data/graffiti.json").success(function(data){
				$scope.graffiti = data.graffiti;
			})
	    ]).then(function(){	    
        	$scope.isLoadding = false;	        
	    });		
	});	
		
}]);

app.controller('PreviewCtrl', [ '$scope' , '$timeout' , 'shareCanvasDataService' , 
	function ($scope , $timeout , shareCanvasDataService) {

		shareCanvasDataService.refresh = function(){			
			$scope.adornmentList = [];
			$scope.bubblerList = [];
			//using timeout to force $digest
			$timeout(function(){				
				$scope.selected_bg = shareCanvasDataService.shareData.selected_bg;
				$scope.selected_frame = shareCanvasDataService.shareData.selected_frame;
				$scope.adornmentList = shareCanvasDataService.shareData.adornmentList;
				$scope.bubblerList = shareCanvasDataService.shareData.bubblerList;					
			}, 1);
		}		


		$scope.save = function(){
			var saveObj = {
				"selected_bg" : $scope.selected_bg,
				"selected_frame" : $scope.selected_frame,
				"adornmentList" : $scope.adornmentList,
				"bubblerList" : $scope.bubblerList
			}
			alert("以下資訊會送往後端儲存:" + JSON.stringify(saveObj));			
		}
}]);