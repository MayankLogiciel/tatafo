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
        .module('tatafo', ['ionic', 'underscore','ngCordova', 'jett.ionic.content.banner','ionicLazyLoad'])

        /**
        * Constant for QA API Url
        * Constant ONESIGNAL App Id
        * Constant for Admob (Banner and Interstitial ads)
        **/
        // .constant('TATAFO_API_URL','http://qa.tatafo.me/api/v1')
        // .constant('ONESIGNAL_APP_ID','8c566d45-c299-4535-bd2f-f19415635a55')
        // .constant('GOOGLE_PROJECT_NUMBER','1082216437947')
        // .constant('ANDROID_BANNER_ID','ca-app-pub-2007428953027611/9618067289')
        // .constant('ANDROID_INTERSTITIAL_ID','ca-app-pub-2007428953027611/9618067289')
        // .constant('DEBUG', true)

        /**
        * Constant for Tatafo Live Server Url
        * Constant ONESIGNAL App Id
        * Constant for Admob (Banner and Interstitial ads)
        **/
        .constant('TATAFO_API_URL','http://tatafo.me/api/v1')
        .constant('ONESIGNAL_APP_ID','a726a388-d2df-4a3f-8d02-e4a1a5cb6c2e')
        .constant('GOOGLE_PROJECT_NUMBER','581044149896')
        .constant('ANDROID_BANNER_ID','ca-app-pub-2007428953027611/9468702088')
        .constant('ANDROID_INTERSTITIAL_ID','ca-app-pub-2007428953027611/4898901684')
        .constant('DEBUG', true)

        .run(function($ionicPlatform, $state, $timeout, $cordovaSplashscreen) {
            
            ionic.Platform.ready(function() {                
                var hideSplashScreen = function (){
                    if(!localStorage.tatafo_AppTutorialTourStatus) {
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
            });
        })

        .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $logProvider, DEBUG) {
            $logProvider.debugEnabled(DEBUG);
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
