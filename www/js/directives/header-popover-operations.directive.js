(function(){

	'use strict';

	/**
	* smallerText Directive function
	*/
	var headerPopoverOperations=function($ionicPopover, $state){
		
		return {
			restrict: 'E',
			scope: {
				// outData: '='
			},
			templateUrl: 'views/app/popover.html',
			link: function(scope, element, attrs) {

				scope.showSetting = function() {
					//console.log("dddd");
					$state.go('app.settings');
				}
 			}
		}
	}

	/**
	* @dependencies injector $ionicGesture
	*/

	headerPopoverOperations.$inject=['$ionicPopover', '$state'];

	angular
		.module('tatafo')
		.directive('headerPopoverOperations',headerPopoverOperations)

})();

