(function() {
	'use strict';

	/**
	* ContactController Function 
	*/

	var ContactController = function($scope) {

		if(typeof analytics !== "undefined") {
			analytics.trackView("Contact Page");
		}
	};

	/**
	* @dependencies injector $scope
	*/
	ContactController.$inject=['$scope'];

	angular
		.module('tatafo')
		.controller('ContactController',ContactController);
})();