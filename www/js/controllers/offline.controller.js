(function() {
	'use strict';

	/**
	* OfflineController function
	*/
	var OfflineController = function($log, $scope, $state, ConnectivityMonitorFactory, $rootScope, $ionicHistory, $ionicLoading) {

		/**
		* Initialization
		*/
		var setup=function(){
			$log.debug('OfflineController setup');			
		};
		$scope.$on('$ionicView.enter', function(e) {
		       $ionicLoading.hide();	
		});	
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
	OfflineController.$inject=['$log', '$scope', '$state', 'ConnectivityMonitorFactory', '$rootScope', '$ionicHistory', '$ionicLoading'];

	angular
		.module('tatafo')
		.controller('OfflineController',OfflineController);

})();