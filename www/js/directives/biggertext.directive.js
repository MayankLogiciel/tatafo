(function(){

	'use strict';

	/**
	* biggerText Directive function
	*/
	var biggerText=function($ionicGesture){
		
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				$ionicGesture.on('touch', function(event){
					event.stopPropagation();
					event.preventDefault();

					var text_element = document.querySelector(attrs.biggerText),
							root_element = document.querySelector(".menu-content"),
							current_size_str = window.getComputedStyle(text_element, null).getPropertyValue('font-size'),
							current_size = parseFloat(current_size_str),
							new_size = Math.min((current_size+2), 24),
							new_size_str = new_size + 'px';

					root_element.classList.remove("post-size-"+current_size_str);
					root_element.classList.add("post-size-"+new_size_str);
				}, element);
			}
		};
	}

	/**
	* @dependencies injector $ionicGesture
	*/

	biggerText.$inject=['$ionicGesture'];

	angular
		.module('tatafo')
		.directive('biggerText',biggerText)

})();

