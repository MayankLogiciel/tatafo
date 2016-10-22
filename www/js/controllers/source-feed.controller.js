(function() {
	'use strict';

	/**
	* SourceFeedController Function
	*/
	var SourceFeedController = function($log, $injector, $ionicHistory, $scope, $state, $stateParams, feedService , $http , feedListService , $q , $ionicLoading , $ionicScrollDelegate , $ionicPopover , bookMarkService , feedDetailService, socialService, $cordovaNetwork, ConnectivityMonitor) {

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
		* Back Button
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
		* Get reload on clicking closed button
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
			bookMarkService.bookmarkFeedPost(post);
		};

		$scope.sharePost = function(post) {

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.show({ template: 'Please check you network connection!', noBackdrop: true, duration: 1000 });
			}
			if(ConnectivityMonitor.isOnline()){

				socialService.share(post.feed.title, post.feed.summary, post.image, post.feed.permalinkUrl);
			};
		};		

		var loadFeed = function(isLoadMore) {				
			$scope.feedsParams.source_id = $stateParams.sourceId;
			if(ConnectivityMonitor.isOffline()) {
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
			if(ConnectivityMonitor.isOnline()) {	
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

			
		$scope.loadMore = function() {
			$scope.feedsParams.page++;
			loadFeed(true);		
		}


		$scope.loadPostDetails=function(post) {
			feedDetailService.setPostData(post);
			feedDetailService.setCombinedPostDataForNextPrevious($scope.feed);
			$state.go('app.feed-entries-details');
			console.log("page redirect");
		}

		$scope.$on('pullToRefresh',function(){
			$scope.doRefresh();			
		});

		$scope.$on('getFeedsBySearch',function(event,search){
			$scope.feedsParams.name = search;
			if(ConnectivityMonitor.isOffline()) {
				feedService.searchFromPouchDB($scope.feedsParams).then(function(response) {
					console.log(response);
					$scope.feed = [];
					$scope.feed = response.data;
					$scope.isMoreFeeds = (response.isMorePostsPresent == false) ? true : false;
				});
			}
			if(ConnectivityMonitor.isOnline()) {
				$scope.doRefresh();
			}
		});

		$scope.doRefresh = function() {			

			$scope.feedsParams.page = 1;
			$scope.isMoreFeeds = false;
			loadFeed();
		};

	   	$scope.scrollTop = function() { //ng-click for back to top button
	   		$ionicScrollDelegate.scrollTop([true]);
	  		$scope.sttButton=false; //hide the button when reached top
		};
	 
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
* @dependencies injector $scope , $state , $stateParams , $http , feedListService , $q , $ionicLoading , $ionicScrollDelegate , $ionicPopover , bookMarkService ,feedDetailService 
*/
SourceFeedController.$inject=['$log', '$injector', '$ionicHistory', '$scope','$state','$stateParams', 'feedService','$http', 'feedListService', '$q', '$ionicLoading', '$ionicScrollDelegate', '$ionicPopover','bookMarkService','feedDetailService', 'socialService', '$cordovaNetwork', 'ConnectivityMonitor' ];
angular
	.module('tatafo')
	.controller('SourceFeedController',SourceFeedController)

})();