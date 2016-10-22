(function(){

	'use strict';

	/**
	* spinnerOnLoad Directive function
	*/
	var spinnerOnLoad=function(){
		
		return {
			restrict: 'A',
			require: '^preImg',
			scope: {
				ngSrc: '@'
			},
			link: function(scope, element, attr, preImgController) {
				element.on('load', function() {
					preImgController.hideSpinner();
			  });
			}
		};
	}

	/**
	* @dependencies injector 
	*/

	spinnerOnLoad.$inject=[];

	angular
		.module('tatafo')
		.directive('spinnerOnLoad',spinnerOnLoad)

})();

