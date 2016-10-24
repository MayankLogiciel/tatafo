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

		/**
		* Get the postData object
		* @return {object} 
		*/
		this.getCombinedPostDataForNextPrevious=function(){
			return postData;
		}

		/**
		* set the post object
		* @param {object} data
		* set postData = data
		*/
		this.setCombinedPostDataForNextPrevious=function(data){
			postData=data;
		}
	};
	
	feedDetailService.$inject=[];

	angular
		.module('tatafo')
		.service('feedDetailService', feedDetailService);
})();