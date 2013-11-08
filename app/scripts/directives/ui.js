'use strict';

module = angular.module('ui' , ['utility']);

module.factory("transform" , [ function(){
	return function(targetDOM){	


		var data = targetDOM.data();		
		//console.log(targetDOM , data);

		if(data != null && targetDOM != null){
			var transformStr = 'translate(' + (data.offsetX || 0) + 'px,' + (data.offsetY || 0) + 'px) ' + 
			'rotate(' + (data.rotateDegrees || 0) + 'deg) ' +
			'scale( ' + (data.scaleX || 1) + ', ' + (data.scaleY || 1) + ')';

			targetDOM.css({
				'-moz-transform': transformStr,
				'-webkit-transform': transformStr,
				'-o-transform': transformStr,
				'-ms-transform': transformStr,
				'z-index' : data.z_index
			});					
		}		
	}    
}]);

module.factory("rotatable" , [ '$document', 'throttle' , 'transform' ,
	function($document , throttle , transform ) {
		return function(triggerDOM , targetDOM){

			var
				startX = 0, // Record mousedow position
				startY = 0, // Record mousedown position
				x = 0,  		// Temporary variable
				y = 0;			// Temporary variable	

			var data = targetDOM.data();
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

				if(rotateDegrees < 45 || rotateDegrees >= 315) {
					if(x+y > 0){
						rotateDegrees-= rotateDelta;
					} else {
						rotateDegrees+= rotateDelta;
					}
				}	else if(rotateDegrees >= 45 && rotateDegrees < 135) {
					if(x-y > 0){
						rotateDegrees+= rotateDelta;
					} else {
						rotateDegrees-= rotateDelta;
					}
				} else if(rotateDegrees >= 135 && rotateDegrees < 225) {
					if(x+y > 0){
						rotateDegrees+= rotateDelta;
					}	else {
						rotateDegrees-= rotateDelta;
					}
				} else if(rotateDegrees >= 225 || rotateDegrees < 315) {
					if(x-y > 0){
						rotateDegrees-= rotateDelta;
					} else {
						rotateDegrees+= rotateDelta;
					}
				}

				data.rotateDegrees = rotateDegrees;
				transform(targetDOM);
			}

			var rotate_mouseup = function() {
				$document.unbind('mousemove', throttle_rotate_mousemove);
				$document.unbind('mouseup', rotate_mouseup);				
			}

			var throttle_rotate_mousemove = throttle(rotate_mousemove , 16);

			angular.element(triggerDOM).on('mousedown', function(event) {			    
				event.preventDefault();
				event.stopPropagation();

				//Reset
				rotate_mouseup();
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
		}
	]
);

module.factory("resizable" , [ '$document', 'throttle' , 'transform' ,
	function($document , throttle , transform ) {
		return function(triggerDOM , targetDOM){	

			var 
				shifted = false, 	// Shift key is pressed or not
				startX = 0, 			// Position x when mousedown  
				startY = 0, 			// Position y when mousedown  
				x = 0, 						// Temporary variable
				y = 0, 						// Temporary variable
				startOffsetX = 0, // Initial position x of targetDOM 
				startOffsetY = 0, // Initial position y of targetDOM 
				startW = 0,				// Initial width of targetDOM 
				startH = 0,				// Initial height of targetDOM 
				stretchW = 0,			// Current stretched width
				stretchH = 0,			// Current stretched height
				cosTheta = 0,			// Cos value of rotation degree
				sinTheta = 0;			// Sin value of rotation degree


			var data = targetDOM.data();

			var resize_mousemove = function(event) {				
				y = event.screenY - startY;
				x = event.screenX - startX;			
				stretchW = (x*cosTheta + y*sinTheta);
				stretchH = (-x*sinTheta + y*cosTheta);


			// Maintain ratio
			if(shifted){
				// Get middle value of y and x;
				stretchW = stretchH = (stretchW+stretchH)/2;
				// Check stretchW and stretchH is between max limit and min limit.
				if( !( (startW + stretchW*2) < data.minW || (startW + stretchW*2) > data.maxW ||
					(startH + stretchH*2) < data.minH || (startH + stretchH*2) > data.maxH ) ){
					data.offsetX = startOffsetX - stretchW;
					data.W = startW + stretchW*2;
					data.offsetY = startOffsetY - stretchH;			
					data.H = startH + stretchH*2;
				}
			} else {
				// Check width and height limit
				if( !((startW + stretchW*2) < data.minW || (startW + stretchW*2) > data.maxW) ){
					data.offsetX = startOffsetX - stretchW;
					data.W = startW + stretchW*2;
				}
				if( !((startH + stretchH*2) < data.minH || (startH + stretchH*2) > data.maxH) ){
					data.offsetY = startOffsetY - stretchH;			
					data.H = startH + stretchH*2;		
				}	
			}								

			targetDOM.css({				
				'width': data.W + "px",
				'height': data.H + "px"
			});

			transform(targetDOM);

			// Check inner obj need adjust 
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
				var innerDOM = angular.element(inner);
				innerDOM.data(data.inner);
				transform(innerDOM);
			}
		}

		var resize_mouseup = function() {
			$document.unbind('mousemove', resize_mousemove);
			$document.unbind('mouseup', resize_mouseup);
			$document.unbind('keypress' , resize_keypress);
		}

		var resize_keypress = function(event){			
			shifted = event.shiftKey;
		}

		var throttle_resize_mousemove = throttle(resize_mousemove , 16);

		angular.element(triggerDOM).on('mousedown', function(event) {			    
			event.preventDefault();
			event.stopPropagation();
			// Reset
			resize_mouseup();
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
			cosTheta = Math.floor(Math.cos(Math.PI*data.rotateDegrees/180)*1000)/1000; // Precision: 3 decimal
			sinTheta = Math.floor(Math.sin(Math.PI*data.rotateDegrees/180)*1000)/1000;			

			$document.on('mousemove', resize_mousemove);
			$document.on('mouseup', resize_mouseup);
			$document.on('keyup keydown' , resize_keypress);

		});		

	}    
}]);

module.factory("draggable" , [ '$document', 'throttle' , 'transform' ,
	function($document , throttle , transform ) {
		return function(triggerDOM , targetDOM){		

			var 
				touchTarget = null, // Touch target
				x = 0, 							// Temporary variable
				y = 0,							// Temporary variable
				startOffsetX = 0,		// Initial position x of targetDOM
				startOffsetY = 0,		// Initial position y of targetDOM
				startX = 0,					// Position x when mousedown/touchstart
				startY = 0;					// Position y when mousedown/touchstart

			var data = targetDOM.data();			

			var drag_start = function(initX , initY){
				x = 0;
				y = 0;
				startOffsetX = data.offsetX;
				startOffsetY = data.offsetY;
				startX = initX;
				startY = initY;		    
			}

			var drag_mousemove = function(e) {						
				y = e.screenY - startY;
				x = e.screenX - startX;			
				data.offsetX = startOffsetX + x;
				data.offsetY = startOffsetY + y;
				transform(targetDOM);			
				e.preventDefault();
			}

			var drag_touchmove = function(e){			
				y = e.targetTouches[0].clientY - startY;
				x = e.targetTouches[0].clientX - startX;
				data.offsetX = startOffsetX + x;
				data.offsetY = startOffsetY + y;
				transform(targetDOM);  			
			}

			var drag_touchend = function(){
				touchTarget.removeEventListener('touchmove', drag_touchmove);
				touchTarget.removeEventListener('touchend', drag_touchend);
				touchTarget.removeEventListener('touchcancel', drag_touchend);			
			}

			var drag_mouseup = function(){
				$document.unbind('mousemove', throttle_drag_mousemove);
				$document.unbind('mouseup', drag_mouseup);			
			}

			var throttle_drag_mousemove = throttle(drag_mousemove , 16);

			angular.element(triggerDOM).on('mousedown', function(event) {		    
		    // Reset
		    drag_mouseup();
		    drag_start(event.screenX , event.screenY);		    
		    $document.on('mousemove', throttle_drag_mousemove);
		    $document.on('mouseup', drag_mouseup);		    
		  });

			// TouchEvent
			angular.element(triggerDOM).on('touchstart', function(e) {		    
		    // Reset		    
		    drag_start(e.targetTouches[0].clientX , e.targetTouches[0].clientY);
		    touchTarget = e.target;
		    e.target.addEventListener('touchmove', drag_touchmove, false);
		    e.target.addEventListener('touchend', drag_touchend, false);
		    e.target.addEventListener('touchcancel', drag_touchend, false);
		    event.preventDefault();
		  });
		}    
	}
]);


module.service('selectCtrl', ['$document', function ($document) {
	var ctrl = {};

	var cancelSelectEvent = function(e){		
		if(e.target === ctrl.$parentDOM){	
			if(ctrl.perviousSelected != null){		
				ctrl.perviousSelected.removeClass("select");
				ctrl.perviousSelected = null;
			}
		}
	}

	$document.on("click" , cancelSelectEvent);
	return ctrl;

}]);


module.directive('adjustable', [ '$document', '$timeout' , 'rotatable' , 'resizable' , 'draggable', 'transform' ,
	function($document , $timeout , rotatable , resizable , draggable , transform) {

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
			controller : [ '$scope' , '$element' , 'selectCtrl' , function ($scope, $element , selectCtrl) {    	      			
				if(!(selectCtrl.$parentDOM != null)){
					selectCtrl.$parentDOM = $element.parent()[0];				
				}

				$element.bind("mousedown" , function(event){    					
					if(selectCtrl.perviousSelected != null){
						selectCtrl.perviousSelected.removeClass("select");
					}				
					$element.addClass("select");
					selectCtrl.perviousSelected = $element;												
				});
				
				//redefine z-index
				$scope.$on('relayout_' + $scope.obj.id , function(e , index){					
					var data = $element.data();
					data['z_index'] = index;
					$element.data(data);
					transform($element);
				});

				$scope.$on('synStyleData' , function(){					
					$scope.obj.data = $element.data();
				});

			}],		
			link : function(scope, element, attrs) {

				var data = {};				
				data.offsetX = 0; 			// Initial position X of DOM
				data.offsetY = 0; 			// Initial position Y of DOM
				data.W = 0; 						// Original width of DOM
				data.H = 0; 						// Original height of DOM
				data.rotateDegrees = 0; // Rotating degree
				
				data.minW = scope.minW || 0;
				data.minH = scope.minH || 0;
				data.maxW = scope.maxW || 1000;
				data.maxH = scope.maxH || 1000;
				data.resizeInner = scope.resizeInner || false;
				
				data.z_index = scope.obj.z_index;
				scope.obj.data = data;

				element.data(data);
				transform(element);

				rotatable(element[0].children[1] , element);
				resizable(element[0].children[2] , element);
				draggable(element[0].children[3] , element);
								

				scope.del = function(){								
					element[0].parentNode.removeChild(element[0]);				
					scope.delCallback(scope.obj.id);
				}

		},

		template:
			'<span class="adjustable">' + 
			'<span class="ad_btn delBtn" ng-click="del();"></span>' + 			
			'<span class="ad_btn roteateBtn"></span>' + 		
			'<span class="ad_btn resizeBtn" title="按住shift鍵同時托著滑鼠可以維持形狀"></span>' +
			'<span class="wrap" ng-transclude></span>' +
			'</span>',       
		replace: true,     		
		transclude: true
	};
}]);