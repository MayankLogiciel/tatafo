(function() {
    'use strict';
    var requestIntercepter = function($log, $q, $injector, messagesService, utilService) { 
        /**
        * passing data to header like device_id, deviceToken, pushToken
        */
        return{
            request: function(config) {
                config.headers = config.headers || {};
                if(ionic.Platform.isAndroid() && angular.isDefined(localStorage.deviceToken)){
                    var deviceToken = JSON.parse(localStorage.deviceToken);
                    config.headers['device-token'] = deviceToken.device_token;
                    config.headers['device-id'] = deviceToken.device_id;
                   var pushToken = JSON.parse(localStorage.pushobj);
                    config.headers['push-token'] = pushToken.pushToken;
                }else {
                    config.headers['test'] = 'true';
                }                
                config.timeout = 60000;
                return config;
            },

            response: function(response){
                return response;
            },

            requestError: function(rejection) {
                return rejection;
            },
            
            responseError: function(rejection) {
                // $log.debug(rejection);
                if(angular.isDefined(window.Connection)) {

                    if(navigator.connection.type == Connection.NONE) {
                        utilService.toastOrDialog(messagesService.general.INTERNET_NOT_CONNECTED);
                    }else {
                        switch(rejection.status){
                            case 0:
                              //timeout case, server unreachable or internet not working

                            utilService.toastOrDialog(messagesService.general.INTERNET_NOT_WORKING);

                            break;

                            case 400:
                            utilService.toastOrDialog(rejection.data.error.message);
                            case 401:
                            //unauthorized 
                            break;

                            case 403:
                            //access forbidden 
                            utilService.toastOrDialog(rejection.data.error.message);
                            break;

                            case 404:
                            utilService.toastOrDialog(rejection.data.error.message);
                            break;

                            case 412:
                            //multiple error case
                            if(angular.isString(rejection.data.error.message)) {
                                utilService.toastOrDialog(rejection.data.error.message);
                            }else{                    
                                var firstKey = "";
                                for (var keys in rejection.data.error.message) {
                                    firstKey = keys;
                                    break;
                                }
                                if(angular.isArray(rejection.data.error.message[firstKey])) {
                                    utilService.toastOrDialog(rejection.data.error.message[firstKey][0]);
                                }else {
                                    utilService.toastOrDialog(rejection.data.error.message[firstKey]);
                                }
                            }
                            break;

                            case 500:
                            if(angular.isDefined(rejection.data.errors)) {
                                utilService.toastOrDialog(rejection.data.errors.message);
                            }else {
                                utilService.toastOrDialog(rejection.data.message);
                            }
                            break;

                            default:
                           // utilService.toastOrDialog(messagesService.general.SOMETHING_WRONG);
                            break;
                        }//end of switch

                    } //end else block
                }else{
                    $log.debug("window.Connection not defined.");
                } //end if(window.connection) block

                return $q.reject(rejection);
            } 
        };

    }
    
    requestIntercepter.$inject = ['$log', '$q', '$injector' , 'messagesService' , 'utilService'];
    angular
        .module('tatafo')
        .factory('requestIntercepter', requestIntercepter)
        .config(function($httpProvider) {
            //$httpProvider.defaults.headers['hello'] = 'work';
            $httpProvider.interceptors.push('requestIntercepter');
        });
})();