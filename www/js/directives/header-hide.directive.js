(function(){

	'use strict';

	/**
	* appRateDirective Directive function
	*/
	var headerHideDirective=function($ionicScrollDelegate,$rootScope) {		
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
			     		if(angular.isDefined(moveData) && moveData.top > 150) {
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
	}
	headerHideDirective.$inject=['$ionicScrollDelegate', '$rootScope'];
	angular
		.module('tatafo')
		.directive('headerHideDirective',headerHideDirective)

})();

