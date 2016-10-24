(function(){

      'use strict';

      /**
      * ConnectivityMonitorFactory function
      */

      var ConnectivityMonitorFactory=function($log,$rootScope, $cordovaNetwork, $ionicContentBanner, $timeout) {

            /**
            * initaillization
            */
            var contentBannerInstance = null;
            var MESSAGES = {
                  'SOMETHING_WRONG' : 'Something went wrong. Please try again.',
                  'GOES_ONLINE' : 'You are now connected.',
                  'GOES_OFFLINE' : 'Network unavailable.'
            };
            var closeOfflineBannerAfter = 60*60*1000;
            var closeOnlineBannerAfter = 2*1000;
            var closeOtherBannerAfter = 10*1000;

            var isInternetConnected = true; 
            var showContentBanner = function(text, type, transition, autoClose){

                  $timeout(function(){

                        if (contentBannerInstance) {
                              contentBannerInstance();
                              contentBannerInstance = null;
                        }

                        contentBannerInstance = $ionicContentBanner.show({
                              text: [text],
                              autoClose: autoClose || closeOnlineBannerAfter,
                              type: type || 'error',
                              transition: transition || 'fade'
                        });                
                  }, 200);

            };

            return {
                  MESSAGES: MESSAGES,
                  isOffline: function(){
                        if(ionic.Platform.isWebView()) {
                             console.log(!$cordovaNetwork.isOnline());
                              return !$cordovaNetwork.isOnline();    
                        } else {
                              return !navigator.onLine;
                        }
                  },
                  isOnline: function() {

                        if(ionic.Platform.isWebView()){
                              return $cordovaNetwork.isOnline();    
                        } else {
                              return navigator.onLine;
                        }
                  },
                  showErrorBanner: function(msg){
                        showContentBanner(msg, 'error', 'fade', closeOtherBannerAfter);          
                  },
                  startWatching: function(){
                        $log.debug('startWatching');
                        if(ionic.Platform.isWebView()){

                              $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                                    // if(isInternetConnected) return;
                                    // isInternetConnected= true;
                                    console.log("went online");
                                    showContentBanner(MESSAGES.GOES_ONLINE, 'error', 'fade', closeOnlineBannerAfter);         
                              });

                              $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                                    // if(isInternetConnected) return;
                                    // isInternetConnected= false;
                                    console.log("went offline");
                                    showContentBanner(MESSAGES.GOES_OFFLINE, 'error', 'fade', closeOfflineBannerAfter);
                              });

                        }
                        else {

                              window.addEventListener("online", function(e) {
                                    console.log("went online");
                                    showContentBanner(MESSAGES.GOES_ONLINE, 'error', 'fade', closeOnlineBannerAfter);
                              }, false);    

                              window.addEventListener("offline", function(e) {
                                    console.log("went offline");
                                    showContentBanner(MESSAGES.GOES_OFFLINE, 'error', 'fade', closeOfflineBannerAfter);
                              }, false); 

                        }
                  }
            }
      }

      /** 
      * ConnectivityMonitorFactory $injector $log,$rootScope, $cordovaNetwork, $ionicContentBanner, $timeout
      */

      ConnectivityMonitorFactory.$inject=['$log', '$rootScope', '$cordovaNetwork', '$ionicContentBanner', '$timeout'];

      angular
      .module('tatafo')
      .factory('ConnectivityMonitorFactory',ConnectivityMonitorFactory);

})();
