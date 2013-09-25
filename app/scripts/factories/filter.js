'use strict';

app = angular.module('filter', []);

app.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i=0; i<total; i++)
			input.push(i);
		return input;
	};
});

app.filter('startFrom', function() {
	return function(input, start) {         
		return input.slice(start);
	}
});