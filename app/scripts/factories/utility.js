'use strict';


//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.


var factories = angular.module('utility', []);

factories.factory("throttle" , function(){
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
});

factories.factory("each" , function(){
	return function(obj, iterator, context) {
    	if (obj == null) return;
    	if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      		obj.forEach(iterator, context);
    	} else if (obj.length === +obj.length) {
      		for (var i = 0, length = obj.length; i < length; i++) {
        	if (iterator.call(context, obj[i], i, obj) === breaker) return;
      	}
    	} else {
      		var keys = _.keys(obj);
      		for (var i = 0, length = keys.length; i < length; i++) {
        		if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      		}
    	}
  	};
});

factories.factory("extend" , [ 'each' , function(each){
	return function(obj){  	
	    each(Array.prototype.slice.call(arguments, 1), function(source) {
	      if (source) {
	        for (var prop in source) {
	          obj[prop] = source[prop];
	        }
	      }
	    });
    	return obj;
  	};
}]);
