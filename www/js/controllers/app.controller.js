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
		};


		/**
		* Reload the feeds
		*/
		$scope.reload=function(){
    		$scope.$broadcast('reloadFeeds');			
		};

		/**
		* Broadcast method for search
		*/
		$scope.searchData=function(search){
			
			var param='';
			if(search.length==0){
					return;
			};			
			
	    	$scope.$broadcast('getFeedsBySearch',search);
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