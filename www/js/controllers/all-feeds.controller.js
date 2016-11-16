(function() {
	'use strict';

	/**
	* AllFeedsController Function
	*/
	var AllFeedsController = function($log, $ionicPopover, $rootScope, $scope, sourcesService, feedService, feedsDAOService, $ionicLoading, $state,feedDetailService, $ionicScrollDelegate, bookMarkService, socialService, ConnectivityMonitorFactory, settingService, $timeout) {

		var setup = function(){
			$log.debug('AllFeedsController setup');
			$scope.allFeed = [];
			$scope.feedSources = [];
			$scope.feedsParams = {
				page:1,
				limit:10
			};
			$scope.isMoreFeeds=false;
			$scope.sttButton=false;
			$scope.isSearchOpen = false;
			$scope.searchQuery = '';
			$scope.feedStatus = {};
			$scope.feedStatus.read=true;
			$scope.feedStatus.unread=true;
			$scope.feedLoaded = false;			
			getFeeds();			
			loadPopOver();
			$rootScope.$on("readArticle", function (event,args) {
				$log.debug("Read Article event received in All Feed Controller");
	      		angular.forEach($scope.allFeed,function(val, key){
	      			if(val.id == args.id){
	      				$scope.allFeed[key].is_read=true;
	      			}
	      		});
	    	});	    		
		};

		var getFeeds = function () {
			if(sourcesService.isFeedSourcesAvailable() && !isSourceSyncRequired()){
				//load all feeds
				$log.debug('Sources already Available');
				$scope.feedSources=sourcesService.getFeedSourcesFromLocalStorage();
				loadFeeds();
			}else{	
				//load feed source data first
				$log.debug('Sources Unavailable');
				$ionicLoading.show({
          			template: '<ion-spinner icon="android"></ion-spinner>'
        		});
				loadFeedSources();
			}
		};

		/**
		* Decide whether source data sync is required or not
		* by checking users sync preference and last sync time
		*/

		var isSourceSyncRequired = function(){
			var syncSetting = settingService.getSettings().syncTimeOption;
			var syncIntervalInMS = syncSetting.value*60*60*1000;
			var lastSynced = Date.parse(sourcesService.getLastSourceSyncTime());
			var currenTime = Date.parse(new Date());
			var timeSinceLastSyncInMS = currenTime - lastSynced;

			if(timeSinceLastSyncInMS > syncIntervalInMS) {
				$log.debug("Sync is required");
				return true;
			}else {
				$log.debug("Sync is not required");
			 	return false;
			}
		}

		/**
		* loadPopOver used to open the popover by clicking sort drop downbutton
		*/		
		var loadPopOver=function(){
			$ionicPopover.fromTemplateUrl('views/app/feeds/sort-popover.html', {
    			scope: $scope,
 			}).then(function(popover) {
    			$scope.popover = popover;
  			});
		};

		/**
		* loadFeedSources loads the new sources from API by sending request using sourcesService.getSources
		*/	
		var loadFeedSources = function() {
			sourcesService.getSources().then(function(sources) {
				$scope.feedSources = sources;
				loadFeeds();
			});
		};

		/**
		* loadFeeds loads the all feeds
		* if ConnectivityMonitorFactory.isOffline then loads the feeds from pouch db using feedsDAOService.getfeedFromPouchDB
		* if ConnectivityMonitorFactory.isOnline then loads the feeds from  API using feedService.getFeeds
		*/
		var loadFeeds = function(isLoadMore) {
			$scope.loaded = false;
			if(ConnectivityMonitorFactory.isOffline()) {
				if( ($scope.feedStatus.read && $scope.feedStatus.unread) || (!$scope.feedStatus.read && !$scope.feedStatus.unread) ){
					LoadAllFeedsByCheckingReadUnreadFilter(isLoadMore);
				}else {
					loadFeedsByFilteringReadOrUnread();
				}
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				if($state.current.name.indexOf('app.feeds.all') !== -1 ) {
					$ionicLoading.show({
	          			template: '<ion-spinner icon="android"></ion-spinner>'
	        		});
					feedService.getFeeds($scope.feedsParams).then(function(feed) {			
		   				if(feed.data.data.meta.pagination.current_page < feed.data.data.meta.pagination.total_pages){
							$scope.isMoreFeeds = true;
						}else{
							$scope.isMoreFeeds = false;
						}
						if(!isLoadMore) {
							$scope.allFeed = [];
						}
						$scope.allFeed = $scope.allFeed.concat(feed.data.data.feed);						
						getBookMarksfromPouchDBToChangeSaveButtonColor();
						feedsDAOService.addNewFeeds($scope.allFeed);
						$scope.loaded = true;
						$timeout(function() {
							$scope.feedLoaded = true;
						}, 200);
					}).finally(function(){	
						if(isLoadMore){
							$scope.$broadcast('scroll.infiniteScrollComplete');
						}else{
							$scope.$broadcast('scroll.refreshComplete');
						}				
						$ionicLoading.hide();
					});
				}
			}
		};

			/**
			* LoadFeeds 
			*/
			var LoadAllFeedsByCheckingReadUnreadFilter = function(isLoadMore) {
				feedsDAOService.getRecentPostsFromPouchDB($scope.feedsParams).then(function(response){
					$log.debug(response);
					if(!isLoadMore) {
						$scope.allFeed = [];
					}
					if(response.posts.length>0){
						angular.forEach(response.posts, function(feed, key) {	
							$scope.allFeed = $scope.allFeed.concat(feed);
						});						
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}	
					else{
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}
					getBookMarksfromPouchDBToChangeSaveButtonColor();					
					$scope.loaded = true;
					$timeout(function() {
						$scope.feedLoaded = true;
					}, 200);
				}).finally(function(){	
					if(isLoadMore){
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}else{
						$scope.$broadcast('scroll.refreshComplete');
					}				
				});	
			}
		/*
		* deleteBookMarks used to make the bookmark unselected form
		*/
		$rootScope.$on("deleteBookMarks", function (event,arg) {
			$scope.allFeed.map(function(v) {
				if(v.id == arg.id){
					v.bookmarkSaved = false;
				}
			});						
		});

		/*
		* getBookMarksfromPouchDBToChangeSaveButtonColor used change to save Button color 
		* Getting all bookmark from PouchDB
		* comparing them with Feed List 
		*/
		var getBookMarksfromPouchDBToChangeSaveButtonColor  = function() {
			var getBookMarksfromPouchDB  = [];
			bookMarkService.getBookmarkList().then(function(response){
				getBookMarksfromPouchDB = response;
				$scope.allFeed.map(function(value) {
					value.bookmarkSaved = false;
					getBookMarksfromPouchDB.map(function(val) {
						if(val.doc.data.id == value.id) {
							value.bookmarkSaved = true;
						}
					})								
				});
			});
		}	

		/**
		* selectOption to geting the read and unread feeds
		* if ConnectivityMonitorFactory.isOffline then feedService.sortReadUnread loads the feeds from pouchDB(after filtering) 
		* if ConnectivityMonitorFactory.isOnline then send the request status to API and load the feed according to the satatus by calling load feeds
		*/
		$scope.selectOption = function() {
			$scope.feedsParams.page = 1;
			if(ConnectivityMonitorFactory.isOffline()) {	
				if( ($scope.feedStatus.read && $scope.feedStatus.unread) || (!$scope.feedStatus.read && !$scope.feedStatus.unread) ){
					loadFeeds();
				}else {
					loadFeedsByFilteringReadOrUnread();
				}
							
			}			
			if(ConnectivityMonitorFactory.isOnline()) {
				$ionicLoading.show({
	          		template: '<ion-spinner icon="android"></ion-spinner>'
	        	});
				
				if( $scope.feedStatus.read && $scope.feedStatus.unread ) {
					if (angular.isDefined($scope.feedsParams.status)) {
		    			delete $scope.feedsParams.status;
		    		}
				} else if( $scope.feedStatus.read || $scope.feedStatus.unread ) {
					$scope.feedsParams.status = ($scope.feedStatus.read) ? "read" : "unread";
				} else {
					if (angular.isDefined($scope.feedsParams.status)) {
		    			delete $scope.feedsParams.status;
		    		}
				}
				loadFeeds();
				$scope.scrollTop();
			}
			$scope.popover.hide();
		};

		var loadFeedsByFilteringReadOrUnread = function() {
			if( $scope.feedStatus.read || $scope.feedStatus.unread ) {
				$scope.feedsParams.is_read = ($scope.feedStatus.read) ? true : false;
				feedsDAOService.getReadUnreadPosts($scope.feedsParams).then(function(response) {
						$scope.allFeed = [];											
						$scope.allFeed = response.posts;							
						$scope.isMoreFeeds = response.isMorePostsPresent;
				}).finally(function(){	
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');									
				});				
			}		
		}

		$scope.search = function(query){
			$scope.isSearchUsed = true;
			$scope.feedsParams.page = 1;
			$scope.feedsParams.name = query;
			if(ConnectivityMonitorFactory.isOffline()) {				
				ConnectivityMonitorFactory.showErrorBanner('Network unavailable');
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				$scope.doRefresh();
			}		
		};

		/**
		* show and hide button not needed while clicking search button
		*/
		$scope.onSearchIconClick = function() {
			$scope.isSearchOpen = $scope.isSearchOpen ? false : true;
      	};

      	/**
		* show and hide button not needed while clicking search closed button
		*/
    	$scope.onClosedIconClick = function() {
        	$scope.isSearchOpen = false;
        	delete $scope.feedsParams.name;
        	if($scope.isSearchUsed){
	        	$scope.doRefresh();
        		$scope.isSearchUsed = false;
        	}        	
    	};

		$scope.bookmarkPost = function(post) {
			post.bookmarkSaved = true;
			bookMarkService.addBookmarkToPouchDB(post);
		};

		$scope.sharePost = function(post) {
			socialService.share(post.feed.summary || post.feed.content, post.feed.title, post.image, post.feed.permalinkUrl);
		};

		/**
		*loadMore incrementing page by one and calling the loadFeeds
		*/
		$scope.loadMore = function() {
			console.log("testtsggsgh");
			if($scope.allFeed.length > 0){
				$scope.feedsParams.page++;
		 		loadFeeds(true);	
			}

		}

		/**
		* loadPostDetails feedDetailService.setPostData posting the deatil of single feed to article page
		* loadPostDetails feedDetailService.setCombinedPostDataForNextPrevious sending the deatil of other feeds for next and previous Button
		*/	
		$scope.loadPostDetails=function(post) {	
			feedDetailService.setPostData(post);
			feedDetailService.setCombinedPostDataForNextPrevious($scope.allFeed);
			$state.go('app.feed-entries-details');								
		};


		/**
		* opening the url app.feed-entries with perticular source Id
		*/
		$scope.feedDetail = function (sourceId,sourceName) {
			settingService.setSourceFeedVisitedCount();
			$state.go('app.feed-entries', {sourceId: sourceId, sourceName: sourceName});
		} 

		/**
		* doRefresh setting up the page 1 
		* calling the loadFeeds
		*/
		$scope.doRefresh = function() {	
			$scope.feedsParams.page = 1;
			$scope.isMoreFeeds = true;			
			loadFeeds();
       		$scope.scrollTop();
		};

		/**
		* scrolling up to top by clicking sttButton
		* hide the sttButton
		*/
		$scope.scrollTop = function() { //ng-click for back to top button
	  		$ionicScrollDelegate.scrollTop([true]);
	 		$scope.sttButton=false; //hide the button when reached top
		};

		/**
		* getting the scroll postion
		*/
		$scope.getScrollPosition = function() {
	 		//monitor the scroll
	 		var moveData = $ionicScrollDelegate.$getByHandle('feedshandler').getScrollPosition();
	 		$scope.$apply(function() {
	    		if(angular.isDefined(moveData) && moveData.top>150) {
	      			$scope.sttButton=true;
	    		}else	{
	       			$scope.sttButton=false;
	     		}
	    	});
	  	};

	  	setup();
	};

	/*
	* AllFeedController injector $log, $ionicPopover, $rootScope, $scope, sourcesService, feedService, feedsDAOService, $ionicLoading, $state,feedDetailService, $ionicScrollDelegate, bookMarkService, socialService, ConnectivityMonitorFactory, settingService
	*/
	AllFeedsController.$inject = [
		'$log',
		'$ionicPopover', 
		'$rootScope',
		'$scope', 
		'sourcesService',
		'feedService',
		'feedsDAOService',
		'$ionicLoading',
		'$state',
		'feedDetailService',
		'$ionicScrollDelegate',
		'bookMarkService',
		'socialService',
		'ConnectivityMonitorFactory',
		'settingService',
		'$timeout'
				
	];

	angular
		.module('tatafo')
		.controller('AllFeedsController', AllFeedsController);
})();