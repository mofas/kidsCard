'use strict';

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
			element.on('mousedown', function(event) {				
			    // Prevent default dragging of selected content
			    event.preventDefault();
			    startX = event.screenX - x;
			    startY = event.screenY - y;
			    $document.on('mousemove', mousemove);
			    $document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				y = event.screenY - startY;
				x = event.screenX - startX;				
				element.css({
                    left : x+'px',
                    top : y+'px'
                });
			}

			function mouseup() {
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
		}
	}
}]);

ui.directive('resizeable', [function() {

	return {
		// TODO        
		priority : 2,
        link : function(scope, element, attrs) {            
            
        },        
        template:
            '<div class="resizeable">' +
                '<div class="top-border">' +
            '</div>',
        replace: true,
        transclude: true
    };

}]);


ui.directive('rotatable', [ '$document' , function($document) {

	return {		
		priority : 4,
        link : function(scope, element, attrs) {            
        	var startX = 0, startY = 0, x = 0, y = 0 , rotateDegrees = 0;        	        	
    		angular.element(element[0].children[0].children[0]).on('mousedown', function(event) {			    
			    event.preventDefault();
			    event.stopPropagation();
			    startX = event.screenX;
			    startY = event.screenY;
			    $document.on('mousemove', mousemove);
			    $document.on('mouseup', mouseup);
			});

			function mousemove(event) {
				y = event.screenY - startY;
				x = event.screenX - startX;
			    startX = event.screenX;
			    startY = event.screenY;
				var absPath = Math.sqrt(x*x + y*y);								
				if(rotateDegrees > 360){
					rotateDegrees-= 360;
				}
				if(rotateDegrees < 0){
					rotateDegrees+= 360;
				}

				if(rotateDegrees < 45 || rotateDegrees >= 315){
					if(x+y > 0){
						rotateDegrees+= absPath;
					}					
					else{
						rotateDegrees-= absPath;
					}
				}				
				else if(rotateDegrees >= 45 && rotateDegrees < 135){
					if(x-y > 0){
						rotateDegrees-= absPath;
					}
					else{
						rotateDegrees+= absPath;
					}
				}
				else if(rotateDegrees >= 135 && rotateDegrees < 225){
					if(x+y > 0){
						rotateDegrees-= absPath;
					}
					else{
						rotateDegrees+= absPath;
					}
				}
				else if(rotateDegrees >= 225 || rotateDegrees < 315){
					if(x-y > 0){
						rotateDegrees+= absPath;
					}
					else{
						rotateDegrees-= absPath;
					}
				}

				element.css({
                    '-moz-transform': 'rotate(' + rotateDegrees + 'deg)',
                    '-webkit-transform': 'rotate(' + rotateDegrees + 'deg)',
                    '-o-transform': 'rotate(' + rotateDegrees + 'deg)',
                    '-ms-transform': 'rotate(' + rotateDegrees + 'deg)'
                });

			}

			function mouseup() {
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
        },        
        template:
            '<span class="rotatable">' + 
            	'<span class="btn btn-default roteateBtn">@</span>' + 
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
            	'<span class="btn btn-default delBtn" ng-click="del();">&times</span>' + 
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
