(function(){

	'use strict';

	/**
	* appRateDirective Directive function
	*/
	var appRateDirective=function($ionicModal, $state, $ionicPopup, $window) {		
		return {
			restrict: 'A',
			scope: {},
			link: function(scope, element, attrs) {
				/**
				* ionicModal for rate app or not
				*/
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
  				
				/**
				* ionicModal for rate app if satisfied
				*/
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

				scope.appRate = function () {
					$window.open("market://details?id=com.wec.tatafo", "_system");
					localStorage.appRateStatus = true;			
				}

				/**
				* ionicModal for rate app if not satisfied
				*/
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

				scope.popAsk1 = function () {
					$window.open("mailto:info@jobprogress.com", "_system");
				}

				element.on('tap', scope.showAppRateModel); 

 			}
		}
	}

	/**
	* @dependencies injector $ionicModal, $state, $ionicPopup
	*/
	appRateDirective.$inject=['$ionicModal', '$state', '$ionicPopup', '$window'];
	angular
		.module('tatafo')
		.directive('appRateDirective',appRateDirective)

})();

