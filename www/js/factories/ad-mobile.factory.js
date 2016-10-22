(function() {
	'use strict';

	/**
	* adMobileFactory function
	*/
	var adMobileFactory = function($window) {

		var adMob = $window.adMob;

        if(adMob) {
            // Register adMobileFactory events
            // new events, with variable to differentiate: adNetwork, adType, adEvent
            document.addEventListener('onAdFailLoad', function(data) {
                console.log('error: ' + data.error + ', reason: ' + data.reason + ', adNetwork:' + data.adNetwork + ', adType:' + data.adType + ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
            });
            document.addEventListener('onAdLoaded', function(data) {
              console.log('onAdLoaded: ' + data);
            });
            document.addEventListener('onAdPresent', function(data) {
              console.log('onAdPresent: ' + data);
            });
            document.addEventListener('onAdLeaveApp', function(data) {
              console.log('onAdLeaveApp: ' + data);
            });
            document.addEventListener('onAdDismiss', function(data) {
              console.log('onAdDismiss: ' + data);
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
                    banner: 'ca-app-pub-6869992474017983/9375997553',
                    interstitial: 'ca-app-pub-6869992474017983/1657046752'
                };
            }

            adMob.setOptions(defaultOptions); 
            // Prepare the ad before showing it
            // 		- (for example at the beginning of a game level)
            adMob.prepareInterstitial({
                adId: admobid.interstitial,
                autoShow: false,
                success: function() {
                    console.log('interstitial prepared');
                },
                error: function() {
                    console.log('failed to prepare interstitial');
                }
            });
        }
        else {
            console.log("No adMobileFactory?");
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
                        console.log('banner created');
                    },
                      error: function() {
                        console.log('failed to create banner');
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
	}
	/**
	* @dependencies injector $window
	*/

	adMobileFactory.$inject=['$window'];

	angular
		.module('tatafo')
		.factory('adMobileFactory',adMobileFactory);

})();