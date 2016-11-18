(function() {
	'use strict';

	/**
	* AppController function
	*/
	var AppController = function($log, $scope, settingService, $rootScope) {

		/**
		* Initialization
		*/
		var setup=function(){
			$log.debug('AppController setup');
			$scope.defaultImage = 'img/imgUnavailable.png';
			$rootScope.settings = JSON.parse(localStorage.tatafo_settings);
			$scope.$on('nightModeEnabled', function(event, data){
				$rootScope.settings.nightModeEnabled = data;
			});
		};
    	setup();  		
	};

	/**
	* @dependencies injector $log, $scope,  
	*/
	AppController.$inject=['$log', '$scope', 'settingService', '$rootScope'];

	angular
		.module('tatafo')
		.controller('AppController',AppController);

})();