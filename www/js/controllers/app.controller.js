(function() {
	'use strict';

	/**
	* AppController function
	*/
	var AppController = function($log, $stateParams, $scope, $rootScope, $ionicConfig , $state, $ionicLoading, feedService, $ionicPopover,$cordovaNetwork) {

		var setup=function(){
			$log.debug('AppController setup');
			
		};

		$scope.reload=function(){
    		$scope.$broadcast('reloadFeeds');			
		};

		$scope.searchData=function(search){
			
			var param='';
			if(search.length==0){
					return;
			};			
			
	    	$scope.$broadcast('getFeedsBySearch',search);
		};

		$scope.onSearchIconClick = function() {
			$scope.mySearch = !$scope.mySearch;
        	$scope.closed = !$scope.closed;
        	$scope.searchbtn=!$scope.searchbtn
        	$scope.sortPop=!$scope.sortPop;
        	$scope.reload1=!$scope.reload1;

      	};
    	$scope.onClosedIconClick = function() {
        	$scope.reload();
        	$scope.mySearch = !$scope.mySearch;
        	$scope.closed = !$scope.closed;
        	$scope.searchbtn = !$scope.searchbtn
        	$scope.sortPop = !$scope.sortPop;
        	$scope.reload1 = !$scope.reload1;
        	$scope.$broadcast('getallfeeds');
        	
    	};




    	setup();  		
	};

	/**
	* @dependencies injector $scope, $ionicConfig
	*/
	AppController.$inject=['$log','$stateParams', '$scope', '$rootScope', '$ionicConfig', '$state', '$ionicLoading', 'feedService', '$ionicPopover','$cordovaNetwork'];

	angular
		.module('tatafo')
		.controller('AppController',AppController);

})();