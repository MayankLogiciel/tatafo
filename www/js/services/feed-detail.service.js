(function()	{
	'use strict';

	/**
	* feedDetailService function
	*/
	var feedDetailService = function() {
		var post;
		var postData;

		/**
		* Get the post object
		* @return {object} 
		*/
		this.getPostData = function() {
			return post;
		};

		/**
		* set the post object
		* @param {object} articleInfo 
		* set post = articleInfo
		*/
		this.setPostData=function(articleInfo) {
			post=articleInfo;			
		};

		this.getCombinedPostDataForNextPrevious=function(){
			return postData;
		}

		this.setCombinedPostDataForNextPrevious=function(data){
			postData=data;
		}
	};
	
	feedDetailService.$inject=[];

	angular
		.module('tatafo')
		.service('feedDetailService', feedDetailService);
})();