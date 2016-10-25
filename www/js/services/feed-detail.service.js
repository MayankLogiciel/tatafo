(function()	{
	'use strict';

	/**
	* feedDetailService function
	*/
	var feedDetailService = function() {
		var post;
		var allVisiblePosts;

		/**
		* Get the post object
		* @return {object} 
		*/
		this.getPostData = function() {
			return post;
		};


		/**
		* set the post object
		* @param {object} postDetail 
		* set post = postDetail
		*/
		this.setPostData = function(postDetail) {
			post = postDetail;			
		};

		/**
		* Get the allVisiblePosts object
		* @return {object} 
		*/
		this.getCombinedPostDataForNextPrevious = function(){
			return allVisiblePosts;
		}

		/**
		* set the post object
		* @param {object} data
		* set allVisiblePosts = data
		*/
		this.setCombinedPostDataForNextPrevious=function(data){
			allVisiblePosts = data;
		}
	};
	
	feedDetailService.$inject=[];

	angular
		.module('tatafo')
		.service('feedDetailService', feedDetailService);
})();