(function() {

	'use strict';

	/**
	* SourceFeedController Function
	*/
	var SourceFeedController = function($log, $rootScope, $scope, $state, $stateParams, feedService, feedsDAOService, $ionicLoading, $ionicScrollDelegate, bookMarkService, feedDetailService, socialService, ConnectivityMonitorFactory, settingService, $ionicHistory, $window) {

		var setup = function() {		
			$log.debug('SourceFeedController setup');
			$scope.feed = [];
			$scope.feedsParams = {
				page:1,
				limit:10
			};
			$scope.isMoreFeeds=false;
			$scope.sttButton=false;
			$scope.isSearchOpen = false;
			$scope.searchQuery = '';
			loadFeeds();
			$rootScope.$on("readArticle", function (event,args) {
				$log.debug("Read Article event received in Source Feed Controller");
	      		angular.forEach($scope.feed,function(val, key){
	      			if(val.id == args.id){
	      				$scope.feed[key].is_read=true;
	      			}
	      		});
	    	});			
		};

		/**
		* Back Button Handling
		* Solution for Back button because it does not behave properly after few moves
		* Due to BackView():null problem($window.history.go(-1) resolve this problem)  
		*/
		$scope.myGoBack = function() {
    		$window.history.go(-1);
  		};

		/**
		* Back Button Handling
		*/
		// $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		//     viewData.enableBack = true;
		// });

		/**
		* Back Button Handling before leave
		* checking the current url(is it Loacl/Foriegn ?)
		* confirming that need to show popup or not for App rate using settingService.doWeNeedToShowAppRatePopup function
		*/
		$rootScope.$on('$ionicView.beforeLeave', function (event, viewData) {
		    if(($state.current.name.indexOf('app.feeds.local') != -1 ) || (($state.current.name.indexOf('app.feeds.foreign') != -1 ))) {
			  	if(settingService.doWeNeedToShowAppRatePopup()) {
			  		var clickEvent = new MouseEvent("tap", {});
				    var element = document.getElementById('app-rate-model-source-feed');
					element.dispatchEvent(clickEvent);
			  	}
			}
		});

		/**
		* Post bookmark
		*/	
		$scope.bookmarkPost = function(post) {
			post.bookmarkSaved = true;
			bookMarkService.addBookmarkToPouchDB(post);
			
		};

		$scope.sharePost = function(post) {
			socialService.share(post.feed.summary || post.feed.content, post.feed.title, post.image, post.feed.permalinkUrl);
		};

		/**
		* loadFeeds loads the all feeds of perticular source
		* if ConnectivityMonitorFactory.isOffline then loads the feeds from pouch db using feedsDAOService.getfeedFromPouchDB
		* if ConnectivityMonitorFactory.isOnline then loads the feeds from  API using feedService.getFeeds
		*/
		var loadFeeds = function(isLoadMore) {	
		console.log(isLoadMore);
			$scope.loaded = false;			
			$scope.feedsParams.source_id = $stateParams.sourceId;
			$scope.feedsParams.source_name = $stateParams.sourceName;

			if(ConnectivityMonitorFactory.isOffline()) {
				feedsDAOService.getPostsHavingSource($scope.feedsParams).then(function(response){
					if(response.posts.length>0){
						if(!isLoadMore) {
							$scope.feed = [];
						}
						angular.forEach(response.posts, function(feed, key) {							
							$scope.feed = $scope.feed.concat(feed);
						});
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}	
					else{
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}
					getBookMarksfromPouchDBToChangeSaveButtonColor();					
					$scope.loaded = true;
				}).finally(function(){	
					if(!isLoadMore){
						$scope.$broadcast('scroll.refreshComplete');
					}else{
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}				
				});;
			}
			
			if(ConnectivityMonitorFactory.isOnline()) {
					
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
						$scope.feed = [];
					}
					$scope.feed = $scope.feed.concat(feed.data.data.feed);						
					getBookMarksfromPouchDBToChangeSaveButtonColor();
					$scope.loaded = true;
					}).finally(function(){	
						if(isLoadMore){					
							$scope.$broadcast('scroll.infiniteScrollComplete');
						}else{
							console.log("testtststtstst");
							$scope.$broadcast('scroll.refreshComplete');
						}				
						$ionicLoading.hide();
					});
					
				}
			}


		/*
		* deleteBookMarks used to make the bookmark unselected form
		*/
		$rootScope.$on("deleteBookMarks", function (event,arg) {
			$scope.feed.map(function(v) {
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
				$scope.feed.map(function(value) {
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
		*loadMore incrementing page by one and calling the loadFeeds
		*/	
		$scope.loadMore = function() {
			if($scope.feed.length > 0){
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
			feedDetailService.setCombinedPostDataForNextPrevious($scope.feed);
			$state.go('app.feed-entries-details');
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

		$scope.doRefresh = function() {	
			$scope.isMoreFeeds = false;
			$scope.feedsParams.page = 1;				
			loadFeeds(false);
       		$scope.scrollTop();
		};

	   	$scope.scrollTop = function() {
	   		$ionicScrollDelegate.scrollTop([true]);
	  		$scope.sttButton=false;
		};

	 	/**
		* getting the scroll postion
		*/
		$scope.getScrollPosition = function() {			
	  		//monitor the scroll
	  		var moveData = $ionicScrollDelegate.$getByHandle('sourceFeedHandler').getScrollPosition();
	  		$scope.$apply(function() {
	     		if(angular.isDefined(moveData) && moveData.top > 150) {
	       			$scope.sttButton=true;
	     		}else {
	        			$scope.sttButton=false;
	      			}
	     	});
	   	};
	
		setup();
	};
	SourceFeedController.$inject=['$log', '$rootScope', '$scope', '$state', '$stateParams', 'feedService', 'feedsDAOService', '$ionicLoading', '$ionicScrollDelegate', 'bookMarkService', 'feedDetailService', 'socialService', 'ConnectivityMonitorFactory', 'settingService', '$ionicHistory', '$window'];
	angular
		.module('tatafo')
		.controller('SourceFeedController',SourceFeedController)
})();