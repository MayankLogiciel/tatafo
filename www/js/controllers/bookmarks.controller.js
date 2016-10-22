(function() {
	'use strict';

	/**
	* BookMarks Controller function
	*/

	var BookMarksController = function($scope , $rootScope , bookMarkService , $state, $ionicPopup, $ionicLoading, feedDetailService,  $window, $cordovaNetwork) {

		var getBookmarks=function(){

			bookMarkService.getBookmarkList().then(function(response){
				$scope.bookmarks = response;
			});
		}

		$scope.deleteBookMark = function(postId) {			
			console.log(postId);
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

		$scope.goToFeedPost = function(post){

			// if($cordovaNetwork.isOnline() || navigator.onLine){ 
			// 	window.open(post.permalinkUrl, '_system');
			// }
			// else {
				feedDetailService.setCombinedPostDataForNextPrevious($scope.bookmarks);
				feedDetailService.setPostData(post);
				$state.go('app.feed-entries-details');
			//}
		};		  
		getBookmarks();

	};

	/**
	* @dependencies injector $scope, $rootScope, bookMarkService, $state
	*/
	BookMarksController.$inject=['$scope' ,'$rootScope' , 'bookMarkService' , '$state', '$ionicPopup', '$ionicLoading', 'feedDetailService', '$window','$cordovaNetwork'];

	angular
		.module('tatafo')
		.controller('BookMarksController',BookMarksController);

})();