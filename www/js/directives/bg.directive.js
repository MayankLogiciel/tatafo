(function(){

	'use strict';

	/**
	* bg Directive function
	*/
	var bg=function(){
		
		return {
			restrict: 'A',
			require: '^multiBg',
			scope: {
				ngSrc: '@'
			},
			link: function(scope, element, attr, multiBgController) {
				element.on('load', function() {
					multiBgController.animateBg();
				});
			}
		};
	}

	/**
	* @dependencies injector 
	*/

	bg.$inject=[];

	angular
		.module('tatafo')
		.directive('bg',bg)

})();

