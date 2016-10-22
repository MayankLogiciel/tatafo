(function() {
	'use strict';

	/**
	* AllFeedsController Function
	*/
	var AllFeedsController = function($log, $ionicPopover, $rootScope, $scope, $http, sourcesService, feedService, feedListService,$ionicLoading,$filter,$state,feedDetailService, $ionicScrollDelegate, bookMarkService, $ionicHistory,socialService,$cordovaNetwork,$timeout, ConnectivityMonitor, settingService) {

		var setup = function(){
			$log.debug('AllFeedsController setup');
			$scope.allFeed = [];
			$scope.feedSources = [];
			$scope.param=[];
			$scope.feedsParams = {
				page:1,
				limit:10
			};
			$scope.feedStatus = {};
			$scope.feedStatus.read=true;
			$scope.feedStatus.unread=true;
			$scope.isMoreFeeds=false;
			$scope.sttButton=false;
			$scope.defaultImage = 'img/feeds/logos/bbc.jpg';

			if(sourcesService.isFeedSourcesAvailable() && !isSourceSyncRequired()){
				//load all feeds
				$log.debug(' Sources already Available');
				$scope.feedSources=sourcesService.getFeedSourcesFromLocalStorage();
				loadFeeds();
			}else{	
				//load feed source data first
				$log.debug(' Sources  Unavailable');
				$ionicLoading.show({
          				template: '<ion-spinner icon="android"></ion-spinner>'
        		});
				loadFeedSources();
			}
			
			loadPopOver();
		};

		var isSourceSyncRequired=function(){
			var syncInterval = settingService.getInterval().setSyncIntervalTime;
			var syncIntervalInMillisecond = syncInterval.value*3600000;
			var lastTimeSynced = settingService.getSyncTime().lastTimeSourceSynced;	
			var lastSynced = Date.parse(lastTimeSynced);
			var currentDate = new Date();
			var currenTime = Date.parse(currentDate);
			var timeInMillisecondsSinceLastSync = currenTime - lastSynced;
			if(timeInMillisecondsSinceLastSync > syncIntervalInMillisecond) {
				return true;
			}else {
			 	return false;
			}
		}
		
		var loadPopOver=function(){
			$ionicPopover.fromTemplateUrl('views/app/feeds/sort-popover.html', {
    			scope: $scope,
 			}).then(function(popover) {
    			$scope.popover = popover;
  			});
		};

		var loadFeedSources = function() {
				sourcesService.getSources().then(function(sources) {
				$scope.feedSources = sources;
				loadFeeds();
			});
		};

		var loadFeeds = function(isLoadMore) {
			if(ConnectivityMonitor.isOffline()) {	
				feedService.getfeedFromPouchDB($scope.feedsParams).then(function(response){
						if(response.data.length>0){

							if(!isLoadMore) {
								$scope.allFeed = [];
							}
						angular.forEach(response.data, function(feed, key) {	
							$scope.allFeed = $scope.allFeed.concat(feed);

						});
						$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;

					}	
					else{
						$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');

				});	
			}
			if(ConnectivityMonitor.isOnline()) {
				$ionicLoading.show({
          			template: '<ion-spinner icon="android"></ion-spinner>'
        		});
				if($scope.loadMoreActive){
					return;
				};
				$scope.loadMoreActive=true;				
				feedService.getFeeds($scope.feedsParams).then(function(feed) {					
	   				if(feed.data.data.meta.pagination.current_page == feed.data.data.meta.pagination.total_pages || feed.data.data.meta.pagination.total_pages == 0){
						$scope.isMoreFeeds = true;
					}
					else{
						$scope.isMoreFeeds = false;
					}
					if(!isLoadMore) {
						$scope.allFeed = [];
					}
					$scope.allFeed = $scope.allFeed.concat(feed.data.data.feed);
					console.log($scope.allFeed);
					$scope.$broadcast('scroll.infiniteScrollComplete');
					feedService.addNewFeeds($scope.allFeed);
				}).finally(function(){
					$scope.$broadcast('scroll.refreshComplete');
					$scope.loadMoreActive = false;
					$ionicLoading.hide();
				});
			}			
		};

		$scope.selectOption = function() {
			$scope.feedsParams.page = 1;
			if(ConnectivityMonitor.isOffline()) {	
				if( ($scope.feedStatus.read && $scope.feedStatus.unread) || (!$scope.feedStatus.read && !$scope.feedStatus.unread) ){
					loadFeeds();
				}else 
					if( $scope.feedStatus.read || $scope.feedStatus.unread ) {

						$scope.feedsParams.is_read = ($scope.feedStatus.read) ? true : false;
						feedService.sortReadUnread($scope.feedsParams).then(function(response){
							$scope.allFeed = [];
							$scope.allFeed = response;
							$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;
						});			
					}
					
			}
			if(ConnectivityMonitor.isOnline()) {
				$ionicLoading.show({
	          				template: '<ion-spinner icon="android"></ion-spinner>'
	        	});
				
				if( $scope.feedStatus.read && $scope.feedStatus.unread ) {
					if (angular.isDefined($scope.feedsParams.status)) {
		    			delete $scope.feedsParams.status;
		    		}
				} else if( $scope.feedStatus.read || $scope.feedStatus.unread ) {
					$scope.feedsParams.status = ($scope.feedStatus.read) ? 1 : 0;
				} else {
					if (angular.isDefined($scope.feedsParams.status)) {
		    			delete $scope.feedsParams.status;
		    		}
				}
				loadFeeds();
			}
		}
		
		$scope.sharePost = function(post) {
			if(ConnectivityMonitor.isOffline()) {
				$ionicLoading.show({ template: 'Please check you network connection!', noBackdrop: true, duration: 1000 });
			}
			if(ConnectivityMonitor.isOnline()) {

				socialService.share(post.feed.title, post.feed.summary, post.image, post.feed.permalinkUrl);
			}
		
		}

		$scope.$on('getallfeeds',function(event) {
			$scope.feedsParams.page = 1;
			delete($scope.feedsParams.name);
			$scope.scrollTop();
			loadFeeds();
		});
				
		
			
		$scope.$on('getFeedsBySearch',function(event,search){
			$scope.feedsParams.name = search;
			if(!$cordovaNetwork.isOnline() || !navigator.onLine) {
				feedService.searchFromPouchDB($scope.feedsParams).then(function(response) {
					$scope.allFeed = [];
					$scope.allFeed = response.data;
					$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;
				});
			} else {
				$scope.doRefresh();
			}
		});

		$scope.$on('reloadFeeds',function(){
			$scope.doRefresh();
			$scope.scrollTop();
		
		});

		$scope.rateApp = function(){
    		if(ionic.Platform.isAndroid()){
	      		AppRate.preferences.storeAppURL.android = 'market://details?id=com.wec.lwkm';
	      		AppRate.preferences.usesUntilPrompt = 2;
				AppRate.promptForRating();
				App.promptAgainForEachNewVersion(true);
	    	}
  		};


		$scope.bookmarkPost = function(post) {
			bookMarkService.bookmarkFeedPost(post);
		};


		var loadReadUnreadFeeds=function(param,id){
			$ionicLoading.show({
          				template: '<ion-spinner icon="android"></ion-spinner>'
        	});
			feedService.getRaedOrUnread(param,id).then(function(feed){
				$scope.allFeed =feed.data.data.feed;
	
			});
		};



		 $scope.loadMore = function() {
		 	$scope.feedsParams.page++;
		 	loadFeeds(true);
		 }

		
		$scope.loadPostDetails=function(post) {	
			feedDetailService.setPostData(post);
			feedDetailService.setCombinedPostDataForNextPrevious($scope.allFeed);
			$state.go('app.feed-entries-details');	
								
		};

		$scope.feedDetail = function (sourceId) {
			$state.go('app.feed-entries', {sourceId: sourceId});
		} 

		
		$scope.doRefresh = function() {	
			$scope.feedsParams.page = 1;
	  		$scope.isMoreFeeds = false;
	  		loadFeeds();
	 	};

		$scope.scrollTop = function() { //ng-click for back to top button
	  		$ionicScrollDelegate.scrollTop([true]);
	 		$scope.sttButton=false; //hide the button when reached top
		};

		$scope.getScrollPosition = function() {
	 		//monitor the scroll
	 		var moveData = $ionicScrollDelegate.$getByHandle('feedshandler').getScrollPosition();
	 		//console.log(moveData);
	    	$scope.$apply(function() {
	    		if(angular.isDefined(moveData) && moveData.top>150) {
	      			$scope.sttButton=true;
	    		}else	{
	       			$scope.sttButton=false;
	     		}
	    	}); //apply
	  	};  //getScrollPosition

	  	setup();
	};

	/**
	* @dependencies injector $scope , $http , $state , feedDetailService , sourcesService , feedListService ,$ionicLoading,$localStorage
	*/
	AllFeedsController.$inject = [
		'$log',
		'$ionicPopover', 
		'$rootScope',
		'$scope', 
		'$http', 
		'sourcesService',
		'feedService',
		'feedListService',
		'$ionicLoading',
		'$filter',
		'$state',
		'feedDetailService',
		'$ionicScrollDelegate',
		'bookMarkService',
		'$ionicHistory',
		'socialService',
		'$cordovaNetwork',
		'$timeout',
		'ConnectivityMonitor',
		'settingService'
	];

	angular
		.module('tatafo')
		.controller('AllFeedsController', AllFeedsController);

})();