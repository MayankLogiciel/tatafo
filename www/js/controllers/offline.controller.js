(function() {
	'use strict';

	/**
	* OfflineController function
	*/
	var OfflineController = function($log, $scope, $state, ConnectivityMonitorFactory, $rootScope,$ionicHistory) {

		/**
		* Initialization
		*/
		var setup=function(){
			$log.debug('OfflineController setup');			
		};

		$scope.retry =function () {
			if(ConnectivityMonitorFactory.isOffline()) {
				$state.go('app.offline');
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				$rootScope.$broadcast("retry");
				$scope.myGoBack();
			}	
		}

		$scope.myGoBack = function(){
			$ionicHistory.goBack();
		}
    	setup();  		
	};

	/**
	* @dependencies injector $log, $scope,  
	*/
	OfflineController.$inject=['$log', '$scope', '$state', 'ConnectivityMonitorFactory', '$rootScope', '$ionicHistory'];

	angular
		.module('tatafo')
		.controller('OfflineController',OfflineController);

})();