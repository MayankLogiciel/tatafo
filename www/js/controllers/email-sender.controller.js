(function() {
	'use strict';

    /**
    * EmailSenderController function
    */
	var EmailSenderController = function($scope , $cordovaEmailComposer) {

		$scope.sendFeedback = function() {
            cordova.plugins.email.isAvailable(
            function (isAvailable) {
                cordova.plugins.email.open({
                to:      'webextremeconcept@gmail.com',
                cc:      'app@lwkm.ng',
                subject: 'LWKM:Feedback',
                body:    'I am contacting you because'
                });
            });
        };

        $scope.sendContactMail = function() {
            //Plugin documentation here: http://ngcordova.com/docs/plugins/emailComposer/
            $cordovaEmailComposer.isAvailable().then(function() {
                // is available
                $cordovaEmailComposer.open({
                    to:      'webextremeconcept@gmail.com',
                    cc:      'app@lwkm.ng',
                    subject: 'LWKM:Contact',
                    body:    'I am contacting you because'
                })
                .then(null, function () {
                    // user cancelled email
                });
            });

        };

	};

    /**
    * @dependencies injector $scope , $cordovaEmailComposer
    */
	EmailSenderController.$inject = ['$scope' , '$cordovaEmailComposer'];

	angular
		.module('tatafo')
		.controller('EmailSenderController',EmailSenderController);

})();