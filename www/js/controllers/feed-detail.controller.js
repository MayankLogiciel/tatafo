(function() {
	'use strict';

	/**
	* FeedDetailController function
	*/
	var FeedDetailController = function($log, $scope, feedDetailService, bookMarkService, feedService, socialService, ConnectivityMonitorFactory, $timeout, sourcesService, $rootScope, $ionicLoading, feedsDAOService, $ionicHistory, $window) {
		
		/**
		* Initialization
		*/
		var setup = function(){
			$log.debug("FeedDetailController");
			$scope.sttButton=true;
			$scope.allFeed=[];
			$scope.load = false;
			$scope.entry = feedDetailService.getPostData(); //load feed data			
			$scope.load = true;
			//find related source information from localStorage saved sources
			$scope.sourceData = sourcesService.getFeedSourceFromLocalStorage($scope.entry.source_id);

			//find related topic information from  related source(sourceData)
			if($scope.sourceData.topics.data.length > 0) {
				$scope.sourceData.topics.data.map(function(val) {
					if (val.name == $scope.entry.topic_name) {
						$scope.topic = val;
					}
				});
			};
			
			loadFeeds();
			markAsRead();		
			
		    $scope.$on('$ionicView.beforeLeave', function(e) {
		        if (window.AdMob) AdMob.showInterstitial();	       
		    });			
		};

	    /**
	    * getting the current index of th feed showing in article page
	    */
		var getCurrentFeedIndex = function(){
			angular.forEach($scope.allFeed, function(val, index) {
				//$log.debug(val);
				if(angular.isDefined(val.doc) && $scope.entry.id == val.doc.data.id) {
					$scope.currentIndex = index;
				}

				if(!angular.isDefined(val.doc) && $scope.entry.id == val.id) {
					$scope.currentIndex = index;
				}
			});
		}

		/**
	    * Loading the all feeds for next and previous the the current index
	    */
		var loadFeeds = function() {	
			$scope.allFeed=feedDetailService.getCombinedPostDataForNextPrevious();
			getCurrentFeedIndex();
		}

		/**
	    * handling the Next button to show next article
	    */
		$scope.nextButton=function(){
			$scope.load = false;
			$scope.currentIndex = $scope.currentIndex + 1;

			if(angular.isDefined($scope.allFeed[$scope.currentIndex])) {
				$scope.entry = $scope.allFeed[$scope.currentIndex];		
			}else {
				$scope.entry = $scope.allFeed[$scope.currentIndex].doc.data;		
			}
			$timeout(function() {
				$scope.load = true;
			}, 0, false);
		}

		/**
	    * handling the previous button to show next article
	    */
	    $scope.previousButton=function(){
	    	$scope.load = false;
			$scope.currentIndex = $scope.currentIndex - 1;
			if(angular.isDefined($scope.allFeed[$scope.currentIndex])) {
				$scope.entry = $scope.allFeed[$scope.currentIndex];		
			} else {
				$scope.entry = $scope.allFeed[$scope.currentIndex].doc.data;		
			}
			$timeout(function() {
				$scope.load = true;
			}, 0, false);
		}

		/**
		* mark post status read
		*/
		var markAsRead = function() {
			var params = {
				status:"read",
				ids:[$scope.entry.id]
			};
			if (!$scope.entry.is_read && ConnectivityMonitorFactory.isOnline()) {
				feedService.markPostReadUnread(params).then(function(res) {
					$log.debug(res);
					$rootScope.$broadcast("readArticle", { id: res.data.data.updated_ids[0], status: true });
				})
			}
			if (!$scope.entry.is_read && ConnectivityMonitorFactory.isOffline()) {
			 	feedsDAOService.markPostReadUnread($scope.entry).then(function(res) {			 		
			 	})
			 }
		};

		$scope.openEmail = function (link) {
			window.open("mailto:"+link, '_system');
		};

		$scope.openLink = function (link) {
			cordova.ThemeableBrowser.open(link, '_blank', {
			    statusbar: {
			        color: '#FFFFFF'
			    },
			    toolbar: {
			        height: 44,
			        color: '#f0f0f0ff'
			    },
			    title: {
			        color: '#E74D4D',
			        showPageTitle: true
			    },
			    closeButton: {
			        image: 'ic_action_remove',
			        imagePressed: 'close_pressed',
			        align: 'left',
			        event: 'closePressed'
			    },			   
			    backButtonCanClose: true
			}).addEventListener('backPressed', function(e) {
				}).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
			    	$log.debug(e.message);
				}).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
			    	$log.debug(e.message);
				});
			};
			
		/**
		*  bookmarkPost post the feed deatil for book mark for PouchDB
		*/	
		$scope.bookmarkPost = function() {	
			$scope.entry.bookmarkSaved = true;
			bookMarkService.addBookmarkToPouchDB($scope.entry);
		};

		/**
		* Back Button Handling
		* Solution for Back button because it does not behave properly after few moves
		* Due to BackView():null problem($window.history.go(-1) resolve this problem)  
		*/
		$scope.myGoBack = function() {
    		$window.history.go(-1);
  		};


		$scope.sharePost = function() {
			socialService.share($scope.entry.feed.summary || $scope.entry.feed.content, $scope.entry.feed.title, $scope.entry.image, $scope.entry.feed.permalinkUrl);
		}
		setup();
	};

	
	FeedDetailController.$inject = ['$log', '$scope', 'feedDetailService', 'bookMarkService', 'feedService', 'socialService', 'ConnectivityMonitorFactory', '$timeout', 'sourcesService', '$rootScope', '$ionicLoading', 'feedsDAOService', '$ionicHistory', '$window'];

	angular
		.module('tatafo')
		.controller('FeedDetailController',FeedDetailController);
})();