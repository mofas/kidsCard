'use strict';


var throttle = function(func, wait, options) {
	var context, args, result;
	var timeout = null;
	var previous = 0;
	options || (options = {});
	var later = function() {
		previous = options.leading === false ? 0 : new Date;
		timeout = null;
		result = func.apply(context, args);
	};
	return function() {
		var now = new Date;
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0) {
			clearTimeout(timeout);
			timeout = null;
			previous = now;
			result = func.apply(context, args);
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};

var ui = angular.module('ui' , []);


ui.directive('draggable', ['$document' , function($document) {
	return {

		priority : 5,
		link : function(scope, element, attr) {
			var startX = 0, startY = 0, x = 0, y = 0;
			element.css({				
				cursor: 'pointer',
				position: 'relative',
			});
			var mousemove = function(event) {
				y = event.screenY - startY;
				x = event.screenX - startX;				
				element.css({
					left : x+'px',
					top : y+'px'
				});
			}

			var mouseup = function(){
				$document.unbind('mousemove', throttleMousemove);
				$document.unbind('mouseup', mouseup);
			}

			var throttleMousemove = throttle(mousemove , 16);

			element.on('mousedown', function(event) {				
			    // Prevent default dragging of selected content
			    event.preventDefault();
			    startX = event.screenX - x;
			    startY = event.screenY - y;
			    $document.on('mousemove', throttleMousemove);
			    $document.on('mouseup', mouseup);
			});

			
		}
	}
}]);

ui.directive('resizeable', [ '$document' , function($document) {

	return {
		// TODO        
		priority : 2,
		link : function(scope, element, attrs) {        
			var startX = 0,
				startY = 0,
				x = 0,
				y = 0,
				rotateDegrees = 0,
				oriW = 0,
				oriH = 0;


			var mousemove = function(event) {
				
				y = event.screenY - startY;
				x = event.screenX - startX;
				var stretchW = oriW+x;
				var stretchH = oriH+y;

				//min limit				
				if(stretchW < 50){
					stretchW = 50;
				}
				if(stretchH < 50){
					stretchH = 50;
				}
				element.css({
					'width': stretchW + "px",
					'height': stretchH + "px"
				});
			}

			var mouseup = function() {
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}

			angular.element(element[0].children[0]).on('mousedown', function(event) {			    
				event.preventDefault();
				event.stopPropagation();
				oriW = element[0].clientWidth;
				oriH = element[0].clientHeight;
				startX = event.screenX;
				startY = event.screenY;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);
				rotateDegrees = element[0].getAttribute("rotation") || 0;
			});

		},        
		template:
		'<span class="resizeable">' + 
			'<span class="btn btn-default resizeBtn" data-icon="&#xe000;"></span>' + 
			'<span class="resizeableWrap" ng-transclude></span>' +
		'</span>', 
		replace: true,
		transclude: true
	};

}]);


ui.directive('rotatable', [ '$document' , function($document) {

	return {		
		priority : 4,
		link : function(scope, element, attrs) {            
			var startX = 0, startY = 0, x = 0, y = 0 , rotateDegrees = 0;

			var mousemove = function (event) {
				y = event.screenY - startY;
				x = event.screenX - startX;
				startX = event.screenX;
				startY = event.screenY;
				var rotateDelta = Math.floor((Math.sqrt(x*x + y*y)*3)/5);
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

				element.css({
					'-moz-transform': 'rotate(' + rotateDegrees + 'deg)',
					'-webkit-transform': 'rotate(' + rotateDegrees + 'deg)',
					'-o-transform': 'rotate(' + rotateDegrees + 'deg)',
					'-ms-transform': 'rotate(' + rotateDegrees + 'deg)'
				});

				element[0].setAttribute("rotation", rotateDegrees);

			}

			var mouseup = function() {
				$document.unbind('mousemove', throttleMousemove);
				$document.unbind('mouseup', mouseup);
			}

			var throttleMousemove = throttle(mousemove , 16);


			angular.element(element[0].children[0].children[0]).on('mousedown', function(event) {			    
				event.preventDefault();
				event.stopPropagation();
				startX = event.screenX;
				startY = event.screenY;
				$document.on('mousemove', throttleMousemove);
				$document.on('mouseup', mouseup);
			});
			

		},        
		template:
		'<span class="rotatable">' + 
		'<span class="btn btn-default roteateBtn" data-icon="&#xe003;"></span>' + 
		'<span class="rotatableWrap" ng-transclude></span>' +
		'</span>',        
		transclude: true
	};    

}]);


ui.directive('deleteable', [function() {

	return {                
		priority : 2,
		scope : {},
		link : function(scope, element, attrs) {                    	
			scope.del = function(e){
				element.addClass("del");
				var $element = element[0];
				setTimeout(function(){
					$element.parentNode.removeChild($element);
				} , 300);
			}  
		},
		template:
		'<span class="deleteable">' + 
		'<span class="btn btn-default delBtn" ng-click="del();" data-icon="&#xe002;"></span>' + 
		'<span ng-transclude></span>' +
		'</span>',            
		transclude: true
	};    

}]);


ui.directive('selectable', [ '$document', function($document) {

	return {                
		priority : 1,
		controller : 'selectableCtrl',
		link : function(scope , element , attrs){
			element.addClass("selectable");
		},
		template: '<span class="inner" ng-transclude></span>',            
		transclude: true
	};
}]);

ui.controller('selectableCtrl', ['$scope', '$element', 
	function ($scope, $element) {    	      
		$scope.perviousSelected = null;    	    	
		$element.bind("click" , function(event){    		
			if($scope.perviousSelected != null){
				$scope.perviousSelected.removeClass("select");
			}
			$element.addClass("select");
			$scope.perviousSelected = $element;
		});
	}
	]);
