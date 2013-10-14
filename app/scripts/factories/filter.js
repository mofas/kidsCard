'use strict';

module = angular.module('filter', []);

module.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<total; i++)
			input.push(i);
		return input;
	};
});

module.filter('startFrom', function() {
	return function(input, start) {         
		return input.slice(start);
	}
});