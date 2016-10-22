(function() {
	'use strict';

	/**
	* FeedDetailController function
	*/
	var FeedDetailController = function($log, $scope, feedDetailService, bookMarkService, $ionicLoading, $state, $ionicHistory, $location,$stateParams,feedService, socialService, $cordovaNetwork,$timeout) {
		

		var setup = function(){

			$scope.feedsParams = {
				page:1,
				limit:$stateParams.postData
			};
			$scope.sttButton=true;
			$scope.allFeed=[];
			console.log("FeedDetailController");

			$scope.entry = feedDetailService.getPostData();
			loadFeeds();
			//console.log($stateParams.postData);

			
				if (!$scope.entry.is_read) {
					markAsRead();
				}
			

		};
		

		
 
	    $scope.$on('$ionicView.beforeLeave', function(e) {
	        // console.log("leaving");
	        if (window.AdMob) AdMob.showInterstitial();
	    });

		var getFeedIndex=function(){
			console.log($scope.allFeed);
			angular.forEach($scope.allFeed, function(val, index) {
				//console.log($scope.entry.id, val.doc.id);
				if(angular.isDefined(val.doc) && $scope.entry.id == val.doc.id) {
					$scope.currentIndex = index;
				}
				if(!angular.isDefined(val.doc) && $scope.entry.id == val.id) {
					$scope.currentIndex = index;
				}
			});
		}
		var loadFeeds = function() {	

			$scope.allFeed=feedDetailService.getCombinedPostDataForNextPrevious();
			console.log($scope.allFeed);
			getFeedIndex();

		}

		$scope.nextButton=function(){
			$scope.currentIndex = $scope.currentIndex + 1;

			if(angular.isDefined($scope.allFeed[$scope.currentIndex].doc)) {
				$scope.entry = $scope.allFeed[$scope.currentIndex].doc;		
			} else {
				$scope.entry = $scope.allFeed[$scope.currentIndex];		
			}

		}

		$scope.previousButton=function(){
			$scope.currentIndex = $scope.currentIndex - 1;

			if(angular.isDefined($scope.allFeed[$scope.currentIndex].doc)) {
				$scope.entry = $scope.allFeed[$scope.currentIndex].doc;		
			} else {
				$scope.entry = $scope.allFeed[$scope.currentIndex];		
			}

		}



		var markAsRead=function(){
			var query={
				status:1,
				ids:[$scope.entry.id]
			};
			feedService.getRaedOrUnread(query).then(function(res){
			})
		}



		$scope.bookmarkPost = function(post) {
	
			bookMarkService.bookmarkFeedPost($scope.entry);
			
		};

		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		    viewData.enableBack = true;
		});


		$scope.sharePost = function(post) {

			if(ConnectivityMonitor.isOffline()){
				$ionicLoading.show({ template: 'Please check you network connection!', noBackdrop: true, duration: 1000 });
			}
			if(ConnectivityMonitor.isOnline()){

				socialService.share($scope.entry.feed.title, $scope.entry.feed.summary,  $scope.entry.image, 
		$scope.entry.feed.permalinkUrl);
			}
			
		}
		setup();


	};



	/**
	* @dependencies injector $scope , feedDetailService
	*/
	FeedDetailController.$inject = ['$log', '$scope', 'feedDetailService','bookMarkService', '$ionicLoading', '$state','$ionicHistory','$location', '$stateParams','feedService','socialService','$cordovaNetwork','$timeout'];

	angular
		.module('tatafo')
		.controller('FeedDetailController',FeedDetailController);
})();