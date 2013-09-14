'use strict';


var ui = angular.module('ui' , ['utility']);


ui.factory("transform" , [ function(){
	return function(targetDOM , data){	

		var transformStr = 'translate(' + (data.offsetX || 0) + 'px,' + (data.offsetY || 0) + 'px) ' + 
							'rotate(' + (data.rotateDegrees || 0) + 'deg) ' +
							'scale( ' + (data.scaleX || 1) + ', ' + (data.scaleY || 1) + ')';

		targetDOM.css({
			'-moz-transform': transformStr,
			'-webkit-transform': transformStr,
			'-o-transform': transformStr,
			'-ms-transform': transformStr,
		});		
	}    
}]);

ui.factory("rotatable" , [ '$document', 'throttle' , 'transform' ,
	function($document , throttle , transform ) {
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
											
				data.rotateDegrees = rotateDegrees;
				transform(targetDOM , data);
			}

			var rotate_mouseup = function() {
				$document.unbind('mousemove', throttle_rotate_mousemove);
				$document.unbind('mouseup', rotate_mouseup);				
			}

			var throttle_rotate_mousemove = throttle(rotate_mousemove , 16);

			angular.element(triggerDOM).on('mousedown', function(event) {			    
				event.preventDefault();
				event.stopPropagation();
				//reset
				startX = event.screenX;
				startY = event.screenY;
				x = 0;
				y = 0;
				data.W = targetDOM[0].clientWidth;
				data.H = targetDOM[0].clientHeight;
				$document.on('mousemove', throttle_rotate_mousemove);
				$document.on('mouseup', rotate_mouseup);
			});
	}    
}]);

ui.factory("resizable" , [ '$document', 'throttle' , 'transform' ,
	function($document , throttle , transform ) {
	return function(triggerDOM , targetDOM , data){	

		var 
			startX = 0,
			startY = 0,
			x = 0,
			y = 0,
			startOffsetX = 0,
			startOffsetY = 0,
			startW = 0,
			startH = 0,
			stretchW = 0,
			stretchH = 0,
			cosTheta = 0,
			sinTheta = 0;

		
		var resize_mousemove = function(event) {				
			y = event.screenY - startY;
			x = event.screenX - startX;				
			stretchW = (x*cosTheta + y*sinTheta);
			stretchH = (-x*sinTheta + y*cosTheta);

			//check size limit
			if( !((startW + stretchW*2) < data.minW || (startW + stretchW*2) > data.maxW) ){
				data.offsetX = startOffsetX - stretchW;
				data.W = startW + stretchW*2;
			}
			if( !((startH + stretchH*2) < data.minH || (startH + stretchH*2) > data.maxH) ){
				data.offsetY = startOffsetY - stretchH;			
				data.H = startH + stretchH*2;		
			}
							
			targetDOM.css({				
				'width': data.W + "px",
				'height': data.H + "px"
			});
			transform(targetDOM , data);
			if(data.resizeInner){
				var inner = targetDOM[0].children[3].children[0],
					innerW = inner.clientWidth,
					innerH = inner.clientHeight,
					scaleX = 1,
					scaleY = 1,
					offsetX = 0,
					offsetY = 0;
				if(innerW > data.W){
					scaleX = data.W/innerW;
					offsetX = -(innerW-data.W)/2;
				}
				if(innerH > data.H){
					scaleY = data.H/innerH;
					offsetY = -(innerH-data.H)/2;
				}
				data.inner = {
					offsetX : offsetX,
					offsetY : offsetY, 
					scaleX : scaleX,
					scaleY : scaleY 
				}
				transform(angular.element(inner) , data.inner);
			}
		}

		var resize_mouseup = function() {
			$document.unbind('mousemove', resize_mousemove);
			$document.unbind('mouseup', resize_mouseup);
		}

		var throttle_resize_mousemove = throttle(resize_mousemove , 16);

		angular.element(triggerDOM).on('mousedown', function(event) {			    
			event.preventDefault();
			event.stopPropagation();
			//reset
			startX = event.screenX;
			startY = event.screenY;
			x = 0;
			y = 0;
			stretchW = 0;
			stretchH = 0;
			startW = data.W = targetDOM[0].clientWidth;
			startH = data.H = targetDOM[0].clientHeight;
			startOffsetX = data.offsetX;
			startOffsetY = data.offsetY;			
			cosTheta = Math.floor(Math.cos(Math.PI*data.rotateDegrees/180)*1000)/1000; //3 decimal
			sinTheta = Math.floor(Math.sin(Math.PI*data.rotateDegrees/180)*1000)/1000;			


			$document.on('mousemove', resize_mousemove);
			$document.on('mouseup', resize_mouseup);
			
		});		

	}    
}]);

ui.factory("draggable" , [ '$document', 'throttle' , 'transform' ,
	function($document , throttle , transform ) {
	return function(triggerDOM , targetDOM , data){		

		var 
			x = 0,
			y = 0,
			startOffsetX = 0,
			startOffsetY = 0,
			startX = 0,
			startY = 0;

		var drag_mousemove = function(event) {
			y = event.screenY - startY;
			x = event.screenX - startX;			
			data.offsetX = startOffsetX + x;
			data.offsetY = startOffsetY + y;
			transform(targetDOM , data);
		}

		var drag_mouseup = function(){
			$document.unbind('mousemove', throttle_drag_mousemove);
			$document.unbind('mouseup', drag_mouseup);			
		}

		var throttle_drag_mousemove = throttle(drag_mousemove , 16);

		angular.element(triggerDOM).on('mousedown', function(event) {		    
		    //reset
		    startX = event.screenX;
		    startY = event.screenY;		    
		    x = 0;
		    y = 0;
		    startOffsetX = data.offsetX;
		    startOffsetY = data.offsetY;
		    $document.on('mousemove', throttle_drag_mousemove);
		    $document.on('mouseup', drag_mouseup);
		});
	}    
}]);

ui.directive('adjustable', [ '$document', '$timeout' , 'rotatable' , 'resizable' , 'draggable',
	function($document , $timeout , rotatable , resizable , draggable) {

	return {

		scope : {
			"obj" : "=",
			"minW": "=",
			"minH": "=",
			"maxW": "=",
			"maxH": "=",
			"delCallback" : "=",
			"resizeInner" : "="
		},
		controller : [ '$scope' , '$element' , function ($scope, $element) {    	      
			//using $scope.$parent.$parent as "root" scope	
			var $tempRootScope = $scope.$parent.$parent;				

			// $tempRootScope.perviousSelected = null;

			$element.bind("mousedown" , function(event){    					
				if($tempRootScope.perviousSelected != null){
					$tempRootScope.perviousSelected.removeClass("select");
				}				
				$element.addClass("select");
				$tempRootScope.perviousSelected = $element;				
			});			
		}],		
		link : function(scope, element, attrs) {

			var data = {};
				
			data.offsetX = 0; //position X
			data.offsetY = 0; //position Y
			data.W = 0; //original width
			data.H = 0; //original height
			data.rotateDegrees = 0; //rotate degree

			
			data.minW = scope.minW || 0;
			data.minH = scope.minH || 0;
			data.maxW = scope.maxW || 1000;
			data.maxH = scope.maxH || 1000;
			data.resizeInner = scope.resizeInner || false;	

			scope.obj.data = data;
				
			rotatable(element[0].children[1] , element , data);
			resizable(element[0].children[2] , element , data);
			draggable(element[0].children[3] , element , data);

			scope.del = function(){				
				scope.delCallback(scope.obj.id);
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