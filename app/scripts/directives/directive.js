'use strict';

module = angular.module('directive' , ['utility']);

module.directive('imagesLoadAnimation', function () {        
	return {
		link: function(scope, element) {
			element.css({ 
				"opacity" : "0"				
			});
			element.bind("load" , function(e){
				element.css({ 
					"opacity" : "1"
				});
			});
		}
	}
});
/**
module.directive('clickOnce', function () {        
	return {
		scope:{
			"clickOnceEvent": "@clickOnce"
		},
		link: function(scope, element) {			
			var clickFn = function(){								
				scope[scope.clickOnceEvent]();
				element.unbind("click" , clickFn);	
			}
			element.bind("click" , clickFn);
		},
		replace: false
	}
});
**/