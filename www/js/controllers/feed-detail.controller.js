(function() {
	'use strict';

	/**
	* FeedDetailController function
	*/
	var FeedDetailController = function($log, $scope, feedDetailService, bookMarkService, $ionicLoading, $state, $ionicHistory, $location,$stateParams,feedService, socialService, $cordovaNetwork,$timeout, sourcesService, $window, $rootScope) {
		
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

			if (!$scope.entry.is_read) { 
				//if unread then mark as read
				markAsRead();
			}
			
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

			feedService.markPostReadUnread(params).then(function(res) {
				$log.debug(res);
				$rootScope.$broadcast("readArticle", { id: res.data.data.updated_ids[0], status: true });
			})
		};

		// $scope.OpenSocialWindow =function(url){
		// 	window.open('http://' + url, '_system');
		// }
			
		/**
		*  bookmarkPost post the feed deatil for book mark for PouchDB
		*/	
		$scope.bookmarkPost = function() {	
			bookMarkService.addBookmarkToPouchDB($scope.entry);
		};

		/**
		* handling Back Button
		*/
		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		    viewData.enableBack = true;
		});


		$scope.sharePost = function() {
			socialService.share($scope.entry.feed.summary || $scope.entry.feed.content, $scope.entry.feed.title, $scope.entry.image, $scope.entry.feed.permalinkUrl);
		}

		$scope.openLink = function (link) {
			$window.open('http://' + link, '_system');
		};

		setup();
	};

	/**
	* @dependencies injector $log, $scope, feedDetailService, bookMarkService, $ionicLoading, $state, $ionicHistory, $location,$stateParams,feedService, socialService, $cordovaNetwork,$timeout, sourcesService
	*/
	FeedDetailController.$inject = ['$log', '$scope', 'feedDetailService','bookMarkService', '$ionicLoading', '$state','$ionicHistory','$location', '$stateParams','feedService','socialService','$cordovaNetwork','$timeout','sourcesService', '$window', '$rootScope'];

	angular
		.module('tatafo')
		.controller('FeedDetailController',FeedDetailController);
})();