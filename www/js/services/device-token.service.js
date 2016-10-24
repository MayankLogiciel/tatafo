(function() {
    'use strict';

    /**
    *  sourceService are used for create an connection with api to get and set the valid data.
    */

    var deviceTokenService = function($log, $http, $q, TATAFO_API_URL) {

        /**
        * isTokenAvailable checking the token already available in localstarage
        */
        this.isTokenAvailable = function(){
            
            var deviceToken = JSON.parse(localStorage.deviceToken || '[]');
            if(angular.isDefined(deviceToken) && deviceToken.length > 0 ){
                return true;
            }else{
                return false;
            }           
        };

        /**
        * inserting the token in local storage
        */
        this.setDeviceTokeninLocalStorage = function(deviceToken){
            $log.debug('setDeviceTokeninLocalStorage');            
            localStorage.deviceToken = JSON.stringify(deviceToken);
        };

        /**
        * getting the token from locastorage
        */
        this.getDeviceTokeninLocalStorage = function(){
           return JSON.parse(localStorage.deviceToken);
        };

        /**
        * geting device token from API
        */
        this.getdeviceToken = function(data) {
            var _defer  = $q.defer(data);
            // Initiate the AJAX request.
            $http({
                method: 'post',
                url: TATAFO_API_URL + '/register-device/' + data,
                // params: data,
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
    }


    /**
    * deviceTokenService injector $log, $http, $q, TATAFO_API_URL
    */

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
