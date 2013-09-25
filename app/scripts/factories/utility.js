'use strict';


//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.


var factories = angular.module('utility', []);

factories.factory("throttle" , [ function(){
	return function(func, wait, options){							
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
	}    
}]);

