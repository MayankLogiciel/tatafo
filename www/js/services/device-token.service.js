(function() {
    'use strict';

    var deviceTokenService = function($log, $http, $q, TATAFO_API_URL) {

        /**
        * register device on server for 
        * 1) push notification 
        * 2) read unread manage user's posts/articles without login
        */
        this.registerDeviceOnServer = function(data) {
            var _defer  = $q.defer();
            // Initiate the AJAX request.
            console.log(data);
            $http({
                method: 'post',
                url: TATAFO_API_URL + '/register-device',
                params: data,
                timeout: _defer.promise
            }).then(
                function( response ) {
                    // setFeedSourcesinLocalStorage(response);
                    _defer.resolve(response);
                },
                function(response) {
                    _defer.reject(response);
                }
            );
            return _defer.promise;
        };

        /**
        * Check whether we need to register device on server
        * it will register for the following cases
        * 1) if first time or unregistered
        * 2) if pushObj tokens has changed from device
        * @param {Object} pushObj : result from getIds() from OneSignal having pushToken and userId
        */
        this.isRegisterOnServerRequired = function(pushObj){

            if( !localStorage.deviceInfo ){
                $log.debug('deviceInfo not present in localStorage');
                return true;
            }

            var deviceInfo = angular.fromJson(localStorage.deviceInfo);

            if( deviceInfo.push_token != pushObj.pushToken || deviceInfo.device_token != pushObj.userId ){
                $log.debug('deviceInfo has changed from device & localStorage');
                return true;
            }else{
                return false;
            }

        };

        this.setDeviceInfoInLocalStorage = function(deviceInfo){
            localStorage.deviceInfo = angular.toJson(deviceInfo);
        };

        this.getDeviceInfoFromLocalStorage = function(){
            return angular.fromJson(localStorage.deviceInfo);
        };

    }

    deviceTokenService.$inject = [
        '$log', 
        '$http', 
        '$q', 
        'TATAFO_API_URL'
    ];
    angular
        .module('tatafo')
        .service('deviceTokenService', deviceTokenService);
})();
