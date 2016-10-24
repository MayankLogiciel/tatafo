(function()	{
	'use strict';

	/**
	* bookMarkService  function
	*/
	var bookMarkService = function(_, $rootScope, $q, $ionicLoading) {

		var _db;
		var post;
		/**
		* Creating pouchdb database bookmark
		*/
		_db = new PouchDB('bookmark');

		/**
		* add Bookmark to PouchDB
		* check if already exist then create msg already exist
		*/
     	this.addBookmarkToPouchDB = function(bookmark_post) {
		$q.when(_db.allDocs({ 
			include_docs: true,
			descending: true,
		}))
        .then(function(docs) {
        	//check if this post is already saved
			var existing_post = _.find(docs.rows, function(data) { 
				if(angular.isUndefined(data.doc.id)){
					return null;
				}
				if(data.doc.id==bookmark_post.id){
					
					$ionicLoading.show({ template: 'Bookmark already exist!', noBackdrop: true, duration: 1000 });
				
					return data.doc.id == bookmark_post.id; 
				}				

			});
	
			if(!existing_post) {
				_db.post({
					id:bookmark_post.id,
					source_name:bookmark_post.source_name,
					permalinkUrl: bookmark_post.feed.permalinkUrl,
					title : bookmark_post.feed.title,
					date: bookmark_post.updated_at,
					summary:bookmark_post.feed.summary,
					image:bookmark_post.feed.image
				});
				$ionicLoading.show({ template: 'Bookmark Saved!', noBackdrop: true, duration: 1000 });

			}
        });
         	$rootScope.$broadcast("new-bookmark");
		};

		/**
		* delete Bookmark from PouchDB
		*/
		this.deleteBookMark = function(bookmarkId) {
			var _defer  = $q.defer();
	    	$q.when(_db.allDocs()
	    		.then(function (result) {
	    			for(var i = 0; i < result.rows.length; i++){
	    				if(result.rows[i].id==bookmarkId._id) {
							$ionicLoading.show({ template: 'Bookmark Deleted!', noBackdrop: true, duration: 1500 });
	    					return _db.remove(result.rows[i].id,result.rows[i].value.rev);            				        					
					 	}
					} 		            	
	    		}),function(error){
	        	_defer.reject(error);
	        });
	     	return _defer.promise;
		};

		/**
		* Fetch Bookmark from PouchDB
		*/
		this.getBookmarkList=function(){

	    	var _defer  = $q.defer();
	        $q.when(_db.allDocs({ include_docs: true,  descending: true}))
	        .then(function(docs) {
	        	 _defer.resolve(docs.rows);
	        },function(error){
	        	_defer.reject(error);
	        });

	         return _defer.promise;
	    };

	}

	/**
	* @dependencies injector _, $rootScope, $q, $ionicLoading
	*/
	bookMarkService.$inject=['_', '$rootScope', '$q', '$ionicLoading'];

	angular
		.module('tatafo')
		.service('bookMarkService',bookMarkService);

})();