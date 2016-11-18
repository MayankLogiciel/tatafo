(function(){

	'use strict';

	/**
	* headerPopover Directive function for header popover
	*/
	var headerPopover=function($ionicPopover, $state, feedsDAOService, $ionicLoading, $timeout){
		
		return {
			restrict: 'E',
			scope: {},
			template: '<button class="button button-icon button-clear ion-android-more-vertical" on-tap="headerPopover.show($event)"></button>',
			link: function(scope, element, attrs) {
				$ionicPopover.fromTemplateUrl('views/app/popover.html', {
    				scope: scope,
 				}).then(function(popover) {
	    			scope.headerPopover = popover;
	
	  			});

 			/**
			* show setting page
			*/
				scope.showSetting = function() {
					$state.go('app.settings');
				}
				scope.closePopover = function() {
    				scope.headerPopover.hide();
  				};

  				scope.destroyPostDB =function(){
  					$ionicLoading.show({
          				template: '<ion-spinner icon="android"></ion-spinner><p>Clearing Cache</p>'
        			});
        			$timeout(function() {
        				$ionicLoading.hide();
        			},3000);
					feedsDAOService.destroyPostsDBForClearChache().then(function(response){
					});
				}
 			}
		}
	}

	/**
	* @dependencies injector $ionicPopover, $state
	*/

	headerPopover.$inject=['$ionicPopover', '$state', 'feedsDAOService', '$ionicLoading', '$timeout'];

	angular
		.module('tatafo')
		.directive('headerPopover',headerPopover)

})();

