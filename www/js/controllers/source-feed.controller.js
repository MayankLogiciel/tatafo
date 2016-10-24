(function() {
	'use strict';

	/**
	* SourceFeedController Function
	*/
	var SourceFeedController = function($log, $injector, $ionicHistory, $scope, $state, $stateParams, feedService , $http , $q , $ionicLoading , $ionicScrollDelegate , $ionicPopover , bookMarkService , feedDetailService, socialService, $cordovaNetwork, ConnectivityMonitorFactoryFactory) {

		/**
		* Intialization
		*/
		var setup = function() {		
			$log.debug('SourceFeedController setup');
			$scope.feed = [];
			$scope.feedsParams = {
				page:1,
				limit:10
			};
			$scope.isMoreFeeds=false;
			$scope.sttButton=false;
			$log.debug($scope.feedsParams.page);
			loadFeed();
		};

		/**
		* Back Button Handling
		*/
		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		    viewData.enableBack = true;
		});

		/**
		* Reload Feeds
		*/
		$scope.$on('reloadFeeds',function(){
			$scope.doRefresh();
			$scope.scrollTop();		
		});

		/**
		* reload on clicking closed button after search(braodcast metthod)
		*/
		$scope.$on('getallfeeds',function(event) {
			$scope.feedsParams.page = 1;
			delete($scope.feedsParams.name);
			$scope.scrollTop();
			loadFeed();
		});


		/**
		* Load read/ Unread feeds
		*/	
		var loadReadUnreadFeeds=function(param,id){
			$ionicLoading.show({
          				template: '<ion-spinner icon="android"></ion-spinner>'
        	});
			feedService.getRaedOrUnread(param).then(function(feed){
				$scope.feed =feed.data.data.feed;	
			});
		};


		/**
		* Post bookmark
		*/	
		$scope.bookmarkPost = function(post) {
			bookMarkService.addBookmarkToPouchDB(post);
		};

		/**
		* sharePost checking the connection first
		* if connection is online then socialService.share sending the parameter need to share from feeds
		*/
		$scope.sharePost = function(post) {
			if(ConnectivityMonitorFactoryFactory.isOffline()){
				$ionicLoading.show({ template: 'Please check you network connection!', noBackdrop: true, duration: 1000 });
			}
			if(ConnectivityMonitorFactoryFactory.isOnline()){

				socialService.share(post.feed.title, post.feed.summary, post.image, post.feed.permalinkUrl);
			};
		};

		/**
		* loadFeed loads the all feeds of perticular source
		* if ConnectivityMonitorFactoryFactory.isOffline then loads the feeds from pouch db using feedService.getfeedFromPouchDB
		* if ConnectivityMonitorFactoryFactory.isOnline then loads the feeds from  API using feedService.getFeeds
		*/
		var loadFeed = function(isLoadMore) {				
			$scope.feedsParams.source_id = $stateParams.sourceId;
			if(ConnectivityMonitorFactoryFactory.isOffline()) {
				feedService.getPostsHavingSource($scope.feedsParams).then(function(response){
					if(response.posts.length>0){
						if(!isLoadMore) {
							$scope.feed = [];
						}
						angular.forEach(response.posts, function(feed, key) {							
							$scope.feed = $scope.feed.concat(feed);
						});
						$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;
					}	
					else{
						$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;
					}
					$scope.$broadcast('scroll.infiniteScrollComplete');

				});	
			}
			if(ConnectivityMonitorFactoryFactory.isOnline()) {	
				$ionicLoading.show({
					template: '<ion-spinner icon="android"></ion-spinner>'
				});
				if($scope.loadMoreActive==true){
					return;
				}			
				$scope.loadMoreActive = true;
				feedService.getFeeds($scope.feedsParams).then(function(feed) {
					if(feed.data.data.meta.pagination.current_page == feed.data.data.meta.pagination.total_pages || feed.data.data.meta.pagination.total_pages == 0){

						$scope.isMoreFeeds = true;
					}
					else{
						$scope.isMoreFeeds = false;
					}
					if(!isLoadMore) {
						$scope.feed = [];
					}
					$scope.feed = $scope.feed.concat(feed.data.data.feed);
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
				.finally(function(){
					$scope.$broadcast('scroll.refreshComplete');
					$scope.loadMoreActive = false;
					$ionicLoading.hide();
				});
			};
		}

		/**
		*loadMore incrementing page by one and calling the loadFeeds
		*/	
		$scope.loadMore = function() {
			$scope.feedsParams.page++;
			loadFeed(true);		
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

		$scope.$on('pullToRefresh',function(){
			$scope.doRefresh();			
		});

		/**
		* search the feeds enter in search box on from pouchDB if offline otherwise from API
		*/
		$scope.$on('getFeedsBySearch',function(event,search){
			$scope.feedsParams.name = search;
			if(ConnectivityMonitorFactoryFactory.isOffline()) {
				feedService.searchFromPouchDB($scope.feedsParams).then(function(response) {
					console.log(response);
					$scope.feed = [];
					$scope.feed = response.data;
					$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;
				});
			}
			if(ConnectivityMonitorFactoryFactory.isOnline()) {
				$scope.doRefresh();
			}
		});


		/**
		* show and hide button not needed while clicking search button
		*/
		$scope.onSearchIconClick = function() {
			$scope.mySearch = !$scope.mySearch;
        	$scope.closed = !$scope.closed;
        	$scope.searchbtn=!$scope.searchbtn
        	$scope.sortPop=!$scope.sortPop;
        	$scope.reload1=!$scope.reload1;

      	};

      	/**
		* show and hide button not needed while clicking search closed button
		*/
    	$scope.onClosedIconClick = function() {
        	$scope.reload();
        	$scope.mySearch = !$scope.mySearch;
        	$scope.closed = !$scope.closed;
        	$scope.searchbtn = !$scope.searchbtn
        	$scope.sortPop = !$scope.sortPop;
        	$scope.reload1 = !$scope.reload1;
        	$scope.$broadcast('getallfeeds');
        	
    	};

    	/**
		* doRefresh setting up the page 1 
		* calling the loadFeeds
		*/
		$scope.doRefresh = function() {			

			$scope.feedsParams.page = 1;
			$scope.isMoreFeeds = false;
			loadFeed();
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
	  		var moveData = $ionicScrollDelegate.$getByHandle('sourceFeedhandler').getScrollPosition();
	  		$scope.$apply(function() {
	     		if(angular.isDefined(moveData) && moveData.top > 150) {
	       			$scope.sttButton=true;
	     		}else	{
	        			$scope.sttButton=false;
	      			}
	     	}); //apply
	   	};  //getScrollPosition
	
	setup();
};
/**
* @dependencies injector $log, $injector, $ionicHistory, $scope, $state, $stateParams, feedService , $http , feedListService , $q , $ionicLoading , $ionicScrollDelegate , $ionicPopover , bookMarkService , feedDetailService, socialService, $cordovaNetwork, ConnectivityMonitorFactoryFactory
*/
SourceFeedController.$inject=['$log', '$injector', '$ionicHistory', '$scope','$state','$stateParams', 'feedService','$http', '$q', '$ionicLoading', '$ionicScrollDelegate', '$ionicPopover','bookMarkService','feedDetailService', 'socialService', '$cordovaNetwork', 'ConnectivityMonitorFactoryFactory' ];
angular
	.module('tatafo')
	.controller('SourceFeedController',SourceFeedController)

})();