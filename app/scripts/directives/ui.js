'use strict';


var ui = angular.module('ui' , ['utility']);


ui.factory("transform" , [function(){
	return function(targetDOM , data){		

		var transformStr = 'translate(' + data.x + 'px,' + data.y + 'px) ' + 
							'rotate(' + data.rotateDegrees + 'deg) ';

		targetDOM.css({
			'-moz-transform': transformStr,
			'-webkit-transform': transformStr,
			'-o-transform': transformStr,
			'-ms-transform': transformStr,
		});				
	}    
}]);

ui.factory("rotatable" , ['$document', 'throttle' , function($document , throttle){
	return function(triggerDOM , targetDOM , data){

			var
				startX = 0, //record mousedow position
				startY = 0, //record mousedown position
				x = 0,  //temp variable
				y = 0;	//temp variable	

			var rotateDegrees = data.rotateDegrees;
		
			var rotate_mousemove = function (event) {
				y = event.screenY - startY;
				x = event.screenX - startX;
				startX = event.screenX;
				startY = event.screenY;
				var rotateDelta = Math.floor(Math.sqrt(x*x + y*y)*1000/Math.sqrt(data.W*data.W + data.H*data.H))/10;				
				if(rotateDegrees > 360){
					rotateDegrees-= 360;
				}
				if(rotateDegrees < 0){
					rotateDegrees+= 360;
				}

				if(rotateDegrees < 45 || rotateDegrees >= 315){					
					if(x+y > 0){
						rotateDegrees-= rotateDelta;
					}
					else{
						rotateDegrees+= rotateDelta;
					}
				}				
				else if(rotateDegrees >= 45 && rotateDegrees < 135){
					if(x-y > 0){
						rotateDegrees+= rotateDelta;
					}
					else{
						rotateDegrees-= rotateDelta;
					}
				}
				else if(rotateDegrees >= 135 && rotateDegrees < 225){
					if(x+y > 0){
						rotateDegrees+= rotateDelta;
					}					
					else{
						rotateDegrees-= rotateDelta;
					}
				}
				else if(rotateDegrees >= 225 || rotateDegrees < 315){
					if(x-y > 0){
						rotateDegrees-= rotateDelta;
					}
					else{
						rotateDegrees+= rotateDelta;
					}
				}

				targetDOM.css({
					'-moz-transform': 'rotate(' + rotateDegrees + 'deg)',
					'-webkit-transform': 'rotate(' + rotateDegrees + 'deg)',
					'-o-transform': 'rotate(' + rotateDegrees + 'deg)',
					'-ms-transform': 'rotate(' + rotateDegrees + 'deg)'
				});				
			}

			var rotate_mouseup = function() {
				$document.unbind('mousemove', throttle_rotate_mousemove);
				$document.unbind('mouseup', rotate_mouseup);
				data.rotateDegrees = rotateDegrees;
			}

			var throttle_rotate_mousemove = throttle(rotate_mousemove , 16);

			angular.element(triggerDOM).on('mousedown', function(event) {			    
				event.preventDefault();
				event.stopPropagation();
				startX = event.screenX;
				startY = event.screenY;
				data.W = targetDOM[0].clientWidth;
				data.H = targetDOM[0].clientHeight;
				$document.on('mousemove', throttle_rotate_mousemove);
				$document.on('mouseup', rotate_mouseup);
			});
	}    
}]);

ui.factory("resizable" , ['$document', 'throttle' , function($document , throttle){
	return function(triggerDOM , targetDOM , data){	

		var 
			startX = 0,
			startY = 0,
			x = 0,
			y = 0,			
			stretchW = 0,
			stretchH = 0,
			cosTheta = 0,
			sinTheta = 0;

		
		var resize_mousemove = function(event) {				
			y = event.screenY - startY;
			x = event.screenX - startX;				
			stretchW = (x*cosTheta + y*sinTheta);
			stretchH = (-x*sinTheta + y*cosTheta);
							
			targetDOM.css({
				'left': ( data.offsetX - stretchW ) + "px",
				'top':  ( data.offsetY - stretchH ) + "px",
				'width': ( data.W + stretchW*2 ) + "px",
				'height': ( data.H + stretchH*2 ) + "px"
			});
		}

		var resize_mouseup = function() {
			$document.unbind('mousemove', resize_mousemove);
			$document.unbind('mouseup', resize_mouseup);

			data.offsetX = data.offsetX - stretchW;
			data.offsetY = data.offsetY - stretchH;
			data.W = data.W + stretchW*2;
			data.H = data.H + stretchH*2;
		}

		var throttle_resize_mousemove = throttle(resize_mousemove , 16);

		angular.element(triggerDOM).on('mousedown', function(event) {			    
			event.preventDefault();
			event.stopPropagation();
			startX = event.screenX;
			startY = event.screenY;
			data.W = targetDOM[0].clientWidth;
			data.H = targetDOM[0].clientHeight;
			data.offsetX = parseInt(targetDOM[0].style.left , 10) || 0;
			data.offsetY = parseInt(targetDOM[0].style.top , 10) || 0;				
			cosTheta = Math.floor(Math.cos(Math.PI*data.rotateDegrees/180)*1000)/1000; //3 decimal
			sinTheta = Math.floor(Math.sin(Math.PI*data.rotateDegrees/180)*1000)/1000;			
			$document.on('mousemove', resize_mousemove);
			$document.on('mouseup', resize_mouseup);
			
		});		

	}    
}]);

ui.factory("draggable" , ['$document', 'throttle' , 'transform' , 'extend' , 
	function($document , throttle , transform , extend){
	return function(triggerDOM , targetDOM , data){		

		var 
			x = 0,
			y = 0,
			startX = 0,
			startY = 0;

		var drag_mousemove = function(event) {
			y = event.screenY - startY;
			x = event.screenX - startX;											
			targetDOM.css({
				left : data.offsetX + x + 'px',
				top : data.offsetY + y + 'px'
			});
			//var transformParam = extend({x : data.offsetX + x, y : data.offsetY + y }, data);
			//console.log(transformParam);
			//transform(targetDOM , transformParam);
		}

		var drag_mouseup = function(){
			$document.unbind('mousemove', throttle_drag_mousemove);
			$document.unbind('mouseup', drag_mouseup);
			data.offsetX = data.offsetX + x;
			data.offsetY = data.offsetY + y;
		}

		var throttle_drag_mousemove = throttle(drag_mousemove , 16);

		angular.element(triggerDOM).on('mousedown', function(event) {								
		    // Prevent default dragging of selected content			    
		    event.preventDefault();
		    startX = event.screenX;
		    startY = event.screenY;
		    data.offsetX = parseInt(targetDOM[0].style.left , 10) || 0;
			data.offsetY = parseInt(targetDOM[0].style.top , 10) || 0;
		    $document.on('mousemove', throttle_drag_mousemove);
		    $document.on('mouseup', drag_mouseup);
		});
	}    
}]);



ui.directive('adjustable', [ '$document', 'rotatable' , 'resizable' , 'draggable',
	function($document , rotatable , resizable , draggable) {

	return {

		scope : {},
		controller : function ($scope, $element) {    	      
			//using $scope.$parent as "root" scope			
			$scope.$parent.perviousSelected = null;    	    	
			$element.bind("mousedown" , function(event){    					
				if($scope.$parent.perviousSelected != null){
					$scope.$parent.perviousSelected.removeClass("select");
				}				
				$element.addClass("select");
				$scope.$parent.perviousSelected = $element;
			});

		},
		link : function(scope, element, attrs) {

			var data = {};
				
			data.offsetX = 0; //position X
			data.offsetY = 0; //position Y
			data.W = 0; //original width
			data.H = 0; //original height
			data.rotateDegrees = 0; //rotate degree

				
			rotatable(element[0].children[1] , element , data);
			resizable(element[0].children[2] , element , data);
			draggable(element[0].children[3] , element , data);

			scope.del = function(){								
				element[0].parentNode.removeChild(element[0]);				
			}

		},


		template:
		'<span class="adjustable">' + 
			'<span class="btn btn-default delBtn" ng-click="del();" data-icon="&#xe002;"></span>' + 			
			'<span class="btn btn-default roteateBtn" data-icon="&#xe003;"></span>' + 		
			'<span class="btn btn-default resizeBtn" data-icon="&#xe000;"></span>' +
			'<span class="wrap" ng-transclude></span>' +
		'</span>',       
		replace: true,     		
		transclude: true
	};
}]);