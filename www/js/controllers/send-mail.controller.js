(function()	{
	'use strict';

	/**
	* SendMailController function
	*/
	var SendMailController = function($scope , $cordovaEmailComposer , $ionicPlatform) {
	//we use email composer cordova plugin, see the documentation for mor options: http://ngcordova.com/docs/plugins/emailComposer/
		$scope.sendMail = function() {
		 	$ionicPlatform.ready(function() {
		 		$cordovaEmailComposer.isAvailable().then(function() {
		        	// is available
		        	console.log("Is available");
		       		$cordovaEmailComposer.open({
		        	to: 'hi@startapplabs.com',
		        	subject: 'Nice Theme!',
		        	body:    'How are you? Nice greetings from IonFullApp'
		        	}).then(null, function () {
		          	// user cancelled email
		      		});
		    	}, function () {
				        // not available
				        console.log("Not available");
			    });
		 	});
		};

	};

		/**
		* @dependencies injector $scope , $cordovaEmailComposer , $ionicPlatform
		*/

		SendMailController.$inject=['$scope' , ' $cordovaEmailComposer' , ' $ionicPlatform'];

		angular
			.module('tatafo')
			.controller('SendMailController' , SendMailController);

})();