(function(){

	'use strict';

	/**
	* ionicYoutubeVideo Directive function
	*/
	var ionicYoutubeVideo=function($timeout, $ionicPlatform, youtubeEmbedUtils){
		
		return {
			restrict: 'E',
			scope: {
				videoId: '@'
			},
			controller: function($scope, $element, $attrs) {
				$scope.playerVars = {
					rel: 0,
					showinfo: 0
				};
				$ionicPlatform.on("pause", function(){
					var yt_ready = youtubeEmbedUtils.ready;
					if(yt_ready)
					{
						$scope.yt_video.stopVideo();
					}
			  });
			},
			templateUrl: 'views/common/ionic-youtube-video.html',
			replace: false
		};
	}

	/**
	* @dependencies injector $timeout, $ionicPlatform, youtubeEmbedUtils
	*/

	ionicYoutubeVideo.$inject=['$timeout', '$ionicPlatform',' youtubeEmbedUtils'];

	angular
		.module('tatafo')
		.directive('ionicYoutubeVideo',ionicYoutubeVideo)

})();

