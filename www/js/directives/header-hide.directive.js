(function(){

	'use strict';

	/**
	* appRateDirective Directive function
	*/
	var headerHideDirective=function($ionicScrollDelegate) {		
		return {
			restrict: 'A',
			
			link: function(scope, element, attrs) {				
	     		var header = element[0].querySelector('.headerOfPage');
	     		var hasHeader = element[0].querySelector('.top-spacing');
	     		var searchBar = element[0].querySelector('.search-bar');	     		
	     		scope.hideHeader =function() {
	     			var moveData = $ionicScrollDelegate.$getByHandle('headerHideHandler').getScrollPosition();
			  		scope.$apply(function() {
			     		if(angular.isDefined(moveData) && moveData.top > 150) {
			     			header.style.display = 'none';
			     			searchBar.style.display = 'none';
		     				hasHeader.style.top = 0; 
		     				scope.sttButton=true;
			     		}else {

			        		header.style.display = 'block';
			        		searchBar.style.display = 'block';
		     				hasHeader.style.top = '44px';
		     				scope.sttButton=false;
				      		
			     		}
			     	}); 		
	     		} 

	     		scope.hideDetailPageHeader =function() {
	     			var moveData = $ionicScrollDelegate.$getByHandle('detailPageHeaderHideHandler').getScrollPosition();
			  		scope.$apply(function() {
			     		if(angular.isDefined(moveData) && moveData.top > 150) {
			     			header.style.display = 'none';
			     			hasHeader.style.top = 0; 
		     				scope.sttButton=true;
			     		}else {
			        		header.style.display = 'block';
			        		hasHeader.style.top = '44px';
		     				scope.sttButton=false;
			      		}
			     	}); 		
	     		}       				     		     		
 			}
		}
	}
	headerHideDirective.$inject=['$ionicScrollDelegate'];
	angular
		.module('tatafo')
		.directive('headerHideDirective',headerHideDirective)

})();

