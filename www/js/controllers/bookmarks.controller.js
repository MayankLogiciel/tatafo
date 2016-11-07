(function() {
	'use strict';

	/**
	* BookMarks Controller function
	*/

	var BookMarksController = function($scope, bookMarkService, $state, $ionicPopup, feedDetailService) {

		
		/**
		* getBookmarks
		* bookMarkService.getBookmarkList fetching the data from PouchDB
		* showing the List
		*/
		var getBookmarks=function(){
			bookMarkService.getBookmarkList().then(function(response){
				$scope.bookmarks = response;
			});
		}

		/**
		* bookMarkService.deleteBookMark delete the book mark (perticular Id)
		*/
		$scope.deleteBookMark = function(postId) {			
			var confirmPopup = $ionicPopup.confirm({
     				title: 'Delete BookMark',
     				template: 'Are you sure you want to delete this bookmark?'
			});
			confirmPopup.then(function(res) {				
			    if(res) {
			       	bookMarkService.deleteBookMark(postId);
					angular.forEach($scope.bookmarks,function(val,index){
						if(postId._id==val.id){
			       			$scope.bookmarks.splice(index, true);
						}
					})
			    }
			 });
		};

		/**
		* open the book mark feed back to article page
		*/
		$scope.goToFeedPostArticle = function(post){
			feedDetailService.setCombinedPostDataForNextPrevious($scope.bookmarks);
			feedDetailService.setPostData(post);
			$state.go('app.feed-entries-details');
		};		  
		getBookmarks();

	};

	/**
	* @dependencies injector $scope, bookMarkService, $state, $ionicPopup, feedDetailService, 
	*/
	BookMarksController.$inject=['$scope' , 'bookMarkService' , '$state', '$ionicPopup', 'feedDetailService'];

	angular
		.module('tatafo')
		.controller('BookMarksController',BookMarksController);

})();