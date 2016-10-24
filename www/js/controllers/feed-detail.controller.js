(function() {
	'use strict';

	/**
	* FeedDetailController function
	*/
	var FeedDetailController = function($log, $scope, feedDetailService, bookMarkService, $ionicLoading, $state, $ionicHistory, $location,$stateParams,feedService, socialService, $cordovaNetwork,$timeout, sourcesService) {
		
		/**
		* Initialization
		*/
		var setup = function(){
			console.log("FeedDetailController");
			$scope.feedsParams = {
				page:1,
				limit:$stateParams.postData
			};
			$scope.sttButton=true;
			$scope.allFeed=[];
			// fetching the feeds using feedDetailService.getPostData
			$scope.entry = feedDetailService.getPostData();
			// fetching the feed source frm local storage
			$scope.sourceData = sourcesService.getFeedSourceFromLocalStorage($scope.entry.source_id);
			//console.log($scope.sourceData);
			if($scope.sourceData.topics.data.length > 0) {
				$scope.sourceData.topics.data.map(function(val) {
					if (val.name == $scope.entry.topic_name) {
						$scope.topic = val;
					}
				});
			};
			
			loadFeeds();
			if (!$scope.entry.is_read) {
				markAsRead();
			}
			
		};
		/**
		* show ad Interstitial when click to the previous button
		*/
 
	    $scope.$on('$ionicView.beforeLeave', function(e) {
	        if (window.AdMob) AdMob.showInterstitial();
	    });

	    /**
	    * getting the current index of th feed showing in article page
	    */
		var getFeedIndex=function(){
			angular.forEach($scope.allFeed, function(val, index) {
				//console.log(val);
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
			getFeedIndex();
		}

		/**
	    * handling the Next button to show next article
	    */
		$scope.nextButton=function(){
			$scope.currentIndex = $scope.currentIndex + 1;

			if(angular.isDefined($scope.allFeed[$scope.currentIndex])) {
				$scope.entry = $scope.allFeed[$scope.currentIndex];		
			}
			 else {
				$scope.entry = $scope.allFeed[$scope.currentIndex].doc.data;		
			}

		}

		/**
	    * handling the previous button to show next article
	    */
	    $scope.previousButton=function(){
			$scope.currentIndex = $scope.currentIndex - 1;
			if(angular.isDefined($scope.allFeed[$scope.currentIndex])) {
				$scope.entry = $scope.allFeed[$scope.currentIndex];		
			} else {
				$scope.entry = $scope.allFeed[$scope.currentIndex].doc.data;		
			}

		}

		/**
		* sending the request to the API to markAsRead is status is 1
		*/

		var markAsRead=function(){
			var query={
				status:1,
				ids:[$scope.entry.id]
			};
			feedService.getRaedOrUnread(query).then(function(res){
			})
		}

		// $scope.OpenSocialWindow =function(url){
		// 	window.open(url, '_system');
		// }
			
		/**
		*  bookmarkPost post the feed deatil for book mark for PouchDB
		*/	
		$scope.bookmarkPost = function(post) {	
			bookMarkService.addBookmarkToPouchDB($scope.entry);
		};

		/**
		* handling Back Button
		*/
		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		    viewData.enableBack = true;
		});

		/**
		* sharePost checking the connection first
		* if connection is online then socialService.share sending the parameter need to share from feeds
		*/
		$scope.sharePost = function(post) {
			if(ConnectivityMonitorFactory.isOffline()) {
				$ionicLoading.show({ template: 'Please check you network connection!', noBackdrop: true, duration: 1000 });
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				socialService.share($scope.entry.feed.title, $scope.entry.feed.summary,  $scope.entry.image, 
		$scope.entry.feed.permalinkUrl);
			}
			
		}
		setup();
	};

	/**
	* @dependencies injector $log, $scope, feedDetailService, bookMarkService, $ionicLoading, $state, $ionicHistory, $location,$stateParams,feedService, socialService, $cordovaNetwork,$timeout, sourcesService
	*/
	FeedDetailController.$inject = ['$log', '$scope', 'feedDetailService','bookMarkService', '$ionicLoading', '$state','$ionicHistory','$location', '$stateParams','feedService','socialService','$cordovaNetwork','$timeout','sourcesService'];

	angular
		.module('tatafo')
		.controller('FeedDetailController',FeedDetailController);
})();