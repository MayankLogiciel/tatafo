angular
    .module('tatafo')	
	.service('deviceTokenService', function($log, $http, $q, TATAFO_API_URL){
	   /**
        * register device on server for 
        * 1) push notification 
        * 2) read unread manage user's posts/articles without login
        */
        this.registerDeviceOnServer = function(data) {
            var _defer  = $q.defer();
            // Initiate the AJAX request.
            $http({
                method: 'POST',
                url: TATAFO_API_URL + '/register-device',
                data: data,
                timeout: _defer.promise
            }).then(
                function( response ) {
                    // setFeedSourcesinLocalStorage(response);
                    _defer.resolve(response);
                },
                function(response) {
                    _defer.reject(response);
                }
            );
            return _defer.promise;
        };

        /**
        * Check whether we need to register device on server
        * it will register for the following cases
        * 1) if first time or unregistered
        * 2) if pushObj tokens has changed from device
        * @param {Object} pushObj : result from getIds() from OneSignal having pushToken and userId
        */
        this.isRegisterOnServerRequired = function(pushObj){

            if( !localStorage.tatafo_deviceInfo ){
                $log.debug('deviceInfo not present in localStorage');
                return true;
            }

            var deviceInfo = angular.fromJson(localStorage.tatafo_deviceInfo);

            if( deviceInfo.push_token != pushObj.pushToken || deviceInfo.device_token != pushObj.userId ){
                $log.debug('deviceInfo has changed from device & localStorage');
                return true;
            }else{
                return false;
            }

        };

        this.setDeviceInfoInLocalStorage = function(deviceInfo){
            localStorage.tatafo_deviceInfo = angular.toJson(deviceInfo);
        };

        this.getDeviceInfoFromLocalStorage = function(){
            return angular.fromJson(localStorage.tatafo_deviceInfo);
        };
	})

	.service('feedService', function($log, $http, $q, TATAFO_API_URL, $window, $rootScope, $ionicLoading, $timeout){
		var post;


        /**
        * Filtering feeds acording to Read/Unread Sort From API
        */

        this.markPostReadUnread=function(params) {

            var _defer  = $q.defer();
            $http({ method: 'POST',
                url: TATAFO_API_URL + '/feed/status/'+params.status ,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {'ids[]': params.ids },
                timeout: _defer.promise 
            }).then(function( response ) {
                _defer.resolve(response);
            }, function(response) {
                _defer.reject(response);
            });

            return _defer.promise;
        }

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
        * Gettiong feed From API
        */
        this.getFeeds = function(data) {
            var _defer  = $q.defer(data);
            $http({ method: 'GET',
                url: TATAFO_API_URL + '/get-feeds',
                params : data,
                timeout: _defer.promise 
            }).then(function( response ) {
                var re = /<img[^>]+src="?([^"\s]+)"?[^>]*\/>/;
                response.data.data.feed.map(function(val) {
                    var results = re.exec(val.feed.content || val.feed.summary);
                    if(results) {
                       if((results[0].match(/width="1"/gi)) || (results[0].match(/height="1"/gi))) {
                            val.image = null; 
                        }else {
                            val.image = results[1];
                        }
                    }                                        
                });
                _defer.resolve(response);
            }, function(response) {
                _defer.reject(response);
            });
            return _defer.promise;
        }            
	})

	.service('bookMarkService',function(_, $rootScope, $q, $ionicLoading){
		/**
		* add Bookmark to PouchDB
		* check if already exist then create msg already exist
		*/
     	this.addBookmarkToPouchDB = function(bookmark_post) {
			$q.when(bookmarksDB.allDocs({ 
				include_docs: true,
				descending: true,
			}))
	        .then(function(docs) {
	        	//check if this post is already saved
				var existing_post = _.find(docs.rows, function(data) { 
					if(angular.isUndefined(data.doc.data.id)){
						return null;
					}
					if(data.doc.data.id==bookmark_post.id){						
						$ionicLoading.show({ template: 'Gist already exist!', noBackdrop: true, duration: 1000 });					
						return data.doc.data.id == bookmark_post.id; 
					}
				});
		
				if(!existing_post) {
					bookmarksDB.post({
						data:bookmark_post
					});
					$ionicLoading.show({ template: 'Gist Saved!', noBackdrop: true, duration: 1000 });					
				}
	        }); 
		};

		/**
		* delete Bookmark from PouchDB
		*/
		this.deleteBookMark = function(bookmarkId) {
			var _defer  = $q.defer();
	    	$q.when(bookmarksDB.allDocs()
	    		.then(function (result) {
	    			for(var i = 0; i < result.rows.length; i++){
	    				if(result.rows[i].id==bookmarkId._id) {
							$ionicLoading.show({ template: 'Gist Deleted!', noBackdrop: true, duration: 1500 });
	    					return bookmarksDB.remove(result.rows[i].id,result.rows[i].value.rev);            				        					
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
	        $q.when(bookmarksDB.allDocs({ include_docs: true,  descending: true}))
	        .then(function(docs) {
	        	 _defer.resolve(docs.rows);
	        },function(error){
	        	_defer.reject(error);
	        });

	         return _defer.promise;
	    };
	})

	.service('feedDetailService', function(){
		var post;
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
	})

	.service('feedListService',function($rootScope , FeedLoader , $q){
		this.get = function(feedSourceUrl) {
			var response = $q.defer();
			//num is the number of results to pull form the source
			FeedLoader.fetch({q: feedSourceUrl, num: 20}, {}, function (data) {
				response.resolve(data.responseData);
			});
			return response.promise;
		};
	})

	.service('feedsDAOService', function($log, $rootScope, $q){

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
	})

	.service('messagesService', function() {
		/**
    	* 1. Write Custom messages for hole app.
    	*/
		var messagesService = function() {
	        this.general = {
	            'SOMETHING_WRONG': 'Something went wrong',
	            'INTERNET_NOT_CONNECTED':'Please check your internet connection',
	            'INTERNET_NOT_WORKING':'Network unavailable'
	        };
	    }
	})

	.service('settingService', function($log, $http, $q, TATAFO_API_URL){
		var syncIntervalOptions = [
        {
              title : '30 MINUTES',
              value : 0.5
        },
        {
              title : '1 Hour',
              value : 1
        },
        {
              title : '2 Hours',
              value : 2
        },
        {
              title : '4 Hours',
              value : 4
        },
        {
              title : '6 Hours',
              value : 6
        },
        {
              title : '8 Hours',
              value : 8
        },
        {
              title : '10 Hours',
              value : 10
        },
        {
              title : '12 Hours',
              value : 12
        },            
      	];

		var settings = {
			syncTimeOption: syncIntervalOptions[3], //set default value 4 Hours
			pushNotificationEnabled: true,
			imageViewDisabled: false,
			nightModeEnabled: false,
		};

        this.getSyncIntervalOptions = function(){
			return syncIntervalOptions;
		};

	    /**
	    * get user settings, if not found then it will first set default settings 
	    * and then return them
	    */
      	this.getSettings = function() {
          	if (localStorage.tatafo_settings == null) {
              localStorage.tatafo_settings = JSON.stringify(settings);
          	}
          	return JSON.parse(localStorage.tatafo_settings ||  null);
      	}
     
      	this.setPushNotificationSatus = function(isPushEnabled) {
          	settings = JSON.parse(localStorage.tatafo_settings || settings);
          	settings.pushNotificationEnabled = isPushEnabled;
          	localStorage.tatafo_settings = JSON.stringify(settings);         
      	}

      	this.setImageViewEnable = function(isImageEnabled) {
          	settings = JSON.parse(localStorage.tatafo_settings || settings);
          	settings.imageViewDisabled = isImageEnabled;
          	localStorage.tatafo_settings = JSON.stringify(settings);         
      	};

      	this.setNightModeEnable = function(isNightModeEnabled) {
          	settings = JSON.parse(localStorage.tatafo_settings || settings);
          	settings.nightModeEnabled = isNightModeEnabled;
          	localStorage.tatafo_settings = JSON.stringify(settings);         
      	};        

      	this.setSyncTimeOption = function(option){
        	settings = JSON.parse(localStorage.tatafo_settings || settings);
        	settings.syncTimeOption = option;
        	localStorage.tatafo_settings = JSON.stringify(settings);            
      	};

      	/**
      	* setAppRateStatus used to set the app rate status(true/false) to Local storage 
      	*/
      	this.setAppRateStatus = function(status) {
        	localStorage.tatafo_appRateStatus = status;                
     	}

      	/**
      	* getAppRateStatus used to get the current status from Local storage 
      	*/
      	this.getAppRateStatus = function() {
        	return localStorage.tatafo_appRateStatus ||  null;
      	}

      	this.setSourceFeedVisitedCount = function() {
        	var sourceFeedVisitedCount = JSON.parse(localStorage.tatafo_sourceFeedVisitedCounter || 0);
        	sourceFeedVisitedCount++;
        	localStorage.tatafo_sourceFeedVisitedCounter = sourceFeedVisitedCount;
      	}

        /**
      	* doWeNeedToShowAppRatePopup used to confirm that when to show popop for app rate
      	* geting the counter and app rate status from local storage
      	* checking the count value is it dividual by 5 and status is true
      	* returning true
      	*/
      	this.doWeNeedToShowAppRatePopup = function() {  
            var getFeedAppRateStatus = localStorage.tatafo_appRateStatus;       
            var getAppRateIgnoranceTime = localStorage.tatafo_appRateIgnoranceTime;
            var lastIngoranceTime = Date.parse(getAppRateIgnoranceTime || new Date("October 13, 2000 00:00:00"));
            var currenTime = Date.parse(new Date());
            var nextAppRateCardShowTime = 7*24*60*60*1000;
            var lastIngoranceTimeInMS = currenTime - lastIngoranceTime;                             
        	var getSourceFeedVisitedCount =  localStorage.tatafo_sourceFeedVisitedCounter;
        	if((lastIngoranceTimeInMS > nextAppRateCardShowTime) && (getSourceFeedVisitedCount%5==0) &&(angular.isUndefined(getFeedAppRateStatus) || getFeedAppRateStatus == 'false')){
               return true; 
            }
      	}


        this.setAppVisitedCount = function() {
            var appVisitedCount = JSON.parse(localStorage.tatafo_appVisitedCounter || 0);
            appVisitedCount++;
            localStorage.tatafo_appVisitedCounter = appVisitedCount;
        }


        this.setAppRateIgnoranceTime = function(ignoranceTime) {            
            localStorage.tatafo_appRateIgnoranceTime = ignoranceTime;
        }

        /**
        * doWeNeedToShowAppRateInList used to confirm that when to show app rate card in list
        * geting app rate status from local storage
        * checking the status is true
        * returning true
        */
       
        this.doWeNeedToShowAppRateInList = function() { 
            var getSourceFeedAppRateStatus = localStorage.tatafo_appRateStatus;       
            var getAppRateIgnoranceTime = localStorage.tatafo_appRateIgnoranceTime;
            var lastIngoranceTime = Date.parse(getAppRateIgnoranceTime || new Date("October 13, 2000 00:00:00"));
            var currenTime = Date.parse(new Date());
            var nextAppRateCardShowTime = 7*24*60*60*1000;
            var lastIngoranceTimeInMS = currenTime - lastIngoranceTime;
            var getAppVisitedCount =  localStorage.tatafo_appVisitedCounter;
            if((lastIngoranceTimeInMS > nextAppRateCardShowTime) && (getAppVisitedCount >= 3) &&(angular.isUndefined(getSourceFeedAppRateStatus) || getSourceFeedAppRateStatus == 'false')){
               return true; 
            }
        }
      	this.setTutorialTourStatus = function(status) {
        	//var appTutorialTourStatus = JSON.parse(localStorage.tatafo_AppTutorialTourStatus || false);
        	localStorage.tatafo_AppTutorialTourStatus = status;
      	}
      	this.doWeNeedToShowTutorialTour = function() {                   
        	var getTutorialTourStatus =  localStorage.tatafo_AppTutorialTourStatus;
        	if(getTutorialTourStatus == 'true') {
          		return true;          
        	}
      	}
	})
	
	.service('socialService', function($log, $cordovaSocialSharing) {
		var link='';

		this.sharePost = function(link){
            window.plugins.socialsharing.share('Check this post here: ', null, null, link);
        };
	})

	.service('sourcesService', function($log, $http, $q, TATAFO_API_URL, settingService) {
		this.isFeedSourcesAvailable = function() {            
            var sources = JSON.parse(localStorage.tatafo_sources || '[]');

            if(angular.isDefined(sources) && sources.length > 0 ){
                return true;
            }else{
                return false;
            }
           
        };

        /**
        *  setFeedSourcesinLocalStorage is used store sources in Local Storage
        */
        var setFeedSourcesinLocalStorage = function(sources){
            $log.debug('setFeedSourcesinLocalStorage');
            localStorage.tatafo_sources = JSON.stringify(sources);
        };

        /**
        *  getFeedSourcesinLocalStorage is used to get sources from Local Storage
        */
        this.getFeedSourcesFromLocalStorage = function(){
           return JSON.parse(localStorage.tatafo_sources ||  null)
        };


        /**
        *  getFeedSourceinLocalStorage is used to individual source from Local Storage accroding to the feed
        */
        this.getFeedSourceFromLocalStorage = function(id){
            var getSources= JSON.parse(localStorage.tatafo_sources ||  null);
            var singleSource={}
            angular.forEach(getSources, function(val,key){ 
                if(val.id==id){
                    singleSource = val;
                };

            });
            return singleSource;

        };

        /**
        *  getFeedSourceinLocalStorage is used to get sources from API
        */
        this.getSources = function(data) {
            var _defer  = $q.defer();
            // Initiate the AJAX request.
            $http({
                method: 'get',
                url: TATAFO_API_URL + '/get-sources',
                params: data,
                timeout: _defer.promise
            }).then(
                function( response ) {
                    setFeedSourcesinLocalStorage(response.data.data.sources);
                    if(angular.isDefined(response.data.data.sources) && response.data.data.sources.length > 0 ){
                        setLastSourceSyncTime(new Date());
                    }
                    _defer.resolve(response.data.data.sources);
                },
                function(response) {
                    _defer.reject(response);
                }
            );

            return _defer.promise;
        };

        var setLastSourceSyncTime = function(date){
            localStorage.tatafo_lastSourceSyncTime = date;
        };

        this.getLastSourceSyncTime = function(){
            return localStorage.tatafo_lastSourceSyncTime || new Date("October 13, 2000 00:00:00");
        };
	}) 