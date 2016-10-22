(function(){

	'use strict';

	/**
	* smallerText Directive function
	*/
	var headerPopover=function($ionicPopover, $state){
		
		return {
			restrict: 'E',
			template: '<button class="button button-icon button-clear ion-android-more-vertical" on-tap="headerPopover.show($event)"></button>',
			link: function(scope, element, attrs) {
				$ionicPopover.fromTemplateUrl('views/app/popover.html', {
    				scope: scope,
 				}).then(function(popover) {
	    			scope.headerPopover = popover;
	
	  			});

				scope.showSetting = function() {
					$state.go('app.settings');
				}
 			}
		}
	}

	/**
	* @dependencies injector $ionicGesture
	*/

	headerPopover.$inject=['$ionicPopover', '$state'];

	angular
		.module('tatafo')
		.directive('headerPopover',headerPopover)

})();

