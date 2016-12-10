angular
	.module('tatafo')
	// app rate Directive
	.directive('appRateDirective',function($ionicModal, $window, settingService, $timeout){
		return {
			restrict: 'A',
			scope: {},
			link: function(scope, element, attrs) {
				/**
				* ionicModal for rate app or not
				*/
				$ionicModal.fromTemplateUrl('views/common/rates.html', {    			 
    				scope: scope,
    				animation: 'none',
    				backdropClickToClose: false
    			}).then(function(modal) {
    				scope.appRateModel = modal;
  				});

	            scope.showAppRateModel = function() {
	            	$timeout(function() {
	               		scope.appRateModel.show();
	            	}, 0);
	            }

  				scope.hideModel = function() {
  					scope.appRateModel.hide();
				}
  				
				/**
				* ionicModal for rate app if satisfied
				*/
				$ionicModal.fromTemplateUrl('views/common/rates1.html', {    			 
    				scope: scope,
    				animation: 'none',
    				backdropClickToClose: false
    			}).then(function(modal) {
    				scope.appRateModel1 = modal;
  				});

              	scope.showAppRateModelForYes = function() {
               		scope.appRateModel1.show();
              	}

              	scope.hideAppRateModelYes = function() {
					scope.appRateModel1.hide();
				}

				scope.appRate = function () {
					settingService.setAppRateStatus(true);		
					$window.open("market://details?id=com.wec.tatafo", "_system");
				}

				/**
				* ionicModal for rate app if not satisfied
				*/
				$ionicModal.fromTemplateUrl('views/common/rates2.html', {    			 
    				scope: scope,
    				animation: 'none',
    				backdropClickToClose: false
    			}).then(function(modal) {
    				scope.appRateModel2 = modal;
  				});               

	            scope.showAppRateModelForNo = function() {
	               scope.appRateModel2.show();
	            }
              	
				scope.hideAppRateModelNo = function() {
					scope.appRateModel2.hide();
				}

				scope.popAsk1 = function () {
					$window.open("mailto:webextremeconcept@gmail.com", "_system");
				}

				element.on('tap', scope.showAppRateModel); 

 			}
		}
	})

	.directive('feedListingItem', function() {
	  	return {
	    	templateUrl: 'views/app/feeds/feed-listing-item.html'
	  	};
	})

	.directive('actionEnter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if (event.which === 13) {
	                scope.$apply(function () {
	                    scope.$eval(attrs.actionEnter, {
	                        'event': event
	                    });
	                });

	                event.preventDefault();
	            }
	        });
	    };
	})


	.directive('compile', ['$compile', function ($compile) {
	    return function(scope, element, attrs) {
	        var ensureCompileRunsOnce = scope.$watch(
	            function(scope) {
	            	// watch the 'compile' expression for changes
	              	return scope.$eval(attrs.compile);
	            },
	            function(value) {
	              	// when the 'compile' expression changes
	              	// assign it into the current DOM
	              element.html(value);

	              	// compile the new DOM and link it to the current
	              	// scope.
	              	// NOTE: we only compile .childNodes so that
	              	// we don't get into infinite loop compiling ourselves
	              	$compile(element.contents())(scope);
	                
	              	// Use Angular's un-watch feature to ensure compilation only happens once.
	              	ensureCompileRunsOnce();
	            }
	        );
	    };
	}])

	.directive('dynamicAnchorFix', function($timeout, $cordovaInAppBrowser){
		return {
			scope: {},
			link: function(scope, element, attrs) {
				$timeout(function(){
					var anchors = element.find('a');
					if(anchors.length > 0)
					{
						angular.forEach(anchors, function(a) {

							var anchor = angular.element(a);

							anchor.bind('click', function (event) {
								event.preventDefault();
								event.stopPropagation();

								//if (event.currentTarget.href != 'javascript:void(0)' && ConnectivityMonitorFactory.isOnline()) {
								if (event.currentTarget.href != 'javascript:void(0)') {
									var href = event.currentTarget.href;
									var	options = {};

									//inAppBrowser see documentation here: http://ngcordova.com/docs/plugins/inAppBrowser/

									$cordovaInAppBrowser.open(href, '_system', options)
										.then(function(e) {
											// success
										})
										.catch(function(e) {
											// error
										});
								}
							});

						});
					}
				}, 10);
			},
			restrict: 'A',
			replace: false,
			transclude: false
		};
	})

	.directive('headerHideDirective',function($ionicScrollDelegate,$rootScope){
		return {
			restrict: 'A',
			
			link: function(scope, element, attrs) {				
	     		var header = element[0].querySelector('.headerOfPage');
	     		var hasHeader = element[0].querySelector('.top-spacing');
	     		var searchBar = element[0].querySelector('.search-bar');	     		
	     		scope.hideHeader =function() {
	     			var moveData = $ionicScrollDelegate.$getByHandle('headerHideHandler').getScrollPosition();
			  		var lastTop = $rootScope.top  ||  {};
			  		scope.$apply(function() {
			     		if(angular.isDefined(moveData) && moveData.top > 150) {
			     			header.style.display = 'none';
			     			searchBar.style.display = 'none';
		     				hasHeader.style.top = 0; 
		     				scope.sttButton=true;
			     		}else {
			     			
			     			scope.sttButton=false;			     			
			     		}
			     		if(lastTop > moveData.top){
			     			header.style.display = 'block';
				        	searchBar.style.display = 'block';
			     			hasHeader.style.top = '44px';
			     		} 
			  			$rootScope.top = moveData.top;

			     	}); 		
	     		} 

	     		scope.hideDetailPageHeader =function() {
	     			var moveData = $ionicScrollDelegate.$getByHandle('detailPageHeaderHideHandler').getScrollPosition();
			  		var lastTopDetailPage = $rootScope.topDetailPage  ||  {};
			  		scope.$apply(function() {
			     		if(angular.isDefined(moveData) && moveData.top > 50) {
			     			header.style.display = 'none';
			     			hasHeader.style.top = 0; 
		     				scope.sttButton=true;
			     		}
			     		if(lastTopDetailPage > moveData.top){
			        		header.style.display = 'block';
			        		hasHeader.style.top = '44px';
		     				scope.sttButton=false;
			      		}
			      		$rootScope.topDetailPage = moveData.top;
			     	}); 		
	     		}       				     		     		
 			}
		}
	})

	.directive('headerPopover',function($ionicPopover, $state, feedsDAOService, $ionicLoading, $timeout){
		return {
			restrict: 'E',
			scope: {},
			template: '<button class="button button-icon button-clear ion-android-more-vertical" on-tap="headerPopover.show($event)"></button>',
			link: function(scope, element, attrs) {
				$ionicPopover.fromTemplateUrl('views/app/popover.html', {
    				scope: scope,
 				}).then(function(popover) {
	    			scope.headerPopover = popover;
	
	  			});

 			/**
			* show setting page
			*/
				scope.showSetting = function() {
					$state.go('app.settings');
				}
				scope.closePopover = function() {
    				scope.headerPopover.hide();
  				};

  				scope.destroyPostDB =function(){
  					$ionicLoading.show({
          				template: '<ion-spinner icon="android"></ion-spinner><p>Clearing Cache</p>'
        			});
        			$timeout(function() {
        				$ionicLoading.hide();
        			},3000);
					feedsDAOService.destroyPostsDBForClearChache().then(function(response){
					});
				}
 			}
		}
	})

	.directive('imagePathFix', function($rootScope, settingService, $timeout, ConnectivityMonitorFactory){
		return {
			scope: {},
			link: function(scope, element, attrs) {

				var isImageViewDisabled = settingService.getSettings().imageViewDisabled;

				$rootScope.$on('imageViewEnabled', function(ev, args) {
					isImageViewDisabled = args;
				});

				if (isImageViewDisabled || ConnectivityMonitorFactory.isOffline()) {
					var timer = $timeout(function(){
						var images = element.find('img');
						var href = element.find('img').parent();

						// update img parent link
						if (href.length > 0) {
							angular.forEach(href, function(val) {
								var temp = 'javascript:void(0)';
								if(val.href) val.href = temp;
							});
						}

						// update image path
						if(images.length > 0)
						{
							angular.forEach(images, function(val) {
								var temp = 'img/imgUnavailable.png';
								val.src = temp;
							});
						}
					}, 0, false);
				}

				// Unbind watch
				scope.$on('$destroy', function() {
					$timeout.cancel( timer );
				});
			},
			restrict: 'A',
			replace: false
		};
	})

