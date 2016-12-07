angular
	.module('tatafo')
	.factory('adMobileFactory',function($log, $window){
		var adMob = $window.adMob;
        if(adMob) {
            /** Register adMobileFactory events
            * new events, with variable to differentiate: adNetwork, adType, adEvent
            */
            document.addEventListener('onAdFailLoad', function(data) {
                $log.debug('error: ' + data.error + ', reason: ' + data.reason + ', adNetwork:' + data.adNetwork + ', adType:' + data.adType + ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
            });
            document.addEventListener('onAdLoaded', function(data) {
              $log.debug('onAdLoaded: ' + data);
            });
            document.addEventListener('onAdPresent', function(data) {
              $log.debug('onAdPresent: ' + data);
            });
            document.addEventListener('onAdLeaveApp', function(data) {
              $log.debug('onAdLeaveApp: ' + data);
            });
            document.addEventListener('onAdDismiss', function(data) {
              $log.debug('onAdDismiss: ' + data);
            });

            var defaultOptions = {
                // bannerId: admobid.banner,
                // interstitialId: admobid.interstitial,
                // adSize: 'SMART_BANNER',
                // width: integer, // valid when set adSize 'CUSTOM'
                // height: integer, // valid when set adSize 'CUSTOM'
                position: adMobileFactory.AD_POSITION.BOTTOM_CENTER,
                // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
                bgColor: 'black', // color name, or '#RRGGBB'
                // x: integer,		// valid when set position to 0 / POS_XY
                // y: integer,		// valid when set position to 0 / POS_XY
                isTesting: true, // set to true, to receiving test ad for testing purpose
                // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
            };
            
            var admobid = {};

            if(ionic.Platform.isAndroid()) {
                admobid = { // for Android
                    banner: ANDROID_BANNER_ID,
                    interstitial: ANDROID_INTERSTITIAL_ID
                };
            }

            adMob.setOptions(defaultOptions); 
            // Prepare the ad before showing it
            // 		- (for example at the beginning of a game level)
            adMob.prepareInterstitial({
                adId: admobid.interstitial,
                autoShow: false,
                success: function() {
                    $log.debug('interstitial prepared');
                },
                error: function() {
                    $log.debug('failed to prepare interstitial');
                }
            });
        }else {
            $log.debug("No adMobileFactory?");
        }
        return {
            showBanner: function() {
                if(adMob)
                {
                    adMob.createBanner({
                        adId:admobid.banner,
                        position:adMobileFactory.AD_POSITION.BOTTOM_CENTER,
                        autoShow:true,
                        success: function() {
                            $log.debug('banner created');
                        },
                        error: function() {
                            $log.debug('failed to create banner');
                        }
                    });
                }
            },
            showInterstitial: function() {
                if(adMob)
                {
                    // If you didn't prepare it before, you can show it like this
                    // adMobileFactory.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});
                    // If you did prepare it before, then show it like this
                    // 		- (for example: check and show it at end of a game level)
                    adMob.showInterstitial();
                }
            },
            removeAds: function() {
                if(adMob)
                {
                    adMob.removeBanner();
                }
            }
        };
	})

	.factory('ConnectivityMonitorFactory',function($log, $rootScope, $cordovaNetwork, $ionicContentBanner, $timeout){
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
                        $log.debug(!$cordovaNetwork.isOnline());
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
						    $log.debug("went online");
						    showContentBanner(MESSAGES.GOES_ONLINE, 'info', 'fade', closeOnlineBannerAfter);         
						});

						$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
						    // if(isInternetConnected) return;
						    // isInternetConnected= false;
						    $log.debug("went offline");
						    showContentBanner(MESSAGES.GOES_OFFLINE, 'error', 'fade', closeOfflineBannerAfter);
						});

                    }else {

						window.addEventListener("online", function(e) {
						    $log.debug("went online");
						    showContentBanner(MESSAGES.GOES_ONLINE, 'info', 'fade', closeOnlineBannerAfter);
						}, false);    

						window.addEventListener("offline", function(e) {
						    $log.debug("went offline");
						    showContentBanner(MESSAGES.GOES_OFFLINE, 'error', 'fade', closeOfflineBannerAfter);
						}, false); 

					}
                    if((!$cordovaNetwork.isOnline())) {                                                                 
                          showContentBanner(MESSAGES.GOES_OFFLINE, 'error', 'fade', closeOfflineBannerAfter);                            
                    }

                }
            }
	})

	.factory('requestIntercepter', function($log, $q, $injector, messagesService){
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
                            default:
                            break;
                        }//end of switch

                    } //end else block
                }else{
                    $log.debug("window.Connection not defined.");
                } //end if(window.connection) block

                return $q.reject(rejection);
            } 
        };
	})
    .config(function($httpProvider) {
        //$httpProvider.defaults.headers['hello'] = 'work';
        $httpProvider.interceptors.push('requestIntercepter');
    });