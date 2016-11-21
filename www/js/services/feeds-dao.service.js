(function()	{
	'use strict';

	var feedsDAOService = function($log, $rootScope, $q) {


        /**
        * 1. Add/Update posts to Posts Local DB
        * 2. Delete older posts exceeding Local DB limit
        * @param {Array} posts posts to add into the Local DB
        */
        this.addNewFeeds = function(posts){
            var docPosts = posts.map(function(post){
                var docPost = {
                    "_id" : new Date(post.feed.updated * 1000).toJSON(),
                    "post" : post
                }
                return docPost;
            });

            //Don't bother for document conflict, as these records are already present
            postsDB.bulkDocs(docPosts)
            .then(function(result){
                return postsDB.allDocs({descending: true, skip: postsDBSettings.MAX_RECENT_POST_STORE});
            }).then(function (extraDocs) {
                angular.forEach(extraDocs.rows, function(row){
                    postsDB.get(row.id).then(function(doc){
                       postsDB.remove(doc._id, doc._rev);
                    });
                });
            });
        };

	    /**
	     * get recent posts from Posts Local DB
	     * @param {Object} params query-parameters to load posts from Local DB
	     * @return {Promise}
	     */
	    this.getRecentPostsFromPouchDB = function(params) {

	        var deferred = $q.defer();

	        var options = {
	          include_docs: true,
	          descending: true,
	          skip: (params.page - 1) * postsDBSettings.PER_PAGE_POSTS,
	          limit: postsDBSettings.PER_PAGE_POSTS
	        };

	        postsDB.allDocs(options).then(function(docs){
	          $log.debug('getRecentPostsFromPouchDB');
	          $log.debug(docs);
	          var data = {
	            posts : [],
	            total_rows : docs.total_rows,
	            offset: docs.offset,
	            isMorePostsPresent: true
	          };

	          angular.forEach(docs.rows, function(row){
	            data.posts.push(row.doc.post);
	          });

	          data.isMorePostsPresent = (docs.total_rows - docs.offset - docs.rows.length) > 0 ? true : false;
                deferred.resolve(data);
	        });

	        return deferred.promise;
	    };


          
        /**
        * get filtered source posts from Posts Local DB according to sourceId
        * @param  {String/Integer} sourceId  posts to be fetched for
        * @return {Promise}
        */
        this.getPostsHavingSource = function(params) {
            var deferred = $q.defer();
            var options = {
                include_docs: true,
                descending: true,
                //skip: (params.page - 1) * postsDBSettings.PER_PAGE_POSTS,
                //limit: postsDBSettings.PER_PAGE_POSTS
            };
            postsDB.allDocs(options).then(function(docs){
    	        $log.debug('getPostsHavingSource');
	          	$log.debug(docs);            	
                var data = {
                    posts : [],
                    total_rows : docs.total_rows,
                    offset: docs.offset,
                    isMorePostsPresent: false  
                };
                data.posts = filterPostsHavingSourceId(docs.rows, params.source_id);
                //data.isMorePostsPresent = (docs.total_rows - docs.offset - docs.rows.length) > 0 ? true : false;
                deferred.resolve(data); 
            });
            return deferred.promise;      
        };


        /**
        * searching feeds from pouchDB
        */
        this.searchFromPouchDB=function(params) { 
            var _defer  = $q.defer();
            postsDB.search({
                query: params.name,
                fields: ['post.feed.title'],
                include_docs: true,
                skip: (params.page - 1) * postsDBSettings.PER_PAGE_POSTS,
                limit: postsDBSettings.PER_PAGE_POSTS
            }).then(function(docs){
    	        $log.debug('searchFromPouchDB');
    	        $log.debug(params);
	          	$log.debug(docs);        	
                var data = {
                    posts : [],
                    total_rows : docs.total_rows,
                    offset: docs.offset,
                    isMorePostsPresent: true  
                };
                angular.forEach(docs.rows,function(value,key){
                    data.posts.push(value.doc.post);
                });
                data.isMorePostsPresent = (docs.total_rows - docs.offset - docs.rows.length) > 0 ? true : false;
                _defer.resolve(data);
            },function(error){
                _defer.reject(error);
             });
            return _defer.promise;
        };

        /**
        * Filtering feeds acording to Read/Unread Sort
        */
        
		this.getReadUnreadPosts = function(params){
            var deferred = $q.defer();
            var options = {
                include_docs: true,
                descending: true,
                skip: (params.page - 1) * postsDBSettings.PER_PAGE_POSTS
            };
            postsDB.allDocs(options).then(function(docs){
    	        $log.debug('getReadUnreadPosts');
	          	$log.debug(docs);            	
                var data = {
                    posts : [],
                    total_rows : docs.total_rows,
                    offset: docs.offset,
                    isMorePostsPresent: false  //we have loaded all posts
                };
                data.posts = filterPostsReadUnread(docs.rows, params.is_read);
                deferred.resolve(data); 
            });
            return deferred.promise;
		}; 

		var filterPostsReadUnread = function(rows, isRead){
            var relatedPosts = [];
            rows.map(function(row){
                if( row.doc.post.is_read == isRead ) {
                    relatedPosts.push(row.doc.post);
                }
            });

            $log.debug('Filtered Post for read unread');
            $log.debug(relatedPosts);

            return relatedPosts;
		};

        this.markPostReadUnread = function(params) { 
            params.is_read = true;
            var deferred = $q.defer();
            var val = {
                _id : new Date(params.feed.updated * 1000).toJSON()               
            };
            postsDB.get(val._id).then(function(doc) {  
                $log.debug(doc);              
                postsDB.put({
                    _id: val._id,
                    _rev: doc._rev,
                    post: params

                }).then(function(response) {
                    $log.debug(response);                
                }).catch(function (err) {
                    $log.debug(err);
                });               
            });
            return deferred.promise;
        };

	    /**
        * get matching post with source Id
        * @param  {Array}  rows  rows/post fetched from pouch db
        * @param  {String/Integer}  sourceId 
        * @return {Array} filtered posts accordint to sourceId
        */
        var filterPostsHavingSourceId = function(rows, sourceId) {
            var relatedPosts = [];
            rows.map(function(row){
                if(isPostRelatedToSource(row.doc.post, sourceId) ) {
                    relatedPosts.push(row.doc.post);
                }
            });
            $log.debug(relatedPosts);
            return relatedPosts;
        }

        /**
        * check whether post is related with particular source or not
        * @param  {Object}          post       to decide
        * @param  {String/Integer}  sourceId 
        * @return {Boolean}
        */
        var isPostRelatedToSource = function(post, sourceId){
            var isRelated = false;
            if(post.source_id ==  sourceId){
                isRelated = true;
            }
            return isRelated;
        };


        /**
        * dostroying postsDB        
        */
        this.destroyPostsDBForClearChache = function(post, sourceId){
            var deferred = $q.defer();
            postsDB.destroy().then(function (response) {
              // success
            }).catch(function (err) {
            });
            return deferred.promise;
        };
	}

	feedsDAOService.$inject=['$log', '$rootScope', '$q'];

	angular
		.module('tatafo')
		.service('feedsDAOService', feedsDAOService);

})();