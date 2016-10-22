(function(){

	'use strict';

	/**
	* showHideInput Directive function
	*/
	var showHideInput=function(){
		
		return {
			scope: {
			},
			link: function(scope, element, attrs) {
				// listen to event
				scope.$on("toggle-type", function(event, show){
					var password_input = element[0],
							input_type = password_input.getAttribute('type');

					if(!show)
					{
						password_input.setAttribute('type', 'password');
					}

					if(show)
					{
						password_input.setAttribute('type', 'text');
					}
				});
			},
			require: '^showHideContainer',
			restrict: 'A',
			replace: false,
			transclude: false
		};
	}

	/**
	* @dependencies injector 
	*/

	showHideInput.$inject=[];

	angular
		.module('tatafo')
		.directive('showHideInput',showHideInput)

})();

