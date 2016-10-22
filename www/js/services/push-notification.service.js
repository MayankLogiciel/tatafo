(function()	{
	'use strict';

	/**
	* pushNotificationsService  function
	*/
	var pushNotificationsService=function($rootScope , $cordovaPush , NodePushServer , GCM_SENDER_ID) {

		 this.isPushNotificationExist = function(){
            
            var notification = JSON.parse(localStorage.notification || '[]');

            if(angular.isDefined(notification) && notification.length > 0 ){
                return true;
            }else{
                return false;
            }
           
        };

        var setNotificationinLocalStorage = function(notification){
            $log.debug('setNotificationinLocalStorage');
            localStorage.notification = JSON.stringify(sources);
        };

		

	};

	/**
	* @dependencies injector $rootScope, $cordovaPush, NodePushServer, GCM_SENDER_ID
	*/

	pushNotificationsService.$inject=['$rootScope', '$cordovaPush', 'NodePushServer', 'GCM_SENDER_ID'];

	angular
		.module('tatafo')
		.service('pushNotificationsService',pushNotificationsService);

})();