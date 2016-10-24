(function()	{
	'use strict';

	/**
	* RateAppController function
	*/
	var RateAppController = function($scope) {

		$scope.rateApp = function() {
			//if(ionic.Platform.isAndroid()) {
				console.log("testtststts");
				window.open('market://details?id=com.wec.tatafo', '_system', 'location=yes')
				//AppRate.preferences.storeAppURL.android = 'market://details?id=com.wec.tatafo';
				AppRate.promptForRating(true);
			//}
		};

	};
	
	/**
	* @dependencies injector $scope
	*/
	RateAppController.$inject=['$scope'];

	angular
		.module('tatafo')
		.controller('RateAppController',RateAppController);

})();