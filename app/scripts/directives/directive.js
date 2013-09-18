
var app = angular.module('directive' , ['utility']);

app.directive('imagesLoadAnimation', function () {        
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

app.directive('clickOnce', function () {        
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
		}
	}
});