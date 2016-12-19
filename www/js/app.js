// Ionic Starter App
angular
    .module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

var postsDBSettings = {
  'POSTS_DB_NAME' : 'tatafo-posts',
  'MAX_RECENT_POST_STORE' : 25,
  'PER_PAGE_POSTS' : 10,
  'AUTO_COMPACTION' : true
};

var bookmarksDBSettings = {
  'BOOKMARKS_DB_NAME' : 'tatafo-bookmarks',
  'AUTO_COMPACTION' : true
};

var postsDB = new PouchDB(postsDBSettings.POSTS_DB_NAME, { auto_compaction: postsDBSettings.AUTO_COMPACTION });
var bookmarksDB = new PouchDB(bookmarksDBSettings.BOOKMARKS_DB_NAME, { auto_compaction: bookmarksDBSettings.AUTO_COMPACTION });

angular
    .module('tatafo', ['ionic', 'underscore', 'tatafo.config', 'ngCordova', 'jett.ionic.content.banner','ionicLazyLoad'])

    .run(function($log, $ionicPlatform, $rootScope, $state, $timeout, deviceTokenService, ConnectivityMonitorFactory, settingService, $cordovaSplashscreen, ANDROID_BANNER_ID, ANDROID_INTERSTITIAL_ID) {

        ionic.Platform.ready(function() {
            //it will set default user settings if not set
            settingService.getSettings();
            settingService.setAppVisitedCount();
            
            var hideSplashScreen = function (){
                if(!settingService.doWeNeedToShowTutorialTour()) {
                    $state.go('intro');
                    }else {
                    $state.go('app.feeds.all');                            
                }

                $timeout(function() {
                    if(ionic.Platform.isWebView()) $cordovaSplashscreen.hide();
                }, 100);
            };
            hideSplashScreen();          

            $ionicPlatform.registerBackButtonAction(function (event) {
                if($state.current.name=="app.feeds.all"){
                    window.plugins.appMinimize.minimize();
                }
                else {
                  navigator.app.backHistory();
                }
            }, 100);

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            onDocLoad();
            ConnectivityMonitorFactory.startWatching();
        });

        function onDocLoad() {
            if(( /(android)/i.test(navigator.userAgent) )) {
                document.addEventListener('deviceready', initApp, false);
            } else {
                initApp();
            }
        }    
        function initApp() {
            initAd();
        }
        function initAd(){
            if ( window.plugins && window.plugins.AdMob ) {
                var ad_units = {
                    android : {
                        banner: ANDROID_BANNER_ID,
                        interstitial: ANDROID_INTERSTITIAL_ID
                    }
                };
                var admobid = "";
                if( /(android)/i.test(navigator.userAgent) ) {
                    admobid = ad_units.android;
                } 
                window.plugins.AdMob.setOptions( {
                    publisherId: admobid.banner,
                    interstitialAdId: admobid.interstitial,
                    bannerAtTop: false, // set to true, to put banner at top
                    overlap: false, // set to true, to allow banner overlap webview
                    offsetTopBar: false, // set to true to avoid ios7 status bar overlap
                    isTesting: false, // receiving test ad
                    autoShow: true // auto show interstitial ad when loaded
                });
                registerAdEvents();
            } 
        }
        //optional, in case respond to events
        function registerAdEvents() {
            document.addEventListener('onReceiveAd', function(){});
            document.addEventListener('onFailedToReceiveAd', function(data){});
            document.addEventListener('onPresentAd', function(){});
            document.addEventListener('onDismissAd', function(){ });
            document.addEventListener('onLeaveToAd', function(){ });
            document.addEventListener('onReceiveInterstitialAd', function(){ });
            document.addEventListener('onPresentInterstitialAd', function(){ });
            document.addEventListener('onDismissInterstitialAd', function(){ });
        }
        $ionicPlatform.on("resume", function() {});
    })
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.tabs.position('bottom');
        $stateProvider
        .state('intro', {
            url: '/intro',
            templateUrl: 'views/app/tab-intro.html',
            controller: 'IntroCtrl'
        })
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "views/app/side-menu.html",
            controller: 'AppController'
        })
        .state('app.feeds', {
            url: "/feeds",
            cache: true,
            abstract: true,
            views: {
                'menuContent': {
                    templateUrl: "views/app/feeds/tabs.html"
                }
            }
        })
        .state('app.feeds.all', {
            url: '/all',
            cache: true,
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
            url: "/feed/:sourceId/:sourceName",
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
        .state('app.offline', {
            url: "/offline",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "views/app/feeds/offline-page.html",
                    controller: 'OfflineController'
                }
            }
        })
        .state('app.feeds.bookmarks', {
            url: "/bookmarks",
            cache: false,
            views: {
                'bookmark-tab': {
                    templateUrl: "views/app/bookmarks.html",
                    controller: 'BookMarksController'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/app/feeds');
    });
