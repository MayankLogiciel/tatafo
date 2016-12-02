(function() {
    'use strict';
    var requestIntercepter = function($log, $q, $injector, messagesService, utilService) { 

        return{
            request: function(config) {
                var canceler = $q.defer();
                config.timeout = canceler.promise;
                config.headers = config.headers || {};
                config.timeout = 40000;
                
                //if( ionic.Platform.isWebView() && angular.isDefined(localStorage.tatafo_deviceInfo) ){
                if( ionic.Platform.isWebView() && angular.isDefined(localStorage.tatafo_deviceInfo) ){
                    //set headers so that token can be verified and user's last activity can be captured
                    var deviceInfo = angular.fromJson(localStorage.tatafo_deviceInfo);
                    config.headers["deviceId"] = deviceInfo.device_id;
                    config.headers['deviceToken'] = deviceInfo.device_token;
                    config.headers['pushToken'] = deviceInfo.push_token;
                }else{
                    config.headers['test'] = 'true';
                }
                return config || $q.when(config);
            },

            response: function(response){

                return response;
            },

            requestError: function(rejection) {                
                return rejection;
            },
            
            responseError: function(rejection) {
                var ConnectivityMonitorFactory = $injector.get('ConnectivityMonitorFactory');
                var $state = $injector.get('$state');
                // $log.debug(rejection);
                if(angular.isDefined(window.Connection)) {

                    if(navigator.connection.type == Connection.NONE) {
                        ConnectivityMonitorFactory.showErrorBanner(messagesService.general.INTERNET_NOT_WORKING);
                    }else {
                        switch(rejection.status){
                            case -1:
                            $state.go('app.offline');
                            break;
                            case 0:
                              //timeout case, server unreachable or internet not working
                            ConnectivityMonitorFactory.showErrorBanner(messagesService.general.INTERNET_NOT_WORKING);
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