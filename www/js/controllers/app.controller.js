(function() {
	'use strict';

	/**
	* AppController function
	*/
	var AppController = function($log, $scope) {

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
	* @dependencies injector $log, $scope,  
	*/
	AppController.$inject=['$log', '$scope'];

	angular
		.module('tatafo')
		.controller('AppController',AppController);

})();