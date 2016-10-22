(function(){

	'use strict';

	/**
	* smallerText Directive function
	*/
	var appRateModel=function($ionicModal, $state, $ionicPopup) {		
		return {
			restrict: 'E',
			template: '<button class="button button-icon ion-ios-heart" on-tap="showAppRateModel()"></button>',
			link: function(scope, element, attrs) {

				$ionicModal.fromTemplateUrl('views/common/rates.html', {    			 
    				scope: scope,
    				animation: 'none'
    			}).then(function(modal) {
    				scope.appRateModel = modal;
  				});

	            scope.showAppRateModel = function() {
	               scope.appRateModel.show();
	            }

  				scope.hideModel = function() {
					scope.appRateModel.hide();
				}
  				

				$ionicModal.fromTemplateUrl('views/common/rates1.html', {    			 
    				scope: scope,
    				animation: 'none'
    			}).then(function(modal) {
    				scope.appRateModel1 = modal;
  				});

              	scope.showAppRateModelForYes = function() {
               		scope.appRateModel1.show();
              	}

              	scope.hideAppRateModelYes = function() {
					scope.appRateModel1.hide();
				}

				$ionicModal.fromTemplateUrl('views/common/rates2.html', {    			 
    				scope: scope,
    				animation: 'none'
    			}).then(function(modal) {
    				scope.appRateModel2 = modal;
  				});               

	            scope.showAppRateModelForNo = function() {
	               scope.appRateModel2.show();
	            }
              	
				scope.hideAppRateModelNo = function() {
					scope.appRateModel2.hide();
				}			
 			}
		}
	}

	/**
	* @dependencies injector $ionicGesture
	*/
	appRateModel.$inject=['$ionicModal', '$state', '$ionicPopup'];
	angular
		.module('tatafo')
		.directive('appRateModel',appRateModel)

})();

