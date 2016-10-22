(function()	{
	'use strict';

	/**
	* RateAppController function
	*/
	var RateAppController = function($scope) {

		$scope.rateApp = function() {
			if(ionic.Platform.isIOS()) {
				//you need to set your own ios app id
				AppRate.preferences.storeAppURL.ios = '1234555553>';
				AppRate.promptForRating(true);
			}else if(ionic.Platform.isAndroid()) {
				//you need to set your own android app id
				AppRate.preferences.storeAppURL.android = 'market://details?id=com.wec.tatafo';
				AppRate.promptForRating(true);
			}
		};

	}

	/**
	* @dependencies injector $scope
	*/
	RateAppController.$inject=['$scope'];

	angular
		.module('tatafo')
		.controller('RateAppController',RateAppController);

})();