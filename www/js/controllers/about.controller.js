(function() {
	'use strict';

	/**
	* AboutController function
	*/
	var AboutController = function($scope , $ionicActionSheet , $ionicModal , $state) {

		if(typeof analytics !== "undefined"){ 
			analytics.trackView("About Page"); 
		}

	};

	/**
	* @dependencies injector $scope, $ionicActionSheet, $ionicModal, $state
	*/
	AboutController.$inject = ['$scope' , '$ionicActionSheet' , '$ionicModal' , '$state'];

	angular
		.module('tatafo')
		.controller('AboutController' , AboutController);

})();