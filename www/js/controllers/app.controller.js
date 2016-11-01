(function() {
	'use strict';

	/**
	* AppController function
	*/
	var AppController = function($log, $stateParams, $scope, $rootScope, $ionicConfig , $state, $ionicLoading, feedService, $ionicPopover,$cordovaNetwork) {

		/**
		* Initialization
		*/
		var setup=function(){
			$log.debug('AppController setup');
			$scope.defaultImage = 'img/imgUnavailable.png';		
		};


		/**
		* Reload the feeds
		*/
		$scope.reload=function(){
    		$scope.$broadcast('reloadFeeds');			
		};

    	setup();  		
	};

	/**
	* @dependencies injector $log, $stateParams, $scope, $rootScope, $ionicConfig , $state, $ionicLoading, feedService, $ionicPopover,$cordovaNetwork
	*/
	AppController.$inject=['$log','$stateParams', '$scope', '$rootScope', '$ionicConfig', '$state', '$ionicLoading', 'feedService', '$ionicPopover','$cordovaNetwork'];

	angular
		.module('tatafo')
		.controller('AppController',AppController);

})();