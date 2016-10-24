(function() {
    'use strict';
    var requestIntercepter = function($log, $q, $injector, messagesService, utilService) { 

        return{
            request: function(config) {
                config.headers = config.headers || {};
                
                if( ionic.Platform.isWebView() && angular.isDefined(localStorage.deviceInfo) ){
                    
                    //set headers so that token can be verified and user's last activity can be captured
                    var deviceInfo = angular.fromJson(localStorage.deviceInfo);
                    config.headers['device-id'] = deviceInfo.device_id;
                    config.headers['device-token'] = deviceInfo.device_token;
                    config.headers['push-token'] = deviceInfo.push_token;
                    config.headers['test'] = 'false';

                }else{
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