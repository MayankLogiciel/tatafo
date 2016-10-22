(function()	{
	'use strict';

	/**
	* FeedDetailController function
	*/
	var ProfileController = function($scope) {
		$scope.image = 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg';
	};

	/**
	* @dependencies injector $scope
	*/
	ProfileController.$inject=['$scope'];

	angular
		.module('tatafo')
		.controller('ProfileController',ProfileController);

})();