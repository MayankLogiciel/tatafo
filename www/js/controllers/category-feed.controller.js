(function() {
	'use strict';

	/**
	* CategoryFeedsController Function
	*/
	var CategoryFeedsController = function($scope , $ionicConfig , $stateParams , $http) {

		$scope.category_sources = [];

		$scope.categoryId = $stateParams.categoryId;

		$http.get('feeds.json').success(function(response) {
			var category = _.find(response, {id: $scope.categoryId});
			$scope.categoryTitle = category.title;
			$scope.category_sources = category.feed_sources;
		});

	};

	/**
	* @dependencies injector $scope , $ionicConfig , $stateParams , $http
	*/
	CategoryFeedsController.$inject = ['$scope' , '$ionicConfig' , '$stateParams' , '$http'];
	
	angular
		.module('tatafo')
		.controller('CategoryFeedsController',CategoryFeedsController);

})();