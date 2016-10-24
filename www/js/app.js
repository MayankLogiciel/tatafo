// Ionic Starter App
angular
    .module('underscore', [])
    .constant('ONESIGNAL_APP_ID','8d93d121-4d4e-4981-9392-16da702dcf92')
    .constant('GOOGLE_PROJECT_NUMBER','518598830385')

    .factory('_' , function() {
        return window._; // assumes underscore has already been loaded on the page
    });

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
    angular
        .module('tatafo', ['ionic' , 'angularMoment' , 'tatafo.config' , 'underscore' , 'ngResource' , 'ngCordova' , 'slugifier' , 'youtube-embed', 'jett.ionic.content.banner' ])

    .run(function($ionicPlatform,$rootScope, $ionicConfig, $timeout, $cordovaNetwork, deviceTokenService, $cordovaDevice,  ConnectivityMonitorFactory, ONESIGNAL_APP_ID, GOOGLE_PROJECT_NUMBER, settingService) {

         ionic.Platform.ready(function() {

            if (ionic.Platform.isAndroid() && ionic.Platform.isWebView()) {
               
                var notificationOpenedCallback = function(jsonData) {
                    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                };
                
                window.plugins.OneSignal
                .startInit(ONESIGNAL_APP_ID, GOOGLE_PROJECT_NUMBER)
                .handleNotificationOpened(notificationOpenedCallback)
                .handleNotificationReceived(function(jsonData) {                    
                })
               .endInit();
               // generate unique oneSignal user id.
                window.plugins.OneSignal.getIds(function(pushobj) {
                    if(angular.isDefined(localStorage.pushobj)) {
                        if(localStorage.pushobj.pushToken != pushobj.pushToken) {
                            localStorage.pushobj.pushToken = pushobj.pushToken;
                        }
                    }else {
                        localStorage.pushobj = JSON.stringify(pushobj);
                    }
               });
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            var CurrentDeviceId = $cordovaDevice.getUUID();
            if(deviceTokenService.isTokenAvailable()) {
                deviceTokenService.getdeviceToken(CurrentDeviceId).then(function(res) {
                    var device = deviceTokenService.getDeviceTokeninLocalStorage();
                    if(device.device_id != res.data.data.data.device_id) {
                        deviceTokenService.setDeviceTokeninLocalStorage(res.data.data.data);
                    }
                });
            }else {
                if(CurrentDeviceId) {
                    deviceTokenService.getdeviceToken(CurrentDeviceId).then(function(res) {
                        deviceTokenService.setDeviceTokeninLocalStorage(res.data.data.data);
                    });
                }else {
                    console.log("oops! cant get device id.")
                }
            }

            var admobid = {};
            if( /(android)/i.test(navigator.userAgent) ) { 
                admobid = { // for Android
                    banner: 'ca-app-pub-6869992474017983/9375997553',
                    interstitial: 'ca-app-pub-6869992474017983/1657046752'
                };
            } else {
                admobid = { // for Windows Phone
                    banner: 'ca-app-pub-6869992474017983/8878394753',
                    interstitial: 'ca-app-pub-6869992474017983/1355127956'
                };
            }

            if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
                document.addEventListener('deviceready', initApp, false);
            } else {
                initApp();
            }

            function initApp() {
                if (! AdMob ) { alert( 'admob plugin not ready' ); return; }

                AdMob.createBanner( {
                    adId: admobid.banner, 
                    isTesting: true,
                    overlap: false, 
                    offsetTopBar: false, 
                    position: AdMob.AD_POSITION.BOTTOM_CENTER,
                    bgColor: 'black'
                } );
                
                AdMob.prepareInterstitial({
                    adId: admobid.interstitial,
                    autoShow: false
                });
            }

            //start watching online/offline event
            console.log(ConnectivityMonitorFactory.startWatching());

                /**
                    settingService.getSetting function will set default settings if already not set
                    (means first Time) other wise it will return users setting
                */
                var appSetting = settingService.getSettings();  

                if (appSetting.lastTimeSourceSynced == '') {
                    settingService.setSyncTime(new Date());
                }

                /**
                    settingService.getSetting function will set 6 hours default time for new sources
                */

                if (appSetting.sourceSyncIntervalTime == 0) {
                    settingService.setSourceSyncIntervalTime(6);
                }

                /**
                    settingService.pushNotificationEnabled function will set default pushnotification setting
                */
                if (angular.isDefined(appSetting.pushNotificationEnabled)) {
                    window.plugins.OneSignal.setSubscription(appSetting.pushNotificationEnabled);                    
                }
        });

        // This fixes transitions for transparent background views
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if(toState.name.indexOf('auth.walkthrough') > -1)
            {
                // set transitions to android to avoid weird visual effect in the walkthrough transitions
                $timeout(function() {
                $ionicConfig.views.transition('android');
                $ionicConfig.views.swipeBackEnabled(false);
                console.log("setting transition to android and disabling swipe back");
            }, 0);
        }
    });
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        if(toState.name.indexOf('app.feeds-categories') > -1)
        {
            // Restore platform default transition. We are just hardcoding android transitions to auth views.
             $ionicConfig.views.transition('platform');
            // If it's ios, then enable swipe back again
            if(ionic.Platform.isIOS()) {
                $ionicConfig.views.swipeBackEnabled(true);
            }
            console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
        }
    });

    $ionicPlatform.on("resume", function() {

    });


})
.config(function($stateProvider , $urlRouterProvider , $ionicConfigProvider) {

$ionicConfigProvider.tabs.position('bottom');
$stateProvider

//Introductions
.state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppController'
})
//FEEDS
.state('app.feeds', {
    url: "/feeds",
   // abstract: true,
    views: {
        'menuContent': {
            templateUrl: "views/app/feeds/tabs.html"
        }
    }
})

.state('app.feeds.all', {
    url: '/all',
    views: {
        'all-tab': {
            templateUrl: 'views/app/feeds/all-tab.html',
            controller: 'AllFeedsController'
        }
    }
})
.state('app.feeds.local', {
    url: '/local',
    views: {
        'local-tab': {
            templateUrl: 'views/app/feeds/local-tab.html',
            controller: 'AllFeedsController'
        }
    }
})
.state('app.feeds.foreign', {
    url: '/foreign',
    views: {
        'foreign-tab': {
            templateUrl: 'views/app/feeds/foreign-tab.html',
            controller: 'AllFeedsController'
        }
    }
})

.state('app.feed-entries', {
    url: "/feed/:sourceId",
    views: {
        'menuContent': {
            templateUrl: "views/app/feeds/source-feed.html",
            controller: 'SourceFeedController'
        }
    }
})

.state('app.feed-entries-details', {
    url: "/feed-entries-details",
    cache: false,
    views: {
        'menuContent': {
            templateUrl: "views/app/feeds/feed-details.html",
            controller: 'FeedDetailController'
        }
    }
})
//OTHERS
.state('app.settings', {
    url: "/settings",
    cache: false,
    views: {
        'menuContent': {
            templateUrl: "views/app/settings.html",
            controller: 'SettingsController'
        }
    }
})

.state('app.bookmarks', {
    url: "/bookmarks",
    cache: false,
    views: {
        'menuContent': {
            templateUrl: "views/app/bookmarks.html",
            controller: 'BookMarksController'
        }
    }
});

// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/app/feeds');
});
