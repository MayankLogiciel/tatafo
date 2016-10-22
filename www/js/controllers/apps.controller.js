(function() {
	'use strict';

	/**
	* AppsController function
	*/
	var AppsController = function($scope){

		if(typeof analytics !== "undefined") { 
			analytics.trackView("Apps Page"); 
		}

	};

	/**
	* @dependencies injector $scope
	*/
	AppsController.$inject = ['$scope'];

	angular
		.module('tatafo')
		.controller('AppsController',AppsController);

})();