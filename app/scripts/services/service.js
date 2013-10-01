'use strict';

var services = angular.module('services', []);


services.service('shareCanvasDataService', [ function () {
	return { shareData : {} }
}]);

services.service('StyleService', [ function () {
	return {		

		getBGStyle : function(bg){					
			if(bg === "transparent"){
				return { 'background' : 'transparent'}
			}	else if(bg.indexOf("#") == 0) {
				// Color code
				return {
					'background' : bg
				}
			} else {
				// Images
				return{
					'background-image' : 'url(' + bg + ')',
				}
			}
		},

		// Every item in list contain 'data.transform' which use to adjust dom,
		// now we convert it to 'style' so ng-style can digest and remove unnecessary
		// data at the same time.
		convertDataToStyle : function(list){
			var returnList = [],
			newObj,
			transformStr = "",
			data;			
			
			angular.forEach(list , function(originalObj){	


				newObj = {
					id: originalObj.id,
					style: {},
					inner: {
						style: {}
					}
				}

				// Copy style into inside 
				angular.forEach(originalObj.style , function(val, key){					
					newObj.inner.style[key] = val;
				});

				// Tackle with width and height
				if(originalObj.data.W != 0){
					newObj.style["width"] = originalObj.data.W + "px";
				}
				if(originalObj.data.H != 0){
					newObj.style["height"] = originalObj.data.H + "px";					
				}

				// Tackle with text
				if(originalObj.text != null){
					newObj.text = originalObj.text;
				}

				if(originalObj.data != null){
					data = originalObj.data;			 		
					transformStr = 'translate(' + (data.offsetX || 0) + 'px,' + (data.offsetY || 0) + 'px) ' + 
						'rotate(' + (data.rotateDegrees || 0) + 'deg) ' +
						'scale( ' + (data.scaleX || 1) + ', ' + (data.scaleY || 1) + ')';					
					newObj.style["-moz-transform"] = transformStr;
					newObj.style["-webkit-transform"] = transformStr;
					newObj.style["-o-transform"] = transformStr;
					newObj.style["-ms-transform"] = transformStr;

					// Inner style
					if(originalObj.data.resizeInner && originalObj.data.inner != null){
						data = originalObj.data.inner;						
						transformStr = 'translate(' + (data.offsetX || 0) + 'px,' + (data.offsetY || 0) + 'px) ' + 
							'rotate(' + (data.rotateDegrees || 0) + 'deg) ' +
							'scale( ' + (data.scaleX || 1) + ', ' + (data.scaleY || 1) + ')';
						newObj.inner.style["-moz-transform"] = transformStr;
						newObj.inner.style["-webkit-transform"] = transformStr;
						newObj.inner.style["-o-transform"] = transformStr;
						newObj.inner.style["-ms-transform"] = transformStr;
					}
				}
				returnList.push(newObj);
			});			
			return returnList;
		}

	}
	
}]);
