'use strict';

module = angular.module('kidsCardApp.controllers', ['utility' , 'services']);


/*
* Route Controller
*/
module.controller('IndexPageCtrl', [ function () {
		
}]);


module.controller('collectTaskPageCtrl', [ function () {
		
}]);


module.controller('giftBoxPageCtrl', [ '$scope' , 'data' , function ($scope , data) {

	$scope.bg = data.bg;
	$scope.frame = data.frame;
	$scope.adornment = data.adornment;
	$scope.special = data.special;

	$scope.openBoxMode = null;
	$scope.openBoxMessage = null;

	$scope.openBox = function(type){


		if($scope[type].giftBoxCount < 1){			
			alert("你已經把禮物開完囉！看看還少了什麼，再玩一次遊戲吧~");
			return;
		}
		$scope[type].giftBoxCount -= 1;
		$scope.openBoxMode = type;

		//AJAX HERE
		/***************************************************************/
		/*  DEMO CODE
		/***************************************************************/
		if (type === 'bg') {
			var rI = Math.floor(Math.random()*$scope.bg.giftThumb.length);
			$scope.openBoxMessage = "恭喜你得到可愛背景囉！";
			$scope.bg.giftThumb[rI].src = $scope.bg.giftThumb[rI].src.replace("d_" , "");
		} else if (type === 'frame') {
			var rI = Math.floor(Math.random()*$scope.frame.giftThumb.length);
			$scope.openBoxMessage = "恭喜你得到可愛邊框囉！";
			$scope.frame.giftThumb[rI].src = $scope.frame.giftThumb[rI].src.replace("d_" , "");
		} else if (type === 'adornment') {
			var rI = Math.floor(Math.random()*$scope.adornment.giftThumb.length);
			$scope.openBoxMessage = "恭喜你得到可愛裝飾品囉！";
			$scope.adornment.giftThumb[rI].src = $scope.adornment.giftThumb[rI].src.replace("d_" , "");
		} else if (type === 'special') {			
			var rI = Math.floor(Math.random()*$scope.special.giftThumb.length);			
			$scope.openBoxMessage = "恭喜呀米得到新寵物囉！";
			$scope.special.giftThumb[rI].src = $scope.special.giftThumb[rI].src.replace("d_sp" , "sp_"+(rI+1) );
		}
		/***************************************************************/
		
	}

	$scope.closeAnimation = function(){
		$scope.openBoxMode = null;	
	}

}]);


module.controller('cardListPageCtrl', [ '$scope' , '$http' , '$location' , 'synScopeAndData' ,  
	function ($scope , $http , $location , synScopeAndData) {	

	//Pagination
	$scope.$base = 0;

	$scope.setCurrentPage = function($index){			
		$scope.currentPage = $index;
		while(($index - $scope.$base > 7)){
			$scope.$base += 1;
		}
		while( $index - $scope.$base < 2 && $scope.$base > 0){				
			$scope.$base -= 1;
		}			
	}

	$scope.prevPage = function(){
		$scope.$base = ( $scope.$base - 10 < 0 ) ? 0 : $scope.$base - 10;			
		$scope.currentPage = ( $scope.currentPage - 10 < 0 ) ? 0 : $scope.currentPage - 10;		
	}
	$scope.nextPage = function(){
		$scope.$base = ($scope.$base + 20 > $scope.numberOfPages) ? $scope.numberOfPages - 10 : $scope.$base + 10;			
		$scope.currentPage = ( $scope.currentPage + 10  >= $scope.numberOfPages ) ? $scope.numberOfPages-1 : $scope.currentPage + 10;		
	}

	$scope.numberOfPages = 0;
	$scope.currentPage = 0;


	$scope.$watch("currentPage" , function(){
		$scope.list = [];
		$http.get("data/card_list.json?currentPage=" + $scope.currentPage + "&listType=" + $location.$$path).success(function(data){
			$scope.list = data.list;
			$scope.numberOfPages = data.numberOfPages;
		});
	});	


	//Popbox
	$scope.viewCard = function(dataHerf , id){		
		$http.get(dataHerf).success(function(data){
			synScopeAndData($scope, data);
			$scope.viewCardId = id;
			$scope.openWindow();
		});	
	}
	$scope.openWindow = function(){
		$scope.cardViewWrap = $scope.cardViewWrap || angular.element(document.getElementById("cardViewWrap"));
		$scope.cardViewWrap.addClass("open");
		$scope.previewMode = true;
	}

	$scope.closeWindow = function(){		
		$scope.cardViewWrap.removeClass("open");
		$scope.previewMode = false;
	}


	//Vove related function

	//Please change mode when vote begin
	$scope.voteMode = true;

	$scope.voteCard = function(id){
		alert("妳投了" + id + "一票");
		//Write your AJAX HERE
	}


	//Share related function
	$scope.share = function(){
		window.open(
    	'https://www.facebook.com/sharer/sharer.php?u=' + "http://kids.yam.com/",
    	'facebook-share-dialog', 
    	'width=626,height=436'
    );     		
	}		

}]);

module.controller('shareCardViewPageCtrl', [ '$scope' , 'data' , 'synScopeAndData' ,
	function ($scope , data , synScopeAndData) {	
		synScopeAndData($scope , data);
}]);



module.controller('topListPageCtrl', [ '$scope' , 'data' , function ($scope , data) {	
	$scope.list = data.list;
}]);


module.controller('rewardPageCtrl', [ function () {
		
}]);

module.controller('cardFactoryPageCtrl' , [ '$scope' , 'shareCanvasDataService' , function($scope , shareCanvasDataService) {
	$scope.previewMode = false;

	$scope.openPreview = function () {		
		if(shareCanvasDataService.ready != false){
			$scope.previewMode = true;
			document.body.style.overflow = "hidden";
		}		
	}
	$scope.closePreview = function() {
		$scope.previewMode = false;
		document.body.style.overflow = "auto";
	}
}]);






/*
* Component Controller
*/

module.controller('menuCtrl', [ '$scope' , '$location' , function($scope , $location){	
	var checkRoute = function(){
		$scope.currentLoaction = $location.$$url;
		$scope.isShow = ($scope.currentLoaction === '/index' || $scope.currentLoaction === '/' ) ? false : true;	
	}

	checkRoute();
	$scope.$on('$routeChangeStart', function(next, current) { 		  	
		checkRoute();
	});		

}]);

module.controller('cardFactoryCtrl', [ '$scope' , '$http' , '$q' , '$timeout', 'StyleService' , 'shareCanvasDataService' ,
	function ($scope , $http , $q , $timeout , StyleService , shareCanvasDataService) {

		var changePageSizeEvent = function(){													
			$scope.numberOfPages = Math.ceil($scope.itemList.length/$scope.pageSize);			
		}

		var changeTopic = function(){		
			$scope.lastTopic = $scope.topic;
			if($scope.rawItemListObj.length > 0){
				angular.forEach($scope.rawItemListObj , function(obj){
					if(obj.name === $scope.topic){
						$scope.itemList = obj.list;
					}
				});			 
			} else {
				$scope.itemList = [];
			}

			// Refresh pageNo							
			$scope.currentPage = 0;
			changePageSizeEvent();		
		}

		var changeSection = function(){
			$scope.categoryList = [];		
			$http.get("data/" + $scope.openSection + ".json").success(function(data){				
				$scope.rawItemListObj = data;				
				if(data[0] != null){
					$scope.topic = data[0].name;
					angular.forEach($scope.rawItemListObj , function(obj){					
						$scope.categoryList.push({ name : obj.name , categoryBtn: obj.categoryBtn });					
					});
				}
				changeTopic();
				$scope.isLoadding = false;
			});	
		}

		var initData = function($scope){
			// UI 
			$scope.isStart = false;
			$scope.topic = null;
			$scope.lastTopic = null;
			$scope.isWindowOpen = false;		
			$scope.lastOpenSection = null;
			$scope.openSection = "bg";
			$scope.adjustObjIndex = 0;
			$scope.isLoadding = true;

			$scope.rawItemListObj = {};
			$scope.categoryList = [];
			$scope.itemList = [];

			$scope.currentPage = 0;
			$scope.numberOfPages = 0;
			$scope.pageSize = 8;

			$scope.adornmentLimit = 10;
			$scope.bubblerLimit = 5;
			$scope.graffitiLimit = 1;

			// Canvas
			$scope.selected_bg = { "background" : "transparent" };
			$scope.selected_frame = { "background" : "transparent" };
			$scope.adornmentList = [];
			$scope.bubblerList = [];
			$scope.graffitiList = [];
		}

		var injectFunction = function($scope){		

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
				$scope.isStart = true;
				$scope.openSection = target;		
			}

			$scope.selectTopic = function(topic){
				$scope.topic = topic;
			}

			$scope.reset = function(){
				$scope.selected_bg = { "background" : "transparent" };
				$scope.selected_frame = { "background" : "transparent" };
				$scope.adornmentList = [];
				$scope.bubblerList = [];
				$scope.graffitiList = [];
			}

			$scope.selectItem = function(item){			
				if($scope.openSection == "bg"){
					$scope.selectBackground(item.src);
				} else if($scope.openSection == "frame") {
					$scope.selectFrame(item.src);
				} else if($scope.openSection == "adornment") {
					$scope.addAdornment(item);
				} else if($scope.openSection == "bubbler") {
					$scope.addBubbler(item);
				} else if($scope.openSection == "graffiti") {
					$scope.addGraffiti(item);
				}
			}

			$scope.selectBackground = function(src){				
				$scope.selected_bg = $scope.getBGObj(src);
			}

			$scope.selectFrame = function(src){		
				$scope.selected_frame = $scope.getBGObj(src);
			}

			$scope.getBGObj = function(src){
				return StyleService.getBGStyle(src);	
			}

			$scope.addAdornment = function(item){
				$scope.closeWindow();
				if($scope.adornmentList.length >= $scope.adornmentLimit){
					alert("你已經用了太多的裝飾品囉");
					return;
				}
				var newObj = { 
					id: $scope.adjustObjIndex++,
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
					id: $scope.adjustObjIndex++,
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

			$scope.addGraffiti = function(item){
				$scope.closeWindow();
				if($scope.graffitiList.length >= $scope.graffitiLimit){
					alert("只能使用一張塗鴉唷");
					return;
				}
				var newObj = { 
					id: $scope.adjustObjIndex++,
					src: item.src,
					style: StyleService.getBGStyle(item.src)
				}
				$scope.graffitiList.push(newObj);					
			}

			$scope.removeGraffiti = function(id){
				var index = null;
				angular.forEach($scope.graffitiList , function(obj , i){		 	
					if( obj.id == id){
						index = i;
					}
				});
				$scope.graffitiList.splice(index , 1);			
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
				// Check user had set background and frame			
				var canvasData = {};
				canvasData.selected_bg = $scope.selected_bg;
				canvasData.selected_frame = $scope.selected_frame;

				canvasData.adornmentList = StyleService.convertDataToStyle($scope.adornmentList);
				canvasData.bubblerList = StyleService.convertDataToStyle($scope.bubblerList);
				canvasData.graffitiList = StyleService.convertDataToStyle($scope.graffitiList);

				shareCanvasDataService.shareData = canvasData;						
				shareCanvasDataService.ready = isBasicSetting() ? true : false;				

				shareCanvasDataService.refresh();			
			}
		}

		initData($scope);
		injectFunction($scope);	

		// Load data
		$scope.$watch("openSection+topic" , function(){		
			$scope.isLoadding = true;		

			// Change section
			if($scope.lastOpenSection != $scope.openSection){
				changeSection();
				$scope.lastOpenSection = $scope.openSection;
			} else if($scope.lastTopic != $scope.topic) {
				changeTopic();
				$scope.isLoadding = false;
			} else {
				$scope.isLoadding = false;	
			}
		});	

}]);

module.controller('previewCtrl', [ '$scope' , '$timeout' , 'shareCanvasDataService' , 'synScopeAndData' ,
	function ($scope , $timeout , shareCanvasDataService , synScopeAndData) {

		shareCanvasDataService.refresh = function(){
			synScopeAndData($scope , shareCanvasDataService.shareData);
		}		

		$scope.save = function(){
			var saveObj = {
				"selected_bg" : $scope.selected_bg,
				"selected_frame" : $scope.selected_frame,
				"adornmentList" : $scope.adornmentList,
				"bubblerList" : $scope.bubblerList,
				"graffitiList" : $scope.graffitiList,
			}
			alert("以下資訊會送往後端儲存:" + JSON.stringify(saveObj));
			console.log(JSON.stringify(saveObj));
		}

		$scope.sendMail = function(){
			alert("功能尚未完成,敬請期待");
		}
}]);