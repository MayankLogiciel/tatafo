angular
	.module('tatafo')

	// App Controller
	.controller('AppController',function($log, $scope, settingService, $rootScope){
		/**
		* Initialization
		*/
		var setup=function(){
			$log.debug('AppController setup');
			$scope.defaultImage = 'img/imgUnavailable.png';
			$rootScope.settings = JSON.parse(localStorage.tatafo_settings);
			$scope.$on('nightModeEnabled', function(event, data){
				$rootScope.settings.nightModeEnabled = data;
			});
		};
    	setup();
	})
	// All Feeds Controller
	.controller('AllFeedsController', function($log, $ionicPopover, $rootScope, $scope, sourcesService, feedService, feedsDAOService, $ionicLoading, $state,feedDetailService, $ionicScrollDelegate, bookMarkService, socialService, ConnectivityMonitorFactory, settingService, $timeout, messagesService){
		var setup = function(){
			$log.debug('AllFeedsController setup');
			$scope.allFeed = [];
			$scope.feedSources = [];
			$scope.feedsParams = {
				page:1,
				limit:10
			};
			$scope.isMoreFeeds=false;
			$scope.sttButton=false;
			$scope.isSearchOpen = false;
			$scope.searchQuery = '';
			$scope.feedStatus = {};
			$scope.feedStatus.read=true;
			$scope.feedStatus.unread=true;
			$scope.feedLoaded = false;			
			getFeeds();			
			loadPopOver();
			$rootScope.$on("readArticle", function (event,args) {
				$log.debug("Read Article event received in All Feed Controller");
	      		angular.forEach($scope.allFeed,function(val, key){
	      			if(val.id == args.id){
	      				$scope.allFeed[key].is_read=true;
	      			}
	      		});
	    	});	    		
		};
		$scope.$on('$ionicView.enter', function(e) {
		        if (window.AdMob){
		        	AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);		        	
		        }	       
		        	
		});			
		var getFeeds = function () {
			if(sourcesService.isFeedSourcesAvailable() && !isSourceSyncRequired()){
				//load all feeds
				$log.debug('Sources already Available');
				$scope.feedSources=sourcesService.getFeedSourcesFromLocalStorage();
				loadFeeds();
			}else{	
				//load feed source data first
				$log.debug('Sources Unavailable');
				$ionicLoading.show({
          			template: '<ion-spinner icon="android"></ion-spinner>'
        		});
				loadFeedSources();
			}
		};

		/**
		* Decide whether source data sync is required or not
		* by checking users sync preference and last sync time
		*/

		var isSourceSyncRequired = function() { 
			if(ConnectivityMonitorFactory.isOffline()) {
				$log.debug("No request will send to ApI during Offline");
			} else {				
				var syncSetting = settingService.getSettings().syncTimeOption;
				var syncIntervalInMS = syncSetting.value*60*60*1000;
				var lastSynced = Date.parse(sourcesService.getLastSourceSyncTime());
				var currenTime = Date.parse(new Date());
				var timeSinceLastSyncInMS = currenTime - lastSynced;

				if(timeSinceLastSyncInMS > syncIntervalInMS) {
					$log.debug("Sync is required");
					return true;
				}else {
					$log.debug("Sync is not required");
				 	return false;
				}
			}
		}

		/**
		* loadPopOver used to open the popover by clicking sort drop downbutton
		*/		
		var loadPopOver=function(){
			$ionicPopover.fromTemplateUrl('views/app/feeds/sort-popover.html', {
    			scope: $scope,
 			}).then(function(popover) {
    			$scope.popover = popover;
  			});
		};

		/**
		* loadFeedSources loads the new sources from API by sending request using sourcesService.getSources
		*/	
		var loadFeedSources = function() {
			sourcesService.getSources().then(function(sources) {
				$scope.feedSources = sources;
				loadFeeds();
			});
		};

		/**
		* loadFeeds loads the all feeds
		* if ConnectivityMonitorFactory.isOffline then loads the feeds from pouch db using feedsDAOService.getfeedFromPouchDB
		* if ConnectivityMonitorFactory.isOnline then loads the feeds from  API using feedService.getFeeds
		*/
		var loadFeeds = function(isLoadMore) {
			$scope.loaded = false;
			if(ConnectivityMonitorFactory.isOffline()) {
				if( ($scope.feedStatus.read && $scope.feedStatus.unread) || (!$scope.feedStatus.read && !$scope.feedStatus.unread) ){
					LoadAllFeedsByCheckingReadUnreadFilter(isLoadMore);
				}else {
					loadFeedsByFilteringReadOrUnread();
				}
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				if($state.current.name.indexOf('app.feeds.all') !== -1 ) {
					$ionicLoading.show({
	          			template: '<ion-spinner icon="android"></ion-spinner>'
	        		});
					feedService.getFeeds($scope.feedsParams).then(function(feed) {			
		   				if(feed.data.data.meta.pagination.current_page < feed.data.data.meta.pagination.total_pages){
							$scope.isMoreFeeds = true;
						}else{
							$scope.isMoreFeeds = false;
						}
						if(!isLoadMore) {
							$scope.allFeed = [];
						}
						$scope.allFeed = $scope.allFeed.concat(feed.data.data.feed);						
						getBookMarksfromPouchDBToChangeSaveButtonColor();
						feedsDAOService.addNewFeeds($scope.allFeed);
						$scope.loaded = true;
						$timeout(function() {
							$scope.feedLoaded = true;
						}, 200);
					})
					.finally(function(){	
						if(isLoadMore){
							$scope.$broadcast('scroll.infiniteScrollComplete');
						}else{
							$scope.$broadcast('scroll.refreshComplete');
						}				
						$ionicLoading.hide();
					});
				}
			}
		};

			/**
			* LoadFeeds 
			*/
			var LoadAllFeedsByCheckingReadUnreadFilter = function(isLoadMore) {
				feedsDAOService.getRecentPostsFromPouchDB($scope.feedsParams).then(function(response){
					$log.debug(response);
					if(!isLoadMore) {
						$scope.allFeed = [];
					}
					if(response.posts.length>0){
						angular.forEach(response.posts, function(feed, key) {	
							$scope.allFeed = $scope.allFeed.concat(feed);
						});						
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}	
					else{
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}
					getBookMarksfromPouchDBToChangeSaveButtonColor();					
					$scope.loaded = true;
					$timeout(function() {
						$scope.feedLoaded = true;
					}, 200);
				}).finally(function(){	
					if(isLoadMore){
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}else{
						$scope.$broadcast('scroll.refreshComplete');
					}				
				});	
			}
		/*
		* deleteBookMarks used to make the bookmark unselected form
		*/
		$rootScope.$on("deleteBookMarks", function (event,arg) {
			$scope.allFeed.map(function(v) {
				if(v.id == arg.id){
					v.bookmarkSaved = false;
				}
			});						
		});

		/*
		* getBookMarksfromPouchDBToChangeSaveButtonColor used change to save Button color 
		* Getting all bookmark from PouchDB
		* comparing them with Feed List 
		*/
		var getBookMarksfromPouchDBToChangeSaveButtonColor  = function() {
			var getBookMarksfromPouchDB  = [];
			bookMarkService.getBookmarkList().then(function(response){
				getBookMarksfromPouchDB = response;
				$scope.allFeed.map(function(value) {
					value.bookmarkSaved = false;
					getBookMarksfromPouchDB.map(function(val) {
						if(val.doc.data.id == value.id) {
							value.bookmarkSaved = true;
						}
					})								
				});
			});
		}	

		/**
		* selectOption to geting the read and unread feeds
		* if ConnectivityMonitorFactory.isOffline then feedService.sortReadUnread loads the feeds from pouchDB(after filtering) 
		* if ConnectivityMonitorFactory.isOnline then send the request status to API and load the feed according to the satatus by calling load feeds
		*/
		$scope.selectOption = function() {
			$scope.feedsParams.page = 1;
			if(ConnectivityMonitorFactory.isOffline()) {	
				if( ($scope.feedStatus.read && $scope.feedStatus.unread) || (!$scope.feedStatus.read && !$scope.feedStatus.unread) ){
					loadFeeds();
				}else {
					loadFeedsByFilteringReadOrUnread();
				}
							
			}			
			if(ConnectivityMonitorFactory.isOnline()) {
				$ionicLoading.show({
	          		template: '<ion-spinner icon="android"></ion-spinner>'
	        	});
				
				if( $scope.feedStatus.read && $scope.feedStatus.unread ) {
					if (angular.isDefined($scope.feedsParams.status)) {
		    			delete $scope.feedsParams.status;
		    		}
				} else if( $scope.feedStatus.read || $scope.feedStatus.unread ) {
					$scope.feedsParams.status = ($scope.feedStatus.read) ? "read" : "unread";
				} else {
					if (angular.isDefined($scope.feedsParams.status)) {
		    			delete $scope.feedsParams.status;
		    		}
				}
				loadFeeds();
				$scope.scrollTop();
			}
			$scope.popover.hide();
		};

		var loadFeedsByFilteringReadOrUnread = function() {
			if( $scope.feedStatus.read || $scope.feedStatus.unread ) {
				$scope.feedsParams.is_read = ($scope.feedStatus.read) ? true : false;
				feedsDAOService.getReadUnreadPosts($scope.feedsParams).then(function(response) {
						$scope.allFeed = [];											
						$scope.allFeed = response.posts;							
						$scope.isMoreFeeds = response.isMorePostsPresent;
				}).finally(function(){	
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.$broadcast('scroll.refreshComplete');									
				});				
			}		
		}

		$scope.search = function(query){
			$scope.isSearchUsed = true;
			$scope.feedsParams.page = 1;
			$scope.feedsParams.name = query;
			if(ConnectivityMonitorFactory.isOffline()) {				
				ConnectivityMonitorFactory.showErrorBanner(messagesService.general.INTERNET_NOT_WORKING);
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				$scope.doRefresh();
			}		
		};

		/**
		* show and hide button not needed while clicking search button
		*/
		$scope.onSearchIconClick = function() {
			$scope.isSearchOpen = $scope.isSearchOpen ? false : true;
      	};

      	/**
		* show and hide button not needed while clicking search closed button
		*/
    	$scope.onClosedIconClick = function() {
        	$scope.isSearchOpen = false;
        	delete $scope.feedsParams.name;
        	if($scope.isSearchUsed){
	        	$scope.doRefresh();
        		$scope.isSearchUsed = false;
        	}        	
    	};

		$scope.bookmarkPost = function(post) {
			post.bookmarkSaved = true;
			bookMarkService.addBookmarkToPouchDB(post);
		};

		$scope.sharePost = function(post) {
			socialService.sharePost(post.feed.permalinkUrl);
		};

		/**
		*loadMore incrementing page by one and calling the loadFeeds
		*/
		$scope.loadMore = function() {
			if($scope.allFeed.length > 0){
				$scope.feedsParams.page++;
	 			loadFeeds(true);
			}
		}


		/**
		* doRefresh setting up the page 1 
		* calling the loadFeeds
		*/
		$scope.doRefresh = function() {
			$scope.isMoreFeeds = false;	
			$scope.feedsParams.page = 1;				
			loadFeeds(false);
       		$scope.scrollTop();
		};

		/**
		* loadPostDetails feedDetailService.setPostData posting the deatil of single feed to article page
		* loadPostDetails feedDetailService.setCombinedPostDataForNextPrevious sending the deatil of other feeds for next and previous Button
		*/	
		$scope.loadPostDetails=function(post) {	
			feedDetailService.setPostData(post);
			feedDetailService.setCombinedPostDataForNextPrevious($scope.allFeed);
			$state.go('app.feed-entries-details');								
		};


		/**
		* opening the url app.feed-entries with perticular source Id
		*/
		$scope.feedDetail = function (sourceId,sourceName) {
			settingService.setSourceFeedVisitedCount();
			$state.go('app.feed-entries', {sourceId: sourceId, sourceName: sourceName});
		} 

		

		/**
		* scrolling up to top by clicking sttButton
		* hide the sttButton
		*/
		$scope.scrollTop = function() { //ng-click for back to top button
	  		$ionicScrollDelegate.scrollTop([true]);
	 		$scope.sttButton=false; //hide the button when reached top
		};
		
	  	setup();	
	})

	// source feeds controller
	.controller('SourceFeedController',function($log, $rootScope, $scope, $state, $stateParams, feedService, feedsDAOService, $ionicLoading, $ionicScrollDelegate, bookMarkService, feedDetailService, socialService, ConnectivityMonitorFactory, settingService, $ionicHistory, $window){
		var setup = function() {		
			$log.debug('SourceFeedController setup');
			$scope.feed = [];
			$scope.feedsParams = {
				page:1,
				limit:10
			};
			$scope.isMoreFeeds=false;
			$scope.sttButton=false;
			$scope.isSearchOpen = false;
			$scope.searchQuery = '';
			loadFeeds();
			$rootScope.$on("readArticle", function (event,args) {
				$log.debug("Read Article event received in Source Feed Controller");
	      		angular.forEach($scope.feed,function(val, key){
	      			if(val.id == args.id){
	      				$scope.feed[key].is_read=true;
	      			}
	      		});
	    	});	

			/**
			* Back Button Handling before leave
			* checking the current url(is it Loacl/Foriegn ?)
			* confirming that need to show popup or not for App rate using settingService.doWeNeedToShowAppRatePopup function
			*/
			$scope.$on('$ionicView.beforeLeave', function (event, viewData) {
				console.log('$ionicView.beforeLeave');
			    if(($state.current.name.indexOf('app.feeds.local') != -1 ) || (($state.current.name.indexOf('app.feeds.foreign') != -1 ))) {
				  	if(settingService.doWeNeedToShowAppRatePopup()) {
						console.log($state.current.name);
				  		
				  		var clickEvent = new MouseEvent("tap", {});
				  		if(($state.current.name.indexOf('app.feeds.local') != -1 )){
					    	var element = document.getElementById('app-rate-model-source-feed-local');
				  		}
				  		if(($state.current.name.indexOf('app.feeds.foreign') != -1 )){
					    	var element = document.getElementById('app-rate-model-source-feed-foreign');
				  		}
						element.dispatchEvent(clickEvent);
				  	}
				}
			});

		};

		/**
		* Back Button Handling
		* Solution for Back button because it does not behave properly after few moves
		* Due to BackView():null problem($window.history.go(-1) resolve this problem)  
		*/
		$scope.myGoBack = function() {
    		$window.history.go(-1);
  		};

		/**
		* Back Button Handling
		*/
		// $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		//     viewData.enableBack = true;
		// });


		/**
		* Post bookmark
		*/	
		$scope.bookmarkPost = function(post) {
			post.bookmarkSaved = true;
			bookMarkService.addBookmarkToPouchDB(post);
			
		};

		/**
		* share post
		*/

		$scope.sharePost = function(post) {
			socialService.sharePost(post.feed.permalinkUrl);
		};

		/**
		* loadFeeds loads the all feeds of perticular source
		* if ConnectivityMonitorFactory.isOffline then loads the feeds from pouch db using feedsDAOService.getfeedFromPouchDB
		* if ConnectivityMonitorFactory.isOnline then loads the feeds from  API using feedService.getFeeds
		*/
		var loadFeeds = function(isLoadMore) {	
			$scope.loaded = false;			
			$scope.feedsParams.source_id = $stateParams.sourceId;
			$scope.feedsParams.source_name = $stateParams.sourceName;
			if(ConnectivityMonitorFactory.isOffline()) {
				feedsDAOService.getPostsHavingSource($scope.feedsParams).then(function(response){
					if(response.posts.length>0){
						if(!isLoadMore) {
							$scope.feed = [];
						}
						angular.forEach(response.posts, function(feed, key) {							
							$scope.feed = $scope.feed.concat(feed);
						});
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}	
					else{
						$scope.isMoreFeeds = response.isMorePostsPresent;
					}
					getBookMarksfromPouchDBToChangeSaveButtonColor();					
					$scope.loaded = true;
				}).finally(function(){	
					if(!isLoadMore){
						$scope.$broadcast('scroll.refreshComplete');
					}else{
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}				
				});;
			}
			
			if(ConnectivityMonitorFactory.isOnline()) {
					
				$ionicLoading.show({
          			template: '<ion-spinner icon="android"></ion-spinner>'
        		});
				feedService.getFeeds($scope.feedsParams).then(function(feed) {			
	   				if(feed.data.data.meta.pagination.current_page < feed.data.data.meta.pagination.total_pages){
						$scope.isMoreFeeds = true;
					}else{
						$scope.isMoreFeeds = false;
					}
					if(!isLoadMore) {
						$scope.feed = [];
					}
					$scope.feed = $scope.feed.concat(feed.data.data.feed);						
					getBookMarksfromPouchDBToChangeSaveButtonColor();
					$scope.loaded = true;
					}).finally(function(){	
						if(isLoadMore){					
							$scope.$broadcast('scroll.infiniteScrollComplete');
						}else{
							$scope.$broadcast('scroll.refreshComplete');
						}				
						$ionicLoading.hide();
					});
					
				}
			}

		/*
		* deleteBookMarks used to make the bookmark unselected form
		*/
		$rootScope.$on("deleteBookMarks", function (event,arg) {
			$scope.feed.map(function(v) {
				if(v.id == arg.id){
					v.bookmarkSaved = false;
				}
			});						
		});

		/*
		* getBookMarksfromPouchDBToChangeSaveButtonColor used change to save Button color 
		* Getting all bookmark from PouchDB
		* comparing them with Feed List 
		*/
		var getBookMarksfromPouchDBToChangeSaveButtonColor  = function() {
			var getBookMarksfromPouchDB  = [];
			bookMarkService.getBookmarkList().then(function(response){
				getBookMarksfromPouchDB = response;
				$scope.feed.map(function(value) {
					value.bookmarkSaved = false;
					getBookMarksfromPouchDB.map(function(val) {
						if(val.doc.data.id == value.id) {
							value.bookmarkSaved = true;
						}
					})							
				});
			});
		}		
		/**
		*loadMore incrementing page by one and calling the loadFeeds
		*/	
		$scope.loadMore = function() {
			if($scope.feed.length > 0){
				$scope.feedsParams.page++;
		 		loadFeeds(true);
			}
		}

		/**
		* loadPostDetails feedDetailService.setPostData posting the deatil of single feed to article page
		* loadPostDetails feedDetailService.setCombinedPostDataForNextPrevious sending the deatil of other feeds for next and previous Button
		*/
		$scope.loadPostDetails=function(post) {
			feedDetailService.setPostData(post);
			feedDetailService.setCombinedPostDataForNextPrevious($scope.feed);
			$state.go('app.feed-entries-details');
		}

		$scope.search = function(query){
			$scope.isSearchUsed = true;
			$scope.feedsParams.page = 1;
			$scope.feedsParams.name = query;
			if(ConnectivityMonitorFactory.isOffline()) {								
				ConnectivityMonitorFactory.showErrorBanner('Network unavailable');			
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				$scope.doRefresh();
			}		
		};


		/**
		* show and hide button not needed while clicking search button
		*/
		$scope.onSearchIconClick = function() {
			$scope.isSearchOpen = $scope.isSearchOpen ? false : true;
      	};

      	/**
		* show and hide button not needed while clicking search closed button
		*/
    	$scope.onClosedIconClick = function() {
        	$scope.isSearchOpen = false;
        	delete $scope.feedsParams.name;
        	if($scope.isSearchUsed){
	        	$scope.doRefresh();
        		$scope.isSearchUsed = false;
        	}
        	
    	};

		$scope.doRefresh = function() {	
			$scope.isMoreFeeds = false;
			$scope.feedsParams.page = 1;				
			loadFeeds(false);
       		$scope.scrollTop();
		};

	   	$scope.scrollTop = function() {
	   		$ionicScrollDelegate.scrollTop([true]);
	  		$scope.sttButton=false;
		};

		setup();
	})

	//bookmark controller
	.controller('BookMarksController',function($scope, bookMarkService, $state, $ionicPopup, feedDetailService, $rootScope){
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
     				title: 'Delete Gist',
     				template: 'Are you sure you want to delete this gist?'
			});
			confirmPopup.then(function(res) {				
			    if(res) {
			       	bookMarkService.deleteBookMark(postId);
					angular.forEach($scope.bookmarks,function(val,index){
						if(postId._id==val.id){
			       			$scope.bookmarks.splice(index, true);
							$rootScope.$broadcast("deleteBookMarks", {id: postId.data.id});
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
	})

	// Feed deatil controller
	.controller('FeedDetailController',function($log, $scope, feedDetailService, bookMarkService, feedService, socialService, ConnectivityMonitorFactory, $timeout, sourcesService, $rootScope, $ionicLoading, feedsDAOService, $ionicHistory, $window, settingService, $cordovaAppAvailability, $ionicScrollDelegate, $filter){
		/**
		* Initialization
		*/
		var setup = function(){
			$log.debug("FeedDetailController");

			$scope.isImageViewDisabled = settingService.getSettings().imageViewDisabled;

			$rootScope.$on('imageViewEnabled', function(ev, args) {
				$scope.isImageViewDisabled = args;
			});

			$scope.sttButton=true;
			$scope.allFeed=[];
			$scope.load = false;
			$scope.entry = feedDetailService.getPostData(); //load feed data
			replaceElementWithIframeforOtherVideo($scope.entry);
			applyImageLoaderToDetailFeedImages($scope.entry);			
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
			markAsRead();
		    $scope.$on('$ionicView.beforeLeave', function(e) {
		        if (window.AdMob) AdMob.showInterstitial();	       
		    });			
		};

		/**
		* applyImageLoaderToDetailFeedImages is used to apply Loader to imges due to slow load od image
		* replacing the attribute of content or summary
		*/
		var applyImageLoaderToDetailFeedImages = function(data) {
			var elem= document.createElement("div");
			elem.innerHTML = data.feed.content || data.feed.summary;
			var images = elem.getElementsByTagName("img");
			angular.forEach(images, function(img, key){
				if( (img.width && img.width == "1")  || (img.height && img.height == "1") ){
					$log.debug('Image with height or width Attribute 1 found so removed img element');
					img.parentNode.removeChild(img);
				}else{
					if ($scope.isImageViewDisabled || ConnectivityMonitorFactory.isOffline()) {
						img.setAttribute("image-lazy-src", 'img/imgUnavailable.png');
					} else {

						img.setAttribute("image-lazy-src", img.src);
					}
					
					img.setAttribute("image-lazy-loader", "android");
					img.setAttribute("image-lazy-distance-from-bottom-to-load",100);
					img.removeAttribute("src");
					img.removeAttribute("border");		
				}
			});
			if(data.feed.content){
				data.feed.content = elem.innerHTML;
			}else {
				if(elem.innerHTML!= 'undefined') {				
			 		data.feed.summary = elem.innerHTML;
			 	}
			}
			
			elem = undefined;
		};

		var replaceElementWithIframeforOtherVideo = function(data ){		

			var elem= document.createElement("div");
			elem.innerHTML = data.feed.content || data.feed.summary;
			var element = elem.getElementsByClassName("instagram-media");
			var hrefContent = /href="(.*?)"/ ;
			angular.forEach(element, function(value,key){
			 	var videoUrl = hrefContent.exec(value.innerHTML);
				if(videoUrl[1] && videoUrl[1] != null && videoUrl[1] != 'https://www.instagram.com/p'){
					var iframe= document.createElement("iframe");			
				 	iframe.setAttribute("allowfullscreen", "");
				 	iframe.setAttribute("frameborder", "0");
				 	iframe.setAttribute("scrolling","no");				
				 	iframe.setAttribute("src",videoUrl[1]+"embed");
				 	iframe.setAttribute("class","custom-iframe");
				 	iframe.removeAttribute("class","EmbedHeader");
				 	elem.appendChild(iframe);			
				}
			});
			//remove instagram media blocks
			while(element[0]) {
			    element[0].parentNode.removeChild(element[0]);
			}
			//replace content to show 
			data.feed.content = elem.innerHTML;	

			elem = undefined;
			element = undefined;				
		}
		

	    /**
	    * getting the current index of th feed showing in article page
	    */
		var getCurrentFeedIndex = function(){
			angular.forEach($scope.allFeed, function(val, index) {
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
			$scope.allFeed = $filter('orderBy')($scope.allFeed,'feed.updated',true);
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
			if (!$scope.entry.is_read && ConnectivityMonitorFactory.isOnline()) {
				feedService.markPostReadUnread(params).then(function(res) {
					$log.debug(res);
					$rootScope.$broadcast("readArticle", { id: res.data.data.updated_ids[0], status: true });
				})
			}
			if (!$scope.entry.is_read && ConnectivityMonitorFactory.isOffline()) {
			 	feedsDAOService.markPostReadUnread($scope.entry).then(function(res) {			 		
			 	})
			 }
		};

		$scope.openEmail = function (link) {
			window.open("mailto:"+link, '_system');
		};

		$scope.openBlogLink = function (link) {
			window.open(link, '_system');
		};

		$scope.openFacebookLink = function (link) {	
			if(ionic.Platform.isWebView()) {
				$cordovaAppAvailability.check('com.facebook.katana')
			    .then(function() {
			    	window.open('fb://page/'+link, '_system', 'location=no');			       
			    }, function () {			    	
			    	window.open('https://www.facebook.com/'+link, '_system');			        
			    });				
			} 
    	}

    	$scope.openTwitterLink = function (link) {	
			if(ionic.Platform.isWebView()) {
				$cordovaAppAvailability.check('com.twitter.android')
			    .then(function() {
			    	window.open('twitter://user?screen_name='+link, '_system', 'location=no');			       
			    }, function () {			    	
			    	window.open('https://www.twitter.com/'+link, '_system');			        
			    });				
			} 
    	}

    	$scope.openInstagramLink = function (link) {	
			if(ionic.Platform.isWebView()) {
				$cordovaAppAvailability.check('com.instagram.android')
			    .then(function() {
			    	window.open('https://www.instagram.com/'+link, '_system');			       
			    }, function () {			    	
			    	window.open('https://www.instagram.com/'+link, '_system');			        
			    });				
			} 
    	}

    	$scope.openYoutubeLink = function (link) {	
			if(ionic.Platform.isWebView()) {
				$cordovaAppAvailability.check('com.youtube.android')
			    .then(function() {
			    	window.open('https://www.youtube.com/'+link, '_system');			       
			    }, function () {			    	
			    	window.open('https://www.youtube.com/'+link, '_system');			        
			    });				
			} 
    	}

		$scope.openOriginalStoryLink = function (link) {
			var ref = cordova.ThemeableBrowser.open(link, '_blank', {
			    statusbar: {
			        color: '#FFFFFF'
			    },
			    toolbar: {
			        height: 44,
			        color: '#E74D4D'
			    },
			    title: {
			        color: '#FFFFFF',
			        showPageTitle: true
			    },
			    closeButton: {
			        image: 'ic_action_remove',
			        imagePressed: 'close_pressed',
			        align: 'left',
			        event: 'closePressed'
			    },

			    "browserProgress": {
                    "showProgress": true,
                    "progressBgColor": "#016585",
                    "progressColor": "#FFAA16"
                },
			    // backButton: {
			    //     image: 'ic_action_previous_item',
			    //     imagePressed: 'back_pressed',
			    //     align: 'left',
			    //     event: 'backPressed'
    			// },	
			    // forwardButton: {
			    //     image: 'ic_action_next_item',
			    //     imagePressed: 'forward_pressed',
			    //     align: 'left',
			    //     event: 'forwardPressed'
   				// },	   				
			    backButtonCanClose: true,
			    hidden: true
				}).addEventListener('backPressed', function(e) {
				}).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
			    	$log.debug(e.message);
				}).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
			    	$log.debug(e.message);
				})

				ref.addEventListener('loadstart', function(event) {
                    $ionicLoading.show({                    	
                        template: 'Loading please wait ...',
                        animation: 'fade-in',
                        noBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                  	});
                });

                ref.addEventListener('loadstop', function(event) {
                    $ionicLoading.hide();
                    ref.show();
                });
                ref.addEventListener('loaderror', function(event) {
                    $ionicLoading.hide();

                });

                ref.addEventListener('exit', function(event) {
                    $ionicLoading.hide();
                    ref.removeEventListener('loadstart', callback);
                    ref.removeEventListener('loadstop', callback);
                    ref.removeEventListener('loaderror', callback);
                    ref.close();
                    ref = undefined;
                });

			};
		/**
		*  bookmarkPost post the feed deatil for book mark for PouchDB
		*/	
		$scope.bookmarkPost = function() {	
			$scope.entry.bookmarkSaved = true;
			bookMarkService.addBookmarkToPouchDB($scope.entry);
		};

		/**
		* Back Button Handling
		* Solution for Back button because it does not behave properly after few moves
		* Due to BackView():null problem($window.history.go(-1) resolve this problem)  
		*/
		$scope.myGoBack = function() {
    		$window.history.go(-1);
  		};


		$scope.sharePost = function() {
			socialService.sharePost($scope.entry.feed.permalinkUrl);
		}

		setup();
	})
	//offline Controller
	.controller('OfflineController',function($log, $scope, $state, ConnectivityMonitorFactory, $rootScope, $ionicHistory, $ionicLoading){
		/**
		* Initialization
		*/
		var setup=function(){
			$log.debug('OfflineController setup');			
		};
		$scope.$on('$ionicView.enter', function(e) {
		       $ionicLoading.hide();	
		});	
		$scope.retry =function () {
			if(ConnectivityMonitorFactory.isOffline()) {
				$state.go('app.offline');
			}
			if(ConnectivityMonitorFactory.isOnline()) {
				$rootScope.$broadcast("retry");
				$scope.myGoBack();
			}	
		}

		$scope.myGoBack = function(){
			$ionicHistory.goBack();
		}
    	setup();
	})
	// setting controller
	.controller('SettingsController' , function($log, $scope, $rootScope, $ionicPopup, settingService){
		 var setup = function(){
                  $log.debug('SettingsController');
                  $scope.syncIntervalOptions = settingService.getSyncIntervalOptions();
                  $log.debug($scope.syncIntervalOptions);
                  $scope.userSettings = settingService.getSettings();
                  $log.debug($scope.userSettings);
            };

            /**
            * show the status of Pushnotifiaction button
            */
            $scope.toggleUserPushChoice=function(status){
                  settingService.setPushNotificationSatus(status);
                  window.plugins.OneSignal.setSubscription(status);
            }

            $scope.toggleUserImageChoice = function (status) {
                settingService.setImageViewEnable(status);
                $rootScope.$broadcast('imageViewEnabled', status);
            };

            $scope.toggleNightModeChoice = function (status) {
                settingService.setNightModeEnable(status);
                $rootScope.$broadcast('nightModeEnabled', status);
            };

            /**
            * show popup for select interval
            */
            $scope.showPopup = function() {
                  //put selected option object in ng-model for radio button before opening popup
                  $scope.userSettings.selectedSyncOption = angular.toJson($scope.userSettings.syncTimeOption);
                  var syncPopup = $ionicPopup.show({
                        template: '<div ng-repeat="entry in syncIntervalOptions"><ion-radio ng-model="userSettings.selectedSyncOption" value="{{entry}}">{{entry.title}}</ion-radio></div>',	       
                        title: 'Please select the interval',		     
                        scope: $scope,
                        buttons: [{
                              text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                    $log.debug($scope.userSettings);
                                    $scope.userSettings.syncTimeOption = angular.fromJson($scope.userSettings.selectedSyncOption);
                                    settingService.setSyncTimeOption($scope.userSettings.syncTimeOption);
                                    $log.debug($scope.userSettings);
                                    //syncPopup.close();
                              }
                        }] 
                  });

            };

            setup();
	})
	// Tour Controller
	.controller('TourController',function($scope, $state, $ionicSlideBoxDelegate, settingService){
		 $scope.$on('$ionicView.enter', function() { 
            if(ionic.Platform.isWebView()){
                AdMob.removeBanner();           
            }
            //Customizations
            $scope.ioniconSize = "36px"; //icon button size.
            $scope.ioniconColor = "#fff"; //icon button color.
            $scope.imageWidth = "65%"; //size of the tour image.
            $scope.textWidth = "70%"; //how much width should the tour texts occupy.
            $scope.fontColor = "#fff"; //color of the tour texts.
            $scope.titleSize = "24px"; //size of the title.
            $scope.subtitleSize = "18px"; //size of the subtitle.
            $scope.textSize = "18px"; //size of the text.

            //To edit carousel size and color look for
            //.slider-pager .slider-pager-page
            //.slider-pager .slider-pager-page.active in style.css

            //Set the pages.
            $scope.pages = [({
                    backgroundColor: "#387ef5",
                    image: "img/bg-img.jpg",
                    title: "Welcome to Firebase v3 Auth Social Kit",
                    subtitle: "The easiest way to implement Firebase and Social login auth to your Ionic application."
                }),
                ({
                    backgroundColor: "#e82f2d",
                    image: "img/bg-gif.gif",
                    title: "Absolutely Beautiful User Interface",
                    subtitle: "Simple-yet-effective UI to guide your user in, including error and popup messages."
                }),               
            ];

            //Further Customizations
            $scope.pages.backgroundColor = "#387ef5";

            $scope.pages.nextPageText = "Swipe to Continue";
            $scope.pages.endText = "End Tour";
            $scope.pages.redirect = "app.feeds.all";

            //Initialization
            $scope.atFirstPage = true;
            $ionicSlideBoxDelegate.update();

            //Go to the next slide.
            $scope.next = function() {
                $ionicSlideBoxDelegate.next();
            };

            //Go to the previous slide.
            $scope.previous = function() {
                $ionicSlideBoxDelegate.previous();
            };

            //End tour.
            $scope.skip = function() {
                //Return to first page.
                settingService.setTutorialTourStatus(true);
                if(ionic.Platform.isWebView()){
                    AdMob.createBanner();
                }
                $ionicSlideBoxDelegate.slide(0);
                $state.go($scope.pages.redirect);
            };

            //Go to the page of the pager/carousel selected.
            $scope.pagerClicked = function(index) {
                $ionicSlideBoxDelegate.slide(index);
            };

            //Determines whether the user is on the first page and the last page, to show the appropriate buttons.
            $scope.slideChanged = function(index) {
                //User is on the last page.
                if (index + 1 == $scope.pages.length) {
                    $scope.atLastPage = true;
                } else {
                    $scope.atLastPage = false;
                }
                //User is on the first page.
                if (index == 0) {
                    $scope.atFirstPage = true;
                } else {
                    $scope.atFirstPage = false;
                }
            };
        });
	});