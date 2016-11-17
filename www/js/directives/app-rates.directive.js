(function(){

	'use strict';

	/**
	* appRateDirective Directive function
	*/
	var appRateDirective=function($ionicModal, $window, settingService) {		
		return {
			restrict: 'A',
			
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
  					console.log("this is is");
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
					settingService.setAppRateStatus(true);		
					$window.open("market://details?id=com.wec.tatafo", "_system");
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
	* @dependencies injector $ionicModal, $window, settingService
	*/
	appRateDirective.$inject=['$ionicModal', '$window', 'settingService'];
	angular
		.module('tatafo')
		.directive('appRateDirective',appRateDirective)

})();

